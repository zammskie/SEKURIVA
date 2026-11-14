"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useScenarios } from "@/lib/scenario-engine/use-scenarios";
import { ScenarioEditor } from "./scenario-editor";

export function ScenarioEditorLoader() {
  const params = useParams<{ id: string }>();
  const { scenarios } = useScenarios();

  if (scenarios === null) return <p role="status">Memuat data skenario…</p>;

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

  return <ScenarioEditor initialScenario={scenario} />;
}
