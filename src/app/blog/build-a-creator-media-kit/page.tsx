import Link from "next/link";
import type { Metadata } from "next";
import { TalbyBrand } from "@/components/marketing/talby-brand";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const CANONICAL = `${SITE}/blog/build-a-creator-media-kit`;
const TITLE = "Build a creator media kit that gets you hired by brands";
const META =
  "Build a creator media kit that gets you hired by brands. What to include, what brands actually look for, and why most kits never get a response.";

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

export default function BuildCreatorMediaKitPage() {
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
          <span aria-current="page">Build a creator media kit</span>
        </nav>

        <h1 className="text-3xl font-semibold tracking-tight">{TITLE}</h1>
        <p className="text-sm text-muted mt-2">Talby · September 24, 2026</p>

        <p className="mt-6 text-muted text-base leading-relaxed">
          A brand reaches out about a partnership. You reply with your rate. They ask for a media kit. You scramble to find your
          latest follower count and paste it into a Google Doc. They never write back. You do not have a media kit problem. You
          have a presentation problem. Nearly three out of four brands now require a media kit before they agree to work with
          a creator [1]. This guide covers what actually goes in one, what brands look for first, and what makes them close
          the tab.
        </p>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What a media kit actually is</h2>
          <p className="text-muted text-base leading-relaxed">
            A media kit is a one to three page document that shows a brand everything they need to decide whether to partner
            with you. It is your resume for brand deals. Think of it as a pitch you send once and reuse a hundred times.
          </p>
          <p className="text-muted text-base leading-relaxed">
            The format itself is simple. It includes your audience size, your engagement numbers, a few examples of past work,
            your rates, and a way to reach you. The execution is what matters. A brand evaluates your kit in under sixty seconds [2],
            so every section has to answer a question before they think to ask it.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Creators with detailed media kits negotiate rates that are 40 percent higher than those who pitch without one [2].
            The kit itself does not raise your rate. It removes the friction that makes brands move on to the next pitch.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">The six sections brands need to see</h2>
          <p className="text-muted text-base leading-relaxed">
            Every media kit that gets a yes includes six pieces. You can rearrange them, but you cannot skip them. Brands
            are comparing you to other creators, and missing even one section makes their decision easier.
          </p>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li><strong>Bio and niche.</strong> Two or three sentences about who you are, what you make, and who watches it. Fitness creator making gym tutorials for women over thirty beats lifestyle influencer every time.</li>
            <li><strong>Audience demographics.</strong> Age range, location split, gender breakdown. Seventy-two percent of brands now prioritize audience fit over follower count [2]. If your audience matches their customer, that is the entire pitch.</li>
            <li><strong>Performance metrics.</strong> Engagement rate, average reach, video views. Your engagement rate is more important than your follower count. Brands care how many people actually interact with your posts.</li>
            <li><strong>Content portfolio.</strong> Three to five examples of your best work with their numbers attached. Brands want to see what you can do before they ask you to do it for them.</li>
            <li><strong>Rate card.</strong> What you charge per post, per story, per campaign. Sixty-eight percent of creators report faster deal cycles when they list prices upfront [2].</li>
            <li><strong>Contact information.</strong> Email, social handles, a link to your main profile. Make it easy for them to say yes.</li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Engagement rate is the number that matters</h2>
          <p className="text-muted text-base leading-relaxed">
            Brands look at your engagement rate before they look at your follower count. On Instagram, nano creators with one
            to ten thousand followers average 5.2 percent engagement. Macro creators with over five hundred thousand followers
            average 2.3 percent [2]. The smaller creator gets hired.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Your engagement rate is calculated as total interactions divided by follower count, then multiplied by one hundred.
            If you have thirty thousand followers and each post gets one thousand likes and fifty comments, your engagement
            rate is 3.5 percent. Anything above three percent is competitive. Above five percent, you are in the top tier [3].
          </p>
          <p className="text-muted text-base leading-relaxed">
            Brands also want to see your average reach per post. Reach tells them how many people actually see your content,
            not just how many follow you. If your reach is five times your follower count, your content is getting pushed by
            the algorithm. That is proof your audience trusts what you post.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What to charge and how to show it</h2>
          <p className="text-muted text-base leading-relaxed">
            Most creators price using a CPM model, which stands for cost per thousand followers or views. Rates range from ten
            to fifty dollars per thousand depending on your platform and niche [2]. If you have twenty thousand followers and
            a three percent engagement rate in the beauty space, a starting rate of around one hundred twenty dollars per post
            is reasonable.
          </p>
          <p className="text-muted text-base leading-relaxed">
            List your rates by deliverable type. One Instagram post costs this. A TikTok video costs that. A package with both
            costs this. Brands do not want to negotiate before they know whether you fit their budget. Listing rates upfront
            filters out the ones who cannot afford you and speeds up the ones who can.
          </p>
          <p className="text-muted text-base leading-relaxed">
            The average creator earns between fifty and five hundred dollars per post at the nano tier, and between two hundred
            fifty and one thousand dollars at the micro tier [4]. If you are starting out, err on the lower end of that range.
            Once you have two or three brand deals under your belt, raise your rates by twenty percent and add case studies
            to your kit.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Why most kits never get a response</h2>
          <p className="text-muted text-base leading-relaxed">
            Five mistakes kill more pitches than anything else. Brands review dozens of media kits a week, and they can spot
            these red flags in seconds.
          </p>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li>Outdated numbers. Showing follower counts or engagement rates from six months ago signals that you are not actively monitoring your growth.</li>
            <li>Missing demographics. Follower count without audience data is a red flag. Brands cannot justify a partnership if they do not know who they are reaching.</li>
            <li>No rate card. Leaving out pricing forces an awkward back and forth that slows everything down or stops it entirely.</li>
            <li>Generic bio. Content creator and influencer tells them nothing. Specify your niche, your audience, and what makes your content different.</li>
            <li>Inflated numbers. Brands run engagement audits. A follower to engagement ratio that does not add up is an instant rejection.</li>
          </ul>
          <p className="text-muted text-base leading-relaxed">
            Creators who update their media kit quarterly report 34 percent more sponsorship inquiries [2]. Stale data is one
            of the most common reasons brands pass on otherwise strong creators.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What happens after you have one</h2>
          <p className="text-muted text-base leading-relaxed">
            A finished media kit is a tool, not a trophy. It needs to reach brands to generate deals. Three distribution
            channels work: cold outreach via email, creator marketplaces, and responding to brand callouts on social.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Cold outreach still works if you research the brand and personalize your pitch. Response rates sit around one to
            three percent, but one yes can fund a month of work. Creator marketplaces remove the guesswork. You apply to
            campaigns that fit your niche and let your media kit speak for itself.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Include your media kit link in your bio so brands can review it the moment they find you. The easier you make it
            for them to evaluate you, the more likely they are to reach out. Brands receive hundreds of pitches. The ones that
            close are the ones that answer every question before it gets asked.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Sources</h2>
          <ol className="list-decimal text-muted text-sm leading-relaxed pl-5 space-y-1">
            <li>
              <a href="https://www.businessinsider.com/how-to-create-an-influencer-media-kit" className="hover:underline" target="_blank" rel="noopener noreferrer">
                Business Insider: How to Create an Influencer Media Kit
              </a>
            </li>
            <li>
              <a href="https://promote.sh/blog/build-creator-media-kit" className="hover:underline" target="_blank" rel="noopener noreferrer">
                Promote: How to Build a Creator Media Kit That Wins Brand Deals
              </a>
            </li>
            <li>
              <a href="https://www.creatorwizard.com/post/how-to-make-a-media-kit-for-instagram-or-youtube-get-more-brand-deals" className="hover:underline" target="_blank" rel="noopener noreferrer">
                Creator Wizard: Media Kits for Instagram or YouTube
              </a>
            </li>
            <li>
              <a href="https://www.pitchbrand.co/statistics/brand-partnerships" className="hover:underline" target="_blank" rel="noopener noreferrer">
                PitchBrand: 40 Brand Partnership Statistics for 2026
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
          This is a guide to building creator media kits, not legal or business advice. Talby helps you run your brand deals. It is not an
          accountant or a lawyer.
        </p>
      </main>
    </div>
  );
}
