<template>
  <main class="page-shell">
    <section class="placeholder">
      <p class="eyebrow">Coffee Roaster Discovery</p>
      <h1>Public Discovery is being prepared.</h1>
      <p>
        This local placeholder confirms the Nuxt application is running before
        product-specific discovery behavior is implemented.
      </p>
    </section>
  </main>
</template>

<style scoped>
.page-shell {
  align-items: center;
  background: #f7f5ef;
  color: #211c18;
  display: flex;
  min-height: 100vh;
  padding: 48px 24px;
}

.placeholder {
  max-width: 680px;
}

.eyebrow {
  color: #6b5848;
  font-size: 0.875rem;
  font-weight: 700;
  margin: 0 0 16px;
  text-transform: uppercase;
}

h1 {
  font-size: clamp(2rem, 6vw, 4.5rem);
  line-height: 1;
  margin: 0 0 24px;
}

p {
  font-size: 1.125rem;
  line-height: 1.7;
  margin: 0;
}
</style>
