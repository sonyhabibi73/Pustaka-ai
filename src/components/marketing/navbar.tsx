"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const links = [
  { href: "#fitur", label: "Fitur" },
  { href: "#cara-kerja", label: "Cara kerja" },
  { href: "#faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
] as const;

/**
 * §5.1 — Navbar identik di semua halaman: sticky, latar --paper 90% + blur,
 * border bawah --line muncul setelah scroll. Mobile: sheet layar penuh,
 * CTA primer tetap terlihat di bar atas.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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

  return (
    <header
      className={cn(
        "bg-background/90 sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-200",
        scrolled ? "border-line" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
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
              key={link.href}
              href={link.href}
              className="text-foreground hover:bg-muted rounded-pill px-3 py-2 text-sm font-semibold transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="border-ink bg-card text-foreground hover:bg-muted rounded-pill hidden size-10 items-center justify-center border-2 transition-colors duration-150 sm:inline-flex" />
          <Link className={buttonVariants({ variant: "secondary", size: "sm" })} href="/sign-in">
            Masuk
          </Link>
          <Link
            className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}
            href="/dashboard"
          >
            Mulai gratis
          </Link>
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

      {open ? (
        <div
          id="menu-mobile"
          className="border-line bg-background fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t px-5 py-6 md:hidden"
        >
          <nav className="flex flex-col gap-2" aria-label="Navigasi seluler">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-ink bg-card shadow-1 rounded-md border-2 px-4 py-3.5 text-base font-bold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <Button asChild variant="secondary">
              <Link href="/sign-in">Masuk</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Mulai gratis</Link>
            </Button>
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
