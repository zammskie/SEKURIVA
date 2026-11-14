import type { Metadata } from "next";
import { StudentMonitoringList } from "@/components/admin/monitoring/student-monitoring-list";

export const metadata: Metadata = { title: "Pemantauan Progres Siswa" };

export default function Page() {
  return <StudentMonitoringList />;
}
