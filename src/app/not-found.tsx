import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main-content" className="grid min-h-dvh place-items-center p-5">
      <div className="border-ink bg-card shadow-2 w-full max-w-md rounded-md border-2 p-8 text-center">
        <span className="border-ink bg-highlight text-ink shadow-1 mx-auto flex size-12 items-center justify-center rounded-md border-2">
          <Compass className="size-6" aria-hidden="true" />
        </span>
        <p className="mt-5 font-mono text-xs font-bold tracking-[0.16em] uppercase">404</p>
        <h1 className="text-h3 mt-2 font-extrabold">Halaman tidak ditemukan.</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Tautannya mungkin sudah dipindah, atau materinya sudah kamu hapus.
        </p>
        <div className="mt-6 flex justify-center">
          <Button asChild variant="secondary">
            <Link href="/">Kembali ke beranda</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
