"use client";

/**
 * AppTopbar — STopbar (spec 01 §4). Nav toggle, page title, search pill,
 * appearance, notifications bell (+ panel), Add deal button (+ menu).
 */

import { useState } from "react";
import { IconSearch, IconPlus, IconDown } from "@/components/icons";
import { AddDealMenu, type AddKind } from "@/components/shell/add-deal-menu";
import { NotificationsPanel, type Notif } from "@/components/shell/notifications";

function AppearanceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 2v20" />
      <path d="M12 6a6 6 0 0 1 0 12z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.27 21a2 2 0 0 0 3.46 0M3.26 15.33A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.67C19.41 13.96 18 12.5 18 8A6 6 0 0 0 6 8c0 4.5-1.41 5.96-2.74 7.33" />
    </svg>
  );
}

function PanelLeftIcon({ mobile }: { mobile: boolean }) {
  return mobile ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 3v18" /></svg>
  );
}

export function AppTopbar({
  title,
  mob = false,
  notifications = [],
  onNav,
  onSearch,
  onAppearance,
  onAddPick,
  onBellSettings,
}: {
  title: string;
  mob?: boolean;
  notifications?: Notif[];
  onNav?: () => void;
  onSearch?: () => void;
  onAppearance?: () => void;
  onAddPick?: (k: AddKind) => void;
  onBellSettings?: () => void;
}) {
  const [menu, setMenu] = useState<"bell" | "add" | null>(null);
  const unread = notifications.filter((n) => !n.read).length;
  const ico =
    "tb tg inline-flex size-8 items-center justify-center rounded-[var(--t-r-ctl)] border-0 bg-transparent text-[color:var(--t-fg)]";

  return (
    <header className="relative z-40 flex h-14 items-center gap-1.5">
      <button type="button" className={ico} aria-label={mob ? "Open menu" : "Toggle sidebar"} onClick={() => { setMenu(null); onNav?.(); }}>
        <PanelLeftIcon mobile={mob} />
      </button>
      <span className="mx-1.5 h-4 w-px" style={{ background: "var(--t-border-strong)" }} />
      <h1 className="overflow-hidden text-[14px] font-medium text-ellipsis whitespace-nowrap" title={title}>{title}</h1>
      <span className="flex-1" />

      {!mob ? (
        <button type="button" onClick={() => { setMenu(null); onSearch?.(); }}
          className="tb tg inline-flex h-[34px] w-[260px] cursor-pointer items-center gap-2 rounded-[var(--t-r-ctl)] border pl-3 pr-1.5 text-left"
          style={{ borderColor: "var(--t-border)", background: "var(--t-card)", color: "var(--t-muted-fg)", ["--hv" as string]: "var(--t-hover-card)" } as React.CSSProperties}>
          <span className="shrink-0"><IconSearch size={15} /></span>
          <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm">Search everything</span>
          <span className="inline-flex h-[22px] shrink-0 items-center rounded-[var(--t-r-ctl)] px-[7px] text-[11px] font-medium"
            style={{ background: "var(--t-fill)", color: "var(--t-muted-fg)" }}>⌘K</span>
        </button>
      ) : (
        <button type="button" className={ico} aria-label="Search" onClick={() => { setMenu(null); onSearch?.(); }}><IconSearch size={16} /></button>
      )}

      <button type="button" className={ico} aria-label="Appearance" onClick={() => { setMenu(null); onAppearance?.(); }}><AppearanceIcon /></button>

      <div className="relative">
        <button
          type="button"
          className={ico}
          aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
          aria-haspopup="dialog"
          aria-expanded={menu === "bell"}
          onClick={() => setMenu((m) => (m === "bell" ? null : "bell"))}
        >
          <span className="relative inline-flex">
            <BellIcon />
            {unread > 0 && (
              <span className="a-ping absolute -top-0.5 -right-1 size-[7px] rounded-full bg-[#EF4444]" style={{ boxShadow: "0 0 0 2px var(--t-page)" }} />
            )}
          </span>
        </button>
        <NotificationsPanel open={menu === "bell"} items={notifications} mob={mob} onClose={() => setMenu(null)} onSettings={onBellSettings} />
      </div>

      <div className="relative ml-1">
        {!mob ? (
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menu === "add"}
            onClick={() => setMenu((m) => (m === "add" ? null : "add"))}
            className="tb inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[var(--t-r-ctl)] border-0 px-3.5 text-sm font-medium hover:opacity-[.88]"
            style={{ background: "var(--t-primary)", color: "var(--t-primary-fg)", boxShadow: "var(--t-btn-sh)" }}
          >
            <IconPlus size={15} />
            Add deal
            <span className="mx-1 h-4 w-px opacity-25" style={{ background: "currentColor" }} />
            <IconDown size={14} style={{ transform: menu === "add" ? "rotate(180deg)" : "none", transition: "transform .2s ease" }} />
          </button>
        ) : (
          <button type="button" className="tb inline-flex size-8 items-center justify-center rounded-[var(--t-r-ctl)] border-0 hover:opacity-[.88]"
            aria-label="Add deal" aria-haspopup="menu" aria-expanded={menu === "add"} onClick={() => setMenu((m) => (m === "add" ? null : "add"))}
            style={{ background: "var(--t-primary)", color: "var(--t-primary-fg)" }}>
            <IconPlus size={16} style={{ transform: menu === "add" ? "rotate(45deg)" : "none", transition: "transform .2s ease" }} />
          </button>
        )}
        <AddDealMenu open={menu === "add"} mob={mob} onClose={() => setMenu(null)}
          onPick={(k) => { setMenu(null); onAddPick?.(k); }} />
      </div>
    </header>
  );
}
