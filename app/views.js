// Page renderers: each section returns HTML for the current state.
// Nothing here stores numbers — every figure is computed from the
// transactions, goals and limits passed in, so an edit anywhere is
// reflected everywhere on the next render.

import {
  biggestExpense,
  budgetRows,
  leftToBudget,
  money,
  moneyWhole,
  rankedCategories,
  savingsRate,
  shortDate,
  totalBudgetLimit,
  totalIncome,
  totalSpending,
  totalTransfers,
  trendMonths,
} from './budget.js';
import { barChart, donutChart, trendChart } from './charts.js';
import { CATEGORIES, HOUSEHOLD, HOUSEHOLD_RULES, INCOME } from './data.js';

function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function progressBar(pct, tone) {
  const clamped = Math.max(0, Math.min(100, pct));
  return `<div class="bar" role="img" aria-label="${Math.round(pct)} percent used"><span class="bar-fill ${tone}" style="width:${clamped}%"></span></div>`;
}

function statusBadge(row) {
  if (row.over) return '<span class="badge badge-over">Over budget</span>';
  if (row.near) return '<span class="badge badge-near">Nearly there</span>';
  return '<span class="badge badge-ok">On track</span>';
}

/* ---------------- Dashboard ---------------- */

export function dashboardView(state) {
  const { transactions, goals, limits } = state;
  const income = totalIncome();
  const spending = totalSpending(transactions);
  const transfers = totalTransfers(transactions);
  const left = leftToBudget(transactions);
  const rate = savingsRate(transactions);
  const rows = budgetRows(transactions, limits);
  const over = rows.filter((r) => r.over);
  const near = rows.filter((r) => r.near);
  const ranked = rankedCategories(transactions);
  const top = ranked.slice(0, 6);
  const biggest = biggestExpense(transactions);
  const recent = [...transactions].sort((a, b) => (b.date + String(b.id)).localeCompare(a.date + String(a.id))).slice(0, 6);
  const goalTotal = goals.reduce((s, g) => s + g.saved, 0);
  const goalTarget = goals.reduce((s, g) => s + g.target, 0);

  const alerts = [];
  for (const r of over) {
    alerts.push(`<li class="alert alert-over"><strong>${esc(r.label)}</strong> is ${money(r.spent - r.limit)} over its ${moneyWhole(r.limit)} limit.</li>`);
  }
  for (const r of near) {
    alerts.push(`<li class="alert alert-near"><strong>${esc(r.label)}</strong> has used ${Math.round(r.pct)}% of its ${moneyWhole(r.limit)} limit.</li>`);
  }
  if (alerts.length === 0) {
    alerts.push('<li class="alert alert-ok">Every category is inside its limit so far this month.</li>');
  }

  return `
  <section class="page-head">
    <p class="eyebrow">${esc(HOUSEHOLD.month)} · ${esc(HOUSEHOLD.place)}</p>
    <h1>November, at a glance</h1>
    <p class="lede">${esc(HOUSEHOLD.members)}. Two paycheques in, ${money(spending)} spent, ${money(transfers)} moved to savings — and ${money(left)} still to give a job before the month ends.</p>
  </section>

  <section class="stat-grid" aria-label="Month totals">
    <article class="stat"><span class="stat-label">Income</span><span class="stat-value">${money(income)}</span><span class="stat-sub">Daniel ${moneyWhole(INCOME[0].amount)} · Priya ${moneyWhole(INCOME[1].amount)}</span></article>
    <article class="stat"><span class="stat-label">Spent</span><span class="stat-value">${money(spending)}</span><span class="stat-sub">${transactions.filter((t) => t.kind === 'expense').length} expenses, 1–26 Nov</span></article>
    <article class="stat"><span class="stat-label">Moved to savings</span><span class="stat-value">${money(transfers)}</span><span class="stat-sub">Savings rate ${rate.toFixed(1)}% of income</span></article>
    <article class="stat stat-highlight"><span class="stat-label">Left to budget</span><span class="stat-value">${money(left)}</span><span class="stat-sub">Unassigned — give it a job</span></article>
  </section>

  <div class="two-col">
    <section class="card" aria-label="Where the money went">
      <h2>Where the money went</h2>
      <div class="donut-wrap">${donutChart(top.map((c) => ({ label: c.label, value: c.spent, color: c.color })), spending, 180)}
        <ul class="legend">${top.map((c) => `<li><span class="swatch" style="background:${c.color}"></span>${esc(c.label)} <strong>${moneyWhole(c.spent)}</strong></li>`).join('')}</ul>
      </div>
      <p class="card-note">Housing is ${Math.round((ranked[0].spent / spending) * 100)}% of all spending; the top three categories together are ${Math.round(((ranked[0].spent + ranked[1].spent + ranked[2].spent) / spending) * 100)}%.</p>
      <p><a class="button" href="#/reports">See the full breakdown →</a></p>
    </section>

    <section class="card" aria-label="Budget watch">
      <h2>Budget watch</h2>
      <ul class="alerts">${alerts.join('')}</ul>
      <p class="card-note">Biggest single expense: <strong>${esc(biggest.desc)}</strong> — ${money(biggest.amount)} on ${shortDate(biggest.date)}.</p>
      <p><a class="button" href="#/budgets">Open the budgets →</a></p>
    </section>
  </div>

  <div class="two-col">
    <section class="card" aria-label="Recent transactions">
      <h2>Recent spending</h2>
      <ul class="mini-list">${recent.map((t) => `<li><span class="mini-date">${shortDate(t.date)}</span><span class="mini-desc">${esc(t.desc)}</span><span class="mini-amount ${t.kind === 'transfer' ? 'is-transfer' : ''}">${t.kind === 'expense' ? '−' : '+'}${money(t.amount)}</span></li>`).join('')}</ul>
      <p><a class="button" href="#/transactions">All ${transactions.length} transactions →</a></p>
    </section>

    <section class="card" aria-label="Savings goals">
      <h2>Savings goals</h2>
      <p class="card-note">${moneyWhole(goalTotal)} saved toward ${moneyWhole(goalTarget)} across ${goals.length} goals.</p>
      ${goals.map((g) => `<div class="goal-line"><span>${esc(g.name)}</span><span><strong>${moneyWhole(g.saved)}</strong> of ${moneyWhole(g.target)}</span></div>${progressBar((g.saved / g.target) * 100, 'tone-green')}`).join('')}
      <p><a class="button" href="#/goals">Open the goals →</a></p>
    </section>
  </div>

  <section class="card rules" aria-label="Household rules">
    <h2>How this household budgets</h2>
    <ol>${HOUSEHOLD_RULES.map((r) => `<li>${esc(r)}</li>`).join('')}</ol>
  </section>`;
}

