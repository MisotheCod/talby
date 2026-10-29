import TalbyPage from "@/components/talby-app/TalbyPage";
import type { Metadata } from "next";

const SITE = "https://www.talby.io";

export const metadata: Metadata = {
  title: "Talby — Brand deals & money, in one calm place",
  description:
    "Talby is the calm command center for creators — track brand deals, payments, and content without the Notion chaos.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Talby",
    url: SITE + "/",
    title: "Talby — Brand deals & money, in one calm place",
    description: "Track brand deals, payments, and content without the Notion chaos.",
    images: [{ url: SITE + "/og.png", width: 1200, height: 630, alt: "Talby" }],
  },
  twitter: { card: "summary_large_image", title: "Talby", description: "Track brand deals, payments, and content without the Notion chaos.", images: [SITE + "/og.png"] },
};

const ENTITY_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Talby",
      url: SITE + "/",
      potentialAction: { "@type": "SearchAction", target: SITE + "/?q={search_term_string}", "query-input": "required name=search_term_string" },
    },
    {
      "@type": "Organization",
      name: "Talby",
      url: SITE + "/",
      logo: SITE + "/icons/icon-192.png",
      sameAs: [],
      contactPoint: { "@type": "ContactPoint", email: "hello@talby.io", contactType: "customer support" },
    },
    {
      "@type": "SoftwareApplication",
      name: "Talby",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free trial, then unlimited at $9/month." },
      aggregateRating: undefined,
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ENTITY_JSONLD) }} />
      <TalbyPage board="SHome" props={{ view: "sample", plan: "active" }} look={null} />
    </>
  );
}
