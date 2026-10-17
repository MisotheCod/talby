// @ts-nocheck
/* eslint-disable */
'use client';
// SCommand: converted from design-source/boards/SCommand.dc.html.
// Markup, inline styles and logic are carried over exactly from the board.
// The logic class below is the board's own code, unchanged.
import * as React from 'react';
import * as $r from './_runtime';
import { DCLogic } from './_runtime';
import { SAMPLE_SEARCH } from './_data';


const CSS = "body, #dc-root{margin:0;font-synthesis:none}#dc-root .tb{transition:background-color .12s ease,color .12s ease,border-color .12s ease,opacity .12s ease,transform .12s ease}#dc-root .tb:active{transform:scale(.98)}#dc-root .tg:hover{background-color:var(--hv)!important}#dc-root .tt:hover{color:var(--fg)!important}#dc-root .tb:focus-visible{outline:2px solid var(--ring);outline-offset:2px}#dc-root .a-fade{animation:tFade .18s ease backwards}#dc-root .a-pop{animation:tPop .2s cubic-bezier(.2,.8,.3,1) backwards}#dc-root .a-in{animation:tIn .22s cubic-bezier(.2,.7,.2,1) backwards}@keyframes tFade{from{opacity:0}to{opacity:1}}@keyframes tPop{from{opacity:0;transform:translateY(-6px) scale(.985)}to{opacity:1;transform:none}}@keyframes tIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){#dc-root *, #dc-root *::before, #dc-root *::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}\n";

