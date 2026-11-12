# Security Awareness Simulator — Tahap 3

Media pembelajaran keamanan digital untuk kelas X BC 1 SMK Negeri 1 Semarang. Ruang siswa menyediakan empat materi dan delapan simulasi interaktif dengan cerita fiktif.

## Menjalankan proyek

Gunakan Node.js 20.9 atau lebih baru.

```sh
npm ci
npm run dev
```

- Materi di http://localhost:3000/siswa/materi
- Simulasi di http://localhost:3000/siswa/skenario
- Pemilihan peran di http://localhost:3000/preview

Untuk menjalankan versi produksi lokal, gunakan `npm run build` lalu `npm start`.

## Materi pembelajaran

| Modul | Topik | Isi |
| --- | --- | --- |
| Dasar Keamanan Digital | 3 | Aset digital, verifikasi, dan langkah awal setelah insiden |
| Mengenali Phishing | 4 | Penyamaran, tekanan, tautan/lampiran/QR, dan pelaporan |
| Kata Sandi & Keamanan Akun | 3 | Kredensial unik, MFA, OTP, dan pemulihan akun |
| Privasi & Data Pribadi | 3 | Paparan data, pembatasan informasi, dan berbagi bukti secara privat |

Setiap modul memiliki tujuan, penjelasan, contoh kontekstual, rangkuman, refleksi, satu cek pemahaman dengan umpan balik, serta referensi dan tautan simulasi terkait. Referensi utama berasal dari CISA dan FTC serta dicantumkan pada modul yang relevan.

## Skenario

1. Pesan dari Kurir Paket
2. Email Verifikasi Akun
3. Promo yang Terlalu Menarik
4. Teman Meminta Bantuan
5. Hadiah yang Tidak Pernah Diikuti
6. Tawaran Magang Instan
7. Kode QR di Poster Acara
8. Petugas Meminta Kode OTP

Setiap skenario menggabungkan percakapan dan adegan, memiliki empat jalur dengan dua keputusan pada setiap jalur, serta menampilkan respons dan konsekuensi tiap pilihan. Keempat ending menuju debriefing dengan tanda bahaya, tindakan aman, pertanyaan refleksi, dan tautan bacaan. Pemain dapat melihat jejak keputusan dan mengulang sesi.

Latihan dan cek pemahaman berjalan di memori halaman. Meninggalkan atau memuat ulang halaman mengakhiri sesi. Angka progres, riwayat global, dan profil di dashboard merupakan data demo. Integrasi autentikasi, database, pengelolaan konten, dan penyimpanan progres masuk Tahap 4.

## Struktur

- `src/app` — halaman publik, dashboard, katalog, dan halaman detail.
- `src/components` — shell responsif, komponen UI, pemain simulasi, dan cek pemahaman.
- `src/data/materials` — ringkasan katalog serta konten modul.
- `src/data/scenarios` — skenario acuan, tujuh skenario tambahan, dan katalog.
- `src/lib/scenario-engine` — validasi graf dan transisi sesi.
- `src/lib/types` — tipe TypeScript untuk konten dan progres.
- `src/styles` — token desain dan gaya responsif.
- `tests` — pengujian engine, keterkaitan konten, dan penelusuran seluruh jalur.

## Pemeriksaan

```sh
npm test
npm run lint
npm run typecheck
npm run build
```

Tes konten menelusuri seluruh 32 jalur dengan mesin simulasi serta memeriksa keterkaitan katalog, modul, dan debriefing. Mesin memvalidasi konten bertipe sebelum sesi berjalan. Lihat `src/lib/scenario-engine/README.md` untuk aturan graf.

Hasil Tahap 3 pada 12 November 2026: 23 tes lulus, lint dan pemeriksaan TypeScript lulus, serta build produksi berhasil. Pemeriksaan HTTP lokal mengonfirmasi 25 halaman merespons 200, semua tautan katalog tersedia, dan slug tak dikenal merespons 404. Tampilan lintas ukuran dan interaksi melalui browser belum diverifikasi secara visual.
