"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatMoney, formatDate, cn, isPastDue } from "@/lib/utils";
import { dealPayRollup, payStatusLabel, isPayOverdue, type PayStatus, type DealRollup } from "@/lib/pay-status";
import { FREE_ACTIVE_DEAL_CAP } from "@/lib/constants";
import { IconPlus, IconClose, IconCheck, IconLink, IconDelete, IconMore, IconPaperclip, IconInfo, IconDown, IconUpload, IconGrid, IconList, IconMail, IconArrowLeft } from "@/components/icons";
import { Button, Input, Select, StatusPill, Spinner, Segmented } from "@/components/ui";
import { UpgradeModal } from "@/components/upgrade-modal";
import { NotionLogo } from "@/components/marketing/notion-logo";
import { DealForm, emptyDealForm, type DealFormValues } from "@/components/deal-form";
import { SaveToastHost, notifySaved } from "@/components/save-toast";
import UploadModal from "@/components/upload-modal";
import { useCelebration } from "@/components/confetti";

type Deal = {
  id: string; brand: string; status: string; deliverable: string | null;
  value: number | null; due_date: string | null; notes: string | null;
  links: { url: string; label?: string }[]; active: boolean;
  rep_name: string | null; rep_email: string | null;
  pay_terms: string | null; exclusivity_days: number | null;
  deal_type?: string | null;
  created_at?: string;
  // Joined lookups for the six-column list:
  post_date?: string | null;   // earliest content.event_date
  pay_by?: string | null;      // earliest payment expected_date (received or not)
  pay_received?: boolean;      // any payment on the deal marked received
  all_invoiced?: boolean;      // every dated payment on the deal is invoiced
  pay_rollup?: DealRollup;     // derived pay status + "N of M paid" progress
};
type Payment = { id: string; deal_id: string | null; amount: number; expected_date: string | null; status: string; notes: string | null; invoice_state: string | null; pay_status?: string | null };
type ChecklistItem = { id: string; deal_id: string; title: string; done: boolean };
type DealFile = { id: string; deal_id: string; name: string; path: string; size_bytes: number | null; mime: string | null };
type DraftField = "value" | "status" | "deliverable" | "deal_type" | "due_date" | "pay_terms" | "exclusivity_days" | "rep_name" | "rep_email" | "notes";
type Draft = Record<DraftField, string>;
const FIELD_KEYS: DraftField[] = ["value", "status", "deliverable", "deal_type", "due_date", "pay_terms", "exclusivity_days", "rep_name", "rep_email", "notes"];

