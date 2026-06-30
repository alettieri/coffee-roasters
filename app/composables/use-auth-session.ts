export interface AuthSessionUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string;
}

export interface AuthSessionState {
  authenticated: boolean;
  user: AuthSessionUser | null;
  session: {
    expiresAt: string;
  } | null;
}

export async function fetchAuthSession(
  headers?: HeadersInit,
): Promise<AuthSessionState> {
  return await $fetch<AuthSessionState>('/api/session', {
    headers,
  });
}

export function useAuthSession() {
  const headers = import.meta.server
    ? useRequestHeaders(['cookie'])
    : undefined;

  return useAsyncData('current-session', () => fetchAuthSession(headers), {
    default: () => ({
      authenticated: false,
      session: null,
      user: null,
    }),
  });
}
