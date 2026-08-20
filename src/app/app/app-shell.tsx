"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { applyAccent, applyFont, applyMode, ACCENT_PRESETS, DEFAULT_HSL, DEFAULT_HEAD_FONT, DEFAULT_MODE, parseHSL, serializeHSL, type HSL, type ThemeMode } from "@/lib/accent";
import { FREE_ACTIVE_DEAL_CAP } from "@/lib/config";
import { cn } from "@/lib/utils";
import { ThemeControl } from "@/components/theme-control";

import { IconHome, IconBriefcase, IconCalendar, IconDollar, IconIdea,
  IconNotes, IconLogout, IconSettings, IconMail,
} from "@/components/icons";
import { NotificationBell } from "@/components/notification-bell";

const MANAGE_NAV = [
  { href: "/app", label: "Overview", icon: IconHome },
  { href: "/app/deals", label: "Deals", icon: IconBriefcase },
  { href: "/app/calendar", label: "Calendar", icon: IconCalendar },
  { href: "/app/payments", label: "Payments", icon: IconDollar },
  { href: "/app/inbox", label: "Inbox", icon: IconMail },
];
const CREATE_NAV = [
  { href: "/app/ideas", label: "Ideas", icon: IconIdea },
  { href: "/app/notes", label: "To-dos", icon: IconNotes },
];

