import Link from "next/link";
import { ArrowRight, BrainCircuit, FileText, MessageSquareText } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const features = [
  [
    FileText,
    "Ringkasan yang dapat ditelusuri",
    "Setiap penjelasan tertaut kembali ke bagian materi yang relevan.",
  ],
  [
    BrainCircuit,
    "Latihan yang menyesuaikan",
    "Flashcard memakai jadwal pengulangan berbasis hasil belajar Anda.",
  ],
  [
    MessageSquareText,
    "Tanya materi, bukan internet",
    "Asisten hanya menjawab dari sumber yang Anda unggah.",
  ],
] as const;

export default function HomePage() {
  return (
    <main>
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link className="text-sm font-bold tracking-tight" href="/">
          pelajari<span className="text-accent">.ai</span>
        </Link>
        <Link className={buttonVariants({ variant: "outline", size: "sm" })} href="/sign-in">
          Masuk
        </Link>
      </header>
      <section className="border-border bg-card border-y">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
          <div>
            <p className="text-muted-foreground mb-5 font-mono text-xs font-semibold tracking-[0.16em]">
              STUDY WORKSPACE / 01
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-balance sm:text-6xl">
              Materi Anda, jadi sistem belajar yang benar-benar berguna.
            </h1>
            <p className="text-muted-foreground mt-6 max-w-xl text-base leading-7 text-pretty">
              Unggah PDF, DOCX, TXT, atau video YouTube. Pelajari AI membuat rangkuman, kartu
              belajar, kuis, dan ruang tanya yang tetap berpijak pada materi Anda.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link className={buttonVariants()} href="/dashboard">
                Mulai belajar <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link className={buttonVariants({ variant: "outline" })} href="#cara-kerja">
                Cara kerja
              </Link>
            </div>
          </div>
          <aside
            className="border-border bg-background border p-5 sm:p-6"
            aria-label="Contoh jawaban berbasis sumber"
          >
            <p className="text-muted-foreground font-mono text-xs">KONTEKS AKTIF · BIOLOGI SEL</p>
            <p className="mt-8 text-lg leading-8 font-medium">“Apa fungsi mitokondria?”</p>
            <p className="border-accent text-muted-foreground mt-4 border-l-2 pl-4 leading-7">
              Mitokondria menghasilkan ATP melalui respirasi seluler, sesuai penjelasan pada bagian
              2.1 materi Anda.
            </p>
            <div className="border-border text-muted-foreground mt-8 border-t pt-4 font-mono text-xs">
              SUMBER · HALAMAN 12–13
            </div>
          </aside>
        </div>
      </section>
      <section id="cara-kerja" className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="border-border bg-border grid gap-px overflow-hidden border md:grid-cols-3">
          {features.map(([Icon, title, text], index) => (
            <article className="bg-background p-6" key={title}>
              <span className="text-muted-foreground font-mono text-xs">0{index + 1}</span>
              <Icon className="mt-10 size-5" aria-hidden="true" />
              <h2 className="mt-4 font-semibold">{title}</h2>
              <p className="text-muted-foreground mt-2 leading-6">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
