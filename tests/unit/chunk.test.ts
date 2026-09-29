import { describe, expect, it } from "vitest";
import { chunkText } from "@/lib/documents/chunk";

describe("chunkText", () => {
  it("keeps overlap and preserves the entire source", () => {
    const words = Array.from({ length: 900 }, (_, index) => `kata-${index}`);
    const chunks = chunkText(words.join(" "));
    expect(chunks).toHaveLength(3);
    expect(chunks[0].content).toContain("kata-0");
    expect(chunks.at(-1)?.content).toContain("kata-899");
    expect(chunks[0].content).toContain("kata-350");
    expect(chunks[1].content).toContain("kata-350");
  });

  it("rejects a document with insufficient source text", () => {
    expect(() => chunkText("hanya sedikit kata untuk diuji")).toThrow(
      "DOCUMENT_HAS_TOO_LITTLE_TEXT",
    );
  });
});
