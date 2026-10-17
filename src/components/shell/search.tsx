"use client";

/**
 * SearchPalette — SCommand (spec 01 §6). Overlay + input + scope chips +
 * Recent + answer card + result groups (Needs attention / Quick actions /
 * Jump to) + Ask Talby row + footer. Keyboard: ↑ ↓ Enter Escape, Cmd/Ctrl K
 * toggles. Data is passed in (groups) so the page can ground it in real rows.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface SearchRow {
  id: string;
  group: "attention" | "actions" | "pages" | "deals" | "payments" | "calendar" | "todos" | "ideas";
  label: string;
  sub?: string;
  meta?: string;
  href?: string;
  action?: string;
}

const SCOPES: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "deals", label: "Deals" },
  { key: "payments", label: "Payments" },
  { key: "calendar", label: "Calendar" },
  { key: "todos", label: "To-dos" },
  { key: "ideas", label: "Ideas" },
  { key: "pages", label: "Pages" },
];

const DEFAULT_ACTIONS: SearchRow[] = [
  { id: "a1", group: "actions", label: "New deal", sub: "Start from scratch", action: "new" },
  { id: "a2", group: "actions", label: "Upload a contract or CSV", sub: "Talby fills in the deal", action: "upload" },
  { id: "a3", group: "actions", label: "Import from Notion", sub: "Connect and pull deals", action: "notion" },
  { id: "a4", group: "actions", label: "Record a payment", sub: "Mark money as received", href: "/app/payments" },
  { id: "a5", group: "actions", label: "Add a to-do", href: "/app/todos" },
  { id: "a6", group: "actions", label: "Save an idea", href: "/app/ideas" },
  { id: "a7", group: "actions", label: "Change theme", sub: "Studio, Sand, Mac and more", action: "appearance" },
  { id: "a8", group: "actions", label: "Switch to dark mode", action: "mode" },
];

const DEFAULT_PAGES: SearchRow[] = [
  { id: "p1", group: "pages", label: "Overview", href: "/app" },
  { id: "p2", group: "pages", label: "Deals", href: "/app/deals" },
  { id: "p3", group: "pages", label: "Calendar", href: "/app/calendar" },
  { id: "p4", group: "pages", label: "Payments", href: "/app/payments" },
  { id: "p5", group: "pages", label: "Ideas", href: "/app/ideas" },
  { id: "p6", group: "pages", label: "To-dos", href: "/app/todos" },
  { id: "p7", group: "pages", label: "Settings", href: "/app/settings" },
];

const RECENT_KEY = "talby.recentSearch";

export function SearchPalette({
  open,
  rows = [],
  answers = [],
  onClose,
  onAction,
}: {
  open: boolean;
  rows?: SearchRow[];
  answers?: { regex: RegExp; title: string; sub: string; cta: string; href: string }[];
  onClose: () => void;
  onAction?: (a: string, payload?: string) => void;
}) {
  const [q, setQ] = useState("");
  const [hi, setHi] = useState(0);
  const [scope, setScope] = useState("all");
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQ(""); setHi(0); setScope("all");
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      setRecent(raw ? (JSON.parse(raw) as string[]).slice(0, 4) : ["late payments", "CeraVe", "8500"]);
    } catch { setRecent(["late payments", "CeraVe", "8500"]); }
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, [open]);

  const remember = useCallback((v: string) => {
    const t = v.trim();
    if (!t) return;
    setRecent((prev) => {
      const next = [t, ...prev.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 5);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const allRows = useMemo(() => [...rows, ...DEFAULT_ACTIONS, ...DEFAULT_PAGES], [rows]);
  const ql = q.trim().toLowerCase();

  const filtered = useMemo(() => {
    let list = allRows;
    if (scope !== "all") list = list.filter((r) => r.group === scope);
    if (ql) {
      list = list.filter((r) => r.label.toLowerCase().includes(ql) || (r.sub ?? "").toLowerCase().includes(ql) || (r.meta ?? "").toLowerCase().includes(ql));
    }
    return list;
  }, [allRows, scope, ql]);

  const answer = useMemo(() => (ql ? answers.find((a) => a.regex.test(ql)) ?? null : null), [ql, answers]);
  const limit = scope === "all" ? (ql ? 4 : 3) : 30;

  const groups: { key: SearchRow["group"]; label: string }[] = [
    { key: "attention", label: "Needs attention" },
    { key: "actions", label: "Quick actions" },
    { key: "deals", label: "Deals" },
    { key: "payments", label: "Payments" },
    { key: "calendar", label: "Calendar" },
    { key: "todos", label: "To-dos" },
    { key: "ideas", label: "Ideas" },
    { key: "pages", label: "Jump to" },
  ];

  const visible = groups
    .map((g) => ({ ...g, items: filtered.filter((r) => r.group === g.key).slice(0, limit) }))
    .filter((g) => g.items.length);

  // flat index: answer card, then rows, then the Ask row
  const flat = useMemo(() => {
    const idx: string[] = [];
    if (answer) idx.push("__answer");
    for (const g of visible) for (const it of g.items) idx.push(it.id);
    if (ql) idx.push("__ask");
    return idx;
  }, [answer, visible, ql]);

  const total = flat.length;

  useEffect(() => { if (hi >= total) setHi(0); }, [total, hi]);

  const activate = useCallback((id: string) => {
    if (id === "__answer" && answer) { remember(q); window.location.href = answer.href; return; }
    if (id === "__ask") { remember(q); onAction?.("ask", q); onClose(); return; }
    const row = allRows.find((r) => r.id === id);
    if (!row) return;
    remember(q);
    if (row.action) { onAction?.(row.action); onClose(); return; }
    if (row.href) window.location.href = row.href;
    else onClose();
  }, [answer, allRows, q, remember, onAction, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[88px]">
      <button aria-label="Close search" className="a-fade absolute inset-0 cursor-default border-0 p-0" style={{ background: "rgba(0,0,0,0.3)" }} onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label="Search" className="a-pop relative flex w-full max-w-[640px] flex-col overflow-hidden rounded-[var(--t-r-card)]"
        style={{ background: "var(--t-card)", color: "var(--t-fg)", border: "1px solid var(--t-border)", boxShadow: "var(--t-sh-pop)" }}>
        <div className="flex h-14 items-center gap-3 pl-[18px] pr-3.5" style={{ borderBottom: "1px solid var(--t-line)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--t-muted-fg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          <input
            ref={inputRef}
            aria-label="Search"
            placeholder="Search deals, payments, to-dos and more"
            autoComplete="off"
            value={q}
            onChange={(e) => { setQ(e.target.value); setHi(0); }}
            onKeyDown={(e) => {
              if (e.key === "Escape") { if (q) { setQ(""); setHi(0); } else onClose(); }
              else if (e.key === "ArrowDown") { e.preventDefault(); setHi((h) => Math.min(total - 1, h + 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setHi((h) => Math.max(0, h - 1)); }
              else if (e.key === "Enter") { e.preventDefault(); const id = flat[hi]; if (id) activate(id); }
            }}
            className="h-[54px] min-w-0 flex-1 border-0 bg-transparent text-base text-[color:var(--t-fg)] outline-none"
          />
          <button type="button" aria-label="Esc" onClick={onClose} className="tb tg inline-flex h-6 items-center rounded-[var(--t-r-ctl)] border px-2 text-[11px]"
            style={{ borderColor: "var(--t-border)", background: "var(--t-card)", color: "var(--t-muted-fg)" }}>Esc</button>
        </div>

        <div role="tablist" aria-label="Search in" className="flex items-center gap-1.5 overflow-x-auto px-3.5 py-2.5" style={{ borderBottom: "1px solid var(--t-line)" }}>
          {SCOPES.map((s) => {
            const on = scope === s.key;
            return (
              <button key={s.key} role="tab" aria-selected={on} onClick={() => { setScope(s.key); setHi(0); inputRef.current?.focus(); }}
                className="tb tt inline-flex h-7 shrink-0 items-center gap-1.5 rounded-[var(--t-r-ctl)] border px-2.5 text-[13px] font-medium"
                style={{ borderColor: on ? "var(--t-primary)" : "var(--t-border)", background: on ? "var(--t-primary)" : "transparent", color: on ? "var(--t-primary-fg)" : "var(--t-muted-fg)" }}>
                {s.label}
              </button>
            );
          })}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2 pt-1.5" style={{ maxHeight: 440 }}>
          {!ql && recent.length > 0 && (
            <div className="a-in flex flex-wrap items-center gap-1.5 px-2 pb-1.5 pt-2.5">
              <span className="mr-1 text-xs font-medium text-[color:var(--t-muted-fg)]">Recent</span>
              {recent.slice(0, 4).map((r) => (
                <button key={r} type="button" onClick={() => setQ(r)} className="tb tg inline-flex h-[26px] items-center rounded-[var(--t-r-ctl)] border-0 px-2.5 text-xs font-medium"
                  style={{ background: "var(--t-fill)", color: "var(--t-fg)", ["--hv" as string]: "var(--t-fill-hover)" } as React.CSSProperties}>{r}</button>
              ))}
            </div>
          )}

          {answer && (
            <a href={answer.href} onClick={() => remember(q)} className="tb a-in mx-1 my-2 flex items-start gap-3.5 rounded-[var(--t-r-tile)] p-3.5"
              style={{ boxShadow: "inset 0 0 0 1px var(--t-line)", color: "var(--t-fg)" }}>
              <span className="grid size-[34px] shrink-0 place-items-center rounded-full" style={{ background: "var(--t-post-bg)", color: "var(--t-post-fg)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4M16 2v4M3 8h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /></svg>
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-xs font-medium text-[color:var(--t-muted-fg)]">Answer</span>
                <span className="text-base font-semibold">{answer.title}</span>
                <span className="text-sm text-[color:var(--t-muted-fg)]">{answer.sub}</span>
              </span>
              <span className="self-center text-[13px] font-medium whitespace-nowrap">{answer.cta} →</span>
            </a>
          )}

          {visible.length === 0 && !answer && ql && (
            <div className="a-fade flex flex-col items-center gap-1.5 px-4 pt-8 pb-4 text-center">
              <p className="font-medium">Nothing matches &ldquo;{q}&rdquo;</p>
              <p className="text-sm text-[color:var(--t-muted-fg)]">Try a brand name, an amount like 8500, or ask Talby below.</p>
            </div>
          )}

          {visible.map((g) => (
            <div key={g.key} className="a-in py-1">
              <div className="flex items-center justify-between px-2.5 pt-2 pb-1 text-xs font-medium text-[color:var(--t-muted-fg)]">
                <span>{g.label}</span>
              </div>
              {g.items.map((it) => {
                const active = flat[hi] === it.id;
                return (
                  <button key={it.id} type="button"
                    onMouseMove={() => setHi(flat.indexOf(it.id))}
                    onClick={() => activate(it.id)}
                    className="tb flex min-h-11 w-full items-center gap-3 rounded-[var(--t-r-item)] px-2.5 py-1.5 text-left"
                    style={{ background: active ? "var(--t-hv)" : "transparent", color: "var(--t-fg)" }}>
                    <span className="min-w-0 flex-1">
                      <span className="block overflow-hidden text-sm font-medium text-ellipsis whitespace-nowrap">{it.label}</span>
                      {it.sub && <span className="block overflow-hidden text-xs text-ellipsis whitespace-nowrap text-[color:var(--t-muted-fg)]">{it.sub}</span>}
                    </span>
                    {it.meta && <span className="shrink-0 text-[13px] font-semibold tabular-nums">{it.meta}</span>}
                    <span className="w-4 shrink-0 text-center text-[color:var(--t-muted-fg)]" style={{ opacity: active ? 1 : 0 }}>↵</span>
                  </button>
                );
              })}
            </div>
          ))}

          {ql && (
            <button type="button" onMouseMove={() => setHi(flat.indexOf("__ask"))} onClick={() => activate("__ask")}
              className="tb mt-1 flex min-h-12 w-full items-center gap-3 rounded-[var(--t-r-item)] px-2.5 py-1.5 text-left"
              style={{ borderTop: "1px solid var(--t-line)", background: flat[hi] === "__ask" ? "var(--t-hv)" : "transparent", color: "var(--t-fg)" }}>
              <span className="grid size-7 shrink-0 place-items-center rounded-full" style={{ background: "var(--t-soft)", color: "var(--t-primary)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="8" width="15" height="12" rx="3.5" /><path d="M10.5 8V5.5" /><circle cx="10.5" cy="4.5" r="1" /></svg>
              </span>
              <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                <span className="font-medium">Ask Talby</span> <span className="text-[color:var(--t-muted-fg)]">about &ldquo;{q}&rdquo;</span>
              </span>
            </button>
          )}
        </div>

        <div className="flex h-10 items-center gap-3.5 px-4 text-xs whitespace-nowrap" style={{ borderTop: "1px solid var(--t-line)", background: "var(--t-hvr)", color: "var(--t-muted-fg)" }}>
          <span className="inline-flex items-center gap-1.5"><Kbd>↑</Kbd><Kbd>↓</Kbd> to move</span>
          <span className="inline-flex items-center gap-1.5"><Kbd>↵</Kbd> to open</span>
          <span className="inline-flex items-center gap-1.5"><Kbd>esc</Kbd> to close</span>
          <span className="flex-1" />
          <span>{ql ? `${flat.length} results` : "Searches deals, payments, calendar, to-dos and ideas"}</span>
        </div>
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[5px] border px-1 text-[11px] font-medium"
      style={{ borderColor: "var(--t-border)", background: "var(--t-card)", color: "var(--t-muted-fg)" }}>{children}</span>
  );
}

/** Global Cmd/Ctrl K toggle. */
export function useCmdK(onToggle: (next: boolean) => void, current: boolean) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onToggle(!current);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onToggle, current]);
}
