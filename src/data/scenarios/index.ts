import type { ScenarioPreview, ScenarioIcon } from "@/lib/types";
import { packageScenario } from "./pesan-paket";
import { additionalScenarios } from "./additional";

export const PLANNED_SCENARIO_COUNT = 8;
export const scenarios = [packageScenario, ...additionalScenarios];
const categories: Record<string, { category: string; icon: ScenarioIcon }> = {
  "pesan-paket": { category: "Penipuan pesan", icon: "message" },
  "email-akun": { category: "Phishing", icon: "mail" },
  "belanja-online": { category: "Penipuan belanja", icon: "shopping" },
  "teman-darurat": { category: "Penyamaran identitas", icon: "message" },
  "hadiah-palsu": { category: "Penipuan hadiah", icon: "shopping" },
  "lowongan-magang": { category: "Penipuan lowongan", icon: "mail" },
  "kode-qr": { category: "Phishing melalui QR", icon: "message" },
  "dukungan-akun": { category: "Keamanan akun", icon: "message" },
};
/** Katalog diturunkan dari konten yang dapat dimainkan, bukan hitungan ilustrasi. */
export const scenarioPreviews: readonly ScenarioPreview[] = scenarios.map(scenario => ({
  id: scenario.id, title: scenario.title, description: scenario.description,
  durationMinutes: scenario.estimatedMinutes, difficulty: scenario.difficulty,
  ...categories[scenario.id],
}));
export function getScenario(id: string) { return scenarios.find(scenario => scenario.id === id); }
export function scenariosForMaterial(id: string) {
  return scenarios.filter(scenario => scenario.nodes.some(node => node.type === "debriefing" && node.debriefing.relatedMaterialIds.includes(id)));
}
