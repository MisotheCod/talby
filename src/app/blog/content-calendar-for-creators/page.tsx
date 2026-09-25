import Link from "next/link";
import type { Metadata } from "next";
import { TalbyBrand } from "@/components/marketing/talby-brand";
import { RelatedReading } from "@/components/marketing/related-reading";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const CANONICAL = `${SITE}/blog/content-calendar-for-creators`;
const TITLE = "Building a content calendar that does not burn you out";
const META =
  "Building a content calendar that does not burn you out: how to plan sustainable posting, batch your work, and keep creating without the scramble.";

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

export default function ContentCalendarPage() {
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
          <span aria-current="page">Content calendar for creators</span>
        </nav>

        <h1 className="text-3xl font-semibold tracking-tight">{TITLE}</h1>
        <p className="text-sm text-muted mt-2">Talby · September 24, 2026</p>

        <p className="mt-6 text-muted text-base leading-relaxed">
          You start with the best intentions. Post every Tuesday and Thursday. Stay consistent. Build momentum. By week three
          the calendar is already slipping. By week six you are posting when you remember, which is never often enough, and
          you cannot remember the last time you felt anything but tired. A content calendar is supposed to help. Instead it
          becomes another thing you are failing at. The problem is not the calendar. The problem is how it was built.
        </p>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Start with what you can sustain</h2>
          <p className="text-muted text-base leading-relaxed">
            The single biggest mistake in content planning is building your schedule around your best week instead of your
            worst one [1]. If you can produce four pieces of quality content during a perfect week when nothing goes wrong,
            plan for three. If you managed seven during one inspired stretch, that number is not your baseline.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Research from the creator economy shows that posting consistently at a lower frequency builds more trust than
            sporadic bursts of activity [2]. Your audience learns when to expect you, and the algorithm learns that you are
            reliable. A sustainable three posts per week beats an aspirational seven that you hit twice then abandon.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Work at seventy percent of your true capacity. That buffer is not laziness. It is what keeps you posting when
            life happens, which it always does [1].
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Batch your creation so you are not always starting cold</h2>
          <p className="text-muted text-base leading-relaxed">
            Creating one post at a time, every single day, is the least efficient way to produce content [3]. It keeps you
            in reactive mode permanently. You never build momentum because every session starts from zero. The solution is
            batching.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Set one or two dedicated blocks each week where all you do is create. Film five videos in one sitting. Write
            three posts back to back. Design a week of graphics in a single afternoon [3]. During a three hour batch
            session, most creators produce more than they would across five scattered one hour sessions. The context
            switching costs add up, and staying in the same creative headspace produces better work.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Once the batch is done, the rest of the week is execution, not creation. You schedule what already exists. That
            separation is what prevents burnout. You are no longer making creative decisions under deadline pressure every
            single day.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Plan in themes, not just dates</h2>
          <p className="text-muted text-base leading-relaxed">
            A calendar that is just a list of empty slots to fill is missing half the structure. The creators who stay
            consistent organize their content around repeating themes [3]. Pick three to five core topics that your audience
            expects from you. Those are your pillars.
          </p>
          <p className="text-muted text-base leading-relaxed">
            A fitness creator might rotate between workout tutorials, nutrition advice, and mindset content. A marketing
            creator might cycle through strategy breakdowns, tool reviews, and behind the scenes process posts. When you
            know Monday is always a tutorial and Thursday is always a case study, half the decision is already made. You
            are not starting from scratch every time.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Monthly themes take this further. If October is about strength building and November is about recovery, you have
            a direction for every post that month. You are executing a plan, not inventing one under pressure.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Build two weeks of buffer before you publish anything</h2>
          <p className="text-muted text-base leading-relaxed">
            Creators who post the day they finish creating have no margin. One sick day breaks the streak. One unexpected
            project throws off the entire week. A content buffer is what makes your calendar resilient [3].
          </p>
          <p className="text-muted text-base leading-relaxed">
            Start by getting two weeks ahead. That means your first batch session produces enough content to cover the next
            two weeks, and every subsequent session maintains that buffer. When you have two weeks of scheduled content
            already in place, you can handle actual life without the panic.
          </p>
          <p className="text-muted text-base leading-relaxed">
            The buffer also allows you to respond to opportunities. If a trending topic emerges that you want to cover, you
            can create that content without disrupting the rest of your schedule. The planned posts hold the line while you
            take advantage of the moment.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Track what works and do more of it</h2>
          <p className="text-muted text-base leading-relaxed">
            A content calendar is not a fixed document. At the end of every month, look at what actually performed [3].
            Which posts got the most engagement. Which topics brought in new followers. Which formats drove the most saves
            or shares. Let that data guide the next month.
          </p>
          <p className="text-muted text-base leading-relaxed">
            If tutorial videos consistently outperform everything else, plan more tutorials. If behind the scenes content
            falls flat, reduce it. This is not about chasing trends. It is about paying attention to what your specific
            audience responds to and giving them more of it.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Content planning tools from major platforms show most successful creators review performance monthly and adjust
            their calendars based on real engagement data rather than assumptions [4]. The calendar should get smarter over
            time, not more rigid.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Rescheduling is not failure</h2>
          <p className="text-muted text-base leading-relaxed">
            The point of a content calendar is to make your work easier, not to create another performance metric you can
            fail at [1]. If you need to push a post back, push it back. If you need to skip a week to recharge, skip it.
            The system exists to serve you, not the other way around.
          </p>
          <p className="text-muted text-base leading-relaxed">
            The creators who last are the ones who give themselves permission to be human. You will have slow weeks. You
            will fall behind sometimes. The calendar does not stop working because you adjusted it. It stops working when
            you abandon it entirely out of guilt or frustration.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Build the calendar for consistency, but hold it loosely. Discipline matters. Rigidity does not. Keep creating,
            keep adjusting, and trust that a system that mostly works is better than burning out trying to make it perfect.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Sources</h2>
          <ol className="list-decimal text-muted text-sm leading-relaxed pl-5 space-y-1">
            <li>
              <a href="https://andycormier.blog/2023/03/04/content-calendars-planning-basics-for-organized-creators/" className="hover:underline" target="_blank" rel="noopener noreferrer">
                Andy Cormier, Content Calendars: Planning Basics for Organized Creators
              </a>
            </li>
            <li>
              <a href="https://influenceflow.io/resources/influencer-content-calendar-planning-the-complete-guide-for-2026/" className="hover:underline" target="_blank" rel="noopener noreferrer">
                InfluenceFlow, Influencer Content Calendar Planning: The Complete Guide for 2026
              </a>
            </li>
            <li>
              <a href="https://vaultiyo.com/blog/how-to-build-content-calendar/" className="hover:underline" target="_blank" rel="noopener noreferrer">
                Vaultiyo, How to Build a Content Calendar for Creators
              </a>
            </li>
            <li>
              <a href="https://buddyboss.com/blog/content-planning-tools-for-creators/" className="hover:underline" target="_blank" rel="noopener noreferrer">
                BuddyBoss, Top Content Planning Tools for Creators in 2025
              </a>
            </li>
          </ol>
        </section>

                <RelatedReading
          links={[
            { href: "/blog/batching-content-as-a-creator", title: "How to batch content as a solo creator" },
            { href: "/blog/track-deliverables-across-platforms", title: "Tracking deliverables across platforms" },
            { href: "/blog/content-repurposing-for-creators", title: "Repurposing one piece of content everywhere" }
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
          This is a guide to planning creative work, not business or legal advice. Talby helps you run your brand deals. It is not a
          business consultant.
        </p>
      </main>
    </div>
  );
}
