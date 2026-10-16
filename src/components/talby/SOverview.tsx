// @ts-nocheck
/* eslint-disable */
'use client';
// SOverview: converted from design-source/boards/SOverview.dc.html.
// Markup, inline styles and logic are carried over exactly from the board.
// The logic class below is the board's own code, unchanged.
import * as React from 'react';
import * as $r from './_runtime';
import { DCLogic } from './_runtime';
import { SAMPLE_OVERVIEW, TalbyDates, SAMPLE_ACCOUNT } from './_data';
import SSidebar from './SSidebar';
import STopbar from './STopbar';
import SDatePicker from './SDatePicker';
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
    }, { tab: 'active', resolved: {}, leaving: {}, paidNow: {}, todos: ((props.data && props.data.todos) || SAMPLE_OVERVIEW.todos).map(function (x) { return Object.assign({}, x); }), ticking: {}, todoDraft: '' });
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
    if (prev.data !== p.data && p.data && p.data.todos) this.setState({ todos: p.data.todos.map(function (x) { return Object.assign({}, x); }), paidNow: {}, resolved: {}, leaving: {} });
  }
  retryLoad() {
    var self = this; clearTimeout(this._rt);
    this.setState({ dv: 'loading' });
    if (typeof this.props.onAction === 'function') {
      Promise.resolve().then(function () { return self.props.onAction('data.reload', {}); })
        .then(function (ok) { if (ok === false) throw new Error('reload'); if (self.state.dv === 'loading') self.setState({ dv: self.props.view === 'error' || !self.props.view ? 'sample' : self.props.view }); })
        .catch(function () { self.setState({ dv: 'error' }); });
      return;
    }
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
    this.emit('look.update', L, 'Could not save your look');
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

  write(title, fn) {
    var self = this;
    if (!this.guard()) return false;
    if (this.props.writes === 'fail') { this.toastErr(title, 'Check your connection and try again.', function () { if (self.guard()) fn(); }); return false; }
    this._wt = title; try { fn(); } finally { this._wt = null; } return true;
  }
  resolve(id, after) {
    var self = this, lv = Object.assign({}, this.state.leaving); lv[id] = true;
    this.setState({ leaving: lv });
    this._tt = this._tt || [];
    this._tt.push(setTimeout(function () { var rs = Object.assign({}, self.state.resolved); rs[id] = true; self.setState({ resolved: rs }); if (after) after(); }, 340));
  }
  tickTodo(id) {
    var self = this, tk = Object.assign({}, this.state.ticking); tk[id] = true;
    this.setState({ ticking: tk });
    this._tt = this._tt || [];
    this._tt.push(setTimeout(function () {
      var left = self.state.todos.filter(function (x) { return x.id !== id && !x.done; });
      self.setState({ todos: self.state.todos.map(function (x) { return x.id === id ? Object.assign({}, x, { done: true }) : x; }) });
      if (!left.length) self.celebrate({ title: 'All caught up', line: 'Every to-do is done. Nothing left on your list.' });
    }, 900));
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
    var ACC = p.account || SAMPLE_ACCOUNT;
    // Real data comes in as props.data (see _data.ts). Without it the board shows its design sample.
    var DATA = (p.data && typeof p.data === 'object') ? p.data : SAMPLE_OVERVIEW, isDemo = DATA === SAMPLE_OVERVIEW, TODAY = DATA.today;
    var DD = TalbyDates;
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

    var D = DATA.deals.map(function (d) { return st.paidNow[d[0]] ? [d[0], 'paid', TODAY, d[3]] : d; });
    var OVER = DATA.overdue, LATE = {};
    OVER.forEach(function (o) { LATE[o[0]] = DD.diff(o[2], TODAY); });
    var paidSum = OVER.filter(function (o) { return st.paidNow[o[0]]; }).reduce(function (a, o) { return a + o[1]; }, 0);
    var lateLeft = OVER.filter(function (o) { return !st.paidNow[o[0]]; });
    var lateSum = lateLeft.reduce(function (a, o) { return a + o[1]; }, 0);
    var NEED = DATA.needsPayBy[0], NOD = DATA.noPayBy;
    var ATT = OVER.map(function (o) { return { id: 'pay:' + o[0], kind: 'pay', brand: o[0], amt: o[1] }; })
      .concat(NEED ? [{ id: 'date:' + NEED.brand, kind: 'date', brand: NEED.brand, live: NEED.liveOn }] : [])
      .concat(NOD && NOD.count > 0 ? [{ id: 'nodate', kind: 'link' }] : [])
      .filter(function (a) { return isSample && !st.resolved[a.id]; });
    var attn = ATT.map(function (a) {
      var wrapRow = mob && a.kind !== 'pay';
      var base = { cls: st.leaving[a.id] ? 'a-out' : 'a-in', isPay: false, isDate: false, isLink: false, isLetter: false, isIcon: true, l: '', icon: '', paid: null, paidLabel: '', setDate: null, subFg: t.mutedFg,
        wrap: wrapRow ? '; flex-wrap: wrap; row-gap: 10px' : '', tFlex: wrapRow ? '1 1 calc(100% - 46px)' : '1 1 auto', ml: wrapRow ? '46px' : '0px', dw: wrapRow ? '156px' : '132px' };
      if (a.kind === 'pay') return Object.assign(base, { isPay: true, isLetter: true, isIcon: false, l: a.brand.charAt(0), avBg: t.badBg, avFg: t.badFg, title: a.brand + ' payment is late', sub: fmt(a.amt) + ', ' + LATE[a.brand] + (LATE[a.brand] === 1 ? ' day' : ' days') + ' past due', subFg: t.destr,
        paidLabel: 'Mark ' + a.brand + ' as paid',
        paid: function () { self.write('Could not mark it paid', function () { self.emit('payment.markPaid', { brand: a.brand, amount: a.amt }); self.resolve(a.id, function () { var pn = Object.assign({}, self.state.paidNow); pn[a.brand] = true; self.setState({ paidNow: pn }); var got = DATA.received.amount + OVER.filter(function (o) { return pn[o[0]]; }).reduce(function (s, o) { return s + o[1]; }, 0); self.celebrate({ title: 'You got paid', chip: '+' + fmt(a.amt), line: a.brand + ' paid. ' + fmt(got) + ' received this year.' }); }); }); } });
      if (a.kind === 'date') return Object.assign(base, { isDate: true, avBg: t.postBg, avFg: t.postFg, icon: 'm16 13 5.22 3.48a.5.5 0 0 0 .78-.42V7.94a.5.5 0 0 0-.78-.42L16 11M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z', title: a.brand + ' went live ' + md(a.live), sub: 'Add a pay by date so Talby can remind you', dateLabel: a.brand + ' pay by date',
        setDate: function (v) { if (!v) return; self.write('Could not add the date', function () { self.emit('deal.setPayBy', { brand: a.brand, date: v }); self.resolve(a.id); self.toast('Pay by date added', a.brand + ', ' + md(v) + '. Talby will remind you.'); }); } });
      return Object.assign(base, { isLink: true, avBg: t.fill, avFg: t.fg, icon: 'M8 2v4M16 2v4M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM3 10h18M10 14h4', title: NOD.count + (NEED ? ' more' : '') + (NOD.count === 1 ? ' deal has no pay by date' : ' deals have no pay by date'), sub: fmt(NOD.amount) + ' Talby cannot remind you about yet' });
    });
    function inTab(d, tb) { if (tb === 'active') return d[1] !== 'paid' && d[1] !== 'neg'; if (tb === 'paid') return d[1] === 'paid'; return true; }
    var list = D.filter(function (d) { return inTab(d, st.tab); });
    var shown = isSample ? list.slice(0, mob ? 4 : 7) : [];
    var rows = shown.map(function (d, i) {
      var key = d[1] === 'neg' ? 'not' : d[1];
      var sub = d[1] === 'over' ? (LATE[d[0]] + ' days late, due ' + md(d[2])) : d[1] === 'paid' ? ('Paid' + (d[2] ? ' ' + md(d[2]) : '')) : d[1] === 'neg' ? 'Negotiating' : (d[2] ? 'Pay by ' + md(d[2]) : 'No pay by date');
      return { brand: d[0], l: d[0].charAt(0), sub: sub, subFg: d[1] === 'over' ? t.destr : t.mutedFg, pay: payIcon(key), amount: fmt(d[3]), delay: (0.18 + i * 0.03).toFixed(2) + 's' };
    });
    var TABS = [['active', 'Active'], ['paid', 'Paid'], ['all', 'All']];
    var tabs = TABS.map(function (x) { var on = st.tab === x[0]; return { label: x[1], on: on, count: isSample ? String(D.filter(function (d) { return inTab(d, x[0]); }).length) : '', style: tabStyle(t, on), pick: function () { self.setState({ tab: x[0] }); } }; });
    var WK0 = DD.num(TODAY) - DD.weekday(TODAY), WDOT = {};
    DATA.week.forEach(function (x) { WDOT[x.date] = 1; });
    var W = [0, 1, 2, 3, 4, 5, 6].map(function (i) { var iso = DD.iso(WK0 + i); return ['SMTWTFS'.charAt(i), +iso.slice(8, 10), (iso === TODAY ? 'Today' : DD.DAYS[i]) + ', ' + md(iso), WDOT[iso] ? 1 : 0, iso]; });
    var week = W.map(function (d) { var today = d[4] === TODAY; return { wd: d[0], num: String(d[1]), aria: d[2], bg: today ? t.primary : 'transparent', hv: today ? t.primary : t.fill, fg: today ? t.primaryFg : t.fg, wdFg: today ? t.primaryFg : t.mutedFg, dot: d[3] && isSample ? (today ? t.primaryFg : t.borderStrong) : 'transparent' }; });
    var weekItems = !isSample ? [] : DATA.week.map(function (x) {
      var day = DD.DAYS[DD.weekday(x.date)].slice(0, 3), amt = x.amount ? fmt(x.amount) : '';
      var paid = x.kind === 'paid' || (x.kind === 'late' && !!st.paidNow[x.brand || '']);
      if (x.kind === 'late' || x.kind === 'paid') return { day: day, bg: paid ? t.okBg : t.badBg, fg: paid ? t.okFg : t.badFg, type: paid ? 'Paid' : 'Late', title: x.title, titleFg: t.fg, amount: amt, amtFg: paid ? t.fg : t.destr };
      return { day: day, bg: t.postBg, fg: t.postFg, type: x.kind === 'posted' ? 'Posted' : 'Post', title: x.title, titleFg: x.kind === 'posted' ? t.mutedFg : t.fg, amount: amt, amtFg: t.fg };
    });
    var UP = DATA.upcoming.map(function (u) { var n = DD.diff(TODAY, u[1]); return [u[0], u[1], u[2], n <= 0 ? 'Today' : n === 1 ? 'Tomorrow' : 'In ' + n + ' days']; });
    var upSum = DATA.upcoming.reduce(function (a, u) { return a + u[2]; }, 0);
    var weekHint = (function () { var u = DATA.upcoming[0]; if (!u) return ''; var wk = Math.floor((DD.num(u[1]) - WK0) / 7), what = u[0] + ' pays ' + fmt(u[2]) + ' on ';
      return wk <= 0 ? 'This week, ' + what + DD.DAYS[DD.weekday(u[1])] : wk === 1 ? 'Next week, ' + what + DD.DAYS[DD.weekday(u[1])] : what + md(u[1]); })();
    var upcoming = (isSample ? UP : []).map(function (u, j) { return { brand: u[0], mon: MS[+u[1].slice(5, 7) - 1], day: String(+u[1].slice(8)), amount: fmt(u[2]), when: u[3], whenFg: j === 0 ? t.fg : t.mutedFg, line: j ? ('1px solid ' + t.line) : 'none' }; });
    var openTodos = st.todos.filter(function (x) { return !x.done && (isSample || (isEmpty && x.id > 1)); });
    var todos = openTodos.map(function (x) { var tk = !!st.ticking[x.id]; return { text: x.text, deal: x.deal, dealL: x.deal.charAt(0), on: tk, box: box(t, tk), aria: 'Mark done: ' + x.text, fg: tk ? t.mutedFg : t.fg,
      strike: tk ? 'a-strike' : '', size: tk ? '100% 1.5px' : '0% 1.5px', cls: tk ? 'a-gone' : 'a-in', toggle: function () { if (!self.state.ticking[x.id]) self.write('Could not update the to-do', function () { self.emit('todo.setDone', { id: x.id, done: true }); self.tickTodo(x.id); }); } }; });
    function addTodo() { var tx = (st.todoDraft || '').trim(); if (!tx) return; self.write('Could not add the to-do', function () { var cur = self.state.todos; var id = cur.reduce(function (a, x) { return Math.max(a, x.id); }, 0) + 1; self.setState({ todos: cur.concat([{ id: id, text: tx, deal: 'No deal', done: false }]), todoDraft: '' }); self.emit('todo.create', { text: tx, deal: '' }); self.toast('To-do added', tx); }); }
    var owed = DATA.owed.amount - paidSum, got = DATA.received.amount + paidSum;
    var stats = [
      { label: 'Booked this year', value: fmt(DATA.booked.amount), line: 'Across ' + DATA.booked.deals + (DATA.booked.deals === 1 ? ' signed deal' : ' signed deals'), href: 'SDeals.dc.html', fg: t.fg, warn: false },
      { label: 'Received', value: fmt(got), line: (function (n) { return n + (n === 1 ? ' payment' : ' payments') + ' this year'; })(DATA.received.count + Object.keys(st.paidNow).length), href: 'SIncome.dc.html', fg: t.fg, warn: false },
      { label: 'Still owed', value: fmt(owed), line: (function (n) { return n + (n === 1 ? ' payment' : ' payments') + ' expected'; })(DATA.owed.count - Object.keys(st.paidNow).length), href: 'SPayments.dc.html', fg: t.fg, warn: false },
      { label: 'Late', value: fmt(lateSum), line: lateLeft.length ? lateLeft.length + (lateLeft.length === 1 ? ' payment' : ' payments') + ' past due' : 'Nothing is late', href: 'SPayments.dc.html', fg: lateSum ? t.destr : t.fg, warn: lateSum > 0 }
    ];
    if (isEmpty) stats = [
      { label: 'Booked this year', value: '$0', line: 'No signed deals yet', href: 'SDeals.dc.html', fg: t.fg, warn: false },
      { label: 'Received', value: '$0', line: 'No payments yet', href: 'SIncome.dc.html', fg: t.fg, warn: false },
      { label: 'Still owed', value: '$0', line: 'Nothing expected yet', href: 'SPayments.dc.html', fg: t.fg, warn: false },
      { label: 'Late', value: '$0', line: 'Nothing is late', href: 'SPayments.dc.html', fg: t.fg, warn: false }
    ];
    var SKW = [['112px', '150px'], ['96px', '138px'], ['104px', '144px'], ['88px', '128px']];
    stats = stats.map(function (s, i) { var cols = wide ? 4 : 2; return Object.assign(s, { bl: i % cols ? ('1px solid ' + t.line) : 'none', bt: i >= cols ? ('1px solid ' + t.line) : 'none',
      warn: s.warn && !isLoading, ready: !isLoading, load: isLoading, skV: sk(SKW[i][0], mob ? '20px' : '24px', t.rSm), skVm: mob ? '3px 0 2px' : '4px 0', skL: sk(SKW[i][1], '12px', t.rSm) }); });
    function many(n, f) { var o = []; for (var i = 0; i < n; i++) o.push(f(i)); return o; }
    var W1 = ['58%', '44%', '64%', '50%', '40%', '56%', '48%'], W2 = ['36%', '28%', '40%', '30%', '26%', '38%', '32%'];
    var skAttn = many(4, function (i) { return { av: sk('34px', '34px', '17px'), t1: sk(W1[i], '12px'), t2: sk(W2[i], '10px'), btn: sk(i < 3 ? '70px' : '96px', '28px', t.rCtl) }; });
    var skWeek = many(3, function (i) { return { d: sk('26px', '10px'), c: sk(['44px', '56px', '40px'][i], '22px', t.rEv), t: sk(['42%', '54%', '36%'][i], '12px') }; });
    var skDeals = many(mob ? 4 : 7, function (i) { return { av: sk('32px', '32px', t.rCtl), t1: sk(W1[i], '12px'), t2: sk(W2[i], '10px'), badge: sk('86px', '24px', t.rCtl), amt: sk(['58px', '52px', '46px', '50px', '56px', '44px', '52px'][i], '12px') }; });
    var skUp = many(4, function (i) { return { tile: sk('40px', '40px', t.rSm), t1: sk(W1[i + 1], '12px'), t2: sk('64px', '10px'), amt: sk(['50px', '46px', '52px', '48px'][i], '12px'), line: i ? ('1px solid ' + t.line) : 'none' }; });
    var goAdd = function (kind) { return function () { self.setState({ add: kind, nav: false }); }; };
    var hasTodo = !!(st.todoDraft || '').trim();
    var page = {
      minH: mob ? '100vh' : '1200px',
      greeting: 'Good ' + (isDemo ? 'afternoon' : (function () { var h = new Date().getHours(); return h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'; })()) + ', ' + ACC.name,
      weekHint: weekHint, hasWeekHint: isSample && !!weekHint,
      greetLine: DD.DAYS[DD.weekday(TODAY)] + ', ' + DD.MONTHS[+TODAY.slice(5, 7) - 1] + ' ' + (+TODAY.slice(8, 10)) + '.' + (isEmpty ? ' Add a deal to begin.' : !isSample ? '' : ' ' + (lateLeft.length ? lateLeft.length + (lateLeft.length === 1 ? ' payment needs' : ' payments need') + ' a nudge.' : 'Nothing is late. Nice.')),
      stats: stats, stripCols: wide ? 'repeat(4, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))', statPad: mob ? '14px 16px' : '18px 22px', statFs: mob ? '22px' : '28px',
      rowCols: wide ? 'minmax(0, 2fr) minmax(320px, 1fr)' : 'minmax(0, 1fr)',
      attn: attn, hasAttn: attn.length > 0, noAttn: isSample && attn.length === 0, attnCount: String(attn.length),
      week: week, weekItems: weekItems, weekNone: isEmpty || (isSample && weekItems.length === 0), upcoming: upcoming,
      tabs: tabs, rows: rows, footLabel: 'Showing ' + shown.length + ' of ' + list.length,
      todos: todos, hasTodos: todos.length > 0, noTodos: isSample && todos.length === 0, todoCount: String(todos.length),
      todoDraft: st.todoDraft, setTodoDraft: function (e2) { self.setState({ todoDraft: e2.target.value }); }, todoKey: function (e2) { if (e2.key === 'Enter') addTodo(); }, addTodo: addTodo,
      noTodoDraft: !hasTodo, todoOp: hasTodo ? '1' : '0.4',
      emptyTodos: isEmpty && todos.length === 0,
      showData: !isError, notLoading: !isLoading, showTabs: isSample || isLoading, showFoot: isSample || isLoading,
      rightCol: !mob && !wide ? 'min-width: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; align-items: stretch' : 'min-width: 0; display: flex; flex-direction: column; gap: 16px',
      errPad: mob ? '56px 12px' : '72px 24px',
      upList: 'display: flex; flex-direction: column; flex: 1 1 auto', upTotal: isEmpty ? '$0' : fmt(upSum),
      skAttn: skAttn, skWeek: skWeek, skDeals: skDeals, skUp: skUp, skTile: sk('58%', '12px'), skFoot: sk('104px', '12px'), skTotal: sk('72px', '16px'),
      skBox: sk('16px', '16px', t.rBox), skTodo: sk('84%', '12px'), skChip: sk('92px', '22px', t.rCtl),
      errBlk: blk('error', IC.wifi, 'We could not load your overview', 'Check your connection and try again. Nothing was lost.', 'Try again', function () { self.retryLoad(); }),
      attnBlk: blk('empty', 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0', 'Nothing needs you yet', 'Late payments and deals with no pay by date show up here, so nothing slips.'),
      weekBlk: isEmpty ? blk('empty', 'M8 2v4M16 2v4M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM3 10h18', 'Nothing this week', 'Posts and payments due this week show up here.')
        : blk('empty', 'M8 2v4M16 2v4M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM3 10h18M9 16l2 2 4-4', 'A quiet week', 'Nothing posts or comes due through Saturday.'),
      dealsBlk: blk('empty', 'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z', 'No deals yet', 'Add your first deal by hand, upload a contract or CSV, or import from Notion.', 'Add deal', goAdd('new'), 'Upload', goAdd('upload')),
      upBlk: blk('empty', IC.clock, 'No payments coming up', 'Give a deal a pay by date and it shows up here.'),
      todoBlk: blk('empty', 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', 'No to-dos yet', 'Add one below when something comes up.')
    };
    var shell = {
      account: ACC,
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
      onCreated: function (info) { self.setState({ add: '' }); self.celebrate(info || {}); if (info) self.emit(info.kind === 'deal' ? 'deal.create' : 'deals.import', info, info.kind === 'deal' ? 'Could not save the deal' : 'Could not import the deals'); },
      praise: st.praise, closePraise: function () { clearTimeout(self._pz2); self.setState({ praise: null }); },
      askId: st.askId, askText: st.askText, asstName: ACC.name,
      toastR: mob ? '12px' : '24px', toastL: mob ? '12px' : 'auto', toastB: mob ? 'auto' : '84px', toastT: mob ? '12px' : 'auto', toastW: mob ? 'auto' : '340px',
      toasts: st.toasts.map(function (x) { var drop = function () { self.setState({ toasts: self.state.toasts.filter(function (y) { return y.id !== x.id; }) }); };
        return { title: x.title, desc: x.desc, hasDesc: !!x.desc, hasUndo: !!x.undo, undo: function () { if (x.undo) x.undo(); drop(); }, isErr: x.kind === 'error', hasCta: !!x.cta, cta: x.cta, doCta: function () { drop(); if (x.act) x.act(); } }; }),
      stH: mob ? '36px' : '28px', dataView: V, isSample: isSample, isEmpty: isEmpty, isLoading: isLoading, isError: isError, notSample: !isSample, retry: function () { self.retryLoad(); }, isTab: tabW,
      plan: plan, locked: locked, lockedKind: locked ? plan : '', quietBell: !isSample, sbFresh: !isSample,
      hasBanner: plan === 'pastdue' || locked, bn: (function () {
        var go = function () { try { window.localStorage.setItem('talby.settingsTab', 'billing'); window.location.href = 'SSettings.dc.html'; } catch (e) {} };
        if (plan === 'pastdue') return { bg: t.warnBg, fg: t.warnFg, bd: 'transparent', subFg: t.warnFg, icon: IC.warn, title: mob ? 'Payment failed.' : 'Your last payment did not go through.', text: mob ? 'Update your card by ' + TalbyDates.md(ACC.pastDueBy) + '.' : 'Update your card by ' + TalbyDates.md(ACC.pastDueBy) + ' to keep adding and changing deals.', cta: 'Update card', act: go };
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
              <SSidebar account={$s0?.account} active={"overview"} color={$s0?.eff} dark={$s0?.dark} collapsed={$s0?.collapsed} plan={$s0?.plan} fresh={$s0?.sbFresh} />
            </div>
          </div>
        </>) : null}
        <main {...S(`flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 16px; padding: ${I($s0?.mainPad)}; box-sizing: border-box`)}>
          <STopbar account={$s0?.account} title={"Overview"} mobile={$s0?.mob} quiet={$s0?.quietBell} color={$s0?.eff} dark={$s0?.dark} onNav={$s0?.toggleNav} onSearch={$s0?.openCmd} onAppearance={$s0?.openAppear} onAdd={$s0?.openAdd} />
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
              <h1 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: ${I($s0?.h1Fs)}; font-weight: 600; letter-spacing: ${I($s0?.t?.hTrack)}; text-transform: ${I($s0?.t?.hCase)}; line-height: 1.15; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                {$s0?.greeting}
              </h1>
              <p {...S(`margin: 0; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                {T($s0?.greetLine)}
              </p>
            </div>
          </div>
          {$s0?.showData ? (<>
            <section aria-label={"Money"} className={"a-in"} {...S(`animation-delay: 0.04s; display: grid; grid-template-columns: ${I($s0?.stripCols)}; overflow: hidden; ${I($s0?.k?.card)}`)}>
              {A($s0?.stats).map((it, i) => {
                const $s1 = { ...$s0, "s": it, $index: i };
                return (<React.Fragment key={i}>
                  <a href={H($s1?.s?.href)} className={"tr"} {...S(`--hvr: ${I($s1?.t?.hoverCard)}; min-width: 0; display: flex; flex-direction: column; gap: 4px; padding: ${I($s1?.statPad)}; box-sizing: border-box; border-left: ${I($s1?.s?.bl)}; border-top: ${I($s1?.s?.bt)}; color: ${I($s1?.t?.fg)}; text-decoration: none`)}>
                    <span {...S(`display: flex; align-items: center; gap: 8px; min-width: 0; color: ${I($s1?.t?.mutedFg)}; white-space: nowrap`)}>
                      {$s1?.s?.warn ? (<>
                        <span className={"a-ping"} {...S("width: 7px; height: 7px; flex: 0 0 7px; border-radius: 4px; background: #EF4444")} />
                      </>) : null}
                      <span {...S("overflow: hidden; text-overflow: ellipsis")}>
                        {T($s1?.s?.label)}
                      </span>
                    </span>
                    {$s1?.s?.ready ? (<>
                      <span {...S(`font-family: ${I($s1?.numFam)}; font-size: ${I($s1?.statFs)}; font-weight: 600; letter-spacing: ${I($s1?.t?.nTrack)}; line-height: 1.15; font-variant-numeric: tabular-nums; white-space: nowrap; color: ${I($s1?.s?.fg)}; transition: color 0.3s ease`)}>
                        {T($s1?.s?.value)}
                      </span>
                      <span {...S(`font-size: 13px; color: ${I($s1?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                        {T($s1?.s?.line)}
                      </span>
                    </>) : null}
                    {$s1?.s?.load ? (<>
                      <span className={"a-pulse"} {...S(`margin: ${I($s1?.s?.skVm)}; ${I($s1?.s?.skV)}`)} />
                      <span className={"a-pulse"} {...S(`margin: 3px 0; ${I($s1?.s?.skL)}`)} />
                    </>) : null}
                  </a>
                </React.Fragment>);
              })}
            </section>
            <div {...S(`display: grid; grid-template-columns: ${I($s0?.rowCols)}; gap: 16px; align-items: stretch`)}>
              <section className={"a-in"} {...S(`animation-delay: 0.08s; min-width: 0; display: flex; flex-direction: column; ${I($s0?.k?.card)}`)}>
                <div {...S("display: flex; align-items: center; gap: 10px; padding: 16px 14px 10px 20px")}>
                  <h2 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 16px; font-weight: 600; white-space: nowrap`)}>
                    {"Needs your attention"}
                  </h2>
                  {$s0?.hasAttn ? (<>
                    <span {...S(`display: inline-flex; align-items: center; justify-content: center; min-width: 22px; height: 22px; padding: 0 7px; box-sizing: border-box; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.badBg)}; color: ${I($s0?.t?.badFg)}; font-size: 12px; font-weight: 600; font-variant-numeric: tabular-nums`)}>
                      {T($s0?.attnCount)}
                    </span>
                  </>) : null}
                  <div {...S("flex: 1 1 auto")} />
                  <a className={"tb tg"} href={H("SPayments.dc.html")} {...S($s0?.k?.gSm)}>
                    {"Payments"}
                  </a>
                </div>
                <div {...S("flex: 1 1 auto; display: flex; flex-direction: column; padding: 0 8px 8px")}>
                  {A($s0?.attn).map((it, i) => {
                    const $s1 = { ...$s0, "a": it, $index: i };
                    return (<React.Fragment key={i}>
                      <div className={$s1?.a?.cls} {...S(`display: flex; align-items: center; gap: 12px; min-height: 62px; padding: 8px 10px 8px 12px; box-sizing: border-box; border-top: 1px solid ${I($s1?.t?.line)}; overflow: hidden${I($s1?.a?.wrap)}`)}>
                        <span {...S(`width: 34px; height: 34px; flex: 0 0 34px; border-radius: 17px; background: ${I($s1?.a?.avBg)}; color: ${I($s1?.a?.avFg)}; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600`)}>
                          {$s1?.a?.isLetter ? (<>
                            {T($s1?.a?.l)}
                          </>) : null}
                          {$s1?.a?.isIcon ? (<>
                            <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={$s1?.a?.icon} />
                            </svg>
                          </>) : null}
                        </span>
                        <span {...S(`flex: ${I($s1?.a?.tFlex)}; min-width: 0; display: flex; flex-direction: column; gap: 2px`)}>
                          <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                            {T($s1?.a?.title)}
                          </span>
                          <span {...S(`font-size: 13px; color: ${I($s1?.a?.subFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                            {T($s1?.a?.sub)}
                          </span>
                        </span>
                        {$s1?.a?.isPay ? (<>
                          {$s1?.notMob ? (<>
                            <a className={"tb tg"} href={H("SPayments.dc.html")} {...S($s1?.k?.oSm)}>
                              {"Remind"}
                            </a>
                          </>) : null}
                          <button className={"tb tg"} type={"button"} onClick={$s1?.a?.paid} aria-label={$s1?.a?.paidLabel} {...S($s1?.k?.sSm)}>
                            <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={"M20 6 9 17l-5-5"} />
                            </svg>
                            {"Paid"}
                          </button>
                        </>) : null}
                        {$s1?.a?.isDate ? (<>
                          <div {...S(`width: ${I($s1?.a?.dw)}; flex: 0 0 ${I($s1?.a?.dw)}; margin-left: ${I($s1?.a?.ml)}`)}>
                            <SDatePicker value={""} placeholder={"Add date"} size={"sm"} align={"end"} label={$s1?.a?.dateLabel} onChange={$s1?.a?.setDate} color={$s1?.eff} dark={$s1?.dark} />
                          </div>
                        </>) : null}
                        {$s1?.a?.isLink ? (<>
                          <a className={"tb tg"} href={H("SDeals.dc.html")} {...S(`margin-left: ${I($s1?.a?.ml)}; ${I($s1?.k?.oSm)}`)}>
                            {"Review"}
                          </a>
                        </>) : null}
                      </div>
                    </React.Fragment>);
                  })}
                  {$s0?.noAttn ? (<>
                    <div className={"a-pop"} {...S(`flex: 1 1 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-height: 220px; padding: 24px 16px; border-top: 1px solid ${I($s0?.t?.line)}; text-align: center`)}>
                      <span className={"a-check"} {...S(`width: 44px; height: 44px; border-radius: 22px; background: ${I($s0?.t?.okBg)}; color: ${I($s0?.t?.okFg)}; display: inline-flex; align-items: center; justify-content: center`)}>
                        <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M20 6 9 17l-5-5"} />
                        </svg>
                      </span>
                      <span {...S("font-weight: 600")}>
                        {"Nothing needs you right now"}
                      </span>
                      <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                        {"Late payments and missing dates show up here."}
                      </span>
                    </div>
                  </>) : null}
                  {$s0?.isLoading ? (<>
                    {A($s0?.skAttn).map((it, i) => {
                      const $s1 = { ...$s0, "x": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div {...S(`display: flex; align-items: center; gap: 12px; min-height: 62px; padding: 8px 10px 8px 12px; box-sizing: border-box; border-top: 1px solid ${I($s1?.t?.line)}`)}>
                          <span className={"a-pulse"} {...S($s1?.x?.av)} />
                          <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 8px")}>
                            <span className={"a-pulse"} {...S($s1?.x?.t1)} />
                            <span className={"a-pulse"} {...S($s1?.x?.t2)} />
                          </span>
                          <span className={"a-pulse"} {...S($s1?.x?.btn)} />
                        </div>
                      </React.Fragment>);
                    })}
                  </>) : null}
                  {$s0?.isEmpty ? (<>
                    <div {...S(`flex: 1 1 auto; display: flex; flex-direction: column; justify-content: center; border-top: 1px solid ${I($s0?.t?.line)}`)}>
                      <div className={"a-fade"} {...S("display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 40px 24px; box-sizing: border-box; text-align: center")}>
                        <span {...S(`display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.attnBlk?.tileBg)}; color: ${I($s0?.attnBlk?.tileFg)}`)}>
                          <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={$s0?.attnBlk?.icon} />
                          </svg>
                        </span>
                        <div {...S("display: flex; flex-direction: column; align-items: center; gap: 4px; max-width: 380px")}>
                          <span {...S("font-size: 15px; font-weight: 600")}>
                            {T($s0?.attnBlk?.title)}
                          </span>
                          {$s0?.attnBlk?.hasSub ? (<>
                            <span {...S(`font-size: 13px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}`)}>
                              {T($s0?.attnBlk?.sub)}
                            </span>
                          </>) : null}
                        </div>
                        {$s0?.attnBlk?.hasCta ? (<>
                          <div {...S("display: flex; flex-wrap: wrap; justify-content: center; gap: 8px")}>
                            <button type={"button"} className={"tb tp"} onClick={$s0?.attnBlk?.act} {...S(`${I($s0?.k?.pSm)}; height: ${I($s0?.stH)}; flex-shrink: 0`)}>
                              {T($s0?.attnBlk?.cta)}
                            </button>
                            {$s0?.attnBlk?.has2 ? (<>
                              <button type={"button"} className={"tb tg"} onClick={$s0?.attnBlk?.act2} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.oSm)}; height: ${I($s0?.stH)}`)}>
                                {T($s0?.attnBlk?.cta2)}
                              </button>
                            </>) : null}
                          </div>
                        </>) : null}
                      </div>
                    </div>
                  </>) : null}
                </div>
              </section>
              <section className={"a-in"} {...S(`animation-delay: 0.12s; min-width: 0; padding: 16px 18px 14px; display: flex; flex-direction: column; gap: 14px; ${I($s0?.k?.card)}`)}>
                <div {...S("display: flex; align-items: center; justify-content: space-between; gap: 12px")}>
                  <h2 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 16px; font-weight: 600`)}>
                    {"This week"}
                  </h2>
                  <a className={"tb tg"} href={H("SCalendar.dc.html")} {...S(`margin-right: -8px; ${I($s0?.k?.gSm)}`)}>
                    {"Calendar"}
                  </a>
                </div>
                <div {...S("display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px")}>
                  {A($s0?.week).map((it, i) => {
                    const $s1 = { ...$s0, "d": it, $index: i };
                    return (<React.Fragment key={i}>
                      <a href={H("SCalendar.dc.html")} className={"tb tg"} aria-label={$s1?.d?.aria} {...S(`--hv: ${I($s1?.d?.hv)}; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 0 7px; border-radius: ${I($s1?.t?.rTile)}; background: ${I($s1?.d?.bg)}; color: ${I($s1?.d?.fg)}; text-decoration: none`)}>
                        <span {...S(`font-size: 11px; font-weight: 500; letter-spacing: 0.04em; color: ${I($s1?.d?.wdFg)}`)}>
                          {T($s1?.d?.wd)}
                        </span>
                        <span {...S("font-size: 15px; font-weight: 600; font-variant-numeric: tabular-nums")}>
                          {T($s1?.d?.num)}
                        </span>
                        <span {...S(`width: 5px; height: 5px; border-radius: 3px; background: ${I($s1?.d?.dot)}`)} />
                      </a>
                    </React.Fragment>);
                  })}
                </div>
                <div {...S("display: flex; flex-direction: column; flex: 1 1 auto")}>
                  {A($s0?.weekItems).map((it, i) => {
                    const $s1 = { ...$s0, "e": it, $index: i };
                    return (<React.Fragment key={i}>
                      <div {...S(`display: flex; align-items: center; gap: 10px; min-height: 44px; border-top: 1px solid ${I($s1?.t?.line)}`)}>
                        <span {...S(`width: 30px; flex: 0 0 30px; font-size: 12px; font-weight: 500; color: ${I($s1?.t?.mutedFg)}`)}>
                          {T($s1?.e?.day)}
                        </span>
                        <span {...S(`display: inline-flex; align-items: center; height: 22px; padding: 0 8px; box-sizing: border-box; border-radius: ${I($s1?.t?.rEv)}; background: ${I($s1?.e?.bg)}; color: ${I($s1?.e?.fg)}; font-size: 12px; font-weight: 500; white-space: nowrap; transition: background-color 0.3s ease, color 0.3s ease`)}>
                          {T($s1?.e?.type)}
                        </span>
                        <span {...S(`flex: 1 1 auto; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: ${I($s1?.e?.titleFg)}`)}>
                          {T($s1?.e?.title)}
                        </span>
                        <span {...S(`font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums; color: ${I($s1?.e?.amtFg)}`)}>
                          {T($s1?.e?.amount)}
                        </span>
                      </div>
                    </React.Fragment>);
                  })}
                  {$s0?.isLoading ? (<>
                    {A($s0?.skWeek).map((it, i) => {
                      const $s1 = { ...$s0, "x": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div {...S(`display: flex; align-items: center; gap: 10px; min-height: 44px; border-top: 1px solid ${I($s1?.t?.line)}`)}>
                          <span className={"a-pulse"} {...S($s1?.x?.d)} />
                          <span className={"a-pulse"} {...S($s1?.x?.c)} />
                          <span className={"a-pulse"} {...S($s1?.x?.t)} />
                        </div>
                      </React.Fragment>);
                    })}
                  </>) : null}
                  {$s0?.weekNone ? (<>
                    <div {...S(`flex: 1 1 auto; display: flex; flex-direction: column; justify-content: center; border-top: 1px solid ${I($s0?.t?.line)}`)}>
                      <div className={"a-fade"} {...S("display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 28px 16px; box-sizing: border-box; text-align: center")}>
                        <span {...S(`display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.weekBlk?.tileBg)}; color: ${I($s0?.weekBlk?.tileFg)}`)}>
                          <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={$s0?.weekBlk?.icon} />
                          </svg>
                        </span>
                        <div {...S("display: flex; flex-direction: column; align-items: center; gap: 4px; max-width: 380px")}>
                          <span {...S("font-size: 15px; font-weight: 600")}>
                            {T($s0?.weekBlk?.title)}
                          </span>
                          {$s0?.weekBlk?.hasSub ? (<>
                            <span {...S(`font-size: 13px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}`)}>
                              {T($s0?.weekBlk?.sub)}
                            </span>
                          </>) : null}
                        </div>
                        {$s0?.weekBlk?.hasCta ? (<>
                          <div {...S("display: flex; flex-wrap: wrap; justify-content: center; gap: 8px")}>
                            <button type={"button"} className={"tb tp"} onClick={$s0?.weekBlk?.act} {...S(`${I($s0?.k?.pSm)}; height: ${I($s0?.stH)}; flex-shrink: 0`)}>
                              {T($s0?.weekBlk?.cta)}
                            </button>
                            {$s0?.weekBlk?.has2 ? (<>
                              <button type={"button"} className={"tb tg"} onClick={$s0?.weekBlk?.act2} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.oSm)}; height: ${I($s0?.stH)}`)}>
                                {T($s0?.weekBlk?.cta2)}
                              </button>
                            </>) : null}
                          </div>
                        </>) : null}
                      </div>
                    </div>
                  </>) : null}
                </div>
                {$s0?.isLoading ? (<>
                  <div {...S(`display: flex; align-items: center; gap: 10px; height: 40px; padding: 0 12px; box-sizing: border-box; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.tile)}`)}>
                    <span className={"a-pulse"} {...S($s0?.skTile)} />
                  </div>
                </>) : null}
                {$s0?.hasWeekHint ? (<>
                  <a href={H("SPayments.dc.html")} className={"tr"} {...S(`--hvr: ${I($s0?.t?.fillHover)}; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.tile)}; color: ${I($s0?.t?.fg)}; text-decoration: none`)}>
                    <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 15px")}>
                      <path d={"M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"} />
                    </svg>
                    <span {...S("flex: 1 1 auto; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                      {$s0?.weekHint}
                    </span>
                  </a>
                </>) : null}
              </section>
            </div>
            <div {...S(`display: grid; grid-template-columns: ${I($s0?.rowCols)}; gap: 16px; align-items: stretch`)}>
              <section className={"a-in"} {...S(`animation-delay: 0.16s; min-width: 0; display: flex; flex-direction: column; ${I($s0?.k?.card)}`)}>
                <div {...S("display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 14px 14px 12px 20px")}>
                  <h2 {...S(`margin: 0 8px 0 0; font-family: ${I($s0?.titleFam)}; font-size: 16px; font-weight: 600; white-space: nowrap`)}>
                    {"Deals"}
                  </h2>
                  <div {...S("flex: 1 1 0px")} />
                  {$s0?.showTabs ? (<>
                    <div role={"tablist"} aria-label={"Show deals"} {...S($s0?.k?.tabs)}>
                      {A($s0?.tabs).map((it, i) => {
                        const $s1 = { ...$s0, "tb": it, $index: i };
                        return (<React.Fragment key={i}>
                          <button className={"tb tt"} type={"button"} role={"tab"} aria-selected={$s1?.tb?.on} onClick={$s1?.tb?.pick} {...S($s1?.tb?.style)}>
                            {T($s1?.tb?.label)}
                            <span {...S(`color: ${I($s1?.t?.mutedFg)}; font-variant-numeric: tabular-nums`)}>
                              {T($s1?.tb?.count)}
                            </span>
                          </button>
                        </React.Fragment>);
                      })}
                    </div>
                  </>) : null}
                </div>
                <div {...S("flex: 1 1 auto; display: flex; flex-direction: column; padding: 0 8px")}>
                  {A($s0?.rows).map((it, i) => {
                    const $s1 = { ...$s0, "r": it, $index: i };
                    return (<React.Fragment key={i}>
                      <a href={H("SDeal.dc.html")} className={"tr a-in"} {...S(`animation-delay: ${I($s1?.r?.delay)}; display: flex; align-items: center; gap: 12px; min-height: 56px; padding: 8px 12px; box-sizing: border-box; border-top: 1px solid ${I($s1?.t?.line)}; border-radius: ${I($s1?.t?.rItem)}; color: ${I($s1?.t?.fg)}; text-decoration: none`)}>
                        <span {...S(`width: 32px; height: 32px; flex: 0 0 32px; border-radius: ${I($s1?.t?.rCtl)}; background: ${I($s1?.t?.fill)}; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600`)}>
                          {T($s1?.r?.l)}
                        </span>
                        <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 1px")}>
                          <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                            {T($s1?.r?.brand)}
                          </span>
                          <span {...S(`font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: ${I($s1?.r?.subFg)}`)}>
                            {T($s1?.r?.sub)}
                          </span>
                        </span>
                        {$s1?.notMob ? (<>
                          <span {...S(`color: ${I($s1?.r?.pay?.fg)}; ${I($s1?.k?.payBadge)}`)}>
                            <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("display: block; flex: 0 0 14px")}>
                              <circle cx={"12"} cy={"12"} r={"9.5"} fill={$s1?.r?.pay?.fill} stroke={$s1?.r?.pay?.stroke} strokeDasharray={$s1?.r?.pay?.dash} />
                              <path d={$s1?.r?.pay?.inner} stroke={$s1?.r?.pay?.innerStroke} />
                            </svg>
                            {T($s1?.r?.pay?.label)}
                          </span>
                        </>) : null}
                        <span {...S("width: 84px; flex: 0 0 auto; text-align: right; font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums")}>
                          {T($s1?.r?.amount)}
                        </span>
                      </a>
                    </React.Fragment>);
                  })}
                  {$s0?.isLoading ? (<>
                    {A($s0?.skDeals).map((it, i) => {
                      const $s1 = { ...$s0, "x": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div {...S(`display: flex; align-items: center; gap: 12px; min-height: 56px; padding: 8px 12px; box-sizing: border-box; border-top: 1px solid ${I($s1?.t?.line)}`)}>
                          <span className={"a-pulse"} {...S($s1?.x?.av)} />
                          <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 8px")}>
                            <span className={"a-pulse"} {...S($s1?.x?.t1)} />
                            <span className={"a-pulse"} {...S($s1?.x?.t2)} />
                          </span>
                          {$s1?.notMob ? (<>
                            <span className={"a-pulse"} {...S($s1?.x?.badge)} />
                          </>) : null}
                          <span {...S("width: 84px; flex: 0 0 auto; display: flex; justify-content: flex-end")}>
                            <span className={"a-pulse"} {...S($s1?.x?.amt)} />
                          </span>
                        </div>
                      </React.Fragment>);
                    })}
                  </>) : null}
                  {$s0?.isEmpty ? (<>
                    <div {...S(`flex: 1 1 auto; display: flex; flex-direction: column; justify-content: center; border-top: 1px solid ${I($s0?.t?.line)}`)}>
                      <div className={"a-fade"} {...S("display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 48px 24px; box-sizing: border-box; text-align: center")}>
                        <span {...S(`display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.dealsBlk?.tileBg)}; color: ${I($s0?.dealsBlk?.tileFg)}`)}>
                          <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={$s0?.dealsBlk?.icon} />
                          </svg>
                        </span>
                        <div {...S("display: flex; flex-direction: column; align-items: center; gap: 4px; max-width: 380px")}>
                          <span {...S("font-size: 15px; font-weight: 600")}>
                            {T($s0?.dealsBlk?.title)}
                          </span>
                          {$s0?.dealsBlk?.hasSub ? (<>
                            <span {...S(`font-size: 13px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}`)}>
                              {T($s0?.dealsBlk?.sub)}
                            </span>
                          </>) : null}
                        </div>
                        {$s0?.dealsBlk?.hasCta ? (<>
                          <div {...S("display: flex; flex-wrap: wrap; justify-content: center; gap: 8px")}>
                            <button type={"button"} className={"tb tp"} onClick={$s0?.dealsBlk?.act} {...S(`${I($s0?.k?.pSm)}; height: ${I($s0?.stH)}; flex-shrink: 0`)}>
                              {T($s0?.dealsBlk?.cta)}
                            </button>
                            {$s0?.dealsBlk?.has2 ? (<>
                              <button type={"button"} className={"tb tg"} onClick={$s0?.dealsBlk?.act2} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.oSm)}; height: ${I($s0?.stH)}`)}>
                                {T($s0?.dealsBlk?.cta2)}
                              </button>
                            </>) : null}
                          </div>
                        </>) : null}
                      </div>
                    </div>
                  </>) : null}
                </div>
                {$s0?.showFoot ? (<>
                  <div {...S(`display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 14px 14px 20px; border-top: 1px solid ${I($s0?.t?.line)}`)}>
                    {$s0?.isSample ? (<>
                      <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                        {T($s0?.footLabel)}
                      </span>
                    </>) : null}
                    {$s0?.isLoading ? (<>
                      <span className={"a-pulse"} {...S($s0?.skFoot)} />
                    </>) : null}
                    <a className={"tb tg"} href={H("SDeals.dc.html")} {...S($s0?.k?.oSm)}>
                      {"View all deals"}
                    </a>
                  </div>
                </>) : null}
              </section>
              <div {...S($s0?.rightCol)}>
                <section className={"a-in"} {...S(`animation-delay: 0.2s; padding: 16px 18px 8px; display: flex; flex-direction: column; gap: 6px; ${I($s0?.k?.card)}`)}>
                  <div {...S("display: flex; align-items: center; justify-content: space-between; gap: 12px")}>
                    <h2 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 16px; font-weight: 600; white-space: nowrap`)}>
                      {"Upcoming payments"}
                    </h2>
                    <a className={"tb tg"} href={H("SPayments.dc.html")} {...S(`margin-right: -8px; ${I($s0?.k?.gSm)}`)}>
                      {"View all"}
                    </a>
                  </div>
                  <div {...S($s0?.upList)}>
                    {A($s0?.upcoming).map((it, i) => {
                      const $s1 = { ...$s0, "u": it, $index: i };
                      return (<React.Fragment key={i}>
                        <a href={H("SPayments.dc.html")} className={"tr"} {...S(`--hvr: ${I($s1?.t?.hoverCard)}; display: flex; align-items: center; gap: 12px; min-height: 56px; margin: 0 -8px; padding: 0 8px; border-top: ${I($s1?.u?.line)}; border-radius: ${I($s1?.t?.rItem)}; color: ${I($s1?.t?.fg)}; text-decoration: none`)}>
                          <span {...S(`width: 40px; height: 40px; flex: 0 0 40px; box-sizing: border-box; border-radius: ${I($s1?.t?.rSm)}; background: ${I($s1?.t?.tile)}; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.05`)}>
                            <span {...S(`font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: ${I($s1?.t?.mutedFg)}`)}>
                              {T($s1?.u?.mon)}
                            </span>
                            <span {...S(`font-family: ${I($s1?.numFam)}; font-size: 16px; font-weight: 600; font-variant-numeric: tabular-nums`)}>
                              {T($s1?.u?.day)}
                            </span>
                          </span>
                          <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 1px")}>
                            <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                              {T($s1?.u?.brand)}
                            </span>
                            <span {...S(`font-size: 13px; color: ${I($s1?.u?.whenFg)}; white-space: nowrap`)}>
                              {T($s1?.u?.when)}
                            </span>
                          </span>
                          <span {...S("font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums")}>
                            {T($s1?.u?.amount)}
                          </span>
                        </a>
                      </React.Fragment>);
                    })}
                    {$s0?.isLoading ? (<>
                      {A($s0?.skUp).map((it, i) => {
                        const $s1 = { ...$s0, "x": it, $index: i };
                        return (<React.Fragment key={i}>
                          <div {...S(`display: flex; align-items: center; gap: 12px; min-height: 56px; border-top: ${I($s1?.x?.line)}`)}>
                            <span className={"a-pulse"} {...S($s1?.x?.tile)} />
                            <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 8px")}>
                              <span className={"a-pulse"} {...S($s1?.x?.t1)} />
                              <span className={"a-pulse"} {...S($s1?.x?.t2)} />
                            </span>
                            <span className={"a-pulse"} {...S($s1?.x?.amt)} />
                          </div>
                        </React.Fragment>);
                      })}
                    </>) : null}
                    {$s0?.isEmpty ? (<>
                      <div {...S("flex: 1 1 auto; display: flex; flex-direction: column; justify-content: center")}>
                        <div className={"a-fade"} {...S("display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 28px 16px; box-sizing: border-box; text-align: center")}>
                          <span {...S(`display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.upBlk?.tileBg)}; color: ${I($s0?.upBlk?.tileFg)}`)}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={$s0?.upBlk?.icon} />
                            </svg>
                          </span>
                          <div {...S("display: flex; flex-direction: column; align-items: center; gap: 4px; max-width: 380px")}>
                            <span {...S("font-size: 15px; font-weight: 600")}>
                              {T($s0?.upBlk?.title)}
                            </span>
                            {$s0?.upBlk?.hasSub ? (<>
                              <span {...S(`font-size: 13px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}`)}>
                                {T($s0?.upBlk?.sub)}
                              </span>
                            </>) : null}
                          </div>
                          {$s0?.upBlk?.hasCta ? (<>
                            <div {...S("display: flex; flex-wrap: wrap; justify-content: center; gap: 8px")}>
                              <button type={"button"} className={"tb tp"} onClick={$s0?.upBlk?.act} {...S(`${I($s0?.k?.pSm)}; height: ${I($s0?.stH)}; flex-shrink: 0`)}>
                                {T($s0?.upBlk?.cta)}
                              </button>
                              {$s0?.upBlk?.has2 ? (<>
                                <button type={"button"} className={"tb tg"} onClick={$s0?.upBlk?.act2} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.oSm)}; height: ${I($s0?.stH)}`)}>
                                  {T($s0?.upBlk?.cta2)}
                                </button>
                              </>) : null}
                            </div>
                          </>) : null}
                        </div>
                      </div>
                    </>) : null}
                  </div>
                  <div {...S(`display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 0 8px; border-top: 1px solid ${I($s0?.t?.line)}`)}>
                    <span {...S(`color: ${I($s0?.t?.mutedFg)}; white-space: nowrap`)}>
                      {"Next 60 days"}
                    </span>
                    {$s0?.notLoading ? (<>
                      <span {...S(`font-family: ${I($s0?.numFam)}; font-size: 16px; font-weight: 600; font-variant-numeric: tabular-nums`)}>
                        {T($s0?.upTotal)}
                      </span>
                    </>) : null}
                    {$s0?.isLoading ? (<>
                      <span className={"a-pulse"} {...S($s0?.skTotal)} />
                    </>) : null}
                  </div>
                </section>
                <section className={"a-in"} {...S(`animation-delay: 0.24s; flex: 1 1 auto; padding: 16px 18px 14px; display: flex; flex-direction: column; gap: 10px; ${I($s0?.k?.card)}`)}>
                  <div {...S("display: flex; align-items: center; gap: 8px")}>
                    <h2 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 16px; font-weight: 600`)}>
                      {"To-dos"}
                    </h2>
                    {$s0?.hasTodos ? (<>
                      <span {...S(`display: inline-flex; align-items: center; justify-content: center; min-width: 22px; height: 22px; padding: 0 7px; box-sizing: border-box; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.fill)}; color: ${I($s0?.t?.mutedFg)}; font-size: 12px; font-weight: 600; font-variant-numeric: tabular-nums`)}>
                        {T($s0?.todoCount)}
                      </span>
                    </>) : null}
                    <div {...S("flex: 1 1 auto")} />
                    <a className={"tb tg"} href={H("STodos.dc.html")} {...S(`margin-right: -8px; ${I($s0?.k?.gSm)}`)}>
                      {"View all"}
                    </a>
                  </div>
                  {A($s0?.todos).map((it, i) => {
                    const $s1 = { ...$s0, "td": it, $index: i };
                    return (<React.Fragment key={i}>
                      <div className={$s1?.td?.cls} {...S(`display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; border-top: 1px solid ${I($s1?.t?.line)}`)}>
                        <button className={"tb"} type={"button"} role={"checkbox"} aria-checked={$s1?.td?.on} aria-label={$s1?.td?.aria} onClick={$s1?.td?.toggle} {...S(`margin-top: 2px; ${I($s1?.td?.box)}`)}>
                          {$s1?.td?.on ? (<>
                            <svg className={"a-check"} width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={"M20 6 9 17l-5-5"} />
                            </svg>
                          </>) : null}
                        </button>
                        <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 6px")}>
                          <span {...S("line-height: 1.45")}>
                            <span className={$s1?.td?.strike} {...S(`color: ${I($s1?.td?.fg)}; background-image: linear-gradient(currentColor, currentColor); background-repeat: no-repeat; background-position: 0 58%; background-size: ${I($s1?.td?.size)}; -webkit-box-decoration-break: clone; box-decoration-break: clone; transition: color 0.3s ease`)}>
                              {T($s1?.td?.text)}
                            </span>
                          </span>
                          <span {...S("display: flex; gap: 6px")}>
                            <span {...S(`display: inline-flex; align-items: center; gap: 6px; height: 22px; padding: 0 8px 0 3px; box-sizing: border-box; border: 1px solid ${I($s1?.t?.border)}; border-radius: ${I($s1?.t?.rCtl)}; font-size: 12px; font-weight: 500; white-space: nowrap`)}>
                              <span {...S(`width: 16px; height: 16px; border-radius: 8px; background: ${I($s1?.t?.fill)}; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700`)}>
                                {T($s1?.td?.dealL)}
                              </span>
                              {T($s1?.td?.deal)}
                            </span>
                          </span>
                        </span>
                      </div>
                    </React.Fragment>);
                  })}
                  {$s0?.noTodos ? (<>
                    <div className={"a-pop"} {...S(`display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.tile)}`)}>
                      <span {...S(`width: 28px; height: 28px; flex: 0 0 28px; border-radius: 14px; background: ${I($s0?.t?.okBg)}; color: ${I($s0?.t?.okFg)}; display: inline-flex; align-items: center; justify-content: center`)}>
                        <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M20 6 9 17l-5-5"} />
                        </svg>
                      </span>
                      <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 1px")}>
                        <span {...S("font-weight: 500")}>
                          {"All caught up"}
                        </span>
                        <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                          {"Add one below when something comes up."}
                        </span>
                      </span>
                    </div>
                  </>) : null}
                  {$s0?.isLoading ? (<>
                    <div {...S(`display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; border-top: 1px solid ${I($s0?.t?.line)}`)}>
                      <span className={"a-pulse"} {...S(`margin-top: 2px; ${I($s0?.skBox)}`)} />
                      <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 10px")}>
                        <span className={"a-pulse"} {...S(`margin-top: 3px; ${I($s0?.skTodo)}`)} />
                        <span className={"a-pulse"} {...S($s0?.skChip)} />
                      </span>
                    </div>
                  </>) : null}
                  {$s0?.emptyTodos ? (<>
                    <div {...S(`border-top: 1px solid ${I($s0?.t?.line)}`)}>
                      <div className={"a-fade"} {...S("display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 24px 16px; box-sizing: border-box; text-align: center")}>
                        <span {...S(`display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.todoBlk?.tileBg)}; color: ${I($s0?.todoBlk?.tileFg)}`)}>
                          <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={$s0?.todoBlk?.icon} />
                          </svg>
                        </span>
                        <div {...S("display: flex; flex-direction: column; align-items: center; gap: 4px; max-width: 380px")}>
                          <span {...S("font-size: 15px; font-weight: 600")}>
                            {T($s0?.todoBlk?.title)}
                          </span>
                          {$s0?.todoBlk?.hasSub ? (<>
                            <span {...S(`font-size: 13px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}`)}>
                              {T($s0?.todoBlk?.sub)}
                            </span>
                          </>) : null}
                        </div>
                        {$s0?.todoBlk?.hasCta ? (<>
                          <div {...S("display: flex; flex-wrap: wrap; justify-content: center; gap: 8px")}>
                            <button type={"button"} className={"tb tp"} onClick={$s0?.todoBlk?.act} {...S(`${I($s0?.k?.pSm)}; height: ${I($s0?.stH)}; flex-shrink: 0`)}>
                              {T($s0?.todoBlk?.cta)}
                            </button>
                            {$s0?.todoBlk?.has2 ? (<>
                              <button type={"button"} className={"tb tg"} onClick={$s0?.todoBlk?.act2} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.oSm)}; height: ${I($s0?.stH)}`)}>
                                {T($s0?.todoBlk?.cta2)}
                              </button>
                            </>) : null}
                          </div>
                        </>) : null}
                      </div>
                    </div>
                  </>) : null}
                  <div {...S("flex: 1 1 auto")} />
                  <div {...S("display: flex; gap: 8px")}>
                    <input className={"ti"} aria-label={"Add a to-do"} placeholder={"Add a to-do"} value={V0($s0?.todoDraft, "")} onChange={$s0?.setTodoDraft} onKeyDown={$s0?.todoKey} {...S($s0?.k?.input)} />
                    <button className={"tb tp"} type={"button"} onClick={$s0?.addTodo} aria-label={"Add to-do"} aria-disabled={$s0?.noTodoDraft} {...S(`opacity: ${I($s0?.todoOp)}; height: 36px; width: 36px; ${I($s0?.k?.icoP)}`)}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M5 12h14M12 5v14"} />
                      </svg>
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </>) : null}
          {$s0?.isError ? (<>
            <section className={"a-in"} {...S(`animation-delay: 0.04s; ${I($s0?.k?.card)}`)}>
              <div className={"a-fade"} {...S(`display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: ${I($s0?.errPad)}; box-sizing: border-box; text-align: center`)}>
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
        </main>
        {$s0?.drawerOpen ? (<>
          <div {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 88")}>
            <button type={"button"} aria-label={"Close menu"} className={"a-fade"} onClick={$s0?.closeNav} {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; padding: 0; border: none; background: ${I($s0?.t?.overlay)}; cursor: default`)} />
            <div className={"a-drawer"} {...S(`position: absolute; top: 0; bottom: 0; left: 0; width: 288px; max-width: 86%; overflow-y: auto; box-shadow: ${I($s0?.t?.shPop)}`)}>
              <SSidebar account={$s0?.account} active={"overview"} color={$s0?.eff} dark={$s0?.dark} drawer={true} plan={$s0?.plan} fresh={$s0?.sbFresh} onClose={$s0?.closeNav} />
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
        <SAddDeal dealsThisYear={$s0?.account?.dealsThisYear} open={$s0?.add} locked={$s0?.lockedKind} mobile={$s0?.mob} color={$s0?.eff} dark={$s0?.dark} onClose={$s0?.closeAdd} onCreated={$s0?.onCreated} />
        <SCommand account={$s0?.account} open={$s0?.cmd} color={$s0?.eff} dark={$s0?.dark} onClose={$s0?.closeCmd} onAction={$s0?.cmdAction} />
        <SAppearance open={$s0?.appear} theme={$s0?.look?.theme} mode={$s0?.look?.mode} sidebar={$s0?.look?.sidebar} dark={$s0?.dark} onSet={$s0?.setLook} onClose={$s0?.closeAppear} />
        <SAssistant embedded={true} nameFirst={$s0?.asstName} empty={$s0?.isEmpty} hidden={$s0?.chatHidden} askId={$s0?.askId} askText={$s0?.askText} color={$s0?.eff} dark={$s0?.dark} />
      </div>
  </>);
}

export const meta = {"props":{"color":{"editor":"enum","options":["studio","sand","mac","stationery","editorial"],"default":"studio"},"dark":{"editor":"boolean","default":false},"view":{"editor":"enum","options":["sample","empty","loading","error"],"default":"sample"},"plan":{"editor":"enum","options":["active","trial","pastdue","canceled","readonly"],"default":"active"},"writes":{"editor":"enum","options":["ok","fail"],"default":"ok"}},"preview":{"width":1440,"height":1200}};
export default $r.defineBoard("SOverview", Component, render, CSS, meta);
