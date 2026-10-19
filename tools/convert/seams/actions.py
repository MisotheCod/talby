"""Save hooks: each write calls self.emit(type, payload). See ACTIONS.md."""
from seam_lib import Patch
import sys
D = sys.argv[1]

# remember the write title so emit can reuse it for the error toast
for name in ['SOverview', 'SDeals']:
    p = Patch(D + '/' + name + '.tsx')
    if name == 'SDeals':
        p.rep("    if (this.props.writes === 'fail') { this.toastErr(title, desc || 'Check your connection and try again.', function () { if (self.guard()) fn(); }); return false; }\n    fn(); return true;",
              "    if (this.props.writes === 'fail') { this.toastErr(title, desc || 'Check your connection and try again.', function () { if (self.guard()) fn(); }); return false; }\n    this._wt = title; try { fn(); } finally { this._wt = null; } return true;")
    else:
        p.rep("    if (this.props.writes === 'fail') { this.toastErr(title, 'Check your connection and try again.', function () { if (self.guard()) fn(); }); return false; }\n    fn(); return true;",
              "    if (this.props.writes === 'fail') { this.toastErr(title, 'Check your connection and try again.', function () { if (self.guard()) fn(); }); return false; }\n    this._wt = title; try { fn(); } finally { this._wt = null; } return true;")
    p.save()

# every page: deals created in the New deal dialog
for name in ['SOverview', 'SDeals', 'SCalendar', 'SPayments', 'SIdeas', 'STodos', 'SSettings', 'SWelcome']:
    p = Patch(D + '/' + name + '.tsx')
    p.rep("onCreated: function (info) { self.setState({ add: '' }); self.celebrate(info || {});",
          "onCreated: function (info) { self.setState({ add: '' }); self.celebrate(info || {}); if (info) self.emit(info.kind === 'deal' ? 'deal.create' : 'deals.import', info, info.kind === 'deal' ? 'Could not save the deal' : 'Could not import the deals');")
    p.rep("<SAddDeal ", "<SAddDeal dealsThisYear={$s0?.account?.dealsThisYear} ", count=p.s.count("<SAddDeal "))
    p.save()

p = Patch(D + '/SOnboard.tsx')
p.rep("onCreated: function (info) { var d0 = info && info.deals && info.deals[0];", "onCreated: function (info) { if (info) self.emit(info.kind === 'deal' ? 'deal.create' : 'deals.import', info, 'Could not save the deal'); var d0 = info && info.deals && info.deals[0];")
p.save()

# New deal dialog: hand the whole form back, and count this year's deals for real
p = Patch(D + '/SAddDeal.tsx')
p.rep("self.done({ kind: 'deal', count: 1, deals: [{ brand: f.brand.trim(), amt: total, status: f.status, post: f.post || '' }],",
      "self.done({ kind: 'deal', count: 1, form: Object.assign({}, f), plan: plan, deals: [{ brand: f.brand.trim(), amt: total, status: f.status, post: f.post || '' }],")
p.rep("' is in. That makes 27 deals this year.'", "' is in. That makes ' + ((typeof p.dealsThisYear === 'number' ? p.dealsThisYear : 26) + 1) + ' deals this year.'")
p.save()

# ---------------- Overview
p = Patch(D + '/SOverview.tsx')
p.rep("paid: function () { self.write('Could not mark it paid', function () { self.resolve(a.id,",
      "paid: function () { self.write('Could not mark it paid', function () { self.emit('payment.markPaid', { brand: a.brand, amount: a.amt }); self.resolve(a.id,")
p.rep("self.write('Could not add the date', function () { self.resolve(a.id);",
      "self.write('Could not add the date', function () { self.emit('deal.setPayBy', { brand: a.brand, date: v }); self.resolve(a.id);")
p.rep("self.write('Could not update the to-do', function () { self.tickTodo(x.id); }",
      "self.write('Could not update the to-do', function () { self.emit('todo.setDone', { id: x.id, done: true }); self.tickTodo(x.id); }")
p.rep("self.setState({ todos: cur.concat([{ id: id, text: tx, deal: 'No deal', done: false }]), todoDraft: '' });",
      "self.setState({ todos: cur.concat([{ id: id, text: tx, deal: 'No deal', done: false }]), todoDraft: '' }); self.emit('todo.create', { text: tx, deal: '' });")
