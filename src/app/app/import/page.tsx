"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FREE_ACTIVE_DEAL_CAP } from "@/lib/config";
import { cn } from "@/lib/utils";
import { IconArrowLeft, IconCheck, IconDownload, IconLink, IconRefresh } from "@/components/icons";
import { Button, Chip, Input, Select, Spinner, StatusPill } from "@/components/ui";

type Step = "source" | "upload" | "columns" | "mapping" | "review";
type MapRow = { brand: string; value?: string; status?: string; deliverable?: string; due_date?: string; notes?: string; confidence?: number };
type ImportItem = MapRow & { __selected?: boolean; __review?: boolean };

const SOURCES = [
  { id: "csv", name: "CSV file", desc: "Upload a .csv export of your deals spreadsheet.", icon: IconDownload },
  { id: "notion", name: "Notion", desc: "Connect a Notion database (coming soon).", icon: IconLink, disabled: true },
];

export default function ImportPage() {
  const supabase = createClient();
  const router = useRouter();
  const [step, setStep] = useState<Step>("source");
  const [plan, setPlan] = useState<"free" | "paid">("free");

  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [sourceName, setSourceName] = useState("");

  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [items, setItems] = useState<ImportItem[]>([]);
  const [mappingLoading, setMappingLoading] = useState(false);
  const [mappingError, setMappingError] = useState("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [done, setDone] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const p = await supabase.from("profiles").select("plan").eq("id", user.id).single();
        setPlan(((p.data as unknown as { plan: string } | null)?.plan ?? "free") as "free" | "paid");
      }
    })();
  }, [supabase]);

  const back = () => {
    if (done) { router.push("/app/deals"); return; }
    if (step === "source") { router.push("/app/deals"); return; }
    if (step === "upload") { resetUpload(); setStep("source"); return; }
    if (step === "columns") { setStep("upload"); return; }
    if (step === "mapping") { setStep("columns"); return; }
    if (step === "review") { setStep("mapping"); return; }
  };

  const resetUpload = () => { setColumns([]); setRows([]); setSourceName(""); };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parseCSV(text);
    setColumns(parsed.columns);
    setRows(parsed.rows);
    setSourceName(file.name.replace(/\.csv$/i, ""));
    setStep("columns");
    setMapping({});
    setItems([]);
  };

  const runMapping = async () => {
    if (!rows.length) return;
    setMappingLoading(true);
    setMappingError("");
    setStep("mapping");
    try {
      const res = await fetch("/api/import/map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ columns, rows, sourceName }),
      });
      const data = await res.json();
      if (!res.ok) { setMappingError(data.error || "Mapping failed."); return; }
      setMapping(data.mapping ?? {});
      setItems((data.items ?? []).map((r: MapRow) => ({ ...r, __selected: true, __review: (r.confidence ?? 1) < 0.6 })));
      setStep("review");
    } catch {
      setMappingError("Could not reach the mapping engine.");
    } finally {
      setMappingLoading(false);
    }
  };

  const toggleItem = (idx: number, selected: boolean) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, __selected: selected } : it)));
  };
  const editItem = (idx: number, field: keyof MapRow, value: string) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  };

  const importRows = async () => {
    const chosen = items.filter((i) => i.__selected);
    if (!chosen.length) return;
    setImporting(true);
    setImportError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setImportError("Not signed in."); setImporting(false); return; }

    const inserted: { user_id: string; brand: string; value: number | null; status: string; deliverable: string | null; due_date: string | null; notes: string | null; active: boolean }[] = [];
    for (const r of chosen) {
      const brand = (r.brand || "").trim();
      if (!brand) continue;
      const status = (r.status || "active").toLowerCase();
      const validStatus = ["active", "pipeline", "unpaid", "paid", "archived"].includes(status) ? status : "active";
      inserted.push({
        user_id: user.id, brand,
        value: r.value ? Number(String(r.value).replace(/[$,]/g, "")) || null : null,
        status: validStatus,
        deliverable: r.deliverable?.trim() || null,
        due_date: r.due_date?.trim() || null,
        notes: r.notes?.trim() || null,
        active: validStatus !== "archived",
      });
    }

    const { error } = await supabase.from("deals").insert(inserted);
    setImporting(false);
    if (error) { setImportError(error.message); return; }
    setDone(true);
  };

  const lowCount = items.filter((i) => i.__review && i.__selected).length;
  const selCount = items.filter((i) => i.__selected).length;

  return (
    <div className="fade-up max-w-3xl mx-auto">
      {/* Top bar with back */}
      <div className="flex items-center gap-1 mb-8">
        <button onClick={back} className="flex items-center gap-2 text-sm text-inksoft hover:text-ink px-2 py-1.5 rounded-lg hover:bg-card2 cursor-pointer">
          <IconArrowLeft size={16} /> Back to Deals
        </button>
        <h1 className="text-[22px] font-semibold tracking-tight pl-2">Import deals</h1>
      </div>

      {/* Stepper */}
      <Stepper current={step} />

      {done && (
        <div className="panel p-12 text-center">
          <div className="h-12 w-12 rounded-2xl bg-paid text-white grid place-items-center mx-auto"><IconCheck size={24} /></div>
          <h2 className="text-lg font-semibold mt-4">Deals imported</h2>
          <p className="text-sm text-inksoft mt-1">{selCount} deals added to your account.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/app/deals"><Button>View deals</Button></Link>
            <Button variant="secondary" onClick={() => { setDone(false); resetUpload(); setStep("source"); }}>Import more</Button>
          </div>
        </div>
      )}

      {!done && step === "source" && (
        <SourceStep sources={SOURCES} onPick={() => setStep("upload")} />
      )}

      {!done && step === "upload" && (
        <UploadStep onFile={onFile} fileRef={fileRef} />
      )}

      {!done && step === "columns" && (
        <ColumnsStep columns={columns} rowCount={rows.length} onMap={runMapping} />
      )}

      {!done && step === "mapping" && (
        <MappingLoading error={mappingError} onRetry={runMapping} />
      )}

      {!done && step === "review" && (
        <ReviewStep
          mapping={mapping}
          items={items}
          lowCount={lowCount}
          selCount={selCount}
          onToggle={toggleItem}
          onEdit={editItem}
          onImport={importRows}
          importing={importing}
          importError={importError}
          plan={plan}
        />
      )}
    </div>
  );
}

