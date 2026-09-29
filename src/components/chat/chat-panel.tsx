"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowUp, Quote, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/ui/markdown";

export type ChatCitation = { chunkIndex: number; excerpt?: string };
export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  citations?: ChatCitation[];
};

export const DEFAULT_SUGGESTIONS = [
  "Ringkas poin penting materi ini dalam 5 kalimat",
  "Apa istilah penting yang wajib aku pahami?",
  "Jelaskan lebih sederhana",
  "Beri contoh soal dari materi ini",
];

/** Baris `SUMBER:` dari model adalah metadata, bukan jawaban — jangan ditampilkan. */
function visibleText(text: string) {
  const match = /(^|\n)SUMBER:/.exec(text);
  return match ? text.slice(0, match.index) : text;
}

function replaceLast(list: ChatMessage[], message: ChatMessage) {
  return list.length ? [...list.slice(0, -1), message] : [message];
}

type StreamMeta = {
  threadId?: string;
  messageId?: string;
  citations?: ChatCitation[];
  error?: string;
};

/**
 * §6.8 — Gelembung pengguna --brand, gelembung AI --surface berborder,
 * chip saran, indikator mengetik tiga titik, dan tombol "Hentikan"
 * selama jawaban masih dihasilkan.
 */
export function ChatPanel({
  documentId,
  documentTitle,
  initialThreadId,
  initialMessages = [],
}: {
  documentId: string;
  documentTitle?: string;
  initialThreadId?: string;
  initialMessages?: ChatMessage[];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [threadId, setThreadId] = useState<string | undefined>(initialThreadId);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const [openCitation, setOpenCitation] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  async function ask(question: string) {
    setError("");
    setMessages((current) => [
      ...current,
      { role: "user", content: question },
      { role: "assistant", content: "" },
    ]);
    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const response = await fetch(`/api/documents/${documentId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, threadId }),
        signal: controller.signal,
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Jawaban tidak dapat dibuat.");
      }
      if ((response.headers.get("content-type") ?? "").includes("application/json")) {
        const data = (await response.json()) as StreamMeta & { answer?: string };
        if (data.error) throw new Error(data.error);
        setThreadId(data.threadId);
        setMessages((current) =>
          replaceLast(current, {
            role: "assistant",
            content: data.answer ?? "",
            citations: data.citations,
          }),
        );
        return;
      }
      if (!response.body) throw new Error("Jawaban tidak dapat dibuat.");

      setLoading(false);
      setStreaming(true);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let body = "";
      let meta: StreamMeta | null = null;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const separator = accumulated.indexOf("@@META@@");
        body = separator >= 0 ? accumulated.slice(0, separator) : accumulated;
        if (!meta) {
          const content = visibleText(body);
          setMessages((current) => replaceLast(current, { role: "assistant", content }));
        }
        if (separator >= 0 && !meta) {
          meta = JSON.parse(accumulated.slice(separator + 8)) as StreamMeta;
        }
      }
      if (meta?.error) throw new Error(meta.error);
      if (meta?.threadId) setThreadId(meta.threadId);
      setMessages((current) =>
        replaceLast(current, {
          role: "assistant",
          content: visibleText(body),
          citations: meta?.citations,
        }),
      );
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") {
        // Dihentikan pengguna: bagian jawaban yang sudah masuk tetap ditampilkan.
        setError("");
      } else {
        setError(caught instanceof Error ? caught.message : "Jawaban tidak dapat dibuat.");
        setMessages((current) => {
          const last = current[current.length - 1];
          return last?.role === "assistant" && !last.content ? current.slice(0, -1) : current;
        });
      }
    } finally {
      abortRef.current = null;
      setLoading(false);
      setStreaming(false);
      inputRef.current?.focus();
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = input.trim();
    if (!question || loading || streaming) return;
    setInput("");
    await ask(question);
  }

  const busy = loading || streaming;
  const showSuggestions = messages.length === 0;

  return (
    <section
      aria-label="Tanya materi"
      className="border-ink bg-card shadow-2 flex h-[min(70vh,44rem)] flex-col rounded-md border-2"
    >
      <header className="border-line border-b-2 p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold">Tanya materi</h2>
          <span className="text-muted-foreground font-mono text-[11px] font-semibold tracking-[0.14em] uppercase">
            Tutor AI
          </span>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          {documentTitle
            ? `Jawaban disusun dari “${documentTitle}”. Klik sumber untuk membaca kutipannya.`
            : "Jawaban disusun dari dokumen aktif. Klik sumber untuk membaca kutipannya."}
        </p>
      </header>

      <div aria-live="polite" className="flex-1 space-y-5 overflow-y-auto p-5">
        {showSuggestions ? (
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm">
              Belum ada pertanyaan. Mulai dari salah satu ini:
            </p>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_SUGGESTIONS.map((suggestion) => (
                <button
                  className="border-ink bg-background rounded-pill shadow-1 ease-snappy hover:shadow-2 min-h-10 border-2 px-4 text-left text-sm font-semibold transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50"
                  disabled={busy}
                  key={suggestion}
                  onClick={() => void ask(suggestion)}
                  type="button"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {messages.map((message, index) => {
          const isLast = index === messages.length - 1;
          if (message.role === "user") {
            return (
              <article
                className="bg-primary text-primary-foreground ml-auto max-w-[85%] rounded-md rounded-br-sm px-4 py-3 text-sm leading-relaxed"
                key={`user-${index}`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </article>
            );
          }
          const streamingThis = isLast && !message.content && busy;
          if (streamingThis) {
            return (
              <div
                className="bg-surface border-ink inline-flex max-w-[85%] items-center gap-1.5 rounded-md rounded-bl-sm border-2 px-4 py-4"
                key={`loading-${index}`}
              >
                <span className="typing-dot text-brand" aria-hidden="true">
                  ●
                </span>
                <span className="typing-dot text-brand" aria-hidden="true">
                  ●
                </span>
                <span className="typing-dot text-brand" aria-hidden="true">
                  ●
                </span>
                <span className="sr-only">Menyusun jawaban dari dokumen…</span>
              </div>
            );
          }
          return (
            <article
              className="bg-surface border-ink shadow-1 max-w-[92%] rounded-md rounded-bl-sm border-2 px-4 py-3 text-sm"
              key={`assistant-${index}`}
            >
              <Markdown markdown={message.content} />
              {streaming && isLast ? (
                <span
                  aria-hidden="true"
                  className="bg-foreground inline-block h-4 w-0.5 animate-pulse align-middle"
                />
              ) : null}
              {message.citations?.length ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {message.citations.map((citation) => {
                    const key = `${index}-${citation.chunkIndex}`;
                    const open = openCitation === key;
                    return (
                      <button
                        aria-expanded={open}
                        className="border-ink text-muted-foreground hover:text-foreground rounded-pill bg-background inline-flex min-h-8 items-center gap-1.5 border-2 px-3 text-xs font-semibold transition-colors"
                        key={key}
                        onClick={() => setOpenCitation(open ? "" : key)}
                        type="button"
                      >
                        <Quote className="size-3" aria-hidden="true" />
                        bagian {citation.chunkIndex + 1}
                      </button>
                    );
                  })}
                </div>
              ) : null}
              {message.citations?.some(
                (citation) =>
                  citation.excerpt && openCitation === `${index}-${citation.chunkIndex}`,
              ) ? (
                <blockquote className="border-highlight bg-muted mt-2 border-l-[5px] p-3 text-xs leading-6">
                  {
                    message.citations.find(
                      (citation) => openCitation === `${index}-${citation.chunkIndex}`,
                    )?.excerpt
                  }
                </blockquote>
              ) : null}
            </article>
          );
        })}
        <div ref={endRef} />
      </div>

      <form className="border-line border-t-2 p-3" onSubmit={submit}>
        <label className="sr-only" htmlFor="chat-input">
          Pertanyaan tentang materi
        </label>
        <div className="flex gap-2">
          <input
            className="border-input placeholder:text-muted-foreground focus-visible:border-brand bg-surface focus-visible:ring-brand/40 h-12 min-w-0 flex-1 rounded-sm border-2 px-3.5 text-base outline-none focus-visible:ring-4 md:text-sm"
            id="chat-input"
            onChange={(event) => setInput(event.target.value)}
            placeholder="Tanyakan materi ini…"
            ref={inputRef}
            value={input}
          />
          {busy ? (
            <Button
              aria-label="Hentikan jawaban"
              onClick={() => abortRef.current?.abort()}
              variant="secondary"
              type="button"
              className="shrink-0"
            >
              <Square className="size-4" aria-hidden="true" />
              Hentikan
            </Button>
          ) : (
            <Button
              aria-label="Kirim pertanyaan"
              disabled={!input.trim()}
              size="icon"
              type="submit"
              className="shrink-0"
            >
              <ArrowUp className="size-4" aria-hidden="true" />
            </Button>
          )}
        </div>
        {error ? (
          <p className="text-destructive mt-2 px-1 text-sm font-semibold" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </section>
  );
}
