# ADR 0034: Optimize Technology Selection for Agentic Development and Low Operations

Date: June 20, 2026

## Status

Accepted

## Context

This is a personal project intended both to produce a useful application and to provide a practical environment for learning Vue and Nuxt. Most implementation work will be performed or assisted through agentic coding workflows.

Technology selection can easily drift into premature decisions about minor libraries. The more important constraints are whether agents can understand, modify, test, and verify the system reliably, and whether one person can deploy and operate it inexpensively.

## Decision

Evaluate infrastructure and framework choices primarily against two criteria:

1. **Agentic development reliability**
   - strong TypeScript support;
   - deterministic type-checking, linting, and formatting commands;
   - explicit, repository-visible configuration;
   - deterministic commands and checked-in migrations;
   - good official documentation and broad ecosystem examples;
   - fast automated verification;
   - clear module and runtime boundaries; and
   - minimal hidden code generation or provider-specific magic.

2. **Low-cost, low-effort operation**
   - managed services where operation would otherwise be substantial;
   - useful free or inexpensive entry tiers;
   - one primary application deployment;
   - few independently operated systems;
   - straightforward local development and production parity checks;
   - clear backup, logging, and failure behavior; and
   - portability where it does not impose disproportionate complexity.

Library-level decisions should be deferred unless they materially affect these criteria or unblock implementation. Technology additions require a concrete capability, not hypothetical future convenience.

## Consequences

- Architecture discussions will focus on frameworks, runtimes, data stores, storage, deployment, CI, and operational boundaries.
- Incidental libraries may be selected during implementation and need not receive individual ADRs.
- The preferred stack may accept some provider coupling when it significantly lowers cost and operational burden.
- Agent-readable conventions and automated checks are treated as architectural qualities rather than implementation polish.
- Existing detailed ADRs remain valid, but future grilling should not continue at that granularity without a concrete need.
