import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/placeholder-page";
export const metadata: Metadata = { title: "Pemantauan Progres" };
export default function Page() { return <PlaceholderPage role="admin" title="Pemantauan Progres" description="Tinjau perkembangan pembelajaran siswa." future="Pemantauan progres akan dihubungkan dengan aktivitas belajar setelah backend tersedia." />; }
