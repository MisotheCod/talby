import Link from "next/link";
import type { Metadata } from "next";
import { TalbyBrand } from "@/components/marketing/talby-brand";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const CANONICAL = `${SITE}/blog/content-repurposing-for-creators`;
const TITLE = "How to repurpose one piece of content across multiple platforms";
const META =
  "Turn one shoot into reels, stories, posts, and clips across every platform. Strategic repurposing that saves time without burning you out.";

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

export default function ContentRepurposingPage() {
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
          <span aria-current="page">Content repurposing for creators</span>
        </nav>

        <h1 className="text-3xl font-semibold tracking-tight">{TITLE}</h1>
        <p className="text-sm text-muted mt-2">Talby · September 24, 2026</p>

        <p className="mt-6 text-muted text-base leading-relaxed">
          You spend four hours filming one shoot. You edit it, post it, and move on. By next week you need new content again
          and you are back at square one. Nobody talks about how exhausting it is to create something fresh every single day
          across every platform. Content repurposing is not about posting the same thing everywhere. It is about taking what
          you already made and breaking it into pieces that belong on different platforms. One shoot becomes reels, stories,
          carousels, and clips without filming again. This guide shows you how.
        </p>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Why video is worth repurposing</h2>
          <p className="text-muted text-base leading-relaxed">
            Video contains everything at once. Audio, visuals, spoken words, and on-screen moments. Every other format is a
            subset of video [1]. Pull the audio and you have a clip for stories. Transcribe it and you have captions for a
            carousel. Screenshot a frame and you have a static post. One ten-minute video can yield six to twelve short clips
            and another handful of static posts [2].
          </p>
          <p className="text-muted text-base leading-relaxed">
            Text becomes more text. Images stay images. Video breaks apart into nearly every content type that exists. That is
            why most creators who repurpose at scale start with one anchor video and work backward.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What makes a good source video</h2>
          <p className="text-muted text-base leading-relaxed">
            Not every video is worth the effort. The best source videos have clear sections you can pull apart [3]. Three or
            more talking points, at least one surprising moment, and topics that stay relevant beyond this week. If you can
            list five standalone moments from the video then it works.
          </p>
          <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5">
            <li><strong>Tutorials and how-tos.</strong> People rewatch steps, which means clips stay evergreen.</li>
            <li><strong>Interviews and conversations.</strong> Natural breaks between topics give you clean cut points.</li>
            <li><strong>Behind the scenes or process content.</strong> High engagement on short clips showing how something gets made.</li>
            <li><strong>Stories with a clear setup and payoff.</strong> These travel well across platforms when trimmed tight.</li>
          </ul>
          <p className="text-muted text-base leading-relaxed">
            The videos that work least are one continuous thought with no pauses, heavy visual context that does not translate
            to vertical, or audio quality so poor that captions cannot save it.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">How to pull clips without wasting time</h2>
          <p className="text-muted text-base leading-relaxed">
            Opening an editor and randomly cutting is how you end up with clips that go nowhere. Build a clip map first [4].
            Watch the video once and note every moment that could stand alone. For each one, write down the timestamp, what
            type of moment it is, what the hook angle could be, and which platform it fits.
          </p>
          <p className="text-muted text-base leading-relaxed">
            A clip map turns repurposing into a production line. You know exactly what you are cutting and why. A mistake
            moment becomes a short clip with a "you are doing this wrong" hook for TikTok. A three-step framework becomes
            a LinkedIn post and a carousel. A story becomes a Reel with a setup and payoff.
          </p>
          <p className="text-muted text-base leading-relaxed">
            When you cut the clips, start with the payoff in the first two seconds. No intros. One clip is one clear point [2].
            If the viewer needs context from earlier in the video then the clip does not work on its own. Add captions burned
            into the video. Most people watch content without sound and captioned videos finish at higher rates [3].
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Adapting clips for each platform</h2>
          <p className="text-muted text-base leading-relaxed">
            Posting the same clip everywhere with the same caption is not repurposing. Each platform rewards different pacing
            and framing [4]. TikTok wants fast cuts and the hook in the first half second. Instagram Reels gives you two to
            three seconds to land the hook and the cover image matters for grid view. YouTube Shorts cares about the title
            almost as much as the first frame. LinkedIn wants a strong opinion up front and a line about how to apply it.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Keep the same core message but rewrite the framing and CTA for where it is going. The same thirty-second clip
            performs differently depending on whether you package it as a quick tip, a mistake to avoid, or the start of a
            thread. Platform-native content always outperforms generic cross-posts [5].
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Beyond clips: static posts and carousels</h2>
          <p className="text-muted text-base leading-relaxed">
            Once you have clips, pull the transcript and look for quotable lines. One strong sentence becomes a quote graphic.
            Three to five key points become a carousel. Each main takeaway can be rewritten as a short text post for LinkedIn
            or a thread starter [3].
          </p>
          <p className="text-muted text-base leading-relaxed">
            Carousels work because they turn one idea into a save-worthy format people revisit. Start with a hook slide, add
            one point per slide, close with a simple CTA. These often get more engagement than the source video did [1].
          </p>
          <p className="text-muted text-base leading-relaxed">
            The honest version is that you already did the hard work when you recorded the video. Repurposing is not creating
            from scratch. It is unpacking what already exists and reshaping it for the places your audience hangs out.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">A weekly plan that works</h2>
          <p className="text-muted text-base leading-relaxed">
            One filmed video per week is enough if you repurpose it right. Day one, post the full video on your primary
            platform and one teaser clip on Reels or TikTok. Day two, post a quick-win clip showing a single tip. Day three,
            share a carousel summarizing the key points. Day four, share a story or mistake clip. Day five, post a myth-busting
            or contrarian take. Space the rest out over the following week [4].
          </p>
          <p className="text-muted text-base leading-relaxed">
            This is how you turn one shoot into two weeks of consistent content. Most creators burn out because they treat
            every post as a new idea. Repurposing treats every idea as a system. You film once and distribute everywhere,
            adjusted for how each platform works. That is the difference between staying consistent and giving up by March.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Sources</h2>
          <ol className="list-decimal text-muted text-sm leading-relaxed pl-5 space-y-1.5">
            <li>
              <a href="https://buffer.com/resources/repurposing-content-guide/" className="hover:underline" target="_blank" rel="noopener">
                Buffer - The Complete Guide to Content Repurposing
              </a>
            </li>
            <li>
              <a href="https://sydium.com/blog/how-to-repurpose-video-content" className="hover:underline" target="_blank" rel="noopener">
                Sydium - How to Repurpose Video Content Across Every Platform
              </a>
            </li>
            <li>
              <a href="https://postquick.ai/blog/repurpose-video-content" className="hover:underline" target="_blank" rel="noopener">
                PostQuickAI - Repurpose Video Content: Complete Guide for 2026
              </a>
            </li>
            <li>
              <a href="https://clipscartel.com/blog/repurpose-video-content-2026" className="hover:underline" target="_blank" rel="noopener">
                ClipsCartel - How to Repurpose Video Content for Maximum Views in 2026
              </a>
            </li>
            <li>
              <a href="https://www.contentful.com/blog/repurposing-content/" className="hover:underline" target="_blank" rel="noopener">
                Contentful - Increase consistency and reach with a content repurposing strategy
              </a>
            </li>
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
          This is a guide to content creation workflows, not legal or business advice. Talby helps you run your brand deals. It is not a
          content production agency.
        </p>
      </main>
    </div>
  );
}
