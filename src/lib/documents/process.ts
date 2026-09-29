import "server-only";
import { createHash } from "node:crypto";
import { embedMany } from "ai";
import { prisma } from "@/lib/db";
import { embeddingModel, embeddingProviderOptions } from "@/lib/ai/models";
import { createFlashcards, createQuiz, summarizeDocument } from "@/lib/ai/artifacts";
import { chunkText } from "@/lib/documents/chunk";
import { extractTextFromFile, extractYouTubeTranscript } from "@/lib/documents/extract";
import { downloadPrivateFile } from "@/lib/documents/storage";
import { validateYouTubeUrl } from "@/lib/documents/validation";
import { saveEmbedding } from "@/lib/ai/vector-store";

async function runStage(
  documentId: string,
  stage: "TEXT_EXTRACTION" | "CHUNKING" | "EMBEDDING" | "ARTIFACT_GENERATION",
  work: () => Promise<void>,
) {
  const idempotencyKey = createHash("sha256").update(`${documentId}:${stage}`).digest("hex");
  await prisma.documentProcessingJob.upsert({
    where: { idempotencyKey },
    create: { documentId, stage, idempotencyKey, status: "RUNNING", startedAt: new Date() },
    update: {
      status: "RUNNING",
      attempt: { increment: 1 },
      startedAt: new Date(),
      errorCode: null,
      errorDetail: null,
    },
  });
  try {
    await work();
    await prisma.documentProcessingJob.update({
      where: { idempotencyKey },
      data: { status: "COMPLETED", completedAt: new Date() },
    });
  } catch (error) {
    await prisma.documentProcessingJob.update({
      where: { idempotencyKey },
      data: {
        status: "FAILED",
        completedAt: new Date(),
        errorCode: "PROCESSING_FAILED",
        errorDetail: error instanceof Error ? error.message.slice(0, 1000) : "Unknown error",
      },
    });
    throw error;
  }
}

export async function processDocument(documentId: string) {
  const document = await prisma.document.findUnique({ where: { id: documentId } });
  if (!document || document.status === "READY") return;
  await prisma.document.update({
    where: { id: documentId },
    data: { status: "PROCESSING", processingError: null, processingErrorCode: null },
  });
  try {
    let text = "";
    await runStage(documentId, "TEXT_EXTRACTION", async () => {
      text =
        document.source === "YOUTUBE"
          ? await extractYouTubeTranscript(validateYouTubeUrl(document.sourceUrl!).videoId)
          : await extractTextFromFile(
              await downloadPrivateFile(document.storageKey!),
              document.mimeType!,
            );
      if (!text) throw new Error("DOCUMENT_HAS_NO_EXTRACTABLE_TEXT");
      await prisma.document.update({ where: { id: documentId }, data: { extractedText: text } });
    });
    const chunks = chunkText(text);
    await runStage(documentId, "CHUNKING", async () => {
      await prisma.documentChunk.deleteMany({ where: { documentId } });
      await prisma.documentChunk.createMany({
        data: chunks.map((chunk) => ({ ...chunk, documentId, metadata: {} })),
      });
    });
    const savedChunks = await prisma.documentChunk.findMany({
      where: { documentId },
      orderBy: { chunkIndex: "asc" },
      select: { id: true, content: true, chunkIndex: true },
    });
    await runStage(documentId, "EMBEDDING", async () => {
      const { embeddings } = await embedMany({
        model: embeddingModel,
        values: savedChunks.map((chunk) => chunk.content),
        providerOptions: embeddingProviderOptions,
      });
      await Promise.all(
        savedChunks.map((chunk, index) => saveEmbedding(chunk.id, embeddings[index])),
      );
    });
    await runStage(documentId, "ARTIFACT_GENERATION", async () => {
      const context = savedChunks
        .map((chunk) => `[chunk ${chunk.chunkIndex}] ${chunk.content}`)
        .join("\n\n");
      const [summary, cards, questions] = await Promise.all([
        summarizeDocument(text, document.title),
        createFlashcards(context, document.title),
        createQuiz(context, document.title),
      ]);
      const byIndex = new Map(savedChunks.map((chunk) => [chunk.chunkIndex, chunk.id]));
      await prisma.$transaction(async (tx) => {
        await tx.flashcard.deleteMany({ where: { documentId } });
        await tx.quiz.deleteMany({ where: { documentId } });
        await tx.document.update({
          where: { id: documentId },
          data: { summaryMarkdown: summary, summaryGeneratedAt: new Date() },
        });
        await tx.flashcard.createMany({
          data: cards.map((card) => ({
            userId: document.userId,
            documentId,
            front: card.front,
            back: card.back,
            sourceChunkIds: card.chunkIndexes.flatMap((index) => byIndex.get(index) ?? []),
          })),
        });
        const quiz = await tx.quiz.create({
          data: { documentId, title: `Kuis · ${document.title}`, status: "PUBLISHED" },
        });
        for (const [position, question] of questions.entries()) {
          const created = await tx.quizQuestion.create({
            data: {
              quizId: quiz.id,
              position,
              prompt: question.prompt,
              options: question.options,
              correctIndex: question.correctIndex,
              explanation: question.explanation,
              difficulty: question.difficulty,
            },
          });
          await tx.quizQuestionSource.createMany({
            data: question.chunkIndexes.flatMap((index) => {
              const chunkId = byIndex.get(index);
              return chunkId ? [{ questionId: created.id, chunkId }] : [];
            }),
          });
        }
      });
    });
    await prisma.document.update({ where: { id: documentId }, data: { status: "READY" } });
  } catch (error) {
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "FAILED",
        processingErrorCode: "PROCESSING_FAILED",
        processingError: error instanceof Error ? error.message.slice(0, 1000) : "Unknown error",
      },
    });
    throw error;
  }
}
