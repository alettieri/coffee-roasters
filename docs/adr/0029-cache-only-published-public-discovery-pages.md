# ADR 0029: Cache Only Published Public Discovery Pages

Date: June 20, 2026

## Status

Accepted

## Context

Area pages and Roaster Profiles are public, indexable, and mostly read-heavy. Their content changes through controlled Curated Roaster Data publication rather than continuous public editing.

Journal, account, Visit Photo, Suggestion review, and admin responses contain private or authorization-dependent data. A shared-cache mistake on those routes would be a serious privacy failure.

The application runs through Nuxt, Nitro, and Cloudflare Workers, which already provide rendering and cache controls. Adding Redis or another cache system before measured need would create unnecessary invalidation and operational complexity.

## Decision

Use Nuxt/Nitro route rules and Cloudflare caching for published Public Discovery content only.

The implementation will:

- pre-render stable Launch Area and Roaster Profile pages where practical;
- cache only responses derived entirely from published Curated Roaster Data;
- define explicit cache rules by public route rather than relying on broad defaults;
- use deterministic cache keys that exclude cookies and private request data;
- trigger targeted revalidation or purge for affected Area and Roaster Profile routes after administrative publication, archival, merge, or slug changes;
- ensure publication completes successfully before invalidating public caches;
- provide bounded cache lifetimes as recovery from missed invalidation;
- keep search responses uncached initially unless a measured need and safe cache key are established; and
- avoid adding Redis or another application cache until database or rendering measurements justify it.

Authenticated Journal, account, Visit Photo, Suggestion review, and admin responses must:

- bypass shared caches;
- use private or no-store response semantics;
- avoid stale-while-revalidate behavior; and
- never vary public content based on an authenticated session.

Public pages may show a generic sign-in affordance, but session-specific information must be rendered separately without making the public document user-specific.

## Consequences

- Public Discovery can be fast and resilient at the edge.
- Controlled publication provides a natural cache-invalidation boundary.
- Private routes have simpler and safer cache semantics.
- Publication workflows must know which public routes are affected.
- A missed purge can temporarily expose stale public data until expiry, but must never expose unpublished or private data.
- Slug changes require invalidating old and new routes and defining redirect behavior.
- Cache behavior needs automated tests that inspect response headers and cross-account behavior.
