import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/security/authz";
import { apiError } from "@/lib/security/http";
import { enforceRateLimit } from "@/lib/security/rate-limit";

const schema = z.object({
  answers: z
    .array(
      z.object({ questionId: z.string().cuid(), selectedIndex: z.number().int().min(0).max(3) }),
    )
    .min(1)
    .max(100),
});

export async function POST(request: Request, { params }: { params: Promise<{ quizId: string }> }) {
  try {
    const userId = await requireUserId();
    await enforceRateLimit(`quiz:${userId}`, 20, "1 h");
    const [{ quizId }, input] = await Promise.all([params, request.json().then(schema.parse)]);
    const quiz = await prisma.quiz.findFirst({
      where: { id: quizId, document: { userId } },
      include: { questions: { select: { id: true, correctIndex: true, explanation: true } } },
    });
    if (!quiz) throw new Error("QUIZ_NOT_FOUND");
    const answersById = new Map(
      input.answers.map((answer) => [answer.questionId, answer.selectedIndex]),
    );
    if (
      answersById.size !== quiz.questions.length ||
      quiz.questions.some((question) => !answersById.has(question.id))
    )
      throw new Error("INVALID_QUIZ_ANSWERS");
    const results = quiz.questions.map((question) => ({
      questionId: question.id,
      isCorrect: answersById.get(question.id) === question.correctIndex,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
    }));
    const score = (results.filter((result) => result.isCorrect).length / results.length) * 100;
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        userId,
        score,
        submittedAt: new Date(),
        answers: {
          createMany: {
            data: results.map((result) => ({
              questionId: result.questionId,
              selectedIndex: answersById.get(result.questionId),
              isCorrect: result.isCorrect,
            })),
          },
        },
      },
    });
    return Response.json({ attemptId: attempt.id, score, results });
  } catch (error) {
    return apiError(error);
  }
}
