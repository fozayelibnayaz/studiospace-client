/**
 * Currency helpers — StudioSpace is Bangladesh-first, so every money value
 * is BDT and rendered with the taka sign (৳). Number grouping stays Latin
 * ("en-BD") so prices read the same in spreadsheets and invoices.
 */
const WHOLE = new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 });
const CENTS = new Intl.NumberFormat("en-BD", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** ৳4,500 or ৳4,500.50. Pass { decimals: true } for receipts/totals. */
export function bdt(amount, { decimals = false } = {}) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "৳0";

  const needsCents = decimals && Math.round(value * 100) % 100 !== 0;
  return `৳${needsCents ? CENTS.format(value) : WHOLE.format(value)}`;
}

/** "৳4,500 / hr" — the rate label used on cards, modals and details. */
export function bdtRate(amount) {
  return `${bdt(amount)} / hr`;
}

/**
 * Plain-text money for jsPDF: the built-in Helvetica font has no Bengali
 * glyph for ৳, so PDFs use the ISO code instead of a broken character.
 */
export function bdtPdf(amount) {
  const value = Number(amount);
  return `BDT ${(Number.isFinite(value) ? value : 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
