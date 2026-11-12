import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/placeholder-page";
export const metadata: Metadata = { title: "Progres Belajar" };
export default function Page() { return <PlaceholderPage role="siswa" title="Progres Belajar" description="Kenali perkembangan pemahaman keamanan digitalmu." future="Pencatatan progres belajar akan tersedia setelah materi dan simulasi terhubung." />; }
