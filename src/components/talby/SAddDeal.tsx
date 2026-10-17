// @ts-nocheck
/* eslint-disable */
'use client';
// SAddDeal: converted from design-source/boards/SAddDeal.dc.html.
// Markup, inline styles and logic are carried over exactly from the board.
// The logic class below is the board's own code, unchanged.
import * as React from 'react';
import * as $r from './_runtime';
import { DCLogic } from './_runtime';
import { TalbyDates, getTalbyIO } from './_data';
import SDatePicker from './SDatePicker';

const CSS = "body, #dc-root{margin:0;font-synthesis:none}#dc-root .tb{transition:background-color .15s ease,color .15s ease,border-color .15s ease,box-shadow .15s ease,opacity .15s ease,transform .12s ease}#dc-root .tb:active{transform:scale(.97)}#dc-root .tg:hover{background-color:var(--hv)!important}#dc-root .tp:hover{opacity:.88}#dc-root .tt:hover{color:var(--fg)!important}#dc-root .tz:hover{border-color:var(--pr)!important;background-color:var(--hvz)!important}#dc-root .ti{transition:box-shadow .15s ease}#dc-root .ti:focus, #dc-root .ti:focus-within{box-shadow:0 0 0 2px var(--ring)!important}#dc-root .tb:focus-visible{outline:2px solid var(--ring);outline-offset:2px}#dc-root .a-fade{animation:tFade .2s ease backwards}#dc-root .a-pop{animation:tPop .22s cubic-bezier(.2,.8,.3,1) backwards}#dc-root .a-in{animation:tIn .3s cubic-bezier(.2,.7,.2,1) backwards}#dc-root .a-up{animation:tUp .3s cubic-bezier(.2,.8,.2,1) backwards}#dc-root .a-drop{animation:tDrop .16s cubic-bezier(.2,.8,.3,1) backwards}#dc-root .a-spin{animation:tSpin .8s linear infinite}#dc-root .a-check{animation:tCheck .4s cubic-bezier(.3,1.5,.5,1) backwards}#dc-root .a-pulse{animation:tPulse 1.4s ease-in-out infinite}#dc-root .a-shim{background-image:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.45) 50%,rgba(255,255,255,0) 100%);background-size:200% 100%;animation:tShim 1.3s linear infinite}#dc-root .a-float{animation:tFloat 2.4s ease-in-out infinite}@keyframes tFade{from{opacity:0}to{opacity:1}}@keyframes tPop{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}@keyframes tIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes tUp{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}@keyframes tDrop{from{opacity:0;transform:translateY(-4px) scale(.98)}to{opacity:1;transform:none}}@keyframes tSpin{to{transform:rotate(360deg)}}@keyframes tCheck{0%{transform:scale(.4);opacity:0}100%{transform:none;opacity:1}}@keyframes tPulse{0%,100%{opacity:1}50%{opacity:.3}}@keyframes tShim{from{background-position:200% 0}to{background-position:-200% 0}}@keyframes tFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}@media (prefers-reduced-motion:reduce){#dc-root *, #dc-root *::before, #dc-root *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}\n";

