"use client";

import { useEffect } from "react";
import { applyAccent, parseHSL, DEFAULT_HSL } from "@/lib/accent";

/**
 * Talby theme provider.
 * The accent system works by moving a single hue variable on <html>.
 * applyAccent() derives the tint/ink shades and picks --on-accent by
 * WCAG luminance (light accents get dark text). Structural colors
 * (text, cards, borders, canvas) never move; only accent-scoped
 * surfaces do. The logo mark is brand-locked via the --brand token
 * and never re-tints.
 *
 * initialAccent is the serialized HSL ("h,s,l") read from the user's
 * profiles row. Applied on mount to avoid a flash of default.
 */
export function ThemeProvider({
  children,
  initialAccent,
}: {
  children: React.ReactNode;
  initialAccent?: string | null;
}) {
  useEffect(() => {
    const parsed = parseHSL(initialAccent) ?? DEFAULT_HSL;
    applyAccent(parsed);
  }, [initialAccent]);

  return <>{children}</>;
}
