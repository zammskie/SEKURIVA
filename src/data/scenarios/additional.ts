import { createBranchingScenario, type BranchingContent } from "./create-branching-scenario";

const contents: readonly BranchingContent[] = [
  {
    id: "email-akun", title: "Email Verifikasi Akun", description: "Email mengancam menutup akun belajar. Periksa sumber sebelum masuk.", difficulty: "Dasar",
    intro: "Kamu akan membuka tugas kelas. Ada email berlogo layanan belajar yang menyebut akunmu akan ditutup. Nama layanan dan seluruh tindakan dalam latihan ini fiktif.", sender: "Dukungan akun — belum terverifikasi",
    objectives: ["Membedakan tampilan meyakinkan dari identitas terverifikasi.", "Menggunakan jalur masuk mandiri dan melindungi kredensial."],
    first: { title: "Ancaman penutupan akun", message: "Akunmu ditutup dalam 15 menit! Gunakan tombol verifikasi pada email untuk mempertahankan akses tugas.", prompt: "Bagaimana kamu memeriksa peringatan ini?", options: [
      ["Buka layanan belajar dari alamat yang biasa digunakan", "Aku membuka layanan secara mandiri.", "safe", "Kamu memisahkan klaim dari sumbernya.", "Logo dan nama pengirim dapat ditiru; pemberitahuan perlu diperiksa lewat kanal yang dikenal."],
      ["Masuk melalui formulir dari email karena logonya sesuai", "Aku mengikuti formulir dari email.", "risky", "Tampilan tidak membuktikan asal halaman.", "Formulir tiruan dapat menyalin logo. Dalam latihan ini tidak ada formulir atau kata sandi nyata."],
    ] },
    cautious: { title: "Akun ternyata masih aktif", message: "Kamu dapat membuka tugas seperti biasa. Tidak ada pemberitahuan penutupan, tetapi email meminta balasan kata sandi untuk pemeriksaan manual.", prompt: "Apa langkah berikutnya?", options: [
      ["Tanyakan ke guru melalui kontak yang sudah dikenal", "Aku memverifikasi melalui guru tanpa membalas email.", "safe", "Kanal verifikasi tetap independen.", "Konfirmasi melalui pihak yang dikenal, kemudian gunakan fitur laporkan phishing bila pesan terbukti mencurigakan."],
      ["Balas kata sandi agar petugas dapat memeriksa", "Aku mengirim kata sandi kepada pengirim email.", "risky", "Rahasia akun keluar dari kendalimu.", "Kata sandi bukan informasi yang perlu dibagikan kepada petugas melalui email."],
    ] },
    exposed: { title: "Formulir meminta lebih banyak akses", message: "Verifikasi pertama belum cukup. Kirim juga kode pemulihan akunmu supaya proses selesai.", prompt: "Bagaimana kamu merespons?", options: [
      ["Tutup halaman dan amankan akun melalui situs resmi", "Aku berhenti dan meminta bantuan guru untuk memeriksa akun.", "safe", "Kamu membatasi paparan berikutnya.", "Jika kredensial sempat diberikan, ganti melalui kanal resmi, periksa sesi aktif, dan jangan bagikan kode pemulihan."],
      ["Setujui permintaan kode pemulihan", "Aku menyetujui penyerahan kode dalam simulasi.", "risky", "Akses pemulihan ikut terpapar.", "Kode pemulihan dapat digunakan untuk akses akun; jangan membagikannya kepada pengirim pesan."],
    ] },
    endings: ["Kamu menemukan ketidaksesuaian dan meminta konfirmasi tanpa membuka akses akun.", "Pemeriksaan awal tepat, tetapi kata sandi kemudian dibagikan. Langkah awal aman tidak meniadakan risiko keputusan berikutnya.", "Kamu berhenti sebelum menyerahkan kode pemulihan. Jika data masuk sempat diberikan, akun tetap perlu diamankan.", "Data masuk dan akses pemulihan berpotensi disalahgunakan. Ini hasil pilihan fiktif; tidak ada akun nyata yang diakses."],
    debriefing: { title: "Masuk lewat pintu yang kamu kenal", summary: "Desakan dan logo dapat membuat email terasa sah. Verifikasi klaim tanpa memakai jalur yang diberikan pengirim.", warningSigns: ["Ancaman batas waktu singkat.", "Permintaan kata sandi atau kode pemulihan.", "Peringatan tidak muncul di kanal resmi."], recommendedActions: ["Buka layanan dari alamat yang sudah dikenal.", "Konfirmasi lewat guru atau dukungan resmi.", "Amankan kredensial yang sempat diberikan lewat kanal resmi."], reflectionQuestions: ["Mengapa logo bukan bukti identitas?", "Apa yang perlu diamankan jika sempat mengisi formulir?"], relatedMaterialIds: ["phishing", "kata-sandi"] },
  },
  {
    id: "belanja-online", title: "Promo yang Terlalu Menarik", description: "Penjual mengajak bertransaksi di luar platform demi harga lebih murah.", difficulty: "Menengah",
    intro: "Kamu mencari perlengkapan sekolah di marketplace. Sebuah toko menawarkan potongan besar jika pembayaran dipindahkan ke chat pribadi. Tidak ada pembayaran nyata dalam latihan.", sender: "Penjual perlengkapan — ilustrasi",
    objectives: ["Mengenali pengalihan transaksi dari platform.", "Memeriksa permintaan pembayaran dan bukti transaksi."],
    first: { title: "Harga khusus di chat pribadi", message: "Kalau transfer langsung, harganya jauh lebih murah. Keluar saja dari marketplace, stok tinggal satu!", prompt: "Bagaimana kamu melanjutkan pembelian?", options: [
      ["Tetap gunakan proses pembayaran resmi platform", "Aku memilih pembayaran melalui platform.", "safe", "Proses transaksi tetap dapat ditelusuri di platform.", "Periksa reputasi dan ketentuan perlindungan platform; tidak ada metode yang menjamin setiap transaksi pasti aman."],
      ["Setujui transfer langsung demi diskon", "Aku bersedia membayar melalui chat pribadi.", "risky", "Transaksi keluar dari alur platform.", "Penyelesaian sengketa dan bukti pembayaran dapat lebih sulit ketika transaksi dialihkan."],
    ] },
    cautious: { title: "Biaya tambahan di luar pesanan", message: "Checkout resmi tersedia, tetapi penjual mengirim rekening pribadi untuk biaya asuransi yang tidak tercantum pada pesanan.", prompt: "Apa yang perlu kamu lakukan?", options: [
      ["Tanyakan biaya melalui dukungan resmi sebelum membayar", "Aku menunda pembayaran tambahan untuk memeriksa ketentuan.", "safe", "Kamu memeriksa perubahan biaya.", "Cocokkan jumlah dan tujuan pembayaran dengan informasi resmi pesanan."],
      ["Bayar biaya tambahan karena checkout awal resmi", "Aku mengikuti rekening tambahan dari chat.", "risky", "Pembayaran tambahan belum terverifikasi.", "Satu bagian transaksi resmi tidak membuktikan semua permintaan berikutnya sah."],
    ] },
    exposed: { title: "Transfer disebut belum masuk", message: "Pembayaran belum masuk. Transfer sekali lagi agar barang tidak dilepas ke orang lain.", prompt: "Bagaimana kamu menghadapi permintaan kedua?", options: [
      ["Periksa riwayat pembayaran dan hubungi dukungan penyedia pembayaran", "Aku menghentikan pembayaran ulang dan menyimpan bukti.", "safe", "Kamu tidak memperbesar kemungkinan kerugian.", "Jika pembayaran sudah dilakukan, hubungi penyedia pembayaran lewat kanal resmi secepatnya; pengembalian dana tidak dapat dijamin."],
      ["Setujui pembayaran kedua agar pesanan diproses", "Aku membayar ulang dalam simulasi.", "risky", "Risiko kerugian bertambah.", "Klaim pembayaran gagal perlu dicocokkan dengan riwayat transaksi, bukan hanya chat penjual."],
    ] },
    endings: ["Kamu mempertahankan transaksi resmi dan memeriksa biaya yang tidak tercantum.", "Pembelian utama lewat platform, tetapi biaya tambahan mengalihkan dana ke tujuan yang belum diverifikasi.", "Kamu menghentikan pembayaran berulang. Bukti transaksi membantu saat meminta bantuan untuk pembayaran sebelumnya.", "Tekanan stok membuat kamu menyetujui pembayaran berulang tanpa verifikasi. Tidak ada uang nyata yang dipindahkan."],
    debriefing: { title: "Periksa setiap perubahan transaksi", summary: "Harga murah dan stok terbatas bisa dipakai untuk mempercepat keputusan. Periksa tujuan, jumlah, dan kanal pembayaran.", warningSigns: ["Ajakan keluar platform.", "Biaya mendadak di rekening pribadi.", "Permintaan membayar ulang tanpa pemeriksaan."], recommendedActions: ["Gunakan alur resmi dan baca kebijakan transaksi.", "Periksa riwayat sebelum mengulang pembayaran.", "Simpan bukti dan minta bantuan lewat kanal resmi bila sudah terlanjur."], reflectionQuestions: ["Mengapa pembayaran pertama tidak membuktikan biaya tambahan sah?", "Bukti apa yang perlu disimpan tanpa membagikannya secara publik?"], relatedMaterialIds: ["keamanan-digital", "privasi"] },
  },
  {
    id: "teman-darurat", title: "Teman Meminta Bantuan", description: "Akun teman meminta dana mendesak dan melarangmu menelepon.", difficulty: "Dasar",
    intro: "Akun yang menggunakan foto teman mengirim pesan meminta bantuan. Kamu ingin menolong, tetapi belum tahu siapa yang sedang mengendalikan akun tersebut.", sender: "Akun teman — identitas belum dipastikan",
    objectives: ["Membedakan identitas akun dari orang yang mengendalikannya.", "Memverifikasi permintaan darurat lewat kanal lain."],
    first: { title: "Permintaan yang mendesak", message: "Aku butuh bantuan sekarang. Kirim uang ke rekening ini, jangan telepon karena aku sedang sibuk.", prompt: "Apa langkah pertamamu?", options: [
      ["Hubungi teman melalui nomor lama yang sudah tersimpan", "Aku mencoba memastikan keadaan teman lewat kontak lain.", "safe", "Kamu memakai kanal pembanding.", "Foto dan nama akun bisa disalin atau akun bisa diambil alih. Hubungi orangnya melalui kontak yang sudah dikenal."],
      ["Percaya karena foto profilnya benar", "Aku menyetujui bantuan hanya dari foto profil.", "risky", "Foto tidak membuktikan siapa yang mengirim.", "Kedekatan emosional dapat membuat pemeriksaan identitas terlewat."],
    ] },
    cautious: { title: "Telepon belum dijawab", message: "Nomor lama belum menjawab. Pengirim mengirim nomor baru dan mengatakan hanya nomor itu yang bisa digunakan.", prompt: "Bagaimana kamu memverifikasi?", options: [
      ["Tunda transfer dan minta konfirmasi dari kontak bersama yang dikenal", "Aku mencari konfirmasi independen.", "safe", "Verifikasi tidak kembali bergantung pada pengirim.", "Nomor baru dari pesan yang sama bukan bukti independen. Minta bantuan orang tepercaya tanpa menyebarkan data pribadi."],
      ["Telepon nomor baru dan percaya karena penelepon mengaku teman", "Aku mempercayai nomor yang diberikan pengirim.", "risky", "Sumber verifikasi masih dikendalikan pengirim.", "Pengakuan identitas melalui kontak baru belum cukup untuk membuktikan permintaan."],
    ] },
    exposed: { title: "Bantuan tambahan", message: "Ternyata kurang. Kirim lagi dan jangan beri tahu siapa pun; aku malu.", prompt: "Apa tindakanmu berikutnya?", options: [
      ["Hentikan pengiriman dan hubungi teman serta penyedia pembayaran lewat kanal resmi", "Aku berhenti dan memeriksa permintaan sebelumnya.", "safe", "Kamu memutus tekanan untuk merahasiakan.", "Jika sempat mengirim dana, simpan bukti dan segera hubungi penyedia pembayaran. Pengembalian tidak pasti."],
      ["Setujui tambahan tanpa memberitahu siapa pun", "Aku meneruskan bantuan sesuai permintaan rahasia.", "risky", "Tekanan emosional memperbesar risiko.", "Permintaan tambahan dan larangan verifikasi perlu diperiksa, bukan diikuti otomatis."],
    ] },
    endings: ["Kamu tetap peduli sambil memastikan identitas lewat jalur independen.", "Kamu mencoba memverifikasi, tetapi memakai kontak yang diberikan pihak mencurigakan.", "Kamu menghentikan permintaan lanjutan dan mencari bantuan. Tindakan sebelumnya perlu ditelusuri.", "Kamu mengikuti permintaan tambahan dan kerahasiaan tanpa memastikan identitas. Semua transfer dalam cerita bersifat fiktif."],
    debriefing: { title: "Menolong tidak harus terburu-buru", summary: "Bantuan yang aman dimulai dengan memastikan siapa yang meminta. Gunakan kontak yang sudah dikenal sebelum pesan datang.", warningSigns: ["Melarang telepon atau konfirmasi.", "Memakai rekening baru.", "Meminta tambahan dan kerahasiaan."], recommendedActions: ["Gunakan nomor tersimpan atau konfirmasi langsung.", "Tunda tindakan sampai identitas jelas.", "Simpan bukti dan beri tahu pemilik akun melalui jalur lain."], reflectionQuestions: ["Kontak mana yang benar-benar independen?", "Bagaimana menolak tekanan tanpa mengabaikan teman?"], relatedMaterialIds: ["phishing", "privasi"] },
  },
  {
    id: "hadiah-palsu", title: "Hadiah yang Tidak Pernah Diikuti", description: "Pesan hadiah meminta biaya pencairan dan data pribadi.", difficulty: "Dasar",
    intro: "Kamu menerima pemberitahuan menang undian yang tidak pernah kamu ikuti. Akun pengirim menggunakan nama acara populer. Tidak ada hadiah atau pembayaran nyata.", sender: "Panitia hadiah — belum terverifikasi",
    objectives: ["Mengenali iming-iming hadiah dan biaya di muka.", "Membatasi data saat memeriksa penawaran."],
    first: { title: "Selamat, kamu menang!", message: "Kamu mendapat ponsel baru. Bayar administrasi sekarang agar hadiah tidak hangus.", prompt: "Apa respons pertamamu?", options: [
      ["Periksa pengumuman melalui kanal resmi acara yang dicari sendiri", "Aku memeriksa keberadaan undian secara mandiri.", "safe", "Kamu memeriksa dasar klaim hadiah.", "Tidak pernah ikut undian dan diminta membayar untuk hadiah merupakan tanda kuat untuk berhenti dan memeriksa."],
      ["Setujui biaya kecil karena hadiah lebih besar", "Aku bersedia membayar biaya pencairan.", "risky", "Iming-iming nilai hadiah mengaburkan biaya.", "Biaya awal dapat menjadi pintu bagi permintaan berikutnya. Besarnya hadiah tidak membuktikan penawaran sah."],
    ] },
    cautious: { title: "Pengumuman tidak ditemukan", message: "Tidak ada pengumuman undian. Pengirim menawarkan pengecekan pemenang jika kamu mengirim foto kartu identitas.", prompt: "Apa yang kamu pilih?", options: [
      ["Tolak pengiriman identitas dan laporkan akun melalui fitur layanan", "Aku tidak menyerahkan identitas untuk penawaran ini.", "safe", "Kamu membatasi penyebaran data.", "Permintaan dokumen tidak masuk akal ketika penyelenggara dan undian belum terverifikasi."],
      ["Kirim foto identitas agar panitia bisa memeriksa", "Aku mengikuti pemeriksaan identitas dari pengirim.", "risky", "Dokumen pribadi dapat disalahgunakan.", "Jangan menyerahkan data tambahan untuk membuktikan klaim pihak yang belum dipercaya."],
    ] },
    exposed: { title: "Ada biaya kedua", message: "Administrasi selesai, sekarang ada biaya pengiriman khusus. Bayar lagi hari ini agar uang pertama tidak sia-sia.", prompt: "Apa yang kamu lakukan?", options: [
      ["Berhenti membayar dan simpan bukti untuk meminta bantuan", "Aku menghentikan biaya lanjutan.", "safe", "Kamu tidak menambah risiko karena biaya sebelumnya.", "Uang yang sudah keluar bukan alasan untuk meneruskan transaksi mencurigakan. Hubungi penyedia pembayaran bila sudah membayar."],
      ["Bayar lagi supaya pembayaran pertama tidak hilang", "Aku mengikuti biaya kedua dalam simulasi.", "risky", "Biaya sebelumnya dipakai untuk menekanmu.", "Permintaan berulang dapat terus bertambah tanpa ada hadiah yang terverifikasi."],
    ] },
    endings: ["Kamu menolak biaya dan dokumen untuk hadiah yang tidak terverifikasi.", "Kamu tidak membayar, tetapi menyerahkan identitas. Kerugian penipuan tidak terbatas pada uang.", "Kamu menghentikan biaya berikutnya dan mencari bantuan terkait tindakan sebelumnya.", "Kamu mengikuti biaya berulang karena takut pembayaran pertama sia-sia. Tidak ada transaksi nyata dalam latihan."],
    debriefing: { title: "Hadiah bukan alasan melepas kendali", summary: "Periksa apakah acara benar ada, apakah kamu ikut, dan apakah persyaratannya masuk akal. Jangan bayar atau menyerahkan data karena takut kehilangan kesempatan.", warningSigns: ["Menang tanpa ikut.", "Biaya pencairan dan biaya tambahan.", "Permintaan identitas dari pihak tidak jelas."], recommendedActions: ["Periksa pengumuman resmi secara mandiri.", "Tolak biaya hadiah mencurigakan.", "Simpan bukti secara privat dan minta bantuan jika terlanjur."], reflectionQuestions: ["Mengapa biaya kecil tetap perlu diperiksa?", "Apa risiko selain kehilangan uang?"], relatedMaterialIds: ["keamanan-digital", "privasi"] },
  },
  {
    id: "lowongan-magang", title: "Tawaran Magang Instan", description: "Perekrut menjanjikan magang tanpa seleksi tetapi meminta deposit.", difficulty: "Menengah",
    intro: "Di grup belajar, kamu melihat tawaran magang dengan jadwal fleksibel dan uang saku besar. Kamu ingin mencari pengalaman. Nama perusahaan dan lowongan dalam cerita adalah fiktif.", sender: "Perekrut magang — belum terverifikasi",
    objectives: ["Memeriksa lowongan melalui sekolah dan kanal perusahaan.", "Mengenali tekanan deposit dan pengumpulan data berlebihan."],
    first: { title: "Diterima tanpa seleksi", message: "Kamu langsung diterima! Bayar deposit pelatihan sebelum sore. Tidak perlu tanya sekolah, nanti slotmu diambil.", prompt: "Apa langkah pertama yang masuk akal?", options: [
      ["Minta guru memeriksa dan cari kanal perusahaan secara mandiri", "Aku meminta pendampingan untuk mengecek lowongan.", "safe", "Kamu melibatkan pihak yang dapat membantu memverifikasi.", "Logo, surat penerimaan, dan grup ramai belum membuktikan lowongan benar."],
      ["Setujui deposit agar slot tetap tersedia", "Aku mengikuti pembayaran demi mengamankan slot.", "risky", "Kesempatan kerja berubah menjadi permintaan uang.", "Janji diterima cepat dan tekanan membayar sebelum verifikasi perlu dicurigai."],
    ] },
    cautious: { title: "Lowongan belum dikonfirmasi", message: "Guru belum mendapat konfirmasi perusahaan. Perekrut meminta foto kartu identitas keluarga dan data rekening untuk mencatat minat.", prompt: "Bagaimana kamu menanggapi?", options: [
      ["Tunda pengiriman data sampai lowongan dan kebutuhan data terverifikasi", "Aku menunggu verifikasi dan meminta penjelasan kebutuhan data.", "safe", "Minat tidak harus dibuktikan dengan dokumen sensitif.", "Tahap pendaftaran dan tujuan pengumpulan data perlu jelas serta proporsional."],
      ["Kirim dokumen keluarga agar terlihat serius", "Aku mengirim dokumen untuk menunjukkan keseriusan.", "risky", "Data orang lain ikut terpapar.", "Persetujuan keluarga dan verifikasi penerima penting; tekanan perekrut bukan dasar untuk berbagi dokumen."],
    ] },
    exposed: { title: "Deposit untuk membuka tugas", message: "Tambah deposit agar bisa mengakses tugas pertama. Uang saku besar akan menutup semua biaya ini.", prompt: "Apa pilihanmu?", options: [
      ["Hentikan pembayaran dan konsultasikan bukti dengan guru atau orang tua", "Aku berhenti dan meminta pendampingan.", "safe", "Kamu tidak meneruskan janji yang belum terbukti.", "Simpan percakapan dan bukti pembayaran. Jika sudah membayar, hubungi penyedia pembayaran lewat kanal resmi."],
      ["Tambah deposit karena uang saku dijanjikan lebih besar", "Aku mengikuti permintaan deposit tambahan.", "risky", "Janji keuntungan mendorong pembayaran berulang.", "Upah yang dijanjikan belum tentu diterima; jangan jadikan janji sebagai bukti keamanan."],
    ] },
    endings: ["Kamu mengutamakan verifikasi dan tidak menyerahkan dana atau data sebelum kebutuhan jelas.", "Kamu menunda deposit tetapi membagikan dokumen keluarga kepada penerima belum terverifikasi.", "Kamu memutus permintaan deposit lanjutan dan mengajak orang tepercaya meninjau kejadian.", "Kamu mengikuti deposit bertahap karena janji uang saku. Semua tindakan finansial di sini hanya cerita."],
    debriefing: { title: "Kesempatan baik memberi ruang untuk memeriksa", summary: "Verifikasi lowongan dan identitas perekrut sebelum memberikan dokumen atau pembayaran. Libatkan guru dan orang tua untuk keputusan magang.", warningSigns: ["Diterima tanpa proses jelas.", "Dilarang bertanya kepada sekolah.", "Deposit berulang untuk mengakses tugas."], recommendedActions: ["Cari kanal perusahaan secara mandiri.", "Minta pendampingan sekolah atau keluarga.", "Batasi dokumen sesuai kebutuhan yang sudah diverifikasi."], reflectionQuestions: ["Mengapa perekrut menghalangi verifikasi?", "Data siapa saja yang ikut berisiko saat dokumen keluarga dibagikan?"], relatedMaterialIds: ["phishing", "privasi"] },
  },
  {
    id: "kode-qr", title: "Kode QR di Poster Acara", description: "Poster mengarahkanmu ke halaman pendaftaran dengan permintaan tidak wajar.", difficulty: "Menengah",
    intro: "Sebuah poster acara kreatif ditempel di dekat tempat umum. Ada stiker QR di atas kode lama. Latihan ini memakai deskripsi teks, bukan QR yang dapat dipindai.", sender: "Halaman pendaftaran — ilustrasi",
    objectives: ["Memeriksa tujuan QR sebelum melanjutkan.", "Membedakan pendaftaran acara dari permintaan akses akun."],
    first: { title: "Pendaftaran lewat QR", message: "Scan untuk mendaftar acara gratis. Peserta wajib masuk memakai akun email utama.", prompt: "Apa yang kamu periksa?", options: [
      ["Cari pengumuman penyelenggara dan cocokkan alamat pendaftaran", "Aku memeriksa tujuan pendaftaran lewat pengumuman resmi.", "safe", "QR diperlakukan seperti tautan biasa.", "Bentuk QR tidak menunjukkan siapa pemilik alamat tujuan. Stiker pengganti layak diperiksa."],
      ["Ikuti halaman QR karena poster terlihat resmi", "Aku mempercayai halaman dari tampilan poster.", "risky", "Poster bisa mengarahkan ke halaman yang keliru.", "Tampilan cetak dan halaman yang rapi bukan bukti bahwa tujuan QR benar."],
    ] },
    cautious: { title: "Alamat pendaftaran berbeda", message: "Pengumuman resmi memakai alamat lain. Halaman QR menyatakan alamatnya adalah formulir cadangan dan meminta kata sandi email untuk sinkronisasi.", prompt: "Apa yang kamu lakukan?", options: [
      ["Gunakan jalur resmi dan beri tahu penyelenggara tentang stiker", "Aku menghindari formulir berbeda dan melaporkan temuan.", "safe", "Kamu memakai informasi yang telah dicocokkan.", "Penyelenggara dapat memeriksa poster. Jangan mengirim kata sandi email melalui formulir acara."],
      ["Isi kata sandi karena ada alasan sinkronisasi", "Aku mengikuti alasan teknis pada formulir.", "risky", "Alasan teknis tidak mengubah kerahasiaan kata sandi.", "Pendaftaran acara tidak membutuhkan kamu menyerahkan kata sandi email kepada penyelenggara."],
    ] },
    exposed: { title: "Halaman meminta persetujuan akun", message: "Setujui permintaan masuk yang muncul di akunmu agar tiket terbit. Abaikan lokasi perangkat yang berbeda.", prompt: "Apa tindakanmu?", options: [
      ["Tolak permintaan yang tidak kukenali dan amankan akun lewat aplikasi resmi", "Aku menolak persetujuan dan memeriksa keamanan akun.", "safe", "Kamu tidak memberikan akses lanjutan.", "Jika data masuk sempat diberikan, ubah melalui kanal resmi dan periksa sesi serta pengaturan pemulihan."],
      ["Setujui permintaan masuk demi mendapatkan tiket", "Aku menyetujui akses dalam cerita.", "risky", "Persetujuan dapat memberi akses pihak lain.", "Permintaan masuk yang tidak kamu mulai sendiri tidak boleh dianggap bagian pendaftaran secara otomatis."],
    ] },
    endings: ["Kamu membandingkan alamat dan melaporkan stiker yang tidak cocok.", "Kamu menemukan alamat berbeda tetapi mengikuti permintaan kata sandi dengan dalih sinkronisasi.", "Kamu menolak persetujuan masuk yang tidak dikenal. Data yang sempat diberikan tetap perlu diamankan.", "Pilihanmu membuka peluang akses pihak lain. QR dan persetujuan akun di latihan ini tidak benar-benar dijalankan."],
    debriefing: { title: "QR adalah jalan pintas, bukan tanda kepercayaan", summary: "Periksa tujuan QR dan cocokkan dengan sumber penyelenggara. Jangan biarkan kemudahan pindai menggantikan pemeriksaan sumber.", warningSigns: ["Stiker menutup kode sebelumnya.", "Alamat berbeda dari pengumuman.", "Kata sandi email dan persetujuan masuk diminta untuk tiket."], recommendedActions: ["Lihat alamat tujuan sebelum membuka atau mengisi data.", "Gunakan pengumuman penyelenggara yang dikenal.", "Tolak permintaan akses yang tidak kamu mulai."], reflectionQuestions: ["Apa yang dapat diperiksa sebelum mengisi formulir QR?", "Mengapa ikon gembok atau desain rapi tidak cukup?"], relatedMaterialIds: ["phishing", "kata-sandi"] },
  },
  {
    id: "dukungan-akun", title: "Petugas Meminta Kode OTP", description: "Akun dukungan menawarkan bantuan tetapi meminta kode dan akses perangkat.", difficulty: "Menengah",
    intro: "Kamu menulis keluhan aplikasi di media sosial. Akun yang mengaku dukungan segera mengirim pesan pribadi. Tidak ada kode atau akses perangkat nyata dalam simulasi.", sender: "Petugas dukungan — belum terverifikasi",
    objectives: ["Menjaga kode verifikasi saat meminta bantuan.", "Memeriksa kanal dukungan dan menolak akses tidak dikenal."],
    first: { title: "Bantuan datang terlalu cepat", message: "Kami bisa memperbaiki akunmu. Kirim kode OTP yang baru masuk supaya kami dapat memeriksa masalah.", prompt: "Bagaimana kamu menanggapi tawaran bantuan?", options: [
      ["Buka pusat bantuan dari aplikasi sendiri tanpa membagikan kode", "Aku memakai kanal dukungan di dalam aplikasi.", "safe", "Kamu menjaga bukti akses tetap pribadi.", "Kode verifikasi digunakan untuk proses akun; jangan membagikannya melalui percakapan dengan pihak lain."],
      ["Setujui mengirim kode karena petugas tahu keluhanku", "Aku menyetujui penyerahan kode dalam latihan.", "risky", "Mengetahui keluhan tidak membuktikan identitas.", "Informasi yang kamu unggah publik dapat dibaca siapa saja dan dipakai untuk membuat pesan meyakinkan."],
    ] },
    cautious: { title: "Diminta membagikan layar", message: "Sambil menunggu dukungan resmi, akun tadi meminta kamu memasang aplikasi kendali jarak jauh dan membagikan layar akun.", prompt: "Apa langkah selanjutnya?", options: [
      ["Tolak akses dan tunggu bantuan melalui kanal resmi", "Aku tidak memberi akses perangkat kepada akun itu.", "safe", "Kamu membatasi akses ke layar dan perangkat.", "Layar dapat menampilkan data sensitif. Jangan pasang aplikasi atau beri kendali atas arahan pihak belum terverifikasi."],
      ["Setujui akses layar karena tidak mengirim kode", "Aku memberi akses layar sebagai alternatif.", "risky", "Risiko berpindah ke akses perangkat.", "Menolak satu jenis rahasia tidak cukup bila akses layar atau kendali perangkat kemudian diberikan."],
    ] },
    exposed: { title: "Kode kedua diminta", message: "Kode pertama gagal. Kirim kode baru dan jangan ganti kata sandi sampai kami selesai.", prompt: "Apa keputusanmu?", options: [
      ["Hentikan percakapan dan periksa sesi akun lewat kanal resmi", "Aku menolak kode berikutnya dan mengamankan akun.", "safe", "Kamu memutus permintaan berulang.", "Gunakan pemulihan resmi jika akses hilang; periksa sesi, ubah kredensial yang terpapar, dan minta pendampingan orang tepercaya."],
      ["Ikuti instruksi dan setujui kode berikutnya", "Aku menyerahkan kode tambahan dalam cerita.", "risky", "Pihak lain mendapat kesempatan akses tambahan.", "Jangan mengikuti larangan mengamankan akun dari pihak yang belum terverifikasi."],
    ] },
    endings: ["Kamu menjaga kode dan akses perangkat dengan memakai pusat bantuan resmi.", "Kamu menolak kode, tetapi memberi akses layar kepada pengirim belum terverifikasi.", "Kamu menghentikan kode berikutnya dan memeriksa akun. Kode pertama yang sempat diberikan tetap menjadi alasan untuk meninjau keamanan.", "Kamu mengikuti permintaan kode berulang. Ini ilustrasi risiko; tidak ada kode dikumpulkan atau akun diubah."],
    debriefing: { title: "Bantuan tidak berarti menyerahkan akses", summary: "Informasi keluhan publik dapat dipakai untuk menyamar sebagai petugas. Masuklah ke kanal bantuan dari aplikasi yang kamu buka sendiri.", warningSigns: ["Pesan pribadi datang setelah keluhan publik.", "Kode OTP atau akses perangkat diminta.", "Dilarang mengamankan akun."], recommendedActions: ["Jangan bagikan kode lewat chat.", "Hindari kendali jarak jauh dari pihak tidak dikenal.", "Gunakan pemulihan resmi jika akses akun bermasalah."], reflectionQuestions: ["Informasi apa dari unggahanmu yang bisa dimanfaatkan?", "Apa perbedaan meminta bantuan dengan memberi kendali akun?"], relatedMaterialIds: ["kata-sandi", "privasi"] },
  },
];

export const additionalScenarios = contents.map(createBranchingScenario);
