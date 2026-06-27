# Coffee Roaster Discovery

This context describes the language for a personal coffee roaster tracking
tool with a small public roaster catalog.

## Product Direction

The product starts as a tool the owner wants to use personally:

- curate Coffee Roasters through an admin form;
- publish a simple public Roaster catalog;
- save Roasters privately to `My Roasters`;
- track repeat Visits;
- keep personal notes and ratings private; and
- find Roasters to try, revisit, favorite, archive, or mark as not for me.

The first version is not a broad California discovery platform, Area Guide,
review site, marketplace, or roaster-operated dashboard.

## Language

**Coffee Lover**:
A person using the product to find, remember, and track Coffee Roasters.
_Avoid_: Consumer, buyer, audience

**Admin**:
The product owner or explicitly authorized maintainer who can curate public
Roaster records.
_Avoid_: Roaster owner, business account

**Coffee Roaster**:
A coffee roasting business or brand worth tracking in the product.
_Avoid_: Generic cafe, vendor, marketplace seller

**Roaster Catalog**:
The public set of visible Coffee Roasters curated by an Admin.
_Avoid_: Directory, marketplace, leaderboard

**Roaster Profile**:
A public page for one Coffee Roaster with basic factual links and optional
signed-in personal tracking controls.
_Avoid_: Review page, microsite, business dashboard

**My Roasters**:
A signed-in Coffee Lover's private dashboard of tracked Coffee Roasters.
_Avoid_: Public profile, social feed

**Roaster Tracking State**:
A private relationship between a Coffee Lover and a Coffee Roaster, including
notes, favorite, not-for-me, archive state, and derived status.
_Avoid_: Public review, ownership, claim

**Want to try**:
The derived state for an active tracked Coffee Roaster with no Visits.
_Avoid_: Ranking, recommendation

**Tried**:
The derived state for a Coffee Roaster with at least one private Visit.
_Avoid_: Check-in total, public proof

**Favorite**:
A manual private flag a Coffee Lover applies to a Coffee Roaster.
_Avoid_: Score, public endorsement

**Archived**:
A private state that hides a Coffee Roaster from active personal views while
preserving notes and Visits.
_Avoid_: Delete

**Visit**:
A private repeat entry recording one meaningful interaction with a Coffee
Roaster.
_Avoid_: Check-in, public review

**Visit Date**:
The day a Visit occurred.
_Avoid_: Timestamp, logged at

**Visit Rating**:
A private personal rating on one Visit: `Loved it`, `Liked it`, `Mixed`, or
`Not for me`.
_Avoid_: Public star rating, quality score

**Private Notes**:
Personal text written by a signed-in Coffee Lover on a Roaster Tracking State
or Visit.
_Avoid_: Public review, testimonial

## Relationships

- An Admin curates Coffee Roasters.
- A Coffee Roaster may be public or hidden.
- A signed-out visitor can browse public Coffee Roasters.
- A signed-in Coffee Lover can track a public Coffee Roaster in `My Roasters`.
- A Coffee Lover may have Roaster Tracking State for many Coffee Roasters.
- A Coffee Roaster may have Roaster Tracking State for many Coffee Lovers.
- A Coffee Lover may record multiple Visits for the same Coffee Roaster.
- A Visit belongs to one Coffee Lover and one Coffee Roaster.
- A Visit has one Visit Date.
- A Visit may have one private Visit Rating.
- Private Notes and Visits are never public catalog content.
- Archiving a tracked Coffee Roaster preserves Visits and Private Notes.

## Resolved Product Decisions

- The first version is a personal roaster tracker, not an Area-first guide.
- Public Roasters are shared catalog records curated by Admins, not owned by
  ordinary users.
- Ordinary signed-in users cannot add or edit public Roasters in v1.
- Magic-link login is acceptable for the first version.
- `My Roasters` is separate from the public Roaster Catalog.
- `Want to try` is derived from private tracking state with zero Visits.
- `Want to try` stops applying after the first Visit exists.
- `Favorite` is manual and separate from Visit Ratings.
- A `Loved it` Visit does not automatically make a Coffee Roaster a favorite.
- A `Not for me` Visit does not automatically mark the Coffee Roaster itself
  as not for me.
- Removing a Coffee Roaster from active `My Roasters` archives it rather than
  deleting private history.
- Visits are repeatable and private.
- Visit Photos, Suggestions, roaster claims, public rankings, public reviews,
  marketplace checkout, and Area Guides are future possibilities, not v1
  scope.
