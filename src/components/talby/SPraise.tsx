// @ts-nocheck
/* eslint-disable */
'use client';
// SPraise: converted from design-source/boards/SPraise.dc.html.
// Markup, inline styles and logic are carried over exactly from the board.
// The logic class below is the board's own code, unchanged.
import * as React from 'react';
import * as $r from './_runtime';
import { DCLogic } from './_runtime';


const CSS = "body, #dc-root{margin:0;font-synthesis:none}#dc-root .tb{transition:background-color .15s ease,color .15s ease,opacity .15s ease,transform .12s ease}#dc-root .tb:active{transform:scale(.94)}#dc-root .tg:hover{background-color:var(--hv)!important}#dc-root .a-rise{animation:tRise .42s cubic-bezier(.2,.9,.25,1.05) backwards}#dc-root .a-badge{animation:tBadge .5s cubic-bezier(.3,1.5,.5,1) .08s backwards}#dc-root .a-draw{stroke-dasharray:24;animation:tDraw .34s ease-out .3s backwards}#dc-root .a-burst{animation:tBurst .75s cubic-bezier(.15,.8,.3,1) .16s both}#dc-root .a-chip{animation:tChip .4s cubic-bezier(.2,.9,.3,1.2) .35s backwards}#dc-root .a-shrink{animation:tShrink 4.8s linear .2s both;transform-origin:left center}@keyframes tRise{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:none}}@keyframes tBadge{0%{opacity:0;transform:scale(.3) rotate(-30deg)}100%{opacity:1;transform:none}}@keyframes tDraw{from{stroke-dashoffset:24}to{stroke-dashoffset:0}}@keyframes tBurst{0%{opacity:0;transform:translate(0,0) scale(.4)}12%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1) rotate(var(--rot))}}@keyframes tChip{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}@keyframes tShrink{from{transform:scaleX(1)}to{transform:scaleX(0)}}@media (prefers-reduced-motion:reduce){#dc-root *, #dc-root *::before, #dc-root *::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}\n";

