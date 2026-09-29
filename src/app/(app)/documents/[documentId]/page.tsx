import Link from "next/link";
import { ArrowLeft, BookOpenCheck, Layers3, ListChecks } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import { ChatPanel } from "@/components/chat/chat-panel";
import { FlashcardReview } from "@/components/documents/flashcard-review";
import { MarkdownSummary } from "@/components/documents/markdown-summary";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const [{ documentId }, session] = await Promise.all([params, auth()]);
  if (!session?.user?.id) redirect("/sign-in");
  const document = await prisma.document.findFirst({
    where: { id: documentId, userId: session.user.id },
    include: {
      flashcards: { orderBy: { dueAt: "asc" }, take: 3 },
      quizzes: { include: { _count: { select: { questions: true } } }, take: 1 },
    },
  });
  if (!document) notFound();
  return (
    <AppShell userName={session.user.name ?? session.user.email ?? "Pengguna"}>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <Link
          className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center gap-2 text-sm"
          href="/dashboard"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Kembali ke workspace
        </Link>
        <header className="border-border mt-7 flex flex-wrap items-start justify-between gap-4 border-b pb-7">
          <div>
            <p className="text-muted-foreground font-mono text-xs">
              {document.kind} · {formatDate(document.createdAt)}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{document.title}</h1>
          </div>
          <Badge className={document.status === "READY" ? "bg-secondary" : "text-muted-foreground"}>
            {document.status}
          </Badge>
        </header>
        {document.status === "PROCESSING" || document.status === "UPLOADED" ? (
          <div className="py-16">
            <p className="font-medium">Materi sedang diproses.</p>
            <p className="text-muted-foreground mt-2">
              Halaman ini siap setelah teks, sumber, dan latihan dibuat.
            </p>
          </div>
        ) : null}
        {document.status === "FAILED" ? (
          <div className="py-16">
            <p className="text-destructive font-medium">Materi gagal diproses.</p>
            <p className="text-muted-foreground mt-2">
              {document.processingError ??
                "Coba unggah ulang file atau gunakan materi dengan teks yang dapat diekstrak."}
            </p>
          </div>
        ) : null}
        {document.status === "READY" ? (
          <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_26rem]">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpenCheck className="size-4" aria-hidden="true" />
                    Ringkasan konteks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {document.summaryMarkdown ? (
                    <MarkdownSummary markdown={document.summaryMarkdown} />
                  ) : (
                    <p className="text-muted-foreground">Ringkasan belum tersedia.</p>
                  )}
                </CardContent>
              </Card>
              <div className="grid gap-5 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers3 className="size-4" aria-hidden="true" />
                      Flashcard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {document.flashcards.length ? (
                      <FlashcardReview
                        cards={document.flashcards.map((card) => ({
                          id: card.id,
                          front: card.front,
                          back: card.back,
                        }))}
                      />
                    ) : (
                      <p className="text-muted-foreground text-sm">Belum ada kartu.</p>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ListChecks className="size-4" aria-hidden="true" />
                      Kuis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {document.quizzes[0] ? (
                      <>
                        <p className="text-2xl font-semibold tabular-nums">
                          {document.quizzes[0]._count.questions}
                        </p>
                        <p className="text-muted-foreground text-sm">soal siap dikerjakan</p>
                        <Link
                          className="mt-4 inline-block text-sm font-semibold underline underline-offset-4"
                          href={`/quizzes/${document.quizzes[0].id}`}
                        >
                          Mulai kuis
                        </Link>
                      </>
                    ) : (
                      <p className="text-muted-foreground text-sm">Belum ada kuis.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
            <ChatPanel documentId={document.id} />
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
