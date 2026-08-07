"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { greeting, formatMoney, formatDateLong, isPastDue, cn } from "@/lib/utils";
import { IconPlus, IconBriefcase, IconMoney, IconArrowRight, IconCheck } from "@/components/icons";
import { Badge, Button, Spinner } from "@/components/ui";

type Deal = {
  id: string;
  brand: string;
  status: string;
  value: number | null;
  due_date: string | null;
  active: boolean;
};

type Payment = {
  id: string;
  deal_id: string | null;
  amount: number;
  expected_date: string | null;
  status: string;
  deal?: { brand: string } | null;
};

type Content = {
  id: string;
  title: string;
  event_date: string;
  post_type: string | null;
  status: string;
};

export default function OverviewPage() {
  const supabase = createClient();
  const [handle, setHandle] = useState<string | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const p = await supabase
        .from("profiles")
        .select("handler")
        .eq("id", user.id)
        .single();
      const row = p.data as unknown as { handler: string | null } | null;
      setHandle(row?.handler ?? null);
    }
    const [d, pay, c] = await Promise.all([
      supabase.from("deals").select("*").order("created_at", { ascending: false }),
      supabase
        .from("payments")
        .select("*, deal:deals(brand)")
        .order("expected_date", { ascending: true }),
      supabase
        .from("content")
        .select("*")
        .gte("event_date", todayISO())
        .order("event_date", { ascending: true })
        .limit(20),
    ]);
    setDeals(d.data ?? []);
    setPayments(pay.data ?? []);
    setContent(c.data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  // Money stats
  const booked = deals.reduce((s, d) => s + (d.value ?? 0), 0);
  const received = payments
    .filter((p) => p.status === "received")
    .reduce((s, p) => s + p.amount, 0);
  const outstanding = payments
    .filter((p) => p.status !== "received")
    .reduce((s, p) => s + p.amount, 0);

  const upcomingPayments = payments
    .filter((p) => p.status !== "received")
    .slice(0, 4);
  const pastDue = payments.filter(
    (p) => p.status !== "received" && isPastDue(p.expected_date)
  );

  // This-week calendar strip (next 7 days)
  const week: { date: Date; iso: string }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    week.push({ date: d, iso: toISO(d) });
  }

  if (loading) {
    return <OverviewSkeleton />;
  }

  const hasNothing = deals.length === 0 && content.length === 0;

  return (
    <div className="space-y-8 fade-up">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          {greeting()}
          {handle ? `, ${handle}` : ""}
        </h1>
        <p className="text-muted mt-1 text-sm">
          Here&apos;s where your brand work stands today.
        </p>
      </div>

      {/* First-deal empty state */}
      {hasNothing && (
        <div className="card p-8 text-center flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-2xl accent-soft grid place-items-center">
            <IconBriefcase size={24} />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Add your first deal</h2>
            <p className="text-muted text-sm mt-1 max-w-sm mx-auto">
              Track your first brand collaboration and watch your money,
              content, and payments come together in one calm place.
            </p>
          </div>
          <Link href="/app/deals?new=1">
            <Button><IconPlus size={16} /> Add your first deal</Button>
          </Link>
        </div>
      )}

      {/* Money pill row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MoneyPill
          label="Booked"
          value={booked}
          sub={`${deals.filter((d) => d.active).length} active deal${deals.filter((d) => d.active).length === 1 ? "" : "s"}`}
          accent
        />
        <MoneyPill label="Paid" value={received} sub="received" tone="ok" />
        <MoneyPill
          label="Outstanding"
          value={outstanding}
          sub={pastDue.length ? `${pastDue.length} past due` : "expected"}
          tone={pastDue.length ? "bad" : "warn"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming due dates */}
        <div className="lg:col-span-1 card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Coming up</h2>
            <Link href="/app/payments" className="text-sm accent-text font-medium flex items-center gap-1">
              Payments <IconArrowRight size={14} />
            </Link>
          </div>
          {upcomingPayments.length === 0 ? (
            <p className="text-sm text-muted py-4">No expected payments yet.</p>
          ) : (
            <ul className="space-y-2">
              {upcomingPayments.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-1">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">
                      {p.deal?.brand ?? "Payment"}
                    </div>
                    <div className="text-xs text-muted">
                      {formatDateLong(p.expected_date)} · {p.status === "expected" ? "Expected" : "Past due"}
                    </div>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">
                    {formatMoney(p.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* This-week calendar strip */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">This week</h2>
            <Link href="/app/calendar" className="text-sm accent-text font-medium flex items-center gap-1">
              Full calendar <IconArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {week.map(({ date, iso }) => {
              const dayContent = content.filter((c) => c.event_date === iso);
              const dayPays = payments.filter(
                (p) => p.status !== "received" && p.expected_date === iso
              );
              const isToday = iso === toISO(new Date());
              return (
                <Link
                  key={iso}
                  href={`/app/calendar?day=${iso}`}
                  className={cn(
                    "flex flex-col items-center rounded-xl py-2.5 gap-1 border text-center transition-colors",
                    isToday ? "accent-soft border-accent/40" : "border-transparent hover:bg-subtle"
                  )}
                >
                  <span className="text-[11px] text-muted uppercase tracking-wide">
                    {date.toLocaleDateString("en-US", { weekday: "narrow" })}
                  </span>
                  <span
                    className={cn(
                      "h-6 w-6 grid place-items-center text-sm font-semibold rounded-full",
                      isToday && "accent-fill"
                    )}
                  >
                    {date.getDate()}
                  </span>
                  <span className="flex gap-0.5 h-1.5 items-center">
                    {dayContent.slice(0, 3).map((c) => (
                      <span key={c.id} className="h-1.5 w-1.5 rounded-full accent-fill" />
                    ))}
                    {dayPays.length > 0 && (
                      <span className="h-1.5 w-1.5 rounded-full bg-warn" />
                    )}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MoneyPill({
  label,
  value,
  sub,
  tone = "neutral",
  accent = false,
}: {
  label: string;
  value: number;
  sub: string;
  tone?: "neutral" | "ok" | "warn" | "bad";
  accent?: boolean;
}) {
  return (
    <div className={cn("card p-5", accent && "accent-soft border-accent/20")}>
      <div className="text-sm text-muted font-medium">{label}</div>
      <div className="text-2xl font-semibold mt-1 tabular-nums">
        {formatMoney(value)}
      </div>
      <div
        className={cn(
          "text-xs mt-0.5",
          tone === "ok" && "text-ok",
          tone === "bad" && "text-bad",
          tone === "warn" && "text-warn",
          tone === "neutral" && "text-muted"
        )}
      >
        {sub}
      </div>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <div className="skeleton h-8 w-56" />
        <div className="skeleton h-4 w-72 mt-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="skeleton h-28" />
        <div className="skeleton h-28" />
        <div className="skeleton h-28" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="skeleton h-56" />
        <div className="skeleton h-56 lg:col-span-2" />
      </div>
    </div>
  );
}

function todayISO() {
  const d = new Date();
  return toISO(d);
}
function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
