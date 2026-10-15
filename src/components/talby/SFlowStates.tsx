// @ts-nocheck
/* eslint-disable */
'use client';
// SFlowStates: converted from design-source/boards/SFlowStates.dc.html.
// Markup, inline styles and logic are carried over exactly from the board.
// The logic class below is the board's own code, unchanged.
import * as React from 'react';
import * as $r from './_runtime';
import { DCLogic } from './_runtime';
import SAddDeal from './SAddDeal';

const CSS = "body, #dc-root{margin:0;font-synthesis:none}";

const Component = (() => {
class Component extends DCLogic {
  constructor(props) {
    super(props);
    var L = null; try { L = JSON.parse(window.localStorage.getItem('talby.look') || 'null'); } catch (e) {}
    L = L || {};
    var IDS = ['studio', 'sand', 'mac', 'stationery', 'editorial'], MODES = ['light', 'dark', 'system'];
    var th = (IDS.indexOf(L.theme) >= 0 && L.theme) || (L.theme === 'midnight' && IDS.indexOf(L.prev) >= 0 && L.prev) || (IDS.indexOf(props.color) >= 0 && props.color) || 'studio';
    var md = L.theme === 'midnight' ? 'dark' : ((MODES.indexOf(L.mode) >= 0 && L.mode) || (L.auto ? 'system' : (props.dark ? 'dark' : 'light')));
    this.state = { look: { theme: th, mode: md } };
  }
  componentDidMount() {
    var self = this;
    this._sg = function (ev) { if (ev && ev.key === 'talby.look') { try { var L = JSON.parse(ev.newValue || 'null'); if (L) self.setState({ look: Object.assign({}, self.state.look, L) }); } catch (x) {} } };
    try { window.addEventListener('storage', this._sg); } catch (e) {}
  }
  componentWillUnmount() { try { window.removeEventListener('storage', this._sg); } catch (e) {} }
  componentDidUpdate(prev) {
    var p = this.props, L = this.state.look, ch = null;
    if (prev.dark !== p.dark) ch = Object.assign({}, ch || L, { mode: p.dark ? 'dark' : 'light' });
    if (prev.color !== p.color && p.color) ch = Object.assign({}, ch || L, { theme: p.color });
    if (ch) this.setState({ look: ch });
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
    var L = this.state.look; var sysDark = false; try { sysDark = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches); } catch (e) {}
    var dark = L.mode === 'dark' || (L.mode === 'system' && sysDark);
    var t = talby(L.theme, dark);
    return {
      t: t, look: L, dark: dark, titleFam: t.titleFam,
      sections: [
        { eyebrow: 'Upload a contract', title: 'Picking and reading a contract', sub: 'A file that is too big or the wrong type, no internet, a contract Talby cannot read, and one where it finds only a little.', frames: [
          { n: '1', title: 'File over 20 MB', sub: 'Says the limit and how to get under it', open: 'upload', step: 'pickBig', locked: '' },
          { n: '2', title: 'Wrong file type', sub: 'Names the file type and what works', open: 'upload', step: 'pickType', locked: '' },
          { n: '3', title: 'Offline', sub: 'Nothing is sent until the connection is back', open: 'upload', step: 'pickOffline', locked: '' },
          { n: '4', title: 'Talby could not read it', sub: 'Try again, or fill it in by hand', open: 'upload', step: 'readFail', locked: '' },
          { n: '5', title: 'Only a few details found', sub: 'Review still works, with a gentle note', open: 'upload', step: 'reviewFew', locked: '' }
        ] },
        { eyebrow: 'CSV or Excel', title: 'Bringing in a list of deals', sub: 'An empty file, no column for Brand, rows with problems, and an import where some deals did not save.', frames: [
          { n: '1', title: 'Empty or unreadable file', sub: 'Says what to check, then upload again', open: 'upload', step: 'csvEmpty', locked: '' },
          { n: '2', title: 'No column set to Brand', sub: 'Next waits, with the reason right above', open: 'upload', step: 'csvNoBrand', locked: '' },
          { n: '3', title: 'Some rows have problems', sub: 'Each one says what happens to it', open: 'upload', step: 'csvRowIssues', locked: '' },
          { n: '4', title: 'Import partly failed', sub: '12 of 15 came in, try the rest again', open: 'upload', step: 'csvPartial', locked: '' }
        ] },
        { eyebrow: 'Import from Notion', title: 'Connecting and importing from Notion', sub: 'From a connection that is not ready yet, to an import where some deals did not save.', frames: [
          { n: '1', title: 'Notion is not set up yet', sub: 'Our side, with a CSV way around it', open: 'notion', step: 'notionSetup', locked: '' },
          { n: '2', title: 'Connect canceled or denied', sub: 'Nothing was shared, connect again', open: 'notion', step: 'connectDenied', locked: '' },
          { n: '3', title: 'Connection lost', sub: 'Reconnect and pick up where you left off', open: 'notion', step: 'notionLost', locked: '' },
          { n: '4', title: 'No databases shared', sub: 'How to share one in Notion', open: 'notion', step: 'dbNone', locked: '' },
          { n: '5', title: 'Database is empty', sub: 'Pick another, or add deals first', open: 'notion', step: 'dbEmpty', locked: '' },
          { n: '6', title: 'Could not load the database', sub: 'Try again, or pick another', open: 'notion', step: 'fetchFail', locked: '' },
          { n: '7', title: 'Import partly failed', sub: '4 of 6 came in, try the rest again', open: 'notion', step: 'importPartial', locked: '' }
        ] },
        { eyebrow: 'New deal and a locked account', title: 'Saving a deal, and when adding is locked', sub: 'Inline field errors, a save that fails, and the panel shown in place of any Add deal flow once the trial ends or the plan is canceled.', frames: [
          { n: '1', title: 'Missing or wrong fields', sub: 'Shown next to each field after Create', open: 'new', step: 'formInvalid', locked: '' },
          { n: '2', title: 'Could not save', sub: 'The form stays filled, try again', open: 'new', step: 'saveFail', locked: '' },
          { n: '3', title: 'Free trial ended', sub: 'Upgrade, and everything stays safe', open: 'new', step: '', locked: 'readonly' },
          { n: '4', title: 'Plan canceled', sub: 'Same panel for any Add deal entry', open: 'upload', step: '', locked: 'canceled' }
        ] }
      ]
    };
  }
}
return Component;
})();

