"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { TalbyLogo } from "@/components/marketing/talby-logo";
import { FluentBotSparkle28Regular } from "@/components/fluent-icons";
import { IconHome, IconBriefcase, IconCalendar, IconDollar, IconIdea, IconNotes, IconSettings } from "@/components/icons";

/* Marks (Talby + check) as inline symbols — keyed, reusable. */
function Mark({ width = 26 }: { width?: number } = {}) {
  return <TalbyLogo width={width} />;
}
function Ck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
  );
}

/* A tiny check-list row used in pricing + panels */
function CheckLi({ children, up }: { children: React.ReactNode; up?: boolean }) {
  return (
    <li className={up ? "up" : ""}><Ck />{children}</li>
  );
}

export function MarketingPage() {
  return (
    <div className="mkt">
      <SiteNav />
      <Hero />
      <CompareSection />
      <StorySection />
      <AssistantSection />
      <PricingSection />
      <CloseSection />
      <SiteFooter />
    </div>
  );
}

/* ---------------- Nav ---------------- */
const NAV_LINKS = [
  { href: "#compare", label: "Why Talby" },
  { href: "#story", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
];

function SiteNav() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="nav-shell">
      <nav className="nav" aria-label="Main">
        <a className="brand" href="/"><Mark /><b>Talby</b></a>
        <div className="nav-links">
          {NAV_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
        </div>
        <div className="nav-cta">
          <a className="login" href="/login">Log in</a>
          <a className="btn btn-p" href="/signup">Sign up free</a>
          <button
            type="button"
            className="menu-btn"
            id="menuBtn"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mmenu"
            onClick={() => setOpen((o) => !o)}
          ><i></i><i></i><i></i></button>
        </div>
      </nav>
      <div className="mmenu" id="mmenu" hidden={!open}>
        {NAV_LINKS.map((l) => <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>)}
        <a href="/login" className="mm-login" onClick={() => setOpen(false)}>Log in</a>
      </div>
    </div>
  );
}

/* ---------------- Hero + static Overview rebuild ---------------- */
function Hero() {
  return (
    <header className="hero">
      <div className="col">
        <h1>Every brand deal in one place.</h1>
        <p className="lede"><span className="lg">Talby is the calm command center for creators. Track what you agreed to, when it is due, and what has actually landed.</span><span className="sm">Track what you agreed to, when it is due, and what has landed.</span></p>
        <div className="hero-cta">
          <a className="btn btn-p btn-lg" href="/signup">Sign up free</a>
          <a className="btn btn-s btn-lg" href="#story">See how it works</a>
        </div>
        <p className="note">No card. No setup. Add a deal and go.</p>
      </div>
      <div className="hero-bg">
        <div className="shot"><OverviewMock /></div>
      </div>
    </header>
  );
}

function OverviewMock() {
  return (
    <div className="app" aria-label="The Talby overview page">
      <div className="mbar"><span className="ham"><i></i><i></i><i></i></span><span className="bell"><BellIcon /><i>3</i></span><span className="avi">J</span></div>
      <aside className="side">
        <div className="who"><span className="avi">J</span><div><b>JunoBakes</b><span>@JunoBakes</span></div><span className="bell"><BellIcon /><i>3</i></span></div>
        <div className="grp">Manage</div>
        <div className="nav-i on"><IconHome size={15} />Overview</div>
        <div className="nav-i"><IconBriefcase size={15} />Deals<span className="cnt">19</span></div>
        <div className="nav-i"><IconCalendar size={15} />Calendar</div>
        <div className="nav-i"><IconDollar size={15} />Payments</div>
        <div className="grp">Create</div>
        <div className="nav-i"><IconIdea size={15} />Ideas</div>
        <div className="nav-i"><IconNotes size={15} />To-dos</div>
        <div className="bot">
          <div className="nav-i"><MoonIcon />Theme<span className="dotb"></span></div>
          <div className="nav-i"><IconSettings size={15} />Settings<svg className="out" viewBox="0 0 24 24"><path d="M14 4h-4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"/><path d="M14 12h7M18 9l3 3-3 3"/></svg></div>
        </div>
      </aside>
      <div className="main">
        <div className="top">
          <div><div className="greet">Good afternoon</div><div className="greet-s">You&apos;ve got $19,200 coming in, and 0 invoices worth chasing.</div></div>
          <a className="btn btn-p" href="#">+ Add deal</a>
        </div>
        <div className="stats3">
          <div className="card stat"><div className="stat-k">Booked</div><div className="stat-v">$106,250</div><div className="stat-m">across 19 active deals</div></div>
          <div className="card stat"><div className="stat-k">Paid</div><div className="stat-v" style={{ color: "var(--green)" }}>$77,850</div><div className="stat-m">received, all time</div></div>
          <div className="card stat"><div className="stat-k">Outstanding</div><div className="stat-v" style={{ color: "#C99A2E" }}>$19,200</div><div className="stat-m">3 payments expected</div></div>
        </div>
        <OverviewDealsList />
        <div>
          <div className="card wk">
            <b>This week</b>
            <div className="days">
              <div className="d sel"><span>Sun</span><b>20</b></div>
              <div className="d"><span>Mon</span><b>21</b></div>
              <div className="d"><span>Tue</span><b>22</b><i></i></div>
              <div className="d today"><span>Wed</span><b>23</b></div>
              <div className="d"><span>Thu</span><b>24</b></div>
              <div className="d"><span>Fri</span><b>25</b></div>
              <div className="d"><span>Sat</span><b>26</b></div>
            </div>
            <p>Nothing scheduled for Sun 20. Enjoy the quiet.</p>
          </div>
          <div className="card pay" style={{ marginTop: 14 }}>
            <div className="ph"><b>Payments</b><a href="#">View all</a></div>
            <OverviewPayRow day="15" mon="Oct" name="Halcyon Skincare" sub="Not invoiced" amt="$5,500" />
            <OverviewPayRow day="8" mon="Nov" name="Meadowlark Tea" sub="Not invoiced" amt="$3,900" />
          </div>
        </div>
      </div>
      <span className="fab" aria-hidden style={{ background: "conic-gradient(from 0deg, #1f7ae0, #5fa3ee, #1f7ae0)" }}><span className="fab-disk"><FluentBotSparkle28Regular width={22} height={22} /></span></span>
    </div>
  );
}

