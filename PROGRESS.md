# PROGRESS — Talby redesign v2

Branch `talby-redesign-v2`. Nothing merges to main. Work top to bottom through
BUILD_CHECKLIST.md. Each line: item, what shipped, evidence.

- **0. Foundation** — talby-themes tokens + theme provider (CSS vars, no-flash,
  system-mode live listener), fonts, interactions.css, kit.js, utils helpers.
  Evidence: commits `7773522`..`6e577fd`, tsc + build green.
- **1. Shared components to kit.js** — Button (btnP/S/O/G/D + sizes), Input
  (36px/fill/no-border), Textarea, Select (trigger/content/item), Badge
  (22px + pay 24px), Card (rCard/border/shCard), Checkbox (16px rBox), RadioGroup,
  Switch, Skeleton, Avatar (initials, rAvatar), Alert + StateBlock (kit `blk`
  empty/error). Evidence: tsc exit 0, `next build` compiled + 42/42 pages,
  `npm test` 22/22.

## Blocked / notes
- `assets/ad/*.json` changes are from the parallel session, left untouched.
