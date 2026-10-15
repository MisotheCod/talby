// @ts-nocheck
/* eslint-disable */
'use client';
// SCalendar: converted from design-source/boards/SCalendar.dc.html.
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
    }, {
      view: 'month', show: { post: true, del: true, pay: true }, sel: '2026-10-14', month: 9, addType: 'del', draft: '', amt: '', day: '', pvTop: 0, pvLeft: 0, fresh: {},
      events: [
        { id: 1, d: '2026-09-28', k: 'pay', title: 'Haleon Centrum', amt: 10550, over: true },
        { id: 2, d: '2026-10-02', k: 'del', title: 'Submit concept for CeraVe', done: true },
        { id: 3, d: '2026-10-02', k: 'del', title: 'Resubmit changes for Dramamine', done: true },
        { id: 4, d: '2026-10-05', k: 'pay', title: 'Golden Corral', amt: 10000, over: true },
        { id: 5, d: '2026-10-05', k: 'del', title: 'Get connected to Creator IQ for Dramamine', done: true },
        { id: 6, d: '2026-10-07', k: 'del', title: 'Submit video for CeraVe', done: true },
        { id: 7, d: '2026-10-08', k: 'del', title: 'Submit revised Liquid I.V. content', done: true },
        { id: 8, d: '2026-10-08', k: 'del', title: 'Submit concept for oon', done: true },
        { id: 9, d: '2026-10-09', k: 'del', title: 'Submit concept for Milan Laser', done: true },
        { id: 10, d: '2026-10-11', k: 'pay', title: 'Tums', amt: 8500, over: true },
        { id: 11, d: '2026-10-13', k: 'post', title: 'Dramamine Video 1' },
        { id: 12, d: '2026-10-15', k: 'post', title: 'CeraVe' },
        { id: 13, d: '2026-10-19', k: 'pay', title: 'Nioxin', amt: 1200 },
        { id: 14, d: '2026-11-05', k: 'pay', title: 'Sprouts', amt: 4000 },
        { id: 15, d: '2026-11-09', k: 'pay', title: 'Dulcolax', amt: 8500 },
        { id: 16, d: '2026-11-30', k: 'pay', title: 'Liquid I.V. Q3 Campaign', amt: 6500 }
      ]
    });
  }
  componentDidMount() {
    var self = this;
    this._rs = function () { try { self.setState({ w: window.innerWidth }); } catch (e) {} };
    this._sg = function (ev) { if (ev && ev.key === 'talby.look') { try { var L = JSON.parse(ev.newValue || 'null'); if (L) self.setState({ look: Object.assign({}, self.state.look, L) }); } catch (x) {} } };
    this._kd = function (e) { if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { if (e.preventDefault) e.preventDefault(); self.setState({ cmd: !self.state.cmd, nav: false }); } };
    this._mqf = function () { self.setState({ sysAt: Date.now() }); };
    try { window.addEventListener('resize', this._rs); window.addEventListener('storage', this._sg); window.addEventListener('keydown', this._kd); } catch (e) {}
    try { this._mq = window.matchMedia('(prefers-color-scheme: dark)'); if (this._mq.addEventListener) this._mq.addEventListener('change', this._mqf); else if (this._mq.addListener) this._mq.addListener(this._mqf); } catch (e) {}

  }
  componentWillUnmount() { try { window.removeEventListener('resize', this._rs); window.removeEventListener('storage', this._sg); window.removeEventListener('keydown', this._kd); } catch (e) {} try { if (this._mq) { if (this._mq.removeEventListener) this._mq.removeEventListener('change', this._mqf); else if (this._mq.removeListener) this._mq.removeListener(this._mqf); } } catch (e) {} clearTimeout(this._pz1); clearTimeout(this._pz2); clearTimeout(this._rt); (this._tt || []).forEach(clearTimeout); }
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

  openDay(key, el) {
    var W = 340, H = 430, top = 120, left = 200, vw = 1440, vh = 900;
    try { vw = window.innerWidth; vh = window.innerHeight; } catch (e) {}
    if (el && el.getBoundingClientRect) {
      var r = el.getBoundingClientRect();
      left = r.right + 8; if (left + W > vw - 8) left = r.left - W - 8; if (left < 8) left = Math.max(8, Math.min(vw - W - 8, r.left));
      top = r.top; if (top + H > vh - 8) top = Math.max(8, vh - H - 8);
    } else { left = Math.max(8, (vw - W) / 2); top = Math.max(8, (vh - H) / 2); }
    this.setState({ day: key, sel: key, pvTop: Math.round(top), pvLeft: Math.round(left), draft: '', amt: '' });
    var self = this; setTimeout(function () { try { if (self.input && window.innerWidth >= 768) self.input.focus(); } catch (e) {} }, 60);
  }
  failOnce(key) {
    var off = false; try { off = navigator.onLine === false; } catch (e) {}
    if (off) return true;
    if (!this.props.failSave) return false;
    this._failed = this._failed || {};
    if (this._failed[key]) return false;
    this._failed[key] = true; return true;
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

    if (!this.cellEls) this.cellEls = {};
    t.head = dark ? '#1A1A1A' : '#FAFAFA'; t.out = dark ? '#121212' : '#FAFAFA'; t.sel = dark ? '#1F1F1F' : '#F5F5F5'; t.foot = dark ? '#141414' : '#FCFCFC';
    var WDL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var CAT = dark ? {
      post: { bg: 'rgba(139,92,246,0.2)', fg: '#C4B5FD', sw: '#8B5CF6', label: 'Post' }, del: { bg: 'rgba(245,158,11,0.18)', fg: '#FCD34D', sw: '#F59E0B', label: 'Deliverable' },
      pay: { bg: 'rgba(34,197,94,0.16)', fg: '#86EFAC', sw: '#22C55E', label: 'Payment' }, over: { bg: 'rgba(239,68,68,0.18)', fg: '#FCA5A5', sw: '#EF4444', label: 'Overdue' }, done: { bg: '#262626', fg: '#A1A1A1', sw: '#525252', label: 'Done' }
    } : {
      post: { bg: '#F3EEFF', fg: '#6D28D9', sw: '#8B5CF6', label: 'Post' }, del: { bg: '#FEF4E2', fg: '#B45309', sw: '#F59E0B', label: 'Deliverable' },
      pay: { bg: '#E9F8EE', fg: '#15803D', sw: '#22C55E', label: 'Payment' }, over: { bg: '#FDECEC', fg: '#B91C1C', sw: '#EF4444', label: 'Overdue' }, done: { bg: '#F2F2F2', fg: '#737373', sw: '#C4C4C4', label: 'Done' }
    };
    function cat(e) { if (e.k === 'del' && e.done) return CAT.done; if (e.over) return CAT.over; return CAT[e.k]; }
    function iso(y, m, d) { var dt = new Date(y, m, d); return dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2); }
    var TODAY = '2026-10-14';
    // Data for the current data view. Empty shows only items the viewer adds; loading and error show none.
    var evAll = isSample ? st.events : (isEmpty ? st.events.filter(function (e) { return e.u; }) : []);
    var noItems = isEmpty && evAll.length === 0;
    var vis = evAll.filter(function (e) { return st.show[e.k]; });
    var m = st.month, first = new Date(2026, m, 1).getDay(), dim = new Date(2026, m + 1, 0).getDate();
    var n = Math.ceil((first + dim) / 7) * 7, rowsN = n / 7, cells = [];
    var line = '1px solid ' + t.border;
    var selKey = mob ? st.sel : st.day;
    var SKC = { 1: [88], 5: [82, 58], 8: [70], 10: [86, 62], 12: [74], 15: [66], 18: [80], 22: [72], 26: [60], 29: [76] };
    for (var i = 0; i < n; i++) {
      (function (i) {
        var dt = new Date(2026, m, 1 - first + i), key = iso(dt.getFullYear(), dt.getMonth(), dt.getDate());
        var out = dt.getMonth() !== m, today = key === TODAY, sel = key === selKey;
        var mine = vis.filter(function (e) { return e.d === key; });
        var skw = isLoading ? (SKC[i] || []) : [];
        cells.push({
          num: String(dt.getDate()), sel: sel, popup: mob ? 'false' : 'dialog', aria: MONTHS[dt.getMonth()] + ' ' + dt.getDate() + ', ' + mine.length + (mine.length === 1 ? ' item' : ' items'),
          numBg: today ? t.primary : 'transparent', numFg: today ? t.primaryFg : (out ? t.mutedFg : t.fg), numFw: today || sel ? '600' : '500',
          bg: sel ? t.sel : (out ? t.out : t.card), hvr: sel ? t.sel : (out ? t.fill : t.hoverCard), ring: sel ? ('inset 0 0 0 1.5px ' + t.primary) : 'none',
          br: (i % 7) < 6 ? line : 'none', bb: Math.floor(i / 7) < rowsN - 1 ? line : 'none',
          events: mine.slice(0, 3).map(function (e) { var c2 = cat(e); return { title: e.title, bg: c2.bg, fg: c2.fg, done: e.k === 'del' && !!e.done, cls: st.fresh[e.id] ? 'a-pop' : '' }; }),
          skel: skw.map(function (w) { return sk(w + '%', '21px', t.rEv); }),
          dots: isLoading ? skw.map(function () { return t.off; }) : mine.slice(0, 3).map(function (e) { return cat(e).sw; }),
          hasMore: mine.length > 3, more: (mine.length - 3) + ' more',
          ref: function (el) { self.cellEls[key] = el; },
          pick: function (ev) { if (mob) self.setState({ sel: key }); else self.openDay(key, ev && ev.currentTarget); }
        });
      })(i);
    }
    var monthEvents = vis.filter(function (e) { return +e.d.slice(5, 7) === m + 1; });
    var keys = {}; monthEvents.forEach(function (e) { keys[e.d] = true; }); if (m === 9) keys[TODAY] = true;
    var akeys = (isSample || (isEmpty && !noItems)) ? Object.keys(keys).sort() : [];
    var agenda = akeys.map(function (key, j) {
      var evs = monthEvents.filter(function (e) { return e.d === key; }), today = key === TODAY, sel = key === st.day;
      var dt = new Date(key + 'T00:00:00');
      return { wd: WDL[dt.getDay()].slice(0, 3), num: String(dt.getDate()), sel: sel, bg: sel ? t.sel : 'transparent', line: j < akeys.length - 1 ? ('1px solid ' + t.line) : 'none',
        numBg: today ? t.primary : 'transparent', numFg: today ? t.primaryFg : t.fg, none: evs.length === 0,
        events: evs.map(function (e) { var c2 = cat(e), dn = e.k === 'del' && !!e.done; return { type: dn ? CAT.del.label : c2.label, bg: c2.bg, fg: c2.fg, sw: c2.sw, title: e.title, titleFg: dn ? t.mutedFg : t.fg, done: dn, amount: e.amt ? fmt(e.amt) : '', amtFg: e.over ? t.destr : t.fg,
          sub: e.over ? 'Payment overdue' : (e.k === 'del' ? (dn ? 'Deliverable, done' : 'Deliverable') : c2.label), fg2: e.over ? t.destr : t.mutedFg }; }),
        pick: function (ev) { self.openDay(key, ev && ev.currentTarget); } };
    });
    var AGS = [[62], [48, 70], [56], [66, 44], [52]];
    var agSkel = isLoading ? AGS.map(function (r, j) { return { line: j < AGS.length - 1 ? ('1px solid ' + t.line) : 'none', lines: r.map(function (w) { return sk(w + '%', '12px'); }) }; }) : [];
    function dayData(key) {
      var sd2 = new Date(key + 'T00:00:00'), isT = key === TODAY;
      var list = evAll.filter(function (e) { return e.d === key; });
      var evs = list.map(function (e, j) {
        var c2 = cat(e), isDel = e.k === 'del';
        return { title: e.title, isDel: isDel, isDot: !isDel, done: !!e.done, box: box(t, !!e.done) + (mob ? '; width: 20px; height: 20px; flex: 0 0 20px' : ''), dotBox: mob ? '20px' : '16px', aria: (e.done ? 'Mark not done: ' : 'Mark done: ') + e.title, sw: c2.sw,
          titleFg: isDel && e.done ? t.mutedFg : t.fg, sub: e.over ? 'Payment overdue' : (isDel ? (e.done ? 'Deliverable, done' : 'Deliverable') : c2.label), fg2: e.over ? t.destr : t.mutedFg,
          amount: e.amt ? fmt(e.amt) : '', amtFg: e.over ? t.destr : t.fg, rowStyle: j ? k.rowT : k.row, cls: st.fresh[e.id] ? 'a-in' : '',
          toggle: function () { if (!self.guard()) return; self.setState({ events: self.state.events.map(function (x) { return x.id === e.id ? Object.assign({}, x, { done: !x.done }) : x; }) }); } };
      });
      return { title: WDL[sd2.getDay()] + ', ' + MONTHS[sd2.getMonth()] + ' ' + sd2.getDate(), mon: MS[sd2.getMonth()], day: String(sd2.getDate()), today: isT,
        badgeBg: isT ? t.primary : t.tile, badgeFg: isT ? t.primaryFg : t.fg,
        sub: evs.length ? evs.length + (evs.length === 1 ? ' item' : ' items') : 'Nothing scheduled', hasSub: !isLoading, skel: isLoading,
        events: evs, none: !isLoading && evs.length === 0, any: !isLoading && evs.length > 0,
        addLabel: 'Add to ' + MONTHS[sd2.getMonth()] + ' ' + sd2.getDate(), short: WDL[sd2.getDay()] };
    }
    var dayKey = st.day || st.sel, sd = new Date(dayKey + 'T00:00:00');
    var pv = dayData(dayKey), dc = dayData(st.sel);
    var cnt = { post: 0, del: 0, pay: 0 }; evAll.forEach(function (e) { if (+e.d.slice(5, 7) === m + 1) cnt[e.k]++; });
    var payDue = evAll.filter(function (e) { return e.k === 'pay' && +e.d.slice(5, 7) === m + 1; });
    var payTotal = payDue.reduce(function (a, e) { return a + (e.amt || 0); }, 0);
    // Writes: check the plan, then save. A failed save keeps the draft and offers Try again.
    function commit(item, label) {
      if (!self.guard()) return;
      if (self.failOnce('add')) { self.toastErr('Could not add ' + label.toLowerCase(), 'Check your connection.', function () { commit(item, label); }); return; }
      var s = self.state, id = s.events.reduce(function (a, x) { return Math.max(a, x.id); }, 0) + 1;
      var sh = Object.assign({}, s.show); sh[item.k] = true;
      var fr = Object.assign({}, s.fresh); fr[id] = true;
      self.setState({ events: s.events.concat([Object.assign({ id: id, u: true }, item)]), draft: '', amt: '', show: sh, fresh: fr });
      var d2 = new Date(item.d + 'T00:00:00');
      self.toast(label + ' added', item.title + ', ' + MS[d2.getMonth()] + ' ' + d2.getDate());
    }
    function add() {
      var tx = (st.draft || '').trim(); if (!tx) return;
      var amtN = parseFloat(String(st.amt || '').replace(/[^0-9.]/g, ''));
      commit({ d: dayKey, k: st.addType, title: tx, done: false, amt: st.addType === 'pay' && !isNaN(amtN) ? amtN : 0 }, CAT[st.addType].label);
    }
    var hasDraft = !!(st.draft || '').trim();
    function chipStyle(on) { return 'display: inline-flex; align-items: center; gap: 7px; height: 30px; padding: 0 12px 0 10px; box-sizing: border-box; border: 1px solid ' + t.border + '; border-radius: ' + t.rCtl + '; background: ' + (on ? t.card : 'transparent') + '; color: ' + (on ? t.fg : t.mutedFg) + '; font: inherit; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer; --hv: ' + t.fill; }
    var navB = 'display: inline-flex; align-items: center; justify-content: center; height: 100%; box-sizing: border-box; border: none; border-radius: 0; background: transparent; color: ' + t.fg + '; font: inherit; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer; --hv: ' + t.hv;
    function phoneSel(mo) { return mo === 9 ? TODAY : iso(2026, mo, 1); }
    var emptyBlk = blk('empty', 'M8 2v4M16 2v4M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM3 10h18', 'Nothing on your calendar yet', 'Posts, deliverables and payment dates show up here once you add a deal.', 'Add deal', function () { self.setState({ add: 'new', nav: false }); });
    var page = {
      minH: !wide ? '100vh' : '960px',
      monthTitle: MONTHS[m] + ' 2026',
      monthSub: noItems ? 'Nothing scheduled yet' : payDue.length + (payDue.length === 1 ? ' payment' : ' payments') + ' due, ' + fmt(payTotal) + ' · ' + cnt.post + (cnt.post === 1 ? ' post' : ' posts') + ' · ' + cnt.del + (cnt.del === 1 ? ' deliverable' : ' deliverables'),
      showSub: !isLoading && !isError, subWs: mob ? 'normal' : 'nowrap', skSub: sk(mob ? '220px' : '320px', '12px') + '; margin: 4px 0',
      showAddBtn: !isError, addOff: isLoading, addBtnH: mob ? '36px' : '32px', addBtnOp: isLoading ? '0.5' : '1',
      notErr: !isError,
      prevMonth: function () { var mo = Math.max(0, st.month - 1); self.setState(mob ? { month: mo, day: '', sel: phoneSel(mo) } : { month: mo, day: '' }); },
      nextMonth: function () { var mo = Math.min(11, st.month + 1); self.setState(mob ? { month: mo, day: '', sel: phoneSel(mo) } : { month: mo, day: '' }); },
      goToday: function () { self.setState({ month: 9, sel: TODAY, day: '' }); },
      addToday: function () { if (isLoading) return; if (!self.guard()) return; var key = st.sel || TODAY; if (+key.slice(5, 7) !== st.month + 1) key = TODAY; var go = function () { self.openDay(key, mob ? null : self.cellEls[key]); }; if (st.view !== 'month' || st.month !== 9 && key === TODAY) { self.setState({ view: 'month', month: +key.slice(5, 7) - 1 }); setTimeout(go, 30); } else go(); },
      addSel: function () { if (isLoading) return; if (!self.guard()) return; self.openDay(st.sel, null); },
      views: [['month', 'Month'], ['agenda', 'Agenda']].map(function (x) { var on = st.view === x[0]; return { label: x[1], on: on, style: tabStyle(t, on), pick: function () { self.setState({ view: x[0], day: '' }); } }; }),
      isMonth: st.view === 'month', isAgenda: st.view === 'agenda',
      chipOrd: wide || mob ? '0' : '2', tabOrd: wide || mob ? '0' : '1',
      navBtn: navB + '; width: 38px; padding: 0', navToday: navB + '; padding: 0 12px; border-left: 1px solid ' + t.border + '; border-right: 1px solid ' + t.border,
      chips: ['post', 'del', 'pay'].map(function (kk) { var on = !!st.show[kk]; return { label: CAT[kk].label + 's', on: on, sw: on ? CAT[kk].sw : t.off, style: chipStyle(on), mstyle: chipStyle(on) + '; flex: 1 0 auto; justify-content: center; height: 36px', pick: function () { var o = Object.assign({}, st.show); o[kk] = !on; self.setState({ show: o }); } }; }),
      cellH: mob ? '56px' : '120px', cellPad: mob ? '6px 2px' : '6px 6px 8px', cellAlign: mob ? 'center' : 'stretch', numAlign: mob ? 'center' : 'flex-start',
      wdHead: mob ? ['S', 'M', 'T', 'W', 'T', 'F', 'S'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], wdPad: mob ? '0' : '12px', wdAlign: mob ? 'center' : 'left',
      cells: cells, agenda: agenda, agGap: mob ? '12px' : '16px', agPad: mob ? '12px 14px' : '14px 16px', agSkel: agSkel, agEmpty: noItems,
      skWd: sk('22px', '10px'), skNum: sk('32px', '32px', '16px'), skPill: sk('72px', '22px', t.rEv),
      gridPos: noItems ? 'relative' : 'static', showHint: noItems && !mob, dotCls: isLoading ? 'a-pulse' : '',
      emptyBlk: emptyBlk,
      errBlk: blk('error', IC.wifi, 'We could not load your calendar', 'Check your connection and try again. Nothing was lost.', 'Try again', function () { self.retryLoad(); }),
      showDayCard: mob && st.view === 'month' && !isError && !noItems, showMobHint: mob && st.view === 'month' && noItems,
      dc: dc, skDaySub: sk('64px', '10px') + '; margin: 4px 0 3px',
      skRows: [[58, 30], [72, 26], [46, 34]].map(function (r, j) { return { rowStyle: j ? k.rowT : k.row, w1: sk(r[0] + '%', '12px'), w2: sk(r[1] + '%', '10px') }; }), skBox: sk('16px', '16px', t.rBox),
      pvOpen: !!st.day, closeDay: function () { self.setState({ day: '' }); },
      pvShade: mob ? t.overlay : 'transparent', pvAnim: mob ? 'a-up' : 'a-pop',
      pvTop: mob ? 'auto' : st.pvTop + 'px', pvLeft: mob ? '0px' : st.pvLeft + 'px', pvRight: mob ? '0px' : 'auto', pvBottom: mob ? '0px' : 'auto',
      pvW: mob ? 'auto' : '340px', pvMaxH: mob ? '82vh' : 'calc(100vh - 16px)', pvRadius: mob ? (t.rDialog + ' ' + t.rDialog + ' 0 0') : t.rCard,
      pv: pv, footPad: mob ? '12px 12px 20px' : '12px 12px 14px', addH: mob ? '36px' : '32px',
      addTypes: [['post', 'Post'], ['del', 'Deliverable'], ['pay', 'Payment']].map(function (x) { var on = st.addType === x[0]; return { label: x[1], on: on, sw: CAT[x[0]].sw, style: tabStyle(t, on), pick: function () { self.setState({ addType: x[0] }); } }; }),
      isPayType: st.addType === 'pay',
      addPh: st.addType === 'post' ? 'Which deal is posting?' : st.addType === 'pay' ? 'Which brand is paying?' : 'What do you need to send?',
      draft: st.draft, setDraft: function (e) { self.setState({ draft: e.target.value }); }, draftKey: function (e) { if (e.key === 'Enter') add(); if (e.key === 'Escape') self.setState({ day: '' }); }, addItem: add,
      amt: st.amt, setAmt: function (e) { self.setState({ amt: e.target.value }); },
      noDraft: !hasDraft, addOp: hasDraft ? '1' : '0.4',
      inputRef: function (el) { self.input = el; }
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
      onCreated: function (info) { self.setState({ add: '' }); self.celebrate(info || {}); },
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
    out.chatHidden = st.appear || st.nav || st.cmd || !!st.add || !!(st.day && mob);
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
              <SSidebar active={"calendar"} color={$s0?.eff} dark={$s0?.dark} collapsed={$s0?.collapsed} plan={$s0?.plan} fresh={$s0?.sbFresh} />
            </div>
          </div>
        </>) : null}
        <main {...S(`flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 16px; padding: ${I($s0?.mainPad)}; box-sizing: border-box`)}>
          <STopbar title={"Calendar"} mobile={$s0?.mob} quiet={$s0?.quietBell} color={$s0?.eff} dark={$s0?.dark} onNav={$s0?.toggleNav} onSearch={$s0?.openCmd} onAppearance={$s0?.openAppear} onAdd={$s0?.openAdd} />
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
          <div className={"a-in"} {...S("display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; padding: 0 4px")}>
            <div {...S("display: flex; flex-direction: column; gap: 4px; min-width: 0")}>
              <h1 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: ${I($s0?.h1Fs)}; font-weight: 600; letter-spacing: ${I($s0?.t?.hTrack)}; text-transform: ${I($s0?.t?.hCase)}; line-height: 1.15`)}>
                {"Calendar"}
              </h1>
              {$s0?.showSub ? (<>
                <p {...S(`margin: 0; color: ${I($s0?.t?.mutedFg)}; white-space: ${I($s0?.subWs)}; overflow: hidden; text-overflow: ellipsis`)}>
                  {T($s0?.monthSub)}
                </p>
              </>) : null}
              {$s0?.isLoading ? (<>
                <span className={"a-pulse"} {...S($s0?.skSub)} />
              </>) : null}
            </div>
            {$s0?.showAddBtn ? (<>
              <button className={"tb tg"} type={"button"} onClick={$s0?.addToday} aria-label={"Add to calendar"} aria-disabled={$s0?.addOff} {...S(`${I($s0?.k?.btnO)}; height: ${I($s0?.addBtnH)}; opacity: ${I($s0?.addBtnOp)}; flex-shrink: 0`)}>
                <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M5 12h14M12 5v14"} />
                </svg>
                {$s0?.notMob ? (<>
                  <span>
                    {"Add to calendar"}
                  </span>
                </>) : null}
                {$s0?.mob ? (<>
                  <span>
                    {"Add"}
                  </span>
                </>) : null}
              </button>
            </>) : null}
          </div>
          {$s0?.notErr ? (<>
            <section className={"a-in"} {...S(`animation-delay: 0.05s; min-width: 0; overflow: hidden; ${I($s0?.k?.card)}`)}>
              {$s0?.notMob ? (<>
                <div {...S(`display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 12px 14px; border-bottom: 1px solid ${I($s0?.t?.border)}`)}>
                  <button className={"tb tg"} type={"button"} onClick={$s0?.goToday} {...S($s0?.k?.oSm)}>
                    {"Today"}
                  </button>
                  <div {...S("display: flex; align-items: center")}>
                    <button className={"tb tg"} type={"button"} onClick={$s0?.prevMonth} aria-label={"Previous month"} {...S($s0?.k?.icoG)}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"m15 18-6-6 6-6"} />
                      </svg>
                    </button>
                    <button className={"tb tg"} type={"button"} onClick={$s0?.nextMonth} aria-label={"Next month"} {...S($s0?.k?.icoG)}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"m9 18 6-6-6-6"} />
                      </svg>
                    </button>
                  </div>
                  <h2 {...S(`margin: 0 8px 0 2px; font-family: ${I($s0?.titleFam)}; font-size: 17px; font-weight: 600; white-space: nowrap`)}>
                    {T($s0?.monthTitle)}
                  </h2>
                  <div {...S("flex: 1 1 auto")} />
                  <div role={"group"} aria-label={"Show on calendar"} {...S(`display: flex; gap: 6px; flex-wrap: wrap; order: ${I($s0?.chipOrd)}`)}>
                    {A($s0?.chips).map((it, i) => {
                      const $s1 = { ...$s0, "c": it, $index: i };
                      return (<React.Fragment key={i}>
                        <button className={"tb tg"} type={"button"} aria-pressed={$s1?.c?.on} onClick={$s1?.c?.pick} {...S($s1?.c?.style)}>
                          <span {...S(`width: 9px; height: 9px; flex: 0 0 9px; border-radius: 3px; background: ${I($s1?.c?.sw)}; transition: background-color 0.2s ease`)} />
                          {T($s1?.c?.label)}
                        </button>
                      </React.Fragment>);
                    })}
                  </div>
                  <div role={"tablist"} aria-label={"View"} {...S(`order: ${I($s0?.tabOrd)}; ${I($s0?.k?.tabs)}`)}>
                    {A($s0?.views).map((it, i) => {
                      const $s1 = { ...$s0, "v": it, $index: i };
                      return (<React.Fragment key={i}>
                        <button className={"tb tt"} type={"button"} role={"tab"} aria-selected={$s1?.v?.on} onClick={$s1?.v?.pick} {...S($s1?.v?.style)}>
                          {T($s1?.v?.label)}
                        </button>
                      </React.Fragment>);
                    })}
                  </div>
                </div>
              </>) : null}
              {$s0?.mob ? (<>
                <div {...S(`display: flex; flex-direction: column; gap: 10px; padding: 12px; border-bottom: 1px solid ${I($s0?.t?.border)}`)}>
                  <div {...S("display: flex; align-items: center; gap: 8px; min-width: 0")}>
                    <h2 {...S(`flex: 1 1 auto; min-width: 0; margin: 0 0 0 4px; font-family: ${I($s0?.titleFam)}; font-size: 18px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                      {T($s0?.monthTitle)}
                    </h2>
                    <div {...S(`display: flex; align-items: stretch; flex: 0 0 auto; height: 36px; box-sizing: border-box; border: 1px solid ${I($s0?.t?.border)}; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.card)}; overflow: hidden`)}>
                      <button className={"tb tg"} type={"button"} onClick={$s0?.prevMonth} aria-label={"Previous month"} {...S($s0?.navBtn)}>
                        <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"m15 18-6-6 6-6"} />
                        </svg>
                      </button>
                      <button className={"tb tg"} type={"button"} onClick={$s0?.goToday} {...S($s0?.navToday)}>
                        {"Today"}
                      </button>
                      <button className={"tb tg"} type={"button"} onClick={$s0?.nextMonth} aria-label={"Next month"} {...S($s0?.navBtn)}>
                        <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"m9 18 6-6-6-6"} />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div role={"tablist"} aria-label={"View"} {...S(`display: flex; width: 100%; ${I($s0?.k?.tabs)}`)}>
                    {A($s0?.views).map((it, i) => {
                      const $s1 = { ...$s0, "v": it, $index: i };
                      return (<React.Fragment key={i}>
                        <button className={"tb tt"} type={"button"} role={"tab"} aria-selected={$s1?.v?.on} onClick={$s1?.v?.pick} {...S(`flex: 1 1 0; ${I($s1?.v?.style)}`)}>
                          {T($s1?.v?.label)}
                        </button>
                      </React.Fragment>);
                    })}
                  </div>
                  <div role={"group"} aria-label={"Show on calendar"} {...S("display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none")}>
                    {A($s0?.chips).map((it, i) => {
                      const $s1 = { ...$s0, "c": it, $index: i };
                      return (<React.Fragment key={i}>
                        <button className={"tb tg"} type={"button"} aria-pressed={$s1?.c?.on} onClick={$s1?.c?.pick} {...S($s1?.c?.mstyle)}>
                          <span {...S(`width: 9px; height: 9px; flex: 0 0 9px; border-radius: 3px; background: ${I($s1?.c?.sw)}; transition: background-color 0.2s ease`)} />
                          {T($s1?.c?.label)}
                        </button>
                      </React.Fragment>);
                    })}
                  </div>
                </div>
              </>) : null}
              {$s0?.isMonth ? (<>
                <div {...S(`display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); border-bottom: 1px solid ${I($s0?.t?.border)}; background: ${I($s0?.t?.head)}`)}>
                  {A($s0?.wdHead).map((it, i) => {
                    const $s1 = { ...$s0, "w": it, $index: i };
                    return (<React.Fragment key={i}>
                      <span {...S(`height: 34px; padding: 0 ${I($s1?.wdPad)}; line-height: 34px; font-size: 12px; font-weight: 500; text-align: ${I($s1?.wdAlign)}; color: ${I($s1?.t?.mutedFg)}`)}>
                        {T($s1?.w)}
                      </span>
                    </React.Fragment>);
                  })}
                </div>
                <div className={"a-fade"} {...S(`position: ${I($s0?.gridPos)}; display: grid; grid-template-columns: repeat(7, minmax(0, 1fr))`)}>
                  {A($s0?.cells).map((it, i) => {
                    const $s1 = { ...$s0, "c": it, $index: i };
                    return (<React.Fragment key={i}>
                      <button type={"button"} className={"tr"} onClick={$s1?.c?.pick} aria-pressed={$s1?.c?.sel} aria-haspopup={$s1?.c?.popup} aria-label={$s1?.c?.aria} {...S(`--hvr: ${I($s1?.c?.hvr)}; min-height: ${I($s1?.cellH)}; min-width: 0; box-sizing: border-box; padding: ${I($s1?.cellPad)}; border: none; border-right: ${I($s1?.c?.br)}; border-bottom: ${I($s1?.c?.bb)}; border-radius: 0; background: ${I($s1?.c?.bg)}; box-shadow: ${I($s1?.c?.ring)}; display: flex; flex-direction: column; align-items: ${I($s1?.cellAlign)}; gap: 3px; overflow: hidden; font: inherit; color: inherit; text-align: left; cursor: pointer; transition: background-color 0.12s ease, box-shadow 0.15s ease`, $s1?.c?.ref)}>
                        <span {...S(`display: flex; align-items: center; justify-content: space-between; width: 100%; align-self: ${I($s1?.numAlign)}`)}>
                          <span {...S(`min-width: 24px; height: 24px; padding: 0 6px; box-sizing: border-box; border-radius: 12px; background: ${I($s1?.c?.numBg)}; color: ${I($s1?.c?.numFg)}; font-size: 12px; font-weight: ${I($s1?.c?.numFw)}; line-height: 24px; text-align: center; font-variant-numeric: tabular-nums`)}>
                            {T($s1?.c?.num)}
                          </span>
                        </span>
                        {$s1?.notMob ? (<>
                          {A($s1?.c?.events).map((it, i) => {
                            const $s2 = { ...$s1, "e": it, $index: i };
                            return (<React.Fragment key={i}>
                              <span className={$s2?.e?.cls} {...S(`display: flex; align-items: center; gap: 4px; width: 100%; height: 21px; padding: 0 7px; box-sizing: border-box; border-radius: ${I($s2?.t?.rEv)}; background: ${I($s2?.e?.bg)}; color: ${I($s2?.e?.fg)}; font-size: 12px; font-weight: 500; min-width: 0`)}>
                                {$s2?.e?.done ? (<>
                                  <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 11px")}>
                                    <path d={"M20 6 9 17l-5-5"} />
                                  </svg>
                                </>) : null}
                                <span {...S("flex: 1 1 auto; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                                  {T($s2?.e?.title)}
                                </span>
                              </span>
                            </React.Fragment>);
                          })}
                          {A($s1?.c?.skel).map((it, i) => {
                            const $s2 = { ...$s1, "sb": it, $index: i };
                            return (<React.Fragment key={i}>
                              <span className={"a-pulse"} {...S($s2?.sb)} />
                            </React.Fragment>);
                          })}
                          {$s1?.c?.hasMore ? (<>
                            <span {...S(`padding-left: 7px; font-size: 12px; font-weight: 500; color: ${I($s1?.t?.mutedFg)}`)}>
                              {T($s1?.c?.more)}
                            </span>
                          </>) : null}
                        </>) : null}
                        {$s1?.mob ? (<>
                          <span className={$s1?.dotCls} {...S("display: flex; gap: 3px; justify-content: center")}>
                            {A($s1?.c?.dots).map((it, i) => {
                              const $s2 = { ...$s1, "dt": it, $index: i };
                              return (<React.Fragment key={i}>
                                <span {...S(`width: 6px; height: 6px; border-radius: 3px; background: ${I($s2?.dt)}`)} />
                              </React.Fragment>);
                            })}
                          </span>
                        </>) : null}
                      </button>
                    </React.Fragment>);
                  })}
                  {$s0?.showHint ? (<>
                    <div {...S("position: absolute; top: 0; right: 0; bottom: 0; left: 0; display: flex; align-items: center; justify-content: center; padding: 24px; box-sizing: border-box; pointer-events: none")}>
                      <div className={"a-pop"} {...S(`pointer-events: auto; width: 420px; max-width: 100%; ${I($s0?.k?.card)}; box-shadow: ${I($s0?.t?.shPop)}`)}>
                        <div className={"a-fade"} {...S("display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 28px 28px; box-sizing: border-box; text-align: center")}>
                          <span {...S(`display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.emptyBlk?.tileBg)}; color: ${I($s0?.emptyBlk?.tileFg)}`)}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={$s0?.emptyBlk?.icon} />
                            </svg>
                          </span>
                          <div {...S("display: flex; flex-direction: column; align-items: center; gap: 4px; max-width: 380px")}>
                            <span {...S("font-size: 15px; font-weight: 600")}>
                              {T($s0?.emptyBlk?.title)}
                            </span>
                            {$s0?.emptyBlk?.hasSub ? (<>
                              <span {...S(`font-size: 13px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}`)}>
                                {T($s0?.emptyBlk?.sub)}
                              </span>
                            </>) : null}
                          </div>
                          {$s0?.emptyBlk?.hasCta ? (<>
                            <div {...S("display: flex; flex-wrap: wrap; justify-content: center; gap: 8px")}>
                              <button type={"button"} className={"tb tp"} onClick={$s0?.emptyBlk?.act} {...S(`${I($s0?.k?.pSm)}; height: ${I($s0?.stH)}; flex-shrink: 0`)}>
                                {T($s0?.emptyBlk?.cta)}
                              </button>
                              {$s0?.emptyBlk?.has2 ? (<>
                                <button type={"button"} className={"tb tg"} onClick={$s0?.emptyBlk?.act2} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.oSm)}; height: ${I($s0?.stH)}`)}>
                                  {T($s0?.emptyBlk?.cta2)}
                                </button>
                              </>) : null}
                            </div>
                          </>) : null}
                        </div>
                      </div>
                    </div>
                  </>) : null}
                </div>
              </>) : null}
              {$s0?.isAgenda ? (<>
                <div className={"a-fade"} {...S("display: flex; flex-direction: column")}>
                  {A($s0?.agenda).map((it, i) => {
                    const $s1 = { ...$s0, "dd": it, $index: i };
                    return (<React.Fragment key={i}>
                      <button type={"button"} className={"tr"} onClick={$s1?.dd?.pick} aria-pressed={$s1?.dd?.sel} {...S(`--hvr: ${I($s1?.t?.hvr)}; display: flex; align-items: flex-start; gap: ${I($s1?.agGap)}; width: 100%; padding: ${I($s1?.agPad)}; box-sizing: border-box; border: none; border-bottom: ${I($s1?.dd?.line)}; background: ${I($s1?.dd?.bg)}; font: inherit; color: inherit; text-align: left; cursor: pointer`)}>
                        <span {...S("width: 40px; flex: 0 0 40px; display: flex; flex-direction: column; align-items: center; gap: 4px")}>
                          <span {...S(`font-size: 12px; font-weight: 500; color: ${I($s1?.t?.mutedFg)}`)}>
                            {T($s1?.dd?.wd)}
                          </span>
                          <span {...S(`width: 32px; height: 32px; border-radius: 16px; background: ${I($s1?.dd?.numBg)}; color: ${I($s1?.dd?.numFg)}; font-size: 16px; font-weight: 600; line-height: 32px; text-align: center; font-variant-numeric: tabular-nums`)}>
                            {T($s1?.dd?.num)}
                          </span>
                        </span>
                        <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 8px; padding-top: 6px")}>
                          {$s1?.dd?.none ? (<>
                            <span {...S(`color: ${I($s1?.t?.mutedFg)}; padding-top: 2px`)}>
                              {"Nothing scheduled today"}
                            </span>
                          </>) : null}
                          {A($s1?.dd?.events).map((it, i) => {
                            const $s2 = { ...$s1, "e": it, $index: i };
                            return (<React.Fragment key={i}>
                              {$s2?.mob ? (<>
                                <span {...S("display: flex; align-items: center; gap: 10px; min-width: 0; min-height: 36px")}>
                                  <span {...S(`width: 8px; height: 8px; flex: 0 0 8px; border-radius: 3px; background: ${I($s2?.e?.sw)}`)} />
                                  <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                                    <span {...S(`font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: ${I($s2?.e?.titleFg)}`)}>
                                      {T($s2?.e?.title)}
                                    </span>
                                    <span {...S(`font-size: 12px; white-space: nowrap; color: ${I($s2?.e?.fg2)}`)}>
                                      {T($s2?.e?.sub)}
                                    </span>
                                  </span>
                                  <span {...S(`flex: 0 0 auto; font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums; color: ${I($s2?.e?.amtFg)}`)}>
                                    {T($s2?.e?.amount)}
                                  </span>
                                </span>
                              </>) : null}
                              {$s2?.notMob ? (<>
                                <span {...S("display: flex; align-items: center; gap: 10px; min-width: 0; min-height: 28px")}>
                                  <span {...S(`display: inline-flex; align-items: center; height: 22px; padding: 0 8px; box-sizing: border-box; border-radius: ${I($s2?.t?.rEv)}; background: ${I($s2?.e?.bg)}; color: ${I($s2?.e?.fg)}; font-size: 12px; font-weight: 500; white-space: nowrap; flex: 0 0 auto`)}>
                                    {T($s2?.e?.type)}
                                  </span>
                                  <span {...S(`flex: 1 1 auto; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: ${I($s2?.e?.titleFg)}`)}>
                                    {T($s2?.e?.title)}
                                  </span>
                                  {$s2?.e?.done ? (<>
                                    <span {...S(`display: inline-flex; align-items: center; gap: 4px; flex: 0 0 auto; color: ${I($s2?.t?.mutedFg)}; font-size: 13px`)}>
                                      <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                        <path d={"M20 6 9 17l-5-5"} />
                                      </svg>
                                      {"Done"}
                                    </span>
                                  </>) : null}
                                  <span {...S(`flex: 0 0 auto; font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums; color: ${I($s2?.e?.amtFg)}`)}>
                                    {T($s2?.e?.amount)}
                                  </span>
                                </span>
                              </>) : null}
                            </React.Fragment>);
                          })}
                        </span>
                      </button>
                    </React.Fragment>);
                  })}
                  {A($s0?.agSkel).map((it, i) => {
                    const $s1 = { ...$s0, "r": it, $index: i };
                    return (<React.Fragment key={i}>
                      <div {...S(`display: flex; align-items: flex-start; gap: 16px; padding: 14px 16px; border-bottom: ${I($s1?.r?.line)}`)}>
                        <span {...S("width: 40px; flex: 0 0 40px; display: flex; flex-direction: column; align-items: center; gap: 6px")}>
                          <span className={"a-pulse"} {...S($s1?.skWd)} />
                          <span className={"a-pulse"} {...S($s1?.skNum)} />
                        </span>
                        <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 8px; padding-top: 6px")}>
                          {A($s1?.r?.lines).map((it, i) => {
                            const $s2 = { ...$s1, "ln": it, $index: i };
                            return (<React.Fragment key={i}>
                              <span {...S("display: flex; align-items: center; gap: 10px; min-height: 28px")}>
                                <span className={"a-pulse"} {...S($s2?.skPill)} />
                                <span className={"a-pulse"} {...S($s2?.ln)} />
                              </span>
                            </React.Fragment>);
                          })}
                        </span>
                      </div>
                    </React.Fragment>);
                  })}
                  {$s0?.agEmpty ? (<>
                    <div className={"a-fade"} {...S("display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 56px 24px; box-sizing: border-box; text-align: center")}>
                      <span {...S(`display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.emptyBlk?.tileBg)}; color: ${I($s0?.emptyBlk?.tileFg)}`)}>
                        <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={$s0?.emptyBlk?.icon} />
                        </svg>
                      </span>
                      <div {...S("display: flex; flex-direction: column; align-items: center; gap: 4px; max-width: 380px")}>
                        <span {...S("font-size: 15px; font-weight: 600")}>
                          {T($s0?.emptyBlk?.title)}
                        </span>
                        {$s0?.emptyBlk?.hasSub ? (<>
                          <span {...S(`font-size: 13px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}`)}>
                            {T($s0?.emptyBlk?.sub)}
                          </span>
                        </>) : null}
                      </div>
                      {$s0?.emptyBlk?.hasCta ? (<>
                        <div {...S("display: flex; flex-wrap: wrap; justify-content: center; gap: 8px")}>
                          <button type={"button"} className={"tb tp"} onClick={$s0?.emptyBlk?.act} {...S(`${I($s0?.k?.pSm)}; height: ${I($s0?.stH)}; flex-shrink: 0`)}>
                            {T($s0?.emptyBlk?.cta)}
                          </button>
                          {$s0?.emptyBlk?.has2 ? (<>
                            <button type={"button"} className={"tb tg"} onClick={$s0?.emptyBlk?.act2} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.oSm)}; height: ${I($s0?.stH)}`)}>
                              {T($s0?.emptyBlk?.cta2)}
                            </button>
                          </>) : null}
                        </div>
                      </>) : null}
                    </div>
                  </>) : null}
                </div>
              </>) : null}
            </section>
          </>) : null}
          {$s0?.isError ? (<>
            <section className={"a-in"} {...S(`animation-delay: 0.05s; min-width: 0; ${I($s0?.k?.card)}`)}>
              <div className={"a-fade"} {...S("display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 72px 24px; box-sizing: border-box; text-align: center")}>
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
          {$s0?.showDayCard ? (<>
            <section className={"a-in"} aria-label={$s0?.dc?.title} {...S(`animation-delay: 0.08s; min-width: 0; overflow: hidden; ${I($s0?.k?.card)}`)}>
              <div {...S("display: flex; align-items: center; gap: 12px; padding: 14px 12px 12px 16px")}>
                <span {...S(`width: 40px; height: 40px; flex: 0 0 40px; box-sizing: border-box; border-radius: ${I($s0?.t?.rSm)}; background: ${I($s0?.dc?.badgeBg)}; color: ${I($s0?.dc?.badgeFg)}; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.05`)}>
                  <span {...S("font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.75")}>
                    {T($s0?.dc?.mon)}
                  </span>
                  <span {...S(`font-family: ${I($s0?.numFam)}; font-size: 16px; font-weight: 600; font-variant-numeric: tabular-nums`)}>
                    {T($s0?.dc?.day)}
                  </span>
                </span>
                <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 1px")}>
                  <span {...S("display: flex; align-items: center; gap: 8px; min-width: 0")}>
                    <span {...S("font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                      {T($s0?.dc?.short)}
                    </span>
                    {$s0?.dc?.today ? (<>
                      <span {...S(`display: inline-flex; align-items: center; height: 20px; padding: 0 7px; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.primary)}; color: ${I($s0?.t?.primaryFg)}; font-size: 11px; font-weight: 600; flex: 0 0 auto`)}>
                        {"Today"}
                      </span>
                    </>) : null}
                  </span>
                  {$s0?.dc?.hasSub ? (<>
                    <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}`)}>
                      {T($s0?.dc?.sub)}
                    </span>
                  </>) : null}
                  {$s0?.dc?.skel ? (<>
                    <span className={"a-pulse"} {...S($s0?.skDaySub)} />
                  </>) : null}
                </span>
                <button className={"tb tg"} type={"button"} onClick={$s0?.addSel} aria-label={$s0?.dc?.addLabel} {...S(`${I($s0?.k?.btnO)}; height: 36px`)}>
                  <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M5 12h14M12 5v14"} />
                  </svg>
                  <span>
                    {"Add"}
                  </span>
                </button>
              </div>
              <div {...S("padding: 0 12px 12px")}>
                {$s0?.dc?.none ? (<>
                  <div {...S(`padding: 16px 14px; text-align: center; color: ${I($s0?.t?.mutedFg)}; ${I($s0?.k?.tile)}`)}>
                    {"Nothing on this day yet."}
                  </div>
                </>) : null}
                {$s0?.dc?.any ? (<>
                  <div {...S($s0?.k?.group)}>
                    {A($s0?.dc?.events).map((it, i) => {
                      const $s1 = { ...$s0, "e": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div className={$s1?.e?.cls} {...S($s1?.e?.rowStyle)}>
                          {$s1?.e?.isDel ? (<>
                            <button className={"tb"} type={"button"} role={"checkbox"} aria-checked={$s1?.e?.done} aria-label={$s1?.e?.aria} onClick={$s1?.e?.toggle} {...S($s1?.e?.box)}>
                              {$s1?.e?.done ? (<>
                                <svg className={"a-check"} width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                  <path d={"M20 6 9 17l-5-5"} />
                                </svg>
                              </>) : null}
                            </button>
                          </>) : null}
                          {$s1?.e?.isDot ? (<>
                            <span {...S(`width: ${I($s1?.e?.dotBox)}; height: 16px; flex: 0 0 ${I($s1?.e?.dotBox)}; display: inline-flex; align-items: center; justify-content: center`)}>
                              <span {...S(`width: 8px; height: 8px; border-radius: 3px; background: ${I($s1?.e?.sw)}`)} />
                            </span>
                          </>) : null}
                          <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 3px")}>
                            <span {...S(`font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: ${I($s1?.e?.titleFg)}; transition: color 0.2s ease`)}>
                              {T($s1?.e?.title)}
                            </span>
                            <span {...S(`font-size: 12px; color: ${I($s1?.e?.fg2)}; white-space: nowrap`)}>
                              {T($s1?.e?.sub)}
                            </span>
                          </span>
                          <span {...S(`font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums; color: ${I($s1?.e?.amtFg)}`)}>
                            {T($s1?.e?.amount)}
                          </span>
                        </div>
                      </React.Fragment>);
                    })}
                  </div>
                </>) : null}
                {$s0?.dc?.skel ? (<>
                  <div {...S($s0?.k?.group)}>
                    {A($s0?.skRows).map((it, i) => {
                      const $s1 = { ...$s0, "sr": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div {...S($s1?.sr?.rowStyle)}>
                          <span className={"a-pulse"} {...S($s1?.skBox)} />
                          <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 7px")}>
                            <span className={"a-pulse"} {...S($s1?.sr?.w1)} />
                            <span className={"a-pulse"} {...S($s1?.sr?.w2)} />
                          </span>
                        </div>
                      </React.Fragment>);
                    })}
                  </div>
                </>) : null}
              </div>
            </section>
          </>) : null}
          {$s0?.showMobHint ? (<>
            <section className={"a-in"} {...S(`animation-delay: 0.08s; min-width: 0; ${I($s0?.k?.card)}`)}>
              <div className={"a-fade"} {...S("display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 32px 20px; box-sizing: border-box; text-align: center")}>
                <span {...S(`display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.emptyBlk?.tileBg)}; color: ${I($s0?.emptyBlk?.tileFg)}`)}>
                  <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={$s0?.emptyBlk?.icon} />
                  </svg>
                </span>
                <div {...S("display: flex; flex-direction: column; align-items: center; gap: 4px; max-width: 380px")}>
                  <span {...S("font-size: 15px; font-weight: 600")}>
                    {T($s0?.emptyBlk?.title)}
                  </span>
                  {$s0?.emptyBlk?.hasSub ? (<>
                    <span {...S(`font-size: 13px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}`)}>
                      {T($s0?.emptyBlk?.sub)}
                    </span>
                  </>) : null}
                </div>
                {$s0?.emptyBlk?.hasCta ? (<>
                  <div {...S("display: flex; flex-wrap: wrap; justify-content: center; gap: 8px")}>
                    <button type={"button"} className={"tb tp"} onClick={$s0?.emptyBlk?.act} {...S(`${I($s0?.k?.pSm)}; height: ${I($s0?.stH)}; flex-shrink: 0`)}>
                      {T($s0?.emptyBlk?.cta)}
                    </button>
                    {$s0?.emptyBlk?.has2 ? (<>
                      <button type={"button"} className={"tb tg"} onClick={$s0?.emptyBlk?.act2} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.oSm)}; height: ${I($s0?.stH)}`)}>
                        {T($s0?.emptyBlk?.cta2)}
                      </button>
                    </>) : null}
                  </div>
                </>) : null}
              </div>
            </section>
          </>) : null}
        </main>
        {$s0?.pvOpen ? (<>
          <div onClick={$s0?.closeDay} className={"a-fade"} {...S(`position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 64; background: ${I($s0?.pvShade)}`)} />
          <div role={"dialog"} aria-label={$s0?.pv?.title} className={$s0?.pvAnim} {...S(`position: fixed; top: ${I($s0?.pvTop)}; left: ${I($s0?.pvLeft)}; right: ${I($s0?.pvRight)}; bottom: ${I($s0?.pvBottom)}; z-index: 65; width: ${I($s0?.pvW)}; max-height: ${I($s0?.pvMaxH)}; box-sizing: border-box; display: flex; flex-direction: column; background: ${I($s0?.t?.card)}; color: ${I($s0?.t?.fg)}; border: 1px solid ${I($s0?.t?.border)}; border-radius: ${I($s0?.pvRadius)}; box-shadow: ${I($s0?.t?.shPop)}; overflow: hidden`)}>
            {$s0?.mob ? (<>
              <span aria-hidden={"true"} {...S(`display: block; flex: 0 0 auto; width: 36px; height: 4px; margin: 8px auto 0; border-radius: 2px; background: ${I($s0?.t?.borderStrong)}`)} />
            </>) : null}
            <div {...S("display: flex; align-items: center; gap: 12px; padding: 14px 10px 12px 16px")}>
              <span {...S(`width: 40px; height: 40px; flex: 0 0 40px; box-sizing: border-box; border-radius: ${I($s0?.t?.rSm)}; background: ${I($s0?.pv?.badgeBg)}; color: ${I($s0?.pv?.badgeFg)}; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.05`)}>
                <span {...S("font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.75")}>
                  {T($s0?.pv?.mon)}
                </span>
                <span {...S(`font-family: ${I($s0?.numFam)}; font-size: 16px; font-weight: 600; font-variant-numeric: tabular-nums`)}>
                  {T($s0?.pv?.day)}
                </span>
              </span>
              <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 1px")}>
                <span {...S("display: flex; align-items: center; gap: 8px; min-width: 0")}>
                  <span {...S("font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                    {T($s0?.pv?.title)}
                  </span>
                  {$s0?.pv?.today ? (<>
                    <span {...S(`display: inline-flex; align-items: center; height: 20px; padding: 0 7px; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.primary)}; color: ${I($s0?.t?.primaryFg)}; font-size: 11px; font-weight: 600; flex: 0 0 auto`)}>
                      {"Today"}
                    </span>
                  </>) : null}
                </span>
                <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}`)}>
                  {T($s0?.pv?.sub)}
                </span>
              </span>
              <button className={"tb tg"} type={"button"} onClick={$s0?.closeDay} aria-label={"Close"} {...S($s0?.k?.ico)}>
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M18 6 6 18M6 6l12 12"} />
                </svg>
              </button>
            </div>
            <div {...S("flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 0 12px 12px")}>
              {$s0?.pv?.none ? (<>
                <div {...S(`padding: 16px 14px; text-align: center; color: ${I($s0?.t?.mutedFg)}; ${I($s0?.k?.tile)}`)}>
                  {"Nothing on this day yet."}
                </div>
              </>) : null}
              {$s0?.pv?.any ? (<>
                <div {...S($s0?.k?.group)}>
                  {A($s0?.pv?.events).map((it, i) => {
                    const $s1 = { ...$s0, "e": it, $index: i };
                    return (<React.Fragment key={i}>
                      <div className={$s1?.e?.cls} {...S($s1?.e?.rowStyle)}>
                        {$s1?.e?.isDel ? (<>
                          <button className={"tb"} type={"button"} role={"checkbox"} aria-checked={$s1?.e?.done} aria-label={$s1?.e?.aria} onClick={$s1?.e?.toggle} {...S($s1?.e?.box)}>
                            {$s1?.e?.done ? (<>
                              <svg className={"a-check"} width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={"M20 6 9 17l-5-5"} />
                              </svg>
                            </>) : null}
                          </button>
                        </>) : null}
                        {$s1?.e?.isDot ? (<>
                          <span {...S(`width: ${I($s1?.e?.dotBox)}; height: 16px; flex: 0 0 ${I($s1?.e?.dotBox)}; display: inline-flex; align-items: center; justify-content: center`)}>
                            <span {...S(`width: 8px; height: 8px; border-radius: 3px; background: ${I($s1?.e?.sw)}`)} />
                          </span>
                        </>) : null}
                        <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 3px")}>
                          <span {...S(`font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: ${I($s1?.e?.titleFg)}; transition: color 0.2s ease`)}>
                            {T($s1?.e?.title)}
                          </span>
                          <span {...S(`font-size: 12px; color: ${I($s1?.e?.fg2)}; white-space: nowrap`)}>
                            {T($s1?.e?.sub)}
                          </span>
                        </span>
                        <span {...S(`font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums; color: ${I($s1?.e?.amtFg)}`)}>
                          {T($s1?.e?.amount)}
                        </span>
                      </div>
                    </React.Fragment>);
                  })}
                </div>
              </>) : null}
              {$s0?.pv?.skel ? (<>
                <div {...S($s0?.k?.group)}>
                  {A($s0?.skRows).map((it, i) => {
                    const $s1 = { ...$s0, "sr": it, $index: i };
                    return (<React.Fragment key={i}>
                      <div {...S($s1?.sr?.rowStyle)}>
                        <span className={"a-pulse"} {...S($s1?.skBox)} />
                        <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 7px")}>
                          <span className={"a-pulse"} {...S($s1?.sr?.w1)} />
                          <span className={"a-pulse"} {...S($s1?.sr?.w2)} />
                        </span>
                      </div>
                    </React.Fragment>);
                  })}
                </div>
              </>) : null}
            </div>
            <div {...S(`display: flex; flex-direction: column; gap: 10px; padding: ${I($s0?.footPad)}; border-top: 1px solid ${I($s0?.t?.line)}; background: ${I($s0?.t?.foot)}`)}>
              <div role={"tablist"} aria-label={"Type"} {...S(`display: flex; width: 100%; ${I($s0?.k?.tabs)}`)}>
                {A($s0?.addTypes).map((it, i) => {
                  const $s1 = { ...$s0, "a": it, $index: i };
                  return (<React.Fragment key={i}>
                    <button className={"tb tt"} type={"button"} role={"tab"} aria-selected={$s1?.a?.on} onClick={$s1?.a?.pick} {...S(`flex: 1 1 0; ${I($s1?.a?.style)}`)}>
                      <span {...S(`width: 8px; height: 8px; border-radius: 3px; background: ${I($s1?.a?.sw)}`)} />
                      {T($s1?.a?.label)}
                    </button>
                  </React.Fragment>);
                })}
              </div>
              <div {...S("display: flex; gap: 8px")}>
                <input className={"ti"} aria-label={"What is it"} placeholder={$s0?.addPh} value={V0($s0?.draft, "")} onChange={$s0?.setDraft} onKeyDown={$s0?.draftKey} {...S($s0?.k?.input, $s0?.inputRef)} />
                {$s0?.isPayType ? (<>
                  <span className={"ti"} {...S(`display: flex; align-items: center; gap: 4px; flex: 0 0 104px; width: 104px; min-width: 0; height: 36px; padding: 0 12px; box-sizing: border-box; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.fill)}`)}>
                    <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                      {"$"}
                    </span>
                    <input aria-label={"Amount"} placeholder={"0"} inputMode={"decimal"} value={V0($s0?.amt, "")} onChange={$s0?.setAmt} onKeyDown={$s0?.draftKey} {...S(`flex: 1 1 auto; min-width: 0; width: 100%; height: 34px; border: none; outline: none; background: transparent; font: inherit; font-size: 14px; color: ${I($s0?.t?.fg)}; padding: 0`)} />
                  </span>
                </>) : null}
                <button className={"tb tp"} type={"button"} onClick={$s0?.addItem} aria-disabled={$s0?.noDraft} {...S(`opacity: ${I($s0?.addOp)}; height: 36px; ${I($s0?.k?.btnP)}; height: ${I($s0?.addH)}`)}>
                  {"Add"}
                </button>
              </div>
            </div>
          </div>
        </>) : null}
        {$s0?.drawerOpen ? (<>
          <div {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 88")}>
            <button type={"button"} aria-label={"Close menu"} className={"a-fade"} onClick={$s0?.closeNav} {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; padding: 0; border: none; background: ${I($s0?.t?.overlay)}; cursor: default`)} />
            <div className={"a-drawer"} {...S(`position: absolute; top: 0; bottom: 0; left: 0; width: 288px; max-width: 86%; overflow-y: auto; box-shadow: ${I($s0?.t?.shPop)}`)}>
              <SSidebar active={"calendar"} color={$s0?.eff} dark={$s0?.dark} drawer={true} plan={$s0?.plan} fresh={$s0?.sbFresh} onClose={$s0?.closeNav} />
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

export const meta = {"props":{"color":{"editor":"enum","options":["studio","sand","mac","stationery","editorial"],"default":"studio"},"dark":{"editor":"boolean","default":false},"view":{"editor":"enum","options":["sample","empty","loading","error"],"default":"sample"},"plan":{"editor":"enum","options":["active","trial","pastdue","canceled","readonly"],"default":"active"},"failSave":{"editor":"boolean","default":false}},"preview":{"width":1440,"height":960}};
export default $r.defineBoard("SCalendar", Component, render, CSS, meta);
