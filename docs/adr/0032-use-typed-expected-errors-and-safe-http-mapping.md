# ADR 0032: Use Typed Expected Errors and Safe HTTP Mapping

Date: June 20, 2026

## Status

Accepted

## Context

Application operations can fail for expected reasons such as invalid input, unauthenticated access, insufficient authorization, missing records, conflicting state, or domain-rule violations. Other failures—database outages, provider errors, programming defects, and violated assumptions—are unexpected and require operational attention.

Treating every failure as an exception obscures normal control flow. Returning arbitrary messages from database or provider errors risks exposing implementation and private information to Local Coffee Lovers.

## Decision

Represent expected application failures as typed result errors returned by modular application operations.

Expected error categories will include:

- validation failure;
- unauthenticated;
- forbidden;
- not found;
- conflict or stale state;
- rate limited; and
- domain-rule violation.

Each expected error will contain a stable machine-readable code and only the safe, bounded context required by its caller. Operation-specific errors may refine these categories without exposing persistence or provider details.

Nitro server routes will:

- map expected errors to consistent HTTP status codes and response envelopes;
- map validation errors to safe field-level feedback where applicable;
- avoid returning stack traces, SQL details, provider payloads, internal identifiers, or private records;
- distinguish authentication failure from authorization failure without enabling account enumeration; and
- preserve stable error codes independently of presentation copy.

Unexpected failures will:

- throw or propagate as exceptions;
- be captured by Sentry under ADR 0015;
- return a generic server-error response with a correlation identifier where useful; and
- never be converted into a successful or expected domain result merely to suppress an alert.

Vue forms and composables will map stable safe error codes and field errors to accessible user feedback. They must not parse arbitrary exception messages.

## Consequences

- Expected failures remain explicit in operation signatures and tests.
- HTTP and Vue presentation concerns remain outside domain operations.
- Unexpected defects remain visible to observability systems.
- Error unions and route mappings require maintenance as operations evolve.
- Stable error codes become an internal compatibility surface.
- Logging and Sentry sanitization remain necessary because safe client responses do not automatically make server diagnostics private.
