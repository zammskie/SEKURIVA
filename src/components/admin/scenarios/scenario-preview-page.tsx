"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useScenarios } from "@/lib/scenario-engine/use-scenarios";
import { ScenarioPreviewModal } from "./scenario-preview-modal";

export function AdminScenarioPreviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { scenarios } = useScenarios();

  if (scenarios === null) return <p role="status">Memuat preview skenario…</p>;

  const scenario = scenarios.find(s => s.id === params.id || s.slug === params.id);
  if (!scenario) {
    return (
      <div className="material-empty">
        <h2>Skenario tidak ditemukan.</h2>
        <p>Skenario dengan ID atau slug &quot;{params.id}&quot; tidak ditemukan.</p>
        <Link className="dashboard-text-link" href="/admin/skenario">
          Kembali ke daftar skenario
        </Link>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Dashboard Admin", href: "/admin" },
          { label: "Manajemen Skenario", href: "/admin/skenario" },
          { label: scenario.title, href: `/admin/skenario/${scenario.id}` },
          { label: "Preview Simulasi" },
        ]}
      />
      <div style={{ marginBottom: 16 }}>
        <Link className="dashboard-text-link" href={`/admin/skenario/${scenario.id}`}>
          <ArrowLeft size={16} /> Kembali ke Detail Skenario
        </Link>
      </div>
      <ScenarioPreviewModal scenario={scenario} onClose={() => router.push(`/admin/skenario/${scenario.id}`)} />
    </>
  );
}
