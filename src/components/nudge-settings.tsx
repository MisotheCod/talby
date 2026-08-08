"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { NUDGE_TOPICS, nudgeStepLabel } from "@/lib/nudges";
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

  const [templates, setTemplates] = useState<{ step: number; body: string }[]>(
    NUDGE_TOPICS.map((t) => ({ step: t.step, body: "" }))
  );
  const [templateSaved, setTemplateSaved] = useState(false);

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

  const saveTemplates = async () => {
    // Templates are stored via a dedicated endpoint (or local preview).
    // For v1 we persist them to the profiles JSON settings via an RPC-less
    // upsert through the shared settings route.
    await fetch("/api/nudges/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templates }),
    });
    setTemplateSaved(true);
    setTimeout(() => setTemplateSaved(false), 1500);
  };

  if (plan !== "paid") {
    return (
      <div className="bg-card border border-line rounded-[16px] p-6 shadow-card">
        <h2 className="font-semibold">Payment nudges</h2>
        <p className="text-sm text-inksoft mt-1">
          Chasing overdue invoices? Talby can draft warm follow-ups from your own Gmail on the paid plan.
        </p>
        <a href="/pricing" className="inline-block mt-3">
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

      {/* Template library */}
      <div className="bg-card border border-line rounded-[16px] p-6 shadow-card">
        <h2 className="font-semibold">Nudge templates</h2>
        <p className="text-sm text-inksoft mt-1 mb-4">Warm, firm follow-ups in your own voice. Auto mode sends these as written.</p>
        <div className="space-y-4">
          {NUDGE_TOPICS.map((t, i) => (
            <div key={t.step}>
              <div className="text-[13px] font-semibold mb-1.5 flex items-center gap-2">
                <StatusPill kind={i === 2 ? "late" : i === 1 ? "due" : "neutral"}>{nudgeStepLabel(t.step)}</StatusPill>
              </div>
              <textarea
                value={templates.find((x) => x.step === t.step)?.body ?? ""}
                onChange={(e) => setTemplates((prev) => prev.map((x) => (x.step === t.step ? { ...x, body: e.target.value } : x)))}
                placeholder={t.body.toString()}
                className="w-full bg-card2 border border-line2 rounded-xl px-3.5 py-2.5 text-sm min-h-[110px] resize-y font-sans"
              />
            </div>
          ))}
        </div>
        <div className="mt-4"><Button onClick={saveTemplates}>{templateSaved ? "Saved" : "Save templates"}</Button></div>
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
