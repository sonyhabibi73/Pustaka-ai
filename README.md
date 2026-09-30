# Pustaka.ai

Workspace belajar berbasis dokumen: unggah PDF/TXT/DOCX atau tautan YouTube, lalu pelajari isinya lewat ringkasan yang berpaku pada sumber, flashcard spaced repetition, kuis interaktif, dan chat RAG yang hanya menjawab dari dokumenmu sendiri.

Situs publiknya (beranda, blog, halaman auth) dan workspace (`/dashboard`) berbagi satu identitas visual: **Ruang Belajar Stabilo** — kertas, tinta, dan stabilo kuning untuk menandai hal penting. Detailnya ada di [`Desain.md`](Desain.md); alur produk dan penjelasan tiap fitur ada di [`penjelasan.md`](penjelasan.md).

> **Status**: pengembangan aktif. Menu **Koleksi** dan **Simulasi Ujian** masih berlabel _Segera_.

## Fitur

| Area                       | Isi                                                                                                      |
| -------------------------- | -------------------------------------------------------------------------------------------------------- |
| Materi                     | Unggah file (PDF/TXT/DOCX, maks 10 MB) atau URL YouTube; ekstraksi teks + chunking dengan tumpang tindih |
| Ringkasan                  | Dihasilkan AI dengan berpaku pada kutipan sumber, lengkap dengan penanda bagian asli                     |
| Flashcard                  | Spaced repetition ala SM-2, jadwal jatuh tempo, penilaian 4 tingkat (Belum hafal → Hafal)                |
| Ulangan (`/belajar`)       | Antrean kartu jatuh tempo, disaring per materi, batas kartu per sesi bisa diatur                         |
| Kuis                       | Dihasilkan dari dokumen, skor & riwayat percobaan tersimpan                                              |
| Chat Tanya                 | RAG dengan ambang ambang jawaban tetap + jawaban cadangan berbahasa Indonesia                            |
| Statistik (`/statistik`)   | Streak, akurasi kuis, kartu 30 hari terakhir, sebaran nilai                                              |
| Pengaturan (`/pengaturan`) | Profil, tampilan (terang/gelap/ikut sistem), preferensi belajar, sesi aktif, ekspor data JSON            |
| Blog (`/blog`)             | Artikel belajar yang menempel pada fitur nyata aplikasi                                                  |

## Stack

Next.js 16 (App Router) · TypeScript strict · React 19 · Tailwind CSS v4 + shadcn/ui · Prisma 7 (Neon Postgres + pgvector) · NextAuth v5 (Auth.js, sesi di basis data, login Google) · Vercel AI SDK (Gemini untuk generasi & embedding, OpenAI cadangan) · Supabase Storage (berkas materi) · Upstash (rate limit) · Zod.

## Menjalankan secara lokal

Prasyarat: **Node ≥ 22** dan **pnpm ≥ 10** (`corepack enable`).

```bash
pnpm install
```

1. **Buat `.env.local` sendiri** dengan menyalin isi variabel dari [`.env.example`](.env.example) lalu isi nilainya masing-masing:

   | Variabel                                                 | Untuk apa                                             |
   | -------------------------------------------------------- | ----------------------------------------------------- |
   | `DATABASE_URL` / `DATABASE_URL_UNPOOLED`                 | Koneksi Neon Postgres (pooler & langsung)             |
   | `AUTH_SECRET`                                            | Kunci enkripsi sesi Auth.js — buat nilai acak panjang |
   | `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`                  | OAuth Google untuk masuk                              |
   | `GOOGLE_GENERATIVE_AI_API_KEY`                           | Ringkasan, flashcard, kuis, chat, embedding           |
   | `OPENAI_API_KEY`                                         | Pilihan model cadangan                                |
   | `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Bucket privat `study-materials` untuk berkas materi   |
   | `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`    | Rate limit per pengguna                               |

   > ⚠️ **Rahasia tidak boleh masuk Git.** `.env`, `.env.local`, dan turunannya sudah ada di `.gitignore`; hanya `.env.example` (berisi placeholder) yang di-commit. Jangan pernah menempelkan API key, kunci database, atau token ke berkas mana pun yang ikut ter-commit.

2. Migrasi basis data & generate client Prisma:

   ```bash
   pnpm db:generate
   pnpm db:deploy
   ```

   `prisma.config.ts` memuat `.env.local` sendiri — Prisma 7 tidak lagi membacanya otomatis.

3. Jalankan:

   ```bash
   pnpm dev
   ```

   Aplikasi tersedia di `http://localhost:3000`.

