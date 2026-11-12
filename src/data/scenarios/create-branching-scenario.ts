import type { Consequence, Debriefing, Scenario, ScenarioChoice, ScenarioDifficulty } from "@/lib/types/simulation";

/** Authoring helper: shared graph structure, individually authored situations and feedback. */
type Option = readonly [label: string, response: string, kind: Consequence["kind"], feedback: string, explanation: string];
interface DecisionContent { title: string; message: string; prompt: string; options: readonly [Option, Option] }
export interface BranchingContent {
  id: string; title: string; description: string; difficulty: ScenarioDifficulty;
  intro: string; objectives: readonly string[]; sender: string;
  first: DecisionContent; cautious: DecisionContent; exposed: DecisionContent;
  endings: readonly [string, string, string, string];
  debriefing: Debriefing;
}
function choice(option: Option, id: string, nextNodeId: string): ScenarioChoice {
  const [label, response, kind, feedback, explanation] = option;
  return { id, label, response, consequence: { kind, feedback, explanation }, nextNodeId };
}
export function createBranchingScenario(content: BranchingContent): Scenario {
  const decision = (id: string, data: DecisionContent, targets: readonly [string, string], scene = false) => ({
    id, type: "decision" as const, title: data.title, presentation: scene ? "scene" as const : "chat" as const,
    messages: [{ id: `${id}-message`, speaker: scene ? "narrator" as const : "contact" as const, displayName: scene ? "Situasi — ilustrasi" : content.sender, text: data.message }],
    prompt: data.prompt, choices: [choice(data.options[0], "a", targets[0]), choice(data.options[1], "b", targets[1])] as const,
  });
  return {
    id: content.id, title: content.title, description: content.description, difficulty: content.difficulty, estimatedMinutes: 10,
    learningObjectives: content.objectives, startNodeId: "intro",
    nodes: [
      { id: "intro", type: "narrative", title: "Sebelum menentukan tindakan", presentation: "scene", messages: [{ id: "intro-message", speaker: "narrator", displayName: "Situasi latihan", text: content.intro }], nextNodeId: "first" },
      decision("first", content.first, ["cautious", "exposed"]),
      decision("cautious", content.cautious, ["safe", "mixed"], true),
      decision("exposed", content.exposed, ["recovery", "risky"]),
      ...(["safe", "mixed", "recovery", "risky"] as const).map((id, index) => ({ id, type: "ending" as const, title: ["Batas aman terjaga", "Masih ada risiko yang perlu diperhatikan", "Kamu menghentikan eskalasi", "Belajar dari pilihan berisiko"][index], outcome: id === "safe" ? "safe" as const : id === "risky" ? "risky" as const : "mixed" as const, summary: content.endings[index], nextNodeId: "debrief" })),
      { id: "debrief", type: "debriefing", title: `Refleksi: ${content.title}`, debriefing: content.debriefing },
    ],
  };
}
