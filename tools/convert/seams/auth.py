"""SAuth: swaps the preview auth calls for the real ones in _auth.ts and sends links through the routes."""
from seam_lib import Patch
import sys
IMP = "import { DCLogic } from './_runtime';"
p = Patch(sys.argv[1] + '/SAuth.tsx')
p.rep(IMP, IMP + "\nimport * as TalbyAuth from './_auth';")
p.rep("  signIn(email, pw) { return Promise.resolve({}); }", "  signIn(email, pw) { return TalbyAuth.auth().signIn(email, pw); }")
p.rep("  signUp(email, pw) { return Promise.resolve({}); }", "  signUp(email, pw) { return TalbyAuth.auth().signUp(email, pw); }")
p.rep("  sendReset(email) { return Promise.resolve({}); }", "  sendReset(email) { return TalbyAuth.auth().sendReset(email); }")
p.rep("  setPassword(pw) { return Promise.resolve({}); }", "  setPassword(pw) { return TalbyAuth.auth().setPassword(pw); }")
p.rep("  verifyCode(email, code) { return Promise.resolve({}); }", "  verifyCode(email, code) { return TalbyAuth.auth().verifyCode(email, code); }")
p.rep("  resend(kind, email) { return Promise.resolve({}); }",
      "  resend(kind, email) { var a = TalbyAuth.auth(); var r = kind === 'reset' ? a.sendReset(email) : kind === 'code' ? a.sendCode(email) : a.resendConfirm(email); return r.then(function (x) { if (x && x.error) throw x; return x; }); }")
p.rep("  sendCode(email) { return Promise.resolve({}); }", "  sendCode(email) { return TalbyAuth.auth().sendCode(email); }")
p.rep("  checkReset() { return Promise.resolve({}); }", "  checkReset() { return TalbyAuth.auth().checkReset(); }")
# After log in, honor ?next. Board names go through setTalbyRoutes.
p.rep("  goTo(board) { try { window.location.href = board; } catch (e) {} }",
      "  goTo(board) { try { var to = $r.H(board); if (board === 'SOverview.dc.html') to = TalbyAuth.nextPath(to); window.location.assign(to); } catch (e) {} }")
p.save()
