import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/security/authz";
import { prisma } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import { QuizClient } from "@/components/documents/quiz-client";
import { countDueCards } from "@/lib/study/due";

export default async function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  const [{ quizId }, session] = await Promise.all([params, getSession()]);
  if (!session?.user?.id) redirect("/sign-in");
  const [quiz, dueCount] = await Promise.all([
    prisma.quiz.findFirst({
      where: { id: quizId, document: { userId: session.user.id } },
      include: { questions: { orderBy: { position: "asc" } } },
    }),
    countDueCards(session.user.id),
  ]);
  if (!quiz) notFound();
  return (
    <AppShell dueCount={dueCount} userName={session.user.name ?? session.user.email ?? "Pengguna"}>
      <div className="mx-auto max-w-3xl p-5 sm:p-8">
        <Link
          className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center gap-2 text-sm"
          href={`/documents/${quiz.documentId}`}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Kembali ke materi
        </Link>
        <p className="text-muted-foreground mt-5 font-mono text-xs font-semibold tracking-[0.14em] uppercase">
          Kuis · {quiz.questions.length} soal
        </p>
        <h1 className="text-h1 mt-3 font-extrabold">{quiz.title}</h1>
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
