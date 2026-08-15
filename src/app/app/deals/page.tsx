"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatMoney, formatDate, cn, isPastDue } from "@/lib/utils";
import { FREE_ACTIVE_DEAL_CAP } from "@/lib/config";
import { IconPlus, IconClose, IconCheck, IconLink, IconDelete, IconPaperclip, IconInfo, IconDownload, IconDown, IconUpload, IconGrid, IconList } from "@/components/icons";
import { Button, Chip, Input, Textarea, Select, StatusPill, Spinner } from "@/components/ui";
import { UpgradeModal } from "@/components/upgrade-modal";
import { DealForm, emptyDealForm, type DealFormValues } from "@/components/deal-form";
import UploadModal from "@/components/upload-modal";
import { useCelebration } from "@/components/confetti";

type Deal = {
  id: string; brand: string; status: string; deliverable: string | null;
  value: number | null; due_date: string | null; notes: string | null;
  links: { url: string; label?: string }[]; active: boolean;
  rep_name: string | null; rep_email: string | null; nudge_mode: string;
  payment_status: string; pay_terms: string | null; exclusivity_days: number | null;
  created_at?: string;
};
type Payment = { id: string; deal_id: string | null; amount: number; expected_date: string | null; status: string; notes: string | null };
type ChecklistItem = { id: string; deal_id: string; title: string; done: boolean };
type DealFile = { id: string; deal_id: string; name: string; path: string; size_bytes: number | null; mime: string | null };

const FILTERS = ["Active", "Pipeline", "Unpaid", "Paid", "All"] as const;

