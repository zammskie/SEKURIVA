import { scenarioCatalog } from "@/data/scenarios/catalog";
import type { SimulationProgress, SimulationRecord } from "./types";

export function calculateSimulationProgress(records: readonly SimulationRecord[]): SimulationProgress {
  const items = scenarioCatalog.map(scenario => {
    const runs = records.filter(item => item.scenarioId === scenario.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    const completed = runs.find(item => item.status === "completed");
    const awaiting = runs.find(item => item.status === "awaiting_debriefing");
    const status = completed ? "Selesai" : runs.length ? "Sedang Berlangsung" : "Belum Dimulai";
    return { scenarioId: scenario.id, status, lastActivityAt: runs[0]?.updatedAt ?? null, latestRunId: runs[0]?.id ?? null, completedRunId: completed?.id ?? null, awaitingDebriefingRunId: awaiting?.id ?? null } as const;
  });
  const total = scenarioCatalog.length;
  const completed = items.filter(item => item.status === "Selesai").length;
  const inProgress = items.filter(item => item.status === "Sedang Berlangsung").length;
  return { total, completed, inProgress, notStarted: total - completed - inProgress, percentage: total ? Math.round((completed / total) * 100) : 0, items, recent: [...records].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5) };
}
