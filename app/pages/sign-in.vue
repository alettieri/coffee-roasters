<script setup lang="ts">
const email = ref('');
const submissionState = ref<'idle' | 'sending' | 'sent' | 'error'>('idle');
const feedbackMessage = ref('');
const formError = ref('');

const { data: session } = useAuthSession();

async function submitMagicLink() {
  if (!email.value || submissionState.value === 'sending') {
    return;
  }

  submissionState.value = 'sending';
  feedbackMessage.value = '';
  formError.value = '';

  try {
    await $fetch('/api/auth/sign-in/magic-link', {
      body: {
        email: email.value,
      },
      method: 'POST',
    });

    feedbackMessage.value = `Magic link requested for ${email.value}.`;
    submissionState.value = 'sent';
  } catch {
    formError.value =
      'Could not start login. Try again with a valid email address.';
    submissionState.value = 'error';
  }
}
</script>

<template>
  <!-- eslint-disable vue/html-self-closing -->
  <section class="sign-in">
    <div class="panel">
      <p class="eyebrow">Start login</p>
      <h1>Request a magic link with your email address.</h1>
      <p class="lede">
        This app uses magic-link authentication only. No password is required,
        and local test runs capture the link instead of sending real email.
      </p>

      <form class="form" @submit.prevent="submitMagicLink">
        <label for="email">Email address</label>
        <input
          id="email"
          v-model.trim="email"
          autocomplete="email"
          inputmode="email"
          name="email"
          placeholder="coffee.lover@example.com"
          required
          type="email"
        />

        <button :disabled="submissionState === 'sending'" type="submit">
          {{ submissionState === 'sending' ? 'Sending...' : 'Send magic link' }}
        </button>
      </form>

      <p v-if="feedbackMessage" class="success" role="status">
        {{ feedbackMessage }}
      </p>
      <p v-if="formError" class="error" role="alert">
        {{ formError }}
      </p>

      <p v-if="session?.authenticated" class="session-note">
        You are already signed in as {{ session.user?.name }}.
        <NuxtLink to="/my-roasters">Go to My Roasters</NuxtLink>
      </p>
    </div>
  </section>
</template>

<style scoped>
.sign-in {
  display: grid;
  justify-items: start;
  padding: 48px 0;
}

.panel {
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(33, 28, 24, 0.1);
  border-radius: 28px;
  box-shadow: 0 18px 50px rgba(33, 28, 24, 0.08);
  max-width: 760px;
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
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1;
  margin: 0 0 20px;
}

.lede {
  color: #4d4035;
  line-height: 1.7;
  margin: 0 0 28px;
  max-width: 58ch;
}

.form {
  display: grid;
  gap: 12px;
  max-width: 420px;
}

label {
  font-weight: 700;
}

input {
  border: 1px solid rgba(33, 28, 24, 0.18);
  border-radius: 16px;
  font: inherit;
  padding: 14px 16px;
}

button {
  background: #211c18;
  border: 0;
  border-radius: 999px;
  color: #f7f1e6;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  margin-top: 6px;
  padding: 14px 22px;
  width: fit-content;
}

button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.success,
.error,
.session-note {
  line-height: 1.7;
  margin: 18px 0 0;
}

.success {
  color: #17563d;
}

.error {
  color: #9a2d20;
}
</style>
