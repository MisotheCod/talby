"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn, formatMoney } from "@/lib/utils";
import { paidPaymentGap } from "@/lib/pay-status";
import { IconPlus, IconClose, IconRefresh } from "@/components/icons";
import { Button, Spinner, StatusPill } from "@/components/ui";
import { emptyDealForm, DealForm } from "@/components/deal-form";
import UploadModal from "@/components/upload-modal";
import { NotionLogo } from "@/components/marketing/notion-logo";
import { FREE_ACTIVE_DEAL_CAP } from "@/lib/constants";

/** The three "how do you want to add a deal" entry points. */
type Flow = "choose" | "new" | "upload" | "notion" | null;

/**
 * Inline add-deal flow for the Overview page. Renders the chooser (3 cards),
 * and each card opens its matching flow as a modal WITHOUT any navigation:
 *  - New deal        -> DealForm in create mode
 *  - Upload          -> the existing UploadModal (contract/CSV, AI auto-fill)
 *  - Import Notion   -> a compact Notion wizard reusing /api/notion/* and
 *                       /api/import/map (connect, pick db, fetch, map, review)
 * On any successful create/import it calls onChanged() so the Overview page
 * re-fetches its totals + lists. The user never leaves Overview.
 */
export function AddDealFlow({ open, onClose, onChanged }: {
  open: boolean; onClose: () => void; onChanged?: () => void;
}) {
  const [flow, setFlow] = useState<Flow>("choose");

  // Reset to the chooser whenever the root modal re-opens.
  useEffect(() => { if (open) setFlow("choose"); }, [open]);

  if (!open) return null;

  if (flow === "new") {
    return (
      <InlineNewDeal
        onClose={() => { setFlow("choose"); onClose(); }}
        onSaved={() => { onChanged?.(); setFlow("choose"); onClose(); }}
      />
    );
  }
  if (flow === "upload") {
    return (
      <UploadModal
        onClose={() => { setFlow("choose"); onClose(); }}
        onSaved={() => { onChanged?.(); setFlow("choose"); onClose(); }}
      />
    );
  }
  if (flow === "notion") {
    return (
      <InlineNotionImport
        onClose={() => { setFlow("choose"); onClose(); }}
        onDone={() => { onChanged?.(); setFlow("choose"); onClose(); }}
      />
    );
  }

  // Chooser: three cards, in order.
  return (
    <div className="fixed inset-0 z-[90] bg-black/30 grid place-items-center p-4" onClick={() => { setFlow(null); onClose(); }}>
      <div className="bg-card w-full max-w-md rounded-2xl border border-line2 shadow-pop p-6" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[16px] font-semibold">Add a deal</h3>
          <button onClick={() => { setFlow(null); onClose(); }} aria-label="Close" className="p-1.5 rounded-lg text-inksoft hover:text-ink hover:bg-card2 cursor-pointer"><IconClose size={18} /></button>
        </div>
        <p className="text-[13px] text-inksoft mb-4">Choose how you&apos;d like to bring it in.</p>
        <div className="space-y-2.5">
          <ChooserCard icon={<IconPlus size={18} />} label="New deal" desc="Enter the details by hand — brand, value, dates, and terms." onClick={() => setFlow("new")} />
          <ChooserCard icon={<IconUpload />} label="Upload" desc="One contract or CSV, filled in automatically by AI. Review, then add." onClick={() => setFlow("upload")} />
          <ChooserCard icon={<NotionLogo size={18} />} label="Import from Notion" desc="Pull your whole deal database — connect, map, and review." onClick={() => setFlow("notion")} />
        </div>
      </div>
    </div>
  );
}

function ChooserCard({ icon, label, desc, onClick }: { icon: React.ReactNode; label: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-start gap-3 card p-4 text-left cursor-pointer hover:border-[var(--accent)] transition-colors">
      <span className="h-9 w-9 rounded-xl accent-tint-bg accent-ink grid place-items-center shrink-0">{icon}</span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-[13px] text-inksoft mt-0.5 leading-snug">{desc}</span>
      </span>
    </button>
  );
}

function IconUpload({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
  );
}