function render($s0, host) {
  const { A, T, I, V0, S, HS, H } = $r;
  return (<>
      <div {...S(`box-sizing: border-box; min-height: 4468px; padding: 48px 56px 64px; background: ${I($s0?.t?.page)}; font-family: ${I($s0?.t?.bodyFam)}; font-size: 14px; line-height: 1.43; color: ${I($s0?.t?.fg)}; -webkit-font-smoothing: antialiased`)}>
        <div {...S("display: flex; flex-direction: column; gap: 6px; margin-bottom: 44px; max-width: 980px")}>
          <span {...S(`font-size: 13px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: ${I($s0?.t?.mutedFg)}`)}>
            {"Add deal, error states"}
          </span>
          <h1 {...S(`margin: 0; font-family: ${I($s0?.titleFam)}; font-size: 32px; font-weight: 600; letter-spacing: -0.6px; line-height: 1.15`)}>
            {"When something goes wrong"}
          </h1>
          <p {...S(`margin: 0; font-size: 16px; color: ${I($s0?.t?.mutedFg)}`)}>
            {"Every error in the Add deal dialog, plus the locked panel. Each one says what happened and what to do next, and nothing the user added is ever lost."}
          </p>
        </div>
        <div {...S("display: flex; flex-direction: column; gap: 72px")}>
          {A($s0?.sections).map((it, i) => {
            const $s1 = { ...$s0, "sec": it, $index: i };
            return (<React.Fragment key={i}>
              <section {...S("display: flex; flex-direction: column; gap: 24px")}>
                <div {...S(`display: flex; flex-direction: column; gap: 4px; padding-bottom: 18px; border-bottom: 1px solid ${I($s1?.t?.border)}`)}>
                  <span {...S(`font-size: 12px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: ${I($s1?.t?.mutedFg)}`)}>
                    {T($s1?.sec?.eyebrow)}
                  </span>
                  <h2 {...S(`margin: 0; font-family: ${I($s1?.titleFam)}; font-size: 22px; font-weight: 600; letter-spacing: -0.3px; line-height: 1.25`)}>
                    {T($s1?.sec?.title)}
                  </h2>
                  <p {...S(`margin: 0; color: ${I($s1?.t?.mutedFg)}`)}>
                    {T($s1?.sec?.sub)}
                  </p>
                </div>
                <div {...S("display: flex; gap: 40px; align-items: flex-start")}>
                  {A($s1?.sec?.frames).map((it, i) => {
                    const $s2 = { ...$s1, "fr": it, $index: i };
                    return (<React.Fragment key={i}>
                      <div {...S("flex: 0 0 720px; width: 720px; display: flex; flex-direction: column; gap: 16px")}>
                        <div {...S("display: flex; align-items: center; gap: 12px; min-height: 44px")}>
                          <span {...S(`width: 30px; height: 30px; flex: 0 0 30px; border-radius: 15px; background: ${I($s2?.t?.primary)}; color: ${I($s2?.t?.primaryFg)}; display: inline-flex; align-items: center; justify-content: center; font-weight: 600`)}>
                            {T($s2?.fr?.n)}
                          </span>
                          <span {...S("display: flex; flex-direction: column; gap: 1px; min-width: 0")}>
                            <span {...S("font-size: 16px; font-weight: 600; white-space: nowrap")}>
                              {T($s2?.fr?.title)}
                            </span>
                            <span {...S(`color: ${I($s2?.t?.mutedFg)}; white-space: nowrap`)}>
                              {T($s2?.fr?.sub)}
                            </span>
                          </span>
                        </div>
                        <div {...S(`height: 820px; border-radius: 20px; overflow: hidden; box-shadow: 0 0 0 1px ${I($s2?.t?.border)}`)}>
                          <SAddDeal frame={true} open={$s2?.fr?.open} step={$s2?.fr?.step} locked={$s2?.fr?.locked} color={$s2?.t?.id} dark={$s2?.dark} />
                        </div>
                      </div>
                    </React.Fragment>);
                  })}
                </div>
              </section>
            </React.Fragment>);
          })}
        </div>
      </div>
  </>);
}

export const meta = {"props":{"color":{"editor":"enum","options":["studio","sand","mac","stationery","editorial"],"default":"studio"},"dark":{"editor":"boolean","default":false}},"preview":{"width":5392,"height":4468}};
export default $r.defineBoard("SFlowStates", Component, render, CSS, meta);
