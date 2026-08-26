"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { IconInfo, IconDelete, IconLink, IconAuto, IconPaperclip } from "@/components/icons";
import { Button, Input, Select, Textarea, Spinner } from "@/components/ui";

/** Map the contract-extraction JSON onto DealFormValues. Used by DealForm, UploadModal. */
export function applyContractFields(f: Record<string, unknown>): DealFormValues {
  const init = emptyDealForm();
  const val = f.value_total;
  return {
    ...init,
    brand: typeof f.brand === "string" ? f.brand : init.brand,
    deliverable: typeof f.deliverable === "string" ? f.deliverable : init.deliverable,
    value: typeof val === "number" ? String(val) : typeof val === "string" ? val : init.value,
    pay_terms: typeof f.pay_terms === "string" ? f.pay_terms : init.pay_terms,
    exclusivity_days: typeof f.exclusivity_days === "number" ? String(f.exclusivity_days) : typeof f.exclusivity_days === "string" ? f.exclusivity_days : init.exclusivity_days,
    due_date: typeof f.due_date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(f.due_date) ? f.due_date : init.due_date,
    rep_name: typeof f.rep_name === "string" ? f.rep_name : init.rep_name,
    rep_email: typeof f.rep_email === "string" ? f.rep_email : init.rep_email,
    notes: typeof f.platforms === "string" && f.platforms ? `Platforms: ${f.platforms}` : init.notes,
  };
}

/** Which fields the extractor actually filled (for sparkle markers). */
export function contractAutoFields(f: Record<string, unknown>): (keyof DealFormValues)[] {
  const keys: (keyof DealFormValues)[] = ["brand", "deliverable", "pay_terms", "rep_name", "rep_email"];
  if (f.value_total != null) keys.push("value");
  if (typeof f.due_date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(f.due_date)) keys.push("due_date");
  if (typeof f.exclusivity_days === "number") keys.push("exclusivity_days");
  return keys;
}

/**
 * Deterministic attention flags from the extracted fields. The extractor returns flat
 * fields (no confidence scores), so we surface the fields it could not fill or that
 * are genuinely ambiguous, each with a plain-language reason. Extraction logic itself
 * is untouched — this is presentation-level inference only.
 */
export function contractFlags(f: Record<string, unknown>): DealFlag[] {
  const flags: DealFlag[] = [];
  if (f.value_total == null) flags.push({ key: "value", reason: "No compensation amount found in the contract." });
  if (!f.deliverable) flags.push({ key: "deliverable", reason: "Couldn't read the deliverables. Add them so the deal is complete." });
  if (!f.due_date && f.rep_name) flags.push({ key: "due_date", reason: "No due date detected. Set one if the contract has a deadline." });
  if (!f.pay_terms) flags.push({ key: "pay_terms", reason: "No payment timing found. If the contract states terms, pick them." });
  if ((f.value_total as number) === 0) flags.push({ key: "value", reason: "Amount read as $0, likely for a pro-bono or fee-gifted deal. Confirm it." });
  return flags;
}

export type DealFormValues = {
  brand: string;
  deliverable: string;
  value: string;
  status: string;            // deal lifecycle: active / pipeline / archived
  payment_status: string;    // expected / paid / none
  due_date: string;
  pay_terms: string;         // due_on_receipt / net_15 / net_30 ...
  exclusivity_days: string;
  rep_name: string;
  rep_email: string;
  nudge_mode: string;
  links: { url: string; label?: string }[];
  notes: string;
};

/** A field the extractor was uncertain about. Reason is plain-language, shown with its value. */
export type DealFlag = { key: keyof DealFormValues; reason: string };

export const PAY_TERM_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "No set terms" },
  { value: "due_on_receipt", label: "Due on receipt" },
  { value: "net_15", label: "Net 15" },
  { value: "net_30", label: "Net 30" },
  { value: "net_45", label: "Net 45" },
  { value: "net_60", label: "Net 60" },
  { value: "net_90", label: "Net 90" },
  { value: "milestone", label: "Milestone-based" },
];

const DEAL_STATUSES = [
  { value: "active", label: "Active" },
  { value: "pipeline", label: "Negotiating" },
  { value: "archived", label: "Archived" },
];
const PAYMENT_STATUSES = [
  { value: "expected", label: "Expected" },
  { value: "paid", label: "Paid" },
  { value: "none", label: "No payment tracked" },
];
const NUDGE_LABEL: Record<string, string> = {
  off: "No nudging",
  notify: "Notify past due",
  draft: "Draft follow-ups",
  auto: "Auto follow-ups",
};

