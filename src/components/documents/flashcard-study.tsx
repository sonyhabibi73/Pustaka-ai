"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculateNextReview, type ReviewGrade } from "@/lib/study/spaced-repetition";
import { intervalLabel } from "@/lib/documents/labels";

export type StudyCard = {
  id: string;
  front: string;
  back: string;
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  sources: number[];
  docTitle?: string;
};

const GRADES: {
  grade: ReviewGrade;
  label: string;
  meaning: string;
  key: string;
}[] = [
  { grade: "AGAIN", label: "Ulang", meaning: "belum hafal", key: "1" },
  { grade: "HARD", label: "Sulit", meaning: "terngat-ngat", key: "2" },
  { grade: "GOOD", label: "Paham", meaning: "ingat", key: "3" },
  { grade: "EASY", label: "Mudah", meaning: "hafal", key: "4" },
];

const EMPTY_TALLY: Record<ReviewGrade, number> = { AGAIN: 0, HARD: 0, GOOD: 0, EASY: 0 };

export function FlashcardStudy({
  cards,
  backHref,
  emptyNotice,
}: {
  cards: StudyCard[];
  backHref: string;
  emptyNotice?: { title: string; body: string };
}) {
  const [queue, setQueue] = useState<StudyCard[]>(cards);
  const [reviewed, setReviewed] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [tally, setTally] = useState<Record<ReviewGrade, number>>(EMPTY_TALLY);
  const [requeue, setRequeue] = useState<StudyCard[]>([]);

  const card = queue[0];
  const remaining = queue.length;
  const total = reviewed + remaining;
  const progress = total ? Math.round((reviewed / total) * 100) : 100;
  const finished = remaining === 0 && reviewed > 0;

  const grade = useCallback(
    async (value: ReviewGrade) => {
      if (!card || busy) return;
      setBusy(true);
      setError("");
      try {
        const response = await fetch(`/api/flashcards/${card.id}/review`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ grade: value }),
        });
        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(payload?.error ?? "Nilai gagal disimpan. Silakan coba lagi.");
        }
        setTally((current) => ({ ...current, [value]: current[value] + 1 }));
        setReviewed((count) => count + 1);
        setQueue((current) => {
          const rest = current.slice(1);
          return value === "AGAIN" ? [...rest, card] : rest;
        });
        if (value === "AGAIN") setRequeue((list) => [...list, card]);
        setRevealed(false);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Nilai gagal disimpan.");
      } finally {
        setBusy(false);
      }
    },
    [card, busy],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }
      if (event.code === "Space" || event.key === "Enter") {
        if (card && !revealed && !finished) {
          event.preventDefault();
          setRevealed(true);
        }
        return;
      }
      if (!revealed) return;
      const option = GRADES.find((item) => item.key === event.key);
      if (option) {
        event.preventDefault();
        void grade(option.grade);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [card, revealed, finished, grade]);

  if (!cards.length) {
    return (
      <div className="border-border bg-card rounded-lg border p-10 text-center">
        <Sparkles className="text-muted-foreground mx-auto size-6" aria-hidden="true" />
        <p className="mt-4 font-medium">{emptyNotice?.title ?? "Belum ada flashcard."}</p>
        <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-6">
          {emptyNotice?.body ?? "Flashcard dibuat otomatis setelah materi selesai diproses."}
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link href={backHref}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Kembali
          </Link>
        </Button>
      </div>
    );
  }

  if (finished) {
    const retried = requeue.length;
    return (
      <div className="border-border bg-card rounded-lg border p-8 text-center sm:p-10">
        <p className="font-mono text-xs font-semibold tracking-[0.14em] uppercase">Sesi selesai</p>
        <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] tabular-nums">
          {reviewed} kartu
        </p>
        <div className="mx-auto mt-6 grid max-w-lg grid-cols-4 gap-2">
          {GRADES.map((item) => (
            <div className="border-border rounded-md border py-3" key={item.grade}>
              <p className="text-xl font-semibold tabular-nums">{tally[item.grade]}</p>
              <p className="text-muted-foreground mt-0.5 text-xs">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {retried ? (
            <Button
              onClick={() => {
                setQueue(requeue);
                setRequeue([]);
                setReviewed(0);
                setTally(EMPTY_TALLY);
                setRevealed(false);
                setError("");
              }}
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Latih ulang {retried} kartu yang belum hafal
            </Button>
          ) : null}
          <Button asChild variant="outline">
            <Link href={backHref}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Kembali
            </Link>
          </Button>
        </div>
        <p className="text-muted-foreground mt-6 text-sm">
          Kartu yang dinilai sudah dijadwalkan ulang sesuai jadwal belajar berikutnya.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <p className="text-muted-foreground font-mono text-xs tabular-nums">
          {reviewed + 1} / {total}
        </p>
        <div
          aria-hidden="true"
          className="bg-border h-1.5 flex-1 overflow-hidden rounded-full"
          role="presentation"
        >
          <div
            className="bg-foreground h-full rounded-full transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-muted-foreground font-mono text-xs tabular-nums">{progress}%</p>
      </div>

      <div className="[perspective:1600px]">
        <div
          className="grid transition-transform duration-500 ease-out"
          style={{
            transform: revealed ? "rotateY(180deg)" : "rotateY(0deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Sisi depan */}
          <div
            className="border-border bg-card flex min-h-64 flex-col rounded-lg border p-6 sm:p-8"
            style={{
              gridArea: "1 / 1",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-muted-foreground font-mono text-[11px] font-semibold tracking-[0.14em] uppercase">
                Pertanyaan
              </p>
              {card.docTitle ? (
                <p className="text-muted-foreground truncate text-xs" title={card.docTitle}>
                  {card.docTitle}
                </p>
              ) : null}
            </div>
            <p className="mt-5 flex-1 text-xl leading-relaxed font-medium sm:text-2xl sm:leading-relaxed">
              {card.front}
            </p>
            {card.sources.length ? (
              <p className="text-muted-foreground mt-6 font-mono text-xs">
                SUMBER · bagian {card.sources.join(", ")}
              </p>
            ) : null}
          </div>

          {/* Sisi belakang */}
          <div
            className="border-border bg-card flex min-h-64 flex-col rounded-lg border p-6 sm:p-8"
            style={{
              gridArea: "1 / 1",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="text-muted-foreground font-mono text-[11px] font-semibold tracking-[0.14em] uppercase">
              Jawaban
            </p>
            <p className="text-foreground mt-4 max-h-64 overflow-y-auto text-base leading-7 whitespace-pre-wrap">
              {card.back}
            </p>
            <p className="text-muted-foreground border-border mt-auto border-t pt-4 text-sm leading-6">
              {card.front}
            </p>
          </div>
        </div>
      </div>

      {!revealed ? (
        <div className="flex flex-col items-center gap-3">
          <Button className="h-12 px-8 text-base" onClick={() => setRevealed(true)}>
            Balik kartu
            <kbd className="border-border ml-3 rounded border px-1.5 py-0.5 font-mono text-[11px]">
              spasi
            </kbd>
          </Button>
          <p className="text-muted-foreground text-xs">Ingat dulu jawabannya, lalu balik.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {GRADES.map((option) => {
            const preview = calculateNextReview(card, option.grade).intervalDays;
            const isPreferred = option.grade === "GOOD";
            return (
              <button
                className={[
                  "border bg-transparent px-3 py-3 text-left transition-colors disabled:opacity-50",
                  isPreferred ? "border-foreground" : "border-border hover:bg-secondary",
                ].join(" ")}
                disabled={busy}
                key={option.grade}
                onClick={() => void grade(option.grade)}
                title={`Tekan ${option.key}`}
                type="button"
              >
                <span className="block text-sm font-medium">
                  {option.label}
                  <span className="text-muted-foreground ml-1.5 font-mono text-[11px]">
                    {option.key}
                  </span>
                </span>
                <span className="text-muted-foreground mt-0.5 block text-xs">
                  {intervalLabel(preview)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <p className="text-muted-foreground text-center font-mono text-[11px]">
        spasi = balik · 1–4 = nilai
      </p>
    </div>
  );
}
