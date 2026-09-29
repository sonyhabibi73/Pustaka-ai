import "server-only";
import mammoth from "mammoth";

export async function extractTextFromFile(buffer: Buffer, mimeType: string) {
  if (mimeType === "text/plain") {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer).trim();
  }
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }
  if (mimeType === "application/pdf") {
    const pdfModule = await import("pdf-parse");
    const parser = new pdfModule.PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return result.text.trim();
    } finally {
      await parser.destroy();
    }
  }
  throw new Error("UNSUPPORTED_EXTRACTION_TYPE");
}

export async function extractYouTubeTranscript(videoId: string) {
  const url = new URL("https://www.youtube.com/api/timedtext");
  url.searchParams.set("v", videoId);
  url.searchParams.set("lang", "id");
  const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error("YOUTUBE_CAPTIONS_UNAVAILABLE");
  const xml = await response.text();
  const text = [...xml.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)]
    .map((match) =>
      match[1]
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/<[^>]+>/g, ""),
    )
    .join(" ")
    .trim();
  if (!text) throw new Error("YOUTUBE_CAPTIONS_UNAVAILABLE");
  return text;
}