const Component = (() => {
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = this.initial(props.open || 'new', props.step, !!props.frame);
  }
  data() {
    var B = { status: 'Active', when: 2, up: 1, bal: 2, parts: 2, months: 6 };
    function F(o) { return Object.assign({}, B, o); }
    return {
      F0: F({ brand: '', post: '', plats: {}, amt: '', paid: 'once', rep: '', repEmail: '' }),
      FC: F({ brand: 'Lumen and Lark Skincare Co.', post: '2026-11-04', plats: { TikTok: true, Instagram: true }, amt: '6,000', paid: 'split', rep: 'Danielle Ortiz', repEmail: 'danielle.ortiz@lumenandlark.co' }),
      FFEW: F({ brand: 'Lumen and Lark Skincare Co.', post: '', plats: {}, amt: '', paid: 'once', rep: 'Danielle Ortiz', repEmail: 'danielle.ortiz@lumenandlark.co' }),
      FINV: F({ brand: '', post: '2026-11-12', plats: { Instagram: true }, amt: '2.5k', paid: 'once', rep: '', repEmail: '' }),
      FSAVE: F({ brand: 'Marlow Athletics', post: '2026-11-12', plats: { TikTok: true, Instagram: true }, amt: '4,500', paid: 'once', rep: '', repEmail: '' }),
      // Rows that did not save in the partial import states: [id, brand, post, status, amount, repeat, how, reason]
      CSV_FAIL: [[101, 'Juniper Skin', '', 'Active', 3200, 0, '', 'The connection dropped while saving'], [102, 'Pocket Pantry', '', 'Negotiating', 1800, 0, '', 'The connection dropped while saving'], [103, 'Marlow Athletics', '', 'Active', 4500, 0, '', 'Talby took too long to save it']],
      NOTION_FAIL: [[5, 'Willow Pet Co.', 'Dec 2', 'Active', 1800, 0, 'All at once', 'Notion did not answer in time'], [6, 'Cedar and Sage Candles', 'Dec 8', 'Active', 1200, 0, 'All at once', 'The connection dropped while saving']]
    };
  }
  initial(kind, step, frame) {
    var D = this.data(), s = step || '';
    // A step name decides its flow, so the step prop alone is enough on a board frame.
    var KIND = { pick: 'upload', csvPick: 'upload', reading: 'upload', review: 'upload', csvMap: 'upload', csvPreview: 'upload',
      pickBig: 'upload', pickType: 'upload', pickOffline: 'upload', readFail: 'upload', reviewFew: 'upload', csvEmpty: 'upload', csvNoBrand: 'upload', csvRowIssues: 'upload', csvPartial: 'upload',
      connect: 'notion', db: 'notion', map: 'notion', preview: 'notion', importing: 'notion',
      notionSetup: 'notion', connectDenied: 'notion', notionLost: 'notion', dbNone: 'notion', dbEmpty: 'notion', fetchFail: 'notion', importPartial: 'notion',
      formInvalid: 'new', saveFail: 'new' };
    if (KIND[s]) kind = KIND[s];
    var src = ['csvPick', 'csvMap', 'csvPreview', 'csvEmpty', 'csvNoBrand', 'csvRowIssues', 'csvPartial'].indexOf(s) >= 0 ? 'csv' : 'contract';
    var x = { zerr: '', few: false, issues: false, tried: false, saveErr: false, lockStep: false };
    if (s === 'csvPick') s = 'pick';
    if (s === 'pickBig' || s === 'pickType' || s === 'pickOffline') { x.zerr = s === 'pickBig' ? 'big' : s === 'pickType' ? 'type' : 'offline'; s = 'pick'; }
    if (s === 'reviewFew') { x.few = true; s = 'review'; }
    if (s === 'csvNoBrand') s = 'csvMap';
    if (s === 'csvRowIssues') { x.issues = true; s = 'csvPreview'; }
    if (s === 'formInvalid') { x.tried = true; s = 'form'; }
    if (s === 'saveFail') { x.saveErr = true; s = 'form'; }
    if (s === 'locked') { x.lockStep = true; s = ''; }
    s = s || (kind === 'upload' ? 'pick' : kind === 'notion' ? 'connect' : 'form');
    var f = s === 'review' ? (x.few ? D.FFEW : D.FC) : step === 'formInvalid' ? D.FINV : step === 'saveFail' ? D.FSAVE : D.F0;
    return {
      kind: kind, step: s, src: src, f: Object.assign({}, f), pop: null,
      read: frame && !this.props.demo ? 2 : 0, busy: false,
      map: { 0: step === 'csvNoBrand' ? 'skip' : 'brand', 1: 'amt', 2: 'post', 3: 'status', 4: 'pay', 5: 'rep', 6: 'skip' }, skipDup: true,
      db: 'deals', dbQ: '', nmap: { 0: 'brand', 1: 'amt', 2: 'status', 3: 'post', 4: 'pay', 5: 'payby', 6: 'rep' },
      nsel: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true }, sync: true, prog: frame ? 3 : 0,
      zerr: x.zerr, few: x.few, issues: x.issues, tried: x.tried, saveErr: x.saveErr, lockStep: x.lockStep, att: '', retry: null
    };
  }
  componentDidMount() { this._prev = { step: this.state.step, busy: this.state.busy }; this.kick(true); this.autoNotion(); }
  autoNotion() { var p = this.props; if (p.autoConnect && p.open === 'notion' && this.io() && !this._autoDone) { this._autoDone = true; this.setState({ busy: true }); this.connectIO(false); } }
  componentDidUpdate(prev, prevState) {
    var p = this.props, ps = prevState || this._prev || {};
    this._prev = { step: this.state.step, busy: this.state.busy };
    if (p.open !== prev.open && p.open) { var self0 = this; this.clear(); this.setState(this.initial(p.open, p.step, !!p.frame), function () { self0.autoNotion(); }); return; }
    if (p.step !== prev.step && p.frame) { this.clear(); this.setState(this.initial(p.open || 'new', p.step, true)); return; }
    if (ps.step !== this.state.step || ps.busy !== this.state.busy) this.kick();
  }
  componentWillUnmount() { this.clear(); }
  clear() { clearInterval(this._iv); clearTimeout(this._to); }
  lockKind() {
    var l = this.props.locked;
    if (l === 'canceled') return 'canceled';
    if (l === 'readonly' || l === true || this.state.lockStep) return 'readonly';
    return '';
  }
  kick(fromMount) {
    var self = this, st = this.state, p = this.props;
    if ((p.frame && fromMount) || (!p.frame && !p.open && typeof p.onClose === 'function')) return;
    this.clear();
    if (this.lockKind()) return;
    if (st.step === 'reading') {
      this._iv = setInterval(function () {
        if (self.io() && !self.state.rd) return;
        var n = self.state.read + 1;
        if (n >= 4) { clearInterval(self._iv); self.setState({ read: 4 }); self._to = setTimeout(function () { self.go('review'); }, 650); }
        else self.setState({ read: n });
      }, 760);
    }
    if ((st.step === 'connect' || st.step === 'connectDenied' || st.step === 'notionLost') && st.busy && !this.io()) {
      this._to = setTimeout(function () { self.setState({ busy: false, step: 'db' }); }, 1300);
    }
    if (st.step === 'importing') {
      if (this.io() && !st.res && !this._run) this.runImport();
      var total = this.impList().length;
      this._iv = setInterval(function () {
        var n = self.state.prog + 1;
        if (n >= total && self.io() && !self.state.res) return;
        if (n >= total) { clearInterval(self._iv); self.setState({ prog: total }); self._to = setTimeout(function () { self.finishImport(); }, 700); }
        else self.setState({ prog: n });
      }, 420);
    }
  }
  go(step, extra) {
    var D = this.data();
    if (this.io() && !(extra && extra.loaded)) {
      if (step === 'db' && (!this.state.dbs || this.state.step === 'dbNone')) { this.loadDbs(); return; }
      if (step === 'map' && this.state.step !== 'preview') { this.loadRows(); return; }
    }
    var u = { step: step, pop: null };
    if (step === 'review') u.f = Object.assign({}, this.state.rd ? Object.assign({}, D.F0, this.state.rd.fields || {}) : (this.state.few ? D.FFEW : D.FC));
    if (step === 'reading') u.read = 0;
    if (step === 'importing') { u.prog = 0; u.retry = null; u.resPrev = this.state.res || null; u.res = null; this._run = false; }
    if (step === 'pick') { u.zerr = ''; u.few = false; u.issues = false; }
    if (extra) for (var q in extra) u[q] = extra[q];
    this.setState(u);
  }
  io() { var x = this.props.frame ? null : (this.props.io || getTalbyIO()); return x && typeof x === 'object' ? x : null; }
  ioErr(e) { return (e && (e.code || (e.body && e.body.code))) || 'failed'; }
  ioDate(v) { return v && /^\d{4}-\d\d-\d\d/.test(v) ? TalbyDates.md(v.slice(0, 10)) : (v || ''); }
  pickFile() {
    var self = this, csv = this.state.src === 'csv', inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = csv ? '.csv,.tsv,.xlsx,.xls,text/csv' : '.pdf,.doc,.docx,application/pdf';
    inp.onchange = function () { var fl = inp.files && inp.files[0]; if (fl) self.gotFile(fl); };
    inp.click();
  }
  gotFile(file) {
    var self = this, io = this.io(), csv = this.state.src === 'csv';
    var meta = { name: file.name, size: (file.size / 1048576).toFixed(1) + ' MB' };
    this._file = file;
    if (!csv && file.size > 20 * 1048576) { this.setState({ zerr: 'big', fileInfo: meta, pop: null }); return; }
    if (!csv && !/\.(pdf|docx?)$/i.test(file.name)) { this.setState({ zerr: 'type', fileInfo: meta, pop: null }); return; }
    if (csv) {
      this.setState({ fileInfo: meta, csvData: null });
      Promise.resolve().then(function () { return io.readCsv(file); }).then(function (r) {
        r = r || {};
        var map = {}; (r.cols || []).forEach(function (c, i) { map[i] = c.field || 'skip'; });
        self.go('csvMap', { csvData: r, map: map, issues: !!(r.issues && r.issues.length) });
      }, function (e) { if (self.ioErr(e) === 'offline') self.setState({ zerr: 'offline' }); else self.go('csvEmpty'); });
      return;
    }
    this.go('reading', { fileInfo: meta, rd: null });
    Promise.resolve().then(function () { return io.readContract(file); }).then(function (r) {
      if (self.state.step === 'reading') self.setState({ rd: r || {}, few: !!(r && r.few) });
    }, function (e) {
      var c = self.ioErr(e);
      if (self.state.step !== 'reading') return;
      self.clear();
      if (c === 'too_big') self.go('pick', { zerr: 'big', fileInfo: meta });
      else if (c === 'bad_type') self.go('pick', { zerr: 'type', fileInfo: meta });
      else if (c === 'offline') self.go('pick', { zerr: 'offline' });
      else self.go('readFail');
    });
  }
  connectIO(sw) {
    var self = this, io = this.io();
    Promise.resolve().then(function () { return io.notionConnect({ switchWorkspace: !!sw }); }).then(function (c) {
      if (!self.state.busy) return;
      self.setState({ ws: (c && c.workspace) || '' });
      self.loadDbs();
    }, function (e) {
      var c = self.ioErr(e);
      if (!self.state.busy) return;
      self.setState({ busy: false, step: c === 'not_ready' ? 'notionSetup' : c === 'notion_lost' ? 'notionLost' : 'connectDenied' });
    });
  }
  loadDbs() {
    var self = this, io = this.io();
    Promise.resolve().then(function () { return io.notionDatabases(); }).then(function (list) {
      list = list || [];
      var rec = list.filter(function (d) { return d.looksLikeDeals; })[0] || list[0];
      self.setState({ busy: false, dbs: list, db: rec ? rec.id : '', dbQ: '', step: list.length ? 'db' : 'dbNone', pop: null });
    }, function (e) {
      self.setState({ busy: false, step: self.ioErr(e) === 'notion_lost' ? 'notionLost' : 'dbNone', pop: null });
    });
  }
  loadRows() {
    var self = this, io = this.io(), id = this.state.db;
    Promise.resolve().then(function () { return io.notionRows(id); }).then(function (r) {
      r = r || {};
      var rows = r.rows || [], props = r.props || [];
      if (!rows.length) { self.go('dbEmpty'); return; }
      var nmap = {}; props.forEach(function (x, i) { nmap[i] = x.field || 'skip'; });
      var nsel = {}; rows.forEach(function (x, i) { if (!x.repeat) nsel[i + 1] = true; });
      self.go('map', { loaded: true, nprops: props, nr: rows, nmap: nmap, nsel: nsel });
    }, function (e) { self.go(self.ioErr(e) === 'notion_lost' ? 'notionLost' : 'fetchFail'); });
  }
  csvKeep() {
    var st = this.state, self = this;
    return ((st.csvData && st.csvData.rows) || []).filter(function (r) { return !(st.skipDup && r.repeat); })
      .map(function (r, i) { return [i + 1, r.brand, self.ioDate(r.post), r.status || 'Active', Number(r.amount) || 0, 0, '', r.id]; });
  }
  mapOut(map, names) {
    var o = {}; names.forEach(function (n, i) { if (map[i] && map[i] !== 'skip') o[n] = map[i]; }); return o;
  }
  runImport() {
    var self = this, io = this.io(), st = this.state, list = this.impList(), ids = list.map(function (r) { return r[7]; });
    var prev = st.retry ? st.resPrev : null;
    this._run = true;
    Promise.resolve().then(function () {
      if (st.kind === 'upload') return io.importCsv({ uploadId: st.csvData && st.csvData.uploadId, map: self.mapOut(st.map, ((st.csvData && st.csvData.cols) || []).map(function (c) { return c.name; })), skipRepeats: !!st.skipDup, rowIds: st.retry ? ids : null });
      var db = (st.dbs || []).filter(function (d) { return d.id === st.db; })[0];
      return io.importNotion({ databaseId: st.db, map: self.mapOut(st.nmap, (st.nprops || []).map(function (x) { return x.name; })), pageIds: ids, sync: !!st.sync, databaseName: db ? db.name : '' });
    }).then(function (r) {
      r = Object.assign({ imported: 0, skipped: 0, booked: 0, failed: [] }, r || {});
      if (prev) { r.imported += prev.imported || 0; r.booked += prev.booked || 0; }
      self.setState({ res: r });
    }, function (e) {
      if (self.ioErr(e) === 'notion_lost') { self.clear(); self.go('notionLost'); return; }
      var r = { imported: prev ? prev.imported || 0 : 0, skipped: 0, booked: prev ? prev.booked || 0 : 0,
        failed: list.map(function (x) { return { id: x[7], brand: x[1], amount: x[4], reason: 'The connection dropped while saving' }; }) };
      self.setState({ res: r });
    });
  }
  finishIO() {
    var st = this.state, r = st.res;
    if (r.failed && r.failed.length) { this.go(st.kind === 'upload' ? 'csvPartial' : 'importPartial'); return; }
    this.doneIO(r);
  }
  doneIO(r) {
    var st = this.state, n = r.imported || 0, booked = r.booked || 0;
    var db = (st.dbs || []).filter(function (d) { return d.id === st.db; })[0];
    this.done({ kind: 'import', source: st.kind === 'upload' ? 'csv' : 'notion', saved: true, count: n, deals: [],
      title: n + (n === 1 ? ' deal imported' : ' deals imported'), chip: booked ? '+$' + booked.toLocaleString('en-US') + ' booked' : '',
      line: st.kind !== 'upload' && st.sync && db ? db.name + ' stays in sync with Talby.' : 'They are on your Deals page with dates and amounts.' });
  }
  selN() { var o = this.state.nsel; return Object.keys(o).filter(function (x) { return o[x]; }).length; }
  NROWS() {
    var self = this;
    if (this.state.nr) return this.state.nr.map(function (x, i) { return [i + 1, x.brand, self.ioDate(x.post), x.status || 'Active', Number(x.amount) || 0, x.repeat ? 1 : 0, x.how || 'All at once', x.id]; });
    return [[1, 'Brightside Oats', 'Nov 12', 'Active', 2500, 0, 'Split'], [2, 'Haven Home Goods', 'Nov 20', 'Active', 4000, 0, 'All at once'], [3, 'Northfield Denim', 'Nov 28', 'Active', 6500, 0, 'Split'],
      [4, 'Peak Electrolytes', '', 'Negotiating', 3200, 0, 'All at once'], [5, 'Willow Pet Co.', 'Dec 2', 'Active', 1800, 0, 'All at once'], [6, 'Cedar and Sage Candles', 'Dec 8', 'Active', 1200, 0, 'All at once'],
      [7, this.props.demo ? 'Halcyon Skincare' : 'CeraVe', 'Oct 15', 'Active', 8000, 1, 'All at once'], [8, this.props.demo ? 'Basewear' : 'Sprouts', 'Nov 5', 'Active', 4000, 1, 'All at once']];
  }
  impList() {
    var st = this.state;
    if (st.retry) return st.retry;
    if (st.csvData && st.kind === 'upload') return this.csvKeep();
    return this.NROWS().filter(function (r) { return st.nsel[r[0]] && !r[5]; });
  }
  finishImport() {
    var st = this.state;
    if (this.io() && st.res) { this.finishIO(); return; }
    if (st.retry && st.kind === 'upload') {
      var n = st.skipDup ? 15 : 18, booked = st.skipDup ? 41750 : 57750;
      this.done({ kind: 'import', count: n, deals: [], title: n + ' deals imported', chip: '+$' + booked.toLocaleString('en-US') + ' booked', line: 'They are on your Deals page with dates and amounts.' });
    } else this.finishNotion();
  }
  finishNotion() {
    var st = this.state, sel = this.NROWS().filter(function (r) { return st.nsel[r[0]] && !r[5]; });
    var booked = sel.filter(function (r) { return r[3] === 'Active'; }).reduce(function (a, r) { return a + r[4]; }, 0);
    var n = sel.length;
    this.done({ kind: 'import', count: n, deals: sel.map(function (r) { return { brand: r[1], amt: r[4], status: r[3] }; }),
      title: n + (n === 1 ? ' deal imported' : ' deals imported'), chip: booked ? '+$' + booked.toLocaleString('en-US') + ' booked' : '',
      line: st.sync ? 'Brand Deals 2026 stays in sync with Talby.' : 'They are on your Deals page with dates and amounts.' });
  }
  partialDone() {
    var st = this.state, D = this.data();
    if (this.io() && st.res) { this.doneIO(st.res); return; }
    if (st.kind === 'upload') {
      this.done({ kind: 'import', count: 12, deals: [], title: '12 deals imported', chip: '+$34,050 booked', line: 'They are on your Deals page with dates and amounts.' });
      return;
    }
    var failed = D.NOTION_FAIL.map(function (r) { return r[0]; });
    var sel = this.NROWS().filter(function (r) { return st.nsel[r[0]] && !r[5] && failed.indexOf(r[0]) < 0; });
    var booked = sel.filter(function (r) { return r[3] === 'Active'; }).reduce(function (a, r) { return a + r[4]; }, 0);
    this.done({ kind: 'import', count: sel.length, deals: sel.map(function (r) { return { brand: r[1], amt: r[4], status: r[3] }; }),
      title: sel.length + ' deals imported', chip: booked ? '+$' + booked.toLocaleString('en-US') + ' booked' : '',
      line: 'They are on your Deals page with dates and amounts.' });
  }
  done(info) {
    var p = this.props;
    if (typeof p.onCreated === 'function') p.onCreated(info);
    else if (typeof p.onClose === 'function') p.onClose();
    else this.setState(this.initial(this.state.kind, '', !!p.frame));
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
    var PLATICON={TikTok:'data:image/png;base64,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',Instagram:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAQ10lEQVR42rWZe7BdVX3HP7/fWnufx33fmxASwiNEFIeXoaUVladoEa1WhmTwbbUdZ7St46i1tFZqnfqoY+vY2tFaWztOhynpQ7SDWoFIgliCAgLKqyEaSAgh3CT3ce45Z++1fv1j7XPOvsH+VXvu/Gatvfc693y/v/deS6h9tm690W3fvi0AXPF795xBkKtdaZdKsOdriCdosIZG1EfERUGjiYvgIqhJGtO1OKN+jTNDI6iBM9BoaTQzNcOZmItEhaAx9jLRZ7zpI07k9tzi1952968+CnDj1hvdtgojgIzAm9u+XcJL3nPHhsyNf8SV8Q2Z5JMaIlqWaBnRYAwAu1CBq4CuAhtXP1Ozaqxd24CMDcfRPfAouXgcgoXegkP+OZRLH337j67YXychdc1f9Dv/dblzzX/KtXVi7CygpQUXTCqNi4uCCyOQzkDDaP4cEhWoEfgEdjXg0aiDa8zEDGdmapgXcRNugjJ0ni5i781vuu+yWwYkZAD+pe/5/qW5a33Ll9aQXr90UZyLJBcJMgIdf77Gk1sMrm2oyedYoKZxrROgdr+aK4YzQzATC6GpDZ8h/SJ2Xn3Nfa+45catNzrh+uv1kmeuOiGL/n5vbq30esGbuKFm43PBewbgBn5vq9ymru3VLjMAOwA6IiIxonEEvLJEmleExGJoauYgzjfIzvnevd85KABXvmP3l1r59G+FpSOlQ/wqN6lp2ANSGnElYr2IBPAGjmo0cCa1QK250UDjMYHTOBInkGVC3lScgoS4CrjWiGChnM2n/FJx9B+uuu9V75Crf/P+02PRezCL0tQY0Yi4aDU3MTIECUZ/oaTddGzc1Obk542xdkOTiSlPo+XIMsV5QQVUZJgdxGqjGRbBikjoRcJKoDtfsLivw9GHFjn26BJxuaQ56VCprAI4DJEBiWgOQYm9zPy5Puv0tjZdqxW7y0HBDcFX2spECCslHrjkdeu48DUncvLzx2v56xf0icb8TxbZs30/+/5tP2KRrKnJGjKygIiJmoVx32x2Q+cNvt2zS3MXzAobBs1Q8yqUSwVr1+a84cNncvp5U/y/fUSYPXuS2bMn2fSaddz7oR/RO7hCPuZgSCKNIiYqhXlXXibvfvX3H8/EbSL0zZlI8lnDA7EbmJ7L+e2/fhEzG1qEIuIyBWD+p8sc+dkynWd7lJ1A6AYIBtGQaEjChFgyVroWRATnBddwZG1Hc67BxKYxxk8bS4boRzRXOvuW2f32OykOd/ENQcxQqQgQLVcn0cr9vl2EOScRjXEIfpDWiIE3/mkCX/YjPlf27jrED76yh8MPL1AuF8nEMWWUYS5nlO/T/TTKYAQEQRFc5sjGM2ZeOMnmd25m7cUnEPuR9iljbPnM+dz79l04kWQBiUjlRoYh2KxvlaHhBDQGXAXCq9E70uNXrj2VjWdPEYoE/r6v7uGOTz+A90KrqbjxlIEUqWWMEdA0txSQw2dSs4gRFlewox2O3n6M++56ihf84Xmc8tbNxCIytWWOjdeczMEbHsPPZMnCtY+JON+OhXMpx+KqGNAQaTWN868+GTNwmfLknQe5+9P3MDPpcWJIKEcpMWmjmg/SHgk4ILEiUml+YAHrBja8dhOT565l4e5DHL71CX76qbuZPGOc6QvXgcH6bZs5fNMeiHZc0BgY6luhVIehFnFEnEDo9DnxrGnmNk+kpQYP/f2DjLs+TYkQQgr4AfCBKKgKahGKiISAAOoUlykiAtFQFcJCn3XXvJDNH3kJACddewaPfWAHh7++h6e+8gDTL14HwNgZU7TPmGb5oSNo2w+JDLKzb8W+OAxHRC3iHRT9Fda/YGOKQmD5iQVWHnqKiVbExQKRtD65R5W9nEAZsIUuLlPy2TbZVAsB4sIKYX4JKwJ+rIFmGaV0WHv5yVgZiSslOpYxe9EGjn7zUVYePkRv/yKNjRMgwtiZMyzefxgnntV2EHzb+lXJDskCQGZdZja2hss6e+fJOwvkExkaI0oKJpVYgVfiYod8usncb5zNzOXPp7V5Dj/RBCAsdunuOczCjkdY+PaPicuLZE2hs3sPky87DTeRA7C0ex++BXGpQ3fv0UQAaJ48DvbzUq+Jb9NL2q/EYQRZoT3th+vC/BLN2KGpDcTKUU7GUCfEhSWmLjmTk973ShqnzD3nd/zsGOOzY4xfcCprrv0lnvnst1nc9RhHb7oHzGidcxJLdz3BsVseIZto0p/vU853ht/PpvP/tXz4Fl1xRFQijoATI7oueUtHRFc6tHWZhgaEUBWUiDrBFpaY2XYhJ37o9ck3Q0ScDufAquv8lDlO+os38vQnv8HRf/0hR7ffxfwNgonHt1sYJUJB7PaHv+/aimp4DnjDxLdlpQIfUUkEzHXIaqRd0aHtlshdRKRMBDywtMzYJWdxwodeDzGCKOKUlVvvZuW2eygPzGMobv0a2i/fQvvl5ydXsMi6P/h1wqGjLN/1OH5qnFhCDCUmgkrAeiMCmiuuUl7KZXUL6ApOYooBCagzcB18NnI6H7u0/RKZNzQWqaBYQGcdaz6wNaUpwDorHPuzL7Fy+73gPbgMQyn+ex8rO35I55YtzH74LUgzRwxO+OBr2Pe2vyH2u4h4RFKmUimhLEcEvCAaEjExzNzoWUs71tJl2m6Zlktj2y/hXBz5oPQY84u0s0Vafolmo0vee5bxKy9A180l7SMsfuILFN+9k2xNGz+R41qCawrZZEY216J7690c+fhXERUsRvz6GSavPAeWl1CXPEAkoFIiNvp9UUv3pKzWjJ5p2y/T9su0hrJEO1vCuZHPeenT8B289nDaR+mjOeQXXZC07xz9XXdR7vwe/oQJtOyi1kMpUArE+kjoka0bo7vjblZ23pfiwozxy87C5ZbWSjkUIdazJSphJASEmNqRIehKWn6Zpl9GayyFgEr1AxrQsIKfHcOdOqoV5Y7bcZmh1ke1XAXGDeZW4LJI95bdww40O20d2WwLCf0ayNUERKwGPFkpWcHwA7DpgSEKSIHUEq9IwGmBaAFEKPrI5FpkrF318hEOHkBzAwpMoN5URBRFMQzNIB48mCqqCjrexE3lxIVlzOswiKkrUKhAB1QYtoMGeCcFMuzyYlKoFqv+QWpjC0TKdF8LRIpV2UClBCmwYbUcNRlSVRoTg0rLq75LQKREJBBF0rzuQlj1/0MiU/2pgY5MXdRMfrwFIk6Kak2RdraWjsDycoVAcRvWoqGLc5XLDNyo5k5OAxq6+A1zVKrEllZgaRH1hlAO3UjEVhFI2o+rYkEk1gmUI4BSwnEEVAqclDgKXAbu2CHsib3DFOouuwyNK1U2WR2Qw2sX0dCj8fILGXSJ5c/2Y0fncRkoZRVvYXUMYNW9QfBWo4REwEmJ07rmCsTCagtozQIa0LIDd9yaHDQE9KUX4y6+GH32AJqRwLqQ1nrD5cCzT9O4/MXkL7sAQgAR+rfvRkMP1ThMoSll1ixgcUSs0vwgJnz6QqziIFYBcxwBB/gIWfWaJSVMtWHXzXD1G2HtiWAR9/4/IhKwO3ZgmmM+x8xhRSQGyC+/lPyDv5uCXpX41CH6t+5ExxtYLFBRTDRpuF5wYyq0SEQFrHqfUxO8DAkMzCKgJcRakOYemgoNgSjJuzSDpSX48qfgus+CCbTa6B9/Cnbdgu28FTt4kIjCuo1kF1+OXnxJcjkzEGHlc19ElhfQsUliKFEcceDfvrbtEZJrIdX7BREImMhqC+AMMg9BINQItJvQlBGBwVvO3CQ8+D348ifgnddVPxbgoiuQi64Y7uugOnrmHIjQ+8vPEXbvxk3MEMsCxBOpFazmqBu2folQIhKxYRZSxCoXEmfgBZxCLhCAslsj0F5tgcErkUWYm4Zd/w4Lz8C174X1p9by4+rGC+ewJ/ZRfPELhLt+gJuaIZb91AeZoEAkpL6nNeomrdur6lTl4qReTETNq7e0e+UlkcgqAivHRj88PQstn8iZjixQ7baxZgYe/j588kG44BWw5RI4aTOMTaQ1ywvw0z3YnTsJt++AxRXc1DSx7IP4YWFKzUFAHejMxCgEji2lGCCkeoUmMhbw5BXoAYFcICocOTAisP40mJ6o1C6jBsUMYlWJZyahX8LOf4GdX4P2NDQmoDQ4tgCH56EX0PYUjLeIoY+IGxWlQXWNoOM5/tT1oxA48AyisRbEIQWxRPM0xIbgvUAGaAOefqwKNmDuJDj9TNh7LzTHIYbBvkZqCSJVa+CgMQNlhG4Hji5AQVLI1BhSkF72rY+Kr52xCNEEcR7pdMi3nIFbv2Zo5fKxfWiumIWhrZSIEVEyNfJK8w2BHBhvwfweOPT4qJ5d+hbILUnLp7UNgYbW5rV02/Iw1oSxBjT9YOsa0Vi1DnWJiAexArGS1pteO9R+8fiTlI8/gTZ95fcx9WxiiJopOZG8Ct68ItB0IF2496aqUBWw6ZfhqveBdJI0JK1ruQTweGm41dL0aX3TI5kkP3eStmIokc4C0lmk/d53km05G4oypdqbvgu9LuJsVKuGEsyTSZ9ccjy1WIjQnISHvwnn/RqsPwtCH86/GtacAvfcAIcehd5ScieztGsWLCWAwpLv9y3Ni2req8a+IX0Q84g0kPY0/kXn4rZdizt/C/QLyDOKBx6l+62d6ESbGEPaEqtIpI0tK8Wuu+Jxmm4TWmWjTNJJRqZgBUzMwes+A5MbUnHTLNl24QAcfRI6R6BYgX4PQgkhjshEamMlJoAH34C8hU3NwcZTkBM3VD5TQJYR9x/k2Ps/TjnfIfoWMTqiZYSYEcyboyn9KE96MnmEpp4GIZKJGxLwQNaE8jD85wfhot+HdeeNtvUmNyT5v+6qD5N9qs5kGeG+B1j+889j84toYwIrQ5WnKjeyaJkKfbNHPTm3kcuVWBUDx7tS1oY4D7uug9NfCZuugunnDd/EfmEfM+yxRylu/hb979wOMUObbUIoEcmS21j13oKZF1QJt4l9+qpTcfHHNKSNA/KBGw0E8Jq2l8tl8E2YPA0mN0N7PWRT4FpVQaqKkgkDNx2m2EjlXjEFaK8Pyx04cgQ7cIC4Zy9h7xOElUAcm67cxRPNE2NGsGxwzyCnjL6rMTtHAOyvXvV5ZvJ30+2XNNUPCWSS9s/dYHSpfQi9lJlCrHxboCTJIGD7VGNMwTuUCN1KVtJopRJ9m5iPE6RBLLUC7RNoy4gxzYvoytlsxj/bL/721Fs+9i6x669XNvxwltzup+XWE0OgqSkWBkQc1UGAjF5SB1oOVoGvZZtilG1S5qmR6NtxhJLE4AjREWOl6Urzw7llFMGHhrZdP+ohLeXcdbflzyh/AvKu/ziMs2vwdJjIHJ6CTIysqgvHF6ycVNCyqmhlMcWLj9V563En38PjGqvOnOLAt5JYSEWqOo2k2jxOa1PDZWZF23unYt3Siq0n3vaJp7dv/YmoyEej3bjVyVtvvpOyeCWefaxtZjRV8EQyieQSybFhta7LoJfK6jFTG53UXLA6tlGpzQeWtVHQiJmlM9mIxeAFWdNoZIrt7xbdK0/5zmd22tatbtv27WGUxW7c6mTb9mA3X7mWifaHyXgzY36WYbNYO62rjkWf4zo/1z1q7tOtXXcH92Ka9yFahsWMdDKdIzQwy+gGd8RidsNhW/nYppv/8aBt3epk+/awKg3XSQDYva87DZe/loxLcLwAJyeAjQ31JkAwoW9CAfSijAgcB3IAtEc1VqB7GF2DboCeWIjOgmXBLF+Olj0jlj0iNL5rln+99Y2/2wtQBw/wPxJvYnXr1cIPAAAAAElFTkSuQmCC',YouTube:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADkklEQVR42u2ZP2gVQRDGf7N3JubFEP8QJEKUpLIIamcvdoJWhmCj2NhaWdhZaGETGyHaSBANxNJSsREbMSCCdhZGkthEVBKNee9uLHY27yJ5T593l/jgDSx37N7tft/u7MzOLHSkIx1pa5FmjerbZZNvpSQ8usm7ysb6P/YQKUT/20w3wiW/z7ZAmqnrx5fdwF6gF+gDKsAuoAvYaWUH4IBuIG6Aowb8xI+xClTtuQYsAytWloHPwBfgq8DX33ASVkVCZahQOAGcA44ABwx8pUS1aaZO343EAvAamBF4ugGzgljpUZhS0AYlVUgUalaqBZfQb2JjNcJxz7CKgqB+2VF4YB8EcEmms2YdllXSzKQlGZKqMG0EXFir09awtk1gWyG1Zu9nIDCAC6Zzsg263qrZF8N6HsCptybHrCFqA98VGdajCr0OOAjsL6Rr57aSyH5gyAGHzEzm97Bp6kmUSyRg7AWGHTAYhs/XrcDwsCeRphBFvq4cCVgHswTygQe4cwdmZpSREUgSbyuiUrfVoAP2bXKQap2Amm88e1Z49Uq5elXp6/NERIpWq4B1n7MzTnGSJLBnj3D9uvDypTI+bha8FLXa6wrbwOtGLoJazRM5fFiYnoYnT1KOH9+oVvmIhJ8rDugp3k6IBxk29MmTjhcvYHIShobqRPKvRk84/pYjwaQmiSd06RLMziqXLytdXUWQ6HaZ40SJvjOyY2INBgaEiQnh3buU0VHN6QDjeMv8ZprWh3v/XpmYcMzPm035ZwMocW4H9jfAw55YWVFu3xZu3hSWlorovRpbiFdCPJUxnaA8egTXrglv39bVKknyjvLTWUxaLPBarT7rs7Nw6hSMjXnwwYTmBw/wIwa+5fbEWScmAt3dsLCg3Lgh3L0L1aqsb9RigAes32MLmouR/n7f+a1bXs8XF4tUl83kc2zpi3yeONjzx4+VK1eE58/rwNO0DPAB6xIKFy3GTAqLXaNIVaTM2DhgvRgDi8FvFhaRlaMuG0ay57wDPlgCKf9GDmef8hNeGOaPDpgDPhVmibYmY4dpzpwTn4d8Yw3tQCA1nK8FloMu3bOdnf7nJDSTv7ofatoxtfhwHXsmuVtpMblb26bk7lQ2udtO6fU3wEOBZ1nMrV5w7LKEUq+FohWL6HbgLzli/KVH1GQDrtpzzd5X7UT8A3+58c2ejS44HM2undr2iqnBT+13ydeRjnSkveQXJps54NcuWqEAAAAASUVORK5CYII=',Facebook:'data:image/png;base64,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'};
    function theme(color,dark){var t=talby(color,dark),r=t.r;t.hover=t.hv;t.zone=t.hvr;t.zoneHover=t.hv;t.frameBg=t.dark?'#050505':mix(t.page,'#000000',0.92);t.pdfBg=t.badBg;t.pdfFg=t.destr;t.csvBg=t.okBg;t.csvFg=t.okFg;t.glow=alpha(t.primary,0.6);t.rTileTop=(r?r+2:0)+'px '+(r?r+2:0)+'px 0 0';return t;}
    function kit(t, mob){
      var b='display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 32px; padding: 0 14px; box-sizing: border-box; font: inherit; font-size: 14px; font-weight: 500; line-height: 1; white-space: nowrap; border-radius: '+t.rCtl+'; cursor: pointer; text-decoration: none; flex-shrink: 0';
      var P=b+'; border: none; background: '+t.primary+'; color: '+t.primaryFg+'; box-shadow: '+t.btnSh, O=b+'; border: 1px solid '+t.border+'; background: '+t.card+'; color: '+t.fg, G=b+'; border: none; background: transparent; color: '+t.fg;
      var sm='; height: 28px; padding: 0 12px; font-size: 13px';
      var inp='height: 36px; width: 100%; min-width: 0; box-sizing: border-box; padding: 0 14px; border: none; border-radius: '+t.rCtl+'; background: '+t.fill+'; color: '+t.fg+'; font: inherit; font-size: 14px; outline: none';
      var row='position: relative; display: flex; align-items: center; gap: 12px; min-height: 52px; padding: 8px 10px 8px 14px; box-sizing: border-box';
      var selx='; display: flex; align-items: center; justify-content: space-between; gap: 8px; text-align: left; cursor: pointer';
      var K = {
        btnP:P, btnO:O, oSm:O+sm, gSm:G+sm, pSm:P+sm, ico:G+'; width: 32px; height: 32px; padding: 0', icoG:G+'; width: 28px; height: 28px; padding: 0',
        ctlW:inp+'; flex: 0 1 300px; width: auto', selW:inp+'; flex: 0 1 300px; width: auto'+selx, selF:inp+'; width: 100%'+selx,
        row:row, rowT:row+'; border-top: 1px solid '+t.line, rowCol:'display: flex; flex-direction: column; align-items: stretch; gap: 10px; padding: 12px 14px; box-sizing: border-box; border-top: 1px solid '+t.line,
        rowLabel:'flex: 1 1 auto; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis',
        group:'position: relative; background: '+t.card+'; border: 1px solid '+t.border+'; border-radius: '+t.rTile, secLabel:'padding: 0 4px; font-size: 14px; font-weight: 600',
        tile:'background: '+t.tile+'; border-radius: '+t.rTile,
        pop:'background: '+t.card+'; color: '+t.fg+'; border: 1px solid '+t.border+'; border-radius: '+t.rTile+'; box-shadow: '+t.shPop+'; padding: 6px; box-sizing: border-box',
        item:'display: flex; align-items: center; gap: 10px; width: 100%; min-height: 34px; padding: 0 10px; box-sizing: border-box; border: none; border-radius: '+t.rItem+'; background: transparent; color: '+t.fg+'; font: inherit; font-size: 14px; text-align: left; cursor: pointer; --hv: '+t.hover,
        tabs:'display: inline-flex; align-items: center; gap: 2px; height: 36px; padding: 3px; box-sizing: border-box; border-radius: '+t.rCtl+'; background: '+t.fill,
        caps:'font-size: 12px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: '+t.mutedFg,
        badge:'display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: 0 8px; box-sizing: border-box; border: 1px solid '+t.border+'; border-radius: '+t.rCtl+'; color: '+t.mutedFg+'; font-size: 12px; font-weight: 500; white-space: nowrap; flex-shrink: 0',
        found:'width: 7px; height: 7px; flex: 0 0 7px; border-radius: 4px; background: '+t.primary+'; box-shadow: 0 0 0 3px '+alpha(t.primary, 0.15),
        err:'display: flex; align-items: center; gap: 6px; padding: 0 4px; font-size: 13px; line-height: 1.4; color: '+t.destr
      };
      if (mob) {
        // Phone: 36px and up tap targets, controls take the room the label leaves.
        K.btnP = P + '; height: 40px; padding: 0 16px'; K.btnO = O + '; height: 40px; padding: 0 16px';
        K.oSm = O + '; height: 36px; padding: 0 14px; font-size: 13px'; K.gSm = G + '; height: 36px; padding: 0 12px; font-size: 13px'; K.pSm = P + '; height: 36px; padding: 0 16px; font-size: 13px';
        K.ico = G + '; width: 36px; height: 36px; padding: 0'; K.icoG = G + '; width: 32px; height: 32px; padding: 0';
        K.ctlW = inp + '; flex: 1 1 0; width: auto'; K.selW = inp + '; flex: 1 1 0; width: auto' + selx;
        K.rowLabel = 'flex: 0 1 auto; min-width: 0; max-width: 46%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis';
        K.item = K.item.replace('min-height: 34px', 'min-height: 44px');
        K.tabs = K.tabs.replace('height: 36px', 'height: 40px');
      }
      return K;
    }
    function tabStyle(t,on){return 'display: inline-flex; align-items: center; justify-content: center; gap: 7px; height: 100%; padding: 0 12px; box-sizing: border-box; border: none; border-radius: '+t.rCtl+'; background: '+(on?t.tabOn:'transparent')+'; color: '+(on?t.fg:t.mutedFg)+'; box-shadow: '+(on?t.tabSh:'none')+'; font: inherit; font-size: 13px; font-weight: 500; white-space: nowrap; flex-shrink: 0; cursor: pointer';}
    function box(t,on){return 'width: 16px; height: 16px; flex: 0 0 16px; box-sizing: border-box; border-radius: '+t.rBox+'; background: '+(on?t.primary:t.off)+'; color: '+t.primaryFg+'; display: inline-flex; align-items: center; justify-content: center; transition: background-color 0.15s ease';}
    function chip(t,on,mob){return 'height: '+(mob?'36px':'32px')+'; padding: 0 14px; box-sizing: border-box; border: none; border-radius: '+t.rCtl+'; background: '+(on?t.primary:t.fill)+'; color: '+(on?t.primaryFg:t.fg)+'; font: inherit; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer';}
    function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
    var MS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    function md(iso) { return iso ? MS[+iso.slice(5, 7) - 1] + ' ' + (+iso.slice(8, 10)) : ''; }

    var self = this, p = this.props, st = this.state, dark = !!p.dark;
    var look = { color: p.color || 'studio' };
    var frame = !!p.frame, standalone = !frame && typeof p.onClose !== 'function';
    var vw = 1440; try { vw = window.innerWidth || 1440; } catch (e) {}
    // Phone layout: the app passes mobile; a board frame on a narrow screen follows the screen (never the homepage demo).
    var mob = !!p.mobile || (frame && !p.demo && vw < 768);
    var t = theme(look.color, dark, look.radius), k = kit(t, mob);
    var show = frame || standalone ? true : !!p.open;
    var kind = st.kind, step = st.step, f = st.f;
    var lockK = this.lockKind(), isLocked = !!lockK, vs = isLocked ? '' : step;
    var D = this.data();
    var ICA = 'M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', ICW = 'M12 20h.01M8.5 16.43a5 5 0 0 1 7 0M2 8.82a15 15 0 0 1 20 0M5 12.86a10 10 0 0 1 14 0';
    var ICT = 'M12 3v18M3 9h18M3 15h18M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z', ICF = 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7zM14 2v4a2 2 0 0 0 2 2h4';
    var ICU = 'M18.84 12.25 20.56 10.54a5 5 0 0 0-7.07-7.07L11.76 5.18M5.17 11.75 3.45 13.46a5 5 0 0 0 7.07 7.07l1.71-1.71M8 2v3M2 8h3M16 22v-3M22 16h-3';
    function close() { self.clear(); if (typeof p.onClose === 'function') p.onClose(); }
    function setF(o) { self.setState({ f: Object.assign({}, self.state.f, o), pop: null }); }
    function pop(key) { return function () { self.setState({ pop: self.state.pop === key ? null : key }); }; }
    function online() { try { return navigator.onLine !== false; } catch (e) { return true; } }
    function noop() {}

    var HEAD = {
      form: st.att ? ['New deal', 'Fill in the details. Your contract stays attached.'] : ['New deal', 'Add the basics now. You can fill in the rest later.'],
      pick: ['Upload a contract or CSV', 'Talby reads it and fills in the details for you.'],
      reading: ['Reading your contract', 'This takes a few seconds.'],
      review: st.few ? ['Check the details', 'Talby found a few details. Add the rest below.'] : ['Check the details', 'Filled in from the contract. Fix anything that looks off.'],
      csvMap: ['Match your columns', 'Tell Talby what each column in your file means.'],
      csvPreview: ['Review your import', 'Here is what comes into Talby.'],
      connect: ['Import from Notion', 'Bring in the deals you already track in Notion.'],
      db: ['Pick your deals database', 'Choose where you keep your brand deals.'],
      map: ['Match the fields', 'Tell Talby what each Notion property means.'],
      preview: ['Review your import', 'Pick the deals to bring in.'],
      importing: ['Importing your deals', 'Keep this open for a moment.'],
      readFail: ['Could not read the contract', 'Your file is safe. Choose how to go on.'],
      csvEmpty: ['Check your file', 'Talby opened it but found nothing to bring in.'],
      csvPartial: ['3 deals did not come in', 'The other 12 are on your Deals page.'],
      notionSetup: ['Import from Notion', 'Bring in the deals you already track in Notion.'],
      connectDenied: ['Import from Notion', 'Bring in the deals you already track in Notion.'],
      notionLost: ['Reconnect Notion', 'Talby needs a fresh connection to keep going.'],
      dbNone: ['Pick your deals database', 'Choose where you keep your brand deals.'],
      dbEmpty: ['Pick your deals database', 'Choose where you keep your brand deals.'],
      fetchFail: ['Pick your deals database', 'Choose where you keep your brand deals.'],
      importPartial: ['2 deals did not come in', 'The other 4 are on your Deals page.']
    };
    var head = { title: (HEAD[step] || HEAD.form)[0], desc: (HEAD[step] || HEAD.form)[1] };
    var ioRes = this.io() && st.res && (step === 'csvPartial' || step === 'importPartial') ? st.res : null, ioNF = ioRes ? (ioRes.failed || []).length : 0;
    if (ioRes) head = { title: ioNF + (ioNF === 1 ? ' deal did' : ' deals did') + ' not come in', desc: 'The other ' + ioRes.imported + (ioRes.imported === 1 ? ' is' : ' are') + ' on your Deals page.' };

    var BASE = { readFail: 'reading', csvEmpty: 'csvMap', notionSetup: 'connect', connectDenied: 'connect', notionLost: 'connect', dbNone: 'db', dbEmpty: 'db', fetchFail: 'db' };
    var sb = BASE[step] || step;
    var SEQ = isLocked ? [] : kind === 'notion' ? [['connect', 'Connect'], ['db', 'Database'], ['map', 'Fields'], ['preview', 'Review']]
      : kind === 'upload' ? (st.src === 'csv' ? [['pick', 'Upload'], ['csvMap', 'Columns'], ['csvPreview', 'Review']] : [['pick', 'Upload'], ['reading', 'Read'], ['review', 'Review']]) : [];
    var idx = 0; SEQ.forEach(function (s, i) { if (s[0] === sb) idx = i; }); if (step === 'importing' || step === 'csvPartial' || step === 'importPartial') idx = 4;
    var steps = SEQ.map(function (s, i) {
      var done = i < idx, cur = i === idx;
      return { n: String(i + 1), label: s[1], gap: i > 0, done: done, todo: !done, cur: cur ? 'step' : null, showLabel: !mob || cur,
        bg: done || cur ? t.primary : 'transparent', fg: done || cur ? t.primaryFg : t.mutedFg, ring: done || cur ? 'none' : ('1.5px solid ' + t.borderStrong),
        labelFg: cur ? t.fg : t.mutedFg, fw: cur ? '600' : '500', lineBg: i <= idx ? t.primary : t.border };
    });

    // Amount: digits, commas, dots, spaces and $ only. Anything else is shown as an inline error.
    var amtStr = String(f.amt || ''), amtBad = /[^\s$0-9,.]/.test(amtStr);
    var amt = parseFloat(amtStr.replace(/[^0-9.]/g, '')), hasAmt = !amtBad && !isNaN(amt) && amt > 0;
    var WHEN = ['When it posts', 'Net 15', 'Net 30', 'Net 45', 'Net 60', 'On a set date'], UP = ['25%', '50%', '75%'];
    var NDO = [['once', 'All at once', 'One payment after you post.'], ['split', 'Split', 'Part when you sign, the rest after you post.'], ['parts', 'In parts', 'Several payments, you set each date.'], ['monthly', 'Monthly', 'The same amount every month.']];
    var P = f.paid, postLabel = f.post ? md(f.post) : 'your post date';
    function sel(key, label, list, idx2, suffix) {
      var open = st.pop === key;
      return { label: label, isSel: true, isStep: false, open: open, value: list[idx2] + (suffix || ''), toggle: pop(key), down: null, up: null,
        opts: list.map(function (lab, j) { var on = j === idx2; return { label: lab, on: on, check: on ? 'visible' : 'hidden', pick: function () { var o = {}; o[key] = j; setF(o); } }; }) };
    }
    function stepper(key, label, min, max) {
      return { label: label, isSel: false, isStep: true, open: false, value: String(f[key]), toggle: null, opts: [],
        down: function () { var o = {}; o[key] = Math.max(min, f[key] - 1); setF(o); }, up: function () { var o = {}; o[key] = Math.min(max, f[key] + 1); setF(o); } };
    }
    var payRows, plan;
    if (P === 'once') { payRows = [sel('when', 'When', WHEN, f.when)]; plan = [{ label: 'Full payment, ' + (f.when === 0 ? 'on ' + postLabel : f.when === 5 ? 'on a date you pick' : WHEN[f.when].replace('Net ', '') + ' days after ' + postLabel), amount: hasAmt ? fmt(amt) : '$0' }]; }
    else if (P === 'split') { var upv = [0.25, 0.5, 0.75][f.up]; payRows = [sel('up', 'Upfront', UP, f.up, ' when you sign'), sel('bal', 'Balance', WHEN, f.bal)]; plan = [{ label: '1 of 2, when you sign', amount: hasAmt ? fmt(amt * upv) : '$0' }, { label: '2 of 2, ' + (f.bal === 0 ? 'when you post' : f.bal === 5 ? 'on a date you pick' : WHEN[f.bal].replace('Net ', '') + ' days after the last post'), amount: hasAmt ? fmt(amt * (1 - upv)) : '$0' }]; }
    else if (P === 'parts') { payRows = [stepper('parts', 'Number of payments', 2, 6)]; plan = []; for (var pp = 1; pp <= f.parts; pp++) plan.push({ label: pp + ' of ' + f.parts + ', you pick the date', amount: hasAmt ? fmt(amt / f.parts) : '$0' }); }
    else { payRows = [stepper('months', 'Months', 2, 12)]; plan = [{ label: 'Every month for ' + f.months + ' months', amount: hasAmt ? fmt(amt) + ' a month' : '$0 a month' }, { label: 'Total', amount: hasAmt ? fmt(amt * f.months) : '$0' }]; }
    var formInvalid = !(f.brand || '').trim() || !hasAmt;
    function createDeal() {
      // Invalid: say what is missing next to each field. Offline: keep the form and show the banner.
      if (formInvalid) { if (!self.state.tried) self.setState({ tried: true, pop: null }); return; }
      if (!online()) { self.setState({ saveErr: true, pop: null }); return; }
      var total = P === 'monthly' ? amt * f.months : amt, active = f.status === 'Active';
      self.done({ kind: 'deal', count: 1, contract: (self.io() && self.state.rd && self.state.rd.fileId) || null, form: Object.assign({}, f), plan: plan, deals: [{ brand: f.brand.trim(), amt: total, status: f.status, post: f.post || '' }],
        title: 'Deal added', chip: active ? '+' + fmt(total) + ' booked' : 'Negotiating',
        line: f.brand.trim() + (active ? ' is in. That makes ' + ((typeof p.dealsThisYear === 'number' ? p.dealsThisYear : 26) + 1) + ' deals this year.' : ' is saved. It counts once it is signed.') });
    }
    var brandBad = !!st.tried && !(f.brand || '').trim();
    var amtMsg = amtBad ? 'Use numbers only, like 2500.' : (st.tried && !hasAmt ? (P === 'monthly' ? 'Add the amount per month, like 500.' : 'Add the amount, like 2500.') : '');
    function vrow(bad, msg, id) {
      return { bad: bad, msg: msg, desc: bad ? id : null,
        row: bad ? k.row + '; align-items: flex-start' : k.row, label: bad ? k.rowLabel + '; padding-top: 8px' : k.rowLabel,
        col: (mob ? 'flex: 1 1 0' : 'flex: 0 1 300px') + '; min-width: 0; display: flex; flex-direction: column; gap: 6px',
        ctl: k.ctlW + '; flex: none; width: 100%' + (bad ? '; box-shadow: inset 0 0 0 1px ' + t.destr : '') };
    }

    var FIELDS = [['brand', 'Brand'], ['amt', 'Total amount'], ['post', 'Post date'], ['payby', 'Pay by date'], ['status', 'Status'], ['pay', 'Payment status'], ['plats', 'Platforms'], ['rep', 'Rep name'], ['repEmail', 'Rep email'], ['notes', 'Notes'], ['skip', 'Skip this column']];
    function fieldName(key) { for (var i = 0; i < FIELDS.length; i++) if (FIELDS[i][0] === key) return FIELDS[i][1]; return 'Skip this column'; }
    function mapRowsFor(list, mapKey, popPrefix) {
      return list.map(function (c, i) {
        var val = st[mapKey][i], key = popPrefix + i, open = st.pop === key, skip = val === 'skip';
        return { col: c[0], sample: c[1], type: c[2], field: fieldName(val), fg: skip ? t.mutedFg : t.fg, dot: skip ? t.borderStrong : '#22C55E', line: i ? '1px solid ' + t.line : 'none', open: open, toggle: pop(key),
          hasValues: !!c[3], values: c[3] || [], popY: i >= 4 ? 'top: auto; bottom: calc(100% - 4px)' : 'top: 48px',
          opts: FIELDS.map(function (fl) { var on = fl[0] === val; return { label: fl[1], on: on, check: on ? 'visible' : 'hidden', pick: function () { var o = Object.assign({}, self.state[mapKey]); o[i] = fl[0]; var u = { pop: null }; u[mapKey] = o; self.setState(u); } }; }) };
      });
    }
    var CSV_COLS = [['Brand name', 'Fern and Fig Kitchen'], ['Fee', '$2,500'], ['Post date', '11/04/2026'], ['Stage', 'Signed'], ['Paid?', 'No'], ['Contact', 'Mia Chen'], ['Notes', 'Send raw files by Friday']];
    if (st.csvData) CSV_COLS = (st.csvData.cols || []).map(function (c) { return [c.name, c.sample || '']; });
    var mapRows = mapRowsFor(CSV_COLS, 'map', 'm');
    var matched = Object.keys(st.map).filter(function (x) { return st.map[x] !== 'skip'; }).length;
    var skipped = CSV_COLS.filter(function (c, i) { return st.map[i] === 'skip'; }).map(function (c) { return c[0]; });
    var noBrand = !Object.keys(st.map).some(function (x) { return st.map[x] === 'brand'; });
    var CSV_ROWS = [['Fern and Fig Kitchen', 'Nov 4', 'Active', 2500, 0], ['Marlow Athletics', 'Nov 12', 'Active', 4500, 0], [this.props.demo ? 'Halcyon Skincare' : 'CeraVe', 'Oct 15', 'Active', 8000, 1], ['Pocket Pantry', 'Nov 18', 'Negotiating', 1800, 0], ['Golden Hour Travel', 'Dec 1', 'Active', 0, 0], ['Juniper Skin', 'Dec 6', 'Active', 3200, 0]];
    var csvN = (st.skipDup ? 15 : 18) - (st.issues ? 1 : 0), csvBooked = st.skipDup ? 41750 : 57750;
    if (st.csvData) {
      CSV_ROWS = (st.csvData.rows || []).map(function (r) { return [r.brand, self.ioDate(r.post), r.status || 'Active', Number(r.amount) || 0, r.repeat ? 1 : 0, !!r.noDate || !r.post]; });
      var ioKeep = CSV_ROWS.filter(function (r) { return !(st.skipDup && r[4]); });
      csvN = ioKeep.length; csvBooked = ioKeep.filter(function (r) { return r[2] === 'Active'; }).reduce(function (a, r) { return a + r[3]; }, 0);
    }
    var ioRep = CSV_ROWS.filter(function (r) { return r[4]; }).length, ioZero = CSV_ROWS.filter(function (r) { return !r[3]; }).length;

    var NPROPS = [['Name', '', 'Title'], ['Deal Value', '', 'Number'], ['Stage', '', 'Select', [{ from: 'Signed', to: 'Active' }, { from: 'Talking', to: 'Negotiating' }, { from: 'Wrapped', to: 'Active' }]], ['Post Date', '', 'Date'], ['Payment', '', 'Select', [{ from: 'Paid', to: 'Paid' }, { from: 'Invoiced', to: 'Invoiced' }, { from: 'Waiting', to: 'Not invoiced' }]], ['Due', '', 'Date'], ['Brand Contact', '', 'Text']];
    if (st.nprops) NPROPS = st.nprops.map(function (x) { return [x.name, '', x.type || 'Text', x.values && x.values.length ? x.values.map(function (v) { return typeof v === 'string' ? { from: v, to: v } : v; }) : undefined]; });
    var nmapRows = mapRowsFor(NPROPS.map(function (x) { return [x[0], '', x[2], x[3]]; }), 'nmap', 'n');
    var NR = this.NROWS();
    var newRows = NR.filter(function (r) { return !r[5]; });
    var nSelN = this.selN(), allSel = nSelN === newRows.length;
    var nBooked = NR.filter(function (r) { return st.nsel[r[0]] && !r[5] && r[3] === 'Active'; }).reduce(function (a, r) { return a + r[4]; }, 0);
    var DBS = [['deals', 'Brand Deals 2026', '8 pages · Edited yesterday', true], ['content', 'Content Calendar', '64 pages · Edited today', false], ['contacts', 'Brand Contacts', '41 pages · Edited last week', false], ['invoices', 'Invoices', '19 pages · Edited Oct 2', false]];
    if (st.dbs) DBS = st.dbs.map(function (d) { return [d.id, d.name, d.meta || '', !!d.looksLikeDeals]; });
    var ioDb = st.dbs ? (st.dbs.filter(function (d) { return d.id === st.db; })[0] || {}).name || '' : '';
    var dq = (st.dbQ || '').trim().toLowerCase();
    var dbs = DBS.filter(function (d) { return !dq || d[1].toLowerCase().indexOf(dq) !== -1; }).map(function (d) {
      var on = st.db === d[0];
      return { name: d[1], meta: d[2], rec: d[3], on: on, bg: on ? t.card : t.tile, hv: on ? t.card : t.fillHover, ring: on ? ('inset 0 0 0 2px ' + t.primary) : ('inset 0 0 0 1px ' + t.border),
        radioBorder: on ? 'none' : ('1.5px solid ' + t.borderStrong), radioBg: on ? t.primary : 'transparent', dot: on ? 'visible' : 'hidden', pick: function () { self.setState({ db: d[0] }); } };
    });
    var impList = this.impList();
    var impTotal = impList.length || 1;

    // Error and recovery panels. One shape for all: an optional file or connection tile, a block, then help.
    function tryRead() { if (self.io() && self._file) { self.gotFile(self._file); return; } self.go('reading'); }
    function byHand() { self.clear(); self.setState({ kind: 'new', step: 'form', f: Object.assign({}, D.F0), att: st.fileInfo && self.io() ? st.fileInfo.name : 'Signed_agreement_scan.pdf', tried: false, saveErr: false, pop: null }); }
    function toCsv() { self.clear(); self.setState({ kind: 'upload', src: 'csv', step: 'pick', zerr: '', busy: false, pop: null }); }
    function connectGo() { if (self.state.busy) return; self.setState({ busy: true }); if (self.io()) self.connectIO(false); }
    function connectBack() { if (self.state.busy) { self.clear(); self.setState({ busy: false, step: 'connectDenied' }); } else close(); }
    function retryFailed() { if (self.io() && self.state.res) { self.go('importing', { retry: (self.state.res.failed || []).map(function (x) { return [x.id, x.brand, '', 'Active', Number(x.amount) || 0, 0, '', x.id]; }) }); return; } var D2 = self.data(); self.go('importing', { retry: (self.state.kind === 'upload' ? D2.CSV_FAIL : D2.NOTION_FAIL).map(function (r) { return r.slice(0, 7); }) }); }
    function E(o) {
      var err = o.tone === 'error';
      return Object.assign({ hasFile: false, badge: '', badgeBg: t.tile, badgeFg: t.fg, fileName: '', fileMeta: '', hasTag: false, tag: '', hasChange: false, change: noop, hasConn: false,
        tileBg: err ? t.badBg : t.tile, tileFg: err ? t.badFg : t.fg, role: err ? 'alert' : 'status', pad: '28px 16px 10px',
        cta: '', act: noop, cta2: '', act2: noop, hasSteps: false, stepsTitle: '', hasPerms: false }, o, { hasCta: !!o.cta, has2: !!o.cta2,
        steps: (o.steps || []).map(function (x, i) { return { n: String(i + 1), text: x }; }) });
    }
    var EPS = {
      readFail: E({ tone: 'error', hasFile: true, badge: 'PDF', badgeBg: t.pdfBg, badgeFg: t.pdfFg, fileName: (self.io() && st.fileInfo ? st.fileInfo.name : 'Signed_agreement_scan.pdf'), fileMeta: self.io() && st.fileInfo ? st.fileInfo.size : '8.1 MB · 6 pages', hasTag: true, tag: 'Not read',
        icon: ICA, title: 'This looks like a scanned image', sub: 'Talby reads the words in a contract, and this PDF is only pictures of pages. Try again, or fill in the details by hand. The file stays attached either way.',
        cta: 'Try again', act: tryRead, cta2: 'Fill it in by hand', act2: byHand }),
      csvEmpty: E({ tone: 'error', hasFile: true, badge: 'CSV', badgeBg: t.csvBg, badgeFg: t.csvFg, fileName: (self.io() && st.fileInfo ? st.fileInfo.name : 'Brand deals 2026.csv'), fileMeta: '0 rows found', hasChange: true, change: function () { self.go('pick'); },
        icon: ICT, title: 'No deals found in this file', sub: 'It looks empty, or it was saved in a way Talby cannot open. Check that your deals are on the first sheet, save it as CSV, then upload it again.',
        cta: 'Choose another file', act: function () { self.go('pick'); }, cta2: 'Sample CSV', act2: noop }),
      notionSetup: E({ tone: 'neutral', icon: ICA, title: 'Notion import is not ready yet', sub: 'This is on our side, not yours, and we are working on it. For now, export your database from Notion as a CSV and upload it here. The same deals come in.',
        cta: 'Upload a CSV instead', act: toCsv, hasSteps: true, stepsTitle: 'Export from Notion',
        steps: ['Open your deals database in Notion.', 'Click the three dots at the top right, then Export.', 'Unzip the download and upload the CSV here.'] }),
      connectDenied: E({ tone: 'neutral', icon: ICU, title: 'Notion was not connected', sub: 'The Notion window closed before access was given, so nothing was shared. Connect again and choose Allow access when Notion asks.', hasPerms: true }),
      notionLost: E({ tone: 'error', icon: ICU, title: 'Talby lost its connection to Notion', sub: 'Access may have been removed in Notion, or the connection ran out. Reconnect to pick up where you left off. Nothing in Talby or Notion changed.', hasPerms: true }),
      dbNone: E({ tone: 'neutral', hasConn: true, icon: ICT, title: 'Talby cannot see any databases yet', sub: 'Notion only shows Talby the pages you share with it. Share your deals database, then check again.',
        cta: 'Check again', act: function () { self.go('db'); }, hasSteps: true, stepsTitle: 'Share a database with Talby',
        steps: ['Open your deals database in Notion.', 'Click the three dots at the top right, then Connections.', 'Find Talby in the list and confirm.'] }),
      dbEmpty: E({ tone: 'neutral', hasConn: true, icon: ICT, title: (ioDb || 'Brand Deals 2027') + ' is empty', sub: 'There are no pages in it yet, so there is nothing to bring in. Pick another database, or add your deals in Notion and check again.',
        cta: 'Pick another database', act: function () { self.go('db'); }, cta2: 'Check again', act2: function () { self.go('map'); } }),
      fetchFail: E({ tone: 'error', hasConn: true, icon: ICW, title: 'Talby could not load ' + (ioDb || (self.io() ? 'your databases' : 'Brand Deals 2026')), sub: 'Notion did not answer this time. Nothing changed in Notion or in Talby. Try again in a moment.',
        cta: 'Try again', act: function () { self.go('map'); }, cta2: 'Pick another database', act2: function () { self.go('db'); } })
    };
    var ep = EPS[vs] || E({ tone: 'neutral', icon: ICA, title: '', sub: '' });
    var csvPart = kind === 'upload';
    var PF = ioRes ? (ioRes.failed || []).map(function (x) { return [x.id, x.brand, '', 'Active', Number(x.amount) || 0, 0, '', x.reason || 'It did not save']; }) : (csvPart ? D.CSV_FAIL : D.NOTION_FAIL);
    var ioDl = ioNF === 1 ? ' deal' : ' deals';
    var pt = { title: ioRes ? ioRes.imported + ' of ' + (ioRes.imported + ioNF) + ' deals imported' : csvPart ? '12 of 15 deals imported' : '4 of 6 deals imported',
      sub: ioRes ? (csvPart ? 'The connection dropped while saving ' + ioNF + ioDl + '. Try again to bring ' + (ioNF === 1 ? 'it' : 'them') + ' in.' : 'Notion stopped answering partway, so ' + ioNF + ioDl + ' did not save. Try again to bring ' + (ioNF === 1 ? 'it' : 'them') + ' in.')
        : csvPart ? 'The connection dropped while saving 3 deals. Try again to bring them in.' : 'Notion stopped answering partway, so 2 deals did not save. Try again to bring them in.',
      note: (ioRes ? 'The ' + ioRes.imported : csvPart ? 'The 12' : 'The 4') + ' that came in are on your Deals page. Trying again will not add them twice.',
      rows: PF.map(function (r, i) { return { brand: r[1], why: r[7], amount: fmt(r[4]), rowStyle: i ? k.rowT : k.row }; }) };
    var ZE = {
      big: { icon: ICA, title: 'This file is over 20 MB', sub: 'Lumen_and_Lark_Full_Packet.pdf is 34.2 MB. Save a copy with just the contract pages, then drop it here.', cta: 'Choose another file' },
      type: { icon: ICF, title: 'Talby needs a PDF or Word file', sub: 'Partnership_Agreement.pages is a Pages file. Export it as a PDF or Word file, then drop it here.', cta: 'Choose another file' },
      offline: { icon: ICW, title: 'You are offline', sub: 'Talby needs the internet to read your file. Check your connection, then try again. Nothing was sent.', cta: 'Try again' }
    };
    if (this.io() && st.fileInfo) {
      ZE.big = Object.assign({}, ZE.big, { sub: st.fileInfo.name + ' is ' + st.fileInfo.size + '. Save a copy with just the contract pages, then drop it here.' });
      ZE.type = Object.assign({}, ZE.type, { sub: st.fileInfo.name + ' is not a PDF or Word file. Export it as a PDF or Word file, then drop it here.' });
    }
    var zerr = ZE[st.zerr] || ZE.big;

    var FILE = 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7zM14 2v4a2 2 0 0 0 2 2h4', CHECK = 'M20 6 9 17l-5-5', UPL = 'M12 3v12M17 8l-5-5-5 5M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', EYE = 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z';
    var FOOT = {
      form: [st.att ? FILE : '', st.att ? 'Your contract is saved to this deal' : '', true, 'Cancel', close, true, 'Create deal', createDeal, formInvalid],
      pick: ['M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4', 'Your file stays private to your account', true, 'Cancel', close, false, '', null, false],
      reading: [FILE, (self.io() && st.fileInfo ? st.fileInfo.name : 'Lumen_and_Lark_Partnership_Agreement.pdf'), true, 'Cancel', function () { self.clear(); self.go('pick'); }, false, '', null, false],
      review: [FILE, 'The contract is saved to this deal', true, 'Back', function () { self.go('pick'); }, true, 'Create deal', createDeal, formInvalid],
      csvMap: [CHECK, matched + ' of ' + CSV_COLS.length + ' columns matched', true, 'Back', function () { self.go('pick'); }, true, 'Next', function () { if (!noBrand) self.go('csvPreview'); }, noBrand],
      csvPreview: [UPL, csvN + ' deals will be added', true, 'Back', function () { self.go('csvMap'); }, true, 'Import ' + csvN + ' deals', function () { if (self.io()) { self.go('importing'); return; } self.done({ kind: 'import', count: csvN, deals: [], title: csvN + ' deals imported', chip: '+' + fmt(csvBooked) + ' booked', line: 'They are on your Deals page with dates and amounts.' }); }, false],
      connect: [EYE, 'Talby only reads what you pick', true, 'Cancel', connectBack, true, st.busy ? 'Waiting for Notion' : 'Connect Notion', connectGo, false],
      db: [CHECK, 'Connected to Notion', true, 'Back', function () { self.go('connect'); }, true, 'Next', function () { if (self.state.db) self.go('map'); }, !st.db],
      map: [CHECK, Object.keys(st.nmap).filter(function (x) { return st.nmap[x] !== 'skip'; }).length + ' of ' + NPROPS.length + ' fields matched', true, 'Back', function () { self.go('db'); }, true, 'Next', function () { self.go('preview'); }, false],
      preview: [CHECK, nSelN + ' of ' + newRows.length + ' new deals selected', true, 'Back', function () { self.go('map'); }, true, 'Import ' + nSelN + (nSelN === 1 ? ' deal' : ' deals'), function () { if (nSelN) self.go('importing'); }, nSelN === 0],
      importing: [UPL, Math.min(st.prog, impTotal) + ' of ' + impTotal + ' imported', false, '', null, false, '', null, false],
      readFail: [FILE, (self.io() && st.fileInfo ? st.fileInfo.name : 'Signed_agreement_scan.pdf'), true, 'Back', function () { self.go('pick'); }, false, '', null, false],
      csvEmpty: [FILE, (self.io() && st.fileInfo ? st.fileInfo.name : 'Brand deals 2026.csv'), true, 'Back', function () { self.go('pick'); }, false, '', null, false],
      csvPartial: [UPL, ioRes ? ioRes.imported + ' of ' + (ioRes.imported + ioNF) + ' imported' : '12 of 15 imported', true, 'Done', function () { self.partialDone(); }, true, 'Try again', retryFailed, false],
      notionSetup: ['', '', true, 'Cancel', close, false, '', null, false],
      connectDenied: [EYE, 'Talby only reads what you pick', true, 'Cancel', connectBack, true, st.busy ? 'Waiting for Notion' : 'Connect Notion', connectGo, false],
      notionLost: [EYE, 'Talby only reads what you pick', true, 'Cancel', connectBack, true, st.busy ? 'Waiting for Notion' : 'Reconnect', connectGo, false],
      dbNone: [CHECK, 'Connected to Notion', true, 'Back', function () { self.go('connect'); }, true, 'Next', noop, true],
      dbEmpty: [CHECK, 'Connected to Notion', true, 'Back', function () { self.go('db'); }, false, '', null, false],
      fetchFail: [CHECK, 'Connected to Notion', true, 'Back', function () { self.go('db'); }, false, '', null, false],
      importPartial: [UPL, ioRes ? ioRes.imported + ' of ' + (ioRes.imported + ioNF) + ' imported' : '4 of 6 imported', true, 'Done', function () { self.partialDone(); }, true, 'Try again', retryFailed, false]
    };
    var F = FOOT[step] || FOOT.form;
    var connLike = step === 'connect' || step === 'connectDenied' || step === 'notionLost';
    var foot = { icon: F[0], meta: F[1], hasBack: F[2], backLabel: F[3], back: F[4] || function () {}, hasNext: F[5], nextLabel: F[6], next: F[7] || function () {}, off: !!F[8], op: F[8] ? '0.4' : '1', busy: connLike && st.busy, notion: connLike && !st.busy };
    var footBare = !F[2] && !F[5];

    var readRowsDef = [['Brand and rep', 'Lumen and Lark Skincare Co., Danielle Ortiz'], ['Amount and payment terms', '$6,000, half when you sign, half Net 30'], ['Post date and deliverables', 'Nov 4, 1 TikTok video and 1 Instagram Reel'], ['Bonus and commission', '$1,000 at 100K views, 10% with code ' + (this.props.demo ? 'JUNO15' : 'CAMQ15') + '']];
    if (st.rd) readRowsDef = readRowsDef.map(function (r, i) { var x = (st.rd.found || [])[i]; x = Array.isArray(x) ? x[1] : x; return [r[0], x || 'Not in this contract']; });
    var readN = Math.min(st.read, 4);
    var swOn = st.sync;
    var nowrap = 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis', wrap = 'white-space: normal';
    var sheetTail = 'position: fixed; left: 0; right: 0; bottom: 0; top: auto; width: auto; max-height: 72vh; overflow-y: auto; z-index: 82; padding: 4px 10px calc(14px + env(safe-area-inset-bottom)); border-radius: ' + t.rDialog + ' ' + t.rDialog + ' 0 0; border-left: none; border-right: none; border-bottom: none';
    var lkC = lockK === 'canceled';
    return {
      t: t, k: k, look: look, dark: dark, show: show, mob: mob, notMob: !mob, titleFam: t.titleFam,
      vars: '--hv: ' + t.hover + '; --fg: ' + t.fg + '; --ring: ' + t.ring + '; --pr: ' + t.primary,
      wrapPos: frame ? 'relative' : (standalone ? 'absolute' : 'fixed'), wrapPad: frame && !mob ? '40px 40px' : (mob ? '0' : '24px'), wrapMinH: frame ? (mob ? '100vh' : '820px') : '0px', wrapH: frame ? (mob ? '100vh' : '100%') : 'auto',
      wrapBg: frame ? t.frameBg : (standalone ? t.page : 'transparent'), hasOverlay: !frame && !standalone,
      dlgAnim: mob ? 'a-up' : 'a-pop', dlgW: mob ? '100%' : (isLocked ? '440px' : '640px'), dlgH: mob ? (isLocked ? 'auto' : '100%') : (isLocked ? 'auto' : (frame ? '740px' : (kind === 'new' ? 'auto' : '720px'))), dlgMaxH: mob ? '100%' : (frame ? 'none' : 'calc(100vh - 48px)'),
      dlgBorder: mob ? 'none' : ('1px solid ' + t.border), dlgRadius: mob ? (isLocked ? t.rDialog + ' ' + t.rDialog + ' 0 0' : '0px') : t.rDialog, wrapAlign: mob && isLocked ? 'flex-end' : 'center', btnFlex: mob ? '1 1 0' : '0 0 auto',
      hdPad: mob ? '18px 10px 12px 16px' : '22px 18px 14px 24px', stepPad: mob ? '0 16px 14px' : '0 24px 16px', bodyPad: mob ? '4px 16px 20px' : '4px 24px 22px',
      footPad: mob ? '12px 16px calc(12px + env(safe-area-inset-bottom))' : '14px 24px 18px',
      descSt: mob ? wrap : nowrap, subSt: mob ? wrap : nowrap, statSt: mob ? 'white-space: normal; line-height: 1.35' : nowrap,
      bn: { wrap: mob ? 'flex-wrap: wrap' : '', col: mob ? 'flex: 1 1 180px; min-width: 0' : 'flex: 1 1 auto; min-width: 0', text: mob ? 'white-space: normal; overflow-wrap: anywhere' : nowrap, btn: mob ? '; margin-left: 30px' : '', btnR: mob ? '; margin-left: 36px' : '' },
      dateBox: mob ? 'flex: 1 1 0; min-width: 0' : 'flex: 0 1 300px; min-width: 0', stepGrpH: mob ? '40px' : '34px',
      popAnim: mob ? 'a-up' : 'a-drop', sheetScrim: mob && !!st.pop && !isLocked, closePop: function () { self.setState({ pop: null }); },
      ps: { status: mob ? 'position: fixed' : 'position: absolute; top: 48px; right: 10px; width: 260px', pay: mob ? 'position: fixed' : 'position: absolute; top: 48px; right: 10px; width: 240px',
        map: mob ? 'position: fixed' : 'position: absolute; top: 48px; right: 12px; width: 220px; max-height: 260px; overflow-y: auto', tail: mob ? sheetTail : '', head: 'display: block; padding: 12px 10px 8px; ' + k.caps },
      close: close, head: head, hasSteps: SEQ.length > 0, steps: steps, bodyLine: SEQ.length ? ('1px solid ' + t.line) : 'none',
      isLocked: isLocked, notLocked: !isLocked,
      lk: { title: lkC ? 'Your plan is canceled' : 'Your free trial ended', sub: lkC ? 'Restart your plan to add more deals. Everything you already added is safe, and you can still see it all.' : 'Upgrade to add more deals. Everything you already added is safe, and you can still see it all.',
        pad: mob ? '0 4px calc(12px + env(safe-area-inset-bottom))' : '0 16px 14px', row: mob ? 'width: 100%; max-width: 360px' : '', btnP: k.btnP + (mob ? '; flex: 1 1 0' : ''), btnO: k.btnO + (mob ? '; flex: 1 1 0' : ''), cta: lkC ? 'Restart plan' : 'Upgrade' },
      upgrade: function () { try { window.localStorage.setItem('talby.settingsTab', 'billing'); window.location.href = 'SSettings.dc.html'; } catch (e) {} },
      isPick: vs === 'pick', isReading: vs === 'reading', showForm: vs === 'form' || vs === 'review', isReview: vs === 'review', reviewAll: vs === 'review' && !st.few, reviewFew: vs === 'review' && !!st.few, amtDot: vs === 'review' && !st.few,
      isCsvMap: vs === 'csvMap', isCsvPreview: vs === 'csvPreview', isConnect: vs === 'connect', isDb: vs === 'db', isMap: vs === 'map', isPreview: vs === 'preview', isImporting: vs === 'importing',
      isErrPanel: !!EPS[vs], ep: ep, isPartial: vs === 'csvPartial' || vs === 'importPartial', pt: pt,
      saveErr: !!st.saveErr && (vs === 'form' || vs === 'review'), retrySave: createDeal, hasAtt: !!st.att && vs === 'form', att: st.att, dropAtt: function () { self.setState({ att: '' }); },
      switchWs: function () { self.setState({ step: 'connect', busy: true, pop: null }); if (self.io()) self.connectIO(true); },
      dragOver: function (e) { if (self.io()) e.preventDefault(); },
      dropFile: function (e) { if (!self.io()) return; e.preventDefault(); var fl = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (fl) self.gotFile(fl); }, sampleCsv: noop,
      srcTabs: [['contract', 'Contract', 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7zM14 2v4a2 2 0 0 0 2 2h4'], ['csv', 'CSV or Excel', 'M12 3v18M3 9h18M3 15h18M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z']].map(function (x) { var on = st.src === x[0]; return { label: x[1], icon: x[2], on: on, style: tabStyle(t, on), pick: function () { self.setState({ src: x[0], zerr: '' }); } }; }),
      isContractSrc: st.src === 'contract', isCsvSrc: st.src === 'csv',
      zone: st.src === 'csv' ? { icon: 'M12 3v18M3 9h18M3 15h18M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z', title: 'Drop a CSV or Excel file', sub: 'You match the columns on the next step.' } : { icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12', title: 'Drop your contract here', sub: 'PDF or Word, up to 20 MB' },
      zoneOk: !st.zerr, zoneErr: !!st.zerr, zerr: zerr,
      choose: function () { if (!online()) { self.setState({ zerr: 'offline', pop: null }); return; } if (self.io()) { self.pickFile(); return; } self.go(self.state.src === 'csv' ? 'csvMap' : 'reading', { zerr: '' }); },
      findCols: mob ? 'minmax(0, 1fr)' : 'repeat(2, minmax(0, 1fr))',
      finds: [['Brand, rep and contact', 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z'], ['Amount and how you get paid', 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'], ['Post dates and deliverables', 'M8 2v4M16 2v4M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM3 10h18'], ['Bonus, commission and usage', 'M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z']].map(function (x) { return { label: x[0], icon: x[1] }; }),
      readPct: Math.round(readN / 4 * 100) + '%', readNum: String(Math.round(readN / 4 * 100)),
      readRows: readRowsDef.map(function (r, i) { var done = i < readN, cur = i === readN; return { label: r[0], found: r[1], done: done, cur: cur, wait: !done && !cur, labelFg: done || cur ? t.fg : t.mutedFg, rowStyle: i ? k.rowT : k.row }; }),
      backToPick: function () { self.go('pick'); },
      f: f, setBrand: function (e) { setF({ brand: e.target.value }); }, setAmt: function (e) { setF({ amt: e.target.value }); },
      setPost: function (v) { setF({ post: v }); }, setRep: function (e) { setF({ rep: e.target.value }); }, setRepEmail: function (e) { setF({ repEmail: e.target.value }); },
      vb: vrow(brandBad, 'Add a brand name.', 'ad-brand-err'), va: vrow(!!amtMsg, amtMsg, 'ad-amt-err'),
      statusOpen: st.pop === 'status', popStatus: pop('status'),
      statusOpts: [['Active', 'Signed and counted in your totals'], ['Negotiating', 'Not signed yet, not counted']].map(function (x) { var on = f.status === x[0]; return { label: x[0], desc: x[1], on: on, check: on ? 'visible' : 'hidden', pick: function () { setF({ status: x[0] }); } }; }),
      plats: ['TikTok', 'Instagram', 'YouTube', 'Facebook', 'Other'].map(function (lab) { var on = !!f.plats[lab]; return { label: lab, on: on, icon: PLATICON[lab] || '', hasIcon: !!PLATICON[lab], pad: PLATICON[lab] ? '0 14px 0 8px' : '0 14px', style: chip(t, on, mob), pick: function () { var o = Object.assign({}, f.plats); o[lab] = !on; setF({ plats: o }); } }; }),
      amtLabel: P === 'monthly' ? 'Amount per month' : 'Total amount',
      payOpts: NDO.map(function (o) { var on = P === o[0]; return { label: o[1], on: on, style: tabStyle(t, on), pick: function () { setF({ paid: o[0] }); } }; }),
      howHint: NDO.filter(function (o) { return o[0] === P; })[0][2], payRows: payRows, plan: plan,
      reviewExtras: vs === 'review' && !st.few && !(st.rd && !(st.rd.extras && st.rd.extras.length)),
      extras: (st.rd ? st.rd.extras || [] : [['Bonus', 'If the Reel passes 100K views', '$1,000'], ['Commission', 'Sales with code ' + (this.props.demo ? 'JUNO15' : 'CAMQ15') + '', '10%'], ['Deliverables', '1 TikTok video, 1 Instagram Reel', '2 posts'], ['Usage', 'Brand can repost for 90 days', '90 days']]).map(function (x, i) { return { tag: x[0], text: x[1], value: x[2], rowStyle: i ? k.rowT : k.row }; }),
      ioT: (function () {
        var io = self.io(), fi = io ? st.fileInfo : null, rd = io ? st.rd : null, cd = io ? st.csvData : null, nR = CSV_ROWS.length;
        var rc = rd ? (rd.count != null ? rd.count : (rd.found || []).filter(Boolean).length) : 0, ni = cd ? (cd.issues || []).length : 0;
        return {
          file: fi ? fi.name : 'Lumen_and_Lark_Partnership_Agreement.pdf',
          fileMeta: fi ? fi.size + (rd && rd.pages ? ' · ' + rd.pages + (rd.pages === 1 ? ' page' : ' pages') : '') : '2.4 MB · 6 pages',
          found: rd ? rc + (rc === 1 ? ' detail' : ' details') + ' found in the contract' : '11 details found in the contract',
          few: rd ? 'Only ' + rc + (rc === 1 ? ' detail' : ' details') + ' found in the contract' : 'Only 3 details found in the contract',
          saved: (fi ? fi.name : 'Lumen_and_Lark_Partnership_Agreement.pdf') + ' is saved to this deal',
          csvFile: fi && cd ? fi.name : 'Brand deals 2026.csv',
          csvMeta: cd ? (cd.total != null ? cd.total : nR) + ' rows · ' + (cd.cols || []).length + ' columns' : '18 rows · 7 columns',
          hasMore: cd ? nR > 6 : true, more: cd ? 'And ' + (nR - 6) + ' more rows' : 'And 12 more rows',
          look: cd ? ni + (ni === 1 ? ' row needs' : ' rows need') + ' a look' : '3 rows need a look',
          noAmt: cd ? ioZero + (ioZero === 1 ? ' row has no amount. It comes' : ' rows have no amount. They come') + ' in as $0 so you can add it later.' : '1 row has no amount. It comes in as $0 so you can add it later.',
          skip: cd ? (ioRep ? 'Skip the ' + ioRep + (ioRep === 1 ? ' deal' : ' deals') + ' already in Talby' : 'Skip deals already in Talby') : 'Skip the 3 deals already in Talby',
          ws: io ? st.ws || 'your Notion' : "Chanelica's Notion"
        };
      })(),
      mapCols: mob ? 'minmax(0, 4fr) minmax(0, 5fr)' : 'minmax(0, 1fr) minmax(0, 1fr) 200px', mapRows: mapRows,
      mapNote: skipped.length ? 'Talby matched ' + matched + ' columns. ' + skipped.join(', ') + ' will be skipped.' : 'All ' + matched + ' columns are matched.',
      brandMapped: !noBrand, noBrand: noBrand,
      csvStats: [{ value: st.csvData ? String(st.csvData.total != null ? st.csvData.total : CSV_ROWS.length) : '18', label: 'rows in your file', fg: t.fg }, { value: String(csvN), label: 'new deals', fg: t.fg }, { value: st.skipDup ? (st.csvData ? String(ioRep) : '3') : '0', label: 'skipped as repeats', fg: t.mutedFg }],
      skipDup: st.skipDup, dupBox: box(t, st.skipDup), dupCheck: st.skipDup ? 'visible' : 'hidden', toggleDup: function () { self.setState({ skipDup: !self.state.skipDup }); },
      oneWarn: st.csvData && this.io() ? !st.issues && ioZero > 0 : !st.issues, rowIssues: !!st.issues,
      issues: st.csvData && this.io() ? st.csvData.issues || [] : ['Row 11 has no brand, so it stays out. Add one in your file to bring it in.', 'Juniper Skin has a post date Talby cannot read, so it comes in without one.', 'Golden Hour Travel has no amount, so it comes in as $0.'],
      csvRows: (st.csvData ? CSV_ROWS.slice(0, 6) : CSV_ROWS).map(function (r, i) { var dup = !!r[4], fix = st.csvData ? !!r[5] : !!st.issues && r[0] === 'Juniper Skin'; return { brand: r[0], l: r[0].charAt(0), sub: (fix ? 'No post date' : 'Posts ' + r[1]) + ' · ' + r[2], amount: r[3] ? fmt(r[3]) : '$0', amtFg: r[3] ? t.fg : '#D97706', isDup: dup, dupLabel: mob ? (st.skipDup ? 'Skipped' : 'In Talby') : (st.skipDup ? 'In Talby, skipped' : 'In Talby'), isFix: fix && !mob, fixLabel: 'No date', op: dup && st.skipDup ? '0.5' : '1', rowStyle: i ? k.rowT : k.row }; }),
      perms: [['M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'Reads only the database you pick', 'Talby never sees the rest of your workspace'], ['M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z', 'Never changes anything in Notion', 'Nothing is edited, moved or deleted'], ['M18.84 12.25 20.56 10.54a5 5 0 0 0-7.07-7.07L11.76 5.18M5.17 11.75 3.45 13.46a5 5 0 0 0 7.07 7.07l1.71-1.71M8 2v3M2 8h3M16 22v-3M22 16h-3', 'Disconnect any time', 'In Settings, under Connections']].map(function (x, i) { return { icon: x[0], title: x[1], sub: x[2], rowStyle: i ? k.rowT : k.row }; }),
      dbQ: st.dbQ, setDbQ: function (e) { self.setState({ dbQ: e.target.value }); }, dbs: dbs, noDb: dbs.length === 0,
      nmapCols: 'minmax(0, ' + (mob ? '7fr) minmax(0, 8fr)' : '1fr) 220px'), nmapRows: nmapRows,
      allSel: allSel, allBox: box(t, nSelN > 0), allCheck: nSelN > 0 ? 'visible' : 'hidden', allIcon: allSel ? 'M20 6 9 17l-5-5' : 'M5 12h14',
      selLabel: nSelN + ' of ' + newRows.length + ' new deals selected',
      toggleAllN: function () { var o = {}; if (!allSel) newRows.forEach(function (r) { o[r[0]] = true; }); self.setState({ nsel: o }); },
      nRows: NR.map(function (r, i) {
        var dup = !!r[5], on = !dup && !!st.nsel[r[0]], neg = r[3] === 'Negotiating';
        return { brand: r[1], sub: (mob && neg ? 'Negotiating · ' : '') + (r[2] ? 'Posts ' + r[2] : 'No post date') + ' · ' + r[6], amount: fmt(r[4]), isDup: dup, isNeg: neg, negBadge: neg && !mob, on: on, box: box(t, on), check: on ? 'visible' : 'hidden',
          line: '1px solid ' + t.line, op: dup ? '0.5' : '1', cursor: dup ? 'default' : 'pointer', hv: dup ? 'transparent' : t.hoverCard,
          toggle: function () { if (dup) return; var o = Object.assign({}, self.state.nsel); o[r[0]] = !o[r[0]]; self.setState({ nsel: o }); } };
      }),
      sync: swOn, toggleSync: function () { self.setState({ sync: !self.state.sync }); },
      swTrack: 'position: relative; display: inline-block; width: 36px; height: 20px; flex: 0 0 36px; border-radius: ' + (t.r ? '10px' : '0px') + '; background: ' + (swOn ? t.primary : t.off) + '; transition: background-color 0.2s ease',
      swKnob: 'position: absolute; top: 2px; left: ' + (swOn ? '18px' : '2px') + '; width: 16px; height: 16px; border-radius: ' + (t.r ? '8px' : '0px') + '; background: ' + (swOn ? t.primaryFg : '#FFFFFF') + '; box-shadow: 0 1px 2px rgba(0,0,0,0.25); transition: left 0.2s cubic-bezier(.4,0,.2,1)',
      impPct: Math.round(Math.min(st.prog, impTotal) / impTotal * 100) + '%', impLabel: 'Importing ' + Math.min(st.prog + 1, impTotal) + ' of ' + impTotal,
      impRows: impList.map(function (r, i) { var done = i < st.prog, cur = i === st.prog; return { brand: r[1], amount: fmt(r[4]), done: done, cur: cur, wait: !done && !cur, fg: done || cur ? t.fg : t.mutedFg, rowStyle: i ? k.rowT : k.row }; }),
      foot: foot, showMeta: !!F[1] && (!mob || footBare), noMeta: !mob && !F[1]
    };
  }
}
return Component;
})();

function render($s0, host) {
  const { A, T, I, V0, S, HS, H } = $r;
  return (<>
      {$s0?.show ? (<>
        <div {...S(`position: ${I($s0?.wrapPos)}; top: 0; right: 0; bottom: 0; left: 0; z-index: 70; display: flex; align-items: ${I($s0?.wrapAlign)}; justify-content: center; box-sizing: border-box; padding: ${I($s0?.wrapPad)}; min-height: ${I($s0?.wrapMinH)}; height: ${I($s0?.wrapH)}; background: ${I($s0?.wrapBg)}; font-family: ${I($s0?.t?.bodyFam)}; font-size: 14px; line-height: 1.43; color: ${I($s0?.t?.fg)}; -webkit-font-smoothing: antialiased; ${I($s0?.vars)}`)}>
          {$s0?.hasOverlay ? (<>
            <button type={"button"} aria-label={"Close"} className={"a-fade"} onClick={$s0?.close} {...S(`position: absolute; top: 0; right: 0; bottom: 0; left: 0; padding: 0; border: none; background: ${I($s0?.t?.overlay)}; cursor: default`)} />
          </>) : null}
          <div role={"dialog"} aria-modal={"true"} aria-labelledby={"ad-title"} className={$s0?.dlgAnim} {...S(`position: relative; width: ${I($s0?.dlgW)}; max-width: 100%; height: ${I($s0?.dlgH)}; max-height: ${I($s0?.dlgMaxH)}; box-sizing: border-box; display: flex; flex-direction: column; background: ${I($s0?.t?.card)}; color: ${I($s0?.t?.fg)}; border: ${I($s0?.dlgBorder)}; border-radius: ${I($s0?.dlgRadius)}; box-shadow: ${I($s0?.t?.shPop)}; overflow: hidden`)}>
            <div {...S(`display: flex; align-items: flex-start; gap: 12px; padding: ${I($s0?.hdPad)}`)}>
              {$s0?.notLocked ? (<>
                <div {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 4px")}>
                  <h2 id={"ad-title"} {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 18px; font-weight: 600; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                    {T($s0?.head?.title)}
                  </h2>
                  <p {...S(`margin: 0; color: ${I($s0?.t?.mutedFg)}; ${I($s0?.descSt)}`)}>
                    {T($s0?.head?.desc)}
                  </p>
                </div>
              </>) : null}
              {$s0?.isLocked ? (<>
                <span {...S("flex: 1 1 auto")} />
              </>) : null}
              <button type={"button"} className={"tb tg"} onClick={$s0?.close} aria-label={"Close"} {...S($s0?.k?.ico)}>
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M18 6 6 18M6 6l12 12"} />
                </svg>
              </button>
            </div>
            {$s0?.hasSteps ? (<>
              <div aria-label={"Progress"} {...S(`display: flex; align-items: center; gap: 8px; padding: ${I($s0?.stepPad)}; min-width: 0`)}>
                {A($s0?.steps).map((it, i) => {
                  const $s1 = { ...$s0, "s": it, $index: i };
                  return (<React.Fragment key={i}>
                    {$s1?.s?.gap ? (<>
                      <span {...S(`flex: 1 1 12px; min-width: 8px; height: 1px; background: ${I($s1?.s?.lineBg)}; transition: background-color 0.3s ease`)} />
                    </>) : null}
                    <span aria-current={$s1?.s?.cur} {...S("display: inline-flex; align-items: center; gap: 7px; flex: 0 0 auto; min-width: 0; white-space: nowrap")}>
                      <span {...S(`width: 22px; height: 22px; flex: 0 0 22px; box-sizing: border-box; border-radius: 11px; border: ${I($s1?.s?.ring)}; background: ${I($s1?.s?.bg)}; color: ${I($s1?.s?.fg)}; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; transition: background-color 0.25s ease, color 0.25s ease`)}>
                        {$s1?.s?.done ? (<>
                          <svg className={"a-check"} width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={"M20 6 9 17l-5-5"} />
                          </svg>
                        </>) : null}
                        {$s1?.s?.todo ? (<>
                          {T($s1?.s?.n)}
                        </>) : null}
                      </span>
                      {$s1?.s?.showLabel ? (<>
                        <span {...S(`font-size: 13px; font-weight: ${I($s1?.s?.fw)}; color: ${I($s1?.s?.labelFg)}`)}>
                          {T($s1?.s?.label)}
                        </span>
                      </>) : null}
                    </span>
                  </React.Fragment>);
                })}
              </div>
            </>) : null}
            <div {...S(`flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: ${I($s0?.bodyPad)}; display: flex; flex-direction: column; gap: 20px; border-top: ${I($s0?.bodyLine)}`)}>
              {$s0?.isPick ? (<>
                <div className={"a-in"} {...S("display: flex; flex-direction: column; gap: 18px; padding-top: 14px")}>
                  <div role={"tablist"} aria-label={"File type"} {...S(`display: flex; width: 100%; ${I($s0?.k?.tabs)}`)}>
                    {A($s0?.srcTabs).map((it, i) => {
                      const $s1 = { ...$s0, "o": it, $index: i };
                      return (<React.Fragment key={i}>
                        <button type={"button"} role={"tab"} className={"tb tt"} aria-selected={$s1?.o?.on} onClick={$s1?.o?.pick} {...S(`flex: 1 1 0; ${I($s1?.o?.style)}`)}>
                          <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={$s1?.o?.icon} />
                          </svg>
                          {T($s1?.o?.label)}
                        </button>
                      </React.Fragment>);
                    })}
                  </div>
                  <button type={"button"} className={"tb tz"} onClick={$s0?.choose} onDragOver={$s0?.dragOver} onDrop={$s0?.dropFile} {...S(`--hvz: ${I($s0?.t?.zoneHover)}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; width: 100%; min-height: 220px; padding: 28px 20px; box-sizing: border-box; border: 1.5px dashed ${I($s0?.t?.borderStrong)}; border-radius: ${I($s0?.t?.rCard)}; background: ${I($s0?.t?.zone)}; color: ${I($s0?.t?.fg)}; font: inherit; text-align: center; cursor: pointer`)}>
                    {$s0?.zoneOk ? (<>
                      <span className={"a-float"} {...S(`width: 52px; height: 52px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.card)}; box-shadow: 0 0 0 1px ${I($s0?.t?.border)}, 0 6px 16px -8px rgba(0,0,0,0.2); color: ${I($s0?.t?.primary)}; display: inline-flex; align-items: center; justify-content: center`)}>
                        <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={$s0?.zone?.icon} />
                        </svg>
                      </span>
                      <span {...S("font-size: 16px; font-weight: 600")}>
                        {T($s0?.zone?.title)}
                      </span>
                      <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                        {T($s0?.zone?.sub)}
                      </span>
                      <span className={"tp"} {...S(`margin-top: 6px; ${I($s0?.k?.btnP)}`)}>
                        {"Choose file"}
                      </span>
                    </>) : null}
                    {$s0?.zoneErr ? (<>
                      <span className={"a-fade"} {...S(`width: 48px; height: 48px; flex: 0 0 48px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.badBg)}; color: ${I($s0?.t?.badFg)}; display: inline-flex; align-items: center; justify-content: center`)}>
                        <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={$s0?.zerr?.icon} />
                        </svg>
                      </span>
                      <span role={"alert"} {...S("display: flex; flex-direction: column; align-items: center; gap: 4px; max-width: 400px")}>
                        <span {...S("font-size: 15px; font-weight: 600")}>
                          {T($s0?.zerr?.title)}
                        </span>
                        <span {...S(`font-size: 13px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}; overflow-wrap: anywhere; text-wrap: balance`)}>
                          {T($s0?.zerr?.sub)}
                        </span>
                      </span>
                      <span className={"tp"} {...S(`margin-top: 4px; ${I($s0?.k?.pSm)}`)}>
                        {T($s0?.zerr?.cta)}
                      </span>
                    </>) : null}
                  </button>
                  {$s0?.isContractSrc ? (<>
                    <div {...S("display: flex; flex-direction: column; gap: 10px")}>
                      <span {...S($s0?.k?.caps)}>
                        {"What Talby finds for you"}
                      </span>
                      <div {...S(`display: grid; grid-template-columns: ${I($s0?.findCols)}; gap: 8px`)}>
                        {A($s0?.finds).map((it, i) => {
                          const $s1 = { ...$s0, "f": it, $index: i };
                          return (<React.Fragment key={i}>
                            <span {...S(`display: flex; align-items: center; gap: 10px; min-height: 44px; padding: 0 12px; box-sizing: border-box; ${I($s1?.k?.tile)}`)}>
                              <span {...S(`width: 24px; height: 24px; flex: 0 0 24px; border-radius: 12px; background: ${I($s1?.t?.soft)}; color: ${I($s1?.t?.softFg)}; display: inline-flex; align-items: center; justify-content: center`)}>
                                <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                  <path d={$s1?.f?.icon} />
                                </svg>
                              </span>
                              <span {...S("font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                                {T($s1?.f?.label)}
                              </span>
                            </span>
                          </React.Fragment>);
                        })}
                      </div>
                    </div>
                  </>) : null}
                  {$s0?.isCsvSrc ? (<>
                    <div {...S(`display: flex; align-items: center; gap: 12px; padding: 14px 16px; ${I($s0?.k?.tile)}`)}>
                      <span {...S(`width: 36px; height: 36px; flex: 0 0 36px; border-radius: ${I($s0?.t?.rSm)}; background: ${I($s0?.t?.card)}; box-shadow: 0 0 0 1px ${I($s0?.t?.border)}; display: inline-flex; align-items: center; justify-content: center`)}>
                        <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M12 3v18M3 9h18M3 15h18M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"} />
                        </svg>
                      </span>
                      <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                        <span {...S("font-weight: 500; white-space: nowrap")}>
                          {"One row per deal"}
                        </span>
                        <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}; ${I($s0?.subSt)}`)}>
                          {"Exports from Notion, Airtable or Google Sheets all work."}
                        </span>
                      </span>
                      <button type={"button"} className={"tb tg"} onClick={$s0?.sampleCsv} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.oSm)}`)}>
                        {"Sample CSV"}
                      </button>
                    </div>
                  </>) : null}
                </div>
              </>) : null}
              {$s0?.isReading ? (<>
                <div className={"a-in"} {...S("display: flex; flex-direction: column; gap: 16px; padding-top: 14px")}>
                  <div {...S(`display: flex; flex-direction: column; gap: 12px; padding: 16px; ${I($s0?.k?.group)}`)}>
                    <div {...S("display: flex; align-items: center; gap: 12px")}>
                      <span {...S(`width: 40px; height: 46px; flex: 0 0 40px; box-sizing: border-box; border-radius: 6px; background: ${I($s0?.t?.pdfBg)}; color: ${I($s0?.t?.pdfFg)}; display: inline-flex; align-items: flex-end; justify-content: center; padding-bottom: 6px; font-size: 10px; font-weight: 700; letter-spacing: 0.04em`)}>
                        {"PDF"}
                      </span>
                      <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                        <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                          {$s0?.ioT?.file}
                        </span>
                        <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap`)}>
                          {$s0?.ioT?.fileMeta}
                        </span>
                      </span>
                      <span {...S("font-weight: 600; font-variant-numeric: tabular-nums")}>
                        {T($s0?.readPct)}
                      </span>
                    </div>
                    <div role={"progressbar"} aria-label={"Reading the contract"} aria-valuemin={"0"} aria-valuemax={"100"} aria-valuenow={$s0?.readNum} {...S(`position: relative; height: 6px; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.off)}; overflow: hidden`)}>
                      <div {...S(`position: relative; height: 6px; width: ${I($s0?.readPct)}; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.primary)}; transition: width 0.6s cubic-bezier(.4,0,.2,1); overflow: hidden`)}>
                        <span className={"a-shim"} {...S("position: absolute; top: 0; right: 0; bottom: 0; left: 0")} />
                      </div>
                    </div>
                  </div>
                  <div {...S($s0?.k?.group)}>
                    {A($s0?.readRows).map((it, i) => {
                      const $s1 = { ...$s0, "r": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div {...S($s1?.r?.rowStyle)}>
                          <span {...S("width: 22px; height: 22px; flex: 0 0 22px; display: inline-flex; align-items: center; justify-content: center")}>
                            {$s1?.r?.done ? (<>
                              <svg className={"a-check"} width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <circle cx={"12"} cy={"12"} r={"10"} fill={"#22C55E"} stroke={"#22C55E"} />
                                <path d={"m8 12.5 2.6 2.6L16 9.5"} stroke={"#FFFFFF"} />
                              </svg>
                            </>) : null}
                            {$s1?.r?.cur ? (<>
                              <svg className={"a-spin"} width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s1?.t?.primary} strokeWidth={"2.6"} strokeLinecap={"round"} aria-hidden={"true"}>
                                <path d={"M21 12a9 9 0 1 1-6.22-8.56"} />
                              </svg>
                            </>) : null}
                            {$s1?.r?.wait ? (<>
                              <span {...S(`width: 16px; height: 16px; box-sizing: border-box; border-radius: 8px; border: 1.5px dashed ${I($s1?.t?.borderStrong)}`)} />
                            </>) : null}
                          </span>
                          <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                            <span {...S(`font-weight: 500; color: ${I($s1?.r?.labelFg)}; white-space: nowrap`)}>
                              {T($s1?.r?.label)}
                            </span>
                            {$s1?.r?.done ? (<>
                              <span className={"a-fade"} {...S(`font-size: 13px; color: ${I($s1?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                                {T($s1?.r?.found)}
                              </span>
                            </>) : null}
                            {$s1?.r?.cur ? (<>
                              <span className={"a-pulse"} {...S(`font-size: 13px; color: ${I($s1?.t?.mutedFg)}`)}>
                                {"Looking"}
                              </span>
                            </>) : null}
                          </span>
                        </div>
                      </React.Fragment>);
                    })}
                  </div>
                </div>
              </>) : null}
              {$s0?.isErrPanel ? (<>
                <div className={"a-in"} {...S("display: flex; flex-direction: column; gap: 16px; padding-top: 14px")}>
                  {$s0?.ep?.hasFile ? (<>
                    <div {...S(`display: flex; align-items: center; gap: 12px; padding: 12px 12px 12px 14px; ${I($s0?.k?.group)}`)}>
                      <span {...S(`width: 36px; height: 40px; flex: 0 0 36px; box-sizing: border-box; border-radius: 6px; background: ${I($s0?.ep?.badgeBg)}; color: ${I($s0?.ep?.badgeFg)}; display: inline-flex; align-items: flex-end; justify-content: center; padding-bottom: 5px; font-size: 9px; font-weight: 700; letter-spacing: 0.04em`)}>
                        {T($s0?.ep?.badge)}
                      </span>
                      <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                        <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                          {T($s0?.ep?.fileName)}
                        </span>
                        <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                          {T($s0?.ep?.fileMeta)}
                        </span>
                      </span>
                      {$s0?.ep?.hasTag ? (<>
                        <span {...S(`display: inline-flex; align-items: center; height: 22px; padding: 0 8px; flex: 0 0 auto; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.badBg)}; color: ${I($s0?.t?.badFg)}; font-size: 12px; font-weight: 500; white-space: nowrap`)}>
                          {T($s0?.ep?.tag)}
                        </span>
                      </>) : null}
                      {$s0?.ep?.hasChange ? (<>
                        <button type={"button"} className={"tb tg"} onClick={$s0?.ep?.change} {...S(`--hv: ${I($s0?.t?.fill)}; ${I($s0?.k?.gSm)}`)}>
                          {"Change file"}
                        </button>
                      </>) : null}
                    </div>
                  </>) : null}
                  {$s0?.ep?.hasConn ? (<>
                    <div {...S(`display: flex; align-items: center; gap: 10px; padding: 10px 10px 10px 14px; ${I($s0?.k?.tile)}`)}>
                      <span {...S("width: 8px; height: 8px; flex: 0 0 8px; border-radius: 4px; background: #22C55E")} />
                      <span {...S("flex: 1 1 auto; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                        {"Connected to "}
                        <b {...S("font-weight: 600")}>
                          {"your Notion"}
                        </b>
                      </span>
                      <button type={"button"} className={"tb tg"} onClick={$s0?.switchWs} {...S(`--hv: ${I($s0?.t?.card)}; ${I($s0?.k?.gSm)}`)}>
                        {"Switch"}
                      </button>
                    </div>
                  </>) : null}
                  <div {...S(`display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: ${I($s0?.ep?.pad)}; box-sizing: border-box; text-align: center`)}>
                    <span {...S(`display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; flex: 0 0 48px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.ep?.tileBg)}; color: ${I($s0?.ep?.tileFg)}`)}>
                      <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={$s0?.ep?.icon} />
                      </svg>
                    </span>
                    <div role={$s0?.ep?.role} {...S("display: flex; flex-direction: column; align-items: center; gap: 4px; max-width: 420px")}>
                      <span {...S("font-size: 15px; font-weight: 600")}>
                        {T($s0?.ep?.title)}
                      </span>
                      <span {...S(`font-size: 13px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}; overflow-wrap: anywhere; text-wrap: balance`)}>
                        {T($s0?.ep?.sub)}
                      </span>
                    </div>
                    {$s0?.ep?.hasCta ? (<>
                      <div {...S("display: flex; flex-wrap: wrap; justify-content: center; gap: 8px")}>
                        <button type={"button"} className={"tb tp"} onClick={$s0?.ep?.act} {...S($s0?.k?.pSm)}>
                          {T($s0?.ep?.cta)}
                        </button>
                        {$s0?.ep?.has2 ? (<>
                          <button type={"button"} className={"tb tg"} onClick={$s0?.ep?.act2} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.oSm)}`)}>
                            {T($s0?.ep?.cta2)}
                          </button>
                        </>) : null}
                      </div>
                    </>) : null}
                  </div>
                  {$s0?.ep?.hasSteps ? (<>
                    <div {...S(`display: flex; flex-direction: column; gap: 10px; padding: 14px 16px; ${I($s0?.k?.tile)}`)}>
                      <span {...S($s0?.k?.caps)}>
                        {T($s0?.ep?.stepsTitle)}
                      </span>
                      {A($s0?.ep?.steps).map((it, i) => {
                        const $s1 = { ...$s0, "hs": it, $index: i };
                        return (<React.Fragment key={i}>
                          <div {...S("display: flex; align-items: flex-start; gap: 10px")}>
                            <span {...S(`width: 20px; height: 20px; flex: 0 0 20px; box-sizing: border-box; border-radius: 10px; background: ${I($s1?.t?.card)}; box-shadow: 0 0 0 1px ${I($s1?.t?.border)}; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; font-variant-numeric: tabular-nums`)}>
                              {T($s1?.hs?.n)}
                            </span>
                            <span {...S("flex: 1 1 auto; min-width: 0; line-height: 20px")}>
                              {T($s1?.hs?.text)}
                            </span>
                          </div>
                        </React.Fragment>);
                      })}
                    </div>
                  </>) : null}
                  {$s0?.ep?.hasPerms ? (<>
                    <div {...S($s0?.k?.group)}>
                      {A($s0?.perms).map((it, i) => {
                        const $s1 = { ...$s0, "pm": it, $index: i };
                        return (<React.Fragment key={i}>
                          <div {...S($s1?.pm?.rowStyle)}>
                            <span {...S(`width: 32px; height: 32px; flex: 0 0 32px; border-radius: 16px; background: ${I($s1?.t?.fill)}; display: inline-flex; align-items: center; justify-content: center`)}>
                              <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={$s1?.pm?.icon} />
                              </svg>
                            </span>
                            <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                              <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                                {T($s1?.pm?.title)}
                              </span>
                              <span {...S(`font-size: 13px; color: ${I($s1?.t?.mutedFg)}; ${I($s1?.subSt)}`)}>
                                {T($s1?.pm?.sub)}
                              </span>
                            </span>
                          </div>
                        </React.Fragment>);
                      })}
                    </div>
                  </>) : null}
                </div>
              </>) : null}
              {$s0?.isPartial ? (<>
                <div className={"a-in"} {...S("display: flex; flex-direction: column; gap: 18px; padding-top: 18px")}>
                  <div role={"status"} {...S("display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 18px 0 6px; text-align: center")}>
                    <span {...S(`display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; flex: 0 0 48px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.warnBg)}; color: ${I($s0?.t?.warnFg)}`)}>
                      <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"} />
                      </svg>
                    </span>
                    <span {...S("font-size: 16px; font-weight: 600")}>
                      {T($s0?.pt?.title)}
                    </span>
                    <span {...S(`max-width: 420px; color: ${I($s0?.t?.mutedFg)}; text-wrap: balance`)}>
                      {T($s0?.pt?.sub)}
                    </span>
                  </div>
                  <div {...S("display: flex; flex-direction: column; gap: 8px")}>
                    <span {...S($s0?.k?.secLabel)}>
                      {"Did not come in"}
                    </span>
                    <div {...S($s0?.k?.group)}>
                      {A($s0?.pt?.rows).map((it, i) => {
                        const $s1 = { ...$s0, "r": it, $index: i };
                        return (<React.Fragment key={i}>
                          <div {...S($s1?.r?.rowStyle)}>
                            <span {...S(`width: 22px; height: 22px; flex: 0 0 22px; display: inline-flex; align-items: center; justify-content: center; color: ${I($s1?.t?.destr)}`)}>
                              <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={"M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"} />
                              </svg>
                            </span>
                            <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 1px")}>
                              <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                                {T($s1?.r?.brand)}
                              </span>
                              <span {...S(`font-size: 13px; color: ${I($s1?.t?.mutedFg)}; ${I($s1?.subSt)}`)}>
                                {T($s1?.r?.why)}
                              </span>
                            </span>
                            <span {...S("font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums")}>
                              {T($s1?.r?.amount)}
                            </span>
                          </div>
                        </React.Fragment>);
                      })}
                    </div>
                  </div>
                  <div {...S(`display: flex; align-items: center; gap: 10px; padding: 12px 14px; ${I($s0?.k?.tile)}`)}>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 16px")}>
                      <circle cx={"12"} cy={"12"} r={"10"} />
                      <path d={"M12 16v-4M12 8h.01"} />
                    </svg>
                    <span {...S(`color: ${I($s0?.t?.mutedFg)}; ${I($s0?.subSt)}`)}>
                      {T($s0?.pt?.note)}
                    </span>
                  </div>
                </div>
              </>) : null}
              {$s0?.isLocked ? (<>
                <div className={"a-in"} {...S(`display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; flex: 1 1 auto; padding: ${I($s0?.lk?.pad)}; box-sizing: border-box; text-align: center`)}>
                  <span {...S(`display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; flex: 0 0 48px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.tile)}; color: ${I($s0?.t?.fg)}`)}>
                    <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4"} />
                    </svg>
                  </span>
                  <div {...S("display: flex; flex-direction: column; align-items: center; gap: 4px; max-width: 360px")}>
                    <h2 id={"ad-title"} {...S(`margin: 0; font-family: ${I($s0?.t?.bodyFam)}; font-size: 15px; font-weight: 600; line-height: 1.43`)}>
                      {T($s0?.lk?.title)}
                    </h2>
                    <p {...S(`margin: 0; font-size: 13px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}; text-wrap: balance`)}>
                      {T($s0?.lk?.sub)}
                    </p>
                  </div>
                  <div {...S(`display: flex; justify-content: center; gap: 8px; margin-top: 4px; ${I($s0?.lk?.row)}`)}>
                    <button type={"button"} className={"tb tg"} onClick={$s0?.close} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.lk?.btnO)}`)}>
                      {"Not now"}
                    </button>
                    <button type={"button"} className={"tb tp"} onClick={$s0?.upgrade} {...S($s0?.lk?.btnP)}>
                      {T($s0?.lk?.cta)}
                    </button>
                  </div>
                </div>
              </>) : null}
              {$s0?.showForm ? (<>
                <div className={"a-in"} {...S("display: flex; flex-direction: column; gap: 20px; padding-top: 14px")}>
                  {$s0?.saveErr ? (<>
                    <div role={"alert"} className={"a-fade"} {...S(`display: flex; align-items: center; gap: 12px; padding: 12px 12px 12px 14px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.badBg)}; color: ${I($s0?.t?.badFg)}; ${I($s0?.bn?.wrap)}`)}>
                      <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 18px")}>
                        <path d={"M12 20h.01M8.5 16.43a5 5 0 0 1 7 0M2 8.82a15 15 0 0 1 20 0M5 12.86a10 10 0 0 1 14 0"} />
                      </svg>
                      <span {...S(`${I($s0?.bn?.col)}; display: flex; flex-direction: column; gap: 2px`)}>
                        <span {...S(`font-weight: 600; ${I($s0?.bn?.text)}`)}>
                          {"This deal did not save"}
                        </span>
                        <span {...S(`font-size: 13px; ${I($s0?.bn?.text)}`)}>
                          {"Check your connection and try again. Everything you typed is still here."}
                        </span>
                      </span>
                      <button type={"button"} className={"tb tg"} onClick={$s0?.retrySave} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.oSm)}${I($s0?.bn?.btn)}`)}>
                        {"Try again"}
                      </button>
                    </div>
                  </>) : null}
                  {$s0?.hasAtt ? (<>
                    <div {...S(`display: flex; align-items: center; gap: 12px; padding: 12px 12px 12px 14px; ${I($s0?.k?.tile)}`)}>
                      <span {...S(`width: 30px; height: 34px; flex: 0 0 30px; box-sizing: border-box; border-radius: 5px; background: ${I($s0?.t?.pdfBg)}; color: ${I($s0?.t?.pdfFg)}; display: inline-flex; align-items: flex-end; justify-content: center; padding-bottom: 4px; font-size: 8px; font-weight: 700; letter-spacing: 0.04em`)}>
                        {"PDF"}
                      </span>
                      <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                        <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                          {T($s0?.att)}
                        </span>
                        <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}; ${I($s0?.subSt)}`)}>
                          {"Attached to this deal. Add the details below."}
                        </span>
                      </span>
                      <button type={"button"} className={"tb tg"} onClick={$s0?.dropAtt} {...S(`--hv: ${I($s0?.t?.fill)}; ${I($s0?.k?.gSm)}`)}>
                        {"Remove"}
                      </button>
                    </div>
                  </>) : null}
                  {$s0?.reviewAll ? (<>
                    <div {...S(`display: flex; align-items: center; gap: 14px; padding: 14px 14px 14px 16px; ${I($s0?.k?.tile)}; ${I($s0?.bn?.wrap)}`)}>
                      <svg className={"a-check"} width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 22px")}>
                        <circle cx={"12"} cy={"12"} r={"10"} fill={"#22C55E"} stroke={"#22C55E"} />
                        <path d={"m8 12.5 2.6 2.6L16 9.5"} stroke={"#FFFFFF"} />
                      </svg>
                      <span {...S(`${I($s0?.bn?.col)}; display: flex; flex-direction: column; gap: 2px`)}>
                        <span {...S(`font-weight: 500; ${I($s0?.bn?.text)}`)}>
                          {$s0?.ioT?.found}
                        </span>
                        <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}; ${I($s0?.bn?.text)}`)}>
                          {$s0?.ioT?.saved}
                        </span>
                      </span>
                      <button type={"button"} className={"tb tg"} onClick={$s0?.backToPick} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.oSm)}${I($s0?.bn?.btnR)}`)}>
                        {"Use another file"}
                      </button>
                    </div>
                  </>) : null}
                  {$s0?.reviewFew ? (<>
                    <div role={"status"} {...S(`display: flex; align-items: center; gap: 14px; padding: 14px 14px 14px 16px; ${I($s0?.k?.tile)}; ${I($s0?.bn?.wrap)}`)}>
                      <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 22px")}>
                        <circle cx={"12"} cy={"12"} r={"10"} />
                        <path d={"M12 16v-4M12 8h.01"} />
                      </svg>
                      <span {...S(`${I($s0?.bn?.col)}; display: flex; flex-direction: column; gap: 2px`)}>
                        <span {...S(`font-weight: 500; ${I($s0?.bn?.text)}`)}>
                          {$s0?.ioT?.few}
                        </span>
                        <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}; ${I($s0?.bn?.text)}`)}>
                          {"Add the rest below. The contract is still saved to this deal."}
                        </span>
                      </span>
                      <button type={"button"} className={"tb tg"} onClick={$s0?.backToPick} {...S(`--hv: ${I($s0?.t?.hoverCard)}; ${I($s0?.k?.oSm)}${I($s0?.bn?.btnR)}`)}>
                        {"Use another file"}
                      </button>
                    </div>
                  </>) : null}
                  <div {...S("display: flex; flex-direction: column; gap: 8px")}>
                    <span {...S($s0?.k?.secLabel)}>
                      {"Deal"}
                    </span>
                    <div {...S($s0?.k?.group)}>
                      <div {...S($s0?.vb?.row)}>
                        <label htmlFor={"ad-brand"} {...S($s0?.vb?.label)}>
                          {"Brand"}
                        </label>
                        <span {...S($s0?.vb?.col)}>
                          <span className={"ti"} {...S(`display: flex; align-items: center; gap: 8px; ${I($s0?.vb?.ctl)}`)}>
                            <input id={"ad-brand"} value={V0($s0?.f?.brand, "")} onChange={$s0?.setBrand} placeholder={"Brand or campaign name"} aria-invalid={$s0?.vb?.bad} aria-describedby={$s0?.vb?.desc} {...S(`flex: 1 1 auto; min-width: 0; height: 34px; border: none; outline: none; background: transparent; font: inherit; font-size: 14px; color: ${I($s0?.t?.fg)}; padding: 0`)} />
                            {$s0?.isReview ? (<>
                              <span title={"From the contract"} {...S($s0?.k?.found)} />
                            </>) : null}
                          </span>
                          {$s0?.vb?.bad ? (<>
                            <span id={"ad-brand-err"} className={"a-fade"} {...S($s0?.k?.err)}>
                              <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 13px")}>
                                <path d={"M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"} />
                              </svg>
                              {T($s0?.vb?.msg)}
                            </span>
                          </>) : null}
                        </span>
                      </div>
                      <div {...S($s0?.k?.rowT)}>
                        <span {...S($s0?.k?.rowLabel)}>
                          {"Status"}
                        </span>
                        <button type={"button"} className={"tb tg"} onClick={$s0?.popStatus} aria-haspopup={"listbox"} aria-expanded={$s0?.statusOpen} {...S(`--hv: ${I($s0?.t?.fillHover)}; ${I($s0?.k?.selW)}`)}>
                          <span>
                            {T($s0?.f?.status)}
                          </span>
                          <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 15px")}>
                            <path d={"m6 9 6 6 6-6"} />
                          </svg>
                        </button>
                        {$s0?.statusOpen ? (<>
                          <div role={"listbox"} aria-label={"Status"} className={$s0?.popAnim} {...S(`z-index: 10; ${I($s0?.ps?.status)}; ${I($s0?.k?.pop)}; ${I($s0?.ps?.tail)}`)}>
                            {$s0?.mob ? (<>
                              <span {...S($s0?.ps?.head)}>
                                {"Status"}
                              </span>
                            </>) : null}
                            {A($s0?.statusOpts).map((it, i) => {
                              const $s1 = { ...$s0, "o": it, $index: i };
                              return (<React.Fragment key={i}>
                                <button type={"button"} role={"option"} className={"tb tg"} aria-selected={$s1?.o?.on} onClick={$s1?.o?.pick} {...S(`justify-content: space-between; ${I($s1?.k?.item)}`)}>
                                  <span {...S("display: flex; flex-direction: column; gap: 1px; padding: 6px 0")}>
                                    <span>
                                      {T($s1?.o?.label)}
                                    </span>
                                    <span {...S(`font-size: 12px; color: ${I($s1?.t?.mutedFg)}`)}>
                                      {T($s1?.o?.desc)}
                                    </span>
                                  </span>
                                  <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`visibility: ${I($s1?.o?.check)}`)}>
                                    <path d={"M20 6 9 17l-5-5"} />
                                  </svg>
                                </button>
                              </React.Fragment>);
                            })}
                          </div>
                        </>) : null}
                      </div>
                      <div {...S($s0?.k?.rowT)}>
                        <span {...S($s0?.k?.rowLabel)}>
                          {"First post date"}
                        </span>
                        <div {...S($s0?.dateBox)}>
                          <SDatePicker value={$s0?.f?.post} onChange={$s0?.setPost} placeholder={"Pick a date"} label={"First post date"} color={$s0?.t?.id} dark={$s0?.dark} />
                        </div>
                      </div>
                      <div {...S($s0?.k?.rowCol)}>
                        <span {...S("font-weight: 500")}>
                          {"Platforms"}
                        </span>
                        <div role={"group"} aria-label={"Platforms"} {...S("display: flex; flex-wrap: wrap; gap: 6px")}>
                          {A($s0?.plats).map((it, i) => {
                            const $s1 = { ...$s0, "c": it, $index: i };
                            return (<React.Fragment key={i}>
                              <button type={"button"} className={"tb"} aria-pressed={$s1?.c?.on} onClick={$s1?.c?.pick} {...S(`display: inline-flex; align-items: center; gap: 7px; ${I($s1?.c?.style)}; padding: ${I($s1?.c?.pad)}`)}>
                                {$s1?.c?.hasIcon ? (<>
                                  <img src={$s1?.c?.icon} alt={""} width={"18"} height={"18"} {...S("display: block; width: 18px; height: 18px; flex: 0 0 18px; border-radius: 5px")} />
                                </>) : null}
                                {T($s1?.c?.label)}
                              </button>
                            </React.Fragment>);
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div {...S("display: flex; flex-direction: column; gap: 8px")}>
                    <span {...S($s0?.k?.secLabel)}>
                      {"Payment"}
                    </span>
                    <div {...S($s0?.k?.group)}>
                      <div {...S($s0?.va?.row)}>
                        <label htmlFor={"ad-amt"} {...S($s0?.va?.label)}>
                          {T($s0?.amtLabel)}
                        </label>
                        <span {...S($s0?.va?.col)}>
                          <span className={"ti"} {...S(`display: flex; align-items: center; gap: 6px; ${I($s0?.va?.ctl)}`)}>
                            <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                              {"$"}
                            </span>
                            <input id={"ad-amt"} value={V0($s0?.f?.amt, "")} onChange={$s0?.setAmt} placeholder={"0"} inputMode={"decimal"} aria-invalid={$s0?.va?.bad} aria-describedby={$s0?.va?.desc} {...S(`flex: 1 1 auto; min-width: 0; height: 34px; border: none; outline: none; background: transparent; font: inherit; font-size: 14px; color: ${I($s0?.t?.fg)}; padding: 0; font-variant-numeric: tabular-nums`)} />
                            {$s0?.amtDot ? (<>
                              <span title={"From the contract"} {...S($s0?.k?.found)} />
                            </>) : null}
                          </span>
                          {$s0?.va?.bad ? (<>
                            <span id={"ad-amt-err"} className={"a-fade"} {...S($s0?.k?.err)}>
                              <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 13px")}>
                                <path d={"M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"} />
                              </svg>
                              {T($s0?.va?.msg)}
                            </span>
                          </>) : null}
                        </span>
                      </div>
                      <div {...S($s0?.k?.rowCol)}>
                        <span id={"ad-how"} {...S("font-weight: 500")}>
                          {"How you get paid"}
                        </span>
                        <div role={"radiogroup"} aria-labelledby={"ad-how"} {...S(`display: flex; width: 100%; ${I($s0?.k?.tabs)}`)}>
                          {A($s0?.payOpts).map((it, i) => {
                            const $s1 = { ...$s0, "o": it, $index: i };
                            return (<React.Fragment key={i}>
                              <button type={"button"} role={"radio"} className={"tb tt"} aria-checked={$s1?.o?.on} onClick={$s1?.o?.pick} {...S(`flex: 1 1 0; ${I($s1?.o?.style)}`)}>
                                {T($s1?.o?.label)}
                              </button>
                            </React.Fragment>);
                          })}
                        </div>
                        <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}`)}>
                          {T($s0?.howHint)}
                        </span>
                      </div>
                      {A($s0?.payRows).map((it, i) => {
                        const $s1 = { ...$s0, "nr": it, $index: i };
                        return (<React.Fragment key={i}>
                          <div {...S($s1?.k?.rowT)}>
                            <span {...S($s1?.k?.rowLabel)}>
                              {T($s1?.nr?.label)}
                            </span>
                            {$s1?.nr?.isSel ? (<>
                              <button type={"button"} className={"tb tg"} onClick={$s1?.nr?.toggle} aria-haspopup={"listbox"} aria-expanded={$s1?.nr?.open} {...S(`--hv: ${I($s1?.t?.fillHover)}; ${I($s1?.k?.selW)}`)}>
                                <span {...S("white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                                  {T($s1?.nr?.value)}
                                </span>
                                <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s1?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 15px")}>
                                  <path d={"m6 9 6 6 6-6"} />
                                </svg>
                              </button>
                              {$s1?.nr?.open ? (<>
                                <div role={"listbox"} aria-label={$s1?.nr?.label} className={$s1?.popAnim} {...S(`z-index: 10; ${I($s1?.ps?.pay)}; ${I($s1?.k?.pop)}; ${I($s1?.ps?.tail)}`)}>
                                  {$s1?.mob ? (<>
                                    <span {...S($s1?.ps?.head)}>
                                      {T($s1?.nr?.label)}
                                    </span>
                                  </>) : null}
                                  {A($s1?.nr?.opts).map((it, i) => {
                                    const $s2 = { ...$s1, "o": it, $index: i };
                                    return (<React.Fragment key={i}>
                                      <button type={"button"} role={"option"} className={"tb tg"} aria-selected={$s2?.o?.on} onClick={$s2?.o?.pick} {...S(`justify-content: space-between; ${I($s2?.k?.item)}`)}>
                                        {T($s2?.o?.label)}
                                        <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`visibility: ${I($s2?.o?.check)}`)}>
                                          <path d={"M20 6 9 17l-5-5"} />
                                        </svg>
                                      </button>
                                    </React.Fragment>);
                                  })}
                                </div>
                              </>) : null}
                            </>) : null}
                            {$s1?.nr?.isStep ? (<>
                              <div role={"group"} aria-label={$s1?.nr?.label} {...S(`display: inline-flex; align-items: center; gap: 2px; height: ${I($s1?.stepGrpH)}; padding: 0 3px; box-sizing: border-box; border-radius: ${I($s1?.t?.rCtl)}; background: ${I($s1?.t?.fill)}`)}>
                                <button type={"button"} className={"tb tg"} onClick={$s1?.nr?.down} aria-label={"One fewer"} {...S(`--hv: ${I($s1?.t?.card)}; ${I($s1?.k?.icoG)}`)}>
                                  <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                                    <path d={"M5 12h14"} />
                                  </svg>
                                </button>
                                <span {...S("min-width: 28px; text-align: center; font-weight: 600; font-variant-numeric: tabular-nums")}>
                                  {T($s1?.nr?.value)}
                                </span>
                                <button type={"button"} className={"tb tg"} onClick={$s1?.nr?.up} aria-label={"One more"} {...S(`--hv: ${I($s1?.t?.card)}; ${I($s1?.k?.icoG)}`)}>
                                  <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                                    <path d={"M5 12h14M12 5v14"} />
                                  </svg>
                                </button>
                              </div>
                            </>) : null}
                          </div>
                        </React.Fragment>);
                      })}
                    </div>
                    <div {...S(`padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; ${I($s0?.k?.tile)}`)}>
                      <span {...S($s0?.k?.caps)}>
                        {"Payment plan"}
                      </span>
                      {A($s0?.plan).map((it, i) => {
                        const $s1 = { ...$s0, "pl": it, $index: i };
                        return (<React.Fragment key={i}>
                          <div {...S("display: flex; align-items: center; justify-content: space-between; gap: 12px")}>
                            <span {...S(`min-width: 0; color: ${I($s1?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                              {T($s1?.pl?.label)}
                            </span>
                            <span {...S("font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums")}>
                              {T($s1?.pl?.amount)}
                            </span>
                          </div>
                        </React.Fragment>);
                      })}
                    </div>
                  </div>
                  {$s0?.reviewExtras ? (<>
                    <div {...S("display: flex; flex-direction: column; gap: 8px")}>
                      <span {...S($s0?.k?.secLabel)}>
                        {"Also in the contract"}
                      </span>
                      <div {...S($s0?.k?.group)}>
                        {A($s0?.extras).map((it, i) => {
                          const $s1 = { ...$s0, "x": it, $index: i };
                          return (<React.Fragment key={i}>
                            <div {...S($s1?.x?.rowStyle)}>
                              <span {...S(`display: inline-flex; align-items: center; height: 22px; padding: 0 8px; border-radius: ${I($s1?.t?.rCtl)}; background: ${I($s1?.t?.soft)}; color: ${I($s1?.t?.softFg)}; font-size: 12px; font-weight: 500; white-space: nowrap`)}>
                                {T($s1?.x?.tag)}
                              </span>
                              <span {...S(`flex: 1 1 auto; min-width: 0; color: ${I($s1?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                                {T($s1?.x?.text)}
                              </span>
                              <span {...S("font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums")}>
                                {T($s1?.x?.value)}
                              </span>
                            </div>
                          </React.Fragment>);
                        })}
                      </div>
                    </div>
                  </>) : null}
                  <div {...S("display: flex; flex-direction: column; gap: 8px")}>
                    <span {...S($s0?.k?.secLabel)}>
                      {"Rep contact "}
                      <span {...S(`font-weight: 400; color: ${I($s0?.t?.mutedFg)}`)}>
                        {"(optional)"}
                      </span>
                    </span>
                    <div {...S($s0?.k?.group)}>
                      <div {...S($s0?.k?.row)}>
                        <label htmlFor={"ad-rep"} {...S($s0?.k?.rowLabel)}>
                          {"Name"}
                        </label>
                        <input id={"ad-rep"} className={"ti"} value={V0($s0?.f?.rep, "")} onChange={$s0?.setRep} placeholder={"Full name"} {...S($s0?.k?.ctlW)} />
                      </div>
                      <div {...S($s0?.k?.rowT)}>
                        <label htmlFor={"ad-rep-email"} {...S($s0?.k?.rowLabel)}>
                          {"Email"}
                        </label>
                        <input id={"ad-rep-email"} className={"ti"} type={"email"} value={V0($s0?.f?.repEmail, "")} onChange={$s0?.setRepEmail} placeholder={"name@brand.com"} {...S($s0?.k?.ctlW)} />
                      </div>
                    </div>
                  </div>
                </div>
              </>) : null}
              {$s0?.isCsvMap ? (<>
                <div className={"a-in"} {...S("display: flex; flex-direction: column; gap: 16px; padding-top: 14px")}>
                  <div {...S(`display: flex; align-items: center; gap: 12px; padding: 12px 12px 12px 14px; ${I($s0?.k?.group)}`)}>
                    <span {...S(`width: 36px; height: 40px; flex: 0 0 36px; box-sizing: border-box; border-radius: 6px; background: ${I($s0?.t?.csvBg)}; color: ${I($s0?.t?.csvFg)}; display: inline-flex; align-items: flex-end; justify-content: center; padding-bottom: 5px; font-size: 9px; font-weight: 700; letter-spacing: 0.04em`)}>
                      {"CSV"}
                    </span>
                    <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                      <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                        {$s0?.ioT?.csvFile}
                      </span>
                      <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}; white-space: nowrap`)}>
                        {$s0?.ioT?.csvMeta}
                      </span>
                    </span>
                    <button type={"button"} className={"tb tg"} onClick={$s0?.backToPick} {...S(`--hv: ${I($s0?.t?.fill)}; ${I($s0?.k?.gSm)}`)}>
                      {"Change file"}
                    </button>
                  </div>
                  {$s0?.noBrand ? (<>
                    <div role={"alert"} className={"a-fade"} {...S(`display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.badBg)}; color: ${I($s0?.t?.badFg)}`)}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 16px; margin-top: 2px")}>
                        <path d={"M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"} />
                      </svg>
                      <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                        <span {...S("font-weight: 600")}>
                          {"Pick a column for Brand"}
                        </span>
                        <span {...S("font-size: 13px; line-height: 1.5")}>
                          {"Talby names each deal from it, so Next waits until one column is set to Brand. Your other choices stay as they are."}
                        </span>
                      </span>
                    </div>
                  </>) : null}
                  <div {...S($s0?.k?.group)}>
                    <div {...S(`display: grid; grid-template-columns: ${I($s0?.mapCols)}; align-items: center; gap: 12px; height: 38px; padding: 0 12px 0 14px; color: ${I($s0?.t?.mutedFg)}; font-size: 12px; font-weight: 500; border-bottom: 1px solid ${I($s0?.t?.line)}`)}>
                      <span>
                        {"Your column"}
                      </span>
                      {$s0?.notMob ? (<>
                        <span>
                          {"Example"}
                        </span>
                      </>) : null}
                      <span>
                        {"Talby field"}
                      </span>
                    </div>
                    {A($s0?.mapRows).map((it, i) => {
                      const $s1 = { ...$s0, "m": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div {...S(`position: relative; display: grid; grid-template-columns: ${I($s1?.mapCols)}; align-items: center; gap: 12px; min-height: 52px; padding: 8px 12px 8px 14px; box-sizing: border-box; border-top: ${I($s1?.m?.line)}`)}>
                          <span {...S("display: flex; align-items: center; gap: 8px; min-width: 0")}>
                            <span {...S(`width: 7px; height: 7px; flex: 0 0 7px; border-radius: 4px; background: ${I($s1?.m?.dot)}; transition: background-color 0.2s ease`)} />
                            <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                              {T($s1?.m?.col)}
                            </span>
                          </span>
                          {$s1?.notMob ? (<>
                            <span {...S(`min-width: 0; color: ${I($s1?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                              {T($s1?.m?.sample)}
                            </span>
                          </>) : null}
                          <button type={"button"} className={"tb tg"} onClick={$s1?.m?.toggle} aria-haspopup={"listbox"} aria-expanded={$s1?.m?.open} {...S(`--hv: ${I($s1?.t?.fillHover)}; height: 34px; color: ${I($s1?.m?.fg)}; ${I($s1?.k?.selF)}`)}>
                            <span {...S("white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                              {T($s1?.m?.field)}
                            </span>
                            <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s1?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 14px")}>
                              <path d={"m6 9 6 6 6-6"} />
                            </svg>
                          </button>
                          {$s1?.m?.open ? (<>
                            <div role={"listbox"} aria-label={"Talby field"} className={$s1?.popAnim} {...S(`z-index: 10; ${I($s1?.ps?.map)}; ${I($s1?.m?.popY)}; ${I($s1?.k?.pop)}; ${I($s1?.ps?.tail)}`)}>
                              {$s1?.mob ? (<>
                                <span {...S($s1?.ps?.head)}>
                                  {"Talby field for "}{T($s1?.m?.col)}
                                </span>
                              </>) : null}
                              {A($s1?.m?.opts).map((it, i) => {
                                const $s2 = { ...$s1, "o": it, $index: i };
                                return (<React.Fragment key={i}>
                                  <button type={"button"} role={"option"} className={"tb tg"} aria-selected={$s2?.o?.on} onClick={$s2?.o?.pick} {...S(`justify-content: space-between; ${I($s2?.k?.item)}`)}>
                                    {T($s2?.o?.label)}
                                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`visibility: ${I($s2?.o?.check)}`)}>
                                      <path d={"M20 6 9 17l-5-5"} />
                                    </svg>
                                  </button>
                                </React.Fragment>);
                              })}
                            </div>
                          </>) : null}
                        </div>
                      </React.Fragment>);
                    })}
                  </div>
                  {$s0?.brandMapped ? (<>
                    <div {...S(`display: flex; align-items: center; gap: 10px; padding: 12px 14px; ${I($s0?.k?.tile)}`)}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s0?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 16px")}>
                        <circle cx={"12"} cy={"12"} r={"10"} />
                        <path d={"M12 16v-4M12 8h.01"} />
                      </svg>
                      <span {...S(`color: ${I($s0?.t?.mutedFg)}; ${I($s0?.subSt)}`)}>
                        {T($s0?.mapNote)}
                      </span>
                    </div>
                  </>) : null}
                </div>
              </>) : null}
              {$s0?.isCsvPreview ? (<>
                <div className={"a-in"} {...S("display: flex; flex-direction: column; gap: 16px; padding-top: 14px")}>
                  <div {...S("display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px")}>
                    {A($s0?.csvStats).map((it, i) => {
                      const $s1 = { ...$s0, "s": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div {...S(`display: flex; flex-direction: column; gap: 2px; padding: 12px 14px; min-width: 0; ${I($s1?.k?.tile)}`)}>
                          <span {...S(`font-family: ${I($s1?.titleFam)}; font-size: 22px; font-weight: 600; letter-spacing: -0.4px; font-variant-numeric: tabular-nums; color: ${I($s1?.s?.fg)}`)}>
                            {T($s1?.s?.value)}
                          </span>
                          <span {...S(`font-size: 13px; color: ${I($s1?.t?.mutedFg)}; ${I($s1?.statSt)}`)}>
                            {T($s1?.s?.label)}
                          </span>
                        </div>
                      </React.Fragment>);
                    })}
                  </div>
                  <button type={"button"} role={"checkbox"} className={"tb"} aria-checked={$s0?.skipDup} onClick={$s0?.toggleDup} {...S(`display: flex; align-items: center; gap: 10px; padding: 0 2px; border: none; background: transparent; font: inherit; font-size: 14px; color: ${I($s0?.t?.fg)}; text-align: left; cursor: pointer`)}>
                    <span {...S($s0?.dupBox)}>
                      <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`visibility: ${I($s0?.dupCheck)}`)}>
                        <path d={"M20 6 9 17l-5-5"} />
                      </svg>
                    </span>
                    {$s0?.ioT?.skip}
                  </button>
                  {$s0?.oneWarn ? (<>
                    <div {...S(`display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.warnBg)}; color: ${I($s0?.t?.warnFg)}`)}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 16px")}>
                        <path d={"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3zM12 9v4M12 17h.01"} />
                      </svg>
                      <span {...S(`min-width: 0; ${I($s0?.subSt)}`)}>
                        {$s0?.ioT?.noAmt}
                      </span>
                    </div>
                  </>) : null}
                  {$s0?.rowIssues ? (<>
                    <div role={"status"} {...S(`display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.warnBg)}; color: ${I($s0?.t?.warnFg)}`)}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 16px; margin-top: 2px")}>
                        <path d={"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3zM12 9v4M12 17h.01"} />
                      </svg>
                      <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 6px")}>
                        <span {...S("font-weight: 600")}>
                          {$s0?.ioT?.look}
                        </span>
                        {A($s0?.issues).map((it, i) => {
                          const $s1 = { ...$s0, "iss": it, $index: i };
                          return (<React.Fragment key={i}>
                            <span {...S("display: flex; align-items: flex-start; gap: 8px; font-size: 13px; line-height: 1.5")}>
                              <span {...S("width: 4px; height: 4px; flex: 0 0 4px; margin-top: 8px; border-radius: 2px; background: currentColor")} />
                              <span {...S("min-width: 0")}>
                                {T($s1?.iss)}
                              </span>
                            </span>
                          </React.Fragment>);
                        })}
                      </span>
                    </div>
                  </>) : null}
                  <div {...S($s0?.k?.group)}>
                    {A($s0?.csvRows).map((it, i) => {
                      const $s1 = { ...$s0, "r": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div {...S(`opacity: ${I($s1?.r?.op)}; transition: opacity 0.2s ease; ${I($s1?.r?.rowStyle)}`)}>
                          <span {...S(`width: 30px; height: 30px; flex: 0 0 30px; border-radius: ${I($s1?.t?.rCtl)}; background: ${I($s1?.t?.fill)}; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600`)}>
                            {T($s1?.r?.l)}
                          </span>
                          <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 1px")}>
                            <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                              {T($s1?.r?.brand)}
                            </span>
                            <span {...S(`font-size: 13px; color: ${I($s1?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                              {T($s1?.r?.sub)}
                            </span>
                          </span>
                          {$s1?.r?.isDup ? (<>
                            <span {...S($s1?.k?.badge)}>
                              {T($s1?.r?.dupLabel)}
                            </span>
                          </>) : null}
                          {$s1?.r?.isFix ? (<>
                            <span {...S(`${I($s1?.k?.badge)}; border-color: transparent; background: ${I($s1?.t?.warnBg)}; color: ${I($s1?.t?.warnFg)}; flex-shrink: 0`)}>
                              {T($s1?.r?.fixLabel)}
                            </span>
                          </>) : null}
                          <span {...S(`width: 72px; flex: 0 0 auto; text-align: right; font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums; color: ${I($s1?.r?.amtFg)}`)}>
                            {T($s1?.r?.amount)}
                          </span>
                        </div>
                      </React.Fragment>);
                    })}
                    {$s0?.ioT?.hasMore ? (<>
                    <div {...S(`padding: 12px 14px; border-top: 1px solid ${I($s0?.t?.line)}; color: ${I($s0?.t?.mutedFg)}; font-size: 13px`)}>
                      {$s0?.ioT?.more}
                    </div>
                    </>) : null}
                  </div>
                </div>
              </>) : null}
              {$s0?.isConnect ? (<>
                <div className={"a-in"} {...S("display: flex; flex-direction: column; align-items: stretch; gap: 22px; padding-top: 18px")}>
                  <div {...S("display: flex; align-items: center; justify-content: center; gap: 14px; padding: 26px 0 18px")}>
                    <span {...S(`width: 60px; height: 60px; box-sizing: border-box; border-radius: ${I($s0?.t?.rCard)}; background: #FFFFFF; border: 1px solid #E5E5E5; color: #191919; display: inline-flex; align-items: center; justify-content: center; font-family: Georgia, serif; font-size: 28px; font-weight: 700; box-shadow: 0 8px 20px -10px rgba(0,0,0,0.25)`)}>
                      <img src="/logo-notion.png" alt="Notion" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', boxSizing: 'border-box', borderRadius: 'inherit' }}/>
                    </span>
                    <span {...S("display: inline-flex; align-items: center; gap: 6px")}>
                      <span className={"a-pulse"} {...S(`width: 6px; height: 6px; border-radius: 3px; background: ${I($s0?.t?.borderStrong)}`)} />
                      <span className={"a-pulse"} {...S(`width: 6px; height: 6px; border-radius: 3px; background: ${I($s0?.t?.borderStrong)}; animation-delay: 0.2s`)} />
                      <span className={"a-pulse"} {...S(`width: 6px; height: 6px; border-radius: 3px; background: ${I($s0?.t?.borderStrong)}; animation-delay: 0.4s`)} />
                    </span>
                    <span {...S(`width: 60px; height: 60px; border-radius: ${I($s0?.t?.rCard)}; background: ${I($s0?.t?.primary)}; color: ${I($s0?.t?.primaryFg)}; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px -10px ${I($s0?.t?.glow)}`)}>
                      <svg width={"26"} height={"26"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"} />
                      </svg>
                    </span>
                  </div>
                  <div {...S($s0?.k?.group)}>
                    {A($s0?.perms).map((it, i) => {
                      const $s1 = { ...$s0, "pm": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div {...S($s1?.pm?.rowStyle)}>
                          <span {...S(`width: 32px; height: 32px; flex: 0 0 32px; border-radius: 16px; background: ${I($s1?.t?.fill)}; display: inline-flex; align-items: center; justify-content: center`)}>
                            <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={$s1?.pm?.icon} />
                            </svg>
                          </span>
                          <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                            <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                              {T($s1?.pm?.title)}
                            </span>
                            <span {...S(`font-size: 13px; color: ${I($s1?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                              {T($s1?.pm?.sub)}
                            </span>
                          </span>
                        </div>
                      </React.Fragment>);
                    })}
                  </div>
                </div>
              </>) : null}
              {$s0?.isDb ? (<>
                <div className={"a-in"} {...S("display: flex; flex-direction: column; gap: 14px; padding-top: 14px")}>
                  <div {...S(`display: flex; align-items: center; gap: 10px; padding: 10px 10px 10px 14px; ${I($s0?.k?.tile)}`)}>
                    <span {...S("width: 8px; height: 8px; flex: 0 0 8px; border-radius: 4px; background: #22C55E")} />
                    <span {...S("flex: 1 1 auto; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                      {"Connected to "}
                      <b {...S("font-weight: 600")}>
                        {$s0?.ioT?.ws}
                      </b>
                    </span>
                    <button type={"button"} className={"tb tg"} onClick={$s0?.switchWs} {...S(`--hv: ${I($s0?.t?.card)}; ${I($s0?.k?.gSm)}`)}>
                      {"Switch"}
                    </button>
                  </div>
                  <label className={"ti"} {...S(`display: flex; align-items: center; gap: 8px; height: 36px; padding: 0 14px; box-sizing: border-box; border-radius: ${I($s0?.t?.rCtl)}; background: ${I($s0?.t?.fill)}; color: ${I($s0?.t?.mutedFg)}`)}>
                    <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 15px")}>
                      <circle cx={"11"} cy={"11"} r={"8"} />
                      <path d={"m21 21-4.3-4.3"} />
                    </svg>
                    <input type={"search"} aria-label={"Search databases"} placeholder={"Search databases"} value={V0($s0?.dbQ, "")} onChange={$s0?.setDbQ} {...S(`flex: 1 1 auto; min-width: 0; height: 34px; border: none; outline: none; background: transparent; font: inherit; font-size: 14px; color: ${I($s0?.t?.fg)}; padding: 0`)} />
                  </label>
                  <div role={"radiogroup"} aria-label={"Databases"} {...S("display: flex; flex-direction: column; gap: 8px")}>
                    {A($s0?.dbs).map((it, i) => {
                      const $s1 = { ...$s0, "d": it, $index: i };
                      return (<React.Fragment key={i}>
                        <button type={"button"} role={"radio"} className={"tb tg"} aria-checked={$s1?.d?.on} onClick={$s1?.d?.pick} {...S(`--hv: ${I($s1?.d?.hv)}; display: flex; align-items: center; gap: 12px; width: 100%; min-height: 60px; padding: 10px 14px; box-sizing: border-box; border: none; border-radius: ${I($s1?.t?.rTile)}; background: ${I($s1?.d?.bg)}; box-shadow: ${I($s1?.d?.ring)}; color: ${I($s1?.t?.fg)}; font: inherit; text-align: left; cursor: pointer`)}>
                          <span {...S(`width: 34px; height: 34px; flex: 0 0 34px; border-radius: ${I($s1?.t?.rSm)}; background: ${I($s1?.t?.fill)}; display: inline-flex; align-items: center; justify-content: center`)}>
                            <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={"M12 3v18M3 9h18M3 15h18M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"} />
                            </svg>
                          </span>
                          <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                            <span {...S("display: flex; align-items: center; gap: 8px; min-width: 0")}>
                              <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                                {T($s1?.d?.name)}
                              </span>
                              {$s1?.d?.rec ? (<>
                                <span {...S(`display: inline-flex; align-items: center; height: 20px; padding: 0 7px; border-radius: ${I($s1?.t?.rCtl)}; background: ${I($s1?.t?.soft)}; color: ${I($s1?.t?.softFg)}; font-size: 11px; font-weight: 600; white-space: nowrap`)}>
                                  {"Looks like deals"}
                                </span>
                              </>) : null}
                            </span>
                            <span {...S(`font-size: 13px; color: ${I($s1?.t?.mutedFg)}; white-space: nowrap`)}>
                              {T($s1?.d?.meta)}
                            </span>
                          </span>
                          <span {...S(`width: 18px; height: 18px; flex: 0 0 18px; box-sizing: border-box; border-radius: 9px; border: ${I($s1?.d?.radioBorder)}; background: ${I($s1?.d?.radioBg)}; display: inline-flex; align-items: center; justify-content: center; transition: background-color 0.15s ease`)}>
                            <span {...S(`width: 6px; height: 6px; border-radius: 3px; background: ${I($s1?.t?.primaryFg)}; visibility: ${I($s1?.d?.dot)}`)} />
                          </span>
                        </button>
                      </React.Fragment>);
                    })}
                    {$s0?.noDb ? (<>
                      <div {...S(`padding: 24px 0; text-align: center; color: ${I($s0?.t?.mutedFg)}`)}>
                        {"No databases match."}
                      </div>
                    </>) : null}
                  </div>
                </div>
              </>) : null}
              {$s0?.isMap ? (<>
                <div className={"a-in"} {...S("display: flex; flex-direction: column; gap: 16px; padding-top: 14px")}>
                  <div {...S($s0?.k?.group)}>
                    <div {...S(`display: grid; grid-template-columns: ${I($s0?.nmapCols)}; align-items: center; gap: 12px; height: 38px; padding: 0 12px 0 14px; color: ${I($s0?.t?.mutedFg)}; font-size: 12px; font-weight: 500; border-bottom: 1px solid ${I($s0?.t?.line)}`)}>
                      <span>
                        {"Notion property"}
                      </span>
                      <span>
                        {"Talby field"}
                      </span>
                    </div>
                    {A($s0?.nmapRows).map((it, i) => {
                      const $s1 = { ...$s0, "m": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div {...S(`position: relative; display: flex; flex-direction: column; gap: 8px; padding: 8px 12px 8px 14px; box-sizing: border-box; border-top: ${I($s1?.m?.line)}`)}>
                          <div {...S(`display: grid; grid-template-columns: ${I($s1?.nmapCols)}; align-items: center; gap: 12px; min-height: 36px`)}>
                            <span {...S("display: flex; align-items: center; gap: 10px; min-width: 0")}>
                              <span {...S(`display: inline-flex; align-items: center; justify-content: center; min-width: 28px; height: 22px; padding: 0 6px; box-sizing: border-box; border-radius: 6px; background: ${I($s1?.t?.fill)}; color: ${I($s1?.t?.mutedFg)}; font-size: 11px; font-weight: 600; white-space: nowrap`)}>
                                {T($s1?.m?.type)}
                              </span>
                              <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                                {T($s1?.m?.col)}
                              </span>
                            </span>
                            <button type={"button"} className={"tb tg"} onClick={$s1?.m?.toggle} aria-haspopup={"listbox"} aria-expanded={$s1?.m?.open} {...S(`--hv: ${I($s1?.t?.fillHover)}; height: 34px; color: ${I($s1?.m?.fg)}; ${I($s1?.k?.selF)}`)}>
                              <span {...S("white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                                {T($s1?.m?.field)}
                              </span>
                              <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s1?.t?.mutedFg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 14px")}>
                                <path d={"m6 9 6 6 6-6"} />
                              </svg>
                            </button>
                          </div>
                          {$s1?.m?.hasValues ? (<>
                            <div {...S("display: flex; flex-wrap: wrap; gap: 6px; padding: 0 0 4px 38px")}>
                              {A($s1?.m?.values).map((it, i) => {
                                const $s2 = { ...$s1, "v": it, $index: i };
                                return (<React.Fragment key={i}>
                                  <span {...S(`display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 10px; box-sizing: border-box; border-radius: ${I($s2?.t?.rCtl)}; background: ${I($s2?.t?.fill)}; font-size: 12px; font-weight: 500; white-space: nowrap`)}>
                                    {T($s2?.v?.from)}
                                    <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s2?.t?.mutedFg} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                      <path d={"M5 12h14M12 5l7 7-7 7"} />
                                    </svg>
                                    {T($s2?.v?.to)}
                                  </span>
                                </React.Fragment>);
                              })}
                            </div>
                          </>) : null}
                          {$s1?.m?.open ? (<>
                            <div role={"listbox"} aria-label={"Talby field"} className={$s1?.popAnim} {...S(`z-index: 10; ${I($s1?.ps?.map)}; ${I($s1?.m?.popY)}; ${I($s1?.k?.pop)}; ${I($s1?.ps?.tail)}`)}>
                              {$s1?.mob ? (<>
                                <span {...S($s1?.ps?.head)}>
                                  {"Talby field for "}{T($s1?.m?.col)}
                                </span>
                              </>) : null}
                              {A($s1?.m?.opts).map((it, i) => {
                                const $s2 = { ...$s1, "o": it, $index: i };
                                return (<React.Fragment key={i}>
                                  <button type={"button"} role={"option"} className={"tb tg"} aria-selected={$s2?.o?.on} onClick={$s2?.o?.pick} {...S(`justify-content: space-between; ${I($s2?.k?.item)}`)}>
                                    {T($s2?.o?.label)}
                                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`visibility: ${I($s2?.o?.check)}`)}>
                                      <path d={"M20 6 9 17l-5-5"} />
                                    </svg>
                                  </button>
                                </React.Fragment>);
                              })}
                            </div>
                          </>) : null}
                        </div>
                      </React.Fragment>);
                    })}
                  </div>
                </div>
              </>) : null}
              {$s0?.isPreview ? (<>
                <div className={"a-in"} {...S("display: flex; flex-direction: column; gap: 14px; padding-top: 14px")}>
                  <div {...S($s0?.k?.group)}>
                    <button type={"button"} role={"checkbox"} className={"tb tg"} aria-checked={$s0?.allSel} onClick={$s0?.toggleAllN} {...S(`--hv: ${I($s0?.t?.hoverCard)}; display: flex; align-items: center; gap: 12px; width: 100%; height: 44px; padding: 0 14px; box-sizing: border-box; border: none; border-bottom: 1px solid ${I($s0?.t?.line)}; border-radius: ${I($s0?.t?.rTileTop)}; background: transparent; color: ${I($s0?.t?.mutedFg)}; font: inherit; font-size: 13px; font-weight: 500; text-align: left; cursor: pointer`)}>
                      <span {...S($s0?.allBox)}>
                        <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`visibility: ${I($s0?.allCheck)}`)}>
                          <path d={$s0?.allIcon} />
                        </svg>
                      </span>
                      <span {...S("flex: 1 1 auto")}>
                        {T($s0?.selLabel)}
                      </span>
                      <span>
                        {"Amount"}
                      </span>
                    </button>
                    {A($s0?.nRows).map((it, i) => {
                      const $s1 = { ...$s0, "r": it, $index: i };
                      return (<React.Fragment key={i}>
                        <button type={"button"} role={"checkbox"} className={"tb tg"} aria-checked={$s1?.r?.on} aria-disabled={$s1?.r?.isDup} onClick={$s1?.r?.toggle} {...S(`--hv: ${I($s1?.r?.hv)}; display: flex; align-items: center; gap: 12px; width: 100%; min-height: 56px; padding: 8px 14px; box-sizing: border-box; border: none; border-top: ${I($s1?.r?.line)}; background: transparent; color: ${I($s1?.t?.fg)}; font: inherit; text-align: left; cursor: ${I($s1?.r?.cursor)}; opacity: ${I($s1?.r?.op)}`)}>
                          <span {...S($s1?.r?.box)}>
                            <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S(`visibility: ${I($s1?.r?.check)}`)}>
                              <path d={"M20 6 9 17l-5-5"} />
                            </svg>
                          </span>
                          <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 1px")}>
                            <span {...S("font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                              {T($s1?.r?.brand)}
                            </span>
                            <span {...S(`font-size: 13px; color: ${I($s1?.t?.mutedFg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                              {T($s1?.r?.sub)}
                            </span>
                          </span>
                          {$s1?.r?.isDup ? (<>
                            <span {...S($s1?.k?.badge)}>
                              {"In Talby"}
                            </span>
                          </>) : null}
                          {$s1?.r?.negBadge ? (<>
                            <span {...S(`color: ${I($s1?.t?.fg)}; ${I($s1?.k?.badge)}`)}>
                              <span {...S("width: 6px; height: 6px; border-radius: 3px; background: #F59E0B")} />
                              {"Negotiating"}
                            </span>
                          </>) : null}
                          <span {...S("width: 64px; flex: 0 0 auto; text-align: right; font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums")}>
                            {T($s1?.r?.amount)}
                          </span>
                        </button>
                      </React.Fragment>);
                    })}
                  </div>
                  <span {...S(`padding: 0 4px; font-size: 13px; line-height: 1.5; color: ${I($s0?.t?.mutedFg)}`)}>
                    {"Files on Notion pages do not transfer. Add contracts to each deal after you import."}
                  </span>
                  <button type={"button"} role={"switch"} className={"tb"} aria-checked={$s0?.sync} onClick={$s0?.toggleSync} {...S(`display: flex; align-items: center; gap: 14px; width: 100%; padding: 14px 16px; box-sizing: border-box; border: none; border-radius: ${I($s0?.t?.rTile)}; background: ${I($s0?.t?.tile)}; color: ${I($s0?.t?.fg)}; font: inherit; text-align: left; cursor: pointer`)}>
                    <span {...S("flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                      <span {...S("font-weight: 500")}>
                        {"Keep in sync"}
                      </span>
                      <span {...S(`font-size: 13px; color: ${I($s0?.t?.mutedFg)}; ${I($s0?.subSt)}`)}>
                        {"New rows you add in Notion show up in Talby on their own."}
                      </span>
                    </span>
                    <span {...S($s0?.swTrack)}>
                      <span {...S($s0?.swKnob)} />
                    </span>
                  </button>
                </div>
              </>) : null}
              {$s0?.isImporting ? (<>
                <div className={"a-in"} {...S("display: flex; flex-direction: column; gap: 18px; padding-top: 18px")}>
                  <div {...S("display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 18px 0 6px; text-align: center")}>
                    <span {...S("position: relative; width: 64px; height: 64px; display: inline-flex; align-items: center; justify-content: center")}>
                      <svg className={"a-spin"} width={"64"} height={"64"} viewBox={"0 0 64 64"} fill={"none"} aria-hidden={"true"} {...S("position: absolute; top: 0; left: 0")}>
                        <circle cx={"32"} cy={"32"} r={"28"} stroke={$s0?.t?.off} strokeWidth={"4"} />
                        <path d={"M32 4a28 28 0 0 1 28 28"} stroke={$s0?.t?.primary} strokeWidth={"4"} strokeLinecap={"round"} />
                      </svg>
                      <span {...S(`font-family: ${I($s0?.titleFam)}; font-size: 18px; font-weight: 600; font-variant-numeric: tabular-nums`)}>
                        {T($s0?.impPct)}
                      </span>
                    </span>
                    <span {...S("font-size: 16px; font-weight: 600")}>
                      {T($s0?.impLabel)}
                    </span>
                    <span {...S(`color: ${I($s0?.t?.mutedFg)}`)}>
                      {"Dates, amounts and payment status come with them."}
                    </span>
                  </div>
                  <div {...S($s0?.k?.group)}>
                    {A($s0?.impRows).map((it, i) => {
                      const $s1 = { ...$s0, "r": it, $index: i };
                      return (<React.Fragment key={i}>
                        <div {...S($s1?.r?.rowStyle)}>
                          <span {...S("width: 22px; height: 22px; flex: 0 0 22px; display: inline-flex; align-items: center; justify-content: center")}>
                            {$s1?.r?.done ? (<>
                              <svg className={"a-check"} width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <circle cx={"12"} cy={"12"} r={"10"} fill={"#22C55E"} stroke={"#22C55E"} />
                                <path d={"m8 12.5 2.6 2.6L16 9.5"} stroke={"#FFFFFF"} />
                              </svg>
                            </>) : null}
                            {$s1?.r?.cur ? (<>
                              <svg className={"a-spin"} width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={$s1?.t?.primary} strokeWidth={"2.6"} strokeLinecap={"round"} aria-hidden={"true"}>
                                <path d={"M21 12a9 9 0 1 1-6.22-8.56"} />
                              </svg>
                            </>) : null}
                            {$s1?.r?.wait ? (<>
                              <span {...S(`width: 16px; height: 16px; box-sizing: border-box; border-radius: 8px; border: 1.5px dashed ${I($s1?.t?.borderStrong)}`)} />
                            </>) : null}
                          </span>
                          <span {...S(`flex: 1 1 auto; min-width: 0; font-weight: 500; color: ${I($s1?.r?.fg)}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                            {T($s1?.r?.brand)}
                          </span>
                          <span {...S(`font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums; color: ${I($s1?.r?.fg)}`)}>
                            {T($s1?.r?.amount)}
                          </span>
                        </div>
                      </React.Fragment>);
                    })}
                  </div>
                </div>
              </>) : null}
            </div>
            {$s0?.sheetScrim ? (<>
              <button type={"button"} aria-label={"Close list"} className={"a-fade"} onClick={$s0?.closePop} {...S(`position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 81; padding: 0; border: none; background: ${I($s0?.t?.overlay)}; cursor: default`)} />
            </>) : null}
            {$s0?.notLocked ? (<>
              <div {...S(`display: flex; align-items: center; gap: 8px; padding: ${I($s0?.footPad)}; border-top: 1px solid ${I($s0?.t?.line)}`)}>
                {$s0?.showMeta ? (<>
                  <span {...S(`display: inline-flex; align-items: center; gap: 8px; flex: 1 1 auto; min-width: 0; color: ${I($s0?.t?.mutedFg)}; font-size: 13px; white-space: nowrap; overflow: hidden`)}>
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} {...S("flex: 0 0 14px")}>
                      <path d={$s0?.foot?.icon} />
                    </svg>
                    <span {...S("overflow: hidden; text-overflow: ellipsis")}>
                      {T($s0?.foot?.meta)}
                    </span>
                  </span>
                </>) : null}
                {$s0?.noMeta ? (<>
                  <span {...S("flex: 1 1 auto")} />
                </>) : null}
                {$s0?.foot?.hasBack ? (<>
                  <button type={"button"} className={"tb tg"} onClick={$s0?.foot?.back} {...S(`--hv: ${I($s0?.t?.hoverCard)}; flex: ${I($s0?.btnFlex)}; ${I($s0?.k?.btnO)}`)}>
                    {T($s0?.foot?.backLabel)}
                  </button>
                </>) : null}
                {$s0?.foot?.hasNext ? (<>
                  <button type={"button"} className={"tb tp"} onClick={$s0?.foot?.next} aria-disabled={$s0?.foot?.off} {...S(`flex: ${I($s0?.btnFlex)}; opacity: ${I($s0?.foot?.op)}; ${I($s0?.k?.btnP)}`)}>
                    {$s0?.foot?.busy ? (<>
                      <svg className={"a-spin"} width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} aria-hidden={"true"}>
                        <path d={"M21 12a9 9 0 1 1-6.22-8.56"} />
                      </svg>
                    </>) : null}
                    {$s0?.foot?.notion ? (<>
                      <span {...S("width: 18px; height: 18px; box-sizing: border-box; border-radius: 4px; background: #FFFFFF; color: #191919; display: inline-flex; align-items: center; justify-content: center; font-family: Georgia, serif; font-size: 12px; font-weight: 700")}>
                        <img src="/logo-notion.png" alt="Notion" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', boxSizing: 'border-box', borderRadius: 'inherit' }}/>
                      </span>
                    </>) : null}
                    {T($s0?.foot?.nextLabel)}
                  </button>
                </>) : null}
              </div>
            </>) : null}
          </div>
        </div>
      </>) : null}
  </>);
}

export const meta = {"props":{"open":{"editor":"enum","options":["new","upload","notion"],"default":"new"},"step":{"editor":"enum","options":["","pick","csvPick","reading","review","csvMap","csvPreview","connect","db","map","preview","importing","formInvalid","saveFail","pickBig","pickType","pickOffline","readFail","reviewFew","csvEmpty","csvNoBrand","csvRowIssues","csvPartial","notionSetup","connectDenied","notionLost","dbNone","dbEmpty","fetchFail","importPartial","locked"],"default":""},"locked":{"editor":"enum","options":["","readonly","canceled"],"default":""},"color":{"editor":"enum","options":["studio","sand","mac","stationery","editorial"],"default":"studio"},"dark":{"editor":"boolean","default":false},"frame":{"editor":null},"demo":{"editor":null},"mobile":{"editor":null},"onClose":{"editor":null},"onCreated":{"editor":null}},"preview":{"width":760,"height":860}};
export default $r.defineBoard("SAddDeal", Component, render, CSS, meta);
