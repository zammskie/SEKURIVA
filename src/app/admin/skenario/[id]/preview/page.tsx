import type { Metadata } from "next";
import { AdminScenarioPreviewPage } from "@/components/admin/scenarios/scenario-preview-page";

export const metadata: Metadata = { title: "Preview Skenario" };

export default function Page() {
  return <AdminScenarioPreviewPage />;
}
