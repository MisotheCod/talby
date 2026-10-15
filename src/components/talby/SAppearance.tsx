// @ts-nocheck
/* eslint-disable */
'use client';
// SAppearance: converted from design-source/boards/SAppearance.dc.html.
// Markup, inline styles and logic are carried over exactly from the board.
// The logic class below is the board's own code, unchanged.
import * as React from 'react';
import * as $r from './_runtime';
import { DCLogic } from './_runtime';


const CSS = "body, #dc-root{margin:0;font-synthesis:none}#dc-root .tb{transition:background-color .15s ease,color .15s ease,border-color .15s ease,box-shadow .2s ease,opacity .15s ease,transform .12s ease}#dc-root .tb:active{transform:scale(.96)}#dc-root .tg:hover{background-color:var(--hv)!important}#dc-root .tp:hover{opacity:.88}#dc-root .tt:hover{color:var(--fg)!important}#dc-root .tlift:hover{transform:translateY(-2px)}#dc-root .tb:focus-visible{outline:2px solid var(--ring);outline-offset:2px}#dc-root .a-fade{animation:tFade .2s ease backwards}#dc-root .a-pop{animation:tPop .22s cubic-bezier(.2,.8,.3,1) backwards}#dc-root .a-up{animation:tUp .3s cubic-bezier(.2,.8,.2,1) backwards}#dc-root .a-check{animation:tCheck .3s cubic-bezier(.3,1.5,.5,1) backwards}@keyframes tFade{from{opacity:0}to{opacity:1}}@keyframes tPop{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}@keyframes tUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}@keyframes tCheck{from{transform:scale(.3);opacity:0}to{transform:none;opacity:1}}@media (prefers-reduced-motion:reduce){#dc-root *, #dc-root *::before, #dc-root *::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}\n";

