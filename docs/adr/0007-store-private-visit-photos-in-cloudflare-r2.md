# ADR 0007: Store Private Visit Photos in Cloudflare R2

Date: June 19, 2026

## Status

Superseded by ADR 0037 for v1 scope

## Context

Visit Photos are private, optional memory artifacts attached to Visits. The application must support multiple photos, captions, deletion, and a Visit Cover Photo without preserving or using hidden location metadata.

Photo bytes should not be stored in PostgreSQL or routinely pass through the main application deployment. Access must remain tied to the owning Local Coffee Lover, and object identifiers must not be treated as authorization.

Cloudflare R2 and Bunny Storage were compared using independent research. R2 provides the stronger v1 fit because it supports established S3-compatible presigned object operations, direct browser uploads, no internet egress charges, and a useful free allowance. Bunny provides stronger integrated CDN and image tooling but has less clearly documented direct-browser upload ergonomics and relies on broader Storage Zone credentials.

## Decision

Use Cloudflare R2 Standard storage for private Visit Photos.

The implementation will:

- keep all Visit Photo buckets private;
- store object keys and application metadata in PostgreSQL, not public object URLs;
- verify authentication and Visit ownership before issuing upload or download authorization;
- use short-lived presigned `PUT` URLs for direct browser uploads;
- initially upload objects under opaque quarantine keys;
- validate decoded file type, file size, pixel dimensions, and other safety limits;
- decode and re-encode every accepted image to remove EXIF, GPS, and other hidden metadata;
- store only the sanitized output as the canonical Visit Photo;
- issue short-lived presigned `GET` URLs only after ownership checks;
- treat presigned URLs as bearer credentials and keep them out of persistent records, analytics, and logs;
- delete canonical objects when their Visit Photo is deleted; and
- periodically remove abandoned quarantine objects.

Presigned browser access will use narrowly scoped R2 S3 credentials held only by server-side code, with explicit CORS configuration and credential rotation. R2 bindings will be used for queue processing, sanitization input, canonical object management, deletion, and cleanup.

R2 access will be isolated behind an application storage interface. ADR 0009 selects Cloudflare Images for sanitization and transformation.

## Consequences

- Browser uploads do not consume the main application deployment's request body bandwidth.
- Early storage and delivery costs should remain low, with no internet egress charge.
- Visit Photo privacy remains an application authorization responsibility.
- Presigned URLs cannot be individually revoked before expiration, so their lifetimes must be short.
- The product must run the Cloudflare Images sanitization step defined by ADR 0009 before an uploaded image becomes available.
- Upload completion and sanitization need explicit states so incomplete or failed objects never appear in the Journal.
- Orphan cleanup and object/database consistency require scheduled maintenance.
- R2 does not itself satisfy the hidden-metadata requirement; omitting re-encoding would violate this decision and the PRD.
- Regional placement hints do not guarantee that data remains within a specific United States region.
