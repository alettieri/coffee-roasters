<script setup lang="ts">
const { data: session, refresh } = useAuthSession();
const signOutMutation = useSignOutMutation();
const signOutPending = computed(() => signOutMutation.isPending.value);

const signedInUser = computed(() => session.value?.user);
const sessionLabel = computed(() => {
  if (!session.value?.authenticated || !session.value.user) {
    return 'Signed out';
  }

  return `${session.value.user.name} · ${session.value.user.role}`;
});

async function signOut() {
  if (signOutPending.value) {
    return;
  }

  try {
    await signOutMutation.mutateAsync();
    await refresh();
    await navigateTo('/sign-in');
  } catch {
    return;
  }
}
</script>

<template>
  <div class="shell">
    <header class="topbar">
      <NuxtLink class="brand" to="/">
        <span class="brand-mark">CR</span>
        <span>
          <strong>Coffee Roaster Tracker</strong>
          <small>{{ sessionLabel }}</small>
        </span>
      </NuxtLink>

      <nav class="nav">
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/my-roasters">My Roasters</NuxtLink>
        <NuxtLink v-if="!signedInUser" to="/sign-in">Sign in</NuxtLink>
        <button
          v-else
          :disabled="signOutPending"
          type="button"
          @click="signOut"
        >
          {{ signOutPending ? 'Signing out...' : 'Sign out' }}
        </button>
      </nav>
    </header>

    <main class="content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.shell {
  background:
    radial-gradient(circle at top, rgba(175, 139, 108, 0.18), transparent 38%),
    linear-gradient(180deg, #f6f1e8 0%, #f0e7da 100%);
  color: #211c18;
  min-height: 100vh;
}

.topbar {
  align-items: center;
  display: flex;
  gap: 24px;
  justify-content: space-between;
  padding: 20px clamp(20px, 4vw, 40px);
}

.brand {
  align-items: center;
  color: inherit;
  display: inline-flex;
  gap: 14px;
  text-decoration: none;
}

.brand strong,
.brand small {
  display: block;
}

.brand strong {
  font-size: 1rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.brand small {
  color: #6b5848;
  font-size: 0.8rem;
  margin-top: 2px;
}

.brand-mark {
  align-items: center;
  background: #211c18;
  border-radius: 14px;
  color: #f6f1e8;
  display: inline-flex;
  font-size: 0.85rem;
  font-weight: 700;
  height: 40px;
  justify-content: center;
  width: 40px;
}

.nav {
  align-items: center;
  display: inline-flex;
  flex-wrap: wrap;
  gap: 12px;
}

.nav a,
.nav button {
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(107, 88, 72, 0.18);
  border-radius: 999px;
  color: inherit;
  font: inherit;
  padding: 10px 16px;
  text-decoration: none;
}

.nav button {
  cursor: pointer;
}

.nav button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.content {
  padding: 0 clamp(20px, 4vw, 40px) 48px;
}
</style>
