/** Kunci hari (YYYY-MM-DD, UTC) dari sebuah tanggal. */
function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Berapa hari berturut-turut ada ulangan, dihitung mundur dari `now`.
 *
 * Kalau hari ini belum ada ulangan tetapi kemarin masih ada, hitungannya
 * tetap berjalan — streak hanya putus setelah satu hari penuh tanpa
 * kegiatan. Dipakai counter amber di dashboard (DESIGN.md: "Amber untuk
 * streak harian").
 */
export function studyStreak(reviewedAt: Date[], now = new Date()): number {
  const days = new Set(reviewedAt.map(dayKey));
  if (!days.size) return 0;

  const cursor = new Date(now.getTime());
  if (!days.has(dayKey(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    if (!days.has(dayKey(cursor))) return 0;
  }

  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}
