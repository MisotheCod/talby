import "server-only";
import { NOTION_CLIENT_ID, NOTION_CLIENT_SECRET, NOTION_REDIRECT_URI, NOTION_VERSION } from "@/lib/config";
import { createServiceClient } from "@/lib/supabase/server";

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
  return (data as unknown as NotionToken) ?? null;
}

const AUTH_HEADERS = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Notion-Version": NOTION_VERSION,
  "Content-Type": "application/json",
});

export type NotionDatabase = { id: string; title: string };

/** List databases the user's connection can access. */
export async function listDatabases(token: string): Promise<NotionDatabase[]> {
  const res = await fetch("https://api.notion.com/v1/search", {
    method: "POST",
    headers: AUTH_HEADERS(token),
    body: JSON.stringify({ filter: { value: "database", property: "object" }, page_size: 50 }),
  });
  if (!res.ok) throw new Error(`Notion search failed (${res.status})`);
  const data = await res.json();
  const results: Array<{ id: string; title?: Array<{ plain_text?: string }> }> = data?.results ?? [];
  return results.map((r) => ({
    id: r.id,
    title: (r.title ?? []).map((t) => t.plain_text ?? "").join("") || "Untitled database",
  }));
}

/**
 * Query a database (first page, up to 100 rows) and flatten the
 * property values into plain column/row shape so it can flow straight
 * into the existing AI import-mapping pipeline (same as CSV).
 */
export async function fetchDatabaseRows(token: string, databaseId: string, sourceName: string) {
  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: AUTH_HEADERS(token),
    body: JSON.stringify({ page_size: 100 }),
  });
  if (!res.ok) throw new Error(`Notion query failed (${res.status})`);
  const data = await res.json();
  const results: Array<{ properties: Record<string, unknown> }> = data?.results ?? [];

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