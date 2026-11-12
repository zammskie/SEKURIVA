import { materials } from "@/data/materials";
import { PLANNED_SCENARIO_COUNT, scenarioPreviews } from "@/data/scenarios";
import type { DemoActivity, DemoStudentProgress } from "@/lib/types";

/** Tidak ada data penelitian atau pengguna nyata di dalam modul ini. */
export const DEMO_NOTICE = "MODE PREVIEW — DATA DEMO";

export const studentDemo = {
  name: "Siswa Demo",
  initials: "SD",
  className: "X BC 1",
  schoolName: "SMK Negeri 1 Semarang",
  materialsCompleted: 2,
  materialsTotal: materials.length,
  scenariosCompleted: 1,
  scenariosTotal: PLANNED_SCENARIO_COUNT,
  materialProgressPercent: 50,
  scenarioProgressPercent: 12.5,
  studyMinutes: 30,
} as const;

export const adminDemo = {
  materialsTotal: materials.length,
  scenarioPreviewsTotal: scenarioPreviews.length,
  scenariosPlanned: PLANNED_SCENARIO_COUNT,
  studentsTotal: 24,
  activeStudents: 18,
  simulationActivities: 12,
  averageMaterialProgressPercent: 50,
} as const;

/** Waktu relatif berikut hanya label ilustrasi, bukan aktivitas aktual. */
export const recentActivities = [
  {
    id: "activity-1",
    title: "Pesan dari Kurir Paket",
    description: "Contoh penyelesaian simulasi dan refleksi",
    timeLabel: "Contoh · 1 hari lalu",
    kind: "scenario",
    status: "Selesai",
  },
  {
    id: "activity-2",
    title: "Mengenali Phishing",
    description: "Contoh materi yang sudah dipelajari",
    timeLabel: "Contoh · 2 hari lalu",
    kind: "material",
    status: "Selesai",
  },
  {
    id: "activity-3",
    title: "Dasar Keamanan Digital",
    description: "Contoh langkah awal pembelajaran",
    timeLabel: "Contoh · 3 hari lalu",
    kind: "material",
    status: "Selesai",
  },
] as const satisfies readonly DemoActivity[];

/** Cuplikan tiga profil fiktif; bukan seluruh populasi demo dan bukan peringkat. */
export const studentProgressRows = [
  {
    id: "demo-a",
    name: "Siswa Demo A",
    initials: "DA",
    materialsCompleted: 3,
    scenariosCompleted: 2,
    progressPercent: 75,
    status: "Aktif",
  },
  {
    id: "demo-b",
    name: "Siswa Demo B",
    initials: "DB",
    materialsCompleted: 2,
    scenariosCompleted: 1,
    progressPercent: 50,
    status: "Aktif",
  },
  {
    id: "demo-c",
    name: "Siswa Demo C",
    initials: "DC",
    materialsCompleted: 0,
    scenariosCompleted: 0,
    progressPercent: 0,
    status: "Belum mulai",
  },
] as const satisfies readonly DemoStudentProgress[];
