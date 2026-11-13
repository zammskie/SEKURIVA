"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MaterialReader } from "./material-reader";
import { useMaterials } from "@/lib/materials/use-materials";

export function StudentMaterialDetail() {
  const params = useParams<{ slug: string }>();
  const materials = useMaterials();
  if (materials === null) return <p role="status">Memuat materi…</p>;
  const published = materials.filter(material => material.status === "Published");
  const index = published.findIndex(material => material.slug === params.slug);
  if (index < 0) return <div className="material-empty"><h1>Materi tidak tersedia.</h1><p>Materi mungkin masih Draft, telah ditarik, atau alamatnya berubah.</p><Link className="dashboard-text-link" href="/siswa/materi">Kembali ke daftar materi</Link></div>;
  return <MaterialReader material={published[index]} previous={published[index - 1]} next={published[index + 1]} />;
}
