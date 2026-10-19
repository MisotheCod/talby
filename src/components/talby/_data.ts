/**
 * Talby board data.
 *
 * Every page board takes an optional `data` prop. When it is missing the board
 * shows its design sample (the SAMPLE_* objects below), which is what the
 * parity tool checks. When it is present the board shows your data instead.
 *
 * Your job per page: fetch the rows, map them into the type below, pass it as
 * `data`. Pass view="sample" with real data (it means "show data"), view="empty"
 * when the account has no rows, view="loading" while fetching, view="error" when
 * the fetch failed.
 *
 * Dates are ISO strings "YYYY-MM-DD" in the user's own time zone. Amounts are
 * whole dollars (numbers). The boards do all the formatting ($4,000, Oct 19,
 * "In 5 days", "16 days late") themselves.
 */

/* ------------------------------------------------------------------ shared */

export type ISODate = string; // "2026-10-14"

/** Small date helpers the boards use. Exported so mappers can use the same math. */
export const TalbyDates = {
  MS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  DAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  /** ISO date to a UTC day number, so math never shifts with time zones. */
  num(iso: ISODate): number {
    return Math.round(Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) / 86400000);
  },
  iso(n: number): ISODate {
    return new Date(n * 86400000).toISOString().slice(0, 10);
  },
  /** whole days from a to b (b minus a) */
  diff(a: ISODate, b: ISODate): number {
    return TalbyDates.num(b) - TalbyDates.num(a);
  },
  weekday(iso: ISODate): number {
    return new Date(TalbyDates.num(iso) * 86400000).getUTCDay();
  },
  /** "Oct 19" */
  md(iso: ISODate): string {
    return iso ? TalbyDates.MS[+iso.slice(5, 7) - 1] + ' ' + +iso.slice(8, 10) : '';
  },
  /** today in the user's time zone, as ISO */
  today(timeZone?: string): ISODate {
    const d = new Date();
    try {
      return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
    } catch {
      return d.toISOString().slice(0, 10);
    }
  },
};

/* ------------------------------------------------------------------ Overview */

/** Payment state of a deal on the Overview list. */
export type OverviewDealStatus = 'over' | 'inv' | 'not' | 'paid' | 'neg';

export type OverviewData = {
  /** today in the user's time zone. Drives the greeting date, the week strip and "In 5 days". */
  today: ISODate;
  /**
   * Every deal this year, newest work first, as [brand, status, date, amount].
   * date: the pay by date for over, inv and not; the paid date for paid; "" when there is none.
   * status: over = overdue, inv = invoiced, not = not invoiced, paid, neg = still negotiating.
   */
  deals: [string, OverviewDealStatus, ISODate | '', number][];
  /** overdue payments, oldest first: [brand, amount, due date]. Days late are worked out from today. */
  overdue: [string, number, ISODate][];
  /** posted deals that still need a pay by date (first one shows as its own row) */
  needsPayBy: { brand: string; liveOn: ISODate }[];
  /** deals with no pay by date beyond the ones above: count and total amount */
  noPayBy: { count: number; amount: number };
  /** things on the calendar this week (Sunday to Saturday around today) */
  week: { date: ISODate; kind: 'late' | 'paid' | 'posted' | 'post'; title: string; brand?: string; amount?: number }[];
  /** payments due in the next 60 days, soonest first: [brand, due date, amount] */
  upcoming: [string, ISODate, number][];
  /** "Booked this year" tile */
  booked: { amount: number; deals: number };
  /** "Received" tile: paid so far this year */
  received: { amount: number; count: number };
  /** "Still owed" tile: everything expected and not yet paid, including late */
  owed: { amount: number; count: number };
  /** open to-dos shown on the Overview */
  todos: { id: number | string; text: string; deal: string; done: boolean }[];
};

