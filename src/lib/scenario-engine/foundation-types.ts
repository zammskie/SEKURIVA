import type { MaterialCategory } from "@/lib/materials/types";

export type ScenarioStatus = "draft" | "in_development" | "ready";
export type ScenarioCategory = "Penawaran pekerjaan" | "Tugas online" | "Penyamaran kurir" | "File aplikasi" | "Transaksi digital" | "Customer service" | "Investasi" | "Pemulihan dana";
export type ScenarioSpeaker = "Pelaku" | "Siswa" | "Narator" | "Sistem";
export type RiskLevel = "low" | "medium" | "high";

export interface ScenarioMetadata {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly context: string;
  readonly category: ScenarioCategory;
  readonly keywords: readonly string[];
  readonly learningObjectives: readonly string[];
  readonly relatedMaterials: readonly MaterialCategory[];
  readonly difficulty?: "Dasar" | "Menengah";
  readonly estimatedDurationMinutes?: number;
  readonly status: ScenarioStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface Consequence {
  readonly title: string;
  readonly description: string;
  readonly riskLevel: RiskLevel;
}

export interface ScenarioChoice {
  readonly id: string;
  readonly label: string;
  readonly response: string;
  readonly consequence: Consequence;
  readonly nextNodeId: string;
}

export interface MessageNode {
  readonly id: string;
  readonly type: "message";
  readonly speaker: ScenarioSpeaker;
  readonly content: string;
  readonly nextNodeId: string;
}

export interface DecisionNode {
  readonly id: string;
  readonly type: "decision";
  readonly prompt: string;
  readonly context?: string;
  readonly choices: readonly ScenarioChoice[];
}

export interface EndingNode {
  readonly id: string;
  readonly type: "ending";
  readonly title: string;
  readonly content: string;
}

export type ScenarioNode = MessageNode | DecisionNode | EndingNode;
export interface ScenarioGraph { readonly startNodeId: string; readonly nodes: readonly ScenarioNode[]; }
export interface Scenario extends ScenarioMetadata, ScenarioGraph {}

export interface ScenarioChoiceHistory {
  readonly nodeId: string;
  readonly choiceId: string;
  readonly label: string;
  readonly response: string;
  readonly consequence: Consequence;
  readonly nextNodeId: string;
}

export interface ScenarioCompletionPayload {
  readonly scenarioId: string;
  readonly startedAt: string;
  readonly completedAt: string;
  readonly endingNodeId: string;
  readonly visitedNodeIds: readonly string[];
  readonly selectedChoices: readonly ScenarioChoiceHistory[];
}

export interface ScenarioRunState {
  readonly scenarioId: string;
  readonly startedAt: string;
  readonly currentNodeId: string;
  readonly visitedNodeIds: readonly string[];
  readonly selectedChoices: readonly ScenarioChoiceHistory[];
  readonly pendingChoice: ScenarioChoiceHistory | null;
  readonly completedAt: string | null;
  readonly completionStatus: "in_progress" | "completed";
  readonly completionPayload: ScenarioCompletionPayload | null;
}

export interface GraphValidationResult { readonly valid: boolean; readonly errors: readonly string[]; readonly warnings: readonly string[]; }
