# DESIGN.md — Redesain UI/UX untuk pelajarin.ai

> Dokumen ini berisi (1) hasil analisis UI/UX pelajarin.ai saat ini, dan (2) sistem desain baru yang **sengaja dibedakan** dari tampilan aslinya dan dibuat lebih kuat.
> Halaman yang dianalisis: beranda (`/`), harga (`/pricing`), institusi (`/institutional`). Jawaban FAQ berbentuk accordion tertutup dan tidak terbaca saat analisis, begitu juga aplikasi setelah login (`app.pelajarin.ai`). Bagian itu **tidak** dianalisis.

---

## 1. Analisis UI/UX Saat Ini

### 1.1 Identitas visual yang terdeteksi

| Aspek | Temuan |
|---|---|
| Warna brand | Oranye `#f76703` (theme-color & tile color) |
| Mode | Ada logo versi light & dark, artinya mendukung dark mode |
| Bahasa | ID/EN lewat switcher di navbar (🇮🇩 ID) |
| Navbar | Logo · Fitur · Harga · Blog · FAQ · bahasa · **Masuk** |
| Hero | Headline besar + subjudul + 1 CTA + video walkthrough (mp4) |
| Ritme halaman | Hero → logo kampus (marquee) → empati → fitur → statistik + testimoni (marquee) → format file → perbandingan → app mobile → FAQ → CTA akhir → footer |
| Trust signal | 16 logo kampus/sekolah, counter statistik, testimoni, rating, "Didukung oleh Dewaweb" |
| Fitur yang ditonjolkan | Ringkasan Otomatis, Tutor AI 24/7, Smart Flashcards, Kuis Interaktif |

### 1.2 Yang sudah bagus (pertahankan)

1. **Headline berbasis hasil**: "6 jam jadi 1 jam" langsung menjawab *what's in it for me*.
2. **Bagian empati** ("Kamu nggak sendirian") jarang dipakai kompetitor dan cocok untuk audiens yang cemas ujian.
3. **Pemakaian bahasa santai** ("kamu", "nggak", "ngerasa") dekat dengan pelajar.
4. **Demo mini di kartu fitur** (contoh chat Hukum Newton II) menunjukkan produk tanpa perlu membaca.
5. **Micro-reassurance di CTA akhir**: tidak perlu kartu kredit, batalkan kapan saja.
6. **Halaman institusi** punya alur 3 langkah, form yang jelas, dan janji waktu respon (1–2 hari kerja).

### 1.3 Temuan masalah UX

