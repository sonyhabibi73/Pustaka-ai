import { signOut } from "@/lib/auth";
import { SideNav } from "@/components/layout/side-nav";

async function logout() {
  "use server";
  await signOut({ redirectTo: "/" });
}

/**
 * Kerangka area setelah masuk: sidebar berkelompok + konten halaman.
 * `data-shell="pahamin"` memicu skop tema di globals.css (zinc monokrom,
 * garis 1px, aksen emerald) sehingga komponen bersama ikut berubah warna
 * tanpa menyentuh halaman beranda/blog yang tetap memakai Stabilo.
 */
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
    <div data-shell="pahamin" className="min-h-dvh lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="border-line bg-card border-b lg:min-h-dvh lg:border-r lg:border-b-0">
        <SideNav dueCount={dueCount} userName={userName} logoutAction={logout} />
      </aside>
      <main id="main-content" className="min-w-0">
        {children}
      </main>
    </div>
  );
}
