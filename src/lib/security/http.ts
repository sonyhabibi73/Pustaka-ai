import { NextResponse } from "next/server";

export function apiError(error: unknown) {
  const code = error instanceof Error ? error.message : "INTERNAL_ERROR";
  const status =
    code === "UNAUTHENTICATED"
      ? 401
      : code === "RATE_LIMITED"
        ? 429
        : code.includes("NOT_FOUND")
          ? 404
          : code.includes("INVALID")
            ? 400
            : 500;
  const message = status === 500 ? "Terjadi kesalahan pada server. Silakan coba lagi." : code;
  return NextResponse.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
