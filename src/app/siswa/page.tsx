import type { Metadata } from "next";
import { StudentDashboard } from "@/components/siswa/student-dashboard";

export const metadata: Metadata = { title: "Beranda Siswa" };
export default function StudentPage() { return <StudentDashboard />; }
