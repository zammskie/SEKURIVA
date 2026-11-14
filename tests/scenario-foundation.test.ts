import assert from "node:assert/strict";
import test from "node:test";
import { scenarioCatalog } from "../src/data/scenarios/catalog";
import { mockScenarioRepository } from "../src/lib/scenario-engine/mock-scenario-repository";
import { advanceScenario, completeScenario, getAvailableChoices, getScenarioNode, selectScenarioChoice, startScenario } from "../src/lib/scenario-engine/foundation-engine";
import type { Scenario } from "../src/lib/scenario-engine/foundation-types";
import { validateScenarioCatalog, validateScenarioGraph } from "../src/lib/scenario-engine/validate-graph";
import { fixtureScenario } from "./fixtures/scenario-foundation";

test("official catalog has exactly eight unique, playable scenarios", async () => {
  assert.equal(validateScenarioCatalog(scenarioCatalog).valid, true);
  assert.deepEqual(scenarioCatalog.map(item => item.title), [
    "Lowongan Kerja Paruh Waktu Palsu",
    "Penipuan Tugas Online dengan Sistem Deposit",
    "Penipuan Kurir dan QR Code Paket",
    "File APK Undangan atau Resi Palsu",
    "QRIS Palsu pada Transaksi",
    "Customer Service Palsu",
    "Investasi Palsu dan Impersonasi",
    "Penipuan Pemulihan Dana (Recovery Scam)",
  ]);
  assert.ok(scenarioCatalog.every(item => item.status === "ready"));
  assert.deepEqual(await mockScenarioRepository.getScenarioMetadata(), {
    total: 8, available: 8, inDevelopment: 0,
    categories: scenarioCatalog.map(item => item.category),
  });
  assert.equal((await mockScenarioRepository.getAvailableScenarios()).length, 8);
  assert.throws(() => startScenario({ ...fixtureScenario, status: "in_development" }), /belum siap/);
});

test("fixture graph supports all four branches and completion payloads", () => {
  assert.deepEqual(validateScenarioGraph(fixtureScenario), { valid: true, errors: [], warnings: [] });
  for (const first of ["verify", "ignore"]) {
    for (const second of ["stop", "continue"]) {
      let state = startScenario(fixtureScenario, "2026-11-14T01:00:00.000Z");
      assert.equal(getScenarioNode(fixtureScenario, state.currentNodeId).type, "message");
      state = advanceScenario(fixtureScenario, state);
      assert.equal(getAvailableChoices(fixtureScenario, state).length, 2);
      assert.throws(() => advanceScenario(fixtureScenario, state), /Pilih respons/);
      state = selectScenarioChoice(fixtureScenario, state, first);
      assert.equal(state.currentNodeId, "decision-1");
      assert.ok(state.pendingChoice?.response);
      assert.ok(state.pendingChoice?.consequence.description.includes("Dalam simulasi"));
      assert.equal(getAvailableChoices(fixtureScenario, state).length, 0);
      assert.throws(() => selectScenarioChoice(fixtureScenario, state, first), /sudah dibuat/);
      state = advanceScenario(fixtureScenario, state);
      assert.equal(state.currentNodeId, first === "verify" ? "message-verify" : "message-ignore");
      state = advanceScenario(fixtureScenario, state);
      assert.equal(state.currentNodeId, "decision-2");
      state = selectScenarioChoice(fixtureScenario, state, second);
      assert.ok(state.pendingChoice?.response);
      assert.ok(state.pendingChoice?.consequence.description.includes("Dalam simulasi"));
      state = advanceScenario(fixtureScenario, state);
      assert.equal(state.currentNodeId, second === "stop" ? "ending-safe" : "ending-risk");
      assert.throws(() => advanceScenario(fixtureScenario, state), /Ending/);
      state = completeScenario(fixtureScenario, state, "2026-11-14T01:05:00.000Z");
      assert.equal(state.completionStatus, "completed");
      assert.deepEqual(state.completionPayload?.selectedChoices.map(item => item.choiceId), [first, second]);
      assert.equal(state.completionPayload?.endingNodeId, state.currentNodeId);
      assert.equal(state.completionPayload?.scenarioId, fixtureScenario.id);
      assert.ok(state.completionPayload?.visitedNodeIds.includes("decision-1"));
      assert.ok(state.completionPayload?.visitedNodeIds.includes("decision-2"));
    }
  }
});

test("engine rejects invalid choices and premature completion", () => {
  let state = startScenario(fixtureScenario);
  assert.throws(() => completeScenario(fixtureScenario, state), /belum mencapai ending/);
  assert.throws(() => selectScenarioChoice(fixtureScenario, state, "verify"), /bukan decision/);
  state = advanceScenario(fixtureScenario, state);
  assert.throws(() => selectScenarioChoice(fixtureScenario, state, "unknown"), /tidak valid/);
});

test("validator catches broken references, duplicate IDs, missing choice data, and dead ends", () => {
  const base = fixtureScenario.nodes;
  const modify = (nodes: Scenario["nodes"], startNodeId = fixtureScenario.startNodeId) => validateScenarioGraph({ ...fixtureScenario, nodes, startNodeId });
  assert.ok(modify(base, "absent").errors.some(error => error.includes("Node awal")));
  assert.ok(modify([...base, base[0]]).errors.some(error => error.includes("duplikat")));
  assert.ok(modify([...base, { id: "orphan", type: "ending", title: "Orphan", content: "Unused" }]).errors.some(error => error.includes("tidak dapat dijangkau")));
  assert.ok(modify(base.map(node => node.id === "intro" ? { ...node, nextNodeId: "absent" } : node) as Scenario["nodes"]).errors.some(error => error.includes("tidak tersedia")));
  assert.ok(modify(base.map(node => node.id === "message-verify" ? { ...node, nextNodeId: "" } : node) as Scenario["nodes"]).errors.some(error => error.includes("Jalur buntu")));
  const decision = base.find(node => node.id === "decision-1")!;
  assert.equal(decision.type, "decision");
  if (decision.type !== "decision") return;
  const replaceDecision = (choices: typeof decision.choices) => modify(base.map(node => node.id === decision.id ? { ...decision, choices } : node));
  assert.ok(replaceDecision(decision.choices.slice(0, 1)).errors.some(error => error.includes("kurang dari dua pilihan")));
  assert.ok(replaceDecision([{ ...decision.choices[0], response: "" }, decision.choices[1]]).errors.some(error => error.includes("response")));
  assert.ok(replaceDecision([{ ...decision.choices[0], consequence: { ...decision.choices[0].consequence, description: "" } }, decision.choices[1]]).errors.some(error => error.includes("consequence")));
  assert.ok(replaceDecision([{ ...decision.choices[0], nextNodeId: "" }, decision.choices[1]]).errors.some(error => error.includes("nextNodeId")));
});

test("validator rejects cycles and any ending reached before two decisions", () => {
  const cyclic = { ...fixtureScenario, nodes: fixtureScenario.nodes.map(node => node.id === "message-verify" ? { ...node, nextNodeId: "decision-1" } : node) as Scenario["nodes"] };
  assert.ok(validateScenarioGraph(cyclic).errors.some(error => error.includes("Siklus")));
  const earlyEnding = { ...fixtureScenario, nodes: fixtureScenario.nodes.map(node => node.id === "message-verify" ? { ...node, nextNodeId: "ending-safe" } : node) as Scenario["nodes"] };
  assert.ok(validateScenarioGraph(earlyEnding).errors.some(error => error.includes("hanya melewati 1 decision point")));
  assert.throws(() => startScenario(cyclic), /Siklus/);
});
