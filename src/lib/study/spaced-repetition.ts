export type ReviewGrade = "AGAIN" | "HARD" | "GOOD" | "EASY";

export function calculateNextReview(
  current: { repetitions: number; intervalDays: number; easeFactor: number },
  grade: ReviewGrade,
  now = new Date(),
) {
  let repetitions = current.repetitions;
  let intervalDays = current.intervalDays;
  let easeFactor = current.easeFactor;
  if (grade === "AGAIN") {
    repetitions = 0;
    intervalDays = 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  }
  if (grade === "HARD") {
    repetitions += 1;
    intervalDays = Math.max(1, Math.round(Math.max(1, intervalDays) * 1.2));
    easeFactor = Math.max(1.3, easeFactor - 0.15);
  }
  if (grade === "GOOD") {
    repetitions += 1;
    intervalDays =
      repetitions === 1
        ? 1
        : repetitions === 2
          ? 3
          : Math.round(Math.max(1, intervalDays) * easeFactor);
  }
  if (grade === "EASY") {
    repetitions += 1;
    intervalDays =
      repetitions === 1 ? 4 : Math.round(Math.max(1, intervalDays) * (easeFactor + 0.3));
    easeFactor += 0.15;
  }
  const dueAt = new Date(now);
  dueAt.setDate(dueAt.getDate() + intervalDays);
  return { repetitions, intervalDays, easeFactor: Math.min(3.5, easeFactor), dueAt };
}
