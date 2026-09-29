"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function DocumentTabs({
  documentId,
  quizId,
}: {
  documentId: string;
  quizId?: string | null;
}) {
  const pathname = usePathname();
  const base = `/documents/${documentId}`;
  const tabs = [
    { label: "Ringkasan", href: base, exact: true },
    { label: "Tanya Materi", href: `${base}/tanya`, exact: false },
    { label: "Flashcard", href: `${base}/flashcard`, exact: false },
    ...(quizId ? [{ label: "Kuis", href: `/quizzes/${quizId}`, exact: false }] : []),
  ];
  return (
    <nav
      aria-label="Bagian materi"
      className="border-line flex gap-1 overflow-x-auto border-b-2 pb-1"
    >
      {tabs.map((tab) => {
        const active = tab.exact
          ? pathname === tab.href
          : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={[
              "relative inline-flex h-11 shrink-0 items-center rounded-t-md px-3.5 text-sm",
              active ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
            href={tab.href}
            key={tab.href}
          >
            {active ? (
              <span
                aria-hidden="true"
                className="bg-highlight absolute inset-x-2 bottom-2 h-3 rounded-sm"
              />
            ) : null}
            <span className="relative">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