| # | Masalah | Dampak | Prioritas | Solusi di redesain |
|---|---|---|---|---|
| 1 | **Angka sosial tidak konsisten**: "1.000.000+ pelajar", "Ratusan Ribu Pelajar", "ribuan siswa cerdas" di satu halaman | Menurunkan kredibilitas | Tinggi | Satu sumber angka, dipakai di semua tempat |
| 2 | **Harga tidak konsisten**: meta description menyebut "mulai dari Rp 50.000/bulan", halaman menampilkan Pro Rp 30.000/bulan dan Rp 360.000/tahun, sementara toggle menawarkan diskon 6 bulan (-20%) dan tahunan (-50%). Harga per bulan yang berlaku untuk tiap toggle tidak jelas | Bingung, ragu bayar | Tinggi | Harga tiap periode selalu tampil eksplisit + label "hemat X%" + total tagihan |
| 3 | **Sapaan campur**: beranda pakai "kamu", halaman harga pakai "Anda" | Suara brand terasa tidak utuh | Sedang | Semua pakai "kamu" |
| 4 | **Bahasa campur**: "Smart Flashcards", "Plan", "Upgrade", "Free" berdampingan dengan istilah Indonesia | Inkonsisten | Sedang | Glosarium tetap (lihat `UX-COPY.md`) |
| 5 | **Fitur di testimoni tidak ada di daftar fitur**: pengguna menyebut *mind map* dan *latihan soal*, baris perbandingan menyebut *prediksi soal ujian*, tapi keduanya tidak dijelaskan di section fitur | Fitur unggulan tersembunyi | Tinggi | Bento grid fitur mencakup semua fitur nyata |
| 6 | **Tidak ada "Cara kerja"** di beranda (adanya justru di halaman institusi) | Pengunjung baru tidak paham alurnya | Tinggi | Section 3 langkah: Upload → Pilih hasil → Belajar |
| 7 | **Hero tanpa demo interaktif**: hanya video mp4 | Butuh memutar video dulu untuk paham | Sedang | Demo upload interaktif + video sebagai opsi kedua |
| 8 | **Counter animasi mulai dari "0+"** | Tanpa JS/saat lambat, tampil "0+ Pengguna Aktif" dan "0/5 Rating" | Sedang | Render nilai akhir di HTML, animasi hanya peningkat |
| 9 | **Marquee testimoni & logo** berjalan otomatis dan isinya diduplikasi | Susah dibaca, masalah aksesibilitas (gerakan) | Sedang | Testimoni statis di grid + carousel manual, hormati `prefers-reduced-motion` |
| 10 | **Pro dilabeli "Unlimited untuk profesional"**, padahal target utama pelajar; "Priority support tertinggi" janggal | Salah sasaran | Sedang | "Untuk yang belajar tiap hari" |
| 11 | **Fitur Free dan Pro tumpang tindih** ("Flashcards & Quiz unlimited" di keduanya), batas "terbatas" tidak diberi angka | Sulit menilai nilai upgrade | Tinggi | Tampilkan batas nyata (mis. "5 catatan/bulan") |
| 12 | **Baris "Aplikasi mobile" di tabel perbandingan**, padahal iOS masih "segera hadir" | Klaim terasa dilebih-lebihkan | Rendah | Ganti "Android sudah ada, iOS menyusul" |
| 13 | **FAQ "Apakah AI akan menggantikan pekerjaan saya?"** tidak relevan untuk pelajar | Membuang slot FAQ | Rendah | Ganti dengan pertanyaan nyata (data, batas gratis, bahasa) |
| 14 | **Navigasi tidak seragam antar halaman**: beranda (Fitur, Harga, Blog, FAQ), institusi (How It Works, Features, Pricing, FAQ) | Pengguna tersesat | Sedang | Satu navbar global |
| 15 | **Footer memuat dua entitas hukum + alamat panjang**; navigasi inti sedikit | Berat dan sepi fungsi | Rendah | Footer 3 kolom + blok legal ringkas |
| 16 | **CTA hanya satu kalimat** ("Mulai Gratis Sekarang") di mana-mana | Tidak menyesuaikan konteks | Rendah | CTA primer konsisten + CTA sekunder kontekstual |

---

## 2. Konsep Desain Baru: "Ruang Belajar Stabilo"

**Ide inti**: tampilan seperti meja belajar yang rapi. Kertas krem, tinta gelap, dan **stabilo kuning** yang menandai hal penting. Ini pas dengan produknya, yaitu menandai dan meringkas inti materi.

**Bedanya dari desain asli**

| | Asli | Redesain |
|---|---|---|
| Warna dominan | Oranye `#f76703` | Biru kobalt + kuning stabilo + mint, latar krem hangat |
| Kesan | Startup umum, bersih | Kertas + tinta, bercorak "catatan pelajar" |
| Bentuk kartu | Kemungkinan bayangan lembut | Border tinta 2px + bayangan keras (offset) |
| Aksen | — | Garis stabilo di bawah kata kunci, tepi kertas sobek |
| Hero | Video | Demo interaktif "seret file → hasil" |
| Testimoni | Marquee otomatis | Dinding sticky-note statis |

**Kepribadian**: hangat, jelas, sedikit iseng, tidak menggurui.

---

## 3. Design Tokens

### 3.1 Warna

| Token | Light | Dark | Dipakai untuk |
|---|---|---|---|
| `--ink` | `#14172B` | `#F2F3FA` | Teks utama, border |
| `--paper` | `#FBF9F4` | `#0E1020` | Latar halaman |
| `--surface` | `#FFFFFF` | `#171A30` | Kartu, modal |
| `--muted` | `#5F6480` | `#A3A8C7` | Teks sekunder |
| `--line` | `#E6E3DA` | `#2A2E4A` | Garis pemisah halus |
| `--brand` | `#3347F0` | `#7C8CFF` | CTA utama, link, fokus |
| `--brand-press` | `#2434C4` | `#9AA6FF` | Hover/pressed brand |
| `--mint` | `#1FB889` | `#3DDCA8` | Sukses, progres, "benar" |
| `--highlight` | `#FFD84D` | `#FFD84D` | Stabilo, badge "Populer" |
| `--danger` | `#D92D3A` | `#FF6B75` | Error, salah |
| `--warning` | `#B76E00` | `#F5B544` | Peringatan |

