/**
 * Shared per-user sliding-window rate limiter (backend upgrade 4).
 * In-process counter keyed by user id: at most RATE_MAX hits per RATE_WINDOW_MS.
 * Used by /api/assistant and /api/assistant/ingest so there is ONE limiter, not
 * two copies that could each allow 15/min. Best-effort (not durable across
 * restarts) — fine for a 15/min burst guard; durable metering is a separate
 * concern in item 45 (assistant limits).
 */
const WINDOW_MS = 60_000;
const MAX = 15;
const hits = new Map<string, number[]>();

export function rateLimited(uid: string): boolean {
  const now = Date.now();
  const arr = (hits.get(uid) || []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX) return true;
  arr.push(now);
  hits.set(uid, arr);
  return false;
}

export const RATE_WINDOW_MS = WINDOW_MS;
export const RATE_MAX = MAX;
