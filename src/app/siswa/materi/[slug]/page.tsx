import type { Metadata } from "next";
import { StudentMaterialDetail } from "@/components/materials/student-material-detail";

export const metadata: Metadata = { title: "Baca Materi" };
export default function Page() { return <StudentMaterialDetail />; }
