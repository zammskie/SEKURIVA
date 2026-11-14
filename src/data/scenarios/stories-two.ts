import type { AuthoredStory } from "./authoring";
import { choice as c, ending as e, message as m, references as r } from "./story-helpers";

export const storiesTwo: Readonly<Record<string, AuthoredStory>> = {
  "qris-palsu": {
    opening: [
      m("Narator", "Di sebuah toko fiktif, kamu akan membayar alat tulis dengan QRIS menggunakan aplikasi pembayaran yang biasa dipakai."),
      m("Pelaku", "Total belanja Rp42.000. Silakan pindai kode pembayaran di meja."),
      m("Siswa", "Saya sudah memindai. Di layar muncul nama penerima 'Ruang Serba', bukan nama toko ini."),
      m("Pelaku", "Itu rekening pengelola kami. Sama saja, kok; antrean berikutnya sudah menunggu."),
      m("Sistem", "Layar pembayaran pada simulasi hanya ilustrasi statis: penerima 'Ruang Serba', nominal Rp47.000. Tidak ada QR aktif atau transaksi."),
    ],
    firstPrompt: "Apa yang perlu kamu lakukan sebelum menyelesaikan pembayaran?", firstContext: "Nama penerima dan nominal berbeda dari informasi pembelian.",
    firstChoices: [
      c("Periksa nama merchant dan nominal sebelum konfirmasi", "Saya ingin memeriksa nama penerima dan nominalnya dulu.", "Detail diperiksa", "Dalam simulasi, ketidaksesuaian terlihat sebelum tombol bayar ditekan.", "low", "Layar konfirmasi adalah kesempatan mengecek penerima dan jumlah transaksi.", "Tunda pembayaran hingga identitas dan nominal cocok."),
      c("Ikuti penjual dan lanjut tanpa memeriksa detail", "Saya lanjut sesuai arahan penjual dalam simulasi.", "Pemeriksaan terlewat", "Simulasi membawa kamu ke tahap konfirmasi dengan data penerima yang masih tidak cocok.", "medium", "Kepercayaan pada penjelasan penjual tidak menggantikan pengecekan di aplikasi.", "Baca detail penerima dan nominal sebelum menyetujui pembayaran."),
    ],
    branches: [
      { messages: [m("Siswa", "Nama penerimanya berbeda dan nominalnya lebih besar dari total belanja."), m("Pelaku", "Kadang nama pengelola berbeda. Bayar saja, nanti kami sesuaikan."), m("Narator", "Penjelasan lisan tidak mengubah informasi yang ditampilkan aplikasi pembayaran.")], prompt: "Apa keputusanmu setelah menemukan ketidaksesuaian?", context: "Layar masih menampilkan penerima dan nominal yang berbeda.", choices: [
        c("Batalkan transaksi dan minta klarifikasi serta kode yang benar", "Saya batalkan dulu. Tolong tunjukkan kode dan nominal yang sesuai.", "Pembayaran ditunda", "Dalam simulasi, tidak ada dana berpindah sebelum detail diperbaiki.", "low", "Membatalkan memberi kesempatan toko memperjelas penerima dan nominal.", "Gunakan kode yang sumbernya jelas dan periksa ulang layar konfirmasi."),
        c("Tetap lanjut karena penjual bilang perbedaan itu wajar", "Saya mengikuti penjelasan penjual dalam simulasi.", "Risiko salah penerima", "Simulasi menggambarkan pembayaran dapat menuju pihak atau nominal yang tidak diharapkan; tidak ada dana nyata.", "high", "Ketidaksesuaian yang nyata di layar tidak selesai hanya dengan reassurance.", "Batalkan dan minta penjelasan yang dapat diverifikasi."),
      ], endings: [
        e("Detail pembayaran diklarifikasi", "Kamu menunda pembayaran sampai penerima dan nominal dapat dipastikan. Tidak ada transaksi sungguhan.", "Pemeriksaan detail sebelum konfirmasi mencegah pengalihan atau salah nominal."),
        e("Perbedaan diabaikan", "Simulasi memperlihatkan risiko ketika pembayaran diteruskan meski detail tidak sesuai. Tidak ada uang yang berpindah.", "Penjelasan penjual perlu dibandingkan dengan informasi di aplikasi."),
      ] },
      { messages: [m("Sistem", "Sebelum konfirmasi akhir, aplikasi fiktif kembali menampilkan nama penerima 'Ruang Serba' dan Rp47.000."), m("Pelaku", "Cepat konfirmasi saja. Antrean sudah panjang."), m("Narator", "Masih ada kesempatan untuk meninjau detail sebelum tindakan akhir.")], prompt: "Apa yang kamu lakukan di layar konfirmasi akhir?", context: "Pembayaran belum terjadi; identitas penerima belum cocok.", choices: [
        c("Periksa ketidaksesuaian dan batalkan pembayaran", "Saya tidak akan mengonfirmasi sampai data penerima benar.", "Konfirmasi dihentikan", "Dalam simulasi, dana tidak terkirim ke penerima yang tidak sesuai.", "low", "Meninjau ulang sebelum konfirmasi dapat memperbaiki keputusan awal yang terburu-buru.", "Minta kode pembayaran yang sesuai dan cek nominal."),
        c("Konfirmasi meski nama penerima tidak sesuai", "Saya pilih konfirmasi dalam simulasi agar antrean tidak tertahan.", "Risiko transaksi disimulasikan", "Simulasi menunjukkan kemungkinan dana menuju penerima berbeda; tidak ada pembayaran nyata.", "high", "Tekanan antrean tidak mengubah tujuan pembayaran yang terlihat di layar.", "Batalkan bila nama atau nominal tidak sesuai."),
      ], endings: [
        e("Konfirmasi dibatalkan tepat waktu", "Kamu melihat kembali detail penerima dan menghentikan pembayaran sebelum disetujui.", "Layar konfirmasi akhir adalah kesempatan penting untuk mengoreksi keputusan."),
        e("Pembayaran tidak cocok", "Simulasi menunjukkan hasil potensial saat nama penerima dan nominal diabaikan. Tidak ada transaksi sebenarnya.", "Memeriksa penerima dan nominal perlu dilakukan setiap kali membayar dengan QRIS."),
      ] },
    ],
    summary: "Kode QRIS pada transaksi fiktif menampilkan penerima dan nominal yang tidak sesuai, sementara penjual menekan siswa agar segera membayar.",
    redFlags: [{ title: "Nama penerima berbeda", description: "Penerima yang muncul tidak sesuai identitas toko.", nodeId: "open-3" }, { title: "Nominal berbeda", description: "Layar menampilkan angka lebih besar dari total belanja.", nodeId: "open-5" }, { title: "Penjelasan tanpa bukti", description: "Penjual meminta percaya bahwa nama pengelola berbeda tanpa memperbaiki detail.", nodeId: "branch-a-2" }, { title: "Tekanan antrean", description: "Antrean dipakai untuk mempercepat keputusan pembayaran.", nodeId: "branch-b-2" }],
    tactics: [{ title: "Reassurance", description: "Penjual menyebut perbedaan tidak masalah agar siswa mengabaikan layar.", nodeId: "open-4" }, { title: "Urgensi", description: "Antrean dijadikan alasan agar pemeriksaan dilewati.", nodeId: "branch-b-2" }],
    safeActions: ["Gunakan aplikasi pembayaran resmi.", "Periksa nama penerima dan nominal pada layar sebelum konfirmasi.", "Batalkan transaksi bila detail tidak cocok, lalu minta klarifikasi.", "Jangan membiarkan tekanan antrean menggantikan pemeriksaan."],
    conclusion: "Nama penerima dan nominal pada layar aplikasi harus sesuai sebelum pembayaran disetujui.", references: [r.biQris, r.biModule],
  },
  "customer-service": {
    opening: [
      m("Narator", "Sebuah pesan masuk dari akun bernama 'Bantuan SaldoKita', layanan fiktif yang menyerupai pusat bantuan dompet digital."),
      m("Pelaku", "Kami mendeteksi kendala pada akunmu. Tim bantuan siap membantu supaya akses tidak tertunda."),
      m("Siswa", "Saya masih bisa membuka aplikasi. Kendala apa yang dimaksud?"),
      m("Pelaku", "Kadang masalah belum terlihat di aplikasi. Untuk pemeriksaan cepat, ikuti petunjuk yang saya kirim."),
      m("Pelaku", "Jangan menunggu terlalu lama karena akses akun bisa dibatasi sementara."),
    ],
    firstPrompt: "Bagaimana kamu menanggapi seseorang yang mengaku petugas layanan?", firstContext: "Kontak datang dari pesan sepihak, bukan dari kanal bantuan di aplikasi.",
    firstChoices: [
      c("Ikuti tautan dan instruksi dari petugas yang menghubungi", "Saya melihat petunjuknya dalam simulasi.", "Alur pesan diikuti", "Simulasi memperlihatkan permintaan kode dan akses perangkat tanpa membuka tautan aktif.", "medium", "Kontak sepihak dapat menyamar sebagai petugas walau nama akunnya meyakinkan.", "Buka aplikasi resmi secara mandiri dan hubungi dukungan dari sana."),
      c("Buka aplikasi resmi sendiri untuk memeriksa akun", "Saya cek akun melalui aplikasi yang sudah saya gunakan.", "Klaim dibandingkan", "Dalam simulasi, aplikasi resmi fiktif tidak menunjukkan kendala yang disebut pengirim.", "low", "Pemeriksaan mandiri mengurangi ketergantungan pada pesan yang tidak diminta.", "Gunakan menu bantuan dalam aplikasi resmi."),
    ],
    branches: [
      { messages: [m("Pelaku", "Agar masalah selesai, berikan kode verifikasi yang masuk dan nyalakan berbagi layar."), m("Pelaku", "Kalau sulit, kami punya aplikasi bantuan jarak jauh."), m("Narator", "Kode autentikasi dan akses perangkat diminta oleh pihak yang belum terverifikasi. Tidak ada kode sungguhan dalam simulasi.")], prompt: "Apa tindakanmu saat kode dan akses layar diminta?", context: "Aplikasi ini tidak meminta OTP atau akses perangkat nyata.", choices: [
        c("Hentikan komunikasi tanpa memberi kode atau akses", "Saya tidak akan membagikan kode atau layar. Saya hubungi bantuan resmi.", "Akses tetap privat", "Dalam simulasi, akun dan perangkat tidak dibagikan kepada pengirim.", "low", "Kode dan akses perangkat tidak boleh diberikan lewat kontak sepihak.", "Akhiri percakapan dan gunakan kanal bantuan resmi."),
        c("Ikuti permintaan petugas dalam simulasi", "Saya memilih mengikuti petunjuknya dalam simulasi.", "Pengambilalihan disimulasikan", "Simulasi menjelaskan risiko akun diakses pihak lain; tidak ada OTP atau screen sharing nyata.", "high", "Permintaan kode dan berbagi layar dapat memberi kendali pada pihak yang menyamar.", "Jangan bagikan kode, PIN, kata sandi, atau akses perangkat."),
      ], endings: [
        e("Akses perangkat terlindungi", "Kamu menghentikan percakapan ketika diminta kode dan berbagi layar. Tidak ada akses yang diberikan.", "Mengenali permintaan autentikasi memberi kesempatan menghentikan penyamaran."),
        e("Risiko pengambilalihan terlihat", "Simulasi menggambarkan bagaimana kode dan akses layar dapat disalahgunakan. Tidak ada akun nyata yang tersentuh.", "Nama akun bantuan bukan bukti identitas petugas."),
      ] },
      { messages: [m("Sistem", "Aplikasi resmi fiktif menampilkan status akun normal dan tidak ada peringatan."), m("Pelaku", "Sistem kami lebih cepat dari aplikasi. Jika tidak mengikuti petunjuk, akunmu akan dibatasi."), m("Narator", "Klaim pengirim tidak cocok dengan informasi di aplikasi resmi.")], prompt: "Apa yang kamu lakukan ketika klaim pengirim tidak cocok?", context: "Pengirim masih mendesak meski akun tampak normal.", choices: [
        c("Akhiri komunikasi dan hubungi layanan resmi", "Saya akan bertanya lewat menu bantuan di aplikasi, bukan pesan ini.", "Verifikasi aman", "Dalam simulasi, tidak ada kode atau akses yang diberikan kepada pengirim.", "low", "Perbedaan klaim perlu diklarifikasi melalui kanal yang bisa dipercaya.", "Gunakan pusat bantuan dari aplikasi resmi."),
        c("Lanjutkan percakapan dan ikuti permintaan akses", "Saya lanjut dalam simulasi karena takut akun dibatasi.", "Ancaman memengaruhi pilihan", "Simulasi memperlihatkan risiko berbagi layar dan kode tanpa benar-benar mengaktifkannya.", "high", "Ancaman pembatasan akun adalah tekanan agar siswa mengabaikan pemeriksaan mandiri.", "Tutup pesan dan jangan berikan akses perangkat."),
      ], endings: [
        e("Klaim bantuan diverifikasi", "Kamu memilih pusat bantuan resmi dan tidak mengikuti pesan sepihak.", "Memeriksa kondisi akun sendiri membantu menilai klaim yang mendesak."),
        e("Ancaman akun membelokkan keputusan", "Simulasi menjelaskan risiko ketika klaim pembatasan akun dipercaya tanpa bukti. Tidak ada akses nyata diberikan.", "Ketakutan akun dibatasi tidak boleh menjadi alasan membagikan autentikasi."),
      ] },
    ],
    summary: "Akun bantuan fiktif mengklaim ada masalah dan meminta kode serta akses perangkat melalui pesan sepihak.",
    redFlags: [{ title: "Kontak sepihak", description: "Siswa tidak memulai permintaan bantuan dari aplikasi resmi.", nodeId: "open-1" }, { title: "Ancaman pembatasan akun", description: "Pengirim mendesak dengan risiko akses dibatasi.", nodeId: "open-5" }, { title: "Permintaan kode verifikasi", description: "Kode autentikasi diminta oleh akun yang belum terbukti resmi.", nodeId: "branch-a-1" }, { title: "Permintaan berbagi layar", description: "Akses perangkat dapat membuka informasi sensitif.", nodeId: "branch-a-1" }, { title: "Klaim tidak cocok dengan aplikasi", description: "Status resmi fiktif menunjukkan akun normal.", nodeId: "branch-b-1" }],
    tactics: [{ title: "Penyamaran petugas", description: "Nama akun bantuan dipakai untuk menimbulkan rasa percaya.", nodeId: "open-1" }, { title: "Ketakutan", description: "Ancaman pembatasan akun menekan siswa agar patuh.", nodeId: "branch-b-2" }],
    safeActions: ["Buka aplikasi resmi secara mandiri untuk memeriksa akun.", "Jangan berikan OTP, PIN, kata sandi, atau kode verifikasi kepada pihak yang menghubungi sepihak.", "Jangan aktifkan berbagi layar atau akses jarak jauh untuk kontak yang tidak terverifikasi.", "Hubungi dukungan dari menu resmi aplikasi."],
    conclusion: "Identitas bantuan harus diperiksa melalui kanal resmi; kode dan akses perangkat tetap rahasia.", references: [r.ojkIasc, r.ojkBooklet],
  },
  "investasi-impersonasi": {
    opening: [
      m("Narator", "Sebuah unggahan media sosial menawarkan investasi melalui 'DanaCakra', merek fiktif yang tampil seperti lembaga profesional."),
      m("Pelaku", "Program kami memberi hasil tetap dalam waktu singkat. Banyak peserta sudah membagikan pengalamannya."),
      m("Siswa", "Apakah ada risiko dan izin usahanya bisa diperiksa?"),
      m("Pelaku", "Risikonya sangat kecil. Lihat komentar peserta dan tampilan profil kami."),
      m("Pelaku", "Pendaftaran gelombang ini hampir penuh. Masuk grup sekarang untuk mendapat tempat."),
    ],
    firstPrompt: "Bagaimana kamu menilai penawaran investasi tersebut?", firstContext: "Klaim hasil tetap dan profil yang rapi belum membuktikan legalitas.",
    firstChoices: [
      c("Bergabung dengan grup untuk melihat penawaran lebih lanjut", "Saya masuk grup dalam simulasi untuk melihat informasinya.", "Promosi bertambah", "Simulasi menampilkan testimoni dan ajakan menyetor dana.", "medium", "Grup promosi dapat memperkuat klaim yang belum diverifikasi.", "Periksa identitas dan izin melalui sumber resmi sebelum menilai penawaran."),
      c("Periksa identitas dan legalitas melalui sumber resmi", "Saya cek izin dan identitas perusahaan lewat sumber resmi.", "Legalitas diuji", "Dalam simulasi, identitas yang diklaim belum ditemukan di sumber resmi yang diperiksa.", "low", "Logo dan nama profesional tidak cukup untuk membuktikan izin.", "Gunakan kanal resmi regulator atau lembaga terkait."),
    ],
    branches: [
      { messages: [m("Sistem", "Grup fiktif menampilkan komentar yang mengaku sudah menerima hasil. Sumber komentar tidak dapat diperiksa."), m("Pelaku", "Setor dana hari ini agar hasil tetap berlaku untuk gelombang ini."), m("Narator", "Ajakan menyetor muncul sebelum legalitas dan risiko dijelaskan secara memadai.")], prompt: "Apa keputusanmu saat grup meminta setoran?", context: "Testimoni tidak menggantikan pemeriksaan izin dan risiko.", choices: [
        c("Tolak setoran dan tinggalkan grup", "Saya tidak akan menyetor dana berdasarkan komentar grup.", "Setoran dihindari", "Dalam simulasi, dana tetap berada pada siswa dan penawaran dapat diperiksa lagi.", "low", "Menolak ajakan memberi ruang untuk menilai legalitas dan kewajaran klaim.", "Cari informasi izin dan produk dari sumber resmi."),
        c("Setor dana dalam simulasi karena percaya testimoni", "Saya memilih setoran simulatif karena komentar peserta terlihat meyakinkan.", "Kerugian dana disimulasikan", "Simulasi menggambarkan risiko dana tidak dapat ditarik; tidak ada transaksi nyata.", "high", "Testimoni grup belum membuktikan hasil atau keamanan produk.", "Jangan setor sebelum izin, risiko, dan identitas terverifikasi."),
      ], endings: [
        e("Testimoni tidak dijadikan bukti", "Kamu meninggalkan grup tanpa menyetor dana dan memilih memeriksa penawaran secara mandiri.", "Kewajaran hasil dan legalitas lebih penting daripada jumlah komentar positif."),
        e("Setoran didorong oleh testimoni", "Simulasi menunjukkan risiko penyetoran ke pihak yang belum jelas. Tidak ada dana sungguhan yang berpindah.", "Testimoni dan hasil tetap dapat dipakai untuk menyembunyikan risiko."),
      ] },
      { messages: [m("Sistem", "Pencarian simulatif melalui sumber resmi tidak menemukan kecocokan identitas penawaran 'DanaCakra'."), m("Pelaku", "Izin kami sedang diproses. Masuk sekarang sebelum kesempatan ditutup."), m("Narator", "Klaim izin yang masih diproses bukan bukti legalitas saat ini.")], prompt: "Apa yang kamu lakukan setelah legalitas tidak dapat diverifikasi?", context: "Pengirim tetap menjanjikan hasil tinggi dan segera meminta komitmen.", choices: [
        c("Hentikan keterlibatan dan laporkan penawaran mencurigakan", "Saya berhenti dan akan menggunakan kanal resmi untuk melapor bila perlu.", "Penawaran dihentikan", "Dalam simulasi, siswa tidak menyetor dana ke pihak yang identitasnya belum jelas.", "low", "Ketidakcocokan identitas merupakan alasan untuk menunda atau menghentikan transaksi.", "Simpan bukti penawaran dan gunakan kanal pelaporan resmi."),
        c("Lanjut karena percaya penjelasan izin sedang diproses", "Saya lanjut dalam simulasi walau izinnya belum jelas.", "Klaim belum terbukti diabaikan", "Simulasi memperlihatkan risiko penyetoran pada penawaran tanpa izin yang dapat diverifikasi.", "high", "Janji izin mendatang tidak membuktikan legalitas penawaran sekarang.", "Jangan setor; verifikasi ulang melalui regulator atau lembaga resmi."),
      ], endings: [
        e("Identitas penawaran tidak cocok", "Kamu menghentikan keterlibatan dan menyimpan informasi penawaran untuk diperiksa lebih lanjut.", "Pemeriksaan legalitas memberi dasar lebih kuat daripada profil dan klaim pelaku."),
        e("Janji izin menutupi risiko", "Simulasi menunjukkan risiko melanjutkan investasi saat izin belum dapat diverifikasi. Tidak ada dana nyata disetor.", "Klaim 'sedang diproses' tidak boleh menggantikan bukti resmi."),
      ] },
    ],
    summary: "Penawaran investasi fiktif memakai profil profesional, testimoni, hasil tetap, dan kuota terbatas untuk mendorong setoran.",
    redFlags: [{ title: "Hasil tetap dalam waktu singkat", description: "Janji hasil yang sangat meyakinkan menutup pembahasan risiko.", nodeId: "open-2" }, { title: "Klaim risiko sangat kecil", description: "Risiko digambarkan seolah hampir tidak ada.", nodeId: "open-4" }, { title: "Testimoni tidak terverifikasi", description: "Komentar grup tidak mempunyai sumber yang dapat diperiksa.", nodeId: "branch-a-1" }, { title: "Legalitas tidak cocok", description: "Identitas penawaran belum ditemukan pada sumber resmi simulatif.", nodeId: "branch-b-1" }, { title: "Kesempatan terbatas", description: "Kuota digunakan untuk mendorong keputusan cepat.", nodeId: "open-5" }],
    tactics: [{ title: "Penyamaran identitas", description: "Profil profesional membuat entitas fiktif tampak resmi.", nodeId: "open-1" }, { title: "Bukti sosial", description: "Komentar peserta dipakai untuk membangun keyakinan.", nodeId: "branch-a-1" }, { title: "Kelangkaan", description: "Gelombang hampir penuh membuat pemeriksaan terasa terlambat.", nodeId: "open-5" }],
    safeActions: ["Periksa identitas dan izin penawaran melalui sumber resmi.", "Nilai kewajaran janji hasil dan informasi risiko.", "Jangan setor dana karena testimoni atau kuota terbatas.", "Simpan bukti dan gunakan kanal resmi untuk melaporkan indikasi aktivitas ilegal."],
    conclusion: "Profil meyakinkan dan testimoni tidak menggantikan pemeriksaan legalitas serta risiko.", references: [r.ojkSatgas, r.ojkBooklet],
  },
  "recovery-scam": {
    opening: [
      m("Narator", "Dalam kisah hipotetis ini, seorang siswa pernah melaporkan kerugian transaksi digital. Beberapa hari kemudian, akun baru menghubunginya."),
      m("Pelaku", "Kami bisa membantu menelusuri dana yang hilang. Kasusmu masih punya peluang diproses."),
      m("Siswa", "Dari mana Anda tahu tentang kejadian itu?"),
      m("Pelaku", "Tim kami menerima informasi penanganan. Prosesnya lebih cepat bila kamu mengikuti arahan kami."),
      m("Pelaku", "Jangan tunda; kesempatan penanganan bisa berubah jika berkas tidak segera disiapkan."),
    ],
    firstPrompt: "Bagaimana kamu merespons tawaran pemulihan dana itu?", firstContext: "Pihak yang menghubungi tidak diminta dan belum menunjukkan identitas yang dapat diverifikasi.",
    firstChoices: [
      c("Balas dan ikuti instruksi pihak yang menawarkan pemulihan", "Saya ingin tahu langkah yang mereka tawarkan dalam simulasi.", "Permintaan lanjutan muncul", "Simulasi memperlihatkan syarat biaya dan informasi tambahan tanpa mengumpulkan data nyata.", "medium", "Harapan mendapatkan dana kembali dapat membuat pihak yang belum dikenal dipercaya.", "Hubungi bank atau penyedia pembayaran melalui kanal resmi yang dicari sendiri."),
      c("Periksa melalui bank, penyedia pembayaran, atau kanal resmi", "Saya akan mengonfirmasi kasus ini melalui pihak resmi yang saya hubungi sendiri.", "Kanal resmi dipilih", "Dalam simulasi, informasi pelaporan dapat dibandingkan tanpa mengikuti pesan akun baru.", "low", "Pemeriksaan mandiri memisahkan proses resmi dari janji seseorang yang menghubungi sepihak.", "Gunakan kontak dari aplikasi atau situs resmi dan simpan bukti."),
    ],
    branches: [
      { messages: [m("Pelaku", "Agar dana bisa diproses, ada biaya administrasi di muka. Kami juga perlu informasi akun untuk mempercepatnya."), m("Siswa", "Apakah biaya dan permintaan itu tercantum di kanal resmi?"), m("Pelaku", "Jangan lewat kanal lain; nanti prosesmu kembali dari awal."), m("Narator", "Pihak tersebut membatasi verifikasi dan meminta biaya sebelum identitasnya terbukti.")], prompt: "Apa tindakanmu saat biaya dan informasi akun diminta?", context: "Tidak ada formulir atau pembayaran nyata pada simulasi ini.", choices: [
        c("Hentikan komunikasi dan amankan informasi keuangan", "Saya berhenti. Saya akan menyimpan bukti dan menghubungi pihak resmi.", "Permintaan dihentikan", "Dalam simulasi, biaya dan informasi akun tidak diberikan kepada pengirim.", "low", "Biaya di muka dari pihak tak dikenal menambah risiko setelah kerugian awal.", "Hubungi penyedia pembayaran dan kanal pelaporan resmi secara mandiri."),
        c("Ikuti permintaan biaya dan informasi dalam simulasi", "Saya mengikuti permintaan itu hanya dalam simulasi.", "Kerugian lanjutan disimulasikan", "Simulasi menunjukkan kemungkinan biaya tambahan dan penyalahgunaan informasi; tidak ada data atau transfer nyata.", "high", "Janji pemulihan digunakan untuk meminta biaya dan data sebelum proses resmi jelas.", "Jangan bayar atau bagikan informasi sensitif; simpan bukti dan lapor resmi."),
      ], endings: [
        e("Tawaran pemulihan dihentikan", "Kamu berhenti ketika biaya di muka diminta dan beralih ke kanal resmi. Hasil laporan mengikuti proses lembaga terkait.", "Menghentikan komunikasi mengurangi risiko penipuan lanjutan tanpa menjanjikan dana kembali."),
        e("Biaya tambahan terus diminta", "Simulasi menggambarkan bagaimana janji pemulihan dapat diikuti biaya baru. Tidak ada pembayaran atau data nyata yang diberikan.", "Kerugian sebelumnya dapat dieksploitasi dengan harapan pengembalian yang pasti."),
      ] },
      { messages: [m("Sistem", "Panduan fiktif mengarahkan korban menyimpan bukti dan menghubungi bank atau penyedia pembayaran melalui kanal resmi; penanganan tidak menjamin dana kembali."), m("Pelaku", "Lewat kami uangmu pasti kembali lebih cepat. Jangan buang waktu di jalur resmi."), m("Narator", "Janji hasil pasti bertentangan dengan proses penanganan yang bergantung pada pemeriksaan kasus.")], prompt: "Apa yang kamu lakukan saat pengirim menjanjikan hasil pasti?", context: "Kanal resmi memberi proses, bukan jaminan pengembalian dana.", choices: [
        c("Gunakan kanal resmi, simpan bukti, dan hindari janji pengembalian", "Saya lanjut lewat kanal resmi dan menyimpan bukti yang saya punya.", "Proses yang tepat dipilih", "Dalam simulasi, laporan mengikuti prosedur lembaga terkait tanpa janji hasil pasti.", "low", "Bukti dan kanal resmi lebih dapat dipertanggungjawabkan daripada janji pribadi.", "Hubungi bank atau penyedia pembayaran, dan gunakan kanal pelaporan resmi yang relevan."),
        c("Percayai pengirim karena menjanjikan proses lebih cepat", "Saya memilih janji cepat itu dalam simulasi.", "Harapan dimanfaatkan", "Simulasi memperlihatkan permintaan biaya di muka dan risiko lanjutan; tidak ada pembayaran nyata.", "high", "Janji kepastian hasil dapat mengeksploitasi kondisi korban yang ingin segera pulih.", "Tolak janji hasil pasti dan kembali ke kanal resmi."),
      ], endings: [
        e("Bukti disimpan, laporan dilanjutkan", "Kamu menempuh kanal resmi dan menyimpan bukti. Penanganan dapat berjalan sesuai prosedur, tanpa kepastian dana kembali.", "Pilihan ini menjaga informasi dan menghindari biaya dari pihak yang tidak terverifikasi."),
        e("Janji cepat membuka risiko baru", "Simulasi menunjukkan permintaan biaya setelah kamu mempercayai janji pengembalian. Tidak ada transaksi nyata.", "Proses resmi mungkin membutuhkan waktu; janji hasil pasti dari akun sepihak tetap perlu dicurigai."),
      ] },
    ],
    summary: "Kasus hipotetis ini menunjukkan tawaran pemulihan dana dari pihak tak dikenal yang meminta biaya di muka dan menjanjikan hasil pasti.",
    redFlags: [{ title: "Kontak datang tanpa diminta", description: "Pihak baru menghubungi korban setelah kerugian sebelumnya.", nodeId: "open-1" }, { title: "Klaim akses informasi kasus", description: "Pengirim tidak menjelaskan sumber dan kewenangannya secara terverifikasi.", nodeId: "open-4" }, { title: "Biaya administrasi di muka", description: "Pembayaran diminta sebelum proses resmi dibuktikan.", nodeId: "branch-a-1" }, { title: "Melarang verifikasi", description: "Pengirim mencoba menjauhkan korban dari kanal lain.", nodeId: "branch-a-3" }, { title: "Janji dana pasti kembali", description: "Kepastian hasil diklaim tanpa pemeriksaan kasus.", nodeId: "branch-b-2" }],
    tactics: [{ title: "Memanfaatkan kerentanan", description: "Harapan setelah kerugian dipakai untuk menarik perhatian korban.", nodeId: "open-2" }, { title: "Otoritas palsu", description: "Pengirim mengaku memiliki akses penanganan tanpa bukti kewenangan.", nodeId: "open-4" }, { title: "Harapan palsu", description: "Janji dana pasti kembali membuat proses resmi tampak kurang menarik.", nodeId: "branch-b-2" }],
    safeActions: ["Simpan bukti transaksi dan komunikasi yang sudah ada.", "Hubungi bank atau penyedia pembayaran melalui kanal resmi yang ditemukan sendiri.", "Gunakan kanal pelaporan resmi seperti IASC bila sesuai kasus; hasilnya mengikuti proses dan tidak dijamin.", "Jangan membayar biaya pemulihan atau membagikan OTP, PIN, dan akses perangkat kepada akun sepihak."],
    conclusion: "Setelah mengalami kerugian, tetap periksa siapa yang menawarkan bantuan dan gunakan proses resmi tanpa mengandalkan janji dana pasti kembali.", references: [r.ojkIasc, r.ojkBooklet],
  },
};
