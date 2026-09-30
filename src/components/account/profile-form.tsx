"use client";

import { useActionState } from "react";

import { updateName } from "@/app/(app)/pengaturan/actions";
import type { ProfileState } from "@/app/(app)/pengaturan/types";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

/**
 * Form nama tampilan. Pesan sukses/gagal tampil di bawah kolom lewat
 * `useActionState`, sehingga hasil simpan tidak pernah hanya warna (WCAG 1.4.1).
 */
export function ProfileForm({ defaultName }: { defaultName: string }) {
  const [state, formAction, pending] = useActionState<ProfileState, FormData>(updateName, {
    ok: false,
  });

  return (
    // Galat divalidasi di server (zod) supaya pesannya selalu tampil di
    // bawah kolom sesuai §6.2, bukan bubble bawaan browser.
    <form action={formAction} noValidate className="grid gap-4" aria-busy={pending}>
      <Field
        label="Nama tampilan"
        htmlFor="profile-name"
        error={state.ok ? null : state.error}
        hint={state.ok ? undefined : "Muncul di sidebar dan di kepemilikan materimu."}
      >
        <Input
          id="profile-name"
          name="name"
          defaultValue={defaultName}
          required
          minLength={2}
          maxLength={60}
          autoComplete="name"
          disabled={pending}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" loading={pending} disabled={pending}>
          {pending ? "Menyimpan…" : "Simpan nama"}
        </Button>
        {state.ok && state.message ? (
          <p role="status" className="text-sm font-semibold">
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
