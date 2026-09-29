"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Layers3, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
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

/**
 * §6.6 — Rasio 3:2, balik 3D 360ms (mati pada prefers-reduced-motion → fade),
 * kontrol penilaian + pintasan keyboard (spasi membalik, 1–4 menilai).
 * Empat tingkat penilaian dipertahankan karena skema & API spaced repetition
 * memakai AGAIN / HARD / GOOD / EASY.
 */
const GRADES: {
  grade: ReviewGrade;
  label: string;
  meaning: string;
  key: string;
}[] = [
  { grade: "AGAIN", label: "Belum hafal", meaning: "ulang segera", key: "1" },
  { grade: "HARD", label: "Sulit", meaning: "terngat-ngat", key: "2" },
  { grade: "GOOD", label: "Hampir", meaning: "ingat sebagian", key: "3" },
  { grade: "EASY", label: "Hafal", meaning: "tuntas", key: "4" },
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
      <EmptyState
        icon={Layers3}
        title={emptyNotice?.title ?? "Belum ada flashcard."}
        description={
          emptyNotice?.body ?? "Flashcard dibuat otomatis setelah materi selesai diproses."
        }
        action={
          <Button asChild variant="secondary">
            <Link href={backHref}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Kembali
            </Link>
          </Button>
        }
      />
    );
  }

  if (finished) {
    const retried = requeue.length;
    return (
      <div className="border-ink bg-card shadow-2 rounded-md border-2 p-8 text-center sm:p-10">
        <p className="font-mono text-xs font-semibold tracking-[0.14em] uppercase">Sesi selesai</p>
        <p className="mt-4 font-mono text-4xl font-bold tabular-nums">{reviewed} kartu</p>
        <div className="mx-auto mt-7 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
          {GRADES.map((item) => (
            <div
              className="border-ink bg-background shadow-1 rounded-md border-2 py-3"
              key={item.grade}
            >
              <p className="font-mono text-2xl font-bold tabular-nums">{tally[item.grade]}</p>
              <p className="text-muted-foreground mt-0.5 text-xs font-semibold">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {retried ? (
            <Button
              variant="accent"
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
          <Button asChild variant="secondary">
            <Link href={backHref}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Kembali
            </Link>
          </Button>
        </div>
        <p className="text-muted-foreground mx-auto mt-6 max-w-md text-sm leading-relaxed">
          Kartu yang dinilai sudah dijadwalkan ulang sesuai jawaban jujurmu tadi.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <p className="font-mono text-xs font-bold tabular-nums">
          {reviewed + 1} / {total}
        </p>
        <div
          aria-hidden="true"
          className="border-line bg-muted rounded-pill h-3 flex-1 overflow-hidden border-2"
          role="presentation"
        >
          <div
            className="bg-mint ease-snappy h-full transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="font-mono text-xs font-bold tabular-nums">{progress}%</p>
      </div>

      <div className="flip-scene mx-auto aspect-[3/2] max-h-[26rem] min-h-64 w-full sm:max-h-[30rem]">
        <div className="flip-inner" data-flipped={revealed ? "true" : "false"}>
          {/* Sisi depan */}
          <div className="flip-face" data-front="true">
            <div className="flex items-start justify-between gap-3">
              <p className="text-muted-foreground font-mono text-[11px] font-bold tracking-[0.14em] uppercase">
                Pertanyaan
              </p>
              {card.docTitle ? (
                <p className="text-muted-foreground truncate text-xs" title={card.docTitle}>
                  {card.docTitle}
                </p>
              ) : null}
            </div>
            <p className="mt-5 text-xl leading-relaxed font-bold sm:text-2xl">{card.front}</p>
            {card.sources.length ? (
              <p className="text-muted-foreground mt-auto pt-6 font-mono text-xs">
                SUMBER · bagian {card.sources.join(", ")}
              </p>
            ) : null}
          </div>

          {/* Sisi belakang */}
          <div className="flip-face" data-back="true">
            <p className="text-muted-foreground font-mono text-[11px] font-bold tracking-[0.14em] uppercase">
              Jawaban
            </p>
            <p
              className="mt-4 max-h-52 overflow-y-auto text-base leading-7 whitespace-pre-wrap"
              aria-live="polite"
            >
              {card.back}
            </p>
            <p className="border-line text-muted-foreground mt-auto border-t-2 pt-4 text-sm leading-relaxed">
              {card.front}
            </p>
          </div>
        </div>
      </div>

      {!revealed ? (
        <div className="flex flex-col items-center gap-3">
          <Button className="h-12 px-8 text-base" onClick={() => setRevealed(true)}>
            Balik kartu
            <kbd className="border-ink bg-background text-foreground ml-3 rounded-sm border-2 px-1.5 py-0.5 font-mono text-[11px] font-semibold">
              spasi
            </kbd>
          </Button>
          <p className="text-muted-foreground text-sm">Ingat dulu jawabannya, lalu balik.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {GRADES.map((option) => {
            const preview = calculateNextReview(card, option.grade).intervalDays;
            const isPreferred = option.grade === "GOOD";
            return (
              <button
                className={[
                  "border-ink ease-snappy flex flex-col items-start gap-1 rounded-md border-2 px-3.5 py-3 text-left transition-[transform,box-shadow,background-color] duration-150 disabled:opacity-50",
                  isPreferred
                    ? "bg-secondary shadow-1"
                    : "bg-card shadow-1 hover:shadow-2 hover:-translate-x-0.5 hover:-translate-y-0.5",
                ].join(" ")}
                disabled={busy}
                key={option.grade}
                onClick={() => void grade(option.grade)}
                title={`Tekan ${option.key}`}
                type="button"
              >
                <span className="flex w-full items-center gap-2 text-sm font-bold">
                  <span className="border-ink bg-highlight text-ink rounded-pill inline-flex size-5 items-center justify-center border-2 font-mono text-[10px]">
                    {option.key}
                  </span>
                  {option.label}
                </span>
                <span className="text-muted-foreground font-mono text-[11px]">
                  {intervalLabel(preview)} · {option.meaning}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {error ? (
        <p className="text-destructive text-sm font-semibold" role="alert">
          {error}
        </p>
      ) : null}

      <p className="text-muted-foreground text-center font-mono text-[11px]">
        spasi = balik · 1–4 = nilai · jujur saat menilai biar jadwalnya akurat
      </p>
    </div>
  );
}
