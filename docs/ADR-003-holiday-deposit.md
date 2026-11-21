# ADR-003 — Holiday Deposit Policy

- **Scope:** orbit-test
- **Status:** approved (approved by founder merge of this PR)
- **Supersedes:** ADR-002
- **Date:** 2026-11-21

## Context
The 30% default deposit established by ADR-002 did not address peak holiday bookings, where higher demand and last-minute cancellations increase revenue risk. A holiday-specific deposit is needed while keeping the standard default and the 24-hour free cancellation window.

## Decision
- The standard booking deposit remains **30%** (`depositPercent = 30`), unchanged from ADR-002.
- Peak holiday bookings require a **40%** deposit. This is a new policy; implementation is a separate future task and is not part of this docs-only change.
- The **24-hour free cancellation window** remains in effect.

This ADR supersedes ADR-002. ADR-001 and ADR-002 are retained for supersession provenance (**ADR-001 → ADR-002 → ADR-003**).
