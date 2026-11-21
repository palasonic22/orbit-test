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

test("MULTI_BOOKING applies 5% base discount for bookingCount 3", () => {
  const quote = calculateBookingQuote({
    baseCents: 10000,
    promoCode: "MULTI_BOOKING",
    bookingCount: 3,
  });
  assert.equal(quote.promoDiscountCents, 500);
  assert.equal(quote.totalCents, 9500);
  assert.equal(quote.depositPercent, 30);
  assert.equal(quote.depositCents, 2850);
  assert.equal(quote.balanceCents, 6650);
});

test("MULTI_BOOKING applies zero discount for bookingCount 2", () => {
  const quote = calculateBookingQuote({
    baseCents: 10000,
    promoCode: "MULTI_BOOKING",
    bookingCount: 2,
  });
  assert.equal(quote.promoDiscountCents, 0);
  assert.equal(quote.totalCents, 10000);
});

test("MULTI_BOOKING defaults bookingCount to 1 and applies zero discount", () => {
  const quote = calculateBookingQuote({ baseCents: 10000, promoCode: "MULTI_BOOKING" });
  assert.equal(quote.promoDiscountCents, 0);
  assert.equal(quote.totalCents, 10000);
});

test("MULTI_BOOKING rounds 5% discount half-up", () => {
  const low = calculateBookingQuote({ baseCents: 10, promoCode: "MULTI_BOOKING", bookingCount: 3 });
  assert.equal(low.promoDiscountCents, 1);

  const mid = calculateBookingQuote({ baseCents: 30, promoCode: "MULTI_BOOKING", bookingCount: 3 });
  assert.equal(mid.promoDiscountCents, 2);

  const high = calculateBookingQuote({ baseCents: 1010, promoCode: "MULTI_BOOKING", bookingCount: 3 });
  assert.equal(high.promoDiscountCents, 51);
});

test("MULTI_BOOKING combines with peak surcharge without changing deposit default", () => {
  const quote = calculateBookingQuote({
    baseCents: 10010,
    promoCode: "MULTI_BOOKING",
    bookingCount: 3,
    isPeak: true,
  });
  assert.equal(quote.peakSurchargeCents, 1502);
  assert.equal(quote.promoDiscountCents, 501);
  assert.equal(quote.totalCents, 11011);
  assert.equal(quote.depositPercent, 30);
  assert.equal(quote.depositCents, 3303);
  assert.equal(quote.balanceCents, 7708);
});

test("rejects invalid bookingCount values", () => {
  for (const bookingCount of [0, -1, 1.5, "3", null, Number.NaN]) {
    assert.throws(
      () => calculateBookingQuote({ baseCents: 1000, promoCode: "MULTI_BOOKING", bookingCount }),
      RangeError,
      `expected bookingCount ${String(bookingCount)} to be rejected`,
    );
  }
});

test("bookingCount does not affect non-MULTI_BOOKING promos", () => {
  const quote = calculateBookingQuote({ baseCents: 10000, promoCode: "WELCOME10", bookingCount: 5 });
  assert.equal(quote.promoDiscountCents, 1000);
  assert.equal(quote.totalCents, 9000);
});
