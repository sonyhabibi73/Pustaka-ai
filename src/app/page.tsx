import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarClock,
  Captions,
  FileText,
  Layers,
  MessageSquareText,
  Sparkles,
  Target,
} from "lucide-react";

import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChatDemo,
  FlipCardDemo,
  QuizDemo,
  SummaryDemo,
} from "@/components/marketing/feature-demos";
import { Footer } from "@/components/marketing/footer";
import { HeroDemo } from "@/components/marketing/hero-demo";
import { Navbar } from "@/components/marketing/navbar";

/**
 * Satu sumber angka untuk seluruh halaman (temuan #1: angka tidak konsisten).
 * Semuanya fakta produk yang bisa diverifikasi sendiri—bukan klaim jumlah
 * pengguna atau rating yang belum bisa kita buktikan.
 */
const stats = [
  { value: "4", label: "format sumber: PDF, DOCX, TXT, dan YouTube" },
  { value: "≤2 mnt", label: "materi siap dipakai dari unggahan pertama" },
  { value: "100%", label: "jawaban berpijak pada materimu sendiri" },
  { value: "Gratis", label: "coba dulu, tanpa kartu kredit" },
] as const;

const complaints = [
  "Udah baca berkali-kali, besok lupa lagi.",
  "Rangkuman sendiri kelamaan—tugas belum mulai.",
  "Tanya dosen jam 11 malam? Nggak enak.",
  "Soalnya banyak, mulai belajarnya dari mana?",
] as const;

const steps = [
  {
    number: "01",
    title: "Upload materi",
    text: "Seret PDF, DOCX, atau TXT—atau tempel link YouTube. AI membaca materimu dalam 30 detik sampai 2 menit.",
  },
  {
    number: "02",
    title: "Pilih hasilnya",
    text: "Ringkasan, flashcard, kuis, atau tanya langsung. Semua dibuat dari materi yang kamu unggah, bukan dari internet.",
  },
  {
    number: "03",
    title: "Belajar & uji diri",
    text: "Baca ringkasan, tanya bagian yang bingung, latih kartu sesuai jadwal, lalu kuis. Yang salah jadi bahan tanya.",
  },
] as const;

const formats = [
  {
    icon: FileText,
    title: "Dokumen",
    list: "PDF · DOCX · TXT",
    note: "Maksimum 10 MB per file",
  },
  {
    icon: Captions,
    title: "YouTube",
    list: "Link video publik",
    note: "Video harus punya caption",
  },
] as const;

const faqs = [
  {
    question: "Apakah materi saya dipakai untuk melatih AI?",
    answer:
      "Tidak. Jawaban dibuat hanya dari dokumen yang kamu unggah, dan materimu tidak dipakai melatih model mana pun. Materi adalah milikmu dan bisa kamu hapus kapan saja.",
  },
  {
    question: "Format file apa saja yang didukung?",
    answer:
      "Saat ini mendukung PDF, DOCX, dan TXT dengan ukuran maksimum 10 MB, ditambah link video YouTube yang punya caption. Materi lain bisa dikonversi dulu ke PDF.",
  },
  {
    question: "Berapa lama prosesnya?",
    answer:
      "Biasanya 30 detik sampai 2 menit, tergantung panjang materi. Untuk dokumen besar, bagian ringkasan muncul lebih dulu lalu menyusul kartu dan kuisnya.",
  },
  {
    question: "Apakah benar-benar gratis?",
    answer:
      "Ya, kamu bisa mencoba tanpa kartu kredit. Flashcard dan kuis bisa diulang tanpa batas, jadi kamu bisa menilai sendiri hasilnya sebelum memutuskan lanjut.",
  },
  {
    question: "Kenapa jawaban AI kadang perlu dicek lagi?",
    answer:
      "Karena AI bisa keliru. Untuk itu setiap jawaban selalu menampilkan sumbernya dari materimu, sehingga kamu bisa langsung membandingkan dengan dokumen aslinya.",
  },
  {
    question: "Boleh dipakai untuk mengerjakan tugas?",
    answer:
      "Pustaka AI membantu kamu memahami materi—bukan mengerjakan tugasmu. Pakai untuk belajar, lalu kerjakan tugasmu sendiri sesuai aturan sekolah atau kampusmu.",
  },
  {
    question: "Bisa dipakai di ponsel?",
    answer:
      "Bisa. Seluruh halaman, termasuk latihan flashcard dan kuis, berjalan penuh di browser ponsel tanpa perlu instalasi aplikasi.",
  },
] as const;

