import Link from "next/link";
import { FilePlus2, TriangleAlert } from "lucide-react";
import { BookOpenCheck, Layers3, ListChecks, MessagesSquare, Quote } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/security/authz";
import { prisma } from "@/lib/db";
import { Markdown } from "@/components/ui/markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RetryDocumentButton } from "@/components/documents/retry-document-button";
import { processingErrorMessage, processingStageLabel } from "@/lib/documents/labels";

const STAGE_ORDER = ["TEXT_EXTRACTION", "CHUNKING", "EMBEDDING", "ARTIFACT_GENERATION"] as const;

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  const session = await getSession();
  if (!session?.user?.id) redirect("/sign-in");

  const document = await prisma.document.findFirst({
    where: { id: documentId, userId: session.user.id },
    select: {
      id: true,
      status: true,
      summaryMarkdown: true,
      processingError: true,
      processingErrorCode: true,
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
                        "size-3 shrink-0 rounded-full border-2",
                        done
                          ? "border-ink bg-mint"
                          : current
                            ? "border-ink bg-highlight"
                            : "border-line bg-muted",
                      ].join(" ")}
                    />
                    <span
                      className={
                        done || current ? "text-foreground font-semibold" : "text-muted-foreground"
                      }
                    >
                      {processingStageLabel(stage)}
                    </span>
                    <span className="text-muted-foreground ml-auto font-mono text-xs">
                      {done ? "selesai" : current ? "berjalan" : "menunggu"}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className="border-line bg-muted mt-5 rounded-sm border-2 p-4">
              <p className="text-sm font-semibold">Perkiraan selesai: 30 detik sampai 2 menit.</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Kamu boleh menutup halaman ini—ringkasan, flashcard, dan kuis akan menunggu di
                workspace.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {document.status === "FAILED" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <TriangleAlert className="size-4" aria-hidden="true" />
              Materi gagal diproses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">
              {processingErrorMessage(document.processingErrorCode)}
            </p>
            {document.processingError ? (
              <details className="border-line bg-muted rounded-sm border-2 p-3">
                <summary className="cursor-pointer font-mono text-xs font-bold">
                  Detail teknis
                </summary>
                <p className="text-muted-foreground mt-2 font-mono text-xs break-words">
                  {document.processingError}
                </p>
              </details>
            ) : null}
            <div className="flex flex-wrap items-center gap-3">
              <RetryDocumentButton documentId={document.id} />
              <Button asChild variant="secondary">
                <Link href="/dashboard">
                  <FilePlus2 className="size-4" aria-hidden="true" />
                  Unggah sumber lain
                </Link>
              </Button>
            </div>
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
                <p className="font-mono text-3xl font-bold tabular-nums">
                  {document._count.chunks}
                </p>
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
                <p className="font-mono text-3xl font-bold tabular-nums">{totalCards}</p>
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
                <p className="font-mono text-3xl font-bold tabular-nums">
                  {quiz?._count.questions ?? 0}
                </p>
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
            <Badge variant="highlight">Siap</Badge>
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
