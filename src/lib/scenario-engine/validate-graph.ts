import type { GraphValidationResult, Scenario, ScenarioChoice, ScenarioMetadata, ScenarioNode } from "./foundation-types";

function filled(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
function edges(node: ScenarioNode): readonly string[] {
  if (node.type === "message") return filled(node.nextNodeId) ? [node.nextNodeId] : [];
  if (node.type === "decision") { const choices: readonly ScenarioChoice[] = Array.isArray(node.choices) ? node.choices : []; return choices.map(choice => choice.nextNodeId).filter(filled); }
  return [];
}

export function validateScenarioCatalog(catalog: readonly ScenarioMetadata[]): GraphValidationResult {
  const errors: string[] = [];
  if (catalog.length !== 8) errors.push(`Katalog harus berisi tepat 8 skenario; ditemukan ${catalog.length}.`);
  if (new Set(catalog.map(item => item.id)).size !== catalog.length) errors.push("ID skenario duplikat dalam katalog.");
  if (new Set(catalog.map(item => item.slug)).size !== catalog.length) errors.push("Slug skenario duplikat dalam katalog.");
  catalog.forEach(item => {
    if (!filled(item.id) || !filled(item.slug) || !filled(item.title)) errors.push(`Metadata ${item.id || "tanpa ID"} belum lengkap.`);
  });
  return { valid: errors.length === 0, errors, warnings: [] };
}

export function validateScenarioGraph(scenario: Scenario): GraphValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!filled(scenario.id)) errors.push("ID skenario wajib diisi.");
  if (!filled(scenario.startNodeId)) errors.push("startNodeId wajib diisi.");
  if (!Array.isArray(scenario.nodes) || scenario.nodes.length === 0) return { valid: false, errors: [...errors, "Graph tidak memiliki node."], warnings };
  const nodes = new Map(scenario.nodes.map(node => [node.id, node]));
  if (nodes.size !== scenario.nodes.length) errors.push("ID node duplikat dalam skenario.");
  if (!nodes.has(scenario.startNodeId)) errors.push(`Node awal ${scenario.startNodeId} tidak ditemukan.`);
  const decisions = scenario.nodes.filter(node => node.type === "decision");
  if (decisions.length < 2) errors.push("Skenario harus memiliki minimal dua decision point.");

  for (const node of scenario.nodes) {
    if (!filled(node.id)) errors.push("Ada node tanpa ID.");
    if (node.type === "message") {
      if (!filled(node.content)) errors.push(`Message node ${node.id} tidak memiliki isi.`);
      if (!filled(node.nextNodeId)) errors.push(`Message node ${node.id} tidak memiliki nextNodeId.`);
      if (!["Pelaku", "Siswa", "Narator", "Sistem"].includes(node.speaker)) errors.push(`Speaker node ${node.id} tidak valid.`);
    } else if (node.type === "decision") {
      if (!filled(node.prompt)) errors.push(`Decision node ${node.id} tidak memiliki pertanyaan.`);
      if (!Array.isArray(node.choices) || node.choices.length < 2) errors.push(`Decision node ${node.id} hanya mempunyai kurang dari dua pilihan.`);
      const choices: readonly ScenarioChoice[] = Array.isArray(node.choices) ? node.choices : [];
      if (new Set(choices.map(choice => choice.id)).size !== choices.length) errors.push(`ID pilihan duplikat pada ${node.id}.`);
      choices.forEach(choice => {
        if (!filled(choice.id)) errors.push(`Pilihan pada ${node.id} tidak memiliki ID.`);
        if (!filled(choice.label)) errors.push(`Pilihan ${choice.id} pada ${node.id} tidak memiliki label.`);
        if (!filled(choice.response)) errors.push(`Pilihan ${choice.id} pada ${node.id} tidak memiliki response.`);
        if (!filled(choice.nextNodeId)) errors.push(`Pilihan ${choice.id} pada ${node.id} tidak memiliki nextNodeId.`);
        if (!choice.consequence || !filled(choice.consequence.title) || !filled(choice.consequence.description) || !["low", "medium", "high"].includes(choice.consequence.riskLevel)) errors.push(`Pilihan ${choice.id} pada ${node.id} tidak memiliki consequence yang valid.`);
      });
    } else if (node.type === "ending") {
      if (!filled(node.title) || !filled(node.content)) errors.push(`Ending node ${node.id} belum lengkap.`);
      if ("nextNodeId" in node && filled(node.nextNodeId)) errors.push(`Ending node ${node.id} tidak boleh memiliki kelanjutan.`);
    } else errors.push(`Tipe node ${node.id} tidak dikenal.`);
    for (const target of edges(node)) if (!nodes.has(target)) errors.push(`Node ${node.id} mengarah ke ${target} yang tidak tersedia.`);
  }

  const reached = new Set<string>();
  const visiting = new Set<string>();
  const visitedStates = new Set<string>();
  function walk(id: string, decisionCount: number) {
    const node = nodes.get(id);
    if (!node) return;
    if (visiting.has(id)) { errors.push(`Siklus tanpa akhir terdeteksi pada node ${id}.`); return; }
    const key = `${id}:${Math.min(decisionCount, 2)}`;
    if (visitedStates.has(key)) return;
    visiting.add(id); reached.add(id);
    if (node.type === "ending") {
      if (decisionCount < 2) errors.push(`Jalur menuju ending ${id} hanya melewati ${decisionCount} decision point.`);
    } else {
      const next = edges(node);
      if (next.length === 0) errors.push(`Jalur buntu pada node ${id}.`);
      next.forEach(target => walk(target, decisionCount + (node.type === "decision" ? 1 : 0)));
    }
    visiting.delete(id); visitedStates.add(key);
  }
  if (nodes.has(scenario.startNodeId)) walk(scenario.startNodeId, 0);
  nodes.forEach((_node, id) => { if (!reached.has(id)) errors.push(`Node ${id} tidak dapat dijangkau dari startNodeId.`); });
  return { valid: errors.length === 0, errors: [...new Set(errors)], warnings };
}
