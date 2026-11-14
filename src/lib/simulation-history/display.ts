import type { SimulationRecord } from "./types";

export function formatSimulationDate(value: string | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function simulationStatus(record: SimulationRecord): string {
  if (record.status === "completed") return "Selesai";
  if (record.status === "awaiting_debriefing") return "Menunggu pembahasan";
  return "Sedang berlangsung";
}

export function simulationDuration(record: SimulationRecord): string {
  if (!record.completedAt) return "—";
  const minutes = Math.max(0, Math.round((Date.parse(record.completedAt) - Date.parse(record.startedAt)) / 60000));
  return `${minutes} menit`;
}
