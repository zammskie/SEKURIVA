import { materials } from "@/data/materials";
import { scenarioPreviews } from "@/data/scenarios";
import type { LearningRepository } from "./learning-repository";

/** Adapter lokal tanpa jaringan, autentikasi, database, atau penyimpanan progres. */
export const mockLearningRepository: LearningRepository = {
  async listMaterials() {
    return materials;
  },
  async listScenarioPreviews() {
    return scenarioPreviews;
  },
};
