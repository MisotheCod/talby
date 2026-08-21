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

/**
 * Talby Assistant (paid tier): chat over the user's own deals/payments/
 * contracts/calendar. Swappable model ids live here.
 * - ASSISTANT_MODEL_ID: grounded Q&A model. Verified reachable under the
 *   OpenRouter ZDR params below. DeepSeek V4 Flash: 1M ctx, ~$0.08/1M in.
 * - EMBED_MODEL_ID: contract chunk embeddings. text-embedding-3-small via
 *   OpenRouter /embeddings, 1536 dims, verified under the ZDR params.
 * The OpenRouter privacy params are applied per-request in the assistant route
 * (never via provider.order — that 404s under allow_fallbacks:false).
 */
export const ASSISTANT_MODEL_ID = "deepseek/deepseek-v4-flash";
export const EMBED_MODEL_ID = "openai/text-embedding-3-small";
export const EMBED_DIMENSIONS = 1536;

/** OpenRouter key for the AI import-mapping engine — SERVER-ONLY. */
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

/** Google OAuth for Gmail (nudge send mechanism) — SERVER-ONLY. */
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
export const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/gmail/callback`;

/** Minimal Gmail scope: compose + send (no read of user mail). Used for nudges. */
export const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.send";

/**
 * Gmail read scope for the inbox deal scanner. Restricted scope (requires
 * extended Google verification) — kept SEPARATE from GMAIL_SCOPE so the
 * nudge send/compose flow does not depend on it. The connect route combines
 * them; if the read scope is rejected in review, nudges still work.
 */
export const GMAIL_READ_SCOPE = "https://www.googleapis.com/auth/gmail.readonly";
export const GMAIL_FULL_SCOPE = `${GMAIL_SCOPE} ${GMAIL_READ_SCOPE}`;

/** Notion OAuth (public integration) — each user connects their own account. */
export const NOTION_CLIENT_ID = process.env.NOTION_CLIENT_ID || "";
export const NOTION_CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET || "";
export const NOTION_REDIRECT_URI =
  process.env.NOTION_REDIRECT_URI || `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/notion/callback`;
/** Notion API version header sent on every request. */
export const NOTION_VERSION = "2022-06-28";

/** Nudge engine defaults (overridable per user in Settings). */
export const DEFAULT_NUDGE_DAYS_OVERDUE = 3;
export const DEFAULT_NUDGE_CADENCE_DAYS = 6;
export const DEFAULT_NUDGE_MAX_COUNT = 3;

