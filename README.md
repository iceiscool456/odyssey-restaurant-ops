# Odyssey Restaurant Ops

A fullstack restaurant operations product: a polished dashboard with a reusable design system (Part 1) backed by a real ordering system (Part 2).

Built for the Odyssey fullstack developer assignment.

## Stack

- pnpm workspace + Turborepo
- `apps/dashboard` — Expo + React Native Web (port 8081)
- `services/backend` — Hono on Cloudflare Workers via Wrangler (port 8787)
- PostgreSQL + Drizzle ORM + drizzle-zod
- OpenAPI generation → Orval-generated client/hooks → React Query
- Shared packages for UI tokens, primitives, and types

## Repo structure

```text
apps/dashboard      # Expo dashboard app (web-first)
services/backend    # Hono API on Cloudflare Workers
packages/shared     # Design tokens, UI primitives, utilities
packages/types      # Shared domain types
packages/api-client # Orval-generated client + React Query hooks
```

## Architecture

```text
Drizzle schema → drizzle-zod → Hono OpenAPI → Orval → generated frontend hooks
```

Persisted data truth starts in the Drizzle schema. HTTP schemas are `drizzle-zod` bound to `@hono/zod-openapi`. The dashboard never hand-writes DTOs — every list, detail, and mutation uses generated React Query hooks from `@odyssey/api-client`.

- Money is integer cents end-to-end. Tax is 8.5% as `850` basis points. Client-sent totals are ignored.
- Order status is a single Postgres enum. Status changes go through `POST /orders/{id}/actions` (`accept`, `prepare`, `ready`, `complete`, `cancel`). Clients cannot patch `status`. Action buttons on a ticket are exactly the `availableActions` the API returns.
- Postgres clients are created per request. Cloudflare Workers forbid reusing sockets/streams across request handlers.
- Design tokens live in `packages/shared` (`color`, `space`, `radius`, `shadow`, `typography`, `status`). Pages compose primitives from those tokens.

## Getting started

Requires Node 20+, pnpm 11, and Postgres 17. Docker Compose is the default path.

```bash
pnpm install
cp services/backend/.dev.vars.example services/backend/.dev.vars
pnpm db:up          # Postgres 17 via Docker Compose (user/pass/db: odyssey, port 5432)
pnpm db:migrate
pnpm db:seed
pnpm dev:backend    # http://localhost:8787
pnpm dev:dashboard  # http://localhost:8081
```

If you already have Postgres locally, skip `pnpm db:up` and point `services/backend/.dev.vars` at it. The default URL is `postgres://odyssey:odyssey@localhost:5432/odyssey`.

The dashboard calls `http://localhost:8787` unless `EXPO_PUBLIC_API_URL` is set.

Other scripts:

```bash
pnpm gen:contract   # regenerate OpenAPI spec + Orval client
pnpm lint
pnpm typecheck
pnpm test           # backend domain tests (needs a seeded DB) + dashboard UI tests
```

Seeded guests and menu items use stable UUIDs (Ada Lovelace, calamari, sold-out Whole Branzino) so backend tests and a fresh UI click-through land on the same records.

## Tradeoffs

- TypeScript is pinned to 5.9 (Expo SDK 57 suggests 6.0) because typescript-eslint, Orval, and drizzle-kit are more stable on 5.x.
- The dashboard is web-first. Native iOS/Android readiness is out of scope.
- Workers use a new Postgres client per request rather than a pooled singleton.
- No Next.js, Nest, Prisma, tRPC, or Supabase — the assignment stack is the product stack.
