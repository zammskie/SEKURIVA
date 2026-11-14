import type { Metadata } from "next";
import { ScenarioEditorLoader } from "@/components/admin/scenarios/scenario-editor-loader";

export const metadata: Metadata = { title: "Edit Skenario" };

export default function Page() {
  return <ScenarioEditorLoader />;
}
