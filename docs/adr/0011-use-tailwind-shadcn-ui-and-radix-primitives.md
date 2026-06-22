# ADR 0011: Use Tailwind CSS, shadcn/ui, and Radix Primitives

Date: June 19, 2026

## Status

Superseded by ADR 0023

## Context

The Next.js application needs a consistent, accessible interface for Public Discovery, private Journal workflows, photo management, forms, and the protected admin section. The component system should remain easy to inspect and modify in the repository, including through agentic workflows.

The team already has experience with Radix primitives.

## Decision

Use Tailwind CSS for styling, shadcn/ui as the component-source foundation, and Radix primitives for accessible interactive behavior.

The implementation will:

- keep generated and customized shadcn/ui component source in the repository;
- use Radix primitives for suitable dialogs, menus, popovers, tabs, and related interactions;
- preserve keyboard navigation, focus management, semantic markup, and ARIA behavior when customizing components;
- define shared design tokens for color, typography, spacing, radius, and interaction states;
- build domain-specific components such as Roaster Previews and Visit entries above the generic component layer; and
- avoid coupling domain rules or data access to presentation components.

## Consequences

- Components remain locally owned and directly customizable.
- Existing Radix experience reduces implementation friction.
- Tailwind supports consistent styling without requiring a runtime CSS-in-JS system.
- shadcn/ui is source code rather than a centrally upgraded component dependency, so project-level consistency and maintenance remain our responsibility.
- Visual customization must not remove the accessibility behavior provided by Radix.
- The application needs explicit design conventions to prevent duplicated or inconsistent component variants.
