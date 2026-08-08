"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TalbyLogo } from "@/components/marketing/talby-logo";

gsap.registerPlugin(ScrollTrigger);

/* Inline stroke icons matching the prototype's simple 2–2.4 stroke style */
const IconDeals = () => (
  <svg viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h10" /></svg>
);
const IconMoney = () => (
  <svg viewBox="0 0 24 24"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
);
const IconPayments = () => (
  <svg viewBox="0 0 24 24"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
);
const IconOverview = () => (
  <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>
);
const IconOverviewNav = () => (
  <svg viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h10" /></svg>
);
const IconStar = () => (
  <svg viewBox="0 0 24 24"><path d="M12 2l2.2 6.9H21l-5.5 4.2 2.1 6.9L12 15l-5.6 4L8.5 13 3 8.9h6.8z" /></svg>
);
const IconBubble = () => (
  <svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 01-8 8H4l2-3a8 8 0 1115-5z" /></svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
);
const IconChart = () => (
  <svg viewBox="0 0 24 24"><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" /></svg>
);
const IconSend = () => (
  <svg viewBox="0 0 24 24"><path d="M4 20l16-8L4 4l3 8z" /></svg>
);

export function MarketingPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduce) {
      const heroEl = root.querySelector<HTMLElement>(".hero");
      const onMove = (e: MouseEvent) => {
        const cx = e.clientX / window.innerWidth - 0.5;
        const cy = e.clientY / window.innerHeight - 0.5;
        gsap.utils.toArray<HTMLElement>(".orb").forEach((o, i) => {
          const depth = ((i % 3) + 1) * 10;
          gsap.to(o, { x: cx * depth, y: cy * depth * 0.5, duration: 0.8, ease: "power2.out", overwrite: "auto" });
        });
      };

      const ctx = gsap.context(() => {
        // ---- HERO intro ----
        gsap.to("#heroH .w", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.07, delay: 0.1, startAt: { y: 30 } });
        gsap.to("#heroP", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.6, startAt: { y: 20 } });
        gsap.to("#heroC", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.75, startAt: { y: 20 } });
        gsap.to("#heroN", { opacity: 1, duration: 0.7, delay: 0.9 });

        // ---- floating symbols: pop in ----
        gsap.to(".orb", { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.8)", stagger: 0.08, delay: 0.5, startAt: { scale: 0.4 } });

        // ---- hero dashboard mock ----
        gsap.to("#heromock", { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out", delay: 1.0, startAt: { y: 60, scale: 0.97 } });
        gsap.to(".hm-row", { opacity: 1, x: 0, duration: 0.55, ease: "power2.out", stagger: 0.09, delay: 1.5, startAt: { x: -14 } });
        gsap.utils.toArray<HTMLElement>(".hnum").forEach((el, i) => {
          const n = +el.dataset.n!;
          const o = { v: 0 };
          gsap.to(o, { v: n, duration: 1.3, ease: "power2.out", delay: 1.4 + i * 0.15, onUpdate: () => { el.textContent = "$" + Math.round(o.v).toLocaleString(); } });
        });
        gsap.to("#hcap", { width: "80%", duration: 1, ease: "power2.out", delay: 1.7 });

        // ---- mobile orb row: rise from behind the header, re-arms via matchMedia ----
        const mm = gsap.matchMedia();
        mm.add("(max-width: 900px)", () => {
          const floats: gsap.core.Tween[] = [];
          const rise = gsap.fromTo(
            ".orb-m",
            { opacity: 0, y: 70, scale: 0.5 },
            {
              opacity: 1, y: 0, scale: 1, duration: 0.75, ease: "back.out(1.7)", stagger: 0.1, delay: 0.9,
              onComplete: () => {
                gsap.utils.toArray<HTMLElement>(".orb-m").forEach((o, i) => {
                  floats.push(gsap.to(o, { y: "-=8", duration: 2.2 + i * 0.3, ease: "sine.inOut", yoyo: true, repeat: -1 }));
                });
              },
            },
          );
          return () => { rise.kill(); floats.forEach((t) => t.kill()); gsap.set(".orb-m", { clearProps: "all" }); };
        });

        // ---- orbs drift forever ----
        gsap.utils.toArray<HTMLElement>(".orb").forEach((o, i) => {
          gsap.to(o, { y: "+=14", rotation: "+=" + (i % 2 ? 6 : -6), duration: 2.6 + i * 0.35, ease: "sine.inOut", yoyo: true, repeat: -1 });
        });

        // ---- orbs mouse parallax ----
        heroEl?.addEventListener("mousemove", onMove);

        // ---- scroll reveals ----
        gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 86%" } });
        });

        // ---- section panels rise ----
        gsap.utils.toArray<HTMLElement>(".tintwrap, .ctapanel").forEach((p) => {
          gsap.from(p, { opacity: 0, y: 60, scale: 0.965, duration: 1, ease: "power3.out", scrollTrigger: { trigger: p, start: "top 85%" } });
        });

        // ---- action cards batch ----
        ScrollTrigger.batch(".act", {
          start: "top 88%",
          onEnter: (b) => gsap.fromTo(b, { scale: 0.92, opacity: 0, y: 26 }, { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.6)", stagger: 0.09 }),
        });

        // ---- count-up money (trio) ----
        gsap.utils.toArray<HTMLElement>(".cnt").forEach((el) => {
          const n = +el.dataset.n!;
          ScrollTrigger.create({
            trigger: el, start: "top 85%", once: true,
            onEnter: () => {
              const o = { v: 0 };
              gsap.to(o, { v: n, duration: 1.4, ease: "power2.out", onUpdate: () => { el.textContent = "$" + Math.round(o.v).toLocaleString(); } });
            },
          });
        });

        // ---- feature cards: parallax + tilt ----
        gsap.utils.toArray<HTMLElement>(".tiltcard").forEach((card) => {
          gsap.to(card, { y: -24, scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 1.2 } });
          card.addEventListener("mousemove", (e) => {
            const r = card.getBoundingClientRect();
            const rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
            const ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
            gsap.to(card, { rotationX: rx, rotationY: ry, transformPerspective: 800, duration: 0.4, ease: "power2.out" });
          });
          card.addEventListener("mouseleave", () => gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.6, ease: "power3.out" }));
        });

        // ---- action card tilt ----
        gsap.utils.toArray<HTMLElement>(".act").forEach((card) => {
          card.addEventListener("mousemove", (e) => {
            const r = card.getBoundingClientRect();
            gsap.to(card, { rotationX: ((e.clientY - r.top) / r.height - 0.5) * -7, rotationY: ((e.clientX - r.left) / r.width - 0.5) * 7, transformPerspective: 900, duration: 0.35 });
          });
          card.addEventListener("mouseleave", () => gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.5, ease: "power3.out" }));
        });
      }, root);

      return () => {
        heroEl?.removeEventListener("mousemove", onMove);
        ctx.revert();
      };
    } else {
      // ---- reduced motion: everything visible + static ----
      root.querySelectorAll(".reveal,#heroP,#heroC,#heroN").forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.transform = "none";
      });
      root.querySelectorAll("#heroH .w").forEach((el) => ((el as HTMLElement).style.opacity = "1"));
      root.querySelectorAll(".orb-m").forEach((el) => ((el as HTMLElement).style.opacity = "1"));
      const hm = root.querySelector("#heromock") as HTMLElement | null;
      if (hm) hm.style.opacity = "1";
      root.querySelectorAll(".hm-row").forEach((el) => ((el as HTMLElement).style.opacity = "1"));
      root.querySelectorAll(".hnum").forEach((el) => { const n = +(el as HTMLElement).dataset.n!; el.textContent = "$" + n.toLocaleString(); });
      const hc = root.querySelector("#hcap") as HTMLElement | null;
      if (hc) hc.style.width = "80%";
      root.querySelectorAll(".cnt").forEach((el) => { const n = +(el as HTMLElement).dataset.n!; el.textContent = "$" + n.toLocaleString(); });
    }
  }, []);

  return (
    <div className="mkt" ref={rootRef}>
      {/* Nav */}
      <nav>
        <div className="nav-in">
          <div className="brand"><TalbyLogo width={24} height={23} className="lmark" />Talby</div>
          <div className="nlinks">
            <a href="#features">Features</a><a href="#paid">Payments</a><a href="#details">Details</a><a href="#faq">FAQ</a>
          </div>
          <div className="nav-r">
            <a href="/signup" className="btn btn-ghost" style={{ padding: "10px 8px" }}>Sign up</a>
            <a href="/login" className="btn" style={{ background: "#fff", border: "1px solid var(--line-2)", color: "var(--ink)", fontWeight: 600 }}>Log in</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero">
        <div className="orbs">
          <span className="orb o1"><span className="txt">$</span></span>
          <span className="orb o2"><IconCalendar /></span>
          <span className="orb o3"><IconSend /></span>
          <span className="orb o4"><IconChart /></span>
          <span className="orb o5"><IconStar /></span>
          <span className="orb o6"><IconBubble /></span>
          <span className="orb o7"><IconCheck /></span>
        </div>
        <div className="wrap">
          <div className="orbs-m" id="orbsM">
            <span className="orb-m om1"><span className="txt">$</span></span>
            <span className="orb-m om2"><IconCalendar /></span>
            <span className="orb-m om3"><IconSend /></span>
            <span className="orb-m om4"><IconChart /></span>
          </div>
          <h1 id="heroH">
            <span className="w">Organize</span> <span className="w">your</span><br />
            <span className="w blue">brand</span> <span className="w blue">deals.</span>
          </h1>
          <p id="heroP">Deals, money, and content in one calm place. Running your creator business has never been this simple.</p>
          <div className="hero-cta" id="heroC">
            <a href="/signup" className="btn btn-3d btn-lg">Sign up free</a>
            <a href="#features" className="btn btn-ghost btn-lg">See how it works</a>
          </div>
          <div className="hero-note" id="heroN">Free while you're getting started. No card, no setup.</div>

          <div className="heromock" id="heromock">
            <div className="hm-top">
              <span className="hm-dot" style={{ background: "#f2705b" }} /><span className="hm-dot" style={{ background: "#f3b93c" }} /><span className="hm-dot" style={{ background: "#2f9e6f" }} />
            </div>
            <div className="hm-body">
              <div className="hm-side">
                <div className="hm-brand"><TalbyLogo width={17} height={16} className="lmark" />Talby</div>
                <div className="hm-nav on"><IconOverview />Overview</div>
                <div className="hm-nav"><IconOverviewNav />Deals</div>
                <div className="hm-nav"><IconCalendar />Calendar</div>
                <div className="hm-nav"><IconPayments />Payments</div>
              </div>
              <div className="hm-main">
                <div className="hm-greet">Good evening, Chanel</div>
                <div className="hm-stats">
                  <div className="hm-stat"><div className="l">Booked</div><div className="v hnum" data-n="8400">$0</div></div>
                  <div className="hm-stat"><div className="l">Paid</div><div className="v hnum" data-n="5150" style={{ color: "var(--green)" }}>$0</div></div>
                  <div className="hm-stat"><div className="l">Outstanding</div><div className="v hnum" data-n="3250" style={{ color: "var(--gold)" }}>$0</div></div>
                  <div className="hm-stat cap"><div className="l">Deals</div><div className="v">4 / 5</div><div className="capbar"><i id="hcap" /></div></div>
                </div>
                <div className="hm-cols">
                  <div className="hm-panel">
                    <div className="hm-ph">Active deals</div>
                    <div className="hm-row"><span className="hm-logo" style={{ background: "var(--gold)" }}>G</span><span className="n">Glow Ritual</span><span className="hm-pill" style={{ background: "var(--gold-t)", color: "var(--gold)" }}>Awaiting</span></div>
                    <div className="hm-row"><span className="hm-logo" style={{ background: "var(--green)" }}>L</span><span className="n">Lumen Wellness</span><span className="hm-pill" style={{ background: "var(--green-t)", color: "var(--green)" }}>Paid</span></div>
                    <div className="hm-row"><span className="hm-logo" style={{ background: "var(--coral)" }}>V</span><span className="n">Verde Tea Co.</span><span className="hm-pill" style={{ background: "var(--coral-t)", color: "var(--coral)" }}>Past due</span></div>
                    <div className="hm-row"><span className="hm-logo" style={{ background: "var(--purple)" }}>B</span><span className="n">Bloom and Co.</span><span className="a">$2,650</span></div>
                  </div>
                  <div className="hm-panel">
                    <div className="hm-ph">Payments</div>
                    <div className="hm-row"><span className="hm-bar" style={{ background: "var(--coral)" }} /><span className="n">Verde Tea</span><span className="a">$1,450</span></div>
                    <div className="hm-row"><span className="hm-bar" style={{ background: "var(--gold)" }} /><span className="n">Glow Ritual</span><span className="a">$1,800</span></div>
                    <div className="hm-row"><span className="hm-bar" style={{ background: "var(--green)" }} /><span className="n">Lumen</span><span className="a">$2,500</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Action cards */}
      <section className="actions" id="features">
        <div className="wrap">
          <div className="shead reveal"><h2>Run your deals in a whole new way.</h2></div>
          <div className="acts">
            <div className="act a-blue reveal"><div className="ic"><IconOverviewNav /></div><h3>Track</h3><p>Every deal in one clean list. Brand, value, status, due date.</p></div>
            <div className="act a-green reveal"><div className="ic"><IconMoney /></div><h3>Get paid</h3><p>See what's expected, overdue, and landed. Chase nothing blind.</p></div>
            <div className="act a-gold reveal"><div className="ic"><IconCalendar /></div><h3>Plan</h3><p>Content on a calendar, with repeats that fill themselves in.</p></div>
            <div className="act a-purple reveal"><div className="ic"><IconStar /></div><h3>Capture</h3><p>Ideas from bucket to posted, before they slip away.</p></div>
          </div>
        </div>
      </section>

      {/* Trio */}
      <section className="trio">
        <div className="wrap">
          <div className="tintwrap t-blue">
            <div className="shead reveal"><h2>Deals, money, content. All in one place.</h2></div>
            <div className="mocks">
              <div className="mock reveal">
                <div className="card">
                  <div className="mrow"><span className="mdot" style={{ background: "var(--gold)" }}>G</span><span className="n">Glow Ritual</span><span className="spill sp-y">Awaiting</span></div>
                  <div className="mrow"><span className="mdot" style={{ background: "var(--green)" }}>L</span><span className="n">Lumen Wellness</span><span className="spill sp-g">Paid</span></div>
                  <div className="mrow"><span className="mdot" style={{ background: "var(--coral)" }}>V</span><span className="n">Verde Tea Co.</span><span className="spill sp-r">Past due</span></div>
                  <div className="mrow"><span className="mdot" style={{ background: "var(--purple)" }}>B</span><span className="n">Bloom and Co.</span><span className="v">$2,650</span></div>
                </div>
                <h5>Deals</h5>
              </div>
              <div className="mock reveal">
                <div className="card">
                  <div className="mstat"><span>Booked</span><b>$8,400</b></div>
                  <div className="mstat"><span>Paid</span><b style={{ color: "var(--green)" }} className="cnt" data-n="5150">$0</b></div>
                  <div className="mstat" style={{ border: "none" }}><span>Outstanding</span><b style={{ color: "var(--gold)" }} className="cnt" data-n="3250">$0</b></div>
                </div>
                <h5>Money</h5>
              </div>
              <div className="mock reveal">
                <div className="card">
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>August</div>
                  <div className="cal7">
                    <span className="cd">4</span><span className="cd on">5</span><span className="cd">6</span><span className="cd pay">7</span><span className="cd">8</span><span className="cd on">9</span><span className="cd">10</span>
                    <span className="cd">11</span><span className="cd pay">12</span><span className="cd">13</span><span className="cd on">14</span><span className="cd">15</span><span className="cd">16</span><span className="cd">17</span>
                  </div>
                </div>
                <h5>Calendar</h5>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature: Organized */}
      <section className="feat-sec">
        <div className="wrap"><div className="tintwrap t-blue fgrid2">
          <div className="fcopy reveal">
            <span className="tag">Organized</span>
            <h2>Every deal, readable at a glance.</h2>
            <p>Tap any deal and the whole story slides open: value, status, checklist, notes, and its payments. No columns to configure, ever.</p>
            <ul className="fl"><li>Clean deal list with filters</li><li>Tabbed detail drawer</li><li>Editable status inline</li></ul>
          </div>
          <div className="fmedia reveal"><div className="fcard tiltcard">
            <h6>Glow Ritual <span>$1,800</span></h6>
            <div className="payrow"><span className="pbar" style={{ background: "var(--gold)" }} /><span className="nm">1 Reel + 2 Stories</span><span className="spill sp-y">Due Aug 12</span></div>
            <div className="payrow"><span className="pbar" style={{ background: "var(--blue)" }} /><span className="nm">Draft approved</span><span className="spill" style={{ background: "var(--blue-tint)", color: "var(--blue)" }}>Done</span></div>
            <div className="payrow"><span className="pbar" style={{ background: "var(--green)" }} /><span className="nm">Payment on delivery</span><span className="am">$1,800</span></div>
          </div></div>
        </div></div>
      </section>

      {/* Feature: Paid */}
      <section className="feat-sec" id="paid">
        <div className="wrap"><div className="tintwrap t-green fgrid2 flip">
          <div className="fcopy reveal">
            <span className="tag" style={{ color: "var(--green)" }}>Paid</span>
            <h2>Know when the money lands.</h2>
            <p>Most tools stop at "deal closed." Talby follows the money the whole way, expected to overdue to received, so nothing slips.</p>
            <ul className="fl"><li>Payment timeline with due dates</li><li>Past-due flags you can't miss</li><li>Tap to mark received, totals update live</li></ul>
          </div>
          <div className="fmedia reveal"><div className="fcard tiltcard">
            <h6>Payments <span>$3,250 expected</span></h6>
            <div className="payrow"><span className="pbar" style={{ background: "var(--coral)" }} /><span className="nm">Verde Tea Co.</span><span className="spill sp-r">Past due</span></div>
            <div className="payrow"><span className="pbar" style={{ background: "var(--gold)" }} /><span className="nm">Glow Ritual</span><span className="spill sp-y">Aug 12</span></div>
            <div className="payrow"><span className="pbar" style={{ background: "var(--green)" }} /><span className="nm">Lumen Wellness</span><span className="spill sp-g">Received</span></div>
          </div></div>
        </div></div>
      </section>

      {/* Feature: Planned */}
      <section className="feat-sec">
        <div className="wrap"><div className="tintwrap t-gold fgrid2">
          <div className="fcopy reveal">
            <span className="tag" style={{ color: "var(--gold)" }}>Planned</span>
            <h2>Content that schedules itself.</h2>
            <p>Set the posts you repeat, every week or every two, and your calendar fills itself in. Deliverables land on their due dates automatically.</p>
            <ul className="fl"><li>Recurring posts that auto-populate</li><li>Drag to reschedule</li><li>Payments as chips on the calendar</li></ul>
          </div>
          <div className="fmedia reveal"><div className="fcard tiltcard">
            <h6>This week <span>3 planned</span></h6>
            <div className="payrow"><span className="pbar" style={{ background: "var(--blue)" }} /><span className="nm">GRWM Reel</span><span className="spill" style={{ background: "var(--blue-tint)", color: "var(--blue)" }}>Repeats weekly</span></div>
            <div className="payrow"><span className="pbar" style={{ background: "var(--purple)" }} /><span className="nm">Newsletter</span><span className="spill" style={{ background: "var(--purple-t)", color: "var(--purple)" }}>Biweekly</span></div>
            <div className="payrow"><span className="pbar" style={{ background: "var(--gold)" }} /><span className="nm">Glow Ritual deliverable</span><span className="spill sp-y">Aug 12</span></div>
          </div></div>
        </div></div>
      </section>

      {/* Details */}
      <section className="details" id="details">
        <div className="wrap">
          <div className="shead reveal"><h2>Details that matter.</h2><p>We sweat the small stuff, so you don't have to.</p></div>
          <div className="dgrid">
            <div className="dcard reveal">
              <div className="demo"><div className="ring" /><div style={{ fontSize: 13, fontWeight: 600 }}>4 of 5 free deals used<br /><span style={{ color: "var(--ink-2)", fontWeight: 500 }}>Growth looks good on you.</span></div></div>
              <h4>Honest free plan</h4>
              <p>The whole app is free up to 5 active deals. Hit the cap and it means business is good. Ten dollars a month removes it.</p>
            </div>
            <div className="dcard reveal">
              <div className="demo"><div className="swrow">
                <span className="swc" style={{ background: "#1f7ae0" }} /><span className="swc" style={{ background: "#8b6cf0" }} /><span className="swc" style={{ background: "#2f9e6f" }} /><span className="swc" style={{ background: "#f2705b" }} /><span className="swc" style={{ background: "#e0a32e" }} />
              </div></div>
              <h4>Make it yours</h4>
              <p>Drag across a palette and watch the app re-tint live. One accent, applied tastefully. Impossible to make ugly.</p>
            </div>
            <div className="dcard reveal">
              <div className="demo"><span className="bigchip" style={{ background: "var(--blue-tint)", color: "var(--blue)" }}><span className="d" style={{ background: "var(--blue)" }} />Import from Notion or a spreadsheet</span></div>
              <h4>Bring your deals with you</h4>
              <p>Drop in a spreadsheet or connect Notion and Talby reads your columns for you. Your deals appear already organized.</p>
            </div>
            <div className="dcard reveal">
              <div className="demo"><span className="bigchip" style={{ background: "var(--green-t)", color: "var(--green)" }}><span className="d" style={{ background: "var(--green)" }} />$1,500 received from Lumen</span></div>
              <h4>Money you can feel</h4>
              <p>Mark a payment received and watch your totals move. The satisfying part of the job, made actually satisfying.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faqsec" id="faq">
        <div className="wrap">
          <div className="shead reveal"><h2>Questions, answered.</h2></div>
          <div className="faq reveal">
            <details open><summary>Is this just another Notion template?<IconChev /></summary><p>No. Notion makes you build the system before you can use it. Talby is the finished thing. Sign up, add a deal, and it works. Nothing to configure, no template to buy.</p></details>
            <details><summary>What makes it different from a deal tracker?<IconChev /></summary><p>Most trackers stop at deal status. Talby follows the money (expected, overdue, and received) and ties it to a content calendar, so the business side and posting side finally live together.</p></details>
            <details><summary>Do you post to my social accounts?<IconChev /></summary><p>Not right now. Talby plans and organizes your content. It doesn't publish for you. It's your command center, not your scheduler.</p></details>
            <details><summary>What happens when I hit 5 deals?<IconChev /></summary><p>Only active deals count. Anything you've wrapped and archived is free and unlimited. When you've got more than five going at once, go unlimited for $10 a month. Usually that means business is good.</p></details>
            <details><summary>Is my data private?<IconChev /></summary><p>Yes. Everything you add is tied to your account and yours alone. Nobody else can see your deals, your money, or your numbers.</p></details>
          </div>
        </div>
      </section>

      {/* End CTA */}
      <section className="endcta">
        <div className="wrap reveal">
          <div className="ctapanel">
            <h2>Run the business behind the content.</h2>
            <p>Set up your command center in minutes. Free to start.</p>
            <a href="/signup" className="btn btn-w3d btn-lg">Sign up free</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="wrap">
          <div className="fgrid3">
            <div style={{ maxWidth: 260 }}>
              <div className="brand"><TalbyLogo width={24} height={23} className="lmark" />Talby</div>
              <p style={{ fontSize: 13.5, color: "var(--ink-2)", marginTop: 10 }}>The command center for creators who are actually earning.</p>
            </div>
            <div style={{ display: "flex", gap: 60, flexWrap: "wrap" }}>
              <div className="fcol"><h5>Product</h5><a href="#features">Features</a><a href="#paid">Payments</a><a href="#details">Details</a><a href="#faq">FAQ</a></div>
              <div className="fcol"><h5>Company</h5><a href="#">About</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="#">Contact</a></div>
              <div className="fcol"><h5>Start</h5><a href="/signup">Sign up free</a><a href="/login">Log in</a></div>
            </div>
          </div>
          <div className="fbot"><span>© 2026 Talby</span><span>Made for creators, not spreadsheets.</span></div>
        </div>
      </footer>
    </div>
  );
}

function IconChev() {
  return (
    <svg className="chev" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
  );
}
