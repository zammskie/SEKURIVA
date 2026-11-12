import test from "node:test";
import assert from "node:assert/strict";
import { packageScenario } from "../src/data/scenarios/pesan-paket";
import { validateScenario } from "../src/lib/scenario-engine/validate";
import { startScenario, advanceScenario } from "../src/lib/scenario-engine/engine";
import type { Scenario, ScenarioNode } from "../src/lib/types/simulation";

const changed = (id: string, transform: (node: ScenarioNode) => ScenarioNode): Scenario => ({ ...packageScenario, nodes: packageScenario.nodes.map(node => node.id === id ? transform(node) : node) });
test("authored scenario passes graph validation", () => assert.deepEqual(validateScenario(packageScenario), []));
for (const [first, second, ending] of [["verify", "report", "safe"], ["verify", "reply", "mixed"], ["open", "stop", "recovery"], ["open", "share", "risky"]]) {
  test(`complete path ${first}/${second} reaches ending and debriefing`, () => {
    let progress = startScenario(packageScenario, "2026-11-05T00:00:00Z");
    progress = advanceScenario(packageScenario, progress);
    progress = advanceScenario(packageScenario, progress, first);
    progress = advanceScenario(packageScenario, progress, second);
    assert.equal(progress.currentNodeId, ending);
    assert.equal(progress.status, "in_progress");
    assert.equal(progress.choiceHistory.length, 2);
    const previous = progress;
    progress = advanceScenario(packageScenario, progress, undefined, "2026-11-05T00:08:00Z");
    assert.equal(progress.currentNodeId, "debrief");
    assert.equal(progress.status, "completed");
    assert.equal(progress.completedAt, "2026-11-05T00:08:00Z");
    assert.equal(previous.status, "in_progress");
    assert.throws(() => advanceScenario(packageScenario, progress));
  });
}
test("invalid and missing choices cannot advance a decision", () => {
  const progress = advanceScenario(packageScenario, startScenario(packageScenario));
  assert.throws(() => advanceScenario(packageScenario, progress));
  assert.throws(() => advanceScenario(packageScenario, progress, "invented"));
  assert.throws(() => advanceScenario(packageScenario, { ...progress, scenarioId: "other" }, "verify"));
  assert.equal(progress.choiceHistory.length, 0);
});
test("restart creates a clean independent session", () => {
  let progress = advanceScenario(packageScenario, startScenario(packageScenario));
  progress = advanceScenario(packageScenario, progress, "open");
  const restarted = startScenario(packageScenario);
  assert.equal(restarted.choiceHistory.length, 0);
  assert.equal(restarted.currentNodeId, "intro");
  assert.equal(progress.choiceHistory.length, 1);
});
test("missing references and invalid start are rejected", () => {
  assert.ok(validateScenario({ ...packageScenario, startNodeId: "absent" }).length);
  const invalid = changed("intro", node => node.type === "narrative" ? { ...node, nextNodeId: "absent" } : node);
  assert.throws(() => startScenario(invalid));
});
test("cycles and unreachable nodes are rejected", () => {
  assert.match(validateScenario(changed("intro", node => node.type === "narrative" ? { ...node, nextNodeId: "intro" } : node)).join(" "), /Siklus/);
  assert.match(validateScenario({ ...packageScenario, nodes: [...packageScenario.nodes, { id: "unused", type: "ending", title: "Unused", outcome: "safe", summary: "Unused", nextNodeId: "debrief" }] }).join(" "), /tidak terjangkau/);
});
test("duplicate node and choice IDs are rejected", () => {
  assert.match(validateScenario({ ...packageScenario, nodes: [...packageScenario.nodes, packageScenario.nodes[0]] }).join(" "), /duplikat/);
  assert.match(validateScenario(changed("first", node => node.type === "decision" ? { ...node, choices: [node.choices[0], node.choices[0]] } : node)).join(" "), /duplikat/);
});
test("a branch with only one decision is rejected even if other branches have two", () => {
  const invalid = changed("first", node => node.type === "decision" ? { ...node, choices: [{ ...node.choices[0], nextNodeId: "safe" }, node.choices[1]] } : node);
  assert.match(validateScenario(invalid).join(" "), /kurang dari dua keputusan/);
});
test("debrief cannot bypass ending and ending must target debrief", () => {
  assert.match(validateScenario(changed("intro", node => node.type === "narrative" ? { ...node, nextNodeId: "debrief" } : node)).join(" "), /melewati ending/);
  assert.match(validateScenario(changed("safe", node => node.type === "ending" ? { ...node, nextNodeId: "first" } : node)).join(" "), /harus menuju debriefing/);
});
test("blank response, consequence and debrief content are rejected", () => {
  assert.match(validateScenario(changed("first", node => node.type === "decision" ? { ...node, choices: [{ ...node.choices[0], response: " ", consequence: { ...node.choices[0].consequence, feedback: "" } }, node.choices[1]] } : node)).join(" "), /tidak boleh kosong/);
  assert.match(validateScenario(changed("debrief", node => node.type === "debriefing" ? { ...node, debriefing: { ...node.debriefing, warningSigns: [] } } : node)).join(" "), /warningSigns kosong/);
});
