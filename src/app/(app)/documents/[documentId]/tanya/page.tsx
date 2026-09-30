import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/security/authz";
import { prisma } from "@/lib/db";
import { ChatPanel, type ChatMessage } from "@/components/chat/chat-panel";
import { excerptOf } from "@/lib/ai/excerpt";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MAX_HISTORY = 60;

export default async function AskDocumentPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  const session = await getSession();
  if (!session?.user?.id) redirect("/sign-in");

  const document = await prisma.document.findFirst({
    where: { id: documentId, userId: session.user.id },
    select: { id: true, status: true, title: true },
  });
  if (!document) notFound();

  if (document.status !== "READY") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Materi belum siap untuk ditanyakan</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          Tanya materi baru bisa dipakai setelah dokumen selesai diekstrak dan diberi embedding.
          Muat ulang halaman ini beberapa saat lagi.
        </CardContent>
      </Card>
    );
  }

  const thread = await prisma.chatThread.findFirst({
    where: { documentId: document.id, userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: MAX_HISTORY,
        select: {
          role: true,
          content: true,
          sources: {
            select: {
              rank: true,
              chunk: { select: { chunkIndex: true, content: true } },
            },
          },
        },
      },
    },
  });

  const messages: ChatMessage[] = (thread?.messages ?? [])
    .filter((message) => message.content.trim().length > 0)
    .reverse()
    .map((message) => ({
      role: message.role === "USER" ? "user" : "assistant",
      content: message.content,
      citations:
        message.role === "ASSISTANT"
          ? [...message.sources]
              .sort((a, b) => a.rank - b.rank)
              .map((source) => ({
                chunkIndex: source.chunk.chunkIndex,
                excerpt: excerptOf(source.chunk.content),
              }))
          : undefined,
    }));

  return (
    <ChatPanel
      documentId={document.id}
      documentTitle={document.title}
      initialMessages={messages}
      initialThreadId={thread?.id}
    />
  );
}
