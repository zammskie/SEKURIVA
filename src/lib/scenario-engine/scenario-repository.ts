import type { Scenario, ScenarioCategory, ScenarioMetadata } from "./foundation-types";

export interface ScenarioCatalogStats {
  readonly total: number;
  readonly available: number;
  readonly inDevelopment: number;
  readonly categories: readonly ScenarioCategory[];
}

export interface ScenarioRepository {
  getAllScenarios(): Promise<readonly ScenarioMetadata[]>;
  getScenarioById(id: string): Promise<ScenarioMetadata | undefined>;
  getScenarioBySlug(slug: string): Promise<ScenarioMetadata | undefined>;
  getAvailableScenarios(): Promise<readonly Scenario[]>;
  getScenarioMetadata(): Promise<ScenarioCatalogStats>;
}
