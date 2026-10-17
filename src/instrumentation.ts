import * as Sentry from "@sentry/nextjs";

/**
 * Next.js instrumentation hook: initializes Sentry for the server and edge
 * runtimes at startup (upgrade 11). Runs once per process. When `SENTRY_DSN`
 * is not set (local, or a project that hasn't opted in), init is a no-op and
 * the build/runtime is unaffected.
 */
export function register() {
  const runtime = process.env.NEXT_RUNTIME;
  if (runtime === "nodejs" || runtime === "edge") {
    Sentry.init({
      dsn: process.env.SENTRY_DSN || undefined,
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
      tracesSampleRate: 0.1,
    });
  }
}
