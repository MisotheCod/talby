// @ts-nocheck
/* eslint-disable */
'use client';
/**
 * Talby board runtime.
 *
 * Every component in this folder was converted from a design board
 * (design-source/boards/*.dc.html). This file reproduces the exact rules the
 * design canvas used to render those boards, so the converted components look
 * and behave the same, pixel for pixel:
 *
 *  - DCLogic: the base class every board's logic extends (props, state,
 *    setState, lifecycle, renderVals).
 *  - defineBoard: wraps a board's logic and template into a React component.
 *  - S: inline style strings, applied exactly like the canvas did.
 *  - T: text holes, wrapped in <span class="sc-interp"> like the canvas did.
 *  - H: links between boards ("SSettings.dc.html") go through setTalbyRoutes.
 */
import * as React from 'react';

/* ------------------------------------------------------------------ logic */

export class DCLogic {
  props: any;
  state: any = {};
  __host: any;
  constructor(props?: any) {
    this.props = props || {};
  }
  setState(update: any, cb?: () => void) {
    this.__host && this.__host.__setLogicState(update, cb);
  }
  forceUpdate() {
    this.__host && this.__host.forceUpdate();
  }
  componentDidMount() {}
  componentDidUpdate(_prevProps: any) {}
  componentWillUnmount() {}
  renderVals(): any {
    return {};
  }
}

const INTERNAL = new Set(['__hostStyle']);
function userProps(p: any) {
  const out: any = {};
  for (const k in p) if (!INTERNAL.has(k)) out[k] = p[k];
  return out;
}

export type BoardMeta = { props?: any; preview?: { width: number; height: number } | null };

/**
 * Turns a board's logic class and template into a React component.
 * The component renders <div class="sc-host" data-sc-name="Board"> around the
 * template, exactly like the canvas did, so layout is identical.
 */
export function defineBoard(name: string, Logic: any, tpl: (s: any, host: any) => React.ReactNode, css: string, meta: BoardMeta) {
  const L = Logic || DCLogic;
  class Board extends React.Component<any, { __v: number }> {
    static displayName = name;
    static boardName = name;
    static meta = meta;
    logic: any;
    constructor(props: any) {
      super(props);
      this.state = { __v: 0 };
      try {
        this.logic = new L(userProps(props));
      } catch (e) {
        console.error('[talby] ' + name + ' logic constructor failed', e);
        this.logic = new DCLogic(userProps(props));
      }
      this.logic.__host = this;
    }
    __setLogicState(update: any, cb?: () => void) {
      const prev = this.logic.state;
      const u = typeof update === 'function' ? update(prev) : update;
      this.logic.state = { ...prev, ...u };
      this.setState((d) => ({ __v: d.__v + 1 }), cb);
    }
    componentDidMount() {
      try { this.logic.componentDidMount(); } catch (e) { console.error(e); }
    }
    componentDidUpdate(prev: any) {
      this.logic.props = userProps(this.props);
      try { this.logic.componentDidUpdate(prev); } catch (e) { console.error(e); }
    }
    componentWillUnmount() {
      try { this.logic.componentWillUnmount(); } catch (e) { console.error(e); }
    }
    render() {
      const m = userProps(this.props);
      this.logic.props = m;
      let scope = m;
      try {
        scope = { ...m, ...(this.logic.renderVals() || {}) };
      } catch (e) {
        console.error('[talby] ' + name + '.renderVals() failed', e);
      }
      return React.createElement(
        'div',
        { className: 'sc-host', 'data-sc-name': name, style: this.props.__hostStyle },
        css ? React.createElement('style', { 'data-talby-board': name, dangerouslySetInnerHTML: { __html: css } }) : null,
        tpl(scope, this),
      );
    }
  }
  return Board as any;
}

/* ------------------------------------------------------------------ holes */

/** sc-for: anything that is not an array renders nothing. */
export function A(v: any): any[] {
  return Array.isArray(v) ? v : [];
}

/** Text hole: same output as the canvas runtime. */
export function T(v: any): React.ReactNode {
  if (v === undefined) return null;
  if (React.isValidElement(v) || Array.isArray(v)) return v;
  if (v === null || typeof v === 'boolean') return null;
  return React.createElement('span', { className: 'sc-interp' }, String(v));
}

