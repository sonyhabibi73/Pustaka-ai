import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

import { signIn } from "@/lib/auth";
import { getSession } from "@/lib/security/authz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";

/**
 * Kalau sesi masih ada, halaman masuk tidak ditampilkan lagi—pengguna
 * langsung dilempar ke workspace sehingga kembali dari halaman publik tidak
 * perlu login ulang.
 */
export default async function SignInPage() {
  const session = await getSession();
  if (session?.user?.id) redirect("/dashboard");

  return (
    <main id="main-content" className="grid min-h-dvh place-items-center p-5">
      <div className="w-full max-w-md">
        <div className="mb-5 flex items-center justify-between">
          <Link href="/" className="text-lg font-extrabold tracking-tight">
            pelajari<span className="text-primary">.ai</span>
          </Link>
          <ThemeToggle />
        </div>

        <Card>
          <CardHeader>
            <span className="border-ink bg-highlight text-ink shadow-1 inline-flex size-11 items-center justify-center rounded-md border-2">
              <ShieldCheck className="size-6" aria-hidden="true" />
            </span>
            <CardTitle className="text-h3 mt-4">Masuk untuk mulai belajar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Materi dan riwayat belajar kamu disimpan di workspace pribadi. Satu akun untuk
              ringkasan, flashcard, kuis, dan tutor AI.
            </p>
            <form
              className="mt-6"
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/dashboard" });
              }}
            >
              <Button className="w-full" type="submit">
                Lanjutkan dengan Google
              </Button>
            </form>
            <p className="text-muted-foreground mt-4 text-center text-xs leading-relaxed">
              Tanpa kartu kredit. Lanjutkan kamu menyetujui ketentuan layanan dan kebijakan privasi.
            </p>
          </CardContent>
        </Card>

        <p className="text-muted-foreground mt-5 text-center text-sm">
          Belum punya akun? Masuk dulu, akun dibuat otomatis.
        </p>
      </div>
    </main>
  );
}
