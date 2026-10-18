// @ts-nocheck
/* eslint-disable */
'use client';
// SHome: converted from design-source/boards/SHome.dc.html.
// Markup, inline styles and logic are carried over exactly from the board.
// The logic class below is the board's own code, unchanged.
import * as React from 'react';
import * as $r from './_runtime';
import { DCLogic } from './_runtime';
import SAddDeal from './SAddDeal';

const CSS = "body, #dc-root{margin:0;font-synthesis:none}#dc-root .tb{transition:background-color .15s ease,color .15s ease,border-color .15s ease,box-shadow .18s ease,opacity .15s ease,transform .12s ease}#dc-root .tb:active{transform:scale(.97)}#dc-root .tg:hover{background-color:var(--hv)!important}#dc-root .tp:hover{opacity:.88}#dc-root .tr{transition:background-color .12s ease}#dc-root .tr:hover{background-color:var(--hvr)!important}#dc-root .tt:hover{color:var(--fg)!important}#dc-root .tc{transition:border-color .18s ease,box-shadow .2s ease,transform .2s ease}#dc-root .tc:hover{border-color:var(--bd2)!important;box-shadow:var(--shh)!important}#dc-root .tlift:hover{transform:translateY(-2px)}#dc-root .ti{transition:box-shadow .15s ease}#dc-root .ti:focus, #dc-root .ti:focus-within{box-shadow:0 0 0 2px var(--ring)!important}#dc-root .tb:focus-visible, #dc-root .tc:focus-visible, #dc-root .tr:focus-visible{outline:2px solid var(--ring);outline-offset:2px}#dc-root .a-in{animation:tIn .36s cubic-bezier(.2,.7,.2,1) backwards}#dc-root .a-fade{animation:tFade .2s ease backwards}#dc-root .a-pop{animation:tPop .22s cubic-bezier(.2,.8,.3,1) backwards}#dc-root .a-drop{animation:tDrop .16s cubic-bezier(.2,.8,.3,1) backwards}#dc-root .a-sheet{animation:tSheet .3s cubic-bezier(.2,.8,.2,1) backwards}#dc-root .a-drawer{animation:tDrawer .26s cubic-bezier(.2,.8,.2,1) backwards}#dc-root .a-up{animation:tUp .3s cubic-bezier(.2,.8,.2,1) backwards}#dc-root .a-toast{animation:tToast .3s cubic-bezier(.2,.9,.3,1.1) backwards}#dc-root .a-spin{animation:tSpin .8s linear infinite}#dc-root .a-pulse{animation:tPulse 1.6s ease-in-out infinite}#dc-root .a-ping{animation:tPing 2s ease-out infinite}#dc-root .a-check{animation:tCheck .38s cubic-bezier(.3,1.5,.5,1) backwards}#dc-root .a-strike{animation:tStrike .45s cubic-bezier(.4,0,.2,1) backwards}#dc-root .a-grow{animation:tGrow .6s cubic-bezier(.2,.8,.2,1) backwards;transform-origin:bottom center}#dc-root .a-width{animation:tWidth .7s cubic-bezier(.2,.8,.2,1) backwards;transform-origin:left center}#dc-root .a-out{animation:tOut .32s ease forwards}#dc-root .a-gone{animation:tOut .35s ease .55s forwards}#dc-root [style*=\"scrollbar-width: none\"]::-webkit-scrollbar{display:none}@keyframes tIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes tFade{from{opacity:0}to{opacity:1}}@keyframes tPop{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}@keyframes tDrop{from{opacity:0;transform:translateY(-4px) scale(.98)}to{opacity:1;transform:none}}@keyframes tSheet{from{opacity:0;transform:translateX(36px)}to{opacity:1;transform:none}}@keyframes tDrawer{from{transform:translateX(-100%)}to{transform:none}}@keyframes tUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}@keyframes tToast{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}@keyframes tSpin{to{transform:rotate(360deg)}}@keyframes tPulse{0%,100%{opacity:1}50%{opacity:.35}}@keyframes tPing{0%{box-shadow:0 0 0 0 rgba(239,68,68,.5)}70%,100%{box-shadow:0 0 0 6px rgba(239,68,68,0)}}@keyframes tCheck{0%{transform:scale(.6)}55%{transform:scale(1.18)}100%{transform:scale(1)}}@keyframes tStrike{from{background-size:0% 1.5px}to{background-size:100% 1.5px}}@keyframes tGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}@keyframes tWidth{from{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes tOut{from{opacity:1;transform:none}to{opacity:0;transform:translateX(16px)}}@media (prefers-reduced-motion:reduce){#dc-root *, #dc-root *::before, #dc-root *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}#dc-root .a-type span{animation:tPulse 1s ease-in-out infinite}#dc-root .a-type span:nth-child(2){animation-delay:.15s}#dc-root .a-type span:nth-child(3){animation-delay:.3s}\n";

