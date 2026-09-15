import { query } from "@/lib/db/pg";
import type { HimoyaId, TraineeProfile, TrainingSession } from "./trainingSchema";

/** Postgres-backed store used by /api/store/* (schemas validated in the routes). */

export async function getProfile(id: string): Promise<TraineeProfile | null> {
  const rows = await query<{ data: TraineeProfile }>("SELECT data FROM h360_profiles WHERE id = $1", [id]);
  return rows[0]?.data ?? null;
}

export async function listProfiles(): Promise<TraineeProfile[]> {
  const rows = await query<{ data: TraineeProfile }>("SELECT data FROM h360_profiles ORDER BY updated_at DESC LIMIT 1000");
  return rows.map((r) => r.data);
}

export async function saveProfile(p: TraineeProfile): Promise<void> {
  await query(
    `INSERT INTO h360_profiles (id, badge_id, role, data, updated_at) VALUES ($1, $2, $3, $4, now())
     ON CONFLICT (id) DO UPDATE SET badge_id = EXCLUDED.badge_id, role = EXCLUDED.role, data = EXCLUDED.data, updated_at = now()`,
    [p.id, p.badgeId, p.role, JSON.stringify(p)]
  );
}

export async function listSessions(traineeId?: string, limit = 500): Promise<TrainingSession[]> {
  const rows = traineeId
    ? await query<{ data: TrainingSession }>(
        "SELECT data FROM h360_sessions WHERE trainee_id = $1 ORDER BY updated_at DESC LIMIT $2",
        [traineeId, limit]
      )
    : await query<{ data: TrainingSession }>("SELECT data FROM h360_sessions ORDER BY updated_at DESC LIMIT $1", [limit]);
  return rows.map((r) => r.data);
}

export async function getSession(id: string): Promise<TrainingSession | undefined> {
  const rows = await query<{ data: TrainingSession }>("SELECT data FROM h360_sessions WHERE id = $1", [id]);
  return rows[0]?.data;
}

/** Last-writer-wins by `updatedAt` so a stale tablet cannot overwrite a newer copy. */
export async function saveSession(s: TrainingSession): Promise<void> {
  await query(
    `INSERT INTO h360_sessions (id, trainee_id, status, updated_at, data) VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (id) DO UPDATE SET trainee_id = EXCLUDED.trainee_id, status = EXCLUDED.status,
       updated_at = EXCLUDED.updated_at, data = EXCLUDED.data
     WHERE h360_sessions.updated_at <= EXCLUDED.updated_at`,
    [s.id, s.traineeId, s.status, s.updatedAt, JSON.stringify(s)]
  );
}

export async function removeSession(id: string): Promise<void> {
  await query("DELETE FROM h360_sessions WHERE id = $1", [id]);
}

export async function getHimoyaId(traineeId: string): Promise<HimoyaId | undefined> {
  const rows = await query<{ data: HimoyaId }>("SELECT data FROM h360_himoya_ids WHERE trainee_id = $1", [traineeId]);
  return rows[0]?.data;
}

export async function listHimoyaIds(): Promise<HimoyaId[]> {
  const rows = await query<{ data: HimoyaId }>("SELECT data FROM h360_himoya_ids ORDER BY updated_at DESC LIMIT 1000");
  return rows.map((r) => r.data);
}

export async function saveHimoyaId(h: HimoyaId): Promise<void> {
  await query(
    `INSERT INTO h360_himoya_ids (trainee_id, updated_at, data) VALUES ($1, $2, $3)
     ON CONFLICT (trainee_id) DO UPDATE SET updated_at = EXCLUDED.updated_at, data = EXCLUDED.data
     WHERE h360_himoya_ids.updated_at <= EXCLUDED.updated_at`,
    [h.traineeId, h.updatedAt, JSON.stringify(h)]
  );
}
