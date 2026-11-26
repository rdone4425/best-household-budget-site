// Budget arithmetic: every figure the site shows is derived here from
// app/data.js, so the dashboard, budgets page and reports can never
// disagree. Money is kept in cents internally and only rounded for
// display, so totals always equal the sum of their parts.

import { CATEGORIES, GOALS, INCOME, PAST_MONTHS, TRANSACTIONS } from './data.js';

const CENT = 100;

function toCents(amount) {
  return Math.round(amount * CENT);
}

function fromCents(cents) {
  return cents / CENT;
}

/** Format a dollar amount, e.g. 4729.82 -> "$4,729.82". */
export function money(amount) {
  return '$' + fromCents(toCents(amount)).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Format a dollar amount with no cents, e.g. 7850 -> "$7,850". */
export function moneyWhole(amount) {
  return '$' + Math.round(amount).toLocaleString('en-US');
}

/** "2026-11-04" -> "Nov 4". */
export function shortDate(iso) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const parts = iso.split('-');
  return months[Number(parts[1]) - 1] + ' ' + Number(parts[2]);
}

/** Working copy of the transactions, so edits never mutate the source data. */
export function freshTransactions() {
  return TRANSACTIONS.map((t) => ({ ...t }));
}

/** Working copy of the savings goals. */
export function freshGoals() {
  return GOALS.map((g) => ({ ...g }));
}

/** Working copy of the category limits. */
export function freshLimits() {
  const limits = {};
  for (const c of CATEGORIES) limits[c.id] = c.limit;
  return limits;
}

/** Total take-home pay for the month. */
export function totalIncome() {
  return INCOME.reduce((sum, line) => sum + line.amount, 0);
}

/** Sum of all expense transactions (transfers excluded). */
export function totalSpending(transactions) {
  return fromCents(
    transactions
      .filter((t) => t.kind === 'expense')
      .reduce((sum, t) => sum + toCents(t.amount), 0),
  );
}

/** Sum of all savings transfers this month. */
export function totalTransfers(transactions) {
  return fromCents(
    transactions
      .filter((t) => t.kind === 'transfer')
      .reduce((sum, t) => sum + toCents(t.amount), 0),
  );
}

/** Money left after spending and savings transfers. */
export function leftToBudget(transactions) {
  return totalIncome() - totalSpending(transactions) - totalTransfers(transactions);
}

/** Spending per category, as { categoryId: amount }. */
export function spendingByCategory(transactions) {
  const out = {};
  for (const c of CATEGORIES) out[c.id] = 0;
  for (const t of transactions) {
    if (t.kind === 'expense' && Object.prototype.hasOwnProperty.call(out, t.category)) {
      out[t.category] = fromCents(toCents(out[t.category]) + toCents(t.amount));
    }
  }
  return out;
}

/** One row per budget category: limit, spent, remaining, percent used. */
export function budgetRows(transactions, limits) {
  const spent = spendingByCategory(transactions);
  return CATEGORIES.map((c) => {
    const limit = limits[c.id];
    const used = spent[c.id];
    return {
      ...c,
      limit,
      spent: used,
      remaining: limit - used,
      pct: limit > 0 ? (used / limit) * 100 : 0,
      over: used > limit,
      near: used > limit * 0.9 && used <= limit,
    };
  });
}

/** Total of all category limits. */
export function totalBudgetLimit(limits) {
  return CATEGORIES.reduce((sum, c) => sum + limits[c.id], 0);
}

/** Six-month trend: the five closed months plus November, computed live. */
export function trendMonths(transactions) {
  const november = { month: 'Nov', income: totalIncome(), spending: totalSpending(transactions) };
  return [...PAST_MONTHS.map((m) => ({ ...m })), november];
}

/** Share of income set aside (spending excluded): the savings rate. */
export function savingsRate(transactions) {
  const income = totalIncome();
  if (income <= 0) return 0;
  return ((income - totalSpending(transactions)) / income) * 100;
}

/** The single biggest expense of the month. */
export function biggestExpense(transactions) {
  let best = null;
  for (const t of transactions) {
    if (t.kind === 'expense' && (!best || t.amount > best.amount)) best = t;
  }
  return best;
}

/** Categories sorted by spending, largest first. */
export function rankedCategories(transactions) {
  const spent = spendingByCategory(transactions);
  return CATEGORIES.map((c) => ({ ...c, spent: spent[c.id] }))
    .sort((a, b) => b.spent - a.spent);
}
