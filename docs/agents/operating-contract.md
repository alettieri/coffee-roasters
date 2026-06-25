# Repository Operating Contract

This document defines how humans and coding agents work in this repository.

## Source precedence

When instructions conflict, use this order:

1. The current GitHub implementation issue.
2. Accepted ADRs listed in `docs/adr/README.md`.
3. `docs/coffee-roaster-discovery-v1-prd.md`.
4. `CONTEXT.md`.
5. Briefs, superseded ADRs, and other historical documents.

Do not silently resolve a conflict. Report it and update the higher-priority source when authorized.

## Work authorization

- Repository code, tests, and documentation may be changed when the assigned issue requests them.
- Do not create, modify, or delete Cloudflare, Neon, Resend, Sentry, DNS, domain, GitHub environment, secret, or production resources unless the issue explicitly authorizes that external change and the user has provided the required authority.
- Cloud provisioning and production deployment are human-gated activities.
- Never use production data or credentials in local development or CI.
- Never commit secrets. Checked-in environment examples contain names and safe descriptions only.

## Definition of done

An implementation issue is complete only when:

- all acceptance criteria are satisfied;
- the narrow relevant checks pass;
- the repository-level `check` command passes once it exists;
- migrations and generated artifacts follow repository policy;
- user-visible behavior is tested at the highest practical seam;
- documentation reflects changed commands or operational behavior; and
- no unrelated changes are included.

## Planned module layout

Use the modular-monolith boundaries from ADR 0019:

```text
app/                         Nuxt pages, layouts, Vue components, composables
server/api/                  thin Nitro HTTP adapters
server/modules/
  discovery/
  journal/
  visit-photos/
  suggestions/
  curation/
  identity-access/
server/platform/             database and external-provider adapters
tests/
  unit/
  integration/
  acceptance/
  fixtures/
```

Domain modules must not depend on Vue, Nuxt, Nitro request events, or provider SDK types. Cross-module work uses exported operations or contracts rather than private repositories.

## Database and migration policy

- Drizzle schema declarations and generated SQL migrations are committed.
- Review generated SQL before committing it.
- Never edit a migration that has been applied outside a disposable local or CI database.
- Production uses migration commands, never schema push or synchronization.
- Preview or staging environments, if added later, use migration commands, never schema push or synchronization.
- Use forward-compatible expand/contract changes for deployed databases.
- Handwritten SQL belongs in an explained migration when Drizzle cannot express the required constraint or operation.
- Runtime application credentials do not own the schema. Migration credentials are separate.

## Generated-file policy

- Do not commit `.nuxt`, `.output`, coverage, Playwright reports, Wrangler local state, local R2 data, or secrets.
- Generated Cloudflare binding types must be reproducible through a documented command. Commit them only if the project deliberately chooses committed generated types.
- Lockfiles and Drizzle migration metadata are committed.

## Environment matrix

| Environment | Compute                                         | Database                       | External access                       |
| ----------- | ----------------------------------------------- | ------------------------------ | ------------------------------------- |
| Local       | Nuxt development and local Cloudflare emulation | Docker PostgreSQL              | No production services                |
| CI          | GitHub-hosted runner                            | Disposable PostgreSQL service  | No deployment credentials             |
| Production  | Cloudflare Pages production deployment          | Neon production branch/project | Production-only secrets and resources |

Production is the only required deployed environment. Preview and staging environments are future optional infrastructure; do not create per-PR, preview, or staging Cloudflare or Neon resources until a specific issue authorizes them.

The planned production deployment path is GitHub Actions after required CI succeeds on `main`, then direct Neon migrations, then Wrangler direct upload to Cloudflare Pages. Failed migrations block upload. Runtime traffic uses production Hyperdrive and a least-privilege application role; the direct Neon migration credential must not be available to runtime code.

## Test layers

- Pull requests: formatting, linting, type checking, unit tests, local database integration tests, and production build.
- Main or relevant runtime changes: local `workerd` acceptance tests.
- Release or provider-sensitive changes: bounded human-gated checks against the deployed production path or a separately authorized preview environment.
- Cloudflare Images metadata-removal tests require canonical-output inspection in a real Cloudflare integration after the Visit Photo product slice provisions Images and R2, because local emulation is not fully equivalent.

Tests use deterministic clocks and identifiers where behavior depends on them, isolated database state, explicit two-account privacy fixtures, and synthetic security fixtures. Do not derive fixtures from production.

## Dependency and workflow policy

- Pin Node.js, pnpm, framework, deployment, and action versions deliberately.
- Pin third-party GitHub Actions to full commit SHAs.
- GitHub workflow jobs declare minimum permissions, timeouts, and concurrency behavior.
- Do not use `pull_request_target` with untrusted checkout.
- Dependency updates must pass the same checks as application changes.
- Production deployment workflows, once added, must use protected production credentials, Wrangler direct upload, release identifiers, rollback documentation, and smoke tests without exposing secrets or private data.
