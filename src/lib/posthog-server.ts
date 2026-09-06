import { PostHog } from "posthog-node";

// Server-side PostHog client. Never import posthog-js here — node only.
// flushAt 1 / flushInterval 0 + awaited flush() so events send before the
// serverless function returns (see PostHog docs for short-lived handlers).
export function getPostHogServer() {
  const client = new PostHog(
    process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "",
    {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    }
  );
  return client;
}

/** Fire a server event and flush before the handler returns. */
export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties: Record<string, unknown> = {}
) {
  const client = getPostHogServer();
  client.capture({ distinctId, event, properties });
  await client.flush();
  await client.shutdown();
}