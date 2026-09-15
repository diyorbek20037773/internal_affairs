import type { NextRequest } from "next/server";
import { dbEnabled } from "@/lib/db/pg";
import { getSessionUser, type AuthUser } from "@/lib/auth/server";

export function storeDisabled(): Response | null {
  return dbEnabled() ? null : Response.json({ error: "store_local_only", mode: "local" }, { status: 501 });
}

export function storeError(tag: string, err: unknown): Response {
  console.error(`[${tag}] store error`, err);
  const detail = err instanceof Error ? err.message.slice(0, 300) : String(err).slice(0, 300);
  return Response.json({ error: "store_unavailable", detail }, { status: 503 });
}

/**
 * Every /api/store route runs behind a login when the server store is on:
 * a trainee may only touch rows with their own traineeId; an instructor
 * may read and write everything.
 */
export async function requireUser(req: NextRequest): Promise<AuthUser | Response> {
  const off = storeDisabled();
  if (off) return off;
  try {
    const user = await getSessionUser(req);
    return user ?? Response.json({ error: "unauthenticated" }, { status: 401 });
  } catch (e) {
    return storeError("store/auth", e);
  }
}

export const isResponse = (x: unknown): x is Response => x instanceof Response;

export function canAccess(user: AuthUser, traineeId: string): boolean {
  return user.role === "instructor" || user.id === traineeId;
}

export const FORBIDDEN = () => Response.json({ error: "forbidden" }, { status: 403 });
