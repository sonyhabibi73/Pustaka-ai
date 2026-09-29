"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function FlashcardReview({
  cards,
}: {
  cards: { id: string; front: string; back: string }[];
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const card = cards[index];
  if (done || !card)
    return (
      <p className="text-muted-foreground text-sm">
        Sesi selesai. Kartu yang dinilai akan muncul sesuai jadwal berikutnya.
      </p>
    );
  async function review(grade: "AGAIN" | "HARD" | "GOOD" | "EASY") {
    await fetch(`/api/flashcards/${card.id}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grade }),
    });
    setRevealed(false);
    if (index + 1 >= cards.length) setDone(true);
    else setIndex((value) => value + 1);
  }
  return (
    <div className="space-y-4">
      <div className="border-border min-h-36 border p-5">
        <p className="font-medium">{card.front}</p>
        {revealed ? (
          <p className="border-border text-muted-foreground mt-5 border-t pt-4 text-sm leading-6">
            {card.back}
          </p>
        ) : (
          <Button className="mt-6" onClick={() => setRevealed(true)} variant="outline">
            Tampilkan jawaban
          </Button>
        )}
      </div>
      {revealed ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Button onClick={() => review("AGAIN")} variant="outline">
            Ulang
          </Button>
          <Button onClick={() => review("HARD")} variant="outline">
            Sulit
          </Button>
          <Button onClick={() => review("GOOD")} variant="outline">
            Paham
          </Button>
          <Button onClick={() => review("EASY")}>Mudah</Button>
        </div>
      ) : null}
    </div>
  );
}
