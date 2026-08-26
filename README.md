# Odyssey Restaurant Ops

A fullstack restaurant operations product: a polished dashboard with a reusable design system (Part 1) backed by a real ordering system (Part 2).

Built for the Odyssey fullstack developer assignment.

## Stack

- pnpm workspace + Turborepo
- `apps/dashboard` — Expo + React Native + Web
- `services/backend` — Hono on Cloudflare Workers
- PostgreSQL + Drizzle ORM + drizzle-zod
- OpenAPI generation → Orval-generated client/hooks → React Query
- Shared packages for UI, utilities, and types

## Repo structure

```text
apps/dashboard      # Expo dashboard app (web-first)
services/backend    # Hono API on Cloudflare Workers
packages/shared     # Design tokens, UI primitives, utilities
packages/types      # Shared domain types
packages/api-client # Orval-generated client + React Query hooks
```

## Architecture flow

```text
Drizzle schema -> drizzle-zod -> Hono/OpenAPI -> Orval -> generated frontend types/hooks
```

Persisted data truth starts in the Drizzle schema. API contracts are generated, never hand-duplicated. The frontend consumes generated hooks only.

## Getting started

> Filled in as milestones land. See [PLAN.md](./PLAN.md) for the roadmap.

```bash
pnpm install
pnpm dev:backend    # Hono API via Wrangler
pnpm dev:dashboard  # Expo web
pnpm gen:contract   # regenerate OpenAPI spec + Orval client
pnpm lint
pnpm typecheck
pnpm test
```

### Database

Local PostgreSQL via Docker Compose. Migration and seed instructions will land with Milestone 2.

## Architecture decisions

> Documented as they are made; summarized here at the end.

## Tradeoffs and incomplete areas

> Documented honestly at submission time.
