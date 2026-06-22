# ADR 0003: Use TypeScript and Next.js App Router

Date: June 19, 2026

## Status

Superseded by ADR 0021

## Context

The v1 product is a single full-stack web application. It needs indexable Area and Roaster Profile pages, authenticated Journal workflows, Visit Photo management, Suggestions, and a protected admin section.

The repository already uses Node.js and pnpm. A framework should support server rendering, server-side application operations, route-level access control, and one deployment boundary without requiring a separate API.

## Decision

Use TypeScript and Next.js App Router for the v1 application.

The implementation will:

- use server-rendered public pages where useful for discovery and indexing;
- keep secrets, privileged data access, and authorization checks in server-side code;
- use client-side components only where browser interactivity requires them;
- keep domain rules separate from Next.js route and rendering concerns; and
- use strict TypeScript settings.

The framework's major version is a separate decision. ADR 0008 selects Cloudflare Workers as the deployment provider.

## Consequences

- The application can implement public, authenticated, and administrative workflows in one codebase.
- Public metadata and server rendering can support indexable Area and Roaster Profile pages.
- The team must maintain clear server/client boundaries.
- Domain logic must not become coupled to React components or framework request objects.
- Framework upgrades and hosting capabilities will affect caching, image handling, and runtime choices.
