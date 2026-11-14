import { scenarioCatalog } from "@/data/scenarios/catalog";
import { scenarioGraphs } from "@/data/scenarios/graphs";
import type { Scenario, ScenarioStatus } from "./foundation-types";
import { validateScenarioGraph } from "./validate-graph";
import { logActivity } from "@/lib/repositories/admin-activity";
import { localSimulationRepository } from "@/lib/simulation-history/repository";

export const SCENARIO_STORAGE_KEY = "sekuriva.scenarios.v1";
export const SCENARIO_CHANGE_EVENT = "sekuriva:scenarios-changed";

export function getCanonicalScenarios(): Scenario[] {
  return scenarioCatalog.map(metadata => {
    const graph = scenarioGraphs[metadata.id];
    const status: ScenarioStatus = metadata.status === "ready" ? "published" : metadata.status;
    return {
      ...metadata,
      ...graph,
      status,
    };
  });
}

function isScenarioObject(val: unknown): val is Scenario {
  if (typeof val !== "object" || val === null || Array.isArray(val)) return false;
  const s = val as Record<string, unknown>;
  return (
    typeof s.id === "string" &&
    typeof s.slug === "string" &&
    typeof s.title === "string" &&
    typeof s.category === "string" &&
    typeof s.startNodeId === "string" &&
    Array.isArray(s.nodes) &&
    s.nodes.length > 0
  );
}

function read(): Scenario[] {
  const canonical = getCanonicalScenarios();
  if (typeof window === "undefined") return canonical;
  try {
    const raw = window.localStorage.getItem(SCENARIO_STORAGE_KEY);
    if (raw === null) {
      window.localStorage.setItem(SCENARIO_STORAGE_KEY, JSON.stringify(canonical));
      return canonical;
    }
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every(isScenarioObject)) {
      return parsed;
    }
  } catch {
    // fallback to canonical
  }
  return canonical;
}

function write(scenarios: Scenario[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SCENARIO_STORAGE_KEY, JSON.stringify(scenarios));
    window.dispatchEvent(new Event(SCENARIO_CHANGE_EVENT));
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "Gagal menyimpan skenario ke penyimpanan lokal.");
  }
}

export const localScenarioRepository = {
  getCanonicalScenarios,

  async getAllScenarios(): Promise<Scenario[]> {
    return read();
  },

  async getPublishedScenarios(): Promise<Scenario[]> {
    return read().filter(s => s.status === "published" || s.status === "ready");
  },

  async getScenarioById(id: string): Promise<Scenario | undefined> {
    return read().find(s => s.id === id);
  },

  async getScenarioBySlug(slug: string): Promise<Scenario | undefined> {
    return read().find(s => s.slug === slug);
  },

  async saveScenario(scenario: Scenario): Promise<Scenario> {
    const all = read();
    const now = new Date().toISOString();
    const existingIndex = all.findIndex(s => s.id === scenario.id);

    const updated: Scenario = {
      ...scenario,
      updatedAt: now,
      createdAt: scenario.createdAt || now,
    };

    if (existingIndex >= 0) {
      all[existingIndex] = updated;
    } else {
      all.push(updated);
    }

    write(all);
    logActivity({
      type: "scenario",
      title: existingIndex >= 0 ? "Skenario diperbarui" : "Skenario baru dibuat",
      description: `Skenario "${scenario.title}" disimpan sebagai ${updated.status}.`,
      actorName: "Admin Pengelola",
      badgeTone: "teal",
    });

    return updated;
  },

  async publishScenario(id: string): Promise<{ success: boolean; scenario?: Scenario; errors: string[] }> {
    const all = read();
    const target = all.find(s => s.id === id);
    if (!target) return { success: false, errors: ["Skenario tidak ditemukan."] };

    const validation = validateScenarioGraph(target);
    if (!validation.valid) {
      return { success: false, errors: [...validation.errors] };
    }

    const now = new Date().toISOString();
    const published: Scenario = {
      ...target,
      status: "published",
      updatedAt: now,
    };

    const next = all.map(s => (s.id === id ? published : s));
    write(next);

    logActivity({
      type: "scenario",
      title: "Skenario diterbitkan",
      description: `Skenario "${target.title}" lolos validasi graph dan berhasil diterbitkan untuk siswa.`,
      actorName: "Admin Pengelola",
      badgeTone: "success",
    });

    return { success: true, scenario: published, errors: [] };
  },

  async archiveScenario(id: string): Promise<Scenario> {
    const all = read();
    const target = all.find(s => s.id === id);
    if (!target) throw new Error("Skenario tidak ditemukan.");

    const now = new Date().toISOString();
    const archived: Scenario = {
      ...target,
      status: "archived",
      updatedAt: now,
    };

    const next = all.map(s => (s.id === id ? archived : s));
    write(next);

    logActivity({
      type: "scenario",
      title: "Skenario diarsipkan",
      description: `Skenario "${target.title}" diarsipkan. Riwayat lama tetap terjaga.`,
      actorName: "Admin Pengelola",
      badgeTone: "warning",
    });

    return archived;
  },

  async deleteScenario(id: string): Promise<{ success: boolean; reason?: string }> {
    const all = read();
    const target = all.find(s => s.id === id);
    if (!target) return { success: false, reason: "Skenario tidak ditemukan." };

    // Check if any student run references this scenario
    const allRuns = localSimulationRepository.listAll();
    const hasRuns = allRuns.some(run => run.scenarioId === id);
    if (hasRuns) {
      return {
        success: false,
        reason: "Skenario telah memiliki riwayat simulasi siswa. Gunakan fitur 'Arsipkan' untuk menjaga keterkaitan data riwayat.",
      };
    }

    const next = all.filter(s => s.id !== id);
    write(next);

    logActivity({
      type: "scenario",
      title: "Skenario dihapus",
      description: `Skenario "${target.title}" dihapus karena belum memiliki riwayat simulasi.`,
      actorName: "Admin Pengelola",
      badgeTone: "danger",
    });

    return { success: true };
  },

  async resetToDefault(): Promise<void> {
    const canonical = getCanonicalScenarios();
    write(canonical);
    logActivity({
      type: "scenario",
      title: "Katalog skenario direset",
      description: "Delapan skenario resmi acuan telah dipulihkan ke konfigurasi awal.",
      actorName: "Admin Pengelola",
      badgeTone: "neutral",
    });
  },
};
