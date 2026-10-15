"use client";

/**
 * PlanBanner — mission banners for the plan lifecycle (spec 08 §4 / Pl* boards).
 * One banner under the top bar per state:
 *   trialing  : "N days left in your free trial."            → Subscribe
 *   pastdue   : "Payment failed. Update your card by <date>." → Update card
 *   canceled  : "Plan canceled. You can still see everything." → Restart plan
 *   readonly  : "Your free trial has ended. You can view and export everything." → Subscribe
 * Sits inside the main column (same width as the page), 12px radius, 16px
 * below it, Subscribe-style solid accent button right aligned.
 */

export type PlanState = "trialing" | "active" | "pastdue" | "canceled" | "readonly" | null;

export function PlanBanner({
  state,
  daysLeft,
  graceDate,
  onAction,
}: {
  state: PlanState;
  daysLeft?: number | null;
  graceDate?: string | null;
  onAction?: (a: "subscribe" | "update" | "restart") => void;
}) {
  if (!state || state === "active") return null;

  let text = "";
  let cta = "";
  let act: "subscribe" | "update" | "restart" = "subscribe";

  if (state === "trialing") {
    const d = daysLeft ?? 0;
    text = d <= 3
      ? `Your free trial ends in ${d} day${d === 1 ? "" : "s"}.`
      : `${d} days left in your free trial.`;
    cta = "Subscribe";
  } else if (state === "pastdue") {
    text = graceDate
      ? `Payment failed. Update your card by ${graceDate} to keep full access.`
      : "Payment failed. Update your card to keep full access.";
    cta = "Update card";
    act = "update";
  } else if (state === "canceled") {
    text = "Plan canceled. You can still see everything. Restart to add or change deals.";
    cta = "Restart plan";
    act = "restart";
  } else {
    text = "Your free trial has ended. You can view and export everything.";
    cta = "Subscribe";
  }

  return (
    <div
      role="status"
      className="mb-4 flex items-center gap-3 rounded-xl px-4 py-2.5"
      style={{ background: "var(--accent-tint, var(--t-tile))" }}
    >
      <span className="min-w-0 flex-1 text-sm text-[color:var(--t-fg)]">{text}</span>
      <button
        type="button"
        onClick={() => onAction?.(act)}
        className="tb shrink-0 cursor-pointer rounded-[14px] border-0 px-[18px] py-[9px] text-sm font-bold hover:opacity-[.88]"
        style={{ background: "var(--t-brand-accent, var(--t-primary))", color: "var(--t-primary-fg)" }}
      >
        {cta}
      </button>
    </div>
  );
}

/** The locked Add-deal dialog body (spec 08 / PlLocked). Trial ended → Upgrade;
 *  canceled → Restart plan. */
export function LockedDialog({
  state,
  onAction,
  onClose,
}: {
  state: "readonly" | "canceled";
  onAction?: () => void;
  onClose?: () => void;
}) {
  const title = state === "canceled" ? "Your plan is canceled" : "Your free trial ended";
  const body =
    state === "canceled"
      ? "You can still see everything. Restart your plan to add or change deals."
      : "You can still see everything. Subscribe to add or change deals.";
  const cta = state === "canceled" ? "Restart plan" : "Upgrade";
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center px-4" style={{ background: "var(--t-overlay)" }}>
      <div role="dialog" aria-modal="true" className="a-pop w-full max-w-sm rounded-[var(--t-r-dialog)] border p-6 text-center"
        style={{ background: "var(--t-card)", color: "var(--t-fg)", borderColor: "var(--t-border)", boxShadow: "var(--t-sh-pop)" }}>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-[color:var(--t-muted-fg)]">{body}</p>
        <div className="mt-5 flex justify-center gap-2">
          <button type="button" onClick={onClose}
            className="tb inline-flex h-8 items-center rounded-[var(--t-r-ctl)] border px-3.5 text-sm font-medium"
            style={{ borderColor: "var(--t-border)", background: "var(--t-card)", color: "var(--t-fg)" }}>
            Cancel
          </button>
          <button type="button" onClick={onAction}
            className="tb inline-flex h-8 items-center rounded-[var(--t-r-ctl)] border-0 px-3.5 text-sm font-medium hover:opacity-[.88]"
            style={{ background: "var(--t-primary)", color: "var(--t-primary-fg)" }}>
            {cta}
          </button>
        </div>
      </div>
    </div>
  );
}
