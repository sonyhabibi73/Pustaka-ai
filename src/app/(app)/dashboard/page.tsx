import Link from "next/link";
import { FilePlus2, Files, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import { UploadForm } from "@/components/documents/upload-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { documentStatusLabel } from "@/lib/documents/labels";

export default async function DashboardPage() {
  const session = await auth();
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
            WORKSPACE
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
            Belajar dari sumber yang Anda percaya.
          </h1>
        </header>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section id="materi">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Materi terbaru</CardTitle>
                  <Files className="text-muted-foreground size-4" aria-hidden="true" />
                </div>
              </CardHeader>
              <CardContent>
                {documents.length ? (
                  <ul className="divide-border divide-y">
                    {documents.map((document) => (
                      <li key={document.id}>
                        <Link
                          className="hover:bg-muted focus-visible:ring-ring flex items-center justify-between gap-4 py-4 outline-none focus-visible:ring-2"
                          href={`/documents/${document.id}`}
                        >
                          <span className="min-w-0">
                            <span className="block truncate font-medium">{document.title}</span>
                            <span className="text-muted-foreground mt-1 block font-mono text-xs">
                              {document.kind} · {formatDate(document.updatedAt)}
                            </span>
                          </span>
                          <Badge
                            className={
                              document.status === "READY"
                                ? "bg-secondary border-transparent"
                                : "text-muted-foreground"
                            }
                          >
                            {documentStatusLabel(document.status)}
                          </Badge>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-10 text-center">
                    <FilePlus2
                      className="text-muted-foreground mx-auto size-5"
                      aria-hidden="true"
                    />
                    <p className="mt-3 font-medium">Belum ada materi</p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Unggah satu sumber untuk membuat ruang belajar pertama Anda.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tambahkan materi</CardTitle>
              </CardHeader>
              <CardContent>
                <UploadForm />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <Sparkles className="size-4" aria-hidden="true" />
                <p className="mt-4 text-2xl font-semibold tabular-nums">{dueCards}</p>
                <p className="text-muted-foreground text-sm">flashcard perlu diulang hari ini</p>
                <Button asChild className="mt-4 w-full" size="sm" variant="outline">
                  <Link href="/belajar">{dueCards ? "Mulai ulangian" : "Buka ulangian"}</Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
