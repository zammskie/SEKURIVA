import { adminDashboardData, studentDashboardData } from "@/data/dashboard";
import type { DashboardRepository } from "./dashboard-repository";

/** Sumber data lokal; kontrak baca dapat diganti adapter Supabase pada tahap berikutnya. */
export const mockDashboardRepository: DashboardRepository = {
  async getAdminDashboard() { return adminDashboardData; },
  async getStudentDashboard() { return studentDashboardData; },
};
