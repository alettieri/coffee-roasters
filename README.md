# Coffee Roaster Discovery

A California-focused Coffee Roaster discovery product with a private Journal for in-person Visits.

## Current state

The repository is in foundation setup. Product behavior is defined in `docs/coffee-roaster-discovery-v1-prd.md`; active technology decisions are indexed in `docs/adr/README.md`; implementation work is tracked in GitHub Issues.

## Planned stack

- Vue, Nuxt, Nitro, and strict TypeScript
- PostgreSQL through Drizzle ORM
- Docker PostgreSQL locally and Neon when deployed
- Cloudflare Workers, Hyperdrive, R2, Images, Queues, and Cron Triggers
- Better Auth, Resend, Sentry, Vitest, Playwright, and GitHub Actions

## Before contributing

Read:

1. `AGENTS.md`
2. `docs/agents/operating-contract.md`
3. `CONTEXT.md`
4. the assigned GitHub issue
5. the relevant accepted ADRs from `docs/adr/README.md`

The authoritative repository commands will be established by the foundation issues. Do not invent alternate package-manager, migration, or deployment workflows.
