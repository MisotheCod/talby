// @ts-nocheck
/* eslint-disable */
'use client';
// SAssistant: converted from design-source/boards/SAssistant.dc.html.
// Markup, inline styles and logic are carried over exactly from the board.
// The logic class below is the board's own code, unchanged.
import * as React from 'react';
import * as $r from './_runtime';
import { DCLogic } from './_runtime';


const CSS = "body, #dc-root{margin:0;font-synthesis:none}#dc-root .tb{transition:background-color .15s ease,color .15s ease,border-color .15s ease,box-shadow .2s ease,opacity .15s ease,transform .15s ease}#dc-root .tb:active{transform:scale(.96)}#dc-root .tg:hover{background-color:var(--hv)!important}#dc-root .tfab:hover{transform:translateY(-2px);box-shadow:0 18px 40px -14px rgba(0,0,0,.35)!important}#dc-root .tb:focus-visible{outline:2px solid var(--ring);outline-offset:2px}#dc-root .a-panel{animation:tPanel .26s cubic-bezier(.2,.8,.25,1) backwards;transform-origin:bottom right}#dc-root .a-msg{animation:tMsg .24s cubic-bezier(.2,.7,.2,1) backwards}#dc-root .a-dot{animation:tDot 1s ease-in-out infinite}#dc-root .a-fab{animation:tFab .4s cubic-bezier(.3,1.4,.5,1) backwards}@keyframes tPanel{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}@keyframes tMsg{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}@keyframes tDot{0%,100%{opacity:.25;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}@keyframes tFab{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){#dc-root *, #dc-root *::before, #dc-root *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}\n";

