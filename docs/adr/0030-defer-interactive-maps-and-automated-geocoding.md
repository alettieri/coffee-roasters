# ADR 0030: Defer Interactive Maps and Automated Geocoding

Date: June 20, 2026

## Status

Accepted

## Context

V1 is centered on a personal roaster tracker and public Roaster Catalog, not
radius search or map-first browsing. Coffee Roasters may still need sufficient
location or directions information for Coffee Lovers to decide whether to visit
or record Visit context.

An interactive map SDK and automated geocoding provider would add client
weight, API credentials, provider terms, usage costs, attribution requirements,
and another data-quality workflow before the product requires map interaction.

## Decision

Do not include an interactive map SDK or automated geocoding service in v1.

The implementation will:

- store address text or directions fields for Coffee Roasters;
- allow optional latitude and longitude values only after a concrete need
  appears;
- manage and verify coordinates through the private admin interface if
  coordinates are later added;
- display readable addresses or directions links on Roaster Profiles and Visit
  context;
- provide external direction links derived from the address or provided
  directions URL;
- validate coordinate ranges if coordinates are added; and
- avoid deriving product structure solely from coordinates.

Automated geocoding, distance sorting, and interactive maps require measured
need and a separate provider decision.

## Consequences

- V1 remains list-first and avoids map-provider complexity.
- Admins carry a small amount of manual location-data work.
- External map products handle navigation and directions.
- Optional coordinates preserve a migration path toward future maps or
  proximity features.
- Address changes require Admins to review coordinates and external links if
  coordinates are later added.
- The application must URL-encode external direction links and avoid embedding
  private Coffee Lover location data.
