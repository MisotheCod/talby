import Link from "next/link";
import type { Metadata } from "next";
import { TalbyBrand } from "@/components/marketing/talby-brand";
import { RelatedReading } from "@/components/marketing/related-reading";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const CANONICAL = `${SITE}/blog/notion-for-creator-brand-deals`;
const TITLE = "Notion for creator brand deals: when it works and when it eats your week";
const META = "Notion templates for tracking brand deals: what they genuinely do well, the two ways they fall apart (maintenance and disconnected money), and when a finished tool beats the template.";

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
                datePublished: "2026-10-26T00:00:00Z",
                dateModified: "2026-10-26T00:00:00Z",
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
          <span aria-current="page">Notion for creator brand deals: when it works and when it eats your week</span>
        </nav>

        <h1 className="text-3xl font-semibold tracking-tight">{TITLE}</h1>
        <p className="text-sm text-muted mt-2">Talby · 2026-10-26</p>
        <p className="mt-6 text-muted text-base leading-relaxed">
          Notion is the most popular way creators track brand deals after the spreadsheet, and for good reason: a good template looks like a finished product, and you can bend it to exactly how you work. The question that never gets answered honestly is what the template costs to keep working. Here is the balanced version.
        </p>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What Notion genuinely does well</h2>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li><strong>One place for the business.</strong> Deals, content plans, rates, and notes can live in one workspace, which is better than five scattered apps.</li>
            <li><strong>Flexibility without a codebase.</strong> You can add a property, a view, or a linked database in minutes, and creators who like building usually enjoy it.</li>
            <li><strong>A template market.</strong> Someone has already made a tracker for your exact niche, so the starting point is decent.</li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Where templates fall apart</h2>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li><strong>The template is a file, not a system.</strong> Nothing in Notion knows a brand deal is a real thing, so nothing reminds you when an invoice is late or a deliverable is due. You are the only trigger, same as the spreadsheet.</li>
            <li><strong>Maintenance becomes the second job.</strong> Every new property, every stale rollup, every broken relation is yours to fix. The template you bought is a project you now own.</li>
            <li><strong>Money is still a table.</strong> Payment terms and payment status are columns you update by hand, and the totals only mean something if you remember to maintain them.</li>
            <li><strong>Content and money never connect.</strong> Your posting calendar is one database, your invoices another, and nothing puts "reel due Friday" next to "invoice unpaid."</li>
          </ul>
          <p className="text-muted text-base leading-relaxed">
            The honest summary: Notion wins at structure, loses at reminders, and the reminders are the part that makes or breaks getting paid.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">When the template is the right call</h2>
          <p className="text-muted text-base leading-relaxed">
            If you genuinely enjoy building and maintaining your workspace, and you have fewer than ten active deals, a Notion template can absolutely work. The maintenance is part of the appeal for some people. Keep it. The problems only start when the maintenance stops feeling optional.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What a finished tracker adds</h2>
          <p className="text-muted text-base leading-relaxed">
            Switching to a dedicated tracker does not mean losing the Notion structure — most of them import your existing deals directly. What you gain is the piece Notion cannot do: the system tracks you back. Due dates appear on a calendar, late payments get flagged, repeats populate themselves, and totals update when you mark a payment received. You get the finished structure of a great template plus the reminders — without the maintenance being your job.
          </p>
        </section>

        <RelatedReading
          links={[
            { href: "/blog/brand-deal-tracker-for-creators", title: "How to track brand deals (the setup-free way)" },
            { href: "/blog/spreadsheet-vs-app-for-brand-deals", title: "Spreadsheet vs. app for brand deals" },
            { href: "/blog/track-brand-deals-without-a-spreadsheet", title: "Tracking brand deals without a spreadsheet" },
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
