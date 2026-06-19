# Domain Docs

This is a single-context repository. Engineering skills should use the root domain glossary and the repository-wide architectural decision records.

## Before exploring, read these

- `CONTEXT.md` at the repository root.
- Relevant architectural decision records under `docs/adr/`.

If either location does not exist, proceed silently. Do not suggest creating documentation before a real domain term or architectural decision needs to be recorded.

## File structure

```text
/
├── CONTEXT.md
├── docs/
│   └── adr/
└── src/
```

The domain-modeling workflows reached through `grill-with-docs` and `improve-codebase-architecture` create or update these documents when terms or decisions are resolved.

## Use the glossary's vocabulary

When output names a domain concept—in an issue title, refactor proposal, hypothesis, or test name—use the term defined in `CONTEXT.md`. Do not drift to synonyms the glossary explicitly avoids.

If a needed concept is absent, reconsider whether the language belongs to the project or note the gap for domain modeling.

## Flag ADR conflicts

If proposed work contradicts an existing ADR, surface the conflict explicitly instead of silently overriding the decision.
