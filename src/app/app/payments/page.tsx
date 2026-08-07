"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatMoney, formatDateLong, isPastDue, cn } from "@/lib/utils";
import { IconCheck, IconPlus } from "@/components/icons";
import { Button, Input, Select, Spinner } from "@/components/ui";

type Payment = {
  id: string; deal_id: string | null; amount: number;
  expected_date: string | null; status: string;
  deal?: { brand: string } | null;
};
type Deal = { id: string; brand: string };

export default function PaymentsPage() {
  const supabase = createClient();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = useCallback(async () => {
    const [p, d] = await Promise.all([
      supabase.from("payments").select("*, deal:deals(brand)").order("expected_date", { ascending: true }),
      supabase.from("deals").select("id, brand"),
    ]);
    setPayments((p.data ?? []) as unknown as Payment[]);
    setDeals((d.data ?? []) as unknown as Deal[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const income = payments.reduce((s, p) => s + p.amount, 0);
  const expected = payments.filter((p) => p.status !== "received").reduce((s, p) => s + p.amount, 0);
  const received = payments.filter((p) => p.status === "received").reduce((s, p) => s + p.amount, 0);

  const pastDue = payments.filter((p) => p.status !== "received" && isPastDue(p.expected_date));
  const upcoming = payments
    .filter((p) => p.status !== "received" && !isPastDue(p.expected_date))
    .sort((a, b) => (a.expected_date ?? "").localeCompare(b.expected_date ?? ""));
  const receivedList = payments.filter((p) => p.status === "received");

  const markReceived = async (id: string) => {
    await supabase.from("payments").update({ status: "received" }).eq("id", id);
    load();
  };

  if (loading) return <div className="space-y-4"><div className="skeleton h-10 w-56" /><div className="grid grid-cols-3 gap-4"><div className="skeleton h-24" /><div className="skeleton h-24" /><div className="skeleton h-24" /></div></div>;

  return (
    <div className="space-y-6 fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Payments</h1>
          <p className="text-muted text-sm mt-1">Your money at a glance.</p>
        </div>
        <Button onClick={() => setShowAdd(true)}><IconPlus size={16} /> Add expected payment</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Summary label="Income (booked)" value={income} />
        <Summary label="Expected" value={expected} tone="warn" />
        <Summary label="Received" value={received} tone="ok" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Past due */}
        <div className="card p-5">
          <h2 className="font-semibold mb-3">Past due</h2>
          {pastDue.length === 0 ? (
            <p className="text-sm text-muted">Nothing past due — you&apos;re all clear.</p>
          ) : (
            <ul className="space-y-2">
              {pastDue.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0">
                  <div>
                    <div className="font-medium">{p.deal?.brand ?? "Payment"}</div>
                    <div className="text-xs text-bad">{formatDateLong(p.expected_date)} · Past due</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-bad tabular-nums">{formatMoney(p.amount)}</span>
                    <Button size="sm" variant="secondary" onClick={() => markReceived(p.id)}><IconCheck size={14} /> Received</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Upcoming */}
        <div className="card p-5">
          <h2 className="font-semibold mb-3">Upcoming</h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted">No expected payments scheduled.</p>
          ) : (
            <ul className="space-y-2">
              {upcoming.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0">
                  <div>
                    <div className="font-medium">{p.deal?.brand ?? "Payment"}</div>
                    <div className="text-xs text-muted">{formatDateLong(p.expected_date)}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold tabular-nums">{formatMoney(p.amount)}</span>
                    <Button size="sm" variant="secondary" onClick={() => markReceived(p.id)}><IconCheck size={14} /> Received</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Received history */}
      <div className="card p-5">
        <h2 className="font-semibold mb-3">Received</h2>
        {receivedList.length === 0 ? (
          <p className="text-sm text-muted">Payments you mark as received appear here.</p>
        ) : (
          <ul className="space-y-1">
            {receivedList.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-ok" />
                  <div>
                    <div className="font-medium">{p.deal?.brand ?? "Payment"}</div>
                    <div className="text-xs text-muted">Received · {formatDateLong(p.expected_date)}</div>
                  </div>
                </div>
                <span className="font-semibold text-ok tabular-nums">{formatMoney(p.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showAdd && (
        <AddPaymentModal deals={deals} onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load(); }} />
      )}
    </div>
  );
}

function Summary({ label, value, tone = "neutral" }: { label: string; value: number; tone?: "neutral" | "warn" | "ok" }) {
  return (
    <div className="card p-5">
      <div className="text-sm text-muted font-medium">{label}</div>
      <div className={cn("text-2xl font-semibold mt-1 tabular-nums", tone === "ok" && "text-ok", tone === "warn" && "text-warn")}>
        {formatMoney(value)}
      </div>
    </div>
  );
}

function AddPaymentModal({ deals, onClose, onSaved }: { deals: Deal[]; onClose: () => void; onSaved: () => void }) {
  const supabase = createClient();
  const [dealId, setDealId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!amount) { setError("Enter an amount."); return; }
    setSaving(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); setSaving(false); return; }
    const { error } = await supabase.from("payments").insert({
      user_id: user.id, deal_id: dealId || null, amount: Number(amount), expected_date: date || null,
    });
    setSaving(false);
    if (error) { setError(error.message); return; }
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div className="card w-full max-w-md p-6 fade-up" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h2 className="text-lg font-semibold mb-4">Add expected payment</h2>
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium block mb-1.5">Deal (optional)</span>
            <Select value={dealId} onChange={(e) => setDealId(e.target.value)}>
              <option value="">No linked deal</option>
              {deals.map((d) => <option key={d.id} value={d.id}>{d.brand}</option>)}
            </Select>
          </label>
          <label className="block">
            <span className="text-sm font-medium block mb-1.5">Amount ($)</span>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1500" autoFocus />
          </label>
          <label className="block">
            <span className="text-sm font-medium block mb-1.5">Expected date</span>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          {error && <p className="text-sm text-bad" role="alert">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={submit} disabled={saving}>{saving ? <Spinner /> : "Add payment"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
