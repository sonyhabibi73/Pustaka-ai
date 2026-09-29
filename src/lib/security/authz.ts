import "server-only";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHENTICATED");
  return session.user.id;
}

export async function getOwnedDocument(documentId: string, userId: string) {
  return prisma.document.findFirst({ where: { id: documentId, userId } });
}
