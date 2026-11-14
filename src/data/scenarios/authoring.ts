import type { Consequence, ScenarioChoice, ScenarioGraph, ScenarioLearning, ScenarioNode, ScenarioReference, ScenarioSpeaker } from "@/lib/scenario-engine/foundation-types";

export interface StoryMessage { readonly speaker: ScenarioSpeaker; readonly content: string; }
export interface StoryChoice {
  readonly label: string;
  readonly response: string;
  readonly consequence: Consequence;
  readonly reflection: string;
  readonly saferAction: string;
}
export interface StoryEnding { readonly title: string; readonly content: string; readonly analysis: string; }
export interface StoryBranch {
  readonly messages: readonly StoryMessage[];
  readonly prompt: string;
  readonly context: string;
  readonly choices: readonly [StoryChoice, StoryChoice];
  readonly endings: readonly [StoryEnding, StoryEnding];
}
export interface AuthoredStory {
  readonly opening: readonly StoryMessage[];
  readonly firstPrompt: string;
  readonly firstContext: string;
  readonly firstChoices: readonly [StoryChoice, StoryChoice];
  readonly branches: readonly [StoryBranch, StoryBranch];
  readonly summary: string;
  readonly redFlags: readonly { readonly title: string; readonly description: string; readonly nodeId: string }[];
  readonly tactics: readonly { readonly title: string; readonly description: string; readonly nodeId: string }[];
  readonly safeActions: readonly string[];
  readonly conclusion: string;
  readonly references: readonly ScenarioReference[];
}

/** Builds one real branch per first choice and two distinct endings per branch. */
export function buildScenarioGraph(story: AuthoredStory): ScenarioGraph {
  const nodes: ScenarioNode[] = [];
  const choiceAnalyses: Record<string, ScenarioLearning["choiceAnalyses"][string]> = {};
  const endingAnalyses: Record<string, string> = {};
  const appendMessages = (prefix: string, messages: readonly StoryMessage[], target: string) => {
    messages.forEach((message, index) => nodes.push({ id: `${prefix}-${index + 1}`, type: "message", ...message, nextNodeId: index === messages.length - 1 ? target : `${prefix}-${index + 2}` }));
  };
  const makeChoice = (id: string, choice: StoryChoice, nextNodeId: string): ScenarioChoice => {
    choiceAnalyses[id] = { why: choice.reflection, possibleImpact: choice.consequence.description, saferAction: choice.saferAction, lesson: `${choice.consequence.title}. ${choice.reflection}` };
    return { id, label: choice.label, response: choice.response, responseSpeaker: "Siswa", consequence: choice.consequence, nextNodeId };
  };

  appendMessages("open", story.opening, "decision-1");
  nodes.push({ id: "decision-1", type: "decision", prompt: story.firstPrompt, context: story.firstContext, choices: story.firstChoices.map((choice, index) => makeChoice(`choice-1${index === 0 ? "a" : "b"}`, choice, `branch-${index === 0 ? "a" : "b"}-1`)) });
  story.branches.forEach((branch, branchIndex) => {
    const branchKey = branchIndex === 0 ? "a" : "b";
    appendMessages(`branch-${branchKey}`, branch.messages, `decision-2${branchKey}`);
    nodes.push({ id: `decision-2${branchKey}`, type: "decision", prompt: branch.prompt, context: branch.context, choices: branch.choices.map((choice, index) => makeChoice(`choice-2${branchKey}${index + 1}`, choice, `ending-${branchKey}${index + 1}`)) });
    branch.endings.forEach((ending, index) => {
      const id = `ending-${branchKey}${index + 1}`;
      nodes.push({ id, type: "ending", title: ending.title, content: ending.content });
      endingAnalyses[id] = ending.analysis;
    });
  });
  return {
    startNodeId: "open-1", nodes, totalDecisionPoints: 3,
    learning: {
      summary: story.summary,
      redFlags: story.redFlags.map((flag, index) => ({ id: `flag-${index + 1}`, ...flag })),
      socialEngineeringTactics: story.tactics,
      safeActions: story.safeActions,
      choiceAnalyses, endingAnalyses, conclusion: story.conclusion, references: story.references,
    },
  };
}
