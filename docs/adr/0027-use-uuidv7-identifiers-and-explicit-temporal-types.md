# ADR 0027: Use UUIDv7 Identifiers and Explicit Temporal Types

Date: June 20, 2026

## Status

Accepted

## Context

The application creates records across HTTP requests, queue consumers, scheduled jobs, bootstrap commands, and administrative workflows. Identifiers should be globally unique without requiring a database round trip and should not expose record counts.

The domain distinguishes a Visit Date—the calendar day on which an in-person Visit occurred—from system events such as record creation, publication, upload completion, and deletion. Treating both as generic timestamps would create avoidable timezone ambiguity.

Public URLs also need stable, readable names without coupling URL structure to database identifiers.

## Decision

Use UUIDv7 values as primary identifiers for application-owned records.

The implementation will:

- generate UUIDv7 identifiers in application code before persistence;
- store them in PostgreSQL's native `uuid` type;
- avoid sequential integer identifiers for externally reachable domain records;
- use PostgreSQL `date` for Visit Date and other true calendar-day concepts;
- use PostgreSQL `timestamptz` for system events and processing state transitions;
- write and compare system timestamps as UTC instants;
- localize system timestamps only at presentation boundaries;
- avoid converting a Visit Date through JavaScript `Date` or a timezone;
- use separate unique slugs for public Area and Roaster Profile URLs; and
- treat slug changes as explicit application operations with collision handling.

Database-managed authentication tables may retain identifier conventions required by Better Auth unless compatibility and migration testing support using the application convention.

## Consequences

- Identifiers can be generated consistently across synchronous and asynchronous workflows.
- UUIDv7 provides approximate creation ordering and generally better index locality than fully random UUIDv4 values.
- Identifiers remain opaque and do not reveal table cardinality.
- A Visit Date remains stable regardless of the Local Coffee Lover's or server's timezone.
- Application code must use a UUIDv7 implementation compatible with both Node.js development and Cloudflare Workers.
- Human-readable URLs require separate slug indexes and lifecycle rules.
- Creation order must use explicit timestamps when correctness matters; UUID ordering is not a substitute for a domain timestamp.
