"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { newPostDateRow, type PostDate } from "@/lib/post-dates";
import { generatePaymentsFromStructure } from "@/lib/pay-status";
import { DealInput, DealTextarea, inputFieldCls } from "@/components/deal-input";
import { IconInfo, IconDelete, IconLink, IconAuto, IconPaperclip, IconCheck, IconUpload, IconPlus } from "@/components/icons";
import { Button, Select, Spinner } from "@/components/ui";

/** Map the contract-extraction JSON onto DealFormValues. Used by DealForm, UploadModal. */
export function applyContractFields(f: Record<string, unknown>): DealFormValues {
  const init = emptyDealForm();
  const val = f.value_total;
  const st = (f.payment_structure ?? {}) as Record<string, unknown>;
  const kind = typeof st.kind === "string" && ["once", "split", "parts", "monthly"].includes(st.kind) ? st.kind as DealFormValues["payment_structure"] : "once";
  return {
    ...init,
    brand: typeof f.brand === "string" ? f.brand : init.brand,
    deliverable: typeof f.deliverable === "string" ? f.deliverable : init.deliverable,
    value: typeof val === "number" ? String(val) : typeof val === "string" ? val : init.value,
    pay_terms: typeof f.pay_terms === "string" ? f.pay_terms : init.pay_terms,
    exclusivity_days: typeof f.exclusivity_days === "number" ? String(f.exclusivity_days) : typeof f.exclusivity_days === "string" ? f.exclusivity_days : init.exclusivity_days,
    due_date: typeof f.due_date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(f.due_date) ? f.due_date : init.due_date,
    revisions_included: typeof f.revisions_included === "string" ? f.revisions_included : init.revisions_included,
    rep_name: typeof f.rep_name === "string" ? f.rep_name : init.rep_name,
    rep_email: typeof f.rep_email === "string" ? f.rep_email : init.rep_email,
    post_dates: Array.isArray(f.post_dates)
      ? (f.post_dates as { date?: string; label?: string }[])
          .filter((p) => typeof p.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(p.date))
          .sort((a, b) => (a.date! < b.date! ? -1 : a.date! > b.date! ? 1 : 0))
          .map((p) => newPostDateRow({ date: p.date!, label: typeof p.label === "string" ? p.label : "" }))
      : init.post_dates,
    notes: typeof f.platforms === "string" && f.platforms ? `Platforms: ${f.platforms}` : init.notes,
    // Release 1/2 structure (spec 5a)
    payment_structure: kind,
    structure_timing: typeof st.timing === "string" ? st.timing : "net_30",
    structure_upfront_pct: typeof st.upfront_pct === "number" ? st.upfront_pct : 50,
    structure_balance_timing: typeof st.balance_timing === "string" ? st.balance_timing : "net_30",
    structure_months: typeof st.months === "number" ? st.months : 3,
    structure_parts: Array.isArray(st.parts)
      ? (st.parts as { name?: string; amount?: number | string; date?: string }[])
          .map((p, i) => ({ _rowKey: newRowKey(), name: typeof p.name === "string" ? p.name : "", amount: typeof p.amount === "number" ? String(p.amount) : typeof p.amount === "string" ? p.amount : "", date: typeof p.date === "string" ? p.date : "" }))
      : init.structure_parts,
    // Extras (spec 5b)
    extras: Array.isArray(f.extras)
      ? (f.extras as { kind?: string; amount?: number | string; condition?: string; rate?: number | string; on?: string }[])
          .map((e, i) => ({ _rowKey: newRowKey(), kind: e.kind === "commission" ? "commission" : "bonus", amount: typeof e.amount === "number" ? String(e.amount) : typeof e.amount === "string" ? e.amount : "", condition: typeof e.condition === "string" ? e.condition : "", rate: typeof e.rate === "number" ? String(e.rate) : typeof e.rate === "string" ? e.rate : "", on_text: typeof e.on === "string" ? e.on : "", earned: false }))
      : init.extras,
  };
}
function newRowKey(): string {
  return `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

/** Which fields the extractor actually filled (for sparkle markers). */
export function contractAutoFields(f: Record<string, unknown>): (keyof DealFormValues)[] {
  const keys: (keyof DealFormValues)[] = ["brand", "deliverable", "pay_terms", "rep_name", "rep_email"];
  if (f.value_total != null) keys.push("value");
  if (typeof f.due_date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(f.due_date)) keys.push("due_date");
  if (typeof f.exclusivity_days === "number") keys.push("exclusivity_days");
  if (typeof f.revisions_included === "string" && f.revisions_included) keys.push("revisions_included");
  if (Array.isArray(f.post_dates) && f.post_dates.length) keys.push("post_dates");
  // Structure (5a) + extras (5b)
  if (f.payment_structure && Object.keys(f.payment_structure as Record<string, unknown>).length) keys.push("payment_structure");
  if (Array.isArray(f.extras) && f.extras.length) keys.push("extras");
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
  // Spec 5d: payment terms missing/unclear -> default to All at once / Net 30 and flag the Paid field.
  if (!f.payment_structure || typeof f.payment_structure !== "object") {
    flags.push({ key: "payment_structure", reason: "Payment terms were unclear, so this defaults to All at once, Net 30. Confirm how you actually get paid." });
  }
  if ((f.value_total as number) === 0) flags.push({ key: "value", reason: "Amount read as $0, likely for a pro-bono or fee-gifted deal. Confirm it." });
  return flags;
}

export type DealFormValues = {
  brand: string;
  deliverable: string;
  value: string;
  status: string;            // deal lifecycle: active / pipeline / archived
  due_date: string;
  pay_terms: string;         // legacy, retired in the modal UI (kept for back-compat)
  exclusivity_days: string;
  revisions_included: string; // whole number, "Unlimited", or "" = Not set
  rep_name: string;
  rep_email: string;
  links: { url: string; label?: string }[];
  notes: string;
  // PostDate carries _rowKey (stable client key) for remount-safe rows; the
  // payload strips it before sending.
  post_dates: PostDate[];
  // Release 1/2: payment structure + extras (spec 4).
  payment_structure: "once" | "split" | "parts" | "monthly";
  structure_timing: string;        // once: when_posts|net_15|net_30|net_45|net_60
  structure_upfront_pct: number;   // split: 25|30|40|50
  structure_balance_timing: string;// split: when_posts|net_15|net_30|net_60
  structure_months: number;        // monthly: 3|6|12
  structure_parts: { _rowKey: string; name: string; amount: string; date: string }[];
  extras: {
    _rowKey: string; kind: "bonus" | "commission";
    amount: string; condition: string; rate: string; on_text: string; earned: boolean;
  }[];
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

export function emptyDealForm(): DealFormValues {
  return {
    brand: "", deliverable: "", value: "", status: "pipeline",
    due_date: "", pay_terms: "", exclusivity_days: "", revisions_included: "", rep_name: "", rep_email: "",
    links: [], notes: "", post_dates: [],
    payment_structure: "once",
    structure_timing: "net_30",
    structure_upfront_pct: 50,
    structure_balance_timing: "net_30",
    structure_months: 3,
    structure_parts: [],
    extras: [],
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
  paymentNote = null,
  onReplaceFile,
  uploadOnMount,
  onDraftSave,
  onSaved,
  setError,
  onCancel,
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
  /** Exact sentence the contract reader used for payment terms (spec 5c). */
  paymentNote?: string | null;
  onReplaceFile?: () => void;
  uploadOnMount?: boolean;
  /** When set (multi-upload queue row editor), submitting updates the draft instead of creating. */
  onDraftSave?: (v: DealFormValues) => void;
  onSaved: () => void;
  setError: (e: string) => void;
  submitLabel: string;
  pending: boolean;
  onCancel?: () => void;
}) {
  const supabase = createClient();
  const [v, setV] = useState<DealFormValues>(initial);
  const [busy, setBusy] = useState(false);
  // Idempotency key generated once per form mount — a retried/double submit
  // reuses it, so the server returns the already-created deal instead of a dup.
  const idemKey = useRef<string>(typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now() + Math.random())).current;
  const [savedFlash, setSavedFlash] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [stagedText, setStagedText] = useState(""); // extracted contract text for assistant ingest
  const [dragOver, setDragOver] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof DealFormValues>(k: K, val: DealFormValues[K]) => setV((p) => ({ ...p, [k]: val }));

  // Self-promotion: a contract chosen in the manual state extracts and flips this same
  // component into its review state (no second modal).
  const [selfReview, setSelfReview] = useState<{ auto: string[]; flags: DealFlag[]; paymentNote: string | null } | null>(null);
  const isReview = variant === "review" || (mode === "create" && !!selfReview);
  const effectiveAuto = selfReview ? selfReview.auto : autoFields;
  const effectiveFlags = selfReview ? selfReview.flags : flagged;
  // The exact sentence the reader used for payment terms (spec 5c).
  const effectivePaymentNote = selfReview ? selfReview.paymentNote : (typeof paymentNote === "string" ? paymentNote : null);

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
      setSelfReview({
        auto: contractAutoFields(data.fields ?? {}),
        flags: contractFlags(data.fields ?? {}),
        paymentNote: typeof data.fields?.payment_note === "string" ? data.fields.payment_note : null,
      });
    } catch {
      setError("Could not read the contract.");
    } finally {
      setExtracting(false);
    }
  };

  const doSubmit = async () => {
    if (busy) return; // double-submit guard on the client too
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); return; }

    const payload: Record<string, unknown> = {
      deliverable: v.deliverable.trim() || null,
      value: v.value ? Number(v.value) : null,
      status: v.status,
      due_date: v.due_date || null,
      pay_terms: v.pay_terms || null,
      exclusivity_days: v.exclusivity_days ? Number(v.exclusivity_days) : null,
      revisions_included: v.revisions_included.trim() || null,
      rep_name: v.rep_name.trim() || null,
      rep_email: v.rep_email.trim() || null,
      links: v.links.filter((l) => l.url).map((l) => ({ url: l.url, label: l.label || l.url })),
      notes: v.notes.trim() || null,
      // Post dates persist as content rows (server-side). Removed from any
      // edit path — the drawer owns editing content rows directly.
      post_dates: v.post_dates
        .filter((p) => p.date)
        .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
        .map((p) => ({ date: p.date, label: p.label, kind: p.kind ?? null })),
      active: v.status !== "archived",
      // Release 1/2: structure + extras (spec 4/5). The server generates the
      // payment rows from this; parts carry their own name/amount/date.
      payment_structure: v.payment_structure,
      structure_timing: v.payment_structure === "once" ? (v.structure_timing || null) : null,
      structure_upfront_pct: v.payment_structure === "split" ? v.structure_upfront_pct : null,
      structure_balance_timing: v.payment_structure === "split" ? (v.structure_balance_timing || null) : null,
      structure_months: v.payment_structure === "monthly" ? v.structure_months : null,
      structure_parts: v.payment_structure === "parts"
        ? v.structure_parts.filter((p) => p.amount || p.date).map((p) => ({ name: p.name || null, amount: p.amount ? Number(p.amount) : null, date: p.date || null }))
        : [],
      extras: v.extras.filter((e) => e.kind === "bonus" ? (e.amount || e.condition) : (e.rate || e.on_text)).map((e) => ({
        kind: e.kind, amount: e.kind === "bonus" ? (e.amount ? Number(e.amount) : null) : null, condition: e.condition || null,
        rate: e.kind === "commission" ? (e.rate ? Number(e.rate) : null) : null, on_text: e.on_text || null, earned: e.earned,
      })),
    };

    const srcFile = contractFile || stagedFile;
    if (mode === "create") {
      if (onDraftSave) { onDraftSave(v); return; }
      setBusy(true); setError("");
      try {
        // Server-side create with idempotency: repeated submit with the same key
        // (a slow retry / double-click) returns the existing deal, never a dup.
        const res = await fetch("/api/deals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brand: v.brand.trim(), payload, idempotencyKey: idemKey, text: stagedText.trim() || undefined }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data?.error || "Could not create the deal."); return; }
        const createdId = (data?.deal as { id?: string } | undefined)?.id;
        const isDup = data?.duplicate === true;
        // Upload the contract file on the FIRST (non-duplicate) insert — a
        // retried submit already persisted it.
        if (srcFile && createdId && !isDup) {
          const path = `${user.id}/${createdId}/${Date.now()}-${srcFile.name}`;
          await supabase.storage.from("deal-files").upload(path, srcFile);
          await supabase.from("deal_files").insert({ user_id: user.id, deal_id: createdId, name: srcFile.name, path, size_bytes: srcFile.size, mime: srcFile.type });
        }
      } catch {
        setError("Could not reach the server. Nothing was saved.");
      } finally {
        setBusy(false);
      }
    } else {
      if (!dealId) { setError("Missing deal."); return; }
      // Strip post_dates: they are not a deals column. Editing post dates is
      // owned by the drawer (content rows), never the deal form's edit path.
      const editPayload = { ...payload };
      delete editPayload.post_dates;
      const { error } = await supabase.from("deals").update(editPayload).eq("id", dealId);
      if (error) { setError(error.message); return; }
    }
    onSaved();
    if (mode === "edit") {
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1500);
    }
  };

  const toggle = (k: string) => setOpenSections((p) => ({ ...p, [k]: !p[k] }));

  // ---- one-line summaries for collapsed sections ----
  const repSummary = [v.rep_name.trim(), v.rep_email.trim()].filter(Boolean).join(" · ");
  const detailsSummary = [
    v.due_date ? `Due ${v.due_date}` : null,
    v.exclusivity_days ? `${v.exclusivity_days} days exclusivity` : null,
    v.revisions_included ? `${v.revisions_included} revisions` : null,
  ].filter(Boolean).join(" · ");
  const notesSummary = [
    v.links.filter((l) => l.url).length ? `${v.links.filter((l) => l.url).length} link${v.links.filter((l) => l.url).length > 1 ? "s" : ""}` : null,
    v.notes.trim() ? "notes" : null,
  ].filter(Boolean).join(" · ");

  const spark = (key: keyof DealFormValues) =>
    isReview && effectiveAuto.includes(key) ? <IconAuto size={13} className="text-due shrink-0" data-spark="1" /> : null;

  // Dirty check: only allow a save when the user changed something. Normalize
  // the arrays (links) and blank strings so untouched fields read as equal.
  const norm = (x: DealFormValues): string => JSON.stringify({
    ...x,
    links: x.links.filter((l) => l.url).map((l) => `${l.url}|${l.label || ""}`),
    value: x.value.trim(), deliverable: x.deliverable.trim(), due_date: x.due_date.trim(),
    pay_terms: x.pay_terms.trim(), exclusivity_days: x.exclusivity_days.trim(),
    rep_name: x.rep_name.trim(), rep_email: x.rep_email.trim(), notes: x.notes.trim(),
  });
  const dirty = mode === "edit" && norm(v) !== norm(initial);

  return (
    <div className="space-y-5">
      {/* Review intro subtitle */}
      {isReview && (
        <>
          <p className="text-xs italic text-inksoft -mt-1">Pulled from your contract. Check the flagged fields.</p>
          {effectivePaymentNote && (
            <p className="text-xs text-ink rounded-lg border border-[var(--line2)] bg-[var(--soft)] px-3 py-2 -mt-1">
              <span className="font-medium">From your contract:</span> “{effectivePaymentNote}”
            </p>
          )}
        </>
      )}

      {/* Contract upload: full-width dropzone (manual/create), file strip (review) */}
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
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) uploadContract(f); }}
            role="button"
            aria-label="Upload or drop a contract to auto-fill this deal"
            className={cn(
              "w-full border-2 border-dashed rounded-2xl p-6 cursor-pointer hover:border-[var(--accent)] transition bg-card border-line2 text-left",
              dragOver && "border-[var(--accent)] bg-accent-soft"
            )}
          >
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-xl bg-accent-soft text-accentink grid place-items-center shrink-0">
                {extracting ? <Spinner /> : <IconUpload size={19} />}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-ink">{extracting ? "Reading contract…" : uploadOnMount ? "Start with a contract" : "Drop in a signed contract"}</div>
                <div className="text-xs text-inksoft mt-0.5">and we will fill this in for you. Click to browse or drag a file here. PDF, .txt, .md.</div>
              </div>
            </div>
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
                  <FlagEdit key={f.key} field={f.key} value={v[f.key] as string | { url: string; label?: string }[]} onChange={(x: unknown) => set(f.key, x as never)} />
                </div>
                <p className="text-[11px] text-inksoft mt-0.5">{f.reason}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---- Core: always visible ---- */}
      {mode === "create" && (
        <Field label="Brand *" spark={spark("brand")}><DealInput value={v.brand} onCommit={(val) => set("brand", val)} placeholder="e.g. Glossier" /></Field>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Deal amount" spark={spark("value")}><DealInput type="number" inputMode="decimal" value={v.value} onCommit={(val) => set("value", val)} placeholder="$1,500" /></Field>
        <Field label="Deal status"><Select value={v.status} onChange={(e) => set("status", e.target.value)}>
          {DEAL_STATUSES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Deliverable" spark={spark("deliverable")}><DealInput value={v.deliverable} onCommit={(val) => set("deliverable", val)} placeholder="e.g. 2 IG posts + 1 story" /></Field>
        <Field label="Post date"><DealInput type="date" value={v.post_dates[0]?.date ?? ""} onCommit={(val) => set("post_dates", val ? [newPostDateRow({ date: val }), ...v.post_dates.slice(1)].slice(0, Math.max(1, v.post_dates.length)) : v.post_dates)} /></Field>
      </div>

      {/* ---- Paid: structure + companion (spec 4b) ---- */}
      <Field label="Paid">
        <Select value={v.payment_structure} onChange={(e) => set("payment_structure", e.target.value as DealFormValues["payment_structure"])}>
          <option value="once">All at once</option>
          <option value="split">Upfront + balance</option>
          <option value="parts">In parts</option>
          <option value="monthly">Monthly</option>
        </Select>
      </Field>
      {v.payment_structure === "once" && (
        <Field label="When">
          <Select value={v.structure_timing} onChange={(e) => set("structure_timing", e.target.value)}>
            {STRUCTURE_NET.map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
          </Select>
        </Field>
      )}
      {v.payment_structure === "split" && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Upfront"><Select value={String(v.structure_upfront_pct)} onChange={(e) => set("structure_upfront_pct", Number(e.target.value))}>{[25, 30, 40, 50].map((n) => <option key={n} value={n}>{n}% upfront</option>)}</Select></Field>
          <Field label="Balance"><Select value={v.structure_balance_timing} onChange={(e) => set("structure_balance_timing", e.target.value)}>{STRUCTURE_NET.map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}</Select></Field>
        </div>
      )}
      {v.payment_structure === "monthly" && (
        <Field label="For"><Select value={String(v.structure_months)} onChange={(e) => set("structure_months", Number(e.target.value))}>{[3, 6, 12].map((n) => <option key={n} value={n}>{n} months</option>)}</Select></Field>
      )}
      {v.payment_structure === "parts" && (
        <div className="space-y-2">
          <div className="text-[11px] font-medium text-inksoft">Parts<span className="text-inksoft/60">, one row per payment</span></div>
          {(v.structure_parts.length === 0 ? [{ _rowKey: "p1", name: "1 of 2", amount: "", date: "" }] : v.structure_parts).map((p) => (
            <div key={p._rowKey} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
              <DealInput value={p.name} onCommit={(val) => set("structure_parts", v.structure_parts.map((x) => x._rowKey === p._rowKey ? { ...x, name: val } : x))} placeholder="Name" ariaLabel="Part name" />
              <DealInput type="number" inputMode="decimal" value={p.amount} onCommit={(val) => set("structure_parts", v.structure_parts.map((x) => x._rowKey === p._rowKey ? { ...x, amount: val } : x))} placeholder="Amount" ariaLabel="Part amount" />
              <DealInput type="date" value={p.date} onCommit={(val) => set("structure_parts", v.structure_parts.map((x) => x._rowKey === p._rowKey ? { ...x, date: val } : x))} ariaLabel="Part date" />
              <button type="button" onClick={() => set("structure_parts", v.structure_parts.filter((x) => x._rowKey !== p._rowKey))} className="px-1.5 text-inksoft hover:text-late cursor-pointer" aria-label="Remove part"><IconDelete size={15} /></button>
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={() => set("structure_parts", [...v.structure_parts, { _rowKey: newRowKey(), name: `${v.structure_parts.length + 1} of ${v.structure_parts.length + 1}`, amount: "", date: "" }])}><IconPlus size={14} /> Add a part</Button>
          {(() => {
            const sum = v.structure_parts.reduce((s, p) => s + (Number(p.amount) || 0), 0);
            const deal = Number(v.value) || 0;
            return Math.abs(sum - deal) > 0.005 ? <p className="text-[11.5px] text-late">The parts add up to ${sum.toLocaleString()}. The deal is ${deal.toLocaleString()}.</p> : null;
          })()}
        </div>
      )}

      {/* Payment preview (spec 4c) */}
      <PaymentPreview v={v} />

      {/* Extras (spec 4d), same form as the drawer */}
      <Field label="Extras">
        <div className="space-y-2">
          {v.extras.map((e) => (
            <div key={e._rowKey} className="flex items-center gap-2">
              <span className="text-xs capitalize shrink-0">{e.kind}</span>
              <span className="flex-1 min-w-0 truncate text-xs text-inksoft">
                {e.kind === "bonus" ? (e.amount ? `$${Number(e.amount).toLocaleString()}` : "") + (e.condition ? ` · ${e.condition}` : "") : (e.rate ? `${e.rate}%` : "") + (e.on_text ? ` · on ${e.on_text}` : "")}
              </span>
              <button type="button" onClick={() => set("extras", v.extras.filter((x) => x._rowKey !== e._rowKey))} className="px-1 text-inksoft hover:text-late cursor-pointer" aria-label="Remove extra"><IconDelete size={14} /></button>
            </div>
          ))}
          <AddExtraButton onAdd={(e) => set("extras", [...v.extras, e])} />
        </div>
      </Field>

      {/* Accordion sections */}
      <AccordionSection
        label="Rep contact"
        summary={repSummary || "Add a rep"}
        open={!!openSections.rep}
        onToggle={() => toggle("rep")}
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Rep name" spark={spark("rep_name")}><DealInput value={v.rep_name} onCommit={(val) => set("rep_name", val)} placeholder="e.g. Sam Rivera" /></Field>
          <Field label="Rep email" spark={spark("rep_email")}><DealInput type="email" value={v.rep_email} onCommit={(val) => set("rep_email", val)} placeholder="sam@brand.com" /></Field>
        </div>
      </AccordionSection>

      <AccordionSection
        label="Details"
        summary={detailsSummary || "Due date, exclusivity, revisions"}
        open={!!openSections.terms}
        onToggle={() => toggle("terms")}
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Due date" spark={spark("due_date")}><DealInput type="date" value={v.due_date} onCommit={(val) => set("due_date", val)} /></Field>
          <Field label="Exclusivity (days)" spark={spark("exclusivity_days")}>
            <DealInput type="number" min={0} value={v.exclusivity_days} onCommit={(val) => set("exclusivity_days", val)} placeholder="e.g. 60" />
          </Field>
          <Field label="Revisions included" spark={spark("revisions_included")}>
            <DealInput value={v.revisions_included} onCommit={(val) => set("revisions_included", val)} placeholder="Not set" />
          </Field>
          <div className="text-[11px] text-inksoft/70 self-end pb-1.5">Whole number, or type "Unlimited"</div>
        </div>
      </AccordionSection>

      <AccordionSection
        label="Notes & links"
        summary={notesSummary || "Add notes or a link"}
        open={!!openSections.notes}
        onToggle={() => toggle("notes")}
      >
        <Field label="Notes">
          <DealTextarea value={v.notes} onCommit={(val) => set("notes", val)} placeholder="Any details…" />
        </Field>
        <Field label="Links">
          <div className="space-y-2">
            {v.links.map((l, i) => (
              <div key={"link-" + i} className="flex gap-2">
                <DealInput value={l.url} onCommit={(val) => set("links", v.links.map((x, j) => (i === j) ? { ...x, url: val } : x))} className="flex-1" placeholder="https://…" />
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

      <div className="flex justify-end gap-3">
        {mode === "create" && onCancel && (
          <Button variant="secondary" size="md" onClick={onCancel}>Cancel</Button>
        )}
        <Button onClick={doSubmit} disabled={pending || busy || (mode === "edit" && !dirty)}>
          {pending || busy ? <Spinner /> : savedFlash ? (
            <span className="flex items-center gap-1.5"><IconCheck size={15} /> Saved</span>
          ) : submitLabel}
        </Button>
      </div>
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

/** Standard payment label from a structure (mirrors pay-status, spec 1c). */
const STRUCTURE_NET: [string, string][] = [
  ["when_posts", "When it posts"],
  ["net_15", "Net 15"],
  ["net_30", "Net 30"],
  ["net_45", "Net 45"],
  ["net_60", "Net 60"],
];

/** Standard payment label from a structure (mirrors pay-status, spec 1c). */
function structureRowLabel(kind: DealFormValues["payment_structure"], index0: number, total: number): string {
  if (kind === "monthly") return `Month ${index0 + 1} of ${total}`;
  if (total <= 1) return "Full payment";
  return `${index0 + 1} of ${total}`;
}

/** Plain preview list of the payments that will be created (spec 4c).
 *  Uses the SAME generator the create API uses, so the preview shows exactly
 *  the rows that will be inserted. */
function PaymentPreview({ v }: { v: DealFormValues }) {
  const deal = Number(v.value) || 0;
  const rows = generatePaymentsFromStructure({
    structureKind: v.payment_structure,
    amount: deal || null,
    structure_timing: v.structure_timing || null,
    structure_upfront_pct: v.structure_upfront_pct,
    structure_balance_timing: v.structure_balance_timing || null,
    structure_months: v.structure_months,
    post_date: v.post_dates[0]?.date || null,
    parts: v.structure_parts.map((p) => ({ name: p.name, amount: p.amount ? Number(p.amount) : null, date: p.date || null })),
  });
  const labels = rows.map((_, i) => structureRowLabel(v.payment_structure, i, rows.length));
  return <Rows rows={rows.map((r, i) => ({ label: r.notes || labels[i], due: r.expected_date ? `Due ${friendlyDate(r.expected_date)}` : "No due date", amount: r.amount ?? 0 }))} />;
}
function friendlyDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function Rows({ rows }: { rows: { label: string; due: string; amount: number }[] }) {
  return (
    <div className="rounded-lg border border-line bg-card2/50 px-3 py-2 space-y-1">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="flex-1 min-w-0 truncate text-ink font-medium">{r.label}</span>
          <span className="text-inksoft shrink-0">{r.due}</span>
          <span className="money tabular-nums shrink-0 text-ink">{r.amount ? `$${r.amount.toLocaleString()}` : "—"}</span>
        </div>
      ))}
    </div>
  );
}

type ExtraDraft = DealFormValues["extras"][number];
/** "+ Add bonus or commission": small inline form (same as the drawer). */
function AddExtraButton({ onAdd }: { onAdd: (e: ExtraDraft) => void }) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<"bonus" | "commission">("bonus");
  const [amount, setAmount] = useState("");
  const [cond, setCond] = useState("");
  const [rate, setRate] = useState("");
  const [on, setOn] = useState("");
  if (!open) {
    return <Button variant="secondary" size="sm" onClick={() => setOpen(true)}><IconPlus size={14} /> Add bonus or commission</Button>;
  }
  return (
    <div className="rounded-lg border border-line2 bg-card2/40 px-2.5 py-2 space-y-2">
      <Select value={kind} onChange={(e) => setKind(e.target.value as "bonus" | "commission")} aria-label="Extra type">
        <option value="bonus">Bonus</option>
        <option value="commission">Commission</option>
      </Select>
      {kind === "bonus" ? (
        <>
          <DealInput type="number" inputMode="decimal" value={amount} onCommit={setAmount} placeholder="Amount" ariaLabel="Bonus amount" />
          <DealInput value={cond} onCommit={setCond} placeholder="Condition, e.g. the Reel passes 100K views" ariaLabel="Bonus condition" />
        </>
      ) : (
        <>
          <DealInput type="number" inputMode="decimal" value={rate} onCommit={setRate} placeholder="Rate (%)" ariaLabel="Commission rate" />
          <DealInput value={on} onCommit={setOn} placeholder="On what, e.g. sales with code CAMBO10" ariaLabel="Commission applies to" />
        </>
      )}
      <div className="flex justify-end gap-2">
        <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
        <Button size="sm" disabled={kind === "bonus" ? !amount : !rate} onClick={() => {
          onAdd({ _rowKey: newRowKey(), kind, amount, condition: cond, rate, on_text: on, earned: false });
          setOpen(false); setAmount(""); setCond(""); setRate(""); setOn("");
        }}>Add</Button>
      </div>
    </div>
  );
}

/** Inline mini-editor for a flagged field, so the user can fix it right in the attention block. */
function FlagEdit({ field, value, onChange }: { field: keyof DealFormValues; value: string | { url: string; label?: string }[]; onChange: (x: string) => void }) {
  if (typeof value !== "string") return null;
  if (field === "due_date") return <DealInput type="date" value={value} onCommit={(v) => onChange(v)} className={`${inputFieldCls} !h-7 !text-xs`} />;
  if (field === "exclusivity_days" || field === "value" ) return <DealInput type="number" value={value} onCommit={(v) => onChange(v)} className={`${inputFieldCls} !h-7 !text-xs !w-28`} />;
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
  return <DealInput value={value} onCommit={(v) => onChange(v)} className={`${inputFieldCls} !h-7 !text-xs flex-1`} />;
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
        <span className={cn("text-xs text-inksoft truncate max-w-[62%] text-right", !open && "italic")}>
          {open ? "Hide" : summary}
        </span>
        <svg className={cn("chev shrink-0 transition-transform", open && "rotate-90")} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 6l6 6-6 6" /></svg>
      </button>
      {open && <div className="px-3 pb-3 pt-1 space-y-3 border-t border-line">{children}</div>}
    </div>
  );
}