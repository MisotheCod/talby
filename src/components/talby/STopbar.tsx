// @ts-nocheck
/* eslint-disable */
'use client';
// STopbar: converted from design-source/boards/STopbar.dc.html.
// Markup, inline styles and logic are carried over exactly from the board.
// The logic class below is the board's own code, unchanged.
import * as React from 'react';
import * as $r from './_runtime';
import { DCLogic } from './_runtime';


const CSS = "body, #dc-root{margin:0;font-synthesis:none}#dc-root .tb{transition:background-color .15s ease,color .15s ease,border-color .15s ease,box-shadow .15s ease,opacity .15s ease,transform .12s ease}#dc-root .tb:active{transform:scale(.97)}#dc-root .tg:hover{background-color:var(--hv)!important}#dc-root .tp:hover{opacity:.88}#dc-root .tt:hover{color:var(--fg)!important}#dc-root .tb:focus-visible{outline:2px solid var(--ring);outline-offset:2px}#dc-root .t-bell:hover svg.bell{animation:tRing .6s ease;transform-origin:50% 2px}#dc-root .a-drop{animation:tDrop .16s cubic-bezier(.2,.8,.3,1) backwards}#dc-root .a-fade{animation:tFade .2s ease backwards}#dc-root .a-ping{animation:tPing 2s ease-out infinite}@keyframes tDrop{from{opacity:0;transform:translateY(-4px) scale(.98)}to{opacity:1;transform:none}}@keyframes tFade{from{opacity:0}to{opacity:1}}@keyframes tPing{0%{box-shadow:0 0 0 0 rgba(239,68,68,.55)}70%,100%{box-shadow:0 0 0 6px rgba(239,68,68,0)}}@keyframes tRing{0%{transform:rotate(0)}20%{transform:rotate(14deg)}40%{transform:rotate(-12deg)}60%{transform:rotate(8deg)}80%{transform:rotate(-4deg)}100%{transform:rotate(0)}}@media (prefers-reduced-motion:reduce){#dc-root *, #dc-root *::before, #dc-root *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}\n";

