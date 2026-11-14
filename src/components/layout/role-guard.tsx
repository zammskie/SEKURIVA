"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useCurrentUser } from "@/lib/auth/demo-session";
import type { PreviewRole } from "./navigation";
import { ButtonLink } from "@/components/ui/button";

const emptySubscribe = () => () => {};

export function RoleGuard({ role, children }: { role: PreviewRole; children: ReactNode }) {
  const { user } = useCurrentUser(role);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return <>{children}</>;
  }

  // If page requires admin but active demo user has role "siswa"
  if (role === "admin" && user.role === "siswa") {
    return (
      <div className="admin-card" style={{ maxWidth: 580, margin: "60px auto", textAlign: "center" }}>
        <div style={{ display: "grid", placeItems: "center", width: 56, height: 56, margin: "0 auto 16px", borderRadius: 14, background: "#fdf0f0", color: "#a83c3c" }}>
          <ShieldAlert size={28} />
        </div>
        <h2 style={{ fontSize: 20, marginBottom: 8, color: "#10243A" }}>Akses Halaman Dibatasi</h2>
        <p style={{ color: "#647789", fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
          Akun demo aktif saat ini adalah <strong>{user.name}</strong> ({user.roleLabel}). Halaman Ruang Admin hanya dapat diakses oleh akun dengan peran Admin.
        </p>
        <p style={{ fontSize: 11, color: "#8fa5b6", background: "#f8fafc", padding: "10px 14px", borderRadius: 8, marginBottom: 20 }}>
          Pemberitahuan: Batasan ini merupakan role guard frontend untuk demonstrasi prototipe. Pengamanan sebenarnya akan diterapkan pada backend dan database Supabase.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <ButtonLink href="/siswa">
            <ArrowLeft size={16} /> Kembali ke Beranda Siswa
          </ButtonLink>
          <ButtonLink href="/preview" variant="secondary">
            Ganti Akun Demo
          </ButtonLink>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
