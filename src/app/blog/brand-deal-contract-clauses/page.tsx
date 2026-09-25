import Link from "next/link";
import type { Metadata } from "next";
import { TalbyBrand } from "@/components/marketing/talby-brand";
import { RelatedReading } from "@/components/marketing/related-reading";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const CANONICAL = `${SITE}/blog/brand-deal-contract-clauses`;
const TITLE = "The brand deal contract clauses that actually matter";
const META =
  "The contract clauses creators should read before signing: exclusivity, usage rights, kill fees, and payment terms. What to negotiate and what to walk away from.";

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

export default function BrandDealContractClausesPage() {
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
          <span aria-current="page">Contract clauses</span>
        </nav>

        <h1 className="text-3xl font-semibold tracking-tight">{TITLE}</h1>
        <p className="text-sm text-muted mt-2">Talby · September 24, 2026</p>

        <p className="mt-6 text-muted text-base leading-relaxed">
          The brand contract sitting in your inbox is eleven pages of terms their legal team wrote to protect them. Most creators skim the first page for the fee and deliverables, then scroll to the signature line. The clauses that actually determine whether a deal works for you are buried in the middle sections. Usage rights, exclusivity, payment terms, and what happens if the brand cancels after you produce the content. These are the parts that cost you money when you get them wrong. Here is what to look for and what to push back on before you sign.
        </p>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Usage rights: who owns your content, and for how long</h2>
          <p className="text-muted text-base leading-relaxed">
            Under US copyright law, you own the content you create the moment you save the file or render the video [1]. That ownership stays with you unless you sign it away. The brand deal contract is usually an attempt to transfer that ownership, either partially or entirely, through a license or an assignment.
          </p>
          <p className="text-muted text-base leading-relaxed">
            A license grants the brand the right to use your content under specific terms while you keep ownership. An assignment transfers the copyright outright, meaning the brand owns it and you may need permission to keep using your own work [1]. Most creator contracts ask for a license, but the scope of that license is where the real negotiation lives.
          </p>
          <p className="text-muted text-base leading-relaxed">
            The four parameters that define usage rights are duration, territory, media, and purpose [2]. Duration is how long the brand can use the content. Six to twelve months for organic social use is the common baseline [3]. Territory is where the content can be used. Worldwide rights are more valuable than US-only rights. Media is which channels the brand can use the content on. Organic social posts, paid advertising, out-of-home billboards, and broadcast are each different tiers with different values. Purpose is what the brand can do with the content. Can they edit it, create derivative works, sublicense it to third parties.
          </p>
          <p className="text-muted text-base leading-relaxed">
            The single biggest red flag in this section is language granting rights in perpetuity across all media [2]. That phrase means the brand can use your face and your work on any billboard, in any ad, anywhere in the world, forever, for the one-time fee you already received. Never sign perpetual rights without pricing it as a full buyout. If the brand only needs organic social rights for six months, that is what the license should say. Anything beyond that is a separate line item.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Paid advertising and whitelisting: a higher-value tier</h2>
          <p className="text-muted text-base leading-relaxed">
            Most creators focus on content ownership and overlook the usage rights clause. Even if you retain ownership, a broad usage grant can give the brand nearly everything ownership would have given them [1]. The distinction that matters most is whether the brand can run your content as paid advertising.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Paid advertising rights mean the brand can take the photo or video you created and run it as a paid ad on Instagram, Facebook, TikTok, or YouTube for months or years without paying you again [1]. Whitelisting takes this further. Whitelisting, which platforms call Partnership Ads or Spark Ads, lets the brand run paid ads from your own handle using their budget and targeting [3]. Your face, your username, and your audience trust become part of the brand's media buy. That is a different permission tier than letting the brand repost your video on their feed, and it should be priced separately [3].
          </p>
          <p className="text-muted text-base leading-relaxed">
            When negotiating, separate organic use from paid use. The base fee typically covers organic social posting for a defined period. Paid advertising or whitelisting should be an add-on priced at 25 to 100 percent of the organic fee, depending on duration and spend cap [4]. Define the platforms, the duration, and whether the brand can edit or modify the content. Without those limits, your $2,000 post ends up running as a paid ad across three platforms for a year with no additional compensation.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Exclusivity: the clause that blocks future income</h2>
          <p className="text-muted text-base leading-relaxed">
            Exclusivity prevents you from working with competing brands for a defined period. The cost of exclusivity is not the campaign you already signed. It is every competing deal you turn down while the exclusivity window is running [3]. That opportunity cost is real, and it is rarely priced into the base fee.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Exclusivity clauses have three dimensions: scope, duration, and how the competing category is defined [1]. Scope determines whether the restriction covers a narrow product category or a broad industry vertical. Category exclusivity for energy drinks might lock you out of three or four competing brands. Category exclusivity for beverages locks you out of every drink deal on the market [3]. The narrower the category, the less future income you are giving up.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Duration determines how long the restriction runs. A 30-day lockout tied to the active campaign is reasonable. A 12-month category lockout for a single mid-size campaign is the brand using your year of potential deals to protect theirs [1]. Standard creator-side positions tie exclusivity to the campaign window plus 30 to 90 days post-campaign [2]. Anything longer should come with an exclusivity fee reflecting the opportunity cost.
          </p>
          <p className="text-muted text-base leading-relaxed">
            The best version of exclusivity names specific competitors rather than using vague category language [2]. If the brand genuinely needs protection from two or three direct competitors, the contract should list them. Vague language like similar products or related categories gives the brand room to interpret the restriction broadly later. Define the restriction narrowly, tie it to a clear end date, and ask for compensation that reflects the income the restriction is costing you.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Payment terms: when you actually get paid</h2>
          <p className="text-muted text-base leading-relaxed">
            The headline fee is what you see in the subject line. The payment terms are what determine when that money actually lands in your account. Many brand contracts default to net 30, net 60, or even net 90 payment terms, meaning the brand pays 30, 60, or 90 days after you deliver the final content [2]. Net 90 means you are financing the brand's campaign for three months of your own cash flow.
          </p>
          <p className="text-muted text-base leading-relaxed">
            The standard creator-side structure is a deposit on contract signing, typically 50 percent of the total fee, with the balance due on delivery of the final content before it goes live [1]. That structure ensures you are not producing content for a brand that may not pay. For deals under $2,000, asking for 100 percent upfront is reasonable [4]. For larger deals, a 50/50 split protects both sides. The brand has proof of delivery before paying the balance, and you have half the fee before you start work.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Watch for payment terms tied to performance metrics or campaign results. Payment due after the video hits 100,000 views or payment contingent on campaign performance means the brand is shifting their performance risk to you [4]. Your fee should be guaranteed for work delivered, not for outcomes the brand controls. If the payment timeline extends beyond 30 days from delivery, add late payment interest to the contract. A common structure is 1.5 percent monthly interest on overdue amounts [4]. That clause incentivizes the brand to pay on time.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Kill fees: what you get paid when the brand cancels</h2>
          <p className="text-muted text-base leading-relaxed">
            A kill fee is compensation paid when the brand cancels or chooses not to use the content after you already produced it [1]. Without a kill fee clause, you can produce the entire deliverable, deliver it on time, and receive nothing if the brand decides not to publish. That is free work for a cancelled project, and it happens more often than most creators expect.
          </p>
          <p className="text-muted text-base leading-relaxed">
            The standard structure is a tiered kill fee that scales with how far into production you are [2]. A common baseline is 25 percent of the total fee if the brand cancels before content creation begins, 50 percent if they cancel after you start work but before delivery, and 100 percent if they cancel after you deliver the final content [3]. That structure ensures you are paid for work completed, not just work the brand chose to use.
          </p>
          <p className="text-muted text-base leading-relaxed">
            The contract should define when work is considered begun. Most negotiated deals define it as the point when you start research, scripting, filming, or editing [4]. That clarity prevents disputes later. If the brand cancels mid-production, the kill fee compensates you for the time you already invested and the competing deals you turned down while the exclusivity window was already running. A kill fee is not a penalty. It is fair compensation for blocking your calendar and turning down other opportunities.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What to negotiate and when to walk away</h2>
          <p className="text-muted text-base leading-relaxed">
            Most brand contracts are starting positions, not final terms [2]. The clauses with the highest leverage are usage rights, exclusivity, and whitelisting. Those three move in nearly every meaningful negotiation. Asking for a defined usage term instead of perpetual rights is standard. Asking for a separate fee for paid advertising is common. Narrowing exclusivity from a broad category to a named competitor list is expected.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Some terms are non-negotiable red flags. Unlimited revisions with no approval cap means you may end up producing the same video five times for one fee [2]. No kill fee combined with one-sided termination rights means the brand can cancel after you produce the content and pay nothing. Payment terms beyond 60 days with no deposit mean you are carrying the brand's cash flow risk for months. These are structural problems, not small edits.
          </p>
          <p className="text-muted text-base leading-relaxed">
            When you push back, be specific. Instead of rejecting the entire contract, name the clauses that need to change and offer counter-language. Instead of perpetual usage rights, propose a 12-month term with a renewal fee structure. Instead of broad category exclusivity, propose a named competitor list. Instead of net 90 payment, propose 50 percent on signing and 50 percent on delivery. Brands that refuse standard creator protections are either inexperienced or deliberately overreaching. Either way, it tells you how the working relationship will go.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Sources</h2>
          <ol className="list-decimal text-muted text-sm leading-relaxed pl-5 space-y-1">
            <li>StarGuard Law, <a href="https://starguardlaw.com/insights/articles/brand-deal-contract-guide-creators" className="underline hover:no-underline" target="_blank" rel="noopener noreferrer">Brand Deal Contracts: What Creators Need to Know</a></li>
            <li>Jacobs Counsel, <a href="https://jacobscounsellaw.com/deal-anatomy/creator-brand-deal" className="underline hover:no-underline" target="_blank" rel="noopener noreferrer">Anatomy of a Creator Brand Deal</a></li>
            <li>Promise Legal, <a href="https://blog.promise.legal/streamer-brand-deal-contract-checklist/" className="underline hover:no-underline" target="_blank" rel="noopener noreferrer">Brand Deal Contracts: What Streamers Need to Know</a></li>
            <li>Neo Legal, <a href="https://neolegal.ae/insights/brand-deal-red-flags-creators" className="underline hover:no-underline" target="_blank" rel="noopener noreferrer">Brand Deal Red Flags: 12 Clauses That Hurt Creators</a></li>
          </ol>
        </section>

                <RelatedReading
          links={[
            { href: "/blog/negotiating-with-brands", title: "How to negotiate brand deals the right way" },
            { href: "/blog/getting-paid-on-time-creators", title: "How creators get paid on time" },
            { href: "/blog/track-deliverables-across-platforms", title: "Tracking deliverables across platforms" }
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
          This is a guide to contract terms for paid brand work, not legal or tax advice. Talby helps you track your brand deals. It is not a lawyer.
        </p>
      </main>
    </div>
  );
}
