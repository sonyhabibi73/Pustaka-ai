import "server-only";
import { fileTypeFromBuffer } from "file-type";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const ALLOWED_FILE_TYPES = {
  "application/pdf": "PDF",
  "text/plain": "TEXT",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "WORD",
} as const;

export type AllowedMimeType = keyof typeof ALLOWED_FILE_TYPES;

export async function validateStudyFile(file: File) {
  if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) throw new Error("INVALID_FILE_SIZE");
  if (!(file.type in ALLOWED_FILE_TYPES)) throw new Error("INVALID_FILE_TYPE");

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = await fileTypeFromBuffer(buffer);
  const mime = file.type as AllowedMimeType;
  if (mime === "text/plain") {
    if (detected) throw new Error("INVALID_FILE_SIGNATURE");
  } else if (detected?.mime !== mime) {
    throw new Error("INVALID_FILE_SIGNATURE");
  }

  return { buffer, mime, kind: ALLOWED_FILE_TYPES[mime] };
}

export function validateYouTubeUrl(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    // new URL throws a bare TypeError, which apiError would report as a 500.
    throw new Error("INVALID_YOUTUBE_URL");
  }
  const accepted = ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"];
  if (url.protocol !== "https:" || !accepted.includes(url.hostname))
    throw new Error("INVALID_YOUTUBE_URL");
  const videoId = url.hostname === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v");
  if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) throw new Error("INVALID_YOUTUBE_URL");
  return { url: url.toString(), videoId };
}
