# ADR 0016: Use GitHub Actions for CI

Date: June 20, 2026

## Status

Accepted

## Context

The application requires TypeScript checks, Vitest tests, reviewed Drizzle migrations, Nitro Cloudflare Pages builds, production-representative runtime verification, and Playwright acceptance tests. Production delivery is handled by Cloudflare Pages Git integration rather than a GitHub-hosted deployment job.

The repository and issue tracker are hosted on GitHub.

## Decision

Use GitHub Actions for continuous integration.

Pull request workflows will:

- install dependencies using the pinned Node.js and pnpm versions;
- verify lockfile consistency;
- run Prettier formatting verification;
- run the official Nuxt ESLint checks;
- run strict TypeScript checking through `nuxt typecheck`;
- run Vitest tests;
- verify that Drizzle schema changes include consistent, reviewable migrations;
- build the application through Nitro's Cloudflare Pages preset;
- use a disposable PostgreSQL service and local service substitutes;
- declare minimum job permissions, timeouts, and concurrency cancellation;
- pin third-party actions to full commit SHAs; and
- upload useful test and build artifacts without exposing secrets or private data.

Pull request CI will not require Neon, R2, Resend, Sentry, or Cloudflare deployment credentials.

Runtime workflows will run local `workerd` acceptance tests for main-branch or relevant runtime changes. Provider-sensitive acceptance will use the shared staging environment only after its infrastructure exists.

Cloudflare Pages Git integration will handle deployment, preview branching, production promotion, and rollback. Branch control can pause automatic production or preview deployments without changing the repository.

Production secrets must not be available to pull requests from untrusted forks.

## Consequences

- CI definitions remain versioned with the application.
- Pull requests receive credential-free static, unit, integration, and build checks.
- Runtime and provider compatibility are verified in separate bounded workflows.
- Workflow duration and service usage must be controlled through caching and appropriately scoped test suites.
- Database migrations require forward-compatible deployment discipline.
- GitHub Actions stays out of the deployment credential path.
