"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { signOut } from "@/lib/auth";
import { prisma, withDbRetry } from "@/lib/db";
import { getSession } from "@/lib/security/authz";
import { CARD_BATCH_SIZES, DEFAULT_STUDY_PREFS } from "@/lib/study/preferences";
import { saveStudyPrefs } from "@/lib/study/preferences-store";
import type { ProfileState, StudyPrefsState } from "./types";

const nameSchema = z
  .string()
  .trim()
  .min(2, "Nama minimal 2 karakter.")
  .max(60, "Nama maksimal 60 karakter.");

/** Simpan nama tampilan ke tabel User (dipakai sidebar & kepemilikan karya). */
export async function updateName(
  _previous: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const session = await getSession();
  if (!session?.user?.id) return { ok: false, error: "Sesi kamu berakhir. Masuk ulang dulu, ya." };

  const raw = formData.get("name");
  const parsed = nameSchema.safeParse(typeof raw === "string" ? raw : "");
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Nama tidak valid." };
  }

  try {
    await withDbRetry(() =>
      prisma.user.update({ where: { id: session.user.id }, data: { name: parsed.data } }),
    );
  } catch {
    return { ok: false, error: "Gagal menyimpan. Coba lagi beberapa saat." };
  }

  revalidatePath("/pengaturan");
  revalidatePath("/dashboard");
  return { ok: true, message: "Nama tersimpan." };
}

/**
 * Simpan preferensi belajar ke cookie perangkat. Materi harus benar-benar
 * milik pengguna yang sedang masuk sebelum id-nya dipakai sebagai default.
 */
export async function saveStudyPrefsAction(
  _previous: StudyPrefsState,
  formData: FormData,
): Promise<StudyPrefsState> {
  const session = await getSession();
  if (!session?.user?.id) return { ok: false, error: "Sesi kamu berakhir. Masuk ulang dulu, ya." };

  const size = Number(formData.get("cardsPerSession"));
  const cardsPerSession = (CARD_BATCH_SIZES as readonly number[]).includes(size)
    ? size
    : DEFAULT_STUDY_PREFS.cardsPerSession;

  const rawDoc = formData.get("defaultDocId");
  let defaultDocId: string | null = null;
  if (typeof rawDoc === "string" && rawDoc) {
    const owned = await withDbRetry(() =>
      prisma.document.findFirst({
        where: { id: rawDoc, userId: session.user.id },
        select: { id: true },
      }),
    );
    defaultDocId = owned?.id ?? null;
  }

  await saveStudyPrefs({ cardsPerSession, defaultDocId });
  revalidatePath("/pengaturan");
  revalidatePath("/belajar");
  return { ok: true, message: "Preferensi belajar tersimpan." };
}

/** Keluar dari sesi (baru) dan kembali ke halaman publik. */
export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

/** Hapus seluruh sesi pengguna (semua perangkat) lalu keluar dari perangkat ini. */
export async function signOutEverywhere() {
  const session = await getSession();
  if (session?.user?.id) {
    await withDbRetry(() => prisma.session.deleteMany({ where: { userId: session.user.id } }));
  }
  await signOut({ redirectTo: "/" });
}
