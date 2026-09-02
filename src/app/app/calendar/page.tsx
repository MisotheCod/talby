"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn, formatMoney } from "@/lib/utils";
import { useIsMobile } from "@/lib/use-is-mobile";
import { IconPlus, IconClose, IconCheck, IconDelete } from "@/components/icons";
import { Button, Input, Select, Spinner, Textarea, Pill, Segmented } from "@/components/ui";

type Content = {
  id: string; title: string; platform: string | null; post_type: string | null;
  status: string; event_date: string; linked_deal_id: string | null;
  caption: string | null; scheduled_time: string | null;
  repeat_type: string | null;
};
type Deal = { id: string; brand: string; value: number | null };
type Payment = { id: string; amount: number; expected_date: string | null; status: string; deal?: { brand: string } | null };
type Todo = { id: string; title: string; done: boolean; due_date: string | null };
type CalendarNote = { id: string; body: string; event_date: string; updated_at: string; done: boolean; details: string | null };

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
// Mobile weekday headers degrade to single letters — full names clip at 375px.
const MOBILE_WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
// One dot per event TYPE present that day (not one per event). Colors match the
// existing type colors: post is blue (accent), payment is green, deliverable red.
const MOBILE_DOT_COLORS: Record<string, string> = {
  post: "var(--accent)",
  pay: "var(--paid)",
  due: "var(--late)",
};

