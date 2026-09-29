import "server-only";

const WORDS_PER_CHUNK = 420;
const OVERLAP_WORDS = 70;

export function chunkText(input: string) {
  const words = input.replace(/\s+/g, " ").trim().split(" ");
  if (words.length < 20) throw new Error("DOCUMENT_HAS_TOO_LITTLE_TEXT");
  const chunks: { content: string; tokenCount: number; chunkIndex: number }[] = [];
  let start = 0;
  while (start < words.length) {
    const segment = words.slice(start, start + WORDS_PER_CHUNK);
    if (!segment.length) break;
    chunks.push({
      content: segment.join(" "),
      tokenCount: Math.ceil(segment.length * 1.3),
      chunkIndex: chunks.length,
    });
    if (start + WORDS_PER_CHUNK >= words.length) break;
    start += WORDS_PER_CHUNK - OVERLAP_WORDS;
  }
  return chunks;
}
