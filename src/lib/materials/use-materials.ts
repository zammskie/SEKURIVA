"use client";

import { useEffect, useState } from "react";
import { materialRepository } from "./material-repository";
import type { Material } from "./types";

/** Read only after mount so server HTML and first client render are identical. */
export function useMaterials() {
  const [materials, setMaterials] = useState<Material[] | null>(null);
  useEffect(() => {
    let active = true;
    const refresh = async () => { const next = await materialRepository.getAllMaterials(); if (active) setMaterials(next); };
    const onChange = () => { void refresh(); };
    onChange();
    window.addEventListener("storage", onChange);
    window.addEventListener("sekuriva:materials-changed", onChange);
    return () => { active = false; window.removeEventListener("storage", onChange); window.removeEventListener("sekuriva:materials-changed", onChange); };
  }, []);
  return materials;
}
