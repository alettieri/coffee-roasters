# ADR 0010: Send Transactional Authentication Email with Resend

Date: June 19, 2026

## Status

Accepted

## Context

Better Auth requires transactional email delivery for workflows such as email verification and password recovery. The application needs a provider with an HTTP-based API that does not depend on a traditional Node.js server or direct SMTP connectivity.

## Decision

Use Resend to deliver transactional authentication email.

The implementation will:

- use Better Auth to generate and validate verification and recovery tokens;
- use Resend only as the email delivery provider;
- call Resend through its HTTPS API from server-side code;
- keep transactional email templates version-controlled and compatible with the Cloudflare runtime;
- verify a dedicated sending domain and configure SPF, DKIM, and DMARC;
- keep API keys in Cloudflare secret storage;
- avoid including sensitive account data in email content or delivery metadata;
- use generic responses for account-recovery requests to avoid account enumeration; and
- monitor delivery failures, bounces, and complaints.

Marketing email and newsletters are outside this decision.

## Consequences

- Authentication email delivery does not require operating mail infrastructure.
- Email templates remain reviewable application source.
- Authentication workflows depend on Resend availability and account configuration.
- Domain reputation, suppression handling, and provider limits require operational monitoring.
- Changing providers requires replacing the delivery adapter while preserving Better Auth's token workflows.
