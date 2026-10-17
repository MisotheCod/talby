"use client";

/**
 * NotificationsPanel — STopbar §4.3/4.4 (+ NoEmpty empty state). Header with
 * unread count + Mark all read, All/Unread tabs, grouped rows by kind, and the
 * "You are all caught up" empty state. Anchored under the bell.
 */

import { useEffect, useRef, useState } from "react";

export type NotifKind = "late" | "post" | "due" | "paid" | "todo";
export interface Notif {
  id: string;
  group: "Today" | "Yesterday" | "Earlier";
  kind: NotifKind;
  title: string;
  body: string;
  time: string;
  read?: boolean;
}

const KIND: Record<NotifKind, { bg: string; fg: string; d: string }> = {
  late: { bg: "var(--t-bad-bg)", fg: "var(--t-bad-fg)", d: "M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" },
  post: { bg: "var(--t-post-bg)", fg: "var(--t-post-fg)", d: "m16 13 5.22 3.48a.5.5 0 0 0 .78-.42V7.94a.5.5 0 0 0-.78-.42L16 11M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" },
  due: { bg: "var(--t-warn-bg)", fg: "var(--t-warn-fg)", d: "M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" },
  paid: { bg: "var(--t-ok-bg)", fg: "var(--t-ok-fg)", d: "M20 6 9 17l-5-5" },
  todo: { bg: "var(--t-tile)", fg: "var(--t-fg)", d: "m3 17 2 2 4-4M3 7l2 2 4-4M13 6h8M13 12h8M13 18h8" },
};

export function NotificationsPanel({
  open,
  items,
  mob = false,
  onClose,
  onSettings,
}: {
  open: boolean;
  items: Notif[];
  mob?: boolean;
  onClose: () => void;
  onSettings?: () => void;
}) {
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [read, setRead] = useState<Record<string, boolean>>({});
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, onClose]);

  if (!open) return null;

  const isRead = (n: Notif) => read[n.id] ?? n.read ?? false;
  const unread = items.filter((n) => !isRead(n)).length;
  const shown = tab === "unread" ? items.filter((n) => !isRead(n)) : items;
  const groups: Notif["group"][] = ["Today", "Yesterday", "Earlier"];

  return (
    <>
      <div className="fixed inset-0 z-[1]" onMouseDown={onClose} />
      <section
        ref={ref}
        role="dialog"
        aria-label="Notifications"
        className="a-drop absolute z-[2] flex flex-col overflow-hidden rounded-[var(--t-r-card)]"
        style={{
          top: 42, right: -44, width: mob ? "auto" : 384,
          background: "var(--t-card)", color: "var(--t-fg)",
          border: "1px solid var(--t-border)", boxShadow: "var(--t-sh-pop)", transformOrigin: "top right",
        }}
      >
        <div className="flex items-center gap-2 px-2.5 pt-3.5 pb-2.5 pl-4">
          <span className="text-[15px] font-semibold">Notifications</span>
          {unread > 0 && (
            <span className="inline-flex h-5 items-center rounded-[var(--t-r-ctl)] px-[7px] text-[11px] font-semibold tabular-nums"
              style={{ background: "var(--t-primary)", color: "var(--t-primary-fg)" }}>{unread} new</span>
          )}
          <span className="flex-1" />
          <button type="button" onClick={() => setRead(Object.fromEntries(items.map((n) => [n.id, true])))}
            className="tb tg h-7 rounded-[var(--t-r-ctl)] px-2.5 text-[13px]" style={{ opacity: unread ? 1 : 0.4, color: "var(--t-fg)" }}>
            Mark all read
          </button>
        </div>

        <div className="px-4 pb-2.5">
          <div role="tablist" aria-label="Show" className="inline-flex h-8 items-center gap-0.5 rounded-[var(--t-r-ctl)] p-[3px]"
            style={{ background: "var(--t-fill)" }}>
            {(["all", "unread"] as const).map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
                className="tb tt inline-flex h-full items-center rounded-[var(--t-r-ctl)] px-3 text-[13px] font-medium"
                style={{ background: tab === t ? "var(--t-tab-on)" : "transparent", color: tab === t ? "var(--t-fg)" : "var(--t-muted-fg)", boxShadow: tab === t ? "var(--t-tab-sh)" : "none" }}>
                {t === "all" ? "All" : `Unread${unread ? ` (${unread})` : ""}`}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: mob ? "60vh" : 420, borderTop: "1px solid var(--t-line)", padding: "0 6px 6px" }}>
          {shown.length === 0 ? (
            <div className="a-fade flex flex-col items-center gap-2 px-4 py-9 text-center">
              <span className="grid size-10 place-items-center rounded-full" style={{ background: "var(--t-ok-bg)", color: "var(--t-ok-fg)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </span>
              <p className="font-medium">You are all caught up</p>
              <p className="text-[13px] text-[color:var(--t-muted-fg)]">New alerts about payments and posts show up here.</p>
            </div>
          ) : (
            groups.map((g) => {
              const rows = shown.filter((n) => n.group === g);
              if (!rows.length) return null;
              return (
                <div key={g}>
                  <div className="px-2.5 pt-3 pb-1 text-xs font-medium text-[color:var(--t-muted-fg)]">{g}</div>
                  {rows.map((n) => {
                    const k = KIND[n.kind];
                    const r = isRead(n);
                    return (
                      <button key={n.id} type="button" onClick={() => setRead((p) => ({ ...p, [n.id]: true }))}
                        className="tb tg flex min-h-[58px] w-full items-center gap-3 rounded-[var(--t-r-item)] px-2.5 py-2 text-left"
                        style={{ color: "var(--t-fg)", ["--hv" as string]: "var(--t-hv)" } as React.CSSProperties}>
                        <span className="grid size-[34px] shrink-0 place-items-center rounded-full" style={{ background: k.bg, color: k.fg }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={k.d} /></svg>
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span className="overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontWeight: r ? 400 : 500 }}>{n.title}</span>
                          <span className="overflow-hidden text-[13px] text-ellipsis whitespace-nowrap text-[color:var(--t-muted-fg)]">{n.body}</span>
                        </span>
                        <span className="flex shrink-0 flex-col items-end gap-1.5">
                          <span className="text-xs whitespace-nowrap text-[color:var(--t-muted-fg)]">{n.time}</span>
                          <span className="size-[7px] rounded-full transition-colors" style={{ background: r ? "transparent" : "var(--t-brand-accent)" }} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between gap-2 px-2.5 py-2 pl-4" style={{ borderTop: "1px solid var(--t-line)" }}>
          <span className="text-[13px] whitespace-nowrap text-[color:var(--t-muted-fg)]">Payments, posts and to-dos</span>
          <button type="button" onClick={onSettings} className="tb tg h-7 rounded-[var(--t-r-ctl)] px-2.5 text-[13px]" style={{ color: "var(--t-fg)" }}>Settings</button>
        </div>
      </section>
    </>
  );
}
