# ADR 0001: Manage Curated Roaster Data Through a Private Admin Interface

Date: June 19, 2026

## Status

Accepted

## Context

Public Discovery depends on reviewed Curated Roaster Data. Local Coffee Lovers and Coffee Roaster representatives may submit Suggestions, but those Suggestions must not modify public data until a product maintainer reviews them.

Maintainers need a reliable way to create and update Coffee Roasters, Areas, Roaster Locations, Public Signals, and Roast Quality Signals, as well as accept or reject Suggestions.

## Decision

Provide a private admin interface for maintainers to manage Curated Roaster Data and review Suggestions.

The admin interface must:

- require authenticated, explicitly authorized maintainer access;
- keep pending Suggestions separate from published Curated Roaster Data;
- support review before publication;
- retain internal source, verification, and uncertainty notes without exposing them through Public Discovery; and
- enforce the same domain invariants as other application entry points.

The admin interface will be implemented as a protected section of the main application. It will share the application's deployment, data access, and domain logic rather than run as a separately deployed system.

## Consequences

- Administrative workflows become part of the v1 application scope.
- The technology stack must support authentication and role-based authorization.
- Curated Roaster Data should live in an application data store rather than only in repository-managed files.
- Maintainer actions should be auditable enough to determine who published a change and when.
- Administrative routes must be inaccessible to authenticated Local Coffee Lovers who are not explicitly authorized maintainers.
- A single deployment reduces v1 operational overhead and avoids duplicating domain logic.
- The admin interface cannot be independently deployed or scaled without revisiting this decision.
