"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Link2, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Source = "file" | "youtube";

export function UploadForm() {
  const router = useRouter();
  const [source, setSource] = useState<Source>("file");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

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

  return (
    <form ref={formRef} action={submit} className="grid gap-4" aria-busy={state === "loading"}>
      <fieldset className="flex gap-2">
        <legend className="sr-only">Jenis sumber</legend>
        <Button
          aria-pressed={source === "file"}
          onClick={() => setSource("file")}
          variant={source === "file" ? "default" : "outline"}
          size="sm"
        >
          <FileUp className="size-4" aria-hidden="true" />
          File
        </Button>
        <Button
          aria-pressed={source === "youtube"}
          onClick={() => setSource("youtube")}
          variant={source === "youtube" ? "default" : "outline"}
          size="sm"
        >
          <Link2 className="size-4" aria-hidden="true" />
          YouTube
        </Button>
      </fieldset>
      <input name="source" type="hidden" value={source} />
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="document-title">
          Judul materi
        </label>
        <Input
          id="document-title"
          name="title"
          required
          maxLength={255}
          placeholder="Contoh: Biologi sel — pertemuan 3"
        />
      </div>
      {source === "file" ? (
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="document-file">
            Pilih file
          </label>
          <Input
            id="document-file"
            name="file"
            type="file"
            accept=".pdf,.txt,.docx,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            required
          />
          <p className="text-muted-foreground mt-2 text-xs leading-5">
            PDF, TXT, atau DOCX · maksimum 10 MB.
          </p>
        </div>
      ) : (
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="youtube-url">
            URL YouTube
          </label>
          <Input
            id="youtube-url"
            name="youtubeUrl"
            type="url"
            required
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <p className="text-muted-foreground mt-2 text-xs leading-5">
            Video harus memiliki caption yang dapat diakses.
          </p>
        </div>
      )}
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={state === "loading"}>
        {state === "loading" ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            Memproses…
          </>
        ) : (
          "Unggah materi"
        )}
      </Button>
    </form>
  );
}
