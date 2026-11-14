"use client";

import { useCallback, useEffect, useState } from "react";
import { DEMO_STUDENT_ID, localSimulationRepository, SIMULATION_HISTORY_EVENT } from "./repository";
import type { SimulationHistorySnapshot } from "./types";

/** Reads after mount so server HTML and initial client render remain identical. */
export function useSimulationHistory(userId = DEMO_STUDENT_ID) {
  const [snapshot, setSnapshot] = useState<SimulationHistorySnapshot | null>(null);
  const refresh = useCallback(() => setSnapshot(localSimulationRepository.list(userId)), [userId]);
  useEffect(() => {
    queueMicrotask(refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener(SIMULATION_HISTORY_EVENT, refresh);
    return () => { window.removeEventListener("storage", refresh); window.removeEventListener(SIMULATION_HISTORY_EVENT, refresh); };
  }, [refresh]);
  return { snapshot, refresh };
}
