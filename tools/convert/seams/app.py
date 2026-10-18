"""Get the app: swaps the board's preview hooks for the real ones in _app.ts."""
from seam_lib import Patch
import sys

IMP = "import { DCLogic } from './_runtime';"
STANDALONE = "try { return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true; } catch (e) { return false; } }"
UA_BLOCK = """    try {
      var ua = navigator.userAgent || '';
      if (/Instagram|FBAN|FBAV|TikTok|musical_ly|Bytedance|Snapchat|Pinterest|Line\\//i.test(ua)) return 'inapp';
      if (/iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'iphone';
      if (/Android/.test(ua)) return 'android';
    } catch (e) {}
    return 'desktop';"""

for name, dis in (('SOnboard', 'dismissInstall(where) {}'), ('SOverview', 'dismissInstall(where, forever) {}'), ('SSettings', 'dismissInstall(where, forever) {}')):
    p = Patch(sys.argv[1] + '/' + name + '.tsx')
    p.rep(IMP, IMP + "\nimport * as TalbyApp from './_app';")
    p.rep(UA_BLOCK, "    return TalbyApp.device();")
    p.rep(STANDALONE, "return TalbyApp.isInstalled(); }")
    p.rep("  installApp() { return Promise.resolve(true); }", "  installApp() { return TalbyApp.installApp(); }")
    p.rep("  askAlerts() { return Promise.resolve('granted'); }", "  askAlerts() { return TalbyApp.askAlerts(); }")
    p.rep("  copyLink() { try { navigator.clipboard.writeText('https://www.talby.io/app'); } catch (e) {} return Promise.resolve(true); }", "  copyLink() { return TalbyApp.copyLink(); }")
    p.rep("  " + dis, "  dismissInstall(where, forever) { TalbyApp.dismissInstall(where, forever); }")
    # redraw when the profile counts, the install box or the install state change
    p.rep("  componentDidMount() {\n", "  componentDidMount() {\n    var me = this; this._appOff = TalbyApp.onTalbyAppChange(function () { try { me.forceUpdate(); } catch (e) {} });\n")
    p.rep("  componentWillUnmount() { ", "  componentWillUnmount() { try { if (this._appOff) this._appOff(); } catch (e) {} ")
    if name == 'SOverview':
        # Without an appPrompt prop the banner decides for itself from the profile and the phone.
        p.rep("apKind = p.appPrompt || ''", "apKind = p.appPrompt !== undefined ? (p.appPrompt || '') : TalbyApp.autoPrompt()")
    p.save()
