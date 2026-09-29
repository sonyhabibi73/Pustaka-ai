"use client";

import Link from "next/link";
import { ArrowRight, Check, Link2, Play, UploadCloud, X } from "lucide-react";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tab = "ringkasan" | "flashcard" | "kuis";

const tabs: { id: Tab; label: string }[] = [
  { id: "ringkasan", label: "Ringkasan" },
  { id: "flashcard", label: "Flashcard" },
  { id: "kuis", label: "Kuis" },
];

const summaryPoints = [
  "ATP adalah molekul penyimpan energi utama sel.",
  "Fotosintesis memakai cahaya matahari + CO₂ + air.",
  "Hasilnya: glukosa dan oksigen dilepas ke udara.",
];

const quizOptions = [
  { letter: "A", text: "Mitokondria", correct: true },
  { letter: "B", text: "Ribosom", correct: false },
  { letter: "C", text: "Lisosom", correct: false },
  { letter: "D", text: "Badan Golgi", correct: false },
];

/**
 * §5.2 — Kartu demo di kolom kanan hero: dropzone + tempel link YouTube,
 * lalu "Coba contoh materi" membuka tiga tab (Ringkasan / Flashcard / Kuis)
 * yang terisi contoh nyata.
 */
export function HeroDemo() {
  const [started, setStarted] = useState(false);
  const [tab, setTab] = useState<Tab>("ringkasan");
  const [flipped, setFlipped] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div
      className="border-ink bg-surface shadow-3 rounded-md border-2 p-5 sm:p-6"
      aria-label="Demo singkat hasil unggahan"
    >
      <div className="border-line bg-muted/60 flex items-center justify-between rounded-sm border-2 border-dashed px-4 py-6 text-center sm:px-6">
        <div className="w-full">
          <UploadCloud className="text-muted-foreground mx-auto size-8" aria-hidden="true" />
          <p className="mt-2 text-sm font-bold">Seret file ke sini</p>
          <p className="text-muted-foreground mt-1 font-mono text-xs">
            PDF · DOCX · TXT · maks 10 MB
          </p>
          <div className="text-muted-foreground my-3 flex items-center gap-3 text-xs font-semibold">
            <span className="bg-line h-px flex-1" aria-hidden="true" />
            atau
            <span className="bg-line h-px flex-1" aria-hidden="true" />
          </div>
          <p className="text-muted-foreground flex items-center justify-center gap-1.5 font-mono text-xs">
            <Link2 className="size-3.5" aria-hidden="true" />
            tempel link YouTube
          </p>
        </div>
      </div>

      {!started ? (
        <div className="mt-4 flex flex-col gap-3">
          <Button onClick={() => setStarted(true)} className="w-full">
            <Play className="size-4" aria-hidden="true" />
            Coba contoh materi
          </Button>
          <p className="text-muted-foreground text-center text-xs">
            Contoh memakai materi Biologi sel. Tidak ada data yang dikirim.
          </p>
        </div>
      ) : (
        <div className="mt-4">
          <div
            className="border-ink bg-muted rounded-pill flex gap-1 border-2 p-1"
            role="tablist"
            aria-label="Hasil contoh"
          >
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  "rounded-pill px-3 py-1.5 text-xs font-bold transition-colors duration-150 sm:px-4",
                  tab === item.id
                    ? "bg-ink text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-4 min-h-44">
            {tab === "ringkasan" ? (
              <div>
                <p className="text-muted-foreground font-mono text-[11px] tracking-wider">
                  RINGKASAN · BIOLOGI SEL
                </p>
                <ul className="mt-3 space-y-2.5">
                  {summaryPoints.map((point) => (
                    <li key={point} className="flex gap-2.5 text-sm leading-relaxed">
                      <span className="bg-highlight text-ink rounded-pill border-ink mt-0.5 inline-flex size-5 shrink-0 items-center justify-center border text-[11px] font-bold">
                        <Check className="size-3" aria-hidden="true" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {tab === "flashcard" ? (
              <div>
                <p className="text-muted-foreground font-mono text-[11px] tracking-wider">
                  FLASHCARD · 1 / 12
                </p>
                <button
                  type="button"
                  onClick={() => setFlipped((value) => !value)}
                  className="border-ink bg-background shadow-1 mt-3 flex min-h-32 w-full flex-col items-center justify-center gap-2 rounded-md border-2 px-4 py-6 text-center"
                  aria-pressed={flipped}
                >
                  <span className="text-base font-bold">
                    {flipped ? "Molekul penyimpan energi utama sel." : "Apa fungsi ATP dalam sel?"}
                  </span>
                  <span className="text-muted-foreground font-mono text-[11px]">
                    {flipped ? "klik untuk melihat pertanyaan" : "klik untuk membalik"}
                  </span>
                </button>
              </div>
            ) : null}

            {tab === "kuis" ? (
              <div>
                <p className="text-muted-foreground font-mono text-[11px] tracking-wider">
                  KUIS · SOAL 1 DARI 5
                </p>
                <p className="mt-2 text-sm font-bold">Organel yang memproduksi ATP?</p>
                <ul className="mt-3 space-y-2">
                  {quizOptions.map((option) => {
                    const chosen = picked === option.letter;
                    const reveal = picked !== null;
                    return (
                      <li key={option.letter}>
                        <button
                          type="button"
                          onClick={() => setPicked(option.letter)}
                          className={cn(
                            "flex w-full items-center gap-2.5 rounded-sm border-2 px-3 py-2 text-left text-sm transition-colors duration-150",
                            reveal && option.correct
                              ? "border-mint bg-mint/20 text-ink font-semibold"
                              : chosen
                                ? "border-danger bg-destructive/10"
                                : "border-line hover:border-ink",
                          )}
                        >
                          <span className="font-mono text-xs font-bold">{option.letter}.</span>
                          {option.text}
                          {reveal && option.correct ? (
                            <Check className="ml-auto size-4" aria-label="Benar" />
                          ) : null}
                          {reveal && chosen && !option.correct ? (
                            <X className="text-danger ml-auto size-4" aria-label="Salah" />
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {picked ? (
                  <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
                    Mitokondria adalah lokasi respirasi seluler yang menghasilkan ATP.
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      )}

      <div className="border-line mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <p className="text-muted-foreground font-mono text-[11px]">HASIL MUNCUL DI SINI</p>
        <Link className={buttonVariants({ variant: "ghost", size: "sm" })} href="/dashboard">
          Buka workspace <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
