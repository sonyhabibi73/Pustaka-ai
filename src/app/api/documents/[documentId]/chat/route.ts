import { embed, streamText } from "ai";
import { z } from "zod";
import { generationModel, embeddingModel, embeddingProviderOptions } from "@/lib/ai/models";
import { groundedChatPrompt, NOT_FOUND_RESPONSE } from "@/lib/ai/prompts";
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
    const { embedding } = await embed({
      model: embeddingModel,
      value: input.message,
      providerOptions: embeddingProviderOptions,
    });
    const chunks = await retrieveNearestChunks(documentId, embedding);
    const strongMatches = chunks.filter((chunk) => chunk.distance <= 0.5);
    await prisma.chatMessage.create({
      data: { threadId: thread.id, role: "USER", content: input.message },
    });
    if (!strongMatches.length) {
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
      prompt: groundedChatPrompt(
        strongMatches.map((chunk) => `[${chunk.id}] ${chunk.content}`).join("\n\n"),
        input.message,
      ),
      maxOutputTokens: 1000,
    });
    const response = await result.text;
    const assistant = await prisma.chatMessage.create({
      data: {
        threadId: thread.id,
        role: "ASSISTANT",
        content: response,
        model: "gemini-3.5-flash-lite",
        sources: {
          createMany: { data: strongMatches.map((chunk, rank) => ({ chunkId: chunk.id, rank })) },
        },
      },
    });
    return Response.json({
      threadId: thread.id,
      messageId: assistant.id,
      answer: response,
      citations: strongMatches.map((chunk) => ({
        chunkId: chunk.id,
        chunkIndex: chunk.chunkIndex,
      })),
    });
  } catch (error) {
    return apiError(error);
  }
}
