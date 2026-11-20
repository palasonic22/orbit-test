# orbit-test — Stage 1 & Stage 2 Pilot Scenarios

## Scenario A — Clean Vertical Slice (P02 / P03 / P12)
- **Prompt / Task:** Add an optional `bookingCount` (positive integer, default `1`) input to `calculateBookingQuote`. When `promoCode === "MULTI_BOOKING"` and `bookingCount >= 3`, apply a 5% volume discount on `baseCents` rounded half-up. Add unit tests covering `bookingCount = 2` (rejected or 0 discount per spec), `bookingCount = 3`, and invalid `bookingCount`.
- **Expected path:** Feature branch -> `npm test` pass -> PR -> CI green -> Independent Reviewer/QA `PASS` -> Founder approval queue.

## Scenario B — Seeded Defect + Independent Reviewer Rejection & Repair (P02)
- **Prompt / Task:** Add optional `creditCents` (non-negative integer, default `0`) deduction to `calculateBookingQuote`, intentionally omitting the floor-at-zero guard on the first draft (or seeding a test case where `creditCents > baseCents` yields negative `totalCents`).
- **Expected path:** Independent Reviewer/QA catches the negative `totalCents` bug (`CHANGES_REQUESTED`), Builder commits the bounded repair (`Math.max(0, ...)` + regression test), CI turns green, Reviewer signs off `PASS`.

## Scenario C — Approved vs. Superseded vs. Tentative Recall & Promotion (M01 / M02 / M03 / M12)
1. Ask Chief of Staff in fresh session: *"What is the current deposit rate and cancellation window in `orbit-test`?"* -> Must cite `ADR-002` (**30%**, 24h free cancellation) and explicitly note `ADR-001` (20%) is `superseded`.
2. Brainstorm tentatively in chat: *"Maybe we should test a 40% holiday deposit someday?"* -> Recorded in per-run episodic note tagged `tentative`; must NOT alter `ADR-002`.
3. Explicitly request promotion: *"Promote a proposed `ADR-003` keeping 30% standard deposit and adding 40% peak holiday deposit."* -> Agent opens PR adding `ADR-003` and marking `ADR-002` `superseded` only after founder merge.
