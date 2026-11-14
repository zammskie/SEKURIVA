import type { DecisionNode, Scenario, ScenarioChoice, ScenarioNode, ScenarioRunState } from "./foundation-types";
import { validateScenarioGraph } from "./validate-graph";

export function getScenarioNode(scenario: Scenario, nodeId: string): ScenarioNode {
  const node = scenario.nodes.find(item => item.id === nodeId);
  if (!node) throw new Error(`Node ${nodeId} tidak ditemukan.`);
  return node;
}

export function startScenario(scenario: Scenario, startedAt = new Date().toISOString()): ScenarioRunState {
  if (scenario.status !== "ready" && (scenario.status as string) !== "published") throw new Error("Skenario belum siap dijalankan.");
  const result = validateScenarioGraph(scenario);
  if (!result.valid) throw new Error(result.errors.join(" "));
  return { scenarioId: scenario.id, startedAt, currentNodeId: scenario.startNodeId, visitedNodeIds: [scenario.startNodeId], selectedChoices: [], pendingChoice: null, completedAt: null, completionStatus: "in_progress", completionPayload: null };
}

function activeNode(scenario: Scenario, state: ScenarioRunState): ScenarioNode {
  if (state.scenarioId !== scenario.id || state.completionStatus !== "in_progress") throw new Error("Sesi skenario tidak aktif atau tidak cocok.");
  return getScenarioNode(scenario, state.currentNodeId);
}

export function getAvailableChoices(scenario: Scenario, state: ScenarioRunState): readonly ScenarioChoice[] {
  const node = activeNode(scenario, state);
  return node.type === "decision" && !state.pendingChoice ? node.choices : [];
}

export function selectScenarioChoice(scenario: Scenario, state: ScenarioRunState, choiceId: string): ScenarioRunState {
  const node = activeNode(scenario, state);
  if (node.type !== "decision") throw new Error("Node saat ini bukan decision point.");
  if (state.pendingChoice) throw new Error("Pilihan sudah dibuat; baca konsekuensi sebelum melanjutkan.");
  const choice = (node as DecisionNode).choices.find(item => item.id === choiceId);
  if (!choice) throw new Error(`Pilihan ${choiceId} tidak valid.`);
  const record = { nodeId: node.id, decisionNodeId: node.id, choiceId: choice.id, label: choice.label, choiceLabel: choice.label, response: choice.response, consequence: choice.consequence, nextNodeId: choice.nextNodeId };
  return { ...state, selectedChoices: [...state.selectedChoices, record], pendingChoice: record };
}

/** Advances only after feedback has been available to the UI for a decision. */
export function advanceScenario(scenario: Scenario, state: ScenarioRunState): ScenarioRunState {
  const node = activeNode(scenario, state);
  if (node.type === "ending") throw new Error("Ending telah tercapai; selesaikan sesi.");
  if (node.type === "decision" && !state.pendingChoice) throw new Error("Pilih respons terlebih dahulu.");
  const nextNodeId = node.type === "message" ? node.nextNodeId : state.pendingChoice!.nextNodeId;
  getScenarioNode(scenario, nextNodeId);
  return { ...state, currentNodeId: nextNodeId, visitedNodeIds: [...state.visitedNodeIds, nextNodeId], pendingChoice: null };
}

export function completeScenario(scenario: Scenario, state: ScenarioRunState, completedAt = new Date().toISOString()): ScenarioRunState {
  const node = activeNode(scenario, state);
  if (node.type !== "ending") throw new Error("Sesi belum mencapai ending.");
  const completionPayload = { scenarioId: scenario.id, startedAt: state.startedAt, completedAt, endingNodeId: node.id, endingId: node.id, visitedNodeIds: state.visitedNodeIds, selectedChoices: state.selectedChoices, observedRedFlagIds: scenario.learning?.redFlags.filter(flag => state.visitedNodeIds.includes(flag.nodeId)).map(flag => flag.id) ?? [] };
  return { ...state, completedAt, completionStatus: "completed", completionPayload };
}
