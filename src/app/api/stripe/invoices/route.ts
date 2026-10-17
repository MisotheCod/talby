import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/stripe/invoices
 * Signed-in users only. Returns the user's real Stripe invoices, newest first,
 * with working hosted_invoice_url links for the Settings billing list.
 * -> { invoices: [{ id, date, amount, url }] }  (empty when no customer yet)
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ invoices: [] }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();
  const customerId = (profile as unknown as { stripe_customer_id: string | null } | null)?.stripe_customer_id;
  if (!customerId) return NextResponse.json({ invoices: [] });

  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ invoices: [] });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const res = await stripe.invoices.list({ customer: customerId, limit: 100 });
    const invoices = (res.data ?? [])
      .filter((i) => i.hosted_invoice_url)
      .map((i) => ({
        id: i.id,
        date: i.created ? new Date(i.created * 1000).toISOString().slice(0, 10) : "",
        amount: i.amount_paid > 0 ? i.amount_paid / 100 : i.amount_due / 100,
        url: i.hosted_invoice_url ?? undefined,
      }));
    return NextResponse.json({ invoices });
  } catch (err) {
    console.error("stripe invoices error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ invoices: [] });
  }
}
