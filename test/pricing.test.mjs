import test from "node:test";
import assert from "node:assert/strict";
import { calculateBookingQuote } from "../src/pricing.mjs";

test("applies ADR-002 default 30% deposit on standard booking", () => {
  const quote = calculateBookingQuote({ baseCents: 10000 });
  assert.deepEqual(quote, {
    baseCents: 10000,
    peakSurchargeCents: 0,
    promoDiscountCents: 0,
    totalCents: 10000,
    depositPercent: 30,
    depositCents: 3000,
    balanceCents: 7000,
  });
});

test("applies 15% peak surcharge rounded half-up", () => {
  const quote = calculateBookingQuote({ baseCents: 10010, isPeak: true });
  assert.equal(quote.peakSurchargeCents, 1502);
  assert.equal(quote.totalCents, 11512);
  assert.equal(quote.depositCents, 3454);
  assert.equal(quote.balanceCents, 8058);
});

test("applies WELCOME10 10% base promo discount", () => {
  const quote = calculateBookingQuote({ baseCents: 10000, promoCode: "WELCOME10" });
  assert.equal(quote.promoDiscountCents, 1000);
  assert.equal(quote.totalCents, 9000);
  assert.equal(quote.depositCents, 2700);
  assert.equal(quote.balanceCents, 6300);
});

test("supports custom deposit percent override within 1..100", () => {
  const quote = calculateBookingQuote({ baseCents: 20000, depositPercent: 50 });
  assert.equal(quote.depositCents, 10000);
  assert.equal(quote.balanceCents, 10000);
});

test("rejects negative, non-integer, or out-of-range inputs", () => {
  assert.throws(() => calculateBookingQuote({ baseCents: -100 }), RangeError);
  assert.throws(() => calculateBookingQuote({ baseCents: 12.5 }), RangeError);
  assert.throws(() => calculateBookingQuote({ baseCents: 1000, depositPercent: 0 }), RangeError);
  assert.throws(() => calculateBookingQuote({ baseCents: 1000, depositPercent: 101 }), RangeError);
  assert.throws(() => calculateBookingQuote({ baseCents: 1000, promoCode: "INVALID" }), RangeError);
  assert.throws(() => calculateBookingQuote({ baseCents: 1000, isPeak: "yes" }), TypeError);
});
