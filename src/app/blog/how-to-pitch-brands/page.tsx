import Link from "next/link";
import type { Metadata } from "next";
import { TalbyBrand } from "@/components/marketing/talby-brand";
import { RelatedReading } from "@/components/marketing/related-reading";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const CANONICAL = `${SITE}/blog/how-to-pitch-brands`;
const TITLE = "How to pitch brands as a smaller creator and land your first sponsored deal";
const META =
  "How to pitch brands as a smaller creator: what to have ready before you email a single brand, what to skip, and a pitch structure that gets a reply.";

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

export default function HowToPitchBrandsPage() {
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
          <span aria-current="page">How to pitch brands</span>
        </nav>

        <h1 className="text-3xl font-semibold tracking-tight">{TITLE}</h1>
        <p className="text-sm text-muted mt-2">Talby · September 24, 2026</p>

        <p className="mt-6 text-muted text-base leading-relaxed">
          You have been posting for months. Your engagement is solid, your niche is clear, and now you want to make money
          from brand partnerships. But when you look at other creators who are already getting paid, you think: they have more
          followers, more polish, more something. The truth is, smaller creators are landing brand deals every day, and the
          obstacle is rarely your audience size. What stops most pitches is that they talk about the wrong things to the
          wrong people. This guide covers what brands actually look for in a pitch, how to structure your outreach so it gets
          read, and what to stop spending time on if you want your first sponsored deal.
        </p>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Stop apologizing for your follower count</h2>
          <p className="text-muted text-base leading-relaxed">
            Small audiences are not a weakness. Brands are actively seeking out nano and micro creators. A recent industry study
            found that sixty nine percent of brands plan to work primarily with smaller creators [1]. The reason is simple: a creator
            with a tight, engaged following in a specific niche often delivers better results than someone with a massive, scattered
            audience. Your conversion rate matters more than your reach, and brands with limited budgets know that.
          </p>
          <p className="text-muted text-base leading-relaxed">
            If you run content about a specific subject area and your audience asks questions or comments on every post, that is
            proof of trust. A brand looking to reach exactly those people does not care that you have four thousand followers instead
            of forty thousand. They care that when you say something, your audience listens [2].
          </p>
          <p className="text-muted text-base leading-relaxed">
            The mental shift you need is this: you are not pitching despite being small. You are pitching because your niche makes
            you the right partner for brands in your space.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Make it about them, not you</h2>
          <p className="text-muted text-base leading-relaxed">
            Most pitches fail because they are written like a resume. The creator lists their follower count, their demographics,
            their average views, and then says they would love to collaborate. That pitch gets deleted because the brand does not
            care about you yet [1].
          </p>
          <p className="text-muted text-base leading-relaxed">
            The better structure, shared by a creator coach who has landed over five hundred brand deals, is called the ROPE method.
            Your pitch needs to be relevant to a campaign the brand recently ran or is planning. It should tie back to organic
            content you have already posted that features the brand or a similar product so they know your audience has real interest,
            not forced hype. Include proof of past work or content you created for other brands. And make it easy to execute by
            pitching an actual idea for what you will create, not a vague request to partner [1].
          </p>
          <p className="text-muted text-base leading-relaxed">
            That last point is critical. If you say you would love to figure out a way to work together, the brand has to do the
            work of imagining the partnership. They will not. Tell them what you will make, when you will post it, and what rights
            they get. Brands respond to clarity.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Focus on the right goal for the campaign</h2>
          <p className="text-muted text-base leading-relaxed">
            Not all brand deals are the same, and the type of campaign determines how much you can charge and what the brand expects
            from you. There are three main types [1]. Brand awareness campaigns are about spreading the word. Metrics are looser, like
            engagement and impressions, which means you can usually negotiate a better rate. Content repurposing campaigns are when a
            brand wants to use your video or images in their own social posts or paid ads. This is a good early door for smaller creators
            because the brand is buying your creative skill, not your follower count. Conversion campaigns aim to drive a specific action
            like app downloads or product sales. These are harder to negotiate higher pay for because the brand tracks exact return on ad
            spend.
          </p>
          <p className="text-muted text-base leading-relaxed">
            When you pitch a brand, ask what their goal is. It shows you understand marketing objectives, and it helps you price your
            work correctly. A repurposing deal should cost more than a standard post because the brand is getting usage rights. A
            conversion deal may pay less upfront, but you can propose an affiliate structure where you earn based on performance [1].
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Build proof even when you are starting from zero</h2>
          <p className="text-muted text-base leading-relaxed">
            You do not need a giant portfolio to pitch brands, but you do need something that shows you can deliver. If you have no paid
            deals yet, create voluntary content for brands you already use and love. Post a review of a product in your niche, tag the
            brand, and send them the link when you pitch. That single piece of content is evidence that you know how to make something
            that benefits a brand without making it sound like an ad [2].
          </p>
          <p className="text-muted text-base leading-relaxed">
            If you have a small following but strong production skills, focus on pitching user generated content. These are the videos
            and photos brands use on their own channels. One creator noted that brands would rather pay a small creator for a good TikTok
            video than hire a full studio [2]. The deliverable here is not access to your audience. It is your ability to create content
            that looks native to the platform.
          </p>
          <p className="text-muted text-base leading-relaxed">
            The other form of proof is showing engagement quality. If your last five posts each got twenty comments with real questions
            or replies, screenshot that. A small but active audience is worth more than a large, silent one.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Expect rejection and learn from it</h2>
          <p className="text-muted text-base leading-relaxed">
            You will send out dozens of pitches and hear nothing back. You will get template rejections that feel insulting. You will
            reach out to brands you thought were perfect and get ghosted. That is the process, not a sign that you are doing it wrong.
            One creator coach said plainly: you are going to get fifty nos on the path to your first yes, and the only question is
            whether you have the tenacity to keep pitching [3].
          </p>
          <p className="text-muted text-base leading-relaxed">
            Most rejections are not about you. The person who runs the generic press email is not the decision maker on partnerships. They
            reply with a template because they get hundreds of low effort requests. When a brand says they only work with larger creators,
            that is not a universal policy. That is one person at one company giving you one answer. The next brand you pitch may have a
            completely different view [3].
          </p>
          <p className="text-muted text-base leading-relaxed">
            What you do with rejection matters. If the first five pitches go nowhere, look at your email subject line and your opening
            sentence. Are you leading with research about the brand or with facts about yourself? Are you sending to the right contact or
            a generic inbox? Adjust, send five more, and keep learning.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Get the basics ready before you pitch</h2>
          <p className="text-muted text-base leading-relaxed">
            Brands move fast. If someone replies to your pitch and asks for more information, you want to send it the same day. That means
            having a media kit ready. It does not need to be a ten page document. One page works if it includes your niche, your key
            platforms and stats, examples of past content, and a way to contact you [2].
          </p>
          <p className="text-muted text-base leading-relaxed">
            Make sure your bio on every platform has an email address in it. Brands cannot work with you if they cannot reach you. Use a
            professional email address, not a random Gmail you check once a month. If your content is scattered across three platforms with
            three different usernames, pick one name and stick to it. Consistency makes you easier to find and easier to remember [4].
          </p>
          <p className="text-muted text-base leading-relaxed">
            The other preparation step is knowing your rate. You do not need a public rate card, but you should have a starting number in
            mind for a single post, a story, and a video with repurposing rights. Research what other creators in your niche and size range
            are charging, then set your floor. You can negotiate up, but you need a baseline so you do not accept deals that undervalue your
            work.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Sources</h2>
          <ol className="list-decimal text-muted text-sm leading-relaxed pl-5 space-y-1">
            <li>
              <a 
                href="https://www.businessinsider.com/creator-coach-500-brand-deals-pitch-method-emails-influencers-2023-9" 
                className="underline hover:no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Business Insider: A creator who's landed over 500 deals shares his top strategies to cold-pitch brands
              </a>
            </li>
            <li>
              <a 
                href="https://www.businessinsider.com/how-to-reach-out-to-brands-as-micro-influencer-templates-to-use" 
                className="underline hover:no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Business Insider: How micro influencers get paid partnerships, from templates to media kits
              </a>
            </li>
            <li>
              <a 
                href="https://www.creatorwizard.com/podcast/from-0-to-sponsored-small-creator-s-roadmap" 
                className="underline hover:no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Creator Wizard: From 0 to Sponsored: Small Creator's Roadmap
              </a>
            </li>
            <li>
              <a 
                href="https://impact.com/news/the-power-of-niche-brand-deals-as-a-small-influencer" 
                className="underline hover:no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Impact.com: The power of niche: How to get brand deals as a small influencer
              </a>
            </li>
          </ol>
        </section>

                <RelatedReading
          links={[
            { href: "/blog/how-to-price-sponsored-content", title: "How to price sponsored content" },
            { href: "/blog/build-a-creator-media-kit", title: "Building a creator media kit" },
            { href: "/blog/negotiating-with-brands", title: "How to negotiate brand deals the right way" }
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
          This is a guide to pitching brand partnerships, not legal or contract advice. Talby helps you run your brand deals. It is not a
          lawyer.
        </p>
      </main>
    </div>
  );
}
