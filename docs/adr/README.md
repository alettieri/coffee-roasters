# Architectural Decision Index

Read accepted ADRs as current policy. Obsolete ADR files are removed when they
would distract from the current system direction.

## Foundation and architecture

- ADR 0002: Single full-stack web application
- ADR 0004: PostgreSQL and Drizzle ORM
- ADR 0005: Neon hosting
- ADR 0019: Modular monolith
- ADR 0021: TypeScript, Vue, and Nuxt
- ADR 0022: Nuxt on Cloudflare Pages with Nitro
- ADR 0024: Thin Nitro server routes
- ADR 0026: Docker PostgreSQL for local development
- ADR 0034: Optimize for agentic development and low operations
- ADR 0035: Strict TypeScript, Nuxt ESLint, and Prettier
- ADR 0036: Environment topology and deployed database connectivity

## Identity, data, and product behavior

- ADR 0006: Better Auth
- ADR 0012: Zod boundary validation
- ADR 0017: PostgreSQL search
- ADR 0027: UUIDv7 and temporal types
- ADR 0028: Deletion, archival, and retention
- ADR 0029: Public catalog caching
- ADR 0030: Defer maps and automated geocoding
- ADR 0031: Defer bulk import
- ADR 0032: Typed expected errors
- ADR 0033: Native Vue form handling
- ADR 0037: V1 scope reset to personal roaster tracker

## Storage and asynchronous work

No active v1 storage or asynchronous-work decisions beyond the platform and
deployment decisions listed above.

## Interface

- ADR 0023: Tailwind CSS, shadcn-vue, and Reka UI

## Delivery and operations

- ADR 0010: Resend transactional email
- ADR 0013: Vitest and Playwright
- ADR 0015: Sentry and Cloudflare observability
- ADR 0016: GitHub Actions CI
- ADR 0018: Defer product analytics
