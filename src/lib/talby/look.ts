/**
 * look.ts — one resolver for the user's theme/mode/sidebar.
 *
 * A browser can hold an old `talby.look` from a previous version, or none at
 * all, and the profile row may hold a theme that no longer exists. The rule:
 * the PROFILE wins; anything missing or unrecognised falls back to Studio, light,
 * expanded. Never crash on malformed JSON.
 */

export const THEME_IDS = ["studio", "sand", "mac", "stationery", "editorial"] as const;
export type ThemeId = (typeof THEME_IDS)[number];
export type Mode = "light" | "dark" | "system";
export type Sidebar = "expanded" | "icons";

export type Look = { theme: ThemeId; mode: Mode; sidebar: Sidebar };

export const DEFAULT_LOOK: Look = { theme: "studio", mode: "light", sidebar: "expanded" };

function themeOf(v: unknown, prev?: unknown): ThemeId {
  if (typeof v === "string" && (THEME_IDS as readonly string[]).includes(v)) return v as ThemeId;
  // 'midnight' was the old name for "dark mode"; it carried the previous theme along.
  if (v === "midnight") {
    if (typeof prev === "string" && (THEME_IDS as readonly string[]).includes(prev)) return prev as ThemeId;
    return "studio";
  }
  return "studio";
}

function modeOf(v: unknown): Mode {
  return v === "dark" || v === "system" || v === "light" ? v : "light";
}

function sidebarOf(v: unknown): Sidebar {
  return v === "icons" || v === "expanded" ? v : "expanded";
}

/** Parse a stored `talby.look` value; never throws, always yields an object. */
export function parseStored(raw: string | null | undefined): Record<string, unknown> {
  if (!raw) return {};
  try {
    const o = JSON.parse(raw);
    return o && typeof o === "object" ? (o as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

/**
 * The look to actually use: the profile's values override anything left in the
 * browser, and every field is validated with a Studio/light/expanded fallback.
 */
export function resolveLook(
  stored: Record<string, unknown> | null | undefined,
  profile: { theme?: unknown; mode?: unknown; sidebar?: unknown } | null | undefined
): Look {
  const s = stored ?? {};
  const p = profile ?? {};
  const merged: Record<string, unknown> = { ...s, ...p };
  // 'midnight' was the old dark-mode theme, so it implies dark unless the mode
  // was set explicitly.
  const isMidnight = merged.theme === "midnight";
  return {
    theme: themeOf(merged.theme, merged.prev),
    mode: modeOf(merged.mode ?? (isMidnight ? "dark" : undefined)),
    sidebar: sidebarOf(merged.sidebar),
  };
}
