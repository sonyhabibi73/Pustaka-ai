export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateLabel: string;
  readingMinutes: number;
  tag: string;
  blocks: BlogBlock[];
};

export const posts: Post[] = [
  {
    slug: "spaced-repetition-menghafal-malam-sebelum-ujian",
    title: "Kenapa menghafal semalam sebelum ujian itu selalu kalah",
    excerpt:
      "Sepuluh menit tiap hari mengalahkan dua jam semalam. Ini alasan logisnya, plus cara memulainya tanpa aplikasi ribet.",
    date: "2026-09-24",
    dateLabel: "24 September 2026",
    readingMinutes: 4,
    tag: "Kebiasaan",
    blocks: [
      {
        type: "p",
        text: "Malam sebelum ujian kamu membaca ulang catatan dari atas ke bawah, merasa sudah paham, lalu tidur. Keesokan harinya sebagian besar hilang. Bukan karena kamu bodoh—melainkan karena cara belajarnya melawan cara kerja ingatan.",
      },
      { type: "h2", text: "Lupa itu bukan kegagalan, itu jadwal" },
      {
        type: "p",
        text: "Otak membuang informasi yang tidak pernah diminta ulang. Kurva lupa menunjukkan ingatan turun tajam dalam 24 jam pertama, lalu melandai. Artinya: yang kamu butuhkan bukan lebih banyak bacaan, melainkan pengulangan yang datang tepat sebelum kamu lupa.",
      },
      {
        type: "list",
        items: [
          "Ulang tepat saat ingatan mulai lemah, bukan saat sudah hilang total.",
          "Tiap kali berhasil diingat, jaraknya boleh lebih panjang.",
          "Yang gagal diingat cepat kembali lagi—bukan disimpan lama.",
        ],
      },
      {
        type: "quote",
        text: "Sepuluh menit sehari mengalahkan dua jam semalam sebelum ujian.",
      },
      { type: "h2", text: "Cara mulai minggu ini" },
      {
        type: "p",
        text: "Unggah satu materi, biarkan aplikasi membuat kartunya, lalu kerjakan ulangan harian setiap hari pada jam yang sama—misalnya sepulang sekolah. Kuncinya bukan lamanya sesi, melainkan konsistensi hariannya. Streak yang putus sehari sudah cukup membuat jadwalnya kacau.",
      },
      {
        type: "p",
        text: "Satu peringatan: jadwal hanya seakurat penilaian dirimu. Kalau menekan 'Hafal' padahal masih ragu, kartu akan datang terlambat justru saat kamu paling butuh.",
      },
    ],
  },
  {
    slug: "cara-bikin-flashcard-yang-benar",
    title: "Cara bikin flashcard yang enak dijawab",
    excerpt:
      "Satu fakta per kartu, depan berupa pertanyaan, belakang singkat. Empat aturan ini membedakan kartu berguna dan kartu yang bikin frustrasi.",
    date: "2026-09-18",
    dateLabel: "18 September 2026",
    readingMinutes: 5,
    tag: "Flashcard",
    blocks: [
      {
        type: "p",
        text: "Flashcard yang jelek bukan kartu yang salah isinya, melainkan kartu yang terlalu banyak isinya. Kalau belakangnya berisi satu paragraf, kamu tidak bisa menilai 'hafal atau belum' dengan jujur.",
      },
      { type: "h2", text: "Aturan 1: satu fakta per kartu" },
      {
        type: "p",
        text: "Kartu yang memuat tiga fakta sekaligus akan gagal di dua sisi sekaligus: kamu ingat sebagian, sistem menganggap kamu lupa total, lalu kamu menyalahkan sistemnya.",
      },
      { type: "h2", text: "Aturan 2: depan berupa pertanyaan" },
      {
        type: "p",
        text: "Depan 'Fotosintesis' hanya menguji pengenalan. Depan 'Apa fungsi kloroplas?' menguji penarikan ingatan—gerakan yang sama persis dengan saat kamu menjawab di ruang ujian.",
      },
      { type: "h2", text: "Aturan 3: jawaban pendek" },
      {
        type: "p",
        text: "Batasi maksimal 25 kata. Kalau jawabannya panjang, pecah menjadi beberapa kartu atau ubah menjadi kartu isian.",
      },
      { type: "h2", text: "Aturan 4: jangan ada petunjuk" },
      {
        type: "list",
        items: [
          "Jangan menaruh jawaban di pertanyaan.",
          "Hindari kartu duplikat dengan rumus berbeda.",
          "Buang kartu yang jawabannya bisa ditebak dari pilihan.",
        ],
      },
      {
        type: "p",
        text: "Di Pustaka AI, kartu dibuat otomatis dari dokumenmu mengikuti aturan ini, dan kamu tetap bisa menilai seberapa yakinmu tiap kali membaliknya.",
      },
    ],
  },
  {
    slug: "kuis-vs-baca-ulang",
    title: "Kuis vs baca ulang: mana yang lebih nempel?",
    excerpt:
      "Membaca ulang terasa produktif tapi paling lemah. Mengingat ulang (testing effect) jauh lebih kuat—meski terasa lebih berat.",
    date: "2026-09-10",
    dateLabel: "10 September 2026",
    readingMinutes: 4,
    tag: "Metode belajar",
    blocks: [
      {
        type: "p",
        text: "Ada dua aktivitas belajar yang sering tertukar: membaca ulang catatan, dan mengingat ulang isi catatan tanpa melihatnya. Yang pertama terasa nyaman; yang kedua terasa berat. Padahal yang kedua yang benar-benar memindahkan informasi ke ingatan jangka panjang.",
      },
      { type: "h2", text: "Mengapa menguji diri lebih kuat" },
      {
        type: "p",
        text: "Saat kamu berusaha mengingat, otak harus menarik informasi keluar dari penyimpanan. Proses penarikan itu yang memperkuat jejaknya. Membaca ulang hanya membuat informasi terasa akrab—dan rasa akrab itu sering disalahartikan sebagai paham.",
      },
      {
        type: "list",
        items: [
          "Setelah belajar: kuis langsung untuk mengunci ingatan.",
          "Beberapa hari kemudian: kuis lagi untuk menemukan yang sudah terlupa.",
          "Sebelum ujian: kuis sebagai pemeriksaan akhir bagian lemah.",
        ],
      },
      { type: "h2", text: "Kalau salah, apa yang dilakukan?" },
      {
        type: "p",
        text: "Jangan langsung menghafal kuncinya. Tanya tutor AI kenapa jawaban itu benar, baca bagian materinya, lalu ulangi kuisnya. Kesalahan yang diproses jauh lebih berguna daripada kesalahan yang dilewati.",
      },
    ],
  },
  {
    slug: "meringkas-pdf-panjang",
    title: "Merangkas PDF 100 halaman dalam lima langkah",
    excerpt:
      "Bukan membaca lebih cepat, tapi membuang yang tidak perlu. Alur lima langkah dari dokumen mentah jadi catatan yang benar-benar dipakai.",
    date: "2026-09-02",
    dateLabel: "2 September 2026",
    readingMinutes: 6,
    tag: "Ringkasan",
    blocks: [
      {
        type: "p",
        text: "Dokumen panjang bukan masalah panjangnya, melainkan karena kamu memperlakukannya seperti novel: dibaca dari halaman pertama sampai terakhir. Ringkasan yang baik justru dimulai dari memutus apa yang tidak perlu dibaca.",
      },
      { type: "h2", text: "Lima langkah" },
      {
        type: "list",
        items: [
          "Baca daftar isi dan subjudul dulu—peta ini yang menentukan prioritas.",
          "Tandai bagian yang diujikan atau yang paling sering dirujuk dosen.",
          "Ringkas per bagian, bukan seluruh sekaligus, supaya tidak kehilangan detail.",
          "Tulis ulang dengan bahasamu sendiri; kalau tidak bisa, berarti belum paham.",
          "Ubah poin kunci menjadi pertanyaan—dari sanalah kartu dan kuis lahir.",
        ],
      },
      {
        type: "quote",
        text: "Satu catatan = satu topik fokus. Buku 300 halaman sebaiknya dipecah per bab.",
      },
      { type: "h2", text: "Di mana aplikasi masuk" },
      {
        type: "p",
        text: "Langkah 1 sampai 3 bisa diotomatisasi: unggah dokumennya, biarkan aplikasi memecahnya menjadi potongan, lalu menyusun ringkasan, kartu, dan kuis dari potongan tersebut. Kamu fokus di langkah 4 dan 5—bagian yang tidak bisa digantikan.",
      },
    ],
  },
  {
    slug: "menghindari-halusinasi-ai",
    title: "Cara mendeteksi jawaban AI yang mengarang",
    excerpt:
      "Jawaban AI bisa terdengar meyakinkan tapi tidak ada di sumber. Empat kecepatan cek ini sebaiknya kamu lakukan sebelum percaya.",
    date: "2026-08-26",
    dateLabel: "26 Agustus 2026",
    readingMinutes: 4,
    tag: "Kritis AI",
    blocks: [
      {
        type: "p",
        text: "Model bahasa dibuat untuk menyusun kalimat yang masuk akal, bukan untuk memastikan kebenaran. Akibatnya ia bisa menjawab dengan yakin atas hal yang tidak ada di materimu. Kabar baiknya, polanya bisa dikenali.",
      },
      { type: "h2", text: "Empat kecepatan cek" },
      {
        type: "list",
        items: [
          "Minta sumbernya. Jawaban yang bagus menunjukkan bagian materi asalnya.",
          "Cocokkan angka dan istilah asing dengan dokumen asli.",
          "Waspadai kalimat yang terlalu mulus tanpa satu pun detail spesifik.",
          "Tanyakan hal yang sama dengan sudut berbeda—jawaban karangan mudah berubah.",
        ],
      },
      { type: "h2", text: "Kenapa dokumen lebih aman daripada internet" },
      {
        type: "p",
        text: "Ketika jawaban dibatasi hanya pada materi yang kamu unggah, ruang untuk mengarang menyusut drastis: tidak ada internet yang bisa ditarik untuk melengkapi kekosongan. Kalaupun informasinya tidak ada, jawabannya akan bilang tidak ada—bukan mengarang.",
      },
      {
        type: "p",
        text: "Prinsip yang sama berlaku di Pustaka AI: pertanyaan yang tidak tercakup materi dijawab apa adanya, bukan ditutup dengan jawaban karangan.",
      },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
