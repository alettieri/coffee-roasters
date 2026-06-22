# ADR 0022: Deploy Nuxt to Cloudflare Workers with Nitro

Date: June 20, 2026

## Status

Accepted

## Context

ADR 0021 selects Nuxt. The application still needs server rendering, authenticated server operations, protected administration, Neon connectivity, R2 bindings, queue consumers, and scheduled tasks on Cloudflare Workers.

Nitro provides a Cloudflare Workers module preset, local Cloudflare emulation, access to bindings through the request event, and runtime hooks for Cloudflare Queues and scheduled tasks. This removes the OpenNext compatibility layer required by the superseded Next.js deployment decision.

## Decision

Deploy the Nuxt application to Cloudflare Workers using Nitro's `cloudflare_module` preset and Wrangler.

The implementation will:

- use Worker-compatible libraries and web platform APIs where practical;
- enable only required Node.js compatibility features;
- connect to Neon through a Workers-compatible driver;
- access R2 and other Cloudflare resources through bindings;
- expose queue and scheduled handlers through Nitro's Cloudflare integration;
- store secrets through Cloudflare secret management;
- use separate preview and production environments;
- verify production builds in the `workerd` runtime; and
- pin and deliberately upgrade Nuxt, Nitro, and Wrangler.

Dependencies requiring unsupported native Node.js behavior must be replaced, isolated, or covered by a separate decision.

This decision supersedes ADR 0008.

## Consequences

- Nuxt has a direct Cloudflare deployment path without OpenNext.
- Nitro provides one server runtime model for HTTP routes, bindings, queues, and scheduled work.
- Runtime compatibility must still be tested for Better Auth, Drizzle, Neon, Sentry, and image processing.
- Local Nuxt success alone does not prove production compatibility.
- Cloudflare Workers limits and pricing remain application constraints.
