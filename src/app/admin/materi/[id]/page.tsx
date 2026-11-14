import type { Metadata } from "next";
import { AdminMaterialDetail } from "@/components/materials/admin-material-detail";

export const metadata: Metadata = { title: "Detail Materi" };

export default function Page() {
  return <AdminMaterialDetail />;
}
