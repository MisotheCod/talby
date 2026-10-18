"use client";

// Talby theme provider. Writes the resolved Talby tokens (talby-themes.ts)
// plus the shadcn mappings as CSS variables on <html> for a theme+mode.
// No-flash is handled by the inline script in layout <head>; this provider
// applies once mounted and syncs profile/localStorage/system changes.

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { talby, isDark, migrateLook, type ThemeId, type Mode } from "@/lib/theme/talby-themes";

export type Look = { theme: ThemeId; mode: Mode; sidebar: "expanded" | "icons" };
export const LOOK_KEY = "talby.look";
export const DEFAULT_LOOK: Look = { theme: "studio", mode: "light", sidebar: "expanded" };

type ThemeCtx = {
  look: Look;
  dark: boolean;
  setTheme: (t: ThemeId) => void;
  setMode: (m: Mode) => void;
  toggleSidebar: () => void;
  systemDark: boolean;
};
const Ctx = createContext<ThemeCtx | null>(null);

function readLook(): Look {
  if (typeof window === "undefined") return DEFAULT_LOOK;
  try {
    const raw = localStorage.getItem(LOOK_KEY);
    if (!raw) return DEFAULT_LOOK;
    return migrateLook(JSON.parse(raw));
  } catch {
    return DEFAULT_LOOK;
  }
}

// Apply tokens + shadcn mappings as CSS vars on <html>. This is the single
// function that bridges talby(theme, dark) to the browser. Also callable from
// the head inline script via the global the provider sets (see layout).
export function applyLook(look: Look, systemDark: boolean) {
  let dark = isDark(look.mode, systemDark);
  // Auth pages are always light: never apply dark here (TalbyAuthPage pins them light).
  if (typeof window !== 'undefined') {
    const p = window.location.pathname;
    if (p === '/login' || p === '/signup' || p === '/forgot-password' || p === '/reset-password'
      || p.startsWith('/login') || p.startsWith('/signup') || p.startsWith('/forgot-password') || p.startsWith('/reset-password')) {
      dark = false;
    }
  }
  const t = talby(look.theme, dark);
  const el = document.documentElement;
  el.setAttribute("data-theme", look.theme);
  el.setAttribute("data-mode", look.mode);
  el.classList.toggle("dark", dark);

  const sh: Record<string, string> = {
    "--background": t.page, "--foreground": t.fg,
    "--card": t.card, "--card-foreground": t.fg,
    "--popover": t.card, "--popover-foreground": t.fg,
    "--primary": t.primary, "--primary-foreground": t.primaryFg,
    "--secondary": t.fill, "--secondary-foreground": t.fg,
    "--muted": t.tile, "--muted-foreground": t.mutedFg,
    "--accent": t.hv, "--accent-foreground": t.fg,
    "--destructive": t.destr,
    "--border": t.border, "--input": t.border, "--ring": t.ring,
    "--radius": t.r + "px",
    "--sidebar": t.side, "--sidebar-foreground": t.fg,
    "--sidebar-accent": t.navOn, "--sidebar-accent-foreground": t.fg,
    "--sidebar-primary": t.accent,
    "--sidebar-border": t.sideBorder, "--sidebar-ring": t.ring,
  };
  const tw: Record<string, string> = {
    "--t-page": t.page, "--t-card": t.card, "--t-tile": t.tile, "--t-fill": t.fill,
    "--t-fill-hover": t.fillHover, "--t-hover-card": t.hoverCard, "--t-line": t.line,
    "--t-border": t.border, "--t-border-strong": t.borderStrong, "--t-off": t.off,
    "--t-fg": t.fg, "--t-muted-fg": t.mutedFg, "--t-primary": t.primary, "--t-primary-fg": t.primaryFg,
    "--t-ok-bg": t.okBg, "--t-ok-fg": t.okFg, "--t-warn-bg": t.warnBg, "--t-warn-fg": t.warnFg,
    "--t-bad-bg": t.badBg, "--t-bad-fg": t.badFg, "--t-post-bg": t.postBg, "--t-post-fg": t.postFg,
    "--t-brand-accent": t.accent, "--t-soft": t.soft, "--t-soft-fg": t.softFg,
    "--t-tab-on": t.tabOn, "--t-tab-sh": t.tabSh, "--t-sh-card": t.shCard, "--t-sh-hover": t.shHover,
    "--t-sh-pop": t.shPop, "--t-btn-sh": t.btnSh, "--t-side": t.side, "--t-side-border": t.sideBorder,
    "--t-nav-on": t.navOn, "--t-nav-hv": t.navHv, "--t-side-fx": t.sideFx, "--t-overlay": t.overlay,
    "--t-dark": dark ? "1" : "0",
    "--t-body-fam": t.bodyFam, "--t-title-fam": t.titleFam, "--t-num-fam": t.numFam,
    "--t-h-case": t.hCase, "--t-h-track": t.hTrack, "--t-h-scale": String(t.hScale), "--t-n-track": t.nTrack,
    "--t-r-card": t.rCard, "--t-r-tile": t.rTile, "--t-r-dialog": t.rDialog, "--t-r-ctl": t.rCtl,
    "--t-r-sm": t.rSm, "--t-r-item": t.rItem, "--t-r-box": t.rBox, "--t-r-ev": t.rEv,
    "--t-r-bar": t.rBar, "--t-r-pill": t.rPill, "--t-r-avatar": t.r ? "16px" : "0px",
    "--t-destr": t.destr, "--t-destr-bg": t.destrBg,
    "--hv": t.hv, "--hvr": t.hvr, "--bd2": t.borderStrong, "--fg": t.fg, "--ring": t.ring, "--shh": t.shHover,
  };
  const style = el.style;
  for (const k in sh) style.setProperty(k, sh[k]);
  for (const k in tw) style.setProperty(k, tw[k]);
  el.style.fontFamily = t.bodyFam;
}

