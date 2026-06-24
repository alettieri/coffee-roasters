# Architectural Decision Index

Read accepted ADRs as current policy. Superseded ADRs remain only to preserve decision history.

## Foundation and architecture

- ADR 0001: Private admin interface
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
- ADR 0025: Closed email and password authentication
- ADR 0027: UUIDv7 and temporal types
- ADR 0028: Deletion, archival, and retention
- ADR 0029: Public-only caching
- ADR 0030: Defer maps and automated geocoding
- ADR 0031: Defer bulk import
- ADR 0032: Typed expected errors
- ADR 0033: Native Vue form handling

## Storage and asynchronous work

- ADR 0007: Private Visit Photos in R2
- ADR 0009: Cloudflare Images sanitization
- ADR 0014: Queues and Cron Triggers

## Interface

- ADR 0023: Tailwind CSS, shadcn-vue, and Reka UI

## Delivery and operations

- ADR 0010: Resend transactional email
- ADR 0013: Vitest and Playwright
- ADR 0015: Sentry and Cloudflare observability
- ADR 0016: GitHub Actions CI
- ADR 0018: Defer product analytics

## Superseded

- ADR 0003: Next.js App Router — superseded by ADR 0021
- ADR 0008: Next.js deployment through OpenNext — superseded by ADR 0022
- ADR 0011: React shadcn/ui and Radix — superseded by ADR 0023
- ADR 0020: Next.js Server Actions — superseded by ADR 0024
