# Infrastructure Bootstrap Checklist

These are human-owned account and production-safety tasks. Coding
agents may document or verify them but must not perform them without
explicit authorization and credentials.

## Account security

- [ ] Enable MFA or passkeys for GitHub, Cloudflare, Neon, Resend, and Sentry.
- [ ] Store recovery codes outside the repository.
- [ ] Record account owners and recovery contacts.
- [ ] Enable GitHub Dependabot security updates.
- [ ] Keep GitHub secret scanning and push protection enabled.

## Naming and inventory

- [ ] Use the `coffee-roasters-production` prefix for required deployed resources.
- [ ] Treat preview and staging prefixes as future optional
      infrastructure until a specific issue authorizes them.
- [ ] Maintain an inventory of Pages, Hyperdrive, Neon, domain, Resend,
      Sentry, and GitHub environment identifiers.
- [ ] Add R2, Images, Queue, and Cron identifiers only when their
      product slices authorize those resources.
- [ ] Record region, purpose, owner, creation date, and deletion policy for each resource.

## Production deployment name contract

Record these names without values:

| Name                                     | Kind                                                  | Available to                          | Purpose                                                                            |
| ---------------------------------------- | ----------------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------- |
| `CLOUDFLARE_ACCOUNT_ID`                  | GitHub Actions variable                               | production deployment workflow        | Selects the Cloudflare account for Wrangler direct upload.                         |
| `CLOUDFLARE_PAGES_PROJECT_NAME`          | GitHub Actions variable                               | production deployment workflow        | Selects the production Pages project.                                              |
| `CLOUDFLARE_API_TOKEN`                   | GitHub Actions secret                                 | production deployment workflow        | Least-privilege token for Wrangler direct upload.                                  |
| `NEON_PRODUCTION_MIGRATION_DATABASE_URL` | GitHub Actions secret                                 | migration step only                   | Direct Neon connection for checked-in Drizzle migrations.                          |
| `PRODUCTION_HYPERDRIVE`                  | Cloudflare Pages binding                              | Pages runtime                         | Production Hyperdrive connection used by application traffic.                      |
| `NEON_PRODUCTION_APP_ROLE`               | inventory role name                                   | Pages runtime through Hyperdrive      | Least-privilege production database role for application queries and transactions. |
| `NEON_PRODUCTION_MIGRATION_ROLE`         | inventory role name                                   | migration step only                   | Production database role with schema-change permissions.                           |
| `BETTER_AUTH_SECRET`                     | Cloudflare Pages secret                               | Pages runtime                         | Authentication signing/encryption secret.                                          |
| `RESEND_API_KEY`                         | Cloudflare Pages secret                               | Pages runtime                         | Transactional email API credential.                                                |
| `SENTRY_DSN`                             | Cloudflare Pages variable or secret                   | Pages runtime                         | Application error reporting destination.                                           |
| `APP_ENV`                                | Cloudflare Pages variable                             | Pages runtime                         | Runtime environment label.                                                         |
| `APP_RELEASE`                            | GitHub Actions variable and Cloudflare Pages variable | deployment workflow and Pages runtime | Release identifier derived from the GitHub commit SHA.                             |
| `PRODUCTION_URL`                         | GitHub Actions variable                               | smoke-test step                       | Canonical production origin.                                                       |
| `PRODUCTION_SMOKE_HEALTH_URL`            | GitHub Actions variable                               | smoke-test step                       | Public or synthetic health-check URL.                                              |
| `PRODUCTION_SMOKE_PUBLIC_DISCOVERY_URL`  | GitHub Actions variable                               | smoke-test step                       | Public Discovery smoke-test URL that uses no private data.                         |

## Cloudflare

- [ ] Confirm the Cloudflare account and production DNS zone.
- [ ] Create the production Cloudflare Pages project without relying on
      Pages Git integration for required deployment.
- [ ] Record the production Pages project name and production branch.
- [ ] Record the build command `pnpm build` and output directory `dist/`.
- [ ] Record the planned direct-upload command shape: `pnpm wrangler
pages deploy dist/ --project-name <production-pages-project> --branch
main --commit-hash "$GITHUB_SHA"`.
- [ ] Configure production Pages variables, secrets, and bindings.
- [ ] Record the production Hyperdrive binding name.
- [ ] Record runtime application variable and secret names from the
      production deployment name contract without values.
- [ ] Defer R2, Images, Queues, and Cron bindings until product slices authorize them.
- [ ] Document how to pause or disable production deployment from GitHub Actions.
- [ ] Document the Pages rollback path from production deployment history.
- [ ] Confirm the external Pages project settings during provisioning
      because repository checks do not validate Cloudflare account
      configuration.
- [ ] Create a least-privilege Cloudflare API token for Wrangler direct upload.
- [ ] Store the Cloudflare API token name in GitHub Actions production
      deployment configuration without checking in its value.
- [ ] Document token rotation and emergency revocation.
- [ ] Pin and document the Wrangler compatibility date and compatibility flags.
- [ ] Configure budget or usage alerts.

## Neon

- [ ] Select the PostgreSQL major version and western United States region.
- [ ] Create the production branch or project.
- [ ] Create separate application and migration roles.
- [ ] Grant the production application role only the permissions runtime code needs.
- [ ] Grant the production migration role schema-change permissions
      needed by checked-in Drizzle migrations.
- [ ] Store the direct Neon migration credential only in the production
      deployment workflow configuration, unavailable to runtime code.
- [ ] Configure production Hyperdrive for runtime traffic using the
      least-privilege application role.
- [ ] Define recovery-point and recovery-time objectives.
- [ ] Confirm the available point-in-time restore window.
- [ ] Restore into a separate branch and verify recovery before storing meaningful Journal data.
- [ ] Configure budget or usage alerts.

## Domain and email

- [ ] Choose the production domain and canonical apex or `www` form.
- [ ] Configure redirects and TLS through Cloudflare.
- [ ] Create a dedicated transactional email subdomain such as `auth.example.com`.
- [ ] Configure Resend SPF and DKIM.
- [ ] Start DMARC monitoring and define the path toward enforcement.
- [ ] Define production verification and recovery origins.

## GitHub delivery

- [ ] Create a `main` ruleset after CI checks exist.
- [ ] Require pull requests and required checks, with an explicit owner bypass policy.
- [ ] Ensure workflow tokens and third-party actions use least privilege.
- [ ] Create protected production deployment configuration before adding the deployment workflow.
- [ ] Use the production deployment name contract for required
      production variable, secret, binding, and release identifier names.
- [ ] Plan deployment only after CI succeeds on `main`.
- [ ] Plan production deployment concurrency so one migration/upload runs at a time.
- [ ] Keep pull request workflows credential-free.

## Recovery and operations

- [ ] Document application rollback without destructive database rollback.
- [ ] Document production smoke tests that use public or synthetic
      checks and no private production data.
- [ ] Document credential rotation and account-loss recovery.
- [ ] Verify structured logs and sensitive-data redaction before authentication is deployed.
- [ ] Add Sentry before private Journal data reaches production.
- [ ] Review actual cost and usage after the first production month.
