import type { Metadata } from "next";
import { StudentDashboard } from "@/components/siswa/student-dashboard";
import { mockDashboardRepository } from "@/lib/repositories/mock-dashboard-repository";

export const metadata: Metadata = { title: "Beranda Siswa" };
export default async function StudentPage() { return <StudentDashboard data={await mockDashboardRepository.getStudentDashboard()} />; }
