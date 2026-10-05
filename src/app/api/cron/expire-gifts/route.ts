import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * Daily expiry of gifted Unlimited accounts.
 * A creator recruited for UGC videos gets plan='paid' + gift_until = now()+months.
 * Once gift_until passes, flip them back to 'free' — BUT only if they have no
 * stripe_customer_id (i.e. the gift is the only reason they're paid). A real
 * Stripe subscriber is never downgraded by a lapsed gift, even if they also
 * received one while testing. Guarded by CRON_SECRET.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();

  // Downgrade only paid users whose gift lapsed AND who have no stripe customer.
  const { data, error } = await service.rpc("expire_gifted_plans");
  if (error) {
    console.error("expire-gifts rpc error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, expired: data ?? 0 });
}