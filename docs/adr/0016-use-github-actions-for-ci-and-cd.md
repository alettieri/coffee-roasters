# ADR 0016: Use GitHub Actions for CI and Planned Production Deployment

Date: June 20, 2026

## Status

Accepted

## Context

The application requires TypeScript checks, Vitest tests, reviewed Drizzle migrations, Nitro Cloudflare Pages builds, production-representative runtime verification, and Playwright acceptance tests.

Issue #5 selects a production-only Cloudflare Pages deployment plan. Cloudflare Pages Git integration is not the required deployment path. Production delivery is planned from GitHub Actions after CI succeeds on `main`, using Wrangler direct upload.

The repository and issue tracker are hosted on GitHub.

## Decision

Use GitHub Actions for continuous integration and the planned production deployment coordinator.

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

Runtime workflows will run local `workerd` acceptance tests for main-branch or relevant runtime changes. Provider-sensitive checks are human-gated until the production deployment path and required provider resources exist.

The planned production deployment workflow will:

- run only after required CI succeeds on `main`;
- use the pinned Node.js, pnpm, Nuxt, Nitro, and Wrangler versions;
- run checked-in Drizzle migrations against Neon through a direct production migration credential before build or upload;
- fail closed when migrations fail, preventing the build and Pages upload;
- run `pnpm build`, producing the Cloudflare Pages output in `dist/`;
- upload with Wrangler direct upload using a command shaped like `pnpm exec wrangler pages deploy dist/ --project-name <production-pages-project> --branch main --commit-hash "$APP_RELEASE"`;
- set or pass a release identifier derived from the GitHub commit SHA for application observability, smoke tests, and rollback records;
- run production smoke tests after upload without using private production data; and
- avoid writing secrets or private application data to logs, caches, test artifacts, or build artifacts.

Production runtime traffic will use the production Hyperdrive binding and a least-privilege application database role. The direct Neon migration credential is available only to the migration job step and is not available to Pages runtime code.

The required production variable, secret, binding, release identifier, and smoke-test URL names are the no-values contract documented in ADR 0022 and `docs/infrastructure-bootstrap-checklist.md`.

Production secrets must not be available to pull requests from untrusted forks. Preview deployments and preview credentials are future optional infrastructure, not part of the required delivery path.

## Consequences

- CI definitions remain versioned with the application.
- Pull requests receive credential-free static, unit, integration, and build checks.
- Runtime and provider compatibility are verified in separate bounded workflows.
- Workflow duration and service usage must be controlled through caching and appropriately scoped test suites.
- Database migrations require forward-compatible deployment discipline.
- GitHub Actions will eventually hold production deployment credentials, so the deployment job must use a protected production environment, least-privilege permissions, concurrency, timeouts, and pinned third-party actions.
- No actual deployment workflow, GitHub environment, secret, or external resource is created by this ADR.
