import "server-only";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL belum dikonfigurasi.");
  // Koneksi ke pooler Neon bisa terputus di tengah jalan ("Read", ETIMEDOUT).
  // Batasi waktu hubung supaya permintaan tidak menggantung, dan tutup socket
  // yang menganggur sebelum dipakai ulang oleh server.
  return new PrismaClient({
    adapter: new PrismaPg({
      connectionString,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 15_000,
    }),
  });
}

/**
 * Kegagalan koneksi yang biasanya bersifat sementara dan layak dicoba ulang.
 * Error query (constraint, data tidak ada) tidak termasuk di sini.
 */
const TRANSIENT_NEEDLES = [
  "etimedout",
  "econnreset",
  "econnrefused",
  "epipe",
  "socket hang up",
  "connection terminated",
  "connection closed",
  "read error",
  "client closed",
  "timeout",
  "p1001",
  "p1002",
  "p1008",
  "p2024",
  "fetch failed",
];

export function isTransientDbError(error: unknown) {
  const seen = new Set<unknown>();
  let current: unknown = error;
  while (current && typeof current === "object" && !seen.has(current)) {
    seen.add(current);
    const candidate = current as { message?: string; code?: string };
    const text = `${candidate.message ?? ""} ${candidate.code ?? ""}`.toLowerCase();
    if (TRANSIENT_NEEDLES.some((needle) => text.includes(needle))) return true;
    current = (current as { cause?: unknown }).cause;
  }
  return false;
}

/** Jalankan query dengan percobaan ulang singkat saat koneksi DB putus sebentar. */
export async function withDbRetry<T>(run: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await run();
    } catch (error) {
      lastError = error;
      if (!isTransientDbError(error) || attempt === attempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, 120 * attempt));
    }
  }
  throw lastError;
}

function resolveClient() {
  const client = globalThis.prisma ?? createPrismaClient();
  if (!globalThis.prisma) globalThis.prisma = client;
  return client;
}

// Instantiated on first query rather than at import. `next build` collects page
// data by importing every route, so a client created eagerly would require a
// reachable DATABASE_URL just to produce a build.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = resolveClient();
    // Bound to the real instance: PrismaClient keeps state in private fields,
    // so a receiver of the proxy would break its field lookups.
    const value = Reflect.get(client, property, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
  has(_target, property) {
    return Reflect.has(resolveClient(), property);
  },
  getPrototypeOf() {
    return Reflect.getPrototypeOf(resolveClient());
  },
});