p.save()

# ---------------- Deals
p = Patch(D + '/SDeals.tsx')
p.rep("var o = Object.assign({}, st[field]); selIds.forEach(function (id) { o[id] = true; }); var u = {}; u[field] = o; u.sel = {}; u.selMode = false; self.setState(u);",
      "var o = Object.assign({}, st[field]); selIds.forEach(function (id) { o[id] = true; }); var u = {}; u[field] = o; u.sel = {}; u.selMode = false; self.setState(u);\n"
      "      self.emit('deals.bulk', { change: field === 'paidIds' ? 'paid' : field === 'invIds' ? 'invoiced' : 'archived', ids: all.filter(function (d) { return st.sel[d.id]; }).map(function (d) { return d.dbId; }) });")
p.rep("self.write('Could not mark it paid', function () { var o = Object.assign({}, self.state.paidIds); o[rmDeal.id] = true;",
      "self.write('Could not mark it paid', function () { self.emit('deal.markPaid', { id: rmDeal.dbId, amount: rmDeal.amt }); var o = Object.assign({}, self.state.paidIds); o[rmDeal.id] = true;")
p.rep("self.write('Could not duplicate the deal', function () { var ad = self.state.added;",
      "self.write('Could not duplicate the deal', function () { self.emit('deal.duplicate', { id: rmDeal.dbId }); var ad = self.state.added;")
p.rep("self.write('Could not archive the deal', function () { var prev = self.state.archived, o = Object.assign({}, prev); o[rmDeal.id] = true; self.setState({ archived: o }); self.toast('Deal archived', rmDeal.brand, function () { self.setState({ archived: prev }); }); });",
      "self.write('Could not archive the deal', function () { self.emit('deal.archive', { id: rmDeal.dbId }); var prev = self.state.archived, o = Object.assign({}, prev); o[rmDeal.id] = true; self.setState({ archived: o }); self.toast('Deal archived', rmDeal.brand, function () { self.setState({ archived: prev }); self.emit('deal.unarchive', { id: rmDeal.dbId }, 'Could not undo'); }); });")
p.rep("self.write('Could not delete the deal', function () { var prev = self.state.removed, o = Object.assign({}, prev); o[rmDeal.id] = true; self.setState({ removed: o }); self.toast('Deal deleted', rmDeal.brand, function () { self.setState({ removed: prev }); }); });",
      "self.write('Could not delete the deal', function () { self.emit('deal.delete', { id: rmDeal.dbId }); var prev = self.state.removed, o = Object.assign({}, prev); o[rmDeal.id] = true; self.setState({ removed: o }); self.toast('Deal deleted', rmDeal.brand, function () { self.setState({ removed: prev }); self.emit('deal.restore', { id: rmDeal.dbId }, 'Could not undo'); }); });")
p.rep("sheetDup: function () { self.setState({ sheetMenu: false }); self.write('Could not duplicate the deal', function () { self.toast('Deal duplicated', cur.brand + ' (copy)'); }); },",
      "sheetDup: function () { self.setState({ sheetMenu: false }); self.write('Could not duplicate the deal', function () { self.emit('deal.duplicate', { id: cur.dbId }); self.toast('Deal duplicated', cur.brand + ' (copy)'); }); },")
p.rep("self.write('Could not archive the deal', function () { var prev = self.state.archived, o = Object.assign({}, prev); o[cur.id] = true; self.setState({ archived: o, open: -1 }); self.toast('Deal archived', cur.brand, function () { self.setState({ archived: prev }); }); });",
      "self.write('Could not archive the deal', function () { self.emit('deal.archive', { id: cur.dbId }); var prev = self.state.archived, o = Object.assign({}, prev); o[cur.id] = true; self.setState({ archived: o, open: -1 }); self.toast('Deal archived', cur.brand, function () { self.setState({ archived: prev }); self.emit('deal.unarchive', { id: cur.dbId }, 'Could not undo'); }); });")
