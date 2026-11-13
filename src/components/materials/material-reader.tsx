import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import type { Material } from "@/lib/materials/types";
import { LearningCheck } from "./learning-check";
import { seedMaterials } from "@/data/materials/seed";

export function MaterialReader({ material, preview = false, previous, next }: { material: Material; preview?: boolean; previous?: Material; next?: Material }) {
  const listHref = preview ? "/admin/materi" : "/siswa/materi";
  const learningChecks = material.learningChecks ?? seedMaterials.find(seed => seed.id === material.id)?.learningChecks ?? [];
  return <>
    <Breadcrumb items={[{ label: preview ? "Dashboard Admin" : "Beranda", href: preview ? "/admin" : "/siswa" }, { label: "Materi", href: listHref }, { label: material.title }]} />
    {preview && <p className="content-notice"><strong>PREVIEW ADMIN</strong> · Tampilan ini tidak dicatat sebagai aktivitas siswa. Materi {material.status}.</p>}
    <PageHeader eyebrow={material.category} title={material.title} description={material.summary}><Badge tone={preview ? "warning" : "teal"}>{preview ? "PREVIEW ADMIN" : "DATA DEMO"}</Badge></PageHeader>
    <p className="material-reader-meta"><Clock3 size={16} aria-hidden="true" />{material.estimatedDuration} menit · {material.difficulty} · {material.status}</p>
    <p className="content-notice">Konten awal mode demo. Materi perlu diperiksa Admin dan divalidasi ahli materi sebelum digunakan secara resmi.</p>
    <div className="material-layout">
      <aside className="material-toc"><p className="eyebrow">DALAM MATERI INI</p><nav aria-label="Daftar isi materi"><a href="#tujuan">Tujuan pembelajaran</a>{material.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.heading}</a>)}{material.redFlags.length > 0 && <a href="#tanda-bahaya">Tanda bahaya</a>}{material.safeActions.length > 0 && <a href="#tindakan-aman">Tindakan aman</a>}{material.keyTakeaways.length > 0 && <a href="#poin-penting">Poin penting</a>}</nav></aside>
      <article className="material-article">
        <section className="material-objectives" id="tujuan"><h2>Tujuan pembelajaran</h2><ul>{material.learningObjectives.map((objective, index) => <li key={`${index}-${objective}`}>{objective}</li>)}</ul></section>
        {material.sections.map(section => <section className="material-section" id={section.id} key={section.id}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph, index) => <p key={`${index}-${paragraph}`}>{paragraph}</p>)}{section.bulletPoints.length > 0 && <ul>{section.bulletPoints.map((point, index) => <li key={`${index}-${point}`}>{point}</li>)}</ul>}{section.optionalCallout && <aside className="material-example"><strong>Catatan penting</strong><p>{section.optionalCallout}</p></aside>}</section>)}
        {material.redFlags.length > 0 && <section className="material-section" id="tanda-bahaya"><h2>Tanda bahaya</h2><ul>{material.redFlags.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul></section>}
        {material.safeActions.length > 0 && <section className="material-section" id="tindakan-aman"><h2>Tindakan aman</h2><ul>{material.safeActions.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul></section>}
        {material.keyTakeaways.length > 0 && <section className="material-section" id="poin-penting"><h2>Poin penting</h2><ul>{material.keyTakeaways.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul></section>}
        {learningChecks.length > 0 && <section className="material-section"><h2>Cek pemahaman</h2><p>Jawaban hanya untuk latihan dan tidak disimpan.</p>{learningChecks.map((check, index) => <LearningCheck key={`${material.id}-${index}`} check={check} />)}</section>}
        {material.references.length > 0 && <section className="material-sources"><h2>Referensi</h2><ul>{material.references.map((reference, index) => <li key={`${index}-${reference.title}`}>{reference.title}{reference.author && ` · ${reference.author}`}{reference.year && ` (${reference.year})`}{reference.url && <span className="material-reference-url"> · {reference.url}</span>}</li>)}</ul></section>}
        <nav className="material-reader-nav" aria-label="Navigasi materi"><Link href={listHref}><ArrowLeft size={16} aria-hidden="true" />Kembali ke daftar materi</Link>{preview ? <Link href={`/admin/materi/${material.id}/edit`}>Kembali ke formulir <ArrowRight size={16} aria-hidden="true" /></Link> : <>{previous && <Link href={`/siswa/materi/${previous.slug}`}><ArrowLeft size={16} aria-hidden="true" />Materi sebelumnya</Link>}{next && <Link href={`/siswa/materi/${next.slug}`}>Materi berikutnya <ArrowRight size={16} aria-hidden="true" /></Link>}</>}</nav>
      </article>
    </div>
  </>;
}
