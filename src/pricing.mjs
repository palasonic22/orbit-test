/**
 * Synthetic Booking Quote & Deposit Calculator for orbit-test.
 * All monetary amounts are integer cents to avoid floating-point drift.
 */

const VALID_PROMOS = new Set(["WELCOME10", "MULTI_BOOKING"]);
const MULTI_BOOKING_THRESHOLD = 3;
const MULTI_BOOKING_PERCENT = 5;

function assertNonNegativeInteger(value, name) {
  if (!Number.isInteger(value) || value < 0) {
    throw new RangeError(`${name} must be a non-negative integer`);
  }
}

function assertPositiveInteger(value, name) {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError(`${name} must be a positive integer`);
  }
}

export function calculateBookingQuote({
  baseCents,
  depositPercent = 30,
  promoCode = null,
  isPeak = false,
  bookingCount = 1,
}) {
  assertNonNegativeInteger(baseCents, "baseCents");
  assertPositiveInteger(bookingCount, "bookingCount");

  if (!Number.isInteger(depositPercent) || depositPercent < 1 || depositPercent > 100) {
    throw new RangeError("depositPercent must be an integer between 1 and 100");
  }

  if (typeof isPeak !== "boolean") {
    throw new TypeError("isPeak must be a boolean");
  }

  if (promoCode !== null && !VALID_PROMOS.has(promoCode)) {
    throw new RangeError(`Unsupported promoCode: ${promoCode}`);
  }

  const peakSurchargeCents = isPeak ? Math.round(baseCents * 0.15) : 0;
  const promoDiscountCents =
    promoCode === "WELCOME10"
      ? Math.round(baseCents * 0.1)
      : promoCode === "MULTI_BOOKING" && bookingCount >= MULTI_BOOKING_THRESHOLD
        ? Math.round((baseCents * MULTI_BOOKING_PERCENT) / 100)
        : 0;
  const totalCents = baseCents + peakSurchargeCents - promoDiscountCents;
  const depositCents = Math.round((totalCents * depositPercent) / 100);
  const balanceCents = totalCents - depositCents;

  return {
    baseCents,
    peakSurchargeCents,
    promoDiscountCents,
    totalCents,
    depositPercent,
    depositCents,
    balanceCents,
  };
}
