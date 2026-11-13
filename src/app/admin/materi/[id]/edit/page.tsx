import type { Metadata } from "next";
import { MaterialForm } from "@/components/materials/material-form";

export const metadata: Metadata = { title: "Edit Materi" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <MaterialForm id={(await params).id} />; }
