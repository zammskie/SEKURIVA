import type { Material, MaterialCategory, MaterialInput } from "./types";

export interface MaterialRepository {
  getAllMaterials(): Promise<Material[]>;
  getMaterialById(id: string): Promise<Material | undefined>;
  getMaterialBySlug(slug: string): Promise<Material | undefined>;
  getPublishedMaterials(): Promise<Material[]>;
  getMaterialsByCategory(category: MaterialCategory): Promise<Material[]>;
  searchMaterials(query: string): Promise<Material[]>;
  createMaterial(input: MaterialInput): Promise<Material>;
  updateMaterial(id: string, input: MaterialInput): Promise<Material>;
  deleteMaterial(id: string): Promise<boolean>;
}
