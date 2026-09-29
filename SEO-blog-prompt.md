You are building the first SEO blog page for Talby (www.talby.io), a brand-deal
command center for content creators. You are working for Cam, the founder. This
is a SELF-CONTAINED task — you have no prior context, so everything you need is
here. Deliver real, shippable work, then verify it.

## THE PRODUCT
Talby is a web app for solo creators who do paid brand partnerships (no manager,
no agency). It replaces spreadsheet/Notion chaos with: a clean deal list (brand,
value, status, due date), a payments view (expected / overdue / landed), a content
calendar (recurring posts that auto-fill, drag-to-reschedule, payments as chips),
an AI contract-import (upload a contract, it fills the deal), and an AI assistant
(on paid plan) that answers questions from the user's own data. Free up to 5
active deals; $20/mo removes the cap (Unlimited, includes the assistant).

## VOICE (both strictly enforced, from Talby's brand tokens)
- Calm, plain-spoken, quietly competent. Opposite of a hustle app.
- Short sentences. Plain words over jargon. Second person when addressing the reader.
- NEVER use emojis. NEVER use em dashes or en dashes (hyphen only if needed).
- NEVER use hype words: seamless, effortless, revolutionize, game-changer,
  unlock, supercharge. NO exclamation marks in product copy.
- Honest about what the product does and doesn't do. No fake testimonials.
- Good examples: "Every brand deal in one place." / "Upload the contract, Talby
  fills in the deal." / "Free to start."  Bad: "Never let a brand ghost you again!"

## THE SEO OPPORTUNITY (why this page exists)
Google ranks talby.io #1 only for its own brand. For the money keyword "track
brand deals" and comparisons, competitors (Notion, HeyKero, HoneyBook,
creatorflow) beat us because they publish guide content and we have only a
homepage. This is the FIRST of 5-8 guide pages. The target piece:
"how to track brand deals without a spreadsheet" — an informational page a creator
finds while deciding, which pulls purchase-intent traffic Google rewards
over weeks/months. Write for a human creator first, SEO second. One H1, clear
subheads, genuinely useful, ~1200-1600 words of real substance.

## HARD RULE — REAL PRODUCT ONLY, NO FAKE UI
NEVER generate, invent, or AI-draw Talby UI. Screenshots must be the REAL app.
Sources you may use for real visuals:
- The live marketing site: https://www.talby.io (view it, capturing real
  screenshots from https://www.talby.io is fine, e.g. via a headless browser).
- Real screenshot files already on disk:
    /Users/miso/talby/assets/ad/sc3_overview.png   (Overview: Booked $101,950 /
      Paid $33,000 / Outstanding $67,450, deals list with status pills)
    /Users/miso/talby/assets/carousel/slide3.png   (if present)
- A local dev copy may run at http://localhost:3000 — if reachable and not
  auth-gated, you may capture real screens of Overview/Deals/Calendar/Payments.
If you cannot obtain a real screenshot, describe the layout in words rather than
fabricating an image. A missing real image is better than a fake one — Cam's
audience spots fake UI immediately and it destroys trust.

## THE DELIVERABLE
Build the page at www.talby.io/blog/track-brand-deals-without-a-spreadsheet
(or the closest route the codebase supports — follow existing Next.js App Router
conventions in /Users/miso/talby, check node_modules/next/dist/docs/ first since
this Next.js version has breaking changes). Requirements:
1. One H1 targeting the intent, e.g. "How to track brand deals without a
   spreadsheet".
2. Short empathetic intro naming the pain (creators juggling a spreadsheet that
   stops getting updated in March).
3. 4-6 H2 sections with real substance (e.g. what you actually need to track:
   pipeline, deliverables, invoicing, rate history; why a spreadsheet dies; what
   the alternatives are; how a command center fixes it). Include a small
   comparison table (Notion template / spreadsheet / Talby) as markdown/HTML.
4. One call to action (free to start, www.talby.io) — soft, not pushy.
5. Correct metadata: <title>, meta description (~150 chars), canonical, og
   title/image/site_name, JSON-LD (Article + BreadcrumbList) — follow how
   /src/app/layout.tsx already does openGraph so it matches the site.
6. Wire it into the sitemap (and robots if the blog path is disallowed — it
   currently is not). Add the blog route so /blog works.
7. Verify: npm run build passes with no errors; then fetch the LIVE deployed URL
   (once deployed) and confirm the page returns 200 and renders, checking the
   real host — not just /tmp. If it's only accessible locally after build,
   report that honestly rather than claiming it's live.
Report the final URL, the title/meta you set, the build result, and exactly which
real screenshots you used (or which you could not obtain).

## WAITFOR-APPROVAL GATE
Do not write to external systems you're unsure about. Completing the page + build
+ local render + handing the real screenshot proof to Cam = done. Do not invent
numbers, testimonials, or prices beyond what's given above ($20/mo, 5-deal free
cap, $101,950/$33,000/$67,450 are real). Be honest about anything you could not
verify. Sharp in substance, warm in delivery — this is a real product and a real
founder.