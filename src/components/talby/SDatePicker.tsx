// @ts-nocheck
/* eslint-disable */
'use client';
// SDatePicker: converted from design-source/boards/SDatePicker.dc.html.
// Markup, inline styles and logic are carried over exactly from the board.
// The logic class below is the board's own code, unchanged.
import * as React from 'react';
import * as $r from './_runtime';
import { DCLogic } from './_runtime';


const CSS = "body, #dc-root{margin:0;font-synthesis:none}#dc-root .tb{transition:background-color .15s ease,color .15s ease,border-color .15s ease,box-shadow .15s ease,opacity .15s ease,transform .12s ease}#dc-root .tb:active{transform:scale(.96)}#dc-root .tg:hover{background-color:var(--hv)!important}#dc-root .td:hover{background-color:var(--hvd)!important}#dc-root .ti:focus-visible{box-shadow:0 0 0 2px var(--ring)!important;outline:none}#dc-root .tb:focus-visible{outline:2px solid var(--ring);outline-offset:2px}#dc-root .a-drop{animation:tDrop .16s cubic-bezier(.2,.8,.3,1) backwards}@keyframes tDrop{from{opacity:0;transform:translateY(-4px) scale(.98)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){#dc-root *, #dc-root *::before, #dc-root *::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}\n";

const Component = (() => {
class Component extends DCLogic {
  constructor(props) {
    super(props);
    var standalone = typeof props.onChange !== 'function';
    var v = props.value || (standalone ? '2026-11-04' : '');
    var d = v ? new Date(v + 'T00:00:00') : new Date(new Date().toDateString());
    this.trig = null;
    this.state = { open: standalone, y: d.getFullYear(), m: d.getMonth(), top: 0, left: 0, val: v };
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
    var p = this.props, st = this.state, self = this, dark = !!p.dark;
    var t = talby(p.color, dark); t.clearHover = t.off; t.dayHover = t.hv; t.rDay = t.rPill;
    var b = 'display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-sizing: border-box; font: inherit; font-weight: 500; line-height: 1; white-space: nowrap; border-radius: ' + t.rCtl + '; cursor: pointer; flex-shrink: 0';
    var k = {
      icoO: b + '; width: 30px; height: 30px; padding: 0; border: 1px solid ' + t.border + '; background: ' + t.card + '; color: ' + t.fg,
      sSm: b + '; height: 28px; padding: 0 11px; font-size: 12px; border: none; background: ' + t.fill + '; color: ' + t.fg
    };
    var MS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var standalone = typeof p.onChange !== 'function';
    var val = standalone ? st.val : (p.value || '');
    function isoOf(dt) { return dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2); }
    var NOW = new Date(new Date().toDateString()), TODAY = isoOf(NOW);
    function iso(y, m, d) { var dt = new Date(y, m, d); return dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2); }
    function pick(v) { if (standalone) self.setState({ val: v, open: true }); else { self.setState({ open: false }); p.onChange(v); } }
    var y = st.y, m = st.m, first = new Date(y, m, 1).getDay();
    var days = [];
    for (var i = 0; i < 42; i++) {
      (function (i) {
        var dt = new Date(y, m, 1 - first + i), key = iso(dt.getFullYear(), dt.getMonth(), dt.getDate());
        var out = dt.getMonth() !== m, sel = key === val, today = key === TODAY;
        days.push({ n: String(dt.getDate()), sel: sel, aria: MONTHS[dt.getMonth()] + ' ' + dt.getDate() + ', ' + dt.getFullYear(),
          bg: sel ? t.primary : 'transparent', fg: sel ? t.primaryFg : (out ? t.mutedFg : t.fg), fw: sel || today ? '600' : '400',
          ring: today && !sel ? ('inset 0 0 0 1px ' + t.border) : 'none', hv: sel ? t.primary : t.dayHover,
          pick: function () { pick(key); } });
      })(i);
    }
    var sm = p.size === 'sm';
    var dv = val ? new Date(val + 'T00:00:00') : null;
    var label = dv ? (MS[dv.getMonth()] + ' ' + dv.getDate() + (sm && dv.getFullYear() === new Date().getFullYear() ? '' : ', ' + dv.getFullYear())) : (p.placeholder || 'Pick a date');
    var outline = p.tone === 'outline';
    var clearable = p.clearable !== false;
    function shift(dm) { var d = new Date(self.state.y, self.state.m + dm, 1); self.setState({ y: d.getFullYear(), m: d.getMonth() }); }
    return {
      t: t, k: k, open: st.open, catcher: !standalone,
      vars: '--hv: ' + t.fillHover + '; --ring: ' + t.ring,
      wrapPad: standalone ? '24px' : '0', wrapMinH: standalone ? '480px' : '0px', wrapBg: standalone ? t.page : 'transparent', trigW: standalone ? '280px' : '100%',
      h: sm ? '32px' : '36px', fs: sm ? '13px' : '14px', padL: sm ? '12px' : '14px', padR: val && clearable ? '8px' : '12px',
      trigBg: outline ? t.card : t.fill, trigBorder: outline ? ('1px solid ' + t.border) : 'none',
      valFg: val ? t.fg : t.mutedFg, icFg: t.mutedFg, label: label, aria: (p.label || 'Date') + ': ' + label,
      hasClear: !!val && clearable, showChev: !(val && clearable), chev: st.open ? 'rotate(180deg)' : 'none',
      trigRef: function (el) { self.trig = el; },
      toggle: function () {
        if (self.state.open && !standalone) { self.setState({ open: false }); return; }
        var W = 296, H = 372, top = 0, left = 0;
        try {
          var rc = self.trig.getBoundingClientRect(), vw = window.innerWidth, vh = window.innerHeight;
          left = p.align === 'end' ? rc.right - W : rc.left; left = Math.max(8, Math.min(left, vw - W - 8));
          top = rc.bottom + 6; if (top + H > vh - 8 && rc.top - H - 6 > 8) top = rc.top - H - 6;
        } catch (e) {}
        var d = val ? new Date(val + 'T00:00:00') : new Date(new Date().toDateString());
        self.setState({ open: true, top: top, left: left, y: d.getFullYear(), m: d.getMonth() });
      },
      close: function () { self.setState({ open: false }); },
      clear: function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); if (standalone) self.setState({ val: '' }); else p.onChange(''); },
      popPos: standalone ? 'absolute' : 'fixed', popTop: standalone ? 'calc(100% + 6px)' : st.top + 'px', popLeft: standalone ? '0px' : st.left + 'px',
      title: MONTHS[m] + ' ' + y, wd: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], days: days,
      prev: function () { shift(-1); }, next: function () { shift(1); },
      presets: p.presets !== false,
      quick: [['Today', 0], ['Tomorrow', 1], ['In a week', 7]].map(function (q) { var n = new Date(new Date().toDateString()); n.setDate(n.getDate() + q[1]); return [q[0], isoOf(n)]; }).map(function (q) { return { label: q[0], pick: function () { pick(q[1]); } }; })
    };
  }
}
return Component;
})();

