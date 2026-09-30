import Link from "next/link";
import { ArrowRight, BarChart3, Layers3 } from "lucide-react";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma, withDbRetry } from "@/lib/db";
import { getSession } from "@/lib/security/authz";
import { CARD_GRADES, gradeTotals, reviewBuckets, type CardGrade } from "@/lib/study/stats";
import { studyStreak } from "@/lib/study/streak";
import { cn, formatDate } from "@/lib/utils";

const DAY_MS = 86_400_000;

/** Label + warna batang per nilai ulangan (urutan dari paling berat). */
const gradeStyle: Record<CardGrade, { label: string; bar: string }> = {
  AGAIN: { label: "Ulangi lagi", bar: "bg-muted-foreground/60" },
  HARD: { label: "Sulit", bar: "bg-amber-500" },
  GOOD: { label: "Bagus", bar: "bg-primary" },
  EASY: { label: "Mudah", bar: "bg-primary" },
};

/**
 * Statistik belajar: semuanya dihitung dari data milik pengguna sendiri
 * (FlashcardReview untuk ulangan, QuizAttempt untuk kuis) — tanpa angka
 * karangan dan tanpa grafik yang butuh library ekstra.
 */
export default async function StatistikPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/sign-in");
  const userId = session.user.id;

  const dueCards = await withDbRetry(() =>
    prisma.flashcard.count({ where: { userId, dueAt: { lte: new Date() } } }),
  );

  return (
    <AppShell dueCount={dueCards} userName={session.user.name ?? session.user.email ?? "Pengguna"}>
      <StatistikBody userId={userId} dueCards={dueCards} />
    </AppShell>
  );
}

