import type { Material, MaterialCategory, MaterialIcon, MaterialSection } from "@/lib/materials/types";
import { slugify } from "@/lib/materials/utils";
import { getMaterialContent } from "./content";

const seedTime = "2026-11-13T00:00:00.000Z";
type SeedContent = {
  title: string; category: MaterialCategory; summary: string; icon: MaterialIcon; duration: number;
  objectives: string[]; sections: Omit<MaterialSection, "id">[];
  takeaways: string[]; redFlags: string[]; safeActions: string[];
};

const content: SeedContent[] = [
  {
    title: "Dasar Kesadaran Keamanan Digital", category: "Dasar Kesadaran Keamanan Digital", icon: "shield", duration: 12,
    summary: "Memahami aset digital, risiko sehari-hari, dan kebiasaan memeriksa sebelum bertindak.",
    objectives: ["Mengenali akun, perangkat, dan informasi yang perlu dijaga.", "Menentukan langkah verifikasi saat menerima permintaan mendadak."],
    sections: [
      { heading: "Apa yang perlu dilindungi?", paragraphs: ["Akun belajar, ponsel, percakapan, dan dokumen pribadi adalah bagian dari aktivitas digital kita. Gangguan pada satu akun dapat memengaruhi kegiatan sekolah dan hubungan dengan orang lain.", "Mulailah dengan mengenali informasi apa yang tersimpan, siapa yang dapat mengaksesnya, dan apa dampaknya jika tersebar."], bulletPoints: ["Kenali akun yang dipakai untuk belajar dan berkomunikasi.", "Batasi informasi pribadi yang dibagikan secara terbuka."], optionalCallout: "Contoh: foto label paket dapat memperlihatkan alamat dan nomor telepon." },
      { heading: "Berhenti, periksa, tentukan", paragraphs: ["Pesan yang menekan kita untuk segera membayar, membuka tautan, atau menyerahkan data perlu diperiksa. Cari pembanding melalui aplikasi atau kontak resmi yang kamu buka sendiri.", "Jika sudah terlanjur bertindak, hentikan langkah berikutnya dan minta bantuan orang tepercaya. Simpan bukti secara privat tanpa menyebarkan data sensitif."], bulletPoints: ["Tanyakan siapa pengirim dan apa yang diminta.", "Periksa melalui kanal yang tidak diberikan oleh pengirim pesan."], optionalCallout: "Berlaku saat menghadapi pesan lowongan palsu, kurir, investasi, dan penawaran pemulihan dana." },
    ],
    takeaways: ["Jeda singkat memberi ruang untuk memeriksa klaim.", "Verifikasi independen lebih kuat daripada tampilan pesan yang meyakinkan."],
    redFlags: ["Desakan waktu yang tidak memberi kesempatan untuk memeriksa.", "Permintaan uang atau data pribadi dari pihak yang belum jelas."],
    safeActions: ["Buka layanan resmi secara mandiri.", "Ajak guru, orang tua, atau orang tepercaya saat ragu."],
  },
  {
    title: "Mengenali Social Engineering dan Teknik Manipulasi", category: "Social Engineering", icon: "users", duration: 14,
    summary: "Mengenali penyamaran identitas, tekanan, dan bujukan yang memengaruhi keputusan digital.",
    objectives: ["Menjelaskan cara manipulasi memanfaatkan rasa takut atau harapan.", "Memeriksa identitas pihak yang mengaku sebagai petugas atau kenalan."],
    sections: [
      { heading: "Penyamaran dan otoritas", paragraphs: ["Social engineering memanfaatkan interaksi manusia untuk mendorong tindakan yang menguntungkan pelaku. Pengirim dapat mengaku sebagai petugas layanan, perekrut, teman, atau pihak yang membantu korban penipuan.", "Logo, foto profil, dan pengetahuan tentang masalah kita tidak cukup untuk membuktikan identitas. Periksa melalui kontak resmi atau nomor yang sudah dikenal."], bulletPoints: ["Periksa klaim jabatan melalui kanal independen.", "Jangan menyerahkan kode hanya karena pengirim terdengar meyakinkan."], optionalCallout: "Contoh: akun yang mengaku customer service meminta kode masuk untuk 'memulihkan' akun." },
      { heading: "Urgensi dan iming-iming", paragraphs: ["Batas waktu singkat, ancaman akun ditutup, atau janji penghasilan cepat dapat membuat seseorang melewati pemeriksaan. Penipuan tugas online kadang meminta deposit sebelum penghasilan dapat ditarik.", "Bila permintaan berubah dari informasi umum menjadi uang, dokumen, atau akses perangkat, berhenti dan nilai ulang situasinya."], bulletPoints: ["Kenali larangan bertanya atau berkonsultasi sebagai tanda bahaya.", "Tunda keputusan saat ada tekanan emosional."], optionalCallout: "Contoh terkait: lowongan paruh waktu palsu, investasi palsu, dan recovery scam." },
    ],
    takeaways: ["Identitas pengirim perlu diverifikasi, bukan hanya dipercaya dari tampilan.", "Tekanan waktu adalah alasan untuk berhenti sejenak."],
    redFlags: ["Pengirim melarang verifikasi kepada orang lain.", "Pengirim meminta deposit untuk memperoleh pekerjaan atau komisi."],
    safeActions: ["Hubungi organisasi melalui kanal resmi yang dicari sendiri.", "Diskusikan tawaran yang tidak biasa dengan orang tepercaya."],
  },
  {
    title: "Mengenali Phishing dan Tautan Mencurigakan", category: "Phishing", icon: "link", duration: 15,
    summary: "Memeriksa pesan, alamat situs, QR code, dan berkas sebelum membuka atau mengisi data.",
    objectives: ["Mengenali permintaan data melalui pesan yang menyamar.", "Memilih cara aman memeriksa tautan, QR code, dan lampiran."],
    sections: [
      { heading: "Pesan dan halaman yang menyamar", paragraphs: ["Phishing menggunakan pesan atau halaman yang tampak berasal dari pihak tepercaya untuk memancing data atau tindakan berisiko. Bahasa yang rapi dan logo resmi dapat ditiru.", "Lihat gabungan sumber, konteks, permintaan, dan alamat tujuan. Jika ragu, buka aplikasi atau situs resmi sendiri tanpa mengikuti tautan dari pesan."], bulletPoints: ["Jangan memasukkan kata sandi melalui tautan yang tidak diminta.", "Periksa alamat situs dan tujuan permintaan."], optionalCallout: "Contoh: pesan kurir meminta pemindaian QR untuk memperbaiki alamat paket." },
      { heading: "QR dan berkas aplikasi", paragraphs: ["QR code dapat membawa seseorang ke halaman yang berbeda dari tampilan fisik kodenya. Kode pada stiker atau pesan mendadak tidak membuktikan sumbernya tepercaya.", "Berkas APK dari pengirim tidak dikenal juga perlu dihindari. Gunakan sumber aplikasi resmi dan periksa izin yang diminta sebelum memasang aplikasi."], bulletPoints: ["Periksa alamat tujuan setelah memindai QR.", "Hindari memasang APK dari pesan undangan atau resi yang tidak terverifikasi."], optionalCallout: "Contoh terkait: QR paket, QRIS palsu, dan APK undangan atau resi palsu." },
    ],
    takeaways: ["Tampilan profesional tidak membuktikan keaslian situs.", "QR dan lampiran tetap memerlukan pemeriksaan sumber."],
    redFlags: ["Halaman meminta kata sandi atau OTP setelah tautan dari pesan mendadak.", "Berkas aplikasi dikirim melalui chat dan diminta segera dipasang."],
    safeActions: ["Buka kanal resmi secara mandiri.", "Laporkan pesan mencurigakan tanpa meneruskan berkasnya."],
  },
  {
    title: "Keamanan Transaksi Digital", category: "Keamanan Transaksi Digital", icon: "wallet", duration: 13,
    summary: "Menilai permintaan pembayaran, QRIS, penawaran kerja, dan investasi sebelum bertransaksi.",
    objectives: ["Memeriksa penerima dan alasan pembayaran.", "Mengenali pola deposit tugas dan penawaran investasi yang mencurigakan."],
    sections: [
      { heading: "Periksa sebelum membayar", paragraphs: ["Sebelum mengirim dana, cocokkan identitas penerima, jumlah, dan tujuan transaksi melalui aplikasi pembayaran. Pada QRIS, periksa nama penerima yang ditampilkan sebelum menyetujui pembayaran.", "Jangan menganggap tangkapan layar pembayaran atau pesan dari penjual sebagai satu-satunya bukti. Gunakan riwayat transaksi pada layanan resmi."], bulletPoints: ["Periksa nama penerima dan nominal.", "Hentikan pembayaran jika informasi tidak sesuai."], optionalCallout: "Contoh terkait: QRIS palsu dan perubahan rekening dalam percakapan belanja." },
      { heading: "Deposit, keuntungan, dan pemulihan", paragraphs: ["Tawaran tugas online yang meminta uang agar komisi dapat dicairkan patut dicurigai. Penawaran investasi dengan keuntungan pasti dan waktu sangat singkat juga perlu diperiksa dengan hati-hati.", "Jika sudah kehilangan dana, hubungi penyedia pembayaran melalui kanal resmi secepatnya. Jangan membayar pihak baru yang menjanjikan pengembalian dana secara pasti."], bulletPoints: ["Jangan membayar untuk mendapatkan bayaran kerja.", "Waspadai permintaan biaya tambahan untuk menarik dana."], optionalCallout: "Contoh terkait: tugas online dengan deposit, investasi palsu, dan recovery scam." },
    ],
    takeaways: ["Verifikasi penerima sebelum menyetujui transaksi.", "Janji keuntungan atau pemulihan pasti bukan alasan untuk mengirim uang."],
    redFlags: ["Deposit diwajibkan sebelum komisi bisa ditarik.", "Nama penerima pembayaran tidak sesuai dengan pihak yang diklaim."],
    safeActions: ["Periksa transaksi dalam aplikasi resmi.", "Minta pendampingan dan hubungi penyedia pembayaran resmi bila terlanjur membayar."],
  },
  {
    title: "Perlindungan Data Pribadi dan Keamanan Perangkat", category: "Perlindungan Data Pribadi dan Keamanan Perangkat", icon: "lock", duration: 14,
    summary: "Melindungi OTP, PIN, kata sandi, dokumen, dan perangkat dari permintaan yang tidak wajar.",
    objectives: ["Membedakan informasi yang boleh dibagikan dan yang harus dirahasiakan.", "Menilai risiko pemasangan aplikasi dan izin perangkat."],
    sections: [
      { heading: "Jaga rahasia akun dan data pribadi", paragraphs: ["OTP, PIN, kata sandi, dan kode pemulihan digunakan untuk mengendalikan akses. Jangan memberikannya kepada pihak yang menghubungi melalui chat atau telepon, termasuk yang mengaku sebagai customer service.", "Dokumen, alamat, dan foto label paket dapat memuat informasi pribadi. Bagikan hanya kepada penerima yang jelas dan untuk tujuan yang masuk akal."], bulletPoints: ["Gunakan kata sandi unik dan autentikasi tambahan bila tersedia.", "Batasi penyebaran dokumen serta tangkapan layar."], optionalCallout: "Contoh terkait: customer service palsu dan penipuan kurir." },
      { heading: "Periksa aplikasi dan akses perangkat", paragraphs: ["Aplikasi dari sumber tidak dikenal dapat meminta izin yang tidak sesuai dengan fungsinya. Periksa sumber unduhan, izin akses, dan alasan pemasangan sebelum memasang aplikasi.", "Berbagi layar atau memberi akses jarak jauh dapat memperlihatkan informasi yang seharusnya rahasia. Jika sudah terlanjur memberi akses, hentikan sesi dan cari bantuan melalui layanan resmi."], bulletPoints: ["Hindari APK dari pesan undangan atau resi yang tak terverifikasi.", "Jangan memberi akses perangkat kepada pihak yang belum dipastikan identitasnya."], optionalCallout: "Contoh terkait: APK palsu dan pihak yang mengaku membantu pemulihan dana." },
    ],
    takeaways: ["Rahasia akun dan akses perangkat perlu dijaga bersama.", "Kebutuhan data harus sesuai dengan tujuan dan penerimanya."],
    redFlags: ["Permintaan OTP atau PIN dari pihak yang menghubungi lebih dulu.", "Aplikasi meminta izin luas tanpa alasan yang jelas."],
    safeActions: ["Tolak berbagi kode rahasia.", "Periksa aplikasi serta sesi akun melalui kanal resmi jika merasa terpapar."],
  },
];

export const seedMaterials: Material[] = content.map((item, index) => ({
  id: `seed-${index + 1}`, title: item.title, slug: slugify(item.title), category: item.category,
  summary: item.summary, learningObjectives: item.objectives, estimatedDuration: item.duration,
  difficulty: "Dasar", coverIcon: item.icon, status: "Draft",
  sections: item.sections.map((section, sectionIndex) => ({ id: `section-${sectionIndex + 1}`, ...section })),
  keyTakeaways: item.takeaways, redFlags: item.redFlags, safeActions: item.safeActions,
  references: [],
  learningChecks: ([
    [getMaterialContent("keamanan-digital")?.check],
    [],
    [getMaterialContent("phishing")?.check],
    [],
    [getMaterialContent("kata-sandi")?.check, getMaterialContent("privasi")?.check],
  ][index] ?? []).filter(check => check !== undefined),
  createdAt: seedTime, updatedAt: seedTime,
}));
