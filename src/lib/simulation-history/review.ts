import type { Scenario, ScenarioRedFlag, ScenarioTactic } from "@/lib/scenario-engine/foundation-types";
import type { SimulationRecord, StoredDecisionReview } from "./types";

export function decisionReviews(scenario: Scenario, run: SimulationRecord): StoredDecisionReview[] {
  const analyses = scenario.learning?.choiceAnalyses ?? {};
  return run.runState.selectedChoices.flatMap(selected => {
    const node = scenario.nodes.find(item => item.id === selected.nodeId);
    const analysis = analyses[selected.choiceId];
    if (!node || node.type !== "decision" || !analysis) return [];
    return [{ nodeId: node.id, prompt: node.prompt, context: node.context ?? null, selected, availableChoices: node.choices.map(choice => ({ id: choice.id, label: choice.label })), ...analysis }];
  });
}

export function journeyFlags(scenario: Scenario, run: SimulationRecord): { observed: ScenarioRedFlag[]; additional: ScenarioRedFlag[] } {
  const visited = new Set(run.runState.visitedNodeIds);
  const observed: ScenarioRedFlag[] = [];
  const additional: ScenarioRedFlag[] = [];
  for (const flag of scenario.learning?.redFlags ?? []) (visited.has(flag.nodeId) ? observed : additional).push(flag);
  return { observed, additional };
}

export function journeyTactics(scenario: Scenario, run: SimulationRecord): { observed: ScenarioTactic[]; additional: ScenarioTactic[] } {
  const visited = new Set(run.runState.visitedNodeIds);
  const observed: ScenarioTactic[] = [];
  const additional: ScenarioTactic[] = [];
  for (const tactic of scenario.learning?.socialEngineeringTactics ?? []) (visited.has(tactic.nodeId) ? observed : additional).push(tactic);
  return { observed, additional };
}
