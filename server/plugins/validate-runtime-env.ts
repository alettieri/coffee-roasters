export default defineNitroPlugin(() => {
  // Cloudflare Pages bindings are request-scoped in Nitro, so database
  // connection validation happens when runtime code opens a database client.
});
