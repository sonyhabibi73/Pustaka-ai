import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, FilePlus2, Files, Layers3 } from "lucide-react";
import { redirect } from "next/navigation";

import { UploadForm } from "@/components/documents/upload-form";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { prisma, withDbRetry } from "@/lib/db";
import { documentStatusLabel } from "@/lib/documents/labels";
import { studyStreak } from "@/lib/study/streak";
import { getSession } from "@/lib/security/authz";
import { cn, formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/sign-in");
  const userId = session.user.id;

  // Badge sidebar dikirim lebih dulu supaya skeleton di bawah tidak
  // menggoyang tata letak navigasi.
  const dueCards = await withDbRetry(() =>
    prisma.flashcard.count({ where: { userId, dueAt: { lte: new Date() } } }),
  );

  return (
    <AppShell dueCount={dueCards} userName={session.user.name ?? session.user.email ?? "Pengguna"}>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardBody dueCards={dueCards} userId={userId} />
      </Suspense>
    </AppShell>
  );
}

/** Skeleton mengikuti bentuk halaman asli (spesifikasi: "skeleton loading"). */
function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8" role="status">
      <span className="sr-only">Memuat workspace…</span>
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-4 h-9 w-full max-w-xl" />
      <Skeleton className="mt-3 h-4 w-full max-w-md" />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[0, 1, 2, 3].map((index) => (
          <Skeleton className="h-28" key={index} />
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Skeleton className="h-96 w-full" />
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}

async function DashboardBody({ dueCards, userId }: { dueCards: number; userId: string }) {
  const now = new Date();
  const cutoff = new Date(now.getTime() - 30 * 86_400_000);

  const [documents, totalDocs, mastered, reviews] = await withDbRetry(() =>
    Promise.all([
      prisma.document.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        take: 20,
        select: { id: true, title: true, kind: true, status: true, updatedAt: true },
      }),
      prisma.document.count({ where: { userId } }),
      prisma.flashcard.count({ where: { userId, intervalDays: { gte: 7 } } }),
      prisma.flashcardReview.findMany({
        where: { flashcard: { userId }, reviewedAt: { gte: cutoff } },
        select: { reviewedAt: true },
      }),
    ]),
  );

  const streak = studyStreak(
    reviews.map((review) => review.reviewedAt),
    now,
  );

  const stats = [
    { label: "Materi", value: totalDocs, hint: "sumber yang sudah diunggah" },
    { label: "Jatuh tempo", value: dueCards, hint: "kartu siap diulas hari ini" },
    {
      label: "Streak",
      value: streak,
      hint: streak ? "hari berturut-turut" : "mulai ulangan hari ini",
      accent: true,
    },
    { label: "Dikuasai", value: mastered, hint: "jarak ulangan ≥ 1 minggu" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <header className="border-line border-b pb-6">
        <p className="text-muted-foreground font-mono text-xs font-semibold tracking-[0.14em]">
          WORKSPACE
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Belajar dari sumber yang <span className="text-brand">kamu percaya</span>.
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
          Ringkasan, flashcard, dan kuis dibuat otomatis dari dokumenmu sendiri—PDF, DOCX, TXT, atau
          video YouTube.
        </p>
      </header>

      <dl className="border-line bg-line mt-8 grid grid-cols-2 gap-px border sm:grid-cols-4">
        {stats.map((stat) => (
          <div className="bg-background px-4 py-5" key={stat.label}>
            <dt className="text-muted-foreground font-mono text-[11px] font-semibold tracking-[0.14em] uppercase">
              {stat.label}
            </dt>
            <dd
              className={cn(
                "font-mono text-3xl font-bold tabular-nums",
                stat.accent && "text-amber-700 dark:text-amber-500",
              )}
            >
              {stat.value}
              {stat.accent && stat.value ? (
                <span className="ml-1 text-sm font-semibold">hari</span>
              ) : null}
            </dd>
            <p className="text-muted-foreground mt-1 text-xs">{stat.hint}</p>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="min-w-0" id="materi">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Materi terbaru</CardTitle>
                <Files className="text-muted-foreground size-5" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              {documents.length ? (
                <ul className="divide-line divide-y">
                  {documents.map((document) => (
                    <li key={document.id}>
                      <Link
                        className="hover:bg-muted focus-visible:ring-ring flex items-center justify-between gap-4 px-2 py-4 outline-none focus-visible:ring-2"
                        href={`/documents/${document.id}`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-bold">{document.title}</span>
                          <span className="text-muted-foreground mt-1 block font-mono text-xs">
                            {document.kind} · {formatDate(document.updatedAt)}
                          </span>
                        </span>
                        <Badge variant={document.status === "READY" ? "brand" : "muted"}>
                          {documentStatusLabel(document.status)}
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  icon={FilePlus2}
                  title="Belum ada materi"
                  description="Unggah satu sumber—PDF, DOCX, TXT, atau link YouTube—untuk membuat ruang belajar pertamamu."
                />
              )}
            </CardContent>
          </Card>
        </section>

        <aside className="min-w-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tambahkan materi</CardTitle>
            </CardHeader>
            <CardContent>
              <UploadForm />
            </CardContent>
          </Card>

          <Card className="bg-highlight text-ink">
            <CardContent>
              <span className="border-line bg-surface inline-flex size-10 items-center justify-center rounded-sm border">
                <Layers3 className="size-5" aria-hidden="true" />
              </span>
              <p className="font-mono text-4xl font-bold tabular-nums">{dueCards}</p>
              <p className="mt-1 text-sm font-semibold">
                kartu jatuh tempo hari ini—sepuluh menit sudah cukup.
              </p>
              <Button asChild className="mt-5 w-full" variant="secondary">
                <Link href="/belajar">
                  {dueCards ? "Mulai ulangan" : "Buka ulangan"}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
