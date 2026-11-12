import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Brand({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return <Link href="/" className={cn("brand", inverse && "brand-inverse")} aria-label="Security Awareness Simulator — halaman awal"><span className="brand-mark"><ShieldCheck size={25} strokeWidth={1.7} aria-hidden="true" /></span><span className="brand-name">Security Awareness{!compact && <span>Simulator<span className="brand-dot">.</span></span>}</span></Link>;
}
