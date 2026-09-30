"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const links = [
  { anchor: "fitur", label: "Fitur" },
  { anchor: "cara-kerja", label: "Cara kerja" },
  { anchor: "faq", label: "FAQ" },
  { anchor: "blog", label: "Blog" },
] as const;

/**
 * §5.1 — Navbar mengambang yang tetap menempel di atas: kartu tersendiri dengan
 * border tinta 2px dan bayangan yang menguat saat digulir, sehingga isi halaman
 * terlihat menyusup di sisi kirinya. Jangkar (#fitur dkk.) otomatis memakai
 * awalan `/#` di luar beranda supaya tidak mati di halaman blog.
 */
export function Navbar() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let active = true;
    // CTA menyesuaikan sesi: pengguna yang sudah masuk tidak perlu lagi
    // melewati halaman "Masuk" hanya untuk kembali ke workspace.
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { user?: { id?: string } } | null) => {
        if (active && data?.user?.id) setAuthed(true);
      })
      .catch(() => {
        /* sesi tidak terbaca: CTA tetap versi tamu */
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function hrefFor(anchor: string) {
    if (anchor === "blog") return "/blog";
    return onHome ? `#${anchor}` : `/#${anchor}`;
  }

  return (
    <header className="sticky top-0 z-50 pt-3">
      <div className="mx-auto max-w-6xl px-3 sm:px-6">
        <div
          className={cn(
            "border-ink bg-background/90 flex h-16 items-center justify-between gap-4 rounded-md border-2 px-4 backdrop-blur-md transition-shadow duration-200 sm:px-5",
            scrolled ? "shadow-2" : "shadow-1",
          )}
        >
          <Link
            href="/"
            className="text-lg font-extrabold tracking-tight"
            aria-label="Pelajari AI — beranda"
          >
            pelajari<span className="text-primary">.ai</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
            {links.map((link) => (
              <Link
                key={link.anchor}
                href={hrefFor(link.anchor)}
                aria-current={
                  link.anchor === "blog" && pathname.startsWith("/blog") ? "page" : undefined
                }
                className={cn(
                  "text-foreground hover:bg-muted rounded-pill px-3 py-2 text-sm font-semibold transition-colors duration-150",
                  link.anchor === "blog" && pathname.startsWith("/blog") && "bg-muted",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle className="border-ink bg-card text-foreground hover:bg-muted rounded-pill hidden size-10 items-center justify-center border-2 transition-colors duration-150 sm:inline-flex" />
            <Link
              className={cn(
                authed
                  ? buttonVariants({ size: "sm" })
                  : buttonVariants({ variant: "secondary", size: "sm" }),
              )}
              href={authed ? "/dashboard" : "/sign-in"}
            >
              {authed ? "Buka workspace" : "Masuk"}
            </Link>
            {authed ? null : (
              <Link
                className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}
                href="/dashboard"
              >
                Mulai gratis
              </Link>
            )}
            <button
              type="button"
              className="border-ink bg-card rounded-pill inline-flex size-10 items-center justify-center border-2 md:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Tutup menu" : "Buka menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div
          id="menu-mobile"
          className="border-ink bg-background shadow-2 fixed inset-x-3 top-[76px] bottom-3 z-40 overflow-y-auto rounded-md border-2 p-5 md:hidden"
        >
          <nav className="flex flex-col gap-2" aria-label="Navigasi seluler">
            {links.map((link) => (
              <Link
                key={link.anchor}
                href={hrefFor(link.anchor)}
                aria-current={
                  link.anchor === "blog" && pathname.startsWith("/blog") ? "page" : undefined
                }
                onClick={() => setOpen(false)}
                className="border-ink bg-card shadow-1 rounded-md border-2 px-4 py-3.5 text-base font-bold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <Button asChild variant={authed ? "default" : "secondary"}>
              <Link href={authed ? "/dashboard" : "/sign-in"}>
                {authed ? "Buka workspace" : "Masuk"}
              </Link>
            </Button>
            {authed ? null : (
              <Button asChild>
                <Link href="/dashboard">Mulai gratis</Link>
              </Button>
            )}
            <div className="mt-2 flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-semibold">Tema tampilan</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