**Aturan kontras (WCAG AA)**
- `--brand` di atas putih ≈ 6,3:1 → aman untuk teks dan tombol.
- Teks di atas `--mint` dan `--highlight` **wajib memakai `--ink`**, bukan putih.
- Jangan pakai `--mint` sebagai warna teks kecil di latar putih.
- Jangan mengandalkan warna saja untuk benar/salah: selalu sertakan ikon + teks.

### 3.2 Tipografi

| Peran | Font | Fallback |
|---|---|---|
| Judul & UI | **Plus Jakarta Sans** (600/700/800) | `system-ui, sans-serif` |
| Isi | **Plus Jakarta Sans** (400/500) | `system-ui, sans-serif` |
| Angka & timer | **JetBrains Mono** (500) | `ui-monospace, monospace` |

| Skala | Ukuran (fluid) | Line-height | Bobot |
|---|---|---|---|
| Display | `clamp(2.5rem, 6vw, 4rem)` | 1.05 | 800 |
| H1 | `clamp(2rem, 4.5vw, 2.75rem)` | 1.1 | 800 |
| H2 | `clamp(1.5rem, 3vw, 2rem)` | 1.2 | 700 |
| H3 | 1.25rem | 1.3 | 700 |
| Body | 1rem (16px) | 1.65 | 400 |
| Small | 0.875rem | 1.5 | 500 |
| Caption | 0.75rem | 1.4 | 500 |

### 3.3 Spasi, radius, bayangan, motion

```css
:root {
  /* spasi: kelipatan 4 */
  --s-1: 4px;  --s-2: 8px;  --s-3: 12px; --s-4: 16px;
  --s-6: 24px; --s-8: 32px; --s-12: 48px; --s-16: 64px; --s-24: 96px;

  /* radius */
  --r-sm: 8px; --r-md: 14px; --r-lg: 22px; --r-pill: 999px;

  /* bayangan keras khas "stiker" */
  --shadow-1: 2px 2px 0 var(--ink);
  --shadow-2: 4px 4px 0 var(--ink);
  --shadow-3: 8px 8px 0 var(--ink);

  /* motion */
  --ease: cubic-bezier(.2, .8, .2, 1);
  --t-fast: 120ms; --t-base: 200ms; --t-slow: 360ms;

  /* warna (light) */
  --ink: #14172B;      --paper: #FBF9F4;   --surface: #FFFFFF;
  --muted: #5F6480;    --line: #E6E3DA;
  --brand: #3347F0;    --brand-press: #2434C4;
  --mint: #1FB889;     --highlight: #FFD84D;
  --danger: #D92D3A;   --warning: #B76E00;
}

:root[data-theme="dark"] {
  --ink: #F2F3FA;      --paper: #0E1020;   --surface: #171A30;
  --muted: #A3A8C7;    --line: #2A2E4A;
  --brand: #7C8CFF;    --brand-press: #9AA6FF;
  --mint: #3DDCA8;     --danger: #FF6B75;  --warning: #F5B544;
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition-duration: 0.01ms !important; }
}
```

### 3.4 Layout & breakpoint

| Breakpoint | Lebar | Kolom | Margin |
|---|---|---|---|
| Mobile | < 640px | 4 | 16px |
| Tablet | 640–1023px | 8 | 24px |
| Desktop | ≥ 1024px | 12 | 32px, max-width 1200px |

Desain **mobile-first**: mayoritas pelajar Indonesia membuka dari ponsel.

---

## 4. Elemen Signature

1. **Stabilo**: garis kuning di bawah kata kunci judul.
   ```css
   .hl { background: linear-gradient(transparent 58%, var(--highlight) 58% 92%, transparent 92%); padding: 0 .1em; }
   ```
