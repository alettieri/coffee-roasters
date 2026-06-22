# Coffee Roaster Discovery

This context describes the language for a California-focused discovery product for people who care about finding quality local coffee roasters.

## Language

**Local Coffee Lover**:
A person in or interested in a California area who seeks quality coffee roasters nearby.
_Avoid_: User, consumer, buyer

**Coffee Roaster**:
An own-brand coffee roasting business with California relevance that can be discovered by people looking for quality local coffee.
_Avoid_: Cafe, shop, vendor

**Roast Quality**:
The perceived craft and consistency of a **Coffee Roaster**'s roasted coffee.
_Avoid_: Rating, ranking

**Roast Quality Signal**:
Observable evidence that helps a **Local Coffee Lover** judge a **Coffee Roaster**'s **Roast Quality**.
_Avoid_: Score, badge, rating

**Area**:
A California place used by a **Local Coffee Lover** to discover nearby **Coffee Roasters**.
_Avoid_: Market, territory, radius

**Visit**:
A journal entry recording a **Local Coffee Lover**'s in-person experience with a **Coffee Roaster** at a **Roaster Location** and a point in time.
_Avoid_: Check-in, visited flag

**Visit Date**:
The day a **Visit** occurred.
_Avoid_: Timestamp, logged at

**Journal**:
A private collection of a **Local Coffee Lover**'s **Visits**.
_Avoid_: Feed, public profile, review history

**Public Discovery**:
The unauthenticated experience of finding **Coffee Roasters** by **Area** and profile information.
_Avoid_: Guest mode

**Area Discovery**:
The discovery path where a **Local Coffee Lover** starts with an **Area** to find relevant **Coffee Roasters**.
_Avoid_: Location search, radius search

**Area Roaster List**:
A list of **Coffee Roasters** associated with an **Area**, presented for discovery rather than ranking.
_Avoid_: Ranking, leaderboard, map results

**Roaster Preview**:
A brief representation of a **Coffee Roaster** in an **Area Roaster List** that helps a **Local Coffee Lover** decide whether to view the roaster.
_Avoid_: Listing card, search result

**Roaster Profile**:
A detailed view of a **Coffee Roaster** that supports a **Local Coffee Lover**'s decision, action, and personal memory.
_Avoid_: Microsite, business dashboard

**Roaster Location**:
A physical place associated with a **Coffee Roaster** that a **Local Coffee Lover** may visit.
_Avoid_: Coffee Roaster, cafe profile

**California Relevance**:
A **Coffee Roaster**'s meaningful connection to California through roasting, public locations, origin, or coffee culture.
_Avoid_: Ships to California

**Launch Area**:
An **Area** intentionally included in the initial product because it can support useful **Area Discovery**.
_Avoid_: Complete coverage, every city

**Curated Roaster Data**:
Roaster information intentionally gathered and maintained for the product's discovery experience.
_Avoid_: Scraped listings, open submissions

**Public Signal**:
A visible fact or observation that explains why a **Coffee Roaster** may be relevant to a **Local Coffee Lover**.
_Avoid_: Internal note, claim, score

**Suggestion**:
A proposed correction or missing **Coffee Roaster** submitted for review before it changes **Curated Roaster Data**.
_Avoid_: Edit, wiki contribution

**Claimed Profile**:
A **Roaster Profile** managed directly by its associated **Coffee Roaster**.
_Avoid_: Suggestion, correction

**Visit Photo**:
A private photo attached to a **Visit** to help a **Local Coffee Lover** remember the in-person experience.
_Avoid_: Public gallery photo, roaster profile image

**Photo Caption**:
Optional text attached to a **Visit Photo** to describe what the photo helps the **Local Coffee Lover** remember.
_Avoid_: Review, tasting note

**Visit Cover Photo**:
The **Visit Photo** used to visually represent a **Visit** in the **Journal**.
_Avoid_: Roaster profile image

## Relationships