p.rep("self.write('Could not delete the deal', function () { var prev = self.state.removed, o = Object.assign({}, prev); o[cur.id] = true; self.setState({ removed: o, open: -1 }); self.toast('Deal deleted', cur.brand, function () { self.setState({ removed: prev }); }); });",
      "self.write('Could not delete the deal', function () { self.emit('deal.delete', { id: cur.dbId }); var prev = self.state.removed, o = Object.assign({}, prev); o[cur.id] = true; self.setState({ removed: o, open: -1 }); self.toast('Deal deleted', cur.brand, function () { self.setState({ removed: prev }); self.emit('deal.restore', { id: cur.dbId }, 'Could not undo'); }); });")
p.rep("self.write('Could not save', function () {\n        var ep = st.e.pays || {}, u = { dirty: false, pop: null };",
      "self.write('Could not save', function () {\n        var ch = Object.assign({}, st.e), epp = ch.pays || {}, epd = ch.payDates || {}; delete ch.pays; delete ch.payDates;\n        if (ch.postDates) ch.postDates = ch.postDates.filter(function (x) { return x.date; }).map(function (x) { return x.id ? { id: x.id, date: x.date, label: x.label || '' } : { date: x.date, label: x.label || '' }; });\n        Object.keys(epp).forEach(function (j) { var sr = sched[+j] || []; self.emit('payment.setStatus', { dealId: cur.dbId, paymentId: sr[4] !== undefined ? sr[4] : null, index: +j, state: epp[j] }, 'Could not update the payment'); });\n        Object.keys(epd).forEach(function (j) { var sr = sched[+j] || []; self.emit('payment.setDate', { dealId: cur.dbId, paymentId: sr[4] !== undefined ? sr[4] : null, index: +j, date: epd[j] || '' }, 'Could not update the payment'); });\n        self.emit('deal.update', { id: cur.dbId, changes: ch, extras: st.extras.slice(), checklist: st.items.slice() });\n        var ep = st.e.pays || {}, u = { dirty: false, pop: null };")
p.rep("markPaid: function () { self.write('Could not mark it paid', function () { var o = Object.assign({}, self.state.paidIds); o[cur.id] = true;",
      "markPaid: function () { self.write('Could not mark it paid', function () { self.emit('deal.markPaid', { id: cur.dbId, amount: cur.amt }); var o = Object.assign({}, self.state.paidIds); o[cur.id] = true;")
p.save()

# ---------------- Payments
p = Patch(D + '/SPayments.tsx')
p.rep("    if (after) after();\n    var lv = Object.assign({}, this.state.leaving); lv[i] = true;",
      "    if (after) after();\n    var row = ((this.props.data && this.props.data.payments) ? this.props.data : SAMPLE_PAYMENTS).payments[i];\n    this.emit(kind === 'rec' ? 'payment.record' : 'payment.markPaid', { id: row ? row.id : i, brand: brand, amount: amt, date: kind === 'rec' ? this.state.recDate : undefined }, kind === 'rec' ? 'Could not record payment' : 'Could not mark as paid');\n    var lv = Object.assign({}, this.state.leaving); lv[i] = true;")
p.save()

# ---------------- Calendar
p = Patch(D + '/SCalendar.tsx')
p.rep("      self.toast(label + ' added', item.title + ', ' + MS[d2.getMonth()] + ' ' + d2.getDate());",
      "      self.toast(label + ' added', item.title + ', ' + MS[d2.getMonth()] + ' ' + d2.getDate());\n      self.emit('event.create', { date: item.d, kind: item.k, title: item.title, amount: item.amt || 0 }, 'Could not add ' + label.toLowerCase());")
p.rep("toggle: function () { if (!self.guard()) return; self.setState({ events: self.state.events.map(function (x) { return x.id === e.id ? Object.assign({}, x, { done: !x.done }) : x; }) }); } };",
      "toggle: function () { if (!self.guard()) return; self.setState({ events: self.state.events.map(function (x) { return x.id === e.id ? Object.assign({}, x, { done: !x.done }) : x; }) }); self.emit('event.setDone', { id: e.dbId !== undefined ? e.dbId : e.id, done: !e.done }, 'Could not update it'); } };")
p.save()

