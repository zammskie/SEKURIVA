# Security Awareness Simulator — Tahap 2

Media pembelajaran keamanan digital untuk kelas X BC 1 SMK Negeri 1 Semarang. Fondasi Tahap 1 dilanjutkan dengan satu skenario lengkap dan mesin simulasi lokal. Target akhir tetap delapan skenario; tujuh lainnya belum diimplementasikan.

## Menjalankan

Node.js >=20.9, npm (lingkungan pengembangan Node 24.14).

```sh
npm ci
npm run dev
```

Buka http://localhost:3000/siswa/skenario lalu pilih Pesan dari Kurir Paket. Build produksi lokal: `npm run build` kemudian `npm start`.

## Teknologi dan struktur

Next.js 16.4.5 App Router, React 19.3.1, TypeScript 5.9.3 strict, Tailwind CSS 4.3.4, Lucide React 1.69.0, ESLint 9.39.5. Lockfile menyimpan versi dependency; tsx menjalankan tes TypeScript.

- src/app: landing, login, pemilihan preview, layout role, dashboard dan halaman skenario.
- src/components/ui: Button, Input, Badge, Card, PageHeader, Breadcrumb, EmptyState.
- src/components/layout: sidebar, topbar, item navigasi, drawer responsif, halaman placeholder.
- src/components/simulation: ScenarioPlayer.
- src/data/scenarios/pesan-paket.ts: satu Scenario lengkap; index.ts: tiga ringkasan katalog.
- src/lib/types: kontrak Scenario, ScenarioNode, ScenarioChoice, Consequence, Debriefing, ScenarioProgress.
- src/lib/scenario-engine: validasi graf dan transisi sesi murni.
- src/lib/repositories: adapter baca data mock untuk persiapan integrasi.
- src/styles: token dan CSS responsif untuk publik, shell, dashboard, simulasi.
- tests: pengujian engine dan graf.

## Perilaku Tahap 2

Siswa dapat memulai latihan, membaca chat/adegan, memilih tindakan, membaca respons dan konsekuensi, mengikuti cabang, mencapai ending dan membuka debriefing. Keempat jalur melalui dua keputusan. Ada jejak keputusan sesi dan konfirmasi ulangi latihan. Tidak ada leaderboard, batas waktu, atau skor penelitian.

Progres hanya berada dalam memori halaman. Refresh, keluar, atau navigasi kembali memulai sesi baru. Tidak ada localStorage, database, unduhan APK, permintaan OTP nyata, atau pesan keluar. Dashboard tetap menggunakan data fiktif terpisah; hasil latihan tidak mengubah angka dashboard. Riwayat dan progres global belum terintegrasi.

Route lengkap: /, /login, /preview, /admin, /siswa, /siswa/skenario, /siswa/skenario/pesan-paket. Placeholder: /admin/materi, /admin/skenario, /admin/pemantauan, /admin/riwayat, /siswa/materi, /siswa/progres, /siswa/riwayat.

Autentikasi Google tetap disabled. Seluruh route terbuka untuk preview, bukan kontrol akses. Supabase, CRUD, backend, penyimpanan persisten, tujuh skenario lainnya dan deployment belum dikerjakan.

## Validasi

```sh
npm test
npm run lint
npm run typecheck
npm run build
```

Validator memeriksa graf konten bertipe, bukan JSON eksternal. Data dari backend/editor kelak membutuhkan parsing schema tersendiri. Lihat src/lib/scenario-engine/README.md untuk invariant dan perilaku engine.

Tampilan memiliki breakpoint smartphone/tablet/desktop. Browser preview sebelumnya timeout; screenshot dan verifikasi visual 1440/1366/768/390/360px belum tersedia. Pengujian otomatis engine tidak menggantikan pemeriksaan interaksi di browser.

## Dasar materi dan batas interpretasi

Skenario fiktif disusun untuk latihan, bukan klaim bahwa setiap lampiran pasti menginfeksi perangkat. Prinsip mengenali lampiran mencurigakan dan memeriksa klaim melalui kanal yang dikenal mengacu pada:
- CISA, Phishing: https://www.cisa.gov/sites/default/files/2024-02/Update%20to%20Phishing%20General%20Security%20Postcard_01.01.2024.pdf
- FTC, How To Recognize and Avoid Phishing Scams: https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams

Tinjau bahasa dan tujuan pembelajaran bersama guru sebelum memperluas konten. Berikutnya: review satu skenario ini, perluas materi dan skenario, lalu rancang integrasi autentikasi serta penyimpanan sesuai kebutuhan proposal.

## Hasil pemeriksaan — 12 November 2026

- npm run lint: lulus tanpa warning.
- npm run typecheck: lulus.
- npm test: 13 tes lulus, termasuk seluruh empat jalur ke debriefing.
- npm run build: lulus; 14 route aplikasi tersedia.
- HTTP smoke check: seluruh 14 route mengembalikan 200.
- Browser bawaan kembali timeout saat membuka latihan lokal. Interaksi UI dan tampilan lintas ukuran belum terverifikasi secara visual; tidak ada screenshot yang diklaim.