function OverviewDealsList() {
  const rows = [
    ["H", "Halcyon Skincare", "p-not", "Not invoiced", "$5,500"],
    ["M", "Meadowlark Tea", null, "Negotiating", "$3,900"],
    ["B", "Basewear Co.", null, "Negotiating", "$9,800"],
    ["N", "Nova Nutrition", "p-paid", "Paid", "$1,450"],
    ["L", "Lumen Beauty", "p-paid", "Paid", "$5,000"],
  ] as const;
  return (
    <div className="card">
      <div className="dl-h"><b>Active deals</b><span className="srch"><SearchIcon />Search your deals</span><span className="seg"><span className="on">Active</span><span>Unpaid</span><span>Paid</span><span>All</span></span></div>
      {rows.map(([lt, nm, pill, ps, amt], i) => (
        <div className="drw" style={i === 0 ? { borderTop: 0 } : undefined} key={nm}>
          <span className="lt">{lt}</span><span className="nm">{nm}</span>
          <span className="pill" style={pill ? { background: "var(--green-b)", color: "var(--green)" } : { background: "var(--ctrl)", color: "var(--sec)" }}>{ps}</span>
          <span className="mono">{amt}</span>
        </div>
      ))}
      <div className="dl-f"><span>19 deals</span><span><em>Previous</em><em>Page 1 of 2</em><em>Next</em></span></div>
    </div>
  );
}
function OverviewPayRow({ day, mon, name, sub, amt }: { day: string; mon: string; name: string; sub: string; amt: string }) {
  return (
    <div className="prw"><span className="dt"><b>{day}</b><span>{mon}</span></span><span className="nm">{name}<span>{sub}</span></span><span className="rt"><span className="mono">{amt}</span><br /><span className="pill p-not">Expected</span></span></div>
  );
}

