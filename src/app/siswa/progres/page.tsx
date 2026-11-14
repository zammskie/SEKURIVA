import type { Metadata } from "next";
import { StudentProgress } from "@/components/simulation/student-progress";
export const metadata: Metadata = { title: "Progres Belajar" };
export default function Page() { return <StudentProgress />; }
