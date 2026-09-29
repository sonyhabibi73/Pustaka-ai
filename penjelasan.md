# Panduan Lengkap pelajarin.ai

> Penjelasan menyeluruh tentang website **pelajarin.ai**: fitur, alur pemakaian, cara kerja AI di balik ringkasan/flashcard/kuis, sampai cara membuat sistem serupa sendiri.
> Disusun 30 September 2026 dari halaman publik: beranda, harga, institusi, dan **Pusat Bantuan** (`support.pelajarin.ai`).

---

## 0. Cara Membaca Dokumen Ini (penting)

Dokumen ini memakai dua jenis informasi. Saya pisahkan supaya kamu tahu mana fakta dan mana penjelasan umum.

| Label | Artinya | Contoh |
|---|---|---|
| ✅ **[Resmi]** | Tertulis di website atau Pusat Bantuan pelajarin.ai | "Proses 30 detik–2 menit" |
| 🧠 **[Umum]** | Cara kerja AI secara umum di industri. **Bukan** dokumentasi internal pelajarin.ai | Cara chunking, contoh prompt |
| ⚠️ **[Catatan]** | Hal yang belum jelas, tidak konsisten, atau tidak dipublikasikan | Angka batas gratis |

**Yang tidak dipublikasikan pelajarin.ai** (jadi tidak bisa saya pastikan): prompt yang dipakai, model AI spesifik untuk tiap fitur, algoritma spaced repetition yang tepat, cara sistem memvalidasi soal kuis, dan angka batas paket Gratis. Bagian 5 dan 6 menjelaskan cara *kerja yang lazim*, bukan salinan sistem mereka.

---

## Daftar Isi

