import type { Scenario } from "../../src/lib/scenario-engine/foundation-types";

/** A synthetic graph for engine tests only. It is never added to the public catalog. */
export const fixtureScenario: Scenario = {
  id: "fixture-two-decisions",
  slug: "fixture-two-decisions",
  title: "Fixture Percabangan",
  description: "Data sintetis untuk pengujian mesin.",
  context: "Situasi pengujian.",
  category: "Penawaran pekerjaan",
  keywords: ["fixture"],
  learningObjectives: ["Menguji setiap cabang."],
  relatedMaterials: [],
  status: "ready",
  createdAt: "2026-11-14T00:00:00.000Z",
  updatedAt: "2026-11-14T00:00:00.000Z",
  startNodeId: "intro",
  nodes: [
    { id: "intro", type: "message", speaker: "Narator", content: "Pesan awal sintetis.", nextNodeId: "decision-1" },
    { id: "decision-1", type: "decision", prompt: "Langkah pertama?", choices: [
      { id: "verify", label: "Periksa sumber", response: "Siswa meminta informasi sumber.", consequence: { title: "Informasi tambahan", description: "Dalam simulasi, sumber dapat ditinjau.", riskLevel: "low" }, nextNodeId: "message-verify" },
      { id: "ignore", label: "Lanjut tanpa memeriksa", response: "Siswa menunda pemeriksaan sumber.", consequence: { title: "Ketidakpastian", description: "Dalam simulasi, identitas sumber tetap belum jelas.", riskLevel: "medium" }, nextNodeId: "message-ignore" },
    ] },
    { id: "message-verify", type: "message", speaker: "Sistem", content: "Sumber berhasil diperiksa.", nextNodeId: "decision-2" },
    { id: "message-ignore", type: "message", speaker: "Sistem", content: "Sumber masih belum jelas.", nextNodeId: "decision-2" },
    { id: "decision-2", type: "decision", prompt: "Langkah kedua?", choices: [
      { id: "stop", label: "Hentikan interaksi", response: "Siswa menghentikan interaksi.", consequence: { title: "Paparan berkurang", description: "Dalam simulasi, interaksi berhenti.", riskLevel: "low" }, nextNodeId: "ending-safe" },
      { id: "continue", label: "Teruskan interaksi", response: "Siswa meneruskan interaksi.", consequence: { title: "Paparan bertambah", description: "Dalam simulasi, siswa melihat risiko tambahan.", riskLevel: "high" }, nextNodeId: "ending-risk" },
    ] },
    { id: "ending-safe", type: "ending", title: "Interaksi selesai", content: "Sesi sintetis selesai." },
    { id: "ending-risk", type: "ending", title: "Risiko terlihat", content: "Sesi sintetis selesai dengan risiko tambahan." },
  ],
};
