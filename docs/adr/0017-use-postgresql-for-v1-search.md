# ADR 0017: Use PostgreSQL for V1 Search

Date: June 20, 2026

## Status

Accepted

## Context

V1 search supports finding named California Areas and Coffee Roasters. The product does not require broad document search, review search, product-catalog search, geospatial radius ranking, or personalized recommendations.

Adding a separate search service would introduce another index, synchronization workflow, access boundary, deployment dependency, and source of inconsistency before the product demonstrates that PostgreSQL search is insufficient.

Area Roaster Lists are discovery lists rather than leaderboards. Text-match relevance must not be presented as Roast Quality or used to create an implied quality ranking.

## Decision

Use PostgreSQL for v1 Area and Coffee Roaster search.

The implementation will:

- store canonical display names separately from normalized search values;
- support reviewed aliases for Areas and Coffee Roasters;
- use appropriate B-tree indexes for exact and prefix lookups;
- use PostgreSQL trigram indexes for tolerant name matching when needed;
- keep search limited to published Curated Roaster Data;
- use deterministic tie-breaking for equivalent matches;
- keep Area Roaster List ordering independent from Roast Quality;
- monitor query plans and latency with representative data volumes; and
- encapsulate search operations so a future search service can replace them without changing domain rules.

Search result relevance may determine which matching Areas or Coffee Roasters appear first in a direct search response. It must not be labeled or interpreted as a quality score, rating, or ranking.

## Consequences

- Search shares the primary source of truth and requires no synchronization pipeline.
- V1 operations remain simpler and less expensive.
- PostgreSQL extensions and indexes require explicit migration and Neon compatibility checks.
- Typo tolerance and advanced relevance tuning will be more limited than a dedicated search product.
- A separate search service may become appropriate if query volume, richer filtering, autocomplete requirements, or relevance complexity exceed measured PostgreSQL capabilities.
