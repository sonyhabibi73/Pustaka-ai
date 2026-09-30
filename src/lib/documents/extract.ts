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

/**
 * Daftar track caption diambil lewat endpoint Innertube YouTube.
 *
 * `youtube.com/api/timedtext` yang lama sekarang selalu membalas body kosong
 * (0 byte) tanpa bukti asal-usul, sehingga setiap ekstraksi gagal dengan
 * YOUTUBE_CAPTIONS_UNAVAILABLE. Innertube `player` masih mengembalikan
 * `captionTracks` lengkap dengan `baseUrl` bertanda tangan yang bisa dibaca.
 */
const INNERTUBE_KEY = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";
const INNERTUBE_ENDPOINT = `https://www.youtube.com/youtubei/v1/player?key=${INNERTUBE_KEY}`;
const YOUTUBE_APP_UA = "com.google.android.youtube/20.10.38 (Linux; U; Android 11) gzip";

/** Dua profil klien yang terbukti mengembalikan caption tanpa perlu token bukti asal. */
const INNERTUBE_CLIENTS = [
  { clientName: "ANDROID", clientVersion: "20.10.38", androidSdkVersion: 30, hl: "id", gl: "ID" },
  { clientName: "IOS", clientVersion: "20.10.4", deviceMake: "Apple", hl: "id", gl: "ID" },
] as const;

type CaptionTrack = {
  baseUrl: string;
  languageCode?: string;
  kind?: string;
};

export type { CaptionTrack };

function captionUrl(track: CaptionTrack) {
  const url = new URL(track.baseUrl);
  // Buang format JSON yang ternyata diabaikan YouTube; XML adalah andalan.
  url.searchParams.delete("fmt");
  return url.toString();
}

async function requestCaptionTracks(videoId: string): Promise<CaptionTrack[]> {
  for (const client of INNERTUBE_CLIENTS) {
    try {
      const response = await fetch(INNERTUBE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "User-Agent": YOUTUBE_APP_UA },
        body: JSON.stringify({
          context: { client },
          videoId,
          contentCheckOk: true,
          racyCheckOk: true,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) continue;
      const payload = (await response.json().catch(() => null)) as {
        captions?: { playerCaptionsTracklistRenderer?: { captionTracks?: CaptionTrack[] } };
      } | null;
      const tracks = payload?.captions?.playerCaptionsTracklistRenderer?.captionTracks ?? [];
      const usable = tracks.filter(
        (track) => typeof track.baseUrl === "string" && track.baseUrl.length > 0,
      );
      if (usable.length) return usable;
    } catch {
      // coba profil klien berikutnya
    }
  }
  return [];
}

/**
 * Urutan pilihan track: bahasa Indonesia lebih dulu, lalu Inggris, lalu sisanya;
 * di dalam bahasa yang sama, caption buatan manual diunggulkan atas auto-caption.
 */
export function pickCaptionTrack(tracks: CaptionTrack[]) {
  if (!tracks.length) return undefined;
  const rank = (track: CaptionTrack) => {
    const language = track.languageCode ?? "";
    const preference = language.startsWith("id") ? 0 : language.startsWith("en") ? 1 : 2;
    const authored = track.kind === "asr" ? 1 : 0;
    return preference * 10 + authored;
  };
  return [...tracks].sort((a, b) => rank(a) - rank(b))[0];
}

function decodeEntities(value: string) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, digits: string) => String.fromCodePoint(Number(digits)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

/**
 * Terima dua bentuk yang dipakai YouTube: `<text>` (transcript lama) dan
 * `<p>` (timedtext format 3), lalu buang tag segmen seperti `<c>` atau
 * penanda waktu `<00:00:01.000>`.
 */
export function captionXmlToText(xml: string) {
  const segments = [...xml.matchAll(/<(?:text|p)[^>]*>([\s\S]*?)<\/(?:text|p)>/g)].map((match) =>
    decodeEntities(match[1].replace(/<[^>]+>/g, "")),
  );
  return segments.join(" ").replace(/\s+/g, " ").trim();
}

export async function extractYouTubeTranscript(videoId: string) {
  const tracks = await requestCaptionTracks(videoId).catch(() => [] as CaptionTrack[]);
  const track = pickCaptionTrack(tracks);
  if (!track) throw new Error("YOUTUBE_CAPTIONS_UNAVAILABLE");

  const response = await fetch(captionUrl(track), {
    headers: { "User-Agent": YOUTUBE_APP_UA },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  }).catch(() => null);
  if (!response?.ok) throw new Error("YOUTUBE_CAPTIONS_UNAVAILABLE");

  const text = captionXmlToText(await response.text());
  if (!text) throw new Error("YOUTUBE_CAPTIONS_UNAVAILABLE");
  return text;
}
