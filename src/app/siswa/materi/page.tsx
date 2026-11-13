import type { Metadata } from "next";
import { StudentMaterialList } from "@/components/materials/student-material-list";

export const metadata: Metadata = { title: "Materi Pembelajaran" };
export default function Page() { return <StudentMaterialList />; }
