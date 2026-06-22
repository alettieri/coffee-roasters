# Coffee Roaster Discovery V1 PRD

Date: June 15, 2026

## Problem Statement

Local Coffee Lovers need a focused way to discover quality California Coffee Roasters when they are in, visiting, or curious about a particular Area. General map and review products are too cafe-oriented, too rating-oriented, or too noisy for someone who wants to find roasters that roast under their own brand and show meaningful Roast Quality Signals.

Local Coffee Lovers also need a private way to remember their in-person coffee experiences over time. A simple "visited" checkbox is not enough because the same person may visit the same Coffee Roaster more than once, visit different Roaster Locations, try different coffee, and want photos or notes that preserve the memory.

## Solution

Build an initial California-focused web product centered on Area Discovery, Coffee Roaster Profiles, and a private Journal.

Public Discovery should let anyone start with a named California Area, browse an Area Roaster List, inspect Roaster Previews, and open Roaster Profiles that explain why each Coffee Roaster may be worth attention. The product should use evidence-based Public Signals and Roast Quality Signals instead of public ratings, rankings, or reviews.

The Journal should let signed-in Local Coffee Lovers record repeatable in-person Visits to Coffee Roasters. A Visit should require a Coffee Roaster, Roaster Location, and Visit Date, while supporting optional notes, personal impressions, Visit Photos, Photo Captions, and a Visit Cover Photo. Visit Photos should be private, memory-oriented, optional, and unavailable for public sharing or publishing in v1.

Curated Roaster Data should seed the initial discovery experience. Local Coffee Lovers and roasters may submit Suggestions for corrections or missing Coffee Roasters, but public data should only change after review. Claimed Profile management, public reviews, monetization, marketplace checkout, and roaster dashboards are out of scope for v1.

## User Stories

