import type { Material } from "./types";

export function slugify(title: string): string {
  return title.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "materi";
}

export function uniqueSlug(title: string, materials: readonly Material[], excludeId?: string): string {
  const base = slugify(title);
  let slug = base;
  let suffix = 2;
  while (materials.some(material => material.slug === slug && material.id !== excludeId)) slug = `${base}-${suffix++}`;
  return slug;
}

export function splitLines(value: string): string[] { return value.split(/\r?\n/); }
export function cleanLines(value: readonly string[]): string[] { return value.map(line => line.trim()).filter(Boolean); }
export function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(date);
}