async function StatistikBody({ userId, dueCards }: { userId: string; dueCards: number }) {
  const now = new Date();
  const cutoff30 = new Date(now.getTime() - 30 * DAY_MS);
  const cutoff90 = new Date(now.getTime() - 90 * DAY_MS);

  const [reviews, totalCards, masteredCards, attempts, quizAccuracy] = await withDbRetry(() =>
    Promise.all([
      prisma.flashcardReview.findMany({
        where: { flashcard: { userId }, reviewedAt: { gte: cutoff90 } },
        select: { reviewedAt: true, grade: true },
      }),
      prisma.flashcard.count({ where: { userId } }),
      prisma.flashcard.count({ where: { userId, intervalDays: { gte: 7 } } }),
      prisma.quizAttempt.findMany({
        where: { userId, submittedAt: { not: null } },
        orderBy: { submittedAt: "desc" },
        take: 8,
        select: {
          id: true,
          score: true,
          submittedAt: true,
          quiz: { select: { title: true } },
        },
      }),
      prisma.quizAttempt.aggregate({
        where: { userId, submittedAt: { not: null }, score: { not: null } },
        _avg: { score: true },
        _count: { score: true },
      }),
    ]),
  );

  const reviewedAt = reviews.map((review) => review.reviewedAt);
  const streak = studyStreak(reviewedAt, now);
  const reviews30 = reviewedAt.filter((at) => at >= cutoff30).length;
  const buckets = reviewBuckets(reviewedAt, now, 14);
  const grades = gradeTotals(reviews.map((review) => review.grade));
  const gradeTotal = grades.AGAIN + grades.HARD + grades.GOOD + grades.EASY;
  const bucketMax = Math.max(...buckets.map((bucket) => bucket.count), 1);
  const bucketSum = buckets.reduce((sum, bucket) => sum + bucket.count, 0);
  const bucketPeak = Math.max(...buckets.map((bucket) => bucket.count), 0);
  const averageScore = quizAccuracy._avg.score === null ? null : Number(quizAccuracy._avg.score);

  const stats = [
    {
      label: "Streak",
      value: streak,
      suffix: streak ? "hari" : undefined,
      hint: streak ? "hari berturut-turut" : "mulai ulangian hari ini",
      accent: true,
    },
    { label: "Ulangan", value: reviews30, hint: "kartu dijawab dalam 30 hari" },
    {
      label: "Akurasi kuis",
      value: averageScore === null ? "—" : `${Math.round(averageScore)}%`,
      hint: quizAccuracy._count.score
        ? `rata-rata dari ${quizAccuracy._count.score} kuis`
        : "belum ada kuis selesai",
    },
    {
      label: "Dikuasai",
      value: masteredCards,
      hint: `dari ${totalCards} kartu · jarak ≥ 1 minggu`,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <header className="border-line border-b pb-6">
        <p className="text-muted-foreground font-mono text-xs font-semibold tracking-[0.14em]">
          STATISTIK
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Progres kamu, <span className="text-brand">angka-angkanya</span>.
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
          Semua angka dihitung dari riwayat ulangan dan kuis kamu sendiri—bukan estimasi.
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
              {stat.suffix ? (
                <span className="ml-1 text-sm font-semibold">{stat.suffix}</span>
              ) : null}
            </dd>
            <p className="text-muted-foreground mt-1 text-xs">{stat.hint}</p>
          </div>
        ))}
      </dl>

      {!bucketSum && !attempts.length ? (
        <div className="mt-6">
          <EmptyState
            icon={BarChart3}
            title="Belum ada data"
            description="Unggah materi, lalu ulangi kartu atau kerjakan kuis—grafiknya langsung terisi di sini."
            action={
              <Button asChild>
                <Link href="/dashboard">
                  Unggah materi pertama
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            }
          />
        </div>
      ) : null}

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card className="min-w-0">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle>Ulangan 14 hari terakhir</CardTitle>
              <BarChart3 className="text-muted-foreground size-5 shrink-0" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent>
            <figure className="m-0">
              <div className="flex h-40 items-end gap-1.5" aria-hidden="true">
                {buckets.map((bucket) => (
                  <div className="flex h-full flex-1 items-end" key={bucket.key}>
                    <div
                      className="bg-primary w-full rounded-t-[2px]"
                      style={{
                        height: bucket.count
                          ? `${Math.max(6, Math.round((bucket.count / bucketMax) * 100))}%`
                          : "2px",
                      }}
                      title={`${bucket.count} ulangan`}
                    />
                  </div>
                ))}
              </div>
              <div className="text-muted-foreground mt-2 flex justify-between font-mono text-[11px]">
                <span>14 hari lalu</span>
                <span>hari ini</span>
              </div>
              <figcaption className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {bucketSum
                  ? `${bucketSum} ulangan dalam 14 hari terakhir, puncaknya ${bucketPeak} ulangan sehari.`
                  : "Belum ada ulangan dalam 14 hari terakhir."}
              </figcaption>
              <ol className="sr-only">
                {buckets.map((bucket) => (
                  <li key={bucket.key}>
                    {formatDate(new Date(`${bucket.key}T00:00:00.000Z`))}: {bucket.count} ulangan
                  </li>
                ))}
              </ol>
            </figure>
          </CardContent>
        </Card>

        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sebaran nilai ulangan</CardTitle>
            </CardHeader>
            <CardContent>
              {gradeTotal ? (
                <ul className="space-y-3.5">
                  {CARD_GRADES.map((grade) => {
                    const count = grades[grade];
                    const width = Math.round((count / gradeTotal) * 100);
                    return (
                      <li key={grade}>
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-sm font-semibold">{gradeStyle[grade].label}</span>
                          <span className="text-muted-foreground font-mono text-xs tabular-nums">
                            {count} · {width}%
                          </span>
                        </div>
                        <div className="bg-muted border-line mt-1.5 h-2 border">
                          <div
                            className={cn("h-full", gradeStyle[grade].bar)}
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Nilai ulanganmu (Ulangi lagi · Sulit · Bagus · Mudah) muncul setelah kamu
                  mengerjakan set pertama.
                </p>
              )}
              <p className="text-muted-foreground mt-4 font-mono text-[11px] tracking-wide">
                90 HARI TERAKHIR
              </p>
            </CardContent>
          </Card>

          <Card className={dueCards ? "bg-highlight text-ink" : undefined}>
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
                  {dueCards ? "Mulai ulangian" : "Buka ulangian"}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Kuis terakhir</CardTitle>
            <Badge variant="muted">{quizAccuracy._count.score} selesai</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {attempts.length ? (
            <ul className="divide-line divide-y">
              {attempts.map((attempt) => {
                const score = attempt.score === null ? null : Number(attempt.score);
                return (
                  <li className="flex items-center justify-between gap-4 py-3" key={attempt.id}>
                    <span className="min-w-0">
                      <span className="block truncate font-bold">{attempt.quiz.title}</span>
                      <span className="text-muted-foreground mt-0.5 block font-mono text-xs">
                        {attempt.submittedAt ? formatDate(attempt.submittedAt) : "—"}
                      </span>
                    </span>
                    <Badge variant={score !== null && score >= 70 ? "brand" : "muted"}>
                      {score === null ? "—" : `${Math.round(score)}%`}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm leading-relaxed">
              Belum ada kuis yang diselesaikan. Buka salah satu materi, lalu pilih hasil{" "}
              <span className="font-semibold">Kuis</span>—skornya langsung tercatat di sini.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
