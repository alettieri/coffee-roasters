# ADR 0013: Use Vitest and Playwright

Date: June 19, 2026

## Status

Accepted

## Context

The PRD calls for tests at user-visible behavior seams, including
unauthenticated public Roaster Catalog browsing, admin Roaster curation,
private `My Roasters` ownership, repeat Visits, private Visit Ratings, and
archive behavior.

The application runs in Cloudflare's deployment runtime through Nitro. Tests
that execute only in Nuxt's standard development environment cannot verify
production runtime compatibility.

## Decision

Use Vitest for focused unit and domain tests, and Playwright for browser-based
acceptance tests.

Vitest tests will cover:

- domain rules and state transitions;
- Zod boundary schemas used by Vue forms and Nitro routes;
- authorization policy functions;
- private tracking and Visit ownership contracts; and
- data mapping and query behavior where a browser adds no value.

Playwright tests will cover:

- public Roaster Catalog browsing without sign-in;
- Roaster Profiles;
- magic-link sign-in and sign-out;
- private `My Roasters` and Visit ownership boundaries;
- creation of repeat Visits with Visit Date, context, rating, and notes;
- derived `Want to try` and `Tried` status; and
- protected admin Roaster curation workflows.

Pull requests will run formatting, linting, type checking, unit tests, local
database integration tests, and the production build. Production-representative
integration and acceptance tests run against a local Cloudflare `workerd`
preview for main-branch or relevant runtime changes. Provider-sensitive release
checks are human-gated against the production deployment path or a separately
authorized preview environment.

Tests will use isolated database state, deterministic clocks and identifiers
where needed, two-account privacy fixtures, and synthetic security fixtures.
Critical privacy tests must verify access denial across different Coffee Lover
accounts.

Provider-sensitive acceptance should remain bounded and human-gated.

## Consequences

- Fast tests and user-visible acceptance tests have distinct responsibilities.
- Browser tests verify real navigation, cookies, rendering, and authorization
  boundaries.
- Cloudflare runtime incompatibilities can be detected before deployment.
- Provider-sensitive acceptance requires coordinated production or separately
  authorized preview Neon, Better Auth, Resend, and Cloudflare configuration.
- Browser suites will be slower and more operationally complex than unit tests,
  so they should focus on critical product seams rather than duplicate every
  validation case.
- Test data cleanup and isolation are mandatory to avoid false privacy results.
