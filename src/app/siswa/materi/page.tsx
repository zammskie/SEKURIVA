import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { materials } from "@/data/materials";

export const metadata: Metadata = { title: "Materi Pembelajaran" };
export default function Page() {
  return (
    <>
      <Breadcrumb items={[{ label: "Beranda", href: "/siswa" }, { label: "Materi Pembelajaran" }]} />
      <PageHeader title="Materi Pembelajaran" description="Pelajari kebiasaan aman, periksa pemahamanmu, lalu terapkan di skenario terkait." />
      <div className="material-catalog">
        {materials.map(material => (
          <article className="simulation-panel" key={material.id}>
            <Badge tone="teal">{material.category}</Badge>
            <h2>{material.title}</h2>
            <p>{material.description}</p>
            <p className="simulation-caption">{material.durationMinutes} menit · {material.lessonCount} topik · Cek pemahaman</p>
            <ButtonLink href={"/siswa/materi/" + material.id}>Baca materi <ArrowRight size={17} aria-hidden="true" /></ButtonLink>
          </article>
        ))}
      </div>
    </>
  );
}
