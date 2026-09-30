"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FolderOpen,
  Globe,
  LayoutDashboard,
  Layers3,
  LogOut,
  Menu,
  Settings,
  Target,
  X,
  type LucideIcon,
} from "lucide-react";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

type Item = {
  href?: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  /** Fitur yang belum dibangun: tampil rapi tapi belum bisa diklik. */
  soon?: boolean;
};

/**
 * Menu ruang kerja dikelompokkan: UTAMA · AKTIVITAS · AKUN.
 * Item bertanda `soon` dirender sebagai elemen non-interaktif dengan label
 * "Segera" — pengguna tetap bisa melihat peta fitur tanpa tautan mati yang
 * mengecoh (WCAG 2.2: tidak ada fokus yang masuk ke jalur buntu).
 */
export function SideNav({
  dueCount,
  userName,
  logoutAction,
}: {
  dueCount: number;
  userName: string;
  logoutAction: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const groups: { label: string; items: Item[] }[] = [
    {
      label: "Utama",
      items: [
        { href: "/dashboard", label: "Workspace", icon: LayoutDashboard },
        { label: "Koleksi", icon: FolderOpen, soon: true },
      ],
    },
    {
      label: "Aktivitas",
      items: [
        { href: "/belajar", label: "Ulangan", icon: Layers3, badge: dueCount },
        { label: "Simulasi Ujian", icon: Target, soon: true },
        { href: "/statistik", label: "Statistik", icon: BarChart3 },
      ],
    },
    {
      label: "Akun",
      items: [{ href: "/pengaturan", label: "Pengaturan", icon: Settings }],
    },
  ];

  return (
    <>
      <div className="flex h-16 items-center justify-between gap-3 px-5 lg:block lg:px-6 lg:pt-7">
        <Link
          href="/dashboard"
          className="text-base font-extrabold tracking-tight"
          aria-label="Pustaka AI — workspace"
        >
          pustaka<span className="text-primary">.ai</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground hidden font-mono text-[11px] font-semibold tracking-[0.14em] lg:inline">
            WORKSPACE
          </span>
          <ThemeToggle />
          <button
            type="button"
            className="border-line text-foreground hover:bg-muted rounded-pill inline-flex h-10 items-center gap-2 border px-3 text-sm font-semibold lg:hidden"
            aria-expanded={open}
            aria-controls="app-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X className="size-4" aria-hidden="true" />
            ) : (
              <Menu className="size-4" aria-hidden="true" />
            )}
            Menu
          </button>
        </div>
      </div>

      <nav
        id="app-nav"
        aria-label="Navigasi utama"
        className={cn("px-3 pt-3 pb-4 lg:block lg:pt-6", open ? "block" : "hidden")}
      >
        {groups.map((group) => (
          <div className="mb-4" key={group.label}>
            <p className="nav-group mb-1.5">{group.label}</p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                if (item.soon || !item.href) {
                  return (
                    <li key={item.label}>
                      <span className="nav-item" data-soon="true" aria-disabled="true">
                        <span className="nav-dot" aria-hidden="true" />
                        <Icon className="size-4 shrink-0" aria-hidden="true" />
                        {item.label}
                        <span className="border-line text-muted-foreground rounded-pill ml-auto border px-1.5 py-0.5 font-mono text-[10px] leading-3 font-semibold tracking-wide">
                          Segera
                        </span>
                      </span>
                    </li>
                  );
                }
                const active =
                  item.href === "/dashboard"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      aria-current={active ? "page" : undefined}
                      className="nav-item"
                      href={item.href}
                      onClick={() => setOpen(false)}
                    >
                      <span className="nav-dot" aria-hidden="true" />
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      {item.label}
                      {item.badge ? (
                        <span className="bg-highlight text-ink border-line rounded-pill ml-auto min-w-6 border px-1.5 py-0.5 text-center font-mono text-[11px] leading-4 font-bold tabular-nums">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="border-line mt-4 border-t pt-3">
          <Link
            href="/"
            className="nav-item"
            onClick={() => setOpen(false)}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            <span className="nav-dot" aria-hidden="true" />
            <Globe className="size-4 shrink-0" aria-hidden="true" />
            Halaman publik
          </Link>
          <form action={logoutAction}>
            <button className="nav-item" type="submit">
              <span className="nav-dot" aria-hidden="true" />
              <LogOut className="size-4 shrink-0" aria-hidden="true" />
              Keluar
            </button>
          </form>
        </div>
      </nav>

      <div className="border-line hidden border-t p-3 lg:block">
        <p className="text-muted-foreground truncate px-3 text-sm">{userName}</p>
      </div>
    </>
  );
}
