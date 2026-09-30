import { describe, expect, it } from "vitest";
import { gradeTotals, reviewBuckets } from "@/lib/study/stats";

const NOW = new Date("2026-09-30T10:00:00.000Z");
const day = (offset: number) => new Date(NOW.getTime() - offset * 86_400_000);

describe("reviewBuckets", () => {
  it("returns one bucket per day, oldest first", () => {
    const buckets = reviewBuckets([], NOW, 3);
    expect(buckets.map((bucket) => bucket.key)).toEqual(["2026-09-28", "2026-09-29", "2026-09-30"]);
    expect(buckets.every((bucket) => bucket.count === 0)).toBe(true);
  });

  it("counts reviews that fall outside the window as zero-filled neighbours", () => {
    const buckets = reviewBuckets([day(0), day(0), day(1)], NOW, 3);
    expect(buckets).toEqual([
      { key: "2026-09-28", count: 0 },
      { key: "2026-09-29", count: 1 },
      { key: "2026-09-30", count: 2 },
    ]);
  });

  it("ignores reviews older than the window instead of shifting buckets", () => {
    const buckets = reviewBuckets([day(10)], NOW, 2);
    expect(buckets).toEqual([
      { key: "2026-09-29", count: 0 },
      { key: "2026-09-30", count: 0 },
    ]);
  });
});

describe("gradeTotals", () => {
  it("tallies each grade separately", () => {
    expect(gradeTotals(["AGAIN", "GOOD", "GOOD", "EASY"])).toEqual({
      AGAIN: 1,
      HARD: 0,
      GOOD: 2,
      EASY: 1,
    });
  });

  it("stays at zero when the input is empty or unknown", () => {
    expect(gradeTotals([])).toEqual({ AGAIN: 0, HARD: 0, GOOD: 0, EASY: 0 });
    expect(gradeTotals(["PERFECT"])).toEqual({ AGAIN: 0, HARD: 0, GOOD: 0, EASY: 0 });
  });
});
