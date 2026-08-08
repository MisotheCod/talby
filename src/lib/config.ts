// ============================================================
// TALBY CONFIG — single place for tunable constants.
// ============================================================

/**
 * FREE PLAN ACTIVE-DEAL CAP.
 * The only paywall gate in v1. Free users can hold this many ACTIVE
 * (active/in-progress) deals; completed/archived deals never count and
 * are unlimited. We'll tune this number with real usage data.
 */
export const FREE_ACTIVE_DEAL_CAP = 5;

/** Stripe paid plan (the only paid tier). */
export const STRIPE_PLAN_ID = process.env.STRIPE_PRICE_ID || "";

/** OpenRouter key for the AI import-mapping engine — SERVER-ONLY. */
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

/** Google OAuth for Gmail (nudge send mechanism) — SERVER-ONLY. */
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
export const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/gmail/callback`;

/** Minimal Gmail scope: compose + send (no read of user mail). */
export const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.send";

/** Nudge engine defaults (overridable per user in Settings). */
export const DEFAULT_NUDGE_DAYS_OVERDUE = 3;
export const DEFAULT_NUDGE_CADENCE_DAYS = 6;
export const DEFAULT_NUDGE_MAX_COUNT = 3;

