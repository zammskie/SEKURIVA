import type { Metadata } from "next";
import { ScenarioPageContent } from "@/components/simulation/scenario-page-content";
import { packageScenario } from "@/data/scenarios/pesan-paket";

export const metadata: Metadata = { title: packageScenario.title };
export default function Page() {
  return <ScenarioPageContent scenario={packageScenario} />;
}
