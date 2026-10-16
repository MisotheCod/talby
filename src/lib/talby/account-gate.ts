/**
 * account-gate.ts — two decisions that must never be got wrong.
 *
 * 1. showWelcome: the first-run Welcome board is for a genuinely new account,
 *    not for anyone who simply has not dismissed the tour.
 * 2. deriveIdentity: what to call someone when their profile has no handler.
 *    It must fall back to the display name, then the email name — NEVER to a
 *    design sample like "junobakes" or "demo.creator".
 */

export type IdentityInput = {
  handler?: string | null;
  fullName?: string | null;
  email?: string | null;
};

export type Identity = { handle: string; name: string };

const SAMPLE_NAMES = new Set(["junobakes", "demo.creator", "demo", "creator", "sample", "there"]);

/** Title-case each word, dropping anything that is not a letter/space/apostrophe. */
function titleCase(s: string): string {
  return s
    .replace(/[^A-Za-z\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

/** "chanelica.r" -> "chanelica.r"; "Ana Ruiz" -> "ana.ruiz" */
function slug(s: string): string {
  return s
    .replace(/[^A-Za-z0-9\s._-]/g, "")
    .replace(/\s+/g, ".")
    .replace(/\.+/g, ".")
    .replace(/^\.|\.$/g, "")
    .toLowerCase();
}

/**
 * The name to show. Order: the profile handler, then the account's own display
 * name, then the email name. A design sample is never an answer.
 */
export function deriveIdentity({ handler, fullName, email }: IdentityInput): Identity {
  const h = (handler ?? "").trim();
  const full = (fullName ?? "").trim();
  const localRaw = (email ?? "").split("@")[0] ?? "";
  // "shot.1791956719868" -> "shot": strip the timestamp noise email locals carry.
  const local = titleCase(localRaw.replace(/[._-]+/g, " ").replace(/\d+/g, " "));

  const sources = [h, full, local].map((s) => s.trim()).filter((s) => s && !SAMPLE_NAMES.has(s.toLowerCase()));
  const chosen = sources[0] ?? "";

  const displayName = titleCase(chosen);
  // Slug from the CHOSEN source only — the raw handler may itself be a sample.
  const handle = slug(chosen);
  const first = displayName.split(" ").filter(Boolean)[0] ?? "";

  return { handle, name: first || displayName };
}

/**
 * The Welcome board is for an account with nothing in it yet AND no tour seen.
 * Having any deal means they are an existing user, whatever tour_seen says.
 */
export function showWelcome({ deals, tourSeen }: { deals: number; tourSeen: boolean | null | undefined }): boolean {
  return deals === 0 && tourSeen !== true;
}
