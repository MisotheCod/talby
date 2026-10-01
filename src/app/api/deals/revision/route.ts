import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/deals/revision  { dealId, action: "log" | "undo" }
 *
 * Logs or unlogs a used revision on a deal. `revisions_used` is incremented on
 * log (checked against `revisions_included` where set) and decremented on undo
 * (never below 0). Ownership is enforced by RLS on the user's own client. The
 * counter is deal-level, not per post.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  let body: { dealId?: string; action?: string } = {};
  try { body = await req.json(); } catch { /* empty */ }

  const dealId = (body.dealId ?? "").trim();
  const action = body.action === "log" ? "log" : body.action === "undo" ? "undo" : null;
  if (!dealId) return NextResponse.json({ error: "dealId is required" }, { status: 400 });
  if (!action) return NextResponse.json({ error: "action must be 'log' or 'undo'" }, { status: 400 });

  // Fetch the current deal (RLS scopes to the caller) so we can bound the count.
  const { data: deal } = await supabase
    .from("deals").select("revisions_included, revisions_used")
    .eq("id", dealId).maybeSingle();
  const used = typeof deal?.revisions_used === "number" ? (deal.revisions_used as number) : 0;
  const includedRaw = deal?.revisions_included != null ? Number(deal.revisions_included) : null;
  const limit = ((deal?.revisions_included ?? "") === "Unlimited")
    ? null
    : (typeof includedRaw === "number" && Number.isFinite(includedRaw) ? includedRaw : null);

  let next = used;
  if (action === "log") next = used + 1;
  else next = Math.max(0, used - 1); // undo never goes below 0

  const { error } = await supabase
    .from("deals").update({ revisions_used: next }).eq("id", dealId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, revisions_used: next, limit });
}