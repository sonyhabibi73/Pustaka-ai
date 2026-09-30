import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  captionXmlToText,
  extractTextFromFile,
  extractYouTubeTranscript,
  pickCaptionTrack,
} from "@/lib/documents/extract";

const FIXTURES = path.join(__dirname, "..", "fixtures");
const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

describe("extractTextFromFile", () => {
  it("pulls readable text out of a real PDF", async () => {
    const buffer = await readFile(path.join(FIXTURES, "sample.pdf"));
    const text = await extractTextFromFile(buffer, "application/pdf");
    expect(text).toContain("Mitokondria menghasilkan ATP melalui respirasi seluler.");
    expect(text).toContain("transport elektron pada membran dalam");
  });

  it("pulls readable text out of a real DOCX", async () => {
    const buffer = await readFile(path.join(FIXTURES, "sample.docx"));
    const text = await extractTextFromFile(buffer, DOCX_MIME);
    expect(text).toContain("Mitokondria menghasilkan ATP");
  });

  it("decodes UTF-8 plain text", async () => {
    const text = await extractTextFromFile(
      Buffer.from("Fotosintesis ≠ respirasi\n", "utf8"),
      "text/plain",
    );
    expect(text).toBe("Fotosintesis ≠ respirasi");
  });

  it("rejects invalid UTF-8 instead of producing mojibake", async () => {
    await expect(
      extractTextFromFile(Buffer.from([0xff, 0xfe, 0xfd, 0xfc]), "text/plain"),
    ).rejects.toThrow();
  });

  it("refuses MIME types that were never validated", async () => {
    await expect(extractTextFromFile(Buffer.alloc(8), "application/x-msdownload")).rejects.toThrow(
      "UNSUPPORTED_EXTRACTION_TYPE",
    );
  });
});

describe("extractYouTubeTranscript", () => {
  it("rejects a video whose captions are unavailable", async () => {
    const videoId = "dQw4w9WgXcQ";
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async () =>
      new Response("<transcript></transcript>", { status: 200 })) as typeof fetch;
    try {
      await expect(extractYouTubeTranscript(videoId)).rejects.toThrow(
        "YOUTUBE_CAPTIONS_UNAVAILABLE",
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("rejects a video that has no caption track at all", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async () =>
      Response.json({ playabilityStatus: { status: "OK" } })) as typeof fetch;
    try {
      await expect(extractYouTubeTranscript("dQw4w9WgXcQ")).rejects.toThrow(
        "YOUTUBE_CAPTIONS_UNAVAILABLE",
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("asks Innertube for caption tracks, then reads the signed caption URL", async () => {
    const xml = [
      '<transcript><text start="0" dur="1">Mitokondria &amp; ATP</text>',
      '<text start="1" dur="1">menghasilkan energi &#39;primer&#39;</text></transcript>',
    ].join("");
    const calls: string[] = [];
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = String(input);
      calls.push(url);
      if (url.includes("youtubei/v1/player")) {
        return Response.json({
          captions: {
            playerCaptionsTracklistRenderer: {
              captionTracks: [
                {
                  baseUrl: "https://www.youtube.com/api/timedtext?v=abc&lang=en",
                  languageCode: "en",
                },
              ],
            },
          },
        });
      }
      return new Response(xml, { status: 200 });
    }) as typeof fetch;
    try {
      const text = await extractYouTubeTranscript("dQw4w9WgXcQ");
      expect(text).toBe("Mitokondria & ATP menghasilkan energi 'primer'");
      expect(calls.some((url) => url.includes("youtubei/v1/player"))).toBe(true);
      expect(calls.some((url) => url.includes("api/timedtext"))).toBe(true);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("decodes caption XML into plain text and strips entities and tags", () => {
    const xml = [
      '<timedtext format="3"><body>',
      '<p t="0" d="1000">Mitokondria &amp; ATP</p>',
      '<p t="1000" d="1000">menghasilkan <c>energi</c> &#39;primer&#39;</p>',
      "</body></timedtext>",
    ].join("");
    expect(captionXmlToText(xml)).toBe("Mitokondria & ATP menghasilkan energi 'primer'");
  });

  it("prefers an Indonesian caption over an English one, manual over auto", () => {
    const chosen = pickCaptionTrack([
      { baseUrl: "en-asr", languageCode: "en", kind: "asr" },
      { baseUrl: "id-auto", languageCode: "id", kind: "asr" },
      { baseUrl: "en-manual", languageCode: "en" },
      { baseUrl: "id-manual", languageCode: "id" },
    ]);
    expect(chosen?.baseUrl).toBe("id-manual");
  });

  it("prefers a manual English caption over an auto-generated one", () => {
    const chosen = pickCaptionTrack([
      { baseUrl: "en-asr", languageCode: "en", kind: "asr" },
      { baseUrl: "ja-manual", languageCode: "ja" },
    ]);
    // bahasa didahulukan: Inggris menang atas Jepang meski Jepang manual
    expect(chosen?.baseUrl).toBe("en-asr");
  });
});