const Component = (() => {
class Component extends DCLogic {
  constructor(props) {
    super(props);
    var rec = null; try { rec = JSON.parse(window.localStorage.getItem('talby.recentSearch') || 'null'); } catch (e) {}
    var w = 1440; try { w = window.innerWidth || 1440; } catch (e) {}
    this.state = { q: '', hi: 0, scope: 'all', recent: rec && rec.length ? rec : ['late payments', 'CeraVe', '8500'], w: w };
    this.input = null; this.body = null; this.els = [];
  }
  componentDidMount() { var self = this; this._rs = function () { try { self.setState({ w: window.innerWidth }); } catch (e) {} }; try { window.addEventListener('resize', this._rs); } catch (e) {} }
  componentWillUnmount() { try { window.removeEventListener('resize', this._rs); } catch (e) {} }
  componentDidUpdate(prev) {
    if (this.props.open && !prev.open) { this.setState({ q: '', hi: 0, scope: 'all' }); var self = this; setTimeout(function () { try { self.input && self.input.focus(); } catch (e) {} }, 30); }
  }
  remember(q) {
    q = (q || '').trim(); if (!q) return;
    var r = [q].concat(this.state.recent.filter(function (x) { return x.toLowerCase() !== q.toLowerCase(); })).slice(0, 5);
    this.setState({ recent: r });
    try { window.localStorage.setItem('talby.recentSearch', JSON.stringify(r)); } catch (e) {}
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
    var self = this, p = this.props, st = this.state, dark = !!p.dark;
    var t = talby(p.color, dark); t.hover = t.hv; t.foot = t.hvr; t.hit = alpha(t.primary, t.dark ? 0.3 : 0.16);
    var b = 'display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-sizing: border-box; font: inherit; font-weight: 500; line-height: 1; white-space: nowrap; border-radius: ' + t.rCtl + '; cursor: pointer; flex-shrink: 0';
    var k = {
      icoS: b + '; width: 28px; height: 28px; padding: 0; border: none; background: transparent; color: ' + t.mutedFg + '; --hv: ' + t.fill,
      kbdBtn: b + '; height: 24px; padding: 0 8px; border: 1px solid ' + t.border + '; background: ' + t.card + '; color: ' + t.mutedFg + '; font-size: 11px; --hv: ' + t.fill,
      kbd: 'display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; padding: 0 4px; box-sizing: border-box; border-radius: 5px; border: 1px solid ' + t.border + '; background: ' + t.card + '; color: ' + t.mutedFg + '; font-size: 11px; font-weight: 500'
    };
    var standalone = typeof p.onClose !== 'function';
    var isOpen = p.open === undefined ? true : !!p.open;
    var mob = st.w < 640;
    var I = {
      plus: 'M5 12h14M12 5v14', upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
      wallet: 'M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4',
      todo: 'm3 17 2 2 4-4M3 7l2 2 4-4M13 6h8M13 12h8M13 18h8', idea: 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4',
      deals: 'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z',
      cal: 'M8 2v4M16 2v4M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM3 10h18',
      grid: 'M4 3h5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM15 3h5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM15 12h5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM4 16h5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1z',
      gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.73 1.17V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-2.73-1.17l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3.36 14H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.17-2.73l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9.82 3.4H10a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 2.73 1.17l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 20.6 10H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
      moon: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z', half: 'M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zM12 2v20', alert: 'M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
      video: 'm16 13 5.22 3.48a.5.5 0 0 0 .78-.42V7.94a.5.5 0 0 0-.78-.42L16 11M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z',
      trend: 'M22 7 13.5 15.5 8.5 10.5 2 17M16 7h6v6', bell: 'M10.27 21a2 2 0 0 0 3.46 0M3.26 15.33A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.67C19.41 13.96 18 12.5 18 8A6 6 0 0 0 6 8c0 4.5-1.41 5.96-2.74 7.33',
      link: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
      card: 'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM2 10h20', user: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z'
    };
    // Search data comes in as props.account.search (see _data.ts). Without it search shows the design sample.
    var SRCH = (p.account && p.account.search) || SAMPLE_SEARCH;
    var DEALS = SRCH.deals, PAYS = SRCH.payments, CAL = SRCH.calendar, TODOS = SRCH.todos, IDEAS = SRCH.ideas;
    var PAGES = [['Overview', I.grid, 'SOverview.dc.html'], ['Deals', I.deals, 'SDeals.dc.html'], ['Calendar', I.cal, 'SCalendar.dc.html'], ['Payments', I.wallet, 'SPayments.dc.html'], ['Income summary', I.trend, 'SIncome.dc.html'], ['Ideas', I.idea, 'SIdeas.dc.html'], ['To-dos', I.todo, 'STodos.dc.html'], ['Settings', I.gear, 'SSettings.dc.html']];
    var ACTIONS = [['New deal', I.plus, '', 'new', 'Start from scratch'], ['Upload a contract or CSV', I.upload, '', 'upload', 'Talby fills in the deal'], ['Import from Notion', '', '', 'notion', 'Connect and pull deals'], ['Record a payment', I.wallet, 'SPayments.dc.html', '', 'Mark money as received'], ['Add a to-do', I.todo, 'STodos.dc.html', '', ''], ['Save an idea', I.idea, 'SIdeas.dc.html', '', ''], ['Change theme', I.half, '', 'appearance', 'Studio, Sand, Mac and more'], [dark ? 'Switch to light mode' : 'Switch to dark mode', I.moon, '', 'mode', '']];
    var SETS = [['Account settings', I.user, 'account'], ['Notification settings', I.bell, 'notifications'], ['Connections', I.link, 'connections'], ['Billing and plan', I.card, 'billing']];
    var raw = st.q || '', q = raw.trim().toLowerCase(), qNum = q.replace(/[$,\s]/g, '');
    var isNum = /^\d{3,}$/.test(qNum);
    function split(label) {
      if (!q || isNum) return { pre: label, hit: '', post: '', hasHit: false };
      var i = label.toLowerCase().indexOf(q);
      if (i < 0) return { pre: label, hit: '', post: '', hasHit: false };
      return { pre: label.slice(0, i), hit: label.slice(i, i + q.length), post: label.slice(i + q.length), hasHit: true };
    }
    function hit(s) { return !q || s.toLowerCase().indexOf(q) !== -1; }
    function amtHit(n) { return isNum && String(n).indexOf(qNum) !== -1; }
    function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
    var PAY = { over: ['Overdue', '#EF4444', t.destr], inv: ['Invoiced', '#F59E0B', t.fg], not: ['Not invoiced', t.mutedFg, t.mutedFg], paid: ['Paid', '#22C55E', t.fg], neg: ['Negotiating', '#F59E0B', t.fg] };
    var flat = [], idx = 0;
    function mk(o) {
      var my = idx++, on = st.hi === my;
      var sp = split(o.label);
      var it = Object.assign({ href: o.href || null, isAvatar: false, isIcon: true, isNotion: false, icon: '', l: '', avBg: t.fill, avFg: t.fg, sub: '', subFg: t.mutedFg, meta: '', metaFg: t.fg, badge: '', badgeFg: t.fg, badgeDot: 'transparent' }, o, sp);
      it.hasSub = !!it.sub; it.hasMeta = !!it.meta; it.hasBadge = !!it.badge;
      it.bg = on ? t.hover : 'transparent'; it.arrowOp = on ? '1' : '0';
      it.enter = function () { if (self.state.hi !== my) self.setState({ hi: my }); };
      it.ref = function (el) { self.els[my] = el; };
      it.act = function () { self.remember(self.state.q); if (o.tab) { try { window.localStorage.setItem('talby.settingsTab', o.tab); } catch (e) {} } if (o.action && typeof p.onAction === 'function') p.onAction(o.action, o.payload); if (!o.href && typeof p.onClose === 'function') p.onClose(); };
      flat.push(it);
      return it;
    }
    var scope = st.scope;
    function want(s) { return scope === 'all' || scope === s; }
    var lim = scope === 'all' ? (q ? 4 : 3) : 30;
    var groups = [];
    var counts = {};
    function addGroup(key, label, list, max) {
      counts[key] = list.length;
      if (!want(key) || !list.length) return;
      var m = max || lim, shown = list.slice(0, m);
      groups.push({ key: key, label: label, items: shown.map(mk), hasMore: list.length > shown.length, moreLabel: 'Show all ' + list.length, more: function () { self.setState({ scope: key, hi: 0 }); } });
    }
    var ans = null, ansOn = false;
    if (q) {
      var A = null;
      var AN = SRCH.answers || {};
      if (/late|overdue|behind/.test(q) && AN.late) A = { icon: I.alert, title: AN.late.title, sub: AN.late.sub, cta: 'Open payments', href: 'SPayments.dc.html', bg: t.badBg, fg: t.badFg };
      else if (/week|today|tomorrow|coming up|next/.test(q) && AN.week) A = { icon: I.cal, title: AN.week.title, sub: AN.week.sub, cta: 'Open calendar', href: 'SCalendar.dc.html', bg: t.postBg, fg: t.postFg };
      else if (/owe|owed|unpaid|coming in|expected/.test(q) && AN.owed) A = { icon: I.wallet, title: AN.owed.title, sub: AN.owed.sub, cta: 'Open payments', href: 'SPayments.dc.html', bg: t.soft, fg: t.primary };
      else if (/paid|received|income|made|earn/.test(q) && AN.paid) A = { icon: I.trend, title: AN.paid.title, sub: AN.paid.sub, cta: 'Income summary', href: 'SIncome.dc.html', bg: t.okBg, fg: t.okFg };
      if (A) {
        var my = idx++; ansOn = st.hi === my;
        ans = { icon: A.icon, title: A.title, sub: A.sub, cta: A.cta, href: A.href, iconBg: A.bg, iconFg: A.fg, bg: ansOn ? t.hover : t.card, ring: 'inset 0 0 0 1px ' + (ansOn ? t.border : t.line),
          go: function () { self.remember(self.state.q); }, ref: function (el) { self.els[my] = el; }, enter: function () { if (self.state.hi !== my) self.setState({ hi: my }); } };
        flat.push(ans);
      }
    }
    if (!q) {
      if (scope === 'all') {
        addGroup('attention', 'Needs attention', (SRCH.attention || []).map(function (x) {
          if (x.kind === 'late') return { label: x.label, sub: x.sub, subFg: t.destr, meta: x.amount ? fmt(x.amount) : '', isAvatar: true, isIcon: false, l: x.label.charAt(0), avBg: t.badBg, avFg: t.badFg, href: x.href };
          return { label: x.label, sub: x.sub, icon: I.video, avBg: t.postBg, avFg: t.postFg, href: x.href };
        }), 3);
        addGroup('actions', 'Quick actions', ACTIONS.map(function (a) { return { label: a[0], icon: a[1], href: a[2] || null, action: a[3], sub: a[4], isNotion: a[3] === 'notion', isIcon: a[3] !== 'notion' }; }), 8);
        addGroup('pages', 'Jump to', PAGES.map(function (x) { return { label: x[0], icon: x[1], href: x[2] }; }), 8);
      } else if (scope === 'deals') addGroup('deals', 'Recent deals', DEALS.map(function (d) { var pz = PAY[d[2]]; return { label: d[0], sub: d[3], subFg: d[2] === 'over' ? t.destr : t.mutedFg, meta: fmt(d[1]), isAvatar: true, isIcon: false, l: d[0].charAt(0), href: 'SDeal.dc.html', badge: pz[0], badgeDot: pz[1], badgeFg: pz[2] }; }));
      else if (scope === 'payments') addGroup('payments', 'Payments', PAYS.map(function (x) { var pz = PAY[x[2]]; return { label: x[0], sub: x[3], subFg: x[2] === 'over' ? t.destr : t.mutedFg, meta: fmt(x[1]), icon: I.wallet, href: 'SPayments.dc.html', badge: pz[0], badgeDot: pz[1], badgeFg: pz[2] }; }));
      else if (scope === 'calendar') addGroup('calendar', 'Calendar', CAL.map(function (x) { return { label: x[0], sub: x[1], icon: x[2] === 'post' ? I.video : I.cal, avBg: x[2] === 'post' ? t.postBg : (x[2] === 'over' ? t.badBg : t.fill), avFg: x[2] === 'post' ? t.postFg : (x[2] === 'over' ? t.badFg : t.fg), href: 'SCalendar.dc.html' }; }));
      else if (scope === 'todos') addGroup('todos', 'To-dos', TODOS.map(function (x) { return { label: x[0], sub: x[1], icon: I.todo, href: 'STodos.dc.html' }; }));
      else if (scope === 'ideas') addGroup('ideas', 'Ideas', IDEAS.map(function (x) { return { label: x[0], sub: x[1], icon: I.idea, href: 'SIdeas.dc.html' }; }));
      else if (scope === 'pages') addGroup('pages', 'Pages', PAGES.map(function (x) { return { label: x[0], icon: x[1], href: x[2] }; }));
    } else {
      addGroup('deals', 'Deals', DEALS.filter(function (d) { return hit(d[0]) || amtHit(d[1]); }).map(function (d) { var pz = PAY[d[2]]; return { label: d[0], sub: d[3], subFg: d[2] === 'over' ? t.destr : t.mutedFg, meta: fmt(d[1]), isAvatar: true, isIcon: false, l: d[0].charAt(0), href: 'SDeal.dc.html', badge: pz[0], badgeDot: pz[1], badgeFg: pz[2] }; }));
      addGroup('payments', 'Payments', PAYS.filter(function (x) { return hit(x[0]) || amtHit(x[1]) || hit(x[3]); }).map(function (x) { var pz = PAY[x[2]]; return { label: x[0], sub: x[3], subFg: x[2] === 'over' ? t.destr : t.mutedFg, meta: fmt(x[1]), icon: I.wallet, href: 'SPayments.dc.html', badge: pz[0], badgeDot: pz[1], badgeFg: pz[2] }; }));
      addGroup('calendar', 'Calendar', CAL.filter(function (x) { return hit(x[0]) || hit(x[1]); }).map(function (x) { return { label: x[0], sub: x[1], icon: x[2] === 'post' ? I.video : I.cal, avBg: x[2] === 'post' ? t.postBg : (x[2] === 'over' ? t.badBg : t.fill), avFg: x[2] === 'post' ? t.postFg : (x[2] === 'over' ? t.badFg : t.fg), href: 'SCalendar.dc.html' }; }));
      addGroup('todos', 'To-dos', TODOS.filter(function (x) { return hit(x[0]) || hit(x[1]); }).map(function (x) { return { label: x[0], sub: x[1], icon: I.todo, href: 'STodos.dc.html' }; }));
      addGroup('ideas', 'Ideas', IDEAS.filter(function (x) { return hit(x[0]); }).map(function (x) { return { label: x[0], sub: x[1], icon: I.idea, href: 'SIdeas.dc.html' }; }));
      addGroup('pages', 'Pages', PAGES.filter(function (x) { return hit(x[0]); }).map(function (x) { return { label: x[0], icon: x[1], href: x[2] }; }));
      if (scope === 'all') {
        addGroup('actions', 'Actions', ACTIONS.filter(function (a) { return hit(a[0]); }).map(function (a) { return { label: a[0], icon: a[1], href: a[2] || null, action: a[3], sub: a[4], isNotion: a[3] === 'notion', isIcon: a[3] !== 'notion' }; }), 99);
        addGroup('settings', 'Settings', SETS.filter(function (s) { return hit(s[0]); }).map(function (s) { return { label: s[0], icon: s[1], href: 'SSettings.dc.html', tab: s[2] }; }), 99);
      }
    }
    var askItem = null;
    if (q) {
      var am = idx++, aon = st.hi === am;
      askItem = { href: null, bg: aon ? t.hover : 'transparent', arrowOp: aon ? '1' : '0', ref: function (el) { self.els[am] = el; }, enter: function () { if (self.state.hi !== am) self.setState({ hi: am }); },
        act: function () { var qq = self.state.q; self.remember(qq); if (typeof p.onAction === 'function') p.onAction('ask', qq); if (typeof p.onClose === 'function') p.onClose(); } };
      flat.push(askItem);
    }
    var total = idx;
    var SC = [['all', 'All'], ['deals', 'Deals'], ['payments', 'Payments'], ['calendar', 'Calendar'], ['todos', 'To-dos'], ['ideas', 'Ideas'], ['pages', 'Pages']];
    var scopes = SC.map(function (s) {
      var on = scope === s[0], n = counts[s[0]];
      return { label: s[1], on: on, hasCount: !!q && s[0] !== 'all' && n !== undefined, count: String(n || 0), bg: on ? t.primary : 'transparent', fg: on ? t.primaryFg : t.mutedFg, border: on ? t.primary : t.border, hv: on ? t.primary : t.fill,
        pick: function () { self.setState({ scope: s[0], hi: 0 }); try { self.input && self.input.focus(); } catch (e) {} } };
    });
    function scrollTo(i) { var el = self.els[i]; if (el && el.scrollIntoView) { try { el.scrollIntoView({ block: 'nearest' }); } catch (e) {} } }
    return {
      t: t, k: k, isOpen: isOpen, notMob: !mob,
      vars: '--hv: ' + t.hover + '; --fg: ' + t.fg + '; --ring: ' + t.ring,
      pos: standalone ? 'absolute' : 'fixed', bgBehind: standalone ? t.page : 'transparent', overlay: standalone ? 'transparent' : (dark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)'),
      wrapPad: mob ? '0' : (standalone ? '40px 24px' : '88px 16px 16px'), dlgH: mob ? '100%' : 'auto', dlgBorder: mob ? 'none' : ('1px solid ' + t.border), dlgRadius: mob ? '0px' : t.rCard,
      bodyMaxH: mob ? 'none' : '440px',
      q: raw, hasQ: !!q, setQ: function (e) { self.setState({ q: e.target.value, hi: 0 }); }, clearQ: function () { self.setState({ q: '', hi: 0 }); try { self.input && self.input.focus(); } catch (e) {} },
      showRecent: !q && scope === 'all' && st.recent.length > 0,
      recent: st.recent.slice(0, 4).map(function (x) { return { label: x, pick: function () { self.setState({ q: x, hi: 0 }); } }; }),
      hasAnswer: !!ans, ans: ans || { href: null, title: '', sub: '', cta: '', icon: '', iconBg: 'transparent', iconFg: 'transparent', bg: 'transparent', ring: 'none', go: null, ref: null, enter: null },
      groups: groups, none: !!q && groups.length === 0 && !ans,
      askItem: askItem || { href: null, bg: 'transparent', arrowOp: '0', ref: null, enter: null, act: null },
      footNote: q ? (total - 1) + ((total - 1) === 1 ? ' result' : ' results') : 'Searches deals, payments, calendar, to-dos and ideas',
      onKey: function (e) {
        if (e.key === 'Escape') { if (self.state.q) self.setState({ q: '', hi: 0 }); else if (typeof p.onClose === 'function') p.onClose(); return; }
        if (e.key === 'ArrowDown') { if (e.preventDefault) e.preventDefault(); var n = Math.min(total - 1, self.state.hi + 1); self.setState({ hi: n }); scrollTo(n); return; }
        if (e.key === 'ArrowUp') { if (e.preventDefault) e.preventDefault(); var u = Math.max(0, self.state.hi - 1); self.setState({ hi: u }); scrollTo(u); return; }
        if (e.key === 'Enter') { var el = self.els[self.state.hi]; if (el && el.click) { if (e.preventDefault) e.preventDefault(); el.click(); } }
      },
      inputRef: function (el) { self.input = el; }, bodyRef: function (el) { self.body = el; },
      scopes: scopes, ph: (function () { var w = 1440; try { w = window.innerWidth || 1440; } catch (e) {} return w < 640 ? 'Search everything' : 'Search deals, payments, to-dos and more'; })(),
      close: function () { if (typeof p.onClose === 'function') p.onClose(); }
    };
  }
}
return Component;
})();

