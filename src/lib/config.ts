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

/** Accent presets available for theming. */
export const ACCENT_PRESETS = [
  { id: "coral", name: "Coral", color: "#ff6f42" },
  { id: "ocean", name: "Ocean", color: "#2f6fed" },
  { id: "fern", name: "Fern", color: "#3c9d64" },
  { id: "plum", name: "Plum", color: "#7c5ce0" },
  { id: "berry", name: "Berry", color: "#e34f8f" },
  { id: "gold", name: "Gold", color: "#e8a012" },
] as const;

/** Arc-live-picker palette (drag across rainbow). */
export const LIVE_PALETTE = [
  "#ff6f42", "#ff8a3d", "#ffb020", "#e8d53a", "#7fcc4d",
  "#2fbf8f", "#2f9dcf", "#2f6fed", "#7c5ce0", "#a855f7",
  "#e34f8f", "#ef4d5c",
];
