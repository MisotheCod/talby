// @ts-nocheck
/* eslint-disable */
'use client';
// SThemes: converted from design-source/boards/SThemes.dc.html.
// Markup, inline styles and logic are carried over exactly from the board.
// The logic class below is the board's own code, unchanged.
import * as React from 'react';
import * as $r from './_runtime';
import { DCLogic } from './_runtime';


const CSS = "body, #dc-root{margin:0;font-synthesis:none}#dc-root .tb{transition:background-color .15s ease,color .15s ease,border-color .15s ease,box-shadow .2s ease,opacity .15s ease,transform .12s ease}#dc-root .tb:active{transform:scale(.97)}#dc-root .tg:hover{background-color:var(--hv)!important}#dc-root .tlift{transition:transform .2s ease,box-shadow .2s ease}#dc-root .tlift:hover{transform:translateY(-3px)}#dc-root .tb:focus-visible{outline:2px solid var(--ring);outline-offset:2px}#dc-root .a-pop{animation:tPop .22s cubic-bezier(.2,.8,.3,1) backwards}@keyframes tPop{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){#dc-root *, #dc-root *::before, #dc-root *::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}\n";

const Component = (() => {
class Component extends DCLogic {
  constructor(props) {
    super(props);
    var L = null; try { L = JSON.parse(window.localStorage.getItem('talby.look') || 'null'); } catch (e) {}
    L = L || {};
    var IDS = ['studio', 'sand', 'mac', 'stationery', 'editorial'], MODES = ['light', 'dark', 'system'];
    var th = (IDS.indexOf(L.theme) >= 0 && L.theme) || (L.theme === 'midnight' && IDS.indexOf(L.prev) >= 0 && L.prev) || (IDS.indexOf(props.color) >= 0 && props.color) || 'studio';
    var md = L.theme === 'midnight' ? 'dark' : ((MODES.indexOf(L.mode) >= 0 && L.mode) || (L.auto ? 'system' : (props.dark ? 'dark' : 'light')));
    this.state = { look: Object.assign({}, L, { theme: th, mode: md }) };
  }
  componentDidMount() {
    var self = this;
    this._sg = function (ev) { if (ev && ev.key === 'talby.look') { try { var L = JSON.parse(ev.newValue || 'null'); if (L) self.setState({ look: Object.assign({}, self.state.look, L) }); } catch (x) {} } };
    try { window.addEventListener('storage', this._sg); } catch (e) {}
  }
  componentWillUnmount() { try { window.removeEventListener('storage', this._sg); } catch (e) {} }
  componentDidUpdate(prev) {
    if (prev.color !== this.props.color && this.props.color) this.use({ theme: this.props.color });
    if (prev.dark !== this.props.dark) this.use({ mode: this.props.dark ? 'dark' : 'light' });
  }
  use(ch) {
    var L = Object.assign({}, this.state.look, ch);
    this.setState({ look: L });
    try { window.localStorage.setItem('talby.look', JSON.stringify(L)); } catch (e) {}
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
    var self = this, L = this.state.look, sysDark = false; try { sysDark = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches); } catch (e) {}
    var dark = L.mode === 'dark' || (L.mode === 'system' && sysDark);
    var t = talby(L.theme, dark);
    var DESC = {
      studio: 'Clean white, or near black with glowing buttons.',
      sand: 'Oat and cocoa, or espresso and latte. Small caps titles.',
      mac: 'Soft gray window, frosted sidebar, graphite buttons.',
      stationery: 'Cream paper or warm charcoal. Serif titles, mono numbers.',
      editorial: 'Black and white, square corners, big serif titles.'
    };
    var IDS = ['studio', 'sand', 'mac', 'stationery', 'editorial'];
    function tab(on) { return 'display: inline-flex; align-items: center; justify-content: center; height: 100%; padding: 0 10px; box-sizing: border-box; border: none; border-radius: ' + t.rCtl + '; background: ' + (on ? t.tabOn : 'transparent') + '; box-shadow: ' + (on ? t.tabSh : 'none') + '; color: ' + (on ? t.fg : t.mutedFg) + '; font: inherit; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer'; }
    var MI = { light: 'M12 3v1M12 20v1M4.2 4.2l.7.7M19.1 19.1l.7.7M3 12h1M20 12h1M4.2 19.8l.7-.7M19.1 4.9l.7-.7M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', dark: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z', system: 'M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM8 21h8M12 16v5' };
    var modeOpts = [['light', 'Light'], ['dark', 'Dark'], ['system', 'System']].map(function (x) { var on = L.mode === x[0]; return { label: x[1], icon: MI[x[0]], on: on, style: tab(on), pick: function () { self.use({ mode: x[0] }); } }; });
    var themes = IDS.map(function (id) {
      var on = L.theme === id;
      var sides = [false, true].map(function (dk) {
        var x = talby(id, dk), here = on && dk === dark;
        var nav = [0, 1, 2, 3].map(function (i) { return { bg: i === 0 ? x.navOn : 'transparent', ic: i === 0 ? x.fg : x.mutedFg, op: i === 0 ? '1' : '0.5', w: ['34px', '28px', '38px', '26px'][i] }; });
        var rows = [['Haleon Centrum', 'Late', x.badBg, x.badFg, '$10,550'], ['Sprouts', 'Paid', x.okBg, x.okFg, '$4,000']].map(function (r, i) { return { brand: r[0], status: r[1], bg: r[2], fg: r[3], amt: r[4], line: i ? '1px solid ' + x.line : 'none' }; });
        return {
          label: dk ? 'Dark' : 'Light', aria: x.name + ', ' + (dk ? 'dark' : 'light'), on: here,
          page: x.page, side: x.side, sideBorder: x.sideBorder, card: x.card, border: x.border, fg: x.fg, mutedFg: x.mutedFg,
          primary: x.primary, primaryFg: x.primaryFg, btnSh: x.btnSh, shCard: x.shCard, bodyFam: x.bodyFam, titleFam: x.titleFam, numFam: x.numFam,
          hTrack: x.hTrack, hCase: x.hCase, nTrack: x.nTrack, h1: Math.round(18 * x.hScale) + 'px',
          rCard: x.rCard, rCtl: x.rCtl, rItem: x.rItem, rBox: x.r ? '3px' : '0px', rPill: x.rPill,
          edge: dk ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
          ring: here ? ('0 0 0 2px ' + t.primary) : 'none',
          nav: nav, rows: rows,
          pick: function () { self.use(L.mode === 'system' && dk === dark ? { theme: id } : { theme: id, mode: dk ? 'dark' : 'light' }); }
        };
      });
      var x0 = talby(id, false);
      return { name: x0.name, desc: DESC[id], titleFam: x0.titleFam, on: on, off: !on, sides: sides, ring: on ? ('0 0 0 1px ' + t.borderStrong) : ('0 0 0 1px ' + t.border), pick: function () { self.use({ theme: id }); } };
    });
    var chips = [['Paid', t.okBg, t.okFg], ['Late', t.badBg, t.badFg], ['Invoiced', t.warnBg, t.warnFg], ['Posting', t.postBg, t.postFg]].map(function (c) { return { label: c[0], bg: c[1], fg: c[2] }; });
    return { t: t, themes: themes, modeOpts: modeOpts, chips: chips, h1Fs: Math.round(32 * t.hScale) + 'px', vars: '--hv: ' + t.hv + '; --ring: ' + t.ring };
  }
}
return Component;
})();

