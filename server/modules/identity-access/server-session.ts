export interface AuthSessionReader {
  api: {
    getSession(context: {
      headers: Headers;
      query?: {
        disableCookieCache?: boolean;
        disableRefresh?: boolean;
      };
    }): Promise<{
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        image?: string | null;
        name: string;
        role: 'coffee_lover' | 'admin' | string;
      };
      session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null;
        userAgent?: string | null;
      };
    } | null>;
  };
}

export interface AuthenticatedActorUser {
  id: string;
  email: string;
  emailVerified: boolean;
  image: string | null | undefined;
  name: string;
  role: 'coffee_lover' | 'admin' | string;
}

export interface AuthenticatedActorSession {
  id: string;
  expiresAt: Date;
  userId: string;
}

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

type AuthSessionResult = {
  user?: AuthenticatedActorUser;
  session?: AuthenticatedActorSession & { token?: string };
} | null;

function toHeaders(init?: Headers | HeadersInit): Headers {
  return init instanceof Headers ? init : new Headers(init);
}

export async function getAuthenticatedActor(
  auth: AuthSessionReader,
  headers: Headers | HeadersInit,
): Promise<AuthenticatedActor | null> {
  const session = (await auth.api.getSession({
    headers: toHeaders(headers),
    query: {
      disableRefresh: true,
    },
  })) as AuthSessionResult;

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
