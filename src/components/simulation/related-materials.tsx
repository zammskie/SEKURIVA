"use client";

import Link from "next/link";
import { useMaterials } from "@/lib/materials/use-materials";
import type { MaterialCategory } from "@/lib/materials/types";

const legacyCategories: Record<string, MaterialCategory> = {
  "keamanan-digital": "Dasar Kesadaran Keamanan Digital",
  phishing: "Phishing",
  "kata-sandi": "Perlindungan Data Pribadi dan Keamanan Perangkat",
  privasi: "Perlindungan Data Pribadi dan Keamanan Perangkat",
};

export function RelatedMaterials({ ids }: { ids: readonly string[] }) {
  const materials = useMaterials();
  const categories = new Set(ids.map(id => legacyCategories[id]).filter(Boolean));
  const related = (materials ?? []).filter(material => material.status === "Published" && categories.has(material.category));
  return <section><h3>Topik untuk dipelajari selanjutnya</h3>{related.length === 0 ? <p className="simulation-caption">Belum ada materi terkait yang diterbitkan.</p> : <div className="content-related-links">{related.map(material => <Link key={material.id} href={`/siswa/materi/${material.slug}`}>{material.title}<span>Baca materi →</span></Link>)}</div>}</section>;
}