/** Attribute hole inside a longer string: missing values become "". */
export function I(v: any): any {
  return v ?? '';
}

/** value and checked: undefined becomes "" or false, like the canvas. */
export function V0(v: any, d: any) {
  return v === undefined ? d : v;
}

/* ------------------------------------------------------------------ styles */

function camel(p: string) {
  if (p.startsWith('--')) return p;
  let s = p.toLowerCase();
  if (s.startsWith('-ms-')) s = s.slice(1);
  return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/** Split a CSS declaration list the way the browser does (quotes, parens, comments). */
function declarations(text: string): [string, string][] {
  const out: [string, string][] = [];
  let buf = '';
  let depth = 0;
  let i = 0;
  const n = text.length;
  const flush = () => {
    const c = buf.indexOf(':');
    if (c > 0) {
      const prop = buf.slice(0, c).trim();
      let val = buf.slice(c + 1).trim();
      val = val.replace(/\s*!\s*important\s*$/i, '');
      if (prop && val) out.push([prop, val]);
    }
    buf = '';
  };
  while (i < n) {
    const ch = text[i];
    if (ch === '/' && text[i + 1] === '*') {
      const e = text.indexOf('*/', i + 2);
      i = e < 0 ? n : e + 2;
      continue;
    }
    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < n && text[j] !== ch) j += text[j] === '\\' ? 2 : 1;
      buf += text.slice(i, j + 1);
      i = j + 1;
      continue;
    }
    if (ch === '(' || ch === '[' || ch === '{') depth++;
    else if (ch === ')' || ch === ']' || ch === '}') depth = Math.max(0, depth - 1);
    if (ch === ';' && depth === 0) {
      flush();
      i++;
      continue;
    }
    buf += ch;
    i++;
  }
  flush();
  return out;
}

const objCache = new Map<string, any>();
export function styleObject(text: string) {
  let o = objCache.get(text);
  if (!o) {
    o = {};
    for (const [p, v] of declarations(text)) o[camel(p)] = v;
    if (objCache.size > 4000) objCache.clear();
    objCache.set(text, o);
  }
  return o;
}

// The canvas also wrote the full style string to element.style.cssText after
// each commit. That keeps shorthand and longhand rules (border, border-bottom)
// in the same order as the string after updates. Same here.
function setRef(r: any, el: any) {
  if (!r) return;
  if (typeof r === 'function') r(el);
  else r.current = el;
}
const refCache = new Map<string, any>();
const userRefCache = new WeakMap<any, Map<string, any>>();
function cssRef(text: string, userRef: any) {
  const make = () => (el: any) => {
    if (!el || el.__talbyCss === text) return;
    el.__talbyCss = text;
    el.style.cssText = text.replace(/!\s*important/gi, '');
  };
  if (userRef == null || (typeof userRef !== 'function' && typeof userRef !== 'object')) {
    let f = refCache.get(text);
    if (!f) {
      if (refCache.size > 4000) refCache.clear();
      refCache.set(text, (f = make()));
    }
    return f;
  }
  let m = userRefCache.get(userRef);
  if (!m) userRefCache.set(userRef, (m = new Map()));
  let f = m.get(text);
  if (!f) {
    const base = make();
    if (m.size > 1000) m.clear();
    m.set(text, (f = (el: any) => { base(el); setRef(userRef, el); }));
  }
  return f;
}

/** style attribute: returns { style, ref } to spread onto the element. */
export function S(v: any, userRef?: any) {
  if (typeof v === 'string') return { style: styleObject(v), ref: cssRef(v, userRef) };
  const out: any = {};
  if (v != null && typeof v === 'object') out.style = v;
  if (userRef != null) out.ref = userRef;
  return out;
}

const HOST_KEYS = new Set(['position', 'left', 'right', 'top', 'bottom', 'inset', 'width', 'height', 'zIndex', 'transform']);
/** style on a <dc-import>: only position and size reach the child's host div. */
export function HS(v: any) {
  const o = typeof v === 'string' ? styleObject(v) : v != null && typeof v === 'object' ? v : null;
  if (!o) return undefined;
  const e: any = {};
  for (const k in o) if (HOST_KEYS.has(k)) e[k] = o[k];
  return Object.keys(e).length ? e : undefined;
}

