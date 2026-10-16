import "server-only";
import { NOTION_CLIENT_ID, NOTION_CLIENT_SECRET, NOTION_REDIRECT_URI } from "@/lib/server-config";
import { NOTION_VERSION } from "@/lib/constants";
import { createServiceClient } from "@/lib/supabase/server";
import { decryptToken } from "@/lib/token-encrypt";

/**
 * Server-only Notion connection (import source).
 * Public OAuth integration: the token is scoped to whichever Notion
 * account the user authorized, stored server-side in notion_connections,
 * and never exposed to the client. Notion access tokens are long-lived
 * and have no refresh-token flow, so no refresh logic is needed.
 */

type Owner = { type: string; user?: { id?: string; name?: string }; workspace?: { id?: string; name?: string } };

export type NotionToken = {
  access_token: string;
  bot_id: string;
  workspace_id: string;
  workspace_name: string;
  notion_user_id?: string;
};

export function notionConfigured(): boolean {
  return !!(NOTION_CLIENT_ID && NOTION_CLIENT_SECRET);
}

export function authUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: NOTION_CLIENT_ID,
    redirect_uri: NOTION_REDIRECT_URI,
    response_type: "code",
    owner: "user",
    state,
  });
  return `https://api.notion.com/v1/oauth/authorize?${params}`;
}