1. [Apa itu pelajarin.ai](#1-apa-itu-pelajarinai)
2. [Peta fitur sekilas](#2-peta-fitur-sekilas)
3. [Alur pemakaian dari awal sampai akhir](#3-alur-pemakaian-dari-awal-sampai-akhir)
4. [Penjelasan detail tiap fitur](#4-penjelasan-detail-tiap-fitur)
5. [Bagaimana AI-nya bekerja](#5-bagaimana-ainya-bekerja)
6. [Cara membuat AI yang bisa seperti itu](#6-cara-membuat-ai-yang-bisa-seperti-itu)
7. [Paket, harga, dan pembayaran](#7-paket-harga-dan-pembayaran)
8. [Data dan privasi](#8-data-dan-privasi)
9. [Halaman Institusi](#9-halaman-institusi)
10. [FAQ](#10-faq)
11. [Keterbatasan dan ketidakkonsistenan](#11-keterbatasan-dan-ketidakkonsistenan)
12. [Info perusahaan dan kontak](#12-info-perusahaan-dan-kontak)
13. [Sumber](#13-sumber)

---

## 1. Apa itu pelajarin.ai

✅ **[Resmi]** pelajarin.ai adalah **platform belajar berbasis AI untuk pelajar dan mahasiswa Indonesia**. Kamu mengunggah materi (dokumen, audio, video, atau link YouTube), lalu AI mengubahnya menjadi:

- **Ringkasan** materi
- **Flashcard** untuk menghafal
- **Kuis** pilihan ganda
- **Tutor AI** (chat) yang sudah "membaca" materimu

Slogan di beranda: **"Ubah 6 Jam Belajar Jadi 1 Jam"**.

| Hal | Info |
|---|---|
| Bahasa utama | Bahasa Indonesia (default) |
| Platform | Web, aplikasi Android (Google Play). iOS "segera hadir" |
| Biaya | Ada paket Gratis (dengan batas), Pro berbayar, dan Institusi |
| Perusahaan | CV Triputra Consulting (Jakarta) dan Dewaventures Pty Ltd (Singapura) |
| Sasaran | Siswa, mahasiswa, dan institusi pendidikan/perusahaan |

**Konsep paling penting: "Catatan" (note).**
✅ Satu catatan = satu materi belajar yang otomatis dijadikan ringkasan, flashcard, dan kuis. Semua fitur lain berputar di sekitar catatan. (Di tampilan baru, catatan disebut **lesson**.)

---

## 2. Peta Fitur Sekilas

| # | Fitur | Fungsi singkat | Paket |
|---|---|---|---|
| 1 | **Upload materi** | Dokumen, gambar, audio, video, YouTube | Gratis (terbatas) / Pro |
| 2 | **Ringkasan otomatis** | Materi panjang jadi poin penting | Gratis (jumlah catatan terbatas) |
| 3 | **Bab (chapter)** | Catatan dipecah jadi bab yang dipelajari satu per satu | Gratis: bab 1 saja / Pro: semua |
| 4 | **Tutor AI 24/7** | Chat tanya-jawab berdasarkan materimu | Gratis terbatas / Pro tanpa batas |
| 5 | **Flashcard + spaced repetition** | Kartu hafalan dengan jadwal ulang otomatis | Tanpa batas di kedua paket |
| 6 | **Kuis interaktif** | Soal pilihan ganda dari materimu | Tanpa batas di kedua paket |
| 7 | **Prediksi soal ujian** | Latihan soal yang "mungkin keluar" (bagian *Exams*) | Ada batas per paket |
| 8 | **Mind map** | Peta konsep dari materi | Lihat catatan di 4.8 |
| 9 | **Streak, XP, Level** | Gamifikasi kebiasaan belajar | Semua |
| 10 | **Leaderboard** | Peringkat berdasarkan XP | Semua |
| 11 | **Subjek / Folder** | Mengelompokkan catatan | Semua |
| 12 | **Multi-bahasa** | Indonesia, Inggris, Arab, Mandarin | Semua |
| 13 | **Aplikasi mobile** | Semua fitur utama di ponsel | Android |
| 14 | **Institusi** | Dasbor analitik, integrasi LMS/SSO, dukungan khusus | Custom |

---

## 3. Alur Pemakaian dari Awal sampai Akhir

### 3.1 Gambaran besar

```
 Daftar / Masuk
      │
      ▼
 Dashboard  ──►  Buat catatan baru
                      │
        pilih jenis materi + upload
        (dokumen / gambar / audio / video / YouTube)
                      │
              pilih Subjek/Course (wajib)
              pilih bahasa hasil
                      │
                      ▼
          AI memproses (30 dtk – 2 mnt)
                      │
                      ▼
   ┌───────────────────────────────────────────┐
   │  Catatan siap:                            │
   │  Ringkasan · Bab · Flashcard · Kuis ·     │
   │  Tutor AI · (Mind map)                    │
   └───────────────────────────────────────────┘
                      │
                      ▼
   Belajar: baca → tanya Tutor → flashcard → kuis
                      │
                      ▼
   Dapat XP, jaga streak, naik level, naik leaderboard
                      │
                      ▼
   Batas Gratis tercapai? → Upgrade ke Pro (opsional)
```

### 3.2 Langkah demi langkah

**Langkah 1 — Buat akun / masuk**
✅ Daftar gratis kurang dari satu menit. Login memakai email atau **Google/Discord** (foto profil diambil dari sana). Tombol **Masuk** ada di navbar (mengarah ke `app.pelajarin.ai`). Tidak perlu kartu kredit.

**Langkah 2 — Buka Dashboard dan mulai catatan baru**

| Perangkat | Cara membuat catatan |
|---|---|
| Komputer | Klik **New Note** di kanan atas Dashboard |
| Browser ponsel | Tekan tombol **+ bulat oranye** di kanan bawah (tanpa teks) |
| Aplikasi Android | Tab **Home**, tombol **+** bulat di kanan menu bawah |
| Belum punya catatan | Tombol **Create First Note** |
| Tampilan baru | Kotak **"What do you want to learn today?"** di Home, pilih **Unggah**, **YouTube**, atau **Rekam** |

**Langkah 3 — Pilih jenis materi dan upload**
✅ Bisa satu catatan dari **maksimal 5 file** sekaligus. Batas ukuran ada di tabel 4.1.

**Langkah 4 — Pilih Subjek/Course (wajib)**
✅ Kalau subjek belum ada, ketik namanya lalu pilih **Create "nama"**.

**Langkah 5 — Proses**
✅ Klik **Create Note** (di Android: **Process**). Tunggu **30 detik sampai 2 menit** tergantung ukuran dan kerumitan materi.

**Langkah 6 — Buka catatan**
✅ Kamu akan menemukan ringkasan, flashcard, kuis, dan chat Tutor AI.

**Langkah 7 — Belajar**
Urutan yang disarankan Pusat Bantuan:
1. Baca ringkasan.
2. Tanya Tutor AI untuk hal yang belum paham.
3. Latihan flashcard.
4. Kerjakan kuis, kalau salah, tanya Tutor AI, lalu ulangi kuis.

**Langkah 8 — Bangun kebiasaan**
✅ Aktivitas belajar (review flashcard, kuis, buat catatan) menjaga **streak** dan memberi **XP**.

### 3.3 Alur khusus: Prediksi Soal Ujian

```
 Buka bagian Exams
      │
 Upload kertas ujian (PDF / gambar)
      │   Gratis: maks 3 kertas, 10 MB / kertas
      │   Pro   : maks 6 kertas, 50 MB / kertas
      ▼
 AI menghasilkan soal prediksi
      ▼
 Kerjakan TANPA melihat catatan
      ▼
 Yang salah → baca ringkasan / tanya Tutor AI
      ▼
 Ulangi 1–2 hari sebelum ujian
```

### 3.4 Alur khusus: YouTube

1. Salin link video.
2. Dashboard → **Create New Note** → pilih **YouTube**.
3. Tempel link, konfirmasi.
4. AI membaca isi ucapan video lalu membuat ringkasan, flashcard, dan kuis.

✅ Syarat: video **publik** (atau tidak publik dengan link langsung). Video privat tidak bisa dibaca. Video dengan suara jelas memberi hasil terbaik; video penuh musik atau tanpa suara kurang cocok.

### 3.5 Alur memasukkan catatan ke Subjek/Folder

✅ Halaman Subjek **tidak punya tombol "tambah catatan"**. Cara memasukkannya:

| Situasi | Cara |
|---|---|
| Catatan baru | Pilih subjek saat membuat catatan |
| Catatan lama (web) | Buka catatan → ikon folder di samping judul → **Change Subject** → **Save** |
| Catatan lama (Android) | Buka catatan → tombol **⋯** → **Change Subject** → pilih → **Save** |
| Buat subjek tanpa catatan (web) | Menu samping **Subjects** → **Add** |
| Buat subjek tanpa catatan (Android) | Tab **Subjects** → **+** |
| Tampilan baru | Subjek disebut **Folder**. Kartu lesson → **⋮** → **Move to folder** → **Save** |

---

## 4. Penjelasan Detail Tiap Fitur

### 4.1 Upload materi dan format file

✅ **[Resmi]**

| Jenis | Format | Ukuran maks |
|---|---|---|
| Dokumen | PDF, DOCX, DOC, PPTX, PPT, XLSX, XLS | 100 MB |
| Teks | TXT, MD | 100 MB |
| Gambar | JPG, PNG, WEBP, HEIC | 25 MB |
| Audio | MP3, WAV, M4A, OGG, WEBA | 300 MB |
| Video | MP4, MOV, WEBM, AVI, MKV | 500 MB |
| YouTube | Link video publik | Tanpa batas ukuran |

**Catatan per jenis**
- **Dokumen**: pilihan paling umum. PDF hasil scan bisa diproses, tapi teks digital yang bersih memberi ringkasan terbaik.
- **Gambar**: foto papan tulis atau halaman buku bisa langsung diunggah, tidak perlu diubah ke PDF.
- **Audio**: rekaman kuliah **ditranskripsi dulu**, lalu catatan dibuat dari transkripnya.
- **Video**: sama dengan audio; isi ucapan ditranskripsi lalu diringkas.

**Kalau upload gagal**
1. Cek ukuran file terhadap tabel di atas. File yang melebihi batas ditolak sebelum diproses.
2. Cek formatnya ada di tabel. Format yang tidak terdaftar ditolak walau kecil.
3. File besar (terutama audio/video) memakan waktu lebih lama karena harus ditranskripsi.
4. Kalau ukuran dan format sudah benar tapi tetap gagal, hubungi dukungan dengan menyebut jenis file, ukuran, dan tangkapan layar error.

**Tips resmi untuk hasil bagus**
- Upload materi yang jelas dan lengkap. Satu bab utuh lebih baik daripada satu halaman potongan.
- Pecah buku besar per bab agar tiap catatan fokus.
- Kelompokkan catatan per Subjek.

### 4.2 Bahasa

✅ **[Resmi]** Hasil bisa dibuat dalam **empat bahasa**: **Bahasa Indonesia** (default), **English**, **Arabic (العربية)**, dan **Mandarin (中文)**. Bahasa diatur **per catatan**, jadi satu akun bisa punya catatan dalam bahasa berbeda.

- Materi tidak harus berbahasa sama. Materi diterjemahkan saat catatan dibangun. Contoh: buku teks berbahasa Arab bisa menghasilkan catatan berbahasa Indonesia; rekaman berbahasa Indonesia bisa menghasilkan catatan berbahasa Inggris.
- Bahasa lain di luar empat itu akan dihasilkan dalam Bahasa Indonesia.
- Untuk audio/video, **bahasa transkripsi adalah pengaturan terpisah** dari bahasa hasil.

| Bagian | Mengikuti pengaturan bahasa? |
|---|---|
| Catatan dan bab | Ya |
| Flashcard | Ya |
| Kuis | Ya |
| Prediksi soal ujian | Ya |
| Tutor AI | Ya (menjawab dalam bahasa terpilih) |
| Mind map | **Belum**; mengikuti bahasa materi |

### 4.3 Ringkasan otomatis

✅ Mengubah dokumen ratusan halaman menjadi poin penting yang mudah dipahami "dalam hitungan detik" (klaim beranda). Waktu nyata resminya 30 detik sampai 2 menit.

**Faktor yang memengaruhi kecepatan**
- **Panjang**: PDF 300 halaman atau rekaman kuliah 2 jam lebih lama daripada handout 10 halaman.
- **Jenis**: audio, video, dan YouTube ditranskripsi dulu sehingga lebih lama daripada dokumen teks.
- **Beban**: saat jam ramai (misalnya malam musim ujian) bisa sedikit lebih lambat.

**Kalau catatan terasa macet**
1. Tunggu beberapa menit, terutama untuk file audio/video besar.
2. Muat ulang halaman; mungkin sudah selesai di latar belakang.
3. Kalau lebih dari sekitar 10 menit belum selesai, hapus catatan dan upload ulang.
4. Masih bermasalah, hubungi dukungan dengan jenis dan ukuran file.

### 4.4 Bab (chapter) di tampilan baru

✅ Di tampilan baru, tab **Learn** memecah catatan menjadi **bab** yang dipelajari satu per satu.

| Paket saat catatan dibuat | Bab yang terbuka |
|---|---|
| Gratis | **Hanya bab pertama**. Bab berikutnya terkunci (ikon gembok) |
| Pro | Semua bab |

⚠️ Kalau kamu di paket Gratis dan membuka bab terkunci, layar hanya menampilkan **"This chapter has no content yet."** Itu berarti bab **terkunci**, bukan gagal dibuat. Catatan yang dibuat sebelum upgrade ke Pro bisa tetap terkunci; hubungi dukungan.

### 4.5 Tutor AI 24/7

✅ Chat yang **sudah membaca materimu**. Tutor menjawab berdasarkan **materi yang kamu upload**, jadi penjelasannya relevan dengan yang diberikan gurumu.

**Cara pakai**: buka catatan → panel chat → tanya. Contoh dari Pusat Bantuan:
- "Jelaskan Hukum Newton II dengan bahasa sederhana."
- "Kenapa rumus ini dipakai di sini?"
- "Beri contoh soal untuk bab ini."

**Tips resmi**
- Tanyakan **satu pertanyaan fokus** sekali waktu, jangan "jelaskan semuanya".
- Pakai pertanyaan lanjutan: "jelaskan lebih sederhana", "beri contoh lain".
- Kalau konsep tersebar di beberapa catatan, tanya di catatan tempat konsep itu berada.

**Batas**: paket Gratis = chat AI terbatas; Pro = tanpa batas.
**Sikap resmi**: Tutor untuk **membantu memahami**, bukan mengerjakan tugasmu.

### 4.6 Flashcard dan Spaced Repetition

✅ Setiap catatan menghasilkan **flashcard pintar** dari materimu. Jadwal ulang memakai **spaced repetition**: kartu yang sulit muncul lebih cepat, yang sudah dikuasai muncul lebih lama.

**Cara belajar**
1. Buka catatan, pindah ke tampilan flashcard.
2. Baca sisi depan, **ingat jawabannya dulu sebelum membalik**.
3. Balik kartu, lalu **nilai seberapa kamu tahu**.
4. Lanjut. Sistem yang menentukan kapan kartu itu kembali.

**Kenapa efektif** (penjelasan resmi): mencicil terasa kurang "produktif" dibanding begadang, tapi review yang dijadwalkan tepat sebelum kamu lupa memindahkan istilah ke memori jangka panjang dengan lebih sedikit total pengulangan. Sepuluh menit sehari mengalahkan belajar dua jam semalam sebelum ujian.

**Tips resmi**
- Review tiap hari, ini juga menjaga streak.
- Pakai aplikasi mobile di waktu senggang.
- **Jujur saat menilai diri**, karena jadwal hanya bekerja kalau penilaiannya nyata.

**Batas**: flashcard **tanpa batas** di Gratis maupun Pro.

### 4.7 Kuis interaktif

✅ Setiap catatan punya kuis **pilihan ganda** yang dibuat dari materimu.

**Cara pakai**
1. Buka catatan → bagian kuis.
2. Jawab tiap soal.
3. Dapat **umpan balik langsung**, benar atau salah, dengan jawaban yang benar ditampilkan.
4. Lihat skor di akhir. Boleh diulang sebanyak yang kamu mau.

**Kapan mengerjakan kuis**
- **Langsung setelah belajar** untuk mengunci ingatan.
- **Beberapa hari kemudian** untuk mencari yang sudah terlupa.
- **Sebelum ujian** sebagai cek terakhir bagian lemah.

**Kalau salah**: minta Tutor AI menjelaskan konsep di balik soal itu, lalu ulangi kuis.
**Batas**: kuis **tanpa batas** di Gratis maupun Pro.

### 4.8 Mind map

⚠️ Mind map disebut di testimoni pengguna dan di daftar bahasa (Pusat Bantuan menulis mind map "belum" mengikuti pengaturan bahasa), jadi fiturnya ada. Tetapi **tidak ada artikel bantuan khusus** dan tidak dijelaskan di beranda. Detail cara memakainya belum terdokumentasi di sumber publik yang saya baca.

### 4.9 Prediksi soal ujian (Exams)

✅ Selain kuis biasa, pelajarin.ai bisa **memprediksi soal yang mungkin keluar**. AI menghasilkan jenis soal yang lazim muncul untuk topik itu: definisi yang layak ditanyakan, rumus yang layak diterapkan, konsep yang layak dibandingkan.

**Aturan upload khusus Exams** (berbeda dari catatan biasa):

| | Gratis | Pro |
|---|---|---|
| Format | **PDF dan gambar saja** (JPG, PNG, WEBP, HEIC) | sama |
| Ukuran per kertas | 10 MB | 50 MB |
| Kertas per ujian | 3 | 6 |

Word, PowerPoint, Excel, audio, dan video **tidak bisa** diunggah ke Exams. Ubah dulu ke PDF, atau jadikan catatan biasa.

**Pesan error yang mungkin muncul**
| Pesan | Artinya |
|---|---|
| `Maksimal 6 berkas per ujian.` | Batas jumlah kertas tercapai |
| `Unsupported paper type` | Format bukan PDF atau gambar |
| `Paper exceeds the size limit` | Ukuran melebihi batas paketmu |

**Jujur soal ekspektasi** (kata pelajarin.ai sendiri): prediksi berarti **mungkin**, bukan **pasti**. Tidak ada alat yang tahu ujian gurumu. Anggap sebagai latihan bernilai tinggi, bukan kunci jawaban bocor.

### 4.10 Streak, XP, dan Level

✅ **[Resmi]**

| Elemen | Cara kerja |
|---|---|
| **Streak** | Menghitung hari belajar berturut-turut. Aktivitas nyata (review flashcard, kuis, buat catatan) membuat hari itu dihitung. **Bolos sehari, streak kembali ke nol** |
| **XP** | Didapat dari membuat catatan, menyelesaikan review flashcard, menyelesaikan kuis. Usaha lebih besar, XP lebih banyak |
| **Level** | Akumulasi XP; ukuran jangka panjang seberapa banyak kamu belajar. **Level tidak pernah turun** |

Streak bisa dilihat di **Dashboard** atau halaman **Streaks**.

### 4.11 Leaderboard

✅ Papan peringkat berdasarkan **XP**. Buka dari sidebar.
- Peringkat dari XP hasil belajar (catatan, flashcard, kuis).
- Menghargai **konsistensi**, bukan satu kali begadang.
- Tips: hadir tiap hari, selesaikan review flashcard, dan kerjakan kuis setelah tiap catatan.
- Kalau peringkat bikin stres, abaikan dan pakai streak saja sebagai satu-satunya ukuran.

### 4.12 Tampilan Baru vs Classic

✅ Ada dua tampilan yang bisa ditukar kapan saja.

- **Ke tampilan baru**: buka `app.pelajarin.ai` → menu (ponsel: tekan **Open menu** dulu) → gulir ke bawah → **Try the new look**.
- **Kembali ke Classic**: tombol **Classic** di bagian atas layar (di ponsel berupa ikon tanpa label).
- Pilihan tersimpan **per browser**, bukan per akun. Ganti browser atau perangkat, tampilan kembali ke Classic.

| Classic | Tampilan baru |
|---|---|
| Note (catatan) | **Lesson** |
| Subject (subjek) | **Folder** |
| Buat catatan lewat tombol New Note | Kotak "What do you want to learn today?" |
| — | Tab **Learn** dengan bab |

⚠️ Tombol **Unggah**, **YouTube**, dan **Rekam** di tampilan baru selalu berlabel bahasa Indonesia meski aplikasi diatur bahasa Inggris.

### 4.13 Aplikasi Mobile

✅
- **Android**: tersedia di Google Play. Masuk dengan akun yang sama, catatan, streak, dan XP sinkron otomatis.
- **iOS**: **segera hadir**. Sementara itu pengguna iPhone/iPad memakai versi browser, yang nyaman di layar ponsel.
- Di mobile kamu bisa: upload dokumen/audio/video/YouTube, baca ringkasan, chat Tutor AI, review flashcard, kerjakan kuis, dan menjaga streak.

⚠️ **Catatan**: deskripsi aplikasi di Google Play menyebut fitur tambahan seperti **"Snap & Solve"** (foto PR lalu AI memberi penjelasan langkah demi langkah) dan dukungan banyak bahasa. Fitur Snap & Solve **tidak muncul** di beranda maupun Pusat Bantuan yang saya baca, jadi statusnya di versi web belum bisa saya pastikan.

---

## 5. Bagaimana AI-nya Bekerja

### 5.1 Yang dipastikan oleh pelajarin.ai

✅ **[Resmi]**
1. Konten belajar diproses oleh **penyedia AI pihak ketiga: OpenRouter dan Google Gemini**, **tanpa informasi pribadi** yang menyertainya.
2. **Audio dan video ditranskripsi dulu**, baru catatan dibuat dari transkrip.
3. Materi bisa **diterjemahkan** saat catatan dibangun (bahasa materi ≠ bahasa hasil).
4. Satu catatan menghasilkan **ringkasan, flashcard, kuis**, dan **Tutor AI** yang menjawab **berdasarkan materimu**.
5. Prosesnya memakan **30 detik–2 menit**.
6. Catatan dipecah menjadi **bab** (tampilan baru).
7. Flashcard dijadwalkan ulang dengan **spaced repetition**.
8. Soal Exams dibuat dari materi/kertas ujian yang kamu unggah.

### 5.2 Pipeline umum (🧠 [Umum])

Berikut gambaran yang lazim dipakai aplikasi sejenis. **Ini bukan bocoran arsitektur pelajarin.ai**, tapi kerangka yang cocok dengan perilaku yang mereka jelaskan.

```
 INPUT                EKSTRAKSI                 PEMBERSIHAN
 ─────                ─────────                 ───────────
 PDF/DOCX/PPTX  ──►  parser teks          ┐
 Gambar/scan    ──►  OCR / model visi     │
 Audio          ──►  speech-to-text       ├──►  rapikan teks ──► deteksi struktur
 Video          ──►  ambil audio → STT    │     (buang header,    (judul, bab,
 YouTube        ──►  ambil transkrip      ┘      nomor halaman)   subbab)

                                    │
                                    ▼
                          PEMECAHAN (chunking)
                    bagi jadi potongan ± 500–1.500 kata
                    menurut bab/subbab agar tidak putus makna
                                    │
                                    ▼
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
   RINGKASAN                   FLASHCARD                     KUIS
   per bab, lalu               ekstrak istilah,              buat soal + 4 opsi
   digabung                    definisi, rumus               + kunci + penjelasan
        │                           │                           │
        └───────────────┬───────────┴───────────────────────────┘
                        ▼
                VALIDASI OTOMATIS
     (format JSON benar? kunci jawaban masuk akal? duplikat?)
                        ▼
                     SIMPAN
                        ▼
      Tampil di catatan  +  indeks untuk Tutor AI (pencarian potongan)
```

### 5.3 Dari mana kemampuan "membuat ringkasan, flashcard, kuis" itu?

🧠 **[Umum]** AI-nya tidak punya "otak khusus pelajaran". Kemampuannya berasal dari tiga hal:

1. **Model bahasa besar (LLM)**, seperti Gemini. Model ini sudah dilatih dengan teks sangat banyak, termasuk contoh ringkasan, soal ujian, dan penjelasan materi. Jadi model sudah "tahu bentuk" ringkasan yang baik, soal pilihan ganda yang baik, dan sebagainya.
2. **Instruksi (prompt)** yang menjelaskan tugas: peran, format hasil, aturan kualitas. Di sinilah pengembang "mengarahkan" model.
3. **Materi milikmu** yang disisipkan ke dalam prompt, sehingga jawaban berdasarkan sumber dan bukan karangan.

Jadi rumusnya:

```
 Hasil bagus  =  Model yang mampu  +  Prompt yang tepat  +  Materi sumber yang bersih
                                        + Validasi setelahnya
```

### 5.4 Ringkasan: cara kerjanya

🧠 **[Umum]**

- **Abstraktif**: model menulis ulang inti materi dengan kalimatnya sendiri (bukan sekadar menyalin kalimat).
- **Materi panjang tidak muat sekaligus** (atau kualitasnya turun). Solusi umum: **map-reduce**. Ringkas tiap bab, lalu ringkas kumpulan ringkasan itu menjadi gambaran besar.
- Prompt yang baik menentukan: siapa pembacanya (pelajar), tingkat detail, format (poin-poin, judul bab), dan larangan (jangan menambah fakta di luar materi).
- Hasilnya biasanya berupa struktur: judul → poin utama → istilah penting → rumus/contoh.

### 5.5 Flashcard: cara kerjanya

🧠 **[Umum]**

1. Model mencari **hal yang layak dihafal**: istilah, definisi, rumus, tanggal, nama tokoh, urutan proses.
2. Tiap kartu dibuat **atomik**: satu fakta per kartu. Kartu yang memuat tiga fakta sulit dinilai "hafal atau belum".
3. Bentuk kartu yang lazim:

| Tipe | Depan | Belakang |
|---|---|---|
| Istilah–definisi | Fotosintesis | Proses tumbuhan mengubah cahaya menjadi energi kimia |
| Tanya–jawab | Apa bunyi Hukum Newton II? | Percepatan berbanding lurus dengan gaya, berbanding terbalik dengan massa |
| Cloze (isian) | Rumus gaya: F = ___ × a | m |

4. Setelah kartu jadi, **spaced repetition** mengatur kapan kartu muncul lagi.

**Spaced repetition secara umum** (🧠 [Umum]; pelajarin.ai tidak menyebut algoritma yang tepat). Dua keluarga algoritma yang populer:
- **Leitner**: kartu pindah antar "kotak" 1→5. Jawab benar naik kotak (jeda makin lama), salah kembali ke kotak 1.
- **SM-2** (dasar Anki): tiap kartu punya *interval* dan *ease factor*. Nilai tinggi memperpanjang interval, nilai rendah mengulang dari awal.

Kode SM-2 versi sederhana ada di bagian 6.6.

### 5.6 Kuis: cara kerjanya

🧠 **[Umum]** Soal pilihan ganda yang baik punya beberapa bagian:

| Bagian | Fungsi |
|---|---|
| **Pertanyaan (stem)** | Jelas, satu pokok masalah |
| **Kunci jawaban** | Satu jawaban paling benar, harus bisa dibuktikan dari materi |
| **Pengecoh (distraktor)** | 3 opsi salah tapi masuk akal (kesalahan umum, konsep mirip) |
| **Penjelasan** | Kenapa jawaban itu benar |
| **Tingkat kesulitan** | Mudah/sedang/sulit, mengukur ingatan atau penerapan |

Cara AI membuatnya: model membaca potongan materi, memilih fakta yang layak diuji, lalu menulis soal, kunci, pengecoh, dan penjelasan **dalam format terstruktur (JSON)** agar aplikasi bisa menampilkannya sebagai kuis interaktif dan menilainya otomatis.

**Tantangan terbesar**: model bisa membuat pengecoh yang ternyata juga benar, atau kunci yang salah. Aplikasi sejenis biasanya menambah langkah validasi (bagian 6.5).

### 5.7 Tutor AI: cara kerjanya

🧠 **[Umum]** Pelajarin.ai menyatakan tutor menjawab berdasarkan materimu. Pola yang umum untuk itu disebut **RAG (Retrieval-Augmented Generation)**:

```
 Pertanyaan kamu
      │
      ▼
 Cari potongan materi yang paling relevan (pencarian semantik)
      │
      ▼
 Susun prompt:  [aturan tutor] + [potongan materi] + [riwayat chat] + [pertanyaan]
      │
      ▼
 LLM menjawab dengan bahasa sederhana, berpegang pada materi
      │
      ▼
 Jawaban tampil (bisa disertai contoh, analogi)
```

Untuk materi pendek, seluruh isi materi bisa langsung dimasukkan ke prompt tanpa pencarian.

### 5.8 Prediksi soal: cara kerjanya

🧠 **[Umum]** Pelajarin.ai menjelaskan AI melihat materimu lalu membuat jenis soal yang lazim muncul di ujian topik itu. Karena fitur Exams menerima **kertas ujian (PDF/gambar)**, kemungkinan besar kertas itu dipakai sebagai **contoh pola soal** (gaya, tingkat kesulitan, tipe pertanyaan). Ini inferensi saya, bukan pernyataan resmi.

"Prediksi" di sini artinya AI **menebak bagian yang paling mungkin diuji berdasarkan pola dan bobot topik**, bukan mengetahui ujian sebenarnya. Pelajarin.ai sendiri menegaskan hal ini.

### 5.9 Kenapa AI bisa salah (dan cara mengurangi risikonya sebagai pengguna)

🧠 **[Umum]** LLM bisa **berhalusinasi**, yaitu menulis hal yang terdengar meyakinkan tapi tidak ada di sumber. Untuk pengguna:
- Cek hal penting ke buku atau guru.
- Upload materi yang bersih; input berantakan menghasilkan output berantakan.
- Satu catatan = satu topik fokus.
- Jika kuis atau flashcard terasa janggal, bandingkan dengan sumbernya.

---

## 6. Cara Membuat AI yang Bisa Seperti Itu

> 🧠 Bagian ini **tutorial umum** untuk membangun sistem serupa dari nol (mis. proyek sekolah atau portofolio). Bukan salinan sistem pelajarin.ai.

### 6.1 Komponen yang dibutuhkan

| Komponen | Pilihan umum |
|---|---|
| Model bahasa (LLM) | API Gemini, Claude, GPT, atau model lewat OpenRouter |
| Ekstraksi dokumen | Library parser PDF/DOCX/PPTX; OCR untuk scan |
| Transkripsi audio | Layanan speech-to-text (mis. Whisper atau API sejenis) |
| Transkrip YouTube | Ambil subtitle/transkrip video |
| Penyimpanan | Database (catatan, kartu, soal) + penyimpanan file |
| Antrean kerja | Queue/job agar proses panjang berjalan di latar belakang |
| Pencarian semantik (untuk Tutor) | Embedding + database vektor (atau pencarian biasa untuk materi pendek) |
| Front-end | Halaman upload, tampilan ringkasan, flashcard, kuis, chat |

### 6.2 Urutan membangun (peta jalan)

1. **Upload → ekstrak teks** dari satu jenis file dulu (PDF).
2. **Ringkasan** dengan satu prompt sederhana.
3. **Flashcard** dengan output JSON.
4. **Kuis** dengan output JSON + validasi.
5. **Tutor AI** (mulai dari memasukkan seluruh materi ke prompt, baru optimalkan dengan RAG).
6. **Spaced repetition** untuk jadwal kartu.
7. **Format lain**: audio, video, YouTube, gambar.
8. **Gamifikasi**: XP, streak, leaderboard.
9. **Batas paket** dan pembayaran.

Bangun satu fitur sampai berfungsi dulu sebelum melompat ke berikutnya.

### 6.3 Prompt yang bisa langsung dicoba

Ganti `{{MATERI}}` dengan teks materimu.

**a) Prompt ringkasan**

```text
Kamu adalah asisten belajar untuk pelajar Indonesia.
Tugas: ringkas materi di bawah ini.

Aturan:
1. Gunakan HANYA informasi dari materi. Jangan menambah fakta dari luar.
2. Tulis dalam Bahasa Indonesia yang sederhana dan jelas.
3. Format:
   - "Gambaran singkat": 2-3 kalimat
   - "Poin penting": 5-10 poin
   - "Istilah kunci": daftar istilah + arti singkat
   - "Rumus / contoh": jika ada di materi
4. Jika ada bagian yang tidak jelas di materi, tulis "tidak jelas di materi" (jangan menebak).

MATERI:
"""
{{MATERI}}
"""
```

**b) Prompt flashcard (output JSON)**

```text
Kamu membuat flashcard untuk pelajar. Dari materi di bawah, buat flashcard.

Aturan:
1. Satu kartu = satu fakta (atomik). Jangan gabungkan beberapa fakta.
2. Bagian depan berupa istilah atau pertanyaan singkat; belakang berupa jawaban singkat (maks. 25 kata).
3. Hanya gunakan isi materi. Jangan mengarang.
4. Hindari kartu duplikat atau yang jawabannya sudah terlihat di pertanyaan.
5. Buat maksimal {{JUMLAH}} kartu, pilih yang paling penting.
6. Balas HANYA dengan JSON valid, tanpa teks lain.

Format:
{
  "flashcards": [
    {"front": "...", "back": "...", "type": "term|qa|cloze"}
  ]
}

MATERI:
"""
{{MATERI}}
"""
```

**c) Prompt kuis (output JSON)**

```text
Kamu adalah pembuat soal ujian pilihan ganda. Buat {{JUMLAH}} soal dari materi berikut.

Aturan soal:
1. Tiap soal punya 4 opsi (A-D) dan TEPAT SATU jawaban benar.
2. Pengecoh harus masuk akal (kesalahan umum atau konsep yang mirip), bukan asal-asalan.
3. Jangan pakai "semua benar" atau "semua salah".
4. Panjang keempat opsi harus seimbang; jawaban benar jangan selalu yang terpanjang.
5. Acak posisi jawaban benar.
6. Campur tingkat kesulitan: sekitar 40% mudah (ingatan), 40% sedang (pemahaman), 20% sulit (penerapan).
7. Semua soal harus bisa dijawab dari materi. Sertakan kutipan pendek dari materi sebagai bukti.
8. Beri penjelasan singkat kenapa jawaban benar itu benar.
9. Balas HANYA dengan JSON valid.

Format:
{
  "questions": [
    {
      "question": "...",
      "options": {"A": "...", "B": "...", "C": "...", "D": "..."},
      "answer": "B",
      "explanation": "...",
      "evidence": "kutipan pendek dari materi",
      "difficulty": "easy|medium|hard"
    }
  ]
}

MATERI:
"""
{{MATERI}}
"""
```

**d) Prompt Tutor AI (berbasis materi)**

```text
Kamu adalah tutor yang sabar untuk pelajar Indonesia.

Aturan:
1. Jawab berdasarkan MATERI di bawah. Jika jawabannya tidak ada di materi, katakan terus terang
   ("Hal ini tidak dibahas di materimu") lalu boleh beri penjelasan umum dengan label jelas.
2. Jelaskan dengan bahasa sederhana, beri analogi atau contoh bila membantu.
3. Untuk soal hitungan, tunjukkan langkah-langkahnya.
4. Bantu siswa MEMAHAMI: tanyakan balik sesekali untuk mengecek pemahaman.
5. Jangan mengerjakan tugas menggantikan siswa; ajak siswa mencoba langkah berikutnya.

MATERI:
"""
{{POTONGAN_MATERI_RELEVAN}}
"""

RIWAYAT CHAT:
{{RIWAYAT}}

PERTANYAAN:
{{PERTANYAAN}}
```

**e) Prompt prediksi soal ujian**

```text
Kamu adalah guru berpengalaman yang menyusun soal ujian.

Diberikan:
- MATERI pelajaran
- CONTOH SOAL UJIAN TERDAHULU (untuk melihat gaya dan tingkat kesulitan)

Tugas: buat {{JUMLAH}} soal yang PALING MUNGKIN muncul, dengan:
1. Gaya dan tingkat kesulitan mirip contoh.
2. Bobot topik proporsional (topik yang sering muncul di contoh lebih banyak).
3. Campuran: definisi, penerapan rumus, perbandingan konsep.
4. Sertakan kunci jawaban dan topik yang diuji.
Tandai ini sebagai prediksi, bukan jaminan.
```

### 6.4 Contoh kode: pipeline lengkap (Python, kerangka)

Kode di bawah adalah **kerangka** supaya kamu paham alurnya. `call_llm(...)` bisa kamu ganti dengan API model pilihanmu; logikanya bisa dipindah ke bahasa lain (PHP, JavaScript, dst.).

```python
import json
import textwrap

# ---------- 1. EKSTRAKSI ----------
def extract_text(file_path: str, file_type: str) -> str:
    """Ambil teks mentah dari file sesuai jenisnya."""
    if file_type == "pdf":
        return extract_pdf_text(file_path)          # library parser PDF
    if file_type in ("docx", "pptx", "xlsx"):
        return extract_office_text(file_path)
    if file_type in ("mp3", "wav", "mp4", "mov"):
        return speech_to_text(file_path)            # transkripsi dulu
    if file_type in ("jpg", "png", "webp"):
        return ocr_image(file_path)
    if file_type == "youtube":
        return fetch_youtube_transcript(file_path)  # file_path = URL
    raise ValueError("Format tidak didukung")

# ---------- 2. PEMBERSIHAN & CHUNKING ----------
def clean_text(text: str) -> str:
    lines = [ln.strip() for ln in text.splitlines()]
    lines = [ln for ln in lines if ln and not ln.isdigit()]  # buang nomor halaman
    return "\n".join(lines)

def chunk_text(text: str, max_words: int = 1200, overlap: int = 100):
    """Pecah teks jadi potongan; overlap agar makna tidak putus."""
    words = text.split()
    chunks, start = [], 0
    while start < len(words):
        end = min(start + max_words, len(words))
        chunks.append(" ".join(words[start:end]))
        if end == len(words):
            break
        start = end - overlap
    return chunks

# ---------- 3. PANGGIL LLM ----------
def call_llm(prompt: str) -> str:
    """Ganti dengan pemanggilan API model pilihanmu."""
    raise NotImplementedError

def call_llm_json(prompt: str, retries: int = 2) -> dict:
    """Minta JSON; coba lagi kalau formatnya rusak."""
    for _ in range(retries + 1):
        raw = call_llm(prompt).strip()
        raw = raw.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            prompt += "\n\nPERBAIKI: balasan tadi bukan JSON valid. Balas hanya JSON."
    raise RuntimeError("Gagal mendapat JSON valid")

# ---------- 4. RINGKASAN (map-reduce) ----------
def summarize(chunks, language="Bahasa Indonesia"):
    partials = [call_llm(SUMMARY_PROMPT.replace("{{MATERI}}", c)) for c in chunks]
    if len(partials) == 1:
        return partials[0]
    merged = "\n\n".join(partials)
    return call_llm(MERGE_SUMMARY_PROMPT.replace("{{RINGKASAN}}", merged))

# ---------- 5. FLASHCARD & KUIS ----------
def make_flashcards(chunk, n=10):
    data = call_llm_json(FLASHCARD_PROMPT.replace("{{MATERI}}", chunk)
                                         .replace("{{JUMLAH}}", str(n)))
    return dedupe_cards(data["flashcards"])

def make_quiz(chunk, n=5):
    data = call_llm_json(QUIZ_PROMPT.replace("{{MATERI}}", chunk)
                                    .replace("{{JUMLAH}}", str(n)))
    return [q for q in data["questions"] if validate_question(q, chunk)]

# ---------- 6. ORKESTRASI ----------
def build_note(files, language="Bahasa Indonesia"):
    text = "\n\n".join(clean_text(extract_text(p, t)) for p, t in files)
    chunks = chunk_text(text)
    return {
        "summary":    summarize(chunks, language),
        "flashcards": [c for ch in chunks for c in make_flashcards(ch)],
        "quiz":       [q for ch in chunks for q in make_quiz(ch)],
    }
```

**Catatan penting untuk aplikasi nyata**
- Jalankan `build_note` di **antrean latar belakang**; jangan menahan permintaan web selama proses.
- Beri pengguna **indikator progres** (membaca → meringkas → membuat kartu → menyiapkan kuis).
- Simpan hasil per bagian agar kalau satu langkah gagal, tidak perlu mengulang semuanya.
- Panggil model untuk beberapa potongan **secara paralel** supaya cepat.

### 6.5 Validasi kualitas (kunci agar AI "terasa pintar")

Tanpa validasi, kuis dari AI sering bermasalah. Lapisan pengaman yang umum:

| Cek | Cara |
|---|---|
| **JSON valid** | Parse; ulang bila gagal |
| **Struktur soal** | Tepat 4 opsi, kunci ada di opsi, tidak ada opsi kosong |
| **Bukti ada di materi** | Cek apakah `evidence` benar-benar muncul (atau mirip) di potongan materi |
| **Tidak duplikat** | Bandingkan pertanyaan/kartu yang mirip (kesamaan teks atau embedding) |
| **Panjang wajar** | Depan/belakang kartu tidak terlalu panjang |
| **Kunci tidak bias** | Sebaran A/B/C/D seimbang; jawaban benar bukan selalu yang terpanjang |
| **Pemeriksa kedua** | Panggil model lagi: "Jawab soal ini hanya dari materi. Apakah cocok dengan kunci?" Jika beda, buang atau tandai soal |
| **Keamanan konten** | Tolak materi/hasil yang tidak pantas |

Contoh `validate_question`:

```python
def validate_question(q: dict, source: str) -> bool:
    opts = q.get("options", {})
    if set(opts.keys()) != {"A", "B", "C", "D"}:
        return False
    if q.get("answer") not in opts:
        return False
    if len({v.strip().lower() for v in opts.values()}) < 4:   # opsi kembar
        return False
    evidence = q.get("evidence", "").strip().lower()
    if evidence and evidence[:40] not in source.lower():      # bukti harus ada di materi
        return False
    return True
```

### 6.6 Spaced repetition sederhana (SM-2)

```python
from datetime import date, timedelta

def review_card(card: dict, quality: int) -> dict:
    """
    quality: 0-5  (0-2 = lupa, 3 = susah, 4 = baik, 5 = mudah)
    card: {"interval": hari, "repetitions": int, "ease": float, "due": date}
    """
    if quality < 3:                       # lupa → mulai lagi
        card["repetitions"] = 0
        card["interval"] = 1
    else:
        if card["repetitions"] == 0:
            card["interval"] = 1
        elif card["repetitions"] == 1:
            card["interval"] = 6
        else:
            card["interval"] = round(card["interval"] * card["ease"])
        card["repetitions"] += 1

    # sesuaikan tingkat kemudahan
    card["ease"] = max(1.3, card["ease"] + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    card["due"] = date.today() + timedelta(days=card["interval"])
    return card

# kartu baru
kartu = {"interval": 0, "repetitions": 0, "ease": 2.5, "due": date.today()}
```

**Pemetaan tombol penilaian**

| Tombol di UI | quality |
|---|---|
| Belum hafal | 1 |
| Hampir | 3 |
| Hafal | 5 |

### 6.7 Skema data minimal

```text
users        (id, nama, email, xp, level, streak_hari, streak_terakhir)
subjects     (id, user_id, nama)
notes        (id, user_id, subject_id, judul, bahasa, status, ringkasan, dibuat)
note_files   (id, note_id, jenis, path, ukuran)
chapters     (id, note_id, urutan, judul, isi, terkunci)
flashcards   (id, note_id, depan, belakang, tipe, interval, ease, repetisi, jatuh_tempo)
quizzes      (id, note_id, pertanyaan, opsi_json, kunci, penjelasan, tingkat)
quiz_attempts(id, user_id, quiz_id, jawaban, benar, waktu)
chat_messages(id, note_id, peran, isi, waktu)
xp_events    (id, user_id, aktivitas, xp, waktu)
subscriptions(id, user_id, paket, mulai, berakhir, metode)
```

### 6.8 Rumus gamifikasi sederhana (contoh, bukan rumus pelajarin.ai)

| Aktivitas | XP contoh |
|---|---|
| Buat catatan | +20 |
| Selesai review flashcard | +2 per kartu |
| Selesai kuis | +10 (+ bonus skor) |
| Streak harian | Naik 1 tiap hari ada aktivitas; reset ke 0 bila bolos |

Level contoh: `level = floor(sqrt(total_xp / 50)) + 1`. Level hanya naik mengikuti total XP, tidak pernah turun.

### 6.9 Tips supaya hasil AI "terasa seperti pelajarin.ai"

1. **Bersihkan input dulu**: garbage in, garbage out.
2. **Bagi per bab** sebelum memproses; jangan lempar buku 300 halaman sekaligus.
3. **Minta JSON ketat**, lalu validasi.
4. **Larang mengarang**: "hanya dari materi", wajibkan bukti kutipan.
5. **Satu tugas per prompt** (ringkasan, kartu, kuis terpisah) lebih andal daripada satu prompt raksasa.
6. **Sesuaikan level pembaca** ("untuk siswa SMK kelas 11") di prompt.
7. **Tangani bahasa**: atur bahasa hasil di prompt, dan pisahkan bahasa transkripsi.
8. **Ukur kualitas**: kumpulkan umpan balik (jempol atas/bawah pada kartu/soal) dan buang pola yang sering dinilai buruk.
9. **Batasi biaya**: cache hasil, potong materi berulang, pilih model lebih murah untuk tugas ringan.
10. **Transparan**: beri catatan bahwa AI bisa keliru, ajak pengguna mengecek hal penting.

---

## 7. Paket, Harga, dan Pembayaran

### 7.1 Paket

✅ **[Resmi]**

| | **Gratis** | **Pro** | **Institusi** |
|---|---|---|---|
| Harga | Gratis, tanpa kartu kredit | Berbayar (lihat halaman Harga) | Custom |
| Catatan | Terbatas | Tanpa batas | Tanpa batas |
| Flashcard & Kuis | Tanpa batas | Tanpa batas | Tanpa batas |
| Chat AI (Tutor) | Terbatas | Tanpa batas | Tanpa batas |
| Proses video & audio | Terbatas | Tanpa batas | Tanpa batas |
| Bab pada catatan baru | **Bab 1 saja** | Semua bab | Semua |
| Kertas ujian (Exams) | 3 per ujian, 10 MB/kertas | 6 per ujian, 50 MB/kertas | — |
| Dukungan | Dasar | Prioritas tertinggi | Khusus (dedicated) |
| Ekstra | — | — | Integrasi, analitik & laporan, jumlah pelajar custom |

⚠️ Angka batas "terbatas" di paket Gratis (mis. berapa catatan per bulan) **tidak dipublikasikan** di halaman yang saya baca.

### 7.2 Periode berlangganan

✅ Bisa **bulanan**, **6 bulan**, atau **tahunan**; periode lebih panjang lebih murah per bulan. Halaman Harga menampilkan toggle dengan label diskon **-20%** untuk 6 bulan dan **-50%** untuk tahunan.

⚠️ Halaman Harga menampilkan Pro **Rp 30.000 per bulan** dan **Rp 360.000 per tahun**, sedangkan *meta description* halaman yang sama menyebut "mulai dari **Rp 50.000/bulan**". Pusat Bantuan sengaja **tidak menuliskan angka** karena harga dan promo berubah. **Anggap halaman Harga sebagai sumber kebenaran** dan cek langsung sebelum membayar.

### 7.3 Metode pembayaran

✅ Pembayaran diproses lewat **Xendit**. **QRIS** paling populer.

| Cara bayar | Jenis | Perpanjang otomatis? |
|---|---|---|
| QRIS, GoPay, e-wallet, virtual account (di pelajarin.ai) | **Sekali bayar** | **Tidak** (tidak ada auto-debit) |
| Kartu (di pelajarin.ai) | Langganan | **Ya**, sampai kamu batalkan |
| Aplikasi Android (Google Play) | Langganan | **Ya**, oleh Google Play, sampai dibatalkan |

- Untuk sekali bayar, Pro aktif sampai tanggal **"Ends on"** di halaman Profil. Lanjut? Bayar lagi manual. Tidak ada tombol *Manage subscription* karena memang tidak ada yang dibatalkan.
- Pelajarin.ai **tidak menyimpan detail kartu**.

### 7.4 Membatalkan langganan

| Sumber | Cara |
|---|---|
| Kartu di web | Profil → **Manage subscription** → batalkan |
| Google Play | Aplikasi → Profil → **Manage subscription**, atau Play Store → foto profil → **Payments & subscriptions** → **Subscriptions** → Pelajarin AI → **Cancel subscription** |

Setelah batal, Pro **tetap aktif sampai akhir periode yang sudah dibayar** dan kamu tidak ditagih lagi.

### 7.5 Saat paket berakhir

✅ Catatan, flashcard, streak, dan XP **tetap ada di akun**. Kamu hanya kembali ke batas paket Gratis.

### 7.6 Kebijakan refund

✅ Semua pembelian paket berbayar **final dan tidak dapat dikembalikan** setelah pembayaran dikonfirmasi (kebijakan resmi di `pelajarin.ai/refund`, tunduk pada peraturan perlindungan konsumen Indonesia). Tidak ada refund untuk sisa periode yang belum terpakai. Jika ada gangguan teknis serius yang tidak teratasi, pelajarin.ai bisa memberi kompensasi berupa **perpanjangan waktu layanan** (kebijakan mereka, bukan hak otomatis), bukan uang kembali.

Kalau ada tagihan janggal atau pembayaran tidak tercatat: cek status di Profil, lalu email `support@pelajarin.ai` dengan tanggal, jumlah, dan metode pembayaran.

### 7.7 Kode promo dan afiliasi

✅ Pusat Bantuan punya artikel *Using a promo or affiliate code* (tempat memasukkan kode diskon/afiliasi). Isi detailnya tidak saya baca.

### 7.8 Memilih paket

- **Coba-coba atau pemakaian ringan**: tetap Gratis, upgrade saat kena batas.
- **Belajar rutin banyak mata pelajaran**: Pro.
- **Satu semester ke depan**: periode panjang paling murah per bulan.

---

## 8. Data dan Privasi

✅ **[Resmi]** "Materi belajarmu adalah milikmu"; data pribadi tidak dijual atau disewakan ke pihak ketiga.

### 8.1 Data yang dikumpulkan

| Jenis | Isi |
|---|---|
| Info akun | Nama, email, foto profil (jika masuk lewat Google/Discord), preferensi bahasa |
| Konten belajar | File yang diunggah, catatan, flashcard, kuis, riwayat chat AI (semua privat ke akunmu) |
| Data teknis | Alamat IP (hanya untuk mendeteksi penyalahgunaan); data pemakaian anonim lewat Google Analytics |
| Pembayaran | Diproses penyedia pihak ketiga; kartu kredit tidak disimpan |

### 8.2 Lama penyimpanan

| Data | Lama |
|---|---|
| File yang diunggah | Dihapus otomatis **paling lambat 1 bulan** setelah diproses |
| Catatan dan materi | Selama akunmu aktif |
| Hapus akun | **Belum ada opsi mandiri** di pengaturan profil; kirim permintaan ke `support@pelajarin.ai` |

### 8.3 Pihak ketiga

- **Penyedia AI**: OpenRouter dan Google Gemini (memproses konten belajar **tanpa info pribadi**).
- **Email notifikasi**: MailChannels.
- **Login**: Google/Discord (tunduk pada kebijakan privasi masing-masing).
- **Pembayaran**: Xendit dan Google Play (untuk langganan Android).
- **Analitik**: Google Analytics.

### 8.4 Menghapus data

Kamu bisa menghapus konten kapan saja. Menghapus catatan ikut menghapus ringkasan, flashcard, dan kuisnya. Fitur **unduh/ekspor data pribadi sedang dikembangkan** (belum tersedia).

### 8.5 Klaim di halaman Institusi

✅ Halaman Institusi menyebut **data terenkripsi ujung ke ujung** dan **infrastruktur cloud di Indonesia**.

⚠️ Pusat Bantuan menyebut konten diproses oleh penyedia AI pihak ketiga (OpenRouter, Google Gemini). Untuk institusi yang sensitif soal lokasi data, pastikan pada tim penjualan bagaimana klaim "cloud di Indonesia" berlaku pada langkah pemrosesan AI tersebut. Ini pertanyaan yang wajar diajukan; jawabannya tidak tertulis di halaman publik.

---

## 9. Halaman Institusi

✅ **[Resmi]** Untuk sekolah, kampus, dan perusahaan. "Satu platform untuk ribuan pelajar, dengan harga yang disesuaikan."

### 9.1 Keunggulan

| Fitur | Isi |
|---|---|
| **Analytics & Reporting** | Dasbor real-time kemajuan tiap pelajar |
| **Skala** | Mengelola dari **10 sampai 10.000+** pelajar |
| **Dedicated Support** | Tim dukungan khusus |
| **Custom Integration** | Terhubung ke **LMS, SSO**, atau platform yang sudah dipakai |

### 9.2 Alur memulai (3 langkah)

1. **Hubungi tim**: isi formulir atau kontak langsung.
2. **Demo & penawaran khusus**: demo gratis dan harga sesuai jumlah pelajar.
3. **Onboarding & mulai**: bantuan pembuatan akun, integrasi, dan pelatihan pengajar.

### 9.3 Formulir kontak

Kolom: Nama lengkap · Nama institusi · Email · Nomor telepon · Jabatan · **Jumlah pelajar** (1–50 / 51–200 / 201–500 / 501–1.000 / 1.000+) · Pesan/pertanyaan.
Janji respon: **1–2 hari kerja**.

---

## 10. FAQ

**Apa itu pelajarin.ai?**
Platform belajar AI yang mengubah dokumen, audio, video, dan YouTube menjadi ringkasan, flashcard, kuis, dan Tutor AI dalam Bahasa Indonesia.

**Format apa yang didukung?**
Dokumen (PDF, DOC/DOCX, PPT/PPTX, XLS/XLSX), teks (TXT, MD), gambar (JPG, PNG, WEBP, HEIC), audio (MP3, WAV, M4A, OGG, WEBA), video (MP4, MOV, WEBM, AVI, MKV), dan link YouTube publik. Detail ukuran di 4.1.

**Apakah gratis?**
Ya, ada paket Gratis dengan batas. Flashcard dan kuis tanpa batas; catatan, chat AI, serta video/audio terbatas. Tidak perlu kartu kredit.

**Berapa lama proses membuat catatan?**
Biasanya **30 detik sampai 2 menit**, tergantung ukuran dan kerumitan materi.

**Apakah ini kecurangan akademik?**
Menurut pelajarin.ai, bukan: ia membantu **memahami** materi seperti buku teks yang lebih pintar atau tutor sabar; ia menjelaskan konsep supaya kamu mengerjakannya sendiri. Ringkasan, flashcard, dan kuis adalah teknik belajar lama, hanya dibuat otomatis dari materimu. Tetap ikuti aturan sekolah/kampusmu soal pemakaian alat bantu AI pada tugas yang dinilai.

**Apakah AI akan menggantikan pekerjaan saya?**
Jawaban mereka: sebaliknya. Siswa yang benar-benar paham adalah yang tidak tergantikan AI; pelajarin.ai dibuat untuk memperdalam pemahaman, bukan menghafalkan untukmu.

**Apakah data saya aman?**
Lihat bagian 8. Ringkasnya: tidak dijual, file diunggah dihapus maksimal 1 bulan setelah diproses, kartu tidak disimpan, dan konten diproses penyedia AI tanpa info pribadi.

**Apakah bisa dipakai di iPhone?**
Aplikasi iOS belum ada, tapi versi browser bisa dipakai penuh di iPhone/iPad.

**Bagaimana cara hapus akun?**
Belum ada opsi mandiri; kirim permintaan ke `support@pelajarin.ai`.

**Apakah langganan saya diperpanjang otomatis?**
Tergantung cara bayar (tabel 7.3). QRIS/GoPay/e-wallet/VA = sekali bayar, tidak diperpanjang. Kartu dan Google Play = diperpanjang sampai dibatalkan.

---

## 11. Keterbatasan dan Ketidakkonsistenan

Hal-hal yang saya temukan saat membandingkan halaman-halaman resmi:

| # | Temuan | Keterangan |
|---|---|---|
| 1 | Angka pengguna berbeda | Beranda menyebut "1.000.000+ pelajar", judul seksi "Ratusan Ribu Pelajar", CTA "ribuan siswa" |
| 2 | Harga Pro berbeda | Halaman Harga: Rp 30.000/bulan; meta description: "mulai dari Rp 50.000/bulan"; label diskon -20% dan -50% tidak jelas berlaku ke harga yang mana |
| 3 | Batas Gratis tidak diberi angka | "Terbatas" tanpa jumlah |
| 4 | Bab terkunci di Gratis | Terlihat seperti "bab kosong" padahal terkunci |
| 5 | Mind map tanpa dokumentasi | Ada di produk, tidak dijelaskan di beranda maupun Pusat Bantuan |
| 6 | Snap & Solve hanya di Google Play | Tidak muncul di web/Pusat Bantuan |
| 7 | Bahasa halaman Institusi | Halaman tampil berbahasa Inggris saat diakses meski situs utama berbahasa Indonesia |
| 8 | Hapus akun manual | Belum ada opsi mandiri |
| 9 | Ekspor data | Masih dalam pengembangan |
| 10 | Tombol tampilan baru berlabel Indonesia | Meski antarmuka diatur ke Inggris |
| 11 | Klaim kecepatan | Beranda: "dalam sekejap/detik"; Pusat Bantuan: 30 detik–2 menit |
| 12 | Kualitas AI | Seperti semua AI, hasil bisa keliru; pelajarin.ai sendiri menyarankan mengecek hal penting |

**Yang belum saya baca / tidak bisa dipastikan**: isi aplikasi setelah login (`app.pelajarin.ai`), halaman Blog, Karier, Ketentuan, Kebijakan Privasi, dan Pengembalian Dana secara penuh, serta artikel *Contact us*, *Login and access*, dan *Promo & affiliate codes*.

---

## 12. Info Perusahaan dan Kontak

| | |
|---|---|
| Entitas | **CV Triputra Consulting**, AKR Tower Lt. 16A, Kebon Jeruk, Jakarta Barat 11510 |
| | **Dewaventures Pty Ltd**, 160 Robinson Road #14-04, Singapore Business Federation Center, Singapore 068914 |
| Telepon | +62 8161 9324 85 |
| Email | support@pelajarin.ai |
| Pusat Bantuan | support.pelajarin.ai |
| Media sosial | Instagram `@pelajarin_ai` · LinkedIn `pelajarin-ai` · Discord (komunitas) |
| Aplikasi | Google Play (Android); iOS segera hadir |
| Didukung oleh | Dewaweb (hosting/infrastruktur) |

---

## 13. Sumber

- Beranda: https://pelajarin.ai
- Harga: https://pelajarin.ai/pricing
- Institusi: https://pelajarin.ai/institutional
- Pusat Bantuan: https://support.pelajarin.ai/en
  - Membuat catatan pertama: `/en/create-your-first-note`
  - Format file: `/en/supported-file-formats`
  - YouTube ke catatan: `/en/summarize-youtube-videos`
  - Lama proses: `/en/note-generation-time`
  - Bahasa: `/en/supported-languages`
  - Tutor AI: `/en/ai-tutor`
  - Flashcard & spaced repetition: `/en/flashcards-spaced-repetition`
  - Kuis: `/en/quizzes`
  - Prediksi soal ujian: `/en/exam-question-prediction`
  - Streak, XP, level: `/en/streaks-xp-levels`
  - Leaderboard: `/en/leaderboard`
  - Gratis vs Pro: `/en/free-vs-pro`
  - Batal & refund: `/en/cancel-refund`
  - Data & privasi: `/en/data-privacy`
  - Belajar dengan AI (soal kecurangan): `/en/learning-with-ai`
  - Aplikasi mobile: `/en/mobile-app`
  - Tampilan baru: `/en/new-look`
- Google Play: listing aplikasi pelajarin.ai

> Bagian 5.2–5.9 dan seluruh bagian 6 adalah penjelasan umum (🧠), bukan dokumentasi internal pelajarin.ai. Detail teknis mereka bisa berbeda.