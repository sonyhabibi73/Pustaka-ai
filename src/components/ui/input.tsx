import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * §6.2 — Label selalu di atas kolom, tinggi 48px, border tinta 2px, radius --r-sm.
 * Fokus: ring 3px brand 40% + border brand. Error: border bahaya + ikon + pesan.
 */
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "border-input text-foreground placeholder:text-muted-foreground",
        "bg-surface flex h-12 w-full rounded-sm border-2 px-3.5 py-2 text-base outline-none",
        "focus-visible:border-brand focus-visible:ring-brand/40 focus-visible:ring-4",
        "disabled:cursor-not-allowed disabled:opacity-45",
        "aria-[invalid=true]:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1.5 block text-sm font-semibold", className)} {...props} />;
}

/**
 * Label + kontrol + pesan galat dalam satu slot, supaya pesan error selalu
 * berada di bawah kolom (bukan hanya warna) sesuai §6.2.
 */
export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  error?: string | null;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p
          className="text-destructive mt-1.5 flex items-center gap-1.5 text-sm font-medium"
          role="alert"
        >
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      ) : hint ? (
        <p className="text-muted-foreground mt-1.5 text-sm">{hint}</p>
      ) : null}
    </div>
  );
}
