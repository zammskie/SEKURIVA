"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers3,
  Plus,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useMaterials } from "@/lib/materials/use-materials";
import { useScenarios } from "@/lib/scenario-engine/use-scenarios";
import { useAllSimulationRuns } from "@/lib/simulation-history/use-simulation-history";
import { DEMO_STUDENTS } from "@/lib/auth/demo-users";
import { getRecentActivities } from "@/lib/repositories/admin-activity";
import { formatSimulationDate } from "@/lib/simulation-history/display";

export function AdminDashboard() {
  const materials = useMaterials();
  const { scenarios } = useScenarios();
  const { runs } = useAllSimulationRuns();

  const materialList = useMemo(() => materials ?? [], [materials]);
  const scenarioList = useMemo(() => scenarios ?? [], [scenarios]);
  const runList = useMemo(() => runs ?? [], [runs]);

  // Metrics
  const totalMaterials = materialList.length;
  const publishedMaterials = materialList.filter(m => m.status === "Published").length;
  const totalScenarios = scenarioList.length;
  const activeScenarios = scenarioList.filter(s => s.status === "published" || s.status === "ready").length;
  const totalStudents = DEMO_STUDENTS.length;

  const completedRuns = runList.filter(r => r.status === "completed").length;
  const inProgressRuns = runList.filter(r => r.status === "in_progress" || r.status === "awaiting_debriefing").length;

  // Students who have started at least one
  const studentsStartedCount = useMemo(() => {
    const studentIdsWithRuns = new Set(runList.map(r => r.userId));
    return DEMO_STUDENTS.filter(s => studentIdsWithRuns.has(s.id)).length;
  }, [runList]);

  // Students who have completed at least one scenario
  const studentsCompletedCount = useMemo(() => {
    const studentIdsCompleted = new Set(runList.filter(r => r.status === "completed").map(r => r.userId));
    return DEMO_STUDENTS.filter(s => studentIdsCompleted.has(s.id)).length;
  }, [runList]);

  // Recent activities combining admin activities + simulation runs
  const combinedActivities = useMemo(() => {
    const adminEvents = getRecentActivities(6).map(ev => ({
      id: ev.id,
      title: ev.title,
      description: ev.description,
      time: ev.timestamp,
      badge: ev.badgeTone ?? "neutral",
      type: "admin",
    }));

    const runEvents = runList.slice(0, 6).map(run => {
      const student = DEMO_STUDENTS.find(s => s.id === run.userId);
      const studentName = student ? student.name : "Siswa Demo";
      const isComplete = run.status === "completed";
      return {
        id: run.id,
        title: isComplete ? "Simulasi Selesai & Debriefing" : "Sesi Simulasi Berjalan",
        description: `${studentName} — "${run.scenarioTitleSnapshot}"`,
        time: run.updatedAt,
        badge: isComplete ? ("success" as const) : ("warning" as const),
        type: "simulation",
      };
    });

    return [...adminEvents, ...runEvents]
      .sort((a, b) => b.time.localeCompare(a.time))
      .slice(0, 6);
  }, [runList]);

  return (
    <div className="admin-dashboard dashboard-stack">
      <PageHeader
        eyebrow="RUANG ADMIN · PENGELOLA MEDIA"
        title="Dashboard Admin"
        description="Pusat pengelolaan materi keamanan digital, skenario simulasi, dan pemantauan perkembangan belajar siswa kelas X BC 1."
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/admin/materi/tambah" className="button button-secondary">
            <Plus size={16} aria-hidden="true" /> Tambah Materi
          </Link>
          <Link href="/admin/skenario/tambah" className="button button-primary">
            <Plus size={16} aria-hidden="true" /> Tambah Skenario
          </Link>
        </div>
      </PageHeader>

      <div className="admin-alert-banner info">
        <div>
          <strong>MODE PREVIEW ADMIN (TAHAP 8)</strong> — Seluruh angka statistik dan data aktivitas dihitung langsung dari repository lokal (localStorage). Belum terhubung dengan Supabase produksi.
        </div>
        <Badge tone="teal">Data Demonstrasi</Badge>
      </div>

      {/* 6 Metric Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <BookOpen size={16} />
            <span>Total Materi</span>
          </div>
          <div className="admin-stat-value">{materials === null ? "…" : totalMaterials}</div>
          <div className="admin-stat-sub">{publishedMaterials} materi berstatus Published</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <Layers3 size={16} />
            <span>Total Skenario</span>
          </div>
          <div className="admin-stat-value">{scenarios === null ? "…" : totalScenarios}</div>
          <div className="admin-stat-sub">Target 8 skenario kurikulum</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <ShieldCheck size={16} />
            <span>Skenario Aktif</span>
          </div>
          <div className="admin-stat-value">{scenarios === null ? "…" : activeScenarios}</div>
          <div className="admin-stat-sub">Dapat dimainkan oleh siswa</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <UsersRound size={16} />
            <span>Total Siswa Demo</span>
          </div>
          <div className="admin-stat-value">{totalStudents}</div>
          <div className="admin-stat-sub">{studentsStartedCount} siswa telah mulai belajar</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <CheckCircle2 size={16} />
            <span>Penyelesaian Sesi</span>
          </div>
          <div className="admin-stat-value">{runs === null ? "…" : completedRuns}</div>
          <div className="admin-stat-sub">Mencapai ending & debriefing</div>
        </div>
      </div>

      {/* Overview & Quick Actions */}
      <div className="dashboard-body-grid">
        <Card className="dashboard-admin-overview">
          <div className="dashboard-section-heading">
            <div>
              <h2>Ringkasan Pemantauan Siswa</h2>
              <p>Perkembangan penyelesaian simulasi oleh siswa kelas X BC 1</p>
            </div>
            <Badge tone="neutral">DATA DEMO</Badge>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "14px 0" }}>
            <span style={{ fontSize: 36, fontWeight: 700, color: "var(--color-primary)" }}>
              {studentsCompletedCount}
            </span>
            <span style={{ color: "var(--color-muted)", fontSize: 14 }}>
              dari {totalStudents} profil siswa demo telah menyelesaikan minimal 1 skenario
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
            <div style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "var(--color-muted)" }}>Sesi Selesai</div>
              <strong style={{ fontSize: 18, color: "var(--color-primary)" }}>{completedRuns} sesi</strong>
            </div>
            <div style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "var(--color-muted)" }}>Sesi Berlangsung</div>
              <strong style={{ fontSize: 18, color: "#855b16" }}>{inProgressRuns} sesi</strong>
            </div>
          </div>
          <Link className="dashboard-text-link" href="/admin/pemantauan">
            Buka Halaman Pemantauan Siswa <ArrowRight aria-hidden="true" />
          </Link>
        </Card>

        {/* Recent Activity */}
        <section className="dashboard-activity-panel" aria-labelledby="admin-activity">
          <div className="dashboard-section-heading">
            <div>
              <h2 id="admin-activity">Aktivitas Terbaru</h2>
              <p>Catatan tindakan admin dan penyelesaian simulasi</p>
            </div>
            <Activity size={18} style={{ color: "var(--color-accent)" }} />
          </div>
          {combinedActivities.length === 0 ? (
            <p className="dashboard-empty-message">
              Belum ada aktivitas tercatat pada data demo. Mulai dengan membuat materi atau memainkan simulasi.
            </p>
          ) : (
            <ol className="dashboard-activity-list">
              {combinedActivities.map(item => (
                <li key={item.id}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <Badge tone={item.badge as "neutral" | "teal" | "success" | "warning" | "danger"}>
                        {item.type === "admin" ? "Admin" : "Siswa"}
                      </Badge>
                      <h3 style={{ margin: 0 }}>{item.title}</h3>
                    </div>
                    <p style={{ margin: 0, fontSize: 12 }}>{item.description}</p>
                    <span className="dashboard-activity-time">
                      <Clock size={11} style={{ display: "inline", marginRight: 4 }} />
                      {formatSimulationDate(item.time)}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          )}
          <Link className="dashboard-text-link" href="/admin/riwayat">
            Lihat Semua Riwayat Simulasi <ArrowRight aria-hidden="true" />
          </Link>
        </section>
      </div>

      {/* Materials & Scenarios Summary */}
      <div className="dashboard-body-grid">
        <section className="dashboard-summary-panel" aria-labelledby="admin-materials">
          <div className="dashboard-section-heading">
            <div>
              <h2 id="admin-materials">Pengelolaan Materi</h2>
              <p>{totalMaterials} materi terdaftar di penyimpanan lokal</p>
            </div>
            <Link className="admin-btn-sm admin-btn-outline" href="/admin/materi/tambah">
              <Plus size={14} /> Tambah
            </Link>
          </div>
          <ul className="dashboard-summary-list">
            {materialList.slice(0, 5).map(material => (
              <li key={material.id}>
                <div>
                  <strong>{material.title}</strong>
                  <small>{material.category}</small>
                </div>
                <Badge tone={material.status === "Published" ? "success" : material.status === "Archived" ? "neutral" : "warning"}>
                  {material.status}
                </Badge>
              </li>
            ))}
          </ul>
          <Link className="dashboard-text-link" href="/admin/materi">
            Kelola Seluruh Materi ({totalMaterials}) <ArrowRight aria-hidden="true" />
          </Link>
        </section>

        <section className="dashboard-summary-panel" aria-labelledby="admin-scenarios">
          <div className="dashboard-section-heading">
            <div>
              <h2 id="admin-scenarios">Pengelolaan Skenario</h2>
              <p>{totalScenarios} skenario simulasi penipuan digital</p>
            </div>
            <Link className="admin-btn-sm admin-btn-outline" href="/admin/skenario/tambah">
              <Plus size={14} /> Tambah
            </Link>
          </div>
          <ol className="dashboard-summary-list dashboard-numbered-list">
            {scenarioList.slice(0, 5).map(scenario => (
              <li key={scenario.id}>
                <div>
                  <strong>{scenario.title}</strong>
                  <small>{scenario.category} · {scenario.nodes?.length ?? 0} node</small>
                </div>
                <Badge tone={scenario.status === "published" || scenario.status === "ready" ? "success" : scenario.status === "archived" ? "neutral" : "warning"}>
                  {scenario.status === "ready" ? "published" : scenario.status}
                </Badge>
              </li>
            ))}
          </ol>
          <Link className="dashboard-text-link" href="/admin/skenario">
            Kelola Seluruh Skenario ({totalScenarios}) <ArrowRight aria-hidden="true" />
          </Link>
        </section>
      </div>

      {/* Quick Action Navigation Grid */}
      <section className="dashboard-quick-actions" aria-labelledby="admin-actions">
        <div className="dashboard-section-heading">
          <div>
            <h2 id="admin-actions">Akses Cepat Pengelolaan & Pemantauan</h2>
            <p>Jelajahi seluruh fitur administrasi media pembelajaran</p>
          </div>
        </div>
        <div className="dashboard-actions-grid">
          <Link href="/admin/materi">
            Manajemen Materi
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link href="/admin/skenario">
            Manajemen Skenario
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link href="/admin/pemantauan">
            Pemantauan Progres Siswa
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link href="/admin/riwayat">
            Riwayat Seluruh Simulasi
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
