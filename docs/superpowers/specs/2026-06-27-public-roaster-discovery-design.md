# Public Roaster Discovery Design

Date: June 27, 2026

## Purpose

Design the first usable application experience for Coffee Roaster
Discovery before committing to a database model or implementation issue
ladder.

The first product experience is a signed-out California roaster guide. It
helps a visitor choose an Area, compare a curated set of Coffee Roasters,
open a Roaster Profile, and take an outbound action such as visiting the
roaster website, shop, social profile, directions link, or events page.

This design intentionally excludes accounts, private Journal behavior,
admin tools, Suggestions, photo handling, claim-profile flows, and
marketplace checkout.

## Experience Direction

Use an Area-first guide model.

The primary flow is:

```text
Home -> Area Guide -> Roaster Profile -> outbound action
```

The product should feel like a curated local guide, not a generic
directory, review site, or marketplace. It can explain why a roaster is
notable, but it must avoid ranked language, star ratings, public reviews,
quality scores, and "best" or "top" claims.

The product voice is factual and lightly editorial:

- factual public signals explain what is known;
- short curated notes explain why the roaster is included;
- editorial copy is restrained and based on observable facts;
- uncertainty or caveats should be visible when the product cannot verify
  something confidently.

## Home Experience

The home page should immediately expose the usable discovery path rather
than acting as a broad marketing landing page.

The home page should include:

- a clear prompt to start from a California Area;
- launch Areas that already have useful curated data;
- a simple Area search or chooser;
- examples of the guide's differentiators, such as in-house roasting,
  visitable locations, public cuppings, direct-buy links, ownership
  signals, local pickup, and subscriptions.

The home page should not introduce sign-in, private Journal behavior,
roaster admin tools, paid placement, or marketplace checkout.

## Area Guide

An Area Guide is the primary public discovery surface. It is a compact
local coffee guide for one named California Area.

The top of the page should include:

- Area display name;
- short orientation paragraph;
- count of curated roasters when known;
- count of visitable roasters when known;
- short factual context about what the Area is known for when known.

The Area Guide is organized by visitor intent, not by a single ranked
list.

Initial Area sections:

- `Visit in person`: roasters with a public visitable location, tasting
  room, cafe-roastery, pickup counter, or similar visitor path.
- `Buy beans`: roasters with a direct online shop, subscription, local
  pickup, fresh roast availability, or clear shipping path.
- `Know the scene`: roasters that are useful for understanding the local
  coffee scene, including production roasters, notable ownership models,
  sourcing or cupping activity, or strong local relevance.

Each section should be curated and short. A roaster may appear in more
than one section when that is useful, but the page should avoid noisy
duplication. Section order and roaster order must not imply quality
ranking.

Each Roaster Preview should include:

- roaster name;
- city, neighborhood, or Area relevance;
- one careful curated note;
- factual signal chips;
- primary action to open the Roaster Profile.

Example public signal chips:

- `roasts in-house`;
- `public cuppings`;
- `woman-owned`;
- `direct shop`;
- `local pickup`;
- `subscription`;
- `visitable`;
- `production roaster`.

## Roaster Profile

A Roaster Profile answers three public questions:

- Should I visit?
- Should I buy?
- Why is this roaster notable?

The top summary should adapt to the roaster.

If the roaster has a public visitable location, the top summary should
lead with place context: city or neighborhood, visitability, primary
location, and directions.

If the roaster is not visitable, the top summary should lead with how to
buy from or learn about the roaster.

Core profile sections:

- `Why it is included`: a short explanation based on observable facts.
- `Signals`: structured factual public indicators.
- `Visit`: public locations, visitability notes, directions links, and
  caveats when hours or access should be confirmed externally.
- `Buy`: website, online shop, subscription, pickup, shipping, and known
  direct-buy paths.
- `Links`: website, shop, Instagram, map or directions, cupping or event
  page, and external review links only if the product later chooses to
  include links without copying review content.

Profile pages must not include user reviews, public scores, "best"
claims, user photos, private Journal prompts, account prompts, roaster
dashboard controls, or marketplace checkout.

## Interface Contract

This design defines an interface contract, not a database schema.

The public experience needs these concepts:

- `Area`: a named California discovery area with a public slug, display
  name, short orientation, and curated guide sections.
- `Area Section`: an intent grouping inside an Area Guide. The initial
  section names are `Visit in person`, `Buy beans`, and `Know the scene`.
- `Roaster Preview`: the compact public card or row shown inside an Area
  Section.
- `Roaster Profile`: the full public page for one Coffee Roaster.
- `Signal`: a factual public indicator such as `roasts in-house`,
  `public cuppings`, `woman-owned`, `direct shop`, `local pickup`,
  `subscription`, or `visitable`.
- `Curated Note`: short human-written copy explaining why a roaster
  appears in a section or why it is included.
- `Outbound Link`: an external action link such as website, shop,
  directions, Instagram, or cupping and events page.

The next data-modeling work should derive the minimum schema from this
interface contract. It should not independently invent broader admin,
Journal, photo, auth, Suggestion, or monetization data structures.

## Out Of Scope

This design excludes:

- signed-in account flows;
- private Journal and Visit recording;
- Visit Photos;
- maintainer admin workflows;
- Suggestion submission and review;
- roaster claim flows;
- paid placement;
- marketplace checkout;
- public reviews, star ratings, rankings, or quality scores;
- copied third-party review content;
- map-first discovery;
- full California coverage.

## Success Criteria

This design is successful when a later implementation plan can derive a
small public-discovery tracer bullet without guessing the product shape.

The first implementation should be able to render:

- a home page with Area entry points;
- one Area Guide with the three initial intent sections;
- curated Roaster Previews;
- at least one Roaster Profile;
- outbound links from the profile.

The implementation should be able to use static or seeded data first.
Database schema design should follow only after this public interface
contract is accepted.
