# ADR 0016: Use GitHub Actions for CI and CD

Date: June 20, 2026

## Status

Accepted

## Context

The application requires TypeScript checks, Vitest tests, reviewed Drizzle migrations, Nitro Cloudflare Workers builds, production-representative runtime verification, and Playwright acceptance tests. Production delivery also coordinates application deployment with Neon migrations and Cloudflare resources.

The repository and issue tracker are hosted on GitHub.

## Decision

Use GitHub Actions for continuous integration and controlled deployment.

Pull request workflows will:

- install dependencies using the pinned Node.js and pnpm versions;
- verify lockfile consistency;
- run Prettier formatting verification;
- run the official Nuxt ESLint checks;
- run strict TypeScript checking through `nuxt typecheck`;
- run Vitest tests;
- verify that Drizzle schema changes include consistent, reviewable migrations;
- build the application through Nitro's Cloudflare Workers preset;
- run Playwright acceptance tests against a `workerd` preview;
- use isolated test database state and non-production R2 resources; and
- upload useful test and build artifacts without exposing secrets or private data.

Deployment workflows will:

- use GitHub environments to separate preview and production credentials;
- use least-privilege, short-lived credentials where supported;
- require all release checks to pass before production deployment;
- apply additive, backward-compatible database migrations before application code that depends on them;
- deploy breaking schema changes through explicit multi-step releases;
- deploy Workers and associated bindings through Wrangler;
- record release identifiers for Sentry and Cloudflare observability; and
- support a documented application rollback path that does not assume destructive database rollback.

Production deployment protection and whether approval is manual or automatic remain repository configuration choices. Production secrets must not be available to pull requests from untrusted forks.

## Consequences

- CI and deployment definitions remain versioned with the application.
- Pull requests receive production-runtime compatibility checks before merge.
- Preview and acceptance environments require managed Neon, R2, Better Auth, Resend, and Cloudflare test configuration.
- Workflow duration and service usage must be controlled through caching and appropriately scoped test suites.
- Database migrations require forward-compatible deployment discipline.
- GitHub Actions and repository environment configuration become part of the production delivery system.
