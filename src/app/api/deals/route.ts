import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// In-process safety net: keyed on `${userId}:${idempotencyKey}` → dealId.
// The DB unique index (see 000028_deal_idempotency.sql) is the durable, exact
// guard; this map closes the window even before/independently of the index by
// short-circuiting a re-entrant call on the same server instance.
const inflight = new Map<string, string>();

/**
 * POST /api/deals  { brand, payload, idempotencyKey?, text? }
 *
 * Creates a deal server-side. Ownership is enforced by RLS (the user's own
 * client) and by the create path itself. Idempotency: a request that carries
 * an idempotencyKey that has already produced a deal (in this process, or in
 * the DB once migration 000028's unique index is applied) returns the existing
 * deal instead of creating a second one — this is what stops a double-click /
 * slow retry from writing twice even when the button's disabled flag hasn't
 * re-rendered yet.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  let body: {
    brand?: string; payload?: Record<string, unknown>;
    idempotencyKey?: string; text?: string;
  } = {};
  try { body = await req.json(); } catch { /* empty */ }

  const brand = (body.brand ?? "").trim();
  const key = (body.idempotencyKey ?? "").trim();
  if (!brand) return NextResponse.json({ error: "brand is required" }, { status: 400 });
  const idKey = `${user.id}:${key || "nokey"}`;

  // 1) In-process short-circuit BEFORE doing any work.
  const existingInProc = inflight.get(idKey);
  if (key && existingInProc && existingInProc !== "pending") {
    return NextResponse.json({ ok: true, deal: { id: existingInProc }, duplicate: true });
  }

  // 2) Pre-existing DB hit for this key+user (durable across requests/instances,
  //    once the idempotency_key column exists).
  if (key) {
    const { data: prior } = await supabase
      .from("deals").select("id, brand")
      .eq("user_id", user.id).eq("idempotency_key", key).maybeSingle();
    if (prior) {
      inflight.set(idKey, prior.id);
      return NextResponse.json({ ok: true, deal: prior, duplicate: true });
    }
  }

  // Claim the key in-process so a re-entrant call on this instance short-circuits.
  inflight.set(idKey, "pending");

  const basePayload: Record<string, unknown> = {
    user_id: user.id,
    brand,
    ...(body.payload ?? {}),
  };

  let created: { id: string } | null = null;
  let insErr: { message?: string } | null = null;
  let duplicate = false;

  // Durable idempotency path — requires the idempotency_key column (migration
  // 000028). The upsert is atomic on the unique (user, key) index, so two racing
  // writes under one key produce exactly one row.
  if (key) {
    const payload = { ...basePayload, idempotency_key: key };
    const { data, error } = await supabase
      .from("deals")
      .upsert(payload, { onConflict: "user_id,idempotency_key", ignoreDuplicates: true })
      .select("id, brand")
      .maybeSingle();
    if (data) created = data as { id: string };
    else if (error && !(error.message || "").toLowerCase().includes("idempotency_key")) insErr = error;
    if (!created) {
      // DO-NOTHING on conflict returns no row: the row already exists (a peer
      // created it under this same key) → return it, flagged duplicate.
      const { data: byKey } = await supabase
        .from("deals").select("id, brand")
        .eq("user_id", user.id).eq("idempotency_key", key).maybeSingle();
      if (byKey) { created = byKey as { id: string }; duplicate = true; }
    }
  }

  // Fallback for (a) pre-migration DB with no idempotency_key column, or
  // (b) no key supplied: plain insert (protected in-session by the map).
  if (!created && !insErr) {
    const r = await supabase.from("deals").insert(basePayload).select("id, brand").maybeSingle();
    if (r.data) created = r.data as { id: string };
    else if (r.error) insErr = r.error;
  }

  if (insErr || !created) {
    inflight.delete(idKey);
    return NextResponse.json({ error: insErr?.message || "Could not create the deal." }, { status: 500 });
  }
  inflight.set(idKey, created.id);

  // Ingest the extracted contract text for the assistant (server-side, non-fatal).
  // Skip on a duplicate — a retried submit already chunked+embedded it.
  if (body.text?.trim() && !duplicate) {
    try {
      await fetch(new URL("/api/assistant/ingest", req.url).toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId: created.id, text: body.text }),
      });
    } catch { /* non-fatal */ }
  }

  return NextResponse.json({ ok: true, deal: created, duplicate });
}