export default function DealsPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Active");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newOpen, setNewOpen] = useState(false); // dropdown open
  const [newMode, setNewMode] = useState<"blank" | "upload" | null>(null); // which New deal modal variant
  const [plan, setPlan] = useState<"free" | "paid">("free");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [loading, setLoading] = useState(true);
  const celeb = useCelebration();
  const [view, setView] = useState<"list" | "board">("list");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"newest" | "brand" | "value_high" | "value_low" | "due">("newest");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const loadDeals = useCallback(async () => {
    const { data } = await supabase.from("deals").select("*").order("created_at", { ascending: false });
    setDeals((data ?? []) as unknown as Deal[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { loadDeals(); }, [loadDeals, supabase]);

  // Open drawer or new-deal modal via URL params (?open=id, ?new=1)
  useEffect(() => {
    if (searchParams.get("new") === "1") setNewMode("blank");
    if (searchParams.get("open")) setSelectedId(searchParams.get("open"));
  }, [searchParams]);

  // Load plan
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const p = await supabase.from("profiles").select("plan").eq("id", user.id).single();
        setPlan(((p.data as unknown as { plan: string } | null)?.plan ?? "free") as "free" | "paid");
      }
    })();
  }, [supabase]);

  const activeCount = deals.filter((d) => d.active && d.status !== "archived").length;

  const filtered = deals.filter((d) => {
    const paid = d.payment_status === "paid" || d.status === "paid";
    switch (filter) {
      case "Active": return d.active && d.status !== "archived" && !paid && d.status !== "pipeline";
      case "Pipeline": return d.status === "pipeline";
      case "Unpaid": return d.status === "unpaid" || (!paid && d.status !== "pipeline" && d.status !== "archived");
      case "Paid": return paid;
      default: return true;
    }
  });
  const q = query.trim().toLowerCase();
  const searched = q
    ? filtered.filter((d) => (d.brand || "").toLowerCase().includes(q) || (d.deliverable || "").toLowerCase().includes(q) || (d.rep_name || "").toLowerCase().includes(q))
    : filtered;

  const visible = [...searched].sort((a, b) => {
    switch (sort) {
      case "brand": return (a.brand || "").localeCompare(b.brand || "");
      case "value_high": return (b.value ?? 0) - (a.value ?? 0);
      case "value_low": return (a.value ?? 0) - (b.value ?? 0);
      case "due": return (a.due_date || "9999").localeCompare(b.due_date || "9999");
      default: return (b.created_at || "").localeCompare(a.created_at || "");
    }
  });

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = view === "list" ? visible.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE) : visible;

  const selected = deals.find((d) => d.id === selectedId) ?? null;

  const onCreated = () => { setNewMode(null); celeb.fire(); loadDeals(); };
  const onUpdated = () => loadDeals();

  if (loading) return <div className="space-y-4"><div className="skeleton h-10 w-56" /><div className="skeleton h-20" /><div className="skeleton h-20" /><div className="skeleton h-20" /></div>;

  return (
    <div className="space-y-6 fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Deals</h1>
          <p className="text-sm text-inksoft mt-1">
            {plan === "free"
              ? `${activeCount} of ${FREE_ACTIVE_DEAL_CAP} active deals`
              : `${activeCount} active deals`}
          </p>
        </div>
        <div className="relative">
          <div className="flex items-center gap-2">
            <Button onClick={() => setNewOpen((o) => !o)} aria-expanded={newOpen} aria-haspopup="menu">
              <IconPlus size={16} /> Add deal <IconDown size={16} />
            </Button>
          </div>
          {newOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setNewOpen(false)} />
              <div role="menu" className="absolute right-0 top-[calc(100%+6px)] w-80 bg-card border border-line2 rounded-xl shadow-pop p-1.5 z-40 fade-up">
                <button
                  role="menuitem"
                  onClick={() => { setNewOpen(false); setNewMode("blank"); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-ink rounded-lg hover:bg-card2 cursor-pointer text-left"
                >
                  <IconPlus size={16} className="text-inksoft shrink-0" />
                  <span className="whitespace-nowrap">New deal</span>
                  <span className="ml-auto text-xs text-inkfaint whitespace-nowrap pl-3">Start from scratch</span>
                </button>
                <button
                  role="menuitem"
                  onClick={() => { setNewOpen(false); setNewMode("upload"); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-ink rounded-lg hover:bg-card2 cursor-pointer text-left"
                >
                  <IconUpload size={16} className="text-inksoft shrink-0" />
                  <span className="whitespace-nowrap">Upload</span>
                  <span className="ml-auto text-xs text-inkfaint whitespace-nowrap pl-3">Contract or CSV</span>
                </button>
                <div className="my-1 h-px bg-line" />
                <Link
                  href="/app/import"
                  onClick={() => setNewOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink rounded-lg hover:bg-card2 cursor-pointer"
                >
                  <IconDownload size={16} className="text-inksoft shrink-0" />
                  <span className="whitespace-nowrap">Import deals</span>
                  <span className="ml-auto text-xs text-inkfaint whitespace-nowrap pl-3">Notion or CSV</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Filter chips + search + sort + view toggle */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map((f) => <Chip key={f} active={filter === f} onClick={() => { setFilter(f); setPage(1); }}>{f}</Chip>)}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search deals…" className="!w-44 !h-9 text-xs" />
          <Select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="!w-[130px] !h-9 text-xs">
            <option value="newest">Newest</option>
            <option value="brand">Brand A-Z</option>
            <option value="value_high">Value: high</option>
            <option value="value_low">Value: low</option>
            <option value="due">Due date</option>
          </Select>
          <div className="flex items-center gap-1 p-1 rounded-xl border border-line2 bg-card">
            <button onClick={() => setView("list")} aria-label="List view" className={cn("h-9 px-2.5 rounded-lg grid place-items-center cursor-pointer text-inksoft", view === "list" && "bg-card2 text-ink border border-line")}><IconList size={17} /></button>
            <button onClick={() => setView("board")} aria-label="Board view" className={cn("h-9 px-2.5 rounded-lg grid place-items-center cursor-pointer text-inksoft", view === "board" && "bg-card2 text-ink border border-line")}><IconGrid size={17} /></button>
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="panel p-10 text-center flex flex-col items-center gap-3">
          <p className="text-sm text-inksoft">No deals in this view yet.</p>
          <div className="flex gap-2 flex-wrap justify-center">
            <Button variant="secondary" onClick={() => setNewMode("blank")}><IconPlus size={16} /> Add a deal</Button>
            <Link href="/app/import"><Button variant="secondary"><IconDownload size={16} /> Import deals</Button></Link>
          </div>
        </div>
      ) : view === "board" ? (
        <DealBoard deals={visible} onOpen={(id) => setSelectedId(id)} onChanged={onUpdated} />
      ) : (
        <>
          <div className="panel">
            {pageItems.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedId(d.id)}
                className={cn("w-full flex items-center gap-3.5 px-[22px] py-[15px] border-t border-line text-left hover:bg-card2 transition-colors cursor-pointer", selectedId === d.id && "bg-card2")}
              >
                <span className="h-10 w-10 rounded-xl flex-none flex items-center justify-center font-bold text-[15px] bg-card2 text-inksoft border border-line">
                  {d.brand.charAt(0).toUpperCase()}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[15px] font-semibold truncate">{d.brand}</span>
                  <span className="block text-[12.5px] text-inkfaint mt-0.5 truncate">{d.deliverable || "No deliverable"}</span>
                </span>
                <span className="text-right flex-none">
                  <span className="block money text-sm font-medium mb-1.5">{formatMoney(d.value)}</span>
                  <DealStatusBadge status={d.status} payment_status={d.payment_status} active={d.active} due={d.due_date} />
                </span>
              </button>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} className="px-3 h-9 rounded-lg border border-line2 bg-card text-sm text-inksoft hover:text-ink disabled:opacity-40 cursor-pointer disabled:cursor-default">Previous</button>
              <span className="text-sm text-inksoft px-2">Page {safePage} of {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="px-3 h-9 rounded-lg border border-line2 bg-card text-sm text-inksoft hover:text-ink disabled:opacity-40 cursor-pointer disabled:cursor-default">Next</button>
            </div>
          )}
        </>
      )}

      {newMode && newMode === "blank" && (
        <NewDealModal
          plan={plan}
          activeCount={activeCount}
          initialMode="blank"
          onClose={() => setNewMode(null)}
          onCreated={onCreated}
          onUpgrade={() => { setNewMode(null); setShowUpgrade(true); }}
        />
      )}

      {newMode === "upload" && (
        <UploadModal onClose={() => setNewMode(null)} onSaved={onCreated} />
      )}

      {selected && (
        <DealDrawer
          deal={selected}
          onClose={() => setSelectedId(null)}
          onUpdated={onUpdated}
          onCelebrate={celeb.fire}
        />
      )}

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      {celeb.ToastEl}
    </div>
  );
}

