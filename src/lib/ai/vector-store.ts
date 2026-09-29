import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

type RetrievedChunk = { id: string; content: string; chunkIndex: number; distance: number };

function toVectorLiteral(vector: number[]) {
  if (vector.length !== 1536 || vector.some((value) => !Number.isFinite(value)))
    throw new Error("INVALID_EMBEDDING");
  return `[${vector.join(",")}]`;
}

export async function saveEmbedding(chunkId: string, embedding: number[]) {
  const vector = toVectorLiteral(embedding);
  await prisma.$executeRaw(Prisma.sql`
    UPDATE "DocumentChunk"
    SET "embedding" = ${vector}::vector
    WHERE "id" = ${chunkId}
  `);
}

export async function retrieveNearestChunks(
  documentId: string,
  embedding: number[],
  limit = 6,
): Promise<RetrievedChunk[]> {
  const vector = toVectorLiteral(embedding);
  return prisma.$queryRaw<RetrievedChunk[]>(Prisma.sql`
    SELECT "id", "content", "chunkIndex", ("embedding" <=> ${vector}::vector) AS "distance"
    FROM "DocumentChunk"
    WHERE "documentId" = ${documentId} AND "embedding" IS NOT NULL
    ORDER BY "embedding" <=> ${vector}::vector ASC
    LIMIT ${Math.min(Math.max(limit, 1), 10)}
  `);
}
