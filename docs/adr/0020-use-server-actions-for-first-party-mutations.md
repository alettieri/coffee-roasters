# ADR 0020: Use Server Actions for First-Party Mutations

Date: June 20, 2026

## Status

Superseded by ADR 0024

## Context

The product is a single Next.js full-stack application with no concrete second client. Most mutations originate from first-party forms in the Journal, Suggestions, and protected admin interface.

Building an internal REST or GraphQL API for every operation would add transport contracts and duplicated validation without serving another client. Some workflows still require HTTP-specific behavior, including Better Auth handlers, presigned upload coordination, external callbacks, and service webhooks.

## Decision

Use Next.js Server Actions as the primary transport adapter for first-party form mutations.

Use route handlers for:

- Better Auth endpoints;
- Visit Photo upload authorization and completion;
- callbacks and webhooks from external services;
- health or integration endpoints that require HTTP semantics; and
- future explicitly versioned API operations when a concrete second client exists.

Server Actions and route handlers will:

- parse untrusted input through operation-specific Zod schemas;
- establish and validate the authenticated actor when required;
- call exported modular-monolith application operations;
- map domain errors to safe form or HTTP responses;
- avoid embedding business rules, authorization policy, or direct ad hoc database queries; and
- perform framework-specific revalidation, redirects, headers, or status handling only after the application operation resolves.

Client-side calls must not be treated as trusted merely because they originate from the application UI. Every server entry point must independently validate authentication, authorization, and input.

## Consequences

- First-party forms require less transport boilerplate.
- Application operations remain reusable from Server Actions, route handlers, queue consumers, tests, and future APIs.
- The application does not expose a speculative internal public API.
- Server Actions create framework coupling at the transport layer, which is contained by thin adapters.
- HTTP-specific workflows remain explicit route handlers rather than being forced through form-action semantics.
- A future second client will require deliberate API design over the existing application operations.
