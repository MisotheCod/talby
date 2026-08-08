"use client";

import { useEffect } from "react";
import { applyAccent, parseHSL } from "@/lib/accent";

/**
 * Talby theme provider.
 * The accent system works by moving a single hue variable on <html>.
 * applyAccent() derives the tint/ink shades and picks --on-accent by
 * WCAG luminance (light accents get dark text). Structural colors never
 * move; only accent-scoped surfaces do. The logo mark is brand-locked.
 *
 * On marketing/auth pages (no profile session accent) this is passed no
 * initialAccent, so it defers to the CSS defaults in globals.css. On the
 * app, the AppShell applies the user's saved accent+font; this provider
 * must NOT reset to the default and clobber that, so it only applies when
 * an initialAccent string is actually provided.
 */
export function ThemeProvider({
  children,
  initialAccent,
}: {
  children: React.ReactNode;
  initialAccent?: string | null;
}) {
  useEffect(() => {
    if (initialAccent) {
      const parsed = parseHSL(initialAccent);
      if (parsed) applyAccent(parsed);
    }
  }, [initialAccent]);

  return <>{children}</>;
}
