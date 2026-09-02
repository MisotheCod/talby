"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatMoney, formatDate, cn, isPastDue } from "@/lib/utils";
import { FREE_ACTIVE_DEAL_CAP } from "@/lib/constants";
import { IconPlus, IconClose, IconCheck, IconLink, IconDelete, IconPaperclip, IconInfo, IconDown, IconUpload, IconGrid, IconList, IconMail } from "@/components/icons";
import { Button, Input, Textarea, Select, StatusPill, Spinner, Segmented } from "@/components/ui";
import { UpgradeModal } from "@/components/upgrade-modal";
import { NotionLogo } from "@/components/marketing/notion-logo";
import { DealForm, emptyDealForm, type DealFormValues } from "@/components/deal-form";
import UploadModal from "@/components/upload-modal";
import { useCelebration } from "@/components/confetti";

type Deal = {
  id: string; brand: string; status: string; deliverable: string | null;
  value: number | null; due_date: string | null; notes: string | null;
  links: { url: string; label?: string }[]; active: boolean;
  rep_name: string | null; rep_email: string | null;
  payment_status: string; pay_terms: string | null; exclusivity_days: number | null;
  created_at?: string;
  // Joined lookups for the six-column list:
  post_date?: string | null;   // earliest content.event_date
  pay_by?: string | null;      // earliest payment expected_date (received or not)
  pay_received?: boolean;      // any payment on the deal marked received
  all_invoiced?: boolean;      // every dated payment on the deal is invoiced
};
type Payment = { id: string; deal_id: string | null; amount: number; expected_date: string | null; status: string; notes: string | null; invoice_state: string | null };
type ChecklistItem = { id: string; deal_id: string; title: string; done: boolean };
type DealFile = { id: string; deal_id: string; name: string; path: string; size_bytes: number | null; mime: string | null };

