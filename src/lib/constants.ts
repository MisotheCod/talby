// ============================================================
// TALBY CONSTANTS — client-safe shared values.
// NO secrets here. Anything that must never reach the browser
// (API keys, OAuth secrets, redirect URIs) lives in
// src/lib/server-config.ts. Keep this file free of sensitive
// process.env values.
// ============================================================

/** FREE-PLAN ACTIVE-DEAL CAP. */
export const FREE_ACTIVE_DEAL_CAP = 5;

/** Stripe paid plan price id (public identifier, not a secret). */
export const STRIPE_PLAN_ID = process.env.STRIPE_PRICE_ID || "";

/**
 * Talby Assistant model ids (public identifiers). The OpenRouter privacy
 * params are applied per-request — never via provider.order (404 under
 * allow_fallbacks:false).
 */
export const ASSISTANT_MODEL_ID = "deepseek/deepseek-v4-flash";
export const EMBED_MODEL_ID = "openai/text-embedding-3-small";
export const EMBED_DIMENSIONS = 1536;

/** Gmail OAuth scopes (public). */
export const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.send";
export const GMAIL_READ_SCOPE = "https://www.googleapis.com/auth/gmail.readonly";
export const GMAIL_FULL_SCOPE = `${GMAIL_SCOPE} ${GMAIL_READ_SCOPE}`;

/** Notion API version header (public). */
export const NOTION_VERSION = "2022-06-28";

/** Nudge engine defaults (overridable per user in Settings). */
export const DEFAULT_NUDGE_DAYS_OVERDUE = 3;
export const DEFAULT_NUDGE_CADENCE_DAYS = 6;
export const DEFAULT_NUDGE_MAX_COUNT = 3;