const testimonials = [
  {
    initials: "RW",
    name: "Rina Wulandari",
    level: "SMA kelas 12",
    quote: "Yang tadinya 2 jam baca jadi 20 menit. Kuisnya ngehokin banget pas H-1 ujian.",
  },
  {
    initials: "DP",
    name: "Dimas Pratama",
    level: "Mahasiswa",
    quote: "Chat-nya jawab pakai materi kuliahku sendiri, jadi nggak nyasar kayak search biasa.",
  },
  {
    initials: "NA",
    name: "Nadia Ayu",
    level: "SMK kelas 11",
    quote: "Flashcard-nya nongol lagi pas aku hampir lupa. Streak-ku tembus 30 hari.",
  },
  {
    initials: "BR",
    name: "Bagas Ramadhan",
    level: "SMA kelas 10",
    quote: "Dosen kasih PDF 80 halaman, besoknya udah ada ringkasan + kartu latihan.",
  },
  {
    initials: "SL",
    name: "Salsabila L.",
    level: "Mahasiswa kedokteran",
    quote: "Yang paling kepake: tiap jawaban nunjukin sumbernya. Bisa langsung dicek ke buku.",
  },
  {
    initials: "YK",
    name: "Yoga Kurniawan",
    level: "SMA kelas 12",
    quote: "Ulangan harian bikin saya belajar dikit-dikit tiap hari, bukan begadang semalam.",
  },
] as const;

const comparison = [
  { label: "Ringkasan siap pakai dalam hitungan detik", us: true, manual: false, generic: true },
  { label: "Flashcard dengan jadwal ulang otomatis", us: true, manual: false, generic: false },
  { label: "Kuis pilihan ganda beserta pembahasan", us: true, manual: false, generic: false },
  { label: "Jawaban hanya dari materimu, bukan internet", us: true, manual: true, generic: false },
  { label: "Setiap jawaban menunjukkan sumbernya", us: true, manual: true, generic: false },
] as const;

