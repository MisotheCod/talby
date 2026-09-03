"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatMoney, formatDate, cn, isPastDue } from "@/lib/utils";
import { FREE_ACTIVE_DEAL_CAP } from "@/lib/constants";
import { IconPlus, IconClose, IconCheck, IconLink, IconDelete, IconMore, IconPaperclip, IconInfo, IconDown, IconUpload, IconGrid, IconList, IconMail } from "@/components/icons";
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
  deal_type?: string | null; nudge_mode?: string | null;
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

const FILTERS = ["Negotiating", "Active", "Paid", "Archived", "All"] as const;

export default function DealsPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();
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
  // Chooser modal opened via /app/deals?choose=1 (the Overview Add-deal button).
  const [chooserOpen, setChooserOpen] = useState(false);
  // Only one row menu is open at a time; dismissal (outside click, Escape) is
  // handled inside the portal RowMenuButton component.

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

  // Open drawer or new-deal modal via URL params (?open=id, ?new=1, ?choose=1)
  useEffect(() => {
    if (searchParams.get("new") === "1") setNewMode("blank");
    if (searchParams.get("choose") === "1") setChooserOpen(true);
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
      payment_status: deal.payment_status, due_date: deal.due_date,
      pay_terms: deal.pay_terms, exclusivity_days: deal.exclusivity_days,
      rep_name: deal.rep_name, rep_email: deal.rep_email, deal_type: deal.deal_type,
      nudge_mode: deal.nudge_mode, notes: deal.notes,
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
                  <span className="d-status"><DealStatusBadge status={d.status} payment_status={d.payment_status} active={d.active} due={d.due_date} /></span>
                  <span className="d-payment">{paymentPill(d)}</span>
                  <span className={cn("d-post text-[12.5px] tabular-nums", d.post_date && isPastDue(d.post_date) && d.status !== "archived" ? "text-late font-medium" : "text-inksoft")}>
                    {d.post_date ? formatDate(d.post_date) : <NotSet />}
                  </span>
                  <span className={cn("d-payby text-[12.5px] tabular-nums", d.pay_by && isPastDue(d.pay_by) && d.payment_status !== "paid" && d.status !== "paid" ? "text-late font-medium" : "text-inksoft")}>
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

      {chooserOpen && (
        <AddDealChooser
          onClose={() => setChooserOpen(false)}
          onNew={() => { setChooserOpen(false); setNewMode("blank"); }}
          onUpload={() => { setChooserOpen(false); setNewMode("upload"); }}
          onNotion={() => { setChooserOpen(false); router.push("/app/import?source=notion"); }}
        />
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
    </div>
  );
}

/* ---------------- Add-deal chooser modal ----------------
   The two-step flow from the Overview "Add deal" button: pick how to add a
   deal (manual / upload a contract / import from Notion), then land in the
   matching flow. Three cards in order, each with a short description. */
function AddDealChooser({ onClose, onNew, onUpload, onNotion }: {
  onClose: () => void; onNew: () => void; onUpload: () => void; onNotion: () => void;
}) {
  const cards = [
    { label: "New deal", desc: "Enter the details by hand — brand, value, dates, and terms.", onPick: onNew, Icon: IconPlus },
    { label: "Upload", desc: "One contract or CSV, filled in automatically by AI. Review, then add.", onPick: onUpload, Icon: IconUpload },
    { label: "Import from Notion", desc: "Pull your whole deal database — connect, map, and review.", onPick: onNotion, Icon: null },
  ] as const;
  return (
    <div className="fixed inset-0 z-[90] bg-black/30 grid place-items-center p-4" onClick={onClose}>
      <div className="bg-card w-full max-w-md rounded-2xl border border-line2 shadow-pop p-6" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[16px] font-semibold">Add a deal</h3>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg text-inksoft hover:text-ink hover:bg-card2 cursor-pointer"><IconClose size={18} /></button>
        </div>
        <p className="text-[13px] text-inksoft mb-4">Choose how you&apos;d like to bring it in.</p>
        <div className="space-y-2.5">
          {cards.map((c) => (
            <button
              key={c.label}
              onClick={c.onPick}
              className="w-full flex items-start gap-3 card p-4 text-left cursor-pointer hover:border-[var(--accent)] transition-colors"
            >
              <span className="h-9 w-9 rounded-xl accent-tint-bg accent-ink grid place-items-center shrink-0">
                {c.Icon ? <c.Icon size={18} /> : <NotionLogo size={18} />}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold">{c.label}</span>
                <span className="block text-[13px] text-inksoft mt-0.5 leading-snug">{c.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
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
    })();
  }, [supabase, deal.id]);

  const paid = deal.payment_status === "paid" || deal.status === "paid" || (payments.length > 0 && payments.every((p) => p.status === "received"));

  // Keyboard dismiss: Escape closes the drawer (menu handled by its own effect).
  const touchStart = useRef<number | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setMenu(false); onClose(); } };
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

  const [marking, setMarking] = useState(false);
  const markAllPaid = async () => {
    if (marking || paid) return;
    setMarking(true);
    await supabase.from("payments").update({ status: "received", invoice_state: "invoiced" }).eq("deal_id", deal.id);
    await supabase.from("deals").update({ payment_status: "paid", status: "active", active: true }).eq("id", deal.id);
    setMarking(false);
    setPayments(payments.map((p) => ({ ...p, status: "received", invoice_state: "invoiced" })));
    onUpdated();
    onCelebrate?.();
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
    <div className="fixed inset-0 z-[85] bg-black/20" onClick={onClose} role="presentation">
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
            <button onClick={onClose} aria-label="Close drawer" className="flex-none p-1.5 rounded-lg text-inksoft hover:text-ink hover:bg-card2 cursor-pointer"><IconClose size={18} /></button>
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
          {tab === "details" && <DetailsTab deal={deal} onSaved={onUpdated} />}
          {tab === "checklist" && <ChecklistTab dealId={deal.id} items={checklist} setItems={setChecklist} onChanged={onUpdated} />}
          {tab === "notes" && <NotesTab dealId={deal.id} deal={deal} onSaved={onUpdated} />}
          {tab === "files" && <FilesTab dealId={deal.id} files={files} setFiles={setFiles} plan={plan} />}
          {tab === "payments" && <DrawerPaymentsTab dealId={deal.id} payments={payments} setPayments={setPayments} onChanged={onUpdated} onCelebrate={onCelebrate} />}
        </div>

        {/* Footer: single pinned primary action */}
        <div className="border-t border-line px-5 py-3 bg-card2/40 flex-none">
          <Button onClick={paid ? undefined : markAllPaid} disabled={marking || paid} size="lg" className={cn("w-full", paid && "bg-paid")}>
            {marking ? <Spinner /> : <IconCheck size={16} />} {marking ? "Marking…" : paid ? "Paid" : "Mark as paid"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Details tab (autosave) ----------------
   Flat label-and-input rows under three section labels. Every field is a real
   editable input/select wired to a deals column. Changes autosave ~500ms after
   the user stops typing, with a "Saved" indicator. No explicit Save button. */
function DetailsTab({ deal, onSaved }: { deal: Deal; onSaved: () => void }) {
  const supabase = createClient();
  const [form, setForm] = useState({
    value: deal.value?.toString() ?? "",
    status: deal.status === "archived" ? "archived" : deal.status === "pipeline" ? "pipeline" : "active",
    deliverable: deal.deliverable ?? "",
    deal_type: deal.deal_type ?? "",
    payment_status: deal.status === "paid" ? "paid" : deal.payment_status ?? "expected",
    due_date: deal.due_date ?? "",
    pay_terms: deal.pay_terms ?? "",
    exclusivity_days: deal.exclusivity_days?.toString() ?? "",
    rep_name: deal.rep_name ?? "",
    rep_email: deal.rep_email ?? "",
    nudge_mode: deal.nudge_mode ?? "draft",
  });
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const set = <K extends keyof typeof form>(k: K, val: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: val }));

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const handle = <K extends keyof typeof form>(k: K, val: (typeof form)[K]) => {
    set(k, val);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const patch: Record<string, unknown> = {};
      if (k === "value") patch.value = val ? Number(val) : null;
      else if (k === "status") patch.status = val;
      else if (k === "deal_type") patch.deal_type = val;
      else if (k === "payment_status") patch.payment_status = val;
      else if (k === "due_date") patch.due_date = (val as string) || null;
      else if (k === "pay_terms") patch.pay_terms = val;
      else if (k === "exclusivity_days") patch.exclusivity_days = val ? Number(val) : null;
      else if (k === "rep_name") patch.rep_name = val;
      else if (k === "rep_email") patch.rep_email = val;
      else if (k === "nudge_mode") patch.nudge_mode = val;
      else patch[k] = val;
      // Archiving via status must also flip `active` (cap accounting).
      if (k === "status") patch.active = (val as string) !== "archived";
      const { error } = await supabase.from("deals").update(patch).eq("id", deal.id);
      if (!error) { setSaved(true); onSaved(); setTimeout(() => setSaved(false), 1600); }
    }, 500);
  };

  const Section = ({ label, children }: { label: string; children?: React.ReactNode }) => (
    <div className="mt-5 first:mt-0">
      <div className="text-[10.5px] font-semibold uppercase tracking-wide text-inkfaint mb-1">{label}</div>
      {children}
    </div>
  );
  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex items-center gap-3 py-1.5 border-b border-line last:border-b-0">
      <span className="w-[92px] flex-none text-[12px] text-inksoft">{label}</span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
  const inputCls = "w-full bg-transparent border border-transparent rounded-lg px-2 py-1.5 text-[13.5px] text-ink hover:bg-card2 focus:bg-card focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-tint)] outline-none transition";
  const selectCls = `${inputCls} cursor-pointer`;

  return (
    <div>
      <Row label="Value"><input className={`${inputCls} money`} value={form.value} onChange={(e) => handle("value", e.target.value)} inputMode="decimal" placeholder="$0" /></Row>
      <Row label="Deal status">
        <select className={selectCls} value={form.status} onChange={(e) => handle("status", e.target.value)}>
          <option value="active">Active</option>
          <option value="pipeline">Negotiating</option>
          <option value="archived">Archived</option>
        </select>
      </Row>
      <Row label="Deliverable"><input className={inputCls} value={form.deliverable} onChange={(e) => handle("deliverable", e.target.value)} placeholder="e.g. 1 YouTube integration" /></Row>
      <Row label="Deal type">
        <select className={selectCls} value={form.deal_type} onChange={(e) => handle("deal_type", e.target.value)}>
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
        <Row label="Payment">
          <select className={selectCls} value={form.payment_status} onChange={(e) => handle("payment_status", e.target.value)}>
            <option value="expected">Expected</option>
            <option value="paid">Received</option>
            <option value="none">No payment tracked</option>
          </select>
        </Row>
        <Row label="Pay by"><input type="date" className={inputCls} value={form.due_date} onChange={(e) => handle("due_date", e.target.value)} /></Row>
        <Row label="Pay terms">
          <select className={selectCls} value={form.pay_terms} onChange={(e) => handle("pay_terms", e.target.value)}>
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
        <Row label="Exclusivity"><input className={inputCls} value={form.exclusivity_days} onChange={(e) => handle("exclusivity_days", e.target.value)} inputMode="numeric" placeholder="Days" /></Row>
      </Section>

      <Section label="Rep contact">
        <Row label="Name"><input className={inputCls} value={form.rep_name} onChange={(e) => handle("rep_name", e.target.value)} placeholder="Contact name" /></Row>
        <Row label="Email"><input className={inputCls} type="email" value={form.rep_email} onChange={(e) => handle("rep_email", e.target.value)} placeholder="rep@brand.com" /></Row>
        <Row label="Nudge mode">
          <select className={selectCls} value={form.nudge_mode} onChange={(e) => handle("nudge_mode", e.target.value)}>
            <option value="draft">Draft for review</option>
            <option value="notify">Notify me only</option>
            <option value="auto">Send automatically</option>
            <option value="off">Off</option>
          </select>
        </Row>
      </Section>

      <div className={cn("flex items-center gap-1.5 text-[11.5px] text-inksoft mt-4 transition-opacity", saved ? "opacity-100" : "opacity-0")}>
        <IconCheck size={13} className="text-paid" /> Saved
      </div>
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
}function ChecklistTab({ dealId, items, setItems, onChanged }: { dealId: string; items: ChecklistItem[]; setItems: (i: ChecklistItem[]) => void; onChanged?: () => void }) {
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const add = async () => {
    if (!title.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("deal_checklist").insert({ user_id: user.id, deal_id: dealId, title: title.trim() }).select().single();
    if (data) { setItems([data as unknown as ChecklistItem, ...items]); setTitle(""); onChanged?.(); }
  };
  const toggle = async (id: string, done: boolean) => {
    setItems(items.map((i) => (i.id === id ? { ...i, done } : i)));
    await supabase.from("deal_checklist").update({ done }).eq("id", id);
    onChanged?.();
  };
  const remove = async (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    await supabase.from("deal_checklist").delete().eq("id", id);
    onChanged?.();
  };
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

function NotesTab({ dealId, deal, onSaved }: { dealId: string; deal: Deal; onSaved: () => void }) {
  const supabase = createClient();
  const [notes, setNotes] = useState(deal.notes ?? "");
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const onText = (val: string) => {
    setNotes(val);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const { error } = await supabase.from("deals").update({ notes: val }).eq("id", dealId);
      if (!error) { setSaved(true); onSaved(); setTimeout(() => setSaved(false), 1600); }
    }, 500);
  };
  return (
    <div className="space-y-3">
      <Textarea value={notes} onChange={(e) => onText(e.target.value)} placeholder="Anything worth remembering about this deal…" className="min-h-[220px]" />
      <div className={cn("flex items-center gap-1.5 text-[11.5px] text-inksoft transition-opacity", saved ? "opacity-100" : "opacity-0")}>
        <IconCheck size={13} className="text-paid" /> Saved
      </div>
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

function DrawerPaymentsTab({ dealId, payments, setPayments, onChanged, onCelebrate }: { dealId: string; payments: Payment[]; setPayments: (p: Payment[]) => void; onChanged: () => void; onCelebrate?: () => void }) {
  const supabase = createClient();
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [adding, setAdding] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const add = async () => {
    if (!amount || adding) return;
    setAdding(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); setAdding(false); return; }
    const { data, error: err } = await supabase.from("payments").insert({ user_id: user.id, deal_id: dealId, amount: Number(amount), expected_date: date || null, invoice_state: "not_invoiced" }).select().single();
    setAdding(false);
    if (err) { setError(err.message); return; }
    if (data) { setPayments([data as unknown as Payment, ...payments]); setAmount(""); setDate(""); onChanged(); }
  };
  const markReceived = async (id: string) => {
    if (markingId) return;
    setMarkingId(id); setError("");
    const { error: err } = await supabase.from("payments").update({ status: "received", invoice_state: "invoiced" }).eq("id", id);
    setMarkingId(null);
    if (err) { setError(err.message); return; }
    setPayments(payments.map((p) => (p.id === id ? { ...p, status: "received", invoice_state: "invoiced" } : p)));
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
      {error && <p className="text-sm text-bad" role="alert">{error}</p>}
      <Button onClick={add} disabled={adding} className="w-full">{adding ? <Spinner /> : <IconPlus size={16} />} {adding ? "Adding…" : "Add payment"}</Button>
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
                <Button size="sm" variant="secondary" onClick={() => markReceived(p.id)} disabled={markingId === p.id}>{markingId === p.id ? <Spinner /> : <IconCheck size={14} />} {markingId === p.id ? "Marking…" : "Mark as paid"}</Button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {payments.length === 0 && <p className="text-sm text-inksoft py-2">No payments on this deal yet.</p>}
    </div>
  );
}
