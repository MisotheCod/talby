# Talby Weekly Analytics — 2026-10-05

## THIS WEEK WHAT WORKED

**Correcting last week's call before anything else.** Last week's report crowned `ugc_admin_day` (55 views) as "the only real signal." That was wrong — not because 55 wasn't thin, but because the org-wide Buffer query caps at the latest ~10 posts and hid the actual leaders. Pulling per-channel this week exposed the real dataset standings:

| Hook (sent date) | Channel | Views |
|---|---|---|
| `forgot_year` — "do you actually know what you've made this year? i didn't. turns out i was way off." | YT Shorts | **423** (09-24) |
| `forgot_year` — same angle, either-or close ("two kinds of creators... i stopped hoping") | YT Shorts | **319** (09-23) |
| `paid_is_second_job` / ugc-admin which-is-worse ("you did the work... which is worse: losing track of a payment...") | YT Shorts | **70** (09-29) |
| `ugc_admin_day` — cafe moment "wondering which brand actually paid you" | YT Shorts | 55 (09-25) |
| spreadsheet vs notes app ("which one are you?") | YT Shorts | 2 (09-23) |
| generic "one place for every brand deal" | YT Shorts | 2 (09-20) |

- **Winner hook: `forgot_year`.** 423 + 319 = **742 views**, both YouTube Shorts, the only two posts in the entire dataset to clear 300 (~6-8x every other asset). The Forgotten-Truth cue ("do you actually know what you've made this year? i didn't.") + the receipt (booked/paid/outstanding) is the pattern. Marked `winner: true` in hook-pool.json.
- **Platform lean: YouTube Shorts, decisively.** Every non-zero number in the whole account lives on YT Shorts. Same week TikTok sent 3 posts → **0, 0, 0** views; Instagram 4 posts → **reach 1** each. This is the "one render → three platforms" answer: the reach engine is YT Shorts, full stop, for now. TikTok/IG are drains at current cold-start.
- **What to stop doing:** (1) treating TikTok/IG as equal distribution — they are not converting; the strongest hook of the day should go to YT Shorts first. (2) Trusting the org-wide posts query for analytics — it truncates to ~10 and hides winners. Use per-channel or bound `createdAt{start,end}`. I still don't know last week's calling was wrong until I pulled per-channel.
- **No hook earned a `losing` flag this week.** The 0-view sends (YT 10-01, YT 10-03, all TikTok, all IG) are too fresh / recency-capped to call losers — they haven't been live long enough. Do not mislabel. The only honest losers are platform-drain (TikTok/IG near-zero), which is a distribution call, not a hook call.

## NEXT WEEK HOOKS

Grounding: three real findings — (1) `forgot_year` (Forgotten-Truth receipt) is the proven top on YT Shorts, (2) the ugc-admin pain-mirror family (55 + 70) is a reliable second, (3) TikTok/IG show zero. Everything else is thesis. First three hooks are grounded; 4-5 are untested candidates that deserve the YT-Shorts route.

1. **`forgot_year` (WINNER — lead with it, daily until it cools).** Re-run the exact Forgotten-Truth beat, vary the receipt numbers and the second sentence each day: "do you actually know what you've made this year? i didn't. turns out i was way off. booked [x], paid [x], outstanding [x]. which one are you?" Why: 423 + 319 are the only three-digit numbers we own; it is the top of the dataset and must be the default engine pick on YT Shorts.

2. **The ugc-admin pain-mirror (family winner, second slot).** "the worst part of ugc admin work is the day at the cafe wondering which brand actually paid you. one screen fixes it: booked, paid, outstanding." Why: this family did 55 + 70 — reliable second. Paired with the receipt it converts.

3. **Which-is-worse engagement on YT Shorts (Either-Or).** "which is worse: losing track of a payment you're owed, or doing a whole campaign and never getting paid? you did the work, getting paid should not be a second job." Why: this exact frame pulled 70 views as part of the same 09-29 family; Either-Or is the comment-puller and YT Shorts rewards it.

4. **Ambush-receipt thesis (untested — Forgotten-Truth variant).** "you've had [N] brand deals this year. you can name [N-1] of them from memory. the one you can't is the one you never got paid for." Why: same curiosity+receipt engine that won, new exact-accountability beat. Untested; route to YT Shorts day one.

5. **The "silent outstanding" panic thesis.** "booked $101,950. paid $33,000. outstanding $67,450. that gap isn't your work — it's money you're waiting on. how long has that number been sitting there?" Why: 39% of booked value is outstanding — a real, specific, uncomfortable number. Panic-hook register tied to the receipt. Untested; put it on YT Shorts, not TikTok.

**Daily engine instruction:** route the day's strongest hook to YouTube Shorts first, every day. TikTok/IG still get their drafts (audience build matters) but expect ~zero — don't burn the best hook there. And keep the mapping fix from last week front-and-center: record the SENT post id in hashtag-usage.json (not just the draft) or the weekly can't attribute any of this. SENT ids this week were distinct from the draft ids the engine logged — that gap is why attribution is still thin.