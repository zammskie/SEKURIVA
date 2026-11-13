export const MATERIAL_CATEGORIES = [
  "Dasar Kesadaran Keamanan Digital",
  "Social Engineering",
  "Phishing",
  "Keamanan Transaksi Digital",
  "Perlindungan Data Pribadi dan Keamanan Perangkat",
] as const;
export type MaterialCategory = (typeof MATERIAL_CATEGORIES)[number];
export type MaterialStatus = "Draft" | "Published";
export type MaterialDifficulty = "Dasar" | "Menengah";
export type MaterialIcon = "shield" | "users" | "link" | "wallet" | "lock";

export interface MaterialSection {
  id: string;
  heading: string;
  paragraphs: string[];
  bulletPoints: string[];
  optionalCallout: string;
}

export interface MaterialReference {
  title: string;
  author: string;
  year: string;
  url: string;
}

export interface Material {
  id: string;
  title: string;
  slug: string;
  category: MaterialCategory;
  summary: string;
  learningObjectives: string[];
  estimatedDuration: number;
  difficulty: MaterialDifficulty;
  coverIcon: MaterialIcon;
  status: MaterialStatus;
  sections: MaterialSection[];
  keyTakeaways: string[];
  redFlags: string[];
  safeActions: string[];
  references: MaterialReference[];
  learningChecks?: LearningCheck[];
  createdAt: string;
  updatedAt: string;
}

export type MaterialInput = Omit<Material, "id" | "slug" | "createdAt" | "updatedAt">;
export type MaterialErrors = Record<string, string>;
import type { LearningCheck } from "@/lib/types/material";

