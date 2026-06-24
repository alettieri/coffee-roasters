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
- `pnpm test:integration:ci` applies checked-in migrations and runs database integration tests against the PostgreSQL service supplied by CI.
- `pnpm build` builds the Nuxt application with Nitro's Cloudflare module preset.
- `pnpm check` runs formatting verification, linting, type checking, migration consistency verification, tests, and the production build.

## Local database

Local development uses Docker PostgreSQL 17, matching the project-selected Neon major version. The Docker database uses disposable local-only credentials from `docker-compose.yml`; do not copy staging or production credentials into local files.

Create a local `.env` with server-only database URLs before starting Nuxt or applying development migrations:

```sh
DATABASE_URL=postgres://coffee_roasters:coffee_roasters_local@localhost:54329/coffee_roasters_dev
MIGRATION_DATABASE_URL=postgres://coffee_roasters:coffee_roasters_local@localhost:54329/coffee_roasters_dev
```

The repository includes `.env.test` with local-only integration database URLs:

```sh
DATABASE_URL=postgres://coffee_roasters_integration:coffee_roasters_integration@localhost:54330/coffee_roasters_test
MIGRATION_DATABASE_URL=postgres://coffee_roasters_integration:coffee_roasters_integration@localhost:54330/coffee_roasters_test
```

Database commands:

- `pnpm db:start` starts local PostgreSQL and waits for its healthcheck.
- `pnpm db:stop` stops local PostgreSQL without deleting the named volume.
- `pnpm db:migrate` applies checked-in Drizzle migrations using `MIGRATION_DATABASE_URL`.
- `pnpm db:reset` deletes the local PostgreSQL volume, waits for the recreated container, and applies migrations.
- `pnpm db:integration:start` starts an ephemeral integration-test PostgreSQL container and waits for its healthcheck.
- `pnpm db:integration:stop` stops the integration-test PostgreSQL container and deletes its volume.
- `pnpm db:integration:reset` recreates the integration-test PostgreSQL container from an empty volume.
- `pnpm db:migrate:integration` applies checked-in Drizzle migrations to the integration-test database using `.env.test`.
- `pnpm db:generate` generates reviewable Drizzle migrations from `server/platform/database/schema.ts`.
- `pnpm db:migrations:check` verifies that `server/platform/database/schema.ts` and checked-in Drizzle migrations are consistent.
- `pnpm test:integration` resets the ephemeral integration database, applies migrations, and verifies database health, writes, reads, transactions, and cleanup against `coffee_roasters_test`.

Schema push and synchronization commands are intentionally not part of the workflow.

## Continuous integration

GitHub Actions runs credential-free CI for pull requests targeting `main` and pushes to `main`. Repository rules should require these exact check names:

- `Verify` installs with the pinned Node.js and pnpm versions, verifies Prettier formatting, runs Nuxt ESLint, runs strict Nuxt type checking, runs Vitest unit tests, verifies Drizzle migration consistency, applies checked-in migrations to an isolated PostgreSQL service, and runs database integration tests.
- `Build` installs with the pinned Node.js and pnpm versions and runs the Nuxt production build.

The workflow does not use `pull_request_target`, GitHub environments, deployment credentials, or Cloudflare, Neon, Resend, Sentry, production, or staging secrets. The pnpm store cache is keyed by `pnpm-lock.yaml`; `node_modules` is not cached.

Dependabot security updates and repository ruleset setup remain human-owned repository configuration tracked by GitHub issue #18.

## Before contributing

Read:

1. `AGENTS.md`
2. `docs/agents/operating-contract.md`
3. `CONTEXT.md`
4. the assigned GitHub issue
5. the relevant accepted ADRs from `docs/adr/README.md`

The authoritative repository commands will be established by the foundation issues. Do not invent alternate package-manager, migration, or deployment workflows.
