/**
 * Kontrak konten simulasi. Validasi graf ada di scenario-engine/validate.ts.
 *
 * Invariant yang WAJIB divalidasi saat konten/engine dikembangkan:
 * - Semua ID node unik dan startNodeId menunjuk node yang tersedia.
 * - Satu skenario memiliki sedikitnya dua node decision.
 * - Setiap pilihan memiliki response dan consequence.feedback yang tidak kosong.
 * - Semua nextNodeId menunjuk node yang tersedia, tanpa jalur buntu atau siklus.
 * - Semua node dapat dicapai; setiap jalur mencapai ending lalu debriefing.
 *
 * TypeScript memeriksa bentuk data, bukan keterhubungan graf atau isi string.
 * Konten bertipe wajib lolos validateScenario sebelum dijalankan.
 */

export type ScenarioDifficulty = "Dasar" | "Menengah";

export interface ScenarioMessage {
  readonly id: string;
  readonly speaker: "narrator" | "contact" | "student";
  readonly displayName: string;
  readonly text: string;
}

export interface Consequence {
  readonly kind: "safe" | "risky" | "neutral";
  readonly feedback: string;
  readonly explanation: string;
}

export interface ScenarioChoice {
  readonly id: string;
  readonly label: string;
  readonly response: string;
  readonly consequence: Consequence;
  readonly nextNodeId: string;
}

export interface Debriefing {
  readonly title: string;
  readonly summary: string;
  readonly warningSigns: readonly string[];
  readonly recommendedActions: readonly string[];
  readonly reflectionQuestions: readonly string[];
  readonly relatedMaterialIds: readonly string[];
}

interface ScenarioNodeBase {
  readonly id: string;
  readonly title: string;
}

export interface ScenarioNarrativeNode extends ScenarioNodeBase {
  readonly type: "narrative";
  readonly presentation: "chat" | "scene";
  readonly messages: readonly ScenarioMessage[];
  readonly nextNodeId: string;
}

export interface ScenarioDecisionNode extends ScenarioNodeBase {
  readonly type: "decision";
  readonly presentation: "chat" | "scene";
  readonly messages: readonly ScenarioMessage[];
  readonly prompt: string;
  readonly choices: readonly [ScenarioChoice, ScenarioChoice, ...ScenarioChoice[]];
}

export interface ScenarioEndingNode extends ScenarioNodeBase {
  readonly type: "ending";
  readonly outcome: "safe" | "risky" | "mixed";
  readonly summary: string;
  /** Harus menunjuk node bertipe debriefing. */
  readonly nextNodeId: string;
}

export interface ScenarioDebriefingNode extends ScenarioNodeBase {
  readonly type: "debriefing";
  readonly debriefing: Debriefing;
}

export type ScenarioNode =
  | ScenarioNarrativeNode
  | ScenarioDecisionNode
  | ScenarioEndingNode
  | ScenarioDebriefingNode;

export interface Scenario {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly difficulty: ScenarioDifficulty;
  readonly estimatedMinutes: number;
  readonly learningObjectives: readonly string[];
  readonly startNodeId: string;
  readonly nodes: readonly ScenarioNode[];
}

export interface ScenarioChoiceRecord {
  readonly nodeId: string;
  readonly choiceId: string;
  readonly selectedAt: string;
}

interface ScenarioProgressBase {
  readonly scenarioId: string;
  readonly choiceHistory: readonly ScenarioChoiceRecord[];
}

/** Kontrak progres sesi lokal; tidak disimpan ke browser storage atau server. */
export type ScenarioProgress = ScenarioProgressBase &
  (
    | {
        readonly status: "not_started";
        readonly currentNodeId: null;
        readonly startedAt: null;
        readonly completedAt: null;
      }
    | {
        readonly status: "in_progress";
        readonly currentNodeId: string;
        readonly startedAt: string;
        readonly completedAt: null;
      }
    | {
        readonly status: "completed";
        /** Node debriefing terakhir yang telah ditampilkan. */
        readonly currentNodeId: string;
        readonly startedAt: string;
        readonly completedAt: string;
      }
  );

