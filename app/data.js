// Household budget data for the Maplewood family — November 2026.
//
// Everything on the site is computed from this file: category totals,
// monthly spending, savings and the six-month trend are all sums of the
// transactions below, so the figures on every page always agree with each
// other. Amounts are US dollars. The family is fictional; the line items
// are the kind of ordinary spending a family of four in Columbus, Ohio
// actually has in a month.

export const HOUSEHOLD = {
  name: 'The Maplewood Family',
  members: 'Daniel & Priya, with Maya (9) and Leo (6)',
  place: 'Columbus, Ohio',
  month: 'November 2026',
  monthShort: 'Nov 2026',
  note: 'One month, one paycheque cycle: every dollar below is accounted for.',
};

// Monthly take-home pay. Both salaries land on the 1st and the 15th.
export const INCOME = [
  { source: 'Daniel — software engineer, take-home pay', amount: 4650.0 },
  { source: 'Priya — registered nurse, take-home pay', amount: 3200.0 },
];

// Budget categories. `limit` is the monthly cap the family set together;
// `spent` is never stored here — it is summed from TRANSACTIONS at load.
export const CATEGORIES = [
  { id: 'housing', label: 'Housing', limit: 1850, color: '#2e6f57', hint: 'Mortgage, HOA and upkeep' },
  { id: 'groceries', label: 'Groceries', limit: 850, color: '#5b8c5a', hint: 'Weekly shops and the bulk run' },
  { id: 'dining', label: 'Dining Out', limit: 320, color: '#c2703d', hint: 'Restaurants, takeout and coffee' },
  { id: 'transport', label: 'Transport', limit: 480, color: '#4a6fa5', hint: 'Fuel, insurance and upkeep' },
  { id: 'utilities', label: 'Utilities', limit: 340, color: '#7a6aa8', hint: 'Power, water, internet, phones' },
  { id: 'health', label: 'Health', limit: 300, color: '#b0485e', hint: 'Pharmacy, visits and the gym' },
  { id: 'kids', label: 'Kids & School', limit: 420, color: '#2f8f83', hint: 'Lunches, activities and gear' },
  { id: 'entertainment', label: 'Entertainment', limit: 220, color: '#a85638', hint: 'Movies, outings and games' },
  { id: 'subscriptions', label: 'Subscriptions', limit: 95, color: '#6b7c93', hint: 'Streaming, music and cloud' },
  { id: 'clothing', label: 'Clothing', limit: 180, color: '#8a6d3b', hint: 'Coats, shoes and everyday wear' },
  { id: 'home', label: 'Home & Garden', limit: 150, color: '#55703f', hint: 'Yard, tools and household bits' },
  { id: 'personal', label: 'Personal', limit: 200, color: '#96688a', hint: 'Haircuts and toiletries' },
];

