# ADR 0005: Host PostgreSQL on Neon

Date: June 19, 2026

## Status

Accepted

## Context

ADR 0004 selected PostgreSQL and Drizzle ORM. The v1 application needs managed database hosting without taking on PostgreSQL operations. Development and agentic workflows also benefit from isolated databases for testing schema changes and migrations.

## Decision

Use Neon as the managed PostgreSQL provider.

The implementation will:

- use standard PostgreSQL features wherever practical;
- connect from server-side application code only;
- use pooled connections for application traffic when appropriate;
- use direct connections for migrations when required;
- keep credentials in environment-specific secret storage;
- use isolated Neon branches for significant schema work, previews, or automated verification when useful; and
- apply checked-in Drizzle migrations through an explicit deployment step.

Provider-specific features must not leak into core domain logic without a separate architectural decision.

## Consequences

- The project does not need to operate PostgreSQL infrastructure.
- Database branches can isolate migration work and preview environments.
- Connection limits, cold starts, pooling, and deployment-region latency must be considered.
- Local and automated tests still need a defined database strategy.
- ADR 0026 defines Docker PostgreSQL for daily local development and local integration tests.
- Moving providers should remain feasible because the application targets standard PostgreSQL.
- Neon account structure, regions, retention, and production backup settings require operational configuration outside the codebase.
