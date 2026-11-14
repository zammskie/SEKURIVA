import { MATERIAL_CATEGORIES, type Material, type MaterialErrors, type MaterialInput } from "./types";
import { slugify } from "./utils";

export function validateMaterial(input: MaterialInput, materials: readonly Material[], excludeId?: string): MaterialErrors {
  const errors: MaterialErrors = {};
  const title = input.title.trim();
  if (!title) errors.title = "Judul materi wajib diisi.";
  else if (materials.some(item => item.id !== excludeId && item.title.trim().toLocaleLowerCase("id-ID") === title.toLocaleLowerCase("id-ID"))) errors.title = "Judul materi sudah digunakan.";
  if (!MATERIAL_CATEGORIES.includes(input.category)) errors.category = "Pilih kategori materi.";
  if (!input.summary.trim()) errors.summary = "Ringkasan wajib diisi.";
  if (!Number.isFinite(input.estimatedDuration) || input.estimatedDuration <= 0) errors.estimatedDuration = "Durasi harus berupa angka positif.";
  if (!input.learningObjectives.some(item => item.trim())) errors.learningObjectives = "Tambahkan minimal satu tujuan pembelajaran.";
  if (input.sections.length === 0) errors.sections = "Tambahkan minimal satu bagian materi.";
  input.sections.forEach((section, index) => {
    if (!section.heading.trim()) errors[`sections.${index}.heading`] = "Judul bagian wajib diisi.";
    if (!section.paragraphs.some(item => item.trim())) errors[`sections.${index}.paragraphs`] = "Isi utama bagian wajib diisi.";
  });
  if (!slugify(title)) errors.title = "Judul tidak dapat membentuk slug.";
  if (input.status !== "Draft" && input.status !== "Published" && input.status !== "Archived") errors.status = "Status materi tidak valid.";
  return errors;
}
