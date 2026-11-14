import Link from "next/link";
import { ArrowLeft, ArrowRight, MessageSquareText } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import type { ScenarioMetadata } from "@/lib/scenario-engine/foundation-types";
import { ScenarioRelatedMaterials } from "./scenario-related-materials";
import { ScenarioHeader } from "./scenario-foundation-ui";

export function ScenarioDetail({ scenario, number, available }: { scenario: ScenarioMetadata; number: number; available: boolean }) {
  return <>
    <Breadcrumb items={[{ label: "Beranda", href: "/siswa" }, { label: "Skenario Simulasi", href: "/siswa/skenario" }, { label: scenario.title }]} />
    <ScenarioHeader scenario={scenario} number={number} available={available} />
    <div className="scenario-detail-layout"><article className="scenario-detail-main"><section className="scenario-detail-section"><h2>Konteks situasi</h2><p>{scenario.context}</p></section><section className="scenario-detail-section"><h2>Tujuan pembelajaran</h2><ul>{scenario.learningObjectives.map(item => <li key={item}>{item}</li>)}</ul></section><ScenarioRelatedMaterials categories={scenario.relatedMaterials} /></article><aside className="scenario-detail-aside"><MessageSquareText size={26} aria-hidden="true" /><h2>Pendekatan simulasi</h2><p>Informasi disajikan melalui percakapan dan konteks situasi. Kamu akan memilih respons, membaca balasan karakter, lalu melihat konsekuensi simulatif sebelum melanjutkan.</p>{available ? <Link className="button button-primary" href={`/siswa/skenario/${scenario.slug}/main`}>Mulai Simulasi <ArrowRight size={16} /></Link> : <><button className="button button-secondary" type="button" disabled>Mulai Simulasi</button><p className="simulation-caption">Konten simulasi sedang disiapkan.</p></>}</aside></div>
    <Link className="dashboard-text-link" href="/siswa/skenario"><ArrowLeft size={16} aria-hidden="true" />Kembali ke daftar skenario</Link>
  </>;
}
