import type { AdminDashboardData, ScenarioSummary, StudentDashboardData } from "@/lib/types/dashboard";
import { scenarioCatalog } from "@/data/scenarios/catalog";

/** Dashboard membaca sumber metadata yang sama dengan katalog skenario siswa. */
export const plannedScenarios: readonly ScenarioSummary[] = scenarioCatalog.map(item => ({ id: item.id, title: item.title, category: item.category, status: "Direncanakan" }));

const demoProfiles = ["Siswa Demo A", "Siswa Demo B", "Siswa Demo C"] as const;
const progress = { studentCount: demoProfiles.length, studentsStarted: 0, materialsCompleted: 0, simulationsCompleted: 0 } as const;

export const adminDashboardData: AdminDashboardData = {
  scenarios: plannedScenarios,
  recentActivities: [],
  progress,
};

export const studentDashboardData: StudentDashboardData = {
  name: "Siswa Demo",
  scenarios: plannedScenarios,
  recentActivities: [],
  progress: { studentCount: 1, studentsStarted: 0, materialsCompleted: 0, simulationsCompleted: 0 },
};
