import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/security/authz";
import { prisma } from "@/lib/db";
import { FlashcardStudy, type StudyCard } from "@/components/documents/flashcard-study";
import { resolveChunkIndexes } from "@/lib/study/due";
import { formatDate } from "@/lib/utils";

export default async function DocumentFlashcardPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  const session = await getSession();
  if (!session?.user?.id) redirect("/sign-in");

  const document = await prisma.document.findFirst({
    where: { id: documentId, userId: session.user.id },
    select: { id: true, status: true },
  });
  if (!document) notFound();

  const backHref = `/documents/${document.id}`;
  if (document.status !== "READY") {
    const failed = document.status === "FAILED";
    return (
      <FlashcardStudy
        key={document.id}
        backHref={backHref}
        cards={[]}
        emptyNotice={
          failed
            ? {
                title: "Materi gagal diproses.",
                body: "Flashcard dibuat setelah materi berhasil diproses. Buka halaman materi untuk melihat penyebabnya dan mencoba proses ulang.",
              }
            : {
                title: "Materi belum selesai diproses.",
                body: "Flashcard dibuat setelah teks diekstrak, dipecah, dan dirangkai menjadi soal. Muat ulang halaman ini beberapa saat lagi.",
              }
        }
      />
    );
  }

  const now = new Date();
  const [due, upcoming] = await Promise.all([
    prisma.flashcard.findMany({
      where: { documentId, dueAt: { lte: now } },
      orderBy: { dueAt: "asc" },
      take: 100,
      select: {
        id: true,
        front: true,
        back: true,
        repetitions: true,
        intervalDays: true,
        easeFactor: true,
        sourceChunkIds: true,
      },
    }),
    prisma.flashcard.findMany({
      where: { documentId, dueAt: { gt: now } },
      orderBy: { dueAt: "asc" },
      select: { dueAt: true },
    }),
  ]);

  const cards: StudyCard[] = await Promise.all(
    due.map(async (card) => ({
      id: card.id,
      front: card.front,
      back: card.back,
      repetitions: card.repetitions,
      intervalDays: card.intervalDays,
      easeFactor: Number(card.easeFactor),
      sources: await resolveChunkIndexes(card.sourceChunkIds),
    })),
  );

  const totalCards = due.length + upcoming.length;
  const nextDue = upcoming[0]?.dueAt;

  return (
    <FlashcardStudy
      key={document.id}
      backHref={backHref}
      cards={cards}
      emptyNotice={
        totalCards
          ? {
              title: "Tidak ada kartu yang jatuh tempo hari ini.",
              body: `${totalCards} kartu sudah diulang. Jadwal berikutnya ${formatDate(nextDue ?? new Date())}.`,
            }
          : {
              title: "Belum ada flashcard.",
              body: "Flashcard dibuat otomatis dari isi materi setelah dokumen selesai diproses.",
            }
      }
    />
  );
}
