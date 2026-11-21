import test from "node:test";
import assert from "node:assert/strict";
import { formatQuote } from "../src/format.mjs";
import { calculateBookingQuote } from "../src/pricing.mjs";

test("formats normal quote values", () => {
  const quote = { totalCents: 8500, depositCents: 2550, balanceCents: 5950 };
  assert.equal(formatQuote(quote), "Total: $85.00 | Deposit: $25.50 | Balance: $59.50");
});

test("formats all-zero quote values", () => {
  const quote = { totalCents: 0, depositCents: 0, balanceCents: 0 };
  assert.equal(formatQuote(quote), "Total: $0.00 | Deposit: $0.00 | Balance: $0.00");
});

test("pads cents below one dollar to two decimals", () => {
  const quote = { totalCents: 5, depositCents: 50, balanceCents: 105 };
  assert.equal(formatQuote(quote), "Total: $0.05 | Deposit: $0.50 | Balance: $1.05");
});

test("formats a quote returned by calculateBookingQuote", () => {
  const quote = calculateBookingQuote({ baseCents: 10000, creditCents: 1500 });
  assert.equal(formatQuote(quote), "Total: $85.00 | Deposit: $25.50 | Balance: $59.50");
});

test("rejects non-object and null input", () => {
  for (const value of [null, undefined, 42, "quote", true]) {
    assert.throws(() => formatQuote(value), RangeError);
  }
});

test("rejects a missing field", () => {
  assert.throws(() => formatQuote({ depositCents: 100, balanceCents: 200 }), RangeError);
  assert.throws(() => formatQuote({ totalCents: 300, balanceCents: 200 }), RangeError);
  assert.throws(() => formatQuote({ totalCents: 300, depositCents: 100 }), RangeError);
});

test("rejects negative field values", () => {
  assert.throws(
    () => formatQuote({ totalCents: -1, depositCents: 0, balanceCents: 0 }),
    RangeError,
  );
  assert.throws(
    () => formatQuote({ totalCents: 100, depositCents: -1, balanceCents: 101 }),
    RangeError,
  );
  assert.throws(
    () => formatQuote({ totalCents: 100, depositCents: 0, balanceCents: -1 }),
    RangeError,
  );
});

test("rejects non-integer, numeric string, and NaN field values", () => {
  for (const bad of [12.5, "1250", Number.NaN, Infinity, -Infinity]) {
    assert.throws(
      () => formatQuote({ totalCents: bad, depositCents: 0, balanceCents: 0 }),
      RangeError,
      `expected totalCents ${String(bad)} to be rejected`,
    );
    assert.throws(
      () => formatQuote({ totalCents: 100, depositCents: bad, balanceCents: 0 }),
      RangeError,
      `expected depositCents ${String(bad)} to be rejected`,
    );
    assert.throws(
      () => formatQuote({ totalCents: 100, depositCents: 0, balanceCents: bad }),
      RangeError,
      `expected balanceCents ${String(bad)} to be rejected`,
    );
  }
});
