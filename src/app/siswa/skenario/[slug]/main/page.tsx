import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { scenarioCatalog } from "@/data/scenarios/catalog";
import { ScenarioRunner } from "@/components/simulation/scenario-runner";
import { readyScenario } from "@/lib/scenario-engine/mock-scenario-repository";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return scenarioCatalog.map(item => ({ slug: item.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const scenario = scenarioCatalog.find(item => item.slug === slug);
  return { title: scenario ? `Simulasi: ${scenario.title}` : "Simulasi tidak tersedia" };
}
export default async function Page({ params }: Props) {
  const slug = (await params).slug;
  const metadata = scenarioCatalog.find(item => item.slug === slug);
  const scenario = metadata && readyScenario(metadata);
  if (!scenario) notFound();
  return <ScenarioRunner scenario={scenario} number={scenarioCatalog.findIndex(item => item.id === scenario.id) + 1} />;
}
