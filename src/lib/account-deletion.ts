// ============================================================
// TALBY — account deletion helpers (server-side).
// ------------------------------------------------------------
// Pure / client-parameterized (each fn receives a SupabaseClient), so this
// module is NOT `server-only` — the RLS isolation test script and cron can
// import the pure parts without a runtime throw. Callers decide which
// client they pass:
//   * a session client (user's cookie)  -> RLS-scoped, auth.uid() set
//   * a service client (service role)   -> bypasses RLS (infra ops only)
//
// Two responsibilities:
//   1. The RLS hard stop lives in Postgres (public.delete_user_content,
//      SECURITY DEFINER, guards auth.uid() = p_uid) and is invoked with the
//      SESSION client so the guard binds to the real user.
//   2. Storage objects / audit log don't cascade and aren't RLS-ownable in
//      SQL, so the routes purge them with the SERVICE client, always scoped
//      by the server-verified user id.
// ============================================================

import type { SupabaseClient } from "@supabase/supabase-js";

export const CONTENT_BUCKETS = ["deal-files", "idea-files"] as const;

export type DeletionCounts = {
  deals: number;
  payments: number;
  files: number; // deal_files rows (tracked uploads; idea-files live only in storage)
  calendar: number; // content rows (events + recurring cycles)
  ideas: number;
  todos: number;
  inbox: number; // inbox_leads
  notes: number; // day-pinned calendar notes
};

/** Exact row counts per content entity, scoped by uid (RLS via session client). */
export async function countContentFor(
  client: SupabaseClient,
  uid: string
): Promise<DeletionCounts> {
  const exact = async (table: string) => {
    const { count } = await client
      .from(table)
      .select("*", { count: "exact", head: true })
      .eq("user_id", uid);
    return count ?? 0;
  };
  const dealFiles = await exact("deal_files");
  return {
    deals: await exact("deals"),
    payments: await exact("payments"),
    files: dealFiles,
    calendar: await exact("content"),
    ideas: await exact("ideas"),
    todos: await exact("todos"),
    inbox: await exact("inbox_leads"),
    notes: await exact("notes"),
  };
}

/** A human-readable inventory line for the modal, only nonzero items. */
export function countLines(c: DeletionCounts): string[] {
  const map: Array<[number, string, string]> = [
    [c.deals, "deals", "deal"],
    [c.payments, "payments", "payment"],
    [c.files, "files", "file"],
    [c.calendar, "calendar events", "calendar event"],
    [c.ideas, "ideas", "idea"],
    [c.todos, "to-dos", "to-do"],
    [c.inbox, "inbox items", "inbox item"],
    [c.notes, "calendar notes", "calendar note"],
  ];
  return map
    .filter(([n]) => n > 0)
    .map(([n, plural, singular]) => `${n} ${n === 1 ? singular : plural}`);
}

/**
 * Purge a user's storage objects. Buckets don't cascade from auth.users, so
 * this is the one place files are removed. Path layout is <uid>/… in both
 * content buckets; deal-files nests <uid>/<deal_id>/<file>, idea-files is
 * flat <uid>/<file>. Returns the object paths that were removed.
 */
export async function purgeUserStorage(
  service: SupabaseClient,
  uid: string,
  opts: { avatars?: boolean } = {}
): Promise<string[]> {
  const removed: string[] = [];
  const bucketList = opts.avatars ? ["deal-files", "idea-files", "avatars"] : ["deal-files", "idea-files"];

  for (const bucket of bucketList) {
    let top: Array<{ name: string; id: string | null; metadata: unknown }> = [];
    try {
      const res = await service.storage.from(bucket).list(uid, { limit: 1000 });
      if (res && !res.error) top = (res.data ?? []) as Array<{ name: string; id: string | null; metadata: unknown }>;
    } catch {
      continue; // bucket empty / missing — nothing to purge
    }
    for (const entry of top) {
      const e = entry;
      try {
        if (e.metadata === null) {
          // A folder: deal-files <uid>/<deal_id>/<file>. Remove each child.
          const kidsRes = await service.storage.from(bucket).list(`${uid}/${e.name}`, { limit: 10000 });
          const kids = (!kidsRes.error ? kidsRes.data : []) as Array<{ name: string; id: string | null }>;
          for (const k of kids) {
            if (k.id) {
              const p = `${uid}/${e.name}/${k.name}`;
              await service.storage.from(bucket).remove([p]);
              removed.push(`${bucket}/${p}`);
            }
          }
        } else if (e.id) {
          const p = `${uid}/${e.name}`;
          await service.storage.from(bucket).remove([p]);
          removed.push(`${bucket}/${p}`);
        }
      } catch {
        // best-effort per file; don't let one orphan fail the rest
      }
    }
  }
  return removed;
}

/** Invoke the SQL hard stop as the USER (session client) so auth.uid() = uid. */
export async function deleteUserContent(client: SupabaseClient, uid: string): Promise<void> {
  const { error } = await client.rpc("delete_user_content", { p_uid: uid });
  if (error) throw new Error(error.message);
}

/** Insert a deletion-log row (service role). Never blocks a deletion on audit failure. */
export async function logDeletion(
  service: SupabaseClient,
  p: { userId: string | null; email: string | null; kind: "data" | "account" }
): Promise<string | null> {
  try {
    const { data, error } = await service
      .from("deletion_log")
      .insert({ user_id: p.userId, email: p.email, kind: p.kind, status: "requested" })
      .select("id")
      .single();
    if (error || !data) return null;
    return (data as unknown as { id: string }).id;
  } catch {
    return null;
  }
}

/** Mark a deletion-log row complete/failed (service role). */
export async function completeDeletion(
  service: SupabaseClient,
  logId: string | null,
  status: "completed" | "failed",
  detail?: string
): Promise<void> {
  if (!logId) return;
  try {
    await service
      .from("deletion_log")
      .update({ status, completed_at: new Date().toISOString(), detail: detail || null })
      .eq("id", logId);
  } catch {
    // audit best-effort only
  }
}

// ---- CSV export (deals + payments in one file) ----

function esc(v: unknown): string {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * One CSV with a `type` discriminator so deals and payments export in a single
 * download: type,brand,amount,date,status,deliverable,notes,created_at.
 */
export function buildDealsAndPaymentsCsv(
  deals: Array<Record<string, unknown>>,
  payments: Array<Record<string, unknown>>
): string {
  const header = ["type", "brand", "amount", "date", "status", "deliverable", "notes", "created_at"];
  const rows: string[][] = [header];

  for (const d of deals) {
    rows.push([
      "deal",
      d.brand,
      d.value,
      d.due_date,
      d.status,
      d.deliverable,
      d.notes,
      d.created_at,
    ].map(esc));
  }
  for (const p of payments) {
    rows.push([
      "payment",
      p.brand, // joined deal brand (may be null)
      p.amount,
      p.expected_date,
      p.status,
      "",
      p.notes,
      p.created_at,
    ].map(esc));
  }
  return rows.map((r) => r.join(",")).join("\n");
}