const Component = (() => {
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { theme: props.theme || 'studio', mode: props.mode || 'light', sidebar: props.sidebar || 'expanded', draft: null };
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
    var IDS = ['studio', 'sand', 'mac', 'stationery', 'editorial'], MODES = ['light', 'dark', 'system'];
    var DEF = { theme: 'studio', mode: 'light', sidebar: 'expanded' };
    var KEYS = ['theme', 'mode', 'sidebar'];
    var self = this, p = this.props, st = this.state;
    var live = typeof p.onSet === 'function' || typeof p.onSave === 'function';
    var inline = !!p.inline;
    function norm(o) { var x = { theme: o.theme, mode: o.mode, sidebar: o.sidebar === 'icons' ? 'icons' : 'expanded' }; if (IDS.indexOf(x.theme) < 0) x.theme = 'studio'; if (MODES.indexOf(x.mode) < 0) x.mode = 'light'; return x; }
    var saved = norm(live ? { theme: p.theme, mode: p.mode, sidebar: p.sidebar } : st);
    var v = inline && st.draft ? norm(st.draft) : saved;
    var dirty = inline && !!st.draft && KEYS.some(function (key) { return norm(st.draft)[key] !== saved[key]; });
    var sysDark = false; try { sysDark = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches); } catch (e) {}
    function darkOf(o) { return o.mode === 'dark' || (o.mode === 'system' && sysDark); }
    var chrome = inline ? saved : v, vDark = darkOf(v);
    var t = talby(chrome.theme, darkOf(chrome));
    var b = 'display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 32px; padding: 0 14px; box-sizing: border-box; font: inherit; font-size: 14px; font-weight: 500; line-height: 1; white-space: nowrap; border-radius: ' + t.rCtl + '; cursor: pointer; text-decoration: none';
    var k = {
      btnP: b + '; border: none; background: ' + t.primary + '; color: ' + t.primaryFg + '; box-shadow: ' + t.btnSh, btnO: b + '; border: 1px solid ' + t.border + '; background: ' + t.card + '; color: ' + t.fg,
      btnG: b + '; border: none; background: transparent; color: ' + t.fg, ico: b + '; border: none; background: transparent; color: ' + t.fg + '; width: 32px; height: 32px; padding: 0',
      track: 'display: flex; align-items: center; gap: 2px; height: 36px; padding: 3px; box-sizing: border-box; border-radius: ' + t.rCtl + '; background: ' + t.fill
    };
    function tab(on) { return 'display: inline-flex; align-items: center; justify-content: center; height: 100%; padding: 0 10px; box-sizing: border-box; border: none; border-radius: ' + t.rCtl + '; background: ' + (on ? t.tabOn : 'transparent') + '; box-shadow: ' + (on ? t.tabSh : 'none') + '; color: ' + (on ? t.fg : t.mutedFg) + '; font: inherit; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer'; }
    function emitDraft(d) { if (typeof p.onDraft === 'function') p.onDraft(d); }
    function set(key, val) {
      if (inline) { var d = Object.assign({}, self.state.draft || saved); d[key] = val; self.setState({ draft: d }); emitDraft(d); return; }
      if (typeof p.onSet === 'function') p.onSet(key, val); else { var o = {}; o[key] = val; self.setState(o); }
    }
    var themes = IDS.map(function (id) {
      var x = talby(id, vDark), on = v.theme === id;
      return {
        name: x.name, vibe: x.vibe, on: on, page: x.page, side: x.side, sideBorder: x.sideBorder, card: x.card, border: x.border, fg: x.fg, muted: x.mutedFg, primary: x.primary,
        titleFam: x.titleFam, numFam: x.numFam, track: x.hCase === 'uppercase' ? '0.1em' : '0px', hcase: x.hCase, btnSh: x.btnSh,
        barR: x.r ? '2px' : '0px', cardR: Math.min(x.r, 6) + 'px', ctlR: x.ctl >= 999 ? '6px' : Math.min(x.ctl, 4) + 'px',
        edge: x.dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        ring: on ? ('0 0 0 2px ' + t.primary) : ('0 0 0 1px ' + t.border),
        radioBorder: on ? 'none' : ('1px solid ' + t.borderStrong), radioBg: on ? t.primary : 'transparent', dot: on ? 'visible' : 'hidden',
        pick: function () { set('theme', id); }
      };
    });
    var MI = { light: 'M12 3v1M12 20v1M4.2 4.2l.7.7M19.1 19.1l.7.7M3 12h1M20 12h1M4.2 19.8l.7-.7M19.1 4.9l.7-.7M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', dark: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z', system: 'M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM8 21h8M12 16v5' };
    var modeOpts = [['light', 'Light'], ['dark', 'Dark'], ['system', 'System']].map(function (x) { var on = v.mode === x[0]; return { label: x[1], icon: MI[x[0]], on: on, style: tab(on), pick: function () { set('mode', x[0]); } }; });
    var sbOpts = [['expanded', 'Expanded'], ['icons', 'Icons only']].map(function (x) { var on = v.sidebar === x[0]; return { label: x[1], on: on, style: tab(on), pick: function () { set('sidebar', x[0]); } }; });
    var standalone = typeof p.onClose !== 'function' && !inline;
    var show = inline ? true : (p.open === undefined ? true : !!p.open);
    return {
      t: t, k: k, show: show, isDialog: !inline, isInline: inline,
      vars: '--hv: ' + t.hv + '; --fg: ' + t.fg + '; --ring: ' + t.ring,
      wrapZ: inline ? 'auto' : '85', stFlex: (function () { var w = 1440; try { w = window.innerWidth || 1440; } catch (e) {} return inline && w < 640 ? '1 0 100%' : '0 1 auto'; })(),
      pos: inline ? 'relative' : (standalone ? 'absolute' : 'fixed'), wrapDisplay: inline ? 'block' : 'flex', wrapPad: inline ? '0' : '16px',
      wrapBg: inline ? 'transparent' : (standalone ? t.page : 'transparent'), overlay: standalone ? 'transparent' : t.overlay,
      role: inline ? 'group' : 'dialog', modal: inline ? 'false' : 'true', boxAnim: inline ? '' : 'a-pop',
      boxW: inline ? '100%' : '720px', boxMaxH: inline ? 'none' : 'calc(100vh - 32px)', boxBg: inline ? 'transparent' : t.card,
      boxBorder: inline ? 'none' : ('1px solid ' + t.border), boxSh: inline ? 'none' : t.shPop, bodyPad: inline ? '20px 24px 22px' : '18px 24px 22px',
      tileR: (t.r ? t.r + 4 : 0) + 'px', tileIn: (t.r ? t.r + 1 : 0) + 'px',
      themes: themes, modeOpts: modeOpts,
      sbOpts: sbOpts,
      dirty: dirty, clean: !dirty, saveOp: dirty ? '1' : '0.4', statusDot: dirty ? '#F59E0B' : '#22C55E', statusText: dirty ? 'Unsaved changes' : 'All changes saved',
      cancel: function () { self.setState({ draft: null }); emitDraft(null); },
      save: function () {
        if (!dirty) return;
        var d = norm(self.state.draft);
        if (typeof p.onSave === 'function') p.onSave(d); else if (typeof p.onSet === 'function') p.onSet('all', d);
        self.setState({ draft: null }); emitDraft(null);
      },
      close: function () { if (typeof p.onClose === 'function') p.onClose(); },
      reset: function () {
        if (inline) { var d = Object.assign({}, DEF); self.setState({ draft: d }); emitDraft(d); return; }
        if (typeof p.onSet === 'function') p.onSet('reset', true); else self.setState(Object.assign({}, DEF));
      }
    };
  }
}
return Component;
})();

