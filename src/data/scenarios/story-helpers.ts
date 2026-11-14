import type { RiskLevel, ScenarioReference, ScenarioSpeaker } from "@/lib/scenario-engine/foundation-types";
import type { StoryChoice, StoryEnding, StoryMessage } from "./authoring";

export const message = (speaker: ScenarioSpeaker, content: string): StoryMessage => ({ speaker, content });
export const choice = (label: string, response: string, title: string, description: string, riskLevel: RiskLevel, reflection: string, saferAction: string): StoryChoice => ({ label, response, consequence: { title, description, riskLevel }, reflection, saferAction });
export const ending = (title: string, content: string, analysis: string): StoryEnding => ({ title, content, analysis });

export const references: Record<"ojkBooklet" | "ojkSatgas" | "ojkIasc" | "biQris" | "biModule" | "komdigiApk", ScenarioReference> = {
  ojkBooklet: { title: "OJK — Booklet Waspada Penipuan (Scam)", url: "https://ojk.go.id/id/berita-dan-kegiatan/info-terkini/Pages/Booklet-Waspada-Penipuan-Scam-OJK.aspx", scope: "Kewaspadaan terhadap modus penipuan dan langkah saat menemukan scam." },
  ojkSatgas: { title: "OJK — Satgas PASTI: aktivitas keuangan ilegal", url: "https://ojk.go.id/id/berita-dan-kegiatan/info-terkini/Pages/Satgas-PASTI-Hentikan-Kegiatan-16-Entitas-yang-Diduga-Lakukan-Aktivitas-Keuangan-Ilegal.aspx", scope: "Contoh tugas berdeposit, investasi ilegal, dan pencatutan identitas." },
  ojkIasc: { title: "OJK — Penanganan penipuan transaksi keuangan dan IASC", url: "https://ojk.go.id/id/berita-dan-kegiatan/info-terkini/Pages/Satgas-PASTI-Terima-25-Ribu-Pengaduan-Aktivitas-Keuangan-Ilegal-dan-IASC-Berhasil-Blokir-Dana-Terkait-Scam-Rp-724-Miliar.aspx", scope: "Kanal dan proses penanganan laporan penipuan transaksi keuangan; tidak menjamin dana kembali." },
  biQris: { title: "Bank Indonesia — Panduan QRIS", url: "https://www.bi.go.id/id/fungsi-utama/sistem-pembayaran/ritel/kanal-layanan/qris/default.aspx", scope: "Cara kerja dan penggunaan QRIS melalui aplikasi pembayaran resmi." },
  biModule: { title: "Bank Indonesia — Modul Edukasi Transaksi Keuangan Digital", url: "https://www.bi.go.id/id/edukasi/Documents/Buku-Panduan-Modul-Edukasi-Keuangan-Digital-Tingkat-Dasar-Modul-3-Transaksi-Keuangan.pdf", scope: "Memeriksa nama merchant dan keamanan transaksi digital." },
  komdigiApk: { title: "Komdigi — Peringatan dokumen APK palsu melalui WhatsApp", url: "https://www.komdigi.go.id/berita/berita-hoaks/detail/hoaks-pesan-whatsapp-surat-panggilan-polda-metro-jaya", scope: "Berkas APK yang menyamar sebagai dokumen, termasuk undangan dan resi." },
};
