import Link from "next/link";
import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInPage() {
  return (
    <main className="grid min-h-dvh place-items-center p-5">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link href="/" className="font-bold">
            pelajari<span className="text-accent">.ai</span>
          </Link>
          <CardTitle className="mt-10 text-2xl tracking-tight">Masuk untuk mulai belajar</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6 leading-6">
            Materi dan riwayat belajar Anda disimpan dalam workspace pribadi.
          </p>
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <Button className="w-full" type="submit">
              Lanjutkan dengan Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