function DealStatusBadge({ status, payment_status, active, due }: { status: string; payment_status?: string; active: boolean; due: string | null }) {
  // Deal lifecycle (pipeline/active/archived) + payment (expected/paid/none).
  const pay = payment_status ?? (status === "paid" ? "paid" : status === "unpaid" ? "expected" : "expected");
  if (status === "pipeline") return <StatusPill kind="pipeline">Pipeline</StatusPill>;
  if (status === "archived") return <StatusPill kind="neutral">Archived</StatusPill>;
  if (pay === "paid") return <StatusPill kind="paid">Paid</StatusPill>;
  if (isPastDue(due)) return <StatusPill kind="late">Past due</StatusPill>;
  return <StatusPill kind="accent">{active ? "Active" : "Archived"}</StatusPill>;
}

/* ---------------- Deal Board (kanban) ---------------- */
const BOARD_COLS: { id: string; label: string; match: (d: Deal) => boolean }[] = [
  { id: "pipeline", label: "Pipeline", match: (d) => d.status === "pipeline" },
  { id: "active", label: "Active", match: (d) => d.active && d.status !== "pipeline" && d.status !== "archived" && d.status !== "paid" },
  { id: "paid", label: "Paid", match: (d) => d.payment_status === "paid" || d.status === "paid" },
  { id: "archived", label: "Archived", match: (d) => d.status === "archived" },
];