// Every transaction of November 2026, dated 1–26 November. `kind` is
// "expense" for spending, "income" for money in, "transfer" for money
// moved into a savings goal (not spending — it still leaves the account).
// Transfers carry category "savings" and are excluded from budgets.
export const TRANSACTIONS = [
  // Housing
  { id: 1, date: '2026-11-01', desc: 'Mortgage payment — First National Bank', category: 'housing', kind: 'expense', amount: 1650.0 },
  { id: 2, date: '2026-11-03', desc: 'HOA dues — Maple Grove association', category: 'housing', kind: 'expense', amount: 120.0 },
  { id: 3, date: '2026-11-14', desc: 'Plumber — fix leaky kitchen faucet', category: 'housing', kind: 'expense', amount: 68.5 },
  // Groceries
  { id: 4, date: '2026-11-02', desc: 'Kroger — weekly shop', category: 'groceries', kind: 'expense', amount: 142.35 },
  { id: 5, date: '2026-11-07', desc: 'Kroger — weekly shop', category: 'groceries', kind: 'expense', amount: 118.9 },
  { id: 6, date: '2026-11-09', desc: 'Costco — bulk run', category: 'groceries', kind: 'expense', amount: 186.4 },
  { id: 7, date: '2026-11-14', desc: 'Kroger — weekly shop', category: 'groceries', kind: 'expense', amount: 127.6 },
  { id: 8, date: '2026-11-16', desc: 'North Market farmers market', category: 'groceries', kind: 'expense', amount: 34.75 },
  { id: 9, date: '2026-11-21', desc: 'Kroger — weekly shop', category: 'groceries', kind: 'expense', amount: 131.2 },
  // Dining out
  { id: 10, date: '2026-11-04', desc: 'Chipotle — family dinner', category: 'dining', kind: 'expense', amount: 38.6 },
  { id: 11, date: '2026-11-08', desc: "Domino's — pizza night", category: 'dining', kind: 'expense', amount: 27.45 },
  { id: 12, date: '2026-11-12', desc: 'Lunch with coworkers — Priya', category: 'dining', kind: 'expense', amount: 16.8 },
  { id: 13, date: '2026-11-15', desc: 'Olive Garden — birthday dinner', category: 'dining', kind: 'expense', amount: 86.3 },
  { id: 14, date: '2026-11-19', desc: 'Fox in the Snow — coffee & pastries', category: 'dining', kind: 'expense', amount: 22.4 },
  { id: 15, date: '2026-11-22', desc: 'Bangkok Kitchen — Thai takeout', category: 'dining', kind: 'expense', amount: 44.15 },
  { id: 16, date: '2026-11-25', desc: 'Chipotle — lunch', category: 'dining', kind: 'expense', amount: 24.9 },
  // Transport
  { id: 17, date: '2026-11-02', desc: 'Shell — fuel, Honda CR-V', category: 'transport', kind: 'expense', amount: 52.3 },
  { id: 18, date: '2026-11-05', desc: 'Car insurance — State Farm, monthly', category: 'transport', kind: 'expense', amount: 148.0 },
  { id: 19, date: '2026-11-10', desc: 'Shell — fuel, Honda CR-V', category: 'transport', kind: 'expense', amount: 48.75 },
  { id: 20, date: '2026-11-17', desc: 'Jiffy Lube — oil change', category: 'transport', kind: 'expense', amount: 64.95 },
  { id: 21, date: '2026-11-19', desc: 'Shell — fuel, Honda CR-V', category: 'transport', kind: 'expense', amount: 51.2 },
  { id: 22, date: '2026-11-23', desc: 'COTA bus pass — Daniel', category: 'transport', kind: 'expense', amount: 62.0 },
  // Utilities
  { id: 23, date: '2026-11-06', desc: 'Electric — AEP Ohio', category: 'utilities', kind: 'expense', amount: 118.4 },
  { id: 24, date: '2026-11-06', desc: 'Water & sewer — City of Columbus', category: 'utilities', kind: 'expense', amount: 64.3 },
  { id: 25, date: '2026-11-10', desc: 'Internet — Spectrum', category: 'utilities', kind: 'expense', amount: 79.99 },
  { id: 26, date: '2026-11-12', desc: 'Mobile — T-Mobile, two lines', category: 'utilities', kind: 'expense', amount: 96.5 },
  // Health
  { id: 27, date: '2026-11-05', desc: "CVS pharmacy — Leo's antibiotics", category: 'health', kind: 'expense', amount: 24.0 },
  { id: 28, date: '2026-11-11', desc: 'Dentist copay — Maya', category: 'health', kind: 'expense', amount: 45.0 },
  { id: 29, date: '2026-11-18', desc: 'Pediatrician visit — Leo', category: 'health', kind: 'expense', amount: 35.0 },
  { id: 30, date: '2026-11-20', desc: 'YMCA — family membership', category: 'health', kind: 'expense', amount: 78.0 },
  // Kids & school
  { id: 31, date: '2026-11-03', desc: 'School lunch account — Maya & Leo', category: 'kids', kind: 'expense', amount: 80.0 },
  { id: 32, date: '2026-11-07', desc: 'Soccer cleats — Leo', category: 'kids', kind: 'expense', amount: 54.99 },
  { id: 33, date: '2026-11-13', desc: 'After-school program — November', category: 'kids', kind: 'expense', amount: 180.0 },
  { id: 34, date: '2026-11-21', desc: 'Book fair — Maya', category: 'kids', kind: 'expense', amount: 28.5 },
  // Entertainment
  { id: 35, date: '2026-11-08', desc: 'AMC — movie night, family of four', category: 'entertainment', kind: 'expense', amount: 52.0 },
  { id: 36, date: '2026-11-14', desc: 'Columbus Zoo — family tickets', category: 'entertainment', kind: 'expense', amount: 68.0 },
  { id: 37, date: '2026-11-22', desc: 'Catan Junior — board game', category: 'entertainment', kind: 'expense', amount: 29.99 },
  // Subscriptions
  { id: 38, date: '2026-11-01', desc: 'Netflix — standard plan', category: 'subscriptions', kind: 'expense', amount: 15.49 },
  { id: 39, date: '2026-11-05', desc: 'Spotify — family plan', category: 'subscriptions', kind: 'expense', amount: 16.99 },
  { id: 40, date: '2026-11-09', desc: 'Amazon Prime — monthly', category: 'subscriptions', kind: 'expense', amount: 14.99 },
  { id: 41, date: '2026-11-15', desc: 'Disney+ — monthly', category: 'subscriptions', kind: 'expense', amount: 13.99 },
  { id: 42, date: '2026-11-18', desc: 'iCloud — 200 GB storage', category: 'subscriptions', kind: 'expense', amount: 2.99 },
  // Clothing
  { id: 43, date: '2026-11-10', desc: 'Old Navy — winter coats, kids', category: 'clothing', kind: 'expense', amount: 112.4 },
  { id: 44, date: '2026-11-24', desc: 'Work shoes — Daniel', category: 'clothing', kind: 'expense', amount: 74.95 },
  // Home & garden
  { id: 45, date: '2026-11-16', desc: 'Leaf bags & rake', category: 'home', kind: 'expense', amount: 32.8 },
  { id: 46, date: '2026-11-23', desc: 'Light bulbs & batteries', category: 'home', kind: 'expense', amount: 18.45 },
  // Personal
  { id: 47, date: '2026-11-07', desc: 'Haircut — Daniel', category: 'personal', kind: 'expense', amount: 28.0 },
  { id: 48, date: '2026-11-15', desc: 'Haircut & colour — Priya', category: 'personal', kind: 'expense', amount: 65.0 },
  { id: 49, date: '2026-11-20', desc: 'Pharmacy toiletries', category: 'personal', kind: 'expense', amount: 31.6 },
  // Savings transfers — money set aside, not spending
  { id: 50, date: '2026-11-01', desc: 'Auto-transfer — emergency fund', category: 'savings', kind: 'transfer', amount: 900.0 },
  { id: 51, date: '2026-11-15', desc: 'Transfer — Hawaii trip fund', category: 'savings', kind: 'transfer', amount: 300.0 },
  { id: 52, date: '2026-11-15', desc: 'Transfer — college 529 plans', category: 'savings', kind: 'transfer', amount: 250.0 },
];

