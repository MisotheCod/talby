from seam_lib import Patch, add_import
import sys
p = Patch(sys.argv[1] + '/SDeals.tsx')
add_import(p, ['SAMPLE_DEALS', 'TalbyDates', 'getTalbyIO'])

p.rep("    var ACC = p.account || SAMPLE_ACCOUNT;\n",
      "    var ACC = p.account || SAMPLE_ACCOUNT;\n"
      "    // Real data comes in as props.data (see _data.ts). Without it the board shows its design sample.\n"
      "    var DATA = (p.data && typeof p.data === 'object') ? p.data : SAMPLE_DEALS, TODAY = DATA.today;\n")

a = p.s.index("    var D = [\n      ['Milan Laser Q4 Campaign','Active'")
b = p.s.index("    var all = st.added.concat(")
p.s = p.s[:a] + p.s[b:]
p.rep("    var all = st.added.concat((isSample ? D : []).map(function (x, i) { return { id: i, brand: x[0], status: x[1], pay: x[2], post: x[3], payBy: x[4], amt: x[5], how: HOW[x[0]] || 'All at once', plats: PLATS[x[0]] || ['TikTok'], type: TYPE[x[0]] || 'Video', rep: REP[x[0]] || '', created: CREATED[i] }; }))",
      "    var all = st.added.concat((isSample ? DATA.deals : []).map(function (x, i) { return { id: i, dbId: x.id, brand: x.brand, status: x.status, pay: x.pay, post: x.post || '', postDates: x.postDates || null, payBy: x.payBy || '', amt: x.amount, how: x.how || 'All at once', plats: x.platforms || [], type: x.type || '', rep: x.rep || '', created: x.created ? TalbyDates.md(x.created) : '', sched: x.payments || null, notes: x.notes || '', repEmail: x.repEmail || '', repPhone: x.repPhone || '', extras: x.extras || [], checklist: x.checklist || [], files: x.files || [], arch0: !!x.archived }; }))")
p.rep("o.archived = !!st.archived[d.id]; return o; });", "o.archived = st.archived[d.id] !== undefined ? !!st.archived[d.id] : !!d.arch0; return o; });")
p.rep("var lateDays = due ? Math.round((new Date(2026, 9, 14) - new Date(due + 'T00:00:00')) / 864e5) : 0;",
      "var lateDays = due ? TalbyDates.diff(due, TODAY) : 0;")
p.rep("""    var sched = cur.brand === 'Gruns'
      ? [['Payment 1 of 2', 500, 'Received Sep 5', 'paid', undefined, '2026-09-05'], ['Payment 2 of 2', 300, 'Received Oct 6', 'paid', undefined, '2026-10-06']]
      :""",
      """    var sched = cur.sched && cur.sched.length
      ? cur.sched.map(function (s) { return [s.label, s.amount, s.state === 'paid' ? (s.date ? 'Received ' + md(s.date) : 'Received') : (s.date ? 'Due ' + md(s.date) + (s.state === 'over' && TalbyDates.diff(s.date, TODAY) > 0 ? ', ' + TalbyDates.diff(s.date, TODAY) + ' days late' : '') : 'No due date yet'), s.state, s.id, s.date || '']; })
      :""")
# payment status per payment, and real file uploads in the deal panel
p.rep("  uploadFile(kind, deal) { this.toast(kind === 'invoice' ? 'Choose an invoice' : 'Choose a file', kind === 'invoice' ? 'PDF or image. It is linked to this payment.' : 'A contract, invoice or other file for this deal.'); }",
      "  uploadFile(kind, deal) {\n"
      "    var self = this, io = getTalbyIO();\n"
      "    if (!io || typeof io.uploadDealFile !== 'function' || !deal || deal.dbId === undefined) { this.toast(kind === 'invoice' ? 'Choose an invoice' : 'Choose a file', kind === 'invoice' ? 'PDF or image. It is linked to this payment.' : 'A contract, invoice or other file for this deal.'); return; }\n"
      "    var inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.pdf,.doc,.docx,.png,.jpg,.jpeg,.csv,application/pdf,image/*';\n"
      "    inp.onchange = function () {\n"
      "      var file = inp.files && inp.files[0]; if (!file) return;\n"
      "      if (file.size > 20 * 1048576) { self.toastErr('This file is over 20 MB', 'Save a smaller copy, then try again.'); return; }\n"
      "      var run = function () { Promise.resolve().then(function () { return io.uploadDealFile(file, { dealId: deal.dbId, kind: kind === 'auto' ? 'auto' : kind }); }).then(function (r) {\n"
      "        var nf = Object.assign({}, self.state.newFiles); nf[deal.id] = (nf[deal.id] || []).concat([{ id: r && r.id, name: (r && r.name) || file.name, kind: (r && r.kind) || (kind === 'auto' ? 'other' : kind), url: (r && r.url) || '', date: (r && r.date) || '' }]);\n"
      "        self.setState({ newFiles: nf }); self.toast(((r && r.kind) || kind) === 'invoice' ? 'Invoice added' : 'File added', file.name);\n"
      "      }, function () { self.toastErr('Could not upload the file', 'Check your connection and try again.', run); }); };\n"
      "      run();\n"
      "    };\n"
      "    inp.click();\n"
      "  }")
# Open the New deal dialog from the URL: start="notion" (back from the Notion connect page) or start="upload"
p.rep("add: props.start === 'new' ? 'new' : ''", "add: props.start === 'new' ? 'new' : props.start === 'notion' ? 'notion' : props.start === 'upload' ? 'upload' : ''")
p.rep("minH: mob ? '100vh' : '980px',", "minH: mob ? '100vh' : '980px', autoNotion: st.add === 'notion' && this.props.start === 'notion',")
p.rep("<SAddDeal open={$s0?.add}", "<SAddDeal autoConnect={$s0?.autoNotion} open={$s0?.add}")
p.rep("isLate: s[3] === 'over' && !!s[5] && new Date(2026, 9, 14) > new Date(s[5] + 'T00:00:00'), lateText: s[3] === 'over' && s[5] ? Math.round((new Date(2026, 9, 14) - new Date(s[5] + 'T00:00:00')) / 864e5) + ' days late' : '',",
      "isLate: s[3] === 'over' && !!s[5] && TalbyDates.diff(s[5], TODAY) > 0, lateText: s[3] === 'over' && s[5] ? TalbyDates.diff(s[5], TODAY) + ' days late' : '',")
p.save()
