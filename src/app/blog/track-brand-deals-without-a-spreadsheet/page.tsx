import Link from "next/link";
import type { Metadata } from "next";
import { TalbyBrand } from "@/components/marketing/talby-brand";
import { RelatedReading } from "@/components/marketing/related-reading";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const CANONICAL = `${SITE}/blog/track-brand-deals-without-a-spreadsheet`;
const TITLE = "How to track brand deals without a spreadsheet";
const META =
  "Track brand deals without a spreadsheet: what to keep, why the sheet dies, and how creators go from Notion chaos to a running command center.";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: TITLE,
  description: META,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: META,
    url: CANONICAL,
    // Real product screenshot of the Overview screen: booked, paid, and
    // outstanding across active deals.
    images: [{ url: `${SITE}/blog-track-overview.png`, width: 934, height: 1858, alt: "Talby Overview: booked, paid, and outstanding across active brand deals" }],
    siteName: "Talby",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: META,
    images: [`${SITE}/blog-track-overview.png`],
  },
};

export default function TrackBrandDealsPage() {
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
                image: `${SITE}/blog-track-overview.png`,
                mainEntityOfPage: CANONICAL,
                datePublished: "2026-09-21T00:00:00Z",
                dateModified: "2026-09-21T00:00:00Z",
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
          <span aria-current="page">Brand deals without a spreadsheet</span>
        </nav>

        <h1 className="text-3xl font-semibold tracking-tight">{TITLE}</h1>
        <p className="text-sm text-muted mt-2">Talby · September 21, 2026</p>

        <p className="mt-6 text-muted text-base leading-relaxed">
          You start the year with a clean spreadsheet. Every brand, every rate, every due date, all in one tab. By March it is
          already a little out of date. By summer you are updating it the night before a call, and you are not even sure the numbers
          are right. You do not have a tracking problem. You have a spreadsheet problem. Plenty of creators run years of paid brand
          work on one, and plenty quietly stop updating it. This guide covers what you actually need to track, why the sheet keeps
          failing, and what a finished tool changes.
        </p>

        <img
          src="/blog-track-overview.png"
          alt="Talby Overview showing $101,950 booked, $33,000 paid, and $67,450 outstanding across active deals"
          width={934}
          height={1858}
          className="w-full max-w-sm mx-auto block bg-card rounded-xl my-8"
        />

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What you actually need to track</h2>
          <p className="text-muted text-base leading-relaxed">
            A brand deal is four different things that happen at four different times. Keeping them straight is the entire job.
          </p>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li><strong>Pipeline.</strong> Who is being pitched, which brands said yes, and which deals are still in conversation. This is where you decide what to say yes to next.</li>
            <li><strong>Deliverables.</strong> What you promised and when it is due. The post, the story, the deliverables list, and the deadline.</li>
            <li><strong>Invoicing.</strong> Whether you have billed, how many ways the money is owed, and when it is expected. This is the part that usually slips.</li>
            <li><strong>Rate history.</strong> What each brand paid you and the terms you agreed. Your next rate card is built from this, not from memory.</li>
          </ul>
          <p className="text-muted text-base leading-relaxed">
            The honest version is that you are tracking money and time, and the medium you use has to survive being ignored for a week.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Why a spreadsheet stops working</h2>
          <p className="text-muted text-base leading-relaxed">
            A spreadsheet is a blank canvas. That is its strength and its weakness. Every system you built on it is held up by one thing:
            you remembering to open it. The moment you miss two weeks, three things go wrong at once.
          </p>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li>There is no place that tells you what is overdue. You have to scan every row every time.</li>
            <li>Money and content live in different tabs or different files, so nothing reminds you that a deliverable is due and the invoice is not paid.</li>
            <li>Recurring posts mean typing the same row over and over, which you stop doing.</li>
            <li>Nothing checks your work. A wrong number looks exactly like a right one.</li>
          </ul>
          <p className="text-muted text-base leading-relaxed">
            None of this is a discipline failure. A tool that needs you to maintain the tool is not a tool, it is a second job.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">The alternatives, honestly</h2>
          <p className="text-muted text-base leading-relaxed">
            Three directions are popular. Each works, and each has a real tradeoff.
          </p>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li><strong>A Notion template.</strong> You buy or build a system, then you maintain it. Flexible, but the building and the maintaining are on you, and the money stuff is still a table you have to remember to update.</li>
            <li><strong>A deal tracker or CRM.</strong> Great at moving a deal through stages. Most stop at "closed." They do not follow the invoice out the door, and they are not built for content.</li>
            <li><strong>A small business tool.</strong> Invoice and bookkeeping tools are solid at money. They do not know your brand deals or your content calendar, so the business side and the posting side stay split.</li>
          </ul>
          <p className="text-muted text-base leading-relaxed">
            The common gap is the same one the spreadsheet has: it asks you to keep two worlds connected by hand.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">How a command center fixes it</h2>
          <p className="text-muted text-base leading-relaxed">
            A command center is the opposite of a blank canvas. The structure is already built, and it holds the deal, the money, and the
            content together. You add what is true and it keeps the rest current.
          </p>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li>Every deal is one place: brand, value, status, due date, deliverables, checklist, and notes.</li>
            <li>Money follows all the way through: expected, overdue, and received. Mark a payment received and your totals update live.</li>
            <li>The calendar fills itself in. Set a weekly post once and it repeats. Drag it to reschedule. Payments show up as chips on the right day.</li>
            <li>Bring your existing deals over. Drop in a spreadsheet or connect Notion and Talby reads your columns for you.</li>
            <li>On the paid plan, an assistant answers questions from your own data, like how much you are owed or what a contract clause says.</li>
          </ul>
          <p className="text-muted text-base leading-relaxed">
            The point is not more features. The point is that nothing waits for you to remember it.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">How they compare</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-line">
                <th className="text-left py-2 px-3 text-muted">What it is</th>
                <th className="text-left py-2 px-3 text-muted">Money tracking</th>
                <th className="text-left py-2 px-3 text-muted">Content calendar</th>
                <th className="text-left py-2 px-3 text-muted">Setup</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line">
                <td className="py-2 px-3">Notion template</td>
                <td className="py-2 px-3">You maintain it by hand</td>
                <td className="py-2 px-3">You build it yourself</td>
                <td className="py-2 px-3">Build first, then use it</td>
              </tr>
              <tr className="border-b border-line">
                <td className="py-2 px-3">Spreadsheet</td>
                <td className="py-2 px-3">A table you have to scan</td>
                <td className="py-2 px-3">Not connected</td>
                <td className="py-2 px-3">Free, but maintained by hand</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">Talby</td>
                <td className="py-2 px-3">Expected, overdue, received</td>
                <td className="py-2 px-3">Repeats fill themselves in</td>
                <td className="py-2 px-3">Finished. Add a deal and go</td>
              </tr>
            </tbody>
          </table>
        </section>

                <RelatedReading
          links={[
            { href: "/blog/how-to-price-sponsored-content", title: "How to price sponsored content" },
            { href: "/blog/track-deliverables-across-platforms", title: "Tracking deliverables across platforms" },
            { href: "/blog/getting-paid-on-time-creators", title: "How creators get paid on time" }
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
          This is a guide to tracking creative work, not legal or tax advice. Talby helps you run your brand deals. It is not an
          accountant.
        </p>
      </main>
    </div>
  );
}