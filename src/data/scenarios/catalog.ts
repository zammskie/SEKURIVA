import type { ScenarioMetadata } from "@/lib/scenario-engine/foundation-types";

const date = "2026-11-14T00:00:00.000Z";

/** Delapan metadata resmi. Ketersediaan tetap mensyaratkan graph yang valid. */
export const scenarioCatalog: readonly ScenarioMetadata[] = [
  {
    id: "lowongan-paruh-waktu", slug: "lowongan-paruh-waktu", title: "Lowongan Kerja Paruh Waktu Palsu",
    description: "Siswa menerima informasi lowongan kerja paruh waktu melalui media sosial atau pesan instan dengan tawaran pekerjaan mudah dan penghasilan menarik.",
    context: "Sebuah pesan menawarkan pekerjaan setelah jam sekolah. Identitas perusahaan dan sumber lowongan belum jelas.",
    category: "Penawaran pekerjaan", keywords: ["lowongan", "kerja paruh waktu", "biaya", "perusahaan"],
    learningObjectives: ["Memeriksa identitas perusahaan dan sumber lowongan.", "Mengenali permintaan biaya sebelum bekerja.", "Melindungi data pribadi saat menilai tawaran kerja."],
    relatedMaterials: ["Dasar Kesadaran Keamanan Digital", "Social Engineering", "Perlindungan Data Pribadi dan Keamanan Perangkat"],
    status: "ready", createdAt: date, updatedAt: date,
  },
  {
    id: "tugas-deposit", slug: "tugas-deposit", title: "Penipuan Tugas Online dengan Sistem Deposit",
    description: "Siswa ditawari tugas sederhana seperti memberi ulasan atau menyukai konten, lalu diminta membayar deposit untuk tugas berikutnya atau pencairan penghasilan.",
    context: "Tawaran tugas online tampak mudah pada awalnya. Setelah beberapa langkah, muncul permintaan transfer yang tidak dijelaskan sejak awal.",
    category: "Tugas online", keywords: ["tugas", "deposit", "ulasan", "komisi", "transfer"],
    learningObjectives: ["Mengenali iming-iming keuntungan dan manipulasi psikologis.", "Menilai risiko permintaan deposit atau transfer."],
    relatedMaterials: ["Social Engineering", "Keamanan Transaksi Digital"], status: "ready", createdAt: date, updatedAt: date,
  },
  {
    id: "kurir-qr", slug: "kurir-qr", title: "Penipuan Kurir dan QR Code Paket",
    description: "Siswa menerima pesan dari orang yang mengaku kurir dan diminta memindai QR Code untuk klaim paket yang disebut mengalami kendala.",
    context: "Pesan paket datang ketika siswa mungkin sedang menunggu kiriman. Pengirim menekan agar QR segera dipindai.",
    category: "Penyamaran kurir", keywords: ["kurir", "paket", "qr", "klaim", "pengiriman"],
    learningObjectives: ["Memverifikasi identitas pengirim.", "Mengenali risiko QR dari sumber tidak dikenal.", "Memeriksa status paket melalui aplikasi resmi."],
    relatedMaterials: ["Dasar Kesadaran Keamanan Digital", "Phishing"], status: "ready", createdAt: date, updatedAt: date,
  },
  {
    id: "apk-palsu", slug: "apk-palsu", title: "File APK Undangan atau Resi Palsu",
    description: "Siswa menerima file aplikasi melalui WhatsApp yang disebut sebagai undangan digital, resi pengiriman, atau dokumen elektronik.",
    context: "Sebuah berkas APK dikirim melalui percakapan pribadi. Pengirim mengarahkan siswa untuk memasangnya agar dapat melihat isi dokumen.",
    category: "File aplikasi", keywords: ["apk", "undangan", "resi", "izin aplikasi", "perangkat"],
    learningObjectives: ["Mengenali risiko APK dari sumber tidak dikenal.", "Menilai izin akses aplikasi sebelum memasang.", "Melindungi perangkat dan informasi pribadi."],
    relatedMaterials: ["Phishing", "Perlindungan Data Pribadi dan Keamanan Perangkat"], status: "ready", createdAt: date, updatedAt: date,
  },
  {
    id: "qris-palsu", slug: "qris-palsu", title: "QRIS Palsu pada Transaksi",
    description: "Siswa hendak membayar dengan QRIS, tetapi identitas penerima pada layar pembayaran tidak sesuai dengan pihak yang seharusnya menerima dana.",
    context: "Pembayaran tampak rutin sampai nama penerima yang muncul berbeda. Siswa perlu memutuskan langkah sebelum menyetujui transaksi.",
    category: "Transaksi digital", keywords: ["qris", "pembayaran", "penerima", "nominal", "transaksi"],
    learningObjectives: ["Memeriksa identitas penerima dan nominal.", "Mengenali risiko pengalihan pembayaran.", "Menunda transaksi ketika informasi tidak sesuai."],
    relatedMaterials: ["Keamanan Transaksi Digital", "Dasar Kesadaran Keamanan Digital"], status: "ready", createdAt: date, updatedAt: date,
  },
  {
    id: "customer-service", slug: "customer-service", title: "Customer Service Palsu",
    description: "Siswa dihubungi orang yang mengaku petugas bantuan layanan keuangan atau pembayaran digital dan diminta berbagi layar, OTP, atau memasang aplikasi akses jarak jauh.",
    context: "Pengirim menyebut ada masalah akun dan menawarkan bantuan cepat. Permintaan akses muncul sebelum identitas petugas terverifikasi.",
    category: "Customer service", keywords: ["customer service", "otp", "share screen", "akses jarak jauh", "akun"],
    learningObjectives: ["Menjaga OTP dan kata sandi.", "Mengenali risiko berbagi layar serta akses jarak jauh.", "Memverifikasi bantuan melalui kanal resmi."],
    relatedMaterials: ["Social Engineering", "Perlindungan Data Pribadi dan Keamanan Perangkat"], status: "ready", createdAt: date, updatedAt: date,
  },
  {
    id: "investasi-impersonasi", slug: "investasi-impersonasi", title: "Investasi Palsu dan Impersonasi",
    description: "Siswa melihat tawaran investasi yang meniru identitas lembaga keuangan, menjanjikan keuntungan tetap, dan mengklaim tanpa risiko.",
    context: "Logo dan nama lembaga membuat penawaran tampak meyakinkan. Klaim keuntungan pasti perlu diperiksa sebelum memberi data atau dana.",
    category: "Investasi", keywords: ["investasi", "impersonasi", "keuntungan", "legalitas", "lembaga"],
    learningObjectives: ["Memeriksa legalitas penawaran melalui kanal resmi.", "Mengenali keuntungan tidak wajar dan peniruan identitas.", "Memahami risiko penawaran investasi ilegal."],
    relatedMaterials: ["Social Engineering", "Keamanan Transaksi Digital"], status: "ready", createdAt: date, updatedAt: date,
  },
  {
    id: "recovery-scam", slug: "recovery-scam", title: "Penipuan Pemulihan Dana (Recovery Scam)",
    description: "Seseorang menghubungi korban penipuan sebelumnya, mengaku dapat mengembalikan dana, lalu meminta biaya administrasi atau data tertentu.",
    context: "Korban yang berharap uangnya kembali menerima tawaran bantuan mendadak. Identitas pihak yang menawarkan pemulihan belum terverifikasi.",
    category: "Pemulihan dana", keywords: ["recovery scam", "pemulihan", "biaya administrasi", "korban"],
    learningObjectives: ["Mengenali penipuan lanjutan dan permintaan biaya pemulihan.", "Memverifikasi identitas pihak yang mengaku membantu.", "Menggunakan lembaga atau penyedia layanan resmi."],
    relatedMaterials: ["Social Engineering", "Keamanan Transaksi Digital", "Dasar Kesadaran Keamanan Digital"],
    status: "ready", createdAt: date, updatedAt: date,
  },
];
