import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * §6.3 — Kartu stiker: latar --surface, border tinta 2px, bayangan --shadow-2,
 * padding 24px. Tambah `interactive` untuk kartu yang bisa ditekan/difokuskan.
 */
export function Card({
  className,
  interactive,
  ...props
}: HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "border-ink bg-card text-card-foreground shadow-2 rounded-md border-2 p-6",
        interactive &&
          "lift focus-visible:outline-ring cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 flex flex-col gap-1.5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-lg font-bold tracking-tight text-balance", className)} {...props} />
  );
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-muted-foreground text-sm leading-relaxed", className)} {...props} />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}
