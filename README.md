# Coffee Roaster Discovery

A California-focused Coffee Roaster discovery product with a private Journal for in-person Visits.

## Current state

The repository is in foundation setup. Product behavior is defined in `docs/coffee-roaster-discovery-v1-prd.md`; active technology decisions are indexed in `docs/adr/README.md`; implementation work is tracked in GitHub Issues.

## Foundation stack

- Vue 3, Nuxt 4, Nitro, and strict TypeScript 6
- pnpm 11 through Corepack
- Nuxt ESLint, ESLint 10, Prettier 3, Vitest 4, and Wrangler 4
- PostgreSQL through Drizzle ORM
- Docker PostgreSQL locally and Neon when deployed
- Cloudflare Workers, Hyperdrive, R2, Images, Queues, and Cron Triggers
- Better Auth, Resend, Sentry, Vitest, Playwright, and GitHub Actions

## Repository commands

- `pnpm dev` starts the local Nuxt development server.
- `pnpm format` applies Prettier formatting.
- `pnpm format:check` verifies formatting.
- `pnpm lint` runs Nuxt ESLint.
- `pnpm typecheck` runs Nuxt's strict TypeScript check.
- `pnpm test` runs the unit Vitest suite.
- `pnpm test:unit` runs unit tests only.
- `pnpm test:integration` runs database integration tests against local PostgreSQL.
- `pnpm build` builds the Nuxt application with Nitro's Cloudflare module preset.
- `pnpm check` runs formatting verification, linting, type checking, and tests.

## Local database

Local development uses Docker PostgreSQL 17, matching the project-selected Neon major version. The Docker database uses disposable local-only credentials from `docker-compose.yml`; do not copy staging or production credentials into local files.

Create a local `.env` with server-only database URLs before starting Nuxt or applying migrations:

```sh
DATABASE_URL=postgres://coffee_roasters:coffee_roasters_local@localhost:54329/coffee_roasters_dev
MIGRATION_DATABASE_URL=postgres://coffee_roasters:coffee_roasters_local@localhost:54329/coffee_roasters_dev
TEST_DATABASE_URL=postgres://coffee_roasters:coffee_roasters_local@localhost:54329/coffee_roasters_test
```

Database commands:

- `pnpm db:start` starts local PostgreSQL and waits for its healthcheck.
- `pnpm db:stop` stops local PostgreSQL without deleting the named volume.
- `pnpm db:migrate` applies checked-in Drizzle migrations using `MIGRATION_DATABASE_URL`.
- `pnpm db:reset` deletes the local PostgreSQL volume, waits for the recreated container, and applies migrations.
- `pnpm db:generate` generates reviewable Drizzle migrations from `server/platform/database/schema.ts`.
- `pnpm test:integration` verifies database health, writes, reads, transactions, and cleanup against `coffee_roasters_test`.

Schema push and synchronization commands are intentionally not part of the workflow.

## Before contributing

Read:

1. `AGENTS.md`
2. `docs/agents/operating-contract.md`
3. `CONTEXT.md`
4. the assigned GitHub issue
5. the relevant accepted ADRs from `docs/adr/README.md`

The authoritative repository commands will be established by the foundation issues. Do not invent alternate package-manager, migration, or deployment workflows.