// export for the head inline script (client bundle would be too big there).
export function serializeApplyScript(): string {
  return `(function(){try{var L='talby.look';var r=JSON.parse(localStorage.getItem(L)||'null')||{};var th=r.theme==='sand'||r.theme==='mac'||r.theme==='stationery'||r.theme==='editorial'?r.theme:'studio';if(r.theme==='midnight'){th=r.prev==='sand'||r.prev==='mac'||r.prev==='stationery'||r.prev==='editorial'?r.prev:'studio'}var m=r.mode||(r.auto?'system':'light');if(r.theme==='midnight'){m='dark'}var d=m==='dark'||(m==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);var el=document.documentElement;var b=document.body||document.documentElement;var t={background:d?'#09090A':'#FFFFFF'};el.setAttribute('data-theme',th);el.setAttribute('data-mode',m);el.classList.toggle('dark',!!d);})();}`;
}

export function ThemeProvider({ children, profileLook }: { children: React.ReactNode; profileLook?: Partial<Look> | null }) {
  const [systemDark, setSystemDark] = useState(false);
  const [look, setLookState] = useState<Look>(() => readLook());
  const profileRef = useRef(profileLook);
  profileRef.current = profileLook;

  // Merge profile look once on mount; profile values win.
  useEffect(() => {
    const merged = (() => {
      const base = readLook();
      const p = profileRef.current;
      if (!p || (!p.theme && !p.mode && !p.sidebar)) return base;
      return migrateLook({
        theme: p.theme || base.theme,
        mode: p.mode || base.mode,
        sidebar: p.sidebar || base.sidebar,
      });
    })();
    setLookState(merged);
    try { localStorage.setItem(LOOK_KEY, JSON.stringify(merged)); } catch {}
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const h = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", h);
    const onStore = (e: StorageEvent) => {
      if (e.key === LOOK_KEY) {
        try { setLookState(migrateLook(JSON.parse(e.newValue || ""))); } catch {}
      }
    };
    window.addEventListener("storage", onStore);
    return () => { mq.removeEventListener("change", h); window.removeEventListener("storage", onStore); };
  }, []);

  useEffect(() => { applyLook(look, systemDark); }, [look, systemDark]);

  const persist = useCallback((next: Look) => {
    setLookState(next);
    try { localStorage.setItem(LOOK_KEY, JSON.stringify(next)); } catch {}
  }, []);

  const value: ThemeCtx = {
    look, dark: isDark(look.mode, systemDark), systemDark,
    setTheme: (t) => persist({ ...look, theme: t }),
    setMode: (m) => persist({ ...look, mode: m }),
    toggleSidebar: () => persist({ ...look, sidebar: look.sidebar === "icons" ? "expanded" : "icons" }),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}