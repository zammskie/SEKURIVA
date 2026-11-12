import type { ScenarioDifficulty } from "./simulation";

export type MaterialIcon = "shield" | "phishing" | "key" | "privacy";
export type ScenarioIcon = "message" | "mail" | "shopping";

/** Ringkasan tampilan saja; bukan materi lengkap atau rekaman siswa nyata. */
export interface MaterialSummary {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly durationMinutes: number;
  readonly lessonCount: number;
  readonly icon: MaterialIcon;
  readonly status: "Selesai" | "Belum dipelajari";
}

/** Katalog konsep skenario. Sengaja terpisah dari Scenario yang bisa dijalankan. */
export interface ScenarioPreview {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly durationMinutes: number;
  readonly difficulty: ScenarioDifficulty;
  readonly icon: ScenarioIcon;
}

export interface DemoActivity {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly timeLabel: string;
  readonly kind: "material" | "scenario";
  readonly status: "Selesai" | "Dipelajari";
}

export interface DemoStudentProgress {
  readonly id: string;
  readonly name: string;
  readonly initials: string;
  readonly materialsCompleted: number;
  readonly scenariosCompleted: number;
  readonly progressPercent: number;
  readonly status: "Aktif" | "Belum mulai";
}
