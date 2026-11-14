import type { Metadata } from "next";
import { StudentHistory } from "@/components/simulation/student-history";
export const metadata: Metadata = { title: "Riwayat Simulasi" };
export default function Page() { return <StudentHistory />; }
