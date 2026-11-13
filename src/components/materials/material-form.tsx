"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowLeft, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import { MATERIAL_CATEGORIES, type Material, type MaterialCategory, type MaterialInput, type MaterialSection, type MaterialStatus } from "@/lib/materials/types";
import { materialRepository } from "@/lib/materials/material-repository";
import { useMaterials } from "@/lib/materials/use-materials";
import { cleanLines, splitLines } from "@/lib/materials/utils";
import { validateMaterial } from "@/lib/materials/validation";

const newSection = (): MaterialSection => ({ id: crypto.randomUUID(), heading: "", paragraphs: [""], bulletPoints: [], optionalCallout: "" });
const blank: MaterialInput = {
  title: "", category: "" as MaterialCategory, summary: "", learningObjectives: [], estimatedDuration: 10,
  difficulty: "Dasar", coverIcon: "shield", status: "Draft",
  sections: [], keyTakeaways: [], redFlags: [], safeActions: [], references: [],
};

function FieldError({ message }: { message?: string }) { return message ? <span className="material-field-error" role="alert">{message}</span> : null; }

export function MaterialForm({ id }: { id?: string }) {
  const materials = useMaterials();
  if (materials === null) return <p role="status">Memuat formulir materi…</p>;
  const existing = id ? materials.find(material => material.id === id) : undefined;
  if (id && !existing) return <div className="material-empty"><h2>Materi tidak ditemukan.</h2><Link href="/admin/materi">Kembali ke daftar materi</Link></div>;
  return <MaterialFormEditor key={id ?? "new"} id={id} initial={existing} materials={materials} />;
}

