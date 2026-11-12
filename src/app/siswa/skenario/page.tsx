import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { scenarioPreviews } from "@/data/scenarios";
export const metadata: Metadata = { title: "Skenario Simulasi" };
export default function Page() {
  return <><Breadcrumb items={[{ label: "Beranda", href: "/siswa" }, { label: "Skenario Simulasi" }]} /><PageHeader eyebrow="TAHAP 03 · LATIHAN LOKAL" title="Berlatih mengambil keputusan." description="Delapan skenario tersedia. Setiap jalur memuat dua keputusan, konsekuensi, ending, dan debriefing. Pilih situasi yang ingin kamu pelajari." /><p className="content-notice">Semua cerita fiktif. Tidak ada transaksi atau pengumpulan data pribadi. Sesi latihan akan direset saat meninggalkan halaman; dashboard tetap memakai angka demo.</p><div className="scenario-catalog">{scenarioPreviews.map((scenario, index) => <article className="simulation-panel" key={scenario.id}><Badge tone="teal">{String(index + 1).padStart(2, "0")} · {scenario.category}</Badge><h2>{scenario.title}</h2><p>{scenario.description}</p><p>{scenario.durationMinutes} menit · {scenario.difficulty}</p><ButtonLink href={`/siswa/skenario/${scenario.id}`}>Buka latihan <ArrowRight size={17} /></ButtonLink></article>)}</div></>;
}
