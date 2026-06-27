# ADR 0037: Reset V1 Scope to Personal Roaster Tracker

Date: June 27, 2026

## Status

Accepted

## Context

Earlier product documents described a broader California public discovery
platform with Area Guides, private Journals, Visit Photos, Suggestions, roaster
claim flows, and a larger curated discovery model.

The product direction has changed. The first useful product is a personal tool
for tracking Coffee Roasters the owner wants to try, has tried, and wants to
revisit. A small public Roaster Catalog still exists, but it supports the
personal tracker rather than defining a broad public discovery product.

Keeping the old product scope active would cause implementation issues to
overbuild features that can wait until after the tracker proves useful.

## Decision

Reset v1 product scope to a personal roaster tracker.

V1 includes:

- magic-link authentication;
- admin-only Coffee Roaster creation and editing;
- public browsing of visible Coffee Roasters;
- public Roaster Profiles with basic factual links;
- a signed-in `My Roasters` page;
- private per-user Roaster Tracking State;
- repeat private Visits;
- private Visit Ratings; and
- basic search, filtering, and sorting after the core data exists.

V1 excludes:

- Area Guides;
- Launch Areas;
- Roast Quality Signals;
- public editorial guide sections;
- public ratings, rankings, reviews, or quality scores;
- Visit Photos;
- Suggestions;
- roaster claim flows;
- roaster dashboards;
- paid placement;
- marketplace checkout;
- map-first discovery;
- bulk import; and
- product analytics.

Public Roasters are shared catalog records curated by Admins. Ordinary signed-in
users cannot create or edit public Roasters in v1.

Personal tracking belongs to signed-in users. `Want to try` and `Tried` are
derived from private tracking state and Visits. `Favorite`, `Not for me`, and
`Archived` are manual private states. Archiving hides a Roaster from active
personal views while preserving Visits and private notes.

Use magic-link login for the first version. ADR 0006 remains the authentication
stack decision. ADR 0025's email-and-password sign-in method is superseded by
this decision.

## Consequences

- The first implementation can be much smaller and more personally useful.
- Public catalog behavior remains available without requiring full public
  discovery strategy.
- The admin surface is a practical owner curation form, not a moderation or
  claims workflow.
- Visit Photos, Suggestions, guide pages, and richer public discovery can be
  reconsidered later through new ADRs or PRDs.
- Existing architecture decisions still apply where they describe the stack,
  deployment, database, validation, testing tools, and operational boundaries.
- Earlier feature-specific ADRs for Visit Photos, Suggestions, broad discovery,
  and email/password sign-in are historical context, not active v1 scope.