const faqItems = faqs.map((item) => ({ question: item.question, answer: item.answer }));

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* ── [2] Hero + demo interaktif ─────────────────────────── */}
        <section className="mx-auto max-w-6xl px-5 pt-14 pb-16 sm:px-8 lg:pt-20 lg:pb-24">
          <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <Badge variant="highlight" className="font-mono text-[11px] tracking-wide uppercase">
                Ringkasan · Flashcard · Kuis · Tanya
              </Badge>
              <h1 className="text-display mt-6 font-extrabold tracking-[-0.03em] text-balance">
                Ubah 6 jam belajar jadi <span className="hl">1 jam</span>
              </h1>
              <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-relaxed text-pretty">
                Upload materi apa saja. Dapat ringkasan, flashcard, dan kuis yang semuanya berpijak
                pada materimu sendiri—bukan jawaban karangan dari internet.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    Mulai gratis <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="#cara-kerja">Lihat cara kerjanya</Link>
                </Button>
              </div>
              <p className="text-muted-foreground mt-4 text-sm">
                Tanpa kartu kredit · Batalkan kapan saja
              </p>
            </div>

            <HeroDemo />
          </div>
        </section>

        {/* ── [3] Bar fakta produk (statis, tanpa animasi) ───────── */}
        <section className="border-line bg-card border-y" aria-label="Fakta produk">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-8 sm:px-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <p className="tabular font-mono text-2xl font-bold md:text-3xl">{stat.value}</p>
                <p className="text-muted-foreground mt-1 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── [4] Empati: dinding sticky-note ─────────────────────── */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <h2 className="text-h2 font-extrabold tracking-[-0.02em] text-balance">
            Kamu nggak sendirian
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {complaints.map((complaint, index) => (
              <blockquote
                key={complaint}
                className="sticky-note bg-highlight/70 text-ink p-5 text-base leading-relaxed font-semibold"
                style={{ transform: index % 2 === 0 ? "rotate(-1.5deg)" : "rotate(1.5deg)" }}
              >
                “{complaint}”
              </blockquote>
            ))}
          </div>
          <p className="text-muted-foreground mt-8 text-lg">
            Pustaka bantu kamu{" "}
            <span className="hl text-foreground font-semibold">mulai dari yang paling penting</span>
            .
          </p>
        </section>

        <div className="torn" aria-hidden="true" />

        {/* ── [5] Cara kerja: 3 langkah ───────────────────────────── */}
        <section
          id="cara-kerja"
          className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 lg:py-24"
        >
          <p className="font-mono text-xs font-semibold tracking-[0.16em] uppercase">Cara kerja</p>
          <h2 className="text-h2 mt-3 font-extrabold tracking-[-0.02em] text-balance">
            Tiga langkah, selesai sebelum kopi dingin
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <article
                className="border-ink bg-card shadow-2 relative rounded-md border-2 p-6"
                key={step.number}
              >
                <span
                  className="text-highlight font-mono text-4xl font-bold"
                  style={{ WebkitTextStroke: "1.5px var(--ink)" }}
                >
                  {step.number}
                </span>
                <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{step.text}</p>
                {index < steps.length - 1 ? (
                  <span
                    className="border-ink absolute top-1/2 -right-5 hidden h-0 w-5 border-t-2 border-dashed md:block"
                    aria-hidden="true"
                  />
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <div className="torn" aria-hidden="true" />

        {/* ── [6] Fitur (bento grid) ──────────────────────────────── */}
        <section id="fitur" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 lg:py-24">
          <p className="font-mono text-xs font-semibold tracking-[0.16em] uppercase">Fitur</p>
          <h2 className="text-h2 mt-3 font-extrabold tracking-[-0.02em] text-balance">
            Satu materi, empat cara belajar
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-12">
            <article className="border-ink bg-card lift shadow-2 rounded-md border-2 p-6 md:col-span-7">
              <span className="bg-highlight text-ink border-ink inline-flex size-10 items-center justify-center rounded-md border-2">
                <FileText className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-xl font-bold">Ringkasan otomatis</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Dokumen panjang dipadatkan jadi poin penting, dengan bagian kunci tetap ditandai
                stabilo supaya mata langsung tertuju ke intinya.
              </p>
              <div className="mt-5">
                <SummaryDemo />
              </div>
            </article>

            <article className="border-ink bg-card lift shadow-2 rounded-md border-2 p-6 md:col-span-5">
              <span className="bg-highlight text-ink border-ink inline-flex size-10 items-center justify-center rounded-md border-2">
                <MessageSquareText className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-xl font-bold">Tanya materi, bukan internet</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Asisten hanya menjawab dari materimu dan selalu menyebut sumbernya.
              </p>
              <div className="mt-5">
                <ChatDemo />
              </div>
            </article>

            <article className="border-ink bg-card lift shadow-2 rounded-md border-2 p-6 md:col-span-4">
              <span className="bg-highlight text-ink border-ink inline-flex size-10 items-center justify-center rounded-md border-2">
                <Layers className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-xl font-bold">Flashcard</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Satu fakta per kartu. Ingat dulu, baru dibalik.
              </p>
              <div className="mt-5">
                <FlipCardDemo />
              </div>
            </article>

            <article className="border-ink bg-card lift shadow-2 rounded-md border-2 p-6 md:col-span-4">
              <span className="bg-highlight text-ink border-ink inline-flex size-10 items-center justify-center rounded-md border-2">
                <Target className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-xl font-bold">Kuis interaktif</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Langsung tahu benar atau salah, lengkap dengan penjelasannya.
              </p>
              <div className="mt-5">
                <QuizDemo />
              </div>
            </article>

            <article className="border-ink bg-card lift shadow-2 rounded-md border-2 p-6 md:col-span-4">
              <span className="bg-highlight text-ink border-ink inline-flex size-10 items-center justify-center rounded-md border-2">
                <CalendarClock className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-xl font-bold">Jadwal ulang otomatis</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Kartu yang sulit muncul lebih cepat, yang sudah dikuasai muncul lebih lama.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {["1 hari", "3 hari", "7 hari", "21 hari", "60 hari"].map((interval) => (
                  <li key={interval}>
                    <Badge variant="mint" className="font-mono">
                      {interval}
                    </Badge>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
                Penilaian jujur saat menilai diri membuat jadwalnya akurat.
              </p>
            </article>

            <article className="border-ink bg-primary text-primary-foreground shadow-2 rounded-md border-2 p-6 md:col-span-12">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <span className="border-ink bg-highlight text-ink inline-flex size-10 items-center justify-center rounded-md border-2">
                    <BookOpenCheck className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-xl font-bold">Ulangan harian, lintas materi</h3>
                  <p className="mt-2 text-sm leading-relaxed opacity-90">
                    Semua kartu jatuh tempo dari seluruh materi dikumpulkan dalam satu antrean.
                    Sepuluh menit sehari mengalahkan dua jam semalam sebelum ujian.
                  </p>
                </div>
                <Button asChild variant="accent">
                  <Link href="/belajar">
                    Mulai ulangan <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </article>
          </div>
        </section>

        {/* ── [7] Format yang didukung ────────────────────────────── */}
        <section id="format" className="border-line bg-card scroll-mt-24 border-y">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
            <p className="font-mono text-xs font-semibold tracking-[0.16em] uppercase">Format</p>
            <h2 className="text-h2 mt-3 font-extrabold tracking-[-0.02em]">
              Apa saja yang bisa diunggah
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {formats.map((format) => (
                <div
                  className="border-ink bg-background shadow-2 rounded-md border-2 p-6"
                  key={format.title}
                >
                  <format.icon className="size-6" aria-hidden="true" />
                  <h3 className="mt-3 text-lg font-bold">{format.title}</h3>
                  <p className="mt-1 font-mono text-sm">{format.list}</p>
                  <p className="text-muted-foreground mt-3 text-sm">{format.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── [8] Perbandingan ────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <p className="font-mono text-xs font-semibold tracking-[0.16em] uppercase">
            Perbandingan
          </p>
          <h2 className="text-h2 mt-3 font-extrabold tracking-[-0.02em] text-balance">
            Bedanya dengan cara biasa
          </h2>

          <div className="border-ink shadow-2 mt-8 overflow-x-auto rounded-md border-2">
            <table className="w-full min-w-[42rem] border-collapse text-sm">
              <caption className="sr-only">
                Perbandingan Pustaka AI dengan belajar manual dan chat AI umum
              </caption>
              <thead>
                <tr className="bg-muted">
                  <th scope="col" className="border-line border-b-2 px-4 py-3 text-left font-bold">
                    Kemampuan
                  </th>
                  <th
                    scope="col"
                    className="border-line bg-highlight/40 border-b-2 border-l-2 px-4 py-3 text-center font-extrabold"
                  >
                    Pustaka AI
                  </th>
                  <th
                    scope="col"
                    className="border-line border-b-2 border-l-2 px-4 py-3 text-center font-bold"
                  >
                    Catatan manual
                  </th>
                  <th
                    scope="col"
                    className="border-line border-b-2 border-l-2 px-4 py-3 text-center font-bold"
                  >
                    Chat AI umum
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.label}>
                    <th
                      scope="row"
                      className="border-line border-t px-4 py-3 text-left font-medium"
                    >
                      {row.label}
                    </th>
                    <Cell value={row.us} highlight />
                    <Cell value={row.manual} />
                    <Cell value={row.generic} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground mt-3 text-xs">
            Ikon ✓ dan ✕ selalu disertai teks “Ada” atau “Tidak ada” untuk pembaca layar.
          </p>
        </section>

        <div className="torn" aria-hidden="true" />

        {/* ── [9] Testimoni (grid statis) ─────────────────────────── */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24" aria-label="Testimoni">
          <p className="font-mono text-xs font-semibold tracking-[0.16em] uppercase">Testimoni</p>
          <h2 className="text-h2 mt-3 font-extrabold tracking-[-0.02em]">
            Kata mereka yang sudah coba
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <figure
                key={item.name}
                className="sticky-note bg-surface p-5"
                style={{ transform: index % 2 === 0 ? "rotate(-1.5deg)" : "rotate(1.5deg)" }}
              >
                <blockquote className="text-sm leading-relaxed">“{item.quote}”</blockquote>
                <figcaption className="border-line mt-4 flex items-center gap-3 border-t pt-4">
                  <span className="border-ink bg-highlight text-ink rounded-pill inline-flex size-9 items-center justify-center border-2 font-mono text-xs font-bold">
                    {item.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-bold">{item.name}</span>
                    <span className="text-muted-foreground block text-xs">{item.level}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ── [11] Belajar dari ponsel ────────────────────────────── */}
        <section className="border-line bg-card border-y">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_auto] lg:py-20">
            <div>
              <p className="font-mono text-xs font-semibold tracking-[0.16em] uppercase">
                Di ponsel
              </p>
              <h2 className="text-h2 mt-3 font-extrabold tracking-[-0.02em] text-balance">
                Latih kartu di sela antre, kuis di perjalanan
              </h2>
              <p className="text-muted-foreground mt-4 max-w-xl leading-relaxed">
                Pustaka AI berjalan penuh di browser ponsel—tanpa instalasi, tanpa aplikasi
                tambahan. Streak dan jadwal ulang ikut tersimpan di akunmu.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/dashboard">
                    Coba di ponsel <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>

            <div
              className="border-ink bg-background shadow-3 mx-auto w-64 rounded-[2rem] border-2 p-3"
              aria-hidden="true"
            >
              <div className="bg-surface border-ink rounded-[1.4rem] border-2 px-4 py-6">
                <p className="text-muted-foreground text-center font-mono text-[10px]">
                  ULANGAN · 1 / 12
                </p>
                <div className="border-ink bg-background shadow-1 mt-3 rounded-md border-2 px-4 py-8 text-center">
                  <p className="text-sm font-bold">Apa fungsi ATP dalam sel?</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {["Belum hafal", "Hampir", "Hafal", "Sanggup"].map((grade, index) => (
                    <span
                      key={grade}
                      className={`rounded-pill border-ink border-2 px-2 py-1.5 text-center text-[11px] font-bold ${
                        index === 2 ? "bg-highlight text-ink" : "bg-background"
                      }`}
                    >
                      {grade}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── [12] FAQ ────────────────────────────────────────────── */}
        <section id="faq" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="font-mono text-xs font-semibold tracking-[0.16em] uppercase">FAQ</p>
              <h2 className="text-h2 mt-3 font-extrabold tracking-[-0.02em] text-balance">
                Pertanyaan yang sering muncul
              </h2>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                Belum ketemu? Kirim email ke{" "}
                <a className="text-brand font-semibold underline" href="mailto:halo@pustaka.ai">
                  halo@pustaka.ai
                </a>
                .
              </p>
            </div>
            <Accordion items={faqItems} />
          </div>
        </section>

        {/* ── [13] CTA penutup ────────────────────────────────────── */}
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-6xl px-5 py-16 text-center sm:px-8 lg:py-20">
            <Sparkles className="mx-auto size-8" aria-hidden="true" />
            <h2 className="text-h2 mx-auto mt-4 max-w-2xl font-extrabold tracking-[-0.02em] text-balance">
              Materi besok pagi, siap malam ini
            </h2>
            <p className="mx-auto mt-4 max-w-xl opacity-90">
              Unggah satu dokumen dan lihat sendiri ringkasan, kartu, serta kuisnya.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="accent" size="lg">
                <Link href="/dashboard">
                  Mulai gratis <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/sign-in">Sudah punya akun</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm opacity-80">Tanpa kartu kredit · Batalkan kapan saja</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Cell({ value, highlight = false }: { value: boolean; highlight?: boolean }) {
  return (
    <td
      className={`border-line border-t border-l px-4 py-3 text-center ${
        highlight ? "bg-highlight/20" : ""
      }`}
    >
      <span className="inline-flex items-center gap-1.5 font-semibold">
        <span aria-hidden="true">{value ? "✓" : "✕"}</span>
        {value ? "Ada" : "Tidak ada"}
      </span>
    </td>
  );
}