2. **Kartu stiker**: `border: 2px solid var(--ink); border-radius: var(--r-md); box-shadow: var(--shadow-2)`. Saat hover: geser `translate(-2px,-2px)` dan bayangan naik ke `--shadow-3`.
3. **Tepi kertas sobek**: pembatas antar section (SVG mask, tinggi 16px).
4. **Sticky-note**: kartu testimoni dengan rotasi kecil (−1.5° / +1.5°), hanya di desktop.
5. **Ikon**: gaya garis 2px, sudut membulat (mis. Lucide). Satu gaya saja di seluruh situs.

---

## 5. Struktur Halaman Beranda (baru)

```
[1] Navbar
[2] Hero + demo interaktif
[3] Bar bukti sosial (angka + logo kampus, statis)
[4] Empati: "Kamu nggak sendirian"      (dinding sticky-note)
[5] Cara kerja: 3 langkah               (BARU di beranda)
[6] Fitur (bento grid)                  (memuat mind map & latihan soal)
[7] Format yang didukung
[8] Perbandingan dengan situs lain
[9] Testimoni                           (grid statis)
[10] Ringkasan harga + toggle periode   (BARU di beranda)
[11] Aplikasi mobile
[12] FAQ
[13] CTA penutup
[14] Footer
```

### 5.1 Navbar
- Kiri: logo. Tengah: `Fitur` · `Cara kerja` · `Harga` · `Blog` · `Institusi`. Kanan: pilih bahasa · tombol **Masuk** (sekunder) · **Mulai gratis** (primer).
- Sticky, latar `--paper` 90% + blur, border bawah `--line` muncul setelah scroll.
- Mobile: hamburger membuka sheet layar penuh; CTA primer tetap terlihat di bar atas.
- **Navbar identik di semua halaman**, termasuk `/institutional`.

### 5.2 Hero

```
┌──────────────────────────────────────────────────────────────┐
│  [badge] Dipakai 1 juta+ pelajar                             │
│                                                              │
│  Ubah 6 jam belajar                ┌─────────────────────┐   │
│  jadi ▓▓▓1 jam▓▓▓                  │  ⬆ Seret file ke sini │   │
│                                    │  PDF · MP3 · MP4 · YT │   │
│  Upload materi apa saja. Dapat     │  ─────  atau  ─────   │   │
│  ringkasan, flashcard, dan kuis    │  [ Tempel link YouTube ] │
│  dalam hitungan detik.             └─────────────────────┘   │
│                                       ↓ hasil muncul di sini │
│  [ Mulai gratis ]  [ ▶ Lihat 60 detik ]                      │
│  Tanpa kartu kredit · Batalkan kapan saja                    │
└──────────────────────────────────────────────────────────────┘
```
- Kolom kanan: kartu demo. Pengunjung menekan "Coba contoh materi", lalu 3 tab (Ringkasan / Flashcard / Kuis) terisi contoh nyata dengan animasi singkat.
- Video walkthrough pindah ke tombol sekunder (modal), tidak lagi jadi pusat perhatian.
- Mobile: kartu demo turun di bawah CTA.

### 5.3 Bar bukti sosial
- Empat angka statis (pengguna, catatan dibuat, rating, sekolah & kampus), dirender langsung dengan nilai akhir.
- Logo kampus dalam grid grayscale (tidak berjalan), maksimal 8 logo + "dan 100+ lainnya".

### 5.4 Empati
- Empat kalimat keluhan jadi sticky-note miring. Di bawahnya satu kalimat jawaban: "Pelajarin bantu kamu mulai dari yang paling penting."

### 5.5 Cara kerja
- Tiga kartu bernomor besar (`01 02 03`, JetBrains Mono): **Upload → Pilih hasil → Belajar & uji diri**.
- Garis putus-putus penghubung di desktop; vertikal di mobile.

### 5.6 Fitur (bento grid)

