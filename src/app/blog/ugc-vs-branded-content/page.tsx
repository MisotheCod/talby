import Link from "next/link";
import type { Metadata } from "next";
import { TalbyBrand } from "@/components/marketing/talby-brand";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const CANONICAL = `${SITE}/blog/ugc-vs-branded-content`;
const TITLE = "UGC vs branded content: which one to make and how each is priced";
const META =
  "UGC vs branded content: what separates them, which one to make for your next deal, how each is priced differently, and why brands pick one over the other.";

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

export default function UGCvsBrandedContentPage() {
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
          <span aria-current="page">UGC vs branded content</span>
        </nav>

        <h1 className="text-3xl font-semibold tracking-tight">{TITLE}</h1>
        <p className="text-sm text-muted mt-2">Talby · September 24, 2026</p>

        <p className="mt-6 text-muted text-base leading-relaxed">
          A brand emails asking for content. They want either UGC or branded content, and the rate they quote depends on which one it is. Both involve you making something for money, but the difference changes what you film, how you film it, what rights you grant, and what you get paid. This guide covers what separates the two, which one to make when, how pricing works for each, and why brands choose one format over the other.
        </p>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What UGC actually means</h2>
          <p className="text-muted text-base leading-relaxed">
            UGC stands for user-generated content. In its original form, that meant unpaid content made by real customers: reviews, unboxing videos, and testimonials filmed on a phone [1]. The format is casual, the framing is imperfect, and nobody is following a script. It feels like something a friend sent you, not something a studio produced.
          </p>
          <p className="text-muted text-base leading-relaxed">
            In creator work today, UGC usually means something more specific. It is content you make to look and feel like organic user content, even though a brand paid you to make it [2]. The style is authentic and conversational. You hold your phone at arm's length, you talk directly to the camera, and you show the product in use the way you would if you were recommending it to someone who asked. Brands license this content to run on their own channels or as paid ads, and it works because it does not look like an ad [3].
          </p>
          <p className="text-muted text-base leading-relaxed">
            The trust signal is the whole point. Platforms like TikTok and Instagram favor content that feels native to the feed, and viewers scroll past anything that reads as polished advertising [3]. UGC bypasses both filters. It looks like the content people chose to watch.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What branded content means</h2>
          <p className="text-muted text-base leading-relaxed">
            Branded content is made with the brand's creative direction, production standards, and visual identity built in [2]. This is the studio-shot video, the color-graded footage, the professional lighting, and the scripted voiceover. It includes polished ads, campaign videos, and sponsored posts where you follow a detailed brief. The brand controls the message, the look, and the final edit.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Branded content is published on creator channels but carries the brand's fingerprints. It might be a sponsored Instagram Reel with a paid partnership label, a YouTube integration where you dedicate a segment to the product, or a TikTok video that follows brand guidelines down to the color palette [4]. The audience experiences it as part of your content, but they know a brand is behind it. Disclosure is required by law when there is payment or a material connection [4].
          </p>
          <p className="text-muted text-base leading-relaxed">
            The polish is intentional. Branded content is built to communicate authority, quality, and a specific brand identity. It works for launches, for premium positioning, and for moments when the brand needs to look like itself rather than borrow your voice [2].
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">How they are priced differently</h2>
          <p className="text-muted text-base leading-relaxed">
            UGC rates depend on the deliverable, not your follower count. A UGC creator with 500 followers charges roughly the same as one with 50,000, because the brand is paying for the content itself and the usage rights that come with it [5]. In 2026, reported rates for a single UGC video run between $100 and $500, with most falling around $150 to $200 [5]. Entry-level creators charge $50 to $150 per video, mid-level creators charge $150 to $300, and experienced creators with proven results charge $300 to $500 or more [5].
          </p>
          <p className="text-muted text-base leading-relaxed">
            The base rate covers organic use, meaning the brand can post it on their own social channels for one to three months [1]. Paid ad usage costs extra, typically adding 20% to 100% on top of the base [5]. If the brand wants to run your video as a paid ad across multiple platforms for six months, that is a different product at a different price. Exclusivity adds another layer. Locking you out of working with competitors for a quarter is worth money, and it gets priced in [5].
          </p>
          <p className="text-muted text-base leading-relaxed">
            Branded content pricing works differently because it includes your reach. You are being paid for your audience and the trust you have with them, so follower count and engagement rates drive the cost [5]. A sponsored feed post might run $60 to $300 depending on your follower count, niche, and the complexity of the content [5]. Stories are often cheaper or traded for product. Production costs are higher on the brand side, running into the thousands for studio shoots, but your rate reflects distribution rather than production [4].
          </p>
          <p className="text-muted text-base leading-relaxed">
            The gap between $150 and $2,000 for similar work is not the market being vague. It is five decisions wearing one price tag: your experience, the format, the license terms, exclusivity, and add-ons like rush delivery [5]. A UGC video filmed in two days for organic use only is a different job than a branded video produced over two weeks with perpetual, all-platform rights.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Which one to make and when</h2>
          <p className="text-muted text-base leading-relaxed">
            UGC wins for cold audiences and paid acquisition. When a brand is running ads to people who have never heard of them, the goal is to look native to the platform and earn the first few seconds of attention [3]. UGC beats polished branded content on click-through rates, app install conversion, and cost per acquisition because it does not trigger the "skip this ad" reflex [2]. If the brief asks for content that will run as a paid ad on TikTok or Reels, UGC is usually the right format.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Branded content wins for warm audiences and premium positioning. People who already know the brand respond better to polished content that reinforces quality and trust [2]. Branded content also works for app store assets, press materials, and high-ticket products where the price point needs to be justified by production value [2]. If the brand is retargeting site visitors or launching a premium product, polished branded content often performs better than raw UGC.
          </p>
          <p className="text-muted text-base leading-relaxed">
            The smart move for ongoing partnerships is a mix. Many brands allocate 70% of their budget to UGC for acquisition, 20% to running the best UGC as paid ads, and 10% to branded content for retargeting and brand moments [2]. That stack gets the cost efficiency of UGC where it matters and uses polished content where polish actually moves the number. You can offer both and let the brand pick based on the campaign goal.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">How the formats compare</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-line">
                <th className="text-left py-2 px-3 text-muted">Format</th>
                <th className="text-left py-2 px-3 text-muted">What you make</th>
                <th className="text-left py-2 px-3 text-muted">Pricing basis</th>
                <th className="text-left py-2 px-3 text-muted">Best for</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line">
                <td className="py-2 px-3 font-semibold">UGC</td>
                <td className="py-2 px-3">Casual, phone-shot, authentic</td>
                <td className="py-2 px-3">Per video + usage rights</td>
                <td className="py-2 px-3">Cold audiences, paid ads, native content</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">Branded content</td>
                <td className="py-2 px-3">Polished, scripted, brand-directed</td>
                <td className="py-2 px-3">Your reach + engagement</td>
                <td className="py-2 px-3">Warm audiences, launches, premium products</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What to track when you say yes</h2>
          <p className="text-muted text-base leading-relaxed">
            Both formats are paid deals, and both need the same level of tracking. You need to know what you promised, when it is due, whether you have invoiced, and when the payment is expected. The format changes the deliverable and the rate, but it does not change the fact that you are running a small business with obligations coming at you from multiple directions at once.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Most creators start tracking deals in a spreadsheet and stop updating it after the third or fourth brand. The issue is not discipline. The issue is that a tool that needs you to maintain it is not a tool, it is a second job. A command center built for creator deals keeps the content, the money, and the timeline connected without asking you to remember anything. You add the deal once and it follows all the way through.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Sources</h2>
          <ol className="list-decimal text-muted text-sm leading-relaxed pl-5 space-y-1">
            <li><a href="https://www.businessinsider.com/how-much-ugc-creators-charge-for-sponsored-content-2023-2" className="hover:underline" target="_blank" rel="noopener noreferrer">Business Insider: How much money 6 UGC creators charge brands to make content</a></li>
            <li><a href="https://theviralapp.com/blog/ugc-vs-branded-content" className="hover:underline" target="_blank" rel="noopener noreferrer">The Viral App: UGC vs Branded Content performance comparison</a></li>
            <li><a href="https://ugcking.com/blog/ugc-vs-branded-content" className="hover:underline" target="_blank" rel="noopener noreferrer">UGC King: Key differences and when to use each in 2026</a></li>
            <li><a href="https://www.amt.ai/blog/branded-content-marketing" className="hover:underline" target="_blank" rel="noopener noreferrer">AMT: Branded content marketing and how it works</a></li>
            <li><a href="https://www.launchpointhq.com/blog/pricing-guide" className="hover:underline" target="_blank" rel="noopener noreferrer">Launchpoint: UGC and influencer marketing pricing guide</a></li>
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
          This is a guide to creator content formats and pricing, not legal or tax advice. Talby helps you run your brand deals. It is not an
          accountant.
        </p>
      </main>
    </div>
  );
}
