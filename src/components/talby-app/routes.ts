'use client';
/**
 * App route map for the boards' internal links (setTalbyRoutes). Board files
 * link to each other by name (e.g. "SPayments.dc.html"); this routes them to
 * the real app paths. Import this from a module that loads before any board.
 */
import { setTalbyRoutes } from '@/components/talby/_runtime';
// Registers the real import endpoints for the New deal dialog (upload, CSV, Notion).
import '@/lib/talby/import-io';

const ROUTES: Record<string, string> = {
  SOverview: '/app',
  SDeals: '/app/deals',
  SCalendar: '/app/calendar',
  SPayments: '/app/payments',
  SIncome: '/app/payments?income=1',
  SIdeas: '/app/ideas',
  STodos: '/app/notes',
  SSettings: '/app/settings',
  SOnboard: '/onboarding',
  SWelcome: '/app',
  SHome: '/',
};

export function initTalbyRoutes() {
  setTalbyRoutes((board, rest) => (ROUTES[board] ?? '/app') + rest);
}
