import { scenarioCatalog } from "@/data/scenarios/catalog";
import { scenarioGraphs } from "@/data/scenarios/graphs";
import type { Scenario, ScenarioMetadata } from "./foundation-types";
import type { ScenarioRepository } from "./scenario-repository";
import { validateScenarioGraph } from "./validate-graph";
import { localScenarioRepository } from "./local-scenario-repository";

export function readyScenario(metadata: ScenarioMetadata): Scenario | undefined {
  if (metadata.status !== "ready" && (metadata.status as string) !== "published") return undefined;
  // If metadata is already a complete Scenario with nodes
  if ("nodes" in metadata && Array.isArray((metadata as Scenario).nodes)) {
    const full = metadata as Scenario;
    return validateScenarioGraph(full).valid ? full : undefined;
  }
  const graph = scenarioGraphs[metadata.id];
  if (!graph) return undefined;
  const scenario: Scenario = { ...metadata, ...graph };
  return validateScenarioGraph(scenario).valid ? scenario : undefined;
}

export const mockScenarioRepository: ScenarioRepository = {
  async getAllScenarios() {
    const local = await localScenarioRepository.getAllScenarios();
    return local.length > 0 ? local : scenarioCatalog;
  },
  async getScenarioById(id) {
    const local = await localScenarioRepository.getScenarioById(id);
    return local ?? scenarioCatalog.find(item => item.id === id);
  },
  async getScenarioBySlug(slug) {
    const local = await localScenarioRepository.getScenarioBySlug(slug);
    return local ?? scenarioCatalog.find(item => item.slug === slug);
  },
  async getAvailableScenarios() {
    const local = await localScenarioRepository.getPublishedScenarios();
    if (local.length > 0) {
      return local.filter(s => readyScenario(s));
    }
    return scenarioCatalog.flatMap(item => { const ready = readyScenario(item); return ready ? [ready] : []; });
  },
  async getScenarioMetadata() {
    const all = await localScenarioRepository.getAllScenarios();
    const available = all.filter(item => readyScenario(item)).length;
    return {
      total: all.length,
      available,
      inDevelopment: all.length - available,
      categories: [...new Set(all.map(item => item.category))],
    };
  },
};