// Savings goals. `saved` is the balance on 26 November 2026; the
// November transfers above are already inside these balances.
export const GOALS = [
  { id: 'emergency', name: 'Emergency fund', target: 15000, saved: 11250, note: 'Six months of essentials, kept in a high-yield savings account.' },
  { id: 'hawaii', name: 'Hawaii family trip — June 2027', target: 4200, saved: 2850, note: 'Flights for four, a week in a condo on Maui, and a luau.' },
  { id: 'car', name: 'Next car fund', target: 12000, saved: 4600, note: 'Replacing the 2015 CR-V in 2028; aiming to pay cash.' },
  { id: 'college', name: 'College 529 — Maya & Leo', target: 25000, saved: 8300, note: '$250 a month split between the two 529 plans.' },
];

// June–October 2026, closed months. November is computed live from the
// transactions above so the chart can never disagree with the dashboard.
export const PAST_MONTHS = [
  { month: 'Jun', income: 7850, spending: 5110 },
  { month: 'Jul', income: 7850, spending: 4985 },
  { month: 'Aug', income: 8120, spending: 5340 },
  { month: 'Sep', income: 7850, spending: 4860 },
  { month: 'Oct', income: 7850, spending: 5025 },
];

// Money advice the family wrote for itself, shown on the dashboard.
export const HOUSEHOLD_RULES = [
  'Payday rule: savings transfers go out on the 1st and 15th, before anything else.',
  'Groceries: one big shop a week, list first — no list, no trip.',
  'Dining out stays under $320; a birthday dinner counts, a weekday lunch does not.',
  'Anything over $100 that is not a bill waits 24 hours before we buy it.',
];
