// ============================================================
// Access control — the single source of truth for what an account may do.
//
// The trial model replaces the free/paid tier. An account's access derives
// entirely from `plan_status` (see migration 000044):
//
//   none         read only (no card on file, no trial started)
//   trialing     full
//   active       full
//   past_due     full during a 7 day grace after trial_end, then read only
//   canceled     read only (after the access period ends)
//
// "Read only" means the user can view, search and export everything, but
// cannot create or edit deals, payments or files. Nothing is deleted.
//
// NEVER check plan === "paid" / plan === "free" for access again — that tier
// column is legacy and does not carry lifecycle state.
// ============================================================

export type PlanStatus = "none" | "trialing" | "active" | "past_due" | "canceled";

/** 7 business days of grace after a failed charge before access goes read only. */
export const PAST_DUE_GRACE_DAYS = 7;

/**
 * Does this account have FULL access right now (can create/edit)?
 * `past_due` keeps full access until its grace window ends, so the user can
 * still work while they fix the card.
 */
export function hasFullAccess(status: PlanStatus | null | undefined, trialEnd: string | null | undefined, now: Date = new Date()): boolean {
  switch (status ?? "none") {
    case "trialing":
    case "active":
      return true;
    case "past_due": {
      // Grace ends PAST_DUE_GRACE_DAYS after the trial end (or subscription
      // anchor). No trial_end on record → keep access (don't lock people out
      // on missing data).
      if (!trialEnd) return true;
      const end = new Date(trialEnd);
      const graceEnd = new Date(end.getTime() + PAST_DUE_GRACE_DAYS * 86400_000);
      return now.getTime() < graceEnd.getTime();
    }
    case "none":
    case "canceled":
    default:
      return false;
  }
}

/** Is the account locked to read only right now (the inverse, for clarity at call sites)? */
export function isReadOnly(status: PlanStatus | null | undefined, trialEnd: string | null | undefined, now: Date = new Date()): boolean {
  return !hasFullAccess(status, trialEnd, now);
}

/**
 * Pinned accounts (the owner's family) must never lose full access, regardless
 * of any webhook, cron, or gift expiry. Callers that could downgrade them must
 * short circuit on this first.
 */
const PINNED_EMAILS = new Set([
  "chanelicarobinson@gmail.com",
  "approvedbybre@gmail.com",
]);
export function isPinnedUnlimited(email: string | null | undefined): boolean {
  return PINNED_EMAILS.has((email ?? "").toLowerCase());
}