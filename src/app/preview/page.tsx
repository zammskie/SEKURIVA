import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Check, GraduationCap, Info, LayoutDashboard, ShieldCheck } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Pilih Preview | Security Awareness Simulator" };

export default function PreviewPage() {
  return (
    <div className="preview-page">
      <header className="preview-header public-container"><Brand /><Link className="auth-back" href="/login"><ArrowLeft size={16} aria-hidden="true" /> Kembali ke login</Link></header>
      <main id="main-content" className="preview-main public-container">
        <div className="preview-heading"><Badge tone="warning">MODE PREVIEW — DATA DEMO</Badge><h1>Pilih sudut pandangmu.</h1><p>Jelajahi rancangan ruang belajar dari sisi pengelola atau siswa.<br />Tidak perlu masuk dengan akun.</p></div>
        <div className="preview-role-grid">
          <Link href="/admin" className="preview-role-card"><div className="preview-role-top"><div className="preview-role-icon"><LayoutDashboard size={28} aria-hidden="true" /></div><span>PENGELOLA</span></div><h2>Preview sebagai Admin</h2><p>Lihat gambaran pengelolaan media dan pemantauan aktivitas pembelajaran.</p><ul><li><Check size={16} aria-hidden="true" /> Dashboard ringkasan demo</li><li><Check size={16} aria-hidden="true" /> Navigasi materi dan skenario</li><li><Check size={16} aria-hidden="true" /> Rancangan pemantauan progres</li></ul><div className="preview-role-action">Buka dashboard admin <ArrowRight size={19} aria-hidden="true" /></div></Link>
          <Link href="/siswa" className="preview-role-card preview-role-student"><div className="preview-role-top"><div className="preview-role-icon"><GraduationCap size={29} aria-hidden="true" /></div><span>PEMBELAJAR</span></div><h2>Preview sebagai Siswa</h2><p>Kenali ruang belajar, pilihan topik, dan gambaran perjalanan pembelajaran.</p><ul><li><Check size={16} aria-hidden="true" /> Beranda belajar siswa</li><li><Check size={16} aria-hidden="true" /> Katalog materi dan skenario demo</li><li><Check size={16} aria-hidden="true" /> Ringkasan progres ilustrasi</li></ul><div className="preview-role-action">Buka beranda siswa <ArrowRight size={19} aria-hidden="true" /></div></Link>
        </div>
        <div className="preview-notice"><Info size={19} aria-hidden="true" /><p><strong>Preview untuk meninjau antarmuka.</strong> Semua identitas, aktivitas, dan progres adalah data ilustrasi, bukan data siswa atau hasil penelitian. Pilihan peran ini bukan autentikasi; latihan lokal tersedia pada halaman skenario siswa, dengan progres sementara yang hilang saat halaman ditinggalkan.</p></div>
        <p className="preview-footnote"><ShieldCheck size={15} aria-hidden="true" /> Tahap 2 · Latihan lokal <span>·</span> <BookOpen size={15} aria-hidden="true" /> SMK Negeri 1 Semarang</p>
      </main>
    </div>
  );
}

