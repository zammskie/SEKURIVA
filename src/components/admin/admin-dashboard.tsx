"use client";

import Link from "next/link";
import { Activity, ArrowRight, BookOpen, ClipboardList, Layers3, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import type { AdminDashboardData } from "@/lib/types/dashboard";
import { useMaterials } from "@/lib/materials/use-materials";

const actions = [
  { label: "Manajemen Materi", href: "/admin/materi" },
  { label: "Manajemen Skenario", href: "/admin/skenario" },
  { label: "Pemantauan Progres", href: "/admin/pemantauan" },
  { label: "Riwayat Simulasi", href: "/admin/riwayat" },
] as const;

export function AdminDashboard({ data }: { data: AdminDashboardData }) {
  const storedMaterials = useMaterials();
  const materialList = storedMaterials ?? [];
  const metrics = [
    { label: "Total Materi", value: storedMaterials === null ? "…" : materialList.length, note: "Materi pada katalog lokal", icon: BookOpen },
    { label: "Total Skenario", value: data.scenarios.length, note: "Rencana konten utama", icon: Layers3 },
    { label: "Aktivitas Simulasi", value: data.recentActivities.length, note: "Catatan demo tersedia", icon: Activity },
    { label: "Progres Siswa", value: `${data.progress.studentsStarted}/${data.progress.studentCount}`, note: "Profil demo mulai belajar", icon: UsersRound },
  ];

  return <div className="admin-dashboard dashboard-stack">
    <PageHeader eyebrow="RUANG ADMIN · DATA DEMO" title="Dashboard Admin" description="Ringkasan pengelolaan media pembelajaran Security Awareness Simulator."><Badge tone="teal">MODE PREVIEW — DATA DEMO</Badge></PageHeader>

    <section className="dashboard-metric-strip" aria-label="Ringkasan data demo">
      {metrics.map(({ label, value, note, icon: Icon }) => <div className="dashboard-metric" key={label}><p className="dashboard-metric-label"><Icon aria-hidden="true" />{label}</p><div className="dashboard-metric-value">{value}</div><p className="dashboard-metric-note">{note} · DATA DEMO</p></div>)}
    </section>

    <div className="dashboard-body-grid">
      <Card className="dashboard-admin-overview">
        <div className="dashboard-section-heading"><div><h2>Ringkasan progres</h2><p>{data.progress.studentCount} profil siswa fiktif pada data demo.</p></div><Badge tone="neutral">DATA DEMO</Badge></div>
        <p className="dashboard-overview-number">{data.progress.studentsStarted}<small> / {data.progress.studentCount}</small></p>
        <p className="dashboard-panel-footnote">Profil yang memulai pembelajaran. Belum ada aktivitas yang tersimpan, sehingga tidak ada persentase hasil belajar.</p>
        <Link className="dashboard-text-link" href="/admin/pemantauan">Lihat Pemantauan <ArrowRight aria-hidden="true" /></Link>
      </Card>
      <section className="dashboard-activity-panel" aria-labelledby="admin-activity">
        <div className="dashboard-section-heading"><div><h2 id="admin-activity">Aktivitas terbaru</h2><p>Riwayat simulasi · DATA DEMO</p></div></div>
        {data.recentActivities.length === 0 ? <p className="dashboard-empty-message">Belum ada aktivitas simulasi pada data demo. Riwayat akan muncul setelah pencatatan tersedia.</p> : <ol className="dashboard-activity-list">{data.recentActivities.map(item => <li key={item.id}><div><h3>{item.studentName} · {item.title}</h3><p>{item.status} · {item.timeLabel}</p></div></li>)}</ol>}
        <Link className="dashboard-text-link" href="/admin/riwayat">Lihat Semua Riwayat <ArrowRight aria-hidden="true" /></Link>
      </section>
    </div>

    <div className="dashboard-body-grid">
      <section className="dashboard-summary-panel" aria-labelledby="admin-materials">
        <div className="dashboard-section-heading"><div><h2 id="admin-materials">Pengelolaan materi</h2><p>{storedMaterials === null ? "Memuat materi" : `${materialList.length} materi pada browser ini`} · DATA DEMO</p></div></div>
        <ul className="dashboard-summary-list">{materialList.slice(0, 5).map(material => <li key={material.id}><div><strong>{material.title}</strong><small>{material.category}</small></div><Badge tone={material.status === "Published" ? "success" : "neutral"}>{material.status}</Badge></li>)}</ul>
        <Link className="dashboard-text-link" href="/admin/materi">Kelola Materi <ArrowRight aria-hidden="true" /></Link>
      </section>
      <section className="dashboard-summary-panel" aria-labelledby="admin-scenarios">
        <div className="dashboard-section-heading"><div><h2 id="admin-scenarios">Pengelolaan skenario</h2><p>{data.scenarios.length} skenario dalam rencana konten · DATA DEMO</p></div></div>
        <ol className="dashboard-summary-list dashboard-numbered-list">{data.scenarios.map(scenario => <li key={scenario.id}><div><strong>{scenario.title}</strong><small>{scenario.category}</small></div><Badge tone="neutral">{scenario.status}</Badge></li>)}</ol>
        <Link className="dashboard-text-link" href="/admin/skenario">Kelola Skenario <ArrowRight aria-hidden="true" /></Link>
      </section>
    </div>

    <section className="dashboard-quick-actions" aria-labelledby="admin-actions"><div className="dashboard-section-heading"><div><h2 id="admin-actions">Akses cepat</h2><p>Buka halaman pengelolaan dan pemantauan.</p></div><ClipboardList aria-hidden="true" /></div><div className="dashboard-actions-grid">{actions.map(action => <Link href={action.href} key={action.href}>{action.label}<ArrowRight aria-hidden="true" /></Link>)}</div></section>
  </div>;
}
