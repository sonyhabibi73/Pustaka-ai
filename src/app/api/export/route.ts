import { prisma, withDbRetry } from "@/lib/db";
import { requireUserId } from "@/lib/security/authz";
import { apiError } from "@/lib/security/http";
import { enforceRateLimit } from "@/lib/security/rate-limit";

/**
 * Ekspor data belajar milik pengguna sebagai berkas JSON (Pengaturan → Data).
 * Hanya mengembalikan baris milik `userId` yang sedang masuk.
 */
export async function GET() {
  try {
    const userId = await requireUserId();
    await enforceRateLimit(`export:${userId}`, 5, "1 h");

    const [profile, documents, flashcards, reviews, quizAttempts] = await withDbRetry(() =>
      Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: { name: true, email: true, createdAt: true },
        }),
        prisma.document.findMany({
          where: { userId },
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            title: true,
            kind: true,
            status: true,
            source: true,
            sourceUrl: true,
            createdAt: true,
          },
        }),
        prisma.flashcard.findMany({
          where: { userId },
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            documentId: true,
            front: true,
            back: true,
            dueAt: true,
            intervalDays: true,
            repetitions: true,
            lastReviewedAt: true,
            createdAt: true,
          },
        }),
        prisma.flashcardReview.findMany({
          where: { flashcard: { userId } },
          orderBy: { reviewedAt: "asc" },
          select: { flashcardId: true, grade: true, reviewedAt: true, intervalDays: true },
        }),
        prisma.quizAttempt.findMany({
          where: { userId },
          orderBy: { startedAt: "asc" },
          select: {
            id: true,
            quizId: true,
            score: true,
            startedAt: true,
            submittedAt: true,
            quiz: { select: { title: true } },
          },
        }),
      ]),
    );

    return new Response(
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          profile,
          documents,
          flashcards,
          reviews,
          quizAttempts,
        },
        null,
        2,
      ),
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": 'attachment; filename="pustaka-ai-eksport.json"',
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    return apiError(error);
  }
}
