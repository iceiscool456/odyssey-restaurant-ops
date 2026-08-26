# Build Plan

Milestone-driven roadmap for the Odyssey assignment. One branch per milestone, merged to `main` only when lint, typecheck, and tests pass.

## M0 — Repo & workflow ✅

- GitHub repo, README skeleton, this plan, `.gitignore`.
- Working agreement: milestone branches (`m1-scaffold`, `m2-contract`, ...), green checks before merge.

## M1 — Monorepo scaffold ✅

- pnpm workspace + Turborepo with the required layout:
  `apps/dashboard` (Expo + RN Web), `services/backend` (Hono on Cloudflare Workers via Wrangler),
  `packages/shared`, `packages/types`, `packages/api-client`.
- Root scripts wired: `dev:dashboard`, `dev:backend`, `gen:contract`, `lint`, `typecheck`, `test`.
- **Exit:** both dev servers boot; a shared package import resolves across the workspace; `lint`/`typecheck` pass.
- Verified: backend `/health` + `/openapi.json` serve; Expo web renders with `@odyssey/shared` import; `gen:contract`
  produces a typed `useGetHealth` React Query hook end-to-end; lint/typecheck/test all green.
- Tradeoff: TypeScript pinned to 5.9 (Expo SDK 57 suggests 6.0) — the wider toolchain
  (typescript-eslint, Orval, drizzle-kit) is most stable on 5.x and typecheck passes cleanly.

## M2 — Data truth & contract pipeline (highest risk — done early) ✅

- Drizzle schema: menu categories, menu items, customers, orders, order items, business settings.
  Order status as a single pgEnum — the one source of truth for the status type.
- drizzle-zod → Hono `@hono/zod-openapi` → OpenAPI spec → Orval-generated client + React Query hooks in `packages/api-client`.
- Local Postgres via Docker Compose; migration + seed scripts.
- **Exit:** `pnpm gen:contract` runs the full chain; menu items round-trip DB → API → generated hook compiling in the dashboard.
- Verified: migrate + seed against Postgres; `/menu/items` and `/menu/categories` serve seeded data; generated `useListMenuItems` types the dashboard; CORS works from Expo web; per-request DB client required by Workers I/O isolation.

## M3 — Backend domain logic + tests ✅

- Endpoints: menu CRUD, customers, order create/list/filter/detail, settings read/update, Home KPIs.
- Deliberate backend behavior:
  - server-side total calculation (client totals never trusted),
  - reject invalid payloads and unavailable menu items,
  - explicit order state machine — status changes via action endpoints (accept/complete/cancel), not a writable field.
- Realistic seed data.
- **Exit:** backend tests green — valid order creation, bad payload rejected, unavailable item rejected,
  totals verified server-side, illegal transition rejected.
- Verified: 13 backend tests covering the money math, status machine, and live order API against Postgres.

## M4 — Design system + UI library route ✅

- Centralized tokens in `packages/shared`: colors, typography, spacing, radius/border/shadow/elevation, semantic states.
- Primitives: Button, Input/form controls, Select, Modal/Drawer, Card, Table/List, Badge/StatusIndicator,
  navigation, Skeleton, Toast — each with hover/focus/active/disabled states.
- `/ui-library` route showcasing tokens, typography, spacing, surfaces, and every component state.
- **Exit:** UI library renders everything on web; no hardcoded colors/spacing outside token files.
- Verified in the browser: `/ui-library` shows the token swatches, type scale, buttons (including disabled/loading),
  inputs, select menu, cards, table/empty table, badges, feedback, skeleton, modal, drawer, and toast.
  Home still uses the tokenized shell; menu load error state renders when the API is down.

## M5 — Dashboard pages wired end-to-end ✅

Build order: Menu → Orders → CRM → Settings → Home (Home consumes everything else).

- Menu: categories, items, price, availability toggle.
- Orders: list, filters, detail view, status action buttons.
- CRM: customer list, order count, spend, recent orders.
- Settings: prep time, auto-accept, service availability, opening hours.
- Home: KPIs — total orders, revenue, pending orders, popular items.
- All data via generated hooks; edit/create in modals/drawers; skeleton/empty/error states and toasts on mutations.
- **Exit:** every assessment flow works clicking through the real UI against the real backend.
- Verified: Metro compiles Home/Menu/Orders/CRM/Settings; live API covers 86 → rejected ticket, valid create with server totals, accept action, settings, and Home KPIs. Browser click-through was blocked in this session (browser tool offline); run `pnpm dev:dashboard` + `pnpm dev:backend` and click the sidebar to confirm.

## M6 — Polish, frontend tests, docs ✅

- Frontend tests: order status action visibility, form validation, key UI states.
- Visual consistency pass (web `boxShadow` tokens, per-item 86 loading, Home pending well, Settings day labels).
- README finalized: run + seed, architecture, tradeoffs.
- CI: Postgres service, migrate + seed, lint / typecheck / test.
- Verified: dashboard tests cover ticket action visibility, form validation, and query surfaces;
  `pnpm lint` / `typecheck` / `test` green; shadows use web `boxShadow` tokens.

## Scope cut lines (in order, if time runs out)

1. Native readiness (web is the requirement).
2. Loom walkthrough.
3. CRM depth (keep list + spend, cut recent-order drill-down).
