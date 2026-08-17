"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { IconPlus, IconCheck, IconCalendar, IconMore, IconEdit, IconDelete, IconClose } from "@/components/icons";
import { Button, Input } from "@/components/ui";

type Todo = {
  id: string; title: string; done: boolean; due_date: string | null;
  start_time: string | null; end_time: string | null; created_at?: string;
};

const pad = (n: number) => String(n).padStart(2, "0");
const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayISO = () => toISO(new Date());

// Friendly due label (falls back to nothing when no date so we never show empty pills).
function dueText(iso: string | null): string {
  if (!iso) return "";
  const today = new Date(todayISO() + "T00:00:00");
  const d = new Date(iso + "T00:00:00");
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return diff === -1 ? "Yesterday" : `${Math.abs(diff)}d overdue`;
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff < 7) return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.getDay()];
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function fmtTime(t: string | null): string {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${pad(h)}.${pad(m ?? 0)}`;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MON_DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const HOURS = Array.from({ length: 24 }, (_, h) => h);

/* ---------------- Month-grid date picker (reference: month grid) ---------------- */
function DatePickerGrid({ value, onChange, onClose }: { value: string; onChange: (iso: string) => void; onClose: () => void }) {
  const [cursor, setCursor] = useState(() => {
    const d = value ? new Date(value + "T00:00:00") : new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const firstDay = new Date(cursor.y, cursor.m, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday first
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const cells: (string | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(toISO(new Date(cursor.y, cursor.m, d)));

  return (
    <div className="w-60 bg-card border border-line2 rounded-xl shadow-pop p-3 card-like">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => setCursor((c) => ({ y: c.m === 0 ? c.y - 1 : c.y, m: c.m === 0 ? 11 : c.m - 1 }))} className="h-6 w-6 text-muted hover:text-ink rounded cursor-pointer">‹</button>
        <span className="text-[13px] font-semibold">{MONTHS[cursor.m]} {cursor.y}</span>
        <button onClick={() => setCursor((c) => ({ y: c.m === 11 ? c.y + 1 : c.y, m: c.m === 11 ? 0 : c.m + 1 }))} className="h-6 w-6 text-muted hover:text-ink rounded cursor-pointer">›</button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {MON_DAYS.map((d, i) => <div key={i} className="text-center text-[10px] text-muted font-semibold">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((iso, i) => iso ? (
          <button key={i} onClick={() => { onChange(iso); onClose(); }} className={cn("h-7 text-[12px] rounded-md cursor-pointer hover:bg-card2", iso === value ? "accent-fill font-semibold" : "text-ink")}>{Number(iso.slice(8))}</button>
        ) : <div key={i} />)}
      </div>
      <button onClick={() => { onChange(todayISO()); onClose(); }} className="mt-2 w-full text-[12px] font-medium accent-text hover:underline cursor-pointer">Today</button>
    </div>
  );
}

/* ---------------- Hour-grid time picker (reference: hour grid + custom hours) ---------------- */
function TimePickerGrid({ start, end, onChange, onClose }: {
  start: string; end: string; onChange: (start: string, end: string) => void; onClose: () => void;
}) {
  const [s, setS] = useState(start);
  const [e, setE] = useState(end);

  const apply = (which: "start" | "end", h: number) => {
    const v = `${pad(h)}:00`;
    if (which === "start") { setS(v); if (!e || Number(e.split(":")[0]) <= h) setE(`${pad(Math.min(h + 1, 23))}:00`); }
    else setE(v);
  };

  return (
    <div className="w-72 bg-card border border-line2 rounded-xl shadow-pop p-3">
      <div className="text-[13px] font-semibold mb-2">Time (optional)</div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className="text-[11px] text-muted mb-1">From</div>
          <Input type="time" value={s} onChange={(e) => setS(e.target.value)} className="text-[12px] h-9" aria-label="Start time" />
        </div>
        <div>
          <div className="text-[11px] text-muted mb-1">Until</div>
          <Input type="time" value={e} onChange={(ev) => setE(ev.target.value)} className="text-[12px] h-9" aria-label="End time" />
        </div>
      </div>
      <div className="text-[11px] text-muted mb-1">Custom hours</div>
      <div className="grid grid-cols-4 gap-1 max-h-40 overflow-y-auto pr-1">
        {HOURS.map((h) => (
          <button key={h} onClick={() => apply("start", h)} className={cn("h-7 text-[12px] rounded-md cursor-pointer border", s === `${pad(h)}:00` ? "accent-soft border-accent/30" : "border-line text-ink hover:bg-card2")}>{pad(h)}:00</button>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <button onClick={() => { setS(""); setE(""); }} className="text-[12px] text-muted hover:text-ink cursor-pointer">Clear</button>
        <Button size="sm" onClick={() => { onChange(s, e); onClose(); }}>Set time</Button>
      </div>
    </div>
  );
}

/* ---------------- Create task popover ---------------- */
function CreateTaskPopover({ onClose, onSaved, position }: { onClose: () => void; onSaved: () => void; position: { right: number; top: number } }) {
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    if (!title.trim()) { setError("Add a task title."); return; }
    setSaving(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); setSaving(false); return; }
    const { error } = await supabase.from("todos").insert({
      user_id: user.id, title: title.trim(), due_date: date || null,
      start_time: start || null, end_time: end || null,
    });
    setSaving(false);
    if (error) { setError(error.message); return; }
    onSaved();
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed w-[380px] max-w-[90vw] bg-card border border-line2 rounded-2xl shadow-pop p-5 fade-up z-50" style={{ right: position.right, top: position.top }} onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Create task</h3>
          <button onClick={onClose} aria-label="Close" className="p-1 rounded-lg hover:bg-card2 cursor-pointer"><IconClose size={16} /></button>
        </div>
        <div className="space-y-3">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && save()} placeholder="Task title" autoFocus />
          <div className="relative flex gap-2">
            <button onClick={() => { setShowTime(false); setShowDate((d) => !d); }} className={cn("inline-flex items-center gap-1.5 px-3 h-10 rounded-xl text-sm font-medium border transition cursor-pointer", date ? "accent-soft border-accent/30" : "bg-card border-line2 text-ink hover:bg-card2")}>
              <IconCalendar size={15} /> {date ? dueText(date) : "Add date"}
            </button>
            {showDate && (
              <div className="absolute top-11 left-0 z-50"><DatePickerGrid value={date} onChange={setDate} onClose={() => setShowDate(false)} /></div>
            )}
            <button onClick={() => { setShowDate(false); setShowTime((t) => !t); }} className={cn("inline-flex items-center gap-1.5 px-3 h-10 rounded-xl text-sm font-medium border transition cursor-pointer", start ? "accent-soft border-accent/30" : "bg-card border-line2 text-ink hover:bg-card2")}>
              <IconPlus size={15} /> {start ? `${fmtTime(start)} - ${fmtTime(end)}` : "Add time"}
            </button>
            {showTime && (
              <div className="absolute top-11 left-0 z-50"><TimePickerGrid start={start} end={end} onChange={(s, e) => { setStart(s); setEnd(e); }} onClose={() => setShowTime(false)} /></div>
            )}
          </div>
          {error && <p className="text-sm text-bad" role="alert">{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={save} disabled={saving} className="btn3d">{saving ? "Saving…" : "Save task"}</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function NotesPage() {
  const supabase = createClient();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const createWrapRef = useRef<HTMLDivElement>(null);
  const [createPos, setCreatePos] = useState<{ right: number; top: number } | null>(null);

  // Measure the create button so the popover can be `fixed` and sit above
  // everything (the main column has overflow:hidden and creates a stacking
  // context, which would otherwise clip an absolute dropdown).
  const toggleCreate = () => {
    setCreateOpen((o) => {
      if (!o && createWrapRef.current) {
        const r = createWrapRef.current.getBoundingClientRect();
        setCreatePos({ right: window.innerWidth - r.right, top: r.bottom + 8 });
      }
      return !o;
    });
  };

  const load = useCallback(async () => {
    const { data } = await supabase.from("todos").select("*").order("created_at", { ascending: true });
    setTodos((data ?? []) as unknown as Todo[]);
    setLoading(false);
  }, [supabase]);
  useEffect(() => { load(); }, [load]);

  // Cmd+N opens the create flow (reference bottom bar shortcut).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") { e.preventDefault(); setCreateOpen(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleTodo = async (id: string, done: boolean) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done } : t)));
    await supabase.from("todos").update({ done }).eq("id", id);
  };

  const deleteTodo = async (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
    setMenuFor(null);
    await supabase.from("todos").delete().eq("id", id);
  };

  const commitRename = async (id: string) => {
    const trimmed = draftTitle.trim();
    setEditingId(null); setMenuFor(null);
    if (!trimmed) return;
    setTodos(todos.map((t) => (t.id === id ? { ...t, title: trimmed } : t)));
    await supabase.from("todos").update({ title: trimmed }).eq("id", id);
  };

  const openItems = todos.filter((t) => !t.done);
  const doneCount = todos.length - openItems.length;

  if (loading) return <div className="skeleton h-48 max-w-2xl" />;

  return (
    <div className="space-y-6 fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">To-dos</h1>
          <p className="text-muted text-sm mt-1">A quiet checklist for the work that moves your deals forward.</p>
        </div>
        <div className="flex items-center gap-3">
          {todos.length > 0 && (
            <span className="text-sm text-muted tabular-nums">{doneCount} of {todos.length} done</span>
          )}
          <div className="relative" ref={createWrapRef}>
            <Button onClick={toggleCreate} aria-expanded={createOpen}><IconPlus size={16} /> Create new task</Button>
            {createOpen && createPos && <CreateTaskPopover onClose={() => setCreateOpen(false)} onSaved={() => { setCreateOpen(false); load(); }} position={createPos} />}
          </div>
        </div>
      </div>

      {openItems.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-sm text-muted">{todos.length === 0 ? "No tasks yet. Tap Create task to add your first one." : "All done. Nice work."}</p>
        </div>
      ) : (
        <div>
          {openItems.map((t) => {
            const due = dueText(t.due_date);
            const hasTime = !!t.start_time;
            const timePill = hasTime ? `${fmtTime(t.start_time)} - ${fmtTime(t.end_time)}` : due;
            const isEditing = editingId === t.id;
            return (
              <div key={t.id} className="group relative flex items-center gap-3 card p-4 mb-2 rounded-xl hover:border-line2 transition-colors">
                <button onClick={() => toggleTodo(t.id, !t.done)} aria-label="Complete task" className={cn("h-5 w-5 rounded-full border grid place-items-center shrink-0 cursor-pointer transition-colors", t.done ? "accent-fill border-transparent" : "border-border-strong hover:border-accent")}>
                  {t.done && <IconCheck size={12} />}
                </button>
                {isEditing ? (
                  <Input value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} onBlur={() => commitRename(t.id)} onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); if (e.key === "Escape") setEditingId(null); }} className="!w-auto flex-1 min-w-0" autoFocus />
                ) : (
                  <span className="text-sm flex-1 min-w-0 truncate text-ink">{t.title}</span>
                )}
                {timePill && (
                  <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-medium tabular-nums whitespace-nowrap", hasTime ? "accent-soft" : due.includes("overdue") ? "bg-latebg text-late" : "bg-card2 text-muted")}>
                    {timePill}
                  </span>
                )}
                <div className="relative">
                  <button onClick={() => setMenuFor(menuFor === t.id ? null : t.id)} aria-label="More actions" className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-card2 cursor-pointer"><IconMore size={16} /></button>
                  {menuFor === t.id && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setMenuFor(null)} />
                      <div className="absolute right-0 top-8 w-40 bg-card border border-line2 rounded-xl shadow-pop p-1 z-40">
                        <button onClick={() => { setMenuFor(null); setEditingId(t.id); setDraftTitle(t.title); }} className="w-full flex items-center gap-2 px-2.5 h-9 text-[13px] text-ink hover:bg-card2 rounded-lg cursor-pointer">
                          <IconEdit size={14} /> Edit
                        </button>
                        <button onClick={() => deleteTodo(t.id)} className="w-full flex items-center gap-2 px-2.5 h-9 text-[13px] text-bad hover:bg-card2 rounded-lg cursor-pointer">
                          <IconDelete size={14} /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}