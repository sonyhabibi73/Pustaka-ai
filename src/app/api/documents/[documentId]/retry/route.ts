import { after } from "next/server";
import { processDocument } from "@/lib/documents/process";
import { getOwnedDocument, requireUserId } from "@/lib/security/authz";
import { apiError } from "@/lib/security/http";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

/**
 * Proses ulang dokumen yang statusnya gagal. Kode yang sama dengan alur unggah:
 * pekerjaan berjalan di latar lewat `after()` supaya permintaan tidak menunggu
 * ekstraksi, embedding, dan pembuatan artefak sampai selesai.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ documentId: string }> },
) {
  try {
    const userId = await requireUserId();
    await enforceRateLimit(`retry:${userId}`, 10, "1 h");
    const { documentId } = await params;
    const document = await getOwnedDocument(documentId, userId);
    if (!document) throw new Error("DOCUMENT_NOT_FOUND");
    if (document.status !== "FAILED") {
      return Response.json(
        { error: "Hanya materi yang gagal yang bisa diproses ulang." },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }
    after(async () => {
      await processDocument(documentId).catch(() => {
        // kegagalan kedua sudah tercatat di Document.processingError
      });
    });
    return Response.json({ status: "PROCESSING" }, { status: 202 });
  } catch (error) {
    return apiError(error);
  }
}
