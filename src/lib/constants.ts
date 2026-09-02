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

/** Notion API version header (public). */
export const NOTION_VERSION = "2022-06-28";
