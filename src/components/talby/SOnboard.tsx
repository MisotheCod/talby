// @ts-nocheck
/* eslint-disable */
'use client';
// SOnboard: converted from design-source/boards/SOnboard.dc.html.
// Markup, inline styles and logic are carried over exactly from the board.
// The logic class below is the board's own code, unchanged.
import * as React from 'react';
import * as $r from './_runtime';
import { DCLogic } from './_runtime';
import * as TalbyApp from './_app';
import SAddDeal from './SAddDeal';

const CSS = "body, #dc-root{margin:0;font-synthesis:none}#dc-root .tb{transition:background-color .15s ease,color .15s ease,border-color .15s ease,box-shadow .18s ease,opacity .15s ease,transform .12s ease}#dc-root .tb:active{transform:scale(.97)}#dc-root .tg:hover{background-color:var(--hv)!important}#dc-root .tp:hover{opacity:.88}#dc-root .tr{transition:background-color .12s ease}#dc-root .tr:hover{background-color:var(--hvr)!important}#dc-root .tt:hover{color:var(--fg)!important}#dc-root .tc{transition:border-color .18s ease,box-shadow .2s ease,transform .2s ease}#dc-root .tc:hover{border-color:var(--bd2)!important;box-shadow:var(--shh)!important}#dc-root .tlift:hover{transform:translateY(-2px)}#dc-root .ti{transition:box-shadow .15s ease}#dc-root .ti:focus, #dc-root .ti:focus-within{box-shadow:0 0 0 2px var(--ring)!important}#dc-root .tb:focus-visible, #dc-root .tc:focus-visible, #dc-root .tr:focus-visible{outline:2px solid var(--ring);outline-offset:2px}#dc-root .a-in{animation:tIn .36s cubic-bezier(.2,.7,.2,1) backwards}#dc-root .a-fade{animation:tFade .2s ease backwards}#dc-root .a-pop{animation:tPop .22s cubic-bezier(.2,.8,.3,1) backwards}#dc-root .a-drop{animation:tDrop .16s cubic-bezier(.2,.8,.3,1) backwards}#dc-root .a-sheet{animation:tSheet .3s cubic-bezier(.2,.8,.2,1) backwards}#dc-root .a-drawer{animation:tDrawer .26s cubic-bezier(.2,.8,.2,1) backwards}#dc-root .a-up{animation:tUp .3s cubic-bezier(.2,.8,.2,1) backwards}#dc-root .a-toast{animation:tToast .3s cubic-bezier(.2,.9,.3,1.1) backwards}#dc-root .a-spin{animation:tSpin .8s linear infinite}#dc-root .a-pulse{animation:tPulse 1.6s ease-in-out infinite}#dc-root .a-ping{animation:tPing 2s ease-out infinite}#dc-root .a-check{animation:tCheck .38s cubic-bezier(.3,1.5,.5,1) backwards}#dc-root .a-strike{animation:tStrike .45s cubic-bezier(.4,0,.2,1) backwards}#dc-root .a-grow{animation:tGrow .6s cubic-bezier(.2,.8,.2,1) backwards;transform-origin:bottom center}#dc-root .a-width{animation:tWidth .7s cubic-bezier(.2,.8,.2,1) backwards;transform-origin:left center}#dc-root .a-out{animation:tOut .32s ease forwards}#dc-root .a-gone{animation:tOut .35s ease .55s forwards}#dc-root [style*=\"scrollbar-width: none\"]::-webkit-scrollbar{display:none}@keyframes tIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes tFade{from{opacity:0}to{opacity:1}}@keyframes tPop{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}@keyframes tDrop{from{opacity:0;transform:translateY(-4px) scale(.98)}to{opacity:1;transform:none}}@keyframes tSheet{from{opacity:0;transform:translateX(36px)}to{opacity:1;transform:none}}@keyframes tDrawer{from{transform:translateX(-100%)}to{transform:none}}@keyframes tUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}@keyframes tToast{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}@keyframes tSpin{to{transform:rotate(360deg)}}@keyframes tPulse{0%,100%{opacity:1}50%{opacity:.35}}@keyframes tPing{0%{box-shadow:0 0 0 0 rgba(239,68,68,.5)}70%,100%{box-shadow:0 0 0 6px rgba(239,68,68,0)}}@keyframes tCheck{0%{transform:scale(.6)}55%{transform:scale(1.18)}100%{transform:scale(1)}}@keyframes tStrike{from{background-size:0% 1.5px}to{background-size:100% 1.5px}}@keyframes tGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}@keyframes tWidth{from{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes tOut{from{opacity:1;transform:none}to{opacity:0;transform:translateX(16px)}}@media (prefers-reduced-motion:reduce){#dc-root *, #dc-root *::before, #dc-root *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}#dc-root .tz{transition:background-color .15s ease,border-color .15s ease}#dc-root .tz:hover{background-color:var(--hvz)!important;border-color:var(--bd2)!important}#dc-root input[type=range]{accent-color:var(--acc)}\n";

