# ADR 0018: Defer Product Analytics

Date: June 20, 2026

## Status

Accepted

## Context

The initial deployed product will have one Local Coffee Lover: the product owner. A dedicated product analytics platform would add client code, event design, consent and privacy considerations, operational configuration, and another external data store without materially improving decisions during this phase.

Application errors and platform health are already covered by Sentry and Cloudflare native observability under ADR 0015.

## Decision

Do not add a product analytics or feature-flagging platform in v1.

During the single-user phase:

- evaluate behavior through direct product use;
- use privacy-safe operational telemetry only for reliability and diagnosis;
- inspect application records through the protected admin interface or controlled database queries when necessary;
- avoid implementing speculative analytics event infrastructure; and
- keep private Journal content, search text, Visit Photo details, and authentication data out of operational telemetry.

Product analytics may be reconsidered when additional Local Coffee Lovers are invited and there is a concrete measurement question that cannot be answered through direct observation.

## Consequences

- V1 has fewer dependencies, scripts, cookies, and privacy surfaces.
- There is no funnel, retention, or feature-usage dashboard.
- Historical product events will not exist for the period before analytics is introduced.
- Future analytics adoption should begin from explicit product questions and a privacy-reviewed event vocabulary rather than broad automatic capture.
