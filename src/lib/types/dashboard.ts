export interface ScenarioSummary {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly status: "Direncanakan";
}

export interface SimulationActivity {
  readonly id: string;
  readonly studentName: string;
  readonly title: string;
  readonly timeLabel: string;
  readonly status: string;
}

export interface LearningProgressSummary {
  readonly studentCount: number;
  readonly studentsStarted: number;
  readonly materialsCompleted: number;
  readonly simulationsCompleted: number;
}

export interface AdminDashboardData {
  readonly scenarios: readonly ScenarioSummary[];
  readonly recentActivities: readonly SimulationActivity[];
  readonly progress: LearningProgressSummary;
}

export interface StudentDashboardData {
  readonly name: string;
  readonly scenarios: readonly ScenarioSummary[];
  readonly recentActivities: readonly SimulationActivity[];
  readonly progress: LearningProgressSummary;
}