function render($s0, host) {
  const { A, T, I, V0, S, HS, H } = $r;
  return (<>
      <div {...S(`position: relative; width: 100%; box-sizing: border-box; padding: ${I($s0?.wrapPad)}; min-height: ${I($s0?.wrapMinH)}; background: ${I($s0?.wrapBg)}; font-family: ${I($s0?.t?.bodyFam)}; font-size: 14px; line-height: 1.43; color: ${I($s0?.t?.fg)}; -webkit-font-smoothing: antialiased; ${I($s0?.vars)}`)}>
        <div {...S(`position: relative; width: ${I($s0?.trigW)}`)}>
          <button type={"button"} className={"tb tg ti"} onClick={$s0?.toggle} aria-haspopup={"dialog"} aria-expanded={$s0?.open} aria-label={$s0?.aria} {...S(`--hv: ${I($s0?.t?.fillHover)}; display: flex; align-items: center; gap: 8px; width: 100%; height: ${I($s0?.h)}; padding: 0 ${I($s0?.padR)} 0 ${I($s0?.padL)}; box-sizing: border-box; border: ${I($s0?.trigBorder)}; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.trigBg)}; color: ${I($s0?.valFg)}; font: inherit; font-size: ${I($s0?.fs)}; text-align: left; cursor: pointer; white-space: nowrap; overflow: hidden`, $s0?.trigRef)}>
            <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.icFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 15px")}>
              <path d={"M8 2v4M16 2v4M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM3 10h18"} />
            </svg>
            <span {...S("flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; font-variant-numeric: tabular-nums")}>
              {T($s0?.label)}
            </span>
            {$s0?.hasClear ? (<>
              <span role={"button"} tabIndex={"0"} aria-label={"Clear date"} className={"tb tg"} onClick={$s0?.clear} {...S(`--hv: ${I($s0?.t?.clearHover)}; display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; flex: 0 0 20px; border-radius: 10px; color: ${I($s0?.t?.mutedFg)}`)}>
                <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                  <path d={"M18 6 6 18M6 6l12 12"} />
                </svg>
              </span>
            </>) : null}
            {$s0?.showChev ? (<>
              <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 14px; transform: ${I($s0?.chev)}; transition: transform 0.2s ease`)}>
                <path d={"m6 9 6 6 6-6"} />
              </svg>
            </>) : null}
          </button>
          {$s0?.open ? (<>
            {$s0?.catcher ? (<>
              <div onClick={$s0?.close} {...S("position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 119")} />
            </>) : null}
            <div role={"dialog"} aria-label={"Choose a date"} className={"a-drop"} {...S(`position: ${I($s0?.popPos)}; top: ${I($s0?.popTop)}; left: ${I($s0?.popLeft)}; z-index: 120; width: 296px; box-sizing: border-box; padding: 12px; background: ${I($s0?.t?.card)}; color: ${I($s0?.t?.fg)}; border: 1px solid ${I($s0?.t?.border)}; border-radius: ${I($s0?.t?.rTile)}; box-shadow: ${I($s0?.t?.shPop)}; transform-origin: top left`)}>
              <div {...S("display: flex; align-items: center; justify-content: space-between; height: 32px; margin-bottom: 6px")}>
                <button type={"button"} className={"tb tg"} onClick={$s0?.prev} aria-label={"Previous month"} {...S($s0?.k?.icoO)}>
                  <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"m15 18-6-6 6-6"} />
                  </svg>
                </button>
                <span {...S("font-weight: 500; white-space: nowrap")}>
                  {T($s0?.title)}
                </span>
                <button type={"button"} className={"tb tg"} onClick={$s0?.next} aria-label={"Next month"} {...S($s0?.k?.icoO)}>
                  <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"m9 18 6-6-6-6"} />
                  </svg>
                </button>
              </div>
              <div {...S("display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 2px")}>
                {A($s0?.wd).map((it, i) => {
                  const $s1 = { ...$s0, "w": it, $index: i };
                  return (<React.Fragment key={i}>
                    <span {...S(`height: 28px; line-height: 28px; text-align: center; font-size: 12px; color: ${I($s1?.t?.mutedFg)}`)}>
                      {T($s1?.w)}
                    </span>
                  </React.Fragment>);
                })}
                {A($s0?.days).map((it, i) => {
                  const $s1 = { ...$s0, "c": it, $index: i };
                  return (<React.Fragment key={i}>
                    <button type={"button"} className={"tb td"} onClick={$s1?.c?.pick} aria-label={$s1?.c?.aria} aria-pressed={$s1?.c?.sel} {...S(`--hvd: ${I($s1?.c?.hv)}; height: 36px; padding: 0; border: none; border-radius: ${I($s1?.t?.rDay)}; background: ${I($s1?.c?.bg)}; color: ${I($s1?.c?.fg)}; font: inherit; font-size: 13px; font-weight: ${I($s1?.c?.fw)}; cursor: pointer; font-variant-numeric: tabular-nums; box-shadow: ${I($s1?.c?.ring)}`)}>
                      {T($s1?.c?.n)}
                    </button>
                  </React.Fragment>);
                })}
              </div>
              {$s0?.presets ? (<>
                <div {...S(`display: flex; align-items: center; gap: 6px; margin-top: 10px; padding-top: 10px; border-top: 1px solid ${I($s0?.t?.line)}`)}>
                  {A($s0?.quick).map((it, i) => {
                    const $s1 = { ...$s0, "q": it, $index: i };
                    return (<React.Fragment key={i}>
                      <button type={"button"} className={"tb tg"} onClick={$s1?.q?.pick} {...S(`--hv: ${I($s1?.t?.fillHover)}; ${I($s1?.k?.sSm)}`)}>
                        {T($s1?.q?.label)}
                      </button>
                    </React.Fragment>);
                  })}
                </div>
              </>) : null}
            </div>
          </>) : null}
        </div>
      </div>
  </>);
}

export const meta = {"props":{"value":{"editor":"text","default":"2026-11-04"},"placeholder":{"editor":"text","default":"Pick a date"},"size":{"editor":"enum","options":["md","sm"],"default":"md"},"align":{"editor":"enum","options":["start","end"],"default":"start"},"tone":{"editor":"enum","options":["fill","outline"],"default":"fill"},"color":{"editor":"enum","options":["studio","sand","mac","stationery","editorial"],"default":"studio"},"dark":{"editor":"boolean","default":false},"label":{"editor":null},"clearable":{"editor":null},"presets":{"editor":null},"onChange":{"editor":null}},"preview":{"width":360,"height":480}};
export default $r.defineBoard("SDatePicker", Component, render, CSS, meta);
