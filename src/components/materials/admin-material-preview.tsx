"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MaterialReader } from "./material-reader";
import { useMaterials } from "@/lib/materials/use-materials";

export function AdminMaterialPreview() {
  const params = useParams<{ id: string }>();
  const materials = useMaterials();
  if (materials === null) return <p role="status">Memuat preview…</p>;
  const material = materials.find(item => item.id === params.id);
  if (!material) return <div className="material-empty"><h1>Materi tidak ditemukan.</h1><Link className="dashboard-text-link" href="/admin/materi">Kembali ke daftar materi</Link></div>;
  return <MaterialReader material={material} preview />;
}
