"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { signOut } from "@/lib/auth";
import { prisma, withDbRetry } from "@/lib/db";
import { getSession } from "@/lib/security/authz";
import type { ProfileState } from "./types";

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

/** Keluar dari sesi (baru) dan kembali ke halaman publik. */
export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
