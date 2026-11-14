import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import { PageHeader } from "@/components/ui/page-header";

export default async function AdminAccountPage() {
  if (!supabaseConfigured()) redirect("/login");
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await client.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/akun");
  const { data: runs, error } = await client.from("simulation_runs").select("id,scenario_id,outcome,completed_at").order("completed_at", { ascending: false }).limit(50);
  if (error) throw new Error("Data pemantauan tidak dapat dimuat.");
  return <main id="main-content" className="dashboard-container"><PageHeader title="Pemantauan simulasi" description="50 penyelesaian simulasi terbaru dari akun yang terhubung." /><p><Link href="/akun">← Kembali ke akun</Link></p>{!runs?.length ? <p>Belum ada hasil tersimpan.</p> : <ul>{runs.map(run => <li key={run.id}>{run.scenario_id} · {run.outcome} · {new Date(run.completed_at).toLocaleString("id-ID")}</li>)}</ul>}</main>;
}
