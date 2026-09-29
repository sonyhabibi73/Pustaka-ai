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
    <nav aria-label="Bagian materi" className="border-border flex gap-1 overflow-x-auto border-b">
      {tabs.map((tab) => {
        const active = tab.exact
          ? pathname === tab.href
          : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={[
              "relative inline-flex h-11 shrink-0 items-center px-3 text-sm",
              active
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
            href={tab.href}
            key={tab.href}
          >
            {tab.label}
            {active ? (
              <span aria-hidden="true" className="bg-accent absolute inset-x-2 -bottom-px h-0.5" />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
