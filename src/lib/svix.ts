import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Svix webhook signature verification (the scheme Resend uses for inbound
 * email webhooks via svix-id / svix-timestamp / svix-signature headers).
 *
 * Algorithm: the signing secret (whsec_...) is base64-decoded to the raw key.
 * For each key in the signature's digest list (format v1,<sig>[,v1,<sig>...]),
 * compute HMAC-SHA256 over `${msgId}.${timestamp}.${payload}` and compare
 * constant-time. A single matching key with a non-stale timestamp verifies.
 */
export function verifySvix(
  secret: string,
  headers: { id: string; timestamp: string; signature: string },
  payload: string,
  toleranceSec = 300
): boolean {
  if (!secret || !headers.id || !headers.timestamp || !headers.signature) return false;

  // Reject stale timestamps (avoid replay).
  const tsNum = Number(headers.timestamp);
  if (!Number.isFinite(tsNum)) return false;
  if (Math.abs(Date.now() / 1000 - tsNum) > toleranceSec) return false;

  // The whsec_ prefix and base64 character set — normalise.
  const raw = secret.startsWith("whsec_") ? secret.slice("whsec_".length) : secret;
  let key: Buffer;
  try {
    key = Buffer.from(raw, "base64");
  } catch {
    return false;
  }
  if (key.length < 8) return false;

  const signed = `${headers.id}.${headers.timestamp}.${payload}`;
  const expected = createHmac("sha256", key).update(signed, "utf8").digest("base64");

  // Accept any digest in the comma-separated list; Svix may rotate keys.
  const digestList = headers.signature.split(" ").filter((s) => s.startsWith("v1,"));
  for (const item of digestList) {
    const their = item.slice(3); // strip "v1,"
    const theirBuf = Buffer.from(their, "base64");
    const expectedBuf = Buffer.from(expected, "base64");
    if (theirBuf.length === expectedBuf.length && timingSafeEqual(theirBuf, expectedBuf)) {
      return true;
    }
  }
  return false;
}