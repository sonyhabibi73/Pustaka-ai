import { Download, Palette, ShieldCheck, SlidersHorizontal, UserRound } from "lucide-react";
import { redirect } from "next/navigation";

import { ProfileForm } from "@/components/account/profile-form";
import { StudyPrefsForm } from "@/components/account/study-prefs-form";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemePicker } from "@/components/ui/theme-picker";
import { prisma, withDbRetry } from "@/lib/db";
import { getStudyPrefs } from "@/lib/study/preferences-store";
import { getSession } from "@/lib/security/authz";
import { formatDate } from "@/lib/utils";
import { signOutAction, signOutEverywhere } from "./actions";

export default async function PengaturanPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/sign-in");
  const userId = session.user.id;
  const now = new Date();

  const [dueCards, account, activeSessions, prefDocuments] = await withDbRetry(() =>
    Promise.all([
      prisma.flashcard.count({ where: { userId, dueAt: { lte: now } } }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, image: true, createdAt: true },
      }),
      prisma.session.count({ where: { userId, expires: { gt: now } } }),
      prisma.document.findMany({
        where: { userId, flashcards: { some: {} } },
        orderBy: { title: "asc" },
        select: { id: true, title: true, _count: { select: { flashcards: true } } },
      }),
    ]),
  );
  const prefs = await getStudyPrefs();

  return (
    <AppShell dueCount={dueCards} userName={session.user.name ?? session.user.email ?? "Pengguna"}>
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <header className="border-line border-b pb-6">
          <p className="text-muted-foreground font-mono text-xs font-semibold tracking-[0.14em]">
            PENGATURAN
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Atur <span className="text-brand">akun</span> & cara kamu belajar.
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
            Profil, tampilan, preferensi ulangan, keamanan, dan data—semuanya di satu tempat.
          </p>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* ── Profil ─────────────────────────────────────────── */}
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="text-muted-foreground size-5" aria-hidden="true" />
                Profil
              </CardTitle>
              <CardDescription>
                Nama ini muncul di sidebar dan menandai materi milikmu.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="border-line flex items-center gap-4 border pb-5">
                {account?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- avatar Google lintas domain, next/image butuh konfigurasi remotePatterns.
                  <img
                    src={account.image}
                    alt=""
                    className="border-ink size-14 border-2 object-cover"
                  />
                ) : (
                  <span className="bg-highlight text-ink border-ink inline-flex size-14 items-center justify-center border-2 font-mono text-xl font-bold">
                    {(account?.name ?? account?.email ?? "?").slice(0, 1).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-bold">{account?.name ?? "—"}</p>
                  <p className="text-muted-foreground truncate text-sm">{account?.email ?? "—"}</p>
                  <p className="text-muted-foreground mt-0.5 font-mono text-xs">
                    Bergabung {account ? formatDate(account.createdAt) : "—"}
                  </p>
                </div>
              </div>
              <ProfileForm defaultName={account?.name ?? session.user.name ?? ""} />
            </CardContent>
          </Card>

          {/* ── Tampilan ──────────────────────────────────────── */}
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="text-muted-foreground size-5" aria-hidden="true" />
                Tampilan
              </CardTitle>
              <CardDescription>
                Berlaku untuk seluruh halaman, disimpan di perangkat ini.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <ThemePicker />
              <div className="border-line bg-muted/40 rounded-md border border-dashed p-4">
                <p className="text-sm font-semibold">Contoh kartu</p>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  Apa yang dimaksud dengan interval ulangan?
                </p>
                <p className="border-line bg-card mt-3 rounded-sm border px-3 py-2 text-sm">
                  Jeda waktu antar ulangan yang tumbuh setiap kali kamu menjawab dengan benar.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Preferensi belajar ────────────────────────────── */}
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SlidersHorizontal className="text-muted-foreground size-5" aria-hidden="true" />
                Preferensi belajar
              </CardTitle>
              <CardDescription>Mengatur cara halaman Ulangan menyusun sesimu.</CardDescription>
            </CardHeader>
            <CardContent>
              <StudyPrefsForm
                prefs={prefs}
                documents={prefDocuments.map((document) => ({
                  id: document.id,
                  title: document.title,
                  cardCount: document._count.flashcards,
                }))}
              />
            </CardContent>
          </Card>

          {/* ── Keamanan ──────────────────────────────────────── */}
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="text-muted-foreground size-5" aria-hidden="true" />
                Keamanan
              </CardTitle>
              <CardDescription>Sesi masuk tersimpan sampai 30 hari.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="border-line flex items-center justify-between gap-4 border pb-4">
                <div>
                  <p className="text-sm font-semibold">Sesi aktif</p>
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    {activeSessions} perangkat sedang masuk ke akun ini.
                  </p>
                </div>
                <span className="border-line bg-muted rounded-pill border px-3 py-1 font-mono text-sm font-bold tabular-nums">
                  {activeSessions}
                </span>
              </div>

              <form action={signOutEverywhere}>
                <Button type="submit" variant="destructive" size="sm">
                  Keluar di semua perangkat
                </Button>
              </form>
              <p className="text-muted-foreground -mt-1 text-xs leading-relaxed">
                Menghapus seluruh sesi tersimpan—aktifkan lagi lewat masuk Google di perangkat yang
                kamu pakai.
              </p>

              <form action={signOutAction}>
                <Button type="submit" variant="secondary" size="sm">
                  Keluar dari perangkat ini
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* ── Data ──────────────────────────────────────────── */}
          <Card className="min-w-0 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="text-muted-foreground size-5" aria-hidden="true" />
                Data kamu
              </CardTitle>
              <CardDescription>
                Unduh salinan lengkap milikmu—bisa dibuka kapan saja tanpa aplikasi ini.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <ul className="grid gap-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="bg-primary size-2 rounded-full" aria-hidden="true" />
                  Materi beserta status dan ringkasannya
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-primary size-2 rounded-full" aria-hidden="true" />
                  Flashcard beserta riwayat ulangan & nilainya
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-primary size-2 rounded-full" aria-hidden="true" />
                  Judul kuis beserta skor percobaan
                </li>
              </ul>
              <Button asChild variant="secondary" size="sm">
                {/* <a> biasa: unduhan berkas dilewati ke server, bukan ke router Next. */}
                <a href="/api/export" download>
                  <Download className="size-4" aria-hidden="true" />
                  Unduh data (JSON)
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
