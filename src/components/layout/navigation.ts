import { BookOpen, ChartNoAxesCombined, History, House, LayoutDashboard, MessagesSquare, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PreviewRole = "admin" | "siswa";
export interface NavigationEntry { label: string; href: string; icon: LucideIcon }
export const navigation: Record<PreviewRole, NavigationEntry[]> = {
  admin: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Manajemen Materi", href: "/admin/materi", icon: BookOpen },
    { label: "Manajemen Skenario", href: "/admin/skenario", icon: MessagesSquare },
    { label: "Pemantauan Progres", href: "/admin/pemantauan", icon: UsersRound },
    { label: "Riwayat Simulasi", href: "/admin/riwayat", icon: History },
  ],
  siswa: [
    { label: "Beranda", href: "/siswa", icon: House },
    { label: "Materi Pembelajaran", href: "/siswa/materi", icon: BookOpen },
    { label: "Skenario Simulasi", href: "/siswa/skenario", icon: MessagesSquare },
    { label: "Progres Belajar", href: "/siswa/progres", icon: ChartNoAxesCombined },
    { label: "Riwayat Simulasi", href: "/siswa/riwayat", icon: History },
  ],
};