function render($s0, host) {
  const { A, T, I, V0, S, HS, H } = $r;
  return (<>
      {$s0?.show ? (<>
        <div {...S(`position: ${I($s0?.pos)}; top: 0; right: 0; bottom: 0; left: 0; z-index: ${I($s0?.wrapZ)}; display: ${I($s0?.wrapDisplay)}; align-items: center; justify-content: center; padding: ${I($s0?.wrapPad)}; box-sizing: border-box; background: ${I($s0?.wrapBg)}; font-family: ${I($s0?.t?.bodyFam)}; font-size: 14px; line-height: 1.43; color: ${I($s0?.t?.fg)}; -webkit-font-smoothing: antialiased; ${I($s0?.vars)}`)}>
          {$s0?.isDialog ? (<>
            <button type={"button"} aria-label={"Close appearance"} className={"a-fade"} onClick={$s0?.close} {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; padding: 0; border: none; background: ${I($s0?.overlay)}; cursor: default`)} />
          </>) : null}
          <div role={$s0?.role} aria-modal={$s0?.modal} aria-labelledby={"ap-title"} className={$s0?.boxAnim} {...S(`position: relative; width: ${I($s0?.boxW)}; max-width: 100%; max-height: ${I($s0?.boxMaxH)}; box-sizing: border-box; display: flex; flex-direction: column; background: ${I($s0?.boxBg)}; color: ${I($s0?.t?.fg)}; border: ${I($s0?.boxBorder)}; border-radius: ${I($s0?.t?.rDialog)}; box-shadow: ${I($s0?.boxSh)}; overflow: hidden; transition: background-color 0.25s ease, color 0.25s ease`)}>
            {$s0?.isDialog ? (<>
              <div {...S("display: flex; align-items: flex-start; gap: 12px; padding: 22px 20px 4px 24px")}>
                <div {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 4px")}>
                  <h2 id={"ap-title"} {...S(`margin: 0; font-family: ${I($s0?.t?.titleFam)}; font-size: 18px; font-weight: 600; line-height: 1.2`)}>
                    {"Appearance"}
                  </h2>
                  <p {...S(`margin: 0; color: ${I($s0?.t?.mutedFg)}`)}>
                    {"Changes show up right away, everywhere in Talby."}
                  </p>
                </div>
                <button type={"button"} className={"tb tg"} onClick={$s0?.close} aria-label={"Close"} {...S($s0?.k?.ico)}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M18 6 6 18M6 6l12 12"} />
                  </svg>
                </button>
              </div>
            </>) : null}
            <div {...S(`flex: 1 1 auto; overflow-y: auto; padding: ${I($s0?.bodyPad)}; display: flex; flex-direction: column; gap: 22px`)}>
              <div {...S("display: flex; flex-direction: column; gap: 12px")}>
                <div {...S("display: flex; align-items: baseline; justify-content: space-between; gap: 12px")}>
                  <span id={"ap-theme"} {...S("font-weight: 500; white-space: nowrap")}>
                    {"Theme"}
                  </span>
                  <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                    {"Colors, corners and fonts in one pick"}
                  </span>
                </div>
                <div role={"radiogroup"} aria-labelledby={"ap-theme"} {...S("display: grid; grid-template-columns: repeat(auto-fit, minmax(116px, 1fr)); gap: 14px 12px")}>
                  {A($s0?.themes).map((it, i) => {
                    const $s1 = { ...$s0, "m": it, $index: i };
                    return (<React.Fragment key={i}>
                      <button type={"button"} role={"radio"} className={"tb tlift"} aria-checked={$s1?.m?.on} aria-label={`${I($s1?.m?.name)} theme`} onClick={$s1?.m?.pick} {...S(`min-width: 0; display: flex; flex-direction: column; gap: 8px; padding: 0; border: none; background: transparent; font: inherit; color: ${I($s1?.t?.fg)}; text-align: left; cursor: pointer`)}>
                        <span {...S(`display: block; padding: 3px; border-radius: ${I($s1?.tileR)}; box-shadow: ${I($s1?.m?.ring)}; transition: box-shadow 0.2s ease`)}>
                          <span {...S(`display: flex; height: 92px; overflow: hidden; border-radius: ${I($s1?.tileIn)}; background: ${I($s1?.m?.page)}; box-shadow: inset 0 0 0 1px ${I($s1?.m?.edge)}`)}>
                            <span {...S(`flex: 0 0 24%; display: flex; flex-direction: column; gap: 5px; padding: 9px 6px; box-sizing: border-box; background: ${I($s1?.m?.side)}; border-right: 1px solid ${I($s1?.m?.sideBorder)}`)}>
                              <span {...S(`height: 4px; width: 80%; border-radius: ${I($s1?.m?.barR)}; background: ${I($s1?.m?.primary)}`)} />
                              <span {...S(`height: 4px; border-radius: ${I($s1?.m?.barR)}; background: ${I($s1?.m?.muted)}; opacity: 0.35`)} />
                              <span {...S(`height: 4px; width: 70%; border-radius: ${I($s1?.m?.barR)}; background: ${I($s1?.m?.muted)}; opacity: 0.35`)} />
                            </span>
                            <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; justify-content: space-between; padding: 8px 9px; box-sizing: border-box")}>
                              <span {...S(`font-family: ${I($s1?.m?.titleFam)}; font-size: 12px; font-weight: 600; line-height: 1.1; color: ${I($s1?.m?.fg)}; letter-spacing: ${I($s1?.m?.track)}; text-transform: ${I($s1?.m?.hcase)}; white-space: nowrap; overflow: hidden`)}>
                                {"Overview"}
                              </span>
                              <span {...S(`display: block; padding: 4px 6px; background: ${I($s1?.m?.card)}; border: 1px solid ${I($s1?.m?.border)}; border-radius: ${I($s1?.m?.cardR)}; font-family: ${I($s1?.m?.numFam)}; font-size: 13px; font-weight: 600; line-height: 1.2; color: ${I($s1?.m?.fg)}; white-space: nowrap; overflow: hidden`)}>
                                {"$8,500"}
                              </span>
                              <span {...S("display: flex; justify-content: flex-end")}>
                                <span {...S(`width: 36px; height: 12px; border-radius: ${I($s1?.m?.ctlR)}; background: ${I($s1?.m?.primary)}; box-shadow: ${I($s1?.m?.btnSh)}`)} />
                              </span>
                            </span>
                          </span>
                        </span>
                        <span {...S("display: flex; flex-direction: column; gap: 1px; padding-left: 2px; min-width: 0")}>
                          <span {...S("display: flex; align-items: center; gap: 8px; min-width: 0; white-space: nowrap")}>
                            <span {...S(`width: 16px; height: 16px; flex: 0 0 16px; box-sizing: border-box; border-radius: 8px; border: ${I($s1?.m?.radioBorder)}; background: ${I($s1?.m?.radioBg)}; display: inline-flex; align-items: center; justify-content: center; transition: background-color 0.15s ease`)}>
                              <span {...S(`width: 6px; height: 6px; border-radius: 3px; background: ${I($s1?.t?.primaryFg)}; visibility: ${I($s1?.m?.dot)}`)} />
                            </span>
                            <span {...S("font-weight: 500")}>
                              {T($s1?.m?.name)}
                            </span>
                          </span>
                          <span {...S(`padding-left: 24px; font-size: 12px; color: ${I($s1?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                            {T($s1?.m?.vibe)}
                          </span>
                        </span>
                      </button>
                    </React.Fragment>);
                  })}
                </div>
              </div>
              <div {...S("display: flex; flex-wrap: wrap; gap: 22px 24px")}>
                <div {...S("flex: 1 1 260px; min-width: 0; display: flex; flex-direction: column; gap: 10px")}>
                  <div {...S("display: flex; flex-direction: column; gap: 2px")}>
                    <span id={"ap-mode"} {...S("font-weight: 500")}>
                      {"Mode"}
                    </span>
                    <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                      {"Every theme has a light and a dark side."}
                    </span>
                  </div>
                  <div role={"radiogroup"} aria-labelledby={"ap-mode"} {...S($s0?.k?.track)}>
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
                <div {...S("flex: 1 1 260px; min-width: 0; display: flex; flex-direction: column; gap: 10px")}>
                  <div {...S("display: flex; flex-direction: column; gap: 2px")}>
                    <span id={"ap-sb"} {...S("font-weight: 500")}>
                      {"Sidebar"}
                    </span>
                    <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                      {"Icons only gives you more room."}
                    </span>
                  </div>
                  <div role={"radiogroup"} aria-labelledby={"ap-sb"} {...S($s0?.k?.track)}>
                    {A($s0?.sbOpts).map((it, i) => {
                      const $s1 = { ...$s0, "so": it, $index: i };
                      return (<React.Fragment key={i}>
                        <button type={"button"} role={"radio"} className={"tb tt"} aria-checked={$s1?.so?.on} onClick={$s1?.so?.pick} {...S(`flex: 1 1 0; ${I($s1?.so?.style)}`)}>
                          {T($s1?.so?.label)}
                        </button>
                      </React.Fragment>);
                    })}
                  </div>
                </div>
              </div>
            </div>
            {$s0?.isDialog ? (<>
              <div {...S(`display: flex; align-items: center; gap: 8px; padding: 14px 20px 18px 24px; border-top: 1px solid ${I($s0?.t?.line)}`)}>
                <button type={"button"} className={"tb tg"} onClick={$s0?.reset} {...S(`margin-left: -12px; ${I($s0?.k?.btnG)}`)}>
                  {"Reset to default"}
                </button>
                <div {...S("flex: 1 1 auto")} />
                <button type={"button"} className={"tb tp"} onClick={$s0?.close} {...S($s0?.k?.btnP)}>
                  {"Done"}
                </button>
              </div>
            </>) : null}
            {$s0?.isInline ? (<>
              <div {...S(`display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 14px 24px; border-top: 1px solid ${I($s0?.t?.line)}`)}>
                <span {...S(`display: inline-flex; align-items: center; gap: 8px; flex: ${I($s0?.stFlex)}; min-width: 0; color: ${I($s0?.t?.mutedFg)}; font-size: 13px; white-space: nowrap`)}>
                  <span {...S(`width: 7px; height: 7px; flex: 0 0 7px; border-radius: 4px; background: ${I($s0?.statusDot)}; transition: background-color 0.2s ease`)} />
                  {T($s0?.statusText)}
                </span>
                <div {...S("flex: 1 1 auto")} />
                <button type={"button"} className={"tb tg"} onClick={$s0?.reset} {...S($s0?.k?.btnG)}>
                  {"Reset to default"}
                </button>
                {$s0?.dirty ? (<>
                  <button type={"button"} className={"tb tg a-up"} onClick={$s0?.cancel} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.btnO)}`)}>
                    {"Cancel"}
                  </button>
                </>) : null}
                <button type={"button"} className={"tb tp"} onClick={$s0?.save} aria-disabled={$s0?.clean} {...S(`opacity: ${I($s0?.saveOp)}; ${I($s0?.k?.btnP)}`)}>
                  {"Save"}
                </button>
              </div>
            </>) : null}
          </div>
        </div>
      </>) : null}
  </>);
}

export const meta = {"props":{"open":{"editor":"boolean","default":true},"theme":{"editor":"enum","options":["studio","sand","mac","stationery","editorial"],"default":"studio"},"mode":{"editor":"enum","options":["light","dark","system"],"default":"light"},"sidebar":{"editor":"enum","options":["expanded","icons"],"default":"expanded"},"dark":{"editor":null},"inline":{"editor":null},"onSet":{"editor":null},"onSave":{"editor":null},"onDraft":{"editor":null},"onClose":{"editor":null}},"preview":{"width":800,"height":780}};
export default $r.defineBoard("SAppearance", Component, render, CSS, meta);
