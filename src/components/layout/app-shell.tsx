import Link from "next/link";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SideNav } from "@/components/layout/side-nav";

export function AppShell({
  children,
  userName,
  dueCount = 0,
}: {
  children: React.ReactNode;
  userName: string;
  dueCount?: number;
}) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="border-ink bg-card border-b-2 lg:min-h-dvh lg:border-r-2 lg:border-b-0">
        <div className="flex h-16 items-center justify-between px-5 lg:block lg:px-6 lg:pt-7">
          <Link
            href="/dashboard"
            className="text-base font-extrabold tracking-tight"
            aria-label="Pelajari AI — workspace"
          >
            pelajari<span className="text-primary">.ai</span>
          </Link>
          <div className="flex items-center gap-2 lg:mt-5">
            <span className="text-muted-foreground font-mono text-[11px] font-semibold tracking-[0.14em]">
              WORKSPACE
            </span>
            <span className="lg:hidden">
              <ThemeToggle />
            </span>
          </div>
        </div>
        <nav
          className="flex gap-2 overflow-x-auto px-3 pb-3 lg:block lg:px-3 lg:pt-6"
          aria-label="Navigasi utama"
        >
          <SideNav dueCount={dueCount} />
        </nav>
        <div className="border-line hidden border-t-2 p-3 lg:block">
          <div className="mb-3 flex items-center justify-between px-3">
            <p className="text-muted-foreground truncate text-sm">{userName}</p>
            <ThemeToggle />
          </div>
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
