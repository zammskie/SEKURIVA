import { scenarioCatalog } from "@/data/scenarios/catalog";
import { advanceScenario, completeScenario, getScenarioNode, selectScenarioChoice, startScenario } from "@/lib/scenario-engine/foundation-engine";
import type { Scenario, ScenarioRunState } from "@/lib/scenario-engine/foundation-types";
import { readyScenario } from "@/lib/scenario-engine/mock-scenario-repository";
import type { SimulationHistorySnapshot, SimulationRecord } from "./types";

export const DEMO_STUDENT_ID = "siswa-demo";
export const SIMULATION_STORAGE_PREFIX = "sekuriva.simulations.v1:";
export const SIMULATION_HISTORY_EVENT = "sekuriva:simulations-changed";
const warning = "Sebagian data riwayat lokal tidak dapat dibaca. Catatan yang rusak tidak ditampilkan.";
interface StoragePort { getItem(key: string): string | null; setItem(key: string, value: string): void; }
type Store = { version: 1; records: SimulationRecord[] };

function record(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function iso(value: unknown): value is string { return typeof value === "string" && !Number.isNaN(Date.parse(value)); }
function equal(a: unknown, b: unknown): boolean { return JSON.stringify(a) === JSON.stringify(b); }
function scenarioFor(id: string): Scenario | undefined {
  const metadata = scenarioCatalog.find(item => item.id === id);
  return metadata ? readyScenario(metadata) : undefined;
}

/** Replays the canonical graph so edited or partial storage cannot become a completed learning result. */
function validRunState(scenario: Scenario, value: unknown): value is ScenarioRunState {
  if (!record(value) || value.scenarioId !== scenario.id || !iso(value.startedAt)
    || typeof value.currentNodeId !== "string" || !Array.isArray(value.visitedNodeIds)
    || !Array.isArray(value.selectedChoices) || value.selectedChoices.length > 2) return false;
  try {
    const stored = value as unknown as ScenarioRunState;
    let replay = startScenario(scenario, stored.startedAt);
    let choiceIndex = 0;
    let guard = 0;
    while (replay.visitedNodeIds.length < stored.visitedNodeIds.length || choiceIndex < stored.selectedChoices.length) {
      if (++guard > scenario.nodes.length + 3) return false;
      const node = getScenarioNode(scenario, replay.currentNodeId);
      if (node.type === "ending") return false;
      if (node.type === "decision") {
        const selected = stored.selectedChoices[choiceIndex];
        if (!selected || selected.nodeId !== node.id || typeof selected.choiceId !== "string") return false;
        replay = selectScenarioChoice(scenario, replay, selected.choiceId);
        if (!equal(replay.pendingChoice, selected)) return false;
        choiceIndex++;
        if (replay.visitedNodeIds.length === stored.visitedNodeIds.length) break;
      }
      replay = advanceScenario(scenario, replay);
    }
    if (!equal(replay.visitedNodeIds, stored.visitedNodeIds) || !equal(replay.selectedChoices, stored.selectedChoices)
      || replay.currentNodeId !== stored.currentNodeId || !equal(replay.pendingChoice, stored.pendingChoice)) return false;
    const current = getScenarioNode(scenario, replay.currentNodeId);
    if (stored.completionStatus === "in_progress") return current.type !== "ending" && stored.completedAt === null && stored.completionPayload === null;
    if (stored.completionStatus !== "completed" || current.type !== "ending" || !iso(stored.completedAt)) return false;
    const completed = completeScenario(scenario, replay, stored.completedAt);
    return equal(completed.completionPayload, stored.completionPayload);
  } catch { return false; }
}

function scenarioForRecord(value: Record<string, unknown>): Scenario | undefined {
  if (value.scenarioSnapshot && typeof value.scenarioSnapshot === "object") {
    return value.scenarioSnapshot as Scenario;
  }
  return scenarioFor(value.scenarioId as string);
}

function validRecord(value: unknown, userId: string): value is SimulationRecord {
  if (!record(value) || typeof value.id !== "string" || !value.id || value.userId !== userId
    || typeof value.scenarioId !== "string" || typeof value.scenarioTitleSnapshot !== "string"
    || !iso(value.startedAt) || !iso(value.updatedAt)) return false;
  const scenario = scenarioForRecord(value);
  if (!scenario || !validRunState(scenario, value.runState)) return false;
  const state = value.runState as ScenarioRunState;
  if (value.startedAt !== state.startedAt) return false;
  if (value.status === "in_progress") return state.completionStatus === "in_progress" && value.completedAt === null && value.debriefingViewedAt === null;
  if (value.status === "awaiting_debriefing") return state.completionStatus === "completed" && value.completedAt === state.completedAt && value.debriefingViewedAt === null;
  if (value.status === "completed") return state.completionStatus === "completed" && value.completedAt === state.completedAt && iso(value.debriefingViewedAt);
  return false;
}

export interface SimulationRepository {
  list(userId: string): SimulationHistorySnapshot;
  listAll(): readonly SimulationRecord[];
  get(userId: string, runId: string): SimulationRecord | undefined;
  getAny(runId: string): SimulationRecord | undefined;
  latestForScenario(userId: string, scenarioId: string): SimulationRecord | undefined;
  create(userId: string, scenario: Scenario, state: ScenarioRunState): SimulationRecord;
  saveState(userId: string, runId: string, state: ScenarioRunState): SimulationRecord;
  markDebriefViewed(userId: string, runId: string): SimulationRecord;
}

export function createSimulationRepository(storage: StoragePort, onChange: () => void = () => {}): SimulationRepository {
  const key = (userId: string) => `${SIMULATION_STORAGE_PREFIX}${encodeURIComponent(userId)}`;
  const read = (userId: string): SimulationHistorySnapshot => {
    try {
      const raw = storage.getItem(key(userId));
      if (raw === null) return { records: [], warning: null };
      const parsed: unknown = JSON.parse(raw);
      if (!record(parsed) || parsed.version !== 1 || !Array.isArray(parsed.records)) return { records: [], warning };
      const valid = parsed.records.filter((item: unknown) => validRecord(item, userId));
      const unique = valid.filter((item: SimulationRecord, index: number) => valid.findIndex((candidate: SimulationRecord) => candidate.id === item.id) === index);
      return { records: unique.sort((a: SimulationRecord, b: SimulationRecord) => b.updatedAt.localeCompare(a.updatedAt)), warning: unique.length === parsed.records.length ? null : warning };
    } catch { return { records: [], warning }; }
  };
  const write = (userId: string, records: readonly SimulationRecord[]) => {
    const payload: Store = { version: 1, records: [...records] };
    storage.setItem(key(userId), JSON.stringify(payload));
    onChange();
  };
  return {
    list: read,
    listAll() {
      const studentIds = ["siswa-demo", "siswa-demo-2", "siswa-demo-3"];
      const all: SimulationRecord[] = [];
      for (const uid of studentIds) {
        all.push(...read(uid).records);
      }
      return all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    },
    get(userId, runId) { return read(userId).records.find(item => item.id === runId); },
    getAny(runId) {
      const studentIds = ["siswa-demo", "siswa-demo-2", "siswa-demo-3"];
      for (const uid of studentIds) {
        const found = read(uid).records.find(item => item.id === runId);
        if (found) return found;
      }
      return undefined;
    },
    latestForScenario(userId, scenarioId) { return read(userId).records.find(item => item.scenarioId === scenarioId); },
    create(userId, scenario, state) {
      if (!userId || !scenarioFor(scenario.id) || !validRunState(scenario, state) || state.completionStatus !== "in_progress" || state.visitedNodeIds.length !== 1) throw new Error("Sesi baru tidak valid.");
      const now = state.startedAt;
      const item: SimulationRecord = { id: crypto.randomUUID(), userId, scenarioId: scenario.id, scenarioTitleSnapshot: scenario.title, startedAt: now, updatedAt: now, completedAt: null, debriefingViewedAt: null, status: "in_progress", runState: state, scenarioSnapshot: scenario };
      write(userId, [item, ...read(userId).records]);
      return item;
    },
    saveState(userId, runId, state) {
      const all = read(userId).records;
      const current = all.find(item => item.id === runId);
      if (!current || current.status !== "in_progress") throw new Error("Sesi aktif tidak ditemukan.");
      const scenario = current.scenarioSnapshot ?? scenarioFor(current.scenarioId);
      if (!scenario || !validRunState(scenario, state) || state.startedAt !== current.startedAt) throw new Error("Data sesi tidak valid.");
      if (!equal(state.visitedNodeIds.slice(0, current.runState.visitedNodeIds.length), current.runState.visitedNodeIds)
        || !equal(state.selectedChoices.slice(0, current.runState.selectedChoices.length), current.runState.selectedChoices)) throw new Error("Langkah sesi tidak dapat dimundurkan.");
      if (equal(state, current.runState)) return current;
      const status = state.completionStatus === "completed" ? "awaiting_debriefing" : "in_progress";
      const next: SimulationRecord = { ...current, runState: state, status, completedAt: state.completedAt, updatedAt: new Date().toISOString() };
      write(userId, all.map(item => item.id === runId ? next : item));
      return next;
    },
    markDebriefViewed(userId, runId) {
      const all = read(userId).records;
      const current = all.find(item => item.id === runId);
      if (!current) throw new Error("Sesi tidak ditemukan.");
      if (current.status === "completed") return current;
      if (current.status !== "awaiting_debriefing" || !current.runState.completionPayload) throw new Error("Simulasi belum mencapai ending.");
      const now = new Date().toISOString();
      const next: SimulationRecord = { ...current, status: "completed", debriefingViewedAt: now, updatedAt: now };
      write(userId, all.map(item => item.id === runId ? next : item));
      return next;
    },
  };
}

export const localSimulationRepository: SimulationRepository = createSimulationRepository({
  getItem(key) { return window.localStorage.getItem(key); },
  setItem(key, value) { window.localStorage.setItem(key, value); },
}, () => window.dispatchEvent(new Event(SIMULATION_HISTORY_EVENT)));