export const SAMPLE_OVERVIEW: OverviewData = {
  today: '2026-10-14',
  deals: [
    ['Haleon Centrum', 'over', '2026-09-28', 10550], ['Golden Corral', 'over', '2026-10-05', 10000], ['Tums', 'over', '2026-10-11', 8500], ['Nioxin', 'inv', '2026-10-19', 1200],
    ['Sprouts', 'inv', '2026-11-05', 4000], ['Dulcolax', 'inv', '2026-11-09', 8500], ['Liquid I.V. Q3 Campaign', 'inv', '2026-11-30', 6500], ['CeraVe', 'not', '', 8000],
    ['Dramamine', 'not', '', 10000], ['Biotene', 'not', '', 12050], ['Liquid I.V. Q4 Campaign', 'not', '', 8500], ['Milan Laser Q4 Campaign', 'not', '', 1000],
    ['Planet Fitness', 'paid', '2026-08-14', 9000], ['Panera', 'paid', '2026-09-26', 8000], ['Oikos', 'paid', '2026-07-06', 5350], ['Smoothie King', 'paid', '', 5000], ['Liquid I.V. Q2 Campaign', 'paid', '2026-08-16', 4500],
    ['Breyers', 'paid', '2026-05-30', 4000], ['Clio', 'paid', '2026-04-23', 3000], ['Milan Laser Atlanta', 'paid', '2026-08-08', 3000], ['Hidden Valley Ranch', 'paid', '2026-09-18', 1000], ['Tula', 'paid', '2026-05-16', 1000],
    ['Personal Care GLP-1 Session', 'paid', '2026-05-15', 1000], ['Gruns', 'paid', '2026-10-06', 800], ['Replenza', 'paid', '2026-08-21', 500], ['Milan Laser Atlanta', 'neg', '', 500],
  ],
  overdue: [['Haleon Centrum', 10550, '2026-09-28'], ['Golden Corral', 10000, '2026-10-05'], ['Tums', 8500, '2026-10-11']],
  needsPayBy: [{ brand: 'Dramamine', liveOn: '2026-10-13' }],
  noPayBy: { count: 4, amount: 29550 },
  week: [
    { date: '2026-10-11', kind: 'late', title: 'Tums payment', brand: 'Tums', amount: 8500 },
    { date: '2026-10-13', kind: 'posted', title: 'Dramamine Video 1' },
    { date: '2026-10-15', kind: 'post', title: 'CeraVe, tomorrow' },
  ],
  upcoming: [['Nioxin', '2026-10-19', 1200], ['Sprouts', '2026-11-05', 4000], ['Dulcolax', '2026-11-09', 8500], ['Liquid I.V. Q3 Campaign', '2026-11-30', 6500]],
  booked: { amount: 134950, deals: 25 },
  received: { amount: 46150, count: 14 },
  owed: { amount: 88800, count: 12 },
  todos: [{ id: 1, text: 'Complete the vendor form and send over your W9', deal: 'Dramamine', done: false }],
};

/* ------------------------------------------------------------------ account (every page) */

export type NotificationKind = 'late' | 'post' | 'due' | 'paid' | 'todo';

/**
 * Pass this as the `account` prop to every page board. It fills the sidebar,
 * the top bar bell, the plan banners and the assistant name.
 */
export type AccountData = {
  /** first name, used in greetings and the assistant */
  name: string;
  /** name shown at the bottom of the sidebar */
  displayName: string;
  /** handle without the @ */
  handle: string;
  /** shown on Settings, Account. Mask it if you like (chanelica•••@gmail.com). */
  email: string;
  /** profile photo URL, or leave out for initials */
  photoUrl?: string;
  /** deals created this calendar year, before the new one ("That makes 27 deals this year.") */
  dealsThisYear: number;
  /** sidebar badges. late = number of overdue payments. Use 0 for none. */
  counts: { deals: number; late: number; ideas: number; todos: number };
  /** plan="trial": when the trial ends, days left, and how much of it is used (0 to 100) */
  trial: { endsOn: ISODate; daysLeft: number; usedPct: number };
  /** plan="pastdue": the date the card must be updated by */
  pastDueBy: ISODate;
  /**
   * Bell list, newest first. group is the heading it sits under.
   * href is the board it opens (for example "SPayments.dc.html"), which setTalbyRoutes turns into a real route.
   * An empty list means no dot on the bell.
   */
  notifications: { id: number | string; group: 'Today' | 'Yesterday' | 'Earlier'; kind: NotificationKind; title: string; body: string; time: string; href: string; read: boolean }[];
  /** what Cmd K searches. Optional: leave it out and search shows the design sample. */
  search?: SearchData;
};

/**
 * Cmd K search index. Subs are the grey second lines, written out as you want them shown.
 * answers: the short answer card for questions like "what is late". null hides that answer.
 */
export type SearchData = {
  deals: [brand: string, amount: number, pay: PayState | 'neg', sub: string][];
  payments: [brand: string, amount: number, state: PayState, sub: string][];
  calendar: [label: string, sub: string, kind: 'post' | 'over' | 'pay' | 'del'][];
  todos: [text: string, sub: string][];
  ideas: [text: string, sub: string][];
  /** "Needs attention" list shown before you type (up to 3) */
  attention: { label: string; sub: string; amount?: number; kind: 'late' | 'post'; href: string }[];
  answers: { late: { title: string; sub: string } | null; week: { title: string; sub: string } | null; owed: { title: string; sub: string } | null; paid: { title: string; sub: string } | null };
};

