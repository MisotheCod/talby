import posthog from "posthog-js";

// Next.js 15.3+ client instrumentation. Runs before hydration:
// PostHog must init here, NOT in a React provider, for Next 16.
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  // Route through /ingest rewrites (next.config.ts) so ad blockers
  // can't blackhole our analytics.
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  // Auto-captures pageviews (incl. SPA /pushState navigation) and
  // clicks (autocapture is on by default).
  capture_pageview: true,
  capture_exceptions: true,
  // Session replay is enabled for CONVERSION research (landing + signup), but
  // must never capture the financial app. The /app and /onboarding URL blocklist
  // is enforced in PostHog project settings (server-side remote config) because
  // the SDK's init options do not accept a urlBlocklist. Client-side we hard-mask
  // all input values (signup email/password) as defense in depth.
  disable_session_recording: false,
  session_recording: {
    maskAllInputs: true,
  },
  debug: process.env.NODE_ENV === "development",
});

export function onRouterTransitionStart(url: string) {
  // Breadcrumb for debug; PostHog already tracks the pageview.
  posthog.capture("$pageview", { url });
}