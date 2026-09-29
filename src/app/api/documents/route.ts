import { after } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { processDocument } from "@/lib/documents/process";
import { uploadPrivateFile } from "@/lib/documents/storage";
import { validateStudyFile, validateYouTubeUrl } from "@/lib/documents/validation";
import { requireUserId } from "@/lib/security/authz";
import { apiError } from "@/lib/security/http";
import { enforceRateLimit } from "@/lib/security/rate-limit";

const inputSchema = z.object({
  title: z.string().trim().min(1).max(255),
  source: z.enum(["file", "youtube"]),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    await enforceRateLimit(`upload:${userId}`, 10, "1 h");
    const formData = await request.formData();
    const input = inputSchema.parse({
      title: formData.get("title"),
      source: formData.get("source"),
    });
    if (input.source === "youtube") {
      const { url } = validateYouTubeUrl(z.string().parse(formData.get("youtubeUrl")));
      const document = await prisma.document.create({
        data: { userId, title: input.title, source: "YOUTUBE", kind: "YOUTUBE", sourceUrl: url },
      });
      after(async () => {
        await processDocument(document.id);
      });
      return Response.json({ id: document.id, status: "PROCESSING" }, { status: 202 });
    }
    const file = formData.get("file");
    if (!(file instanceof File)) throw new Error("INVALID_FILE");
    const validated = await validateStudyFile(file);
    const hash = createHash("sha256").update(validated.buffer).digest("hex");
    const existing = await prisma.document.findFirst({
      where: { userId, sha256: hash, status: { in: ["UPLOADED", "PROCESSING", "READY"] } },
      select: { id: true },
    });
    if (existing) return Response.json({ id: existing.id, duplicate: true }, { status: 200 });
    const key = `${userId}/${randomUUID()}/${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    await uploadPrivateFile(key, validated.buffer, validated.mime);
    const document = await prisma.document.create({
      data: {
        userId,
        title: input.title,
        source: "UPLOAD",
        kind: validated.kind,
        originalFilename: file.name.slice(0, 255),
        storageKey: key,
        mimeType: validated.mime,
        sizeBytes: file.size,
        sha256: hash,
      },
    });
    after(async () => {
      await processDocument(document.id);
    });
    return Response.json({ id: document.id, status: "PROCESSING" }, { status: 202 });
  } catch (error) {
    return apiError(error);
  }
}
