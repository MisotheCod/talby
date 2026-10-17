// @ts-nocheck
/* eslint-disable */
'use client';
// TbTodos: converted from design-source/boards/TbTodos.dc.html.
// Markup, inline styles and logic are carried over exactly from the board.
// The logic class below is the board's own code, unchanged.
import * as React from 'react';
import * as $r from './_runtime';
import { DCLogic } from './_runtime';
import STodos from './STodos';

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
      <div {...S("min-height: 1180px; font-family: Geist, ui-sans-serif, system-ui, sans-serif; color: #0A0A0A")}>
        <STodos color={$s0?.color} dark={$s0?.dark} />
      </div>
  </>);
}

export const meta = {"props":{"color":{"editor":"enum","options":["studio","sand","mac","stationery","editorial"],"default":"studio"},"dark":{"editor":"boolean","default":false}},"preview":{"width":820,"height":1180}};
export default $r.defineBoard("TbTodos", Component, render, CSS, meta);
