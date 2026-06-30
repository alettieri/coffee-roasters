# ADR 0022: Deploy Nuxt to Cloudflare Pages with Nitro

Date: June 20, 2026

## Status

Accepted

## Context

ADR 0021 selects Nuxt. The application still needs server rendering,
authenticated server operations, protected administration, and Neon
connectivity in the Cloudflare deployment runtime.

Nitro provides a `cloudflare_pages` preset, local Cloudflare emulation,
and access to bindings through the request event.

Issue #5 narrows initial deployment planning to production-only
Cloudflare Pages delivery. Preview and staging deployments remain future
optional infrastructure until an issue explicitly authorizes their planning or
provisioning.

## Decision

Deploy the Nuxt application to Cloudflare Pages using Nitro's
`cloudflare_pages` preset and Wrangler direct upload. Do not use
Cloudflare Pages Git integration for the required production deployment
path.

The implementation will:

- use Worker-compatible libraries and web platform APIs where practical;
- enable only required Node.js compatibility features;
- connect to Neon through the production Hyperdrive binding under ADR 0036;
- store runtime secrets through Cloudflare Pages production variables and secrets;
- use a production Pages project and production branch;
- treat previews as future optional infrastructure, not a required environment;
- verify production builds in the `workerd` runtime; and
- pin and deliberately upgrade Nuxt, Nitro, Wrangler, and the Pages deployment configuration.

The default build command is `pnpm build`, which runs `nuxt build`
with Nitro's `cloudflare_pages` preset. The Pages build output
directory is `dist/`.

The planned production upload command shape is:

```sh
pnpm exec wrangler pages deploy dist/ --project-name <production-pages-project> --branch main --commit-hash "$APP_RELEASE"
```

The production deployment workflow will run from GitHub Actions after
required CI succeeds on `main`. It must run checked-in Drizzle
migrations against Neon through the direct production migration
credential before the Wrangler upload. Failed migrations block the
upload.

Runtime traffic must use the production Hyperdrive binding and a
least-privilege production application database role. The direct Neon
migration credential must be available only to the controlled migration
step and must not be exposed to Pages runtime code, client code, pull
request workflows, logs, or build artifacts.

Production deployment configuration uses this no-values naming contract:

| Name                                    | Kind                                                  | Available to                          | Purpose                                                                            |
| --------------------------------------- | ----------------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------- |
| `CLOUDFLARE_ACCOUNT_ID`                 | GitHub Actions variable                               | production deployment workflow        | Selects the Cloudflare account for Wrangler direct upload.                         |
| `CLOUDFLARE_PAGES_PROJECT_NAME`         | GitHub Actions variable                               | production deployment workflow        | Selects the production Pages project.                                              |
| `CLOUDFLARE_API_TOKEN`                  | GitHub Actions secret                                 | production deployment workflow        | Least-privilege token for Wrangler direct upload.                                  |
| `MIGRATION_DATABASE_URL`                | GitHub Actions secret                                 | migration step only                   | Direct Neon connection for checked-in Drizzle migrations.                          |
| `PRODUCTION_HYPERDRIVE`                 | Cloudflare Pages binding                              | Pages runtime                         | Production Hyperdrive connection used by application traffic.                      |
| `NEON_PRODUCTION_APP_ROLE`              | inventory role name                                   | Pages runtime through Hyperdrive      | Least-privilege production database role for application queries and transactions. |
| `NEON_PRODUCTION_MIGRATION_ROLE`        | inventory role name                                   | migration step only                   | Production database role with schema-change permissions.                           |
| `BETTER_AUTH_SECRET`                    | Cloudflare Pages secret                               | Pages runtime                         | Authentication signing/encryption secret.                                          |
| `RESEND_API_KEY`                        | Cloudflare Pages secret                               | Pages runtime                         | Transactional email API credential.                                                |
| `SENTRY_DSN`                            | Cloudflare Pages variable or secret                   | Pages runtime                         | Application error reporting destination.                                           |
| `APP_ENV`                               | Cloudflare Pages variable                             | Pages runtime                         | Runtime environment label; production value is configured outside the repository.  |
| `APP_RELEASE`                           | GitHub Actions variable and Cloudflare Pages variable | deployment workflow and Pages runtime | Release identifier derived from the GitHub commit SHA.                             |
| `PRODUCTION_URL`                        | GitHub Actions variable                               | smoke-test step                       | Canonical production origin.                                                       |
| `PRODUCTION_SMOKE_HEALTH_URL`           | GitHub Actions variable                               | smoke-test step                       | Public or synthetic health-check URL.                                              |
| `PRODUCTION_SMOKE_PUBLIC_DISCOVERY_URL` | GitHub Actions variable                               | smoke-test step                       | Public Roaster Discovery smoke-test URL that uses no private data.                 |

Rollback uses Cloudflare Pages deployment history to restore a prior
successful production deployment. Database rollback must not be
assumed; migrations must be forward-compatible and recovery must use a
separate, explicit database restore plan when needed.

Dependencies requiring unsupported native Node.js behavior must be replaced, isolated, or covered by a separate decision.

## Consequences

- Nuxt has a direct Cloudflare deployment path without OpenNext.
- Nitro provides one server runtime model for HTTP routes and Cloudflare bindings.
- Runtime compatibility must still be tested for Better Auth, Drizzle, Neon,
  Resend, and Sentry.
- Local Nuxt success alone does not prove production compatibility.
- Repository checks validate the application build and runtime seams,
  but Cloudflare Pages project settings, production variables, secrets,
  and bindings must still be confirmed during external provisioning.
- GitHub Actions becomes the planned production deployment coordinator after main-branch CI succeeds.
- Cloudflare Pages deployment controls include direct-upload
  deployment history and rollback to a previous successful production
  deployment.
- Preview deployments are optional future infrastructure and are not
  valid production rollback targets.
- Cloudflare runtime limits and pricing remain application constraints.
