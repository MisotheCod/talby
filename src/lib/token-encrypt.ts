import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { NOTION_CLIENT_SECRET } from "@/lib/server-config";

/**
 * At-rest token encryption for third-party OAuth tokens (upgrade 7).
 * AES-256-GCM, key derived from NOTION_CLIENT_SECRET (already server-only).
 * Tokens are stored as `v1:<iv>:<tag>:<ct>` base64; plaintext values read
 * back are treated as pre-encryption rows and passed through (so existing
 * connections keep working — they get re-encrypted on the next code exchange).
 */
const ALGO = "aes-256-gcm";
const KEY = createHash("sha256").update(NOTION_CLIENT_SECRET || "talby-token-enc-fallback", "utf8").digest();

export function encryptToken(plaintext: string): string {
  const iv = randomBytes(12);
  const c = createCipheriv(ALGO, KEY, iv);
  const enc = Buffer.concat([c.update(plaintext, "utf8"), c.final()]);
  const tag = c.getAuthTag();
  return `v1:${iv.toString("base64")}:${tag.toString("base64")}:${enc.toString("base64")}`;
}

export function decryptToken(token: string | null | undefined): string | null {
  if (!token) return null;
  const parts = token.split(":");
  if (parts.length !== 4 || parts[0] !== "v1") return token; // legacy plaintext
  try {
    const d = createDecipheriv(ALGO, KEY, Buffer.from(parts[1], "base64"));
    d.setAuthTag(Buffer.from(parts[2], "base64"));
    return Buffer.concat([d.update(Buffer.from(parts[3], "base64")), d.final()]).toString("utf8");
  } catch {
    return null; // tampered / wrong key — fail closed, do not surface garbage
  }
}