function render($s0, host) {
  const { A, T, I, V0, S, HS, H } = $r;
  return (<>
      {$s0?.isOpen ? (<>
        <div {...S(`position: ${I($s0?.pos)}; top: 0; right: 0; bottom: 0; left: 0; z-index: 80; display: flex; justify-content: center; align-items: flex-start; padding: ${I($s0?.wrapPad)}; box-sizing: border-box; background: ${I($s0?.bgBehind)}; font-family: ${I($s0?.t?.bodyFam)}; font-size: 14px; color: ${I($s0?.t?.fg)}; -webkit-font-smoothing: antialiased; ${I($s0?.vars)}`)}>
          <button type={"button"} aria-label={"Close search"} className={"a-fade"} onClick={$s0?.close} {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; border: none; padding: 0; background: ${I($s0?.overlay)}; cursor: default`)} />
          <div role={"dialog"} aria-modal={"true"} aria-label={"Search"} className={"a-pop"} {...S(`position: relative; width: 640px; max-width: 100%; height: ${I($s0?.dlgH)}; display: flex; flex-direction: column; background: ${I($s0?.t?.card)}; border: ${I($s0?.dlgBorder)}; border-radius: ${I($s0?.dlgRadius)}; box-shadow: ${I($s0?.t?.shPop)}; overflow: hidden`)}>
            <div {...S(`display: flex; align-items: center; gap: 12px; height: 56px; padding: 0 14px 0 18px; border-bottom: 1px solid ${I($s0?.t?.line)}`)}>
              <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 18px")}>
                <circle cx={"11"} cy={"11"} r={"8"} />
                <path d={"m21 21-4.3-4.3"} />
              </svg>
              <input aria-label={"Search"} placeholder={$s0?.ph} value={V0($s0?.q, "")} onChange={$s0?.setQ} onKeyDown={$s0?.onKey} autoComplete={"off"} {...S(`flex: 1 1 auto; min-width: 0; height: 54px; border: none; outline: none; background: transparent; font: inherit; font-size: 16px; color: ${I($s0?.t?.fg)}; padding: 0`, $s0?.inputRef)} />
              {$s0?.hasQ ? (<>
                <button type={"button"} className={"tb tg"} onClick={$s0?.clearQ} aria-label={"Clear search"} {...S($s0?.k?.icoS)}>
                  <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M18 6 6 18M6 6l12 12"} />
                  </svg>
                </button>
              </>) : null}
              <button type={"button"} className={"tb tg"} onClick={$s0?.close} {...S($s0?.k?.kbdBtn)}>
                {"Esc"}
              </button>
            </div>
            <div role={"tablist"} aria-label={"Search in"} {...S(`display: flex; align-items: center; gap: 6px; padding: 10px 14px; overflow-x: auto; border-bottom: 1px solid ${I($s0?.t?.line)}`)}>
              {A($s0?.scopes).map((it, i) => {
                const $s1 = { ...$s0, "sc": it, $index: i };
                return (<React.Fragment key={i}>
                  <button type={"button"} role={"tab"} className={"tb tg tt"} aria-selected={$s1?.sc?.on} onClick={$s1?.sc?.pick} {...S(`--hv: ${I($s1?.sc?.hv)}; --fg: ${I($s1?.sc?.fg)}; display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 11px; box-sizing: border-box; border: 1px solid ${I($s1?.sc?.border)}; border-radius: ${I($s1?.t?.rCtl)}; background: ${I($s1?.sc?.bg)}; color: ${I($s1?.sc?.fg)}; font: inherit; font-size: 13px; font-weight: 500; white-space: nowrap; flex-shrink: 0; cursor: pointer`)}>
                    {T($s1?.sc?.label)}
                    {$s1?.sc?.hasCount ? (<>
                      <span {...S("font-size: 12px; opacity: 0.7; font-variant-numeric: tabular-nums")}>
                        {T($s1?.sc?.count)}
                      </span>
                    </>) : null}
                  </button>
                </React.Fragment>);
              })}
            </div>
            <div {...S(`flex: 1 1 auto; min-height: 0; max-height: ${I($s0?.bodyMaxH)}; overflow-y: auto; padding: 6px 8px 8px`, $s0?.bodyRef)}>
              {$s0?.showRecent ? (<>
                <div className={"a-in"} {...S("display: flex; align-items: center; gap: 6px; flex-wrap: wrap; padding: 10px 8px 6px")}>
                  <span {...S(`font-size: 12px; font-weight: 500; color: ${I($s0?.t?.mutedFg)}; margin-right: 4px`)}>
                    {"Recent"}
                  </span>
                  {A($s0?.recent).map((it, i) => {
                    const $s1 = { ...$s0, "rc": it, $index: i };
                    return (<React.Fragment key={i}>
                      <button type={"button"} className={"tb tg"} onClick={$s1?.rc?.pick} {...S(`--hv: ${I($s1?.t?.fillHover)}; display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 10px; border: none; border-radius: ${I($s1?.t?.rCtl)}; background: ${I($s1?.t?.fill)}; color: ${I($s1?.t?.fg)}; font: inherit; font-size: 12px; font-weight: 500; white-space: nowrap; cursor: pointer`)}>
                        <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s1?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5M12 7v5l4 2"} />
                        </svg>
                        {T($s1?.rc?.label)}
                      </button>
                    </React.Fragment>);
                  })}
                </div>
              </>) : null}
              {$s0?.hasAnswer ? (<>
                <a href={H($s0?.ans?.href)} className={"tb a-in"} onClick={$s0?.ans?.go} onMouseEnter={$s0?.ans?.enter} {...S(`display: flex; align-items: flex-start; gap: 14px; margin: 8px 4px 6px; padding: 14px 16px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.ans?.bg)}; box-shadow: ${I($s0?.ans?.ring)}; color: ${I($s0?.t?.fg)}; text-decoration: none`, $s0?.ans?.ref)}>
                  <span {...S(`width: 34px; height: 34px; flex: 0 0 34px; border-radius: 17px; background: ${I($s0?.ans?.iconBg)}; color: ${I($s0?.ans?.iconFg)}; display: inline-flex; align-items: center; justify-content: center`)}>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={$s0?.ans?.icon} />
                    </svg>
                  </span>
                  <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 4px")}>
                    <span {...S(`font-size: 12px; font-weight: 500; color: ${I($s0?.t?.mutedFg)}`)}>
                      {"Answer"}
                    </span>
                    <span {...S("font-size: 16px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                      {T($s0?.ans?.title)}
                    </span>
                    <span {...S(`color: ${I($s0?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                      {T($s0?.ans?.sub)}
                    </span>
                  </span>
                  <span {...S("align-self: center; display: inline-flex; align-items: center; gap: 4px; flex: 0 0 auto; font-size: 13px; font-weight: 500; white-space: nowrap")}>
                    {T($s0?.ans?.cta)}
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M5 12h14M12 5l7 7-7 7"} />
                    </svg>
                  </span>
                </a>
              </>) : null}
              {A($s0?.groups).map((it, i) => {
                const $s1 = { ...$s0, "g": it, $index: i };
                return (<React.Fragment key={i}>
                  <div className={"a-in"} {...S("padding: 4px 0")}>
                    <div {...S(`display: flex; align-items: center; justify-content: space-between; padding: 8px 10px 4px; font-size: 12px; font-weight: 500; color: ${I($s1?.t?.mutedFg)}`)}>
                      <span>
                        {T($s1?.g?.label)}
                      </span>
                      {$s1?.g?.hasMore ? (<>
                        <button type={"button"} className={"tb tg"} onClick={$s1?.g?.more} {...S(`--hv: ${I($s1?.t?.fill)}; height: 22px; padding: 0 8px; border: none; border-radius: ${I($s1?.t?.rCtl)}; background: transparent; color: ${I($s1?.t?.mutedFg)}; font: inherit; font-size: 12px; font-weight: 500; cursor: pointer`)}>
                          {T($s1?.g?.moreLabel)}
                        </button>
                      </>) : null}
                    </div>
                    {A($s1?.g?.items).map((it, i) => {
                      const $s2 = { ...$s1, "it": it, $index: i };
                      return (<React.Fragment key={i}>
                        <a href={H($s2?.it?.href)} className={"tb"} onClick={$s2?.it?.act} onMouseMove={$s2?.it?.enter} {...S(`display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 6px 10px; box-sizing: border-box; border-radius: ${I($s2?.t?.rItem)}; background: ${I($s2?.it?.bg)}; color: ${I($s2?.t?.fg)}; text-decoration: none; cursor: pointer`, $s2?.it?.ref)}>
                          {$s2?.it?.isAvatar ? (<>
                            <span {...S(`width: 28px; height: 28px; flex: 0 0 28px; border-radius: 14px; background: ${I($s2?.it?.avBg)}; color: ${I($s2?.it?.avFg)}; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600`)}>
                              {T($s2?.it?.l)}
                            </span>
                          </>) : null}
                          {$s2?.it?.isIcon ? (<>
                            <span {...S(`width: 28px; height: 28px; flex: 0 0 28px; border-radius: ${I($s2?.t?.rSm)}; background: ${I($s2?.it?.avBg)}; color: ${I($s2?.it?.avFg)}; display: inline-flex; align-items: center; justify-content: center`)}>
                              <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={$s2?.it?.icon} />
                              </svg>
                            </span>
                          </>) : null}
                          {$s2?.it?.isNotion ? (<>
                            <span {...S(`width: 28px; height: 28px; flex: 0 0 28px; box-sizing: border-box; border-radius: ${I($s2?.t?.rSm)}; background: #FFFFFF; border: 1px solid #E5E5E5; color: #191919; display: inline-flex; align-items: center; justify-content: center; font-family: Georgia, serif; font-size: 14px; font-weight: 700`)}>
                              {"N"}
                            </span>
                          </>) : null}
                          <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 1px")}>
                            <span {...S("white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500")}>
                              {T($s2?.it?.pre)}
                              {$s2?.it?.hasHit ? (<>
                                <mark {...S(`background: ${I($s2?.t?.hit)}; color: inherit; border-radius: 3px; padding: 0 1px`)}>
                                  {T($s2?.it?.hit)}
                                </mark>
                              </>) : null}
                              {T($s2?.it?.post)}
                            </span>
                            {$s2?.it?.hasSub ? (<>
                              <span {...S(`font-size: 12px; color: ${I($s2?.it?.subFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                                {T($s2?.it?.sub)}
                              </span>
                            </>) : null}
                          </span>
                          {$s2?.it?.hasMeta ? (<>
                            <span {...S(`flex: 0 0 auto; font-size: 13px; font-weight: 600; color: ${I($s2?.it?.metaFg)}; white-space: nowrap; font-variant-numeric: tabular-nums`)}>
                              {T($s2?.it?.meta)}
                            </span>
                          </>) : null}
                          {$s2?.it?.hasBadge ? (<>
                            <span {...S(`display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: 0 8px; box-sizing: border-box; border: 1px solid ${I($s2?.t?.border)}; border-radius: ${I($s2?.t?.rCtl)}; background: ${I($s2?.t?.card)}; color: ${I($s2?.it?.badgeFg)}; font-size: 12px; font-weight: 500; white-space: nowrap; flex: 0 0 auto`)}>
                              <span {...S(`width: 6px; height: 6px; border-radius: 3px; background: ${I($s2?.it?.badgeDot)}`)} />
                              {T($s2?.it?.badge)}
                            </span>
                          </>) : null}
                          <span {...S(`width: 16px; flex: 0 0 16px; display: inline-flex; justify-content: center; color: ${I($s2?.t?.mutedFg)}; opacity: ${I($s2?.it?.arrowOp)}; transition: opacity 0.12s ease`)}>
                            <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={"M9 10 4 15l5 5M20 4v7a4 4 0 0 1-4 4H4"} />
                            </svg>
                          </span>
                        </a>
                      </React.Fragment>);
                    })}
                  </div>
                </React.Fragment>);
              })}
              {$s0?.none ? (<>
                <div className={"a-fade"} {...S("display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 34px 16px 18px; text-align: center")}>
                  <span {...S("font-weight: 500")}>
                    {"Nothing matches \""}{T($s0?.q)}{"\""}
                  </span>
                  <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                    {"Try a brand name, an amount like 8500, or ask Talby below."}
                  </span>
                </div>
              </>) : null}
              {$s0?.hasQ ? (<>
                <a href={H($s0?.askItem?.href)} className={"tb"} onClick={$s0?.askItem?.act} onMouseMove={$s0?.askItem?.enter} {...S(`display: flex; align-items: center; gap: 12px; min-height: 48px; margin-top: 4px; padding: 6px 10px; box-sizing: border-box; border-top: 1px solid ${I($s0?.t?.line)}; border-radius: ${I($s0?.t?.rItem)}; background: ${I($s0?.askItem?.bg)}; color: ${I($s0?.t?.fg)}; text-decoration: none; cursor: pointer`, $s0?.askItem?.ref)}>
                  <span {...S(`width: 28px; height: 28px; flex: 0 0 28px; border-radius: 14px; background: ${I($s0?.t?.soft)}; display: inline-flex; align-items: center; justify-content: center`)}>
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.t?.primary} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <rect x={"3"} y={"8"} width={"15"} height={"12"} rx={"3.5"} />
                      <path d={"M10.5 8V5.5"} />
                      <circle cx={"10.5"} cy={"4.5"} r={"1"} />
                      <circle cx={"8"} cy={"14"} r={"1"} fill={$s0?.t?.primary} stroke={"none"} />
                      <circle cx={"13"} cy={"14"} r={"1"} fill={$s0?.t?.primary} stroke={"none"} />
                      <path d={"M19.5 2l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8z"} fill={$s0?.t?.primary} stroke={"none"} />
                    </svg>
                  </span>
                  <span {...S("flex: 1 1 auto; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                    <span {...S("font-weight: 500")}>
                      {"Ask Talby"}
                    </span>
                    <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                      {" about \""}{T($s0?.q)}{"\""}
                    </span>
                  </span>
                  <span {...S(`width: 16px; flex: 0 0 16px; display: inline-flex; justify-content: center; color: ${I($s0?.t?.mutedFg)}; opacity: ${I($s0?.askItem?.arrowOp)}`)}>
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M9 10 4 15l5 5M20 4v7a4 4 0 0 1-4 4H4"} />
                    </svg>
                  </span>
                </a>
              </>) : null}
            </div>
            {$s0?.notMob ? (<>
              <div {...S(`display: flex; align-items: center; gap: 14px; height: 40px; padding: 0 16px; border-top: 1px solid ${I($s0?.t?.line)}; background: ${I($s0?.t?.foot)}; color: ${I($s0?.t?.mutedFg)}; font-size: 12px; white-space: nowrap`)}>
                <span {...S("display: inline-flex; align-items: center; gap: 5px")}>
                  <span {...S($s0?.k?.kbd)}>
                    {"↑"}
                  </span>
                  <span {...S($s0?.k?.kbd)}>
                    {"↓"}
                  </span>
                  {"to move"}
                </span>
                <span {...S("display: inline-flex; align-items: center; gap: 5px")}>
                  <span {...S($s0?.k?.kbd)}>
                    {"↵"}
                  </span>
                  {"to open"}
                </span>
                <span {...S("display: inline-flex; align-items: center; gap: 5px")}>
                  <span {...S($s0?.k?.kbd)}>
                    {"esc"}
                  </span>
                  {"to close"}
                </span>
                <span {...S("flex: 1 1 auto")} />
                <span>
                  {T($s0?.footNote)}
                </span>
              </div>
            </>) : null}
          </div>
        </div>
      </>) : null}
  </>);
}

export const meta = {"props":{"open":{"editor":"boolean","default":true},"color":{"editor":"enum","options":["studio","sand","mac","stationery","editorial"],"default":"studio"},"dark":{"editor":"boolean","default":false},"onClose":{"editor":null},"onAction":{"editor":null}},"preview":{"width":720,"height":760}};
export default $r.defineBoard("SCommand", Component, render, CSS, meta);
