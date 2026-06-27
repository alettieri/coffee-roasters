# ADR 0006: Use Better Auth

Date: June 19, 2026

## Status

Accepted

## Context

The public Roaster Catalog is unauthenticated, while `My Roasters` and Visits
require a signed-in Coffee Lover. The private admin section additionally
requires explicit admin authorization.

The application uses Nuxt, PostgreSQL, Neon, and Drizzle ORM. Keeping authentication data in the application database provides one source of truth for identities, sessions, domain ownership, and maintainer access. The team accepts responsibility for operating authentication workflows rather than delegating them to a hosted identity platform.

## Decision

Use Better Auth for authentication and session management.

The implementation will:

- mount Better Auth through a catch-all Nitro server route and use its Vue client integration;
- store identity, account, verification, and session data in PostgreSQL using the Drizzle adapter;
- use secure HTTP-only cookies and server-validated sessions;
- associate application records with stable Better Auth user identifiers;
- enforce `My Roasters` and Visit ownership in server-side application operations;
- enforce admin authorization on every administrative operation, not only through route visibility;
- manage auth schema changes through reviewed, checked-in migrations;
- implement rate limiting and abuse controls for authentication endpoints; and
- avoid exposing authentication secrets or privileged session data to client-side code.

Initial sign-in methods, transactional email delivery, and the exact representation of maintainer roles remain separate implementation decisions.

## Consequences

- Authentication data remains in the same PostgreSQL system as application data.
- Local, preview, and automated environments can operate without a separate identity vendor.
- The project avoids a per-user hosted authentication dependency.
- The application team owns sign-in and account-management interfaces, email verification, password recovery, abuse prevention, security updates, and operational monitoring.
- Better Auth upgrades and schema changes require deliberate review.
- Authorization remains an application responsibility; authentication alone does not grant access to private tracking or admin data.
