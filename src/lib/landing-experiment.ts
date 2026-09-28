// Landing-test experiment: 3 variants (control / question / signup), split
// evenly. Assignment is deterministic per visitor and computed server-side in
// middleware so the "signup" variant can redirect to /signup BEFORE the page
// renders (a client-only flag can't do that). The variant is stored in a
// first-party cookie that the client reads to tag the signup_completed event
// with the same PostHog distinct id as the landing pageview.

export const LANDING_VARIANTS = ["control", "question", "signup"] as const;
export type LandingVariant = (typeof LANDING_VARIANTS)[number];

export const LANDING_VID_COOKIE = "talby_vid";
export const LANDING_VARIANT_COOKIE = "talby_landing_variant";

/** Deterministic, even 3-way bucket from any stable id string (the visitor
 *  id). Same id always yields the same variant. */
export function assignLandingVariant(id: string): LandingVariant {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) & 0x7fffffff;
  }
  return LANDING_VARIANTS[h % LANDING_VARIANTS.length];
}

/** Stable random visitor id, persisted in the __talby_vid cookie. */
export function newVisitorId(): string {
  const bytes = new Uint8Array(16);
  // crypto.getRandomValues is available in middleware (Node 18+) and browsers.
  crypto.getRandomValues(bytes);
  let s = "";
  for (const b of bytes) s += b.toString(16).padStart(2, "0");
  return s;
}

/** Read the assigned landing variant from the experiment cookie (client-side).
 *  Returns null when absent or the visitor is not in the experiment, so callers
 *  can attach it as a property to the signup_completed event. */
export function readLandingVariant(): string | null {
  try {
    const m = document.cookie.match(new RegExp("(?:^|;\\s*)" + LANDING_VARIANT_COOKIE + "=([^;]*)"));
    if (m && LANDING_VARIANTS.includes(m[1] as LandingVariant)) return m[1];
  } catch {
    /* cookie unavailable */
  }
  return null;
}