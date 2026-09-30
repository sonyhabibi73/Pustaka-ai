/** Preferensi belajar murni (tanpa cookie) — aman dipakai klien & diuji unit. */

/** Pilihan batas kartu per sesi; angka di luar daftar ini dianggap tidak sah. */
export const CARD_BATCH_SIZES = [12, 24, 48, 120] as const;

export type StudyPrefs = {
  /** Batas kartu yang ditampilkan per sesi ulangan. */
  cardsPerSession: number;
  /** Materi yang diulang lebih dulu saat halaman ulangan dibuka tanpa pilihan. */
  defaultDocId: string | null;
};

export const DEFAULT_STUDY_PREFS: StudyPrefs = { cardsPerSession: 24, defaultDocId: null };

const DOC_ID = /^c[a-z0-9]{20,}$/;

/** Baca nilai preferensi dengan hasil yang selalu lolos validasi. */
export function parseStudyPrefs(raw: string | undefined | null): StudyPrefs {
  if (!raw) return { ...DEFAULT_STUDY_PREFS };
  try {
    const value = JSON.parse(raw) as Partial<StudyPrefs>;
    const cardsPerSession =
      typeof value.cardsPerSession === "number" &&
      (CARD_BATCH_SIZES as readonly number[]).includes(value.cardsPerSession)
        ? value.cardsPerSession
        : DEFAULT_STUDY_PREFS.cardsPerSession;
    const defaultDocId =
      typeof value.defaultDocId === "string" && DOC_ID.test(value.defaultDocId)
        ? value.defaultDocId
        : null;
    return { cardsPerSession, defaultDocId };
  } catch {
    return { ...DEFAULT_STUDY_PREFS };
  }
}
