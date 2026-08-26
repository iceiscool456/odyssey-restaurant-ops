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

```bash
pnpm install
pnpm db:up          # starts Postgres via Docker Compose
pnpm db:migrate
pnpm db:seed
pnpm dev:backend    # Hono API via Wrangler (http://localhost:8787)
pnpm dev:dashboard  # Expo web (http://localhost:8081)
```

Other scripts:

```bash
pnpm gen:contract   # regenerate OpenAPI spec + Orval client
pnpm lint
pnpm typecheck
pnpm test
```

Copy `services/backend/.dev.vars.example` to `services/backend/.dev.vars` if it is not already present. The default URL is `postgres://odyssey:odyssey@localhost:5432/odyssey`.

## Architecture decisions

- Persisted data truth starts in Drizzle. HTTP schemas are `drizzle-zod` bound to `@hono/zod-openapi`'s Zod instance so OpenAPI names attach without rewriting tables by hand.
- Money is integer cents end-to-end.
- Order status is a single Postgres enum. Status updates will be action endpoints in M3, not a writable field.
- Postgres clients are created per request. Cloudflare Workers forbid reusing sockets/streams across request handlers.

## Tradeoffs and incomplete areas

- TypeScript is pinned to 5.9 (Expo SDK 57 suggests 6.0) because the rest of the toolchain is more stable on 5.x.
- Menu CRUD besides list/get, order APIs, CRM, and settings endpoints land in M3.
- Native app readiness is not a goal for this assignment.
