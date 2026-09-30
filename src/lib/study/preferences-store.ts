import "server-only";
import { cookies } from "next/headers";

import { parseStudyPrefs, type StudyPrefs } from "@/lib/study/preferences";

/**
 * Penyimpanan preferensi belajar di cookie perangkat (bukan tabel) supaya
 * tidak perlu migrasi skema; dibaca server saat halaman ulangan dibuka.
 */
export const STUDY_PREFS_COOKIE = "study-prefs";

export async function getStudyPrefs(): Promise<StudyPrefs> {
  const jar = await cookies();
  return parseStudyPrefs(jar.get(STUDY_PREFS_COOKIE)?.value);
}

/** Simpan preferensi — hanya boleh dipanggil dari server action / route handler. */
export async function saveStudyPrefs(prefs: StudyPrefs) {
  const jar = await cookies();
  jar.set(STUDY_PREFS_COOKIE, JSON.stringify(parseStudyPrefs(JSON.stringify(prefs))), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