export const SAMPLE_ACCOUNT: AccountData = {
  name: 'Chanelica',
  displayName: 'Chanelica.R',
  handle: 'chanelica.r',
  email: 'chanelica•••@gmail.com',
  dealsThisYear: 26,
  counts: { deals: 26, late: 3, ideas: 1, todos: 1 },
  trial: { endsOn: '2026-10-23', daysLeft: 9, usedPct: 36 },
  pastDueBy: '2026-10-21',
  notifications: [
    { id: 1, group: 'Today', kind: 'late', title: 'Tums payment is 3 days late', body: '$8,500 was due Oct 11. Draft a reminder to send.', time: '9:02 AM', href: 'SPayments.dc.html', read: false },
    { id: 2, group: 'Today', kind: 'post', title: 'CeraVe posts tomorrow', body: 'Your video goes live Thursday, Oct 15.', time: '8:30 AM', href: 'SCalendar.dc.html', read: false },
    { id: 3, group: 'Today', kind: 'due', title: 'Nioxin pays in 5 days', body: '$1,200 is due Monday, Oct 19.', time: '8:30 AM', href: 'SPayments.dc.html', read: false },
    { id: 4, group: 'Yesterday', kind: 'post', title: 'Dramamine Video 1 is live', body: 'Add a pay by date so Talby can remind you.', time: '4:15 PM', href: 'SDeal.dc.html', read: false },
    { id: 5, group: 'Yesterday', kind: 'todo', title: 'New to-do for Dramamine', body: 'Send the vendor form and your W9.', time: '11:40 AM', href: 'STodos.dc.html', read: false },
    { id: 6, group: 'Earlier', kind: 'late', title: 'Golden Corral payment is late', body: '$10,000 was due Oct 5.', time: 'Oct 6', href: 'SPayments.dc.html', read: true },
    { id: 7, group: 'Earlier', kind: 'paid', title: 'Gruns paid you $300', body: 'Payment 2 of 2. This deal is paid in full.', time: 'Oct 6', href: 'SPayments.dc.html', read: true },
    { id: 8, group: 'Earlier', kind: 'late', title: 'Haleon Centrum payment is late', body: '$10,550 was due Sep 28.', time: 'Sep 29', href: 'SPayments.dc.html', read: true },
  ],
};

export const SAMPLE_SEARCH: SearchData = {
  deals: [
    ['Haleon Centrum', 10550, 'over', 'Overdue, 16 days late'], ['Golden Corral', 10000, 'over', 'Overdue, 9 days late'], ['Tums', 8500, 'over', 'Overdue, 3 days late'],
    ['Biotene', 12050, 'not', 'Not invoiced, no pay by date'], ['Dramamine', 10000, 'not', 'Posted Oct 13, not invoiced'], ['CeraVe', 8000, 'not', 'Posts tomorrow, Oct 15'],
    ['Liquid I.V. Q4 Campaign', 8500, 'not', 'Not invoiced'], ['Dulcolax', 8500, 'inv', 'Invoiced, due Nov 9'], ['Liquid I.V. Q3 Campaign', 6500, 'inv', 'Invoiced, due Nov 30'],
    ['Sprouts', 4000, 'inv', 'Invoiced, due Nov 5'], ['Nioxin', 1200, 'inv', 'Invoiced, due Oct 19'], ['Milan Laser Q4 Campaign', 1000, 'not', 'Not invoiced'],
    ['Planet Fitness', 9000, 'paid', 'Paid Aug 14'], ['Panera', 8000, 'paid', 'Paid Sep 26'], ['Oikos', 5350, 'paid', 'Paid Jul 6'], ['Smoothie King', 5000, 'paid', 'Paid'],
    ['Liquid I.V. Q2 Campaign', 4500, 'paid', 'Paid Aug 16'], ['Breyers', 4000, 'paid', 'Paid May 30'], ['Clio', 3000, 'paid', 'Paid Apr 23'], ['Milan Laser Atlanta', 3000, 'paid', 'Paid Aug 8'],
    ['Hidden Valley Ranch', 1000, 'paid', 'Paid Sep 18'], ['Tula', 1000, 'paid', 'Paid May 16'], ['Personal Care GLP-1 Session', 1000, 'paid', 'Paid May 15'], ['Gruns', 800, 'paid', 'Paid in full Oct 6'],
    ['Replenza', 500, 'paid', 'Paid Aug 21'], ['Milan Laser Atlanta', 500, 'neg', 'Negotiating'],
  ],
  payments: [['Haleon Centrum', 10550, 'over', 'Due Sep 28'], ['Golden Corral', 10000, 'over', 'Due Oct 5'], ['Tums', 8500, 'over', 'Due Oct 11'], ['Nioxin', 1200, 'inv', 'Due Oct 19'], ['Sprouts', 4000, 'inv', 'Due Nov 5'], ['Dulcolax', 8500, 'inv', 'Due Nov 9'], ['Liquid I.V. Q3 Campaign', 6500, 'inv', 'Due Nov 30'], ['Gruns', 300, 'paid', 'Received Oct 6'], ['Panera', 8000, 'paid', 'Received Sep 26']],
  calendar: [['CeraVe post', 'Thursday, Oct 15', 'post'], ['Dramamine Video 1 post', 'Tuesday, Oct 13, done', 'post'], ['Tums payment due', 'Sunday, Oct 11, late', 'over'], ['Nioxin payment due', 'Monday, Oct 19', 'pay'], ['Submit video for CeraVe', 'Oct 7, done', 'del']],
  todos: [['Send the vendor form and your W9', 'Dramamine, no due date']],
  ideas: [['Before and after video: this is for the girls that struggled with XYZ', 'Saved Sep 23']],
  attention: [
    { label: 'Haleon Centrum payment', sub: '16 days late', amount: 10550, kind: 'late', href: 'SPayments.dc.html' },
    { label: 'Golden Corral payment', sub: '9 days late', amount: 10000, kind: 'late', href: 'SPayments.dc.html' },
    { label: 'CeraVe posts tomorrow', sub: 'Thursday, Oct 15', kind: 'post', href: 'SCalendar.dc.html' },
  ],
  answers: {
    late: { title: '3 payments are late, $29,050', sub: 'Haleon Centrum, Golden Corral and Tums' },
    week: { title: 'CeraVe posts tomorrow', sub: 'Then Nioxin pays $1,200 on Monday, Oct 19' },
    owed: { title: '$88,800 still owed to you', sub: '12 payments, $29,050 of it is late' },
    paid: { title: '$46,150 received this year', sub: '14 payments. August was your best month at $17,000' },
  },
};

