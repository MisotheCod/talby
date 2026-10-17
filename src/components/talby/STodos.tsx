// @ts-nocheck
/* eslint-disable */
'use client';
// STodos: converted from design-source/boards/STodos.dc.html.
// Markup, inline styles and logic are carried over exactly from the board.
// The logic class below is the board's own code, unchanged.
import * as React from 'react';
import * as $r from './_runtime';
import { DCLogic } from './_runtime';
import { SAMPLE_ACCOUNT, TalbyDates, SAMPLE_TODOS, toTodosState } from './_data';
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
    }, { draft: '', newDeal: '', newDue: '', dealPop: false, dealQ: '', menu: -1, showDone: true, ticking: {}, todosE: [],
      todos: toTodosState(props.data || SAMPLE_TODOS) });
  }
  componentDidMount() {
    var self = this;
    this._rs = function () { try { self.setState({ w: window.innerWidth }); } catch (e) {} };
    this._sg = function (ev) { if (ev && ev.key === 'talby.look') { try { var L = JSON.parse(ev.newValue || 'null'); if (L) self.setState({ look: Object.assign({}, self.state.look, L) }); } catch (x) {} } };
    this._kd = function (e) { if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { if (e.preventDefault) e.preventDefault(); self.setState({ cmd: !self.state.cmd, nav: false }); } };
    this._mqf = function () { self.setState({ sysAt: Date.now() }); };
    try { window.addEventListener('resize', this._rs); window.addEventListener('storage', this._sg); window.addEventListener('keydown', this._kd); } catch (e) {}
    try { this._mq = window.matchMedia('(prefers-color-scheme: dark)'); if (this._mq.addEventListener) this._mq.addEventListener('change', this._mqf); else if (this._mq.addListener) this._mq.addListener(this._mqf); } catch (e) {}

    this._esc = function (e) { if (e && e.key === 'Escape') { var s2 = self.state; if (s2.dealPop) { self.setState({ dealPop: false, dealQ: '' }); try { self.dealBtn && self.dealBtn.focus(); } catch (x) {} } else if (s2.menu !== -1) self.setState({ menu: -1 }); } };
    try { window.addEventListener('keydown', this._esc); } catch (e) {}
  }
  componentWillUnmount() { try { window.removeEventListener('resize', this._rs); window.removeEventListener('storage', this._sg); window.removeEventListener('keydown', this._kd); } catch (e) {} try { if (this._mq) { if (this._mq.removeEventListener) this._mq.removeEventListener('change', this._mqf); else if (this._mq.removeListener) this._mq.removeListener(this._mqf); } } catch (e) {} clearTimeout(this._pz1); clearTimeout(this._pz2); clearTimeout(this._rt); (this._tt || []).forEach(clearTimeout); try { window.removeEventListener('keydown', this._esc); } catch (e) {} }
  componentDidUpdate(prev) {
    var p = this.props, L = this.state.look, ch = null;
    if (prev.dark !== p.dark) { ch = Object.assign({}, ch || L, { mode: p.dark ? 'dark' : 'light' }); }
    if (prev.color !== p.color && p.color) { ch = Object.assign({}, ch || L, { theme: p.color }); }
    if (ch) this.setState({ look: ch });
    if (prev.view !== p.view) this.setState({ dv: p.view || 'sample' });
    if (prev.data !== p.data && p.data) this.setState({ todos: toTodosState(p.data) });
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

  tick(id, key) {
    var self = this, tk = Object.assign({}, this.state.ticking); tk[id] = true;
    this.setState({ ticking: tk, menu: -1 });
    this._tt = this._tt || [];
    this._tt.push(setTimeout(function () {
      var tk2 = Object.assign({}, self.state.ticking); delete tk2[id];
      var todos = (self.state[key] || []).map(function (x) { return x.id === id ? Object.assign({}, x, { done: true }) : x; });
      var ch = { ticking: tk2 }; ch[key] = todos;
      self.setState(ch);
      if (!todos.filter(function (x) { return !x.done; }).length) self.celebrate({ title: 'All caught up', line: 'Every to-do is done. Nothing left on your list.' });
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
    var DATA = (p.data && typeof p.data === 'object') ? p.data : SAMPLE_TODOS, TODAY = DATA.today;
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

    t.hit = alpha(t.primary, dark ? 0.35 : 0.16);
    // A new account (empty view) has its own list and no deals yet.
    var TK = isEmpty ? 'todosE' : 'todos', list = st[TK] || [], live = isSample || isEmpty;
    function setList(next, extra) { var ch = Object.assign({}, extra || {}); ch[TK] = next; self.setState(ch); }
    var DEALS = isEmpty ? [] : DATA.deals;
    var BRANDS = DEALS.map(function (d) { return d[0]; });
    function parse(x) {
      var deal = x.deal, text = x.text;
      var m2 = /^for\s+(.+?)\s*[-:,]\s*(.*)$/i.exec(x.text || '');
      if (m2) {
        var w = m2[1].trim().toLowerCase();
        for (var i = 0; i < BRANDS.length; i++) if (BRANDS[i].toLowerCase().indexOf(w) === 0 || w.indexOf(BRANDS[i].toLowerCase()) === 0) { deal = deal || BRANDS[i]; text = m2[2] ? m2[2].charAt(0).toUpperCase() + m2[2].slice(1) : x.text; break; }
      }
      return { deal: deal, text: text };
    }
    function dueInfo(iso) {
      if (!iso) return { label: 'No due date', bg: t.fill, fg: t.mutedFg, group: 'later' };
      var d = new Date(iso + 'T00:00:00'), today = new Date(TODAY + 'T00:00:00');
      var diff = Math.round((d - today) / 864e5);
      var label = MS[d.getMonth()] + ' ' + d.getDate();
      if (diff < 0) return { label: 'Late, ' + label, bg: t.badBg, fg: t.badFg, group: 'late' };
      if (diff === 0) return { label: 'Today', bg: t.primary, fg: t.primaryFg, group: 'today' };
      if (diff === 1) return { label: 'Tomorrow', bg: t.fill, fg: t.fg, group: 'soon' };
      return { label: label, bg: t.fill, fg: t.fg, group: 'soon' };
    }
    function closeAll() { self.setState({ menu: -1, dealPop: false, dealQ: '' }); }
    function row(x, i) {
      var pr = parse(x), di = dueInfo(x.due), open = st.menu === x.id, tk = !!st.ticking[x.id];
      return { text: pr.text, deal: pr.deal, dealL: pr.deal ? pr.deal.charAt(0) : '', hasDeal: !!pr.deal, due: di.label, dueBg: di.bg, dueFg: di.fg, group: di.group,
        on: tk || x.done, box: box(t, tk || x.done), fg: tk ? t.mutedFg : t.fg, aria: (x.done ? 'Mark not done: ' : 'Mark done: ') + pr.text,
        strike: tk ? 'a-strike' : '', size: tk ? '100% 1.5px' : '0% 1.5px', cls: tk ? 'a-gone' : 'a-in', delay: tk ? '0s' : ((i || 0) * 0.04).toFixed(2) + 's',
        menuOpen: open, popOpen: open && !mob, menuBg: open ? t.fill : 'transparent', line: '1px solid ' + t.line,
        toggle: function () {
          if (!self.guard()) { closeAll(); return; }
          if (x.done) { setList((self.state[TK] || []).map(function (y) { return y.id === x.id ? Object.assign({}, y, { done: false }) : y; })); self.emit('todo.setDone', { id: x.dbId !== undefined ? x.dbId : x.id, done: false }, 'Could not update the to-do'); return; }
          if (!self.state.ticking[x.id]) { self.tick(x.id, TK); self.emit('todo.setDone', { id: x.dbId !== undefined ? x.dbId : x.id, done: true }, 'Could not update the to-do'); }
        },
        toggleMenu: function () { self.setState({ menu: open ? -1 : x.id, dealPop: false }); },
        remove: function () { if (!self.guard()) { closeAll(); return; } var before = self.state[TK] || []; setList(before.filter(function (y) { return y.id !== x.id; }), { menu: -1 }); self.emit('todo.delete', { id: x.dbId !== undefined ? x.dbId : x.id }, 'Could not delete the to-do'); self.toast('To-do deleted', '', function () { setList(before); self.emit('todo.restore', { id: x.dbId !== undefined ? x.dbId : x.id }, 'Could not undo'); }); } };
    }
    var openRows = list.filter(function (x) { return !x.done; }).map(function (x, i) { return row(x, i); });
    var G = [['late', 'Late', t.destr], ['today', 'Today', t.fg], ['soon', 'Coming up', t.fg], ['later', 'No due date', t.fg]];
    var groups = !live ? [] : G.map(function (g) { var items = openRows.filter(function (r) { return r.group === g[0]; }); if (items.length) items[items.length - 1].line = '1px solid transparent'; return { label: g[1], fg: g[2], late: g[0] === 'late', count: String(items.length), items: items }; }).filter(function (g) { return g.items.length > 0; });
    var done = list.filter(function (x) { return x.done; }).map(function (x) { return row(x); });
    var total = list.length, dn = done.length + Object.keys(st.ticking).length, pctN = total ? Math.round(dn / total * 100) : 0;
    function add() {
      var tx = (st.draft || '').trim(); if (!tx) return;
      if (!self.guard()) return;
      if (isError) {
        // The list could not load, so saving fails too. The text stays in the box.
        self.toastErr('Could not add your to-do', 'Check your connection and try again.', function () { self.retryLoad(); });
        return;
      }
      var id = list.reduce(function (a, x) { return Math.max(a, x.id); }, 0) + 1;
      setList(list.concat([{ id: id, text: tx, deal: st.newDeal, due: st.newDue, done: false }]), { draft: '', newDeal: '', newDue: '' });
      var pr = parse({ text: tx, deal: st.newDeal });
      self.toast('To-do added', pr.deal ? 'Linked to ' + pr.deal : 'No deal linked');
      self.emit('todo.create', { text: pr.text, deal: pr.deal || '', due: st.newDue || '' }, 'Could not add your to-do');
    }
    var hasDraft = !!(st.draft || '').trim();
    var auto = parse({ text: st.draft || '', deal: '' }).deal;
    var pick = st.newDeal || auto || '';
    var dq = (st.dealQ || '').trim().toLowerCase();
    function split(label) { if (!dq) return { pre: label, hit: '', post: '', hasHit: false }; var i = label.toLowerCase().indexOf(dq); if (i < 0) return { pre: label, hit: '', post: '', hasHit: false }; return { pre: label.slice(0, i), hit: label.slice(i, i + dq.length), post: label.slice(i + dq.length), hasHit: true }; }
    var opts = [['', 0]].concat(DEALS).filter(function (d) { return !dq || (d[0] && d[0].toLowerCase().indexOf(dq) !== -1); }).map(function (d) {
      var on = (st.newDeal || '') === d[0]; var lab = d[0] || 'No deal';
      return Object.assign({ on: on, check: on ? 'visible' : 'hidden', l: d[0] ? d[0].charAt(0) : '', avBg: d[0] ? t.fill : 'transparent', avFg: t.fg, amount: d[1] ? fmt(d[1]) : '', bg: on ? t.hv : 'transparent',
        pick: function () { self.setState({ newDeal: d[0], dealPop: false, dealQ: '' }); try { self.dealBtn && self.dealBtn.focus(); } catch (e) {} } }, split(lab));
    });
    var openRow = null; openRows.forEach(function (r) { if (r.menuOpen) openRow = r; });
    var sheetR = t.rDialog + ' ' + t.rDialog + ' 0 0';
    var page = {
      minH: mob ? '100vh' : '900px', cardPad: mob ? '12px' : '16px',
      showProg: live, progBox: 'display: flex; align-items: center; gap: 10px; ' + (mob ? 'width: 100%' : 'width: 240px; max-width: 100%'),
      skTrack: sk('auto', '6px', t.rCtl) + '; flex: 1 1 auto', skProg: sk('78px', '12px'),
      progress: dn + ' of ' + total + ' done', pct: pctN + '%', pctNum: String(pctN),
      draft: st.draft, setDraft: function (e) { self.setState({ draft: e.target.value }); }, draftKey: function (e) { if (e.key === 'Enter') add(); }, addItem: add,
      inRef: function (el) { self.inEl = el; },
      noDraft: !hasDraft, addOp: hasDraft ? '1' : '0.4',
      addBtn: k.btnP + (mob ? '; flex: 1 1 100%; height: 40px' : ''),
      dealWrap: mob ? 'position: relative; flex: 1 1 0; min-width: 0' : 'position: relative',
      dealBtn: 'padding: 0 10px 0 8px; max-width: 260px; ' + k.btnS + (mob ? '; width: 100%; max-width: none; height: 36px; justify-content: flex-start' : ''),
      dealLabelSt: 'overflow: hidden; text-overflow: ellipsis; color: ' + (pick ? t.fg : t.mutedFg) + (mob ? '; flex: 1 1 auto; min-width: 0; text-align: left' : ''),
      spacer: mob ? 'display: none' : 'flex: 1 1 auto',
      dueWrap: mob ? 'flex: 1 1 0; min-width: 0' : 'width: 156px', dueSize: mob ? 'md' : 'sm',
      rowPad: mob ? '14px 2px 14px 10px' : '14px 6px 14px 14px', menuBtn: k.icoS + (mob ? '; width: 36px; height: 36px; margin: -4px 0 0' : ''),
      chipMax: mob ? 'max-width: 100%' : '',
      dealPop: st.dealPop, dealPopOn: st.dealPop && !mob, dealSheet: st.dealPop && mob, dealBtnRef: function (el) { self.dealBtn = el; },
      toggleDealPop: function () { var o = !self.state.dealPop; self.setState({ dealPop: o, dealQ: '', menu: -1 }); if (o && !mob) setTimeout(function () { try { self.dealInput && self.dealInput.focus(); } catch (e) {} }, 40); },
      dealRef: function (el) { self.dealInput = el; }, dealQ: st.dealQ, setDealQ: function (e) { self.setState({ dealQ: e.target.value }); },
      dealKey: function (e) { if (e.key === 'Enter' && dq && opts[0]) opts[0].pick(); if (e.key === 'Escape') { self.setState({ dealPop: false }); try { self.dealBtn && self.dealBtn.focus(); } catch (x) {} } },
      dealOpts: opts, noDealMatch: opts.length === 0, noDealsYet: !DEALS.length && !dq,
      optX: mob ? 'min-height: 44px; font-size: 15px' : '',
      searchH: mob ? '40px' : '36px', searchFs: mob ? '16px' : '14px',
      hasDealPick: !!pick, noDealPick: !pick, dealL: pick ? pick.charAt(0) : '', dealFg: pick ? t.fg : t.mutedFg,
      dealLabel: st.newDeal || (auto ? auto : 'Link a deal'),
      hintOn: !!auto && !st.newDeal, hint: 'Talby will link this to ' + (auto || '') + ' because it starts with "for ' + (auto || '').toLowerCase() + '"',
      newDue: st.newDue, setNewDue: function (v) { self.setState({ newDue: v }); },
      groups: groups, noOpen: live && total > 0 && openRows.length === 0, noTodos: live && total === 0,
      todoEmpty: blk('empty', 'M13 5h8M13 12h8M13 19h8M3 17l2 2 4-4M3 7l2 2 4-4', 'No to-dos yet', 'Add the small jobs that keep your deals moving. Start one with for and a brand name to link it to that deal.', 'Add a to-do', function () { try { self.inEl && self.inEl.focus(); } catch (e) {} }),
      todoErr: blk('error', IC.wifi, 'We could not load your to-dos', 'Check your connection and try again. Nothing was lost.', 'Try again', function () { self.retryLoad(); }),
      skHead: sk('96px', '12px') + '; background: ' + t.fillHover, skCount: sk('12px', '12px') + '; background: ' + t.fillHover, skBox: sk('16px', '16px', t.rBox) + '; margin-top: 2px', skChip1: sk('92px', '24px', t.rCtl), skChip2: sk('104px', '24px', t.rCtl), skDots: sk('20px', '6px', '3px') + '; margin: 8px 4px 0 0',
      skRows: ['74%', '58%', '66%'].map(function (w, i) { return { l1: sk(w, '13px') + '; margin-top: 3px', line: i < 2 ? '1px solid ' + t.line : '1px solid transparent' }; }),
      blockPad: mob ? '36px 12px' : '44px 24px',
      showDoneSec: live && total > 0,
      done: done, doneCount: String(done.length), noDone: done.length === 0, showDone: st.showDone, toggleDone: function () { self.setState({ showDone: !st.showDone }); }, doneRot: st.showDone ? 'rotate(90deg)' : 'none',
      rowSheet: mob && !!openRow, closeSheets: closeAll,
      rs: openRow ? { text: openRow.text, toggle: openRow.toggle, remove: openRow.remove, hasDeal: openRow.hasDeal } : { text: '', toggle: closeAll, remove: closeAll, hasDeal: false },
      sheetBox: 'position: absolute; left: 0; right: 0; bottom: 0; max-height: 82vh; display: flex; flex-direction: column; padding: 8px 12px 24px; box-sizing: border-box; background: ' + t.card + '; color: ' + t.fg + '; border: 1px solid ' + t.border + '; border-bottom: none; border-radius: ' + sheetR + '; box-shadow: ' + t.shPop,
      sheetGrip: 'display: block; flex: 0 0 4px; width: 36px; height: 4px; margin: 0 auto 12px; border-radius: 2px; background: ' + t.borderStrong,
      sheetItem: k.item + '; gap: 12px; min-height: 46px; font-size: 15px'
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
    out.chatHidden = st.appear || st.nav || st.cmd || !!st.add || !!(mob && (st.dealPop || st.menu !== -1));
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
              <SSidebar account={$s0?.account} active={"todos"} color={$s0?.eff} dark={$s0?.dark} collapsed={$s0?.collapsed} plan={$s0?.plan} fresh={$s0?.sbFresh} />
            </div>
          </div>
        </>) : null}
        <main {...S(`flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 16px; padding: ${I($s0?.mainPad)}; box-sizing: border-box`)}>
          <STopbar account={$s0?.account} title={"To-dos"} mobile={$s0?.mob} quiet={$s0?.quietBell} color={$s0?.eff} dark={$s0?.dark} onNav={$s0?.toggleNav} onSearch={$s0?.openCmd} onAppearance={$s0?.openAppear} onAdd={$s0?.openAdd} />
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
          <div className={"a-in"} {...S("display: flex; align-items: flex-end; justify-content: space-between; gap: 12px 16px; flex-wrap: wrap; padding: 0 4px")}>
            <div {...S("display: flex; flex-direction: column; gap: 4px; min-width: 0")}>
              <h1 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: ${I($s0?.h1Fs)}; font-weight: 600; letter-spacing: ${I($s0?.t?.hTrack)}; text-transform: ${I($s0?.t?.hCase)}; line-height: 1.15`)}>
                {"To-dos"}
              </h1>
              <p {...S(`margin: 0; color: ${I($s0?.t?.mutedFg)}`)}>
                {"The small jobs that move your deals forward."}
              </p>
            </div>
            {$s0?.showProg ? (<>
              <div {...S($s0?.progBox)}>
                <div role={"progressbar"} aria-label={"To-dos done"} aria-valuemin={"0"} aria-valuemax={"100"} aria-valuenow={$s0?.pctNum} {...S(`flex: 1 1 auto; height: 6px; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.off)}; overflow: hidden`)}>
                  <div {...S(`height: 6px; width: ${I($s0?.pct)}; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.primary)}; transition: width 0.5s cubic-bezier(.4,0,.2,1)`)} />
                </div>
                <span {...S("font-weight: 500; white-space: nowrap; font-variant-numeric: tabular-nums")}>
                  {T($s0?.progress)}
                </span>
              </div>
            </>) : null}
            {$s0?.isLoading ? (<>
              <div aria-hidden={"true"} {...S($s0?.progBox)}>
                <span className={"a-pulse"} {...S($s0?.skTrack)} />
                <span className={"a-pulse"} {...S($s0?.skProg)} />
              </div>
            </>) : null}
          </div>
          <section className={"a-in"} {...S(`animation-delay: 0.05s; min-width: 0; padding: ${I($s0?.cardPad)}; display: flex; flex-direction: column; gap: 6px; ${I($s0?.k?.card)}`)}>
            <div {...S("display: flex; flex-direction: column; gap: 10px; padding: 2px 2px 14px")}>
              <input className={"ti"} aria-label={"New to-do"} placeholder={"Add a to-do, then press Enter"} value={V0($s0?.draft, "")} onChange={$s0?.setDraft} onKeyDown={$s0?.draftKey} {...S(`height: 42px; font-size: 15px; ${I($s0?.k?.input)}`, $s0?.inRef)} />
              <div {...S("display: flex; align-items: center; gap: 8px; flex-wrap: wrap")}>
                <div {...S($s0?.dealWrap)}>
                  <button className={"tb tg"} type={"button"} onClick={$s0?.toggleDealPop} aria-haspopup={"listbox"} aria-expanded={$s0?.dealPop} {...S($s0?.dealBtn, $s0?.dealBtnRef)}>
                    {$s0?.hasDealPick ? (<>
                      <span {...S(`width: 20px; height: 20px; flex: 0 0 20px; border-radius: 10px; background: ${I($s0?.t?.card)}; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700`)}>
                        {T($s0?.dealL)}
                      </span>
                    </>) : null}
                    {$s0?.noDealPick ? (<>
                      <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("margin-left: 4px")}>
                        <path d={"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"} />
                      </svg>
                    </>) : null}
                    <span {...S($s0?.dealLabelSt)}>
                      {T($s0?.dealLabel)}
                    </span>
                    <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"m7 15 5 5 5-5M7 9l5-5 5 5"} />
                    </svg>
                  </button>
                  {$s0?.dealPopOn ? (<>
                    <div onClick={$s0?.toggleDealPop} {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 29")} />
                    <div role={"dialog"} aria-label={"Link a deal"} className={"a-drop"} {...S(`position: absolute; top: 40px; left: 0; width: 300px; z-index: 30; ${I($s0?.k?.pop)}`)}>
                      <label className={"ti"} {...S(`display: flex; align-items: center; gap: 8px; height: ${I($s0?.searchH)}; margin-bottom: 6px; padding: 0 12px; box-sizing: border-box; border-radius: ${I($s0?.t?.rItem)}; background: ${I($s0?.t?.fill)}; color: ${I($s0?.t?.mutedFg)}`)}>
                        <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 14px")}>
                          <circle cx={"11"} cy={"11"} r={"8"} />
                          <path d={"m21 21-4.3-4.3"} />
                        </svg>
                        <input aria-label={"Search deals"} placeholder={"Search deals"} value={V0($s0?.dealQ, "")} onChange={$s0?.setDealQ} onKeyDown={$s0?.dealKey} {...S(`flex: 1 1 auto; min-width: 0; height: 34px; border: none; outline: none; background: transparent; font: inherit; font-size: ${I($s0?.searchFs)}; color: ${I($s0?.t?.fg)}; padding: 0`, $s0?.dealRef)} />
                      </label>
                      <div role={"listbox"} aria-label={"Deals"} {...S("max-height: 260px; overflow-y: auto")}>
                        {A($s0?.dealOpts).map((it, i) => {
                          const $s1 = { ...$s0, "o": it, $index: i };
                          return (<React.Fragment key={i}>
                            <button className={"tb tg"} type={"button"} role={"option"} aria-selected={$s1?.o?.on} onClick={$s1?.o?.pick} {...S(`background: ${I($s1?.o?.bg)}; ${I($s1?.k?.item)}; ${I($s1?.optX)}`)}>
                              <span {...S(`width: 22px; height: 22px; flex: 0 0 22px; border-radius: 11px; background: ${I($s1?.o?.avBg)}; color: ${I($s1?.o?.avFg)}; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700`)}>
                                {T($s1?.o?.l)}
                              </span>
                              <span {...S("flex: 1 1 auto; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                                {T($s1?.o?.pre)}
                                {$s1?.o?.hasHit ? (<>
                                  <mark {...S(`background: ${I($s1?.t?.hit)}; color: inherit; border-radius: 3px; padding: 0 1px`)}>
                                    {T($s1?.o?.hit)}
                                  </mark>
                                </>) : null}
                                {T($s1?.o?.post)}
                              </span>
                              <span {...S(`font-size: 12px; color: ${I($s1?.t?.mutedFg)}; font-variant-numeric: tabular-nums`)}>
                                {T($s1?.o?.amount)}
                              </span>
                              <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 14px; visibility: ${I($s1?.o?.check)}`)}>
                                <path d={"M20 6 9 17l-5-5"} />
                              </svg>
                            </button>
                          </React.Fragment>);
                        })}
                        {$s0?.noDealMatch ? (<>
                          <div {...S(`padding: 18px 10px; text-align: center; color: ${I($s0?.t?.mutedFg)}`)}>
                            {"No deals match \""}{T($s0?.dealQ)}{"\""}
                          </div>
                        </>) : null}
                        {$s0?.noDealsYet ? (<>
                          <div {...S(`padding: 12px 10px 8px; font-size: 13px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}`)}>
                            {"No deals yet. Once you add one, you can link to-dos to it here."}
                          </div>
                        </>) : null}
                      </div>
                    </div>
                  </>) : null}
                </div>
                <div {...S($s0?.dueWrap)}>
                  <SDatePicker value={$s0?.newDue} onChange={$s0?.setNewDue} placeholder={"Due date"} size={$s0?.dueSize} label={"Due date"} color={$s0?.eff} dark={$s0?.dark} />
                </div>
                <div {...S($s0?.spacer)} />
                <button className={"tb tg"} type={"button"} onClick={$s0?.addItem} aria-disabled={$s0?.noDraft} {...S(`opacity: ${I($s0?.addOp)}; ${I($s0?.addBtn)}`)}>
                  {"Add to-do"}
                </button>
              </div>
              {$s0?.hintOn ? (<>
                <span className={"a-fade"} {...S(`display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: ${I($s0?.t?.mutedFg)}`)}>
                  <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"} />
                  </svg>
                  {T($s0?.hint)}
                </span>
              </>) : null}
            </div>
            {A($s0?.groups).map((it, i) => {
              const $s1 = { ...$s0, "g": it, $index: i };
              return (<React.Fragment key={i}>
                <div {...S(`display: flex; align-items: center; justify-content: space-between; height: 40px; padding: 0 14px; border-radius: ${I($s1?.t?.rTile)}; background: ${I($s1?.t?.tile)}`)}>
                  <span {...S(`display: inline-flex; align-items: center; gap: 8px; font-weight: 600; color: ${I($s1?.g?.fg)}`)}>
                    {$s1?.g?.late ? (<>
                      <span className={"a-ping"} {...S("width: 6px; height: 6px; border-radius: 3px; background: #EF4444")} />
                    </>) : null}
                    {T($s1?.g?.label)}
                  </span>
                  <span {...S(`font-size: 13px; font-weight: 500; color: ${I($s1?.t?.mutedFg)}; font-variant-numeric: tabular-nums`)}>
                    {T($s1?.g?.count)}
                  </span>
                </div>
                {A($s1?.g?.items).map((it, i) => {
                  const $s2 = { ...$s1, "r": it, $index: i };
                  return (<React.Fragment key={i}>
                    <div className={$s2?.r?.cls} {...S(`animation-delay: ${I($s2?.r?.delay)}; position: relative; display: flex; align-items: flex-start; gap: 12px; padding: ${I($s2?.rowPad)}; border-bottom: ${I($s2?.r?.line)}`)}>
                      <button className={"tb"} type={"button"} role={"checkbox"} aria-checked={$s2?.r?.on} aria-label={$s2?.r?.aria} onClick={$s2?.r?.toggle} {...S(`margin-top: 2px; ${I($s2?.r?.box)}`)}>
                        {$s2?.r?.on ? (<>
                          <svg className={"a-check"} width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={"M20 6 9 17l-5-5"} />
                          </svg>
                        </>) : null}
                      </button>
                      <div {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 8px")}>
                        <span {...S("line-height: 1.5")}>
                          <span className={$s2?.r?.strike} {...S(`color: ${I($s2?.r?.fg)}; background-image: linear-gradient(currentColor, currentColor); background-repeat: no-repeat; background-position: 0 58%; background-size: ${I($s2?.r?.size)}; -webkit-box-decoration-break: clone; box-decoration-break: clone; transition: color 0.3s ease`)}>
                            {T($s2?.r?.text)}
                          </span>
                        </span>
                        <span {...S("display: flex; align-items: center; gap: 6px; flex-wrap: wrap")}>
                          {$s2?.r?.hasDeal ? (<>
                            <a href={H("SDeal.dc.html")} className={"tb tg"} {...S(`--hv: ${I($s2?.t?.hoverCard)}; display: inline-flex; align-items: center; gap: 6px; height: 24px; padding: 0 9px 0 3px; box-sizing: border-box; border: 1px solid ${I($s2?.t?.border)}; border-radius: ${I($s2?.t?.rCtl)}; background: ${I($s2?.t?.card)}; color: ${I($s2?.t?.fg)}; font-size: 12px; font-weight: 500; white-space: nowrap; text-decoration: none; ${I($s2?.chipMax)}`)}>
                              <span {...S(`width: 18px; height: 18px; flex: 0 0 18px; border-radius: 9px; background: ${I($s2?.t?.fill)}; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700`)}>
                                {T($s2?.r?.dealL)}
                              </span>
                              <span {...S("overflow: hidden; text-overflow: ellipsis")}>
                                {T($s2?.r?.deal)}
                              </span>
                            </a>
                          </>) : null}
                          <span {...S(`display: inline-flex; align-items: center; gap: 5px; height: 24px; padding: 0 9px; box-sizing: border-box; border-radius: ${I($s2?.t?.rCtl)}; background: ${I($s2?.r?.dueBg)}; color: ${I($s2?.r?.dueFg)}; font-size: 12px; font-weight: 500; white-space: nowrap`)}>
                            <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={"M8 2v4M16 2v4M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM3 10h18"} />
                            </svg>
                            {T($s2?.r?.due)}
                          </span>
                        </span>
                      </div>
                      <button className={"tb tg"} type={"button"} onClick={$s2?.r?.toggleMenu} aria-label={"To-do actions"} aria-haspopup={"menu"} aria-expanded={$s2?.r?.menuOpen} {...S(`background: ${I($s2?.r?.menuBg)}; --hv: ${I($s2?.t?.fill)}; ${I($s2?.menuBtn)}`)}>
                        <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"currentColor"} aria-hidden={"true"}>
                          <circle cx={"5"} cy={"12"} r={"1.7"} />
                          <circle cx={"12"} cy={"12"} r={"1.7"} />
                          <circle cx={"19"} cy={"12"} r={"1.7"} />
                        </svg>
                      </button>
                      {$s2?.r?.popOpen ? (<>
                        <div onClick={$s2?.r?.toggleMenu} {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 19")} />
                        <div role={"menu"} aria-label={"To-do actions"} className={"a-drop"} {...S(`position: absolute; top: 46px; right: 6px; width: 200px; z-index: 20; ${I($s2?.k?.pop)}`)}>
                          <button className={"tb tg"} type={"button"} role={"menuitem"} onClick={$s2?.r?.toggle} {...S($s2?.k?.item)}>
                            {"Mark done"}
                          </button>
                          {$s2?.r?.hasDeal ? (<>
                            <a href={H("SDeal.dc.html")} role={"menuitem"} className={"tb tg"} {...S($s2?.k?.item)}>
                              {"Open the deal"}
                            </a>
                          </>) : null}
                          <div {...S(`height: 1px; margin: 6px -6px; background: ${I($s2?.t?.line)}`)} />
                          <button className={"tb tg"} type={"button"} role={"menuitem"} onClick={$s2?.r?.remove} {...S(`${I($s2?.k?.item)}; color: ${I($s2?.t?.destr)};`)}>
                            {"Delete"}
                          </button>
                        </div>
                      </>) : null}
                    </div>
                  </React.Fragment>);
                })}
              </React.Fragment>);
            })}
            {$s0?.noOpen ? (<>
              <div className={"a-pop"} {...S("display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 36px 16px; text-align: center")}>
                <span className={"a-check"} {...S(`width: 44px; height: 44px; border-radius: 22px; background: ${I($s0?.t?.okBg)}; color: ${I($s0?.t?.okFg)}; display: inline-flex; align-items: center; justify-content: center`)}>
                  <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M20 6 9 17l-5-5"} />
                  </svg>
                </span>
                <span {...S("font-weight: 600")}>
                  {"All caught up"}
                </span>
                <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                  {"Nothing left on your list. Add one above when something comes up."}
                </span>
              </div>
            </>) : null}
            {$s0?.noTodos ? (<>
              <div {...S(`border-top: 1px solid ${I($s0?.t?.line)}`)}>
                <div className={"a-fade"} {...S(`display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: ${I($s0?.blockPad)}; box-sizing: border-box; text-align: center`)}>
                  <span {...S(`display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.todoEmpty?.tileBg)}; color: ${I($s0?.todoEmpty?.tileFg)}`)}>
                    <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={$s0?.todoEmpty?.icon} />
                    </svg>
                  </span>
                  <div {...S("display: flex; flex-direction: column; align-items: center; gap: 4px; max-width: 380px")}>
                    <span {...S("font-size: 15px; font-weight: 600")}>
                      {T($s0?.todoEmpty?.title)}
                    </span>
                    {$s0?.todoEmpty?.hasSub ? (<>
                      <span {...S(`font-size: 13px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}`)}>
                        {T($s0?.todoEmpty?.sub)}
                      </span>
                    </>) : null}
                  </div>
                  {$s0?.todoEmpty?.hasCta ? (<>
                    <div {...S("display: flex; flex-wrap: wrap; justify-content: center; gap: 8px")}>
                      <button type={"button"} className={"tb tp"} onClick={$s0?.todoEmpty?.act} {...S(`${I($s0?.k?.pSm)}; height: ${I($s0?.stH)}; flex-shrink: 0`)}>
                        {T($s0?.todoEmpty?.cta)}
                      </button>
                      {$s0?.todoEmpty?.has2 ? (<>
                        <button type={"button"} className={"tb tg"} onClick={$s0?.todoEmpty?.act2} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.oSm)}; height: ${I($s0?.stH)}`)}>
                          {T($s0?.todoEmpty?.cta2)}
                        </button>
                      </>) : null}
                    </div>
                  </>) : null}
                </div>
              </div>
            </>) : null}
            {$s0?.isLoading ? (<>
              <div role={"status"} aria-label={"Loading your to-dos"} {...S("display: flex; flex-direction: column")}>
                <div aria-hidden={"true"} {...S(`display: flex; align-items: center; justify-content: space-between; height: 40px; padding: 0 14px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.tile)}`)}>
                  <span className={"a-pulse"} {...S($s0?.skHead)} />
                  <span className={"a-pulse"} {...S($s0?.skCount)} />
                </div>
                {A($s0?.skRows).map((it, i) => {
                  const $s1 = { ...$s0, "s": it, $index: i };
                  return (<React.Fragment key={i}>
                    <div aria-hidden={"true"} {...S(`display: flex; align-items: flex-start; gap: 12px; padding: 14px 6px 14px 14px; border-bottom: ${I($s1?.s?.line)}`)}>
                      <span className={"a-pulse"} {...S($s1?.skBox)} />
                      <div {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 10px")}>
                        <span className={"a-pulse"} {...S($s1?.s?.l1)} />
                        <span {...S("display: flex; gap: 6px")}>
                          <span className={"a-pulse"} {...S($s1?.skChip1)} />
                          <span className={"a-pulse"} {...S($s1?.skChip2)} />
                        </span>
                      </div>
                      <span className={"a-pulse"} {...S($s1?.skDots)} />
                    </div>
                  </React.Fragment>);
                })}
              </div>
            </>) : null}
            {$s0?.isError ? (<>
              <div role={"alert"} {...S(`border-top: 1px solid ${I($s0?.t?.line)}`)}>
                <div className={"a-fade"} {...S(`display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: ${I($s0?.blockPad)}; box-sizing: border-box; text-align: center`)}>
                  <span {...S(`display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.todoErr?.tileBg)}; color: ${I($s0?.todoErr?.tileFg)}`)}>
                    <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={$s0?.todoErr?.icon} />
                    </svg>
                  </span>
                  <div {...S("display: flex; flex-direction: column; align-items: center; gap: 4px; max-width: 380px")}>
                    <span {...S("font-size: 15px; font-weight: 600")}>
                      {T($s0?.todoErr?.title)}
                    </span>
                    {$s0?.todoErr?.hasSub ? (<>
                      <span {...S(`font-size: 13px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}`)}>
                        {T($s0?.todoErr?.sub)}
                      </span>
                    </>) : null}
                  </div>
                  {$s0?.todoErr?.hasCta ? (<>
                    <div {...S("display: flex; flex-wrap: wrap; justify-content: center; gap: 8px")}>
                      <button type={"button"} className={"tb tp"} onClick={$s0?.todoErr?.act} {...S(`${I($s0?.k?.pSm)}; height: ${I($s0?.stH)}; flex-shrink: 0`)}>
                        {T($s0?.todoErr?.cta)}
                      </button>
                      {$s0?.todoErr?.has2 ? (<>
                        <button type={"button"} className={"tb tg"} onClick={$s0?.todoErr?.act2} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.oSm)}; height: ${I($s0?.stH)}`)}>
                          {T($s0?.todoErr?.cta2)}
                        </button>
                      </>) : null}
                    </div>
                  </>) : null}
                </div>
              </div>
            </>) : null}
            {$s0?.showDoneSec ? (<>
              <button type={"button"} className={"tb tt"} onClick={$s0?.toggleDone} aria-expanded={$s0?.showDone} {...S(`display: flex; align-items: center; gap: 8px; height: 40px; margin-top: 6px; padding: 0 12px; border: none; border-radius: ${I($s0?.t?.rTile)}; background: transparent; color: ${I($s0?.t?.mutedFg)}; font: inherit; font-size: 13px; font-weight: 500; text-align: left; cursor: pointer`)}>
                <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`transform: ${I($s0?.doneRot)}; transition: transform 0.2s ease`)}>
                  <path d={"m9 18 6-6-6-6"} />
                </svg>
                {"Completed"}
                <span {...S("font-variant-numeric: tabular-nums")}>
                  {T($s0?.doneCount)}
                </span>
              </button>
              {$s0?.showDone ? (<>
                {A($s0?.done).map((it, i) => {
                  const $s1 = { ...$s0, "r": it, $index: i };
                  return (<React.Fragment key={i}>
                    <div className={"a-in"} {...S(`display: flex; align-items: center; gap: 12px; padding: 12px 6px 12px 14px; border-bottom: 1px solid ${I($s1?.t?.line)}`)}>
                      <button className={"tb"} type={"button"} role={"checkbox"} aria-checked={$s1?.r?.on} aria-label={$s1?.r?.aria} onClick={$s1?.r?.toggle} {...S($s1?.r?.box)}>
                        {$s1?.r?.on ? (<>
                          <svg className={"a-check"} width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={"M20 6 9 17l-5-5"} />
                          </svg>
                        </>) : null}
                      </button>
                      <span {...S("flex: 1 1 auto; min-width: 0; line-height: 1.5")}>
                        <span {...S(`color: ${I($s1?.t?.mutedFg)}; background-image: linear-gradient(currentColor, currentColor); background-repeat: no-repeat; background-position: 0 58%; background-size: 100% 1.5px; -webkit-box-decoration-break: clone; box-decoration-break: clone`)}>
                          {T($s1?.r?.text)}
                        </span>
                      </span>
                    </div>
                  </React.Fragment>);
                })}
                {$s0?.noDone ? (<>
                  <div {...S(`padding: 4px 12px 12px 34px; color: ${I($s0?.t?.mutedFg)}`)}>
                    {"Finished to-dos move here."}
                  </div>
                </>) : null}
              </>) : null}
            </>) : null}
          </section>
        </main>
        {$s0?.dealSheet ? (<>
          <div {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 70")}>
            <button type={"button"} aria-label={"Close"} className={"a-fade"} onClick={$s0?.closeSheets} {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; padding: 0; border: none; background: ${I($s0?.t?.overlay)}; cursor: default`)} />
            <div role={"dialog"} aria-label={"Link a deal"} className={"a-up"} {...S($s0?.sheetBox)}>
              <span aria-hidden={"true"} {...S($s0?.sheetGrip)} />
              <span {...S("display: flex; flex-direction: column; gap: 2px; padding: 0 10px 12px")}>
                <span {...S("font-weight: 600")}>
                  {"Link a deal"}
                </span>
                <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}`)}>
                  {"The to-do shows up on that deal too."}
                </span>
              </span>
              <label className={"ti"} {...S(`display: flex; align-items: center; gap: 8px; height: ${I($s0?.searchH)}; margin-bottom: 6px; padding: 0 12px; box-sizing: border-box; border-radius: ${I($s0?.t?.rItem)}; background: ${I($s0?.t?.fill)}; color: ${I($s0?.t?.mutedFg)}`)}>
                <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 14px")}>
                  <circle cx={"11"} cy={"11"} r={"8"} />
                  <path d={"m21 21-4.3-4.3"} />
                </svg>
                <input aria-label={"Search deals"} placeholder={"Search deals"} value={V0($s0?.dealQ, "")} onChange={$s0?.setDealQ} onKeyDown={$s0?.dealKey} {...S(`flex: 1 1 auto; min-width: 0; height: 34px; border: none; outline: none; background: transparent; font: inherit; font-size: ${I($s0?.searchFs)}; color: ${I($s0?.t?.fg)}; padding: 0`, $s0?.dealRef)} />
              </label>
              <div role={"listbox"} aria-label={"Deals"} {...S("flex: 1 1 auto; min-height: 0; overflow-y: auto")}>
                {A($s0?.dealOpts).map((it, i) => {
                  const $s1 = { ...$s0, "o": it, $index: i };
                  return (<React.Fragment key={i}>
                    <button className={"tb tg"} type={"button"} role={"option"} aria-selected={$s1?.o?.on} onClick={$s1?.o?.pick} {...S(`background: ${I($s1?.o?.bg)}; ${I($s1?.k?.item)}; ${I($s1?.optX)}`)}>
                      <span {...S(`width: 22px; height: 22px; flex: 0 0 22px; border-radius: 11px; background: ${I($s1?.o?.avBg)}; color: ${I($s1?.o?.avFg)}; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700`)}>
                        {T($s1?.o?.l)}
                      </span>
                      <span {...S("flex: 1 1 auto; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                        {T($s1?.o?.pre)}
                        {$s1?.o?.hasHit ? (<>
                          <mark {...S(`background: ${I($s1?.t?.hit)}; color: inherit; border-radius: 3px; padding: 0 1px`)}>
                            {T($s1?.o?.hit)}
                          </mark>
                        </>) : null}
                        {T($s1?.o?.post)}
                      </span>
                      <span {...S(`font-size: 12px; color: ${I($s1?.t?.mutedFg)}; font-variant-numeric: tabular-nums`)}>
                        {T($s1?.o?.amount)}
                      </span>
                      <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 14px; visibility: ${I($s1?.o?.check)}`)}>
                        <path d={"M20 6 9 17l-5-5"} />
                      </svg>
                    </button>
                  </React.Fragment>);
                })}
                {$s0?.noDealMatch ? (<>
                  <div {...S(`padding: 18px 10px; text-align: center; color: ${I($s0?.t?.mutedFg)}`)}>
                    {"No deals match \""}{T($s0?.dealQ)}{"\""}
                  </div>
                </>) : null}
                {$s0?.noDealsYet ? (<>
                  <div {...S(`padding: 12px 10px 8px; font-size: 13px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}`)}>
                    {"No deals yet. Once you add one, you can link to-dos to it here."}
                  </div>
                </>) : null}
              </div>
            </div>
          </div>
        </>) : null}
        {$s0?.rowSheet ? (<>
          <div {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 70")}>
            <button type={"button"} aria-label={"Close"} className={"a-fade"} onClick={$s0?.closeSheets} {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; padding: 0; border: none; background: ${I($s0?.t?.overlay)}; cursor: default`)} />
            <div role={"menu"} aria-label={"To-do actions"} className={"a-up"} {...S($s0?.sheetBox)}>
              <span aria-hidden={"true"} {...S($s0?.sheetGrip)} />
              <span {...S("display: flex; flex-direction: column; gap: 2px; min-width: 0; padding: 0 10px 8px")}>
                <span {...S("font-weight: 600")}>
                  {"To-do actions"}
                </span>
                <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                  {T($s0?.rs?.text)}
                </span>
              </span>
              <button className={"tb tg"} type={"button"} role={"menuitem"} onClick={$s0?.rs?.toggle} {...S($s0?.sheetItem)}>
                <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 18px; color: ${I($s0?.t?.mutedFg)}`)}>
                  <path d={"M20 6 9 17l-5-5"} />
                </svg>
                {"Mark done"}
              </button>
              {$s0?.rs?.hasDeal ? (<>
                <a href={H("SDeal.dc.html")} role={"menuitem"} className={"tb tg"} {...S($s0?.sheetItem)}>
                  <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 18px; color: ${I($s0?.t?.mutedFg)}`)}>
                    <path d={"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"} />
                  </svg>
                  {"Open the deal"}
                </a>
              </>) : null}
              <div {...S(`height: 1px; margin: 6px -12px; background: ${I($s0?.t?.line)}`)} />
              <button className={"tb tg"} type={"button"} role={"menuitem"} onClick={$s0?.rs?.remove} {...S($s0?.sheetItem)}>
                <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 18px; color: ${I($s0?.t?.mutedFg)}`)}>
                  <path d={"M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"} />
                </svg>
                {"Delete"}
              </button>
            </div>
          </div>
        </>) : null}
        {$s0?.drawerOpen ? (<>
          <div {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 88")}>
            <button type={"button"} aria-label={"Close menu"} className={"a-fade"} onClick={$s0?.closeNav} {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; padding: 0; border: none; background: ${I($s0?.t?.overlay)}; cursor: default`)} />
            <div className={"a-drawer"} {...S(`position: absolute; top: 0; bottom: 0; left: 0; width: 288px; max-width: 86%; overflow-y: auto; box-shadow: ${I($s0?.t?.shPop)}`)}>
              <SSidebar account={$s0?.account} active={"todos"} color={$s0?.eff} dark={$s0?.dark} drawer={true} plan={$s0?.plan} fresh={$s0?.sbFresh} onClose={$s0?.closeNav} />
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

export const meta = {"props":{"color":{"editor":"enum","options":["studio","sand","mac","stationery","editorial"],"default":"studio"},"dark":{"editor":"boolean","default":false},"view":{"editor":"enum","options":["sample","empty","loading","error"],"default":"sample"},"plan":{"editor":"enum","options":["active","trial","pastdue","canceled","readonly"],"default":"active"}},"preview":{"width":1440,"height":900}};
export default $r.defineBoard("STodos", Component, render, CSS, meta);
