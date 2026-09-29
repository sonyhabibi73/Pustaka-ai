"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

/**
 * Mode gelap mengikuti sistem, dengan pilihan manual (Desain.md §7).
 * Nilai disimpan di atribut <html data-theme> dan localStorage "theme",
 * sehingga tidak ada kedip saat muat ulang (lihat theme-init di root layout).
 */
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function getServerSnapshot() {
  return "light";
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = theme === "dark";

  function toggle() {
    const root = document.documentElement;
    const next = isDark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* penyimpanan tidak tersedia: tema tetap berlaku untuk sesi ini */
    }
    emit();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={
        className ??
        "border-ink bg-card text-foreground hover:bg-muted rounded-pill inline-flex size-10 items-center justify-center border-2 transition-colors duration-150"
      }
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      title={isDark ? "Mode terang" : "Mode gelap"}
    >
      {isDark ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}
