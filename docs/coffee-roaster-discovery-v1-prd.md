# Coffee Roaster Discovery V1 PRD

Date: June 27, 2026

## Problem Statement

The product owner needs a simple way to keep track of Coffee Roasters they
want to try, have tried, want to revisit, or want to avoid. Notes scattered
across memory, browser bookmarks, maps, messages, and local coffee shop
recommendations are hard to revisit when deciding where to go or what beans
to buy next.

The first product should be useful as a personal tool before it tries to
become a broad public discovery platform. Public Roaster records are still
useful because they create a reusable catalog, but the personal tracking
workflow is the main v1 value.

## Solution

Build a personal roaster tracker with three surfaces:

- a public Roaster Catalog of visible Coffee Roasters;
- a signed-in `My Roasters` dashboard for private tracking; and
- an admin-only Roaster form for the owner to curate catalog records.

Public Roasters are shared records curated by an Admin. Signed-out visitors
can browse visible Roasters and open basic Roaster Profiles. Signed-in Coffee
Lovers can privately add a Roaster to `My Roasters`, write notes, mark it as
favorite or not for me, archive it, and add repeat Visits.

The first build should prioritize the owner's real workflow:

```text
Login as admin -> add Roaster -> publish Roaster -> view public profile
Login as user -> add Roaster to My Roasters -> add repeat Visits
```

## User Stories

1. As an Admin, I want to log in with a magic link, so that I can manage the
   catalog without a password workflow.
2. As an Admin, I want to add a Coffee Roaster through an app form, so that I
   can seed the product from roasters I already know.
3. As an Admin, I want to edit a Coffee Roaster, so that I can fix links,
   location details, or names as I learn more.
4. As an Admin, I want to hide or publish a Coffee Roaster, so that incomplete
   records do not need to be public.
5. As a signed-out visitor, I want to browse public Coffee Roasters, so that I
   can see what is in the catalog without signing in.
6. As a signed-out visitor, I want to open a Roaster Profile, so that I can use
   its website, shop, social, or directions links.
7. As a Coffee Lover, I want to log in, so that my private tracking data is
   protected.
8. As a Coffee Lover, I want to add a public Roaster to `My Roasters`, so that
   I can remember that I want to try it.
9. As a Coffee Lover, I want `My Roasters` to be separate from the public
   catalog, so that I have a focused personal dashboard.
10. As a Coffee Lover, I want a Roaster with no Visits to show as `Want to try`,
    so that planning requires minimal data entry.
11. As a Coffee Lover, I want a Roaster with at least one Visit to show as
    `Tried`, so that my history is derived from actual Visits.
12. As a Coffee Lover, I want to add repeat Visits to one Roaster, so that I can
    remember multiple experiences over time.
13. As a Coffee Lover, I want a Visit to capture date, context, what I tried,
    rating, and notes, so that the memory is useful later.
14. As a Coffee Lover, I want Visit ratings to be private, so that my personal
    impressions do not become public reviews.
15. As a Coffee Lover, I want `Favorite` to be a manual flag, so that a single
    loved Visit does not decide my overall relationship to a Roaster.
16. As a Coffee Lover, I want to mark a Roaster as not for me, so that I can
    remember my overall judgment without deleting history.
17. As a Coffee Lover, I want to archive a Roaster from active views, so that I
    can keep `My Roasters` clean while preserving notes and Visits.
18. As a Coffee Lover, I want to search and filter `My Roasters`, so that I can
    quickly find what to try, what I loved, and what I have already visited.

## Implementation Decisions

- Build the initial product around a personal roaster tracker.
- Keep the primary shared object as Coffee Roaster.
- Keep public Roaster records admin-curated in v1.
- Do not let ordinary signed-in users create or edit public Roaster records in
  v1.
- Use magic-link login for the first version.
- Make public Roaster browsing available without sign-in.
- Require sign-in for `My Roasters`, private notes, favorite, not-for-me,
  archive state, and Visits.
