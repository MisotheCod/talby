"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { createClient } from "@/lib/supabase/client";
import { greeting, formatMoney, isPastDue, cn } from "@/lib/utils";
import { FREE_ACTIVE_DEAL_CAP } from "@/lib/constants";
import { IconPlus } from "@/components/icons";
import { Pill, Segmented } from "@/components/ui";

type Deal = {
  id: string; brand: string; status: string; value: number | null;
  due_date: string | null; deliverable: string | null; active: boolean;
  notes: string | null; created_at: string; payment_status: string;
};
type Payment = {
  id: string; deal_id: string | null; amount: number;
  expected_date: string | null; status: string;
  deal?: { brand: string } | null;
};
type Content = {
  id: string; title: string; event_date: string; post_type: string | null;
  platform: string | null; status: string | null;
};
type Todo = { id: string; title: string; done: boolean; due_date: string | null };
type CalendarNote = { id: string; body: string; event_date: string; done: boolean };
type Reminder = {
  id: string; subject: string; body: string; rep_email: string | null;
  payment_id: string; deal_id: string; status: string;
  deal?: { brand: string } | null;
};

const FILTERS = ["Active", "Unpaid", "Paid", "All"] as const;

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Type metadata: label + source color (tint/text/border derived via color-mix)
const TYPE: Record<string, [string, string]> = {
  payment: ["PAY", "var(--due)"],
  received: ["PAY", "var(--paid)"],
  post: ["POST", "var(--accent)"],
  deliv: ["DUE", "var(--late)"],
  todo: ["TODO", "var(--purple)"],
  note: ["NOTE", "var(--ink-soft)"],
};

