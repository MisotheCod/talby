// @ts-nocheck
/* eslint-disable */
'use client';
// SSettings: converted from design-source/boards/SSettings.dc.html.
// Markup, inline styles and logic are carried over exactly from the board.
// The logic class below is the board's own code, unchanged.
import * as React from 'react';
import * as $r from './_runtime';
import { DCLogic } from './_runtime';
import { SAMPLE_ACCOUNT, TalbyDates, SAMPLE_SETTINGS } from './_data';
import SSidebar from './SSidebar';
import STopbar from './STopbar';
import SAppearance from './SAppearance';
import SPraise from './SPraise';
import SAddDeal from './SAddDeal';
import SCommand from './SCommand';
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
      sec: (function () { var s = null; try { s = window.localStorage.getItem('talby.settingsTab'); window.localStorage.removeItem('talby.settingsTab'); } catch (e) {} var ok = ['account', 'appearance', 'notifications', 'connections', 'billing']; return ok.indexOf(s) !== -1 ? s : (ok.indexOf(props.tab) !== -1 ? props.tab : 'account'); })(),
      secFor: props.tab || '', secSheet: false,
      name: (props.account || SAMPLE_ACCOUNT).displayName, handle: (props.account || SAMPLE_ACCOUNT).handle, savedName: (props.account || SAMPLE_ACCOUNT).displayName, savedHandle: (props.account || SAMPLE_ACCOUNT).handle, pw1: '', pw2: '', draftLook: null,
      dlg: '', confirm: '', prefs: { inapp: true, digest: false, overdue: true, posts: true }, savedPrefs: { inapp: true, digest: false, overdue: true, posts: true },
      notionS: props.notion || (props.data && props.data.notion ? (props.data.notion.status === 'none' ? 'off' : props.data.notion.status) : 'connected'), notionFor: props.notion || '',
      pvBrand: 'Lumen and Lark', pvCheck: false, pvSwitch: true, pvTab: 'month',
      photo: (props.account && props.account.photoUrl) || '', photoBusy: false, photoErr: '', photoPending: '', pwTouched: false, pwWrong: false, pwBusy: false, profBusy: false, prefBusy: false, discBusy: false, dlgBusy: false, dlgErr: false, failed: {}
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

    this._esc = function (e) { if (e && e.key === 'Escape') { var s2 = self.state; if (s2.dlg) { if (!s2.dlgBusy) { self.setState({ dlg: '', confirm: '', dlgErr: false }); try { self._opener && self._opener.focus(); } catch (x) {} } } else if (s2.secSheet) self.setState({ secSheet: false }); } };
    try { window.addEventListener('keydown', this._esc); } catch (e) {}
  }
  componentWillUnmount() { try { window.removeEventListener('resize', this._rs); window.removeEventListener('storage', this._sg); window.removeEventListener('keydown', this._kd); } catch (e) {} try { if (this._mq) { if (this._mq.removeEventListener) this._mq.removeEventListener('change', this._mqf); else if (this._mq.removeListener) this._mq.removeListener(this._mqf); } } catch (e) {} clearTimeout(this._pz1); clearTimeout(this._pz2); clearTimeout(this._rt); (this._tt || []).forEach(clearTimeout); try { window.removeEventListener('keydown', this._esc); } catch (e) {} }
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

  // With the showErrors prop on, each action fails the first time and works on Try again, so every error state can be seen.
  failOnce(key) {
    if (!this.props.showErrors || this.state.failed[key]) return false;
    var f = Object.assign({}, this.state.failed); f[key] = true; this.setState({ failed: f });
    return true;
  }
  later(fn, ms) { this._tt = this._tt || []; this._tt.push(setTimeout(fn, ms)); }
  uploadPhoto(url) {
    var self = this;
    this.setState({ photoBusy: true, photoErr: '', photoPending: url });
    this.later(function () {
      if (self.failOnce('photo')) { self.setState({ photoBusy: false, photoErr: 'upload' }); return; }
      self.setState({ photoBusy: false, photo: url, photoPending: '' }); self.emit('photo.update', { dataUrl: url }, 'Could not update your photo'); self.toast('Photo updated', 'It shows next to your name across Talby.');
    }, 900);
  }
  saveProfileNow() {
    var self = this, s = this.state;
    this.setState({ profBusy: true });
    this.later(function () {
      if (self.failOnce('profile')) { self.setState({ profBusy: false }); self.toastErr('Could not save', 'Check your connection and try again.', function () { self.saveProfileNow(); }); return; }
      self.setState({ profBusy: false, savedName: self.state.name, savedHandle: self.state.handle }); self.emit('profile.update', { displayName: self.state.name, handle: self.state.handle }, 'Could not save'); self.toast('Profile saved', '');
    }, 600);
  }
  savePrefsNow() {
    var self = this;
    this.setState({ prefBusy: true });
    this.later(function () {
      if (self.failOnce('prefs')) { self.setState({ prefBusy: false }); self.toastErr('Could not save', 'Check your connection and try again.', function () { self.savePrefsNow(); }); return; }
      self.setState({ prefBusy: false, savedPrefs: Object.assign({}, self.state.prefs) }); self.emit('notifications.update', Object.assign({}, self.state.prefs), 'Could not save'); self.toast('Preferences saved', '');
    }, 600);
  }
  updatePwNow() {
    var self = this;
    this.setState({ pwBusy: true, pwWrong: false });
    this.later(function () {
      if (self.failOnce('password')) { self.setState({ pwBusy: false, pwWrong: true }); try { self.pwCur && self.pwCur.focus(); } catch (e) {} return; }
      self.emit('password.update', { current: self.state.pw1, next: self.state.pw2 }, 'Could not update your password'); self.setState({ pwBusy: false, pw1: '', pw2: '', pwTouched: false }); self.toast('Password updated', 'Use it next time you log in.');
    }, 700);
  }
  disconnectNow() {
    var self = this, p = this.props;
    this.setState({ discBusy: true });
    this.later(function () {
      if (self.failOnce('notion')) { self.setState({ discBusy: false }); self.toastErr('Could not disconnect', 'Check your connection and try again.', function () { self.disconnectNow(); }); return; }
      self.setState({ discBusy: false, notionS: 'off', notionFor: p.notion || '' }); self.emit('notion.disconnect', {}, 'Could not disconnect Notion'); self.toast('Notion disconnected', 'Deals you already imported stay in Talby.');
    }, 600);
  }
  deleteNow() {
    var self = this;
    this.setState({ dlgBusy: true, dlgErr: false });
    this.later(function () {
      if (self.failOnce('delete')) { self.setState({ dlgBusy: false, dlgErr: true }); return; }
      var kind = self.state.dlg === 'data' ? 'data.deleteAll' : 'account.delete';
      self.setState({ dlgBusy: false, dlg: '', confirm: '' });
      if (typeof self.props.onAction === 'function') self.emit(kind, {}, 'Could not delete'); else self.toast('Demo only', 'Nothing was deleted.');
      try { self._opener && self._opener.focus(); } catch (e) {}
    }, 900);
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
    var DATA = (p.data && typeof p.data === 'object') ? p.data : SAMPLE_SETTINGS, BILL = DATA.billing, MDY = function (iso) { return TalbyDates.md(iso) + ', ' + iso.slice(0, 4); };
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

    t.planBg = 'linear-gradient(120deg, ' + mix(t.primary, t.card, dark ? 0.14 : 0.08) + ' 0%, ' + t.card + ' 60%)';
    var SEC = [
      ['account', 'Account', 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
      ['appearance', 'Appearance', 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 2v20'],
      ['notifications', 'Notifications', 'M10.27 21a2 2 0 0 0 3.46 0M3.26 15.33A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.67C19.41 13.96 18 12.5 18 8A6 6 0 0 0 6 8c0 4.5-1.41 5.96-2.74 7.33'],
      ['connections', 'Connections', 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'],
      ['billing', 'Billing', 'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM2 10h20']
    ];
    var IDS = SEC.map(function (s) { return s[0]; });
    // The tab prop (canvas) wins until someone picks a tab; a new prop value takes over again.
    var tabP = p.tab || '', sec = st.secFor === tabP ? st.sec : (IDS.indexOf(tabP) !== -1 ? tabP : 'account');
    var nP = p.notion || '', notionS = st.notionFor === nP ? st.notionS : (nP || 'connected');
    function goSec(s) { self.setState({ sec: s, secFor: tabP, secSheet: false, nav: false }); }
    function tabS(on) { return tabStyle(t, on).replace('padding: 0 12px', 'padding: 0 14px'); }
    var THN = { studio: 'Studio', sand: 'Sand', mac: 'Mac', stationery: 'Stationery', editorial: 'Editorial' };
    var onCount = ['inapp', 'digest', 'overdue', 'posts'].filter(function (x) { return !!st.savedPrefs[x]; }).length;
    var SUM = {
      account: st.savedName + ', @' + st.savedHandle,
      appearance: (THN[L.theme] || 'Studio') + ', ' + (L.mode === 'system' ? 'matches your device' : (L.mode === 'dark' ? 'dark' : 'light')),
      notifications: onCount + ' of 4 on',
      connections: notionS === 'connected' ? 'Notion connected' : notionS === 'lost' ? 'Notion needs to reconnect' : 'Nothing connected yet',
      billing: ''
    };
    var nav = SEC.map(function (s, i) { var on = sec === s[0]; return { label: s[1], icon: s[2], on: on, cur: on ? 'page' : 'false', style: tabS(on), check: on ? 'visible' : 'hidden', rowSt: k.item + '; gap: 12px; min-height: 60px; padding: 8px 10px; font-size: 15px; background: ' + (on ? t.hv : 'transparent'),
      sum: SUM[s[0]], hasSum: !!SUM[s[0]], hasPill: s[0] === 'billing',
      pick: function () { goSec(s[0]); if (mob) { try { window.scrollTo(0, 0); } catch (e) {} } } }; });
    var cur = SEC[Math.max(0, IDS.indexOf(sec))];
    var DL = st.draftLook || L;
    var pvDark = DL.mode === 'dark' || (DL.mode === 'system' && sysDark);
    var pt = theme(DL.theme, pvDark), pk = kit(pt);
    var IN = [5000, 3000, 6000, 0, 5350, 17000, 9500, 300];
    var bars = IN.map(function (v, i) { return { h: Math.max(4, Math.round(v / 17000 * 64)) + 'px', op: v === 17000 ? '1' : '0.3', delay: (0.1 + i * 0.04).toFixed(2) + 's' }; });
    var pvTabs = [['month', 'Month'], ['agenda', 'Agenda']].map(function (x) { var on = st.pvTab === x[0]; return { label: x[1], on: on, style: tabStyle(pt, on), pick: function () { self.setState({ pvTab: x[0] }); } }; });
    var G = '#22C55E', A = '#F59E0B', Rd = '#EF4444';
    var pvBadges = [
      { label: 'Paid', fill: G, stroke: G, dash: 'none', inner: 'm8.5 12 2.5 2.5 4.5-5', innerStroke: '#FFFFFF', fg: pt.fg },
      { label: 'Invoiced', fill: 'none', stroke: A, dash: 'none', inner: 'M12 7.5v4.5l3 2', innerStroke: A, fg: pt.fg },
      { label: 'Overdue', fill: Rd, stroke: Rd, dash: 'none', inner: 'M12 7.5v5M12 16.3v.2', innerStroke: '#FFFFFF', fg: pt.destr },
      { label: 'Not invoiced', fill: 'none', stroke: pt.mutedFg, dash: '3 2.6', inner: '', innerStroke: 'none', fg: pt.mutedFg }
    ];
    var swOn = st.pvSwitch;
    var pvTrack = 'position: relative; display: inline-block; width: 32px; height: 18px; flex: 0 0 32px; border-radius: ' + (pt.r ? '9px' : '0px') + '; background: ' + (swOn ? pt.primary : pt.off) + '; transition: background-color 0.2s ease';
    var pvKnob = 'position: absolute; top: 2px; left: ' + (swOn ? '16px' : '2px') + '; width: 14px; height: 14px; border-radius: ' + (pt.r ? '7px' : '0px') + '; background: ' + (swOn ? pt.primaryFg : (pvDark ? pt.fg : '#FFFFFF')) + '; box-shadow: 0 1px 2px rgba(0,0,0,0.2); transition: left 0.2s cubic-bezier(.4,0,.2,1)';
    var profDirty = st.name !== st.savedName || st.handle !== st.savedHandle;
    var PREFS = [
      ['inapp', 'In-app notifications', 'The bell shows what is happening today.'],
      ['digest', 'Daily digest', 'A morning email with only what you have that day: payments, deliverables, posts and dated to-dos.'],
      ['overdue', 'Overdue payment alerts', 'An email the day a payment goes late, with a reminder drafted for you to send.'],
      ['posts', 'Post reminders', 'A heads up the day before something is due to go live.']
    ];
    var prefs = PREFS.map(function (x, j) { var on = !!st.prefs[x[0]]; return { label: x[1], desc: x[2], on: on, box: box(t, on), line: j ? '1px solid ' + t.line : 'none', radius: j === 0 ? (t.rTile + ' ' + t.rTile + ' 0 0') : (j === PREFS.length - 1 ? ('0 0 ' + t.rTile + ' ' + t.rTile) : '0'), toggle: function () { var n2 = Object.assign({}, self.state.prefs); n2[x[0]] = !n2[x[0]]; self.setState({ prefs: n2 }); } }; });
    var prefDirty = PREFS.some(function (x) { return !!st.prefs[x[0]] !== !!st.savedPrefs[x[0]]; });
    var pwOk = (st.pw1 || '').length > 0 && (st.pw2 || '').length >= 8;
    var pw2n = (st.pw2 || '').length, pwShort = st.pwTouched && pw2n > 0 && pw2n < 8;
    var match = (st.confirm || '').trim() === 'DELETE';
    var isData = st.dlg === 'data';
    // Billing: one card layout for every plan state, only the words, pill and button change.
    var PLANS = {
      active: { pill: 'Active', pBg: t.okBg, pFg: t.okFg, line: '$9 a month. Next payment on ' + TalbyDates.md(BILL.nextPaymentOn) + '.', cta: 'Change plan', primary: false, tileBg: t.primary, tileFg: t.primaryFg, meter: false },
      trial: { pill: 'Free trial', pBg: t.fill, pFg: t.fg, line: ACC.trial.daysLeft + (ACC.trial.daysLeft === 1 ? ' day left' : ' days left') + '. Your trial ends on ' + TalbyDates.md(ACC.trial.endsOn) + ', then it is $9 a month.', cta: 'Upgrade', primary: true, tileBg: t.primary, tileFg: t.primaryFg, meter: true },
      pastdue: { pill: 'Past due', pBg: t.warnBg, pFg: t.warnFg, line: 'Your last payment did not go through. Update your card by ' + TalbyDates.md(ACC.pastDueBy) + ' to keep adding and changing deals.', cta: 'Update card', primary: true, tileBg: t.primary, tileFg: t.primaryFg, meter: false },
      canceled: { pill: 'Canceled', pBg: t.fill, pFg: t.mutedFg, line: 'Your access ended on ' + TalbyDates.md(BILL.endedOn) + '. Everything you added is safe. Restart to add or change deals.', cta: 'Restart plan', primary: true, tileBg: t.fill, tileFg: t.mutedFg, meter: false },
      readonly: { pill: 'Trial ended', pBg: t.fill, pFg: t.mutedFg, line: 'You can still see everything. Upgrade to add or change deals.', cta: 'Upgrade', primary: true, tileBg: t.fill, tileFg: t.mutedFg, meter: false }
    };
    var pl = PLANS[plan] || PLANS.active; pl.outline = !pl.primary; pl.dot = plan === 'trial' ? t.accent : 'currentColor';
    var noCard = p.data ? !BILL.card : (plan === 'trial' || plan === 'readonly');
    var pm = noCard ? { has: false, none: true, title: 'No card yet', sub: plan === 'trial' ? 'Add one to keep Talby after ' + TalbyDates.md(ACC.trial.endsOn) + '.' : 'Add one to upgrade and pick up where you left off.', subFg: t.mutedFg, cta: 'Add card' }
      : { has: true, none: false, title: (BILL.card ? BILL.card.brand + ' ending in ' + BILL.card.last4 : ''), sub: plan === 'pastdue' ? 'The ' + TalbyDates.md(BILL.declinedOn) + ' payment was declined.' : 'Expires ' + (BILL.card ? BILL.card.exp : ''), subFg: plan === 'pastdue' ? t.warnFg : t.mutedFg, cta: 'Update' };
    var IVA = p.data ? BILL.invoices : null;
    var IVD = IVA ? IVA.map(function (x) { return MDY(x.date); }) : plan === 'canceled' ? ['Sep 2, 2026', 'Aug 2, 2026', 'Jul 2, 2026'] : noCard ? [] : ['Oct 2, 2026', 'Sep 2, 2026', 'Aug 2, 2026'];
    var invoices = IVD.map(function (d, i) { var due = plan === 'pastdue' && i === 0; return { date: d, amount: '$' + (IVA ? IVA[i].amount : 9).toFixed(2), url: IVA ? IVA[i].url || '' : '', aria: 'Download invoice for ' + d, rowStyle: i ? k.rowT : k.row, pill: due ? 'Past due' : 'Paid', pBg: due ? t.warnBg : t.okBg, pFg: due ? t.warnFg : t.okFg }; });
    var IVF = { active: 'You keep read only access to your data if you cancel.', pastdue: 'You keep read only access to your data if you cancel.', trial: 'Nothing is charged until you upgrade.', canceled: 'Your data stays safe. Restart any time to pick up where you left off.', readonly: 'Your data stays safe. Upgrade any time to pick up where you left off.' };
    function demoBill() { if (typeof p.onAction === 'function') { self.emit('billing.open', { plan: plan }, 'Could not open billing'); return; } if (self.failOnce('billing')) { self.toastErr('Could not open billing', 'Check your connection and try again.', function () { self.toast('Demo only', 'Billing opens in Stripe in the real app.'); }); return; } self.toast('Demo only', 'Billing opens in Stripe in the real app.'); }
    function openDlg(kind) { try { self._opener = document.activeElement; } catch (e) {} self.setState({ dlg: kind, confirm: '', dlgErr: false, dlgBusy: false }); setTimeout(function () { try { self.dlgIn && self.dlgIn.focus(); } catch (e) {} }, 60); }
    function closeDlg() { if (self.state.dlgBusy) return; self.setState({ dlg: '', confirm: '', dlgErr: false }); try { self._opener && self._opener.focus(); } catch (e) {} }
    function doDelete() { if (!match || self.state.dlgBusy) return; self.deleteNow(); }
    function readPhoto(e) {
      var el = e && e.target, f = el && el.files && el.files[0]; if (!f) return;
      try { el.value = ''; } catch (x) {}
      if (f.type && !/^image\//.test(f.type)) { self.setState({ photoErr: 'type' }); return; }
      if (f.size > 5 * 1024 * 1024) { self.setState({ photoErr: 'size' }); return; }
      try { var rd = new FileReader(); rd.onerror = function () { self.setState({ photoErr: 'type' }); }; rd.onload = function () { self.uploadPhoto(rd.result); }; rd.readAsDataURL(f); } catch (x) { self.setState({ photoErr: 'upload' }); }
    }
    var PHERR = { upload: 'Your photo did not upload. Check your connection and try again.', size: 'That photo is over 5 MB. Pick a smaller one.', type: 'That file is not a photo. Use a JPG, PNG or HEIC.' };
    var sheetR = t.rDialog + ' ' + t.rDialog + ' 0 0';
    var fieldCtl = k.input + '; height: 40px; font-size: 16px';
    // Loading skeletons per tab.
    function rowSk(o) { return Object.assign({ lead: false, leadSt: '', two: false, b2: '', ctl: false, ctlSt: '' }, o); }
    function fieldSk(i) { return rowSk({ st: mob ? 'display: flex; flex-direction: column; align-items: stretch; gap: 10px; padding: 14px; box-sizing: border-box' + (i ? '; border-top: 1px solid ' + t.line : '') : (i ? k.rowT : k.row), b1: sk(['96px', '120px', '64px'][i % 3], '12px'), ctl: true, ctlSt: mob ? sk('100%', '40px', t.rCtl) : sk('300px', '36px', t.rCtl) + '; flex: 0 1 300px; width: auto' }); }
    function cardSk(o) { return Object.assign({ ident: false, head: true, hw: sk('120px', '14px'), sw: sk(mob ? '70%' : '240px', '11px'), plan: false, hasTiles: false, tiles: [], tileCols: '', hasRows: false, rows: [], foot: false }, o); }
    var SK = {
      account: [cardSk({ ident: true, hasRows: true, rows: [0, 1, 2].map(fieldSk), foot: true }), cardSk({ hasRows: true, rows: [0, 1].map(fieldSk), foot: true }), cardSk({ hasRows: true, rows: [0, 1].map(function (i) { return rowSk({ st: i ? k.rowT : k.row, b1: sk('120px', '12px'), two: true, b2: sk('80%', '10px'), ctl: !mob, ctlSt: sk('110px', '32px', t.rCtl) }); }) })],
      appearance: [cardSk({ hasTiles: true, tileCols: mob ? 'repeat(2, minmax(0, 1fr))' : 'repeat(auto-fit, minmax(116px, 1fr))', tiles: [0, 1, 2, 3, 4].map(function () { return { st: sk('100%', '118px', t.rTile) }; }), foot: true }), cardSk({ hasTiles: true, tileCols: mob ? 'minmax(0, 1fr)' : 'repeat(auto-fit, minmax(240px, 1fr))', tiles: [0, 1, 2].map(function () { return { st: sk('100%', '170px', t.rTile) }; }) })],
      notifications: [cardSk({ hasRows: true, rows: [0, 1, 2, 3].map(function (i) { return rowSk({ st: i ? k.rowT : k.row, lead: true, leadSt: sk('16px', '16px', t.rBox), b1: sk(['150px', '110px', '170px', '120px'][i], '12px'), two: true, b2: sk(['70%', '85%', '75%', '60%'][i], '10px') }); }), foot: true })],
      connections: [cardSk({ hasRows: true, rows: [rowSk({ st: k.row, lead: true, leadSt: sk('40px', '40px', t.rTile), b1: sk('140px', '12px'), two: true, b2: sk('60%', '10px'), ctl: !mob, ctlSt: sk('220px', '32px', t.rCtl) })] })],
      billing: [cardSk({ head: false, plan: true }), cardSk({ hasRows: true, rows: [rowSk({ st: k.row, lead: true, leadSt: sk('44px', '30px', '6px'), b1: sk('150px', '12px'), two: true, b2: sk('90px', '10px'), ctl: true, ctlSt: sk('64px', '28px', t.rCtl) })] }), cardSk({ hasRows: true, rows: [0, 1, 2].map(function (i) { return rowSk({ st: i ? k.rowT : k.row, b1: sk('96px', '12px'), two: true, b2: sk('150px', '10px'), ctl: true, ctlSt: sk(mob ? '80px' : '130px', '14px') }); }) })]
    };
    var ERR = { account: 'We could not load your profile', appearance: 'We could not load your settings', notifications: 'We could not load your notification settings', connections: 'We could not load your connections', billing: 'We could not load your billing details' };
    var live = !isLoading && !isError;
    var page = {
      minH: mob ? '100vh' : '1400px', cardPad: mob ? '16px' : '20px 24px 24px',
      headPad: mob ? '18px 16px 14px' : '20px 24px 16px', bodyPad: mob ? '0 12px 12px' : '0 16px 16px', footPad: mob ? '12px 16px' : '14px 24px', apHeadPad: mob ? '18px 16px 0' : '20px 24px 0',
      delPad: mob ? '18px 12px 12px' : '20px 16px 16px', planPad: mob ? '18px 16px' : '22px 24px', planGap: mob ? '14px' : '18px',
      nav: nav, isAppearance: live && sec === 'appearance', isAccount: live && sec === 'account', isNotifications: live && sec === 'notifications', isConnections: live && sec === 'connections', isBilling: live && sec === 'billing',
      tabKey: function (e) { var i = IDS.indexOf(sec), n = -1; if (e.key === 'ArrowRight') n = (i + 1) % IDS.length; else if (e.key === 'ArrowLeft') n = (i + IDS.length - 1) % IDS.length; else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = IDS.length - 1; if (n < 0) return; if (e.preventDefault) e.preventDefault(); var el = e.currentTarget; goSec(IDS[n]); setTimeout(function () { try { el.querySelectorAll('[role=tab]')[n].focus(); } catch (x) {} }, 20); },
      secLabel: cur[1], secIcon: cur[2], secAria: 'Settings section: ' + cur[1] + '. Show all sections',
      secSheetOn: mob && st.secSheet, openSecSheet: function () { self.setState({ secSheet: true }); }, closeSecSheet: function () { self.setState({ secSheet: false }); },
      sheetBox: 'position: absolute; left: 0; right: 0; bottom: 0; max-height: 86vh; overflow-y: auto; display: flex; flex-direction: column; padding: 8px 12px 24px; box-sizing: border-box; background: ' + t.card + '; color: ' + t.fg + '; border: 1px solid ' + t.border + '; border-bottom: none; border-radius: ' + sheetR + '; box-shadow: ' + t.shPop,
      sheetGrip: 'display: block; flex: 0 0 4px; width: 36px; height: 4px; margin: 0 auto 12px; border-radius: 2px; background: ' + t.borderStrong,
      sheetRow: k.item + '; gap: 12px; min-height: 60px; padding: 8px 10px; font-size: 15px',
      goTab: function (s) { goSec(s); },
      saveLook: function (d) { self.setLook('all', d); self.setState({ draftLook: null }); self.toast('Appearance saved', 'Every page in Talby now uses it.'); },
      setDraftLook: function (d) { self.setState({ draftLook: d }); },
      pt: pt, pk: pk, pvFam: pt.titleFam, pvDot: st.draftLook ? '#F59E0B' : '#22C55E', pvNote: st.draftLook ? 'Showing your unsaved changes' : 'Matches what you have saved',
      bars: bars, pvTabs: pvTabs, pvBadges: pvBadges, pvBrand: st.pvBrand, setPvBrand: function (e) { self.setState({ pvBrand: e.target.value }); },
      pvCreate: function () { self.toast('This is a preview', 'Nothing was created.'); },
      pvCheck: st.pvCheck, pvBox: box(pt, st.pvCheck), togglePvCheck: function () { self.setState({ pvCheck: !st.pvCheck }); },
      pvSwitch: swOn, pvTrack: pvTrack, pvKnob: pvKnob, togglePvSwitch: function () { self.setState({ pvSwitch: !st.pvSwitch }); },
      // Account: one column fields on phone.
      fRow: mob ? 'position: relative; display: flex; flex-direction: column; align-items: stretch; gap: 8px; padding: 12px 14px; box-sizing: border-box' : k.row,
      fRowT: mob ? 'position: relative; display: flex; flex-direction: column; align-items: stretch; gap: 8px; padding: 12px 14px; box-sizing: border-box; border-top: 1px solid ' + t.line : k.rowT,
      fLabel: mob ? 'font-size: 13px; font-weight: 500; color: ' + t.mutedFg : k.rowLabel,
      fCtl: mob ? fieldCtl : k.ctlW, inFs: mob ? '16px' : '14px',
      email: ACC.email, initial: (st.savedName || ACC.displayName || 'T').replace(/[^A-Za-z]/g, '').charAt(0).toUpperCase() || 'T',
      emailSt: mob ? 'min-width: 0; font-size: 15px; color: ' + t.fg + '; white-space: nowrap; overflow: hidden; text-overflow: ellipsis' : 'flex: 0 1 300px; min-width: 0; color: ' + t.mutedFg + '; text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis',
      errLine: mob ? 'display: flex; padding: 0 14px 12px; margin-top: -2px' : 'display: flex; justify-content: flex-end; padding: 0 10px 10px 14px; margin-top: -2px',
      errText: 'flex: ' + (mob ? '1 1 auto' : '0 1 300px') + '; min-width: 0; display: flex; align-items: center; gap: 6px; color: ' + t.destr + '; font-size: 13px; line-height: 1.4',
      name: st.name, handle: st.handle, savedName: st.savedName, savedHandle: st.savedHandle,
      setName: function (e) { self.setState({ name: e.target.value }); }, setHandle: function (e) { self.setState({ handle: e.target.value.replace(/^@/, '').replace(/\s/g, '') }); },
      profCancel: profDirty && !st.profBusy, profClean: !profDirty || st.profBusy, profOp: profDirty ? '1' : '0.4', profDot: profDirty ? '#F59E0B' : '#22C55E', profStatus: profDirty ? 'Unsaved changes' : 'All changes saved',
      profBusy: st.profBusy, profBtn: st.profBusy ? 'Saving' : 'Save',
      undoProfile: function () { self.setState({ name: st.savedName, handle: st.savedHandle }); },
      saveProfile: function () { if (!profDirty || st.profBusy) return; self.saveProfileNow(); },
      avatarSt: 'position: relative; width: 56px; height: 56px; flex: 0 0 56px; border-radius: 28px; background: ' + t.primary + '; color: ' + t.primaryFg + '; display: inline-flex; align-items: center; justify-content: center; font-family: ' + t.titleFam + '; font-size: 22px; font-weight: 600' + (st.photo ? '; background-image: url(' + st.photo + '); background-size: cover; background-position: center' : ''),
      photoActs: mob && st.photo ? 'display: flex; gap: 8px; width: 100%' : 'display: contents', photoRm: k.btnO + (mob ? '; flex: 1 1 0; height: 36px' : ''), photoCh: k.btnO + (mob && st.photo ? '; flex: 1 1 0; height: 36px' : ''),
      hasPhoto: !!st.photo && !st.photoBusy, noPhoto: !st.photo, photoBusy: st.photoBusy, photoBtn: st.photoBusy ? 'Uploading' : 'Change photo',
      fileRef: function (el) { self.fileEl = el; }, pickPhoto: readPhoto,
      choosePhoto: function () { if (st.photoBusy) return; self.setState({ photoErr: '' }); try { self.fileEl && self.fileEl.click(); } catch (e) {} },
      removePhoto: function () { var was = st.photo; self.setState({ photo: '' }); self.emit('photo.remove', {}, 'Could not remove your photo'); self.toast('Photo removed', '', function () { self.setState({ photo: was }); }); },
      photoErrOn: !!st.photoErr, photoErrText: PHERR[st.photoErr] || '', photoRetry: st.photoErr === 'upload' && !!st.photoPending,
      retryPhoto: function () { if (st.photoPending) self.uploadPhoto(st.photoPending); }, dismissPhoto: function () { self.setState({ photoErr: '', photoPending: '' }); },
      pw1: st.pw1, pw2: st.pw2, setPw1: function (e) { self.setState({ pw1: e.target.value, pwWrong: false }); }, setPw2: function (e) { self.setState({ pw2: e.target.value }); },
      blurPw2: function () { if ((self.state.pw2 || '').length) self.setState({ pwTouched: true }); },
      pwCurErr: st.pwWrong, pwShort: pwShort, pwShortText: 'Use at least 8 characters. ' + (8 - pw2n) + ' more to go.',
      pw1St: (mob ? fieldCtl : k.ctlW) + (st.pwWrong ? '; box-shadow: inset 0 0 0 1px ' + t.destr : ''),
      pw2St: (mob ? fieldCtl : k.ctlW) + (pwShort ? '; box-shadow: inset 0 0 0 1px ' + t.destr : ''),
      pwBtnSt: k.btnP + (mob ? '; width: 100%; height: 40px' : ''),
      pwOff: !pwOk || st.pwBusy, pwOp: pwOk ? '1' : '0.4', pwBusy: st.pwBusy, pwBtn: st.pwBusy ? 'Updating' : 'Update password',
      updatePw: function () { if (st.pwBusy) return; if (!pwOk) { if (pw2n > 0) self.setState({ pwTouched: true }); return; } self.updatePwNow(); },
      delBtnO: k.btnO + (mob ? '; width: 100%; height: 40px' : ''), delBtnD: k.btnD + (mob ? '; width: 100%; height: 40px' : ''),
      askData: function () { openDlg('data'); }, askAccount: function () { openDlg('account'); },
      dlgOpen: !!st.dlg, dlgTitle: isData ? 'Delete all your data?' : 'Delete your account?',
      dlgDesc: isData ? 'Every deal, payment, event, idea, to-do and file goes away for good. Your login and plan stay.' : 'Your account and everything in it goes away for good. Your plan is canceled and you are signed out.',
      dlgAction: st.dlgBusy ? 'Deleting' : (st.dlgErr ? 'Try again' : (isData ? 'Delete my data' : 'Delete my account')),
      dlgErr: st.dlgErr, dlgErrText: isData ? 'We could not delete your data. Nothing was removed. Check your connection and try again.' : 'We could not delete your account. Nothing was removed. Check your connection and try again.',
      dlgBusy: st.dlgBusy, dlgRef: function (el) { self.dlgIn = el; },
      dlgLayer: 'position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 80; display: flex; align-items: ' + (mob ? 'flex-end' : 'center') + '; justify-content: center; padding: ' + (mob ? '0' : '16px') + '; box-sizing: border-box',
      dlgCls: mob ? 'a-up' : 'a-pop',
      dlgBox: 'position: relative; width: ' + (mob ? '100%' : '460px') + '; max-width: 100%; box-sizing: border-box; display: flex; flex-direction: column; background: ' + t.card + '; color: ' + t.fg + '; border: 1px solid ' + t.border + '; border-radius: ' + (mob ? sheetR + '; border-bottom: none' : t.rDialog) + '; box-shadow: ' + t.shPop + '; overflow: hidden',
      dlgBodyPad: mob ? '22px 16px 16px' : '24px 24px 16px', dlgFootPad: mob ? '12px 16px 20px' : '14px 24px 18px', dlgBtnX: mob ? '; flex: 1 1 0; height: 40px' : '',
      dlgInput: k.input + (mob ? '; height: 40px; font-size: 16px' : ''),
      confirm: st.confirm, setConfirm: function (e) { if (self.state.dlgBusy) return; self.setState({ confirm: e.target.value, dlgErr: false }); }, noMatch: !match || st.dlgBusy, matchOp: match ? '1' : '0.4',
      confirmKey: function (e) { if (e.key === 'Enter') { if (e.preventDefault) e.preventDefault(); doDelete(); } },
      closeDlg: closeDlg, doDelete: doDelete,
      prefs: prefs, prefCancel: prefDirty && !st.prefBusy, prefClean: !prefDirty || st.prefBusy, prefOp: prefDirty ? '1' : '0.4', prefDot: prefDirty ? '#F59E0B' : '#22C55E', prefStatus: prefDirty ? 'Unsaved changes' : 'All changes saved',
      prefBusy: st.prefBusy, prefBtn: st.prefBusy ? 'Saving' : 'Save',
      undoPrefs: function () { self.setState({ prefs: Object.assign({}, st.savedPrefs) }); },
      savePrefs: function () { if (!prefDirty || st.prefBusy) return; self.savePrefsNow(); },
      notionOn: notionS === 'connected', notionLost: notionS === 'lost', notionOff: notionS === 'off',
      notionLabel: notionS === 'connected' ? 'Connected' : notionS === 'lost' ? 'Connection lost' : 'Not connected',
      notionSub: notionS === 'connected' ? DATA.notion.database + ' syncs into Talby.' : notionS === 'lost' ? 'Talby lost access to ' + DATA.notion.database + '.' : 'Bring in the deals you track in Notion.',
      notionBg: notionS === 'connected' ? t.okBg : notionS === 'lost' ? t.warnBg : t.fill, notionFg: notionS === 'connected' ? t.okFg : notionS === 'lost' ? t.warnFg : t.mutedFg,
      actS: k.btnS + (mob ? '; flex: 1 1 0; height: 40px' : ''), actO: k.btnO + (mob ? '; flex: 1 1 0; height: 40px' : ''), actP: k.btnP + (mob ? '; flex: 1 1 0; height: 40px' : ''),
      planO: k.btnO + (mob ? '; width: 100%; height: 40px' : ''), planP: k.btnP + (mob ? '; width: 100%; height: 40px' : ''),
      dlgCancel: k.btnO + (mob ? '; flex: 1 1 0; height: 40px' : ''),
      connActs: mob ? 'display: flex; gap: 8px; width: 100%' : 'display: contents', actX: mob ? '; flex: 1 1 0; height: 40px' : '',
      discBusy: st.discBusy,
      importNotion: function () { self.setState({ add: 'notion' }); },
      disconnect: function () { if (st.discBusy) return; self.disconnectNow(); },
      connect: function () { self.setState({ add: 'notion' }); },
      pl: pl, pm: pm, planBtnX: mob ? '; width: 100%; height: 40px' : '',
      invoices: invoices, noInvoices: invoices.length === 0, ivNone: plan === 'trial' ? 'Your first one shows up here when your plan starts.' : 'Your first one shows up here after you upgrade.',
      ivFoot: IVF[plan] || IVF.active, ivCancel: plan === 'active' || plan === 'pastdue',
      ivDateRow: mob ? 'display: flex; align-items: center; gap: 8px; min-width: 0' : 'display: contents', icoDl: k.icoS + (mob ? '; width: 36px; height: 36px; margin-right: -6px' : ''),
      demoBill: demoBill,
      skCards: SK[sec] || SK.appearance, skTile48: sk('48px', '48px', t.rTile), skPlan1: sk('180px', '16px'), skPlan2: sk(mob ? '90%' : '260px', '11px'), skBtn: sk(mob ? '100%' : '110px', mob ? '40px' : '32px', t.rCtl),
      skIdPad: mob ? '0 20px 14px' : '0 24px 14px', skAv: sk('56px', '56px', '28px'), skN1: sk('96px', '13px'), skN2: sk('80px', '11px'), skPhoto: sk('120px', '32px', t.rCtl),
      skFoot: sk('110px', '11px'), skSave: sk('64px', '32px', t.rCtl),
      setErr: blk('error', IC.wifi, ERR[sec] || ERR.appearance, 'Check your connection and try again. Nothing was lost.', 'Try again', function () { self.retryLoad(); })
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
      onCreated: function (info) { self.setState({ add: '' }); self.celebrate(info || {}); if (info) self.emit(info.kind === 'deal' ? 'deal.create' : 'deals.import', info, info.kind === 'deal' ? 'Could not save the deal' : 'Could not import the deals'); if (st.add === 'notion') self.setState({ notionS: 'connected', notionFor: p.notion || '' }); },
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
    out.chatHidden = st.appear || st.nav || st.cmd || !!st.add || !!(st.dlg || (mob && st.secSheet));
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
              <SSidebar account={$s0?.account} active={"settings"} color={$s0?.eff} dark={$s0?.dark} collapsed={$s0?.collapsed} plan={$s0?.plan} fresh={$s0?.sbFresh} onSettings={$s0?.goTab} />
            </div>
          </div>
        </>) : null}
        <main {...S(`flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 16px; padding: ${I($s0?.mainPad)}; box-sizing: border-box`)}>
          <STopbar account={$s0?.account} title={"Settings"} mobile={$s0?.mob} quiet={$s0?.quietBell} color={$s0?.eff} dark={$s0?.dark} onNav={$s0?.toggleNav} onSearch={$s0?.openCmd} onAppearance={$s0?.openAppear} onAdd={$s0?.openAdd} />
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
          <div {...S("width: 100%; display: flex; flex-direction: column; gap: 16px")}>
            <div className={"a-in"} {...S("display: flex; flex-direction: column; gap: 4px; padding: 0 4px")}>
              <h1 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: ${I($s0?.h1Fs)}; font-weight: 600; letter-spacing: ${I($s0?.t?.hTrack)}; text-transform: ${I($s0?.t?.hCase)}; line-height: 1.15`)}>
                {"Settings"}
              </h1>
              <p {...S(`margin: 0; color: ${I($s0?.t?.mutedFg)}`)}>
                {"Your account, how Talby looks, what it tells you, and your plan."}
              </p>
            </div>
            {$s0?.notMob ? (<>
              <div role={"tablist"} aria-label={"Settings sections"} className={"a-in"} onKeyDown={$s0?.tabKey} {...S(`animation-delay: 0.04s; align-self: flex-start; max-width: 100%; overflow-x: auto; ${I($s0?.k?.tabs)}; height: 38px`)}>
                {A($s0?.nav).map((it, i) => {
                  const $s1 = { ...$s0, "n": it, $index: i };
                  return (<React.Fragment key={i}>
                    <button className={"tb tt"} type={"button"} role={"tab"} aria-selected={$s1?.n?.on} onClick={$s1?.n?.pick} {...S($s1?.n?.style)}>
                      <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 15px")}>
                        <path d={$s1?.n?.icon} />
                      </svg>
                      {T($s1?.n?.label)}
                    </button>
                  </React.Fragment>);
                })}
              </div>
            </>) : null}
            {$s0?.mob ? (<>
              <button type={"button"} className={"tb tg a-in"} onClick={$s0?.openSecSheet} aria-haspopup={"dialog"} aria-label={$s0?.secAria} {...S(`--hv: ${I($s0?.t?.hoverCard)}; animation-delay: 0.04s; display: flex; align-items: center; gap: 12px; width: 100%; height: 52px; padding: 0 14px 0 10px; box-sizing: border-box; border: 1px solid ${I($s0?.t?.border)}; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.card)}; color: ${I($s0?.t?.fg)}; box-shadow: ${I($s0?.t?.shCard)}; font: inherit; text-align: left; cursor: pointer`)}>
                <span {...S(`width: 32px; height: 32px; flex: 0 0 32px; border-radius: ${I($s0?.t?.rItem)}; background: ${I($s0?.t?.fill)}; display: inline-flex; align-items: center; justify-content: center`)}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={$s0?.secIcon} />
                  </svg>
                </span>
                <span {...S("flex: 1 1 auto; min-width: 0; font-size: 15px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                  {T($s0?.secLabel)}
                </span>
                <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap`)}>
                  {"All sections"}
                </span>
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 16px; color: ${I($s0?.t?.mutedFg)}`)}>
                  <path d={"m7 15 5 5 5-5M7 9l5-5 5 5"} />
                </svg>
              </button>
            </>) : null}
            {$s0?.isError ? (<>
              <section role={"alert"} className={"a-fade"} {...S($s0?.k?.card)}>
                <div className={"a-fade"} {...S("display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 56px 24px; box-sizing: border-box; text-align: center")}>
                  <span {...S(`display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.setErr?.tileBg)}; color: ${I($s0?.setErr?.tileFg)}`)}>
                    <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={$s0?.setErr?.icon} />
                    </svg>
                  </span>
                  <div {...S("display: flex; flex-direction: column; align-items: center; gap: 4px; max-width: 380px")}>
                    <span {...S("font-size: 15px; font-weight: 600")}>
                      {T($s0?.setErr?.title)}
                    </span>
                    {$s0?.setErr?.hasSub ? (<>
                      <span {...S(`font-size: 13px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}`)}>
                        {T($s0?.setErr?.sub)}
                      </span>
                    </>) : null}
                  </div>
                  {$s0?.setErr?.hasCta ? (<>
                    <div {...S("display: flex; flex-wrap: wrap; justify-content: center; gap: 8px")}>
                      <button type={"button"} className={"tb tp"} onClick={$s0?.setErr?.act} {...S(`${I($s0?.k?.pSm)}; height: ${I($s0?.stH)}; flex-shrink: 0`)}>
                        {T($s0?.setErr?.cta)}
                      </button>
                      {$s0?.setErr?.has2 ? (<>
                        <button type={"button"} className={"tb tg"} onClick={$s0?.setErr?.act2} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.oSm)}; height: ${I($s0?.stH)}`)}>
                          {T($s0?.setErr?.cta2)}
                        </button>
                      </>) : null}
                    </div>
                  </>) : null}
                </div>
              </section>
            </>) : null}
            {$s0?.isLoading ? (<>
              <div role={"status"} aria-label={"Loading your settings"} {...S("display: flex; flex-direction: column; gap: 16px")}>
                {A($s0?.skCards).map((it, i) => {
                  const $s1 = { ...$s0, "c": it, $index: i };
                  return (<React.Fragment key={i}>
                    <section aria-hidden={"true"} {...S($s1?.k?.card)}>
                      {$s1?.c?.head ? (<>
                        <div {...S("padding: 20px 24px 16px; display: flex; flex-direction: column; gap: 9px")}>
                          <span className={"a-pulse"} {...S($s1?.c?.hw)} />
                          <span className={"a-pulse"} {...S($s1?.c?.sw)} />
                        </div>
                      </>) : null}
                      {$s1?.c?.ident ? (<>
                        <div {...S(`display: flex; align-items: center; gap: 14px; padding: ${I($s1?.skIdPad)}`)}>
                          <span className={"a-pulse"} {...S($s1?.skAv)} />
                          <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 8px")}>
                            <span className={"a-pulse"} {...S($s1?.skN1)} />
                            <span className={"a-pulse"} {...S($s1?.skN2)} />
                          </span>
                          <span className={"a-pulse"} {...S($s1?.skPhoto)} />
                        </div>
                      </>) : null}
                      {$s1?.c?.plan ? (<>
                        <div {...S("padding: 22px 24px; display: flex; align-items: center; gap: 18px; flex-wrap: wrap")}>
                          <span className={"a-pulse"} {...S($s1?.skTile48)} />
                          <span {...S("flex: 1 1 200px; min-width: 0; display: flex; flex-direction: column; gap: 10px")}>
                            <span className={"a-pulse"} {...S($s1?.skPlan1)} />
                            <span className={"a-pulse"} {...S($s1?.skPlan2)} />
                          </span>
                          <span className={"a-pulse"} {...S($s1?.skBtn)} />
                        </div>
                      </>) : null}
                      {$s1?.c?.hasTiles ? (<>
                        <div {...S(`padding: 4px 24px 22px; display: grid; grid-template-columns: ${I($s1?.c?.tileCols)}; gap: 14px 12px`)}>
                          {A($s1?.c?.tiles).map((it, i) => {
                            const $s2 = { ...$s1, "tl": it, $index: i };
                            return (<React.Fragment key={i}>
                              <span className={"a-pulse"} {...S($s2?.tl?.st)} />
                            </React.Fragment>);
                          })}
                        </div>
                      </>) : null}
                      {$s1?.c?.hasRows ? (<>
                        <div {...S("padding: 0 16px 16px")}>
                          <div {...S($s1?.k?.group)}>
                            {A($s1?.c?.rows).map((it, i) => {
                              const $s2 = { ...$s1, "r": it, $index: i };
                              return (<React.Fragment key={i}>
                                <div {...S($s2?.r?.st)}>
                                  {$s2?.r?.lead ? (<>
                                    <span className={"a-pulse"} {...S($s2?.r?.leadSt)} />
                                  </>) : null}
                                  <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 8px; width: 100%")}>
                                    <span className={"a-pulse"} {...S($s2?.r?.b1)} />
                                    {$s2?.r?.two ? (<>
                                      <span className={"a-pulse"} {...S($s2?.r?.b2)} />
                                    </>) : null}
                                  </span>
                                  {$s2?.r?.ctl ? (<>
                                    <span className={"a-pulse"} {...S($s2?.r?.ctlSt)} />
                                  </>) : null}
                                </div>
                              </React.Fragment>);
                            })}
                          </div>
                        </div>
                      </>) : null}
                      {$s1?.c?.foot ? (<>
                        <div {...S(`display: flex; align-items: center; gap: 8px; padding: 14px 24px; border-top: 1px solid ${I($s1?.t?.line)}`)}>
                          <span className={"a-pulse"} {...S($s1?.skFoot)} />
                          <div {...S("flex: 1 1 auto")} />
                          <span className={"a-pulse"} {...S($s1?.skSave)} />
                        </div>
                      </>) : null}
                    </section>
                  </React.Fragment>);
                })}
              </div>
            </>) : null}
            {$s0?.isAppearance ? (<>
              <section className={"a-in"} {...S(`animation-delay: 0.08s; ${I($s0?.k?.card)}`)}>
                <div {...S(`display: flex; flex-direction: column; gap: 4px; padding: ${I($s0?.apHeadPad)}`)}>
                  <h2 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 16px; font-weight: 600`)}>
                    {"Appearance"}
                  </h2>
                  <p {...S(`margin: 0; color: ${I($s0?.t?.mutedFg)}`)}>
                    {"Try things out below. Nothing changes until you save. For quick changes, use the half circle button at the top of any page."}
                  </p>
                </div>
                <SAppearance inline={true} theme={$s0?.look?.theme} mode={$s0?.look?.mode} sidebar={$s0?.look?.sidebar} dark={$s0?.dark} onSave={$s0?.saveLook} onDraft={$s0?.setDraftLook} />
              </section>
              <section className={"a-in"} {...S(`animation-delay: 0.12s; padding: ${I($s0?.cardPad)}; font-family: ${I($s0?.pt?.bodyFam)}; display: flex; flex-direction: column; gap: 16px; background: ${I($s0?.pt?.card)}; color: ${I($s0?.pt?.fg)}; border: 1px solid ${I($s0?.pt?.border)}; border-radius: ${I($s0?.pt?.rCard)}; box-shadow: ${I($s0?.pt?.shCard)}; transition: background-color 0.25s ease, color 0.25s ease`)}>
                <div {...S("display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap")}>
                  <h2 {...S(`margin: 0; font-family: ${I($s0?.pvFam)}; font-size: 16px; font-weight: 600`)}>
                    {"Preview"}
                  </h2>
                  <span {...S(`display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: ${I($s0?.pt?.mutedFg)}`)}>
                    <span {...S(`width: 7px; height: 7px; border-radius: 4px; background: ${I($s0?.pvDot)}`)} />
                    {T($s0?.pvNote)}
                  </span>
                </div>
                <div {...S("display: flex; flex-wrap: wrap; gap: 16px; align-items: stretch")}>
                  <div {...S(`flex: 1 1 240px; min-width: 0; padding: 18px; display: flex; flex-direction: column; gap: 14px; background: ${I($s0?.pt?.tile)}; border-radius: ${I($s0?.pt?.rTile)}`)}>
                    <div {...S("display: flex; align-items: center; justify-content: space-between; gap: 8px")}>
                      <span {...S($s0?.pk?.caps)}>
                        {"Booked this year"}
                      </span>
                      <span {...S($s0?.pk?.badge)}>
                        {"25 deals"}
                      </span>
                    </div>
                    <span {...S(`font-family: ${I($s0?.pt?.numFam)}; font-size: 30px; font-weight: 600; letter-spacing: ${I($s0?.pt?.nTrack)}; line-height: 1; font-variant-numeric: tabular-nums`)}>
                      {"$134,950"}
                    </span>
                    <div aria-hidden={"true"} {...S("display: flex; align-items: flex-end; gap: 6px; height: 64px")}>
                      {A($s0?.bars).map((it, i) => {
                        const $s1 = { ...$s0, "b": it, $index: i };
                        return (<React.Fragment key={i}>
                          <span className={"a-grow"} {...S(`animation-delay: ${I($s1?.b?.delay)}; flex: 1 1 0; height: ${I($s1?.b?.h)}; border-radius: ${I($s1?.pt?.rBar)}; background: ${I($s1?.pt?.primary)}; opacity: ${I($s1?.b?.op)}; transition: background-color 0.25s ease`)} />
                        </React.Fragment>);
                      })}
                    </div>
                    <span {...S(`font-size: 13px; color: ${I($s0?.pt?.mutedFg)}`)}>
                      {"Best month was August"}
                    </span>
                  </div>
                  <div {...S("flex: 1 1 240px; min-width: 0; display: flex; flex-direction: column; gap: 12px")}>
                    <label {...S("display: flex; flex-direction: column; gap: 6px")}>
                      <span {...S("font-weight: 500")}>
                        {"Brand"}
                      </span>
                      <input value={V0($s0?.pvBrand, "")} onChange={$s0?.setPvBrand} {...S($s0?.pk?.input)} />
                    </label>
                    <label {...S("display: flex; flex-direction: column; gap: 6px")}>
                      <span {...S("font-weight: 500")}>
                        {"Total amount"}
                      </span>
                      <input value={V0("$6,000", "")} readOnly={true} {...S($s0?.pk?.input)} />
                    </label>
                    <div {...S("display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px")}>
                      <button type={"button"} className={"tb tp"} onClick={$s0?.pvCreate} {...S($s0?.pk?.btnP)}>
                        {"Create deal"}
                      </button>
                      <button type={"button"} className={"tb"} {...S($s0?.pk?.btnS)}>
                        {"Save draft"}
                      </button>
                      <button type={"button"} className={"tb"} {...S($s0?.pk?.btnO)}>
                        {"Cancel"}
                      </button>
                    </div>
                  </div>
                  <div {...S("flex: 1 1 240px; min-width: 0; display: flex; flex-direction: column; gap: 14px")}>
                    <div role={"tablist"} aria-label={"Preview tabs"} {...S(`align-self: flex-start; ${I($s0?.pk?.tabs)}`)}>
                      {A($s0?.pvTabs).map((it, i) => {
                        const $s1 = { ...$s0, "pt2": it, $index: i };
                        return (<React.Fragment key={i}>
                          <button className={"tb tt"} type={"button"} role={"tab"} aria-selected={$s1?.pt2?.on} onClick={$s1?.pt2?.pick} {...S($s1?.pt2?.style)}>
                            {T($s1?.pt2?.label)}
                          </button>
                        </React.Fragment>);
                      })}
                    </div>
                    <div {...S("display: flex; gap: 6px; flex-wrap: wrap")}>
                      {A($s0?.pvBadges).map((it, i) => {
                        const $s1 = { ...$s0, "pb": it, $index: i };
                        return (<React.Fragment key={i}>
                          <span {...S(`color: ${I($s1?.pb?.fg)}; ${I($s1?.pk?.payBadge)}`)}>
                            <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("display: block; flex: 0 0 14px")}>
                              <circle cx={"12"} cy={"12"} r={"9.5"} fill={$s1?.pb?.fill} stroke={$s1?.pb?.stroke} strokeDasharray={$s1?.pb?.dash} />
                              <path d={$s1?.pb?.inner} stroke={$s1?.pb?.innerStroke} />
                            </svg>
                            {T($s1?.pb?.label)}
                          </span>
                        </React.Fragment>);
                      })}
                    </div>
                    <button type={"button"} role={"checkbox"} className={"tb"} aria-checked={$s0?.pvCheck} onClick={$s0?.togglePvCheck} {...S(`display: flex; align-items: center; gap: 10px; padding: 0; border: none; background: transparent; font: inherit; font-size: 14px; color: ${I($s0?.pt?.fg)}; text-align: left; cursor: pointer`)}>
                      <span {...S($s0?.pvBox)}>
                        {$s0?.pvCheck ? (<>
                          <svg className={"a-check"} width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={"M20 6 9 17l-5-5"} />
                          </svg>
                        </>) : null}
                      </span>
                      {"Send me a daily digest"}
                    </button>
                    <button type={"button"} role={"switch"} className={"tb"} aria-checked={$s0?.pvSwitch} onClick={$s0?.togglePvSwitch} {...S(`display: flex; align-items: center; gap: 10px; padding: 0; border: none; background: transparent; font: inherit; font-size: 14px; color: ${I($s0?.pt?.fg)}; text-align: left; cursor: pointer`)}>
                      <span {...S($s0?.pvTrack)}>
                        <span {...S($s0?.pvKnob)} />
                      </span>
                      {"Overdue payment alerts"}
                    </button>
                  </div>
                </div>
              </section>
            </>) : null}
            {$s0?.isAccount ? (<>
              <section className={"a-in"} {...S(`animation-delay: 0.08s; ${I($s0?.k?.card)}`)}>
                <div {...S(`padding: ${I($s0?.headPad)}; display: flex; flex-direction: column; gap: 4px`)}>
                  <h2 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 16px; font-weight: 600`)}>
                    {"Profile"}
                  </h2>
                  <p {...S(`margin: 0; color: ${I($s0?.t?.mutedFg)}`)}>
                    {"How you show up in Talby."}
                  </p>
                </div>
                <div {...S(`padding: ${I($s0?.bodyPad)}; display: flex; flex-direction: column; gap: 14px`)}>
                  <div {...S("position: relative; display: flex; align-items: center; gap: 14px; flex-wrap: wrap; padding: 0 8px")}>
                    <input type={"file"} accept={"image/*"} tabIndex={"-1"} aria-hidden={"true"} onChange={$s0?.pickPhoto} {...S("position: absolute; left: 0; top: 0; width: 1px; height: 1px; opacity: 0; overflow: hidden; pointer-events: none", $s0?.fileRef)} />
                    <span {...S($s0?.avatarSt)}>
                      {$s0?.noPhoto ? (<>
                        {$s0?.initial}
                      </>) : null}
                      {$s0?.photoBusy ? (<>
                        <span {...S("position: absolute; top: 0; right: 0; bottom: 0; left: 0; display: flex; align-items: center; justify-content: center; border-radius: 28px; background: rgba(0,0,0,0.45); color: #FFFFFF")}>
                          <svg className={"a-spin"} width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"} {...S("flex: 0 0 14px")}>
                            <path d={"M21 12a9 9 0 1 1-6.2-8.6"} />
                          </svg>
                        </span>
                      </>) : null}
                    </span>
                    <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                      <span {...S("font-weight: 600")}>
                        {T($s0?.savedName)}
                      </span>
                      <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                        {"@"}{T($s0?.savedHandle)}
                      </span>
                    </span>
                    <div {...S($s0?.photoActs)}>
                      {$s0?.hasPhoto ? (<>
                        <button className={"tb tg"} type={"button"} onClick={$s0?.removePhoto} {...S($s0?.photoRm)}>
                          {"Remove"}
                        </button>
                      </>) : null}
                      <button className={"tb tg"} type={"button"} onClick={$s0?.choosePhoto} aria-disabled={$s0?.photoBusy} {...S($s0?.photoCh)}>
                        {T($s0?.photoBtn)}
                      </button>
                    </div>
                  </div>
                  {$s0?.photoErrOn ? (<>
                    <div role={"alert"} className={"a-fade"} {...S(`display: flex; align-items: center; gap: 10px; padding: 8px 8px 8px 12px; box-sizing: border-box; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.badBg)}; color: ${I($s0?.t?.badFg)}; font-size: 13px; line-height: 1.4`)}>
                      <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 14px")}>
                        <path d={"M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"} />
                      </svg>
                      <span {...S("flex: 1 1 auto; min-width: 0")}>
                        {T($s0?.photoErrText)}
                      </span>
                      {$s0?.photoRetry ? (<>
                        <button className={"tb tg"} type={"button"} onClick={$s0?.retryPhoto} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.oSm)}`)}>
                          {"Try again"}
                        </button>
                      </>) : null}
                      <button className={"tb tg"} type={"button"} onClick={$s0?.dismissPhoto} aria-label={"Dismiss"} {...S(`--hv: transparent; color: ${I($s0?.t?.badFg)}; ${I($s0?.k?.icoS)}`)}>
                        <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M18 6 6 18M6 6l12 12"} />
                        </svg>
                      </button>
                    </div>
                  </>) : null}
                  <div {...S($s0?.k?.group)}>
                    <div {...S($s0?.fRow)}>
                      <label htmlFor={"pf-name"} {...S($s0?.fLabel)}>
                        {"Display name"}
                      </label>
                      <input id={"pf-name"} className={"ti"} value={V0($s0?.name, "")} onChange={$s0?.setName} {...S($s0?.fCtl)} />
                    </div>
                    <div {...S($s0?.fRowT)}>
                      <label htmlFor={"pf-handle"} {...S($s0?.fLabel)}>
                        {"Creator handle"}
                      </label>
                      <span className={"ti"} {...S(`display: flex; align-items: center; gap: 2px; ${I($s0?.fCtl)}`)}>
                        <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                          {"@"}
                        </span>
                        <input id={"pf-handle"} value={V0($s0?.handle, "")} onChange={$s0?.setHandle} {...S(`flex: 1 1 auto; min-width: 0; height: 34px; padding: 0; border: none; outline: none; background: transparent; font: inherit; font-size: ${I($s0?.inFs)}; color: ${I($s0?.t?.fg)}`)} />
                      </span>
                    </div>
                    <div {...S($s0?.fRowT)}>
                      <span {...S($s0?.fLabel)}>
                        {"Email"}
                      </span>
                      <span {...S($s0?.emailSt)}>
                        {$s0?.email}
                      </span>
                    </div>
                  </div>
                </div>
                <div {...S(`display: flex; align-items: center; gap: 8px; padding: ${I($s0?.footPad)}; border-top: 1px solid ${I($s0?.t?.line)}`)}>
                  <span {...S(`display: inline-flex; align-items: center; gap: 8px; min-width: 0; color: ${I($s0?.t?.mutedFg)}; font-size: 13px; white-space: nowrap`)}>
                    <span {...S(`width: 7px; height: 7px; flex: 0 0 7px; border-radius: 4px; background: ${I($s0?.profDot)}; transition: background-color 0.2s ease`)} />
                    {T($s0?.profStatus)}
                  </span>
                  <div {...S("flex: 1 1 auto")} />
                  {$s0?.profCancel ? (<>
                    <button type={"button"} className={"tb tg a-pop"} onClick={$s0?.undoProfile} {...S($s0?.k?.btnO)}>
                      {"Cancel"}
                    </button>
                  </>) : null}
                  <button className={"tb tp"} type={"button"} onClick={$s0?.saveProfile} aria-disabled={$s0?.profClean} {...S(`opacity: ${I($s0?.profOp)}; ${I($s0?.k?.btnP)}`)}>
                    {$s0?.profBusy ? (<>
                      <svg className={"a-spin"} width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"} {...S("flex: 0 0 14px")}>
                        <path d={"M21 12a9 9 0 1 1-6.2-8.6"} />
                      </svg>
                    </>) : null}
                    {T($s0?.profBtn)}
                  </button>
                </div>
              </section>
              <section className={"a-in"} {...S(`animation-delay: 0.12s; ${I($s0?.k?.card)}`)}>
                <div {...S(`padding: ${I($s0?.headPad)}; display: flex; flex-direction: column; gap: 4px`)}>
                  <h2 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 16px; font-weight: 600`)}>
                    {"Password"}
                  </h2>
                  <p {...S(`margin: 0; color: ${I($s0?.t?.mutedFg)}`)}>
                    {"Use at least 8 characters."}
                  </p>
                </div>
                <div {...S(`padding: ${I($s0?.bodyPad)}`)}>
                  <div {...S($s0?.k?.group)}>
                    <div {...S($s0?.fRow)}>
                      <label htmlFor={"pw-cur"} {...S($s0?.fLabel)}>
                        {"Current password"}
                      </label>
                      <input id={"pw-cur"} className={"ti"} type={"password"} value={V0($s0?.pw1, "")} onChange={$s0?.setPw1} aria-invalid={$s0?.pwCurErr} {...S($s0?.pw1St)} />
                    </div>
                    {$s0?.pwCurErr ? (<>
                      <div role={"alert"} className={"a-fade"} {...S($s0?.errLine)}>
                        <span {...S($s0?.errText)}>
                          <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 14px")}>
                            <path d={"M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"} />
                          </svg>
                          {"That is not your current password."}
                        </span>
                      </div>
                    </>) : null}
                    <div {...S($s0?.fRowT)}>
                      <label htmlFor={"pw-new"} {...S($s0?.fLabel)}>
                        {"New password"}
                      </label>
                      <input id={"pw-new"} className={"ti"} type={"password"} value={V0($s0?.pw2, "")} onChange={$s0?.setPw2} onBlur={$s0?.blurPw2} aria-invalid={$s0?.pwShort} {...S($s0?.pw2St)} />
                    </div>
                    {$s0?.pwShort ? (<>
                      <div role={"alert"} className={"a-fade"} {...S($s0?.errLine)}>
                        <span {...S($s0?.errText)}>
                          <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 14px")}>
                            <path d={"M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"} />
                          </svg>
                          {T($s0?.pwShortText)}
                        </span>
                      </div>
                    </>) : null}
                  </div>
                </div>
                <div {...S(`display: flex; justify-content: flex-end; padding: ${I($s0?.footPad)}; border-top: 1px solid ${I($s0?.t?.line)}`)}>
                  <button className={"tb tg"} type={"button"} onClick={$s0?.updatePw} aria-disabled={$s0?.pwOff} {...S(`opacity: ${I($s0?.pwOp)}; ${I($s0?.pwBtnSt)}`)}>
                    {$s0?.pwBusy ? (<>
                      <svg className={"a-spin"} width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"} {...S("flex: 0 0 14px")}>
                        <path d={"M21 12a9 9 0 1 1-6.2-8.6"} />
                      </svg>
                    </>) : null}
                    {T($s0?.pwBtn)}
                  </button>
                </div>
              </section>
              <section className={"a-in"} {...S(`animation-delay: 0.16s; padding: ${I($s0?.delPad)}; display: flex; flex-direction: column; gap: 12px; ${I($s0?.k?.card)}`)}>
                <div {...S("display: flex; flex-direction: column; gap: 4px; padding: 0 8px")}>
                  <h2 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 16px; font-weight: 600; color: ${I($s0?.t?.destr)}`)}>
                    {"Delete"}
                  </h2>
                  <p {...S(`margin: 0; color: ${I($s0?.t?.mutedFg)}`)}>
                    {"Both ask you to type DELETE first. Neither can be undone."}
                  </p>
                </div>
                <div {...S($s0?.k?.group)}>
                  <div {...S(`flex-wrap: wrap; ${I($s0?.k?.row)}`)}>
                    <span {...S("flex: 1 1 260px; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                      <span {...S("font-weight: 500")}>
                        {"Delete my data"}
                      </span>
                      <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}`)}>
                        {"Removes every deal, payment, event, idea, to-do and file. Your login, handle, theme and plan stay."}
                      </span>
                    </span>
                    <button className={"tb tg"} type={"button"} onClick={$s0?.askData} {...S(`color: ${I($s0?.t?.destr)}; ${I($s0?.delBtnO)}`)}>
                      {"Delete data"}
                    </button>
                  </div>
                  <div {...S(`flex-wrap: wrap; ${I($s0?.k?.rowT)}`)}>
                    <span {...S("flex: 1 1 260px; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                      <span {...S("font-weight: 500")}>
                        {"Delete my account"}
                      </span>
                      <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}`)}>
                        {"Removes everything above and the account itself. Your plan is canceled and you are signed out."}
                      </span>
                    </span>
                    <button type={"button"} className={"tb tp"} onClick={$s0?.askAccount} {...S($s0?.delBtnD)}>
                      {"Delete account"}
                    </button>
                  </div>
                </div>
              </section>
            </>) : null}
            {$s0?.isNotifications ? (<>
              <section className={"a-in"} {...S(`animation-delay: 0.08s; ${I($s0?.k?.card)}`)}>
                <div {...S(`padding: ${I($s0?.headPad)}; display: flex; flex-direction: column; gap: 4px`)}>
                  <h2 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 16px; font-weight: 600`)}>
                    {"Notifications"}
                  </h2>
                  <p {...S(`margin: 0; color: ${I($s0?.t?.mutedFg)}`)}>
                    {"Pick what Talby tells you about."}
                  </p>
                </div>
                <div {...S(`padding: ${I($s0?.bodyPad)}`)}>
                  <div {...S($s0?.k?.group)}>
                    {A($s0?.prefs).map((it, i) => {
                      const $s1 = { ...$s0, "pr": it, $index: i };
                      return (<React.Fragment key={i}>
                        <button type={"button"} role={"checkbox"} className={"tb tr"} aria-checked={$s1?.pr?.on} onClick={$s1?.pr?.toggle} {...S(`--hvr: ${I($s1?.t?.hoverCard)}; display: flex; align-items: flex-start; gap: 12px; width: 100%; padding: 14px; box-sizing: border-box; border: none; border-top: ${I($s1?.pr?.line)}; border-radius: ${I($s1?.pr?.radius)}; background: transparent; font: inherit; font-size: 14px; color: ${I($s1?.t?.fg)}; text-align: left; cursor: pointer`)}>
                          <span {...S(`margin-top: 2px; ${I($s1?.pr?.box)}`)}>
                            {$s1?.pr?.on ? (<>
                              <svg className={"a-check"} width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={"M20 6 9 17l-5-5"} />
                              </svg>
                            </>) : null}
                          </span>
                          <span {...S("display: flex; flex-direction: column; gap: 2px; min-width: 0")}>
                            <span {...S("font-weight: 500")}>
                              {T($s1?.pr?.label)}
                            </span>
                            <span {...S(`font-size: 13px; line-height: 1.45; color: ${I($s1?.t?.mutedFg)}`)}>
                              {T($s1?.pr?.desc)}
                            </span>
                          </span>
                        </button>
                      </React.Fragment>);
                    })}
                  </div>
                </div>
                <div {...S(`display: flex; align-items: center; gap: 8px; padding: ${I($s0?.footPad)}; border-top: 1px solid ${I($s0?.t?.line)}`)}>
                  <span {...S(`display: inline-flex; align-items: center; gap: 8px; color: ${I($s0?.t?.mutedFg)}; font-size: 13px; white-space: nowrap`)}>
                    <span {...S(`width: 7px; height: 7px; flex: 0 0 7px; border-radius: 4px; background: ${I($s0?.prefDot)}; transition: background-color 0.2s ease`)} />
                    {T($s0?.prefStatus)}
                  </span>
                  <div {...S("flex: 1 1 auto")} />
                  {$s0?.prefCancel ? (<>
                    <button type={"button"} className={"tb tg a-pop"} onClick={$s0?.undoPrefs} {...S($s0?.k?.btnO)}>
                      {"Cancel"}
                    </button>
                  </>) : null}
                  <button className={"tb tp"} type={"button"} onClick={$s0?.savePrefs} aria-disabled={$s0?.prefClean} {...S(`opacity: ${I($s0?.prefOp)}; ${I($s0?.k?.btnP)}`)}>
                    {$s0?.prefBusy ? (<>
                      <svg className={"a-spin"} width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"} {...S("flex: 0 0 14px")}>
                        <path d={"M21 12a9 9 0 1 1-6.2-8.6"} />
                      </svg>
                    </>) : null}
                    {T($s0?.prefBtn)}
                  </button>
                </div>
              </section>
            </>) : null}
            {$s0?.isConnections ? (<>
              <section className={"a-in"} {...S(`animation-delay: 0.08s; ${I($s0?.k?.card)}`)}>
                <div {...S(`padding: ${I($s0?.headPad)}; display: flex; flex-direction: column; gap: 4px`)}>
                  <h2 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 16px; font-weight: 600`)}>
                    {"Connections"}
                  </h2>
                  <p {...S(`margin: 0; color: ${I($s0?.t?.mutedFg)}`)}>
                    {"Tools that bring deals into Talby."}
                  </p>
                </div>
                <div {...S(`padding: ${I($s0?.bodyPad)}; display: flex; flex-direction: column; gap: 12px`)}>
                  <div {...S($s0?.k?.group)}>
                    <div {...S(`flex-wrap: wrap; ${I($s0?.k?.row)}`)}>
                      <span {...S(`width: 40px; height: 40px; flex: 0 0 40px; box-sizing: border-box; border-radius: ${I($s0?.t?.rTile)}; background: #FFFFFF; border: 1px solid #E5E5E5; color: #191919; display: inline-flex; align-items: center; justify-content: center; font-family: Georgia, serif; font-size: 19px; font-weight: 700`)}>
                        {"N"}
                      </span>
                      <span {...S("flex: 1 1 220px; min-width: 0; display: flex; flex-direction: column; gap: 3px")}>
                        <span {...S("display: flex; align-items: center; gap: 8px")}>
                          <span {...S("font-weight: 600")}>
                            {"Notion"}
                          </span>
                          <span {...S(`display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: 0 8px; box-sizing: border-box; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.notionBg)}; color: ${I($s0?.notionFg)}; font-size: 12px; font-weight: 500; white-space: nowrap`)}>
                            <span {...S("width: 6px; height: 6px; border-radius: 3px; background: currentColor")} />
                            {T($s0?.notionLabel)}
                          </span>
                        </span>
                        <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}`)}>
                          {T($s0?.notionSub)}
                        </span>
                      </span>
                      <div {...S($s0?.connActs)}>
                        {$s0?.notionOn ? (<>
                          <button className={"tb tg"} type={"button"} onClick={$s0?.importNotion} {...S($s0?.actS)}>
                            {"Import deals"}
                          </button>
                          <button className={"tb tg"} type={"button"} onClick={$s0?.disconnect} {...S($s0?.actO)}>
                            {$s0?.discBusy ? (<>
                              <svg className={"a-spin"} width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"} {...S("flex: 0 0 14px")}>
                                <path d={"M21 12a9 9 0 1 1-6.2-8.6"} />
                              </svg>
                            </>) : null}
                            {"Disconnect"}
                          </button>
                        </>) : null}
                        {$s0?.notionLost ? (<>
                          <button className={"tb tg"} type={"button"} onClick={$s0?.disconnect} {...S($s0?.actO)}>
                            {$s0?.discBusy ? (<>
                              <svg className={"a-spin"} width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"} {...S("flex: 0 0 14px")}>
                                <path d={"M21 12a9 9 0 1 1-6.2-8.6"} />
                              </svg>
                            </>) : null}
                            {"Disconnect"}
                          </button>
                          <button className={"tb tg"} type={"button"} onClick={$s0?.connect} {...S($s0?.actP)}>
                            {"Reconnect"}
                          </button>
                        </>) : null}
                        {$s0?.notionOff ? (<>
                          <button className={"tb tg"} type={"button"} onClick={$s0?.connect} {...S($s0?.actP)}>
                            {"Connect"}
                          </button>
                        </>) : null}
                      </div>
                    </div>
                    {$s0?.notionLost ? (<>
                      <div role={"status"} {...S(`display: flex; align-items: flex-start; gap: 10px; margin: 0 8px 8px; padding: 10px 12px; box-sizing: border-box; border-radius: ${I($s0?.t?.rItem)}; background: ${I($s0?.t?.warnBg)}; color: ${I($s0?.t?.warnFg)}; font-size: 13px; line-height: 1.45`)}>
                        <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 15px; margin-top: 1px")}>
                          <path d={"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3zM12 9v4M12 17h.01"} />
                        </svg>
                        <span>
                          {"This usually happens after a Notion password change or when the page is removed. Reconnect to keep importing. Deals you already imported stay in Talby."}
                        </span>
                      </div>
                    </>) : null}
                  </div>
                  <span {...S(`padding: 0 8px; font-size: 13px; color: ${I($s0?.t?.mutedFg)}`)}>
                    {"More connections are on the way."}
                  </span>
                </div>
              </section>
            </>) : null}
            {$s0?.isBilling ? (<>
              <section className={"a-in"} {...S(`animation-delay: 0.08s; position: relative; overflow: hidden; padding: ${I($s0?.planPad)}; display: flex; align-items: center; gap: ${I($s0?.planGap)}; flex-wrap: wrap; background: ${I($s0?.t?.planBg)}; ${I($s0?.k?.card)}`)}>
                <span {...S(`width: 48px; height: 48px; flex: 0 0 48px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.pl?.tileBg)}; color: ${I($s0?.pl?.tileFg)}; display: inline-flex; align-items: center; justify-content: center`)}>
                  <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M11.5 2.8a.6.6 0 0 1 1 0l2.6 5.3 5.8.8a.6.6 0 0 1 .3 1l-4.2 4.1 1 5.8a.6.6 0 0 1-.8.6L12 17.8l-5.2 2.7a.6.6 0 0 1-.8-.6l1-5.8-4.2-4.1a.6.6 0 0 1 .3-1l5.8-.8z"} />
                  </svg>
                </span>
                <span {...S("flex: 1 1 240px; min-width: 0; display: flex; flex-direction: column; gap: 4px")}>
                  <span {...S("display: flex; align-items: center; gap: 8px; flex-wrap: wrap")}>
                    <h2 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 18px; font-weight: 600`)}>
                      {"Talby Unlimited"}
                    </h2>
                    <span {...S(`display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: 0 8px; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.pl?.pBg)}; color: ${I($s0?.pl?.pFg)}; font-size: 12px; font-weight: 500; white-space: nowrap`)}>
                      <span {...S(`width: 6px; height: 6px; border-radius: 3px; background: ${I($s0?.pl?.dot)}`)} />
                      {T($s0?.pl?.pill)}
                    </span>
                  </span>
                  <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                    {T($s0?.pl?.line)}
                  </span>
                  {$s0?.pl?.meter ? (<>
                    <span role={"progressbar"} aria-label={"Free trial used"} aria-valuemin={"0"} aria-valuemax={"14"} aria-valuenow={"5"} {...S("display: flex; align-items: center; gap: 10px; max-width: 300px; margin-top: 6px")}>
                      <span {...S(`flex: 1 1 auto; height: 6px; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.off)}; overflow: hidden`)}>
                        <span {...S(`display: block; width: 36%; height: 6px; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.accent)}`)} />
                      </span>
                      <span {...S(`font-size: 12px; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap; font-variant-numeric: tabular-nums`)}>
                        {"Day 5 of 14"}
                      </span>
                    </span>
                  </>) : null}
                </span>
                {$s0?.pl?.outline ? (<>
                  <button type={"button"} className={"tb tg"} onClick={$s0?.demoBill} {...S($s0?.planO)}>
                    {T($s0?.pl?.cta)}
                  </button>
                </>) : null}
                {$s0?.pl?.primary ? (<>
                  <button type={"button"} className={"tb tp"} onClick={$s0?.demoBill} {...S($s0?.planP)}>
                    {T($s0?.pl?.cta)}
                  </button>
                </>) : null}
              </section>
              <section className={"a-in"} {...S(`animation-delay: 0.12s; ${I($s0?.k?.card)}`)}>
                <div {...S(`padding: ${I($s0?.headPad)}; display: flex; flex-direction: column; gap: 4px`)}>
                  <h2 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 16px; font-weight: 600`)}>
                    {"Payment method"}
                  </h2>
                  <p {...S(`margin: 0; color: ${I($s0?.t?.mutedFg)}`)}>
                    {"The card your plan is charged to."}
                  </p>
                </div>
                <div {...S(`padding: ${I($s0?.bodyPad)}`)}>
                  <div {...S($s0?.k?.group)}>
                    <div {...S($s0?.k?.row)}>
                      {$s0?.pm?.has ? (<>
                        <span {...S(`width: 44px; height: 30px; flex: 0 0 44px; box-sizing: border-box; border-radius: 6px; background: ${I($s0?.t?.fill)}; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; letter-spacing: 0.04em`)}>
                          {"VISA"}
                        </span>
                      </>) : null}
                      {$s0?.pm?.none ? (<>
                        <span {...S(`width: 44px; height: 30px; flex: 0 0 44px; box-sizing: border-box; border-radius: 6px; border: 1.5px dashed ${I($s0?.t?.borderStrong)}; color: ${I($s0?.t?.mutedFg)}; display: inline-flex; align-items: center; justify-content: center`)}>
                          <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={"M5 12h14M12 5v14"} />
                          </svg>
                        </span>
                      </>) : null}
                      <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                        <span {...S("font-weight: 500")}>
                          {T($s0?.pm?.title)}
                        </span>
                        <span {...S(`font-size: 13px; color: ${I($s0?.pm?.subFg)}`)}>
                          {T($s0?.pm?.sub)}
                        </span>
                      </span>
                      <button className={"tb tg"} type={"button"} onClick={$s0?.demoBill} {...S($s0?.k?.oSm)}>
                        {T($s0?.pm?.cta)}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              <section className={"a-in"} {...S(`animation-delay: 0.16s; ${I($s0?.k?.card)}`)}>
                <div {...S(`padding: ${I($s0?.headPad)}; display: flex; flex-direction: column; gap: 4px`)}>
                  <h2 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 16px; font-weight: 600`)}>
                    {"Invoices"}
                  </h2>
                  <p {...S(`margin: 0; color: ${I($s0?.t?.mutedFg)}`)}>
                    {"Receipts for your Talby plan."}
                  </p>
                </div>
                <div {...S(`padding: ${I($s0?.bodyPad)}`)}>
                  <div {...S($s0?.k?.group)}>
                    {A($s0?.invoices).map((it, i) => {
                      const $s1 = { ...$s0, "iv": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div {...S($s1?.iv?.rowStyle)}>
                          <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                            <span {...S($s1?.ivDateRow)}>
                              <span {...S("font-weight: 500; white-space: nowrap")}>
                                {T($s1?.iv?.date)}
                              </span>
                              {$s1?.mob ? (<>
                                <span {...S(`display: inline-flex; align-items: center; height: 20px; padding: 0 7px; border-radius: ${I($s1?.t?.rCtl)}; background: ${I($s1?.iv?.pBg)}; color: ${I($s1?.iv?.pFg)}; font-size: 12px; font-weight: 500; white-space: nowrap`)}>
                                  {T($s1?.iv?.pill)}
                                </span>
                              </>) : null}
                            </span>
                            <span {...S(`font-size: 13px; color: ${I($s1?.t?.mutedFg)}`)}>
                              {"Talby Unlimited, monthly"}
                            </span>
                          </span>
                          {$s1?.notMob ? (<>
                            <span {...S(`display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: 0 8px; border-radius: ${I($s1?.t?.rCtl)}; background: ${I($s1?.iv?.pBg)}; color: ${I($s1?.iv?.pFg)}; font-size: 12px; font-weight: 500`)}>
                              {T($s1?.iv?.pill)}
                            </span>
                          </>) : null}
                          <span {...S("width: 56px; text-align: right; font-weight: 600; font-variant-numeric: tabular-nums")}>
                            {$s1?.iv?.amount}
                          </span>
                          <button className={"tb tg"} type={"button"} onClick={$s1?.demoBill} aria-label={$s1?.iv?.aria} {...S(`--hv: ${I($s1?.t?.fill)}; ${I($s1?.icoDl)}`)}>
                            <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"} />
                            </svg>
                          </button>
                        </div>
                      </React.Fragment>);
                    })}
                    {$s0?.noInvoices ? (<>
                      <div {...S($s0?.k?.row)}>
                        <span {...S(`width: 32px; height: 32px; flex: 0 0 32px; border-radius: ${I($s0?.t?.rItem)}; background: ${I($s0?.t?.fill)}; color: ${I($s0?.t?.mutedFg)}; display: inline-flex; align-items: center; justify-content: center`)}>
                          <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h4"} />
                          </svg>
                        </span>
                        <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                          <span {...S("font-weight: 500")}>
                            {"No invoices yet"}
                          </span>
                          <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}`)}>
                            {T($s0?.ivNone)}
                          </span>
                        </span>
                      </div>
                    </>) : null}
                  </div>
                </div>
                <div {...S(`display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: ${I($s0?.footPad)}; border-top: 1px solid ${I($s0?.t?.line)}`)}>
                  <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}`)}>
                    {T($s0?.ivFoot)}
                  </span>
                  {$s0?.ivCancel ? (<>
                    <button className={"tb tg"} type={"button"} onClick={$s0?.demoBill} {...S(`color: ${I($s0?.t?.destr)}; ${I($s0?.k?.btnG)}`)}>
                      {"Cancel plan"}
                    </button>
                  </>) : null}
                </div>
              </section>
            </>) : null}
          </div>
        </main>
        {$s0?.dlgOpen ? (<>
          <div {...S($s0?.dlgLayer)}>
            <button type={"button"} aria-label={"Close"} className={"a-fade"} onClick={$s0?.closeDlg} {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; padding: 0; border: none; background: ${I($s0?.t?.overlay)}; cursor: default`)} />
            <div role={"alertdialog"} aria-modal={"true"} aria-labelledby={"dlg-title"} aria-describedby={"dlg-desc"} className={$s0?.dlgCls} {...S($s0?.dlgBox)}>
              <div {...S(`padding: ${I($s0?.dlgBodyPad)}; display: flex; flex-direction: column; gap: 16px`)}>
                <div {...S("display: flex; flex-direction: column; gap: 6px")}>
                  <h2 id={"dlg-title"} {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 18px; font-weight: 600`)}>
                    {T($s0?.dlgTitle)}
                  </h2>
                  <p id={"dlg-desc"} {...S(`margin: 0; color: ${I($s0?.t?.mutedFg)}; line-height: 1.5`)}>
                    {T($s0?.dlgDesc)}
                  </p>
                </div>
                <label {...S("display: flex; flex-direction: column; gap: 6px")}>
                  <span {...S("font-weight: 500")}>
                    {"Type DELETE to confirm"}
                  </span>
                  <input className={"ti"} value={V0($s0?.confirm, "")} onChange={$s0?.setConfirm} onKeyDown={$s0?.confirmKey} autoComplete={"off"} {...S($s0?.dlgInput, $s0?.dlgRef)} />
                </label>
                {$s0?.dlgErr ? (<>
                  <div role={"alert"} className={"a-fade"} {...S(`display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px; box-sizing: border-box; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.badBg)}; color: ${I($s0?.t?.badFg)}; font-size: 13px; line-height: 1.45`)}>
                    <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 15px; margin-top: 1px")}>
                      <path d={"M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"} />
                    </svg>
                    <span>
                      {T($s0?.dlgErrText)}
                    </span>
                  </div>
                </>) : null}
              </div>
              <div {...S(`display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: ${I($s0?.dlgFootPad)}; border-top: 1px solid ${I($s0?.t?.line)}`)}>
                <button className={"tb tg"} type={"button"} onClick={$s0?.closeDlg} aria-disabled={$s0?.dlgBusy} {...S($s0?.dlgCancel)}>
                  {"Cancel"}
                </button>
                <button type={"button"} className={"tb tp"} onClick={$s0?.doDelete} aria-disabled={$s0?.noMatch} {...S(`opacity: ${I($s0?.matchOp)}; ${I($s0?.k?.btnD)}${I($s0?.dlgBtnX)}`)}>
                  {$s0?.dlgBusy ? (<>
                    <svg className={"a-spin"} width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"} {...S("flex: 0 0 14px")}>
                      <path d={"M21 12a9 9 0 1 1-6.2-8.6"} />
                    </svg>
                  </>) : null}
                  {T($s0?.dlgAction)}
                </button>
              </div>
            </div>
          </div>
        </>) : null}
        {$s0?.secSheetOn ? (<>
          <div {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 89")}>
            <button type={"button"} aria-label={"Close"} className={"a-fade"} onClick={$s0?.closeSecSheet} {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; padding: 0; border: none; background: ${I($s0?.t?.overlay)}; cursor: default`)} />
            <div role={"dialog"} aria-label={"Settings sections"} className={"a-up"} {...S($s0?.sheetBox)}>
              <span aria-hidden={"true"} {...S($s0?.sheetGrip)} />
              <span {...S("padding: 0 10px 8px; font-weight: 600")}>
                {"Settings"}
              </span>
              {A($s0?.nav).map((it, i) => {
                const $s1 = { ...$s0, "n": it, $index: i };
                return (<React.Fragment key={i}>
                  <button className={"tb tg"} type={"button"} aria-current={$s1?.n?.cur} onClick={$s1?.n?.pick} {...S($s1?.n?.rowSt)}>
                    <span {...S(`width: 32px; height: 32px; flex: 0 0 32px; border-radius: ${I($s1?.t?.rItem)}; background: ${I($s1?.t?.fill)}; display: inline-flex; align-items: center; justify-content: center`)}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={$s1?.n?.icon} />
                      </svg>
                    </span>
                    <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 1px")}>
                      <span {...S("font-weight: 500")}>
                        {T($s1?.n?.label)}
                      </span>
                      {$s1?.n?.hasSum ? (<>
                        <span {...S(`font-size: 13px; color: ${I($s1?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                          {T($s1?.n?.sum)}
                        </span>
                      </>) : null}
                    </span>
                    {$s1?.n?.hasPill ? (<>
                      <span {...S(`display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: 0 8px; border-radius: ${I($s1?.t?.rCtl)}; background: ${I($s1?.pl?.pBg)}; color: ${I($s1?.pl?.pFg)}; font-size: 12px; font-weight: 500; white-space: nowrap`)}>
                        <span {...S(`width: 6px; height: 6px; border-radius: 3px; background: ${I($s1?.pl?.dot)}`)} />
                        {T($s1?.pl?.pill)}
                      </span>
                    </>) : null}
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 16px; visibility: ${I($s1?.n?.check)}`)}>
                      <path d={"M20 6 9 17l-5-5"} />
                    </svg>
                  </button>
                </React.Fragment>);
              })}
            </div>
          </div>
        </>) : null}
        {$s0?.drawerOpen ? (<>
          <div {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 88")}>
            <button type={"button"} aria-label={"Close menu"} className={"a-fade"} onClick={$s0?.closeNav} {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; padding: 0; border: none; background: ${I($s0?.t?.overlay)}; cursor: default`)} />
            <div className={"a-drawer"} {...S(`position: absolute; top: 0; bottom: 0; left: 0; width: 288px; max-width: 86%; overflow-y: auto; box-shadow: ${I($s0?.t?.shPop)}`)}>
              <SSidebar account={$s0?.account} active={"settings"} color={$s0?.eff} dark={$s0?.dark} drawer={true} plan={$s0?.plan} fresh={$s0?.sbFresh} onClose={$s0?.closeNav} onSettings={$s0?.goTab} />
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

export const meta = {"props":{"color":{"editor":"enum","options":["studio","sand","mac","stationery","editorial"],"default":"studio"},"dark":{"editor":"boolean","default":false},"view":{"editor":"enum","options":["sample","empty","loading","error"],"default":"sample"},"plan":{"editor":"enum","options":["active","trial","pastdue","canceled","readonly"],"default":"active"},"tab":{"editor":"enum","options":["account","appearance","notifications","connections","billing"],"default":"account"},"notion":{"editor":"enum","options":["connected","lost","off"],"default":"connected"},"showErrors":{"editor":"boolean","default":false}},"preview":{"width":1440,"height":1400}};
export default $r.defineBoard("SSettings", Component, render, CSS, meta);
