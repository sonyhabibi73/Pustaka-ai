import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileTypeFromBuffer } from "file-type";
import { describe, expect, it } from "vitest";
import {
  MAX_UPLOAD_BYTES,
  validateStudyFile,
  validateYouTubeUrl,
} from "@/lib/documents/validation";

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const DOCX_FIXTURE = path.join(__dirname, "..", "fixtures", "sample.docx");

const PDF_HEADER = Buffer.concat([
  Buffer.from("%PDF-1.7\n"),
  Buffer.from(Array.from({ length: 64 }, () => 0)),
]);
const DOCX_HEADER = Buffer.concat([Buffer.from("PK\x03\x04"), Buffer.alloc(64)]);

function file(content: Uint8Array | string, name: string, type: string) {
  const body = typeof content === "string" ? Buffer.from(content, "utf8") : Buffer.from(content);
  return new File([body], name, { type });
}

describe("validateStudyFile", () => {
  it("accepts a PDF whose declared type matches its signature", async () => {
    const result = await validateStudyFile(file(PDF_HEADER, "modul.pdf", "application/pdf"));
    expect(result.mime).toBe("application/pdf");
    expect(result.kind).toBe("PDF");
    expect(result.buffer.subarray(0, 5).toString("latin1")).toBe("%PDF-");
  });

  it("accepts a real .docx, whose zip signature resolves to the OOXML mime", async () => {
    const buffer = await readFile(DOCX_FIXTURE);
    expect((await fileTypeFromBuffer(buffer))?.mime).toBe(DOCX_MIME);

    const result = await validateStudyFile(file(buffer, "laporan.docx", DOCX_MIME));
    expect(result.kind).toBe("WORD");
  });

  it("rejects a zip renamed to .docx", async () => {
    await expect(validateStudyFile(file(DOCX_HEADER, "palsu.docx", DOCX_MIME))).rejects.toThrow(
      "INVALID_FILE_SIGNATURE",
    );
  });

  it("accepts plain text with no binary signature", async () => {
    const result = await validateStudyFile(
      file("materi kuliah tentang sel\n", "materi.txt", "text/plain"),
    );
    expect(result.kind).toBe("TEXT");
  });

  it("rejects a PDF renamed to .txt so text decoding cannot be forced", async () => {
    await expect(validateStudyFile(file(PDF_HEADER, "materi.txt", "text/plain"))).rejects.toThrow(
      "INVALID_FILE_SIGNATURE",
    );
  });

  it("rejects a declared PDF that is not a PDF", async () => {
    await expect(
      validateStudyFile(file("<html><body>x</body></html>", "a.pdf", "application/pdf")),
    ).rejects.toThrow("INVALID_FILE_SIGNATURE");
  });

  it("rejects MIME types outside the allow list before any parsing", async () => {
    await expect(
      validateStudyFile(file("MZ\x90\x00", "setup.exe", "application/x-msdownload")),
    ).rejects.toThrow("INVALID_FILE_TYPE");
    await expect(validateStudyFile(file("GIF89a", "anim.gif", "image/gif"))).rejects.toThrow(
      "INVALID_FILE_TYPE",
    );
  });

  it("rejects empty files and anything above 10 MB", async () => {
    await expect(validateStudyFile(file("", "kosong.txt", "text/plain"))).rejects.toThrow(
      "INVALID_FILE_SIZE",
    );

    const oversized = new File([Buffer.alloc(MAX_UPLOAD_BYTES + 1, 1)], "besar.pdf", {
      type: "application/pdf",
    });
    await expect(validateStudyFile(oversized)).rejects.toThrow("INVALID_FILE_SIZE");
  });

  it("allows a file exactly at the size limit", async () => {
    const atLimit = new File([Buffer.alloc(MAX_UPLOAD_BYTES, 0)], "tepat.pdf", {
      type: "application/pdf",
    });
    // No %PDF signature: the size check must pass first, then signature rejects.
    await expect(validateStudyFile(atLimit)).rejects.toThrow("INVALID_FILE_SIGNATURE");
  });
});

describe("validateYouTubeUrl", () => {
  it("extracts an 11-character id from a watch URL", () => {
    expect(validateYouTubeUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ").videoId).toBe(
      "dQw4w9WgXcQ",
    );
  });

  it("extracts an id from youtu.be short links", () => {
    expect(validateYouTubeUrl("https://youtu.be/dQw4w9WgXcQ").videoId).toBe("dQw4w9WgXcQ");
  });

  it("rejects other hosts, plain http, and malformed ids", () => {
    for (const url of [
      "https://evil.example.com/watch?v=dQw4w9WgXcQ",
      "http://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://www.youtube.com/watch?v=short",
      "https://youtube.com/embed/dQw4w9WgXcQ",
      "not a url",
    ]) {
      expect(() => validateYouTubeUrl(url)).toThrow("INVALID_YOUTUBE_URL");
    }
  });
});
