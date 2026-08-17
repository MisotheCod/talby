"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn, formatMoney } from "@/lib/utils";
import { IconPlus, IconClose, IconCheck, IconDelete } from "@/components/icons";
import { Button, Input, Select, Spinner, Textarea } from "@/components/ui";

type Content = {
  id: string; title: string; platform: string | null; post_type: string | null;
  status: string; event_date: string; linked_deal_id: string | null;
  caption: string | null; scheduled_time: string | null;
};
type Deal = { id: string; brand: string; value: number | null };
type Payment = { id: string; amount: number; expected_date: string | null; status: string; deal?: { brand: string } | null };
type Todo = { id: string; title: string; done: boolean; due_date: string | null };
type CalendarNote = { id: string; body: string; event_date: string; updated_at: string };

const FILTERS = ["All", "Posts", "Deliverables", "Payments"] as const;

const PLATFORMS = [
  "TikTok", "Instagram", "YouTube", "YouTube Shorts", "Twitch",
  "X", "Facebook", "LinkedIn", "Pinterest", "Snapchat", "Threads",
  "Blog", "Newsletter", "Podcast", "Other",
];
const POST_TYPES = [
  "Reel", "Story", "Post", "Photo", "Carousel", "Video", "Short",
  "Long-form", "Live", "Thread", "Article", "Podcast episode",
  "Newsletter issue", "Pinned", "Other",
];

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
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarPage() {
  const supabase = createClient();
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const [content, setContent] = useState<Content[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notes, setNotes] = useState<CalendarNote[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [popover, setPopover] = useState<{ date: string; x: number; y: number } | null>(null);
  const [selected, setSelected] = useState<{ itemId: string; type: "content" | "deliverable" | "payment" | "todo" | "note"; x: number; y: number; date: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dayHighlight, setDayHighlight] = useState<string | null>(() => toISO(new Date()));

  const selectedContent = useMemo(() => {
    if (!selected || selected.type === "payment") return null;
    const c = content.find((x) => x.id === selected.itemId);
    if (!c) return null;
    // also fetch the full row (captions/notes may exist beyond the select)
    return c;
  }, [selected, content]);
  const selectedPayment = useMemo(() => {
    if (!selected || selected.type !== "payment") return null;
    return payments.find((p) => "pay" + p.id === selected.itemId) ?? null;
  }, [selected, payments]);
  const selectedTodo = useMemo(() => {
    if (!selected || selected.type !== "todo") return null;
    return todos.find((t) => "todo" + t.id === selected.itemId) ?? null;
  }, [selected, todos]);
  const selectedNote = useMemo(() => {
    if (!selected || selected.type !== "note") return null;
    return notes.find((n) => "note" + n.id === selected.itemId) ?? null;
  }, [selected, notes]);

  const load = useCallback(async () => {
    const from = toISO(new Date(cursor.y, cursor.m, 1));
    const to = toISO(new Date(cursor.y, cursor.m + 1, 0));
    const [c, d, p, t, n] = await Promise.all([
      supabase.from("content").select("*").gte("event_date", from).lte("event_date", to),
      supabase.from("deals").select("id, brand, value"),
      supabase.from("payments").select("*, deal:deals(brand)").gte("expected_date", from).lte("expected_date", to),
      supabase.from("todos").select("*").not("due_date", "is", null).gte("due_date", from).lte("due_date", to),
      supabase.from("notes").select("id, body, event_date, updated_at").not("event_date", "is", null).gte("event_date", from).lte("event_date", to),
    ]);
    setContent((c.data ?? []) as unknown as Content[]);
    setDeals((d.data ?? []) as unknown as Deal[]);
    setPayments((p.data ?? []) as unknown as Payment[]);
    setTodos((t.data ?? []) as unknown as Todo[]);
    setNotes((n.data ?? []) as unknown as CalendarNote[]);
    setLoading(false);
  }, [supabase, cursor]);

  useEffect(() => { load(); }, [load]);

  const prevMonth = () => setCursor((c) => ({ y: c.m === 0 ? c.y - 1 : c.y, m: c.m === 0 ? 11 : c.m - 1 }));
  const nextMonth = () => setCursor((c) => ({ y: c.m === 11 ? c.y + 1 : c.y, m: c.m === 11 ? 0 : c.m + 1 }));
  const goToday = () => { const d = new Date(); setCursor({ y: d.getFullYear(), m: d.getMonth() }); };
  const openDay = (date = toISO(new Date())) => setPopover({ date, x: 0, y: 0 });

  const monthRange = useMemo(() => {
    const first = `${MONTHS[cursor.m].slice(0, 3)} ${String(cursor.m + 1).padStart(2, "0")}-01, ${cursor.y}`;
    const lastDay = new Date(cursor.y, cursor.m + 1, 0).getDate();
    const last = `${MONTHS[cursor.m].slice(0, 3)} ${String(cursor.m + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}, ${cursor.y}`;
    return { first, last };
  }, [cursor]);

  const cells = useMemo(() => {
    const first = new Date(cursor.y, cursor.m, 1);
    const startOffset = (first.getDay() + 6) % 7; // Monday-first
    const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
    const arr: (string | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(toISO(new Date(cursor.y, cursor.m, d)));
    return arr;
  }, [cursor]);

  const dayItems = (iso: string) => {
    const items: { type: "content" | "deliverable" | "payment" | "todo" | "note"; id: string; title: string; label: string; time?: string; color?: string }[] = [];
    const dayContent = content.filter((c) => c.event_date === iso);
    dayContent.forEach((c) => {
      const deliv = c.status === "published";
      // For a content item linked to a deal, surface the deal value on the pill
      // (e.g. "Haleon · $10,550") so the calendar shows what it's worth.
      const deal = c.linked_deal_id ? deals.find((d) => d.id === c.linked_deal_id) : undefined;
      const worth = deal?.value ? ` · ${formatMoney(deal.value)}` : "";
      items.push({ type: deliv ? "deliverable" : "content", id: c.id, title: `${c.title}${worth}`, label: deliv ? "DUE" : "DEAL", time: c.scheduled_time?.slice(0, 5) || undefined });
    });
    const dayPays = payments.filter((p) => p.status !== "received" && p.expected_date === iso);
    dayPays.forEach((p) => items.push({ type: "payment", id: "pay" + p.id, title: p.deal?.brand ? `${p.deal.brand} · ${formatMoney(p.amount)}` : formatMoney(p.amount), label: "PAYMENT" }));
    const dayTodos = todos.filter((t) => !t.done && t.due_date === iso);
    dayTodos.forEach((t) => items.push({ type: "todo", id: "todo" + t.id, title: t.title, label: "TODO" }));
    const dayNotes = notes.filter((n) => n.event_date === iso);
    dayNotes.forEach((n) => items.push({ type: "note", id: "note" + n.id, title: n.body, label: "NOTE" }));
    return items;
  };

  const showPopover = (e: React.MouseEvent, iso: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDayHighlight(iso);
    setPopover({ date: iso, x: rect.left, y: rect.top });
  };

  return (
    <div className="space-y-5 fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Content</h1>
          <p className="text-muted text-sm mt-1">Plan posts and track deliverables by day.</p>
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
        {/* Month panel header */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold leading-tight">{MONTHS[cursor.m]} {cursor.y}</h2>
            <p className="text-xs text-muted mt-0.5">{monthRange.first} to {monthRange.last}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={goToday} className="h-9">Today</Button>
            <div className="flex items-center gap-0.5 border border-border rounded-lg overflow-hidden">
              <button onClick={prevMonth} aria-label="Previous month" className="h-9 px-2.5 text-muted hover:text-foreground hover:bg-subtle cursor-pointer">‹</button>
              <button onClick={nextMonth} aria-label="Next month" className="h-9 px-2.5 text-muted hover:text-foreground hover:bg-subtle cursor-pointer">›</button>
            </div>
            <Button onClick={() => openDay()} className="h-9"><IconPlus size={16} /> Add event</Button>
          </div>
        </div>
        <div className="grid grid-cols-7 border-b border-border">
          {WEEKDAYS.map((d) => (
            <div key={d} className="px-2 py-2 text-xs font-medium text-muted text-center">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-[104px] md:auto-rows-[124px]">
          {cells.map((iso, idx) =>
            iso === null ? (
              <div key={`e${idx}`} className="border-r border-b border-border bg-subtle/40" />
            ) : (
              <div
                key={iso}
                className={cn("border-r border-b border-border p-1.5 relative group cursor-pointer min-h-0", dayHighlight === iso && "bg-subtle/60")}
                onClick={(e) => { if (!dragId) showPopover(e, iso); }}
              >
                <span className={cn("inline-grid place-items-center rounded-full text-xs", iso === toISO(new Date()) ? "h-5 min-w-5 px-1 accent-fill font-semibold" : dayHighlight === iso ? "h-5 min-w-5 px-1 font-semibold ring-1 ring-[var(--accent)] text-accentink" : "text-muted h-5 w-5")}>
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
                      onClick={(e) => {
                        if (dragId) return;
                        e.stopPropagation();
                        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        setSelected({ itemId: it.id, type: it.type, x: r.left, y: r.bottom + 6, date: iso });
                      }}
                      className={cn(
                        "text-[11px] flex items-center gap-1 rounded-full px-2 py-0.5 cursor-pointer",
                        it.type === "payment" ? "pill-due font-semibold" :
                        it.type === "todo" ? "pill-purple" :
                        it.type === "note" ? "pill-note" :
                        it.type === "content" ? "accent-soft" : "pill-paid font-semibold"
                      )}
                    >
                      <span className={cn("shrink-0 text-[9px] font-bold uppercase tracking-wide", it.type === "payment" ? "text-warn/70" : it.type === "note" ? "text-inkfaint" : "opacity-70")}>{it.label}</span>
                      <span className={cn("truncate", it.type === "content" && "font-semibold")}>{it.title}</span>
                      {it.time && <span className="shrink-0 ml-auto text-[10px] tabular-nums font-medium opacity-70">{it.time}</span>}
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

      {selected && selectedContent && (
        <ContentDetailPopover
          item={selectedContent}
          deals={deals}
          position={{ x: selected.x, y: selected.y }}
          onClose={() => setSelected(null)}
          onSaved={() => { setSelected(null); load(); }}
        />
      )}
      {selected && selectedPayment && (
        <PaymentDetailPopover
          payment={selectedPayment}
          position={{ x: selected.x, y: selected.y }}
          onClose={() => setSelected(null)}
          onSaved={() => { setSelected(null); load(); }}
        />
      )}
      {selected && selectedTodo && (
        <TodoDetailPopover
          todo={selectedTodo}
          position={{ x: selected.x, y: selected.y }}
          onClose={() => setSelected(null)}
          onSaved={() => { setSelected(null); load(); }}
        />
      )}
      {selected && selectedNote && (
        <NoteDetailPopover
          note={selectedNote}
          position={{ x: selected.x, y: selected.y }}
          onClose={() => setSelected(null)}
          onSaved={() => { setSelected(null); load(); }}
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
  const [kind, setKind] = useState<"post" | "note">("post");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [platform, setPlatform] = useState("");
  const [postType, setPostType] = useState("");
  const [dealId, setDealId] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [showRepeat, setShowRepeat] = useState(false);
  const [repeat, setRepeat] = useState<string>("");
  const [repeatUntil, setRepeatUntil] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setSaving(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); setSaving(false); return; }
    if (kind === "note") {
      if (!note.trim()) { setError("Write a note."); setSaving(false); return; }
      const { error } = await supabase.from("notes").insert({ user_id: user.id, body: note.trim(), event_date: date });
      setSaving(false);
      if (error) { setError(error.message); return; }
      onSaved(); return;
    }
    if (!title.trim()) { setError("Add a title."); setSaving(false); return; }
    const { error } = await supabase.from("content").insert({
      user_id: user.id, title: title.trim(), platform: platform || null,
      post_type: postType || null, event_date: date, linked_deal_id: dealId || null,
      scheduled_time: scheduledTime || null,
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
          <h3 className="font-semibold">{kind === "note" ? "New note" : "New post"}</h3>
          <button onClick={onClose} aria-label="Close" className="p-1 rounded-lg hover:bg-subtle cursor-pointer"><IconClose size={16} /></button>
        </div>
        <div className="flex gap-1.5 mb-4">
          <button type="button" onClick={() => setKind("post")} className={cn("px-3 h-8 rounded-lg text-sm font-medium cursor-pointer border", kind === "post" ? "accent-soft border-accent/30" : "border-border text-muted hover:text-foreground")}>Post</button>
          <button type="button" onClick={() => setKind("note")} className={cn("px-3 h-8 rounded-lg text-sm font-medium cursor-pointer border", kind === "note" ? "accent-soft border-accent/30" : "border-border text-muted hover:text-foreground")}>Note</button>
        </div>
        <div className="space-y-3">
          {kind === "note" ? (
            <>
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }} rows={3} placeholder="Write a note for this day…" autoFocus />
            </>
          ) : (
          <>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submit(); } }} placeholder="Post title" autoFocus />
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-muted mb-1 block">Platform</span>
              <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option value="">Choose platform</option>
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </Select>
            </label>
            <label className="block">
              <span className="text-xs text-muted mb-1 block">Post type</span>
              <Select value={postType} onChange={(e) => setPostType(e.target.value)}>
                <option value="">Choose post type</option>
                {POST_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </label>
          </div>
          <label className="block">
            <span className="text-xs text-muted mb-1 block">Connected deal</span>
            <Select value={dealId} onChange={(e) => setDealId(e.target.value)}>
              <option value="">No link, just a post</option>
              {deals.map((d) => <option key={d.id} value={d.id}>{d.brand}</option>)}
            </Select>
            <span className="text-[11px] text-muted mt-1 block">Optional: attach this post to one of your deals.</span>
          </label>

          <label className="block">
            <span className="text-xs text-muted mb-1 block">Time</span>
            <Input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
            <span className="text-[11px] text-muted mt-1 block">Optional: set a time of day to show on the calendar.</span>
          </label>

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
          </>
          )}
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

/* ---------------- Mini detail/edit modals (anchored next to the clicked item) ---------------- */
function MiniModal({ position, onClose, title, children }: {
  position: { x: number; y: number };
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const x = Math.min(position.x, window.innerWidth - 340);
  const y = Math.min(position.y, window.innerHeight - 200);
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 w-[330px] bg-card border border-line rounded-xl shadow-lg p-4 fade-up"
        style={{ left: Math.max(8, x), top: Math.max(8, y) }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-[15px]">{title}</h4>
          <button onClick={onClose} aria-label="Close" className="p-1 rounded-lg hover:bg-soft cursor-pointer"><IconClose size={16} /></button>
        </div>
        {children}
      </div>
    </>
  );
}

/* Content (post) — view + edit + delete */
function ContentDetailPopover({ item, deals, position, onClose, onSaved }: {
  item: Content; deals: Deal[]; position: { x: number; y: number }; onClose: () => void; onSaved: () => void;
}) {
  const supabase = createClient();
  const [title, setTitle] = useState(item.title);
  const [platform, setPlatform] = useState(item.platform ?? "");
  const [postType, setPostType] = useState(item.post_type ?? "");
  const [dealId, setDealId] = useState(item.linked_deal_id ?? "");
  const [scheduledTime, setScheduledTime] = useState(item.scheduled_time ?? "");
  const [caption, setCaption] = useState(item.caption ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    if (!title.trim()) { setError("Add a title."); return; }
    setSaving(true); setError("");
    const { error } = await supabase.from("content").update({
      title: title.trim(), platform: platform || null, post_type: postType || null,
      linked_deal_id: dealId || null, scheduled_time: scheduledTime || null, caption: caption || null,
    }).eq("id", item.id);
    setSaving(false);
    if (error) { setError(error.message); return; }
    onSaved();
  };

  const remove = async () => {
    await supabase.from("content").delete().eq("id", item.id);
    onSaved();
  };

  return (
    <MiniModal position={position} onClose={onClose} title="Post details">
      <div className="space-y-3">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs text-muted mb-1 block">Platform</span>
            <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <option value="">Choose platform</option>
              {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
            </Select>
          </label>
          <label className="block">
            <span className="text-xs text-muted mb-1 block">Post type</span>
            <Select value={postType} onChange={(e) => setPostType(e.target.value)}>
              <option value="">Choose post type</option>
              {POST_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
          </label>
        </div>
        <Select value={dealId} onChange={(e) => setDealId(e.target.value)}>
          <option value="">No linked deal</option>
          {deals.map((d) => <option key={d.id} value={d.id}>{d.brand}</option>)}
        </Select>
        <label className="block">
          <span className="text-xs text-muted mb-1 block">Time</span>
          <Input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-xs text-muted mb-1 block">Caption / notes</span>
          <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={2} placeholder="Optional caption or notes…" />
        </label>
        {error && <p className="text-sm text-bad" role="alert">{error}</p>}
        <div className="flex items-center justify-between pt-1">
          <Button variant="ghost" onClick={remove} className="text-bad"><IconDelete size={15} /> Delete</Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? <Spinner /> : <IconCheck size={15} />} Save</Button>
          </div>
        </div>
      </div>
    </MiniModal>
  );
}

/* Payment — view + mark received */
function PaymentDetailPopover({ payment, position, onClose, onSaved }: {
  payment: Payment; position: { x: number; y: number }; onClose: () => void; onSaved: () => void;
}) {
  const supabase = createClient();
  const [saving, setSaving] = useState(false);

  const markReceived = async () => {
    setSaving(true);
    await supabase.from("payments").update({ status: "received" }).eq("id", payment.id);
    setSaving(false);
    onSaved();
  };

  return (
    <MiniModal position={position} onClose={onClose} title="Payment">
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold font-mono">{formatMoney(payment.amount)}</span>
          <span className="text-xs text-warn font-semibold">{payment.status === "received" ? "Received" : "Expected"}</span>
        </div>
        <p className="text-sm text-muted">Due {payment.expected_date ?? "no date set"}</p>
        {payment.status !== "received" && (
          <Button onClick={markReceived} disabled={saving} className="w-full">{saving ? <Spinner /> : <IconCheck size={15} />} Mark received</Button>
        )}
      </div>
    </MiniModal>
  );
}

/* To-do — view + mark done + reschedule */
function TodoDetailPopover({ todo, position, onClose, onSaved }: {
  todo: Todo; position: { x: number; y: number }; onClose: () => void; onSaved: () => void;
}) {
  const supabase = createClient();
  const [due, setDue] = useState(todo.due_date ?? "");
  const [saving, setSaving] = useState(false);

  const markDone = async () => {
    setSaving(true);
    await supabase.from("todos").update({ done: true }).eq("id", todo.id);
    setSaving(false);
    onSaved();
  };

  const reschedule = async () => {
    setSaving(true);
    await supabase.from("todos").update({ due_date: due || null }).eq("id", todo.id);
    setSaving(false);
    onSaved();
  };

  return (
    <MiniModal position={position} onClose={onClose} title="To-do">
      <div className="space-y-3">
        <p className="text-sm font-medium">{todo.title}</p>
        <label className="block">
          <span className="text-xs text-muted mb-1 block">Due date</span>
          <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        </label>
        <div className="flex flex-col gap-2 pt-1">
          {todo.due_date && (
            <Button variant="secondary" onClick={markDone} disabled={saving} className="w-full"><IconCheck size={15} /> Mark done</Button>
          )}
          <Button onClick={reschedule} disabled={saving} className="w-full">{saving ? <Spinner /> : "Save date"}</Button>
        </div>
      </div>
    </MiniModal>
  );
}

/* Note — view + edit + delete */
function NoteDetailPopover({ note, position, onClose, onSaved }: {
  note: CalendarNote; position: { x: number; y: number }; onClose: () => void; onSaved: () => void;
}) {
  const supabase = createClient();
  const [body, setBody] = useState(note.body);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true); setError("");
    const { error } = await supabase.from("notes").update({ body }).eq("id", note.id);
    setSaving(false);
    if (error) { setError(error.message); return; }
    onSaved();
  };

  const remove = async () => {
    await supabase.from("notes").delete().eq("id", note.id);
    onSaved();
  };

  return (
    <MiniModal position={position} onClose={onClose} title="Note">
      <div className="space-y-3">
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="Write a note…" />
        {error && <p className="text-sm text-bad" role="alert">{error}</p>}
        <div className="flex items-center justify-between pt-1">
          <Button variant="ghost" onClick={remove} className="text-bad"><IconDelete size={15} /> Delete</Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? <Spinner /> : <IconCheck size={15} />} Save</Button>
          </div>
        </div>
      </div>
    </MiniModal>
  );
}
