// ============================================================
// TALBY — Nudge template library (creator-editable, token-based).
// Each step ships with a warm-but-firm default. Creators can edit the
// body in Settings; their custom text (saved to profiles.nudge_templates)
// is used verbatim by the generation engine. Merge tokens get filled with
// live deal/payment data. No em dashes anywhere.
// ============================================================

export type NudgeContext = {
  rep_name: string | null;
  brand: string;
  deliverable: string | null;
  amount: number | null;
  due_date: Date | null;
  days_overdue: number;
};

// --- Merge tokens -----------------------------------------------------------
// Shown to the creator in the editor (readable), replaced at send time.
export const NUDGE_TOKENS = [
  { token: "{{rep_name}}", label: "Rep name", hint: "e.g. Sam" },
  { token: "{{brand}}", label: "Brand", hint: "e.g. SunCup Co" },
  { token: "{{deliverable}}", label: "Deliverable", hint: "e.g. 3 IG posts" },
  { token: "{{amount}}", label: "Amount", hint: "e.g. $1,200" },
  { token: "{{due_date}}", label: "Due date", hint: "e.g. Aug 14, 2026" },
  { token: "{{days_overdue}}", label: "Days overdue", hint: "number of days past" },
] as const;

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

/** Render a template body by replacing merge tokens with live values. */
export function applyTemplate(tpl: string, c: NudgeContext): string {
  const greeting = `Hi ${c.rep_name?.trim() || "there"},`;
  const deliv = c.deliverable?.trim() || "the invoice";
  const date = prettyDate(c.due_date);

  const map: Record<string, string> = {
    "{{rep_name}}": c.rep_name?.trim() || "there",
    "{{brand}}": c.brand?.trim() || "",
    "{{deliverable}}": deliv,
    "{{amount}}": money(c.amount),
    "{{due_date}}": date,
    "{{days_overdue}}": String(c.days_overdue),
    "{greeting}": greeting,
  };

  return Object.entries(map).reduce(
    (out, [k, v]) => out.split(k).join(v ?? ""),
    tpl || ""
  );
}

/** Default templates, shipped pre-filled and ready to edit/customize. */
export const DEFAULT_TEMPLATE_SOURCES: Record<number, string> = {
  1: `{greeting}\n\nFollowing up on the invoice for {{deliverable}}, which was due {{due_date}}. Wanted to make sure it didn't slip through, happy to resend it if that's easier.\n\nThanks,`,
  2: `{greeting}\n\nJust circling back on the outstanding invoice for {{deliverable}} (due {{due_date}}). Let me know if there's anything I can provide to help move it along.\n\nBest,`,
  3: `{greeting}\n\nThis is a final check-in on the invoice for {{deliverable}}, now {{days_overdue}} days past due. If there's a blocker on your end I'd love to sort it, otherwise please let me know when payment will land.\n\nThanks,`,
};

export const NUDGE_TOPICS = [
  {
    step: 1,
    label: "First check-in",
    subject: (c: NudgeContext) => `Quick check on the ${applyTemplate("{{deliverable}}", c)} invoice`,
    body: (c: NudgeContext) => applyTemplate(DEFAULT_TEMPLATE_SOURCES[1], c).trim(),
  },
  {
    step: 2,
    label: "Second check-in",
    subject: (c: NudgeContext) => {
      const amt = c.amount != null ? ` for ${money(c.amount)}` : "";
      return `Following up on the ${applyTemplate("{{deliverable}}", c)} invoice${amt}`;
    },
    body: (c: NudgeContext) => applyTemplate(DEFAULT_TEMPLATE_SOURCES[2], c).trim(),
  },
  {
    step: 3,
    label: "Final check-in",
    subject: (c: NudgeContext) => `Final follow-up on the ${applyTemplate("{{deliverable}}", c)} invoice`,
    body: (c: NudgeContext) => applyTemplate(DEFAULT_TEMPLATE_SOURCES[3], c).trim(),
  },
] as const;

/**
 * Build the nudge subject/body for a sequence step, honoring a creator's
 * saved custom template when present (falling back to the default).
 */
export function buildNudge(step: number, ctx: NudgeContext, customTemplates?: { step: number; body: string }[]): { subject: string; body: string } {
  const topic = NUDGE_TOPICS.find((t) => t.step === step) ?? NUDGE_TOPICS[NUDGE_TOPICS.length - 1];
  const custom = (customTemplates ?? []).find((t) => t.step === step)?.body ?? "";
  const body = custom && custom.trim() ? applyTemplate(custom, ctx).trim() : topic.body(ctx);
  const subject = topic.subject(ctx);
  return { subject, body };
}

/** A short title for the nudge history list. */
export function nudgeStepLabel(step: number): string {
  return NUDGE_STEPS.find((s) => s.step === step)?.label ?? `Step ${step}`;
}