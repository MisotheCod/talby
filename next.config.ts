import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `pdfjs-dist` needs to be required at runtime (it resolves its own worker
  // from node_modules); bundling it into the server chunk breaks that.
  serverExternalPackages: ["pdfjs-dist"],
};

export default nextConfig;