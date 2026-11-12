import type { Scenario, ScenarioNode } from "../types/simulation";

export function nextIds(node: ScenarioNode): readonly string[] {
  if (node.type === "debriefing") return [];
  if (node.type === "decision") return node.choices.map(choice => choice.nextNodeId);
  return [node.nextNodeId];
}

/** Validate authored, typed content before running it. Not a parser for external JSON. */
export function validateScenario(scenario: Scenario): string[] {
  const errors: string[] = [];
  const nodes = new Map(scenario.nodes.map(node => [node.id, node]));
  const required = (value: string, label: string) => { if (!value.trim()) errors.push(`${label} tidak boleh kosong.`); };
  required(scenario.id, "ID skenario");
  required(scenario.title, "Judul skenario");
  if (nodes.size !== scenario.nodes.length) errors.push("ID node duplikat.");
  if (!nodes.has(scenario.startNodeId)) errors.push("Node awal tidak ditemukan.");
  for (const node of scenario.nodes) {
    required(node.id, "ID node");
    required(node.title, `Judul ${node.id}`);
    for (const id of nextIds(node)) if (!nodes.has(id)) errors.push(`Tujuan ${id} dari ${node.id} tidak ditemukan.`);
    if (node.type === "narrative" || node.type === "decision") {
      if (!node.messages.length) errors.push(`Pesan ${node.id} kosong.`);
      for (const message of node.messages) required(message.text, `Pesan ${node.id}`);
    }
    if (node.type === "decision") {
      required(node.prompt, `Pertanyaan ${node.id}`);
      if (node.choices.length < 2) errors.push(`Pilihan ${node.id} kurang dari dua.`);
      if (new Set(node.choices.map(choice => choice.id)).size !== node.choices.length) errors.push(`ID pilihan duplikat pada ${node.id}.`);
      for (const choice of node.choices) {
        for (const [label, value] of Object.entries({ id: choice.id, label: choice.label, response: choice.response, feedback: choice.consequence.feedback, explanation: choice.consequence.explanation })) required(value, `${node.id}.${label}`);
      }
    }
    if (node.type === "ending") {
      required(node.summary, `Ringkasan ${node.id}`);
      if (nodes.get(node.nextNodeId)?.type !== "debriefing") errors.push(`Ending ${node.id} harus menuju debriefing.`);
    }
    if (node.type === "debriefing") {
      required(node.debriefing.title, "Judul debriefing");
      required(node.debriefing.summary, "Ringkasan debriefing");
      for (const field of ["warningSigns", "recommendedActions", "reflectionQuestions", "relatedMaterialIds"] as const) {
        if (!node.debriefing[field].length || node.debriefing[field].some(value => !value.trim())) errors.push(`Debriefing ${field} kosong.`);
      }
    }
  }
  const reached = new Set<string>();
  const visiting = new Set<string>();
  const visitedStates = new Set<string>();
  function visit(id: string, decisions: number, afterEnding: boolean) {
    const node = nodes.get(id);
    if (!node) return;
    if (visiting.has(id)) { errors.push(`Siklus pada ${id}.`); return; }
    const state = `${id}:${Math.min(decisions, 2)}:${afterEnding}`;
    if (visitedStates.has(state)) return;
    reached.add(id);
    if (node.type === "debriefing") {
      if (!afterEnding) errors.push(`Jalur ke ${id} melewati ending.`);
      if (decisions < 2) errors.push(`Jalur ke ${id} memiliki kurang dari dua keputusan.`);
    }
    visiting.add(id);
    for (const next of nextIds(node)) visit(next, decisions + (node.type === "decision" ? 1 : 0), node.type === "ending");
    visiting.delete(id);
    visitedStates.add(state);
  }
  visit(scenario.startNodeId, 0, false);
  for (const id of nodes.keys()) if (!reached.has(id)) errors.push(`Node ${id} tidak terjangkau.`);
  return [...new Set(errors)];
}
