"use client";

import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-dvh place-items-center p-5" id="main-content">
      <div className="border-ink bg-card shadow-2 w-full max-w-md rounded-md border-2 p-8 text-center">
        <span className="border-ink bg-highlight text-ink shadow-1 mx-auto flex size-12 items-center justify-center rounded-md border-2">
          <TriangleAlert className="size-6" aria-hidden="true" />
        </span>
        <p className="mt-5 font-mono text-xs font-bold tracking-[0.16em] uppercase">ERROR</p>
        <h1 className="text-h3 mt-2 font-extrabold">Workspace tidak dapat dimuat.</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Coba lagi. Jika masalah berlanjut, periksa konfigurasi layananmu.
        </p>
        <div className="mt-6 flex justify-center">
          <Button onClick={reset}>Coba lagi</Button>
        </div>
      </div>
    </main>
  );
}
