<script setup lang="ts">
const { data: session } = useAuthSession();
</script>

<template>
  <section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">Coffee Roaster Discovery</p>
      <h1>
        Track the roasters you want to try, have tried, and want to revisit.
      </h1>
      <p class="lede">
        Magic-link sign-in keeps the app simple. Once signed in, your session
        stays available as you move through the Nuxt app.
      </p>

      <div class="actions">
        <NuxtLink class="primary" to="/sign-in">Start login</NuxtLink>
        <NuxtLink class="secondary" to="/my-roasters"
          >Open My Roasters</NuxtLink
        >
      </div>
    </div>

    <aside class="status-card">
      <p class="status-label">Current state</p>
      <h2 v-if="session?.authenticated && session.user">
        Signed in as {{ session.user.name }}
      </h2>
      <h2 v-else>Signed out</h2>

      <dl>
        <div>
          <dt>Email</dt>
          <dd>{{ session?.user?.email ?? 'No session yet' }}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{{ session?.user?.role ?? 'coffee_lover by default' }}</dd>
        </div>
        <div>
          <dt>Session</dt>
          <dd>{{ session?.authenticated ? 'Active' : 'Waiting for login' }}</dd>
        </div>
      </dl>
    </aside>
  </section>
</template>

<style scoped>
.hero {
  display: grid;
  gap: 32px;
  grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.9fr);
  max-width: 1180px;
  padding: 48px 0;
}

.hero-copy {
  padding: clamp(20px, 4vw, 48px) 0;
}

.eyebrow,
.status-label {
  color: #7b634f;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  margin: 0 0 16px;
  text-transform: uppercase;
}

h1 {
  font-size: clamp(2.6rem, 7vw, 5.4rem);
  line-height: 0.95;
  margin: 0 0 20px;
  max-width: 12ch;
}

.lede {
  color: #4d4035;
  font-size: 1.1rem;
  line-height: 1.75;
  margin: 0;
  max-width: 60ch;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 32px;
}

.actions a {
  border-radius: 999px;
  font-weight: 700;
  padding: 14px 22px;
  text-decoration: none;
}

.primary {
  background: #211c18;
  color: #f7f1e6;
}

.secondary {
  border: 1px solid rgba(33, 28, 24, 0.15);
  color: inherit;
}

.status-card {
  background: rgba(255, 255, 255, 0.68);
  border: 1px solid rgba(33, 28, 24, 0.1);
  border-radius: 28px;
  box-shadow: 0 18px 50px rgba(33, 28, 24, 0.08);
  padding: 28px;
}

.status-card h2 {
  font-size: 1.6rem;
  line-height: 1.2;
  margin: 0 0 20px;
}

dl {
  display: grid;
  gap: 16px;
  margin: 0;
}

dt {
  color: #7b634f;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

dd {
  margin: 6px 0 0;
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
  }
}
</style>