const Component = (() => {
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { theme: props.theme || 'studio', dark: false, tab: props.tab || 'contract', run: 0, filter: 'active', sheet: -1, day: 15, paid: {}, payToast: '', msgs: [], typing: false, streaming: false, streamN: 0, draft: '', w: this.vw(), menu: false, touch: this.noHover() };
  }
  noHover() { try { return !!(window.matchMedia && window.matchMedia('(hover: none)').matches); } catch (e) { return false; } }
  vw() { var w = 0; try { var de = document.documentElement; w = (de && de.clientWidth) || window.innerWidth || 0; } catch (e) {} return w || 1440; }
  componentDidMount() {
    var self = this;
    this._rs = function () { var w = self.vw(); if (w !== self.state.w) self.setState({ w: w, menu: w < 768 ? self.state.menu : false }); };
    this._kd = function (e) { if (e && e.key === 'Escape' && self.state.menu) self.setState({ menu: false }); };
    try { window.addEventListener('resize', this._rs); window.addEventListener('keydown', this._kd); } catch (e) {}
    this._rs();
  }
  componentWillUnmount() { clearTimeout(this._ty); clearTimeout(this._pt); clearInterval(this._sv); try { window.removeEventListener('resize', this._rs); window.removeEventListener('keydown', this._kd); } catch (e) {} }
  componentDidUpdate(pp, prevState) { var ps = prevState || this._prev || {}; this._prev = { msgs: this.state.msgs, typing: this.state.typing, streamN: this.state.streamN }; if (this.chat && (ps.msgs !== this.state.msgs || ps.typing !== this.state.typing || ps.streamN !== this.state.streamN)) { try { this.chat.scrollTop = this.chat.scrollHeight; } catch (e) {} } }
  ask(q) {
    var self = this; q = (q || '').trim(); if (!q || this.state.typing || this.state.streaming) return;
    this.setState({ msgs: this.state.msgs.concat([{ me: true, text: q }]), typing: true, draft: '' });
    clearTimeout(this._ty); clearInterval(this._sv);
    this._ty = setTimeout(function () {
      var ans = self.answer(q);
      self.setState({ typing: false, msgs: self.state.msgs.concat([ans]), streamN: 0, streaming: true });
      self._sv = setInterval(function () { var n = self.state.streamN + 4; if (n >= ans.text.length) { clearInterval(self._sv); self.setState({ streamN: ans.text.length, streaming: false }); } else self.setState({ streamN: n }); }, 22);
    }, 950);
  }
  answer(q) {
    var s = q.toLowerCase();
    if (/exclusiv|halcyon/.test(s)) return { text: 'Your Halcyon Skincare contract says you will not post for another skincare brand for 30 days after each video goes live.\nYour first video goes up Oct 15, so that runs until Nov 14.', src: 'Halcyon Skincare contract, section 4' };
    if (/skincare|made|earn|paid me|income/.test(s)) return { text: 'You have been paid $5,000 from skincare deals this year, all from Lumen Beauty on Oct 1.\nHalcyon Skincare adds $5,500 once it is paid, due Nov 14.', src: 'Your payments, 2026' };
    if (/basewear|usage|repost|rights/.test(s)) return { text: 'Yes. Basewear Co. can repost your video on their own channels for 90 days after it goes live.\nPaid ads are not included. If they want to run it as an ad, that is $500 a month extra and needs your OK first.', src: 'Basewear Co. statement of work, section 2' };
    if (/week|coming|due|next|today|tomorrow/.test(s)) return { text: 'Halcyon Skincare: your first video goes up tomorrow, Oct 15.\nMeadowlark Tea: invoice sent, $3,900 due Nov 8.\nNothing is late.', src: 'Your calendar' };
    return { text: 'In your own account, Talby answers that from your deals and contracts. Try one of the suggested questions to see how it works.', src: '' };
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
    var PLATICON={TikTok:'data:image/png;base64,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',Instagram:'data:image/png;base64,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',YouTube:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADkklEQVR42u2ZP2gVQRDGf7N3JubFEP8QJEKUpLIIamcvdoJWhmCj2NhaWdhZaGETGyHaSBANxNJSsREbMSCCdhZGkthEVBKNee9uLHY27yJ5T593l/jgDSx37N7tft/u7MzOLHSkIx1pa5FmjerbZZNvpSQ8usm7ysb6P/YQKUT/20w3wiW/z7ZAmqnrx5fdwF6gF+gDKsAuoAvYaWUH4IBuIG6Aowb8xI+xClTtuQYsAytWloHPwBfgq8DX33ASVkVCZahQOAGcA44ABwx8pUS1aaZO343EAvAamBF4ugGzgljpUZhS0AYlVUgUalaqBZfQb2JjNcJxz7CKgqB+2VF4YB8EcEmms2YdllXSzKQlGZKqMG0EXFir09awtk1gWyG1Zu9nIDCAC6Zzsg263qrZF8N6HsCptybHrCFqA98VGdajCr0OOAjsL6Rr57aSyH5gyAGHzEzm97Bp6kmUSyRg7AWGHTAYhs/XrcDwsCeRphBFvq4cCVgHswTygQe4cwdmZpSREUgSbyuiUrfVoAP2bXKQap2Amm88e1Z49Uq5elXp6/NERIpWq4B1n7MzTnGSJLBnj3D9uvDypTI+bha8FLXa6wrbwOtGLoJazRM5fFiYnoYnT1KOH9+oVvmIhJ8rDugp3k6IBxk29MmTjhcvYHIShobqRPKvRk84/pYjwaQmiSd06RLMziqXLytdXUWQ6HaZ40SJvjOyY2INBgaEiQnh3buU0VHN6QDjeMv8ZprWh3v/XpmYcMzPm035ZwMocW4H9jfAw55YWVFu3xZu3hSWlorovRpbiFdCPJUxnaA8egTXrglv39bVKknyjvLTWUxaLPBarT7rs7Nw6hSMjXnwwYTmBw/wIwa+5fbEWScmAt3dsLCg3Lgh3L0L1aqsb9RigAes32MLmouR/n7f+a1bXs8XF4tUl83kc2zpi3yeONjzx4+VK1eE58/rwNO0DPAB6xIKFy3GTAqLXaNIVaTM2DhgvRgDi8FvFhaRlaMuG0ay57wDPlgCKf9GDmef8hNeGOaPDpgDPhVmibYmY4dpzpwTn4d8Yw3tQCA1nK8FloMu3bOdnf7nJDSTv7ofatoxtfhwHXsmuVtpMblb26bk7lQ2udtO6fU3wEOBZ1nMrV5w7LKEUq+FohWL6HbgLzli/KVH1GQDrtpzzd5X7UT8A3+58c2ejS44HM2undr2iqnBT+13ydeRjnSkveQXJps54NcuWqEAAAAASUVORK5CYII=',Facebook:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAIt0lEQVR42s2abYxdRRnHf8+cc8+9d5dCtyTyYlNJsGBLDRZ8QVqtbwnRxC/gVhIJEoQF0yBBQ0M0ZF3SqIXEklZb2GoDCdHCRRLjN/2gRUxRxCIWFDAhtlioWtpuu3vPPffMPH6YuS972909dymUSc6e3bMzc57/8/yfl5k5Qr9tVA2/w7BL8tajZJ1eJI5VAleoYwXKEoEhoBK6pAqHEfaLsFfhaYU/ZA/IS+15hzViOcqYuH7EkeJdVRjGUBMLUF2n5+O4xinXiPJhYgZ9N8CFu3a9RQDT9cacSRWeNcITOB6vPyj/bgOp4UD01AEYVdPSTPkWvUAMd6BcLwkL1QI54HAIiiJIW+RpGgj/9T8NhhgkAs04gvCINvlh4yfyau873xqANRqzS3JGNa78hzuB9RKzUDPAkQdhTX/W7LKVohhiSUBzjgL3pZZ7GZemt4a3+PwAjGrMmOSlW3WFEbabEldooy14NA+hZwajWAyxlME1+ZPLuLn5U3m+JUP/AMLA6i36JTXswLCA7JQLfnIgCTGO41huSsfl0dlAmNmEL4/oOo2p4VhAhkWI34rwIv4y4RI5YTJBiMmwOM6gxM7qiH6DMU/hYhboEt6U+ZH6yQSZAewc/DTG362D3Pm7C/ElMp3LCDjXCVyoDwpSJrINbs/GZfPJLDEdQHCaZESvNiV+QY7FYYKj9tUiA00LWerdNS7D0AAsqEKl5EFMNWAihWMp2AaUKhCbaSAU8ZSSjLX1can1Orb0hsrka7rMJDyDo4qDfjUvgBiYmoQzB+GqFXDVB2Hl++C9Q3BmBZLYA0ibMFGHN47CKwdh/WPo60eRUgyqXZYwgCG1wkebW+WF7hAr05LUEKYMu6XE5YHzUb8cR6GewldXw7e/CBedW3z8R+5B//wqMlDu0CyAsCRE2uS5xmE+BthWsvPaDRm2At8yFS7vijZ9p/RGBltvgIdu9sK3uO/Ua1W1k6RV/XMX+uRuxskjMnJT4UOVIdZTE8uwZ4ZhVA01XPUmXYzwHW3g+hWe4Kz1SfjBWvj6pz3/nXpfiE1X1JFOZdGOSKGPzK6hSBs4DHdVRnQJNRyjajy7ENWI9ZJwBi4wv0+HnarDJy+BOz8PuYU48sLNlYq7rTKnkR1OSgwCd4EolyCGMckHb9X3ADdohs5H+wRB7vpCh08yS7/c+bsw3SoFIERBxusHRvQ81oo1ALnjy1JmAQ7br/aNQD2D958Pn1nmNRmZmYUXCXQRyHKYyvz43BZ0NYeVMoMqXAvQym5r1YY6sl/uC7gMVl0I5ZJ32pMBaAl/cAK2/BqefBkOHvO+YsSH1gNHkHKpJwKdCEHUogrDoPfH5RG9UOBy8nZVOZ8KhkuXdHjd21ygy75D8Nl74Z/7/FJHuhzXqQdh5lahIUfEcVmyjqUxyhoSqmS4+ZQLGiqqC86euTpU9ZFmw6+88AvP9vRpje8GUZBGjoSy5KyJRfh4eKzzdV4iWDQ4M8DIQCOH3/4DokH/u2qPEvpLOgogypVGYUXILDJP9oBAUpoFIHDoOLw56S1xCopuwYfeS2JgcYj8UlwBHbu3kpFMZ8MJLbeodYiR6eO7NaHFBZAg8+JYYCiMLAygFccJMdz1UGKm1rTQzMGZHmFDhIpMHyRyIDAUA5V+SKjAmVUoRcE5BdLE/z1XuD17EBoWol7eiw+/E2nfq6WKVEY0925YMGk14InbYM3FaB5iviqcVUXiWWZxCkem0F5l5QolA7/cg9y4HQYGPJiiLQYaCANFraAKCwdgaLD/jL1oljH7DoHaPi2gNIwqh8OowkTKbahpbKcYKwq+98rDMvK5/T6fFJ0KAyocNgj7MWH51ufivPuazzhCXWSdX5FJXFAZfi8JhNeMCHtDga68w60l7OtHYN+bUCoKQHzWEmWvUWF3OzkUbE691rqvIu/tHZNbf3/5DZiY6lnQz5XIPOd3xxiepEmKoRJoNCeQBZXOdki/C5+T/f3KQSADUylYDxkMTRpq2CUA5RF9SkpcSRM3W0iVkMQ+dTF67ln+ZUZ8crrnalh6DtJ61ltG/+8YeudjoXzu2rw2Anv2IS8dgLhUiEKWEkab/LExzpVx2JOomYhVYbUzaxKLDfxmL4LtQpXBus+hS8/pZOjuMQIcb8BDTyE0T7SxJH6vqKgDS4TQ5HEQv11XKrPTpmzAMDgXjRQYrPoOLQ2mmU9Gc+WBoVCJRtKxgASfKlhKK4ZIG0xKzs9buxLx5GY5iPKwJAiKLeKMrW3C1nZIUSfOu67uLZeC4tsg4yP1HXKAYY2MP09RIWajZkxi2hR9tzXFYLTJFDHfBxWWE7bohjHpNtmP8j0pY4pY4TSIb4NsG9Ot8i+GMYyJ88yt4RjWKIX7XMoeEuJ3FYhwZuBSnk8TNnbO0dqLeFGWo4xLU4XrcExhEBT3LhBeMQiOuoPr2CINlqOtQ8BO7BgTx7BG2YPyorPcQCkM09PoD63t9RKGnBub4/I3hjXqPvybHvxqYhnVOBuXmsu4XcrEGNxpsYQX3kmZWDLuSLfLTkY17j30OzF6h+OcbFw22wa3ExNh3mHH9gd+QkJEyjfr43L/TOdkJ08/XSBoci2G4yREKPnbHGIVJSchImKKjK/Ut8um/g/5ukCk4/KodaxW5RmpEiPI2wDECy6IVInV8axJWZ2Oy8/mOmadvQAYk5xhjZoPyl8b/2W1ZtyNMCGVLiDa/rBgPkK7tuAVYgzHNOO7jZhVUztkT3DYfPbCdK7mHdtQkyx9QDaosFJzfozhqFSJSdqHgA6wOjMgDWBtOIEUEkyw6oTmbFPLyvQBGWOLNMI75/S7+X/scZsuxjIsytX1Bpft2cDApeedfPFjBA4chWV3Q2pDMZdTV+EvIjwB1NJtsh/o+2OPuI8NSaWGt8aLSH2LvAZsEtikI/qBRPkEcIVzrDCGxcAiuj63cY431fIalhfE8LQ1/D7bJn9vT9/53KavaPd/D9lR7RmnvxgAAAAASUVORK5CYII='};
    var self = this, p = this.props, st = this.state;
    var c = talby('studio', false), x = talby(st.theme, st.dark);
    c.titleFam = 'Lexend, Inter, ui-sans-serif, system-ui, sans-serif'; c.bodyFam = 'Inter, ui-sans-serif, system-ui, sans-serif';
    // Layout by width. Desktop (1248 and up) gets no overrides at all, so it stays the approved board.
    var W = st.w || 1440, isMob = W < 768, isTab = !isMob && W < 1024, isNarrow = !isMob && !isTab && W < 1248;
    function ov(m, tb, nr) { return isMob ? (m || '') : isTab ? (tb || '') : isNarrow ? (nr || '') : ''; }
    var secW = Math.min(1200, W - 48), pInner = secW - 2 * (isTab ? 32 : 40);
    var textCol = isNarrow ? Math.max(320, Math.min(380, pInner - 44 - 526)) : 380;
    var demoW = isTab ? pInner : pInner - 44 - textCol, cs = isTab ? Math.min(demoW / 720, 660 / 820) : Math.min(0.7305, demoW / 720), csOn = !isMob && cs !== 0.7305;
    var mz = Math.floor((W - 48) / 976 * 10000) / 10000, small = !isMob && W < 800;
    var h1M = Math.max(32, Math.min(44, Math.floor((W - 32) / 8.2)));
    var H2M = 'font-size: 32px; letter-spacing: -0.8px; line-height: 1.12; text-wrap: balance', BAL = 'text-wrap: balance';
    var R = {
      hdr: ov('position: relative; padding: 12px 16px 0'),
      navLogo: small ? 'margin-right: 10px' : '', navLink: small ? 'padding: 0 11px' : '', navGap: small ? 'width: 8px' : '',
      hero: ov('gap: 18px; padding: 44px 16px 0'),
      h1: ov('font-size: ' + h1M + 'px; letter-spacing: -1.2px; line-height: 1.08'),
      heroP: ov('font-size: 17px'), heroBtns: ov('flex-wrap: wrap; justify-content: center'), heroBtn: ov('padding: 0 18px'),
      pick: ov('padding: 32px 16px 16px'),
      pickCard: ov('flex-wrap: wrap; justify-content: space-between; gap: 8px; width: 100%; max-width: 480px; box-sizing: border-box; padding: 8px 8px 10px; border-radius: 24px'),
      pickLabel: ov('order: 0; padding-left: 10px'), pickGroup: ov('order: 2; flex: 1 1 100%; flex-wrap: wrap; justify-content: center; gap: 6px'),
      pickOpt: ov('height: 36px'), pickDiv: ov('display: none'), pickMode: ov('order: 1; height: 36px; background: ' + c.fill),
      ovSec: ov('padding: 0 16px 32px'), dots: ov('top: -24px'),
      mock: isTab ? 'width: 976px; max-width: none; flex: 0 0 auto; zoom: ' + mz : '',
      sec: ov('padding: 64px 16px 16px'), h2: ov(H2M, BAL), h2Story: ov('white-space: normal; ' + H2M), secP: ov('font-size: 16px'),
      cmpRow: ov('', 'grid-template-columns: 200px repeat(4, minmax(0, 1fr))'),
      tabs: ov('display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 2px; width: 100%; box-sizing: border-box; margin-top: 10px; border-radius: 20px'),
      tab: ov('flex-direction: column; justify-content: center; gap: 2px; height: 52px; padding: 0 4px; min-width: 0; border-radius: 16px; font-size: 13px; line-height: 1.2'),
      panelSec: ov('padding: 8px 12px 32px'),
      panel: ov('grid-template-columns: minmax(0, 1fr); gap: 20px; padding: 24px 12px 12px; border-radius: 24px', 'grid-template-columns: minmax(0, 1fr); gap: 28px; padding: 32px', textCol !== 380 ? 'grid-template-columns: ' + textCol + 'px minmax(0, 1fr)' : ''),
      ptext: ov('gap: 14px; padding: 0 8px', 'max-width: 620px'), h3: ov('font-size: 26px; letter-spacing: -0.6px; line-height: 1.18; text-wrap: balance', BAL), ptP: ov('font-size: 16px'), pAct: ov('flex-wrap: wrap'),
      demo: ov('height: 560px; border-radius: 16px', 'height: 660px'),
      cvp: csOn ? 'width: ' + (720 * cs).toFixed(2) + 'px' + (isTab ? '; height: 660px' : '') : '', cstage: csOn ? 'transform: scale(' + cs.toFixed(4) + ')' : '',
      dl: ov('padding: 14px; gap: 12px'), dlTabs: ov('height: 36px'), dlFoot: ov('height: 44px; padding: 0 12px'),
      sheet: ov('top: 8px; right: 8px; bottom: 8px; left: 8px; width: auto; padding: 16px'), sheetX: ov('width: 36px; height: 36px'),
      cal: ov('padding: 14px; gap: 10px'), calHead: ov('flex-wrap: wrap; row-gap: 6px'), dowCell: ov('padding: 0 5px; font-size: 11px'),
      calGrid: ov('grid-auto-rows: 46px'), calCell: ov('padding: 5px; gap: 5px'), dayList: ov('padding: 10px 12px; gap: 6px'),
      pay: ov('padding: 14px 10px 10px; gap: 12px'), payStats: ov('gap: 8px'), payStat: ov('padding: 12px 14px'), payLbl: ov('white-space: nowrap; overflow: hidden; text-overflow: ellipsis'),
      payVal: ov('font-size: 22px'), toast: ov('gap: 10px; padding: 10px 12px'), toastTxt: ov('white-space: normal; font-size: 13px; line-height: 1.35'),
      askSec: ov('padding: 64px 16px 72px', 'padding: 88px 24px'),
      askGrid: ov('grid-template-columns: minmax(0, 1fr); gap: 32px', 'grid-template-columns: minmax(0, 580px); justify-content: center; gap: 44px', 'grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 48px'),
      chat: ov('height: 520px; border-radius: 18px'), chatHead: ov('gap: 10px; padding: 12px 12px 12px 14px'), chatTitle: ov('min-width: 0'),
      chatSub: '', chatNew: ov('height: 36px; flex: 0 0 auto'),
      chatList: ov('padding: 14px'), srcChip: ov('max-width: 100%; overflow: hidden; text-overflow: ellipsis'),
      chip: ov('height: auto; min-height: 40px; padding: 9px 14px; white-space: normal; text-align: left; line-height: 1.35'),
      chatBar: ov('padding: 10px 12px'), chatIn: ov('font-size: 16px'),
      askText: ov('gap: 14px'), askBadge: ov('width: 48px; height: 48px'),
      priceSec: ov('padding: 16px 16px 72px'), priceGrid: ov('grid-template-columns: minmax(0, 1fr); gap: 16px; margin-top: 18px'),
      plan: ov('padding: 24px; border-radius: 20px'), price: ov('font-size: 44px'),
      cta: ov('gap: 16px; padding: 72px 16px'), ctaH2: ov('font-size: 34px; letter-spacing: -1px; line-height: 1.1; text-wrap: balance'), ctaP: ov('font-size: 16px'),
      foot: ov('padding: 24px 16px 32px', 'padding: 28px 24px 36px', 'padding: 28px 24px 36px'), footLinks: ov('', 'column-gap: 22px', 'column-gap: 22px')
    };
    function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
    var PAYC = { 'Paid': [x.okBg, x.okFg], 'Invoiced': [x.warnBg, x.warnFg], 'Not invoiced': [x.fill, x.mutedFg], 'Late': [x.badBg, x.badFg] };
    var DEALS = [
      { brand: 'Halcyon Skincare', amt: 5500, status: 'active', pay: 'Not invoiced', post: 'Oct 15', postFull: 'Oct 15 and Oct 27', payBy: 'Nov 14', plats: ['TikTok', 'Instagram'], file: 'Halcyon_contract_signed.pdf' },
      { brand: 'Meadowlark Tea', amt: 3900, status: 'active', pay: 'Invoiced', post: 'Oct 22', postFull: 'Oct 22', payBy: 'Nov 8', plats: ['Instagram'], file: 'Meadowlark_agreement.pdf' },
      { brand: 'Basewear Co.', amt: 9800, status: 'active', pay: 'Not invoiced', post: 'Nov 3', postFull: 'Nov 3', payBy: 'Dec 3', plats: ['YouTube', 'TikTok'], file: 'Basewear_SOW.pdf' },
      { brand: 'Nova Nutrition', amt: 1450, status: 'paid', pay: 'Paid', post: 'Oct 2', postFull: 'Oct 2', payBy: 'Oct 12', plats: ['TikTok'], file: 'Nova_brief.pdf' },
      { brand: 'Lumen Beauty', amt: 5000, status: 'paid', pay: 'Paid', post: 'Sep 18', postFull: 'Sep 18', payBy: 'Oct 1', plats: ['Instagram', 'Facebook'], file: 'Lumen_contract.pdf' }
    ];
    function plats(d) { return d.plats.map(function (n) { return { label: n, icon: PLATICON[n] || '' }; }); }
    var ICONS = { Overview: 'M4 3h5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM15 3h5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM15 12h5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM4 16h5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1z', Deals: 'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z', Calendar: 'M8 2v4M16 2v4M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM3 10h18', Payments: 'M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4', Ideas: 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4', 'To-dos': 'm3 17 2 2 4-4M3 7l2 2 4-4M13 6h8M13 12h8M13 18h8' };
    var mockNav = ['Overview', 'Deals', 'Calendar', 'Payments', 'Ideas', 'To-dos'].map(function (n, i) { return { label: n, icon: ICONS[n], bg: i === 0 ? x.navOn : 'transparent', fg: i === 0 ? x.fg : x.mutedFg, ic: i === 0 ? x.accent : x.mutedFg, fw: i === 0 ? '600' : '500', hasCount: n === 'Deals', count: '19' }; });
    var THEMES = ['studio', 'sand', 'mac', 'stationery', 'editorial'];
    // Swatches: an edgy gradient per theme, built only from that theme's own colors.
    // c: base a, base b, big blob, low blob, corner blob. f: how soft the blob edges are.
    var EDGY = { studio: { c: ['#A9CCF5', '#171717', '#1F7AE0', '#F5F5F5', '#171717'], f: 1 }, sand: { c: ['#B08968', '#8A7466', '#D9B89C', '#6E4B39', '#F5EFE8'], f: 1.25 },
      mac: { c: ['#86868B', '#D1D1D6', '#CACACF', '#3A3A3C', '#F5F5F7'], f: 1 }, stationery: { c: ['#857B6B', '#CBBFA8', '#F2ECDF', '#2E2A24', '#2B3A55'], f: 0.9 },
      editorial: { c: ['#6B6B6B', '#FFFFFF', '#111111', '#FFFFFF', '#111111'], f: 0.35 } };
    function edgy(id) {
      var t = EDGY[id] || EDGY.studio, c = t.c;
      function e(a, b) { return a + '%, transparent ' + Math.round(a + (b - a) * t.f) + '%'; }
      return 'radial-gradient(64% 56% at 60% 36%, ' + c[2] + ' 0 ' + e(42, 70) + '), radial-gradient(58% 52% at 20% 70%, ' + c[3] + ' 0 ' + e(46, 74) + '), '
        + 'radial-gradient(44% 40% at 86% 76%, ' + c[4] + ' 0 ' + e(44, 76) + '), conic-gradient(from 210deg at 50% 50%, ' + c[0] + ', ' + c[1] + ', ' + c[0] + ')';
    }
    var themeOpts = THEMES.map(function (id) { var y = talby(id, st.dark), on = st.theme === id; return { label: y.name, on: on, swatch: edgy(id), bg: on ? c.primary : 'transparent', fg: on ? c.primaryFg : c.fg, hv: on ? c.primary : c.hv, pick: function () { self.setState({ theme: id }); } }; });
    function tabSt(on, z) { return { bg: on ? z.tabOn : 'transparent', sh: on ? z.tabSh : 'none', fg: on ? z.fg : z.mutedFg }; }
    var STORY = {
      contract: { n: '01', label: 'Contract', eyebrow: 'Step 1, the contract', title: 'The contract shows up. Talby reads it.', body: 'Drop in the signed PDF. Talby pulls out the brand, rate, deliverables, post date and payment terms.', bullets: ['Brand, rate, deliverables and dates filled in', 'Every field stays editable', 'The PDF stays on the deal'], hint: 'Click the box to try it', hintM: 'Tap the box to try it' },
      deal: { n: '02', label: 'Deal', eyebrow: 'Step 2, the deal', title: 'Now it is a deal, next to all your others.', body: 'Brand, value, payment and post date on one line. Open any deal to see the details and the contract.', bullets: ['One line per deal, nothing to set up', 'Filter by Active, Paid or All', 'The total follows the filter'], hint: 'Click a deal to open it', hintM: 'Tap a deal to open it' },
      calendar: { n: '03', label: 'Calendar', eyebrow: 'Step 3, the dates', title: 'Post dates and pay dates on the same calendar.', body: 'Every post and every payment lands on one month view, so nothing sneaks up on you.', bullets: ['Posts and payments together', 'Every deal, not just one', 'Open any day to see what is due'], hint: 'Click a day to see it', hintM: 'Tap a day to see it' },
      payment: { n: '04', label: 'Payment', eyebrow: 'Step 4, the money', title: 'The money lands, and your year adds up.', body: 'Each payment shows if it is expected, invoiced, paid or late. Mark it paid and your totals update.', bullets: ['Tracked per payment, not per deal', 'Mark it paid in one click', 'Your year to date total is always current'], hint: 'Mark one as paid', hintM: 'Mark one as paid' }
    };
    var KEYS = ['contract', 'deal', 'calendar', 'payment'];
    var storyTabs = KEYS.map(function (key) { var on = st.tab === key, ts = tabSt(on, c); return { n: STORY[key].n, nFg: on ? c.accent : c.mutedFg, label: STORY[key].label, on: on, bg: ts.bg, sh: ts.sh, fg: ts.fg, pick: function () { self.setState({ tab: key, sheet: -1 }); } }; });
    var F = st.filter, shown = DEALS.map(function (d, i) { return { d: d, i: i }; }).filter(function (r) { return F === 'all' || r.d.status === F; });
    var dealTabs = [['active', 'Active'], ['paid', 'Paid'], ['all', 'All']].map(function (f) { var on = F === f[0], ts = tabSt(on, x); return { label: f[1], on: on, bg: ts.bg, sh: ts.sh, fg: ts.fg, pick: function () { self.setState({ filter: f[0], sheet: -1 }); } }; });
    var total = shown.reduce(function (a, r) { return a + r.d.amt; }, 0);
    var sd = st.sheet >= 0 ? DEALS[st.sheet] : null;
    var EV = { 1: [['Lumen Beauty paid', 'pay', '$5,000']], 2: [['Nova Nutrition post', 'post', '']], 12: [['Nova Nutrition paid', 'pay', '$1,450']], 15: [['Halcyon video 1', 'post', '']], 22: [['Meadowlark Tea post', 'post', '']], 27: [['Halcyon video 2', 'post', '']] };
    var calDays = [];
    for (var i = 0; i < 35; i++) {
      (function (i) {
        var n = i - 3, inMonth = n >= 1 && n <= 31, num = inMonth ? n : (n < 1 ? 27 + i : n - 31), on = inMonth && st.day === n, today = inMonth && n === 14;
        var ev = (inMonth && EV[n] ? EV[n] : []).map(function (e) { return { label: e[0], bg: e[1] === 'pay' ? x.okBg : x.postBg, fg: e[1] === 'pay' ? x.okFg : x.postFg, dot: e[1] === 'pay' ? '#22C55E' : '#8B5CF6' }; });
        calDays.push({ n: String(num), on: on, aria: inMonth ? 'October ' + n : 'Other month', ev: ev, fw: today ? '700' : '500', fg: inMonth ? x.fg : x.mutedFg,
          bg: on ? x.soft : (inMonth ? 'transparent' : x.hvr), ring: on ? ('inset 0 0 0 2px ' + x.primary) : (today ? ('inset 0 0 0 1px ' + x.borderStrong) : 'none'),
          pick: function () { if (inMonth) self.setState({ day: n }); } });
      })(i);
    }
    var di = (EV[st.day] || []).map(function (e) { return { text: e[0], dot: e[1] === 'pay' ? '#22C55E' : '#8B5CF6', amt: e[2] }; });
    var OWED = [['Meadowlark Tea', 'Invoice sent Oct 9, due Nov 8', 3900, 'Invoiced'], ['Halcyon Skincare', 'Due Nov 14', 5500, 'Not invoiced'], ['Basewear Co.', 'Due Dec 3', 9800, 'Not invoiced'], ['Nova Nutrition', 'Paid Oct 12', 1450, 'Paid']];
    var recv = 77850, owed = 0;
    var payRows = OWED.map(function (r, i) {
      var isPaid = r[3] === 'Paid' || !!st.paid[i], status = isPaid ? 'Paid' : r[3];
      if (st.paid[i]) recv += r[2]; if (!isPaid) owed += r[2];
      return { brand: r[0], when: st.paid[i] ? 'Paid today' : r[1], amtS: fmt(r[2]), status: status, chipBg: PAYC[status][0], chipFg: PAYC[status][1], anim: st.paid[i] ? 'a-pop' : '',
        canPay: !isPaid, line: i ? '1px solid ' + x.line : 'none',
        pay: function () { var o = Object.assign({}, st.paid); o[i] = true; var nr = 77850; Object.keys(o).forEach(function (k2) { nr += OWED[k2][2]; }); self.setState({ paid: o, payToast: fmt(r[2]) + ' from ' + r[0] + '. That makes ' + fmt(nr) + ' this year.' }); clearTimeout(self._pt); self._pt = setTimeout(function () { self.setState({ payToast: '' }); }, 4200); } };
    });
    var CMP_COLS = [['Notes app', 'M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 8h6M9 12h6M9 16h4'], ['Spreadsheet', 'M4 4h16v16H4zM4 10h16M4 15h16M10 4v16'], ['Notion', 'M4 5h4v14H4zM10 5h4v9h-4zM16 5h4v11h-4z'], ['Talby', '']];
    var CMP = [['Getting a deal in', 'Type it out', 'Fill in the row', 'Fill in the card', 'Upload the contract'], ['Where the contract lives', 'Somewhere in email', 'Somewhere in email', 'Attached, if you remember', 'On the deal'], ['Post date and pay date together', 'No', 'Two columns you maintain', 'If you build the view', 'One calendar'], ['Invoiced, paid or late', 'Whatever you last wrote', 'A column you update', 'A property you update', 'Tracked per payment'], ['What you made this year', 'Add it up yourself', 'A formula you wrote', 'A rollup you built', 'Always on the overview'], ['Answers about your deals', 'Scroll and search', 'Scroll and search', 'Scroll and search', 'Ask the assistant']];
    var PLANS = [
      { name: 'Trial', note: '14 days, full access', price: '$0', per: 'for 14 days', items: ['Contract reading, deals, calendar and payments', 'Import from a spreadsheet or Notion', 'Talby Assistant', 'Retainer and repeating deals', 'Year end income summary'], href: '/signup', cta: 'Start free trial', cls: 'tg', border: '1px solid ' + c.border, sh: 'none', btnBorder: '1px solid ' + c.border, btnBg: c.card, btnFg: c.fg },
      { name: 'Unlimited', note: 'Full access, cancel anytime', price: '$9', per: 'a month', items: ['Everything in the trial, ongoing', 'Talby Assistant', 'Retainer and repeating deals', 'Year end income summary'], href: '/signup?plan=unlimited', cta: 'Subscribe for $9 a month', cls: 'tp', border: '1.5px solid ' + c.accent, sh: '0 30px 60px -36px rgba(31,122,224,0.45)', btnBorder: 'none', btnBg: c.primary, btnFg: c.primaryFg }
    ];
    // Footer: Privacy policy and Terms and conditions go to the real routes. Aerolune LLC is plain text.
    var FOOT = [['Blog', '/blog'], ['Privacy policy', '/privacy'], ['Terms and conditions', '/terms'], ['hello@talby.io', 'mailto:hello@talby.io'], ['Aerolune LLC', '']];
    var ASK = ['What did I agree to for exclusivity with Halcyon?', 'How much have I made from skincare deals this year?', 'What is coming up this week?', 'Did Basewear say anything about usage rights?'];
    var lastI = st.msgs.length - 1;
    var msgs = st.msgs.map(function (m, i) { var live = st.streaming && i === lastI && !m.me; return { text: live ? m.text.slice(0, st.streamN) : m.text, align: m.me ? 'flex-end' : 'flex-start', maxW: m.me ? '80%' : '90%', bg: m.me ? x.primary : x.tile, fg: m.me ? x.primaryFg : x.fg, radius: m.me ? '16px 16px 6px 16px' : '16px 16px 16px 6px', hasSrc: !live && !!m.src, src: m.src || '' }; });
    var asked = {}; st.msgs.forEach(function (m) { if (m.me) asked[m.text] = true; });
    var menuOn = isMob && st.menu;
    return {
      c: c, x: x, R: R, dark: st.dark ? 'true' : 'false', isMob: isMob, notMob: !isMob,
      menuOpen: menuOn, menuOpenS: menuOn ? 'true' : 'false', menuLabel: menuOn ? 'Close menu' : 'Menu', menuBtnBg: menuOn ? c.fill : 'transparent',
      menuIcon: menuOn ? 'M18 6 6 18M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16',
      toggleMenu: function () { self.setState({ menu: !self.state.menu }); }, closeMenu: function () { self.setState({ menu: false }); },
      cmpCols: CMP_COLS.map(function (cc, i) { var tb = i === 3; return { label: cc[0], icon: cc[1], isTalby: tb, notTalby: !tb, img: tb ? null : (i === 0 ? '/logo-notes-app.png' : i === 1 ? '/logo-spreadsheet.png' : i === 2 ? '/logo-notion.png' : null), bg: tb ? c.tile : 'transparent', tileBg: tb ? c.card : c.fill, tileSh: tb ? ('0 0 0 1px ' + c.border) : 'none' }; }),
      cmpRows: CMP.map(function (r, ri) { return { label: r[0], cells: r.slice(1).map(function (txt, ci) { var tb = ci === 3, last = ri === CMP.length - 1; return { text: txt, check: tb, notCheck: !tb, tool: CMP_COLS[ci][0], icon: CMP_COLS[ci][1], tileBg: tb ? c.card : c.fill, tileSh: tb ? ('0 0 0 1px ' + c.border) : 'none', bg: tb ? c.tile : 'transparent', fg: tb ? c.fg : c.mutedFg, fw: tb ? '600' : '400', line: tb ? c.border : c.line, radius: tb && last ? '0 0 18px 18px' : '0' }; }) }; }),
      plans: PLANS,
      footRow: W >= 1100, footStack: W < 1100,
      footLinks: FOOT.map(function (l) { return { label: l[0], href: l[1] || '#', isLink: !!l[1], plain: !l[1] }; }),
      cvars: '--hv: ' + c.hv + '; --hvr: ' + c.hvr + '; --fg: ' + c.fg + '; --ring: ' + c.ring + '; --bd2: ' + c.borderStrong + '; --shh: ' + c.shHover,
      xvars: '--hv: ' + x.hv + '; --hvr: ' + x.hvr + '; --fg: ' + x.fg + '; --ring: ' + x.ring,
      navLinks: [['Why Talby', '#compare'], ['How it works', '#story'], ['Pricing', '#pricing'], ['Blog', '/blog']].map(function (l) { return { label: l[0], href: l[1] }; }),
      themeOpts: themeOpts, toggleDark: function () { self.setState({ dark: !st.dark }); }, modeLabel: st.dark ? 'Dark' : 'Light',
      modeIcon: st.dark ? 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z' : 'M12 3v1M12 20v1M4.2 4.2l.7.7M19.1 19.1l.7.7M3 12h1M20 12h1M4.2 19.8l.7-.7M19.1 4.9l.7-.7M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
      mockNav: mockNav, mockH1: Math.round(24 * x.hScale) + 'px', mockH1m: Math.round(20 * x.hScale) + 'px', demoH: Math.round(20 * x.hScale) + 'px',
      mockMoney: [['Booked', '$106,250', 'Across 19 deals'], ['Received', '$77,850', 'Paid to you this year'], ['Still owed', '$19,200', '3 payments on the way'], ['Late', '$0', 'Nothing late']].map(function (m, i) { return { label: m[0], value: m[1], sub: m[2], line: i ? '1px solid ' + x.line : 'none', lineL: i % 2 ? '1px solid ' + x.line : 'none', lineT: i > 1 ? '1px solid ' + x.line : 'none' }; }),
      mockTabs: ['Active', 'Paid', 'All'].map(function (l, i) { var ts = tabSt(i === 0, x); return { label: l, bg: ts.bg, sh: ts.sh, fg: ts.fg }; }),
      mockDeals: DEALS.map(function (d) { return { brand: d.brand, init: d.brand.charAt(0), post: d.post, plats: plats(d), pay: d.pay, chipBg: PAYC[d.pay][0], chipFg: PAYC[d.pay][1], amtS: fmt(d.amt) }; }),
      mockWeek: [['Wed', '14', 'Meadowlark Tea draft due', 'Send it for approval', x.tile, x.fg], ['Thu', '15', 'Halcyon Skincare video 1', 'Posts tomorrow on TikTok', x.postBg, x.postFg], ['Sat', '17', 'Lumen Beauty usage ends', 'They can stop reposting', x.tile, x.fg]].map(function (w) { return { dow: w[0], day: w[1], title: w[2], sub: w[3], bg: w[4], fg: w[5] }; }),
      storyTabs: storyTabs, story: STORY[st.tab], storyHint: isMob || st.touch ? STORY[st.tab].hintM : STORY[st.tab].hint,
      isContract: st.tab === 'contract', isDeal: st.tab === 'deal', isCal: st.tab === 'calendar', isPay: st.tab === 'payment',
      runA: st.run % 2 === 0, runB: st.run % 2 === 1, replay: function () { self.setState({ run: st.run + 1 }); },
      dealTabs: dealTabs, dealCount: shown.length + (shown.length === 1 ? ' deal' : ' deals'), dealTotal: fmt(total),
      dealRows: shown.map(function (r, j) { var d = r.d; return { brand: d.brand, init: d.brand.charAt(0), post: d.post, plats: plats(d), pay: d.pay, chipBg: PAYC[d.pay][0], chipFg: PAYC[d.pay][1], amtS: fmt(d.amt), bg: st.sheet === r.i ? x.hvr : 'transparent', delay: (j * 0.04).toFixed(2) + 's', open: function () { self.setState({ sheet: r.i }); } }; }),
      hasSheet: !!sd, closeSheet: function () { self.setState({ sheet: -1 }); },
      sheet: sd ? { brand: sd.brand, init: sd.brand.charAt(0), plats: plats(sd), file: sd.file, rows: [['Amount', fmt(sd.amt)], ['Payment', sd.pay], ['Posts', sd.postFull], ['Pay by', sd.payBy], ['Status', sd.status === 'paid' ? 'Done' : 'Active']].map(function (q) { return { k: q[0], v: q[1] }; }) } : { brand: '', init: '', plats: [], file: '', rows: [] },
      dows: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], calDays: calDays, dayTitle: 'October ' + st.day + (st.day === 14 ? ', today' : ''), dayItems: di, dayEmpty: di.length === 0,
      payStats: [['Received this year', fmt(recv), 'Updates the moment you mark one paid', x.fg], ['Still owed', fmt(owed), owed ? 'On its way to you' : 'All paid up', owed ? x.fg : x.okFg]].map(function (s2) { return { label: s2[0], value: s2[1], sub: s2[2], fg: s2[3] }; }),
      payRows: payRows, hasPayToast: !!st.payToast, payToast: st.payToast,
      askChips: ASK.filter(function (q) { return !asked[q]; }).map(function (q) { return { label: q, pick: function () { self.ask(q); } }; }),
      showChips: !st.typing && !st.streaming && ASK.some(function (q) { return !asked[q]; }), chipsLabel: st.msgs.length ? 'Ask something else' : 'Try asking',
      askPoints: ['Answers from your own contracts and payments', 'Shows where every answer came from', 'Says so when it does not know, instead of guessing'],
      resetChat: function () { clearTimeout(self._ty); clearInterval(self._sv); self.setState({ msgs: [], typing: false, streaming: false, streamN: 0, draft: '' }); },
      chatRef: function (el) { self.chat = el; }, msgs: msgs, typing: st.typing,
      draft: st.draft, setDraft: function (e) { self.setState({ draft: e.target.value }); }, draftKey: function (e) { if (e && e.key === 'Enter') self.ask(st.draft); }, send: function () { self.ask(st.draft); }
    };
  }
}
return Component;
})();

