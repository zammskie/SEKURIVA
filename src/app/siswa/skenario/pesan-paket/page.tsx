import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import { ScenarioPlayer } from "@/components/simulation/scenario-player";
import { packageScenario } from "@/data/scenarios/pesan-paket";
import { validateScenario } from "@/lib/scenario-engine/validate";
export const metadata: Metadata = { title: "Latihan Pesan dari Kurir Paket" };
export default function Page() {
  const errors = validateScenario(packageScenario);
  if (errors.length) throw new Error(errors.join(" "));
  return <><Breadcrumb items={[{ label: "Beranda", href: "/siswa" }, { label: "Skenario", href: "/siswa/skenario" }, { label: "Pesan dari Kurir Paket" }]} /><PageHeader title={packageScenario.title} description="Baca situasi, tentukan tindakan, dan pelajari konsekuensi pilihanmu." /><ScenarioPlayer scenario={packageScenario} /></>;
}
