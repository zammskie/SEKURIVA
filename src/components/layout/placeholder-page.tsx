import { ArrowLeft, ArrowLeftRight, Info } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PreviewRole } from "./navigation";

export function PlaceholderPage({ role, title, description, future }: { role: PreviewRole; title: string; description: string; future: string }) {
  return <><Breadcrumb items={[{ label: role === "admin" ? "Dashboard" : "Beranda", href: `/${role}` }, { label: title }]} /><PageHeader eyebrow={role === "admin" ? "RUANG ADMIN" : "RUANG BELAJAR"} title={title} description={description}><Badge tone="neutral">Fondasi tahap 1</Badge></PageHeader><section className="placeholder-panel"><EmptyState title="Ruang ini sedang dipersiapkan." description={future}><ButtonLink href={`/${role}`}><ArrowLeft size={17} />Kembali ke {role === "admin" ? "dashboard" : "beranda"}</ButtonLink><ButtonLink href="/preview" variant="ghost"><ArrowLeftRight size={17} />Ganti peran preview</ButtonLink></EmptyState><div className="placeholder-info"><Info size={19} aria-hidden="true" /><p><strong>Anda sedang melihat frontend preview.</strong> Pada tahap ini, halaman tersedia untuk pemeriksaan tampilan dan navigasi. Belum ada aktivitas pembelajaran atau data yang disimpan.</p></div></section></>;
}
