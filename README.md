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
- `pnpm test` runs the baseline Vitest suite.
- `pnpm build` builds the Nuxt application with Nitro's Cloudflare module preset.
- `pnpm check` runs formatting verification, linting, type checking, and tests.

## Before contributing

Read:

1. `AGENTS.md`
2. `docs/agents/operating-contract.md`
3. `CONTEXT.md`
4. the assigned GitHub issue
5. the relevant accepted ADRs from `docs/adr/README.md`

The authoritative repository commands will be established by the foundation issues. Do not invent alternate package-manager, migration, or deployment workflows.
