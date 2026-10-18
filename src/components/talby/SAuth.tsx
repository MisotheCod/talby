// @ts-nocheck
/* eslint-disable */
'use client';
// SAuth: converted from design-source/boards/SAuth.dc.html.
// Markup, inline styles and logic are carried over exactly from the board.
// The logic class below is the board's own code, unchanged.
import * as React from 'react';
import * as $r from './_runtime';
import { DCLogic } from './_runtime';
import * as TalbyAuth from './_auth';


const CSS = "body, #dc-root{margin:0;font-synthesis:none}#dc-root .tb{transition:background-color .15s ease,color .15s ease,border-color .15s ease,box-shadow .18s ease,opacity .15s ease,transform .12s ease}#dc-root .tb:active{transform:scale(.97)}#dc-root .tg:hover{background-color:var(--hv)!important}#dc-root .tp:hover{opacity:.88}#dc-root .tr{transition:background-color .12s ease}#dc-root .tr:hover{background-color:var(--hvr)!important}#dc-root .tt:hover{color:var(--fg)!important}#dc-root .tc{transition:border-color .18s ease,box-shadow .2s ease,transform .2s ease}#dc-root .tc:hover{border-color:var(--bd2)!important;box-shadow:var(--shh)!important}#dc-root .tlift:hover{transform:translateY(-2px)}#dc-root .ti{transition:box-shadow .15s ease}#dc-root .ti:focus, #dc-root .ti:focus-within{box-shadow:0 0 0 2px var(--ring)!important}#dc-root .tb:focus-visible, #dc-root .tc:focus-visible, #dc-root .tr:focus-visible{outline:2px solid var(--ring);outline-offset:2px}#dc-root .a-in{animation:tIn .36s cubic-bezier(.2,.7,.2,1) backwards}#dc-root .a-fade{animation:tFade .2s ease backwards}#dc-root .a-pop{animation:tPop .22s cubic-bezier(.2,.8,.3,1) backwards}#dc-root .a-drop{animation:tDrop .16s cubic-bezier(.2,.8,.3,1) backwards}#dc-root .a-sheet{animation:tSheet .3s cubic-bezier(.2,.8,.2,1) backwards}#dc-root .a-drawer{animation:tDrawer .26s cubic-bezier(.2,.8,.2,1) backwards}#dc-root .a-up{animation:tUp .3s cubic-bezier(.2,.8,.2,1) backwards}#dc-root .a-toast{animation:tToast .3s cubic-bezier(.2,.9,.3,1.1) backwards}#dc-root .a-spin{animation:tSpin .8s linear infinite}#dc-root .a-pulse{animation:tPulse 1.6s ease-in-out infinite}#dc-root .a-ping{animation:tPing 2s ease-out infinite}#dc-root .a-check{animation:tCheck .38s cubic-bezier(.3,1.5,.5,1) backwards}#dc-root .a-strike{animation:tStrike .45s cubic-bezier(.4,0,.2,1) backwards}#dc-root .a-grow{animation:tGrow .6s cubic-bezier(.2,.8,.2,1) backwards;transform-origin:bottom center}#dc-root .a-width{animation:tWidth .7s cubic-bezier(.2,.8,.2,1) backwards;transform-origin:left center}#dc-root .a-out{animation:tOut .32s ease forwards}#dc-root .a-gone{animation:tOut .35s ease .55s forwards}#dc-root [style*=\"scrollbar-width: none\"]::-webkit-scrollbar{display:none}@keyframes tIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes tFade{from{opacity:0}to{opacity:1}}@keyframes tPop{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}@keyframes tDrop{from{opacity:0;transform:translateY(-4px) scale(.98)}to{opacity:1;transform:none}}@keyframes tSheet{from{opacity:0;transform:translateX(36px)}to{opacity:1;transform:none}}@keyframes tDrawer{from{transform:translateX(-100%)}to{transform:none}}@keyframes tUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}@keyframes tToast{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}@keyframes tSpin{to{transform:rotate(360deg)}}@keyframes tPulse{0%,100%{opacity:1}50%{opacity:.35}}@keyframes tPing{0%{box-shadow:0 0 0 0 rgba(239,68,68,.5)}70%,100%{box-shadow:0 0 0 6px rgba(239,68,68,0)}}@keyframes tCheck{0%{transform:scale(.6)}55%{transform:scale(1.18)}100%{transform:scale(1)}}@keyframes tStrike{from{background-size:0% 1.5px}to{background-size:100% 1.5px}}@keyframes tGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}@keyframes tWidth{from{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes tOut{from{opacity:1;transform:none}to{opacity:0;transform:translateX(16px)}}@media (prefers-reduced-motion:reduce){#dc-root *, #dc-root *::before, #dc-root *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}#dc-root .tz{transition:background-color .15s ease,border-color .15s ease}#dc-root .tz:hover{background-color:var(--hvz)!important;border-color:var(--bd2)!important}#dc-root input[type=range]{accent-color:var(--acc)}\n";

