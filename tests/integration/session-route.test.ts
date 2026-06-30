import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp, toWebHandler } from 'h3';

import sessionRoute from '../../server/api/session.get';
import authRoute from '../../server/api/auth/[...all]';
import {
  createDatabaseClient,
  type DatabaseClient,
} from '../../server/platform/database/client';
import {
  account,
  session,
  user,
  verification,
} from '../../server/platform/database/schema';
import { createAppAuth } from '../../server/platform/auth/auth';
import {
  listCapturedMagicLinks,
  resetCapturedMagicLinks,
} from '../../server/platform/auth/magic-link-capture';
import { requireEnvironmentVariable } from '../../scripts/environment/load-env-file';

const testDatabaseUrl = requireEnvironmentVariable('DATABASE_URL');
const appOrigin = 'http://localhost:3000';
const requestHeaders = {
  origin: appOrigin,
  referer: `${appOrigin}/sign-in`,
  'content-type': 'application/json',
};

function requireDatabaseClient(
  client: DatabaseClient | undefined,
): DatabaseClient {
  if (!client) {
    throw new Error('Database integration test client was not initialized');
  }

  return client;
}

function createSessionRouteHandler(): (request: Request) => Promise<Response> {
  const app = createApp();
  app.use('/api/session', sessionRoute);
  return toWebHandler(app);
}

function createAuthRouteHandler(): (request: Request) => Promise<Response> {
  const app = createApp();
  app.use('/api/auth', authRoute);
  return toWebHandler(app);
}

async function signInWithMagicLink(
  handler: (request: Request) => Promise<Response>,
  email: string,
): Promise<Response> {
  return handler(
    new Request(`${appOrigin}/api/auth/sign-in/magic-link`, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({ email }),
    }),
  );
}

async function verifyMagicLink(
  handler: (request: Request) => Promise<Response>,
  url: string,
  cookieHeader: string,
): Promise<Response> {
  return handler(
    new Request(url, {
      method: 'GET',
      headers: {
        cookie: cookieHeader,
        origin: appOrigin,
        referer: `${appOrigin}/sign-in`,
      },
    }),
  );
}

function getSetCookieHeader(response: Response): string | null {
  return response.headers.get('set-cookie');
}

function buildCookieHeader(setCookieHeader: string | null): string {
  if (!setCookieHeader) {
    return '';
  }

  return setCookieHeader
    .split(/,(?=\s*[^=;,]+=[^;])/u)
    .map((value) => value.split(';')[0])
    .filter(Boolean)
    .join('; ');
}

describe('auth session route', () => {
  let client: DatabaseClient | undefined;
  let authRouteHandler: ((request: Request) => Promise<Response>) | undefined;
  let sessionRouteHandler:
    | ((request: Request) => Promise<Response>)
    | undefined;

  beforeAll(async () => {
    client = createDatabaseClient(testDatabaseUrl, { maxConnections: 1 });
  });

  beforeEach(async () => {
    const databaseClient = requireDatabaseClient(client);
    await databaseClient.db.execute(
      sql`truncate table ${account}, ${session}, ${verification}, ${user} restart identity cascade`,
    );
    resetCapturedMagicLinks();
    createAppAuth({ db: databaseClient.db, baseURL: appOrigin });
    authRouteHandler = createAuthRouteHandler();
    sessionRouteHandler = createSessionRouteHandler();
  });

  afterAll(async () => {
    await client?.close();
  });

  it('returns a safe signed-out payload', async () => {
    const sessionHandler = sessionRouteHandler;
    if (!sessionHandler) {
      throw new Error('Session route test harness was not initialized');
    }

    const response = await sessionHandler(
      new Request(`${appOrigin}/api/session`, {
        method: 'GET',
        headers: {
          origin: appOrigin,
          referer: `${appOrigin}/`,
        },
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      authenticated: false,
      session: null,
      user: null,
    });
  });

  it('returns the authenticated coffee lover session without exposing raw tokens', async () => {
    const databaseClient = requireDatabaseClient(client);
    const authHandler = authRouteHandler;
    const sessionHandler = sessionRouteHandler;
    if (!authHandler || !sessionHandler) {
      throw new Error('Auth route test harness was not initialized');
    }

    await signInWithMagicLink(authHandler, 'session-route@example.com');
    const capturedLink = listCapturedMagicLinks()[0];
    const verifyResponse = await verifyMagicLink(
      authHandler,
      capturedLink.url,
      '',
    );
    const cookieHeader = buildCookieHeader(getSetCookieHeader(verifyResponse));

    expect(cookieHeader).not.toBe('');

    const response = await sessionHandler(
      new Request(`${appOrigin}/api/session`, {
        method: 'GET',
        headers: {
          cookie: cookieHeader,
          origin: appOrigin,
          referer: `${appOrigin}/`,
        },
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      authenticated: true,
      session: {
        expiresAt: expect.any(String),
      },
      user: {
        email: 'session-route@example.com',
        emailVerified: true,
        id: expect.any(String),
        image: null,
        name: expect.any(String),
        role: 'coffee_lover',
      },
    });

    const sessionRows = await databaseClient.db.execute<{
      token: string;
      userId: string;
    }>(sql`
      select token, "userId"
      from session
      where "userId" = (
        select id
        from "user"
        where email = 'session-route@example.com'
      )
    `);

    expect(sessionRows).toHaveLength(1);
  });
});
