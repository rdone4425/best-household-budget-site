// Maplewood Budget — app shell.
//
// Hash routes: #/ dashboard, #/transactions, #/budgets, #/goals,
// #/reports. State (transactions, goals, limits) lives in memory for
// the session: edits re-render every page from the same numbers, and
// nothing is sent anywhere — the site works fully offline.

import { freshGoals, freshLimits, freshTransactions, money } from './budget.js';
import { HOUSEHOLD } from './data.js';
import { budgetsView, dashboardView, goalsView, reportsView, transactionsView } from './views.js';

const NAV = [
  { route: '', label: 'Dashboard', view: dashboardView },
  { route: 'transactions', label: 'Transactions', view: transactionsView },
  { route: 'budgets', label: 'Budgets', view: budgetsView },
  { route: 'goals', label: 'Savings Goals', view: goalsView },
  { route: 'reports', label: 'Reports', view: reportsView },
];

const state = {
  transactions: freshTransactions(),
  goals: freshGoals(),
  limits: freshLimits(),
  editingId: null,
  notice: '',
  filter: { category: '', kind: '', query: '' },
};

const app = document.getElementById('app');
const nav = document.getElementById('nav');

function routeFromHash() {
  const hash = location.hash.replace(/^#\/?/, '').split('?')[0];
  return NAV.some((n) => n.route === hash) ? hash : '';
}

function currentNav() {
  return NAV.find((n) => n.route === routeFromHash()) || NAV[0];
}

function renderNav() {
  const current = routeFromHash();
  nav.innerHTML = NAV.map(
    (n) =>
      `<a href="#/${n.route}" class="${n.route === current ? 'is-active' : ''}" ${n.route === current ? 'aria-current="page"' : ''}>${n.label}</a>`,
  ).join('');
}

function render() {
  const entry = currentNav();
  renderNav();
  app.innerHTML = entry.view(state, state.filter);
  wirePage(entry.route);
  if (state.notice) {
    flash(state.notice);
    state.notice = '';
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

/* ----- form helpers ----- */

function readNumber(input) {
  const value = Number(input.value);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function flash(message) {
  const el = document.getElementById('tx-message');
  if (el) el.textContent = message;
}

/* ----- per-page wiring ----- */

function wirePage(route) {
  if (route === 'transactions') wireTransactions();
  if (route === 'budgets') wireBudgets();
  if (route === 'goals') wireGoals();
}

function wireTransactions() {
  const form = document.getElementById('tx-form');
  const categoryInput = document.getElementById('filter-category');
  const kindInput = document.getElementById('filter-kind');
  const queryInput = document.getElementById('filter-query');

  categoryInput.addEventListener('change', () => {
    state.filter.category = categoryInput.value;
    render();
  });
  kindInput.addEventListener('change', () => {
    state.filter.kind = kindInput.value;
    render();
  });
  queryInput.addEventListener('input', () => {
    state.filter.query = queryInput.value;
    render();
    const again = document.getElementById('filter-query');
    again.focus();
    again.setSelectionRange(again.value.length, again.value.length);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const date = document.getElementById('tx-date').value;
    const desc = document.getElementById('tx-desc').value.trim();
    const category = document.getElementById('tx-category').value;
    const amount = readNumber(document.getElementById('tx-amount'));
    if (!date || !desc || amount == null) {
      flash('Fill in a date, a description and an amount over $0.');
      return;
    }
    const kind = category === 'savings' ? 'transfer' : 'expense';
    if (state.editingId != null) {
      const tx = state.transactions.find((t) => t.id === state.editingId);
      tx.date = date;
      tx.desc = desc;
      tx.category = category;
      tx.kind = kind;
      tx.amount = amount;
      state.editingId = null;
      state.notice = 'Saved — the totals already include the change.';
    } else {
      const nextId = Math.max(...state.transactions.map((t) => t.id)) + 1;
      state.transactions.push({ id: nextId, date, desc, category, kind, amount });
      state.notice = `Added ${desc} — ${money(amount)}.`;
    }
    render();
  });

  const cancel = document.getElementById('tx-cancel');
  if (cancel) {
    cancel.addEventListener('click', () => {
      state.editingId = null;
      render();
    });
  }

  app.querySelectorAll('[data-edit]').forEach((button) => {
    button.addEventListener('click', () => {
      state.editingId = Number(button.dataset.edit);
      render();
    });
  });
  app.querySelectorAll('[data-delete]').forEach((button) => {
    button.addEventListener('click', () => {
      const tx = state.transactions.find((t) => t.id === Number(button.dataset.delete));
      state.transactions = state.transactions.filter((t) => t.id !== tx.id);
      if (state.editingId === tx.id) state.editingId = null;
      state.notice = `Deleted ${tx.desc} — ${money(tx.amount)}.`;
      render();
    });
  });
}

function wireBudgets() {
  app.querySelectorAll('.limit-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = form.querySelector('input');
      const value = Number(input.value);
      if (!Number.isFinite(value) || value < 0) return;
      state.limits[form.dataset.category] = value;
      render();
    });
  });
}

function wireGoals() {
  app.querySelectorAll('.goal-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = form.querySelector('input');
      const amount = readNumber(input);
      if (amount == null) return;
      const goal = state.goals.find((g) => g.id === form.dataset.goal);
      goal.saved = Math.round((goal.saved + amount) * 100) / 100;
      render();
    });
  });
}

/* ----- boot ----- */

document.getElementById('household-name').textContent = HOUSEHOLD.name;
document.getElementById('household-month').textContent = HOUSEHOLD.month;
document.getElementById('year').textContent = String(new Date().getFullYear());
window.addEventListener('hashchange', render);
render();
