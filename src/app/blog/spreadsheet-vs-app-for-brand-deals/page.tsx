import Link from "next/link";
import type { Metadata } from "next";
import { TalbyBrand } from "@/components/marketing/talby-brand";
import { RelatedReading } from "@/components/marketing/related-reading";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const CANONICAL = `${SITE}/blog/spreadsheet-vs-app-for-brand-deals`;
const TITLE = "Spreadsheet vs. app for brand deals: why the sheet falls apart at 10 deals";
const META = "Spreadsheet vs. app for tracking brand deals: where the sheet actually breaks (payments, repeats, overdue), and what changes when you move to a finished tracker.";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: TITLE,
  description: META,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: META,
    url: CANONICAL,
    images: [{ url: `${SITE}/og.png`, width: 1200, height: 630, alt: TITLE }],
    siteName: "Talby",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    images: [`${SITE}/og.png`],
    title: TITLE,
    description: META,
  },
};

export default function Page() {
  return (
    <div className="flex-1 flex flex-col">
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
                image: `${SITE}/og.png`,
                mainEntityOfPage: CANONICAL,
                datePublished: "2026-10-24T00:00:00Z",
                dateModified: "2026-10-24T00:00:00Z",
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
          <span aria-current="page">Spreadsheet vs. app for brand deals: why the sheet falls apart at 10 deals</span>
        </nav>

        <h1 className="text-3xl font-semibold tracking-tight">{TITLE}</h1>
        <p className="text-sm text-muted mt-2">Talby · 2026-10-24</p>
        <p className="mt-6 text-muted text-base leading-relaxed">
          A spreadsheet is the right tool for brand-deal tracking until the moment it is not, and that moment is more predictable than people think. Here is the honest version of where a sheet keeps working and where it quietly starts costing you money.
        </p>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Where the spreadsheet is genuinely fine</h2>
          <p className="text-muted text-base leading-relaxed">
            If you do a few sponsored posts a year, a sheet is fine. A brand column, a rate column, a date column, and a note about when you invoiced. It works because the volume is low and the whole business fits on one screen. The sheet is not the problem yet; the volume is.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">The three specific ways it breaks</h2>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li><strong>Payments stop being visible.</strong> Nothing in a spreadsheet tells you a payment is late. You have to scan every row and notice that a date passed. The most expensive step in the whole workflow is the one the tool leaves entirely to you.</li>
            <li><strong>Repeating work never happens.</strong> A weekly post means typing the same row every week, which you eventually stop doing, and then the calendar is a lie.</li>
            <li><strong>Money and content stay disconnected.</strong> The invoice lives in one tab, the deliverable in another, so the two facts that need each other — "the reel is due Friday" and "the invoice is unpaid" — never appear together.</li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">The real cost of the broken sheet</h2>
          <p className="text-muted text-base leading-relaxed">
            The cost is not the spreadsheet, it is the delays it hides. A payment that is two weeks late because nothing flagged it, a retainer that quietly stops renewing, a deliverable that ships a day after the deadline because the date lived in memory. At ten active deals, these start happening monthly, and they add up to more than the price of any tool.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What changes with a dedicated tracker</h2>
          <p className="text-muted text-base leading-relaxed">
            The difference is that reminders come from the data instead of from you. Payment dates appear on the calendar, overdue items are flagged automatically, repeat posts populate themselves, and marking a payment received updates your totals instantly. You stop maintaining the tracker and start actually using it — which is the entire point. And when you have a sheet full of history, most trackers let you import it, so the switch is an afternoon, not a migration.
          </p>
        </section>

        <RelatedReading
          links={[
            { href: "/blog/brand-deal-tracker-for-creators", title: "How to track brand deals (the setup-free way)" },
            { href: "/blog/notion-for-creator-brand-deals", title: "Notion for creator brand deals" },
            { href: "/blog/getting-paid-on-time-creators", title: "How creators get paid on time" },
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
          This is a guide to running creative work, not legal or tax advice. Talby helps you run your brand deals. It is not an accountant.
        </p>
      </main>
    </div>
  );
}
