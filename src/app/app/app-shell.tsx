"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { subscribeDataChange, subscribeUpgradePrompt } from "@/lib/data-events";
import { hasFullAccess, type PlanStatus } from "@/lib/access";
import { UpgradeModal } from "@/components/upgrade-modal";
import { applyAccent, applyFont, applyMode, ACCENT_PRESETS, DEFAULT_HSL, DEFAULT_HEAD_FONT, DEFAULT_MODE, parseHSL, serializeHSL, type HSL, type ThemeMode } from "@/lib/accent";
import { cn } from "@/lib/utils";
import { ThemeControl } from "@/components/theme-control";
import { CoachTour, type TourStep } from "@/components/coach-tour";
import { NotificationPrompt } from "@/components/notification-prompt";

import { IconHome, IconBriefcase, IconCalendar, IconDollar, IconIdea,
  IconNotes, IconLogout, IconSettings,
} from "@/components/icons";
import { NotificationBell } from "@/components/notification-bell";
import { AssistantLauncher } from "@/components/assistant";
import { Button } from "@/components/ui";

const MANAGE_NAV = [
  { href: "/app", label: "Overview", icon: IconHome },
  { href: "/app/deals", label: "Deals", icon: IconBriefcase },
  { href: "/app/calendar", label: "Calendar", icon: IconCalendar },
  { href: "/app/payments", label: "Payments", icon: IconDollar },
];
const CREATE_NAV = [
  { href: "/app/ideas", label: "Ideas", icon: IconIdea },
  { href: "/app/notes", label: "To-dos", icon: IconNotes },
];

