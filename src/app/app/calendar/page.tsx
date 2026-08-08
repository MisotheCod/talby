"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn, formatMoney } from "@/lib/utils";
import { IconPlus, IconClose, IconCheck } from "@/components/icons";
import { Button, Input, Select, Spinner } from "@/components/ui";

type Content = {
  id: string; title: string; platform: string | null; post_type: string | null;
  status: string; event_date: string; linked_deal_id: string | null;
  caption: string | null;
};
type Deal = { id: string; brand: string };
type Payment = { id: string; amount: number; expected_date: string | null; status: string };

const FILTERS = ["All", "Posts", "Deliverables", "Payments"] as const;
const REPEAT = [
  { id: "", label: "Once" },
  { id: "weekly", label: "Weekly" },
  { id: "biweekly", label: "Every 2 weeks" },
  { id: "monthly", label: "Monthly" },
] as const;

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const supabase = createClient();
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const [content, setContent] = useState<Content[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [popover, setPopover] = useState<{ date: string; x: number; y: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [dragId, setDragId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const from = toISO(new Date(cursor.y, cursor.m, 1));
    const to = toISO(new Date(cursor.y, cursor.m + 1, 0));
    const [c, d, p] = await Promise.all([
      supabase.from("content").select("*").gte("event_date", from).lte("event_date", to),
      supabase.from("deals").select("id, brand"),
      supabase.from("payments").select("*").gte("expected_date", from).lte("expected_date", to),
    ]);
    setContent((c.data ?? []) as unknown as Content[]);
    setDeals((d.data ?? []) as unknown as Deal[]);
    setPayments((p.data ?? []) as unknown as Payment[]);
    setLoading(false);
  }, [supabase, cursor]);

  useEffect(() => { load(); }, [load]);

  const prevMonth = () => setCursor((c) => ({ y: c.m === 0 ? c.y - 1 : c.y, m: c.m === 0 ? 11 : c.m - 1 }));
  const nextMonth = () => setCursor((c) => ({ y: c.m === 11 ? c.y + 1 : c.y, m: c.m === 11 ? 0 : c.m + 1 }));

  const cells = useMemo(() => {
    const first = new Date(cursor.y, cursor.m, 1);
    const startOffset = first.getDay();
    const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
    const arr: (string | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(toISO(new Date(cursor.y, cursor.m, d)));
    return arr;
  }, [cursor]);

  const dayItems = (iso: string) => {
    const items: { type: "content" | "deliverable" | "payment"; id: string; title: string; color?: string }[] = [];
    const dayContent = content.filter((c) => c.event_date === iso);
    dayContent.forEach((c) => items.push({ type: c.status === "published" ? "deliverable" : "content", id: c.id, title: c.title }));
    const dayPays = payments.filter((p) => p.status !== "received" && p.expected_date === iso);
    dayPays.forEach((p) => items.push({ type: "payment", id: "pay" + p.id, title: formatMoney(p.amount) }));
    return items;
  };

  const showPopover = (e: React.MouseEvent, iso: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPopover({ date: iso, x: rect.left, y: rect.top });
  };

  return (
    <div className="space-y-5 fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Content</h1>
          <p className="text-muted text-sm mt-1">Plan posts and track deliverables by day.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={prevMonth}>‹ Prev</Button>
          <span className="font-semibold px-2 min-w-[130px] text-center">
            {MONTHS[cursor.m]} {cursor.y}
          </span>
          <Button variant="secondary" onClick={nextMonth}>Next ›</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn("px-3.5 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer border", filter === f ? "accent-soft border-accent/30 font-semibold" : "border-border bg-surface text-muted hover:text-foreground")}>
            {f}
          </button>
        ))}
      </div>

      {/* Month grid */}
      <div className="card overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border">
          {WEEKDAYS.map((d) => (
            <div key={d} className="px-2 py-2 text-xs font-medium text-muted text-center">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-[92px] md:auto-rows-[110px]">
          {cells.map((iso, idx) =>
            iso === null ? (
              <div key={`e${idx}`} className="border-r border-b border-border bg-subtle/40" />
            ) : (
              <div
                key={iso}
                className="border-r border-b border-border p-1.5 relative group cursor-pointer min-h-0"
                onClick={(e) => { if (!dragId) showPopover(e, iso); }}
              >
                <span className={cn("text-xs font-medium", iso === toISO(new Date()) ? "h-5 w-5 grid place-items-center rounded-full accent-fill text-xs" : "text-muted")}>
                  {Number(iso.slice(8))}
                </span>
                <div className="mt-1 space-y-0.5">
                  {dayItems(iso).slice(0, 2).map((it) => (
                    <div
                      key={it.id}
                      draggable
                      onDragStart={() => setDragId(it.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => { e.stopPropagation(); onDropToDay(iso, it.id); }}
                      className={cn(
                        "text-[11px] truncate rounded px-1 py-0.5",
                        it.type === "payment" ? "bg-warn/15 text-warn font-semibold" :
                        it.type === "content" ? "accent-soft" : "bg-ok/10 text-ok"
                      )}
                    >
                      {it.title}
                    </div>
                  ))}
                  {dayItems(iso).length > 2 && (
                    <span className="text-[11px] text-muted">+{dayItems(iso).length - 2} more</span>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {popover && (
        <AddEventPopover
          date={popover.date}
          deals={deals}
          onClose={() => setPopover(null)}
          onSaved={() => { setPopover(null); load(); }}
        />
      )}
    </div>
  );

  async function onDropToDay(targetDay: string, itemId: string) {
    setDragId(null);
    if (itemId.startsWith("pay")) return;
    await supabase.from("content").update({ event_date: targetDay }).eq("id", itemId);
    load();
  }
}

/* ---------------- Add event popover (inline, not a heavy modal) ---------------- */
function AddEventPopover({ date, deals, onClose, onSaved }: { date: string; deals: Deal[]; onClose: () => void; onSaved: () => void }) {
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [postType, setPostType] = useState("");
  const [dealId, setDealId] = useState("");
  const [showRepeat, setShowRepeat] = useState(false);
  const [repeat, setRepeat] = useState<string>("");
  const [repeatUntil, setRepeatUntil] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!title.trim()) { setError("Add a title."); return; }
    setSaving(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); setSaving(false); return; }
    const { error } = await supabase.from("content").insert({
      user_id: user.id, title: title.trim(), platform: platform || null,
      post_type: postType || null, event_date: date, linked_deal_id: dealId || null,
      repeat_type: repeat || null, repeat_until: repeatUntil || null,
    });
    setSaving(false);
    if (error) { setError(error.message); return; }
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose}>
      <div className="absolute left-4 right-4 sm:left-auto sm:right-6 top-20 sm:top-24 w-auto sm:w-96 bg-surface border border-border rounded-xl shadow-pop p-5 fade-up" onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">New post</h3>
          <button onClick={onClose} aria-label="Close" className="p-1 rounded-lg hover:bg-subtle cursor-pointer"><IconClose size={16} /></button>
        </div>
        <div className="space-y-3">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" autoFocus />
          <div className="grid grid-cols-2 gap-3">
            <Input value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="Platform" />
            <Input value={postType} onChange={(e) => setPostType(e.target.value)} placeholder="Post type" />
          </div>
          <Select value={dealId} onChange={(e) => setDealId(e.target.value)}>
            <option value="">No link, just a post</option>
            {deals.map((d) => <option key={d.id} value={d.id}>{d.brand}</option>)}
          </Select>

          {/* Inline repeat option */}
          <div className="border border-border rounded-lg p-3">
            <button
              type="button"
              onClick={() => setShowRepeat((s) => !s)}
              className="w-full flex items-center justify-between text-sm cursor-pointer"
            >
              <span className={cn("font-medium", repeat ? "accent-text" : "")}>{repeat ? `Repeats ${REPEAT.find((r) => r.id === repeat)?.label.toLowerCase()}` : "Repeat"}</span>
              <span className="text-muted">{showRepeat ? "Hide" : "Add"}</span>
            </button>
            {showRepeat && (
              <div className="mt-2 space-y-2">
                <div className="flex gap-1.5 flex-wrap">
                  {REPEAT.map((r) => (
                    <button key={r.id} type="button" onClick={() => setRepeat(r.id)} className={cn("px-2.5 h-7 rounded-md text-xs font-medium border cursor-pointer", repeat === r.id ? "accent-soft border-accent/30" : "border-border text-muted hover:text-foreground")}>
                      {r.label}
                    </button>
                  ))}
                </div>
                {repeat && (
                  <label className="flex items-center gap-2 text-xs text-muted">
                    Until
                    <Input type="date" value={repeatUntil} onChange={(e) => setRepeatUntil(e.target.value)} className="h-8" />
                  </label>
                )}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-bad" role="alert">{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={submit} disabled={saving}>{saving ? <Spinner /> : <IconPlus size={16} />} Add</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
