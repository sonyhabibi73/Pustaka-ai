import Link from "next/link";
import { BookOpenCheck, LayoutDashboard, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function AppShell({ children, userName }: { children: React.ReactNode; userName: string }) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="border-border bg-card border-b lg:min-h-dvh lg:border-r lg:border-b-0">
        <div className="flex h-16 items-center justify-between px-5 lg:block lg:px-6 lg:pt-7">
          <Link href="/dashboard" className="text-sm font-bold">
            pelajari<span className="text-accent">.ai</span>
          </Link>
          <span className="text-muted-foreground font-mono text-xs lg:hidden">WORKSPACE</span>
        </div>
        <nav
          className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:px-3 lg:py-8"
          aria-label="Navigasi utama"
        >
          <Link
            className="bg-secondary inline-flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium lg:w-full"
            href="/dashboard"
          >
            <LayoutDashboard className="size-4" aria-hidden="true" />
            Workspace
          </Link>
          <Link
            className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-11 items-center gap-3 rounded-md px-3 text-sm lg:mt-1 lg:w-full"
            href="/dashboard#materi"
          >
            <BookOpenCheck className="size-4" aria-hidden="true" />
            Materi
          </Link>
        </nav>
        <div className="border-border hidden border-t p-3 lg:block">
          <p className="text-muted-foreground truncate px-3 py-2 text-sm">{userName}</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button className="w-full justify-start" variant="ghost" type="submit">
              <LogOut className="size-4" aria-hidden="true" />
              Keluar
            </Button>
          </form>
        </div>
      </aside>
      <main id="main-content" className="min-w-0">
        {children}
      </main>
    </div>
  );
}
