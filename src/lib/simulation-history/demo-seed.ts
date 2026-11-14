import { advanceScenario, completeScenario, getScenarioNode, selectScenarioChoice, startScenario } from "@/lib/scenario-engine/foundation-engine";
import { localScenarioRepository } from "@/lib/scenario-engine/local-scenario-repository";
import { readyScenario } from "@/lib/scenario-engine/mock-scenario-repository";
import { localSimulationRepository, SIMULATION_STORAGE_PREFIX } from "./repository";

export function seedDemoStudentRunsIfEmpty(): void {
  if (typeof window === "undefined") return;
  try {
    const keyStudent2 = `${SIMULATION_STORAGE_PREFIX}siswa-demo-2`;
    const existing = window.localStorage.getItem(keyStudent2);
    if (existing !== null) return; // already initialized or has data

    const canonical = localScenarioRepository.getCanonicalScenarios();
    const kurir = canonical.find(s => s.id === "kurir-qr");
    if (!kurir) return;

    const kurirReady = readyScenario(kurir);
    if (!kurirReady) return;

    // Create 1 completed simulation run for siswa-demo-2 on kurir-qr
    const startTime = new Date(Date.now() - 3600000 * 24).toISOString();
    let state = startScenario(kurirReady, startTime);
    const run = localSimulationRepository.create("siswa-demo-2", kurirReady, state);

    // Follow the safe path
    // Decision 1:
    const d1 = getScenarioNode(kurirReady, state.currentNodeId);
    if (d1.type === "message") {
      state = advanceScenario(kurirReady, state);
    }
    const cur1 = getScenarioNode(kurirReady, state.currentNodeId);
    if (cur1.type === "decision") {
      state = selectScenarioChoice(kurirReady, state, cur1.choices[0].id);
      localSimulationRepository.saveState("siswa-demo-2", run.id, state);
      state = advanceScenario(kurirReady, state);
      localSimulationRepository.saveState("siswa-demo-2", run.id, state);
    }

    // Branch message
    while (getScenarioNode(kurirReady, state.currentNodeId).type === "message") {
      state = advanceScenario(kurirReady, state);
      localSimulationRepository.saveState("siswa-demo-2", run.id, state);
    }

    // Decision 2:
    const cur2 = getScenarioNode(kurirReady, state.currentNodeId);
    if (cur2.type === "decision") {
      state = selectScenarioChoice(kurirReady, state, cur2.choices[0].id);
      localSimulationRepository.saveState("siswa-demo-2", run.id, state);
      state = advanceScenario(kurirReady, state);
      localSimulationRepository.saveState("siswa-demo-2", run.id, state);
    }

    // Ending:
    const endTime = new Date(Date.now() - 3600000 * 24 + 480000).toISOString();
    state = completeScenario(kurirReady, state, endTime);
    localSimulationRepository.saveState("siswa-demo-2", run.id, state);
    localSimulationRepository.markDebriefViewed("siswa-demo-2", run.id);
  } catch {
    // ignore
  }
}
