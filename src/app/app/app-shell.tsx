"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  IconHome,
  IconBriefcase,
  IconCalendar,
  IconMoney,
  IconIdea,
  IconNotes,
  IconPlug,
  IconSettings,
  IconLogout,
} from "@/components/icons";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/app", label: "Overview", icon: IconHome },
  { href: "/app/deals", label: "Deals", icon: IconBriefcase },
  { href: "/app/calendar", label: "Content", icon: IconCalendar },
  { href: "/app/payments", label: "Payments", icon: IconMoney },
  { href: "/app/ideas", label: "Ideas", icon: IconIdea },
  { href: "/app/notes", label: "Notes & To-dos", icon: IconNotes },
  { href: "/app/integrations", label: "Integrations", icon: IconPlug },
];

export function AppShell({
  handler,
  accent,
  plan,
  children,
}: {
  handler: string | null;
  accent: string;
  plan: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const supabase = createClient();

  // Apply the saved accent.
  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accent);
  }, [accent]);

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/app") return pathname === "/app";
    return pathname.startsWith(href);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const nav = (
    <nav className="flex flex-col gap-1 px-3 flex-1">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 h-10 rounded-lg text-sm font-medium transition-colors",
              active
                ? "accent-soft text-foreground font-semibold"
                : "text-muted hover:text-foreground hover:bg-subtle"
            )}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
      <Link
        href="/app/settings"
        onClick={() => setMobileOpen(false)}
        className={cn(
          "flex items-center gap-3 px-3 h-10 rounded-lg text-sm font-medium transition-colors mt-auto",
          isActive("/app/settings")
            ? "accent-soft text-foreground font-semibold"
            : "text-muted hover:text-foreground hover:bg-subtle"
        )}
      >
        <IconSettings size={18} />
        Settings
      </Link>
    </nav>
  );

  return (
    <div className="flex min-h-full w-full">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex flex-col w-60 border-r border-border bg-surface/40 shrink-0">
        <div className="px-6 py-5 flex items-center gap-2.5">
          <span className="h-7 w-7 rounded-lg accent-fill grid place-items-center text-xs font-bold">
            T
          </span>
          <span className="font-display font-semibold text-lg tracking-tight">
            Talby
          </span>
        </div>
        <div className="px-6 pb-4">
          {handler && (
            <div className="text-xs text-muted truncate">@{handler}</div>
          )}
          {plan === "free" && (
            <span className="inline-flex items-center text-[11px] mt-1 px-2 py-0.5 rounded-full border border-border text-muted">
              Free plan
            </span>
          )}
        </div>
        {nav}
        <div className="px-3 pb-4">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 h-10 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-subtle cursor-pointer"
          >
            <IconLogout size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden flex flex-col flex-1 min-w-0">
        <header className="flex items-center justify-between px-4 h-14 border-b border-border bg-surface/60 sticky top-0 z-30 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-md accent-fill grid place-items-center text-[10px] font-bold">
              T
            </span>
            <span className="font-display font-semibold">Talby</span>
          </div>
          <div className="flex items-center gap-2">
            {plan === "free" && handler && (
              <span className="text-[11px] text-muted">@{handler}</span>
            )}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              className="p-2 rounded-lg hover:bg-subtle cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </header>
        {mobileOpen && (
          <div className="border-b border-border bg-surface px-2 py-2 shadow-card z-20">
            {nav}
          </div>
        )}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Main (desktop) */}
      <main className="hidden md:flex flex-1 min-w-0 overflow-y-auto">
        <div className="flex-1 px-6 lg:px-10 py-8 max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
