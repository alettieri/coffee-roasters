# ADR 0028: Define Deletion, Archival, and Retention by Data Category

Date: June 20, 2026

## Status

Accepted

## Context

The application stores private Roaster Tracking State, private Visits, public
Roaster Catalog data, authentication records, and administrative publication
history. These categories have different deletion and audit requirements.

Private tracking data must be deletable without rewriting public catalog
history. Public catalog data needs archival so the Admin can preserve curation
history and avoid breaking references accidentally.

## Decision

Apply deletion and retention rules by data category.

### Private Tracking Data

- A Coffee Lover can delete a Visit.
- Deleting a Visit permanently deletes the private Visit record.
- Deleting a Visit does not delete the associated Coffee Roaster.
- Private content must not remain in application logs, analytics, or
  observability systems.
- Product analytics, if added later, must not retain private notes, Visit text,
  Visit Ratings, or derived personal preference profiles after account
  deletion.

### Account Deletion

- Account deletion is an explicit destructive workflow requiring recent
  authentication and confirmation.
- Sessions are revoked immediately.
- `My Roasters`, Visits, private notes, Visit Ratings, and other private
  account-owned content are permanently deleted.
- Minimal security or operational records may be retained only when required
  and must not contain private tracking content.

### Roaster Catalog Data

- Published Coffee Roasters are archived rather than physically deleted.
- Archived records are excluded from the public Roaster Catalog but remain
  available to authorized Admins.
- Existing internal references and publication history remain intact.
- Merging duplicate records is an explicit administrative operation rather than
  deletion.

### Administrative History

- Admin publication actions retain actor, action, affected record, and
  timestamp.
- Internal source and verification notes, if added later, remain private.
- Retention policy may be revisited if legal or operational requirements
  emerge.

### Authentication Data

- Disabling or deleting an account revokes active sessions immediately.
- Expired sessions and verification tokens are removed through scheduled
  cleanup.
- Authentication retention must remain compatible with Better Auth's integrity
  requirements.

Hard deletion must not be used to conceal or rewrite curation history. Archival
must not be used to prevent a Coffee Lover from permanently deleting private
tracking data.

## Consequences

- Private data can be permanently removed while public curation remains
  auditable.
- Database records need explicit archived states where appropriate.
- Administrative interfaces must distinguish archive, merge, disable, and
  permanent delete actions.
- Backup retention may temporarily preserve deleted database data outside the
  live application; provider retention and restoration access require
  operational controls and documentation.
