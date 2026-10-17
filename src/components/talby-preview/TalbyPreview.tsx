'use client';
/**
 * Renders one converted board by name, exactly like the design canvas did:
 * default props from the board, overrides from ?props={"view":"empty"}.
 * Used by /talby-preview/[board] for side by side checks against the boards.
 */
import * as React from 'react';
import * as Boards from '@/components/talby/_index';
import { setTalbyRoutes, TalbyRoot } from '@/components/talby/_runtime';

setTalbyRoutes((board, rest) => '/talby-preview/' + board + rest);

export default function TalbyPreview({ board, props }: { board: string; props?: Record<string, unknown> }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const Board = (Boards as Record<string, any>)[board];
  if (!Board) return <p style={{ padding: 24, fontFamily: 'system-ui' }}>No board named {board}.</p>;
  if (!mounted) return null;
  const defaults: Record<string, unknown> = {};
  const meta = Board.meta?.props || {};
  for (const k in meta) if (meta[k] && meta[k].default !== undefined) defaults[k] = meta[k].default;
  return (
    <TalbyRoot>
      <Board {...defaults} {...(props || {})} />
    </TalbyRoot>
  );
}
