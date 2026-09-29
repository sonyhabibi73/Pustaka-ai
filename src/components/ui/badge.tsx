import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * §6.4 — Badge & chip.
 * Populer: latar --highlight, teks --ink, kapital kecil.
 * Hemat: latar --mint 20%, teks --ink.
 * Default: permukaan kartu dengan border tinta.
 */
const variants = {
  default: "bg-card text-foreground",
  highlight: "bg-highlight text-ink",
  mint: "bg-mint/20 text-ink",
  brand: "bg-primary text-primary-foreground",
  ink: "bg-ink text-background",
  muted: "bg-muted text-muted-foreground",
} as const;

export function Badge({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={cn(
        "rounded-pill border-ink inline-flex items-center gap-1.5 border-2 px-2.5 py-0.5 text-xs font-bold",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
