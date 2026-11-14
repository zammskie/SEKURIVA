"use client";

import Link from "next/link";
import { scenarioCatalog } from "@/data/scenarios/catalog";
import { calculateSimulationProgress } from "@/lib/simulation-history/progress";
import { formatSimulationDate, simulationStatus } from "@/lib/simulation-history/display";
import { useSimulationHistory } from "@/lib/simulation-history/use-simulation-history";

export function StudentProgress() {
  const { snapshot } = useSimulationHistory();
  if (!snapshot) return <p>Memuat progres…</p>;
  const progress = calculateSimulationProgress(snapshot.records);
  return <div className="history-stack"><header className="history-header"><p className="eyebrow">RUANG BELAJAR</p><h1>Progres Belajar</h1><p>Perkembangan penyelesaian delapan skenario simulasi. Persentase ini menunjukkan aktivitas, bukan skor kemampuan.</p></header>
    {snapshot.warning && <p className="scenario-storage-warning" role="alert">{snapshot.warning}</p>}
    <section className="simulation-panel"><h2>Progres Penyelesaian Skenario</h2><p className="history-percent"><strong>{progress.percentage}%</strong> · {progress.completed} dari {progress.total} skenario selesai</p><progress max={progress.total} value={progress.completed} aria-label="Progres Penyelesaian Skenario" />
      <div className="history-stats"><p><strong>{progress.completed}</strong><span>Selesai</span></p><p><strong>{progress.inProgress}</strong><span>Sedang berlangsung</span></p><p><strong>{progress.notStarted}</strong><span>Belum dimulai</span></p></div><p className="simulation-caption">Skenario dihitung selesai setelah ending dicapai dan pembahasan dibuka. Pengulangan tersimpan sebagai sesi baru tanpa menambah jumlah skenario unik yang selesai.</p></section>
    <section className="simulation-panel"><h2>Daftar skenario</h2><ul className="history-card-list">{progress.items.map((item, index) => { const scenario = scenarioCatalog.find(entry => entry.id === item.scenarioId)!; const href = item.status === "Selesai" ? `/siswa/pembahasan/${item.completedRunId}` : item.awaitingDebriefingRunId ? `/siswa/pembahasan/${item.awaitingDebriefingRunId}` : item.latestRunId ? `/siswa/skenario/${scenario.slug}/main` : `/siswa/skenario/${scenario.slug}`; const label = item.status === "Selesai" ? "Lihat pembahasan" : item.awaitingDebriefingRunId ? "Tampilkan pembahasan" : item.latestRunId ? "Lanjutkan simulasi" : "Mulai skenario"; return <li key={item.scenarioId} className="history-scenario-item"><div><span className="history-status">Skenario {String(index + 1).padStart(2, "0")} · {item.status}</span><h3>{scenario.title}</h3><p>{scenario.category} · Aktivitas terakhir: {formatSimulationDate(item.lastActivityAt)}</p></div><Link className="dashboard-text-link" href={href}>{label} →</Link></li>; })}</ul></section>
    <section className="simulation-panel"><h2>Aktivitas terbaru</h2>{progress.recent.length ? <ul className="history-card-list">{progress.recent.map(run => <li key={run.id}><strong>{run.scenarioTitleSnapshot}</strong><p>{simulationStatus(run)} · {formatSimulationDate(run.updatedAt)}</p><Link href={`/siswa/riwayat/${run.id}`}>Lihat sesi</Link></li>)}</ul> : <p>Belum ada aktivitas simulasi. Pilih satu skenario untuk memulai.</p>}</section>
  </div>;
}
