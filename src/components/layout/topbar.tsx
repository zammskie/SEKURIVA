"use client";

import { LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import type { PreviewRole } from "./navigation";
import { useCurrentUser } from "@/lib/auth/demo-session";

export function Topbar({ role, onOpenMenu, menuOpen }: { role: PreviewRole; onOpenMenu: () => void; menuOpen: boolean }) {
  const router = useRouter();
  const { user, clearCurrentUser } = useCurrentUser(role);

  const handleLogout = () => {
    clearCurrentUser();
    router.push("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="icon-button mobile-menu-trigger"
          aria-label="Buka menu navigasi"
          aria-haspopup="dialog"
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          onClick={onOpenMenu}
        >
          <Menu size={23} />
        </button>
        <span className="topbar-label">Ruang {role === "admin" ? "Admin Pengelola" : "Belajar Siswa"}</span>
        <Badge tone="warning">
          <span className="demo-dot" />
          MODE PREVIEW — DATA DEMO
        </Badge>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div className="topbar-user">
          <span className="user-avatar">{user.avatarInitials}</span>
          <div>
            <strong>{user.name}</strong>
            <span>{user.roleLabel}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="admin-btn-sm admin-btn-outline"
          title="Keluar dari sesi demo"
          style={{ height: 34 }}
        >
          <LogOut size={14} aria-hidden="true" />
          <span className="hidden-mobile" style={{ fontSize: 12 }}>Keluar</span>
        </button>
      </div>
    </header>
  );
}
