"use client";

/**
 * AppFrame — the shell layout (spec 01 §2): desktop rail (expanded or icon)
 * on the left, top bar + page content on the right, and a mobile drawer that
 * slides the same sidebar in under 768px. Reads Talby tokens from CSS vars.
 * The shared overlays (search, notifications, add deal, appearance, assistant)
 * mount in the page that renders this frame.
 */

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AppSidebar, type NavKey, type SidebarCounts, type PlanCard } from "@/components/shell/sidebar";
import { AppTopbar } from "@/components/shell/topbar";
import type { AddKind } from "@/components/shell/add-deal-menu";
import type { Notif } from "@/components/shell/notifications";

export function AppFrame({
  active,
  title,
  sidebar,
  counts = {},
  planCard,
  planName = "Free trial",
  user = "",
  handle = "",
  fresh = false,
  notifications = [],
  children,
  onSearch,
  onAppearance,
  onAddPick,
  onBellSettings,
  onSettings,
}: {
  active: NavKey;
  title: string;
  sidebar: "expanded" | "icons";
  counts?: SidebarCounts;
  planCard?: PlanCard | null;
  planName?: string;
  user?: string;
  handle?: string;
  fresh?: boolean;
  notifications?: Notif[];
  children: React.ReactNode;
  onSearch?: () => void;
  onAppearance?: () => void;
  onAddPick?: (k: AddKind) => void;
  onBellSettings?: () => void;
  onSettings?: (tab: string) => void;
}) {
  const path = usePathname();
  const [mob, setMob] = useState(false);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    const q = window.matchMedia("(max-width: 767px)");
    const f = () => setMob(q.matches);
    f(); q.addEventListener("change", f);
    return () => q.removeEventListener("change", f);
  }, []);

  // close the mobile drawer on route change
  useEffect(() => { setDrawer(false); }, [path]);

  const collapsed = sidebar === "icons";
  const railW = collapsed ? 72 : 256;

  return (
    <div className="flex min-h-screen w-full" style={{ background: "var(--t-page)", color: "var(--t-fg)", fontFamily: "var(--t-body-fam)" }}>
      {/* Desktop / tablet rail */}
      {!mob && (
        <div
          className="sticky top-0 h-screen shrink-0 self-stretch transition-[flex-basis,width] duration-200 ease-[cubic-bezier(.4,0,.2,1)]"
          style={{ flex: `0 0 ${railW}px`, width: railW, zIndex: 30 }}
        >
          <AppSidebar
            active={active} collapsed={collapsed} counts={counts}
            user={user} handle={handle} planCard={planCard} planName={planName}
            fresh={fresh} onSettings={onSettings}
          />
        </div>
      )}

      {/* Main column */}
      <main className="flex min-w-0 flex-1 flex-col gap-4" style={{ padding: "0 24px 56px 16px", boxSizing: "border-box" }}>
        <AppTopbar
          title={title} mob={mob}
          notifications={notifications}
          onNav={() => { if (mob) setDrawer(true); }}
          onSearch={onSearch} onAppearance={onAppearance}
          onAddPick={onAddPick} onBellSettings={onBellSettings}
        />
        <div className="min-h-0 flex-1 flex flex-col">{children}</div>
      </main>

      {/* Mobile drawer */}
      {mob && drawer && (
        <div className="fixed inset-0 z-[88]">
          <button type="button" aria-label="Close menu" className="a-fade absolute inset-0 cursor-default border-0 p-0"
            style={{ background: "var(--t-overlay)" }} onClick={() => setDrawer(false)} />
          <div className="a-drawer absolute bottom-0 left-0 top-0 box-border w-[288px] max-w-[86%] overflow-y-auto"
            style={{ background: "var(--t-page)", boxShadow: "var(--t-sh-pop)" }}>
            <AppSidebar
              active={active} drawer counts={counts}
              user={user} handle={handle} planCard={planCard} planName={planName}
              fresh={fresh} onClose={() => setDrawer(false)} onSettings={onSettings}
            />
          </div>
        </div>
      )}
    </div>
  );
}
