import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import { ScenarioPlayer } from "./scenario-player";
import { validateScenario } from "@/lib/scenario-engine/validate";
import type { Scenario } from "@/lib/types/simulation";

export function ScenarioPageContent({ scenario }: { scenario: Scenario }) {
  const errors = validateScenario(scenario);
  if (errors.length) throw new Error(errors.join(" "));
  return <><Breadcrumb items={[{ label: "Beranda", href: "/siswa" }, { label: "Skenario", href: "/siswa/skenario" }, { label: scenario.title }]} /><PageHeader title={scenario.title} description="Baca situasi, tentukan tindakan, dan pelajari konsekuensi pilihanmu." /><ScenarioPlayer key={scenario.id} scenario={scenario} /></>;
}
