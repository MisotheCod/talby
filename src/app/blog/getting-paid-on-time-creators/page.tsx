import Link from "next/link";
import type { Metadata } from "next";
import { TalbyBrand } from "@/components/marketing/talby-brand";
import { RelatedReading } from "@/components/marketing/related-reading";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const CANONICAL = `${SITE}/blog/getting-paid-on-time-creators`;
const TITLE = "How creators get paid on time without the chase";
const META =
  "How creators get paid on time: what to put in invoices, when to send them, how to set terms that stick, and what to do when a payment runs late.";

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

export default function GettingPaidOnTimeCreatorsPage() {
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
          <span aria-current="page">Getting paid on time</span>
        </nav>

        <h1 className="text-3xl font-semibold tracking-tight">{TITLE}</h1>
        <p className="text-sm text-muted mt-2">Talby · September 24, 2026</p>

        <p className="mt-6 text-muted text-base leading-relaxed">
          You finish a brand deal. Content is live, the client is happy, and you send the invoice. Then you wait. Three weeks pass, no payment. You follow up. Radio silence. Now you are chasing, awkwardly asking when you can expect money for work you already did. None of this should feel like the hard part, but for solo creators it often is. Getting paid on time is not about luck or brand goodwill. It is about clear terms, tight invoicing habits, and knowing when to push back before a late payment becomes a pattern.
        </p>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What goes in an invoice that gets paid</h2>
          <p className="text-muted text-base leading-relaxed">
            An invoice is not a receipt. It is a formal request for payment that tells a brand exactly what they owe, when, and how to send it. If anything is unclear or missing, it lands in a queue while someone figures out what to do with it [1]. Every extra back-and-forth is another week you are not paid.
          </p>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li><strong>Your legal name or business name.</strong> It must match the name on your bank account or they cannot process the payment.</li>
            <li><strong>Invoice number and date.</strong> The number helps them track it. The date starts the clock on your payment terms. Without it, net 30 means nothing.</li>
            <li><strong>Payment due date.</strong> Spell it out as a calendar date, not just net 30, so no one has to calculate it.</li>
            <li><strong>What you delivered.</strong> List each item you billed for with a short description, so they know what this invoice covers.</li>
            <li><strong>Payment instructions.</strong> Your bank details, PayPal address, or Venmo handle. Do not assume they know how you want to be paid [2].</li>
          </ul>
          <p className="text-muted text-base leading-relaxed">
            You can use a template from Word or Google Docs, or a tool like Stripe Invoicing that sends, tracks, and reminds for you [1]. The point is that the invoice is complete the first time it arrives in their inbox. If they have to email you to ask for your routing number or clarify what the line item is, you just added a week.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">When to send it and when to expect payment</h2>
          <p className="text-muted text-base leading-relaxed">
            Send the invoice the moment the work is complete. Do not wait until the end of the week or when you get around to it [3]. Payment terms start when the invoice hits their inbox, not when you delivered the content. If you wait two weeks to invoice, you manufactured a two-week delay for no reason.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Most brand deals are paid on net 30 terms, which means payment is due 30 calendar days from the invoice date [4]. Larger brands sometimes default to net 45 or net 60 because their accounts payable runs on that cycle. This is fine to know ahead of time, but not after the fact. If your contract does not say, assume net 30 and state it clearly on the invoice.
          </p>
          <p className="text-muted text-base leading-relaxed">
            For new brands or larger deals, a 50 percent deposit at signing is a common structure [2]. It protects you from doing the work and then waiting months while a payment drags. It also filters out brands that were never going to pay reliably. A brand that resists a modest deposit is telling you something before you have filmed anything.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">How to follow up when payment is late</h2>
          <p className="text-muted text-base leading-relaxed">
            Late payments happen. Most are not malicious, just slow. But you cannot assume someone else is tracking it for you. You have to follow up, and you have to do it on a schedule that works whether or not you feel like it [4].
          </p>
          <p className="text-muted text-base leading-relaxed">
            Five days before the due date, send a friendly reminder. Keep it short: just flagging that the invoice is due soon and confirming they received it. This is not rude. Most brands appreciate the reminder because it gives them time to flag issues before the deadline [5].
          </p>
          <p className="text-muted text-base leading-relaxed">
            One day after the due date, send a follow-up. Acknowledge it is overdue and ask for a timeline. No apologies, no passive wording. You did the work, they agreed to pay you, and the date passed. After 15 days overdue, escalate the tone [4]. Reference any late fee in your contract, and ask for a specific date or the contact in their accounting department. After 30 days overdue, escalate to someone senior. If you have been emailing the marketing manager, this is when you loop in the business owner or the CMO.
          </p>
          <p className="text-muted text-base leading-relaxed">
            All of this only works if you are tracking which invoices are outstanding. A spreadsheet can do this, but you have to update it every time. Talby surfaces overdue invoices automatically, so you see what is unpaid right next to the deal it belongs to.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What to put in contracts before you start</h2>
          <p className="text-muted text-base leading-relaxed">
            Following up on a late payment is easier if your contract already says what happens when payment is late. If it does not, you have no leverage [3]. Most creators skip this part because they do not want to sound difficult before the deal starts. The reality is that brands expect it, and skipping it only hurts you.
          </p>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li><strong>Payment terms.</strong> When payment is due, how much is due, and how you will be paid. If you want 50 percent upfront, say so here. If you expect net 30 from the invoice date, spell it out.</li>
            <li><strong>Late fees.</strong> A small percentage per month overdue, like 1.5 percent, is standard [3]. Most brands will never pay it, but knowing it exists changes how they prioritize your invoice.</li>
            <li><strong>Who to invoice.</strong> Confirm upfront who should receive the invoice. It is often not the person you negotiated with. Get the accounts payable contact before the work starts [5].</li>
          </ul>
          <p className="text-muted text-base leading-relaxed">
            None of this is aggressive. It is normal business practice for anyone working as an independent contractor. Brands that push back on standard payment terms are showing you how they will treat you later.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">How Talby keeps track of what is owed</h2>
          <p className="text-muted text-base leading-relaxed">
            You do not need another app to manage invoicing, but you do need a place where unpaid invoices do not quietly age in the background. Talby connects each payment to the deal it belongs to, tracks due dates automatically, and surfaces what is overdue without you having to scan a spreadsheet.
          </p>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li>Every deal shows expected, overdue, and received payments in one place. Mark a payment received and your totals update live.</li>
            <li>Overdue invoices show up on your overview, so nothing slips past the due date without you noticing.</li>
            <li>Payment dates drop onto your calendar automatically. You see what is coming in and when, so you can plan cash flow without doing the math yourself.</li>
            <li>On the paid plan, the assistant can tell you which invoices are outstanding, when they were sent, and which brands are late.</li>
          </ul>
          <p className="text-muted text-base leading-relaxed">
            The whole structure is designed so that you do not have to remember to track payments. The tool does that part for you. You just update it when something changes.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Sources</h2>
          <ol className="list-decimal text-muted text-sm leading-relaxed pl-5 space-y-1">
            <li>Stripe: <a href="https://stripe.com/resources/more/how-to-invoice-for-influencers-and-content-creators" className="underline hover:no-underline" target="_blank" rel="noopener">How content creator and influencer invoicing works</a></li>
            <li>Tailwind: <a href="https://www.tailwindapp.com/blog/the-ultimate-guide-to-invoicing-for-influencers-and-content-creators" className="underline hover:no-underline" target="_blank" rel="noopener">The Ultimate Guide to Invoicing for Influencers and Content Creators</a></li>
            <li>Kate Cooper Law: <a href="https://katecooperlaw.com/prevent-late-payments-as-an-influencer/" className="underline hover:no-underline" target="_blank" rel="noopener">7 Tips to Prevent Late Payments as an Influencer or Content Creator</a></li>
            <li>Paperclip: <a href="https://papercliphq.com/blog/how-to-invoice-brands-as-a-content-creator" className="underline hover:no-underline" target="_blank" rel="noopener">How to Invoice Brands as a Content Creator in 2026</a></li>
            <li>The Tilt: <a href="https://www.thetilt.com/revenue/overdue-invoice-advice" className="underline hover:no-underline" target="_blank" rel="noopener">How Creators Can Get Overdue Invoices Paid</a></li>
          </ol>
        </section>

                <RelatedReading
          links={[
            { href: "/blog/how-to-price-sponsored-content", title: "How to price sponsored content" },
            { href: "/blog/reporting-metrics-to-brands", title: "Metrics that get you repeat deals" },
            { href: "/blog/track-deliverables-across-platforms", title: "Tracking deliverables across platforms" }
          ]}
        />

        <section className="mt-8 max-w-md mx-auto bg-card border border-line rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold tracking-tight">Start for free</h2>
          <p className="text-muted text-sm mt-3 leading-relaxed">
            Talby is free up to five active deals. If you have fewer than that right now, it stays free. When you pass five, it means business is good, and a paid plan removes the cap and adds the assistant.
          </p>
          <Link
            href="/signup"
            className="accent-fill text-sm font-semibold px-5 h-10 inline-flex items-center justify-center rounded-lg mt-4 w-full"
          >
            Start free on talby.io
          </Link>
        </section>

        <p className="mt-10 text-xs text-muted">
          This is a guide to getting paid as a creator, not legal or tax advice. Talby helps you run your brand deals. It is not an accountant or a lawyer.
        </p>
      </main>
    </div>
  );
}
