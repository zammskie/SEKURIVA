import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { scenarioCatalog } from "@/data/scenarios/catalog";
import { ScenarioDetail } from "@/components/simulation/scenario-detail";
import { mockScenarioRepository, readyScenario } from "@/lib/scenario-engine/mock-scenario-repository";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return scenarioCatalog.map(item => ({ slug: item.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const scenario = await mockScenarioRepository.getScenarioBySlug((await params).slug);
  return { title: scenario?.title ?? "Skenario tidak ditemukan" };
}
export default async function Page({ params }: Props) {
  const scenario = await mockScenarioRepository.getScenarioBySlug((await params).slug);
  if (!scenario) notFound();
  return <ScenarioDetail scenario={scenario} number={scenarioCatalog.findIndex(item => item.id === scenario.id) + 1} available={Boolean(readyScenario(scenario))} />;
}
