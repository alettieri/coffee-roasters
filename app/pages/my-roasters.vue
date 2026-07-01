<script setup lang="ts">
definePageMeta({
  middleware: ['require-auth'],
});

const { data: session } = useAuthSession();

const signedInName = computed(
  () => session.value?.user?.name ?? 'Coffee Lover',
);
const signedInRole = computed(
  () => session.value?.user?.role ?? 'coffee_lover',
);
const sessionExpiresAt = computed(() => {
  const expiresAt = session.value?.session?.expiresAt;
  if (!expiresAt) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(expiresAt));
});
</script>

<template>
  <section class="dashboard">
    <div class="hero-card">
      <p class="eyebrow">Authenticated app state</p>
      <h1>My Roasters</h1>
      <p class="lede">
        This is the signed-in surface for a Coffee Lover. It shows the safe
        session summary without exposing tokens or other privileged session
        details.
      </p>
    </div>

    <div class="session-card">
      <h2>Session summary</h2>

      <dl>
        <div>
          <dt>Name</dt>
          <dd>{{ signedInName }}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{{ session?.user?.email }}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{{ signedInRole }}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>Signed in</dd>
        </div>
        <div>
          <dt>Session expires</dt>
          <dd>{{ sessionExpiresAt }}</dd>
        </div>
      </dl>

      <p class="note">
        Default role stays non-admin. No administrator privileges are granted by
        the login flow.
      </p>
    </div>
  </section>
</template>

<style scoped>
.dashboard {
  display: grid;
  gap: 24px;
  max-width: 960px;
  padding: 48px 0;
}

.hero-card,
.session-card {
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(33, 28, 24, 0.1);
  border-radius: 28px;
  box-shadow: 0 18px 50px rgba(33, 28, 24, 0.08);
  padding: clamp(24px, 4vw, 40px);
}

.eyebrow {
  color: #7b634f;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  margin: 0 0 16px;
  text-transform: uppercase;
}

h1 {
  font-size: clamp(2.4rem, 5vw, 4rem);
  line-height: 0.95;
  margin: 0 0 18px;
}

.lede,
.note {
  color: #4d4035;
  line-height: 1.75;
  margin: 0;
  max-width: 64ch;
}

.session-card h2 {
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

.note {
  margin-top: 20px;
}
</style>
