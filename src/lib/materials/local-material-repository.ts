import { seedMaterials } from "@/data/materials/seed";
import { MATERIAL_CATEGORIES, type Material, type MaterialInput } from "./types";
import type { MaterialRepository } from "./repository";
import { uniqueSlug } from "./utils";
import { validateMaterial } from "./validation";

export const MATERIAL_STORAGE_KEY = "sekuriva.materials.v1";

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isStringArray(value: unknown): value is string[] { return Array.isArray(value) && value.every(item => typeof item === "string"); }
function isLearningCheck(value: unknown): boolean {
  return isRecord(value) && typeof value.question === "string" && typeof value.correctOptionId === "string"
    && Array.isArray(value.options) && value.options.every(option => isRecord(option)
      && typeof option.id === "string" && typeof option.label === "string" && typeof option.explanation === "string");
}
function isMaterial(value: unknown): value is Material {
  if (!isRecord(value)) return false;
  return typeof value.id === "string" && typeof value.title === "string" && typeof value.slug === "string"
    && MATERIAL_CATEGORIES.includes(value.category as Material["category"])
    && typeof value.summary === "string" && typeof value.estimatedDuration === "number"
    && (value.status === "Draft" || value.status === "Published" || value.status === "Archived")
    && (value.difficulty === "Dasar" || value.difficulty === "Menengah")
    && ["shield", "users", "link", "wallet", "lock"].includes(value.coverIcon as string)
    && typeof value.createdAt === "string" && typeof value.updatedAt === "string"
    && isStringArray(value.learningObjectives) && isStringArray(value.keyTakeaways)
    && isStringArray(value.redFlags) && isStringArray(value.safeActions)
    && Array.isArray(value.sections) && value.sections.every(section => isRecord(section)
      && typeof section.id === "string" && typeof section.heading === "string"
      && isStringArray(section.paragraphs) && isStringArray(section.bulletPoints)
      && typeof section.optionalCallout === "string")
    && (value.learningChecks === undefined || (Array.isArray(value.learningChecks) && value.learningChecks.every(isLearningCheck)))
    && Array.isArray(value.references) && value.references.every(reference => isRecord(reference)
      && typeof reference.title === "string" && typeof reference.author === "string"
      && typeof reference.year === "string" && typeof reference.url === "string");
}

function read(): Material[] {
  if (typeof window === "undefined") return seedMaterials;
  try {
    const raw = window.localStorage.getItem(MATERIAL_STORAGE_KEY);
    if (raw === null) {
      window.localStorage.setItem(MATERIAL_STORAGE_KEY, JSON.stringify(seedMaterials));
      return seedMaterials;
    }
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every(isMaterial)) return parsed;
  } catch { /* Use the safe seed below when storage is unavailable or malformed. */ }
  return seedMaterials;
}

function write(materials: Material[]): void {
  if (typeof window === "undefined") throw new Error("Penyimpanan materi hanya tersedia di browser.");
  try { window.localStorage.setItem(MATERIAL_STORAGE_KEY, JSON.stringify(materials)); }
  catch { throw new Error("Perubahan tidak dapat disimpan di browser ini. Periksa kapasitas atau izin penyimpanan."); }
  window.dispatchEvent(new Event("sekuriva:materials-changed"));
}

function checked(input: MaterialInput, all: Material[], excludeId?: string): void {
  const errors = validateMaterial(input, all, excludeId);
  if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]);
}

export const localMaterialRepository: MaterialRepository = {
  async getAllMaterials() { return read(); },
  async getMaterialById(id) { return read().find(material => material.id === id); },
  async getMaterialBySlug(slug) { return read().find(material => material.slug === slug); },
  async getPublishedMaterials() { return read().filter(material => material.status === "Published"); },
  async getMaterialsByCategory(category) { return read().filter(material => material.category === category); },
  async searchMaterials(query) { const normalized = query.trim().toLocaleLowerCase("id-ID"); return read().filter(material => `${material.title} ${material.summary}`.toLocaleLowerCase("id-ID").includes(normalized)); },
  async createMaterial(input) {
    const all = read(); checked(input, all);
    const now = new Date().toISOString();
    const material: Material = { ...input, title: input.title.trim(), summary: input.summary.trim(), id: crypto.randomUUID(), slug: uniqueSlug(input.title, all), createdAt: now, updatedAt: now };
    write([...all, material]); return material;
  },
  async updateMaterial(id, input) {
    const all = read(); const current = all.find(material => material.id === id);
    if (!current) throw new Error("Materi tidak ditemukan.");
    checked(input, all, id);
    const material: Material = { ...input, title: input.title.trim(), summary: input.summary.trim(), id, slug: uniqueSlug(input.title, all, id), createdAt: current.createdAt, updatedAt: new Date().toISOString() };
    write(all.map(item => item.id === id ? material : item)); return material;
  },
  async deleteMaterial(id) { const all = read(); if (!all.some(item => item.id === id)) return false; write(all.filter(item => item.id !== id)); return true; },
};
