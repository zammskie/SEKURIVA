import { scenarioCatalog } from "@/data/scenarios/catalog";
import { scenarioGraphs } from "@/data/scenarios/graphs";
import type { Scenario, ScenarioMetadata } from "./foundation-types";
import type { ScenarioRepository } from "./scenario-repository";
import { validateScenarioGraph } from "./validate-graph";

export function readyScenario(metadata: ScenarioMetadata): Scenario | undefined {
  if (metadata.status !== "ready") return undefined;
  const graph = scenarioGraphs[metadata.id];
  if (!graph) return undefined;
  const scenario: Scenario = { ...metadata, ...graph };
  return validateScenarioGraph(scenario).valid ? scenario : undefined;
}

export const mockScenarioRepository: ScenarioRepository = {
  async getAllScenarios() { return scenarioCatalog; },
  async getScenarioById(id) { return scenarioCatalog.find(item => item.id === id); },
  async getScenarioBySlug(slug) { return scenarioCatalog.find(item => item.slug === slug); },
  async getAvailableScenarios() { return scenarioCatalog.flatMap(item => { const ready = readyScenario(item); return ready ? [ready] : []; }); },
  async getScenarioMetadata() {
    const available = scenarioCatalog.filter(item => readyScenario(item)).length;
    return { total: scenarioCatalog.length, available, inDevelopment: scenarioCatalog.length - available, categories: [...new Set(scenarioCatalog.map(item => item.category))] };
  },
};
