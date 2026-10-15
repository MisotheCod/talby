// @ts-nocheck
/* eslint-disable */
'use client';
// SWelcome: converted from design-source/boards/SWelcome.dc.html.
// Markup, inline styles and logic are carried over exactly from the board.
// The logic class below is the board's own code, unchanged.
import * as React from 'react';
import * as $r from './_runtime';
import { DCLogic } from './_runtime';
import SSidebar from './SSidebar';
import STopbar from './STopbar';
import SPraise from './SPraise';
import SAddDeal from './SAddDeal';
import SCommand from './SCommand';
import SAppearance from './SAppearance';
import SAssistant from './SAssistant';

const CSS = "body, #dc-root{margin:0;font-synthesis:none}#dc-root .tb{transition:background-color .15s ease,color .15s ease,border-color .15s ease,box-shadow .18s ease,opacity .15s ease,transform .12s ease}#dc-root .tb:active{transform:scale(.97)}#dc-root .tg:hover{background-color:var(--hv)!important}#dc-root .tp:hover{opacity:.88}#dc-root .tr{transition:background-color .12s ease}#dc-root .tr:hover{background-color:var(--hvr)!important}#dc-root .tt:hover{color:var(--fg)!important}#dc-root .tc{transition:border-color .18s ease,box-shadow .2s ease,transform .2s ease}#dc-root .tc:hover{border-color:var(--bd2)!important;box-shadow:var(--shh)!important}#dc-root .tlift:hover{transform:translateY(-2px)}#dc-root .ti{transition:box-shadow .15s ease}#dc-root .ti:focus, #dc-root .ti:focus-within{box-shadow:0 0 0 2px var(--ring)!important}#dc-root .tb:focus-visible, #dc-root .tc:focus-visible, #dc-root .tr:focus-visible{outline:2px solid var(--ring);outline-offset:2px}#dc-root .a-in{animation:tIn .36s cubic-bezier(.2,.7,.2,1) backwards}#dc-root .a-fade{animation:tFade .2s ease backwards}#dc-root .a-pop{animation:tPop .22s cubic-bezier(.2,.8,.3,1) backwards}#dc-root .a-drop{animation:tDrop .16s cubic-bezier(.2,.8,.3,1) backwards}#dc-root .a-sheet{animation:tSheet .3s cubic-bezier(.2,.8,.2,1) backwards}#dc-root .a-drawer{animation:tDrawer .26s cubic-bezier(.2,.8,.2,1) backwards}#dc-root .a-up{animation:tUp .3s cubic-bezier(.2,.8,.2,1) backwards}#dc-root .a-toast{animation:tToast .3s cubic-bezier(.2,.9,.3,1.1) backwards}#dc-root .a-spin{animation:tSpin .8s linear infinite}#dc-root .a-pulse{animation:tPulse 1.6s ease-in-out infinite}#dc-root .a-ping{animation:tPing 2s ease-out infinite}#dc-root .a-check{animation:tCheck .38s cubic-bezier(.3,1.5,.5,1) backwards}#dc-root .a-strike{animation:tStrike .45s cubic-bezier(.4,0,.2,1) backwards}#dc-root .a-grow{animation:tGrow .6s cubic-bezier(.2,.8,.2,1) backwards;transform-origin:bottom center}#dc-root .a-width{animation:tWidth .7s cubic-bezier(.2,.8,.2,1) backwards;transform-origin:left center}#dc-root .a-out{animation:tOut .32s ease forwards}#dc-root .a-gone{animation:tOut .35s ease .55s forwards}#dc-root [style*=\"scrollbar-width: none\"]::-webkit-scrollbar{display:none}@keyframes tIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes tFade{from{opacity:0}to{opacity:1}}@keyframes tPop{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}@keyframes tDrop{from{opacity:0;transform:translateY(-4px) scale(.98)}to{opacity:1;transform:none}}@keyframes tSheet{from{opacity:0;transform:translateX(36px)}to{opacity:1;transform:none}}@keyframes tDrawer{from{transform:translateX(-100%)}to{transform:none}}@keyframes tUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}@keyframes tToast{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}@keyframes tSpin{to{transform:rotate(360deg)}}@keyframes tPulse{0%,100%{opacity:1}50%{opacity:.35}}@keyframes tPing{0%{box-shadow:0 0 0 0 rgba(239,68,68,.5)}70%,100%{box-shadow:0 0 0 6px rgba(239,68,68,0)}}@keyframes tCheck{0%{transform:scale(.6)}55%{transform:scale(1.18)}100%{transform:scale(1)}}@keyframes tStrike{from{background-size:0% 1.5px}to{background-size:100% 1.5px}}@keyframes tGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}@keyframes tWidth{from{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes tOut{from{opacity:1;transform:none}to{opacity:0;transform:translateX(16px)}}@media (prefers-reduced-motion:reduce){#dc-root *, #dc-root *::before, #dc-root *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}\n";

