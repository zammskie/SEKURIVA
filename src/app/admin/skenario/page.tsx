import type { Metadata } from "next";
import { ScenarioList } from "@/components/admin/scenarios/scenario-list";

export const metadata: Metadata = { title: "Manajemen Skenario" };

export default function Page() {
  return <ScenarioList />;
}