const FILTERS = ["Negotiating", "Active", "Paid", "All"] as const;

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
  const [sort, setSort] = useState<"newest" | "brand" | "value_high" | "value_low" | "pay_by">("newest");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const loadDeals = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const [d, posts, pays] = await Promise.all([
      supabase.from("deals").select("*").order("created_at", { ascending: false }),
      user ? supabase.from("content").select("event_date, linked_deal_id").eq("user_id", user.id).gte("event_date", "1990-01-01").order("event_date", { ascending: true }) : { data: [] },
      user ? supabase.from("payments").select("expected_date, status, deal_id, invoice_state").eq("user_id", user.id).order("expected_date", { ascending: true }) : { data: [] },
    ]);
    const deals = (d.data ?? []) as unknown as Deal[];
    // post date = earliest content.event_date per deal
    const postByDeal = new Map<string, string>();
    for (const c of (posts.data ?? []) as { event_date: string; linked_deal_id: string | null }[]) {
      if (!c.linked_deal_id || !c.event_date) continue;
      const cur = postByDeal.get(c.linked_deal_id);
      if (!cur || c.event_date < cur) postByDeal.set(c.linked_deal_id, c.event_date.slice(0, 10));
    }
    // pay by = earliest payment expected_date; pay_received = any received;
    // all_invoiced = every dated payment is invoiced (or needs no invoice)
    const payByDeal = new Map<string, string>();
    const receivedDeal = new Set<string>();
    const invoicedOkDeal = new Set<string>();
    const anyDatedDeal = new Set<string>();
    for (const p of (pays.data ?? []) as { expected_date: string | null; status: string; deal_id: string | null; invoice_state: string | null }[]) {
      if (!p.deal_id) continue;
      if (p.status === "received") receivedDeal.add(p.deal_id);
      if (p.expected_date) {
        const cur = payByDeal.get(p.deal_id);
        if (!cur || p.expected_date < cur) payByDeal.set(p.deal_id, p.expected_date.slice(0, 10));
        anyDatedDeal.add(p.deal_id);
        const inv = (p.invoice_state ?? "not_invoiced");
        if (inv === "invoiced" || inv === "no_invoice_needed") invoicedOkDeal.add(p.deal_id);
      }
    }
    setDeals(deals.map((deal) => ({
      ...deal,
      post_date: postByDeal.get(deal.id) ?? deal.post_date ?? null,
      pay_by: payByDeal.get(deal.id) ?? deal.pay_by ?? null,
      pay_received: receivedDeal.has(deal.id),
      all_invoiced: anyDatedDeal.has(deal.id) && invoicedOkDeal.has(deal.id),
    })));
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
      case "Negotiating": return d.status === "pipeline";
      case "Active": return d.active && d.status !== "archived" && !paid && d.status !== "pipeline";
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
      case "pay_by": return (a.pay_by || "9999").localeCompare(b.pay_by || "9999");
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
                  href="/app/import?source=notion"
                  onClick={() => setNewOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink rounded-lg hover:bg-card2 cursor-pointer"
                >
                  <NotionLogo size={16} className="shrink-0" />
                  <span className="whitespace-nowrap">Import from Notion</span>
                  <span className="ml-auto text-xs text-inkfaint whitespace-nowrap pl-3">Connect & pull deals</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Filter chips + search + sort + view toggle */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1.5 flex-wrap">
          <Segmented options={FILTERS} value={filter} onChange={(f) => { setFilter(f); setPage(1); }} />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search deals…" className="!w-44 !h-9 text-xs" />
          <Select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="!w-[130px] !h-9 text-xs">
            <option value="newest">Newest</option>
            <option value="brand">Brand A-Z</option>
            <option value="value_high">Value: high</option>
            <option value="value_low">Value: low</option>
            <option value="pay_by">Pay by date</option>
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
            <Link href="/app/import"><Button variant="secondary"><NotionLogo size={16} className="shrink-0" /> Import deals</Button></Link>
          </div>
        </div>
      ) : view === "board" ? (
        <DealBoard deals={visible} onOpen={(id) => setSelectedId(id)} onChanged={onUpdated} />
      ) : (
        <>
          <div className="panel overflow-hidden">
            {/* Column headers */}
            <div className="hidden sm:grid grid-cols-[minmax(0,2.2fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.8fr)] gap-3 px-[22px] py-2.5 border-b border-line text-[11px] font-semibold uppercase tracking-wide text-inkfaint">
              <span>Brand</span>
              <span>Status</span>
              <span>Payment</span>
              <span>Post date</span>
              <span>Pay by</span>
              <span className="text-right">Amount</span>
            </div>
            {pageItems.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedId(d.id)}
                onKeyDown={(e) => { if (e.key === "Enter") setSelectedId(d.id); }}
                className={cn("w-full grid grid-cols-[minmax(0,2.2fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.8fr)] gap-3 items-center px-[22px] py-[14px] border-t border-line text-left hover:bg-card2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] deal-row", selectedId === d.id && "bg-card2")}
              >
                <span className="d-brand flex items-center gap-3 min-w-0">
                  <span className="h-10 w-10 rounded-xl flex-none flex items-center justify-center font-bold text-[15px] bg-card2 text-inksoft border border-line">
                    {d.brand.charAt(0).toUpperCase()}
                  </span>
                  <span className="d-brand-name text-[15px] font-semibold truncate">{d.brand}</span>
                </span>
                <span className="d-status"><DealStatusBadge status={d.status} payment_status={d.payment_status} active={d.active} due={d.due_date} /></span>
                <span className="d-payment">{paymentPill(d)}</span>
                <span className={cn("d-post text-[12.5px] tabular-nums", d.post_date && isPastDue(d.post_date) && d.status !== "archived" ? "text-late font-medium" : "text-inksoft")}>
                  {d.post_date ? formatDate(d.post_date) : <NotSet />}
                </span>
                <span className={cn("d-payby text-[12.5px] tabular-nums", d.pay_by && isPastDue(d.pay_by) && d.payment_status !== "paid" && d.status !== "paid" ? "text-late font-medium" : "text-inksoft")}>
                  {d.pay_by ? formatDate(d.pay_by) : <NotSet />}
                </span>
                <span className="d-amount money text-sm font-medium tabular-nums text-right">{formatMoney(d.value)}</span>
              </button>
            ))}
            {/* Sum footer — totals the visible/filtered rows */}
            <div className="flex items-center justify-between px-[22px] py-3 border-t border-line bg-card2/40">
              <span className="text-[12px] font-semibold uppercase tracking-wide text-inkfaint">
                Total {filterLabel(filter)}
              </span>
              <span className="money text-[15px] font-bold tabular-nums">{formatMoney(visible.reduce((s, deal) => s + (deal.value ?? 0), 0))}</span>
            </div>
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
  if (status === "pipeline") return <StatusPill kind="pipeline">Negotiating</StatusPill>;
  if (status === "archived") return <StatusPill kind="neutral">Archived</StatusPill>;
  if (pay === "paid") return <StatusPill kind="paid">Paid</StatusPill>;
  if (isPastDue(due)) return <StatusPill kind="late">Past due</StatusPill>;
  return <StatusPill kind="accent">{active ? "Active" : "Archived"}</StatusPill>;
}

