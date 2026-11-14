"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileText, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import { useAllSimulationRuns } from "@/lib/simulation-history/use-simulation-history";
import { findDemoUser } from "@/lib/auth/demo-users";
import { formatSimulationDate, simulationDuration, simulationStatus } from "@/lib/simulation-history/display";

export function AdminHistoryList() {
  const { runs } = useAllSimulationRuns();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const runList = useMemo(() => runs ?? [], [runs]);

  const filtered = useMemo(() => {
    return runList.filter(run => {
      const student = findDemoUser(run.userId);
      const studentName = student ? student.name : run.userId;
      const text = `${studentName} ${run.scenarioTitleSnapshot} ${run.id} ${run.scenarioId}`.toLocaleLowerCase("id-ID");
      const matchQuery = !query.trim() || text.includes(query.trim().toLocaleLowerCase("id-ID"));
      const matchStatus = !statusFilter || run.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [runList, query, statusFilter]);

  return (
    <>
      <Breadcrumb items={[{ label: "Dashboard Admin", href: "/admin" }, { label: "Riwayat Simulasi" }]} />
      <PageHeader
        eyebrow="RUANG ADMIN · PENCATATAN AKTIVITAS"
        title="Riwayat Seluruh Simulasi"
        description="Daftar lengkap sesi pembelajaran dan simulasi yang dijalankan oleh seluruh siswa di peramban ini."
      />

      <div className="admin-alert-banner info">
        <div>
          <strong>CATATAN RIWAYAT LOKAL (TAHAP 8)</strong> — Data di bawah membaca seluruh sesi simulasi dari penyimpanan peramban. Setiap pengulangan skenario tercatat sebagai entri terpisah.
        </div>
        <Badge tone="teal">Data Demonstrasi</Badge>
      </div>

      <div className="admin-toolbar">
        <div className="admin-filters-row">
          <div className="admin-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Cari berdasarkan nama siswa, skenario, atau Run ID…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          <select
            className="admin-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">Semua Status Sesi</option>
            <option value="completed">Selesai (Sudah Debriefing)</option>
            <option value="awaiting_debriefing">Menunggu Pembahasan</option>
            <option value="in_progress">Sedang Berlangsung</option>
          </select>

          {(query || statusFilter) && (
            <button
              type="button"
              className="button button-secondary"
              onClick={() => { setQuery(""); setStatusFilter(""); }}
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {runList.length === 0 ? (
        <div className="material-empty">
          <h2>Belum ada riwayat simulasi siswa.</h2>
          <p>Riwayat akan muncul setelah siswa memainkan dan menyelesaikan skenario simulasi.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="material-empty">
          <h2>Tidak ada riwayat yang cocok dengan filter.</h2>
          <p>Ubah kata kunci pencarian atau sesuaikan filter status.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Siswa</th>
                <th>Skenario</th>
                <th>Waktu & Tanggal</th>
                <th>Durasi</th>
                <th>Keputusan</th>
                <th>Status Sesi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((run, idx) => {
                const student = findDemoUser(run.userId);
                return (
                  <tr key={run.id}>
                    <td style={{ fontWeight: 700, color: "var(--color-muted)" }}>
                      {idx + 1}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ display: "grid", placeItems: "center", width: 28, height: 28, borderRadius: "50%", background: "#e8f3f1", color: "#176e64", fontWeight: 700, fontSize: 11 }}>
                          {student?.avatarInitials ?? "SD"}
                        </span>
                        <div>
                          <strong>{student?.name ?? run.userId}</strong>
                          <div style={{ fontSize: 11, color: "var(--color-muted)" }}>{student?.className}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong>{run.scenarioTitleSnapshot}</strong>
                      <div style={{ fontSize: 10, color: "var(--color-muted)" }}>
                        <code>{run.id}</code>
                      </div>
                    </td>
                    <td style={{ fontSize: 12 }}>
                      <div>{formatSimulationDate(run.startedAt)}</div>
                      <div style={{ fontSize: 10, color: "var(--color-muted)" }}>
                        Selesai: {formatSimulationDate(run.completedAt)}
                      </div>
                    </td>
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
                        href={`/admin/riwayat/${run.id}`}
                      >
                        <FileText size={13} /> Detail Sesi
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
