"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { applyAccent, ACCENT_PRESETS, DEFAULT_HSL, parseHSL, serializeHSL, type HSL } from "@/lib/accent";
import { FREE_ACTIVE_DEAL_CAP } from "@/lib/config";
import { cn } from "@/lib/utils";
import { ThemePopover } from "@/components/theme-popover";

import {
  IconHome, IconBriefcase, IconCalendar, IconDollar, IconIdea,
  IconNotes, IconLogout, IconSettings,
} from "@/components/icons";

// Nav items, structured per the reference HTML (Manage group + Create group).
const MANAGE_NAV = [
  { href: "/app", label: "Overview", icon: IconHome },
  { href: "/app/deals", label: "Deals", icon: IconBriefcase },
  { href: "/app/calendar", label: "Calendar", icon: IconCalendar },
  { href: "/app/payments", label: "Payments", icon: IconDollar },
];
const CREATE_NAV = [
  { href: "/app/ideas", label: "Ideas", icon: IconIdea },
  { href: "/app/notes", label: "Notes & To-dos", icon: IconNotes },
];

export function AppShell({
  handler,
  accent,
  plan,
  children,
}: {
  handler: string | null;
  accent: string | null;
  plan: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accentState, setAccentState] = useState<HSL>(parseHSL(accent) ?? DEFAULT_HSL);
  const [activeDeals, setActiveDeals] = useState(0);

  // Apply the user's saved accent on load.
  useEffect(() => {
    applyAccent(parseHSL(accent) ?? DEFAULT_HSL);
    setAccentState(parseHSL(accent) ?? DEFAULT_HSL);
  }, [accent]);

  // Load active-deal count for the upsell card (refresh on route change).
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("deals")
        .select("id")
        .eq("active", true)
        .not("status", "eq", "archived");
      setActiveDeals((data ?? []).length);
    })();
  }, [supabase, pathname]);

  // Persist an accent change to the profile + apply live.
  const changeAccent = async (hsl: HSL) => {
    applyAccent(hsl);
    setAccentState(hsl);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ accent: serializeHSL(hsl) }).eq("id", user.id);
    }
  };

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/app") return pathname === "/app";
    return pathname.startsWith(href);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handle = handler ?? "creator";
  const initial = handle.charAt(0).toUpperCase();
  const capUsed = activeDeals;

  const renderNav = () => (
    <nav className="flex flex-col gap-3">
      <div>
        <div className="nav-group">Manage</div>
        {MANAGE_NAV.map((item) => <NavItem key={item.href} {...item} active={isActive(item.href)} onNavigate={() => setMobileOpen(false)} />)}
      </div>
      <div>
        <div className="nav-group">Create</div>
        {CREATE_NAV.map((item) => <NavItem key={item.href} {...item} active={isActive(item.href)} onNavigate={() => setMobileOpen(false)} />)}
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-full w-full">
      {/* ------- Left sidebar (desktop) ------- */}
      <aside className="hidden md:flex flex-col w-[244px] shrink-0 sticky top-0 h-screen bg-rail border-r border-line px-4 py-[22px] gap-1">
        {/* Brand */}
        <Link href="/app/deals" className="flex items-center gap-[9px] font-bold text-[18px] tracking-tight px-2 pb-4">
          <span className="sb-mark" aria-hidden />
          Talby
        </Link>

        {/* User */}
        <div className="flex items-center gap-[11px] px-1.5 pb-[18px] mb-2 border-b border-line">
          <span className="h-[38px] w-[38px] rounded-xl accent-tint-bg accent-ink flex items-center justify-center font-bold text-[15px] flex-none">
            {initial}
          </span>
          <div className="min-w-0">
            <div className="text-sm font-semibold leading-tight truncate">{userName(handler)}</div>
            <div className="text-xs text-inkfaint truncate">@{handle}</div>
          </div>
        </div>

        {renderNav()}

        {/* Sidebar footer: theme control + upsell */}
        <div className="mt-auto pt-4 flex flex-col gap-3">
          <ThemePopover current={accentState} onChange={changeAccent} />
          {plan === "free" && (
            <UpsellCard used={capUsed} cap={FREE_ACTIVE_DEAL_CAP} />
          )}
          <div className="flex items-center justify-between px-2">
            <Link href="/app/settings" className="flex items-center gap-2 text-[13px] text-inksoft hover:text-ink">
              <IconSettings size={16} /> Settings
            </Link>
            <button onClick={signOut} aria-label="Sign out" className="p-1.5 rounded-lg text-inksoft hover:text-ink hover:bg-card2 cursor-pointer">
              <IconLogout size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ------- Mobile top bar ------- */}
      <div className="md:hidden flex flex-col flex-1 min-w-0">
        <header className="flex items-center justify-between px-4 h-14 border-b border-line bg-rail sticky top-0 z-30 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="sb-mark" aria-hidden />
            <span className="font-bold tracking-tight">Talby</span>
          </div>
          {plan === "free" && handler && <span className="text-[11px] text-inksoft">@{handle}</span>}
          <button onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu" className="p-2 rounded-lg hover:bg-card2 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
            </svg>
          </button>
        </header>
        {mobileOpen && (
          <div className="border-b border-line bg-rail px-3 py-3 shadow-card z-20 space-y-4">
            {renderNav()}
            <ThemePopover current={accentState} onChange={changeAccent} />
            {plan === "free" && <UpsellCard used={capUsed} cap={FREE_ACTIVE_DEAL_CAP} />}
            <div className="flex items-center justify-between px-2 pt-1 border-t border-line">
              <button onClick={signOut} className="flex items-center gap-2 text-[13px] text-inksoft"><IconLogout size={16} /> Sign out</button>
            </div>
          </div>
        )}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* ------- Main (desktop) ------- */}
      <main className="hidden md:flex flex-1 min-w-0 overflow-y-auto">
        <div className="flex-1 px-9 py-[30px] pb-12 max-w-[1200px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, label, icon: Icon, active, onNavigate }: { href: string; label: string; icon: React.ComponentType<{ size?: number }>; active: boolean; onNavigate: () => void }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
        active ? "accent-tint-bg accent-ink font-semibold" : "text-inksoft hover:bg-card2 hover:text-ink font-medium"
      )}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}

function UpsellCard({ used, cap }: { used: number; cap: number }) {
  return (
    <div className="accent-tint-bg rounded-[16px] p-4" style={{ marginTop: 12 }}>
      <div className="text-sm font-semibold mb-1 accent-ink">{used} of {cap} deals used</div>
      <div className="text-xs text-inksoft leading-snug mb-3">
        One more and you&apos;ll want unlimited. Good problem to have.
      </div>
      <button className="w-full bg-accent text-onaccent border-none py-2.5 rounded-[11px] font-semibold text-[12.5px] cursor-pointer transition hover:brightness-105 font-sans">
        Go unlimited
      </button>
    </div>
  );
}

function userName(handler: string | null): string {
  if (!handler) return "Creator";
  // Title-case the handle for a friendly display name.
  return handler.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
