import { dayKey } from "@/lib/study/streak";

/** Empat nilai ulangan pada kartu (SM-2), urutan tetap untuk grafik. */
export const CARD_GRADES = ["AGAIN", "HARD", "GOOD", "EASY"] as const;
export type CardGrade = (typeof CARD_GRADES)[number];

/** Satu hari pada grafik batang ulangan. */
export type DayBucket = { key: string; count: number };

const DAY_MS = 86_400_000;

/**
 * Kelompokkan jumlah ulangan per hari untuk `days` hari terakhir (termasuk
 * hari ini), dihitung mundur dari `now` memakai kunci UTC yang sama dengan
 * `studyStreak` supaya grafik dan counter streak tidak pernah berbeda hari.
 */
export function reviewBuckets(reviewedAt: Date[], now: Date, days = 14): DayBucket[] {
  const counts = new Map<string, number>();
  for (const at of reviewedAt) {
    const key = dayKey(at);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const buckets: DayBucket[] = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const key = dayKey(new Date(now.getTime() - offset * DAY_MS));
    buckets.push({ key, count: counts.get(key) ?? 0 });
  }
  return buckets;
}

/** Jumlah ulangan per nilai (AGAIN/HARD/GOOD/EASY); nilai asing diabaikan. */
export function gradeTotals(grades: readonly string[]): Record<CardGrade, number> {
  const totals: Record<CardGrade, number> = { AGAIN: 0, HARD: 0, GOOD: 0, EASY: 0 };
  for (const grade of grades) {
    if (grade === "AGAIN" || grade === "HARD" || grade === "GOOD" || grade === "EASY") {
      totals[grade] += 1;
    }
  }
  return totals;
}
