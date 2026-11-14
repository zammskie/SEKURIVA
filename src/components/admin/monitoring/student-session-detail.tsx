"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import { findDemoUser } from "@/lib/auth/demo-users";
import { localSimulationRepository } from "@/lib/simulation-history/repository";
import { scenarioCatalog } from "@/data/scenarios/catalog";
import { readyScenario } from "@/lib/scenario-engine/mock-scenario-repository";
import { decisionReviews } from "@/lib/simulation-history/review";
import { formatSimulationDate, simulationDuration, simulationStatus } from "@/lib/simulation-history/display";

export function StudentSessionDetail({ backTo = "monitoring" }: { backTo?: "monitoring" | "history" }) {
  const params = useParams<{ studentId?: string; runId: string }>();
  const run = localSimulationRepository.getAny(params.runId);

  const student = run ? findDemoUser(run.userId) : null;
  const metadata = run ? scenarioCatalog.find(s => s.id === run.scenarioId) : null;
  const scenario = run ? (run.scenarioSnapshot ?? (metadata ? readyScenario(metadata) : null)) : null;

  const reviews = useMemo(() => {
    if (!scenario || !run) return [];
    return decisionReviews(scenario, run);
  }, [scenario, run]);

  const payload = run?.runState.completionPayload;
  const ending = useMemo(() => {
    if (!scenario || !payload) return null;
    const found = scenario.nodes.find(n => n.id === payload.endingNodeId);
    return found?.type === "ending" ? found : null;
  }, [scenario, payload]);

  if (!run) {
    return (
      <div className="material-empty">
        <h2>Sesi simulasi tidak ditemukan.</h2>
        <p>Run ID &quot;{params.runId}&quot; tidak tersedia di penyimpanan riwayat lokal.</p>
        <Link className="dashboard-text-link" href={backTo === "monitoring" ? "/admin/pemantauan" : "/admin/riwayat"}>
          Kembali ke {backTo === "monitoring" ? "pemantauan siswa" : "riwayat simulasi"}
        </Link>
      </div>
    );
  }

  const backHref = backTo === "monitoring" && student
    ? `/admin/pemantauan/${student.id}`
    : "/admin/riwayat";

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Dashboard Admin", href: "/admin" },
          backTo === "monitoring" && student
            ? { label: "Pemantauan Progres", href: "/admin/pemantauan" }
            : { label: "Riwayat Simulasi", href: "/admin/riwayat" },
          student ? { label: student.name, href: `/admin/pemantauan/${student.id}` } : { label: "Sesi" },
          { label: `Sesi: ${run.scenarioTitleSnapshot}` },
        ]}
      />

      <PageHeader
        eyebrow="PEMERIKSAAN SESI SIMULASI · RUANG ADMIN"
        title={`Inspeksi Sesi: ${run.scenarioTitleSnapshot}`}
        description={`Pemeriksaan urutan keputusan, umpan balik konsekuensi, dan ending yang dicapai oleh ${student?.name ?? "Siswa"}.`}
      >
        <Link className="button button-secondary" href={backHref}>
          <ArrowLeft size={16} /> Kembali
        </Link>
      </PageHeader>

      <div className="admin-alert-banner info">
        <div>
          <strong>INFORMASI PRIVASI & KEAMANAN</strong> — Seluruh data keputusan di bawah merupakan pilihan pembelajaran interaktif fiktif. Tidak ada data pribadi rahasia, sandi, OTP, atau informasi sensitif yang terekam.
        </div>
        <Badge tone="teal">Data Aman</Badge>
      </div>

      {/* Session Metadata Grid */}
      <section className="admin-card" style={{ marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--color-muted)" }}>Siswa</div>
            <strong style={{ fontSize: 14, color: "var(--color-primary)" }}>{student?.name ?? run.userId}</strong>
            <div style={{ fontSize: 11, color: "var(--color-muted)" }}>{student?.className}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--color-muted)" }}>Status Sesi</div>
            <Badge tone={run.status === "completed" ? "success" : run.status === "awaiting_debriefing" ? "teal" : "warning"}>
              {simulationStatus(run)}
            </Badge>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--color-muted)" }}>Waktu & Durasi</div>
            <div style={{ fontSize: 12 }}>Dimulai: {formatSimulationDate(run.startedAt)}</div>
            <div style={{ fontSize: 12, color: "var(--color-muted)" }}>Durasi: {simulationDuration(run)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--color-muted)" }}>Pembahasan (Debriefing)</div>
            <div style={{ fontSize: 12 }}>
              {run.debriefingViewedAt ? `Dibuka: ${formatSimulationDate(run.debriefingViewedAt)}` : "Belum dibuka siswa"}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--color-muted)" }}>Identifier</div>
            <div style={{ fontSize: 11 }}>Run ID: <code>{run.id}</code></div>
            <div style={{ fontSize: 11, color: "var(--color-muted)" }}>Skenario ID: <code>{run.scenarioId}</code></div>
          </div>
        </div>
      </section>

      {/* Decision Trail Timeline */}
      <section className="admin-card" style={{ marginBottom: 20 }}>
        <h2>Linimasa Keputusan Siswa ({reviews.length} Keputusan)</h2>
        {reviews.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--color-muted)" }}>Belum ada titik keputusan yang diambil pada sesi ini.</p>
        ) : (
          <ol className="review-timeline">
            {reviews.map((item, index) => (
              <li key={item.nodeId}>
                <h3>Keputusan {index + 1}: {item.prompt}</h3>
                {item.context && <p style={{ fontSize: 12, color: "var(--color-muted)" }}>{item.context}</p>}

                <div style={{ margin: "10px 0", padding: "10px 12px", background: "white", border: "1px solid var(--color-border)", borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: "var(--color-muted)", marginBottom: 2 }}>Pilihan Siswa:</div>
                  <strong style={{ fontSize: 13, color: "var(--color-primary)" }}>&quot;{item.selected.label}&quot;</strong>
                  <div style={{ fontSize: 12, color: "var(--color-ink)", marginTop: 4 }}>
                    Balasan simulasi: <em>&quot;{item.selected.response}&quot;</em>
                  </div>
                </div>

                <div style={{ padding: "10px 12px", background: "#fbfcfd", border: "1px solid var(--color-border)", borderRadius: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <Badge tone={item.selected.consequence.riskLevel === "high" ? "danger" : item.selected.consequence.riskLevel === "medium" ? "warning" : "success"}>
                      Tingkat Risiko: {item.selected.consequence.riskLevel.toUpperCase()}
                    </Badge>
                    <strong style={{ fontSize: 12 }}>{item.selected.consequence.title}</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6 }}>{item.selected.consequence.description}</p>
                </div>

                <details style={{ marginTop: 10 }}>
                  <summary style={{ fontSize: 12, color: "#0b7367" }}>Lihat Analisis Pilihan Alternatif</summary>
                  <div style={{ fontSize: 12, lineHeight: 1.6, marginTop: 8 }}>
                    <p><strong>Pilihan lain yang tersedia:</strong></p>
                    <ul style={{ paddingLeft: 18, margin: "4px 0" }}>
                      {item.availableChoices.map(c => (
                        <li key={c.id}>
                          {c.label} {c.id === item.selected.choiceId ? "(Dipilih oleh siswa)" : ""}
                        </li>
                      ))}
                    </ul>
                    <p><strong>Refleksi penting:</strong> {item.why}</p>
                    <p><strong>Tindakan lebih aman:</strong> {item.saferAction}</p>
                    <p><strong>Pelajaran utama:</strong> {item.lesson}</p>
                  </div>
                </details>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Ending Outcome */}
      {ending && (
        <section className="admin-card">
          <h2>Ending yang Dicapai Siswa</h2>
          <div style={{ padding: 16, background: "#f4faf7", borderLeft: "4px solid #21865b", borderRadius: 8 }}>
            <h3 style={{ margin: "0 0 6px", fontSize: 16, color: "#1f6b4a" }}>
              {ending.title}
            </h3>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>
              {ending.content}
            </p>
          </div>
        </section>
      )}
    </>
  );
}