1. As a Local Coffee Lover, I want to choose a California Area, so that I can discover Coffee Roasters near a place I am visiting or exploring.
2. As a Local Coffee Lover, I want the home experience to lead with Area Discovery, so that I can quickly start from where I am or where I am going.
3. As a Local Coffee Lover, I want to browse Launch Areas, so that I can find places where the product already has useful Curated Roaster Data.
4. As a Local Coffee Lover, I want to search for an Area by name, so that I can find relevant Coffee Roasters without scanning every Area.
5. As a Local Coffee Lover, I want an Area to show an Area Roaster List, so that I can compare Coffee Roasters without starting from a map.
6. As a Local Coffee Lover, I want Area Roaster Lists to avoid leaderboard-style ranking, so that I can judge Coffee Roasters from their Public Signals instead of a forced order.
7. As a Local Coffee Lover, I want each Roaster Preview to show the roaster name, Area relevance, short description, and Public Signals, so that I can decide whether to open the Roaster Profile.
8. As a Local Coffee Lover, I want a Roaster Preview to show whether a Coffee Roaster has a visitable Roaster Location, so that I know whether I can go there in person.
9. As a Local Coffee Lover, I want a Roaster Preview to link to the Roaster Profile, so that I can inspect the Coffee Roaster in more detail.
10. As a Local Coffee Lover, I want to open a Roaster Profile, so that I can decide whether to visit, buy from, or remember a Coffee Roaster.
11. As a Local Coffee Lover, I want a Roaster Profile to show Roast Quality Signals, so that I can understand evidence of Roast Quality without relying on star ratings.
12. As a Local Coffee Lover, I want Roast Quality Signals to be observable facts, so that I can judge a Coffee Roaster without the product overclaiming quality.
13. As a Local Coffee Lover, I want a Roaster Profile to show Public Signals, so that I can understand why the Coffee Roaster is included.
14. As a Local Coffee Lover, I want a Roaster Profile to show website, shop, and social links when known, so that I can take action outside the product.
15. As a Local Coffee Lover, I want a Roaster Profile to show Roaster Locations when known, so that I can choose where to visit.
16. As a Local Coffee Lover, I want a Coffee Roaster without a public Roaster Location to still appear when it has California Relevance, so that roaster discovery is not limited to cafes.
17. As a Local Coffee Lover, I want non-roasting cafes excluded from v1, so that the product stays focused on Coffee Roasters.
18. As a Local Coffee Lover, I want corporate ownership not to automatically exclude a Coffee Roaster, so that California-relevant own-brand roasters can still be discovered.
19. As a Local Coffee Lover, I want shipping to California alone to be insufficient for inclusion, so that the product remains locally meaningful.
20. As a Local Coffee Lover, I want Public Discovery to work without sign-in, so that I can evaluate the product before creating an account.
21. As a Local Coffee Lover, I want to create a Journal only when I want to save private Visits, so that discovery remains low-friction.
22. As a signed-in Local Coffee Lover, I want to add a Visit from a Roaster Profile, so that I can record an in-person experience while the roaster context is fresh.
23. As a signed-in Local Coffee Lover, I want a Visit to require only a Coffee Roaster, Roaster Location, and Visit Date, so that recording a memory is fast while preserving where the experience occurred.
24. As a signed-in Local Coffee Lover, I want the Visit Date to default sensibly, so that same-day entries require minimal effort.
25. As a signed-in Local Coffee Lover, I want to select a Roaster Location for a Visit, so that every in-person memory records which physical place I visited.
26. As a signed-in Local Coffee Lover, I want to record multiple Visits to the same Coffee Roaster, so that repeat experiences are preserved separately.
27. As a signed-in Local Coffee Lover, I want to record Visits across multiple Areas, so that my Journal reflects my coffee travel over time.
28. As a signed-in Local Coffee Lover, I want to add personal notes to a Visit, so that I can remember what stood out.
29. As a signed-in Local Coffee Lover, I want any personal impression to remain private, so that my Journal does not become a public review.
30. As a signed-in Local Coffee Lover, I want to avoid public star ratings, so that my private memory is not forced into review-site behavior.
31. As a signed-in Local Coffee Lover, I want my Journal to show a timeline of Visits, so that I can revisit my coffee memories chronologically.
32. As a signed-in Local Coffee Lover, I want my Journal to show roaster and Area context for each Visit, so that each memory is easy to place.
33. As a signed-in Local Coffee Lover, I want my prior Visits to be visible from a Roaster Profile, so that I can remember my history with that Coffee Roaster.
34. As a signed-in Local Coffee Lover, I want to add optional Visit Photos, so that I can preserve visual memories of an in-person experience.
35. As a signed-in Local Coffee Lover, I want a Visit to support multiple Visit Photos, so that I can remember the place, drink, beans, menu, or other details together.
36. As a signed-in Local Coffee Lover, I want Visit Photos to be private, so that my Journal remains personal.
37. As a signed-in Local Coffee Lover, I want Visit Photos to be for memory rather than proof, so that the app does not treat my private photos as verification.
38. As a signed-in Local Coffee Lover, I want Visit Photos to be unrelated to Roast Quality evaluation, so that photos do not become public quality evidence.
39. As a signed-in Local Coffee Lover, I want to add Visit Photos after creating a Visit, so that quick journaling is not blocked by photo upload.
40. As a signed-in Local Coffee Lover, I want to delete Visit Photos, so that I can control what remains in my Journal.
41. As a signed-in Local Coffee Lover, I want to add optional Photo Captions, so that I can describe what each Visit Photo helps me remember.
42. As a signed-in Local Coffee Lover, I want to edit Photo Captions, so that I can improve my memories later.
43. As a signed-in Local Coffee Lover, I want one Visit Photo to act as a Visit Cover Photo, so that my Journal timeline is more visually scannable.
44. As a signed-in Local Coffee Lover, I want a Visit without photos to still display well, so that photos remain optional.
45. As a signed-in Local Coffee Lover, I want hidden location metadata from Visit Photos not to be preserved or used, so that private photo details do not surprise me later.
46. As a signed-in Local Coffee Lover, I do not want public photo sharing or publishing in v1, so that private Journal semantics stay clear.
47. As a Local Coffee Lover, I want to suggest a missing Coffee Roaster, so that useful local knowledge can improve Curated Roaster Data.
48. As a Local Coffee Lover, I want to suggest a correction to a Roaster Profile, so that inaccurate public information can be fixed.
49. As a Local Coffee Lover, I want Suggestions to be reviewed before publication, so that public data remains curated and trustworthy.
50. As a roaster representative, I want to submit a correction through the same Suggestion flow, so that I can improve profile information without requiring Claimed Profile management.
51. As a product maintainer, I want Suggestions separated from published Curated Roaster Data, so that public discovery does not change without review.
52. As a product maintainer, I want internal source and verification notes to stay internal, so that public pages stay readable while curation remains auditable.
53. As a product maintainer, I want initial coverage to focus on selected Launch Areas, so that each Area can be useful rather than thin.
54. As a product maintainer, I want Coffee Roasters and Roaster Locations modeled separately, so that one roaster can have zero, one, or many physical places.
55. As a product maintainer, I want Roaster Locations associated with Areas, so that Area Discovery can connect Local Coffee Lovers to visitable places.
56. As a product maintainer, I want Coffee Roasters to be included based on own-brand roasting and California Relevance, so that the inclusion rule stays clear.
57. As a product maintainer, I want Area Discovery to be based on named California Areas rather than strict radius search, so that the product supports travel-oriented discovery and public Area pages.
58. As a product maintainer, I want public Area pages to be indexable, so that Local Coffee Lovers can discover the product through area-specific search.
59. As a product maintainer, I want the product to avoid copying third-party review content, so that discovery does not depend on review aggregation.
60. As a product maintainer, I want monetization deferred, so that trust and useful discovery come before paid placement decisions.

