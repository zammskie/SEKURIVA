"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock3, Eye, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import { formatDate } from "@/lib/materials/utils";
import { useMaterials } from "@/lib/materials/use-materials";

export function AdminMaterialDetail() {
  const params = useParams<{ id: string }>();
  const materials = useMaterials();

  if (materials === null) return <p role="status">Memuat detail materi…</p>;

  const material = materials.find(item => item.id === params.id);
  if (!material) {
    return (
      <div className="material-empty">
        <h1>Materi tidak ditemukan.</h1>
        <p>Materi dengan ID tersebut tidak tersedia di peramban ini.</p>
        <Link className="dashboard-text-link" href="/admin/materi">
          Kembali ke daftar materi
        </Link>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Dashboard Admin", href: "/admin" },
          { label: "Manajemen Materi", href: "/admin/materi" },
          { label: material.title },
        ]}
      />

      <PageHeader
        eyebrow={`KATEGORI: ${material.category.toUpperCase()}`}
        title={material.title}
        description={material.summary}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="button button-secondary" href={`/admin/materi/${material.id}/preview`}>
            <Eye size={16} /> Preview Tampilan
          </Link>
          <Link className="button button-primary" href={`/admin/materi/${material.id}/edit`}>
            <Pencil size={16} /> Edit Materi
          </Link>
        </div>
      </PageHeader>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <Badge tone={material.status === "Published" ? "success" : material.status === "Archived" ? "neutral" : "warning"}>
          Status: {material.status}
        </Badge>
        <span style={{ fontSize: 12, color: "var(--color-muted)" }}>
          <Clock3 size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
          Estimasi: {material.estimatedDuration} menit · Tingkat: {material.difficulty}
        </span>
        <span style={{ fontSize: 12, color: "var(--color-muted)" }}>
          ID: <code>{material.id}</code> · Slug: <code>{material.slug}</code>
        </span>
        <span style={{ fontSize: 12, color: "var(--color-muted)" }}>
          Diperbarui: {formatDate(material.updatedAt)}
        </span>
      </div>

      <div className="scenario-detail-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Learning Objectives */}
          <section className="admin-card">
            <h2>Tujuan Pembelajaran</h2>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7, fontSize: 13 }}>
              {material.learningObjectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </section>

          {/* Sections Content */}
          <section className="admin-card">
            <h2>Isi Materi ({material.sections.length} Bagian)</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {material.sections.map((section, idx) => (
                <article
                  key={section.id || idx}
                  style={{
                    padding: "16px 18px",
                    background: "#fbfcfd",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                >
                  <h3 style={{ fontSize: 15, color: "var(--color-primary)", marginBottom: 10 }}>
                    Bagian {idx + 1}: {section.heading}
                  </h3>
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} style={{ fontSize: 13, lineHeight: 1.7, margin: "8px 0" }}>
                      {p}
                    </p>
                  ))}
                  {section.bulletPoints.length > 0 && (
                    <ul style={{ margin: "8px 0", paddingLeft: 20, fontSize: 13, lineHeight: 1.7 }}>
                      {section.bulletPoints.map((bp, bpIdx) => (
                        <li key={bpIdx}>{bp}</li>
                      ))}
                    </ul>
                  )}
                  {section.optionalCallout && (
                    <div
                      style={{
                        marginTop: 10,
                        padding: "10px 14px",
                        background: "#eaf3f5",
                        borderLeft: "3px solid #19b8a5",
                        borderRadius: 4,
                        fontSize: 12,
                        color: "#173b57",
                      }}
                    >
                      <strong>Catatan Penting:</strong> {section.optionalCallout}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* Key Takeaways, Red flags, Safe Actions */}
          <section className="admin-card">
            <h2>Poin Penting & Tindakan Pengamanan</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              {material.keyTakeaways.length > 0 && (
                <div style={{ padding: 14, background: "#f8fafb", borderRadius: 8, border: "1px solid var(--color-border)" }}>
                  <h3 style={{ color: "#173b57" }}>Poin Inti (Takeaways)</h3>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, lineHeight: 1.6 }}>
                    {material.keyTakeaways.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {material.redFlags.length > 0 && (
                <div style={{ padding: 14, background: "#fdf8f8", borderRadius: 8, border: "1px solid #f9d8d8" }}>
                  <h3 style={{ color: "#a83c3c" }}>Tanda Bahaya (Red Flags)</h3>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, lineHeight: 1.6 }}>
                    {material.redFlags.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {material.safeActions.length > 0 && (
                <div style={{ padding: 14, background: "#f4faf7", borderRadius: 8, border: "1px solid #cce8db" }}>
                  <h3 style={{ color: "#21865b" }}>Tindakan Aman</h3>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, lineHeight: 1.6 }}>
                    {material.safeActions.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <section className="admin-card">
            <h2>Referensi & Rujukan</h2>
            {material.references.length === 0 ? (
              <p style={{ fontSize: 12, color: "var(--color-muted)" }}>Belum ada referensi resmi tercatat.</p>
            ) : (
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {material.references.map((ref, idx) => (
                  <li
                    key={idx}
                    style={{
                      padding: 12,
                      background: "#f8fafc",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  >
                    <strong>{ref.title}</strong>
                    <div style={{ color: "var(--color-muted)", fontSize: 11, marginTop: 2 }}>
                      {ref.author} ({ref.year})
                    </div>
                    {ref.url && (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#0b7367", wordBreak: "break-all", fontSize: 11, display: "block", marginTop: 4 }}
                      >
                        {ref.url} ↗
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="admin-card">
            <h2>Navigasi Cepat</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Link className="admin-btn-sm admin-btn-outline" href="/admin/materi">
                <ArrowLeft size={14} /> Kembali ke Daftar Materi
              </Link>
              <Link className="admin-btn-sm admin-btn-subtle" href={`/admin/materi/${material.id}/preview`}>
                <Eye size={14} /> Preview Bacaan Siswa
              </Link>
              <Link className="admin-btn-sm admin-btn-subtle" href={`/admin/materi/${material.id}/edit`}>
                <Pencil size={14} /> Edit Materi Ini
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
