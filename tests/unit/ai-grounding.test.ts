import { describe, expect, it } from "vitest";
import { NOT_FOUND_RESPONSE, groundedChatPrompt } from "@/lib/ai/prompts";
import { sanitizeAiMarkdown } from "@/lib/ai/sanitize";

const CONTEXT = "[chunk 0] Mitokondria menghasilkan ATP.\n\n[chunk 1] Ribosom menyintesis protein.";
const QUESTION = "Berapa jumlah kromoson manusia?";

describe("groundedChatPrompt", () => {
  it("pins the model to the document and forbids outside knowledge", () => {
    const prompt = groundedChatPrompt(CONTEXT, QUESTION);
    expect(prompt).toContain(CONTEXT);
    expect(prompt).toContain(QUESTION);
    expect(prompt).toContain("Jawab HANYA berdasarkan KONTEKS DOKUMEN");
    expect(prompt).toContain("Jangan gunakan pengetahuan umum");
    expect(prompt).toContain("jangan mengarang");
  });

  it("commands the exact fallback sentence for unsupported answers", () => {
    const prompt = groundedChatPrompt(CONTEXT, QUESTION);
    expect(prompt).toContain(`balas persis: "${NOT_FOUND_RESPONSE}"`);
    expect(NOT_FOUND_RESPONSE).toBe("Informasi tersebut tidak ditemukan dalam dokumen Anda.");
  });

  it("does not leak a previous question into a new prompt", () => {
    const first = groundedChatPrompt(CONTEXT, "Apa itu ribosom?");
    const second = groundedChatPrompt(CONTEXT, QUESTION);
    expect(first).not.toContain(QUESTION);
    expect(second).not.toContain("Apa itu ribosom?");
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
