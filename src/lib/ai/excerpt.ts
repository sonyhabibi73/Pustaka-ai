/** Potongan pendek dari isi chunk — dipakai sebagai pratinjau sitasi di chat. */
export function excerptOf(content: string, maxLength = 280) {
  const clean = content.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).replace(/\s+\S*$/, "")}…`;
}