/* ------------------------------------------------------------------ Deals */

export type PayState = 'over' | 'inv' | 'not' | 'paid';

export type DealRow = {
  /** your database id. The board never shows it; it is handed back to you in onAction payloads. */
  id: string | number;
  brand: string;
  status: 'Active' | 'Negotiating';
  /** payment state: over = overdue, inv = invoiced, not = not invoiced, paid */
  pay: PayState;
  /** first post date, or "" */
  post: ISODate | '';
  postDates?: { id?: string; date: ISODate; label?: string }[];
  /** pay by date, or the date it was paid when pay is "paid", or "" */
  payBy: ISODate | '';
  amount: number;
  /** "All at once", "Split", "In parts" */
  how: string;
  /** "TikTok", "Instagram", "YouTube", "Facebook" and so on */
  platforms: string[];
  /** "Video", "Reel", "Story", "Video, Reel" */
  type: string;
  /** brand contact name, or "" */
  rep: string;
  /** date the deal was added */
  created: ISODate;
  /** optional payment schedule for the deal panel. Leave out for one full payment. */
  payments?: { /** payment row id, handed back in payment.setStatus */ id?: string | number; label: string; amount: number; date: ISODate | ''; state: PayState }[];
  archived?: boolean;
  /** deal panel fields. All optional; the panel shows them empty when left out. */
  notes?: string;
  repEmail?: string;
  repPhone?: string;
  /** bonus and commission lines, value as the user typed it ("$1,000", "10%") */
  extras?: { type: 'Bonus' | 'Commission'; value: string }[];
  checklist?: { text: string; done: boolean }[];
  /** files on the deal (contract from the New deal dialog, invoices, others). url opens the file (a signed URL is fine). */
  files?: { id: string | number; name: string; kind: 'contract' | 'invoice' | 'other'; url: string; date: ISODate | '' }[];
};

export type DealsData = {
  today: ISODate;
  deals: DealRow[];
};

const SD = (brand: string, status: 'Active' | 'Negotiating', pay: PayState, post: string, payBy: string, amount: number, created: string, extra: Partial<DealRow> = {}): DealRow =>
  ({ id: brand + ':' + created, brand, status, pay, post, payBy, amount, how: 'All at once', platforms: ['TikTok'], type: 'Video', rep: '', created, ...extra });