function render($s0, host) {
  const { A, T, I, V0, S, HS, H } = $r;
  return (<>
      <div {...S(`box-sizing: border-box; min-height: 100vh; background: ${I($s0?.c?.page)}; color: ${I($s0?.c?.fg)}; font-family: ${I($s0?.c?.bodyFam)}; font-size: 15px; line-height: 1.5; -webkit-font-smoothing: antialiased; ${I($s0?.cvars)}`)}>
        <header {...S(`display: flex; justify-content: center; padding: 20px 24px 0; ${I($s0?.R?.hdr)}`)}>
          {$s0?.notMob ? (<>
            <nav aria-label={"Main"} {...S(`display: flex; align-items: center; gap: 6px; height: 52px; padding: 0 8px 0 20px; box-sizing: border-box; border: 1px solid ${I($s0?.c?.border)}; border-radius: 999px; background: ${I($s0?.c?.card)}; box-shadow: 0 8px 24px -16px rgba(0,0,0,0.2)`)}>
              <span {...S(`display: inline-flex; align-items: center; gap: 9px; margin-right: 18px; ${I($s0?.R?.navLogo)}`)}>
                <svg width={"26"} height={"22"} viewBox={"0 0 2029 1722"} aria-hidden={"true"} {...S("display: block")}>
                  <path fill={"#1F7AE0"} d={"M325.553 0.11436C357.82 -0.851434 390.344 4.39925 421.577 12.1099C506.351 33.0387 579.306 92.8684 628.981 163.1C648.617 190.863 665.004 221.256 682.357 250.477C714.91 305.296 746.394 360.846 779.411 415.372C792.242 436.561 805.088 458.322 818.991 478.81C853.846 530.177 928.98 628.305 990.503 643.014C1013.94 648.615 1037.46 645.591 1058.97 634.725C1078.92 624.656 1094.72 608.763 1110.74 593.552C1184.16 523.869 1237.02 434.688 1287.42 347.839C1299.09 327.74 1311.38 307.989 1322.85 287.786C1346.79 245.624 1371.62 198.953 1400.03 160.003C1431.42 116.962 1467.92 79.9142 1513.59 51.9883C1592.43 3.35327 1687.5 -11.5536 1777.44 10.6178C1861.41 31.3662 1933.82 84.3529 1979.02 158.109C2024.53 233.037 2040.98 310.935 2019.97 397.268C1988.25 527.6 1882.9 628.138 1749.42 647.874C1724.27 651.594 1693.72 650.686 1668.06 650.648L1562.66 650.457L1294.18 650.569C1229.3 650.36 1166.25 642.367 1109.31 677.354C1075.41 697.881 1051.07 731.066 1041.68 769.577C1024.74 841.175 1063.31 906.426 1099.22 965.078C1103.02 971.823 1114.46 985.726 1119.82 992.612C1140.88 1019.75 1162.84 1046.17 1185.68 1071.84C1264.51 1161.22 1337.81 1269.48 1345.12 1391.87C1355.92 1572.91 1205.73 1711.69 1031.77 1721.4C938.596 1726.86 847.128 1694.71 777.855 1632.13C733.34 1591.55 702.231 1538.38 688.665 1479.68C676.384 1428.85 679.574 1377.6 692.642 1327.29C710.038 1260.33 744.366 1197.92 785.127 1142.41C854.647 1047.73 998.351 921.921 991.042 795.526C987.346 731.658 941.997 680.383 882.362 660.534C837.4 645.57 776.985 650.524 728.979 650.558L429.507 650.401L351.229 650.568C319.765 650.635 286.204 651.2 255.381 644.239C194.201 631.235 150.38 605.052 104.113 565.316C-67.2929 418.104 -14.8418 150.672 172.337 43.4476C223.087 14.3754 266.379 3.16906 325.553 0.11436Z"} />
                </svg>
                <span {...S(`font-family: ${I($s0?.c?.titleFam)}; font-size: 18px; font-weight: 700; letter-spacing: -0.4px`)}>
                  {"Talby"}
                </span>
              </span>
              {A($s0?.navLinks).map((it, i) => {
                const $s1 = { ...$s0, "nl": it, $index: i };
                return (<React.Fragment key={i}>
                  <a href={H($s1?.nl?.href)} className={"tb tg"} {...S(`--hv: ${I($s1?.c?.hv)}; display: inline-flex; align-items: center; height: 36px; padding: 0 14px; border-radius: 999px; color: ${I($s1?.c?.fg)}; font-size: 14px; font-weight: 500; text-decoration: none; white-space: nowrap; ${I($s1?.R?.navLink)}`)}>
                    {T($s1?.nl?.label)}
                  </a>
                </React.Fragment>);
              })}
              <span {...S(`width: 18px; ${I($s0?.R?.navGap)}`)} />
              <a href={H("/login")} className={"tb tg"} {...S(`--hv: ${I($s0?.c?.hv)}; display: inline-flex; align-items: center; height: 36px; padding: 0 14px; border-radius: 999px; color: ${I($s0?.c?.fg)}; font-size: 14px; font-weight: 500; text-decoration: none; white-space: nowrap; ${I($s0?.R?.navLink)}`)}>
                {"Log in"}
              </a>
              <a href={H("/signup")} className={"tb tp"} {...S(`display: inline-flex; align-items: center; height: 36px; padding: 0 16px; border-radius: 999px; background: ${I($s0?.c?.primary)}; color: ${I($s0?.c?.primaryFg)}; font-size: 14px; font-weight: 500; text-decoration: none; white-space: nowrap`)}>
                {"Start free trial"}
              </a>
            </nav>
          </>) : null}
          {$s0?.isMob ? (<>
            <nav aria-label={"Main"} {...S(`position: relative; z-index: 61; flex: 1 1 auto; min-width: 0; display: flex; align-items: center; gap: 8px; height: 56px; padding: 0 8px 0 18px; box-sizing: border-box; border: 1px solid ${I($s0?.c?.border)}; border-radius: 999px; background: ${I($s0?.c?.card)}; box-shadow: 0 8px 24px -16px rgba(0,0,0,0.2)`)}>
              <span {...S("display: inline-flex; align-items: center; gap: 9px")}>
                <svg width={"26"} height={"22"} viewBox={"0 0 2029 1722"} aria-hidden={"true"} {...S("display: block")}>
                  <path fill={"#1F7AE0"} d={"M325.553 0.11436C357.82 -0.851434 390.344 4.39925 421.577 12.1099C506.351 33.0387 579.306 92.8684 628.981 163.1C648.617 190.863 665.004 221.256 682.357 250.477C714.91 305.296 746.394 360.846 779.411 415.372C792.242 436.561 805.088 458.322 818.991 478.81C853.846 530.177 928.98 628.305 990.503 643.014C1013.94 648.615 1037.46 645.591 1058.97 634.725C1078.92 624.656 1094.72 608.763 1110.74 593.552C1184.16 523.869 1237.02 434.688 1287.42 347.839C1299.09 327.74 1311.38 307.989 1322.85 287.786C1346.79 245.624 1371.62 198.953 1400.03 160.003C1431.42 116.962 1467.92 79.9142 1513.59 51.9883C1592.43 3.35327 1687.5 -11.5536 1777.44 10.6178C1861.41 31.3662 1933.82 84.3529 1979.02 158.109C2024.53 233.037 2040.98 310.935 2019.97 397.268C1988.25 527.6 1882.9 628.138 1749.42 647.874C1724.27 651.594 1693.72 650.686 1668.06 650.648L1562.66 650.457L1294.18 650.569C1229.3 650.36 1166.25 642.367 1109.31 677.354C1075.41 697.881 1051.07 731.066 1041.68 769.577C1024.74 841.175 1063.31 906.426 1099.22 965.078C1103.02 971.823 1114.46 985.726 1119.82 992.612C1140.88 1019.75 1162.84 1046.17 1185.68 1071.84C1264.51 1161.22 1337.81 1269.48 1345.12 1391.87C1355.92 1572.91 1205.73 1711.69 1031.77 1721.4C938.596 1726.86 847.128 1694.71 777.855 1632.13C733.34 1591.55 702.231 1538.38 688.665 1479.68C676.384 1428.85 679.574 1377.6 692.642 1327.29C710.038 1260.33 744.366 1197.92 785.127 1142.41C854.647 1047.73 998.351 921.921 991.042 795.526C987.346 731.658 941.997 680.383 882.362 660.534C837.4 645.57 776.985 650.524 728.979 650.558L429.507 650.401L351.229 650.568C319.765 650.635 286.204 651.2 255.381 644.239C194.201 631.235 150.38 605.052 104.113 565.316C-67.2929 418.104 -14.8418 150.672 172.337 43.4476C223.087 14.3754 266.379 3.16906 325.553 0.11436Z"} />
                </svg>
                <span {...S(`font-family: ${I($s0?.c?.titleFam)}; font-size: 18px; font-weight: 700; letter-spacing: -0.4px`)}>
                  {"Talby"}
                </span>
              </span>
              <span {...S("flex: 1 1 auto")} />
              <button type={"button"} className={"tb tg"} onClick={$s0?.toggleMenu} aria-label={$s0?.menuLabel} aria-expanded={$s0?.menuOpenS} aria-controls={"home-menu"} {...S(`--hv: ${I($s0?.c?.hv)}; width: 40px; height: 40px; flex: 0 0 40px; padding: 0; border: none; border-radius: 999px; background: ${I($s0?.menuBtnBg)}; color: ${I($s0?.c?.fg)}; display: inline-flex; align-items: center; justify-content: center; cursor: pointer`)}>
                <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={$s0?.menuIcon} />
                </svg>
              </button>
            </nav>
            {$s0?.menuOpen ? (<>
              <button type={"button"} className={"a-fade"} tabIndex={"-1"} aria-hidden={"true"} onClick={$s0?.closeMenu} {...S(`position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 59; padding: 0; border: none; background: ${I($s0?.c?.overlay)}; cursor: default`)} />
              <div id={"home-menu"} className={"a-drop"} {...S(`position: absolute; top: 76px; right: 16px; left: 16px; z-index: 62; display: flex; flex-direction: column; gap: 2px; padding: 8px; box-sizing: border-box; border: 1px solid ${I($s0?.c?.border)}; border-radius: 24px; background: ${I($s0?.c?.card)}; box-shadow: 0 16px 40px -12px rgba(0,0,0,0.2)`)}>
                {A($s0?.navLinks).map((it, i) => {
                  const $s1 = { ...$s0, "nl": it, $index: i };
                  return (<React.Fragment key={i}>
                    <a href={H($s1?.nl?.href)} className={"tb tg"} onClick={$s1?.closeMenu} {...S(`--hv: ${I($s1?.c?.hv)}; display: flex; align-items: center; justify-content: space-between; gap: 12px; height: 48px; padding: 0 14px 0 16px; box-sizing: border-box; border-radius: 16px; color: ${I($s1?.c?.fg)}; font-size: 16px; font-weight: 500; text-decoration: none; white-space: nowrap`)}>
                      {T($s1?.nl?.label)}
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s1?.c?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"m9 6 6 6-6 6"} />
                      </svg>
                    </a>
                  </React.Fragment>);
                })}
                <div {...S(`display: flex; gap: 8px; margin-top: 6px; padding-top: 10px; border-top: 1px solid ${I($s0?.c?.line)}`)}>
                  <a href={H("/login")} className={"tb tg"} onClick={$s0?.closeMenu} {...S(`--hv: ${I($s0?.c?.hv)}; flex: 1 1 0; min-width: 0; display: inline-flex; align-items: center; justify-content: center; height: 46px; box-sizing: border-box; border: 1px solid ${I($s0?.c?.border)}; border-radius: 999px; color: ${I($s0?.c?.fg)}; font-size: 15px; font-weight: 500; text-decoration: none; white-space: nowrap`)}>
                    {"Log in"}
                  </a>
                  <a href={H("/signup")} className={"tb tp"} onClick={$s0?.closeMenu} {...S(`flex: 1 1 0; min-width: 0; display: inline-flex; align-items: center; justify-content: center; height: 46px; border-radius: 999px; background: ${I($s0?.c?.primary)}; color: ${I($s0?.c?.primaryFg)}; font-size: 15px; font-weight: 500; text-decoration: none; white-space: nowrap`)}>
                    {"Start free trial"}
                  </a>
                </div>
              </div>
            </>) : null}
          </>) : null}
        </header>
        <section aria-labelledby={"hero-title"} {...S(`display: flex; flex-direction: column; align-items: center; gap: 22px; padding: 72px 24px 0; text-align: center; ${I($s0?.R?.hero)}`)}>
          <h1 id={"hero-title"} className={"a-in"} {...S(`margin: 0; font-family: ${I($s0?.c?.titleFam)}; font-size: 68px; font-weight: 600; letter-spacing: -2.4px; line-height: 1.04; ${I($s0?.R?.h1)}`)}>
            {$s0?.notMob ? (<>
              {"Every brand deal in"}
              <br />
              <span {...S(`color: ${I($s0?.c?.accent)}`)}>
                {"one place."}
              </span>
            </>) : null}
            {$s0?.isMob ? (<>
              {"Every brand deal"}
              <br />
              {"in "}
              <span {...S(`color: ${I($s0?.c?.accent)}`)}>
                {"one place."}
              </span>
            </>) : null}
          </h1>
          <p className={"a-in"} {...S(`animation-delay: 0.06s; margin: 0; max-width: 620px; font-size: 19px; color: ${I($s0?.c?.mutedFg)}; ${I($s0?.R?.heroP)}`)}>
            {"Talby is the calm command center for creators. Track what you agreed to, when it is due, and what has actually landed."}
          </p>
          <div className={"a-in"} {...S(`animation-delay: 0.12s; display: flex; gap: 10px; ${I($s0?.R?.heroBtns)}`)}>
            <a href={H("/signup")} className={"tb tp"} {...S(`display: inline-flex; align-items: center; height: 46px; padding: 0 22px; border-radius: 999px; background: ${I($s0?.c?.primary)}; color: ${I($s0?.c?.primaryFg)}; font-weight: 500; text-decoration: none; white-space: nowrap; ${I($s0?.R?.heroBtn)}`)}>
              {"Start free trial"}
            </a>
            <a href={H("#story")} className={"tb tg"} {...S(`--hv: ${I($s0?.c?.hv)}; display: inline-flex; align-items: center; height: 46px; padding: 0 22px; border-radius: 999px; border: 1px solid ${I($s0?.c?.border)}; color: ${I($s0?.c?.fg)}; font-weight: 500; text-decoration: none; white-space: nowrap; ${I($s0?.R?.heroBtn)}`)}>
              {"See how it works"}
            </a>
          </div>
          <span className={"a-in"} {...S(`animation-delay: 0.16s; font-size: 14px; color: ${I($s0?.c?.mutedFg)}`)}>
            {"No card. No setup. Add a deal and go."}
          </span>
        </section>
        <section aria-label={"Try a theme"} {...S(`display: flex; justify-content: center; padding: 44px 24px 18px; ${I($s0?.R?.pick)}`)}>
          <div {...S(`display: flex; align-items: center; gap: 14px; padding: 6px 6px 6px 18px; border: 1px solid ${I($s0?.c?.border)}; border-radius: 999px; background: ${I($s0?.c?.card)}; ${I($s0?.R?.pickCard)}`)}>
            <span {...S(`font-size: 14px; font-weight: 500; white-space: nowrap; ${I($s0?.R?.pickLabel)}`)}>
              {"Make it yours"}
            </span>
            <div role={"radiogroup"} aria-label={"Theme"} {...S(`display: flex; gap: 4px; ${I($s0?.R?.pickGroup)}`)}>
              {A($s0?.themeOpts).map((it, i) => {
                const $s1 = { ...$s0, "to": it, $index: i };
                return (<React.Fragment key={i}>
                  <button type={"button"} role={"radio"} className={"tb tg"} aria-checked={$s1?.to?.on} onClick={$s1?.to?.pick} {...S(`--hv: ${I($s1?.to?.hv)}; display: inline-flex; align-items: center; gap: 7px; height: 34px; padding: 0 13px 0 9px; border: none; border-radius: 999px; background: ${I($s1?.to?.bg)}; color: ${I($s1?.to?.fg)}; font: inherit; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer; ${I($s1?.R?.pickOpt)}`)}>
                    <span {...S(`width: 14px; height: 14px; flex: 0 0 14px; border-radius: 7px; background: ${I($s1?.to?.swatch)}; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.12)`)} />
                    {T($s1?.to?.label)}
                  </button>
                </React.Fragment>);
              })}
            </div>
            <span {...S(`width: 1px; height: 22px; background: ${I($s0?.c?.border)}; ${I($s0?.R?.pickDiv)}`)} />
            <button type={"button"} className={"tb tg"} onClick={$s0?.toggleDark} aria-pressed={$s0?.dark} aria-label={"Dark mode"} {...S(`--hv: ${I($s0?.c?.hv)}; display: inline-flex; align-items: center; gap: 7px; height: 34px; padding: 0 14px; border: none; border-radius: 999px; background: transparent; color: ${I($s0?.c?.fg)}; font: inherit; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer; ${I($s0?.R?.pickMode)}`)}>
              <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                <path d={$s0?.modeIcon} />
              </svg>
              {T($s0?.modeLabel)}
            </button>
          </div>
        </section>
        <section aria-label={"Talby overview"} {...S(`position: relative; display: flex; justify-content: center; padding: 0 24px 40px; ${I($s0?.R?.ovSec)}`)}>
          <div aria-hidden={"true"} {...S(`position: absolute; top: -40px; right: 0; bottom: 0; left: 0; background-image: radial-gradient(circle, ${I($s0?.c?.borderStrong)} 1px, rgba(0,0,0,0) 1.5px); background-size: 22px 22px; -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 70%); mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 70%); pointer-events: none; ${I($s0?.R?.dots)}`)} />
          {$s0?.notMob ? (<>
            <div className={"a-up"} {...S(`position: relative; width: 1200px; max-width: 100%; height: 700px; display: flex; overflow: hidden; border-radius: 20px; background: ${I($s0?.x?.page)}; color: ${I($s0?.x?.fg)}; font-family: ${I($s0?.x?.bodyFam)}; font-size: 14px; line-height: 1.43; box-shadow: 0 50px 100px -40px rgba(0,0,0,0.35), 0 0 0 1px ${I($s0?.c?.border)}; transition: background-color 0.35s ease, color 0.35s ease; ${I($s0?.xvars)}; ${I($s0?.R?.mock)}`)}>
              <aside {...S(`flex: 0 0 224px; display: flex; flex-direction: column; gap: 2px; padding: 18px 12px 14px; box-sizing: border-box; background: ${I($s0?.x?.side)}; border-right: 1px solid ${I($s0?.x?.sideBorder)}; backdrop-filter: ${I($s0?.x?.sideFx)}; transition: background-color 0.35s ease`)}>
                {A($s0?.mockNav).map((it, i) => {
                  const $s1 = { ...$s0, "n": it, $index: i };
                  return (<React.Fragment key={i}>
                    <span {...S(`display: flex; align-items: center; gap: 10px; height: 34px; padding: 0 10px; border-radius: ${I($s1?.x?.rItem)}; background: ${I($s1?.n?.bg)}; color: ${I($s1?.n?.fg)}; font-weight: ${I($s1?.n?.fw)}; white-space: nowrap`)}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s1?.n?.ic} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={$s1?.n?.icon} />
                      </svg>
                      <span {...S("flex: 1 1 auto")}>
                        {T($s1?.n?.label)}
                      </span>
                      {$s1?.n?.hasCount ? (<>
                        <span {...S(`font-size: 12px; color: ${I($s1?.x?.mutedFg)}`)}>
                          {T($s1?.n?.count)}
                        </span>
                      </>) : null}
                    </span>
                  </React.Fragment>);
                })}
                <span {...S("flex: 1 1 auto")} />
                <span {...S(`display: flex; align-items: center; gap: 10px; padding: 8px 6px; border-top: 1px solid ${I($s0?.x?.sideBorder)}`)}>
                  <span {...S("width: 30px; height: 30px; flex: 0 0 30px; border-radius: 15px; background: #1F7AE0; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600")}>
                    {"J"}
                  </span>
                  <span {...S("display: flex; flex-direction: column; line-height: 1.2; min-width: 0")}>
                    <span {...S("font-weight: 500; white-space: nowrap")}>
                      {"JunoBakes"}
                    </span>
                    <span {...S(`font-size: 12px; color: ${I($s0?.x?.mutedFg)}; white-space: nowrap`)}>
                      {"@junobakes"}
                    </span>
                  </span>
                </span>
              </aside>
              <div {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column")}>
                <div {...S(`display: flex; align-items: center; gap: 10px; height: 58px; padding: 0 22px; box-sizing: border-box; border-bottom: 1px solid ${I($s0?.x?.line)}`)}>
                  <span {...S("font-weight: 600")}>
                    {"Overview"}
                  </span>
                  <span {...S("flex: 1 1 auto")} />
                  <span {...S(`display: inline-flex; align-items: center; gap: 8px; width: 260px; height: 34px; padding: 0 14px; box-sizing: border-box; border-radius: ${I($s0?.x?.rCtl)}; background: ${I($s0?.x?.fill)}; color: ${I($s0?.x?.mutedFg)}; font-size: 13px; white-space: nowrap`)}>
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                      <circle cx={"11"} cy={"11"} r={"7"} />
                      <path d={"m20 20-3.5-3.5"} />
                    </svg>
                    <span {...S("flex: 1 1 auto")}>
                      {"Search everything"}
                    </span>
                    <span {...S("font-size: 11px")}>
                      {"⌘K"}
                    </span>
                  </span>
                  <span {...S(`display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 14px; border-radius: ${I($s0?.x?.rCtl)}; background: ${I($s0?.x?.primary)}; color: ${I($s0?.x?.primaryFg)}; box-shadow: ${I($s0?.x?.btnSh)}; font-size: 13px; font-weight: 500; white-space: nowrap`)}>
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} aria-hidden={"true"}>
                      <path d={"M12 5v14M5 12h14"} />
                    </svg>
                    {"Add deal"}
                  </span>
                </div>
                <div {...S("flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; gap: 16px; padding: 22px 24px 24px; box-sizing: border-box")}>
                  <div {...S("display: flex; flex-direction: column; gap: 2px")}>
                    <span {...S(`font-family: ${I($s0?.x?.titleFam)}; font-size: ${I($s0?.mockH1)}; font-weight: 600; letter-spacing: ${I($s0?.x?.hTrack)}; text-transform: ${I($s0?.x?.hCase)}; line-height: 1.15; white-space: nowrap`)}>
                      {"Good afternoon, JunoBakes"}
                    </span>
                    <span {...S(`color: ${I($s0?.x?.mutedFg)}; white-space: nowrap`)}>
                      {"You have $19,200 coming in and nothing late."}
                    </span>
                  </div>
                  <div {...S(`display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); background: ${I($s0?.x?.card)}; border: 1px solid ${I($s0?.x?.border)}; border-radius: ${I($s0?.x?.rCard)}; box-shadow: ${I($s0?.x?.shCard)}; overflow: hidden`)}>
                    {A($s0?.mockMoney).map((it, i) => {
                      const $s1 = { ...$s0, "mm": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div {...S(`display: flex; flex-direction: column; gap: 4px; padding: 16px 18px; min-width: 0; border-left: ${I($s1?.mm?.line)}`)}>
                          <span {...S(`font-size: 13px; color: ${I($s1?.x?.mutedFg)}; white-space: nowrap`)}>
                            {T($s1?.mm?.label)}
                          </span>
                          <span {...S(`font-family: ${I($s1?.x?.numFam)}; font-size: 24px; font-weight: 600; letter-spacing: ${I($s1?.x?.nTrack)}; line-height: 1.15; font-variant-numeric: tabular-nums; white-space: nowrap`)}>
                            {T($s1?.mm?.value)}
                          </span>
                          <span {...S(`font-size: 12px; color: ${I($s1?.x?.mutedFg)}; white-space: nowrap`)}>
                            {T($s1?.mm?.sub)}
                          </span>
                        </div>
                      </React.Fragment>);
                    })}
                  </div>
                  <div {...S("flex: 1 1 auto; min-height: 0; display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 16px; align-items: stretch")}>
                    <div {...S(`display: flex; flex-direction: column; min-height: 0; background: ${I($s0?.x?.card)}; border: 1px solid ${I($s0?.x?.border)}; border-radius: ${I($s0?.x?.rCard)}; box-shadow: ${I($s0?.x?.shCard)}; overflow: hidden`)}>
                      <div {...S("display: flex; align-items: center; gap: 10px; padding: 14px 16px 10px")}>
                        <span {...S(`font-family: ${I($s0?.x?.titleFam)}; font-weight: 600; font-size: 15px`)}>
                          {"Deals"}
                        </span>
                        <span {...S("flex: 1 1 auto")} />
                        <span {...S(`display: inline-flex; gap: 2px; height: 30px; padding: 3px; box-sizing: border-box; border-radius: ${I($s0?.x?.rCtl)}; background: ${I($s0?.x?.fill)}`)}>
                          {A($s0?.mockTabs).map((it, i) => {
                            const $s1 = { ...$s0, "mt": it, $index: i };
                            return (<React.Fragment key={i}>
                              <span {...S(`display: inline-flex; align-items: center; padding: 0 10px; border-radius: ${I($s1?.x?.rCtl)}; background: ${I($s1?.mt?.bg)}; box-shadow: ${I($s1?.mt?.sh)}; color: ${I($s1?.mt?.fg)}; font-size: 12px; font-weight: 500`)}>
                                {T($s1?.mt?.label)}
                              </span>
                            </React.Fragment>);
                          })}
                        </span>
                      </div>
                      {A($s0?.mockDeals).map((it, i) => {
                        const $s1 = { ...$s0, "d": it, $index: i };
                        return (<React.Fragment key={i}>
                          <div {...S(`display: flex; align-items: center; gap: 12px; height: 50px; padding: 0 16px; border-top: 1px solid ${I($s1?.x?.line)}`)}>
                            <span {...S(`width: 30px; height: 30px; flex: 0 0 30px; border-radius: 15px; background: ${I($s1?.x?.fill)}; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600`)}>
                              {T($s1?.d?.init)}
                            </span>
                            <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; line-height: 1.25")}>
                              <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                                {T($s1?.d?.brand)}
                              </span>
                              <span {...S(`font-size: 12px; color: ${I($s1?.x?.mutedFg)}; white-space: nowrap`)}>
                                {"Posts "}{T($s1?.d?.post)}
                              </span>
                            </span>
                            <span {...S("display: flex; gap: 4px")}>
                              {A($s1?.d?.plats).map((it, i) => {
                                const $s2 = { ...$s1, "pl": it, $index: i };
                                return (<React.Fragment key={i}>
                                  <img src={$s2?.pl?.icon} alt={$s2?.pl?.label} width={"16"} height={"16"} {...S("display: block; width: 16px; height: 16px; border-radius: 4px")} />
                                </React.Fragment>);
                              })}
                            </span>
                            <span {...S(`display: inline-flex; align-items: center; width: 96px; justify-content: center; height: 22px; border-radius: ${I($s1?.x?.rPill)}; background: ${I($s1?.d?.chipBg)}; color: ${I($s1?.d?.chipFg)}; font-size: 12px; font-weight: 500; white-space: nowrap`)}>
                              {T($s1?.d?.pay)}
                            </span>
                            <span {...S(`width: 76px; text-align: right; font-family: ${I($s1?.x?.numFam)}; font-variant-numeric: tabular-nums; font-weight: 500`)}>
                              {T($s1?.d?.amtS)}
                            </span>
                          </div>
                        </React.Fragment>);
                      })}
                    </div>
                    <div {...S(`display: flex; flex-direction: column; min-height: 0; background: ${I($s0?.x?.card)}; border: 1px solid ${I($s0?.x?.border)}; border-radius: ${I($s0?.x?.rCard)}; box-shadow: ${I($s0?.x?.shCard)}; overflow: hidden`)}>
                      <div {...S("display: flex; align-items: center; justify-content: space-between; padding: 14px 16px 10px")}>
                        <span {...S(`font-family: ${I($s0?.x?.titleFam)}; font-weight: 600; font-size: 15px`)}>
                          {"This week"}
                        </span>
                        <span {...S(`font-size: 12px; color: ${I($s0?.x?.mutedFg)}`)}>
                          {"Oct 12 to 18"}
                        </span>
                      </div>
                      {A($s0?.mockWeek).map((it, i) => {
                        const $s1 = { ...$s0, "wk": it, $index: i };
                        return (<React.Fragment key={i}>
                          <div {...S(`display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-top: 1px solid ${I($s1?.x?.line)}`)}>
                            <span {...S(`width: 42px; height: 42px; flex: 0 0 42px; box-sizing: border-box; border-radius: ${I($s1?.x?.rSm)}; background: ${I($s1?.wk?.bg)}; color: ${I($s1?.wk?.fg)}; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.05`)}>
                              <span {...S("font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em")}>
                                {T($s1?.wk?.dow)}
                              </span>
                              <span {...S(`font-family: ${I($s1?.x?.numFam)}; font-size: 16px; font-weight: 600`)}>
                                {T($s1?.wk?.day)}
                              </span>
                            </span>
                            <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; line-height: 1.3")}>
                              <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                                {T($s1?.wk?.title)}
                              </span>
                              <span {...S(`font-size: 12px; color: ${I($s1?.x?.mutedFg)}; white-space: nowrap`)}>
                                {T($s1?.wk?.sub)}
                              </span>
                            </span>
                          </div>
                        </React.Fragment>);
                      })}
                      <span {...S("flex: 1 1 auto")} />
                      <div {...S(`display: flex; align-items: center; gap: 10px; margin: 12px; padding: 12px 14px; border-radius: ${I($s0?.x?.rTile)}; background: ${I($s0?.x?.tile)}; font-size: 13px`)}>
                        <span {...S(`flex: 1 1 auto; color: ${I($s0?.x?.mutedFg)}; white-space: nowrap`)}>
                          {"Next week"}
                        </span>
                        <span {...S("font-weight: 500; white-space: nowrap")}>
                          {"Meadowlark Tea posts"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>) : null}
          {$s0?.isMob ? (<>
            <div className={"a-up"} {...S(`position: relative; width: 100%; display: flex; flex-direction: column; overflow: hidden; border-radius: 18px; background: ${I($s0?.x?.page)}; color: ${I($s0?.x?.fg)}; font-family: ${I($s0?.x?.bodyFam)}; font-size: 14px; line-height: 1.43; box-shadow: 0 40px 80px -40px rgba(0,0,0,0.35), 0 0 0 1px ${I($s0?.c?.border)}; transition: background-color 0.35s ease, color 0.35s ease; ${I($s0?.xvars)}`)}>
              <div {...S(`display: flex; align-items: center; gap: 10px; height: 52px; padding: 0 12px 0 16px; box-sizing: border-box; border-bottom: 1px solid ${I($s0?.x?.line)}`)}>
                <span {...S("font-weight: 600")}>
                  {"Overview"}
                </span>
                <span {...S("flex: 1 1 auto")} />
                <span {...S(`display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: ${I($s0?.x?.rCtl)}; background: ${I($s0?.x?.fill)}; color: ${I($s0?.x?.mutedFg)}`)}>
                  <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <circle cx={"11"} cy={"11"} r={"7"} />
                    <path d={"m20 20-3.5-3.5"} />
                  </svg>
                </span>
                <span {...S(`display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 12px; border-radius: ${I($s0?.x?.rCtl)}; background: ${I($s0?.x?.primary)}; color: ${I($s0?.x?.primaryFg)}; box-shadow: ${I($s0?.x?.btnSh)}; font-size: 13px; font-weight: 500; white-space: nowrap`)}>
                  <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M12 5v14M5 12h14"} />
                  </svg>
                  {"Add deal"}
                </span>
              </div>
              <div {...S("display: flex; flex-direction: column; gap: 14px; padding: 16px 12px 14px; box-sizing: border-box")}>
                <div {...S("display: flex; flex-direction: column; gap: 3px; padding: 0 4px")}>
                  <span {...S(`font-family: ${I($s0?.x?.titleFam)}; font-size: ${I($s0?.mockH1m)}; font-weight: 600; letter-spacing: ${I($s0?.x?.hTrack)}; text-transform: ${I($s0?.x?.hCase)}; line-height: 1.2`)}>
                    {"Good afternoon, JunoBakes"}
                  </span>
                  <span {...S(`font-size: 13px; color: ${I($s0?.x?.mutedFg)}`)}>
                    {"You have $19,200 coming in and nothing late."}
                  </span>
                </div>
                <div {...S(`display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); background: ${I($s0?.x?.card)}; border: 1px solid ${I($s0?.x?.border)}; border-radius: ${I($s0?.x?.rCard)}; box-shadow: ${I($s0?.x?.shCard)}; overflow: hidden`)}>
                  {A($s0?.mockMoney).map((it, i) => {
                    const $s1 = { ...$s0, "mm": it, $index: i };
                    return (<React.Fragment key={i}>
                      <div {...S(`display: flex; flex-direction: column; gap: 3px; padding: 12px 14px; min-width: 0; border-left: ${I($s1?.mm?.lineL)}; border-top: ${I($s1?.mm?.lineT)}`)}>
                        <span {...S(`font-size: 12px; color: ${I($s1?.x?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                          {T($s1?.mm?.label)}
                        </span>
                        <span {...S(`font-family: ${I($s1?.x?.numFam)}; font-size: 20px; font-weight: 600; letter-spacing: ${I($s1?.x?.nTrack)}; line-height: 1.15; font-variant-numeric: tabular-nums; white-space: nowrap`)}>
                          {T($s1?.mm?.value)}
                        </span>
                        <span {...S(`font-size: 12px; line-height: 1.3; color: ${I($s1?.x?.mutedFg)}`)}>
                          {T($s1?.mm?.sub)}
                        </span>
                      </div>
                    </React.Fragment>);
                  })}
                </div>
                <div {...S(`display: flex; flex-direction: column; background: ${I($s0?.x?.card)}; border: 1px solid ${I($s0?.x?.border)}; border-radius: ${I($s0?.x?.rCard)}; box-shadow: ${I($s0?.x?.shCard)}; overflow: hidden`)}>
                  <div {...S("display: flex; align-items: center; gap: 10px; padding: 12px 12px 10px 14px")}>
                    <span {...S(`font-family: ${I($s0?.x?.titleFam)}; font-weight: 600; font-size: 15px`)}>
                      {"Deals"}
                    </span>
                    <span {...S("flex: 1 1 auto")} />
                    <span {...S(`display: inline-flex; gap: 2px; height: 30px; padding: 3px; box-sizing: border-box; border-radius: ${I($s0?.x?.rCtl)}; background: ${I($s0?.x?.fill)}`)}>
                      {A($s0?.mockTabs).map((it, i) => {
                        const $s1 = { ...$s0, "mt": it, $index: i };
                        return (<React.Fragment key={i}>
                          <span {...S(`display: inline-flex; align-items: center; padding: 0 10px; border-radius: ${I($s1?.x?.rCtl)}; background: ${I($s1?.mt?.bg)}; box-shadow: ${I($s1?.mt?.sh)}; color: ${I($s1?.mt?.fg)}; font-size: 12px; font-weight: 500`)}>
                            {T($s1?.mt?.label)}
                          </span>
                        </React.Fragment>);
                      })}
                    </span>
                  </div>
                  {A($s0?.mockDeals).map((it, i) => {
                    const $s1 = { ...$s0, "d": it, $index: i };
                    return (<React.Fragment key={i}>
                      <div {...S(`display: flex; align-items: center; gap: 10px; min-height: 58px; padding: 8px 14px; box-sizing: border-box; border-top: 1px solid ${I($s1?.x?.line)}`)}>
                        <span {...S(`width: 30px; height: 30px; flex: 0 0 30px; border-radius: 15px; background: ${I($s1?.x?.fill)}; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600`)}>
                          {T($s1?.d?.init)}
                        </span>
                        <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 3px; line-height: 1.25")}>
                          <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                            {T($s1?.d?.brand)}
                          </span>
                          <span {...S(`display: flex; align-items: center; gap: 4px; font-size: 12px; color: ${I($s1?.x?.mutedFg)}; white-space: nowrap`)}>
                            {A($s1?.d?.plats).map((it, i) => {
                              const $s2 = { ...$s1, "pl": it, $index: i };
                              return (<React.Fragment key={i}>
                                <img src={$s2?.pl?.icon} alt={$s2?.pl?.label} width={"14"} height={"14"} {...S("display: block; width: 14px; height: 14px; border-radius: 4px")} />
                              </React.Fragment>);
                            })}
                            <span {...S("margin-left: 2px")}>
                              {"Posts "}{T($s1?.d?.post)}
                            </span>
                          </span>
                        </span>
                        <span {...S("flex: 0 0 auto; display: flex; flex-direction: column; align-items: flex-end; gap: 4px")}>
                          <span {...S(`font-family: ${I($s1?.x?.numFam)}; font-variant-numeric: tabular-nums; font-weight: 500`)}>
                            {T($s1?.d?.amtS)}
                          </span>
                          <span {...S(`display: inline-flex; align-items: center; height: 20px; padding: 0 8px; border-radius: ${I($s1?.x?.rPill)}; background: ${I($s1?.d?.chipBg)}; color: ${I($s1?.d?.chipFg)}; font-size: 11px; font-weight: 500; white-space: nowrap`)}>
                            {T($s1?.d?.pay)}
                          </span>
                        </span>
                      </div>
                    </React.Fragment>);
                  })}
                </div>
                <div {...S(`display: flex; flex-direction: column; background: ${I($s0?.x?.card)}; border: 1px solid ${I($s0?.x?.border)}; border-radius: ${I($s0?.x?.rCard)}; box-shadow: ${I($s0?.x?.shCard)}; overflow: hidden`)}>
                  <div {...S("display: flex; align-items: center; justify-content: space-between; padding: 12px 14px 10px")}>
                    <span {...S(`font-family: ${I($s0?.x?.titleFam)}; font-weight: 600; font-size: 15px`)}>
                      {"This week"}
                    </span>
                    <span {...S(`font-size: 12px; color: ${I($s0?.x?.mutedFg)}`)}>
                      {"Oct 12 to 18"}
                    </span>
                  </div>
                  {A($s0?.mockWeek).map((it, i) => {
                    const $s1 = { ...$s0, "wk": it, $index: i };
                    return (<React.Fragment key={i}>
                      <div {...S(`display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-top: 1px solid ${I($s1?.x?.line)}`)}>
                        <span {...S(`width: 40px; height: 40px; flex: 0 0 40px; box-sizing: border-box; border-radius: ${I($s1?.x?.rSm)}; background: ${I($s1?.wk?.bg)}; color: ${I($s1?.wk?.fg)}; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.05`)}>
                          <span {...S("font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em")}>
                            {T($s1?.wk?.dow)}
                          </span>
                          <span {...S(`font-family: ${I($s1?.x?.numFam)}; font-size: 15px; font-weight: 600`)}>
                            {T($s1?.wk?.day)}
                          </span>
                        </span>
                        <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; line-height: 1.3")}>
                          <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                            {T($s1?.wk?.title)}
                          </span>
                          <span {...S(`font-size: 12px; color: ${I($s1?.x?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                            {T($s1?.wk?.sub)}
                          </span>
                        </span>
                      </div>
                    </React.Fragment>);
                  })}
                  <div {...S(`display: flex; align-items: center; gap: 10px; margin: 2px 10px 10px; padding: 10px 12px; border-radius: ${I($s0?.x?.rTile)}; background: ${I($s0?.x?.tile)}; font-size: 13px`)}>
                    <span {...S(`flex: 1 1 auto; color: ${I($s0?.x?.mutedFg)}; white-space: nowrap`)}>
                      {"Next week"}
                    </span>
                    <span {...S("font-weight: 500; white-space: nowrap")}>
                      {"Meadowlark Tea posts"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>) : null}
        </section>
        <section id={"compare"} aria-labelledby={"cmp-title"} {...S(`display: flex; justify-content: center; padding: 96px 24px 24px; ${I($s0?.R?.sec)}`)}>
          <div {...S("width: 1200px; max-width: 100%; display: flex; flex-direction: column; gap: 14px")}>
            <span {...S(`font-size: 13px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: ${I($s0?.c?.accent)}`)}>
              {"Why Talby"}
            </span>
            <h2 id={"cmp-title"} {...S(`margin: 0; font-family: ${I($s0?.c?.titleFam)}; font-size: 44px; font-weight: 600; letter-spacing: -1.2px; line-height: 1.1; ${I($s0?.R?.h2)}`)}>
              {"You have probably tried these already."}
            </h2>
            <p {...S(`margin: 0; max-width: 640px; font-size: 18px; color: ${I($s0?.c?.mutedFg)}; ${I($s0?.R?.secP)}`)}>
              {"A notes app, a spreadsheet, a Notion board. They all hold the list. None of them know what a brand deal actually is."}
            </p>
            {$s0?.notMob ? (<>
              <div role={"table"} aria-label={"Compare Talby with other tools"} {...S("margin-top: 28px; display: flex; flex-direction: column; font-size: 14px")}>
                <div role={"row"} {...S(`display: grid; grid-template-columns: 260px repeat(4, minmax(0, 1fr)); ${I($s0?.R?.cmpRow)}`)}>
                  <span role={"columnheader"} {...S("padding: 18px 12px")} />
                  {A($s0?.cmpCols).map((it, i) => {
                    const $s1 = { ...$s0, "cc": it, $index: i };
                    return (<React.Fragment key={i}>
                      <div role={"columnheader"} {...S(`display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 22px 12px 16px; background: ${I($s1?.cc?.bg)}; border-radius: 18px 18px 0 0`)}>
                        <span {...S(`width: 42px; height: 42px; border-radius: 12px; background: ${I($s1?.cc?.tileBg)}; color: ${I($s1?.c?.mutedFg)}; display: inline-flex; align-items: center; justify-content: center; box-shadow: ${I($s1?.cc?.tileSh)}`)}>
                          {$s1?.cc?.isTalby ? (<>
                            <svg width={"24"} height={"20"} viewBox={"0 0 2029 1722"} aria-hidden={"true"} {...S("display: block")}>
                              <path fill={"#1F7AE0"} d={"M325.553 0.11436C357.82 -0.851434 390.344 4.39925 421.577 12.1099C506.351 33.0387 579.306 92.8684 628.981 163.1C648.617 190.863 665.004 221.256 682.357 250.477C714.91 305.296 746.394 360.846 779.411 415.372C792.242 436.561 805.088 458.322 818.991 478.81C853.846 530.177 928.98 628.305 990.503 643.014C1013.94 648.615 1037.46 645.591 1058.97 634.725C1078.92 624.656 1094.72 608.763 1110.74 593.552C1184.16 523.869 1237.02 434.688 1287.42 347.839C1299.09 327.74 1311.38 307.989 1322.85 287.786C1346.79 245.624 1371.62 198.953 1400.03 160.003C1431.42 116.962 1467.92 79.9142 1513.59 51.9883C1592.43 3.35327 1687.5 -11.5536 1777.44 10.6178C1861.41 31.3662 1933.82 84.3529 1979.02 158.109C2024.53 233.037 2040.98 310.935 2019.97 397.268C1988.25 527.6 1882.9 628.138 1749.42 647.874C1724.27 651.594 1693.72 650.686 1668.06 650.648L1562.66 650.457L1294.18 650.569C1229.3 650.36 1166.25 642.367 1109.31 677.354C1075.41 697.881 1051.07 731.066 1041.68 769.577C1024.74 841.175 1063.31 906.426 1099.22 965.078C1103.02 971.823 1114.46 985.726 1119.82 992.612C1140.88 1019.75 1162.84 1046.17 1185.68 1071.84C1264.51 1161.22 1337.81 1269.48 1345.12 1391.87C1355.92 1572.91 1205.73 1711.69 1031.77 1721.4C938.596 1726.86 847.128 1694.71 777.855 1632.13C733.34 1591.55 702.231 1538.38 688.665 1479.68C676.384 1428.85 679.574 1377.6 692.642 1327.29C710.038 1260.33 744.366 1197.92 785.127 1142.41C854.647 1047.73 998.351 921.921 991.042 795.526C987.346 731.658 941.997 680.383 882.362 660.534C837.4 645.57 776.985 650.524 728.979 650.558L429.507 650.401L351.229 650.568C319.765 650.635 286.204 651.2 255.381 644.239C194.201 631.235 150.38 605.052 104.113 565.316C-67.2929 418.104 -14.8418 150.672 172.337 43.4476C223.087 14.3754 266.379 3.16906 325.553 0.11436Z"} />
                            </svg>
                          </>) : null}
                          {$s1?.cc?.notTalby ? (<>
                            {$s1?.cc?.img ? (
                              <img src={$s1?.cc?.img} width={"24"} height={"24"} alt={$s1?.cc?.label} {...S("display: block; object-fit: contain; border-radius: 4px")} />
                            ) : (
                            <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={$s1?.cc?.icon} />
                            </svg>
                            )}
                          </>) : null}
                        </span>
                        <span {...S("font-weight: 600; white-space: nowrap")}>
                          {T($s1?.cc?.label)}
                        </span>
                      </div>
                    </React.Fragment>);
                  })}
                </div>
                {A($s0?.cmpRows).map((it, i) => {
                  const $s1 = { ...$s0, "cr": it, $index: i };
                  return (<React.Fragment key={i}>
                    <div role={"row"} {...S(`display: grid; grid-template-columns: 260px repeat(4, minmax(0, 1fr)); ${I($s1?.R?.cmpRow)}`)}>
                      <span role={"rowheader"} {...S(`display: flex; align-items: center; min-height: 56px; padding: 0 12px; border-top: 1px solid ${I($s1?.c?.line)}; font-weight: 500`)}>
                        {T($s1?.cr?.label)}
                      </span>
                      {A($s1?.cr?.cells).map((it, i) => {
                        const $s2 = { ...$s1, "cl": it, $index: i };
                        return (<React.Fragment key={i}>
                          <span role={"cell"} {...S(`display: flex; align-items: center; justify-content: center; gap: 7px; min-height: 56px; padding: 0 12px; border-top: 1px solid ${I($s2?.cl?.line)}; background: ${I($s2?.cl?.bg)}; border-radius: ${I($s2?.cl?.radius)}; color: ${I($s2?.cl?.fg)}; font-weight: ${I($s2?.cl?.fw)}; text-align: center`)}>
                            {$s2?.cl?.check ? (<>
                              <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s2?.c?.accent} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={"M20 6 9 17l-5-5"} />
                              </svg>
                            </>) : null}
                            {T($s2?.cl?.text)}
                          </span>
                        </React.Fragment>);
                      })}
                    </div>
                  </React.Fragment>);
                })}
              </div>
            </>) : null}
            {$s0?.isMob ? (<>
              <ul aria-label={"Compare Talby with other tools"} {...S("margin: 14px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 12px")}>
                {A($s0?.cmpRows).map((it, i) => {
                  const $s1 = { ...$s0, "cr": it, $index: i };
                  return (<React.Fragment key={i}>
                    <li {...S(`display: flex; flex-direction: column; gap: 6px; padding: 12px 8px 8px; border: 1px solid ${I($s1?.c?.line)}; border-radius: 18px; background: ${I($s1?.c?.card)}`)}>
                      <h3 {...S("margin: 0; padding: 2px 8px 2px; font-size: 15px; font-weight: 600; line-height: 1.3")}>
                        {T($s1?.cr?.label)}
                      </h3>
                      <dl {...S("margin: 0; display: flex; flex-direction: column; gap: 2px")}>
                        {A($s1?.cr?.cells).map((it, i) => {
                          const $s2 = { ...$s1, "cl": it, $index: i };
                          return (<React.Fragment key={i}>
                            <div {...S(`display: flex; align-items: center; gap: 12px; min-height: 36px; padding: 5px 10px 5px 8px; box-sizing: border-box; border-radius: 12px; background: ${I($s2?.cl?.bg)}`)}>
                              <dt {...S(`flex: 0 0 auto; display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; color: ${I($s2?.c?.mutedFg)}; white-space: nowrap`)}>
                                <span {...S(`width: 24px; height: 24px; flex: 0 0 24px; border-radius: 7px; background: ${I($s2?.cl?.tileBg)}; box-shadow: ${I($s2?.cl?.tileSh)}; color: ${I($s2?.c?.mutedFg)}; display: inline-flex; align-items: center; justify-content: center`)}>
                                  {$s2?.cl?.check ? (<>
                                    <svg width={"16"} height={"14"} viewBox={"0 0 2029 1722"} aria-hidden={"true"} {...S("display: block")}>
                                      <path fill={"#1F7AE0"} d={"M325.553 0.11436C357.82 -0.851434 390.344 4.39925 421.577 12.1099C506.351 33.0387 579.306 92.8684 628.981 163.1C648.617 190.863 665.004 221.256 682.357 250.477C714.91 305.296 746.394 360.846 779.411 415.372C792.242 436.561 805.088 458.322 818.991 478.81C853.846 530.177 928.98 628.305 990.503 643.014C1013.94 648.615 1037.46 645.591 1058.97 634.725C1078.92 624.656 1094.72 608.763 1110.74 593.552C1184.16 523.869 1237.02 434.688 1287.42 347.839C1299.09 327.74 1311.38 307.989 1322.85 287.786C1346.79 245.624 1371.62 198.953 1400.03 160.003C1431.42 116.962 1467.92 79.9142 1513.59 51.9883C1592.43 3.35327 1687.5 -11.5536 1777.44 10.6178C1861.41 31.3662 1933.82 84.3529 1979.02 158.109C2024.53 233.037 2040.98 310.935 2019.97 397.268C1988.25 527.6 1882.9 628.138 1749.42 647.874C1724.27 651.594 1693.72 650.686 1668.06 650.648L1562.66 650.457L1294.18 650.569C1229.3 650.36 1166.25 642.367 1109.31 677.354C1075.41 697.881 1051.07 731.066 1041.68 769.577C1024.74 841.175 1063.31 906.426 1099.22 965.078C1103.02 971.823 1114.46 985.726 1119.82 992.612C1140.88 1019.75 1162.84 1046.17 1185.68 1071.84C1264.51 1161.22 1337.81 1269.48 1345.12 1391.87C1355.92 1572.91 1205.73 1711.69 1031.77 1721.4C938.596 1726.86 847.128 1694.71 777.855 1632.13C733.34 1591.55 702.231 1538.38 688.665 1479.68C676.384 1428.85 679.574 1377.6 692.642 1327.29C710.038 1260.33 744.366 1197.92 785.127 1142.41C854.647 1047.73 998.351 921.921 991.042 795.526C987.346 731.658 941.997 680.383 882.362 660.534C837.4 645.57 776.985 650.524 728.979 650.558L429.507 650.401L351.229 650.568C319.765 650.635 286.204 651.2 255.381 644.239C194.201 631.235 150.38 605.052 104.113 565.316C-67.2929 418.104 -14.8418 150.672 172.337 43.4476C223.087 14.3754 266.379 3.16906 325.553 0.11436Z"} />
                                    </svg>
                                  </>) : null}
                                  {$s2?.cl?.notCheck ? (<>
                                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                      <path d={$s2?.cl?.icon} />
                                    </svg>
                                  </>) : null}
                                </span>
                                {T($s2?.cl?.tool)}
                              </dt>
                              <dd {...S(`flex: 1 1 auto; min-width: 0; margin: 0; display: flex; align-items: center; justify-content: flex-end; gap: 6px; text-align: right; font-size: 14px; line-height: 1.35; color: ${I($s2?.cl?.fg)}; font-weight: ${I($s2?.cl?.fw)}`)}>
                                {$s2?.cl?.check ? (<>
                                  <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s2?.c?.accent} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 13px")}>
                                    <path d={"M20 6 9 17l-5-5"} />
                                  </svg>
                                </>) : null}
                                <span>
                                  {T($s2?.cl?.text)}
                                </span>
                              </dd>
                            </div>
                          </React.Fragment>);
                        })}
                      </dl>
                    </li>
                  </React.Fragment>);
                })}
              </ul>
            </>) : null}
          </div>
        </section>
        <section id={"story"} aria-labelledby={"story-title"} {...S(`display: flex; justify-content: center; padding: 96px 24px 24px; ${I($s0?.R?.sec)}`)}>
          <div {...S("width: 1200px; max-width: 100%; display: flex; flex-direction: column; align-items: flex-start; gap: 14px")}>
            <span {...S(`font-size: 13px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: ${I($s0?.c?.accent)}`)}>
              {"How it works"}
            </span>
            <h2 id={"story-title"} {...S(`margin: 0; font-family: ${I($s0?.c?.titleFam)}; font-size: 44px; font-weight: 600; letter-spacing: -1.2px; line-height: 1.1; white-space: nowrap; ${I($s0?.R?.h2Story)}`)}>
              {"One deal, start to finish."}
            </h2>
            <p {...S(`margin: 0; max-width: 640px; font-size: 18px; color: ${I($s0?.c?.mutedFg)}; ${I($s0?.R?.secP)}`)}>
              {"Follow a single brand deal through Talby, from the day the contract shows up to the day the money does. Each screen is real. Try them."}
            </p>
            <div role={"tablist"} aria-label={"How it works"} {...S(`display: flex; gap: 4px; margin-top: 18px; padding: 4px; border-radius: 999px; background: ${I($s0?.c?.fill)}; ${I($s0?.R?.tabs)}`)}>
              {A($s0?.storyTabs).map((it, i) => {
                const $s1 = { ...$s0, "sx": it, $index: i };
                return (<React.Fragment key={i}>
                  <button type={"button"} role={"tab"} className={"tb tt"} aria-selected={$s1?.sx?.on} onClick={$s1?.sx?.pick} {...S(`display: inline-flex; align-items: center; gap: 8px; height: 38px; padding: 0 18px; border: none; border-radius: 999px; background: ${I($s1?.sx?.bg)}; box-shadow: ${I($s1?.sx?.sh)}; color: ${I($s1?.sx?.fg)}; font: inherit; font-size: 14px; font-weight: 500; white-space: nowrap; cursor: pointer; ${I($s1?.R?.tab)}`)}>
                    <span {...S(`font-family: 'DM Mono', ui-monospace, monospace; font-size: 12px; color: ${I($s1?.sx?.nFg)}`)}>
                      {T($s1?.sx?.n)}
                    </span>
                    {T($s1?.sx?.label)}
                  </button>
                </React.Fragment>);
              })}
            </div>
          </div>
        </section>
        <section aria-live={"polite"} {...S(`display: flex; justify-content: center; padding: 18px 24px 40px; ${I($s0?.R?.panelSec)}`)}>
          <div {...S(`width: 1200px; max-width: 100%; box-sizing: border-box; padding: 40px; border-radius: 28px; background: ${I($s0?.c?.tile)}; display: grid; grid-template-columns: 380px minmax(0, 1fr); gap: 44px; align-items: center; ${I($s0?.R?.panel)}`)}>
            <div {...S(`display: flex; flex-direction: column; gap: 18px; ${I($s0?.R?.ptext)}`)}>
              <div {...S("display: flex; align-items: center; gap: 10px")}>
                <span {...S(`font-size: 13px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: ${I($s0?.c?.accent)}`)}>
                  {T($s0?.story?.eyebrow)}
                </span>
                <span {...S(`display: inline-flex; align-items: center; gap: 6px; height: 22px; padding: 0 9px; border-radius: 999px; background: ${I($s0?.c?.card)}; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; white-space: nowrap`)}>
                  <span className={"a-pulse"} {...S(`width: 6px; height: 6px; border-radius: 3px; background: ${I($s0?.c?.accent)}`)} />
                  {"Live demo"}
                </span>
              </div>
              <h3 {...S(`margin: 0; font-family: ${I($s0?.c?.titleFam)}; font-size: 32px; font-weight: 600; letter-spacing: -0.8px; line-height: 1.15; ${I($s0?.R?.h3)}`)}>
                {T($s0?.story?.title)}
              </h3>
              <p {...S(`margin: 0; font-size: 17px; color: ${I($s0?.c?.mutedFg)}; ${I($s0?.R?.ptP)}`)}>
                {T($s0?.story?.body)}
              </p>
              <ul {...S("margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px")}>
                {A($s0?.story?.bullets).map((it, i) => {
                  const $s1 = { ...$s0, "bl": it, $index: i };
                  return (<React.Fragment key={i}>
                    <li {...S("display: flex; align-items: center; gap: 10px")}>
                      <span {...S(`width: 20px; height: 20px; flex: 0 0 20px; border-radius: 10px; background: ${I($s1?.c?.fill)}; color: ${I($s1?.c?.accent)}; display: inline-flex; align-items: center; justify-content: center`)}>
                        <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M20 6 9 17l-5-5"} />
                        </svg>
                      </span>
                      <span>
                        {T($s1?.bl)}
                      </span>
                    </li>
                  </React.Fragment>);
                })}
              </ul>
              <div {...S(`display: flex; gap: 10px; align-items: center; ${I($s0?.R?.pAct)}`)}>
                <a href={H("/signup")} className={"tb tp"} {...S(`display: inline-flex; align-items: center; height: 42px; padding: 0 20px; border-radius: 999px; background: ${I($s0?.c?.primary)}; color: ${I($s0?.c?.primaryFg)}; font-weight: 500; text-decoration: none`)}>
                  {"Try it free"}
                </a>
                <span {...S(`font-size: 13px; color: ${I($s0?.c?.mutedFg)}`)}>
                  {T($s0?.storyHint)}
                </span>
              </div>
            </div>
            <div {...S(`position: relative; height: 600px; overflow: hidden; border-radius: 20px; background: ${I($s0?.x?.page)}; color: ${I($s0?.x?.fg)}; font-family: ${I($s0?.x?.bodyFam)}; font-size: 14px; line-height: 1.43; box-shadow: 0 40px 80px -40px rgba(0,0,0,0.3), 0 0 0 1px ${I($s0?.c?.border)}; transition: background-color 0.35s ease; ${I($s0?.xvars)}; ${I($s0?.R?.demo)}`)}>
              {$s0?.isContract ? (<>
                <div className={"a-fade"} {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; display: flex; justify-content: center; background: ${I($s0?.x?.tile)}`)}>
                  {$s0?.notMob ? (<>
                    <div {...S(`width: 526px; height: 600px; overflow: hidden; ${I($s0?.R?.cvp)}`)}>
                      <div {...S(`width: 720px; height: 820px; transform: scale(0.7305); transform-origin: top left; ${I($s0?.R?.cstage)}`)}>
                        {$s0?.runA ? (<>
                          <SAddDeal frame={true} demo={true} open={"upload"} step={"pick"} color={$s0?.x?.id} dark={$s0?.x?.dark} />
                        </>) : null}
                        {$s0?.runB ? (<>
                          <SAddDeal frame={true} demo={true} open={"upload"} step={"pick"} color={$s0?.x?.id} dark={$s0?.x?.dark} />
                        </>) : null}
                      </div>
                    </div>
                    <button type={"button"} className={"tb tg"} onClick={$s0?.replay} {...S(`--hv: ${I($s0?.x?.hoverCard)}; position: absolute; right: 14px; bottom: 14px; display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 12px; border: 1px solid ${I($s0?.x?.border)}; border-radius: ${I($s0?.x?.rCtl)}; background: ${I($s0?.x?.card)}; color: ${I($s0?.x?.fg)}; font: inherit; font-size: 12px; font-weight: 500; cursor: pointer`)}>
                      <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"} />
                      </svg>
                      {"Start over"}
                    </button>
                  </>) : null}
                  {$s0?.isMob ? (<>
                    <div {...S("position: absolute; top: 0; right: 0; bottom: 52px; left: 0; overflow: hidden")}>
                      {$s0?.runA ? (<>
                        <SAddDeal demo={true} mobile={true} open={"upload"} step={"pick"} color={$s0?.x?.id} dark={$s0?.x?.dark} />
                      </>) : null}
                      {$s0?.runB ? (<>
                        <SAddDeal demo={true} mobile={true} open={"upload"} step={"pick"} color={$s0?.x?.id} dark={$s0?.x?.dark} />
                      </>) : null}
                    </div>
                    <div {...S(`position: absolute; right: 0; bottom: 0; left: 0; height: 52px; display: flex; align-items: center; gap: 10px; padding: 0 8px 0 14px; box-sizing: border-box; border-top: 1px solid ${I($s0?.x?.line)}; background: ${I($s0?.x?.tile)}`)}>
                      <span {...S(`flex: 1 1 auto; min-width: 0; font-size: 12px; color: ${I($s0?.x?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                        {"Nothing is uploaded."}
                      </span>
                      <button type={"button"} className={"tb tg"} onClick={$s0?.replay} {...S(`--hv: ${I($s0?.x?.hoverCard)}; flex: 0 0 auto; display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 12px; border: 1px solid ${I($s0?.x?.border)}; border-radius: ${I($s0?.x?.rCtl)}; background: ${I($s0?.x?.card)}; color: ${I($s0?.x?.fg)}; font: inherit; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer`)}>
                        <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"} />
                        </svg>
                        {"Start over"}
                      </button>
                    </div>
                  </>) : null}
                </div>
              </>) : null}
              {$s0?.isDeal ? (<>
                <div className={"a-fade"} {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; display: flex; flex-direction: column; padding: 22px; box-sizing: border-box; gap: 14px; ${I($s0?.R?.dl)}`)}>
                  <div {...S("display: flex; align-items: center; gap: 12px")}>
                    <span {...S(`font-family: ${I($s0?.x?.titleFam)}; font-size: ${I($s0?.demoH)}; font-weight: 600; letter-spacing: ${I($s0?.x?.hTrack)}; text-transform: ${I($s0?.x?.hCase)}`)}>
                      {"Deals"}
                    </span>
                    <span {...S("flex: 1 1 auto")} />
                    <div role={"tablist"} aria-label={"Filter deals"} {...S(`display: inline-flex; gap: 2px; height: 34px; padding: 3px; box-sizing: border-box; border-radius: ${I($s0?.x?.rCtl)}; background: ${I($s0?.x?.fill)}; ${I($s0?.R?.dlTabs)}`)}>
                      {A($s0?.dealTabs).map((it, i) => {
                        const $s1 = { ...$s0, "dt": it, $index: i };
                        return (<React.Fragment key={i}>
                          <button type={"button"} role={"tab"} className={"tb"} aria-selected={$s1?.dt?.on} onClick={$s1?.dt?.pick} {...S(`display: inline-flex; align-items: center; padding: 0 12px; border: none; border-radius: ${I($s1?.x?.rCtl)}; background: ${I($s1?.dt?.bg)}; box-shadow: ${I($s1?.dt?.sh)}; color: ${I($s1?.dt?.fg)}; font: inherit; font-size: 13px; font-weight: 500; cursor: pointer`)}>
                            {T($s1?.dt?.label)}
                          </button>
                        </React.Fragment>);
                      })}
                    </div>
                  </div>
                  <div {...S(`display: flex; flex-direction: column; background: ${I($s0?.x?.card)}; border: 1px solid ${I($s0?.x?.border)}; border-radius: ${I($s0?.x?.rCard)}; box-shadow: ${I($s0?.x?.shCard)}; overflow: hidden`)}>
                    {$s0?.notMob ? (<>
                      <div {...S(`display: flex; align-items: center; gap: 12px; height: 38px; padding: 0 16px; font-size: 12px; font-weight: 500; color: ${I($s0?.x?.mutedFg)}`)}>
                        <span {...S("flex: 1 1 auto")}>
                          {"Brand"}
                        </span>
                        <span {...S("width: 56px")}>
                          {"Posts"}
                        </span>
                        <span {...S("width: 100px; text-align: center")}>
                          {"Payment"}
                        </span>
                        <span {...S("width: 76px; text-align: right")}>
                          {"Amount"}
                        </span>
                      </div>
                    </>) : null}
                    {$s0?.isMob ? (<>
                      <div {...S(`display: flex; align-items: center; justify-content: space-between; gap: 12px; height: 34px; padding: 0 12px; font-size: 12px; font-weight: 500; color: ${I($s0?.x?.mutedFg)}`)}>
                        <span>
                          {"Brand"}
                        </span>
                        <span>
                          {"Amount and payment"}
                        </span>
                      </div>
                    </>) : null}
                    {A($s0?.dealRows).map((it, i) => {
                      const $s1 = { ...$s0, "d": it, $index: i };
                      return (<React.Fragment key={i}>
                        {$s1?.notMob ? (<>
                          <button type={"button"} className={"tb tr a-in"} onClick={$s1?.d?.open} {...S(`animation-delay: ${I($s1?.d?.delay)}; display: flex; align-items: center; gap: 12px; width: 100%; height: 52px; padding: 0 16px; box-sizing: border-box; border: none; border-top: 1px solid ${I($s1?.x?.line)}; background: ${I($s1?.d?.bg)}; color: ${I($s1?.x?.fg)}; font: inherit; text-align: left; cursor: pointer`)}>
                            <span {...S(`width: 30px; height: 30px; flex: 0 0 30px; border-radius: 15px; background: ${I($s1?.x?.fill)}; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600`)}>
                              {T($s1?.d?.init)}
                            </span>
                            <span {...S("flex: 1 1 auto; min-width: 0; display: flex; align-items: center; gap: 8px")}>
                              <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                                {T($s1?.d?.brand)}
                              </span>
                              {A($s1?.d?.plats).map((it, i) => {
                                const $s2 = { ...$s1, "pl": it, $index: i };
                                return (<React.Fragment key={i}>
                                  <img src={$s2?.pl?.icon} alt={$s2?.pl?.label} width={"15"} height={"15"} {...S("display: block; width: 15px; height: 15px; border-radius: 4px")} />
                                </React.Fragment>);
                              })}
                            </span>
                            <span {...S(`width: 56px; font-size: 13px; color: ${I($s1?.x?.mutedFg)}; white-space: nowrap`)}>
                              {T($s1?.d?.post)}
                            </span>
                            <span {...S(`display: inline-flex; align-items: center; justify-content: center; width: 100px; height: 22px; border-radius: ${I($s1?.x?.rPill)}; background: ${I($s1?.d?.chipBg)}; color: ${I($s1?.d?.chipFg)}; font-size: 12px; font-weight: 500; white-space: nowrap`)}>
                              {T($s1?.d?.pay)}
                            </span>
                            <span {...S(`width: 76px; text-align: right; font-family: ${I($s1?.x?.numFam)}; font-variant-numeric: tabular-nums; font-weight: 500`)}>
                              {T($s1?.d?.amtS)}
                            </span>
                          </button>
                        </>) : null}
                        {$s1?.isMob ? (<>
                          <button type={"button"} className={"tb tr a-in"} onClick={$s1?.d?.open} {...S(`animation-delay: ${I($s1?.d?.delay)}; display: flex; align-items: center; gap: 10px; width: 100%; min-height: 60px; padding: 8px 12px; box-sizing: border-box; border: none; border-top: 1px solid ${I($s1?.x?.line)}; background: ${I($s1?.d?.bg)}; color: ${I($s1?.x?.fg)}; font: inherit; text-align: left; cursor: pointer`)}>
                            <span {...S(`width: 30px; height: 30px; flex: 0 0 30px; border-radius: 15px; background: ${I($s1?.x?.fill)}; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600`)}>
                              {T($s1?.d?.init)}
                            </span>
                            <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 3px; line-height: 1.25")}>
                              <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                                {T($s1?.d?.brand)}
                              </span>
                              <span {...S(`display: flex; align-items: center; gap: 4px; font-size: 12px; color: ${I($s1?.x?.mutedFg)}; white-space: nowrap`)}>
                                {A($s1?.d?.plats).map((it, i) => {
                                  const $s2 = { ...$s1, "pl": it, $index: i };
                                  return (<React.Fragment key={i}>
                                    <img src={$s2?.pl?.icon} alt={$s2?.pl?.label} width={"14"} height={"14"} {...S("display: block; width: 14px; height: 14px; border-radius: 4px")} />
                                  </React.Fragment>);
                                })}
                                <span {...S("margin-left: 2px")}>
                                  {"Posts "}{T($s1?.d?.post)}
                                </span>
                              </span>
                            </span>
                            <span {...S("flex: 0 0 auto; display: flex; flex-direction: column; align-items: flex-end; gap: 4px")}>
                              <span {...S(`font-family: ${I($s1?.x?.numFam)}; font-variant-numeric: tabular-nums; font-weight: 500`)}>
                                {T($s1?.d?.amtS)}
                              </span>
                              <span {...S(`display: inline-flex; align-items: center; height: 20px; padding: 0 8px; border-radius: ${I($s1?.x?.rPill)}; background: ${I($s1?.d?.chipBg)}; color: ${I($s1?.d?.chipFg)}; font-size: 11px; font-weight: 500; white-space: nowrap`)}>
                                {T($s1?.d?.pay)}
                              </span>
                            </span>
                          </button>
                        </>) : null}
                      </React.Fragment>);
                    })}
                    <div {...S(`display: flex; align-items: center; justify-content: space-between; height: 46px; padding: 0 16px; border-top: 1px solid ${I($s0?.x?.line)}; background: ${I($s0?.x?.hvr)}; ${I($s0?.R?.dlFoot)}`)}>
                      <span {...S(`color: ${I($s0?.x?.mutedFg)}`)}>
                        {T($s0?.dealCount)}
                      </span>
                      <span {...S(`font-family: ${I($s0?.x?.numFam)}; font-weight: 600; font-variant-numeric: tabular-nums; transition: color 0.3s ease`)}>
                        {T($s0?.dealTotal)}
                      </span>
                    </div>
                  </div>
                  {$s0?.hasSheet ? (<>
                    <div className={"a-sheet"} role={"dialog"} aria-label={"Deal details"} {...S(`position: absolute; top: 12px; right: 12px; bottom: 12px; width: 300px; display: flex; flex-direction: column; gap: 14px; padding: 18px; box-sizing: border-box; background: ${I($s0?.x?.card)}; border: 1px solid ${I($s0?.x?.border)}; border-radius: ${I($s0?.x?.rDialog)}; box-shadow: ${I($s0?.x?.shPop)}; ${I($s0?.R?.sheet)}`)}>
                      <div {...S("display: flex; align-items: center; gap: 10px")}>
                        <span {...S(`width: 36px; height: 36px; flex: 0 0 36px; border-radius: 18px; background: ${I($s0?.x?.fill)}; display: inline-flex; align-items: center; justify-content: center; font-weight: 600`)}>
                          {T($s0?.sheet?.init)}
                        </span>
                        <span {...S(`flex: 1 1 auto; min-width: 0; font-family: ${I($s0?.x?.titleFam)}; font-size: 17px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                          {T($s0?.sheet?.brand)}
                        </span>
                        <button type={"button"} className={"tb tg"} onClick={$s0?.closeSheet} aria-label={"Close"} {...S(`--hv: ${I($s0?.x?.hv)}; width: 30px; height: 30px; padding: 0; border: none; border-radius: ${I($s0?.x?.rItem)}; background: transparent; color: ${I($s0?.x?.fg)}; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; ${I($s0?.R?.sheetX)}`)}>
                          <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                            <path d={"M18 6 6 18M6 6l12 12"} />
                          </svg>
                        </button>
                      </div>
                      {A($s0?.sheet?.rows).map((it, i) => {
                        const $s1 = { ...$s0, "sr": it, $index: i };
                        return (<React.Fragment key={i}>
                          <div {...S(`display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid ${I($s1?.x?.line)}`)}>
                            <span {...S(`color: ${I($s1?.x?.mutedFg)}; white-space: nowrap`)}>
                              {T($s1?.sr?.k)}
                            </span>
                            <span {...S("font-weight: 500; white-space: nowrap")}>
                              {T($s1?.sr?.v)}
                            </span>
                          </div>
                        </React.Fragment>);
                      })}
                      <div {...S("display: flex; flex-direction: column; gap: 8px")}>
                        <span {...S(`color: ${I($s0?.x?.mutedFg)}`)}>
                          {"Platforms"}
                        </span>
                        <div {...S("display: flex; gap: 6px; flex-wrap: wrap")}>
                          {A($s0?.sheet?.plats).map((it, i) => {
                            const $s1 = { ...$s0, "pl": it, $index: i };
                            return (<React.Fragment key={i}>
                              <span {...S(`display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px 0 5px; border-radius: ${I($s1?.x?.rCtl)}; background: ${I($s1?.x?.fill)}; font-size: 13px; font-weight: 500`)}>
                                <img src={$s1?.pl?.icon} alt={""} width={"18"} height={"18"} {...S("display: block; width: 18px; height: 18px; border-radius: 5px")} />
                                {T($s1?.pl?.label)}
                              </span>
                            </React.Fragment>);
                          })}
                        </div>
                      </div>
                      <span {...S("flex: 1 1 auto")} />
                      <div {...S(`display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: ${I($s0?.x?.rTile)}; background: ${I($s0?.x?.tile)}; font-size: 13px`)}>
                        <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6"} />
                        </svg>
                        <span {...S("flex: 1 1 auto; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                          {T($s0?.sheet?.file)}
                        </span>
                      </div>
                    </div>
                  </>) : null}
                </div>
              </>) : null}
              {$s0?.isCal ? (<>
                <div className={"a-fade"} {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; display: flex; flex-direction: column; gap: 12px; padding: 22px; box-sizing: border-box; ${I($s0?.R?.cal)}`)}>
                  <div {...S(`display: flex; align-items: center; gap: 12px; ${I($s0?.R?.calHead)}`)}>
                    <span {...S(`font-family: ${I($s0?.x?.titleFam)}; font-size: ${I($s0?.demoH)}; font-weight: 600; letter-spacing: ${I($s0?.x?.hTrack)}; text-transform: ${I($s0?.x?.hCase)}; white-space: nowrap`)}>
                      {"October 2026"}
                    </span>
                    <span {...S("flex: 1 1 auto")} />
                    <span {...S(`display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: ${I($s0?.x?.mutedFg)}`)}>
                      <span {...S("width: 8px; height: 8px; border-radius: 4px; background: #8B5CF6")} />
                      {"Post"}
                      <span {...S("width: 8px; height: 8px; margin-left: 8px; border-radius: 4px; background: #22C55E")} />
                      {"Payment"}
                    </span>
                  </div>
                  <div {...S(`display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); font-size: 12px; font-weight: 500; color: ${I($s0?.x?.mutedFg)}`)}>
                    {A($s0?.dows).map((it, i) => {
                      const $s1 = { ...$s0, "dw": it, $index: i };
                      return (<React.Fragment key={i}>
                        <span {...S(`padding: 0 6px; ${I($s1?.R?.dowCell)}`)}>
                          {T($s1?.dw)}
                        </span>
                      </React.Fragment>);
                    })}
                  </div>
                  <div {...S(`display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); grid-auto-rows: 66px; border-top: 1px solid ${I($s0?.x?.line)}; border-left: 1px solid ${I($s0?.x?.line)}; ${I($s0?.R?.calGrid)}`)}>
                    {A($s0?.calDays).map((it, i) => {
                      const $s1 = { ...$s0, "cd": it, $index: i };
                      return (<React.Fragment key={i}>
                        <button type={"button"} className={"tb tg"} onClick={$s1?.cd?.pick} aria-label={$s1?.cd?.aria} aria-pressed={$s1?.cd?.on} {...S(`--hv: ${I($s1?.x?.hvr)}; position: relative; display: flex; flex-direction: column; align-items: stretch; gap: 3px; min-width: 0; padding: 6px; box-sizing: border-box; border: none; border-right: 1px solid ${I($s1?.x?.line)}; border-bottom: 1px solid ${I($s1?.x?.line)}; background: ${I($s1?.cd?.bg)}; box-shadow: ${I($s1?.cd?.ring)}; color: ${I($s1?.cd?.fg)}; font: inherit; text-align: left; cursor: pointer; ${I($s1?.R?.calCell)}`)}>
                          <span {...S(`font-size: 12px; font-weight: ${I($s1?.cd?.fw)}; font-family: ${I($s1?.x?.numFam)}`)}>
                            {T($s1?.cd?.n)}
                          </span>
                          {$s1?.notMob ? (<>
                            {A($s1?.cd?.ev).map((it, i) => {
                              const $s2 = { ...$s1, "ev": it, $index: i };
                              return (<React.Fragment key={i}>
                                <span {...S(`display: block; padding: 1px 6px; border-radius: ${I($s2?.x?.rEv)}; background: ${I($s2?.ev?.bg)}; color: ${I($s2?.ev?.fg)}; font-size: 11px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                                  {T($s2?.ev?.label)}
                                </span>
                              </React.Fragment>);
                            })}
                          </>) : null}
                          {$s1?.isMob ? (<>
                            <span {...S("display: flex; gap: 3px; padding-left: 1px")}>
                              {A($s1?.cd?.ev).map((it, i) => {
                                const $s2 = { ...$s1, "ev": it, $index: i };
                                return (<React.Fragment key={i}>
                                  <span {...S(`width: 6px; height: 6px; flex: 0 0 6px; border-radius: 3px; background: ${I($s2?.ev?.dot)}`)} />
                                </React.Fragment>);
                              })}
                            </span>
                          </>) : null}
                        </button>
                      </React.Fragment>);
                    })}
                  </div>
                  <div {...S(`flex: 1 1 auto; display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-radius: ${I($s0?.x?.rTile)}; background: ${I($s0?.x?.card)}; border: 1px solid ${I($s0?.x?.border)}; ${I($s0?.R?.dayList)}`)}>
                    <span {...S("font-weight: 600")}>
                      {T($s0?.dayTitle)}
                    </span>
                    {$s0?.dayEmpty ? (<>
                      <span {...S(`color: ${I($s0?.x?.mutedFg)}`)}>
                        {"Nothing on this day."}
                      </span>
                    </>) : null}
                    {A($s0?.dayItems).map((it, i) => {
                      const $s1 = { ...$s0, "di": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div className={"a-in"} {...S("display: flex; align-items: center; gap: 10px")}>
                          <span {...S(`width: 8px; height: 8px; flex: 0 0 8px; border-radius: 4px; background: ${I($s1?.di?.dot)}`)} />
                          <span {...S("flex: 1 1 auto; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                            {T($s1?.di?.text)}
                          </span>
                          <span {...S(`font-family: ${I($s1?.x?.numFam)}; color: ${I($s1?.x?.mutedFg)}; white-space: nowrap`)}>
                            {T($s1?.di?.amt)}
                          </span>
                        </div>
                      </React.Fragment>);
                    })}
                  </div>
                </div>
              </>) : null}
              {$s0?.isPay ? (<>
                <div className={"a-fade"} {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; display: flex; flex-direction: column; gap: 14px; padding: 22px; box-sizing: border-box; ${I($s0?.R?.pay)}`)}>
                  <span {...S(`font-family: ${I($s0?.x?.titleFam)}; font-size: ${I($s0?.demoH)}; font-weight: 600; letter-spacing: ${I($s0?.x?.hTrack)}; text-transform: ${I($s0?.x?.hCase)}`)}>
                    {"Payments"}
                  </span>
                  <div {...S(`display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; ${I($s0?.R?.payStats)}`)}>
                    {A($s0?.payStats).map((it, i) => {
                      const $s1 = { ...$s0, "ps": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div {...S(`display: flex; flex-direction: column; gap: 4px; padding: 16px 18px; background: ${I($s1?.x?.card)}; border: 1px solid ${I($s1?.x?.border)}; border-radius: ${I($s1?.x?.rCard)}; box-shadow: ${I($s1?.x?.shCard)}; ${I($s1?.R?.payStat)}`)}>
                          <span {...S(`font-size: 13px; color: ${I($s1?.x?.mutedFg)}; ${I($s1?.R?.payLbl)}`)}>
                            {T($s1?.ps?.label)}
                          </span>
                          <span {...S(`font-family: ${I($s1?.x?.numFam)}; font-size: 28px; font-weight: 600; letter-spacing: ${I($s1?.x?.nTrack)}; line-height: 1.15; font-variant-numeric: tabular-nums; color: ${I($s1?.ps?.fg)}; transition: color 0.4s ease; ${I($s1?.R?.payVal)}`)}>
                            {T($s1?.ps?.value)}
                          </span>
                          <span {...S(`font-size: 12px; color: ${I($s1?.x?.mutedFg)}`)}>
                            {T($s1?.ps?.sub)}
                          </span>
                        </div>
                      </React.Fragment>);
                    })}
                  </div>
                  <div {...S(`display: flex; flex-direction: column; background: ${I($s0?.x?.card)}; border: 1px solid ${I($s0?.x?.border)}; border-radius: ${I($s0?.x?.rCard)}; box-shadow: ${I($s0?.x?.shCard)}; overflow: hidden`)}>
                    {A($s0?.payRows).map((it, i) => {
                      const $s1 = { ...$s0, "pr": it, $index: i };
                      return (<React.Fragment key={i}>
                        {$s1?.notMob ? (<>
                          <div {...S(`display: flex; align-items: center; gap: 12px; height: 60px; padding: 0 16px; border-top: ${I($s1?.pr?.line)}`)}>
                            <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; line-height: 1.3")}>
                              <span {...S("font-weight: 500; white-space: nowrap")}>
                                {T($s1?.pr?.brand)}
                              </span>
                              <span {...S(`font-size: 12px; color: ${I($s1?.x?.mutedFg)}; white-space: nowrap`)}>
                                {T($s1?.pr?.when)}
                              </span>
                            </span>
                            <span className={$s1?.pr?.anim} {...S(`display: inline-flex; align-items: center; justify-content: center; width: 100px; height: 22px; border-radius: ${I($s1?.x?.rPill)}; background: ${I($s1?.pr?.chipBg)}; color: ${I($s1?.pr?.chipFg)}; font-size: 12px; font-weight: 500`)}>
                              {T($s1?.pr?.status)}
                            </span>
                            <span {...S(`width: 76px; text-align: right; font-family: ${I($s1?.x?.numFam)}; font-variant-numeric: tabular-nums; font-weight: 500`)}>
                              {T($s1?.pr?.amtS)}
                            </span>
                            <span {...S("width: 104px; display: flex; justify-content: flex-end")}>
                              {$s1?.pr?.canPay ? (<>
                                <button type={"button"} className={"tb tg"} onClick={$s1?.pr?.pay} {...S(`--hv: ${I($s1?.x?.hoverCard)}; height: 30px; padding: 0 12px; border: 1px solid ${I($s1?.x?.border)}; border-radius: ${I($s1?.x?.rCtl)}; background: ${I($s1?.x?.card)}; color: ${I($s1?.x?.fg)}; font: inherit; font-size: 12px; font-weight: 500; white-space: nowrap; cursor: pointer`)}>
                                  {"Mark paid"}
                                </button>
                              </>) : null}
                            </span>
                          </div>
                        </>) : null}
                        {$s1?.isMob ? (<>
                          <div {...S(`display: flex; align-items: center; gap: 6px; min-height: 64px; padding: 9px 8px 9px 11px; box-sizing: border-box; border-top: ${I($s1?.pr?.line)}`)}>
                            <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px; line-height: 1.3")}>
                              <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                                {T($s1?.pr?.brand)}
                              </span>
                              <span {...S(`font-size: 12px; color: ${I($s1?.x?.mutedFg)}`)}>
                                {T($s1?.pr?.when)}
                              </span>
                            </span>
                            <span {...S("flex: 0 0 auto; display: flex; flex-direction: column; align-items: flex-end; gap: 4px")}>
                              <span {...S(`font-family: ${I($s1?.x?.numFam)}; font-variant-numeric: tabular-nums; font-weight: 500`)}>
                                {T($s1?.pr?.amtS)}
                              </span>
                              <span className={$s1?.pr?.anim} {...S(`display: inline-flex; align-items: center; height: 20px; padding: 0 8px; border-radius: ${I($s1?.x?.rPill)}; background: ${I($s1?.pr?.chipBg)}; color: ${I($s1?.pr?.chipFg)}; font-size: 11px; font-weight: 500; white-space: nowrap`)}>
                                {T($s1?.pr?.status)}
                              </span>
                            </span>
                            <span {...S("flex: 0 0 76px; display: flex; justify-content: flex-end")}>
                              {$s1?.pr?.canPay ? (<>
                                <button type={"button"} className={"tb tg"} onClick={$s1?.pr?.pay} {...S(`--hv: ${I($s1?.x?.hoverCard)}; height: 36px; padding: 0 9px; border: 1px solid ${I($s1?.x?.border)}; border-radius: ${I($s1?.x?.rCtl)}; background: ${I($s1?.x?.card)}; color: ${I($s1?.x?.fg)}; font: inherit; font-size: 12px; font-weight: 500; white-space: nowrap; cursor: pointer`)}>
                                  {"Mark paid"}
                                </button>
                              </>) : null}
                            </span>
                          </div>
                        </>) : null}
                      </React.Fragment>);
                    })}
                  </div>
                  {$s0?.hasPayToast ? (<>
                    <div role={"status"} className={"a-toast"} {...S(`display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: ${I($s0?.x?.rTile)}; background: ${I($s0?.x?.okBg)}; color: ${I($s0?.x?.okFg)}; ${I($s0?.R?.toast)}`)}>
                      <span className={"a-check"} {...S(`width: 24px; height: 24px; flex: 0 0 24px; border-radius: 12px; background: ${I($s0?.x?.okFg)}; color: ${I($s0?.x?.okBg)}; display: inline-flex; align-items: center; justify-content: center`)}>
                        <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M20 6 9 17l-5-5"} />
                        </svg>
                      </span>
                      <span {...S(`font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ${I($s0?.R?.toastTxt)}`)}>
                        {T($s0?.payToast)}
                      </span>
                    </div>
                  </>) : null}
                </div>
              </>) : null}
            </div>
          </div>
        </section>
        <section aria-labelledby={"ask-title"} {...S(`display: flex; justify-content: center; padding: 104px 24px 104px; ${I($s0?.R?.askSec)}`)}>
          <div {...S(`width: 1200px; max-width: 100%; display: grid; grid-template-columns: 580px minmax(0, 1fr); gap: 64px; align-items: center; ${I($s0?.R?.askGrid)}`)}>
            <div {...S(`position: relative; height: 600px; display: flex; flex-direction: column; overflow: hidden; border-radius: 22px; background: ${I($s0?.x?.card)}; color: ${I($s0?.x?.fg)}; font-family: ${I($s0?.x?.bodyFam)}; font-size: 14px; line-height: 1.5; box-shadow: 0 40px 80px -40px rgba(0,0,0,0.3), 0 0 0 1px ${I($s0?.c?.border)}; transition: background-color 0.35s ease, color 0.35s ease; ${I($s0?.xvars)}; ${I($s0?.R?.chat)}`)}>
              <div {...S(`display: flex; align-items: center; gap: 12px; padding: 16px 18px; border-bottom: 1px solid ${I($s0?.x?.line)}; ${I($s0?.R?.chatHead)}`)}>
                <span {...S(`width: 36px; height: 36px; flex: 0 0 36px; border-radius: 18px; background: ${I($s0?.x?.fill)}; display: inline-flex; align-items: center; justify-content: center`)}>
                  <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.x?.accent} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <rect x={"3"} y={"8"} width={"15"} height={"12"} rx={"3.5"} />
                    <path d={"M10.5 8V5.5"} />
                    <circle cx={"10.5"} cy={"4.5"} r={"1"} />
                    <circle cx={"8"} cy={"14"} r={"1"} fill={$s0?.x?.accent} stroke={"none"} />
                    <circle cx={"13"} cy={"14"} r={"1"} fill={$s0?.x?.accent} stroke={"none"} />
                    <path d={"M19.5 2l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8z"} fill={$s0?.x?.accent} stroke={"none"} />
                  </svg>
                </span>
                <span {...S(`flex: 1 1 auto; display: flex; flex-direction: column; line-height: 1.25; ${I($s0?.R?.chatTitle)}`)}>
                  <span {...S("font-weight: 600")}>
                    {"Talby Assistant"}
                  </span>
                  <span {...S(`font-size: 12px; color: ${I($s0?.x?.mutedFg)}; ${I($s0?.R?.chatSub)}`)}>
                    {"Answers from your deals and contracts"}
                  </span>
                </span>
                <button type={"button"} className={"tb tg"} onClick={$s0?.resetChat} {...S(`--hv: ${I($s0?.x?.hv)}; display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 12px; border: 1px solid ${I($s0?.x?.border)}; border-radius: ${I($s0?.x?.rCtl)}; background: ${I($s0?.x?.card)}; color: ${I($s0?.x?.fg)}; font: inherit; font-size: 12px; font-weight: 500; cursor: pointer; ${I($s0?.R?.chatNew)}`)}>
                  {"New chat"}
                </button>
              </div>
              <div {...S(`flex: 1 1 auto; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding: 18px; ${I($s0?.R?.chatList)}`, $s0?.chatRef)}>
                <div className={"a-in"} {...S(`align-self: flex-start; max-width: 88%; padding: 12px 14px; border-radius: 16px 16px 16px 6px; background: ${I($s0?.x?.tile)}; color: ${I($s0?.x?.fg)}`)}>
                  {"Hi JunoBakes. Ask me anything about your deals, dates or money. I only use what is in your account."}
                </div>
                {A($s0?.msgs).map((it, i) => {
                  const $s1 = { ...$s0, "m": it, $index: i };
                  return (<React.Fragment key={i}>
                    <div className={"a-in"} {...S(`align-self: ${I($s1?.m?.align)}; max-width: ${I($s1?.m?.maxW)}; display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-radius: ${I($s1?.m?.radius)}; background: ${I($s1?.m?.bg)}; color: ${I($s1?.m?.fg)}; white-space: pre-line`)}>
                      {T($s1?.m?.text)}
                      {$s1?.m?.hasSrc ? (<>
                        <span className={"a-fade"} {...S(`align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; height: 24px; padding: 0 9px; border-radius: ${I($s1?.x?.rCtl)}; background: ${I($s1?.x?.card)}; border: 1px solid ${I($s1?.x?.border)}; color: ${I($s1?.x?.mutedFg)}; font-size: 12px; white-space: nowrap; ${I($s1?.R?.srcChip)}`)}>
                          <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s1?.x?.accent} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={"M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6"} />
                          </svg>
                          {T($s1?.m?.src)}
                        </span>
                      </>) : null}
                    </div>
                  </React.Fragment>);
                })}
                {$s0?.typing ? (<>
                  <div className={"a-type a-fade"} aria-label={"Talby is typing"} {...S(`align-self: flex-start; display: flex; gap: 5px; padding: 14px 16px; border-radius: 16px 16px 16px 6px; background: ${I($s0?.x?.tile)}`)}>
                    <span {...S(`width: 7px; height: 7px; border-radius: 4px; background: ${I($s0?.x?.mutedFg)}`)} />
                    <span {...S(`width: 7px; height: 7px; border-radius: 4px; background: ${I($s0?.x?.mutedFg)}`)} />
                    <span {...S(`width: 7px; height: 7px; border-radius: 4px; background: ${I($s0?.x?.mutedFg)}`)} />
                  </div>
                </>) : null}
                {$s0?.showChips ? (<>
                  <div className={"a-fade"} {...S("display: flex; flex-direction: column; align-items: flex-start; gap: 8px; margin-top: 4px")}>
                    <span {...S(`font-size: 12px; font-weight: 500; color: ${I($s0?.x?.mutedFg)}`)}>
                      {T($s0?.chipsLabel)}
                    </span>
                    {A($s0?.askChips).map((it, i) => {
                      const $s1 = { ...$s0, "ac": it, $index: i };
                      return (<React.Fragment key={i}>
                        <button type={"button"} className={"tb tg"} onClick={$s1?.ac?.pick} {...S(`--hv: ${I($s1?.x?.hv)}; display: inline-flex; align-items: center; gap: 8px; max-width: 100%; height: 36px; padding: 0 14px; box-sizing: border-box; border: 1px solid ${I($s1?.x?.border)}; border-radius: ${I($s1?.x?.rCtl)}; background: ${I($s1?.x?.card)}; color: ${I($s1?.x?.fg)}; font: inherit; font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; ${I($s1?.R?.chip)}`)}>
                          <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s1?.x?.accent} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 14px")}>
                            <path d={"M5 12h14M13 6l6 6-6 6"} />
                          </svg>
                          {T($s1?.ac?.label)}
                        </button>
                      </React.Fragment>);
                    })}
                  </div>
                </>) : null}
              </div>
              <div {...S(`display: flex; align-items: center; gap: 8px; padding: 12px 14px; border-top: 1px solid ${I($s0?.x?.line)}; ${I($s0?.R?.chatBar)}`)}>
                <input aria-label={"Ask Talby"} value={V0($s0?.draft, "")} onChange={$s0?.setDraft} onKeyDown={$s0?.draftKey} placeholder={"Ask about your deals"} {...S(`flex: 1 1 auto; min-width: 0; height: 42px; padding: 0 16px; box-sizing: border-box; border: none; border-radius: ${I($s0?.x?.rCtl)}; background: ${I($s0?.x?.fill)}; color: ${I($s0?.x?.fg)}; font: inherit; outline: none; ${I($s0?.R?.chatIn)}`)} />
                <button type={"button"} className={"tb tp"} onClick={$s0?.send} aria-label={"Send"} {...S(`width: 42px; height: 42px; flex: 0 0 42px; padding: 0; border: none; border-radius: ${I($s0?.x?.rCtl)}; background: ${I($s0?.x?.primary)}; color: ${I($s0?.x?.primaryFg)}; box-shadow: ${I($s0?.x?.btnSh)}; display: inline-flex; align-items: center; justify-content: center; cursor: pointer`)}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M5 12h14M13 6l6 6-6 6"} />
                  </svg>
                </button>
              </div>
            </div>
            <div {...S(`display: flex; flex-direction: column; gap: 18px; ${I($s0?.R?.askText)}`)}>
              <span {...S(`width: 52px; height: 52px; border-radius: 26px; background: ${I($s0?.c?.card)}; box-shadow: 0 0 0 1px ${I($s0?.c?.border)}, 0 0 0 6px ${I($s0?.c?.tile)}; display: inline-flex; align-items: center; justify-content: center; ${I($s0?.R?.askBadge)}`)}>
                <svg width={"24"} height={"24"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.c?.accent} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <rect x={"3"} y={"8"} width={"15"} height={"12"} rx={"3.5"} />
                  <path d={"M10.5 8V5.5"} />
                  <circle cx={"10.5"} cy={"4.5"} r={"1"} />
                  <circle cx={"8"} cy={"14"} r={"1"} fill={$s0?.c?.accent} stroke={"none"} />
                  <circle cx={"13"} cy={"14"} r={"1"} fill={$s0?.c?.accent} stroke={"none"} />
                  <path d={"M19.5 2l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8z"} fill={$s0?.c?.accent} stroke={"none"} />
                </svg>
              </span>
              <span {...S(`font-size: 13px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: ${I($s0?.c?.accent)}`)}>
                {"Talby Assistant"}
              </span>
              <h2 id={"ask-title"} {...S(`margin: 0; font-family: ${I($s0?.c?.titleFam)}; font-size: 44px; font-weight: 600; letter-spacing: -1.2px; line-height: 1.1; ${I($s0?.R?.h2)}`)}>
                {"Ask Talby about your own deals."}
              </h2>
              <p {...S(`margin: 0; font-size: 18px; color: ${I($s0?.c?.mutedFg)}; ${I($s0?.R?.secP)}`)}>
                {"Talby only knows what is in your account: your contracts, your dates and your numbers. Every answer comes from your own paperwork, not the internet."}
              </p>
              <ul {...S("margin: 4px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 12px")}>
                {A($s0?.askPoints).map((it, i) => {
                  const $s1 = { ...$s0, "ap": it, $index: i };
                  return (<React.Fragment key={i}>
                    <li {...S("display: flex; align-items: center; gap: 12px")}>
                      <span {...S(`width: 22px; height: 22px; flex: 0 0 22px; border-radius: 11px; background: ${I($s1?.c?.fill)}; color: ${I($s1?.c?.accent)}; display: inline-flex; align-items: center; justify-content: center`)}>
                        <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M20 6 9 17l-5-5"} />
                        </svg>
                      </span>
                      <span>
                        {T($s1?.ap)}
                      </span>
                    </li>
                  </React.Fragment>);
                })}
              </ul>
              <span {...S(`font-size: 14px; color: ${I($s0?.c?.mutedFg)}`)}>
                {"Try a question in the chat. The answers come from JunoBakes, a sample account."}
              </span>
            </div>
          </div>
        </section>
        <section id={"pricing"} aria-labelledby={"price-title"} {...S(`display: flex; justify-content: center; padding: 24px 24px 104px; ${I($s0?.R?.priceSec)}`)}>
          <div {...S("width: 1200px; max-width: 100%; display: flex; flex-direction: column; gap: 14px")}>
            <span {...S(`font-size: 13px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: ${I($s0?.c?.accent)}`)}>
              {"Pricing"}
            </span>
            <h2 id={"price-title"} {...S(`margin: 0; font-family: ${I($s0?.c?.titleFam)}; font-size: 44px; font-weight: 600; letter-spacing: -1.2px; line-height: 1.1; ${I($s0?.R?.h2)}`)}>
              {"14 days free. Then $9 a month."}
            </h2>
            <p {...S(`margin: 0; max-width: 640px; font-size: 18px; color: ${I($s0?.c?.mutedFg)}; ${I($s0?.R?.secP)}`)}>
              {"Start your free trial with no card needed. Keep everything you create, whether or not you subscribe."}
            </p>
            <div {...S(`margin-top: 28px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; align-items: stretch; ${I($s0?.R?.priceGrid)}`)}>
              {A($s0?.plans).map((it, i) => {
                const $s1 = { ...$s0, "pl": it, $index: i };
                return (<React.Fragment key={i}>
                  <div {...S(`display: flex; flex-direction: column; gap: 16px; padding: 30px; box-sizing: border-box; border: ${I($s1?.pl?.border)}; border-radius: 22px; background: ${I($s1?.c?.card)}; box-shadow: ${I($s1?.pl?.sh)}; ${I($s1?.R?.plan)}`)}>
                    <div {...S("display: flex; align-items: center; justify-content: space-between; gap: 12px")}>
                      <span {...S(`font-family: ${I($s1?.c?.titleFam)}; font-size: 20px; font-weight: 600`)}>
                        {T($s1?.pl?.name)}
                      </span>
                      <span {...S(`font-size: 13px; color: ${I($s1?.c?.mutedFg)}; white-space: nowrap`)}>
                        {T($s1?.pl?.note)}
                      </span>
                    </div>
                    <div {...S("display: flex; align-items: baseline; gap: 8px")}>
                      <span {...S(`font-family: ${I($s1?.c?.titleFam)}; font-size: 52px; font-weight: 600; letter-spacing: -1.6px; line-height: 1; ${I($s1?.R?.price)}`)}>
                        {T($s1?.pl?.price)}
                      </span>
                      <span {...S(`color: ${I($s1?.c?.mutedFg)}`)}>
                        {T($s1?.pl?.per)}
                      </span>
                    </div>
                    <ul {...S(`margin: 6px 0 0; padding: 18px 0 0; border-top: 1px solid ${I($s1?.c?.line)}; list-style: none; display: flex; flex-direction: column; gap: 12px`)}>
                      {A($s1?.pl?.items).map((it, i) => {
                        const $s2 = { ...$s1, "it": it, $index: i };
                        return (<React.Fragment key={i}>
                          <li {...S("display: flex; align-items: center; gap: 10px")}>
                            <span {...S(`width: 20px; height: 20px; flex: 0 0 20px; border-radius: 10px; background: ${I($s2?.c?.fill)}; color: ${I($s2?.c?.accent)}; display: inline-flex; align-items: center; justify-content: center`)}>
                              <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={"M20 6 9 17l-5-5"} />
                              </svg>
                            </span>
                            <span>
                              {T($s2?.it)}
                            </span>
                          </li>
                        </React.Fragment>);
                      })}
                    </ul>
                    <div {...S("flex: 1 1 auto")} />
                    <a href={H($s1?.pl?.href)} className={`tb ${I($s1?.pl?.cls)}`} {...S(`--hv: ${I($s1?.c?.hv)}; display: inline-flex; align-items: center; justify-content: center; height: 48px; border-radius: 999px; border: ${I($s1?.pl?.btnBorder)}; background: ${I($s1?.pl?.btnBg)}; color: ${I($s1?.pl?.btnFg)}; font-weight: 500; text-decoration: none; white-space: nowrap`)}>
                      {T($s1?.pl?.cta)}
                    </a>
                  </div>
                </React.Fragment>);
              })}
            </div>
          </div>
        </section>
        <section aria-labelledby={"cta-title"} {...S(`display: flex; flex-direction: column; align-items: center; gap: 18px; padding: 112px 24px; background: ${I($s0?.c?.tile)}; text-align: center; ${I($s0?.R?.cta)}`)}>
          <span {...S("width: 56px; height: 56px; border-radius: 16px; background: #1F7AE0; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 4px")}>
            <svg width={"32"} height={"27"} viewBox={"0 0 2029 1722"} aria-hidden={"true"} {...S("display: block")}>
              <path fill={"#FFFFFF"} d={"M325.553 0.11436C357.82 -0.851434 390.344 4.39925 421.577 12.1099C506.351 33.0387 579.306 92.8684 628.981 163.1C648.617 190.863 665.004 221.256 682.357 250.477C714.91 305.296 746.394 360.846 779.411 415.372C792.242 436.561 805.088 458.322 818.991 478.81C853.846 530.177 928.98 628.305 990.503 643.014C1013.94 648.615 1037.46 645.591 1058.97 634.725C1078.92 624.656 1094.72 608.763 1110.74 593.552C1184.16 523.869 1237.02 434.688 1287.42 347.839C1299.09 327.74 1311.38 307.989 1322.85 287.786C1346.79 245.624 1371.62 198.953 1400.03 160.003C1431.42 116.962 1467.92 79.9142 1513.59 51.9883C1592.43 3.35327 1687.5 -11.5536 1777.44 10.6178C1861.41 31.3662 1933.82 84.3529 1979.02 158.109C2024.53 233.037 2040.98 310.935 2019.97 397.268C1988.25 527.6 1882.9 628.138 1749.42 647.874C1724.27 651.594 1693.72 650.686 1668.06 650.648L1562.66 650.457L1294.18 650.569C1229.3 650.36 1166.25 642.367 1109.31 677.354C1075.41 697.881 1051.07 731.066 1041.68 769.577C1024.74 841.175 1063.31 906.426 1099.22 965.078C1103.02 971.823 1114.46 985.726 1119.82 992.612C1140.88 1019.75 1162.84 1046.17 1185.68 1071.84C1264.51 1161.22 1337.81 1269.48 1345.12 1391.87C1355.92 1572.91 1205.73 1711.69 1031.77 1721.4C938.596 1726.86 847.128 1694.71 777.855 1632.13C733.34 1591.55 702.231 1538.38 688.665 1479.68C676.384 1428.85 679.574 1377.6 692.642 1327.29C710.038 1260.33 744.366 1197.92 785.127 1142.41C854.647 1047.73 998.351 921.921 991.042 795.526C987.346 731.658 941.997 680.383 882.362 660.534C837.4 645.57 776.985 650.524 728.979 650.558L429.507 650.401L351.229 650.568C319.765 650.635 286.204 651.2 255.381 644.239C194.201 631.235 150.38 605.052 104.113 565.316C-67.2929 418.104 -14.8418 150.672 172.337 43.4476C223.087 14.3754 266.379 3.16906 325.553 0.11436Z"} />
            </svg>
          </span>
          <h2 id={"cta-title"} {...S(`margin: 0; font-family: ${I($s0?.c?.titleFam)}; font-size: 52px; font-weight: 600; letter-spacing: -1.6px; line-height: 1.05; ${I($s0?.R?.ctaH2)}`)}>
            {"Add your first deal tonight."}
          </h2>
          <p {...S(`margin: 0; max-width: 560px; font-size: 18px; color: ${I($s0?.c?.mutedFg)}; ${I($s0?.R?.ctaP)}`)}>
            {"It takes about a minute, and you will know exactly what is due and what is owed by the time you are done."}
          </p>
          <a href={H("/signup")} className={"tb tp"} {...S(`display: inline-flex; align-items: center; height: 48px; padding: 0 26px; border-radius: 999px; background: ${I($s0?.c?.primary)}; color: ${I($s0?.c?.primaryFg)}; font-weight: 500; text-decoration: none; white-space: nowrap`)}>
            {"Start free trial"}
          </a>
        </section>
        <footer {...S(`display: flex; justify-content: center; padding: 28px 24px 40px; border-top: 1px solid ${I($s0?.c?.line)}; ${I($s0?.R?.foot)}`)}>
          {$s0?.footRow ? (<>
            <div {...S(`width: 1200px; max-width: 100%; display: flex; align-items: center; gap: 22px; flex-wrap: wrap; font-size: 13px; color: ${I($s0?.c?.mutedFg)}`)}>
              <span {...S(`display: inline-flex; align-items: center; gap: 8px; color: ${I($s0?.c?.fg)}`)}>
                <svg width={"20"} height={"17"} viewBox={"0 0 2029 1722"} aria-hidden={"true"} {...S("display: block")}>
                  <path fill={"#1F7AE0"} d={"M325.553 0.11436C357.82 -0.851434 390.344 4.39925 421.577 12.1099C506.351 33.0387 579.306 92.8684 628.981 163.1C648.617 190.863 665.004 221.256 682.357 250.477C714.91 305.296 746.394 360.846 779.411 415.372C792.242 436.561 805.088 458.322 818.991 478.81C853.846 530.177 928.98 628.305 990.503 643.014C1013.94 648.615 1037.46 645.591 1058.97 634.725C1078.92 624.656 1094.72 608.763 1110.74 593.552C1184.16 523.869 1237.02 434.688 1287.42 347.839C1299.09 327.74 1311.38 307.989 1322.85 287.786C1346.79 245.624 1371.62 198.953 1400.03 160.003C1431.42 116.962 1467.92 79.9142 1513.59 51.9883C1592.43 3.35327 1687.5 -11.5536 1777.44 10.6178C1861.41 31.3662 1933.82 84.3529 1979.02 158.109C2024.53 233.037 2040.98 310.935 2019.97 397.268C1988.25 527.6 1882.9 628.138 1749.42 647.874C1724.27 651.594 1693.72 650.686 1668.06 650.648L1562.66 650.457L1294.18 650.569C1229.3 650.36 1166.25 642.367 1109.31 677.354C1075.41 697.881 1051.07 731.066 1041.68 769.577C1024.74 841.175 1063.31 906.426 1099.22 965.078C1103.02 971.823 1114.46 985.726 1119.82 992.612C1140.88 1019.75 1162.84 1046.17 1185.68 1071.84C1264.51 1161.22 1337.81 1269.48 1345.12 1391.87C1355.92 1572.91 1205.73 1711.69 1031.77 1721.4C938.596 1726.86 847.128 1694.71 777.855 1632.13C733.34 1591.55 702.231 1538.38 688.665 1479.68C676.384 1428.85 679.574 1377.6 692.642 1327.29C710.038 1260.33 744.366 1197.92 785.127 1142.41C854.647 1047.73 998.351 921.921 991.042 795.526C987.346 731.658 941.997 680.383 882.362 660.534C837.4 645.57 776.985 650.524 728.979 650.558L429.507 650.401L351.229 650.568C319.765 650.635 286.204 651.2 255.381 644.239C194.201 631.235 150.38 605.052 104.113 565.316C-67.2929 418.104 -14.8418 150.672 172.337 43.4476C223.087 14.3754 266.379 3.16906 325.553 0.11436Z"} />
                </svg>
                <span {...S(`font-family: ${I($s0?.c?.titleFam)}; font-size: 15px; font-weight: 700`)}>
                  {"Talby"}
                </span>
              </span>
              <span {...S("flex: 1 1 auto")} />
              {A($s0?.footLinks).map((it, i) => {
                const $s1 = { ...$s0, "fl": it, $index: i };
                return (<React.Fragment key={i}>
                  {$s1?.fl?.isLink ? (<>
                    <a href={H($s1?.fl?.href)} className={"tt"} {...S(`color: ${I($s1?.c?.mutedFg)}; text-decoration: none; white-space: nowrap`)}>
                      {T($s1?.fl?.label)}
                    </a>
                  </>) : null}
                  {$s1?.fl?.plain ? (<>
                    <span {...S("white-space: nowrap")}>
                      {T($s1?.fl?.label)}
                    </span>
                  </>) : null}
                </React.Fragment>);
              })}
            </div>
          </>) : null}
          {$s0?.footStack ? (<>
            <div {...S(`width: 1200px; max-width: 100%; display: flex; flex-direction: column; align-items: flex-start; gap: 12px; font-size: 13px; color: ${I($s0?.c?.mutedFg)}`)}>
              <span {...S(`display: inline-flex; align-items: center; gap: 8px; color: ${I($s0?.c?.fg)}`)}>
                <svg width={"20"} height={"17"} viewBox={"0 0 2029 1722"} aria-hidden={"true"} {...S("display: block")}>
                  <path fill={"#1F7AE0"} d={"M325.553 0.11436C357.82 -0.851434 390.344 4.39925 421.577 12.1099C506.351 33.0387 579.306 92.8684 628.981 163.1C648.617 190.863 665.004 221.256 682.357 250.477C714.91 305.296 746.394 360.846 779.411 415.372C792.242 436.561 805.088 458.322 818.991 478.81C853.846 530.177 928.98 628.305 990.503 643.014C1013.94 648.615 1037.46 645.591 1058.97 634.725C1078.92 624.656 1094.72 608.763 1110.74 593.552C1184.16 523.869 1237.02 434.688 1287.42 347.839C1299.09 327.74 1311.38 307.989 1322.85 287.786C1346.79 245.624 1371.62 198.953 1400.03 160.003C1431.42 116.962 1467.92 79.9142 1513.59 51.9883C1592.43 3.35327 1687.5 -11.5536 1777.44 10.6178C1861.41 31.3662 1933.82 84.3529 1979.02 158.109C2024.53 233.037 2040.98 310.935 2019.97 397.268C1988.25 527.6 1882.9 628.138 1749.42 647.874C1724.27 651.594 1693.72 650.686 1668.06 650.648L1562.66 650.457L1294.18 650.569C1229.3 650.36 1166.25 642.367 1109.31 677.354C1075.41 697.881 1051.07 731.066 1041.68 769.577C1024.74 841.175 1063.31 906.426 1099.22 965.078C1103.02 971.823 1114.46 985.726 1119.82 992.612C1140.88 1019.75 1162.84 1046.17 1185.68 1071.84C1264.51 1161.22 1337.81 1269.48 1345.12 1391.87C1355.92 1572.91 1205.73 1711.69 1031.77 1721.4C938.596 1726.86 847.128 1694.71 777.855 1632.13C733.34 1591.55 702.231 1538.38 688.665 1479.68C676.384 1428.85 679.574 1377.6 692.642 1327.29C710.038 1260.33 744.366 1197.92 785.127 1142.41C854.647 1047.73 998.351 921.921 991.042 795.526C987.346 731.658 941.997 680.383 882.362 660.534C837.4 645.57 776.985 650.524 728.979 650.558L429.507 650.401L351.229 650.568C319.765 650.635 286.204 651.2 255.381 644.239C194.201 631.235 150.38 605.052 104.113 565.316C-67.2929 418.104 -14.8418 150.672 172.337 43.4476C223.087 14.3754 266.379 3.16906 325.553 0.11436Z"} />
                </svg>
                <span {...S(`font-family: ${I($s0?.c?.titleFam)}; font-size: 15px; font-weight: 700`)}>
                  {"Talby"}
                </span>
              </span>
              <div {...S(`display: flex; flex-wrap: wrap; align-items: center; column-gap: 20px; ${I($s0?.R?.footLinks)}`)}>
                {A($s0?.footLinks).map((it, i) => {
                  const $s1 = { ...$s0, "fl": it, $index: i };
                  return (<React.Fragment key={i}>
                    {$s1?.fl?.isLink ? (<>
                      <a href={H($s1?.fl?.href)} className={"tt"} {...S(`display: inline-flex; align-items: center; min-height: 36px; color: ${I($s1?.c?.mutedFg)}; text-decoration: none; white-space: nowrap`)}>
                        {T($s1?.fl?.label)}
                      </a>
                    </>) : null}
                    {$s1?.fl?.plain ? (<>
                      <span {...S("display: inline-flex; align-items: center; min-height: 36px; white-space: nowrap")}>
                        {T($s1?.fl?.label)}
                      </span>
                    </>) : null}
                  </React.Fragment>);
                })}
              </div>
            </div>
          </>) : null}
        </footer>
      </div>
  </>);
}

export const meta = {"props":{"tab":{"editor":"enum","options":["contract","deal","calendar","payment"],"default":"contract"},"theme":{"editor":"enum","options":["studio","sand","mac","stationery","editorial"],"default":"studio"}},"preview":{"width":1440,"height":4760}};
export default $r.defineBoard("SHome", Component, render, CSS, meta);
