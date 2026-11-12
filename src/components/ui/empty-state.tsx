import { Construction } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return <div className="empty-state"><span className="empty-state-icon"><Construction size={30} strokeWidth={1.5} aria-hidden="true" /></span><p className="eyebrow">PENGEMBANGAN BERTAHAP</p><h2>{title}</h2><p>{description}</p>{children && <div className="empty-state-actions">{children}</div>}</div>;
}