const Component = (() => {
class Component extends DCLogic {
  constructor(props) {
    super(props);
    var w = 1440; try { w = window.innerWidth || 1440; } catch (e) {}
    var standalone = typeof props.onAdd !== 'function';
    var s = props.start || (standalone ? 'add' : 'none');
    this.state = { menu: s === 'add' || s === 'bell' ? s : null, read: {}, tab: 'all', w: w };
  }
  componentDidMount() { var self = this; this._rs = function () { try { self.setState({ w: window.innerWidth }); } catch (e) {} }; try { window.addEventListener('resize', this._rs); } catch (e) {} }
  componentWillUnmount() { try { window.removeEventListener('resize', this._rs); } catch (e) {} }
  componentDidUpdate(prev) { if (prev.start !== this.props.start && this.props.start) this.setState({ menu: this.props.start === 'none' ? null : this.props.start }); }
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
    function theme(color,dark){var t=talby(color,dark);t.hover=t.hv;return t;}
    var self = this, p = this.props, st = this.state, dark = !!p.dark;
    var t = theme(p.color, dark, p.radius);
    var standalone = typeof p.onAdd !== 'function';
    var mob = p.mobile === undefined ? st.w < 768 : !!p.mobile, wide = st.w >= 1100;
    var b = 'display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 32px; padding: 0 14px; box-sizing: border-box; font: inherit; font-size: 14px; font-weight: 500; line-height: 1; white-space: nowrap; border-radius: ' + t.rCtl + '; cursor: pointer; text-decoration: none; flex-shrink: 0';
    var k = {
      btnP: b + '; border: none; background: ' + t.primary + '; color: ' + t.primaryFg + '; box-shadow: ' + t.btnSh,
      ico: b + '; border: none; background: transparent; color: ' + t.fg + '; width: 32px; height: 32px; padding: 0',
      icoP: b + '; border: none; background: ' + t.primary + '; color: ' + t.primaryFg + '; width: 32px; height: 32px; padding: 0',
      gSm: b + '; border: none; background: transparent; color: ' + t.fg + '; height: 28px; padding: 0 10px; font-size: 13px',
      tabs: 'display: inline-flex; align-items: center; gap: 2px; height: 32px; padding: 3px; box-sizing: border-box; border-radius: ' + t.rCtl + '; background: ' + t.fill,
      kbd: 'display: inline-flex; align-items: center; height: 22px; padding: 0 7px; border-radius: ' + t.rCtl + '; background: ' + t.fill + '; color: ' + t.mutedFg + '; font-size: 11px; font-weight: 500; flex-shrink: 0'
    };
    function tabStyle(on) { return 'display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 100%; padding: 0 12px; box-sizing: border-box; border: none; border-radius: ' + t.rCtl + '; background: ' + (on ? t.tabOn : 'transparent') + '; color: ' + (on ? t.fg : t.mutedFg) + '; box-shadow: ' + (on ? t.tabSh : 'none') + '; font: inherit; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer'; }
    var KIND = dark ? {
      late: ['rgba(239,68,68,0.16)', '#FCA5A5', 'M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z'],
      post: ['rgba(139,92,246,0.2)', '#C4B5FD', 'm16 13 5.22 3.48a.5.5 0 0 0 .78-.42V7.94a.5.5 0 0 0-.78-.42L16 11M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z'],
      due: ['rgba(245,158,11,0.18)', '#FCD34D', 'M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z'],
      paid: ['rgba(34,197,94,0.16)', '#86EFAC', 'M20 6 9 17l-5-5'],
      todo: ['#262626', '#FAFAFA', 'm3 17 2 2 4-4M3 7l2 2 4-4M13 6h8M13 12h8M13 18h8']
    } : {
      late: ['#FDECEC', '#DC2626', 'M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z'],
      post: ['#F3EEFF', '#7C3AED', 'm16 13 5.22 3.48a.5.5 0 0 0 .78-.42V7.94a.5.5 0 0 0-.78-.42L16 11M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z'],
      due: ['#FEF4E2', '#D97706', 'M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z'],
      paid: ['#E9F8EE', '#16A34A', 'M20 6 9 17l-5-5'],
      todo: ['#F5F5F5', '#0A0A0A', 'm3 17 2 2 4-4M3 7l2 2 4-4M13 6h8M13 12h8M13 18h8']
    };
    var N = p.quiet ? [] : p.account ? (p.account.notifications || []).map(function (n) { return [n.id, n.group, n.kind, n.title, n.body, n.time, n.href, n.read ? 1 : 0]; }) : [
      [1, 'Today', 'late', 'Tums payment is 3 days late', '$8,500 was due Oct 11. Draft a reminder to send.', '9:02 AM', 'SPayments.dc.html', 0],
      [2, 'Today', 'post', 'CeraVe posts tomorrow', 'Your video goes live Thursday, Oct 15.', '8:30 AM', 'SCalendar.dc.html', 0],
      [3, 'Today', 'due', 'Nioxin pays in 5 days', '$1,200 is due Monday, Oct 19.', '8:30 AM', 'SPayments.dc.html', 0],
      [4, 'Yesterday', 'post', 'Dramamine Video 1 is live', 'Add a pay by date so Talby can remind you.', '4:15 PM', 'SDeal.dc.html', 0],
      [5, 'Yesterday', 'todo', 'New to-do for Dramamine', 'Send the vendor form and your W9.', '11:40 AM', 'STodos.dc.html', 0],
      [6, 'Earlier', 'late', 'Golden Corral payment is late', '$10,000 was due Oct 5.', 'Oct 6', 'SPayments.dc.html', 1],
      [7, 'Earlier', 'paid', 'Gruns paid you $300', 'Payment 2 of 2. This deal is paid in full.', 'Oct 6', 'SPayments.dc.html', 1],
      [8, 'Earlier', 'late', 'Haleon Centrum payment is late', '$10,550 was due Sep 28.', 'Sep 29', 'SPayments.dc.html', 1]
    ];
    function isRead(n) { return !!n[7] || !!st.read[n[0]]; }
    var unread = N.filter(function (n) { return !isRead(n); }).length;
    var shown = N.filter(function (n) { return st.tab === 'all' || !isRead(n); });
    var groups = ['Today', 'Yesterday', 'Earlier'].map(function (g) {
      return { label: g, items: shown.filter(function (n) { return n[1] === g; }).map(function (n) {
        var kd = KIND[n[2]], rd = isRead(n);
        return { title: n[3], sub: n[4], time: n[5], href: n[6], bg: kd[0], fg: kd[1], icon: kd[2], fw: rd ? '400' : '500', dot: rd ? 'transparent' : t.accent,
          open: function () { var o = Object.assign({}, self.state.read); o[n[0]] = true; self.setState({ read: o, menu: null }); } };
      }) };
    }).filter(function (g) { return g.items.length > 0; });
    var ADDS = [
      ['new', 'New deal', 'Start from scratch', 'M5 12h14M12 5v14', 'N'],
      ['upload', 'Upload', 'Contract or CSV', 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12', 'U'],
      ['notion', 'Import from Notion', 'Connect and pull deals', '', 'I']
    ];
    var menu = st.menu;
    function setMenu(m) { self.setState({ menu: self.state.menu === m ? null : m }); }
    return {
      t: t, k: k, mob: mob, notMob: !mob, title: p.title || 'Overview',
      vars: '--hv: ' + t.hover + '; --fg: ' + t.fg + '; --ring: ' + t.ring,
      wrapPad: standalone ? '8px 24px 0' : '0', wrapMinH: standalone ? '600px' : '0px', wrapBg: standalone ? t.page : 'transparent',
      navLabel: mob ? 'Open menu' : 'Toggle sidebar', navIcon: mob ? 'M4 6h16M4 12h16M4 18h16' : 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 3v18',
      nav: function () { self.setState({ menu: null }); if (typeof p.onNav === 'function') p.onNav(); },
      search: function () { self.setState({ menu: null }); if (typeof p.onSearch === 'function') p.onSearch(); },
      appearance: function () { self.setState({ menu: null }); if (typeof p.onAppearance === 'function') p.onAppearance(); },
      searchW: wide ? '260px' : '200px', searchLabel: wide ? 'Search everything' : 'Search',
      emp: p.quiet ? { bg: t.tile, fg: t.mutedFg, sw: '2', icon: 'M10.27 21a2 2 0 0 0 3.46 0M3.26 15.33A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.67C19.41 13.96 18 12.5 18 8A6 6 0 0 0 6 8c0 4.5-1.41 5.96-2.74 7.33', title: 'No notifications yet', sub: 'Talby lets you know before a post goes live and when money is due.' } : { bg: t.okBg, fg: t.okFg, sw: '2.4', icon: 'M20 6 9 17l-5-5', title: 'You are all caught up', sub: 'New alerts about payments and posts show up here.' },
      bellOpen: menu === 'bell', addOpen: menu === 'add', bellBg: menu === 'bell' ? t.fill : 'transparent',
      toggleBell: function () { setMenu('bell'); }, toggleAdd: function () { setMenu('add'); }, closeAll: function () { self.setState({ menu: null }); },
      chev: menu === 'add' ? 'rotate(180deg)' : 'none', plusRot: menu === 'add' ? 'rotate(45deg)' : 'none',
      hasUnread: unread > 0, noUnread: unread === 0, unreadLabel: unread + ' new', markOp: unread ? '1' : '0.4',
      bellLabel: unread ? 'Notifications, ' + unread + ' unread' : 'Notifications',
      markAll: function () { var o = {}; N.forEach(function (n) { o[n[0]] = true; }); self.setState({ read: o }); },
      tabs: [['all', 'All'], ['unread', 'Unread']].map(function (x) { var on = st.tab === x[0]; return { label: x[1] + (x[0] === 'unread' && unread ? ' (' + unread + ')' : ''), on: on, style: tabStyle(on), pick: function () { self.setState({ tab: x[0] }); } }; }),
      groups: groups, noneShown: shown.length === 0, listMaxH: mob ? '60vh' : '420px',
      toSettings: function () { try { window.localStorage.setItem('talby.settingsTab', 'notifications'); } catch (e) {} self.setState({ menu: null }); },
      popPos: mob ? 'fixed' : 'absolute', popLeft: mob ? '8px' : 'auto',
      bellTop: mob ? '60px' : '42px', bellRight: mob ? '8px' : '-44px', bellW: mob ? 'auto' : '384px',
      addTop: mob ? '60px' : '42px', addRight: mob ? '8px' : '0px', addW: mob ? '288px' : '300px',
      adds: ADDS.map(function (a) { return { label: a[1], sub: a[2], icon: a[3], key: a[4], isNotion: a[0] === 'notion', isIcon: a[0] !== 'notion', tileBg: a[0] === 'new' ? t.primary : t.fill, tileFg: a[0] === 'new' ? t.primaryFg : t.fg,
        pick: function () { if (typeof p.onAdd === 'function') { self.setState({ menu: null }); p.onAdd(a[0]); } } }; })
    };
  }
}
return Component;
})();

