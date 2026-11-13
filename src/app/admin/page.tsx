import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { mockDashboardRepository } from "@/lib/repositories/mock-dashboard-repository";

export const metadata: Metadata = { title: "Dashboard Admin" };
export default async function AdminPage() { return <AdminDashboard data={await mockDashboardRepository.getAdminDashboard()} />; }
