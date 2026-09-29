"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Layers3 } from "lucide-react";

import { cn } from "@/lib/utils";

type Item = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number;
};

export function SideNav({ dueCount }: { dueCount: number }) {
  const pathname = usePathname();
  const items: Item[] = [
    { href: "/dashboard", label: "Workspace", icon: LayoutDashboard },
    { href: "/belajar", label: "Ulangian", icon: Layers3, badge: dueCount },
  ];
  return (
    <>
      {items.map((item) => {
        const active =
          item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-pill inline-flex h-11 shrink-0 items-center gap-3 border-2 px-4 text-sm font-semibold transition-colors duration-150 lg:w-full",
              active
                ? "border-ink bg-secondary text-foreground shadow-1"
                : "text-muted-foreground hover:bg-muted hover:text-foreground border-transparent",
            )}
            href={item.href}
            key={item.href}
          >
            <Icon className="size-4" aria-hidden="true" />
            {item.label}
            {item.badge ? (
              <span className="bg-highlight text-ink border-ink rounded-pill ml-auto min-w-6 border-2 px-1.5 py-0.5 text-center font-mono text-[11px] leading-4 font-bold tabular-nums">
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </>
  );
}
