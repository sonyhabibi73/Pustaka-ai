import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import { QuizClient } from "@/components/documents/quiz-client";

export default async function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  const [{ quizId }, session] = await Promise.all([params, auth()]);
  if (!session?.user?.id) redirect("/sign-in");
  const quiz = await prisma.quiz.findFirst({
    where: { id: quizId, document: { userId: session.user.id } },
    include: { questions: { orderBy: { position: "asc" } } },
  });
  if (!quiz) notFound();
  return (
    <AppShell userName={session.user.name ?? session.user.email ?? "Pengguna"}>
      <div className="mx-auto max-w-3xl p-5 sm:p-8">
        <p className="text-muted-foreground font-mono text-xs">KUIS</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{quiz.title}</h1>
        <QuizClient
          quizId={quiz.id}
          questions={quiz.questions.map((question) => ({
            id: question.id,
            prompt: question.prompt,
            options: question.options as string[],
          }))}
        />
      </div>
    </AppShell>
  );
}