/* ------------------------------------------------------------------ root */

/**
 * The boards were designed on a page with no app CSS at all: browser default
 * styles plus each board's own styles. An app with Tailwind preflight (v3 or
 * v4) and shadcn base styles changes buttons, headings, svg, borders, outlines
 * and line height. This reset puts those properties back to browser defaults
 * inside #dc-root. It uses an id so it beats preflight and base styles whether
 * they are layered (Tailwind v4) or not (v3). Board CSS is scoped under
 * #dc-root by the converter and comes after this reset, so it still wins, and
 * inline styles win over everything.
 */
export const TALBY_RESET_CSS = [
  '#dc-root{all:initial;display:block}',
  '#dc-root *,#dc-root *::before,#dc-root *::after{box-sizing:revert;margin:revert;padding:revert;border:revert;outline:revert}',
  '#dc-root :not(svg,svg *){color:revert;font:revert;font-feature-settings:revert;font-variation-settings:revert;letter-spacing:revert;word-spacing:revert;text-transform:revert;text-align:revert;text-decoration:revert;text-shadow:revert;text-indent:revert;white-space:revert;list-style:revert;background:revert;box-shadow:revert;opacity:revert;vertical-align:revert;cursor:revert;transform:revert;filter:revert;border-radius:revert;appearance:revert;resize:revert;max-width:revert}',
  '#dc-root :is(h1,h2,h3,h4,h5,h6){font-size:revert;font-weight:revert}',
  '#dc-root a{color:revert;text-decoration:revert}',
  '#dc-root :is(b,strong){font-weight:revert}',
  '#dc-root :is(code,kbd,samp,pre){font-family:revert;font-feature-settings:revert;font-variation-settings:revert;font-size:revert}',
  '#dc-root small{font-size:revert}',
  '#dc-root :is(sub,sup){font-size:revert;line-height:revert;position:revert;vertical-align:revert}',
  '#dc-root table{text-indent:revert;border-color:revert;border-collapse:revert}',
  '#dc-root :is(ol,ul,menu){list-style:revert}',
  '#dc-root :is(img,svg,video,canvas,audio,iframe,embed,object){display:revert;vertical-align:revert}',
  '#dc-root :is(img,video){max-width:revert}',
  '#dc-root :is(button,input,select,optgroup,textarea),#dc-root ::file-selector-button{font:revert;font-feature-settings:revert;font-variation-settings:revert;letter-spacing:revert;color:revert;border-radius:revert;background-color:revert;background-image:revert;opacity:revert;appearance:revert;box-shadow:revert}',
  '#dc-root ::placeholder{opacity:revert;color:revert}',
  '#dc-root textarea{resize:revert}',
  '#dc-root hr{height:revert;color:revert;border-top-width:revert}',
  '#dc-root abbr[title]{text-decoration:revert}',
  '#dc-root summary{display:revert}',
].join('');

/**
 * Wrap every board page in this. Renders <div id="dc-root"> like the canvas,
 * plus the reset above.
 */
export function TalbyRoot({ children }: { children?: React.ReactNode }) {
  return React.createElement(
    'div',
    { id: 'dc-root' },
    React.createElement('style', { 'data-talby-reset': '', dangerouslySetInnerHTML: { __html: TALBY_RESET_CSS } }),
    children,
  );
}

/* ------------------------------------------------------------------ links */

let routeFor: (board: string, rest: string) => string = (board, rest) => board + '.dc.html' + rest;

/**
 * Boards link to each other by file name ("SSettings.dc.html").
 * Call once at startup to send those links to real routes, for example:
 *   setTalbyRoutes((b) => ({ SOverview: '/dashboard', SDeals: '/deals' }[b] ?? '/dashboard'))
 */
export function setTalbyRoutes(fn: (board: string, rest: string) => string) {
  routeFor = fn;
}

/** href hole: board file names go through setTalbyRoutes. */
export function H(v: any) {
  if (typeof v !== 'string') return v;
  const m = v.match(/^(?:\.\/)?([A-Za-z0-9_]+)\.dc\.html(.*)$/);
  return m ? routeFor(m[1], m[2]) : v;
}