const Component = (() => {
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = Object.assign({ mode: props.mode || 'login', email: props.mode && props.mode !== 'login' && props.mode !== 'signup' && props.mode !== 'forgot' ? 'juno@example.com' : '', pw: '', code: '', show: false, busy: false, err: '', tried: false, cool: 0, k: props.still ? 6 : 1, w: 0, sys: false }, this.errState(props.err));
  }
  errState(e) {
    if (e === 'wrong') return { err: 'wrong', email: 'juno@example.com', pw: 'hunter22', tried: true };
    if (e === 'taken') return { err: 'taken', email: 'juno@example.com', pw: 'longenough', tried: true };
    if (e === 'weak') return { err: '', email: 'juno@example.com', pw: 'short', tried: true };
    if (e === 'offline') return { err: 'offline', email: 'juno@example.com', pw: 'hunter22', tried: true };
    if (e === 'badcode') return { err: 'badcode', code: '481920', tried: true };
    return {};
  }
  componentDidMount() {
    var self = this;
    this._rs = function () { try { self.setState({ w: window.innerWidth }); } catch (e) {} };
    this._rs();
    try { window.addEventListener('resize', this._rs); } catch (e) {}
    try { this._mq = window.matchMedia('(prefers-color-scheme: dark)'); this._mqf = function () { self.setState({ sys: self._mq.matches }); }; this._mqf(); if (this._mq.addEventListener) this._mq.addEventListener('change', this._mqf); } catch (e) {}
    // The reset link lands here. If it is old or used, show the expired screen.
    if ((this.props.mode || 'login') === 'reset') this.checkReset().then(function (r) { if (r && r.error === 'expired') self.setState({ mode: 'expired' }); }, function () {});
    // The story on the right plays one step at a time, holds on Paid, then starts over.
    if (!this.props.still) this._tk = setInterval(function () { var k = self.state.k; self.setState({ k: k >= 9 ? 1 : k + 1 }); }, 1300);
  }
  componentDidUpdate(prev) {
    var p = this.props;
    if (prev.mode !== p.mode || prev.err !== p.err) this.setState(Object.assign({ mode: p.mode || 'login', err: '', tried: false, busy: false }, this.errState(p.err)));
  }
  componentWillUnmount() { try { window.removeEventListener('resize', this._rs); if (this._mq && this._mq.removeEventListener) this._mq.removeEventListener('change', this._mqf); } catch (e) {} clearInterval(this._tk); clearInterval(this._cd); }
  // Auth calls. The app replaces these with Supabase (see the port). Each resolves {} or { error: 'wrong' | 'taken' | 'weak' | 'offline' | 'badcode' | 'expired' }.
  signIn(email, pw) { return TalbyAuth.auth().signIn(email, pw); }
  signUp(email, pw) { return TalbyAuth.auth().signUp(email, pw); }
  sendReset(email) { return TalbyAuth.auth().sendReset(email); }
  setPassword(pw) { return TalbyAuth.auth().setPassword(pw); }
  verifyCode(email, code) { return TalbyAuth.auth().verifyCode(email, code); }
  resend(kind, email) { var a = TalbyAuth.auth(); var r = kind === 'reset' ? a.sendReset(email) : kind === 'code' ? a.sendCode(email) : a.resendConfirm(email); return r.then(function (x) { if (x && x.error) throw x; return x; }); }
  sendCode(email) { return TalbyAuth.auth().sendCode(email); }
  checkReset() { return TalbyAuth.auth().checkReset(); }
  isStandalone() { var sp = this.props.standalone; if (sp === 'yes' || sp === true) return true; if (sp === 'no' || sp === false) return false; try { return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true; } catch (e) { return false; } }
  goTo(board) { try { var to = $r.H(board); if (board === 'SOverview.dc.html') to = TalbyAuth.nextPath(to); window.location.assign(to); } catch (e) {} }
  cooldown() {
    var self = this; clearInterval(this._cd); this.setState({ cool: 30 });
    this._cd = setInterval(function () { var c = self.state.cool - 1; self.setState({ cool: Math.max(0, c) }); if (c <= 0) clearInterval(self._cd); }, 1000);
  }
  renderVals() {
    var self = this, p = this.props, st = this.state;
    var vw = p.vw && p.vw !== 'auto' ? +p.vw : 0, W = vw || st.w || 1440, phone = W < 820;
    var dark = p.theme === 'dark' || (p.theme !== 'light' && st.sys);
    var t = dark
      ? { page: '#0A0A0A', card: '#161616', tile: '#141414', fill: '#262626', fg: '#FAFAFA', mutedFg: '#A3A3A3', border: '#2A2A2A', borderStrong: '#3D3D3D', line: '#242424', off: '#333333', destr: '#F87171', badBg: '#3A1616', badFg: '#FCA5A5', okBg: '#0F2A1A', okFg: '#4ADE80', warnBg: '#33240C', warnFg: '#FBBF24', primary: '#FAFAFA', primaryFg: '#0A0A0A', ring: 'rgba(250,250,250,0.35)', hv: '#262626' }
      : { page: '#FFFFFF', card: '#FFFFFF', tile: '#F5F5F5', fill: '#F5F5F5', fg: '#0A0A0A', mutedFg: '#737373', border: '#E5E5E5', borderStrong: '#D4D4D4', line: '#EEEEEE', off: '#E2E2E2', destr: '#DC2626', badBg: '#FDECEC', badFg: '#B91C1C', okBg: '#E9F8EE', okFg: '#15803D', warnBg: '#FEF4E2', warnFg: '#B45309', primary: '#171717', primaryFg: '#FFFFFF', ring: 'rgba(23,23,23,0.22)', hv: '#F5F5F5' };
    t.bodyFam = 'Geist, ui-sans-serif, system-ui, -apple-system, sans-serif'; t.titleFam = 'Inter, ui-sans-serif, system-ui, sans-serif'; t.monoFam = "'DM Mono', ui-monospace, SFMono-Regular, monospace";
    var I = { mail: 'M4 5h16v14H4zM4 7l8 6 8-6', lock: 'M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4', check: 'M20 6 9 17l-5-5', clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
      eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', eyeOff: 'M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.6 9.6 0 0 0 5.4-1.6',
      file: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6', spark: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z', video: 'M15 10l5-3v10l-5-3zM3 6h12v12H3z', bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0', dot: 'M12 12h.01' };
    var mode = st.mode, email = (st.email || '').trim(), pw = st.pw || '', code = (st.code || '').replace(/\D/g, '');
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), needLong = mode === 'signup' || mode === 'reset', pwOk = needLong ? pw.length >= 8 : pw.length > 0;
    var M = {
      login: { title: 'Log in', sub: 'New to Talby?', sw: ['Create an account', 'AuSignup.dc.html'], form: true, em: true, pwd: true, forgot: true, btn: 'Log in', terms: true },
      signup: { title: 'Create your account', sub: 'Already have one?', sw: ['Log in', 'AuLogin.dc.html'], form: true, em: true, pwd: true, rule: true, btn: 'Create account', terms: true },
      confirm: { icon: I.mail, title: 'Check your email', sub: 'Tap the link we sent to ', subEmail: true, resend: ['confirm', 'No email after a minute? Check spam, or', 'Send it again'], back: true },
      forgot: { title: 'Reset your password', sub: 'Enter the email you signed up with. We will send you a link to set a new password.', form: true, em: true, btn: 'Send reset link', back: true },
      sent: { icon: I.mail, title: 'Check your email', sub: 'If there is a Talby account for this address, a reset link is on its way to ', subEmail: true, resend: ['reset', 'The link works for 1 hour. No email?', 'Send it again'], back: true },
      reset: { icon: I.lock, title: 'Set a new password', sub: 'Pick something you have not used here before.', form: true, pwd: true, rule: true, newPw: true, btn: 'Save password' },
      done: { icon: I.check, ok: true, title: 'Password updated', sub: 'You are logged in with your new password.', go: ['Go to Talby', 'SOverview.dc.html'] },
      expired: { icon: I.clock, warn: true, title: 'This link has expired', sub: 'Reset links work for 1 hour and only once. Send yourself a new one.', go: ['Send a new link', 'AuForgot.dc.html'], back: true },
      code: { icon: I.mail, title: 'Enter your code', sub: 'We sent a 6 digit code to ', subEmail: true, form: true, codeIn: true, btn: 'Log in', resend: ['code', 'No code?', 'Send a new one'], back: true }
    }[mode] || {};
    var E = {
      wrong: ['That email and password do not match.', 'Reset your password', 'AuForgot.dc.html'],
      taken: ['There is already a Talby account with this email.', 'Log in instead', 'AuLogin.dc.html'],
      offline: ['Talby could not reach the server. Check your connection and try again.'],
      badcode: ['That code is not right, or it has expired. Check the newest email from Talby.'],
      expired: ['This link has expired.', 'Send a new link', 'AuForgot.dc.html'],
      same: ['Pick a password you have not used on Talby before.'],
      weak: ['That password is too easy to guess. Try a longer one.'],
      nouser: ['There is no Talby account for this email.', 'Create an account', 'AuSignup.dc.html'],
      rate: ['Too many tries. Wait a minute, then try again.'],
      failed: ['Something went wrong. Try again.']
    };
    var fieldErr = st.tried && M.form ? (M.em && !emailOk ? (email ? 'That email does not look right.' : 'Enter your email address.') : (M.pwd && !pwOk ? (needLong ? 'Use at least 8 characters.' : 'Enter your password.') : (M.codeIn && code.length !== 6 ? 'Enter all 6 digits.' : ''))) : '';
    var ER = st.err ? (E[st.err] || E.failed) : (fieldErr ? [fieldErr] : null);
    function done(r, next) { r = r || {}; if (r.error) { self.setState({ busy: false, err: r.error }); return; } self.setState({ busy: false, err: '' }); next(); }
    function fail() { self.setState({ busy: false, err: 'offline' }); }
    function submit(e) {
      if (e && e.preventDefault) e.preventDefault();
      if (st.busy) return;
      self.setState({ tried: true, err: '' });
      var bad = (M.em && !emailOk) || (M.pwd && !pwOk) || (M.codeIn && code.length !== 6);
      if (bad) return;
      self.setState({ busy: true });
      var go = function (b) { return function () { self.goTo(b); }; }, to = function (m) { return function () { self.setState({ mode: m, pw: '', tried: false }); if (m === 'sent' || m === 'confirm') self.cooldown(); }; };
      var call = mode === 'login' ? self.signIn(email, pw).then(function (r) { done(r, go('SOverview.dc.html')); })
        : mode === 'signup' ? self.signUp(email, pw).then(function (r) { done(r, r && r.session ? go('SOnboard.dc.html') : to('confirm')); })
        : mode === 'forgot' ? self.sendReset(email).then(function (r) { done(r, to('sent')); })
        : mode === 'reset' ? self.setPassword(pw).then(function (r) { done(r, to('done')); })
        : self.verifyCode(email, code).then(function (r) { done(r, go('SOverview.dc.html')); });
      call.catch(fail);
    }
    // The story: one real looking deal, from contract to paid.
    var S = [
      [I.file, 'Contract uploaded', 'Oct 2', 'You drop in the PDF the brand sent.'],
      [I.spark, 'Talby fills in the deal', 'Oct 2', 'Brand, $5,500, 1 Reel and 3 Stories, paid Net 30.'],
      [I.video, 'Your Reel goes live', 'Oct 20', 'Payment is now due Nov 19. It goes on your calendar.'],
      [I.bell, 'The payment is late', 'Nov 22', 'Talby flags it and writes the follow up for you.', '3 days late', 'bad'],
      [I.check, 'Paid', 'Nov 24', 'It moves to Received this year. Nothing slipped.', '+$5,500', 'ok']
    ];
    var shownN = Math.min(5, st.k);
    var story = S.map(function (x, i) {
      var on = i < shownN, last = i === 4, late = x[5] === 'bad', paid = x[5] === 'ok';
      return { icon: x[0], title: x[1], date: x[2], sub: x[3], op: on ? '1' : '0.3', hasLine: !last, lineBg: i < shownN - 1 ? t.fg : t.off,
        dotBg: on ? (late ? t.badBg : (paid ? t.okBg : t.primary)) : t.fill, dotFg: on ? (late ? t.badFg : (paid ? t.okFg : t.primaryFg)) : t.mutedFg,
        hasChip: !!x[4], chipOp: on ? '1' : '0', chipSc: on ? '1' : '0.9', chip: x[4] || '', chipBg: late ? t.badBg : t.okBg, chipFg: late ? t.badFg : t.okFg };
    });
    var signupish = mode === 'signup';
    var btnOff = !!st.busy;
    var cool = st.cool || 0;
    return {
      t: t, minH: vw ? (phone ? '844px' : '900px') : '100vh', gap: phone ? '0' : '16px', pad: phone ? '0' : '16px',
      vars: '--hv: ' + t.hv + '; --fg: ' + t.fg + '; --ring: ' + t.ring,
      logoPad: phone ? '20px 20px 0' : '12px 14px', mainPad: phone ? '56px 20px 48px' : '32px 24px', mainAlign: phone ? 'flex-start' : 'center',
      h1Fs: phone ? '28px' : '32px',
      hasIcon: !!M.icon, icon: M.icon || '', iconBg: M.ok ? t.okBg : (M.warn ? t.warnBg : t.fill), iconFg: M.ok ? t.okFg : (M.warn ? t.warnFg : t.fg),
      title: M.title, sub: M.sub, hasSubEmail: !!M.subEmail, email: st.email, hasSwitch: !!M.sw, switchLabel: M.sw ? M.sw[0] : '', switchHref: M.sw ? M.sw[1] : '',
      hasErr: !!ER, errText: ER ? ER[0] : '', hasErrLink: !!(ER && ER[1]), errLink: ER && ER[1] || '', errHref: ER && ER[2] || '',
      hasForm: !!M.form, submit: submit, showEmail: !!M.em, showPw: !!M.pwd, showForgot: !!M.forgot, showCode: !!M.codeIn, showRule: !!M.rule,
      setEmail: function (e) { self.setState({ email: e.target.value, err: '' }); }, setPw: function (e) { self.setState({ pw: e.target.value, err: '' }); },
      setCode: function (e) { self.setState({ code: e.target.value.replace(/\D/g, '').slice(0, 6), err: '' }); },
      pw: st.pw, code: st.code, pwLabel: M.newPw ? 'New password' : 'Password', pwType: st.show ? 'text' : 'password', pwAuto: M.newPw || signupish ? 'new-password' : 'current-password', pwPh: needLong ? 'At least 8 characters' : '',
      togglePw: function () { self.setState({ show: !st.show }); }, eye: st.show ? I.eyeOff : I.eye, pwEyeLabel: st.show ? 'Hide password' : 'Show password',
      ruleIcon: pw.length >= 8 ? I.check : I.dot, ruleFg: pw.length >= 8 ? t.okFg : (st.tried && needLong ? t.destr : t.mutedFg),
      emailBad: st.tried && M.em && !emailOk ? 'true' : 'false', pwBad: st.tried && M.pwd && !pwOk ? 'true' : 'false',
      emailBd: (st.tried && M.em && !emailOk) || st.err === 'taken' ? t.destr : t.border, pwBd: (st.tried && M.pwd && !pwOk) || st.err === 'wrong' ? t.destr : t.border, codeBd: (st.tried && code.length !== 6) || st.err === 'badcode' ? t.destr : t.border,
      btn: st.busy ? (mode === 'forgot' ? 'Sending' : mode === 'reset' ? 'Saving' : mode === 'signup' ? 'Creating account' : 'Logging in') : M.btn, busy: !!st.busy, busyAttr: st.busy ? 'true' : 'false', btnOff: btnOff, btnOp: btnOff ? '0.7' : '1',
      hasGo: !!M.go, goLabel: M.go ? M.go[0] : '', goHref: M.go ? M.go[1] : '',
      hasResend: !!M.resend, resendLead: M.resend ? M.resend[1] : '', resendLabel: cool > 0 ? 'Sent. You can send again in ' + cool + 's' : (M.resend ? M.resend[2] : ''), resendOff: cool > 0, resendFg: cool > 0 ? t.mutedFg : t.fg,
      resend: function () { if (self.state.cool > 0) return; self.resend(M.resend[0], email).then(function () { self.cooldown(); }, function () { self.setState({ err: 'offline' }); }); },
      hasBack: !!M.back, hasTerms: !!M.terms,
      // Opened from the Home Screen: email links open Safari, so offer a code too.
      showCodeAlt: mode === 'login' && this.isStandalone(),
      useCode: function () { self.setState({ tried: true, err: '' }); if (!emailOk) return; self.setState({ busy: true }); self.sendCode(email).then(function (r) { done(r, function () { self.setState({ mode: 'code', pw: '', code: '', tried: false }); self.cooldown(); }); }, fail); },
      showStory: !phone, story: story,
      storyTitle: signupish ? 'Know who owes you, and when.' : 'Every deal, from contract to paid.',
      storySub: 'Here is one brand deal in Talby, from the contract to the money in your account.',
      storyFoot: 'No spreadsheet. No digging through DMs for the contract.'
    };
  }
}
return Component;
})();

