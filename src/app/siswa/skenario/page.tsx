import type { Metadata } from "next";
import { ScenarioCatalog } from "@/components/simulation/scenario-catalog";
import { mockScenarioRepository } from "@/lib/scenario-engine/mock-scenario-repository";

export const metadata: Metadata = { title: "Skenario Simulasi" };
export default async function Page() {
  const [scenarios, stats, available] = await Promise.all([
    mockScenarioRepository.getAllScenarios(),
    mockScenarioRepository.getScenarioMetadata(),
    mockScenarioRepository.getAvailableScenarios(),
  ]);
  return <ScenarioCatalog scenarios={scenarios} stats={stats} availableIds={available.map(item => item.id)} />;
}
