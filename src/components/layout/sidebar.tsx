import { ArrowLeftRight, ArrowUpRight, GraduationCap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Brand } from "./brand";
import { navigation, type PreviewRole } from "./navigation";
import { NavigationItem } from "./navigation-item";

export function Sidebar({ role, onNavigate }: { role: PreviewRole; onNavigate?: () => void }) {
  return <div className="sidebar-content"><Brand inverse /><div className="sidebar-school"><GraduationCap size={17} aria-hidden="true" /><span>SMK Negeri 1 Semarang<small>Kelas X BC 1</small></span></div><div className="sidebar-menu"><p className="sidebar-label">RUANG {role === "admin" ? "ADMIN" : "BELAJAR"}</p><nav aria-label={`Navigasi ${role}`} className="sidebar-nav">{navigation[role].map(item => <NavigationItem key={item.href} item={item} onNavigate={onNavigate} />)}</nav></div><div className="sidebar-bottom"><div className="sidebar-note"><ShieldCheck size={21} aria-hidden="true" /><p>Lebih sadar.<br /><strong>Lebih aman di dunia digital.</strong></p></div><Link href="/preview" className="sidebar-switch" onClick={onNavigate}><ArrowLeftRight size={17} aria-hidden="true" />Ganti peran preview<ArrowUpRight size={15} aria-hidden="true" /></Link><p className="sidebar-version">FRONTEND PREVIEW <span>TAHAP 04</span></p></div></div>;
}


