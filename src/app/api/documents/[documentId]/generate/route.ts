import { createFlashcards, createQuiz } from "@/lib/ai/artifacts";
import { prisma } from "@/lib/db";
import { getOwnedDocument, requireUserId } from "@/lib/security/authz";
import { apiError } from "@/lib/security/http";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

export async function POST(_: Request, { params }: { params: Promise<{ documentId: string }> }) {
  try {
    const userId = await requireUserId();
    await enforceRateLimit(`generate:${userId}`, 10, "1 h");
    const { documentId } = await params;
    const document = await getOwnedDocument(documentId, userId);
    if (!document || document.status !== "READY")
      throw new Error("DOCUMENT_NOT_READY_OR_NOT_FOUND");
    const chunks = await prisma.documentChunk.findMany({
      where: { documentId },
      select: { id: true, chunkIndex: true, content: true },
      orderBy: { chunkIndex: "asc" },
    });
    const context = chunks
      .map((chunk) => `[chunk ${chunk.chunkIndex}] ${chunk.content}`)
      .join("\n\n");
    const [cards, questions] = await Promise.all([
      createFlashcards(context, document.title),
      createQuiz(context, document.title),
    ]);
    const byIndex = new Map(chunks.map((chunk) => [chunk.chunkIndex, chunk.id]));
    await prisma.$transaction(
      async (tx) => {
        await tx.flashcard.deleteMany({ where: { documentId } });
        await tx.quiz.deleteMany({ where: { documentId } });
        await tx.flashcard.createMany({
          data: cards.map((card) => ({
            userId,
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
          const sources = question.chunkIndexes.flatMap((index) => {
            const chunkId = byIndex.get(index);
            return chunkId ? [{ questionId: created.id, chunkId }] : [];
          });
          if (sources.length) await tx.quizQuestionSource.createMany({ data: sources });
        }
      },
      // Bawaan Prisma 5 detik terlalu sempit untuk puluhan query kecil dengan
      // latensi database beberapa ratus milidetik.
      { timeout: 60_000, maxWait: 15_000 },
    );
    return Response.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
