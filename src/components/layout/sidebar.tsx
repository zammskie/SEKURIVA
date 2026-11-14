"use client";

import { ArrowLeftRight, ArrowUpRight, GraduationCap, LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brand } from "./brand";
import { navigation, type PreviewRole } from "./navigation";
import { NavigationItem } from "./navigation-item";
import { useCurrentUser } from "@/lib/auth/demo-session";

export function Sidebar({ role, onNavigate }: { role: PreviewRole; onNavigate?: () => void }) {
  const router = useRouter();
  const { user, clearCurrentUser } = useCurrentUser(role);

  const handleLogout = () => {
    clearCurrentUser();
    if (onNavigate) onNavigate();
    router.push("/login");
  };

  return (
    <div className="sidebar-content">
      <Brand inverse />
      <div className="sidebar-school">
        <GraduationCap size={17} aria-hidden="true" />
        <span>
          SMK Negeri 1 Semarang
          <small>{user.role === "admin" ? "Lab Komputer & Jaringan" : user.className ?? "Kelas X BC 1"}</small>
        </span>
      </div>

      <div className="sidebar-menu">
        <p className="sidebar-label">RUANG {role === "admin" ? "ADMIN" : "BELAJAR"}</p>
        <nav aria-label={`Navigasi ${role}`} className="sidebar-nav">
          {navigation[role].map(item => (
            <NavigationItem key={item.href} item={item} onNavigate={onNavigate} />
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <ShieldCheck size={21} aria-hidden="true" />
          <p>
            Lebih sadar.<br />
            <strong>Lebih aman di dunia digital.</strong>
          </p>
        </div>

        <div style={{ padding: "12px 8px 10px", borderTop: "1px solid #294054", fontSize: 11, color: "#cbd8e1" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ display: "grid", placeItems: "center", width: 24, height: 24, borderRadius: "50%", background: "#1b3c50", fontSize: 10, fontWeight: 700, color: "#19b8a5" }}>
              {user.avatarInitials}
            </span>
            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              <strong style={{ display: "block", color: "#fff", fontSize: 11 }}>{user.name}</strong>
              <span style={{ fontSize: 9, color: "#8fa5b6" }}>{user.roleLabel}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: 0, color: "#ef9a9a", fontSize: 11, cursor: "pointer", padding: "4px 0" }}
          >
            <LogOut size={13} aria-hidden="true" />
            Keluar (Logout)
          </button>
        </div>

        <Link href="/preview" className="sidebar-switch" onClick={onNavigate}>
          <ArrowLeftRight size={17} aria-hidden="true" />
          Ganti akun / peran
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
        <p className="sidebar-version">
          FRONTEND PREVIEW <span>TAHAP 08</span>
        </p>
      </div>
    </div>
  );
}
