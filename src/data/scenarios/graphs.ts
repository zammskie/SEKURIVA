import type { ScenarioGraph } from "@/lib/scenario-engine/foundation-types";
import { buildScenarioGraph } from "./authoring";
import { storiesOne } from "./stories-one";
import { storiesTwo } from "./stories-two";

/** Delapan graph resmi; fixture sintetis tetap hanya berada di folder tests. */
export const scenarioGraphs: Readonly<Record<string, ScenarioGraph>> = Object.fromEntries(
  Object.entries({ ...storiesOne, ...storiesTwo }).map(([id, story]) => [id, buildScenarioGraph(story)]),
);
