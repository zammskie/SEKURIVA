import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/placeholder-page";
export const metadata: Metadata = { title: "Manajemen Materi" };
export default function Page() { return <PlaceholderPage role="admin" title="Manajemen Materi" description="Kelola susunan materi pembelajaran keamanan digital." future="Pengelolaan dan penyuntingan materi akan dikembangkan pada tahap berikutnya." />; }
