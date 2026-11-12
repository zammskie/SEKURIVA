import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/placeholder-page";
export const metadata: Metadata = { title: "Riwayat Simulasi" };
export default function Page() { return <PlaceholderPage role="admin" title="Riwayat Simulasi" description="Tinjau catatan proses dan hasil simulasi siswa." future="Riwayat keputusan dan hasil simulasi akan dikembangkan bersama mesin simulasi." />; }