/* ---------------- Inline New Deal (DealForm create) ---------------- */
function InlineNewDeal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const supabase = createClient();
  const [plan, setPlan] = useState<"free" | "paid">("free");
  const [activeDeals, setActiveDeals] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const p = await supabase.from("profiles").select("plan").eq("id", user.id).single();
      setPlan(((p.data as unknown as { plan?: string } | null)?.plan === "paid") ? "paid" : "free");
      const { count } = await supabase.from("deals").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("active", true);
      setActiveDeals(count ?? 0);
    })();
  }, [supabase]);

  const atCap = plan === "free" && activeDeals >= FREE_ACTIVE_DEAL_CAP;

  return (
    <div className="fixed inset-0 z-[90] bg-black/30 grid place-items-center p-4" onClick={onClose}>
      <div className="bg-card w-full max-w-lg rounded-2xl border border-line2 shadow-pop p-6 max-h-[90dvh] overflow-y-auto" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">New deal</h3>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg text-inksoft hover:text-ink hover:bg-card2 cursor-pointer"><IconClose size={18} /></button>
        </div>
        {atCap && (
          <div className="rounded-xl bg-accenttint p-4 text-sm mb-4">
            <div className="font-semibold accent-ink">You&apos;re at the free-plan limit</div>
            <p className="text-inksoft mt-0.5">You have {activeDeals} active deals. <a href="/#pricing" className="accent-ink font-semibold underline underline-offset-2" onClick={onClose}>Go unlimited</a> to keep adding.</p>
          </div>
        )}
        {!atCap && (
          <DealForm
            mode="create"
            initial={emptyDealForm()}
            onSaved={onSaved}
            setError={() => {}}
            pending={false}
            submitLabel="Add deal"
          />
        )}
      </div>
    </div>
  );
}

