"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { IconInfo, IconDelete, IconLink } from "@/components/icons";
import { Button, Input, Select, Textarea, Spinner } from "@/components/ui";

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
  { value: "pipeline", label: "Pipeline" },
  { value: "archived", label: "Archived" },
];
const PAYMENT_STATUSES = [
  { value: "expected", label: "Expected" },
  { value: "paid", label: "Paid" },
  { value: "none", label: "No payment tracked" },
];

export function emptyDealForm(): DealFormValues {
  return {
    brand: "", deliverable: "", value: "", status: "active", payment_status: "expected",
    due_date: "", pay_terms: "", exclusivity_days: "", rep_name: "", rep_email: "",
    nudge_mode: "draft", links: [], notes: "",
  };
}

/** Shared deal form — same full option set whether creating or editing. */
export function DealForm({
  mode,
  dealId,
  initial,
  uploadOnMount,
  onSaved,
  setError,
  submitLabel,
  pending,
}: {
  mode: "create" | "edit";
  dealId?: string | null;
  initial: DealFormValues;
  uploadOnMount?: boolean;
  onSaved: () => void;
  setError: (e: string) => void;
  submitLabel: string;
  pending: boolean;
}) {
  const supabase = createClient();
  const [v, setV] = useState<DealFormValues>(initial);
  const [extracting, setExtracting] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<{ file: File; extracted: boolean }[]>([]);
  const [plan, setPlan] = useState<"free" | "paid">("free");
  const fileRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof DealFormValues>(k: K, val: DealFormValues[K]) => setV((p) => ({ ...p, [k]: val }));

  // The file picker is opened by clicking the dropzone only; we never auto-open
// the native finder when the modal appears.

  const applyExtracted = (f: Record<string, unknown>) => {
    setV((p) => ({
      ...p,
      brand: (typeof f.brand === "string" ? f.brand : p.brand) || p.brand,
      deliverable: typeof f.deliverable === "string" ? f.deliverable : p.deliverable,
      value: typeof f.value_total === "number" ? String(f.value_total) : typeof f.value_total === "string" ? f.value_total : p.value,
      pay_terms: typeof f.pay_terms === "string" && PAY_TERM_OPTIONS.some((o) => o.value === f.pay_terms) ? f.pay_terms : p.pay_terms,
      exclusivity_days: typeof f.exclusivity_days === "number" ? String(f.exclusivity_days) : p.exclusivity_days,
      due_date: typeof f.due_date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(f.due_date) ? f.due_date : p.due_date,
      rep_name: typeof f.rep_name === "string" ? f.rep_name : p.rep_name,
      rep_email: typeof f.rep_email === "string" ? f.rep_email : p.rep_email,
      notes: typeof f.platforms === "string" && f.platforms ? (p.notes ? `${p.notes}\n\nPlatforms: ${f.platforms}` : `Platforms: ${f.platforms}`) : p.notes,
    }));
  };

  const uploadContract = async (file: File) => {
    setExtracting(true); setError("");
    // A contract attached at creation is a paid-tier file upload. Free users
    // can still upload to auto-fill (that reads the file without storing it),
    // but skip persisting the file.
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/deals/extract-contract", { method: "POST", body: fd });
      const data = await res.json();
      setStagedFiles((prev) => [...prev, { file, extracted: false }]);
      if (!res.ok) { setError(data.error || "Could not read the contract. The file is saved to the deal's Files tab."); return; }
      applyExtracted(data.fields ?? {});
      setError("");
    } catch {
      setError("Could not read the contract.");
    } finally {
      setExtracting(false);
    }
  };

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

  const submit = async () => {
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

    if (mode === "create") {
      const { data: created, error } = await supabase.from("deals").insert({ user_id: user.id, brand: v.brand.trim(), ...payload }).select("id").single();
      if (error) { setError(error.message); return; }
      const createdId = (created as unknown as { id?: string } | null)?.id;
      // Persist any contract files attached at creation into the deal's Files
      // tab (same destination as files added later). Paid tier only; free
      // users' staged files are not stored (they uploaded only to auto-fill).
      if (plan === "paid" && stagedFiles.length && createdId) {
        for (const { file } of stagedFiles) {
          const path = `${user.id}/${createdId}/${Date.now()}-${file.name}`;
          await supabase.storage.from("deal-files").upload(path, file);
          await supabase.from("deal_files").insert({ user_id: user.id, deal_id: createdId, name: file.name, path, size_bytes: file.size, mime: file.type });
        }
      }
    } else {
      if (!dealId) { setError("Missing deal."); return; }
      const { error } = await supabase.from("deals").update(payload).eq("id", dealId);
      if (error) { setError(error.message); return; }
    }
    onSaved();
  };

  return (
    <div className="space-y-4">
      {mode === "create" && (
        <div>
          <label className={cn("flex items-center gap-3 rounded-xl border border-dashed px-4 py-3 cursor-pointer hover:border-accent transition-colors", uploadOnMount ? "border-accent/40 bg-accenttint" : "border-line2 bg-card2")}>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.txt,.md,text/plain,application/pdf"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadContract(f); e.target.value = ""; }}
            />
            <span className="shrink-0 h-9 w-9 rounded-lg accent-soft grid place-items-center text-accentink">
              {extracting ? <Spinner /> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 16V4M12 4L7 9M12 4l5 5M4 20h16" /></svg>}
            </span>
            <span className="text-sm">
              <span className="font-medium">{extracting ? "Reading contract…" : uploadOnMount ? "Start with a contract" : "Upload a contract to auto-fill"}</span>
              <span className="block text-xs text-inksoft">{plan === "paid" ? "Upload a PDF or text file. Talby pulls the deal terms, and saves the file to the deal." : "Upload a PDF to auto-fill the deal terms."}</span>
            </span>
          </label>
          {plan !== "paid" && stagedFiles.length === 0 && (
            <p className="text-xs text-inksoft mt-1.5 ml-1">
              Saving contract files is on the paid plan. Go unlimited to keep the file attached to the deal.
            </p>
          )}
          {stagedFiles.length > 0 && (
            <ul className="mt-2 space-y-1">
              {stagedFiles.map((s, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="truncate flex-1">{s.file.name}</span>
                  {plan === "free" ? (
                    <span className="text-[11px] font-semibold text-due shrink-0">Paid plan keeps files</span>
                  ) : (
                    <button onClick={() => setStagedFiles(stagedFiles.filter((_, j) => j !== i))} className="text-inksoft hover:text-late cursor-pointer shrink-0" aria-label="Remove file"><IconDelete size={14} /></button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {plan === "free" && stagedFiles.length > 0 && (
            <a href="/pricing" className="inline-block mt-2"><Button size="sm" variant="secondary">Go unlimited to save files</Button></a>
          )}
        </div>
      )}

      {mode === "create" && (
        <Field label="Brand *"><Input value={v.brand} onChange={(e) => set("brand", e.target.value)} placeholder="e.g. Glossier" /></Field>
      )}

      <Field label="Deliverable"><Input value={v.deliverable} onChange={(e) => set("deliverable", e.target.value)} placeholder="e.g. 2 IG posts + 1 story" /></Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Value ($)"><Input type="number" value={v.value} onChange={(e) => set("value", e.target.value)} placeholder="1500" /></Field>
        <Field label="Due date"><Input type="date" value={v.due_date} onChange={(e) => set("due_date", e.target.value)} /></Field>
      </div>

      {/* Deal status (lifecycle) + payment status (money) — now split */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Deal status">
          <Select value={v.status} onChange={(e) => set("status", e.target.value)}>
            {DEAL_STATUSES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
        <Field label="Payment status">
          <Select value={v.payment_status} onChange={(e) => set("payment_status", e.target.value)}>
            {PAYMENT_STATUSES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
      </div>

      {/* Pay terms + exclusivity */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Pay terms">
          <Select value={v.pay_terms} onChange={(e) => set("pay_terms", e.target.value)}>
            {PAY_TERM_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
        <Field label="Exclusivity (days)">
          <Input type="number" min={0} value={v.exclusivity_days} onChange={(e) => set("exclusivity_days", e.target.value)} placeholder="e.g. 60" />
        </Field>
      </div>

      {/* Rep contact + nudging (paid feature) */}
      <div className="border-t border-line pt-4">
        <div className="text-[12px] font-semibold uppercase tracking-wide text-inkfaint mb-3">Rep contact</div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Rep name"><Input value={v.rep_name} onChange={(e) => set("rep_name", e.target.value)} placeholder="e.g. Sam Rivera" /></Field>
          <Field label="Rep email"><Input type="email" value={v.rep_email} onChange={(e) => set("rep_email", e.target.value)} placeholder="sam@brand.com" /></Field>
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
          <p className="text-xs text-due -mt-1">
            Auto mode sends follow-ups from your Gmail on schedule. Talby will send up to your max nudges, then stop. Mark the payment received anytime to stop it instantly.
          </p>
        )}
      </div>

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

      <Field label="Notes"><Textarea value={v.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Any details…" /></Field>

      <div className="flex justify-end"><Button onClick={submit} disabled={pending}>{pending ? <Spinner /> : submitLabel}</Button></div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink block mb-1.5">
        {label}
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