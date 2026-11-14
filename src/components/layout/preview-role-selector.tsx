"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, GraduationCap, LayoutDashboard, Users } from "lucide-react";
import { DEMO_ADMIN, DEMO_STUDENTS } from "@/lib/auth/demo-users";
import { setCurrentUser, useCurrentUser } from "@/lib/auth/demo-session";
import { Badge } from "@/components/ui/badge";

export function PreviewRoleSelector() {
  const router = useRouter();
  const { user: currentUser } = useCurrentUser();
  const [selectedStudentId, setSelectedStudentId] = useState("siswa-demo");

  const handleSelectAdmin = () => {
    setCurrentUser(DEMO_ADMIN);
    router.push("/admin");
  };

  const handleSelectStudent = (studentId = selectedStudentId) => {
    const target = DEMO_STUDENTS.find(s => s.id === studentId) || DEMO_STUDENTS[0];
    setCurrentUser(target);
    router.push("/siswa");
  };

  return (
    <>
      <div className="preview-role-grid">
        <div
          role="button"
          tabIndex={0}
          onClick={handleSelectAdmin}
          onKeyDown={e => { if (e.key === "Enter" || e.key === " ") handleSelectAdmin(); }}
          className="preview-role-card"
          style={{ cursor: "pointer" }}
        >
          <div className="preview-role-top">
            <div className="preview-role-icon">
              <LayoutDashboard size={28} aria-hidden="true" />
            </div>
            <span>PENGELOLA</span>
          </div>
          <h2>Preview sebagai Admin</h2>
          <p>
            Masuk sebagai <strong>{DEMO_ADMIN.name}</strong> ({DEMO_ADMIN.roleLabel}).
          </p>
          <ul>
            <li><Check size={16} aria-hidden="true" /> Dashboard & pemantauan dinamis</li>
            <li><Check size={16} aria-hidden="true" /> CRUD lengkap materi keamanan digital</li>
            <li><Check size={16} aria-hidden="true" /> Pengelolaan skenario, graph & validator</li>
            <li><Check size={16} aria-hidden="true" /> Pemantauan progres & riwayat siswa</li>
          </ul>
          <div className="preview-role-action">
            Buka Dashboard Admin <ArrowRight size={19} aria-hidden="true" />
          </div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => handleSelectStudent()}
          onKeyDown={e => { if (e.key === "Enter" || e.key === " ") handleSelectStudent(); }}
          className="preview-role-card preview-role-student"
          style={{ cursor: "pointer" }}
        >
          <div className="preview-role-top">
            <div className="preview-role-icon">
              <GraduationCap size={29} aria-hidden="true" />
            </div>
            <span>PEMBELAJAR</span>
          </div>
          <h2>Preview sebagai Siswa</h2>
          <p>
            Masuk sebagai siswa kelas X BC 1 untuk membaca materi dan mencoba 8 skenario simulasi.
          </p>
          <ul>
            <li><Check size={16} aria-hidden="true" /> Beranda belajar siswa & progres</li>
            <li><Check size={16} aria-hidden="true" /> 4 materi keamanan digital terbit</li>
            <li><Check size={16} aria-hidden="true" /> 8 skenario simulasi interaktif</li>
            <li><Check size={16} aria-hidden="true" /> Catatan keputusan & debriefing</li>
          </ul>
          <div className="preview-role-action">
            Buka Beranda Siswa <ArrowRight size={19} aria-hidden="true" />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, padding: "18px 22px", background: "white", border: "1px solid var(--color-border)", borderRadius: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Users size={18} style={{ color: "var(--color-accent)" }} />
            <h3 style={{ fontSize: 14, margin: 0 }}>Pilih Profil Siswa Fiktif untuk Pengujian</h3>
          </div>
          <Badge tone="neutral">Akun Aktif: {currentUser.name}</Badge>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
          {DEMO_STUDENTS.map(student => {
            const isSelected = student.id === selectedStudentId;
            return (
              <button
                key={student.id}
                type="button"
                onClick={() => {
                  setSelectedStudentId(student.id);
                  handleSelectStudent(student.id);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: isSelected ? "2px solid #19b8a5" : "1px solid var(--color-border)",
                  background: isSelected ? "#f4faf9" : "#fff",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "grid", placeItems: "center", width: 32, height: 32, borderRadius: "50%", background: "#e8f3f1", color: "#176e64", fontSize: 11, fontWeight: 700 }}>
                  {student.avatarInitials}
                </div>
                <div>
                  <strong style={{ display: "block", fontSize: 12, color: "#10243A" }}>{student.name}</strong>
                  <span style={{ fontSize: 11, color: "#647789" }}>{student.email}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