const FILTERS = ["Negotiating", "Active", "Paid", "Archived", "All"] as const;

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
  const [deleteTarget, setDeleteTarget] = useState<Deal | null>(null);
  const [rowMenu, setRowMenu] = useState<string | null>(null);
  // Only one row menu is open at a time; dismissal (outside click, Escape) is
  // handled inside the portal RowMenuButton component.

  const loadDeals = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const [d, posts, pays] = await Promise.all([
      supabase.from("deals").select("*").order("created_at", { ascending: false }),
      user ? supabase.from("content").select("event_date, linked_deal_id").eq("user_id", user.id).gte("event_date", "1990-01-01").order("event_date", { ascending: true }) : { data: [] },
      user ? supabase.from("payments").select("expected_date, status, deal_id, invoice_state, pay_status").eq("user_id", user.id).order("expected_date", { ascending: true }) : { data: [] },
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
    // Rollup: collect each deal's payments (pay_status + date) to derive the
    // single deal-level status (Paid only when all paid, else earliest unpaid).
    const dealPays = new Map<string, { pay_status: string | null; expected_date: string | null }[]>();
    for (const p of (pays.data ?? []) as { expected_date: string | null; status: string; deal_id: string | null; invoice_state: string | null; pay_status?: string | null }[]) {
      if (!p.deal_id) continue;
      if (p.status === "received") receivedDeal.add(p.deal_id);
      if (p.expected_date) {
        const cur = payByDeal.get(p.deal_id);
        if (!cur || p.expected_date < cur) payByDeal.set(p.deal_id, p.expected_date.slice(0, 10));
        anyDatedDeal.add(p.deal_id);
        const inv = (p.invoice_state ?? "not_invoiced");
        if (inv === "invoiced" || inv === "no_invoice_needed") invoicedOkDeal.add(p.deal_id);
      }
      const arr = dealPays.get(p.deal_id) ?? [];
      arr.push({ pay_status: p.pay_status ?? null, expected_date: p.expected_date });
      dealPays.set(p.deal_id, arr);
    }
    setDeals(deals.map((deal) => ({
      ...deal,
      post_date: postByDeal.get(deal.id) ?? deal.post_date ?? null,
      pay_by: payByDeal.get(deal.id) ?? deal.pay_by ?? null,
      pay_received: receivedDeal.has(deal.id),
      all_invoiced: anyDatedDeal.has(deal.id) && invoicedOkDeal.has(deal.id),
      pay_rollup: dealPayRollup(dealPays.get(deal.id) ?? []),
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
    const paid = (d.pay_rollup?.status ?? "not_invoiced") === "paid";
    switch (filter) {
      case "Negotiating": return d.status === "pipeline";
      case "Active": return d.active && d.status !== "archived" && !paid && d.status !== "pipeline";
      case "Paid": return paid;
      case "Archived": return d.status === "archived";
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

  // Permanently delete via the server route (owns the cascade + storage + chunks).
  const performDelete = async (deal: Deal) => {
    setDeleteTarget(null);
    setRowMenu(null);
    const res = await fetch(`/api/deals/${deal.id}`, { method: "DELETE" });
    if (!res.ok) return;
    if (selectedId === deal.id) setSelectedId(null);
    await loadDeals(); // recalc totals, deal count, cap usage
  };
  // Archive (keeps history, frees a cap slot) vs delete (destroys). Archive is
  // the low-risk, prominent action; delete is the deliberate one behind a confirm.
  const setArchived = async (deal: Deal, archived: boolean) => {
    setRowMenu(null);
    await supabase.from("deals").update({ status: archived ? "archived" : "active", active: !archived }).eq("id", deal.id);
    await loadDeals();
  };
  // Duplicate: insert a fresh copy of the deal's fields (no idempotency key so a
  // repeat opens its own copy), then refresh. Note: files/contract are not copied.
  const duplicateDeal = async (deal: Deal) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("deals").insert({
      user_id: user.id,
      brand: `${deal.brand}`,
      deliverable: deal.deliverable, value: deal.value, status: deal.status,
      due_date: deal.due_date,
      pay_terms: deal.pay_terms, exclusivity_days: deal.exclusivity_days,
      rep_name: deal.rep_name, rep_email: deal.rep_email, deal_type: deal.deal_type,
      notes: deal.notes,
      active: deal.active,
    }).select("id").single();
    if (data) { setSelectedId(null); celeb.fire(); loadDeals(); }
  };

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

      {deals.length === 0 ? (
        <div className="deal-empty">
          <h2 className="text-[17px] font-bold text-ink">Add your first deal</h2>
          <p className="text-[13px] text-inksoft">Bring in what you already have, or start from scratch.</p>
          <div className="deal-empty-grid mt-4">
            <button
              type="button"
              onClick={() => setNewMode("upload")}
              className="deal-empty-card on"
            >
              <span className="de-head">
                <span className="de-icon"><IconUpload size={19} /></span>
                <span className="de-title">Upload a file</span>
                <span className="deal-empty-badge">Fastest</span>
              </span>
              <span className="de-desc">Drop in a signed contract or a spreadsheet and we pull out the brand, value, and dates for you.</span>
              <span className="de-meta">PDF, DOCX, CSV</span>
              <span className="de-btn">Choose a file</span>
            </button>
            <Link
              href="/app/import?source=notion"
              className="deal-empty-card"
            >
              <span className="de-head">
                <span className="de-icon"><NotionLogo size={18} className="shrink-0" /></span>
                <span className="de-title">Import from Notion</span>
              </span>
              <span className="de-desc">Connect your account, pick a database, and map the columns once.</span>
              <span className="de-meta">Brings in every row</span>
              <span className="de-btn">Connect Notion</span>
            </Link>
            <button
              type="button"
              onClick={() => setNewMode("blank")}
              className="deal-empty-card"
            >
              <span className="de-head">
                <span className="de-icon"><IconPlus size={19} /></span>
                <span className="de-title">Add one manually</span>
              </span>
              <span className="de-desc">Type in the brand, the deliverables, and what you are getting paid.</span>
              <span className="de-meta">About a minute</span>
              <span className="de-btn">Add a deal</span>
            </button>
          </div>
        </div>
      ) : visible.length === 0 ? (
        <div className="panel p-10 text-center flex flex-col items-center gap-3">
          <p className="text-sm text-inksoft">No deals match this filter.</p>
          <Button variant="secondary" onClick={() => setFilter("All")}>View all deals</Button>
        </div>
      ) : view === "board" ? (
        <DealBoard deals={visible} onOpen={(id) => setSelectedId(id)} onChanged={onUpdated} />
      ) : (
        <>
          <div className="panel overflow-hidden">
            {/* Column headers */}
            <div className="hidden sm:grid grid-cols-[minmax(0,2.2fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_32px] gap-3 px-[22px] py-2.5 border-b border-line text-[11px] font-semibold uppercase tracking-wide text-inkfaint">
              <span>Brand</span>
              <span>Status</span>
              <span>Payment</span>
              <span>Post date</span>
              <span>Pay by</span>
              <span className="text-right">Amount</span>
              <span className="text-right"> </span>
            </div>
            {pageItems.map((d) => (
              <div
                key={d.id}
                className={cn("relative", selectedId === d.id && "bg-card2")}
              >
                <div
                  onClick={() => setSelectedId(d.id)}
                  onKeyDown={(e) => { if (e.key === "Enter") setSelectedId(d.id); }}
                  role="button"
                  tabIndex={0}
                  className={cn("w-full grid gap-3 items-center px-[22px] py-[14px] border-t border-line text-left hover:bg-card2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] deal-row", selectedId === d.id && "bg-card2")}
                >
                  <span className="d-brand flex items-center gap-3 min-w-0">
                    <span className="h-10 w-10 rounded-xl flex-none flex items-center justify-center font-bold text-[15px] bg-card2 text-inksoft border border-line">
                      {d.brand.charAt(0).toUpperCase()}
                    </span>
                    <span className="d-brand-name text-[15px] font-semibold truncate">{d.brand}</span>
                  </span>
                  <span className="d-status"><DealStatusBadge status={d.status} active={d.active} /></span>
                  <span className="d-payment flex items-center gap-1">
                    {paymentPill(d)}
                    {payProgressLine(d) && <span className="text-[10.5px] text-inksoft tabular-nums">{payProgressLine(d)}</span>}
                  </span>
                  <span className={cn("d-post text-[12.5px] tabular-nums", d.post_date && isPastDue(d.post_date) && d.status !== "archived" ? "text-late font-medium" : "text-inksoft")}>
                    {d.post_date ? formatDate(d.post_date) : <NotSet />}
                  </span>
                  <span className={cn("d-payby text-[12.5px] tabular-nums", payOverdue(d) ? "text-late font-medium" : "text-inksoft")}>
                    {d.pay_by ? formatDate(d.pay_by) : <NotSet />}
                  </span>
                  <span className="d-amount money text-sm font-medium tabular-nums text-right">{formatMoney(d.value)}</span>
                  {/* Dedicated overflow-menu column: one button, its own grid area. The dropdown
                      itself renders in a portal to escape the table's overflow. */}
                  <span className="d-menu relative">
                    <RowMenuButton
                      open={rowMenu === d.id}
                      onToggle={() => setRowMenu(rowMenu === d.id ? null : d.id)}
                      current={d}
                      onArchive={(archived) => setArchived(d, archived)}
                      onDelete={() => setDeleteTarget(d)}
                    />
                  </span>
                </div>
              </div>
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
          onArchive={(archived) => setArchived(selected, archived)}
          onDeleteRequest={() => setDeleteTarget(selected)}
          onDuplicate={(d) => duplicateDeal(d)}
        />
      )}

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      {deleteTarget && (
        <ConfirmDeleteDeal
          deal={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => performDelete(deleteTarget)}
        />
      )}
      {celeb.ToastEl}
      <SaveToastHost />
    </div>
  );
}

function DealStatusBadge({ status, active }: { status: string; active: boolean }) {
  // Deal LIFECYCLE only (negotiating / archived / active). Payment state is a
  // separate derived pill (paymentPill), so life and money never blur into two
  // payment-looking pills.
  if (status === "pipeline") return <StatusPill kind="pipeline">Negotiating</StatusPill>;
  if (status === "archived") return <StatusPill kind="neutral">Archived</StatusPill>;
  return <StatusPill kind="accent">{active ? "Active" : "Inactive"}</StatusPill>;
}

/** Single pay-status pill derived from the deal's payment rollup. One pill, no
 *  separate invoice field. Overdue is NOT a status value — it's the derived
 *  danger date shown in the Pay-by column. */
const PAYS_PILL_KIND: Record<PayStatus, "paid" | "due" | "neutral" | "accent"> = {
  paid: "paid",
  invoiced: "paid",   // green — a sent/active invoice reads as positive
  no_invoice_needed: "neutral",
  not_invoiced: "due",
};
function paymentPill(d: Deal) {
  const r = d.pay_rollup ?? { status: "not_invoiced" as PayStatus, paidCount: 0, totalCount: 0 };
  const label = payStatusLabel(r.status);
  return <StatusPill size="sm" kind={PAYS_PILL_KIND[r.status]}>{label}</StatusPill>;
}

/** Deal-row convenience: derived overdue from the deal's rollup + pay-by date. */
function payOverdue(d: Deal): boolean {
  const status = (d.pay_rollup ?? { status: "not_invoiced" as PayStatus }).status;
  return isPayOverdue(status, d.pay_by, isPastDue);
}

/** Progress line shown on the deal row when a deal has multiple payments:
 *  "3 of 12 paid". Null for single-payment / zero-payment deals. */
function payProgressLine(d: Deal): string | null {
  const r = d.pay_rollup;
  if (!r || r.totalCount < 2) return null;
  return `${r.paidCount} of ${r.totalCount} paid`;
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
  { id: "active", label: "Active", match: (d) => d.active && d.status !== "pipeline" && d.status !== "archived" && (d.pay_rollup?.status ?? "not_invoiced") !== "paid" },
  { id: "paid", label: "Paid", match: (d) => (d.pay_rollup?.status ?? "not_invoiced") === "paid" },
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
      else if (col === "paid") { patch.status = "active"; patch.active = true; }
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
                <span className="flex items-center gap-1.5"><DealStatusBadge status={d.status} active={d.active} />{paymentPill(d)}</span>
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
        onCancel={onClose}
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
function DealDrawer({ deal, onClose, onUpdated, onCelebrate, onArchive, onDeleteRequest, onDuplicate }: { deal: Deal; onClose: () => void; onUpdated: () => void; onCelebrate?: () => void; onArchive: (archived: boolean) => void; onDeleteRequest: () => void; onDuplicate: (deal: Deal) => void }) {
  const supabase = createClient();
  const isArchived = deal.status === "archived";
  const [tab, setTab] = useState<"details" | "checklist" | "notes" | "files" | "payments">("details");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [files, setFiles] = useState<DealFile[]>([]);
  const [plan, setPlan] = useState<"free" | "paid">("free");
  const [menu, setMenu] = useState(false);

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
      setPaymentsBase(pmNorm(pay.data ?? []));
      setChecklistBase(clNorm(cl.data ?? []));
    })();
  }, [supabase, deal.id]);

  // Normalizers shared by dirty detection, load-baseline, and post-save baseline.
  const clNorm = (xs: ChecklistItem[]) => JSON.stringify(xs.map((x) => `${x.id}|${x.done}|${x.title}`));
  const pmNorm = (xs: Payment[]) => JSON.stringify(xs.map((x) => `${x.id}|${x.pay_status ?? ""}|${x.status}|${x.amount}|${x.expected_date ?? ""}`));

  const paid = (dealPayRollup(payments as unknown as { pay_status: string | null; expected_date: string | null }[])).status === "paid";

  // ---------- Explicit-save editing model ----------
  // All editable detail fields + notes stage into `draft` locally. Nothing
  // writes to the DB until save(). `saved` is the last-committed snapshot used
  // for dirty detection and per-field undo. No blur handlers, no debounces,
  // no timers, no onKeyDown writes — typing is never interrupted.
  const toDraft = (d: Deal) => ({
    value: d.value?.toString() ?? "",
    status: d.status === "archived" ? "archived" : d.status === "pipeline" ? "pipeline" : "active",
    deliverable: d.deliverable ?? "",
    deal_type: d.deal_type ?? "",
    due_date: d.due_date ?? "",
    pay_terms: d.pay_terms ?? "",
    exclusivity_days: d.exclusivity_days?.toString() ?? "",
    rep_name: d.rep_name ?? "",
    rep_email: d.rep_email ?? "",
    notes: d.notes ?? "",
  }) as Draft;
  const [draft, setDraft] = useState<Draft>(() => toDraft(deal));
  const [saved, setSaved] = useState<Draft>(() => toDraft(deal));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [confirmClose, setConfirmClose] = useState(false);
  // Baselines for staged (checklist/payments) dirty detection — snapshot at load.
  const [checklistBase, setChecklistBase] = useState<string>("");
  const [paymentsBase, setPaymentsBase] = useState<string>("");

  // Re-init staging when a different deal is opened (component isn't keyed).
  const draftDealRef = useRef(deal.id);
  useEffect(() => {
    if (draftDealRef.current !== deal.id) {
      draftDealRef.current = deal.id;
      const next = toDraft(deal);
      setDraft(next); setSaved(next); setSaveError(null); setConfirmClose(false);
    }
  }, [deal]);

  const isDirty = (k: DraftField) => draft[k] !== saved[k];
  const dirtyList = FIELD_KEYS.filter(isDirty);
  const collDirty = clNorm(checklist) !== checklistBase || pmNorm(payments) !== paymentsBase;
  const hasChanges = dirtyList.length > 0 || collDirty;

  // Uncontrolled-input refs. The drawer's editable text/number inputs write
  // their value ONLY into these DOM refs while the user types (no value=, no
  // onChange, no onKeyDown). React never re-renders or re-touches them on a
  // keystroke, so typing can't stall. Values are read once on Save.
  const fieldRefs = useRef<Partial<Record<DraftField, HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>>>({});
  const bindRef = (k: DraftField) => (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null) => { (fieldRefs.current as Record<string, unknown>)[k] = el; };

  // on blur: only stage the value locally (for dirty-marking + undo). Nothing
  // writes — Save is the single commit. Typing stays 100% untouched.
  const onFieldBlur = (k: DraftField) => {
    const el = (fieldRefs.current as Record<string, unknown>)[k] as { value?: string } | null;
    setField(k, el?.value ?? saved[k]);
  };

  const setField = (k: DraftField, v: string) => setDraft((next) => ({ ...next, [k]: v }));

  const undo = (k: DraftField) => {
    const el = (fieldRefs.current as Record<string, unknown>)[k] as ({ value: string } | null) | undefined;
    if (el) el.value = saved[k]; // rewrite the live DOM node
    setField(k, saved[k]);       // clear dirty; Save commits the revert
  };

  const save = async () => {
    if (saving || !hasChanges) return;
    setSaving(true); setSaveError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaveError("Not signed in."); setSaving(false); return; }
    const patch: Record<string, unknown> = {};
    for (const k of dirtyList) {
      // Read the live DOM value (authoritative) — falls back to draft which
      // blur already synced. Never invoked mid-keystroke.
      const el = (fieldRefs.current as Record<string, unknown>)[k] as { value?: string } | null;
      const val = el?.value ?? draft[k];
      if (k === "value" || k === "exclusivity_days") patch[k] = val ? Number(val) : null;
      else if (k === "due_date") patch.due_date = val || null;
      else patch[k] = val;
    }
    if (dirtyList.includes("status")) {
      const st = ((fieldRefs.current as Record<string, unknown>)["status"] as { value?: string } | null)?.value ?? draft.status;
      patch.active = st !== "archived";
    }
    if (Object.keys(patch).length) {
      const { error } = await supabase.from("deals").update(patch).eq("id", deal.id);
      if (error) { setSaveError(error.message || "Could not save changes."); setSaving(false); return; }
    }
    setSaving(false);
    // --- Commit staged checklist changes (diff against nothing: staged list IS authoritative) ---
    // New items carry an id starting with "new-"; persist those; delete removals; update done flips.
    try {
      const { id } = deal;
      const clResp = await supabase.from("deal_checklist").select("id").eq("deal_id", id);
      const existingCl = (clResp.data ?? []) as { id: string }[];
      const existingIds = new Set(existingCl.map((c) => c.id));
      const stagedIds = new Set(checklist.map((c) => c.id).filter((i) => !i.startsWith("new-")));
      // delete items removed from the staged list
      for (const cid of existingIds) if (!stagedIds.has(cid)) await supabase.from("deal_checklist").delete().eq("id", cid);
      for (const c of checklist) {
        if (c.id.startsWith("new-")) {
          await supabase.from("deal_checklist").insert({ user_id: user.id, deal_id: deal.id, title: c.title, done: c.done });
        } else if (existingIds.has(c.id)) {
          const orig = (await supabase.from("deal_checklist").select("done, title").eq("id", c.id).single()).data as { done?: boolean; title?: string } | null;
          if (orig && (orig.done !== c.done || orig.title !== c.title)) await supabase.from("deal_checklist").update({ done: c.done, title: c.title }).eq("id", c.id);
        }
      }
      // --- Commit staged payment changes ---
      const pmResp = await supabase.from("payments").select("id").eq("deal_id", deal.id);
      const existingPm = (pmResp.data ?? []) as { id: string }[];
      const existingPmIds = new Set(existingPm.map((p) => p.id));
      for (const p of payments) {
        if (p.id.startsWith("new-")) {
          await supabase.from("payments").insert({ user_id: user.id, deal_id: deal.id, amount: p.amount, expected_date: p.expected_date, status: p.status, notes: p.notes ?? null, invoice_state: p.invoice_state ?? null, pay_status: p.pay_status });
        } else if (existingPmIds.has(p.id)) {
          const orig = (await supabase.from("payments").select("pay_status, status, amount, expected_date").eq("id", p.id).single()).data as { pay_status?: string | null; status?: string | null; amount?: number | null; expected_date?: string | null } | null;
          if (orig && (orig.pay_status !== p.pay_status || orig.status !== p.status || (orig.expected_date ?? null) !== (p.expected_date ?? null))) {
            await supabase.from("payments").update({ pay_status: p.pay_status, status: p.status, amount: p.amount, expected_date: p.expected_date }).eq("id", p.id);
          }
        }
      }
    } catch (e) {
      setSaveError("Could not save checklist or payments.");
      return;
    }
    // Refetch the freshly-saved children so the drawer shows real DB rows/ids
    // (new-* staged ids are replaced) and baselines match persisted state.
    try {
      const [clF, pmF] = await Promise.all([
        supabase.from("deal_checklist").select("*").eq("deal_id", deal.id),
        supabase.from("payments").select("*").eq("deal_id", deal.id),
      ]);
      setChecklist((clF.data ?? []) as unknown as ChecklistItem[]);
      setChecklistBase(clNorm(clF.data ?? []));
      setPayments((pmF.data ?? []) as unknown as Payment[]);
      setPaymentsBase(pmNorm(pmF.data ?? []));
    } catch { /* non-fatal: next open refetches */ }
    setSaved({ ...draft });
    onUpdated();
  };

  // Keyboard: Cmd/Ctrl+S saves; Escape (not in a field) closes with a warn if dirty.
  const saveRef = useRef(save); saveRef.current = save;
  const hasChangesRef = useRef(hasChanges); hasChangesRef.current = hasChanges;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void saveRef.current();
      } else if (e.key === "Escape") {
        // A focused input/select/textarea handles Escape itself (revert field);
        // only act when focus is not in an editable control.
        const t = e.target as HTMLElement | null;
        const editable = t && (t.tagName === "INPUT" || t.tagName === "SELECT" || t.tagName === "TEXTAREA");
        if (editable) return;
        e.preventDefault();
        if (hasChangesRef.current) setConfirmClose(true); else onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const requestClose = () => { if (hasChanges) setConfirmClose(true); else onClose(); };

  // Drag/swipe down to close — routes through requestClose so unsaved edits warn.
  const touchStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientY; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const dy = e.changedTouches[0].clientY - touchStart.current;
    touchStart.current = null;
    if (dy > 80) requestClose();
  };

  // ⋯ menu: close on outside click (mouse + touch, but not clicks inside the menu)
  // and Escape.
  const drawerMenuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent | TouchEvent) => {
      if (drawerMenuRef.current && drawerMenuRef.current.contains(e.target as Node)) return;
      setMenu(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("touchstart", close); };
  }, [menu]);

  const markAllPaid = () => {
    if (paid) return;
    // Stage: mark every payment received and the deal active; commits on Save.
    setPayments(payments.map((p) => ({ ...p, status: "received", pay_status: "paid" })));
    setDraft((n) => ({ ...n, status: "active" }));
  };

  const doneCount = checklist.filter((c) => c.done).length;
  const TABS: { id: typeof tab; label: string; n?: string }[] = [
    { id: "details", label: "Details" },
    { id: "checklist", label: "Checklist", n: checklist.length ? `${doneCount}/${checklist.length}` : undefined },
    { id: "notes", label: "Notes" },
    { id: "files", label: "Files", n: files.length ? String(files.length) : undefined },
    { id: "payments", label: "Payments", n: payments.length ? String(payments.length) : undefined },
  ];

  return (
    <div className="fixed inset-0 z-[85] bg-black/20" onClick={requestClose} role="presentation">
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-line shadow-pop drawer-in flex flex-col" onClick={(e) => e.stopPropagation()} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} role="dialog" aria-modal="true">
        {/* Header: logo, brand, amount + due, ⋯ menu, close */}
        <header className="px-5 py-4 border-b border-line">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-[15px] bg-card2 text-inksoft border border-line flex-none">{deal.brand.charAt(0).toUpperCase()}</span>
            <div className="flex-1 min-w-0">
              <h2 className="text-[17px] font-semibold tracking-tight truncate">{deal.brand}</h2>
              <div className="text-[12.5px] text-inksoft mt-0.5">
                <span className="money font-medium text-ink">{formatMoney(deal.value)}</span>
                {deal.due_date ? <span className="text-inksoft"> · Due {formatDate(deal.due_date)}</span> : null}
              </div>
            </div>
            <div className="relative flex-none" ref={drawerMenuRef} data-drawer-menu>
              <button onClick={(e) => { e.stopPropagation(); setMenu((m) => !m); }} aria-label="More actions" aria-expanded={menu} className="p-1.5 rounded-lg text-inksoft hover:text-ink hover:bg-card2 cursor-pointer"><IconMore size={17} /></button>
              {menu && (
                <div className="absolute right-0 top-8 z-40 w-48 bg-card border border-line2 rounded-xl shadow-pop py-1 fade-up">
                  <button onClick={() => { setMenu(false); onDuplicate(deal); }} className="w-full text-left px-3.5 py-2 text-sm hover:bg-card2 cursor-pointer">Duplicate deal</button>
                  <button onClick={() => { setMenu(false); onArchive(!isArchived); }} className="w-full text-left px-3.5 py-2 text-sm hover:bg-card2 cursor-pointer">{isArchived ? "Unarchive" : "Archive"}</button>
                  <div className="my-1 h-px bg-line" />
                  <button onClick={() => { setMenu(false); onDeleteRequest(); }} className="w-full text-left px-3.5 py-2 text-sm text-late hover:bg-card2 cursor-pointer">Delete deal</button>
                </div>
              )}
            </div>
            <button onClick={requestClose} aria-label="Close drawer" className="flex-none p-1.5 rounded-lg text-inksoft hover:text-ink hover:bg-card2 cursor-pointer"><IconClose size={18} /></button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-line px-2 flex-none">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn("px-3 py-2.5 text-[12.5px] font-medium transition-colors cursor-pointer border-b-2 -mb-px whitespace-nowrap", tab === t.id ? "text-accentink border-[var(--accent)] font-semibold" : "text-inksoft hover:text-ink border-transparent")}>
              {t.label}
              {t.n != null && <span className="text-[10.5px] text-inksoft ml-1">{t.n}</span>}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {tab === "details" && <DetailsTab key={deal.id} draft={draft} bindRef={bindRef} onFieldBlur={onFieldBlur} undo={undo} isDirty={isDirty} />}
          {tab === "checklist" && <ChecklistTab items={checklist} setItems={setChecklist} />}
          {tab === "notes" && <NotesTab key={deal.id} draft={draft} bindRef={bindRef} onFieldBlur={onFieldBlur} undo={undo} isDirty={isDirty} />}
          {tab === "files" && <FilesTab dealId={deal.id} files={files} setFiles={setFiles} plan={plan} />}
          {tab === "payments" && <DrawerPaymentsTab payments={payments} setPayments={setPayments} />}
        </div>

        {saveError && (
          <div className="px-5 py-2 border-t border-line bg-[var(--late-bg)] text-bad text-[12.5px] flex items-center gap-2" role="alert">
            <span className="flex-none w-1.5 h-1.5 rounded-full bg-[var(--late)]" /> {saveError}
          </div>
        )}

        {/* Footer: Save changes (primary) + Mark as paid (secondary). Both always
            present, fixed height, expected position. Save is disabled + dimmed
            when clean or in flight; a write never fires twice. */}
        <div className="border-t border-line px-4 py-3 bg-card2/40 flex-none flex items-center gap-3">
          <Button variant="secondary" size="lg" onClick={paid ? undefined : markAllPaid} disabled={paid} className="flex-1 min-w-[120px]">
            {<IconCheck size={16} />} {paid ? "Paid" : "Mark as paid"}
          </Button>
          <Button size="lg" onClick={save} disabled={!hasChanges || saving} className={cn("flex-1 min-w-[120px]", !hasChanges && "opacity-50")}>
            {saving ? <Spinner /> : <IconCheck size={16} />} {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>

      {/* Discard-unsaved-changes confirm: shown on X, overlay click, swipe, or Esc when dirty. */}
      {confirmClose && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/40" onClick={() => setConfirmClose(false)} role="presentation">
          <div className="w-full max-w-sm bg-card border border-line2 rounded-2xl shadow-pop p-5" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h3 className="text-[15px] font-semibold text-ink">Discard unsaved changes?</h3>
            <p className="text-[13px] text-inksoft mt-1.5">You have unsaved changes. Closing now will lose them.</p>
            <div className="flex items-center justify-end gap-2 mt-4">
              <Button variant="ghost" size="md" onClick={() => setConfirmClose(false)}>Keep editing</Button>
              <Button variant="danger" size="md" onClick={() => { setConfirmClose(false); onClose(); }}>Discard</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Details tab (explicit save, uncontrolled inputs) ----------------
   Every field renders defaultValue and binds a ref. NO onChange, NO onKeyDown,
   NO value= — React never re-renders or re-touches an input while the user
   types, so a keystroke can never stall. onBlur (leaving a field, one action)
   syncs the value for dirty-marking/undo. The drawer's Save reads the refs
   directly. Nothing writes to the DB except Save. */
function DetailsTab({ draft, bindRef, onFieldBlur, undo, isDirty }: { draft: Draft; bindRef: (k: DraftField) => (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null) => void; onFieldBlur: (k: DraftField) => void; undo: (k: DraftField) => void; isDirty: (k: DraftField) => boolean }) {
  const Section = ({ label, children }: { label: string; children?: React.ReactNode }) => (
    <div className="mt-5 first:mt-0">
      <div className="text-[10.5px] font-semibold uppercase tracking-wide text-inkfaint mb-1">{label}</div>
      {children}
    </div>
  );
  // Row shows an accent border + undo arrow when the field is dirty.
  const Row = ({ label, field, children }: { label: string; field: DraftField; children: React.ReactNode }) => {
    const dirty = isDirty(field);
    return (
      <div className={cn("flex items-center gap-2 py-1.5 border-b border-line last:border-b-0", dirty && "bg-[var(--accent-tint)]")}>
        <span className="w-[92px] flex-none text-[12px] text-inksoft">{label}</span>
        <div className="flex-1 min-w-0">{children}</div>
        {/* Reserved, fixed-width trailing slot so the row never reflows when the
            undo button appears. The button toggles opacity, not mount. */}
        <span className="w-7 flex-none flex items-center justify-center">
          <button
            onClick={() => undo(field)}
            aria-label={`Revert ${label}`}
            title="Revert change"
            tabIndex={dirty ? 0 : -1}
            aria-hidden={!dirty}
            className={cn(
              "p-1 rounded-md text-inksoft hover:text-ink hover:bg-card2 cursor-pointer transition-opacity",
              dirty ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          ><IconArrowLeft size={16} /></button>
        </span>
      </div>
    );
  };
  const inputCls = "w-full bg-transparent border border-transparent rounded-lg px-2 py-1.5 text-[13.5px] text-ink hover:bg-card2 focus:bg-card focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-tint)] outline-none transition";
  const selectCls = `${inputCls} cursor-pointer`;

  return (
    <div>
      <Row label="Value" field="value"><input ref={bindRef("value")} defaultValue={draft.value} onBlur={() => onFieldBlur("value")} className={`${inputCls} money`} inputMode="decimal" placeholder="$0" /></Row>
      <Row label="Deal status" field="status">
        <select ref={bindRef("status")} defaultValue={draft.status} onBlur={() => onFieldBlur("status")} className={selectCls}>
          <option value="active">Active</option>
          <option value="pipeline">Negotiating</option>
          <option value="archived">Archived</option>
        </select>
      </Row>
      <Row label="Deliverable" field="deliverable"><input ref={bindRef("deliverable")} defaultValue={draft.deliverable} onBlur={() => onFieldBlur("deliverable")} className={inputCls} placeholder="e.g. 1 YouTube integration" /></Row>
      <Row label="Deal type" field="deal_type">
        <select ref={bindRef("deal_type")} defaultValue={draft.deal_type} onBlur={() => onFieldBlur("deal_type")} className={selectCls}>
          <option value="">No set type</option>
          <option value="paid_partnership">Paid Partnership</option>
          <option value="ugc">UGC</option>
          <option value="gifted">Gifted / PR</option>
          <option value="affiliate">Affiliate</option>
          <option value="ambassador">Ambassador</option>
          <option value="event">Event</option>
        </select>
      </Row>

      <Section label="Terms">
        <Row label="Pay by" field="due_date"><input type="date" ref={bindRef("due_date")} defaultValue={draft.due_date} onBlur={() => onFieldBlur("due_date")} className={inputCls} /></Row>
        <Row label="Pay terms" field="pay_terms">
          <select ref={bindRef("pay_terms")} defaultValue={draft.pay_terms} onBlur={() => onFieldBlur("pay_terms")} className={selectCls}>
            <option value="">No set terms</option>
            <option value="due_on_receipt">Due on receipt</option>
            <option value="net_15">Net 15</option>
            <option value="net_30">Net 30</option>
            <option value="net_45">Net 45</option>
            <option value="net_60">Net 60</option>
            <option value="net_90">Net 90</option>
            <option value="milestone">Milestone-based</option>
          </select>
        </Row>
        <Row label="Exclusivity" field="exclusivity_days"><input ref={bindRef("exclusivity_days")} defaultValue={draft.exclusivity_days} onBlur={() => onFieldBlur("exclusivity_days")} className={inputCls} inputMode="numeric" placeholder="Days" /></Row>
      </Section>

      <Section label="Rep contact">
        <Row label="Name" field="rep_name"><input ref={bindRef("rep_name")} defaultValue={draft.rep_name} onBlur={() => onFieldBlur("rep_name")} className={inputCls} placeholder="Contact name" /></Row>
        <Row label="Email" field="rep_email"><input ref={bindRef("rep_email")} defaultValue={draft.rep_email} onBlur={() => onFieldBlur("rep_email")} className={inputCls} placeholder="rep@brand.com" /></Row>
      </Section>
    </div>
  );
}

/* ---------------- Row overflow menu (portal) ----------------
   Renders the ⋯ trigger in its own grid column. The dropdown itself is portal'd
   to document.body so it escapes the table's overflow:hidden container, and is
   positioned from the trigger's rect with collision handling: opens below, flips
   up when there isn't room below. Dismisses on outside click / touch and Escape. */
function RowMenuButton({ open, onToggle, current, onArchive, onDelete }: {
  open: boolean; onToggle: () => void; current: Deal;
  onArchive: (archived: boolean) => void; onDelete: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number; up: boolean } | null>(null);

  // Position the portal'd menu when opened, based on the trigger's rect.
  useEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const W = 176, MENU_H = 132; // trigger height approx; flip if < space below
    const spaceBelow = window.innerHeight - r.bottom - 8;
    const up = spaceBelow < MENU_H && r.top > MENU_H + 8;
    // Right-align to the trigger's right edge; clamp to viewport.
    const x = Math.max(8, Math.min(r.right - W, window.innerWidth - W - 8));
    const y = up ? r.top - MENU_H - 4 : r.bottom + 4;
    setPos({ x, y, up });
  }, [open]);

  // Outside click / touch + Escape dismiss.
  const menuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      onToggle();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onToggle(); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("touchstart", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open, onToggle]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        aria-label="Deal actions"
        aria-expanded={open}
        aria-haspopup="menu"
        className="p-1.5 rounded-lg text-inksoft hover:text-ink hover:bg-card2 cursor-pointer"
      >
        <IconMore size={16} />
      </button>
      {open && pos && createPortal(
        <div
          ref={menuRef}
          role="menu"
          className="fixed z-[95] w-44 bg-card border border-line2 rounded-xl shadow-pop py-1 fade-up text-sm"
          style={{ left: pos.x, top: pos.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => { onToggle(); onArchive(current.status !== "archived"); }} className="w-full text-left px-3.5 py-2 hover:bg-card2 cursor-pointer">
            {current.status === "archived" ? "Unarchive" : "Archive"}
          </button>
          <div className="my-1 h-px bg-line" />
          <button onClick={() => { onToggle(); onDelete(); }} className="w-full text-left px-3.5 py-2 text-late hover:bg-card2 cursor-pointer">Delete deal</button>
        </div>,
        document.body
      )}
    </>
  );
}

/* ---------------- Confirm Delete ----------------
   Two clicks total: open ⋯ menu → Delete, then this confirm is the second and
   final click. Names exactly what's removed. Wires to the cascade route. */
function ConfirmDeleteDeal({ deal, onCancel, onConfirm }: { deal: Deal; onCancel: () => void; onConfirm: () => void }) {
  const [busy, setBusy] = useState(false);
  const doDelete = async () => {
    if (busy) return;
    setBusy(true);
    await onConfirm();
  };
  return (
    <div className="fixed inset-0 z-[90] bg-black/30 grid place-items-center p-4" onClick={() => { if (!busy) onCancel(); }}>
      <div className="bg-card w-full max-w-sm rounded-2xl border border-line2 shadow-pop p-6" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
        <div className="flex items-start gap-3">
          <span className="h-10 w-10 rounded-xl grid place-items-center bg-late/15 text-late shrink-0"><IconDelete size={18} /></span>
          <div>
            <h3 className="text-[15px] font-semibold leading-tight">Delete {deal.brand}?</h3>
            <p className="text-[13px] text-inksoft mt-1 leading-relaxed">
              This removes the deal, its payments, files, checklist, notes, and contract. This can&apos;t be undone.
            </p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
          <Button onClick={doDelete} className="bg-late hover:brightness-95" disabled={busy}>{busy ? <Spinner /> : "Delete deal"}</Button>
        </div>
      </div>
    </div>
  );
}function ChecklistTab({ items, setItems }: { items: ChecklistItem[]; setItems: (i: ChecklistItem[]) => void }) {
  const [title, setTitle] = useState("");
  const nextId = () => `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const add = () => {
    if (!title.trim()) return;
    setItems([{ id: nextId(), deal_id: items[0]?.deal_id ?? "", title: title.trim(), done: false }, ...items]);
    setTitle("");
  };
  const toggle = (id: string, done: boolean) => setItems(items.map((i) => (i.id === id ? { ...i, done } : i)));
  const remove = (id: string) => setItems(items.filter((i) => i.id !== id));
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="Add a checklist item…" />
        <Button onClick={add}><IconPlus size={16} /></Button>
      </div>
      <ul className="space-y-1">
        {items.map((i) => (
          <li key={i.id} className="flex items-center gap-2 py-1.5 group">
            <button onClick={() => toggle(i.id, !i.done)} aria-label="Toggle" className={cn("h-5 w-5 rounded-md border grid place-items-center shrink-0 cursor-pointer", i.done ? "bg-accent border-[var(--accent)]" : "border-line2 hover:border-[var(--accent)]")}>
              {i.done && <IconCheck size={12} className="text-onaccent" />}
            </button>
            <span className={cn("text-sm flex-1", i.done && "line-through text-inksoft")}>{i.title}</span>
            <button onClick={() => remove(i.id)} aria-label="Delete" className="text-inksoft hover:text-late cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"><IconDelete size={14} /></button>
          </li>
        ))}
      </ul>
      {items.length === 0 && <p className="text-sm text-inksoft py-2">No checklist items yet.</p>}
    </div>
  );
}

function NotesTab({ draft, bindRef, onFieldBlur, undo, isDirty }: { draft: Draft; bindRef: (k: DraftField) => (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null) => void; onFieldBlur: (k: DraftField) => void; undo: (k: DraftField) => void; isDirty: (k: DraftField) => boolean }) {
  const dirty = isDirty("notes");
  return (
    <div className="space-y-3">
      <textarea
        ref={bindRef("notes")}
        defaultValue={draft.notes}
        onBlur={() => onFieldBlur("notes")}
        placeholder="Anything worth remembering about this deal…"
        className={cn("w-full bg-card border border-line2 rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-inkfaint focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition resize-y min-h-[220px] font-sans", dirty && "border-[var(--accent)]")}
      />
      {dirty && (
        <button onClick={() => undo("notes")} aria-label="Revert notes" title="Revert change" className="flex items-center gap-1.5 text-[12px] text-inksoft hover:text-ink cursor-pointer">
          <IconArrowLeft size={13} /> Revert notes
        </button>
      )}
    </div>
  );
}

function FilesTab({ dealId, files, setFiles, plan }: { dealId: string; files: DealFile[]; setFiles: (f: DealFile[]) => void; plan: "free" | "paid" }) {
  const supabase = createClient();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const onFile = async (file: File) => {
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
  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    await onFile(file);
  };
  return (
    <div className="space-y-3">
      <label
        className="cursor-pointer block"
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
      >
        <span className={cn(
          "flex items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 text-sm text-inksoft hover:border-[var(--accent)] hover:text-ink transition",
          plan !== "paid" ? "border-line2" : dragOver ? "border-[var(--accent)] bg-accenttint text-accentink" : "border-line2"
        )}>
          <IconPaperclip size={16} /> {plan === "paid" ? (dragOver ? "Drop to upload" : "Drop a file or click to browse") : "Files are on the paid plan"}
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

function DrawerPaymentsTab({ payments, setPayments }: { payments: Payment[]; setPayments: (p: Payment[]) => void }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const nextId = () => `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const add = () => {
    if (!amount) return;
    setError("");
    if (isNaN(Number(amount))) { setError("Enter a valid amount."); return; }
    setPayments([{ id: nextId(), deal_id: null, amount: Number(amount), expected_date: date || null, status: "expected", notes: null, invoice_state: null, pay_status: "not_invoiced" }, ...payments]);
    setAmount(""); setDate("");
  };
  const markReceived = (id: string) => {
    setError("");
    setPayments(payments.map((p) => (p.id === id ? { ...p, status: "received", pay_status: "paid" } : p)));
  };
  const setPayStatus = (p: Payment, val: string) => {
    setError("");
    setPayments(payments.map((x) => (x.id === p.id ? { ...x, pay_status: val, status: val === "paid" ? "received" : x.status } : x)));
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      {error && <p className="text-sm text-bad" role="alert">{error}</p>}
      <Button onClick={add} className="w-full">{IconPlus && <IconPlus size={16} />} Add payment</Button>
      <ul className="space-y-2">
        {payments.map((p) => (
          <li key={p.id} className="py-2 border-b border-line last:border-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold money tabular-nums">{formatMoney(p.amount)}</div>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className={cn("text-xs", p.status === "received" ? "text-paid" : isPastDue(p.expected_date) ? "text-late" : "text-inksoft")}>
                    {p.status === "received" ? "Received" : isPastDue(p.expected_date) ? "Past due" : formatDate(p.expected_date)}
                  </span>
                  <span onClick={(e) => e.stopPropagation()}>
                    <select
                      value={p.pay_status ?? "not_invoiced"}
                      onChange={(e) => setPayStatus(p, e.target.value)}
                      className="text-[10.5px] font-semibold rounded-full px-2 py-0.5 border border-line2 bg-card text-inksoft cursor-pointer outline-none"
                    >
                      <option value="not_invoiced">Not invoiced</option>
                      <option value="invoiced">Invoiced</option>
                      <option value="paid">Paid</option>
                      <option value="no_invoice_needed">No invoice needed</option>
                    </select>
                  </span>
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
