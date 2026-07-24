"use client";

import { useCallback, useEffect, useState } from "react";
import { localCasesRepo } from "@/lib/storage/cases";
import type { Case } from "@/lib/storage/schema";

export function useCases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(() => {
    setCases(localCasesRepo.list());
  }, []);

  useEffect(() => {
    refresh();
    setLoaded(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "mi:cases:v1") refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  const saveCase = useCallback(
    (c: Case) => {
      localCasesRepo.save(c);
      refresh();
    },
    [refresh]
  );

  const removeCase = useCallback(
    (id: string) => {
      localCasesRepo.remove(id);
      refresh();
    },
    [refresh]
  );

  return { cases, loaded, saveCase, removeCase, refresh };
}

export function useCase(id: string | undefined) {
  const [item, setItem] = useState<Case | undefined>(undefined);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (id) setItem(localCasesRepo.get(id));
    setLoaded(true);
  }, [id]);

  return { item, loaded };
}
