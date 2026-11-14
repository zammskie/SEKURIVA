"use server";

import { getScenario } from "@/data/scenarios";
import { advanceScenario, startScenario } from "@/lib/scenario-engine/engine";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";

export async function saveCompletedSimulation(scenarioId: string, choices: readonly string[]): Promise<"saved" | "login" | "unavailable" | "invalid"> {
  if (!supabaseConfigured()) return "unavailable";
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) return "login";
  const scenario = getScenario(scenarioId);
  if (!scenario || choices.length > scenario.nodes.length) return "invalid";
  let progress = startScenario(scenario);
  let choiceIndex = 0;
  let endingOutcome: "safe" | "mixed" | "risky" | null = null;
  for (let step = 0; step < scenario.nodes.length; step++) {
    const node = scenario.nodes.find(item => item.id === progress.currentNodeId);
    if (!node) return "invalid";
    if (node.type === "debriefing") break;
    if (node.type === "ending") endingOutcome = node.outcome;
    const selected = node.type === "decision" ? choices[choiceIndex++] : undefined;
    try { progress = advanceScenario(scenario, progress, selected); }
    catch { return "invalid"; }
  }
  if (progress.status !== "completed" || choiceIndex !== choices.length || !endingOutcome) return "invalid";
  const { error } = await client.from("simulation_runs").insert({ user_id: user.id, scenario_id: scenarioId, outcome: endingOutcome, choice_history: progress.choiceHistory, started_at: progress.startedAt, completed_at: progress.completedAt });
  return error ? "unavailable" : "saved";
}
