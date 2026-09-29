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

export async function summarizeDocument(text: string) {
  const result = await generateText({
    model: generationModel,
    prompt: `Buat rangkuman materi berikut dalam Bahasa Indonesia. Gunakan heading Markdown singkat, poin penting, dan jangan tambahkan informasi di luar materi.\n\n${text.slice(0, 80_000)}`,
    maxOutputTokens: 1600,
  });
  return result.text;
}

export async function createFlashcards(context: string) {
  const result = await generateText({
    model: generationModel,
    output: Output.array({ element: flashcardsSchema.element }),
    prompt: `Buat tepat 12 flashcard belajar dari konteks berikut. Semua jawaban harus didukung konteks. chunkIndexes wajib merujuk indeks chunk yang Anda gunakan.\n\n${context}`,
  });
  return flashcardsSchema.parse(result.output);
}

export async function createQuiz(context: string) {
  const result = await generateText({
    model: generationModel,
    output: Output.array({ element: quizSchema.element }),
    prompt: `Buat tepat 10 soal pilihan ganda Bahasa Indonesia dari konteks berikut. Setiap soal memiliki empat opsi, satu jawaban benar, penjelasan berbasis materi, dan chunkIndexes sumber. Jangan menguji informasi di luar konteks.\n\n${context}`,
  });
  return quizSchema.parse(result.output);
}
