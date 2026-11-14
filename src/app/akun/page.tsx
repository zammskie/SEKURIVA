import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import { PageHeader } from "@/components/ui/page-header";

export default async function AccountPage() {
  if (!supabaseConfigured()) redirect("/login");
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile, error } = await client.from("profiles").select("role,display_name").eq("id", user.id).single();
  if (error || !profile) throw new Error("Profil belum tersedia. Periksa migrasi Supabase.");
  return <main id="main-content" className="dashboard-container"><PageHeader title={`Halo, ${profile.display_name || "Pengguna"}`} description={`Akun terhubung sebagai ${profile.role}.`} /><p>Gunakan latihan untuk mencatat hasil simulasi ke akun ini. Progres tersimpan dapat dilihat di halaman akun.</p><p><Link href="/siswa/skenario">Buka skenario →</Link></p><p><Link href="/akun/riwayat">Lihat riwayat simulasi →</Link></p>{profile.role === "admin" && <p><Link href="/akun/admin">Pemantauan admin →</Link></p>}<form action="/auth/logout" method="post"><button className="button button-secondary" type="submit">Keluar</button></form></main>;
}
