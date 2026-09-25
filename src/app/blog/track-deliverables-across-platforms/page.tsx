import Link from "next/link";
import type { Metadata } from "next";
import { TalbyBrand } from "@/components/marketing/talby-brand";
import { RelatedReading } from "@/components/marketing/related-reading";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const CANONICAL = `${SITE}/blog/track-deliverables-across-platforms`;
const TITLE = "How to track content deliverables across Instagram, TikTok, and YouTube";
const META =
  "Track content deliverables across Instagram, TikTok, and YouTube without missing a deadline: what to track and how to keep it in one place.";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: TITLE,
  description: META,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: META,
    url: CANONICAL,
    images: [{ url: `${SITE}/blog-track-overview.png`, width: 934, height: 1858, alt: "Talby Overview showing brand deals and content deliverables in one place" }],
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

export default function TrackDeliverablesPage() {
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
          <span aria-current="page">Track deliverables across platforms</span>
        </nav>

        <h1 className="text-3xl font-semibold tracking-tight">{TITLE}</h1>
        <p className="text-sm text-muted mt-2">Talby · September 24, 2026</p>

        <p className="mt-6 text-muted text-base leading-relaxed">
          You have three brand deals running at once. One needs five TikToks by Friday, another wants weekly Instagram Reels for a month, and the third is waiting on a YouTube integration by the end of the week. You know what you owe. You just do not have a single place that shows you when it is all due. So you check your email, your notes app, your calendar, and the DM thread with the brand manager. By the time you piece it together, you are already behind. This is not a memory problem. It is a tracking problem. This guide covers what happens when content deliverables live in five different places, why that setup fails under pressure, and how to build a system that survives your busiest weeks.
        </p>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What you are actually tracking</h2>
          <p className="text-muted text-base leading-relaxed">
            When you take on a brand deal, you are committing to three separate things that happen at different times and need different kinds of attention.
          </p>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li><strong>The content itself.</strong> How many posts, which platforms, what format. A deliverable checklist is more than a count. It includes file specs, posting windows, and whether the brand needs to approve before you publish [1].</li>
            <li><strong>The deadline.</strong> Not just when the campaign ends, but when drafts are due for review, when revisions are expected, and when final posts need to go live. According to campaign management data, nearly a third of deliverables miss their deadline when tracking is informal [2].</li>
            <li><strong>The approval state.</strong> Whether the brand has seen the draft, whether revisions were requested, and whether you are cleared to post. Most missed deadlines are not because creators forget to make the content. They forget that approval is still pending.</li>
          </ul>
          <p className="text-muted text-base leading-relaxed">
            The honest version is that every deliverable is a small project with dependencies, and your tracking system has to keep all of them visible without requiring you to scan five apps every morning.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Where the workflow breaks down</h2>
          <p className="text-muted text-base leading-relaxed">
            The setup most creators start with is a combination of tools that were never designed to talk to each other. Email threads hold the contract details. A notes app tracks the rough deliverable list. Your calendar has the posting dates. Your camera roll holds drafts that still need captions.
          </p>
          <p className="text-muted text-base leading-relaxed">
            This works when you have one deal at a time. When you have three, the system falls apart for predictable reasons.
          </p>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li>Nothing shows you what is overdue across all deals at once. You have to remember to check each deal separately.</li>
            <li>Platform-specific requirements live in the email thread, so every time you sit down to create, you have to dig through the conversation again to confirm the specs.</li>
            <li>Approval status is a guess. You posted a draft to the brand three days ago. Did they approve it, or are they still reviewing, or did the message get lost.</li>
            <li>Your content calendar does not know about your deals. The calendar shows when you plan to post. It does not track whether that post is a deliverable or whether the brand has approved it yet.</li>
          </ul>
          <p className="text-muted text-base leading-relaxed">
            The collapse is not gradual. It happens in one week when two deals hit their deadline at the same time and you realize you cannot see the full picture without opening six tabs.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Why multi-platform makes it worse</h2>
          <p className="text-muted text-base leading-relaxed">
            A single-platform campaign is simpler to track. You owe five Instagram posts. You make five Instagram posts. You are done. The moment a deal spans TikTok, Instagram, and YouTube, the complexity doubles.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Each platform has different content formats, file requirements, and optimal posting windows [3]. TikTok wants vertical video at a specific resolution. Instagram Reels allow slightly different aspect ratios and caption lengths. YouTube needs a different title structure and thumbnail. If your tracking system does not account for that, you will build the wrong asset or miss a platform entirely.
          </p>
          <p className="text-muted text-base leading-relaxed">
            The scheduling layer is another problem. Research on multi-platform workflows shows that creators often build one anchor piece of content and then adapt it for each channel [4]. That means your deliverable is not one video. It is one video, three reformatted versions, four captions, and a posting schedule that staggers the release across the week so the algorithm does not bury you.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Without a unified view of what you owe and where it lives in production, you end up in reactive mode. You remember TikTok but forget YouTube. You post to Instagram but realize later that the brand wanted approval before it went live, not after.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What successful creators track</h2>
          <p className="text-muted text-base leading-relaxed">
            Full-time creators who manage multiple brand deals without missing deadlines share a common pattern. They do not rely on memory. They do not scan email threads to reconstruct what they owe. They track deliverables in a system that gives them one view of everything that is due this week.
          </p>
          <p className="text-muted text-base leading-relaxed">
            That system includes a few core pieces of information for every deliverable.
          </p>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li><strong>Brand and deal name.</strong> So you know which campaign the deliverable belongs to.</li>
            <li><strong>Platform and format.</strong> TikTok video, Instagram carousel, YouTube Short. The format matters because it changes the production work.</li>
            <li><strong>Deadline and approval window.</strong> Not just the final post date, but when the draft is due to the brand and how much time you need for revisions.</li>
            <li><strong>Status.</strong> Not started, draft ready, submitted for review, approved, posted. This is the column that keeps you from wondering where each piece stands.</li>
            <li><strong>File specs and notes.</strong> Resolution, caption length, required hashtags, mandatory disclosures. Anything that changes how you build the content.</li>
          </ul>
          <p className="text-muted text-base leading-relaxed">
            The pattern that separates a working system from one that quietly stops being useful is simple. If you can open one screen and see everything that is due this week across all your deals, you have a real system. If you have to check three places to get that view, you do not.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">The tools that help</h2>
          <p className="text-muted text-base leading-relaxed">
            A few categories of tools show up in creator workflows. Each solves part of the problem. None of them solve all of it unless they were built for brand deal tracking from the start.
          </p>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li><strong>A content calendar.</strong> Shows you when posts go live. Usually does not track deliverable status, approval state, or which posts are tied to paid deals versus organic content.</li>
            <li><strong>A project management board.</strong> Lets you move cards through stages like "draft," "review," and "done." Works well if you set it up, but the brand deal context lives somewhere else, so you end up maintaining two systems.</li>
            <li><strong>A Notion template.</strong> Flexible and customizable. The setup work is on you, and keeping it accurate when deals change is also on you. Many creators build one and stop updating it after two months [3].</li>
            <li><strong>A spreadsheet.</strong> You can track anything you want. The problem is that scanning rows to figure out what is overdue takes time, and nothing automatically reminds you that a deliverable is due tomorrow.</li>
          </ul>
          <p className="text-muted text-base leading-relaxed">
            The common gap is that these tools treat content tracking and deal tracking as separate problems. Your deliverables are part of a deal. The deal has a payment schedule, a contract, and terms. If your content calendar does not know that, you end up switching between apps to see the full picture.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">How a unified system fixes it</h2>
          <p className="text-muted text-base leading-relaxed">
            A unified system is one where the deal and the deliverables live in the same place. You do not track your content in one tool and your money in another. You do not have to cross-reference your calendar with your email to figure out what is approved and what is still waiting.
          </p>
          <p className="text-muted text-base leading-relaxed">
            This is what that looks like in practice.
          </p>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li>Every deal is one record. The brand, the value, the contract terms, the deliverables list, and the payment schedule are all attached to the same place.</li>
            <li>Deliverables are tasks inside the deal. Each one has a platform, a format, a deadline, and a status. When you mark a deliverable as submitted or approved, the deal page updates automatically.</li>
            <li>The calendar shows deliverables, not just posts. You see which posts are organic and which are part of a paid deal. You see which ones need approval before they go live.</li>
            <li>Overdue deliverables surface automatically. You do not have to scan every deal to find out what you missed. The system tells you.</li>
            <li>When a deliverable is done, it stays connected to the deal. Later, when you want to see how much content you delivered for that brand, or whether they paid you on time, the record is still there.</li>
          </ul>
          <p className="text-muted text-base leading-relaxed">
            The point is not more features. The point is that the structure holds the deal and the content together, so nothing slips through the gap between your calendar and your contract.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What Talby does</h2>
          <p className="text-muted text-base leading-relaxed">
            Talby is built for creators who run paid brand deals. It tracks the deal, the deliverables, and the money in one place.
          </p>
          <p className="text-muted text-base leading-relaxed">
            When you add a deal to Talby, you add the deliverables list at the same time. Each deliverable has a platform, a format, a due date, and a status. The deal page shows you what is done, what is pending approval, and what is overdue.
          </p>
          <p className="text-muted text-base leading-relaxed">
            The calendar view shows every deliverable across all your active deals. You can filter by platform, by week, or by deal. You can see which posts are tied to contracts and which ones are just organic content.
          </p>
          <p className="text-muted text-base leading-relaxed">
            When a payment is due, it shows up on the same calendar as your deliverables. That matters because the two are connected. You delivered the content. The brand owes you. Talby keeps both sides visible so you do not have to track money in one tool and content in another.
          </p>
          <p className="text-muted text-base leading-relaxed">
            On the paid plan, the assistant reads your contracts and answers questions like "what did I promise for the July deal" or "which deliverables are overdue this week." You do not have to dig through files. You ask, and it tells you.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Sources</h2>
          <ol className="list-decimal text-muted text-sm leading-relaxed pl-5 space-y-1">
            <li>
              <a href="https://influenceflow.io/resources/creator-deliverable-checklist-the-complete-guide-for-2026/" className="hover:underline" target="_blank" rel="noopener">
                Creator Deliverable Checklist: The Complete Guide for 2026 (InfluenceFlow)
              </a>
            </li>
            <li>
              <a href="https://kolpod.com/blog/complete-guide-influencer-campaign-management" className="hover:underline" target="_blank" rel="noopener">
                The Complete Guide to Managing Influencer Campaigns in 2026 (KOLPod)
              </a>
            </li>
            <li>
              <a href="https://guid.live/how-to-build-a-creator-content-calendar" className="hover:underline" target="_blank" rel="noopener">
                How to Build a Creator Content Calendar That Works (Guid.Live)
              </a>
            </li>
            <li>
              <a href="https://mysocial.io/blog/time-management-for-influencers/" className="hover:underline" target="_blank" rel="noopener">
                Time Management for Creators: Stop Burnout (MySocial)
              </a>
            </li>
          </ol>
        </section>

                <RelatedReading
          links={[
            { href: "/blog/content-calendar-for-creators", title: "Building a content calendar without burnout" },
            { href: "/blog/content-repurposing-for-creators", title: "Repurposing one piece of content everywhere" },
            { href: "/blog/batching-content-as-a-creator", title: "How to batch content as a solo creator" }
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
