import Link from "next/link";
import type { Metadata } from "next";
import { TalbyBrand } from "@/components/marketing/talby-brand";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Blog",
  description: "Practical guides for creators who run brand deals: tracking, money, contracts, and content.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Talby Blog",
    description: "Practical guides for creators who run brand deals.",
    siteName: "Talby",
    type: "website",
  },
};

const POSTS: { href: string; title: string; desc: string; date: string }[] = [
  {
    href: "/blog/how-to-pitch-brands",
    title: "How to pitch brands as a smaller creator and land your first sponsored deal",
    desc: "What to have ready before you email any brand, what not to waste time on, and the pitch structure that gets a reply.",
    date: "September 24, 2026",
  },
  {
    href: "/blog/how-to-price-sponsored-content",
    title: "How to price sponsored content and find your rate as a creator",
    desc: "A clear method for pricing sponsored posts, from engagement math to platform benchmarks, so you quote with confidence.",
    date: "September 24, 2026",
  },
  {
    href: "/blog/negotiating-with-brands",
    title: "How to negotiate brand deals the right way",
    desc: "Rates, usage rights, deliverable scope, kill fees, and knowing when walking away protects you more than any counteroffer.",
    date: "September 24, 2026",
  },
  {
    href: "/blog/brand-deal-contract-clauses",
    title: "The brand deal contract clauses that actually matter",
    desc: "Exclusivity, usage rights, payment terms, and kill fees, explained so you know what you are signing before you sign it.",
    date: "September 24, 2026",
  },
  {
    href: "/blog/getting-paid-on-time-creators",
    title: "How creators get paid on time without the chase",
    desc: "What goes in an invoice that gets paid, when to send it, and the follow-up process for late payments.",
    date: "September 24, 2026",
  },
  {
    href: "/blog/track-deliverables-across-platforms",
    title: "How to track content deliverables across Instagram, TikTok, and YouTube",
    desc: "Keep every platform deadline in one place so a sponsor post never slips, and you always know what is actually due.",
    date: "September 24, 2026",
  },
  {
    href: "/blog/content-calendar-for-creators",
    title: "Building a content calendar that does not burn you out",
    desc: "Plan a posting schedule you can actually keep: batch the work, theme your weeks, and stop starting from zero every day.",
    date: "September 24, 2026",
  },
  {
    href: "/blog/batching-content-as-a-creator",
    title: "How to batch content as a solo creator",
    desc: "A weekly batch workflow that turns scattered daily posting into focused production days, without losing spontaneity.",
    date: "September 24, 2026",
  },
  {
    href: "/blog/content-repurposing-for-creators",
    title: "How to repurpose one piece of content across multiple platforms",
    desc: "Turn one shoot into reels, stories, posts, and clips everywhere, so one good idea carries your whole week.",
    date: "September 24, 2026",
  },
  {
    href: "/blog/ugc-vs-branded-content",
    title: "UGC vs branded content: which one to make and how each is priced",
    desc: "The real difference between user-generated and branded content, when to make each, and how their pricing works.",
    date: "September 24, 2026",
  },
  {
    href: "/blog/build-a-creator-media-kit",
    title: "Build a creator media kit that gets you hired by brands",
    desc: "What brands actually look for in a media kit, and how to put together one that moves you from scrolled past to emailed back.",
    date: "September 24, 2026",
  },
  {
    href: "/blog/reporting-metrics-to-brands",
    title: "The performance metrics that get you repeat brand deals",
    desc: "What to report after a campaign, why proving your numbers well earns you the next deal, and how to gather it without the hassle.",
    date: "September 24, 2026",
  },
  {
    href: "/blog/track-brand-deals-without-a-spreadsheet",
    title: "How to track brand deals without a spreadsheet",
    desc: "What you actually need to track, why the sheet keeps failing, and how a command center keeps the deal, the money, and the content together.",
    date: "September 21, 2026",
  },
];

export default function BlogIndexPage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between max-w-3xl mx-auto w-full">
        <TalbyBrand />
        <Link href="/signup" className="text-sm font-semibold px-4 h-9 inline-flex items-center rounded-lg accent-fill">Free to start</Link>
      </header>
      <main className="px-6 py-10 max-w-3xl mx-auto w-full flex-1">
        <h1 className="text-3xl font-semibold tracking-tight">Talby Blog</h1>
        <p className="text-muted text-base mt-4">Notes for creators who run brand deals. No hype, just the practical stuff.</p>

        <div className="mt-8 space-y-4">
          {POSTS.map((p) => (
            <article key={p.href} className="bg-card border border-line rounded-xl p-6">
              <h2 className="text-lg font-semibold tracking-tight">
                <Link href={p.href} className="hover:underline">
                  {p.title}
                </Link>
              </h2>
              <p className="text-sm text-muted mt-2 leading-relaxed">{p.desc}</p>
              <p className="text-xs text-muted mt-3">{p.date}</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}