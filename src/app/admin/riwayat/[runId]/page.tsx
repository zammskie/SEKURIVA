import type { Metadata } from "next";
import { StudentSessionDetail } from "@/components/admin/monitoring/student-session-detail";

export const metadata: Metadata = { title: "Detail Riwayat Sesi" };

export default function Page() {
  return <StudentSessionDetail backTo="history" />;
}
