# Infrastructure Cost Model

Date: June 20, 2026

This estimate covers the selected deployed infrastructure:

- Nuxt and Nitro on Cloudflare Pages with Hyperdrive
- PostgreSQL on Neon
- Better Auth using the application database
- transactional email through Resend
- Sentry application observability
- GitHub Actions CI/CD

R2, Images, Queues, and Cron Triggers are deferred until their product slices authorize them. Their pricing remains useful for future planning, but they are not part of the required production-only deployment baseline.

It excludes domain registration, taxes, paid support, developer AI tools, and local electricity or hardware. Prices are current as of the date above and should be checked before launch or plan changes.

## Pricing Inputs

### Cloudflare Pages runtime

- Free: 100,000 requests per day with 10 milliseconds of CPU time per invocation.
- Paid: $5 minimum per account each month.
- Paid allowance: 10 million requests and 30 million CPU milliseconds per month.
- Paid overage: $0.30 per million requests and $0.02 per million CPU milliseconds.
- Static asset requests are free and unlimited.

Cloudflare Pages deploys the application into Cloudflare's runtime, so the same per-invocation CPU constraint still applies to server-rendered Nuxt requests. The $5 paid plan is the recommended production baseline once reliability matters.

### Cloudflare R2

- First 10 GB-month, 1 million Class A operations, and 10 million Class B operations are free each month.
- Standard storage beyond the allowance: $0.015 per GB-month.
- Class A operations: $4.50 per million.
- Class B operations: $0.36 per million.
- Internet egress is free.

At this product's expected scale, storage volume will matter before operation charges.

### Cloudflare Images

- First 5,000 unique transformations per month are free.
- Paid transformations beyond the allowance: $0.50 per 1,000.
- Calls through the Images binding count as transformations.

Because canonical sanitization performs one transformation per uploaded Visit Photo, transformation volume should approximately follow photo-upload volume, plus retries.

### Cloudflare Queues

- Free: 10,000 operations per day.
- Paid Workers plan: 1 million operations per month included, then $0.40 per million.
- A normally delivered message generally consumes three operations: write, read, and delete.

Photo processing is unlikely to create a meaningful Queue bill before the application reaches substantial usage.

### Neon PostgreSQL

- Free: 100 CU-hours and 0.5 GB storage per project each month.
- Free compute scales to zero after inactivity.
- Launch: no monthly minimum, $0.106 per CU-hour and $0.35 per GB-month.
- Launch branch usage beyond included branches can add branch-hour charges.
- Neon's example intermittent workload is approximately $15/month.

The free plan is suitable for development and personal use. A public production workload should move to Launch when predictable availability, storage, or usage headroom matters.

### Resend

- Free: 3,000 emails per month, limited to 100 per day and one domain.
- Pro: $20 per month for 50,000 emails.

Closed single-user authentication will remain far below the free allowance.

### Sentry

- Developer: free for one user.
- Includes 5,000 errors, 5 million spans, 5 GB logs, and one uptime and cron monitor under the current plan table.
- Team: $26 per month when billed annually with the default included data.

The one-user Developer plan matches this project's initial ownership model.

### GitHub Actions

GitHub Actions cost depends on repository visibility and the GitHub account plan. Standard Linux runner usage should be monitored in the GitHub billing dashboard. At the current listed pay-as-you-go rate, a two-core Linux runner is $0.006 per minute after any included allowance.

CI cost is excluded from totals because repository visibility and account allowance are not an architectural decision in this document.

## Usage Scenarios

These are planning estimates, not provider quotes.

| Service             |              Single user | Early public use |                   Modest growth |
| ------------------- | -----------------------: | ---------------: | ------------------------------: |
| Cloudflare Pages    | $0 free / $5 recommended |               $5 |                          $5–$10 |
| Neon                |                       $0 |           $0–$15 |                         $15–$30 |
| Resend              |                       $0 |               $0 |                          $0–$20 |
| Sentry              |                       $0 |               $0 | $0 unless a team plan is needed |
| **Estimated total** |                **$0–$5** |        **$5–$20** |                     **$20–$60** |

