// Small SVG chart builders, drawn straight from the numbers — no
// library, no images, nothing fetched. Every chart labels its own
// values so it reads even without hovering.

import { moneyWhole } from './budget.js';

/** Escape text for safe use inside SVG markup. */
function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Horizontal bars, one per item: { label, value, color }.
 * The longest bar sets the scale; each bar is labelled with its value.
 */
export function barChart(items, width, rowHeight) {
  const max = Math.max(...items.map((i) => i.value), 1);
  const labelWidth = 118;
  const valueWidth = 74;
  const barArea = width - labelWidth - valueWidth;
  const height = items.length * rowHeight + 8;
  const rows = items
    .map((item, i) => {
      const y = 8 + i * rowHeight;
      const barWidth = Math.max(2, Math.round((item.value / max) * barArea));
      const pct = Math.round((item.value / max) * 100);
      return (
        `<text x="0" y="${y + 15}" class="chart-label">${esc(item.label)}</text>` +
        `<rect x="${labelWidth}" y="${y}" width="${barWidth}" height="20" rx="4" fill="${item.color}"/>` +
        `<text x="${labelWidth + barWidth + 8}" y="${y + 15}" class="chart-value">${moneyWhole(item.value)}</text>` +
        `<title>${esc(item.label)}: ${moneyWhole(item.value)} (${pct}% of the largest)</title>`
      );
    })
    .join('');
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Bar chart of spending by category">${rows}</svg>`;
}

/**
 * Donut chart of category shares. Slices are drawn as stroke-dasharray
 * arcs on a circle; the centre names the total.
 */
export function donutChart(items, total, size) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const slices = items
    .filter((i) => i.value > 0)
    .map((item) => {
      const share = item.value / total;
      const dash = Math.max(share * circumference - 2, 0.5);
      const markup =
        `<circle cx="90" cy="90" r="${radius}" fill="none" stroke="${item.color}" stroke-width="26" ` +
        `stroke-dasharray="${dash.toFixed(1)} ${circumference.toFixed(1)}" stroke-dashoffset="${(-offset).toFixed(1)}" />` +
        `<title>${esc(item.label)}: ${moneyWhole(item.value)}</title>`;
      offset += share * circumference;
      return markup;
    })
    .join('');
  return (
    `<svg viewBox="0 0 180 180" width="${size}" height="${size}" role="img" aria-label="Donut chart of spending by category">` +
    `<circle cx="90" cy="90" r="${radius}" fill="none" stroke="#e9e2d4" stroke-width="26"/>` +
    slices +
    `<text x="90" y="84" text-anchor="middle" class="donut-total">${moneyWhole(total)}</text>` +
    `<text x="90" y="102" text-anchor="middle" class="donut-caption">spent in Nov</text>` +
    `</svg>`
  );
}

/**
 * Line chart with two series — income (green) and spending (amber) —
 * across the six months. Points are labelled so the trend reads at a
 * glance; the area under the spending line is lightly shaded.
 */
export function trendChart(months, width, height) {
  const padLeft = 56;
  const padRight = 14;
  const padTop = 16;
  const padBottom = 30;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;
  const allValues = months.flatMap((m) => [m.income, m.spending]);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const low = Math.floor((min - 400) / 500) * 500;
  const high = Math.ceil((max + 400) / 500) * 500;
  const xAt = (i) => padLeft + (i / (months.length - 1)) * plotWidth;
  const yAt = (v) => padTop + ((high - v) / (high - low)) * plotHeight;

  const grid = [low, (low + high) / 2, high].map((v) => {
    const y = yAt(v);
    return (
      `<line x1="${padLeft}" y1="${y}" x2="${width - padRight}" y2="${y}" class="grid-line"/>` +
      `<text x="${padLeft - 8}" y="${y + 4}" text-anchor="end" class="chart-label">${moneyWhole(v)}</text>`
    );
  }).join('');

  function lineFor(key, color) {
    const points = months.map((m, i) => `${xAt(i).toFixed(1)},${yAt(m[key]).toFixed(1)}`).join(' ');
    const dots = months
      .map((m, i) => `<circle cx="${xAt(i)}" cy="${yAt(m[key])}" r="4" fill="${color}"><title>${m.month}: ${moneyWhole(m[key])}</title></circle>`)
      .join('');
    return `<polyline points="${points}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>${dots}`;
  }

  const labels = months
    .map((m, i) => `<text x="${xAt(i)}" y="${height - 10}" text-anchor="middle" class="chart-label">${m.month}</text>`)
    .join('');

  const area = months
    .map((m, i) => `${xAt(i).toFixed(1)},${yAt(m.spending).toFixed(1)}`)
    .join(' ');
  const spendingArea =
    `<polygon points="${padLeft},${yAt(low)} ${area} ${xAt(months.length - 1)},${yAt(low)}" fill="#c2703d" opacity="0.08"/>`;

  return (
    `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Line chart of income versus spending, June to November">` +
    grid + spendingArea + lineFor('income', '#2e6f57') + lineFor('spending', '#c2703d') + labels +
    `<text x="${width - padRight}" y="${padTop + 2}" text-anchor="end" class="chart-label">— income &nbsp; — spending</text>` +
    `</svg>`
  );
}