const Component = (() => {
class Component extends DCLogic {
  constructor(props) {
    super(props);
    var w = 1440; try { w = window.innerWidth || 1440; } catch (e) {}
    var seed = [];
    if (props.state === 'error') seed = [{ me: true, text: 'What payments are late?' }, { me: false, err: 'error', text: 'Talby could not answer that right now. Your data is fine. Try again in a moment.', retry: 'What payments are late?' }];
    if (props.state === 'limit') seed = [{ me: true, text: 'What is coming up this week?' }, { me: false, err: 'limit', text: 'You have asked a lot of questions today. Talby can answer more tomorrow morning.' }];
    if (props.state === 'offline') seed = [{ me: true, text: 'When does Dramamine pay?' }, { me: false, err: 'offline', text: 'You are offline. Talby will answer once you are back online.', retry: 'When does Dramamine pay?' }];
    this.state = { open: !props.embedded, msgs: seed, draft: '', typing: false, w: w };
    this.body = null;
  }
  componentDidMount() { var self = this; this._rs = function () { try { self.setState({ w: window.innerWidth }); } catch (e) {} }; try { window.addEventListener('resize', this._rs); } catch (e) {} }
  componentWillUnmount() { try { window.removeEventListener('resize', this._rs); } catch (e) {} clearTimeout(this._t); }
  ask(text) {
    var self = this, q = (text || '').trim(); if (!q || this.state.typing) return;
    this.setState({ open: true, msgs: this.state.msgs.concat([{ me: true, text: q }]), draft: '', typing: true });
    clearTimeout(this._t);
    this._t = setTimeout(function () {
      var fail = self.props.state && self.props.state !== 'normal' && !self._retried;
      if (fail) { var E = { error: 'Talby could not answer that right now. Your data is fine. Try again in a moment.', limit: 'You have asked a lot of questions today. Talby can answer more tomorrow morning.', offline: 'You are offline. Talby will answer once you are back online.' }; self.setState({ typing: false, msgs: self.state.msgs.concat([{ me: false, err: self.props.state, text: E[self.props.state], retry: self.props.state === 'limit' ? '' : q }]) }); return; }
      var a = self.answer(q); self.setState({ typing: false, msgs: self.state.msgs.concat([{ me: false, text: a.text, label: a.label, href: a.href }]) }); }, 900);
  }
  retry(q) { this._retried = true; this.setState({ msgs: this.state.msgs.filter(function (m) { return !m.err; }).slice(0, -1) }); var self = this; setTimeout(function () { self.ask(q); }, 0); }
  answer(q) {
    q = q.toLowerCase();
    if (this.props.empty) {
      if (/notion|import|csv|spreadsheet/.test(q)) return { text: 'Yes. Press Add deal, then Import from Notion or Upload a CSV. Talby matches your columns and brings every deal in. Nothing in Notion changes.' };
      if (/remind|notif/.test(q)) return { text: 'Talby reminds you before a post goes live and before money is due. Add a pay by date to a deal and the reminders turn on for it. You can change them in Settings.' };
      if (/help|what can|do you/.test(q)) return { text: 'Once your deals are in, I can tell you what is late, what is coming up, what a contract says and how much you have made. I only use what is in your account.' };
      if (/first deal|add a deal|get started|how do i|how does/.test(q)) return { text: 'There are a few ways to add a deal.\nPress Add deal at the top of any page to type it in, upload a contract or CSV, or import from Notion.' };
      return { text: 'You do not have any deals yet, so there is nothing to look at. Add your first deal and I can answer that.' };
    }
    if (/first deal|add a deal|get started|how do i|how does/.test(q)) return { text: 'There are a few ways to add a deal.\nPress Add deal at the top of any page to type it in, upload a contract or CSV, or import from Notion.' };
    if (/overdue|late|owe|unpaid|chase/.test(q)) return { text: 'Three payments are late, $29,050 in total.\nHaleon Centrum, $10,550, 16 days late.\nGolden Corral, $10,000, 9 days late.\nTums, $8,500, 3 days late.\nI can draft a reminder for each one so you can send it.', label: 'Open payments', href: 'SPayments.dc.html' };
    if (/dramamine/.test(q)) return { text: 'Dramamine is a $10,000 deal. Video 1 went up on Oct 13. It is not invoiced yet and has no pay by date. They also asked for a vendor form and your W9, which is on your to-do list.', label: 'Open the deal', href: 'SDeal.dc.html' };
    if (/cerave|contract/.test(q)) return { text: 'CeraVe is an $8,000 deal and your post goes up tomorrow, Oct 15. There is no pay by date yet. Add one after you post so Talby can remind you.', label: 'Open the deal', href: 'SDeal.dc.html' };
    if (/week|today|tomorrow|coming|next|due/.test(q)) return { text: 'Coming up:\nCeraVe post, tomorrow, Oct 15.\nNioxin payment, $1,200, due Oct 19.\nSprouts payment, $4,000, due Nov 5.', label: 'Open calendar', href: 'SCalendar.dc.html' };
    if (/august|month|made|earn|income|received|year|paid/.test(q)) return { text: 'You have received $46,150 so far this year from 14 payments. August was your best month with $17,000.', label: 'Open income summary', href: 'SIncome.dc.html' };
    return { text: 'Here is what I found for "' + q + '". I can answer questions about your deals, payments and contracts. Try asking what is late or what is coming up this week.' };
  }
  componentDidUpdate(prev, prevState) { var ps = prevState || this._prev || {}; this._prev = { msgs: this.state.msgs, typing: this.state.typing }; if (this.props.askId && this.props.askId !== prev.askId) this.ask(this.props.askText); if (this.body && (ps.msgs !== this.state.msgs || ps.typing !== this.state.typing)) { try { this.body.scrollTop = this.body.scrollHeight; } catch (e) {} } }
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
    var t = talby(p.color, dark), r = t.r; t.rTile = (r ? r + 4 : 0) + 'px'; t.hover = t.hv;
    var b = 'display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-sizing: border-box; font: inherit; font-weight: 500; line-height: 1; white-space: nowrap; border-radius: ' + t.rCtl + '; cursor: pointer; text-decoration: none; flex-shrink: 0';
    var k = {
      ico: b + '; width: 32px; height: 32px; padding: 0; border: none; background: transparent; color: ' + t.fg,
      icoP: b + '; width: 36px; height: 36px; padding: 0; border: none; background: ' + t.primary + '; color: ' + t.primaryFg + '; box-shadow: ' + t.btnSh,
      oSm: b + '; height: 30px; padding: 0 12px; font-size: 13px; border: 1px solid ' + t.border + '; background: ' + t.card + '; color: ' + t.fg,
      input: 'flex: 1 1 auto; height: 36px; min-width: 0; box-sizing: border-box; padding: 0 16px; border: none; border-radius: ' + t.rCtl + '; background: ' + t.fill + '; color: ' + t.fg + '; font: inherit; font-size: 14px; outline: none'
    };
    function answer(q) {
      q = q.toLowerCase();
      if (/first deal|add a deal|get started|how do i|how does/.test(q)) return { text: 'There are a few ways to add a deal.\nPress Add deal at the top of any page to type it in, upload a contract or CSV, or import from Notion.' };
      if (/overdue|late|owe|unpaid|chase/.test(q)) return { text: 'Three payments are late, $29,050 in total.\nHaleon Centrum, $10,550, 16 days late.\nGolden Corral, $10,000, 9 days late.\nTums, $8,500, 3 days late.\nI can draft a reminder for each one so you can send it.', label: 'Open payments', href: 'SPayments.dc.html' };
      if (/dramamine/.test(q)) return { text: 'Dramamine is a $10,000 deal. Video 1 went up on Oct 13. It is not invoiced yet and has no pay by date. They also asked for a vendor form and your W9, which is on your to-do list.', label: 'Open the deal', href: 'SDeal.dc.html' };
      if (/cerave|contract/.test(q)) return { text: 'CeraVe is an $8,000 deal and your post goes up tomorrow, Oct 15. There is no pay by date yet. Add one after you post so Talby can remind you.', label: 'Open the deal', href: 'SDeal.dc.html' };
      if (/week|today|tomorrow|coming|next|due/.test(q)) return { text: 'Coming up:\nCeraVe post, tomorrow, Oct 15.\nNioxin payment, $1,200, due Oct 19.\nSprouts payment, $4,000, due Nov 5.', label: 'Open calendar', href: 'SCalendar.dc.html' };
      if (/august|month|made|earn|income|received|year/.test(q)) return { text: 'You have received $46,150 so far this year from 14 payments. August was your best month with $17,000.', label: 'Open income summary', href: 'SIncome.dc.html' };
      return { text: 'I can answer questions about your deals, payments and contracts. Try asking what is late or what is coming up this week.' };
    }
    function ask(text) { self.ask(text); }
    var mob = st.w < 640, standalone = !p.embedded, open = st.open && !p.hidden;
    var hasDraft = !!(st.draft || '').trim();
    return {
      hiName: p.nameFirst || 'Chanelica', t: t, k: k, standalone: standalone, vars: '--hv: ' + t.hover + '; --ring: ' + t.ring, pos: standalone ? 'absolute' : 'fixed', edge: mob ? '16px' : '24px',
      showFab: !st.open && !p.hidden, fabLabel: !mob, fabPad: mob ? '0 11px' : '0 16px 0 12px',
      open: open,
      panelTop: mob ? '0px' : 'auto', panelLeft: mob ? '0px' : 'auto', panelRight: mob ? '0px' : '24px', panelBottom: mob ? '0px' : '24px',
      panelW: mob ? '100%' : '400px', panelH: mob ? '100%' : '620px', panelMaxH: mob ? '100%' : 'calc(100vh - 48px)',
      panelBorder: mob ? 'none' : ('1px solid ' + t.border), panelRadius: mob ? '0px' : t.rDialog,
      openChat: function () { self.setState({ open: true }); }, closeChat: function () { self.setState({ open: false }); },
      newChat: function () { clearTimeout(self._t); self.setState({ msgs: [], typing: false, draft: '' }); },
      bodyRef: function (el) { self.body = el; },
      empty: st.msgs.length === 0 && !st.typing,
      greetSub: p.empty ? 'Once you add a deal, I can answer from your contracts, dates and payments. For now, ask me how Talby works.' : 'Ask about payments, posts, contracts or what is due. Answers come from your Talby data.',
      suggest: (p.empty ? ['How do I add my first deal?', 'Can I import from Notion?', 'How do reminders work?', 'What can you help with?'] : ['What payments are late?', 'What is coming up this week?', 'When does Dramamine pay?', 'How much did I make in August?']).map(function (s, i) { return { label: s, delay: (0.05 + i * 0.05).toFixed(2) + 's', ask: function () { ask(s); } }; }),
      msgs: st.msgs.map(function (m) { var ic = { error: 'M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', limit: 'M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', offline: 'M12 20h.01M8.5 16.43a5 5 0 0 1 7 0M2 8.82a15 15 0 0 1 20 0M5 12.86a10 10 0 0 1 14 0' };
        return { text: m.text, align: m.me ? 'flex-end' : 'flex-start', maxW: m.me ? '85%' : '92%', bg: m.me ? t.primary : t.tile, fg: m.me ? t.primaryFg : t.fg, hasLink: !!m.href, href: m.href || '', linkLabel: m.label || '',
          isErr: !!m.err, notErr: !m.err, icon: ic[m.err] || '', icFg: m.err === 'error' ? t.destr : t.mutedFg, hasRetry: !!m.err && !!m.retry, retry: function () { self.retry(m.retry); } }; }),
      typing: st.typing, draft: st.draft, setDraft: function (e) { self.setState({ draft: e.target.value }); },
      draftKey: function (e) { if (e.key === 'Enter') ask(self.state.draft); }, send: function () { ask(self.state.draft); },
      noDraft: !hasDraft, sendOp: hasDraft ? '1' : '0.4'
    };
  }
}
return Component;
})();

