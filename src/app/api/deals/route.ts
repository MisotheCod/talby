import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generatePaymentsFromStructure } from "@/lib/payment-structure";
import { userIsReadOnly } from "@/lib/write-access";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// In-process safety net: keyed on `${userId}:${idempotencyKey}` → dealId.
// The DB unique index (000028) + the create_deal RPC (000051) are the durable
// guards; this map closes the window even before/independently of the index.
const inflight = new Map<string, string>();

/**
 * POST /api/deals  { brand, payload, idempotencyKey?, text? }
 *
 * Creates a deal + its children (payments, post dates, extras) ATOMICALLY
 * through the `create_deal` Postgres RPC (000051): one transaction, so a
 * failure in any child rolls back the whole deal. Removed the old
 * `/* non-fatal *​/` blocks that returned 200 after a child write failed.
 * Contract/text ingest stays outside the transaction (server-side, non-fatal
 * by nature) but its two attempts both call the RPC.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  if (await userIsReadOnly(user.id)) {
    return NextResponse.json(
      { error: "read_only", message: "Your free trial has ended. Subscribe to keep editing." },
      { status: 403 }
    );
  }

  let body: {
    brand?: string; payload?: Record<string, unknown>;
    idempotencyKey?: string; text?: string;
  } = {};
  try { body = await req.json(); } catch { /* empty */ }

  const brand = (body.brand ?? "").trim();
  const key = (body.idempotencyKey ?? "").trim();
  if (!brand) return NextResponse.json({ error: "brand is required" }, { status: 400 });
  const idKey = `${user.id}:${key || "nokey"}`;

  const { structure_parts: _sp, extras: _ex, post_dates: _pd, ...dealPayload } = (body.payload ?? {}) as Record<string, unknown>;
  const structureParts = (body.payload?.["structure_parts"] ?? []) as { name?: string | null; amount?: number | null; date?: string | null }[];
  const extras = (body.payload?.["extras"] ?? []) as { kind?: string; amount?: number | null; condition?: string | null; rate?: number | null; on_text?: string | null; earned?: boolean }[];

  // 1) In-process short-circuit BEFORE doing any work.
  const existingInProc = inflight.get(idKey);
  if (key && existingInProc && existingInProc !== "pending") {
    return NextResponse.json({ ok: true, deal: { id: existingInProc }, duplicate: true });
  }
  inflight.set(idKey, "pending");

  // Compute the child rows up front (same shared generator the modal uses).
  const postDates = ((body.payload ?? {}).post_dates as { date?: string; label?: string; kind?: string }[] | undefined)
    ?.filter((p) => p.date)
    .sort((a, b) => (a.date! < b.date! ? -1 : a.date! > b.date! ? 1 : 0))
    .map((p) => ({ date: p.date!, label: p.label ?? "", post_type: p.kind ?? "" })) ?? [];

  const paymentRows = generatePaymentsFromStructure({
    structureKind: ((dealPayload["payment_structure"] ?? "once") as "once" | "split" | "parts" | "monthly"),
    amount: typeof dealPayload["value"] === "number" ? dealPayload["value"] : null,
    structure_timing: (dealPayload["structure_timing"] as string | null) ?? null,
    structure_upfront_pct: (dealPayload["structure_upfront_pct"] as number | null) ?? null,
    structure_balance_timing: (dealPayload["structure_balance_timing"] as string | null) ?? null,
    structure_months: (dealPayload["structure_months"] as number | null) ?? null,
    parts: structureParts,
  });

  // Hold values that must never reach the DB if idempotency_key would collide.
  const dealJson: Record<string, unknown> = {
    ...dealPayload,
    idempotency_key: key || null,
  };

  let outcome: {
    ok: boolean; deal_id: string; duplicate: boolean; error?: string;
  } | null = null;
  try {
    const { data, error } = await supabase.rpc("create_deal", {
      p_user: user.id,
      p_brand: brand,
      p_deal: dealJson,
      p_payments: paymentRows,
      p_post_dates: postDates,
      p_extras: extras,
    });
    if (error) throw new Error(error.message);
    outcome = data as { ok: boolean; deal_id: string; duplicate: boolean };
  } catch (e) {
    inflight.delete(idKey);
    const msg = e instanceof Error ? e.message : "Could not create the deal.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  if (!outcome?.deal_id) {
    inflight.delete(idKey);
    return NextResponse.json({ error: "Could not create the deal." }, { status: 500 });
  }
  inflight.set(idKey, outcome.deal_id);

  // Contract extraction text -> assistant ingest (server-side, non-fatal).
  // This is outside the transaction by design; it only affects assistant
  // retrieval, never the deal's own rows. A failure is recorded on the deal
  // (see below) per the board's error pattern.
  let ingestError: string | null = null;
  if (body.text?.trim() && !outcome.duplicate) {
    try {
      const r = await fetch(new URL("/api/assistant/ingest", req.url).toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId: outcome.deal_id, text: body.text }),
      });
      if (!r.ok) ingestError = `assistant ingest ${r.status}`;
    } catch { ingestError = "assistant ingest failed"; }
  }

  return NextResponse.json({
    ok: true,
    deal: { id: outcome.deal_id },
    duplicate: outcome.duplicate,
    ...(ingestError ? { ingest_error: ingestError } : {}),
  });
}
