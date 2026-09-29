"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowUp, LoaderCircle, Quote } from "lucide-react";
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
  "Buat 5 pertanyaan pemantik dari materi ini",
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
    try {
      const response = await fetch(`/api/documents/${documentId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, threadId }),
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
          meta = JSON.parse(accumulated.slice(separator + 1)) as StreamMeta;
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
      setError(caught instanceof Error ? caught.message : "Jawaban tidak dapat dibuat.");
      setMessages((current) => {
        const last = current[current.length - 1];
        return last?.role === "assistant" && !last.content ? current.slice(0, -1) : current;
      });
    } finally {
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
      className="border-border bg-card flex h-[min(70vh,44rem)] flex-col border"
    >
      <header className="border-border border-b p-5">
        <h2 className="font-semibold">Tanya materi</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {documentTitle
            ? `Jawaban disusun dari “${documentTitle}”. Klik sumber untuk membaca kutipannya.`
            : "Jawaban disusun dari dokumen aktif. Klik sumber untuk membaca kutipannya."}
        </p>
      </header>

      <div aria-live="polite" className="flex-1 space-y-6 overflow-y-auto p-5">
        {showSuggestions ? (
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm">
              Belum ada pertanyaan. Mulai dari salah satu ini:
            </p>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_SUGGESTIONS.map((suggestion) => (
                <button
                  className="border-border hover:bg-secondary min-h-10 rounded-full border px-4 text-left text-sm transition-colors disabled:opacity-50"
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
                className="bg-secondary ml-auto max-w-[85%] p-3 text-sm leading-6"
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
                className="text-muted-foreground flex items-center gap-2 text-sm"
                key={`loading-${index}`}
              >
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                Menyusun jawaban dari dokumen…
              </div>
            );
          }
          return (
            <article className="max-w-[92%] text-sm" key={`assistant-${index}`}>
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
                        className="border-border text-muted-foreground hover:text-foreground inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors"
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
                <blockquote className="border-border bg-muted mt-2 border-l-2 p-3 text-xs leading-6">
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

      <form className="border-border border-t p-3" onSubmit={submit}>
        <label className="sr-only" htmlFor="chat-input">
          Pertanyaan tentang materi
        </label>
        <div className="flex gap-2">
          <input
            className="placeholder:text-muted-foreground h-11 min-w-0 flex-1 bg-transparent px-3 text-base outline-none md:text-sm"
            id="chat-input"
            onChange={(event) => setInput(event.target.value)}
            placeholder="Tanyakan materi ini…"
            ref={inputRef}
            value={input}
          />
          <Button
            aria-label="Kirim pertanyaan"
            disabled={busy || !input.trim()}
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
