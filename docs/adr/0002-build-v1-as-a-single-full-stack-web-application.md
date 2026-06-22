# ADR 0002: Build V1 as a Single Full-Stack Web Application

Date: June 19, 2026

## Status

Accepted

## Context

V1 requires indexable Public Discovery pages, authenticated private Journals, Visit Photo management, Suggestions, and a protected admin interface. There is no concrete second client, such as a native mobile application, that requires an independently deployed API.

Splitting the product into separate frontend and API deployments would introduce additional contracts, authentication boundaries, deployment coordination, and operational overhead before those costs provide product value.

## Decision

Build v1 as a single full-stack web application.

The application will:

- render indexable Area and Roaster Profile pages;
- own server-side application operations and domain rules;
- provide authenticated Journal and Visit Photo workflows;
- include the protected admin section established by ADR 0001; and
- access the primary application data store directly through server-side code.

Code should keep domain rules separate from framework-specific request and rendering concerns so that a formal API can be extracted if a concrete second client requires one.

## Consequences

- V1 has one primary application deployment rather than separate frontend and API deployments.
- Authentication and authorization can share one application boundary.
- Public and private workflows can reuse the same domain logic and data access.
- Internal server operations do not need to become a prematurely versioned public API.
- A future native or third-party client may require extracting and securing a formal API.
- Framework selection must support server rendering, server-side application operations, authenticated routes, and protected administrative routes.
