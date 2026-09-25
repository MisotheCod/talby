import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/signup`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/blog/track-brand-deals-without-a-spreadsheet`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog/how-to-pitch-brands`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog/how-to-price-sponsored-content`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog/negotiating-with-brands`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog/brand-deal-contract-clauses`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog/getting-paid-on-time-creators`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog/track-deliverables-across-platforms`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog/content-calendar-for-creators`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog/batching-content-as-a-creator`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog/content-repurposing-for-creators`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog/ugc-vs-branded-content`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog/build-a-creator-media-kit`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog/reporting-metrics-to-brands`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
