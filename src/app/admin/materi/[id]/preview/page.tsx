import type { Metadata } from "next";
import { AdminMaterialPreview } from "@/components/materials/admin-material-preview";

export const metadata: Metadata = { title: "Preview Materi" };
export default function Page() { return <AdminMaterialPreview />; }
