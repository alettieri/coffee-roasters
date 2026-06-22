# ADR 0014: Use Cloudflare Queues and Cron Triggers for Photo Processing

Date: June 19, 2026

## Status

Accepted

## Context

Visit Photo processing requires validation, transformation through Cloudflare Images, metadata-free re-encoding, canonical R2 storage, and cleanup of the quarantine object. Performing the complete pipeline during the upload request would increase latency and make transient failures difficult to retry safely.

Uploads can also be abandoned after a quarantine object is created but before processing completes or a Visit Photo record becomes ready.

## Decision

Use Cloudflare Queues for asynchronous Visit Photo processing and Cloudflare Cron Triggers for scheduled cleanup.

The workflow will:

1. authorize the upload and create a pending Visit Photo record;
2. upload original bytes to a private quarantine R2 key;
3. enqueue an idempotent processing message after upload completion;
4. validate and sanitize the image according to ADR 0009;
5. write canonical bytes to R2;
6. atomically mark the Visit Photo as ready with canonical metadata; and
7. delete the quarantine object.

The queue consumer must:

- verify the current database state before processing;
- be safe to execute more than once;
- use bounded retries for transient failures;
- record a non-public failure state after retry exhaustion;
- avoid making pending or failed photos available in the Journal; and
- avoid deleting canonical objects that are referenced by ready Visit Photos.

A scheduled cleanup job will identify expired quarantine objects, stale pending records, and unreferenced canonical objects. Cleanup decisions must be based on both PostgreSQL records and R2 object state, with conservative age thresholds.

## Consequences

- Photo uploads can complete without waiting for transformation.
- Transient processing failures can be retried outside the browser request.
- The Journal needs pending, ready, and failed photo states.
- Queue delivery is at-least-once, so processing and state transitions must be idempotent.
- Database and object storage updates cannot share one transaction; reconciliation and cleanup are required.
- Cloudflare Queues and Cron Triggers add platform coupling and operational monitoring requirements.
- Product behavior must explain delayed processing and offer a safe retry or removal path after permanent failure.
