# ADR 0021: Use TypeScript, Vue, and Nuxt

Date: June 20, 2026

## Status

Accepted

## Context

ADR 0003 originally selected Next.js App Router. Before implementation began, learning Vue and Nuxt became an explicit goal of this personal project.

V1 still requires indexable Area and Roaster Profile pages, authenticated Journal workflows, Visit Photo management, Suggestions, and a protected admin section. Nuxt supports server rendering, file-based routing, server-side operations through Nitro, and deployment to Cloudflare Workers.

## Decision

Use strict TypeScript, Vue, and Nuxt for the v1 application.

The implementation will:

- use Vue Single-File Components and the Composition API;
- use server rendering for indexable Public Discovery pages;
- keep secrets, privileged data access, and authorization in server-side code;
- use client-side interactivity only where the workflow requires it;
- use Nuxt pages and middleware as presentation and navigation adapters;
- use Nitro for server-side transport and runtime integration; and
- keep domain rules independent of Vue, Nuxt, and Nitro types.

This decision supersedes ADR 0003.

## Consequences

- The project provides a substantive environment for learning Vue and Nuxt.
- Public, authenticated, and administrative workflows remain in one full-stack application.
- Vue and Nuxt have a smaller ecosystem and smaller body of agent-generated examples than React and Next.js.
- Framework learning may slow initial delivery, which is acceptable for this personal project.
- Framework-specific code remains outside modular application operations.
