import assert from "node:assert/strict";
import test from "node:test";
import { scenarioCatalog } from "../src/data/scenarios/catalog";
import { advanceScenario, completeScenario, getScenarioNode, selectScenarioChoice, startScenario } from "../src/lib/scenario-engine/foundation-engine";
import { readyScenario } from "../src/lib/scenario-engine/mock-scenario-repository";
import { calculateSimulationProgress } from "../src/lib/simulation-history/progress";
import { createSimulationRepository, SIMULATION_STORAGE_PREFIX } from "../src/lib/simulation-history/repository";
import { decisionReviews, journeyFlags, journeyTactics } from "../src/lib/simulation-history/review";

function memoryStorage() {
  const values = new Map<string, string>();
  return { values, getItem(key: string) { return values.get(key) ?? null; }, setItem(key: string, value: string) { values.set(key, value); } };
}

test("all 32 paths persist their own ending, decisions, flags, and debrief completion", () => {
  const storage = memoryStorage();
  const repository = createSimulationRepository(storage);
  const userId = "student-a";
  let pathCount = 0;
  for (const metadata of scenarioCatalog) {
    const scenario = readyScenario(metadata)!;
    for (const first of [0, 1]) for (const second of [0, 1]) {
      let state = startScenario(scenario, new Date(Date.UTC(2026, 10, 15, 8, pathCount)).toISOString());
      const run = repository.create(userId, scenario, state);
      const choices = [first, second];
      let decisionIndex = 0;
      let guard = 0;
      while (getScenarioNode(scenario, state.currentNodeId).type !== "ending") {
        assert.ok(++guard < 30);
        const node = getScenarioNode(scenario, state.currentNodeId);
        if (node.type === "decision" && !state.pendingChoice) {
          state = selectScenarioChoice(scenario, state, node.choices[choices[decisionIndex++]].id);
          repository.saveState(userId, run.id, state);
        }
        state = advanceScenario(scenario, state);
        if (getScenarioNode(scenario, state.currentNodeId).type !== "ending") repository.saveState(userId, run.id, state);
      }
      state = completeScenario(scenario, state, new Date(Date.UTC(2026, 10, 15, 8, pathCount, 30)).toISOString());
      const awaiting = repository.saveState(userId, run.id, state);
      assert.equal(awaiting.status, "awaiting_debriefing");
      assert.equal(repository.get(userId, run.id)?.id, run.id);
      assert.equal(decisionReviews(scenario, awaiting).length, 2);
      assert.equal(journeyFlags(scenario, awaiting).observed.length + journeyFlags(scenario, awaiting).additional.length, scenario.learning!.redFlags.length);
      assert.equal(journeyTactics(scenario, awaiting).observed.length + journeyTactics(scenario, awaiting).additional.length, scenario.learning!.socialEngineeringTactics.length);
      const completed = repository.markDebriefViewed(userId, run.id);
      assert.equal(completed.status, "completed");
      assert.equal(repository.markDebriefViewed(userId, run.id).debriefingViewedAt, completed.debriefingViewedAt);
      pathCount++;
    }
  }
  assert.equal(pathCount, 32);
  assert.equal(repository.list(userId).records.length, 32);
  const progress = calculateSimulationProgress(repository.list(userId).records);
  assert.equal(progress.completed, 8);
  assert.equal(progress.percentage, 100);
});

test("unfinished and awaiting sessions do not count as complete; users are isolated", () => {
  const storage = memoryStorage();
  const repository = createSimulationRepository(storage);
  const scenario = readyScenario(scenarioCatalog[0])!;
  const state = startScenario(scenario);
  const run = repository.create("student-a", scenario, state);
  assert.equal(calculateSimulationProgress(repository.list("student-a").records).inProgress, 1);
  assert.equal(calculateSimulationProgress(repository.list("student-a").records).completed, 0);
  assert.equal(repository.list("student-b").records.length, 0);
  assert.equal(repository.get("student-a", run.id)?.runState.currentNodeId, state.currentNodeId);
  assert.equal(repository.saveState("student-a", run.id, state).id, run.id);
  assert.equal(repository.list("student-a").records.length, 1);
  assert.throws(() => repository.markDebriefViewed("student-a", run.id));
});

test("corrupt, mismatched, and edited local records are ignored safely", () => {
  const storage = memoryStorage();
  const repository = createSimulationRepository(storage);
  const scenario = readyScenario(scenarioCatalog[0])!;
  const run = repository.create("student-a", scenario, startScenario(scenario));
  const key = `${SIMULATION_STORAGE_PREFIX}student-a`;
  const raw = JSON.parse(storage.values.get(key)!);
  raw.records.push({ ...run, id: "forged", userId: "student-b" });
  raw.records.push({ ...run, id: "forged-state", runState: { ...run.runState, currentNodeId: "ending-safe" } });
  storage.values.set(key, JSON.stringify(raw));
  const snapshot = repository.list("student-a");
  assert.equal(snapshot.records.length, 1);
  assert.ok(snapshot.warning);
  storage.values.set(key, "{bad json");
  assert.deepEqual(repository.list("student-a").records, []);
  assert.ok(repository.list("student-a").warning);
});
