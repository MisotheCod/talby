"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { IconRemind, IconClose } from "@/components/icons";

type Notif = { id: string; kind: string; title: string; body: string | null; link: string | null; read: boolean; created_at: string };

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notif[]>([]);
  const [unread, setUnread] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = async () => {
    try {
      const r = await fetch("/api/notifications");
      if (!r.ok) return;
      const d = await r.json();
      setItems(d.notifications ?? []);
      setUnread(d.unread ?? 0);
    } catch { /* not signed in or transient */ }
  };

  useEffect(() => {
    load();
    timer.current = setInterval(load, 60000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, []);

  const markAll = async () => {
    await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ all: true }) });
    setUnread(0);
    setItems((it) => it.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative p-1.5 rounded-lg text-inksoft hover:text-ink hover:bg-card2 cursor-pointer"
      >
        <IconRemind size={18} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full accent-fill text-onaccent text-[10px] font-semibold grid place-items-center tabular-nums">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-[calc(100%+6px)] w-[340px] max-w-[85vw] bg-card border border-line2 rounded-xl shadow-pop z-50 overflow-hidden fade-up">
            <div className="flex items-center justify-between px-4 py-3 border-b border-line">
              <span className="font-semibold text-sm">Notifications</span>
              <div className="flex items-center gap-1">
                {unread > 0 && (
                  <button onClick={markAll} className="text-xs text-inksoft hover:text-ink px-2 py-1 rounded-md hover:bg-card2 cursor-pointer">Mark all read</button>
                )}
                <button onClick={() => setOpen(false)} aria-label="Close" className="p-1 rounded-md text-inksoft hover:text-ink hover:bg-card2 cursor-pointer"><IconClose size={15} /></button>
              </div>
            </div>
            <div className="max-h-[380px] overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-sm text-inksoft text-center py-8">You&apos;re all caught up.</p>
              ) : (
                items.map((n) => {
                  const inner = (
                    <>
                      <div className={cn("flex-1 min-w-0", !n.read && "font-medium")}>
                        <div className="text-sm text-ink leading-snug">{n.title}</div>
                        {n.body && <div className="text-xs text-inksoft mt-0.5">{n.body}</div>}
                        <div className="text-[11px] text-inkfaint mt-1">{timeAgo(n.created_at)}</div>
                      </div>
                      {!n.read && <span className="shrink-0 h-2 w-2 rounded-full accent-fill mt-1.5" />}
                    </>
                  );
                  return n.link ? (
                    <Link key={n.id} href={n.link} onClick={() => { fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: n.id }) }); setOpen(false); }} className="flex items-start gap-2.5 px-4 py-3 border-b border-line last:border-0 hover:bg-card2 cursor-pointer no-underline">
                      {inner}
                    </Link>
                  ) : (
                    <div key={n.id} className="flex items-start gap-2.5 px-4 py-3 border-b border-line last:border-0">
                      {inner}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
