"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, FileText, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import { MATERIAL_CATEGORIES, type Material, type MaterialStatus } from "@/lib/materials/types";
import { formatDate } from "@/lib/materials/utils";
import { materialRepository } from "@/lib/materials/material-repository";
import { useMaterials } from "@/lib/materials/use-materials";
import { scenarioCatalog } from "@/data/scenarios/catalog";

export function AdminMaterialList({ initialNotice = "" }: { initialNotice?: string }) {
  const materials = useMaterials();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [toDelete, setToDelete] = useState<Material | null>(null);
  const [notice, setNotice] = useState(initialNotice);

  const filtered = useMemo(() => (materials ?? []).filter(material =>
    `${material.title} ${material.summary}`.toLocaleLowerCase("id-ID").includes(query.trim().toLocaleLowerCase("id-ID"))
    && (!category || material.category === category) && (!status || material.status === status)), [materials, query, category, status]);

  const relatedScenarios = useMemo(() => {
    if (!toDelete) return [];
    return scenarioCatalog.filter(s => s.relatedMaterials.includes(toDelete.category));
  }, [toDelete]);

  async function setMaterialStatus(material: Material, next: MaterialStatus) {
    try {
      await materialRepository.updateMaterial(material.id, { ...material, status: next });
      setNotice(`Status materi "${material.title}" diubah menjadi ${next}.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Perubahan status gagal disimpan.");
    }
  }

  async function deleteConfirmed() {
    if (!toDelete) return;
    try {
      await materialRepository.deleteMaterial(toDelete.id);
      setNotice(`Materi "${toDelete.title}" berhasil dihapus.`);
      setToDelete(null);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Materi gagal dihapus.");
    }
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Dashboard Admin", href: "/admin" }, { label: "Manajemen Materi" }]} />
      <PageHeader
        eyebrow="RUANG ADMIN · KONTEN PEMBELAJARAN"
        title="Manajemen Materi"
        description="Susun, kelola, periksa keterkaitan materi keamanan digital, dan atur status publikasi untuk siswa."
      >
        <Link className="button button-primary" href="/admin/materi/tambah">
          <Plus size={17} aria-hidden="true" /> Tambah Materi
        </Link>
      </PageHeader>

      <p className="content-notice">
        DATA DEMO · Perubahan tersimpan secara lokal di peramban ini. Materi berstatus <strong>Published</strong> tampil di ruang siswa; materi <strong>Draft</strong> dan <strong>Archived</strong> tersembunyi dari katalog aktif siswa.
      </p>

      {notice && (
        <p className="material-notice" role="status">
          {notice}
          <button type="button" onClick={() => setNotice("")} aria-label="Tutup notifikasi">×</button>
        </p>
      )}

      {materials === null ? (
        <p role="status">Memuat daftar materi…</p>
      ) : (
        <>
          <div className="material-counts">
            <div>
              <strong>{materials.length}</strong>
              <span>Total Materi</span>
            </div>
            <div>
              <strong>{materials.filter(item => item.status === "Published").length}</strong>
              <span>Published (Aktif)</span>
            </div>
            <div>
              <strong>{materials.filter(item => item.status === "Draft").length}</strong>
              <span>Draft</span>
            </div>
            <div>
              <strong>{materials.filter(item => item.status === "Archived").length}</strong>
              <span>Archived</span>
            </div>
          </div>

          <div className="material-filters">
            <label>
              <span>Cari materi</span>
              <span className="material-search">
                <Search size={17} aria-hidden="true" />
                <input
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Cari judul atau ringkasan…"
                />
              </span>
            </label>
            <label>
              <span>Kategori</span>
              <select value={category} onChange={event => setCategory(event.target.value)}>
                <option value="">Semua kategori</option>
                {MATERIAL_CATEGORIES.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Status</span>
              <select value={status} onChange={event => setStatus(event.target.value)}>
                <option value="">Semua status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </label>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => { setQuery(""); setCategory(""); setStatus(""); }}
            >
              Hapus filter
            </button>
          </div>

          {materials.length === 0 ? (
            <div className="material-empty">
              <h2>Belum ada materi pembelajaran.</h2>
              <p>Tambahkan materi untuk mulai menyusun kurikulum keamanan digital.</p>
              <Link className="dashboard-text-link" href="/admin/materi/tambah">
                Tambah Materi Pertama <ArrowRight size={16} />
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="material-empty">
              <h2>Tidak ada materi yang sesuai filter.</h2>
              <p>Coba sesuaikan kata kunci pencarian atau kategori yang dipilih.</p>
            </div>
          ) : (
            <div className="material-table-wrap">
              <table className="material-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Judul Materi</th>
                    <th>Kategori</th>
                    <th>Durasi</th>
                    <th>Status</th>
                    <th>Diperbarui</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((material, index) => (
                    <tr key={material.id}>
                      <td data-label="No.">{index + 1}</td>
                      <td data-label="Judul Materi">
                        <strong>{material.title}</strong>
                        <div style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 2 }}>
                          Slug: <code>{material.slug}</code>
                        </div>
                      </td>
                      <td data-label="Kategori">{material.category}</td>
                      <td data-label="Durasi">{material.estimatedDuration} menit · {material.difficulty}</td>
                      <td data-label="Status">
                        <Badge tone={material.status === "Published" ? "success" : material.status === "Archived" ? "neutral" : "warning"}>
                          {material.status}
                        </Badge>
                      </td>
                      <td data-label="Diperbarui">{formatDate(material.updatedAt)}</td>
                      <td data-label="Aksi">
                        <div className="material-row-actions">
                          <Link href={`/admin/materi/${material.id}`} aria-label={`Detail ${material.title}`}>
                            <FileText size={15} /> Detail
                          </Link>
                          <Link href={`/admin/materi/${material.id}/preview`} aria-label={`Preview ${material.title}`}>
                            <Eye size={15} /> Preview
                          </Link>
                          <Link href={`/admin/materi/${material.id}/edit`} aria-label={`Edit ${material.title}`}>
                            <Pencil size={15} /> Edit
                          </Link>

                          {material.status !== "Published" && (
                            <button type="button" onClick={() => setMaterialStatus(material, "Published")}>
                              Terbitkan
                            </button>
                          )}
                          {material.status !== "Draft" && (
                            <button type="button" onClick={() => setMaterialStatus(material, "Draft")}>
                              Draft
                            </button>
                          )}
                          {material.status !== "Archived" && (
                            <button type="button" onClick={() => setMaterialStatus(material, "Archived")}>
                              Arsipkan
                            </button>
                          )}

                          <button
                            type="button"
                            className="material-danger-action"
                            onClick={() => setToDelete(material)}
                            aria-label={`Hapus ${material.title}`}
                          >
                            <Trash2 size={15} /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {toDelete && (
        <div
          className="material-confirm-backdrop"
          role="presentation"
          onKeyDown={event => { if (event.key === "Escape") setToDelete(null); }}
        >
          <section
            className="material-confirm"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-description"
          >
            <h2 id="delete-title">Hapus materi pembelajaran?</h2>
            <p id="delete-description">
              Materi <strong>&quot;{toDelete.title}&quot;</strong> akan dihapus permanen dari peramban ini. Tindakan ini tidak dapat dibatalkan.
            </p>

            {relatedScenarios.length > 0 && (
              <div style={{ margin: "14px 0", padding: "10px 12px", background: "#fff8eb", border: "1px solid #fedfa4", borderRadius: 8, fontSize: 12, color: "#855b16" }}>
                <strong>Peringatan Keterkaitan:</strong> Kategori materi ini (&quot;{toDelete.category}&quot;) dirujuk oleh {relatedScenarios.length} skenario simulasi:
                <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                  {relatedScenarios.map(s => <li key={s.id}>{s.title}</li>)}
                </ul>
              </div>
            )}

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
                onClick={deleteConfirmed}
              >
                Ya, Hapus Materi
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
