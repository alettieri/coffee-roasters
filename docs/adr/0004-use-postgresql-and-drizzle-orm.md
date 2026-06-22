# ADR 0004: Use PostgreSQL and Drizzle ORM

Date: June 19, 2026

## Status

Accepted

## Context

The product domain is relational. Coffee Roasters have Roaster Locations and Area associations; Journals contain Visits; Visits require a matching Coffee Roaster and Roaster Location; Suggestions remain separate from published Curated Roaster Data until review; and maintainer authorization and publication history must be represented reliably.

The application needs transactional writes, explicit constraints, migrations that can be reviewed, and type-safe database access from TypeScript. Agentic implementation also benefits from a consistent schema and migration workflow with little hidden behavior.

## Decision

Use PostgreSQL as the primary application database and Drizzle ORM for schema declaration, migrations, and type-safe database access.

The implementation will:

- define the database schema in TypeScript using Drizzle;
- generate and check SQL migrations into source control;
- review generated SQL before applying migrations;
- use database foreign keys, unique constraints, check constraints, and transactions where they enforce domain integrity;
- keep business operations and authorization outside the schema and route components;
- centralize reusable data access rather than scattering ad hoc queries through UI components; and
- avoid production schema changes through direct push or synchronization commands.

Domain invariants that span relationships, including ensuring a Visit's Roaster Location belongs to its Coffee Roaster, must be enforced transactionally and at the strongest practical database boundary.

## Consequences

- PostgreSQL provides a durable relational source of truth for public, private, and administrative data.
- Drizzle keeps schema and query definitions in TypeScript while preserving visibility into SQL.
- Engineers and agents need enough SQL knowledge to inspect migrations and diagnose queries.
- Drizzle permits several query styles, so repository conventions and tests must prevent inconsistent data-access patterns.
- Some complex constraints or migrations may require handwritten SQL.
- Database hosting and connection strategy remain separate decisions.
