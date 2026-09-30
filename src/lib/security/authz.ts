import "server-only";
import type { Session } from "next-auth";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma, withDbRetry } from "@/lib/db";

/**
 * Ambil sesi pengguna yang sedang masuk, dengan percobaan ulang singkat.
 *
 * NextAuth membaca sesi lewat database. Saat koneksi ke Neon terputus sebentar,
 * `auth()` melempar AdapterError lalu membalas `null` — kalau langsung dipercaya,
 * pengguna yang sesungguhnya sudah masuk justru dilempar ke halaman sign-in
 * atau API membalas 401 tanpa sebab. Cookie sesi yang masih ada adalah tanda
 * bahwa `null` tadi kemungkinan besar kegagalan sementara, jadi dicoba ulang.
 */
export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const hasSessionCookie = jar
    .getAll()
    .some((cookie) => cookie.name.includes("authjs.session-token"));
  const attempts = hasSessionCookie ? 3 : 1;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const session = await auth();
      if (session?.user?.id) return session;
      if (!hasSessionCookie || attempt === attempts) return session ?? null;
    } catch (error) {
      if (attempt === attempts) throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, 150 * attempt));
  }
  return null;
}

export async function requireUserId() {
  const session = await withDbRetry(() => getSession());
  if (!session?.user?.id) throw new Error("UNAUTHENTICATED");
  return session.user.id;
}

export async function getOwnedDocument(documentId: string, userId: string) {
  return prisma.document.findFirst({ where: { id: documentId, userId } });
}
