"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Layers3 } from "lucide-react";

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
            className={[
              "inline-flex h-11 items-center gap-3 rounded-md px-3 text-sm lg:w-full",
              active
                ? "bg-secondary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            ].join(" ")}
            href={item.href}
            key={item.href}
          >
            <Icon className="size-4" aria-hidden="true" />
            {item.label}
            {item.badge ? (
              <span className="bg-accent text-accent-foreground ml-auto min-w-5 rounded-full px-1.5 py-0.5 text-center font-mono text-[11px] leading-4 tabular-nums">
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </>
  );
}