export function AppShell({
  handler,
  accent,
  plan,
  headFont,
  avatarUrl,
  themeMode,
  children,
}: {
  handler: string | null;
  accent: string | null;
  plan: string;
  headFont?: string | null;
  avatarUrl?: string | null;
  themeMode?: ThemeMode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accentState, setAccentState] = useState<HSL>(parseHSL(accent) ?? DEFAULT_HSL);
  const [fontState, setFontState] = useState<string>(headFont ?? DEFAULT_HEAD_FONT);
  const [modeState, setModeState] = useState<ThemeMode>(themeMode ?? DEFAULT_MODE);
  const [activeDeals, setActiveDeals] = useState(0);

  // Apply the user's saved accent + heading font on load.
  useEffect(() => {
    applyAccent(parseHSL(accent) ?? DEFAULT_HSL, themeMode ?? DEFAULT_MODE);
    setAccentState(parseHSL(accent) ?? DEFAULT_HSL);
    applyFont(headFont ?? DEFAULT_HEAD_FONT);
    setFontState(headFont ?? DEFAULT_HEAD_FONT);
    applyMode(themeMode ?? DEFAULT_MODE);
    setModeState(themeMode ?? DEFAULT_MODE);
  }, [accent, headFont, themeMode]);

  // Load active-deal count for the upsell card + Deals nav badge.
  // Matches the Deals page count exactly (active && not archived).
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

  // Preview applies live WITHOUT mutating the persisted state (so the
  // saved baseline is preserved for revert); save applies + persists.
  const previewAccent = (hsl: HSL) => {
    applyAccent(hsl, modeState);
  };
  const saveAccent = async (hsl: HSL) => {
    applyAccent(hsl, modeState);
    setAccentState(hsl);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ accent: serializeHSL(hsl) }).eq("id", user.id);
    }
  };
  const previewFont = (name: string) => {
    applyFont(name);
  };
  const saveFont = async (name: string) => {
    applyFont(name);
    setFontState(name);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ head_font: name }).eq("id", user.id);
    }
  };

  // Light/dark mode: preview applies live; save persists to the profile.
  // Also re-apply the accent for the new mode so accent-tinted surfaces (nav,
  // chips, buttons) flip their tint/ink along with the structural tokens.
  const previewMode = (m: ThemeMode) => {
    applyMode(m);
    applyAccent(accentState, m);
    setModeState(m);
  };
  const saveMode = async (m: ThemeMode) => {
    applyMode(m);
    applyAccent(accentState, m);
    setModeState(m);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ theme_mode: m }).eq("id", user.id);
    }
  };

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/app") return pathname === "/app";
    return pathname.startsWith(href);
  };

  // Content max-width: the wide cap applies to every page so the whole app
  // keeps a consistent column width. No per-page variance.
  const isWide = true;

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handle = handler ?? "creator";
  const initial = handle.charAt(0).toUpperCase();
  const avatarImg = avatarUrl
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatarUrl}`
    : null;
  const capUsed = activeDeals;
  const pageTitle = pathname === "/app" ? "Overview"
    : MANAGE_NAV.find((n) => pathname.startsWith(n.href))?.label
    ?? CREATE_NAV.find((n) => pathname.startsWith(n.href))?.label
    ?? "Overview";

  const nav = (
    <>
      <div>
        <div className="nav-group">Manage</div>
        {MANAGE_NAV.map((item) => (
          <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon}
            active={isActive(item.href)} badge={item.href === "/app/deals" ? activeDeals : undefined}
            onNavigate={() => setMobileOpen(false)} />
        ))}
      </div>
      <div>
        <div className="nav-group">Create</div>
        {CREATE_NAV.map((item) => (
          <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon}
            active={isActive(item.href)} onNavigate={() => setMobileOpen(false)} />
        ))}
      </div>
    </>
  );

  const footer = (
    <div className="side-foot">
      {plan === "free" && <UpsellCard used={capUsed} cap={FREE_ACTIVE_DEAL_CAP} />}
      <div className="flex items-center justify-between px-2 pt-2">
        <Link href="/app/settings" className="flex items-center gap-2 text-[13px] text-inksoft hover:text-ink no-underline">
          <IconSettings size={16} /> Settings
        </Link>
        <button onClick={signOut} aria-label="Sign out" className="p-1.5 rounded-lg text-inksoft hover:text-ink hover:bg-card2 cursor-pointer">
          <IconLogout size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="app-shell shell">
      {/* Mobile drawer backdrop */}
      <div className={cn("backdrop", mobileOpen && "show")} onClick={() => setMobileOpen(false)} />

      {/* Sidebar (desktop floating card; mobile drawer) */}
      <aside className={cn("side", mobileOpen && "open")} id="side">
        <div className="side-user">
          <span className="avatar overflow-hidden grid place-items-center">{avatarImg ? <img src={avatarImg} alt="" className="h-full w-full object-cover" /> : initial}</span>
          <div className="min-w-0">
            <div className="nm truncate">{userName(handler)}</div>
            <div className="hd truncate">@{handle}</div>
          </div>
          <span className="ml-auto"><NotificationBell /></span>
        </div>
        <nav className="flex flex-col gap-1">{nav}</nav>
        {footer}
      </aside>

      {/* Content column (topbar on mobile + main) */}
      <div className="min-w-0">
        <div className="topbar">
          <button className="hamb" aria-label="Open menu" onClick={() => setMobileOpen((o) => !o)}>
            <svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
          <span className="tt">{pageTitle}</span>
          <div className="flex items-center gap-1">
            <NotificationBell />
            <span className="avatar overflow-hidden grid place-items-center">{avatarImg ? <img src={avatarImg} alt="" className="h-full w-full object-cover" /> : initial}</span>
          </div>
        </div>
        <main className={cn("main", isWide ? "main-wide" : "main-narrow")}>
          {children}
        </main>
        <ThemeControl current={accentState} currentFont={fontState} currentMode={modeState} onPreview={previewAccent} onSave={saveAccent} onPreviewFont={previewFont} onSaveFont={saveFont} onPreviewMode={previewMode} onSaveMode={saveMode} />
      </div>
    </div>
  );
}

function NavItem({ href, label, icon: Icon, active, badge, onNavigate }: {
  href: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }>;
  active: boolean; badge?: number; onNavigate: () => void;
}) {
  return (
    <Link href={href} onClick={onNavigate} className={cn("nav-item no-underline", active && "on")}>
      <Icon size={18} className="ic" />
      {label}
      {badge !== undefined && <span className="badge">{badge}</span>}
    </Link>
  );
}

function UpsellCard({ used, cap }: { used: number; cap: number }) {
  return (
    <div className="upsell">
      <div className="t">{used} of {cap} deals used</div>
      <div className="d">One more and you&apos;ll want unlimited. Good problem to have.</div>
      <a href="/#pricing" className="btn3d full no-underline block text-center">Go unlimited</a>
    </div>
  );
}

function userName(handler: string | null): string {
  if (!handler) return "Creator";
  return handler.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
