import { ArrowLeft } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return <main id="main-content" className="not-found"><Brand /><p className="eyebrow">404 · HALAMAN TIDAK DITEMUKAN</p><h1>Sepertinya Anda salah alamat.</h1><p>Kembali ke halaman awal untuk menjelajahi media pembelajaran.</p><ButtonLink href="/"><ArrowLeft size={18} />Ke halaman awal</ButtonLink></main>;
}