// Map a content item to its mobile event type: delivered/published posts are the
// deliverable DUE; everything else scheduled is a POST.
function contentType(c: Content): "post" | "due" {
  return c.status === "published" ? "due" : "post";
}

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
  const [dayReveal, setDayReveal] = useState<{ iso: string; x: number; y: number } | null>(null);
  // Mobile-only: the day whose events are shown in the bottom sheet.
  const [sheetDay, setSheetDay] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState<{ itemId: string; type: "content" | "deliverable" | "payment" | "todo" | "note"; x: number; y: number; date: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragType, setDragType] = useState<"content" | "deliverable" | "payment" | "todo" | "note" | null>(null);
  const [dragOrigin, setDragOrigin] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [dayHighlight, setDayHighlight] = useState<string | null>(() => toISO(new Date()));
  const clickLock = useRef(false); // suppress click immediately after a drag drop

  // --- Pointer-based drag (unified mouse + touch, since HTML5 draggable is mouse-only) ---
  // Long-press on touch, threshold-movement on mouse to distinguish scroll vs grab.
  const dragRef = useRef<{
    id: string; type: "content" | "deliverable" | "payment" | "todo" | "note";
    origin: string; startX: number; startY: number; pointerId: number;
    engaged: boolean; timerId: number | null; lastDay: string | null;
  } | null>(null);

  const engageDrag = (id: string, type: "content" | "deliverable" | "payment" | "todo" | "note", origin: string) => {
    if (!dragRef.current || dragRef.current.engaged) return;
    dragRef.current.engaged = true;
    clickLock.current = true;
    setDragId(id); setDragType(type); setDragOrigin(origin);
  };

  const endDrag = () => {
    dragRef.current = null;
    setDropTarget(null); setDragId(null); setDragType(null); setDragOrigin(null);
    setTimeout(() => { clickLock.current = false; }, 80);
  };

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
      supabase.from("notes").select("id, body, event_date, updated_at, done, details").not("event_date", "is", null).gte("event_date", from).lte("event_date", to),
    ]);
    setContent((c.data ?? []) as unknown as Content[]);
    setDeals((d.data ?? []) as unknown as Deal[]);
    setPayments((p.data ?? []) as unknown as Payment[]);
    setTodos((t.data ?? []) as unknown as Todo[]);
    setNotes((n.data ?? []) as unknown as CalendarNote[]);
    setLoading(false);
  }, [supabase, cursor]);

  useEffect(() => { load(); }, [load]);

  // Dismiss the "+N more" day reveal with Escape.
  useEffect(() => {
    if (!dayReveal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDayReveal(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dayReveal]);

  const prevMonth = () => setCursor((c) => ({ y: c.m === 0 ? c.y - 1 : c.y, m: c.m === 0 ? 11 : c.m - 1 }));
  const nextMonth = () => setCursor((c) => ({ y: c.m === 11 ? c.y + 1 : c.y, m: c.m === 11 ? 0 : c.m + 1 }));
  const goToday = () => { const d = new Date(); setCursor({ y: d.getFullYear(), m: d.getMonth() }); };
  const openDay = (date = toISO(new Date())) => setPopover({ date, x: 0, y: 0 });

  const monthRange = useMemo(() => {
    const lastDay = new Date(cursor.y, cursor.m + 1, 0).getDate();
    const month = MONTHS[cursor.m];
    return { first: `1 to ${lastDay} ${month} ${cursor.y}` };
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
    const items: { type: "content" | "deliverable" | "payment" | "todo" | "note"; id: string; title: string; label: string; time?: string; color?: string; done?: boolean }[] = [];
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
    // Todos (both pending and done — done ones stay visible, struck+dimmed)
    const dayTodos = todos.filter((t) => t.due_date === iso);
    dayTodos.forEach((t) => items.push({ type: "todo", id: "todo" + t.id, title: t.title, label: "TODO", done: t.done }));
    // Notes (done ones stay visible, struck+dimmed)
    const dayNotes = notes.filter((n) => n.event_date === iso);
    dayNotes.forEach((n) => items.push({ type: "note", id: "note" + n.id, title: n.body, label: "NOTE", done: n.done }));
    return items;
  };

  // Distinct event TYPES present on a day (mobile dots: one per type, not per event).
  const dayDotTypes = (iso: string): ("post" | "pay" | "due")[] => {
    const types = new Set<"post" | "pay" | "due">();
    content.filter((c) => c.event_date === iso).forEach((c) => types.add(contentType(c)));
    payments.filter((p) => p.status !== "received" && p.expected_date === iso).forEach(() => types.add("pay"));
    // Deliverable DUE from content is already covered above; order post→pay→due.
    return (["post", "pay", "due"] as const).filter((t) => types.has(t));
  };

  const sheetItems = sheetDay ? dayItems(sheetDay) : [];
  const sheetRow = (it: (typeof sheetItems)[number]): MobileSheetRow => {
    // Normalize to the three mobile labels now: POST / PAY / DUE.
    const type = it.type === "payment" ? "pay" : it.type === "deliverable" ? "due" : "post";
    const withAmount = it.title.includes(" · ");
    const [name, amount, bare] = withAmount
      ? [it.title.slice(0, it.title.indexOf(" · ")), it.title.slice(it.title.indexOf(" · ") + 3), false]
      : /^\$\d/.test(it.title)
        ? ["", it.title, true]
        : [it.title, undefined, false];
    return { id: it.id, label: type === "pay" ? "PAY" : type === "due" ? "DUE" : "POST", origType: it.type, color: MOBILE_DOT_COLORS[type], name: name || (bare ? undefined : it.title), amount, done: it.done };
  };

  const showMobileSheet = (iso: string) => {
    setDayHighlight(iso);
    setSheetDay(iso);
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
      <div className="flex gap-2 flex-wrap items-center">
        <Segmented options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      {/* Month grid */}
      <div className="card overflow-hidden">
        {/* Month panel header */}
        {isMobile ? (
          <div className="px-4 py-3">
            <h2 className="text-lg font-semibold leading-tight">{MONTHS[cursor.m]} {cursor.y}</h2>
            <div className="flex items-center gap-2 mt-2.5">
              <Button variant="secondary" onClick={goToday} className="h-9 text-[13px]">Today</Button>
              <div className="flex items-center gap-0.5 border border-line rounded-lg overflow-hidden">
                <button onClick={prevMonth} aria-label="Previous month" className="h-9 px-2.5 text-muted hover:text-foreground hover:bg-card2 cursor-pointer">‹</button>
                <button onClick={nextMonth} aria-label="Next month" className="h-9 px-2.5 text-muted hover:text-foreground hover:bg-card2 cursor-pointer">›</button>
              </div>
              <Button onClick={() => openDay()} className="h-9 ml-auto text-[13px]"><IconPlus size={15} /> Add</Button>
            </div>
          </div>
        ) : (
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold leading-tight">{MONTHS[cursor.m]} {cursor.y}</h2>
            <p className="text-xs text-muted mt-0.5 whitespace-nowrap">{monthRange.first}</p>
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
        )}
        <div className="grid grid-cols-7 border-b border-border">
          {(isMobile ? MOBILE_WEEKDAYS : WEEKDAYS).map((d) => (
            <div key={d} className="px-2 py-2 text-xs font-medium text-muted text-center">{d}</div>
          ))}
        </div>
        {isMobile ? (
          <div className="cal-grid-mobile grid grid-cols-7">
            {cells.map((iso, idx) => {
              if (iso === null) return <div key={`e${idx}`} className="border-r border-b border-line" />;
              const dots = dayDotTypes(iso);
              const today = iso === toISO(new Date());
              return (
                <div
                  key={iso}
                  data-day={iso}
                  className={cn(
                    "cal-cell-mobile border-r border-b border-line flex flex-col items-center justify-center min-h-0 px-0.5",
                    dots.length > 0 && "cursor-pointer",
                    dayHighlight === iso && "bg-subtle/60"
                  )}
                  onClick={dots.length > 0 ? (e) => { e.stopPropagation(); showMobileSheet(iso); } : undefined}
                  role={dots.length > 0 ? "button" : undefined}
                  aria-label={dots.length > 0 ? `Open ${MONTHS[cursor.m]} ${Number(iso.slice(8))}` : undefined}
                >
                  <span className={cn(
                    "inline-grid place-items-center rounded-full text-xs",
                    today ? "h-5 min-w-5 px-1 accent-fill font-semibold" : dayHighlight === iso ? "h-5 min-w-5 px-1 font-semibold ring-1 ring-[var(--accent)] text-accentink" : "text-muted h-5 w-5"
                  )}>
                    {Number(iso.slice(8))}
                  </span>
                  <div className="h-3.5 mt-0.5 flex items-end gap-[3px]">
                    {dots.map((t) => (
                      <span key={t} className="cal-dot" style={{ background: MOBILE_DOT_COLORS[t] }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
        <div className="calendar-grid grid grid-cols-7 auto-rows-[104px] md:auto-rows-[124px]">
          {cells.map((iso, idx) =>
            iso === null ? (
              <div key={`e${idx}`} className="border-r border-b border-border bg-subtle/40" />
            ) : (
              <div
                key={iso}
                                data-day={iso}
                                className={cn("border-r border-b border-border p-1.5 relative group cursor-pointer min-h-0", dayHighlight === iso && !dropTarget && "bg-subtle/60", dropTarget === iso && "bg-subtle/80 ring-2 ring-inset ring-[var(--accent)]")}
                                onClick={(e) => { if (!dragId && !clickLock.current) showPopover(e, iso); }}
              >
                <span className={cn("inline-grid place-items-center rounded-full text-xs", iso === toISO(new Date()) ? "h-5 min-w-5 px-1 accent-fill font-semibold" : dayHighlight === iso ? "h-5 min-w-5 px-1 font-semibold ring-1 ring-[var(--accent)] text-accentink" : "text-muted h-5 w-5")}>
                  {Number(iso.slice(8))}
                </span>
                <div className="mt-1 space-y-0.5 px-1">
                  {dayItems(iso).slice(0, 2).map((it) => {
                    const activeId = it.id.replace(/^(pay|todo|note)/, "");
                    const isDragging = dragId === activeId;
                    const canDrag = it.type !== "payment";
                    return (
                      <div
                        key={it.id}
                        onPointerDown={(e) => {
                          // Payments are not draggable; ignore the grab to keep touch scroll
                          if (!canDrag) return;
                          const sel = window.getSelection?.();
                          sel?.removeAllRanges();
                          // Cancel any prior long-press state
                          if (dragRef.current?.timerId) { window.clearTimeout(dragRef.current.timerId); dragRef.current.timerId = null; }
                          dragRef.current = {
                            id: activeId, type: it.type, origin: iso,
                            startX: e.clientX, startY: e.clientY, pointerId: e.pointerId,
                            engaged: false, timerId: null, lastDay: null,
                          };
                          try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* non-fatal */ }
                          // Touch: long-press (~260ms) engages drag, so scrolling the page
                          // still works unless the user deliberately holds. Mouse engages
                          // on first move (below).
                          if (e.pointerType === "touch") {
                            dragRef.current.timerId = window.setTimeout(() => {
                              if (dragRef.current && !dragRef.current.engaged) engageDrag(activeId, it.type, iso);
                            }, 260);
                          }
                        }}
                        onPointerMove={(e) => {
                          const d = dragRef.current;
                          if (!d || d.pointerId !== e.pointerId) return;
                          const dx = e.clientX - d.startX;
                          const dy = e.clientY - d.startY;
                          // Cancel long-press if the finger moves a lot first (a scroll).
                          if (!d.engaged && e.pointerType === "touch" && Math.hypot(dx, dy) > 10) {
                            if (d.timerId) window.clearTimeout(d.timerId);
                            dragRef.current = null;
                            return;
                          }
                          // Mouse engages after a small movement threshold so click still works.
                          if (!d.engaged && e.pointerType !== "touch" && Math.hypot(dx, dy) > 4) {
                            engageDrag(d.id, d.type, d.origin);
                          }
                          if (d.engaged) {
                            e.preventDefault();
                            // Highlight the day cell currently under the pointer.
                            const el = document.elementFromPoint(e.clientX, e.clientY);
                            const cell = el?.closest?.("[data-day]") as HTMLElement | null;
                            const day = cell?.dataset.day ?? null;
                            d.lastDay = day;
                            setDropTarget(day);
                          }
                        }}
                        onPointerUp={(e) => {
                          const d = dragRef.current;
                          if (!d || d.pointerId !== e.pointerId) return;
                          if (d.timerId) window.clearTimeout(d.timerId);
                          if (d.engaged) {
                            // Prefer the last day we highlighted; fall back to a fresh
                            // elementFromPoint on release.
                            let day = d.lastDay;
                            if (!day) {
                              const el = document.elementFromPoint(e.clientX, e.clientY);
                              const cell = el?.closest?.("[data-day]") as HTMLElement | null;
                              day = cell?.dataset.day ?? null;
                            }
                            if (day) onDropToDay(day, d.id, d.type);
                            else endDrag();
                          }
                          dragRef.current = null;
                          setTimeout(() => { clickLock.current = false; }, 80);
                        }}
                        onPointerCancel={(e) => {
                          const d = dragRef.current;
                          if (d && d.pointerId === e.pointerId) endDrag();
                        }}
                        onClick={(e) => {
                          if (dragId || clickLock.current) return;
                          e.stopPropagation();
                          const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                          setSelected({ itemId: it.id, type: it.type, x: r.left, y: r.bottom + 6, date: iso });
                        }}
                        style={{ touchAction: canDrag ? "none" : "auto" }}
                        className={cn(
                          "calpill text-[11px] flex items-center gap-1 rounded-full px-2 py-0.5 cursor-grab select-none",
                          it.type === "payment" ? "pill-due font-semibold cursor-pointer" :
                          it.type === "todo" ? "pill-purple" :
                          it.type === "note" ? "pill-note" :
                          it.type === "content" ? "pill-accent" : "pill-paid font-semibold",
                          it.done && "tpill-done",
                          isDragging && "opacity-40 ring-2 ring-inset ring-[var(--accent)]",
                          dragId && !isDragging && "opacity-60"
                        )}
                      >
                        {it.done && (
                          <svg className="pill-check" viewBox="0 0 20 20" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M16.5 5 7.5 14 3.5 10" />
                          </svg>
                        )}
                        <span className={cn("shrink-0 text-[9px] font-bold uppercase tracking-wide opacity-60")}>{it.label}</span>
                        <span className={cn("truncate", it.type === "content" && "font-semibold", it.done && "pill-done-title")}>{it.title}</span>
                        {it.time && <span className="shrink-0 ml-auto text-[10px] tabular-nums font-medium opacity-70">{it.time}</span>}
                      </div>
                    );
                                        })}
                                      {dayItems(iso).length > 2 && (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation(); // never trigger the day cell's add flow
                                            const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                            setDayReveal({ iso, x: r.left, y: r.bottom + 6 });
                                          }}
                                          className="block w-full text-left cursor-pointer"
                                          aria-expanded={dayReveal?.iso === iso}
                                        >
                                          <Pill size="sm" source="var(--ink-soft)" className="px-2 py-0.5">+{dayItems(iso).length - 2} more</Pill>
                                        </button>
                                      )}
                </div>
              </div>
            )
          )}
        </div>
        )}
      </div>

      {popover && (
        <AddEventPopover
          date={popover.date}
          deals={deals}
          onClose={() => setPopover(null)}
          onSaved={() => { setPopover(null); load(); }}
        />
      )}

      {sheetDay && isMobile && (
        <MobileDaySheet
          iso={sheetDay}
          onClose={() => setSheetDay(null)}
          rows={sheetItems.map(sheetRow)}
          onOpen={(it) => {
            setSheetDay(null);
            const itemId = it.origType === "payment" ? it.id
              : it.origType === "todo" ? "todo" + (it.id.startsWith("todo") ? it.id.slice(4) : it.id)
              : it.origType === "note" ? "note" + (it.id.startsWith("note") ? it.id.slice(4) : it.id)
              : it.id;
            setSelected({ itemId, type: it.origType, x: 0, y: 0, date: sheetDay! });
          }}
        />
      )}

      {dayReveal && (
        <MiniModal
          position={{ x: dayReveal.x, y: dayReveal.y }}
          onClose={() => setDayReveal(null)}
          title={`${MONTHS[cursor.m]} ${dayReveal.iso.slice(8)}`}
        >
          <div className="space-y-1.5">
            {dayItems(dayReveal.iso).map((it) => {
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDayReveal(null);
                    setSelected({ itemId: it.id, type: it.type, x: dayReveal.x, y: dayReveal.y, date: dayReveal.iso });
                  }}
                  className="w-full text-left cursor-pointer flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-card2 transition-colors"
                >
                  <Pill size="sm" done={it.done} className={cn(
                    it.type === "payment" ? "pill-due" :
                    it.type === "todo" ? "pill-purple" :
                    it.type === "note" ? "pill-note" :
                    it.type === "content" ? "pill-accent" : "pill-paid"
                  )}>{it.label}</Pill>
                  <span className={cn("flex-1 truncate text-sm", it.done && "pill-done-title")}>{it.title}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-inksoft mt-2.5">Click an item to open it, or click outside to close.</p>
        </MiniModal>
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
          onSaved={(nextDone?: boolean) => {
            if (nextDone !== undefined) {
              setTodos((ts) => ts.map((t) => t.id === selectedTodo.id ? { ...t, done: nextDone } : t));
            }
            setSelected(null); load();
          }}
        />
      )}
      {selected && selectedNote && (
        <NoteDetailPopover
          note={selectedNote}
          position={{ x: selected.x, y: selected.y }}
          onClose={() => setSelected(null)}
          onSaved={(nextDone?: boolean) => {
            if (nextDone !== undefined) {
              setNotes((ns) => ns.map((n) => n.id === selectedNote.id ? { ...n, done: nextDone } : n));
            }
            setSelected(null); load();
          }}
        />
      )}
    </div>
  );

  async function onDropToDay(targetDay: string, activeId: string, type: "content" | "deliverable" | "payment" | "todo" | "note" | null) {
    if (!activeId) { resetDrag(); return; }

    // Received payments are not draggable: their date is a historical fact.
    // dayItems() already omits received payments, but guard here too.
    if (type === "payment") {
      const { data: p } = await supabase.from("payments").select("status").eq("id", activeId).single();
      if ((p as { status?: string } | null)?.status === "received") { resetDrag(); return; }
    }

    if (type === "content" || type === "deliverable") {
      // Recurring posts are materialized as separate rows (the base row carries
      // repeat_type; expanded instances have repeat_type null via the DB trigger).
      // Updating event_date on the dragged row moves only that instance, never the
      // whole series. Dragging the base (repeat_type set) still only moves that one
      // row; the series is not silently rescheduled.
      await supabase.from("content").update({ event_date: targetDay }).eq("id", activeId);
    } else if (type === "payment") {
      await supabase.from("payments").update({ expected_date: targetDay }).eq("id", activeId);
    } else if (type === "todo") {
      await supabase.from("todos").update({ due_date: targetDay }).eq("id", activeId);
    } else if (type === "note") {
      await supabase.from("notes").update({ event_date: targetDay }).eq("id", activeId);
    }
    load();

    function resetDrag() {
      setDragId(null); setDragType(null); setDragOrigin(null); setDropTarget(null);
    }
    resetDrag();
  }
}

/* ---------------- Mobile day bottom sheet ----------------
   Slides up from the bottom (240ms), drag handle on top, dismissible by the
   close button, tapping the scrim, or swiping down. One row per event with the
   POST/PAY/DUE pill, the brand/name, and the amount right-aligned in mono. */
type MobileSheetRow = {
  id: string; label: "POST" | "PAY" | "DUE"; color: string;
  origType: "content" | "deliverable" | "payment" | "todo" | "note";
  name?: string; amount?: string | null; done?: boolean;
};
function MobileDaySheet({ iso, rows, onClose, onOpen }: {
  iso: string; rows: MobileSheetRow[];
  onClose: () => void; onOpen: (it: MobileSheetRow) => void;
}) {
  const d = iso ? new Date(iso + "T00:00:00") : new Date();
  const title = `${WEEKDAYS[(d.getDay() + 6) % 7]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
  const touch = useRef<{ y: number; translate: number } | null>(null);
  const [drift, setDrift] = useState(0);

  // Close when the user drags the handle down past ~90px, mirroring iOS sheets.
  const onPointerDown = (e: React.PointerEvent) => {
    touch.current = { y: e.clientY, translate: 0 };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const t = touch.current;
    if (!t) return;
    const dy = Math.max(0, e.clientY - t.y); // only downward
    t.translate = dy;
    setDrift(dy);
  };
  const onPointerUp = () => {
    const t = touch.current;
    touch.current = null;
    setDrift(0);
    if (t && t.translate > 90) onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[95] bg-black/25 cal-sheet-scrim" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="fixed inset-x-0 bottom-0 z-[96] bg-card rounded-t-2xl shadow-lg cal-sheet sheethandle"
        style={{ transform: `translateY(${drift}px)` }}
      >
        <div
          className="cal-sheet-drag w-full pt-2.5 pb-1 flex justify-center cursor-grab touch-none"
          onPointerDown={onPointerDown} onPointerMove={onPointerMove}
          onPointerUp={onPointerUp} onPointerCancel={() => { touch.current = null; setDrift(0); }}
        >
          <span className="cal-sheet-handle block w-10 h-1.5 rounded-full bg-line2" />
        </div>
        <div className="flex items-center justify-between px-5 pb-2.5">
          <h4 className="font-semibold text-[16px]">{title}</h4>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg hover:bg-card2 cursor-pointer">
            <IconClose size={17} />
          </button>
        </div>
        <div className="px-2 pb-[max(16px,env(safe-area-inset-bottom))] max-h-[46dvh] overflow-y-auto">
          {rows.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted">Nothing scheduled.</p>
          ) : (
            rows.map((it, i) => (
              <button
                key={it.id}
                type="button"
                onClick={() => onOpen(it)}
                className={cn(
                  "w-full text-left flex items-center gap-3 px-3 py-3 cursor-pointer",
                  i > 0 && "border-t border-line"
                )}
              >
                <span
                  className="shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-white"
                  style={{ backgroundColor: it.color }}
                >{it.label}</span>
                <span className={cn("flex-1 min-w-0 truncate text-[14px]", it.done && "pill-done-title")}>{it.name}</span>
                {it.amount != null && (
                  <span className="shrink-0 money text-[14px] font-medium text-ink tabular-nums">{it.amount}</span>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}

/* ---------------- Add event popover (inline, not a heavy modal) ---------------- */
function AddEventPopover({ date, deals, onClose, onSaved }: { date: string; deals: Deal[]; onClose: () => void; onSaved: () => void }) {
  const supabase = createClient();
  const [kind, setKind] = useState<"post" | "note">("post");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [noteDone, setNoteDone] = useState(false);
  const [noteDetails, setNoteDetails] = useState("");
  const [noteDate, setNoteDate] = useState(date);
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
      const { error } = await supabase.from("notes").insert({ user_id: user.id, body: note.trim(), event_date: noteDate || date, done: noteDone, details: noteDetails.trim() || null });
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
      <div className="absolute left-4 right-4 sm:left-auto sm:right-6 top-20 sm:top-24 w-auto sm:w-96 bg-surface border border-border rounded-xl shadow-pop fade-up flex flex-col max-h-[calc(100dvh-6.5rem)]" onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="shrink-0 px-5 pt-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{kind === "note" ? "New note" : "New post"}</h3>
            <button onClick={onClose} aria-label="Close" className="p-1 rounded-lg hover:bg-subtle cursor-pointer"><IconClose size={16} /></button>
          </div>
          <div className="flex gap-1.5 mb-4">
            <button type="button" onClick={() => setKind("post")} className={cn("px-3 h-8 rounded-lg text-sm font-medium cursor-pointer border", kind === "post" ? "accent-soft border-accent/30" : "border-border text-muted hover:text-foreground")}>Post</button>
            <button type="button" onClick={() => setKind("note")} className={cn("px-3 h-8 rounded-lg text-sm font-medium cursor-pointer border", kind === "note" ? "accent-soft border-accent/30" : "border-border text-muted hover:text-foreground")}>Note</button>
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-5 space-y-3">
          {kind === "note" ? (
            <>
              <label className="block">
                <span className="text-xs text-muted mb-1 block">Note</span>
                <Input value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }} placeholder="Follow up with Panera about contract" autoFocus />
              </label>
              <label className="block">
                <span className="text-xs text-muted mb-1 block">Date</span>
                <Input type="date" value={noteDate} onChange={(e) => setNoteDate(e.target.value)} />
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="h-4 w-4" style={{ accentColor: "var(--accent)" }} checked={noteDone} onChange={(e) => setNoteDone(e.target.checked)} />
                <span>Done</span>
              </label>
              <label className="block">
                <span className="text-xs text-muted mb-1 block">Details (optional)</span>
                <Textarea value={noteDetails} onChange={(e) => setNoteDetails(e.target.value)} rows={3} placeholder="Add more context for this note…" />
              </label>
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

/* ---------------- Mini detail/edit modals (anchored next to the clicked item) ----------------
   Collision-aware: measures itself, then flips above / shifts sideways so the whole panel
   (header + body + pinned footer) stays inside the viewport at any window size. Overly tall
   content scrolls inside the body. Narrow viewports fall back to a bottom sheet. */
function MiniModal({ position, onClose, title, children, footer }: {
  position: { x: number; y: number };
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const GAP = 12, MARGIN = 8, W = 340;
  const [place, setPlace] = useState<{ x: number; y: number; sheet: boolean } | null>(() => {
    if (typeof window === "undefined" || window.innerWidth < 420) return null;
    // Best-effort initial placement (refined by useLayoutEffect after measurement).
    const vw = window.innerWidth, vh = window.innerHeight;
    const x = Math.max(MARGIN, Math.min(position.x + GAP, vw - MARGIN - Math.min(W, vw - MARGIN * 2)));
    const y = Math.max(MARGIN, Math.min(position.y + GAP, vh - MARGIN - 300));
    return { x, y, sheet: false };
  });
  // Reliable cross-browser cap so the body scrolls internally when content is tall.
  const bodyMax = typeof window === "undefined" ? 400 : Math.max(160, (place?.sheet ? window.innerHeight * 0.55 : window.innerHeight) - (place?.sheet ? 0 : 152));

  useLayoutEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // Narrow viewport: fall back to a full-width bottom sheet instead of a cramped anchor.
    if (vw < 420) { setPlace({ x: 0, y: 0, sheet: true }); return; }

    const el = panelRef.current;
    // Probe height from the rendered panel; if unknown yet, assume a typical height.
    const rect = el?.getBoundingClientRect();
    const H = Math.min(rect?.height || Math.min(400, vh - MARGIN * 2), vh - MARGIN * 2);
    const width = Math.min(W, vw - MARGIN * 2);

    // Horizontal: place beside (to the right of) the anchor, shifting left if it overflows.
    let x = position.x + GAP;
    if (x + width > vw - MARGIN) x = Math.max(MARGIN, position.x - GAP - width);
    if (x + width > vw - MARGIN) x = vw - MARGIN - width;
    x = Math.max(MARGIN, x);

    // Vertical: prefer below; flip above when there isn't room below; clamp to a visible range.
    let y = position.y + GAP;
    if (y + H > vh - MARGIN && position.y - GAP - H >= MARGIN) y = position.y - GAP - H;
    y = Math.max(MARGIN, Math.min(y, vh - MARGIN - H));

    setPlace({ x, y, sheet: false });
  }, [position]);

  if (place?.sheet) {
    return (
      <>
        <div className="fixed inset-0 z-40" onClick={onClose} />
        <div role="dialog" className="fixed z-50 inset-x-0 bottom-0 bg-card border-t border-line rounded-t-2xl shadow-lg fade-up">
          <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-line">
            <h4 className="font-semibold text-[15px]">{title}</h4>
            <button onClick={onClose} aria-label="Close" className="p-1 rounded-lg hover:bg-soft cursor-pointer"><IconClose size={16} /></button>
          </div>
          <div className="overflow-y-auto px-5 py-3" style={{ maxHeight: bodyMax }}>{children}</div>
          {footer && <div className="px-5 py-3 border-t border-line">{footer}</div>}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        className="fixed z-50 flex flex-col bg-card border border-line rounded-xl shadow-lg fade-up"
        style={{ left: place ? place.x : position.x, top: place ? place.y : position.y, width: W }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-line shrink-0">
          <h4 className="font-semibold text-[15px]">{title}</h4>
          <button onClick={onClose} aria-label="Close" className="p-1 rounded-lg hover:bg-soft cursor-pointer"><IconClose size={16} /></button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3" style={{ maxHeight: bodyMax }}>{children}</div>
        {footer && <div className="px-4 pb-4 pt-2 border-t border-line shrink-0">{footer}</div>}
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
    <MiniModal position={position} onClose={onClose} title="Post details" footer={
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={remove} className="text-bad"><IconDelete size={15} /> Delete</Button>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? <Spinner /> : <IconCheck size={15} />} Save</Button>
        </div>
      </div>
    }>
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

/* To-do — view + toggle done + reschedule */
function TodoDetailPopover({ todo, position, onClose, onSaved }: {
  todo: Todo; position: { x: number; y: number }; onClose: () => void; onSaved: (done?: boolean) => void;
}) {
  const supabase = createClient();
  const [due, setDue] = useState(todo.due_date ?? "");
  const [saving, setSaving] = useState(false);

  const toggleDone = async () => {
    setSaving(true);
    await supabase.from("todos").update({ done: !todo.done }).eq("id", todo.id);
    setSaving(false);
    onSaved(!todo.done);
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
        <p className={cn("text-sm font-medium", todo.done && "pill-done-title")}>{todo.title}</p>
        <label className="block">
          <span className="text-xs text-muted mb-1 block">Due date</span>
          <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        </label>
        <div className="flex flex-col gap-2 pt-1">
          {todo.due_date && (
            <Button variant="secondary" onClick={toggleDone} disabled={saving} className="w-full">
              {todo.done ? "Mark not done" : <><IconCheck size={15} /> Mark done</>}
            </Button>
          )}
          <Button onClick={reschedule} disabled={saving} className="w-full">{saving ? <Spinner /> : "Save date"}</Button>
        </div>
      </div>
    </MiniModal>
  );
}

/* Note — view + edit + delete */
function NoteDetailPopover({ note, position, onClose, onSaved }: {
  note: CalendarNote; position: { x: number; y: number }; onClose: () => void; onSaved: (done?: boolean) => void;
}) {
  const supabase = createClient();
  const [body, setBody] = useState(note.body);
  const [done, setDoneLocal] = useState(note.done);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const setDone = async (next: boolean) => {
    setDoneLocal(next);
    const { error } = await supabase.from("notes").update({ done: next }).eq("id", note.id);
    if (error) { setDoneLocal(!next); setError(error.message); return; }
    onSaved(next);
  };

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
    <MiniModal position={position} onClose={onClose} title="Note" footer={
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={remove} className="text-bad"><IconDelete size={15} /> Delete</Button>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? <Spinner /> : <IconCheck size={15} />} Save</Button>
        </div>
      </div>
    }>
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" className="h-4 w-4" style={{ accentColor: "var(--accent)" }} checked={done} onChange={(e) => setDone(e.target.checked)} />
          <span>Done</span>
        </label>
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="Write a note…" />
        {note.details && <p className="text-xs text-muted">{note.details}</p>}
        {error && <p className="text-sm text-bad" role="alert">{error}</p>}
      </div>
    </MiniModal>
  );
}
