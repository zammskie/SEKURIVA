import type { Scenario, ScenarioChoiceHistory, ScenarioRunState } from "@/lib/scenario-engine/foundation-types";

export type SimulationRecordStatus = "in_progress" | "awaiting_debriefing" | "completed";
export interface SimulationRecord {
  readonly id: string;
  readonly userId: string;
  readonly scenarioId: string;
  readonly scenarioTitleSnapshot: string;
  readonly startedAt: string;
  readonly updatedAt: string;
  readonly completedAt: string | null;
  readonly debriefingViewedAt: string | null;
  readonly status: SimulationRecordStatus;
  readonly runState: ScenarioRunState;
  readonly scenarioSnapshot?: Scenario;
}
export interface SimulationHistorySnapshot { readonly records: readonly SimulationRecord[]; readonly warning: string | null; }
export interface ScenarioProgressItem {
  readonly scenarioId: string;
  readonly status: "Belum Dimulai" | "Sedang Berlangsung" | "Selesai";
  readonly lastActivityAt: string | null;
  readonly latestRunId: string | null;
  readonly completedRunId: string | null;
  readonly awaitingDebriefingRunId: string | null;
}
export interface SimulationProgress {
  readonly total: number;
  readonly completed: number;
  readonly inProgress: number;
  readonly notStarted: number;
  readonly percentage: number;
  readonly items: readonly ScenarioProgressItem[];
  readonly recent: readonly SimulationRecord[];
}
export interface StoredDecisionReview {
  readonly nodeId: string;
  readonly prompt: string;
  readonly context: string | null;
  readonly selected: ScenarioChoiceHistory;
  readonly availableChoices: readonly { id: string; label: string }[];
  readonly why: string;
  readonly possibleImpact: string;
  readonly saferAction: string;
  readonly lesson: string;
}
