// @ts-nocheck
/* eslint-disable */
'use client';
// SDeals: converted from design-source/boards/SDeals.dc.html.
// Markup, inline styles and logic are carried over exactly from the board.
// The logic class below is the board's own code, unchanged.
import * as React from 'react';
import * as $r from './_runtime';
import { DCLogic } from './_runtime';
import { SAMPLE_ACCOUNT, TalbyDates, SAMPLE_DEALS, getTalbyIO } from './_data';
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
      tab: 'all', q: '', facet: {}, facetOpen: false, colsOpen: false, viewOpen: false, cols: { pay: true, post: true, payby: true },
      sort: '', dir: 1, sel: {}, page: 0, per: 10, perOpen: false, rowMenu: -1, rmTop: 0, rmLeft: 0,
      added: [], removed: {}, archived: {}, paidIds: {}, invIds: {}, extraPaid: 0, payOv: {}, newFiles: {},
      open: props.start === 'deal' ? 6 : -1, sTab: 'details', acc: 'payment', sheetMenu: false, pop: null,
      e: {}, dirty: false, extras: [], items: [], draft: '', ftype: 'auto', ticking: {},
      add: props.start === 'new' ? 'new' : '', cmd: props.start === 'cmd', selMode: false
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
    if (prev.data !== p.data && p.data) this.setState({ added: [], removed: {}, archived: {}, paidIds: {}, invIds: {} });
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
  // Deal file upload. On the canvas this only says what would happen. The app connects it to a real upload.
  uploadFile(kind, deal) {
    var self = this, io = getTalbyIO();
    if (!io || typeof io.uploadDealFile !== 'function' || !deal || deal.dbId === undefined) { this.toast(kind === 'invoice' ? 'Choose an invoice' : 'Choose a file', kind === 'invoice' ? 'PDF or image. It is linked to this payment.' : 'A contract, invoice or other file for this deal.'); return; }
    var inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.pdf,.doc,.docx,.png,.jpg,.jpeg,.csv,application/pdf,image/*';
    inp.onchange = function () {
      var file = inp.files && inp.files[0]; if (!file) return;
      if (file.size > 20 * 1048576) { self.toastErr('This file is over 20 MB', 'Save a smaller copy, then try again.'); return; }
      var run = function () { Promise.resolve().then(function () { return io.uploadDealFile(file, { dealId: deal.dbId, kind: kind === 'auto' ? 'auto' : kind }); }).then(function (r) {
        var nf = Object.assign({}, self.state.newFiles); nf[deal.id] = (nf[deal.id] || []).concat([{ id: r && r.id, name: (r && r.name) || file.name, kind: (r && r.kind) || (kind === 'auto' ? 'other' : kind), url: (r && r.url) || '', date: (r && r.date) || '' }]);
        self.setState({ newFiles: nf }); self.toast(((r && r.kind) || kind) === 'invoice' ? 'Invoice added' : 'File added', file.name);
      }, function () { self.toastErr('Could not upload the file', 'Check your connection and try again.', run); }); };
      run();
    };
    inp.click();
  }
  toastErr(title, desc, retry) { this.toast(title, desc, null, { kind: 'error', cta: retry ? 'Try again' : '', act: retry || null }); }
  celebrate(pz) {
    var self = this; clearTimeout(this._pz1); clearTimeout(this._pz2);
    this.setState({ praise: null });
    this._pz1 = setTimeout(function () { self.setState({ praise: Object.assign({ id: Date.now() }, pz) }); }, 40);
    this._pz2 = setTimeout(function () { self.setState({ praise: null }); }, 5200);
  }

  write(title, fn, desc) {
    var self = this;
    if (!this.guard()) return false;
    if (this.props.writes === 'fail') { this.toastErr(title, desc || 'Check your connection and try again.', function () { if (self.guard()) fn(); }); return false; }
    this._wt = title; try { fn(); } finally { this._wt = null; } return true;
  }
  paidPraise(brand, amt) {
    var got = 46150 + this.state.extraPaid + amt;
    this.setState({ extraPaid: this.state.extraPaid + amt });
    this.celebrate({ title: 'You got paid', chip: '+$' + Math.round(amt).toLocaleString('en-US'), line: brand + ' paid. $' + got.toLocaleString('en-US') + ' received this year.' });
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
    var DATA = (p.data && typeof p.data === 'object') ? p.data : SAMPLE_DEALS, TODAY = DATA.today;
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
    var PLATICON={TikTok:'data:image/png;base64,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',Instagram:'data:image/png;base64,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',YouTube:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADkklEQVR42u2ZP2gVQRDGf7N3JubFEP8QJEKUpLIIamcvdoJWhmCj2NhaWdhZaGETGyHaSBANxNJSsREbMSCCdhZGkthEVBKNee9uLHY27yJ5T593l/jgDSx37N7tft/u7MzOLHSkIx1pa5FmjerbZZNvpSQ8usm7ysb6P/YQKUT/20w3wiW/z7ZAmqnrx5fdwF6gF+gDKsAuoAvYaWUH4IBuIG6Aowb8xI+xClTtuQYsAytWloHPwBfgq8DX33ASVkVCZahQOAGcA44ABwx8pUS1aaZO343EAvAamBF4ugGzgljpUZhS0AYlVUgUalaqBZfQb2JjNcJxz7CKgqB+2VF4YB8EcEmms2YdllXSzKQlGZKqMG0EXFir09awtk1gWyG1Zu9nIDCAC6Zzsg263qrZF8N6HsCptybHrCFqA98VGdajCr0OOAjsL6Rr57aSyH5gyAGHzEzm97Bp6kmUSyRg7AWGHTAYhs/XrcDwsCeRphBFvq4cCVgHswTygQe4cwdmZpSREUgSbyuiUrfVoAP2bXKQap2Amm88e1Z49Uq5elXp6/NERIpWq4B1n7MzTnGSJLBnj3D9uvDypTI+bha8FLXa6wrbwOtGLoJazRM5fFiYnoYnT1KOH9+oVvmIhJ8rDugp3k6IBxk29MmTjhcvYHIShobqRPKvRk84/pYjwaQmiSd06RLMziqXLytdXUWQ6HaZ40SJvjOyY2INBgaEiQnh3buU0VHN6QDjeMv8ZprWh3v/XpmYcMzPm035ZwMocW4H9jfAw55YWVFu3xZu3hSWlorovRpbiFdCPJUxnaA8egTXrglv39bVKknyjvLTWUxaLPBarT7rs7Nw6hSMjXnwwYTmBw/wIwa+5fbEWScmAt3dsLCg3Lgh3L0L1aqsb9RigAes32MLmouR/n7f+a1bXs8XF4tUl83kc2zpi3yeONjzx4+VK1eE58/rwNO0DPAB6xIKFy3GTAqLXaNIVaTM2DhgvRgDi8FvFhaRlaMuG0ay57wDPlgCKf9GDmef8hNeGOaPDpgDPhVmibYmY4dpzpwTn4d8Yw3tQCA1nK8FloMu3bOdnf7nJDSTv7ofatoxtfhwHXsmuVtpMblb26bk7lQ2udtO6fU3wEOBZ1nMrV5w7LKEUq+FohWL6HbgLzli/KVH1GQDrtpzzd5X7UT8A3+58c2ejS44HM2undr2iqnBT+13ydeRjnSkveQXJps54NcuWqEAAAAASUVORK5CYII=',Facebook:'data:image/png;base64,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'};

    var all = st.added.concat((isSample ? DATA.deals : []).map(function (x, i) { return { id: i, dbId: x.id, brand: x.brand, status: x.status, pay: x.pay, post: x.post || '', payBy: x.payBy || '', amt: x.amount, how: x.how || 'All at once', plats: x.platforms || [], type: x.type || '', rep: x.rep || '', created: x.created ? TalbyDates.md(x.created) : '', sched: x.payments || null, notes: x.notes || '', repEmail: x.repEmail || '', repPhone: x.repPhone || '', extras: x.extras || [], checklist: x.checklist || [], files: x.files || [], arch0: !!x.archived }; }))
      .filter(function (d) { return !st.removed[d.id]; })
      .map(function (d) { var o = Object.assign({}, d); if (st.paidIds[d.id]) o.pay = 'paid'; else if (st.invIds[d.id] && o.pay === 'not') o.pay = 'inv'; o.archived = st.archived[d.id] !== undefined ? !!st.archived[d.id] : !!d.arch0; return o; });
    function inTab(d, tb) {
      if (tb === 'archived') return d.archived;
      if (d.archived) return false;
      if (tb === 'progress') return d.status === 'Active' && d.pay !== 'paid';
      if (tb === 'negotiating') return d.status === 'Negotiating';
      if (tb === 'paid') return d.pay === 'paid';
      return true;
    }
    var facetKeys = Object.keys(st.facet).filter(function (x) { return st.facet[x]; });
    var q = (st.q || '').trim().toLowerCase();
    var filteredNow = facetKeys.length > 0 || !!q;
    var list = all.filter(function (d) { return inTab(d, st.tab) && (!q || d.brand.toLowerCase().indexOf(q) !== -1) && (!facetKeys.length || facetKeys.indexOf(d.pay) !== -1); });
    if (st.sort === 'brand') list.sort(function (a, b) { return a.brand.localeCompare(b.brand) * st.dir; });
    if (st.sort === 'amt') list.sort(function (a, b) { return (a.amt - b.amt) * st.dir; });
    if (isLoading || isError) list = [];
    var pages = Math.max(1, Math.ceil(list.length / st.per));
    var page0 = Math.min(st.page, pages - 1);
    var slice = list.slice(page0 * st.per, page0 * st.per + st.per);
    function dealParts(id) { var dd = all.filter(function (x) { return x.id === id; })[0] || {};
      return { extras: (dd.extras || []).map(function (x) { return { type: x.type, value: x.value || '' }; }), items: (dd.checklist || []).map(function (x) { return { text: x.text, done: !!x.done }; }) }; }
    function openDeal(id) { var dp = dealParts(id); self.setState({ open: id, sTab: 'details', acc: 'payment', sheetMenu: false, pop: null, e: {}, dirty: false, extras: dp.extras, items: dp.items, draft: '', rowMenu: -1, ticking: {} }); }
    function metaFor(d) {
      var inv = d.pay === 'paid' ? 'invoice paid' : (d.pay === 'inv' || d.pay === 'over' ? 'invoice sent' : 'no invoice');
      var parts = [d.archived ? 'Archived' : d.status];
      if (st.cols.post) parts.push(d.post ? 'posts ' + md(d.post) : 'no post date');
      if (st.cols.how) parts.push(d.how.toLowerCase());
      if (st.cols.invoice) parts.push(inv);
      if (st.cols.plats) parts.push(d.plats.join(', '));
      if (st.cols.type) parts.push(d.type.toLowerCase());
      if (st.cols.rep) parts.push(d.rep || 'no rep');
      if (st.cols.created) parts.push('added ' + (d.created ? d.created : 'today'));
      return parts.join(', ');
    }
    var rows = slice.map(function (d, i) {
      var sel = !!st.sel[d.id], pi = payIcon(d.pay), unpaid = d.pay !== 'paid', neg = d.status === 'Negotiating', isNew = d.id >= 2000;
      return {
        brand: d.brand, l: d.brand.charAt(0), status: d.archived ? 'Archived' : d.status, stDot: neg ? '#F59E0B' : (d.archived ? t.mutedFg : '#22C55E'), isNew: isNew,
        avBg: isNew ? t.primary : t.fill, avFg: isNew ? t.primaryFg : t.fg,
        pay: pi, post: d.post ? md(d.post) : 'None', postFg: d.post ? t.fg : t.mutedFg,
        hasPayBy: !!d.payBy, payBy: md(d.payBy), payByFg: d.pay === 'over' ? t.destr : t.fg, payByFw: d.pay === 'over' ? '500' : '400',
        addDate: !d.payBy && unpaid && !neg, noDate: !d.payBy && !(unpaid && !neg),
        how: d.how, invoice: d.pay === 'paid' ? 'Paid' : (d.pay === 'inv' || d.pay === 'over' ? 'Sent' : 'None'), invFg: d.pay === 'not' ? t.mutedFg : t.fg,
        plats: d.plats.map(function (n) { return { label: n, icon: PLATICON[n] || '', hasIcon: !!PLATICON[n], pad: PLATICON[n] ? '0 8px 0 3px' : '0 8px' }; }), type: d.type, rep: d.rep || 'Not added', repFg: d.rep ? t.fg : t.mutedFg, created: d.created || 'Today',
        mobDate: d.payBy ? (d.pay === 'paid' ? 'Paid ' + md(d.payBy) : 'Pay by ' + md(d.payBy)) : (unpaid ? 'No pay by date' : 'Paid'),
        cmpSub: (d.archived ? 'Archived' : d.status) + (st.cols.post && d.post ? ', posts ' + md(d.post) : ''),
        meta: metaFor(d),
        tap: function () { if (self.state.selMode) { var o = Object.assign({}, self.state.sel); if (o[d.id]) delete o[d.id]; else o[d.id] = true; self.setState({ sel: o }); } else openDeal(d.id); },
        boxL: box(t, sel) + '; width: 20px; height: 20px; flex: 0 0 20px', cardRole: st.selMode ? 'checkbox' : null, cardChecked: st.selMode ? String(sel) : null,
        mobDateFg: d.pay === 'over' ? t.destr : t.mutedFg,
        amount: fmt(d.amt), sel: sel, selLabel: 'Select ' + d.brand, box: box(t, sel), check: sel ? 'visible' : 'hidden',
        line: i < slice.length - 1 ? '1px solid ' + t.line : '1px solid transparent', bg: sel ? t.tile : 'transparent', hvr: sel ? t.tile : t.hvr,
        delay: (i * 0.022).toFixed(3) + 's',
        menuBg: st.rowMenu === d.id ? t.fill : 'transparent', menuLabel: 'Actions for ' + d.brand,
        open: function () { openDeal(d.id); },
        openDue: function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); openDeal(d.id); },
        toggle: function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); var o = Object.assign({}, st.sel); if (o[d.id]) delete o[d.id]; else o[d.id] = true; self.setState({ sel: o }); },
        menu: function (ev) {
          if (ev && ev.stopPropagation) ev.stopPropagation();
          var r = ev && ev.currentTarget ? ev.currentTarget.getBoundingClientRect() : { bottom: 200, top: 160, right: 900 };
          var vh = window.innerHeight || 1000, top = r.bottom + 6; if (top + 220 > vh) top = Math.max(8, r.top - 226);
          self.setState({ rowMenu: st.rowMenu === d.id ? -1 : d.id, rmTop: top, rmLeft: Math.max(8, r.right - 196) });
        }
      };
    });
    var selIds = Object.keys(st.sel).filter(function (x) { return st.sel[x]; });
    var pageIds = slice.map(function (d) { return d.id; });
    var allOnPage = pageIds.length > 0 && pageIds.every(function (id) { return st.sel[id]; });
    var someOnPage = pageIds.some(function (id) { return st.sel[id]; });
    var TABS = [['all', 'All deals'], ['progress', 'In progress'], ['negotiating', 'Negotiating'], ['paid', 'Paid'], ['archived', 'Archived']];
    var TSUB = { all: 'Every deal you have not archived', progress: 'Signed, with money still coming', negotiating: 'Not signed yet', paid: 'Paid in full', archived: 'Put away, kept for your records' };
    var tabs = TABS.map(function (x) { var on = x[0] === st.tab; return { label: x[1].replace(' deals', ''), sub: TSUB[x[0]], rowBg: on ? t.hv : 'transparent', on: on, fw: on ? '600' : '400', check: on ? 'visible' : 'hidden', count: isLoading || isError ? '' : String(all.filter(function (d) { return inTab(d, x[0]); }).length), style: tabStyle(t, on),
      pick: function () { self.setState({ tab: x[0], page: 0 }); }, pickClose: function () { self.setState({ tab: x[0], page: 0, viewOpen: false }); } }; });
    var curTab = tabs.filter(function (x) { return x.on; })[0];
    var FACETS = [['over', 'Overdue'], ['inv', 'Invoiced'], ['not', 'Not invoiced'], ['paid', 'Paid']];
    var base = all.filter(function (d) { return inTab(d, st.tab); });
    var facetOpts = FACETS.map(function (f) { var on = !!st.facet[f[0]]; return { label: f[1], on: on, box: box(t, on), check: on ? 'visible' : 'hidden', count: String(base.filter(function (d) { return d.pay === f[0]; }).length), pick: function () { var o = Object.assign({}, st.facet); o[f[0]] = !on; self.setState({ facet: o, page: 0 }); } }; });
    var facetChips = FACETS.filter(function (f) { return st.facet[f[0]]; }).map(function (f) { return f[1]; });
    if (facetChips.length > 2 || (mob && facetChips.length)) facetChips = [String(facetChips.length)];
    var COLS = [['pay', 'Payment status', '150px', 'Payment'], ['payby', 'Pay by', '120px', 'Payment'], ['how', 'How you get paid', '150px', 'Payment'], ['invoice', 'Invoice', '96px', 'Payment'], ['post', 'Post date', '100px', 'Content'], ['plats', 'Platforms', '196px', 'Content'], ['type', 'Post type', '110px', 'Content'], ['rep', 'Rep', '140px', 'Other'], ['created', 'Added', '90px', 'Other']];
    var col = {}; COLS.forEach(function (c) { col[c[0]] = !!st.cols[c[0]]; });
    var colsArr = ['44px', 'minmax(200px, 2fr)', '136px'], minW = 44 + 200 + 136 + 110 + 48;
    COLS.forEach(function (c) { if (col[c[0]]) { colsArr.push(c[2]); minW += parseInt(c[2], 10); } });
    colsArr.push('110px', '48px');
    var tblAvail = st.w - (collapsed ? 72 : 256) - (tabW ? 32 : 40) - 26;
    var cmp = !mob && tblAvail < 908;
    var vis = Object.assign({}, col, { status: !cmp, post: col.post && !cmp, cardPay: col.pay, cardDate: col.payby });
    if (cmp) {
      var CW = { pay: '140px', payby: '112px' };
      colsArr = ['40px', 'minmax(180px, 1fr)']; minW = 40 + 180 + 100 + 44 + 8;
      COLS.forEach(function (c) { if (vis[c[0]]) { var w = CW[c[0]] || c[2]; colsArr.push(w); minW += parseInt(w, 10); } });
      colsArr.push('100px', '44px');
    }
    var colGroups = ['Payment', 'Content', 'Other'].map(function (g) { return { label: g, items: COLS.filter(function (c) { return c[3] === g; }).map(function (c) { var on = col[c[0]]; return { label: c[1], on: on, box: box(t, on), check: on ? 'visible' : 'hidden', pick: function () { var o = Object.assign({}, self.state.cols); o[c[0]] = !on; self.setState({ cols: o }); } }; }) }; });
    var sortIcon = function (key) { return st.sort !== key ? 'm21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16' : (st.dir > 0 ? 'M12 5v14M19 12l-7 7-7-7' : 'M12 19V5M5 12l7-7 7 7'); };
    function setSort(key) { return function () { if (st.sort !== key) self.setState({ sort: key, dir: key === 'amt' ? -1 : 1 }); else if ((key === 'amt' && st.dir < 0) || (key !== 'amt' && st.dir > 0)) self.setState({ dir: -st.dir }); else self.setState({ sort: '', dir: 1 }); }; }
    function bulkSet(field, label) { return function () { var n = selIds.length; if (!n) return; self.write('Could not update ' + n + (n === 1 ? ' deal' : ' deals'), function () {
      var o = Object.assign({}, st[field]); selIds.forEach(function (id) { o[id] = true; }); var u = {}; u[field] = o; u.sel = {}; u.selMode = false; self.setState(u);
      self.emit('deals.bulk', { change: field === 'paidIds' ? 'paid' : field === 'invIds' ? 'invoiced' : 'archived', ids: all.filter(function (d) { return st.sel[d.id]; }).map(function (d) { return d.dbId; }) });
      if (field === 'paidIds') { var sum = all.filter(function (d) { return st.sel[d.id] && d.pay !== 'paid'; }).reduce(function (a, d) { return a + d.amt; }, 0); if (sum) { self.paidPraise(n + (n === 1 ? ' deal' : ' deals'), sum); return; } }
      self.toast(n + (n === 1 ? ' deal ' : ' deals ') + label, '', function () { var u2 = {}; u2[field] = st[field]; self.setState(u2); }); }); }; }
    var rmDeal = all.filter(function (d) { return d.id === st.rowMenu; })[0];
    var rm = {
      unpaid: rmDeal ? rmDeal.pay !== 'paid' : false,
      open: function () { if (rmDeal) openDeal(rmDeal.id); },
      paid: function () { if (!rmDeal) return; self.setState({ rowMenu: -1 }); self.write('Could not mark it paid', function () { self.emit('deal.markPaid', { id: rmDeal.dbId, amount: rmDeal.amt }); var o = Object.assign({}, self.state.paidIds); o[rmDeal.id] = true; self.setState({ paidIds: o }); self.paidPraise(rmDeal.brand, rmDeal.amt); }); },
      dup: function () { if (!rmDeal) return; self.setState({ rowMenu: -1 }); self.write('Could not duplicate the deal', function () { self.emit('deal.duplicate', { id: rmDeal.dbId }); var ad = self.state.added; var id = 3000 + ad.length; self.setState({ added: [Object.assign({}, rmDeal, { id: id, brand: rmDeal.brand + ' (copy)', pay: 'not', payBy: '', archived: false })].concat(ad) }); self.toast('Deal duplicated', rmDeal.brand + ' (copy)'); }); },
      archive: function () { if (!rmDeal) return; self.setState({ rowMenu: -1 }); self.write('Could not archive the deal', function () { self.emit('deal.archive', { id: rmDeal.dbId }); var prev = self.state.archived, o = Object.assign({}, prev); o[rmDeal.id] = true; self.setState({ archived: o }); self.toast('Deal archived', rmDeal.brand, function () { self.setState({ archived: prev }); self.emit('deal.unarchive', { id: rmDeal.dbId }, 'Could not undo'); }); }); },
      del: function () { if (!rmDeal) return; self.setState({ rowMenu: -1 }); self.write('Could not delete the deal', function () { self.emit('deal.delete', { id: rmDeal.dbId }); var prev = self.state.removed, o = Object.assign({}, prev); o[rmDeal.id] = true; self.setState({ removed: o }); self.toast('Deal deleted', rmDeal.brand, function () { self.setState({ removed: prev }); self.emit('deal.restore', { id: rmDeal.dbId }, 'Could not undo'); }); }); }
    };
    var cur = all.filter(function (d) { return d.id === st.open; })[0] || all[0] || { id: -1, brand: 'Deal', status: 'Active', pay: 'not', post: '', payBy: '', amt: 0, how: 'All at once', plats: [], type: '', rep: '', created: '' };
    var hasCur = all.some(function (d) { return d.id === st.open; });
    var e = st.e;
    var statusNow = e.status || cur.status;
    var how = e.how || cur.how;
    var when = e.when || 'Net 30';
    var due = e.due !== undefined ? e.due : cur.payBy;
    var lateDays = due ? TalbyDates.diff(due, TODAY) : 0;
    var sched = cur.sched && cur.sched.length
      ? cur.sched.map(function (s) { return [s.label, s.amount, s.state === 'paid' ? (s.date ? 'Received ' + md(s.date) : 'Received') : (s.date ? 'Due ' + md(s.date) + (s.state === 'over' && TalbyDates.diff(s.date, TODAY) > 0 ? ', ' + TalbyDates.diff(s.date, TODAY) + ' days late' : '') : 'No due date yet'), s.state, s.id]; })
      : [['Full payment', cur.amt, cur.pay === 'paid' ? (cur.payBy ? 'Received ' + md(cur.payBy) : 'Received') : (due ? 'Due ' + md(due) + (cur.pay === 'over' && lateDays > 0 ? ', ' + lateDays + ' days late' : '') : 'No due date yet'), cur.pay]];
    // Each payment's status can be changed from the panel. payOv holds the change until the page data reloads.
    sched = sched.map(function (s, j) {
      var ov = (e.pays && e.pays[j]) || st.payOv[cur.id + ':' + j];
      if (ov) return [s[0], s[1], ov === 'paid' ? 'Received' : ov === 'inv' ? 'Invoiced' + (due ? ', due ' + md(due) : '') : (due ? 'Due ' + md(due) : 'No due date yet'), ov, s[4]];
      if (cur.pay === 'paid' && s[3] !== 'paid') return [s[0], s[1], 'Received', 'paid', s[4]];
      return s;
    });
    var anyOv = sched.some(function (s, j) { return !!((e.pays && e.pays[j]) || st.payOv[cur.id + ':' + j]); });
    var headPay = !anyOv ? cur.pay : sched.every(function (s) { return s[3] === 'paid'; }) ? 'paid' : sched.some(function (s) { return s[3] === 'over'; }) ? 'over' : sched.some(function (s) { return s[3] === 'inv' || s[3] === 'paid'; }) ? 'inv' : 'not';
    var PSO = [['not', 'Not invoiced'], ['inv', 'Invoiced'], ['paid', 'Paid']];
    // A payment status change is an edit like any other: it shows right away and is saved with Save.
    function setPay(j, s, key) {
      self.setState({ pop: null });
      if (!self.guard() || s[3] === key) return;
      var pp = Object.assign({}, self.state.e.pays || {}); pp[j] = key; edit({ pays: pp });
    }
    var d = {
      brand: cur.brand, l: cur.brand.charAt(0), amount: fmt(cur.amt), statusNow: statusNow, pay: payIcon(headPay), stDot: statusNow === 'Negotiating' ? '#F59E0B' : (statusNow === 'Archived' ? t.mutedFg : '#22C55E'),
      sched: sched.map(function (s, j) { return { label: s[0], amount: fmt(s[1]), sub: s[2], subFg: s[3] === 'over' ? t.destr : t.mutedFg, pay: payIcon(s[3]), rowStyle: j ? k.rowT : k.row,
        open: st.pop === 'ps' + j, toggle: pop('ps' + j), aria: 'Payment status for ' + s[0] + ': ' + payIcon(s[3]).label + '. Change it',
        opts: PSO.map(function (o) { var on = s[3] === o[0] || (o[0] === 'inv' && s[3] === 'over'); return { label: o[1], on: on, check: on ? 'visible' : 'hidden', pick: function () { setPay(j, s, o[0]); } }; }) }; })
    };
    function edit(o) { if (!self.guard()) { self.setState({ pop: null }); return; } self.setState({ e: Object.assign({}, self.state.e, o), dirty: true, pop: null }); }
    function pop(kk) { return function () { self.setState({ pop: self.state.pop === kk ? null : kk, sheetMenu: false }); }; }
    function opts(arr, val, key) { return arr.map(function (lab) { var on = lab === val; return { label: lab, on: on, check: on ? 'visible' : 'hidden', pick: function () { var o = {}; o[key] = lab; edit(o); } }; }); }
    function acc(kk) { return function () { self.setState({ acc: self.state.acc === kk ? '' : kk, pop: null }); }; }
    function chipSet(arr, key) { return arr.map(function (lab) { var set = st.e[key] || {}; var on = !!set[lab]; return { label: lab, on: on, style: chip(t, on), pick: function () { var o = Object.assign({}, set); o[lab] = !on; var u = {}; u[key] = o; edit(u); } }; }); }
    var sTabs = [['details', 'Details'], ['checklist', 'Checklist'], ['notes', 'Notes'], ['files', 'Files']].map(function (x) {
      var on = st.sTab === x[0]; return { label: x[1], on: on, style: tabStyle(t, on), hasCount: x[0] === 'checklist' && st.items.length > 0, count: st.items.filter(function (it) { return it.done; }).length + '/' + st.items.length, pick: function () { self.setState({ sTab: x[0], pop: null, sheetMenu: false }); } };
    });
    function addItem() { var tx = (st.draft || '').trim(); if (!tx || !self.guard()) return; self.setState({ items: st.items.concat([{ text: tx, done: false }]), draft: '', dirty: true }); }
    var doneN = st.items.filter(function (it) { return it.done; }).length;
    var items = st.items.map(function (it, j) { return { text: it.text, done: it.done, aria: (it.done ? 'Mark not done: ' : 'Mark done: ') + it.text, box: box(t, it.done), fg: it.done ? t.mutedFg : t.fg, rowStyle: (j ? k.rowT : k.row) + '; min-height: 48px', delay: (j * 0.03).toFixed(2) + 's',
      strikeCls: it.done && st.ticking[j] ? 'a-strike' : '', strikeSize: it.done ? '100% 1.5px' : '0% 1.5px',
      toggle: function () { if (!self.guard()) return; var n = st.items.slice(); n[j] = { text: it.text, done: !it.done }; var tk = Object.assign({}, st.ticking); tk[j] = !it.done; self.setState({ items: n, ticking: tk, dirty: true }); },
      remove: function () { if (!self.guard()) return; self.setState({ items: st.items.filter(function (_, x) { return x !== j; }), dirty: true }); } }; });
    var extras = st.extras.map(function (x, j) { var bonus = x.type === 'Bonus'; return { type: x.type, typeAria: 'Type: ' + x.type + '. Switch type', amtLabel: bonus ? 'Bonus amount' : 'Commission rate', amtPh: bonus ? 'Amount, like $1,000' : 'Rate, like 10%', rowStyle: j ? k.rowT : k.row, value: x.value || '',
      setVal: function (ev) { if (locked) return; var n = self.state.extras.slice(); n[j] = { type: n[j].type, value: ev.target.value }; self.setState({ extras: n, dirty: true }); },
      dirty: function () { if (!locked && !self.state.dirty) self.setState({ dirty: true }); },
      toggleType: function () { if (!self.guard()) return; var n = st.extras.slice(); n[j] = { type: bonus ? 'Commission' : 'Bonus', value: x.value || '' }; self.setState({ extras: n, dirty: true }); },
      remove: function () { if (!self.guard()) return; self.setState({ extras: st.extras.filter(function (_, y) { return y !== j; }), dirty: true }); } }; });
    var dFiles = (cur.files || []).concat(st.newFiles[cur.id] || []);
    var FEXT = { pdf: ['PDF', t.pdfBg || t.badBg, t.pdfFg || t.destr], doc: ['DOC', t.fill, t.fg], docx: ['DOC', t.fill, t.fg], png: ['IMG', t.fill, t.fg], jpg: ['IMG', t.fill, t.fg], jpeg: ['IMG', t.fill, t.fg], csv: ['CSV', t.okBg, t.okFg] };
    var KIND = { contract: 'Contract', invoice: 'Invoice', other: 'File' };
    var files = dFiles.map(function (x, j) { var ex = ((x.name || '').split('.').pop() || '').toLowerCase(), b = FEXT[ex] || ['FILE', t.fill, t.fg];
      return { name: x.name || 'File', url: x.url || '', ext: b[0], badgeBg: b[1], badgeFg: b[2], meta: (KIND[x.kind] || 'File') + (x.date ? ', added ' + md(x.date) : ''), rowStyle: j ? k.rowT : k.row }; });
    var inv = dFiles.filter(function (x) { return x.kind === 'invoice'; }).slice(-1)[0];
    var ftHints = { auto: 'Talby works out whether it is a contract or an invoice.', contract: 'Saved as the contract for this deal.', invoice: 'Saved as an invoice and linked to the payment.', other: 'Saved with the deal files.' };
    var ftypes = [['auto', 'Auto'], ['contract', 'Contract'], ['invoice', 'Invoice'], ['other', 'Other']].map(function (x) { var on = st.ftype === x[0]; return { label: x[1], on: on, style: chip(t, on), pick: function () { self.setState({ ftype: x[0] }); } }; });
    var platsSel = Object.keys(st.e.plats || {}).filter(function (x) { return st.e.plats[x]; });
    var WHEN = ['When it posts', 'Net 15', 'Net 30', 'Net 45', 'Net 60', 'On a set date'];
    var postNow = e.post !== undefined ? e.post : cur.post;
    var live = all.filter(function (x) { return !x.archived; });
    var counted = live.filter(function (x) { return x.status !== 'Negotiating'; });
    var owedN = counted.filter(function (x) { return x.pay !== 'paid'; }).length;
    var noDeals = (isSample || isEmpty) && all.length === 0;
    var noExport = isLoading || isError || all.length === 0;
    var archEmpty = st.tab === 'archived' && !q && !facetKeys.length, tabEmpty = !q && !facetKeys.length && st.tab !== 'all';
    var noResBlk = filteredNow
      ? blk('empty', 'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM21 21l-4.3-4.3', 'No deals found', 'Try a different filter or search.', 'Clear filters', function () { self.setState({ facet: {}, q: '', facetOpen: false, page: 0 }); })
      : archEmpty ? blk('empty', 'M21 8v13H3V8M1 3h22v5H1zM10 12h4', 'No archived deals', 'Deals you archive show up here.')
      : blk('empty', 'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z', 'No deals in this view', 'Pick another view to see more of your deals.', tabEmpty ? 'Show all deals' : '', function () { self.setState({ tab: 'all', page: 0 }); });
    function many(n, f) { var o = []; for (var i = 0; i < n; i++) o.push(f(i)); return o; }
    var BW = ['52%', '38%', '60%', '46%', '42%', '56%', '34%', '48%', '40%', '54%'];
    var skRows = many(10, function (i) { return { brand: sk(BW[i], '12px'), sub: sk('36%', '10px'), status: sk(i % 4 === 3 ? '92px' : '66px', '24px', t.rCtl), pay: sk(['98px', '72px', '84px', '98px', '66px'][i % 5], '24px', t.rCtl), date: sk(['48px', '40px', '52px', '44px'][i % 4], '12px'), gen: sk('64px', '12px'), amt: sk(['52px', '44px', '56px', '48px'][i % 4], '12px'), line: i < 9 ? '1px solid ' + t.line : '1px solid transparent' }; });
    var skCards = many(8, function (i) { return { av: sk('36px', '36px', t.rCtl), brand: sk(BW[i], '13px'), badge: sk(['96px', '64px', '82px', '96px'][i % 4], '24px', t.rCtl), date: sk(['76px', '60px', '84px', '68px'][i % 4], '11px'), meta: sk(['44%', '36%', '52%', '40%'][i % 4], '10px'), amt: sk(['50px', '44px', '54px', '48px'][i % 4], '13px'), line: i < 7 ? '1px solid ' + t.line : '1px solid transparent' }; });
    var page = {
      subLine: !all.length ? 'Your deals and what they owe you show up here.' : live.length + ' deals, ' + owedN + ' still owe you money',
      subReady: isSample || isEmpty, skSub: sk('210px', '14px'),
      noExport: noExport, exportOp: noExport ? '0.45' : '1',
      exportCsv: function () { if (noExport) return; self.toast('Export started', 'Your deals CSV will download in a moment.'); },
      showData: !isError, notLoading: !isLoading, noDeals: noDeals, showTable: !mob && !noDeals, showCards: mob && !noDeals, showFoot: !noDeals,
      noRes: !noDeals && !isLoading && rows.length === 0, noResBlk: noResBlk,
      emptyBlk: blk('empty', 'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z', 'No deals yet', 'Add your first deal by hand, upload a contract or CSV, or import from Notion.', 'Add deal', function () { self.setState({ add: 'new', nav: false }); }, 'Upload', function () { self.setState({ add: 'upload', nav: false }); }),
      emptyPad: mob ? '48px 16px 56px' : '88px 24px 104px',
      errBlk: blk('error', IC.wifi, 'We could not load your deals', 'Check your connection and try again. Nothing was lost.', 'Try again', function () { self.retryLoad(); }),
      errPad: mob ? '56px 12px' : '88px 24px',
      tbOff: noDeals || isLoading ? '; opacity: 0.5; pointer-events: none' : '', searchH: mob ? '36px' : '34px', ctlH: mob ? '; height: 36px' : '',
      facetPop: st.facetOpen && !mob, facetSheet: st.facetOpen && mob, colsSheet: st.colsOpen && mob,
      noFacet: facetKeys.length === 0, clearOp: facetKeys.length ? '1' : '0.45', showLabel: 'Show ' + list.length + (list.length === 1 ? ' deal' : ' deals'),
      sheetBox: 'position: fixed; left: 0; right: 0; bottom: 0; z-index: 71; max-height: 86vh; overflow-y: auto; display: flex; flex-direction: column; padding: 8px 12px 16px; box-sizing: border-box; background: ' + t.card + '; color: ' + t.fg + '; border-top: 1px solid ' + t.border + '; border-radius: ' + t.rCard + ' ' + t.rCard + ' 0 0; box-shadow: ' + t.shPop,
      sheetHandle: 'display: block; flex: 0 0 4px; width: 36px; height: 4px; margin: 0 auto 10px; border-radius: 2px; background: ' + t.borderStrong,
      cmp: cmp, notCmp: !cmp, deskBar: !mob && !cmp, vis: vis, hasLine2: col.pay || col.payby,
      skRows: skRows, skCards: skCards, skChk: sk('16px', '16px', t.rBox), skAv: sk('30px', '30px', t.rCtl), skSel: sk('150px', '12px'), skPage: sk('76px', '12px'),
      selMode: st.selMode, notSelMode: !st.selMode, searchMin: mob ? '; min-width: 0' : '', searchOrd: mob ? '; order: 9; flex: 1 1 100%' : '', viewSheet: st.viewOpen && mob, showSelBtn: mob && !noDeals && isSample || (mob && isEmpty && !noDeals), selBtnLabel: st.selMode ? 'Done' : 'Select',
      toggleSelMode: function () { self.setState({ selMode: !self.state.selMode, sel: {}, facetOpen: false, colsOpen: false }); },
      mobBulk: mob && st.selMode && !noDeals && !isError, mobBulkLabel: selIds.length ? selIds.length + ' selected' : 'Tap deals to select them',
      noSel: selIds.length === 0, bulkOp: selIds.length ? '1' : '0.45', selAllLabel: allOnPage ? 'Deselect all' : 'Select all',
      cardPad: mob && st.selMode ? '120px' : '0px',
      ctlW: mob ? '184px' : '220px', ro: locked ? 'readonly' : null, lockFocus: function () { if (locked) self.guard(); },
      chooseFile: function () { if (!self.guard()) return; self.uploadFile(st.ftype, cur); },
      files: files, hasFiles: files.length > 0, invoiceSub: inv ? inv.name : 'No invoice yet', hasInvoice: !!(inv && inv.url), invoiceUrl: inv ? inv.url || '' : '',
      notesVal: e.notes !== undefined ? e.notes : (cur.notes || ''), setNotes: function (ev) { edit({ notes: ev.target.value }); },
      repEmail: e.repEmail !== undefined ? e.repEmail : (cur.repEmail || ''), setRepEmail: function (ev) { edit({ repEmail: ev.target.value }); },
      repPhone: e.repPhone !== undefined ? e.repPhone : (cur.repPhone || ''), setRepPhone: function (ev) { edit({ repPhone: ev.target.value }); },
      hStatusOpen: st.pop === 'hstatus', popHStatus: pop('hstatus'), hStatusOpts: opts(['Negotiating', 'Active'], statusNow, 'status'),
      minH: mob ? '100vh' : '980px', barPad: mob ? '12px 12px 8px' : '14px 14px 12px',
      tabs: tabs, viewOpen: st.viewOpen, toggleView: function () { self.setState({ viewOpen: !self.state.viewOpen, facetOpen: false }); }, viewLabel: curTab ? curTab.label : 'All deals', viewCount: curTab ? curTab.count : '',
      q: st.q, setQ: function (ev) { self.setState({ q: ev.target.value, page: 0 }); }, filterMax: mob ? 'none' : '240px',
      facetOpen: st.facetOpen, toggleFacet: function () { self.setState({ facetOpen: !self.state.facetOpen, colsOpen: false, perOpen: false, viewOpen: false }); },
      facetOpts: facetOpts, hasFacet: facetKeys.length > 0, facetChips: facetChips, clearFacet: function () { self.setState({ facet: {} }); },
      filtered: facetKeys.length > 0 || !!q, resetAll: function () { self.setState({ facet: {}, q: '', facetOpen: false, page: 0 }); },
      colsOpen: st.colsOpen, toggleCols: function () { self.setState({ colsOpen: !self.state.colsOpen, facetOpen: false, perOpen: false, viewOpen: false }); }, colsRot: st.colsOpen ? 'rotate(180deg)' : 'none',
      colGroups: colGroups, col: col, colCount: String(COLS.filter(function (c) { return col[c[0]]; }).length), resetCols: function () { self.setState({ cols: { pay: true, post: true, payby: true } }); },
      cols: colsArr.join(' '), tableMin: (cmp ? minW : Math.max(880, minW)) + 'px',
      allSel: allOnPage, allBox: box(t, allOnPage || someOnPage), allCheck: allOnPage || someOnPage ? 'visible' : 'hidden', allIcon: allOnPage ? 'M20 6 9 17l-5-5' : 'M5 12h14',
      toggleAll: function () { var o = Object.assign({}, st.sel); pageIds.forEach(function (id) { if (allOnPage) delete o[id]; else o[id] = true; }); self.setState({ sel: o }); },
      sortBrand: setSort('brand'), sortAmt: setSort('amt'), brandSortIcon: sortIcon('brand'), amtSortIcon: sortIcon('amt'),
      rows: rows,
      selLabel: selIds.length + ' of ' + list.length + ' row(s) selected.',
      perOpen: st.perOpen, togglePer: function () { self.setState({ perOpen: !self.state.perOpen, facetOpen: false, colsOpen: false }); }, perPage: String(st.per),
      perOpts: [10, 20, 30].map(function (n) { var on = st.per === n; return { label: String(n), on: on, fw: on ? '600' : '400', pick: function () { self.setState({ per: n, page: 0, perOpen: false }); } }; }),
      pageLabel: 'Page ' + (page0 + 1) + ' of ' + pages, atStart: page0 === 0, atEnd: page0 >= pages - 1, prevOp: page0 === 0 ? '0.45' : '1', nextOp: page0 >= pages - 1 ? '0.45' : '1',
      prevPage: function () { self.setState({ page: Math.max(0, page0 - 1) }); }, nextPage: function () { self.setState({ page: Math.min(pages - 1, page0 + 1) }); },
      rowMenuOpen: st.rowMenu !== -1 && !!rmDeal, rowMenuTop: st.rmTop + 'px', rowMenuLeft: st.rmLeft + 'px', closeRowMenu: function () { self.setState({ rowMenu: -1 }); }, rm: rm,
      bulk: selIds.length > 0 && !mob, bulkLabel: selIds.length + ' selected', clearSel: function () { self.setState({ sel: {} }); },
      bulkInvoiced: bulkSet('invIds', 'marked as invoiced'), bulkPaid: bulkSet('paidIds', 'marked as paid'), bulkArchive: bulkSet('archived', 'archived'),
      sheetOpen: st.open >= 0 && hasCur, d: d, closeSheet: function () { self.setState({ open: -1, pop: null, sheetMenu: false }); },
      sh: { inset: mob ? '0px' : '8px', w: mob ? '100%' : '480px', maxW: mob ? '100%' : 'calc(100% - 16px)', border: mob ? 'none' : ('1px solid ' + t.border), radius: mob ? '0px' : t.rCard, anim: mob ? 'a-up' : 'a-sheet' },
      sheetMenu: st.sheetMenu, toggleSheetMenu: function () { self.setState({ sheetMenu: !self.state.sheetMenu, pop: null }); },
      sheetDup: function () { self.setState({ sheetMenu: false }); self.write('Could not duplicate the deal', function () { self.emit('deal.duplicate', { id: cur.dbId }); self.toast('Deal duplicated', cur.brand + ' (copy)'); }); },
      sheetArchive: function () { self.setState({ sheetMenu: false }); self.write('Could not archive the deal', function () { self.emit('deal.archive', { id: cur.dbId }); var prev = self.state.archived, o = Object.assign({}, prev); o[cur.id] = true; self.setState({ archived: o, open: -1 }); self.toast('Deal archived', cur.brand, function () { self.setState({ archived: prev }); self.emit('deal.unarchive', { id: cur.dbId }, 'Could not undo'); }); }); },
      sheetDelete: function () { self.setState({ sheetMenu: false }); self.write('Could not delete the deal', function () { self.emit('deal.delete', { id: cur.dbId }); var prev = self.state.removed, o = Object.assign({}, prev); o[cur.id] = true; self.setState({ removed: o, open: -1 }); self.toast('Deal deleted', cur.brand, function () { self.setState({ removed: prev }); self.emit('deal.restore', { id: cur.dbId }, 'Could not undo'); }); }); },
      sTabs: sTabs, isDetails: st.sTab === 'details', isChecklist: st.sTab === 'checklist', isNotes: st.sTab === 'notes', isFiles: st.sTab === 'files',
      payOpen: st.acc === 'payment', dealOpen: st.acc === 'deal', repOpen: st.acc === 'rep',
      payRot: st.acc === 'payment' ? 'rotate(180deg)' : 'none', dealRot: st.acc === 'deal' ? 'rotate(180deg)' : 'none', repRot: st.acc === 'rep' ? 'rotate(180deg)' : 'none',
      accPay: acc('payment'), accDeal: acc('deal'), accRep: acc('rep'),
      paySummary: how + ', ' + (due ? 'due ' + md(due) : 'no due date'),
      dealSummary: statusNow + (postNow ? ', posts ' + md(postNow) : '') + (platsSel.length ? ', ' + platsSel.join(', ') : ''),
      amtVal: e.amt !== undefined ? e.amt : Math.round(cur.amt).toLocaleString('en-US'), setAmt: function (ev) { edit({ amt: ev.target.value }); },
      howOpen: st.pop === 'how', popHow: pop('how'), howVal: how, howOpts: opts(['All at once', 'Split', 'In parts', 'Monthly'], how, 'how'),
      whenOpen: st.pop === 'when', popWhen: pop('when'), whenVal: when, whenOpts: opts(WHEN, when, 'when'),
      dueVal: due || '', setDue: function (v) { edit({ due: v }); },
      extras: extras, noExtras: extras.length === 0, hasExtras: extras.length > 0, addExtra: function () { if (!self.guard()) return; self.setState({ extras: self.state.extras.concat([{ type: 'Bonus', value: '' }]), dirty: true }); },
      uploadInvoice: function () { if (!self.guard()) return; self.uploadFile('invoice', cur); },
      statusOpen: st.pop === 'status', popStatus: pop('status'), statusOpts: opts(['Negotiating', 'Active', 'Archived'], statusNow, 'status'),
      postVal: postNow || '', setPost: function (v) { edit({ post: v }); },
      plats: chipSet(['TikTok', 'Instagram', 'YouTube', 'Facebook', 'Other'], 'plats').map(function (c) { c.icon = PLATICON[c.label] || ''; c.hasIcon = !!PLATICON[c.label]; c.pad = c.hasIcon ? '0 14px 0 8px' : '0 14px'; return c; }), types: chipSet(['Video', 'Reel', 'Story', 'Post', 'Live'], 'types'),
      rev: String(e.rev || 0), revUp: function () { edit({ rev: (e.rev || 0) + 1 }); }, revDown: function () { edit({ rev: Math.max(0, (e.rev || 0) - 1) }); },
      repSummary: e.repName ? e.repName : (cur.rep || 'Not added'), repName: e.repName !== undefined ? e.repName : (cur.rep || ''), setRepName: function (ev) { edit({ repName: ev.target.value }); }, markDirty: function () { if (!locked && !self.state.dirty) self.setState({ dirty: true }); },
      checkLabel: doneN + ' of ' + st.items.length + ' done', checkPct: String(st.items.length ? Math.round(doneN / st.items.length * 100) : 0), checkW: (st.items.length ? Math.round(doneN / st.items.length * 100) : 0) + '%',
      draft: st.draft, setDraft: function (ev) { self.setState({ draft: ev.target.value }); }, draftKey: function (ev) { if (ev.key === 'Enter') addItem(); }, addItem: addItem,
      addStandard: function () { if (!self.guard()) return; self.setState({ items: ['Sign the contract', 'Film the content', 'Send the draft for review', 'Post the content', 'Send the invoice'].map(function (x) { return { text: x, done: false }; }), ticking: {}, dirty: true }); },
      items: items, noItems: items.length === 0, hasItems: items.length > 0, ftypes: ftypes, ftypeHint: ftHints[st.ftype],
      dirty: st.dirty, notDirty: !st.dirty, saveOp: st.dirty ? '1' : '0.4', saveDot: locked ? t.mutedFg : (st.dirty ? '#F59E0B' : '#22C55E'), saveText: locked ? 'View only on your plan' : (st.dirty ? 'Unsaved changes' : 'All changes saved'),
      showMarkPaid: !st.dirty && cur.pay !== 'paid',
      cancelEdits: function () { var dp = dealParts(cur.id); self.setState({ e: {}, dirty: false, extras: dp.extras, items: dp.items, pop: null }); },
      save: function () { if (!st.dirty) return; self.write('Could not save', function () {
        var ch = Object.assign({}, st.e), epp = ch.pays || {}; delete ch.pays;
        Object.keys(epp).forEach(function (j) { var sr = sched[+j] || []; self.emit('payment.setStatus', { dealId: cur.dbId, paymentId: sr[4] !== undefined ? sr[4] : null, index: +j, state: epp[j] }, 'Could not update the payment'); });
        self.emit('deal.update', { id: cur.dbId, changes: ch, extras: st.extras.slice(), checklist: st.items.slice() });
        var ep = st.e.pays || {}, u = { dirty: false, pop: null };
        if (Object.keys(ep).length) { var o = Object.assign({}, self.state.payOv); Object.keys(ep).forEach(function (j) { o[cur.id + ':' + j] = ep[j]; }); u.payOv = o;
          if (sched.every(function (x) { return x[3] === 'paid'; })) { var pi = Object.assign({}, self.state.paidIds); pi[cur.id] = true; u.paidIds = pi; } }
        self.setState(u); self.toast('Deal saved', cur.brand); }, 'Check your connection and try again. Your changes are still here.'); },
      markPaid: function () { self.write('Could not mark it paid', function () { self.emit('deal.markPaid', { id: cur.dbId, amount: cur.amt }); var o = Object.assign({}, self.state.paidIds); o[cur.id] = true; self.setState({ paidIds: o, open: -1 }); self.paidPraise(cur.brand, cur.amt); }); }
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
      onCreated: function (info) { self.setState({ add: '' }); self.celebrate(info || {}); if (info) self.emit(info.kind === 'deal' ? 'deal.create' : 'deals.import', info, info.kind === 'deal' ? 'Could not save the deal' : 'Could not import the deals'); var nd = (info && info.deals) || []; if (nd.length) { var base = 2000 + self.state.added.length; self.setState({ added: nd.map(function (x, i) { return { id: base + i, brand: x.brand, status: x.status || 'Active', pay: 'not', post: x.post || '', payBy: '', amt: x.amt || 0, how: 'All at once', plats: ['TikTok'], type: 'Video', rep: '', created: 'Today' }; }).concat(self.state.added), tab: 'all', page: 0, sort: '' }); } },
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
    out.chatHidden = st.appear || st.nav || st.cmd || !!st.add || !!(page.sheetOpen || page.mobBulk || page.facetSheet || page.colsSheet || page.viewSheet);
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
              <SSidebar account={$s0?.account} active={"deals"} color={$s0?.eff} dark={$s0?.dark} collapsed={$s0?.collapsed} plan={$s0?.plan} fresh={$s0?.sbFresh} />
            </div>
          </div>
        </>) : null}
        <main {...S(`flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 16px; padding: ${I($s0?.mainPad)}; box-sizing: border-box`)}>
          <STopbar account={$s0?.account} title={"Deals"} mobile={$s0?.mob} quiet={$s0?.quietBell} color={$s0?.eff} dark={$s0?.dark} onNav={$s0?.toggleNav} onSearch={$s0?.openCmd} onAppearance={$s0?.openAppear} onAdd={$s0?.openAdd} />
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
          <div {...S("display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; padding: 0 4px")}>
            <div {...S("display: flex; flex-direction: column; gap: 4px; min-width: 0")}>
              <h1 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: ${I($s0?.h1Fs)}; font-weight: 600; letter-spacing: ${I($s0?.t?.hTrack)}; text-transform: ${I($s0?.t?.hCase)}; line-height: 1.15`)}>
                {"Deals"}
              </h1>
              {$s0?.subReady ? (<>
                <p {...S(`margin: 0; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                  {T($s0?.subLine)}
                </p>
              </>) : null}
              {$s0?.isLoading ? (<>
                <span className={"a-pulse"} {...S(`margin: 3px 0; ${I($s0?.skSub)}`)} />
              </>) : null}
            </div>
            {$s0?.showSelBtn ? (<>
              <button className={"tb tg"} type={"button"} onClick={$s0?.toggleSelMode} aria-pressed={$s0?.selMode} {...S(`${I($s0?.k?.btnO)}; height: 36px`)}>
                {T($s0?.selBtnLabel)}
              </button>
            </>) : null}
            {$s0?.notMob ? (<>
              <button className={"tb tg"} type={"button"} onClick={$s0?.exportCsv} aria-disabled={$s0?.noExport} {...S(`opacity: ${I($s0?.exportOp)}; ${I($s0?.k?.btnO)}`)}>
                <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"} />
                </svg>
                {"Export"}
              </button>
            </>) : null}
          </div>
          <section className={"a-in"} {...S(`display: flex; flex-direction: column; min-width: 0; margin-bottom: ${I($s0?.cardPad)}; ${I($s0?.k?.card)}`)}>
            {$s0?.showData ? (<>
              <div {...S(`display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: ${I($s0?.barPad)}`)}>
                {$s0?.deskBar ? (<>
                  <div role={"tablist"} aria-label={"Deal views"} {...S(`max-width: 100%; overflow-x: auto; ${I($s0?.k?.tabs)}`)}>
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
                  <div {...S("flex: 1 1 0px")} />
                </>) : null}
                {$s0?.cmp ? (<>
                  <div {...S("flex: 1 1 100%; min-width: 0; display: flex")}>
                    <div role={"tablist"} aria-label={"Deal views"} {...S(`max-width: 100%; overflow-x: auto; scrollbar-width: none; ${I($s0?.k?.tabs)}`)}>
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
                  </div>
                </>) : null}
                {$s0?.mob ? (<>
                  <button type={"button"} className={"tb tg"} onClick={$s0?.toggleView} aria-haspopup={"dialog"} aria-expanded={$s0?.viewOpen} aria-label={`Show ${I($s0?.viewLabel)} deals, change view`} {...S(`--hv: ${I($s0?.t?.fillHover)}; flex: 1 1 0px; min-width: 0; display: flex; align-items: center; gap: 8px; height: 36px; padding: 0 12px; box-sizing: border-box; border: none; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.fill)}; color: ${I($s0?.t?.fg)}; font: inherit; font-size: 14px; font-weight: 500; text-align: left; cursor: pointer${I($s0?.tbOff)}`)}>
                    <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 15px; color: ${I($s0?.t?.mutedFg)}`)}>
                      <path d={"M3 6h18M7 12h10M10 18h4"} />
                    </svg>
                    <span {...S("min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                      {T($s0?.viewLabel)}
                    </span>
                    <span {...S(`color: ${I($s0?.t?.mutedFg)}; font-variant-numeric: tabular-nums`)}>
                      {T($s0?.viewCount)}
                    </span>
                    <span {...S("flex: 1 1 auto")} />
                    <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 15px; color: ${I($s0?.t?.mutedFg)}`)}>
                      <path d={"m6 9 6 6 6-6"} />
                    </svg>
                  </button>
                </>) : null}
                <label className={"ti"} {...S(`flex: 1 1 180px; max-width: ${I($s0?.filterMax)}; display: flex; align-items: center; gap: 8px; height: ${I($s0?.searchH)}; padding: 0 14px; box-sizing: border-box; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.fill)}; color: ${I($s0?.t?.mutedFg)}${I($s0?.searchMin)}${I($s0?.tbOff)}${I($s0?.searchOrd)}`)}>
                  <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 15px")}>
                    <circle cx={"11"} cy={"11"} r={"8"} />
                    <path d={"m21 21-4.3-4.3"} />
                  </svg>
                  <input type={"search"} aria-label={"Filter brands"} placeholder={"Filter brands"} value={V0($s0?.q, "")} onChange={$s0?.setQ} {...S(`flex: 1 1 auto; min-width: 0; height: 32px; border: none; outline: none; background: transparent; font: inherit; font-size: 14px; color: ${I($s0?.t?.fg)}; padding: 0`)} />
                </label>
                <div {...S(`position: relative${I($s0?.tbOff)}`)}>
                  <button className={"tb tg"} type={"button"} onClick={$s0?.toggleFacet} aria-haspopup={"dialog"} aria-expanded={$s0?.facetOpen} aria-label={"Filter by payment"} {...S(`border-style: dashed; ${I($s0?.k?.btnO)}${I($s0?.ctlH)}`)}>
                    <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <circle cx={"12"} cy={"12"} r={"10"} />
                      <path d={"M8 12h8M12 8v8"} />
                    </svg>
                    {$s0?.notMob ? (<>
                      <span>
                        {"Payment"}
                      </span>
                    </>) : null}
                    {$s0?.hasFacet ? (<>
                      <span {...S(`width: 1px; height: 14px; margin: 0 2px; background: ${I($s0?.t?.border)}`)} />
                      {A($s0?.facetChips).map((it, i) => {
                        const $s1 = { ...$s0, "fc": it, $index: i };
                        return (<React.Fragment key={i}>
                          <span className={"a-pop"} {...S(`display: inline-flex; align-items: center; height: 20px; padding: 0 7px; border-radius: ${I($s1?.t?.rCtl)}; background: ${I($s1?.t?.fill)}; color: ${I($s1?.t?.fg)}; font-size: 12px; font-weight: 500`)}>
                            {T($s1?.fc)}
                          </span>
                        </React.Fragment>);
                      })}
                    </>) : null}
                  </button>
                  {$s0?.facetPop ? (<>
                    <div onClick={$s0?.toggleFacet} {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 29")} />
                    <div role={"dialog"} aria-label={"Filter by payment"} className={"a-drop"} {...S(`position: absolute; top: 40px; right: 0; width: 230px; z-index: 30; ${I($s0?.k?.pop)}`)}>
                      <div {...S(`padding: 6px 10px 8px; font-size: 12px; font-weight: 500; color: ${I($s0?.t?.mutedFg)}`)}>
                        {"Payment status"}
                      </div>
                      {A($s0?.facetOpts).map((it, i) => {
                        const $s1 = { ...$s0, "o": it, $index: i };
                        return (<React.Fragment key={i}>
                          <button className={"tb tg"} type={"button"} role={"menuitemcheckbox"} aria-checked={$s1?.o?.on} onClick={$s1?.o?.pick} {...S($s1?.k?.item)}>
                            <span {...S($s1?.o?.box)}>
                              <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`visibility: ${I($s1?.o?.check)}`)}>
                                <path d={"M20 6 9 17l-5-5"} />
                              </svg>
                            </span>
                            <span {...S("flex: 1 1 auto")}>
                              {T($s1?.o?.label)}
                            </span>
                            <span {...S(`font-size: 12px; color: ${I($s1?.t?.mutedFg)}; font-variant-numeric: tabular-nums`)}>
                              {T($s1?.o?.count)}
                            </span>
                          </button>
                        </React.Fragment>);
                      })}
                      {$s0?.hasFacet ? (<>
                        <div {...S(`height: 1px; margin: 6px -6px; background: ${I($s0?.t?.line)}`)} />
                        <button className={"tb tg"} type={"button"} onClick={$s0?.clearFacet} {...S(`justify-content: center; ${I($s0?.k?.item)}`)}>
                          {"Clear filter"}
                        </button>
                      </>) : null}
                    </div>
                  </>) : null}
                </div>
                {$s0?.mob ? (<>
                  <button className={"tb tg"} type={"button"} onClick={$s0?.toggleCols} aria-haspopup={"dialog"} aria-expanded={$s0?.colsOpen} aria-label={"Choose card details"} {...S(`${I($s0?.k?.btnO)}${I($s0?.tbOff)}; width: 36px; height: 36px; padding: 0`)}>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M12 3v18M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"} />
                    </svg>
                  </button>
                </>) : null}
                {$s0?.notMob ? (<>
                  <div {...S(`position: relative${I($s0?.tbOff)}`)}>
                    <button className={"tb tg"} type={"button"} onClick={$s0?.toggleCols} aria-haspopup={"menu"} aria-expanded={$s0?.colsOpen} {...S($s0?.k?.btnO)}>
                      <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M12 3v18M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"} />
                      </svg>
                      {"Columns"}
                      <span {...S(`display: inline-flex; align-items: center; height: 18px; padding: 0 6px; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.fill)}; color: ${I($s0?.t?.mutedFg)}; font-size: 11px; font-variant-numeric: tabular-nums`)}>
                        {T($s0?.colCount)}
                      </span>
                      <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`transform: ${I($s0?.colsRot)}; transition: transform 0.2s ease`)}>
                        <path d={"m6 9 6 6 6-6"} />
                      </svg>
                    </button>
                    {$s0?.colsOpen ? (<>
                      <div onClick={$s0?.toggleCols} {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 29")} />
                      <div role={"menu"} aria-label={"Show columns"} className={"a-drop"} {...S(`position: absolute; top: 40px; right: 0; width: 240px; z-index: 30; ${I($s0?.k?.pop)}`)}>
                        {A($s0?.colGroups).map((it, i) => {
                          const $s1 = { ...$s0, "cg": it, $index: i };
                          return (<React.Fragment key={i}>
                            <div {...S(`padding: 8px 10px 4px; font-size: 12px; font-weight: 500; color: ${I($s1?.t?.mutedFg)}`)}>
                              {T($s1?.cg?.label)}
                            </div>
                            {A($s1?.cg?.items).map((it, i) => {
                              const $s2 = { ...$s1, "o": it, $index: i };
                              return (<React.Fragment key={i}>
                                <button className={"tb tg"} type={"button"} role={"menuitemcheckbox"} aria-checked={$s2?.o?.on} onClick={$s2?.o?.pick} {...S($s2?.k?.item)}>
                                  <span {...S($s2?.o?.box)}>
                                    <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`visibility: ${I($s2?.o?.check)}`)}>
                                      <path d={"M20 6 9 17l-5-5"} />
                                    </svg>
                                  </span>
                                  <span {...S("flex: 1 1 auto")}>
                                    {T($s2?.o?.label)}
                                  </span>
                                </button>
                              </React.Fragment>);
                            })}
                          </React.Fragment>);
                        })}
                        <div {...S(`height: 1px; margin: 6px -6px; background: ${I($s0?.t?.line)}`)} />
                        <button className={"tb tg"} type={"button"} onClick={$s0?.resetCols} {...S(`justify-content: center; color: ${I($s0?.t?.mutedFg)}; ${I($s0?.k?.item)}`)}>
                          {"Reset to default"}
                        </button>
                      </div>
                    </>) : null}
                  </div>
                </>) : null}
              </div>
              {$s0?.showTable ? (<>
                <div {...S("overflow-x: auto; padding: 0 12px")}>
                  <div {...S(`min-width: ${I($s0?.tableMin)}`)}>
                    <div {...S(`display: grid; grid-template-columns: ${I($s0?.cols)}; align-items: center; height: 40px; padding: 0 4px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.tile)}; color: ${I($s0?.t?.mutedFg)}; font-size: 13px; font-weight: 500`)}>
                      <span {...S("display: flex; padding: 0 8px")}>
                        <button className={"tb"} type={"button"} role={"checkbox"} aria-checked={$s0?.allSel} aria-label={"Select all on this page"} onClick={$s0?.toggleAll} {...S($s0?.allBox)}>
                          <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`visibility: ${I($s0?.allCheck)}`)}>
                            <path d={$s0?.allIcon} />
                          </svg>
                        </button>
                      </span>
                      <button type={"button"} className={"tb tt"} onClick={$s0?.sortBrand} {...S("justify-self: start; display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 8px; border: none; background: transparent; color: inherit; font: inherit; cursor: pointer")}>
                        {"Brand"}
                        <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={$s0?.brandSortIcon} />
                        </svg>
                      </button>
                      {$s0?.vis?.status ? (<>
                        <span {...S("padding: 0 8px")}>
                          {"Status"}
                        </span>
                      </>) : null}
                      {$s0?.vis?.pay ? (<>
                        <span {...S("padding: 0 8px")}>
                          {"Payment"}
                        </span>
                      </>) : null}
                      {$s0?.vis?.payby ? (<>
                        <span {...S("padding: 0 8px")}>
                          {"Pay by"}
                        </span>
                      </>) : null}
                      {$s0?.vis?.how ? (<>
                        <span {...S("padding: 0 8px; white-space: nowrap")}>
                          {"How you get paid"}
                        </span>
                      </>) : null}
                      {$s0?.vis?.invoice ? (<>
                        <span {...S("padding: 0 8px")}>
                          {"Invoice"}
                        </span>
                      </>) : null}
                      {$s0?.vis?.post ? (<>
                        <span {...S("padding: 0 8px")}>
                          {"Post date"}
                        </span>
                      </>) : null}
                      {$s0?.vis?.plats ? (<>
                        <span {...S("padding: 0 8px")}>
                          {"Platforms"}
                        </span>
                      </>) : null}
                      {$s0?.vis?.type ? (<>
                        <span {...S("padding: 0 8px")}>
                          {"Post type"}
                        </span>
                      </>) : null}
                      {$s0?.vis?.rep ? (<>
                        <span {...S("padding: 0 8px")}>
                          {"Rep"}
                        </span>
                      </>) : null}
                      {$s0?.vis?.created ? (<>
                        <span {...S("padding: 0 8px")}>
                          {"Added"}
                        </span>
                      </>) : null}
                      <button type={"button"} className={"tb tt"} onClick={$s0?.sortAmt} {...S("justify-self: end; display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 8px; border: none; background: transparent; color: inherit; font: inherit; cursor: pointer")}>
                        {"Amount"}
                        <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={$s0?.amtSortIcon} />
                        </svg>
                      </button>
                      <span />
                    </div>
                    {A($s0?.rows).map((it, i) => {
                      const $s1 = { ...$s0, "r": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div className={"tr a-in"} onClick={$s1?.r?.open} {...S(`animation-delay: ${I($s1?.r?.delay)}; --hvr: ${I($s1?.r?.hvr)}; display: grid; grid-template-columns: ${I($s1?.cols)}; align-items: center; height: 56px; padding: 0 4px; border-bottom: ${I($s1?.r?.line)}; border-radius: ${I($s1?.t?.rTile)}; background: ${I($s1?.r?.bg)}; cursor: pointer`)}>
                          <span {...S("display: flex; padding: 0 8px")}>
                            <button className={"tb"} type={"button"} role={"checkbox"} aria-checked={$s1?.r?.sel} aria-label={$s1?.r?.selLabel} onClick={$s1?.r?.toggle} {...S($s1?.r?.box)}>
                              <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`visibility: ${I($s1?.r?.check)}`)}>
                                <path d={"M20 6 9 17l-5-5"} />
                              </svg>
                            </button>
                          </span>
                          <span {...S("display: flex; align-items: center; gap: 10px; min-width: 0; padding: 0 8px")}>
                            <span {...S(`width: 30px; height: 30px; flex: 0 0 30px; border-radius: ${I($s1?.t?.rCtl)}; background: ${I($s1?.r?.avBg)}; color: ${I($s1?.r?.avFg)}; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600`)}>
                              {T($s1?.r?.l)}
                            </span>
                            {$s1?.notCmp ? (<>
                              <span {...S(`min-width: 0; font-weight: 500; color: ${I($s1?.t?.fg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                                {T($s1?.r?.brand)}
                              </span>
                              {$s1?.r?.isNew ? (<>
                                <span className={"a-pop"} {...S(`display: inline-flex; align-items: center; height: 20px; padding: 0 7px; border-radius: ${I($s1?.t?.rCtl)}; background: ${I($s1?.t?.soft)}; color: ${I($s1?.t?.softFg)}; font-size: 11px; font-weight: 600; flex: 0 0 auto`)}>
                                  {"New"}
                                </span>
                              </>) : null}
                            </>) : null}
                            {$s1?.cmp ? (<>
                              <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                                <span {...S("display: flex; align-items: center; gap: 8px; min-width: 0")}>
                                  <span {...S(`min-width: 0; font-weight: 500; color: ${I($s1?.t?.fg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                                    {T($s1?.r?.brand)}
                                  </span>
                                  {$s1?.r?.isNew ? (<>
                                    <span className={"a-pop"} {...S(`display: inline-flex; align-items: center; height: 20px; padding: 0 7px; border-radius: ${I($s1?.t?.rCtl)}; background: ${I($s1?.t?.soft)}; color: ${I($s1?.t?.softFg)}; font-size: 11px; font-weight: 600; flex: 0 0 auto`)}>
                                      {"New"}
                                    </span>
                                  </>) : null}
                                </span>
                                <span {...S(`display: flex; align-items: center; gap: 6px; min-width: 0; font-size: 13px; color: ${I($s1?.t?.mutedFg)}`)}>
                                  <span {...S(`width: 6px; height: 6px; flex: 0 0 6px; border-radius: 3px; background: ${I($s1?.r?.stDot)}`)} />
                                  <span {...S("min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                                    {T($s1?.r?.cmpSub)}
                                  </span>
                                </span>
                              </span>
                            </>) : null}
                          </span>
                          {$s1?.vis?.status ? (<>
                            <span {...S("display: flex; padding: 0 8px")}>
                              <span {...S(`color: ${I($s1?.t?.fg)}; ${I($s1?.k?.payBadge)}`)}>
                                <span {...S(`width: 7px; height: 7px; flex: 0 0 7px; margin: 0 1px 0 3px; border-radius: 4px; background: ${I($s1?.r?.stDot)}`)} />
                                {T($s1?.r?.status)}
                              </span>
                            </span>
                          </>) : null}
                          {$s1?.vis?.pay ? (<>
                            <span {...S("display: flex; padding: 0 8px")}>
                              <span {...S(`color: ${I($s1?.r?.pay?.fg)}; ${I($s1?.k?.payBadge)}`)}>
                                <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("display: block; flex: 0 0 14px")}>
                                  <circle cx={"12"} cy={"12"} r={"9.5"} fill={$s1?.r?.pay?.fill} stroke={$s1?.r?.pay?.stroke} strokeDasharray={$s1?.r?.pay?.dash} />
                                  <path d={$s1?.r?.pay?.inner} stroke={$s1?.r?.pay?.innerStroke} />
                                </svg>
                                {T($s1?.r?.pay?.label)}
                              </span>
                            </span>
                          </>) : null}
                          {$s1?.vis?.payby ? (<>
                            <span {...S("display: flex; padding: 0 8px")}>
                              {$s1?.r?.hasPayBy ? (<>
                                <span {...S(`white-space: nowrap; font-variant-numeric: tabular-nums; color: ${I($s1?.r?.payByFg)}; font-weight: ${I($s1?.r?.payByFw)}`)}>
                                  {T($s1?.r?.payBy)}
                                </span>
                              </>) : null}
                              {$s1?.r?.addDate ? (<>
                                <button type={"button"} className={"tb tg"} onClick={$s1?.r?.openDue} {...S(`--hv: ${I($s1?.t?.fill)}; display: inline-flex; align-items: center; gap: 4px; height: 26px; padding: 0 10px; box-sizing: border-box; border: 1px dashed ${I($s1?.t?.borderStrong)}; border-radius: ${I($s1?.t?.rCtl)}; background: transparent; color: ${I($s1?.t?.mutedFg)}; font: inherit; font-size: 12px; font-weight: 500; white-space: nowrap; cursor: pointer`)}>
                                  <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                                    <path d={"M5 12h14M12 5v14"} />
                                  </svg>
                                  {"Add date"}
                                </button>
                              </>) : null}
                              {$s1?.r?.noDate ? (<>
                                <span {...S(`color: ${I($s1?.t?.mutedFg)}`)}>
                                  {"None"}
                                </span>
                              </>) : null}
                            </span>
                          </>) : null}
                          {$s1?.vis?.how ? (<>
                            <span {...S("padding: 0 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                              {T($s1?.r?.how)}
                            </span>
                          </>) : null}
                          {$s1?.vis?.invoice ? (<>
                            <span {...S(`padding: 0 8px; white-space: nowrap; color: ${I($s1?.r?.invFg)}`)}>
                              {T($s1?.r?.invoice)}
                            </span>
                          </>) : null}
                          {$s1?.vis?.post ? (<>
                            <span {...S(`padding: 0 8px; white-space: nowrap; font-variant-numeric: tabular-nums; color: ${I($s1?.r?.postFg)}`)}>
                              {T($s1?.r?.post)}
                            </span>
                          </>) : null}
                          {$s1?.vis?.plats ? (<>
                            <span {...S("display: flex; gap: 4px; padding: 0 8px; min-width: 0; overflow: hidden")}>
                              {A($s1?.r?.plats).map((it, i) => {
                                const $s2 = { ...$s1, "pl": it, $index: i };
                                return (<React.Fragment key={i}>
                                  <span {...S(`display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: ${I($s2?.pl?.pad)}; box-sizing: border-box; border-radius: ${I($s2?.t?.rCtl)}; background: ${I($s2?.t?.fill)}; font-size: 12px; font-weight: 500; white-space: nowrap`)}>
                                    {$s2?.pl?.hasIcon ? (<>
                                      <img src={$s2?.pl?.icon} alt={""} width={"16"} height={"16"} {...S("display: block; width: 16px; height: 16px; flex: 0 0 16px; border-radius: 4px")} />
                                    </>) : null}
                                    {T($s2?.pl?.label)}
                                  </span>
                                </React.Fragment>);
                              })}
                            </span>
                          </>) : null}
                          {$s1?.vis?.type ? (<>
                            <span {...S("padding: 0 8px; white-space: nowrap")}>
                              {T($s1?.r?.type)}
                            </span>
                          </>) : null}
                          {$s1?.vis?.rep ? (<>
                            <span {...S(`padding: 0 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: ${I($s1?.r?.repFg)}`)}>
                              {T($s1?.r?.rep)}
                            </span>
                          </>) : null}
                          {$s1?.vis?.created ? (<>
                            <span {...S(`padding: 0 8px; white-space: nowrap; color: ${I($s1?.t?.mutedFg)}; font-variant-numeric: tabular-nums`)}>
                              {T($s1?.r?.created)}
                            </span>
                          </>) : null}
                          <span {...S("padding: 0 8px; text-align: right; font-weight: 500; white-space: nowrap; font-variant-numeric: tabular-nums")}>
                            {T($s1?.r?.amount)}
                          </span>
                          <span {...S("display: flex; justify-content: flex-end")}>
                            <button className={"tb tg"} type={"button"} onClick={$s1?.r?.menu} aria-label={$s1?.r?.menuLabel} aria-haspopup={"menu"} {...S(`background: ${I($s1?.r?.menuBg)}; --hv: ${I($s1?.t?.fill)}; ${I($s1?.k?.icoS)}`)}>
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
                    {$s0?.isLoading ? (<>
                      {A($s0?.skRows).map((it, i) => {
                        const $s1 = { ...$s0, "x": it, $index: i };
                        return (<React.Fragment key={i}>
                          <div {...S(`display: grid; grid-template-columns: ${I($s1?.cols)}; align-items: center; height: 56px; padding: 0 4px; border-bottom: ${I($s1?.x?.line)}`)}>
                            <span {...S("display: flex; padding: 0 8px")}>
                              <span className={"a-pulse"} {...S($s1?.skChk)} />
                            </span>
                            <span {...S("display: flex; align-items: center; gap: 10px; min-width: 0; padding: 0 8px")}>
                              <span className={"a-pulse"} {...S($s1?.skAv)} />
                              <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 7px")}>
                                <span className={"a-pulse"} {...S($s1?.x?.brand)} />
                                {$s1?.cmp ? (<>
                                  <span className={"a-pulse"} {...S($s1?.x?.sub)} />
                                </>) : null}
                              </span>
                            </span>
                            {$s1?.vis?.status ? (<>
                              <span {...S("display: flex; padding: 0 8px")}>
                                <span className={"a-pulse"} {...S($s1?.x?.status)} />
                              </span>
                            </>) : null}
                            {$s1?.vis?.pay ? (<>
                              <span {...S("display: flex; padding: 0 8px")}>
                                <span className={"a-pulse"} {...S($s1?.x?.pay)} />
                              </span>
                            </>) : null}
                            {$s1?.vis?.payby ? (<>
                              <span {...S("display: flex; padding: 0 8px")}>
                                <span className={"a-pulse"} {...S($s1?.x?.date)} />
                              </span>
                            </>) : null}
                            {$s1?.vis?.how ? (<>
                              <span {...S("display: flex; padding: 0 8px")}>
                                <span className={"a-pulse"} {...S($s1?.x?.gen)} />
                              </span>
                            </>) : null}
                            {$s1?.vis?.invoice ? (<>
                              <span {...S("display: flex; padding: 0 8px")}>
                                <span className={"a-pulse"} {...S($s1?.x?.gen)} />
                              </span>
                            </>) : null}
                            {$s1?.vis?.post ? (<>
                              <span {...S("display: flex; padding: 0 8px")}>
                                <span className={"a-pulse"} {...S($s1?.x?.date)} />
                              </span>
                            </>) : null}
                            {$s1?.vis?.plats ? (<>
                              <span {...S("display: flex; padding: 0 8px")}>
                                <span className={"a-pulse"} {...S($s1?.x?.gen)} />
                              </span>
                            </>) : null}
                            {$s1?.vis?.type ? (<>
                              <span {...S("display: flex; padding: 0 8px")}>
                                <span className={"a-pulse"} {...S($s1?.x?.gen)} />
                              </span>
                            </>) : null}
                            {$s1?.vis?.rep ? (<>
                              <span {...S("display: flex; padding: 0 8px")}>
                                <span className={"a-pulse"} {...S($s1?.x?.gen)} />
                              </span>
                            </>) : null}
                            {$s1?.vis?.created ? (<>
                              <span {...S("display: flex; padding: 0 8px")}>
                                <span className={"a-pulse"} {...S($s1?.x?.date)} />
                              </span>
                            </>) : null}
                            <span {...S("display: flex; justify-content: flex-end; padding: 0 8px")}>
                              <span className={"a-pulse"} {...S($s1?.x?.amt)} />
                            </span>
                            <span />
                          </div>
                        </React.Fragment>);
                      })}
                    </>) : null}
                  </div>
                </div>
              </>) : null}
              {$s0?.showCards ? (<>
                <div {...S("display: flex; flex-direction: column; padding: 0 6px")}>
                  {A($s0?.rows).map((it, i) => {
                    const $s1 = { ...$s0, "r": it, $index: i };
                    return (<React.Fragment key={i}>
                      <button type={"button"} className={"tb tr a-in"} onClick={$s1?.r?.tap} role={$s1?.r?.cardRole} aria-checked={$s1?.r?.cardChecked} {...S(`animation-delay: ${I($s1?.r?.delay)}; --hvr: ${I($s1?.r?.hvr)}; display: flex; align-items: center; gap: 12px; width: 100%; min-height: 68px; padding: 10px 8px; box-sizing: border-box; border: none; border-bottom: ${I($s1?.r?.line)}; border-radius: ${I($s1?.t?.rTile)}; background: ${I($s1?.r?.bg)}; color: ${I($s1?.t?.fg)}; font: inherit; text-align: left; cursor: pointer`)}>
                        {$s1?.selMode ? (<>
                          <span {...S("width: 36px; height: 36px; flex: 0 0 36px; display: inline-flex; align-items: center; justify-content: center")}>
                            <span {...S($s1?.r?.boxL)}>
                              <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`visibility: ${I($s1?.r?.check)}`)}>
                                <path d={"M20 6 9 17l-5-5"} />
                              </svg>
                            </span>
                          </span>
                        </>) : null}
                        {$s1?.notSelMode ? (<>
                          <span {...S(`width: 36px; height: 36px; flex: 0 0 36px; border-radius: ${I($s1?.t?.rCtl)}; background: ${I($s1?.r?.avBg)}; color: ${I($s1?.r?.avFg)}; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600`)}>
                            {T($s1?.r?.l)}
                          </span>
                        </>) : null}
                        <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 5px")}>
                          <span {...S("display: flex; align-items: center; gap: 8px; min-width: 0")}>
                            <span {...S("min-width: 0; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                              {T($s1?.r?.brand)}
                            </span>
                            {$s1?.r?.isNew ? (<>
                              <span className={"a-pop"} {...S(`display: inline-flex; align-items: center; height: 20px; padding: 0 7px; border-radius: ${I($s1?.t?.rCtl)}; background: ${I($s1?.t?.soft)}; color: ${I($s1?.t?.softFg)}; font-size: 11px; font-weight: 600; flex: 0 0 auto`)}>
                                {"New"}
                              </span>
                            </>) : null}
                          </span>
                          {$s1?.hasLine2 ? (<>
                            <span {...S("display: flex; align-items: center; gap: 8px; min-width: 0")}>
                              {$s1?.vis?.cardPay ? (<>
                                <span {...S(`color: ${I($s1?.r?.pay?.fg)}; ${I($s1?.k?.payBadge)}`)}>
                                  <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("display: block; flex: 0 0 14px")}>
                                    <circle cx={"12"} cy={"12"} r={"9.5"} fill={$s1?.r?.pay?.fill} stroke={$s1?.r?.pay?.stroke} strokeDasharray={$s1?.r?.pay?.dash} />
                                    <path d={$s1?.r?.pay?.inner} stroke={$s1?.r?.pay?.innerStroke} />
                                  </svg>
                                  {T($s1?.r?.pay?.label)}
                                </span>
                              </>) : null}
                              {$s1?.vis?.cardDate ? (<>
                                <span {...S(`min-width: 0; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: ${I($s1?.r?.mobDateFg)}`)}>
                                  {T($s1?.r?.mobDate)}
                                </span>
                              </>) : null}
                            </span>
                          </>) : null}
                          <span {...S(`min-width: 0; font-size: 13px; color: ${I($s1?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                            {T($s1?.r?.meta)}
                          </span>
                        </span>
                        <span {...S("font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums")}>
                          {T($s1?.r?.amount)}
                        </span>
                      </button>
                    </React.Fragment>);
                  })}
                  {$s0?.isLoading ? (<>
                    {A($s0?.skCards).map((it, i) => {
                      const $s1 = { ...$s0, "x": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div {...S(`display: flex; align-items: center; gap: 12px; min-height: 68px; padding: 12px 8px; box-sizing: border-box; border-bottom: ${I($s1?.x?.line)}`)}>
                          <span className={"a-pulse"} {...S($s1?.x?.av)} />
                          <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 8px")}>
                            <span className={"a-pulse"} {...S($s1?.x?.brand)} />
                            <span {...S("display: flex; align-items: center; gap: 8px")}>
                              <span className={"a-pulse"} {...S($s1?.x?.badge)} />
                              <span className={"a-pulse"} {...S($s1?.x?.date)} />
                            </span>
                            <span className={"a-pulse"} {...S($s1?.x?.meta)} />
                          </span>
                          <span className={"a-pulse"} {...S($s1?.x?.amt)} />
                        </div>
                      </React.Fragment>);
                    })}
                  </>) : null}
                </div>
              </>) : null}
              {$s0?.noRes ? (<>
                <div className={"a-fade"} {...S("display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 56px 24px; box-sizing: border-box; text-align: center")}>
                  <span {...S(`display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.noResBlk?.tileBg)}; color: ${I($s0?.noResBlk?.tileFg)}`)}>
                    <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={$s0?.noResBlk?.icon} />
                    </svg>
                  </span>
                  <div {...S("display: flex; flex-direction: column; align-items: center; gap: 4px; max-width: 380px")}>
                    <span {...S("font-size: 15px; font-weight: 600")}>
                      {T($s0?.noResBlk?.title)}
                    </span>
                    {$s0?.noResBlk?.hasSub ? (<>
                      <span {...S(`font-size: 13px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}`)}>
                        {T($s0?.noResBlk?.sub)}
                      </span>
                    </>) : null}
                  </div>
                  {$s0?.noResBlk?.hasCta ? (<>
                    <div {...S("display: flex; flex-wrap: wrap; justify-content: center; gap: 8px")}>
                      <button type={"button"} className={"tb tp"} onClick={$s0?.noResBlk?.act} {...S(`${I($s0?.k?.pSm)}; height: ${I($s0?.stH)}; flex-shrink: 0`)}>
                        {T($s0?.noResBlk?.cta)}
                      </button>
                      {$s0?.noResBlk?.has2 ? (<>
                        <button type={"button"} className={"tb tg"} onClick={$s0?.noResBlk?.act2} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.oSm)}; height: ${I($s0?.stH)}`)}>
                          {T($s0?.noResBlk?.cta2)}
                        </button>
                      </>) : null}
                    </div>
                  </>) : null}
                </div>
              </>) : null}
              {$s0?.noDeals ? (<>
                <div className={"a-fade"} {...S(`display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: ${I($s0?.emptyPad)}; box-sizing: border-box; text-align: center`)}>
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
              {$s0?.showFoot ? (<>
                <div {...S("display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; padding: 14px 18px 16px")}>
                  {$s0?.notMob ? (<>
                    {$s0?.notLoading ? (<>
                      <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                        {T($s0?.selLabel)}
                      </span>
                    </>) : null}
                    {$s0?.isLoading ? (<>
                      <span className={"a-pulse"} {...S($s0?.skSel)} />
                    </>) : null}
                  </>) : null}
                  <div {...S("display: flex; align-items: center; gap: 20px; flex-wrap: wrap; margin-left: auto")}>
                    {$s0?.notMob ? (<>
                      <div {...S("position: relative; display: flex; align-items: center; gap: 8px")}>
                        <span {...S("font-weight: 500; white-space: nowrap")}>
                          {"Rows per page"}
                        </span>
                        <button className={"tb tg"} type={"button"} onClick={$s0?.togglePer} aria-haspopup={"listbox"} aria-expanded={$s0?.perOpen} {...S(`width: 72px; justify-content: space-between; padding: 0 10px 0 14px; ${I($s0?.k?.btnS)}`)}>
                          {T($s0?.perPage)}
                          <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={"m6 9 6 6 6-6"} />
                          </svg>
                        </button>
                        {$s0?.perOpen ? (<>
                          <div role={"listbox"} aria-label={"Rows per page"} className={"a-drop"} {...S(`position: absolute; bottom: 40px; right: 0; width: 80px; z-index: 30; ${I($s0?.k?.pop)}`)}>
                            {A($s0?.perOpts).map((it, i) => {
                              const $s1 = { ...$s0, "o": it, $index: i };
                              return (<React.Fragment key={i}>
                                <button className={"tb tg"} type={"button"} role={"option"} aria-selected={$s1?.o?.on} onClick={$s1?.o?.pick} {...S(`font-weight: ${I($s1?.o?.fw)}; ${I($s1?.k?.item)}`)}>
                                  {T($s1?.o?.label)}
                                </button>
                              </React.Fragment>);
                            })}
                          </div>
                        </>) : null}
                      </div>
                    </>) : null}
                    {$s0?.notLoading ? (<>
                      <span {...S("font-weight: 500; white-space: nowrap; font-variant-numeric: tabular-nums")}>
                        {T($s0?.pageLabel)}
                      </span>
                    </>) : null}
                    {$s0?.isLoading ? (<>
                      <span className={"a-pulse"} {...S($s0?.skPage)} />
                    </>) : null}
                    <div {...S("display: flex; gap: 6px")}>
                      <button className={"tb tg"} type={"button"} onClick={$s0?.prevPage} aria-label={"Previous page"} aria-disabled={$s0?.atStart} {...S(`opacity: ${I($s0?.prevOp)}; ${I($s0?.k?.icoO)}`)}>
                        <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"m15 18-6-6 6-6"} />
                        </svg>
                      </button>
                      <button className={"tb tg"} type={"button"} onClick={$s0?.nextPage} aria-label={"Next page"} aria-disabled={$s0?.atEnd} {...S(`opacity: ${I($s0?.nextOp)}; ${I($s0?.k?.icoO)}`)}>
                        <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"m9 18 6-6-6-6"} />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </>) : null}
            </>) : null}
            {$s0?.isError ? (<>
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
            </>) : null}
          </section>
        </main>
        {$s0?.rowMenuOpen ? (<>
          <div onClick={$s0?.closeRowMenu} {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 55")} />
          <div role={"menu"} aria-label={"Deal actions"} className={"a-drop"} {...S(`position: fixed; top: ${I($s0?.rowMenuTop)}; left: ${I($s0?.rowMenuLeft)}; width: 196px; z-index: 56; ${I($s0?.k?.pop)}`)}>
            <button className={"tb tg"} type={"button"} role={"menuitem"} onClick={$s0?.rm?.open} {...S($s0?.k?.item)}>
              {"Open deal"}
            </button>
            {$s0?.rm?.unpaid ? (<>
              <button className={"tb tg"} type={"button"} role={"menuitem"} onClick={$s0?.rm?.paid} {...S($s0?.k?.item)}>
                {"Mark as paid"}
              </button>
            </>) : null}
            <button className={"tb tg"} type={"button"} role={"menuitem"} onClick={$s0?.rm?.dup} {...S($s0?.k?.item)}>
              {"Duplicate"}
            </button>
            <div {...S(`height: 1px; margin: 6px -6px; background: ${I($s0?.t?.line)}`)} />
            <button className={"tb tg"} type={"button"} role={"menuitem"} onClick={$s0?.rm?.archive} {...S($s0?.k?.item)}>
              {"Archive"}
            </button>
            <button className={"tb tg"} type={"button"} role={"menuitem"} onClick={$s0?.rm?.del} {...S(`${I($s0?.k?.item)}; color: ${I($s0?.t?.destr)};`)}>
              {"Delete"}
            </button>
          </div>
        </>) : null}
        {$s0?.bulk ? (<>
          <div role={"toolbar"} aria-label={"Selected deals"} {...S("position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); z-index: 40")}>
            <div className={"a-toast"} {...S(`display: flex; align-items: center; gap: 4px; padding: 6px 6px 6px 16px; background: ${I($s0?.t?.card)}; border: 1px solid ${I($s0?.t?.border)}; border-radius: ${I($s0?.t?.rCtl)}; box-shadow: ${I($s0?.t?.shPop)}`)}>
              <span {...S("font-weight: 500; white-space: nowrap; font-variant-numeric: tabular-nums")}>
                {T($s0?.bulkLabel)}
              </span>
              <span {...S(`width: 1px; height: 18px; margin: 0 8px; background: ${I($s0?.t?.border)}`)} />
              <button className={"tb tg"} type={"button"} onClick={$s0?.bulkInvoiced} {...S($s0?.k?.btnG)}>
                {"Mark as invoiced"}
              </button>
              <button className={"tb tg"} type={"button"} onClick={$s0?.bulkPaid} {...S($s0?.k?.btnG)}>
                {"Mark as paid"}
              </button>
              <button className={"tb tg"} type={"button"} onClick={$s0?.bulkArchive} {...S($s0?.k?.btnG)}>
                {"Archive"}
              </button>
              <button className={"tb tg"} type={"button"} onClick={$s0?.clearSel} aria-label={"Clear selection"} {...S($s0?.k?.icoSec)}>
                <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M18 6 6 18M6 6l12 12"} />
                </svg>
              </button>
            </div>
          </div>
        </>) : null}
        {$s0?.mobBulk ? (<>
          <div role={"toolbar"} aria-label={"Selected deals"} className={"a-up"} {...S(`position: fixed; left: 12px; right: 12px; bottom: 12px; z-index: 40; display: flex; flex-direction: column; gap: 10px; padding: 10px 12px 12px; box-sizing: border-box; background: ${I($s0?.t?.card)}; color: ${I($s0?.t?.fg)}; border: 1px solid ${I($s0?.t?.border)}; border-radius: ${I($s0?.t?.rCard)}; box-shadow: ${I($s0?.t?.shPop)}`)}>
            <div {...S("display: flex; align-items: center; gap: 8px; min-height: 36px")}>
              <span {...S("flex: 1 1 auto; min-width: 0; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-variant-numeric: tabular-nums")}>
                {T($s0?.mobBulkLabel)}
              </span>
              <button className={"tb tg"} type={"button"} onClick={$s0?.toggleAll} {...S(`--hv: ${I($s0?.t?.fill)}; ${I($s0?.k?.gSm)}; height: 36px`)}>
                {T($s0?.selAllLabel)}
              </button>
            </div>
            <div {...S("display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px")}>
              <button className={"tb tg"} type={"button"} onClick={$s0?.bulkInvoiced} aria-disabled={$s0?.noSel} {...S(`opacity: ${I($s0?.bulkOp)}; ${I($s0?.k?.sSm)}; height: 36px; padding: 0 8px; min-width: 0`)}>
                <span {...S("min-width: 0; overflow: hidden; text-overflow: ellipsis")}>
                  {"Mark invoiced"}
                </span>
              </button>
              <button className={"tb tg"} type={"button"} onClick={$s0?.bulkPaid} aria-disabled={$s0?.noSel} {...S(`opacity: ${I($s0?.bulkOp)}; ${I($s0?.k?.sSm)}; height: 36px; padding: 0 8px; min-width: 0`)}>
                <span {...S("min-width: 0; overflow: hidden; text-overflow: ellipsis")}>
                  {"Mark paid"}
                </span>
              </button>
              <button className={"tb tg"} type={"button"} onClick={$s0?.bulkArchive} aria-disabled={$s0?.noSel} {...S(`opacity: ${I($s0?.bulkOp)}; ${I($s0?.k?.sSm)}; height: 36px; padding: 0 8px; min-width: 0`)}>
                <span {...S("min-width: 0; overflow: hidden; text-overflow: ellipsis")}>
                  {"Archive"}
                </span>
              </button>
            </div>
          </div>
        </>) : null}
        {$s0?.viewSheet ? (<>
          <div onClick={$s0?.toggleView} className={"a-fade"} {...S(`position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 70; background: ${I($s0?.t?.overlay)}`)} />
          <div role={"dialog"} aria-modal={"true"} aria-label={"Show deals"} className={"a-up"} {...S($s0?.sheetBox)}>
            <span {...S($s0?.sheetHandle)} />
            <div {...S("display: flex; align-items: center; gap: 8px; padding: 0 0 6px 10px")}>
              <h2 {...S(`flex: 1 1 auto; min-width: 0; margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 16px; font-weight: 600; white-space: nowrap`)}>
                {"Show deals"}
              </h2>
              <button className={"tb tg"} type={"button"} onClick={$s0?.toggleView} aria-label={"Close"} {...S(`${I($s0?.k?.ico)}; width: 36px; height: 36px`)}>
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M18 6 6 18M6 6l12 12"} />
                </svg>
              </button>
            </div>
            <div role={"radiogroup"} aria-label={"Deal views"} {...S("display: flex; flex-direction: column; gap: 2px")}>
              {A($s0?.tabs).map((it, i) => {
                const $s1 = { ...$s0, "o": it, $index: i };
                return (<React.Fragment key={i}>
                  <button className={"tb tt"} type={"button"} role={"radio"} aria-checked={$s1?.o?.on} onClick={$s1?.o?.pickClose} {...S(`${I($s1?.k?.item)}; min-height: 52px; background: ${I($s1?.o?.rowBg)}; text-align: left`)}>
                    <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                      <span {...S(`font-weight: ${I($s1?.o?.fw)}`)}>
                        {T($s1?.o?.label)}
                      </span>
                      <span {...S(`font-size: 13px; color: ${I($s1?.t?.mutedFg)}`)}>
                        {T($s1?.o?.sub)}
                      </span>
                    </span>
                    <span {...S(`font-size: 13px; color: ${I($s1?.t?.mutedFg)}; font-variant-numeric: tabular-nums`)}>
                      {T($s1?.o?.count)}
                    </span>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 16px; visibility: ${I($s1?.o?.check)}`)}>
                      <path d={"M20 6 9 17l-5-5"} />
                    </svg>
                  </button>
                </React.Fragment>);
              })}
            </div>
          </div>
        </>) : null}
        {$s0?.facetSheet ? (<>
          <div onClick={$s0?.toggleFacet} className={"a-fade"} {...S(`position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 70; background: ${I($s0?.t?.overlay)}`)} />
          <div role={"dialog"} aria-modal={"true"} aria-label={"Filter by payment"} className={"a-up"} {...S($s0?.sheetBox)}>
            <span {...S($s0?.sheetHandle)} />
            <div {...S("display: flex; align-items: center; gap: 8px; padding: 0 0 6px 10px")}>
              <h2 {...S(`flex: 1 1 auto; min-width: 0; margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 16px; font-weight: 600; white-space: nowrap`)}>
                {"Payment status"}
              </h2>
              <button className={"tb tg"} type={"button"} onClick={$s0?.toggleFacet} aria-label={"Close"} {...S(`${I($s0?.k?.ico)}; width: 36px; height: 36px`)}>
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M18 6 6 18M6 6l12 12"} />
                </svg>
              </button>
            </div>
            {A($s0?.facetOpts).map((it, i) => {
              const $s1 = { ...$s0, "o": it, $index: i };
              return (<React.Fragment key={i}>
                <button className={"tb tg"} type={"button"} role={"menuitemcheckbox"} aria-checked={$s1?.o?.on} onClick={$s1?.o?.pick} {...S(`${I($s1?.k?.item)}; min-height: 44px`)}>
                  <span {...S($s1?.o?.box)}>
                    <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`visibility: ${I($s1?.o?.check)}`)}>
                      <path d={"M20 6 9 17l-5-5"} />
                    </svg>
                  </span>
                  <span {...S("flex: 1 1 auto")}>
                    {T($s1?.o?.label)}
                  </span>
                  <span {...S(`font-size: 13px; color: ${I($s1?.t?.mutedFg)}; font-variant-numeric: tabular-nums`)}>
                    {T($s1?.o?.count)}
                  </span>
                </button>
              </React.Fragment>);
            })}
            <div {...S(`display: flex; gap: 8px; margin-top: 10px; padding-top: 12px; border-top: 1px solid ${I($s0?.t?.line)}`)}>
              <button className={"tb tg"} type={"button"} onClick={$s0?.clearFacet} aria-disabled={$s0?.noFacet} {...S(`opacity: ${I($s0?.clearOp)}; ${I($s0?.k?.btnO)}; flex: 1 1 0; min-width: 0; height: 40px`)}>
                {"Clear"}
              </button>
              <button className={"tb tp"} type={"button"} onClick={$s0?.toggleFacet} {...S(`${I($s0?.k?.btnP)}; flex: 1 1 0; min-width: 0; height: 40px`)}>
                {T($s0?.showLabel)}
              </button>
            </div>
          </div>
        </>) : null}
        {$s0?.colsSheet ? (<>
          <div onClick={$s0?.toggleCols} className={"a-fade"} {...S(`position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 70; background: ${I($s0?.t?.overlay)}`)} />
          <div role={"dialog"} aria-modal={"true"} aria-label={"Show on cards"} className={"a-up"} {...S($s0?.sheetBox)}>
            <span {...S($s0?.sheetHandle)} />
            <div {...S("display: flex; align-items: center; gap: 8px; padding: 0 0 2px 10px")}>
              <h2 {...S(`flex: 1 1 auto; min-width: 0; margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 16px; font-weight: 600; white-space: nowrap`)}>
                {"Show on cards"}
              </h2>
              <button className={"tb tg"} type={"button"} onClick={$s0?.toggleCols} aria-label={"Close"} {...S(`${I($s0?.k?.ico)}; width: 36px; height: 36px`)}>
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M18 6 6 18M6 6l12 12"} />
                </svg>
              </button>
            </div>
            <span {...S(`padding: 0 10px 4px; font-size: 13px; color: ${I($s0?.t?.mutedFg)}`)}>
              {"Pick what each deal card shows."}
            </span>
            {A($s0?.colGroups).map((it, i) => {
              const $s1 = { ...$s0, "cg": it, $index: i };
              return (<React.Fragment key={i}>
                <div {...S(`padding: 10px 10px 4px; font-size: 12px; font-weight: 500; color: ${I($s1?.t?.mutedFg)}`)}>
                  {T($s1?.cg?.label)}
                </div>
                {A($s1?.cg?.items).map((it, i) => {
                  const $s2 = { ...$s1, "o": it, $index: i };
                  return (<React.Fragment key={i}>
                    <button className={"tb tg"} type={"button"} role={"menuitemcheckbox"} aria-checked={$s2?.o?.on} onClick={$s2?.o?.pick} {...S(`${I($s2?.k?.item)}; min-height: 44px`)}>
                      <span {...S($s2?.o?.box)}>
                        <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`visibility: ${I($s2?.o?.check)}`)}>
                          <path d={"M20 6 9 17l-5-5"} />
                        </svg>
                      </span>
                      <span {...S("flex: 1 1 auto")}>
                        {T($s2?.o?.label)}
                      </span>
                    </button>
                  </React.Fragment>);
                })}
              </React.Fragment>);
            })}
            <div {...S(`display: flex; gap: 8px; margin-top: 10px; padding-top: 12px; border-top: 1px solid ${I($s0?.t?.line)}`)}>
              <button className={"tb tg"} type={"button"} onClick={$s0?.resetCols} {...S(`${I($s0?.k?.btnO)}; flex: 1 1 0; min-width: 0; height: 40px`)}>
                {"Reset to default"}
              </button>
              <button className={"tb tp"} type={"button"} onClick={$s0?.toggleCols} {...S(`${I($s0?.k?.btnP)}; flex: 1 1 0; min-width: 0; height: 40px`)}>
                {"Done"}
              </button>
            </div>
          </div>
        </>) : null}
        {$s0?.sheetOpen ? (<>
          <div onClick={$s0?.closeSheet} className={"a-fade"} {...S(`position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 60; background: ${I($s0?.t?.overlay)}`)} />
          <aside role={"dialog"} aria-modal={"true"} aria-labelledby={"sheet-title"} className={$s0?.sh?.anim} {...S(`position: fixed; top: ${I($s0?.sh?.inset)}; right: ${I($s0?.sh?.inset)}; bottom: ${I($s0?.sh?.inset)}; z-index: 61; width: ${I($s0?.sh?.w)}; max-width: ${I($s0?.sh?.maxW)}; display: flex; flex-direction: column; background: ${I($s0?.t?.card)}; border: ${I($s0?.sh?.border)}; border-radius: ${I($s0?.sh?.radius)}; box-shadow: ${I($s0?.t?.shPop)}; overflow: hidden`)}>
            <div {...S("position: relative; display: flex; align-items: center; gap: 12px; padding: 18px 14px 14px 20px")}>
              <span {...S(`width: 42px; height: 42px; flex: 0 0 42px; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.fill)}; display: inline-flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600`)}>
                {T($s0?.d?.l)}
              </span>
              <div {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 5px")}>
                <h2 id={"sheet-title"} {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 17px; font-weight: 600; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                  {T($s0?.d?.brand)}
                </h2>
                <span {...S("display: flex; align-items: center; gap: 8px; min-width: 0")}>
                  <span {...S("font-weight: 500; font-variant-numeric: tabular-nums; white-space: nowrap")}>
                    {T($s0?.d?.amount)}
                  </span>
                  <span {...S(`color: ${I($s0?.d?.pay?.fg)}; ${I($s0?.k?.payBadge)}`)}>
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("display: block; flex: 0 0 14px")}>
                      <circle cx={"12"} cy={"12"} r={"9.5"} fill={$s0?.d?.pay?.fill} stroke={$s0?.d?.pay?.stroke} strokeDasharray={$s0?.d?.pay?.dash} />
                      <path d={$s0?.d?.pay?.inner} stroke={$s0?.d?.pay?.innerStroke} />
                    </svg>
                    {T($s0?.d?.pay?.label)}
                  </span>
                  <span {...S("position: relative; display: inline-flex")}>
                    <button className={"tb tg"} type={"button"} onClick={$s0?.popHStatus} aria-haspopup={"listbox"} aria-expanded={$s0?.hStatusOpen} aria-label={`Deal status: ${I($s0?.d?.statusNow)}. Change it`} {...S(`--hv: ${I($s0?.t?.fill)}; display: inline-flex; align-items: center; gap: 6px; height: 24px; padding: 0 7px 0 9px; box-sizing: border-box; border: 1px solid ${I($s0?.t?.border)}; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.card)}; color: ${I($s0?.t?.fg)}; font: inherit; font-size: 12px; font-weight: 500; white-space: nowrap; cursor: pointer`)}>
                      <span {...S(`width: 6px; height: 6px; flex: 0 0 6px; border-radius: 3px; background: ${I($s0?.d?.stDot)}`)} />
                      {T($s0?.d?.statusNow)}
                      <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("display: block; flex: 0 0 12px")}>
                        <path d={"m6 9 6 6 6-6"} />
                      </svg>
                    </button>
                    {$s0?.hStatusOpen ? (<>
                      <div role={"listbox"} aria-label={"Deal status"} className={"a-drop"} {...S(`position: absolute; top: 30px; left: 0; width: 200px; z-index: 12; ${I($s0?.k?.pop)}`)}>
                        {A($s0?.hStatusOpts).map((it, i) => {
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
                  </span>
                </span>
              </div>
              <button className={"tb tg"} type={"button"} onClick={$s0?.toggleSheetMenu} aria-label={"More actions"} aria-haspopup={"menu"} aria-expanded={$s0?.sheetMenu} {...S($s0?.k?.ico)}>
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"currentColor"} aria-hidden={"true"}>
                  <circle cx={"5"} cy={"12"} r={"1.7"} />
                  <circle cx={"12"} cy={"12"} r={"1.7"} />
                  <circle cx={"19"} cy={"12"} r={"1.7"} />
                </svg>
              </button>
              <button className={"tb tg"} type={"button"} onClick={$s0?.closeSheet} aria-label={"Close"} {...S($s0?.k?.ico)}>
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M18 6 6 18M6 6l12 12"} />
                </svg>
              </button>
              {$s0?.sheetMenu ? (<>
                <div role={"menu"} aria-label={"Deal actions"} className={"a-drop"} {...S(`position: absolute; top: 58px; right: 48px; width: 184px; z-index: 5; ${I($s0?.k?.pop)}`)}>
                  <button className={"tb tg"} type={"button"} role={"menuitem"} onClick={$s0?.sheetDup} {...S($s0?.k?.item)}>
                    {"Duplicate deal"}
                  </button>
                  <button className={"tb tg"} type={"button"} role={"menuitem"} onClick={$s0?.sheetArchive} {...S($s0?.k?.item)}>
                    {"Archive"}
                  </button>
                  <div {...S(`height: 1px; margin: 6px -6px; background: ${I($s0?.t?.line)}`)} />
                  <button className={"tb tg"} type={"button"} role={"menuitem"} onClick={$s0?.sheetDelete} {...S(`${I($s0?.k?.item)}; color: ${I($s0?.t?.destr)};`)}>
                    {"Delete deal"}
                  </button>
                </div>
              </>) : null}
            </div>
            <div {...S("padding: 0 20px 14px")}>
              <div role={"tablist"} aria-label={"Deal sections"} {...S(`display: flex; width: 100%; ${I($s0?.k?.tabs)}`)}>
                {A($s0?.sTabs).map((it, i) => {
                  const $s1 = { ...$s0, "tb": it, $index: i };
                  return (<React.Fragment key={i}>
                    <button className={"tb tt"} type={"button"} role={"tab"} aria-selected={$s1?.tb?.on} onClick={$s1?.tb?.pick} {...S(`flex: 1 1 0; ${I($s1?.tb?.style)}`)}>
                      {T($s1?.tb?.label)}
                      {$s1?.tb?.hasCount ? (<>
                        <span {...S(`color: ${I($s1?.t?.mutedFg)}; font-variant-numeric: tabular-nums`)}>
                          {T($s1?.tb?.count)}
                        </span>
                      </>) : null}
                    </button>
                  </React.Fragment>);
                })}
              </div>
            </div>
            <div {...S("flex: 1 1 auto; overflow-y: auto; padding: 0 14px 18px; display: flex; flex-direction: column; gap: 12px")}>
              {$s0?.isDetails ? (<>
                <section className={"a-in"} {...S(`border-radius: ${I($s0?.t?.rCard)}; background: ${I($s0?.t?.tile)}`)}>
                  <button className={"tb tg"} type={"button"} onClick={$s0?.accPay} aria-expanded={$s0?.payOpen} {...S(`--hv: ${I($s0?.t?.tile)}; display: flex; align-items: center; gap: 10px; width: 100%; height: 54px; padding: 0 16px; box-sizing: border-box; border: none; border-radius: ${I($s0?.t?.rCard)}; background: transparent; font: inherit; color: ${I($s0?.t?.fg)}; text-align: left; cursor: pointer`)}>
                    <span {...S("font-size: 15px; font-weight: 600")}>
                      {"Payment"}
                    </span>
                    <span {...S(`margin-left: auto; min-width: 0; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                      {T($s0?.paySummary)}
                    </span>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 16px; transform: ${I($s0?.payRot)}; transition: transform 0.2s`)}>
                      <path d={"m6 9 6 6 6-6"} />
                    </svg>
                  </button>
                  {$s0?.payOpen ? (<>
                    <div className={"a-fade"} {...S("display: flex; flex-direction: column; gap: 14px; padding: 0 10px 12px")}>
                      <div {...S($s0?.k?.group)}>
                        <div {...S($s0?.k?.row)}>
                          <label htmlFor={"sh-amt"} {...S($s0?.k?.rowLabel)}>
                            {"Amount"}
                          </label>
                          <span className={"ti"} {...S(`display: flex; align-items: center; gap: 6px; ${I($s0?.k?.ctl)}; flex: 0 1 ${I($s0?.ctlW)}`)}>
                            <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                              {"$"}
                            </span>
                            <input id={"sh-amt"} value={V0($s0?.amtVal, "")} onChange={$s0?.setAmt} readOnly={$s0?.ro} onFocus={$s0?.lockFocus} inputMode={"decimal"} {...S(`flex: 1 1 auto; min-width: 0; height: 34px; border: none; outline: none; background: transparent; font: inherit; font-size: 14px; color: ${I($s0?.t?.fg)}; padding: 0; text-align: right; font-variant-numeric: tabular-nums`)} />
                          </span>
                        </div>
                        <div {...S($s0?.k?.rowT)}>
                          <span {...S($s0?.k?.rowLabel)}>
                            {"How you get paid"}
                          </span>
                          <button className={"tb tg"} type={"button"} onClick={$s0?.popHow} aria-haspopup={"listbox"} aria-expanded={$s0?.howOpen} {...S(`${I($s0?.k?.sel)}; flex: 0 1 ${I($s0?.ctlW)}; box-sizing: border-box`)}>
                            <span {...S("white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                              {T($s0?.howVal)}
                            </span>
                            <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 15px")}>
                              <path d={"m6 9 6 6 6-6"} />
                            </svg>
                          </button>
                          {$s0?.howOpen ? (<>
                            <div role={"listbox"} aria-label={"How you get paid"} className={"a-drop"} {...S(`position: absolute; top: 48px; right: 10px; width: 220px; z-index: 10; ${I($s0?.k?.pop)}`)}>
                              {A($s0?.howOpts).map((it, i) => {
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
                        <div {...S($s0?.k?.rowT)}>
                          <span {...S($s0?.k?.rowLabel)}>
                            {"When"}
                          </span>
                          <button className={"tb tg"} type={"button"} onClick={$s0?.popWhen} aria-haspopup={"listbox"} aria-expanded={$s0?.whenOpen} {...S(`${I($s0?.k?.sel)}; flex: 0 1 ${I($s0?.ctlW)}; box-sizing: border-box`)}>
                            <span {...S("white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                              {T($s0?.whenVal)}
                            </span>
                            <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 15px")}>
                              <path d={"m6 9 6 6 6-6"} />
                            </svg>
                          </button>
                          {$s0?.whenOpen ? (<>
                            <div role={"listbox"} aria-label={"When"} className={"a-drop"} {...S(`position: absolute; top: 48px; right: 10px; width: 220px; z-index: 10; ${I($s0?.k?.pop)}`)}>
                              {A($s0?.whenOpts).map((it, i) => {
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
                        <div {...S($s0?.k?.rowT)}>
                          <span {...S($s0?.k?.rowLabel)}>
                            {"Due date"}
                          </span>
                          <div {...S(`flex: 0 1 ${I($s0?.ctlW)}; min-width: 0`)}>
                            <SDatePicker value={$s0?.dueVal} onChange={$s0?.setDue} placeholder={"Pick a date"} label={"Due date"} align={"end"} color={$s0?.eff} dark={$s0?.dark} />
                          </div>
                        </div>
                      </div>
                      <div {...S("display: flex; flex-direction: column; gap: 6px")}>
                        <span {...S(`padding: 0 6px; ${I($s0?.k?.caps)}`)}>
                          {"Schedule"}
                        </span>
                        <div {...S($s0?.k?.group)}>
                          {A($s0?.d?.sched).map((it, i) => {
                            const $s1 = { ...$s0, "s": it, $index: i };
                            return (<React.Fragment key={i}>
                              <div {...S($s1?.s?.rowStyle)}>
                                <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                                  <span {...S("font-weight: 500; white-space: nowrap")}>
                                    {T($s1?.s?.label)}
                                  </span>
                                  <span {...S(`font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: ${I($s1?.s?.subFg)}`)}>
                                    {T($s1?.s?.sub)}
                                  </span>
                                </span>
                                <span {...S("display: flex; flex-direction: column; align-items: flex-end; gap: 4px")}>
                                  <span {...S("font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums")}>
                                    {T($s1?.s?.amount)}
                                  </span>
                                  <span {...S("position: relative; display: inline-flex")}>
                                    <button className={"tb tg"} type={"button"} onClick={$s1?.s?.toggle} aria-haspopup={"listbox"} aria-expanded={$s1?.s?.open} aria-label={$s1?.s?.aria} {...S(`--hv: ${I($s1?.t?.fill)}; font: inherit; cursor: pointer; color: ${I($s1?.s?.pay?.fg)}; ${I($s1?.k?.payBadge)}`)}>
                                      <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("display: block; flex: 0 0 14px")}>
                                        <circle cx={"12"} cy={"12"} r={"9.5"} fill={$s1?.s?.pay?.fill} stroke={$s1?.s?.pay?.stroke} strokeDasharray={$s1?.s?.pay?.dash} />
                                        <path d={$s1?.s?.pay?.inner} stroke={$s1?.s?.pay?.innerStroke} />
                                      </svg>
                                      {T($s1?.s?.pay?.label)}
                                      <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("display: block; flex: 0 0 12px")}>
                                        <path d={"m6 9 6 6 6-6"} />
                                      </svg>
                                    </button>
                                    {$s1?.s?.open ? (<>
                                      <div role={"listbox"} aria-label={"Payment status"} className={"a-drop"} {...S(`position: absolute; top: 30px; right: 0; width: 190px; z-index: 12; ${I($s1?.k?.pop)}`)}>
                                        {A($s1?.s?.opts).map((it, i) => {
                                          const $s2 = { ...$s1, "o": it, $index: i };
                                          return (<React.Fragment key={i}>
                                            <button className={"tb tg"} type={"button"} role={"option"} aria-selected={$s2?.o?.on} onClick={$s2?.o?.pick} {...S(`justify-content: space-between; ${I($s2?.k?.item)}`)}>
                                              {T($s2?.o?.label)}
                                              <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`visibility: ${I($s2?.o?.check)}`)}>
                                                <path d={"M20 6 9 17l-5-5"} />
                                              </svg>
                                            </button>
                                          </React.Fragment>);
                                        })}
                                      </div>
                                    </>) : null}
                                  </span>
                                </span>
                              </div>
                            </React.Fragment>);
                          })}
                        </div>
                      </div>
                      <div {...S("display: flex; flex-direction: column; gap: 6px")}>
                        <span {...S(`padding: 0 6px; ${I($s0?.k?.caps)}`)}>
                          {"Extras"}
                        </span>
                        <div {...S($s0?.k?.group)}>
                          {$s0?.noExtras ? (<>
                            <div {...S($s0?.k?.row)}>
                              <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                                <span {...S("font-weight: 500")}>
                                  {"No bonus or commission"}
                                </span>
                                <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}`)}>
                                  {"They count in your totals once earned."}
                                </span>
                              </span>
                              <button className={"tb tg"} type={"button"} onClick={$s0?.addExtra} {...S($s0?.k?.oSm)}>
                                <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                                  <path d={"M5 12h14M12 5v14"} />
                                </svg>
                                {"Add"}
                              </button>
                            </div>
                          </>) : null}
                          {A($s0?.extras).map((it, i) => {
                            const $s1 = { ...$s0, "x": it, $index: i };
                            return (<React.Fragment key={i}>
                              <div className={"a-in"} {...S($s1?.x?.rowStyle)}>
                                <button className={"tb tg"} type={"button"} onClick={$s1?.x?.toggleType} aria-label={$s1?.x?.typeAria} {...S(`width: 128px; justify-content: space-between; ${I($s1?.k?.sSm)}`)}>
                                  {T($s1?.x?.type)}
                                  <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s1?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                    <path d={"m7 15 5 5 5-5M7 9l5-5 5 5"} />
                                  </svg>
                                </button>
                                <input className={"ti"} aria-label={$s1?.x?.amtLabel} placeholder={$s1?.x?.amtPh} value={V0($s1?.x?.value, "")} onChange={$s1?.x?.setVal} readOnly={$s1?.ro} onFocus={$s1?.lockFocus} {...S(`height: 30px; ${I($s1?.k?.ctl)}; flex: 1 1 auto`)} />
                                <button className={"tb tg"} type={"button"} onClick={$s1?.x?.remove} aria-label={"Remove extra"} {...S(`--hv: ${I($s1?.t?.fill)}; ${I($s1?.k?.icoS)}`)}>
                                  <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                    <path d={"M18 6 6 18M6 6l12 12"} />
                                  </svg>
                                </button>
                              </div>
                            </React.Fragment>);
                          })}
                          {$s0?.hasExtras ? (<>
                            <div {...S($s0?.k?.rowT)}>
                              <button className={"tb tg"} type={"button"} onClick={$s0?.addExtra} {...S(`margin-left: -6px; --hv: ${I($s0?.t?.fill)}; ${I($s0?.k?.gSm)}`)}>
                                <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                                  <path d={"M5 12h14M12 5v14"} />
                                </svg>
                                {"Add another"}
                              </button>
                            </div>
                          </>) : null}
                        </div>
                      </div>
                      <div {...S($s0?.k?.group)}>
                        <div {...S($s0?.k?.row)}>
                          <span {...S(`width: 34px; height: 34px; flex: 0 0 34px; border-radius: ${I($s0?.t?.rSm)}; background: ${I($s0?.t?.fill)}; display: inline-flex; align-items: center; justify-content: center`)}>
                            <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7zM14 2v4a2 2 0 0 0 2 2h4M16 13H8M16 17H8M10 9H8"} />
                            </svg>
                          </span>
                          <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                            <span {...S("font-weight: 500")}>
                              {"Invoice"}
                            </span>
                            <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                              {T($s0?.invoiceSub)}
                            </span>
                          </span>
                          {$s0?.hasInvoice ? (<>
                            <a className={"tb tg"} href={H($s0?.invoiceUrl)} target={"_blank"} rel={"noopener"} {...S(`${I($s0?.k?.gSm)}; text-decoration: none`)}>
                              {"Open"}
                            </a>
                          </>) : null}
                          <button className={"tb tg"} type={"button"} onClick={$s0?.uploadInvoice} {...S($s0?.k?.oSm)}>
                            {"Upload"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>) : null}
                </section>
                <section className={"a-in"} {...S(`animation-delay: 0.04s; border-radius: ${I($s0?.t?.rCard)}; background: ${I($s0?.t?.tile)}`)}>
                  <button className={"tb tg"} type={"button"} onClick={$s0?.accDeal} aria-expanded={$s0?.dealOpen} {...S(`--hv: ${I($s0?.t?.tile)}; display: flex; align-items: center; gap: 10px; width: 100%; height: 54px; padding: 0 16px; box-sizing: border-box; border: none; border-radius: ${I($s0?.t?.rCard)}; background: transparent; font: inherit; color: ${I($s0?.t?.fg)}; text-align: left; cursor: pointer`)}>
                    <span {...S("font-size: 15px; font-weight: 600")}>
                      {"Deal"}
                    </span>
                    <span {...S(`margin-left: auto; min-width: 0; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                      {T($s0?.dealSummary)}
                    </span>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 16px; transform: ${I($s0?.dealRot)}; transition: transform 0.2s`)}>
                      <path d={"m6 9 6 6 6-6"} />
                    </svg>
                  </button>
                  {$s0?.dealOpen ? (<>
                    <div className={"a-fade"} {...S("padding: 0 10px 12px")}>
                      <div {...S($s0?.k?.group)}>
                        <div {...S($s0?.k?.row)}>
                          <span {...S($s0?.k?.rowLabel)}>
                            {"Status"}
                          </span>
                          <button className={"tb tg"} type={"button"} onClick={$s0?.popStatus} aria-haspopup={"listbox"} aria-expanded={$s0?.statusOpen} {...S(`${I($s0?.k?.sel)}; flex: 0 1 ${I($s0?.ctlW)}; box-sizing: border-box`)}>
                            <span>
                              {T($s0?.d?.statusNow)}
                            </span>
                            <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 15px")}>
                              <path d={"m6 9 6 6 6-6"} />
                            </svg>
                          </button>
                          {$s0?.statusOpen ? (<>
                            <div role={"listbox"} aria-label={"Status"} className={"a-drop"} {...S(`position: absolute; top: 48px; right: 10px; width: 220px; z-index: 10; ${I($s0?.k?.pop)}`)}>
                              {A($s0?.statusOpts).map((it, i) => {
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
                        <div {...S($s0?.k?.rowT)}>
                          <span {...S($s0?.k?.rowLabel)}>
                            {"Post date"}
                          </span>
                          <div {...S(`flex: 0 1 ${I($s0?.ctlW)}; min-width: 0`)}>
                            <SDatePicker value={$s0?.postVal} onChange={$s0?.setPost} placeholder={"Pick a date"} label={"Post date"} align={"end"} color={$s0?.eff} dark={$s0?.dark} />
                          </div>
                        </div>
                        <div {...S($s0?.k?.rowCol)}>
                          <span {...S("font-weight: 500")}>
                            {"Platforms"}
                          </span>
                          <div role={"group"} aria-label={"Platforms"} {...S("display: flex; flex-wrap: wrap; gap: 6px")}>
                            {A($s0?.plats).map((it, i) => {
                              const $s1 = { ...$s0, "c": it, $index: i };
                              return (<React.Fragment key={i}>
                                <button className={"tb tg"} type={"button"} aria-pressed={$s1?.c?.on} onClick={$s1?.c?.pick} {...S(`display: inline-flex; align-items: center; gap: 7px; ${I($s1?.c?.style)}; padding: ${I($s1?.c?.pad)}`)}>
                                  {$s1?.c?.hasIcon ? (<>
                                    <img src={$s1?.c?.icon} alt={""} width={"18"} height={"18"} {...S("display: block; width: 18px; height: 18px; flex: 0 0 18px; border-radius: 5px")} />
                                  </>) : null}
                                  {T($s1?.c?.label)}
                                </button>
                              </React.Fragment>);
                            })}
                          </div>
                        </div>
                        <div {...S($s0?.k?.rowCol)}>
                          <span {...S("font-weight: 500")}>
                            {"Post types"}
                          </span>
                          <div role={"group"} aria-label={"Post types"} {...S("display: flex; flex-wrap: wrap; gap: 6px")}>
                            {A($s0?.types).map((it, i) => {
                              const $s1 = { ...$s0, "c": it, $index: i };
                              return (<React.Fragment key={i}>
                                <button className={"tb tg"} type={"button"} aria-pressed={$s1?.c?.on} onClick={$s1?.c?.pick} {...S($s1?.c?.style)}>
                                  {T($s1?.c?.label)}
                                </button>
                              </React.Fragment>);
                            })}
                          </div>
                        </div>
                        <div {...S($s0?.k?.rowT)}>
                          <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                            <span>
                              {"Revisions included"}
                            </span>
                            <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}`)}>
                              {"Rounds of changes the brand gets"}
                            </span>
                          </span>
                          <div role={"group"} aria-label={"Revisions included"} {...S(`display: inline-flex; align-items: center; gap: 2px; height: 34px; padding: 0 3px; box-sizing: border-box; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.fill)}`)}>
                            <button className={"tb tg"} type={"button"} onClick={$s0?.revDown} aria-label={"One fewer"} {...S(`--hv: ${I($s0?.t?.card)}; ${I($s0?.k?.icoG)}`)}>
                              <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                                <path d={"M5 12h14"} />
                              </svg>
                            </button>
                            <span {...S("min-width: 22px; text-align: center; font-weight: 600; font-variant-numeric: tabular-nums")}>
                              {T($s0?.rev)}
                            </span>
                            <button className={"tb tg"} type={"button"} onClick={$s0?.revUp} aria-label={"One more"} {...S(`--hv: ${I($s0?.t?.card)}; ${I($s0?.k?.icoG)}`)}>
                              <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                                <path d={"M5 12h14M12 5v14"} />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>) : null}
                </section>
                <section className={"a-in"} {...S(`animation-delay: 0.08s; border-radius: ${I($s0?.t?.rCard)}; background: ${I($s0?.t?.tile)}`)}>
                  <button className={"tb tg"} type={"button"} onClick={$s0?.accRep} aria-expanded={$s0?.repOpen} {...S(`--hv: ${I($s0?.t?.tile)}; display: flex; align-items: center; gap: 10px; width: 100%; height: 54px; padding: 0 16px; box-sizing: border-box; border: none; border-radius: ${I($s0?.t?.rCard)}; background: transparent; font: inherit; color: ${I($s0?.t?.fg)}; text-align: left; cursor: pointer`)}>
                    <span {...S("font-size: 15px; font-weight: 600")}>
                      {"Rep contact"}
                    </span>
                    <span {...S(`margin-left: auto; min-width: 0; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                      {T($s0?.repSummary)}
                    </span>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 16px; transform: ${I($s0?.repRot)}; transition: transform 0.2s`)}>
                      <path d={"m6 9 6 6 6-6"} />
                    </svg>
                  </button>
                  {$s0?.repOpen ? (<>
                    <div className={"a-fade"} {...S("padding: 0 10px 12px")}>
                      <div {...S($s0?.k?.group)}>
                        <div {...S($s0?.k?.row)}>
                          <label htmlFor={"rep-name"} {...S($s0?.k?.rowLabel)}>
                            {"Name"}
                          </label>
                          <input id={"rep-name"} className={"ti"} value={V0($s0?.repName, "")} onChange={$s0?.setRepName} readOnly={$s0?.ro} onFocus={$s0?.lockFocus} placeholder={"Full name"} {...S(`${I($s0?.k?.ctl)}; flex: 0 1 ${I($s0?.ctlW)}; box-sizing: border-box`)} />
                        </div>
                        <div {...S($s0?.k?.rowT)}>
                          <label htmlFor={"rep-email"} {...S($s0?.k?.rowLabel)}>
                            {"Email"}
                          </label>
                          <input id={"rep-email"} className={"ti"} type={"email"} placeholder={"name@brand.com"} value={V0($s0?.repEmail, "")} onChange={$s0?.setRepEmail} readOnly={$s0?.ro} onFocus={$s0?.lockFocus} {...S(`${I($s0?.k?.ctl)}; flex: 0 1 ${I($s0?.ctlW)}; box-sizing: border-box`)} />
                        </div>
                        <div {...S($s0?.k?.rowT)}>
                          <label htmlFor={"rep-phone"} {...S($s0?.k?.rowLabel)}>
                            {"Phone"}
                          </label>
                          <input id={"rep-phone"} className={"ti"} type={"tel"} placeholder={"Optional"} value={V0($s0?.repPhone, "")} onChange={$s0?.setRepPhone} readOnly={$s0?.ro} onFocus={$s0?.lockFocus} {...S(`${I($s0?.k?.ctl)}; flex: 0 1 ${I($s0?.ctlW)}; box-sizing: border-box`)} />
                        </div>
                      </div>
                    </div>
                  </>) : null}
                </section>
              </>) : null}
              {$s0?.isChecklist ? (<>
                <div className={"a-in"} {...S("display: flex; flex-direction: column; gap: 12px; padding: 0 6px")}>
                  <div {...S(`padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; ${I($s0?.k?.tile)}`)}>
                    <div {...S("display: flex; justify-content: space-between; align-items: baseline")}>
                      <span {...S($s0?.k?.caps)}>
                        {"Progress"}
                      </span>
                      <span {...S("font-weight: 500; font-variant-numeric: tabular-nums")}>
                        {T($s0?.checkLabel)}
                      </span>
                    </div>
                    <div role={"progressbar"} aria-label={"Checklist progress"} aria-valuemin={"0"} aria-valuemax={"100"} aria-valuenow={$s0?.checkPct} {...S(`height: 6px; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.off)}; overflow: hidden`)}>
                      <div {...S(`height: 6px; width: ${I($s0?.checkW)}; background: ${I($s0?.t?.primary)}; border-radius: ${I($s0?.t?.rCtl)}; transition: width 0.4s cubic-bezier(.4,0,.2,1)`)} />
                    </div>
                  </div>
                  <div {...S("display: flex; gap: 8px")}>
                    <input className={"ti"} aria-label={"New checklist step"} placeholder={"Add a step"} value={V0($s0?.draft, "")} onChange={$s0?.setDraft} onKeyDown={$s0?.draftKey} readOnly={$s0?.ro} onFocus={$s0?.lockFocus} {...S($s0?.k?.input)} />
                    <button className={"tb tp"} type={"button"} onClick={$s0?.addItem} {...S(`height: 36px; ${I($s0?.k?.btnP)}`)}>
                      {"Add"}
                    </button>
                  </div>
                  {$s0?.noItems ? (<>
                    <div {...S(`display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 32px 16px; text-align: center; ${I($s0?.k?.tile)}`)}>
                      <span {...S("font-size: 15px; font-weight: 500")}>
                        {"No steps yet"}
                      </span>
                      <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                        {"Start with the usual steps for a brand deal, then edit them."}
                      </span>
                      <button className={"tb tp"} type={"button"} onClick={$s0?.addStandard} {...S(`margin-top: 4px; ${I($s0?.k?.btnP)}`)}>
                        {"Add standard steps"}
                      </button>
                    </div>
                  </>) : null}
                  {$s0?.hasItems ? (<>
                    <div {...S($s0?.k?.group)}>
                      {A($s0?.items).map((it, i) => {
                        const $s1 = { ...$s0, "it": it, $index: i };
                        return (<React.Fragment key={i}>
                          <div className={"a-in"} {...S(`animation-delay: ${I($s1?.it?.delay)}; ${I($s1?.it?.rowStyle)}`)}>
                            <button className={"tb"} type={"button"} role={"checkbox"} aria-checked={$s1?.it?.done} aria-label={$s1?.it?.aria} onClick={$s1?.it?.toggle} {...S($s1?.it?.box)}>
                              {$s1?.it?.done ? (<>
                                <svg className={"a-check"} width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                  <path d={"M20 6 9 17l-5-5"} />
                                </svg>
                              </>) : null}
                            </button>
                            <span {...S("flex: 1 1 auto; min-width: 0")}>
                              <span className={$s1?.it?.strikeCls} {...S(`color: ${I($s1?.it?.fg)}; background-image: linear-gradient(currentColor, currentColor); background-repeat: no-repeat; background-position: 0 55%; background-size: ${I($s1?.it?.strikeSize)}; -webkit-box-decoration-break: clone; box-decoration-break: clone; transition: color 0.3s ease`)}>
                                {T($s1?.it?.text)}
                              </span>
                            </span>
                            <button className={"tb tg"} type={"button"} onClick={$s1?.it?.remove} aria-label={"Remove step"} {...S(`--hv: ${I($s1?.t?.fill)}; ${I($s1?.k?.icoS)}`)}>
                              <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={"M18 6 6 18M6 6l12 12"} />
                              </svg>
                            </button>
                          </div>
                        </React.Fragment>);
                      })}
                    </div>
                  </>) : null}
                </div>
              </>) : null}
              {$s0?.isNotes ? (<>
                <label className={"a-in"} {...S("display: flex; flex-direction: column; gap: 8px; padding: 0 6px")}>
                  <span {...S("font-weight: 500")}>
                    {"Notes"}
                  </span>
                  <textarea className={"ti"} placeholder={"Anything worth remembering about this deal"} value={V0($s0?.notesVal, "")} onChange={$s0?.setNotes} readOnly={$s0?.ro} onFocus={$s0?.lockFocus} {...S(`height: 240px; ${I($s0?.k?.area)}`)} />
                  <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                    {"Only you can see these notes."}
                  </span>
                </label>
              </>) : null}
              {$s0?.isFiles ? (<>
                <div className={"a-in"} {...S("display: flex; flex-direction: column; gap: 14px; padding: 0 6px")}>
                  <div {...S("display: flex; flex-direction: column; gap: 8px")}>
                    <span {...S("font-weight: 500")}>
                      {"File type"}
                    </span>
                    <div role={"group"} aria-label={"File type"} {...S("display: flex; flex-wrap: wrap; gap: 6px")}>
                      {A($s0?.ftypes).map((it, i) => {
                        const $s1 = { ...$s0, "ft": it, $index: i };
                        return (<React.Fragment key={i}>
                          <button className={"tb tg"} type={"button"} aria-pressed={$s1?.ft?.on} onClick={$s1?.ft?.pick} {...S($s1?.ft?.style)}>
                            {T($s1?.ft?.label)}
                          </button>
                        </React.Fragment>);
                      })}
                    </div>
                    <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                      {T($s0?.ftypeHint)}
                    </span>
                  </div>
                  {$s0?.hasFiles ? (<>
                    <div {...S("display: flex; flex-direction: column; gap: 8px")}>
                      <span {...S("font-weight: 500")}>
                        {"Files"}
                      </span>
                      <div {...S($s0?.k?.group)}>
                        {A($s0?.files).map((it, i) => {
                          const $s1 = { ...$s0, "fl": it, $index: i };
                          return (<React.Fragment key={i}>
                            <div {...S($s1?.fl?.rowStyle)}>
                              <span {...S(`width: 34px; height: 34px; flex: 0 0 34px; border-radius: ${I($s1?.t?.rSm)}; background: ${I($s1?.fl?.badgeBg)}; color: ${I($s1?.fl?.badgeFg)}; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; letter-spacing: 0.02em`)}>
                                {T($s1?.fl?.ext)}
                              </span>
                              <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                                <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                                  {T($s1?.fl?.name)}
                                </span>
                                <span {...S(`font-size: 13px; color: ${I($s1?.t?.mutedFg)}; white-space: nowrap`)}>
                                  {T($s1?.fl?.meta)}
                                </span>
                              </span>
                              <a className={"tb tg"} href={H($s1?.fl?.url)} target={"_blank"} rel={"noopener"} {...S(`${I($s1?.k?.oSm)}; text-decoration: none`)}>
                                {"Open"}
                              </a>
                            </div>
                          </React.Fragment>);
                        })}
                      </div>
                    </div>
                  </>) : null}
                  <div {...S(`display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 32px 16px; border: 1.5px dashed ${I($s0?.t?.borderStrong)}; border-radius: ${I($s0?.t?.rCard)}; text-align: center`)}>
                    <span {...S(`width: 40px; height: 40px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.fill)}; display: inline-flex; align-items: center; justify-content: center`)}>
                      <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"} />
                      </svg>
                    </span>
                    <span {...S("font-size: 15px; font-weight: 500")}>
                      {"Upload a file"}
                    </span>
                    <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                      {"Drag a contract or invoice here, or choose one."}
                    </span>
                    <button className={"tb tp"} type={"button"} onClick={$s0?.chooseFile} {...S(`margin-top: 4px; ${I($s0?.k?.btnP)}`)}>
                      {"Choose file"}
                    </button>
                  </div>
                </div>
              </>) : null}
            </div>
            <div {...S(`display: flex; align-items: center; gap: 8px; padding: 14px 16px 16px 20px; border-top: 1px solid ${I($s0?.t?.line)}`)}>
              <span {...S(`display: inline-flex; align-items: center; gap: 6px; flex: 1 1 auto; min-width: 0; color: ${I($s0?.t?.mutedFg)}; font-size: 13px; white-space: nowrap; overflow: hidden`)}>
                <span {...S(`width: 6px; height: 6px; flex: 0 0 6px; border-radius: 3px; background: ${I($s0?.saveDot)}; transition: background-color 0.2s ease`)} />
                {T($s0?.saveText)}
              </span>
              {$s0?.dirty ? (<>
                <button type={"button"} className={"tb tg a-pop"} onClick={$s0?.cancelEdits} {...S($s0?.k?.btnO)}>
                  {"Cancel"}
                </button>
              </>) : null}
              {$s0?.showMarkPaid ? (<>
                <button className={"tb tg"} type={"button"} onClick={$s0?.markPaid} {...S($s0?.k?.btnO)}>
                  {"Mark as paid"}
                </button>
              </>) : null}
              <button className={"tb tp"} type={"button"} onClick={$s0?.save} aria-disabled={$s0?.notDirty} {...S(`opacity: ${I($s0?.saveOp)}; ${I($s0?.k?.btnP)}`)}>
                {"Save"}
              </button>
            </div>
          </aside>
        </>) : null}
        {$s0?.drawerOpen ? (<>
          <div {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 88")}>
            <button type={"button"} aria-label={"Close menu"} className={"a-fade"} onClick={$s0?.closeNav} {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; padding: 0; border: none; background: ${I($s0?.t?.overlay)}; cursor: default`)} />
            <div className={"a-drawer"} {...S(`position: absolute; top: 0; bottom: 0; left: 0; width: 288px; max-width: 86%; overflow-y: auto; box-shadow: ${I($s0?.t?.shPop)}`)}>
              <SSidebar account={$s0?.account} active={"deals"} color={$s0?.eff} dark={$s0?.dark} drawer={true} plan={$s0?.plan} fresh={$s0?.sbFresh} onClose={$s0?.closeNav} />
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

export const meta = {"props":{"color":{"editor":"enum","options":["studio","sand","mac","stationery","editorial"],"default":"studio"},"dark":{"editor":"boolean","default":false},"view":{"editor":"enum","options":["sample","empty","loading","error"],"default":"sample"},"plan":{"editor":"enum","options":["active","trial","pastdue","canceled","readonly"],"default":"active"},"start":{"editor":"enum","options":["none","deal","new","cmd"],"default":"none"},"writes":{"editor":"enum","options":["ok","fail"],"default":"ok"}},"preview":{"width":1440,"height":980}};
export default $r.defineBoard("SDeals", Component, render, CSS, meta);
