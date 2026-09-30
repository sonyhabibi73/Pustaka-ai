import Link from "next/link";

const columns = [
  {
    title: "Produk",
    items: [
      { label: "Fitur", href: "/#fitur" },
      { label: "Cara kerja", href: "/#cara-kerja" },
      { label: "Format yang didukung", href: "/#format" },
      { label: "Blog", href: "/blog" },
      { label: "Masuk", href: "/sign-in" },
    ],
  },
  {
    title: "Belajar",
    items: [
      { label: "Workspace", href: "/dashboard" },
      { label: "Ulangan kartu", href: "/belajar" },
      { label: "Tips menjaga streak", href: "/blog" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Kebijakan privasi", href: "/#faq" },
      { label: "Ketentuan layanan", href: "/#faq" },
      { label: "Pengembalian dana", href: "/#faq" },
    ],
  },
] as const;

/** §5.14 — Footer tiga kolom + blok legal ringkas (bukan alamat panjang). */
export function Footer() {
  return (
    <footer className="border-line border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.2fr_repeat(3,1fr)]">
        <div>
          <Link href="/" className="text-lg font-extrabold tracking-tight">
            pelajari<span className="text-primary">.ai</span>
          </Link>
          <p className="text-muted-foreground mt-3 max-w-xs text-sm leading-relaxed">
            Ruang belajar yang menjawab hanya dari materimu sendiri.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href="https://instagram.com"
              className="border-ink bg-card text-foreground hover:bg-muted rounded-pill inline-flex size-10 items-center justify-center border-2 transition-colors duration-150"
              aria-label="Instagram"
            >
              <span aria-hidden="true">IG</span>
            </a>
            <a
              href="https://youtube.com"
              className="border-ink bg-card text-foreground hover:bg-muted rounded-pill inline-flex size-10 items-center justify-center border-2 transition-colors duration-150"
              aria-label="YouTube"
            >
              <span aria-hidden="true">YT</span>
            </a>
            <a
              href="mailto:halo@pelajari.ai"
              className="border-ink bg-card text-foreground hover:bg-muted rounded-pill inline-flex size-10 items-center justify-center border-2 transition-colors duration-150"
              aria-label="Email"
            >
              <span aria-hidden="true">@</span>
            </a>
          </div>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-sm font-extrabold tracking-tight uppercase">{column.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {column.items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors duration-150"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-line border-t">
        <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© 2026 Pelajari AI · Dibuat untuk pelajar Indonesia.</p>
          <p>Materi belajarmu adalah milikmu—tidak dijual ke pihak ketiga.</p>
        </div>
      </div>
    </footer>
  );
}
