// @ts-nocheck
/* eslint-disable */
'use client';
// PhAuCode: converted from design-source/boards/PhAuCode.dc.html.
// Markup, inline styles and logic are carried over exactly from the board.
// The logic class below is the board's own code, unchanged.
import * as React from 'react';
import * as $r from './_runtime';
import { DCLogic } from './_runtime';
import SAuth from './SAuth';

const CSS = "body, #dc-root{margin:0}";

const Component = (() => {
class Component extends DCLogic {
  renderVals() { return { theme: this.props.theme || 'light' }; }
}
return Component;
})();

function render($s0, host) {
  const { A, T, I, V0, S, HS, H } = $r;
  return (<>
      <div {...S("min-height: 844px")}>
        <SAuth mode={"code"} vw={"390"} theme={$s0?.theme} />
      </div>
  </>);
}

export const meta = {"props":{"theme":{"editor":"enum","options":["auto","light","dark"],"default":"light"}},"preview":{"width":390,"height":844}};
export default $r.defineBoard("PhAuCode", Component, render, CSS, meta);
