import "server-only";
import { generateText, Output } from "ai";
import { z } from "zod";
import { generationModel } from "@/lib/ai/models";

const flashcardsSchema = z.array(
  z.object({
    front: z.string().min(1).max(400),
    back: z.string().min(1).max(1000),
    chunkIndexes: z.array(z.number().int().nonnegative()),
  }),
);
const quizSchema = z.array(
  z.object({
    prompt: z.string().min(1),
    options: z.array(z.string().min(1)).length(4),
    correctIndex: z.number().int().min(0).max(3),
    explanation: z.string().min(1),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    chunkIndexes: z.array(z.number().int().nonnegative()),
  }),
);

function safeTitle(title: string) {
  return title
    .replace(/[\r\n"]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);
}

/**
 * Larangan yang sama untuk flashcard dan kuis: soal harus menguji ISI materi,
 * bukan dokumennya sendiri. Tanpa ini, dokumen berupa kisi-kisi menghasilkan
 * kartu seperti "apa saja materi ujian A?" dan judul dokumen ikut tersalin ke
 * dalam front/back.
 */
function antiMetaRules(title: string) {
  return `DOKUMEN: "${safeTitle(title)}"

ATURAN WAJIB
1. Soal harus menguji ISI MATERI: definisi, konsep, sebab-akibat, langkah prosedur, angka, istilah, perbandingan, atau contoh yang benar-benar ada di konteks.
2. DILARANG bertanya tentang dokumennya sendiri. Contoh yang harus dihindari:
   - "Apa saja materi yang dibahas/diujikan dalam dokumen ini?"
   - "Apa judul materinya?" / "Apa isi kisi-kisi ini?"
   - "Berapa banyak bagian/pasal/butir dalam dokumen ini?"
   Pertanyaan yang hanya menyebut ulang judul, daftar isi, struktur, atau tujuan dokumen tidak dihitung.
3. Jangan menyalin judul dokumen, nama berkas, atau kalimat penanda (mis. "Kisi-kisi ...", "Materi ujian ...") ke dalam pertanyaan maupun jawaban. Tulis ulang dengan bahasa sendiri.
4. Kalau konteks hanya berupa daftar/butir, pecah menjadi soal PER BUTIR yang menyebut butir itu secara spesifik — bukan satu soal umum tentang "apa saja isinya".
5. Jangan mengarang fakta yang tidak ada di konteks. Kalau konteks hanya menyebut nama topik tanpa penjelasan, soal cukup menguji nama/urutan topik itu.
6. Rujukan chunkIndexes wajib indeks chunk yang benar-benar Anda baca.

KONTEKS (tiap blok diawali [chunk N]):`;
}

export async function summarizeDocument(text: string, title: string) {
  const result = await generateText({
    model: generationModel,
    prompt: `Buat rangkuman materi berikut dalam Bahasa Indonesia untuk dokumen "${safeTitle(title)}". Gunakan heading Markdown singkat dan poin penting. Jangan tambahkan informasi di luar materi, dan jangan menulis ulang judul dokumen sebagai bagian dari rangkuman.\n\n${text.slice(0, 80_000)}`,
    maxOutputTokens: 1600,
  });
  return result.text;
}

export async function createFlashcards(context: string, title: string) {
  const result = await generateText({
    model: generationModel,
    output: Output.array({ element: flashcardsSchema.element }),
    prompt: `${antiMetaRules(title)}
${context}

TUGAS
- Buat tepat 12 flashcard yang beragam jenis (definisi, sebab-akibat, langkah, angka/kunci jawaban, perbandingan).
- Front: satu pertanyaan spesifik, maks 300 karakter.
- Back: jawaban lengkap namun ringkas sebagai TEKS BIASA tanpa Markdown, maks 700 karakter.`,
  });
  const cards = flashcardsSchema.parse(result.output);
  const meta = safeTitle(title).toLowerCase();
  // Jaring pengaman terakhir: buang kartu yang judulnya bocor ke front/back.
  return cards.filter(
    (card) =>
      card.front.length > 4 &&
      !(meta && card.front.trim().toLowerCase() === meta) &&
      !(meta && card.back.trim().toLowerCase() === meta),
  );
}

export async function createQuiz(context: string, title: string) {
  const result = await generateText({
    model: generationModel,
    output: Output.array({ element: quizSchema.element }),
    prompt: `${antiMetaRules(title)}
${context}

TUGAS
- Buat tepat 10 soal pilihan ganda Bahasa Indonesia.
- Setiap soal punya empat opsi dengan satu jawaban benar, penjelasan berdasarkan materi, dan chunkIndexes sumber.
- Tiga soal berupa pilihan ganda murni, tiga soal pemahaman (sebab-akibat/prosedur), sisanya pengukuran angka/istilah penting.`,
  });
  return quizSchema.parse(result.output);
}
