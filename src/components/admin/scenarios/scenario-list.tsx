"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Archive,
  Eye,
  FileText,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import { useScenarios } from "@/lib/scenario-engine/use-scenarios";
import { localScenarioRepository } from "@/lib/scenario-engine/local-scenario-repository";
import type { Scenario, ScenarioCategory } from "@/lib/scenario-engine/foundation-types";
import { formatDate } from "@/lib/materials/utils";

const ALL_CATEGORIES: ScenarioCategory[] = [
  "Penawaran pekerjaan",
  "Tugas online",
  "Penyamaran kurir",
  "File aplikasi",
  "Transaksi digital",
  "Customer service",
  "Investasi",
  "Pemulihan dana",
];

export function ScenarioList() {
  const { scenarios, refresh } = useScenarios();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [notice, setNotice] = useState("");
  const [errorNotice, setErrorNotice] = useState("");
  const [toDelete, setToDelete] = useState<Scenario | null>(null);

  const scenarioList = useMemo(() => scenarios ?? [], [scenarios]);

  const filtered = useMemo(() => {
    return scenarioList.filter(item => {
      const text = `${item.title} ${item.description} ${item.slug} ${(item.keywords || []).join(" ")}`.toLocaleLowerCase("id-ID");
      const matchQuery = !query.trim() || text.includes(query.trim().toLocaleLowerCase("id-ID"));
      const matchCat = !category || item.category === category;
      const effectiveStatus = item.status === "ready" ? "published" : item.status;
      const matchStatus = !statusFilter || effectiveStatus === statusFilter;
      return matchQuery && matchCat && matchStatus;
    });
  }, [scenarioList, query, category, statusFilter]);

  const handlePublish = async (scenario: Scenario) => {
    setNotice("");
    setErrorNotice("");
    const result = await localScenarioRepository.publishScenario(scenario.id);
    if (result.success) {
      setNotice(`Skenario "${scenario.title}" berhasil diterbitkan.`);
      refresh();
    } else {
      setErrorNotice(`Gagal menerbitkan skenario: ${result.errors.join("; ")}`);
    }
  };

  const handleArchive = async (scenario: Scenario) => {
    setNotice("");
    setErrorNotice("");
    try {
      await localScenarioRepository.archiveScenario(scenario.id);
      setNotice(`Skenario "${scenario.title}" berhasil diarsipkan.`);
      refresh();
    } catch (err) {
      setErrorNotice(err instanceof Error ? err.message : "Gagal mengarsipkan skenario.");
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!toDelete) return;
    setNotice("");
    setErrorNotice("");
    const result = await localScenarioRepository.deleteScenario(toDelete.id);
    if (result.success) {
      setNotice(`Skenario "${toDelete.title}" berhasil dihapus.`);
      setToDelete(null);
      refresh();
    } else {
      setErrorNotice(result.reason || "Gagal menghapus skenario.");
      setToDelete(null);
    }
  };

  const handleReset = async () => {
    if (confirm("Pulihkan katalog ke 8 skenario acuan awal? Perubahan khusus pada skenario bawaan akan dikembalikan.")) {
      await localScenarioRepository.resetToDefault();
      setNotice("Delapan skenario acuan resmi berhasil dipulihkan.");
      refresh();
    }
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Dashboard Admin", href: "/admin" }, { label: "Manajemen Skenario" }]} />
      <PageHeader
        eyebrow="RUANG ADMIN · PENGELOLA SKENARIO"
        title="Manajemen Skenario Simulasi"
        description="Kelola seluruh skenario simulasi penipuan digital, alur percakapan, titik keputusan, konsekuensi, dan debriefing edukatif."
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" className="button button-secondary" onClick={handleReset} title="Pulihkan 8 skenario acuan">
            <RefreshCw size={15} /> Pulihkan Skenario Acuan
          </button>
          <Link className="button button-primary" href="/admin/skenario/tambah">
            <Plus size={16} aria-hidden="true" /> Tambah Skenario
          </Link>
        </div>
      </PageHeader>

      <p className="content-notice">
        DATA DEMO · Pengelolaan skenario terintegrasi langsung dengan Scenario Engine. Hanya skenario berstatus <strong>Published</strong> yang lolos validasi graph dan dapat diakses siswa di ruang simulasi.
      </p>

      {notice && (
        <div className="admin-alert-banner success" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Tutup">×</button>
        </div>
      )}
      {errorNotice && (
        <div className="admin-alert-banner danger" role="alert">
          <span>{errorNotice}</span>
          <button type="button" onClick={() => setErrorNotice("")} aria-label="Tutup">×</button>
        </div>
      )}

      {scenarios === null ? (
        <p role="status">Memuat skenario simulasi…</p>
      ) : (
        <>
          <div className="material-counts">
            <div>
              <strong>{scenarioList.length}</strong>
              <span>Total Skenario</span>
            </div>
            <div>
              <strong>{scenarioList.filter(s => s.status === "published" || s.status === "ready").length}</strong>
              <span>Published (Aktif)</span>
            </div>
            <div>
              <strong>{scenarioList.filter(s => s.status === "draft").length}</strong>
              <span>Draft</span>
            </div>
            <div>
              <strong>{scenarioList.filter(s => s.status === "archived").length}</strong>
              <span>Archived</span>
            </div>
          </div>

          <div className="admin-toolbar">
            <div className="admin-filters-row">
              <div className="admin-search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Cari skenario berdasarkan judul, slug, atau kata kunci…"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
              </div>

              <select
                className="admin-select"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="">Semua Kategori</option>
                {ALL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                className="admin-select"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              {(query || category || statusFilter) && (
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => { setQuery(""); setCategory(""); setStatusFilter(""); }}
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="material-empty">
              <h2>Tidak ada skenario yang sesuai.</h2>
              <p>Sesuaikan kata kunci pencarian atau ubah filter kategori/status.</p>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Judul Skenario</th>
                    <th>Kategori</th>
                    <th>Struktur Node</th>
                    <th>Status</th>
                    <th>Diperbarui</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((scenario, index) => {
                    const decisionsCount = scenario.nodes?.filter(n => n.type === "decision").length ?? 0;
                    const endingsCount = scenario.nodes?.filter(n => n.type === "ending").length ?? 0;
                    const effectiveStatus = scenario.status === "ready" ? "published" : scenario.status;

                    return (
                      <tr key={scenario.id}>
                        <td style={{ fontWeight: 700, color: "var(--color-muted)" }}>
                          {String(index + 1).padStart(2, "0")}
                        </td>
                        <td>
                          <strong>{scenario.title}</strong>
                          <div style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 2 }}>
                            Slug: <code>{scenario.slug}</code>
                          </div>
                        </td>
                        <td>
                          <Badge tone="teal">{scenario.category}</Badge>
                        </td>
                        <td>
                          <div style={{ fontSize: 12 }}>
                            {scenario.nodes?.length ?? 0} node total
                          </div>
                          <div style={{ fontSize: 11, color: "var(--color-muted)" }}>
                            {decisionsCount} keputusan · {endingsCount} ending
                          </div>
                        </td>
                        <td>
                          <Badge
                            tone={effectiveStatus === "published" ? "success" : effectiveStatus === "archived" ? "neutral" : "warning"}
                          >
                            {effectiveStatus.toUpperCase()}
                          </Badge>
                        </td>
                        <td style={{ fontSize: 12, color: "var(--color-muted)" }}>
                          {formatDate(scenario.updatedAt)}
                        </td>
                        <td>
                          <div className="admin-actions-cell">
                            <Link
                              className="admin-btn-sm admin-btn-subtle"
                              href={`/admin/skenario/${scenario.id}`}
                              title="Lihat detail & graph skenario"
                            >
                              <FileText size={14} /> Detail
                            </Link>
                            <Link
                              className="admin-btn-sm admin-btn-outline"
                              href={`/admin/skenario/${scenario.id}/preview`}
                              title="Uji simulasi tanpa mencatat riwayat"
                            >
                              <Eye size={14} /> Preview
                            </Link>
                            <Link
                              className="admin-btn-sm admin-btn-outline"
                              href={`/admin/skenario/${scenario.id}/edit`}
                              title="Edit metadata, alur node & debriefing"
                            >
                              <Pencil size={14} /> Edit
                            </Link>

                            {effectiveStatus !== "published" && (
                              <button
                                type="button"
                                className="admin-btn-sm admin-btn-subtle"
                                onClick={() => handlePublish(scenario)}
                                title="Validasi graph & terbitkan untuk siswa"
                              >
                                Terbitkan
                              </button>
                            )}
                            {effectiveStatus !== "archived" && (
                              <button
                                type="button"
                                className="admin-btn-sm admin-btn-outline"
                                onClick={() => handleArchive(scenario)}
                                title="Arsipkan skenario"
                              >
                                <Archive size={13} /> Arsipkan
                              </button>
                            )}

                            <button
                              type="button"
                              className="admin-btn-sm admin-btn-danger"
                              onClick={() => setToDelete(scenario)}
                              title="Hapus skenario"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Delete confirmation modal */}
      {toDelete && (
        <div
          className="material-confirm-backdrop"
          role="presentation"
          onKeyDown={e => { if (e.key === "Escape") setToDelete(null); }}
        >
          <section
            className="material-confirm"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-sc-title"
            aria-describedby="delete-sc-desc"
          >
            <h2 id="delete-sc-title">Hapus skenario simulasi?</h2>
            <p id="delete-sc-desc">
              Skenario <strong>&quot;{toDelete.title}&quot;</strong> akan diperiksa keterkaitannya dengan riwayat belajar siswa. Jika belum ada riwayat, skenario akan dihapus permanen.
            </p>
            <div className="material-confirm-actions">
              <button
                type="button"
                className="button button-secondary"
                autoFocus
                onClick={() => setToDelete(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="button material-delete-button"
                onClick={handleDeleteConfirmed}
              >
                Hapus Skenario
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
