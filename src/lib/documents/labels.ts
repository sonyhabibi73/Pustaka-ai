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

/** Pesan gagal proses yang bisa dipahami pengguna, bukan kode teknis. */
const PROCESSING_ERROR_MESSAGE: Record<string, string> = {
  YOUTUBE_CAPTIONS_UNAVAILABLE:
    "Video ini tidak menyediakan caption yang bisa dibaca, termasuk subtitle otomatisnya. Coba video lain, atau aktifkan subtitle otomatis di video tersebut lalu proses ulang.",
  INVALID_YOUTUBE_URL:
    "URL YouTube tidak valid. Tempel link lengkap video, misalnya https://www.youtube.com/watch?v=...",
  DOCUMENT_HAS_NO_EXTRACTABLE_TEXT:
    "Sumber ini tidak mengandung teks yang bisa dibaca. Kalau hasilnya berupa scan, salin dulu isinya ke file TXT.",
  UNSUPPORTED_EXTRACTION_TYPE: "Format file ini belum didukung. Gunakan PDF, DOCX, atau TXT.",
};

const GENERIC_PROCESSING_ERROR =
  "Materi gagal diproses. Coba proses ulang; kalau masih gagal, unggah sumber lain.";

export function processingErrorMessage(code?: string | null) {
  if (!code) return GENERIC_PROCESSING_ERROR;
  return PROCESSING_ERROR_MESSAGE[code] ?? GENERIC_PROCESSING_ERROR;
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
