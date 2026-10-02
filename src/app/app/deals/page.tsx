"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { startUnlimited } from "@/lib/start-unlimited";
import { formatMoney, formatDate, cn } from "@/lib/utils";
import { dealPayRollup, payStatusLabel, paymentCell, paymentStatusView, paymentMismatch, dealPaymentView, type DealExtra, type PayStatus, type DealRollup, type PaymentRow } from "@/lib/pay-status";
import { type EditorPayment } from "@/components/payment-editor";
import { DealPaymentSection, Sel } from "@/components/deal-payment-section";
import { dealPostDates, postDateCell, newPostDateRow, type PostDate, type ContentPost } from "@/lib/post-dates";
import { DealInput, DealTextarea } from "@/components/deal-input";
import { FREE_ACTIVE_DEAL_CAP } from "@/lib/constants";
import { IconPlus, IconClose, IconCheck, IconLink, IconDelete, IconMore, IconPaperclip, IconInfo, IconDown, IconUpload, IconGrid, IconList, IconMail, IconUndo } from "@/components/icons";
import { Button, Input, Select, StatusPill, Spinner, Segmented } from "@/components/ui";
import { UpgradeModal } from "@/components/upgrade-modal";
import { NotionLogo } from "@/components/marketing/notion-logo";
import { DealForm, emptyDealForm, type DealFormValues } from "@/components/deal-form";
import { SaveToastHost, notifySaved } from "@/components/save-toast";
import UploadModal from "@/components/upload-modal";
import { useCelebration } from "@/components/confetti";

type Deal = {
  id: string; brand: string; status: string; deliverable: string | null;
  value: number | null; post_date: string | null; notes: string | null;
  links: { url: string; label?: string }[]; active: boolean;
  rep_name: string | null; rep_email: string | null;
  pay_terms: string | null; exclusivity_days: number | null;
  revisions_included: string | null; revisions_used: number | null;
  deal_type?: string | null;
  created_at?: string;
  // Joined lookups for the six-column list:
  pay_by?: string | null;      // earliest payment expected_date (received or not)
  pay_received?: boolean;      // any payment on the deal marked received
  all_invoiced?: boolean;      // every dated payment on the deal is invoiced
  pay_rollup?: DealRollup;     // derived pay status + "N of M paid" progress
  post_dates?: PostDate[];     // derived from linked content rows (single source)
  next_post_date?: string | null; // earliest upcoming post date (latest when all past)
  post_cell?: ReturnType<typeof postDateCell>;
  pay_cell?: ReturnType<typeof paymentCell>;
  // Release 1: structure + extras
  payment_structure?: "once" | "split" | "parts" | "monthly" | null;
  structure_timing?: string | null;
  structure_timing_set_date?: string | null;
  structure_upfront_pct?: number | null;
  structure_balance_timing?: string | null;
  structure_months?: number | null;
  structure_start_date?: string | null;
  extras?: DealExtra[];
};
type Payment = { id: string; deal_id: string | null; amount: number; expected_date: string | null; status: string; notes: string | null; invoice_state: string | null; pay_status?: string | null; bonus_confirmed?: boolean };
type ChecklistItem = { id: string; deal_id: string; title: string; done: boolean };
type DealFile = { id: string; deal_id: string; name: string; path: string; size_bytes: number | null; mime: string | null; kind?: "contract" | "invoice" | "other" | null };
type DraftField = "value" | "status" | "deliverable" | "deal_type" | "pay_terms" | "exclusivity_days" | "revisions_included" | "rep_name" | "rep_email" | "notes";
type Draft = Record<DraftField, string>;
const FIELD_KEYS: DraftField[] = ["value", "status", "deliverable", "deal_type", "pay_terms", "exclusivity_days", "revisions_included", "rep_name", "rep_email", "notes"];
/** Structure fields live on `deals` (not Draft) — they are staged + saved as a
 *  group so structure changes regenerate unpaid payments on Save. */
