# ADR 0030: Defer Interactive Maps and Automated Geocoding

Date: June 20, 2026

## Status

Accepted

## Context

V1 is centered on named Area Discovery and Area Roaster Lists, not radius search or map-first browsing. Roaster Locations still need sufficient location information for Local Coffee Lovers to understand where a Visit occurred and obtain directions.

An interactive map SDK and automated geocoding provider would add client weight, API credentials, provider terms, usage costs, attribution requirements, and another data-quality workflow before the product requires map interaction.

## Decision

Do not include an interactive map SDK or automated geocoding service in v1.

The implementation will:

- store structured postal address fields for Roaster Locations;
- allow optional latitude and longitude values;
- manage and verify coordinates through the private admin interface;
- record coordinate verification status and internal provenance where useful;
- display readable addresses on Roaster Profiles and Visit context;
- provide external direction links derived from the address or verified coordinates;
- validate coordinate ranges and avoid presenting unverified coordinates as precise facts; and
- keep Area associations curated rather than inferred solely from coordinates.

Coordinates must not change the definition of Area into a radius or proximity boundary. Automated geocoding, distance sorting, and interactive maps require measured need and a separate provider decision.

## Consequences

- V1 remains list-first and avoids map-provider complexity.
- Maintainers carry a small amount of manual location-data work.
- External map products handle navigation and directions.
- Optional coordinates preserve a migration path toward future maps or proximity features.
- Address changes require maintainers to review coordinates and external links.
- The application must URL-encode external direction links and avoid embedding private Local Coffee Lover location data.
