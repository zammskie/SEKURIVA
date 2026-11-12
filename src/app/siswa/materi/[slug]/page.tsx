import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { materials } from "@/data/materials";
import { getMaterialContent } from "@/data/materials/content";
import { scenariosForMaterial } from "@/data/scenarios";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { LearningCheck } from "@/components/materials/learning-check";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return materials.map(material => ({ slug: material.id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: materials.find(material => material.id === (await params).slug)?.title ?? "Materi tidak ditemukan" };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const summary = materials.find(material => material.id === slug);
  const content = getMaterialContent(slug);
  if (!summary || !content) notFound();
  return <><Breadcrumb items={[{ label: "Beranda", href: "/siswa" }, { label: "Materi", href: "/siswa/materi" }, { label: summary.title }]} /><PageHeader eyebrow={`${summary.category} · ${summary.durationMinutes} MENIT`} title={summary.title} description={summary.description} /><div className="material-layout"><aside className="material-toc"><p className="eyebrow">DALAM MATERI INI</p><nav aria-label="Daftar isi materi">{content.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}<a href="#rangkuman">Rangkuman & refleksi</a><a href="#cek-pemahaman">Cek pemahaman</a><a href="#latihan-terkait">Latihan terkait</a></nav><p className="simulation-caption">Materi dapat dibaca tanpa login. Aktivitas membaca dan jawaban tidak disimpan.</p></aside><article className="material-article"><section className="material-objectives"><h2>Setelah belajar, kamu dapat…</h2><ul>{content.objectives.map(objective => <li key={objective}>{objective}</li>)}</ul></section>{content.sections.map(section => <section className="material-section" id={section.id} key={section.id}><h2>{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<aside className="material-example"><strong>Contoh di sekitarmu</strong><p>{section.example}</p></aside></section>)}<section className="material-section" id="rangkuman"><h2>Bekal yang perlu diingat</h2><ul>{content.checklist.map(item => <li key={item}>{item}</li>)}</ul><h3>Refleksi singkat</h3><p>{content.reflection}</p></section><div id="cek-pemahaman"><LearningCheck key={content.id} check={content.check} /></div><section className="material-section" id="latihan-terkait"><h2>Terapkan melalui simulasi</h2><div className="content-related-links">{scenariosForMaterial(content.id).map(scenario => <Link key={scenario.id} href={`/siswa/skenario/${scenario.id}`}>{scenario.title}<span>Buka latihan →</span></Link>)}</div></section><section className="material-sources"><h2>Referensi pembelajaran</h2><p>Materi disusun ulang untuk latihan siswa. Contoh bersifat fiktif dan bukan petunjuk penanganan kasus individual.</p><ul>{content.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a></li>)}</ul></section><Link className="dashboard-text-link" href="/siswa/materi">← Kembali ke daftar materi</Link></article></div></>;
}
