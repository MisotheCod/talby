"use client";

// One entrance-animation helper, shared across pages, matching the dashboard's
// GSAP language (see app/page.tsx). Reusable: any page can drop CSS classes on
// its content and call `pageEntrance(root, opts)` once data is loaded.
//
// Classes it animates (each guarded by presence, so pages opt in per region):
//   .entr        — a top-level block (header/panel/card): rises in, staggered
//   .entr-row    — a list/table row: slides in from the left, staggered
//   .entr-bar    — a bar in a bar chart: grows straight up from the baseline
//   .entr-line   — an SVG polyline/<path>: draws itself left → right
//   .entr-count  — a number value: counts up to the number in data-count
//
// Behavior is the same shape as overview: power2 ease, short durations, small
// stagger, tiny delay so the skeleton-to-content swap doesn't feel abrupt.

import gsap from "gsap";

export type EntranceOpts = {
  stagger?: number;      // default 0.07
  delay?: number;        // default 0.06
  rowStagger?: number;   // default 0.05
  rowDelay?: number;     // default 0.4 (after blocks)
  barDelay?: number;     // default 0.45
  lineDelay?: number;    // default 0.5
};

export function pageEntrance(root: HTMLElement, opts: EntranceOpts = {}) {
  const stagger = opts.stagger ?? 0.07;
  const delay = opts.delay ?? 0.06;
  const rowStagger = opts.rowStagger ?? 0.05;
  const rowDelay = opts.rowDelay ?? 0.4;
  const barDelay = opts.barDelay ?? 0.45;
  const lineDelay = opts.lineDelay ?? 0.5;

  const ctx = gsap.context(() => {
    // Top-level blocks rise in, one after another.
    const blocks = Array.from(root.querySelectorAll<HTMLElement>(".entr"));
    if (blocks.length) {
      gsap.set(blocks, { opacity: 0, y: 16 });
      gsap.to(blocks, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger, delay });
    }

    // List / table rows slide in one by one.
    const rows = Array.from(root.querySelectorAll<HTMLElement>(".entr-row"));
    if (rows.length) {
      gsap.set(rows, { opacity: 0, x: -10 });
      gsap.to(rows, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out", stagger: rowStagger, delay: delay + rowDelay });
    }

    // Bar-chart bars grow straight up from the baseline.
    const bars = Array.from(root.querySelectorAll<HTMLElement>(".entr-bar"));
    if (bars.length) {
      // capture final heights, animate a scaleY from 0 anchored at the bottom
      gsap.set(bars, { transformOrigin: "0% 100%", scaleY: 0 });
      gsap.to(bars, { scaleY: 1, duration: 0.6, ease: "power2.out", stagger: 0.04, delay: delay + barDelay });
    }

    // SVG line draws itself.
    const lines = Array.from(root.querySelectorAll<SVGPathElement>(".entr-line"));
    if (lines.length) {
      lines.forEach((p) => {
        const len = p.getAttribute("pathLength") || p.getTotalLength?.();
        if (len) p.setAttribute("pathLength", "1");
      });
      gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.to(lines, { strokeDashoffset: 0, duration: 0.8, ease: "power2.out", stagger: 0.06, delay: delay + lineDelay });
    }

    // Number count-up.
    const counts = Array.from(root.querySelectorAll<HTMLElement>(".entr-count"));
    counts.forEach((el, i) => {
      const n = Number(el.dataset.count || "0");
      if (n <= 0) return;
      const o = { v: 0 };
      gsap.to(o, {
        v: n,
        duration: 1.0,
        ease: "power2.out",
        delay: delay + 0.35 + i * 0.12,
        onUpdate() {
          let s = Math.round(o.v).toLocaleString();
          if (el.dataset.prefix) s = el.dataset.prefix + s;
          if (el.dataset.suffix) s = s + el.dataset.suffix;
          el.textContent = s;
        },
      });
    });
  }, root);

  return () => ctx.revert();
}