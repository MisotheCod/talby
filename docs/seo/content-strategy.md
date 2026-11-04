# Talby SEO Content Strategy (v1)

**Goal:** turn the blog from 13 posts into a hub-and-spoke content architecture that
ranks for real creator-money queries, builds domain trust, and primes the site for
paid (Google Ads) later. Priority: **depth + relevance over volume** — Google's Sep
2026 spam update + gen-AI content guidance punish mass-produced thin posts, and a
young domain needs trust, not article count.

## How to read this
- **HUB** = the pillar post of a cluster; targets the head keyword, gets the most
  internal links **in**, and links **out** to every spoke. Publish/rank first.
- **SPOKE** = a narrower post on one tightly-related query, links back up to the hub.
- Write each post from a real **brief** (target keyword, outline, points Google's
  SERP rewards, internal-link targets, CTA). Reuse the app's real screenshots —
  unique value Google can't copy.
- Publish order per cluster = hub first, then spokes. Clusters 1–2 first (highest
  commercial intent + existing topical coverage), then the rest.

## Cluster map

### C1 — Brand deal management (the product hub) ★ first
- HUB: _How to track brand deals: the setup-free system creators actually stick to_
  (target: "brand deal tracker", "manage brand deals as a creator")
- Spokes:
  - _Spreadsheet vs app for brand deals: why spreasheets fall apart at 10 deals_ ("brand deal spreadsheet template")
  - _Notion for creators: when it works and when it wastes your week_ ("notion brand deal tracker")
  - _Brand deal tracker: what to track on every deal (contract, deliverables, dates, pay)_
  - _Tracking content deliverables across platforms without losing your mind_ (refresh existing)
- Internal links: every spoke → hub; hub → /app signup CTA; spokes also link to each other where topics touch.

### C2 — Money / pricing (highest commercial intent) ★ first
- HUB: _How much should creators charge for a brand deal in 2026_ ("sponsored post rates", "how much to charge for sponsored content")
- Spokes:
  - _How to price your first sponsored post (with real formulas + benchmarks)_
  - _CPM vs flat fee: how to structure a creator rate_ 
  - _How do creators actually get paid by brands? (invoice, net 30, payment terms)_
  - _How to invoice a brand and get paid on time_ (refresh existing "getting paid on time")
  - _Retainers for creators: charging a monthly rate vs per-post_

### C3 — Contracts & legal (trust + high-value keywords)
- HUB: _Creator contract clauses you should never sign without reading_ ("influencer contract", "brand deal contract")
- Spokes: _Content usage rights: what owning your content really means_ · _Exclusivity in brand deals_ · _Payment terms in influencer contracts (net 30/60 explained)_ · refresh "brand-deal-contract-clauses".

### C4 — Pitching & finding deals (top-of-funnel, higher volume)
- HUB: _How to pitch brands and get your first paid brand deal_
- Spokes: refresh "how-to-pitch-brands" · _Media kit that gets you hired_ (refresh) · _How brands find creators (and how to get found)_.

### C5 — Content planning & workload (refresh/expand the existing batch)
- HUB: _Content calendar for creators: planning posts without burnout_ (refresh existing)
- Spokes: refresh batching + content-repurposing + UGC vs branded → link into C1 hub as they touch deal tracking.

### C6 — The "vs" & alternative cluster (bottom-funnel, buy-intent)
- HUB: _Brand deal tracker for creators: how Talby replaces your spreadsheet + Notion + inbox_ (product-led, "talby alternative", "brand deal app")
- Spokes: _Talby vs Notion for brand deals_ · _Talby vs AirTable/Google Sheets for creator invoicing_ · _Best apps for influencers to track payments_ (refresh listings).

## Publish targets (this quarter)
| Cluster | Posts | Status |
|---|---|---|
| C1 | 5 (1 hub + 4) | draft 1st |
| C2 | 6 | draft |
| C3 | 4 | draft-near |
| C4 | 3 | refresh |
| C5 | 4 | refresh |
| C6 | 4 | later |

Fresh posts ~ **15**, refreshes ~ **7**. That, interlinked + schema'd + sitemapped, is
the highest-ROI move for Google ranking before any ad spend.

## Technical checklist already shipped / in place
- robots.txt + sitemap.xml (19 URLs) — ✅ live
- BlogPosting JSON-LD on every post — ✅ live
- Canonical on homepage + blog — ✅ (shipped PR #15)
- og:image on every blog post + listing — ✅ (shipped PR #15)
- WebSite/Organization/SoftwareApplication JSON-LD on homepage — ✅ (shipped PR #15)
- Do: submit sitemap in Google Search Console, set up the cluster posts' internal links, re-submit after each publish batch.

## Tooling
- Installed SEO skill suite (`seo`, `seo-cluster`, `seo-content-brief`, `seo-content`,
  `seo-schema`, etc.) at `~/.hermes/skills/seo/` — run content-brief workflows per
  post. Needs `pip install -r requirements.txt` (approve) + Google Search Console
  keys for live SERP/inspect data.