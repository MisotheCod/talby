"use client";

import { useEffect } from "react";

/**
 * Talby theme provider.
 * The accent system works by setting `data-accent` on <html>. CSS in
 * globals.css maps each accent name to a set of --accent CSS variables.
 * Structural colors (backgrounds, cards, borders, text) never change —
 * only the accent-scoped surfaces do.
 *
 * The accent value arrives in two ways:
 *  1. Server-injected: the app layout pages set the cookie from the user's
 *     profile and it's read server-side into initialAccent.
 *  2. Live picker: dragging the palette updates it client-side instantly,
 *     then persists to profile (and cookie) on release.
 */
export function ThemeProvider({
  children,
  initialAccent = "coral",
}: {
  children: React.ReactNode;
  initialAccent?: string;
}) {
  useEffect(() => {
    // Apply the initial/server-provided accent on mount (handles SSR HTML).
    document.documentElement.setAttribute("data-accent", initialAccent);
  }, [initialAccent]);

  return <>{children}</>;
}
