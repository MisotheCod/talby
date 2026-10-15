"use strict";
/**
 * shoot-baseline.cjs — re-render design boards on THIS machine into
 * e2e/baseline/, using the SAME self-hosted fonts as the app (src/app/fonts.css
 * + @fontsource woff2). Intercepts fonts.googleapis.com so boards rasterize the
 * exact local files the app uses — the committed screenshots/ were rendered on
 * Linux with local @fontsource; this reproduces deterministically on macOS.
 *
 * Usage:
 *   node e2e/shoot-baseline.cjs all [theme] [mode] [sidebar]     (render every board)
 *   node e2e/shoot-baseline.cjs SOverview SDeals [theme] [mode]  (named boards)
 *
 * theme: studio|sand|mac|stationery|editorial  mode: light|dark  sidebar: expanded|icons
 * Writes e2e/baseline/<board>__<theme>-<mode>[-icons].png
 */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const DIR = path.join("/Users/miso/talby-yomi-handoff/talby-yomi-handoff", "design-source", "boards");
const FONTS = path.join("/Users/miso/talby-yomi-handoff/talby-yomi-handoff", "design-source", "fonts");
const OUT = path.join(process.cwd(), "e2e", "baseline");
// The source of truth css + its woff2 (served from the FONTS dir on this server).
const APP_FONTS_CSS = path.join(process.cwd(), "src", "app", "fonts.css");
const T = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".css": "text/css", ".woff2": "font/woff2" };

const [file = "all", theme = "studio", mode = "light", sidebar = "expanded"] = process.argv.slice(2);
const canvas = JSON.parse(fs.readFileSync(path.join(DIR, "canvas.json"), "utf8"));

// Font CSS for the intercept: fonts.css with ./fonts/ -> absolute served URLs.
let fontCss = "";
try { fontCss = fs.readFileSync(APP_FONTS_CSS, "utf8").replace(/url\(\.\/fonts\//g, "url(http://127.0.0.1:4720/fonts/"); } catch (e) { console.error("fonts.css missing?", e.message); process.exit(1); }

const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split("?")[0]);
  // Serve boards and fonts from their dirs.
  let base = DIR, p = u;
  if (u.startsWith("/fonts/")) { base = FONTS; p = u.replace("/fonts/", "/"); }
  const f = path.join(base, p);
  if (!f.startsWith(base) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": T[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(res);
});

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await new Promise((r) => server.listen(4720, r));
  const browser = await chromium.launch({ headless: true });
  const list = file === "all"
    ? canvas.order.filter((k) => canvas.boards[k] && ["shadcn", "devices", "states"].includes(canvas.boards[k].page))
    : file.split(",").map((n) => (n.endsWith(".dc.html") ? n : n + ".dc.html"));
  const missing = [];
  for (const name of list) {
    const b = canvas.boards[name];
    if (!b) { missing.push(name); continue; }
    const ctx = await browser.newContext({ viewport: { width: b.w, height: Math.min(b.h, 2000) }, deviceScaleFactor: 1 });
    await ctx.addInitScript((lk) => { try { localStorage.clear(); localStorage.setItem("talby.look", JSON.stringify(lk)); } catch {} }, { theme, mode, sidebar });
    const page = await ctx.newPage();
    // Intercept Google Fonts -> serve the SAME local font files the app uses.
    await page.route("**fonts.googleapis.com/**", (r) => r.fulfill({ status: 200, contentType: "text/css", body: fontCss }));
    await page.route("**fonts.gstatic.com/**", (r) => r.abort());
    const bare = name.replace(".dc.html", "");
    await page.goto("http://127.0.0.1:4720/" + bare + ".dc.html", { waitUntil: "networkidle" }).catch((e) => { console.log("  goto err", name, e.message.slice(0, 40)); });
    await page.evaluate(() => (document.fonts && document.fonts.ready)).catch(() => {});
    await page.waitForTimeout(2600);
    const outName = bare + `__${theme}-${mode}${sidebar === "icons" ? "-icons" : ""}.png`;
    await page.screenshot({ path: path.join(OUT, outName), fullPage: true });
    console.log("wrote", outName);
    await ctx.close();
  }
  if (missing.length) console.log("unknown boards:", missing.join(", "));
  await browser.close(); server.close();
})().catch((e) => { console.error("FATAL", e.message); process.exit(1); });