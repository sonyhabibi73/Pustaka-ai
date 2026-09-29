// Murni manipulasi string: dipakai dari server (ringkasan) dan client (chat),
// sengaja TIDAK diimpor "server-only".
import DOMPurify from "isomorphic-dompurify";

export function sanitizeAiMarkdown(markdown: string) {
  return DOMPurify.sanitize(markdown, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}
