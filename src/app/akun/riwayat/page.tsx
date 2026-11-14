import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import { PageHeader } from "@/components/ui/page-header";

export default async function AccountHistoryPage() {
  if (!supabaseConfigured()) redirect("/login");
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/login");
  const { data, error } = await client.from("simulation_runs").select("id,scenario_id,outcome,completed_at").eq("user_id", user.id).order("completed_at", { ascending: false }).limit(50);
  if (error) throw new Error("Riwayat tidak dapat dimuat.");
  return <main id="main-content" className="dashboard-container"><PageHeader title="Riwayat simulasi" description="Hasil latihan yang tersimpan pada akunmu." /><p><Link href="/akun">← Kembali ke akun</Link></p>{!data?.length ? <p>Belum ada simulasi yang selesai dan tersimpan.</p> : <ul>{data.map(run => <li key={run.id}><strong>{run.scenario_id}</strong> · {run.outcome} · {new Date(run.completed_at).toLocaleString("id-ID")}</li>)}</ul>}</main>;
}