export const SAMPLE_DEALS: DealsData = {
  today: '2026-10-14',
  deals: [
    SD('Milan Laser Q4 Campaign', 'Active', 'not', '', '', 1000, '2026-09-30'),
    SD('CeraVe', 'Active', 'not', '2026-10-15', '', 8000, '2026-09-02', { platforms: ['TikTok', 'Instagram'], rep: 'Priya Nair' }),
    SD('Liquid I.V. Q4 Campaign', 'Active', 'not', '', '', 8500, '2026-09-30', { how: 'Split' }),
    SD('Hidden Valley Ranch', 'Active', 'paid', '2026-07-27', '2026-09-18', 1000, '2026-07-14'),
    SD('Milan Laser Atlanta', 'Negotiating', 'not', '', '', 500, '2026-10-08'),
    SD('Planet Fitness', 'Active', 'paid', '2026-07-01', '2026-08-14', 9000, '2026-06-20', { platforms: ['TikTok', 'YouTube'], type: 'Video, Reel', rep: 'Marcus Hill' }),
    SD('Tums', 'Active', 'over', '2026-08-17', '2026-10-11', 8500, '2026-08-01', { rep: 'Alexis Grant' }),
    SD('Panera', 'Active', 'paid', '2026-07-01', '2026-09-26', 8000, '2026-06-18', { platforms: ['Instagram'], type: 'Reel' }),
    SD('Clio', 'Active', 'paid', '', '2026-04-23', 3000, '2026-03-30', { platforms: ['Instagram'], type: 'Reel' }),
    SD('Breyers', 'Active', 'paid', '2026-03-17', '2026-05-30', 4000, '2026-03-02'),
    SD('Dramamine', 'Active', 'not', '2026-10-13', '', 10000, '2026-09-09', { how: 'Split', platforms: ['TikTok', 'Instagram'], rep: 'Jordan Lee' }),
    SD('Biotene', 'Active', 'not', '', '', 12050, '2026-08-28', { how: 'Split', platforms: ['TikTok', 'Instagram'] }),
    SD('Haleon Centrum', 'Active', 'over', '', '2026-09-28', 10550, '2026-08-20'),
    SD('Golden Corral', 'Active', 'over', '', '2026-10-05', 10000, '2026-09-03'),
    SD('Nioxin', 'Active', 'inv', '', '2026-10-19', 1200, '2026-09-15'),
    SD('Sprouts', 'Active', 'inv', '', '2026-11-05', 4000, '2026-09-22'),
    SD('Dulcolax', 'Active', 'inv', '', '2026-11-09', 8500, '2026-09-24'),
    SD('Liquid I.V. Q3 Campaign', 'Active', 'inv', '', '2026-11-30', 6500, '2026-08-30', { how: 'Split' }),
    SD('Oikos', 'Active', 'paid', '', '2026-07-06', 5350, '2026-06-02', { platforms: ['Instagram'], type: 'Reel' }),
    SD('Smoothie King', 'Active', 'paid', '', '', 5000, '2026-03-06'),
    SD('Liquid I.V. Q2 Campaign', 'Active', 'paid', '', '2026-08-16', 4500, '2026-07-01'),
    SD('Milan Laser Atlanta', 'Active', 'paid', '', '2026-08-08', 3000, '2026-07-08'),
    SD('Personal Care GLP-1 Session', 'Active', 'paid', '', '2026-05-15', 1000, '2026-04-28'),
    SD('Tula', 'Active', 'paid', '', '2026-05-16', 1000, '2026-04-30', { platforms: ['Instagram'], type: 'Story' }),
    SD('Gruns', 'Active', 'paid', '', '2026-10-06', 800, '2026-08-18', { how: 'In parts', payments: [{ label: 'Payment 1 of 2', amount: 500, date: '2026-09-05', state: 'paid' }, { label: 'Payment 2 of 2', amount: 300, date: '2026-10-06', state: 'paid' }] }),
    SD('Replenza', 'Active', 'paid', '', '2026-08-21', 500, '2026-07-20'),
  ],
};

/* ------------------------------------------------------------------ Payments and Income summary */

export type PaymentRow = {
  /** your database id, handed back in onAction payloads */
  id: string | number;
  /** due date for unpaid payments, the date it was paid for paid ones, or "" when there is none */
  date: ISODate | '';
  brand: string;
  /** "Full payment", "Payment 1 of 2" */
  part: string;
  state: PayState;
  amount: number;
  /** an invoice file is attached (shows the invoice link on the Income summary) */
  invoice: boolean;
};

export type PaymentsData = {
  today: ISODate;
  /** every payment this year, paid and unpaid. Days late, totals, charts and brand lists are worked out from these. */
  payments: PaymentRow[];
  /** deals still in negotiation, which are left out of the totals */
  negotiating: { count: number; amount: number };
  /** Income summary tiles */
  dealsCompleted: number;
  dealsOpen: number;
  gifted: { amount: number; count: number };
};

const SP = (date: string, brand: string, part: string, state: PayState, amount: number, invoice = true): PaymentRow =>
  ({ id: brand + ':' + part + ':' + date, date, brand, part, state, amount, invoice: state === 'paid' ? invoice : false });

