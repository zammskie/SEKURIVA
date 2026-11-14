import type { Metadata } from "next";
import { AdminScenarioDetail } from "@/components/admin/scenarios/scenario-detail";

export const metadata: Metadata = { title: "Detail Skenario" };

export default function Page() {
  return <AdminScenarioDetail />;
}
