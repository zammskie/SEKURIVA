"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { RoleGuard } from "./role-guard";
import type { PreviewRole } from "./navigation";

export function AppShell({ role, children }: { role: PreviewRole; children: ReactNode }) {
  const drawerRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef("");
  const [menuOpen, setMenuOpen] = useState(false);
  function closeDrawer() { drawerRef.current?.close(); }
  function restoreScroll() { document.body.style.overflow = scrollRef.current; setMenuOpen(false); }
  function openDrawer() {
    scrollRef.current = document.body.style.overflow;
    drawerRef.current?.showModal();
    document.body.style.overflow = "hidden";
    setMenuOpen(true);
  }
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const onChange = () => { if (media.matches) drawerRef.current?.close(); };
    media.addEventListener("change", onChange);
    return () => { media.removeEventListener("change", onChange); document.body.style.overflow = scrollRef.current; };
  }, []);
  return <div className="app-shell"><aside className="desktop-sidebar"><Sidebar role={role} /></aside><dialog id="mobile-navigation" ref={drawerRef} className="mobile-drawer" aria-label={`Menu navigasi ${role}`} onClose={restoreScroll} onClick={event => { if (event.target === event.currentTarget) closeDrawer(); }}><div className="mobile-drawer-inner"><button type="button" className="icon-button drawer-close" aria-label="Tutup menu navigasi" onClick={closeDrawer}><X size={21} /></button><Sidebar role={role} onNavigate={closeDrawer} /></div></dialog><div className="app-main"><Topbar role={role} onOpenMenu={openDrawer} menuOpen={menuOpen} /><main id="main-content" className="dashboard-container" tabIndex={-1}><RoleGuard role={role}>{children}</RoleGuard></main><footer className="app-footer"><span>Security Awareness Simulator</span><span>Media pembelajaran · SMK Negeri 1 Semarang</span></footer></div></div>;
}
