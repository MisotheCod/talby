/**
 * csv-import.ts — the pure half of the CSV import (parsing, the column preview,
 * and the per-row mapping). No env, no Supabase, so it is unit-tested directly.
 */

import { guessField, money, type ImportField } from "./import-fields.ts";

export type CsvPreviewRow = {
  id: string;
  brand: string;
  post: string;
  status: "Active" | "Negotiating";
  amount: number;
  repeat: boolean;
  noDate?: boolean;
};

export type CsvPreview = {
  cols: { name: string; sample: string; field: ImportField }[];
  rows: CsvPreviewRow[];
  total: number;
  issues: string[];
};

/** Minimal CSV parser: quoted fields, escaped quotes, CRLF. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim() !== ""));
}

/** A deal we already hold, as (brand + post date) — the CSV repeat rule. */
export type KnownDeal = { brand: string | null; post_date: string | null };

export function dealKey(brand: string, post: string): string {
  return `${brand.trim().toLowerCase()}|${(post || "").trim()}`;
}

export function knownKeys(deals: KnownDeal[]): Set<string> {
  return new Set(deals.map((d) => dealKey(d.brand ?? "", (d.post_date ?? "").slice(0, 10))));
}

/** Step one: describe the columns and preview every row that has a brand. */
export function buildPreview(table: string[][], known: Set<string>): CsvPreview {
  const header = (table[0] ?? []).map((h) => h.trim());
  const dataRows = table.slice(1);

  const cols = header.map((name, i) => ({
    name,
    sample: (dataRows.find((r) => (r[i] ?? "").trim() !== "") ?? [])[i] ?? "",
    field: guessField(name),
  }));

  const brandIdx = header.findIndex((h) => guessField(h) === "brand");
  const dateIdx = header.findIndex((h) => guessField(h) === "post");
  const statusIdx = header.findIndex((h) => guessField(h) === "status");
  const amountIdx = header.findIndex((h) => guessField(h) === "amt");

  const rows: CsvPreviewRow[] = [];
  const issues: string[] = [];

  dataRows.forEach((r, i) => {
    const rowNo = i + 2; // 1-based, counting the header row
    const brand = brandIdx >= 0 ? (r[brandIdx] ?? "").trim() : "";
    const postRaw = dateIdx >= 0 ? (r[dateIdx] ?? "").trim() : "";
    const post = /^\d{4}-\d{2}-\d{2}/.test(postRaw) ? postRaw.slice(0, 10) : "";
    const amount = amountIdx >= 0 ? money(r[amountIdx] ?? "") : NaN;
    const statusRaw = statusIdx >= 0 ? (r[statusIdx] ?? "").trim() : "";

    if (!brand) {
      issues.push(`Row ${rowNo} has no brand, so it stays out.`);
      return; // a row with no brand is left out entirely
    }
    const row: CsvPreviewRow = {
      id: String(rowNo),
      brand,
      post,
      status: /pipeline|negotiat/i.test(statusRaw) ? "Negotiating" : "Active",
      amount: Number.isFinite(amount) ? amount : 0,
      repeat: known.has(dealKey(brand, post)),
    };
    if (!post) {
      row.noDate = true;
      issues.push(`Row ${rowNo} has no post date — you can add it after the import.`);
    }
    if (!Number.isFinite(amount)) issues.push(`Row ${rowNo} has no readable amount.`);
    rows.push(row);
  });

  return { cols, rows, total: dataRows.length, issues };
}

export type Failed = { id: string; brand: string; amount: number; reason: string };

export type SaveTotals = { imported: number; skipped: number; booked: number; failed: Failed[] };

/**
 * Step two: save the previewed rows using the user's column mapping.
 * rowIds (Try again) limits the run to those rows. skipRepeats skips a row that
 * is already a deal. Totals add up across tries.
 */
export function selectRows(
  preview: CsvPreviewRow[],
  opts: { rowIds?: (string | number)[] | null; skipRepeats?: boolean }
): { todo: CsvPreviewRow[]; skipped: number } {
  const wanted = opts.rowIds && opts.rowIds.length
    ? preview.filter((r) => opts.rowIds!.map(String).includes(String(r.id)))
    : preview;
  if (!opts.skipRepeats) return { todo: wanted, skipped: 0 };
  const todo = wanted.filter((r) => !r.repeat);
  return { todo, skipped: wanted.length - todo.length };
}

/** Apply the user's { columnName: field } mapping to a raw row. */
export function applyMap(
  row: string[],
  header: string[],
  map: Record<string, ImportField>
): { brand: string; amt: number; post: string; status: string; rep: string; notes: string } {
  const at = (field: ImportField) => {
    const col = Object.keys(map).find((k) => map[k] === field);
    const i = col ? header.indexOf(col) : -1;
    return i >= 0 ? (row[i] ?? "").trim() : "";
  };
  const postRaw = at("post");
  return {
    brand: at("brand"),
    amt: money(at("amt")),
    post: /^\d{4}-\d{2}-\d{2}/.test(postRaw) ? postRaw.slice(0, 10) : "",
    status: at("status"),
    rep: at("rep"),
    notes: at("notes"),
  };
}
