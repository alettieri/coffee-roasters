# ADR 0036: Define Environments and Deployed Database Connectivity

Date: June 21, 2026

## Status

Accepted

## Context

The application uses Docker PostgreSQL locally, Neon when deployed, and Cloudflare Pages for staging and production. The prior decisions did not specify the deployed connection path, database roles, or whether preview infrastructure was shared or created per pull request.

Runtime database connections and migrations have different security, pooling, and transaction requirements. Autonomous agents also need predictable environment names and boundaries.

## Decision

Use four environments:

- **local**: Nuxt and Cloudflare emulation with Docker PostgreSQL;
- **CI**: GitHub runner with disposable PostgreSQL and no deployment credentials;
- **staging**: one shared Cloudflare Pages preview deployment with an isolated Neon staging branch; and
- **production**: the Cloudflare Pages production deployment with the Neon production branch or project.

Do not create per-pull-request Cloudflare or Neon environments until parallel development creates a measured need.

Deployed Pages traffic will connect to Neon through a separately configured Cloudflare Hyperdrive binding for staging and production. Drizzle migrations will use a direct Neon connection outside the Pages runtime.

Database credentials will be separated:

- an application role for runtime queries and transactions;
- a migration role with schema-change permissions, available only to controlled migration workflows; and
- an optional read-only backup role if independent dumps are introduced.

The database owner credential will not be used by the application, CI test execution, or maintainer bootstrap.

The implementation will:

- place Neon and Cloudflare resources in compatible western United States regions where the providers support that choice;
- pin Docker PostgreSQL to the same major version selected in Neon;
- verify required transaction behavior through the production driver under `workerd`;
- serialize migrations so one migration job operates per environment;
- define all Cloudflare Pages environment variables, secrets, and bindings explicitly because preview and production settings are managed independently;
- use consistent resource names based on `coffee-roasters-staging` and `coffee-roasters-production`; and
- keep staging and production secrets and resources separate.

## Consequences

- Hyperdrive provides the production pooling and Pages-to-PostgreSQL connection boundary.
- Migrations remain independent from runtime credentials and pooling.
- Local `node-postgres` behavior alone cannot establish production compatibility.
- A shared staging environment is cheaper and simpler but cannot isolate simultaneous incompatible branches.
- Region selection must be confirmed when the Neon project and Cloudflare resources are created.
- If a required Drizzle or Better Auth transaction cannot operate correctly through Hyperdrive, the compatibility spike must resolve it before product implementation proceeds.
