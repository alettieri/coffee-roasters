# ADR 0019: Organize the Application as a Modular Monolith

Date: June 20, 2026

## Status

Accepted

## Context

V1 is a single full-stack Nuxt application, but it contains several distinct capabilities: Public Discovery, private Journals and Visits, Visit Photo processing, Suggestions, Curated Roaster Data administration, and identity and authorization.

Organizing application behavior directly around Vue pages, Nitro server routes, or database tables would couple domain rules to framework entry points and make ownership, authorization, and testing harder to reason about.

Separating these capabilities into independently deployed services would add network contracts and operational overhead without a concrete scaling or ownership need.

## Decision

Organize the application as a modular monolith around domain capabilities.

The initial modules are:

- **Discovery**: Areas, Area Roaster Lists, Roaster Previews, Roaster Profiles, Public Signals, and Roast Quality Signals.
- **Journal**: Journals, Visits, Visit Date, notes, personal impressions, and Visit ownership.
- **Visit Photos**: upload authorization, processing states, captions, Visit Cover Photos, storage, sanitization, and deletion.
- **Suggestions**: missing Coffee Roaster and correction submissions plus review state.
- **Curation**: Curated Roaster Data, internal source and verification notes, publication, and protected admin workflows.
- **Identity and Access**: Better Auth integration, Local Coffee Lover identity, session handling, ownership policies, and maintainer authorization.

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
- Some workflows, such as publishing an accepted Suggestion or processing a Visit Photo, cross module boundaries and require explicit orchestration.
- Sharing one database simplifies transactions but permits accidental coupling unless private data-access code remains encapsulated.
- A module may be extracted later if measured operational or ownership needs justify a service boundary.
