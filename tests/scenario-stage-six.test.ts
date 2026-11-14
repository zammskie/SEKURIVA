import assert from "node:assert/strict";
import test from "node:test";
import { scenarioCatalog } from "../src/data/scenarios/catalog";
import { scenarioGraphs } from "../src/data/scenarios/graphs";
import { advanceScenario, completeScenario, getScenarioNode, selectScenarioChoice, startScenario } from "../src/lib/scenario-engine/foundation-engine";
import { readyScenario } from "../src/lib/scenario-engine/mock-scenario-repository";
import { validateScenarioGraph } from "../src/lib/scenario-engine/validate-graph";

test("eight official graphs contain distinct complete learning content", () => {
  assert.deepEqual(Object.keys(scenarioGraphs).sort(), scenarioCatalog.map(item => item.id).sort());
  const openings = new Set<string>();
  for (const metadata of scenarioCatalog) {
    const scenario = readyScenario(metadata);
    assert.ok(scenario, `${metadata.title} must be playable`);
    const validation = validateScenarioGraph(scenario);
    assert.deepEqual(validation.errors, [], `${metadata.title}: ${validation.errors.join("; ")}`);
    assert.equal(validation.valid, true);
    assert.equal(scenario.totalDecisionPoints, 3);
    assert.equal(scenario.nodes.filter(node => node.type === "decision").length, 3);
    assert.equal(scenario.nodes.filter(node => node.type === "ending").length, 4);
    assert.equal(scenario.nodes.filter(node => node.type === "decision").reduce((sum, node) => sum + (node.type === "decision" ? node.choices.length : 0), 0), 6);
    assert.ok(scenario.learning);
    assert.ok(scenario.learning.redFlags.length >= 4);
    assert.ok(scenario.learning.socialEngineeringTactics.length >= 2);
    assert.ok(scenario.learning.safeActions.length >= 3);
    assert.ok(scenario.learning.references.length >= 1);
    for (const ref of scenario.learning.references) assert.match(ref.url, /^https:\/\/(?:ojk\.go\.id|www\.bi\.go\.id|www\.komdigi\.go\.id)\//);
    const opening = scenario.nodes.find(node => node.id === scenario.startNodeId);
    assert.ok(opening && opening.type === "message");
    openings.add(opening.content);
    const openingMessages = scenario.nodes.filter(node => node.id.startsWith("open-") && node.type === "message");
    assert.ok(openingMessages.length >= 4);
    for (const flag of scenario.learning.redFlags) assert.ok(scenario.nodes.some(node => node.id === flag.nodeId));
  }
  assert.equal(openings.size, 8, "each scenario needs its own opening");
});

test("all 32 official paths show two decisions, six choice analyses, and four unique endings per scenario", () => {
  let paths = 0;
  for (const metadata of scenarioCatalog) {
    const scenario = readyScenario(metadata)!;
    const endingIds = new Set<string>();
    for (const firstIndex of [0, 1]) {
      for (const secondIndex of [0, 1]) {
        let state = startScenario(scenario, "2026-11-14T01:00:00.000Z");
        let guard = 0;
        while (getScenarioNode(scenario, state.currentNodeId).type === "message") {
          assert.ok(++guard < 20, `${scenario.id} opening should terminate`);
          state = advanceScenario(scenario, state);
        }
        const firstNode = getScenarioNode(scenario, state.currentNodeId);
        assert.equal(firstNode.type, "decision");
        if (firstNode.type !== "decision") continue;
        const firstChoice = firstNode.choices[firstIndex];
        assert.ok(firstChoice.response && firstChoice.consequence.description);
        assert.ok(scenario.learning?.choiceAnalyses[firstChoice.id]);
        state = selectScenarioChoice(scenario, state, firstChoice.id);
        assert.equal(state.currentNodeId, firstNode.id, "feedback must appear before navigation");
        assert.equal(state.pendingChoice?.response, firstChoice.response);
        assert.deepEqual(state.pendingChoice?.consequence, firstChoice.consequence);
        state = advanceScenario(scenario, state);
        guard = 0;
        while (getScenarioNode(scenario, state.currentNodeId).type === "message") {
          assert.ok(++guard < 20, `${scenario.id} branch should terminate`);
          state = advanceScenario(scenario, state);
        }
        const secondNode = getScenarioNode(scenario, state.currentNodeId);
        assert.equal(secondNode.type, "decision");
        assert.equal(secondNode.id, firstIndex === 0 ? "decision-2a" : "decision-2b");
        if (secondNode.type !== "decision") continue;
        const secondChoice = secondNode.choices[secondIndex];
        assert.ok(secondChoice.response && secondChoice.consequence.description);
        assert.ok(scenario.learning?.choiceAnalyses[secondChoice.id]);
        state = selectScenarioChoice(scenario, state, secondChoice.id);
        assert.equal(state.currentNodeId, secondNode.id);
        assert.deepEqual(state.pendingChoice?.consequence, secondChoice.consequence);
        state = advanceScenario(scenario, state);
        const ending = getScenarioNode(scenario, state.currentNodeId);
        assert.equal(ending.type, "ending");
        endingIds.add(ending.id);
        assert.ok(scenario.learning?.endingAnalyses[ending.id]);
        state = completeScenario(scenario, state, "2026-11-14T01:05:00.000Z");
        assert.equal(state.completionStatus, "completed");
        assert.equal(state.completionPayload?.endingId, ending.id);
        assert.deepEqual(state.completionPayload?.selectedChoices.map(item => item.choiceId), [firstChoice.id, secondChoice.id]);
        assert.deepEqual(state.completionPayload?.selectedChoices.map(item => item.decisionNodeId), [firstNode.id, secondNode.id]);
        assert.ok(state.completionPayload?.observedRedFlagIds?.length);
        assert.equal(state.completionPayload?.visitedNodeIds.filter(id => id.startsWith("decision-")).length, 2);
        paths++;
      }
    }
    assert.equal(endingIds.size, 4, `${scenario.id} should have four reachable endings`);
  }
  assert.equal(paths, 32);
});