const Component = (() => {
class Component extends DCLogic {
  sample() { return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNGN0QyQjQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNENDk0NzMiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0idXJsKCNnKSIvPjxjaXJjbGUgY3g9IjMxOCIgY3k9Ijc4IiByPSI0NiIgZmlsbD0iI0ZDRThENiIgb3BhY2l0eT0iLjciLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjgiIHI9IjcyIiBmaWxsPSIjN0E0RTNBIi8+PHBhdGggZD0iTTc2IDQwMGM4LTk2IDYwLTE0NiAxMjQtMTQ2czExNiA1MCAxMjQgMTQ2eiIgZmlsbD0iIzdBNEUzQSIvPjwvc3ZnPg=='; }
  errState(e) {
    if (e === 'name-empty') return { step: 0, handle: '', err: 'Add your creator name to keep going.' };
    if (e === 'name-short') return { step: 0, handle: 'j', err: 'Add at least 2 letters to keep going.' };
    if (e === 'photo-type') return { step: 1, photo: '', photoErr: 'type' };
    if (e === 'photo-big') return { step: 1, photo: '', photoErr: 'big' };
    if (e === 'save') return { saveErr: true };
    return {};
  }
  constructor(props) {
    super(props);
    var STEPS = ['name', 'photo', 'theme', 'about', 'deals', 'app', 'ready'];
    var si = Math.max(0, STEPS.indexOf(props.step || 'name')), fr = !!props.frame;
    var w = 1440; try { w = window.innerWidth || 1440; } catch (e) {}
    this.state = Object.assign({
      step: si, appPhase: props.appPhase || '', handle: (fr || si > 0) ? 'junobakes' : '', err: '',
      photo: fr && si >= 1 ? this.sample() : '', aspect: 1, zoom: 130, dx: 0, dy: -8, photoErr: '',
      theme: fr && si >= 2 ? 'sand' : 'studio', mode: 'light',
      plats: fr && si >= 3 ? { TikTok: true, Instagram: true } : {}, volume: fr && si >= 3 ? '1 to 3' : '',
      way: '', brand: '', amt: '', formErr: '', deal: fr && si >= 4 ? { brand: 'Lumen and Lark', amt: 6000 } : null,
      add: '', copied: false, w: w, pvOpen: !!props.pv, saveErr: false, saving: false
    }, this.errState(props.err));
    if (this.state.step > 0 && !this.state.handle) this.state.handle = 'junobakes';
  }
  componentDidMount() {
    var me = this; this._appOff = TalbyApp.onTalbyAppChange(function () { try { me.forceUpdate(); } catch (e) {} });
    var self = this;
    this._rs = function () { try { self.setState({ w: window.innerWidth }); } catch (e) {} };
    this._kd = function (e) { if (e && e.key === 'Escape' && self.state.pvOpen) self.setState({ pvOpen: false }); };
    try { window.addEventListener('resize', this._rs); window.addEventListener('keydown', this._kd); } catch (e) {}
  }
  device() {
    var d = this.props.device;
    if (d && d !== 'auto') return d;
    return TalbyApp.device();
  }
  isInstalled() { if (this.props.installed !== undefined) return !!this.props.installed; return TalbyApp.isInstalled(); }
  installApp() { return TalbyApp.installApp(); }
  askAlerts() { return TalbyApp.askAlerts(); }
  copyLink() { return TalbyApp.copyLink(); }
  dismissInstall(where, forever) { TalbyApp.dismissInstall(where, forever); }
  componentDidUpdate(prev) {
    var p = this.props;
    if (prev.step !== p.step || prev.err !== p.err || prev.device !== p.device) {
      var si = Math.max(0, ['name', 'photo', 'theme', 'about', 'deals', 'app', 'ready'].indexOf(p.step || 'name'));
      var ch = Object.assign({ step: si, err: '', photoErr: '', saveErr: false, saving: false, appPhase: p.appPhase || '' }, this.errState(p.err));
      if (ch.step > 0 && !this.state.handle && !('handle' in ch)) ch.handle = 'junobakes';
      this.setState(ch);
    }
    if (prev.pv !== p.pv) this.setState({ pvOpen: !!p.pv });
  }
  componentWillUnmount() { try { if (this._appOff) this._appOff(); } catch (e) {} try { window.removeEventListener('resize', this._rs); window.removeEventListener('keydown', this._kd); } catch (e) {} clearTimeout(this._ct); clearTimeout(this._sv); }
  save(extra) {
    if (this.props.frame) return;
    var st = Object.assign({}, this.state, extra || {});
    try {
      window.localStorage.setItem('talby.look', JSON.stringify({ theme: st.theme, mode: st.mode, sidebar: 'expanded' }));
      window.localStorage.setItem('talby.handle', st.handle || 'junobakes');
    } catch (e) {}
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
    var PLATICON={TikTok:'data:image/png;base64,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',Instagram:'data:image/png;base64,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',YouTube:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADkklEQVR42u2ZP2gVQRDGf7N3JubFEP8QJEKUpLIIamcvdoJWhmCj2NhaWdhZaGETGyHaSBANxNJSsREbMSCCdhZGkthEVBKNee9uLHY27yJ5T593l/jgDSx37N7tft/u7MzOLHSkIx1pa5FmjerbZZNvpSQ8usm7ysb6P/YQKUT/20w3wiW/z7ZAmqnrx5fdwF6gF+gDKsAuoAvYaWUH4IBuIG6Aowb8xI+xClTtuQYsAytWloHPwBfgq8DX33ASVkVCZahQOAGcA44ABwx8pUS1aaZO343EAvAamBF4ugGzgljpUZhS0AYlVUgUalaqBZfQb2JjNcJxz7CKgqB+2VF4YB8EcEmms2YdllXSzKQlGZKqMG0EXFir09awtk1gWyG1Zu9nIDCAC6Zzsg263qrZF8N6HsCptybHrCFqA98VGdajCr0OOAjsL6Rr57aSyH5gyAGHzEzm97Bp6kmUSyRg7AWGHTAYhs/XrcDwsCeRphBFvq4cCVgHswTygQe4cwdmZpSREUgSbyuiUrfVoAP2bXKQap2Amm88e1Z49Uq5elXp6/NERIpWq4B1n7MzTnGSJLBnj3D9uvDypTI+bha8FLXa6wrbwOtGLoJazRM5fFiYnoYnT1KOH9+oVvmIhJ8rDugp3k6IBxk29MmTjhcvYHIShobqRPKvRk84/pYjwaQmiSd06RLMziqXLytdXUWQ6HaZ40SJvjOyY2INBgaEiQnh3buU0VHN6QDjeMv8ZprWh3v/XpmYcMzPm035ZwMocW4H9jfAw55YWVFu3xZu3hSWlorovRpbiFdCPJUxnaA8egTXrglv39bVKknyjvLTWUxaLPBarT7rs7Nw6hSMjXnwwYTmBw/wIwa+5fbEWScmAt3dsLCg3Lgh3L0L1aqsb9RigAes32MLmouR/n7f+a1bXs8XF4tUl83kc2zpi3yeONjzx4+VK1eE58/rwNO0DPAB6xIKFy3GTAqLXaNIVaTM2DhgvRgDi8FvFhaRlaMuG0ay57wDPlgCKf9GDmef8hNeGOaPDpgDPhVmibYmY4dpzpwTn4d8Yw3tQCA1nK8FloMu3bOdnf7nJDSTv7ofatoxtfhwHXsmuVtpMblb26bk7lQ2udtO6fU3wEOBZ1nMrV5w7LKEUq+FohWL6HbgLzli/KVH1GQDrtpzzd5X7UT8A3+58c2ejS44HM2undr2iqnBT+13ydeRjnSkveQXJps54NcuWqEAAAAASUVORK5CYII=',Facebook:'data:image/png;base64,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'};
    var self = this, p = this.props, st = this.state, fr = !!p.frame;
    var STEPS = ['name', 'photo', 'theme', 'about', 'deals', 'app', 'ready'], IDS = ['studio', 'sand', 'mac', 'stationery', 'editorial'];
    var sysDark = false; try { sysDark = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches); } catch (e) {}
    var dark = st.mode === 'dark' || (st.mode === 'system' && sysDark);
    var vwSet = !!p.vw && p.vw !== 'auto' && +p.vw > 0, W = vwSet ? +p.vw : st.w;
    var lay = fr && !vwSet ? 'frame' : (W < 600 ? 'phone' : (W < 960 ? 'stack' : 'side'));
    var phone = lay === 'phone', stack = lay === 'stack', cozy = lay === 'side' && W < 1100;
    var wrapT = phone || stack || cozy;
    var t = talby(st.theme, dark), mob = W < 768, step = st.step;
    var b = 'display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 40px; padding: 0 18px; box-sizing: border-box; font: inherit; font-size: 14px; font-weight: 500; line-height: 1; white-space: nowrap; border-radius: ' + t.rCtl + '; cursor: pointer; text-decoration: none; flex-shrink: 0';
    function tab(on) { return 'display: inline-flex; align-items: center; justify-content: center; height: 100%; padding: 0 10px; box-sizing: border-box; border: none; border-radius: ' + t.rCtl + '; background: ' + (on ? t.tabOn : 'transparent') + '; box-shadow: ' + (on ? t.tabSh : 'none') + '; color: ' + (on ? t.fg : t.mutedFg) + '; font: inherit; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer'; }
    function chip(on) { return 'display: inline-flex; align-items: center; height: 36px; padding: 0 16px; box-sizing: border-box; border: none; border-radius: ' + t.rCtl + '; background: ' + (on ? t.primary : t.fill) + '; color: ' + (on ? t.primaryFg : t.fg) + '; font: inherit; font-size: 14px; font-weight: 500; white-space: nowrap; cursor: pointer; --hv: ' + (on ? t.primary : t.fillHover); }
    var titleFs = Math.round((fr && !vwSet ? 28 : (phone ? 30 : 34)) * t.hScale);
    var h1 = 'margin: 0; font-family: ' + t.titleFam + '; font-size: ' + titleFs + 'px; font-weight: 600; letter-spacing: ' + t.hTrack + '; text-transform: ' + t.hCase + '; line-height: 1.12; white-space: nowrap';
    var sub = 'margin: 0; font-size: 16px; color: ' + t.mutedFg + '; white-space: nowrap; overflow: hidden; text-overflow: ellipsis';
    if (wrapT) {
      h1 = 'margin: 0; font-family: ' + t.titleFam + '; font-size: ' + titleFs + 'px; font-weight: 600; letter-spacing: ' + t.hTrack + '; text-transform: ' + t.hCase + '; line-height: 1.15; text-wrap: balance; overflow-wrap: anywhere';
      sub = 'margin: 0; font-size: ' + (phone ? 15 : 16) + 'px; line-height: 1.45; text-wrap: pretty; color: ' + t.mutedFg;
    }
    var btnP = b + '; border: none; background: ' + t.primary + '; color: ' + t.primaryFg + '; box-shadow: ' + t.btnSh, btnG = b + '; border: none; background: transparent; color: ' + t.fg + '; padding: 0 14px';
    var inp = 'height: 36px; min-width: 0; box-sizing: border-box; padding: 0 14px; border: none; border-radius: ' + t.rCtl + '; background: ' + t.fill + '; color: ' + t.fg + '; font: inherit; font-size: 14px; outline: none';
    var k = {
      btnP: btnP, btnG: btnG,
      btnPf: phone ? btnP + '; flex: 1 1 auto; min-width: 0; height: 44px' : btnP,
      btnGf: phone ? btnG + '; height: 44px' : btnG,
      oSm: b + '; height: 30px; padding: 0 12px; font-size: 13px; border: 1px solid ' + t.border + '; background: ' + t.card + '; color: ' + t.fg,
      input: phone ? inp + '; height: 40px; font-size: 16px' : inp,
      track: 'display: flex; align-items: center; gap: 2px; height: 38px; padding: 3px; box-sizing: border-box; border-radius: ' + t.rCtl + '; background: ' + t.fill,
      group: 'background: ' + t.card + '; border: 1px solid ' + t.border + '; border-radius: ' + t.rTile + '; box-shadow: ' + t.shCard,
      caps: 'font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: ' + t.mutedFg,
      h1: h1, sub: sub,
      avatar32: 'width: 32px; height: 32px; flex: 0 0 32px; border-radius: 16px; background: ' + t.primary + '; color: ' + t.primaryFg + '; display: inline-flex; align-items: center; justify-content: center; font-weight: 600',
      avatar28: 'width: 28px; height: 28px; flex: 0 0 28px; border-radius: 14px; background: ' + t.primary + '; color: ' + t.primaryFg + '; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600',
      icoBack: 'display: inline-flex; align-items: center; justify-content: center; flex: 0 0 36px; width: 36px; height: 36px; margin-left: -8px; padding: 0; box-sizing: border-box; border: none; border-radius: ' + t.rCtl + '; background: transparent; color: ' + t.fg + '; cursor: pointer; --hv: ' + t.hv,
      icoClose: 'display: inline-flex; align-items: center; justify-content: center; flex: 0 0 36px; width: 36px; height: 36px; margin-right: -8px; padding: 0; box-sizing: border-box; border: none; border-radius: ' + t.rCtl + '; background: transparent; color: ' + t.fg + '; cursor: pointer; --hv: ' + t.hv,
      pvBtn: 'display: inline-flex; align-items: center; gap: 6px; flex: 0 0 auto; height: 32px; padding: 0 12px; box-sizing: border-box; border: none; border-radius: ' + t.rCtl + '; background: ' + t.fill + '; color: ' + t.fg + '; font: inherit; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer; --hv: ' + t.fillHover
    };
    var handle = st.handle, clean = (handle || '').trim(), initial = (clean.replace(/^@+/, '').charAt(0) || 'T').toUpperCase();
    function go(i) { clearTimeout(self._sv); self.setState({ step: Math.max(0, Math.min(6, i)), err: '', photoErr: '', saveErr: false, saving: false, appPhase: '' }); }
    function next() {
      if (st.saving) return;
      if (step === 5 && !app.canGo) { app.primary(); return; }
      var patch = {};
      if (step === 0) {
        var h = clean.replace(/^@+/, '');
        if (!h.length) { self.setState({ err: 'Add your creator name to keep going.' }); return; }
        if (h.length < 2) { self.setState({ err: 'Add at least 2 letters to keep going.' }); return; }
        patch.handle = h;
      }
      function done() { if (step === 4 || step === 2) self.save(patch); self.setState(Object.assign(patch, { step: Math.min(6, step + 1), err: '', photoErr: '', saveErr: false, saving: false })); }
      if (st.saveErr) { self.setState({ saving: true }); clearTimeout(self._sv); self._sv = setTimeout(done, 900); return; }
      done();
    }
    function leave(e, tour) {
      if (st.saveErr || st.saving) {
        try { if (e && e.preventDefault) e.preventDefault(); } catch (x) {}
        if (st.saving) return;
        self.setState({ saving: true }); clearTimeout(self._sv);
        self._sv = setTimeout(function () { self.setState({ saving: false, saveErr: false }); self.save(); try { window.localStorage.setItem('talby.tour', tour ? '1' : '0'); window.location.href = 'SWelcome.dc.html'; } catch (x) {} }, 900);
        return;
      }
      self.save(); try { window.localStorage.setItem('talby.tour', tour ? '1' : '0'); } catch (x) {}
    }
    var photo = st.photo, hasPhoto = !!photo, asp = st.aspect || 1, pe = st.photoErr || '';
    var wPct = Math.round(st.zoom * Math.max(1, asp)), hPct = Math.round(st.zoom * Math.max(1, 1 / asp));
    function pos(scale) { return 'calc(50% + ' + Math.round(st.dx * scale) + 'px) calc(50% + ' + Math.round(st.dy * scale) + 'px)'; }
    function readFile(e) {
      var inEl = e && e.target, f = inEl && inEl.files && inEl.files[0]; if (!f) return;
      try { inEl.value = ''; } catch (x) {}
      if (f.type && !/^image\//.test(f.type)) { self.setState({ photoErr: 'type' }); return; }
      if (f.size > 10 * 1024 * 1024) { self.setState({ photoErr: 'big' }); return; }
      try {
        var rd = new FileReader();
        rd.onerror = function () { self.setState({ photoErr: 'type' }); };
        rd.onload = function () { var url = rd.result, im = new Image(); im.onload = function () { self.setState({ photo: url, aspect: im.width / Math.max(1, im.height), zoom: 100, dx: 0, dy: 0, photoErr: '' }); }; im.onerror = function () { self.setState({ photoErr: 'type' }); }; im.src = url; };
        rd.readAsDataURL(f);
      } catch (x) { self.setState({ photoErr: 'type' }); }
    }
    var PE = { type: ['We could not open that file', 'Choose a PNG or JPG photo instead.'], big: ['That photo is over 10 MB', 'Choose a smaller one and try again.'] }[pe] || ['', ''];
    var MI = { light: 'M12 3v1M12 20v1M4.2 4.2l.7.7M19.1 19.1l.7.7M3 12h1M20 12h1M4.2 19.8l.7-.7M19.1 4.9l.7-.7M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', dark: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z', system: 'M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM8 21h8M12 16v5' };
    var themes = IDS.map(function (id) {
      var x = talby(id, dark), on = st.theme === id;
      return { name: x.name, on: on, page: x.page, side: x.side, sideBorder: x.sideBorder, fg: x.fg, primary: x.primary, titleFam: x.titleFam, numFam: x.numFam,
        track: x.hCase === 'uppercase' ? '0.1em' : '0px', hcase: x.hCase, ctlR: x.ctl >= 999 ? '5px' : Math.min(x.ctl, 3) + 'px',
        edge: x.dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', ring: on ? ('0 0 0 2px ' + t.primary) : ('0 0 0 1px ' + t.border),
        radioBorder: on ? 'none' : ('1px solid ' + t.borderStrong), radioBg: on ? t.primary : 'transparent', dot: on ? 'visible' : 'hidden',
        pick: function () { self.setState({ theme: id }); } };
    });
    var modeOpts = [['light', 'Light'], ['dark', 'Dark'], ['system', 'System']].map(function (x) { var on = st.mode === x[0]; return { label: x[1], icon: MI[x[0]], on: on, style: tab(on), pick: function () { self.setState({ mode: x[0] }); } }; });
    var platOpts = ['TikTok', 'Instagram', 'YouTube', 'Facebook', 'Other'].map(function (lab) {
      var on = !!st.plats[lab];
      return { label: lab, on: on, icon: PLATICON[lab] || '', hasIcon: !!PLATICON[lab], pad: PLATICON[lab] ? '0 16px 0 10px' : '0 16px', style: chip(on),
        pick: function () { var o = Object.assign({}, st.plats); o[lab] = !on; self.setState({ plats: o }); } };
    });
    var VOL = { 'Just starting': 'No problem. Talby is just as handy for your first one.', '1 to 3': 'Nice. Talby keeps every date and payment in one spot.', '4 to 10': 'That is a lot to juggle. Talby keeps it all straight.', 'More than 10': 'Busy. Importing from a CSV or Notion will save you time.' };
    var volOpts = ['Just starting', '1 to 3', '4 to 10', 'More than 10'].map(function (v) { var on = st.volume === v; return { label: v, on: on, style: chip(on), pick: function () { self.setState({ volume: on ? '' : v }); } }; });
    var WAYS = [['manual', 'Add one by hand', 'A brand and an amount is enough to start', 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z'], ['upload', 'Upload a contract or CSV', 'Talby reads it and fills in the details', 'M12 15V3M7 8l5-5 5 5M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4'], ['notion', 'Import from Notion', 'Bring over the deals you already track', 'M5 4h10l4 4v12H5zM9 9v7M9 9l6 7V9']];
    var ways = WAYS.map(function (x, i) {
      var open = st.way === x[0];
      return { title: x[1], sub: x[2], icon: x[3], open: open ? 'true' : 'false', showForm: open && x[0] === 'manual', line: i ? '1px solid ' + t.line : 'none',
        radius: i === 0 ? (t.rTile + ' ' + t.rTile + ' 0 0') : (i === WAYS.length - 1 ? ('0 0 ' + t.rTile + ' ' + t.rTile) : '0'),
        tileBg: i === 0 ? t.primary : t.tile, tileFg: i === 0 ? t.primaryFg : t.fg, rot: open ? 'rotate(90deg)' : 'none',
        pick: function () { if (x[0] === 'manual') self.setState({ way: open ? '' : 'manual', formErr: '' }); else self.setState({ add: x[0] }); } };
    });
    var deal = st.deal, hasDeal = !!deal;
    function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
    var platList = ['TikTok', 'Instagram', 'YouTube', 'Facebook'].filter(function (x) { return st.plats[x]; }).map(function (x) { return { label: x, icon: PLATICON[x] }; });
    var hour = 18; try { hour = new Date().getHours(); } catch (e) {}
    var greet = hour < 12 ? 'Good morning' : (hour < 17 ? 'Good afternoon' : 'Good evening');
    function addManualFn() { var br = (st.brand || '').trim(), n = parseFloat((st.amt || '').replace(/,/g, '')); if (!br) { self.setState({ formErr: 'Add the brand name.' }); return; } self.setState({ deal: { brand: br, amt: isNaN(n) ? 0 : n }, way: '', brand: '', amt: '' }); }
    var showName = clean.replace(/^@+/, '') || 'there';
    var pvAvatar = 'width: 26px; height: 26px; flex: 0 0 26px; border-radius: 13px; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: ' + t.primaryFg + '; background-color: ' + t.primary + (hasPhoto ? ('; background-image: url(' + photo + '); background-repeat: no-repeat; background-size: ' + wPct + '% ' + hPct + '%; background-position: ' + pos(26 / 220) + '; color: transparent') : '');
    var NAV = ['Overview', 'Deals', 'Calendar', 'Payments', 'To-dos'];
    var HOW = [['Add deals your way', 'By hand, from a contract or CSV, or from Notion.'], ['Talby keeps track', 'Dates and money owed show up on your Overview.'], ['Ask when you need something', 'Talby Assistant answers from your own deals.']];
    // Layout pieces. side and frame keep the desktop values exactly.
    var colW = fr && !vwSet ? '460px' : (stack ? '560px' : '520px');
    var leftPad = fr && !vwSet ? '32px 44px 32px' : (cozy ? '40px 48px 40px' : '40px 64px 40px');
    var leftSt = phone ? 'flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; padding: 0 20px; box-sizing: border-box'
      : (stack ? 'flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; align-items: center; padding: 36px 48px 32px; box-sizing: border-box'
      : 'flex: 1 1 520px; min-width: 0; display: flex; flex-direction: column; padding: ' + leftPad + '; box-sizing: border-box');
    var bleed = 'box-sizing: border-box; width: calc(100% + 40px); margin: 0 -20px; background: ' + t.page + '; transition: background-color 0.3s ease';
    var hdrSt = phone ? 'position: sticky; top: 0; z-index: 5; display: flex; align-items: center; gap: 12px; min-height: 56px; padding: 10px 20px; ' + bleed
      : 'display: flex; align-items: center; gap: 16px; width: 100%; max-width: ' + colW;
    var bodySt = phone ? 'flex: 1 1 auto; display: flex; flex-direction: column; justify-content: flex-start; width: 100%; padding: 12px 0 28px'
      : 'flex: 1 1 auto; display: flex; flex-direction: column; justify-content: center; width: 100%; max-width: ' + colW + '; padding: 28px 0';
    var ftrSt = phone ? 'position: sticky; bottom: 0; z-index: 5; display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding: 12px 20px calc(12px + env(safe-area-inset-bottom, 0px)); border-top: 1px solid ' + t.line + '; ' + bleed
      : 'display: flex; align-items: center; flex-wrap: wrap; gap: 8px; width: 100%; max-width: ' + colW;
    var pvSheet = phone && st.pvOpen, pvPos = vwSet ? 'absolute' : 'fixed';
    var pvColSt = phone ? ('position: ' + pvPos + '; left: 0; right: 0; bottom: 0; z-index: 41; display: flex; justify-content: center; max-height: 92%; overflow: auto; padding: 10px 16px calc(20px + env(safe-area-inset-bottom, 0px)); box-sizing: border-box; background: ' + t.tile + '; border-radius: ' + t.rDialog + ' ' + t.rDialog + ' 0 0; box-shadow: ' + t.shPop)
      : (stack ? ('flex: 0 0 auto; display: flex; align-items: center; justify-content: center; padding: 28px 48px 40px; box-sizing: border-box; background: ' + t.tile + '; border-top: 1px solid ' + t.line + '; transition: background-color 0.3s ease')
      : ('flex: 1 1 520px; min-width: 0; display: flex; align-items: center; justify-content: center; padding: ' + (fr && !vwSet ? '32px' : (cozy ? '32px' : '48px')) + '; box-sizing: border-box; background: ' + t.tile + '; border-left: 1px solid ' + t.line + '; transition: background-color 0.3s ease'));
    var stepNow = step;
    // Get the app step. iPhone needs Talby on the Home Screen before alerts can work. Android installs in one tap.
    // In app browsers (TikTok, Instagram) cannot install. Desktop only asks for alerts.
    var dev = this.device(), ph = st.appPhase || '';
    // Already opened from the Home Screen: skip the install part and only ask for alerts.
    if (!ph && dev !== 'desktop' && this.isInstalled()) ph = 'installed';
    var ICS = { full: 'M4 4h6M4 4v6M20 4h-6M20 4v6M4 20h6M4 20v-6M20 20h-6M20 20v-6', bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0', tap: 'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM12 18h.01',
      share: 'M12 3v12M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7', plus: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM12 8v8M8 12h8', check: 'M20 6 9 17l-5-5', dots: 'M5 12h.01M12 12h.01M19 12h.01', open: 'M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6', copy: 'M8 8h12v12H8zM4 16V4h12' };
    var BEN = [[ICS.full, 'Opens full screen like a real app', 'No browser bars, just Talby.'], [ICS.bell, 'Deal and payment alerts', 'Know when a brand pays or a post is due.'], [ICS.tap, 'One tap from your Home Screen', 'Right next to your other apps.']];
    function row(x, i) { return { icon: x[0], title: x[1], sub: x[2], n: x[3] || '', isNum: !!x[3], delay: (i * 0.05).toFixed(2) + 's' }; }
    function askAlerts() { self.askAlerts().then(function (r) { self.setState({ appPhase: r === 'granted' ? 'alertsOn' : 'alertsOff' }); }); }
    var A;
    if (dev === 'inapp') A = ph === 'copied'
      ? { caps: 'Get the app', title: 'Open Talby in your browser', sub: 'Paste the link in Safari or Chrome, then add Talby to your Home Screen from there.', list: [], done: 'Link copied', label: 'Continue', canGo: true }
      : { caps: 'Get the app', title: 'Open Talby in your browser', sub: 'Apps like TikTok and Instagram open links in their own browser, which cannot add Talby to your Home Screen.',
          list: [[ICS.dots, 'Tap the menu', 'The three dots or the share icon on this screen.', '1'], [ICS.open, 'Choose Open in browser', 'It may say Open in Safari or Open in Chrome.', '2'], [ICS.plus, 'Add Talby from there', 'Or copy the link below and paste it in your browser.', '3']],
          label: 'Copy link', act: function () { self.copyLink().then(function () { self.setState({ appPhase: 'copied' }); }); } };
    else if (dev === 'iphone') A = ph === 'hint'
      ? { caps: 'Get the app', title: 'Add Talby to your Home Screen', sub: 'Safari does this part. It takes three taps.',
          list: [[ICS.share, 'Tap Share', 'The square with an arrow in Safari. On newer iPhones it is under the three dots.', '1'], [ICS.plus, 'Tap Add to Home Screen', 'Scroll down the menu if you do not see it.', '2'], [ICS.check, 'Tap Add', 'Then open Talby from your Home Screen to turn on alerts.', '3']],
          label: 'Continue', canGo: true }
      : { caps: 'Get the app', title: 'Want payment and deadline alerts?', sub: 'Add Talby to your Home Screen first. On iPhone, alerts only work from there.', list: BEN, label: 'Add to Home Screen', act: function () { self.setState({ appPhase: 'hint' }); } };
    else if (dev === 'android' && ph !== 'alertsOn' && ph !== 'alertsOff') A = ph === 'installed'
      ? { caps: 'Get the app', title: 'Turn on payment and deadline alerts', sub: 'Talby lets you know when a brand pays, a payment is late, or a post is due.', list: [], done: 'Talby is on your Home Screen', label: 'Turn on alerts', act: askAlerts }
      : { caps: 'Get the app', title: 'Get the Talby app', sub: 'Add Talby to your Home Screen, then turn on alerts for payments and post dates.', list: BEN, label: 'Add to Home Screen',
          act: function () { self.installApp().then(function (ok) { self.setState({ appPhase: ok ? 'installed' : 'installed' }); }); } };
    else A = ph === 'alertsOn'
      ? { caps: 'Alerts', title: 'Alerts are on', sub: 'Know when a brand pays or a post is due.', list: [], done: 'You will get payment and deadline alerts', label: 'Continue', canGo: true }
      : ph === 'alertsOff'
      ? { caps: 'Alerts', title: 'Alerts are off for now', sub: 'You can turn them on later in Settings.', list: [], warn: 'Alerts are blocked in this browser', label: 'Continue', canGo: true }
      : { caps: 'Alerts', title: 'Get payment and deadline alerts', sub: 'Know when a brand pays or a post is due.', list: [[ICS.bell, 'Payment alerts', 'When a brand pays, or a payment is late.'], [ICS.full, 'Deadline alerts', 'A heads up before a post or a pay by date.']], label: 'Turn on alerts', act: askAlerts };
    // Phones get a compact sheet over the ready screen instead of a full page. Laptops keep the alerts page.
    var shOn = step === 5 && dev !== 'desktop';
    if (shOn) stepNow = 6;
    function shGo() { go(6); }
    var BEN2 = [[ICS.full, 'Opens full screen, like a real app'], [ICS.bell, 'Alerts when a brand pays or a post is due'], [ICS.tap, 'One tap from your Home Screen']];
    var S = null, TIP = null;
    if (shOn) {
      if (dev === 'iphone' && ph === 'hint') TIP = { icon: ICS.share, text: 'Tap Share in Safari, then Add to Home Screen.', sub: 'Then tap Add. No Share button? Tap the three dots first.' };
      else if (dev === 'android' && ph === 'hint') TIP = { icon: ICS.dots, text: 'Tap the three dots in Chrome, then Add to Home screen.', sub: 'Then tap Install.' };
      else if (dev === 'inapp') S = ph === 'copied'
        ? { title: 'Link copied', sub: 'Paste it in Safari or Chrome, then add Talby from there.', list: [], btn: 'Done', act: shGo }
        : { title: 'Open Talby in Safari or Chrome', sub: 'TikTok and Instagram cannot add apps to your Home Screen.', list: [['', 'Tap the three dots or the share icon', '1'], ['', 'Choose Open in browser', '2'], ['', 'Add Talby from there', '3']],
            btn: 'Copy link', act: function () { self.copyLink().then(function () { self.setState({ appPhase: 'copied' }); }); }, later: true };
      else if (ph === 'alertsOn') S = { title: 'Alerts are on', sub: 'Talby will let you know when a brand pays or a post is due.', list: [], btn: 'Done', act: shGo };
      else if (ph === 'alertsOff') S = { title: 'Alerts are off for now', sub: 'You can turn them on later in Settings.', list: [], warn: 'Alerts are blocked on this phone', btn: 'Done', act: shGo };
      else if (ph === 'installed') S = { title: 'Turn on alerts?', sub: 'Know when a brand pays, a payment is late, or a post is due.', list: [], done: 'Talby is on your Home Screen', btn: 'Turn on alerts', act: askAlerts, later: true };
      else S = { title: 'Get the Talby app', sub: 'www.talby.io', list: BEN2, btn: 'Add to Home Screen', later: true, foot: true,
          act: dev === 'iphone' ? function () { self.setState({ appPhase: 'hint' }); } : function () { self.installApp().then(function (ok) { self.setState({ appPhase: ok ? 'installed' : 'hint' }); }); } };
    }
    var sh = { show: !!S, title: S ? S.title : '', sub: S ? S.sub : '', btn: S ? S.btn : '', act: S ? S.act : function () {},
      later: function () { self.dismissInstall('onboarding'); go(6); }, hasLater: !!(S && S.later), hasFoot: !!(S && S.foot),
      hasDone: !!(S && S.done), done: S && S.done || '', hasWarn: !!(S && S.warn), warn: S && S.warn || '', hasList: !!(S && S.list.length),
      list: (S ? S.list : []).map(function (x, i) { return { icon: x[0], text: x[1], n: x[2] || '', isNum: !!x[2], isIcon: !x[2], delay: (0.08 + i * 0.05).toFixed(2) + 's' }; }) };
    var tip = { show: !!TIP, icon: TIP ? TIP.icon : '', text: TIP ? TIP.text : '', sub: TIP ? TIP.sub : '', close: function () { self.dismissInstall('onboarding'); go(6); } };
    var app = { caps: A.caps, title: A.title, sub: A.sub, list: A.list.map(row), showList: A.list.length > 0, showDone: !!A.done, doneText: A.done || '', showWarn: !!A.warn, warnText: A.warn || '',
      label: A.label, canGo: !!A.canGo, primary: A.act || function () {}, isPhoneDev: dev !== 'desktop' };
    return {
      okIn: t.dark ? t.page : t.okBg,
      t: t, k: k, dark: dark, mob: mob, phone: phone, minH: fr ? (vwSet ? (W < 768 ? '844px' : '1180px') : '700px') : '100vh',
      vars: '--hv: ' + t.hv + '; --hvr: ' + t.hvr + '; --bd2: ' + t.borderStrong + '; --fg: ' + t.fg + '; --ring: ' + t.ring + '; --shh: ' + t.shHover + '; --acc: ' + t.primary,
      rootDir: phone || stack ? 'column' : 'row', rootX: vwSet && !fr ? '; width: 100%; max-width: ' + W + 'px; margin: 0 auto; box-shadow: 0 0 0 1px ' + t.border : '',
      leftSt: leftSt, hdrSt: hdrSt, bodySt: bodySt, ftrSt: ftrSt, spacerSt: phone ? 'display: none' : 'flex: 1 1 auto',
      showPreview: !phone || pvSheet, pvSheet: pvSheet, pvPos: pvPos, pvColSt: pvColSt, pvCls: pvSheet ? 'a-up' : '', pvRole: pvSheet ? 'dialog' : 'region',
      pvOpenAttr: st.pvOpen ? 'true' : 'false', togglePv: function () { self.setState({ pvOpen: !st.pvOpen }); }, closePv: function () { self.setState({ pvOpen: false }); },
      pvH: fr && !vwSet ? '380px' : (phone ? '360px' : (stack || cozy ? '400px' : '440px')), pvTitleFs: Math.round((phone ? 16 : (cozy ? 17 : 19)) * t.hScale) + 'px',
      railW: phone ? '48px' : (cozy ? '124px' : '142px'), railPad: phone ? '14px 6px 12px' : '16px 10px 14px', navJust: phone ? 'center' : 'flex-start', navPad: phone ? '0' : '0 8px',
      railLblSt: phone ? 'display: none' : 'display: inline', pvNameSt: phone ? 'display: none' : 'font-size: 12px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis', pvUserPad: phone ? '0' : '0 4px',
      capRowSt: phone ? 'display: flex; align-items: center; gap: 12px; padding: 0 4px' : 'display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding: 0 4px',
      capSubSt: phone ? 'flex: 1 1 auto; min-width: 0; font-size: 13px; color: ' + t.mutedFg + '; white-space: nowrap; overflow: hidden; text-overflow: ellipsis' : 'font-size: 13px; color: ' + t.mutedFg + '; white-space: nowrap',
      pvMainPad: phone ? '14px' : '18px', pvStatPad: phone ? '8px 10px' : '10px 12px',
      stepNo: String(stepNow + 1), bars: STEPS.map(function (s2, i) { return { w: i < stepNow ? '100%' : (i === stepNow ? '50%' : '0%') }; }),
      isName: step === 0, isPhoto: step === 1, isTheme: step === 2, isAbout: step === 3, isDeals: step === 4, isApp: step === 5, isAppPage: step === 5 && !shOn, app: app, sh: sh, tip: tip, isReady: step === 6, notReady: step !== 6, showReady: step === 6 || shOn, showNext: step !== 6 && !shOn,
      phBack: phone && step > 0, hasBackFtr: !phone && step > 0, canSkip: (step >= 1 && step <= 4 && !(phone && step === 4)) || (step === 5 && !shOn && !app.canGo),
      back: function () { go(step - 1); }, skip: function () { if (step === 2) self.save(); if (step === 5) self.dismissInstall('onboarding'); go(step + 1); }, skipLabel: step === 5 ? 'Not now' : 'Skip for now', next: next,
      nextLabel: st.saving ? 'Saving' : (st.saveErr ? 'Try again' : (step === 4 ? (hasDeal ? 'Continue' : 'Continue without a deal') : step === 5 ? app.label : 'Continue')),
      saving: !!st.saving, savingAttr: st.saving ? 'true' : 'false', saveErr: !!st.saveErr,
      saveErrText: step === 6 ? 'Check your connection, then pick an option again. Your answers are still here.' : 'Check your connection and try again. Your answers are still here.',
      handle: handle, handleShow: showName, initial: initial, hasHandle: clean.replace(/^@+/, '').length >= 2, err: st.err, hasErr: !!st.err, errRing: st.err ? ('0 0 0 2px ' + t.destr) : 'none',
      setHandle: function (e) { self.setState({ handle: e.target.value.replace(/\s/g, '').toLowerCase(), err: '' }); },
      nameKey: function (e) { if (e && e.key === 'Enter') next(); },
      noPhoto: !hasPhoto, hasPhoto: hasPhoto, photo: photo, pickFile: readFile,
      dropH: phone ? '196px' : '210px', dropBd: pe && !hasPhoto ? t.destr : t.borderStrong, dropTileBg: pe && !hasPhoto ? t.badBg : t.tile, dropTileFg: pe && !hasPhoto ? t.badFg : t.fg,
      dropIcon: pe && !hasPhoto ? 'M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z' : 'M12 15V3M7 8l5-5 5 5M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4', dropOk: !pe, dropBad: !!pe, photoErrTitle: PE[0], photoErrHint: PE[1],
      photoErrInline: !!pe && hasPhoto, photoErrLine: pe ? PE[0] + '. ' + PE[1] : '',
      cropRowSt: phone ? 'display: flex; flex-direction: column; align-items: center; gap: 20px' : 'display: flex; align-items: center; gap: 28px; flex-wrap: wrap',
      ctrlSt: phone ? 'align-self: stretch; min-width: 0; display: flex; flex-direction: column; gap: 16px' : 'flex: 1 1 180px; min-width: 0; display: flex; flex-direction: column; gap: 16px',
      bgSize: wPct + '% ' + hPct + '%', bgPos: pos(1), bgPos64: pos(64 / 220), bgPos32: pos(32 / 220), zoom: String(st.zoom), zoomLabel: (st.zoom / 100).toFixed(1) + 'x',
      setZoom: function (e) { self.setState({ zoom: +e.target.value }); },
      dragStart: function (e) { self._drag = { x: e.clientX, y: e.clientY, dx: st.dx, dy: st.dy }; try { e.currentTarget.setPointerCapture(e.pointerId); } catch (x) {} },
      dragMove: function (e) { var d = self._drag; if (!d) return; var lim = 110 * (st.zoom / 100); self.setState({ dx: Math.max(-lim, Math.min(lim, d.dx + e.clientX - d.x)), dy: Math.max(-lim, Math.min(lim, d.dy + e.clientY - d.y)) }); },
      dragEnd: function () { self._drag = null; },
      tileStrip: phone ? '18%' : '24%', tileLblFs: phone ? '11px' : '12px',
      tileR: (t.r ? t.r + 4 : 0) + 'px', tileIn: (t.r ? t.r + 1 : 0) + 'px', themes: themes, modeOpts: modeOpts,
      platOpts: platOpts, volOpts: volOpts, volNote: st.volume ? VOL[st.volume] : 'This helps Talby suggest the fastest way to get set up.',
      ways: ways, brand: st.brand, amt: st.amt, formErr: st.formErr, hasFormErr: !!st.formErr,
      formPad: phone ? '0 14px 14px' : '0 16px 16px 68px', brandFx: phone ? '1 1 100%' : '1 1 180px', amtFx: phone ? '1 1 0' : '0 1 120px',
      setBrand: function (e) { self.setState({ brand: e.target.value, formErr: '' }); }, setAmt: function (e) { self.setState({ amt: e.target.value.replace(/[^0-9.,]/g, ''), formErr: '' }); },
      manualKey: function (e) { if (e.key === 'Enter') { if (e.preventDefault) e.preventDefault(); addManualFn(); } },
      addManual: addManualFn,
      addAnother: function () { self.setState({ way: 'manual' }); },
      hasDeal: hasDeal, dealLine: hasDeal ? (deal.brand + ' is in' + (deal.amt ? ', ' + fmt(deal.amt) + ' booked' : '')) : '',
      dealLineSt: phone ? 'flex: 1 1 auto; min-width: 0; font-weight: 500; line-height: 1.35; overflow-wrap: anywhere' : 'flex: 1 1 auto; min-width: 0; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis',
      dealBrand: hasDeal ? deal.brand : '', dealInit: hasDeal ? deal.brand.charAt(0).toUpperCase() : '', dealAmt: hasDeal ? fmt(deal.amt) : '',
      add: st.add, closeAdd: function () { self.setState({ add: '' }); },
      onCreated: function (info) { if (info) self.emit(info.kind === 'deal' ? 'deal.create' : 'deals.import', info, 'Could not save the deal'); var d0 = info && info.deals && info.deals[0]; self.setState({ add: '', deal: d0 ? { brand: d0.brand, amt: d0.amt || 0 } : { brand: 'Lumen and Lark', amt: 6000 } }); },
      how: HOW.map(function (h, i) { return { n: String(i + 1), title: h[0], sub: h[1], delay: (0.08 + i * 0.08).toFixed(2) + 's' }; }),
      howBox: phone ? 'min-height: 76px; padding: 12px 16px' : 'height: 76px; padding: 0 18px',
      howSubSt: phone ? 'font-size: 13px; line-height: 1.4; color: ' + t.mutedFg : 'font-size: 13px; color: ' + t.mutedFg + '; white-space: nowrap; overflow: hidden; text-overflow: ellipsis',
      withTour: function (e) { leave(e, true); },
      noTour: function (e) { leave(e, false); },
      pvNav: NAV.map(function (n, i) { return { label: n, bg: i === 0 ? t.navOn : 'transparent', fg: i === 0 ? t.fg : t.mutedFg, fw: i === 0 ? '600' : '500', op: i === 0 ? '1' : '0.55' }; }),
      pvAvatar: pvAvatar, pvInit: initial, pvName: showName, pvGreeting: greet + ', ' + showName,
      pvStats: [['Booked', hasDeal ? fmt(deal.amt) : '$0', hasDeal ? t.fg : t.mutedFg], ['Received', '$0', t.mutedFg], ['Still owed', hasDeal ? fmt(deal.amt) : '$0', hasDeal ? t.fg : t.mutedFg]].map(function (s2) { return { label: s2[0], value: s2[1], fg: s2[2] }; }),
      pvEmpty: !hasDeal, pvCount: hasDeal ? '1 deal' : 'None yet', pvPlats: platList, pvHasPlats: platList.length > 0
    };
  }
}
return Component;
})();

function render($s0, host) {
  const { A, T, I, V0, S, HS, H } = $r;
  return (<>
      <div {...S(`position: relative; box-sizing: border-box; min-height: ${I($s0?.minH)}; display: flex; align-items: stretch; background: ${I($s0?.t?.page)}; color: ${I($s0?.t?.fg)}; font-family: ${I($s0?.t?.bodyFam)}; font-size: 14px; line-height: 1.43; -webkit-font-smoothing: antialiased; transition: background-color 0.3s ease, color 0.3s ease; ${I($s0?.vars)}; flex-direction: ${I($s0?.rootDir)}${I($s0?.rootX)}`)}>
        <div {...S($s0?.leftSt)}>
          <div {...S($s0?.hdrSt)}>
            {$s0?.phBack ? (<>
              <button type={"button"} className={"tb tg"} onClick={$s0?.back} aria-label={"Back"} {...S($s0?.k?.icoBack)}>
                <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M15 18l-6-6 6-6"} />
                </svg>
              </button>
            </>) : null}
            <span {...S(`font-size: 13px; font-weight: 500; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap`)}>
              {"Step "}{T($s0?.stepNo)}{" of 7"}
            </span>
            <div aria-hidden={"true"} {...S("flex: 1 1 auto; display: flex; gap: 4px")}>
              {A($s0?.bars).map((it, i) => {
                const $s1 = { ...$s0, "b": it, $index: i };
                return (<React.Fragment key={i}>
                  <span {...S(`flex: 1 1 0; height: 4px; border-radius: 2px; background: ${I($s1?.t?.off)}; overflow: hidden`)}>
                    <span {...S(`display: block; height: 100%; width: ${I($s1?.b?.w)}; background: ${I($s1?.t?.accent)}; transition: width 0.4s cubic-bezier(.4,0,.2,1)`)} />
                  </span>
                </React.Fragment>);
              })}
            </div>
            {$s0?.phone ? (<>
              <button type={"button"} className={"tb tg"} onClick={$s0?.togglePv} aria-expanded={$s0?.pvOpenAttr} aria-label={"Preview your Talby"} {...S($s0?.k?.pvBtn)}>
                <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"} />
                </svg>
                {"Preview"}
              </button>
            </>) : null}
          </div>
          <div {...S($s0?.bodySt)}>
            {$s0?.isName ? (<>
              <div className={"a-in"} {...S("display: flex; flex-direction: column; gap: 22px")}>
                <div {...S("display: flex; flex-direction: column; gap: 8px")}>
                  <span {...S($s0?.k?.caps)}>
                    {"Welcome to Talby"}
                  </span>
                  <h1 {...S($s0?.k?.h1)}>
                    {"What should we call you?"}
                  </h1>
                  <p {...S($s0?.k?.sub)}>
                    {"Talby greets you with it. You can change it later."}
                  </p>
                </div>
                <div {...S("display: flex; flex-direction: column; gap: 8px")}>
                  <label htmlFor={"ob-handle"} {...S("font-weight: 500")}>
                    {"Your creator name"}
                  </label>
                  <div className={"ti"} {...S(`display: flex; align-items: center; gap: 2px; height: 46px; padding: 0 18px; box-sizing: border-box; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.fill)}; box-shadow: ${I($s0?.errRing)}`)}>
                    <span {...S(`font-size: 16px; color: ${I($s0?.t?.mutedFg)}`)}>
                      {"@"}
                    </span>
                    <input id={"ob-handle"} value={V0($s0?.handle, "")} onChange={$s0?.setHandle} onKeyDown={$s0?.nameKey} placeholder={"junobakes"} autoComplete={"off"} autoCapitalize={"none"} spellCheck={"false"} enterKeyHint={"next"} {...S(`flex: 1 1 auto; min-width: 0; height: 100%; padding: 0; border: none; background: transparent; color: ${I($s0?.t?.fg)}; font: inherit; font-size: 16px; outline: none`)} />
                  </div>
                  {$s0?.hasErr ? (<>
                    <span role={"alert"} className={"a-fade"} {...S(`font-size: 13px; color: ${I($s0?.t?.destr)}`)}>
                      {T($s0?.err)}
                    </span>
                  </>) : null}
                </div>
                {$s0?.hasHandle ? (<>
                  <div className={"a-fade"} {...S(`display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.soft)}; color: ${I($s0?.t?.softFg)}`)}>
                    <span {...S($s0?.k?.avatar32)}>
                      {T($s0?.initial)}
                    </span>
                    <span {...S("white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                      {"Nice to meet you, "}
                      <span {...S("font-weight: 600")}>
                        {T($s0?.handleShow)}
                      </span>
                      {"."}
                    </span>
                  </div>
                </>) : null}
              </div>
            </>) : null}
            {$s0?.isPhoto ? (<>
              <div className={"a-in"} {...S("display: flex; flex-direction: column; gap: 22px")}>
                <div {...S("display: flex; flex-direction: column; gap: 8px")}>
                  <span {...S($s0?.k?.caps)}>
                    {"Profile photo"}
                  </span>
                  <h1 {...S($s0?.k?.h1)}>
                    {"Add a photo"}
                  </h1>
                  <p {...S($s0?.k?.sub)}>
                    {"It sits next to your name in Talby. A logo works too."}
                  </p>
                </div>
                {$s0?.noPhoto ? (<>
                  <label className={"tz ti"} {...S(`--hvz: ${I($s0?.t?.hvr)}; --bd2: ${I($s0?.dropBd)}; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; height: ${I($s0?.dropH)}; padding: 0 20px; border: 1.5px dashed ${I($s0?.dropBd)}; border-radius: ${I($s0?.t?.rCard)}; background: ${I($s0?.t?.card)}; cursor: pointer; text-align: center`)}>
                    <input type={"file"} accept={"image/*"} onChange={$s0?.pickFile} {...S("position: absolute; width: 1px; height: 1px; opacity: 0; overflow: hidden")} />
                    <span {...S(`width: 48px; height: 48px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.dropTileBg)}; color: ${I($s0?.dropTileFg)}; display: inline-flex; align-items: center; justify-content: center`)}>
                      <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={$s0?.dropIcon} />
                      </svg>
                    </span>
                    {$s0?.dropOk ? (<>
                      <span {...S("display: flex; flex-direction: column; gap: 2px")}>
                        <span {...S("font-weight: 600")}>
                          {"Choose a photo"}
                        </span>
                        <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}`)}>
                          {"PNG or JPG. A square photo works best."}
                        </span>
                      </span>
                    </>) : null}
                    {$s0?.dropBad ? (<>
                      <span role={"alert"} className={"a-fade"} {...S("display: flex; flex-direction: column; gap: 2px")}>
                        <span {...S(`font-weight: 600; color: ${I($s0?.t?.destr)}`)}>
                          {T($s0?.photoErrTitle)}
                        </span>
                        <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}`)}>
                          {T($s0?.photoErrHint)}
                        </span>
                      </span>
                    </>) : null}
                  </label>
                  <div {...S(`display: flex; align-items: center; gap: 10px; font-size: 13px; color: ${I($s0?.t?.mutedFg)}`)}>
                    <span {...S($s0?.k?.avatar28)}>
                      {T($s0?.initial)}
                    </span>
                    <span>
                      {"No photo? Your initial shows instead."}
                    </span>
                  </div>
                </>) : null}
                {$s0?.hasPhoto ? (<>
                  <div className={"a-pop"} {...S($s0?.cropRowSt)}>
                    <div onPointerDown={$s0?.dragStart} onPointerMove={$s0?.dragMove} onPointerUp={$s0?.dragEnd} onPointerLeave={$s0?.dragEnd} role={"img"} aria-label={"Photo crop area"} {...S(`position: relative; width: 220px; height: 220px; flex: 0 0 220px; overflow: hidden; border-radius: ${I($s0?.t?.rCard)}; background-color: #111111; background-image: url(${I($s0?.photo)}); background-repeat: no-repeat; background-size: ${I($s0?.bgSize)}; background-position: ${I($s0?.bgPos)}; cursor: grab; touch-action: none; user-select: none`)}>
                      <span aria-hidden={"true"} {...S("position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: radial-gradient(circle at center, rgba(0,0,0,0) 0 98px, rgba(0,0,0,0.5) 99px); pointer-events: none")} />
                      <span aria-hidden={"true"} {...S("position: absolute; top: 11px; left: 11px; width: 198px; height: 198px; box-sizing: border-box; border: 2px solid rgba(255,255,255,0.9); border-radius: 50%; pointer-events: none")} />
                    </div>
                    <div {...S($s0?.ctrlSt)}>
                      <div {...S("display: flex; align-items: center; gap: 14px")}>
                        <span {...S(`width: 64px; height: 64px; flex: 0 0 64px; border-radius: 50%; background-color: #111111; background-image: url(${I($s0?.photo)}); background-repeat: no-repeat; background-size: ${I($s0?.bgSize)}; background-position: ${I($s0?.bgPos64)}; box-shadow: 0 0 0 1px ${I($s0?.t?.border)}`)} />
                        <span {...S(`width: 32px; height: 32px; flex: 0 0 32px; border-radius: 50%; background-color: #111111; background-image: url(${I($s0?.photo)}); background-repeat: no-repeat; background-size: ${I($s0?.bgSize)}; background-position: ${I($s0?.bgPos32)}; box-shadow: 0 0 0 1px ${I($s0?.t?.border)}`)} />
                        <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap`)}>
                          {"How it looks"}
                        </span>
                      </div>
                      <label {...S("display: flex; flex-direction: column; gap: 8px")}>
                        <span {...S("display: flex; justify-content: space-between; font-weight: 500")}>
                          <span>
                            {"Zoom"}
                          </span>
                          <span {...S(`color: ${I($s0?.t?.mutedFg)}; font-weight: 400`)}>
                            {T($s0?.zoomLabel)}
                          </span>
                        </span>
                        <input type={"range"} min={"100"} max={"300"} step={"1"} value={V0($s0?.zoom, "")} onInput={$s0?.setZoom} onChange={$s0?.setZoom} aria-label={"Zoom"} {...S("width: 100%")} />
                      </label>
                      <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}`)}>
                        {"Drag the photo to move it."}
                      </span>
                      <label className={"tb tt"} {...S(`position: relative; align-self: flex-start; font-size: 13px; font-weight: 500; color: ${I($s0?.t?.fg)}; text-decoration: underline; text-underline-offset: 3px; cursor: pointer`)}>
                        <input type={"file"} accept={"image/*"} onChange={$s0?.pickFile} {...S("position: absolute; width: 1px; height: 1px; opacity: 0; overflow: hidden")} />
                        {"Choose another"}
                      </label>
                      {$s0?.photoErrInline ? (<>
                        <span role={"alert"} className={"a-fade"} {...S(`display: flex; align-items: flex-start; gap: 8px; font-size: 13px; line-height: 1.4; color: ${I($s0?.t?.destr)}`)}>
                          <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 15px; margin-top: 1px")}>
                            <path d={"M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"} />
                          </svg>
                          <span>
                            {T($s0?.photoErrLine)}
                          </span>
                        </span>
                      </>) : null}
                    </div>
                  </div>
                </>) : null}
              </div>
            </>) : null}
            {$s0?.isTheme ? (<>
              <div className={"a-in"} {...S("display: flex; flex-direction: column; gap: 22px")}>
                <div {...S("display: flex; flex-direction: column; gap: 8px")}>
                  <span {...S($s0?.k?.caps)}>
                    {"Your look"}
                  </span>
                  <h1 {...S($s0?.k?.h1)}>
                    {"Make it feel like yours"}
                  </h1>
                  <p {...S($s0?.k?.sub)}>
                    {"Pick a theme. Each one has a light and a dark side."}
                  </p>
                </div>
                <div role={"radiogroup"} aria-label={"Theme"} {...S("display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px 10px")}>
                  {A($s0?.themes).map((it, i) => {
                    const $s1 = { ...$s0, "m": it, $index: i };
                    return (<React.Fragment key={i}>
                      <button type={"button"} role={"radio"} className={"tb tlift"} aria-checked={$s1?.m?.on} onClick={$s1?.m?.pick} {...S(`min-width: 0; display: flex; flex-direction: column; gap: 8px; padding: 0; border: none; background: transparent; font: inherit; color: ${I($s1?.t?.fg)}; text-align: left; cursor: pointer`)}>
                        <span {...S(`display: block; padding: 3px; border-radius: ${I($s1?.tileR)}; box-shadow: ${I($s1?.m?.ring)}; transition: box-shadow 0.2s ease`)}>
                          <span {...S(`display: flex; height: 70px; overflow: hidden; border-radius: ${I($s1?.tileIn)}; background: ${I($s1?.m?.page)}; box-shadow: inset 0 0 0 1px ${I($s1?.m?.edge)}`)}>
                            <span {...S(`flex: 0 0 ${I($s1?.tileStrip)}; background: ${I($s1?.m?.side)}; border-right: 1px solid ${I($s1?.m?.sideBorder)}`)} />
                            <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; justify-content: space-between; padding: 8px 9px; box-sizing: border-box")}>
                              <span {...S(`font-family: ${I($s1?.m?.titleFam)}; font-size: ${I($s1?.tileLblFs)}; font-weight: 600; line-height: 1.1; color: ${I($s1?.m?.fg)}; letter-spacing: ${I($s1?.m?.track)}; text-transform: ${I($s1?.m?.hcase)}; white-space: nowrap; overflow: hidden`)}>
                                {"Overview"}
                              </span>
                              <span {...S("display: flex; align-items: center; justify-content: space-between; gap: 6px")}>
                                <span {...S(`font-family: ${I($s1?.m?.numFam)}; font-size: 12px; font-weight: 600; color: ${I($s1?.m?.fg)}; white-space: nowrap`)}>
                                  {"$8,500"}
                                </span>
                                <span {...S(`width: 28px; height: 10px; border-radius: ${I($s1?.m?.ctlR)}; background: ${I($s1?.m?.primary)}`)} />
                              </span>
                            </span>
                          </span>
                        </span>
                        <span {...S("display: flex; align-items: center; gap: 8px; padding-left: 2px; white-space: nowrap; min-width: 0")}>
                          <span {...S(`width: 16px; height: 16px; flex: 0 0 16px; box-sizing: border-box; border-radius: 8px; border: ${I($s1?.m?.radioBorder)}; background: ${I($s1?.m?.radioBg)}; display: inline-flex; align-items: center; justify-content: center`)}>
                            <span {...S(`width: 6px; height: 6px; border-radius: 3px; background: ${I($s1?.t?.primaryFg)}; visibility: ${I($s1?.m?.dot)}`)} />
                          </span>
                          <span {...S("font-weight: 500; overflow: hidden; text-overflow: ellipsis")}>
                            {T($s1?.m?.name)}
                          </span>
                        </span>
                      </button>
                    </React.Fragment>);
                  })}
                </div>
                <div {...S("display: flex; flex-direction: column; gap: 10px")}>
                  <span id={"ob-mode"} {...S("font-weight: 500")}>
                    {"Mode"}
                  </span>
                  <div role={"radiogroup"} aria-labelledby={"ob-mode"} {...S($s0?.k?.track)}>
                    {A($s0?.modeOpts).map((it, i) => {
                      const $s1 = { ...$s0, "mo": it, $index: i };
                      return (<React.Fragment key={i}>
                        <button type={"button"} role={"radio"} className={"tb tt"} aria-checked={$s1?.mo?.on} onClick={$s1?.mo?.pick} {...S(`flex: 1 1 0; gap: 6px; ${I($s1?.mo?.style)}`)}>
                          <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={$s1?.mo?.icon} />
                          </svg>
                          {T($s1?.mo?.label)}
                        </button>
                      </React.Fragment>);
                    })}
                  </div>
                </div>
              </div>
            </>) : null}
            {$s0?.isAbout ? (<>
              <div className={"a-in"} {...S("display: flex; flex-direction: column; gap: 26px")}>
                <div {...S("display: flex; flex-direction: column; gap: 8px")}>
                  <span {...S($s0?.k?.caps)}>
                    {"About you"}
                  </span>
                  <h1 {...S($s0?.k?.h1)}>
                    {"Where do you post?"}
                  </h1>
                  <p {...S($s0?.k?.sub)}>
                    {"Pick all that apply. Talby uses them on new deals."}
                  </p>
                </div>
                <div role={"group"} aria-label={"Platforms"} {...S("display: flex; flex-wrap: wrap; gap: 8px")}>
                  {A($s0?.platOpts).map((it, i) => {
                    const $s1 = { ...$s0, "c": it, $index: i };
                    return (<React.Fragment key={i}>
                      <button type={"button"} className={"tb"} aria-pressed={$s1?.c?.on} onClick={$s1?.c?.pick} {...S(`display: inline-flex; align-items: center; gap: 8px; ${I($s1?.c?.style)}; height: 40px; padding: ${I($s1?.c?.pad)}; font-size: 14px`)}>
                        {$s1?.c?.hasIcon ? (<>
                          <img src={$s1?.c?.icon} alt={""} width={"20"} height={"20"} {...S("display: block; width: 20px; height: 20px; flex: 0 0 20px; border-radius: 5px")} />
                        </>) : null}
                        {T($s1?.c?.label)}
                        {$s1?.c?.on ? (<>
                          <svg className={"a-check"} width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={"M20 6 9 17l-5-5"} />
                          </svg>
                        </>) : null}
                      </button>
                    </React.Fragment>);
                  })}
                </div>
                <div {...S("display: flex; flex-direction: column; gap: 10px")}>
                  <span id={"ob-vol"} {...S("font-weight: 500")}>
                    {"How many brand deals do you do in a month?"}
                  </span>
                  <div role={"radiogroup"} aria-labelledby={"ob-vol"} {...S("display: flex; flex-wrap: wrap; gap: 8px")}>
                    {A($s0?.volOpts).map((it, i) => {
                      const $s1 = { ...$s0, "v": it, $index: i };
                      return (<React.Fragment key={i}>
                        <button type={"button"} role={"radio"} className={"tb"} aria-checked={$s1?.v?.on} onClick={$s1?.v?.pick} {...S($s1?.v?.style)}>
                          {T($s1?.v?.label)}
                        </button>
                      </React.Fragment>);
                    })}
                  </div>
                  <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}`)}>
                    {T($s0?.volNote)}
                  </span>
                </div>
              </div>
            </>) : null}
            {$s0?.isDeals ? (<>
              <div className={"a-in"} {...S("display: flex; flex-direction: column; gap: 20px")}>
                <div {...S("display: flex; flex-direction: column; gap: 8px")}>
                  <span {...S($s0?.k?.caps)}>
                    {"Your deals"}
                  </span>
                  <h1 {...S($s0?.k?.h1)}>
                    {"Bring in your first deal"}
                  </h1>
                  <p {...S($s0?.k?.sub)}>
                    {"Start with one. You can add the rest any time."}
                  </p>
                </div>
                {$s0?.hasDeal ? (<>
                  <div role={"status"} className={"a-pop"} {...S(`display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.okBg)}; color: ${I($s0?.t?.okFg)}`)}>
                    <span className={"a-check"} {...S(`width: 26px; height: 26px; flex: 0 0 26px; border-radius: 13px; background: ${I($s0?.t?.okFg)}; color: ${I($s0?.okIn)}; display: inline-flex; align-items: center; justify-content: center`)}>
                      <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M20 6 9 17l-5-5"} />
                      </svg>
                    </span>
                    <span {...S($s0?.dealLineSt)}>
                      {T($s0?.dealLine)}
                    </span>
                    <button type={"button"} className={"tb tt"} onClick={$s0?.addAnother} {...S("padding: 0; border: none; background: transparent; color: inherit; font: inherit; font-size: 13px; font-weight: 500; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; white-space: nowrap")}>
                      {"Add another"}
                    </button>
                  </div>
                </>) : null}
                <div {...S($s0?.k?.group)}>
                  {A($s0?.ways).map((it, i) => {
                    const $s1 = { ...$s0, "w": it, $index: i };
                    return (<React.Fragment key={i}>
                      <div {...S(`border-top: ${I($s1?.w?.line)}`)}>
                        <button type={"button"} className={"tb tr"} onClick={$s1?.w?.pick} aria-expanded={$s1?.w?.open} {...S(`display: flex; align-items: center; gap: 14px; width: 100%; padding: 14px 16px; box-sizing: border-box; border: none; border-radius: ${I($s1?.w?.radius)}; background: transparent; color: ${I($s1?.t?.fg)}; font: inherit; text-align: left; cursor: pointer`)}>
                          <span {...S(`width: 38px; height: 38px; flex: 0 0 38px; border-radius: ${I($s1?.t?.rTile)}; background: ${I($s1?.w?.tileBg)}; color: ${I($s1?.w?.tileFg)}; display: inline-flex; align-items: center; justify-content: center`)}>
                            <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={$s1?.w?.icon} />
                            </svg>
                          </span>
                          <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                            <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                              {T($s1?.w?.title)}
                            </span>
                            <span {...S(`font-size: 13px; color: ${I($s1?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                              {T($s1?.w?.sub)}
                            </span>
                          </span>
                          <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s1?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 16px; transform: ${I($s1?.w?.rot)}; transition: transform 0.2s ease`)}>
                            <path d={"m9 18 6-6-6-6"} />
                          </svg>
                        </button>
                        {$s1?.w?.showForm ? (<>
                          <div className={"a-drop"} {...S(`display: flex; gap: 8px; flex-wrap: wrap; padding: ${I($s1?.formPad)}`)}>
                            <input className={"ti"} aria-label={"Brand"} value={V0($s1?.brand, "")} onChange={$s1?.setBrand} onKeyDown={$s1?.manualKey} placeholder={"Brand, like Lumen and Lark"} {...S(`flex: ${I($s1?.brandFx)}; ${I($s1?.k?.input)}`)} />
                            <input className={"ti"} aria-label={"Amount"} value={V0($s1?.amt, "")} onChange={$s1?.setAmt} onKeyDown={$s1?.manualKey} inputMode={"decimal"} placeholder={"$ Amount"} {...S(`flex: ${I($s1?.amtFx)}; ${I($s1?.k?.input)}`)} />
                            <button type={"button"} className={"tb tp"} onClick={$s1?.addManual} {...S(`${I($s1?.k?.btnP)}; height: 36px`)}>
                              {"Add deal"}
                            </button>
                            {$s1?.hasFormErr ? (<>
                              <span role={"alert"} {...S(`flex: 1 0 100%; font-size: 13px; color: ${I($s1?.t?.destr)}`)}>
                                {T($s1?.formErr)}
                              </span>
                            </>) : null}
                          </div>
                        </>) : null}
                      </div>
                    </React.Fragment>);
                  })}
                </div>
              </div>
            </>) : null}
            {$s0?.isAppPage ? (<>
              <div className={"a-in"} {...S("display: flex; flex-direction: column; gap: 22px")}>
                <span aria-hidden={"true"} {...S(`width: 56px; height: 56px; flex: 0 0 56px; box-sizing: border-box; border: 1px solid ${I($s0?.t?.border)}; border-radius: 14px; background: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 1px 2px rgba(0,0,0,0.06)`)}>
                  <svg width={"30"} height={"26"} viewBox={"0 0 2029 1722"} aria-hidden={"true"} {...S("display: block")}>
                    <path fill={"#1F7AE0"} d={"M325.553 0.11436C357.82 -0.851434 390.344 4.39925 421.577 12.1099C506.351 33.0387 579.306 92.8684 628.981 163.1C648.617 190.863 665.004 221.256 682.357 250.477C714.91 305.296 746.394 360.846 779.411 415.372C792.242 436.561 805.088 458.322 818.991 478.81C853.846 530.177 928.98 628.305 990.503 643.014C1013.94 648.615 1037.46 645.591 1058.97 634.725C1078.92 624.656 1094.72 608.763 1110.74 593.552C1184.16 523.869 1237.02 434.688 1287.42 347.839C1299.09 327.74 1311.38 307.989 1322.85 287.786C1346.79 245.624 1371.62 198.953 1400.03 160.003C1431.42 116.962 1467.92 79.9142 1513.59 51.9883C1592.43 3.35327 1687.5 -11.5536 1777.44 10.6178C1861.41 31.3662 1933.82 84.3529 1979.02 158.109C2024.53 233.037 2040.98 310.935 2019.97 397.268C1988.25 527.6 1882.9 628.138 1749.42 647.874C1724.27 651.594 1693.72 650.686 1668.06 650.648L1562.66 650.457L1294.18 650.569C1229.3 650.36 1166.25 642.367 1109.31 677.354C1075.41 697.881 1051.07 731.066 1041.68 769.577C1024.74 841.175 1063.31 906.426 1099.22 965.078C1103.02 971.823 1114.46 985.726 1119.82 992.612C1140.88 1019.75 1162.84 1046.17 1185.68 1071.84C1264.51 1161.22 1337.81 1269.48 1345.12 1391.87C1355.92 1572.91 1205.73 1711.69 1031.77 1721.4C938.596 1726.86 847.128 1694.71 777.855 1632.13C733.34 1591.55 702.231 1538.38 688.665 1479.68C676.384 1428.85 679.574 1377.6 692.642 1327.29C710.038 1260.33 744.366 1197.92 785.127 1142.41C854.647 1047.73 998.351 921.921 991.042 795.526C987.346 731.658 941.997 680.383 882.362 660.534C837.4 645.57 776.985 650.524 728.979 650.558L429.507 650.401L351.229 650.568C319.765 650.635 286.204 651.2 255.381 644.239C194.201 631.235 150.38 605.052 104.113 565.316C-67.2929 418.104 -14.8418 150.672 172.337 43.4476C223.087 14.3754 266.379 3.16906 325.553 0.11436Z"} />
                  </svg>
                </span>
                <div {...S("display: flex; flex-direction: column; gap: 8px")}>
                  <span {...S($s0?.k?.caps)}>
                    {T($s0?.app?.caps)}
                  </span>
                  <h1 {...S($s0?.k?.h1)}>
                    {T($s0?.app?.title)}
                  </h1>
                  <p {...S($s0?.k?.sub)}>
                    {T($s0?.app?.sub)}
                  </p>
                </div>
                {$s0?.app?.showList ? (<>
                  <div {...S("display: flex; flex-direction: column; gap: 10px")}>
                    {A($s0?.app?.list).map((it, i) => {
                      const $s1 = { ...$s0, "a": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div className={"a-in"} {...S(`animation-delay: ${I($s1?.a?.delay)}; display: flex; align-items: center; gap: 14px; ${I($s1?.howBox)}; box-sizing: border-box; border: 1px solid ${I($s1?.t?.border)}; border-radius: ${I($s1?.t?.rTile)}; background: ${I($s1?.t?.card)}`)}>
                          <span {...S(`position: relative; width: 36px; height: 36px; flex: 0 0 36px; border-radius: ${I($s1?.t?.rSm)}; background: ${I($s1?.t?.fill)}; color: ${I($s1?.t?.fg)}; display: inline-flex; align-items: center; justify-content: center`)}>
                            <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={$s1?.a?.icon} />
                            </svg>
                            {$s1?.a?.isNum ? (<>
                              <span {...S(`position: absolute; top: -6px; left: -6px; width: 18px; height: 18px; border-radius: 9px; background: ${I($s1?.t?.primary)}; color: ${I($s1?.t?.primaryFg)}; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; font-family: ${I($s1?.t?.numFam)}`)}>
                                {T($s1?.a?.n)}
                              </span>
                            </>) : null}
                          </span>
                          <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                            <span {...S("font-weight: 600")}>
                              {T($s1?.a?.title)}
                            </span>
                            <span {...S($s1?.howSubSt)}>
                              {T($s1?.a?.sub)}
                            </span>
                          </span>
                        </div>
                      </React.Fragment>);
                    })}
                  </div>
                </>) : null}
                {$s0?.app?.showDone ? (<>
                  <div role={"status"} className={"a-pop"} {...S(`display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.okBg)}; color: ${I($s0?.t?.okFg)}; font-weight: 500`)}>
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 18px")}>
                      <path d={"M20 6 9 17l-5-5"} />
                    </svg>
                    {T($s0?.app?.doneText)}
                  </div>
                </>) : null}
                {$s0?.app?.showWarn ? (<>
                  <div role={"status"} className={"a-pop"} {...S(`display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.warnBg)}; color: ${I($s0?.t?.warnFg)}; font-weight: 500`)}>
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 18px")}>
                      <path d={"M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"} />
                    </svg>
                    {T($s0?.app?.warnText)}
                  </div>
                </>) : null}
              </div>
            </>) : null}
            {$s0?.showReady ? (<>
              <div className={"a-in"} {...S("display: flex; flex-direction: column; gap: 22px")}>
                <div {...S("display: flex; flex-direction: column; gap: 8px")}>
                  <span {...S($s0?.k?.caps)}>
                    {"All set"}
                  </span>
                  <h1 {...S($s0?.k?.h1)}>
                    {"You're ready, "}{T($s0?.handleShow)}
                  </h1>
                  <p {...S($s0?.k?.sub)}>
                    {"Here is how Talby works."}
                  </p>
                </div>
                <div {...S("display: flex; flex-direction: column; gap: 10px")}>
                  {A($s0?.how).map((it, i) => {
                    const $s1 = { ...$s0, "h": it, $index: i };
                    return (<React.Fragment key={i}>
                      <div className={"a-in"} {...S(`animation-delay: ${I($s1?.h?.delay)}; display: flex; align-items: center; gap: 14px; ${I($s1?.howBox)}; box-sizing: border-box; border: 1px solid ${I($s1?.t?.border)}; border-radius: ${I($s1?.t?.rTile)}; background: ${I($s1?.t?.card)}`)}>
                        <span {...S(`width: 32px; height: 32px; flex: 0 0 32px; border-radius: 16px; background: ${I($s1?.t?.primary)}; color: ${I($s1?.t?.primaryFg)}; display: inline-flex; align-items: center; justify-content: center; font-family: ${I($s1?.t?.numFam)}; font-weight: 600`)}>
                          {T($s1?.h?.n)}
                        </span>
                        <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                          <span {...S("font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                            {T($s1?.h?.title)}
                          </span>
                          <span {...S($s1?.howSubSt)}>
                            {T($s1?.h?.sub)}
                          </span>
                        </span>
                      </div>
                    </React.Fragment>);
                  })}
                </div>
              </div>
            </>) : null}
          </div>
          <div {...S($s0?.ftrSt)}>
            {$s0?.saveErr ? (<>
              <div role={"alert"} className={"a-fade"} {...S(`flex: 1 0 100%; display: flex; align-items: flex-start; gap: 10px; margin-bottom: 4px; padding: 12px 14px; box-sizing: border-box; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.badBg)}; color: ${I($s0?.t?.badFg)}; font-size: 13px; line-height: 1.4`)}>
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 16px; margin-top: 1px")}>
                  <path d={"M12 20h.01M8.5 16.43a5 5 0 0 1 7 0M2 8.82a15 15 0 0 1 20 0M5 12.86a10 10 0 0 1 14 0"} />
                </svg>
                <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                  <span {...S("font-weight: 600")}>
                    {"We could not save this step"}
                  </span>
                  <span>
                    {T($s0?.saveErrText)}
                  </span>
                </span>
              </div>
            </>) : null}
            {$s0?.hasBackFtr ? (<>
              <button type={"button"} className={"tb tg"} onClick={$s0?.back} {...S(`margin-left: -12px; ${I($s0?.k?.btnG)}`)}>
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M15 18l-6-6 6-6"} />
                </svg>
                {"Back"}
              </button>
            </>) : null}
            <div {...S($s0?.spacerSt)} />
            {$s0?.canSkip ? (<>
              <button type={"button"} className={"tb tg"} onClick={$s0?.skip} {...S($s0?.k?.btnGf)}>
                {T($s0?.skipLabel)}
              </button>
            </>) : null}
            {$s0?.showNext ? (<>
              <button type={"button"} className={"tb tp"} onClick={$s0?.next} aria-busy={$s0?.savingAttr} {...S($s0?.k?.btnPf)}>
                {$s0?.saving ? (<>
                  <svg className={"a-spin"} width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M21 12a9 9 0 1 1-6.22-8.56"} />
                  </svg>
                </>) : null}
                {T($s0?.nextLabel)}
              </button>
            </>) : null}
            {$s0?.showReady ? (<>
              <a href={H("SWelcome.dc.html")} className={"tb tg"} onClick={$s0?.noTour} {...S(`--hv: ${I($s0?.t?.hv)}; ${I($s0?.k?.btnGf)}`)}>
                {"Skip the tour"}
              </a>
              <a href={H("SWelcome.dc.html")} className={"tb tp"} onClick={$s0?.withTour} {...S($s0?.k?.btnPf)}>
                {"Take the 30 second tour"}
              </a>
            </>) : null}
          </div>
        </div>
        {$s0?.pvSheet ? (<>
          <button type={"button"} aria-label={"Close preview"} className={"a-fade"} onClick={$s0?.closePv} {...S(`position: ${I($s0?.pvPos)}; top: 0; right: 0; bottom: 0; left: 0; z-index: 40; padding: 0; border: none; background: ${I($s0?.t?.overlay)}; cursor: default`)} />
        </>) : null}
        {$s0?.showPreview ? (<>
          <div className={$s0?.pvCls} role={$s0?.pvRole} aria-label={"Your Talby preview"} {...S($s0?.pvColSt)}>
            <div {...S("width: 100%; max-width: 560px; display: flex; flex-direction: column; gap: 12px")}>
              {$s0?.pvSheet ? (<>
                <span aria-hidden={"true"} {...S(`align-self: center; width: 36px; height: 4px; border-radius: 2px; background: ${I($s0?.t?.borderStrong)}`)} />
              </>) : null}
              <div {...S($s0?.capRowSt)}>
                <span {...S("font-weight: 600; white-space: nowrap")}>
                  {"Your Talby"}
                </span>
                <span {...S($s0?.capSubSt)}>
                  {"Updates as you go"}
                </span>
                {$s0?.pvSheet ? (<>
                  <button type={"button"} className={"tb tg"} onClick={$s0?.closePv} aria-label={"Close preview"} {...S($s0?.k?.icoClose)}>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M18 6 6 18M6 6l12 12"} />
                    </svg>
                  </button>
                </>) : null}
              </div>
              <div {...S(`display: flex; height: ${I($s0?.pvH)}; overflow: hidden; border-radius: 16px; background: ${I($s0?.t?.page)}; box-shadow: 0 30px 70px -30px rgba(0,0,0,0.35), 0 0 0 1px ${I($s0?.t?.border)}; transition: background-color 0.3s ease`)}>
                <div {...S(`flex: 0 0 ${I($s0?.railW)}; display: flex; flex-direction: column; gap: 4px; padding: ${I($s0?.railPad)}; box-sizing: border-box; background: ${I($s0?.t?.side)}; border-right: 1px solid ${I($s0?.t?.sideBorder)}`)}>
                  {A($s0?.pvNav).map((it, i) => {
                    const $s1 = { ...$s0, "n": it, $index: i };
                    return (<React.Fragment key={i}>
                      <span {...S(`display: flex; align-items: center; justify-content: ${I($s1?.navJust)}; gap: 8px; height: 28px; padding: ${I($s1?.navPad)}; border-radius: ${I($s1?.t?.rItem)}; background: ${I($s1?.n?.bg)}; font-size: 12px; font-weight: ${I($s1?.n?.fw)}; color: ${I($s1?.n?.fg)}; white-space: nowrap`)}>
                        <span {...S(`width: 10px; height: 10px; flex: 0 0 10px; border-radius: ${I($s1?.t?.rBox)}; background: currentColor; opacity: ${I($s1?.n?.op)}`)} />
                        <span {...S($s1?.railLblSt)}>
                          {T($s1?.n?.label)}
                        </span>
                      </span>
                    </React.Fragment>);
                  })}
                  <span {...S("flex: 1 1 auto")} />
                  <span {...S(`display: flex; align-items: center; justify-content: ${I($s0?.navJust)}; gap: 8px; min-width: 0; padding: ${I($s0?.pvUserPad)}`)}>
                    <span {...S($s0?.pvAvatar)}>
                      {T($s0?.pvInit)}
                    </span>
                    <span {...S($s0?.pvNameSt)}>
                      {T($s0?.pvName)}
                    </span>
                  </span>
                </div>
                <div {...S(`flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 12px; padding: ${I($s0?.pvMainPad)}; box-sizing: border-box`)}>
                  <div {...S("display: flex; align-items: center; gap: 10px; min-width: 0")}>
                    <span {...S(`flex: 1 1 auto; min-width: 0; font-family: ${I($s0?.t?.titleFam)}; font-size: ${I($s0?.pvTitleFs)}; font-weight: 600; letter-spacing: ${I($s0?.t?.hTrack)}; text-transform: ${I($s0?.t?.hCase)}; line-height: 1.15; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                      {T($s0?.pvGreeting)}
                    </span>
                    <span {...S(`display: inline-flex; align-items: center; height: 26px; padding: 0 11px; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.primary)}; color: ${I($s0?.t?.primaryFg)}; box-shadow: ${I($s0?.t?.btnSh)}; font-size: 11px; font-weight: 500; white-space: nowrap`)}>
                      {"Add deal"}
                    </span>
                  </div>
                  <div {...S("display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px")}>
                    {A($s0?.pvStats).map((it, i) => {
                      const $s1 = { ...$s0, "s": it, $index: i };
                      return (<React.Fragment key={i}>
                        <span {...S(`display: flex; flex-direction: column; gap: 2px; padding: ${I($s1?.pvStatPad)}; background: ${I($s1?.t?.card)}; border: 1px solid ${I($s1?.t?.border)}; border-radius: ${I($s1?.t?.rTile)}; box-shadow: ${I($s1?.t?.shCard)}; min-width: 0`)}>
                          <span {...S(`font-size: 11px; font-weight: 500; color: ${I($s1?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                            {T($s1?.s?.label)}
                          </span>
                          <span {...S(`font-family: ${I($s1?.t?.numFam)}; font-size: 17px; font-weight: 600; letter-spacing: ${I($s1?.t?.nTrack)}; font-variant-numeric: tabular-nums; white-space: nowrap; transition: color 0.3s ease; color: ${I($s1?.s?.fg)}`)}>
                            {T($s1?.s?.value)}
                          </span>
                        </span>
                      </React.Fragment>);
                    })}
                  </div>
                  <div {...S(`flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; background: ${I($s0?.t?.card)}; border: 1px solid ${I($s0?.t?.border)}; border-radius: ${I($s0?.t?.rTile)}; box-shadow: ${I($s0?.t?.shCard)}; overflow: hidden`)}>
                    <div {...S(`display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-bottom: 1px solid ${I($s0?.t?.line)}`)}>
                      <span {...S("font-size: 13px; font-weight: 600")}>
                        {"Deals"}
                      </span>
                      <span {...S(`font-size: 11px; color: ${I($s0?.t?.mutedFg)}`)}>
                        {T($s0?.pvCount)}
                      </span>
                    </div>
                    {$s0?.pvEmpty ? (<>
                      <div {...S("flex: 1 1 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 12px; text-align: center")}>
                        <span {...S(`width: 34px; height: 34px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.tile)}; display: inline-flex; align-items: center; justify-content: center; color: ${I($s0?.t?.mutedFg)}`)}>
                          <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={"M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M9 13h6M9 17h4"} />
                          </svg>
                        </span>
                        <span {...S(`font-size: 12px; color: ${I($s0?.t?.mutedFg)}`)}>
                          {"Your deals show up here"}
                        </span>
                      </div>
                    </>) : null}
                    {$s0?.hasDeal ? (<>
                      <div className={"a-in"} {...S("display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 12px; font-size: 12px; white-space: nowrap")}>
                        <span {...S(`width: 22px; height: 22px; flex: 0 0 22px; border-radius: 11px; background: ${I($s0?.t?.fill)}; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600`)}>
                          {T($s0?.dealInit)}
                        </span>
                        <span {...S("flex: 1 1 auto; min-width: 0; font-weight: 500; overflow: hidden; text-overflow: ellipsis")}>
                          {T($s0?.dealBrand)}
                        </span>
                        {A($s0?.pvPlats).map((it, i) => {
                          const $s1 = { ...$s0, "pp": it, $index: i };
                          return (<React.Fragment key={i}>
                            <img src={$s1?.pp?.icon} alt={$s1?.pp?.label} width={"14"} height={"14"} {...S("display: block; width: 14px; height: 14px; border-radius: 3px")} />
                          </React.Fragment>);
                        })}
                        <span {...S(`display: inline-flex; align-items: center; height: 18px; padding: 0 7px; border-radius: ${I($s0?.t?.rPill)}; background: ${I($s0?.t?.okBg)}; color: ${I($s0?.t?.okFg)}; font-size: 11px; font-weight: 500`)}>
                          {"Active"}
                        </span>
                        <span {...S(`flex: 0 0 auto; font-family: ${I($s0?.t?.numFam)}; font-variant-numeric: tabular-nums`)}>
                          {T($s0?.dealAmt)}
                        </span>
                      </div>
                    </>) : null}
                  </div>
                  {$s0?.pvHasPlats ? (<>
                    <div className={"a-fade"} {...S(`display: flex; align-items: center; gap: 8px; font-size: 12px; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap`)}>
                      <span>
                        {"You post on"}
                      </span>
                      {A($s0?.pvPlats).map((it, i) => {
                        const $s1 = { ...$s0, "pp": it, $index: i };
                        return (<React.Fragment key={i}>
                          <img src={$s1?.pp?.icon} alt={$s1?.pp?.label} width={"16"} height={"16"} {...S("display: block; width: 16px; height: 16px; border-radius: 4px")} />
                        </React.Fragment>);
                      })}
                    </div>
                  </>) : null}
                </div>
              </div>
            </div>
          </div>
        </>) : null}
        {$s0?.sh?.show ? (<>
          <button type={"button"} aria-label={"Not now"} tabIndex={"-1"} className={"a-fade"} onClick={$s0?.sh?.later} {...S(`position: ${I($s0?.pvPos)}; top: 0; right: 0; bottom: 0; left: 0; z-index: 44; padding: 0; border: none; background: ${I($s0?.t?.overlay)}; cursor: default`)} />
          <div role={"dialog"} aria-modal={"true"} aria-labelledby={"ob-app-t"} className={"a-sheet"} {...S(`position: ${I($s0?.pvPos)}; left: 0; right: 0; bottom: 0; z-index: 45; max-width: 520px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 10px 24px calc(16px + env(safe-area-inset-bottom, 0px)); box-sizing: border-box; background: ${I($s0?.t?.card)}; color: ${I($s0?.t?.fg)}; border-radius: ${I($s0?.t?.rDialog)} ${I($s0?.t?.rDialog)} 0 0; box-shadow: ${I($s0?.t?.shPop)}`)}>
            <span aria-hidden={"true"} {...S(`width: 36px; height: 5px; border-radius: 3px; background: ${I($s0?.t?.borderStrong)}`)} />
            <div {...S("display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center")}>
              <span aria-hidden={"true"} {...S(`width: 64px; height: 64px; flex: 0 0 64px; box-sizing: border-box; border: 1px solid ${I($s0?.t?.border)}; border-radius: 16px; background: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 1px 2px rgba(0,0,0,0.06)`)}>
                <svg width={"34"} height={"29"} viewBox={"0 0 2029 1722"} aria-hidden={"true"} {...S("display: block")}>
                  <path fill={"#1F7AE0"} d={"M325.553 0.11436C357.82 -0.851434 390.344 4.39925 421.577 12.1099C506.351 33.0387 579.306 92.8684 628.981 163.1C648.617 190.863 665.004 221.256 682.357 250.477C714.91 305.296 746.394 360.846 779.411 415.372C792.242 436.561 805.088 458.322 818.991 478.81C853.846 530.177 928.98 628.305 990.503 643.014C1013.94 648.615 1037.46 645.591 1058.97 634.725C1078.92 624.656 1094.72 608.763 1110.74 593.552C1184.16 523.869 1237.02 434.688 1287.42 347.839C1299.09 327.74 1311.38 307.989 1322.85 287.786C1346.79 245.624 1371.62 198.953 1400.03 160.003C1431.42 116.962 1467.92 79.9142 1513.59 51.9883C1592.43 3.35327 1687.5 -11.5536 1777.44 10.6178C1861.41 31.3662 1933.82 84.3529 1979.02 158.109C2024.53 233.037 2040.98 310.935 2019.97 397.268C1988.25 527.6 1882.9 628.138 1749.42 647.874C1724.27 651.594 1693.72 650.686 1668.06 650.648L1562.66 650.457L1294.18 650.569C1229.3 650.36 1166.25 642.367 1109.31 677.354C1075.41 697.881 1051.07 731.066 1041.68 769.577C1024.74 841.175 1063.31 906.426 1099.22 965.078C1103.02 971.823 1114.46 985.726 1119.82 992.612C1140.88 1019.75 1162.84 1046.17 1185.68 1071.84C1264.51 1161.22 1337.81 1269.48 1345.12 1391.87C1355.92 1572.91 1205.73 1711.69 1031.77 1721.4C938.596 1726.86 847.128 1694.71 777.855 1632.13C733.34 1591.55 702.231 1538.38 688.665 1479.68C676.384 1428.85 679.574 1377.6 692.642 1327.29C710.038 1260.33 744.366 1197.92 785.127 1142.41C854.647 1047.73 998.351 921.921 991.042 795.526C987.346 731.658 941.997 680.383 882.362 660.534C837.4 645.57 776.985 650.524 728.979 650.558L429.507 650.401L351.229 650.568C319.765 650.635 286.204 651.2 255.381 644.239C194.201 631.235 150.38 605.052 104.113 565.316C-67.2929 418.104 -14.8418 150.672 172.337 43.4476C223.087 14.3754 266.379 3.16906 325.553 0.11436Z"} />
                </svg>
              </span>
              <div {...S("display: flex; flex-direction: column; gap: 4px")}>
                <h2 id={"ob-app-t"} {...S(`margin: 0; font-family: ${I($s0?.t?.titleFam)}; font-size: 23px; font-weight: 600; letter-spacing: ${I($s0?.t?.hTrack)}; text-transform: ${I($s0?.t?.hCase)}; line-height: 1.2`)}>
                  {T($s0?.sh?.title)}
                </h2>
                <span {...S(`font-size: 14px; line-height: 1.45; color: ${I($s0?.t?.mutedFg)}`)}>
                  {T($s0?.sh?.sub)}
                </span>
              </div>
            </div>
            {$s0?.sh?.hasDone ? (<>
              <div role={"status"} className={"a-pop"} {...S(`align-self: stretch; display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.okBg)}; color: ${I($s0?.t?.okFg)}; font-size: 14px; font-weight: 500`)}>
                <svg width={"17"} height={"17"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 17px")}>
                  <path d={"M20 6 9 17l-5-5"} />
                </svg>
                {T($s0?.sh?.done)}
              </div>
            </>) : null}
            {$s0?.sh?.hasWarn ? (<>
              <div role={"status"} className={"a-pop"} {...S(`align-self: stretch; display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.warnBg)}; color: ${I($s0?.t?.warnFg)}; font-size: 14px; font-weight: 500`)}>
                <svg width={"17"} height={"17"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 17px")}>
                  <path d={"M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"} />
                </svg>
                {T($s0?.sh?.warn)}
              </div>
            </>) : null}
            {$s0?.sh?.hasList ? (<>
              <ul {...S("align-self: stretch; margin: 0; padding: 4px 6px; list-style: none; display: flex; flex-direction: column; gap: 14px")}>
                {A($s0?.sh?.list).map((it, i) => {
                  const $s1 = { ...$s0, "b": it, $index: i };
                  return (<React.Fragment key={i}>
                    <li className={"a-in"} {...S(`animation-delay: ${I($s1?.b?.delay)}; display: flex; align-items: center; gap: 14px; font-size: 15px; line-height: 1.35`)}>
                      {$s1?.b?.isNum ? (<>
                        <span {...S(`width: 24px; height: 24px; flex: 0 0 24px; border-radius: 12px; background: ${I($s1?.t?.primary)}; color: ${I($s1?.t?.primaryFg)}; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; font-family: ${I($s1?.t?.numFam)}`)}>
                          {T($s1?.b?.n)}
                        </span>
                      </>) : null}
                      {$s1?.b?.isIcon ? (<>
                        <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 24px; color: ${I($s1?.t?.fg)}`)}>
                          <path d={$s1?.b?.icon} />
                        </svg>
                      </>) : null}
                      <span>
                        {T($s1?.b?.text)}
                      </span>
                    </li>
                  </React.Fragment>);
                })}
              </ul>
            </>) : null}
            <div {...S("align-self: stretch; display: flex; flex-direction: column; align-items: center; gap: 6px")}>
              <button type={"button"} className={"tb tp"} onClick={$s0?.sh?.act} {...S(`width: 100%; height: 52px; padding: 0 20px; border: none; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.primary)}; color: ${I($s0?.t?.primaryFg)}; box-shadow: ${I($s0?.t?.btnSh)}; font: inherit; font-size: 16px; font-weight: 600; cursor: pointer`)}>
                {T($s0?.sh?.btn)}
              </button>
              {$s0?.sh?.hasLater ? (<>
                <button type={"button"} className={"tb tg"} onClick={$s0?.sh?.later} {...S(`--hv: ${I($s0?.t?.fill)}; width: 100%; height: 44px; border: none; border-radius: ${I($s0?.t?.rCtl)}; background: transparent; color: ${I($s0?.t?.fg)}; font: inherit; font-size: 15px; font-weight: 500; cursor: pointer`)}>
                  {"Not now"}
                </button>
              </>) : null}
              {$s0?.sh?.hasFoot ? (<>
                <span {...S(`font-size: 12px; color: ${I($s0?.t?.mutedFg)}`)}>
                  {"Free to add. No App Store download."}
                </span>
              </>) : null}
            </div>
          </div>
        </>) : null}
        {$s0?.tip?.show ? (<>
          <div role={"status"} className={"a-pop"} {...S(`position: ${I($s0?.pvPos)}; top: calc(12px + env(safe-area-inset-top, 0px)); left: 12px; right: 12px; z-index: 45; max-width: 496px; margin: 0 auto; display: flex; align-items: flex-start; gap: 12px; padding: 16px 12px 16px 16px; box-sizing: border-box; border-radius: 18px; background: #111111; color: #FFFFFF; box-shadow: 0 20px 44px -14px rgba(0,0,0,0.5)`)}>
            <span aria-hidden={"true"} {...S("width: 40px; height: 40px; flex: 0 0 40px; border-radius: 12px; background: rgba(255,255,255,0.12); display: inline-flex; align-items: center; justify-content: center")}>
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                <path d={$s0?.tip?.icon} />
              </svg>
            </span>
            <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 4px")}>
              <span {...S("display: flex; align-items: baseline; gap: 8px")}>
                <span {...S("font-size: 15px; font-weight: 600")}>
                  {"Almost there"}
                </span>
                <span {...S("font-size: 12px; color: rgba(255,255,255,0.6)")}>
                  {"Step 2 of 2"}
                </span>
              </span>
              <span {...S("font-size: 14px; line-height: 1.45; color: rgba(255,255,255,0.92)")}>
                {T($s0?.tip?.text)}
              </span>
              <span {...S("font-size: 13px; line-height: 1.45; color: rgba(255,255,255,0.6)")}>
                {T($s0?.tip?.sub)}
              </span>
            </span>
            <button type={"button"} className={"tb"} onClick={$s0?.tip?.close} aria-label={"Close"} {...S("width: 32px; height: 32px; flex: 0 0 32px; margin-top: -6px; padding: 0; border: none; border-radius: 16px; background: transparent; color: rgba(255,255,255,0.7); display: inline-flex; align-items: center; justify-content: center; cursor: pointer")}>
              <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                <path d={"M18 6 6 18M6 6l12 12"} />
              </svg>
            </button>
          </div>
        </>) : null}
        <SAddDeal open={$s0?.add} mobile={$s0?.mob} color={$s0?.t?.id} dark={$s0?.dark} onClose={$s0?.closeAdd} onCreated={$s0?.onCreated} />
      </div>
  </>);
}

export const meta = {"props":{"step":{"editor":"enum","options":["name","photo","theme","about","deals","app","ready"],"default":"name"},"device":{"editor":"enum","options":["auto","iphone","inapp","android","desktop"],"default":"auto"},"appPhase":{"editor":"enum","options":["","hint","copied","installed","alertsOn","alertsOff"],"default":""},"err":{"editor":"enum","options":["none","name-empty","name-short","photo-type","photo-big","save"],"default":"none"},"vw":{"editor":"enum","options":["auto","390","820","1024"],"default":"auto"},"pv":{"editor":"boolean","default":false},"frame":{"editor":"boolean","default":false}},"preview":{"width":1440,"height":900}};
export default $r.defineBoard("SOnboard", Component, render, CSS, meta);