/** Payment-status pill shown in the "Payment" column. "Past due" applies only
 *  to invoiced payments; an uninvoiced overdue payment reads "Invoice overdue"
 *  (the creator is late sending it), consistent with the Payments page. */
function paymentPill(d: Deal) {
  if (d.payment_status === "paid" || d.status === "paid" || d.pay_received) {
    return <StatusPill kind="paid">Paid</StatusPill>;
  }
  if (d.pay_by && isPastDue(d.pay_by)) {
    if (d.all_invoiced) return <StatusPill kind="late">Past due</StatusPill>;
    return <StatusPill kind="late">Invoice overdue</StatusPill>;
  }
  if (d.pay_by) {
    return <StatusPill kind="due">Pay by {formatDate(d.pay_by)}</StatusPill>;
  }
  return <StatusPill kind="due">Expected</StatusPill>;
}

/** "Not set" placeholder — a muted, legible empty rather than a dash or gap. */
function NotSet() {
  return <span className="text-inkfaint">Not set</span>;
}

/** Label for the sum footer, scoped to the active filter. */
function filterLabel(filter: (typeof FILTERS)[number]): string {
  if (filter === "Active" || filter === "All") return "booked";
  return filter.toLowerCase();
}

/* ---------------- Deal Board (kanban) ---------------- */
const BOARD_COLS: { id: string; label: string; match: (d: Deal) => boolean }[] = [
  { id: "pipeline", label: "Negotiating", match: (d) => d.status === "pipeline" },
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
            <p className="text-inksoft mt-0.5">You have {activeCount} active deals, the free plan holds {FREE_ACTIVE_DEAL_CAP}. <a href="/#pricing" onClick={onClose} className="accent-ink font-semibold underline underline-offset-2 hover:opacity-80">Go unlimited</a> to keep adding.</p>
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

  // Keyboard + swipe dismiss: Escape closes, and on touch a downward drag
  // past a threshold closes the drawer. Guarantees there is always a way out.
  const touchStart = useRef<number | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientY; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const dy = e.changedTouches[0].clientY - touchStart.current;
    touchStart.current = null;
    if (dy > 80) onClose();
  };

  /* One-tap "Mark as paid": mark every outstanding payment on the deal as received
     and stamp the deal's payment_status to paid, so a user never has to dig
     through the Payments tab to record that money landed. Works for deals with
     payment rows AND deals that just carry a value (no rows yet). */
  const notFullyPaid = deal.payment_status !== "paid" && deal.status !== "paid";
  const hasChargeableValue = !!payments.some((p) => p.status !== "received") || (deal.value !== null && deal.value > 0);
  const showMarkPaid = notFullyPaid && hasChargeableValue;

  const markAllPaid = async () => {
    await supabase.from("payments").update({ status: "received" }).eq("deal_id", deal.id);
    await supabase.from("deals").update({ payment_status: "paid", status: "active", active: true }).eq("id", deal.id);
    setPayments(payments.map((p) => ({ ...p, status: "received" })));
    onUpdated();
    onCelebrate?.();
  };

  return (
    <div className="fixed inset-0 z-[85] bg-black/20" onClick={onClose} role="presentation">
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-line shadow-pop drawer-in flex flex-col" onClick={(e) => e.stopPropagation()} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} role="dialog" aria-modal="true">
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
          {showMarkPaid && (
            <Button
              onClick={markAllPaid}
              size="lg"
              className="mt-3 w-full"
            >
              <IconCheck size={16} /> Mark as paid
            </Button>
          )}
          {(deal.links as { url: string; label?: string }[] ?? []).filter((l) => /^From inbox/.test(l.label || "")).map((l, i) => (
            <a
              key={i}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center gap-2 text-xs text-accent-ink rounded-lg bg-card2 border border-line px-2.5 py-1.5 hover:border-[var(--accent)] transition w-fit cursor-pointer"
            >
              <IconMail size={13} /> {l.label}{l.url.startsWith("mailto:") ? " · Reply" : ""}
            </a>
          ))}
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
  const [saved, setSaved] = useState(false);
  const dirty = notes !== (deal.notes ?? "");
  const save = async () => {
    setSaving(true);
    await supabase.from("deals").update({ notes }).eq("id", dealId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    onSaved();
  };
  return (
    <div className="space-y-3">
      <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes about this deal…" className="min-h-[160px]" />
      <div className="flex justify-end"><Button onClick={save} disabled={saving || !dirty}>{saving ? <Spinner /> : saved ? <span className="flex items-center gap-1.5"><IconCheck size={15} /> Saved</span> : "Save notes"}</Button></div>
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
            <button
              onClick={async () => {
                const { data } = await supabase.storage.from("deal-files").createSignedUrl(f.path, 300);
                if (data?.signedUrl) window.open(data.signedUrl, "_blank");
              }}
              className="flex-1 truncate text-left hover:text-[var(--accent)] cursor-pointer"
              title="Open or download"
            >
              {f.name}
            </button>
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

  const add = async () => {
    if (!amount) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("payments").insert({ user_id: user.id, deal_id: dealId, amount: Number(amount), expected_date: date || null, invoice_state: "not_invoiced" }).select().single();
    if (data) { setPayments([data as unknown as Payment, ...payments]); setAmount(""); setDate(""); onChanged(); }
  };
  const markReceived = async (id: string) => {
    await supabase.from("payments").update({ status: "received" }).eq("id", id);
    setPayments(payments.map((p) => (p.id === id ? { ...p, status: "received" } : p)));
    onChanged();
    onCelebrate?.();
  };
  const setInvoiceState = async (p: Payment, state: string) => {
    await supabase.from("payments").update({ invoice_state: state }).eq("id", p.id);
    setPayments(payments.map((x) => (x.id === p.id ? { ...x, invoice_state: state } : x)));
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
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span className={cn("text-xs", p.status === "received" ? "text-paid" : isPastDue(p.expected_date) ? "text-late" : "text-inksoft")}>
                    {p.status === "received" ? "Received" : isPastDue(p.expected_date) ? "Past due" : formatDate(p.expected_date)}
                  </span>
                  {p.status !== "received" && (
                    <button
                      onClick={() => { const s = p.invoice_state ?? "not_invoiced"; const next = s === "invoiced" ? "not_invoiced" : s === "not_invoiced" ? "no_invoice_needed" : "invoiced"; setInvoiceState(p, next); }}
                      className={cn(
                        "text-[10.5px] font-semibold rounded-full px-2 py-0.5 border cursor-pointer transition-colors",
                        (p.invoice_state ?? "not_invoiced") === "invoiced" && "bg-paidbg text-paid border-paid/30",
                        (p.invoice_state ?? "not_invoiced") === "not_invoiced" && "bg-duebg text-due border-due/30",
                        (p.invoice_state ?? "not_invoiced") === "no_invoice_needed" && "bg-card2 text-inksoft border-line2"
                      )}
                    >
                      {(p.invoice_state ?? "not_invoiced") === "invoiced" ? "Invoiced" : (p.invoice_state ?? "not_invoiced") === "no_invoice_needed" ? "No invoice needed" : "Not invoiced"}
                    </button>
                  )}
                </div>
              </div>
              {p.status !== "received" && (
                <Button size="sm" variant="secondary" onClick={() => markReceived(p.id)}><IconCheck size={14} /> Mark as paid</Button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {payments.length === 0 && <p className="text-sm text-inksoft py-2">No payments on this deal yet.</p>}
    </div>
  );
}