/* Tiny icons for the mock */
const ico = { width: 15, height: 15, stroke: "currentColor", fill: "none", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const BellIcon = () => (<svg {...ico} viewBox="0 0 24 24"><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>);
const HomeIcon = () => (<svg {...ico} viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/></svg>);
const BriefcaseIcon = () => (<svg {...ico} viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>);
const CalendarIcon = () => (<svg {...ico} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>);
const DollarIcon = () => (<svg {...ico} viewBox="0 0 24 24"><path d="M12 2v20"/><path d="M17 6.5c0-1.9-2.2-3-5-3s-5 1.1-5 3 2.2 3 5 3 5 1.1 5 3-2.2 3-5 3-5-1.1-5-3"/></svg>);
const BulbIcon = () => (<svg {...ico} viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0-3 11.2V17h6v-2.8A6 6 0 0 0 12 3Z"/><path d="M10 21h4"/></svg>);
const TodoIcon = () => (<svg {...ico} viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11"/><path d="m3 6 1.5 1.5L7 5M3 12l1.5 1.5L7 11"/></svg>);
const MoonIcon = () => (<svg {...ico} viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9c-4 1-8-3-9-9Z"/></svg>);
const SettingsIcon = () => (<svg {...ico} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>);
const SearchIcon = () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>);

/* ---- Comparison ---- */
const COMPARE_ROWS: [string, string, string, string, string][] = [
  ["Getting a deal in", "Type it out", "Fill in the row", "Fill in the card", "Upload the contract"],
  ["Where the contract lives", "Somewhere in email", "Somewhere in email", "Attached, if you remember", "On the deal"],
  ["Post date and pay date together", "No", "Two columns you maintain", "If you build the view", "One calendar"],
  ["Invoiced, paid or past due", "Whatever you last wrote", "A column you update", "A property you update", "Tracked per payment"],
  ["What you made this year", "Add it up yourself", "A formula you wrote", "A rollup you built", "Always on the overview"],
  ["Answers about your deals", "Scroll and search", "Scroll and search", "Scroll and search", "Ask the assistant"],
];
const TOOLS: [string, string][] = [
  ["Notes app", "logo-notes-app.png"],
  ["Spreadsheet", "logo-spreadsheet.png"],
  ["Notion", "logo-notion.png"],
];
const COMPARE_NO: Record<number, number[]> = { 0: [], 1: [0, 1], 2: [0], 3: [0], 4: [0], 5: [0, 1, 2] };

function CompareSection() {
  const [show, setShow] = useState("Notes app");
  return (
    <section className="cmp" id="compare">
      <div className="col">
        <h2>You have probably tried these already.</h2>
        <p><span className="lg">A notes app, a spreadsheet, a Notion board. They all hold the list. None of them know what a brand deal actually is.</span><span className="sm">They hold the list. None of them know what a brand deal is.</span></p>
        <div className="cmp-pick" role="tablist" aria-label="Compare Talby with">
          <span>Compare Talby with</span>
          <div>{TOOLS.map(([t]) => <button key={t} type="button" className={show === t ? "on" : ""} onClick={() => setShow(t)}>{t}</button>)}</div>
        </div>
        <div className="cmpw">
          <table className="cmpt" data-show={show}>
            <thead><tr>
              <th></th>
              {TOOLS.map(([t, img], i) => <th key={t} data-t={t}><img src={`/${img}`} alt="" />{t}</th>)}
              <th className="me" data-t="Talby"><span className="tl"><TalbyLogo width={26} color="#ffffff" /></span>Talby</th>
            </tr></thead>
            <tbody>
              {COMPARE_ROWS.map((row, ri) => (
                <tr key={ri}>
                  <td>{row[0]}</td>
                  {TOOLS.map(([t], ci) => (
                    <td key={t} data-t={t} className={COMPARE_NO[ri]?.includes(ci) ? "no" : undefined}>{row[ci + 1]}</td>
                  ))}
                  <td data-t="Talby" className="me">{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default MarketingPage;
/* ---- Story: one deal, four tabs + live demos ---- */
const CONTRACT_FIELDS: [string, string][] = [
  ["Brand", "Halcyon Skincare"],
  ["Payment", "$5,500"],
  ["Deliverable", "1 Reel, 3 Stories, 1 TikTok"],
  ["Pay terms", "Net 60"],
  ["Post date", "Oct 15, 2026"],
  ["Exclusivity", "12 months, skincare"],
];
const CONTRACT_TIMING = [250, 350, 1150, 1300, 1650, 1800, 3250]; // drop.hot, pdf.in, pdf.gone, drop.shut, file.show, bar.fill, read

function ContractDemo({ active }: { active?: boolean }) {
  const reduce = useRef<boolean>(typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  const [phase, setPhase] = useState<"idle" | "hot" | "placed" | "shut" | "done">("idle");
  const [typed, setTyped] = useState<string[]>(Array(CONTRACT_FIELDS.length).fill(""));
  const [row, setRow] = useState(-1);
  const timers = useRef<number[]>([]);
  const mounted = useRef(true);

  const play = useCallback(() => {
    timers.current.forEach(clearTimeout); timers.current = [];
    if (mounted.current) { setPhase("idle"); setTyped(Array(CONTRACT_FIELDS.length).fill("")); setRow(-1); }
    const later = (fn: () => void, ms: number) => { const id = window.setTimeout(() => { if (mounted.current) fn(); }, ms); timers.current.push(id); };
    if (reduce.current) {
      later(() => setPhase("done"), 0);
      later(() => setTyped(CONTRACT_FIELDS.map(([, v]) => v)), 0);
      later(() => setRow(CONTRACT_FIELDS.length), 0);
      return;
    }
    later(() => setPhase("hot"), 250);
    later(() => setPhase("placed"), 350);
    later(() => setPhase("shut"), 1300);
    later(() => setPhase("done"), 1650); // file shows + bar starts
    let t = 3450;
    CONTRACT_FIELDS.forEach(([, v], i) => {
      later(() => { setRow(i); setTyped((prev) => { const n = [...prev]; n[i] = v; return n; }); }, t);
      t += 420;
    });
    later(() => setRow(CONTRACT_FIELDS.length), t + 300);
  }, []);

  // autoplay when the panel becomes visible (scrolled into view OR the tab is
  // activated, so clicking Contract above the fold still plays it)
  useEffect(() => {
    mounted.current = true;
    if (active) { play(); return () => { mounted.current = false; timers.current.forEach(clearTimeout); }; }
    const el = document.getElementById("contract-demo");
    let obs: IntersectionObserver | null = null;
    if (el && "IntersectionObserver" in window && !reduce.current) {
      obs = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { play(); obs?.disconnect(); } }), { threshold: 0.4 });
      obs.observe(el);
    } else if (el) { play(); }
    return () => { mounted.current = false; timers.current.forEach(clearTimeout); obs?.disconnect(); };
  }, [play]);

  return (
    <div className="upl" id="contract-demo">
      <div className={"drop" + (phase === "shut" || phase === "done" ? " shut" : "") + (phase === "hot" ? " hot" : "")}>
        {phase === "idle" || phase === "hot" ? <div className={"pdf" + (phase === "hot" ? " in" : "")}><b>PDF</b><i></i><i></i><i></i></div> : null}
        <span className="drop-t" style={{ opacity: phase === "idle" || phase === "hot" ? 1 : 0 }}>Drop your contract here</span>
      </div>
      <div className={"fileline" + (phase === "done" ? " show" : "")} id="file">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sec)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="fn">Halcyon_Agreement.pdf</div>
          <div className="fm">{phase === "done" ? "Read in 4 seconds" : "Reading 14 pages"}</div>
          <div className="prog"><i style={{ width: phase === "done" ? "100%" : "0%", transition: phase === "done" ? "width 1.4s cubic-bezier(.4,.1,.2,1)" : "none" }} /></div>
        </div>
        <span className={"tick" + (phase === "done" ? " show" : "")}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>
      </div>
      <div className="fields">
        {CONTRACT_FIELDS.map(([k, v], i) => (
          <div className={"fld" + (phase === "done" ? " on done" : "")} key={k}>
            <div className="k">{k}</div>
            <div className="v">{phase === "done" ? v : <span className="skel" />}</div>
          </div>
        ))}
      </div>
      <div className="upl-foot">
        <span className={"done-n" + (phase === "done" ? " show" : "")}>6 details filled in. Nothing typed.</span>
        {row >= CONTRACT_FIELDS.length && <button className="replay" onClick={play}>Replay</button>}
      </div>
    </div>
  );
}

const DEALS = [
  { n: "Northbrook Athletic", s: "Invoiced", c: "p-inv", t: "Net 60", a: 12500, st: "active", d: "1 YouTube integration", pd: "Oct 2" },
  { n: "Halcyon Skincare", s: "Not invoiced", c: "p-not", t: "Net 30", a: 5500, st: "active", d: "1 Reel, 3 Stories", pd: "Oct 15" },
  { n: "Kindred Foods", s: "Paid", c: "p-paid", t: "Net 30", a: 2900, st: "paid", d: "2 TikToks", pd: "Sep 5" },
  { n: "Petal and Pine", s: "Past due", c: "p-due", t: "Net 45", a: 1500, st: "active", d: "1 Reel", pd: "Sep 8" },
  { n: "Lumen Beauty", s: "Paid", c: "p-paid", t: "Net 60", a: 5000, st: "paid", d: "1 Reel, 3 Stories", pd: "Sep 12" },
  { n: "Verde Wellness", s: "Invoiced", c: "p-inv", t: "Net 30", a: 6200, st: "active", d: "2 TikToks, 1 Reel", pd: "Sep 18" },
];
const fmt = (n: number) => "$" + n.toLocaleString("en-US");

function DealsDemo() {
  const [f, setF] = useState<"active" | "paid" | "all">("active");
  const [open, setOpen] = useState<number | null>(null);
  const shown = DEALS.filter((d) => f === "all" || d.st === f);
  const total = shown.reduce((s, d) => s + d.a, 0);
  return (
    <div className="ui">
      <div className="ui-h">
        <div className="fchips" role="group" aria-label="Filter deals">
          {(["active", "paid", "all"] as const).map((x) => <button key={x} className={"fchip" + (f === x ? " on" : "")} data-f={x} onClick={() => setF(x)}>{x === "all" ? "All" : x[0].toUpperCase() + x.slice(1)}</button>)}
        </div>
        <span id="dcount" style={{ marginLeft: "auto", fontSize: 11, color: "var(--mut)" }}>{shown.length} deal{shown.length === 1 ? "" : "s"}</span>
      </div>
      <div id="dlist">
        {shown.map((d, i) => (
          <div key={d.n}>
            <div className={"row drowx" + (open === i ? " open" : "")} data-i={i} data-st={d.st} tabIndex={0} role="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(open === i ? null : i); } }}>
              <span className="rn" style={{ width: 160 }}>{d.n}</span><span className={"pill " + d.c}>{d.s}</span>
              <span style={{ fontSize: 12, color: "var(--sec)", marginLeft: 14 }}>{d.t}</span>
              <span className="amt">{fmt(d.a)}</span><span className="chev" aria-hidden>›</span>
            </div>
            <div className={"row dmore" + (open === i ? " open" : "")} data-for={i}>
              <div><b>Deliverable</b>{d.d}</div><div><b>Post date</b>{d.pd}</div><div><b>Pay terms</b>{d.t}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="row" style={{ background: "var(--page)", borderTop: "1px solid var(--line-s)" }}>
        <span id="dtl" style={{ fontSize: 12, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--mut)" }}>{f === "active" ? "Total active" : f === "paid" ? "Total paid" : "Total booked"}</span>
        <span className="amt" id="dtot" style={{ fontSize: 16, fontWeight: 600 }}>{fmt(total)}</span>
      </div>
    </div>
  );
}

/* Calendar demo */ 
const CAL_EVENTS: Record<number, [string, string][]> = {
  5: [["post", "Kindred"]],
  8: [["post", "Petal and Pine"]],
  12: [["pay", "Lumen $4,800"]],
  15: [["due", "Sprouts due"]],
  18: [["pay", "HVR $1,000"]],
  22: [["post", "Nova"]],
  26: [["pay", "Panera $8,000"]],
};
const CAL_DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const AGENDA_DONE = { 5: 5, 8: 8, 12: 12, 15: 15, 18: 18, 22: 22, 26: 26 };

function CalendarDemo() {
  const [days, setDays] = useState<Record<number, [string, string][]>>(CAL_EVENTS);
  const [toast, setToast] = useState("");
  const drag = useRef<{ el: HTMLElement; day: number; ox: number; oy: number } | null>(null);

  const cells: number[] = [];
  for (let d = 1; d <= 28; d++) cells.push(d);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = e.currentTarget as HTMLElement; // this IS the .ev span
    e.preventDefault();
    const r = el.getBoundingClientRect();
    const day = Number(el.closest("[data-day]")?.getAttribute("data-day"));
    drag.current = { el, day, ox: e.clientX - r.left, oy: e.clientY - r.top };
    el.classList.add("lifting");
    try { el.setPointerCapture(e.pointerId); } catch {}
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    d.el.style.transform = `translate(${e.clientX - d.ox - d.el.getBoundingClientRect().left}px, ${e.clientY - d.oy}px) scale(1.04)`;
    const under = document.elementFromPoint(e.clientX, e.clientY);
    const cell = under?.closest?.("[data-day]") as HTMLElement | null;
    document.querySelectorAll(".cal.drop-on").forEach((c) => c.classList.remove("drop-on"));
    if (cell && cell.dataset.day && Number(cell.dataset.day) !== d.day) cell.classList.add("drop-on");
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    d.el.classList.remove("lifting");
    d.el.style.transform = "";
    const under = document.elementFromPoint(e.clientX, e.clientY);
    const cell = under?.closest?.("[data-day]") as HTMLElement | null;
    document.querySelectorAll(".cal.drop-on").forEach((c) => c.classList.remove("drop-on"));
    const targetDay = cell?.dataset.day ? Number(cell.dataset.day) : null;
    if (targetDay && targetDay !== d.day) {
      setDays((prev) => {
        const src = prev[d.day] ?? [];
        const evIdx = src.findIndex((x) => x[1] === d.el.textContent);
        if (evIdx < 0) return prev;
        const ev = src[evIdx];
        const next = { ...prev };
        next[d.day] = src.filter((_, i) => i !== evIdx);
        next[targetDay] = [...(next[targetDay] ?? []), ev];
        return next;
      });
      setToast(`Moved ${d.el.textContent} to September ${targetDay}.`);
      window.setTimeout(() => setToast(""), 2600);
    }
  };

  return (
    <div className="ui" style={{ padding: 14 }}>
      <div className="calhd" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--fh)", fontSize: 15, fontWeight: 500 }}>September 2026</span>
        <span style={{ display: "flex", gap: 6, fontSize: 11, color: "var(--sec)", marginLeft: "auto" }}><i style={{ width: 7, height: 7, borderRadius: "50%", background: "#3C86D1", display: "block" }} />Post</span>
        <span style={{ display: "flex", gap: 6, fontSize: 11, color: "var(--sec)" }}><i style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green-d)", display: "block" }} />Payment</span>
        <span style={{ display: "flex", gap: 6, fontSize: 11, color: "var(--sec)" }}><i style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--coral-d)", display: "block" }} />Due</span>
      </div>
      <div id="calgrid" style={{ display: "grid", gridTemplateColumns: "repeat(7,minmax(0,1fr))", border: "1px solid var(--line-s)", borderRadius: 8, overflow: "hidden" }}>
        {CAL_DAYS.map((d) => <div className="cal-h" key={d}>{d}</div>)}
        {/* leading blanks (Sep 2026 starts Tue) */}
        <div className="cal"></div><div className="cal"></div>
        {cells.map((dd) => (
          <div className="cal" data-day={dd} key={dd} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
            <b>{dd}</b>
            {(days[dd] ?? []).map(([t, label], idx) => (
              <span key={idx} className={"ev " + t + " drag e" + dd + "-" + idx} data-s={label.split(" ")[0]} onPointerDown={onPointerDown}>{label}</span>
            ))}
          </div>
        ))}
      </div>
      <div className="agenda" id="agenda">
        {Object.entries(AGENDA_DONE).filter(([d]) => days[Number(d)]?.length).map(([d]) => (days[Number(d)] ?? []).map(([t, label], i) => (
          <div className="ag" key={`${d}-${i}`}><span className="agd">Sep {d}</span><i className={"agi ag-" + t}></i><span>{label}</span></div>
        )))}
      </div>
      <div className="toast" id="caltoast" aria-live="polite">{toast}</div>
    </div>
  );
}

/* Payments demo */
function PaymentDemo() {
  const [received, setReceived] = useState<boolean[]>([false, false, false]);
  const R0 = 57700, E0 = 27000, RN0 = 23, EN0 = 8;
  const amounts = [1000, 8000, 3400];
  const R = R0 + amounts.reduce((s, a, i) => s + (received[i] ? a : 0), 0);
  const E = E0 - amounts.reduce((s, a, i) => s + (received[i] ? a : 0), 0);
  const RN = RN0 + received.filter(Boolean).length;
  const EN = EN0 - received.filter(Boolean).length;
  const rows = [["Sep 18", "Hidden Valley Ranch", "p-inv", "Invoiced", "$1,000", 0], ["Sep 26", "Panera", "p-inv", "Invoiced", "$8,000", 1], ["Aug 28", "Sable and Stone", "p-due", "Past due", "$3,400", 2]] as const;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div className="ui stat"><div className="stat-k">Received this year</div><div className="stat-v" id="recv" style={{ color: "var(--green)" }}>{fmt(R)}</div><div className="stat-m" id="recvn">{RN} payments</div></div>
        <div className="ui stat"><div className="stat-k">Expected</div><div className="stat-v" id="expd" style={{ color: "var(--amber)" }}>{fmt(E)}</div><div className="stat-m" id="expdn">{EN} payments</div></div>
      </div>
      <div className="ui" id="plist">
        <div className="ui-h"><span className="ui-t">Coming up</span></div>
        {rows.map(([date, name, pc, ps, amt, i]) => (
          <div className={"row prow" + (received[i] ? " flash" : "")} key={name} style={{ background: received[i] ? "var(--green-b)" : undefined, transition: "background .4s" }}>
            <span className="num" style={{ fontSize: 12, color: date[0] === "S" && !received[i] ? "var(--red)" : "var(--sec)", width: 52 }}>{date}</span>
            <span className="rn">{name}</span>
            <span className={"pill " + (received[i] ? "p-paid pst" : pc + " pst")} style={{ marginLeft: 12 }}>{received[i] ? "Received" : ps}</span>
            <span className="amt">{amt}</span>
            {received[i] ? <span className="markbtn done">Received</span> : <button className="markbtn" onClick={() => setReceived((p) => p.map((x, j) => (j === i ? true : x)))}>Mark received</button>}
          </div>
        ))}
      </div>
      {received.some(Boolean) && <button className="reset" onClick={() => setReceived([false, false, false])}>Reset</button>}
    </div>
  );
}

/* Story tabs */
const STORY_TABS = [
  { id: "p1", label: "Contract", el: <ContractDemo active={true} />, kick: "Contract", h: "The contract shows up. Talby reads it.", p: "Drop in the signed PDF. Talby pulls out the brand, the rate, the deliverables, the post date and the payment terms, and puts each one where it belongs. You check the fields instead of retyping them.", chk: ["Brand, rate, deliverables and dates filled in for you", "Every field stays editable", "The PDF stays attached to the deal"] },
  { id: "p2", label: "Deal", el: <DealsDemo />, kick: "Deal", h: "Now it is a deal, next to all your others.", p: "Brand, value, status and both dates on one line. No columns to set up. Filter by what is active or what is paid and the total at the bottom changes with you.", chk: ["One line per deal, nothing to configure", "Filter by Active, Paid or All", "The total follows the filter"] },
  { id: "p3", label: "Calendar", el: <CalendarDemo />, kick: "Calendar", h: "Post dates and pay dates on the same calendar.", p: "The post goes out on one day. The invoice is due weeks later. Talby puts both on the same month view, next to every other deal, so a due date never arrives as a surprise from the brand.", chk: ["Posts and payments on one month view", "Every deal, not just this one", "Drag anything to a new day when plans change"] },
  { id: "p4", label: "Payment", el: <PaymentDemo />, kick: "Payment", h: "The money lands, and your year adds up.", p: "Most trackers stop at deal closed. Talby carries the payment through expected, invoiced and received. Mark it received and the totals at the top move.", chk: ["Expected, invoiced, received, past due", "Past due stays red until it is paid", "Your year to date, always current"] },
];

function StorySection() {
  const [active, setActive] = useState(0);
  return (
    <section className="story" id="story">
      <div className="col">
        <div className="story-h">
          <h2>One deal, start to finish.</h2>
          <p>Follow a single brand deal through Talby, from the day the contract shows up to the day the money does. Each screen is real. Try them.</p>
        </div>
        <div className="tabs" role="tablist" aria-label="Stages of a deal">
          {STORY_TABS.map((t, i) => (
            <button key={t.id} className="tab" role="tab" aria-selected={active === i} aria-controls={t.id} tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)}>{t.label}</button>
          ))}
        </div>
        {STORY_TABS.map((t, i) => (
          <div className="panel" id={t.id} role="tabpanel" aria-labelledby={t.id} hidden={active !== i} key={t.id}>
            <div className="pk"><span className="kick">{t.kick}</span><span className="live"><i></i>Live demo</span></div>
            <h3>{t.h}</h3>
            <p>{t.p}</p>
            <div className="piece">{t.el}</div>
            <ul className="chk">{t.chk.map((c) => <li key={c}>{c}</li>)}</ul>
            <div className="pf"><span></span><a className="btn btn-p" href="#">Try it free</a></div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---- Assistant demo ---- */
const QA: [string, string][] = [
  ["What did I agree to for exclusivity with Halcyon?", "<b>12 months in the skincare category</b>, starting from the October 15 post date. It is in section 4.2 of the Halcyon agreement. No other categories are restricted."],
  ["How much have I made from skincare deals this year?", "<b>$18,400 received</b> across four skincare deals, with $5,500 from Halcyon still to come."],
  ["Which invoices are past due right now?", "<b>None.</b> Three payments are expected: Halcyon on October 15, Meadowlark Tea on November 8 and Basewear on November 20. None have been invoiced yet."],
];
const ASK_LG = [
  "What did I agree to for exclusivity with Halcyon?",
  "How much have I made from skincare deals this year?",
  "Which invoices are past due right now?",
];
const ASK_SM = ["Exclusivity with Halcyon?", "Skincare earnings this year?", "Invoices past due?"];

type Msg = { kind: "me" | "ai"; text: string };

function AssistantSection() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typed, setTyped] = useState("");
  const [activeQ, setActiveQ] = useState(-1);
  const busyRef = useRef(false);
  const timers = useRef<number[]>([]);
  const started = useRef(false);
  const reduceRef = useRef<boolean>(typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  const [runningLoop, setRunningLoop] = useState(false);

  const clearTimers = useCallback(() => { timers.current.forEach(clearTimeout); timers.current = []; busyRef.current = false; }, []);
  const later = useCallback((fn: () => void, ms: number) => { const id = window.setTimeout(fn, ms); timers.current.push(id); }, []);

  const run = useCallback((qi: number) => {
    clearTimers();
    setMsgs([]); setTyped(""); setActiveQ(qi); busyRef.current = true; setRunningLoop(true);
    const [q, answer] = QA[qi];
    const delay = reduceRef.current ? 0 : 18 + Math.random() * 26;
    let k = 0;
    const typeQ = () => {
      if (k < q.length) { setTyped(q.slice(0, ++k)); later(typeQ, delay); return; }
      later(() => {
        setTyped("");
        setMsgs((m) => [...m, { kind: "me", text: q }]);
        const ai: Msg = { kind: "ai", text: "" };
        setMsgs((m) => [...m, ai]);
        later(() => {
          const words = answer.split(" ");
          let w = 0;
          const stream = () => {
            if (w < words.length) {
              const text = words.slice(0, ++w).join(" ");
              setMsgs((m) => m.map((x, i) => (i === m.length - 1 && x.kind === "ai" ? { ...x, text } : x)));
              later(stream, 45);
              return;
            }
            busyRef.current = false;
          };
          stream();
        }, 900);
      }, 350);
    };
    if (!reduceRef.current) typeQ();
    else { setTyped(q); later(() => { setTyped(""); setMsgs([{ kind: "me", text: q }, { kind: "ai", text: answer }]); busyRef.current = false; }, 50); }
  }, [clearTimers, later]);

  const loop = useCallback(() => {
    if (cycle.current >= QA.length) cycle.current = 0;
    run(cycle.current++);
    timers.current.push(window.setTimeout(loop, 9000));
  }, [run]);

  const cycle = useRef(0);

  // autostart on first scroll into view
  useEffect(() => {
    const chat = document.getElementById("chat");
    const start = () => { if (started.current) return; started.current = true; loop(); };
    if (!chat) return;
    if ("IntersectionObserver" in window) {
      const o = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { start(); o.disconnect(); } }), { threshold: 0.1 });
      o.observe(chat);
      return () => { o.disconnect(); };
    }
    start();
  }, [loop, run]);

  const pick = (qi: number) => { if (busyRef.current) { clearTimers(); } run(qi); };

  return (
    <section className="also" id="assistant">
      <div className="col">
        <div>
          <div className="ai-mark" style={{ borderRadius: "50%", background: "conic-gradient(from 0deg, #1f7ae0, #5fa3ee, #1f7ae0)" }}><span className="fab-disk" style={{ width: "72%", height: "72%", borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center" }}><FluentBotSparkle28Regular width={36} height={36} /></span></div>
          <h2>Ask Talby about your own deals.</h2>
          <p><span className="lg">The assistant only knows what is in your account: your contracts, your dates, your numbers. Ask what a clause says or how much you made in the spring, and get an answer from your own paperwork, not the internet.</span><span className="sm">Answers come from your own contracts and numbers, not the internet.</span></p>
          <div className="asks" id="asks">
            {ASK_LG.map((q, i) => <button key={i} type="button" className={"ask" + (activeQ === i ? " on" : "")} data-q={i} onClick={() => pick(i)}>{q}</button>)}
          </div>
        </div>
        <div className="chat" id="chat" aria-live="polite">
          <div className="thread" id="thread">
            {msgs.map((m, i) => m.kind === "me"
              ? <div className="msg me" key={i}>{m.text}</div>
              : <div className={"msg ai" + (m.text ? "" : " dots")} key={i}>{m.text ? <span dangerouslySetInnerHTML={{ __html: m.text }} /> : <><i></i><i></i><i></i></>}</div>)}
          </div>
          <div className="ask-bar"><span>{typed}</span><span className="caret"></span></div>
        </div>
        <div className="asks asks-m" aria-hidden="true">
          {ASK_SM.map((q, i) => <button key={i} type="button" className={"ask" + (activeQ === i ? " on" : "")} data-q={i} onClick={() => pick(i)}>{q}</button>)}
        </div>
      </div>
    </section>
  );
}

/* ---- Pricing ---- */
function PricingSection() {
  return (
    <section className="price" id="pricing">
      <div className="col">
        <h2>Free for your first five deals.</h2>
        <p><span className="lg">Everything above is on the free plan. Pay when you have more deals than that going at once.</span><span className="sm">Everything above is on the free plan.</span></p>
        <div className="plans">
          <div className="plan">
            <h3>Free</h3>
            <div className="cost">$0</div>
            <div className="for">Up to 5 active deals</div>
            <ul>
              <li><Ck />Contract reading, deals, calendar and payments</li>
              <li><Ck />Deal scanner for forwarded emails</li>
              <li><Ck />Import from a spreadsheet or Notion</li>
              <li className="up"><Ck />Talby assistant</li>
              <li className="up"><Ck />Retainer and repeating deals</li>
              <li className="up"><Ck />Year end income summary</li>
            </ul>
            <a className="btn btn-s" href="/signup">Sign up free</a>
          </div>
          <div className="plan">
            <h3>Unlimited</h3>
            <div className="cost">$9<small>a month</small></div>
            <div className="for">As many deals as you can land</div>
            <ul>
              <li><Ck />Everything in Free, no deal cap</li>
              <li><Ck />Talby assistant</li>
              <li><Ck />Retainer and repeating deals</li>
              <li><Ck />Year end income summary</li>
            </ul>
            <a className="btn btn-p" href="/signup?plan=unlimited">Start with Unlimited</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- Close ---- */
function CloseSection() {
  return (
    <section className="close">
      <div className="col">
        <h2>Add your first deal tonight.</h2>
        <p>It takes about a minute, and you will know exactly what is due and what is owed by the time you are done.</p>
        <a className="btn btn-p btn-lg" href="/signup">Sign up free</a>
      </div>
    </section>
  );
}

/* ---- Footer ---- */
function SiteFooter() {
  return (
    <footer>
      <div className="col">
        <a className="brand" href="/"><Mark /><b>Talby</b></a>
        <a href="/blog">Blog</a>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="mailto:hello@talby.io">hello@talby.io</a>
        <span>www.talby.io</span><span>Aerolune LLC</span>
      </div>
    </footer>
  );
}
