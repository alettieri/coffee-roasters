# ADR 0028: Define Deletion, Archival, and Retention by Data Category

Date: June 20, 2026

## Status

Accepted

## Context

The application stores private Journal data, private Visit Photos in R2, public Curated Roaster Data, Suggestions, authentication records, and administrative publication history. These categories have different deletion and audit requirements.

PostgreSQL and R2 cannot participate in one atomic transaction. Deletion workflows must therefore remain correct when database and object-storage operations partially fail.

## Decision

Apply deletion and retention rules by data category.

### Private Journal data

- A deleted Visit becomes inaccessible to the Local Coffee Lover immediately.
- Deleting a Visit schedules permanent deletion of its Visit Photos and associated private Journal records.
- A deleted Visit Photo becomes inaccessible immediately and its canonical and quarantine objects are scheduled for R2 deletion.
- Object deletion is idempotent and retryable.
- Cleanup jobs reconcile pending deletions and unreferenced objects.
- Private content must not remain in application logs, analytics, or observability systems.

### Account deletion

- Account deletion is an explicit destructive workflow requiring recent authentication and confirmation.
- Sessions are revoked immediately.
- The Journal, Visits, Visit Photos, Photo Captions, and other private account-owned content are permanently deleted.
- R2 deletion continues asynchronously when necessary, with tracked retry state.
- Minimal security or operational records may be retained only when required and must not contain private Journal content.

### Curated Roaster Data

- Published Coffee Roasters, Areas, Roaster Locations, Public Signals, and Roast Quality Signals are archived rather than physically deleted.
- Archived records are excluded from Public Discovery but remain available to authorized maintainers.
- Existing internal references and publication history remain intact.
- Merging duplicate records is an explicit administrative operation rather than deletion.

### Suggestions and administrative history

- Suggestions and their review outcomes are retained for audit.
- Maintainer publication actions retain actor, action, affected record, and timestamp.
- Internal source and verification notes remain private.
- Retention policy may be revisited if legal or operational requirements emerge.

### Authentication data

- Disabling or deleting an account revokes active sessions immediately.
- Expired sessions and verification or recovery tokens are removed through scheduled cleanup.
- Authentication retention must remain compatible with Better Auth's integrity requirements.

Hard deletion must not be used to conceal or rewrite curation history. Archival must not be used to prevent a Local Coffee Lover from permanently deleting private Journal data.

## Consequences

- Private data can be permanently removed while public curation remains auditable.
- User-visible deletion may complete before physical R2 cleanup.
- Database records need explicit archived, deletion-pending, or processing states where appropriate.
- Cleanup and reconciliation jobs become critical privacy infrastructure.
- Administrative interfaces must distinguish archive, merge, disable, and permanent delete actions.
- Backup retention may temporarily preserve deleted database data outside the live application; provider retention and restoration access require operational controls and documentation.
