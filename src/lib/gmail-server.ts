import "server-only";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GMAIL_SCOPE } from "@/lib/config";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Server-only Gmail integration for nudges.
 * Tokens live in gmail_connections (RLS-scoped to the user); the
 * service-role client reads/writes them server-side only. Never
 * expose tokens to the client.
 */

type TokenRow = {
  email: string | null;
  access_token: string | null;
  refresh_token: string | null;
  expires_at: string | null;
};

export function gmailConfigured(): boolean {
  return !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);
}

export function authUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI || "",
    response_type: "code",
    scope: GMAIL_SCOPE,
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function exchangeCode(code: string): Promise<{ access_token: string; refresh_token: string; expires_in: number; email?: string }> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI || "",
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) throw new Error("token exchange failed: " + res.status);
  const data = await res.json();
  // Fetch the connected address using the profile scope or Gmail profile.
  let email: string | undefined;
  try {
    const p = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    if (p.ok) email = (await p.json()).emailAddress;
  } catch {
    // non-fatal
  }
  return { ...data, email };
}

export async function refreshAccessToken(refreshToken: string): Promise<{ access_token: string; expires_in: number }> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error("token refresh failed: " + res.status);
  return res.json();
}

/** Ensure a fresh access token for the user; refresh + store if expired. */
export async function getAccessToken(userId: string): Promise<string | null> {
  const supabase = createServiceClient();
  const { data } = await supabase.from("gmail_connections").select("access_token, refresh_token, expires_at").eq("user_id", userId).single();
  const row = (data as unknown as TokenRow) ?? null;
  if (!row?.access_token || !row?.refresh_token) return null;

  // If expires_at is absent/past, refresh.
  const expiresAt = row.expires_at ? new Date(row.expires_at).getTime() : 0;
  if (!row.expires_at || Date.now() > expiresAt - 60_000) {
    try {
      const fresh = await refreshAccessToken(row.refresh_token);
      await supabase.from("gmail_connections").update({
        access_token: fresh.access_token,
        expires_at: new Date(Date.now() + fresh.expires_in * 1000).toISOString(),
      }).eq("user_id", userId);
      return fresh.access_token;
    } catch {
      return null;
    }
  }
  return row.access_token;
}

const BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function base64UrlEncode(str: string): string {
  // Build the RFC 2822 message as a base64url string for the Gmail API.
  const utf8 = new TextEncoder().encode(str);
  let binary = "";
  for (const b of utf8) binary += String.fromCharCode(b);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function createGmailDraft(accessToken: string, to: string, subject: string, body: string): Promise<{ id: string }> {
  const raw = base64UrlEncode(
    `To: ${to}\r\nSubject: ${subject.replace(/\r?\n/g, " ")}\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n${body}`
  );
  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/drafts", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ message: { raw } }),
  });
  if (!res.ok) throw new Error("Gmail draft failed: " + (await res.text()).slice(0, 200));
  return (await res.json()) as { id: string };
}

export async function sendGmail(accessToken: string, to: string, subject: string, body: string): Promise<{ id: string }> {
  const raw = base64UrlEncode(
    `To: ${to}\r\nSubject: ${subject.replace(/\r?\n/g, " ")}\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n${body}`
  );
  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ raw }),
  });
  if (!res.ok) throw new Error("Gmail send failed: " + (await res.text()).slice(0, 200));
  return (await res.json()) as { id: string };
}
