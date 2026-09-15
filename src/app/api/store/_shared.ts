import { dbEnabled } from "@/lib/db/pg";


export function storeDisabled(): Response | null {
  return dbEnabled() ? null : Response.json({ error: "store_local_only", mode: "local" }, { status: 501 });
}

export function storeError(tag: string, err: unknown): Response {
  console.error(`[${tag}] store error`, err);
  const detail = err instanceof Error ? err.message.slice(0, 300) : String(err).slice(0, 300);
  return Response.json({ error: "store_unavailable", detail }, { status: 503 });
}
