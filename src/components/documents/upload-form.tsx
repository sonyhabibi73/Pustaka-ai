"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, FileText, Link2, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Source = "file" | "youtube";

/**
 * §6.9 — Dropzone: garis putus-putus 2px, ikon besar, format + batas ukuran.
 * State: idle · drag-over (latar highlight 25%) · uploading (bar + nama file) · error.
 */
export function UploadForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState<Source>("file");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    setState("loading");
    setError("");
    try {
      const response = await fetch("/api/documents", { method: "POST", body: formData });
      const body = (await response.json()) as { id?: string; error?: string };
      if (!response.ok || !body.id) throw new Error(body.error ?? "Unggahan gagal diproses.");
      router.push(`/documents/${body.id}`);
    } catch (caught) {
      setState("error");
      setError(caught instanceof Error ? caught.message : "Unggahan gagal diproses.");
    }
  }

  function onDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file && inputRef.current) {
      inputRef.current.files = event.dataTransfer.files;
      setFileName(file.name);
    }
  }

  const loading = state === "loading";

  return (
    <form action={submit} className="grid gap-4" aria-busy={loading}>
      <fieldset className="border-ink bg-muted rounded-pill flex gap-1 border-2 p-1">
        <legend className="sr-only">Jenis sumber</legend>
        {(
          [
            { id: "file", label: "File", icon: FileText },
            { id: "youtube", label: "YouTube", icon: Link2 },
          ] as const
        ).map((option) => {
          const active = source === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSource(option.id)}
              className={cn(
                "rounded-pill flex flex-1 items-center justify-center gap-2 px-3 py-2 text-xs font-bold transition-colors duration-150",
                active ? "bg-ink text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <option.icon className="size-3.5" aria-hidden="true" />
              {option.label}
            </button>
          );
        })}
      </fieldset>
      <input name="source" type="hidden" value={source} />

      <Field label="Judul materi" htmlFor="document-title">
        <Input
          id="document-title"
          name="title"
          required
          maxLength={255}
          placeholder="Contoh: Biologi sel — pertemuan 3"
        />
      </Field>

      {source === "file" ? (
        <div className="grid gap-2">
          <span className="text-sm font-semibold" id="dropzone-label">
            Pilih file
          </span>
          <label
            htmlFor="document-file"
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
              "border-ink flex cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed px-4 py-8 text-center transition-colors duration-150",
              dragging ? "bg-highlight/25" : "bg-background hover:bg-muted",
            )}
          >
            <input
              ref={inputRef}
              id="document-file"
              name="file"
              type="file"
              required
              accept=".pdf,.txt,.docx,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
            />
            <UploadCloud className="text-muted-foreground size-8" aria-hidden="true" />
            <span className="mt-2 text-sm font-bold">
              {fileName || "Seret file ke sini, atau klik untuk memilih"}
            </span>
            <span className="text-muted-foreground mt-1 font-mono text-xs">
              PDF · DOCX · TXT · maksimum 10 MB
            </span>
          </label>
        </div>
      ) : (
        <Field
          label="URL YouTube"
          htmlFor="youtube-url"
          hint="Video harus memiliki caption yang dapat diakses."
        >
          <Input
            id="youtube-url"
            name="youtubeUrl"
            type="url"
            required
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </Field>
      )}

      {loading ? (
        <div>
          <div
            className="bg-muted rounded-pill border-line h-2 w-full overflow-hidden border"
            role="progressbar"
            aria-label="Mengunggah materi"
          >
            <div className="bg-brand h-full w-1/3 animate-pulse" />
          </div>
          <p className="text-muted-foreground mt-2 font-mono text-xs">
            {fileName ? `Mengunggah ${fileName}…` : "Mengunggah…"}
          </p>
        </div>
      ) : null}

      {error ? (
        <p className="text-destructive flex items-start gap-2 text-sm font-semibold" role="alert">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={loading} loading={loading}>
        {loading ? "Memproses…" : "Unggah materi"}
      </Button>
      <p className="text-muted-foreground text-xs leading-relaxed">
        Prosesnya 30 detik sampai 2 menit. Kamu boleh meninggalkan halaman ini.
      </p>
    </form>
  );
}
