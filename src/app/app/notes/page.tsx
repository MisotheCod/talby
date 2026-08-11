"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { IconCheck, IconPlus, IconDelete } from "@/components/icons";
import { Button, Input } from "@/components/ui";

type Todo = { id: string; title: string; done: boolean; due_date: string | null };

export default function NotesPage() {
  const supabase = createClient();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoInput, setTodoInput] = useState("");
  const [todoDate, setTodoDate] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("todos").select("*").order("created_at", { ascending: true });
    setTodos((data ?? []) as unknown as Todo[]);
  }, [supabase]);
  useEffect(() => { load(); }, [load]);

  const addTodo = async () => {
    if (!todoInput.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("todos").insert({ user_id: user.id, title: todoInput.trim(), due_date: todoDate || null }).select().single();
    if (data) { setTodos([...(todos as Todo[]), data as unknown as Todo]); setTodoInput(""); setTodoDate(""); }
  };

  const toggleTodo = async (id: string, done: boolean) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done } : t)));
    await supabase.from("todos").update({ done }).eq("id", id);
  };

  const deleteTodo = async (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
    await supabase.from("todos").delete().eq("id", id);
  };

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className="space-y-6 fade-up max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">To-dos</h1>
        <p className="text-muted text-sm mt-1">A quiet checklist for the work that moves your deals forward.</p>
      </div>

      {/* To-dos */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">To-dos</h2>
          <span className="text-sm text-muted">{remaining} remaining</span>
        </div>
        <div className="flex gap-2 mb-4 items-center">
          <Input value={todoInput} onChange={(e) => setTodoInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTodo()} placeholder="Add a to-do…" className="!w-auto flex-1 min-w-0" />
          <Input type="date" value={todoDate} onChange={(e) => setTodoDate(e.target.value)} className="!w-[150px] shrink-0" aria-label="Due date" />
          <Button onClick={addTodo}><IconPlus size={16} /></Button>
        </div>
        <ul className="space-y-1">
          {todos.map((t) => (
            <li key={t.id} className="flex items-center gap-2 py-1.5">
              <button onClick={() => toggleTodo(t.id, !t.done)} aria-label="Toggle to-do" className={cn("h-5 w-5 rounded-md border grid place-items-center shrink-0 cursor-pointer", t.done ? "accent-fill border-transparent" : "border-border-strong hover:border-accent")}>
                {t.done && <IconCheck size={12} />}
              </button>
              <span className={cn("text-sm flex-1", t.done && "line-through text-muted")}>{t.title}</span>
              <Input
                type="date"
                value={t.due_date ?? ""}
                onChange={async (e) => {
                  const due = e.target.value || null;
                  setTodos(todos.map((x) => (x.id === t.id ? { ...x, due_date: due } : x)));
                  await supabase.from("todos").update({ due_date: due }).eq("id", t.id);
                }}
                className="!w-[140px] shrink-0 text-xs h-8"
                aria-label="Due date"
              />
              <button onClick={() => deleteTodo(t.id)} aria-label="Delete to-do" className="text-muted hover:text-bad cursor-pointer"><IconDelete size={14} /></button>
            </li>
          ))}
        </ul>
        {todos.length === 0 && <p className="text-sm text-muted">No to-dos yet.</p>}
      </div>
    </div>
  );
}