export default function OverviewPage() {
  const supabase = createClient();
  const [handle, setHandle] = useState<string | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notes, setNotes] = useState<CalendarNote[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Active");
  const [plan, setPlan] = useState<"free" | "paid">("free");
  const [loading, setLoading] = useState(true);
  const [selDay, setSelDay] = useState(0); // index into this week (today first)
  const [dealPage, setDealPage] = useState(1);
  const DEAL_PAGE_SIZE = 10;
  const rootRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const p = await supabase.from("profiles").select("handler, plan").eq("id", user.id).single();
      const row = p.data as unknown as { handler: string | null; plan: string } | null;
      setHandle(row?.handler ?? null);
      setPlan((row?.plan ?? "free") as "free" | "paid");
    }
    // All data for the week + payments + deals, user-scoped via RLS.
    const [d, pay, c, t, n, rem] = await Promise.all([
      supabase.from("deals").select("*").order("created_at", { ascending: false }),
      supabase.from("payments").select("*, deal:deals(brand)").order("expected_date", { ascending: true }),
      supabase.from("content").select("*").order("event_date", { ascending: true }),
      supabase.from("todos").select("*").not("due_date", "is", null),
      supabase.from("notes").select("id, body, event_date, done").not("event_date", "is", null),
      supabase.from("nudges").select("id, subject, body, rep_email, payment_id:payments(id, deal:deals(brand)), deal_id").eq("status", "ready").order("created_at", { ascending: false }),
    ]);
    setDeals(d.data ?? []);
    setPayments(pay.data ?? []);
    setContent(c.data ?? []);
    setTodos((t.data ?? []) as unknown as Todo[]);
    setNotes((n.data ?? []) as unknown as CalendarNote[]);
    setReminders((rem.data ?? []) as unknown as Reminder[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  // ---- GSAP load-in (respects prefers-reduced-motion) ----
  useEffect(() => {
    if (loading || !rootRef.current) return;
    const root = rootRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // final values immediately, nothing hidden
      root.querySelectorAll(".cnt-up").forEach((el) => {
        const n = +(el as HTMLElement).dataset.n! || 0;
        el.textContent = "$" + n.toLocaleString();
      });
      const cap = root.querySelector<HTMLElement>("#capfill");
      if (cap) cap.style.width = cap.dataset.w || "0%";
      return;
    }
    const ctx = gsap.context(() => {
      // rise in for greeting/search/stats/panels
      gsap.set(".anim", { opacity: 0, y: 18 });
      gsap.to(".anim", { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.06, delay: 0.05 });
      // deal/payment rows slide in (guarded: only if present)
      if (root.querySelector(".rowanim")) {
        gsap.set(".rowanim", { opacity: 0, x: -12 });
        gsap.to(".rowanim", { opacity: 1, x: 0, duration: 0.45, ease: "power2.out", stagger: 0.06, delay: 0.45 });
      }
      // count up money stats
      root.querySelectorAll<HTMLElement>(".cnt-up").forEach((el, i) => {
        const n = +el.dataset.n! || 0;
        if (n <= 0) { el.textContent = "$0"; return; }
        const o = { v: 0 };
        gsap.to(o, { v: n, duration: 1.1, ease: "power2.out", delay: 0.35 + i * 0.12,
          onUpdate: () => { el.textContent = "$" + Math.round(o.v).toLocaleString(); } });
      });
      // capacity bar fill to real percentage
      const cap = root.querySelector<HTMLElement>("#capfill");
      if (cap) gsap.to(cap, { width: cap.dataset.w || "0%", duration: 0.9, ease: "power2.out", delay: 0.6 });
    }, root);
    return () => ctx.revert();
  }, [loading]);

  const activeDeals = deals.filter((d) => d.brand?.trim() && d.active && d.status !== "archived");
  const booked = deals.reduce((s, d) => s + (d.value ?? 0), 0);
  const received = payments.filter((p) => p.status === "received").reduce((s, p) => s + p.amount, 0);
  const outstanding = payments.filter((p) => p.status !== "received").reduce((s, p) => s + p.amount, 0);
  const pendingPayments = payments.filter((p) => p.status !== "received");
  const pastDue = pendingPayments.filter((p) => isPastDue(p.expected_date)).length;

  // Payment-due lookup so the Active list can default-sort by soonest payment.
  const firstDueByDeal = new Map<string, string>();
  for (const p of pendingPayments) {
    if (!p.deal_id) continue;
    const cur = firstDueByDeal.get(p.deal_id);
    if (!cur || (p.expected_date ?? "") < cur) firstDueByDeal.set(p.deal_id, p.expected_date ?? "");
  }

  const filteredDeals = activeDeals.filter((d) => {
    if (search) {
      const q = search.toLowerCase();
      const inBrand = d.brand.toLowerCase().includes(q);
      const inNotes = (d.notes ?? "").toLowerCase().includes(q);
      if (!inBrand && !inNotes) return false;
    }
    const paid = d.payment_status === "paid" || d.status === "paid";
    switch (filter) {
      case "Unpaid": return !paid;
      case "Paid": return paid;
      default: return true; // Active and All show every active deal (incl. paid & pipeline)
    }
  })
  // Defined default sort: soonest payment due first (deals with no pending
  // payment fall back to most recently added), so the money landing soonest is
  // at the top.
  .sort((a, b) => {
    const da = firstDueByDeal.get(a.id) ?? "";
    const db = firstDueByDeal.get(b.id) ?? "";
    if (da && db) return da < db ? -1 : da > db ? 1 : 0;
    if (da && !db) return -1;
    if (!da && db) return 1;
    return (b.created_at ?? "").localeCompare(a.created_at ?? "");
  });

  const dealTotalPages = Math.max(1, Math.ceil(filteredDeals.length / DEAL_PAGE_SIZE));
  const safeDealPage = Math.min(dealPage, dealTotalPages);
  const pagedDeals = filteredDeals.slice((safeDealPage - 1) * DEAL_PAGE_SIZE, safeDealPage * DEAL_PAGE_SIZE);

  // ---- This week (7 days from today) ----
  const today = new Date();
  const week: { date: Date; iso: string }[] = [];
  for (let i = 0; i < 7; i++) week.push({ date: addDays(today, i), iso: toISO(addDays(today, i)) });
  const todayIso = toISO(today);

  // Same payments data drives both the week and the Payments card (correlation).
  const dayItems = (iso: string) => {
    const items: { t: string; n: string; a?: string; done?: boolean }[] = [];
    // payments (expected or past-due) — same table the Payments card uses
    payments.filter((p) => p.status !== "received" && p.expected_date === iso)
      .forEach((p) => items.push({ t: "payment", n: `${p.deal?.brand ?? "Payment"} payment expected`, a: formatMoney(p.amount) }));
    // received payments on that date land too
    payments.filter((p) => p.status === "received" && p.expected_date === iso)
      .forEach((p) => items.push({ t: "received", n: `${p.deal?.brand ?? "Payment"} received`, a: formatMoney(p.amount) }));
    // posts (incl. recurring instances) on that date
    content.filter((c) => c.event_date === iso)
      .forEach((c) => items.push({ t: "post", n: c.title }));
    // deal deliverables due that day
    activeDeals.filter((d) => d.due_date === iso)
      .forEach((d) => items.push({ t: "deliv", n: `${d.brand} deliverable due` }));
    // dated to-dos (both pending and done — done stay visible, struck+dimmed)
    todos.filter((t) => t.due_date === iso)
      .forEach((t) => items.push({ t: "todo", n: t.title, done: t.done }));
    // dated notes/reminders (done stay visible, struck+dimmed)
    notes.filter((n) => n.event_date === iso)
      .forEach((n) => items.push({ t: "note", n: n.body, done: n.done }));
    return items;
  };

  // "This week" strip and the Payments card both read from the same `payments`
  // data (correlation). The card shows expected/past-due payments soonest-first
  // so the next money landing is at the top, matching what the week drives.
  const timeline = pendingPayments
    .filter((p) => p.expected_date)
    .sort((a, b) => (a.expected_date ?? "").localeCompare(b.expected_date ?? ""))
    .slice(0, 5);

  if (loading) return <OverviewSkeleton />;

  return (
    <div ref={rootRef}>
      {/* Greeting + actions */}
      <div className="top anim">
        <div>
          <h1 className="text-[26px] font-head font-bold">
            {greeting()}{handle ? `, ${userName(handle)}` : ""}
          </h1>
          <p className="text-sm text-inksoft mt-1.5">
            {activeDeals.length === 0
              ? "No deals in motion yet. Time to lock in your first brand collab."
              : outstanding > 0
                ? `You've got ${formatMoney(outstanding)} coming in, and ${pastDue} invoice${pastDue === 1 ? "" : "s"} worth chasing.`
                : `You've got ${formatMoney(outstanding)} coming in. Looking good.`}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/app/deals?new=1" className="no-underline">
            <button className="btn3d" data-tour="add-deal"><svg className="ic" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>Add deal</button>
          </Link>
        </div>
      </div>

      {/* Stats row (auto-fit; paid users get no capacity card and cards stretch) */}
      <div className="stats">
        <div className="statcard anim">
          <div className="lbl">Booked</div>
          <div className="val cnt-up" data-n={booked}>$0</div>
          <div className="sub">across {activeDeals.length} active deal{activeDeals.length === 1 ? "" : "s"}</div>
        </div>
        <div className="statcard anim">
          <div className="lbl">Paid</div>
          <div className="val cnt-up" style={{ color: "var(--paid)" }} data-n={received}>$0</div>
          <div className="sub">landed this month</div>
        </div>
        <div className="statcard anim">
          <div className="lbl">Outstanding</div>
          <div className="val cnt-up" style={{ color: "var(--due)" }} data-n={outstanding}>$0</div>
          <div className="sub">{pendingPayments.length} payment{pendingPayments.length === 1 ? "" : "s"} expected</div>
        </div>
        {plan === "free" && (
          <CapacityCard used={activeDeals.length} cap={FREE_ACTIVE_DEAL_CAP} />
        )}
      </div>

      {/* Inbox scan promo bar (free users): invites turning on the forward-any-email
          inbox scanner — works with any inbox, no Google connection needed. */}
      {plan === "free" && (
        <div className="anim inbox-promo">
          <div className="ip-left">
            <span className="ip-glogo" aria-hidden>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-inksoft">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
            </span>
            <div className="ip-text">
              <div className="ip-title">Never miss a brand-deal email</div>
              <div className="ip-sub">Forward brand collabs to your Talby inbox and add them as pipeline deals, with any email provider.</div>
            </div>
          </div>
          <a href="/#pricing" className="btn3d ip-cta no-underline block text-center">Go unlimited</a>
        </div>
      )}

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.65fr_1fr] gap-5">
        {/* Active deals */}
        <div className="panel anim">
          <div className="flex items-center justify-between px-[22px] pt-[19px] pb-[15px] flex-wrap gap-3">
            <h3 className="text-[16px] font-head font-bold">Active deals</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="search !w-56">
                <svg className="ic" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setDealPage(1); }}
                  placeholder="Search your deals"
                  aria-label="Search active deals by brand"
                />
              </div>
              <Segmented options={FILTERS} value={filter} onChange={(f) => { setFilter(f); setDealPage(1); }} />
            </div>
          </div>
          {filteredDeals.length === 0 ? (
            <EmptyDeals search={!!search} />
          ) : (
            pagedDeals.map((d) => <DealRow key={d.id} deal={d} />)
          )}
          {dealTotalPages > 1 && (
            <div className="flex items-center justify-between px-[22px] py-3 border-t border-line">
              <span className="text-xs text-inksoft">{filteredDeals.length} deal{filteredDeals.length === 1 ? "" : "s"}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setDealPage((p) => Math.max(1, p - 1))} disabled={safeDealPage === 1} className="px-2.5 h-8 rounded-lg border border-line2 text-xs text-inksoft hover:text-ink disabled:opacity-40 cursor-pointer disabled:cursor-default">Previous</button>
                <span className="text-xs text-inksoft">Page {safeDealPage} of {dealTotalPages}</span>
                <button onClick={() => setDealPage((p) => Math.min(dealTotalPages, p + 1))} disabled={safeDealPage === dealTotalPages} className="px-2.5 h-8 rounded-lg border border-line2 text-xs text-inksoft hover:text-ink disabled:opacity-40 cursor-pointer disabled:cursor-default">Next</button>
              </div>
            </div>
          )}
        </div>

        {/* Right rail */}
        <div>
          {/* This week — interactive */}
          <div className="rcard anim">
            <h3 className="font-head">This week</h3>
            <div className="week">
              {week.map(({ date, iso }, i) => {
                const items = dayItems(iso);
                const isToday = iso === todayIso;
                return (
                  <button
                    key={iso}
                    onClick={() => setSelDay(i)}
                    className={cn("day", isToday && "today", i === selDay && "sel")}
                    aria-label={`${DAYS[date.getDay()]} ${date.getDate()}`}
                  >
                    <div className="dn">{DAYS[date.getDay()]}</div>
                    <div className="dd">{date.getDate()}</div>
                    <div className="dots">
                      {items.slice(0, 3).map((it, k) => (
                        <Pill key={k} size="dot" source={TYPE[it.t]?.[1] || "var(--ink-soft)"} />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="daylist">
              {dayItems(week[selDay].iso).length === 0 ? (
                <div className="empty">
                  Nothing scheduled for {DAYS[week[selDay].date.getDay()]} {week[selDay].date.getDate()}. Enjoy the quiet.
                </div>
              ) : (
                dayItems(week[selDay].iso).map((it, k) => (
                  <div key={k} className="ditem">
                    <Pill size="sm" done={it.done} source={TYPE[it.t]?.[1] || "var(--ink-soft)"} className="px-2 py-0.5">{TYPE[it.t]?.[0]}</Pill>
                    <span className={cn("n", it.done && "pill-done-title")}>{it.n}</span>
                    {it.a && <span className="a">{it.a}</span>}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Payments — same payments data as the week */}
          <div className="rcard anim">
            <div className="flex items-center justify-between mb-[15px]">
              <h3 className="font-head text-[15px] font-bold">Payments</h3>
              <Link href="/app/payments" className="text-xs text-accentink font-medium no-underline">View all</Link>
            </div>
            {timeline.length === 0 ? (
              <p className="text-[13px] text-inksoft py-2">No payments yet.</p>
            ) : (
              timeline.map((p) => <PayRow key={p.id} p={p} />)
            )}
          </div>

          {/* Needs a nudge — drafted reminders ready to copy or send */}
          {reminders.length > 0 && (
            <div className="rcard anim">
              <div className="flex items-center justify-between mb-[15px]">
                <h3 className="font-head text-[15px] font-bold">Needs a nudge</h3>
                <Link href="/app/payments" className="text-xs text-accentink font-medium no-underline">Review</Link>
              </div>
              <div className="space-y-2">
                {reminders.slice(0, 4).map((r) => (
                  <div key={r.id} className="flex items-center gap-2.5">
                    <Pill size="sm" source="var(--due)" className="px-2 py-0.5">NUDGE</Pill>
                    <span className="flex-1 min-w-0 truncate text-[13px]">{r.subject}</span>
                    <Link href={`/app/payments?reminder=${r.id}`} className="text-xs text-accentink font-medium no-underline shrink-0">Send</Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color?: string }) {
  return (
    <div className="statcard">
      <div className="lbl">{label}</div>
      <div className="val" style={color ? { color } : undefined}>{value}</div>
      <div className="sub">{sub}</div>
    </div>
  );
}

function CapacityCard({ used, cap }: { used: number; cap: number }) {
  const pct = Math.min(100, (used / cap) * 100);
  return (
    <div className="statcard cap">
      <div className="lbl">Deal capacity</div>
      <div className="val">{used} / {cap}</div>
      <div className="sub">{cap - used > 0 ? `${cap - used} slot${cap - used === 1 ? "" : "s"} left on free` : "You're at the free limit"}</div>
      <div className="capbar">
        <i id="capfill" data-w={`${pct}%`} style={{ width: 0 }} />
      </div>
    </div>
  );
}

function DealRow({ deal }: { deal: Deal }) {
  const paid = deal.payment_status === "paid" || deal.status === "paid";
  const pill = (() => {
    if (deal.status === "archived") return <span className="pill pill-pipe">Archived</span>;
    if (deal.status === "pipeline") return <span className="pill pill-pipe">Negotiating</span>;
    if (paid) return <span className="pill pill-paid">Paid</span>;
    if (isPastDue(deal.due_date)) return <span className="pill pill-late">Past due</span>;
    if (deal.status === "unpaid" || deal.payment_status === "expected") return <span className="pill pill-due">Awaiting pay</span>;
    return <span className="pill pill">Active</span>;
  })();
  return (
    <button
      onClick={() => { window.location.href = `/app/deals?open=${deal.id}`; }}
      className="deal rowanim"
    >
      <span className="dlogo dlogo-ink">{deal.brand.charAt(0).toUpperCase()}</span>
      <span className="dmid">
        <span className="dbrand truncate">{deal.brand}</span>
      </span>
      <span className="text-right flex-none flex items-center gap-2.5">
        <span className="flex-none">{pill}</span>
        <span className="damt">{formatMoney(deal.value)}</span>
      </span>
    </button>
  );
}

function PayRow({ p }: { p: Payment }) {
  const kind = p.status === "received" ? "g" : isPastDue(p.expected_date) ? "r" : "c";
  const label = p.status === "received" ? "Received" : isPastDue(p.expected_date) ? "Past due" : "Expected";
  const pillKind = p.status === "received" ? "pill-paid" : isPastDue(p.expected_date) ? "pill-late" : "pill-due";
  const barCls = p.status === "received" ? "g" : isPastDue(p.expected_date) ? "r" : "c";
  const when = p.expected_date ? new Date(p.expected_date + "T00:00:00") : null;
  return (
    <div className="pay rowanim">
      <div className="when">
        <div className="d font-head">{when ? when.getDate() : "-"}</div>
        <div className="m">{when ? when.toLocaleDateString("en-US", { month: "short" }) : ""}</div>
      </div>
      <span className={cn("pbar", barCls)} aria-hidden />
      <div className="mid min-w-0">
        <div className="b truncate">{p.deal?.brand ?? "Payment"}</div>
        <div className="s truncate">{p.status === "received" ? "Paid to checking" : "Invoice"}</div>
      </div>
      <div className="text-right flex-none ml-2">
        <div className="amt">{formatMoney(p.amount)}</div>
        <span className={cn("pill", pillKind)}>{label}</span>
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
          <p className="font-head font-bold text-[15px]">Add your first deal</p>
          <p className="text-[13px] text-inksoft mt-1 max-w-xs mx-auto">
            Track your first brand collaboration and watch your money, content, and payments come together in one calm place.
          </p>
          <Link href="/app/deals?new=1" className="inline-block mt-4 no-underline">
            <button className="btn3d"><svg className="ic" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>Add your first deal</button>
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

function pastDueCount(payments: Payment[]) {
  return payments.filter((p) => p.status !== "received" && isPastDue(p.expected_date)).length;
}
function userName(handle: string) {
  return handle.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
