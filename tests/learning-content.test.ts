import test from "node:test";
import assert from "node:assert/strict";
import { materials } from "../src/data/materials";
import { materialContents, getMaterialContent } from "../src/data/materials/content";
import { scenarios, scenarioPreviews, scenariosForMaterial } from "../src/data/scenarios";
import { advanceScenario, startScenario } from "../src/lib/scenario-engine/engine";
import { validateScenario } from "../src/lib/scenario-engine/validate";
import type { ScenarioProgress } from "../src/lib/types/simulation";

test("all four modules are readable, assessable, and connected to the catalog", () => {
  assert.equal(materials.length, 4);
  assert.deepEqual(materialContents.map(item => item.id).sort(), materials.map(item => item.id).sort());
  for (const summary of materials) {
    const content = getMaterialContent(summary.id);
    assert.ok(content);
    assert.equal(content.sections.length, summary.lessonCount);
    assert.equal(new Set(content.sections.map(section => section.id)).size, summary.lessonCount);
    assert.ok(content.sections.every(section => section.paragraphs.length && section.example.trim()));
    assert.equal(content.check.options.filter(option => option.id === content.check.correctOptionId).length, 1);
    assert.ok(content.check.options.every(option => option.explanation.trim()));
    assert.ok(scenariosForMaterial(summary.id).length);
  }
});

test("catalog has eight unique playable scenarios", () => {
  assert.equal(scenarios.length, 8);
  assert.equal(new Set(scenarios.map(scenario => scenario.id)).size, 8);
  assert.deepEqual(scenarioPreviews.map(item => item.id), scenarios.map(item => item.id));
  assert.ok(scenarioPreviews.every(item => item.category && item.icon));
});

for (const scenario of scenarios) {
  test(`${scenario.id}: every branch reaches an ending and debriefing`, () => {
    assert.deepEqual(validateScenario(scenario), []);
    const endings = new Set<string>();
    let paths = 0;
    function play(progress: ScenarioProgress, seen: readonly string[] = []) {
      const node = scenario.nodes.find(item => item.id === progress.currentNodeId);
      assert.ok(node);
      assert.ok(!seen.includes(node.id), `cycle in ${node.id}`);
      if (node.type === "debriefing") {
        assert.equal(progress.status, "completed");
        assert.ok(progress.choiceHistory.length >= 2);
        assert.ok(endings.has(seen.at(-1) ?? ""));
        assert.ok(node.debriefing.relatedMaterialIds.every(id => getMaterialContent(id)));
        paths++;
        return;
      }
      if (node.type === "ending") endings.add(node.id);
      const history = [...seen, node.id];
      if (node.type === "decision") {
        for (const choice of node.choices) play(advanceScenario(scenario, progress, choice.id), history);
      } else play(advanceScenario(scenario, progress), history);
    }
    play(startScenario(scenario));
    assert.equal(paths, 4);
    assert.equal(endings.size, 4);
  });
}