/* ---------- steps ---------- */
function Stepper({ current }: { current: Step }) {
  const order: Step[] = ["source", "upload", "columns", "mapping", "review"];
  const label: Record<Step, string> = {
    source: "Source", upload: "Upload", columns: "Columns", mapping: "AI mapping", review: "Review",
  };
  const curIdx = order.indexOf(current);
  return (
    <div className="flex items-center gap-2 mb-8 flex-wrap">
      {order.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <span className={cn(
            "text-[11px] font-semibold px-2.5 py-1 rounded-full",
            i === curIdx ? "bg-accent text-onaccent" : i < curIdx ? "bg-paidbg text-paid" : "bg-card2 text-inksoft border border-line2"
          )}>{label[s]}</span>
          {i < order.length - 1 && <span className="text-inkfaint text-[11px]">→</span>}
        </div>
      ))}
    </div>
  );
}

function SourceStep({ sources, onPick }: { sources: typeof SOURCES; onPick: () => void }) {
  return (
    <div>
      <p className="text-sm text-inksoft mb-5">Where would you like to import your deals from?</p>
      <div className="grid md:grid-cols-2 gap-4">
        {sources.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              disabled={s.disabled}
              onClick={onPick}
              className={cn("card p-6 text-left flex items-start gap-4 transition-colors cursor-pointer", s.disabled && "opacity-50 cursor-not-allowed")}
            >
              <span className="h-11 w-11 rounded-xl accent-tint-bg accent-ink grid place-items-center flex-none"><Icon size={20} /></span>
              <span>
                <span className="block font-semibold">{s.name}</span>
                <span className="block text-[13px] text-inksoft mt-1">{s.desc}</span>
                {s.disabled && <StatusPill kind="neutral" className="mt-2">Coming soon</StatusPill>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function UploadStep({ onFile, fileRef }: { onFile: (e: React.ChangeEvent<HTMLInputElement>) => void; fileRef: React.RefObject<HTMLInputElement | null> }) {
  return (
    <div>
      <p className="text-sm text-inksoft mb-5">Upload your CSV export. We&apos;ll detect the columns and map them to deals.</p>
      <button onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed border-line2 rounded-2xl p-12 text-center cursor-pointer hover:border-[var(--accent)] transition bg-card">
        <span className="h-12 w-12 rounded-2xl accent-tint-bg accent-ink grid place-items-center mx-auto"><IconDownload size={22} /></span>
        <span className="block font-semibold mt-3 text-ink">Choose a CSV file</span>
        <span className="block text-[13px] text-inksoft mt-1">.csv up to a few MB</span>
      </button>
      <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={onFile} />
    </div>
  );
}

function ColumnsStep({ columns, rowCount, onMap }: { columns: string[]; rowCount: number; onMap: () => void }) {
  return (
    <div className="panel p-6">
      <h2 className="font-semibold">Detected {rowCount} rows</h2>
      <p className="text-sm text-inksoft mt-1">Columns found in your file:</p>
      <div className="flex flex-wrap gap-2 mt-3">
        {columns.map((c) => <Chip key={c} active>{c}</Chip>)}
      </div>
      <div className="flex items-center justify-end mt-6">
        <Button onClick={onMap}>Map with AI <IconRefresh size={15} /></Button>
      </div>
    </div>
  );
}

function MappingLoading({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="panel p-12 text-center">
      <div className="flex items-center justify-center gap-3 text-inksoft">
        <Spinner />
        <span className="text-sm font-medium">Mapping your columns with AI…</span>
      </div>
      {error && (
        <div className="mt-4">
          <p className="text-sm text-late" role="alert">{error}</p>
          <Button variant="secondary" className="mt-3" onClick={onRetry}>Retry</Button>
        </div>
      )}
    </div>
  );
}

function ReviewStep({
  mapping, items, lowCount, selCount, onToggle, onEdit, onImport, importing, importError, plan,
}: {
  mapping: Record<string, string>; items: ImportItem[]; lowCount: number; selCount: number;
  onToggle: (i: number, s: boolean) => void; onEdit: (i: number, f: keyof MapRow, v: string) => void;
  onImport: () => void; importing: boolean; importError: string; plan: "free" | "paid";
}) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="font-semibold">Review your mapped deals</h2>
        <p className="text-sm text-inksoft mt-0.5">
          {selCount} selected · {lowCount} flagged for review · {plan === "free" ? `${FREE_ACTIVE_DEAL_CAP}-deal free limit applies` : "no limit on your plan"}
        </p>
      </div>

      {/* Mapping summary */}
      <div className="bg-card2 border border-line rounded-xl p-4 mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-inkfaint mb-2">Column mapping</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(mapping).map(([col, field]) => (
            <span key={col} className="text-xs bg-card border border-line2 rounded-full px-2.5 py-1">
              <span className="text-inksoft">{col}</span>
              <span className="text-accentink font-medium"> → {field}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2 mb-6">
        {items.map((r, i) => (
          <div key={i} className={cn("panel p-4 flex items-start gap-3", r.__review && "ring-1 ring-late/40", !r.__selected && "opacity-60")}>
            <input type="checkbox" className="mt-2 h-4 w-4" style={{ accentColor: "var(--accent)" }} checked={!!r.__selected} onChange={(e) => onToggle(i, e.target.checked)} />
            <div className="flex-1 min-w-0 grid md:grid-cols-2 gap-2">
              <Field label="Brand"><Input value={r.brand ?? ""} onChange={(e) => onEdit(i, "brand", e.target.value)} /></Field>
              <Field label="Value ($)"><Input value={r.value ?? ""} onChange={(e) => onEdit(i, "value", e.target.value)} /></Field>
              <Field label="Status">
                <Select value={r.status ?? "active"} onChange={(e) => onEdit(i, "status", e.target.value)}>
                  <option value="active">Active</option><option value="pipeline">Pipeline</option>
                  <option value="unpaid">Unpaid</option><option value="paid">Paid</option><option value="archived">Archived</option>
                </Select>
              </Field>
              <Field label="Due date"><Input type="date" value={r.due_date ?? ""} onChange={(e) => onEdit(i, "due_date", e.target.value)} /></Field>
              <div className="md:col-span-2">
                <Field label="Deliverable"><Input value={r.deliverable ?? ""} onChange={(e) => onEdit(i, "deliverable", e.target.value)} /></Field>
              </div>
            </div>
            {r.__review && <StatusPill kind="late" className="flex-none mt-1">Review</StatusPill>}
          </div>
        ))}
      </div>

      {importError && <p className="text-sm text-late mb-3" role="alert">{importError}</p>}

      <div className="flex items-center justify-between">
        <span className="text-sm text-inksoft">{selCount} of {items.length} selected</span>
        <Button onClick={onImport} disabled={importing || selCount === 0}>
          {importing ? <Spinner /> : null} Import {selCount} deal{selCount === 1 ? "" : "s"}
        </Button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium text-inksoft block mb-1">{label}</span>
      {children}
    </label>
  );
}

/* ---------- CSV parsing ---------- */
function parseCSV(text: string): { columns: string[]; rows: Record<string, string>[] } {
  const lines = text.trim().split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) return { columns: [], rows: [] };
  const split = (line: string) => {
    const out: string[] = [];
    let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { if (inQ && line[i + 1] === '"') { cur += '"'; i++; } else inQ = !inQ; }
      else if (ch === "," && !inQ) { out.push(cur.trim()); cur = ""; }
      else cur += ch;
    }
    out.push(cur.trim());
    return out;
  };
  const cols = split(lines[0]).map((c, i) => c || `col${i + 1}`);
  const rows = lines.slice(1).map((l) => {
    const vals = split(l);
    const obj: Record<string, string> = {};
    cols.forEach((c, i) => { obj[c] = vals[i] ?? ""; });
    return obj;
  });
  return { columns: cols, rows };
}
