# ADR 0013: Use Vitest and Playwright

Date: June 19, 2026

## Status

Accepted

## Context

The PRD calls for tests at user-visible behavior seams, including unauthenticated Public Discovery, inclusion boundaries, private Journal ownership, repeat Visits, required Roaster Locations, Visit Photo privacy and metadata removal, Suggestions, and administrative review.

The application runs in Cloudflare's deployment runtime through Nitro. Tests that execute only in Nuxt's standard development environment cannot verify production runtime compatibility.

## Decision

Use Vitest for focused unit and domain tests, and Playwright for browser-based acceptance tests.

Vitest tests will cover:

- domain rules and state transitions;
- Zod boundary schemas used by Vue forms, Nitro routes, and asynchronous handlers;
- authorization policy functions;
- data mapping and query behavior where a browser adds no value; and
- Visit Photo validation and processing contracts.

Playwright tests will cover:

- indexable Public Discovery without sign-in;
- Area Roaster Lists and Roaster Profiles;
- closed-account sign-in, verification, and account recovery;
- private Journal and Visit ownership boundaries;
- creation of Visits with required Coffee Roaster, Roaster Location, and Visit Date;
- Visit Photo upload, display, caption, cover selection, and deletion;
- Suggestion submission and separation from published Curated Roaster Data; and
- protected admin review and publication workflows.

Pull requests will run formatting, linting, type checking, unit tests, local database integration tests, and the production build. Production-representative integration and acceptance tests run against a local Cloudflare `workerd` preview for main-branch or relevant runtime changes. Provider-sensitive release checks run against the shared staging environment.

Tests will use isolated database state, deterministic clocks and identifiers where needed, two-account privacy fixtures, and synthetic private object-storage fixtures. Critical privacy tests must verify access denial across different Local Coffee Lover accounts.

Cloudflare Images local emulation is not sufficient evidence for metadata removal. Release verification must inspect canonical output produced by the real staging transformation path and confirm representative EXIF and GPS metadata is absent.

## Consequences

- Fast tests and user-visible acceptance tests have distinct responsibilities.
- Browser tests verify real navigation, cookies, rendering, and authorization boundaries.
- Cloudflare runtime incompatibilities can be detected before deployment.
- Provider-sensitive acceptance requires coordinated staging Neon, R2, Better Auth, Resend, and Cloudflare configuration.
- Browser suites will be slower and more operationally complex than unit tests, so they should focus on critical product seams rather than duplicate every validation case.
- Test data cleanup and isolation are mandatory to avoid false privacy results.
