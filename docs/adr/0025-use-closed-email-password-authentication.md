# ADR 0025: Use Closed Email and Password Authentication

Date: June 20, 2026

## Status

Superseded by ADR 0037

## Context

The initial deployed product will have one Local Coffee Lover: the product owner. Public Discovery remains available without authentication, while the Journal and private admin interface require a signed-in account.

Public registration, invitations, social login, and account administration would add product flows and security surface without serving an immediate user need.

## Decision

Use Better Auth with email and password as the only initial sign-in method.

The implementation will:

- disable public registration;
- require email verification before private account use;
- support password reset through Resend;
- provision the initial Local Coffee Lover and maintainer access through an explicit local CLI that invokes application operations while connecting directly to Neon with protected bootstrap input;
- make bootstrap execution idempotent and safe to rerun;
- read bootstrap credentials from protected environment input rather than source control;
- avoid logging passwords, verification tokens, recovery tokens, or session data;
- rate-limit sign-in, verification, and password-recovery endpoints; and
- store maintainer authorization in application data and enforce it server-side.

The bootstrap command must refuse unsafe production defaults, must not use the database owner credential, and must not remain an unauthenticated HTTP endpoint.

Additional accounts, invitations, public registration, passkeys, and OAuth providers require a concrete user need and a separate decision.

## Consequences

- The initial authentication interface and operational model remain small.
- Public Discovery is unaffected by closed registration.
- Losing access to the only account requires a tested recovery process.
- Initial deployment requires securely running the bootstrap command.
- Adding more Local Coffee Lovers later will require an invitation or registration workflow.
- The product does not depend on social identity providers.
