import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCheck,
  FlaskConical,
  Layers3,
  UsersRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { adminDemo, recentActivities, studentProgressRows } from "@/data/demo";

export function AdminDashboard() {
  const participationPercent = Math.round((adminDemo.activeStudents / adminDemo.studentsTotal) * 100);

  return (
    <div className="admin-dashboard dashboard-stack">
      <PageHeader
        eyebrow="PUSAT PEMBELAJARAN · ADMIN"
        title="Gambaran pembelajaran."
        description="Ruang untuk meninjau materi, skenario, dan perkembangan belajar siswa."
      >
        <Badge tone="teal">Dashboard demo</Badge>
      </PageHeader>

      <section className="dashboard-metric-strip" aria-label="Statistik ilustrasi, bukan data penelitian">
        <div className="dashboard-metric">
          <p className="dashboard-metric-label"><BookOpen aria-hidden="true" />Materi contoh</p>
          <div className="dashboard-metric-value">{adminDemo.materialsTotal}<small>materi</small></div>
          <p className="dashboard-metric-note">Ringkasan konten demo</p>
        </div>
        <div className="dashboard-metric">
          <p className="dashboard-metric-label"><Layers3 aria-hidden="true" />Pratinjau skenario</p>
          <div className="dashboard-metric-value">{adminDemo.scenarioPreviewsTotal}<small>/ {adminDemo.scenariosPlanned} rencana</small></div>
          <p className="dashboard-metric-note">Katalog demo, belum dimainkan</p>
        </div>
        <div className="dashboard-metric">
          <p className="dashboard-metric-label"><UsersRound aria-hidden="true" />Profil siswa demo</p>
          <div className="dashboard-metric-value">{adminDemo.studentsTotal}<small>profil</small></div>
          <p className="dashboard-metric-note">Seluruh profil bersifat fiktif</p>
        </div>
        <div className="dashboard-metric">
          <p className="dashboard-metric-label"><Activity aria-hidden="true" />Aktivitas simulasi</p>
          <div className="dashboard-metric-value">{adminDemo.simulationActivities}<small>contoh</small></div>
          <p className="dashboard-metric-note">Ilustrasi aktivitas pembelajaran</p>
        </div>
      </section>

      <div className="dashboard-body-grid">
        <Card className="dashboard-admin-overview">
          <div className="dashboard-section-heading"><div><h2>Ringkasan progres</h2><p>Ilustrasi pembelajaran kelas X BC 1</p></div><Badge tone="neutral">Data demo</Badge></div>
          <div className="dashboard-overview-total"><div className="dashboard-overview-number">{adminDemo.averageMaterialProgressPercent}<small>%</small></div><p>Contoh rata-rata penyelesaian materi pada populasi demo.</p></div>
          <div className="dashboard-chart">
            <div className="dashboard-chart-row"><span>Penyelesaian materi</span><div className="dashboard-progress-track" role="progressbar" aria-label="Ilustrasi rata-rata penyelesaian materi" aria-valuemin={0} aria-valuemax={100} aria-valuenow={adminDemo.averageMaterialProgressPercent}><span style={{ width: `${adminDemo.averageMaterialProgressPercent}%` }} /></div><strong>{adminDemo.averageMaterialProgressPercent}%</strong></div>
            <div className="dashboard-chart-row"><span>Partisipasi siswa</span><div className="dashboard-progress-track" role="progressbar" aria-label="Ilustrasi partisipasi siswa" aria-valuemin={0} aria-valuemax={100} aria-valuenow={participationPercent}><span style={{ width: `${participationPercent}%` }} /></div><strong>{participationPercent}%</strong></div>
          </div>
          <ul className="dashboard-chart-legend" aria-label="Keterangan diagram"><li><i aria-hidden="true" />Progres ilustrasi</li><li><i aria-hidden="true" />Bagian yang tersisa</li></ul>
          <p className="dashboard-panel-footnote">Partisipasi mengilustrasikan {adminDemo.activeStudents} profil aktif dari {adminDemo.studentsTotal} profil demo. Bukan hasil pengukuran atau data penelitian.</p>
        </Card>

        <section className="dashboard-activity-panel" aria-labelledby="admin-activity">
          <div className="dashboard-section-heading"><div><h2 id="admin-activity">Jejak pembelajaran</h2><p>Cuplikan aktivitas ilustrasi</p></div></div>
          <ol className="dashboard-activity-list">
            {recentActivities.map((activity) => (
              <li key={activity.id}>
                <div className={`dashboard-activity-icon ${activity.kind}`}>{activity.kind === "scenario" ? <CheckCheck aria-hidden="true" /> : <BookOpen aria-hidden="true" />}</div>
                <div><h3>{activity.title}</h3><p>{activity.description}</p><span className="dashboard-activity-time">{activity.timeLabel}</span></div>
              </li>
            ))}
          </ol>
          <Link className="dashboard-text-link" href="/admin/riwayat" style={{ marginTop: 16 }}>Halaman riwayat <ArrowRight aria-hidden="true" /></Link>
        </section>
      </div>

      <section aria-labelledby="admin-student-progress">
        <div className="dashboard-section-heading"><div><h2 id="admin-student-progress">Sekilas progres siswa</h2><p>Tiga profil fiktif untuk memperlihatkan rancangan pemantauan.</p></div><Link className="dashboard-text-link" href="/admin/pemantauan">Pemantauan <ArrowRight aria-hidden="true" /></Link></div>
        <table className="dashboard-student-table">
          <caption className="sr-only">Contoh progres tiga siswa fiktif, bukan peringkat atau data siswa nyata.</caption>
          <thead><tr><th scope="col">Profil demo</th><th scope="col">Materi</th><th scope="col">Simulasi</th><th scope="col">Progres materi</th><th scope="col">Status demo</th></tr></thead>
          <tbody>
            {studentProgressRows.map((student) => (
              <tr key={student.id}>
                <td><div className="dashboard-student-person"><span className="dashboard-student-avatar" aria-hidden="true">{student.initials}</span><div><strong>{student.name}</strong><small>X BC 1 · Profil fiktif</small></div></div></td>
                <td data-label="Materi">{student.materialsCompleted} / {adminDemo.materialsTotal} materi</td>
                <td data-label="Simulasi">{student.scenariosCompleted} / {adminDemo.scenariosPlanned} rencana</td>
                <td data-label="Progres materi"><div className="dashboard-table-progress"><div className="dashboard-progress-track" aria-hidden="true"><span style={{ width: `${student.progressPercent}%` }} /></div><span>{student.progressPercent}%</span></div></td>
                <td data-label="Status demo"><Badge tone={student.status === "Aktif" ? "success" : "neutral"}>{student.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="dashboard-panel-footnote">Cuplikan ini hanya menunjukkan tampilan tabel. Angka rata-rata di atas merupakan ilustrasi terpisah untuk seluruh populasi demo.</p>
      </section>

      <aside className="dashboard-admin-note">
        <FlaskConical size={22} aria-hidden="true" />
        <div><h2>Ruang pratinjau, tanpa data siswa nyata.</h2><p>Gunakan navigasi untuk meninjau halaman pengelolaan dan pemantauan. Pengelolaan konten, pencatatan aktivitas, dan penyimpanan progres belum tersedia pada tahap ini.</p></div>
      </aside>
    </div>
  );
}
