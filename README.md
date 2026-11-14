# Security Awareness Simulator — Tahap 7

Media pembelajaran keamanan digital responsif untuk siswa kelas X BC 1 SMK Negeri 1 Semarang. Proyek ini masih berupa frontend preview dengan data lokal.

## Menjalankan proyek

Gunakan Node.js 20.9 atau lebih baru.

```sh
npm ci
npm run dev
```

Buka `http://localhost:3000/preview`, lalu pilih ruang siswa. Katalog simulasi ada di `/siswa/skenario`; progres dan riwayat ada di `/siswa/progres` dan `/siswa/riwayat`.

Untuk build produksi lokal, hentikan server development yang menggunakan folder `.next`, lalu jalankan `npm run build` dan `npm start`. Pada folder OneDrive, berkas build dapat terkunci saat kedua proses berjalan bersamaan.

## Alur simulasi

Delapan skenario resmi memiliki empat jalur masing-masing, dua keputusan pada setiap jalur, dan empat ending. Runner menyimpan langkah sesi di `localStorage` sehingga halaman dapat dimuat ulang. Setelah ending, tombol **Tampilkan Pembahasan** membuka pembahasan sesuai Run ID sesi tersebut.

Pembahasan menampilkan keputusan dan konsekuensi aktual, jalur percakapan, tanda bahaya yang muncul, tanda bahaya dari jalur lain secara terpisah, teknik manipulasi, langkah aman, dan rujukan resmi. Skenario dihitung selesai setelah pembahasan dibuka. Persentase progres hanya menunjukkan jumlah skenario unik yang selesai dari delapan, bukan skor kemampuan.

Setiap pengulangan membuat Run ID baru. Riwayat lama tetap tersedia pada browser dan pengguna demo yang sama. Data dikelola oleh repository di `src/lib/simulation-history`; payload memiliki versi skema dan divalidasi saat dibaca. Data rusak diabaikan dengan peringatan. Penyimpanan ini sementara pada perangkat/browser yang digunakan, bukan penyimpanan server atau pengamanan data produksi. Backend dan Supabase belum terhubung pada Tahap 7.

## Pemeriksaan

```sh
npm test
npm run lint
npm run typecheck
npm run build
```

Pengujian mencakup seluruh 32 jalur skenario, penyimpanan keputusan dan ending per Run ID, progres skenario unik, pemisahan pengguna demo, pengulangan, dan penanganan data lokal yang rusak.
