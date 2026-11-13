import type { Metadata } from "next";
import { MaterialForm } from "@/components/materials/material-form";

export const metadata: Metadata = { title: "Tambah Materi" };
export default function Page() { return <MaterialForm />; }
