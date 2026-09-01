"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FREE_ACTIVE_DEAL_CAP } from "@/lib/constants";
import { IconClose, IconUpload, IconDelete } from "@/components/icons";
import { Button, Spinner, StatusPill } from "@/components/ui";
import {
  DealForm, emptyDealForm, applyContractFields, contractAutoFields, contractFlags,
  type DealFormValues, type DealFlag,
} from "@/components/deal-form";
import { useCelebration } from "@/components/confetti";

type ContractDraft = DealFormValues & { __name?: string; __auto?: (keyof DealFormValues)[]; __flags?: DealFlag[]; __file?: File; __text?: string };

/**
 * Unified Upload modal. Opens with ONLY a dropzone (never auto-opens the native
 * file picker). Clicking the dropzone opens the Finder.
 *
 * Flow depends on what's chosen:
 *  - one contract (PDF/txt/md) -> extract -> review state (shared DealForm)
 *  - multiple contracts        -> extract each -> queue screen -> "Add N deals"
 *  - CSV                        -> bulk spreadsheet import (ImportDeals page)
 */
export default function UploadModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const supabase = createClient();
  const router = useRouter();
  const celeb = useCelebration();
  const fileRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<"pick" | "single" | "multi" | "edit">("pick");
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState("");
  const [single, setSingle] = useState<ContractDraft>({ ...emptyDealForm() });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<ContractDraft[]>([]);
  const [saving, setSaving] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
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
      // Pass the selected files to the import page so they're parsed immediately
      // (instead of dropping them and making the user re-upload).
      const csvFiles = files.filter((f) => f.name.toLowerCase().endsWith(".csv") || f.type === "text/csv");
      onClose();
      try {
        sessionStorage.setItem("talby_pending_import", JSON.stringify(
          await Promise.all(csvFiles.map(async (f) => ({
            name: f.name, text: await f.text(),
          })))
        ));
      } catch { /* non-fatal: if storage fails, just navigate; page falls back to manual upload */ }
      router.push("/app/import?source=csv");
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
        const fields = data.fields ?? {};
        results.push({
          ...applyContractFields(fields),
          __name: f.name, __file: f, __text: typeof data.text === "string" ? data.text : undefined,
          __auto: contractAutoFields(fields),
          __flags: contractFlags(fields),
        });
      } catch {
        firstErr = firstErr || "Could not reach the contract parser for one or more files.";
      }
    }
    setExtracting(false);

    if (!results.length) { setError(firstErr || "None of those files could be read."); return; }
    if (results.length === 1) { setSingle(results[0]); setPhase("single"); }
    else { setDrafts(results); setPhase("multi"); }
  };

  const onCreated = () => { celeb.fire(); onSaved(); };

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
      const { data: created, error: insErr } = await supabase.from("deals").insert({ user_id: user.id, brand: d.brand.trim(), ...payload }).select("id").single();
      if (insErr) { setError(insErr.message); break; }
      // Persist each contract into its deal's Files tab (paid tier only).
      if (plan === "paid" && (d.__file as File | undefined)) {
        const createdId = (created as unknown as { id?: string } | null)?.id;
        if (createdId) {
          const path = `${user.id}/${createdId}/${Date.now()}-${d.__file!.name}`;
          await supabase.storage.from("deal-files").upload(path, d.__file!);
          await supabase.from("deal_files").insert({ user_id: user.id, deal_id: createdId, name: d.__file!.name, path, size_bytes: d.__file!.size, mime: d.__file!.type });
          // Ingest the extracted contract text for assistant Q&A.
          if (d.__text?.trim()) {
            try {
              await fetch("/api/assistant/ingest", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dealId: createdId, text: d.__text }),
              });
            } catch { /* non-fatal; deal already saved */ }
          }
        }
      }
      added++;
    }
    setSaving(false);
    if (added) { celeb.fire(); onSaved(); }
  };

  const title = phase === "pick" ? "Upload" : phase === "multi" ? "Review your deals" : phase === "edit" ? "Review contract" : "Review your deal";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => { if (!confirmCancel) onClose(); }}>
      <div
        className="bg-card w-full max-w-lg p-6 rounded-2xl border border-line2 shadow-pop fade-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={() => { if (!confirmCancel) onClose(); }} aria-label="Close" className="p-1.5 rounded-lg hover:bg-card2 cursor-pointer"><IconClose size={18} /></button>
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
              <span className="block text-[13px] text-inksoft mt-1">Select one or more contracts (PDF, .txt, .md) or a CSV spreadsheet.</span>
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
          <DealForm
            mode="create"
            variant="review"
            initial={single}
            filename={single.__name}
            contractFile={single.__file}
            autoFields={single.__auto}
            flagged={single.__flags}
            onReplaceFile={() => setPhase("pick")}
            onSaved={onCreated}
            setError={setError}
            pending={saving}
            submitLabel="Add deal"
          />
        )}

        {phase === "edit" && editingIndex !== null && (
          <DealForm
            mode="create"
            variant="review"
            initial={drafts[editingIndex] || emptyDealForm()}
            filename={drafts[editingIndex]?.__name}
            contractFile={drafts[editingIndex]?.__file}
            autoFields={drafts[editingIndex]?.__auto}
            flagged={drafts[editingIndex]?.__flags}
            onDraftSave={(v) => { setDraft(editingIndex, v); setEditingIndex(null); setPhase("multi"); }}
            onSaved={() => { setEditingIndex(null); setPhase("multi"); }}
            setError={setError}
            pending={saving}
            submitLabel="Save & back to queue"
          />
        )}

        {phase === "multi" && (
          <div>
            <p className="text-sm text-inksoft mb-3">Review each, then add them all at once.</p>
            <div className="max-h-[44vh] overflow-y-auto space-y-2 pr-1">
              {drafts.map((d, i) => {
                const hasFlags = (d.__flags?.length ?? 0) > 0;
                const brand = d.brand.trim() || "Unnamed deal";
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setEditingIndex(i); setPhase("edit"); }}
                    className="w-full flex items-center gap-3 rounded-xl border border-line2 p-3 hover:border-[var(--accent)] transition text-left cursor-pointer"
                  >
                    <span className="h-9 w-9 rounded-lg grid place-items-center font-bold bg-card2 text-inksoft border border-line shrink-0">{brand.charAt(0).toUpperCase()}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium truncate">{brand}</span>
                      <span className="block text-xs text-inksoft truncate">{d.value ? `$${Number(d.value).toLocaleString()}` : d.deliverable ? d.deliverable : d.__name || `Contract ${i + 1}`}</span>
                    </span>
                    {hasFlags ? (
                      <StatusPill kind="due">{`Review · ${d.__flags!.length}`}</StatusPill>
                    ) : (
                      <StatusPill kind="paid">Ready</StatusPill>
                    )}
                    <button
                      onClick={(ev) => { ev.stopPropagation(); removeDraft(i); }}
                      className="text-inksoft hover:text-late cursor-pointer p-1 shrink-0"
                      aria-label={`Remove contract ${i + 1}`}
                    >
                      <IconDelete size={14} />
                    </button>
                  </button>
                );
              })}
            </div>
            {confirmCancel ? (
              <div className="mt-4 flex items-center justify-end gap-2">
                <span className="text-sm text-inksoft mr-auto">Discard all {drafts.length} contracts?</span>
                <Button variant="secondary" onClick={() => setConfirmCancel(false)}>Keep editing</Button>
                <Button onClick={onClose}>Discard</Button>
              </div>
            ) : (
              <div className="mt-4 flex items-center justify-end gap-2">
                <Button variant="secondary" onClick={() => setConfirmCancel(true)}>Cancel</Button>
                <Button onClick={saveAll} disabled={saving}>{saving ? <Spinner /> : `Add ${drafts.filter((d) => d.brand.trim()).length} deal${drafts.filter((d) => d.brand.trim()).length !== 1 ? "s" : ""}`}</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
