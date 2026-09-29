import "server-only";
import DOMPurify from "isomorphic-dompurify";

export function sanitizeAiMarkdown(markdown: string) {
  return DOMPurify.sanitize(markdown, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}
