import Link from "next/link";
import type { Metadata } from "next";
import { TalbyBrand } from "@/components/marketing/talby-brand";
import { RelatedReading } from "@/components/marketing/related-reading";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const CANONICAL = `${SITE}/blog/how-to-price-sponsored-content`;
const TITLE = "How to price sponsored content and find your rate as a creator";
const META =
  "How to price sponsored content: calculate your creator rate with CPM formulas, engagement multipliers, and platform benchmarks.";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: TITLE,
  description: META,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: META,
    url: CANONICAL,
    siteName: "Talby",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: META,
  },
};

export default function HowToPriceSponsoredContentPage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BlogPosting",
                headline: TITLE,
                description: META,
                author: { "@type": "Organization", name: "Talby", url: SITE },
                publisher: { "@type": "Organization", name: "Talby", url: SITE, logo: { "@type": "ImageObject", url: `${SITE}/icon.png` } },
                mainEntityOfPage: CANONICAL,
                datePublished: "2026-09-24T00:00:00Z",
                dateModified: "2026-09-24T00:00:00Z",
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Talby", item: SITE },
                  { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
                  { "@type": "ListItem", position: 3, name: TITLE, item: CANONICAL },
                ],
              },
            ],
          }),
        }}
      />

      <header className="px-6 py-5 flex items-center justify-between max-w-3xl mx-auto w-full">
        <TalbyBrand />
        <Link href="/signup" className="text-sm font-semibold px-4 h-9 inline-flex items-center rounded-lg accent-fill">Free to start</Link>
      </header>

      <main className="px-6 py-10 max-w-3xl mx-auto w-full flex-1">
        <nav className="text-xs text-muted mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Talby</Link>
          <span aria-hidden className="mx-1.5">/</span>
          <Link href="/blog" className="hover:underline">Blog</Link>
          <span aria-hidden className="mx-1.5">/</span>
          <span aria-current="page">How to price sponsored content</span>
        </nav>

        <h1 className="text-3xl font-semibold tracking-tight">{TITLE}</h1>
        <p className="text-sm text-muted mt-2">Talby · September 24, 2026</p>

        <p className="mt-6 text-muted text-base leading-relaxed">
          You get a DM from a brand. They want to work with you. They ask for your rate and your stomach drops because you have no idea what to say. Too low and you lose money. Too high and they walk. Most creators between 10,000 and 100,000 followers consistently underprice because they are guessing. This guide walks you through the actual formulas brands use, what your engagement and niche are worth, and how to quote a rate you can defend.
        </p>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Start with cost per mille</h2>
          <p className="text-muted text-base leading-relaxed">
            Cost per mille, or CPM, is what advertisers pay per 1,000 views to reach your audience. This is the baseline every rate builds from. Your average views times your niche CPM gives you a floor number before engagement or platform adjustments [1].
          </p>
          <p className="text-muted text-base leading-relaxed">
            Finance and investing content commands $22 to $42 per thousand views. Tech and software sit at $18 to $35. Health and fitness land at $14 to $22. Gaming runs $12 to $20. Lifestyle or general vlog content sits at $8 to $14 [2]. A creator averaging 40,000 views per post can quote anywhere from $320 to $1,680 for the same deliverable depending on niche, because the audience itself is worth different amounts to different advertisers.
          </p>
          <p className="text-muted text-base leading-relaxed">
            The simple CPM formula looks like this: take your average views, divide by 1,000, then multiply by your niche CPM. That gives you a base rate for a dedicated piece of content. A 60-second integration typically prices at two thirds of the full rate. A pre-roll mention or end card usually prices at one quarter [2].
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Layer in engagement</h2>
          <p className="text-muted text-base leading-relaxed">
            Engagement rate is the single most important factor after niche. A creator with 50,000 followers and 8 percent engagement delivers more value than one with 200,000 followers and 1 percent engagement, and should price accordingly [1].
          </p>
          <p className="text-muted text-base leading-relaxed">
            Calculate engagement by adding likes, comments, shares, and saves, then dividing by follower count and multiplying by 100. Average engagement rates differ by platform. YouTube averages 3 to 5 percent. Instagram feed posts average 1.5 to 3.5 percent, while Reels average 3 to 7 percent. TikTok averages 4 to 8 percent [1].
          </p>
          <p className="text-muted text-base leading-relaxed">
            When your engagement beats the platform average, you can apply a multiplier to the base rate. An engagement rate above 5 percent typically justifies 1.5 to 2 times the base. An engagement rate between 3.5 and 5 percent justifies 1.0 to 1.4 times. Below 2 percent typically pulls the rate down to 0.5 to 0.7 times the base [3].
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Adjust for platform and format</h2>
          <p className="text-muted text-base leading-relaxed">
            A single Instagram Story is a different deliverable than a 15-minute YouTube video with a 60-second integration, a pinned comment, and a link in the description. Your rate needs to reflect actual scope of work [1].
          </p>
          <p className="text-muted text-base leading-relaxed">
            YouTube commands the highest sponsorship rates because videos have long shelf lives and strong search discoverability. A sponsored YouTube video can generate views for months or years after publishing. TikTok and Instagram content has a much shorter organic lifespan, and rates reflect that, though TikTok viral potential can sometimes offset the difference [1].
          </p>
          <p className="text-muted text-base leading-relaxed">
            For Instagram, a Reel typically commands 30 to 50 percent more than a feed post because Reels have greater organic reach potential. A feed post stays on your profile permanently, increasing the value of usage rights. Stories have the shortest lifespan at 24 hours and command the lowest base rate, though they are often bundled with feed posts or Reels [3].
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What usage rights and exclusivity actually cost</h2>
          <p className="text-muted text-base leading-relaxed">
            The rate you quote for a sponsored post usually covers creation and first publication. Brands will also want usage rights, which is permission to repurpose your content on their own channels. Each usage right has a standard additional fee. This is where most creators leave 30 to 50 percent of their potential income on the table [3].
          </p>
          <p className="text-muted text-base leading-relaxed">
            Organic social reposting, where the brand shares your post on their own feed, typically adds 15 to 25 percent of the base rate. Website or landing page use for 6 to 12 months adds 20 to 30 percent. Email newsletter use for one send adds 10 to 15 percent. Paid social ads on Meta or TikTok for 30 to 90 days adds 50 to 100 percent. Retail or in-store display adds 100 to 200 percent [3].
          </p>
          <p className="text-muted text-base leading-relaxed">
            Exclusivity, where you agree not to work with competing brands for a set period, adds 20 to 50 percent of the base rate depending on the window length. A 30-day exclusivity window adds roughly 20 percent. A 60-day window adds 40 percent. A 90-day window adds 60 percent [1].
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">How platforms compare at the same follower tier</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-line">
                <th className="text-left py-2 px-3 text-muted">Platform</th>
                <th className="text-left py-2 px-3 text-muted">Micro (10K-100K)</th>
                <th className="text-left py-2 px-3 text-muted">Mid (100K-500K)</th>
                <th className="text-left py-2 px-3 text-muted">Macro (500K-1M)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line">
                <td className="py-2 px-3">Instagram</td>
                <td className="py-2 px-3">$500 to $5,000</td>
                <td className="py-2 px-3">$5,000 to $25,000</td>
                <td className="py-2 px-3">$25,000 to $100,000</td>
              </tr>
              <tr className="border-b border-line">
                <td className="py-2 px-3">TikTok</td>
                <td className="py-2 px-3">$1,000 to $10,000</td>
                <td className="py-2 px-3">$10,000 to $50,000</td>
                <td className="py-2 px-3">$50,000 to $200,000</td>
              </tr>
              <tr>
                <td className="py-2 px-3">YouTube</td>
                <td className="py-2 px-3">$1,500 to $15,000</td>
                <td className="py-2 px-3">$15,000 to $75,000</td>
                <td className="py-2 px-3">$75,000 to $300,000</td>
              </tr>
            </tbody>
          </table>
          <p className="text-muted text-base leading-relaxed">
            These are ranges for a single sponsored post at each tier. YouTube creators charge 2 to 3 times more than Instagram creators with equivalent follower counts because production takes longer and content has a longer lifespan. TikTok rates sit between Instagram and YouTube because engagement is typically higher but content lifespan is shorter [3].
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">How to hold your rate when a brand pushes back</h2>
          <p className="text-muted text-base leading-relaxed">
            Always quote your full rate first. If the brand pushes back, offer reduced scope rather than a blanket discount. Drop a deliverable, shorten the exclusivity window, or limit usage rights. The per-unit rate stays intact and you stay flexible [1].
          </p>
          <p className="text-muted text-base leading-relaxed">
            When possible, ask what budget the brand is working with before sharing your rate. If their budget is higher than your standard rate, you can propose additional deliverables instead of leaving money on the table. If their budget is below your floor, you can walk away before investing time in a negotiation that was never going to work [1].
          </p>
          <p className="text-muted text-base leading-relaxed">
            Bring data into the conversation. Show up with your engagement rate, audience demographics, and past campaign performance when you have it. Brands respect creators who treat sponsorships like a business. Never say yes immediately, even when the offer looks great. Take 24 to 48 hours to review the scope. That is when you catch missing deliverables, exclusivity clauses, or usage rights buried in the brief [1].
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Sources</h2>
          <ol className="list-decimal text-muted text-sm leading-relaxed pl-5 space-y-1">
            <li>
              <a href="https://creaticalc.com/blog/how-to-calculate-sponsorship-rate" className="hover:underline" target="_blank" rel="noopener noreferrer">
                Creaticalc: How to Calculate Your Sponsorship Rate (2026 Formulas + Data)
              </a>
            </li>
            <li>
              <a href="https://variant-intl.com/blog/sponsorship-pricing-guide.html" className="hover:underline" target="_blank" rel="noopener noreferrer">
                Variant: The Complete Guide to Sponsorship Pricing in 2026
              </a>
            </li>
            <li>
              <a href="https://influenceflow.io/resources/sponsored-post-rates-the-complete-2026-pricing-guide-for-brands-and-creators/" className="hover:underline" target="_blank" rel="noopener noreferrer">
                InfluenceFlow: Sponsored Post Rates 2026 (Real Data From 1,574 Creators)
              </a>
            </li>
            <li>
              <a href="https://kinds.live/sponsorship-rate-guide-for-creators-what-to-include-in-your-pricing-and-packages" className="hover:underline" target="_blank" rel="noopener noreferrer">
                Kinds: Sponsorship Rate Guide for Creators
              </a>
            </li>
          </ol>
        </section>

                <RelatedReading
          links={[
            { href: "/blog/negotiating-with-brands", title: "How to negotiate brand deals the right way" },
            { href: "/blog/ugc-vs-branded-content", title: "UGC vs branded content" },
            { href: "/blog/how-to-pitch-brands", title: "Pitching brands as a smaller creator" }
          ]}
        />

        <section className="mt-8 max-w-md mx-auto bg-card border border-line rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold tracking-tight">Start for free</h2>
          <p className="text-muted text-sm mt-3 leading-relaxed">
            Talby is free up to five active deals. If you have fewer than that right now, it stays free. When you pass five, it means
            business is good, and a paid plan removes the cap and adds the assistant.
          </p>
          <Link
            href="/signup"
            className="accent-fill text-sm font-semibold px-5 h-10 inline-flex items-center justify-center rounded-lg mt-4 w-full"
          >
            Start free on talby.io
          </Link>
        </section>

        <p className="mt-10 text-xs text-muted">
          This is a guide to pricing creative work, not legal or tax advice. Talby helps you run your brand deals. It is not an
          accountant.
        </p>
      </main>
    </div>
  );
}
