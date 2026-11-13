"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, Link2, LockKeyhole, Search, ShieldCheck, UsersRound, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import { MATERIAL_CATEGORIES } from "@/lib/materials/types";
import { useMaterials } from "@/lib/materials/use-materials";

const icons = { shield: ShieldCheck, users: UsersRound, link: Link2, wallet: Wallet, lock: LockKeyhole };

export function StudentMaterialList() {
  const materials = useMaterials();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const published = useMemo(() => (materials ?? []).filter(material => material.status === "Published"), [materials]);
  const filtered = published.filter(material => `${material.title} ${material.summary}`.toLocaleLowerCase("id-ID").includes(query.trim().toLocaleLowerCase("id-ID")) && (!category || material.category === category));
  return <>
    <Breadcrumb items={[{ label: "Beranda", href: "/siswa" }, { label: "Materi Pembelajaran" }]} />
    <PageHeader title="Materi Pembelajaran" description="Temukan materi keamanan digital dan baca sesuai kebutuhanmu." />
    <p className="content-notice">DATA DEMO · Konten yang diterbitkan tetap memerlukan pemeriksaan Admin dan validasi ahli sebelum digunakan secara resmi.</p>
    <div className="material-filters"><label><span>Cari materi</span><span className="material-search"><Search size={17} aria-hidden="true" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Judul atau ringkasan" /></span></label><label><span>Kategori</span><select value={category} onChange={event => setCategory(event.target.value)}><option value="">Semua kategori</option>{MATERIAL_CATEGORIES.map(item => <option key={item} value={item}>{item}</option>)}</select></label><button type="button" className="button button-secondary" onClick={() => { setQuery(""); setCategory(""); }}>Hapus filter</button></div>
    {materials === null ? <p role="status">Memuat materi…</p> : published.length === 0 ? <div className="material-empty"><BookOpen size={28} aria-hidden="true" /><h2>Belum ada materi pembelajaran yang tersedia.</h2><p>Silakan kembali lagi setelah materi diterbitkan.</p></div> : filtered.length === 0 ? <div className="material-empty"><h2>Materi tidak ditemukan.</h2><p>Coba kata kunci atau kategori lain.</p></div> : <div className="material-catalog">{filtered.map(material => { const Icon = icons[material.coverIcon]; return <article className="simulation-panel material-catalog-card" key={material.id}><span className="material-cover-icon"><Icon size={23} aria-hidden="true" /></span><Badge tone="teal">{material.category}</Badge><h2>{material.title}</h2><p>{material.summary}</p><p className="simulation-caption"><Clock3 size={14} aria-hidden="true" /> {material.estimatedDuration} menit · {material.difficulty}</p><Link className="button button-primary" href={`/siswa/materi/${material.slug}`}>Pelajari Materi <ArrowRight size={17} aria-hidden="true" /></Link></article>; })}</div>}
  </>;
}
