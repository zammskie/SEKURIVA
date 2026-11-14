import type { AuthoredStory } from "./authoring";
import { choice as c, ending as e, message as m, references as r } from "./story-helpers";

export const storiesOne: Readonly<Record<string, AuthoredStory>> = {
  "lowongan-paruh-waktu": {
    opening: [
      m("Narator", "Sepulang sekolah, sebuah akun media sosial mengirim tawaran kerja paruh waktu sebagai admin konten untuk siswa."),
      m("Pelaku", "Halo! Kami sedang mencari admin konten yang bisa bekerja dua jam sehari dari rumah."),
      m("Siswa", "Apa tugasnya dan dari perusahaan mana?"),
      m("Pelaku", "Tugasnya ringan: merapikan unggahan. Imbalannya menarik, dan pengalaman kerja belum diperlukan."),
      m("Pelaku", "Pendaftaran ditutup sore ini. Kalau berminat, isi formulir yang saya kirim agar kuotanya tidak habis."),
    ],
    firstPrompt: "Bagaimana kamu menanggapi tawaran pekerjaan tersebut?",
    firstContext: "Akun perekrut belum menunjukkan identitas perusahaan yang dapat diperiksa.",
    firstChoices: [
      c("Meminta informasi perusahaan dan memeriksa sumber lowongan secara mandiri", "Saya ingin memeriksa perusahaan dan lowongannya melalui kanal resmi dahulu.", "Pemeriksaan dimulai", "Kamu menunda pendaftaran sampai sumber tawaran dapat diverifikasi.", "low", "Meminta identitas yang dapat diuji membuat klaim perekrut tidak langsung dipercaya.", "Cari situs atau akun resmi perusahaan secara mandiri."),
      c("Langsung membuka formulir pendaftaran yang dikirimkan", "Saya buka formulirnya dulu untuk melihat persyaratannya.", "Masuk ke alur perekrut", "Dalam simulasi, kamu melihat permintaan data sebelum mengetahui identitas perusahaan.", "medium", "Membuka alur dari pengirim dapat membuat permintaan berikutnya terasa normal meski sumbernya belum jelas.", "Jangan isi data; periksa perusahaan melalui kanal resmi terlebih dahulu."),
    ],
    branches: [
      { messages: [m("Pelaku", "Nama kami Studio Maju. Detail kantor nanti diberikan setelah pendaftaran."), m("Pelaku", "Posisinya tinggal satu. Kalau menunggu, saya tidak bisa menjamin tempatmu."), m("Narator", "Pencarian mandiri belum menemukan kanal resmi yang cocok dengan klaim akun tersebut.")], prompt: "Apa langkahmu ketika identitas perusahaan masih tidak jelas?", context: "Perekrut menambah tekanan waktu tanpa memberi sumber yang dapat diverifikasi.", choices: [
        c("Hentikan percakapan dan cek lowongan melalui kanal resmi", "Saya tidak akan mendaftar sebelum menemukan pengumuman resmi.", "Data tetap terlindungi", "Dalam simulasi, dokumen pribadi tidak dikirim kepada akun yang belum jelas.", "low", "Menghentikan interaksi memberi waktu untuk memeriksa fakta tanpa tekanan.", "Gunakan kanal resmi perusahaan yang ditemukan sendiri."),
        c("Lanjutkan pendaftaran karena takut kehilangan kesempatan", "Baik, saya lanjut agar tidak kehilangan kesempatan.", "Tekanan memengaruhi keputusan", "Dalam simulasi, permintaan dokumen dan biaya pendaftaran muncul berikutnya.", "high", "Rasa takut kehilangan peluang mengalahkan pemeriksaan identitas yang belum selesai.", "Berhenti sebelum menyerahkan dokumen atau membayar biaya."),
      ], endings: [
        e("Lowongan diperiksa secara mandiri", "Kamu menghentikan percakapan dan mencari pengumuman melalui kanal resmi. Identitas perekrut tetap tidak jelas, sehingga tidak ada data yang diserahkan.", "Verifikasi mandiri memutus tekanan waktu dan menjaga dokumen pribadi."),
        e("Pendaftaran mulai terasa mendesak", "Kamu melanjutkan alur simulasi, lalu melihat permintaan dokumen dan biaya di muka. Tidak ada data atau uang sungguhan yang dikirim.", "Jalur ini menunjukkan bagaimana urgensi dapat membawa siswa ke permintaan berisiko."),
      ] },
      { messages: [m("Sistem", "Pratinjau formulir fiktif menampilkan kolom dokumen pribadi dan biaya administrasi. Tidak ada kolom yang dapat diisi."), m("Pelaku", "Agar proses cepat, dokumen dan biaya pendaftaran harus disiapkan hari ini."), m("Narator", "Permintaan biaya muncul sebelum pekerjaan atau perusahaan dapat diverifikasi.")], prompt: "Apa yang kamu lakukan saat formulir meminta dokumen dan biaya?", context: "Pratinjau ini hanya ilustrasi; tidak ada data pribadi yang diminta aplikasi.", choices: [
        c("Tutup formulir dan jangan kirim data atau biaya", "Saya menutup formulir. Saya tidak akan mengirim dokumen atau biaya.", "Permintaan berisiko dihentikan", "Dalam simulasi, informasi pribadi dan dana tetap tidak diserahkan.", "low", "Berhenti saat melihat permintaan data dan biaya mencegah risiko meningkat.", "Periksa informasi lowongan melalui sumber resmi yang ditemukan sendiri."),
        c("Teruskan pengiriman dokumen dan pembayaran dalam simulasi", "Saya memilih lanjut dalam simulasi agar prosesnya selesai.", "Paparan data disimulasikan", "Simulasi memperlihatkan risiko penyalahgunaan dokumen dan kehilangan biaya, tanpa mengirim apa pun.", "high", "Dokumen dan biaya diminta oleh pihak yang identitasnya belum terbukti.", "Batalkan proses dan jangan menyerahkan data atau dana."),
      ], endings: [
        e("Formulir ditutup sebelum data dibagikan", "Kamu berhenti setelah melihat permintaan tidak wajar. Simulasi berakhir tanpa pengiriman dokumen atau pembayaran.", "Mengenali red flag setelah membuka formulir tetap memberi kesempatan untuk menghentikan risiko."),
        e("Risiko pendaftaran terlihat", "Kamu memilih meneruskan tindakan pada simulasi. Layar pembelajaran menjelaskan bahwa dokumen dan biaya bisa disalahgunakan; tidak ada pengiriman sungguhan.", "Jalur ini memperlihatkan risiko ketika pendaftaran didahulukan dari verifikasi perusahaan."),
      ] },
    ],
    summary: "Tawaran kerja mudah dengan imbalan menarik dipakai untuk mendorong pendaftaran cepat, penyerahan dokumen, dan biaya di muka.",
    redFlags: [
      { title: "Identitas perusahaan tidak jelas", description: "Akun perekrut tidak memberi kanal perusahaan yang dapat diperiksa.", nodeId: "branch-a-1" },
      { title: "Imbalan menarik untuk tugas ringan", description: "Janji penghasilan dipakai untuk menurunkan kewaspadaan.", nodeId: "open-4" },
      { title: "Pendaftaran dibatasi waktu", description: "Batas sore hari menekan siswa agar tidak memeriksa sumber.", nodeId: "open-5" },
      { title: "Dokumen dan biaya di muka", description: "Persyaratan sensitif muncul sebelum identitas perekrut jelas.", nodeId: "branch-b-1" },
    ],
    tactics: [{ title: "Iming-iming keuntungan", description: "Pekerjaan ringan digambarkan memberi imbalan tinggi agar tawaran terasa sulit ditolak.", nodeId: "open-4" }, { title: "Urgensi", description: "Batas pendaftaran dan kuota terakhir mendorong keputusan terburu-buru.", nodeId: "branch-a-2" }],
    safeActions: ["Cari pengumuman lowongan dari situs atau akun resmi perusahaan secara mandiri.", "Jangan membayar biaya untuk mendapatkan pekerjaan yang belum terverifikasi.", "Jangan mengirim dokumen pribadi lewat akun yang identitasnya tidak jelas.", "Beri waktu untuk memeriksa tawaran meski perekrut mengatakan kuota terbatas."],
    conclusion: "Kesempatan kerja perlu diperiksa sebelum data atau biaya diberikan.", references: [r.ojkBooklet],
  },
  "tugas-deposit": {
    opening: [
      m("Narator", "Di sela waktu luang, sebuah pesan menawarkan tugas daring singkat seperti menyukai konten dan memberi ulasan."),
      m("Pelaku", "Cukup selesaikan beberapa tugas kecil. Ada imbalan awal agar kamu bisa melihat cara kerjanya."),
      m("Siswa", "Siapa penyelenggaranya?"),
      m("Pelaku", "Tim kami mengelola banyak kampanye. Anggota grup sudah sering menerima imbalan, lihat testimoni mereka."),
      m("Pelaku", "Kalau ingin coba, masuk grup sekarang. Tugas pertama tidak sulit."),
    ],
    firstPrompt: "Apa yang kamu lakukan ketika mendapatkan tawaran tugas online tersebut?", firstContext: "Imbalan dan testimoni ditunjukkan sebelum identitas penyelenggara jelas.",
    firstChoices: [
      c("Coba tugas awal dan ikuti grup yang ditawarkan", "Saya ingin melihat tugas pertamanya di grup.", "Keterlibatan meningkat", "Dalam simulasi, grup menampilkan imbalan awal dan dorongan mengikuti tugas berikutnya.", "medium", "Imbalan awal dapat membuat permintaan berikutnya tampak wajar.", "Periksa penyelenggara dan aturan pembayaran sebelum ikut lebih jauh."),
      c("Minta identitas penyelenggara dan mekanisme pembayaran", "Sebelum ikut, saya ingin tahu perusahaan dan aturan pembayarannya.", "Klaim diuji", "Dalam simulasi, permintaan informasi membuat ketidakjelasan penyelenggara terlihat.", "low", "Pertanyaan tentang identitas dan skema pembayaran menguji transparansi tawaran.", "Cari informasi perusahaan melalui sumber resmi."),
    ],
    branches: [
      { messages: [m("Sistem", "Grup fiktif menampilkan catatan imbalan awal dan beberapa testimoni anggota."), m("Pelaku", "Untuk membuka tugas berikutnya dengan imbalan lebih besar, anggota perlu deposit terlebih dahulu."), m("Narator", "Pekerjaan yang semula gratis sekarang meminta siswa menyetor dana.")], prompt: "Apa keputusanmu saat deposit diminta?", context: "Tidak ada transaksi sungguhan dalam simulasi ini.", choices: [
        c("Tolak deposit dan tinggalkan grup", "Saya tidak akan menyetor dana untuk mendapat tugas.", "Permintaan dana ditolak", "Dalam simulasi, kamu keluar sebelum uang apa pun berpindah.", "low", "Menolak pembayaran di muka menghentikan eskalasi skema.", "Tinggalkan grup dan verifikasi tawaran secara mandiri."),
        c("Setor deposit dalam simulasi untuk tugas berikutnya", "Saya pilih deposit dalam simulasi untuk melihat kelanjutannya.", "Risiko dana meningkat", "Simulasi menggambarkan kemungkinan deposit sulit ditarik dan muncul permintaan tambahan; tidak ada pembayaran nyata.", "high", "Janji imbalan lebih besar bergantung pada penyetoran dana dari anggota.", "Jangan transfer; cari pekerjaan yang mekanismenya jelas."),
      ], endings: [
        e("Deposit ditolak", "Kamu meninggalkan grup saat pekerjaan berubah menjadi permintaan setoran. Tidak ada dana nyata yang berpindah.", "Imbalan awal tidak membuktikan tugas berikutnya aman."),
        e("Imbalan berubah menjadi setoran", "Dalam simulasi, deposit diikuti tuntutan baru untuk membuka tugas lain. Tidak ada uang sungguhan yang disetor.", "Skema dapat terus menaikkan permintaan dana meski diawali imbalan kecil."),
      ] },
      { messages: [m("Pelaku", "Nama perusahaan belum bisa saya bagikan. Lihat saja testimoni anggota grup ini."), m("Sistem", "Pratinjau grup menunjukkan komentar pujian yang tidak dapat diverifikasi sumbernya."), m("Pelaku", "Kesempatan anggota baru terbatas. Deposit pertama diperlukan hari ini." )], prompt: "Bagaimana kamu menilai testimoni dan permintaan deposit itu?", context: "Identitas penyelenggara tetap tidak dapat diperiksa.", choices: [
        c("Hentikan keterlibatan dan periksa legalitas tawaran", "Testimoni saja belum cukup. Saya berhenti dan memeriksa penyelenggara.", "Jarak aman terjaga", "Dalam simulasi, klaim grup tidak dijadikan dasar untuk menyetor dana.", "low", "Testimoni tanpa sumber bukan pengganti identitas usaha dan aturan yang jelas.", "Gunakan sumber resmi untuk memeriksa penyelenggara."),
        c("Percayai testimoni dan lanjutkan deposit dalam simulasi", "Saya memilih percaya komentar anggota dan lanjut dalam simulasi.", "Bukti sosial menyesatkan", "Simulasi menunjukkan risiko deposit dan permintaan setoran berulang; tidak ada transfer nyata.", "high", "Komentar anggota dapat dibuat atau dipilih untuk membangun kepercayaan.", "Tolak setoran dan cari informasi di luar grup."),
      ], endings: [
        e("Testimoni diperiksa kritis", "Kamu tidak menyetor dana setelah penyelenggara gagal memberi identitas yang jelas.", "Pemeriksaan di luar grup lebih kuat daripada testimoni yang tidak dapat diverifikasi."),
        e("Tekanan grup memengaruhi pilihan", "Kamu memilih deposit secara simulatif. Cerita menunjukkan bagaimana testimoni dan batas waktu dapat memicu setoran berulang.", "Keputusan ini berisiko karena sumber testimoni dan penyelenggara tidak terverifikasi."),
      ] },
    ],
    summary: "Tugas ringan dan imbalan awal dipakai untuk menarik siswa ke grup, lalu deposit dijadikan syarat tugas berikutnya.",
    redFlags: [{ title: "Imbalan terlalu mudah", description: "Tugas sederhana dijanjikan memberi hasil menarik tanpa penjelasan usaha.", nodeId: "open-2" }, { title: "Testimoni sulit diverifikasi", description: "Komentar anggota dipakai sebagai pengganti identitas penyelenggara.", nodeId: "open-4" }, { title: "Deposit untuk bekerja", description: "Penyetoran dana diminta agar tugas berikutnya terbuka.", nodeId: "branch-a-2" }, { title: "Batas waktu anggota", description: "Permintaan hari ini menekan siswa agar segera menyetor.", nodeId: "branch-b-3" }],
    tactics: [{ title: "Imbalan awal", description: "Hadiah kecil membangun rasa percaya sebelum deposit diminta.", nodeId: "branch-a-1" }, { title: "Bukti sosial", description: "Testimoni grup digunakan untuk meyakinkan calon anggota.", nodeId: "branch-b-2" }, { title: "Urgensi", description: "Kesempatan terbatas dibuat seolah menutup waktu verifikasi.", nodeId: "branch-b-3" }],
    safeActions: ["Jangan menyetor dana untuk membuka pekerjaan yang belum jelas.", "Periksa identitas penyelenggara melalui sumber di luar grup.", "Nilai testimoni secara kritis; komentar anggota bukan bukti pembayaran yang dapat diverifikasi.", "Hentikan interaksi jika imbalan bergantung pada deposit tambahan."],
    conclusion: "Imbalan awal dan testimoni tidak menghapus risiko permintaan deposit.", references: [r.ojkSatgas, r.ojkBooklet],
  },
  "kurir-qr": {
    opening: [
      m("Narator", "Sebuah pesan masuk ketika kamu sedang menunggu kiriman barang. Pengirimnya mengaku sebagai kurir, tetapi nomornya belum dikenal."),
      m("Pelaku", "Paketmu tertahan di pusat sortir karena alamat perlu diperbarui."),
      m("Siswa", "Nomor resinya apa?"),
      m("Pelaku", "Resi baru terlihat setelah pembaruan. Pindai QR pada pesan ini untuk melihat halaman klaim."),
      m("Pelaku", "Kalau tidak diurus hari ini, paket bisa dikembalikan ke pengirim."),
    ],
    firstPrompt: "Bagaimana kamu menanggapi pesan mengenai paket tersebut?", firstContext: "Nomor resi belum dapat dicocokkan dan QR berasal dari pesan pribadi.",
    firstChoices: [
      c("Buka simulasi QR dari pengirim", "Saya buka pratinjau QR itu dalam simulasi.", "Halaman tiruan terlihat", "Simulasi menampilkan halaman klaim fiktif tanpa QR aktif atau tautan keluar.", "medium", "QR dari kontak tak dikenal dapat mengarahkan ke halaman yang bukan milik layanan pengiriman.", "Periksa status lewat aplikasi pengiriman yang dibuka sendiri."),
      c("Periksa status melalui aplikasi resmi pengiriman", "Saya cek aplikasi pengiriman resmi lebih dulu.", "Sumber dibandingkan", "Dalam simulasi, informasi paket dapat dibandingkan tanpa mengikuti QR dari pengirim.", "low", "Membuka kanal resmi sendiri mengurangi ketergantungan pada pesan masuk.", "Cari resi di aplikasi atau situs resmi yang sudah dikenal."),
    ],
    branches: [
      { messages: [m("Sistem", "Pratinjau halaman fiktif menampilkan label 'klaim paket' dan meminta data tambahan serta biaya kirim ulang. Tidak ada isian aktif."), m("Pelaku", "Isi sekarang agar pengiriman dapat diproses."), m("Narator", "Permintaan biaya muncul, tetapi resi dan identitas kurir masih belum jelas.")], prompt: "Apa langkahmu saat halaman meminta data dan biaya tambahan?", context: "Halaman hanya tiruan dan tidak menerima informasi pribadi.", choices: [
        c("Tutup halaman dan verifikasi lewat layanan resmi", "Saya tutup halaman ini dan menghubungi layanan resmi.", "Permintaan dihentikan", "Dalam simulasi, data dan biaya tidak diberikan kepada pengirim yang belum dikenal.", "low", "Berhenti setelah melihat permintaan yang tidak sesuai memberi kesempatan memeriksa paket.", "Gunakan aplikasi atau nomor bantuan resmi layanan pengiriman."),
        c("Lanjut mengisi informasi pada halaman simulasi", "Saya lanjutkan langkah pada halaman tiruan ini dalam simulasi.", "Paparan data disimulasikan", "Simulasi menjelaskan risiko data dan biaya dapat diminta berulang; tidak ada data atau pembayaran nyata.", "high", "Halaman klaim dari pesan pribadi belum terbukti milik layanan pengiriman.", "Jangan isi data; tutup dan verifikasi resi secara mandiri."),
      ], endings: [
        e("Klaim tiruan ditutup", "Kamu menghentikan alur QR dan memilih kanal resmi. Paket dapat diperiksa tanpa menyerahkan data pada halaman tiruan.", "Mengenali permintaan biaya setelah membuka pratinjau tetap dapat mencegah paparan lebih lanjut."),
        e("Permintaan data makin jauh", "Simulasi memperlihatkan bahwa halaman tiruan dapat meminta data dan biaya lain. Tidak ada data pribadi yang dimasukkan.", "Alur ini menunjukkan risiko mengikuti QR yang tidak terverifikasi."),
      ] },
      { messages: [m("Sistem", "Pada aplikasi resmi fiktif, tidak ditemukan kendala sesuai klaim pesan tersebut."), m("Pelaku", "Aplikasi belum diperbarui. Ikuti instruksi saya saja supaya paket tidak kembali."), m("Narator", "Pengirim meminta kamu mengabaikan sumber resmi yang tidak mendukung ceritanya.")], prompt: "Apa yang kamu lakukan setelah status resmi tidak cocok?", context: "Klaim pengirim bertentangan dengan informasi di aplikasi resmi.", choices: [
        c("Hubungi bantuan pengiriman lewat kanal resmi", "Saya akan bertanya langsung ke layanan pengiriman resmi.", "Klaim diperiksa lagi", "Dalam simulasi, kamu tidak membuka tautan pengirim dan meminta klarifikasi melalui kanal resmi.", "low", "Ketidaksesuaian status perlu dijelaskan oleh layanan yang benar, bukan pengirim acak.", "Gunakan kontak bantuan dari aplikasi resmi."),
        c("Ikuti tautan pengirim karena takut paket kembali", "Saya mengikuti arahan pengirim dalam simulasi agar paket tidak kembali.", "Tekanan paket bekerja", "Simulasi membawa kamu ke halaman tiruan yang meminta data tambahan; tidak ada tautan aktif.", "high", "Rasa takut kehilangan paket mendorong pengabaian informasi resmi.", "Hentikan alur pesan dan verifikasi lewat layanan resmi."),
      ], endings: [
        e("Status paket dikonfirmasi", "Kamu mencari klarifikasi melalui kanal resmi dan tidak mengikuti QR yang tidak jelas sumbernya.", "Membandingkan klaim pengirim dengan status resmi membantu mengenali ketidaksesuaian."),
        e("Kekhawatiran membuka alur tiruan", "Simulasi memperlihatkan halaman tiruan setelah kamu mengikuti tautan pengirim; tidak ada data yang terkirim.", "Tekanan paket dikembalikan dapat membuat sumber resmi diabaikan."),
      ] },
    ],
    summary: "Identitas kurir dan ancaman paket dikembalikan dipakai untuk mengarahkan siswa ke QR atau halaman klaim yang tidak terverifikasi.",
    redFlags: [{ title: "Nomor pengirim tidak dikenal", description: "Identitas kurir tidak dapat dipastikan dari pesan masuk.", nodeId: "open-1" }, { title: "Resi belum dapat dicocokkan", description: "Pengirim menunda pemberian resi sampai QR dibuka.", nodeId: "open-4" }, { title: "Ancaman paket kembali", description: "Tekanan waktu dipakai agar siswa segera memindai QR.", nodeId: "open-5" }, { title: "Biaya klaim tambahan", description: "Halaman tiruan meminta data dan biaya yang belum didukung status resmi.", nodeId: "branch-a-1" }],
    tactics: [{ title: "Penyamaran otoritas", description: "Pengirim menyebut dirinya kurir untuk meminjam kepercayaan terhadap jasa pengiriman.", nodeId: "open-2" }, { title: "Ketakutan kehilangan paket", description: "Ancaman pengembalian paket mendorong tindakan cepat.", nodeId: "open-5" }],
    safeActions: ["Periksa resi lewat aplikasi atau situs resmi yang dibuka sendiri.", "Jangan memindai QR dari pesan yang sumbernya tidak jelas.", "Jangan berikan data atau biaya lewat halaman klaim yang belum terverifikasi.", "Hubungi bantuan resmi bila status paket tidak cocok."],
    conclusion: "Status paket harus diverifikasi melalui layanan resmi sebelum mengikuti QR dari pesan masuk.", references: [r.biModule, r.ojkBooklet],
  },
  "apk-palsu": {
    opening: [
      m("Narator", "Sebuah pesan pribadi masuk dengan berkas yang disebut undangan digital untuk acara akhir pekan."),
      m("Pelaku", "Hai, detail tempat acaranya ada di lampiran. Tolong buka sebelum malam ini, ya."),
      m("Siswa", "Kenapa berkasnya bernama undangan-acara.apk?"),
      m("Pelaku", "Itu format undangan baru. Setelah dibuka, alamat dan jadwalnya muncul otomatis."),
      m("Sistem", "Pratinjau berkas menunjukkan ekstensi .apk, yaitu paket aplikasi Android, bukan dokumen biasa. Tidak ada berkas yang dapat diunduh."),
    ],
    firstPrompt: "Apa tindakanmu ketika menerima file tersebut?", firstContext: "Nama berkas tampak seperti dokumen, tetapi ekstensinya APK.",
    firstChoices: [
      c("Coba membuka atau memasang APK dalam simulasi", "Saya lihat proses pemasangannya dalam simulasi.", "Permintaan izin muncul", "Simulasi menampilkan ilustrasi izin aplikasi tanpa memasang berkas apa pun.", "medium", "Berkas APK memasang aplikasi, sehingga risikonya berbeda dari membaca dokumen.", "Jangan pasang APK dari pesan pribadi yang belum diverifikasi."),
      c("Jangan pasang; verifikasi pengirim melalui kanal tepercaya", "Saya akan memastikan dulu siapa pengirimnya lewat kontak yang saya kenal.", "Sumber diperiksa", "Dalam simulasi, berkas tetap tidak dibuka sambil identitas pengirim diperiksa.", "low", "Memeriksa pengirim melalui kanal lain membantu menghadapi akun yang mungkin menyamar.", "Hubungi pengirim lewat nomor atau akun yang sudah diketahui sebelumnya."),
    ],
    branches: [
      { messages: [m("Sistem", "Ilustrasi pemasangan meminta akses SMS dan fitur aksesibilitas perangkat. Ini hanya tampilan statis, tidak meminta izin sungguhan."), m("Pelaku", "Izinkan saja supaya undangannya bisa terlihat."), m("Narator", "Izin yang diminta tidak sesuai dengan kebutuhan membaca undangan.")], prompt: "Apa keputusanmu saat melihat permintaan izin itu?", context: "Tidak ada aplikasi yang benar-benar dipasang di perangkat.", choices: [
        c("Batalkan proses dan tolak izin yang tidak relevan", "Saya batalkan. Undangan tidak perlu akses SMS atau aksesibilitas.", "Izin tidak diberikan", "Dalam simulasi, akses perangkat tetap terlindungi.", "low", "Permintaan izin berlebihan adalah alasan kuat untuk menghentikan pemasangan.", "Hapus berkas dan minta informasi acara melalui cara yang aman."),
        c("Setujui izin aplikasi dalam simulasi", "Saya pilih menyetujui izin pada simulasi ini.", "Akses berlebihan disimulasikan", "Simulasi menggambarkan risiko informasi perangkat dapat terekspos; tidak ada izin nyata diberikan.", "high", "Akses SMS dan aksesibilitas tidak diperlukan untuk membaca undangan.", "Tolak izin dan jangan jalankan APK dari sumber tidak jelas."),
      ], endings: [
        e("Pemasangan dihentikan", "Kamu membatalkan proses saat melihat izin yang tidak wajar. Tidak ada APK yang terpasang.", "Memeriksa izin aplikasi menjadi kesempatan kedua untuk menghentikan risiko."),
        e("Risiko izin perangkat terlihat", "Simulasi memperlihatkan dampak potensial dari izin berlebihan, tanpa mengakses perangkat sungguhan.", "Penyamaran dokumen dapat membawa pengguna ke permintaan akses yang tidak terkait."),
      ] },
      { messages: [m("Siswa", "Saya mencoba mengonfirmasi melalui kontak lama, tetapi belum mendapat jawaban."), m("Pelaku", "Ini penting. Kalau menunggu, kamu bisa melewatkan informasi acaranya."), m("Narator", "Pengirim kembali menekan meskipun asal berkas belum dapat dipastikan.")], prompt: "Bagaimana kamu menanggapi desakan pengirim?", context: "Keaslian pengirim dan berkas belum terverifikasi.", choices: [
        c("Minta format dokumen aman dan tunggu verifikasi", "Tolong kirim detailnya sebagai teks atau dokumen biasa; saya tunggu konfirmasi.", "Berkas tidak dijalankan", "Dalam simulasi, perangkat tetap aman sambil informasi diperiksa.", "low", "Informasi acara dapat diberikan tanpa meminta pemasangan aplikasi.", "Tunggu jawaban dari kontak tepercaya dan gunakan format yang sesuai."),
        c("Tetap pasang APK karena takut kehilangan informasi", "Saya memilih memasangnya dalam simulasi agar tidak tertinggal.", "Rasa ingin tahu mengalahkan verifikasi", "Simulasi menunjukkan permintaan izin berlebihan; tidak ada pemasangan nyata.", "high", "Tekanan kehilangan informasi membuat berkas yang belum jelas terasa perlu dibuka.", "Jangan pasang; verifikasi pengirim dan minta format aman."),
      ], endings: [
        e("Informasi diminta dengan aman", "Kamu menunggu verifikasi dan meminta detail acara tanpa APK. Tidak ada aplikasi yang dipasang.", "Menunda tindakan memberi waktu membedakan dokumen dari aplikasi."),
        e("Desakan mengarah ke pemasangan", "Dalam simulasi kamu memilih memasang APK dan melihat izin yang tidak wajar. Perangkat asli tidak berubah.", "Keinginan segera tahu isi undangan dapat mengabaikan risiko ekstensi file."),
      ] },
    ],
    summary: "Berkas APK disamarkan sebagai undangan agar siswa memasang aplikasi dari pesan pribadi dan memberikan izin yang tidak relevan.",
    redFlags: [{ title: "Ekstensi APK", description: "Berkas disebut dokumen tetapi merupakan paket aplikasi.", nodeId: "open-5" }, { title: "Sumber belum terverifikasi", description: "Identitas akun pengirim belum dikonfirmasi lewat kanal tepercaya.", nodeId: "open-1" }, { title: "Izin berlebihan", description: "Akses SMS dan aksesibilitas tidak diperlukan untuk membaca undangan.", nodeId: "branch-a-1" }, { title: "Desakan membuka segera", description: "Pengirim memberi batas waktu agar pemeriksaan terlewati.", nodeId: "branch-b-2" }],
    tactics: [{ title: "Rasa ingin tahu", description: "Lampiran acara membuat siswa ingin segera melihat isi berkas.", nodeId: "open-2" }, { title: "Penyalahgunaan kepercayaan", description: "Pesan pribadi mencoba terlihat seperti undangan dari kenalan.", nodeId: "open-1" }, { title: "Urgensi", description: "Pengirim menyebut informasi akan terlewat jika siswa menunggu.", nodeId: "branch-b-2" }],
    safeActions: ["Periksa ekstensi berkas sebelum membuka lampiran.", "Jangan pasang APK yang dikirim melalui pesan pribadi dari sumber tidak jelas.", "Tolak izin aplikasi yang tidak sesuai tujuan.", "Verifikasi pengirim melalui kontak yang sudah dipercaya dan minta format informasi yang aman."],
    conclusion: "Dokumen yang meminta pemasangan APK dan izin perangkat perlu dicurigai.", references: [r.komdigiApk, r.ojkBooklet],
  },
};
