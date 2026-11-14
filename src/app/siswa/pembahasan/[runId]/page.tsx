import type { Metadata } from "next";
import { DebriefingView } from "@/components/simulation/debriefing-view";
export const metadata: Metadata = { title: "Pembahasan Simulasi" };
export default async function Page({ params }: { params: Promise<{ runId: string }> }) { const { runId } = await params; return <DebriefingView runId={runId} />; }
