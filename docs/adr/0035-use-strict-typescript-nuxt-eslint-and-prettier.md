# ADR 0035: Use Strict TypeScript, Nuxt ESLint, and Prettier

Date: June 20, 2026

## Status

Accepted

## Context

Agentic coding workflows need fast, deterministic feedback. Generated code should fail clearly when types, Vue conventions, Nuxt boundaries, or formatting are incorrect.

Nuxt does not run full type checking during ordinary development or builds by default. Its official ESLint module provides a project-aware flat configuration for JavaScript, TypeScript, Vue, and Nuxt. Formatting should remain deterministic and separate from semantic lint rules.

Biome offers a simpler combined tool, but its Vue single-file-component support is currently documented as experimental. That reduces confidence in a Vue- and Nuxt-centered codebase.

## Decision

Use:

- strict TypeScript with `typescript` and `vue-tsc` through `nuxt typecheck`;
- the official `@nuxt/eslint` module with ESLint flat configuration; and
- Prettier for deterministic code and documentation formatting.

The repository will expose stable commands with these responsibilities:

- `typecheck`: run Nuxt's complete TypeScript check;
- `lint`: report semantic and framework-specific lint failures;
- `lint:fix`: apply safe ESLint fixes;
- `format`: apply Prettier formatting;
- `format:check`: verify formatting without modifying files; and
- `check`: run formatting verification, linting, type checking, and the appropriate automated tests.

The implementation will:

- keep strict TypeScript enabled;
- treat type-check, lint, and format failures as CI failures;
- use one checked-in ESLint flat configuration and one checked-in Prettier configuration;
- avoid duplicating formatting rules in ESLint;
- keep editor settings optional while making command-line behavior authoritative;
- format Vue, TypeScript, JavaScript, JSON, Markdown, YAML, and supported configuration files consistently;
- exclude generated Nuxt, build, coverage, and dependency output explicitly; and
- pin tool versions through the lockfile and deliberate dependency updates.

Agents must run the narrowest relevant checks during implementation and the repository-level `check` command before handing off completed changes.

## Consequences

- Agents receive precise feedback from three tools with non-overlapping responsibilities.
- Nuxt and Vue-specific lint rules come from the framework-supported integration.
- Prettier removes formatting judgment and reduces noisy diffs.
- CI performs an explicit type-check step because a successful Nuxt build alone is insufficient.
- The repository carries more tooling than a single Biome setup, but uses the more mature Vue path.
- Biome may be reconsidered when its Vue support is stable and demonstrably replaces these tools without reducing diagnostic quality.
