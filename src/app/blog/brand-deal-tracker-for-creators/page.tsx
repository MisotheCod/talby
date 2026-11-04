import Link from "next/link";
import type { Metadata } from "next";
import { TalbyBrand } from "@/components/marketing/talby-brand";
import { RelatedReading } from "@/components/marketing/related-reading";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const CANONICAL = `${SITE}/blog/brand-deal-tracker-for-creators`;
const TITLE = "How to track brand deals: the setup-free system creators actually stick to";
const META = "The setup-free way to track brand deals: what to keep on every deal, why spreadsheets and Notion fall apart, and how a finished command center keeps money and content in one place.";

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
                datePublished: "2026-10-22T00:00:00Z",
                dateModified: "2026-10-22T00:00:00Z",
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
          <span aria-current="page">How to track brand deals: the setup-free system creators actually stick to</span>
        </nav>

        <h1 className="text-3xl font-semibold tracking-tight">{TITLE}</h1>
        <p className="text-sm text-muted mt-2">Talby · 2026-10-22</p>
        <p className="mt-6 text-muted text-base leading-relaxed">
          You land your fifth brand deal of the year, and for the first time you cannot answer the simplest question about your own business: how much is owed to you right now? The contract is in email, the deliverable date is in your head, and the payment terms are in a DM. This is not a discipline problem. It is a tracking problem, and it is the same one every creator hits somewhere between one deal and a real pipeline.
        </p>
        <p className="text-muted text-base leading-relaxed">
          This guide is the tracker setup most creators never get: what to keep on every deal, why the two tools everyone starts with stop working, and what a finished tracker changes.
        </p>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">The five things every brand deal needs</h2>
          <p className="text-muted text-base leading-relaxed">
            Every deal is really five separate facts that arrive at five different times:
          </p>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li><strong>The contract.</strong> The rate, the deliverables, and who owns what when the content goes live.</li>
            <li><strong>The deliverables.</strong> What you promised and when it is due — the reels, the stories, the checklist.</li>
            <li><strong>The invoice.</strong> Whether you have billed, what you billed for, and what the payment terms say.</li>
            <li><strong>The money.</strong> What is expected, what is overdue, and what has actually landed in your account.</li>
            <li><strong>The history.</strong> What each brand paid and the terms you agreed — the only honest source for your next rate card.</li>
          </ul>
          <p className="text-muted text-base leading-relaxed">
            Everything that goes wrong in brand-deal tracking happens because these five facts live in five different places and nothing connects them.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Why the tools everyone starts with fall apart</h2>
          <p className="text-muted text-base leading-relaxed">
            Almost every creator starts with a spreadsheet or a Notion template, because both are free and both are flexible. The flexibility is the problem. A blank canvas holds up only as long as you maintain it by hand, and the moment you miss two weeks, three things break at once: an invoice goes unpaid because nothing flagged it, a deliverable slips because the date lived only in your head, and the totals stop being trustworthy because a row went stale.
          </p>
          <p className="text-muted text-base leading-relaxed">
            The deeper issue is that money and content are two different worlds. A spreadsheet column next to a content calendar is not a connection, it is a hope. When the tool has no native understanding of a brand deal, every reminder has to come from you — and you are the one it is supposed to be helping.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What a finished tracker does instead</h2>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li><strong>One place per deal.</strong> Brand, value, status, due dates, checklist, notes, and the contract all on the deal.</li>
            <li><strong>Money that follows through.</strong> Expected, overdue, and received. Mark a payment received and the totals update immediately.</li>
            <li><strong>A calendar that fills itself.</strong> Post dates land on the right days, repeats populate themselves, and payments show up as chips.</li>
            <li><strong>An easy way in.</strong> Upload the contract or connect Notion to switch over; a spreadsheet imports too.</li>
          </ul>
          <p className="text-muted text-base leading-relaxed">
            The bar is simple: a tracker is working when you can answer "how much am I owed" in five seconds, without opening six tabs.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">The five-minute setup, done honestly</h2>
          <p className="text-muted text-base leading-relaxed">
            If you are mid-year with deals already in flight, do not replay everything. Enter the deals that are currently active, then add each new deal as it lands. Two weeks in, the tool is current, and the old spreadsheet gets archived, not migrated. You are not organizing the past; you are keeping the future from scattering the same way.
          </p>
        </section>

        <RelatedReading
          links={[
            { href: "/blog/track-brand-deals-without-a-spreadsheet", title: "Tracking brand deals without a spreadsheet" },
            { href: "/blog/track-deliverables-across-platforms", title: "Tracking deliverables across platforms" },
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
