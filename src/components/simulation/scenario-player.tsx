"use client";
import { useEffect, useReducer, useRef } from "react";
import { ArrowRight, RotateCcw, ShieldCheck } from "lucide-react";
import type { Scenario, ScenarioProgress } from "@/lib/types/simulation";
import { advanceScenario, startScenario } from "@/lib/scenario-engine/engine";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { materials } from "@/data/materials";
interface Session { progress: ScenarioProgress | null; pending: string | null; restart: boolean }
type Action = { type: "start" } | { type: "restart" } | { type: "cancel" } | { type: "choose"; id: string } | { type: "continue"; nodeId: string };
export function ScenarioPlayer({ scenario }: { scenario: Scenario }) {
  const [session, dispatch] = useReducer((state: Session, action: Action): Session => {
    if (action.type === "restart") return { ...state, restart: true };
    if (action.type === "cancel") return { ...state, restart: false };
    if (action.type === "start") return { progress: startScenario(scenario), pending: null, restart: false };
    if (!state.progress || state.progress.status !== "in_progress") return state;
    const current = scenario.nodes.find(node => node.id === state.progress?.currentNodeId);
    if (action.type === "choose") {
      if (state.pending || current?.type !== "decision" || !current.choices.some(choice => choice.id === action.id)) return state;
      return { ...state, pending: action.id };
    }
    if (action.nodeId !== current?.id || state.restart) return state;
    if (current?.type === "decision" && !state.pending) return state;
    return { ...state, progress: advanceScenario(scenario, state.progress, state.pending ?? undefined), pending: null };
  }, { progress: null, pending: null, restart: false });
  const heading = useRef<HTMLHeadingElement>(null);
  const node = scenario.nodes.find(item => item.id === session.progress?.currentNodeId);
  const selected = node?.type === "decision" ? node.choices.find(choice => choice.id === session.pending) : undefined;
  useEffect(() => { if (node) heading.current?.focus(); }, [node]);
  return <div className="simulation-player">
    <div className="simulation-notice"><ShieldCheck size={19} aria-hidden="true" /><p><strong>Latihan lokal · tanpa akun nyata.</strong> Tidak ada berkas, kode, atau pesan yang dikirim. Progres hilang saat halaman dimuat ulang atau ditinggalkan. Angka dashboard tetap data demo terpisah.</p></div>
    {!session.progress ? <section className="simulation-panel"><Badge tone="teal">Skenario 01 · {scenario.difficulty}</Badge><h2>Siap memeriksa pesan yang masuk?</h2><p>{scenario.description}</p><h3>Tujuan pembelajaran</h3><ul>{scenario.learningObjectives.map(objective => <li key={objective}>{objective}</li>)}</ul><p>Perkiraan {scenario.estimatedMinutes} menit. Tanpa batas waktu atau peringkat.</p><Button onClick={() => dispatch({ type: "start" })}>Mulai latihan <ArrowRight size={17} /></Button></section> : <>
      <div className="simulation-toolbar"><Badge tone={session.progress.status === "completed" ? "success" : "teal"}>{session.progress.status === "completed" ? "Latihan selesai" : "Latihan berlangsung"}</Badge><span>{session.progress.choiceHistory.length} keputusan dibuat</span><Button variant="ghost" onClick={() => dispatch({ type: "restart" })}><RotateCcw size={16} />Ulangi</Button></div>
      {session.restart && <section className="simulation-reset" aria-label="Konfirmasi ulangi latihan"><p>Mulai lagi dari awal? Pilihan pada sesi ini akan dihapus.</p><Button onClick={() => dispatch({ type: "start" })}>Ya, mulai ulang</Button><Button variant="secondary" onClick={() => dispatch({ type: "cancel" })}>Lanjutkan sesi ini</Button></section>}
      {node && <section className="simulation-panel" aria-labelledby="simulation-heading"><p className="eyebrow">{node.type === "decision" ? "TITIK KEPUTUSAN" : node.type === "debriefing" ? "DEBRIEFING" : node.type === "ending" ? "HASIL PILIHANMU" : "SITUASI"}</p><h2 id="simulation-heading" ref={heading} tabIndex={-1}>{node.title}</h2>
        {(node.type === "narrative" || node.type === "decision") && <div className={`simulation-messages simulation-${node.presentation}`}>{node.messages.map(message => <div key={message.id} className="simulation-message"><strong>{message.displayName}</strong><p>{message.text}</p></div>)}</div>}
        {node.type === "decision" && <><fieldset className="simulation-choices" disabled={!!selected || session.restart}><legend>{node.prompt}</legend>{node.choices.map((choice, index) => <button key={choice.id} type="button" aria-pressed={selected?.id === choice.id} onClick={() => dispatch({ type: "choose", id: choice.id })}><span>{String.fromCharCode(65 + index)}</span>{choice.label}</button>)}</fieldset>{selected && <div className={`simulation-feedback simulation-feedback-${selected.consequence.kind}`} role="status"><p>Pilihanmu: {selected.response}</p><h3>{selected.consequence.feedback}</h3><p>{selected.consequence.explanation}</p><Button disabled={session.restart} onClick={() => dispatch({ type: "continue", nodeId: node.id })}>Lanjutkan situasi <ArrowRight size={16} /></Button></div>}</>}
        {node.type === "narrative" && <Button disabled={session.restart} onClick={() => dispatch({ type: "continue", nodeId: node.id })}>Lihat pesan <ArrowRight size={16} /></Button>}
        {node.type === "ending" && <><Badge tone={node.outcome === "safe" ? "success" : "warning"}>{node.outcome === "safe" ? "Langkah aman" : "Bahan refleksi"}</Badge><p className="simulation-ending">{node.summary}</p><Button disabled={session.restart} onClick={() => dispatch({ type: "continue", nodeId: node.id })}>Buka debriefing <ArrowRight size={16} /></Button></>}
        {node.type === "debriefing" && <div className="simulation-debrief"><h3>{node.debriefing.title}</h3><p>{node.debriefing.summary}</p><div className="simulation-debrief-grid"><section><h3>Tanda yang perlu dikenali</h3><ul>{node.debriefing.warningSigns.map(sign => <li key={sign}>{sign}</li>)}</ul></section><section><h3>Langkah yang lebih aman</h3><ul>{node.debriefing.recommendedActions.map(action => <li key={action}>{action}</li>)}</ul></section></div><section><h3>Renungkan kembali</h3><ol>{node.debriefing.reflectionQuestions.map(question => <li key={question}>{question}</li>)}</ol><p className="simulation-caption">Jawab untuk dirimu sendiri atau diskusikan bersama guru. Jawaban tidak dikumpulkan.</p></section><section><h3>Topik untuk dipelajari selanjutnya</h3><p>{node.debriefing.relatedMaterialIds.map(id => materials.find(material => material.id === id)?.title).filter(Boolean).join(" · ")}</p><p className="simulation-caption">Halaman materi masih berupa pratinjau.</p></section><ButtonLink href="/siswa/skenario">Kembali ke daftar skenario</ButtonLink></div>}
      </section>}
      {session.progress.choiceHistory.length > 0 && <details className="simulation-history" open={session.progress.status === "completed"}><summary>Jejak keputusan sesi ini ({session.progress.choiceHistory.length})</summary><ol>{session.progress.choiceHistory.map(record => { const previous = scenario.nodes.find(item => item.id === record.nodeId); const choice = previous?.type === "decision" ? previous.choices.find(item => item.id === record.choiceId) : undefined; return choice && <li key={record.nodeId}><h3>{previous?.title}</h3><p>{choice.label}</p><p><strong>Respons:</strong> {choice.response}</p><p><strong>Konsekuensi:</strong> {choice.consequence.feedback} {choice.consequence.explanation}</p></li>; })}</ol></details>}
    </>}
  </div>;
}