### Single user

Assumptions:

- fewer than 100,000 Cloudflare Pages requests per day;
- intermittent database use under 100 CU-hours and 0.5 GB;
- negligible authentication email; and
- one Sentry user.

Recommended budget: **$5/month**, using the paid Cloudflare compute plan for more CPU headroom while leaving the other services on free tiers. Running entirely on free tiers is possible if the Nuxt workload stays within the Cloudflare free CPU limits.

### Early public use

Assumptions:

- fewer than 10 million dynamic Cloudflare Pages requests per month;
- intermittent PostgreSQL load;
- fewer than 3,000 transactional emails per month; and
- one operator.

Expected budget: **approximately $5–$20/month**. The range is primarily determined by whether Neon Free remains adequate.

### Modest growth

Assumptions:

- Pages traffic remains near or moderately above the included paid allowance;
- Neon Launch with intermittent or low sustained load;
- possible Resend Pro usage; and
- still one application operator.

Expected budget: **approximately $20–$60/month**. Neon compute and transactional email are the main expected variables.

## Operational Review

### Strengths

- One Cloudflare account operates Pages compute, edge caching, and platform logs for the required production deployment.
- Hyperdrive provides the deployed Pages-to-Neon connection and pooling boundary while migrations use a direct Neon connection.
- Nitro has a direct Cloudflare Pages target, avoiding an additional deployment adapter.
- PostgreSQL remains standard and portable despite Neon hosting.
- Better Auth avoids a separate per-user identity bill.
- Docker keeps daily database development independent of Neon availability and billing.
- Every major service has an adequate entry tier for a one-user project.
- TypeScript, checked-in Drizzle migrations, Cloudflare Pages configuration, Wrangler direct upload, and GitHub Actions provide explicit artifacts that coding agents can inspect and verify.

### Main risks

1. **Cloudflare runtime compatibility**
   Nuxt dependencies must work in `workerd`. CI must retain production-runtime tests.

2. **Cloudflare CPU ceiling**
   A server-rendered request may exceed the free plan's 10 millisecond CPU limit. Treat $5/month as the realistic production baseline.

3. **Neon free-plan production behavior**
   Scale-to-zero and free quotas are acceptable for personal use but may create cold starts or exhaustion as public traffic grows.

4. **Deferred photo infrastructure**
   R2, Images, Queues, and Cron costs return when Visit Photo product slices provision those resources.

5. **Provider concentration**
   Cloudflare Pages failure affects the required application deployment. This is accepted because consolidated operation is valuable for a one-person project.

6. **Preview-environment sprawl**
   Preview resources are not required initially. If added later, stale Neon branches and Cloudflare resources need expiration and cleanup.

## Recommendation

Keep the selected stack.

For the initial single-user deployment:

- use the relevant Cloudflare Pages paid compute plan if the application is intended to remain reliably available;
- remain on Neon Free until storage, availability, or measured compute usage justifies Launch;
- use the free Resend and Sentry allowances;
- defer R2, Images, Queues, and Cron until product slices authorize them;
- configure budget alerts in Cloudflare, Neon, Resend, Sentry, and GitHub;
- review actual usage after the first full month before changing any plan.

The realistic initial infrastructure budget is **$5/month plus domain registration**. The stack should remain near or below roughly **$20/month** through early public use if database usage remains intermittent.

## Official Pricing Sources

- [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/)
- [Cloudflare Images pricing](https://developers.cloudflare.com/images/pricing/)
- [Cloudflare Queues pricing](https://developers.cloudflare.com/queues/platform/pricing/)
- [Neon pricing](https://neon.com/pricing)
- [Resend pricing](https://resend.com/pricing)
- [Sentry pricing](https://sentry.io/pricing/)
- [GitHub Actions runner pricing](https://docs.github.com/en/billing/reference/actions-runner-pricing)
