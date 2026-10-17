// @ts-nocheck
/* eslint-disable */
'use client';
// SSidebar: converted from design-source/boards/SSidebar.dc.html.
// Markup, inline styles and logic are carried over exactly from the board.
// The logic class below is the board's own code, unchanged.
import * as React from 'react';
import * as $r from './_runtime';
import { DCLogic } from './_runtime';
import { SAMPLE_ACCOUNT, TalbyDates } from './_data';


const CSS = "body, #dc-root{margin:0;font-synthesis:none}#dc-root .tb{transition:background-color .15s ease,color .15s ease,border-color .15s ease,box-shadow .15s ease,opacity .15s ease,transform .12s ease}#dc-root .tb:active{transform:scale(.97)}#dc-root .tg:hover{background-color:var(--hv)!important}#dc-root .tb:focus-visible{outline:2px solid var(--ring);outline-offset:2px}#dc-root .a-fade{animation:tFade .16s ease backwards}#dc-root .a-drop{animation:tDrop .16s cubic-bezier(.2,.8,.3,1) backwards}@keyframes tFade{from{opacity:0}to{opacity:1}}@keyframes tDrop{from{opacity:0;transform:translateY(4px) scale(.98)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){#dc-root *, #dc-root *::before, #dc-root *::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}\n";

