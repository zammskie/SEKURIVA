import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/public.css";
import "@/styles/dashboards.css";
import "@/styles/simulation.css";
import "@/styles/content.css";

export const metadata: Metadata = {
  title: { default: "Security Awareness Simulator", template: "%s | Security Awareness Simulator" },
  description: "Frontend preview media pembelajaran keamanan digital untuk siswa kelas X BC 1 SMK Negeri 1 Semarang.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body><a className="skip-link" href="#main-content">Lewati ke konten utama</a>{children}</body></html>;
}

