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
  disable_session_recording: true, // trust: never record financial screens
  debug: process.env.NODE_ENV === "development",
});

export function onRouterTransitionStart(url: string) {
  // Breadcrumb for debug; PostHog already tracks the pageview.
  posthog.capture("$pageview", { url });
}