import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCheck,
  ChevronRight,
  Clock3,
  Info,
  KeyRound,
  LockKeyhole,
  MailWarning,
  MessageSquareWarning,
  ShieldCheck,
  ShieldQuestion,
  ShoppingBag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { recentActivities, studentDemo } from "@/data/demo";
import { materials } from "@/data/materials";
import { PLANNED_SCENARIO_COUNT, scenarioPreviews } from "@/data/scenarios";

const materialIcons = {
  shield: ShieldCheck,
  phishing: ShieldQuestion,
  key: KeyRound,
  privacy: LockKeyhole,
};

const scenarioIcons = {
  message: MessageSquareWarning,
  mail: MailWarning,
  shopping: ShoppingBag,
};

export function StudentDashboard() {
  return (
    <div className="student-dashboard dashboard-stack">
      <PageHeader
        eyebrow="RUANG BELAJAR · X BC 1"
        title={`Selamat datang, ${studentDemo.name}.`}
        description="Kenali risikonya. Pikirkan pilihanmu. Bangun kebiasaan digital yang lebih aman."
      >
        <Badge tone="teal">Dashboard demo</Badge>
      </PageHeader>

      <div className="dashboard-learning-grid">
        <section className="dashboard-learning-hero" aria-labelledby="learning-introduction">
          <div className="dashboard-learning-copy">
            <p className="dashboard-eyebrow"><BookOpen size={14} aria-hidden="true" /> MULAI DARI PEMAHAMAN</p>
            <h2 id="learning-introduction">Lebih peka terhadap risiko digital.</h2>
            <p>Pelajari tanda penipuan di sekitarmu, lalu persiapkan diri untuk mengambil keputusan dengan lebih bijak.</p>
            <ButtonLink href="/siswa/materi" variant="primary">Jelajahi materi <ArrowRight size={16} aria-hidden="true" /></ButtonLink>
          </div>
          <div className="dashboard-shield-art" aria-hidden="true"><ShieldCheck /></div>
        </section>

        <Card className="dashboard-progress-panel">
          <div className="dashboard-section-heading">
            <div><h2>Langkah belajarmu</h2><p>Ringkasan progres ilustrasi</p></div>
          </div>
          <div className="dashboard-progress-item">
            <div className="dashboard-progress-title"><span>Materi dipelajari</span><strong>{studentDemo.materialsCompleted}<small> / {studentDemo.materialsTotal}</small></strong></div>
            <div className="dashboard-progress-track" role="progressbar" aria-label="Ilustrasi progres materi" aria-valuenow={studentDemo.materialProgressPercent} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${studentDemo.materialProgressPercent}%` }} /></div>
          </div>
          <div className="dashboard-progress-item">
            <div className="dashboard-progress-title"><span>Simulasi diselesaikan</span><strong>{studentDemo.scenariosCompleted}<small> / {studentDemo.scenariosTotal} tersedia</small></strong></div>
            <div className="dashboard-progress-track navy" role="progressbar" aria-label="Ilustrasi progres simulasi" aria-valuenow={studentDemo.scenarioProgressPercent} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${studentDemo.scenarioProgressPercent}%` }} /></div>
          </div>
          <p className="dashboard-progress-caption">Angka contoh untuk meninjau tampilan. Progres belum dapat dicatat atau disimpan.</p>
        </Card>
      </div>

      <div className="dashboard-body-grid">
        <section aria-labelledby="student-materials">
          <div className="dashboard-section-heading">
            <div><h2 id="student-materials">Bekal sebelum simulasi</h2><p>Empat materi lengkap dengan contoh dan cek pemahaman.</p></div>
            <Link className="dashboard-text-link" href="/siswa/materi">Lihat materi <ArrowRight aria-hidden="true" /></Link>
          </div>
          <ul className="dashboard-materials">
            {materials.map((material) => {
              const Icon = materialIcons[material.icon];
              const completed = material.status === "Selesai";
              return (
                <li className="dashboard-material-row" key={material.id}>
                  <div className="dashboard-material-icon"><Icon aria-hidden="true" /></div>
                  <div className="dashboard-material-copy">
                    <h3>{material.title}</h3>
                    <p><span>{material.category}</span><span aria-hidden="true">·</span><Clock3 aria-hidden="true" />{material.durationMinutes} menit <span aria-hidden="true">·</span> {material.lessonCount} topik</p>
                  </div>
                  <span className={`dashboard-material-state${completed ? "" : " pending"}`}>{completed && <Check size={12} aria-hidden="true" />}{completed ? "Demo selesai" : "Belum dipelajari"}</span>
                  <Link href={"/siswa/materi/" + material.id} aria-label={`Lihat halaman materi: ${material.title}`}><ChevronRight size={17} aria-hidden="true" /></Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="dashboard-activity-panel" aria-labelledby="student-activity">
          <div className="dashboard-section-heading"><div><h2 id="student-activity">Aktivitas terakhir</h2><p>Contoh perjalanan belajar</p></div><Badge tone="neutral">Demo</Badge></div>
          <ol className="dashboard-activity-list">
            {recentActivities.map((activity) => (
              <li key={activity.id}>
                <div className={`dashboard-activity-icon ${activity.kind}`}>
                  {activity.kind === "scenario" ? <CheckCheck aria-hidden="true" /> : <BookOpen aria-hidden="true" />}
                </div>
                <div><h3>{activity.title}</h3><p>{activity.description}</p><span className="dashboard-activity-time">{activity.timeLabel}</span></div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section aria-labelledby="student-scenarios">
        <div className="dashboard-section-heading">
          <div><h2 id="student-scenarios">Situasi nyata, ruang belajar yang aman</h2><p>Pilih latihan untuk mencoba keputusan dan melihat konsekuensinya.</p></div>
        </div>
        <div className="dashboard-scenario-grid">
          {scenarioPreviews.slice(0, 3).map((scenario, index) => {
            const Icon = scenarioIcons[scenario.icon];
            return (
              <article className="dashboard-scenario" key={scenario.id}>
                <div className="dashboard-scenario-top"><div className="dashboard-scenario-icon"><Icon aria-hidden="true" /></div><span className="dashboard-scenario-number">0{index + 1}</span></div>
                <h3>{scenario.title}</h3>
                <p>{scenario.description}</p>
                <div className="dashboard-scenario-meta"><span>{scenario.category}</span><Link className="dashboard-text-link" href={"/siswa/skenario/" + scenario.id}>Buka latihan <ArrowRight aria-hidden="true" /></Link></div>
              </article>
            );
          })}
        </div>
        <div className="dashboard-scenario-footer">
          <p className="dashboard-demo-note"><Info size={14} aria-hidden="true" />Tersedia {PLANNED_SCENARIO_COUNT} skenario. Progres pada dashboard adalah data ilustrasi.</p>
          <Link className="dashboard-text-link" href="/siswa/skenario">Lihat halaman skenario <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  );
}


