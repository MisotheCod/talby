// ============================================================
// TALBY ACCENT THEMING
// One hue drives the whole accent system. Derived shades
// (tint, ink) are computed from the hue. `--on-accent` is
// chosen by WCAG luminance so light accents get dark text.
// Structural colors (text, cards, borders, canvas) never move.
// ============================================================

export type HSL = { h: number; s: number; l: number };
export type ThemeMode = "light" | "dark";
export const DEFAULT_MODE: ThemeMode = "light";

/** Heading-font choices (per the reference HTML). */
export const HEADING_FONTS = [
  { name: "Lexend", cssVar: "var(--font-lexend)" },
  { name: "Space Grotesk", cssVar: "var(--font-space-grotesk)" },
  { name: "Bricolage Grotesque", cssVar: "var(--font-bricolage)" },
  { name: "Fraunces", cssVar: "var(--font-fraunces)" },
] as const;
export const DEFAULT_HEAD_FONT = "Lexend";

export const ACCENT_PRESETS: (HSL & { name: string })[] = [
  { name: "Ocean blue", h: 210, s: 76, l: 50 },
  { name: "Violet", h: 255, s: 70, l: 60 },
  { name: "Green", h: 150, s: 52, l: 42 },
  { name: "Coral", h: 12, s: 82, l: 62 },
  { name: "Gold", h: 42, s: 88, l: 52 },
  { name: "Pink", h: 320, s: 65, l: 58 },
];

export const DEFAULT_HSL: HSL = { h: 210, s: 76, l: 50 };

// --- Color math (ported from the reference HTML exactly) ---

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}

export function luminance(h: number, s: number, l: number): number {
  const [r0, g0, b0] = hslToRgb(h, s, l);
  const lin = (v: number) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r0) + 0.7152 * lin(g0) + 0.0722 * lin(b0);
}

/** Apply theme mode before/with an accent so derived tints match the mode. */
export function applyMode(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === "dark") root.setAttribute("data-theme", "dark");
  else root.removeAttribute("data-theme");
}

/** WCAG-safe on-accent + accent-ink + tint shades for a given mode. */
export function accentShades({ h, s, l }: HSL, mode: ThemeMode) {
  const L = luminance(h, s, l);
  const contrastWhite = (1.0 + 0.05) / (L + 0.05);
  const onAccent = contrastWhite >= 3.2 ? "#ffffff" : "#14181f";
  // Deep, saturated shade of the accent used for the Unlimited pricing card.
  // It re-tints with the accent; its foreground is guarded by the SAME luminance
  // check but evaluated against this actual surface so it's always legible.
  const deep = { h, s, l: Math.max(26, Math.min(l * 0.6, 34)) };
  const dL = luminance(deep.h, deep.s, deep.l);
  const dContrastWhite = (1.0 + 0.05) / (dL + 0.05);
  const onDeep = dContrastWhite >= 3.2 ? "#ffffff" : "#14181f";
  if (mode === "dark") {
    return {
      onAccent,
      deepBg: `hsl(${h},${s}%,${deep.l}%)`,
      onDeep,
      accentInk: `hsl(${h},64%,78%)`,
      accentTint: `hsl(${h},52%,15%)`,
      accentTint2: `hsl(${h},44%,22%)`,
    };
  }
  // light
  const inkL = L > 0.5 ? 30 : 42;
  return {
    onAccent,
    deepBg: `hsl(${h},${s}%,${deep.l}%)`,
    onDeep,
    accentInk: `hsl(${h},48%,${inkL}%)`,
    accentTint: `hsl(${h},70%,96%)`,
    accentTint2: `hsl(${h},60%,90%)`,
  };
}

/** Apply an accent to the document root by setting the hue CSS vars
 *  and derived shades (mirrors the reference HTML `apply()`). */
export function applyAccent({ h, s, l }: HSL, mode: ThemeMode = "light") {
  const root = document.documentElement;
  root.style.setProperty("--accent-h", String(h));
  root.style.setProperty("--accent-s", s + "%");
  root.style.setProperty("--accent-l", l + "%");

  const sh = accentShades({ h, s, l }, mode);
  root.style.setProperty("--on-accent", sh.onAccent);
  root.style.setProperty("--accent-deep", sh.deepBg);
  root.style.setProperty("--on-accent-deep", sh.onDeep);
  root.style.setProperty("--accent-ink", sh.accentInk);
  root.style.setProperty("--accent-tint", sh.accentTint);
  root.style.setProperty("--accent-tint-2", sh.accentTint2);
}

// --- Serialization (persist accent to the profiles row) ---

export function serializeHSL({ h, s, l }: HSL): string {
  return `${h},${s},${l}`;
}

export function parseHSL(str: string | null | undefined): HSL | null {
  if (!str) return null;
  const parts = str.split(",").map((n) => parseFloat(n.trim()));
  if (parts.length === 3 && parts.every((n) => !isNaN(n))) {
    return { h: parts[0], s: parts[1], l: parts[2] };
  }
  return null;
}

/** CSS variable declarations for an accent — server-safe (no DOM needed).
 *  Used to apply the saved accent before first paint to avoid a flash of
 *  the default color. */
export function accentVars({ h, s, l }: HSL, mode: ThemeMode = "light"): string {
  const sh = accentShades({ h, s, l }, mode);
  return [
    `--accent-h:${h}`,
    `--accent-s:${s}%`,
    `--accent-l:${l}%`,
    `--on-accent:${sh.onAccent}`,
    `--accent-deep:${sh.deepBg}`,
    `--on-accent-deep:${sh.onDeep}`,
    `--accent-ink:${sh.accentInk}`,
    `--accent-tint:${sh.accentTint}`,
    `--accent-tint-2:${sh.accentTint2}`,
  ].join(";");
}

// --- Heading font ---

/** Map a font name to its CSS var; unknown names fall back to Lexend. */
export function fontCssVar(name: string | null | undefined): string {
  const hit = HEADING_FONTS.find((f) => f.name === name);
  return hit?.cssVar ?? "var(--font-lexend)";
}

export function applyFont(name: string | null | undefined) {
  document.documentElement.style.setProperty("--font-head", fontCssVar(name));
}
