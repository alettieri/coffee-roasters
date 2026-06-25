# ADR 0026: Use Docker PostgreSQL for Local Development

Date: June 20, 2026

## Status

Accepted

## Context

ADR 0005 selects Neon as the managed PostgreSQL provider for deployed environments. Daily development still needs a database strategy.

Using a Neon development branch would reduce local setup, but it would require network access, add latency to the inner development loop, and make disposable database tests depend on an external service. This personal project also has an explicit learning goal, making conventional local PostgreSQL operation useful experience.

## Decision

Run PostgreSQL in Docker for daily local development and local integration tests.

Use Neon for production and for temporary migration-verification or recovery branches when useful. Preview or staging branches are future optional infrastructure under ADR 0036.

The local setup will:

- pin the PostgreSQL major version to the version used by Neon;
- define PostgreSQL through a repository-owned Docker Compose configuration;
- persist ordinary development data in a named Docker volume;
- provide explicit commands to start, stop, reset, migrate, and seed the database;
- use a separate disposable database or container for automated integration tests;
- avoid storing credentials or production-derived private data in the repository;
- verify required PostgreSQL extensions in both Docker and Neon; and
- run checked-in Drizzle migrations in every environment.

Before deployment, migrations must run through the direct Neon production migration credential. For risky migrations, first verify against an isolated temporary Neon branch. Local Docker success alone is not sufficient proof of provider compatibility.

## Consequences

- Daily database work is fast and available offline.
- Local test databases can be reset cheaply and deterministically.
- Contributors must install and run Docker.
- The project must maintain Docker Compose configuration and local volumes.
- PostgreSQL version, extensions, connection behavior, and operational limits may differ from Neon.
- Release checks retain a real Neon compatibility gate.
