import { useMutation } from '@tanstack/vue-query';
import { createAuthClient } from 'better-auth/vue';

export function useRequestMagicLinkMutation() {
  return useMutation({
    retry: false,
    mutationFn: async (email: string) => {
      return await $fetch<{ status: true }>('/api/auth/sign-in/magic-link', {
        body: { email },
        method: 'POST',
      });
    },
  });
}

export function useSignOutMutation() {
  const authClient = createAuthClient({
    baseURL: new URL('/api/auth', useRequestURL().origin).toString(),
  });

  return useMutation({
    retry: false,
    mutationFn: async () => {
      return await authClient.signOut();
    },
  });
}