function DealBoard({ deals, onOpen, onChanged }: { deals: Deal[]; onOpen: (id: string) => void; onChanged: () => void }) {
  const supabase = createClient();
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);

  const moveTo = async (col: string) => {
    if (!dragId) return;
    const target = BOARD_COLS.find((c) => c.id === col);
    if (target) {
      const patch: Record<string, unknown> = {};
      if (col === "pipeline") { patch.status = "pipeline"; patch.active = false; }
      else if (col === "archived") { patch.status = "archived"; patch.active = false; }
      else if (col === "paid") { patch.payment_status = "paid"; patch.status = "active"; patch.active = true; }
      else { patch.status = "active"; patch.active = true; }
      await supabase.from("deals").update(patch).eq("id", dragId);
      onChanged();
    }
    setDragId(null); setOverCol(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {BOARD_COLS.map((col) => (
        <div
          key={col.id}
          onDragOver={(e) => { e.preventDefault(); setOverCol(col.id); }}
          onDragLeave={() => setOverCol((c) => (c === col.id ? null : c))}
          onDrop={() => moveTo(col.id)}
          className={cn("panel p-3 flex flex-col gap-2 min-h-[140px]", overCol === col.id && "ring-2 ring-[var(--accent)]/40")}
        >
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-semibold">{col.label}</span>
            <span className="text-xs text-inksoft">{deals.filter(col.match).length}</span>
          </div>
          {deals.filter(col.match).length === 0 && <p className="text-xs text-inkfaint px-1 py-4 text-center">Drop a deal here.</p>}
          {deals.filter(col.match).map((d) => (
            <div
              key={d.id}
              draggable
              onDragStart={() => setDragId(d.id)}
              onDragEnd={() => { setDragId(null); setOverCol(null); }}
              className={cn("border border-line rounded-lg p-3 bg-card cursor-grab active:cursor-grabbing", dragId === d.id && "opacity-40")}
            >
              <button onClick={() => onOpen(d.id)} className="block w-full text-left cursor-pointer">
                <div className="text-sm font-semibold truncate">{d.brand}</div>
                <div className="text-xs text-inkfaint mt-0.5 truncate">{d.deliverable || "No deliverable"}</div>
              </button>
              <div className="flex items-center justify-between mt-2">
                <span className="money text-sm font-medium">{formatMoney(d.value)}</span>
                <DealStatusBadge status={d.status} payment_status={d.payment_status} active={d.active} due={d.due_date} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---------------- New Deal Modal ---------------- */
function NewDealModal({ plan, activeCount, initialMode, onClose, onCreated, onUpgrade }: { plan: "free" | "paid"; activeCount: number; initialMode: "blank" | "contract"; onClose: () => void; onCreated: () => void; onUpgrade: () => void }) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const atCap = plan === "free" && activeCount >= FREE_ACTIVE_DEAL_CAP;

  return (
    <Modal onClose={onClose} title={initialMode === "contract" ? "Upload a deal" : "New deal"}>
      {error && <p className="text-sm text-late mb-4" role="alert">{error}</p>}
      {atCap && (
        <div className="rounded-xl bg-accenttint p-4 text-sm mb-4 flex items-start gap-3">
          <IconInfo size={18} className="shrink-0 mt-0.5 accent-ink" />
          <div>
            <div className="font-semibold accent-ink">You&apos;ve reached the free-plan limit</div>
            <p className="text-inksoft mt-0.5">You have {activeCount} active deals, the free plan holds {FREE_ACTIVE_DEAL_CAP}. Go unlimited to keep adding.</p>
          </div>
        </div>
      )}
      <DealForm
        mode="create"
        initial={emptyDealForm()}
        uploadOnMount={initialMode === "contract"}
        onSaved={onCreated}
        setError={setError}
        pending={saving}
        submitLabel="Add deal"
      />
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink block mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Modal({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div className="bg-card w-full max-w-lg p-6 rounded-2xl border border-line2 shadow-pop fade-up" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg hover:bg-card2 cursor-pointer"><IconClose size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------------- Deal Detail Drawer ---------------- */
function DealDrawer({ deal, onClose, onUpdated, onCelebrate }: { deal: Deal; onClose: () => void; onUpdated: () => void; onCelebrate?: () => void }) {
  const supabase = createClient();
  const [tab, setTab] = useState<"Fields" | "Checklist" | "Notes" | "Files" | "Payments">("Fields");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [files, setFiles] = useState<DealFile[]>([]);
  const [plan, setPlan] = useState<"free" | "paid">("free");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const p = await supabase.from("profiles").select("plan").eq("id", user.id).single();
        setPlan(((p.data as unknown as { plan: string } | null)?.plan ?? "free") as "free" | "paid");
      }
      const [pay, cl, fl] = await Promise.all([
        supabase.from("payments").select("*").eq("deal_id", deal.id),
        supabase.from("deal_checklist").select("*").eq("deal_id", deal.id),
        supabase.from("deal_files").select("*").eq("deal_id", deal.id),
      ]);
      setPayments((pay.data ?? []) as unknown as Payment[]);
      setChecklist((cl.data ?? []) as unknown as ChecklistItem[]);
      setFiles((fl.data ?? []) as unknown as DealFile[]);
    })();
  }, [supabase, deal.id]);

  const TABS = ["Fields", "Checklist", "Notes", "Files", "Payments"] as const;

  return (
    <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose}>
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-card border-l border-line shadow-pop drawer-in flex flex-col" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <header className="px-6 py-5 border-b border-line">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="h-11 w-11 rounded-xl flex items-center justify-center font-bold text-[16px] bg-card2 text-inksoft border border-line">{deal.brand.charAt(0).toUpperCase()}</span>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">{deal.brand}</h2>
                <p className="text-sm text-inksoft mt-0.5">{deal.deliverable || "No deliverable"}</p>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close drawer" className="p-1.5 rounded-lg hover:bg-card2 cursor-pointer"><IconClose size={18} /></button>
          </div>
          <div className="mt-3"><DealStatusBadge status={deal.status} payment_status={deal.payment_status} active={deal.active} due={deal.due_date} /></div>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-line px-2">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn("px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-px", tab === t ? "text-accentink border-[var(--accent)] font-semibold" : "text-inksoft hover:text-ink border-transparent")}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {tab === "Fields" && <FieldsTab deal={deal} onSaved={onUpdated} />}
          {tab === "Checklist" && <ChecklistTab dealId={deal.id} items={checklist} setItems={setChecklist} />}
          {tab === "Notes" && <NotesTab dealId={deal.id} deal={deal} onSaved={onUpdated} />}
          {tab === "Files" && <FilesTab dealId={deal.id} files={files} setFiles={setFiles} plan={plan} />}
          {tab === "Payments" && <DrawerPaymentsTab dealId={deal.id} payments={payments} setPayments={setPayments} onChanged={onUpdated} onCelebrate={onCelebrate} />}
        </div>
      </div>
    </div>
  );
}

function FieldsTab({ deal, onSaved }: { deal: Deal; onSaved: () => void }) {
  const supabase = createClient();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [nudges, setNudges] = useState<{ sequence_step: number; subject: string; status: string; sent_at: string | null }[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("nudges").select("sequence_step, subject, status, sent_at").eq("deal_id", deal.id).order("created_at", { ascending: false });
      setNudges((data ?? []) as unknown as { sequence_step: number; subject: string; status: string; sent_at: string | null }[]);
    })();
  }, [supabase, deal.id]);

  const initial: DealFormValues = {
    brand: deal.brand,
    deliverable: deal.deliverable ?? "",
    value: deal.value?.toString() ?? "",
    status: deal.status === "unpaid" || deal.status === "paid" ? deal.active ? "active" : "archived" : deal.status,
    payment_status: deal.status === "paid" ? "paid" : deal.status === "unpaid" ? "expected" : (deal.payment_status ?? "expected"),
    due_date: deal.due_date ?? "",
    pay_terms: deal.pay_terms ?? "",
    exclusivity_days: deal.exclusivity_days?.toString() ?? "",
    rep_name: deal.rep_name ?? "",
    rep_email: deal.rep_email ?? "",
    nudge_mode: deal.nudge_mode ?? "draft",
    links: (deal.links as { url: string; label?: string }[] ?? []),
    notes: deal.notes ?? "",
  };

  return (
    <div className="space-y-4">
      <DealForm
        mode="edit"
        dealId={deal.id}
        initial={initial}
        onSaved={onSaved}
        setError={setError}
        pending={saving}
        submitLabel="Save changes"
      />
      {error && <p className="text-sm text-late" role="alert">{error}</p>}

      {nudges.length > 0 && (
        <div className="border-t border-line pt-3">
          <div className="text-[12px] font-semibold uppercase tracking-wide text-inkfaint mb-2">Nudge history</div>
          <div className="space-y-2">
            {nudges.map((n, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <StatusPill kind={n.status === "sent" ? "paid" : n.status === "skipped" ? "neutral" : "due"}>
                  {n.status === "sent" ? "Sent" : n.status === "skipped" ? "Skipped" : "Draft"}
                </StatusPill>
                <span className="flex-1 truncate text-inksoft">{n.subject}</span>
                {n.sent_at && <span className="text-xs text-inkfaint">{new Date(n.sent_at).toLocaleDateString()}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ChecklistTab({ dealId, items, setItems }: { dealId: string; items: ChecklistItem[]; setItems: (i: ChecklistItem[]) => void }) {
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const add = async () => {
    if (!title.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("deal_checklist").insert({ user_id: user.id, deal_id: dealId, title: title.trim() }).select().single();
    if (data) { setItems([data as unknown as ChecklistItem, ...items]); setTitle(""); }
  };
  const toggle = async (id: string, done: boolean) => {
    setItems(items.map((i) => (i.id === id ? { ...i, done } : i)));
    await supabase.from("deal_checklist").update({ done }).eq("id", id);
  };
  const remove = async (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    await supabase.from("deal_checklist").delete().eq("id", id);
  };
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="Add a checklist item…" />
        <Button onClick={add}><IconPlus size={16} /></Button>
      </div>
      <ul className="space-y-1">
        {items.map((i) => (
          <li key={i.id} className="flex items-center gap-2 py-1.5">
            <button onClick={() => toggle(i.id, !i.done)} aria-label="Toggle" className={cn("h-5 w-5 rounded-md border grid place-items-center shrink-0 cursor-pointer", i.done ? "bg-accent border-[var(--accent)]" : "border-line2 hover:border-[var(--accent)]")}>
              {i.done && <IconCheck size={12} className="text-onaccent" />}
            </button>
            <span className={cn("text-sm flex-1", i.done && "line-through text-inksoft")}>{i.title}</span>
            <button onClick={() => remove(i.id)} aria-label="Delete" className="text-inksoft hover:text-late cursor-pointer"><IconDelete size={14} /></button>
          </li>
        ))}
      </ul>
      {items.length === 0 && <p className="text-sm text-inksoft py-2">No checklist items yet.</p>}
    </div>
  );
}

function NotesTab({ dealId, deal, onSaved }: { dealId: string; deal: Deal; onSaved: () => void }) {
  const supabase = createClient();
  const [notes, setNotes] = useState(deal.notes ?? "");
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    await supabase.from("deals").update({ notes }).eq("id", dealId);
    setSaving(false);
    onSaved();
  };
  return (
    <div className="space-y-3">
      <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes about this deal…" className="min-h-[160px]" />
      <div className="flex justify-end"><Button onClick={save} disabled={saving}>{saving ? <Spinner /> : "Save notes"}</Button></div>
    </div>
  );
}

function FilesTab({ dealId, files, setFiles, plan }: { dealId: string; files: DealFile[]; setFiles: (f: DealFile[]) => void; plan: "free" | "paid" }) {
  const supabase = createClient();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (plan !== "paid") { setShowUpgrade(true); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const path = `${user.id}/${dealId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("deal-files").upload(path, file);
    if (error) return;
    await supabase.from("deal_files").insert({ user_id: user.id, deal_id: dealId, name: file.name, path, size_bytes: file.size, mime: file.type });
    const { data } = await supabase.from("deal_files").select("*").eq("deal_id", dealId);
    setFiles((data ?? []) as unknown as DealFile[]);
  };
  return (
    <div className="space-y-3">
      <label className="cursor-pointer">
        <span className="flex items-center justify-center gap-2 border-2 border-dashed border-line2 rounded-xl p-6 text-sm text-inksoft hover:border-[var(--accent)] hover:text-ink transition">
          <IconPaperclip size={16} /> {plan === "paid" ? "Upload a file" : "Files are on the paid plan"}
        </span>
        <input type="file" className="hidden" onChange={onUpload} disabled={plan !== "paid"} />
      </label>
      <ul className="space-y-1">
        {files.map((f) => (
          <li key={f.id} className="flex items-center gap-3 py-2 text-sm">
            <IconPaperclip size={16} className="text-inksoft" />
            <span className="flex-1 truncate">{f.name}</span>
            {f.size_bytes != null && <span className="text-xs text-inkfaint">{Math.round(f.size_bytes / 1024)} KB</span>}
            <button onClick={() => supabase.storage.from("deal-files").remove([f.path]).then(() => supabase.from("deal_files").delete().eq("id", f.id).then(() => setFiles(files.filter((x) => x.id !== f.id))))} aria-label="Delete" className="text-inksoft hover:text-late cursor-pointer"><IconDelete size={14} /></button>
          </li>
        ))}
      </ul>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}

function DrawerPaymentsTab({ dealId, payments, setPayments, onChanged, onCelebrate }: { dealId: string; payments: Payment[]; setPayments: (p: Payment[]) => void; onChanged: () => void; onCelebrate?: () => void }) {
  const supabase = createClient();
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [nudgeBusy, setNudgeBusy] = useState<string | null>(null);
  const [nudgeMsg, setNudgeMsg] = useState<{ id: string; kind: "ok" | "warn"; text: string } | null>(null);
  const [plan, setPlan] = useState<"free" | "paid">("free");
  const [repEmail, setRepEmail] = useState<string | null>(null);
  const [dealNudgeMode, setDealNudgeMode] = useState<string>("draft");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const p = await supabase.from("profiles").select("plan").eq("id", user.id).single();
        setPlan((p.data as unknown as { plan?: string })?.plan === "paid" ? "paid" : "free");
      }
      const d = await supabase.from("deals").select("rep_email, nudge_mode").eq("id", dealId).single();
      const row = (d.data ?? {}) as unknown as { rep_email?: string | null; nudge_mode?: string };
      setRepEmail(row.rep_email ?? null);
      setDealNudgeMode(row.nudge_mode ?? "draft");
    })();
  }, [supabase, dealId]);

  const nudgePayment = async (p: Payment) => {
    if (plan !== "paid") { setNudgeMsg({ id: p.id, kind: "warn", text: "Nudges are on the paid plan. Chasing this? Go unlimited and Talby drafts the follow-up for you." }); return; }
    if (!repEmail) { setNudgeMsg({ id: p.id, kind: "warn", text: "Add a rep email to nudge this one." }); return; }
    setNudgeBusy(p.id); setNudgeMsg(null);
    try {
      const res = await fetch("/api/nudges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deal_id: dealId, payment_id: p.id, action: "draft" }),
      });
      const data = await res.json();
      if (data.error === "already_paid") {
        setNudgeMsg({ id: p.id, kind: "ok", text: "This payment is already received, so no nudge will be sent." });
      } else if (data.mode === "draft") {
        setNudgeMsg({ id: p.id, kind: "ok", text: `Draft ready in Gmail: ${data.subject}. Review and send from your account.` });
      } else if (data.mode === "copy") {
        setNudgeMsg({ id: p.id, kind: "ok", text: `Nudge prepared: ${data.subject}. Connect Gmail to send, or copy it into your email client.` });
      } else {
        setNudgeMsg({ id: p.id, kind: "warn", text: data.message || data.error || "Could not prepare the nudge." });
      }
    } catch {
      setNudgeMsg({ id: p.id, kind: "warn", text: "Could not reach the nudge service." });
    }
    setNudgeBusy(null);
  };

  const add = async () => {
    if (!amount) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("payments").insert({ user_id: user.id, deal_id: dealId, amount: Number(amount), expected_date: date || null }).select().single();
    if (data) { setPayments([data as unknown as Payment, ...payments]); setAmount(""); setDate(""); onChanged(); }
  };
  const markReceived = async (id: string) => {
    await supabase.from("payments").update({ status: "received" }).eq("id", id);
    setPayments(payments.map((p) => (p.id === id ? { ...p, status: "received" } : p)));
    onChanged();
    onCelebrate?.();
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <Button onClick={add} className="w-full"><IconPlus size={16} /> Add payment</Button>
      <ul className="space-y-2">
        {payments.map((p) => (
          <li key={p.id} className="py-2 border-b border-line last:border-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold money tabular-nums">{formatMoney(p.amount)}</div>
                <div className={cn("text-xs", p.status === "received" ? "text-paid" : isPastDue(p.expected_date) ? "text-late" : "text-inksoft")}>
                  {p.status === "received" ? "Received" : isPastDue(p.expected_date) ? "Past due" : formatDate(p.expected_date)}
                </div>
              </div>
              {p.status !== "received" && (
                <div className="flex items-center gap-2">
                  {isPastDue(p.expected_date) && (
                    <Button size="sm" variant="ghost" onClick={() => nudgePayment(p)} disabled={nudgeBusy === p.id}>
                      <SendIcon /> {dealNudgeMode === "auto" ? "Nudge status" : "Send a nudge"}
                    </Button>
                  )}
                  <Button size="sm" variant="secondary" onClick={() => markReceived(p.id)}><IconCheck size={14} /> Mark received</Button>
                </div>
              )}
            </div>
            {nudgeMsg?.id === p.id && (
              <p className={cn("text-xs mt-1.5", nudgeMsg.kind === "ok" ? "text-paid" : "text-due")}>{nudgeMsg.text}</p>
            )}
          </li>
        ))}
      </ul>
      {payments.length === 0 && <p className="text-sm text-inksoft py-2">No payments on this deal yet.</p>}
    </div>
  );
}

function SendIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" /></svg>;
}
