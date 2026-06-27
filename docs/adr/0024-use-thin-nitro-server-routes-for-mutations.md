# ADR 0024: Use Thin Nitro Server Routes for Mutations

Date: June 20, 2026

## Status

Accepted

## Context

ADR 0020 selected Next.js Server Actions for first-party mutations. Nuxt does not use that transport model.

The product remains a single full-stack application without a concrete second client. It should avoid a speculative public REST API while keeping mutations available to Vue forms, queue consumers, tests, and future transports.

## Decision

Use thin Nitro server routes as transport adapters for first-party queries and mutations that require server execution.

Nitro server routes will:

- parse untrusted input through H3 request-validation utilities and operation-specific Zod schemas;
- establish and validate the authenticated actor;
- call exported modular-monolith application operations;
- map domain errors to safe HTTP responses;
- avoid business rules, authorization policy, and ad hoc database access; and
- use HTTP semantics appropriate to the operation.

Vue composables and form components may wrap these routes for user-interface
concerns. Better Auth endpoints also use Nitro server routes.

The routes are internal first-party transports, not a committed public API. A versioned API requires a concrete external client and a separate decision.

This decision supersedes ADR 0020.

## Consequences

- Nuxt forms have an explicit, conventional server boundary.
- Application operations remain reusable from routes, queue consumers, scheduled tasks, tests, and future APIs.
- There is more HTTP transport code than with Server Actions.
- Framework coupling remains contained in thin Nitro adapters.
