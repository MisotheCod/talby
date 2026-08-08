// ============================================================
// TALBY — Nudge template library (fixed-copy, creator-editable).
// Keyed to sequence step (first / second / final). Warm but firm,
// checking-in tone, never accusatory. No em dashes anywhere.
// ============================================================

export type NudgeContext = {
  rep_name: string | null;
  brand: string;
  deliverable: string | null;
  amount: number | null;
  due_date: Date | null;
  days_overdue: number;
};

export const NUDGE_STEPS = [
  { step: 1, key: "first", label: "First" },
  { step: 2, key: "second", label: "Second" },
  { step: 3, key: "final", label: "Final" },
] as const;

function money(n: number | null): string {
  return n == null ? "" : "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
function prettyDate(d: Date | null): string {
  return d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
}
function greet(c: NudgeContext): string {
  return `Hi ${c.rep_name?.trim() || "there"},`;
}
function deliverable(c: NudgeContext): string {
  return c.deliverable?.trim() || "the invoice";
}
function amountOrBlank(c: NudgeContext): string {
  return c.amount != null ? ` for ${money(c.amount)}` : "";
}

export const NUDGE_TOPICS = [
  {
    step: 1,
    label: "First check-in",
    subject: (c: NudgeContext) => `Quick check on the ${deliverable(c)} invoice`,
    body: (c: NudgeContext) =>
      `${greet(c)}\n\nFollowing up on the invoice for ${deliverable(c)}, which was due ${prettyDate(c.due_date)}. Wanted to make sure it didn't slip through, happy to resend it if that's easier.\n\nThanks,`,
  },
  {
    step: 2,
    label: "Second check-in",
    subject: (c: NudgeContext) => `Following up on the ${deliverable(c)} invoice${amountOrBlank(c)}`,
    body: (c: NudgeContext) =>
      `${greet(c)}\n\nJust circling back on the outstanding invoice${amountOrBlank(c)} (due ${prettyDate(c.due_date)}). Let me know if there's anything I can provide to help move it along.\n\nBest,`,
  },
  {
    step: 3,
    label: "Final check-in",
    subject: (c: NudgeContext) => `Final follow-up on the ${deliverable(c)} invoice`,
    body: (c: NudgeContext) =>
      `${greet(c)}\n\nThis is a final check-in on the invoice${amountOrBlank(c)}, now ${c.days_overdue} days past due. If there's a blocker on your end I'd love to sort it, otherwise please let me know when payment will land.\n\nThanks,`,
  },
] as const;

/** Build the nudge subject/body for a sequence step. */
export function buildNudge(step: number, ctx: NudgeContext): { subject: string; body: string } {
  const topic = NUDGE_TOPICS.find((t) => t.step === step) ?? NUDGE_TOPICS[NUDGE_TOPICS.length - 1];
  return { subject: topic.subject(ctx), body: topic.body(ctx) };
}

/** A short title for the nudge history list. */
export function nudgeStepLabel(step: number): string {
  return NUDGE_STEPS.find((s) => s.step === step)?.label ?? `Step ${step}`;
}
