"use client";

import { CasesFileSchema, type Case } from "./schema";

const STORAGE_KEY = "mi:cases:v1";

export interface CasesRepo {
  list(): Case[];
  get(id: string): Case | undefined;
  save(c: Case): void;
  remove(id: string): void;
}

function read(): Case[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = CasesFileSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return [];
    return parsed.data.cases;
  } catch {
    return [];
  }
}

function write(cases: Case[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ version: 1, cases })
  );
}

export const localCasesRepo: CasesRepo = {
  list() {
    return read().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  get(id) {
    return read().find((c) => c.id === id);
  },
  save(c) {
    const cases = read();
    const idx = cases.findIndex((x) => x.id === c.id);
    if (idx === -1) cases.push(c);
    else cases[idx] = c;
    write(cases);
  },
  remove(id) {
    write(read().filter((c) => c.id !== id));
  },
};
