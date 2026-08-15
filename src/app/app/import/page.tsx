"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FREE_ACTIVE_DEAL_CAP } from "@/lib/config";
import { cn } from "@/lib/utils";
import { IconArrowLeft, IconCheck, IconDownload, IconLink, IconRefresh } from "@/components/icons";
import { Button, Chip, Input, Select, Spinner, StatusPill } from "@/components/ui";
import { UpgradeModal } from "@/components/upgrade-modal";
import { NotionLogo } from "@/components/marketing/notion-logo";

type Step = "source" | "notion" | "upload" | "columns" | "mapping" | "review";
type ContentPart = { title?: string; event_date?: string; platform?: string | null };
type PaymentPart = { amount?: string; expected_date?: string; status?: string };
type MapRow = {
  brand: string; value?: string; status?: string; deliverable?: string;
  due_date?: string; notes?: string; rep_email?: string; confidence?: number;
  content?: ContentPart | null; payment?: PaymentPart | null;
};
type ImportItem = MapRow & { __selected?: boolean; __review?: boolean };

const SOURCES = [
  { id: "csv", name: "CSV file", desc: "Upload a .csv export of your deals spreadsheet.", icon: IconDownload },
  { id: "notion", name: "Notion", desc: "Connect a Notion database and pull your deals straight in.", icon: NotionLogo },
];

