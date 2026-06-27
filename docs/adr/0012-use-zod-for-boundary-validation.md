# ADR 0012: Use Zod for Boundary Validation

Date: June 19, 2026

## Status

Accepted

## Context

The application accepts untrusted input through authentication forms, public
catalog reads, private tracking and Visit workflows, and administrative forms.
Client-side checks improve usability but cannot establish trust. TypeScript
types do not exist at runtime.

The project needs one explicit validation approach that works in Vue forms, Nitro server routes, queue consumers, and other application boundaries without confusing input validation with authorization, domain policy, or database integrity.

## Decision

Use Zod 4 to parse and validate data at application boundaries.

The implementation will:

- define operation-specific schemas for form submissions, route bodies, query strings, route parameters, environment configuration, queue messages, webhook payloads, and external-service responses where appropriate;
- consume Zod schemas through H3's Standard Schema-compatible request-validation utilities in Nitro server routes;
- perform authoritative validation at server-side application boundaries;
- reuse compatible schemas in Vue forms for immediate feedback;
- derive TypeScript input types from schemas when useful;
- normalize values explicitly rather than relying on implicit coercion;
- return structured, field-level validation errors without exposing internal details; and
- test important acceptance and rejection boundaries.

Nuxt, Nitro, and domain modules should depend on the validation contract rather than Zod-specific internals beyond schema definition and error mapping. Standard Schema compatibility preserves the option to replace an individual validator without changing the transport architecture.

Zod will not replace:

- Better Auth session validation;
- server-side ownership and maintainer authorization;
- domain operations that evaluate cross-record rules;
- PostgreSQL foreign keys, unique constraints, check constraints, and transactions; or
- URL and free-text validation for public Roaster and private Visit fields.

## Consequences

- Runtime input handling becomes explicit and consistent.
- Vue forms, Nitro routes, and application operations can share validation vocabulary.
- Some schema duplication with Drizzle database definitions is acceptable because input contracts and persistence schemas have different responsibilities.
- Large or overly generic schemas can obscure workflow-specific rules, so schemas should remain scoped to concrete operations.
- Validation success does not imply that an operation is authorized or domain-valid.
- Regular Zod is preferred over Zod Mini or Valibot unless measured client-bundle constraints justify the additional API and migration cost.
