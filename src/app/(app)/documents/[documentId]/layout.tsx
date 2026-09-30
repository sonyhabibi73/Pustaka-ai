import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/security/authz";
import { prisma } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import { DocumentTabs } from "@/components/documents/document-tabs";
import { Badge } from "@/components/ui/badge";
import { documentStatusLabel } from "@/lib/documents/labels";
import { countDueCards } from "@/lib/study/due";
import { formatDate } from "@/lib/utils";

export default async function DocumentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ documentId: string }>;
}) {
  const [{ documentId }, session] = await Promise.all([params, getSession()]);
  if (!session?.user?.id) redirect("/sign-in");
  const [document, dueCount] = await Promise.all([
    prisma.document.findFirst({
      where: { id: documentId, userId: session.user.id },
      select: {
        id: true,
        title: true,
        kind: true,
        status: true,
        createdAt: true,
        quizzes: {
          select: { id: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    }),
    countDueCards(session.user.id),
  ]);
  if (!document) notFound();

  const quizId = document.quizzes[0]?.id ?? null;
  const isReady = document.status === "READY";

  return (
    <AppShell dueCount={dueCount} userName={session.user.name ?? session.user.email ?? "Pengguna"}>
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <Link
          className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center gap-2 text-sm"
          href="/dashboard"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Kembali ke workspace
        </Link>
        <header className="border-line mt-7 flex flex-wrap items-start justify-between gap-4 border-b-2 pb-6">
          <div>
            <p className="text-muted-foreground font-mono text-xs uppercase">
              {document.kind} · {formatDate(document.createdAt)}
            </p>
            <h1 className="text-h1 mt-2 font-extrabold">{document.title}</h1>
          </div>
          <Badge variant={isReady ? "highlight" : "muted"}>
            {documentStatusLabel(document.status)}
          </Badge>
        </header>
        {isReady ? (
          <div className="mt-5">
            <DocumentTabs documentId={document.id} quizId={quizId} />
          </div>
        ) : null}
        <div className="mt-8">{children}</div>
      </div>
    </AppShell>
  );
}
