# Booking Quote Service — Synthetic PRD v1.0

- **Status:** `SYNTHETIC TEST FIXTURE — NOT MORROW`
- **Owner:** Orbit Pilot Validation

## Overview
A minimal integer-cents booking quote and deposit calculator (`src/pricing.mjs`) used to exercise Orbit agent workflows, GitHub PR/CI checks, and memory supersession rules without touching production software.

## Requirements
1. All currency math uses integer cents (`RangeError` on negative or non-integer amounts).
2. Default deposit percentage follows the current `approved` ADR ([`ADR-002`](./ADR-002-deposit-rate.md): **30%**).
3. Peak bookings (`isPeak: true`) add a 15% surcharge on `baseCents` rounded half-up.
4. Promo code `WELCOME10` subtracts 10% of `baseCents` rounded half-up.
5. `totalCents` must never become negative in future credit/discount extensions.