export default function ImportPage() {
  const supabase = createClient();
  const router = useRouter();
  const [step, setStep] = useState<Step>("source");
  const [plan, setPlan] = useState<"free" | "paid">("free");

  // If a Notion connection already exists (or we just returned from the OAuth
  // round-trip), skip the "CSV vs Notion" source chooser and go straight to
  // the board picker. The user asked for connect -> import with no intermediate
  // chooser step.
  useEffect(() => {
    fetch("/api/notion/status")
      .then((r) => r.json())
      .then((s) => {
        if (s?.connected && step === "source") setStep("notion");
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [importSummary, setImportSummary] = useState<{ added: number; updated: number; posts: number; payments: number } | null>(null);

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
    if (step === "notion") { setStep("source"); return; }
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
  const editDest = (idx: number, dest: "content" | "payment", field: string, value: string) => {
    setItems((prev) => prev.map((it, i) => {
      if (i !== idx) return it;
      const cur = (it[dest] ?? {}) as Record<string, string>;
      return { ...it, [dest]: { ...cur, [field]: value } };
    }));
  };

  const importRows = async () => {
    const chosen = items.filter((i) => i.__selected);
    if (!chosen.length) return;
    setImporting(true);
    setImportError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setImportError("Not signed in."); setImporting(false); return; }

    const toNum = (v?: string) => (v ? Number(String(v).replace(/[$,]/g, "")) || null : null);
    const norm = (s?: string) => (s || "").trim().toLowerCase();
    const dealStatus = (s?: string) => {
      const st = (s || "active").toLowerCase().trim();
      const VALID = ["active", "pipeline", "unpaid", "paid", "archived"];
      if (VALID.includes(st)) return st;
      // Map common Notion / source statuses to Talby statuses (belt-and-suspenders
      // protection on top of the AI prompt's status translation).
      const map: Record<string, string> = {
        signed: "active", "in progress": "active", live: "active", "closed won": "active",
        negotiation: "pipeline", "in negotiation": "pipeline", proposal: "pipeline", draft: "pipeline",
        invoiced: "unpaid", "awaiting payment": "unpaid", "payment pending": "unpaid", outstanding: "unpaid",
        received: "paid", completed: "paid", closed: "paid", fulfilled: "paid",
        cancelled: "archived", lost: "archived", dead: "archived",
      };
      return map[st] ?? "active";
    };

    // Build a plan per chosen row (skip empty brands).
    type Plan = {
      idx: number; brand: string; value: number | null; status: string;
      deliverable: string | null; due_date: string | null; notes: string | null;
      rep_email: string | null; active: boolean; dealId: string | null;
      payment_status: string | null;
      content: ContentPart | null | undefined; payment: PaymentPart | null | undefined;
    };
    const plans: Plan[] = [];
    for (const r of chosen) {
      const brand = (r.brand || "").trim();
      if (!brand) continue;
      const status = dealStatus(r.status);
      // Derive a deal-level payment_status from the payment sub-object.
      const payStatus = /paid|received/i.test(r.payment?.status ?? "") ? "paid" : "expected";
      plans.push({
        idx: chosen.indexOf(r), brand, value: toNum(r.value), status,
        deliverable: r.deliverable?.trim() || null,
        due_date: r.due_date?.trim() || null,
        notes: r.notes?.trim() || null,
        rep_email: (r.rep_email || "").trim() || null,
        active: status !== "archived",
        dealId: null,
        payment_status: payStatus,
        content: r.content, payment: r.payment,
      });
    }
    if (!plans.length) { setImporting(false); return; }

    // Load existing deals so re-imports UPDATE instead of duplicating.
    // Fetch current field values so imports only FILL empty slots and never
    // clobber data the user entered manually.
    const { data: existingDeals } = await supabase.from("deals").select("id, brand, active, status, value, deliverable, due_date, notes, rep_email, payment_status").eq("user_id", user.id);
    const brandToDeal = new Map<string, { id: string; value: number | null; deliverable: string | null; due_date: string | null; notes: string | null; rep_email: string | null; payment_status: string | null }>();
    for (const d of existingDeals ?? []) {
      const rec = d as { id: string; brand: string; value?: number | null; deliverable?: string | null; due_date?: string | null; notes?: string | null; rep_email?: string | null; payment_status?: string | null };
      const b = norm(rec.brand);
      if (b && !brandToDeal.has(b)) {
        brandToDeal.set(b, { id: rec.id, value: rec.value ?? null, deliverable: rec.deliverable ?? null, due_date: rec.due_date ?? null, notes: rec.notes ?? null, rep_email: rec.rep_email ?? null, payment_status: rec.payment_status ?? null });
      }
    }

    // --- Free-plan hard stop (mirrors the DB trigger; gives a friendly gate) ---
    // Count active deals the user WILL have after this import and block free
    // users who would exceed FREE_ACTIVE_DEAL_CAP. The DB trigger is the real
    // enforcement; this just surfaces the Upgrade modal instead of a raw error.
    if (plan === "free") {
      const dealRows = (existingDeals ?? []) as { brand: string; active: boolean; status: string }[];
      const existingActive = dealRows.filter((d) => d.active && d.status !== "archived").length;
      // New inserts that count as active.
      const newActive = plans.filter((p) => !brandToDeal.has(norm(p.brand)) && p.active).length;
      // Existing deals being flipped into active (or created fresh).
      const flippedActive = plans.filter((p) => {
        const existing = dealRows.find((d) => norm(d.brand) === norm(p.brand));
        if (!existing) return false;
        return p.active && !(existing.active && existing.status !== "archived");
      }).length;
      if (existingActive + newActive + flippedActive > FREE_ACTIVE_DEAL_CAP) {
        setImporting(false);
        setShowUpgrade(true);
        setImportError("You've reached the free plan's limit of active deals. Go unlimited to import more.");
        return;
      }
    }

    // Insert brand-new deals, capture ids.
    const newPlans = plans.filter((p) => !brandToDeal.has(norm(p.brand)));
    let newIds: { id: string }[] = [];
    if (newPlans.length) {
      const { data, error } = await supabase.from("deals").insert(
        newPlans.map((p) => ({
          user_id: user.id, brand: p.brand, value: p.value, status: p.status,
          deliverable: p.deliverable, due_date: p.due_date, notes: p.notes,
          rep_email: p.rep_email, active: p.active,
          payment_status: p.payment_status,
        }))
      ).select("id");
      if (error) { setImporting(false); setImportError(error.message); return; }
      newIds = (data ?? []) as { id: string }[];
      newPlans.forEach((p, i) => { p.dealId = newIds[i]?.id ?? null; });
    }

    // Assign deal ids to existing-brand plans and update them.
    // NON-DESTRUCTIVE / FILL-EMPTY-ONLY: for a deal that already exists (e.g.
    // one the user created by hand), the import only fills fields that are
    // currently EMPTY. It never overwrites manual values. So a Notion import
    // can never wipe or replace a manual deal's data.
    let added = newPlans.length, updated = 0;
    for (const p of plans) {
      if (p.dealId) continue;
      const ex = brandToDeal.get(norm(p.brand));
      if (!ex) continue;
      p.dealId = ex.id;
      updated++;
      const patch2: Record<string, unknown> = {};
      const fill = (field: keyof typeof ex, v: string | number | null | undefined) => {
        if (v === null || v === undefined || String(v).trim() === "") return;
        if (ex[field] === null || ex[field] === undefined || String(ex[field]).trim() === "") {
          patch2[field] = v;
        }
      };
      fill("value", p.value);
      fill("deliverable", p.deliverable);
      fill("due_date", p.due_date);
      fill("notes", p.notes);
      fill("rep_email", p.rep_email);
      fill("payment_status", p.payment_status);
      if (Object.keys(patch2).length) {
        await supabase.from("deals").update(patch2).eq("id", ex.id).eq("user_id", user.id);
      }
    }

    // Fetch existing linked content + payments for all involved deals.
    const dealIds = plans.map((p) => p.dealId).filter((x): x is string => !!x);
    const [cRes, payRes] = dealIds.length
      ? await Promise.all([
          supabase.from("content").select("id, linked_deal_id, event_date").in("linked_deal_id", dealIds),
          supabase.from("payments").select("id, deal_id, amount, expected_date").in("deal_id", dealIds),
        ])
      : [{ data: null }, { data: null }];
    const contentByKey = new Map<string, string>();
    for (const c of (cRes.data ?? []) as { id: string; linked_deal_id: string; event_date: string }[]) {
      contentByKey.set(`${c.linked_deal_id}|${c.event_date}`, c.id);
    }
    const payByKey = new Map<string, string>();
    for (const p of (payRes.data ?? []) as { id: string; deal_id: string; amount: number; expected_date: string }[]) {
      payByKey.set(`${p.deal_id}|${p.expected_date}|${p.amount}`, p.id);
    }

    // Upsert calendar posts + payments (no duplicates; preserve received status).
    let posts = 0, payments = 0;
    for (const p of plans) {
      const dealId = p.dealId;
      if (!dealId) continue;
      const c = p.content;
      if (c?.event_date) {
        const date = c.event_date.slice(0, 10);
        const title = (c.title || p.brand || "Deliverable").slice(0, 200);
        const body = { title, platform: c.platform || null };
        const existingId = contentByKey.get(`${dealId}|${date}`);
        if (existingId) { await supabase.from("content").update(body).eq("id", existingId); }
        else { await supabase.from("content").insert({ user_id: user.id, linked_deal_id: dealId, title, event_date: date, platform: c.platform || null, status: "planned" }); }
        posts++;
      }
      const pm = p.payment;
      if (pm?.expected_date) {
        const date = pm.expected_date.slice(0, 10);
        const amount = toNum(pm.amount) ?? p.value ?? 0;
        const status = /paid|received/i.test(pm.status || "") ? "received" : "expected";
        const existingId = payByKey.get(`${dealId}|${date}|${amount}`);
        if (existingId) { await supabase.from("payments").update({ status }).eq("id", existingId); }
        else { await supabase.from("payments").insert({ user_id: user.id, deal_id: dealId, amount, expected_date: date, status }); }
        payments++;
      }
    }

    setImporting(false);
    setImportSummary({ added, updated, posts, payments });
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
          <p className="text-sm text-inksoft mt-1">
            {importSummary ? (
              <>
                {importSummary.added} added · {importSummary.updated} updated ·{" "}
                {importSummary.posts} calendar posts · {importSummary.payments} payments
              </>
            ) : (
              `${selCount} deals added to your account.`
            )}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/app/deals"><Button>View deals</Button></Link>
            <Button variant="secondary" onClick={() => { setDone(false); resetUpload(); setStep("source"); }}>Import more</Button>
          </div>
        </div>
      )}

      {!done && step === "source" && (
        <SourceStep sources={SOURCES} onPick={(id) => { setStep(id === "notion" ? "notion" : "upload"); }} />
      )}

      {!done && step === "notion" && (
        <NotionStep
          onColumns={(columns, rows, sourceName) => { setColumns(columns); setRows(rows); setSourceName(sourceName); setStep("columns"); }}
        />
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
          onEditDest={editDest}
          onImport={importRows}
          importing={importing}
          importError={importError}
          plan={plan}
        />
      )}

      {showUpgrade && <UpgradeModal onClose={() => { setShowUpgrade(false); setImportError(""); }} />}
    </div>
  );
}

/* ---------- steps ---------- */
function Stepper({ current }: { current: Step }) {
  const order: Step[] = ["source", "notion", "upload", "columns", "mapping", "review"];
  const label: Record<Step, string> = {
    source: "Source", notion: "Notion", upload: "Upload", columns: "Columns", mapping: "AI mapping", review: "Review",
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

function SourceStep({ sources, onPick }: { sources: typeof SOURCES; onPick: (id: string) => void }) {
  return (
    <div>
      <p className="text-sm text-inksoft mb-5">Where would you like to import your deals from?</p>
      <div className="grid md:grid-cols-2 gap-4">
        {sources.map((s) => {
          const Icon = s.icon;
          const isBrand = s.id === "notion";
          return (
            <button
              key={s.id}
              onClick={() => onPick(s.id)}
              className="card p-6 text-left flex items-start gap-4 transition-colors cursor-pointer hover:border-[var(--accent)]"
            >
              <span className={cn("h-11 w-11 rounded-xl grid place-items-center flex-none", isBrand ? "bg-card border border-line2" : "accent-tint-bg accent-ink")}>
                <Icon size={22} />
              </span>
              <span>
                <span className="block font-semibold">{s.name}</span>
                <span className="block text-[13px] text-inksoft mt-1">{s.desc}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NotionStep({ onColumns }: { onColumns: (columns: string[], rows: Record<string, string>[], sourceName: string) => void }) {
  const [status, setStatus] = useState<{ connected: boolean; workspace: string | null; configured: boolean } | null>(null);
  const [databases, setDatabases] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load connection status on mount, then auto-load databases when connected
  // so a user returning from OAuth lands straight on the board picker.
  useEffect(() => {
    fetch("/api/notion/status")
      .then((r) => r.json())
      .then((s) => {
        setStatus(s);
        if (s?.connected) loadDatabases(s.workspace);
      })
      .catch(() => ({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDatabases = async (ws?: string | null) => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/notion/databases");
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Could not load databases."); return; }
      setDatabases(data.databases ?? []);
      if (ws && data.databases?.length) setStatus({ connected: true, workspace: ws, configured: true });
      if (!data.databases?.length) setError("No databases found in this Notion workspace.");
    } catch {
      setError("Could not reach the Notion connection.");
    } finally {
      setLoading(false);
    }
  };

  const pickDatabase = async (db: { id: string; title: string }) => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/notion/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ databaseId: db.id, sourceName: db.title }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Could not read that database."); return; }
      onColumns(data.columns ?? [], data.rows ?? [], data.sourceName ?? db.title);
    } catch {
      setError("Could not read that database.");
    } finally {
      setLoading(false);
    }
  };

  // Status not loaded yet.
  if (!status) {
    return (
      <div className="panel p-12 text-center">
        <div className="flex items-center justify-center gap-2 text-inksoft"><Spinner /><span className="text-sm font-medium">Checking Notion…</span></div>
      </div>
    );
  }

  if (!status.configured) {
    return (
      <div className="panel p-8 text-center max-w-md mx-auto">
        <h2 className="font-semibold">Notion isn&apos;t configured yet</h2>
        <p className="text-sm text-inksoft mt-1">The Notion OAuth app isn&apos;t wired up on this deployment. CSV import still works great.</p>
      </div>
    );
  }

  if (!status.connected) {
    return (
      <div className="panel p-8 text-center max-w-md mx-auto">
        <span className="h-12 w-12 rounded-2xl accent-tint-bg accent-ink grid place-items-center mx-auto"><IconLink size={22} /></span>
        <h2 className="font-semibold mt-4">Connect Notion</h2>
        <p className="text-sm text-inksoft mt-1 mb-4">Authorize your own Notion account, then pick a database to import.</p>
        <Button onClick={() => { window.location.href = "/api/notion/connect?redirect_to=/app/import"; }}>Connect Notion</Button>
      </div>
    );
  }

  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div>
          <h2 className="font-semibold">Choose a Notion database</h2>
          <p className="text-sm text-inksoft mt-0.5">{status.workspace ? `Connected to ${status.workspace}` : "Connected to Notion"}</p>
        </div>
        {!databases.length && !loading && (
          <Button size="sm" variant="secondary" onClick={() => loadDatabases()}><IconRefresh size={15} /> Load databases</Button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-inksoft py-6"><Spinner /><span className="text-sm font-medium">Reading database…</span></div>
      )}

      {!loading && databases.length === 0 && !error && (
        <div className="text-center py-6">
          <Button onClick={() => loadDatabases()}><IconRefresh size={15} /> Load databases</Button>
        </div>
      )}

      {!loading && databases.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3">
          {databases.map((db) => (
            <button
              key={db.id}
              onClick={() => pickDatabase(db)}
              className="card p-4 text-left flex items-center gap-3 cursor-pointer hover:border-[var(--accent)] transition-colors"
            >
              <span className="h-9 w-9 rounded-xl bg-subtle grid place-items-center text-sm font-semibold">{db.title[0]?.toUpperCase() ?? "N"}</span>
              <span className="text-sm font-medium truncate">{db.title}</span>
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-late mt-3" role="alert">{error}</p>}
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
  mapping, items, lowCount, selCount, onToggle, onEdit, onEditDest, onImport, importing, importError, plan,
}: {
  mapping: Record<string, string>; items: ImportItem[]; lowCount: number; selCount: number;
  onToggle: (i: number, s: boolean) => void; onEdit: (i: number, f: keyof MapRow, v: string) => void;
  onEditDest: (i: number, dest: "content" | "payment", field: string, v: string) => void;
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
          <div key={i} className={cn("panel p-4", r.__review && "ring-1 ring-late/40", !r.__selected && "opacity-60")}>
            <div className="flex items-start gap-3">
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
                <div className="md:col-span-2">
                  <Field label="Rep email"><Input value={r.rep_email ?? ""} onChange={(e) => onEdit(i, "rep_email", e.target.value)} placeholder="rep@brand.com (for nudges)" /></Field>
                </div>
              </div>
              {r.__review && <StatusPill kind="late" className="flex-none mt-1">Review</StatusPill>}
            </div>
            {r.content?.event_date && (
              <div className="w-full mt-3 border border-accent/30 bg-accent/5 rounded-xl p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-accentink mb-2">Calendar post</p>
                <div className="grid md:grid-cols-3 gap-2">
                  <div className="md:col-span-2">
                    <Field label="Title"><Input value={r.content.title ?? ""} onChange={(e) => onEditDest(i, "content", "title", e.target.value)} /></Field>
                  </div>
                  <Field label="Go-live date"><Input type="date" value={r.content.event_date ?? ""} onChange={(e) => onEditDest(i, "content", "event_date", e.target.value)} /></Field>
                </div>
              </div>
            )}
            {r.payment?.expected_date && (
              <div className="w-full mt-2 border border-warn/30 bg-warn/5 rounded-xl p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-warn mb-2">Payment</p>
                <div className="grid md:grid-cols-3 gap-2">
                  <Field label="Amount ($)"><Input value={r.payment.amount ?? ""} onChange={(e) => onEditDest(i, "payment", "amount", e.target.value)} /></Field>
                  <Field label="Expected date"><Input type="date" value={r.payment.expected_date ?? ""} onChange={(e) => onEditDest(i, "payment", "expected_date", e.target.value)} /></Field>
                  <Field label="Status">
                    <Select value={r.payment.status ?? "expected"} onChange={(e) => onEditDest(i, "payment", "status", e.target.value)}>
                      <option value="expected">Expected</option><option value="received">Received</option>
                    </Select>
                  </Field>
                </div>
              </div>
            )}
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
