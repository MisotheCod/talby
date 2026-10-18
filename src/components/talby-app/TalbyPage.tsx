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
import { resolveLook, parseStored } from "@/lib/talby/look";
import { registerTalbyApp } from "@/lib/talby/app-io";
import { createClient } from "@/lib/supabase/client";
import * as Boards from '@/components/talby/_index';
import { TalbyRoot } from '@/components/talby/_runtime';
import { initTalbyRoutes } from '@/components/talby-app/routes';

// Real app routes only (preview uses its own setTalbyRoutes). Boards link to
// each other by name; route them to the live app paths before any render.
initTalbyRoutes();

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
      // Resolve against the profile and write back a VALIDATED look, so an old or
      // unknown talby.look left in the browser is corrected to Studio rather than
      // carried forward.
      const resolved = resolveLook(parseStored(localStorage.getItem('talby.look')), look ?? null);
      localStorage.setItem('talby.look', JSON.stringify(resolved));
    } catch { /* ignore */ }
    setMounted(true);
  }, []);

  // Get the app: once the profile is known, hand the install/alerts IO (dismissal
  // counts, VAPID key, persistence) to the boards. The Overview banner stays
  // hidden until this runs.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from('profiles')
          .select('install_prompt_dismissals, install_prompt_last_dismissed')
          .eq('id', user.id)
          .maybeSingle();
        if (!cancelled && data) registerTalbyApp(data as any);
      } catch { /* offline / no profile: banner simply stays hidden */ }
    })();
    return () => { cancelled = true; };
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
