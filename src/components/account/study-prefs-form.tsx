"use client";

import { useActionState } from "react";

import { saveStudyPrefsAction } from "@/app/(app)/pengaturan/actions";
import type { StudyPrefsState } from "@/app/(app)/pengaturan/types";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/input";
import { CARD_BATCH_SIZES, type StudyPrefs } from "@/lib/study/preferences";
import { cn } from "@/lib/utils";

export type PrefDocument = { id: string; title: string; cardCount: number };

/**
 * Preferensi belajar: batas kartu per sesi dan materi yang diulang lebih
 * dulu. Keduanya dipakai langsung oleh halaman /belajar.
 */
export function StudyPrefsForm({
  prefs,
  documents,
}: {
  prefs: StudyPrefs;
  documents: PrefDocument[];
}) {
  const [state, formAction, pending] = useActionState<StudyPrefsState, FormData>(
    saveStudyPrefsAction,
    { ok: false },
  );

  return (
    <form action={formAction} className="grid gap-5" aria-busy={pending}>
      <fieldset className="m-0 border-0 p-0">
        <legend className="text-foreground mb-2 block text-sm font-semibold">Kartu per sesi</legend>
        <div className="flex flex-wrap gap-2">
          {CARD_BATCH_SIZES.map((size) => (
            <label
              key={size}
              className={cn(
                "border-ink bg-card text-foreground has-[:focus-visible]:ring-ring rounded-pill has-[:checked]:bg-primary has-[:checked]:text-primary-foreground cursor-pointer border-2 px-4 py-2 text-sm font-bold transition-colors duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2",
              )}
            >
              <input
                type="radio"
                name="cardsPerSession"
                value={size}
                defaultChecked={size === prefs.cardsPerSession}
                className="sr-only"
              />
              {size}
            </label>
          ))}
        </div>
        <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
          Kartu berlebih tetap tersimpan; sisa antrean menunggu sesi berikutnya.
        </p>
      </fieldset>

      <Field
        label="Materi yang diulang lebih dulu"
        htmlFor="default-doc"
        hint={
          documents.length
            ? "Dipakai saat kamu membuka halaman Ulangan tanpa memilih materi."
            : "Belum ada materi dengan flashcard—pilihan ini menyusul setelah kartu dibuat."
        }
      >
        <select
          id="default-doc"
          name="defaultDocId"
          defaultValue={prefs.defaultDocId ?? ""}
          disabled={!documents.length}
          className="border-input text-foreground bg-surface focus-visible:border-brand focus-visible:ring-brand/40 flex h-12 w-full rounded-sm border-2 px-3 py-2 text-base outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <option value="">Semua materi (campur)</option>
          {documents.map((document) => (
            <option key={document.id} value={document.id}>
              {document.title} · {document.cardCount} kartu
            </option>
          ))}
        </select>
      </Field>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" loading={pending} disabled={pending}>
          {pending ? "Menyimpan…" : "Simpan preferensi"}
        </Button>
        {state.ok && state.message ? (
          <p role="status" className="text-sm font-semibold">
            {state.message}
          </p>
        ) : null}
        {!state.ok && state.error ? (
          <p role="alert" className="text-destructive text-sm font-semibold">
            {state.error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
