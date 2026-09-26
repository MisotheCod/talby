import posthog from "posthog-js";
import { readOptOut } from "@/lib/privacy-optout";

// Next.js 15.3+ client instrumentation. Runs before hydration:
// PostHog must init here, NOT in a React provider, for Next 16.
// If the visitor has honored a Do Not Sell opt-out on this device, skip
// PostHog entirely (no cookies, no events) per CCPA / state privacy law.
if (!readOptOut()) {
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  // Route through /ingest rewrites (next.config.ts) so ad blockers
  // can't blackhole our analytics.
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  // Auto-captures pageviews (incl. SPA /pushState navigation) and
  // clicks (autocapture is on by default).
  capture_pageview: true,
  capture_exceptions: true,
  // Session replay is intentionally OFF. Replay (screen/session recording)
  // was turned off in the PostHog project settings for privacy (it was too
  // intrusive). Session recording is controlled server-side in PostHog's
  // dashboard, so the SDK still advertises recording support but nothing is
  // captured. Do NOT re-enable replay here without also blocking /app and
  // /onboarding in PostHog settings first. Input masking stays on regardless
  // as defense in depth.
  disable_session_recording: true,
  session_recording: {
    maskAllInputs: true,
  },
  debug: process.env.NODE_ENV === "development",
});
}

export function onRouterTransitionStart(url: string) {
  // Breadcrumb for debug; PostHog already tracks the pageview. Guard on the
  // opt-out too so opted-out visitors never emit even the pageview event.
  if (!readOptOut()) posthog.capture("$pageview", { url });
}