const Component = (() => {
class Component extends DCLogic {
  constructor(props) {
    super(props);
    var L = null; try { L = JSON.parse(window.localStorage.getItem('talby.look') || 'null'); } catch (e) {}
    L = L || {};
    var IDS = ['studio', 'sand', 'mac', 'stationery', 'editorial'], MODES = ['light', 'dark', 'system'];
    var th = (IDS.indexOf(L.theme) >= 0 && L.theme) || (L.theme === 'midnight' && IDS.indexOf(L.prev) >= 0 && L.prev) || (IDS.indexOf(props.color) >= 0 && props.color) || 'studio';
    var md = L.theme === 'midnight' ? 'dark' : ((MODES.indexOf(L.mode) >= 0 && L.mode) || (L.auto ? 'system' : (props.dark ? 'dark' : 'light')));
    var w = 1440; try { w = window.innerWidth || 1440; } catch (e) {}
    this.state = Object.assign({
      look: { theme: th, mode: md, sidebar: L.sidebar || 'expanded' },
      w: w, nav: false, appear: false, cmd: false, add: '', toasts: [], praise: null, askId: 0, askText: '', dv: props.view || 'sample'
    }, this.startState(props, true));
  }
  componentDidMount() {
    var self = this;
    this._rs = function () { try { self.setState({ w: window.innerWidth }); } catch (e) {} };
    this._sg = function (ev) { if (ev && ev.key === 'talby.look') { try { var L = JSON.parse(ev.newValue || 'null'); if (L) self.setState({ look: Object.assign({}, self.state.look, L) }); } catch (x) {} } };
    this._kd = function (e) { if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { if (e.preventDefault) e.preventDefault(); self.setState({ cmd: !self.state.cmd, nav: false }); } };
    this._mqf = function () { self.setState({ sysAt: Date.now() }); };
    try { window.addEventListener('resize', this._rs); window.addEventListener('storage', this._sg); window.addEventListener('keydown', this._kd); } catch (e) {}
    try { this._mq = window.matchMedia('(prefers-color-scheme: dark)'); if (this._mq.addEventListener) this._mq.addEventListener('change', this._mqf); else if (this._mq.addListener) this._mq.addListener(this._mqf); } catch (e) {}
    this._meas = function () { try {
      var R = function (x) { if (!x) return null; var b = x.getBoundingClientRect(); return b.width ? { l: b.left, t: b.top, w: b.width, h: b.height } : null; };
      self.setState({ gs: R(self._gsEl), ad: R(self.findEl('add')), fb: R(self.findEl('fab')), h: window.innerHeight });
    } catch (e) {} };
    this._mt = setTimeout(this._meas, 80);
    this._te = setTimeout(function () { self.tourEnsure(); }, 160);
    try { window.addEventListener('resize', this._meas); window.addEventListener('scroll', this._meas, true); } catch (e) {}
  }
  componentWillUnmount() { try { window.removeEventListener('resize', this._rs); window.removeEventListener('storage', this._sg); window.removeEventListener('keydown', this._kd); } catch (e) {} try { if (this._mq) { if (this._mq.removeEventListener) this._mq.removeEventListener('change', this._mqf); else if (this._mq.removeListener) this._mq.removeListener(this._mqf); } } catch (e) {} clearTimeout(this._pz1); clearTimeout(this._pz2); clearTimeout(this._rt); (this._tt || []).forEach(clearTimeout); clearTimeout(this._mt); clearTimeout(this._te); clearTimeout(this._ct); try { if (this._ro) this._ro.disconnect(); window.removeEventListener('resize', this._meas); window.removeEventListener('scroll', this._meas, true); } catch (e) {} }
  componentDidUpdate(prev) {
    var p = this.props, L = this.state.look, ch = null;
    if (prev.dark !== p.dark) { ch = Object.assign({}, ch || L, { mode: p.dark ? 'dark' : 'light' }); }
    if (prev.color !== p.color && p.color) { ch = Object.assign({}, ch || L, { theme: p.color }); }
    if (ch) this.setState({ look: ch });
    if (prev.view !== p.view) this.setState({ dv: p.view || 'sample' });
  }
  retryLoad() {
    var self = this; clearTimeout(this._rt);
    this.setState({ dv: 'loading' });
    this._rt = setTimeout(function () { self.setState({ dv: 'sample' }); }, 900);
  }
  guard() {
    var p = this.props;
    if (p.plan !== 'readonly' && p.plan !== 'canceled') return true;
    this.toast(p.plan === 'canceled' ? 'Your plan is canceled' : 'Your free trial ended', p.plan === 'canceled' ? 'Restart your plan to add or change deals.' : 'Upgrade to add or change deals.', null, { cta: p.plan === 'canceled' ? 'Restart plan' : 'Upgrade', act: function () { try { window.localStorage.setItem('talby.settingsTab', 'billing'); window.location.href = 'SSettings.dc.html'; } catch (e) {} } });
    return false;
  }
  setLook(key, val) {
    var D = { theme: 'studio', mode: 'light', sidebar: 'expanded' };
    var L = key === 'reset' ? Object.assign({}, D) : Object.assign({}, this.state.look, key === 'all' ? val : {});
    if (key !== 'reset' && key !== 'all') L[key] = val;
    this.setState({ look: L });
    try { window.localStorage.setItem('talby.look', JSON.stringify(L)); } catch (e) {}
  }
  toast(title, desc, undo, extra) {
    var self = this, id = Date.now() + Math.random(), x = extra || {};
    this.setState({ toasts: this.state.toasts.concat([{ id: id, title: title, desc: desc || '', undo: undo || null, kind: x.kind || '', cta: x.cta || '', act: x.act || null }]).slice(-3) });
    this._tt = this._tt || [];
    this._tt.push(setTimeout(function () { self.setState({ toasts: self.state.toasts.filter(function (x) { return x.id !== id; }) }); }, 4000));
  }
  toastErr(title, desc, retry) { this.toast(title, desc, null, { kind: 'error', cta: retry ? 'Try again' : '', act: retry || null }); }
  celebrate(pz) {
    var self = this; clearTimeout(this._pz1); clearTimeout(this._pz2);
    this.setState({ praise: null });
    this._pz1 = setTimeout(function () { self.setState({ praise: Object.assign({ id: Date.now() }, pz) }); }, 40);
    this._pz2 = setTimeout(function () { self.setState({ praise: null }); }, 5200);
  }
  startState(p, first) {
    var s = { notif: p.start === 'notify' || p.err === 'blocked' || p.err === 'offline', rem: p.err === 'blocked' ? 'blocked' : (p.err === 'offline' ? 'offline' : ''), remBlocked: p.err === 'blocked' };
    var all = p.start === 'complete', most = p.start === 'done' || all;
    s.done = { profile: true, deal: most, import: most, payby: most, ask: most, remind: all };
    var v = null;
    if (first) {
      s.handle = (function () { var h = ''; try { h = window.localStorage.getItem('talby.handle') || ''; } catch (e) {} return h || 'junobakes'; })();
      try { v = window.localStorage.getItem('talby.tour'); window.localStorage.removeItem('talby.tour'); } catch (e) {}
      s.copied = false; s.gs = null; s.ad = null; s.fb = null; s.tch = 0;
      s.h = (function () { try { return window.innerHeight || 900; } catch (e) { return 900; } })();
    }
    s.tour = (p.err && p.err !== 'none') || s.notif ? 0 : (v === '1' ? 1 : (v === '0' ? 0 : (p.start === 'tour' || !p.start ? 1 : 0)));
    return s;
  }
  markDone(key) {
    var d = Object.assign({}, this.state.done); if (d[key]) return;
    d[key] = true; this.setState({ done: d });
    var n = Object.keys(d).filter(function (x) { return d[x]; }).length;
    if (n === 6) this.celebrate({ title: 'You are all set up', line: 'Talby is ready for your next deal.', chip: '6 of 6' });
  }
  findEl(kind) {
    var el = this._gsEl, main = el && el.closest ? el.closest('main') : null; if (!main) return null;
    if (kind === 'fab') { var root = main.parentElement; return root ? root.querySelector('button[aria-label="Ask Talby Assistant"]') : null; }
    var list = main.querySelectorAll('button[aria-haspopup="menu"]');
    for (var i = 0; i < list.length; i++) { var b = list[i]; if (b.getAttribute('aria-label') === 'Add deal' || /Add deal/.test(b.textContent || '')) return b; }
    return null;
  }
  tourEnsure() {
    var st = this.state; if (!(st.tour > 0)) return;
    try {
      var W = window.innerWidth, H = window.innerHeight, mob = W < 768, keys = (mob ? [] : ['side']).concat(['gs', 'add', 'fab']), key = keys[st.tour - 1];
      var ch = st.tch || 196, cw = mob ? W - 24 : 340;
      if (key === 'gs' && this._gsEl) {
        var r = this._gsEl.getBoundingClientRect(), top = r.top - 6, hh = r.height + 12;
        var fitsBelow = top + hh + 14 + ch <= H - 12, fitsRight = r.right + 6 + 16 + cw <= W - 12;
        if (top >= 6 && (fitsBelow || fitsRight)) return;
        var maxTop = H - 12 - ch - 14 - hh, want = maxTop >= 6 ? Math.min(Math.max(top, 6), maxTop) : 6;
        if (Math.abs(top - want) > 1) window.scrollBy({ top: top - want, behavior: 'smooth' });
      } else if (key === 'add') {
        var a = this.findEl('add'); if (a) { var ra = a.getBoundingClientRect(); if (ra.top < 6) window.scrollTo({ top: 0, behavior: 'smooth' }); }
      }
    } catch (e) {}
  }
  tourGo(n) {
    var self = this; this.setState({ tour: n });
    clearTimeout(this._te); this._te = setTimeout(function () { self._meas(); self.tourEnsure(); }, 40);
  }
  renderVals() {
    var TB={id:'studio',name:'Studio',vibe:'Clean and simple',page:'#FFFFFF',card:'#FFFFFF',tile:'#F5F5F5',fill:'#F5F5F5',fillHover:'#EDEDED',hv:'#F5F5F5',hvr:'#FAFAFA',hoverCard:'#FAFAFA',fg:'#0A0A0A',mutedFg:'#737373',border:'#E5E5E5',borderStrong:'#D4D4D4',line:'#EEEEEE',off:'#E2E2E2',destr:'#DC2626',destrBg:'#DC2626',tabOn:'#FFFFFF',tabSh:'0 1px 2px rgba(0,0,0,0.08)',shCard:'0 1px 2px rgba(0,0,0,0.05)',shHover:'0 10px 28px -16px rgba(0,0,0,0.22)',shPop:'0 16px 40px -12px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.05)',overlay:'rgba(0,0,0,0.3)',badBg:'#FDECEC',badFg:'#B91C1C',okBg:'#E9F8EE',okFg:'#15803D',warnBg:'#FEF4E2',warnFg:'#B45309',postBg:'#F3EEFF',postFg:'#6D28D9',primary:'#171717',primaryFg:'#FFFFFF',side:'#FAFAFA',sideBorder:'#E5E5E5',navOn:'#EDEDED',navHv:'rgba(0,0,0,0.045)',sideFx:'none',btnSh:'none',accent:'#1F7AE0',r:10,ctl:999,bodyFam:'Geist, ui-sans-serif, system-ui, -apple-system, sans-serif',titleFam:'Inter, ui-sans-serif, system-ui, sans-serif',numFam:'',hCase:'none',hTrack:'-0.6px',hScale:1,nTrack:'-0.8px'};
    var TD={page:'#09090A',card:'#111112',tile:'#18181A',fill:'#1B1B1D',fillHover:'#242427',hv:'#1D1D20',hvr:'rgba(255,255,255,0.03)',hoverCard:'#161618',fg:'#EDEDED',mutedFg:'#8F8F94',border:'rgba(255,255,255,0.08)',borderStrong:'rgba(255,255,255,0.16)',line:'rgba(255,255,255,0.055)',off:'#2E2E31',destr:'#F87171',destrBg:'#DC2626',tabOn:'#2A2A2D',tabSh:'none',shCard:'none',shHover:'0 10px 28px -14px rgba(0,0,0,0.8)',shPop:'0 16px 40px -8px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.06)',overlay:'rgba(0,0,0,0.6)',badBg:'rgba(239,68,68,0.16)',badFg:'#FCA5A5',okBg:'rgba(34,197,94,0.14)',okFg:'#86EFAC',warnBg:'rgba(245,158,11,0.16)',warnFg:'#FCD34D',postBg:'rgba(139,92,246,0.2)',postFg:'#C4B5FD',primary:'#F5F5F5',primaryFg:'#0A0A0A',side:'#0C0C0D',sideBorder:'rgba(255,255,255,0.07)',navOn:'rgba(255,255,255,0.075)',navHv:'rgba(255,255,255,0.045)',sideFx:'none',btnSh:'none',accent:'#3D8EEA'};
    var TH={
      studio:{lt:{},dk:{btnSh:'0 0 0 1px rgba(255,255,255,0.1), 0 0 18px -2px rgba(255,255,255,0.28)'}},
      sand:{name:'Sand',vibe:'Warm and soft',r:8,hCase:'uppercase',hTrack:'0.12em',hScale:0.78,
        lt:{page:'#F5EFE8',card:'#FCF9F5',tile:'#F3ECE3',fill:'#EFE6DB',fillHover:'#E7DCCE',hv:'#EFE6DB',hvr:'#F8F3ED',hoverCard:'#F8F3ED',fg:'#3A2A21',mutedFg:'#8A7466',border:'#E8DDD0',borderStrong:'#D8C8B6',line:'#EFE7DD',off:'#E3D8CA',tabOn:'#FCF9F5',tabSh:'0 1px 2px rgba(80,50,30,0.1)',shCard:'none',shHover:'0 10px 28px -18px rgba(80,50,30,0.3)',shPop:'0 16px 40px -14px rgba(80,50,30,0.26), 0 2px 6px rgba(80,50,30,0.06)',overlay:'rgba(58,42,33,0.28)',primary:'#6E4B39',primaryFg:'#FCF9F5',side:'#F0E8DF',sideBorder:'#E8DDD0',navOn:'#E6DACC',navHv:'rgba(110,75,57,0.06)'},
        dk:{page:'#17120F',card:'#201915',tile:'#28201B',fill:'#2B231E',fillHover:'#352B25',hv:'#2D2520',hvr:'rgba(255,236,220,0.03)',hoverCard:'#251D19',fg:'#F1E7DC',mutedFg:'#A89484',border:'rgba(241,231,220,0.09)',borderStrong:'rgba(241,231,220,0.18)',line:'rgba(241,231,220,0.06)',off:'#3D332C',tabOn:'#3A3029',shPop:'0 16px 40px -8px rgba(0,0,0,0.7), 0 0 0 1px rgba(241,231,220,0.06)',primary:'#D9B89C',primaryFg:'#2A1D16',side:'#140F0D',sideBorder:'rgba(241,231,220,0.07)',navOn:'rgba(241,231,220,0.08)',navHv:'rgba(241,231,220,0.05)'}},
      mac:{name:'Mac',vibe:'Calm and crisp',r:10,ctl:7,bodyFam:"-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Geist, system-ui, sans-serif",titleFam:"-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Inter, system-ui, sans-serif",hTrack:'-0.4px',
        lt:{page:'#F0F0F3',card:'#FFFFFF',tile:'#F5F5F7',fill:'#E8E8ED',fillHover:'#DEDEE4',hv:'#EBEBF0',hvr:'#F7F7F9',hoverCard:'#F7F7F9',fg:'#1D1D1F',mutedFg:'#86868B',border:'#DEDEE3',borderStrong:'#CACACF',line:'#ECECF0',off:'#DCDCE1',tabOn:'#FFFFFF',tabSh:'0 1px 3px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.06)',shCard:'0 1px 2px rgba(0,0,0,0.04)',shHover:'0 10px 28px -16px rgba(0,0,0,0.2)',shPop:'0 18px 48px -12px rgba(0,0,0,0.25), 0 0 0 0.5px rgba(0,0,0,0.08)',primary:'#3A3A3C',primaryFg:'#FFFFFF',side:'rgba(226,226,231,0.78)',sideBorder:'#DADADF',navOn:'rgba(0,0,0,0.075)',navHv:'rgba(0,0,0,0.045)',sideFx:'saturate(180%) blur(20px)',btnSh:'0 1px 1px rgba(0,0,0,0.12)'},
        dk:{page:'#1C1C1E',card:'#2C2C2E',tile:'#323234',fill:'#3A3A3C',fillHover:'#444446',hv:'#3A3A3C',hvr:'rgba(255,255,255,0.03)',hoverCard:'#313133',fg:'#F5F5F7',mutedFg:'#98989D',border:'rgba(255,255,255,0.1)',borderStrong:'rgba(255,255,255,0.18)',line:'rgba(255,255,255,0.07)',off:'#48484A',tabOn:'#636366',shPop:'0 18px 48px -12px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.1)',primary:'#D1D1D6',primaryFg:'#1C1C1E',side:'rgba(40,40,43,0.82)',sideBorder:'rgba(255,255,255,0.08)',navOn:'rgba(255,255,255,0.1)',navHv:'rgba(255,255,255,0.05)',sideFx:'saturate(180%) blur(20px)',btnSh:'0 1px 1px rgba(0,0,0,0.3)'}},
      stationery:{name:'Stationery',vibe:'Paper and ink',r:4,ctl:6,titleFam:'Fraunces, Georgia, serif',numFam:"'DM Mono', ui-monospace, monospace",hTrack:'-0.4px',nTrack:'-0.5px',
        lt:{page:'#F6F1E6',card:'#FCF9F2',tile:'#F2ECDF',fill:'#EFE8D9',fillHover:'#E7DECB',hv:'#EFE8D9',hvr:'#F8F4EB',hoverCard:'#F8F4EB',fg:'#2E2A24',mutedFg:'#857B6B',border:'#DED4C1',borderStrong:'#CBBFA8',line:'#E9E1D1',off:'#DDD3C1',tabOn:'#FCF9F2',tabSh:'0 1px 0 rgba(46,42,36,0.14)',shCard:'none',shHover:'0 2px 0 #DED4C1',shPop:'0 14px 36px -14px rgba(46,42,36,0.28), 0 1px 0 rgba(46,42,36,0.08)',overlay:'rgba(46,42,36,0.25)',primary:'#2E2A24',primaryFg:'#FCF9F2',side:'#F1EBDE',sideBorder:'#DED4C1',navOn:'#E7DECC',navHv:'rgba(46,42,36,0.05)'},
        dk:{page:'#1B1916',card:'#23211D',tile:'#2A2723',fill:'#2D2A25',fillHover:'#37332D',hv:'#2F2C27',hvr:'rgba(238,231,217,0.03)',hoverCard:'#28251F',fg:'#EEE7D9',mutedFg:'#A39A8A',border:'rgba(238,231,217,0.1)',borderStrong:'rgba(238,231,217,0.2)',line:'rgba(238,231,217,0.07)',off:'#3E3A33',tabOn:'#3A362F',shHover:'0 2px 0 rgba(238,231,217,0.12)',shPop:'0 14px 36px -10px rgba(0,0,0,0.7), 0 0 0 1px rgba(238,231,217,0.07)',primary:'#EEE7D9',primaryFg:'#1B1916',side:'#181613',sideBorder:'rgba(238,231,217,0.08)',navOn:'rgba(238,231,217,0.08)',navHv:'rgba(238,231,217,0.05)'}},
      editorial:{name:'Editorial',vibe:'Sharp and bold',r:0,ctl:0,titleFam:"'Playfair Display', Georgia, serif",hTrack:'0px',hScale:1.12,nTrack:'0px',
        lt:{page:'#FFFFFF',card:'#FFFFFF',tile:'#F4F4F2',fill:'#F2F2EF',fillHover:'#E7E7E3',hv:'#F2F2EF',hvr:'#FAFAF8',hoverCard:'#FAFAF8',fg:'#111111',mutedFg:'#6B6B6B',border:'#111111',borderStrong:'#111111',line:'#E3E3DF',off:'#DCDCD8',tabOn:'#FFFFFF',tabSh:'inset 0 0 0 1px #111111',shCard:'none',shHover:'none',shPop:'0 12px 32px -12px rgba(0,0,0,0.22)',primary:'#111111',primaryFg:'#FFFFFF',side:'#FFFFFF',sideBorder:'#111111',navOn:'#EFEFEB',navHv:'rgba(0,0,0,0.04)'},
        dk:{page:'#0B0B0B',card:'#121212',tile:'#191919',fill:'#1B1B1B',fillHover:'#252525',hv:'#1C1C1C',hvr:'rgba(255,255,255,0.03)',hoverCard:'#171717',fg:'#F2F2F2',mutedFg:'#9A9A9A',border:'rgba(255,255,255,0.12)',borderStrong:'rgba(255,255,255,0.28)',line:'rgba(255,255,255,0.07)',off:'#333333',tabOn:'#262626',tabSh:'none',shHover:'none',shPop:'0 12px 32px -8px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)',primary:'#F2F2F2',primaryFg:'#0B0B0B',side:'#0B0B0B',sideBorder:'rgba(255,255,255,0.1)',navOn:'rgba(255,255,255,0.08)',navHv:'rgba(255,255,255,0.04)'}}
    };
    function rgb(h){h=h.replace('#','');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
    function mix(a,b,w){var x=rgb(a),y=rgb(b);return '#'+[0,1,2].map(function(i){return ('0'+Math.round(x[i]*w+y[i]*(1-w)).toString(16)).slice(-2);}).join('');}
    function alpha(h,a){var x=rgb(h);return 'rgba('+x[0]+','+x[1]+','+x[2]+','+a+')';}
    function talby(name,dark){
      var id=TH[name]?name:'studio',x=TH[id],t={},q,c;dark=!!dark;
      for(q in TB)t[q]=TB[q];
      if(dark)for(q in TD)t[q]=TD[q];
      for(q in x)if(q!=='lt'&&q!=='dk')t[q]=x[q];
      c=dark?x.dk:x.lt;for(q in c)t[q]=c[q];
      var r=t.r;t.id=id;t.dark=dark;
      if(id!=='studio')t.accent=c.accent||t.primary;
      t.ring=alpha(t.accent,dark?0.45:0.35);
      t.soft=mix(t.primary,t.card,dark?0.16:0.1);t.softFg=dark?mix(t.primary,'#FFFFFF',0.8):t.primary;
      t.rCard=(r?r+4:0)+'px';t.rTile=(r?r+2:0)+'px';t.rDialog=(r?r+8:0)+'px';t.rCtl=t.ctl+'px';t.rSm=r+'px';t.rIn=r+'px';
      t.rItem=(r?Math.max(6,r-2):0)+'px';t.rBox=(r?4:0)+'px';t.rEv=(r?Math.min(r,6):0)+'px';t.rBar=Math.min(r,4)+'px';t.rPill=t.ctl>=999?'999px':t.rSm;
      t.numFam=t.numFam||t.titleFam;
      return t;
    }
    function theme(color,dark){return talby(color,dark);}
    function kit(t){
      var b='display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 32px; padding: 0 14px; box-sizing: border-box; font: inherit; font-size: 14px; font-weight: 500; line-height: 1; white-space: nowrap; border-radius: '+t.rCtl+'; cursor: pointer; text-decoration: none; flex-shrink: 0';
      var P=b+'; border: none; background: '+t.primary+'; color: '+t.primaryFg+'; box-shadow: '+t.btnSh, S=b+'; border: none; background: '+t.fill+'; color: '+t.fg+'; --hv: '+t.fillHover, O=b+'; border: 1px solid '+t.border+'; background: '+t.card+'; color: '+t.fg+'; --hv: '+t.hoverCard, G=b+'; border: none; background: transparent; color: '+t.fg, D=b+'; border: none; background: '+t.destrBg+'; color: #FFFFFF';
      var sm='; height: 28px; padding: 0 12px; font-size: 13px', i32='; width: 32px; height: 32px; padding: 0', i28='; width: 28px; height: 28px; padding: 0';
      var inp='height: 36px; width: 100%; min-width: 0; box-sizing: border-box; padding: 0 14px; border: none; border-radius: '+t.rCtl+'; background: '+t.fill+'; color: '+t.fg+'; font: inherit; font-size: 14px; outline: none';
      var row='position: relative; display: flex; align-items: center; gap: 12px; min-height: 52px; padding: 8px 10px 8px 14px; box-sizing: border-box';
      var selx='; display: flex; align-items: center; justify-content: space-between; gap: 8px; text-align: left; cursor: pointer; --hv: '+t.fillHover;
      return {
        btnP:P, btnS:S, btnO:O, btnG:G, btnD:D, pSm:P+sm, sSm:S+sm, oSm:O+sm, gSm:G+sm, pBlk:P+'; width: 100%; height: 38px', oBlk:O+'; width: 100%; height: 38px',
        ico:G+i32, icoG:G+i28, icoS:G+i28+'; color: '+t.mutedFg, icoO:O+i32, icoP:P+i32, icoSec:S+i32,
        input:inp, area:'width: 100%; min-width: 0; box-sizing: border-box; padding: 12px 14px; border: none; border-radius: '+t.rTile+'; background: '+t.fill+'; color: '+t.fg+'; font: inherit; font-size: 14px; line-height: 1.5; outline: none; resize: vertical',
        ctl:inp+'; flex: 0 1 220px; width: auto', sel:inp+'; flex: 0 1 220px; width: auto'+selx, ctlW:inp+'; flex: 0 1 300px; width: auto', selW:inp+'; flex: 0 1 300px; width: auto'+selx, ctlF:inp+'; flex: 1 1 auto; width: auto', selF:inp+'; width: 100%'+selx,
        row:row, rowT:row+'; border-top: 1px solid '+t.line, rowCol:'display: flex; flex-direction: column; align-items: stretch; gap: 10px; padding: 12px 14px; box-sizing: border-box; border-top: 1px solid '+t.line,
        rowLabel:'flex: 1 1 auto; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis',
        group:'position: relative; background: '+t.card+'; border: 1px solid '+t.border+'; border-radius: '+t.rTile, secLabel:'padding: 0 4px; font-size: 14px; font-weight: 600',
        card:'background: '+t.card+'; color: '+t.fg+'; border: 1px solid '+t.border+'; border-radius: '+t.rCard+'; box-shadow: '+t.shCard, tile:'background: '+t.tile+'; border-radius: '+t.rTile,
        payBadge:'display: inline-flex; align-items: center; gap: 6px; height: 24px; padding: 0 9px 0 6px; box-sizing: border-box; border: 1px solid '+t.border+'; border-radius: '+t.rCtl+'; background: '+t.card+'; font-size: 12px; font-weight: 500; white-space: nowrap; flex-shrink: 0',
        badge:'display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: 0 8px; box-sizing: border-box; border: 1px solid '+t.border+'; border-radius: '+t.rCtl+'; background: '+t.card+'; font-size: 12px; font-weight: 500; white-space: nowrap; flex-shrink: 0',
        pop:'background: '+t.card+'; color: '+t.fg+'; border: 1px solid '+t.border+'; border-radius: '+t.rTile+'; box-shadow: '+t.shPop+'; padding: 6px; box-sizing: border-box',
        item:'display: flex; align-items: center; gap: 10px; width: 100%; min-height: 34px; padding: 0 10px; box-sizing: border-box; border: none; border-radius: '+t.rItem+'; background: transparent; color: '+t.fg+'; font: inherit; font-size: 14px; text-align: left; cursor: pointer; text-decoration: none; --hv: '+t.hv,
        tabs:'display: inline-flex; align-items: center; gap: 2px; height: 36px; padding: 3px; box-sizing: border-box; border-radius: '+t.rCtl+'; background: '+t.fill,
        caps:'font-size: 12px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: '+t.mutedFg,
        kbd:'display: inline-flex; align-items: center; height: 22px; padding: 0 7px; border-radius: '+t.rCtl+'; background: '+t.fill+'; color: '+t.mutedFg+'; font-size: 11px; font-weight: 500'
      };
    }
    function tabStyle(t,on){return 'display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 100%; padding: 0 12px; box-sizing: border-box; border: none; border-radius: '+t.rCtl+'; background: '+(on?t.tabOn:'transparent')+'; color: '+(on?t.fg:t.mutedFg)+'; box-shadow: '+(on?t.tabSh:'none')+'; font: inherit; font-size: 13px; font-weight: 500; white-space: nowrap; flex-shrink: 0; cursor: pointer';}
    function box(t,on){return 'width: 16px; height: 16px; flex: 0 0 16px; padding: 0; box-sizing: border-box; border: none; border-radius: '+t.rBox+'; background: '+(on?t.primary:t.off)+'; color: '+t.primaryFg+'; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: background-color 0.15s ease';}
    function chip(t,on){return 'height: 32px; padding: 0 14px; box-sizing: border-box; border: none; border-radius: '+t.rCtl+'; background: '+(on?t.primary:t.fill)+'; color: '+(on?t.primaryFg:t.fg)+'; font: inherit; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer; --hv: '+(on?t.primary:t.fillHover);}
    var MS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    function md(iso) { return iso ? MS[+iso.slice(5, 7) - 1] + ' ' + (+iso.slice(8, 10)) : ''; }
    function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
    var self = this, p = this.props, st = this.state;
    var L = st.look, sysDark = false; try { sysDark = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches); } catch (e) {}
    var dark = L.mode === 'dark' || (L.mode === 'system' && sysDark);
    var eff = L.theme || 'studio';
    var t = theme(eff, dark), k = kit(t);
    var mob = st.w < 768, tabW = !mob && st.w < 1024, wide = st.w >= 1100, collapsed = L.sidebar === 'icons' || tabW;
    var V = st.dv || 'sample', isSample = V === 'sample', isEmpty = V === 'empty', isLoading = V === 'loading', isError = V === 'error';
    var plan = p.plan || 'active', locked = plan === 'readonly' || plan === 'canceled';
    function payIcon(key) {
      var G = '#22C55E', A = '#F59E0B', Rd = '#EF4444';
      if (key === 'paid') return { label: 'Paid', fill: G, stroke: G, dash: 'none', inner: 'm8.5 12 2.5 2.5 4.5-5', innerStroke: '#FFFFFF', fg: t.fg };
      if (key === 'inv') return { label: 'Invoiced', fill: 'none', stroke: A, dash: 'none', inner: 'M12 7.5v4.5l3 2', innerStroke: A, fg: t.fg };
      if (key === 'over') return { label: 'Overdue', fill: Rd, stroke: Rd, dash: 'none', inner: 'M12 7.5v5M12 16.3v.2', innerStroke: '#FFFFFF', fg: t.destr };
      return { label: 'Not invoiced', fill: 'none', stroke: t.mutedFg, dash: '3 2.6', inner: '', innerStroke: 'none', fg: t.mutedFg };
    }
    // Shared empty and error blocks. kind is 'empty' or 'error'. Render with state_html('name') in the markup.
    function blk(kind, icon, title, sub, cta, act, cta2, act2) {
      return { icon: icon, title: title, sub: sub || '', hasSub: !!sub, cta: cta || '', act: act || function () {}, hasCta: !!cta, cta2: cta2 || '', act2: act2 || function () {}, has2: !!cta2,
        tileBg: kind === 'error' ? t.badBg : t.tile, tileFg: kind === 'error' ? t.badFg : t.fg };
    }
    // Skeleton bar for loading states. Use with class a-pulse.
    function sk(w, h, r) { return 'display: block; flex-shrink: 0; width: ' + w + '; height: ' + h + '; border-radius: ' + (r || t.rSm) + '; background: ' + t.fill; }
    var IC = {
      alert: 'M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
      warn: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3zM12 9v4M12 17h.01',
      lock: 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4',
      wifi: 'M12 20h.01M8.5 16.43a5 5 0 0 1 7 0M2 8.82a15 15 0 0 1 20 0M5 12.86a10 10 0 0 1 14 0',
      refresh: 'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M8 16H3v5',
      card: 'M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM2 10h20',
      clock: 'M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z'
    };

    var pk = (p.start || '') + '|' + (p.err || '');
    if (self._pk === undefined) self._pk = pk;
    else if (self._pk !== pk) { self._pk = pk; setTimeout(function () { self.setState(self.startState(self.props, false)); }, 0); }
    var D = st.done, handle = st.handle, blocked = !!st.remBlocked;
    function openRem() { self.setState({ notif: true, rem: self.state.remBlocked ? 'blocked' : '' }); }
    var ITEMS = [
      ['profile', 'Set up your profile', 'Your name, photo and theme.', '', null, false],
      ['deal', 'Add your first deal', 'Type it in, upload a contract or CSV, or import from Notion.', 'Add deal', function () { self.setState({ add: 'new' }); }, false],
      ['import', 'Bring in your other deals', 'Upload a CSV or import them from Notion.', 'Import', function () { self.setState({ add: 'upload' }); }, false],
      ['payby', 'Give a deal a pay by date', 'Talby reminds you before money is due.', 'Open deals', function () { self.markDone('payby'); }, true],
      ['ask', 'Ask Talby a question', 'Try asking how to add your first deal.', 'Ask Talby', function () { self.markDone('ask'); self.setState({ askId: Date.now(), askText: 'How do I add my first deal?' }); }, false],
      ['remind', 'Turn on reminders', blocked ? 'Blocked in your browser. Allow notifications for Talby in site settings.' : 'A heads up before posts and when money is due.', blocked ? 'How to fix' : 'Turn on', openRem, false]
    ];
    var doneN = ITEMS.filter(function (x) { return D[x[0]]; }).length, nextKey = '';
    ITEMS.forEach(function (x) { if (!nextKey && !D[x[0]]) nextKey = x[0]; });
    var items = ITEMS.map(function (x, i) {
      var on = !!D[x[0]], isNext = x[0] === nextKey;
      return { title: x[1], sub: x[2], cta: x[3], act: x[4] || function () {}, done: on, showBtn: !on && !!x[3] && !x[5], showLink: !on && x[5],
        btn: isNext ? k.pSm : k.oSm, cls: isNext ? 'tb tp' : 'tb tg', hv: isNext ? t.primary : t.hoverCard, line: i ? '1px solid ' + t.line : 'none', fg: on ? t.mutedFg : t.fg, deco: on ? 'line-through' : 'none',
        subFg: x[0] === 'remind' && blocked && !on ? t.destr : t.mutedFg, ringB: on ? 'none' : ('1.5px solid ' + t.borderStrong), ckBg: on ? t.primary : 'transparent' };
    });
    var help = [
      ['Replay the tour', 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM10 8l6 4-6 4z', function () { self.setState({ notif: false }); self.tourGo(1); }],
      ['Ask Talby how something works', 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', function () { self.markDone('ask'); self.setState({ askId: Date.now(), askText: 'How do I add my first deal?' }); }],
      ['Change your theme', 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 2v20', function () { self.setState({ appear: true }); }]
    ].map(function (h) { return { label: h[0], icon: h[1], act: h[2] }; });
    var MONEY = [['Booked', 'From deals you add'], ['Received', 'When brands pay you'], ['Still owed', 'Money on its way'], ['Late', 'Past the pay by date']];
    // Layout: two columns when the side card gets at least about 300px, else one column; on a tablet the ways card splits inside.
    var W = st.w, H = st.h || 900, sb = collapsed ? 72 : 256, edge = mob ? 12 : 24;
    var mainW = W - (mob ? 0 : sb) - (mob ? 24 : (tabW ? 32 : 40)), two = !mob && mainW >= 916, split = !mob && !two;
    // Tour. Targets are measured (Getting started card, Add deal button, Ask Talby button), each grown a little, with the board radii.
    var g = st.gs, rr = parseInt(t.rCard, 10) || 0, ch = st.tch || 196, cw = mob ? W - 24 : 340;
    function grow(r, n, rad) { return { l: r.l - n, t: r.t - n, w: r.w + 2 * n, h: r.h + 2 * n, r: rad }; }
    var steps = [];
    if (!mob) steps.push({ title: 'This is your command center', text: 'Deals, calendar, payments, ideas and to-dos. Everything is one click away.', rect: { l: 8, t: 8, w: sb - 16, h: H - 16, r: 14 }, card: { l: sb + 20, t: 96 } });
    var gsRect = g ? grow(g, 6, rr + 6) : { l: (mob ? 0 : sb) + 16, t: 140, w: Math.min(760, W - 40), h: 440, r: rr + 6 };
    var below = gsRect.t + gsRect.h + 14, gsCard;
    if (below + ch <= H - 12) gsCard = { l: gsRect.l + 6, t: below };
    else if (gsRect.l + gsRect.w + 16 + cw <= W - 12) gsCard = { l: gsRect.l + gsRect.w + 16, t: gsRect.t + 40 };
    else if (gsRect.t - 14 - ch >= 12) gsCard = { l: gsRect.l + 6, t: gsRect.t - 14 - ch };
    else {
      // Taller than the screen allows: light up the top of the list down to just above the card, so the card never covers it.
      var room = H - 12 - ch - 14 - Math.max(6, gsRect.t);
      if (room >= 120) { gsRect = { l: gsRect.l, t: Math.max(6, gsRect.t), w: gsRect.w, h: room, r: gsRect.r }; gsCard = { l: gsRect.l + 6, t: gsRect.t + room + 14 }; }
      else gsCard = { l: gsRect.l + 6, t: H - ch - 12 };
    }
    steps.push({ title: 'Start here', text: 'Work down this list and you will be set up in a few minutes. It goes away once you are done.', rect: gsRect, card: gsCard });
    var adRect = st.ad ? grow(st.ad, 6, mob ? 22 : 12) : (mob ? { l: W - edge - 38, t: 8, w: 40, h: 40, r: 20 } : { l: W - edge - 147, t: 6, w: 153, h: 44, r: 12 });
    steps.push({ title: 'Add a deal from any page', text: 'Type it in, upload a contract or CSV, or import from Notion. It is always up here.', rect: adRect, card: { l: adRect.l + adRect.w - 6 - cw, t: adRect.t + adRect.h + 12 } });
    var fbRect = st.fb ? grow(st.fb, 4, 26) : (mob ? { l: W - 16 - 50, t: H - 16 - 50, w: 52, h: 52, r: 26 } : { l: W - edge - 128, t: H - edge - 48, w: 132, h: 52, r: 26 });
    steps.push({ title: 'Ask Talby anything', text: 'Questions about your deals, dates or money. Talby answers from your own paperwork.', rect: fbRect, card: { l: fbRect.l + fbRect.w - 4 - cw, t: fbRect.t - 16 - ch } });
    var n = steps.length, ready = !isLoading && !isError, on = ready && st.tour > 0 && st.tour <= n, cur = on ? steps[st.tour - 1] : steps[0];
    function px(v) { return Math.round(v) + 'px'; }
    var cl = Math.max(12, Math.min(W - cw - 12, cur.card.l)), ct = Math.max(12, Math.min(H - ch - 12, cur.card.t));
    function finishTour() { self.setState({ tour: 0, notif: !D.remind, rem: self.state.remBlocked ? 'blocked' : '' }); }
    if (!self._gsRefFn) self._gsRefFn = function (el) {
      if (el) { var fresh = self._gsLast && el !== self._gsLast; self._gsLast = el; if (fresh && self._meas) setTimeout(self._meas, 60); }
      self._gsEl = el;
    };
    if (!self._tcRefFn) self._tcRefFn = function (el) {
      if (!el || el === self._tcEl) return;
      try { if (self._ro) self._ro.disconnect(); } catch (e) {}
      self._tcEl = el; self._ro = null;
      if (typeof ResizeObserver !== 'undefined') {
        self._ro = new ResizeObserver(function () { var h2 = Math.round(el.offsetHeight); if (h2 && h2 !== self.state.tch) self.setState({ tch: h2 }); });
        self._ro.observe(el);
      }
    };
    // Reminders card: ask, blocked in the browser, or could not save.
    var BELL = 'M10.27 21a2 2 0 0 0 3.46 0M3.26 15.33A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.67C19.41 13.96 18 12.5 18 8A6 6 0 0 0 6 8c0 4.5-1.41 5.96-2.74 7.33';
    var BELLOFF = 'M10.27 21a2 2 0 0 0 3.46 0M17 17H4a1 1 0 0 1-.74-1.67C4.59 13.96 6 12.5 6 8a6 6 0 0 1 .26-1.76M8.67 3.03A6 6 0 0 1 18 8c0 2.76.53 4.47 1.24 5.62M2 2l20 20';
    var rem = st.rem || '';
    var stepsTxt = mob ? ['Open the site settings in your browser', 'Set Notifications to Allow', 'Come back here and tap Try again'] : ['Click the icon next to the web address', 'Set Notifications to Allow', 'Come back here and click Try again'];
    var nt = rem === 'blocked'
      ? { title: 'Notifications are blocked', text: 'Your browser is set to block Talby. To get reminders:', hasSteps: true, steps: stepsTxt.map(function (x, i) { return { n: String(i + 1), text: x }; }), hasErr: false, cta: 'Try again', icon: BELLOFF, iconCls: '', tileBg: t.badBg, tileFg: t.badFg }
      : { title: 'Want a heads up?', text: 'Talby can remind you the day before a post goes live and when a payment is due.', hasSteps: false, steps: [], hasErr: rem === 'offline', cta: rem === 'offline' ? 'Try again' : 'Turn on reminders', icon: BELL, iconCls: 'a-pulse', tileBg: t.soft, tileFg: t.softFg };
    function remOn() { self.setState({ notif: false, rem: '', remBlocked: false }); self.markDone('remind'); self.toast('Reminders are on', 'You can change them in Settings.'); }
    var skS = function (w, h, r) { return sk(w, h, r); };
    var page = {
      okIn: dark ? t.page : t.okBg, minH: '1000px', handle: handle, asstName: handle, sbFresh: true, quietBell: true, cols: two ? 'minmax(0, 2fr) minmax(0, 1fr)' : 'minmax(0, 1fr)', moneyCols: mob ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))',
      wSubSt: mob ? 'margin: 0; color: ' + t.mutedFg + '; line-height: 1.45; text-wrap: pretty' : 'margin: 0; color: ' + t.mutedFg + '; white-space: nowrap; overflow: hidden; text-overflow: ellipsis',
      gsSubSt: mob ? 'line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden' : 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis',
      wyBodySt: split ? 'display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px 28px; align-items: start' : 'display: contents',
      wyDivSt: split ? 'display: none' : 'height: 1px; background: ' + t.line, wyHelpSt: split ? 'display: flex; flex-direction: column; gap: 16px; min-width: 0' : 'display: contents',
      gsRef: self._gsRefFn,
      showMain: !isError, showErr: isError, notLoading: !isLoading, busyAttr: isLoading ? 'true' : 'false',
      errBlk: blk('error', IC.wifi, 'We could not load your setup list', 'Check your connection and try again. Nothing was lost.', 'Try again', function () { self.retryLoad(); }),
      skCount: skS('72px', '14px'), skDot: skS('22px', '22px', '11px'), skBtn: skS('76px', '28px', t.rCtl), skMoney: skS('64px', '24px') + '; margin: 2px 0',
      skRows: [0, 1, 2, 3, 4, 5].map(function (i) { return { line: i ? '1px solid ' + t.line : 'none', t: skS(['46%', '38%', '52%', '42%', '34%', '40%'][i], '12px'), s: skS(['70%', '62%', '58%', '66%', '54%', '60%'][i], '10px') }; }),
      doneN: isLoading ? '0' : String(doneN), pct: isLoading ? '0%' : Math.round(doneN / 6 * 100) + '%', allDone: !isLoading && doneN === 6, items: items, help: help,
      ways: [['Add one by hand', 'A brand and an amount is enough', 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z', 'new'], ['Upload a contract or CSV', 'Talby reads it and fills it in', 'M12 15V3M7 8l5-5 5 5M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4', 'upload'], ['Import from Notion', 'Bring over the deals you track', 'M5 4h10l4 4v12H5zM9 9v7M9 9l6 7V9', 'notion']].map(function (w, i) { return { title: w[0], sub: w[1], icon: w[2], line: i ? '1px solid ' + t.line : 'none', radius: i === 0 ? (t.rTile + ' ' + t.rTile + ' 0 0') : (i === 2 ? ('0 0 ' + t.rTile + ' ' + t.rTile) : '0'), tileBg: i === 0 ? t.primary : t.tile, tileFg: i === 0 ? t.primaryFg : t.fg, act: function () { self.setState({ add: w[3] }); } }; }),
      money: MONEY.map(function (m, i) { return { label: m[0], sub: m[1], value: '$0', fg: t.mutedFg, line: (mob ? i % 2 : i) ? '1px solid ' + t.line : 'none', top: mob && i > 1 ? '1px solid ' + t.line : 'none' }; }),
      tourOn: on, tourN: String(n), tourNo: String(Math.max(1, st.tour)), cur: { title: cur.title, text: cur.text },
      sp: { l: px(cur.rect.l), t: px(cur.rect.t), w: px(cur.rect.w), h: px(cur.rect.h), r: px(cur.rect.r) }, tc: { l: px(cl), t: px(ct) }, tcW: px(cw), tcRef: self._tcRefFn,
      tourDots: steps.map(function (s2, i) { var a = i === st.tour - 1; return { w: a ? '16px' : '6px', bg: a ? t.primary : t.off }; }),
      tourHasBack: st.tour > 1, tourNextLabel: st.tour >= n ? 'Done' : 'Next',
      tourNext: function () { if (st.tour >= n) finishTour(); else self.tourGo(st.tour + 1); },
      tourBack: function () { self.tourGo(Math.max(1, st.tour - 1)); }, tourSkip: finishTour,
      notifOn: ready && st.notif && !on, ntL: mob ? '12px' : (sb + 24) + 'px', ntR: mob ? '12px' : 'auto', ntB: mob ? '84px' : '24px', ntW: mob ? 'auto' : '400px', nt: nt,
      turnOn: function () {
        if (rem === 'blocked' || rem === 'offline') { remOn(); return; }
        if (p.err === 'blocked') { self.setState({ rem: 'blocked', remBlocked: true }); return; }
        if (p.err === 'offline') { self.setState({ rem: 'offline' }); return; }
        remOn();
      },
      notNow: function () { self.setState({ notif: false }); }
    };
    var shell = {
      t: t, k: k, dark: dark, look: L, collapsed: collapsed, mob: mob, notMob: !mob, wide: wide, eff: eff, titleFam: t.titleFam, numFam: t.numFam,
      vars: '--hv: ' + t.hv + '; --hvr: ' + t.hvr + '; --bd2: ' + t.borderStrong + '; --fg: ' + t.fg + '; --ring: ' + t.ring + '; --shh: ' + t.shHover,
      showRail: !mob, sbW: collapsed ? '72px' : '256px', mainPad: mob ? '0 12px 104px' : (tabW ? '0 20px 48px 12px' : '0 24px 56px 16px'), h1Fs: Math.round((mob ? 24 : 28) * t.hScale) + 'px',
      toggleNav: function () { if (mob || tabW) self.setState({ nav: true }); else self.setLook('sidebar', collapsed ? 'expanded' : 'icons'); },
      drawerOpen: (mob || tabW) && st.nav, closeNav: function () { self.setState({ nav: false }); },
      appear: st.appear, openAppear: function () { self.setState({ appear: true, nav: false }); }, closeAppear: function () { self.setState({ appear: false }); },
      setLook: function (k2, v2) { self.setLook(k2, v2); },
      cmd: st.cmd, openCmd: function () { self.setState({ cmd: true, nav: false }); }, closeCmd: function () { self.setState({ cmd: false }); },
      cmdAction: function (a, payload) {
        if (a === 'mode') self.setLook('mode', dark ? 'light' : 'dark');
        else if (a === 'appearance') self.setState({ appear: true, cmd: false });
        else if (a === 'new' || a === 'upload' || a === 'notion') self.setState({ add: a, cmd: false });
        else if (a === 'ask') self.setState({ askId: Date.now(), askText: payload || '', cmd: false });
      },
      add: st.add, openAdd: function (kind) { self.setState({ add: kind, nav: false }); }, closeAdd: function () { self.setState({ add: '' }); },
      onCreated: function (info) { self.setState({ add: '' }); self.celebrate(info || {}); var dn = Object.assign({}, self.state.done, { deal: true }); if (info && info.kind === 'import') dn.import = true; self.setState({ done: dn }); if (Object.keys(dn).filter(function (x) { return dn[x]; }).length === 6 && Object.keys(self.state.done).filter(function (x) { return self.state.done[x]; }).length < 6) setTimeout(function () { self.celebrate({ title: 'You are all set up', line: 'Talby is ready for your next deal.', chip: '6 of 6' }); }, 5400); },
      praise: st.praise, closePraise: function () { clearTimeout(self._pz2); self.setState({ praise: null }); },
      askId: st.askId, askText: st.askText, asstName: 'Chanelica',
      toastR: mob ? '12px' : '24px', toastL: mob ? '12px' : 'auto', toastB: mob ? 'auto' : '84px', toastT: mob ? '12px' : 'auto', toastW: mob ? 'auto' : '340px',
      toasts: st.toasts.map(function (x) { var drop = function () { self.setState({ toasts: self.state.toasts.filter(function (y) { return y.id !== x.id; }) }); };
        return { title: x.title, desc: x.desc, hasDesc: !!x.desc, hasUndo: !!x.undo, undo: function () { if (x.undo) x.undo(); drop(); }, isErr: x.kind === 'error', hasCta: !!x.cta, cta: x.cta, doCta: function () { drop(); if (x.act) x.act(); } }; }),
      stH: mob ? '36px' : '28px', dataView: V, isSample: isSample, isEmpty: isEmpty, isLoading: isLoading, isError: isError, notSample: !isSample, retry: function () { self.retryLoad(); }, isTab: tabW,
      plan: plan, locked: locked, lockedKind: locked ? plan : '', quietBell: !isSample, sbFresh: !isSample,
      hasBanner: plan === 'pastdue' || locked, bn: (function () {
        var go = function () { try { window.localStorage.setItem('talby.settingsTab', 'billing'); window.location.href = 'SSettings.dc.html'; } catch (e) {} };
        if (plan === 'pastdue') return { bg: t.warnBg, fg: t.warnFg, bd: 'transparent', subFg: t.warnFg, icon: IC.warn, title: mob ? 'Payment failed.' : 'Your last payment did not go through.', text: mob ? 'Update your card by Oct 21.' : 'Update your card by Oct 21 to keep adding and changing deals.', cta: 'Update card', act: go };
        if (plan === 'canceled') return { bg: t.tile, fg: t.fg, bd: t.border, subFg: t.mutedFg, icon: IC.lock, title: mob ? 'Plan canceled.' : 'Your plan is canceled.', text: mob ? 'Your deals are safe.' : 'Everything you added is safe. Restart your plan to add or change deals.', cta: 'Restart plan', act: go };
        return { bg: t.tile, fg: t.fg, bd: t.border, subFg: t.mutedFg, icon: IC.lock, title: mob ? 'Trial ended.' : 'Your free trial ended.', text: mob ? 'Your deals are safe.' : 'Everything you added is safe. Upgrade to add or change deals.', cta: 'Upgrade', act: go };
      })()
    };
    var out = Object.assign(shell, page);
    out.chatHidden = st.appear || st.nav || st.cmd || !!st.add || !!(false);
    return out;
  }
}
return Component;
})();

function render($s0, host) {
  const { A, T, I, V0, S, HS, H } = $r;
  return (<>
      <div {...S(`position: relative; box-sizing: border-box; min-height: ${I($s0?.minH)}; display: flex; align-items: stretch; background: ${I($s0?.t?.page)}; font-family: ${I($s0?.t?.bodyFam)}; font-size: 14px; line-height: 1.43; color: ${I($s0?.t?.fg)}; -webkit-font-smoothing: antialiased; ${I($s0?.vars)}`)}>
        {$s0?.showRail ? (<>
          <div {...S(`position: relative; z-index: 30; flex: 0 0 ${I($s0?.sbW)}; width: ${I($s0?.sbW)}; align-self: stretch; transition: flex-basis 0.25s cubic-bezier(.4,0,.2,1), width 0.25s cubic-bezier(.4,0,.2,1)`)}>
            <div {...S("position: sticky; top: 0; height: 100vh")}>
              <SSidebar active={"overview"} color={$s0?.eff} dark={$s0?.dark} collapsed={$s0?.collapsed} plan={$s0?.plan} fresh={$s0?.sbFresh} user={$s0?.handle} handle={$s0?.handle} />
            </div>
          </div>
        </>) : null}
        <main {...S(`flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 16px; padding: ${I($s0?.mainPad)}; box-sizing: border-box`)}>
          <STopbar title={"Overview"} mobile={$s0?.mob} quiet={$s0?.quietBell} color={$s0?.eff} dark={$s0?.dark} onNav={$s0?.toggleNav} onSearch={$s0?.openCmd} onAppearance={$s0?.openAppear} onAdd={$s0?.openAdd} />
          {$s0?.hasBanner ? (<>
            <div role={"status"} className={"a-fade"} {...S(`display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 8px 8px 8px 14px; box-sizing: border-box; border: 1px solid ${I($s0?.bn?.bd)}; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.bn?.bg)}; color: ${I($s0?.bn?.fg)}`)}>
              <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 16px")}>
                <path d={$s0?.bn?.icon} />
              </svg>
              <span {...S("flex: 1 1 auto; min-width: 0; font-size: 13px; line-height: 1.4")}>
                <span {...S("font-weight: 600")}>
                  {T($s0?.bn?.title)}
                </span>
                {" "}
                <span {...S(`color: ${I($s0?.bn?.subFg)}`)}>
                  {T($s0?.bn?.text)}
                </span>
              </span>
              <button type={"button"} className={"tb tp"} onClick={$s0?.bn?.act} {...S($s0?.k?.pSm)}>
                {T($s0?.bn?.cta)}
              </button>
            </div>
          </>) : null}
          <div className={"a-in"} {...S("display: flex; flex-direction: column; gap: 4px; padding: 0 4px")}>
            <h1 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: ${I($s0?.h1Fs)}; font-weight: 600; letter-spacing: ${I($s0?.t?.hTrack)}; text-transform: ${I($s0?.t?.hCase)}; line-height: 1.15; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
              {"Welcome to Talby, "}{T($s0?.handle)}
            </h1>
            <p {...S($s0?.wSubSt)}>
              {"Here is how to get started. Most people finish in about five minutes."}
            </p>
          </div>
          {$s0?.showErr ? (<>
            <section aria-label={"Getting started"} className={"a-in"} {...S(`animation-delay: 0.05s; ${I($s0?.k?.card)}`)}>
              <div className={"a-fade"} {...S("display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 64px 24px; box-sizing: border-box; text-align: center")}>
                <span {...S(`display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.errBlk?.tileBg)}; color: ${I($s0?.errBlk?.tileFg)}`)}>
                  <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={$s0?.errBlk?.icon} />
                  </svg>
                </span>
                <div {...S("display: flex; flex-direction: column; align-items: center; gap: 4px; max-width: 380px")}>
                  <span {...S("font-size: 15px; font-weight: 600")}>
                    {T($s0?.errBlk?.title)}
                  </span>
                  {$s0?.errBlk?.hasSub ? (<>
                    <span {...S(`font-size: 13px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}`)}>
                      {T($s0?.errBlk?.sub)}
                    </span>
                  </>) : null}
                </div>
                {$s0?.errBlk?.hasCta ? (<>
                  <div {...S("display: flex; flex-wrap: wrap; justify-content: center; gap: 8px")}>
                    <button type={"button"} className={"tb tp"} onClick={$s0?.errBlk?.act} {...S(`${I($s0?.k?.pSm)}; height: ${I($s0?.stH)}; flex-shrink: 0`)}>
                      {T($s0?.errBlk?.cta)}
                    </button>
                    {$s0?.errBlk?.has2 ? (<>
                      <button type={"button"} className={"tb tg"} onClick={$s0?.errBlk?.act2} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.oSm)}; height: ${I($s0?.stH)}`)}>
                        {T($s0?.errBlk?.cta2)}
                      </button>
                    </>) : null}
                  </div>
                </>) : null}
              </div>
            </section>
          </>) : null}
          {$s0?.showMain ? (<>
            <div {...S(`display: grid; grid-template-columns: ${I($s0?.cols)}; gap: 16px; align-items: stretch`)}>
              <section aria-labelledby={"gs-title"} aria-busy={$s0?.busyAttr} className={"a-in"} {...S(`animation-delay: 0.05s; display: flex; flex-direction: column; min-width: 0; ${I($s0?.k?.card)}`, $s0?.gsRef)}>
                <div {...S("display: flex; flex-direction: column; gap: 12px; padding: 20px 24px 8px")}>
                  <div {...S("display: flex; align-items: baseline; justify-content: space-between; gap: 12px")}>
                    <h2 id={"gs-title"} {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 16px; font-weight: 600; white-space: nowrap`)}>
                      {"Getting started"}
                    </h2>
                    {$s0?.notLoading ? (<>
                      <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap`)}>
                        {T($s0?.doneN)}{" of 6 done"}
                      </span>
                    </>) : null}
                    {$s0?.isLoading ? (<>
                      <span className={"a-pulse"} {...S($s0?.skCount)} />
                    </>) : null}
                  </div>
                  <div role={"progressbar"} aria-label={"Getting started progress"} aria-valuemin={"0"} aria-valuemax={"6"} aria-valuenow={$s0?.doneN} {...S(`height: 6px; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.off)}; overflow: hidden`)}>
                    <div {...S(`height: 100%; width: ${I($s0?.pct)}; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.accent)}; transition: width 0.5s cubic-bezier(.4,0,.2,1)`)} />
                  </div>
                </div>
                {$s0?.allDone ? (<>
                  <div className={"a-pop"} {...S(`display: flex; align-items: center; gap: 14px; margin: 8px 24px 20px; padding: 16px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.okBg)}; color: ${I($s0?.t?.okFg)}`)}>
                    <span {...S(`width: 28px; height: 28px; flex: 0 0 28px; border-radius: 14px; background: ${I($s0?.t?.okFg)}; color: ${I($s0?.okIn)}; display: inline-flex; align-items: center; justify-content: center`)}>
                      <svg className={"a-check"} width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M20 6 9 17l-5-5"} />
                      </svg>
                    </span>
                    <span {...S("flex: 1 1 auto; min-width: 0; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                      {"You are all set up. Nice work."}
                    </span>
                  </div>
                </>) : null}
                {$s0?.notLoading ? (<>
                  <div {...S("display: flex; flex-direction: column; padding: 0 12px 12px")}>
                    {A($s0?.items).map((it, i) => {
                      const $s1 = { ...$s0, "it": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div {...S(`display: flex; align-items: center; gap: 14px; min-height: 64px; padding: 10px 12px; box-sizing: border-box; border-top: ${I($s1?.it?.line)}`)}>
                          <span {...S(`width: 22px; height: 22px; flex: 0 0 22px; box-sizing: border-box; border-radius: 11px; border: ${I($s1?.it?.ringB)}; background: ${I($s1?.it?.ckBg)}; color: ${I($s1?.t?.primaryFg)}; display: inline-flex; align-items: center; justify-content: center; transition: background-color 0.2s ease`)}>
                            {$s1?.it?.done ? (<>
                              <svg className={"a-check"} width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={"M20 6 9 17l-5-5"} />
                              </svg>
                            </>) : null}
                          </span>
                          <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                            <span {...S(`font-weight: 500; color: ${I($s1?.it?.fg)}; text-decoration: ${I($s1?.it?.deco)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color 0.2s ease`)}>
                              {T($s1?.it?.title)}
                            </span>
                            <span {...S(`font-size: 13px; color: ${I($s1?.it?.subFg)}; ${I($s1?.gsSubSt)}`)}>
                              {T($s1?.it?.sub)}
                            </span>
                          </span>
                          {$s1?.it?.showBtn ? (<>
                            <button type={"button"} className={$s1?.it?.cls} onClick={$s1?.it?.act} {...S(`--hv: ${I($s1?.it?.hv)}; ${I($s1?.it?.btn)}`)}>
                              {T($s1?.it?.cta)}
                            </button>
                          </>) : null}
                          {$s1?.it?.showLink ? (<>
                            <a href={H("SDeals.dc.html")} className={$s1?.it?.cls} onClick={$s1?.it?.act} {...S(`--hv: ${I($s1?.it?.hv)}; ${I($s1?.it?.btn)}`)}>
                              {T($s1?.it?.cta)}
                            </a>
                          </>) : null}
                          {$s1?.it?.done ? (<>
                            <span className={"a-fade"} {...S(`font-size: 13px; color: ${I($s1?.t?.mutedFg)}; white-space: nowrap`)}>
                              {"Done"}
                            </span>
                          </>) : null}
                        </div>
                      </React.Fragment>);
                    })}
                  </div>
                </>) : null}
                {$s0?.isLoading ? (<>
                  <div aria-hidden={"true"} {...S("display: flex; flex-direction: column; padding: 0 12px 12px")}>
                    {A($s0?.skRows).map((it, i) => {
                      const $s1 = { ...$s0, "sr": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div {...S(`display: flex; align-items: center; gap: 14px; min-height: 64px; padding: 10px 12px; box-sizing: border-box; border-top: ${I($s1?.sr?.line)}`)}>
                          <span className={"a-pulse"} {...S($s1?.skDot)} />
                          <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 8px")}>
                            <span className={"a-pulse"} {...S($s1?.sr?.t)} />
                            <span className={"a-pulse"} {...S($s1?.sr?.s)} />
                          </span>
                          <span className={"a-pulse"} {...S($s1?.skBtn)} />
                        </div>
                      </React.Fragment>);
                    })}
                  </div>
                </>) : null}
              </section>
              <section aria-labelledby={"ib-title"} className={"a-in"} {...S(`animation-delay: 0.1s; display: flex; flex-direction: column; gap: 18px; min-width: 0; padding: 20px 24px; box-sizing: border-box; ${I($s0?.k?.card)}`)}>
                <div {...S("display: flex; flex-direction: column; gap: 4px")}>
                  <h2 id={"ib-title"} {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 16px; font-weight: 600; white-space: nowrap`)}>
                    {"Ways to add a deal"}
                  </h2>
                  <p {...S(`margin: 0; color: ${I($s0?.t?.mutedFg)}`)}>
                    {"Pick whatever is fastest for you. All three end up in the same place."}
                  </p>
                </div>
                <div {...S($s0?.wyBodySt)}>
                  <div {...S(`display: flex; flex-direction: column; ${I($s0?.k?.group)}`)}>
                    {A($s0?.ways).map((it, i) => {
                      const $s1 = { ...$s0, "wy": it, $index: i };
                      return (<React.Fragment key={i}>
                        <button type={"button"} className={"tb tr"} onClick={$s1?.wy?.act} {...S(`display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 14px; box-sizing: border-box; border: none; border-top: ${I($s1?.wy?.line)}; border-radius: ${I($s1?.wy?.radius)}; background: transparent; color: ${I($s1?.t?.fg)}; font: inherit; text-align: left; cursor: pointer`)}>
                          <span {...S(`width: 34px; height: 34px; flex: 0 0 34px; border-radius: ${I($s1?.t?.rTile)}; background: ${I($s1?.wy?.tileBg)}; color: ${I($s1?.wy?.tileFg)}; display: inline-flex; align-items: center; justify-content: center`)}>
                            <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={$s1?.wy?.icon} />
                            </svg>
                          </span>
                          <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 1px")}>
                            <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                              {T($s1?.wy?.title)}
                            </span>
                            <span {...S(`font-size: 12px; color: ${I($s1?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                              {T($s1?.wy?.sub)}
                            </span>
                          </span>
                        </button>
                      </React.Fragment>);
                    })}
                  </div>
                  <div {...S($s0?.wyDivSt)} />
                  <div {...S($s0?.wyHelpSt)}>
                    <div {...S("display: flex; flex-direction: column; gap: 4px")}>
                      <span {...S(`${I($s0?.k?.caps)}; padding: 0 4px 6px`)}>
                        {"Need a hand?"}
                      </span>
                      {A($s0?.help).map((it, i) => {
                        const $s1 = { ...$s0, "hp": it, $index: i };
                        return (<React.Fragment key={i}>
                          <button type={"button"} className={"tb tg"} onClick={$s1?.hp?.act} {...S(`${I($s1?.k?.item)}; min-height: 40px`)}>
                            <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s1?.t?.mutedFg} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 16px")}>
                              <path d={$s1?.hp?.icon} />
                            </svg>
                            <span {...S("flex: 1 1 auto; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                              {T($s1?.hp?.label)}
                            </span>
                          </button>
                        </React.Fragment>);
                      })}
                    </div>
                    <div {...S("flex: 1 1 auto")} />
                    {$s0?.notMob ? (<>
                      <div {...S(`display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.soft)}; color: ${I($s0?.t?.softFg)}; font-size: 13px`)}>
                        <span {...S(`flex: 0 0 auto; ${I($s0?.k?.kbd)}; background: ${I($s0?.t?.card)}; color: ${I($s0?.t?.fg)}`)}>
                          {"⌘K"}
                        </span>
                        <span {...S("min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                          {"Find any deal, date or payment"}
                        </span>
                      </div>
                    </>) : null}
                    {$s0?.mob ? (<>
                      <button type={"button"} className={"tb tp"} onClick={$s0?.openCmd} {...S(`display: flex; align-items: center; gap: 10px; width: 100%; min-height: 44px; padding: 10px 14px; box-sizing: border-box; border: none; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.soft)}; color: ${I($s0?.t?.softFg)}; font: inherit; font-size: 13px; text-align: left; cursor: pointer`)}>
                        <span {...S(`flex: 0 0 auto; ${I($s0?.k?.kbd)}; background: ${I($s0?.t?.card)}; color: ${I($s0?.t?.fg)}`)}>
                          <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={"m21 21-4.3-4.3M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"} />
                          </svg>
                        </span>
                        <span {...S("min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                          {"Find any deal, date or payment"}
                        </span>
                      </button>
                    </>) : null}
                  </div>
                </div>
              </section>
            </div>
            <section aria-label={"Your money so far"} className={"a-in"} {...S(`animation-delay: 0.15s; display: grid; grid-template-columns: ${I($s0?.moneyCols)}; overflow: hidden; ${I($s0?.k?.card)}`)}>
              {A($s0?.money).map((it, i) => {
                const $s1 = { ...$s0, "mn": it, $index: i };
                return (<React.Fragment key={i}>
                  <div {...S(`display: flex; flex-direction: column; gap: 4px; padding: 18px 20px; min-width: 0; border-left: ${I($s1?.mn?.line)}; border-top: ${I($s1?.mn?.top)}`)}>
                    <span {...S(`color: ${I($s1?.t?.mutedFg)}; white-space: nowrap`)}>
                      {T($s1?.mn?.label)}
                    </span>
                    {$s1?.notLoading ? (<>
                      <span {...S(`font-family: ${I($s1?.numFam)}; font-size: 24px; font-weight: 600; letter-spacing: ${I($s1?.t?.nTrack)}; line-height: 1.15; font-variant-numeric: tabular-nums; color: ${I($s1?.mn?.fg)}; white-space: nowrap`)}>
                        {T($s1?.mn?.value)}
                      </span>
                    </>) : null}
                    {$s1?.isLoading ? (<>
                      <span className={"a-pulse"} {...S($s1?.skMoney)} />
                    </>) : null}
                    <span {...S(`font-size: 12px; color: ${I($s1?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                      {T($s1?.mn?.sub)}
                    </span>
                  </div>
                </React.Fragment>);
              })}
            </section>
          </>) : null}
        </main>
        {$s0?.tourOn ? (<>
          <div {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 95")}>
            <div className={"a-fade"} {...S(`position: fixed; left: ${I($s0?.sp?.l)}; top: ${I($s0?.sp?.t)}; width: ${I($s0?.sp?.w)}; height: ${I($s0?.sp?.h)}; border-radius: ${I($s0?.sp?.r)}; box-shadow: 0 0 0 2px ${I($s0?.t?.primary)}, 0 0 0 9999px rgba(0,0,0,0.55); transition: left 0.35s cubic-bezier(.4,0,.2,1), top 0.35s cubic-bezier(.4,0,.2,1), width 0.35s cubic-bezier(.4,0,.2,1), height 0.35s cubic-bezier(.4,0,.2,1), border-radius 0.35s ease; pointer-events: none`)} />
            <div role={"dialog"} aria-modal={"true"} aria-labelledby={"tour-title"} className={"a-pop"} {...S(`position: fixed; left: ${I($s0?.tc?.l)}; top: ${I($s0?.tc?.t)}; width: ${I($s0?.tcW)}; display: flex; flex-direction: column; gap: 10px; padding: 18px 18px 14px; box-sizing: border-box; background: ${I($s0?.t?.card)}; color: ${I($s0?.t?.fg)}; border: 1px solid ${I($s0?.t?.border)}; border-radius: ${I($s0?.t?.rDialog)}; box-shadow: ${I($s0?.t?.shPop)}; transition: left 0.35s cubic-bezier(.4,0,.2,1), top 0.35s cubic-bezier(.4,0,.2,1)`, $s0?.tcRef)}>
              <div {...S("display: flex; align-items: center; justify-content: space-between; gap: 12px")}>
                <span {...S(`font-size: 12px; font-weight: 500; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap`)}>
                  {T($s0?.tourNo)}{" of "}{T($s0?.tourN)}
                </span>
                <span aria-hidden={"true"} {...S("display: flex; gap: 4px")}>
                  {A($s0?.tourDots).map((it, i) => {
                    const $s1 = { ...$s0, "dt": it, $index: i };
                    return (<React.Fragment key={i}>
                      <span {...S(`width: ${I($s1?.dt?.w)}; height: 6px; border-radius: 3px; background: ${I($s1?.dt?.bg)}; transition: width 0.25s ease, background-color 0.25s ease`)} />
                    </React.Fragment>);
                  })}
                </span>
              </div>
              <h3 id={"tour-title"} {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 17px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                {T($s0?.cur?.title)}
              </h3>
              <p {...S(`margin: 0; color: ${I($s0?.t?.mutedFg)}; line-height: 1.5`)}>
                {T($s0?.cur?.text)}
              </p>
              <div {...S("display: flex; align-items: center; gap: 8px; margin-top: 4px")}>
                <button type={"button"} className={"tb tg"} onClick={$s0?.tourSkip} {...S(`margin-left: -10px; ${I($s0?.k?.gSm)}`)}>
                  {"Skip tour"}
                </button>
                <div {...S("flex: 1 1 auto")} />
                {$s0?.tourHasBack ? (<>
                  <button type={"button"} className={"tb tg"} onClick={$s0?.tourBack} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.oSm)}`)}>
                    {"Back"}
                  </button>
                </>) : null}
                <button type={"button"} className={"tb tp"} onClick={$s0?.tourNext} {...S($s0?.k?.pSm)}>
                  {T($s0?.tourNextLabel)}
                </button>
              </div>
            </div>
          </div>
        </>) : null}
        {$s0?.notifOn ? (<>
          <div role={"dialog"} aria-labelledby={"nt-title"} className={"a-up"} {...S(`position: fixed; left: ${I($s0?.ntL)}; right: ${I($s0?.ntR)}; bottom: ${I($s0?.ntB)}; z-index: 92; width: ${I($s0?.ntW)}; display: flex; gap: 14px; padding: 18px; box-sizing: border-box; background: ${I($s0?.t?.card)}; color: ${I($s0?.t?.fg)}; border: 1px solid ${I($s0?.t?.border)}; border-radius: ${I($s0?.t?.rDialog)}; box-shadow: ${I($s0?.t?.shPop)}`)}>
            <span {...S(`width: 40px; height: 40px; flex: 0 0 40px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.nt?.tileBg)}; color: ${I($s0?.nt?.tileFg)}; display: inline-flex; align-items: center; justify-content: center`)}>
              <svg className={$s0?.nt?.iconCls} width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                <path d={$s0?.nt?.icon} />
              </svg>
            </span>
            <div {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 6px")}>
              <h3 id={"nt-title"} {...S("margin: 0; font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                {T($s0?.nt?.title)}
              </h3>
              <p {...S(`margin: 0; color: ${I($s0?.t?.mutedFg)}; line-height: 1.5`)}>
                {T($s0?.nt?.text)}
              </p>
              {$s0?.nt?.hasSteps ? (<>
                <ul {...S("margin: 2px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px")}>
                  {A($s0?.nt?.steps).map((it, i) => {
                    const $s1 = { ...$s0, "ns": it, $index: i };
                    return (<React.Fragment key={i}>
                      <li {...S("display: flex; align-items: flex-start; gap: 10px; line-height: 1.45")}>
                        <span {...S(`width: 20px; height: 20px; flex: 0 0 20px; margin-top: 0; border-radius: 10px; background: ${I($s1?.t?.fill)}; color: ${I($s1?.t?.fg)}; display: inline-flex; align-items: center; justify-content: center; font-family: ${I($s1?.numFam)}; font-size: 11px; font-weight: 600`)}>
                          {T($s1?.ns?.n)}
                        </span>
                        <span {...S("min-width: 0")}>
                          {T($s1?.ns?.text)}
                        </span>
                      </li>
                    </React.Fragment>);
                  })}
                </ul>
              </>) : null}
              {$s0?.nt?.hasErr ? (<>
                <span role={"alert"} className={"a-fade"} {...S(`display: flex; align-items: flex-start; gap: 8px; font-size: 13px; line-height: 1.4; color: ${I($s0?.t?.destr)}`)}>
                  <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 15px; margin-top: 1px")}>
                    <path d={"M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"} />
                  </svg>
                  <span>
                    {"We could not turn them on. Check your connection and try again."}
                  </span>
                </span>
              </>) : null}
              <div {...S("display: flex; gap: 8px; margin-top: 6px")}>
                <button type={"button"} className={"tb tp"} onClick={$s0?.turnOn} {...S($s0?.k?.pSm)}>
                  {T($s0?.nt?.cta)}
                </button>
                <button type={"button"} className={"tb tg"} onClick={$s0?.notNow} {...S($s0?.k?.gSm)}>
                  {"Not now"}
                </button>
              </div>
            </div>
          </div>
        </>) : null}
        {$s0?.drawerOpen ? (<>
          <div {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 88")}>
            <button type={"button"} aria-label={"Close menu"} className={"a-fade"} onClick={$s0?.closeNav} {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; padding: 0; border: none; background: ${I($s0?.t?.overlay)}; cursor: default`)} />
            <div className={"a-drawer"} {...S(`position: absolute; top: 0; bottom: 0; left: 0; width: 288px; max-width: 86%; overflow-y: auto; box-shadow: ${I($s0?.t?.shPop)}`)}>
              <SSidebar active={"overview"} color={$s0?.eff} dark={$s0?.dark} drawer={true} plan={$s0?.plan} fresh={$s0?.sbFresh} onClose={$s0?.closeNav} user={$s0?.handle} handle={$s0?.handle} />
            </div>
          </div>
        </>) : null}
        <div aria-live={"polite"} {...S(`position: fixed; top: ${I($s0?.toastT)}; right: ${I($s0?.toastR)}; left: ${I($s0?.toastL)}; bottom: ${I($s0?.toastB)}; z-index: 120; display: flex; flex-direction: column; gap: 8px; width: ${I($s0?.toastW)}`)}>
          {A($s0?.toasts).map((it, i) => {
            const $s1 = { ...$s0, "tt": it, $index: i };
            return (<React.Fragment key={i}>
              <div role={"status"} className={"a-toast"} {...S(`display: flex; align-items: center; gap: 12px; padding: 14px 14px 14px 16px; background: ${I($s1?.t?.card)}; color: ${I($s1?.t?.fg)}; border: 1px solid ${I($s1?.t?.border)}; border-radius: ${I($s1?.t?.rCard)}; box-shadow: ${I($s1?.t?.shPop)}`)}>
                {$s1?.tt?.isErr ? (<>
                  <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 18px; color: ${I($s1?.t?.destr)}`)}>
                    <path d={"M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"} />
                  </svg>
                </>) : null}
                <div {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                  <span {...S("font-weight: 500; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden")}>
                    {T($s1?.tt?.title)}
                  </span>
                  {$s1?.tt?.hasDesc ? (<>
                    <span {...S(`font-size: 13px; line-height: 1.4; color: ${I($s1?.t?.mutedFg)}; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden`)}>
                      {T($s1?.tt?.desc)}
                    </span>
                  </>) : null}
                </div>
                {$s1?.tt?.hasUndo ? (<>
                  <button type={"button"} className={"tb tg"} onClick={$s1?.tt?.undo} {...S($s1?.k?.oSm)}>
                    {"Undo"}
                  </button>
                </>) : null}
                {$s1?.tt?.hasCta ? (<>
                  <button type={"button"} className={"tb tg"} onClick={$s1?.tt?.doCta} {...S($s1?.k?.oSm)}>
                    {T($s1?.tt?.cta)}
                  </button>
                </>) : null}
              </div>
            </React.Fragment>);
          })}
        </div>
        <SPraise data={$s0?.praise} mobile={$s0?.mob} color={$s0?.eff} dark={$s0?.dark} onClose={$s0?.closePraise} />
        <SAddDeal open={$s0?.add} locked={$s0?.lockedKind} mobile={$s0?.mob} color={$s0?.eff} dark={$s0?.dark} onClose={$s0?.closeAdd} onCreated={$s0?.onCreated} />
        <SCommand open={$s0?.cmd} color={$s0?.eff} dark={$s0?.dark} onClose={$s0?.closeCmd} onAction={$s0?.cmdAction} />
        <SAppearance open={$s0?.appear} theme={$s0?.look?.theme} mode={$s0?.look?.mode} sidebar={$s0?.look?.sidebar} dark={$s0?.dark} onSet={$s0?.setLook} onClose={$s0?.closeAppear} />
        <SAssistant embedded={true} nameFirst={$s0?.asstName} empty={$s0?.isEmpty} hidden={$s0?.chatHidden} askId={$s0?.askId} askText={$s0?.askText} color={$s0?.eff} dark={$s0?.dark} />
      </div>
  </>);
}

export const meta = {"props":{"color":{"editor":"enum","options":["studio","sand","mac","stationery","editorial"],"default":"studio"},"dark":{"editor":"boolean","default":false},"view":{"editor":"enum","options":["sample","empty","loading","error"],"default":"sample"},"plan":{"editor":"enum","options":["active","trial","pastdue","canceled","readonly"],"default":"active"},"start":{"editor":"enum","options":["tour","none","notify","done","complete"],"default":"tour"},"err":{"editor":"enum","options":["none","blocked","offline"],"default":"none"}},"preview":{"width":1440,"height":1000}};
export default $r.defineBoard("SWelcome", Component, render, CSS, meta);
