# ADR 0022: Deploy Nuxt to Cloudflare Pages with Nitro

Date: June 20, 2026

## Status

Accepted

## Context

ADR 0021 selects Nuxt. The application still needs server rendering, authenticated server operations, protected administration, Neon connectivity, R2 bindings, queue consumers, and scheduled tasks in the Cloudflare deployment runtime.

Nitro provides a `cloudflare_pages` preset, local Cloudflare emulation, access to bindings through the request event, and runtime hooks for Cloudflare Queues and scheduled tasks. This removes the OpenNext compatibility layer required by the superseded Next.js deployment decision.

## Decision

Deploy the Nuxt application to Cloudflare Pages using Nitro's `cloudflare_pages` preset and Cloudflare Pages Git integration.

The implementation will:

- use Worker-compatible libraries and web platform APIs where practical;
- enable only required Node.js compatibility features;
- connect to Neon through environment-specific Hyperdrive bindings under ADR 0036;
- access R2 and other Cloudflare resources through bindings;
- expose queue and scheduled handlers through Nitro's Cloudflare integration;
- store secrets through Cloudflare Pages project variables and secrets;
- use a single Pages project with a designated production branch and a shared preview or staging branch when needed;
- rely on automatic preview deployments for non-production branches unless branch control disables them;
- verify production builds in the `workerd` runtime; and
- pin and deliberately upgrade Nuxt, Nitro, Wrangler, and the Pages deployment configuration.

The default build command is `pnpm build`, which runs `nuxt build`, and the Pages build output directory is `dist/`.

No branch-specific build override is required for the current default build flow. If future staging or production divergence appears, use the Pages branch-specific build-command control documented in Cloudflare Pages rather than adding GitHub deployment logic.

Dependencies requiring unsupported native Node.js behavior must be replaced, isolated, or covered by a separate decision.

This decision supersedes ADR 0008.

## Consequences

- Nuxt has a direct Cloudflare deployment path without OpenNext.
- Nitro provides one server runtime model for HTTP routes, bindings, queues, and scheduled work.
- Runtime compatibility must still be tested for Better Auth, Drizzle, Neon, Sentry, and image processing.
- Local Nuxt success alone does not prove production compatibility.
- Cloudflare Pages deployment controls include Git integration, branch control, and rollback to a previous successful production deployment.
- Preview deployments are not valid rollback targets.
- Cloudflare runtime limits and pricing remain application constraints.
