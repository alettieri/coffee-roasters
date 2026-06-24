# ADR 0009: Sanitize Visit Photos with Cloudflare Images

Date: June 19, 2026

## Status

Accepted

## Context

ADR 0007 requires every Visit Photo to be decoded and re-encoded so hidden metadata, including GPS coordinates, is not preserved. ADR 0022 deploys the application through Cloudflare, where native Node.js image-processing libraries cannot be assumed to work.

The application needs a Worker-compatible image pipeline that can validate uploaded content, constrain dimensions, remove metadata, and write sanitized image bytes to the private R2 bucket.

## Decision

Use Cloudflare Images transformations from the Cloudflare runtime to sanitize Visit Photos before canonical storage in R2.

The upload pipeline will:

1. authorize the Local Coffee Lover against the target Visit;
2. upload the original bytes to an opaque, private quarantine key;
3. validate declared and decoded file type, byte size, and pixel dimensions;
4. transform the image through Cloudflare Images with bounded dimensions;
5. explicitly disable output metadata and re-encode to an approved format;
6. write the transformed bytes to a new canonical R2 key;
7. create or activate the Visit Photo record only after canonical storage succeeds; and
8. delete the quarantine object after success or through scheduled cleanup.

The implementation must:

- allow only explicitly supported raster image formats;
- reject malformed images, unsupported formats, excessive dimensions, and oversized files;
- use transformation settings that remove metadata rather than merely omit it from display;
- avoid retaining the original upload after processing;
- record canonical content type, byte size, width, height, checksum, and processing state in PostgreSQL;
- make failed or pending uploads unavailable to the Journal; and
- verify through automated tests that representative EXIF and GPS metadata is absent from canonical output.

Cloudflare Images is used as a transformation capability, not as the source of truth for Visit Photo ownership or metadata. R2 remains the canonical object store and PostgreSQL remains the application record store.

## Consequences

- Photo processing remains compatible with the Cloudflare runtime.
- Hidden metadata removal becomes an explicit, testable step.
- Canonical photos can be normalized to predictable formats and bounded dimensions.
- The application becomes more dependent on Cloudflare's image transformation APIs and pricing.
- Uploads require a multi-step state machine and cleanup for partial failures.
- Original image fidelity and unsupported formats may require explicit product limits.
- A Cloudflare Images outage can delay photo processing without affecting Public Discovery or existing Journal photos.
- Changing providers requires replacing the transformation implementation while preserving the storage interface and processing contract.
