import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { scenarios, getScenario } from "@/data/scenarios";
import { ScenarioPageContent } from "@/components/simulation/scenario-page-content";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return scenarios.filter(scenario => scenario.id !== "pesan-paket").map(scenario => ({ slug: scenario.id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const scenario = getScenario((await params).slug);
  return { title: scenario?.title ?? "Skenario tidak ditemukan" };
}
export default async function Page({ params }: Props) {
  const scenario = getScenario((await params).slug);
  if (!scenario) notFound();
  return <ScenarioPageContent scenario={scenario} />;
}
