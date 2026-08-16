"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { IconCheck, IconPlus, IconDelete } from "@/components/icons";
import { Button, Input } from "@/components/ui";

type Todo = { id: string; title: string; done: boolean; due_date: string | null; created_at?: string };

const pad = (n: number) => String(n).padStart(2, "0");
const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const startOfDay = (iso: string) => new Date(iso + "T00:00:00");
const todayISO = () => toISO(new Date());

// Human, relative due labels + overdue flag.
function dueLabel(iso: string | null): { text: string; overdue: boolean } {
  if (!iso) return { text: "", overdue: false };
  const today = startOfDay(todayISO());
  const d = startOfDay(iso);
  const diffDays = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diffDays < 0) return { text: diffDays === -1 ? "Yesterday" : `${Math.abs(diffDays)}d overdue`, overdue: true };
  if (diffDays === 0) return { text: "Today", overdue: false };
  if (diffDays === 1) return { text: "Tomorrow", overdue: false };
  if (diffDays < 7) {
    const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return { text: names[d.getDay()], overdue: false };
  }
  return { text: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), overdue: false };
}

type GroupKey = "overdue" | "today" | "upcoming" | "someday" | "done";
type GroupDef = { key: GroupKey; label: string; icon?: "late" | "accent" | "ok" | "muted" | "purple" };

const GROUP_DEFS: GroupDef[] = [
  { key: "overdue", label: "Overdue", icon: "late" },
  { key: "today", label: "Today", icon: "accent" },
  { key: "upcoming", label: "Upcoming", icon: "ok" },
  { key: "someday", label: "Someday", icon: "muted" },
  { key: "done", label: "Completed", icon: "ok" },
];

function groupTodos(todos: Todo[]): Partial<Record<GroupKey, Todo[]>> {
  const today = todayISO();
  const active = todos.filter((t) => !t.done);
  const done = todos.filter((t) => t.done);
  const overdue = active.filter((t) => t.due_date && t.due_date < today);
  const todayItems = active.filter((t) => t.due_date === today);
  const future = active.filter((t) => t.due_date && t.due_date > today).sort((a, b) => (a.due_date! < b.due_date! ? -1 : 1));
  const someday = active.filter((t) => !t.due_date);
  const g: Partial<Record<GroupKey, Todo[]>> = {};
  if (overdue.length) g.overdue = overdue;
  if (todayItems.length) g.today = todayItems;
  if (future.length) g.upcoming = future;
  if (someday.length) g.someday = someday;
  if (done.length) g.done = done;
  return g;
}

const GROUP_META: Record<GroupKey, { color: string; label: string; empty: string }> = {
  overdue: { color: "text-late", label: "Late", empty: "Nothing overdue. Nice work." },
  today: { color: "accent-text", label: "Today", empty: "Nothing due today." },
  upcoming: { color: "text-muted", label: "Scheduled", empty: "No upcoming to-dos." },
  someday: { color: "text-muted", label: "Any time", empty: "Nothing saved for later." },
  done: { color: "text-muted", label: "Done now", empty: "Nothing completed yet." },
};

