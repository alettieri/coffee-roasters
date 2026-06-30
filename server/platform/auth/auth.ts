import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { betterAuth } from 'better-auth';
import { magicLink } from 'better-auth/plugins/magic-link';
import type { H3Event } from 'h3';

import { createDatabaseClient } from '../database/client';
import { schema } from '../database/schema';
import {
  type BetterAuthEnvironment,
  resolveBetterAuthRuntimeConfiguration,
  resolveRuntimeDatabaseConnectionString,
} from '../env';
import { captureMagicLink, type CapturedMagicLink } from './magic-link-capture';
import type { DatabaseClient } from '../database/client';

export interface CreateAppAuthOptions {
  db: Parameters<typeof drizzleAdapter>[0];
  baseURL?: string;
  secret?: string;
  runtimeAuthConfig?: BetterAuthEnvironment;
  sendMagicLink?: (link: CapturedMagicLink) => Promise<void>;
}

export interface AppAuthUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  role: 'coffee_lover' | 'admin' | string;
}

export interface AppAuthSession {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface AppAuthSessionResult {
  user: AppAuthUser;
  session: AppAuthSession;
}

export interface AppAuth {
  handler(request: Request): Promise<Response>;
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

const runtimeAuthCache = new Map<string, AppAuth>();
const runtimeDatabaseClientCache = new Map<string, DatabaseClient>();

function createAuthInstance({
  db,
  baseURL,
  secret,
  runtimeAuthConfig,
  sendMagicLink = async (link) => {
    captureMagicLink(link);
  },
}: CreateAppAuthOptions): AppAuth {
  const resolvedRuntimeAuthConfig =
    runtimeAuthConfig ?? resolveBetterAuthRuntimeConfiguration();

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema,
    }),
    baseURL: baseURL ?? resolvedRuntimeAuthConfig.BETTER_AUTH_URL,
    secret: secret ?? resolvedRuntimeAuthConfig.BETTER_AUTH_SECRET,
    user: {
      additionalFields: {
        role: {
          type: 'string',
          input: false,
          defaultValue: 'coffee_lover',
        },
      },
    },
    plugins: [
      magicLink({
        sendMagicLink: async (data) => {
          await sendMagicLink(data);
        },
      }),
    ],
  });
}

export function createAppAuth(options: CreateAppAuthOptions): AppAuth {
  return createAuthInstance(options);
}

export function getRuntimeAuth(event: H3Event): AppAuth {
  const databaseUrl = resolveRuntimeDatabaseConnectionString(event);
  const runtimeAuthConfig = resolveBetterAuthRuntimeConfiguration(event);
  const cacheKey = `${databaseUrl}::${runtimeAuthConfig.BETTER_AUTH_URL}::${runtimeAuthConfig.BETTER_AUTH_SECRET}`;

  const cachedAuth = runtimeAuthCache.get(cacheKey);
  if (cachedAuth) {
    return cachedAuth;
  }

  const cachedDatabaseClient = runtimeDatabaseClientCache.get(databaseUrl);
  const databaseClient =
    cachedDatabaseClient ??
    createDatabaseClient(databaseUrl, { maxConnections: 1 });

  if (!cachedDatabaseClient) {
    runtimeDatabaseClientCache.set(databaseUrl, databaseClient);
  }

  const auth = createAuthInstance({
    db: databaseClient.db,
    runtimeAuthConfig,
  });

  runtimeAuthCache.set(cacheKey, auth);
  return auth;
}
