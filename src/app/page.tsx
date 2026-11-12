import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Compass, GraduationCap, MessagesSquare, Route, ShieldCheck } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { ButtonLink } from "@/components/ui/button";
import { SimulationPreview } from "@/components/landing/simulation-preview";

export const metadata: Metadata = {
  title: "Security Awareness Simulator — Belajar Aman di Dunia Digital",
  description: "Media pembelajaran keamanan digital untuk siswa kelas X BC 1 SMK Negeri 1 Semarang. Kenali ancaman, pahami pilihan, dan pelajari langkah yang aman.",
};

const learningSteps = [
  { number: "01", icon: BookOpen, title: "Pahami dasarnya", text: "Pelajari tanda penipuan, perlindungan akun, dan kebiasaan aman di ruang digital." },
  { number: "02", icon: MessagesSquare, title: "Hadapi situasinya", text: "Kenali situasi sehari-hari melalui rancangan percakapan dan skenario interaktif." },
  { number: "03", icon: Compass, title: "Refleksikan pilihanmu", text: "Pahami alasan di balik setiap pilihan melalui konsekuensi dan debriefing yang direncanakan." },
];

export default function LandingPage() {
  return (
    <div className="public-page">
      <header className="landing-header">
        <div className="public-container landing-header-inner">
          <Brand />
          <nav className="landing-nav" aria-label="Navigasi utama"><a href="#alur">Alur belajar</a><a href="#fitur">Fitur</a><a href="#tentang">Tentang</a></nav>
          <ButtonLink href="/login" variant="secondary">Masuk <ArrowRight size={16} aria-hidden="true" /></ButtonLink>
        </div>
      </header>

      <main id="main-content">
        <section className="landing-hero public-container" aria-labelledby="hero-title">
          <div className="landing-hero-copy">
            <p className="landing-eyebrow"><span /> BELAJAR SADAR, BERSIKAP AMAN</p>
            <h1 id="hero-title">Kenali ancamannya.<br /><span>Pilih langkah<br className="landing-optional-break" /> amannya.</span></h1>
            <p className="landing-hero-description">Ruang belajar untuk memahami penipuan digital dan melatih pengambilan keputusan yang lebih aman. Dimulai dari situasi yang dekat dengan keseharianmu.</p>
            <div className="landing-hero-actions"><ButtonLink href="/login">Mulai belajar <ArrowRight size={18} aria-hidden="true" /></ButtonLink><ButtonLink href="/preview" variant="ghost">Jelajahi preview</ButtonLink></div>
            <div className="landing-school"><GraduationCap size={22} aria-hidden="true" /><div><strong>Untuk siswa kelas X BC 1</strong><span>SMK Negeri 1 Semarang</span></div></div>
          </div>
          <SimulationPreview />
        </section>

        <div className="landing-facts public-container" aria-label="Rancangan pembelajaran">
          <div><strong>08</strong><p>Skenario direncanakan<span>Situasi penipuan digital</span></p></div>
          <div><MessagesSquare size={29} aria-hidden="true" /><p>Belajar lewat percakapan<span>Hybrid chat & skenario interaktif</span></p></div>
          <div><ShieldCheck size={29} aria-hidden="true" /><p>Ruang untuk belajar<span>Kenali risiko tanpa risiko nyata</span></p></div>
        </div>

        <section id="alur" className="landing-section public-container" aria-labelledby="flow-title">
          <div className="landing-section-heading"><div><p className="landing-eyebrow">ALUR PEMBELAJARAN</p><h2 id="flow-title">Dari memahami, menjadi lebih waspada.</h2></div><p>Tiga langkah pembelajaran yang dirancang untuk membangun kebiasaan aman.</p></div>
          <div className="landing-steps">{learningSteps.map(({ number, icon: Icon, title, text }) => <article key={number} className="landing-step"><div className="landing-step-top"><Icon size={26} aria-hidden="true" /><span>{number}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div>
        </section>

        <section id="fitur" className="landing-feature-section" aria-labelledby="features-title">
          <div className="public-container landing-feature-grid">
            <div><p className="landing-eyebrow">DEKAT DENGAN DUNIA DIGITALMU</p><h2 id="features-title">Bukan sekadar tahu.<br />Belajar mengambil keputusan.</h2><p className="landing-feature-description">Pesan mencurigakan, tautan palsu, hingga permintaan data pribadi. Media ini dirancang untuk membantu mengenali pola dan mempertimbangkan tindakan.</p><Link className="landing-text-link" href="/preview">Lihat rancangan ruang belajar <ArrowRight size={17} aria-hidden="true" /></Link></div>
            <div className="landing-features">
              <article><BookOpen size={23} aria-hidden="true" /><div><h3>Materi yang terarah</h3><p>Topik keamanan digital disusun dalam bagian yang ringkas dan mudah dipahami.</p></div></article>
              <article><Route size={23} aria-hidden="true" /><div><h3>Setiap pilihan punya makna</h3><p>Rancangan skenario bercabang dengan respons, konsekuensi, dan refleksi pada akhir jalur.</p></div></article>
              <article><Check size={23} aria-hidden="true" /><div><h3>Progres untuk diri sendiri</h3><p>Pantau perjalanan belajar dan tinjau pengalaman sebelumnya, tanpa peringkat antarsiswa.</p></div></article>
            </div>
          </div>
        </section>

        <section id="tentang" className="landing-about public-container" aria-labelledby="about-title"><div className="landing-about-icon"><GraduationCap size={30} aria-hidden="true" /></div><div><p className="landing-eyebrow">TENTANG MEDIA PEMBELAJARAN</p><h2 id="about-title">Dikembangkan untuk lingkungan belajar.</h2><p>Security Awareness Simulator merupakan media pembelajaran keamanan digital berbasis web responsif untuk siswa kelas X BC 1 SMK Negeri 1 Semarang.</p><p className="landing-stage-note">Tahap 3 · Empat materi dan delapan simulasi tersedia melalui ruang siswa.</p></div></section>
      </main>

      <footer className="landing-footer"><div className="public-container landing-footer-inner"><Brand compact /><p>Media pembelajaran keamanan digital</p><Link href="/preview">Mode preview <ArrowRight size={14} aria-hidden="true" /></Link></div></footer>
    </div>
  );
}


