# ADR 0033: Use Native Vue Form Handling by Default

Date: June 20, 2026

## Status

Accepted

## Context

V1 includes authentication, Admin Roaster, private tracking, and Visit forms.
Most are expected to have straightforward fields and submit to thin Nitro
routes.

A global form framework would introduce another abstraction, validation adapter, state model, and component convention before the application demonstrates difficult dynamic-form requirements.

## Decision

Use native HTML forms, Vue reactivity, and focused composables as the default form approach.

The implementation will:

- preserve native form semantics and progressive accessibility;
- use operation-specific Zod schemas for client feedback and authoritative Nitro validation;
- keep submission, pending, success, and safe error state explicit;
- associate field errors with controls using accessible markup;
- prevent duplicate submissions while an operation is pending;
- keep server responses authoritative when client and server validation differ;
- avoid placing domain rules in form components or composables; and
- create small shared form utilities only after repetition is demonstrated.

Do not adopt vee-validate or another form framework globally in v1. It may be introduced for a specific complex or dynamic form when native Vue handling becomes measurably cumbersome. That use must remain localized unless repeated evidence supports a broader convention.

## Consequences

- Simple forms have fewer dependencies and less abstraction.
- The project reinforces Vue's native reactivity and browser form behavior as part of its learning goal.
- Some submission and error-handling code may repeat before a stable abstraction emerges.
- Complex nested, conditional, or repeatable forms may eventually benefit from vee-validate.
- Client-side validation improves feedback but never replaces Nitro-side validation.