- A **Local Coffee Lover** discovers one or more **Coffee Roasters**
- A **Local Coffee Lover** can use **Public Discovery** without a **Journal**
- A **Local Coffee Lover** may use **Area Discovery** to find **Coffee Roasters**
- A **Local Coffee Lover** may record multiple **Visits**
- A **Journal** belongs to one **Local Coffee Lover**
- A **Journal** contains zero or more **Visits**
- A **Coffee Roaster** may serve one or more **Areas**
- A **Coffee Roaster** may have zero or more **Roaster Locations**
- A **Roaster Location** belongs to one **Coffee Roaster**
- A **Roaster Location** may belong to one **Area**
- A **Coffee Roaster** has **Roast Quality**
- A **Roast Quality Signal** supports judgment of **Roast Quality**
- A **Visit** belongs to one **Local Coffee Lover** and one **Coffee Roaster**
- A **Visit** references one **Roaster Location**
- A **Visit** has one **Visit Date**
- A **Visit** may have zero or more **Visit Photos**
- A **Visit Photo** may have one **Photo Caption**
- A **Visit** may have one **Visit Cover Photo**
- A **Coffee Roaster** must have **California Relevance**
- A **Launch Area** is an **Area**
- **Curated Roaster Data** describes **Coffee Roasters**, **Areas**, and **Roaster Locations**
- A **Roast Quality Signal** may be a **Public Signal**
- A **Local Coffee Lover** may submit a **Suggestion**
- A **Suggestion** may update **Curated Roaster Data** only after review
- A **Claimed Profile** is a future form of **Roaster Profile**

## Example dialogue

> **Dev:** "When a **Local Coffee Lover** searches a city, are they looking for cafes or **Coffee Roasters**?"
> **Domain expert:** "They are looking for **Coffee Roasters** first, even if some also operate cafes."
>
> **Dev:** "If someone is visiting a new city, should the result be places or **Coffee Roasters**?"
> **Domain expert:** "The discovery path starts with an **Area**, but the result is still **Coffee Roasters**."
>
> **Dev:** "Is a prior stop at a roaster just a checkbox?"
> **Domain expert:** "No — a **Visit** is a repeatable journal entry, because the same person may return and try different coffee."
>
> **Dev:** "Should we rank every **Coffee Roaster** by **Roast Quality**?"
> **Domain expert:** "No — show **Roast Quality Signals** so people can judge for themselves."

## Flagged ambiguities

- "Local California coffee lovers" was resolved as **Local Coffee Lover**, the primary audience for the initial product.
- "Quality" was narrowed to **Roast Quality** for the initial product discussion.
- Explicit ratings and rankings were rejected for v1 in favor of **Roast Quality Signals**.
- The product is **Coffee Roaster**-first, while **Area** remains a primary discovery path.
- **Area** was resolved as a named California discovery area, not a strict distance radius.
- "Track the places I've been" was resolved as repeatable **Visits**, not a simple visited flag.
- **Visit** was resolved as an in-person experience; at-home coffee tracking is outside the initial meaning.
- The minimum meaningful **Visit** is a **Coffee Roaster**, **Roaster Location**, and **Visit Date**.
- **Journal** was resolved as private by default for v1.
- **Public Discovery** does not require sign-in; a **Journal** does.
- The v1 home experience should lead with **Area Discovery**.
- An **Area** should initially present an **Area Roaster List**, not a map-first or ranking-first view.
- An **Area Roaster List** contains **Roaster Previews**.
- A **Roaster Preview** may lead to a **Roaster Profile**.
- A **Roaster Profile** may support recording a **Visit**.
- **Coffee Roaster** and **Roaster Location** are distinct; one roaster may have multiple physical locations.
- A **Coffee Roaster** does not need a public **Roaster Location** to belong in the product.
- An in-person **Visit** requires a **Roaster Location**.
- A non-roasting cafe is not a **Coffee Roaster**, even if it serves high-quality coffee.
- Corporate ownership does not disqualify a **Coffee Roaster** if it still roasts coffee under its own brand and is California-relevant.
- "Independent" was rejected as a strict inclusion rule; own-brand roasting and California relevance matter more than ownership structure.
- **California Relevance** includes California roasting, public California locations, or meaningful California origin; shipping to California alone is not enough.
- Initial coverage should use selected **Launch Areas** rather than every California city.
- Initial **Coffee Roaster** information should come from **Curated Roaster Data**, not scraping or open submissions.
- Public **Roaster Profiles** should show lightweight **Public Signals** while keeping source and verification notes internal.
- Local Coffee Lovers may submit **Suggestions**, but public data should not change without review.
- **Claimed Profile** management should wait; roaster corrections should initially use reviewed **Suggestions**.
- **Visit Photos** should be private and attached to **Visits** for v1.
- **Visit Photos** are for personal memory, not visit proof or **Roast Quality** evaluation.
- **Visit Photos** are optional for a **Visit**.
- A **Visit** may include multiple **Visit Photos**.
- **Photo Captions** are optional and attached to individual **Visit Photos**.
- Hidden location metadata from **Visit Photos** should not be preserved or used.
- **Visit Photos** may be added, deleted, and captioned after upload; image editing is outside v1.
- A **Visit Cover Photo** may represent a **Visit** in the **Journal** when photos exist.
- **Visit Photos** should not have public sharing or publishing in v1.
