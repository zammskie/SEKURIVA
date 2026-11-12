import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, LockKeyhole, ShieldCheck } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Login | Security Awareness Simulator" };

export default function LoginPage() {
  return (
    <main className="auth-page" id="main-content">
      <aside className="auth-story">
        <Brand inverse />
        <div className="auth-story-content"><div className="auth-shield"><ShieldCheck size={54} strokeWidth={1.5} aria-hidden="true" /></div><p className="landing-eyebrow">RUANG BELAJAR KEAMANAN DIGITAL</p><h1>Lebih sadar.<br />Lebih siap.<br /><span>Lebih aman.</span></h1><p>Belajar mengenali ancaman digital dimulai dari memahami pilihan yang kita buat.</p></div>
        <div className="auth-school"><BookOpen size={19} aria-hidden="true" /><span>Kelas X BC 1 · SMK Negeri 1 Semarang</span></div>
      </aside>
      <section className="auth-main" aria-labelledby="login-title">
        <Link className="auth-back" href="/"><ArrowLeft size={17} aria-hidden="true" /> Kembali ke halaman utama</Link>
        <div className="auth-form">
          <Badge tone="teal">FRONTEND PREVIEW</Badge>
          <h2 id="login-title">Login</h2>
          <p className="auth-intro">Masuk ke ruang belajar<br />Security Awareness Simulator.</p>
          <Button className="auth-google" variant="secondary" disabled aria-describedby="google-status"><span className="auth-google-letter" aria-hidden="true">G</span> Masuk dengan Google</Button>
          <p className="auth-google-status" id="google-status"><LockKeyhole size={16} aria-hidden="true" /><span>Autentikasi Google belum dihubungkan. Tombol login belum tersedia pada tahap ini.</span></p>
          <div className="auth-divider"><span>Jelajahi tampilan aplikasi</span></div>
          <ButtonLink className="auth-preview-button" href="/preview">Masuk ke mode preview <ArrowRight size={18} aria-hidden="true" /></ButtonLink>
          <p className="auth-preview-note">Tidak memerlukan akun. Menggunakan data demo untuk memeriksa antarmuka dan navigasi.</p>
        </div>
        <p className="auth-bottom-note">Tahap 2 · Latihan lokal</p>
      </section>
    </main>
  );
}

