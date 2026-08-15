"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FREE_ACTIVE_DEAL_CAP } from "@/lib/config";
import { IconClose, IconUpload } from "@/components/icons";
import { Spinner } from "@/components/ui";
import { DealForm, emptyDealForm, type DealFormValues } from "@/components/deal-form";
import { useCelebration } from "@/components/confetti";

/**
 * Unified Upload modal. Opens with ONLY a dropzone (never auto-opens the
 * native file picker). Clicking the dropzone opens the Finder.
 *
 * Flow depends on the file chosen:
 *  - PDF / text / markdown  -> contract extraction -> prefilled DealForm (create)
 *  - CSV                     -> the bulk spreadsheet import flow (ImportDeals page)
 */
export default function UploadModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const supabase = createClient();
  const router = useRouter();
  const celeb = useCelebration();
  const fileRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<"pick" | "contract" | "csv">("pick");
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState("");
  const [initial, setInitial] = useState<DealFormValues>(emptyDealForm());
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
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const lower = f.name.toLowerCase();
    const isCsv = lower.endsWith(".csv") || f.type === "text/csv";
    if (isCsv) {
      // Spreadsheet bulk import (every row becomes a deal). The import page
      // already owns this flow; route there so the user picks the same file.
      setError("");
      onClose();
      router.push("/app/import");
      return;
    }
    // Contract flow: extract then show a prefilled deal form.
    setExtracting(true);
    setError("");
    const fd = new FormData();
    fd.append("file", f);
    try {
      const res = await fetch("/api/deals/extract-contract", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not read that file. Try a PDF or text contract.");
        setExtracting(false);
        return;
      }
      setInitial(applyFields(data.fields ?? {}));
      setPhase("contract");
    } catch {
      setError("Could not reach the contract parser.");
    } finally {
      setExtracting(false);
    }
  };

  const onCreated = () => {
    celeb.fire();
    onSaved();
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
          <h2 className="text-lg font-semibold">{phase === "contract" ? "Review your deal" : "Upload"}</h2>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg hover:bg-card2 cursor-pointer"><IconClose size={18} /></button>
        </div>

        {error && <p className="text-sm text-late mb-4" role="alert">{error}</p>}

        {phase === "pick" && (
          <div>
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-line2 rounded-2xl p-12 text-center cursor-pointer hover:border-[var(--accent)] transition bg-card"
            >
              <span className="h-12 w-12 rounded-2xl bg-accenttint text-accentink grid place-items-center mx-auto"><IconUpload size={22} /></span>
              <span className="block font-semibold mt-3 text-ink">{extracting ? "Reading contract…" : "Drop a file or click to browse"}</span>
              <span className="block text-[13px] text-inksoft mt-1">PDF or text for a single contract, or a CSV to import many deals.</span>
            </button>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl border border-line2 p-3">
                <div className="text-[13px] font-semibold">Contract</div>
                <div className="text-[12px] text-inksoft mt-0.5">PDF, .txt, .md</div>
              </div>
              <div className="rounded-xl border border-line2 p-3">
                <div className="text-[13px] font-semibold">Spreadsheet</div>
                <div className="text-[12px] text-inksoft mt-0.5">CSV, one row per deal</div>
              </div>
            </div>
            <input ref={fileRef} type="file" className="hidden" onChange={onFile} />
          </div>
        )}

        {phase === "contract" && extracting && (
          <div className="p-10 text-center text-inksoft flex items-center justify-center gap-2"><Spinner /><span>Extracting deal terms…</span></div>
        )}

        {phase === "contract" && !extracting && (
          <>
            {plan === "free" && (
              <p className="text-[12px] text-inksoft mb-3">You&apos;re on the free plan ({FREE_ACTIVE_DEAL_CAP} active deals). Uploading a contract adds a deal here.</p>
            )}
            <DealForm
              mode="create"
              initial={initial}
              onSaved={onCreated}
              setError={setError}
              pending={false}
              submitLabel="Add deal"
            />
          </>
        )}
      </div>
    </div>
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