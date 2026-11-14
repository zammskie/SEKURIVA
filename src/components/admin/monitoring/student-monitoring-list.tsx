"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import { DEMO_STUDENTS } from "@/lib/auth/demo-users";
import { useAllSimulationRuns } from "@/lib/simulation-history/use-simulation-history";
import { calculateSimulationProgress } from "@/lib/simulation-history/progress";
import { formatDate } from "@/lib/materials/utils";

export function StudentMonitoringList() {
  const { runs } = useAllSimulationRuns();
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  const runList = useMemo(() => runs ?? [], [runs]);

  // Per-student stats
  const studentsWithStats = useMemo(() => {
    return DEMO_STUDENTS.map(student => {
      const studentRuns = runList.filter(r => r.userId === student.id);
      const progress = calculateSimulationProgress(studentRuns);
      const latestRun = [...studentRuns].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];

      return {
        ...student,
        completedCount: progress.completed,
        inProgressCount: progress.inProgress,
        totalScenarios: progress.total,
        percentage: progress.percentage,
        lastActivity: latestRun ? latestRun.updatedAt : null,
        hasActivity: studentRuns.length > 0,
        runsCount: studentRuns.length,
      };
    });
  }, [runList]);

  // Overall metrics
  const totalStudents = DEMO_STUDENTS.length;
  const startedStudentsCount = studentsWithStats.filter(s => s.hasActivity).length;
  const completedAtLeastOneCount = studentsWithStats.filter(s => s.completedCount > 0).length;
  const totalCompletedRuns = runList.filter(r => r.status === "completed").length;
  const totalInProgressRuns = runList.filter(r => r.status === "in_progress" || r.status === "awaiting_debriefing").length;

  const filtered = useMemo(() => {
    return studentsWithStats.filter(student => {
      const matchQuery =
        !query.trim() ||
        `${student.name} ${student.email} ${student.className}`.toLocaleLowerCase("id-ID").includes(query.trim().toLocaleLowerCase("id-ID"));

      if (filterStatus === "active") return matchQuery && student.hasActivity;
      if (filterStatus === "inactive") return matchQuery && !student.hasActivity;
      return matchQuery;
    });
  }, [studentsWithStats, query, filterStatus]);

  return (
    <>
      <Breadcrumb items={[{ label: "Dashboard Admin", href: "/admin" }, { label: "Pemantauan Progres" }]} />
      <PageHeader
        eyebrow="RUANG ADMIN · KEBUTUHAN FUNGSIONAL KF-13"
        title="Pemantauan Progres Siswa"
        description="Pantau partisipasi belajar, pencapaian simulasi, dan riwayat pengambilan keputusan siswa kelas X BC 1."
      />

      <div className="admin-alert-banner info">
        <div>
          <strong>DATA DEMONSTRASI (TAHAP 8)</strong> — Informasi siswa di bawah merupakan data demo fiktif untuk pengujian prototipe. Belum terhubung dengan basis data siswa riil.
        </div>
        <Badge tone="teal">Data Demonstrasi</Badge>
      </div>

      {/* 5 Dynamic Summary Metrics */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <Users size={16} />
            <span>Total Siswa</span>
          </div>
          <div className="admin-stat-value">{totalStudents}</div>
          <div className="admin-stat-sub">Profil siswa demo kelas X BC 1</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <Clock size={16} />
            <span>Pernah Memulai</span>
          </div>
          <div className="admin-stat-value">{startedStudentsCount}</div>
          <div className="admin-stat-sub">Siswa memiliki sesi simulasi</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <CheckCircle2 size={16} />
            <span>Selesai Minimal 1</span>
          </div>
          <div className="admin-stat-value">{completedAtLeastOneCount}</div>
          <div className="admin-stat-sub">Mencapai debriefing selesai</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <CheckCircle2 size={16} />
            <span>Total Sesi Selesai</span>
          </div>
          <div className="admin-stat-value">{totalCompletedRuns}</div>
          <div className="admin-stat-sub">Akumulasi seluruh siswa</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <Clock size={16} />
            <span>Sedang Berlangsung</span>
          </div>
          <div className="admin-stat-value">{totalInProgressRuns}</div>
          <div className="admin-stat-sub">Sesi belum debriefing</div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-filters-row">
          <div className="admin-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Cari siswa berdasarkan nama, email, atau kelas…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          <select
            className="admin-select"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as "all" | "active" | "inactive")}
          >
            <option value="all">Semua Status Partisipasi</option>
            <option value="active">Aktif Belajar (Pernah Memulai)</option>
            <option value="inactive">Belum Ada Aktivitas</option>
          </select>

          {(query || filterStatus !== "all") && (
            <button
              type="button"
              className="button button-secondary"
              onClick={() => { setQuery(""); setFilterStatus("all"); }}
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Students Table */}
      {filtered.length === 0 ? (
        <div className="material-empty">
          <h2>Tidak ada data siswa yang cocok.</h2>
          <p>Sesuaikan kata kunci pencarian atau ganti filter status partisipasi.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Nama Siswa & Identitas</th>
                <th>Kelas</th>
                <th>Skenario Selesai</th>
                <th>Sesi Berlangsung</th>
                <th>Aktivitas Terakhir</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, idx) => (
                <tr key={student.id}>
                  <td style={{ fontWeight: 700, color: "var(--color-muted)" }}>
                    {idx + 1}
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ display: "grid", placeItems: "center", width: 34, height: 34, borderRadius: "50%", background: "#e8f3f1", color: "#176e64", fontWeight: 700, fontSize: 12 }}>
                        {student.avatarInitials}
                      </span>
                      <div>
                        <strong>{student.name}</strong>
                        <div style={{ fontSize: 11, color: "var(--color-muted)" }}>
                          {student.email} · <Badge tone="neutral">{student.badgeLabel}</Badge>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{student.className}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <strong style={{ fontSize: 13, color: student.completedCount > 0 ? "#21865b" : "var(--color-muted)" }}>
                        {student.completedCount} / {student.totalScenarios}
                      </strong>
                      <span style={{ fontSize: 11, color: "var(--color-muted)" }}>
                        ({student.percentage}%)
                      </span>
                    </div>
                  </td>
                  <td>
                    {student.inProgressCount > 0 ? (
                      <Badge tone="warning">{student.inProgressCount} sesi aktif</Badge>
                    ) : (
                      <span style={{ color: "var(--color-muted)", fontSize: 12 }}>—</span>
                    )}
                  </td>
                  <td style={{ fontSize: 12, color: "var(--color-muted)" }}>
                    {student.lastActivity ? formatDate(student.lastActivity) : "Belum ada aktivitas"}
                  </td>
                  <td>
                    <Link
                      className="admin-btn-sm admin-btn-subtle"
                      href={`/admin/pemantauan/${student.id}`}
                    >
                      Lihat Detail Progres <ArrowRight size={13} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
