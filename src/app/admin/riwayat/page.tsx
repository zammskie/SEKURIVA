import type { Metadata } from "next";
import { AdminHistoryList } from "@/components/admin/history/admin-history-list";

export const metadata: Metadata = { title: "Riwayat Seluruh Simulasi" };

export default function Page() {
  return <AdminHistoryList />;
}
