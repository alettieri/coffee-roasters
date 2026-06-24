export default defineNuxtConfig({
  compatibilityDate: '2026-06-23',
  modules: ['@nuxt/eslint'],
  nitro: {
    preset: 'cloudflare_pages',
  },
  typescript: {
    strict: true,
    typeCheck: true,
  },
});
