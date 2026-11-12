"use client";

import { Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PreviewRole } from "./navigation";

export function Topbar({ role, onOpenMenu }: { role: PreviewRole; onOpenMenu: () => void }) {
  return <header className="topbar"><div className="topbar-left"><button type="button" className="icon-button mobile-menu-trigger" aria-label="Buka menu navigasi" aria-haspopup="dialog" aria-controls="mobile-navigation" onClick={onOpenMenu}><Menu size={23} /></button><span className="topbar-label">Ruang {role === "admin" ? "admin" : "belajar siswa"}</span><Badge tone="warning"><span className="demo-dot" />MODE PREVIEW — DATA DEMO</Badge></div><div className="topbar-user"><span className="user-avatar">{role === "admin" ? "AD" : "SD"}</span><div><strong>{role === "admin" ? "Admin" : "Siswa"} Demo</strong><span>{role === "admin" ? "Pratinjau pengelola" : "Kelas X BC 1"}</span></div></div></header>;
}
