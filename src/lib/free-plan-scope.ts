import { FREE_ACTIVE_DEAL_CAP } from "@/lib/constants";

/**
 * Free-plan "visible deals" scoping — ONE rule across the app.
 *
 * On the free plan the user may act on at most FREE_ACTIVE_DEAL_CAP (5) active
 * deals: the 5 most recent active (non-archived). Any overflow deals they built
 * while Unlimited are preserved in the DB and hidden until they go back to
 * Unlimited. Every screen that shows deal/payment/value aggregates must derive
 * those figures from the VISIBLE set only, so a free user sees one coherent
 * picture of what they can act on. The capacity/upsell cards (e.g. "19 of 5")
 * are the deliberate exception and stay on the true total.
 *
 * Pass the deals array sorted how the caller has it; this util sorts internally
 * by created_at desc to pick the most recent.
 */
export function scopeVisibleDeals<T extends { id: string; active?: boolean; status?: string | null; created_at?: string | null }>(
  deals: T[],
  plan: "free" | "paid",
  cap: number = FREE_ACTIVE_DEAL_CAP,
): { visibleDeals: T[]; hiddenIds: Set<string>; hiddenCount: number } {
  if (plan !== "free") return { visibleDeals: deals, hiddenIds: new Set(), hiddenCount: 0 };

  const active = deals
    .filter((d) => d.active && d.status !== "archived")
    .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));

  const hiddenIds = new Set<string>();
  active.forEach((d, i) => { if (i >= cap) hiddenIds.add(d.id); });

  const visibleDeals = hiddenIds.size ? deals.filter((d) => !hiddenIds.has(d.id)) : deals;
  return { visibleDeals, hiddenIds, hiddenCount: hiddenIds.size };
}

/** Scope payments to only those whose deal is in the visible set (keeps rows with no deal). */
export function scopePaymentsToVisible<P extends { deal_id?: string | null }>(payments: P[], hiddenIds: Set<string>): P[] {
  if (!hiddenIds.size) return payments;
  return payments.filter((p) => !p.deal_id || !hiddenIds.has(p.deal_id));
}
