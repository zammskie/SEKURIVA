"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import type { ScenarioMetadata } from "@/lib/scenario-engine/foundation-types";
import type { ScenarioCatalogStats } from "@/lib/scenario-engine/scenario-repository";

export function ScenarioCatalog({ scenarios, stats, availableIds }: { scenarios: readonly ScenarioMetadata[]; stats: ScenarioCatalogStats; availableIds: readonly string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const available = useMemo(() => new Set(availableIds), [availableIds]);
  const filtered = scenarios.filter(item => {
    const text = `${item.title} ${item.description} ${item.keywords.join(" ")}`.toLocaleLowerCase("id-ID");
    return text.includes(query.trim().toLocaleLowerCase("id-ID")) && (!category || item.category === category);
  });
  return <>
    <Breadcrumb items={[{ label: "Beranda", href: "/siswa" }, { label: "Skenario Simulasi" }]} />
    <PageHeader eyebrow="RUANG BELAJAR · DATA DEMO" title="Skenario Simulasi" description="Pelajari berbagai bentuk penipuan digital melalui situasi interaktif yang membantu mengenali pendekatan pelaku dan mempertimbangkan tindakan yang lebih aman." />
    <p className="content-notice">Aplikasi dirancang memiliki delapan skenario pembelajaran. Percakapan lengkap masih disiapkan; status ketersediaan mengikuti validasi graph.</p>
    <section className="scenario-catalog-stats" aria-label="Ringkasan skenario"><div><strong>{stats.total}</strong><span>Total direncanakan</span></div><div><strong>{stats.available}</strong><span>Tersedia</span></div><div><strong>{stats.inDevelopment}</strong><span>Dalam Pengembangan</span></div></section>
    <div className="scenario-catalog-filters"><label><span>Cari skenario</span><span className="scenario-search"><Search size={17} aria-hidden="true" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Judul, deskripsi, atau kata kunci" /></span></label><label><span>Kategori</span><select value={category} onChange={event => setCategory(event.target.value)}><option value="">Semua kategori</option>{stats.categories.map(item => <option key={item} value={item}>{item}</option>)}</select></label><button type="button" className="button button-secondary" onClick={() => { setQuery(""); setCategory(""); }}>Hapus filter</button></div>
    {filtered.length === 0 ? <div className="material-empty"><h2>Skenario tidak ditemukan.</h2><p>Ubah kata kunci atau kategori untuk melihat skenario lain.</p></div> : <div className="scenario-catalog">{filtered.map(scenario => <article className="simulation-panel scenario-catalog-card" key={scenario.id}><div className="scenario-card-top"><span className="scenario-number">{String(scenarios.indexOf(scenario) + 1).padStart(2, "0")}</span><Badge tone={available.has(scenario.id) ? "success" : "warning"}>{available.has(scenario.id) ? "Tersedia" : "Dalam Pengembangan"}</Badge></div><p className="scenario-card-category">{scenario.category}</p><h2>{scenario.title}</h2><p>{scenario.description}</p><h3>Tujuan pembelajaran</h3><ul>{scenario.learningObjectives.slice(0, 2).map(objective => <li key={objective}>{objective}</li>)}</ul><Link className="button button-secondary" href={`/siswa/skenario/${scenario.slug}`}>Lihat Detail <ArrowRight size={16} aria-hidden="true" /></Link></article>)}</div>}
  </>;
}
