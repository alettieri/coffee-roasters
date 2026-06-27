# Personal Roaster Tracker Design

Date: June 27, 2026

## Purpose

Design the first usable Coffee Roaster Discovery product around a personal
coffee roaster tracker.

The product should start as a tool for tracking Coffee Roasters the owner
wants to try, has tried, and wants to revisit. It should still support a
small public roaster catalog, but the public catalog is supporting
infrastructure for the personal tool rather than the main product promise.

This design replaces the earlier signed-out Area Guide direction for this
workstream.

## Product Direction

Use a hybrid model:

```text
Public roaster catalog + private personal tracking + admin curation
```

The primary first-version flows are:

```text
Login as admin -> add roaster -> mark public -> see it in public catalog
Login as user -> open public roaster -> add to My Roasters -> add Visit
```

Public Coffee Roasters are shared catalog records curated by the product
owner. They are not owned by ordinary users. Signed-out visitors can browse
visible roasters and open basic Roaster Profiles.

Personal tracking is private. A signed-in user can add a public Roaster to
`My Roasters`, add repeat Visits, write private notes, mark a Roaster as a
favorite, mark it as not for me, and archive it from the active personal
list.

Admin curation is limited to the product owner in the first version. Admins
can add and edit public Roaster records and decide whether a Roaster is
visible publicly.

## In Scope

- Magic-link login.
- Public Roaster list.
- Public Roaster Profile.
- Admin-only Roaster add and edit form.
- Public or hidden Roaster visibility.
- Separate signed-in `My Roasters` page.
- Private per-user Roaster tracking state.
- Repeat private Visits against a Roaster.
- Private Visit rating.
- Basic search, filters, and sorting after the core data exists.

## Out Of Scope

- Guide-style discovery pages.
- Curated public guide sections such as `Visit in person`, `Buy beans`, or
  `Know the scene`.
- Public editorial notes.
- Public user ratings, rankings, reviews, or quality scores.
- Public Visit data.
- Media attachments.
- Community submissions.
- Roaster-operated workflows.
- Paid placement.
- Marketplace checkout.
- Map-first discovery.
- Full California coverage.

## Authentication And Access

Use magic-link authentication.

Signed-out visitors can:

- browse public Roasters;
- open public Roaster Profiles;
- use public outbound links; and
- start login.

Signed-in users can:

- use all signed-out behavior;
- add a Roaster to `My Roasters`;
- edit their own private Roaster tracking state;
- add, edit, and delete their own Visits;
- archive a Roaster from their active personal list; and
- sign out.

Admins can:

- add public catalog Roasters;
- edit public catalog Roasters;
- hide or publish Roasters; and
- use all signed-in user behavior.

Ordinary signed-in users cannot create or edit public Roaster records in the
first version.

## Public Roaster Catalog

The public catalog is a simple list of visible Roasters.

Public Roaster fields:

- name;
- city or Area;
- website URL;
- shop URL;
- Instagram URL;
- address text or directions URL;
- public visibility state; and
- timestamps.

The public catalog should avoid editorial or competitive claims in the first
version. It should not present Roasters as ranked, reviewed, scored, or
recommended by quality.

Public Roaster Profiles should show the same factual public fields and
outbound links. They may also show signed-in personal tracking controls when
the current visitor is authenticated.

## My Roasters

`My Roasters` is a separate signed-in page focused on the user's private
tracking state.

A Roaster appears in `My Roasters` when the user has a private relationship
with it, such as:

- saved it to try later;
- added private notes;
- marked it as favorite;
- marked it as not for me;
- archived it; or
- added at least one Visit.

Private per-user Roaster state:

- saved or tracked;
- private notes;
- favorite;
- not for me;
- archived; and
- timestamps.

Personal status is computed:

- `Want to try`: tracked, active, and has zero Visits.
- `Tried`: has at least one Visit.
- `Archived`: hidden from active personal views while preserving private
  state and Visits.

`Favorite` is a manual personal flag. It must not be automatically derived
from Visit ratings.

`Want to try` is a pre-Visit state. It stops applying automatically after the
first Visit exists.

Removing a Roaster from the active `My Roasters` list archives it. Archiving
must preserve Visits and private notes.

The first `My Roasters` page should support:

- search;
- filters for all active, want to try, tried, favorites, not for me, and
  archived;
