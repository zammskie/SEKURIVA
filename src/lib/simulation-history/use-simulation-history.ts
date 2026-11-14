"use client";

import { useCallback, useEffect, useState } from "react";
import { DEMO_STUDENT_ID, localSimulationRepository, SIMULATION_HISTORY_EVENT } from "./repository";
import type { SimulationHistorySnapshot, SimulationRecord } from "./types";
import { seedDemoStudentRunsIfEmpty } from "./demo-seed";

/** Reads after mount so server HTML and initial client render remain identical. */
export function useSimulationHistory(userId = DEMO_STUDENT_ID) {
  const [snapshot, setSnapshot] = useState<SimulationHistorySnapshot | null>(null);
  const refresh = useCallback(() => {
    seedDemoStudentRunsIfEmpty();
    setSnapshot(localSimulationRepository.list(userId));
  }, [userId]);

  useEffect(() => {
    queueMicrotask(refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener(SIMULATION_HISTORY_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(SIMULATION_HISTORY_EVENT, refresh);
    };
  }, [refresh]);

  return { snapshot, refresh };
}

export function useAllSimulationRuns() {
  const [runs, setRuns] = useState<readonly SimulationRecord[] | null>(null);

  const refresh = useCallback(() => {
    seedDemoStudentRunsIfEmpty();
    setRuns(localSimulationRepository.listAll());
  }, []);

  useEffect(() => {
    queueMicrotask(refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener(SIMULATION_HISTORY_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(SIMULATION_HISTORY_EVENT, refresh);
    };
  }, [refresh]);

  return { runs, refresh };
}
