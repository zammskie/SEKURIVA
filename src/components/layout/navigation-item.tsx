"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationEntry } from "./navigation";
import { cn } from "@/lib/utils/cn";

export function NavigationItem({ item, onNavigate }: { item: NavigationEntry; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = pathname === item.href || (item.href.split("/").length > 2 && pathname.startsWith(`${item.href}/`));
  const Icon = item.icon;
  return <Link href={item.href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={cn("nav-item", active && "nav-item-active")}><Icon size={19} strokeWidth={1.7} aria-hidden="true" /><span>{item.label}</span>{active && <span className="nav-active-dot" />}</Link>;
}

