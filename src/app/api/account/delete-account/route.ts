import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { completeDeletion, logDeletion, purgeUserStorage } from "@/lib/account-deletion";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/** Cancel any live Stripe subscription for the customer, so the deleted account never keeps billing. */
async function cancelStripeSubscription(stripeCustomerId: string | null, email: string | null): Promise<string> {
  let customerId = stripeCustomerId;
  let detail = "no stripe customer";
  try {
    if (!customerId) {
      // Fallback: find the customer by the account email.
      const search = await stripe.customers.search({ query: `email:"${email ?? ""}"`, limit: 1 });
      customerId = search.data?.[0]?.id ?? null;
      if (!customerId) return detail;
    }
    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
    });
    const live = (subs.data ?? []).filter((s) =>
      ["active", "trialing", "past_due", "unpaid", "incomplete"].includes(s.status)
    );
    if (live.length === 0) return `${customerId}: no active sub`;
    for (const sub of live) {
      await stripe.subscriptions.cancel(sub.id);
    }
    detail = `${customerId}: cancelled ${live.map((s) => s.id).join(",")}`;
  } catch (e) {
    detail = `stripe error: ${e instanceof Error ? e.message : "unknown"}`;
  }
  return detail;
}

/**
 * Action 2 — "Delete my account". Everything "delete my data" removes, plus
 * the account itself: cancels any active Stripe subscription, revokes
 * connected integrations (Notion token), purges ALL storage (incl. avatar),
 * then deletes the auth user — whose `on delete cascade` FKs remove every
 * remaining relational row (profiles, inbox_leads, notifications, …).
 *
 * Identity is server-verified from the session cookie; the confirm value must
 * equal the account email (defense against accidental single-click / CSRF).
 */
export async function POST(req: Request) {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  let body: { confirm?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  if (body.confirm !== user.email) {
    return NextResponse.json({ error: "confirmation mismatch" }, { status: 403 });
  }

  const service = createServiceClient();
  const logId = await logDeletion(service, { userId: user.id, email: user.email ?? null, kind: "account" });

  const email = user.email ?? null;
  try {
    // Read the Stripe customer id BEFORE the profile row is wiped by the cascade.
    const { data: profile } = await service
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();
    const stripeCustomerId = (profile as unknown as { stripe_customer_id: string | null } | null)?.stripe_customer_id ?? null;

    // 1. Purge every storage object (deal-files, idea-files, avatars) — no cascade.
    await purgeUserStorage(service, user.id, { avatars: true });
    // 2. Cancel any active Stripe subscription.
    const stripeDetail = await cancelStripeSubscription(stripeCustomerId, email);
    // 3. Revoke connected integrations (Notion). Deleting our token is the
    //    revoke — Notion's API has no token-revoke endpoint via the integration.
    await service.from("notion_connections").delete().eq("user_id", user.id);
    // 4. Delete the auth user → cascades all relational rows (incl. profile,
    //    inbox_leads, notifications, inbound_emails). Nothing left orphaned.
    const { error: delErr } = await service.auth.admin.deleteUser(user.id);
    if (delErr) throw new Error(delErr.message);

    await completeDeletion(service, logId, "completed", stripeDetail);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "deletion failed";
    await completeDeletion(service, logId, "failed", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}