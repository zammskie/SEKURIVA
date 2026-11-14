"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { scenarioCatalog } from "@/data/scenarios/catalog";
import { readyScenario } from "@/lib/scenario-engine/mock-scenario-repository";
import { localSimulationRepository } from "@/lib/simulation-history/repository";
import { decisionReviews, journeyFlags, journeyTactics } from "@/lib/simulation-history/review";
import { formatSimulationDate } from "@/lib/simulation-history/display";
import type { SimulationRecord } from "@/lib/simulation-history/types";

export function DebriefingView({ runId }: { runId: string }) {
  const [run, setRun] = useState<SimulationRecord | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    queueMicrotask(() => {
      try { setRun(localSimulationRepository.getAny(runId) ?? null); }
      catch { setError("Riwayat lokal tidak dapat dibaca."); setRun(null); }
    });
  }, [runId]);
  useEffect(() => {
    if (run?.status !== "awaiting_debriefing") return;
    queueMicrotask(() => {
      try { setRun(localSimulationRepository.markDebriefViewed(run.userId, runId)); }
      catch { setError("Pembahasan tampil, tetapi progres belum dapat disimpan. Periksa penyimpanan browser lalu buka halaman ini lagi."); }
    });
  }, [run, runId]);
  if (run === undefined) return <p>Memuat pembahasan…</p>;
  if (!run) return <section className="simulation-panel history-empty"><h1>Pembahasan tidak ditemukan</h1><p>Run ID ini tidak tersedia pada riwayat lokal pengguna demo.</p>{error && <p role="alert">{error}</p>}<Link className="button button-primary" href="/siswa/riwayat">Lihat riwayat</Link></section>;
  const metadata = scenarioCatalog.find(item => item.id === run.scenarioId);
  const scenario = run.scenarioSnapshot ?? (metadata ? readyScenario(metadata) : null);
  if (!scenario) return <p>Data skenario tidak tersedia.</p>;
  if (run.status === "in_progress") return <section className="simulation-panel history-empty"><h1>Simulasi masih berlangsung</h1><p>Selesaikan simulasi untuk membuka pembahasan.</p><Link className="button button-primary" href={`/siswa/skenario/${scenario.slug}/main`}>Lanjutkan simulasi</Link></section>;
  const payload = run.runState.completionPayload;
  const learning = scenario.learning;
  const ending = scenario.nodes.find(node => node.id === payload?.endingNodeId);
  if (!payload || !learning || !ending || ending.type !== "ending") return <p>Pembahasan skenario belum tersedia.</p>;
  const reviews = decisionReviews(scenario, run);
  const flags = journeyFlags(scenario, run);
  const tactics = journeyTactics(scenario, run);
  const nodeExample = (nodeId: string) => { const node = scenario.nodes.find(item => item.id === nodeId); return node?.type === "message" ? node.content : node?.type === "decision" ? node.prompt : null; };
  return <div className="history-stack debriefing-page">
    <header className="history-header"><p className="eyebrow">SKENARIO {String(scenarioCatalog.findIndex(item => item.id === scenario.id) + 1).padStart(2, "0")} · {scenario.category} · SIMULASI SELESAI</p><h1>{scenario.title}</h1><p>{learning.summary}</p><p className="history-meta">Run ID: <code>{run.id}</code> · Dimulai {formatSimulationDate(run.startedAt)} · Ending {formatSimulationDate(run.completedAt)}</p></header>
    {error && <p className="scenario-storage-warning" role="alert">{error}</p>}
    <section className="simulation-panel"><h2>Hasil perjalananmu</h2><p>{reviews.length} keputusan diambil dalam sesi ini. Percakapan yang kamu lalui berakhir pada:</p><h3>{ending.title}</h3><p>{ending.content}</p><p>{learning.endingAnalyses[ending.id]}</p><details><summary>Lihat jalur percakapan yang dilalui</summary><ol>{payload.visitedNodeIds.map(nodeId => { const visited = scenario.nodes.find(item => item.id === nodeId)!; return <li key={nodeId}>{visited.type === "message" ? `${visited.speaker}: ${visited.content}` : visited.type === "decision" ? `Keputusan: ${visited.prompt}` : `Ending: ${visited.title}`}</li>; })}</ol></details><p className="simulation-caption">Pilihanmu adalah bahan refleksi, bukan skor atau penilaian diri.</p></section>
    <section className="simulation-panel"><h2>Linimasa keputusan</h2><p>Dua keputusan berikut berasal dari sesi ini.</p><ol className="review-timeline">{reviews.map((item, index) => <li key={item.nodeId}><h3>Keputusan {index + 1}: {item.prompt}</h3>{item.context && <p>{item.context}</p>}<p><strong>Pilihanmu:</strong> {item.selected.label}</p><p><strong>Respons:</strong> {item.selected.response}</p><p><strong>Konsekuensi:</strong> {item.selected.consequence.title} — {item.selected.consequence.description}</p><details><summary>Lihat alasan dan pilihan lain</summary><p><strong>Pilihan yang tersedia:</strong></p><ul>{item.availableChoices.map(choice => <li key={choice.id}>{choice.label}{choice.id === item.selected.choiceId ? " (dipilih)" : ""}</li>)}</ul><p><strong>Mengapa penting:</strong> {item.why}</p><p><strong>Dampak yang mungkin:</strong> {item.possibleImpact}</p><p><strong>Tindakan lebih aman:</strong> {item.saferAction}</p><p><strong>Pelajaran:</strong> {item.lesson}</p></details></li>)}</ol></section>
    <section className="simulation-panel"><h2>Tanda bahaya yang muncul di perjalananmu</h2>{flags.observed.length ? <ul className="history-card-list">{flags.observed.map(flag => <li key={flag.id}><h3>{flag.title}</h3><p><strong>Mengapa perlu diwaspadai:</strong> {flag.description}</p>{nodeExample(flag.nodeId) && <blockquote>{nodeExample(flag.nodeId)}</blockquote>}</li>)}</ul> : <p>Tidak ada tanda bahaya yang dipetakan pada jalur ini.</p>}</section>
    <section className="simulation-panel"><h2>Tanda bahaya lain yang perlu diketahui</h2><p>Tanda berikut ada pada jalur lain dalam skenario ini; kamu tidak mengalaminya pada sesi ini.</p>{flags.additional.length ? <ul className="history-card-list">{flags.additional.map(flag => <li key={flag.id}><h3>{flag.title}</h3><p>{flag.description}</p></li>)}</ul> : <p>Semua tanda bahaya yang dipetakan sudah muncul di perjalananmu.</p>}</section>
    <section className="simulation-panel"><h2>Teknik manipulasi yang digunakan</h2><p>Perhatikan pesan yang mencoba memengaruhi keputusanmu. Penjelasan berikut menunjukkan cara pola tersebut dipakai dalam skenario.</p><ul className="history-card-list">{tactics.observed.map((tactic, index) => <li key={`${tactic.nodeId}-${index}`}><h3>{tactic.title}</h3><p><strong>Pola dan tujuan:</strong> {tactic.description}</p>{nodeExample(tactic.nodeId) && <blockquote>{nodeExample(tactic.nodeId)}</blockquote>}<p><strong>Cara menyikapi:</strong> Periksa klaim melalui kanal resmi yang kamu buka sendiri, lalu pilih langkah aman yang sesuai di bawah.</p></li>)}</ul>{tactics.additional.length > 0 && <details><summary>Teknik yang muncul pada jalur lain</summary><ul>{tactics.additional.map((tactic, index) => <li key={`${tactic.nodeId}-${index}`}><strong>{tactic.title}:</strong> {tactic.description}</li>)}</ul></details>}</section>
    <section className="simulation-panel"><h2>Langkah aman berikutnya</h2><ol>{learning.safeActions.map(action => <li key={action}>{action}</li>)}</ol></section>
    <section className="simulation-panel"><h2>Kesimpulan</h2><p>{learning.conclusion}</p></section>
    <section className="simulation-panel"><h2>Rujukan resmi</h2><ul>{learning.references.map(ref => <li key={ref.url}><a href={ref.url} target="_blank" rel="noopener noreferrer">{ref.title}</a> — {ref.scope}</li>)}</ul><p className="simulation-caption">Tautan membuka situs resmi di tab baru.</p></section>
    <div className="history-actions"><Link className="button button-primary" href="/siswa/progres">Lihat progres</Link><Link className="button button-secondary" href={`/siswa/riwayat/${run.id}`}>Detail riwayat</Link><Link className="button button-secondary" href={`/siswa/skenario/${scenario.slug}/main`}>Mainkan lagi</Link></div>
  </div>;
}
