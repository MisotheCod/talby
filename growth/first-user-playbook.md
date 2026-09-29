# Talby — First-User Acquisition Playbook (goal: website signups, not revenue)

North star: **signups → activation**. Paid is secondary. Based on 2026 SaaS first-user data (Reddit/forums 34%, programmatic SEO/micro-tools 24%, targeted cold outbound 18%, directories/launch 12%, Twitter build-in-public 10%) + the 10 video tactics reviewed.

## Real first-user channel ranking (what the data actually shows)

| Channel | Share of signups | Time to user | Verdict for Talby |
|---|---|---|---|
| **Reddit & niche forums** (signal replies) | 34% | 1-2 wks | ★ highest-leverage; monitor creator subreddits for "how do I track/invoice brand deals" |
| **Programmatic SEO / free micro-tool** | 24% | 3-6 mo | ★★ build a free "brand deal rate calculator" — SEO magnet, 24% of signups |
| **Targeted cold outbound (personalized)** | 18% | 1-2 wks | ★ first 10-20 users; creators who just closed a deal |
| **YouTube search videos** | (creator audience) | 1-3 mo | ★★ turn 13 blog posts into query-matched videos |
| **Directories & launch platforms** | 12% | 2-4 wks | Product Hunt, BetaList, SaaSHub, directory backlinks |
| **Twitter / build in public** | 10% (often 0-real-world) | unpredictable | ✗ lowest — links suppressed, rarely converts (founder data: 0 users) |
| **Paid ads** | — | — | ✗ not until pricing/product-market fit is proven |

## What to actually do (ranked, stage-appropriate)

1. **Activation over signup hardening** — if a signup doesn't activate (add first deal), it's not a user. Track signup→activation, day-1/day-7 retention. The funnel matters more than traffic right now.
2. **Reddit signal replies** — the highest-converting, and automatable (see cron plan). Answer real "help me track my SPONSORED-work" posts in creator subreddits; only link Talby when it directly answers. Never pitch first.
3. **Cold outbound to "just-signed-first-deal" creators** — personalized, value-first (see pack below). First 10-20 users.
4. **YouTube search videos** from the blog (scripted below).
5. **Free micro-tool** — a rate calculator / contract-clause checker that captures intent and funnels to signup (programmatic SEO engine).

---

## Cold outreach pack (value-first, NOT a blast)

**Signal sources to mine (where the "just got my first brand deal" moment lives):**
- Reddit: r/InstagramMarketing, r/InfluencerMarketing, r/UGCcreators, r/NewTubers, r/content_marketing, creator-adjacent subs — posts/comments about getting/sponsorship deals, invoices, contracts.
- X/Twitter: "just got my first brand deal", "landed a sponsorship", "how to invoice a sponsor" — search recent.
- LinkedIn: "creator" posts about brand partnerships.
- Discord/Slack creator communities — listen a week, then help.

**The message (personalized, asks for a look not a buy):**
> Hi [name] — saw your post about [specific: "finally closing my first brand deals / tracking sponsorships is a mess"]. I built Talby to handle exactly the part you're fighting: contracts + deliverables + invoice dates in one place so nothing slips. It's free up to 5 active deals — happy to set you up and get your thoughts. No pressure either way.

Key: reference the SPECIFIC post. One-to-one. Follow up once 3 days later. Goal for the first run: 20-40 messages → a handful of signups + real feedback (which fixes messaging).

---

## YouTube search videos (from existing blog posts)

Match the exact query the creator types. Titles = the search. Low competition vs Google. Publish 2-3x/wk.

Draft titles (each maps to a live talby.io blog post):
1. "How to Price Sponsored Content (2026 rate formula for creators)" → blog/how-to-price-sponsored-content
2. "How to Track Brand Deals Without a Spreadsheet" → blog/track-brand-deals-without-a-spreadsheet
3. "How to Get Paid on Time as a Creator" → blog/getting-paid-on-time-creators
4. "Brand Deal Contract Clauses You Must Check" → blog/brand-deal-contract-clauses
5. "How to Pitch Brands as a Smaller Creator" → blog/how-to-pitch-brands

**Script — Video #1 "How to Price Sponsored Content (2026)** (3-4 min, reads from the blog; hook in first 5s):

- HOOK (0:00-0:07): "You got a brand DM asking your rate — and you have no idea what to say. Too low and you lose money. Too high and they walk."
- (0:07-0:40) CPM baseline: your avg views ÷ 1000 × niche CPM. Give the niche table from the article (finance $22-42, tech $18-35, fitness $14-22, lifestyle $8-14).
- (0:40-1:15) Engagement multiplier — 8% engagement beats 200k/1%. Apply 1.5-2x above 5% engagement.
- (1:15-1:50) Usage rights & exclusivity add 30-50% — this is where creators leave money. The fee table.
- (1:50-2:20) Platform comparison at same follower tier (YouTube > TikTok > IG).
- (2:20-2:45) How to hold your rate: quote full, offer reduced scope not discount.
- (2:45-END) CTA: "Want this without the spreadsheet chaos? Link in bio — Talby keeps contracts, rates, and payment dates in one place. Free for your first 5 deals."

---

## Cron automation plan (feed the existing schedule)

Cam's market-intel scan already watches Talby buyers. Extend it into a **lead-signal digest**:
- **Daily Reddit/Social signal monitor** (cron): watch creator subreddits for problem phrases ("how do I track brand deals", "invoice a sponsor", "brand deal contract", "sponsorship payment late") → push warm leads + their post link to a digest. Scheduled with his cron infra (notify on matches).
- **Talby short-form autopost** (cron): hook+demo reels/IG+TT via Buffer — Talby's own channel, separate from Momo.
- **Weekly market-intel**: already runs; add a "first-deal creators" discovery slice if the daily monitor justifies it.

Not automatable (needs the human): the actual send — Reddit replies and DMs from his accounts.

---

## "Anything else we can do" (bonus channels)

1. **Activation metrics** — instrument signup→added-first-deal; 100 signups with 8 activations = an onboarding problem, not an acquisition problem.
2. **Full-stack free tool** — a micro-tool is the single best SEO + intent thing available (24% of indie signups).
3. **Launch platforms** — Product Hunt (spike), BetaList (waitlist), SaaSHub/CR directories (backlinks + traffic), RankInPublic.
4. **Integrations for distribution** — Talby already imports from Notion/spreadsheet; the one-click "Import your deals from X" is both a feature and a marketing hook.