## Perintah

| Perintah                                       | Fungsi                                                               |
| ---------------------------------------------- | -------------------------------------------------------------------- |
| `pnpm dev`                                     | Server pengembangan (Turbopack)                                      |
| `pnpm build` / `pnpm start`                    | Build produksi / jalankan hasil build                                |
| `pnpm format` / `pnpm format:write`            | Cek / tulis format Prettier                                          |
| `pnpm lint`                                    | ESLint, nol peringatan                                               |
| `pnpm typecheck`                               | TypeScript tanpa kompilasi                                           |
| `pnpm test`                                    | Unit test (Vitest)                                                   |
| `pnpm test:e2e`                                | Playwright (`npx playwright install chromium` sekali saja)           |
| `pnpm test:all`                                | Semua gerbang mutu berurutan: format → lint → typecheck → test → e2e |
| `pnpm db:generate` / `db:deploy` / `db:studio` | Prisma client / migrasi / studio                                     |

## Struktur proyek

```
src/
├── app/
│   ├── page.tsx            # beranda publik
│   ├── blog/               # indeks & artikel
│   ├── (auth)/sign-in      # halaman masuk
│   ├── (app)/              # workspace: dashboard, documents, belajar,
│   │                       #   statistik, pengaturan, quizzes
│   └── api/                # auth, documents, flashcards, quizzes, export
├── components/             # ui, layout, marketing, documents, chat, account
├── lib/                    # ai, db, security, study, documents, blog, utils
└── generated/prisma/       # client Prisma (di-gitignore)
tests/
├── unit/                   # Vitest
└── e2e/                    # Playwright
```

## Pengujian & gerbang mutu

```bash
pnpm test:all
```

Suite unit melindungi bagian yang tidak boleh regresi:

| Suite               | Yang diverifikasi                                                                       |
| ------------------- | --------------------------------------------------------------------------------------- |
| `chunk`             | Tumpang tindih chunk tanpa kehilangan teks sumber                                       |
| `extract`           | Ekstraksi PDF/DOCX nyata; UTF-8 tidak valid & MIME asing gagal                          |
| `validation`        | Batas 10 MB, daftar MIME, sniffing tanda tangan, aturan URL YouTube                     |
| `vector-store`      | SQL pgvector terikat parameter, `LIMIT` dijepit, embedding cacat ditolak                |
| `ai-grounding`      | Jawaban berpaku pada konteks dokumen + kalimat cadangan tetap; sanitasi Markdown        |
| `security`          | Pemetaan galat tidak membocorkan detail internal; rate limit gagal tertutup di produksi |
| `spaced-repetition` | Penjadwalan gaya SM-2                                                                   |
| `preferences`       | Preferensi belajar selalu lolos validasi walau cookie korup                             |
| `stats`             | Perhitungan statistik belajar (streak, akurasi, sebaran nilai)                          |

E2E memverifikasi beranda & halaman masuk di viewport desktop dan seluler tanpa error konsol.

## Keamanan & privasi

- `.env*` diabaikan Git; hanya placeholder di `.env.example`.
- Sesi Auth.js tersimpan di basis data, login lewat Google, `AUTH_DEBUG` mati secara bawaan (tidak pernah mencetak `clientSecret`).
- Validasi MIME & tanda tangan berkas di server, batas 10 MB, pemeriksaan kepemilikan di setiap rute dokumen.
- Zod untuk input, Prisma untuk kueri, pgvector terikat parameter, sanitasi Markdown (HTML mentah dimatikan).
- Rate limit per pengguna lewat Upstash (wajib di produksi).
- Preferensi tampilan & belajar disimpan di **cookie perangkat**, bukan tabel, sehingga tidak butuh migrasi skema.
- Tidak ada animasi/marquee otomatis pada bukti sosial & testimoni; sasaran aksesibilitas **WCAG 2.2 AA**.

## Desain

- Identitas **Ruang Belajar Stabilo**: border tinta 2px, radius kecil, bayangan keras, aksen stabilo kuning — aturannya di [`Desain.md`](Desain.md).
- **Tema bawaan gelap**; pengguna bisa memilih Terang / Gelap / Ikut sistem di Pengaturan → Tampilan (tersimpan di `localStorage`).
- Sapaan selalu **"kamu"** di seluruh copy.
