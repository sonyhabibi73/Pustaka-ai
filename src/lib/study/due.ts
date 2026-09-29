import "server-only";
import { prisma } from "@/lib/db";

/** Jumlah kartu yang jatuh tempo sekarang — dipakai badge navigasi & dashboard. */
export function countDueCards(userId: string) {
  return prisma.flashcard.count({ where: { userId, dueAt: { lte: new Date() } } });
}

/**
 * Ubah sourceChunkIds milik kartu menjadi nomor bagian (chunkIndex + 1) agar
 * kartu bisa menampilkan "Sumber: bagian 3" tanpa membocorkan id internal.
 */
export async function resolveChunkIndexes(sourceChunkIds: string[]) {
  const ids = [...new Set(sourceChunkIds)];
  if (!ids.length) return [] as number[];
  const chunks = await prisma.documentChunk.findMany({
    where: { id: { in: ids } },
    select: { id: true, chunkIndex: true },
  });
  const byId = new Map(chunks.map((chunk) => [chunk.id, chunk.chunkIndex + 1]));
  return sourceChunkIds
    .map((id) => byId.get(id))
    .filter((value): value is number => typeof value === "number")
    .sort((a, b) => a - b);
}
