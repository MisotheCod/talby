#!/usr/bin/env node
// Talby mail — send from hello@talby.io (or any verified talby.io address)
// via Resend's API. Reads RESEND_API_KEY from .env.local automatically.
//
// Usage:
//   node send-talby-email.mjs "recipient@example.com" "Subject" "Body text"
//   node send-talby-email.mjs to@x.com "Subject" "Body" from:info@talby.io
//
// Body may be plain text; if you pass --html, the subject arg is followed by
// an HTML body. Returns the Resend email id on success.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = readFileSync(resolve(__dirname, ".env.local"), "utf8");

function get(name) {
  const m = env.match(new RegExp(`^${name}=(.+)$`, "m"));
  return m ? m[1].trim() : null;
}

const KEY = process.env.RESEND_API_KEY || get("RESEND_API_KEY");
if (!KEY) { console.error("RESEND_API_KEY not found in .env.local"); process.exit(1); }

const [, , to, subject, body, fromFlag] = process.argv;
let from = "Talby <hello@talby.io>";
if (fromFlag && fromFlag.startsWith("from:")) from = `Talby <${fromFlag.slice(5)}>`;

if (!to || !subject || !body) {
  console.error("usage: node send-talby-email.mjs <to> <subject> <body> [from:addr@talby.io]");
  process.exit(1);
}

const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify({ from, to: [to], subject, text: body }),
});
const data = await res.json();
if (!res.ok) {
  console.error(`Resend error ${res.status}:`, data);
  process.exit(1);
}
console.log(`sent to ${to} from ${from} -> id ${data.id}`);