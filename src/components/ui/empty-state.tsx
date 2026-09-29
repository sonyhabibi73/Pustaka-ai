import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * §6.12 — Empty state: ilustrasi garis + satu kalimat + satu tombol.
 * Setiap daftar kosong memakai komponen ini supaya tidak ada layar hampa.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-ink/40 text-card-foreground rounded-md border-2 border-dashed px-6 py-12 text-center",
        className,
      )}
    >
      <span className="bg-highlight/40 border-ink rounded-pill mx-auto mb-4 flex size-14 items-center justify-center border-2">
        <Icon className="size-7" aria-hidden="true" />
      </span>
      <p className="text-lg font-bold">{title}</p>
      <p className="text-muted-foreground mx-auto mt-1 max-w-md text-sm leading-relaxed">
        {description}
      </p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