function MaterialFormEditor({ id, initial, materials }: { id?: string; initial?: Material; materials: Material[] }) {
  const router = useRouter();
  const [form, setForm] = useState<MaterialInput>(() => initial ? {
    title: initial.title, category: initial.category, summary: initial.summary, learningObjectives: initial.learningObjectives,
    estimatedDuration: initial.estimatedDuration, difficulty: initial.difficulty, coverIcon: initial.coverIcon, status: initial.status,
    sections: initial.sections, keyTakeaways: initial.keyTakeaways, redFlags: initial.redFlags, safeActions: initial.safeActions, references: initial.references, learningChecks: initial.learningChecks,
  } : blank);
  const [showValidation, setShowValidation] = useState(false);
  const errors: Record<string, string> = showValidation ? validateMaterial(form, materials, id) : {};
  const [notice, setNotice] = useState("");
  const [referencesText, setReferencesText] = useState(() => initial?.references.map(reference => [reference.title, reference.author, reference.year, reference.url].join(" | ")).join("\n") ?? "");
  function updateSection(index: number, changes: Partial<MaterialSection>) { setForm(current => ({ ...current, sections: current.sections.map((section, at) => at === index ? { ...section, ...changes } : section) })); }
  function moveSection(index: number, offset: number) { setForm(current => { const sections = [...current.sections]; const target = index + offset; if (target < 0 || target >= sections.length) return current; [sections[index], sections[target]] = [sections[target], sections[index]]; return { ...current, sections }; }); }
  function parseReferences(value: string) { return splitLines(value).map(line => { const [title = "", author = "", year = "", url = ""] = line.split("|").map(part => part.trim()); return { title, author, year, url }; }).filter(item => item.title); }
  async function save(status: MaterialStatus) {
    const input: MaterialInput = { ...form, status, learningObjectives: cleanLines(form.learningObjectives), keyTakeaways: cleanLines(form.keyTakeaways), redFlags: cleanLines(form.redFlags), safeActions: cleanLines(form.safeActions), sections: form.sections.map(section => ({ ...section, heading: section.heading.trim(), paragraphs: cleanLines(section.paragraphs), bulletPoints: cleanLines(section.bulletPoints), optionalCallout: section.optionalCallout.trim() })), references: parseReferences(referencesText) };
    const foundErrors = validateMaterial(input, materials, id);
    if (Object.keys(foundErrors).length) { setShowValidation(true); setNotice("Periksa kolom yang ditandai sebelum menyimpan."); document.getElementById("material-form-start")?.scrollIntoView({ behavior: "smooth" }); return; }
    try {
      if (id) await materialRepository.updateMaterial(id, input);
      else await materialRepository.createMaterial(input);
      router.push(`/admin/materi?notice=${encodeURIComponent(status === "Published" ? "Materi berhasil diterbitkan." : id ? "Materi berhasil diubah." : "Materi berhasil dibuat sebagai Draft.")}`);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Materi gagal disimpan."); }
  }

  return <>
    <Breadcrumb items={[{ label: "Dashboard Admin", href: "/admin" }, { label: "Manajemen Materi", href: "/admin/materi" }, { label: id ? "Edit Materi" : "Tambah Materi" }]} />
    <PageHeader title={id ? "Edit Materi" : "Tambah Materi"} description="Lengkapi konten sebagai Draft atau terbitkan setelah pemeriksaan." />
    <p className="content-notice">DATA DEMO · Materi Published tetap memerlukan validasi ahli sebelum digunakan secara resmi. Simpan perubahan secara berkala.</p>
    {notice && <p className="material-notice" role="alert">{notice}</p>}
    <form id="material-form-start" className="material-editor" onSubmit={event => event.preventDefault()} noValidate>
      <section><h2>Informasi dasar</h2><div className="material-form-grid"><label className="material-span-2">Judul materi<input value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} aria-invalid={Boolean(errors.title)} /><FieldError message={errors.title} /></label><label>Kategori<select value={form.category} onChange={event => setForm({ ...form, category: event.target.value as MaterialCategory })} aria-invalid={Boolean(errors.category)}><option value="">Pilih kategori</option>{MATERIAL_CATEGORIES.map(category => <option key={category}>{category}</option>)}</select><FieldError message={errors.category} /></label><label>Estimasi waktu membaca (menit)<input type="number" min="1" value={form.estimatedDuration} onChange={event => setForm({ ...form, estimatedDuration: Number(event.target.value) })} aria-invalid={Boolean(errors.estimatedDuration)} /><FieldError message={errors.estimatedDuration} /></label><label>Tingkat kesulitan<select value={form.difficulty} onChange={event => setForm({ ...form, difficulty: event.target.value as MaterialInput["difficulty"] })}><option>Dasar</option><option>Menengah</option></select></label><label>Ikon sampul<select value={form.coverIcon} onChange={event => setForm({ ...form, coverIcon: event.target.value as MaterialInput["coverIcon"] })}><option value="shield">Perisai</option><option value="users">Pengguna</option><option value="link">Tautan</option><option value="wallet">Transaksi</option><option value="lock">Gembok</option></select></label><label className="material-span-2">Ringkasan<textarea rows={3} value={form.summary} onChange={event => setForm({ ...form, summary: event.target.value })} aria-invalid={Boolean(errors.summary)} /><FieldError message={errors.summary} /></label></div></section>
      <section><h2>Tujuan pembelajaran</h2><p className="material-field-hint">Tulis satu tujuan per baris.</p><label>Daftar tujuan<textarea rows={4} value={form.learningObjectives.join("\n")} onChange={event => setForm({ ...form, learningObjectives: splitLines(event.target.value) })} aria-invalid={Boolean(errors.learningObjectives)} /><FieldError message={errors.learningObjectives} /></label></section>
      <section><div className="material-editor-heading"><div><h2>Isi materi</h2><p className="material-field-hint">Susun bagian sesuai urutan membaca.</p></div><button type="button" className="button button-secondary" onClick={() => setForm(current => ({ ...current, sections: [...current.sections, newSection()] }))}><Plus size={16} />Tambah Bagian</button></div><FieldError message={errors.sections} />{form.sections.map((section, index) => <div className="material-section-editor" key={section.id}><div className="material-editor-heading"><h3>Bagian {index + 1}</h3><div className="material-section-actions"><button type="button" onClick={() => moveSection(index, -1)} disabled={index === 0} aria-label={`Pindahkan bagian ${index + 1} ke atas`}><ArrowUp size={16} /></button><button type="button" onClick={() => moveSection(index, 1)} disabled={index === form.sections.length - 1} aria-label={`Pindahkan bagian ${index + 1} ke bawah`}><ArrowDown size={16} /></button><button type="button" onClick={() => setForm(current => ({ ...current, sections: current.sections.filter(item => item.id !== section.id) }))} aria-label={`Hapus bagian ${index + 1}`}><Trash2 size={16} /></button></div></div><label>Judul bagian<input value={section.heading} onChange={event => updateSection(index, { heading: event.target.value })} aria-invalid={Boolean(errors[`sections.${index}.heading`])} /><FieldError message={errors[`sections.${index}.heading`]} /></label><label>Paragraf utama <small>(pisahkan paragraf dengan baris baru)</small><textarea rows={6} value={section.paragraphs.join("\n")} onChange={event => updateSection(index, { paragraphs: splitLines(event.target.value) })} aria-invalid={Boolean(errors[`sections.${index}.paragraphs`])} /><FieldError message={errors[`sections.${index}.paragraphs`]} /></label><label>Poin tambahan <small>(opsional, satu per baris)</small><textarea rows={3} value={section.bulletPoints.join("\n")} onChange={event => updateSection(index, { bulletPoints: splitLines(event.target.value) })} /></label><label>Catatan penting <small>(opsional)</small><textarea rows={2} value={section.optionalCallout} onChange={event => updateSection(index, { optionalCallout: event.target.value })} /></label></div>)}</section>
      <section className="material-form-grid"><label>Poin penting <small>(satu per baris)</small><textarea rows={5} value={form.keyTakeaways.join("\n")} onChange={event => setForm({ ...form, keyTakeaways: splitLines(event.target.value) })} /></label><label>Tanda bahaya <small>(satu per baris)</small><textarea rows={5} value={form.redFlags.join("\n")} onChange={event => setForm({ ...form, redFlags: splitLines(event.target.value) })} /></label><label className="material-span-2">Tindakan aman <small>(satu per baris)</small><textarea rows={4} value={form.safeActions.join("\n")} onChange={event => setForm({ ...form, safeActions: splitLines(event.target.value) })} /></label></section>
      <section><h2>Referensi</h2><p className="material-field-hint">Opsional. Satu referensi per baris dengan format: Judul | Penulis/organisasi | Tahun | URL. Jangan memasukkan sumber yang belum diperiksa.</p><label>Daftar referensi<textarea rows={4} value={referencesText} onChange={event => setReferencesText(event.target.value)} /></label></section>
      <div className="material-form-actions"><Link className="button button-secondary" href="/admin/materi"><ArrowLeft size={16} />Batal</Link><button type="button" className="button button-secondary" onClick={() => save("Draft")}>Simpan sebagai Draft</button><button type="button" className="button button-primary" onClick={() => save("Published")}>Terbitkan</button></div>
    </form>
  </>;
}