export default function NotesPage() {
  const supabase = createClient();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoInput, setTodoInput] = useState("");
  const [todoDate, setTodoDate] = useState("");
  const [active, setActive] = useState<GroupKey>("today");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase.from("todos").select("*").order("created_at", { ascending: true });
    setTodos((data ?? []) as unknown as Todo[]);
    setLoading(false);
  }, [supabase]);
  useEffect(() => { load(); }, [load]);

  const addTodo = async () => {
    if (!todoInput.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("todos").insert({ user_id: user.id, title: todoInput.trim(), due_date: todoDate || null }).select().single();
    if (data) {
      setTodos((t) => [data as unknown as Todo, ...t]);
      setTodoInput("");
      setTodoDate("");
      setActive(todoDate && todoDate < todayISO() ? "overdue" : todoDate === todayISO() ? "today" : todoDate ? "upcoming" : "someday");
    }
  };

  const toggleTodo = async (id: string, done: boolean) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done } : t)));
    await supabase.from("todos").update({ done }).eq("id", id);
  };

  const setDate = async (id: string, iso: string | null) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, due_date: iso } : t)));
    await supabase.from("todos").update({ due_date: iso }).eq("id", id);
  };

  const deleteTodo = async (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
    await supabase.from("todos").delete().eq("id", id);
  };

  const groups = groupTodos(todos);
  const activeItems = groups[active] ?? [];
  const hasOverdue = (groups.overdue?.length ?? 0) > 0;
  const remaining = todos.filter((t) => !t.done).length;

  if (loading) return <div className="skeleton h-48 max-w-2xl" />;

  const iconDot = (icon?: GroupDef["icon"]) =>
    cn("h-2.5 w-2.5 rounded-full shrink-0",
      icon === "late" ? "bg-late" :
      icon === "accent" ? "accent-fill" :
      icon === "ok" ? "bg-paid" :
      icon === "purple" ? "bg-purple" : "bg-muted");

  return (
    <div className="space-y-5 fade-up">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">To-dos</h1>
          <p className="text-muted text-sm mt-1">A quiet checklist for the work that moves your deals forward.</p>
        </div>
        <span className="text-sm text-muted tabular-nums">{remaining} of {todos.length} open</span>
      </div>

      <div className="flex gap-5 items-start">
        {/* Left rail (66chat-style list selector) */}
        <div className="w-44 shrink-0 flex flex-col gap-0.5">
          {GROUP_DEFS.map((g) => {
            const count = groups[g.key]?.length ?? 0;
            return (
              <button
                key={g.key}
                onClick={() => setActive(g.key)}
                className={cn(
                  "flex items-center gap-2.5 w-full px-3 h-9 rounded-lg text-sm transition-colors cursor-pointer",
                  active === g.key ? "bg-card border border-line font-medium" : "text-muted hover:text-ink hover:bg-card"
                )}
              >
                <span className={iconDot(g.icon)} />
                <span className="flex-1 text-left">{g.label}</span>
                {count > 0 && (
                  <span className={cn("min-w-5 h-5 px-1.5 rounded-full text-[11px] font-semibold grid place-items-center tabular-nums", active === g.key ? "accent-fill" : "bg-card2 text-muted")}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main list */}
        <div className="flex-1 min-w-0 card p-5">
          <div className="flex gap-2 mb-4 items-center">
            <Input value={todoInput} onChange={(e) => setTodoInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTodo()} placeholder="Add a to-do…" className="!w-auto flex-1 min-w-0" />
            <Input type="date" value={todoDate} onChange={(e) => setTodoDate(e.target.value)} className="!w-[150px] shrink-0" aria-label="Due date" />
            <Button onClick={addTodo}><IconPlus size={16} /></Button>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className={cn("text-[11px] font-semibold uppercase tracking-wide", GROUP_META[active].color)}>{GROUP_META[active].label}</span>
            {hasOverdue && active !== "overdue" && (
              <button onClick={() => setActive("overdue")} className="text-[11px] font-medium text-late hover:underline cursor-pointer">{groups.overdue!.length} overdue</button>
            )}
          </div>

          {activeItems.length === 0 ? (
            <p className="text-sm text-muted py-8 text-center">{GROUP_META[active].empty}</p>
          ) : (
            <ul className="space-y-1">
              {activeItems.map((t) => {
                const dl = dueLabel(t.due_date);
                return (
                  <li key={t.id} className="flex items-center gap-2.5 py-1.5 group">
                    <button onClick={() => toggleTodo(t.id, !t.done)} aria-label="Toggle to-do" className={cn("h-5 w-5 rounded-full border grid place-items-center shrink-0 cursor-pointer transition-colors", t.done ? "accent-fill border-transparent" : "border-border-strong hover:border-accent")}>
                      {t.done && <IconCheck size={12} />}
                    </button>
                    <span className={cn("text-sm flex-1", t.done && "line-through text-muted opacity-70")}>{t.title}</span>
                    {t.due_date ? (
                      <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-medium tabular-nums whitespace-nowrap", dl.overdue ? "bg-late/10 text-late" : dl.text === "Today" ? "accent-soft" : "bg-card2 text-muted")}>
                        {dl.text}
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted whitespace-nowrap">Anytime</span>
                    )}
                    <label className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0">
                      <Input
                        type="date"
                        value={t.due_date ?? ""}
                        onChange={(e) => setDate(t.id, e.target.value || null)}
                        className="!w-[130px] text-xs h-8 !py-0"
                        aria-label="Due date"
                      />
                    </label>
                    <button onClick={() => deleteTodo(t.id)} aria-label="Delete to-do" className="text-muted hover:text-bad cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"><IconDelete size={14} /></button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}