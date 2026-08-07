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

