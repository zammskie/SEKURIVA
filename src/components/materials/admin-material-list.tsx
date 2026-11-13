"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import { MATERIAL_CATEGORIES, type Material } from "@/lib/materials/types";
import { formatDate } from "@/lib/materials/utils";
import { materialRepository } from "@/lib/materials/material-repository";
import { useMaterials } from "@/lib/materials/use-materials";

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

  async function changeStatus(material: Material) {
    try {
      const next = material.status === "Draft" ? "Published" : "Draft";
      await materialRepository.updateMaterial(material.id, { ...material, status: next });
      setNotice(next === "Published" ? `Materi “${material.title}” berhasil diterbitkan.` : `Materi “${material.title}” dikembalikan menjadi Draft.`);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Perubahan status gagal disimpan."); }
  }
  async function deleteConfirmed() {
    if (!toDelete) return;
    try { await materialRepository.deleteMaterial(toDelete.id); setNotice(`Materi “${toDelete.title}” berhasil dihapus.`); setToDelete(null); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Materi gagal dihapus."); }
  }

  return <>
    <Breadcrumb items={[{ label: "Dashboard Admin", href: "/admin" }, { label: "Manajemen Materi" }]} />
    <PageHeader title="Manajemen Materi" description="Susun, periksa, dan terbitkan materi pembelajaran keamanan digital."><Link className="button button-primary" href="/admin/materi/tambah"><Plus size={17} aria-hidden="true" />Tambah Materi</Link></PageHeader>
    <p className="content-notice">DATA DEMO · Perubahan tersimpan di browser ini. Materi Published tetap perlu pemeriksaan Admin dan validasi ahli sebelum digunakan secara resmi.</p>
    {notice && <p className="material-notice" role="status">{notice}<button type="button" onClick={() => setNotice("")} aria-label="Tutup notifikasi">×</button></p>}
    {materials === null ? <p role="status">Memuat materi…</p> : <>
      <div className="material-counts"><div><strong>{materials.length}</strong><span>Total Materi</span></div><div><strong>{materials.filter(item => item.status === "Draft").length}</strong><span>Draft</span></div><div><strong>{materials.filter(item => item.status === "Published").length}</strong><span>Published</span></div></div>
      <div className="material-filters"><label><span>Cari materi</span><span className="material-search"><Search size={17} aria-hidden="true" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Judul atau ringkasan" /></span></label><label><span>Kategori</span><select value={category} onChange={event => setCategory(event.target.value)}><option value="">Semua kategori</option>{MATERIAL_CATEGORIES.map(item => <option key={item} value={item}>{item}</option>)}</select></label><label><span>Status</span><select value={status} onChange={event => setStatus(event.target.value)}><option value="">Semua status</option><option value="Draft">Draft</option><option value="Published">Published</option></select></label><button type="button" className="button button-secondary" onClick={() => { setQuery(""); setCategory(""); setStatus(""); }}>Hapus filter</button></div>
      {materials.length === 0 ? <div className="material-empty"><h2>Belum ada materi.</h2><p>Tambahkan materi untuk mulai menyusun pembelajaran.</p><Link className="dashboard-text-link" href="/admin/materi/tambah">Tambah Materi <ArrowRight size={16} /></Link></div> : filtered.length === 0 ? <div className="material-empty"><h2>Tidak ada materi yang cocok.</h2><p>Ubah kata kunci atau filter untuk melihat materi lain.</p></div> : <div className="material-table-wrap"><table className="material-table"><thead><tr><th>No.</th><th>Judul Materi</th><th>Kategori</th><th>Durasi</th><th>Status</th><th>Diperbarui</th><th>Aksi</th></tr></thead><tbody>{filtered.map((material, index) => <tr key={material.id}><td data-label="No.">{index + 1}</td><td data-label="Judul Materi"><strong>{material.title}</strong></td><td data-label="Kategori">{material.category}</td><td data-label="Durasi">{material.estimatedDuration} menit</td><td data-label="Status"><Badge tone={material.status === "Published" ? "success" : "neutral"}>{material.status}</Badge></td><td data-label="Diperbarui">{formatDate(material.updatedAt)}</td><td data-label="Aksi"><div className="material-row-actions"><Link href={`/admin/materi/${material.id}/preview`} aria-label={`Preview ${material.title}`}><Eye size={16} />Preview</Link><Link href={`/admin/materi/${material.id}/edit`} aria-label={`Edit ${material.title}`}><Pencil size={16} />Edit</Link><button type="button" onClick={() => changeStatus(material)}>{material.status === "Draft" ? "Terbitkan" : "Jadikan Draft"}</button><button type="button" className="material-danger-action" onClick={() => setToDelete(material)} aria-label={`Hapus ${material.title}`}><Trash2 size={16} />Hapus</button></div></td></tr>)}</tbody></table></div>}
    </>}
    {toDelete && <div className="material-confirm-backdrop" role="presentation" onKeyDown={event => { if (event.key === "Escape") setToDelete(null); }}><section className="material-confirm" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description"><h2 id="delete-title">Hapus materi?</h2><p id="delete-description">Materi “{toDelete.title}” akan dihapus dari browser ini. Tindakan ini tidak dapat dibatalkan.</p><div className="material-confirm-actions"><button type="button" className="button button-secondary" autoFocus onClick={() => setToDelete(null)}>Batal</button><button type="button" className="button material-delete-button" onClick={deleteConfirmed}>Hapus</button></div></section></div>}
  </>;
}
