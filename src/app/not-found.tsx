import Link from "next/link";
export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center p-5 text-center">
      <div>
        <p className="text-muted-foreground font-mono text-xs">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Halaman tidak ditemukan.</h1>
        <Link className="mt-6 inline-block underline underline-offset-4" href="/">
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
