import Link from "next/link";
import { BookOpenCheck, Layers3, ListChecks, MessagesSquare, Quote } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Markdown } from "@/components/ui/markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { processingStageLabel } from "@/lib/documents/labels";

const STAGE_ORDER = ["TEXT_EXTRACTION", "CHUNKING", "EMBEDDING", "ARTIFACT_GENERATION"] as const;

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const document = await prisma.document.findFirst({
    where: { id: documentId, userId: session.user.id },
    select: {
      id: true,
      status: true,
      summaryMarkdown: true,
      processingError: true,
      _count: { select: { chunks: true } },
      flashcards: { select: { dueAt: true } },
      quizzes: {
        select: { id: true, _count: { select: { questions: true } } },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      processingJobs: { select: { stage: true, status: true } },
    },
  });
  if (!document) notFound();

  const now = new Date();
  const totalCards = document.flashcards.length;
  const dueCards = document.flashcards.filter((card) => card.dueAt <= now).length;
  const quiz = document.quizzes[0] ?? null;
  const failedStages = new Set(
    document.processingJobs
      .filter((job) => job.status === "FAILED")
      .map((job) => job.stage as string),
  );
  const runningStage =
    document.processingJobs.find((job) => job.status === "RUNNING")?.stage ?? null;

  return (
    <>
      {document.status === "PROCESSING" || document.status === "UPLOADED" ? (
        <Card>
          <CardHeader>
            <CardTitle>Materi sedang diproses</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {STAGE_ORDER.map((stage) => {
                const done =
                  !failedStages.has(stage) &&
                  document.processingJobs.some(
                    (job) => job.stage === stage && job.status === "COMPLETED",
                  );
                const current = runningStage === stage;
                return (
                  <li className="flex items-center gap-3 text-sm" key={stage}>
                    <span
                      aria-hidden="true"
                      className={[
                        "size-2 shrink-0 rounded-full",
                        done ? "bg-foreground" : current ? "bg-accent" : "bg-border",
                      ].join(" ")}
                    />
                    <span className={done || current ? "text-foreground" : "text-muted-foreground"}>
                      {processingStageLabel(stage)}
                    </span>
                    <span className="text-muted-foreground ml-auto font-mono text-xs">
                      {done ? "selesai" : current ? "berjalan" : "menunggu"}
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="text-muted-foreground mt-5 text-sm">
              Ringkasan, sumber, flashcard, dan kuis sedang dibuat. Muat ulang halaman ini untuk
              memperbarui.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {document.status === "FAILED" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Materi gagal diproses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              {document.processingError ??
                "Coba unggah ulang file atau gunakan materi dengan teks yang dapat diekstrak."}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {document.status === "READY" ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpenCheck className="size-4" aria-hidden="true" />
                Ringkasan konteks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {document.summaryMarkdown ? (
                <Markdown markdown={document.summaryMarkdown} />
              ) : (
                <p className="text-muted-foreground">Ringkasan belum tersedia.</p>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-5 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Quote className="size-4" aria-hidden="true" />
                  Sumber
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold tabular-nums">{document._count.chunks}</p>
                <p className="text-muted-foreground text-sm">bagian dokumen</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Layers3 className="size-4" aria-hidden="true" />
                  Flashcard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold tabular-nums">{totalCards}</p>
                <p className="text-muted-foreground text-sm">
                  kartu{dueCards ? ` · ${dueCards} perlu diulang` : ""}
                </p>
                <Button asChild className="mt-4" size="sm" variant="outline">
                  <Link href={`/documents/${document.id}/flashcard`}>Latih sekarang</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ListChecks className="size-4" aria-hidden="true" />
                  Kuis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold tabular-nums">{quiz?._count.questions ?? 0}</p>
                <p className="text-muted-foreground text-sm">soal siap dikerjakan</p>
                {quiz ? (
                  <Button asChild className="mt-4" size="sm" variant="outline">
                    <Link href={`/quizzes/${quiz.id}`}>Mulai kuis</Link>
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/documents/${document.id}/tanya`}>
                <MessagesSquare className="size-4" aria-hidden="true" />
                Tanya materi
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/documents/${document.id}/flashcard`}>
                <Layers3 className="size-4" aria-hidden="true" />
                {dueCards ? `Ulangi ${dueCards} kartu` : "Lihat flashcard"}
              </Link>
            </Button>
            {quiz ? (
              <Button asChild variant="outline">
                <Link href={`/quizzes/${quiz.id}`}>
                  <ListChecks className="size-4" aria-hidden="true" />
                  Kerjakan kuis
                </Link>
              </Button>
            ) : null}
          </div>

          <p className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
            <Badge className="bg-secondary">Siap</Badge>
            <span className="font-mono">
              {dueCards > 0
                ? `${dueCards} kartu jatuh tempo hari ini`
                : "tidak ada kartu jatuh tempo"}
            </span>
          </p>
        </div>
      ) : null}
    </>
  );
}
