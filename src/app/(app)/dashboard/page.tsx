import Link from "next/link";
import { ArrowRight, FilePlus2, Files, Layers3 } from "lucide-react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/security/authz";
import { prisma } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import { UploadForm } from "@/components/documents/upload-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import { documentStatusLabel } from "@/lib/documents/labels";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/sign-in");
  const [documents, dueCards] = await Promise.all([
    prisma.document.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: 20,
      select: { id: true, title: true, kind: true, status: true, updatedAt: true },
    }),
    prisma.flashcard.count({ where: { userId: session.user.id, dueAt: { lte: new Date() } } }),
  ]);

  return (
    <AppShell dueCount={dueCards} userName={session.user.name ?? session.user.email ?? "Pengguna"}>
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <header className="mb-10">
          <p className="text-muted-foreground font-mono text-xs font-semibold tracking-[0.14em]">
            WORKSPACE / 01
          </p>
          <h1 className="text-h1 mt-3 font-extrabold">
            Belajar dari sumber yang <span className="hl">kamu percaya</span>.
          </h1>
        </header>

        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="min-w-0" id="materi">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Materi terbaru</CardTitle>
                  <Files className="text-muted-foreground size-5" aria-hidden="true" />
                </div>
              </CardHeader>
              <CardContent>
                {documents.length ? (
                  <ul className="divide-line divide-y-2">
                    {documents.map((document) => (
                      <li key={document.id}>
                        <Link
                          className="hover:bg-muted focus-visible:ring-ring flex items-center justify-between gap-4 rounded-sm px-2 py-4 outline-none focus-visible:ring-2"
                          href={`/documents/${document.id}`}
                        >
                          <span className="min-w-0">
                            <span className="block truncate font-bold">{document.title}</span>
                            <span className="text-muted-foreground mt-1 block font-mono text-xs">
                              {document.kind} · {formatDate(document.updatedAt)}
                            </span>
                          </span>
                          <Badge variant={document.status === "READY" ? "highlight" : "muted"}>
                            {documentStatusLabel(document.status)}
                          </Badge>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    icon={FilePlus2}
                    title="Belum ada materi"
                    description="Unggah satu sumber—PDF, DOCX, TXT, atau link YouTube—untuk membuat ruang belajar pertamamu."
                  />
                )}
              </CardContent>
            </Card>
          </section>

          <aside className="min-w-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tambahkan materi</CardTitle>
              </CardHeader>
              <CardContent>
                <UploadForm />
              </CardContent>
            </Card>

            <Card className="bg-highlight text-ink">
              <CardContent>
                <span className="border-ink bg-surface inline-flex size-10 items-center justify-center rounded-md border-2">
                  <Layers3 className="size-5" aria-hidden="true" />
                </span>
                <p className="mt-4 font-mono text-4xl font-bold tabular-nums">{dueCards}</p>
                <p className="mt-1 text-sm font-semibold">
                  kartu jatuh tempo hari ini—sepuluh menit sudah cukup.
                </p>
                <Button asChild className="mt-5 w-full" variant="secondary">
                  <Link href="/belajar">
                    {dueCards ? "Mulai ulangian" : "Buka ulangian"}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
