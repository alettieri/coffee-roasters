# ADR 0013: Use Vitest and Playwright

Date: June 19, 2026

## Status

Accepted

## Context

The PRD calls for tests at user-visible behavior seams, including unauthenticated Public Discovery, inclusion boundaries, private Journal ownership, repeat Visits, required Roaster Locations, Visit Photo privacy and metadata removal, Suggestions, and administrative review.

The application runs on Cloudflare Workers through Nitro's Cloudflare Workers preset. Tests that execute only in Nuxt's standard development environment cannot verify production runtime compatibility.

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
- registration, sign-in, and account recovery;
- private Journal and Visit ownership boundaries;
- creation of Visits with required Coffee Roaster, Roaster Location, and Visit Date;
- Visit Photo upload, display, caption, cover selection, and deletion;
- Suggestion submission and separation from published Curated Roaster Data; and
- protected admin review and publication workflows.

Production-representative integration and acceptance tests must run against the Cloudflare `workerd` preview produced from the Nitro Cloudflare Workers build. Nuxt's standard development server may be used for fast local feedback but is not sufficient for release verification.

Tests will use isolated database state and private object-storage fixtures. Critical privacy tests must verify access denial across different Local Coffee Lover accounts.

## Consequences

- Fast tests and user-visible acceptance tests have distinct responsibilities.
- Browser tests verify real navigation, cookies, rendering, and authorization boundaries.
- Cloudflare runtime incompatibilities can be detected before deployment.
- End-to-end environments require coordinated Neon, R2, Better Auth, Resend, and Cloudflare configuration or suitable test substitutes.
- Browser suites will be slower and more operationally complex than unit tests, so they should focus on critical product seams rather than duplicate every validation case.
- Test data cleanup and isolation are mandatory to avoid false privacy results.
