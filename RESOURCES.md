# Coffee Roaster Platform Learning Resources

## Knowledge

- [Cloudflare Pages: Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/)
  Primary reference for production and preview branch behavior, branch control, and Git-connected deployments.
- [Cloudflare Pages: Rollbacks](https://developers.cloudflare.com/pages/configuration/rollbacks/)
  Primary reference for restoring a previous successful production deployment.
- [Cloudflare Pages: Set build commands per branch](https://developers.cloudflare.com/pages/how-to/build-commands-branches/)
  Primary reference for `CF_PAGES_BRANCH`-driven build wrappers and branch-specific build overrides.
- [Nitro: Cloudflare deployment](https://nitro.build/deploy/providers/cloudflare)
  Primary reference for the `cloudflare_pages` preset, local `wrangler pages dev`, runtime hooks, and environment variables.
- [Nuxt: Deploy to Cloudflare](https://nuxt.com/deploy/cloudflare)
  Primary Nuxt overview for Cloudflare Pages builds and direct upload deployment.
- [Cloudflare runtime development and testing](https://developers.cloudflare.com/workers/development-testing/)
  Primary reference for local `workerd` behavior, bindings, and production-representative runtime testing.
- [Neon: Branching](https://neon.com/docs/introduction/branching)
  Primary reference for isolated copy-on-write PostgreSQL branches used by preview, migration-verification, and production workflows.
- [Docker: PostgreSQL container image](https://hub.docker.com/_/postgres)
  Primary reference for configuring the pinned PostgreSQL container used during daily local development and integration tests.

## Wisdom (Communities)

- [Nuxt Discord](https://discord.com/invite/nuxt)
  Use for Nuxt and Nitro behavior that is unclear or changing faster than the documentation.
- [Cloudflare Developers Discord](https://discord.cloudflare.com/)
  Use for Cloudflare runtime, binding, and Wrangler issues that survive a minimal reproduction.
