import Link from "next/link";
import type { Metadata } from "next";
import { TalbyBrand } from "@/components/marketing/talby-brand";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const CANONICAL = `${SITE}/blog/batching-content-as-a-creator`;
const TITLE = "How to batch content as a solo creator";
const META =
  "Batch content creation for solo creators: the weekly workflow that turns scattered daily posting into focused production sessions that protect your time.";

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

export default function BatchContentPage() {
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
          <span aria-current="page">Batch content as a solo creator</span>
        </nav>

        <h1 className="text-3xl font-semibold tracking-tight">{TITLE}</h1>
        <p className="text-sm text-muted mt-2">Talby · September 24, 2026</p>

        <p className="mt-6 text-muted text-base leading-relaxed">
          Every morning starts with the same question: what should I post today? That question is a symptom of a broken
          system, or more honestly, the absence of one. You wake up, scan your feed for inspiration, open your camera app,
          hope something comes to mind. By noon you are stuck between posting something mediocre or posting nothing at all.
          Content batching replaces that daily scramble with a repeatable production cycle. You create multiple pieces in
          focused blocks, schedule them out, and free up the rest of your week. This guide covers what batching actually is,
          the weekly structure that works, and how to start without overhauling everything at once.
        </p>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What batching actually means</h2>
          <p className="text-muted text-base leading-relaxed">
            Batching is the practice of creating multiple pieces of content in one focused session instead of making one
            piece at a time [1]. You write all your captions in one block, film all your videos in another, and schedule
            everything in a third. The method works by reducing context switching, which is the productivity drain that
            happens when you jump between disconnected tasks [1].
          </p>
          <p className="text-muted text-base leading-relaxed">
            Some creators batch one week at a time. Others batch a full month [2]. Both work. The deciding factor is how
            quickly your niche moves and how much buffer you need. A travel creator responding to new locations might batch
            weekly. A business coach teaching evergreen frameworks might batch monthly. The structure stays the same either
            way: group similar work together and separate creation from distribution.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">The four production phases</h2>
          <p className="text-muted text-base leading-relaxed">
            A successful batch system breaks down into four phases: planning, creation, editing, and scheduling [2]. Each
            phase gets its own dedicated time block. The key is that you never mix phases within the same work session [2].
          </p>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li><strong>Planning.</strong> Choose your topics, outline your talking points, and prepare any visual assets. This usually takes sixty to ninety minutes at the start of your batch cycle [2].</li>
            <li><strong>Creation.</strong> Write all your captions or film all your videos in one sitting. The goal here is volume, not perfection. A well-structured recording session can yield enough content for an entire week or even a full month [2].</li>
            <li><strong>Editing.</strong> Review everything you generated and polish it. This phase benefits from overnight distance. If possible, create one day and edit the next so you catch mistakes that felt invisible during creation [2].</li>
            <li><strong>Scheduling.</strong> Upload all your finished pieces to your scheduling tool in one session, write all captions at once, and set publish times across the week [1].</li>
          </ul>
          <p className="text-muted text-base leading-relaxed">
            The separation matters because each phase uses a different cognitive mode [1]. Planning is analytical. Creation is
            generative. Editing is critical. Mixing them in one session is what slows most creators down.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">The weekly batch structure</h2>
          <p className="text-muted text-base leading-relaxed">
            Here is a basic three-day structure that many creators use to batch a full week of content [5]. Monday is for
            planning, Wednesday is for creation, and Friday is for review. The rest of the week stays open for engagement,
            strategy, and the rest of your business.
          </p>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li><strong>Monday: Block and plan.</strong> Choose your content theme for the week. This is one central idea that fuels multiple posts. Outline five to seven angles or formats around that theme, and schedule your batch day later in the week [5].</li>
            <li><strong>Wednesday: Batch everything.</strong> Write three to five posts in one sitting. Film two to three videos. Store everything in one place and schedule your posts for the week or month [5].</li>
            <li><strong>Friday: Review and adjust.</strong> Take one or two old posts that performed well and update them. Track what worked that week and adjust next week's plan accordingly [5].</li>
          </ul>
          <p className="text-muted text-base leading-relaxed">
            Most solo creators spend eight to twelve hours per week running a full batch system that produces twenty to thirty
            pieces of content [2]. As you refine your templates and develop muscle memory, these times decrease. Creators with
            editors or scheduling tools can cut the total to five or six hours.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">How to organize ideas without starting from zero every time</h2>
          <p className="text-muted text-base leading-relaxed">
            The biggest mistake is sitting down to batch with no plan. You spend forty minutes researching instead of
            creating, and the whole session stalls. The fix is a topic bank, which is a running document organized by content
            pillar [2]. Each pillar is a broad theme your audience cares about. Under each pillar you keep a list of
            subtopics.
          </p>
          <p className="text-muted text-base leading-relaxed">
            When you sit down for your planning phase, you pull from the bank instead of brainstorming from zero. Replenish
            the bank once a month by scanning comments, saving questions people ask you, or noting what competitors are
            covering [1]. This way your batch sessions are execution-only. The thinking has already been done.
          </p>
          <p className="text-muted text-base leading-relaxed">
            For a system that produces thirty or more pieces per week, you need three to five content pillars and six to ten
            subtopics under each pillar every month [2]. That gives you a backlog of ideas you can pull from at any time
            without the daily panic of what to post next.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">How to start without burning out</h2>
          <p className="text-muted text-base leading-relaxed">
            Do not try to overhaul your entire workflow overnight. Start with one small batch per week. Aim for five to seven
            pieces of content. Track how long each phase takes and where you get stuck [2]. After the first batch, note what
            worked and what caused friction.
          </p>
          <p className="text-muted text-base leading-relaxed">
            By week three or four you should have a functional system you can scale [2]. Most creators find that batching
            actually reduces burnout instead of causing it. Burnout in content creation usually comes from decision fatigue
            and context switching, not from the volume itself [2]. A batch system addresses both of those problems directly.
          </p>
          <p className="text-muted text-base leading-relaxed">
            The other fix is to protect your non-creation days. If you batch on Tuesday and edit on Wednesday, do not create
            content Thursday through Sunday [2]. Use those days for engagement, strategy, rest, and living your life. The
            system works because it compresses production into focused windows and frees the rest of your week.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What about trends and reactive content</h2>
          <p className="text-muted text-base leading-relaxed">
            Batching works best with evergreen content, which is the tips, tutorials, and educational pieces that do not
            expire. But that does not mean you abandon trending topics. The fix is a hybrid approach: batch your evergreen
            content on your regular schedule and reserve one or two slots per week for reactive, trend-based content that you
            create and publish the same day [2].
          </p>
          <p className="text-muted text-base leading-relaxed">
            Most successful creators follow an eighty-twenty split [2]. Eighty percent batched evergreen content gives you
            consistency and frees your time. Twenty percent real-time trending content keeps you relevant in fast-moving
            conversations. This way you get the efficiency of batching while staying current.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Sources</h2>
          <ol className="list-decimal text-muted text-sm leading-relaxed pl-5 space-y-1">
            <li><a href="https://clickup.com/blog/content-batching/" className="underline hover:no-underline" target="_blank" rel="noopener">ClickUp: Content Batching System</a></li>
            <li><a href="https://www.viralnote.app/blog/how-to-batch-content-creation-system" className="underline hover:no-underline" target="_blank" rel="noopener">ViralNote: Build a Batch Content Creation System</a></li>
            <li><a href="https://buffer.com/resources/content-batching" className="underline hover:no-underline" target="_blank" rel="noopener">Buffer: A Guide to Content Batching for Social Media</a></li>
            <li><a href="https://www.paigebrunton.com/blog/batching-content-tips" className="underline hover:no-underline" target="_blank" rel="noopener">Paige Brunton: How I batch create 4-8 videos and blogs at a time</a></li>
            <li><a href="https://rachelpedersen.com/the-batching-schedule-that-freed-up-20-hours-a-week-in-my-business" className="underline hover:no-underline" target="_blank" rel="noopener">Rachel Pedersen: The Batching Schedule That Freed Up 20 Hours a Week</a></li>
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
          This is a guide to content production workflows, not business or legal advice. Talby helps you run your brand deals.
          It is not a content management system.
        </p>
      </main>
    </div>
  );
}
