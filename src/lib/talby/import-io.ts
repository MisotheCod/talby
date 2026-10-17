'use client';
// Connects the New deal dialog (SAddDeal) to the real import endpoints.
// Import this file once from a client module that loads before any board,
// next to setTalbyRoutes:  import '@/lib/talby/import-io';
// The types are in src/components/talby/_data.ts (TalbyImportIO).
import { setTalbyIO, type TalbyImportIO } from '@/components/talby/_data';

/** Your existing route that starts the Notion OAuth window. Change it if yours differs. */
const NOTION_CONNECT_URL = '/api/notion/connect';

async function call(url: string, init?: RequestInit) {
  let res: Response;
  try { res = await fetch(url, { credentials: 'same-origin', ...init }); } catch { throw { code: 'offline' }; }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw { code: (body && body.code) || 'failed' };
  return body;
}
const post = (url: string, body: unknown) =>
  call(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

/** Opens the Notion window and resolves when it closes. */
function notionWindow(): Promise<void> {
  return new Promise((resolve) => {
    const w = window.open(NOTION_CONNECT_URL, 'talby-notion', 'width=560,height=720');
    if (!w) { window.location.href = NOTION_CONNECT_URL; return; }
    const t = setInterval(() => { if (w.closed) { clearInterval(t); resolve(); } }, 400);
  });
}

const io: TalbyImportIO = {
  readContract(file) {
    // If your 20 MB upload goes straight to storage with a signed URL, do that here first,
    // then call the route with the stored path instead of the file.
    const fd = new FormData();
    fd.append('file', file);
    return call('/api/upload/contract', { method: 'POST', body: fd });
  },
  readCsv(file) {
    const fd = new FormData();
    fd.append('file', file);
    return call('/api/import/csv', { method: 'POST', body: fd });
  },
  importCsv(req) {
    return post('/api/import/csv', req);
  },
  async notionConnect({ switchWorkspace }) {
    // GET /api/notion/status returns { connected, workspace }.
    let s = switchWorkspace ? { connected: false, workspace: '' } : await call('/api/notion/status');
    if (!s.connected) {
      await notionWindow();
      s = await call('/api/notion/status');
      if (!s.connected) throw { code: 'notion_denied' };
    }
    return { workspace: s.workspace || '' };
  },
  notionDatabases() {
    return call('/api/notion/databases');
  },
  notionRows(databaseId) {
    return call('/api/notion/rows?databaseId=' + encodeURIComponent(databaseId));
  },
  importNotion(req) {
    return post('/api/notion/import', req);
  },
  uploadDealFile(file, { dealId, kind }) {
    // Store the file, add a deal_files row, return { id, name, kind, url, date }.
    const fd = new FormData();
    fd.append('file', file);
    fd.append('kind', kind);
    return call('/api/deals/' + encodeURIComponent(String(dealId)) + '/files', { method: 'POST', body: fd });
  },
};

setTalbyIO(io);
export default io;