# ---------------- Ideas
p = Patch(D + '/SIdeas.tsx')
p.rep("    this.toast('Idea saved', desc);", "    this.toast('Idea saved', desc);\n    this.emit('idea.create', { text: tx }, 'Could not save the idea');")
p.rep("setList(list.map(function (y) { return y.id === x.id ? Object.assign({}, y, { starred: !y.starred }) : y; }), { menu: -1 }); },",
      "setList(list.map(function (y) { return y.id === x.id ? Object.assign({}, y, { starred: !y.starred }) : y; }), { menu: -1 }); self.emit('idea.star', { id: x.dbId !== undefined ? x.dbId : x.id, starred: !x.starred }, 'Could not update the idea'); },")
p.rep("var before = list; setList(list.filter(function (y) { return y.id !== x.id; }), { menu: -1 }); self.toast('Idea deleted', '', function () { setList(before); }); } };",
      "var before = list; setList(list.filter(function (y) { return y.id !== x.id; }), { menu: -1 }); self.emit('idea.delete', { id: x.dbId !== undefined ? x.dbId : x.id }, 'Could not delete the idea'); self.toast('Idea deleted', '', function () { setList(before); self.emit('idea.restore', { id: x.dbId !== undefined ? x.dbId : x.id }, 'Could not undo'); }); } };")
p.save()

# ---------------- To-dos
p = Patch(D + '/STodos.tsx')
p.rep("          if (x.done) { setList((self.state[TK] || []).map(function (y) { return y.id === x.id ? Object.assign({}, y, { done: false }) : y; })); return; }\n          if (!self.state.ticking[x.id]) self.tick(x.id, TK);",
      "          if (x.done) { setList((self.state[TK] || []).map(function (y) { return y.id === x.id ? Object.assign({}, y, { done: false }) : y; })); self.emit('todo.setDone', { id: x.dbId !== undefined ? x.dbId : x.id, done: false }, 'Could not update the to-do'); return; }\n          if (!self.state.ticking[x.id]) { self.tick(x.id, TK); self.emit('todo.setDone', { id: x.dbId !== undefined ? x.dbId : x.id, done: true }, 'Could not update the to-do'); }")
p.rep("var before = self.state[TK] || []; setList(before.filter(function (y) { return y.id !== x.id; }), { menu: -1 }); self.toast('To-do deleted', '', function () { setList(before); }); } };",
      "var before = self.state[TK] || []; setList(before.filter(function (y) { return y.id !== x.id; }), { menu: -1 }); self.emit('todo.delete', { id: x.dbId !== undefined ? x.dbId : x.id }, 'Could not delete the to-do'); self.toast('To-do deleted', '', function () { setList(before); self.emit('todo.restore', { id: x.dbId !== undefined ? x.dbId : x.id }, 'Could not undo'); }); } };")
p.rep("      self.toast('To-do added', pr.deal ? 'Linked to ' + pr.deal : 'No deal linked');",
      "      self.toast('To-do added', pr.deal ? 'Linked to ' + pr.deal : 'No deal linked');\n      self.emit('todo.create', { text: pr.text, deal: pr.deal || '', due: st.newDue || '' }, 'Could not add your to-do');")
p.save()

# ---------------- Settings
p = Patch(D + '/SSettings.tsx')
p.rep("self.setState({ profBusy: false, savedName: self.state.name, savedHandle: self.state.handle });",
      "self.setState({ profBusy: false, savedName: self.state.name, savedHandle: self.state.handle }); self.emit('profile.update', { displayName: self.state.name, handle: self.state.handle }, 'Could not save');")
p.rep("self.setState({ prefBusy: false, savedPrefs: Object.assign({}, self.state.prefs) });",
      "self.setState({ prefBusy: false, savedPrefs: Object.assign({}, self.state.prefs) }); self.emit('notifications.update', Object.assign({}, self.state.prefs), 'Could not save');")
p.rep("self.setState({ pwBusy: false, pw1: '', pw2: '', pwTouched: false });",
      "self.emit('password.update', { current: self.state.pw1, next: self.state.pw2 }, 'Could not update your password'); self.setState({ pwBusy: false, pw1: '', pw2: '', pwTouched: false });")
