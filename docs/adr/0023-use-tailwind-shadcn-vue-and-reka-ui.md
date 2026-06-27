# ADR 0023: Use Tailwind CSS, shadcn-vue, and Reka UI

Date: June 20, 2026

## Status

Accepted

## Context

ADR 0021 selects Vue and Nuxt, so the interface stack should use Vue-native
component primitives.

The application still needs locally owned, accessible, agent-readable component source. Reka UI is the Vue accessibility-primitives project formerly known as Radix Vue, and shadcn-vue provides open component source built for the Vue ecosystem.

## Decision

Use Tailwind CSS for styling, shadcn-vue as the component-source foundation, and Reka UI for accessible interactive primitives.

The implementation will:

- keep generated and customized shadcn-vue source in the repository;
- use Reka UI for suitable dialogs, menus, popovers, tabs, and related interactions;
- preserve keyboard navigation, focus management, semantic markup, and ARIA behavior;
- define shared design tokens;
- build domain-specific components above the generic UI layer; and
- keep domain rules and data access out of presentation components.

## Consequences

- The UI approach retains the open-code and accessibility characteristics of the original decision.
- Prior experience with Radix concepts transfers to Reka UI, though APIs are Vue-oriented.
- Project-level consistency and component maintenance remain our responsibility.
- Accessibility behavior must be protected during customization.
