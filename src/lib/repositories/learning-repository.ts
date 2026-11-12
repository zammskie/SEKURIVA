import type { MaterialSummary, ScenarioPreview } from "@/lib/types";

/** Kontrak baca katalog untuk memisahkan komponen UI dari sumber datanya. */
export interface LearningRepository {
  listMaterials(): Promise<readonly MaterialSummary[]>;
  listScenarioPreviews(): Promise<readonly ScenarioPreview[]>;
}