## Implementation Decisions

- Use the project glossary language from the Coffee Roaster Discovery context.
- Build the initial product around Local Coffee Lovers, not roaster operators.
- Make Area Discovery the primary public entry point.
- Treat Area as a named California discovery area, not a strict geographic radius.
- Use selected Launch Areas for v1 rather than attempting full California coverage.
- Keep the primary discovery object as Coffee Roaster, not cafe, place, bean, or product.
- Define Coffee Roaster inclusion by own-brand roasting plus California Relevance.
- Allow Coffee Roasters with corporate ownership when they remain own-brand roasters with California Relevance.
- Exclude non-roasting cafes, even if they serve high-quality coffee.
- Treat Coffee Roaster and Roaster Location as separate concepts.
- Allow a Coffee Roaster to have zero or more Roaster Locations.
- Require a Roaster Location for an in-person Visit, while allowing Coffee Roasters without public Roaster Locations to appear in discovery.
- Use Roast Quality Signals and Public Signals instead of scores, public ratings, or rankings.
- Keep source URLs, verification details, and uncertainty notes internal.
- Seed discovery with Curated Roaster Data rather than scraped listings or open community edits.
- Allow Suggestions for missing Coffee Roasters and profile corrections.
- Require review before any Suggestion changes public Curated Roaster Data.
- Provide a private admin interface for maintainers to manage Curated Roaster Data and review Suggestions.
- Defer Claimed Profile management; roaster representatives use the same Suggestion flow in v1.
- Make Public Discovery available without sign-in.
- Require sign-in for Journal persistence.
- Model a Journal as a private collection of Visits.
- Model a Visit as a repeatable in-person experience tied to one Local Coffee Lover and one Coffee Roaster.
- Require Coffee Roaster, Roaster Location, and Visit Date for a meaningful Visit.
- Allow optional notes, personal impression, and Visit Photos on a Visit.
- Keep Visit notes and impressions private; do not turn them into public reviews.
- Attach Visit Photos to Visits only; do not use them as public roaster/profile imagery.
- Allow multiple optional Visit Photos per Visit.
- Allow optional Photo Captions on individual Visit Photos.
- Allow a Visit Cover Photo when Visit Photos exist.
- Do not preserve or use hidden location metadata from Visit Photos.
- Allow Visit Photos to be added, deleted, and captioned after upload.
- Defer image editing, cropping, filters, and public photo publishing.
- Defer technology stack decisions. This PRD describes product behavior and domain boundaries only.

