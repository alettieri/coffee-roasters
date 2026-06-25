# ADR 0036: Define Environments and Deployed Database Connectivity

Date: June 21, 2026

## Status

Accepted

## Context

The application uses Docker PostgreSQL locally, disposable PostgreSQL in CI, Neon when deployed, and Cloudflare Pages for production. The prior decisions did not specify the deployed connection path, database roles, or whether preview infrastructure was required.

Runtime database connections and migrations have different security, pooling, and transaction requirements. Autonomous agents also need predictable environment names and boundaries.

Issue #5 makes production the only required deployed environment. Preview or staging infrastructure may be added later, but it is optional future work and must be authorized by its own issue.

## Decision

Use three required environments:

- **local**: Nuxt and Cloudflare emulation with Docker PostgreSQL;
- **CI**: GitHub runner with disposable PostgreSQL and no deployment credentials;
- **production**: the Cloudflare Pages production deployment with the Neon production branch or project.

Do not create staging, per-pull-request, or preview Cloudflare or Neon environments until parallel development or release safety creates a measured need and a separate issue authorizes the work.

Production Pages traffic will connect to Neon through a production Cloudflare Hyperdrive binding. Drizzle migrations will use a direct Neon connection outside the Pages runtime.

Database credentials will be separated:

- a least-privilege production application role for runtime queries and transactions through Hyperdrive;
- a production migration role with schema-change permissions, available only to controlled migration workflows; and
- an optional read-only backup role if independent dumps are introduced.

The database owner credential will not be used by the application, CI test execution, or maintainer bootstrap.

The implementation will:

- place Neon and Cloudflare resources in compatible western United States regions where the providers support that choice;
- pin Docker PostgreSQL to the same major version selected in Neon;
- verify required transaction behavior through the production driver under `workerd`;
- serialize production migrations so only one production migration job operates at a time;
- run production migrations through the direct Neon migration credential before the Cloudflare Pages upload;
- block production deployment when migrations fail;
- define all production Cloudflare Pages environment variables, secrets, and bindings explicitly;
- document variable, secret, binding, and release identifier names without values;
- use consistent production resource names based on `coffee-roasters-production`; and
- keep the production migration credential unavailable to runtime code, client code, pull request workflows, logs, caches, and artifacts.

## Consequences

- Hyperdrive provides the production pooling and Pages-to-PostgreSQL connection boundary.
- Migrations remain independent from runtime credentials and pooling.
- Local `node-postgres` behavior alone cannot establish production compatibility.
- Production-only deployment reduces initial infrastructure and credential scope.
- Preview and staging remain available as future optional environments, but they are not required for the initial production deployment plan.
- Region selection must be confirmed when the Neon project and Cloudflare resources are created.
- If a required Drizzle or Better Auth transaction cannot operate correctly through Hyperdrive, the compatibility spike must resolve it before product implementation proceeds.
