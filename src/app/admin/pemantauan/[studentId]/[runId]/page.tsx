import type { Metadata } from "next";
import { StudentSessionDetail } from "@/components/admin/monitoring/student-session-detail";

export const metadata: Metadata = { title: "Inspeksi Sesi Siswa" };

export default function Page() {
  return <StudentSessionDetail backTo="monitoring" />;
}
