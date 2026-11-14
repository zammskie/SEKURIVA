export interface DemoUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: "admin" | "siswa";
  readonly roleLabel: string;
  readonly className?: string;
  readonly avatarInitials: string;
  readonly badgeLabel: string;
  readonly description: string;
}

export const DEMO_ADMIN: DemoUser = {
  id: "admin-demo",
  name: "Pak Eko Prasetyo, S.Kom.",
  email: "eko.prasetyo@smkn1semarang.sch.id",
  role: "admin",
  roleLabel: "Guru / Pengelola Lab",
  avatarInitials: "EP",
  badgeLabel: "Admin Pengelola",
  description: "Pengelola media pembelajaran, materi keamanan digital, dan pemantauan aktivitas belajar siswa.",
};

export const DEMO_STUDENTS: readonly DemoUser[] = [
  {
    id: "siswa-demo",
    name: "Budi Santoso",
    email: "budi.santoso@example.test",
    role: "siswa",
    roleLabel: "Siswa Kelas X BC 1",
    className: "Kelas X BC 1",
    avatarInitials: "BS",
    badgeLabel: "Siswa Demo 01",
    description: "Siswa kelas X BC 1 yang sedang aktif mencoba skenario kurir dan tugas online.",
  },
  {
    id: "siswa-demo-2",
    name: "Siti Rahmawati",
    email: "siti.rahma@example.test",
    role: "siswa",
    roleLabel: "Siswa Kelas X BC 1",
    className: "Kelas X BC 1",
    avatarInitials: "SR",
    badgeLabel: "Siswa Demo 02",
    description: "Siswa kelas X BC 1 yang telah menyelesaikan beberapa skenario simulasi.",
  },
  {
    id: "siswa-demo-3",
    name: "Dimas Anggara",
    email: "dimas.anggara@example.test",
    role: "siswa",
    roleLabel: "Siswa Kelas X BC 1",
    className: "Kelas X BC 1",
    avatarInitials: "DA",
    badgeLabel: "Siswa Demo 03",
    description: "Siswa baru yang belum memulai simulasi pada data demonstrasi.",
  },
];

export const ALL_DEMO_USERS: readonly DemoUser[] = [DEMO_ADMIN, ...DEMO_STUDENTS];

export function findDemoUser(id: string): DemoUser | undefined {
  return ALL_DEMO_USERS.find(user => user.id === id);
}
