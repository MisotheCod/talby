"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FREE_ACTIVE_DEAL_CAP } from "@/lib/config";
import { IconClose, IconUpload, IconDelete } from "@/components/icons";
import { Button, Input, Spinner } from "@/components/ui";
import { DealForm, emptyDealForm, type DealFormValues } from "@/components/deal-form";
import { useCelebration } from "@/components/confetti";

type ContractDraft = DealFormValues & { __name?: string };

/**
 * Unified Upload modal. Opens with ONLY a dropzone (never auto-opens the
 * native file picker). Clicking the dropzone opens the Finder.
 *
 * Flow depends on what's chosen:
 *  - one contract (PDF/txt/md) -> extract -> prefilled DealForm (create)
 *  - multiple contracts        -> extract each -> review list -> "Add N deals"
 *  - CSV                        -> bulk spreadsheet import (ImportDeals page)
 */
export default function UploadModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const supabase = createClient();
  const router = useRouter();
  const celeb = useCelebration();
  const fileRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<"pick" | "single" | "multi">("pick");
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState("");
  const [single, setSingle] = useState<DealFormValues>(emptyDealForm());
  const [drafts, setDrafts] = useState<ContractDraft[]>([]);
  const [saving, setSaving] = useState(false);
  const [plan, setPlan] = useState<"free" | "paid">("free");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const p = await supabase.from("profiles").select("plan").eq("id", user.id).single();
        setPlan(((p.data as unknown as { plan: string } | null)?.plan ?? "free") as "free" | "paid");
      }
    })();
  }, [supabase]);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    e.target.value = "";
    if (!files.length) return;
    setError("");

    // A CSV anywhere means spreadsheet import regardless of other selections.
    const anyCsv = files.some((f) => f.name.toLowerCase().endsWith(".csv") || f.type === "text/csv");
    if (anyCsv) {
      onClose();
      router.push("/app/import");
      return;
    }

    setExtracting(true);
    const results: ContractDraft[] = [];
    let firstErr = "";
    for (const f of files) {
      const fd = new FormData();
      fd.append("file", f);
      try {
        const res = await fetch("/api/deals/extract-contract", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) { firstErr = firstErr || data.error || "One or more files could not be read."; continue; }
        results.push({ ...applyFields(data.fields ?? {}), __name: f.name });
      } catch {
        firstErr = firstErr || "Could not reach the contract parser for one or more files.";
      }
    }
    setExtracting(false);

    if (!results.length) { setError(firstErr || "None of those files could be read."); return; }
    if (results.length === 1) { setSingle(results[0]); setPhase("single"); }
    else { setDrafts(results); setPhase("multi"); }
  };

  const onCreated = () => {
    celeb.fire();
    onSaved();
  };

  const setDraft = (i: number, patch: Partial<DealFormValues>) =>
    setDrafts((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));

  const removeDraft = (i: number) => setDrafts((prev) => {
    const next = prev.filter((_, idx) => idx !== i);
    if (next.length === 1) { setSingle(next[0]); setPhase("single"); }
    else if (next.length === 0) setPhase("pick");
    return next;
  });

  const saveAll = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); return; }
    const valid = drafts.filter((d) => d.brand.trim());
    if (!valid.length) { setError("Add a brand to at least one contract."); return; }
    setSaving(true); setError("");
    // Free-plan cap guard (the DB trigger is the real enforcement).
    if (plan === "free") {
      const activeToAdd = valid.filter((d) => d.status !== "archived").length;
      const { count } = await supabase.from("deals").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("active", true);
      if ((count ?? 0) + activeToAdd > FREE_ACTIVE_DEAL_CAP) {
        setError(`You've reached the free plan's limit of ${FREE_ACTIVE_DEAL_CAP} active deals.`);
        setSaving(false);
        return;
      }
    }
    let added = 0;
    for (const d of valid) {
      const payload: Record<string, unknown> = {
        deliverable: d.deliverable.trim() || null,
        value: d.value ? Number(d.value) : null,
        status: d.status,
        payment_status: d.payment_status,
        due_date: d.due_date || null,
        pay_terms: d.pay_terms || null,
        exclusivity_days: d.exclusivity_days ? Number(d.exclusivity_days) : null,
        rep_name: d.rep_name.trim() || null,
        rep_email: d.rep_email.trim() || null,
        nudge_mode: d.nudge_mode,
        notes: d.notes.trim() || null,
        active: d.status !== "archived",
      };
      const { error: insErr } = await supabase.from("deals").insert({ user_id: user.id, brand: d.brand.trim(), ...payload });
      if (insErr) { setError(insErr.message); break; }
      added++;
    }
    setSaving(false);
    if (added) { celeb.fire(); onSaved(); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div
        className="bg-card w-full max-w-lg p-6 rounded-2xl border border-line2 shadow-pop fade-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{phase === "pick" ? "Upload" : phase === "multi" ? "Review your deals" : "Review your deal"}</h2>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg hover:bg-card2 cursor-pointer"><IconClose size={18} /></button>
        </div>

        {error && <p className="text-sm text-late mb-4" role="alert">{error}</p>}

        {phase === "pick" && (
          <div>
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-line2 rounded-2xl p-12 text-center cursor-pointer hover:border-[var(--accent)] transition bg-card"
            >
              <span className="h-12 w-12 rounded-2xl bg-accenttint text-accentink grid place-items-center mx-auto">{extracting ? <Spinner /> : <IconUpload size={22} />}</span>
              <span className="block font-semibold mt-3 text-ink">{extracting ? "Reading contracts…" : "Drop files or click to browse"}</span>
              <span className="block text-[13px] text-inksoft mt-1">Select contracts (PDF, .txt, .md) or a CSV spreadsheet.</span>
            </button>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl border border-line2 p-3">
                <div className="text-[13px] font-semibold">Contracts</div>
                <div className="text-[12px] text-inksoft mt-0.5">PDF, .txt, .md, one deal each</div>
              </div>
              <div className="rounded-xl border border-line2 p-3">
                <div className="text-[13px] font-semibold">Spreadsheet</div>
                <div className="text-[12px] text-inksoft mt-0.5">CSV, one row per deal</div>
              </div>
            </div>
            <input ref={fileRef} type="file" multiple accept=".pdf,.txt,.md,.csv,text/plain,application/pdf,text/csv" className="hidden" onChange={onFile} />
          </div>
        )}

        {phase === "single" && (
          <>
            {plan === "free" && (
              <p className="text-[12px] text-inksoft mb-3">You&apos;re on the free plan ({FREE_ACTIVE_DEAL_CAP} active deals). Adding a deal uses one slot.</p>
            )}
            <DealForm mode="create" initial={single} onSaved={onCreated} setError={setError} pending={false} submitLabel="Add deal" />
          </>
        )}

        {phase === "multi" && (
          <div>
            <p className="text-sm text-inksoft mb-3">{drafts.length} contracts read. Review the details, then add them all at once.</p>
            <div className="max-h-[44vh] overflow-y-auto space-y-3 pr-1">
              {drafts.map((d, i) => (
                <div key={i} className="rounded-xl border border-line2 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-inkfaint truncate">{d.__name || `Contract ${i + 1}`}</span>
                    <button onClick={() => removeDraft(i)} className="text-inksoft hover:text-late cursor-pointer p-0.5" aria-label={`Remove contract ${i + 1}`}><IconDelete size={14} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Brand">
                      <Input value={d.brand} onChange={(e) => setDraft(i, { brand: e.target.value })} placeholder="Brand" />
                    </Field>
                    <Field label="Value ($)">
                      <Input type="number" value={d.value} onChange={(e) => setDraft(i, { value: e.target.value })} placeholder="1500" />
                    </Field>
                  </div>
                  <Field label="Deliverable">
                    <Input value={d.deliverable} onChange={(e) => setDraft(i, { deliverable: e.target.value })} placeholder="e.g. 2 Reels + 3 Stories" />
                  </Field>
                  <Field label="Due date">
                    <Input type="date" value={d.due_date} onChange={(e) => setDraft(i, { due_date: e.target.value })} />
                  </Field>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={onClose}>Cancel</Button>
              <Button onClick={saveAll} disabled={saving}>{saving ? <Spinner /> : `Add ${drafts.filter((d) => d.brand.trim()).length} deals`}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mb-2">
      <span className="block text-[12px] font-medium text-inksoft mb-1">{label}</span>
      {children}
    </label>
  );
}

// Map the contract-extraction JSON onto DealFormValues.
function applyFields(f: Record<string, unknown>): DealFormValues {
  const initEmpty = emptyDealForm();
  const val = f.value_total;
  return {
    ...initEmpty,
    brand: typeof f.brand === "string" ? f.brand : initEmpty.brand,
    deliverable: typeof f.deliverable === "string" ? f.deliverable : initEmpty.deliverable,
    value: typeof val === "number" ? String(val) : typeof val === "string" ? val : initEmpty.value,
    pay_terms: typeof f.pay_terms === "string" ? f.pay_terms : initEmpty.pay_terms,
    exclusivity_days: typeof f.exclusivity_days === "number" ? String(f.exclusivity_days) : typeof f.exclusivity_days === "string" ? f.exclusivity_days : initEmpty.exclusivity_days,
    due_date: typeof f.due_date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(f.due_date) ? f.due_date : initEmpty.due_date,
    rep_name: typeof f.rep_name === "string" ? f.rep_name : initEmpty.rep_name,
    rep_email: typeof f.rep_email === "string" ? f.rep_email : initEmpty.rep_email,
    notes: typeof f.platforms === "string" && f.platforms ? (initEmpty.notes ? `${initEmpty.notes}\nPlatforms: ${f.platforms}` : `Platforms: ${f.platforms}`) : initEmpty.notes,
  };
}