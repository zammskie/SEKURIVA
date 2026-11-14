"use client";

import { useMemo } from "react";
import { ArrowDown, HelpCircle, MessageSquare, ShieldAlert, Sparkles } from "lucide-react";
import type { Scenario, DecisionNode } from "@/lib/scenario-engine/foundation-types";
import { Badge } from "@/components/ui/badge";

export function ScenarioGraphVisualizer({ scenario }: { scenario: Scenario }) {
  const messages = useMemo(() => scenario.nodes.filter(n => n.type === "message"), [scenario.nodes]);
  const decisions = useMemo(() => scenario.nodes.filter(n => n.type === "decision") as DecisionNode[], [scenario.nodes]);
  const endings = useMemo(() => scenario.nodes.filter(n => n.type === "ending"), [scenario.nodes]);

  return (
    <div className="graph-visualizer-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, color: "var(--color-primary)" }}>Peta Alur Skenario (Graph Flow)</h3>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--color-muted)" }}>
            Node Awal: <code>{scenario.startNodeId}</code> · Total Node: {scenario.nodes.length} ({messages.length} Pesan, {decisions.length} Keputusan, {endings.length} Ending)
          </p>
        </div>
        <Badge tone="teal">Visualisasi Interaktif</Badge>
      </div>

      <div className="graph-flow">
        {/* Step 1: Start & Opening Messages */}
        <div className="graph-step">
          <div className="graph-step-title">
            <MessageSquare size={14} />
            <span>Bagian Pembuka (Opening)</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.slice(0, 5).map(node => (
              <div key={node.id} className="graph-node-card message">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <strong>ID: {node.id}</strong>
                  <Badge tone="neutral">{node.speaker}</Badge>
                </div>
                <div style={{ fontSize: 12, color: "var(--color-ink)", marginBottom: 4 }}>
                  &quot;{node.content.length > 90 ? node.content.slice(0, 90) + "…" : node.content}&quot;
                </div>
                <div style={{ fontSize: 11, color: "var(--color-muted)" }}>
                  Lanjut ke: <code>{node.nextNodeId}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <ArrowDown size={20} style={{ color: "var(--color-muted)" }} />
        </div>

        {/* Step 2: Decision 1 */}
        {decisions[0] && (
          <div className="graph-step">
            <div className="graph-step-title">
              <HelpCircle size={14} style={{ color: "#19b8a5" }} />
              <span>Titik Keputusan 1 (Decision Point 1) — ID: {decisions[0].id}</span>
            </div>
            <div className="graph-node-card decision">
              <strong style={{ fontSize: 14, color: "var(--color-primary)" }}>{decisions[0].prompt}</strong>
              {decisions[0].context && (
                <p style={{ margin: "4px 0 8px", fontSize: 12, color: "var(--color-muted)" }}>{decisions[0].context}</p>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginTop: 10 }}>
                {decisions[0].choices.map(choice => (
                  <div key={choice.id} style={{ padding: 10, background: "white", border: "1px solid var(--color-border)", borderRadius: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: 12 }}>{choice.id}</strong>
                      <span className={`graph-choice-tag risk-${choice.consequence.riskLevel}`}>
                        {choice.consequence.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ margin: "4px 0", fontSize: 12, fontWeight: 500 }}>&quot;{choice.label}&quot;</p>
                    <div style={{ fontSize: 11, color: "#0b7367" }}>
                      Tujuan Cabang: <code>{choice.nextNodeId}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center" }}>
          <ArrowDown size={20} style={{ color: "var(--color-muted)" }} />
        </div>

        {/* Step 3: Branching Decisions (Decision 2a & 2b) */}
        {decisions.length > 1 && (
          <div className="graph-step">
            <div className="graph-step-title">
              <ShieldAlert size={14} style={{ color: "#d99a32" }} />
              <span>Percabangan Keputusan Lanjutan (Branch Decisions)</span>
            </div>
            <div className="graph-branches-grid">
              {decisions.slice(1).map((dec, idx) => (
                <div key={dec.id} className="graph-node-card decision">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <Badge tone="warning">Cabang {idx === 0 ? "A" : "B"}</Badge>
                    <span style={{ fontSize: 11, color: "var(--color-muted)" }}>ID: {dec.id}</span>
                  </div>
                  <strong style={{ fontSize: 13, color: "var(--color-primary)" }}>{dec.prompt}</strong>
                  {dec.context && (
                    <p style={{ margin: "4px 0 8px", fontSize: 11, color: "var(--color-muted)" }}>{dec.context}</p>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
                    {dec.choices.map(choice => (
                      <div key={choice.id} style={{ padding: 8, background: "white", border: "1px solid var(--color-border)", borderRadius: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 11, fontWeight: 700 }}>{choice.id}</span>
                          <span className={`graph-choice-tag risk-${choice.consequence.riskLevel}`}>
                            {choice.consequence.riskLevel}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, margin: "2px 0" }}>{choice.label}</div>
                        <div style={{ fontSize: 11, color: "#21865b" }}>
                          Menuju Ending: <code>{choice.nextNodeId}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center" }}>
          <ArrowDown size={20} style={{ color: "var(--color-muted)" }} />
        </div>

        {/* Step 4: Endings */}
        <div className="graph-step">
          <div className="graph-step-title">
            <Sparkles size={14} style={{ color: "#21865b" }} />
            <span>Hasil Akhir Simulasi (Ending Nodes)</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {endings.map(ending => (
              <div key={ending.id} className="graph-node-card ending">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <Badge tone="success">Ending</Badge>
                  <span style={{ fontSize: 11, color: "var(--color-muted)" }}>{ending.id}</span>
                </div>
                <strong style={{ fontSize: 13, color: "var(--color-primary)" }}>{ending.title}</strong>
                <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--color-ink)", lineHeight: 1.5 }}>
                  {ending.content.length > 100 ? ending.content.slice(0, 100) + "…" : ending.content}
                </p>
                {scenario.learning?.endingAnalyses[ending.id] && (
                  <div style={{ marginTop: 8, fontSize: 11, color: "var(--color-muted)", borderTop: "1px dashed var(--color-border)", paddingTop: 6 }}>
                    Analisis: {scenario.learning.endingAnalyses[ending.id]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
