import { describe, expect, it } from "vitest";
import { NOT_FOUND_RESPONSE, SOURCE_MARKER, groundedChatPrompt } from "@/lib/ai/prompts";
import { sanitizeAiMarkdown } from "@/lib/ai/sanitize";

const CONTEXT = "[chunk 0] Mitokondria menghasilkan ATP.\n\n[chunk 1] Ribosom menyintesis protein.";
const QUESTION = "Berapa jumlah kromoson manusia?";
const TITLE = "Biologi Sel";
const base = { title: TITLE, context: CONTEXT, question: QUESTION };

describe("groundedChatPrompt", () => {
  it("pins the model to the document and forbids outside knowledge", () => {
    const prompt = groundedChatPrompt(base);
    expect(prompt).toContain(CONTEXT);
    expect(prompt).toContain(QUESTION);
    expect(prompt).toContain(TITLE);
    expect(prompt).toContain("Jawab HANYA berdasarkan KONTEKS DOKUMEN");
    expect(prompt).toContain("Jangan gunakan pengetahuan umum");
    expect(prompt).toContain("jangan mengarang");
  });

  it("commands the exact fallback sentence for unsupported answers", () => {
    const prompt = groundedChatPrompt(base);
    expect(prompt).toContain(`balas persis: "${NOT_FOUND_RESPONSE}"`);
    expect(NOT_FOUND_RESPONSE).toBe("Informasi tersebut tidak ditemukan dalam dokumen kamu.");
  });

  it("invites conclusions drawn from the document instead of refusing them", () => {
    const prompt = groundedChatPrompt(base);
    expect(prompt).toContain(
      "Jangan menolak pertanyaan hanya karena kalimatnya tidak persis ada di konteks",
    );
    expect(prompt).toContain('Pertanyaan turunan seperti "kenapa"');
  });

  it("requires a trailing source marker so citations are model-chosen", () => {
    const prompt = groundedChatPrompt(base);
    expect(prompt).toContain(`${SOURCE_MARKER} 1,3`);
    expect(prompt).toContain("tanpa kurung siku");
    expect(prompt).toContain("jangan menulis apa pun setelah baris ini");
  });

  it("carries the dialogue forward without leaking into the next prompt", () => {
    const withHistory = groundedChatPrompt({
      ...base,
      history: [{ role: "user", content: "Apa itu mitokondria?" }],
    });
    expect(withHistory).toContain("Pengguna: Apa itu mitokondria?");

    const first = groundedChatPrompt({ ...base, question: "Apa itu ribosom?" });
    const second = groundedChatPrompt(base);
    expect(first).not.toContain(QUESTION);
    expect(second).not.toContain("Apa itu ribosom?");
    expect(second).not.toContain("Apa itu mitokondria?");
  });

  it("neutralises quotes and newlines in the document title", () => {
    const prompt = groundedChatPrompt({ ...base, title: 'Pengantar "Fisika"\nSemester 1' });
    expect(prompt).not.toContain('"Fisika"');
    expect(prompt).toContain("Pengantar Fisika Semester 1");
  });
});

describe("sanitizeAiMarkdown", () => {
  it("strips script tags while keeping readable text", () => {
    const dirty = 'Ringkasan sel.\n\n<script>alert("xss")</script>';
    const clean = sanitizeAiMarkdown(dirty);
    expect(clean).not.toContain("<script");
    expect(clean).not.toContain("alert");
    expect(clean).toContain("Ringkasan sel.");
  });

  it("strips event handlers and javascript: URLs", () => {
    expect(sanitizeAiMarkdown("<img src=x onerror=\"fetch('/api')\">")).not.toContain("onerror");
    expect(sanitizeAiMarkdown('<a href="javascript:alert(1)">tautan</a>')).not.toContain(
      "javascript:",
    );
  });

  it("leaves plain Indonesian prose untouched", () => {
    const prose = "Respirasi seluler terjadi di mitokondria dan menghasilkan ATP.";
    expect(sanitizeAiMarkdown(prose)).toBe(prose);
  });
});