```
Desktop 12 kolom
┌───────────────────────┬───────────────┐
│ Ringkasan Otomatis    │ Tutor AI      │
│ (besar, 7 kol)        │ (5 kol, chat) │
├──────────┬────────────┼───────────────┤
│ Flashcard│ Kuis       │ Mind Map      │
│ (4 kol)  │ (4 kol)    │ (4 kol)       │
├──────────┴────────────┴───────────────┤
│ Latihan & prediksi soal ujian (12 kol)│
└───────────────────────────────────────┘
```
- Tiap kartu punya **mini-demo hidup**: kartu flashcard bisa dibalik, opsi kuis bisa ditekan, chat mengetik otomatis.
- Mobile: satu kolom, urutan sama.

### 5.7 Format yang didukung
- Empat ubin (Dokumen, Audio, Video, YouTube) dengan daftar ekstensi dan batas ukuran. Tautkan ke bantuan bila ada.

### 5.8 Perbandingan
- Tabel dengan ikon ✓ dan ✕ **plus teks alternatif** ("Ada" / "Tidak ada"), kolom Pelajarin disorot latar `--highlight` 20%.
- Mobile: tabel bisa digeser horizontal dengan kolom pertama tetap.

### 5.9 Testimoni
- Grid 3 kolom (desktop) / 1 kolom (mobile) berisi kartu sticky-note statis: foto/inisial, nama, jenjang (SMA/Kuliah), kutipan pendek. Tombol "Lihat lebih banyak" memuat sisanya.
- Tidak ada gerakan otomatis.

### 5.10 Ringkasan harga
- Toggle segmented `Bulanan | 6 Bulan | Tahunan`, tiap segmen menampilkan badge hemat.
- Tiga kartu: Gratis, Pro (ditandai stabilo "Paling populer"), Institusi.
- Harga per bulan dan total tagihan selalu terlihat berdampingan.

### 5.11 Aplikasi mobile
- Mockup ponsel + tombol Google Play. iOS berupa tombol nonaktif "Segera hadir" dengan pilihan "Kabari saya" (kolom email).

### 5.12 FAQ
- Accordion, satu terbuka pada satu waktu, pertanyaan utama sudah **terbuka** untuk item pertama.
- Tambahkan pencarian ringan bila lebih dari 8 item.

### 5.13 CTA penutup
- Blok penuh `--brand` dengan teks putih (kontras aman), tombol `--highlight` dengan teks `--ink`.

### 5.14 Footer
- Tiga kolom: Produk · Perusahaan · Legal. Ikon sosial di kiri bawah. Info entitas hukum dilipat jadi satu blok kecil.

---

## 6. Komponen

### 6.1 Tombol

| Varian | Latar | Teks | Border | Kapan |
|---|---|---|---|---|
| Primer | `--brand` | putih | 2px `--ink` | 1 per layar |
| Aksen | `--highlight` | `--ink` | 2px `--ink` | CTA di atas latar biru |
| Sekunder | `--surface` | `--ink` | 2px `--ink` | Aksi pendukung |
| Ghost | transparan | `--brand` | — | Aksi tersier |
| Bahaya | `--danger` | putih | 2px `--ink` | Hapus, batalkan langganan |

- Tinggi 48px (mobile 52px), padding horizontal 24px, radius `--r-pill`.
- State: hover geser −2px + bayangan naik; pressed geser +2px, bayangan hilang; disabled 45% opasitas; loading tampilkan spinner dan pertahankan lebar tombol.

### 6.2 Input & form
- Label selalu di atas kolom (bukan placeholder). Tinggi 48px, border 2px `--ink`, radius `--r-sm`.
- Fokus: ring 3px `--brand` 40% + border `--brand`.
- Error: border `--danger`, ikon, dan pesan di bawah kolom (jangan hanya warna).
- Validasi saat *blur*, bukan setiap ketikan.
- Form institusi dipecah menjadi 2 langkah (Data kamu → Kebutuhan institusi) dengan progres "1 dari 2".

### 6.3 Kartu
- Standar: latar `--surface`, border 2px, `--shadow-2`, padding 24px.
- Interaktif: transisi 200ms, fokus keyboard menampilkan ring `--brand`.

### 6.4 Badge & chip
- Populer: latar `--highlight`, teks `--ink`, huruf kapital kecil.
- Hemat: latar `--mint` 20%, teks `--ink`.
- Chip format file: pill dengan ikon, border 1.5px.

