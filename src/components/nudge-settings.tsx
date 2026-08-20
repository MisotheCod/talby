import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { NUDGE_TOPICS, NUDGE_TOKENS, DEFAULT_TEMPLATE_SOURCES, nudgeStepLabel } from "@/lib/nudges";
import { Button, Input, Spinner, StatusPill } from "@/components/ui";

/** Paid-tier nudge settings: Gmail connection + rules + template editor. */
export function NudgeSettings() {
  const supabase = createClient();
  const [plan, setPlan] = useState<"free" | "paid">("free");
  const [gmail, setGmail] = useState<{ connected: boolean; email: string | null; configured: boolean }>({
    connected: false, email: null, configured: false,
  });
  const [rules, setRules] = useState({ daysOverdue: 3, cadence: 6, max: 3 });
  const [rulesSaved, setRulesSaved] = useState(false);
  const [savingRules, setSavingRules] = useState(false);

  // Start every step PRE-FILLED with a default template (editable text, with
  // merge tokens), so creators customize rather than write from scratch.
  const [templates, setTemplates] = useState<{ step: number; body: string }[]>(
    NUDGE_TOPICS.map((t) => ({ step: t.step, body: DEFAULT_TEMPLATE_SOURCES[t.step] }))
  );
  const [templateSaved, setTemplateSaved] = useState(false);
  const [templateFocused, setTemplateFocused] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const p = await supabase.from("profiles").select("plan, nudge_days_overdue, nudge_cadence_days, nudge_max_count").eq("id", user.id).single();
      const row = (p.data ?? {}) as unknown as { plan?: string; nudge_days_overdue?: number; nudge_cadence_days?: number; nudge_max_count?: number };
      setPlan((row.plan ?? "free") as "free" | "paid");
      setRules({
        daysOverdue: row.nudge_days_overdue ?? 3,
        cadence: row.nudge_cadence_days ?? 6,
        max: row.nudge_max_count ?? 3,
      });
      // Gmail status (token never exposed to client).
      const g = await fetch("/api/gmail/status").then((r) => r.json()).catch(() => ({}));
      setGmail(g);
      // Load any previously saved custom templates.
      const t = await fetch("/api/nudges/templates").then((r) => r.json()).catch(() => ({ templates: [] }));
      const saved = (t.templates ?? []) as { step: number; body: string }[];
      if (Array.isArray(saved) && saved.length > 0) setTemplates(saved);
    })();
  }, [supabase]);

  const connectGmail = () => {
    window.location.href = "/api/gmail/connect";
  };
  const disconnectGmail = async () => {
    await fetch("/api/gmail/disconnect", { method: "POST" });
    setGmail({ connected: false, email: null, configured: gmail.configured });
  };

  const saveRules = async () => {
    setSavingRules(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({
        nudge_days_overdue: rules.daysOverdue,
        nudge_cadence_days: rules.cadence,
        nudge_max_count: rules.max,
      }).eq("id", user.id);
    }
    setSavingRules(false);
    setRulesSaved(true);
    setTimeout(() => setRulesSaved(false), 1500);
  };

  const updateTemplate = (step: number, body: string) => {
    setTemplates((prev) => prev.map((x) => (x.step === step ? { ...x, body } : x)));
  };

  const insertToken = (step: number, token: string) => {
    const cur = templates.find((x) => x.step === step)?.body ?? "";
    // Insert at the end of the greeting line if it starts with {greeting},
    // otherwise at the cursor/end. Simple + predictable: append on its own line.
    updateTemplate(step, cur + token);
  };

  // Live preview: merge tokens with a sample context so creators see roughly
  // what the email will read like before they save.
  const previewBody = (body: string) => {
    return body
      .replace("{greeting}", "Hi Sam,")
      .replace(/\{\{rep_name\}\}/g, "Sam")
      .replace(/\{\{brand\}\}/g, "SunCup Co")
      .replace(/\{\{deliverable\}\}/g, "3 IG posts")
      .replace(/\{\{amount\}\}/g, "$1,200")
      .replace(/\{\{due_date\}\}/g, "Aug 14, 2026")
      .replace(/\{\{days_overdue\}\}/g, "7");
  };

  const saveTemplates = async () => {
    await fetch("/api/nudges/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templates }),
    });
    setTemplateSaved(true);
    setTimeout(() => setTemplateSaved(false), 1500);
  };

  const resetTemplate = (step: number) => {
    updateTemplate(step, DEFAULT_TEMPLATE_SOURCES[step]);
  };

  if (plan !== "paid") {
    return (
      <div className="bg-card border border-line rounded-[16px] p-6 shadow-card">
        <h2 className="font-semibold">Payment nudges</h2>
        <p className="text-sm text-inksoft mt-1">
          Chasing overdue invoices? Talby can draft warm follow-ups from your own Gmail on the paid plan.
        </p>
        <a href="/#pricing" className="inline-block mt-3">
          <Button><IconCrownMini /> Go unlimited</Button>
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gmail connection */}
      <div className="bg-card border border-line rounded-[16px] p-6 shadow-card">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-semibold">Gmail connection</h2>
            <p className="text-sm text-inksoft mt-1">
              Nudges are drafted and sent from your own Gmail so they thread with real conversations with your reps.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {gmail.connected ? (
              <>
                <StatusPill kind="paid">Connected</StatusPill>
                <span className="text-sm text-inksoft">{gmail.email}</span>
                <Button variant="secondary" onClick={disconnectGmail}>Disconnect</Button>
              </>
            ) : (
              <Button onClick={connectGmail}>Connect Gmail</Button>
            )}
          </div>
        </div>
        {!gmail.configured && (
          <p className="text-xs text-due mt-3">
            Gmail is not configured on this deployment yet. You can still review generated nudges in-app.
          </p>
        )}
      </div>

      {/* Default rules */}
      <div className="bg-card border border-line rounded-[16px] p-6 shadow-card">
        <h2 className="font-semibold">Default nudge rules</h2>
        <p className="text-sm text-inksoft mt-1 mb-4">Applied when a payment goes past due. Per-deal overrides live on each deal.</p>
        <div className="grid grid-cols-3 gap-4 max-w-lg">
          <RuleInput label="Days overdue before first nudge" value={rules.daysOverdue} min={1} onChange={(v) => setRules({ ...rules, daysOverdue: v })} />
          <RuleInput label="Days between follow-ups" value={rules.cadence} min={1} onChange={(v) => setRules({ ...rules, cadence: v })} />
          <RuleInput label="Max nudges per payment" value={rules.max} min={1} max={5} onChange={(v) => setRules({ ...rules, max: v })} />
        </div>
        <div className="mt-4"><Button onClick={saveRules} disabled={savingRules}>{savingRules ? <Spinner /> : rulesSaved ? "Saved" : "Save rules"}</Button></div>
      </div>

      {/* Template library — pre-filled, token-based, creator-editable */}
      <div className="bg-card border border-line rounded-[16px] p-6 shadow-card">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="font-semibold">Nudge templates</h2>
            <p className="text-sm text-inksoft mt-1">
              Start from a warm, firm default and make it your own. Auto mode sends these as written.
            </p>
          </div>
          <div className="flex gap-1.5 flex-wrap items-center">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-inkfaint">Insert:</span>
            {NUDGE_TOKENS.map((tok) => (
              <button
                key={tok.token}
                type="button"
                disabled={templateFocused === null}
                onClick={() => templateFocused !== null && insertToken(templateFocused, tok.token)}
                className="text-[11px] font-medium px-2 py-1 rounded-md border border-line2 bg-card2 text-inksoft hover:border-accent hover:text-accentink transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title={`Insert ${tok.label} (${tok.hint})`}
              >
                {tok.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 rounded-lg bg-purplebg px-3 py-2 text-xs text-purple">
          Tap a field name (Rep name, Brand, etc.) above, then a template, to insert it anywhere. Live preview below each template.
        </div>

        <div className="mt-4 space-y-5">
          {NUDGE_TOPICS.map((t) => (
            <div key={t.step} className="border border-line rounded-xl p-4">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <StatusPill kind={t.step === 3 ? "late" : t.step === 2 ? "due" : "neutral"}>{nudgeStepLabel(t.step)}</StatusPill>
                  <span className="text-[13px] text-inksoft">Sent after {t.step === 1 ? "payment goes past due" : t.step === 2 ? "a second check-in is due" : "max cadence is reached"}</span>
                </div>
                <button type="button" onClick={() => resetTemplate(t.step)} className="text-[11px] font-medium text-inksoft hover:text-ink cursor-pointer">
                  Reset to default
                </button>
              </div>
              <div className="relative">
                <textarea
                  value={templates.find((x) => x.step === t.step)?.body ?? ""}
                  onFocus={() => setTemplateFocused(t.step)}
                  onBlur={() => setTemplateFocused((cur) => (cur === t.step ? null : cur))}
                  onChange={(e) => updateTemplate(t.step, e.target.value)}
                  placeholder={DEFAULT_TEMPLATE_SOURCES[t.step]}
                  className="w-full bg-card2 border border-line2 rounded-xl px-3.5 py-2.5 text-sm min-h-[120px] resize-y font-sans focus:border-accent outline-none"
                />
              </div>
              <div className="mt-2 rounded-lg bg-card2 border border-line px-3 py-2">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-inkfaint mb-1">Preview</div>
                <p className="text-[13px] text-inksoft whitespace-pre-wrap leading-relaxed">{previewBody(templates.find((x) => x.step === t.step)?.body ?? "")}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button onClick={saveTemplates}>{templateSaved ? "Saved" : "Save templates"}</Button>
          <span className="text-xs text-inkfaint">Your saved templates are used for drafts and auto-sends.</span>
        </div>
      </div>
    </div>
  );
}

function RuleInput({ label, value, min = 1, max = 99, onChange }: { label: string; value: number; min?: number; max?: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-inkfaint mb-1.5">{label}</div>
      <Input type="number" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

function IconCrownMini() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 16l-1-9 6 4 3-6 3 6 6-4-1 9zM5 19h14" />
    </svg>
  );
}