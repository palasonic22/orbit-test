# Agent Scope Contract — orbit-test

- **Repository status:** Synthetic Stage 1–3 pilot validation fixture. Do NOT reference or probe external repos (including `orbit`, `morrow`, or `client-*`) unless explicitly authorized by task scope.
- **Required pre-edit reads:** `docs/PRD.md`, `docs/DECISIONS.md`, active `docs/ADR-*.md` records, and `package.json`.
- **Verification command:** `npm test` (must pass before opening or updating any PR).
- **Protected boundaries:**
  - Work strictly on feature branches and submit Pull Requests. Never push directly to or merge protected `main`.
  - Never commit secrets, tokens, `.env` files, or local machine paths.
  - Treat `status: superseded` ADRs as historical context only; follow the latest `status: approved` ADR.