export function emptyDealForm(): DealFormValues {
  return {
    brand: "", deliverable: "", value: "", status: "active", payment_status: "expected",
    due_date: "", pay_terms: "", exclusivity_days: "", rep_name: "", rep_email: "",
    nudge_mode: "draft", links: [], notes: "",
  };
}

/**
 * Shared deal form — ONE component powering both the manual "New deal" state and the
 * post-upload "Review your deal" state. A short required core stays visible; everything
 * else lives in collapsible labeled sections, each with a one-line summary so the user
 * can see what's inside without expanding. Collapsed sections still submit their values.
 *
 * variant: "manual"  -> compact upload line at the top.
 *         "review"   -> file confirmation strip, "needs your attention" flags, sparkle
 *                       markers on auto-filled fields, footer legend.
 */
export function DealForm({
  mode,
  dealId,
  initial,
  variant = "manual",
  filename,
  contractFile,
  autoFields = [],
  flagged = [],
  onReplaceFile,
  uploadOnMount,
  onDraftSave,
  onSaved,
  setError,
  submitLabel,
  pending,
}: {
  mode: "create" | "edit";
  dealId?: string | null;
  initial: DealFormValues;
  variant?: "manual" | "review";
  filename?: string | null;
  contractFile?: File | null;
  autoFields?: (keyof DealFormValues)[];
  flagged?: DealFlag[];
  onReplaceFile?: () => void;
  uploadOnMount?: boolean;
  /** When set (multi-upload queue row editor), submitting updates the draft instead of creating. */
  onDraftSave?: (v: DealFormValues) => void;
  onSaved: () => void;
  setError: (e: string) => void;
  submitLabel: string;
  pending: boolean;
}) {
  const supabase = createClient();
  const [v, setV] = useState<DealFormValues>(initial);
  const [extracting, setExtracting] = useState(false);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [stagedText, setStagedText] = useState(""); // extracted contract text for assistant ingest
  const [plan, setPlan] = useState<"free" | "paid">("free");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof DealFormValues>(k: K, val: DealFormValues[K]) => setV((p) => ({ ...p, [k]: val }));

  // Self-promotion: a contract chosen in the manual state extracts and flips this same
  // component into its review state (no second modal).
  const [selfReview, setSelfReview] = useState<{ auto: string[]; flags: DealFlag[] } | null>(null);
  const isReview = variant === "review" || (mode === "create" && !!selfReview);
  const effectiveAuto = selfReview ? selfReview.auto : autoFields;
  const effectiveFlags = selfReview ? selfReview.flags : flagged;

  // On mount, resolve the current plan for file gating.
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const p = await supabase.from("profiles").select("plan").eq("id", user.id).single();
        setPlan(((p.data as unknown as { plan?: string })?.plan === "paid") ? "paid" : "free");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const uploadContract = async (file: File) => {
    if (variant === "review") { setStagedFile(file); onReplaceFile?.(); return; }
    setExtracting(true); setError("");
    setStagedFile(file);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/deals/extract-contract", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Could not read the contract."); setStagedFile(null); return; }
      setStagedText(typeof data.text === "string" ? data.text : "");
      const per = applyContractFields(data.fields ?? {});
      setV(per);
      setSelfReview({ auto: contractAutoFields(data.fields ?? {}), flags: contractFlags(data.fields ?? {}) });
    } catch {
      setError("Could not read the contract.");
    } finally {
      setExtracting(false);
    }
  };

  const doSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); return; }

    const payload: Record<string, unknown> = {
      deliverable: v.deliverable.trim() || null,
      value: v.value ? Number(v.value) : null,
      status: v.status,
      payment_status: v.payment_status,
      due_date: v.due_date || null,
      pay_terms: v.pay_terms || null,
      exclusivity_days: v.exclusivity_days ? Number(v.exclusivity_days) : null,
      rep_name: v.rep_name.trim() || null,
      rep_email: v.rep_email.trim() || null,
      nudge_mode: v.nudge_mode,
      links: v.links.filter((l) => l.url).map((l) => ({ url: l.url, label: l.label || l.url })),
      notes: v.notes.trim() || null,
      active: v.status !== "archived",
    };

    const srcFile = contractFile || stagedFile;
    if (mode === "create") {
      if (onDraftSave) { onDraftSave(v); return; }
      const { data: created, error } = await supabase.from("deals").insert({ user_id: user.id, brand: v.brand.trim(), ...payload }).select("id").single();
      if (error) { setError(error.message); return; }
      const createdId = (created as unknown as { id?: string } | null)?.id;
      if (plan === "paid" && srcFile && createdId) {
        const path = `${user.id}/${createdId}/${Date.now()}-${srcFile.name}`;
        await supabase.storage.from("deal-files").upload(path, srcFile);
        await supabase.from("deal_files").insert({ user_id: user.id, deal_id: createdId, name: srcFile.name, path, size_bytes: srcFile.size, mime: srcFile.type });
      }
      // Ingest the extracted contract text for assistant Q&A (server-side chunk+embed).
      if (plan === "paid" && createdId && stagedText.trim()) {
        try {
          await fetch("/api/assistant/ingest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dealId: createdId, text: stagedText }),
          });
        } catch { /* ingest is safe to fail silently; the deal is already saved */ }
      }
    } else {
      if (!dealId) { setError("Missing deal."); return; }
      const { error } = await supabase.from("deals").update(payload).eq("id", dealId);
      if (error) { setError(error.message); return; }
    }
    onSaved();
  };

  const toggle = (k: string) => setOpenSections((p) => ({ ...p, [k]: !p[k] }));

  // ---- one-line summaries for collapsed sections ----
  const repSummary = [v.rep_name.trim(), v.rep_email.trim(), v.nudge_mode !== "draft" ? NUDGE_LABEL[v.nudge_mode] : ""].filter(Boolean).join(" · ");
  const termsSummary = [
    v.payment_status === "expected" ? "Expected" : v.payment_status === "paid" ? "Paid" : v.payment_status === "none" ? "No payment tracked" : null,
    v.due_date ? `Due ${v.due_date}` : null,
    PAY_TERM_OPTIONS.find((o) => o.value === v.pay_terms)?.label && v.pay_terms ? PAY_TERM_OPTIONS.find((o) => o.value === v.pay_terms)!.label : null,
    v.exclusivity_days ? `${v.exclusivity_days} days exclusivity` : null,
  ].filter(Boolean).join(" · ");
  const notesSummary = [
    v.links.filter((l) => l.url).length ? `${v.links.filter((l) => l.url).length} link${v.links.filter((l) => l.url).length > 1 ? "s" : ""}` : null,
    v.notes.trim() ? "notes" : null,
  ].filter(Boolean).join(" · ");

  const spark = (key: keyof DealFormValues) =>
    isReview && effectiveAuto.includes(key) ? <IconAuto size={13} className="text-due shrink-0" data-spark="1" /> : null;

  return (
    <div className="space-y-4">
      {/* Review intro subtitle */}
      {isReview && (
        <p className="text-xs italic text-inksoft -mt-1">Pulled from your contract. Check the flagged fields.</p>
      )}

      {/* File strip (review) OR compact upload line (manual) */}
      {mode === "create" && (
        isReview ? (
          stagedFile || contractFile || filename ? (
            <div className="flex items-center gap-2.5 rounded-xl border border-line2 bg-card2 px-3 py-2.5">
              <IconPaperclip size={15} className="text-inksoft shrink-0" />
              <span className="truncate text-sm flex-1">{filename || stagedFile?.name}</span>
              <span className="text-xs text-inksoft shrink-0">attached to deal</span>
              <button onClick={() => { if (onReplaceFile) onReplaceFile(); else fileRef.current?.click(); }} className="text-xs font-medium accent-text hover:underline cursor-pointer shrink-0" type="button">Replace</button>
            </div>
          ) : null
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-inksoft hover:text-ink cursor-pointer"
            >
              {extracting ? <Spinner className="h-3.5 w-3.5" /> : <IconPaperclip size={13} className="text-inksoft" />}
              <span>{extracting ? "Reading contract…" : uploadOnMount ? "Start with a contract" : "Upload a contract to auto-fill"}</span>
            </button>
            {plan === "free" && (
              <div className="ml-0.5 flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded-lg border border-accent/30 bg-accent-soft">
                <span className="text-[11px] text-accentink leading-tight">Saving contract files is on Unlimited</span>
                <a href="/#pricing" className="text-[11px] font-semibold accent-text hover:underline no-underline whitespace-nowrap" onClick={(e) => e.stopPropagation()}>Go unlimited</a>
              </div>
            )}
          </div>
        )
      )}
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.txt,.md,text/plain,application/pdf"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadContract(f); e.target.value = ""; }}
      />

      {/* Needs your attention */}
      {isReview && effectiveFlags.length > 0 && (
        <div className="rounded-xl border border-[var(--line2)] bg-[var(--soft)] p-3.5 space-y-2.5">
          <div className="text-[13px] font-semibold">{effectiveFlags.length} field{effectiveFlags.length > 1 ? "s" : ""} need you</div>
          {effectiveFlags.map((f, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className={cn("h-4 w-1.5 rounded-full shrink-0 mt-1.5", "bg-due")} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium capitalize">{f.key.replace(/_/g, " ")}</span>
                  <FlagEdit key={f.key} field={f.key} value={v[f.key]} onChange={(x: unknown) => set(f.key, x as never)} />
                </div>
                <p className="text-[11px] text-inksoft mt-0.5">{f.reason}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---- Core: always visible ---- */}
      {mode === "create" && (
        <Field label="Brand *" spark={spark("brand")}><Input value={v.brand} onChange={(e) => set("brand", e.target.value)} placeholder="e.g. Glossier" /></Field>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Value ($)" spark={spark("value")}><Input type="number" value={v.value} onChange={(e) => set("value", e.target.value)} placeholder="1500" /></Field>
        <Field label="Deal status"><Select value={v.status} onChange={(e) => set("status", e.target.value)}>
          {DEAL_STATUSES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select></Field>
      </div>
      <Field label="Deliverable" spark={spark("deliverable")}><Input value={v.deliverable} onChange={(e) => set("deliverable", e.target.value)} placeholder="e.g. 2 IG posts + 1 story" /></Field>

      {/* Accordion sections */}
      <AccordionSection
        label="Rep contact"
        summary={repSummary || "Add a rep and nudge mode"}
        open={!!openSections.rep}
        onToggle={() => toggle("rep")}
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Rep name" spark={spark("rep_name")}><Input value={v.rep_name} onChange={(e) => set("rep_name", e.target.value)} placeholder="e.g. Sam Rivera" /></Field>
          <Field label="Rep email" spark={spark("rep_email")}><Input type="email" value={v.rep_email} onChange={(e) => set("rep_email", e.target.value)} placeholder="sam@brand.com" /></Field>
        </div>
        <Field label="Nudge mode" hint="Off: no follow-up emails. Notify: flags a past-due payment in-app only. Draft: prepares a follow-up email for you to review and send. Auto: sends follow-ups from your Gmail on schedule until you mark the payment received.">
          <Select value={v.nudge_mode} onChange={(e) => set("nudge_mode", e.target.value)}>
            <option value="off">Off (no nudging)</option>
            <option value="notify">Notify (flag past due in-app)</option>
            <option value="draft">Draft (prepare for review, you send)</option>
            <option value="auto">Auto (send on schedule)</option>
          </Select>
        </Field>
        {v.nudge_mode === "auto" && (
          <p className="text-xs text-due -mt-1">Auto mode sends follow-ups from your Gmail on schedule. Talby will send up to your max nudges, then stop. Mark the payment received anytime to stop it instantly.</p>
        )}
      </AccordionSection>

      <AccordionSection
        label="Terms"
        summary={termsSummary || "Payment, due date, pay terms, exclusivity"}
        open={!!openSections.terms}
        onToggle={() => toggle("terms")}
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Due date" spark={spark("due_date")}><Input type="date" value={v.due_date} onChange={(e) => set("due_date", e.target.value)} /></Field>
          <Field label="Payment status"><Select value={v.payment_status} onChange={(e) => set("payment_status", e.target.value)}>
            {PAYMENT_STATUSES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select></Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Pay terms" spark={spark("pay_terms")}>
            <Select value={v.pay_terms} onChange={(e) => set("pay_terms", e.target.value)}>
              {PAY_TERM_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </Select>
          </Field>
          <Field label="Exclusivity (days)" spark={spark("exclusivity_days")}>
            <Input type="number" min={0} value={v.exclusivity_days} onChange={(e) => set("exclusivity_days", e.target.value)} placeholder="e.g. 60" />
          </Field>
        </div>
      </AccordionSection>

      <AccordionSection
        label="Notes & links"
        summary={notesSummary || "Add notes or a link"}
        open={!!openSections.notes}
        onToggle={() => toggle("notes")}
      >
        <Field label="Notes">
          <Textarea value={v.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Any details…" />
        </Field>
        <Field label="Links">
          <div className="space-y-2">
            {v.links.map((l, i) => (
              <div key={i} className="flex gap-2">
                <Input value={l.url} onChange={(e) => { const n = [...v.links]; n[i] = { ...n[i], url: e.target.value }; set("links", n); }} placeholder="https://…" />
                <button onClick={() => set("links", v.links.filter((_, j) => j !== i))} className="px-2 text-inksoft hover:text-late cursor-pointer"><IconDelete size={16} /></button>
              </div>
            ))}
            <Button variant="secondary" size="sm" onClick={() => set("links", [...v.links, { url: "", label: "" }])}><IconLink size={14} /> Add link</Button>
          </div>
        </Field>
      </AccordionSection>

      {/* Footer legend (review only, when any sparkle shown) */}
      {isReview && effectiveAuto.length > 0 && (
        <p className="text-[11px] text-inksoft flex items-center gap-1.5"><IconAuto size={13} className="text-due" /> <span>Sparkle = filled by your contract. Edit anything before adding.</span></p>
      )}

      <div className="flex justify-end"><Button onClick={doSubmit} disabled={pending}>{pending ? <Spinner /> : submitLabel}</Button></div>
    </div>
  );
}

function Field({ label, hint, spark, children }: { label: string; hint?: string; spark?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink block mb-1.5 flex items-center gap-1">
        {label}
        {spark}
        {hint && (
          <span className="relative inline-flex align-middle ml-1 group">
            <IconInfo size={13} className="text-inkfaint" />
            <span className="theme-tip hidden group-hover:block absolute bottom-[calc(100%+6px)] left-0 w-60 z-50 text-[11.5px] leading-relaxed rounded-lg px-3 py-2 shadow-pop pointer-events-none">
              {hint}
              <span className="theme-tip-arrow absolute top-full left-3 -mt-[3px] border-4 border-transparent" />
            </span>
          </span>
        )}
      </span>
      {children}
    </label>
  );
}

/** Inline mini-editor for a flagged field, so the user can fix it right in the attention block. */
function FlagEdit({ field, value, onChange }: { field: keyof DealFormValues; value: string | { url: string; label?: string }[]; onChange: (x: string) => void }) {
  if (typeof value !== "string") return null;
  if (field === "due_date") return <Input type="date" value={value} onChange={(e) => onChange(e.target.value)} className="!h-7 !text-xs" />;
  if (field === "exclusivity_days" || field === "value" ) return <Input type="number" value={value} onChange={(e) => onChange(e.target.value)} className="!h-7 !text-xs !w-28" />;
  if (field === "pay_terms") return (
    <Select value={value} onChange={(e) => onChange(e.target.value)}>
      {PAY_TERM_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </Select>
  );
  if (field === "status") return (
    <Select value={value} onChange={(e) => onChange(e.target.value)}>
      {DEAL_STATUSES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </Select>
  );
  if (field === "payment_status") return (
    <Select value={value} onChange={(e) => onChange(e.target.value)}>
      {PAYMENT_STATUSES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </Select>
  );
  return <Input value={value} onChange={(e) => onChange(e.target.value)} className="!h-7 !text-xs flex-1" />;
}

function AccordionSection({ label, summary, open, onToggle, children }: { label: string; summary: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="border border-line2 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center gap-2 px-3.5 py-3 hover:bg-card2 transition-colors cursor-pointer"
      >
        <span className="text-sm font-medium text-ink flex-1 text-left">{label}</span>
        <span className={cn("text-xs text-inksoft truncate max-w-[50%] text-right", !open && "italic")}>
          {open ? "Hide" : summary}
        </span>
        <svg className={cn("chev shrink-0 transition-transform", open && "rotate-90")} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 6l6 6-6 6" /></svg>
      </button>
      {open && <div className="px-3 pb-3 pt-1 space-y-3 border-t border-line">{children}</div>}
    </div>
  );
}