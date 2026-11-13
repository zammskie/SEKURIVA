import type { Metadata } from "next";
import { AdminMaterialList } from "@/components/materials/admin-material-list";

export const metadata: Metadata = { title: "Manajemen Materi" };
export default async function Page({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const { notice } = await searchParams;
  return <AdminMaterialList initialNotice={notice} />;
}
