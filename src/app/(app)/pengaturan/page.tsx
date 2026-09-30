import { LogOut, Palette } from "lucide-react";
import { redirect } from "next/navigation";

import { ProfileForm } from "@/components/account/profile-form";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { prisma, withDbRetry } from "@/lib/db";
import { getSession } from "@/lib/security/authz";
import { formatDate } from "@/lib/utils";
import { signOutAction } from "./actions";

export default async function PengaturanPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/sign-in");
  const userId = session.user.id;

  const [dueCards, account] = await withDbRetry(() =>
    Promise.all([
      prisma.flashcard.count({ where: { userId, dueAt: { lte: new Date() } } }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, createdAt: true },
      }),
    ]),
  );

  return (
    <AppShell dueCount={dueCards} userName={session.user.name ?? session.user.email ?? "Pengguna"}>
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <header className="border-line border-b pb-6">
          <p className="text-muted-foreground font-mono text-xs font-semibold tracking-[0.14em]">
            PENGATURAN
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Atur <span className="text-brand">akun</span> & tampilan kamu.
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
            Perubahan langsung berlaku di seluruh ruang kerja.
          </p>
        </header>

        <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>Profil</CardTitle>
              <CardDescription>
                Nama ini yang muncul di sidebar dan menandai materi milikmu.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm defaultName={account?.name ?? session.user.name ?? ""} />
            </CardContent>
          </Card>

          <div className="min-w-0 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <CardTitle>Tampilan</CardTitle>
                  <Palette className="text-muted-foreground size-5 shrink-0" aria-hidden="true" />
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">Mode gelap</p>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                    Mengikuti setelan perangkat; tombol ini untuk memaksa salah satunya.
                  </p>
                </div>
                <ThemeToggle />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Akun</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-muted-foreground font-mono text-[11px] font-semibold tracking-[0.14em] uppercase">
                      Email
                    </dt>
                    <dd className="mt-1 truncate text-sm font-semibold">
                      {account?.email ?? session.user.email ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground font-mono text-[11px] font-semibold tracking-[0.14em] uppercase">
                      Bergabung
                    </dt>
                    <dd className="mt-1 text-sm font-semibold">
                      {account ? formatDate(account.createdAt) : "—"}
                    </dd>
                  </div>
                </dl>
                <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
                  Email berasal dari Google dan tidak bisa diubah di sini.
                </p>

                <form action={signOutAction} className="mt-5">
                  <Button type="submit" variant="destructive" size="sm">
                    <LogOut className="size-4" aria-hidden="true" />
                    Keluar dari akun
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
