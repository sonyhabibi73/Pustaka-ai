import { describe, expect, it } from "vitest";
import { calculateNextReview } from "@/lib/study/spaced-repetition";

const now = new Date("2026-09-28T00:00:00.000Z");

describe("calculateNextReview", () => {
  it("resets a failed card and never lets ease drop below the floor", () => {
    const result = calculateNextReview(
      { repetitions: 5, intervalDays: 20, easeFactor: 1.35 },
      "AGAIN",
      now,
    );
    expect(result.repetitions).toBe(0);
    expect(result.intervalDays).toBe(1);
    expect(result.easeFactor).toBe(1.3);
  });

  it("grows a successful interval", () => {
    const result = calculateNextReview(
      { repetitions: 3, intervalDays: 10, easeFactor: 2.5 },
      "GOOD",
      now,
    );
    expect(result.repetitions).toBe(4);
    expect(result.intervalDays).toBe(25);
  });
});
