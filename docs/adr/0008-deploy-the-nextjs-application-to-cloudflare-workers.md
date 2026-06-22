# ADR 0008: Deploy the Next.js Application to Cloudflare Workers

Date: June 19, 2026

## Status

Superseded by ADR 0022

## Context

The application uses Next.js App Router and Cloudflare R2. It needs server rendering for Public Discovery, authenticated server operations for Journals, protected administrative routes, and direct access to managed PostgreSQL on Neon.

Cloudflare Workers supports the required Next.js features through the Cloudflare OpenNext adapter, including App Router, route handlers, React Server Components, server-side rendering, static generation, incremental static regeneration, Server Actions, middleware, and response streaming.

The production runtime is `workerd`, not a full Node.js server. Local development through the Next.js development server alone cannot establish production compatibility.

## Decision

Deploy the Next.js application to Cloudflare Workers using `@opennextjs/cloudflare` and Wrangler.

The implementation will:

- enable only the Node.js compatibility features required by application dependencies;
- use Worker-compatible libraries and web platform APIs where practical;
- connect to Neon using a Cloudflare Workers-compatible connection strategy;
- access R2 through a binding where server-side object access is required;
- store runtime secrets through Cloudflare secret management;
- use separate Cloudflare environments for preview and production;
- run production-representative previews and integration tests in the `workerd` runtime before deployment;
- treat successful execution in the Node.js development server as insufficient deployment verification; and
- pin and deliberately upgrade Next.js, the OpenNext adapter, and Wrangler.

The application will not depend on unsupported Node.js middleware behavior. Any dependency that requires native Node.js binaries or unsupported runtime APIs must be replaced, isolated in another execution environment, or covered by a separate architectural decision.

## Consequences

- The application and Visit Photo storage share the Cloudflare platform and can use native bindings.
- Public and authenticated application code can run close to Local Coffee Lovers.
- Next.js compatibility depends on the OpenNext adapter rather than Vercel's native runtime.
- Runtime compatibility must be tested explicitly, particularly for Better Auth, Drizzle, Neon connectivity, and image processing.
- Native image libraries such as standard Node.js `sharp` builds cannot be assumed to work in Workers.
- Visit Photo sanitization must use a Worker-compatible decoder and encoder, a Cloudflare image capability that produces sanitized bytes, or a separately deployed processing service.
- Framework features unsupported by the adapter cannot be adopted without evaluating an alternative implementation.
- Cloudflare Workers limits and pricing become application-level operational constraints.