export function AppShell({
  handler,
  accent,
  plan,
  planStatus,
  trialEnd,
  headFont,
  avatarUrl,
  themeMode,
  children,
}: {
  handler: string | null;
  accent: string | null;
  plan: string;
  planStatus?: string | null;
  trialEnd?: string | null;
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
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  // Read-only derivation. Pinned owner accounts are plan_status='active' in
  // the DB (and pinned at the webhook/cron layer), so they pass hasFullAccess
  // here; everyone else derives from plan_status + trial_end via the shared
  // helper (mirrors RLS exactly).
  const readOnly = !hasFullAccess(
    (planStatus ?? "none") as PlanStatus,
    trialEnd ?? null
  );

  // Trial banner: show "X days left" during trialing, with a tighter "ends in
  // X days" wording in the final 3 days. Hidden once read-only (the read-only
  // banner takes over) or once paid.
  const isTrialing = (planStatus ?? "none") === "trialing";
  const daysLeft = trialEnd
    ? Math.max(0, Math.ceil((new Date(trialEnd).getTime() - Date.now()) / 86400_000))
    : 0;
  const trialBannerText =
    daysLeft <= 3
      ? `Your free trial ends in ${daysLeft} day${daysLeft === 1 ? "" : "s"}.`
      : `${daysLeft} days left in your free trial.`;

  // Surface the upgrade modal when a write is blocked read-only anywhere.
  useEffect(() => subscribeUpgradePrompt(() => setUpgradeOpen(true)), []);

  // Refs always hold the LATEST applied accent/mode. The ThemeControl popover can
  // trigger onSave->saveAccent then onSaveMode->saveMode in one tick; those run on
  // stale closure state across renders, so reading refs avoids reverting a just-saved
  // accent when the mode save re-applies the accent for the new theme mode.
  const accentRef = useRef<HSL>(parseHSL(accent) ?? DEFAULT_HSL);
  const modeRef = useRef<ThemeMode>(themeMode ?? DEFAULT_MODE);

  // Apply the user's saved accent + heading font on load.
  useEffect(() => {
    const saved = parseHSL(accent) ?? DEFAULT_HSL;
    const m = themeMode ?? DEFAULT_MODE;
    applyAccent(saved, m);
    setAccentState(saved);
    applyFont(headFont ?? DEFAULT_HEAD_FONT);
    setFontState(headFont ?? DEFAULT_HEAD_FONT);
    applyMode(m);
    setModeState(m);
    accentRef.current = saved;
    modeRef.current = m;
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

  // Keep the Deals nav badge current when deals are created/archived/deleted
  // without navigating (the router cache keeps this shell mounted).
  useEffect(() => {
    const unsub = subscribeDataChange(() => {
      supabase
        .from("deals")
        .select("id")
        .eq("active", true)
        .not("status", "eq", "archived")
        .then(({ data }) => setActiveDeals((data ?? []).length));
    });
    return unsub;
  }, [supabase]);

  // One-time onboarding coach tour: show only if the user hasn't seen it yet,
  // on the Overview (/app). `tour_seen` lives on the profile so it never
  // re-appears across devices. The tour fires AFTER setup, so it spotlights a
  // personalized dashboard.
  const [tourOpen, setTourOpen] = useState(false);
  const [notifPrompt, setNotifPrompt] = useState(false);
  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("tour_seen").eq("id", user.id).single();
      const seen = (data as unknown as { tour_seen?: boolean } | null)?.tour_seen;
      if (active && !seen && pathname === "/app") setTourOpen(true);
    })();
    return () => { active = false; };
  }, [supabase, pathname]);

  const completeTour = async () => {
    setTourOpen(false);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from("profiles").update({ tour_seen: true }).eq("id", user.id);
    // Permissions come last: after the tour the ask is concrete.
    setNotifPrompt(true);
  };

  // Tour spotlights on the live, personalized dashboard. Free users finish on
  // a step they can act on — never on a paywall.
  const tourSteps: TourStep[] = [
    { selector: "#side nav", title: "Your command center", body: "Everything lives in the left rail: Deals, Calendar, Payments, Ideas and To-dos. Pick a section and Talby is organized around it.", side: "right" },
    { selector: "[data-tour=add-deal]", title: "Add your first deal", body: "Add a deal from here, brand, deliverable, value, due date, and payment terms. It flows into your calendar and payments automatically.", side: "bottom" },
    { selector: "[data-tour=assistant]", title: "Ask Talby Assistant", body: plan === "paid"
      ? "Ask anything about your deals, contracts, payments, and calendar, it answers only from your own data."
      : "Talby Assistant reads your deals, contracts, and calendar and answers questions about them as you work.", side: "top" },
  ];

  // Preview applies live WITHOUT mutating the persisted state (so the
  // saved baseline is preserved for revert); save applies + persists.
  const previewAccent = (hsl: HSL) => {
    applyAccent(hsl, modeRef.current);
    accentRef.current = hsl;
  };
  const saveAccent = async (hsl: HSL) => {
    applyAccent(hsl, modeRef.current);
    accentRef.current = hsl;
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
  // Uses accentRef/modeRef (not stale closure state) so a combined save of a
  // new accent AND a new mode within one popover session keeps the latest value.
  const previewMode = (m: ThemeMode) => {
    applyMode(m);
    applyAccent(accentRef.current, m);
    modeRef.current = m;
    setModeState(m);
  };
  const saveMode = async (m: ThemeMode) => {
    applyMode(m);
    applyAccent(accentRef.current, m);
    modeRef.current = m;
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
      <ThemeControl current={accentState} currentFont={fontState} currentMode={modeState}
        onPreview={previewAccent} onSave={saveAccent} onPreviewFont={previewFont}
        onSaveFont={saveFont} onPreviewMode={previewMode} onSaveMode={saveMode}
        variant="row" />
      <Link href="/app/settings" className="settings-link">
        <IconSettings size={18} className="ic" />
        <span className="flex-1">Settings</span>
        <button onClick={signOut} aria-label="Sign out" className="p-1.5 rounded-lg text-inksoft hover:text-ink hover:bg-card2 cursor-pointer">
          <IconLogout size={16} />
        </button>
      </Link>
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
          <div className="ml-auto flex items-center gap-1.5">
            <NotificationBell />
            <span className="avatar overflow-hidden grid place-items-center">{avatarImg ? <img src={avatarImg} alt="" className="h-full w-full object-cover" /> : initial}</span>
          </div>
        </div>
        <main className={cn("main", isWide ? "main-wide" : "main-narrow")}>
          {isTrialing && !readOnly && (
            <div className="readonly-banner" role="status">
              <span className="readonly-banner-text">{trialBannerText}</span>
              <Button type="button" variant="secondary" size="sm" onClick={() => setUpgradeOpen(true)}>Subscribe</Button>
            </div>
          )}
          {readOnly && (
            <div className="readonly-banner" role="status">
              <span className="readonly-banner-text">Your free trial has ended. You can view and export everything.</span>
              <Button type="button" variant="secondary" size="sm" onClick={() => setUpgradeOpen(true)}>Subscribe</Button>
            </div>
          )}
          {children}
        </main>
        <AssistantLauncher />
        <CoachTour open={pathname === "/app" && tourOpen} steps={tourSteps} onDone={completeTour} />
        {notifPrompt && <NotificationPrompt onDone={() => setNotifPrompt(false)} />}
        {upgradeOpen && <UpgradeModal onClose={() => setUpgradeOpen(false)} />}
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

function userName(handler: string | null): string {
  if (!handler) return "Creator";
  return handler.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
