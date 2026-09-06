import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `pdfjs-dist` needs to be required at runtime (it resolves its own worker
  // from node_modules); bundling it into the server chunk breaks that.
  serverExternalPackages: ["pdfjs-dist"],
  // PostHog ingest reverse-proxy: routes /ingest/* to PostHog so ad blockers
  // can't blackhole client-side analytics. Matches instrumentation-client.ts.
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // Required to support PostHog trailing-slash API requests.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;