export const SAMPLE_PAYMENTS: PaymentsData = {
  today: '2026-10-14',
  payments: [
    SP('2026-09-28', 'Haleon Centrum', 'Full payment', 'over', 10550), SP('2026-10-05', 'Golden Corral', 'Full payment', 'over', 10000), SP('2026-10-11', 'Tums', 'Full payment', 'over', 8500),
    SP('2026-10-19', 'Nioxin', 'Full payment', 'inv', 1200), SP('2026-11-05', 'Sprouts', 'Full payment', 'inv', 4000), SP('2026-11-09', 'Dulcolax', 'Full payment', 'inv', 8500), SP('2026-11-30', 'Liquid I.V. Q3 Campaign', 'Full payment', 'inv', 6500),
    SP('', 'Milan Laser Q4 Campaign', 'Full payment', 'not', 1000), SP('', 'Biotene', 'Full payment', 'not', 12050), SP('', 'Liquid I.V. Q4 Campaign', 'Full payment', 'not', 8500), SP('', 'CeraVe', 'Full payment', 'not', 8000), SP('', 'Dramamine', 'Full payment', 'not', 10000),
    SP('2026-03-20', 'Smoothie King', 'Full payment', 'paid', 5000), SP('2026-04-23', 'Clio', 'Full payment', 'paid', 3000), SP('2026-05-15', 'Personal Care GLP-1 Session', 'Full payment', 'paid', 1000), SP('2026-05-16', 'Tula', 'Full payment', 'paid', 1000),
    SP('2026-05-30', 'Breyers', 'Full payment', 'paid', 4000), SP('2026-07-06', 'Oikos', 'Full payment', 'paid', 5350), SP('2026-08-08', 'Milan Laser Atlanta', 'Full payment', 'paid', 3000), SP('2026-08-14', 'Planet Fitness', 'Full payment', 'paid', 9000),
    SP('2026-08-16', 'Liquid I.V. Q2 Campaign', 'Full payment', 'paid', 4500), SP('2026-08-21', 'Replenza', 'Full payment', 'paid', 500, false), SP('2026-09-05', 'Gruns', 'Payment 1 of 2', 'paid', 500), SP('2026-09-18', 'Hidden Valley Ranch', 'Full payment', 'paid', 1000),
    SP('2026-09-26', 'Panera', 'Full payment', 'paid', 8000), SP('2026-10-06', 'Gruns', 'Payment 2 of 2', 'paid', 300),
  ],
  negotiating: { count: 1, amount: 500 },
  dealsCompleted: 14,
  dealsOpen: 12,
  gifted: { amount: 0, count: 0 },
};

/* ------------------------------------------------------------------ Calendar */

export type CalendarEvent = {
  id: string | number;
  date: ISODate;
  /** post = content goes live, del = a deliverable due to the brand, pay = a payment due */
  kind: 'post' | 'del' | 'pay';
  /** for pay this is the brand name; for post and del it is the line shown on the calendar */
  title: string;
  amount?: number;
  /** pay only: the payment is late */
  overdue?: boolean;
  /** del only: the deliverable is done */
  done?: boolean;
};

/** The calendar shows the year of `today`, January to December. */
export type CalendarData = { today: ISODate; events: CalendarEvent[] };

export const SAMPLE_CALENDAR: CalendarData = {
  today: '2026-10-14',
  events: [
    { id: 1, date: '2026-09-28', kind: 'pay', title: 'Haleon Centrum', amount: 10550, overdue: true },
    { id: 2, date: '2026-10-02', kind: 'del', title: 'Submit concept for CeraVe', done: true },
    { id: 3, date: '2026-10-02', kind: 'del', title: 'Resubmit changes for Dramamine', done: true },
    { id: 4, date: '2026-10-05', kind: 'pay', title: 'Golden Corral', amount: 10000, overdue: true },
    { id: 5, date: '2026-10-05', kind: 'del', title: 'Get connected to Creator IQ for Dramamine', done: true },
    { id: 6, date: '2026-10-07', kind: 'del', title: 'Submit video for CeraVe', done: true },
    { id: 7, date: '2026-10-08', kind: 'del', title: 'Submit revised Liquid I.V. content', done: true },
    { id: 8, date: '2026-10-08', kind: 'del', title: 'Submit concept for oon', done: true },
    { id: 9, date: '2026-10-09', kind: 'del', title: 'Submit concept for Milan Laser', done: true },
    { id: 10, date: '2026-10-11', kind: 'pay', title: 'Tums', amount: 8500, overdue: true },
    { id: 11, date: '2026-10-13', kind: 'post', title: 'Dramamine Video 1' },
    { id: 12, date: '2026-10-15', kind: 'post', title: 'CeraVe' },
    { id: 13, date: '2026-10-19', kind: 'pay', title: 'Nioxin', amount: 1200 },
    { id: 14, date: '2026-11-05', kind: 'pay', title: 'Sprouts', amount: 4000 },
    { id: 15, date: '2026-11-09', kind: 'pay', title: 'Dulcolax', amount: 8500 },
    { id: 16, date: '2026-11-30', kind: 'pay', title: 'Liquid I.V. Q3 Campaign', amount: 6500 },
  ],
};