### 6.5 Toggle periode langganan
- Segmented control, tinggi 44px, segmen aktif berlatar `--ink` dengan teks `--paper`.
- Perubahan periode menganimasikan angka harga (200ms) dan **mengumumkannya lewat `aria-live="polite"`**.

### 6.6 Flashcard
- Rasio 3:2, balik 3D 360ms (mati bila `prefers-reduced-motion`; ganti dengan fade).
- Kontrol: `Belum hafal` · `Hampir` · `Hafal` (sesuai Spaced Repetition). Pintasan keyboard: `Space` balik, `1/2/3` menilai.

### 6.7 Kuis
- Opsi berupa kartu besar dengan huruf A–D. Setelah dijawab: benar = `--mint` + ✓ + "Benar!"; salah = `--danger` + ✕ + penjelasan singkat.
- Progres di atas: "Soal 3 dari 10" dan bar tipis.

### 6.8 Chat Tutor AI
- Gelembung pengguna `--brand` (teks putih), gelembung AI `--surface` dengan border.
- Chip saran di bawah: "Jelaskan lebih sederhana", "Beri contoh", "Buat kuis dari ini".
- Indikator mengetik tiga titik; tombol "Hentikan" saat menghasilkan jawaban.

### 6.9 Dropzone unggah
- Garis putus-putus 2px, ikon besar, teks utama + daftar format + batas ukuran.
- State: idle · drag-over (latar `--highlight` 25%) · uploading (bar progres + nama file) · sukses · error (lihat `UX-COPY.md`).

### 6.10 Loading proses catatan
- Bukan spinner kosong: tampilkan tahap berurutan ("Membaca materi → Menyusun ringkasan → Membuat flashcard → Menyiapkan kuis") dengan estimasi waktu.
- Pengguna boleh menutup halaman; notifikasi muncul saat selesai.

### 6.11 Toast & dialog
- Toast bawah-tengah, 4 detik, bisa ditutup, `role="status"`.
- Dialog konfirmasi: judul menyebut aksinya, tombol berlabel aksi (bukan OK/Batal).

### 6.12 Empty state
- Ilustrasi garis sederhana + satu kalimat + satu tombol. Setiap daftar kosong punya empty state sendiri.

---

## 7. Aksesibilitas

- Target WCAG 2.2 AA.
- Semua elemen interaktif bisa dijangkau keyboard, urutan fokus logis, fokus **selalu terlihat**.
- Tautan "Lewati ke konten utama" di paling awal.
- Ukuran target sentuh minimal 44×44px.
- Gambar bermakna punya `alt`; dekoratif memakai `alt=""`.
- Animasi hormati `prefers-reduced-motion`; tidak ada konten yang bergerak otomatis lebih dari 5 detik tanpa tombol jeda.
- Angka statistik dirender sebagai teks di HTML, bukan hanya hasil animasi JS.
- Ikon ✓/✕ di tabel perbandingan punya teks untuk pembaca layar.
- Dark mode mengikuti sistem, dengan pilihan manual.

---

## 8. Performa & SEO

- Font: `font-display: swap`, subset Latin, preload 2 bobot utama.
- Video hero dimuat malas (lazy) setelah interaksi; sediakan poster.
- Gambar WebP/AVIF, dimensi ditentukan untuk mencegah layout shift (CLS < 0,1).
- LCP target < 2,5 dtk di jaringan 4G.
- Pertahankan meta yang sudah baik (title, description, OG, Twitter, `id_ID`) dan **selaraskan angka harga di meta dengan halaman harga**.
- Tambahkan JSON-LD `Organization`, `FAQPage`, dan `Product/Offer` untuk halaman harga.

---

## 9. Ringkasan Perubahan Utama

1. Identitas baru: kobalt + stabilo + krem, bukan oranye.
2. Hero berisi demo yang bisa dicoba.
3. Ada bagian "Cara kerja" dan ringkasan harga di beranda.
4. Semua fitur nyata (termasuk mind map dan prediksi soal) tampil.
5. Angka dan harga konsisten di semua halaman.
6. Satu navbar, satu sapaan ("kamu"), satu istilah untuk satu hal.
7. Testimoni dan logo statis, tidak bergerak otomatis.
8. Aksesibilitas dan performa jadi syarat, bukan tambahan.