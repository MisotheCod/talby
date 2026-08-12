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

// Human, relative due labels + overdue flag (Mobbin best practice).
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

// Group into time buckets; overdue first (Mobbin). Completed collapse into a
// separate "Completed" group at the bottom.
type Group = { key: string; label: string; items: Todo[] };
function groupTodos(todos: Todo[]): Group[] {
  const today = todayISO();
  const active = todos.filter((t) => !t.done);
  const done = todos.filter((t) => t.done);
  const overdue = active.filter((t) => t.due_date && t.due_date < today);
  const todayItems = active.filter((t) => t.due_date === today);
  const future = active.filter((t) => t.due_date && t.due_date > today).sort((a, b) => (a.due_date! < b.due_date! ? -1 : 1));
  const someday = active.filter((t) => !t.due_date);
  const groups: Group[] = [];
  if (overdue.length) groups.push({ key: "overdue", label: "Overdue", items: overdue });
  groups.push({ key: "today", label: "Today", items: todayItems });
  if (future.length) groups.push({ key: "upcoming", label: "Upcoming", items: future });
  if (someday.length) groups.push({ key: "someday", label: "Someday", items: someday });
  if (done.length) groups.push({ key: "done", label: "Completed", items: done });
  return groups;
}

export default function NotesPage() {
  const supabase = createClient();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoInput, setTodoInput] = useState("");
  const [todoDate, setTodoDate] = useState("");
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
    if (data) { setTodos((t) => [data as unknown as Todo, ...t]); setTodoInput(""); setTodoDate(""); }
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

  const remaining = todos.filter((t) => !t.done).length;
  const groups = groupTodos(todos);

  if (loading) return <div className="skeleton h-48 max-w-2xl" />;

  return (
    <div className="space-y-6 fade-up max-w-2xl">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">To-dos</h1>
          <p className="text-muted text-sm mt-1">A quiet checklist for the work that moves your deals forward.</p>
        </div>
        {/* Progress header: quiet count, not a bar (Mobbin) */}
        <span className="text-sm text-muted tabular-nums">{remaining} of {todos.length} open</span>
      </div>

      {/* Inline add (Mobbin: persistent add row at top of the list) */}
      <div className="card p-5">
        <div className="flex gap-2 mb-4 items-center">
          <Input value={todoInput} onChange={(e) => setTodoInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTodo()} placeholder="Add a to-do…" className="!w-auto flex-1 min-w-0" />
          <Input type="date" value={todoDate} onChange={(e) => setTodoDate(e.target.value)} className="!w-[150px] shrink-0" aria-label="Due date" />
          <Button onClick={addTodo}><IconPlus size={16} /></Button>
        </div>

        {todos.length === 0 ? (
          <p className="text-sm text-muted py-6 text-center">No to-dos yet. Add one above.</p>
        ) : (
          <div className="space-y-5">
            {groups.map((g) => (
              <div key={g.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">{g.label} · {g.items.length}</span>
                  {g.key === "overdue" && <span className="text-[11px] font-medium text-late">Reschedule</span>}
                </div>
                <ul className="space-y-1">
                  {g.items.map((t) => {
                    const dl = dueLabel(t.due_date);
                    return (
                      <li key={t.id} className="flex items-center gap-2.5 py-1.5">
                        {/* Circular checkbox (Mobbin) */}
                        <button onClick={() => toggleTodo(t.id, !t.done)} aria-label="Toggle to-do" className={cn("h-5 w-5 rounded-full border grid place-items-center shrink-0 cursor-pointer transition-colors", t.done ? "accent-fill border-transparent" : "border-border-strong hover:border-accent")}>
                          {t.done && <IconCheck size={12} />}
                        </button>
                        <span className={cn("text-sm flex-1", t.done && "line-through text-muted opacity-70")}>{t.title}</span>
                        {/* Relative human due label; red = overdue (Mobbin) */}
                        <span className={cn("text-xs shrink-0 tabular-nums", dl.overdue ? "text-late font-medium" : "text-muted")}>
                          {t.due_date ? dl.text : ""}
                        </span>
                        <Input
                          type="date"
                          value={t.due_date ?? ""}
                          onChange={(e) => setDate(t.id, e.target.value || null)}
                          className="!w-[140px] shrink-0 text-xs h-8"
                          aria-label="Due date"
                        />
                        <button onClick={() => deleteTodo(t.id)} aria-label="Delete to-do" className="text-muted hover:text-bad cursor-pointer"><IconDelete size={14} /></button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