/** internal: calendar events in the board's own shape */
export function toCalendarState(d: CalendarData) {
  return d.events.map((e, i) => {
    const o: any = { id: i + 1, dbId: e.id, d: e.date, k: e.kind, title: e.title };
    if (e.amount !== undefined) o.amt = e.amount;
    if (e.overdue) o.over = true;
    if (e.done !== undefined) o.done = e.done;
    return o;
  });
}

/* ------------------------------------------------------------------ Ideas */

export type IdeasData = {
  today: ISODate;
  /** oldest first. created shows as "Sep 23", or "Today". */
  ideas: { id: string | number; text: string; created: ISODate; starred: boolean }[];
};

export const SAMPLE_IDEAS: IdeasData = {
  today: '2026-10-14',
  ideas: [{ id: 1, text: 'Before and after video: this is for the girls that struggled with XYZ', created: '2026-09-23', starred: false }],
};

/** internal: ideas in the board's own shape */
export function toIdeasState(d: IdeasData) {
  return d.ideas.map((x, i) => ({ id: i + 1, dbId: x.id, text: x.text, date: x.created === d.today ? 'Today' : TalbyDates.md(x.created), starred: !!x.starred }));
}

/* ------------------------------------------------------------------ To-dos */

export type TodosData = {
  today: ISODate;
  /** oldest first. deal is the brand name of the linked deal, or "" (then "Open the deal" is hidden). */
  todos: { id: string | number; text: string; deal: string; due: ISODate | ''; done: boolean }[];
  /** deals the to-do can be linked to: [brand, amount] */
  deals: [string, number][];
};

export const SAMPLE_TODOS: TodosData = {
  today: '2026-10-14',
  todos: [{ id: 1, text: 'for dramamine - In the meantime, can you please complete the attached vendor form and send over your W9? Thank you so much!', deal: '', due: '', done: false }],
  deals: [['Dramamine', 10000], ['CeraVe', 8000], ['Biotene', 12050], ['Haleon Centrum', 10550], ['Golden Corral', 10000], ['Tums', 8500], ['Liquid I.V. Q4 Campaign', 8500], ['Dulcolax', 8500], ['Liquid I.V. Q3 Campaign', 6500], ['Sprouts', 4000], ['Nioxin', 1200], ['Milan Laser Q4 Campaign', 1000], ['Milan Laser Atlanta', 500], ['Planet Fitness', 9000], ['Panera', 8000], ['Oikos', 5350], ['Smoothie King', 5000], ['Liquid I.V. Q2 Campaign', 4500], ['Breyers', 4000], ['Clio', 3000], ['Hidden Valley Ranch', 1000], ['Tula', 1000], ['Personal Care GLP-1 Session', 1000], ['Gruns', 800], ['Replenza', 500]],
};

/** internal: to-dos in the board's own shape */
export function toTodosState(d: TodosData) {
  return d.todos.map((x, i) => ({ id: i + 1, dbId: x.id, text: x.text, deal: x.deal || '', due: x.due || '', done: !!x.done }));
}

/* ------------------------------------------------------------------ Settings */

export type SettingsData = {
  billing: {
    /** plan="active": next charge date */
    nextPaymentOn: ISODate;
    /** plan="canceled": the date access ended */
    endedOn: ISODate;
    /** plan="pastdue": the date the payment was declined */
    declinedOn: ISODate;
    /** saved card, or null when there is none */
    card: { brand: string; last4: string; exp: string } | null;
    /** newest first */
    invoices: { id: string | number; date: ISODate; amount: number; url?: string }[];
  };
  notion: { status: 'connected' | 'lost' | 'none'; database: string };
};

export const SAMPLE_SETTINGS: SettingsData = {
  billing: {
    nextPaymentOn: '2026-11-02',
    endedOn: '2026-10-02',
    declinedOn: '2026-10-02',
    card: { brand: 'Visa', last4: '4242', exp: '08/28' },
    invoices: [{ id: 'in3', date: '2026-10-02', amount: 9 }, { id: 'in2', date: '2026-09-02', amount: 9 }, { id: 'in1', date: '2026-08-02', amount: 9 }],
  },
  notion: { status: 'connected', database: 'Brand Deals 2026' },
};

/* ------------------------------------------------------------------ First run (SWelcome) */

/** Getting started list on the first Overview. Each step is done or not. */
export type WelcomeData = { done: { profile: boolean; deal: boolean; import: boolean; payby: boolean; ask: boolean; remind: boolean } };

/* ------------------------------------------------------------------ Imports (New deal dialog, SAddDeal) */

/**
 * Real backend for the upload, CSV and Notion flows in the New deal dialog.
 * Register it once on the client with setTalbyIO(io). Until it is registered
 * the dialog runs the design's sample flow, exactly as on the canvas.
 * State boards (frame prop) always run the sample flow.
 *
 * Every function returns a promise. To show an error step, reject with an
 * object that has a code: { code: 'too_big' }. Codes are listed per function.
 */
