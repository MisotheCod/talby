import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { isPinnedUnlimited, type PlanStatus } from "@/lib/access";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * Stripe is the single source of truth for subscription lifecycle. Every event
 * that changes a customer's access writes `plan_status` (and trial/sub id) on
 * the profile so the app's access helper sees one coherent state.
 *
 * plan_status values: none | trialing | active | past_due | canceled.
 *   - trialing/active/past_due(within grace)  -> full access
 *   - none / canceled / past_due(after grace) -> read only
 *
 * Chanelica is pinned to full access and can never be downgraded here.
 */
async function setPlanStatus(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  email: string | null,
  status: PlanStatus,
  extra: { trial_end?: string | null; stripe_subscription_id?: string | null } = {},
) {
  // Pinned accounts never degrade.
  if (isPinnedUnlimited(email)) {
    const safe: Record<string, unknown> = { plan: "paid", plan_status: "active" };
    if (extra.stripe_subscription_id) safe.stripe_subscription_id = extra.stripe_subscription_id;
    if (extra.trial_end) safe.trial_end = extra.trial_end;
    await supabase.from("profiles").update(safe).eq("id", userId);
    return;
  }

  const patch: Record<string, unknown> = { plan_status: status };
  // Keep the legacy tier column mirrored during the transition so existing
  // readers don't break; it will be dropped once every reader uses plan_status.
  patch.plan = status === "active" || status === "trialing" || status === "past_due" ? "paid" : "free";
  if (extra.trial_end !== undefined) patch.trial_end = extra.trial_end;
  if (extra.stripe_subscription_id !== undefined) patch.stripe_subscription_id = extra.stripe_subscription_id;
  await supabase.from("profiles").update(patch).eq("id", userId);
}

/** Resolve the userId + email for a Stripe event's customer. */
async function resolveUser(
  supabase: Awaited<ReturnType<typeof createClient>>,
  metadataUserId: string | null | undefined,
  customerId: string | null | undefined,
) {
  // Prefer subscription/session metadata (set at checkout).
  if (metadataUserId) {
    const { data } = await supabase.from("profiles").select("id, email").eq("id", metadataUserId).single();
    if (data) return { userId: data.id, email: (data as { email: string | null }).email ?? null };
  }
  // Fall back to matching by stripe_customer_id.
  if (customerId) {
    const { data } = await supabase
      .from("profiles")
      .select("id, email, stripe_customer_id")
      .eq("stripe_customer_id", customerId)
      .single();
    if (data) return { userId: data.id, email: (data as { email: string | null }).email ?? null };
  }
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig ?? "", process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const who = await resolveUser(supabase, session.metadata?.userId ?? null, session.customer as string | null);
      if (who) {
        const subId = typeof session.subscription === "string" ? session.subscription : null;
        // Completed checkout (card accepted) starts the trial. The
        // customer.subscription.* events refine trialing vs active.
        await setPlanStatus(supabase, who.userId, who.email, "trialing", { stripe_subscription_id: subId });
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const who = await resolveUser(supabase, sub.metadata?.userId ?? null, sub.customer as string | null);
      if (!who) break;
      const trialEnd = sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null;
      let status: PlanStatus;
      if (sub.status === "trialing") status = "trialing";
      else if (sub.status === "active") status = "active";
      else if (sub.status === "past_due" || sub.status === "unpaid") status = "past_due";
      else status = "canceled"; // incomplete / incomplete_expired / canceled
      await setPlanStatus(supabase, who.userId, who.email, status, {
        trial_end: trialEnd,
        stripe_subscription_id: sub.id,
      });
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const who = await resolveUser(supabase, sub.metadata?.userId ?? null, sub.customer as string | null);
      if (who) {
        await setPlanStatus(supabase, who.userId, who.email, "canceled", { stripe_subscription_id: sub.id });
      }
      break;
    }
    case "invoice.payment_succeeded": {
      const inv = event.data.object as Stripe.Invoice;
      const who = await resolveUser(supabase, null, inv.customer as string | null);
      // A paid invoice means we're past the trial (or a renewal succeeded).
      if (who && inv.status === "paid") {
        await setPlanStatus(supabase, who.userId, who.email, "active");
      }
      break;
    }
    case "invoice.payment_failed": {
      const inv = event.data.object as Stripe.Invoice;
      const who = await resolveUser(supabase, null, inv.customer as string | null);
      if (who) {
        await setPlanStatus(supabase, who.userId, who.email, "past_due");
      }
      break;
    }
    case "customer.subscription.trial_will_end": {
      const sub = event.data.object as Stripe.Subscription;
      const who = await resolveUser(supabase, sub.metadata?.userId ?? null, sub.customer as string | null);
      // Record the trial end so the app can show the charge banner and the
      // grace logic has an anchor. Do NOT flip status yet.
      if (who) {
        const trialEnd = sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null;
        await supabase.from("profiles").update({ trial_end: trialEnd, stripe_subscription_id: sub.id }).eq("id", who.userId);
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}