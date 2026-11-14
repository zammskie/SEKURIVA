import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Info, ShieldCheck } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { Badge } from "@/components/ui/badge";
import { PreviewRoleSelector } from "@/components/layout/preview-role-selector";

export const metadata: Metadata = { title: "Pilih Preview | Security Awareness Simulator" };

export default function PreviewPage() {
  return (
    <div className="preview-page">
      <header className="preview-header public-container">
        <Brand />
        <Link className="auth-back" href="/login">
          <ArrowLeft size={16} aria-hidden="true" /> Kembali ke login
        </Link>
      </header>
      <main id="main-content" className="preview-main public-container">
        <div className="preview-heading">
          <Badge tone="warning">MODE PREVIEW — DATA DEMO</Badge>
          <h1>Pilih sudut pandang peran.</h1>
          <p>
            Jelajahi antarmuka media pembelajaran dari sudut pandang Pengelola (Admin) atau Pembelajar (Siswa).<br />
            Seluruh data tersimpan secara lokal di peramban untuk keperluan pengujian frontend prototipe.
          </p>
        </div>

        <PreviewRoleSelector />

        <div className="preview-notice" style={{ marginTop: 24 }}>
          <Info size={19} aria-hidden="true" />
          <p>
            <strong>Mode demonstrasi prototipe (Tahap 8).</strong> Seluruh data identitas siswa, aktivitas simulasi, materi, dan skenario dikelola melalui mock repository lokal (localStorage). Belum terhubung dengan basis data Supabase atau Google OAuth produksi.
          </p>
        </div>
        <p className="preview-footnote">
          <ShieldCheck size={15} aria-hidden="true" /> Tahap 8 · Area Admin & Pemantauan Siswa <span>·</span> <BookOpen size={15} aria-hidden="true" /> SMK Negeri 1 Semarang
        </p>
      </main>
    </div>
  );
}
