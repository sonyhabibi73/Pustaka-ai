import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cloneElement, isValidElement, type ReactElement } from "react";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/**
 * §6.1 — Tinggi 48px (52px di mobile), radius pill, border tinta 2px.
 * Hover: bergeser −2px dengan bayangan naik. Pressed: masuk +2px, bayangan hilang.
 * Disabled: 45% opasitas. Loading: spinner dengan lebar tombol dipertahankan.
 */
const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 rounded-pill px-6",
    "text-sm font-bold whitespace-nowrap",
    "transition-[transform,box-shadow,background-color,color] duration-150 ease-snappy",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-45",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-2 border-ink bg-primary text-primary-foreground shadow-1",
          "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-2",
          "active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
        ].join(" "),
        accent: [
          "border-2 border-ink bg-accent text-accent-foreground shadow-1",
          "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-2",
          "active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
        ].join(" "),
        secondary: [
          "border-2 border-ink bg-card text-foreground shadow-1",
          "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-2",
          "active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
        ].join(" "),
        outline: [
          "border-2 border-ink bg-card text-foreground shadow-1",
          "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-2",
          "active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
        ].join(" "),
        ghost: "text-brand hover:bg-muted",
        destructive: [
          "border-2 border-ink bg-destructive text-destructive-foreground shadow-1",
          "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-2",
          "active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
        ].join(" "),
      },
      size: {
        default: "h-[52px] px-6 text-sm sm:h-12",
        sm: "h-10 px-4 text-xs",
        lg: "h-14 px-7 text-base sm:h-13",
        icon: "h-[52px] w-[52px] px-0 sm:h-12 sm:w-12",
        "icon-sm": "h-10 w-10 px-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /**
   * Terapkan gaya button ke child (biasanya <Link>) tanpa elemen pembungkus,
   * supaya tautan tetap jadi tautan untuk screen reader dan klik tengah.
   */
  asChild?: boolean;
  /** Tampilkan spinner dan pertahankan lebar tombol. */
  loading?: boolean;
}

export function Button({
  asChild,
  className,
  variant,
  size,
  type = "button",
  loading = false,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, { className: cn(classes, child.props.className) });
  }
  return (
    <button className={classes} type={type} aria-busy={loading || undefined} {...props}>
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          <span className="invisible">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export { buttonVariants };
