# ADR 0019: Organize the Application as a Modular Monolith

Date: June 20, 2026

## Status

Accepted

## Context

V1 is a single full-stack Nuxt application, but it contains several distinct capabilities: a public Roaster Catalog, private personal tracking and Visits, admin curation, and identity and authorization.

Organizing application behavior directly around Vue pages, Nitro server routes, or database tables would couple domain rules to framework entry points and make ownership, authorization, and testing harder to reason about.

Separating these capabilities into independently deployed services would add network contracts and operational overhead without a concrete scaling or ownership need.

## Decision

Organize the application as a modular monolith around domain capabilities.

The initial modules are:

- **Catalog**: public Coffee Roasters, Roaster Profiles, visibility state, and public outbound links.
- **Tracking**: `My Roasters`, private Roaster Tracking State, repeat Visits, Visit Date, private notes, private Visit Ratings, and Visit ownership.
- **Curation**: Admin-only Roaster creation, editing, publication, and hiding.
- **Identity and Access**: Better Auth integration, Coffee Lover identity, session handling, ownership policies, and admin authorization.

Each module will:

- expose explicit application operations rather than raw table access;
- own its domain policies and module-specific data access;
- validate inputs at its public boundary;
- return domain-oriented results and errors;
- avoid importing Nuxt, Nitro, Vue component, request-event, or rendering types; and
- provide focused seams for Vitest and Playwright verification.

Nuxt pages, Vue components, and Nitro server routes will remain thin adapters that:

1. parse transport input;
2. establish the authenticated actor when required;
3. invoke one or more application operations;
4. map results to UI or HTTP responses; and
5. perform framework-specific cache or navigation behavior.

Cross-module access must use an exported operation or explicitly shared contract rather than importing another module's private repository or schema internals. Shared technical utilities must not become a dumping ground for domain behavior.

All modules remain in one deployable application and may share one PostgreSQL database. Module boundaries are code ownership boundaries, not separate services or database schemas.

## Consequences

- Domain behavior remains understandable independently of Nuxt and Vue.
- Public, private, asynchronous, and administrative entry points can reuse the same operations.
- Module dependency direction must be reviewed and enforced through directory conventions, lint rules, or architecture tests.
- Some workflows, such as publishing a Roaster or adding a Visit for an untracked Roaster, cross module boundaries and require explicit orchestration.
- Sharing one database simplifies transactions but permits accidental coupling unless private data-access code remains encapsulated.
- A module may be extracted later if measured operational or ownership needs justify a service boundary.
