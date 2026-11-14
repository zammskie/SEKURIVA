"use client";

import Link from "next/link";
import type { MaterialCategory } from "@/lib/materials/types";
import { useMaterials } from "@/lib/materials/use-materials";

export function ScenarioRelatedMaterials({ categories }: { categories: readonly MaterialCategory[] }) {
  const materials = useMaterials();
  const related = (materials ?? []).filter(item => item.status === "Published" && categories.includes(item.category));
  return <section className="scenario-detail-section"><h2>Materi terkait</h2>{materials === null ? <p>Memuat materi…</p> : related.length === 0 ? <p>Belum ada materi terkait yang diterbitkan. Admin sedang menyiapkan konten pembelajaran.</p> : <ul className="scenario-related-list">{related.map(item => <li key={item.id}><Link href={`/siswa/materi/${item.slug}`}>{item.title}</Link><span>{item.category}</span></li>)}</ul>}</section>;
}
