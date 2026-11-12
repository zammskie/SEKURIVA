export interface LearningCheck {
  question: string;
  options: readonly { id: string; label: string; explanation: string }[];
  correctOptionId: string;
}
export interface MaterialContent {
  id: string;
  objectives: readonly string[];
  sections: readonly { id: string; title: string; paragraphs: readonly string[]; example: string }[];
  checklist: readonly string[];
  reflection: string;
  check: LearningCheck;
  sources: readonly { title: string; url: string }[];
}
