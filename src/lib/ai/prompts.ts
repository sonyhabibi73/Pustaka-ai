export const NOT_FOUND_RESPONSE = "Informasi tersebut tidak ditemukan dalam dokumen Anda.";

export function groundedChatPrompt(context: string, question: string) {
  return `Anda adalah asisten belajar yang sangat ketat pada sumber. Jawab HANYA berdasarkan KONTEKS DOKUMEN di bawah. Jangan gunakan pengetahuan umum, jangan mengarang, dan jangan menyebutkan fakta yang tidak tersedia. Jika jawabannya tidak didukung konteks, balas persis: "${NOT_FOUND_RESPONSE}"

KONTEKS DOKUMEN:
${context}

PERTANYAAN PENGGUNA:
${question}`;
}