## Testing Decisions

- Test at the highest product behavior seams available after implementation, not internal helper details.
- Public Discovery tests should verify that unauthenticated Local Coffee Lovers can start from Area Discovery, browse an Area Roaster List, open Roaster Profiles, and see Public Signals without sign-in.
- Inclusion-boundary tests should verify that own-brand Coffee Roasters with California Relevance can appear, non-roasting cafes do not appear as Coffee Roasters, and shipping to California alone is not enough for inclusion.
- Area Discovery tests should verify that Areas are named discovery areas and that Area pages are list-first rather than map-first or ranking-first.
- Roaster Profile tests should verify that Roaster Profiles show decision/action/memory information, not business dashboard features.
- Journal tests should verify that sign-in is required to create and view private Visits, while Public Discovery remains open.
- Visit tests should verify that Coffee Roaster, Roaster Location, and Visit Date are required to create a Visit.
- Repeat Visit tests should verify that the same Local Coffee Lover can record multiple Visits for the same Coffee Roaster.
- Roaster Location tests should verify that a Visit must reference a Roaster Location belonging to its Coffee Roaster, while discovery does not require every Coffee Roaster to have a public Roaster Location.
- Privacy tests should verify that Visits, notes, impressions, and Visit Photos are visible only to the owning Local Coffee Lover.
- Visit Photo tests should verify that photos are optional, multiple photos can attach to one Visit, captions are optional, and a cover photo can represent the Visit in the Journal.
- Metadata tests should verify that hidden location metadata from Visit Photos is not preserved or used.
- Photo management tests should verify add, delete, and caption edit behavior while excluding image editing behavior.
- Suggestion tests should verify that Local Coffee Lovers can submit corrections or missing Coffee Roasters, and that Suggestions do not change public Curated Roaster Data until reviewed.
- There is no prior test suite in the current repository, so the first implementation should establish these seams as acceptance or integration tests around user-visible behavior.

## Out of Scope

- Technology stack selection.
- Full United States coverage.
- Complete California city coverage in v1.
- Strict radius-based local search as the primary discovery model.
- Map-first discovery.
- Public roaster rankings, public star ratings, public reviews, or review aggregation.
- Copying third-party review content.
- Marketplace checkout, fulfillment, subscriptions, tasting boxes, or payments.
- Paid placements, sponsored guides, or monetization experiments.
- Claimed Profile management and roaster dashboards.
- Public user profiles, public feeds, social following, or public Journal sharing.
- Public Visit Photo sharing or publishing.
- Roaster-submitted public galleries.
- Photo editing, cropping, filters, or creative image tooling.
- At-home coffee tracking or tasting entries.
- Bean-level inventory tracking or current product catalog management.
- Advanced search filters beyond basic Area and roaster discovery.
- Editorial guides beyond the initial Area pages.

## Further Notes

Initial Launch Area candidates discussed include Sonoma/Napa, San Francisco, Oakland/Berkeley, Los Angeles, San Diego, Sacramento, Santa Cruz, Orange County, and the Central Coast. The exact launch list can be finalized separately based on available Curated Roaster Data.

The product should feel like a trusted discovery layer for local California coffee exploration, with a private memory layer for the Local Coffee Lover. Its early value should come from clarity, curation, and useful Roast Quality Signals rather than breadth, reviews, or commerce.

The issue-tracker triage label expected for this PRD is `ready-for-agent`.
