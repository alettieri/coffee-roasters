import type {
  AppAuthSession,
  AppAuthSessionResult,
  AppAuthUser,
} from '../../platform/auth/auth';

export interface AuthSessionReader {
  api: {
    getSession(context: {
      headers: Headers;
      query?: {
        disableCookieCache?: boolean;
        disableRefresh?: boolean;
      };
    }): Promise<AppAuthSessionResult | null>;
  };
}

export type AuthenticatedActorUser = Pick<
  AppAuthUser,
  'id' | 'email' | 'emailVerified' | 'image' | 'name' | 'role'
>;

export type AuthenticatedActorSession = Pick<
  AppAuthSession,
  'id' | 'expiresAt' | 'userId'
>;

export interface AuthenticatedActor {
  user: AuthenticatedActorUser;
  session: AuthenticatedActorSession;
}

export class UnauthenticatedActorError extends Error {
  readonly code = 'unauthenticated';
  readonly statusCode = 401;

  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'UnauthenticatedActorError';
  }
}

function toHeaders(init?: Headers | HeadersInit): Headers {
  return init instanceof Headers ? init : new Headers(init);
}

export async function getAuthenticatedActor(
  auth: AuthSessionReader,
  headers: Headers | HeadersInit,
): Promise<AuthenticatedActor | null> {
  const session = await auth.api.getSession({
    headers: toHeaders(headers),
    query: {
      disableRefresh: true,
    },
  });

  if (!session?.user || !session.session) {
    return null;
  }

  return {
    user: session.user,
    session: {
      id: session.session.id,
      expiresAt: session.session.expiresAt,
      userId: session.session.userId,
    },
  };
}

export async function requireAuthenticatedActor(
  auth: AuthSessionReader,
  headers: Headers | HeadersInit,
): Promise<AuthenticatedActor> {
  const actor = await getAuthenticatedActor(auth, headers);
  if (!actor) {
    throw new UnauthenticatedActorError();
  }

  return actor;
}
