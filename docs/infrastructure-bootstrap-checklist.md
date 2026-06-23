# Infrastructure Bootstrap Checklist

These are human-owned account and production-safety tasks. Coding agents may document or verify them but must not perform them without explicit authorization and credentials.

## Account security

- [ ] Enable MFA or passkeys for GitHub, Cloudflare, Neon, Resend, and Sentry.
- [ ] Store recovery codes outside the repository.
- [ ] Record account owners and recovery contacts.
- [ ] Enable GitHub Dependabot security updates.
- [ ] Keep GitHub secret scanning and push protection enabled.

## Naming and inventory

- [ ] Use `coffee-roasters-staging` and `coffee-roasters-production` prefixes.
- [ ] Maintain an inventory of Worker, Hyperdrive, Neon, R2, Queue, domain, Resend, Sentry, and GitHub environment identifiers.
- [ ] Record region, purpose, owner, creation date, and deletion policy for each resource.

## Cloudflare

- [ ] Confirm the Cloudflare account and production DNS zone.
- [ ] Create separate least-privilege staging and production API tokens.
- [ ] Store production tokens only in the protected GitHub production environment.
- [ ] Document token rotation and emergency revocation.
- [ ] Pin and document the Wrangler compatibility date and compatibility flags.
- [ ] Configure budget or usage alerts.

## Neon

- [ ] Select the PostgreSQL major version and western United States region.
- [ ] Create isolated staging and production branches or projects.
- [ ] Create separate application and migration roles.
- [ ] Configure Hyperdrive separately for staging and production.
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
- [ ] Define staging and production verification and recovery origins.

## GitHub delivery

- [ ] Create a `main` ruleset after CI checks exist.
- [ ] Require pull requests and required checks, with an explicit owner bypass policy.
- [ ] Create separate staging and production GitHub environments.
- [ ] Require production approval if desired.
- [ ] Ensure workflow tokens and third-party actions use least privilege.

## Recovery and operations

- [ ] Document application rollback without destructive database rollback.
- [ ] Document credential rotation and account-loss recovery.
- [ ] Verify structured logs and sensitive-data redaction before authentication is deployed.
- [ ] Add Sentry before private Journal data reaches production.
- [ ] Review actual cost and usage after the first production month.