function render($s0, host) {
  const { A, T, I, V0, S, HS, H } = $r;
  return (<>
      <div {...S(`box-sizing: border-box; min-height: 100vh; padding: 44px 48px 52px; display: flex; flex-direction: column; gap: 28px; background: ${I($s0?.t?.page)}; color: ${I($s0?.t?.fg)}; font-family: ${I($s0?.t?.bodyFam)}; font-size: 14px; line-height: 1.43; -webkit-font-smoothing: antialiased; transition: background-color 0.3s ease, color 0.3s ease; ${I($s0?.vars)}`)}>
        <div {...S("display: flex; align-items: flex-end; justify-content: space-between; gap: 24px")}>
          <div {...S("display: flex; flex-direction: column; gap: 6px; min-width: 0")}>
            <span {...S(`font-size: 13px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: ${I($s0?.t?.mutedFg)}`)}>
              {"Appearance"}
            </span>
            <h1 {...S(`margin: 0; font-family: ${I($s0?.t?.titleFam)}; font-size: ${I($s0?.h1Fs)}; font-weight: 600; letter-spacing: ${I($s0?.t?.hTrack)}; text-transform: ${I($s0?.t?.hCase)}; line-height: 1.15; white-space: nowrap`)}>
              {"Themes"}
            </h1>
            <p {...S(`margin: 0; font-size: 16px; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap`)}>
              {"Every theme has a light and a dark side. Pick one and every board on this canvas switches."}
            </p>
          </div>
          <div {...S("display: flex; align-items: center; gap: 12px; flex: 0 0 auto")}>
            <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap`)}>
              {"Mode"}
            </span>
            <div role={"radiogroup"} aria-label={"Mode"} {...S(`display: flex; align-items: center; gap: 2px; width: 300px; height: 36px; padding: 3px; box-sizing: border-box; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.fill)}`)}>
              {A($s0?.modeOpts).map((it, i) => {
                const $s1 = { ...$s0, "mo": it, $index: i };
                return (<React.Fragment key={i}>
                  <button type={"button"} role={"radio"} className={"tb"} aria-checked={$s1?.mo?.on} onClick={$s1?.mo?.pick} {...S(`flex: 1 1 0; gap: 6px; ${I($s1?.mo?.style)}`)}>
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
        <div role={"radiogroup"} aria-label={"Themes"} {...S("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px 28px")}>
          {A($s0?.themes).map((it, i) => {
            const $s1 = { ...$s0, "m": it, $index: i };
            return (<React.Fragment key={i}>
              <div {...S("display: flex; flex-direction: column; gap: 14px; min-width: 0")}>
                <div {...S(`display: flex; gap: 10px; padding: 4px; border-radius: 18px; box-shadow: ${I($s1?.m?.ring)}; transition: box-shadow 0.2s ease`)}>
                  {A($s1?.m?.sides).map((it, i) => {
                    const $s2 = { ...$s1, "x": it, $index: i };
                    return (<React.Fragment key={i}>
                      <button type={"button"} role={"radio"} className={"tlift"} aria-checked={$s2?.x?.on} aria-label={$s2?.x?.aria} onClick={$s2?.x?.pick} {...S(`flex: 1 1 0; min-width: 0; display: block; padding: 0; border: none; border-radius: 14px; background: transparent; box-shadow: ${I($s2?.x?.ring)}; font: inherit; text-align: left; cursor: pointer`)}>
                        <span {...S(`display: flex; height: 236px; overflow: hidden; border-radius: 14px; background: ${I($s2?.x?.page)}; box-shadow: inset 0 0 0 1px ${I($s2?.x?.edge)}; font-family: ${I($s2?.x?.bodyFam)}; color: ${I($s2?.x?.fg)}`)}>
                          <span {...S(`flex: 0 0 74px; display: flex; flex-direction: column; gap: 4px; padding: 14px 8px 10px; box-sizing: border-box; background: ${I($s2?.x?.side)}; border-right: 1px solid ${I($s2?.x?.sideBorder)}`)}>
                            {A($s2?.x?.nav).map((it, i) => {
                              const $s3 = { ...$s2, "n": it, $index: i };
                              return (<React.Fragment key={i}>
                                <span {...S(`display: flex; align-items: center; gap: 6px; height: 24px; padding: 0 7px; box-sizing: border-box; border-radius: ${I($s3?.x?.rItem)}; background: ${I($s3?.n?.bg)}`)}>
                                  <span {...S(`width: 9px; height: 9px; flex: 0 0 9px; border-radius: ${I($s3?.x?.rBox)}; background: ${I($s3?.n?.ic)}; opacity: ${I($s3?.n?.op)}`)} />
                                  <span {...S(`height: 4px; flex: 0 1 ${I($s3?.n?.w)}; border-radius: 2px; background: ${I($s3?.n?.ic)}; opacity: ${I($s3?.n?.op)}`)} />
                                </span>
                              </React.Fragment>);
                            })}
                            <span {...S("flex: 1 1 auto")} />
                            <span {...S(`padding: 0 4px; font-size: 11px; font-weight: 500; color: ${I($s2?.x?.mutedFg)}; white-space: nowrap`)}>
                              {T($s2?.x?.label)}
                            </span>
                          </span>
                          <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 10px; padding: 16px 14px 14px; box-sizing: border-box")}>
                            <span {...S("display: flex; align-items: center; gap: 8px; min-width: 0")}>
                              <span {...S(`flex: 1 1 auto; min-width: 0; font-family: ${I($s2?.x?.titleFam)}; font-size: ${I($s2?.x?.h1)}; font-weight: 600; letter-spacing: ${I($s2?.x?.hTrack)}; text-transform: ${I($s2?.x?.hCase)}; line-height: 1.15; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                                {"Overview"}
                              </span>
                              <span {...S(`display: inline-flex; align-items: center; height: 24px; padding: 0 10px; box-sizing: border-box; border-radius: ${I($s2?.x?.rCtl)}; background: ${I($s2?.x?.primary)}; color: ${I($s2?.x?.primaryFg)}; box-shadow: ${I($s2?.x?.btnSh)}; font-size: 11px; font-weight: 500; white-space: nowrap`)}>
                                {"Add deal"}
                              </span>
                            </span>
                            <span {...S(`display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; background: ${I($s2?.x?.card)}; border: 1px solid ${I($s2?.x?.border)}; border-radius: ${I($s2?.x?.rCard)}; box-shadow: ${I($s2?.x?.shCard)}`)}>
                              <span {...S(`font-size: 11px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: ${I($s2?.x?.mutedFg)}; white-space: nowrap`)}>
                                {"Received this year"}
                              </span>
                              <span {...S(`font-family: ${I($s2?.x?.numFam)}; font-size: 22px; font-weight: 600; letter-spacing: ${I($s2?.x?.nTrack)}; line-height: 1.2; font-variant-numeric: tabular-nums; white-space: nowrap`)}>
                                {"$46,150"}
                              </span>
                            </span>
                            <span {...S(`display: flex; flex-direction: column; padding: 0 10px; background: ${I($s2?.x?.card)}; border: 1px solid ${I($s2?.x?.border)}; border-radius: ${I($s2?.x?.rCard)}; box-shadow: ${I($s2?.x?.shCard)}`)}>
                              {A($s2?.x?.rows).map((it, i) => {
                                const $s3 = { ...$s2, "r": it, $index: i };
                                return (<React.Fragment key={i}>
                                  <span {...S(`display: flex; align-items: center; gap: 6px; height: 30px; border-top: ${I($s3?.r?.line)}; font-size: 11px; white-space: nowrap`)}>
                                    <span {...S("flex: 1 1 auto; min-width: 0; font-weight: 500; overflow: hidden; text-overflow: ellipsis")}>
                                      {T($s3?.r?.brand)}
                                    </span>
                                    <span {...S(`display: inline-flex; align-items: center; height: 18px; padding: 0 6px; border-radius: ${I($s3?.x?.rPill)}; background: ${I($s3?.r?.bg)}; color: ${I($s3?.r?.fg)}; font-weight: 500`)}>
                                      {T($s3?.r?.status)}
                                    </span>
                                    <span {...S(`flex: 0 0 48px; text-align: right; font-family: ${I($s3?.x?.numFam)}; font-variant-numeric: tabular-nums`)}>
                                      {T($s3?.r?.amt)}
                                    </span>
                                  </span>
                                </React.Fragment>);
                              })}
                            </span>
                          </span>
                        </span>
                      </button>
                    </React.Fragment>);
                  })}
                </div>
                <div {...S("display: flex; align-items: center; gap: 12px; padding: 0 4px; min-width: 0")}>
                  <div {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                    <span {...S(`font-family: ${I($s1?.m?.titleFam)}; font-size: 17px; font-weight: 600; white-space: nowrap`)}>
                      {T($s1?.m?.name)}
                    </span>
                    <span {...S(`color: ${I($s1?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                      {T($s1?.m?.desc)}
                    </span>
                  </div>
                  {$s1?.m?.on ? (<>
                    <span className={"a-pop"} {...S(`display: inline-flex; align-items: center; gap: 6px; flex: 0 0 auto; height: 30px; padding: 0 12px; box-sizing: border-box; border-radius: ${I($s1?.t?.rCtl)}; background: ${I($s1?.t?.primary)}; color: ${I($s1?.t?.primaryFg)}; box-shadow: ${I($s1?.t?.btnSh)}; font-size: 13px; font-weight: 500; white-space: nowrap`)}>
                      <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M20 6 9 17l-5-5"} />
                      </svg>
                      {"In use"}
                    </span>
                  </>) : null}
                  {$s1?.m?.off ? (<>
                    <button type={"button"} className={"tb tg"} onClick={$s1?.m?.pick} {...S(`--hv: ${I($s1?.t?.hoverCard)}; display: inline-flex; align-items: center; flex: 0 0 auto; height: 30px; padding: 0 12px; box-sizing: border-box; border: 1px solid ${I($s1?.t?.border)}; border-radius: ${I($s1?.t?.rCtl)}; background: ${I($s1?.t?.card)}; color: ${I($s1?.t?.fg)}; font: inherit; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer`)}>
                      {"Use this"}
                    </button>
                  </>) : null}
                </div>
              </div>
            </React.Fragment>);
          })}
          <div {...S(`display: flex; flex-direction: column; justify-content: center; gap: 16px; padding: 28px 32px; box-sizing: border-box; border: 1px dashed ${I($s0?.t?.borderStrong)}; border-radius: ${I($s0?.t?.rDialog)}; min-width: 0`)}>
            <span {...S(`font-family: ${I($s0?.t?.titleFam)}; font-size: 20px; font-weight: 600; white-space: nowrap`)}>
              {"Status colors never change"}
            </span>
            <span {...S(`font-size: 15px; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap`)}>
              {"Paid, late and the rest look the same in every theme, light or dark."}
            </span>
            <div {...S("display: flex; gap: 8px; flex-wrap: wrap")}>
              {A($s0?.chips).map((it, i) => {
                const $s1 = { ...$s0, "c": it, $index: i };
                return (<React.Fragment key={i}>
                  <span {...S(`display: inline-flex; align-items: center; height: 28px; padding: 0 12px; box-sizing: border-box; border-radius: ${I($s1?.t?.rPill)}; background: ${I($s1?.c?.bg)}; color: ${I($s1?.c?.fg)}; font-size: 13px; font-weight: 500; white-space: nowrap`)}>
                    {T($s1?.c?.label)}
                  </span>
                </React.Fragment>);
              })}
            </div>
          </div>
        </div>
      </div>
  </>);
}

export const meta = {"props":{"color":{"editor":"enum","options":["studio","sand","mac","stationery","editorial"],"default":"studio"},"dark":{"editor":"boolean","default":false}},"preview":{"width":1440,"height":1200}};
export default $r.defineBoard("SThemes", Component, render, CSS, meta);
