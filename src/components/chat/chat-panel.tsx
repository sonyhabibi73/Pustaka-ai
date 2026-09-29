"use client";

import { FormEvent, useRef, useState } from "react";
import { ArrowUp, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Message = {
  role: "user" | "assistant";
  content: string;
  citations?: { chunkIndex: number }[];
};

export function ChatPanel({ documentId }: { documentId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = input.trim();
    if (!message || loading) return;
    setMessages((current) => [...current, { role: "user", content: message }]);
    setInput("");
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`/api/documents/${documentId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, threadId }),
      });
      const result = (await response.json()) as {
        answer?: string;
        error?: string;
        threadId?: string;
        citations?: { chunkIndex: number }[];
      };
      if (!response.ok || !result.answer)
        throw new Error(result.error ?? "Jawaban tidak dapat dibuat.");
      const answer = result.answer;
      const citations = result.citations;
      setThreadId(result.threadId);
      setMessages((current) => [...current, { role: "assistant", content: answer, citations }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Jawaban tidak dapat dibuat.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <section
      className="border-border bg-card flex min-h-[30rem] flex-col border"
      aria-label="Tanya materi"
    >
      <header className="border-border border-b p-5">
        <h2 className="font-semibold">Tanya materi</h2>
        <p className="text-muted-foreground mt-1 text-sm">Jawaban hanya dari dokumen aktif.</p>
      </header>
      <div className="flex-1 space-y-5 overflow-y-auto p-5" aria-live="polite">
        {messages.length ? (
          messages.map((message, index) => (
            <article
              className={
                message.role === "user"
                  ? "bg-secondary ml-auto max-w-[85%] p-3 text-sm leading-6"
                  : "max-w-[92%] text-sm leading-6"
              }
              key={`${message.role}-${index}`}
            >
              <p>{message.content}</p>
              {message.citations?.length ? (
                <p className="text-muted-foreground mt-3 font-mono text-xs">
                  SUMBER · chunk{" "}
                  {message.citations.map((citation) => citation.chunkIndex + 1).join(", ")}
                </p>
              ) : null}
            </article>
          ))
        ) : (
          <p className="text-muted-foreground max-w-sm text-sm leading-6">
            Contoh: “Apa tiga gagasan utama dari materi ini?”
          </p>
        )}
        {loading ? (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            Mencari sumber…
          </div>
        ) : null}
      </div>
      <form className="border-border border-t p-3" onSubmit={submit}>
        <label className="sr-only" htmlFor="chat-input">
          Pertanyaan tentang materi
        </label>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            className="placeholder:text-muted-foreground h-11 min-w-0 flex-1 bg-transparent px-3 text-base outline-none md:text-sm"
            id="chat-input"
            onChange={(event) => setInput(event.target.value)}
            placeholder="Tanyakan materi ini…"
            value={input}
          />
          <Button
            aria-label="Kirim pertanyaan"
            disabled={loading || !input.trim()}
            size="icon"
            type="submit"
          >
            <ArrowUp className="size-4" aria-hidden="true" />
          </Button>
        </div>
        {error ? (
          <p className="text-destructive px-3 pb-1 text-sm" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </section>
  );
}
