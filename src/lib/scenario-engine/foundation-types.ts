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
  readonly responseSpeaker?: ScenarioSpeaker;
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
export interface ScenarioRedFlag { readonly id: string; readonly title: string; readonly description: string; readonly nodeId: string; }
export interface ScenarioTactic { readonly title: string; readonly description: string; readonly nodeId: string; }
export interface ScenarioChoiceAnalysis { readonly why: string; readonly possibleImpact: string; readonly saferAction: string; readonly lesson: string; }
export interface ScenarioReference { readonly title: string; readonly url: string; readonly scope: string; }
export interface ScenarioLearning {
  readonly summary: string;
  readonly redFlags: readonly ScenarioRedFlag[];
  readonly socialEngineeringTactics: readonly ScenarioTactic[];
  readonly safeActions: readonly string[];
  readonly choiceAnalyses: Readonly<Record<string, ScenarioChoiceAnalysis>>;
  readonly endingAnalyses: Readonly<Record<string, string>>;
  readonly conclusion: string;
  readonly references: readonly ScenarioReference[];
}
export interface ScenarioGraph {
  readonly startNodeId: string;
  readonly nodes: readonly ScenarioNode[];
  readonly totalDecisionPoints?: number;
  readonly learning?: ScenarioLearning;
}
export interface Scenario extends ScenarioMetadata, ScenarioGraph {}

export interface ScenarioChoiceHistory {
  readonly nodeId: string;
  readonly choiceId: string;
  readonly label: string;
  readonly decisionNodeId?: string;
  readonly choiceLabel?: string;
  readonly response: string;
  readonly consequence: Consequence;
  readonly nextNodeId: string;
}

export interface ScenarioCompletionPayload {
  readonly scenarioId: string;
  readonly startedAt: string;
  readonly completedAt: string;
  readonly endingNodeId: string;
  readonly endingId?: string;
  readonly observedRedFlagIds?: readonly string[];
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
