"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, RotateCcw, ShieldCheck } from "lucide-react";
import type { Scenario, ScenarioRunState, ScenarioSpeaker } from "@/lib/scenario-engine/foundation-types";
import { advanceScenario, completeScenario, getScenarioNode, selectScenarioChoice, startScenario } from "@/lib/scenario-engine/foundation-engine";
import { DEMO_STUDENT_ID, localSimulationRepository } from "@/lib/simulation-history/repository";
import type { SimulationRecord } from "@/lib/simulation-history/types";
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
  const [stored, setStored] = useState<SimulationRecord | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const snapshot = localSimulationRepository.list(DEMO_STUDENT_ID);
    const latest = snapshot.records.find(item => item.scenarioId === scenario.id);
    queueMicrotask(() => {
      if (latest && latest.status !== "completed") setStored(latest);
      if (snapshot.warning) setError(snapshot.warning);
      setLoaded(true);
    });
  }, [scenario.id]);

  const run = stored?.runState ?? null;
  const node = run ? getScenarioNode(scenario, run.currentNodeId) : null;
  const decisionsMade = run?.selectedChoices.length ?? 0;
  const messages = run ? transcriptFor(scenario, run) : [];
  const startNew = () => {
    try {
      const next = startScenario(scenario);
      setStored(localSimulationRepository.create(DEMO_STUDENT_ID, scenario, next));
      setError(null);
    } catch { setError("Sesi tidak dapat disimpan di browser ini. Periksa izin penyimpanan, lalu coba lagi."); }
  };
  const persist = (next: ScenarioRunState) => {
    if (!stored) return;
    try { setStored(localSimulationRepository.saveState(DEMO_STUDENT_ID, stored.id, next)); setError(null); }
    catch { setError("Langkah ini belum tersimpan. Coba lagi sebelum meninggalkan halaman."); }
  };
  const move = () => {
    if (!run) return;
    const advanced = advanceScenario(scenario, run);
    persist(getScenarioNode(scenario, advanced.currentNodeId).type === "ending" ? completeScenario(scenario, advanced) : advanced);
  };

  return <div className="scenario-runner">
    <div className="scenario-runner-top"><Link href={`/siswa/skenario/${scenario.slug}`} className="dashboard-text-link"><ArrowLeft size={16} aria-hidden="true" />Kembali ke detail</Link><span>SKENARIO {String(number).padStart(2, "0")}</span></div>
    {error && <p className="scenario-storage-warning" role="alert">{error}</p>}
    {!loaded ? <p>Memuat sesi simulasi…</p> : !run ? <section className="scenario-intro simulation-panel"><div className="scenario-intro-mark"><ShieldCheck size={24} aria-hidden="true" /></div><p className="eyebrow">SIMULASI INTERAKTIF · DATA FIKTIF</p><h1>{scenario.title}</h1><p className="scenario-intro-context">{scenario.context}</p><h2>Yang akan kamu pelajari</h2><ul>{scenario.learningObjectives.map(objective => <li key={objective}>{objective}</li>)}</ul><p className="simulation-caption">Pilihan hanya berlaku di simulasi. Sesi disimpan sementara di browser ini untuk pengguna demo. Tidak ada pesan, transaksi, pemasangan aplikasi, atau pengiriman data pribadi.</p><button type="button" className="button button-primary" onClick={startNew}>Mulai Simulasi <ArrowRight size={16} aria-hidden="true" /></button></section> : <>
      <header className="scenario-play-header"><div><p className="eyebrow">SKENARIO {String(number).padStart(2, "0")} · {scenario.category}</p><h1>{scenario.title}</h1></div><ScenarioProgressIndicator decisionsMade={decisionsMade} totalDecisionPoints={2} /></header>
      <p className="scenario-safety-note">Ini cerita fiktif. Semua pilihan dan dampaknya hanya terjadi dalam simulasi.</p>
      <ScenarioConversation messages={messages} />
      {node?.type === "message" && <div className="scenario-play-action"><button type="button" className="button button-primary" onClick={move}>Lanjutkan percakapan <ArrowRight size={16} aria-hidden="true" /></button></div>}
      {node?.type === "decision" && <section className="scenario-decision-panel" aria-label="Titik keputusan"><p className="eyebrow">KEPUTUSAN {decisionsMade + (run.pendingChoice ? 0 : 1)} DARI 2</p>{run.pendingChoice ? <ConsequenceFeedback selection={run.pendingChoice} onContinue={move} showResponse={false} /> : <DecisionPanel node={node} onSelect={choiceId => persist(selectScenarioChoice(scenario, run, choiceId))} />}</section>}
      {node?.type === "ending" && run.completionPayload && stored && <div className="scenario-completion"><ScenarioEnding node={node} /><section className="scenario-completion-summary"><h2>Perjalanan keputusanmu</h2><ol>{run.selectedChoices.map((selection, index) => <li key={selection.choiceId}><span>Keputusan {index + 1}</span><strong>{selection.label}</strong><p>{selection.consequence.description}</p></li>)}</ol><p className="simulation-caption">Simulasi selesai. Buka pembahasan agar skenario dihitung selesai pada progres belajarmu.</p></section><div className="scenario-completion-actions"><Link className="button button-primary" href={`/siswa/pembahasan/${stored.id}`}>Tampilkan Pembahasan <ArrowRight size={16} aria-hidden="true" /></Link><button type="button" className="button button-secondary" onClick={startNew}><RotateCcw size={16} aria-hidden="true" />Mainkan lagi</button><Link className="button button-secondary" href="/siswa/skenario">Kembali ke daftar skenario</Link></div></div>}
    </>}
  </div>;
}
