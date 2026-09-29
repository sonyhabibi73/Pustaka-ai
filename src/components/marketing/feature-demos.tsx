"use client";

import { Check, RefreshCw, Sparkles, X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

/** Mini-demo Ringkasan: poin yang ditandai stabilo. */
export function SummaryDemo() {
  const points = [
    { text: "Hukum Newton II: F = m × a", highlighted: true },
    { text: "Satuan gaya newton (N) = kg·m/s²", highlighted: false },
    { text: "Massa tetap → gaya sebanding percepatan", highlighted: true },
  ];
  return (
    <ul className="space-y-2.5">
      {points.map((point) => (
        <li key={point.text} className="flex items-start gap-2.5 text-sm leading-relaxed">
          <span className="bg-highlight text-ink rounded-pill border-ink mt-0.5 inline-flex size-5 shrink-0 items-center justify-center border">
            <Check className="size-3" aria-hidden="true" />
          </span>
          <span className={point.highlighted ? "hl font-semibold" : ""}>{point.text}</span>
        </li>
      ))}
    </ul>
  );
}

/** Mini-demo chat: indikator mengetik, lalu jawaban muncul (CSS, tanpa timer JS). */
export function ChatDemo() {
  return (
    <div className="space-y-3">
      <div className="bg-primary text-primary-foreground ml-auto max-w-[85%] rounded-md rounded-br-sm px-3.5 py-2 text-sm">
        Kenapa rumus ini dipakai di sini?
      </div>
      <div className="bg-surface border-ink max-w-[95%] rounded-md rounded-bl-sm border-2 px-3.5 py-2.5 text-sm">
        <span className="chat-typing" aria-hidden="true">
          <span className="typing-dot">●</span>
          <span className="typing-dot">●</span>
          <span className="typing-dot">●</span>
        </span>
        <span className="chat-answer">
          Karena gaya yang bekerja sebanding dengan percepatan selama massa konstan—persis seperti
          yang tertulis di bagian 2.1 materimu.
        </span>
        <span className="text-muted-foreground mt-2 block font-mono text-[10px]">
          SUMBER · BAGIAN 1
        </span>
      </div>
    </div>
  );
}

/** Mini-demo flashcard: kartu bisa dibalik. */
export function FlipCardDemo() {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((value) => !value)}
      aria-pressed={flipped}
      aria-label={flipped ? "Lihat pertanyaan" : "Lihat jawaban"}
      className="border-ink bg-background shadow-1 ease-snappy flex min-h-32 w-full flex-col items-center justify-center gap-2 rounded-md border-2 px-4 py-5 text-center transition-transform duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5"
    >
      <span className="text-sm font-bold">
        {flipped ? "Percepatan berbanding lurus dengan gaya." : "Apa bunyi Hukum Newton II?"}
      </span>
      <span className="text-muted-foreground flex items-center gap-1.5 font-mono text-[11px]">
        <RefreshCw className="size-3" aria-hidden="true" />
        {flipped ? "kembali ke pertanyaan" : "balik kartu"}
      </span>
    </button>
  );
}

const options = [
  { letter: "A", text: "12 N", correct: false },
  { letter: "B", text: "24 N", correct: true },
  { letter: "C", text: "48 N", correct: false },
  { letter: "D", text: "6 N", correct: false },
];

/** Mini-demo kuis: opsi bisa ditekan, langsung terlihat benar/salah. */
export function QuizDemo() {
  const [picked, setPicked] = useState<string | null>(null);
  const chosen = options.find((option) => option.letter === picked);

  return (
    <div>
      <p className="text-sm font-bold">Benda 4 kg, percepatan 6 m/s². Berapa gayanya?</p>
      <ul className="mt-3 grid gap-2">
        {options.map((option) => {
          const isSelected = picked === option.letter;
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
                    : isSelected
                      ? "border-danger bg-destructive/10"
                      : "border-line hover:border-ink",
                )}
              >
                <span className="font-mono text-xs font-bold">{option.letter}</span>
                {option.text}
                {reveal && option.correct ? (
                  <Check className="ml-auto size-4" aria-label="Benar" />
                ) : null}
                {reveal && isSelected && !option.correct ? (
                  <X className="text-danger ml-auto size-4" aria-label="Salah" />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="text-muted-foreground mt-3 flex items-start gap-1.5 text-xs leading-relaxed">
        <Sparkles className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        {picked
          ? chosen?.correct
            ? "Tepat! F = m × a = 4 × 6 = 24 newton."
            : "Belum tepat. Ingat rumus F = m × a, lalu coba lagi."
          : "Pilih salah satu jawaban untuk melihat penjelasan."}
      </p>
    </div>
  );
}
