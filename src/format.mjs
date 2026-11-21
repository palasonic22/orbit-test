/**
 * Human-readable formatting for booking quotes in orbit-test.
 * Accepts integer cents and renders exact dollars with two decimals.
 */

function assertNonNegativeInteger(value, name) {
  if (!Number.isInteger(value) || value < 0) {
    throw new RangeError(`${name} must be a non-negative integer`);
  }
}

function formatCents(cents) {
  const dollars = Math.floor(cents / 100);
  const remainder = String(cents % 100).padStart(2, "0");
  return `$${dollars}.${remainder}`;
}

export function formatQuote(quote) {
  if (typeof quote !== "object" || quote === null) {
    throw new RangeError("quote must be an object");
  }

  assertNonNegativeInteger(quote.totalCents, "totalCents");
  assertNonNegativeInteger(quote.depositCents, "depositCents");
  assertNonNegativeInteger(quote.balanceCents, "balanceCents");

  return `Total: ${formatCents(quote.totalCents)} | Deposit: ${formatCents(
    quote.depositCents,
  )} | Balance: ${formatCents(quote.balanceCents)}`;
}
