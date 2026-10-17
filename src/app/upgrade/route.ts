import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { STRIPE_PLAN_ID } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /upgrade
 *
 * The sidebar's trial card links here. Creates a Stripe Checkout session for
 * Unlimited (existing price) and redirects to it. If the account is past due,
 * opens the Stripe billing portal instead so the customer can update their card.
 */

function stripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function GET() {
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    // Signed-out visitors go to signup with the plan intent.
    return NextResponse.redirect(new URL("/signup?plan=unlimited", baseUrl));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, plan_status")
    .eq("id", user.id)
    .single();

  let customerId = (profile as unknown as { stripe_customer_id: string | null } | null)?.stripe_customer_id ?? null;

  if (!customerId) {
    const customer = await stripe().customers.create({ email: user.email ?? undefined, metadata: { userId: user.id } });
    customerId = customer.id;
    await supabase.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id);
  }

  const planStatus = (profile as unknown as { plan_status: string | null } | null)?.plan_status;

  try {
    if (planStatus === "past_due") {
      const portal = await stripe().billingPortal.sessions.create({ customer: customerId, return_url: `${baseUrl}/app/settings` });
      return NextResponse.redirect(new URL(portal.url ?? `${baseUrl}/app/settings`, baseUrl));
    }

    const checkout = await stripe().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: STRIPE_PLAN_ID, quantity: 1 }],
      success_url: `${baseUrl}/app?upgraded=1`,
      cancel_url: `${baseUrl}/app/trial?checkout=abandoned`,
      subscription_data: { metadata: { userId: user.id }, description: "Talby Unlimited: $9 a month." },
      custom_text: { submit: { message: `$9 a month. Cancel anytime.` } },
      allow_promotion_codes: true,
      managed_payments: { enabled: false },
    });
    return NextResponse.redirect(new URL(checkout.url ?? `${baseUrl}/app?upgraded=1`, baseUrl));
  } catch (err) {
    console.error("upgrade error:", err instanceof Error ? err.message : err);
    return NextResponse.redirect(new URL("/app/trial?checkout=failed", baseUrl));
  }
}
