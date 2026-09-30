/** Hasil simpan nama, dibaca `useActionState` di dalam form klien. */
export type ProfileState = {
  ok: boolean;
  message?: string;
  error?: string;
};

/** Hasil simpan preferensi belajar (kartu per sesi & materi default). */
export type StudyPrefsState = ProfileState;
