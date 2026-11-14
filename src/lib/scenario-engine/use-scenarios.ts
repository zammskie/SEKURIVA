"use client";

import { useCallback, useEffect, useState } from "react";
import type { Scenario } from "./foundation-types";
import { localScenarioRepository, SCENARIO_CHANGE_EVENT } from "./local-scenario-repository";

export function useScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[] | null>(null);

  const refresh = useCallback(async () => {
    const list = await localScenarioRepository.getAllScenarios();
    setScenarios(list);
  }, []);

  useEffect(() => {
    let active = true;
    const fetchScenarios = async () => {
      const list = await localScenarioRepository.getAllScenarios();
      if (active) setScenarios(list);
    };

    fetchScenarios();

    const handleUpdate = () => {
      void fetchScenarios();
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener(SCENARIO_CHANGE_EVENT, handleUpdate);
    return () => {
      active = false;
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener(SCENARIO_CHANGE_EVENT, handleUpdate);
    };
  }, []);

  return { scenarios, refresh };
}
