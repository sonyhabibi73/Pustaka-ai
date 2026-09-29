import { embed, streamText } from "ai";
import { z } from "zod";
import {
  GENERATION_MODEL_ID,
  embeddingModel,
  embeddingProviderOptions,
  generationModel,
} from "@/lib/ai/models";
import { NOT_FOUND_RESPONSE, SOURCE_MARKER, groundedChatPrompt } from "@/lib/ai/prompts";
import { excerptOf } from "@/lib/ai/excerpt";
import { retrieveNearestChunks } from "@/lib/ai/vector-store";
import { prisma } from "@/lib/db";
import { getOwnedDocument, requireUserId } from "@/lib/security/authz";
import { apiError } from "@/lib/security/http";
import { enforceRateLimit } from "@/lib/security/rate-limit";

const schema = z.object({
  threadId: z.string().cuid().optional(),
  message: z.string().trim().min(1).max(4_000),
});
export const runtime = "nodejs";

type RetrievedChunk = { id: string; content: string; chunkIndex: number; distance: number };
type Citation = { chunkId: string; chunkIndex: number; excerpt: string };

const MARKER_PATTERN = new RegExp(`(^|\\n)${SOURCE_MARKER}\\s*([0-9,\\s\\[\\]]*)`);

function toCitation(chunk: RetrievedChunk): Citation {
  return { chunkId: chunk.id, chunkIndex: chunk.chunkIndex, excerpt: excerptOf(chunk.content) };
}

/**
 * Model mengakhiri jawaban dengan `SUMBER: 1,3`. Baris itu dipotong dari isi
 * pesan, dan hanya potongan yang benar-benar dipakai yang disimpan sebagai
 * sitasi — bukan seluruh hasil pencarian vektor.
 */
function parseAnswer(raw: string, chunks: RetrievedChunk[]) {
  const match = MARKER_PATTERN.exec(raw);
  const answer = (match ? raw.slice(0, match.index) : raw).replace(/\s+$/, "").trim();
  if (!answer || answer.includes(NOT_FOUND_RESPONSE)) {
    return { answer: answer || NOT_FOUND_RESPONSE, citations: [] as Citation[] };
  }
  if (!match) {
    return { answer, citations: chunks.slice(0, 3).map(toCitation) };
  }
  const numbers = [
    ...new Set(
      (match[2] ?? "")
        .split(/[,\s]+/)
        .map((value) => Number.parseInt(value.replace(/[[\]]/g, ""), 10))
        .filter((value) => Number.isInteger(value) && value >= 1 && value <= chunks.length),
    ),
  ];
  return { answer, citations: numbers.map((value) => toCitation(chunks[value - 1])) };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ documentId: string }> },
) {
  try {
    const userId = await requireUserId();
    await enforceRateLimit(`chat:${userId}`, 30, "1 m");
    const { documentId } = await params;
    const document = await getOwnedDocument(documentId, userId);
    if (!document || document.status !== "READY")
      throw new Error("DOCUMENT_NOT_READY_OR_NOT_FOUND");
    const input = schema.parse(await request.json());
    const thread = input.threadId
      ? await prisma.chatThread.findFirst({ where: { id: input.threadId, userId, documentId } })
      : await prisma.chatThread.create({
          data: { userId, documentId, title: input.message.slice(0, 80) },
        });
    if (!thread) throw new Error("THREAD_NOT_FOUND");

    const previous = await prisma.chatMessage.findMany({
      where: { threadId: thread.id },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { role: true, content: true },
    });
    const history = previous.reverse().map((row) => ({
      role: row.role === "USER" ? ("user" as const) : ("assistant" as const),
      content: row.content,
    }));

    await prisma.chatMessage.create({
      data: { threadId: thread.id, role: "USER", content: input.message },
    });

    const { embedding } = await embed({
      model: embeddingModel,
      value: input.message,
      providerOptions: embeddingProviderOptions,
    });

    // Tidak ada ambang jarak lagi: dengan embedding Gemini rentang jarak dokumen
    // relevan dan tidak relevan tumpang tindih (terukur 0.478–0.558), jadi
    // penyaringannya diserahkan ke model lewat konteks berlabel.
    const chunks = await retrieveNearestChunks(documentId, embedding);
    if (!chunks.length) {
      const assistant = await prisma.chatMessage.create({
        data: {
          threadId: thread.id,
          role: "ASSISTANT",
          content: NOT_FOUND_RESPONSE,
          model: "policy",
        },
      });
      return Response.json({
        threadId: thread.id,
        messageId: assistant.id,
        answer: NOT_FOUND_RESPONSE,
        citations: [],
      });
    }

    const result = streamText({
      model: generationModel,
      prompt: groundedChatPrompt({
        title: document.title,
        context: chunks.map((chunk, index) => `[${index + 1}] ${chunk.content}`).join("\n\n"),
        history,
        question: input.message,
      }),
      maxOutputTokens: 1000,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        let raw = "";
        try {
          for await (const delta of result.textStream) {
            raw += delta;
            controller.enqueue(encoder.encode(delta));
          }
          const { answer, citations } = parseAnswer(raw, chunks);
          const assistant = await prisma.chatMessage.create({
            data: {
              threadId: thread.id,
              role: "ASSISTANT",
              content: answer,
              model: GENERATION_MODEL_ID,
              sources: {
                createMany: {
                  data: citations.map((citation, rank) => ({
                    chunkId: citation.chunkId,
                    rank,
                  })),
                },
              },
            },
          });
          controller.enqueue(
            encoder.encode(
              `\n@@META@@${JSON.stringify({
                threadId: thread.id,
                messageId: assistant.id,
                citations,
              })}`,
            ),
          );
        } catch (error) {
          controller.enqueue(
            encoder.encode(
              `\n@@META@@${JSON.stringify({
                threadId: thread.id,
                error: error instanceof Error ? error.message : "Jawaban tidak dapat dibuat.",
              })}`,
            ),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { "content-type": "text/plain; charset=utf-8", "x-thread-id": thread.id },
    });
  } catch (error) {
    return apiError(error);
  }
}
