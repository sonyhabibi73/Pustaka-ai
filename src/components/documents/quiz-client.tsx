"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Question = { id: string; prompt: string; options: string[] };
type Result = { questionId: string; isCorrect: boolean; correctIndex: number; explanation: string };
export function QuizClient({ quizId, questions }: { quizId: string; questions: Question[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [results, setResults] = useState<Record<string, Result>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (Object.keys(answers).length !== questions.length) {
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
          answers: questions.map((question) => ({
            questionId: question.id,
            selectedIndex: answers[question.id],
          })),
        }),
      });
      const payload = (await response.json()) as { error?: string; results?: Result[] };
      if (!response.ok || !payload.results) throw new Error(payload.error ?? "Kuis gagal dinilai.");
      setResults(Object.fromEntries(payload.results.map((result) => [result.questionId, result])));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Kuis gagal dinilai.");
    } finally {
      setLoading(false);
    }
  }
  const submitted = Boolean(Object.keys(results).length);
  const score = Object.values(results).filter((result) => result.isCorrect).length;
  return (
    <form className="mt-10 space-y-8" onSubmit={submit}>
      <div className="sr-only" aria-live="polite">
        {submitted ? `Nilai Anda ${score} dari ${questions.length}` : ""}
      </div>
      {questions.map((question, position) => {
        const result = results[question.id];
        return (
          <fieldset className="border-border border-t pt-6" key={question.id}>
            <legend className="leading-7 font-medium">
              {position + 1}. {question.prompt}
            </legend>
            <div className="mt-4 grid gap-2">
              {question.options.map((option, index) => (
                <label
                  className="border-border has-[:checked]:border-foreground has-[:checked]:bg-secondary flex min-h-11 cursor-pointer items-center gap-3 border px-3 text-sm"
                  key={option}
                >
                  <input
                    checked={answers[question.id] === index}
                    disabled={submitted}
                    name={question.id}
                    onChange={() => setAnswers((current) => ({ ...current, [question.id]: index }))}
                    type="radio"
                    value={index}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {result ? (
              <p className={result.isCorrect ? "mt-3 text-sm" : "text-destructive mt-3 text-sm"}>
                {result.isCorrect ? "Benar." : `Jawaban: ${question.options[result.correctIndex]}.`}{" "}
                <span className="text-muted-foreground">{result.explanation}</span>
              </p>
            ) : null}
          </fieldset>
        );
      })}
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      <Button disabled={loading || submitted} type="submit">
        {loading ? "Menilai…" : submitted ? `Nilai: ${score}/${questions.length}` : "Kirim jawaban"}
      </Button>
    </form>
  );
}
