import Link from "next/link";
import type { Metadata } from "next";
import { TalbyBrand } from "@/components/marketing/talby-brand";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const CANONICAL = `${SITE}/blog/negotiating-with-brands`;
const TITLE = "How to negotiate brand deals the right way";
const META =
  "Negotiate brand deals the right way: pricing methods, usage rights tiers, when to walk away, and the contract clauses that protect your income.";

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

export default function NegotiatingWithBrandsPage() {
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
                "@type": "Article",
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
          <span aria-current="page">Negotiating with brands</span>
        </nav>

        <h1 className="text-3xl font-semibold tracking-tight">{TITLE}</h1>
        <p className="text-sm text-muted mt-2">Talby · September 24, 2026</p>

        <p className="mt-6 text-muted text-base leading-relaxed">
          The difference between a good brand deal and a great one is not follower count. It is whether you know what to
          ask for before the conversation starts. Most creators leave money on the table not because they undervalue their work but
          because they do not know how pricing actually works. Brands that accept your first number without a counter are
          telling you something. This guide covers how to set rates, what usage rights cost, which contract clauses matter, and
          when to walk away.
        </p>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Start with the right pricing method</h2>
          <p className="text-muted text-base leading-relaxed">
            There are three ways to price sponsored content, and which one you use depends on what the brand cares about
            and what data you have. Most creators use CPM pricing as the baseline, then adjust based on engagement or campaign value.
          </p>
          <p className="text-muted text-base leading-relaxed">
            CPM-based pricing calculates your rate by taking your average views per post and multiplying by a cost per
            thousand views. For 2026, standard CPM ranges are $20 to $50 for YouTube integrations, $10 to $25 for TikTok,
            and $15 to $30 for Instagram Reels [1]. A creator averaging 60,000 views per post at a $30 CPM would charge
            $1,800 as the base rate. This gives you a defensible starting point that is tied to actual reach.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Engagement-based pricing rewards quality over quantity. If your audience interacts more than average for
            your platform, this method prices that in [2]. A creator with 50,000 followers and an 8 percent engagement rate
            generates around 4,000 engagements per post. At $0.25 per engagement, the rate would be $1,000. Research shows
            that brands rank engagement rate as the most important metric when evaluating creator partnerships, more than follower
            count alone [1].
          </p>
          <p className="text-muted text-base leading-relaxed">
            Value-based pricing ties your rate to what the brand expects to make from the campaign. If a brand typically
            spends $50 to acquire a customer and your typical sponsored post drives 100 conversions, the value to them is
            $5,000. Pricing the deal at $1,500 to $2,000 gives them strong return while maximizing your fee [1]. This method
            works best when you have data from past campaigns you can reference.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Usage rights are where the real money is</h2>
          <p className="text-muted text-base leading-relaxed">
            Content usage rights determine how and where the brand can use what you create. This is the single biggest pricing
            factor in a brand deal, and most creators undercharge because they do not separate usage from the creation fee [1].
          </p>
          <p className="text-muted text-base leading-relaxed">
            Organic-only rights are the baseline. The brand can post the content on your channel as agreed, but they cannot repurpose
            it for ads, feature it on their own website, or run it through paid media. This is the minimum tier and should be
            your standard quoted rate.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Paid media rights let the brand use your content in their advertising for a limited period, typically 30, 60, or
            90 days. This tier adds 50 to 150 percent to your organic rate [1]. Always specify the duration. Without it,
            a brand can run your face and voice in paid ads indefinitely at a one-time cost.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Whitelisting means the brand runs ads through your account, so the ad appears under your handle as if you posted
            it organically. This adds 100 to 200 percent to the base rate because it uses your identity and the trust your
            audience has in you [1]. Brands prefer whitelisting because creator-handle ads outperform brand-handle ads
            consistently.
          </p>
          <p className="text-muted text-base leading-relaxed">
            A full buyout gives the brand permanent ownership for any use, anywhere. TV commercials, billboards, website hero
            sections, packaging, all digital ads, in perpetuity and worldwide. A full buyout should be priced at 3 to 10 times
            your organic post rate [1]. A creator charging $2,000 for an organic post might quote $10,000 to $20,000 for a buyout.
          </p>
          <p className="text-muted text-base leading-relaxed">
            The right way to present pricing is to quote your base rate for creation and organic posting, then offer tiers for
            extended usage. This makes the negotiation about which package fits the brand's budget, not whether your rate is fair.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What to push back on in contracts</h2>
          <p className="text-muted text-base leading-relaxed">
            A bad contract clause can cost you more than a low rate. There are a few terms that show up in almost every
            brand deal and need to be negotiated before you sign.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Exclusivity prevents you from working with competing brands for a set period. Brands ask for this often, and it
            should always be compensated separately [1]. Standard terms are 30 to 60 days of category exclusivity for 25 to 50 percent
            of your base fee [2]. Never accept open-ended or indefinite exclusivity without recurring payment. Every month you
            cannot work with a competitor is a month of income you are turning away.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Unlimited revisions are common in first drafts of contracts. Cap revisions at two rounds, then charge hourly for
            additional rounds [2]. Unlimited revisions mean the deal can drag on for months while the brand figures out internal
            alignment. That is not your problem to solve for free.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Performance guarantees make you responsible for metrics you do not control. Brands cannot guarantee how an algorithm
            distributes content, and neither can you [1]. Provide historical performance data as an estimate, not a promise.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Payment terms longer than net-60 are a red flag [2]. Standard terms are 50 percent upfront and 50 percent on delivery,
            or net-30 after posting. For first-time brand partners, ask for 100 percent upfront or use escrow through a platform.
            Never publish sponsored content before payment confirmation.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">How to negotiate scope, not rate</h2>
          <p className="text-muted text-base leading-relaxed">
            When a brand says they cannot meet your rate, the answer is not to discount. The answer is to reduce what you deliver.
            Negotiate scope instead of lowering your price [1].
          </p>
          <p className="text-muted text-base leading-relaxed">
            If the budget is fixed at $3,000 but your rate for three Reels with 60-day usage is $5,000, offer two Reels with
            30-day usage for $3,000. You maintain your per-unit pricing while giving the brand flexibility. This also shows that
            you value your work and that your rates are not arbitrary.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Another option is to extend the timeline. Brands that need content by tomorrow often did not plan ahead, not because the
            campaign requires it [3]. Quote a standard 14 to 21 day turnaround for produced content, and charge 20 to 25 percent
            more for rush delivery under five days [2]. This protects your weekends and your quality.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Discounting the rate to close a deal sets a precedent. The brand will expect the same low rate next time, and you will
            have to walk it back later. Reducing deliverables keeps the door open without devaluing your work.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">When to walk away</h2>
          <p className="text-muted text-base leading-relaxed">
            Some deals are not worth taking at any price. The brands that walk because your rate is too high are often
            the ones that come back six months later with a bigger budget [3]. Walking away politely keeps the relationship open.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Red flags include brands offering only exposure or free product as primary compensation. Decline. Brands that
            pitch performance-based payment with no minimum are usually looking for free creative assets [3]. Approval cycles
            of five or more rounds signal internal misalignment, and the deal will become a nightmare to close.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Contracts that include perpetual usage in the base fee with no upcharge should not be signed. Cap usage at 12 months
            maximum, then charge separately for extensions [3]. A contract that does not specify deliverables, usage rights, or
            exclusivity is not a contract. It is a liability.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Long-term partnerships are valuable, but only if the terms are right. If a brand cannot meet your minimum rate and is
            unwilling to adjust scope, it is okay to say no. Half the repeat deals creators land come from brands who initially
            walked but came back when their budget allowed it [3].
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Sources</h2>
          <ol className="list-decimal text-muted text-sm leading-relaxed pl-5 space-y-1">
            <li><a href="https://conbersa.ai/learn/creator-brand-deal-negotiation-guide" className="hover:underline" target="_blank" rel="noopener">Conbersa: Creator Brand Deal Negotiation Guide</a></li>
            <li><a href="https://revenuelab.fyi/blog/brand-deal-negotiation-guide-2026" className="hover:underline" target="_blank" rel="noopener">RevenueLab: Brand Deal Negotiation Guide for Creators (2026)</a></li>
            <li><a href="https://markstudios.com/blog/brand-deal-pricing-and-negotiation-for-creators-2026" className="hover:underline" target="_blank" rel="noopener">Mark Studios: Brand Deal Pricing & Negotiation for Creators 2026</a></li>
            <li><a href="https://www.toptal.com/creator/post/how-to-negotiate-long-term-brand-deals-as-an-influencer" className="hover:underline" target="_blank" rel="noopener">Toptal: How to Negotiate Long-Term Brand Deals as an Influencer</a></li>
          </ol>
        </section>

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
          This is a guide to negotiating creative work, not legal or tax advice. Talby helps you run your brand deals. It is not a
          lawyer or an accountant.
        </p>
      </main>
    </div>
  );
}
