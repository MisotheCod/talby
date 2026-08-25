// ============================================================
// TALBY SERVER CONFIG — SERVER-ONLY module.
// Contains secrets and OAuth credentials. This module MUST only be
// imported from server code (API routes, server libs, cron). If it is
// ever imported from a client component / "use client" file, the values
// may be bundled to the browser — stop and fix the import.
// `import "server-only"` enforces this at build time.
// ============================================================
import "server-only";

/** OpenRouter key for the AI import-mapping engine + Assistant. SERVER-ONLY. */
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

/** Google OAuth for Gmail (nudge send + inbox scanner). SERVER-ONLY. */
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
export const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/gmail/callback`;

/** Notion OAuth (public integration). SERVER-ONLY. */
export const NOTION_CLIENT_ID = process.env.NOTION_CLIENT_ID || "";
export const NOTION_CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET || "";
export const NOTION_REDIRECT_URI =
  process.env.NOTION_REDIRECT_URI || `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/notion/callback`;
