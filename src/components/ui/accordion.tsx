"use client";

import { Minus, Plus } from "lucide-react";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";

export type AccordionItem = { question: string; answer: string };

/**
 * §5.12 — FAQ akordeon: hanya satu item terbuka pada satu waktu,
 * item pertama terbuka secara bawaan.
 */
export function Accordion({
  items,
  defaultOpen = 0,
  className,
}: {
  items: AccordionItem[];
  defaultOpen?: number | null;
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        return (
          <div key={item.question} className="border-ink bg-card shadow-1 rounded-md border-2">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-bold"
              >
                {item.question}
                <span className="bg-highlight text-ink border-ink rounded-pill flex size-7 shrink-0 items-center justify-center border-2">
                  {isOpen ? (
                    <Minus className="size-4" aria-hidden="true" />
                  ) : (
                    <Plus className="size-4" aria-hidden="true" />
                  )}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="text-muted-foreground px-5 pb-5 text-sm leading-relaxed"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
