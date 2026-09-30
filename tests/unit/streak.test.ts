import { describe, expect, it } from "vitest";
import { studyStreak } from "@/lib/study/streak";

const NOW = new Date("2026-09-30T10:00:00.000Z");
const day = (offset: number) => new Date(NOW.getTime() - offset * 86_400_000);

describe("studyStreak", () => {
  it("returns 0 when there are no reviews at all", () => {
    expect(studyStreak([], NOW)).toBe(0);
  });

  it("counts a single review today as a 1-day streak", () => {
    expect(studyStreak([day(0)], NOW)).toBe(1);
  });

  it("counts consecutive days backwards from today", () => {
    expect(studyStreak([day(0), day(1), day(2)], NOW)).toBe(3);
  });

  it("stops at the first gap", () => {
    expect(studyStreak([day(0), day(1), day(3), day(4)], NOW)).toBe(2);
  });

  it("keeps yesterday's streak alive when today is still empty", () => {
    expect(studyStreak([day(1), day(2)], NOW)).toBe(2);
  });

  it("reports 0 when the most recent review is older than yesterday", () => {
    expect(studyStreak([day(3)], NOW)).toBe(0);
  });

  it("ignores several reviews on the same day", () => {
    expect(studyStreak([day(1), day(1), day(1), day(2)], NOW)).toBe(2);
  });
});
