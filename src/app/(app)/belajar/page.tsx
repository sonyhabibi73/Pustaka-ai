import Link from "next/link";
import { Layers3 } from "lucide-react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/security/authz";
import { prisma } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import { FlashcardStudy, type StudyCard } from "@/components/documents/flashcard-study";
import { countDueCards, resolveChunkIndexes } from "@/lib/study/due";
import { formatDate } from "@/lib/utils";

export default async function ReviewPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/sign-in");
  const userId = session.user.id;
  const now = new Date();

  const [due, upcoming, dueCount] = await Promise.all([
    prisma.flashcard.findMany({
      where: { userId, dueAt: { lte: now } },
      orderBy: { dueAt: "asc" },
      take: 120,
      select: {
        id: true,
        front: true,
        back: true,
        repetitions: true,
        intervalDays: true,
        easeFactor: true,
        sourceChunkIds: true,
        document: { select: { id: true, title: true } },
      },
    }),
    prisma.flashcard.findMany({
      where: { userId, dueAt: { gt: now } },
      orderBy: { dueAt: "asc" },
      take: 1,
      select: { dueAt: true },
    }),
    countDueCards(userId),
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
      docTitle: card.document.title,
    })),
  );

  const total = due.length + upcoming.length;

  return (
    <AppShell dueCount={dueCount} userName={session.user.name ?? session.user.email ?? "Pengguna"}>
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        <header className="mb-8">
          <p className="text-muted-foreground font-mono text-xs font-semibold tracking-[0.14em] uppercase">
            Ulangian / lintas materi
          </p>
          <h1 className="text-h1 mt-3 font-extrabold">
            Kartu jatuh tempo dari <span className="hl">semua materi</span>.
          </h1>
          <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed">
            {dueCount
              ? `${dueCount} kartu siap diulang. Jadwalkan sesi singkat tiap hari agar benar-benar melekat.`
              : "Tidak ada kartu yang jatuh tempo hari ini."}
          </p>
        </header>

        <FlashcardStudy
          backHref="/dashboard"
          cards={cards}
          emptyNotice={
            total
              ? {
                  title: "Semua kartu sudah diulang.",
                  body: `Kartu berikutnya jatuh tempo ${formatDate(upcoming[0]?.dueAt ?? new Date())}. Kembali lagi nanti.`,
                }
              : {
                  title: "Belum ada flashcard sama sekali.",
                  body: "Unggah materi, lalu tunggu sampai statusnya Siap — flashcard dibuat otomatis dari isinya.",
                }
          }
        />

        {cards.length ? (
          <p className="text-muted-foreground mt-6 flex items-center gap-2 text-sm">
            <Layers3 className="size-4" aria-hidden="true" />
            Kartu ditampilkan bersumber dari materimu.
          </p>
        ) : (
          <p className="text-muted-foreground mt-6 text-sm">
            Lihat{" "}
            <Link className="underline underline-offset-4" href="/dashboard">
              daftar materi
            </Link>{" "}
            untuk mulai belajar.
          </p>
        )}
      </div>
    </AppShell>
  );
}