/* ---------------- Inline: Notion import wizard ---------------- */
function InlineNotionImport({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const supabase = createClient();
  const [status, setStatus] = useState<{ connected: boolean; workspace: string | null; configured: boolean } | null>(null);
  const [databases, setDatabases] = useState<{ id: string; title: string }[]>([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [error, setError] = useState("");

  // fetch database -> columns+rows -> map -> review -> import
  const [phase, setPhase] = useState<"status" | "dbs" | "fetching" | "mapping" | "review">("status");
  const [dbName, setDbName] = useState("");
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [items, setItems] = useState<MapRow[]>([]);
  const [importing, setImporting] = useState(false);

  type MapRow = { brand: string; value?: string; status?: string; deliverable?: string; due_date?: string; notes?: string; rep_email?: string; confidence?: number; content?: { title?: string; event_date?: string; platform?: string | null } | null; payment?: { amount?: string; expected_date?: string; status?: string } | null; __selected?: boolean };
  const toNum = (v?: string) => v ? Number(String(v).replace(/[$,]/g, "")) || null : null;

  // On mount: check connection, then list databases if connected.
  useEffect(() => {
    (async () => {
      try { const r = await fetch("/api/notion/status"); const s = await r.json(); setStatus(s); if (s?.connected) { loadDbs(); setPhase("dbs"); } else setPhase("status"); }
      catch { setError("Could not reach Notion."); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDbs = async () => {
    setDbLoading(true); setError("");
    try { const r = await fetch("/api/notion/databases"); const d = await r.json(); setDatabases(d.databases ?? []); if (!d.databases?.length) setError("No databases found in this workspace."); }
    catch { setError("Could not load databases."); }
    finally { setDbLoading(false); }
  };

  const connect = () => {
    window.location.href = `/api/notion/connect?redirect_to=${encodeURIComponent("/app")}`;
  };

  const pick = async (db: { id: string; title: string }) => {
    setPhase("fetching"); setError(""); setDbName(db.title);
    try {
      const r = await fetch("/api/notion/fetch", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ databaseId: db.id, sourceName: db.title }) });
      const data = await r.json();
      if (!r.ok) { setError(data.error || "Could not read that database."); setPhase("dbs"); return; }
      setColumns(data.columns ?? []); setRows(data.rows ?? []);
    } catch { setError("Could not read that database."); setPhase("dbs"); return; }
    setPhase("mapping");
    try {
      const mr = await fetch("/api/import/map", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ columns, rows: [...rows], sourceName: db.title }) });
      const md = await mr.json();
      if (!mr.ok) { setError(md.error || "Mapping failed."); setPhase("dbs"); return; }
      setItems((md.items ?? []).map((r: MapRow) => ({ ...r, __selected: true })));
      setPhase("review");
    } catch { setError("Mapping failed."); setPhase("dbs"); }
  };

  const applyAll = async () => {
    const chosen = items.filter((i) => i.__selected);
    if (!chosen.length || importing) return;
    setImporting(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); setImporting(false); return; }
    // Insert each mapped row as a deal (mirrors the import page's flow, compact).
    let added = 0;
    for (const r of chosen) {
      const brand = (r.brand || "").trim();
      if (!brand) continue;
      const status = ["active", "pipeline", "unpaid", "paid", "archived"].includes((r.status || "").toLowerCase()) ? (r.status || "active").toLowerCase() : "active";
      const { data: created, error } = await supabase.from("deals").insert({
        user_id: user.id, brand, value: toNum(r.value), status,
        deliverable: r.deliverable?.trim() || null, due_date: r.due_date?.trim() || null,
        notes: r.notes?.trim() || null, rep_email: r.rep_email?.trim() || null,
        active: status !== "archived",
      }).select("id").single();
      if (error) { setError(error.message); break; }
      added++;
      const dealId = (created as unknown as { id?: string } | null)?.id;
      if (dealId && r.content?.event_date) {
        await supabase.from("content").insert({ user_id: user.id, linked_deal_id: dealId, title: (r.content.title || brand).slice(0, 200), event_date: r.content.event_date.slice(0, 10), platform: r.content.platform || null, status: "planned" });
      }
      // Pay status is driven SOLELY by the mapped payment object. A deal is paid
      // only when its payment is actually received — a lifecycle "paid" row with no
      // received payment maps to not_invoiced (never a fabricated received payment).
      const pm = r.payment;
      const pmHas = pm && (String(pm.amount ?? "").trim() !== "" || String(pm.status ?? "").trim() !== "" || String(pm.expected_date ?? "").trim() !== "");
      if (dealId && pmHas) {
        const received = /paid|received/i.test(pm.status || "");
        const amount = toNum(pm.amount) ?? toNum(r.value) ?? 0;
        const date = pm.expected_date?.trim() ? pm.expected_date.slice(0, 10) : (r.due_date?.trim() ? r.due_date.slice(0, 10) : "");
        await supabase.from("payments").insert({
          user_id: user.id, deal_id: dealId, amount,
          expected_date: date || null,
          status: received ? "received" : "expected",
          pay_status: received ? "paid" : /invoiced/i.test(pm.status || "") ? "invoiced" : "not_invoiced",
        });
      }
    }
    setImporting(false);
    if (added) onDone();
  };

  const selCount = items.filter((i) => i.__selected).length;
  const lowCount = items.filter((i) => (i.confidence ?? 1) < 0.6 && i.__selected).length;
  const paidGapCount = items.filter((i) => i.__selected && paidPaymentGap(i)).length;

  return (
    <div className="fixed inset-0 z-[90] bg-black/30 grid place-items-center p-4" onClick={onClose}>
      <div className="bg-card w-full max-w-lg rounded-2xl border border-line2 shadow-pop p-6 max-h-[90dvh] overflow-y-auto" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2"><NotionLogo size={18} /> Import from Notion</h3>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg text-inksoft hover:text-ink hover:bg-card2 cursor-pointer"><IconClose size={18} /></button>
        </div>

        {phase === "status" && status && !status.connected && status.configured && (
          <div className="text-center py-6">
            <span className="h-12 w-12 rounded-2xl accent-tint-bg accent-ink grid place-items-center mx-auto mb-3"><NotionLogo size={22} /></span>
            <h4 className="font-semibold">Connect Notion</h4>
            <p className="text-sm text-inksoft mt-1 mb-4">Authorize your own Notion account, then pick a database to import.</p>
            <Button onClick={connect}>Connect Notion</Button>
          </div>
        )}
        {status && !status.configured && (
          <p className="text-sm text-inksoft text-center py-6">Notion isn&apos;t configured on this deployment yet.</p>
        )}
        {!status && <div className="flex items-center gap-2 text-inksoft py-6"><Spinner /> <span className="text-sm">Checking Notion…</span></div>}

        {phase === "dbs" && status?.connected && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-inksoft">{status.workspace ? `Connected to ${status.workspace}` : "Connected to Notion"}</p>
              <Button size="sm" variant="secondary" onClick={loadDbs} disabled={dbLoading}><IconRefresh size={15} /> {dbLoading ? "Loading…" : "Refresh"}</Button>
            </div>
            {dbLoading && <p className="flex items-center gap-2 text-inksoft py-4"><Spinner /> <span className="text-sm">Reading workspace…</span></p>}
            {!dbLoading && (
              <div className="space-y-2">
                {databases.map((db) => (
                  <button key={db.id} onClick={() => pick(db)} className="w-full card p-3 text-left flex items-center gap-3 cursor-pointer hover:border-[var(--accent)] transition-colors">
                    <span className="h-8 w-8 rounded-lg bg-card2 grid place-items-center text-sm font-semibold text-inksoft">{db.title[0]?.toUpperCase() ?? "N"}</span>
                    <span className="text-sm font-medium truncate">{db.title}</span>
                  </button>
                ))}
                {!databases.length && !dbLoading && <p className="text-sm text-inksoft">No databases found.</p>}
              </div>
            )}
          </div>
        )}

        {phase === "fetching" && <p className="flex items-center gap-2 text-inksoft py-6"><Spinner /> <span className="text-sm">Reading {dbName || "database"}…</span></p>}
        {phase === "mapping" && <p className="flex items-center gap-2 text-inksoft py-6"><Spinner /> <span className="text-sm">Mapping your columns with AI…</span></p>}

        {phase === "review" && (
          <div>
            <div className="mb-3">
              <h4 className="font-semibold text-[15px]">Review your deals</h4>
              <p className="text-sm text-inksoft mt-0.5">{selCount} selected · {lowCount} flagged for review</p>
            </div>
            {paidGapCount > 0 && (
              <div className="border border-warn/40 bg-warn/10 rounded-lg p-3 mb-3" role="alert">
                <p className="font-semibold text-[13px]">{paidGapCount} deal{paidGapCount === 1 ? "" : "s"} marked paid have no payment details</p>
                <p className="text-[12.5px] text-ink mt-1">
                  {paidGapCount === 1 ? "This source row says" : "These source rows say"} the deal is paid, but there is no payment amount, status, or date to back it.
                  Talby will create {paidGapCount === 1 ? "it" : "them"} as <b>Not invoiced</b> with no payment record rather than guess. Unselect a row to leave it out, or close and fix the source before importing.
                </p>
              </div>
            )}
            <div className="max-h-[46vh] overflow-y-auto space-y-2 pr-1">
              {items.map((r, i) => (
                <div key={i} className={cn("panel p-3", (r.confidence ?? 1) < 0.6 && "ring-1 ring-late/40", !r.__selected && "opacity-60")}>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1 h-4 w-4" style={{ accentColor: "var(--accent)" }} checked={!!r.__selected} onChange={(e) => setItems((prev) => prev.map((it, j) => j === i ? { ...it, __selected: e.target.checked } : it))} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold truncate">{r.brand || "Unnamed deal"}</span>
                        {(r.confidence ?? 1) < 0.6 && <StatusPill kind="late" className="flex-none">Review</StatusPill>}
                        {paidPaymentGap(r) && <StatusPill kind="late" className="flex-none">No payment</StatusPill>}
                      </div>
                      <div className="text-[12px] text-inksoft mt-0.5">
                        {r.value ? `${formatMoney(toNum(r.value))}` : ""}{r.due_date ? ` · Due ${r.due_date}` : ""}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {error && <p className="text-sm text-late mt-2" role="alert">{error}</p>}
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-inksoft">{selCount} selected</span>
              <Button onClick={applyAll} disabled={importing || selCount === 0}>{importing ? <Spinner /> : null} Import {selCount} deal{selCount === 1 ? "" : "s"}</Button>
            </div>
          </div>
        )}

        {error && phase !== "review" && <p className="text-sm text-late mt-3" role="alert">{error}</p>}
      </div>
    </div>
  );
}