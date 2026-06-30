import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp, toWebHandler } from 'h3';

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
import {
  getAuthenticatedActor,
  requireAuthenticatedActor,
  UnauthenticatedActorError,
} from '../../server/modules/identity-access/server-session';
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

describe('Better Auth magic-link server flow', () => {
  let client: DatabaseClient | undefined;
  let auth: ReturnType<typeof createAppAuth> | undefined;
  let routeHandler: ((request: Request) => Promise<Response>) | undefined;

  beforeAll(async () => {
    client = createDatabaseClient(testDatabaseUrl, { maxConnections: 1 });
  });

  beforeEach(async () => {
    const databaseClient = requireDatabaseClient(client);
    await databaseClient.db.execute(
      sql`truncate table ${account}, ${session}, ${verification}, ${user} restart identity cascade`,
    );
    resetCapturedMagicLinks();
    auth = createAppAuth({ db: databaseClient.db, baseURL: appOrigin });
    routeHandler = createAuthRouteHandler();
  });

  afterAll(async () => {
    await client?.close();
  });

  it('creates verification state and returns a generic magic-link response', async () => {
    const databaseClient = requireDatabaseClient(client);
    const authRouteHandler = routeHandler;
    if (!authRouteHandler) {
      throw new Error('Auth route test harness was not initialized');
    }

    const response = await signInWithMagicLink(
      authRouteHandler,
      'new-lover@example.com',
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: true });

    const capturedLinks = listCapturedMagicLinks();
    expect(capturedLinks).toHaveLength(1);
    expect(capturedLinks[0]).toMatchObject({
      email: 'new-lover@example.com',
    });
    expect(capturedLinks[0].url).toContain(
      '/api/auth/magic-link/verify?token=',
    );
    expect(capturedLinks[0].url).toContain('callbackURL=%2F');

    const verificationRows = await databaseClient.db.execute<{
      identifier: string;
      value: string;
    }>(sql`
      select identifier, value
      from verification
      where value like ${'%"new-lover@example.com"%'}
    `);

    expect(verificationRows).toHaveLength(1);
    expect(verificationRows[0].identifier).toBe(capturedLinks[0].token);
    expect(verificationRows[0].value).toContain('new-lover@example.com');
  });

  it('keeps the sign-in response generic for existing and missing users', async () => {
    const databaseClient = requireDatabaseClient(client);
    const authRouteHandler = routeHandler;
    if (!authRouteHandler) {
      throw new Error('Auth route test harness was not initialized');
    }

    await databaseClient.db.execute(sql`
      insert into "user" (
        id,
        name,
        email,
        "emailVerified",
        image,
        role,
        "createdAt",
        "updatedAt"
      ) values (
        'existing-user',
        'Existing Coffee Lover',
        'existing@example.com',
        true,
        null,
        'coffee_lover',
        now(),
        now()
      )
    `);

    const missingUserResponse = await signInWithMagicLink(
      authRouteHandler,
      'missing@example.com',
    );
    const existingUserResponse = await signInWithMagicLink(
      authRouteHandler,
      'existing@example.com',
    );

    await expect(missingUserResponse.json()).resolves.toEqual({ status: true });
    await expect(existingUserResponse.json()).resolves.toEqual({
      status: true,
    });
    expect(missingUserResponse.status).toBe(200);
    expect(existingUserResponse.status).toBe(200);
  });

  it('verifies a captured link, creates a session, and exposes a coffee-lover actor', async () => {
    const databaseClient = requireDatabaseClient(client);
    const appAuth = auth;
    const authRouteHandler = routeHandler;
    if (!authRouteHandler) {
      throw new Error('Auth route test harness was not initialized');
    }
    if (!appAuth) {
      throw new Error('Auth test harness was not initialized');
    }

    const requestResponse = await signInWithMagicLink(
      authRouteHandler,
      'first-time@example.com',
    );
    expect(requestResponse.status).toBe(200);

    const capturedLink = listCapturedMagicLinks()[0];
    const beforeSession = await getAuthenticatedActor(appAuth, new Headers());
    expect(beforeSession).toBeNull();

    const verifyResponse = await verifyMagicLink(
      authRouteHandler,
      capturedLink.url,
      '',
    );
    expect(verifyResponse.status).toBe(302);

    const setCookieHeader = getSetCookieHeader(verifyResponse);
    const cookieHeader = buildCookieHeader(setCookieHeader);
    expect(cookieHeader).not.toBe('');

    const sessionRows = await databaseClient.db.execute<{
      token: string;
      userId: string;
    }>(sql`
      select token, "userId"
      from session
      where "userId" = (
        select id
        from "user"
        where email = 'first-time@example.com'
      )
    `);

    expect(sessionRows).toHaveLength(1);

    const actor = await requireAuthenticatedActor(
      appAuth,
      new Headers({ cookie: cookieHeader }),
    );

    expect(actor.user).toMatchObject({
      email: 'first-time@example.com',
      role: 'coffee_lover',
      emailVerified: true,
    });
    expect(actor.session.userId).toBe(actor.user.id);

    const persistedUser = await databaseClient.db.execute<{
      email: string;
      role: string;
    }>(sql`
      select email, role
      from "user"
      where email = 'first-time@example.com'
    `);
    expect(persistedUser).toHaveLength(1);
    expect(persistedUser[0]).toMatchObject({
      email: 'first-time@example.com',
      role: 'coffee_lover',
    });
  });

  it('loads an existing user when the magic link is completed', async () => {
    const databaseClient = requireDatabaseClient(client);
    const appAuth = auth;
    const authRouteHandler = routeHandler;
    if (!authRouteHandler) {
      throw new Error('Auth route test harness was not initialized');
    }
    if (!appAuth) {
      throw new Error('Auth test harness was not initialized');
    }

    await databaseClient.db.execute(sql`
      insert into "user" (
        id,
        name,
        email,
        "emailVerified",
        image,
        role,
        "createdAt",
        "updatedAt"
      ) values (
        'existing-link-user',
        'Existing Link Coffee Lover',
        'link-existing@example.com',
        true,
        null,
        'coffee_lover',
        now(),
        now()
      )
    `);

    await signInWithMagicLink(authRouteHandler, 'link-existing@example.com');
    const capturedLink = listCapturedMagicLinks()[0];
    const verifyResponse = await verifyMagicLink(
      authRouteHandler,
      capturedLink.url,
      '',
    );

    expect(verifyResponse.status).toBe(302);

    const sessionRows = await databaseClient.db.execute<{
      userId: string;
      token: string;
    }>(sql`
      select "userId", token
      from session
      where "userId" = 'existing-link-user'
    `);
    expect(sessionRows).toHaveLength(1);

    const verifiedUser = await databaseClient.db.execute<{
      id: string;
      email: string;
      role: string;
    }>(sql`
      select id, email, role
      from "user"
      where email = 'link-existing@example.com'
    `);
    expect(verifiedUser).toHaveLength(1);
    expect(verifiedUser[0]).toMatchObject({
      id: 'existing-link-user',
      email: 'link-existing@example.com',
      role: 'coffee_lover',
    });
  });

  it('distinguishes unauthenticated access with a typed expected error', async () => {
    const appAuth = auth;
    if (!appAuth) {
      throw new Error('Auth test harness was not initialized');
    }

    await expect(
      requireAuthenticatedActor(appAuth, new Headers()),
    ).rejects.toMatchObject({
      name: 'UnauthenticatedActorError',
      code: 'unauthenticated',
      statusCode: 401,
    });

    await expect(
      getAuthenticatedActor(appAuth, new Headers()),
    ).resolves.toBeNull();

    await expect(
      requireAuthenticatedActor(appAuth, new Headers()),
    ).rejects.toBeInstanceOf(UnauthenticatedActorError);
  });
});
