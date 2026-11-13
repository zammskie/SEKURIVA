import type { AdminDashboardData, StudentDashboardData } from "@/lib/types/dashboard";

export interface DashboardRepository {
  getAdminDashboard(): Promise<AdminDashboardData>;
  getStudentDashboard(): Promise<StudentDashboardData>;
}
