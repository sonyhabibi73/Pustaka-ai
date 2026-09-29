export const DOCUMENT_STATUS_LABEL: Record<string, string> = {
  UPLOADED: "Menunggu",
  PROCESSING: "Diproses",
  READY: "Siap",
  FAILED: "Gagal",
};

export const PROCESSING_STAGE_LABEL: Record<string, string> = {
  TEXT_EXTRACTION: "Mengekstrak teks",
  CHUNKING: "Memecah materi",
  EMBEDDING: "Menyusun pencarian",
  ARTIFACT_GENERATION: "Membuat flashcard & kuis",
};

export function documentStatusLabel(status: string) {
  return DOCUMENT_STATUS_LABEL[status] ?? status;
}

export function processingStageLabel(stage: string) {
  return PROCESSING_STAGE_LABEL[stage] ?? stage;
}

/** "besok" / "3 hari lagi" / "2 minggu lagi" — dipakai untuk pratinjau jadwal kartu. */
export function intervalLabel(days: number) {
  if (days <= 0) return "hari ini";
  if (days === 1) return "besok";
  if (days < 7) return `${days} hari lagi`;
  if (days < 35) {
    const weeks = Math.round(days / 7);
    return `${weeks} minggu lagi`;
  }
  const months = Math.round(days / 30);
  return `${months} bulan lagi`;
}
