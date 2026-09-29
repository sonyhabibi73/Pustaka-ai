"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Question = { id: string; prompt: string; options: string[] };
type Result = { questionId: string; isCorrect: boolean; correctIndex: number; explanation: string };

/**
 * §6.7 — Progres "Soal x dari y" + bar tipis di atas, opsi berupa kartu besar
 * berhuruf A–D. Setelah dinilai: benar = mint + ✓ + "Benar!", salah = bahaya + ✕
 * + penjelasan singkat, lalu skor akhir.
 */
export function QuizClient({ quizId, questions }: { quizId: string; questions: Question[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [results, setResults] = useState<Record<string, Result>>({});
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = questions.length;
  const question = questions[current];
  const submitted = Boolean(Object.keys(results).length);
  const score = Object.values(results).filter((result) => result.isCorrect).length;
  const answeredCount = questions.filter(
    (questionItem) => answers[questionItem.id] !== undefined,
  ).length;

  async function submit() {
    if (answeredCount !== total) {
      setError("Jawab semua soal sebelum mengirim.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/quizzes/${quizId}/attempts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: questions.map((item) => ({
            questionId: item.id,
            selectedIndex: answers[item.id],
          })),
        }),
      });
      const payload = (await response.json()) as { error?: string; results?: Result[] };
      if (!response.ok || !payload.results) throw new Error(payload.error ?? "Kuis gagal dinilai.");
      setResults(Object.fromEntries(payload.results.map((result) => [result.questionId, result])));
      setCurrent(0);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Kuis gagal dinilai.");
    } finally {
      setLoading(false);
    }
  }

  if (!total) {
    return <p className="text-muted-foreground mt-6 text-sm">Kuis ini belum punya soal.</p>;
  }

  if (submitted) {
    return (
      <div className="mt-8 space-y-6">
        <div className="border-ink bg-highlight text-ink shadow-2 rounded-md border-2 p-6 text-center">
          <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">Skor akhir</p>
          <p className="mt-3 font-mono text-5xl font-bold tabular-nums">
            {score}/{total}
          </p>
          <p className="mt-2 text-sm font-semibold">
            {score === total
              ? "Tuntas semua. Boleh lanjut ke bagian berikutnya."
              : "Lihat lagi soal yang salah, lalu ulangi kalau perlu."}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setResults({});
                setAnswers({});
                setCurrent(0);
                setError("");
              }}
            >
              Ulangi kuis
            </Button>
          </div>
        </div>

        <ul className="space-y-4">
          {questions.map((item, index) => {
            const result = results[item.id];
            return (
              <li className="border-ink bg-card shadow-1 rounded-md border-2 p-5" key={item.id}>
                <p className="text-muted-foreground font-mono text-[11px] font-bold tracking-[0.14em] uppercase">
                  Soal {index + 1} dari {total}
                </p>
                <p className="mt-2 font-bold">{item.prompt}</p>
                <ul className="mt-3 grid gap-2">
                  {item.options.map((option, optionIndex) => {
                    const isCorrect = result?.correctIndex === optionIndex;
                    const isChosen = answers[item.id] === optionIndex;
                    return (
                      <li
                        key={option}
                        className={cn(
                          "flex items-center gap-2.5 rounded-sm border-2 px-3 py-2 text-sm",
                          isCorrect
                            ? "border-mint bg-mint/20 font-semibold"
                            : isChosen
                              ? "border-danger bg-destructive/10"
                              : "border-line",
                        )}
                      >
                        <span className="font-mono text-xs font-bold">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>
                        {option}
                        {isCorrect ? (
                          <span className="ml-auto inline-flex items-center gap-1 text-xs font-bold">
                            <Check className="size-4" aria-hidden="true" /> Benar!
                          </span>
                        ) : isChosen ? (
                          <span className="text-destructive ml-auto inline-flex items-center gap-1 text-xs font-bold">
                            <X className="size-4" aria-hidden="true" /> Pilihanmu
                          </span>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {result?.isCorrect ? "" : "Jawaban benar: "}
                  <span className="font-semibold">
                    {String.fromCharCode(65 + (result?.correctIndex ?? 0))}.
                  </span>{" "}
                  {result?.explanation}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  const progress = Math.round(((current + 1) / total) * 100);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-4">
        <p className="font-mono text-xs font-bold tabular-nums">
          Soal {current + 1} dari {total}
        </p>
        <div className="bg-muted border-line rounded-pill h-3 flex-1 overflow-hidden border-2">
          <div
            className="bg-mint ease-snappy h-full transition-[width] duration-300"
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />
        </div>
        <p className="text-muted-foreground font-mono text-xs tabular-nums">
          {answeredCount}/{total} terjawab
        </p>
      </div>

      <fieldset className="border-ink bg-card shadow-2 mt-5 rounded-md border-2 p-6">
        <legend className="sr-only">{question.prompt}</legend>
        <p className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase">
          Pilihan ganda · soal {current + 1}
        </p>
        <p className="mt-3 text-lg leading-relaxed font-bold">{question.prompt}</p>

        <div className="mt-5 grid gap-3">
          {question.options.map((option, index) => {
            const selected = answers[question.id] === index;
            return (
              <label
                className={cn(
                  "border-ink ease-snappy flex min-h-14 cursor-pointer items-center gap-3 rounded-md border-2 px-4 py-3 text-sm transition-[transform,box-shadow,background-color] duration-150",
                  selected
                    ? "bg-secondary shadow-1"
                    : "bg-background shadow-1 hover:shadow-2 hover:-translate-x-0.5 hover:-translate-y-0.5",
                )}
                key={option}
              >
                <input
                  checked={selected}
                  name={question.id}
                  onChange={() => setAnswers((value) => ({ ...value, [question.id]: index }))}
                  type="radio"
                  value={index}
                  className="sr-only"
                />
                <span
                  className={cn(
                    "border-ink inline-flex size-8 shrink-0 items-center justify-center rounded-sm border-2 font-mono text-sm font-bold",
                    selected ? "bg-ink text-background" : "bg-surface",
                  )}
                  aria-hidden="true"
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="font-medium">{option}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {error ? (
        <p className="text-destructive mt-4 text-sm font-semibold" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button
          variant="secondary"
          disabled={current === 0 || loading}
          onClick={() => setCurrent((value) => Math.max(0, value - 1))}
        >
          Sebelumnya
        </Button>
        {current < total - 1 ? (
          <Button
            disabled={answers[question.id] === undefined}
            onClick={() => setCurrent((value) => value + 1)}
          >
            Berikutnya
          </Button>
        ) : (
          <Button
            loading={loading}
            disabled={loading}
            onClick={() => {
              void submit();
            }}
          >
            {loading ? "Menilai…" : "Kirim jawaban"}
          </Button>
        )}
        <p className="text-muted-foreground text-xs">Kamu boleh berpindah soal sebelum mengirim.</p>
      </div>
    </div>
  );
}
