# ADR 0031: Defer Bulk Curated Roaster Data Import

Date: June 20, 2026

## Status

Accepted

## Context

The product will initially have one Coffee Lover and an early, limited set of
Roaster Catalog data. Admin curation is handled through the current v1 product
scope in ADR 0037.

Choosing a seed-file format, import contract, deduplication policy, provenance mapping, and reconciliation workflow now would optimize for a data volume and acquisition process that have not yet been established.

## Decision

Do not build a bulk seed or Roaster Catalog import pipeline yet.

For the initial phase:

- create and update Roaster Catalog data through the private admin interface;
- keep PostgreSQL as the source of truth;
- keep admin-entered Roaster data in the Curation module;
- avoid repository seed files that could become an ambiguous second source of truth; and
- use only minimal deterministic fixtures required for automated tests.

Reconsider bulk import when manual entry becomes a measured bottleneck or a concrete external dataset needs ingestion. That decision must define validation, identity matching, dry-run behavior, provenance, idempotency, and rollback expectations.

## Consequences

- Initial implementation avoids speculative import infrastructure.
- Manual curation is acceptable at low data volume.
- Adding a large initial catalog will require more maintainer effort.
- Test fixtures remain intentionally separate from product data.
- A future importer must operate through domain-aware Curation operations rather than bypassing application invariants.
