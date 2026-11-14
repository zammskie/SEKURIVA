"use client";

import Link from "next/link";
import { scenarioCatalog } from "@/data/scenarios/catalog";
import { readyScenario } from "@/lib/scenario-engine/mock-scenario-repository";
import { decisionReviews } from "@/lib/simulation-history/review";
import { formatSimulationDate, simulationDuration, simulationStatus } from "@/lib/simulation-history/display";
import { useSimulationHistory } from "@/lib/simulation-history/use-simulation-history";

export function StudentHistory() {
  const { snapshot } = useSimulationHistory();
  if (!snapshot) return <p>Memuat riwayat…</p>;
  return <div className="history-stack"><header className="history-header"><p className="eyebrow">RUANG BELAJAR</p><h1>Riwayat Simulasi</h1><p>Setiap pengulangan tercatat sebagai sesi tersendiri. Buka satu sesi untuk melihat keputusan yang benar-benar kamu ambil.</p></header>
    {snapshot.warning && <p className="scenario-storage-warning" role="alert">{snapshot.warning}</p>}
    {snapshot.records.length ? <><div className="history-table-wrap"><table className="history-table"><thead><tr><th>No.</th><th>Skenario</th><th>Tanggal</th><th>Status</th><th>Durasi</th><th>Aksi</th></tr></thead><tbody>{snapshot.records.map((run, index) => <tr key={run.id}><td>{index + 1}</td><td>{run.scenarioTitleSnapshot}</td><td>{formatSimulationDate(run.startedAt)}</td><td>{simulationStatus(run)}</td><td>{simulationDuration(run)}</td><td><Link href={`/siswa/riwayat/${run.id}`}>Lihat sesi</Link></td></tr>)}</tbody></table></div><ul className="history-mobile-list">{snapshot.records.map(run => <li key={run.id} className="simulation-panel"><h2>{run.scenarioTitleSnapshot}</h2><p>{simulationStatus(run)} · {simulationDuration(run)}</p><p>Dimulai {formatSimulationDate(run.startedAt)}</p><p>Aktivitas terakhir {formatSimulationDate(run.updatedAt)}</p><Link href={`/siswa/riwayat/${run.id}`}>Lihat sesi →</Link></li>)}</ul></> : <section className="simulation-panel history-empty"><h2>Belum ada riwayat simulasi</h2><p>Mulai satu skenario untuk mencatat perjalanan keputusanmu.</p><Link className="button button-primary" href="/siswa/skenario">Jelajahi skenario</Link></section>}
  </div>;
}

export function StudentHistoryDetail({ runId }: { runId: string }) {
  const { snapshot } = useSimulationHistory();
  if (!snapshot) return <p>Memuat sesi…</p>;
  const run = snapshot.records.find(item => item.id === runId);
  if (!run) return <section className="simulation-panel history-empty"><h1>Sesi tidak ditemukan</h1><p>Run ID ini tidak tersedia pada riwayat lokal pengguna demo.</p>{snapshot.warning && <p role="alert">{snapshot.warning}</p>}<Link className="button button-primary" href="/siswa/riwayat">Kembali ke riwayat</Link></section>;
  const metadata = scenarioCatalog.find(item => item.id === run.scenarioId);
  const scenario = metadata && readyScenario(metadata);
  if (!scenario) return <p>Skenario tidak tersedia.</p>;
  const payload = run.runState.completionPayload;
  const ending = payload && scenario.nodes.find(node => node.id === payload.endingNodeId);
  const reviews = decisionReviews(scenario, run);
  return <div className="history-stack"><header className="history-header"><p className="eyebrow">DETAIL SESI · {simulationStatus(run)}</p><h1>{run.scenarioTitleSnapshot}</h1><p>Skenario {String(scenarioCatalog.findIndex(item => item.id === run.scenarioId) + 1).padStart(2, "0")} · {scenario.category}</p><p>Run ID: <code>{run.id}</code> · Scenario ID: <code>{run.scenarioId}</code></p><p>Dimulai {formatSimulationDate(run.startedAt)} · Aktivitas terakhir {formatSimulationDate(run.updatedAt)}</p><p>Selesai: {formatSimulationDate(run.completedAt)} · Durasi: {simulationDuration(run)}</p><p>Pembahasan: {run.debriefingViewedAt ? `Dibuka ${formatSimulationDate(run.debriefingViewedAt)}` : "Belum dibuka"} · Jumlah keputusan: {run.runState.selectedChoices.length}</p></header>
    <section className="simulation-panel"><h2>Keputusan dalam sesi ini</h2>{reviews.length ? <ol className="review-timeline">{reviews.map((item, index) => <li key={item.nodeId}><h3>Keputusan {index + 1}: {item.prompt}</h3><p><strong>Dipilih:</strong> {item.selected.label}</p><p><strong>Respons:</strong> {item.selected.response}</p><p><strong>Konsekuensi:</strong> {item.selected.consequence.title} — {item.selected.consequence.description}</p></li>)}</ol> : <p>Belum ada keputusan yang diambil.</p>}</section>
    {ending?.type === "ending" && <section className="simulation-panel"><h2>Ending sesi</h2><h3>{ending.title}</h3><p>{ending.content}</p></section>}
    <div className="history-actions">{run.status === "in_progress" ? <Link className="button button-primary" href={`/siswa/skenario/${scenario.slug}/main`}>Lanjutkan simulasi</Link> : <Link className="button button-primary" href={`/siswa/pembahasan/${run.id}`}>{run.status === "completed" ? "Lihat pembahasan" : "Tampilkan pembahasan"}</Link>}<Link className="button button-secondary" href={`/siswa/skenario/${scenario.slug}/main`}>Mainkan lagi</Link><Link className="button button-secondary" href="/siswa/riwayat">Kembali ke riwayat</Link></div>
  </div>;
}
