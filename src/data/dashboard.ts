import type { AdminDashboardData, ScenarioSummary, StudentDashboardData } from "@/lib/types/dashboard";

/** Rencana konten Tahap 3. Katalog latihan yang sudah ada tetap terpisah. */
export const plannedScenarios = [
  { id: "lowongan-paruh-waktu", title: "Lowongan Kerja Paruh Waktu Palsu", category: "Lowongan kerja", status: "Direncanakan" },
  { id: "tugas-deposit", title: "Penipuan Tugas Online dengan Sistem Deposit", category: "Tugas online", status: "Direncanakan" },
  { id: "kurir-qr", title: "Penipuan Kurir dan QR Code Paket", category: "Pesan paket", status: "Direncanakan" },
  { id: "apk-palsu", title: "File APK Undangan atau Resi Palsu", category: "Keamanan perangkat", status: "Direncanakan" },
  { id: "qris-palsu", title: "QRIS Palsu pada Transaksi", category: "Transaksi digital", status: "Direncanakan" },
  { id: "customer-service", title: "Customer Service Palsu", category: "Penyamaran identitas", status: "Direncanakan" },
  { id: "investasi-impersonasi", title: "Investasi Palsu dan Impersonasi", category: "Investasi", status: "Direncanakan" },
  { id: "recovery-scam", title: "Penipuan Pemulihan Dana (Recovery Scam)", category: "Pemulihan dana", status: "Direncanakan" },
] as const satisfies readonly ScenarioSummary[];

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
