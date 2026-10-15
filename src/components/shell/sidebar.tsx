"use client";

/**
 * AppSidebar — SSidebar (spec 01 §3). Expanded / icon rail / mobile drawer.
 * Reads Talby tokens from CSS variables (--t-*), so it re-themes with the
 * active theme+mode automatically. Nav groups Manage + Create, optional
 * badges, the plan/trial card, Settings, and the user button + account menu.
 * Empty accounts (fresh) show no counts (spec: no counts for empty accounts).
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  IconGrid, IconBriefcase, IconCalendar, IconMoney, IconIdea, IconNotes,
  IconSettings, IconDown, IconClose,
} from "@/components/icons";

export type NavKey =
  | "overview" | "deals" | "calendar" | "payments" | "ideas" | "todos" | "settings";

export interface SidebarCounts {
  deals?: string | null;
  paymentsLate?: string | null;
  ideas?: string | null;
  todos?: string | null;
}

export interface PlanCard {
  title: string;
  right?: string;
  sub: string;
  cta: string;
  dot: string;
  pct?: number; // 0..100, draws the meter bar when set
}

const NAV: { key: NavKey; label: string; href: string; group: "manage" | "create" }[] = [
  { key: "overview", label: "Overview", href: "/app", group: "manage" },
  { key: "deals", label: "Deals", href: "/app/deals", group: "manage" },
  { key: "calendar", label: "Calendar", href: "/app/calendar", group: "manage" },
  { key: "payments", label: "Payments", href: "/app/payments", group: "manage" },
  { key: "ideas", label: "Ideas", href: "/app/ideas", group: "create" },
  { key: "todos", label: "To-dos", href: "/app/todos", group: "create" },
];

const ICONS: Record<NavKey, React.ReactNode> = {
  overview: <IconGrid size={16} />,
  deals: <IconBriefcase size={16} />,
  calendar: <IconCalendar size={16} />,
  payments: <IconMoney size={16} />,
  ideas: <IconIdea size={16} />,
  todos: <IconNotes size={16} />,
  settings: <IconSettings size={16} />,
};

function initials(name: string): string {
  const cleaned = name.replace(/[^A-Za-z]/g, "");
  if (!name.includes(".")) return (name[0] || "T").toUpperCase();
  return cleaned.slice(0, 2).toUpperCase() || "T";
}

export function AppSidebar({
  active,
  collapsed = false,
  drawer = false,
  fresh = false,
  counts = {},
  user = "",
  handle = "",
  planCard,
  planName,
  onClose,
  onSettings,
}: {
  active: NavKey;
  collapsed?: boolean;
  drawer?: boolean;
  fresh?: boolean;
  counts?: SidebarCounts;
  user?: string;
  handle?: string;
  planCard?: PlanCard | null;
  planName?: string;
  onClose?: () => void;
  onSettings?: (tab: string) => void;
}) {
  const path = usePathname();
  const open = drawer || !collapsed;
  const [userOpen, setUserOpen] = useState(false);
  const [tip, setTip] = useState<{ label: string; badge?: string; top: number; left: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setTip(null); }, [collapsed]);
  useEffect(() => { setUserOpen(false); }, [path]);

  const badgeFor = (k: NavKey): string | null => {
    if (fresh) return null;
    if (k === "deals") return counts.deals ?? null;
    if (k === "payments") return counts.paymentsLate ?? null;
    if (k === "ideas") return counts.ideas ?? null;
    if (k === "todos") return counts.todos ?? null;
    return null;
  };

  const showTip = (label: string, badge: string | null) => (e: React.MouseEvent) => {
    if (open) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTip({ label, badge: badge ?? undefined, top: Math.round(r.top + r.height / 2), left: Math.round(r.right + 12) });
  };

  const itemStyle = (on: boolean, badgeWarn: boolean) =>
    ({
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: open ? "flex-start" : "center",
      gap: 10,
      height: 36,
      padding: open ? "0 10px" : "0",
      boxSizing: "border-box",
      borderRadius: "var(--t-r-item)",
      background: on ? "var(--t-nav-on)" : "transparent",
      color: "var(--t-fg)",
      fontSize: 14,
      fontWeight: on ? 500 : 400,
      textDecoration: "none",
      whiteSpace: "nowrap",
      overflow: "hidden",
      ["--hv" as string]: on ? "var(--t-nav-on)" : "var(--t-nav-hv)",
    }) as React.CSSProperties;

  const groups: { label: string; key: "manage" | "create" }[] = [
    { label: "Manage", key: "manage" },
    { label: "Create", key: "create" },
  ];

  return (
    <div
      ref={wrapRef}
      className="relative box-border h-screen"
      style={{ padding: drawer ? 0 : "8px 0 8px 8px", background: "var(--t-page)", fontFamily: "var(--t-body-fam)" }}
    >
      <div
        className="relative box-border flex h-full flex-col gap-0.5"
        style={{
          padding: `12px ${open ? 10 : 8}px 10px`,
          overflowY: open ? "auto" : "visible",
          background: "var(--t-side)",
          backdropFilter: "var(--t-side-fx)",
          WebkitBackdropFilter: "var(--t-side-fx)",
          border: drawer ? "none" : "1px solid var(--t-side-border)",
          borderRadius: drawer ? 0 : "var(--t-r-card)",
          boxShadow: drawer ? "none" : "var(--t-sh-card)",
          transition: "background-color .3s ease, border-color .3s ease",
        }}
      >
        {drawer && (
          <div className="mb-1.5 flex h-10 items-center justify-between pl-2.5">
            <span className="font-semibold">Menu</span>
            <button type="button" aria-label="Close menu" onClick={onClose}
              className="tb tg inline-flex size-8 items-center justify-center rounded-[var(--t-r-item)] bg-transparent text-[color:var(--t-fg)]">
              <IconClose size={16} />
            </button>
          </div>
        )}

        <nav aria-label="Main" className="flex flex-col" style={{ gap: open ? 18 : 6 }}>
          {groups.map((g) => (
            <div key={g.key} className="flex flex-col gap-0.5">
              {open && (
                <div className="px-2.5 pt-1 pb-1.5 text-xs font-medium text-[color:var(--t-muted-fg)]">{g.label}</div>
              )}
              {!open && g.key === "create" && (
                <div className="mx-auto my-1 h-px w-6" style={{ background: "var(--t-border)" }} />
              )}
              {NAV.filter((n) => n.group === g.key).map((n) => {
                const on = active === n.key;
                const badge = badgeFor(n.key);
                const warn = n.key === "payments" && !!badge;
                return (
                  <Link
                    key={n.key}
                    href={n.href}
                    aria-current={on ? "page" : undefined}
                    aria-label={badge ? `${n.label}, ${badge}` : n.label}
                    className="tb tg"
                    style={itemStyle(on, warn)}
                    onMouseEnter={showTip(n.label, badge)}
                    onMouseLeave={() => setTip(null)}
                  >
                    <span style={{ flex: "0 0 16px", color: on ? "var(--t-brand-accent)" : "var(--t-muted-fg)", transition: "color .2s ease" }}>
                      {ICONS[n.key]}
                    </span>
                    {open && (
                      <>
                        <span className="min-w-0 flex-1 overflow-hidden text-ellipsis">{n.label}</span>
                        {badge && (
                          <span
                            className="inline-flex h-5 shrink-0 items-center gap-[5px] rounded-[var(--t-r-ctl)] px-[7px] text-xs font-medium tabular-nums"
                            style={{
                              background: warn ? "color-mix(in srgb, #EF4444 15%, transparent)" : "transparent",
                              color: warn ? "var(--t-destr)" : "var(--t-muted-fg)",
                            }}
                          >
                            {warn && <span className="size-1.5 rounded-[3px] bg-[#EF4444]" />}
                            {badge}
                          </span>
                        )}
                      </>
                    )}
                    {!open && warn && (
                      <span className="absolute top-[7px] right-2.5 size-[7px] rounded-full bg-[#EF4444]" style={{ boxShadow: "0 0 0 2px var(--t-side)" }} />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="min-h-6 flex-1" />

        {planCard && (
          <button
            type="button"
            onClick={() => onSettings?.("billing")}
            className="tb a-fade mb-2 flex w-full cursor-pointer flex-col gap-2 rounded-[var(--t-r-tile)] border px-3 pt-2.5 pb-[11px] text-left tb tg"
            style={{ borderColor: "var(--t-side-border)", background: "var(--t-card)", color: "var(--t-fg)", ["--hv" as string]: "var(--t-nav-hv)" } as React.CSSProperties}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="size-[7px] shrink-0 rounded-full" style={{ background: planCard.dot }} />
              <span className="overflow-hidden text-ellipsis text-[13px] font-semibold whitespace-nowrap">{planCard.title}</span>
              {planCard.right ? <span className="ml-auto text-xs whitespace-nowrap text-[color:var(--t-muted-fg)]">{planCard.right}</span> : null}
            </span>
            {planCard.pct != null && (
              <span className="block h-1 overflow-hidden rounded-sm" style={{ background: "var(--t-off)" }}>
                <span className="block h-full rounded-sm" style={{ width: `${planCard.pct}%`, background: "var(--t-brand-accent)" }} />
              </span>
            )}
            <span className="text-xs leading-snug text-[color:var(--t-muted-fg)]">{planCard.sub}</span>
            <span className="text-[13px] font-medium text-[color:var(--t-fg)]">{planCard.cta}</span>
          </button>
        )}

        <Link
          href="/app/settings"
          aria-current={active === "settings" ? "page" : undefined}
          aria-label="Settings"
          className="tb tg"
          style={itemStyle(active === "settings", false)}
          onMouseEnter={showTip("Settings", null)}
          onMouseLeave={() => setTip(null)}
        >
          <span style={{ flex: "0 0 16px", color: active === "settings" ? "var(--t-brand-accent)" : "var(--t-muted-fg)" }}>{ICONS.settings}</span>
          {open && <span>Settings</span>}
        </Link>

        <div className="my-2 h-px" style={{ background: "var(--t-border)" }} />

        <button
          type="button"
          onClick={() => setUserOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={userOpen}
          aria-label="Account menu"
          className="tb tg flex w-full items-center gap-2.5 rounded-[var(--t-r-item)] text-left"
          style={{
            height: 48, padding: open ? "0 6px" : 0, boxSizing: "border-box",
            justifyContent: open ? "flex-start" : "center",
            background: userOpen ? "var(--t-nav-hv)" : "transparent", color: "var(--t-fg)",
            ["--hv" as string]: "var(--t-nav-hv)",
          } as React.CSSProperties}
          onMouseEnter={showTip(user, null)}
          onMouseLeave={() => setTip(null)}
        >
          <span className="inline-flex size-8 shrink-0 items-center justify-center text-xs font-semibold"
            style={{ borderRadius: "var(--t-r-avatar)", background: "var(--t-primary)", color: "var(--t-primary-fg)" }}>
            {initials(user || "T")}
          </span>
          {open && (
            <>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5 leading-tight">
                <span className="overflow-hidden text-ellipsis font-medium whitespace-nowrap">{user}</span>
                <span className="text-xs whitespace-nowrap text-[color:var(--t-muted-fg)]">@{handle}</span>
              </span>
              <span className="shrink-0 text-[color:var(--t-muted-fg)]"><IconDown size={16} /></span>
            </>
          )}
        </button>

        {userOpen && (
          <>
            <div className="fixed inset-0 z-[49]" onClick={() => setUserOpen(false)} />
            <div role="menu" aria-label="Account" className="a-drop absolute z-50 w-60 rounded-[var(--t-r-tile)] p-1.5"
              style={{ left: open ? 8 : 68, bottom: 62, background: "var(--t-card)", color: "var(--t-fg)", border: "1px solid var(--t-border)", boxShadow: "var(--t-sh-pop)", transformOrigin: "bottom left" }}>
              <div className="flex items-center gap-2.5 px-2 pt-1.5 pb-2">
                <span className="inline-flex size-8 shrink-0 items-center justify-center text-xs font-semibold"
                  style={{ borderRadius: "var(--t-r-avatar)", background: "var(--t-primary)", color: "var(--t-primary-fg)" }}>
                  {initials(user || "T")}
                </span>
                <span className="flex min-w-0 flex-col gap-0.5 leading-tight">
                  <span className="font-medium">{user}</span>
                  <span className="text-xs whitespace-nowrap text-[color:var(--t-muted-fg)]">{planName}</span>
                </span>
              </div>
              <div className="mx-[-6px] my-1 h-px" style={{ background: "var(--t-border)" }} />
              {[
                ["account", "Account"],
                ["appearance", "Appearance"],
                ["notifications", "Notifications"],
                ["connections", "Connections"],
                ["billing", "Billing"],
              ].map(([tab, label]) => (
                <button key={tab} type="button" role="menuitem"
                  onClick={() => { setUserOpen(false); onSettings?.(tab); }}
                  className="tb tg flex h-[34px] w-full items-center gap-2.5 rounded-[var(--t-r-item)] px-2.5 text-sm"
                  style={{ color: "var(--t-fg)", ["--hv" as string]: "var(--t-nav-hv)" } as React.CSSProperties}>
                  {label}
                </button>
              ))}
              <div className="mx-[-6px] my-1 h-px" style={{ background: "var(--t-border)" }} />
              <button type="button" role="menuitem"
                className="tb tg flex h-[34px] w-full items-center gap-2.5 rounded-[var(--t-r-item)] px-2.5 text-sm"
                style={{ color: "var(--t-fg)", ["--hv" as string]: "var(--t-nav-hv)" } as React.CSSProperties}>
                Log out
              </button>
            </div>
          </>
        )}
      </div>

      {!open && tip && (
        <div role="tooltip" className="a-fade fixed z-[200] inline-flex h-[30px] items-center gap-2 rounded-[var(--t-r-item)] px-2.5 text-[13px] font-medium whitespace-nowrap"
          style={{ left: tip.left, top: tip.top, transform: "translateY(-50%)", background: "var(--t-fg)", color: "var(--t-card)", boxShadow: "0 6px 18px -6px rgba(0,0,0,0.35)", pointerEvents: "none" }}>
          <span className="absolute top-1/2 -left-1 size-2 -translate-y-1/2 rotate-45 rounded-[1px]" style={{ background: "var(--t-fg)" }} />
          <span className="relative">{tip.label}</span>
          {tip.badge && (
            <span className="relative inline-flex h-[18px] items-center rounded-[9px] px-1.5 text-[11px] font-semibold"
              style={{ background: "#EF4444", color: "#FFFFFF" }}>{tip.badge}</span>
          )}
        </div>
      )}
    </div>
  );
}