export type ImportField = 'brand' | 'amt' | 'post' | 'payby' | 'status' | 'pay' | 'plats' | 'rep' | 'repEmail' | 'notes' | 'skip';
export type ImportRow = {
  /** CSV: row number. Notion: page id. Sent back in rowIds / pageIds and in failed[].id */
  id: string | number;
  brand: string;
  /** ISODate or '' */
  post: ISODate | '';
  status: 'Active' | 'Negotiating';
  amount: number;
  /** true when this deal is already in Talby (same notion page id, or same brand and post date for CSV) */
  repeat: boolean;
  /** Notion only: 'Split' or 'All at once' */
  how?: string;
  /** CSV only: the post date could not be read */
  noDate?: boolean;
};
export type ImportResult = {
  imported: number;
  skipped: number;
  /** sum of Active amounts that imported */
  booked: number;
  /** rows that did not save, with a plain reason like 'Notion did not answer in time' */
  failed: { id: string | number; brand: string; amount: number; reason: string }[];
};
export type TalbyImportIO = {
  /**
   * Upload and read a contract (PDF or Word, up to 20 MB).
   * Reject codes: too_big, bad_type, offline, unreadable (scanned image or no text).
   */
  readContract(file: File): Promise<{
    /** id of the stored file, sent back as contract on deal.create */
    fileId: string;
    pages?: number;
    /** same shape as the form: brand, post (ISODate), plats { TikTok: true }, amt ('6,000'), paid ('once'|'split'|'parts'|'monthly'), rep, repEmail */
    fields: Record<string, any>;
    /** four lines for the reading checklist: brand and rep, amount and terms, post date and deliverables, bonus and commission. '' when not found */
    found: [string, string, string, string];
    /** how many details were found in all */
    count: number;
    /** true when only a few were found (shows "Only N details found") */
    few: boolean;
    /** "Also in the contract": [tag, text, value], for example ['Bonus', 'If the Reel passes 100K views', '$1,000'] */
    extras?: [string, string, string][];
  }>;
  /** Parse a CSV or Excel file. Keep it server side and return an uploadId. Reject codes: empty, offline. */
  readCsv(file: File): Promise<{
    uploadId: string;
    /** every column, with a sample value and your best guess of the Talby field */
    cols: { name: string; sample: string; field: ImportField }[];
    /** every row that has a brand */
    rows: ImportRow[];
    /** rows in the file, including ones left out */
    total: number;
    /** plain sentences, one per row that needs a look, for example 'Row 11 has no brand, so it stays out.' */
    issues: string[];
  }>;
  /** Save the CSV rows. map is { columnName: field } without skipped columns. rowIds is set on Try again. */
  importCsv(req: { uploadId: string; map: Record<string, ImportField>; skipRepeats: boolean; rowIds: (string | number)[] | null }): Promise<ImportResult>;
  /**
   * Make sure Notion is connected (open the OAuth window if it is not). Resolve when connected.
   * switchWorkspace: the user asked to connect a different workspace.
   * Reject codes: notion_denied (window closed), notion_lost, not_ready (import is off on our side).
   */
  notionConnect(req: { switchWorkspace: boolean }): Promise<{ workspace: string }>;
  /** Databases shared with Talby. looksLikeDeals marks the ones that look like deals. Reject code: notion_lost. */
  notionDatabases(): Promise<{ id: string; name: string; meta: string; looksLikeDeals: boolean }[]>;
  /** Every row of one database (follow has_more to the end), the properties, and your best field guess for each. Reject codes: notion_lost, fetch_failed. */
  notionRows(databaseId: string): Promise<{
    props: { name: string; type: string; field: ImportField; values?: { from: string; to: string }[] }[];
    rows: ImportRow[];
  }>;
  /** Save the chosen pages. map is { propertyName: field }. sync: keep in sync. Reject code: notion_lost. */
  importNotion(req: { databaseId: string; map: Record<string, ImportField>; pageIds: (string | number)[]; sync: boolean }): Promise<ImportResult>;
  /** Deal panel upload (Files tab and the Invoice row). kind 'auto' means you decide contract or invoice. Store it, add a deal_files row, return the saved file. */
  uploadDealFile?(file: File, req: { dealId: string | number; kind: 'auto' | 'contract' | 'invoice' | 'other' }): Promise<{ id: string | number; name: string; kind: 'contract' | 'invoice' | 'other'; url: string; date: ISODate }>;
};
let talbyIO: TalbyImportIO | null = null;
export function setTalbyIO(io: TalbyImportIO | null) { talbyIO = io; }
export function getTalbyIO(): TalbyImportIO | null { return talbyIO; }