function render($s0, host) {
  const { A, T, I, V0, S, HS, H } = $r;
  return (<>
      <div {...S(`position: relative; box-sizing: border-box; padding: ${I($s0?.wrapPad)}; min-height: ${I($s0?.wrapMinH)}; background: ${I($s0?.wrapBg)}; font-family: ${I($s0?.t?.bodyFam)}; font-size: 14px; line-height: 1.43; color: ${I($s0?.t?.fg)}; -webkit-font-smoothing: antialiased; ${I($s0?.vars)}`)}>
        <header {...S("position: relative; z-index: 40; display: flex; align-items: center; gap: 6px; height: 56px")}>
          <button type={"button"} className={"tb tg"} onClick={$s0?.nav} aria-label={$s0?.navLabel} {...S($s0?.k?.ico)}>
            <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
              <path d={$s0?.navIcon} />
            </svg>
          </button>
          <span {...S(`width: 1px; height: 16px; margin: 0 6px; background: ${I($s0?.t?.borderStrong)}`)} />
          <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
            {T($s0?.title)}
          </span>
          <div {...S("flex: 1 1 auto")} />
          {$s0?.notMob ? (<>
            <button type={"button"} className={"tb tg"} onClick={$s0?.search} {...S(`--hv: ${I($s0?.t?.hoverCard)}; display: inline-flex; align-items: center; gap: 8px; width: ${I($s0?.searchW)}; height: 34px; padding: 0 6px 0 12px; box-sizing: border-box; border: 1px solid ${I($s0?.t?.border)}; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.card)}; color: ${I($s0?.t?.mutedFg)}; font: inherit; font-size: 14px; text-align: left; cursor: pointer`)}>
              <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 15px")}>
                <circle cx={"11"} cy={"11"} r={"8"} />
                <path d={"m21 21-4.3-4.3"} />
              </svg>
              <span {...S("flex: 1 1 auto; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                {T($s0?.searchLabel)}
              </span>
              <span {...S($s0?.k?.kbd)}>
                {"⌘K"}
              </span>
            </button>
          </>) : null}
          {$s0?.mob ? (<>
            <button type={"button"} className={"tb tg"} onClick={$s0?.search} aria-label={"Search"} {...S($s0?.k?.ico)}>
              <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                <circle cx={"11"} cy={"11"} r={"8"} />
                <path d={"m21 21-4.3-4.3"} />
              </svg>
            </button>
          </>) : null}
          <button type={"button"} className={"tb tg"} onClick={$s0?.appearance} aria-label={"Appearance"} aria-haspopup={"dialog"} {...S($s0?.k?.ico)}>
            <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
              <path d={"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 2v20"} />
              <path d={"M12 6a6 6 0 0 1 0 12z"} fill={"currentColor"} stroke={"none"} />
            </svg>
          </button>
          <div {...S("position: relative")}>
            <button type={"button"} className={"tb tg t-bell"} onClick={$s0?.toggleBell} aria-label={$s0?.bellLabel} aria-haspopup={"dialog"} aria-expanded={$s0?.bellOpen} {...S(`position: relative; background: ${I($s0?.bellBg)}; ${I($s0?.k?.ico)}`)}>
              <svg className={"bell"} width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                <path d={"M10.27 21a2 2 0 0 0 3.46 0M3.26 15.33A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.67C19.41 13.96 18 12.5 18 8A6 6 0 0 0 6 8c0 4.5-1.41 5.96-2.74 7.33"} />
              </svg>
              {$s0?.hasUnread ? (<>
                <span className={"a-ping"} {...S(`position: absolute; top: 6px; right: 7px; width: 7px; height: 7px; border-radius: 4px; background: #EF4444; box-shadow: 0 0 0 2px ${I($s0?.t?.page)}`)} />
              </>) : null}
            </button>
            {$s0?.bellOpen ? (<>
              <div onClick={$s0?.closeAll} {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 1")} />
              <section role={"dialog"} aria-label={"Notifications"} className={"a-drop"} {...S(`position: ${I($s0?.popPos)}; top: ${I($s0?.bellTop)}; right: ${I($s0?.bellRight)}; left: ${I($s0?.popLeft)}; z-index: 2; width: ${I($s0?.bellW)}; display: flex; flex-direction: column; background: ${I($s0?.t?.card)}; color: ${I($s0?.t?.fg)}; border: 1px solid ${I($s0?.t?.border)}; border-radius: ${I($s0?.t?.rCard)}; box-shadow: ${I($s0?.t?.shPop)}; overflow: hidden; transform-origin: top right`)}>
                <div {...S("display: flex; align-items: center; gap: 8px; padding: 14px 10px 10px 16px")}>
                  <span {...S("font-weight: 600; font-size: 15px")}>
                    {"Notifications"}
                  </span>
                  {$s0?.hasUnread ? (<>
                    <span {...S(`display: inline-flex; align-items: center; height: 20px; padding: 0 7px; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.primary)}; color: ${I($s0?.t?.primaryFg)}; font-size: 11px; font-weight: 600; font-variant-numeric: tabular-nums`)}>
                      {T($s0?.unreadLabel)}
                    </span>
                  </>) : null}
                  <div {...S("flex: 1 1 auto")} />
                  <button type={"button"} className={"tb tg"} onClick={$s0?.markAll} aria-disabled={$s0?.noUnread} {...S(`opacity: ${I($s0?.markOp)}; ${I($s0?.k?.gSm)}`)}>
                    {"Mark all read"}
                  </button>
                </div>
                <div {...S("padding: 0 16px 10px")}>
                  <div role={"tablist"} aria-label={"Show"} {...S(`display: flex; ${I($s0?.k?.tabs)}`)}>
                    {A($s0?.tabs).map((it, i) => {
                      const $s1 = { ...$s0, "tb": it, $index: i };
                      return (<React.Fragment key={i}>
                        <button type={"button"} role={"tab"} className={"tb tt"} aria-selected={$s1?.tb?.on} onClick={$s1?.tb?.pick} {...S(`flex: 1 1 0; ${I($s1?.tb?.style)}`)}>
                          {T($s1?.tb?.label)}
                        </button>
                      </React.Fragment>);
                    })}
                  </div>
                </div>
                <div {...S(`max-height: ${I($s0?.listMaxH)}; overflow-y: auto; padding: 0 6px 6px; border-top: 1px solid ${I($s0?.t?.line)}`)}>
                  {A($s0?.groups).map((it, i) => {
                    const $s1 = { ...$s0, "g": it, $index: i };
                    return (<React.Fragment key={i}>
                      <div {...S(`padding: 12px 10px 4px; font-size: 12px; font-weight: 500; color: ${I($s1?.t?.mutedFg)}`)}>
                        {T($s1?.g?.label)}
                      </div>
                      {A($s1?.g?.items).map((it, i) => {
                        const $s2 = { ...$s1, "n": it, $index: i };
                        return (<React.Fragment key={i}>
                          <a href={H($s2?.n?.href)} className={"tb tg"} onClick={$s2?.n?.open} {...S(`--hv: ${I($s2?.t?.hover)}; display: flex; align-items: center; gap: 12px; min-height: 58px; padding: 8px 10px; box-sizing: border-box; border-radius: ${I($s2?.t?.rItem)}; color: ${I($s2?.t?.fg)}; text-decoration: none`)}>
                            <span {...S(`width: 34px; height: 34px; flex: 0 0 34px; border-radius: 17px; background: ${I($s2?.n?.bg)}; color: ${I($s2?.n?.fg)}; display: inline-flex; align-items: center; justify-content: center`)}>
                              <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={$s2?.n?.icon} />
                              </svg>
                            </span>
                            <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                              <span {...S(`font-weight: ${I($s2?.n?.fw)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                                {T($s2?.n?.title)}
                              </span>
                              <span {...S(`font-size: 13px; color: ${I($s2?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                                {T($s2?.n?.sub)}
                              </span>
                            </span>
                            <span {...S("flex: 0 0 auto; display: flex; flex-direction: column; align-items: flex-end; gap: 6px")}>
                              <span {...S(`font-size: 12px; color: ${I($s2?.t?.mutedFg)}; white-space: nowrap`)}>
                                {T($s2?.n?.time)}
                              </span>
                              <span {...S(`width: 7px; height: 7px; border-radius: 4px; background: ${I($s2?.n?.dot)}; transition: background-color 0.2s ease`)} />
                            </span>
                          </a>
                        </React.Fragment>);
                      })}
                    </React.Fragment>);
                  })}
                  {$s0?.noneShown ? (<>
                    <div className={"a-fade"} {...S("display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 36px 16px 30px; text-align: center")}>
                      <span {...S(`width: 40px; height: 40px; border-radius: 20px; background: ${I($s0?.emp?.bg)}; color: ${I($s0?.emp?.fg)}; display: inline-flex; align-items: center; justify-content: center`)}>
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={$s0?.emp?.sw} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={$s0?.emp?.icon} />
                        </svg>
                      </span>
                      <span {...S("font-weight: 500")}>
                        {T($s0?.emp?.title)}
                      </span>
                      <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                        {T($s0?.emp?.sub)}
                      </span>
                    </div>
                  </>) : null}
                </div>
                <div {...S(`display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 10px 8px 16px; border-top: 1px solid ${I($s0?.t?.line)}`)}>
                  <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap`)}>
                    {"Payments, posts and to-dos"}
                  </span>
                  <a href={H("SSettings.dc.html")} className={"tb tg"} onClick={$s0?.toSettings} {...S($s0?.k?.gSm)}>
                    {"Settings"}
                  </a>
                </div>
              </section>
            </>) : null}
          </div>
          <div {...S("position: relative; margin-left: 4px")}>
            {$s0?.notMob ? (<>
              <button type={"button"} className={"tb tp"} onClick={$s0?.toggleAdd} aria-haspopup={"menu"} aria-expanded={$s0?.addOpen} {...S(`padding: 0 10px 0 12px; ${I($s0?.k?.btnP)}`)}>
                <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M5 12h14M12 5v14"} />
                </svg>
                {"Add deal"}
                <span {...S("width: 1px; height: 16px; margin: 0 2px 0 4px; background: currentColor; opacity: 0.25")} />
                <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`transform: ${I($s0?.chev)}; transition: transform 0.2s ease`)}>
                  <path d={"m6 9 6 6 6-6"} />
                </svg>
              </button>
            </>) : null}
            {$s0?.mob ? (<>
              <button type={"button"} className={"tb tp"} onClick={$s0?.toggleAdd} aria-label={"Add deal"} aria-haspopup={"menu"} aria-expanded={$s0?.addOpen} {...S($s0?.k?.icoP)}>
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`transform: ${I($s0?.plusRot)}; transition: transform 0.2s ease`)}>
                  <path d={"M5 12h14M12 5v14"} />
                </svg>
              </button>
            </>) : null}
            {$s0?.addOpen ? (<>
              <div onClick={$s0?.closeAll} {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 1")} />
              <div role={"menu"} aria-label={"Add a deal"} className={"a-drop"} {...S(`position: ${I($s0?.popPos)}; top: ${I($s0?.addTop)}; right: ${I($s0?.addRight)}; z-index: 2; width: ${I($s0?.addW)}; background: ${I($s0?.t?.card)}; color: ${I($s0?.t?.fg)}; border: 1px solid ${I($s0?.t?.border)}; border-radius: ${I($s0?.t?.rTile)}; box-shadow: ${I($s0?.t?.shPop)}; padding: 6px; box-sizing: border-box; transform-origin: top right`)}>
                {A($s0?.adds).map((it, i) => {
                  const $s1 = { ...$s0, "m": it, $index: i };
                  return (<React.Fragment key={i}>
                    <button type={"button"} role={"menuitem"} className={"tb tg"} onClick={$s1?.m?.pick} {...S(`--hv: ${I($s1?.t?.hover)}; display: flex; align-items: center; gap: 12px; width: 100%; min-height: 56px; padding: 8px 10px 8px 8px; box-sizing: border-box; border: none; border-radius: ${I($s1?.t?.rItem)}; background: transparent; color: ${I($s1?.t?.fg)}; font: inherit; text-align: left; cursor: pointer`)}>
                      {$s1?.m?.isNotion ? (<>
                        <span {...S(`width: 36px; height: 36px; flex: 0 0 36px; box-sizing: border-box; border-radius: ${I($s1?.t?.rSm)}; background: #FFFFFF; border: 1px solid #E5E5E5; color: #191919; display: inline-flex; align-items: center; justify-content: center; font-family: Georgia, serif; font-size: 17px; font-weight: 700`)}>
                          <img src="/logo-notion.png" alt="Notion" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', boxSizing: 'border-box', borderRadius: 'inherit' }}/>
                        </span>
                      </>) : null}
                      {$s1?.m?.isIcon ? (<>
                        <span {...S(`width: 36px; height: 36px; flex: 0 0 36px; border-radius: ${I($s1?.t?.rSm)}; background: ${I($s1?.m?.tileBg)}; color: ${I($s1?.m?.tileFg)}; display: inline-flex; align-items: center; justify-content: center`)}>
                          <svg width={"17"} height={"17"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={$s1?.m?.icon} />
                          </svg>
                        </span>
                      </>) : null}
                      <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                        <span {...S("font-weight: 500; white-space: nowrap")}>
                          {T($s1?.m?.label)}
                        </span>
                        <span {...S(`font-size: 13px; color: ${I($s1?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                          {T($s1?.m?.sub)}
                        </span>
                      </span>
                    </button>
                  </React.Fragment>);
                })}
              </div>
            </>) : null}
          </div>
        </header>
      </div>
  </>);
}

export const meta = {"props":{"title":{"editor":"text","default":"Overview"},"color":{"editor":"enum","options":["studio","sand","mac","stationery","editorial"],"default":"studio"},"dark":{"editor":"boolean","default":false},"start":{"editor":"enum","options":["add","bell","none"],"default":"add"},"quiet":{"editor":"boolean","default":false},"mobile":{"editor":null},"collapsed":{"editor":null},"onNav":{"editor":null},"onSearch":{"editor":null},"onAppearance":{"editor":null},"onAdd":{"editor":null}},"preview":{"width":1100,"height":620}};
export default $r.defineBoard("STopbar", Component, render, CSS, meta);