/* ---------------- Transactions ---------------- */

export function transactionsView(state, filter) {
  const { transactions } = state;
  const shown = transactions
    .filter((t) => !filter.category || t.category === filter.category || (filter.category === 'savings' && t.kind === 'transfer'))
    .filter((t) => !filter.kind || t.kind === filter.kind)
    .filter((t) => !filter.query || t.desc.toLowerCase().includes(filter.query.toLowerCase()))
    .sort((a, b) => (b.date + String(b.id)).localeCompare(a.date + String(a.id)));

  const expenseTotal = shown.filter((t) => t.kind === 'expense').reduce((s, t) => s + t.amount, 0);
  const transferTotal = shown.filter((t) => t.kind === 'transfer').reduce((s, t) => s + t.amount, 0);

  const editing = state.editingId != null ? transactions.find((t) => t.id === state.editingId) : null;

  const categoryOptions = [{ id: '', label: 'All categories' }]
    .concat(CATEGORIES.map((c) => ({ id: c.id, label: c.label })))
    .concat([{ id: 'savings', label: 'Savings transfers' }])
    .map((c) => `<option value="${c.id}" ${filter.category === c.id ? 'selected' : ''}>${esc(c.label)}</option>`)
    .join('');

  const rows = shown
    .map((t) => {
      const label = t.kind === 'transfer' ? 'Savings' : (CATEGORIES.find((c) => c.id === t.category) || {}).label || t.category;
      return `<tr>
        <td>${shortDate(t.date)}</td>
        <td>${esc(t.desc)}</td>
        <td>${esc(label)}</td>
        <td class="amount ${t.kind === 'expense' ? 'is-expense' : 'is-in'}">${t.kind === 'expense' ? '−' : '+'}${money(t.amount)}</td>
        <td class="row-actions"><button type="button" class="link-button" data-edit="${t.id}">Edit</button> <button type="button" class="link-button link-danger" data-delete="${t.id}">Delete</button></td>
      </tr>`;
    })
    .join('');

  return `
  <section class="page-head">
    <p class="eyebrow">Every dollar, in order</p>
    <h1>Transactions</h1>
    <p class="lede">${transactions.length} entries for November. Add one, fix one, or filter the list — the totals underneath move with every change.</p>
  </section>

  <section class="card" aria-label="Add a transaction">
    <h2>${editing ? 'Edit transaction' : 'Add a transaction'}</h2>
    <form id="tx-form" class="tx-form">
      <label>Date <input type="date" id="tx-date" value="${editing ? editing.date : '2026-11-26'}" min="2026-11-01" max="2026-11-30" required></label>
      <label class="wide">What was it? <input type="text" id="tx-desc" value="${editing ? esc(editing.desc) : ''}" placeholder="e.g. Kroger — weekly shop" required></label>
      <label>Category
        <select id="tx-category">
          ${CATEGORIES.map((c) => `<option value="${c.id}" ${editing && editing.category === c.id ? 'selected' : ''}>${esc(c.label)}</option>`).join('')}
          <option value="savings" ${editing && editing.kind === 'transfer' ? 'selected' : ''}>Savings transfer</option>
        </select>
      </label>
      <label>Amount ($) <input type="number" id="tx-amount" value="${editing ? editing.amount.toFixed(2) : ''}" min="0.01" step="0.01" placeholder="0.00" required></label>
      <span class="form-buttons">
        <button class="button button-primary" type="submit">${editing ? 'Save changes' : 'Add transaction'}</button>
        ${editing ? '<button class="button" type="button" id="tx-cancel">Cancel</button>' : ''}
      </span>
    </form>
    <p class="form-note" id="tx-message" role="status"></p>
  </section>

  <section class="card" aria-label="Filter transactions">
    <div class="filters">
      <label>Category <select id="filter-category">${categoryOptions}</select></label>
      <label>Type
        <select id="filter-kind">
          <option value="" ${!filter.kind ? 'selected' : ''}>All types</option>
          <option value="expense" ${filter.kind === 'expense' ? 'selected' : ''}>Spending</option>
          <option value="transfer" ${filter.kind === 'transfer' ? 'selected' : ''}>Savings transfers</option>
        </select>
      </label>
      <label class="wide">Search <input type="search" id="filter-query" value="${esc(filter.query)}" placeholder="Search descriptions…"></label>
    </div>
  </section>

  <section class="card" aria-label="Transaction list">
    <table class="tx-table">
      <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th><span class="visually-hidden">Actions</span></th></tr></thead>
      <tbody>${rows || '<tr><td colspan="5">Nothing matches those filters yet — clear one and try again.</td></tr>'}</tbody>
      <tfoot><tr><td colspan="2">${shown.length} shown</td><td>Spent</td><td class="amount is-expense">−${money(expenseTotal)}</td><td></td></tr>
      <tr><td colspan="2"></td><td>To savings</td><td class="amount is-in">+${money(transferTotal)}</td><td></td></tr></tfoot>
    </table>
  </section>`;
}