type StructureStage = {
  payment_structure: "once" | "split" | "parts" | "monthly" | null;
  structure_timing: string | null;
  structure_timing_set_date: string | null;
  structure_upfront_pct: number | null;
  structure_balance_timing: string | null;
  structure_months: number | null;
  structure_start_date: string | null;
};

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
  const [view] = useState<"list">("list");
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
    const [d, pays, content, ex] = await Promise.all([
      supabase.from("deals").select("*").order("created_at", { ascending: false }),
      user ? supabase.from("payments").select("id, expected_date, status, deal_id, invoice_state, pay_status, amount, notes").eq("user_id", user.id).order("expected_date", { ascending: true }) : { data: [] },
      supabase.from("content").select("id, event_date, title, post_type, status, linked_deal_id").not("linked_deal_id", "is", null),
      user ? supabase.from("deal_extras").select("id, deal_id, kind, amount, condition, rate, on_text, earned") : { data: [] },
    ]);
    const deals = (d.data ?? []) as unknown as Deal[];
    const extrasRows = (ex.data ?? []) as unknown as { id: string; deal_id: string; kind: "bonus" | "commission"; amount: number | null; condition: string | null; rate: number | null; on_text: string | null; earned: boolean }[];
    const extrasByDeal = new Map<string, DealExtra[]>();
    for (const e of extrasRows) {
      const arr = extrasByDeal.get(e.deal_id) ?? [];
      arr.push({ id: e.id, kind: e.kind, amount: e.amount, condition: e.condition, rate: e.rate, on_text: e.on_text, earned: e.earned });
      extrasByDeal.set(e.deal_id, arr);
    }
    // Post dates live in content rows (event_date + title=label + post_type=kind).
    // Group them by linked deal so each deal's dates + next date are derived.
    const postsByDeal = new Map<string, ContentPost[]>();
    for (const c of (content.data ?? []) as unknown as ContentPost[]) {
      if (!c.linked_deal_id || !c.event_date) continue;
      const arr = postsByDeal.get(c.linked_deal_id) ?? [];
      arr.push(c);
      postsByDeal.set(c.linked_deal_id, arr);
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
    const payRowsByDeal = new Map<string, PaymentRow[]>();
    for (const p of (pays.data ?? []) as { expected_date: string | null; status: string; deal_id: string | null; invoice_state: string | null; pay_status?: string | null; amount?: number | null; notes?: string | null }[]) {
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
      const rows = payRowsByDeal.get(p.deal_id) ?? [];
      rows.push({ id: (p as { id?: string }).id ?? "", amount: p.amount ?? null, status: p.status ?? null, invoice_state: p.invoice_state ?? null, pay_status: p.pay_status ?? null, expected_date: p.expected_date, notes: p.notes ?? null });
      payRowsByDeal.set(p.deal_id, rows);
    }
    setDeals(deals.map((deal) => ({
      ...deal,
      extras: extrasByDeal.get(deal.id) ?? [],
      // post_date is a stored, editable column now — it is NOT derived from
      // content anymore. The Deals table, the drawer, and the calendar must all
      // read deals.post_date (the same field) so editing one surface is seen
      // everywhere.
      pay_by: payByDeal.get(deal.id) ?? deal.pay_by ?? null,
      pay_received: receivedDeal.has(deal.id),
      all_invoiced: anyDatedDeal.has(deal.id) && invoicedOkDeal.has(deal.id),
      pay_rollup: dealPayRollup(dealPays.get(deal.id) ?? []),
      // Payments mirror posts: pay_cell = next-unpaid status/date + paid progress
      // for the column + popover (see paymentCell). Single-source from payments.
      pay_cell: paymentCell(payRowsByDeal.get(deal.id)),
      // Post dates are derived from linked content rows (single source of
      // truth). deals.post_date is a read-only legacy column (write-guarded)
      // that phase two drops. post_dates = full sorted list; post_cell = the
      // next-unposted date + posted progress for the column (see postDateCell).
      post_dates: dealPostDates(postsByDeal.get(deal.id)),
      post_cell: postDateCell(postsByDeal.get(deal.id)),
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
      pay_terms: deal.pay_terms, exclusivity_days: deal.exclusivity_days,
      revisions_included: deal.revisions_included, revisions_used: deal.revisions_used,
      rep_name: deal.rep_name, rep_email: deal.rep_email, deal_type: deal.deal_type,
      notes: deal.notes,
      active: deal.active,
      // post_date is read-only now (content rows own it); copy its post-dates
      // as fresh linked content rows on the copy.
    }).select("id").single();
    if (data) {
      setSelectedId(null); celeb.fire(); loadDeals();
      // Copy linked content rows (any dated post) to the new deal.
      try {
        const src = await supabase.from("content").select("id, event_date, title, post_type").eq("linked_deal_id", deal.id).not("event_date", "is", null);
        for (const c of (src.data ?? []) as unknown as { event_date: string; title: string | null; post_type: string | null }[]) {
          await supabase.from("content").insert({ user_id: user.id, linked_deal_id: data.id, event_date: c.event_date, title: c.title, post_type: c.post_type, status: "planned" });
        }
      } catch { /* non-fatal: the deal copy is fine, dates can be re-added */ }
    }
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
                  className={cn("w-full grid gap-3 items-start px-[22px] py-[14px] border-t border-line text-left hover:bg-card2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] deal-row", selectedId === d.id && "bg-card2")}
                >
                  <span className="d-brand flex items-center gap-3 min-w-0">
                    <span className="h-10 w-10 rounded-xl flex-none flex items-center justify-center font-bold text-[15px] bg-card2 text-inksoft border border-line">
                      {d.brand.charAt(0).toUpperCase()}
                    </span>
                    <span className="d-brand-name text-[15px] font-semibold truncate">{d.brand}</span>
                  </span>
                  <span className="d-status flex h-10 items-center"><DealStatusBadge status={d.status} active={d.active} /></span>
                  <span className="d-payment flex h-10 items-center gap-1">
                    {paymentPill(d)}
                  </span>
                  <PostDateCell deal={d} onChanged={onUpdated} />
                  <PayByCell deal={d} onChanged={onUpdated} />
                  <span className="d-amount relative flex flex-col items-end">
                  <span className="inline-flex h-10 items-center"><span className="money text-sm font-medium leading-snug tabular-nums">{formatMoney(d.value)}</span></span>
                  {(d.payment_structure === "monthly" || (d.extras?.length ?? 0) > 0) && (
                    <span className="absolute right-0 top-[30px] text-[10px] tabular-nums leading-none whitespace-nowrap text-inksoft/70">
                      {d.payment_structure === "monthly" && d.structure_months && d.value != null
                        ? `${formatMoney(d.value / d.structure_months)} a month`
                        : (d.extras ?? []).map((e) => e.kind === "bonus" ? `+ ${formatMoney(e.amount ?? 0)} bonus` : `+ ${e.rate ?? 0}% commission`).join(", ")}
                    </span>
                  )}
                </span>
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
/** Single pay-status pill for the deal, derived from the NEXT UNPAID payment
 *  through the canonical paymentStatusView (same label/kind as the Payments
 *  page, including the "Overdue" override). One pill, no separate invoice
 *  field. When every payment is paid the pill shows Paid. */
function paymentPill(d: Deal) {
  const c = d.pay_cell;
  if (c && c.payments.length) {
    const unpaid = c.payments.filter((p) => (p.pay_status ?? "not_invoiced") !== "paid");
    const target = unpaid[0] ?? c.payments[c.payments.length - 1];
    const v = paymentStatusView({ pay_status: target.pay_status ?? null, status: target.status ?? null, expected_date: target.expected_date ?? null, amount: target.amount ?? null });
    const kind = v.pillKind === "late" ? "late" : v.pillKind === "paid" ? "paid" : v.pillKind === "neutral" ? "neutral" : "due";
    return <StatusPill kind={kind}>{v.label}</StatusPill>;
  }
  const r = d.pay_rollup ?? { status: "not_invoiced" as PayStatus, paidCount: 0, totalCount: 0 };
  const label = payStatusLabel(r.status);
  return <StatusPill kind={PAYS_PILL_KIND[r.status]}>{label}</StatusPill>;
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
            <p className="text-inksoft mt-0.5">You have {activeCount} active deals, the free plan holds {FREE_ACTIVE_DEAL_CAP}. <a href="#" onClick={(e) => { e.preventDefault(); onClose(); startUnlimited(); }} className="accent-ink font-semibold underline underline-offset-2 hover:opacity-80">Go unlimited</a> to keep adding.</p>
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
  const [tab, setTab] = useState<"details" | "checklist" | "notes" | "files">("details");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [files, setFiles] = useState<DealFile[]>([]);
  const [postDates, setPostDates] = useState<PostDate[]>([]);   // staged list (content rows)
  const [postDatesSaved, setPostDatesSaved] = useState<PostDate[]>([]);
  const [plan, setPlan] = useState<"free" | "paid">("free");
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const p = await supabase.from("profiles").select("plan").eq("id", user.id).single();
        setPlan(((p.data as unknown as { plan: string } | null)?.plan ?? "free") as "free" | "paid");
      }
      const [pay, cl, fl, content, ex] = await Promise.all([
        supabase.from("payments").select("*").eq("deal_id", deal.id),
        supabase.from("deal_checklist").select("*").eq("deal_id", deal.id),
        supabase.from("deal_files").select("*").eq("deal_id", deal.id),
        supabase.from("content").select("id, event_date, title, post_type").eq("linked_deal_id", deal.id).not("event_date", "is", null),
        supabase.from("deal_extras").select("*").eq("deal_id", deal.id),
      ]);
      setPayments((pay.data ?? []) as unknown as Payment[]);
      setPaymentsSaved((pay.data ?? []) as unknown as Payment[]);
      setExtras((ex.data ?? []) as unknown as DealExtra[]);
      setExtrasSaved((ex.data ?? []) as unknown as DealExtra[]);
      setChecklist((cl.data ?? []) as unknown as ChecklistItem[]);
      setFiles((fl.data ?? []) as unknown as DealFile[]);
      const posts = dealPostDates((content.data ?? []) as unknown as ContentPost[]);
      setPostDates(posts);
      setPostDatesSaved(posts.map((p) => ({ ...p })));
      setPaymentsBase(pmNorm(pay.data ?? []));
      setChecklistBase(clNorm(cl.data ?? []));
    })();
  }, [supabase, deal.id]);

  // Normalizers shared by dirty detection, load-baseline, and post-save baseline.
  const clNorm = (xs: ChecklistItem[]) => JSON.stringify(xs.map((x) => `${x.id}|${x.done}|${x.title}`));
  const pmNorm = (xs: Payment[]) => JSON.stringify(xs.map((x) => `${x.id}|${x.pay_status ?? ""}|${x.status}|${x.amount}|${x.expected_date ?? ""}`));
  const pdNorm = (xs: PostDate[]) => JSON.stringify(xs.map((x) => `${x.id ?? ""}|${x.date}|${x.label}|${x.kind ?? ""}`));

  const paid = (dealPayRollup(payments as unknown as { pay_status: string | null; expected_date: string | null }[])).status === "paid";
  // "Mark as paid" appears only when the deal has exactly one unpaid payment
  // (a single-payment deal that isn't paid yet). Multi-payment deals (split,
  // parts, monthly) and fully-paid deals hide it.
  const unpaidCount = payments.filter((p) => (p.pay_status ?? "not_invoiced") !== "paid").length;
  const showMarkPaid = unpaidCount === 1;

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
    pay_terms: d.pay_terms ?? "",
    exclusivity_days: d.exclusivity_days?.toString() ?? "",
    revisions_included: d.revisions_included ?? "",
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
  // Snapshot of the loaded/saved payments array, so the payment-bound rows
  // (Pay status, Pay by) can offer an undo that reverts the staged change.
  const [paymentsSaved, setPaymentsSaved] = useState<Payment[]>([]);
  // Release 1: staged structure + extras (saved as a group on Save).
  const toStructure = (d: Deal): StructureStage => ({
    payment_structure: d.payment_structure ?? null,
    structure_timing: d.structure_timing ?? null,
    structure_timing_set_date: d.structure_timing_set_date ?? null,
    structure_upfront_pct: d.structure_upfront_pct ?? null,
    structure_balance_timing: d.structure_balance_timing ?? null,
    structure_months: d.structure_months ?? null,
    structure_start_date: d.structure_start_date ?? null,
  });
  const [struct, setStruct] = useState<StructureStage>(() => toStructure(deal));
  const [structSaved, setStructSaved] = useState<StructureStage>(() => toStructure(deal));
  const structDirty = JSON.stringify(struct) !== JSON.stringify(structSaved);
  const [extras, setExtras] = useState<DealExtra[]>(deal.extras ?? []);
  const [extrasSaved, setExtrasSaved] = useState<DealExtra[]>(deal.extras ?? []);

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
  const postDatesDirty = pdNorm(postDates) !== pdNorm(postDatesSaved);
  const collDirty = clNorm(checklist) !== checklistBase || pmNorm(payments) !== paymentsBase || postDatesDirty;
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
      else if (k === "revisions_included") patch[k] = val ? val.trim() : null;
      // NOTE: due_date is no longer written here. Pay by is owned by the
      // payment's expected_date (single source of truth). deals.due_date is
      // left as-is until a later migration drops it.
      // NOTE: post_date is NOT written here. Post dates live in content rows
      // (see the reconcile below); deals.post_date is read-only and guarded.
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
          await supabase.from("payments").insert({ user_id: user.id, deal_id: deal.id, amount: p.amount, expected_date: p.expected_date, status: p.status, notes: p.notes ?? null, invoice_state: p.invoice_state ?? null, pay_status: p.pay_status ?? null, bonus_confirmed: p.bonus_confirmed !== false });
        } else if (existingPmIds.has(p.id)) {
          const orig = (await supabase.from("payments").select("pay_status, status, amount, expected_date, bonus_confirmed").eq("id", p.id).single()).data as { pay_status?: string | null; status?: string | null; amount?: number | null; expected_date?: string | null; bonus_confirmed?: boolean | null } | null;
          if (orig && (orig.pay_status !== p.pay_status || orig.status !== p.status || (orig.expected_date ?? null) !== (p.expected_date ?? null) || (orig.amount ?? null) !== (p.amount ?? null) || ((orig.bonus_confirmed ?? true) !== (p.bonus_confirmed !== false)))) {
            await supabase.from("payments").update({ pay_status: p.pay_status ?? null, status: p.status, amount: p.amount, expected_date: p.expected_date, bonus_confirmed: p.bonus_confirmed !== false }).eq("id", p.id);
          }
        }
      }
      // --- Commit structure (release 1) ---
      if (structDirty) {
        const sp: Record<string, unknown> = {};
        for (const k of Object.keys(struct) as (keyof StructureStage)[]) {
          const v = struct[k];
          if (k === "structure_upfront_pct" || k === "structure_months") sp[k] = v ?? null;
          else sp[k] = v ?? null;
        }
        await supabase.from("deals").update(sp).eq("id", deal.id);
      }
      // --- Commit extras (release 1): additive reconcile ---
      const exResp = await supabase.from("deal_extras").select("id").eq("deal_id", deal.id);
      const existingEx = new Set((exResp.data ?? []).map((e) => e.id));
      const keptEx = extras.filter((e) => existingEx.has(e.id)).map((e) => e.id);
      for (const eid of existingEx) if (!keptEx.includes(eid)) await supabase.from("deal_extras").delete().eq("id", eid);
      for (const e of extras) {
        if (existingEx.has(e.id)) {
          const orig = (await supabase.from("deal_extras").select("amount, condition, rate, on_text, earned").eq("id", e.id).single()).data;
          if (orig && (orig.amount !== e.amount || orig.condition !== e.condition || orig.rate !== e.rate || orig.on_text !== e.on_text || orig.earned !== e.earned)) {
            await supabase.from("deal_extras").update({ amount: e.amount, condition: e.condition, rate: e.rate, on_text: e.on_text, earned: e.earned }).eq("id", e.id);
          }
        } else {
          await supabase.from("deal_extras").insert({ user_id: user.id, deal_id: deal.id, kind: e.kind, amount: e.amount, condition: e.condition, rate: e.rate, on_text: e.on_text, earned: e.earned });
        }
      }
    // --- Commit staged post-date (content row) changes ---
      // Post dates are content rows linked to the deal. New entries (no id or
      // "new-") insert; existing rows update in place (date/label/kind); rows
      // removed from the staged list are deleted. deals.post_date is untouched.
      const contentResp = await supabase.from("content").select("id").eq("linked_deal_id", deal.id);
      const existingContentIds = new Set((contentResp.data ?? []).map((c) => c.id));
      const keptContentRows = postDates.filter((p) => p.id && existingContentIds.has(p.id)).map((p) => p.id);
      for (const cid of existingContentIds) if (!keptContentRows.includes(cid)) await supabase.from("content").delete().eq("id", cid);
      for (const p of postDates) {
        if (!p.date) continue;
        if (p.id && existingContentIds.has(p.id)) {
          await supabase.from("content").update({ event_date: p.date, title: p.label.trim() || null, post_type: (p.kind ?? "").trim() || null }).eq("id", p.id);
        } else {
          await supabase.from("content").insert({ user_id: user.id, linked_deal_id: deal.id, event_date: p.date, title: p.label.trim() || null, post_type: (p.kind ?? "").trim() || null, status: "planned" });
        }
      }
    } catch (e) {
      setSaveError("Could not save checklist, payments, or post dates.");
      return;
    }
    // Refetch the freshly-saved children so the drawer shows real DB rows/ids
    // (new-* staged ids are replaced) and baselines match persisted state.
    try {
      const [clF, pmF, contentF] = await Promise.all([
        supabase.from("deal_checklist").select("*").eq("deal_id", deal.id),
        supabase.from("payments").select("*").eq("deal_id", deal.id),
        supabase.from("content").select("id, event_date, title, post_type").eq("linked_deal_id", deal.id).not("event_date", "is", null),
      ]);
      setChecklist((clF.data ?? []) as unknown as ChecklistItem[]);
      setChecklistBase(clNorm(clF.data ?? []));
      setPayments((pmF.data ?? []) as unknown as Payment[]);
      setPaymentsSaved((pmF.data ?? []) as unknown as Payment[]);
      setPaymentsBase(pmNorm(pmF.data ?? []));
      const posts = dealPostDates((contentF.data ?? []) as unknown as ContentPost[]);
      setPostDates(posts);
      setPostDatesSaved(posts.map((p) => ({ ...p })));
    } catch { /* non-fatal: next open refetches */ }
    setSaved({ ...draft });
    notifySaved();
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

  // "Update deal amount" from the amber guardrail — set Value to the confirmed
  // payment total. Uses the explicit-save model: rewrite the bound Value input's
  // DOM value and stage it (setField), so Save persists it. Never writes here.
  const onEditDealAmount = (total: number) => {
    const el = (fieldRefs.current as Record<string, unknown>)["value"] as { value?: string } | null;
    if (el) el.value = String(total);
    setField("value", String(total));
  };

  const doneCount = checklist.filter((c) => c.done).length;
  const TABS: { id: typeof tab; label: string; n?: string }[] = [
    { id: "details", label: "Details" },
    { id: "checklist", label: "Checklist", n: checklist.length ? `${doneCount}/${checklist.length}` : undefined },
    { id: "notes", label: "Notes" },
    { id: "files", label: "Files", n: files.length ? String(files.length) : undefined },
  ];

  // ---- Invoice extraction -> pay-by + review prompt ----
  // resolved: proposed expected_date (may be null if the invoice had no date)
  // and the pay-terms value the invoice implies. Applied directly when there is
  // no conflicting pay-by; otherwise a non-blocking tinted row under Pay by asks
  // Use invoice date / Keep current.
  const [invoiceReview, setInvoiceReview] = useState<{ proposed: string | null; current: string | null; terms?: string | null } | null>(null);

  const handleInvoiceExtracted = useCallback((f: { invoice_date: string | null; due_date: string | null; net_terms: string | null; amount: number | null; brand: string | null }) => {
    // Compute the invoice's pay-by: explicit due_date wins; else invoice_date +
    // net terms.
    let proposed: string | null = f.due_date ?? null;
    if (!proposed && f.net_terms && f.invoice_date) {
      try {
        const base = new Date(f.invoice_date + "T00:00:00");
        const days = { due_on_receipt: 0, net_15: 15, net_30: 30, net_45: 45, net_60: 60, net_90: 90 }[f.net_terms];
        if (days !== undefined) { base.setDate(base.getDate() + days); proposed = `${base.getFullYear()}-${String(base.getMonth()+1).padStart(2,"0")}-${String(base.getDate()).padStart(2,"0")}`; }
      } catch { proposed = null; }
    }
    // An invoice always flips the deal to invoiced.
    setPayments((ps) => ps.map((p) => ({ ...p, pay_status: "invoiced", status: "expected" })));
    // If no date was found, tell the user rather than guessing.
    if (!proposed) { setInvoiceReview({ proposed: null, current: null }); return; }
    const cur = payments.map((p) => p.expected_date ?? "").filter((x) => x !== "").sort()[0] ?? null;
    // No current pay-by, or it matches the invoice: set silently, no prompt.
    if (!cur || cur === proposed) {
      if (payments.length) {
        setPayments((ps) => ps.map((p) => ({ ...p, expected_date: (p.expected_date ?? "") <= (cur ?? "9999-99-99") ? proposed : p.expected_date })));
      } else {
        setPayments([{ id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, deal_id: deal.id, amount: f.amount ?? deal.value ?? 0, expected_date: proposed, status: "expected", notes: null, invoice_state: null, pay_status: "invoiced" }]);
      }
      setInvoiceReview(null);
    } else {
      // Conflict: show the tinted row; the user decides. Stays until chosen.
      setInvoiceReview({ proposed, current: cur });
    }
  }, [payments, deal.id, deal.value]);

  const acceptInvoiceDate = () => {
    if (!invoiceReview || !invoiceReview.proposed) { setInvoiceReview(null); return; }
    const proposed = invoiceReview.proposed;
    const cur = invoiceReview.current;
    if (payments.length) {
      setPayments((ps) => ps.map((p) => ({ ...p, expected_date: (p.expected_date ?? "") <= (cur ?? "9999-99-99") ? proposed : p.expected_date })));
    } else {
      setPayments([{ id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, deal_id: deal.id, amount: deal.value ?? 0, expected_date: proposed, status: "expected", notes: null, invoice_state: null, pay_status: "invoiced" }]);
    }
    setInvoiceReview(null);
  };
  const keepInvoiceDate = () => setInvoiceReview(null);

  // Shared file upload: storage + deal_files insert + refresh, then invoice
  // extraction (pay-by / invoiced / review prompt) when the kind is invoice.
  // Used by BOTH the Files tab and the Details Payment "Invoice" row, so one
  // file list has two entry points.
  const uploadDealFile = useCallback(async (file: File, kind: DealFile["kind"]): Promise<{ extractionBlocked: boolean }> => {
    if (!file) return { extractionBlocked: false };
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { extractionBlocked: false };
    const path = `${user.id}/${deal.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("deal-files").upload(path, file);
    if (error) return { extractionBlocked: false };
    await supabase.from("deal_files").insert({ user_id: user.id, deal_id: deal.id, name: file.name, path, size_bytes: file.size, mime: file.type, kind: kind ?? "other" });
    const { data } = await supabase.from("deal_files").select("*").eq("deal_id", deal.id);
    setFiles((data ?? []) as DealFile[]);
    if (kind === "invoice") {
      // Same extraction path as the Files tab: set pay-by, flip to invoiced,
      // and show the conflict prompt when the dates differ. On the free plan the
      // server 403s extraction — that's not a failure (the file is stored); it
      // means reading the invoice is on Unlimited. Report it so the caller can
      // say so, not swallow it silently.
      try {
        const fd = new FormData(); fd.append("file", file);
        const res = await fetch("/api/deals/extract-invoice", { method: "POST", body: fd });
        if (res.ok) handleInvoiceExtracted(await res.json());
        else if (res.status === 403) return { extractionBlocked: true };
      } catch { /* non-fatal */ }
    }
    return { extractionBlocked: false };
  }, [supabase, deal.id, setFiles, handleInvoiceExtracted]);

  const removeDealFile = useCallback(async (f: DealFile) => {
    await supabase.storage.from("deal-files").remove([f.path]);
    await supabase.from("deal_files").delete().eq("id", f.id);
    setFiles((xs) => xs.filter((x) => x.id !== f.id));
  }, [supabase, setFiles]);

  const openDealFile = useCallback(async (f: DealFile) => {
    const { data } = await supabase.storage.from("deal-files").createSignedUrl(f.path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  }, [supabase]);

  return createPortal(
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
                {(() => {
                  const d = payments.map((p) => p.expected_date ?? "").filter((x) => x !== "").sort()[0];
                  return d ? <span className="text-inksoft"> · Due {formatDate(d.slice(0, 10))}</span> : null;
                })()}
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

        <div className="flex-1 overflow-y-auto px-5 py-4 bg-card2">
          {tab === "details" && <DetailsTab key={deal.id} deal={deal} payments={payments} setPayments={setPayments} files={files} draft={draft} bindRef={bindRef} onFieldBlur={onFieldBlur} undo={undo} isDirty={isDirty} invoiceReview={invoiceReview} onAcceptInvoiceDate={acceptInvoiceDate} onKeepInvoiceDate={keepInvoiceDate} onUploadFile={uploadDealFile} onOpenFile={openDealFile} onRemoveFile={removeDealFile} paymentsSaved={paymentsSaved} postDates={postDates} setPostDates={setPostDates} postDatesSaved={postDatesSaved} onUpdated={onUpdated} onEditDealAmountStaged={onEditDealAmount} struct={struct} setStruct={setStruct} extras={extras} setExtras={setExtras} />}
          {tab === "checklist" && <ChecklistTab items={checklist} setItems={setChecklist} />}
          {tab === "notes" && <NotesTab key={deal.id} draft={draft} bindRef={bindRef} onFieldBlur={onFieldBlur} undo={undo} isDirty={isDirty} />}
          {tab === "files" && <FilesTab dealId={deal.id} files={files} setFiles={setFiles} onUploadFile={uploadDealFile} />}
        </div>

        {saveError && (
          <div className="px-5 py-2 border-t border-line bg-[var(--late-bg)] text-bad text-[12.5px] flex items-center gap-2" role="alert">
            <span className="flex-none w-1.5 h-1.5 rounded-full bg-[var(--late)]" /> {saveError}
          </div>
        )}

        {/* Footer: Save changes (primary). "Mark as paid" appears only when the
            deal has exactly one unpaid payment (single-payment, not yet paid);
            hidden on multi-payment deals (split/parts/monthly) and when paid. */}
        <div className="border-t border-line px-4 py-3 bg-card flex-none flex items-center gap-3">
          {showMarkPaid && (
            <Button variant="secondary" size="lg" onClick={markAllPaid} disabled={paid} className="flex-1 min-w-[120px]">
              <IconCheck size={16} /> Mark as paid
            </Button>
          )}
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
    </div>,
    document.body
  );
}

/* ---------------- Details tab (explicit save, uncontrolled inputs) ----------------
   Every field renders defaultValue and binds a ref. NO onChange, NO onKeyDown,
   NO value= — React never re-renders or re-touches an input while the user
   types, so a keystroke can never stall. onBlur (leaving a field, one action)
   syncs the value for dirty-marking/undo. The drawer's Save reads the refs
   directly. Nothing writes to the DB except Save. */
function DetailsTab({ deal, payments, setPayments, files, draft, bindRef, onFieldBlur, undo, isDirty, invoiceReview, onAcceptInvoiceDate, onKeepInvoiceDate, onUploadFile, onOpenFile, onRemoveFile, paymentsSaved, postDates, setPostDates, postDatesSaved, onUpdated, onEditDealAmountStaged, struct, setStruct, extras, setExtras }: {
  deal: Deal; payments: Payment[]; setPayments: (p: Payment[]) => void; files: DealFile[]; paymentsSaved: Payment[];
  draft: Draft; bindRef: (k: DraftField) => (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null) => void; onFieldBlur: (k: DraftField) => void; undo: (k: DraftField) => void; isDirty: (k: DraftField) => boolean;
  postDates: PostDate[]; setPostDates: (p: PostDate[]) => void; postDatesSaved: PostDate[];
  invoiceReview: { proposed: string | null; current: string | null } | null;
  onAcceptInvoiceDate: () => void; onKeepInvoiceDate: () => void;
  onUploadFile: (file: File, kind: DealFile["kind"]) => Promise<{ extractionBlocked: boolean }>;
  onOpenFile: (f: DealFile) => Promise<void>;
  onRemoveFile: (f: DealFile) => Promise<void>;
  onUpdated: () => void;
  onEditDealAmountStaged: (total: number) => void;
  struct: StructureStage; setStruct: (s: StructureStage) => void;
  extras: DealExtra[]; setExtras: (e: DealExtra[]) => void;
}) {
  // Release 1: three-accordion layout. Only one section open at a time;
  // Payment open by default; tapping an open header closes it.
  const [openAcc, setOpenAcc] = useState<"payment" | "deal" | "rep" | null>("payment");
  // ---- Revision counter (Log a revision / undo). Immediate persist, deal-level. ----
  const [revisionBusy, setRevisionBusy] = useState(false);
  const [revisionErr, setRevisionErr] = useState<string | null>(null);
  const revisionsSet = !!deal.revisions_included;
  const revisionLimit = deal.revisions_included === "Unlimited"
    ? null
    : (deal.revisions_included != null && Number.isFinite(Number(deal.revisions_included)) ? Number(deal.revisions_included) : null);
  const revisionUsed = deal.revisions_used ?? 0;
  const overLimit = revisionsSet && revisionLimit !== null && revisionLimit !== undefined && revisionUsed > revisionLimit;
  const logRevision = async (delta: 1 | -1) => {
    setRevisionBusy(true); setRevisionErr(null);
    try {
      const res = await fetch("/api/deals/revision", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId: deal.id, action: delta > 0 ? "log" : "undo" }),
      });
      const data = await res.json();
      if (!res.ok) { setRevisionErr(data?.error || "Could not update revisions."); return; }
      onUpdated(); // reload the deal so revisions_used reflects the change
    } catch { setRevisionErr("Could not update revisions."); }
    finally { setRevisionBusy(false); }
  };
  // Payment-bound rows are independent controls, so each tracks its own dirty
  // state and its own undo. Pay status sketches pay_status/status; Pay by
  // sketches expected_date. Sharing one flag made them light up together and
  // undoing one reverted the other — they are not connected.
  const pmSig = (xs: Payment[]) => JSON.stringify(xs.map((x) => `${x.id}|${x.pay_status ?? ""}|${x.status}`));
  const pbSig = (xs: Payment[]) => JSON.stringify(xs.map((x) => `${x.id}|${x.expected_date ?? ""}`));
  const payStatusDirty = pmSig(payments) !== pmSig(paymentsSaved);
  const payByDirty = pbSig(payments) !== pbSig(paymentsSaved);

  // Undo restores only that row's field from the saved snapshot. A payment
  // added mid-edit (new-* from Pay by) is removed, not reverted in place.
  const undoPayStatus = () => setPayments(
    payments
      .filter((p) => !p.id.startsWith("new-") || paymentsSaved.some((s) => s.id === p.id))
      .map((p) => {
        const s = paymentsSaved.find((x) => x.id === p.id);
        return s ? { ...p, pay_status: s.pay_status, status: s.status } : p;
      })
  );
  const undoPayBy = () => setPayments(
    payments
      .filter((p) => !p.id.startsWith("new-") || paymentsSaved.some((s) => s.id === p.id))
      .map((p) => {
        const s = paymentsSaved.find((x) => x.id === p.id);
        return s ? { ...p, expected_date: s.expected_date } : p;
      })
  );
  // True after a free user uploads an invoice but the paid extraction 403'd.
  // Not an error — the file attached fine; it just says reading it is on
  // Unlimited.
  const [invoiceExtractionBlocked, setInvoiceExtractionBlocked] = useState(false);
  // Release 1: accordion section. Header shows a short summary on the right
  // when collapsed (spec 3a). Only one open; tapping an open header closes it.
  const Acc = ({ id, title, summary, children }: { id: "payment" | "deal" | "rep"; title: string; summary: string; children: React.ReactNode }) => {
    const open = openAcc === id;
    return (
      <div className="rounded-xl border border-line2 bg-card overflow-hidden">
        <button type="button" onClick={() => setOpenAcc(open ? null : id)} aria-expanded={open} className="w-full flex min-h-[56px] h-14 items-center justify-between gap-2 px-5 bg-card2 text-left cursor-pointer">
          <span className="text-[13.5px] font-semibold text-ink">{title}</span>
          <span className="flex items-center gap-1.5 min-w-0">
            {!open && summary && <span className="truncate text-[11.5px] text-inksoft">{summary}</span>}
            <span className={cn("text-inksoft transition-transform shrink-0", open && "rotate-180")}><IconDown size={14} /></span>
          </span>
        </button>
        {open && (
          <>
            <div className="h-px bg-line" />
            <div className="px-5 pt-2 pb-6">{children}</div>
          </>
        )}
      </div>
    );
  };
  // Row shows an accent border + undo arrow when the field is dirty.
  const Row = ({ label, field, children }: { label: string; field: DraftField; children: React.ReactNode }) => {
    const dirty = isDirty(field);
    return (
      <div className={cn("relative flex items-center gap-4 min-h-[56px] py-3 border-b border-line last:border-b-0", dirty && "bg-[var(--accent-tint)]")}>
        <span className="w-[100px] flex-none text-[12.5px] font-medium text-ink truncate whitespace-nowrap">{label}</span>
        <div className="flex-1 min-w-0 w-full">{children}</div>
        {/* Undo overlay, only when dirty, so it never reserves width and inputs
            always stretch to the card's right padding. */}
        {dirty && (
          <button
            onClick={() => undo(field)}
            aria-label={`Revert ${label}`}
            title="Revert change"
            tabIndex={0}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-md text-inksoft hover:text-ink hover:bg-card2 cursor-pointer"
          ><IconUndo size={16} /></button>
        )}
      </div>
    );
  };
  // Same row, but for payment-bound controls (Pay status, Pay by) that are not
  // DraftFields. Their dirty state rides on the staged payments diff (collDirty);
  // when dirty, an optional undo reverts the staged payment change to the
  // snapshot taken at load/save.
  const PRow = ({ label, children, onUndo, dirty }: { label: string; children: React.ReactNode; onUndo?: () => void; dirty?: boolean }) => (
    <div className={cn("relative flex items-center gap-4 min-h-[56px] py-3 border-b border-line last:border-b-0", dirty && "bg-[var(--accent-tint)]")}>
      <span className="w-[100px] flex-none text-[12.5px] font-medium text-ink truncate whitespace-nowrap">{label}</span>
      <div className="flex-1 min-w-0 w-full">{children}</div>
      {dirty && onUndo && (
        <button
          type="button"
          onClick={onUndo}
          aria-label={`Revert ${label}`}
          title="Revert change"
          tabIndex={0}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-md text-inksoft hover:text-ink hover:bg-card2 cursor-pointer"
        ><IconUndo size={16} /></button>
      )}
    </div>
  );
  const inputCls = "w-full bg-card border border-line2 rounded-lg px-2.5 h-9 text-sm text-ink placeholder:text-inkfaint focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition font-sans";

  // Deal-level pay status: single control that sets the deal's payment status.
  // Derived from the LIVE staged payments (not the passed-in deal.pay_rollup
  // snapshot, which never updates and was forcing the select back to the old
  // value on every re-render — the status "never changed"). "paid" flips the
  // payment to received.
  const dealStatus = payments.length
    ? (dealPayRollup(payments as unknown as { pay_status: string | null; expected_date: string | null }[]).status ?? "not_invoiced")
    : (deal.pay_rollup?.status ?? "not_invoiced");
  const setDealStatus = (val: string) => {
    if (payments.length) {
      setPayments(payments.map((p) => ({ ...p, pay_status: val, status: val === "paid" ? "received" : p.status })));
    } else {
      // No payment row yet: create one carrying the status (amount from the deal),
      // mirroring setPayByDate so a status change on a payment-less deal persists.
      setPayments([{ id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, deal_id: deal.id, amount: deal.value ?? 0, expected_date: null, status: val === "paid" ? "received" : "expected", notes: null, invoice_state: null, pay_status: val }]);
    }
  };

  // Pay by became the payment rows' due dates (single source of truth),
  // edited inline in the Payment section via DealPaymentSection.

  // Invoice row: shows the attached invoice (kind=invoice) once uploaded.

      return (
    <div className="space-y-4">
      <Acc id="payment" title="Payment"
        summary={(() => {
          const s = headerSummary(struct, deal.value != null ? Number(deal.value) : (Number(draft.value) || null));
          return s;
        })()}>
        <DealPaymentSection
          value={draft.value}
          onValueCommit={() => onFieldBlur("value")}
          struct={struct}
          setStruct={setStruct}
          payments={payments as unknown as EditorPayment[]}
          setPayments={(next) => setPayments(next as unknown as Payment[])}
          extras={extras}
          setExtras={setExtras}
          dealStatus={deal.status ?? draft.status ?? null}
        />
        {invoiceReview && (
          <div className="rounded-lg border border-[var(--accent)]/30 bg-[var(--accent-tint)] px-2.5 py-2 mt-3 mb-1 text-[12px]">
            {invoiceReview.proposed ? (
              <>
                <span className="text-ink block">The invoice says due {formatDate(invoiceReview.proposed)}. Current pay by is {invoiceReview.current ? formatDate(invoiceReview.current) : "not set"}.</span>
                <div className="flex gap-2 mt-1.5">
                  <button type="button" onClick={onAcceptInvoiceDate} className="px-2.5 h-7 rounded-md text-[12px] font-medium cursor-pointer bg-[var(--accent)] text-onaccent hover:brightness-95">Use invoice date</button>
                  <button type="button" onClick={onKeepInvoiceDate} className="px-2.5 h-7 rounded-md text-[12px] font-medium cursor-pointer border border-line2 bg-card text-inksoft hover:text-ink">Keep current</button>
                </div>
              </>
            ) : (
              <span className="text-inksoft">This invoice didn&apos;t include a due date, so pay by was left unchanged.</span>
            )}
          </div>
        )}
        <div className="mt-4 border-t border-line">
        <PRow label="Invoice">
          <InvoiceRow
            files={files}
            onPick={async (file) => {
              const r = await onUploadFile(file, "invoice");
              setInvoiceExtractionBlocked(r.extractionBlocked);
            }}
            onOpen={onOpenFile}
            onRemove={onRemoveFile}
          />
        </PRow>
        {invoiceExtractionBlocked && (
          <div className="mt-1.5 mb-1.5 rounded-md px-2.5 py-2 text-[12px] leading-snug text-inksoft bg-card2/40">
            Invoice attached. Reading it and filling in the pay by date is on <a href="/#pricing" onClick={(e) => { setInvoiceExtractionBlocked(false); }} className="accent-ink font-semibold underline underline-offset-2 hover:opacity-80">Unlimited</a>.
          </div>
        )}
        </div>
      </Acc>

      <Acc id="deal" title="Deal"
        summary={(() => {
          const st = dragStatusLabel(draft.status ?? deal.status ?? null);
          const pd = postDates.length ? `, posts ${postDates[0].date ? formatDate(postDates[0].date) : "soon"}` : "";
          return `${st}${pd}`;
        })()}>
        <Row label="Deal status" field="status">
          <Sel ref={bindRef("status") as unknown as (el: { value: string }) => void} defaultValue={draft.status} onBlur={() => onFieldBlur("status")}>
            <option value="active">Active</option>
            <option value="pipeline">Negotiating</option>
            <option value="archived">Archived</option>
          </Sel>
        </Row>
        <Row label="Deliverable" field="deliverable"><DealInput inputRef={bindRef("deliverable")} value={draft.deliverable} onCommit={() => onFieldBlur("deliverable")} className={inputCls} placeholder="e.g. 1 YouTube integration" /></Row>
        <Row label="Deal type" field="deal_type">
          <Sel ref={bindRef("deal_type") as unknown as (el: { value: string }) => void} defaultValue={draft.deal_type} onBlur={() => onFieldBlur("deal_type")}>
            <option value="">No set type</option>
            <option value="paid_partnership">Paid Partnership</option>
            <option value="ugc">UGC</option>
            <option value="gifted">Gifted / PR</option>
            <option value="affiliate">Affiliate</option>
            <option value="ambassador">Ambassador</option>
            <option value="event">Event</option>
          </Sel>
        </Row>
        <PRow label="Post dates">
          <div className="space-y-1.5">
            {postDates.map((p) => (
              <div key={p._rowKey ?? p.id ?? "row"} className="flex items-center gap-1.5">
                <DealInput
                  type="date"
                  value={p.date}
                  onCommit={(v) => setPostDates(postDates.map((x) => (x._rowKey ?? x.id) === (p._rowKey ?? p.id) ? { ...x, date: v } : x))}
                  className={`${inputCls} deal-date-input flex-1`}
                  ariaLabel={`Post date`}
                />
                <DealInput
                  value={p.label}
                  onCommit={(v) => setPostDates(postDates.map((x) => (x._rowKey ?? x.id) === (p._rowKey ?? p.id) ? { ...x, label: v } : x))}
                  className={cn(inputCls, "flex-1")}
                  placeholder="Label (e.g. Story 2)"
                  ariaLabel="Post date label"
                />
                <button type="button" onClick={() => setPostDates(postDates.filter((x) => (x._rowKey ?? x.id) !== (p._rowKey ?? p.id)))} aria-label="Remove post date" title="Remove" className="shrink-0 text-inksoft hover:text-late cursor-pointer p-1"><IconDelete size={14} /></button>
              </div>
            ))}
            <button type="button" onClick={() => setPostDates([...postDates, newPostDateRow()])} className="inline-flex items-center gap-1 text-[11.5px] text-accent font-medium hover:underline cursor-pointer"><IconPlus size={13} /> Add another date</button>
          </div>
        </PRow>
        <Row label="Exclusivity" field="exclusivity_days"><DealInput inputRef={bindRef("exclusivity_days")} value={draft.exclusivity_days} onCommit={() => onFieldBlur("exclusivity_days")} className={inputCls} inputMode="numeric" placeholder="Days" /></Row>
        <Row label="Revisions" field="revisions_included"><DealInput inputRef={bindRef("revisions_included")} value={draft.revisions_included} onCommit={() => onFieldBlur("revisions_included")} className={inputCls} placeholder="Not set" inputMode="numeric" /></Row>
        {revisionsSet && (
          <PRow label="Revisions">
            <div className="w-full space-y-1.5">
              <div className={cn("flex items-center justify-between rounded-md border px-2.5 py-1.5 text-[12.5px]", overLimit ? "border-[var(--late)]/40 bg-[var(--late)]/5 text-[var(--late)]" : "border-line2 bg-card2 text-ink")}>
                <span className="font-medium">
                  {revisionLimit === null || revisionLimit === undefined
                    ? `Revisions used: ${revisionUsed}`
                    : `Revisions: ${revisionUsed} of ${revisionLimit} used`}
                </span>
                <span className="flex items-center gap-1.5 shrink-0">
                  <button type="button" onClick={() => logRevision(1)} disabled={revisionBusy || !revisionsSet} className="px-2.5 h-7 rounded text-[11.5px] font-medium cursor-pointer bg-[var(--accent)] text-onaccent hover:brightness-95 disabled:opacity-50 whitespace-nowrap">Log a revision</button>
                  <button type="button" onClick={() => logRevision(-1)} disabled={revisionBusy || revisionUsed === 0} className="px-2.5 h-7 rounded text-[11.5px] font-medium cursor-pointer border border-line2 bg-card text-inksoft hover:text-ink disabled:opacity-50 whitespace-nowrap" title="Undo last revision">Undo</button>
                </span>
              </div>
              {overLimit && (
                <p className="text-[11.5px] text-[var(--late)]">Extra rounds are not in the contract.</p>
              )}
              {revisionErr && <p className="text-[11px] text-[var(--late)]">{revisionErr}</p>}
            </div>
          </PRow>
        )}
      </Acc>

      <Acc id="rep" title="Rep contact"
        summary={(() => {
          const n = draft.rep_name?.trim() || deal.rep_name?.trim();
          return n || "Not added";
        })()}>
        <Row label="Name" field="rep_name"><DealInput inputRef={bindRef("rep_name")} value={draft.rep_name} onCommit={() => onFieldBlur("rep_name")} className={inputCls} placeholder="Contact name" /></Row>
        <Row label="Email" field="rep_email"><DealInput inputRef={bindRef("rep_email")} value={draft.rep_email} onCommit={() => onFieldBlur("rep_email")} className={inputCls} placeholder="rep@brand.com" /></Row>
      </Acc>
    </div>
  );
}

/** Deals-table status label for a Deal accordion summary. */
function dragStatusLabel(s: string | null): string {
  if (s === "pipeline") return "Negotiating";
  if (s === "archived") return "Archived";
  return "Active";
}

/** Payment accordion collapsed summary, e.g. "$10,500, all at once". */
function headerSummary(struct: StructureStage, amount: number | null): string {
  const kind = struct.payment_structure;
  if (!kind) return amount != null ? fmtMoneyComma(amount) : "Not set";
  const base = amount != null ? fmtMoneyComma(amount) : "";
  let suffix = "";
  if (kind === "split") suffix = "upfront + balance";
  else if (kind === "parts") suffix = "in parts";
  else if (kind === "monthly") suffix = `${struct.structure_months ?? ""} months`;
  else if (kind === "once") suffix = "all at once";
  return [base, suffix].filter(Boolean).join(", ") || "Not set";
}
function fmtMoneyComma(n: number): string {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

/** Invoice action row: upload from the Payment section. No file -> "Add
 *  invoice" button. Attached -> filename (opens on click), plus replace and
 *  remove. Uploading here always sets kind to invoice (the row already says
 *  what it is) and funnels into the same extraction path as the Files tab. */
function InvoiceRow({ files, onPick, onOpen, onRemove }: {
  files: DealFile[];
  onPick: (file: File) => void;
  onOpen: (f: DealFile) => Promise<void>;
  onRemove: (f: DealFile) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inv = files.filter((f) => f.kind === "invoice")[0];
  const pick = () => inputRef.current?.click();
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.txt,.md,application/pdf,text/*"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onPick(f); e.target.value = ""; }}
      />
      {inv ? (
        <div className="flex items-center gap-1.5 min-w-0">
          <button type="button" onClick={() => onOpen(inv)} title="Open or download"
            className="flex-1 min-w-0 truncate text-left text-[13px] text-ink flex items-center gap-1.5 hover:text-[var(--accent)] cursor-pointer">
            <IconPaperclip size={14} className="text-inksoft shrink-0" /> <span className="truncate">{inv.name}</span>
          </button>
          <button type="button" onClick={pick} title="Replace invoice" aria-label="Replace invoice"
            className="shrink-0 text-[11px] text-inksoft hover:text-ink cursor-pointer px-1">Replace</button>
          <button type="button" onClick={() => onRemove(inv)} title="Remove invoice" aria-label="Remove invoice"
            className="shrink-0 text-inksoft hover:text-late cursor-pointer"><IconDelete size={14} /></button>
        </div>
      ) : (
        <button type="button" onClick={pick}
          className="text-[13px] text-inksoft hover:text-ink cursor-pointer inline-flex items-center gap-1.5">
          <IconUpload size={14} /> Add invoice
        </button>
      )}
    </>
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

/* ---------------- Post date cell (column + hover card) ----------------
   Shows the next-unposted date (red when past), plus a dotted-underline count
   line ("0 of 2 posted") ONLY when a deal has more than one post. The count
   line is the sole hover/tap trigger for a READ ONLY card listing each post.
   Single-post deals show just the date (no card). All changes happen in the
   deal drawer. */
function PostDateCell({ deal, onChanged }: { deal: Deal; onChanged: () => void }) {
  const cell = deal.post_cell;
  const trgRef = useRef<HTMLSpanElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const stay = useRef(false);

  // Count line is the ONLY trigger, and only when there is more than one post.
  const showCount = !!cell?.line2 && (cell?.totalCount ?? 0) > 1;

  // Position the portal'd popover below-left of the hovered COUNT text, 8px gap,
  // anchored to its left edge; flip above only when there's no room below.
  useEffect(() => {
    if (!open || !trgRef.current) return;
    const r = trgRef.current.getBoundingClientRect();
    const W = 240;
    const rows = Math.max(1, (cell?.dates.length ?? 1));
    const H = 34 + rows * 34 + 16;
    const spaceBelow = window.innerHeight - r.bottom - 8;
    const up = spaceBelow < H && r.top > H + 8;
    const left = Math.max(8, Math.min(r.left, window.innerWidth - W - 8));
    const top = up ? r.top - H - 8 : r.bottom + 8;
    setPos({ x: left, y: top });
  }, [open, cell?.dates.length]);

  // Close on outside click / touch or Escape.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (trgRef.current?.contains(t) || popRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Hover card is READ ONLY (spec 6b). Posted state is edited in the deal
  // drawer's Post dates, not from this popover.

  const notSet = <span className="text-inksoft">—</span>;
  const top = cell && cell.next ? cell.next : null;

  return (
    <div className="d-post relative select-none">
      <span className={cn("inline-flex h-10 items-center leading-none text-[12.5px] tabular-nums whitespace-nowrap", top && cell?.overdue ? "text-late font-medium" : "text-inksoft")}>
        {top ? formatDate(top) : notSet}
      </span>
      {showCount && (
        <span
          ref={trgRef}
          role="button"
          aria-haspopup="dialog"
          tabIndex={0}
          onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); setOpen(!open); } }}
          onMouseEnter={() => { stay.current = true; setOpen(true); }}
          onMouseLeave={() => { stay.current = false; setTimeout(() => { if (!stay.current) setOpen(false); }, 180); }}
          className={cn("absolute left-0 top-[30px] text-[10px] tabular-nums leading-none whitespace-nowrap underline decoration-dotted underline-offset-2 cursor-pointer", cell!.line2!.kind === "all" ? "text-ok" : "text-inksoft/70")}
        >{cell!.line2!.text}</span>
      )}
      {open && pos && createPortal(
        <div
          ref={popRef}
          role="dialog"
          aria-label="Post dates"
          className="fixed z-[96] w-64 bg-card border border-line2 rounded-xl shadow-pop py-2 fade-up text-sm"
          style={{ left: pos.x, top: pos.y }}
          onMouseEnter={() => { stay.current = true; setOpen(true); }}
          onMouseLeave={() => { stay.current = false; setOpen(false); }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 pt-1.5 pb-1 text-[11px] font-semibold uppercase tracking-wide text-inkfaint">{deal.brand} — posts</div>
          {(cell?.dates ?? []).length === 0 && <div className="px-3 py-2 text-[12px] text-inksoft">No post dates.</div>}
          {(cell?.dates ?? []).map((d) => (
            <div key={d.id ?? d.date} className="flex items-center gap-2 px-3 py-1.5 text-left">
              <span className="min-w-[70px] tabular-nums text-[12px] text-ink">{formatDate(d.date)}</span>
              <span className="flex-1 min-w-0 truncate text-[12px] text-inksoft">{d.label || (d.kind || "Post")}</span>
              <StatusPill size="sm" kind={d.posted ? "paid" : "neutral"}>{d.posted ? "Posted" : "Not posted"}</StatusPill>
            </div>
          ))}
          <div className="px-3 pt-2 pb-0.5 text-[11.5px] text-inksoft border-t border-line mt-1.5">Open the deal to make changes.</div>
        </div>,
        document.body
      )}
    </div>
  );
}

/* ---------------- Pay-by cell (column + hover card) ----------------
   Mirrors PostDateCell: shows the next-unpaid payment's date (red when past
   due), plus a dotted-underline count line ("0 of 2 paid" / "Month 3 of 6")
   ONLY when a deal has more than one payment. The count line is the sole
   hover/tap trigger for a READ ONLY card listing each payment (amount, due,
   status via the shared function). Single-payment deals show just the date. */
function PayByCell({ deal, onChanged }: { deal: Deal; onChanged: () => void }) {
  const cell = deal.pay_cell;
  const trgRef = useRef<HTMLSpanElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const stay = useRef(false);

  // Count line is the ONLY trigger, and only when there is more than one payment.
  const showCount = !!cell?.line2 && (cell?.totalCount ?? 0) > 1;

  // Position the portal'd popover below-left of the hovered COUNT text, 8px gap,
  // anchored to its left edge; flip above only when there's no room below.
  useEffect(() => {
    if (!open || !trgRef.current) return;
    const r = trgRef.current.getBoundingClientRect();
    const W = 272;
    const rows = Math.max(1, (cell?.payments.length ?? 1));
    const H = 34 + rows * 36 + 16;
    const spaceBelow = window.innerHeight - r.bottom - 8;
    const up = spaceBelow < H && r.top > H + 8;
    const left = Math.max(8, Math.min(r.left, window.innerWidth - W - 8));
    const top = up ? r.top - H - 8 : r.bottom + 8;
    setPos({ x: left, y: top });
  }, [open, cell?.payments.length]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (trgRef.current?.contains(t) || popRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Hover card is READ ONLY (spec 6b). Payment state is edited in the deal
  // drawer, not from this popover. Status pill uses the shared function so the
  // drawer and table can never disagree (Overdue matches the Payments page).

  const top = cell?.next_payby ? cell.next_payby : null;
  const notSet = <span className="text-inksoft">—</span>;
  const payViewOf = (r: PaymentRow) => paymentStatusView({ pay_status: r.pay_status ?? null, status: r.status ?? null, expected_date: r.expected_date ?? null, amount: r.amount ?? null });
  const pillOf = (r: PaymentRow) => {
    const v = payViewOf(r);
    return <StatusPill size="sm" kind={v.pillKind === "late" ? "late" : v.pillKind === "paid" ? "paid" : v.pillKind === "neutral" ? "neutral" : "due"}>{v.label}</StatusPill>;
  };

  return (
    <div className="d-payby relative select-none">
      <span className={cn("inline-flex h-10 items-center leading-none text-[12.5px] tabular-nums whitespace-nowrap", top && cell?.overdue ? "text-late font-medium" : "text-inksoft")}>
        {top ? formatDate(top) : notSet}
      </span>
      {showCount && (
        <span
          ref={trgRef}
          role="button"
          aria-haspopup="dialog"
          tabIndex={0}
          onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); setOpen(!open); } }}
          onMouseEnter={() => { stay.current = true; setOpen(true); }}
          onMouseLeave={() => { stay.current = false; setTimeout(() => { if (!stay.current) setOpen(false); }, 180); }}
          className={cn("absolute left-0 top-[30px] text-[10px] tabular-nums leading-none whitespace-nowrap underline decoration-dotted underline-offset-2 cursor-pointer", cell!.line2!.kind === "all" ? "text-ok" : "text-inksoft/70")}
        >{cell!.line2!.text}</span>
      )}
      {open && pos && createPortal(
        <div
          ref={popRef}
          role="dialog"
          aria-label="Payments"
          className="fixed z-[96] w-72 bg-card border border-line2 rounded-xl shadow-pop py-2 fade-up text-sm"
          style={{ left: pos.x, top: pos.y }}
          onMouseEnter={() => { stay.current = true; setOpen(true); }}
          onMouseLeave={() => { stay.current = false; setOpen(false); }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 pt-1.5 pb-1 text-[11px] font-semibold uppercase tracking-wide text-inkfaint">{deal.brand} — payments</div>
          {(cell?.payments ?? []).length === 0 && <div className="px-3 py-2 text-[12px] text-inksoft">No payments yet.</div>}
          {(cell?.payments ?? []).map((p) => (
            <div key={p.id} className="flex items-center gap-2 px-3 py-1.5 text-left">
              <span className="w-12 flex-none text-right tabular-nums text-[12px] text-ink">{p.amount != null ? formatMoney(p.amount) : ""}</span>
              <span className="text-[12px] text-inksoft tabular-nums">{p.expected_date ? formatDate(p.expected_date) : "Not set"}</span>
              <span className="flex-1" />
              {pillOf(p)}
            </div>
          ))}
          <div className="px-3 pt-2 pb-0.5 text-[11.5px] text-inksoft border-t border-line mt-1.5">Open the deal to make changes.</div>
        </div>,
        document.body
      )}
    </div>
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
      <DealTextarea
        inputRef={bindRef("notes")}
        value={draft.notes}
        onCommit={() => onFieldBlur("notes")}
        placeholder="Anything worth remembering about this deal…"
        className={cn("w-full bg-card border border-line2 rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-inkfaint focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition resize-y min-h-[220px] font-sans", dirty && "border-[var(--accent)]")}
      />
      {dirty && (
        <button onClick={() => undo("notes")} aria-label="Revert notes" title="Revert change" className="flex items-center gap-1.5 text-[12px] text-inksoft hover:text-ink cursor-pointer">
          <IconUndo size={13} /> Revert notes
        </button>
      )}
    </div>
  );
}

function FilesTab({ dealId, files, setFiles, onUploadFile }: {
  dealId: string; files: DealFile[]; setFiles: (f: DealFile[]) => void;
  onUploadFile: (file: File, kind: DealFile["kind"]) => Promise<{ extractionBlocked: boolean }>;
}) {
  const supabase = createClient();
  const [dragOver, setDragOver] = useState(false);
  const [kind, setKind] = useState<"auto" | "contract" | "invoice" | "other">("auto");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [extractionBlocked, setExtractionBlocked] = useState(false);

  const onFile = async (file: File) => {
    if (!file) return;
    setBusy(true); setMsg(null); setExtractionBlocked(false);
    // Resolve the file's kind. The user picks when they choose the file; the
    // extractor can only default it when it is confident it read an invoice.
    // Never a silent filename guess.
    let chosen: DealFile["kind"] = "other";
    if (kind === "contract") chosen = "contract";
    else if (kind === "invoice") chosen = "invoice";
    else {
      // auto: ask the extractor; only trust it when it returns invoice-ish data.
      try {
        const fd = new FormData(); fd.append("file", file);
        const res = await fetch("/api/deals/extract-invoice", { method: "POST", body: fd });
        if (res.ok) {
          const j = await res.json();
          const inv = j && (j.invoice_date || j.due_date || j.net_terms || j.amount != null);
          if (inv) chosen = "invoice";
        }
      } catch { /* non-fatal: falls back to other */ }
    }
    const r = await onUploadFile(file, chosen);
    if (chosen === "invoice") setMsg("Invoice attached.");
    if (r.extractionBlocked) setExtractionBlocked(true);
    setBusy(false);
  };
  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    await onFile(file);
  };
  const removeFile = async (f: DealFile) => {
    await supabase.storage.from("deal-files").remove([f.path]);
    await supabase.from("deal_files").delete().eq("id", f.id);
    setFiles(files.filter((x) => x.id !== f.id));
  };
  return (
    <div className="space-y-3">
      <div>
        <span className="text-[10.5px] font-semibold uppercase tracking-wide text-inkfaint mb-1 block">File type</span>
        <div className="flex gap-1.5">
          {(["auto", "contract", "invoice", "other"] as const).map((k) => (
            <button key={k} type="button" onClick={() => setKind(k)}
              className={cn("px-2.5 h-7 rounded-md text-[12px] font-medium border cursor-pointer", kind === k ? "border-[var(--accent)] bg-accenttint accent-ink" : "border-line2 text-inksoft hover:text-ink")}>
              {k === "auto" ? "Auto" : k === "contract" ? "Contract" : k === "invoice" ? "Invoice" : "Other"}
            </button>
          ))}
        </div>
      </div>
      {busy && <p className="text-[12px] text-inksoft">Reading file…</p>}
      {msg && <p className="text-[12px] text-inksoft">{msg}</p>}
      {extractionBlocked && (
        <div className="rounded-md px-2.5 py-2 text-[12px] leading-snug text-inksoft bg-card2/40">
          Invoice attached. Reading it and filling in the pay by date is on <a href="/#pricing" className="accent-ink font-semibold underline underline-offset-2 hover:opacity-80">Unlimited</a>.
        </div>
      )}
      <label
        className="cursor-pointer block"
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
      >
        <span className={cn(
          "flex items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 text-sm text-inksoft hover:border-[var(--accent)] hover:text-ink transition",
          dragOver ? "border-[var(--accent)] bg-accenttint text-accentink" : "border-line2"
        )}>
          <IconPaperclip size={16} /> {dragOver ? "Drop to upload" : "Drop a file or click to browse"}
        </span>
        <input type="file" className="hidden" onChange={onUpload} />
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
    </div>
  );
}
