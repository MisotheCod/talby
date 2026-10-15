// @ts-nocheck
/* eslint-disable */
'use client';
// StIdeasLoading: converted from design-source/boards/StIdeasLoading.dc.html.
// Markup, inline styles and logic are carried over exactly from the board.
// The logic class below is the board's own code, unchanged.
import * as React from 'react';
import * as $r from './_runtime';
import { DCLogic } from './_runtime';
import SIdeas from './SIdeas';

const CSS = "body, #dc-root{margin:0}";

const Component = (() => {
class Component extends DCLogic {
  renderVals() { var p = this.props; return { color: p.color || 'studio', dark: !!p.dark }; }
}
return Component;
})();

function render($s0, host) {
  const { A, T, I, V0, S, HS, H } = $r;
  return (<>
      <div {...S("min-height: 900px; font-family: Geist, ui-sans-serif, system-ui, sans-serif; color: #0A0A0A")}>
        <SIdeas view={"loading"} color={$s0?.color} dark={$s0?.dark} />
      </div>
  </>);
}

export const meta = {"props":{"color":{"editor":"enum","options":["studio","sand","mac","stationery","editorial"],"default":"studio"},"dark":{"editor":"boolean","default":false}},"preview":{"width":1440,"height":900}};
export default $r.defineBoard("StIdeasLoading", Component, render, CSS, meta);