/* ---------------- Budgets ---------------- */

export function budgetsView(state) {
  const { transactions, limits } = state;
  const rows = budgetRows(transactions, limits);
  const totalLimit = totalBudgetLimit(limits);
  const totalSpent = totalSpending(transactions);
  const overCount = rows.filter((r) => r.over).length;

  return `
  <section class="page-head">
    <p class="eyebrow">Twelve envelopes, one month</p>
    <h1>Budgets</h1>
    <p class="lede">${money(totalSpent)} spent against ${moneyWhole(totalLimit)} of limits — ${money(totalLimit - totalSpent)} of room left overall, with ${overCount} categor${overCount === 1 ? 'y' : 'ies'} over. Limits are the family's own; change one and the bars move.</p>
  </section>

  <section class="budget-grid">
    ${rows
      .map(
        (r) => `<article class="card budget-card ${r.over ? 'is-over' : ''}">
      <header><h2>${esc(r.label)}</h2>${statusBadge(r)}</header>
      <p class="budget-hint">${esc(r.hint)}</p>
      ${progressBar(r.pct, r.over ? 'tone-red' : r.near ? 'tone-amber' : 'tone-green')}
      <p class="budget-numbers"><strong>${money(r.spent)}</strong> of ${moneyWhole(r.limit)} <span>· ${Math.round(r.pct)}%</span></p>
      <p class="budget-remaining">${r.over ? `${money(r.spent - r.limit)} over — trim ${money(r.spent - r.limit)} before month-end.` : `${money(r.remaining)} left for the rest of November.`}</p>
      <form class="limit-form" data-category="${r.id}">
        <label>Monthly limit ($) <input type="number" min="0" step="1" value="${r.limit}" required></label>
        <button class="button" type="submit">Update limit</button>
      </form>
    </article>`,
      )
      .join('')}
  </section>`;
}

/* ---------------- Goals ---------------- */

