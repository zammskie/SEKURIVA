import { localMaterialRepository } from "./local-material-repository";
import type { MaterialRepository } from "./repository";

/** Satu titik penggantian adapter ketika sumber data berubah. */
export const materialRepository: MaterialRepository = localMaterialRepository;
