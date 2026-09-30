"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Memproses ulang dokumen yang gagal (misalnya ekstraksi caption YouTube yang
 * sempat gagal). Setelah server menerima permintaan, halaman dimuat ulang
 * berkala sampai statusnya berubah — tombol hilang dengan sendirinya begitu
 * kartu "gagal" berganti menjadi "sedang diproses".
 */
export function RetryDocumentButton({ documentId }: { documentId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const refreshTimer = useRef<number | null>(null);
  const stopTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (refreshTimer.current) window.clearInterval(refreshTimer.current);
      if (stopTimer.current) window.clearTimeout(stopTimer.current);
    },
    [],
  );

  async function retry() {
    setPending(true);
    setError("");
    try {
      const response = await fetch(`/api/documents/${documentId}/retry`, {
        method: "POST",
        signal: AbortSignal.timeout(20_000),
      });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(body?.error ?? "Gagal memulai proses ulang.");
      if (refreshTimer.current) window.clearInterval(refreshTimer.current);
      refreshTimer.current = window.setInterval(() => router.refresh(), 3000);
      stopTimer.current = window.setTimeout(() => {
        if (refreshTimer.current) window.clearInterval(refreshTimer.current);
        refreshTimer.current = null;
        setPending(false);
        setError("Proses ulang belum selesai. Muat ulang halaman untuk melihat statusnya.");
      }, 90_000);
    } catch (caught) {
      setPending(false);
      setError(
        caught instanceof DOMException && caught.name === "TimeoutError"
          ? "Server lama merespons. Coba lagi."
          : caught instanceof Error
            ? caught.message
            : "Gagal memulai proses ulang.",
      );
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button loading={pending} onClick={retry} type="button">
        <RefreshCw className="size-4" aria-hidden="true" />
        {pending ? "Memproses ulang…" : "Coba proses ulang"}
      </Button>
      {error ? (
        <p className="text-destructive text-sm font-semibold" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
