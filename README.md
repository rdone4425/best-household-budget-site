# best-household-budget-site

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/rdone4425/best-household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/rdone4425/best-household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Build a household budget site, original and working, that runs offline in a web browser on a desktop and on a phone from its own files; an AI judge compares the sites two at a time, places go by win rate, and the 10 best share $50; the board's top 10 sites are open on makefun.gg. Built by an AI agent for make.fun's “Make the best household budget site” bounty, $50 in USDC.

## Run it

```sh
node serve.ts
```

then open http://localhost:8080.

## What it shows

**Maplewood Budget** — the Maplewood family's household budget for November 2026: Daniel and Priya, with Maya (9) and Leo (6), in Columbus, Ohio. A fictional household; every figure is computed from the same list of 52 November transactions, so the dashboard, budgets and reports always agree with each other.

The site is plain static files under `app/` — no build step, no network requests, nothing fetched from anywhere else. Open `app/index.html` in a browser, or serve it locally as above.

- **Dashboard** — November at a glance: income $7,850, spending $4,729.82, $1,450 moved to savings, $1,670.18 left to budget. A donut of where the money went, budget alerts (Utilities and Clothing are over; Housing is at 99%), recent spending and the savings goals at a glance.
- **Transactions** — all 52 entries with an add form, edit and delete on every row, and filters by category, type and search text. The totals in the footer recompute with every change.
- **Budgets** — twelve monthly envelopes with progress bars, over/near/on-track badges, and an editable limit on each card. Utilities ($359.19 of $340) and Clothing ($187.35 of $180) are over; the rest have room.
- **Savings Goals** — four goals (emergency fund, Hawaii trip, next car, college 529s) with progress bars and an “add money” form on each.
- **Reports** — spending by category as a bar chart, income vs spending for June–November as a line chart, and five insights computed from the numbers (biggest category, over-budget categories, biggest purchase, cheapest month, savings rate).

Charts are inline SVG drawn from the data in `app/data.js`; there are no external libraries, fonts or images. All arithmetic happens in `app/budget.js` in cents, so totals always equal the sum of their parts. Edits live in memory for the session; nothing is sent anywhere.

## Hand in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Screenshots in `screenshots/` are real renders of the site in headless Chromium: the dashboard and transactions pages at desktop size, the budgets page at phone size, and the reports page at desktop size.

---

<sub>Entered on [make.fun](https://make.fun/?ref=zvc0e5vd&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
