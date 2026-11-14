"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, Info, Layers3, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import type { StudentDashboardData } from "@/lib/types/dashboard";
import { useMaterials } from "@/lib/materials/use-materials";

export function StudentDashboard({ data }: { data: StudentDashboardData }) {
  const storedMaterials = useMaterials();
  const published = storedMaterials?.filter(material => material.status === "Published") ?? [];
  return <div className="student-dashboard dashboard-stack">
    <PageHeader eyebrow="RUANG BELAJAR · DATA DEMO" title="Selamat Datang di Security Awareness Simulator" description="Pelajari cara mengenali penipuan digital melalui simulasi percakapan, pilihan respons, dan pembahasan setelah simulasi."><Badge tone="teal">{data.name}</Badge></PageHeader>

    <div className="dashboard-learning-grid">
      <section className="dashboard-learning-hero" aria-labelledby="learning-introduction"><div className="dashboard-learning-copy"><p className="dashboard-eyebrow"><BookOpen size={14} aria-hidden="true" /> MULAI DARI PEMAHAMAN</p><h2 id="learning-introduction">Kenali tanda penipuan digital sebelum mengambil keputusan.</h2><p>Mulailah dengan materi keamanan digital, lalu jelajahi skenario yang tersedia di katalog.</p><ButtonLink href="/siswa/materi">Jelajahi Materi <ArrowRight size={16} aria-hidden="true" /></ButtonLink></div><div className="dashboard-shield-art" aria-hidden="true"><ShieldCheck /></div></section>
      <Card className="dashboard-progress-panel"><div className="dashboard-section-heading"><div><h2>Ringkasan pembelajaran</h2><p>DATA DEMO · belum ada progres tersimpan</p></div></div><div className="dashboard-learning-facts"><p><BookOpen aria-hidden="true" />Materi pembelajaran <strong>{storedMaterials === null ? "…" : published.length}</strong></p><p><Layers3 aria-hidden="true" />Skenario direncanakan <strong>{data.scenarios.length}</strong></p><p><Clock3 aria-hidden="true" />Materi dipelajari <strong>{data.progress.materialsCompleted}</strong></p><p><ShieldCheck aria-hidden="true" />Simulasi selesai <strong>{data.progress.simulationsCompleted}</strong></p></div><Link className="dashboard-text-link" href="/siswa/progres">Lihat Progres <ArrowRight aria-hidden="true" /></Link></Card>
    </div>

    <section aria-labelledby="student-materials"><div className="dashboard-section-heading"><div><h2 id="student-materials">Materi pembelajaran</h2><p>Bekal untuk memahami risiko keamanan digital.</p></div><Link className="dashboard-text-link" href="/siswa/materi">Lihat Semua Materi <ArrowRight aria-hidden="true" /></Link></div>{storedMaterials !== null && published.length === 0 ? <p className="dashboard-empty-message">Belum ada materi Published. Silakan kembali setelah Admin menerbitkan materi.</p> : <div className="dashboard-student-material-grid">{published.slice(0, 4).map(material => <article className="dashboard-student-material" key={material.id}><Badge tone="teal">{material.category}</Badge><h3>{material.title}</h3><p>{material.summary}</p><span className="dashboard-material-availability">Materi Published · DATA DEMO</span><Link className="dashboard-text-link" href={`/siswa/materi/${material.slug}`}>Lihat Materi <ArrowRight aria-hidden="true" /></Link></article>)}</div>}</section>

    <section aria-labelledby="student-scenarios"><div className="dashboard-section-heading"><div><h2 id="student-scenarios">Skenario simulasi</h2><p>{data.scenarios.length} skenario pada rencana konten utama.</p></div></div><p className="dashboard-demo-note"><Info size={15} aria-hidden="true" />Delapan skenario resmi tersedia sebagai pengantar. Percakapan lengkap sedang disiapkan.</p><ol className="dashboard-planned-scenarios">{data.scenarios.map(scenario => <li key={scenario.id}><strong>{scenario.title}</strong><span>{scenario.category} · {scenario.status}</span></li>)}</ol><Link className="dashboard-text-link" href="/siswa/skenario">Lihat Semua Skenario <ArrowRight aria-hidden="true" /></Link></section>

    <div className="dashboard-body-grid"><section className="dashboard-summary-panel" aria-labelledby="student-progress"><div className="dashboard-section-heading"><div><h2 id="student-progress">Progres belajar</h2><p>DATA DEMO</p></div></div><p className="dashboard-empty-message">Belum ada progres pembelajaran yang tersimpan. Mulailah dengan mempelajari materi keamanan digital.</p><Link className="dashboard-text-link" href="/siswa/progres">Lihat Progres <ArrowRight aria-hidden="true" /></Link></section><section className="dashboard-summary-panel" aria-labelledby="student-activity"><div className="dashboard-section-heading"><div><h2 id="student-activity">Aktivitas terakhir</h2><p>DATA DEMO</p></div></div>{data.recentActivities.length === 0 ? <p className="dashboard-empty-message">Belum ada aktivitas pembelajaran. Mulailah dengan mempelajari materi keamanan digital.</p> : <ul className="dashboard-summary-list">{data.recentActivities.map(item => <li key={item.id}><strong>{item.title}</strong><span>{item.status} · {item.timeLabel}</span></li>)}</ul>}<Link className="dashboard-text-link" href="/siswa/riwayat">Lihat Riwayat <ArrowRight aria-hidden="true" /></Link></section></div>
  </div>;
}