/** Exchange the OAuth code for a long-lived access token. */
export async function exchangeCode(code: string): Promise<NotionToken> {
  const basic = Buffer.from(`${NOTION_CLIENT_ID}:${NOTION_CLIENT_SECRET}`).toString("base64");
  const res = await fetch("https://api.notion.com/v1/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/json",
      // Notion requires the integration's client id as the user-agent-ish header.
      "Notion-Version": NOTION_VERSION,
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: NOTION_REDIRECT_URI,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Notion token exchange failed (${res.status}): ${text.slice(0, 300)}`);
  }
  const data = await res.json();
  const owner = (data?.owner ?? {}) as Owner;
  return {
    access_token: data.access_token,
    bot_id: data.bot_id,
    workspace_id: data.workspace_id,
    workspace_name: data.workspace_name ?? owner?.workspace?.name ?? "",
    notion_user_id: owner?.user?.id ?? undefined,
  };
}

/** Read the stored token for a user; null if not connected. */
export async function getNotionToken(userId: string): Promise<NotionToken | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("notion_connections")
    .select("access_token, bot_id, workspace_id, workspace_name, notion_user_id")
    .eq("user_id", userId)
    .maybeSingle();
  const row = data as unknown as NotionToken | null;
  if (!row) return null;
  return { ...row, access_token: decryptToken(row.access_token) ?? "" };
}

const AUTH_HEADERS = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Notion-Version": NOTION_VERSION,
  "Content-Type": "application/json",
});

/** Notion failures carry a machine code the routes return as { code }. */
import { paginate, NotionError } from "./notion-import";
export { NotionError };

export type NotionDatabase = { id: string; title: string; edited?: string };

/** List databases the user's connection can access. */
export async function listDatabases(token: string): Promise<NotionDatabase[]> {
  const res = await fetch("https://api.notion.com/v1/search", {
    method: "POST",
    headers: AUTH_HEADERS(token),
    body: JSON.stringify({ filter: { value: "database", property: "object" }, page_size: 50 }),
  });
  if (!res.ok) throw new NotionError(res.status === 401 ? "notion_lost" : "fetch_failed", `Notion search failed (${res.status})`);
  const data = await res.json();
  const results: Array<{ id: string; title?: Array<{ plain_text?: string }>; last_edited_time?: string }> = data?.results ?? [];
  return results.map((r) => ({
    id: r.id,
    title: (r.title ?? []).map((t) => t.plain_text ?? "").join("") || "Untitled database",
    edited: r.last_edited_time,
  }));
}

/** Property names of a database, for the "Looks like deals" badge and field guesses. */
export async function databasePropertyNames(token: string, databaseId: string): Promise<string[]> {
  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
    method: "GET",
    headers: AUTH_HEADERS(token),
  });
  if (!res.ok) throw new NotionError(res.status === 401 ? "notion_lost" : "fetch_failed", `Notion database read failed (${res.status})`);
  const data = await res.json();
  return Object.keys((data?.properties ?? {}) as Record<string, unknown>);
}

/** Guess the Talby field a column supplies. Field keys are fixed by the board. */
export function guessField(name: string): string {
  const n = name.toLowerCase();
  if (/skip|ignore/.test(n)) return "skip";
  if (/brand|company|client|campaign|partner|\bname\b/.test(n)) return "brand";
  if (/amount|value|fee|total|price|rate|comp|\$/.test(n)) return "amt";
  if (/pay\s*by|due|invoice/.test(n)) return "payby";
  if (/post|publish|live|date|when/.test(n)) return "post";
  if (/status|stage|state/.test(n)) return "status";
  if (/paid|payment|terms|schedule/.test(n)) return "pay";
  if (/platform|channel|where/.test(n)) return "plats";
  // Check repEmail first (more specific: includes "email")
  if (/email/.test(n) && /rep|contact|manager/.test(n)) return "repEmail";
  if (/rep|contact|manager|owner/.test(n)) return "rep";
  if (/note|comment|remark|detail/.test(n)) return "notes";
  return "skip";
}

/** Page count for a database — the same paginated walk, counted. */
export async function countDatabaseRows(token: string, databaseId: string): Promise<number> {
  return (await paginate(token, databaseId)).length;
}

/**
 * Query a database (first page, up to 100 rows) and flatten the
 * property values into plain column/row shape so it can flow straight
 * into the existing AI import-mapping pipeline (same as CSV).
 */
export async function fetchDatabaseRows(token: string, databaseId: string, sourceName: string) {
  // Full pagination lives in notion-import.ts, where it is unit-tested.
  const results = await paginate(token, databaseId);

  // Column order from the first non-empty row (fall back to insertion order).
  const columns: string[] = [];
  const seen = new Set<string>();
  for (const page of results) {
    for (const name of Object.keys(page.properties ?? {})) {
      if (!seen.has(name)) {
        seen.add(name);
        columns.push(name);
      }
    }
  }

  const rows = results.map((page) => {
    const obj: Record<string, string> = {};
    for (const col of columns) {
      obj[col] = propToText(page.properties?.[col]);
    }
    // Page id carried through so the import can skip repeats by Notion page id.
    obj._notion_id = page.id ?? "";
    return obj;
  });

  return { columns, rows, sourceName: sourceName || "Notion database" };
}

/** Convert a Notion property value to plain text for the mapper. */
function propToText(prop: unknown): string {
  if (!prop || typeof prop !== "object") return "";
  const p = prop as { type?: string; [k: string]: unknown };
  switch (p.type) {
    case "title":
      return richText(p.title);
    case "rich_text":
      return richText(p.rich_text);
    case "number":
      return String(p.number ?? "");
    case "select":
      return (p.select as { name?: string } | null)?.name ?? "";
    case "status":
      return (p.status as { name?: string } | null)?.name ?? "";
    case "multi_select":
      return (p.multi_select as Array<{ name?: string }>).map((s) => s.name ?? "").join(", ");
    case "date":
      return ((p.date as { start?: string } | null)?.start ?? "").slice(0, 10);
    case "checkbox":
      return p.checkbox ? "yes" : "no";
    case "url":
      return String(p.url ?? "");
    case "email":
      return String(p.email ?? "");
    case "phone_number":
      return String(p.phone_number ?? "");
    case "formula": {
      // eslint-disable-next-line no-case-declarations
      const f = p.formula as { type: string; [k: string]: unknown };
      const v = f[f.type];
      return v == null ? "" : String(v);
    }
    case "people":
      return (p.people as Array<{ name?: string }>).map((x) => x.name ?? "").join(", ");
    case "created_by":
    case "last_edited_by":
      return (p[p.type] as { name?: string } | null)?.name ?? "";
    case "created_time":
    case "last_edited_time":
      return String(p[p.type] ?? "");
    default:
      return "";
  }
}

function richText(val: unknown): string {
  if (!Array.isArray(val)) return "";
  return val.map((t) => (t as { plain_text?: string }).plain_text ?? "").join("");
}