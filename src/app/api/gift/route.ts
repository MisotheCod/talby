import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface ReqBody { email?: string; months?: number }

/**
 * POST /api/gift  { email, months }   (admin — guarded by CRON_SECRET bearer)
 *
 * Grants a creator a gifted Unlimited account. Finds the user by email (must already
 * have signed up), sets plan='paid' and gift_until = now() + months. The daily
 * expire-gifts cron flips them back to free after the window. A Stripe subscriber is
 * never downgraded by a gift, and this route never downgrades anyone — it only adds the
 * gift window (extending an existing paid user's gift_until doesn't hurt).
 *
 * Access: the same CRON_SECRET bearer the cron routes use, so only Cam (or Yomi acting
 * for him) can grant a free account. Response includes a friendly ok + the expiry date.
 */
export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: ReqBody = {};
  try { body = await req.json(); } catch { /* empty */ }
  const email = (body.email ?? "").trim().toLowerCase();
  let months = Number(body.months ?? 12);
  if (!email) return NextResponse.json({ error: "email is required" }, { status: 400 });
  if (!Number.isFinite(months) || months <= 0) months = 12;
  months = Math.min(months, 120);

  const service = createServiceClient();
  const { data: userList, error: listErr } = await service.auth.admin.listUsers();
  if (listErr) return NextResponse.json({ error: listErr.message }, { status: 500 });
  const users = (userList?.users ?? []) as { id: string; email?: string }[];
  const user = users.find((u) => (u.email ?? "").toLowerCase() === email);
  if (!user) {
    return NextResponse.json({ error: `No account found for ${email}. Have them sign up at talby.io first.` }, { status: 404 });
  }

  const giftUntil = new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000);
  const { error } = await service
    .from("profiles")
    .update({ plan: "paid", gift_until: giftUntil.toISOString() })
    .eq("id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    ok: true,
    email,
    gifted_until: giftUntil.toISOString().slice(0, 10),
    months,
  });
}