const Component = (() => {
class Component extends DCLogic {
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
    var p = this.props, dark = !!p.dark;
    var t = talby(p.color, dark); t.glow = alpha(t.primary, 0.55); t.rBadge = t.r ? '22px' : '0px';
    var b = 'display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-sizing: border-box; font: inherit; font-weight: 500; line-height: 1; white-space: nowrap; border-radius: ' + t.rCtl + '; cursor: pointer; text-decoration: none; flex-shrink: 0';
    var k = { icoS: b + '; width: 28px; height: 28px; padding: 0; border: none; background: transparent; color: ' + t.mutedFg, oSm: b + '; height: 28px; padding: 0 12px; font-size: 13px; border: 1px solid ' + t.border + '; background: ' + t.card + '; color: ' + t.fg };
    var CONF = [t.primary, '#22C55E', '#F59E0B', '#EC4899', '#8B5CF6', t.primary, '#22C55E', '#F59E0B', '#EC4899', '#8B5CF6', '#F59E0B', t.primary];
    function dots(seed) {
      var out = [];
      for (var i = 0; i < 12; i++) {
        var ang = (i / 12) * Math.PI * 2 + seed * 0.37, dist = 30 + ((i * 7 + seed) % 4) * 5, s = 5 + (i % 3);
        out.push({ s: s + 'px', m: (-s / 2) + 'px 0 0 ' + (-s / 2) + 'px', r: i % 3 === 0 ? '1px' : '50%', c: CONF[i],
          dx: Math.round(Math.cos(ang) * dist) + 'px', dy: Math.round(Math.sin(ang) * dist) + 'px', rot: (i % 2 ? 140 : -120) + 'deg', delay: (0.14 + (i % 4) * 0.02).toFixed(2) + 's' });
      }
      return out;
    }
    var CHECK = 'M20 6 9 17l-5-5';
    function shape(d, seed) {
      return { title: d.title || 'Done', line: d.line || '', chip: d.chip || '', hasChip: !!d.chip, icon: CHECK, dots: dots(seed || 1),
        hasAction: !!d.action, action: d.action || '', href: d.href || '' };
    }
    var standalone = p.data === undefined && typeof p.onClose !== 'function';
    var items = [];
    if (standalone) {
      items = [
        shape({ title: 'Deal added', chip: '+$6,000 booked', line: 'Lumen and Lark Skincare Co. is in. 27 deals this year.' }, 1),
        shape({ title: 'You got paid', chip: '+$10,550', line: 'Haleon Centrum paid. $56,700 received this year.' }, 2),
        shape({ title: '6 deals imported', chip: '+$16,000 booked', line: 'They are on your Deals page with dates and amounts.' }, 3),
        shape({ title: 'All caught up', line: 'Every to-do is done. Nothing left on your list.' }, 4)
      ];
    } else if (p.data) items = [shape(p.data, (p.data.id || 1) % 7)];
    var mob = !!p.mobile;
    return {
      t: t, k: k, standalone: standalone, items: items, titleFam: t.titleFam, timer: !standalone,
      lineWrap: (function () { var w = 1440; try { w = window.innerWidth || 1440; } catch (e) {} return (mob || w < 640) ? 'display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden' : 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis'; })(),
      vars: '--hv: ' + t.fill,
      pos: standalone ? 'absolute' : 'fixed', top: standalone ? '24px' : 'auto', bottom: standalone ? 'auto' : (mob ? '76px' : '28px'),
      left: standalone ? '24px' : (mob ? '12px' : '50%'), right: standalone ? '24px' : (mob ? '12px' : 'auto'), tf: standalone || mob ? 'none' : 'translateX(-50%)',
      w: standalone || mob ? 'auto' : '520px',
      close: function () { if (typeof p.onClose === 'function') p.onClose(); }
    };
  }
}
return Component;
})();

function render($s0, host) {
  const { A, T, I, V0, S, HS, H } = $r;
  return (<>
      <div {...S(`font-family: ${I($s0?.t?.bodyFam)}; font-size: 14px; line-height: 1.43; color: ${I($s0?.t?.fg)}; -webkit-font-smoothing: antialiased; ${I($s0?.vars)}`)}>
        {$s0?.standalone ? (<>
          <div {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: ${I($s0?.t?.page)}`)} />
        </>) : null}
        <div {...S(`position: ${I($s0?.pos)}; left: ${I($s0?.left)}; right: ${I($s0?.right)}; bottom: ${I($s0?.bottom)}; top: ${I($s0?.top)}; transform: ${I($s0?.tf)}; z-index: 95; width: ${I($s0?.w)}; display: flex; flex-direction: column; gap: 14px; pointer-events: none`)}>
          {A($s0?.items).map((it, i) => {
            const $s1 = { ...$s0, "pz": it, $index: i };
            return (<React.Fragment key={i}>
              <div role={"status"} aria-live={"polite"} className={"a-rise"} {...S(`position: relative; display: flex; align-items: center; gap: 14px; padding: 14px 10px 14px 14px; box-sizing: border-box; background: ${I($s1?.t?.card)}; border: 1px solid ${I($s1?.t?.border)}; border-radius: ${I($s1?.t?.rCard)}; box-shadow: ${I($s1?.t?.shPop)}; overflow: hidden; pointer-events: auto`)}>
                <span {...S("position: relative; width: 44px; height: 44px; flex: 0 0 44px")}>
                  {A($s1?.pz?.dots).map((it, i) => {
                    const $s2 = { ...$s1, "d": it, $index: i };
                    return (<React.Fragment key={i}>
                      <span className={"a-burst"} {...S(`position: absolute; left: 50%; top: 50%; width: ${I($s2?.d?.s)}; height: ${I($s2?.d?.s)}; margin: ${I($s2?.d?.m)}; border-radius: ${I($s2?.d?.r)}; background: ${I($s2?.d?.c)}; --dx: ${I($s2?.d?.dx)}; --dy: ${I($s2?.d?.dy)}; --rot: ${I($s2?.d?.rot)}; animation-delay: ${I($s2?.d?.delay)}`)} />
                    </React.Fragment>);
                  })}
                  <span className={"a-badge"} {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; border-radius: ${I($s1?.t?.rBadge)}; background: ${I($s1?.t?.primary)}; color: ${I($s1?.t?.primaryFg)}; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px -6px ${I($s1?.t?.glow)}`)}>
                    <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path className={"a-draw"} d={$s1?.pz?.icon} />
                    </svg>
                  </span>
                </span>
                <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 3px")}>
                  <span {...S("display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; min-width: 0")}>
                    <span {...S(`flex: 0 1 auto; min-width: 0; font-family: ${I($s1?.titleFam)}; font-size: 16px; font-weight: 600; letter-spacing: -0.2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                      {T($s1?.pz?.title)}
                    </span>
                    {$s1?.pz?.hasChip ? (<>
                      <span className={"a-chip"} {...S(`display: inline-flex; align-items: center; height: 22px; padding: 0 8px; border-radius: ${I($s1?.t?.rCtl)}; background: ${I($s1?.t?.okBg)}; color: ${I($s1?.t?.okFg)}; font-size: 12px; font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums`)}>
                        {T($s1?.pz?.chip)}
                      </span>
                    </>) : null}
                  </span>
                  <span {...S(`font-size: 13px; color: ${I($s1?.t?.mutedFg)}; ${I($s1?.lineWrap)}`)}>
                    {T($s1?.pz?.line)}
                  </span>
                </span>
                {$s1?.pz?.hasAction ? (<>
                  <a href={H($s1?.pz?.href)} className={"tb tg"} {...S(`--hv: ${I($s1?.t?.fill)}; ${I($s1?.k?.oSm)}`)}>
                    {T($s1?.pz?.action)}
                  </a>
                </>) : null}
                <button type={"button"} className={"tb tg"} onClick={$s1?.close} aria-label={"Dismiss"} {...S(`--hv: ${I($s1?.t?.fill)}; ${I($s1?.k?.icoS)}`)}>
                  <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M18 6 6 18M6 6l12 12"} />
                  </svg>
                </button>
                {$s1?.timer ? (<>
                  <span className={"a-shrink"} {...S(`position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: ${I($s1?.t?.primary)}; opacity: 0.35`)} />
                </>) : null}
              </div>
            </React.Fragment>);
          })}
        </div>
      </div>
  </>);
}

export const meta = {"props":{"color":{"editor":"enum","options":["studio","sand","mac","stationery","editorial"],"default":"studio"},"dark":{"editor":"boolean","default":false},"data":{"editor":null},"mobile":{"editor":null},"onClose":{"editor":null}},"preview":{"width":600,"height":420}};
export default $r.defineBoard("SPraise", Component, render, CSS, meta);