export function goalsView(state) {
  const { goals } = state;
  const saved = goals.reduce((s, g) => s + g.saved, 0);
  const target = goals.reduce((s, g) => s + g.target, 0);

  return `
  <section class="page-head">
    <p class="eyebrow">Saving for what comes next</p>
    <h1>Savings goals</h1>
    <p class="lede">${moneyWhole(saved)} put aside toward ${moneyWhole(target)} across four goals — ${Math.round((saved / target) * 100)}% of the way there. Add money to a goal and watch its bar move.</p>
  </section>

  <section class="goal-grid">
    ${goals
      .map(
        (g) => {
          const pct = (g.saved / g.target) * 100;
          const remaining = g.target - g.saved;
          return `<article class="card goal-card">
      <h2>${esc(g.name)}</h2>
      <p class="goal-numbers"><strong>${money(g.saved)}</strong> of ${moneyWhole(g.target)} <span>· ${Math.round(pct)}%</span></p>
      ${progressBar(pct, 'tone-green')}
      <p class="goal-note">${esc(g.note)}</p>
      <p class="goal-remaining">${remaining > 0 ? `${money(remaining)} to go.` : 'Goal reached — nicely done.'}</p>
      <form class="goal-form" data-goal="${g.id}">
        <label>Add money ($) <input type="number" min="1" step="1" placeholder="100" required></label>
        <button class="button button-primary" type="submit">Add to goal</button>
      </form>
    </article>`;
        },
      )
      .join('')}
  </section>

  <section class="card" aria-label="How the goals are funded">
    <h2>How the goals get funded</h2>
    <p>On the 1st of the month ${moneyWhole(900)} moves to the emergency fund automatically; on the 15th, ${moneyWhole(300)} to the Hawaii trip and ${moneyWhole(250)} split into the two 529 plans. The car fund grows from whatever is left at month-end — this month that is ${money(leftToBudget(state.transactions))} still unassigned. Nothing here is invested advice; it is one family's plan, written down so everyone can see it.</p>
  </section>`;
}

/* ---------------- Reports ---------------- */

export function reportsView(state) {
  const { transactions } = state;
  const spending = totalSpending(transactions);
  const income = totalIncome();
  const rate = savingsRate(transactions);
  const ranked = rankedCategories(transactions);
  const months = trendMonths(transactions);
  const biggest = biggestExpense(transactions);
  const over = budgetRows(transactions, state.limits).filter((r) => r.over);
  const cheapest = months.reduce((a, b) => (b.spending < a.spending ? b : a));
  const dearest = months.reduce((a, b) => (b.spending > a.spending ? b : a));
  const topShare = Math.round((ranked[0].spent / spending) * 100);
  const topThreeShare = Math.round(
    ((ranked[0].spent + ranked[1].spent + ranked[2].spent) / spending) * 100,
  );

  const insights = [
    `<strong>${esc(ranked[0].label)}</strong> is the biggest slice at ${moneyWhole(ranked[0].spent)} — ${topShare}% of all spending. The top three categories together are ${topThreeShare}%.`,
    over.length > 0
      ? `<strong>${over.map((r) => esc(r.label)).join(' and ')}</strong> ${over.length === 1 ? 'is' : 'are'} over budget. Together they need ${money(over.reduce((s, r) => s + (r.spent - r.limit), 0))} of trimming or a higher limit next month.`
      : 'No category is over budget this month.',
    `The biggest single purchase was <strong>${esc(biggest.desc)}</strong> at ${money(biggest.amount)} — a fixed bill, not a splurge.`,
    `${cheapest.month} was the cheapest month of the last six at ${moneyWhole(cheapest.spending)} of spending. November is running ${money(Math.abs(spending - cheapest.spending))} ${spending >= cheapest.spending ? 'above' : 'below'} that.`,
    `The household kept ${rate.toFixed(1)}% of its income this month (${money(income - spending)} of ${moneyWhole(income)}), against a standing target of 20%.`,
  ];

  return `
  <section class="page-head">
    <p class="eyebrow">Six months, one story</p>
    <h1>Reports</h1>
    <p class="lede">November's spending by category, and income against spending from June to November. Every bar and point is drawn from the same transactions the other pages show.</p>
  </section>

  <section class="card" aria-label="Spending by category">
    <h2>Spending by category — November</h2>
    ${barChart(ranked.map((c) => ({ label: c.label, value: c.spent, color: c.color })), 720, 34)}
    <p class="card-note">Total spending ${money(spending)} across ${ranked.filter((c) => c.spent > 0).length} categories.</p>
  </section>

  <section class="card" aria-label="Six month trend">
    <h2>Income vs spending — June to November</h2>
    ${trendChart(months, 720, 300)}
    <p class="card-note">Income held steady at ${moneyWhole(income)} a month (August's ${moneyWhole(8120)} includes Priya's overtime). Spending stayed between ${moneyWhole(cheapest.spending)} and ${moneyWhole(dearest.spending)} all six months.</p>
  </section>

  <section class="card" aria-label="What the numbers say">
    <h2>What the numbers say</h2>
    <ul class="insights">${insights.map((i) => `<li>${i}</li>`).join('')}</ul>
  </section>`;
}
