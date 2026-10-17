// @ts-nocheck
/* eslint-disable */
'use client';
// SPayments: converted from design-source/boards/SPayments.dc.html.
// Markup, inline styles and logic are carried over exactly from the board.
// The logic class below is the board's own code, unchanged.
import * as React from 'react';
import * as $r from './_runtime';
import { DCLogic } from './_runtime';
import { SAMPLE_ACCOUNT, TalbyDates, SAMPLE_PAYMENTS } from './_data';
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
    }, {
      view: props.start === 'income' ? 'income' : 'schedule', filter: 'upcoming', q: '', range: 'month', hBar: -1, rowMenu: -1, rmTop: 0, rmLeft: 0, remind: -1, rmText: null,
      paidNow: {}, leaving: {}, periodOpen: false, period: 'Year to date', rec: false, recPick: false, recQ: '', recI: 0, recAmt: '10,550', recDate: (props.data && props.data.today) || SAMPLE_PAYMENTS.today
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
    if (prev.data !== p.data && p.data) this.setState({ paidNow: {}, leaving: {} });
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

  failOnce(key) {
    var off = false; try { off = navigator.onLine === false; } catch (e) {}
    if (off) return true;
    if (!this.props.failSave) return false;
    this._failed = this._failed || {};
    if (this._failed[key]) return false;
    this._failed[key] = true; return true;
  }
  markPaid(i, brand, amt, after, kind) {
    var self = this;
    if (!this.guard()) return false;
    if (this.failOnce('paid')) {
      this.setState({ rowMenu: -1 });
      this.toastErr(kind === 'rec' ? 'Could not record payment' : 'Could not mark as paid', 'Check your connection.', function () { self.markPaid(i, brand, amt, after, kind); });
      return false;
    }
    if (after) after();
    var row = ((this.props.data && this.props.data.payments) ? this.props.data : SAMPLE_PAYMENTS).payments[i];
    this.emit(kind === 'rec' ? 'payment.record' : 'payment.markPaid', { id: row ? row.id : i, brand: brand, amount: amt, date: kind === 'rec' ? this.state.recDate : undefined }, kind === 'rec' ? 'Could not record payment' : 'Could not mark as paid');
    var lv = Object.assign({}, this.state.leaving); lv[i] = true;
    this.setState({ leaving: lv, rowMenu: -1 });
    this._tt = this._tt || [];
    this._tt.push(setTimeout(function () {
      var o = Object.assign({}, self.state.paidNow); o[i] = true;
      var l2 = Object.assign({}, self.state.leaving); delete l2[i];
      self.setState({ paidNow: o, leaving: l2 });
    }, 320));
    var extra = 0; Object.keys(this.state.paidNow).forEach(function (x) { extra += self._amts[x] || 0; });
    this.celebrate({ title: 'You got paid', chip: '+$' + Math.round(amt).toLocaleString('en-US'), line: brand + ' paid. $' + ((self._recBase || 0) + extra + amt).toLocaleString('en-US') + ' received this year.' });
    return true;
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
    var DATA = (p.data && typeof p.data === 'object') ? p.data : SAMPLE_PAYMENTS, TODAY = DATA.today, DD = TalbyDates;
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

    var MON = MONTHS;
    var P0 = DATA.payments;
    // Only the sample view has payments. Empty starts at zero; loading and error show no rows.
    var P = (isSample ? P0 : []).map(function (x, i) { return { i: i, dbId: x.id, date: x.date || '', brand: x.brand, part: x.part, st: st.paidNow[i] ? 'paid' : x.state, amt: x.amount, late: x.state === 'over' && x.date ? Math.max(0, DD.diff(x.date, TODAY)) : 0, orig: x.state, inv: !!x.invoice }; });
    // Summaries worked out from the payments, the same way the design sample was written.
    var PAIDO = P.filter(function (x) { return x.orig === 'paid'; }), recBase = PAIDO.reduce(function (a, x) { return a + x.amt; }, 0); self._recBase = recBase;
    var byMonth = {}; P.filter(function (x) { return x.st === 'paid' && x.date; }).forEach(function (x) { var k2 = x.date.slice(0, 7); byMonth[k2] = (byMonth[k2] || 0) + x.amt; });
    var bestK = Object.keys(byMonth).sort(function (a2, b2) { return byMonth[b2] - byMonth[a2] || (a2 < b2 ? -1 : 1); })[0];
    var due30 = P.filter(function (x) { if (x.st === 'paid' || x.st === 'over' || !x.date) return false; var n = DD.diff(TODAY, x.date); return n >= 0 && n <= 30; }).sort(function (a2, b2) { return a2.date < b2.date ? -1 : 1; });
    function names(a2) { var n2 = a2.map(function (x) { return x.brand; }); return n2.length <= 1 ? (n2[0] || '') : n2.slice(0, -1).join(', ') + ' and ' + n2[n2.length - 1]; }
    var noDue = P.filter(function (x) { return x.st !== 'paid' && !x.date; }).reduce(function (a2, x) { return a2 + x.amt; }, 0);
    var recNow = P.filter(function (x) { return x.st === 'paid'; }), biggest = recNow.slice().sort(function (a2, b2) { return b2.amt - a2.amt; })[0];
    var NEG = DATA.negotiating || { count: 0, amount: 0 };
    self._amts = {}; P.forEach(function (x) { self._amts[x.i] = x.amt; });
    function inF(x, f) { if (f === 'upcoming') return x.st !== 'paid'; if (f === 'overdue') return x.st === 'over'; if (f === 'received') return x.st === 'paid'; return true; }
    var f = st.filter, q = (st.q || '').trim().toLowerCase();
    var list = P.filter(function (x) { return (inF(x, f) || st.leaving[x.i]) && (!q || x.brand.toLowerCase().indexOf(q) !== -1); });
    list.sort(function (a, b) { if (!a.date && !b.date) return 0; if (!a.date) return 1; if (!b.date) return -1; return f === 'received' ? (a.date < b.date ? 1 : -1) : (a.date < b.date ? -1 : 1); });
    var gs = [], cur = null;
    list.forEach(function (x) { var g = x.date ? MON[+x.date.slice(5, 7) - 1] + ' ' + x.date.slice(0, 4) : 'No due date'; if (!cur || cur.g !== g) { cur = { g: g, items: [] }; gs.push(cur); } cur.items.push(x); });
    var total = 0;
    function openMenu(x, ev) { var r = ev && ev.currentTarget ? ev.currentTarget.getBoundingClientRect() : { bottom: 300, top: 260, right: 1100 }; var vh = window.innerHeight || 1000, top = r.bottom + 6; if (top + 200 > vh) top = Math.max(8, r.top - 206); self.setState({ rowMenu: st.rowMenu === x.i ? -1 : x.i, rmTop: top, rmLeft: Math.max(8, r.right - 200) }); }
    var groups = gs.map(function (g) {
      var sumG = g.items.reduce(function (a, x) { return a + x.amt; }, 0), nOver = g.items.filter(function (x) { return x.st === 'over'; }).length;
      total += sumG;
      return { label: g.g, total: fmt(sumG), count: g.items.length + (g.items.length === 1 ? ' payment' : ' payments'), hasOver: nOver > 0, overLabel: nOver + ' overdue',
        items: g.items.map(function (x, j) {
          var dayS = x.date ? MS[+x.date.slice(5, 7) - 1] + ' ' + (+x.date.slice(8)) : 'No date';
          return { day: dayS, brand: x.brand, l: x.brand.charAt(0), part: x.part, pay: payIcon(x.st), amount: fmt(x.amt),
            isLate: x.st === 'over' && x.late > 0, lateLabel: x.late + ' days late', cls: st.leaving[x.i] ? 'a-out' : '',
            dayFg: x.st === 'over' ? t.destr : (x.date ? t.fg : t.mutedFg), dayFw: x.st === 'over' ? '600' : '400',
            mDay: x.st === 'over' && x.late > 0 ? x.late + ' days late' : dayS, mDayFw: x.st === 'over' ? '500' : '400',
            line: j < g.items.length - 1 ? '1px solid ' + t.line : '1px solid transparent', menuBg: st.rowMenu === x.i ? t.fill : 'transparent', menuLabel: 'Actions for ' + x.brand,
            menu: function (ev) { openMenu(x, ev); } };
        }) };
    });
    var T = { upcoming: 'Total expected', overdue: 'Total overdue', received: 'Total received', all: 'Total' };
    var isSchedule = st.view === 'schedule';
    var rec = P.filter(function (x) { return x.st === 'paid'; }), exp = P.filter(function (x) { return x.st !== 'paid'; }), ov = P.filter(function (x) { return x.st === 'over'; });
    function sum(a) { return a.reduce(function (s, x) { return s + x.amt; }, 0); }
    var oldest = ov.reduce(function (a, x) { return Math.max(a, x.late); }, 0);
    var stats = isEmpty ? (isSchedule ? [
      { label: 'Received this year', value: '$0', badge: '0 payments', line1: 'Nothing received yet', line2: 'Mark a payment paid to see it here' },
      { label: 'Expected', value: '$0', badge: '0 payments', line1: 'Nothing expected yet', line2: 'Add a deal with its payment terms' },
      { label: 'Overdue', value: '$0', badge: '0 late', line1: 'Nothing is late', line2: 'Talby flags late payments here' },
      { label: mob ? 'Due in 30 days' : 'Due in the next 30 days', value: '$0', badge: '0 payments', line1: 'Nothing due soon', line2: 'Upcoming due dates show here' }
    ] : [
      { label: 'Total received', value: '$0', badge: '0 payments', line1: 'Year to date', line2: 'Grouped by the date you marked it paid' },
      { label: 'Gifted value', value: '$0', badge: '0 gifts', line1: 'Kept separate from money received', line2: 'Log free product on a deal' },
      { label: 'Deals completed', value: '0', badge: 'This year', line1: 'No deals paid in full yet', line2: 'Counts once fully paid' },
      { label: 'Average payment', value: '$0', badge: 'Per payment', line1: 'No payments yet', line2: 'Shows after your first payment' }
    ]) : isSchedule ? [
      { label: 'Received this year', value: fmt(sum(rec)), badge: rec.length + (rec.length === 1 ? ' payment' : ' payments'), line1: bestK ? 'Best month was ' + MON[+bestK.slice(5, 7) - 1] : 'Nothing received yet', line2: bestK ? fmt(byMonth[bestK]) + ' came in that month' : 'Mark a payment paid to see it here' },
      { label: 'Expected', value: fmt(sum(exp)), badge: exp.length + (exp.length === 1 ? ' payment' : ' payments'), line1: noDue ? fmt(noDue) + ' has no due date' : 'Every payment has a due date', line2: noDue ? 'Add dates so Talby can remind you' : 'Talby will remind you before each one' },
      { label: 'Overdue', value: fmt(sum(ov)), badge: ov.length + ' late', dot: ov.length > 0, valueFg: ov.length ? t.destr : t.fg, badgeFg: ov.length ? t.destr : t.fg, line1: ov.length ? 'Oldest is ' + oldest + ' days late' : 'Nothing is late', line2: 'Draft a reminder from the row menu' },
      { label: mob ? 'Due in 30 days' : 'Due in the next 30 days', value: fmt(sum(due30)), badge: due30.length + (due30.length === 1 ? ' payment' : ' payments'), line1: due30.length ? names(due30) : 'Nothing due soon', line2: due30.length ? 'Next one is due ' + md(due30[0].date) : 'Upcoming due dates show here' }
    ] : [
      { label: 'Total received', value: fmt(sum(rec)), badge: rec.length + (rec.length === 1 ? ' payment' : ' payments'), line1: 'Year to date', line2: 'Grouped by the date you marked it paid' },
      { label: 'Gifted value', value: fmt(DATA.gifted.amount), badge: DATA.gifted.count + (DATA.gifted.count === 1 ? ' gift' : ' gifts'), line1: 'Kept separate from money received', line2: 'Log free product on a deal' },
      { label: 'Deals completed', value: String(DATA.dealsCompleted), badge: 'This year', line1: 'Paid in full', line2: DATA.dealsOpen + (DATA.dealsOpen === 1 ? ' more is still open' : ' more are still open') },
      { label: 'Average payment', value: fmt(rec.length ? sum(rec) / rec.length : 0), badge: 'Per payment', line1: 'Across ' + rec.length + (rec.length === 1 ? ' payment' : ' payments'), line2: biggest ? 'Largest was ' + biggest.brand : 'No payments yet' }
    ];
    stats = stats.map(function (s, i) { return Object.assign({ dot: false, valueFg: t.fg, badgeFg: t.fg, delay: (0.03 + i * 0.04).toFixed(2) + 's' }, s); });
    var INC = (function () {
      var y = +TODAY.slice(0, 4), m = +TODAY.slice(5, 7) - 1, month = [], quarter = [];
      for (var i2 = 7; i2 >= 0; i2--) { var mm = m - i2, yy = y; while (mm < 0) { mm += 12; yy--; } var key = yy + '-' + (mm < 9 ? '0' : '') + (mm + 1); month.push([MS[mm], MONTHS[mm] + ' ' + yy, byMonth[key] || 0]); }
      for (var q2 = 0; q2 <= Math.floor(m / 3); q2++) { var s0 = q2 * 3, cur2 = q2 === Math.floor(m / 3), e0 = cur2 ? m : s0 + 2, tot = 0;
        for (var j2 = s0; j2 <= e0; j2++) tot += byMonth[y + '-' + (j2 < 9 ? '0' : '') + (j2 + 1)] || 0;
        quarter.push(['Q' + (q2 + 1), cur2 ? MONTHS[s0] + (e0 > s0 ? ' to ' + MONTHS[e0] : '') + ' so far' : MONTHS[s0] + ' to ' + MONTHS[s0 + 2], tot]); }
      var ytot = 0; Object.keys(byMonth).forEach(function (k3) { if (+k3.slice(0, 4) === y) ytot += byMonth[k3]; });
      return { month: month, quarter: quarter, year: [[String(y), y + ' so far', ytot]] };
    })();
    var data = isSchedule ? INC[st.range] : INC.month;
    var max = Math.max.apply(null, data.map(function (d) { return d[2]; })) || 1;
    var chartPx = mob ? 150 : 200;
    var barR = t.r ? Math.min(12, t.r + 2) + 'px ' + Math.min(12, t.r + 2) + 'px 4px 4px' : '0px';
    var bars = data.map(function (d, i) {
      var h = Math.round(d[2] / max * (chartPx - 10)), on = st.hBar === i;
      return { label: d[0], long: d[1], value: fmt(d[2]), h: h + 'px', tipY: Math.max(h, 4) + 10 + 'px', hover: on, op: st.hBar === -1 || on ? '1' : '0.3', delay: (0.15 + i * 0.05).toFixed(2) + 's',
        radius: barR,
        enter: function () { self.setState({ hBar: i }); }, leave: function () { self.setState({ hBar: -1 }); } };
    });
    var SKB = [0.42, 0.3, 0.52, 0.18, 0.46, 0.86, 0.64, 0.24].slice(0, data.length === 1 ? 1 : data.length === 4 ? 4 : 8);
    var rmP = P.filter(function (x) { return x.i === st.rowMenu; })[0];
    var remP = P.filter(function (x) { return x.i === st.remind; })[0];
    function body(x) { return x ? 'Hi, I hope you are doing well. I wanted to check on the ' + fmt(x.amt) + ' payment for ' + x.brand + ', which was due ' + MON[+x.date.slice(5, 7) - 1] + ' ' + (+x.date.slice(8)) + '. Could you share when it will be sent? Thank you so much.' : ''; }
    var B = (function () { var o2 = {}, order = []; P.filter(function (x) { return x.orig === 'paid'; }).sort(function (a2, b2) { return a2.date < b2.date ? -1 : a2.date > b2.date ? 1 : 0; }).forEach(function (x) { if (!o2[x.brand]) { o2[x.brand] = [x.brand, 0, 0]; order.push(o2[x.brand]); } o2[x.brand][1] += x.amt; if (x.inv) o2[x.brand][2] = 1; }); return order.sort(function (a2, b2) { return b2[1] - a2[1]; }); })();
    var Bmax = B.reduce(function (a2, b2) { return Math.max(a2, b2[1]); }, 0) || 1;
    var unpaid = P.filter(function (x) { return x.st !== 'paid'; });
    var rq = (st.recQ || '').trim().toLowerCase();
    var recSel = unpaid.filter(function (x) { return x.i === st.recI; })[0] || unpaid[0];
    var recOpts = unpaid.filter(function (x) { return !rq || x.brand.toLowerCase().indexOf(rq) !== -1; }).map(function (x) {
      var on = recSel && x.i === recSel.i;
      return { label: x.brand, sub: x.st === 'over' ? x.late + ' days late' : (x.date ? 'Due ' + md(x.date) : 'No due date'), subFg: x.st === 'over' ? t.destr : t.mutedFg, amount: fmt(x.amt), on: on, check: on ? 'visible' : 'hidden',
        pick: function () { self.setState({ recI: x.i, recPick: false, recQ: '', recAmt: Math.round(x.amt).toLocaleString('en-US') }); } };
    });
    var recAmtN = parseFloat(String(st.recAmt || '').replace(/[^0-9.]/g, '')), recOk = !!recSel && !isNaN(recAmtN) && recAmtN > 0;
    var extraPaid = 0; Object.keys(st.paidNow).forEach(function (x) { extraPaid += self._amts[x] || 0; });
    var rowSub = rmP ? (rmP.st === 'over' ? rmP.late + ' days late' : rmP.st === 'paid' ? 'Paid ' + md(rmP.date) : (rmP.date ? 'Due ' + md(rmP.date) : 'No due date')) : '';
    function lines(a) { return a.map(function (w, j) { return { line: j < a.length - 1 ? '1px solid ' + t.line : '1px solid transparent', w: sk(w + (mob ? '%' : 'px'), '12px') }; }); }
    var page = {
      minH: !wide ? '100vh' : (isSchedule ? '1840px' : '1460px'), gap: mob ? '12px' : '16px',
      isSchedule: isSchedule, isIncome: !isSchedule,
      pageTitle: isSchedule ? 'Payments' : 'Income summary',
      pageSub: isSchedule ? 'What is coming in, what is late and what you have been paid.' : 'Everything you were paid this year, by month and by brand.',
      hdrW: mob ? '100%' : 'auto', hdrJ: mob ? 'space-between' : 'flex-start', ctlH: mob ? '36px' : '32px',
      showRecBtn: isSample || isLoading, recBtnOff: isLoading, recBtnOp: isLoading ? '0.5' : '1',
      views: [['schedule', 'Schedule'], ['income', mob ? 'Income' : 'Income summary']].map(function (x) { var on = st.view === x[0]; return { label: x[1], on: on, style: tabStyle(t, on), pick: function () { self.setState({ view: x[0], hBar: -1, rowMenu: -1 }); } }; }),
      notErr: !isError, notLoading: !isLoading, showStats: !isLoading,
      statCols: wide ? 'repeat(4, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))', statPad: mob ? '16px' : '20px', statFs: mob ? '22px' : '30px', cardPad: mob ? '16px' : '20px',
      stats: stats, l1x: mob ? 'white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; font-size: 13px; line-height: 1.35' : 'min-width: 0',
      skStats: [[110, 120, 150, 190], [80, 130, 170, 200], [70, 110, 140, 210], [140, 110, 180, 150]].map(function (r) { return { l: sk(mob ? '60%' : r[0] + 'px', '12px'), v: sk(mob ? '70%' : r[1] + 'px', mob ? '18px' : '26px'), a: sk(mob ? '85%' : r[2] + 'px', '12px'), b: sk(r[3] + 'px', '12px') }; }),
      skBadge: sk('74px', '22px', t.rCtl), skTopH: mob ? '20px' : '22px', skValH: mob ? '25px' : '35px',
      chartTitle: isSchedule ? 'Income over time' : 'By month', chartSub: isSchedule ? 'Received payments only. Point at a bar to see the amount.' : 'Money received each month in 2026',
      chartH: chartPx + 'px', barGap: mob ? '6px' : '10px', chartData: isSample, chartEmptyH: (chartPx + 27) + 'px',
      chartBlk: blk('empty', 'M3 3v16a2 2 0 0 0 2 2h16M7 16v-3M12 16V9M17 16v-6', 'No income yet', isSchedule ? 'Bars show up here as brands pay you.' : 'Money you mark as received shows up here by month.'),
      skBars: SKB.map(function (h) { return sk('100%', Math.round(h * (chartPx - 10)) + 'px', barR) + '; max-width: 56px'; }), skLbl: sk('22px', '10px'),
      ranges: [['month', 'Month'], ['quarter', 'Quarter'], ['year', 'Year']].map(function (x) { var on = st.range === x[0]; return { label: x[1], on: on, style: tabStyle(t, on), pick: function () { self.setState({ range: x[0], hBar: -1 }); } }; }),
      bars: bars,
      periodOpen: st.periodOpen, periodPop: st.periodOpen && !mob, periodSheet: st.periodOpen && mob, closePeriod: function () { self.setState({ periodOpen: false }); },
      togglePeriod: function () { self.setState({ periodOpen: !st.periodOpen }); }, period: st.period,
      periods: ['Year to date', 'This quarter', 'Last 12 months', 'All time'].map(function (x) { var on = st.period === x; return { label: x, on: on, check: on ? 'visible' : 'hidden', pick: function () { self.setState({ period: x, periodOpen: false }); } }; }),
      ftX: mob ? 'display: flex; width: 100%; scrollbar-width: none' : 'flex: 0 1 auto',
      filters: [['upcoming', 'Upcoming'], ['overdue', 'Overdue'], ['received', 'Received'], ['all', 'All']].map(function (x) { var on = x[0] === f; return { label: x[1], on: on, count: String(P.filter(function (pp) { return inF(pp, x[0]); }).length), hasCount: !isLoading, skel: isLoading, countFg: x[0] === 'overdue' && !isEmpty ? t.destr : t.mutedFg, style: tabStyle(t, on) + (mob ? '; flex: 1 0 auto; padding: 0 8px; gap: 5px' : ''), pick: function () { self.setState({ filter: x[0] }); } }; }),
      skCount: sk('14px', '10px', '3px') + '; background: ' + t.off,
      q: st.q, setQ: function (ev) { self.setState({ q: ev.target.value }); }, filterMax: mob ? 'none' : '240px', searchH: mob ? '36px' : '34px',
      showTools: !isEmpty, expLabel: wide,
      exportCsv: function () { if (isEmpty) { self.toast('Nothing to export yet', 'Payments you mark as received go in the CSV.'); return; } self.toast('Export started', 'Your CSV will download in a moment.'); },
      cols: '120px minmax(220px, 2fr) 150px 120px 48px', groups: groups, noMatch: isSample && list.length === 0, footLabel: T[f], footAmt: fmt(total),
      showTable: !mob && (isSample || isLoading), showMobList: mob && (isSample || isLoading), showFoot: !isEmpty,
      skGroups: isLoading ? [{ rows: lines(mob ? [62, 48, 70] : [150, 120, 170]) }, { rows: lines(mob ? [54, 66] : [130, 160]) }] : [],
      skG1: sk('120px', '14px') + '; background: ' + t.off, skG2: sk('64px', '12px') + '; background: ' + t.off, skG3: sk('64px', '14px') + '; background: ' + t.off, skDue: sk('48px', '12px'), skAv: sk('32px', '32px', t.rCtl), skAvM: sk('36px', '36px', t.rCtl),
      skPart: sk('84px', '10px'), skPay: sk('88px', '24px', t.rCtl), skAmt: sk('60px', '12px'), skFoot: sk('84px', '18px'), skCountR: sk('24px', '12px'),
      listBlk: blk('empty', IC.card, 'No payments yet', 'Add a deal with its payment terms. Talby builds your schedule, flags late payments and drafts reminders.', 'Add deal', function () { self.setState({ add: 'new', nav: false }); }, 'Upload', function () { self.setState({ add: 'upload', nav: false }); }),
      brandCols: mob ? 'minmax(0, 1.4fr) minmax(40px, 0.6fr) 72px 28px' : 'minmax(150px, 1.4fr) minmax(80px, 1fr) 84px 28px',
      skBrands: isLoading ? [62, 48, 70, 40, 56, 66, 44, 52].map(function (w, i) { return { w: sk(w + '%', '12px'), line: i < 7 ? '1px solid ' + t.line : 'none' }; }) : [],
      skTrack: sk('100%', '6px', t.rCtl), skIco: sk('36px', '36px', t.rCtl), skNi1: sk('96px', '12px'), skNi2: sk('80%', '12px'),
      brandBlk: blk('empty', IC.card, 'No brands have paid you yet', 'When you mark a payment as received, the brand shows up here with what it paid you this year.', 'Add deal', function () { self.setState({ add: 'new', nav: false }); }),
      expCount: String(PAIDO.length), expTotal: fmt(recBase), negNote: NEG.count ? NEG.count + (NEG.count === 1 ? ' deal in negotiation is worth ' : ' deals in negotiation are worth ') + fmt(NEG.amount) + '. It is not counted above.' : 'No deals in negotiation right now.',
      errBlk: blk('error', IC.wifi, isSchedule ? 'We could not load your payments' : 'We could not load your income summary', 'Check your connection and try again. Nothing was lost.', 'Try again', function () { self.retryLoad(); }),
      rowMenuOpen: !!rmP && !mob, rowSheetOpen: !!rmP && mob, rowMenuTop: st.rmTop + 'px', rowMenuLeft: st.rmLeft + 'px', closeRowMenu: function () { self.setState({ rowMenu: -1 }); },
      sheetR: t.rDialog + ' ' + t.rDialog + ' 0 0',
      rs: { l: rmP ? rmP.brand.charAt(0) : '', brand: rmP ? rmP.brand : '', amount: rmP ? fmt(rmP.amt) : '', sub: rmP ? rmP.part + ' · ' + rowSub : '', subFg: rmP && rmP.st === 'over' ? t.destr : t.mutedFg },
      rm: {
        unpaid: rmP ? rmP.st !== 'paid' : false, canRemind: rmP ? rmP.st === 'over' : false,
        paid: function () { if (!rmP) return; self.markPaid(rmP.i, rmP.brand, rmP.amt); },
        remind: function () { if (!rmP) return; if (!self.guard()) { self.setState({ rowMenu: -1 }); return; } self.setState({ remind: rmP.i, rowMenu: -1, rmText: body(rmP) }); },
        invoice: function () { self.setState({ rowMenu: -1 }); if (!self.guard()) return; self.toast('Upload invoice', 'Choose the invoice file for ' + (rmP ? rmP.brand : 'this payment') + '.'); }
      },
      remindOpen: !!remP, closeRemind: function () { self.setState({ remind: -1 }); },
      dlgPad: mob ? '0' : '24px', dlgAnim: mob ? 'a-up' : 'a-pop',
      dlg: { w: mob ? '100%' : '540px', h: mob ? '100%' : 'auto', maxH: mob ? '100%' : 'calc(100vh - 48px)', border: mob ? 'none' : ('1px solid ' + t.border), radius: mob ? '0px' : t.rDialog },
      dlgHeadPad: mob ? '18px 12px 12px 16px' : '22px 18px 14px 24px', dlgBodyPad: mob ? '4px 16px 20px' : '4px 24px 20px', recBodyPad: mob ? '4px 16px 22px' : '4px 24px 22px',
      dlgFootPad: mob ? '12px 16px 20px' : '14px 24px 18px', dlgBtnH: mob ? '44px' : '32px', rmAreaH: mob ? '220px' : '150px',
      btnFlex: mob ? '1 1 0' : '0 0 auto',
      rmBrand: remP ? remP.brand : '', rmAmount: remP ? fmt(remP.amt) : '', rmLate: remP ? remP.late + ' days late' : '',
      rmSubject: remP ? 'Checking in on the ' + remP.brand + ' payment' : '', rmText: st.rmText != null ? st.rmText : body(remP), setRmText: function (ev) { self.setState({ rmText: ev.target.value }); },
      copyRemind: function () { var txt = st.rmText || body(remP); try { navigator.clipboard.writeText(txt); } catch (e) {} self.setState({ remind: -1 }); self.toast('Message copied', 'Paste it into an email to the brand.'); },
      recOpen: st.rec, openRecord: function () { if (isLoading) return; if (!self.guard()) return; var first = unpaid[0]; self.setState({ rec: true, recPick: false, recQ: '', recI: first ? first.i : 0, recAmt: first ? Math.round(first.amt).toLocaleString('en-US') : '', recDate: TODAY }); },
      closeRecord: function () { self.setState({ rec: false, recPick: false }); },
      recRow: mob ? 'position: relative; display: flex; flex-direction: column; align-items: stretch; gap: 8px; padding: 12px 14px; box-sizing: border-box' : k.row,
      recRowT: mob ? 'position: relative; display: flex; flex-direction: column; align-items: stretch; gap: 8px; padding: 12px 14px; box-sizing: border-box; border-top: 1px solid ' + t.line : k.rowT,
      recLabel: mob ? 'font-size: 13px; font-weight: 500; color: ' + t.mutedFg : k.rowLabel, ctlX: mob ? 'flex: 0 0 auto; width: 100%' : 'min-width: 0',
      lb: { top: mob ? '82px' : '48px', right: mob ? '14px' : '10px', left: mob ? '14px' : 'auto', w: mob ? 'auto' : '300px', maxH: mob ? '300px' : '240px', itemH: mob ? '48px' : '34px' },
      recPickOpen: st.recPick, closeRecPick: function () { self.setState({ recPick: false, recQ: '' }); },
      toggleRecPick: function () { self.setState({ recPick: !self.state.recPick, recQ: '' }); setTimeout(function () { try { if (window.innerWidth >= 768) self.recInput && self.recInput.focus(); } catch (e) {} }, 40); },
      recRef: function (el) { self.recInput = el; }, recQ: st.recQ, setRecQ: function (ev) { self.setState({ recQ: ev.target.value }); },
      recOpts: recOpts, recNone: recOpts.length === 0, rec: { brand: recSel ? recSel.brand : 'Pick a payment', l: recSel ? recSel.brand.charAt(0) : '?' },
      recAmt: st.recAmt, setRecAmt: function (ev) { self.setState({ recAmt: ev.target.value }); },
      recDate: st.recDate, setRecDate: function (v) { self.setState({ recDate: v || TODAY }); },
      recAfter: recOk ? fmt(recBase + extraPaid + recAmtN) + ' received this year' : 'Enter an amount',
      recOff: !recOk, recOp: recOk ? '1' : '0.4',
      saveRecord: function () { if (!recOk) return; self.markPaid(recSel.i, recSel.brand, recAmtN, function () { self.setState({ rec: false, recPick: false }); }, 'rec'); },
      brands: B.map(function (b, i) { return { name: b[0], amount: fmt(b[1]), w: Math.max(3, Math.round(b[1] / Bmax * 100)) + '%', delay: (0.2 + i * 0.03).toFixed(2) + 's', inv: !!b[2], noInv: !b[2], invLabel: 'Open invoice for ' + b[0], line: i < B.length - 1 ? '1px solid ' + t.line : 'none' }; })
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
    out.chatHidden = st.appear || st.nav || st.cmd || !!st.add || !!(st.remind !== -1 || st.rec || (mob && (st.rowMenu !== -1 || st.periodOpen)));
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
              <SSidebar account={$s0?.account} active={"payments"} color={$s0?.eff} dark={$s0?.dark} collapsed={$s0?.collapsed} plan={$s0?.plan} fresh={$s0?.sbFresh} />
            </div>
          </div>
        </>) : null}
        <main {...S(`flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 16px; padding: ${I($s0?.mainPad)}; box-sizing: border-box`)}>
          <STopbar account={$s0?.account} title={"Payments"} mobile={$s0?.mob} quiet={$s0?.quietBell} color={$s0?.eff} dark={$s0?.dark} onNav={$s0?.toggleNav} onSearch={$s0?.openCmd} onAppearance={$s0?.openAppear} onAdd={$s0?.openAdd} />
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
              <h1 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: ${I($s0?.h1Fs)}; font-weight: 600; letter-spacing: ${I($s0?.t?.hTrack)}; text-transform: ${I($s0?.t?.hCase)}; line-height: 1.15; white-space: nowrap`)}>
                {T($s0?.pageTitle)}
              </h1>
              <p {...S(`margin: 0; color: ${I($s0?.t?.mutedFg)}`)}>
                {T($s0?.pageSub)}
              </p>
            </div>
            <div {...S(`display: flex; align-items: center; gap: 8px; width: ${I($s0?.hdrW)}; justify-content: ${I($s0?.hdrJ)}`)}>
              {$s0?.showRecBtn ? (<>
                <button className={"tb tg"} type={"button"} onClick={$s0?.openRecord} aria-label={"Record a payment"} aria-disabled={$s0?.recBtnOff} {...S(`${I($s0?.k?.btnO)}; height: ${I($s0?.ctlH)}; opacity: ${I($s0?.recBtnOp)}; flex-shrink: 0`)}>
                  <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M5 12h14M12 5v14"} />
                  </svg>
                  <span>
                    {"Record a payment"}
                  </span>
                </button>
              </>) : null}
              <div role={"tablist"} aria-label={"Payments views"} {...S($s0?.k?.tabs)}>
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
          </div>
          {$s0?.notErr ? (<>
            {$s0?.showStats ? (<>
              <div {...S(`display: grid; grid-template-columns: ${I($s0?.statCols)}; gap: ${I($s0?.gap)}`)}>
                {A($s0?.stats).map((it, i) => {
                  const $s1 = { ...$s0, "s": it, $index: i };
                  return (<React.Fragment key={i}>
                    <section className={"a-in"} {...S(`animation-delay: ${I($s1?.s?.delay)}; min-width: 0; display: flex; flex-direction: column; gap: 6px; padding: ${I($s1?.statPad)}; box-sizing: border-box; ${I($s1?.k?.card)}`)}>
                      <div {...S("display: flex; align-items: center; justify-content: space-between; gap: 8px; min-width: 0")}>
                        <span {...S(`min-width: 0; color: ${I($s1?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                          {T($s1?.s?.label)}
                        </span>
                        {$s1?.notMob ? (<>
                          <span {...S(`color: ${I($s1?.s?.badgeFg)}; ${I($s1?.k?.badge)}`)}>
                            {$s1?.s?.dot ? (<>
                              <span className={"a-ping"} {...S("width: 6px; height: 6px; flex: 0 0 6px; border-radius: 3px; background: #EF4444")} />
                            </>) : null}
                            {T($s1?.s?.badge)}
                          </span>
                        </>) : null}
                      </div>
                      <span {...S(`font-family: ${I($s1?.numFam)}; font-size: ${I($s1?.statFs)}; font-weight: 600; letter-spacing: ${I($s1?.t?.nTrack)}; line-height: 1.15; font-variant-numeric: tabular-nums; white-space: nowrap; color: ${I($s1?.s?.valueFg)}; transition: color 0.3s ease`)}>
                        {T($s1?.s?.value)}
                      </span>
                      <div {...S("display: flex; flex-direction: column; gap: 2px; margin-top: 6px; min-width: 0")}>
                        <span {...S(`font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ${I($s1?.l1x)}`)}>
                          {T($s1?.s?.line1)}
                        </span>
                        {$s1?.notMob ? (<>
                          <span {...S(`color: ${I($s1?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                            {T($s1?.s?.line2)}
                          </span>
                        </>) : null}
                      </div>
                    </section>
                  </React.Fragment>);
                })}
              </div>
            </>) : null}
            {$s0?.isLoading ? (<>
              <div {...S(`display: grid; grid-template-columns: ${I($s0?.statCols)}; gap: ${I($s0?.gap)}`)}>
                {A($s0?.skStats).map((it, i) => {
                  const $s1 = { ...$s0, "s": it, $index: i };
                  return (<React.Fragment key={i}>
                    <section {...S(`min-width: 0; display: flex; flex-direction: column; gap: 6px; padding: ${I($s1?.statPad)}; box-sizing: border-box; ${I($s1?.k?.card)}`)}>
                      <div {...S(`display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: ${I($s1?.skTopH)}`)}>
                        <span className={"a-pulse"} {...S($s1?.s?.l)} />
                        {$s1?.notMob ? (<>
                          <span className={"a-pulse"} {...S($s1?.skBadge)} />
                        </>) : null}
                      </div>
                      <div {...S(`display: flex; align-items: center; height: ${I($s1?.skValH)}`)}>
                        <span className={"a-pulse"} {...S($s1?.s?.v)} />
                      </div>
                      <div {...S("display: flex; flex-direction: column; gap: 2px; margin-top: 6px")}>
                        <div {...S("display: flex; align-items: center; height: 20px")}>
                          <span className={"a-pulse"} {...S($s1?.s?.a)} />
                        </div>
                        {$s1?.notMob ? (<>
                          <div {...S("display: flex; align-items: center; height: 20px")}>
                            <span className={"a-pulse"} {...S($s1?.s?.b)} />
                          </div>
                        </>) : null}
                      </div>
                    </section>
                  </React.Fragment>);
                })}
              </div>
            </>) : null}
            <section className={"a-in"} {...S(`animation-delay: 0.12s; padding: ${I($s0?.cardPad)}; display: flex; flex-direction: column; gap: 16px; ${I($s0?.k?.card)}`)}>
              <div {...S("display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap")}>
                <div {...S("display: flex; flex-direction: column; gap: 4px; min-width: 0")}>
                  <h2 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 16px; font-weight: 600`)}>
                    {T($s0?.chartTitle)}
                  </h2>
                  <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                    {T($s0?.chartSub)}
                  </span>
                </div>
                {$s0?.isSchedule ? (<>
                  <div role={"tablist"} aria-label={"Group by"} {...S($s0?.k?.tabs)}>
                    {A($s0?.ranges).map((it, i) => {
                      const $s1 = { ...$s0, "r": it, $index: i };
                      return (<React.Fragment key={i}>
                        <button className={"tb tt"} type={"button"} role={"tab"} aria-selected={$s1?.r?.on} onClick={$s1?.r?.pick} {...S($s1?.r?.style)}>
                          {T($s1?.r?.label)}
                        </button>
                      </React.Fragment>);
                    })}
                  </div>
                </>) : null}
                {$s0?.isIncome ? (<>
                  <div {...S("position: relative")}>
                    <button className={"tb tg"} type={"button"} onClick={$s0?.togglePeriod} aria-haspopup={"listbox"} aria-expanded={$s0?.periodOpen} {...S(`padding: 0 12px 0 14px; ${I($s0?.k?.btnS)}; height: ${I($s0?.ctlH)}`)}>
                      {T($s0?.period)}
                      <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"m6 9 6 6 6-6"} />
                      </svg>
                    </button>
                    {$s0?.periodPop ? (<>
                      <div onClick={$s0?.closePeriod} {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 29")} />
                      <div role={"listbox"} aria-label={"Period"} className={"a-drop"} {...S(`position: absolute; top: 40px; right: 0; width: 180px; z-index: 30; ${I($s0?.k?.pop)}`)}>
                        {A($s0?.periods).map((it, i) => {
                          const $s1 = { ...$s0, "o": it, $index: i };
                          return (<React.Fragment key={i}>
                            <button className={"tb tg"} type={"button"} role={"option"} aria-selected={$s1?.o?.on} onClick={$s1?.o?.pick} {...S(`justify-content: space-between; ${I($s1?.k?.item)}`)}>
                              {T($s1?.o?.label)}
                              <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`visibility: ${I($s1?.o?.check)}`)}>
                                <path d={"M20 6 9 17l-5-5"} />
                              </svg>
                            </button>
                          </React.Fragment>);
                        })}
                      </div>
                    </>) : null}
                  </div>
                </>) : null}
              </div>
              {$s0?.chartData ? (<>
                <div {...S(`position: relative; height: ${I($s0?.chartH)}; display: flex; align-items: flex-end; gap: ${I($s0?.barGap)}`)}>
                  {A($s0?.bars).map((it, i) => {
                    const $s1 = { ...$s0, "b": it, $index: i };
                    return (<React.Fragment key={i}>
                      <div onMouseEnter={$s1?.b?.enter} onMouseLeave={$s1?.b?.leave} {...S("position: relative; flex: 1 1 0; min-width: 0; height: 100%; display: flex; align-items: flex-end; justify-content: center")}>
                        <div className={"a-grow"} {...S(`animation-delay: ${I($s1?.b?.delay)}; width: 100%; max-width: 56px; height: ${I($s1?.b?.h)}; min-height: 4px; background: ${I($s1?.t?.primary)}; opacity: ${I($s1?.b?.op)}; border-radius: ${I($s1?.b?.radius)}; transition: opacity 0.15s ease`)} />
                        {$s1?.b?.hover ? (<>
                          <div role={"tooltip"} className={"a-fade"} {...S(`position: absolute; bottom: ${I($s1?.b?.tipY)}; left: 50%; transform: translateX(-50%); padding: 8px 10px; background: ${I($s1?.t?.card)}; border: 1px solid ${I($s1?.t?.border)}; border-radius: ${I($s1?.t?.rSm)}; box-shadow: ${I($s1?.t?.shPop)}; white-space: nowrap; z-index: 5; display: flex; flex-direction: column; gap: 2px`)}>
                            <span {...S(`font-size: 12px; color: ${I($s1?.t?.mutedFg)}`)}>
                              {T($s1?.b?.long)}
                            </span>
                            <span {...S("font-weight: 600; font-variant-numeric: tabular-nums")}>
                              {T($s1?.b?.value)}
                            </span>
                          </div>
                        </>) : null}
                      </div>
                    </React.Fragment>);
                  })}
                </div>
                <div {...S(`display: flex; gap: ${I($s0?.barGap)}; margin-top: -6px`)}>
                  {A($s0?.bars).map((it, i) => {
                    const $s1 = { ...$s0, "b": it, $index: i };
                    return (<React.Fragment key={i}>
                      <span {...S(`flex: 1 1 0; min-width: 0; text-align: center; font-size: 12px; color: ${I($s1?.t?.mutedFg)}`)}>
                        {T($s1?.b?.label)}
                      </span>
                    </React.Fragment>);
                  })}
                </div>
              </>) : null}
              {$s0?.isLoading ? (<>
                <div {...S(`height: ${I($s0?.chartH)}; display: flex; align-items: flex-end; gap: ${I($s0?.barGap)}`)}>
                  {A($s0?.skBars).map((it, i) => {
                    const $s1 = { ...$s0, "sb": it, $index: i };
                    return (<React.Fragment key={i}>
                      <div {...S("flex: 1 1 0; min-width: 0; height: 100%; display: flex; align-items: flex-end; justify-content: center")}>
                        <span className={"a-pulse"} {...S($s1?.sb)} />
                      </div>
                    </React.Fragment>);
                  })}
                </div>
                <div {...S(`display: flex; gap: ${I($s0?.barGap)}; margin-top: -6px`)}>
                  {A($s0?.skBars).map((it, i) => {
                    const $s1 = { ...$s0, "sb": it, $index: i };
                    return (<React.Fragment key={i}>
                      <span {...S("flex: 1 1 0; min-width: 0; height: 17px; display: flex; align-items: center; justify-content: center")}>
                        <span className={"a-pulse"} {...S($s1?.skLbl)} />
                      </span>
                    </React.Fragment>);
                  })}
                </div>
              </>) : null}
              {$s0?.isEmpty ? (<>
                <div {...S(`height: ${I($s0?.chartEmptyH)}; display: flex; align-items: center; justify-content: center; box-sizing: border-box; border: 1px dashed ${I($s0?.t?.border)}; border-radius: ${I($s0?.t?.rTile)}`)}>
                  <div className={"a-fade"} {...S("display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 0 24px; box-sizing: border-box; text-align: center")}>
                    <span {...S(`display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.chartBlk?.tileBg)}; color: ${I($s0?.chartBlk?.tileFg)}`)}>
                      <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={$s0?.chartBlk?.icon} />
                      </svg>
                    </span>
                    <div {...S("display: flex; flex-direction: column; align-items: center; gap: 4px; max-width: 380px")}>
                      <span {...S("font-size: 15px; font-weight: 600")}>
                        {T($s0?.chartBlk?.title)}
                      </span>
                      {$s0?.chartBlk?.hasSub ? (<>
                        <span {...S(`font-size: 13px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}`)}>
                          {T($s0?.chartBlk?.sub)}
                        </span>
                      </>) : null}
                    </div>
                    {$s0?.chartBlk?.hasCta ? (<>
                      <div {...S("display: flex; flex-wrap: wrap; justify-content: center; gap: 8px")}>
                        <button type={"button"} className={"tb tp"} onClick={$s0?.chartBlk?.act} {...S(`${I($s0?.k?.pSm)}; height: ${I($s0?.stH)}; flex-shrink: 0`)}>
                          {T($s0?.chartBlk?.cta)}
                        </button>
                        {$s0?.chartBlk?.has2 ? (<>
                          <button type={"button"} className={"tb tg"} onClick={$s0?.chartBlk?.act2} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.oSm)}; height: ${I($s0?.stH)}`)}>
                            {T($s0?.chartBlk?.cta2)}
                          </button>
                        </>) : null}
                      </div>
                    </>) : null}
                  </div>
                </div>
              </>) : null}
            </section>
            {$s0?.isSchedule ? (<>
              <section className={"a-in"} {...S(`animation-delay: 0.16s; display: flex; flex-direction: column; min-width: 0; ${I($s0?.k?.card)}`)}>
                <div {...S("display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 14px 14px 12px")}>
                  <div role={"tablist"} aria-label={"Filter payments"} {...S(`max-width: 100%; overflow-x: auto; ${I($s0?.k?.tabs)}; ${I($s0?.ftX)}`)}>
                    {A($s0?.filters).map((it, i) => {
                      const $s1 = { ...$s0, "s": it, $index: i };
                      return (<React.Fragment key={i}>
                        <button className={"tb tt"} type={"button"} role={"tab"} aria-selected={$s1?.s?.on} onClick={$s1?.s?.pick} {...S($s1?.s?.style)}>
                          {T($s1?.s?.label)}
                          {$s1?.s?.hasCount ? (<>
                            <span {...S(`color: ${I($s1?.s?.countFg)}; font-variant-numeric: tabular-nums`)}>
                              {T($s1?.s?.count)}
                            </span>
                          </>) : null}
                          {$s1?.s?.skel ? (<>
                            <span className={"a-pulse"} {...S($s1?.skCount)} />
                          </>) : null}
                        </button>
                      </React.Fragment>);
                    })}
                  </div>
                  {$s0?.notMob ? (<>
                    <div {...S("flex: 1 1 0px")} />
                  </>) : null}
                  {$s0?.showTools ? (<>
                    <label className={"ti"} {...S(`flex: 1 1 180px; max-width: ${I($s0?.filterMax)}; display: flex; align-items: center; gap: 8px; height: ${I($s0?.searchH)}; padding: 0 14px; box-sizing: border-box; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.fill)}; color: ${I($s0?.t?.mutedFg)}`)}>
                      <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 15px")}>
                        <circle cx={"11"} cy={"11"} r={"8"} />
                        <path d={"m21 21-4.3-4.3"} />
                      </svg>
                      <input type={"search"} aria-label={"Filter brands"} placeholder={"Filter brands"} value={V0($s0?.q, "")} onChange={$s0?.setQ} {...S(`flex: 1 1 auto; min-width: 0; height: 32px; border: none; outline: none; background: transparent; font: inherit; font-size: 14px; color: ${I($s0?.t?.fg)}; padding: 0`)} />
                    </label>
                    <button className={"tb tg"} type={"button"} onClick={$s0?.exportCsv} aria-label={"Export CSV"} {...S(`${I($s0?.k?.btnO)}; height: ${I($s0?.ctlH)}; flex-shrink: 0`)}>
                      <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"} />
                      </svg>
                      {$s0?.expLabel ? (<>
                        <span>
                          {"Export"}
                        </span>
                      </>) : null}
                    </button>
                  </>) : null}
                </div>
                {$s0?.showTable ? (<>
                  <div {...S("overflow-x: auto; padding: 0 12px")}>
                    <div {...S("min-width: 640px")}>
                      <div {...S(`display: grid; grid-template-columns: ${I($s0?.cols)}; align-items: center; height: 36px; padding: 0 4px; border-bottom: 1px solid ${I($s0?.t?.line)}; color: ${I($s0?.t?.mutedFg)}; font-size: 13px; font-weight: 500`)}>
                        <span {...S("padding: 0 10px")}>
                          {"Due"}
                        </span>
                        <span {...S("padding: 0 8px")}>
                          {"Brand"}
                        </span>
                        <span {...S("padding: 0 8px")}>
                          {"Status"}
                        </span>
                        <span {...S("padding: 0 8px; text-align: right")}>
                          {"Amount"}
                        </span>
                        <span />
                      </div>
                      {A($s0?.groups).map((it, i) => {
                        const $s1 = { ...$s0, "g": it, $index: i };
                        return (<React.Fragment key={i}>
                          <div {...S(`display: flex; align-items: center; gap: 10px; height: 48px; margin-top: 12px; padding: 0 14px; box-sizing: border-box; border-radius: ${I($s1?.t?.rTile)}; background: ${I($s1?.t?.tile)}`)}>
                            <span {...S(`font-family: ${I($s1?.titleFam)}; font-size: 15px; font-weight: 600; white-space: nowrap`)}>
                              {T($s1?.g?.label)}
                            </span>
                            <span {...S(`font-size: 13px; color: ${I($s1?.t?.mutedFg)}; white-space: nowrap`)}>
                              {T($s1?.g?.count)}
                            </span>
                            {$s1?.g?.hasOver ? (<>
                              <span {...S(`display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: 0 8px; box-sizing: border-box; border-radius: ${I($s1?.t?.rCtl)}; background: ${I($s1?.t?.badBg)}; color: ${I($s1?.t?.badFg)}; font-size: 12px; font-weight: 500; white-space: nowrap`)}>
                                <span {...S("width: 6px; height: 6px; border-radius: 3px; background: #EF4444")} />
                                {T($s1?.g?.overLabel)}
                              </span>
                            </>) : null}
                            <span {...S("flex: 1 1 auto")} />
                            <span {...S("font-size: 15px; font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums")}>
                              {T($s1?.g?.total)}
                            </span>
                          </div>
                          {A($s1?.g?.items).map((it, i) => {
                            const $s2 = { ...$s1, "r": it, $index: i };
                            return (<React.Fragment key={i}>
                              <div className={`tr ${I($s2?.r?.cls)}`} {...S(`display: grid; grid-template-columns: ${I($s2?.cols)}; align-items: center; min-height: 62px; padding: 0 4px; border-bottom: ${I($s2?.r?.line)}; border-radius: ${I($s2?.t?.rItem)}`)}>
                                <span {...S("display: flex; flex-direction: column; gap: 2px; padding: 0 10px")}>
                                  <span {...S(`white-space: nowrap; font-variant-numeric: tabular-nums; color: ${I($s2?.r?.dayFg)}; font-weight: ${I($s2?.r?.dayFw)}`)}>
                                    {T($s2?.r?.day)}
                                  </span>
                                  {$s2?.r?.isLate ? (<>
                                    <span {...S(`font-size: 12px; white-space: nowrap; color: ${I($s2?.t?.destr)}`)}>
                                      {T($s2?.r?.lateLabel)}
                                    </span>
                                  </>) : null}
                                </span>
                                <span {...S("display: flex; align-items: center; gap: 12px; min-width: 0; padding: 0 8px")}>
                                  <span {...S(`width: 32px; height: 32px; flex: 0 0 32px; border-radius: ${I($s2?.t?.rCtl)}; background: ${I($s2?.t?.fill)}; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600`)}>
                                    {T($s2?.r?.l)}
                                  </span>
                                  <span {...S("min-width: 0; display: flex; flex-direction: column; gap: 1px")}>
                                    <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                                      {T($s2?.r?.brand)}
                                    </span>
                                    <span {...S(`font-size: 13px; color: ${I($s2?.t?.mutedFg)}; white-space: nowrap`)}>
                                      {T($s2?.r?.part)}
                                    </span>
                                  </span>
                                </span>
                                <span {...S("display: flex; padding: 0 8px")}>
                                  <span {...S(`color: ${I($s2?.r?.pay?.fg)}; ${I($s2?.k?.payBadge)}`)}>
                                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("display: block; flex: 0 0 14px")}>
                                      <circle cx={"12"} cy={"12"} r={"9.5"} fill={$s2?.r?.pay?.fill} stroke={$s2?.r?.pay?.stroke} strokeDasharray={$s2?.r?.pay?.dash} />
                                      <path d={$s2?.r?.pay?.inner} stroke={$s2?.r?.pay?.innerStroke} />
                                    </svg>
                                    {T($s2?.r?.pay?.label)}
                                  </span>
                                </span>
                                <span {...S("padding: 0 8px; text-align: right; font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums")}>
                                  {T($s2?.r?.amount)}
                                </span>
                                <span {...S("display: flex; justify-content: flex-end")}>
                                  <button className={"tb tg"} type={"button"} onClick={$s2?.r?.menu} aria-label={$s2?.r?.menuLabel} aria-haspopup={"menu"} {...S(`background: ${I($s2?.r?.menuBg)}; --hv: ${I($s2?.t?.fill)}; ${I($s2?.k?.icoS)}`)}>
                                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"currentColor"} aria-hidden={"true"}>
                                      <circle cx={"5"} cy={"12"} r={"1.7"} />
                                      <circle cx={"12"} cy={"12"} r={"1.7"} />
                                      <circle cx={"19"} cy={"12"} r={"1.7"} />
                                    </svg>
                                  </button>
                                </span>
                              </div>
                            </React.Fragment>);
                          })}
                        </React.Fragment>);
                      })}
                      {$s0?.isLoading ? (<>
                        {A($s0?.skGroups).map((it, i) => {
                          const $s1 = { ...$s0, "sg": it, $index: i };
                          return (<React.Fragment key={i}>
                            <div {...S(`display: flex; align-items: center; gap: 10px; height: 48px; margin-top: 12px; padding: 0 14px; box-sizing: border-box; border-radius: ${I($s1?.t?.rTile)}; background: ${I($s1?.t?.tile)}`)}>
                              <span className={"a-pulse"} {...S($s1?.skG1)} />
                              <span className={"a-pulse"} {...S($s1?.skG2)} />
                              <span {...S("flex: 1 1 auto")} />
                              <span className={"a-pulse"} {...S($s1?.skG3)} />
                            </div>
                            {A($s1?.sg?.rows).map((it, i) => {
                              const $s2 = { ...$s1, "sr": it, $index: i };
                              return (<React.Fragment key={i}>
                                <div {...S(`display: grid; grid-template-columns: ${I($s2?.cols)}; align-items: center; min-height: 62px; padding: 0 4px; border-bottom: ${I($s2?.sr?.line)}`)}>
                                  <span {...S("padding: 0 10px")}>
                                    <span className={"a-pulse"} {...S($s2?.skDue)} />
                                  </span>
                                  <span {...S("display: flex; align-items: center; gap: 12px; min-width: 0; padding: 0 8px")}>
                                    <span className={"a-pulse"} {...S($s2?.skAv)} />
                                    <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 7px")}>
                                      <span className={"a-pulse"} {...S($s2?.sr?.w)} />
                                      <span className={"a-pulse"} {...S($s2?.skPart)} />
                                    </span>
                                  </span>
                                  <span {...S("padding: 0 8px")}>
                                    <span className={"a-pulse"} {...S($s2?.skPay)} />
                                  </span>
                                  <span {...S("display: flex; justify-content: flex-end; padding: 0 8px")}>
                                    <span className={"a-pulse"} {...S($s2?.skAmt)} />
                                  </span>
                                  <span />
                                </div>
                              </React.Fragment>);
                            })}
                          </React.Fragment>);
                        })}
                      </>) : null}
                    </div>
                  </div>
                </>) : null}
                {$s0?.showMobList ? (<>
                  <div {...S("display: flex; flex-direction: column; padding: 0 10px")}>
                    {A($s0?.groups).map((it, i) => {
                      const $s1 = { ...$s0, "g": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div {...S(`display: flex; align-items: center; gap: 8px; height: 44px; margin-top: 8px; padding: 0 12px; border-radius: ${I($s1?.t?.rTile)}; background: ${I($s1?.t?.tile)}`)}>
                          <span {...S("font-weight: 600; white-space: nowrap")}>
                            {T($s1?.g?.label)}
                          </span>
                          {$s1?.g?.hasOver ? (<>
                            <span {...S("width: 6px; height: 6px; border-radius: 3px; background: #EF4444")} />
                          </>) : null}
                          <span {...S("flex: 1 1 auto")} />
                          <span {...S("font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums")}>
                            {T($s1?.g?.total)}
                          </span>
                        </div>
                        {A($s1?.g?.items).map((it, i) => {
                          const $s2 = { ...$s1, "r": it, $index: i };
                          return (<React.Fragment key={i}>
                            <div className={$s2?.r?.cls} onClick={$s2?.r?.menu} {...S(`display: flex; align-items: center; gap: 12px; min-height: 66px; padding: 10px 0 10px 4px; box-sizing: border-box; border-bottom: ${I($s2?.r?.line)}; cursor: pointer`)}>
                              <span {...S(`width: 36px; height: 36px; flex: 0 0 36px; border-radius: ${I($s2?.t?.rCtl)}; background: ${I($s2?.t?.fill)}; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600`)}>
                                {T($s2?.r?.l)}
                              </span>
                              <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 6px")}>
                                <span {...S("max-width: 100%; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                                  {T($s2?.r?.brand)}
                                </span>
                                <span {...S(`color: ${I($s2?.r?.pay?.fg)}; ${I($s2?.k?.payBadge)}`)}>
                                  <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("display: block; flex: 0 0 14px")}>
                                    <circle cx={"12"} cy={"12"} r={"9.5"} fill={$s2?.r?.pay?.fill} stroke={$s2?.r?.pay?.stroke} strokeDasharray={$s2?.r?.pay?.dash} />
                                    <path d={$s2?.r?.pay?.inner} stroke={$s2?.r?.pay?.innerStroke} />
                                  </svg>
                                  {T($s2?.r?.pay?.label)}
                                </span>
                              </span>
                              <span {...S("flex: 0 0 auto; display: flex; flex-direction: column; align-items: flex-end; gap: 6px")}>
                                <span {...S("font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums")}>
                                  {T($s2?.r?.amount)}
                                </span>
                                <span {...S(`height: 24px; line-height: 24px; font-size: 13px; white-space: nowrap; font-variant-numeric: tabular-nums; color: ${I($s2?.r?.dayFg)}; font-weight: ${I($s2?.r?.mDayFw)}`)}>
                                  {T($s2?.r?.mDay)}
                                </span>
                              </span>
                              <button className={"tb tg"} type={"button"} aria-label={$s2?.r?.menuLabel} aria-haspopup={"menu"} {...S(`--hv: ${I($s2?.t?.fill)}; ${I($s2?.k?.icoS)}; width: 32px; height: 40px`)}>
                                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"currentColor"} aria-hidden={"true"}>
                                  <circle cx={"5"} cy={"12"} r={"1.7"} />
                                  <circle cx={"12"} cy={"12"} r={"1.7"} />
                                  <circle cx={"19"} cy={"12"} r={"1.7"} />
                                </svg>
                              </button>
                            </div>
                          </React.Fragment>);
                        })}
                      </React.Fragment>);
                    })}
                    {$s0?.isLoading ? (<>
                      {A($s0?.skGroups).map((it, i) => {
                        const $s1 = { ...$s0, "sg": it, $index: i };
                        return (<React.Fragment key={i}>
                          <div {...S(`display: flex; align-items: center; gap: 8px; height: 44px; margin-top: 8px; padding: 0 12px; border-radius: ${I($s1?.t?.rTile)}; background: ${I($s1?.t?.tile)}`)}>
                            <span className={"a-pulse"} {...S($s1?.skG1)} />
                            <span {...S("flex: 1 1 auto")} />
                            <span className={"a-pulse"} {...S($s1?.skG3)} />
                          </div>
                          {A($s1?.sg?.rows).map((it, i) => {
                            const $s2 = { ...$s1, "sr": it, $index: i };
                            return (<React.Fragment key={i}>
                              <div {...S(`display: flex; align-items: center; gap: 12px; min-height: 66px; padding: 10px 0 10px 4px; box-sizing: border-box; border-bottom: ${I($s2?.sr?.line)}`)}>
                                <span className={"a-pulse"} {...S($s2?.skAvM)} />
                                <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 10px")}>
                                  <span className={"a-pulse"} {...S($s2?.sr?.w)} />
                                  <span className={"a-pulse"} {...S($s2?.skPay)} />
                                </span>
                                <span {...S("display: flex; flex-direction: column; align-items: flex-end; gap: 12px")}>
                                  <span className={"a-pulse"} {...S($s2?.skAmt)} />
                                  <span className={"a-pulse"} {...S($s2?.skDue)} />
                                </span>
                              </div>
                            </React.Fragment>);
                          })}
                        </React.Fragment>);
                      })}
                    </>) : null}
                  </div>
                </>) : null}
                {$s0?.noMatch ? (<>
                  <div className={"a-fade"} {...S(`padding: 48px 16px; text-align: center; color: ${I($s0?.t?.mutedFg)}`)}>
                    {"No payments match."}
                  </div>
                </>) : null}
                {$s0?.isEmpty ? (<>
                  <div {...S(`border-top: 1px solid ${I($s0?.t?.line)}; margin: 0 14px 6px`)}>
                    <div className={"a-fade"} {...S("display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 48px 24px 44px; box-sizing: border-box; text-align: center")}>
                      <span {...S(`display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.listBlk?.tileBg)}; color: ${I($s0?.listBlk?.tileFg)}`)}>
                        <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={$s0?.listBlk?.icon} />
                        </svg>
                      </span>
                      <div {...S("display: flex; flex-direction: column; align-items: center; gap: 4px; max-width: 380px")}>
                        <span {...S("font-size: 15px; font-weight: 600")}>
                          {T($s0?.listBlk?.title)}
                        </span>
                        {$s0?.listBlk?.hasSub ? (<>
                          <span {...S(`font-size: 13px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}`)}>
                            {T($s0?.listBlk?.sub)}
                          </span>
                        </>) : null}
                      </div>
                      {$s0?.listBlk?.hasCta ? (<>
                        <div {...S("display: flex; flex-wrap: wrap; justify-content: center; gap: 8px")}>
                          <button type={"button"} className={"tb tp"} onClick={$s0?.listBlk?.act} {...S(`${I($s0?.k?.pSm)}; height: ${I($s0?.stH)}; flex-shrink: 0`)}>
                            {T($s0?.listBlk?.cta)}
                          </button>
                          {$s0?.listBlk?.has2 ? (<>
                            <button type={"button"} className={"tb tg"} onClick={$s0?.listBlk?.act2} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.oSm)}; height: ${I($s0?.stH)}`)}>
                              {T($s0?.listBlk?.cta2)}
                            </button>
                          </>) : null}
                        </div>
                      </>) : null}
                    </div>
                  </div>
                </>) : null}
                {$s0?.showFoot ? (<>
                  <div {...S(`display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 14px 12px 12px; padding: 14px 14px; border-top: 1px solid ${I($s0?.t?.border)}`)}>
                    <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                      {T($s0?.footLabel)}
                    </span>
                    {$s0?.notLoading ? (<>
                      <span {...S(`font-family: ${I($s0?.numFam)}; font-size: 18px; font-weight: 600; font-variant-numeric: tabular-nums`)}>
                        {T($s0?.footAmt)}
                      </span>
                    </>) : null}
                    {$s0?.isLoading ? (<>
                      <span className={"a-pulse"} {...S($s0?.skFoot)} />
                    </>) : null}
                  </div>
                </>) : null}
              </section>
            </>) : null}
            {$s0?.isIncome ? (<>
              <div {...S("display: flex; flex-wrap: wrap; gap: 16px; align-items: stretch")}>
                <section className={"a-in"} {...S(`animation-delay: 0.16s; flex: 3 1 480px; min-width: 0; padding: ${I($s0?.cardPad)}; display: flex; flex-direction: column; gap: 14px; ${I($s0?.k?.card)}`)}>
                  <div {...S("display: flex; flex-direction: column; gap: 4px")}>
                    <h2 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 16px; font-weight: 600`)}>
                      {"By brand"}
                    </h2>
                    <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                      {"What each brand has paid you this year"}
                    </span>
                  </div>
                  <div {...S("display: flex; flex-direction: column")}>
                    {A($s0?.brands).map((it, i) => {
                      const $s1 = { ...$s0, "b": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div {...S(`display: grid; grid-template-columns: ${I($s1?.brandCols)}; align-items: center; gap: 14px; min-height: 46px; border-bottom: ${I($s1?.b?.line)}`)}>
                          <span {...S("min-width: 0; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                            {T($s1?.b?.name)}
                          </span>
                          <span aria-hidden={"true"} {...S(`display: block; height: 6px; border-radius: ${I($s1?.t?.rCtl)}; background: ${I($s1?.t?.off)}; overflow: hidden`)}>
                            <span className={"a-width"} {...S(`animation-delay: ${I($s1?.b?.delay)}; display: block; height: 6px; width: ${I($s1?.b?.w)}; border-radius: ${I($s1?.t?.rCtl)}; background: ${I($s1?.t?.primary)}`)} />
                          </span>
                          <span {...S("text-align: right; font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums")}>
                            {T($s1?.b?.amount)}
                          </span>
                          {$s1?.b?.inv ? (<>
                            <button className={"tb tg"} type={"button"} aria-label={$s1?.b?.invLabel} {...S(`--hv: ${I($s1?.t?.fill)}; ${I($s1?.k?.icoS)}`)}>
                              <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7zM14 2v4a2 2 0 0 0 2 2h4M16 13H8M16 17H8M10 9H8"} />
                              </svg>
                            </button>
                          </>) : null}
                          {$s1?.b?.noInv ? (<>
                            <span />
                          </>) : null}
                        </div>
                      </React.Fragment>);
                    })}
                    {A($s0?.skBrands).map((it, i) => {
                      const $s1 = { ...$s0, "sb": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div {...S(`display: grid; grid-template-columns: ${I($s1?.brandCols)}; align-items: center; gap: 14px; min-height: 46px; border-bottom: ${I($s1?.sb?.line)}`)}>
                          <span className={"a-pulse"} {...S($s1?.sb?.w)} />
                          <span className={"a-pulse"} {...S($s1?.skTrack)} />
                          <span {...S("display: flex; justify-content: flex-end")}>
                            <span className={"a-pulse"} {...S($s1?.skAmt)} />
                          </span>
                          <span />
                        </div>
                      </React.Fragment>);
                    })}
                    {$s0?.isEmpty ? (<>
                      <div {...S(`box-sizing: border-box; border: 1px dashed ${I($s0?.t?.border)}; border-radius: ${I($s0?.t?.rTile)}`)}>
                        <div className={"a-fade"} {...S("display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 40px 24px; box-sizing: border-box; text-align: center")}>
                          <span {...S(`display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.brandBlk?.tileBg)}; color: ${I($s0?.brandBlk?.tileFg)}`)}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={$s0?.brandBlk?.icon} />
                            </svg>
                          </span>
                          <div {...S("display: flex; flex-direction: column; align-items: center; gap: 4px; max-width: 380px")}>
                            <span {...S("font-size: 15px; font-weight: 600")}>
                              {T($s0?.brandBlk?.title)}
                            </span>
                            {$s0?.brandBlk?.hasSub ? (<>
                              <span {...S(`font-size: 13px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}`)}>
                                {T($s0?.brandBlk?.sub)}
                              </span>
                            </>) : null}
                          </div>
                          {$s0?.brandBlk?.hasCta ? (<>
                            <div {...S("display: flex; flex-wrap: wrap; justify-content: center; gap: 8px")}>
                              <button type={"button"} className={"tb tp"} onClick={$s0?.brandBlk?.act} {...S(`${I($s0?.k?.pSm)}; height: ${I($s0?.stH)}; flex-shrink: 0`)}>
                                {T($s0?.brandBlk?.cta)}
                              </button>
                              {$s0?.brandBlk?.has2 ? (<>
                                <button type={"button"} className={"tb tg"} onClick={$s0?.brandBlk?.act2} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.oSm)}; height: ${I($s0?.stH)}`)}>
                                  {T($s0?.brandBlk?.cta2)}
                                </button>
                              </>) : null}
                            </div>
                          </>) : null}
                        </div>
                      </div>
                    </>) : null}
                  </div>
                </section>
                <div {...S("flex: 2 1 320px; min-width: 0; display: flex; flex-direction: column; gap: 16px")}>
                  {$s0?.isSample ? (<>
                    <a href={H("SDeals.dc.html")} className={"tc a-in"} {...S(`animation-delay: 0.2s; display: flex; align-items: center; gap: 14px; padding: 16px 16px 16px 20px; color: ${I($s0?.t?.fg)}; text-decoration: none; ${I($s0?.k?.card)}`)}>
                      <span {...S(`width: 36px; height: 36px; flex: 0 0 36px; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.fill)}; display: inline-flex; align-items: center; justify-content: center`)}>
                        <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <circle cx={"12"} cy={"12"} r={"10"} />
                          <path d={"M12 8v4M12 16h.01"} />
                        </svg>
                      </span>
                      <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                        <span {...S("font-weight: 500")}>
                          {"Not included"}
                        </span>
                        <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                          {$s0?.negNote}
                        </span>
                      </span>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 16px")}>
                        <path d={"m9 18 6-6-6-6"} />
                      </svg>
                    </a>
                  </>) : null}
                  {$s0?.isLoading ? (<>
                    <div {...S(`display: flex; align-items: center; gap: 14px; padding: 16px 16px 16px 20px; ${I($s0?.k?.card)}`)}>
                      <span className={"a-pulse"} {...S($s0?.skIco)} />
                      <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 8px")}>
                        <span className={"a-pulse"} {...S($s0?.skNi1)} />
                        <span className={"a-pulse"} {...S($s0?.skNi2)} />
                      </span>
                    </div>
                  </>) : null}
                  <section className={"a-in"} {...S(`animation-delay: 0.24s; flex: 1 1 auto; padding: ${I($s0?.cardPad)}; display: flex; flex-direction: column; gap: 14px; ${I($s0?.k?.card)}`)}>
                    <div {...S("display: flex; flex-direction: column; gap: 4px")}>
                      <h2 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 16px; font-weight: 600`)}>
                        {"Export CSV"}
                      </h2>
                      <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                        {"One row per payment for the period you picked."}
                      </span>
                    </div>
                    <div {...S($s0?.k?.group)}>
                      <div {...S($s0?.k?.row)}>
                        <span {...S(`flex: 1 1 auto; color: ${I($s0?.t?.mutedFg)}`)}>
                          {"Period"}
                        </span>
                        <span {...S("font-weight: 500")}>
                          {T($s0?.period)}
                        </span>
                      </div>
                      <div {...S($s0?.k?.rowT)}>
                        <span {...S(`flex: 1 1 auto; color: ${I($s0?.t?.mutedFg)}`)}>
                          {"Payments"}
                        </span>
                        {$s0?.notLoading ? (<>
                          <span {...S("font-weight: 500; font-variant-numeric: tabular-nums")}>
                            {T($s0?.expCount)}
                          </span>
                        </>) : null}
                        {$s0?.isLoading ? (<>
                          <span className={"a-pulse"} {...S($s0?.skCountR)} />
                        </>) : null}
                      </div>
                      <div {...S($s0?.k?.rowT)}>
                        <span {...S(`flex: 1 1 auto; color: ${I($s0?.t?.mutedFg)}`)}>
                          {"Total received"}
                        </span>
                        {$s0?.notLoading ? (<>
                          <span {...S("font-weight: 600; font-variant-numeric: tabular-nums")}>
                            {T($s0?.expTotal)}
                          </span>
                        </>) : null}
                        {$s0?.isLoading ? (<>
                          <span className={"a-pulse"} {...S($s0?.skAmt)} />
                        </>) : null}
                      </div>
                    </div>
                    <button className={"tb tp"} type={"button"} onClick={$s0?.exportCsv} {...S($s0?.k?.pBlk)}>
                      <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"} />
                      </svg>
                      {"Export CSV"}
                    </button>
                    <p {...S(`margin: 0; font-size: 13px; color: ${I($s0?.t?.mutedFg)}`)}>
                      {"This is a record of payments you marked as received in Talby. It is not a tax document."}
                    </p>
                  </section>
                </div>
              </div>
            </>) : null}
          </>) : null}
          {$s0?.isError ? (<>
            <section className={"a-in"} {...S(`animation-delay: 0.05s; min-width: 0; ${I($s0?.k?.card)}`)}>
              <div className={"a-fade"} {...S("display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 96px 24px; box-sizing: border-box; text-align: center")}>
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
        {$s0?.rowMenuOpen ? (<>
          <div onClick={$s0?.closeRowMenu} {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 55")} />
          <div role={"menu"} aria-label={"Payment actions"} className={"a-drop"} {...S(`position: fixed; top: ${I($s0?.rowMenuTop)}; left: ${I($s0?.rowMenuLeft)}; width: 200px; z-index: 56; ${I($s0?.k?.pop)}`)}>
            {$s0?.rm?.unpaid ? (<>
              <button className={"tb tg"} type={"button"} role={"menuitem"} onClick={$s0?.rm?.paid} {...S($s0?.k?.item)}>
                {"Mark as paid"}
              </button>
            </>) : null}
            {$s0?.rm?.canRemind ? (<>
              <button className={"tb tg"} type={"button"} role={"menuitem"} onClick={$s0?.rm?.remind} {...S($s0?.k?.item)}>
                {"Draft a reminder"}
              </button>
            </>) : null}
            <button className={"tb tg"} type={"button"} role={"menuitem"} onClick={$s0?.rm?.invoice} {...S($s0?.k?.item)}>
              {"Upload invoice"}
            </button>
            <div {...S(`height: 1px; margin: 6px -6px; background: ${I($s0?.t?.line)}`)} />
            <a href={H("SDeal.dc.html")} role={"menuitem"} className={"tb tg"} {...S($s0?.k?.item)}>
              {"Open deal"}
            </a>
          </div>
        </>) : null}
        {$s0?.rowSheetOpen ? (<>
          <div {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 72")}>
            <div onClick={$s0?.closeRowMenu} className={"a-fade"} {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: ${I($s0?.t?.overlay)}`)} />
            <div role={"menu"} aria-label={"Payment actions"} className={"a-up"} {...S(`position: absolute; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; padding: 8px 12px 20px; box-sizing: border-box; background: ${I($s0?.t?.card)}; color: ${I($s0?.t?.fg)}; border-radius: ${I($s0?.sheetR)}; box-shadow: ${I($s0?.t?.shPop)}`)}>
              <span aria-hidden={"true"} {...S(`display: block; flex: 0 0 auto; width: 36px; height: 4px; margin: 0 auto 4px; border-radius: 2px; background: ${I($s0?.t?.borderStrong)}`)} />
              <div {...S("display: flex; align-items: center; gap: 12px; padding: 10px 6px 14px")}>
                <span {...S(`width: 40px; height: 40px; flex: 0 0 40px; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.fill)}; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600`)}>
                  {T($s0?.rs?.l)}
                </span>
                <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                  <span {...S("font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                    {T($s0?.rs?.brand)}
                  </span>
                  <span {...S(`font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: ${I($s0?.rs?.subFg)}`)}>
                    {T($s0?.rs?.sub)}
                  </span>
                </span>
                <span {...S(`font-family: ${I($s0?.numFam)}; font-size: 17px; font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums`)}>
                  {T($s0?.rs?.amount)}
                </span>
              </div>
              <div {...S(`display: flex; flex-direction: column; padding: 4px; ${I($s0?.k?.group)}`)}>
                {$s0?.rm?.unpaid ? (<>
                  <button className={"tb tg"} type={"button"} role={"menuitem"} onClick={$s0?.rm?.paid} {...S(`${I($s0?.k?.item)}; min-height: 48px; font-size: 15px`)}>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 16px; color: ${I($s0?.t?.mutedFg)}`)}>
                      <path d={"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8.5 12l2.5 2.5 4.5-5"} />
                    </svg>
                    <span>
                      {"Mark as paid"}
                    </span>
                  </button>
                </>) : null}
                {$s0?.rm?.canRemind ? (<>
                  <button className={"tb tg"} type={"button"} role={"menuitem"} onClick={$s0?.rm?.remind} {...S(`${I($s0?.k?.item)}; min-height: 48px; font-size: 15px`)}>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 16px; color: ${I($s0?.t?.mutedFg)}`)}>
                      <path d={"M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 7l-10 6L2 7"} />
                    </svg>
                    <span>
                      {"Draft a reminder"}
                    </span>
                  </button>
                </>) : null}
                <button className={"tb tg"} type={"button"} role={"menuitem"} onClick={$s0?.rm?.invoice} {...S(`${I($s0?.k?.item)}; min-height: 48px; font-size: 15px`)}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 16px; color: ${I($s0?.t?.mutedFg)}`)}>
                    <path d={"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"} />
                  </svg>
                  <span>
                    {"Upload invoice"}
                  </span>
                </button>
                <div {...S(`height: 1px; margin: 4px -4px; background: ${I($s0?.t?.line)}`)} />
                <a href={H("SDeal.dc.html")} role={"menuitem"} className={"tb tg"} {...S(`${I($s0?.k?.item)}; min-height: 48px; font-size: 15px`)}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 16px; color: ${I($s0?.t?.mutedFg)}`)}>
                    <path d={"M7 17 17 7M7 7h10v10"} />
                  </svg>
                  <span>
                    {"Open deal"}
                  </span>
                </a>
              </div>
              <button className={"tb tg"} type={"button"} onClick={$s0?.closeRowMenu} {...S(`${I($s0?.k?.oBlk)}; height: 44px; margin-top: 10px`)}>
                {"Cancel"}
              </button>
            </div>
          </div>
        </>) : null}
        {$s0?.periodSheet ? (<>
          <div {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 72")}>
            <div onClick={$s0?.closePeriod} className={"a-fade"} {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: ${I($s0?.t?.overlay)}`)} />
            <div role={"listbox"} aria-label={"Period"} className={"a-up"} {...S(`position: absolute; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; padding: 8px 12px 20px; box-sizing: border-box; background: ${I($s0?.t?.card)}; color: ${I($s0?.t?.fg)}; border-radius: ${I($s0?.sheetR)}; box-shadow: ${I($s0?.t?.shPop)}`)}>
              <span aria-hidden={"true"} {...S(`display: block; flex: 0 0 auto; width: 36px; height: 4px; margin: 0 auto 4px; border-radius: 2px; background: ${I($s0?.t?.borderStrong)}`)} />
              <span {...S(`padding: 10px 8px 10px; font-family: ${I($s0?.titleFam)}; font-size: 16px; font-weight: 600`)}>
                {"Period"}
              </span>
              <div {...S(`display: flex; flex-direction: column; padding: 4px; ${I($s0?.k?.group)}`)}>
                {A($s0?.periods).map((it, i) => {
                  const $s1 = { ...$s0, "o": it, $index: i };
                  return (<React.Fragment key={i}>
                    <button className={"tb tg"} type={"button"} role={"option"} aria-selected={$s1?.o?.on} onClick={$s1?.o?.pick} {...S(`justify-content: space-between; ${I($s1?.k?.item)}; min-height: 48px; font-size: 15px`)}>
                      {T($s1?.o?.label)}
                      <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`visibility: ${I($s1?.o?.check)}`)}>
                        <path d={"M20 6 9 17l-5-5"} />
                      </svg>
                    </button>
                  </React.Fragment>);
                })}
              </div>
            </div>
          </div>
        </>) : null}
        {$s0?.remindOpen ? (<>
          <div {...S(`position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 70; display: flex; align-items: center; justify-content: center; padding: ${I($s0?.dlgPad)}; box-sizing: border-box`)}>
            <div onClick={$s0?.closeRemind} className={"a-fade"} {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: ${I($s0?.t?.overlay)}`)} />
            <div role={"dialog"} aria-modal={"true"} aria-labelledby={"rm-title"} className={$s0?.dlgAnim} {...S(`position: relative; width: ${I($s0?.dlg?.w)}; max-width: 100%; height: ${I($s0?.dlg?.h)}; max-height: ${I($s0?.dlg?.maxH)}; display: flex; flex-direction: column; box-sizing: border-box; background: ${I($s0?.t?.card)}; border: ${I($s0?.dlg?.border)}; border-radius: ${I($s0?.dlg?.radius)}; box-shadow: ${I($s0?.t?.shPop)}; overflow: hidden`)}>
              <div {...S(`display: flex; align-items: flex-start; gap: 12px; padding: ${I($s0?.dlgHeadPad)}`)}>
                <div {...S("flex: 1 1 auto; display: flex; flex-direction: column; gap: 4px")}>
                  <h2 id={"rm-title"} {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 18px; font-weight: 600`)}>
                    {"Draft a payment reminder"}
                  </h2>
                  <p {...S(`margin: 0; color: ${I($s0?.t?.mutedFg)}`)}>
                    {"A short, friendly note for "}{T($s0?.rmBrand)}{". Edit it, then copy and send it yourself."}
                  </p>
                </div>
                <button className={"tb tg"} type={"button"} onClick={$s0?.closeRemind} aria-label={"Close"} {...S($s0?.k?.ico)}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M18 6 6 18M6 6l12 12"} />
                  </svg>
                </button>
              </div>
              <div {...S(`flex: 1 1 auto; overflow-y: auto; padding: ${I($s0?.dlgBodyPad)}; display: flex; flex-direction: column; gap: 14px`)}>
                <div {...S(`display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; ${I($s0?.k?.tile)}`)}>
                  <div {...S("display: flex; flex-direction: column; gap: 2px")}>
                    <span {...S($s0?.k?.caps)}>
                      {"Overdue"}
                    </span>
                    <span {...S(`font-family: ${I($s0?.numFam)}; font-size: 20px; font-weight: 600; font-variant-numeric: tabular-nums`)}>
                      {T($s0?.rmAmount)}
                    </span>
                  </div>
                  <span {...S(`color: ${I($s0?.t?.destr)}; font-weight: 500`)}>
                    {T($s0?.rmLate)}
                  </span>
                </div>
                <div {...S($s0?.k?.group)}>
                  <div {...S($s0?.k?.row)}>
                    <label htmlFor={"rm-to"} {...S("flex: 0 0 72px")}>
                      {"To"}
                    </label>
                    <input id={"rm-to"} className={"ti"} type={"email"} placeholder={"Rep email"} {...S($s0?.k?.ctlF)} />
                  </div>
                  <div {...S($s0?.k?.rowT)}>
                    <label htmlFor={"rm-sub"} {...S("flex: 0 0 72px")}>
                      {"Subject"}
                    </label>
                    <input id={"rm-sub"} className={"ti"} value={V0($s0?.rmSubject, "")} {...S($s0?.k?.ctlF)} />
                  </div>
                </div>
                <label {...S("display: flex; flex-direction: column; gap: 8px")}>
                  <span {...S("font-weight: 500")}>
                    {"Message"}
                  </span>
                  <textarea className={"ti"} value={V0($s0?.rmText, "")} onChange={$s0?.setRmText} {...S(`height: ${I($s0?.rmAreaH)}; ${I($s0?.k?.area)}`)} />
                </label>
              </div>
              <div {...S(`display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: ${I($s0?.dlgFootPad)}; border-top: 1px solid ${I($s0?.t?.line)}`)}>
                <button className={"tb tg"} type={"button"} onClick={$s0?.closeRemind} {...S(`flex: ${I($s0?.btnFlex)}; ${I($s0?.k?.btnO)}; height: ${I($s0?.dlgBtnH)}`)}>
                  {"Cancel"}
                </button>
                <button className={"tb tp"} type={"button"} onClick={$s0?.copyRemind} {...S(`flex: ${I($s0?.btnFlex)}; ${I($s0?.k?.btnP)}; height: ${I($s0?.dlgBtnH)}`)}>
                  <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M8 4h10a2 2 0 0 1 2 2v12M16 8H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2z"} />
                  </svg>
                  {"Copy message"}
                </button>
              </div>
            </div>
          </div>
        </>) : null}
        {$s0?.recOpen ? (<>
          <div {...S(`position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 70; display: flex; align-items: center; justify-content: center; padding: ${I($s0?.dlgPad)}; box-sizing: border-box`)}>
            <div onClick={$s0?.closeRecord} className={"a-fade"} {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: ${I($s0?.t?.overlay)}`)} />
            <div role={"dialog"} aria-modal={"true"} aria-labelledby={"rec-title"} className={$s0?.dlgAnim} {...S(`position: relative; width: ${I($s0?.dlg?.w)}; max-width: 100%; height: ${I($s0?.dlg?.h)}; max-height: ${I($s0?.dlg?.maxH)}; display: flex; flex-direction: column; box-sizing: border-box; background: ${I($s0?.t?.card)}; border: ${I($s0?.dlg?.border)}; border-radius: ${I($s0?.dlg?.radius)}; box-shadow: ${I($s0?.t?.shPop)}; overflow: hidden`)}>
              <div {...S(`display: flex; align-items: flex-start; gap: 12px; padding: ${I($s0?.dlgHeadPad)}`)}>
                <div {...S("flex: 1 1 auto; display: flex; flex-direction: column; gap: 4px")}>
                  <h2 id={"rec-title"} {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 18px; font-weight: 600`)}>
                    {"Record a payment"}
                  </h2>
                  <p {...S(`margin: 0; color: ${I($s0?.t?.mutedFg)}`)}>
                    {"Mark money as received. Talby updates the deal for you."}
                  </p>
                </div>
                <button className={"tb tg"} type={"button"} onClick={$s0?.closeRecord} aria-label={"Close"} {...S($s0?.k?.ico)}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M18 6 6 18M6 6l12 12"} />
                  </svg>
                </button>
              </div>
              <div {...S(`flex: 1 1 auto; overflow-y: auto; padding: ${I($s0?.recBodyPad)}; display: flex; flex-direction: column; gap: 14px`)}>
                <div {...S($s0?.k?.group)}>
                  <div {...S($s0?.recRow)}>
                    <span {...S($s0?.recLabel)}>
                      {"Payment"}
                    </span>
                    <button className={"tb tg"} type={"button"} onClick={$s0?.toggleRecPick} aria-haspopup={"listbox"} aria-expanded={$s0?.recPickOpen} {...S(`${I($s0?.k?.selW)}; ${I($s0?.ctlX)}; box-sizing: border-box`)}>
                      <span {...S("display: inline-flex; align-items: center; gap: 8px; min-width: 0")}>
                        <span {...S(`width: 20px; height: 20px; flex: 0 0 20px; border-radius: 10px; background: ${I($s0?.t?.card)}; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700`)}>
                          {T($s0?.rec?.l)}
                        </span>
                        <span {...S("white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                          {T($s0?.rec?.brand)}
                        </span>
                      </span>
                      <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 15px")}>
                        <path d={"m7 15 5 5 5-5M7 9l5-5 5 5"} />
                      </svg>
                    </button>
                    {$s0?.recPickOpen ? (<>
                      <div onClick={$s0?.closeRecPick} {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 9")} />
                      <div role={"listbox"} aria-label={"Payments"} className={"a-drop"} {...S(`position: absolute; top: ${I($s0?.lb?.top)}; right: ${I($s0?.lb?.right)}; left: ${I($s0?.lb?.left)}; width: ${I($s0?.lb?.w)}; z-index: 10; ${I($s0?.k?.pop)}`)}>
                        <label className={"ti"} {...S(`display: flex; align-items: center; gap: 8px; height: 34px; margin: 0 0 6px; padding: 0 12px; box-sizing: border-box; border-radius: ${I($s0?.t?.rItem)}; background: ${I($s0?.t?.fill)}; color: ${I($s0?.t?.mutedFg)}`)}>
                          <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 14px")}>
                            <circle cx={"11"} cy={"11"} r={"8"} />
                            <path d={"m21 21-4.3-4.3"} />
                          </svg>
                          <input aria-label={"Search payments"} placeholder={"Search payments"} value={V0($s0?.recQ, "")} onChange={$s0?.setRecQ} {...S(`flex: 1 1 auto; min-width: 0; height: 32px; border: none; outline: none; background: transparent; font: inherit; font-size: 14px; color: ${I($s0?.t?.fg)}; padding: 0`, $s0?.recRef)} />
                        </label>
                        <div {...S(`max-height: ${I($s0?.lb?.maxH)}; overflow-y: auto`)}>
                          {A($s0?.recOpts).map((it, i) => {
                            const $s1 = { ...$s0, "o": it, $index: i };
                            return (<React.Fragment key={i}>
                              <button className={"tb tg"} type={"button"} role={"option"} aria-selected={$s1?.o?.on} onClick={$s1?.o?.pick} {...S(`min-height: 44px; ${I($s1?.k?.item)}; min-height: ${I($s1?.lb?.itemH)}`)}>
                                <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 1px")}>
                                  <span {...S("white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                                    {T($s1?.o?.label)}
                                  </span>
                                  <span {...S(`font-size: 12px; color: ${I($s1?.o?.subFg)}; white-space: nowrap`)}>
                                    {T($s1?.o?.sub)}
                                  </span>
                                </span>
                                <span {...S("font-weight: 600; font-variant-numeric: tabular-nums")}>
                                  {T($s1?.o?.amount)}
                                </span>
                                <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 14px; visibility: ${I($s1?.o?.check)}`)}>
                                  <path d={"M20 6 9 17l-5-5"} />
                                </svg>
                              </button>
                            </React.Fragment>);
                          })}
                          {$s0?.recNone ? (<>
                            <div {...S(`padding: 16px 10px; text-align: center; color: ${I($s0?.t?.mutedFg)}`)}>
                              {"No payments match."}
                            </div>
                          </>) : null}
                        </div>
                      </div>
                    </>) : null}
                  </div>
                  <div {...S($s0?.recRowT)}>
                    <label htmlFor={"rec-amt"} {...S($s0?.recLabel)}>
                      {"Amount received"}
                    </label>
                    <span className={"ti"} {...S(`display: flex; align-items: center; gap: 6px; ${I($s0?.k?.ctlW)}; ${I($s0?.ctlX)}`)}>
                      <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                        {"$"}
                      </span>
                      <input id={"rec-amt"} value={V0($s0?.recAmt, "")} onChange={$s0?.setRecAmt} inputMode={"decimal"} {...S(`flex: 1 1 auto; min-width: 0; height: 34px; border: none; outline: none; background: transparent; font: inherit; font-size: 14px; color: ${I($s0?.t?.fg)}; padding: 0; font-variant-numeric: tabular-nums`)} />
                    </span>
                  </div>
                  <div {...S($s0?.recRowT)}>
                    <span {...S($s0?.recLabel)}>
                      {"Date received"}
                    </span>
                    <div {...S(`flex: 0 1 300px; min-width: 0; ${I($s0?.ctlX)}`)}>
                      <SDatePicker value={$s0?.recDate} onChange={$s0?.setRecDate} label={"Date received"} align={"end"} clearable={false} color={$s0?.eff} dark={$s0?.dark} />
                    </div>
                  </div>
                </div>
                <div {...S(`display: flex; align-items: center; gap: 12px; padding: 12px 14px; ${I($s0?.k?.tile)}`)}>
                  <span {...S($s0?.k?.caps)}>
                    {"After this"}
                  </span>
                  <span {...S("flex: 1 1 auto; min-width: 0; text-align: right; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                    {T($s0?.recAfter)}
                  </span>
                </div>
              </div>
              <div {...S(`display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: ${I($s0?.dlgFootPad)}; border-top: 1px solid ${I($s0?.t?.line)}`)}>
                <button className={"tb tg"} type={"button"} onClick={$s0?.closeRecord} {...S(`flex: ${I($s0?.btnFlex)}; ${I($s0?.k?.btnO)}; height: ${I($s0?.dlgBtnH)}`)}>
                  {"Cancel"}
                </button>
                <button className={"tb tp"} type={"button"} onClick={$s0?.saveRecord} aria-disabled={$s0?.recOff} {...S(`flex: ${I($s0?.btnFlex)}; opacity: ${I($s0?.recOp)}; ${I($s0?.k?.btnP)}; height: ${I($s0?.dlgBtnH)}`)}>
                  {"Mark as paid"}
                </button>
              </div>
            </div>
          </div>
        </>) : null}
        {$s0?.drawerOpen ? (<>
          <div {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 88")}>
            <button type={"button"} aria-label={"Close menu"} className={"a-fade"} onClick={$s0?.closeNav} {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; padding: 0; border: none; background: ${I($s0?.t?.overlay)}; cursor: default`)} />
            <div className={"a-drawer"} {...S(`position: absolute; top: 0; bottom: 0; left: 0; width: 288px; max-width: 86%; overflow-y: auto; box-shadow: ${I($s0?.t?.shPop)}`)}>
              <SSidebar account={$s0?.account} active={"payments"} color={$s0?.eff} dark={$s0?.dark} drawer={true} plan={$s0?.plan} fresh={$s0?.sbFresh} onClose={$s0?.closeNav} />
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

export const meta = {"props":{"color":{"editor":"enum","options":["studio","sand","mac","stationery","editorial"],"default":"studio"},"dark":{"editor":"boolean","default":false},"view":{"editor":"enum","options":["sample","empty","loading","error"],"default":"sample"},"plan":{"editor":"enum","options":["active","trial","pastdue","canceled","readonly"],"default":"active"},"start":{"editor":"enum","options":["schedule","income"],"default":"schedule"},"failSave":{"editor":"boolean","default":false}},"preview":{"width":1440,"height":1840}};
export default $r.defineBoard("SPayments", Component, render, CSS, meta);
