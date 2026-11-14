"use client";

import { useState } from "react";
import { ArrowRight, RotateCcw, ShieldCheck, X } from "lucide-react";
import type { Scenario, ScenarioRunState, ScenarioSpeaker } from "@/lib/scenario-engine/foundation-types";
import { advanceScenario, completeScenario, getScenarioNode, selectScenarioChoice, startScenario } from "@/lib/scenario-engine/foundation-engine";
import { Badge } from "@/components/ui/badge";
import { ConsequenceFeedback, DecisionPanel, ScenarioConversation, ScenarioEnding, ScenarioProgressIndicator } from "@/components/simulation/scenario-foundation-ui";

type TranscriptMessage = { id: string; speaker: ScenarioSpeaker; content: string };

function transcriptFor(scenario: Scenario, run: ScenarioRunState): TranscriptMessage[] {
  const messages: TranscriptMessage[] = [];
  for (const id of run.visitedNodeIds) {
    const node = getScenarioNode(scenario, id);
    if (node.type === "message") messages.push({ id: node.id, speaker: node.speaker, content: node.content });
    if (node.type === "decision") {
      const selected = run.selectedChoices.find(item => item.nodeId === node.id);
      if (selected) {
        const choice = node.choices.find(item => item.id === selected.choiceId);
        messages.push({ id: `response-${selected.choiceId}`, speaker: choice?.responseSpeaker ?? "Siswa", content: selected.response });
      }
    }
  }
  return messages;
}

export function ScenarioPreviewModal({ scenario, onClose }: { scenario: Scenario; onClose?: () => void }) {
  const [run, setRun] = useState<ScenarioRunState | null>(null);

  const startNew = () => {
    try {
      const state = startScenario(scenario);
      setRun(state);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Skenario belum lolos validasi graph.");
    }
  };

  const node = run ? getScenarioNode(scenario, run.currentNodeId) : null;
  const decisionsMade = run?.selectedChoices.length ?? 0;
  const messages = run ? transcriptFor(scenario, run) : [];

  const handleSelectChoice = (choiceId: string) => {
    if (!run) return;
    const next = selectScenarioChoice(scenario, run, choiceId);
    setRun(next);
  };

  const handleAdvance = () => {
    if (!run) return;
    const advanced = advanceScenario(scenario, run);
    const targetNode = getScenarioNode(scenario, advanced.currentNodeId);
    if (targetNode.type === "ending") {
      setRun(completeScenario(scenario, advanced));
    } else {
      setRun(advanced);
    }
  };

  return (
    <div className="scenario-runner" style={{ margin: "0 auto", maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Badge tone="warning">MODE PREVIEW ADMIN</Badge>
          <span style={{ fontSize: 12, color: "var(--color-muted)" }}>
            Tidak mencatat riwayat atau progres siswa
          </span>
        </div>
        {onClose && (
          <button type="button" className="admin-btn-sm admin-btn-outline" onClick={onClose}>
            <X size={15} /> Tutup Preview
          </button>
        )}
      </div>

      {!run ? (
        <section className="scenario-intro simulation-panel">
          <div className="scenario-intro-mark">
            <ShieldCheck size={24} aria-hidden="true" />
          </div>
          <p className="eyebrow">PENGUJIAN SKENARIO · RUANG ADMIN</p>
          <h1>{scenario.title}</h1>
          <p className="scenario-intro-context">{scenario.context}</p>
          <h2>Tujuan Pembelajaran Skenario</h2>
          <ul>
            {scenario.learningObjectives.map(obj => (
              <li key={obj}>{obj}</li>
            ))}
          </ul>
          <p className="simulation-caption">
            Anda sedang menguji alur percakapan, titik keputusan, respon, konsekuensi, dan ending skenario ini secara langsung di mesin simulasi.
          </p>
          <button type="button" className="button button-primary" onClick={startNew}>
            Mulai Pengujian Simulasi <ArrowRight size={16} aria-hidden="true" />
          </button>
        </section>
      ) : (
        <>
          <header className="scenario-play-header">
            <div>
              <p className="eyebrow">PENGUJIAN SIMULASI · {scenario.category}</p>
              <h1>{scenario.title}</h1>
            </div>
            <ScenarioProgressIndicator decisionsMade={decisionsMade} totalDecisionPoints={2} />
          </header>

          <ScenarioConversation messages={messages} />

          {node?.type === "message" && (
            <div className="scenario-play-action">
              <button type="button" className="button button-primary" onClick={handleAdvance}>
                Lanjutkan percakapan <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          )}

          {node?.type === "decision" && (
            <section className="scenario-decision-panel" aria-label="Titik keputusan">
              <p className="eyebrow">KEPUTUSAN {decisionsMade + (run.pendingChoice ? 0 : 1)} DARI 2</p>
              {run.pendingChoice ? (
                <ConsequenceFeedback
                  selection={run.pendingChoice}
                  onContinue={handleAdvance}
                  showResponse={false}
                />
              ) : (
                <DecisionPanel
                  node={node}
                  onSelect={handleSelectChoice}
                />
              )}
            </section>
          )}

          {node?.type === "ending" && run.completionPayload && (
            <div className="scenario-completion">
              <ScenarioEnding node={node} />
              <section className="scenario-completion-summary">
                <h2>Rangkuman Jalur Keputusan</h2>
                <ol>
                  {run.selectedChoices.map((selection, idx) => (
                    <li key={selection.choiceId}>
                      <span>Keputusan {idx + 1}</span>
                      <strong>{selection.label}</strong>
                      <p>{selection.consequence.description}</p>
                    </li>
                  ))}
                </ol>
                <div style={{ marginTop: 16, padding: 14, background: "#edf8f3", border: "1px solid #b7e3cd", borderRadius: 8 }}>
                  <strong style={{ color: "#1f6b4a", display: "block", marginBottom: 4 }}>
                    ✓ Pengujian Selesai Sukses
                  </strong>
                  <p style={{ margin: 0, fontSize: 12, color: "#176054" }}>
                    Ending &quot;{node.title}&quot; berhasil dicapai melalui jalur keputusan di atas. Data pengujian tidak disimpan ke database progres siswa.
                  </p>
                </div>
              </section>

              <div className="scenario-completion-actions">
                <button type="button" className="button button-primary" onClick={startNew}>
                  <RotateCcw size={16} aria-hidden="true" /> Uji Jalur Lain
                </button>
                {onClose && (
                  <button type="button" className="button button-secondary" onClick={onClose}>
                    Selesai & Tutup
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
