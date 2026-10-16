/**
 * contract-shape.ts — turns the reader's raw JSON into the exact shape the
 * New deal dialog wants. Pure (no env, no network) so it can be unit-tested.
 */

export const PAID_LABEL: Record<string, string> = {
  once: "All at once", split: "Split", parts: "In parts", monthly: "Monthly",
};

/** "6000" -> "6,000" (the board shows the amount with a thousands separator). */
export function grouped(n: unknown): string {
  // An absent amount must stay blank — Number(null) is 0, which would show as "$0".
  if (n === null || n === undefined || n === "") return "";
  const v = Number(n);
  if (!Number.isFinite(v)) return "";
  return v.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export type ContractFields = {
  brand: string;
  post: string;
  plats: Record<string, boolean>;
  amt: string;
  paid: string;
  rep: string;
  repEmail: string;
};

export type ContractShape = {
  fields: ContractFields;
  /** exactly four lines: brand and rep, amount and terms, post date and deliverables, bonus and commission ('' when missing) */
  found: [string, string, string, string];
  count: number;
  few: boolean;
  extras: [string, string, string][];
};

export function shapeContract(raw: Record<string, unknown>): ContractShape {
  const postDates = Array.isArray(raw.post_dates) ? (raw.post_dates as Array<{ date?: string }>) : [];
  const post = postDates.map((p) => p?.date ?? "").find((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)) ?? "";
  const deliverable = String(raw.deliverable ?? "").trim();

  const plats: Record<string, boolean> = {};
  for (const p of String(raw.platforms ?? "").split(/[,/]/).map((s) => s.trim()).filter(Boolean)) plats[p] = true;

  const structure = (raw.payment_structure ?? null) as { kind?: string } | null;
  const paid = ["once", "split", "parts", "monthly"].includes(String(structure?.kind)) ? String(structure?.kind) : "once";

  const fields: ContractFields = {
    brand: String(raw.brand ?? "").trim(),
    post,
    plats,
    amt: grouped(raw.value_total),
    paid,
    rep: String(raw.rep_name ?? "").trim(),
    repEmail: String(raw.rep_email ?? "").trim(),
  };

  const extrasIn = (Array.isArray(raw.extras) ? raw.extras : []) as Array<Record<string, unknown>>;
  const describe = (x: Record<string, unknown>) => {
    const amount = grouped(x.amount);
    return [String(x.condition ?? x.on ?? "").trim(), amount ? `$${amount}` : x.rate ? `${x.rate}%` : ""]
      .filter(Boolean).join(" · ");
  };
  const bonusLine = extrasIn.filter((x) => String(x.kind) !== "commission").map(describe).filter(Boolean);
  const commissionLine = extrasIn.filter((x) => String(x.kind) === "commission").map(describe).filter(Boolean);

  const found: [string, string, string, string] = [
    [fields.brand, fields.rep].filter(Boolean).join(" · "),
    [fields.amt ? `$${fields.amt}` : "", fields.amt ? PAID_LABEL[paid] ?? "" : ""].filter(Boolean).join(" · "),
    [post, deliverable].filter(Boolean).join(" · "),
    [bonusLine[0], commissionLine[0]].filter(Boolean).join(" · "),
  ];

  const extras: [string, string, string][] = [];
  for (const x of extrasIn) {
    if (String(x.kind) === "commission") extras.push(["Commission", String(x.on ?? "").trim(), x.rate ? `${x.rate}%` : ""]);
    else extras.push(["Bonus", String(x.condition ?? "").trim(), grouped(x.amount) ? `$${grouped(x.amount)}` : ""]);
  }
  if (deliverable) extras.push(["Deliverables", deliverable, ""]);
  const usageDays = Number(raw.exclusivity_days);
  if (Number.isFinite(usageDays) && usageDays > 0) extras.push(["Usage", `${usageDays} days of exclusivity`, ""]);

  // How many details were found in all: the four lines, the bonuses/commissions,
  // the platforms and the rep email. (Deliverables are already counted in line 3.)
  const count =
    found.filter(Boolean).length +
    (extras.length - (deliverable ? 1 : 0)) +
    Object.keys(plats).length +
    (fields.repEmail ? 1 : 0);

  return { fields, found, count, few: count <= 3, extras };
}
