import type { Consequence, DecisionNode, EndingNode, ScenarioChoice, ScenarioChoiceHistory, ScenarioMetadata, ScenarioSpeaker } from "@/lib/scenario-engine/foundation-types";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export function ScenarioHeader({ scenario, number, available }: { scenario: ScenarioMetadata; number: number; available: boolean }) {
  return <header className="scenario-detail-header"><div><p className="eyebrow">SKENARIO {String(number).padStart(2, "0")} · {scenario.category}</p><h1>{scenario.title}</h1><p>{scenario.description}</p></div><Badge tone={available ? "success" : "warning"}>{available ? "Tersedia" : "Dalam Pengembangan"}</Badge></header>;
}

export function ScenarioSpeakerLabel({ speaker }: { speaker: ScenarioSpeaker }) { return <strong className="foundation-speaker">{speaker}</strong>; }
export function ScenarioMessage({ speaker, content, order }: { speaker: ScenarioSpeaker; content: string; order: number }) {
  return <li className={`foundation-message foundation-message-${speaker.toLowerCase()}`}><span className="sr-only">Pesan {order}. </span><ScenarioSpeakerLabel speaker={speaker} /><p>{content}</p></li>;
}
export function ScenarioConversation({ messages, children }: { messages: readonly { id: string; speaker: ScenarioSpeaker; content: string }[]; children?: ReactNode }) {
  return <section className="foundation-conversation" aria-label="Percakapan simulasi"><ol>{messages.map((message, index) => <ScenarioMessage key={message.id} {...message} order={index + 1} />)}</ol>{children}</section>;
}

export function ScenarioChoiceCard({ choice, onSelect, disabled }: { choice: ScenarioChoice; onSelect: (choiceId: string) => void; disabled: boolean }) {
  return <button type="button" className="foundation-choice" disabled={disabled} onClick={() => onSelect(choice.id)}>{choice.label}</button>;
}
export function DecisionPanel({ node, onSelect, disabled = false }: { node: DecisionNode; onSelect: (choiceId: string) => void; disabled?: boolean }) {
  return <fieldset className="foundation-decision" disabled={disabled}><legend>{node.prompt}</legend>{node.context && <p>{node.context}</p>}<div>{node.choices.map(choice => <ScenarioChoiceCard key={choice.id} choice={choice} onSelect={onSelect} disabled={disabled} />)}</div></fieldset>;
}

const riskLabels: Record<Consequence["riskLevel"], string> = { low: "Risiko rendah", medium: "Risiko sedang", high: "Risiko tinggi" };
export function ConsequenceFeedback({ selection, onContinue }: { selection: ScenarioChoiceHistory; onContinue: () => void }) {
  return <section className="foundation-feedback" aria-live="polite"><p><strong>Respons:</strong> {selection.response}</p><Badge tone={selection.consequence.riskLevel === "high" ? "danger" : selection.consequence.riskLevel === "medium" ? "warning" : "success"}>{riskLabels[selection.consequence.riskLevel]}</Badge><h2>{selection.consequence.title}</h2><p>{selection.consequence.description}</p><p className="simulation-caption">Dampak ini hanya terjadi dalam simulasi.</p><button type="button" className="button button-primary" onClick={onContinue}>Lanjutkan</button></section>;
}

export function ScenarioProgressIndicator({ decisionsMade, totalDecisionPoints }: { decisionsMade: number; totalDecisionPoints: number }) {
  return <p className="foundation-progress" role="status">Keputusan {decisionsMade} dari {totalDecisionPoints}</p>;
}

export function ScenarioEnding({ node }: { node: EndingNode }) {
  return <section className="foundation-ending"><h2>{node.title}</h2><p>{node.content}</p><p>Pembahasan akhir akan dihubungkan dengan fitur Debriefing pada Tahap 7.</p></section>;
}