function render($s0, host) {
  const { A, T, I, V0, S, HS, H } = $r;
  return (<>
      <div {...S(`position: relative; box-sizing: border-box; min-height: ${I($s0?.minH)}; display: flex; align-items: stretch; gap: ${I($s0?.gap)}; padding: ${I($s0?.pad)}; background: ${I($s0?.t?.page)}; color: ${I($s0?.t?.fg)}; font-family: ${I($s0?.t?.bodyFam)}; font-size: 14px; line-height: 1.43; -webkit-font-smoothing: antialiased; ${I($s0?.vars)}`)}>
        <div {...S("flex: 1 1 0; min-width: 0; display: flex; flex-direction: column")}>
          <a href={H("SHome.dc.html")} aria-label={"Talby home"} className={"tb"} {...S(`align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; padding: ${I($s0?.logoPad)}; color: ${I($s0?.t?.fg)}; text-decoration: none`)}>
            <svg width={"28"} height={"24"} viewBox={"0 0 2029 1722"} aria-hidden={"true"} {...S("display: block")}>
              <path fill={"#1F7AE0"} d={"M325.553 0.11436C357.82 -0.851434 390.344 4.39925 421.577 12.1099C506.351 33.0387 579.306 92.8684 628.981 163.1C648.617 190.863 665.004 221.256 682.357 250.477C714.91 305.296 746.394 360.846 779.411 415.372C792.242 436.561 805.088 458.322 818.991 478.81C853.846 530.177 928.98 628.305 990.503 643.014C1013.94 648.615 1037.46 645.591 1058.97 634.725C1078.92 624.656 1094.72 608.763 1110.74 593.552C1184.16 523.869 1237.02 434.688 1287.42 347.839C1299.09 327.74 1311.38 307.989 1322.85 287.786C1346.79 245.624 1371.62 198.953 1400.03 160.003C1431.42 116.962 1467.92 79.9142 1513.59 51.9883C1592.43 3.35327 1687.5 -11.5536 1777.44 10.6178C1861.41 31.3662 1933.82 84.3529 1979.02 158.109C2024.53 233.037 2040.98 310.935 2019.97 397.268C1988.25 527.6 1882.9 628.138 1749.42 647.874C1724.27 651.594 1693.72 650.686 1668.06 650.648L1562.66 650.457L1294.18 650.569C1229.3 650.36 1166.25 642.367 1109.31 677.354C1075.41 697.881 1051.07 731.066 1041.68 769.577C1024.74 841.175 1063.31 906.426 1099.22 965.078C1103.02 971.823 1114.46 985.726 1119.82 992.612C1140.88 1019.75 1162.84 1046.17 1185.68 1071.84C1264.51 1161.22 1337.81 1269.48 1345.12 1391.87C1355.92 1572.91 1205.73 1711.69 1031.77 1721.4C938.596 1726.86 847.128 1694.71 777.855 1632.13C733.34 1591.55 702.231 1538.38 688.665 1479.68C676.384 1428.85 679.574 1377.6 692.642 1327.29C710.038 1260.33 744.366 1197.92 785.127 1142.41C854.647 1047.73 998.351 921.921 991.042 795.526C987.346 731.658 941.997 680.383 882.362 660.534C837.4 645.57 776.985 650.524 728.979 650.558L429.507 650.401L351.229 650.568C319.765 650.635 286.204 651.2 255.381 644.239C194.201 631.235 150.38 605.052 104.113 565.316C-67.2929 418.104 -14.8418 150.672 172.337 43.4476C223.087 14.3754 266.379 3.16906 325.553 0.11436Z"} />
            </svg>
            <span {...S(`font-family: ${I($s0?.t?.titleFam)}; font-size: 20px; font-weight: 600; letter-spacing: -0.4px`)}>
              {"Talby"}
            </span>
          </a>
          <main {...S(`flex: 1 1 auto; display: flex; align-items: ${I($s0?.mainAlign)}; justify-content: center; padding: ${I($s0?.mainPad)}`)}>
            <div className={"a-in"} {...S("width: 100%; max-width: 380px; display: flex; flex-direction: column; gap: 24px")}>
              {$s0?.hasIcon ? (<>
                <span aria-hidden={"true"} className={"a-pop"} {...S(`width: 48px; height: 48px; border-radius: 14px; background: ${I($s0?.iconBg)}; color: ${I($s0?.iconFg)}; display: inline-flex; align-items: center; justify-content: center`)}>
                  <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={$s0?.icon} />
                  </svg>
                </span>
              </>) : null}
              <div {...S("display: flex; flex-direction: column; gap: 8px")}>
                <h1 {...S(`margin: 0; font-family: ${I($s0?.t?.titleFam)}; font-size: ${I($s0?.h1Fs)}; font-weight: 600; letter-spacing: -0.8px; line-height: 1.15`)}>
                  {T($s0?.title)}
                </h1>
                <p {...S(`margin: 0; font-size: 15px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}`)}>
                  {T($s0?.sub)}
                  {$s0?.hasSubEmail ? (<>
                    <span {...S(`font-weight: 500; color: ${I($s0?.t?.fg)}`)}>
                      {T($s0?.email)}
                    </span>
                    {"."}
                  </>) : null}
                  {$s0?.hasSwitch ? (<>
                    {" "}
                    <a href={H($s0?.switchHref)} className={"tb tt"} {...S(`color: ${I($s0?.t?.fg)}; font-weight: 500; text-decoration: underline; text-underline-offset: 3px`)}>
                      {T($s0?.switchLabel)}
                    </a>
                  </>) : null}
                </p>
              </div>
              {$s0?.hasErr ? (<>
                <div role={"alert"} className={"a-fade"} {...S(`display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 10px; background: ${I($s0?.t?.badBg)}; color: ${I($s0?.t?.badFg)}; font-size: 13px; line-height: 1.45`)}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 16px; margin-top: 1px")}>
                    <path d={"M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"} />
                  </svg>
                  <span>
                    {T($s0?.errText)}
                    {$s0?.hasErrLink ? (<>
                      {" "}
                      <a href={H($s0?.errHref)} {...S("color: inherit; font-weight: 600; text-decoration: underline; text-underline-offset: 3px")}>
                        {T($s0?.errLink)}
                      </a>
                    </>) : null}
                  </span>
                </div>
              </>) : null}
              {$s0?.hasForm ? (<>
                <form onSubmit={$s0?.submit} noValidate={true} {...S("margin: 0; display: flex; flex-direction: column; gap: 16px")}>
                  {$s0?.showEmail ? (<>
                    <label {...S("display: flex; flex-direction: column; gap: 8px")}>
                      <span {...S("font-weight: 500")}>
                        {"Email"}
                      </span>
                      <input type={"email"} name={"email"} autoComplete={"email"} inputMode={"email"} autoCapitalize={"off"} spellCheck={"false"} placeholder={"you@example.com"} value={V0($s0?.email, "")} onInput={$s0?.setEmail} aria-invalid={$s0?.emailBad} className={"ti"} {...S(`height: 44px; padding: 0 14px; box-sizing: border-box; border: 1px solid ${I($s0?.emailBd)}; border-radius: 10px; background: ${I($s0?.t?.card)}; color: ${I($s0?.t?.fg)}; font: inherit; font-size: 15px; outline: none`)} />
                    </label>
                  </>) : null}
                  {$s0?.showPw ? (<>
                    <label {...S("display: flex; flex-direction: column; gap: 8px")}>
                      <span {...S("display: flex; align-items: baseline; justify-content: space-between; gap: 12px")}>
                        <span {...S("font-weight: 500")}>
                          {T($s0?.pwLabel)}
                        </span>
                        {$s0?.showForgot ? (<>
                          <a href={H("AuForgot.dc.html")} className={"tb tt"} {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}; text-decoration: underline; text-underline-offset: 3px`)}>
                            {"Forgot password?"}
                          </a>
                        </>) : null}
                      </span>
                      <span className={"ti"} {...S(`position: relative; display: flex; align-items: center; border: 1px solid ${I($s0?.pwBd)}; border-radius: 10px; background: ${I($s0?.t?.card)}`)}>
                        <input type={$s0?.pwType} name={"password"} autoComplete={$s0?.pwAuto} placeholder={$s0?.pwPh} value={V0($s0?.pw, "")} onInput={$s0?.setPw} aria-invalid={$s0?.pwBad} {...S(`flex: 1 1 auto; min-width: 0; height: 42px; padding: 0 14px; box-sizing: border-box; border: none; border-radius: 10px; background: transparent; color: ${I($s0?.t?.fg)}; font: inherit; font-size: 15px; outline: none`)} />
                        <button type={"button"} className={"tb tg"} onClick={$s0?.togglePw} aria-label={$s0?.pwEyeLabel} {...S(`--hv: ${I($s0?.t?.fill)}; width: 36px; height: 36px; flex: 0 0 36px; margin-right: 3px; padding: 0; border: none; border-radius: 8px; background: transparent; color: ${I($s0?.t?.mutedFg)}; display: inline-flex; align-items: center; justify-content: center; cursor: pointer`)}>
                          <svg width={"17"} height={"17"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={$s0?.eye} />
                          </svg>
                        </button>
                      </span>
                      {$s0?.showRule ? (<>
                        <span {...S(`display: flex; align-items: center; gap: 6px; font-size: 13px; color: ${I($s0?.ruleFg)}`)}>
                          <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={$s0?.ruleIcon} />
                          </svg>
                          {"At least 8 characters"}
                        </span>
                      </>) : null}
                    </label>
                  </>) : null}
                  {$s0?.showCode ? (<>
                    <label {...S("display: flex; flex-direction: column; gap: 8px")}>
                      <span {...S("font-weight: 500")}>
                        {"6 digit code"}
                      </span>
                      <input type={"text"} name={"code"} inputMode={"numeric"} autoComplete={"one-time-code"} maxLength={"6"} placeholder={"000000"} value={V0($s0?.code, "")} onInput={$s0?.setCode} className={"ti"} {...S(`height: 56px; padding: 0 16px; box-sizing: border-box; border: 1px solid ${I($s0?.codeBd)}; border-radius: 10px; background: ${I($s0?.t?.card)}; color: ${I($s0?.t?.fg)}; font-family: ${I($s0?.t?.monoFam)}; font-size: 26px; font-weight: 500; letter-spacing: 12px; text-align: center; outline: none`)} />
                    </label>
                  </>) : null}
                  <button type={"submit"} className={"tb tp"} aria-busy={$s0?.busyAttr} disabled={$s0?.btnOff} {...S(`height: 46px; margin-top: 4px; padding: 0 18px; border: none; border-radius: 999px; background: ${I($s0?.t?.primary)}; color: ${I($s0?.t?.primaryFg)}; font: inherit; font-size: 15px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; opacity: ${I($s0?.btnOp)}`)}>
                    {$s0?.busy ? (<>
                      <svg className={"a-spin"} width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M21 12a9 9 0 1 1-6.22-8.56"} />
                      </svg>
                    </>) : null}
                    {T($s0?.btn)}
                  </button>
                </form>
              </>) : null}
              {$s0?.showCodeAlt ? (<>
                <button type={"button"} className={"tb tg"} onClick={$s0?.useCode} {...S(`--hv: ${I($s0?.t?.fill)}; height: 46px; margin-top: -12px; padding: 0 18px; border: 1px solid ${I($s0?.t?.border)}; border-radius: 999px; background: transparent; color: ${I($s0?.t?.fg)}; font: inherit; font-size: 15px; font-weight: 500; cursor: pointer`)}>
                  {"Email me a code instead"}
                </button>
              </>) : null}
              {$s0?.hasGo ? (<>
                <a href={H($s0?.goHref)} className={"tb tp"} {...S(`height: 46px; padding: 0 18px; border-radius: 999px; background: ${I($s0?.t?.primary)}; color: ${I($s0?.t?.primaryFg)}; font-size: 15px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; text-decoration: none`)}>
                  {T($s0?.goLabel)}
                </a>
              </>) : null}
              {$s0?.hasResend ? (<>
                <div {...S(`display: flex; flex-direction: column; gap: 4px; font-size: 14px; color: ${I($s0?.t?.mutedFg)}`)}>
                  <span>
                    {T($s0?.resendLead)}
                  </span>
                  <button type={"button"} className={"tb tt"} onClick={$s0?.resend} disabled={$s0?.resendOff} {...S(`align-self: flex-start; padding: 0; border: none; background: transparent; font: inherit; font-weight: 500; color: ${I($s0?.resendFg)}; text-decoration: underline; text-underline-offset: 3px; cursor: pointer`)}>
                    {T($s0?.resendLabel)}
                  </button>
                </div>
              </>) : null}
              {$s0?.hasBack ? (<>
                <a href={H("AuLogin.dc.html")} className={"tb tt"} {...S(`align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 500; color: ${I($s0?.t?.mutedFg)}; text-decoration: none`)}>
                  <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M15 18l-6-6 6-6"} />
                  </svg>
                  {"Back to log in"}
                </a>
              </>) : null}
              {$s0?.hasTerms ? (<>
                <p {...S(`margin: 0; font-size: 13px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}`)}>
                  {"By continuing, you agree to the "}
                  <a href={H("/terms")} className={"tb tt"} {...S("color: inherit; text-decoration: underline; text-underline-offset: 3px")}>
                    {"Terms"}
                  </a>
                  {" and "}
                  <a href={H("/privacy")} className={"tb tt"} {...S("color: inherit; text-decoration: underline; text-underline-offset: 3px")}>
                    {"Privacy Policy"}
                  </a>
                  {"."}
                </p>
              </>) : null}
            </div>
          </main>
        </div>
        {$s0?.showStory ? (<>
          <aside aria-label={"How Talby follows a deal"} {...S(`flex: 1 1 0; min-width: 0; display: flex; align-items: center; justify-content: center; padding: 48px 40px; box-sizing: border-box; border-radius: 22px; background: ${I($s0?.t?.tile)}; overflow: hidden`)}>
            <div {...S("width: 100%; max-width: 460px; display: flex; flex-direction: column; gap: 28px")}>
              <div {...S("display: flex; flex-direction: column; gap: 10px")}>
                <span {...S(`font-size: 12px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: ${I($s0?.t?.mutedFg)}`)}>
                  {"One deal, start to finish"}
                </span>
                <h2 {...S(`margin: 0; font-family: ${I($s0?.t?.titleFam)}; font-size: 30px; font-weight: 600; letter-spacing: -0.9px; line-height: 1.15`)}>
                  {T($s0?.storyTitle)}
                </h2>
                <p {...S(`margin: 0; font-size: 15px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}`)}>
                  {T($s0?.storySub)}
                </p>
              </div>
              <ol {...S(`position: relative; margin: 0; padding: 18px; list-style: none; display: flex; flex-direction: column; gap: 0; border: 1px solid ${I($s0?.t?.border)}; border-radius: 16px; background: ${I($s0?.t?.card)}; box-shadow: 0 24px 50px -28px rgba(0,0,0,0.28)`)}>
                <li {...S(`display: flex; align-items: center; gap: 12px; padding: 0 2px 16px; margin-bottom: 4px; border-bottom: 1px solid ${I($s0?.t?.line)}`)}>
                  <span aria-hidden={"true"} {...S("width: 36px; height: 36px; flex: 0 0 36px; border-radius: 18px; background: #F4E3D7; color: #8A4B2A; display: inline-flex; align-items: center; justify-content: center; font-weight: 600")}>
                    {"H"}
                  </span>
                  <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column")}>
                    <span {...S("font-weight: 600")}>
                      {"Halcyon Skincare"}
                    </span>
                    <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}`)}>
                      {"1 Reel and 3 Stories"}
                    </span>
                  </span>
                  <span {...S(`font-family: ${I($s0?.t?.titleFam)}; font-size: 17px; font-weight: 600; letter-spacing: -0.4px`)}>
                    {"$5,500"}
                  </span>
                </li>
                {A($s0?.story).map((it, i) => {
                  const $s1 = { ...$s0, "s": it, $index: i };
                  return (<React.Fragment key={i}>
                    <li {...S(`position: relative; display: flex; gap: 14px; padding: 12px 2px 0; opacity: ${I($s1?.s?.op)}; transition: opacity 0.4s ease`)}>
                      <span aria-hidden={"true"} {...S("position: relative; width: 26px; flex: 0 0 26px; display: flex; flex-direction: column; align-items: center")}>
                        <span {...S(`width: 26px; height: 26px; flex: 0 0 26px; border-radius: 13px; background: ${I($s1?.s?.dotBg)}; color: ${I($s1?.s?.dotFg)}; display: inline-flex; align-items: center; justify-content: center; transition: background-color 0.3s ease, color 0.3s ease`)}>
                          <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={$s1?.s?.icon} />
                          </svg>
                        </span>
                        {$s1?.s?.hasLine ? (<>
                          <span {...S(`flex: 1 1 auto; width: 2px; min-height: 12px; margin-top: 4px; border-radius: 1px; background: ${I($s1?.s?.lineBg)}; transition: background-color 0.3s ease`)} />
                        </>) : null}
                      </span>
                      <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px; padding-bottom: 4px")}>
                        <span {...S("display: flex; align-items: baseline; justify-content: space-between; gap: 10px")}>
                          <span {...S("font-weight: 600")}>
                            {T($s1?.s?.title)}
                          </span>
                          <span {...S(`flex: 0 0 auto; font-size: 12px; color: ${I($s1?.t?.mutedFg)}; font-variant-numeric: tabular-nums`)}>
                            {T($s1?.s?.date)}
                          </span>
                        </span>
                        <span {...S(`font-size: 13px; line-height: 1.45; color: ${I($s1?.t?.mutedFg)}`)}>
                          {T($s1?.s?.sub)}
                        </span>
                        {$s1?.s?.hasChip ? (<>
                          <span {...S(`opacity: ${I($s1?.s?.chipOp)}; transform: scale(${I($s1?.s?.chipSc)}); transform-origin: left center; transition: opacity 0.3s ease, transform 0.3s cubic-bezier(.2,.8,.3,1); align-self: flex-start; margin-top: 6px; display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 10px; border-radius: 13px; background: ${I($s1?.s?.chipBg)}; color: ${I($s1?.s?.chipFg)}; font-size: 12px; font-weight: 600`)}>
                            {T($s1?.s?.chip)}
                          </span>
                        </>) : null}
                      </span>
                    </li>
                  </React.Fragment>);
                })}
              </ol>
              <p {...S(`margin: 0; font-size: 14px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}`)}>
                {T($s0?.storyFoot)}
              </p>
            </div>
          </aside>
        </>) : null}
      </div>
  </>);
}

export const meta = {"props":{"mode":{"editor":"enum","options":["login","signup","confirm","forgot","sent","reset","done","expired","code"],"default":"login"},"err":{"editor":"enum","options":["none","wrong","taken","weak","offline","badcode"],"default":"none"},"theme":{"editor":"enum","options":["auto","light","dark"],"default":"auto"},"vw":{"editor":"enum","options":["auto","390","1440"],"default":"auto"},"still":{"editor":"boolean","default":false},"standalone":{"editor":"enum","options":["auto","yes","no"],"default":"auto"}},"preview":{"width":1440,"height":900}};
export default $r.defineBoard("SAuth", Component, render, CSS, meta);
