# ADR 0015: Use Sentry and Cloudflare Native Observability

Date: June 20, 2026

## Status

Accepted

## Context

The application spans Nuxt, Neon PostgreSQL, Better Auth, Resend, and planned Cloudflare services such as R2, Images, Queues, and Cron Triggers. Required production observability initially covers Pages deployment and runtime health, Sentry application errors, release identifiers, smoke tests, and database/runtime connectivity.

The product contains private Journal text, Visit Photos, authentication data, presigned object URLs, and internal curation notes. Observability must help diagnose failures without becoming another store for sensitive content.

## Decision

Use Sentry for application error reporting and performance tracing. Use Cloudflare's native logs, metrics, and platform observability for Pages deployment/runtime health. Add R2, Images, Queues, and Cron telemetry when those product slices provision the resources.

The implementation will:

- capture unhandled browser and server-side application errors in Sentry;
- add explicit error reporting around critical authentication, database, email, and administrative workflows;
- correlate application errors with Cloudflare request identifiers where practical;
- monitor platform errors and latency through Cloudflare telemetry;
- use environment and release identifiers to distinguish local, CI, optional preview, and production events;
- configure source maps securely for actionable stack traces;
- sample performance traces to control cost and data volume; and
- define required production alerts for failed smoke tests, elevated server errors, sustained authentication failures, database/runtime health failures, and Pages deployment or runtime failures.

R2, Images, Queues, Cron, Visit Photo processing, queue backlog, dead-letter handling, and scheduled cleanup observability are deferred until those product slices require their Cloudflare bindings.

Telemetry must not include:

- passwords, auth tokens, session cookies, verification or recovery tokens;
- presigned R2 URLs or storage credentials;
- Visit notes, personal impressions, Photo Captions, or private image bytes;
- internal curation source or verification notes;
- raw request bodies from private or authentication operations; or
- unnecessary Local Coffee Lover identifiers.

Sensitive fields must be removed before telemetry leaves the application. Production logging will favor structured event names, opaque record identifiers where necessary, and bounded metadata over arbitrary object serialization.

## Consequences

- Sentry provides application-level stack traces and cross-route diagnostics.
- Cloudflare telemetry provides platform-specific visibility that Sentry cannot replace.
- Some diagnostic context will exist in two systems and requires correlation conventions.
- Telemetry configuration becomes part of privacy and security review.
- Sampling and retention settings must be monitored to control cost.
- Redaction failures could expose private data, so representative automated tests and manual verification are required.
