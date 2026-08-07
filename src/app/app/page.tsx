"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { greeting, formatMoney, formatDate, isPastDue, cn } from "@/lib/utils";
import { FREE_ACTIVE_DEAL_CAP } from "@/lib/config";
import { IconPlus } from "@/components/icons";
import { Button, Chip, StatusPill } from "@/components/ui";

type Deal = {
  id: string; brand: string; status: string; value: number | null;
  due_date: string | null; deliverable: string | null; active: boolean;
  created_at: string;
};
type Payment = {
  id: string; deal_id: string | null; amount: number;
  expected_date: string | null; status: string;
  deal?: { brand: string } | null;
};
type Content = { id: string; title: string; event_date: string; post_type: string | null; platform: string | null };

const FILTERS = ["Active", "Unpaid", "Paid", "All"] as const;

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function OverviewPage() {
  const supabase = createClient();
  const [handle, setHandle] = useState<string | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Active");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const p = await supabase.from("profiles").select("handler").eq("id", user.id).single();
      const row = p.data as unknown as { handler: string | null } | null;
      setHandle(row?.handler ?? null);
    }
    const [d, pay, c] = await Promise.all([
      supabase.from("deals").select("*").order("created_at", { ascending: false }),
      supabase.from("payments").select("*, deal:deals(brand)").order("expected_date", { ascending: true }),
      supabase.from("content").select("*").gte("event_date", toISO(new Date())).lte("event_date", toISO(addDays(new Date(), 6))),
    ]);
    setDeals(d.data ?? []);
    setPayments(pay.data ?? []);
    setContent(c.data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const activeDeals = deals.filter((d) => d.active && d.status !== "archived");
  const booked = deals.reduce((s, d) => s + (d.value ?? 0), 0);
  const received = payments.filter((p) => p.status === "received").reduce((s, p) => s + p.amount, 0);
  const outstanding = payments.filter((p) => p.status !== "received").reduce((s, p) => s + p.amount, 0);

  const filteredDeals = activeDeals.filter((d) => {
    if (search && !d.brand.toLowerCase().includes(search.toLowerCase())) return false;
    switch (filter) {
      case "Unpaid": return d.status === "unpaid";
      case "Paid": return d.status === "paid";
      default: return true;
    }
  });

  // This week (next 7 days from today)
  const week: { date: Date; iso: string }[] = [];
  for (let i = 0; i < 7; i++) week.push({ date: addDays(new Date(), i), iso: toISO(addDays(new Date(), i)) });

  const weekContent = (iso: string) => content.filter((c) => c.event_date === iso);
  const weekPays = (iso: string) => payments.filter((p) => p.status !== "received" && p.expected_date === iso);

  const timeline = payments.filter((p) => {
    // show received + upcoming/past-due, newest interaction first by expected date desc
    return !p.expected_date || true;
  }).sort((a, b) => (b.expected_date ?? "").localeCompare(a.expected_date ?? "")).slice(0, 5);

  if (loading) return <OverviewSkeleton />;

  return (
    <div className="fade-up">
      {/* Greeting + actions */}
      <div className="top flex items-start justify-between gap-5 flex-wrap mb-[30px]">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight">
            {greeting()}{handle ? `, ${userName(handle)}` : ""}
          </h1>
          <p className="text-sm text-inksoft mt-1.5">
            {outstanding > 0
              ? `You've got ${formatMoney(outstanding)} coming in, and ${pastDueCount(payments)} invoice${pastDueCount(payments) === 1 ? "" : "s"} worth chasing.`
              : `You've got ${formatMoney(outstanding)} coming in. Looking good.`}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-card border border-line2 rounded-xl px-3.5 py-2.5 w-[220px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-faint)" strokeWidth="2" className="flex-none"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search deals, brands…"
              className="bg-transparent border-none outline-none text-[13.5px] w-full font-sans text-ink placeholder:text-inkfaint"
            />
          </div>
          <Link href="/app/deals?new=1">
            <Button><IconPlus size={16} /> Add deal</Button>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-[26px]">
        <StatCard label="Booked" value={formatMoney(booked)} sub={`across ${activeDeals.length} active deal${activeDeals.length === 1 ? "" : "s"}`} />
        <StatCard label="Paid" value={formatMoney(received)} sub="landed this month" color="var(--paid)" />
        <StatCard label="Outstanding" value={formatMoney(outstanding)} sub={`${payments.filter((p) => p.status !== "received").length} payments expected`} color="var(--due)" />
        <CapacityCard used={activeDeals.length} cap={FREE_ACTIVE_DEAL_CAP} />
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.65fr_1fr] gap-5">
        {/* Active deals */}
        <div className="panel">
          <div className="flex items-center justify-between px-[22px] pt-5 pb-4 flex-wrap gap-3">
            <h3 className="text-[16px] font-semibold">Active deals</h3>
            <div className="flex gap-1.5">
              {FILTERS.map((f) => <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Chip>)}
            </div>
          </div>
          {filteredDeals.length === 0 ? (
            <EmptyDeals search={!!search} />
          ) : (
            filteredDeals.map((d) => <DealRow key={d.id} deal={d} />)
          )}
        </div>

        {/* Right rail */}
        <div>
          <div className="bg-card border border-line rounded-[22px] p-[20px_22px] mb-5 shadow-card">
            <h3 className="text-[15px] font-semibold mb-4">This week</h3>
            <div className="grid grid-cols-7 gap-1.5">
              {week.map(({ date, iso }) => {
                const isToday = iso === toISO(new Date());
                const dots = Math.max(weekContent(iso).length, weekPays(iso).length);
                return (
                  <Link href={`/app/calendar?day=${iso}`} key={iso} className={cn("text-center p-2 rounded-[14px]", isToday && "accent-tint-bg")}>
                    <div className="day-dn text-[10px] uppercase tracking-wider text-inkfaint">{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
                    <div className={cn("text-[16px] font-semibold mt-0.5", isToday && "accent-ink")}>{date.getDate()}</div>
                    <div className="flex gap-1 justify-center mt-1.5 h-1.5">
                      {Array.from({ length: Math.min(dots, 3) }).map((_, i) => (
                        <span key={i} className={cn("w-1 h-1 rounded-full", isToday ? "bg-accent" : "bg-inkfaint")} />
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="bg-card border border-line rounded-[22px] p-[20px_22px] shadow-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[15px] font-semibold">Payments</h3>
              <Link href="/app/payments" className="text-xs text-accentink font-medium">View all</Link>
            </div>
            {timeline.length === 0 ? (
              <p className="text-[13px] text-inksoft py-3">No payments yet.</p>
            ) : (
              timeline.map((p) => <PayRow key={p.id} p={p} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color?: string }) {
  return (
    <div className="bg-card border border-line rounded-[16px] p-5 shadow-card">
      <div className="text-[11.5px] font-semibold uppercase tracking-wide text-inkfaint">{label}</div>
      <div className="text-[29px] font-semibold mt-2.5 tracking-tight money" style={color ? { color } : undefined}>{value}</div>
      <div className="text-[12.5px] text-inksoft mt-1">{sub}</div>
    </div>
  );
}

function CapacityCard({ used, cap }: { used: number; cap: number }) {
  const pct = Math.min(100, (used / cap) * 100);
  return (
    <div className="accent-tint-bg border border-line rounded-[16px] p-5 shadow-card" style={{ borderColor: "var(--accent-tint-2)" }}>
      <div className="text-[11.5px] font-semibold uppercase tracking-wide text-inksoft">Deal capacity</div>
      <div className="text-[29px] font-semibold mt-2.5 tracking-tight accent-ink">{used} / {cap}</div>
      <div className="text-[12.5px] text-inksoft mt-1">{cap - used > 0 ? `${cap - used} slot${cap - used === 1 ? "" : "s"} left on free` : "You're at the free limit"}</div>
      <div className="h-1.5 rounded-full mt-3.5 overflow-hidden" style={{ background: "rgba(255,255,255,0.6)" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--accent)" }} />
      </div>
    </div>
  );
}

function DealRow({ deal }: { deal: Deal }) {
  const pill = (() => {
    if (deal.status === "paid") return <StatusPill kind="paid">Paid</StatusPill>;
    if (deal.status === "unpaid") return <StatusPill kind="due">Awaiting pay</StatusPill>;
    if (isPastDue(deal.due_date)) return <StatusPill kind="late">Past due</StatusPill>;
    if (deal.status === "pipeline") return <StatusPill kind="pipeline">Pipeline</StatusPill>;
    return <StatusPill kind="accent">Active</StatusPill>;
  })();
  const meta = deal.deliverable || (isPastDue(deal.due_date) ? "invoice past due" : deal.status === "pipeline" ? "contract · in progress" : "deal");
  return (
    <button
      onClick={() => { window.location.href = `/app/deals?open=${deal.id}`; }}
      className="w-full flex items-center gap-3.5 px-[22px] py-[15px] border-t border-line text-left hover:bg-card2 transition-colors cursor-pointer"
    >
      <span className="h-10 w-10 rounded-xl flex-none flex items-center justify-center font-bold text-[15px] bg-card2 text-inksoft border border-line">
        {deal.brand.charAt(0).toUpperCase()}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[15px] font-semibold truncate">{deal.brand}</span>
        <span className="block text-[12.5px] text-inkfaint mt-0.5 truncate">{meta}</span>
      </span>
      <span className="text-right flex-none">
        <span className="block money text-sm font-medium mb-1.5">{formatMoney(deal.value)}</span>
        {pill}
      </span>
    </button>
  );
}

function PayRow({ p }: { p: Payment }) {
  const kind = p.status === "received" ? "g" : isPastDue(p.expected_date) ? "r" : "c";
  const label = p.status === "received" ? "Received" : isPastDue(p.expected_date) ? "Past due" : "Expected";
  const pillKind = p.status === "received" ? "paid" : isPastDue(p.expected_date) ? "late" : "due";
  const when = p.expected_date ? new Date(p.expected_date + "T00:00:00") : null;
  return (
    <div className="flex items-center gap-3.5 py-3 border-t border-line first:border-t-0">
      <div className="w-11 flex-none text-center">
        <div className="text-[18px] font-semibold leading-none money">{when ? when.getDate() : "—"}</div>
        <div className="text-[10px] uppercase tracking-wider text-inkfaint mt-0.5">{when ? when.toLocaleDateString("en-US", { month: "short" }) : ""}</div>
      </div>
      <span className={cn("pbar", kind)} aria-hidden />
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-semibold truncate">{p.deal?.brand ?? "Payment"}</div>
        <div className="text-[11.5px] text-inkfaint truncate">{p.status === "received" ? "Paid to checking" : "Invoice"}</div>
      </div>
      <div className="text-right flex-none">
        <div className="money text-[13px] font-medium">{formatMoney(p.amount)}</div>
        <StatusPill kind={pillKind as "paid" | "due" | "late"}>{label}</StatusPill>
      </div>
    </div>
  );
}

function EmptyDeals({ search }: { search: boolean }) {
  return (
    <div className="px-[22px] py-12 text-center">
      {search ? (
        <p className="text-sm text-inksoft">No deals match your search.</p>
      ) : (
        <>
          <p className="font-semibold text-[15px]">Add your first deal</p>
          <p className="text-[13px] text-inksoft mt-1 max-w-xs mx-auto">
            Track your first brand collaboration and watch your money, content, and payments come together in one calm place.
          </p>
          <Link href="/app/deals?new=1" className="inline-block mt-4">
            <Button><IconPlus size={16} /> Add your first deal</Button>
          </Link>
        </>
      )}
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-8">
      <div className="skeleton h-9 w-72" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="skeleton h-28" /><div className="skeleton h-28" /><div className="skeleton h-28" /><div className="skeleton h-28" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.65fr_1fr] gap-5">
        <div className="skeleton h-64" /><div className="skeleton h-64" />
      </div>
    </div>
  );
}

function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function pastDueCount(payments: Payment[]) {
  return payments.filter((p) => p.status !== "received" && isPastDue(p.expected_date)).length;
}
function userName(handle: string) {
  return handle.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
