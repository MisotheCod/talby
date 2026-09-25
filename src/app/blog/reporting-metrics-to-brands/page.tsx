import Link from "next/link";
import type { Metadata } from "next";
import { TalbyBrand } from "@/components/marketing/talby-brand";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const CANONICAL = `${SITE}/blog/reporting-metrics-to-brands`;
const TITLE = "The performance metrics that get you repeat brand deals";
const META =
  "What metrics to report after a campaign, why tracking them well earns repeat deals, and how proving your value becomes the difference between one-offs and partnerships.";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: TITLE,
  description: META,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: META,
    url: CANONICAL,
    images: [{ url: `${SITE}/icon.png`, width: 512, height: 512, alt: "Talby" }],
    siteName: "Talby",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: META,
    images: [`${SITE}/icon.png`],
  },
};

export default function ReportingMetricsToBrandsPage() {
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
                image: `${SITE}/icon.png`,
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
          <span aria-current="page">Reporting metrics to brands</span>
        </nav>

        <h1 className="text-3xl font-semibold tracking-tight">{TITLE}</h1>
        <p className="text-sm text-muted mt-2">Talby · September 24, 2026</p>

        <p className="mt-6 text-muted text-base leading-relaxed">
          The campaign wraps, the posts are live, and you send a quick note saying it went well. Then you wait. Some brands come back
          with another deal. Others go quiet. The difference is not always the content you made. It is what you sent them after. When
          you report the right metrics in the right way, brands see you as someone who delivers results, not just posts. This guide
          covers what to measure, how to share it, and why good reporting gets you repeat deals.
        </p>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Why reporting matters more than you think</h2>
          <p className="text-muted text-base leading-relaxed">
            Most creators finish a campaign and move to the next one. The brand gets the content, you get paid, and the relationship
            stops there. But research shows that 83 percent of brands say delivering on campaign goals is what solidifies a
            successful partnership [1]. When you prove you hit their targets, they remember. When you do not, they assume the
            campaign was just okay and they start looking at other creators.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Repeat partnerships produce stronger results than one-off deals across every platform [2]. Brands that work with the same
            creators build trust with the audience, and the creator gets better at talking about the product. But getting to that
            second deal means showing the first one worked. Without data, you are hoping they remember you.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">The metrics brands actually care about</h2>
          <p className="text-muted text-base leading-relaxed">
            Every brand campaign has a goal. Some want reach, some want engagement, and some want sales. The metrics you report
            should match what they asked for. If you send the wrong numbers, it tells them you were not paying attention.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Here are the core categories to track and report:
          </p>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li><strong>Reach and impressions.</strong> How many people saw the content. This is the top of the funnel. Brands care about this when awareness is the goal.</li>
            <li><strong>Engagement metrics.</strong> Likes, comments, saves, shares, and story replies. These show how the audience responded. Comment sentiment matters more than total count [3].</li>
            <li><strong>Link clicks and traffic.</strong> If the campaign included a link, track how many people clicked and where they went. Use UTM parameters so the brand can see your traffic in their own analytics [4].</li>
            <li><strong>Conversions and sales.</strong> For performance campaigns, report how many people bought. If you used a discount code or affiliate link, include redemption numbers and revenue generated.</li>
            <li><strong>Audience sentiment.</strong> What people said in comments, DMs, and replies. Positive mentions of the brand or product are a signal the message landed [3].</li>
          </ul>
          <p className="text-muted text-base leading-relaxed">
            Do not send everything. Send what matches the brief. If the brand said they wanted engagement, lead with engagement rate
            and comment quality. If they wanted traffic, lead with link clicks and time on site.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">How to collect the numbers without losing your mind</h2>
          <p className="text-muted text-base leading-relaxed">
            Tracking metrics sounds simple until you have five campaigns live at once and you are pulling screenshots from three
            platforms. Here is how to make it less painful.
          </p>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li><strong>Set up tracking before you post.</strong> If the campaign uses a link, add UTM parameters so you can see which clicks came from your content. If it is a code, write down the starting redemption count.</li>
            <li><strong>Check the numbers at consistent intervals.</strong> Do not wait until the end. Pull metrics at 24 hours, 7 days, and 30 days. Some platforms keep showing content long after you post, and brands want to see the full arc.</li>
            <li><strong>Screenshot the data.</strong> Platform analytics change or disappear. Take screenshots of the key numbers so you have proof later.</li>
            <li><strong>Use a tool that keeps it in one place.</strong> If you are running multiple campaigns, a brand deal tracker keeps the metrics attached to the right campaign. No more hunting through old DMs or lost spreadsheets.</li>
          </ul>
          <p className="text-muted text-base leading-relaxed">
            The goal is to have the numbers ready when the brand asks, not to scramble for them a week later.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What to send and when</h2>
          <p className="text-muted text-base leading-relaxed">
            Good reporting is not just the data. It is the story around the data. Sending a screenshot with no context makes the
            brand do the work. Sending a short summary with the key takeaways does the opposite.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Here is a simple format that works:
          </p>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li><strong>One-line summary.</strong> Start with the outcome. Example: "The campaign reached 42,000 people and drove 1,200 link clicks, which is 150 percent of the target."</li>
            <li><strong>The key metrics.</strong> List the numbers that match the brief. Include comparisons if you have them, like how this campaign performed versus your average post.</li>
            <li><strong>Audience response.</strong> Add a few examples of positive comments or DMs. Show the brand that people actually engaged with the message.</li>
            <li><strong>What you learned.</strong> If something worked especially well, mention it. Example: "The carousel format got twice the saves of a single image." Brands value creators who think strategically.</li>
          </ul>
          <p className="text-muted text-base leading-relaxed">
            Send the report within a week of the campaign ending. If it is a longer campaign, send a mid-point update. Proactive
            reporting sets you apart from creators who only respond when asked [1].
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">How this leads to repeat deals</h2>
          <p className="text-muted text-base leading-relaxed">
            Brands work with hundreds of creators. Most deliver the content and disappear. When you report results clearly and
            proactively, you become memorable. You prove you understand their goals and can hit them. That is what turns a one-off
            deal into a long-term partnership.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Research shows that repeat collaborations outperform single posts because the audience builds familiarity with the
            creator-brand pairing [2]. The brand knows this. When they see you delivered the first time, the decision to bring you
            back is easy. You already proved you can do the work.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Good reporting also opens the door to better deal structures. When you show you can drive traffic or sales, you can
            negotiate performance bonuses or hybrid payment models [1]. Brands pay more for creators who can prove ROI.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Sources</h2>
          <ol className="list-decimal text-muted text-sm leading-relaxed pl-5 space-y-1">
            <li>
              <a href="https://impact.com/influencer/creator-analytics-prove-your-worth-and-keep-brand-deals/" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
                Impact.com: Creator analytics - How to prove your worth to land and keep more brand deals
              </a>
            </li>
            <li>
              <a href="https://www.tubefilter.com/2026/05/19/influencer-marketing-factory-brand-deals-report-2026/" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
                Tubefilter: Repeat partnerships are the most effective creator campaigns
              </a>
            </li>
            <li>
              <a href="https://www.businessinsider.com/influencer-marketing-metrics-for-tracking-successful-campaign-youtube-instagram-2020-2" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
                Business Insider: The metrics that brands use to measure the success of an influencer-marketing campaign
              </a>
            </li>
            <li>
              <a href="https://advertisingweek.com/a-proven-framework-for-measuring-influencer-marketing" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
                Advertising Week: A proven framework for measuring influencer marketing
              </a>
            </li>
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
          This is a guide to tracking creative work, not legal or tax advice. Talby helps you run your brand deals. It is not an
          accountant.
        </p>
      </main>
    </div>
  );
}
