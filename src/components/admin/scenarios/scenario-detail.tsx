"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  FileCheck,
  Layers3,
  Pencil,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import { useScenarios } from "@/lib/scenario-engine/use-scenarios";
import { localScenarioRepository } from "@/lib/scenario-engine/local-scenario-repository";
import { validateScenarioGraph } from "@/lib/scenario-engine/validate-graph";
import { ScenarioGraphVisualizer } from "./scenario-graph-visualizer";
import { formatDate } from "@/lib/materials/utils";

export function AdminScenarioDetail() {
  const params = useParams<{ id: string }>();
  const { scenarios, refresh } = useScenarios();
  const [activeTab, setActiveTab] = useState<"graph" | "debriefing" | "info">("graph");
  const [notice, setNotice] = useState("");
  const [errorNotice, setErrorNotice] = useState("");

  const scenario = useMemo(() => {
    return (scenarios ?? []).find(s => s.id === params.id || s.slug === params.id);
  }, [scenarios, params.id]);

  const validation = useMemo(() => {
    if (!scenario) return null;
    return validateScenarioGraph(scenario);
  }, [scenario]);

  if (scenarios === null) return <p role="status">Memuat data skenario…</p>;

  if (!scenario) {
    return (
      <div className="material-empty">
        <h2>Skenario tidak ditemukan.</h2>
        <p>Skenario dengan ID atau slug &quot;{params.id}&quot; tidak ditemukan di peramban ini.</p>
        <Link className="dashboard-text-link" href="/admin/skenario">
          Kembali ke daftar skenario
        </Link>
      </div>
    );
  }

  const handlePublish = async () => {
    setNotice("");
    setErrorNotice("");
    const res = await localScenarioRepository.publishScenario(scenario.id);
    if (res.success) {
      setNotice(`Skenario "${scenario.title}" berhasil divalidasi dan diterbitkan.`);
      refresh();
    } else {
      setErrorNotice(`Gagal menerbitkan: ${res.errors.join("; ")}`);
    }
  };

  const handleArchive = async () => {
    setNotice("");
    setErrorNotice("");
    try {
      await localScenarioRepository.archiveScenario(scenario.id);
      setNotice(`Skenario "${scenario.title}" diarsipkan.`);
      refresh();
    } catch (err) {
      setErrorNotice(err instanceof Error ? err.message : "Gagal mengarsipkan.");
    }
  };

  const effectiveStatus = scenario.status === "ready" ? "published" : scenario.status;

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Dashboard Admin", href: "/admin" },
          { label: "Manajemen Skenario", href: "/admin/skenario" },
          { label: scenario.title },
        ]}
      />

      <PageHeader
        eyebrow={`SKENARIO: ${scenario.category.toUpperCase()}`}
        title={scenario.title}
        description={scenario.description}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="button button-secondary" href={`/admin/skenario/${scenario.id}/preview`}>
            <Eye size={16} /> Preview Simulasi
          </Link>
          <Link className="button button-primary" href={`/admin/skenario/${scenario.id}/edit`}>
            <Pencil size={16} /> Edit Skenario
          </Link>
        </div>
      </PageHeader>

      {notice && (
        <div className="admin-alert-banner success" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")}>×</button>
        </div>
      )}
      {errorNotice && (
        <div className="admin-alert-banner danger" role="alert">
          <span>{errorNotice}</span>
          <button type="button" onClick={() => setErrorNotice("")}>×</button>
        </div>
      )}

      {/* Meta Bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <Badge tone={effectiveStatus === "published" ? "success" : effectiveStatus === "archived" ? "neutral" : "warning"}>
          Status: {effectiveStatus.toUpperCase()}
        </Badge>
        <span style={{ fontSize: 12, color: "var(--color-muted)" }}>
          <Clock size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
          Estimasi: {scenario.estimatedDurationMinutes ?? 10} menit · Tingkat: {scenario.difficulty ?? "Dasar"}
        </span>
        <span style={{ fontSize: 12, color: "var(--color-muted)" }}>
          ID: <code>{scenario.id}</code> · Slug: <code>{scenario.slug}</code>
        </span>
        <span style={{ fontSize: 12, color: "var(--color-muted)" }}>
          Diperbarui: {formatDate(scenario.updatedAt)}
        </span>

        {effectiveStatus !== "published" && (
          <button type="button" className="admin-btn-sm admin-btn-subtle" onClick={handlePublish}>
            <CheckCircle2 size={13} /> Terbitkan Sekarang
          </button>
        )}
        {effectiveStatus !== "archived" && (
          <button type="button" className="admin-btn-sm admin-btn-outline" onClick={handleArchive}>
            Arsipkan
          </button>
        )}
      </div>

      {/* Validation Banner */}
      {validation && (
        <div className={`validation-result-panel ${validation.valid ? "valid" : "invalid"}`}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {validation.valid ? (
              <CheckCircle2 size={18} style={{ color: "#21865b" }} />
            ) : (
              <AlertTriangle size={18} style={{ color: "#a83c3c" }} />
            )}
            <strong style={{ fontSize: 13 }}>
              {validation.valid
                ? "Graph Valid: Seluruh alur skenario dapat mencapai ending dan memiliki minimal dua decision points."
                : `Ditemukan ${validation.errors.length} masalah validasi graph:`}
            </strong>
          </div>
          {!validation.valid && (
            <ul className="validation-errors-list">
              {validation.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Tab Navigation */}
      <nav className="admin-tab-nav" aria-label="Navigasi Detail Skenario">
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === "graph" ? "active" : ""}`}
          onClick={() => setActiveTab("graph")}
        >
          <Layers3 size={15} /> Alur Percakapan & Graph
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === "debriefing" ? "active" : ""}`}
          onClick={() => setActiveTab("debriefing")}
        >
          <ShieldCheck size={15} /> Debriefing & Analisis Keputusan
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === "info" ? "active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          <FileCheck size={15} /> Konteks & Tujuan Pembelajaran
        </button>
      </nav>

      {/* Tab 1: Graph Flow Visualizer */}
      {activeTab === "graph" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <ScenarioGraphVisualizer scenario={scenario} />

          <section className="admin-card">
            <h2>Daftar Seluruh Node ({scenario.nodes.length} Node)</h2>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Node ID</th>
                    <th>Tipe</th>
                    <th>Detail Konten / Pertanyaan</th>
                    <th>Tujuan Berikutnya (Edges)</th>
                  </tr>
                </thead>
                <tbody>
                  {scenario.nodes.map(node => (
                    <tr key={node.id}>
                      <td><code>{node.id}</code></td>
                      <td>
                        <Badge tone={node.type === "decision" ? "teal" : node.type === "ending" ? "success" : "neutral"}>
                          {node.type}
                        </Badge>
                      </td>
                      <td style={{ maxWidth: 360 }}>
                        {node.type === "message" && (
                          <div>
                            <strong>[{node.speaker}]</strong>: &quot;{node.content}&quot;
                          </div>
                        )}
                        {node.type === "decision" && (
                          <div>
                            <strong>{node.prompt}</strong>
                            <div style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 4 }}>
                              {node.choices.length} pilihan respons
                            </div>
                          </div>
                        )}
                        {node.type === "ending" && (
                          <div>
                            <strong>{node.title}</strong>: &quot;{node.content}&quot;
                          </div>
                        )}
                      </td>
                      <td>
                        {node.type === "message" && <code>{node.nextNodeId}</code>}
                        {node.type === "decision" && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            {node.choices.map(c => (
                              <div key={c.id} style={{ fontSize: 11 }}>
                                {c.id} → <code>{c.nextNodeId}</code> ({c.consequence.riskLevel})
                              </div>
                            ))}
                          </div>
                        )}
                        {node.type === "ending" && <span style={{ color: "var(--color-muted)", fontSize: 11 }}>[Terminal]</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* Tab 2: Debriefing & Learning */}
      {activeTab === "debriefing" && scenario.learning && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <section className="admin-card">
            <h2>Ringkasan Debriefing & Kesimpulan Edukatif</h2>
            <p style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>
              {scenario.learning.summary}
            </p>
            <div style={{ padding: 14, background: "#f8fafc", borderRadius: 8, borderLeft: "3px solid #19b8a5" }}>
              <strong style={{ fontSize: 12, color: "var(--color-primary)" }}>Kesimpulan Pembelajaran:</strong>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--color-ink)", lineHeight: 1.6 }}>
                {scenario.learning.conclusion}
              </p>
            </div>
          </section>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
            {/* Red Flags */}
            <section className="admin-card">
              <h2>Tanda Bahaya (Red Flags)</h2>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {scenario.learning.redFlags.map(rf => (
                  <li key={rf.id} style={{ padding: 12, background: "#fdf8f8", border: "1px solid #f9d8d8", borderRadius: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: 12, color: "#a83c3c" }}>{rf.title}</strong>
                      <span style={{ fontSize: 11, color: "var(--color-muted)" }}>Node: <code>{rf.nodeId}</code></span>
                    </div>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--color-ink)", lineHeight: 1.5 }}>
                      {rf.description}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Tactics */}
            <section className="admin-card">
              <h2>Taktik Rekayasa Sosial (Social Engineering)</h2>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {scenario.learning.socialEngineeringTactics.map((tactic, idx) => (
                  <li key={idx} style={{ padding: 12, background: "#fffdf5", border: "1px solid #fee8a8", borderRadius: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: 12, color: "#855b16" }}>{tactic.title}</strong>
                      <span style={{ fontSize: 11, color: "var(--color-muted)" }}>Node: <code>{tactic.nodeId}</code></span>
                    </div>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--color-ink)", lineHeight: 1.5 }}>
                      {tactic.description}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Safe Actions */}
          <section className="admin-card">
            <h2>Langkah Pengamanan yang Dianjurkan (Safe Actions)</h2>
            <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, lineHeight: 1.8 }}>
              {scenario.learning.safeActions.map((action, idx) => (
                <li key={idx}>{action}</li>
              ))}
            </ol>
          </section>

          {/* References */}
          <section className="admin-card">
            <h2>Referensi Edukatif Resmi (OJK, BI, Komdigi)</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
              {scenario.learning.references.map((ref, idx) => (
                <div key={idx} style={{ padding: 14, background: "#f8fafc", border: "1px solid var(--color-border)", borderRadius: 8 }}>
                  <strong>{ref.title}</strong>
                  <p style={{ margin: "4px 0 6px", fontSize: 12, color: "var(--color-muted)" }}>{ref.scope}</p>
                  <a href={ref.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#0b7367", wordBreak: "break-all" }}>
                    {ref.url} ↗
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Tab 3: Story Info & Context */}
      {activeTab === "info" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <section className="admin-card">
            <h2>Konteks Situasi</h2>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--color-ink)" }}>
              {scenario.context}
            </p>
          </section>

          <section className="admin-card">
            <h2>Tujuan Pembelajaran Skenario</h2>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, lineHeight: 1.7 }}>
              {scenario.learningObjectives.map((obj, idx) => (
                <li key={idx}>{obj}</li>
              ))}
            </ul>
          </section>

          <section className="admin-card">
            <h2>Keterkaitan Materi Kurikulum</h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              {scenario.relatedMaterials.map(cat => (
                <Badge key={cat} tone="teal">{cat}</Badge>
              ))}
            </div>
          </section>

          <section className="admin-card">
            <h2>Kata Kunci (Keywords)</h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              {scenario.keywords.map(kw => (
                <span key={kw} style={{ padding: "4px 10px", background: "#edf2f5", borderRadius: 4, fontSize: 12 }}>
                  #{kw}
                </span>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