p.rep("self.setState({ discBusy: false, notionS: 'off', notionFor: p.notion || '' });",
      "self.setState({ discBusy: false, notionS: 'off', notionFor: p.notion || '' }); self.emit('notion.disconnect', {}, 'Could not disconnect Notion');")
p.rep("self.setState({ photoBusy: false, photo: url, photoPending: '' });",
      "self.setState({ photoBusy: false, photo: url, photoPending: '' }); self.emit('photo.update', { dataUrl: url }, 'Could not update your photo');")
p.rep("var was = st.photo; self.setState({ photo: '' });", "var was = st.photo; self.setState({ photo: '' }); self.emit('photo.remove', {}, 'Could not remove your photo');")
p.save()

# look changes on every page sync to the profile
for name in ['SOverview', 'SDeals', 'SCalendar', 'SPayments', 'SIdeas', 'STodos', 'SSettings', 'SWelcome']:
    p = Patch(D + '/' + name + '.tsx')
    p.rep("    try { window.localStorage.setItem('talby.look', JSON.stringify(L)); } catch (e) {}",
          "    try { window.localStorage.setItem('talby.look', JSON.stringify(L)); } catch (e) {}\n    this.emit('look.update', L, 'Could not save your look');")
    p.save()

p = Patch(D + '/SSettings.tsx')
p.rep("      self.setState({ dlgBusy: false, dlg: '', confirm: '' }); self.toast('Demo only', 'Nothing was deleted.');",
      "      var kind = self.state.dlg === 'data' ? 'data.deleteAll' : 'account.delete';\n"
      "      self.setState({ dlgBusy: false, dlg: '', confirm: '' });\n"
      "      if (typeof self.props.onAction === 'function') self.emit(kind, {}, 'Could not delete'); else self.toast('Demo only', 'Nothing was deleted.');")
p.rep("function demoBill() { if (self.failOnce('billing'))", "function demoBill() { if (typeof p.onAction === 'function') { self.emit('billing.open', { plan: plan }, 'Could not open billing'); return; } if (self.failOnce('billing'))")
p.save()

# when fresh data arrives after a save, drop the local overlays so rows are not doubled
RESET = {
    'SDeals': "{ added: [], removed: {}, archived: {}, paidIds: {}, invIds: {} }",
    'SPayments': "{ paidNow: {}, leaving: {} }",
}
for name, reset in RESET.items():
    p = Patch(D + '/' + name + '.tsx')
    p.rep("    if (prev.view !== p.view) this.setState({ dv: p.view || 'sample' });\n",
          "    if (prev.view !== p.view) this.setState({ dv: p.view || 'sample' });\n    if (prev.data !== p.data && p.data) this.setState(" + reset + ");\n")
    p.save()
p = Patch(D + '/SOverview.tsx')
p.rep("    if (prev.data !== p.data && p.data && p.data.todos) this.setState({ todos: p.data.todos.map(function (x) { return Object.assign({}, x); }) });",
      "    if (prev.data !== p.data && p.data && p.data.todos) this.setState({ todos: p.data.todos.map(function (x) { return Object.assign({}, x); }), paidNow: {}, resolved: {}, leaving: {} });")
p.save()

# Try again on a failed load asks the app to refetch
for name in ['SOverview', 'SDeals', 'SCalendar', 'SPayments', 'SIdeas', 'STodos', 'SSettings', 'SWelcome']:
    p = Patch(D + '/' + name + '.tsx')
    p.rep("    this.setState({ dv: 'loading' });\n    this._rt = setTimeout(function () { self.setState({ dv: 'sample' }); }, 900);",
          "    this.setState({ dv: 'loading' });\n"
          "    if (typeof this.props.onAction === 'function') {\n"
          "      Promise.resolve().then(function () { return self.props.onAction('data.reload', {}); })\n"
          "        .then(function (ok) { if (ok === false) throw new Error('reload'); if (self.state.dv === 'loading') self.setState({ dv: self.props.view === 'error' || !self.props.view ? 'sample' : self.props.view }); })\n"
          "        .catch(function () { self.setState({ dv: 'error' }); });\n"
          "      return;\n"
          "    }\n"
          "    this._rt = setTimeout(function () { self.setState({ dv: 'sample' }); }, 900);")
    p.save()
