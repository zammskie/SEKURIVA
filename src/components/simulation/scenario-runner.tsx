"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, RotateCcw, ShieldCheck } from "lucide-react";
import type { Scenario, ScenarioRunState, ScenarioSpeaker } from "@/lib/scenario-engine/foundation-types";
import { advanceScenario, completeScenario, getScenarioNode, selectScenarioChoice, startScenario } from "@/lib/scenario-engine/foundation-engine";
import { ConsequenceFeedback, DecisionPanel, ScenarioConversation, ScenarioEnding, ScenarioProgressIndicator } from "./scenario-foundation-ui";

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

export function ScenarioRunner({ scenario, number }: { scenario: Scenario; number: number }) {
  const [run, setRun] = useState<ScenarioRunState | null>(null);
  const node = run ? getScenarioNode(scenario, run.currentNodeId) : null;
  const decisionsMade = run?.selectedChoices.length ?? 0;
  const messages = run ? transcriptFor(scenario, run) : [];
  const move = () => setRun(previous => {
    if (!previous) return previous;
    const advanced = advanceScenario(scenario, previous);
    return getScenarioNode(scenario, advanced.currentNodeId).type === "ending" ? completeScenario(scenario, advanced) : advanced;
  });

  return <div className="scenario-runner">
    <div className="scenario-runner-top"><Link href={`/siswa/skenario/${scenario.slug}`} className="dashboard-text-link"><ArrowLeft size={16} aria-hidden="true" />Kembali ke detail</Link><span>SKENARIO {String(number).padStart(2, "0")}</span></div>
    {!run ? <section className="scenario-intro simulation-panel"><div className="scenario-intro-mark"><ShieldCheck size={24} aria-hidden="true" /></div><p className="eyebrow">SIMULASI INTERAKTIF · DATA FIKTIF</p><h1>{scenario.title}</h1><p className="scenario-intro-context">{scenario.context}</p><h2>Yang akan kamu pelajari</h2><ul>{scenario.learningObjectives.map(objective => <li key={objective}>{objective}</li>)}</ul><p className="simulation-caption">Pilihan hanya berlaku di simulasi. Tidak ada pesan, transaksi, pemasangan aplikasi, atau pengiriman data pribadi.</p><button type="button" className="button button-primary" onClick={() => setRun(startScenario(scenario))}>Mulai Simulasi <ArrowRight size={16} aria-hidden="true" /></button></section> : <>
      <header className="scenario-play-header"><div><p className="eyebrow">SKENARIO {String(number).padStart(2, "0")} · {scenario.category}</p><h1>{scenario.title}</h1></div><ScenarioProgressIndicator decisionsMade={decisionsMade} totalDecisionPoints={2} /></header>
      <p className="scenario-safety-note">Ini cerita fiktif. Semua pilihan dan dampaknya hanya terjadi dalam simulasi.</p>
      <ScenarioConversation messages={messages} />
      {node?.type === "message" && <div className="scenario-play-action"><button type="button" className="button button-primary" onClick={move}>Lanjutkan percakapan <ArrowRight size={16} aria-hidden="true" /></button></div>}
      {node?.type === "decision" && <section className="scenario-decision-panel" aria-label="Titik keputusan"><p className="eyebrow">KEPUTUSAN {decisionsMade + (run.pendingChoice ? 0 : 1)} DARI 2</p>{run.pendingChoice ? <ConsequenceFeedback selection={run.pendingChoice} onContinue={move} showResponse={false} /> : <DecisionPanel node={node} onSelect={choiceId => setRun(previous => previous ? selectScenarioChoice(scenario, previous, choiceId) : previous)} />}</section>}
      {node?.type === "ending" && run.completionPayload && <div className="scenario-completion"><ScenarioEnding node={node} /><section className="scenario-completion-summary"><h2>Perjalanan keputusanmu</h2><ol>{run.selectedChoices.map((selection, index) => <li key={selection.choiceId}><span>Keputusan {index + 1}</span><strong>{selection.label}</strong><p>{selection.consequence.description}</p></li>)}</ol><p className="simulation-caption">Simulasi selesai. Riwayat pilihan dan hasil akhir sudah disiapkan untuk debriefing pada Tahap 7; progres belum disimpan permanen.</p></section><div className="scenario-completion-actions"><button type="button" className="button button-secondary" onClick={() => setRun(startScenario(scenario))}><RotateCcw size={16} aria-hidden="true" />Mainkan lagi</button><Link className="button button-primary" href="/siswa/skenario">Kembali ke daftar skenario <ArrowRight size={16} aria-hidden="true" /></Link></div></div>}
    </>}
  </div>;
}