- sorting by recently updated, name, Area, and latest Visit; and
- rows or cards showing Roaster name, city or Area, computed status, favorite
  marker, Visit count, latest Visit date, and latest rating.

## Visits

A Visit is a repeat private record of an interaction with a Roaster.

The label `Visit` is used broadly. It can represent:

- visiting a Roaster cafe or roastery;
- drinking the Roaster's coffee at another shop;
- buying beans online;
- brewing the Roaster's beans at home; or
- attending a cupping or event.

Visit fields:

- Roaster;
- signed-in user;
- Visit date;
- context or place;
- what was tried;
- personal rating; and
- private notes.

Personal Visit ratings:

- `Loved it`;
- `Liked it`;
- `Mixed`; and
- `Not for me`.

Visit ratings are private. A `Loved it` Visit must not automatically mark the
Roaster as favorite. A `Not for me` Visit must not automatically mark the
Roaster itself as not for me.

Adding a Visit for a Roaster should automatically create the user's private
Roaster tracking state if it does not already exist.

## Data Contract

This design defines a product data contract, not a final database schema.

Required concepts:

- `User`: an authenticated account with an email address and role.
- `Roaster`: a shared public catalog record curated by admins.
- `UserRoaster`: private per-user tracking state for a Roaster.
- `Visit`: a private repeat record for one user's interaction with one
  Roaster.

Conceptual relationships:

```text
User has many UserRoasters
User has many Visits
Roaster has many UserRoasters
Roaster has many Visits
Visit belongs to User
Visit belongs to Roaster
```

Permission rules:

- Anyone can read public Roasters where the visibility state is public.
- Only admins can create, edit, hide, or publish Roasters.
- Signed-in users can create, read, update, and archive only their own
  `UserRoaster` state.
- Signed-in users can create, read, update, and delete only their own Visits.
- Private tracking state and Visits must not appear in public catalog
  responses.

## Screen Contract

The first version should include five screens.

### Public Roasters

Shows visible Roasters only.

Initial controls:

- search by name, city, or Area;
- filter by Area when enough data exists;
- open Roaster Profile;
- login entry point; and
- signed-in affordance showing whether a Roaster is already in `My Roasters`.

### Roaster Profile

Shows one public Roaster.

Public section:

- name;
- city or Area;
- website, shop, Instagram, and directions links; and
- address or location note when known.

Signed-in private section:

- add to `My Roasters`;
- favorite toggle;
- not-for-me toggle;
- archive or restore;
- private notes;
- Visits list; and
- add Visit.

### My Roasters

Shows the signed-in user's personal tracking dashboard.

Controls:

- search;
- status filters;
- favorite filter;
- archived filter; and
- sorting.

Rows or cards:

- Roaster name;
- city or Area;
- computed personal status;
- favorite marker;
- Visit count;
- latest Visit date; and
- latest rating.

### Visit Form

Creates or edits one private Visit.

Fields:

- Visit date;
- context or place;
- what was tried;
- rating; and
- notes.

The user can edit or delete only their own Visits.

### Admin Roasters

Admin-only Roaster management.

Functions:

- add Roaster;
- edit Roaster;
- publish or hide Roaster; and
- search or filter existing Roasters.

The admin form should stay practical and minimal. It is not a moderation,
claim, suggestion, or marketing placement system.

## Implementation Sequence

Build the first slice in this order:

1. Magic-link authentication.
2. Admin Roaster form.
3. Public Roaster catalog and profile.
4. `My Roasters`.
5. Visits.
6. Search, filters, and sorting.

The first tracer bullet is:

```text
Login as admin -> add Roaster -> mark public -> see it on public catalog ->
open public Roaster Profile
```

The second tracer bullet is:

```text
Login as user -> open public Roaster -> add to My Roasters -> add Visit
```

## Success Criteria

This design is successful when a first implementation plan can build a small
personal roaster tracker without guessing the product shape.

The first implemented product should let the owner:

- log in;
- add a Roaster through an admin form;
- publish that Roaster to the public catalog;
- view the public Roaster Profile;
- add the Roaster to `My Roasters`;
- add repeat Visits;
- rate Visits privately;
- favorite, mark not-for-me, and archive Roasters privately; and
- preserve Visits when a Roaster is archived from active personal tracking.

The implementation should not add broader public discovery, editorial guide,
review, marketplace, roaster-operated, community-submission, or media-management
behavior.
