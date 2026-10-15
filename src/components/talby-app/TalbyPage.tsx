'use client';
/**
 * TalbyPage — renders one converted board on a real route, wrapped in TalbyRoot
 * (the #dc-root the boards' CSS is scoped to). Mirrors TalbyPreview but takes
 * the caller's props: `view`, `plan`, and `data` (real rows mapped in
 * src/lib/talby/to-board.ts), plus the saved `look` from the profile so the
 * board theme matches what the user saved. Mount-gated to avoid hydration
 * mismatch (boards read localStorage). NEVER edits a board's render().
 */
import * as React from 'react';
import * as Boards from '@/components/talby/_index';
import { TalbyRoot } from '@/components/talby/_runtime';

export interface TalbyLook {
  theme?: string;
  mode?: string;
  sidebar?: string;
}

export default function TalbyPage({
  board,
  props,
  look,
}: {
  board: string;
  props?: Record<string, unknown>;
  look?: TalbyLook | null;
}) {
  const [mounted, setMounted] = React.useState(false);

  // Sync the profile's saved look (theme/mode/sidebar) into localStorage so the
  // board reads it, before it ever renders. Merge, don't clobber, existing.
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('talby.look');
      const cur = raw ? JSON.parse(raw) : {};
      const merged = { ...cur, ...(look || {}) };
      if (look) localStorage.setItem('talby.look', JSON.stringify(merged));
    } catch { /* ignore */ }
    setMounted(true);
  }, []);

  const Board = (Boards as Record<string, any>)[board];
  if (!Board) return <div style={{ padding: 24 }}>No board named {board}.</div>;
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
