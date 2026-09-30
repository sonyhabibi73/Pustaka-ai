"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Choice = "light" | "dark" | "system";

const options: { id: Choice; label: string; hint: string }[] = [
  { id: "light", label: "Terang", hint: "selalu mode terang" },
  { id: "dark", label: "Gelap", hint: "selalu mode gelap" },
  { id: "system", label: "Ikut sistem", hint: "menyesuaikan perangkat" },
];

function readChoice(): Choice {
  try {
    const stored = localStorage.getItem("theme");
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

/**
 * Pilihan tema tiga opsi di halaman Pengaturan. Nilai disimpan di
 * localStorage "theme" dan langsung mengubah atribut <html data-theme>,
 * sama seperti ThemeToggle — "Ikut sistem" menghapus penyimpanan sehingga
 * theme-init di root layout kembali membaca preferensi perangkat.
 */
export function ThemePicker() {
  const [choice, setChoice] = useState<Choice>("system");

  useEffect(() => {
    const sync = () => setChoice(readChoice());
    sync();
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readChoice() === "system") {
        document.documentElement.setAttribute("data-theme", media.matches ? "dark" : "light");
      }
    };
    window.addEventListener("theme-change", sync);
    media.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("theme-change", sync);
      media.removeEventListener("change", onChange);
    };
  }, []);

  function pick(next: Choice) {
    const root = document.documentElement;
    if (next === "system") {
      try {
        localStorage.removeItem("theme");
      } catch {
        /* penyimpanan tidak tersedia */
      }
      root.setAttribute(
        "data-theme",
        window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
      );
    } else {
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* penyimpanan tidak tersedia: tema tetap berlaku untuk sesi ini */
      }
      root.setAttribute("data-theme", next);
    }
    setChoice(next);
    window.dispatchEvent(new Event("theme-change"));
  }

  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="text-foreground mb-2 block text-sm font-semibold">Tema tampilan</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.id}
            title={option.hint}
            className={cn(
              "border-ink bg-card text-foreground has-[:focus-visible]:ring-ring rounded-pill has-[:checked]:bg-primary has-[:checked]:text-primary-foreground cursor-pointer border-2 px-4 py-2 text-sm font-bold transition-colors duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2",
            )}
          >
            <input
              type="radio"
              name="theme"
              value={option.id}
              checked={choice === option.id}
              onChange={() => pick(option.id)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
        {options.find((option) => option.id === choice)?.hint}
      </p>
    </fieldset>
  );
}
