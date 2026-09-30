import Link from "next/link";
import { Layers3, ListFilter } from "lucide-react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/security/authz";
import { prisma, withDbRetry } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import { FlashcardStudy, type StudyCard } from "@/components/documents/flashcard-study";
import { countDueCards, resolveChunkIndexes } from "@/lib/study/due";
import { getStudyPrefs } from "@/lib/study/preferences-store";
import { cn, formatDate } from "@/lib/utils";

type SearchParams = Promise<{ doc?: string | string[] }>;

export default async function ReviewPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await getSession();
  if (!session?.user?.id) redirect("/sign-in");
  const userId = session.user.id;
  const now = new Date();

  const [params, prefs] = await Promise.all([searchParams, getStudyPrefs()]);
  const requestedDoc = typeof params.doc === "string" && params.doc ? params.doc : null;

  const dueCount = await countDueCards(userId);

  // Hitung kartu jatuh tempo per materi supaya pengguna bisa memilih materi
  // mana yang mau diulang, bukan semua materi tercampur jadi satu antrean.
  const duePerDocument = await withDbRetry(() =>
    prisma.flashcard.groupBy({
      by: ["documentId"],
      where: { userId, dueAt: { lte: now } },
      _count: { _all: true },
    }),
  );
  const dueDocIds = duePerDocument.map((row) => row.documentId);
  const dueDocuments = dueDocIds.length
    ? await withDbRetry(() =>
        prisma.document.findMany({
          where: { id: { in: dueDocIds } },
          select: { id: true, title: true },
        }),
      )
    : [];
  const titleById = new Map(dueDocuments.map((document) => [document.id, document.title]));

  const filters = duePerDocument
    .map((row) => ({
      id: row.documentId,
      title: titleById.get(row.documentId) ?? "Materi tanpa judul",
      count: row._count._all,
    }))
    .sort((a, b) => b.count - a.count);

  // Pilihan aktif: parameter URL > preferensi pengguna > semua materi.
  const wanted = requestedDoc ?? prefs.defaultDocId;
  const active = wanted ? (filters.find((filter) => filter.id === wanted) ?? null) : null;

  const scope = active ? { documentId: active.id } : {};
  const [due, nextUp, totalCards, nextAny] = await withDbRetry(() =>
    Promise.all([
      prisma.flashcard.findMany({
        where: { userId, dueAt: { lte: now }, ...scope },
        orderBy: { dueAt: "asc" },
        take: prefs.cardsPerSession,
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
        where: { userId, dueAt: { gt: now }, ...scope },
        orderBy: { dueAt: "asc" },
        take: 1,
        select: { dueAt: true },
      }),
      prisma.flashcard.count({ where: { userId } }),
      prisma.flashcard.findMany({
        where: { userId, dueAt: { gt: now } },
        orderBy: { dueAt: "asc" },
        take: 1,
        select: { dueAt: true },
      }),
    ]),
  );

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

  const allDue = filters.reduce((sum, filter) => sum + filter.count, 0);
  const dueTotalInScope = active ? active.count : allDue;
  const queuedBeyondBatch = Math.max(0, dueTotalInScope - due.length);
  const nextDueAt = nextUp[0]?.dueAt ?? nextAny[0]?.dueAt;

  const emptyNotice = queuedBeyondBatch
    ? {
        title: "Sesi batch ini selesai.",
        body: `${queuedBeyondBatch} kartu masih menunggu giliran. Lanjutkan lain waktu, atau naikkan batas kartu di Pengaturan.`,
      }
    : dueTotalInScope
      ? {
          title: active ? "Materi ini selesai diulang." : "Semua kartu sudah diulang.",
          body: nextDueAt
            ? `Kartu berikutnya jatuh tempo ${formatDate(nextDueAt)}. Kembali lagi nanti.`
            : "Sampai kartu berikutnya jatuh tempo, istirahat dulu.",
        }
      : totalCards
        ? {
            title: active
              ? "Tidak ada kartu jatuh tempo di materi ini."
              : "Semua kartu sudah diulang.",
            body: nextDueAt
              ? `Kartu berikutnya jatuh tempo ${formatDate(nextDueAt)}. Kembali lagi nanti.`
              : "Kembali lagi nanti.",
          }
        : {
            title: "Belum ada flashcard sama sekali.",
            body: "Unggah materi, lalu tunggu sampai statusnya Siap — flashcard dibuat otomatis dari isinya.",
          };

  return (
    <AppShell dueCount={dueCount} userName={session.user.name ?? session.user.email ?? "Pengguna"}>
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        <header className="mb-6">
          <p className="text-muted-foreground font-mono text-xs font-semibold tracking-[0.14em] uppercase">
            {active ? `Ulangan / ${active.title}` : "Ulangan / lintas materi"}
          </p>
          <h1 className="text-h1 mt-3 font-extrabold">
            {active ? (
              <>
                Kartu jatuh tempo dari <span className="hl">{active.title}</span>.
              </>
            ) : (
              <>
                Kartu jatuh tempo dari <span className="hl">semua materi</span>.
              </>
            )}
          </h1>
          <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed">
            {dueCount
              ? `${dueTotalInScope} kartu siap diulang di pilihan ini. Jadwalkan sesi singkat tiap hari agar benar-benar melekat.`
              : "Tidak ada kartu yang jatuh tempo hari ini."}
          </p>
        </header>

        {/* Pemilihan materi: hanya materi yang punya kartu jatuh tempo. */}
        <section
          className="border-line bg-card mb-8 rounded-md border p-4"
          aria-label="Pilih materi yang mau diulang"
        >
          <p className="text-muted-foreground flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.14em] uppercase">
            <ListFilter className="size-3.5" aria-hidden="true" />
            Materi yang diulang
          </p>
          {filters.length ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              <li>
                <Link
                  href="/belajar"
                  aria-current={active ? undefined : "page"}
                  className={cn(
                    "border-ink rounded-pill border-2 px-3.5 py-1.5 text-sm font-bold transition-colors duration-150",
                    active
                      ? "bg-card text-foreground hover:bg-muted"
                      : "bg-primary text-primary-foreground",
                  )}
                >
                  Semua materi · {allDue}
                </Link>
              </li>
              {filters.map((filter) => (
                <li key={filter.id}>
                  <Link
                    href={`/belajar?doc=${filter.id}`}
                    aria-current={active?.id === filter.id ? "page" : undefined}
                    className={cn(
                      "border-ink rounded-pill flex max-w-72 items-center gap-2 border-2 px-3.5 py-1.5 text-sm font-bold transition-colors duration-150",
                      active?.id === filter.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-foreground hover:bg-muted",
                    )}
                    title={filter.title}
                  >
                    <span className="truncate">{filter.title}</span>
                    <span className="font-mono text-xs font-semibold tabular-nums">
                      {filter.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Tidak ada materi dengan kartu jatuh tempo hari ini.
            </p>
          )}
        </section>

        <FlashcardStudy backHref="/dashboard" cards={cards} emptyNotice={emptyNotice} />

        {cards.length ? (
          <p className="text-muted-foreground mt-6 flex items-center gap-2 text-sm">
            <Layers3 className="size-4" aria-hidden="true" />
            Menampilkan {cards.length} dari {dueTotalInScope} kartu jatuh tempo
            {active ? " di materi ini" : ""}.
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
