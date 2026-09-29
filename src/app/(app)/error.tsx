"use client";
import { Button } from "@/components/ui/button";
export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-dvh place-items-center p-5">
      <div className="max-w-md">
        <p className="text-muted-foreground font-mono text-xs">ERROR</p>
        <h1 className="mt-3 text-2xl font-semibold">Workspace tidak dapat dimuat.</h1>
        <p className="text-muted-foreground mt-3 leading-7">
          Coba lagi. Jika masalah berlanjut, periksa konfigurasi layanan Anda.
        </p>
        <Button className="mt-6" onClick={reset}>
          Coba lagi
        </Button>
      </div>
    </main>
  );
}
