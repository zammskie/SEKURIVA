import type { Metadata } from "next";
import { ScenarioEditor } from "@/components/admin/scenarios/scenario-editor";

export const metadata: Metadata = { title: "Tambah Skenario" };

export default function Page() {
  return <ScenarioEditor isNew />;
}