const Component = (() => {
class Component extends DCLogic {
  constructor(props) { super(props); this.state = { user: false, tip: null }; }
  componentDidUpdate(prev) { if (prev.collapsed !== this.props.collapsed && this.state.tip) this.setState({ tip: null }); }
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
    function theme(color,dark){var t=talby(color,dark);t.hover=t.navHv;t.icOn=t.accent;t.shSide=t.dark?'none':t.shCard;t.tipBg=t.fg;t.tipFg=t.card;t.rAvatar=t.r?'16px':'0px';return t;}
    var self = this, p = this.props, st = this.state;
    var ACC = p.account || SAMPLE_ACCOUNT, CNT = ACC.counts || {}, TR = ACC.trial || {};
    var t = theme(p.color, !!p.dark, p.radius);
    var drawer = !!p.drawer, open = drawer || !p.collapsed, active = p.active || 'deals';
    var k = { ico: 'display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; padding: 0; box-sizing: border-box; border: none; border-radius: ' + t.rItem + '; background: transparent; color: ' + t.fg + '; cursor: pointer' };
    var I = {
      overview: 'M4 3h5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM15 3h5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM15 12h5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM4 16h5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1z',
      deals: 'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z',
      calendar: 'M8 2v4M16 2v4M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM3 10h18',
      payments: 'M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4',
      ideas: 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4',
      todos: 'm3 17 2 2 4-4M3 7l2 2 4-4M13 6h8M13 12h8M13 18h8'
    };
    function tipAt(label, badge, warn) {
      return function (ev) {
        if (open || !ev || !ev.currentTarget) return;
        var r = ev.currentTarget.getBoundingClientRect();
        self.setState({ tip: { label: label, badge: badge || '', hasBadge: !!badge, badgeBg: warn ? '#EF4444' : (t.dark ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.16)'), badgeFg: warn ? '#FFFFFF' : t.tipFg, top: Math.round(r.top + r.height / 2) + 'px', left: Math.round(r.right + 12) + 'px' } });
      };
    }
    function item(key, label, href, badge, warn) {
      if (p.fresh) { badge = ''; warn = false; }
      var on = key === active;
      return { label: label, aria: badge ? label + ', ' + badge : label, href: href, icon: I[key], cur: on ? 'page' : null, bg: on ? t.navOn : 'transparent', hv: on ? t.navOn : t.hover, fw: on ? '500' : '400', ic: on ? t.icOn : t.mutedFg,
        hasBadge: !!badge, badge: badge || '', warn: !!warn, dotOnly: !open && !!warn, badgeBg: warn ? (t.dark ? 'rgba(239,68,68,0.15)' : '#FEF2F2') : 'transparent', badgeFg: warn ? t.destr : t.mutedFg,
        enter: tipAt(label, badge, warn) };
    }
    var setOn = active === 'settings', hasOnSettings = typeof p.onSettings === 'function';
    var MENU = [
      ['account', 'Account', 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z'],
      ['appearance', 'Appearance', 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 2v20'],
      ['notifications', 'Notifications', 'M10.27 21a2 2 0 0 0 3.46 0M3.26 15.33A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.67C19.41 13.96 18 12.5 18 8A6 6 0 0 0 6 8c0 4.5-1.41 5.96-2.74 7.33'],
      ['connections', 'Connections', 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'],
      ['billing', 'Billing', 'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM2 10h20']
    ];
    var plan = p.plan || 'active', goBill = function () { try { window.localStorage.setItem('talby.settingsTab', 'billing'); } catch (e) {} };
    var PL = {
      trial: { title: 'Free trial', right: TR.daysLeft + (TR.daysLeft === 1 ? ' day left' : ' days left'), sub: 'Your trial ends ' + TalbyDates.md(TR.endsOn) + '. Upgrade to keep adding deals.', cta: 'Upgrade', dot: t.accent, hasBar: true, pct: TR.usedPct + '%', icon: 'M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', icFg: t.mutedFg, name: 'Free trial, ' + TR.daysLeft + (TR.daysLeft === 1 ? ' day left' : ' days left') },
      pastdue: { title: 'Payment failed', right: '', sub: 'Update your card by ' + TalbyDates.md(ACC.pastDueBy) + ' to keep full access.', cta: 'Update card', dot: '#F59E0B', hasBar: false, pct: '0%', icon: 'M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM2 10h20', icFg: t.warnFg, name: 'Unlimited, payment due' },
      readonly: { title: 'Trial ended', right: '', sub: 'You can still see everything. Upgrade to add or change deals.', cta: 'Upgrade', dot: t.mutedFg, hasBar: false, pct: '0%', icon: 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4', icFg: t.mutedFg, name: 'Trial ended' },
      canceled: { title: 'Plan canceled', right: '', sub: 'You can still see everything. Restart to add or change deals.', cta: 'Restart plan', dot: t.mutedFg, hasBar: false, pct: '0%', icon: 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4', icFg: t.mutedFg, name: 'Canceled' }
    };
    var pl = plan === 'trial' ? PL.trial : null, plName = PL[plan] ? PL[plan].name : 'Talby Unlimited';
    var uName = p.user || ACC.displayName, uHandle = p.handle || ACC.handle, uInit = uName.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() || 'T';
    if ((p.user || p.account) && uName.indexOf('.') < 0) uInit = uName.slice(0, 1).toUpperCase();
    return {
      userName: uName, userHandle: uHandle, userInit: uInit,
      planCard: !!pl && open, planIcon: !!pl && !open, planName: plName,
      pl: pl ? Object.assign({}, pl, { go: goBill, aria: pl.name, enter: tipAt(pl.name) }) : { title: '', right: '', sub: '', cta: '', dot: 'transparent', hasBar: false, pct: '0%', icon: '', icFg: t.mutedFg, go: goBill, aria: '', enter: function () {} },
      t: t, k: k, open: open, drawer: drawer,
      vars: '--hv: ' + t.hover + '; --ring: ' + t.ring,
      outerPad: drawer ? '0' : '8px 0 8px 8px', cardBorder: drawer ? 'none' : ('1px solid ' + t.sideBorder), cardRadius: drawer ? '0px' : t.rCard, cardShadow: drawer ? 'none' : t.shSide,
      padX: open ? '10px' : '8px', itemPad: open ? '10px' : '0px', userPad: open ? '6px' : '0px', justify: open ? 'flex-start' : 'center',
      ovf: open ? 'auto' : 'visible', groupGap: open ? '18px' : '6px',
      close: function () { if (typeof p.onClose === 'function') p.onClose(); },
      groups: [
        { label: 'Manage', rule: false, items: [item('overview', 'Overview', 'SOverview.dc.html'), item('deals', 'Deals', 'SDeals.dc.html', CNT.deals ? String(CNT.deals) : ''), item('calendar', 'Calendar', 'SCalendar.dc.html'), item('payments', 'Payments', 'SPayments.dc.html', CNT.late ? CNT.late + ' late' : '', !!CNT.late)] },
        { label: 'Create', rule: !open, items: [item('ideas', 'Ideas', 'SIdeas.dc.html', CNT.ideas ? String(CNT.ideas) : ''), item('todos', 'To-dos', 'STodos.dc.html', CNT.todos ? String(CNT.todos) : '')] }
      ],
      settings: { cur: setOn ? 'page' : null, bg: setOn ? t.navOn : 'transparent', hv: setOn ? t.navOn : t.hover, fw: setOn ? '500' : '400', ic: setOn ? t.icOn : t.mutedFg, enter: tipAt('Settings') },
      userOpen: st.user, userBg: st.user ? t.hover : 'transparent', menuLeft: open ? '8px' : '68px',
      toggleUser: function () { self.setState({ user: !self.state.user, tip: null }); },
      userEnter: tipAt(uName),
      hideTip: function () { if (self.state.tip) self.setState({ tip: null }); },
      tipOn: !!st.tip && !open, tip: st.tip || { label: '', badge: '', hasBadge: false, top: '0px', left: '0px' },
      menuLinks: !hasOnSettings, menuBtns: hasOnSettings,
      menu: MENU.map(function (m) { return { label: m[1], icon: m[2], bg: 'transparent',
        go: function () { try { window.localStorage.setItem('talby.settingsTab', m[0]); } catch (e) {} self.setState({ user: false }); if (hasOnSettings) p.onSettings(m[0]); } }; })
    };
  }
}
return Component;
})();

function render($s0, host) {
  const { A, T, I, V0, S, HS, H } = $r;
  return (<>
      <div {...S(`position: relative; box-sizing: border-box; width: 100%; height: 100vh; padding: ${I($s0?.outerPad)}; background: ${I($s0?.t?.page)}; font-family: ${I($s0?.t?.bodyFam)}; font-size: 14px; line-height: 1.43; color: ${I($s0?.t?.fg)}; -webkit-font-smoothing: antialiased; ${I($s0?.vars)}`)}>
        <div {...S(`position: relative; box-sizing: border-box; height: 100%; display: flex; flex-direction: column; gap: 2px; padding: 12px ${I($s0?.padX)} 10px; overflow-y: ${I($s0?.ovf)}; background: ${I($s0?.t?.side)}; backdrop-filter: ${I($s0?.t?.sideFx)}; -webkit-backdrop-filter: ${I($s0?.t?.sideFx)}; border: ${I($s0?.cardBorder)}; border-radius: ${I($s0?.cardRadius)}; box-shadow: ${I($s0?.cardShadow)}; transition: background-color 0.3s ease, border-color 0.3s ease`)}>
          {$s0?.drawer ? (<>
            <div {...S("display: flex; align-items: center; justify-content: space-between; height: 40px; padding: 0 0 0 10px; margin-bottom: 6px")}>
              <span {...S("font-weight: 600")}>
                {"Menu"}
              </span>
              <button type={"button"} className={"tb tg"} onClick={$s0?.close} aria-label={"Close menu"} {...S($s0?.k?.ico)}>
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M18 6 6 18M6 6l12 12"} />
                </svg>
              </button>
            </div>
          </>) : null}
          <nav aria-label={"Main"} {...S(`display: flex; flex-direction: column; gap: ${I($s0?.groupGap)}`)}>
            {A($s0?.groups).map((it, i) => {
              const $s1 = { ...$s0, "g": it, $index: i };
              return (<React.Fragment key={i}>
                <div {...S("display: flex; flex-direction: column; gap: 2px")}>
                  {$s1?.open ? (<>
                    <div {...S(`padding: 4px 10px 6px; font-size: 12px; font-weight: 500; color: ${I($s1?.t?.mutedFg)}`)}>
                      {T($s1?.g?.label)}
                    </div>
                  </>) : null}
                  {$s1?.g?.rule ? (<>
                    <div {...S(`height: 1px; width: 24px; margin: 4px auto 8px; background: ${I($s1?.t?.border)}`)} />
                  </>) : null}
                  {A($s1?.g?.items).map((it, i) => {
                    const $s2 = { ...$s1, "n": it, $index: i };
                    return (<React.Fragment key={i}>
                      <a href={H($s2?.n?.href)} className={"tb tg"} aria-current={$s2?.n?.cur} aria-label={$s2?.n?.aria} onMouseEnter={$s2?.n?.enter} onMouseLeave={$s2?.hideTip} {...S(`--hv: ${I($s2?.n?.hv)}; position: relative; display: flex; align-items: center; justify-content: ${I($s2?.justify)}; gap: 10px; height: 36px; padding: 0 ${I($s2?.itemPad)}; box-sizing: border-box; border-radius: ${I($s2?.t?.rItem)}; background: ${I($s2?.n?.bg)}; color: ${I($s2?.t?.fg)}; font-size: 14px; font-weight: ${I($s2?.n?.fw)}; text-decoration: none; white-space: nowrap; overflow: hidden`)}>
                        <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 16px; color: ${I($s2?.n?.ic)}; transition: color 0.2s ease`)}>
                          <path d={$s2?.n?.icon} />
                        </svg>
                        {$s2?.open ? (<>
                          <span {...S("flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis")}>
                            {T($s2?.n?.label)}
                          </span>
                          {$s2?.n?.hasBadge ? (<>
                            <span {...S(`display: inline-flex; align-items: center; gap: 5px; height: 20px; padding: 0 7px; box-sizing: border-box; border-radius: ${I($s2?.t?.rCtl)}; background: ${I($s2?.n?.badgeBg)}; color: ${I($s2?.n?.badgeFg)}; font-size: 12px; font-weight: 500; font-variant-numeric: tabular-nums`)}>
                              {$s2?.n?.warn ? (<>
                                <span {...S("width: 6px; height: 6px; flex: 0 0 6px; border-radius: 3px; background: #EF4444")} />
                              </>) : null}
                              {T($s2?.n?.badge)}
                            </span>
                          </>) : null}
                        </>) : null}
                        {$s2?.n?.dotOnly ? (<>
                          <span {...S(`position: absolute; top: 7px; right: 10px; width: 7px; height: 7px; border-radius: 4px; background: #EF4444; box-shadow: 0 0 0 2px ${I($s2?.t?.side)}`)} />
                        </>) : null}
                      </a>
                    </React.Fragment>);
                  })}
                </div>
              </React.Fragment>);
            })}
          </nav>
          <div {...S("flex: 1 1 auto; min-height: 24px")} />
          {$s0?.planCard ? (<>
            <a href={H("SSettings.dc.html")} className={"tb tg a-fade"} onClick={$s0?.pl?.go} {...S(`--hv: ${I($s0?.t?.hover)}; display: flex; flex-direction: column; gap: 8px; margin: 0 0 8px; padding: 10px 12px 11px; box-sizing: border-box; border: 1px solid ${I($s0?.t?.sideBorder)}; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.card)}; color: ${I($s0?.t?.fg)}; text-decoration: none`)}>
              <span {...S("display: flex; align-items: center; gap: 8px; min-width: 0")}>
                <span {...S(`width: 7px; height: 7px; flex: 0 0 7px; border-radius: 4px; background: ${I($s0?.pl?.dot)}`)} />
                <span {...S("font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                  {T($s0?.pl?.title)}
                </span>
                <span {...S(`margin-left: auto; font-size: 12px; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap`)}>
                  {T($s0?.pl?.right)}
                </span>
              </span>
              {$s0?.pl?.hasBar ? (<>
                <span {...S(`display: block; height: 4px; border-radius: 2px; background: ${I($s0?.t?.off)}; overflow: hidden`)}>
                  <span {...S(`display: block; width: ${I($s0?.pl?.pct)}; height: 100%; border-radius: 2px; background: ${I($s0?.t?.accent)}`)} />
                </span>
              </>) : null}
              <span {...S(`font-size: 12px; line-height: 1.4; color: ${I($s0?.t?.mutedFg)}`)}>
                {T($s0?.pl?.sub)}
              </span>
              <span {...S(`font-size: 13px; font-weight: 500; color: ${I($s0?.t?.fg)}`)}>
                {T($s0?.pl?.cta)}
              </span>
            </a>
          </>) : null}
          {$s0?.planIcon ? (<>
            <a href={H("SSettings.dc.html")} className={"tb tg"} onClick={$s0?.pl?.go} aria-label={$s0?.pl?.aria} onMouseEnter={$s0?.pl?.enter} onMouseLeave={$s0?.hideTip} {...S(`--hv: ${I($s0?.t?.hover)}; position: relative; display: flex; align-items: center; justify-content: center; height: 36px; margin-bottom: 2px; border-radius: ${I($s0?.t?.rItem)}; color: ${I($s0?.pl?.icFg)}; text-decoration: none`)}>
              <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                <path d={$s0?.pl?.icon} />
              </svg>
              <span {...S(`position: absolute; top: 7px; right: 10px; width: 7px; height: 7px; border-radius: 4px; background: ${I($s0?.pl?.dot)}; box-shadow: 0 0 0 2px ${I($s0?.t?.side)}`)} />
            </a>
          </>) : null}
          <a href={H("SSettings.dc.html")} className={"tb tg"} aria-current={$s0?.settings?.cur} aria-label={"Settings"} onMouseEnter={$s0?.settings?.enter} onMouseLeave={$s0?.hideTip} {...S(`--hv: ${I($s0?.settings?.hv)}; display: flex; align-items: center; justify-content: ${I($s0?.justify)}; gap: 10px; height: 36px; padding: 0 ${I($s0?.itemPad)}; box-sizing: border-box; border-radius: ${I($s0?.t?.rItem)}; background: ${I($s0?.settings?.bg)}; color: ${I($s0?.t?.fg)}; font-size: 14px; font-weight: ${I($s0?.settings?.fw)}; text-decoration: none; white-space: nowrap; overflow: hidden`)}>
            <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 16px; color: ${I($s0?.settings?.ic)}`)}>
              <path d={"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"} />
            </svg>
            {$s0?.open ? (<>
              <span>
                {"Settings"}
              </span>
            </>) : null}
          </a>
          <div {...S(`height: 1px; margin: 8px 2px; background: ${I($s0?.t?.border)}`)} />
          <button type={"button"} className={"tb tg"} onClick={$s0?.toggleUser} onMouseEnter={$s0?.userEnter} onMouseLeave={$s0?.hideTip} aria-haspopup={"menu"} aria-expanded={$s0?.userOpen} aria-label={"Account menu"} {...S(`--hv: ${I($s0?.t?.hover)}; display: flex; align-items: center; justify-content: ${I($s0?.justify)}; gap: 10px; width: 100%; height: 48px; padding: 0 ${I($s0?.userPad)}; box-sizing: border-box; border: none; border-radius: ${I($s0?.t?.rItem)}; background: ${I($s0?.userBg)}; color: ${I($s0?.t?.fg)}; font: inherit; text-align: left; cursor: pointer`)}>
            <span {...S(`width: 32px; height: 32px; flex: 0 0 32px; border-radius: ${I($s0?.t?.rAvatar)}; background: ${I($s0?.t?.primary)}; color: ${I($s0?.t?.primaryFg)}; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600`)}>
              {T($s0?.userInit)}
            </span>
            {$s0?.open ? (<>
              <span {...S("display: flex; flex-direction: column; gap: 2px; flex: 1 1 auto; min-width: 0; line-height: 1.2")}>
                <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                  {T($s0?.userName)}
                </span>
                <span {...S(`font-size: 12px; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap`)}>
                  {"@"}{T($s0?.userHandle)}
                </span>
              </span>
              <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 16px; color: ${I($s0?.t?.mutedFg)}`)}>
                <path d={"m7 15 5 5 5-5M7 9l5-5 5 5"} />
              </svg>
            </>) : null}
          </button>
          {$s0?.userOpen ? (<>
            <div onClick={$s0?.toggleUser} {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 49")} />
            <div role={"menu"} aria-label={"Account"} className={"a-drop"} {...S(`position: absolute; left: ${I($s0?.menuLeft)}; bottom: 62px; width: 240px; z-index: 50; background: ${I($s0?.t?.card)}; color: ${I($s0?.t?.fg)}; border: 1px solid ${I($s0?.t?.border)}; border-radius: ${I($s0?.t?.rTile)}; box-shadow: ${I($s0?.t?.shPop)}; padding: 6px; box-sizing: border-box; transform-origin: bottom left`)}>
              <div {...S("display: flex; align-items: center; gap: 10px; padding: 6px 8px 8px")}>
                <span {...S(`width: 32px; height: 32px; flex: 0 0 32px; border-radius: ${I($s0?.t?.rAvatar)}; background: ${I($s0?.t?.primary)}; color: ${I($s0?.t?.primaryFg)}; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600`)}>
                  {T($s0?.userInit)}
                </span>
                <span {...S("display: flex; flex-direction: column; gap: 2px; line-height: 1.2; min-width: 0")}>
                  <span {...S("font-weight: 500")}>
                    {T($s0?.userName)}
                  </span>
                  <span {...S(`font-size: 12px; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap`)}>
                    {T($s0?.planName)}
                  </span>
                </span>
              </div>
              <div {...S(`height: 1px; margin: 2px -6px 4px; background: ${I($s0?.t?.border)}`)} />
              {$s0?.menuLinks ? (<>
                {A($s0?.menu).map((it, i) => {
                  const $s1 = { ...$s0, "mi": it, $index: i };
                  return (<React.Fragment key={i}>
                    <a href={H("SSettings.dc.html")} role={"menuitem"} className={"tb tg"} onClick={$s1?.mi?.go} {...S(`--hv: ${I($s1?.t?.hover)}; display: flex; align-items: center; gap: 10px; height: 34px; padding: 0 10px; border-radius: ${I($s1?.t?.rItem)}; color: ${I($s1?.t?.fg)}; text-decoration: none; white-space: nowrap`)}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s1?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 16px")}>
                        <path d={$s1?.mi?.icon} />
                      </svg>
                      <span {...S("flex: 1 1 auto")}>
                        {T($s1?.mi?.label)}
                      </span>
                    </a>
                  </React.Fragment>);
                })}
              </>) : null}
              {$s0?.menuBtns ? (<>
                {A($s0?.menu).map((it, i) => {
                  const $s1 = { ...$s0, "mi": it, $index: i };
                  return (<React.Fragment key={i}>
                    <button type={"button"} role={"menuitem"} className={"tb tg"} onClick={$s1?.mi?.go} {...S(`--hv: ${I($s1?.t?.hover)}; display: flex; align-items: center; gap: 10px; width: 100%; height: 34px; padding: 0 10px; border: none; border-radius: ${I($s1?.t?.rItem)}; background: ${I($s1?.mi?.bg)}; color: ${I($s1?.t?.fg)}; font: inherit; font-size: 14px; text-align: left; white-space: nowrap; cursor: pointer`)}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s1?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 16px")}>
                        <path d={$s1?.mi?.icon} />
                      </svg>
                      <span {...S("flex: 1 1 auto")}>
                        {T($s1?.mi?.label)}
                      </span>
                    </button>
                  </React.Fragment>);
                })}
              </>) : null}
              <div {...S(`height: 1px; margin: 4px -6px; background: ${I($s0?.t?.border)}`)} />
              <button type={"button"} role={"menuitem"} className={"tb tg"} onClick={$s0?.toggleUser} {...S(`--hv: ${I($s0?.t?.hover)}; display: flex; align-items: center; gap: 10px; width: 100%; height: 34px; padding: 0 10px; border: none; border-radius: ${I($s0?.t?.rItem)}; background: transparent; color: ${I($s0?.t?.fg)}; font: inherit; font-size: 14px; text-align: left; cursor: pointer`)}>
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"} />
                </svg>
                {"Log out"}
              </button>
            </div>
          </>) : null}
        </div>
        {$s0?.tipOn ? (<>
          <div role={"tooltip"} className={"a-fade"} {...S(`position: fixed; left: ${I($s0?.tip?.left)}; top: ${I($s0?.tip?.top)}; transform: translateY(-50%); z-index: 200; display: inline-flex; align-items: center; gap: 8px; height: 30px; padding: 0 10px; box-sizing: border-box; border-radius: ${I($s0?.t?.rItem)}; background: ${I($s0?.t?.tipBg)}; color: ${I($s0?.t?.tipFg)}; font-size: 13px; font-weight: 500; white-space: nowrap; box-shadow: 0 6px 18px -6px rgba(0,0,0,0.35); pointer-events: none`)}>
            <span {...S(`position: absolute; left: -4px; top: 50%; width: 8px; height: 8px; margin-top: -4px; background: ${I($s0?.t?.tipBg)}; transform: rotate(45deg); border-radius: 1px`)} />
            <span {...S("position: relative")}>
              {T($s0?.tip?.label)}
            </span>
            {$s0?.tip?.hasBadge ? (<>
              <span {...S(`position: relative; display: inline-flex; align-items: center; height: 18px; padding: 0 6px; border-radius: 9px; background: ${I($s0?.tip?.badgeBg)}; color: ${I($s0?.tip?.badgeFg)}; font-size: 11px; font-weight: 600`)}>
                {T($s0?.tip?.badge)}
              </span>
            </>) : null}
          </div>
        </>) : null}
      </div>
  </>);
}

export const meta = {"props":{"active":{"editor":"enum","options":["overview","deals","calendar","payments","ideas","todos","settings"],"default":"deals"},"fresh":{"editor":"boolean","default":false},"plan":{"editor":"enum","options":["active","trial","pastdue","canceled","readonly"],"default":"active"},"user":{"editor":"text","default":"Chanelica.R"},"handle":{"editor":"text","default":"chanelica.r"},"color":{"editor":"enum","options":["studio","sand","mac","stationery","editorial"],"default":"studio"},"dark":{"editor":"boolean","default":false},"collapsed":{"editor":"boolean","default":false},"drawer":{"editor":null},"onClose":{"editor":null},"onSettings":{"editor":null}},"preview":{"width":264,"height":1000}};
export default $r.defineBoard("SSidebar", Component, render, CSS, meta);