function render($s0, host) {
  const { A, T, I, V0, S, HS, H } = $r;
  return (<>
      <div {...S(`font-family: ${I($s0?.t?.bodyFam)}; font-size: 14px; line-height: 1.45; color: ${I($s0?.t?.fg)}; -webkit-font-smoothing: antialiased; ${I($s0?.vars)}`)}>
        {$s0?.standalone ? (<>
          <div {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: ${I($s0?.t?.page)}`)} />
        </>) : null}
        {$s0?.showFab ? (<>
          <button type={"button"} className={"tb tfab a-fab"} onClick={$s0?.openChat} aria-label={"Ask Talby Assistant"} {...S(`position: ${I($s0?.pos)}; right: ${I($s0?.edge)}; bottom: ${I($s0?.edge)}; z-index: 70; display: inline-flex; align-items: center; gap: 8px; height: 44px; padding: ${I($s0?.fabPad)}; box-sizing: border-box; border: 1px solid ${I($s0?.t?.border)}; border-radius: 22px; background: ${I($s0?.t?.card)}; color: ${I($s0?.t?.fg)}; box-shadow: ${I($s0?.t?.shPop)}; font: inherit; font-size: 14px; font-weight: 500; white-space: nowrap; cursor: pointer`)}>
            <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.t?.accent} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
              <rect x={"3"} y={"8"} width={"15"} height={"12"} rx={"3.5"} />
              <path d={"M10.5 8V5.5"} />
              <circle cx={"10.5"} cy={"4.5"} r={"1"} />
              <circle cx={"8"} cy={"14"} r={"1"} fill={$s0?.t?.accent} stroke={"none"} />
              <circle cx={"13"} cy={"14"} r={"1"} fill={$s0?.t?.accent} stroke={"none"} />
              <path d={"M19.5 2l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8z"} fill={$s0?.t?.accent} stroke={"none"} />
            </svg>
            {$s0?.fabLabel ? (<>
              <span>
                {"Ask Talby"}
              </span>
            </>) : null}
          </button>
        </>) : null}
        {$s0?.open ? (<>
          <section role={"dialog"} aria-label={"Talby Assistant"} className={"a-panel"} {...S(`position: ${I($s0?.pos)}; top: ${I($s0?.panelTop)}; right: ${I($s0?.panelRight)}; bottom: ${I($s0?.panelBottom)}; left: ${I($s0?.panelLeft)}; z-index: 75; width: ${I($s0?.panelW)}; height: ${I($s0?.panelH)}; max-height: ${I($s0?.panelMaxH)}; box-sizing: border-box; display: flex; flex-direction: column; background: ${I($s0?.t?.card)}; color: ${I($s0?.t?.fg)}; border: ${I($s0?.panelBorder)}; border-radius: ${I($s0?.panelRadius)}; box-shadow: ${I($s0?.t?.shPop)}; overflow: hidden`)}>
            <div {...S(`display: flex; align-items: center; gap: 12px; padding: 14px 10px 14px 16px; border-bottom: 1px solid ${I($s0?.t?.line)}`)}>
              <span {...S(`width: 36px; height: 36px; flex: 0 0 36px; border-radius: 18px; background: ${I($s0?.t?.fill)}; display: inline-flex; align-items: center; justify-content: center`)}>
                <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.t?.accent} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <rect x={"3"} y={"8"} width={"15"} height={"12"} rx={"3.5"} />
                  <path d={"M10.5 8V5.5"} />
                  <circle cx={"10.5"} cy={"4.5"} r={"1"} />
                  <circle cx={"8"} cy={"14"} r={"1"} fill={$s0?.t?.accent} stroke={"none"} />
                  <circle cx={"13"} cy={"14"} r={"1"} fill={$s0?.t?.accent} stroke={"none"} />
                  <path d={"M19.5 2l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8z"} fill={$s0?.t?.accent} stroke={"none"} />
                </svg>
              </span>
              <div {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 1px")}>
                <span {...S("font-weight: 600; white-space: nowrap")}>
                  {"Talby Assistant"}
                </span>
                <span {...S(`font-size: 12px; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                  {"Knows your deals, payments and contracts"}
                </span>
              </div>
              <button type={"button"} className={"tb tg"} onClick={$s0?.newChat} aria-label={"New chat"} {...S($s0?.k?.ico)}>
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M12 20h9M16.38 3.62a1 1 0 0 1 3 3L7.37 18.64a2 2 0 0 1-.85.5l-2.87.84a.5.5 0 0 1-.62-.62l.84-2.87a2 2 0 0 1 .5-.85z"} />
                </svg>
              </button>
              <button type={"button"} className={"tb tg"} onClick={$s0?.closeChat} aria-label={"Close assistant"} {...S($s0?.k?.ico)}>
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M18 6 6 18M6 6l12 12"} />
                </svg>
              </button>
            </div>
            <div aria-live={"polite"} {...S("flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px", $s0?.bodyRef)}>
              {$s0?.empty ? (<>
                <div {...S("display: flex; flex-direction: column; gap: 6px; padding: 12px 4px 8px")}>
                  <span {...S("font-size: 18px; font-weight: 600; letter-spacing: -0.3px")}>
                    {"Hi "}{T($s0?.hiName)}{". What do you want to know?"}
                  </span>
                  <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                    {T($s0?.greetSub)}
                  </span>
                </div>
                <div {...S("display: flex; flex-direction: column; gap: 6px")}>
                  {A($s0?.suggest).map((it, i) => {
                    const $s1 = { ...$s0, "s": it, $index: i };
                    return (<React.Fragment key={i}>
                      <button type={"button"} className={"tb tg a-msg"} onClick={$s1?.s?.ask} {...S(`animation-delay: ${I($s1?.s?.delay)}; display: flex; align-items: center; gap: 10px; width: 100%; height: 40px; padding: 0 14px; box-sizing: border-box; border: 1px solid ${I($s1?.t?.border)}; border-radius: ${I($s1?.t?.rCtl)}; background: ${I($s1?.t?.card)}; color: ${I($s1?.t?.fg)}; font: inherit; font-size: 14px; text-align: left; white-space: nowrap; overflow: hidden; cursor: pointer`)}>
                        <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s1?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 14px")}>
                          <path d={"M5 12h14M12 5l7 7-7 7"} />
                        </svg>
                        <span {...S("overflow: hidden; text-overflow: ellipsis")}>
                          {T($s1?.s?.label)}
                        </span>
                      </button>
                    </React.Fragment>);
                  })}
                </div>
              </>) : null}
              {A($s0?.msgs).map((it, i) => {
                const $s1 = { ...$s0, "m": it, $index: i };
                return (<React.Fragment key={i}>
                  <div className={"a-msg"} {...S(`display: flex; flex-direction: column; gap: 8px; align-self: ${I($s1?.m?.align)}; max-width: ${I($s1?.m?.maxW)}`)}>
                    {$s1?.m?.notErr ? (<>
                      <div {...S(`padding: 10px 14px; border-radius: ${I($s1?.t?.rTile)}; background: ${I($s1?.m?.bg)}; color: ${I($s1?.m?.fg)}; white-space: pre-line`)}>
                        {T($s1?.m?.text)}
                      </div>
                    </>) : null}
                    {$s1?.m?.isErr ? (<>
                      <div {...S(`display: flex; align-items: flex-start; gap: 10px; padding: 10px 14px; border-radius: ${I($s1?.t?.rTile)}; background: ${I($s1?.t?.tile)}; color: ${I($s1?.t?.fg)}`)}>
                        <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`flex: 0 0 16px; margin-top: 2px; color: ${I($s1?.m?.icFg)}`)}>
                          <path d={$s1?.m?.icon} />
                        </svg>
                        <span {...S("white-space: pre-line")}>
                          {T($s1?.m?.text)}
                        </span>
                      </div>
                    </>) : null}
                    {$s1?.m?.hasRetry ? (<>
                      <button type={"button"} className={"tb tg"} onClick={$s1?.m?.retry} {...S(`align-self: flex-start; ${I($s1?.k?.oSm)}`)}>
                        {"Try again"}
                      </button>
                    </>) : null}
                    {$s1?.m?.hasLink ? (<>
                      <a href={H($s1?.m?.href)} className={"tb tg"} {...S(`align-self: flex-start; ${I($s1?.k?.oSm)}`)}>
                        {T($s1?.m?.linkLabel)}
                        <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M5 12h14M12 5l7 7-7 7"} />
                        </svg>
                      </a>
                    </>) : null}
                  </div>
                </React.Fragment>);
              })}
              {$s0?.typing ? (<>
                <div role={"status"} aria-label={"Talby is answering"} {...S(`align-self: flex-start; display: inline-flex; align-items: center; gap: 5px; height: 40px; padding: 0 16px; box-sizing: border-box; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.tile)}`)}>
                  <span className={"a-dot"} {...S(`width: 6px; height: 6px; border-radius: 3px; background: ${I($s0?.t?.mutedFg)}`)} />
                  <span className={"a-dot"} {...S(`width: 6px; height: 6px; border-radius: 3px; background: ${I($s0?.t?.mutedFg)}; animation-delay: 0.15s`)} />
                  <span className={"a-dot"} {...S(`width: 6px; height: 6px; border-radius: 3px; background: ${I($s0?.t?.mutedFg)}; animation-delay: 0.3s`)} />
                </div>
              </>) : null}
            </div>
            <div {...S(`display: flex; flex-direction: column; gap: 8px; padding: 12px 16px 14px; border-top: 1px solid ${I($s0?.t?.line)}`)}>
              <div {...S("display: flex; align-items: center; gap: 8px")}>
                <input aria-label={"Ask Talby a question"} placeholder={"Ask about a deal or payment"} value={V0($s0?.draft, "")} onChange={$s0?.setDraft} onKeyDown={$s0?.draftKey} {...S($s0?.k?.input)} />
                <button type={"button"} className={"tb"} onClick={$s0?.send} aria-label={"Send"} aria-disabled={$s0?.noDraft} {...S(`opacity: ${I($s0?.sendOp)}; ${I($s0?.k?.icoP)}`)}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M12 19V5M5 12l7-7 7 7"} />
                  </svg>
                </button>
              </div>
              <span {...S(`font-size: 12px; color: ${I($s0?.t?.mutedFg)}; text-align: center`)}>
                {"Talby can get things wrong. Check anything important."}
              </span>
            </div>
          </section>
        </>) : null}
      </div>
  </>);
}

export const meta = {"props":{"nameFirst":{"editor":"text","default":"Chanelica"},"empty":{"editor":"boolean","default":false},"state":{"editor":"enum","options":["normal","error","limit","offline"],"default":"normal"},"color":{"editor":"enum","options":["studio","sand","mac","stationery","editorial"],"default":"studio"},"dark":{"editor":"boolean","default":false},"embedded":{"editor":null},"hidden":{"editor":null},"askId":{"editor":null},"askText":{"editor":null}},"preview":{"width":480,"height":720}};
export default $r.defineBoard("SAssistant", Component, render, CSS, meta);
