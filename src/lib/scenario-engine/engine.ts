import type { Scenario, ScenarioProgress } from "../types/simulation";
import { validateScenario } from "./validate";

export function startScenario(scenario: Scenario, now = new Date().toISOString()): ScenarioProgress {
  const errors = validateScenario(scenario);
  if (errors.length) throw new Error(errors.join(" "));
  return { scenarioId: scenario.id, status: "in_progress", currentNodeId: scenario.startNodeId, startedAt: now, completedAt: null, choiceHistory: [] };
}

/** Pure transition: reject invalid actions, never silently skip a decision. */
export function advanceScenario(scenario: Scenario, progress: ScenarioProgress, choiceId?: string, now = new Date().toISOString()): ScenarioProgress {
  if (progress.scenarioId !== scenario.id || progress.status !== "in_progress") throw new Error("Sesi tidak aktif atau skenario tidak cocok.");
  const node = scenario.nodes.find(item => item.id === progress.currentNodeId);
  if (!node || node.type === "debriefing") throw new Error("Node tidak dapat dilanjutkan.");
  const choice = node.type === "decision" ? node.choices.find(item => item.id === choiceId) : undefined;
  if (node.type === "decision" && !choice) throw new Error("Pilih opsi yang valid.");
  if (node.type !== "decision" && choiceId !== undefined) throw new Error("Node ini tidak menerima pilihan.");
  const targetId = node.type === "decision" ? choice!.nextNodeId : node.nextNodeId;
  const target = scenario.nodes.find(item => item.id === targetId);
  if (!target) throw new Error("Tujuan tidak ditemukan.");
  const choiceHistory = choice ? [...progress.choiceHistory, { nodeId: node.id, choiceId: choice.id, selectedAt: now }] : progress.choiceHistory;
  return target.type === "debriefing"
    ? { ...progress, choiceHistory, currentNodeId: targetId, status: "completed", completedAt: now }
    : { ...progress, choiceHistory, currentNodeId: targetId };
}
