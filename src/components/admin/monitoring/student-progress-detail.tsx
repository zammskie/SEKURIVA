"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Layers3,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import { findDemoUser } from "@/lib/auth/demo-users";
import { useSimulationHistory } from "@/lib/simulation-history/use-simulation-history";
import { calculateSimulationProgress } from "@/lib/simulation-history/progress";
import { scenarioCatalog } from "@/data/scenarios/catalog";
import { formatSimulationDate, simulationDuration, simulationStatus } from "@/lib/simulation-history/display";

export function StudentProgressDetail() {
  const params = useParams<{ studentId: string }>();
  const student = findDemoUser(params.studentId);
  const { snapshot } = useSimulationHistory(params.studentId);

  const runs = useMemo(() => snapshot?.records ?? [], [snapshot?.records]);
  const progress = useMemo(() => calculateSimulationProgress(runs), [runs]);

  if (!student) {
    return (
      <div className="material-empty">
        <h2>Siswa tidak ditemukan.</h2>
        <p>Profil siswa dengan ID &quot;{params.studentId}&quot; tidak ditemukan pada data demo.</p>
        <Link className="dashboard-text-link" href="/admin/pemantauan">
          Kembali ke daftar pemantauan
        </Link>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Dashboard Admin", href: "/admin" },
          { label: "Pemantauan Progres", href: "/admin/pemantauan" },
          { label: student.name },
        ]}
      />

      <PageHeader
        eyebrow={`PROFIL SISWA · ${student.className ?? "KELAS X BC 1"}`}
        title={`Progres Belajar: ${student.name}`}
        description={`Pemantauan aktivitas pembelajaran mandiri, pencapaian skenario penipuan digital, dan riwayat keputusan ${student.name}.`}
      >
        <Link className="button button-secondary" href="/admin/pemantauan">
          <ArrowLeft size={16} /> Kembali ke Daftar Siswa
        </Link>
      </PageHeader>

      <div className="admin-alert-banner info">
        <div>
          <strong>DATA DEMONSTRASI (TAHAP 8)</strong> — Rekaman sesi dan capaian di bawah bersumber dari penyimpanan riwayat peramban (localStorage) khusus siswa ini.
        </div>
        <Badge tone="teal">{student.badgeLabel}</Badge>
      </div>

      {/* Student Identity Card */}
      <section className="admin-card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ display: "grid", placeItems: "center", width: 48, height: 48, borderRadius: "50%", background: "#e8f3f1", color: "#176e64", fontWeight: 700, fontSize: 16 }}>
            {student.avatarInitials}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h2 style={{ margin: 0, fontSize: 18, color: "var(--color-primary)" }}>{student.name}</h2>
            <div style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 2 }}>
              Email: <code>{student.email}</code> · Peran: {student.roleLabel} · ID: <code>{student.id}</code>
            </div>
          </div>
          <Badge tone="neutral">SMK Negeri 1 Semarang</Badge>
        </div>
      </section>

      {/* Progress Metrics Overview */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <Layers3 size={16} />
            <span>Total Skenario</span>
          </div>
          <div className="admin-stat-value">{progress.total}</div>
          <div className="admin-stat-sub">Katalog kurikulum</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <CheckCircle2 size={16} />
            <span>Selesai Debriefing</span>
          </div>
          <div className="admin-stat-value" style={{ color: "#21865b" }}>{progress.completed}</div>
          <div className="admin-stat-sub">Selesai hingga pembahasan</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <Clock size={16} />
            <span>Sedang Berjalan</span>
          </div>
          <div className="admin-stat-value" style={{ color: "#d99a32" }}>{progress.inProgress}</div>
          <div className="admin-stat-sub">Sesi aktif atau tunda</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <BookOpen size={16} />
            <span>Belum Dimulai</span>
          </div>
          <div className="admin-stat-value">{progress.notStarted}</div>
          <div className="admin-stat-sub">Belum ada sesi</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <ShieldCheck size={16} />
            <span>Penyelesaian Aktivitas</span>
          </div>
          <div className="admin-stat-value">{progress.percentage}%</div>
          <div className="admin-stat-sub">Persentase aktivitas belajar</div>
        </div>
      </div>

      {/* Progress Bar with Disclaimer */}
      <section className="admin-card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, margin: "0 0 6px" }}>Indikator Penyelesaian Skenario</h3>
        <div className="progress-meter-container">
          <div className="progress-meter-bar">
            <div className="progress-meter-fill" style={{ width: `${progress.percentage}%` }} />
          </div>
        </div>
        <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--color-muted)", lineHeight: 1.5 }}>
          Catatan: Persentase di atas hanya menunjukkan penyelesaian aktivitas pembelajaran simulasi, bukan ukuran tingkat kesadaran atau kemampuan keamanan digital siswa.
        </p>
      </section>

      {/* 8 Scenarios Status Grid */}
      <section className="admin-card" style={{ marginBottom: 24 }}>
        <h2>Status per Skenario Simulasi</h2>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Skenario</th>
                <th>Kategori</th>
                <th>Status Pembelajaran</th>
                <th>Aktivitas Terakhir</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {progress.items.map((item, index) => {
                const scenario = scenarioCatalog.find(s => s.id === item.scenarioId);
                const title = scenario?.title ?? item.scenarioId;
                const category = scenario?.category ?? "—";
                const activeRunId = item.completedRunId || item.awaitingDebriefingRunId || item.latestRunId;

                return (
                  <tr key={item.scenarioId}>
                    <td style={{ fontWeight: 700, color: "var(--color-muted)" }}>
                      {String(index + 1).padStart(2, "0")}
                    </td>
                    <td>
                      <strong>{title}</strong>
                      <div style={{ fontSize: 11, color: "var(--color-muted)" }}>
                        ID: <code>{item.scenarioId}</code>
                      </div>
                    </td>
                    <td><Badge tone="teal">{category}</Badge></td>
                    <td>
                      <Badge tone={item.status === "Selesai" ? "success" : item.status === "Sedang Berlangsung" ? "warning" : "neutral"}>
                        {item.status}
                      </Badge>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--color-muted)" }}>
                      {formatSimulationDate(item.lastActivityAt)}
                    </td>
                    <td>
                      {activeRunId ? (
                        <Link
                          className="admin-btn-sm admin-btn-subtle"
                          href={`/admin/pemantauan/${student.id}/${activeRunId}`}
                        >
                          <Eye size={13} /> Detail Sesi
                        </Link>
                      ) : (
                        <span style={{ fontSize: 11, color: "var(--color-muted)" }}>Belum ada sesi</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* History Table of this student */}
      <section className="admin-card">
        <h2>Riwayat Sesi Simulasi Siswa Ini ({runs.length} Sesi)</h2>
        {runs.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--color-muted)" }}>
            Siswa ini belum memiliki catatan riwayat simulasi pada data demonstrasi.
          </p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Skenario</th>
                  <th>Dimulai</th>
                  <th>Selesai</th>
                  <th>Durasi</th>
                  <th>Keputusan</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((run, idx) => (
                  <tr key={run.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <strong>{run.scenarioTitleSnapshot}</strong>
                      <div style={{ fontSize: 10, color: "var(--color-muted)" }}>
                        Run ID: <code>{run.id}</code>
                      </div>
                    </td>
                    <td style={{ fontSize: 12 }}>{formatSimulationDate(run.startedAt)}</td>
                    <td style={{ fontSize: 12 }}>{formatSimulationDate(run.completedAt)}</td>
                    <td style={{ fontSize: 12 }}>{simulationDuration(run)}</td>
                    <td>{run.runState.selectedChoices.length} keputusan</td>
                    <td>
                      <Badge tone={run.status === "completed" ? "success" : run.status === "awaiting_debriefing" ? "teal" : "warning"}>
                        {simulationStatus(run)}
                      </Badge>
                    </td>
                    <td>
                      <Link
                        className="admin-btn-sm admin-btn-subtle"
                        href={`/admin/pemantauan/${student.id}/${run.id}`}
                      >
                        <FileText size={13} /> Periksa Sesi
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
