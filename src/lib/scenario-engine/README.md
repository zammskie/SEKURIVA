# Scenario engine — Tahap 2

`validate.ts` memeriksa konten Scenario bertipe sebelum dijalankan: ID unik, tujuan valid, pilihan dan umpan balik terisi, node terjangkau, tidak ada siklus, minimal dua keputusan pada SETIAP jalur, ending menuju debriefing dan isi debriefing lengkap. Ini bukan parser JSON tidak tepercaya. Integrasi editor atau backend perlu schema validation sebelum graph validation.

`engine.ts` menyediakan fungsi murni startScenario dan advanceScenario. Keputusan hanya dapat dilewati dengan ID pilihan valid. Progres lengkap dicatat ketika debriefing dibuka. Data skenario tidak dimutasi.

ScenarioPlayer memakai reducer dengan pilihan terkunci sampai umpan balik dibaca dan tombol lanjut ditekan. Guard node mencegah klik lanjut berulang melewati node baru. State hanya di memori komponen; refresh/navigasi keluar mereset sesi. Dashboard, halaman progres, dan riwayat global tetap demo/placeholder.

Tes: `npm test` mencakup empat jalur lengkap, reset, pilihan invalid, ID duplikat, siklus, node tidak terjangkau, referensi hilang, jalur pendek, ending/debriefing dan teks kosong.
