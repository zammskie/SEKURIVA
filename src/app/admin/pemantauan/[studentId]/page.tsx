import type { Metadata } from "next";
import { StudentProgressDetail } from "@/components/admin/monitoring/student-progress-detail";

export const metadata: Metadata = { title: "Detail Progres Siswa" };

export default function Page() {
  return <StudentProgressDetail />;
}
