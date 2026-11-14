import type { Metadata } from "next";
import { StudentHistoryDetail } from "@/components/simulation/student-history";
export const metadata: Metadata = { title: "Detail Riwayat Simulasi" };
export default async function Page({ params }: { params: Promise<{ runId: string }> }) { const { runId } = await params; return <StudentHistoryDetail runId={runId} />; }