- Use a separate `My Roasters` page rather than overlaying all personal
  tracking on the public catalog.
- Compute `Want to try` from active private tracking state with zero Visits.
- Compute `Tried` from at least one Visit.
- Keep `Favorite`, `Not for me`, and `Archived` as manual private states.
- Preserve Visits and private notes when a Roaster is archived.
- Keep Visit ratings private and personal.
- Avoid public rankings, public reviews, quality scores, or star ratings.
- Defer Area Guides, Visit Photos, Suggestions, roaster claim flows, public
  editorial guides, paid placement, marketplace checkout, and map-first
  discovery.

## Data Contract

This PRD defines product behavior, not a final database schema.

Required concepts:

- `User`: authenticated account with an email address and role.
- `Roaster`: shared catalog record curated by Admins.
- `UserRoaster`: private per-user tracking state for one Roaster.
- `Visit`: private repeat record of one Coffee Lover's interaction with one
  Roaster.

Permission rules:

- Anyone can read public Roasters.
- Only Admins can create, edit, hide, or publish Roasters.
- Signed-in users can create, read, update, and archive only their own
  `UserRoaster` records.
- Signed-in users can create, read, update, and delete only their own Visits.
- Private notes, Visit ratings, and Visits must not appear in public catalog
  responses.

## Screens

### Login

- Enter email.
- Receive magic link.
- Return signed in.
- Sign out.

### Admin Roasters

- Add Roaster.
- Edit Roaster.
- Publish or hide Roaster.
- Search/filter existing Roasters when useful.

### Public Roasters

- Browse visible Roasters.
- Open Roaster Profiles.
- Use public links.
- Start login.

### Roaster Profile

- Show public Roaster details.
- Show signed-in private controls when authenticated.
- Add to `My Roasters`.
- Add Visit.
- Edit private notes.
- Toggle favorite, not-for-me, and archive state.

### My Roasters

- Show tracked Roasters only.
- Search.
- Filter by all active, want to try, tried, favorites, not for me, and
  archived.
- Sort by recently updated, name, area, or latest Visit.
- Show Visit count, latest Visit date, latest rating, and favorite state.

### Visit Form

- Add or edit Visit date.
- Add or edit context/place.
- Add or edit what was tried.
- Select rating: `Loved it`, `Liked it`, `Mixed`, or `Not for me`.
- Add or edit notes.
- Delete own Visits.

## Testing Decisions

- Test at user-visible behavior seams.
- Auth tests should verify magic-link login and sign-out behavior at the
  highest practical seam.
- Admin tests should verify only Admins can create, edit, hide, and publish
  Roasters.
- Public catalog tests should verify signed-out visitors can read public
  Roasters and cannot access private tracking data.
- Privacy tests should verify one signed-in user cannot read or mutate another
  user's `My Roasters` state or Visits.
- `My Roasters` tests should verify `Want to try`, `Tried`, favorite,
  not-for-me, and archived behavior.
- Visit tests should verify repeat Visits, private ratings, edit/delete, and
  derived `Tried` status.
- Archive tests should verify archived Roasters leave active views while
  preserving Visits and notes.

## Out Of Scope

- Area Guides.
- Launch Areas.
- Roast Quality Signals.
- Public Signals beyond basic factual Roaster fields.
- Public editorial notes.
- Public ratings, rankings, reviews, or quality scores.
- Visit Photos.
- Suggestions.
- Roaster claim flows.
- Roaster dashboards.
- Public user profiles or social feeds.
- Marketplace checkout, fulfillment, subscriptions, tasting boxes, or
  payments.
- Paid placements or sponsored guides.
- Map-first discovery.
- Bulk import.
- Product analytics.

## Further Notes

The first useful build should be intentionally small. Future versions may add
photos, Suggestions, richer public discovery, guide pages, maps, or sharing
only after the personal roaster tracker proves useful.

The current design spec is:

`docs/superpowers/specs/2026-06-27-personal-roaster-tracker-design.md`
