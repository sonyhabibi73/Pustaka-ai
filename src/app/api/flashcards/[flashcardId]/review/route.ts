import { z } from "zod";
import { prisma } from "@/lib/db";
import { calculateNextReview } from "@/lib/study/spaced-repetition";
import { requireUserId } from "@/lib/security/authz";
import { apiError } from "@/lib/security/http";
import { enforceRateLimit } from "@/lib/security/rate-limit";

const schema = z.object({ grade: z.enum(["AGAIN", "HARD", "GOOD", "EASY"]) });

export async function POST(
  request: Request,
  { params }: { params: Promise<{ flashcardId: string }> },
) {
  try {
    const userId = await requireUserId();
    await enforceRateLimit(`review:${userId}`, 120, "1 m");
    const [{ flashcardId }, input] = await Promise.all([params, request.json().then(schema.parse)]);
    const card = await prisma.flashcard.findFirst({ where: { id: flashcardId, userId } });
    if (!card) throw new Error("FLASHCARD_NOT_FOUND");
    const next = calculateNextReview(
      {
        repetitions: card.repetitions,
        intervalDays: card.intervalDays,
        easeFactor: Number(card.easeFactor),
      },
      input.grade,
    );
    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.flashcard.update({
        where: { id: card.id },
        data: { ...next, lastReviewedAt: new Date() },
      });
      await tx.flashcardReview.create({
        data: {
          flashcardId: card.id,
          grade: input.grade,
          intervalDays: next.intervalDays,
          easeFactor: next.easeFactor,
        },
      });
      return result;
    });
    return Response.json({ dueAt: updated.dueAt, intervalDays: updated.intervalDays });
  } catch (error) {
    return apiError(error);
  }
}
