import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  createDatabaseClient,
  type DatabaseClient,
} from '../../server/platform/database/client';
import { verifyDatabaseConnection } from '../../server/platform/database/health';
import { requireEnvironmentVariable } from '../../scripts/environment/load-env-file';

const testDatabaseUrl = requireEnvironmentVariable('DATABASE_URL');

const deterministicTimestamp = '2026-06-23T12:00:00.000Z';
const deterministicExpiration = '2026-06-30T12:00:00.000Z';

function requireDatabaseClient(
  client: DatabaseClient | undefined,
): DatabaseClient {
  if (!client) {
    throw new Error('Database integration test client was not initialized');
  }

  return client;
}

async function getTableColumns(
  databaseClient: DatabaseClient,
  tableName: string,
): Promise<string[]> {
  const rows = await databaseClient.db.execute<{ column_name: string }>(sql`
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = ${tableName}
    order by ordinal_position
  `);

  return rows.map((row) => row.column_name);
}

describe('Better Auth PostgreSQL schema', () => {
  let client: DatabaseClient | undefined;

  beforeAll(async () => {
    client = createDatabaseClient(testDatabaseUrl, { maxConnections: 1 });
  });

  afterAll(async () => {
    if (!client) {
      return;
    }

    await client.close();
  });

  it('exposes the auth tables with the expected columns and defaults the role', async () => {
    const databaseClient = requireDatabaseClient(client);

    await expect(
      verifyDatabaseConnection(databaseClient.db),
    ).resolves.toBeUndefined();

    await expect(getTableColumns(databaseClient, 'user')).resolves.toEqual([
      'id',
      'name',
      'email',
      'emailVerified',
      'image',
      'role',
      'createdAt',
      'updatedAt',
    ]);

    await expect(getTableColumns(databaseClient, 'session')).resolves.toEqual([
      'id',
      'token',
      'expiresAt',
      'userId',
      'ipAddress',
      'userAgent',
      'createdAt',
      'updatedAt',
    ]);

    await expect(getTableColumns(databaseClient, 'account')).resolves.toEqual([
      'id',
      'userId',
      'accountId',
      'providerId',
      'accessToken',
      'refreshToken',
      'idToken',
      'accessTokenExpiresAt',
      'refreshTokenExpiresAt',
      'scope',
      'password',
      'createdAt',
      'updatedAt',
    ]);

    await expect(
      getTableColumns(databaseClient, 'verification'),
    ).resolves.toEqual([
      'id',
      'identifier',
      'value',
      'expiresAt',
      'createdAt',
      'updatedAt',
    ]);

    await databaseClient.db.execute(sql`
      insert into "user" (
        id,
        name,
        email,
        "emailVerified",
        image,
        "createdAt",
        "updatedAt"
      ) values (
        'user_default_role',
        'Default Role Coffee Lover',
        'default-role@example.com',
        false,
        null,
        ${deterministicTimestamp},
        ${deterministicTimestamp}
      )
    `);

    const insertedUsers = await databaseClient.db.execute<{
      email: string;
      role: string;
      emailVerified: boolean;
    }>(sql`
      select email, role, "emailVerified"
      from "user"
      where id = 'user_default_role'
    `);

    expect(insertedUsers).toHaveLength(1);
    expect(insertedUsers[0]).toMatchObject({
      email: 'default-role@example.com',
      role: 'coffee_lover',
      emailVerified: false,
    });
  });

  it('persists auth records and enforces user foreign keys', async () => {
    const databaseClient = requireDatabaseClient(client);

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
        'user_persistence',
        'Persistence Test Coffee Lover',
        'persistence@example.com',
        true,
        null,
        'admin',
        ${deterministicTimestamp},
        ${deterministicTimestamp}
      )
    `);

    await expect(
      databaseClient.db.execute(sql`
        insert into "user" (
          id,
          name,
          email,
          "emailVerified",
          image,
          "createdAt",
          "updatedAt"
        ) values (
          'user_duplicate_email',
          'Duplicate Email Coffee Lover',
          'persistence@example.com',
          false,
          null,
          ${deterministicTimestamp},
          ${deterministicTimestamp}
        )
      `),
    ).rejects.toThrow();

    await expect(
      databaseClient.db.execute(sql`
        insert into session (
          id,
          token,
          "expiresAt",
          "userId",
          "createdAt",
          "updatedAt"
        ) values (
          'session_persistence',
          'session-token-persistence',
          ${deterministicExpiration},
          'missing_user',
          ${deterministicTimestamp},
          ${deterministicTimestamp}
        )
      `),
    ).rejects.toThrow();

    await databaseClient.db.execute(sql`
      insert into session (
        id,
        token,
        "expiresAt",
        "userId",
        "ipAddress",
        "userAgent",
        "createdAt",
        "updatedAt"
      ) values (
        'session_persistence',
        'session-token-persistence',
        ${deterministicExpiration},
        'user_persistence',
        '203.0.113.42',
        'Vitest',
        ${deterministicTimestamp},
        ${deterministicTimestamp}
      )
    `);

    await expect(
      databaseClient.db.execute(sql`
        insert into session (
          id,
          token,
          "expiresAt",
          "userId",
          "createdAt",
          "updatedAt"
        ) values (
          'session_duplicate_token',
          'session-token-persistence',
          ${deterministicExpiration},
          'user_persistence',
          ${deterministicTimestamp},
          ${deterministicTimestamp}
        )
      `),
    ).rejects.toThrow();

    await expect(
      databaseClient.db.execute(sql`
        insert into account (
          id,
          "userId",
          "accountId",
          "providerId",
          "createdAt",
          "updatedAt"
        ) values (
          'account_missing_user',
          'missing_user',
          'missing-provider-account',
          'missing-provider',
          ${deterministicTimestamp},
          ${deterministicTimestamp}
        )
      `),
    ).rejects.toThrow();

    await databaseClient.db.execute(sql`
      insert into account (
        id,
        "userId",
        "accountId",
        "providerId",
        "accessToken",
        "refreshToken",
        "idToken",
        "accessTokenExpiresAt",
        "refreshTokenExpiresAt",
        scope,
        password,
        "createdAt",
        "updatedAt"
      ) values (
        'account_persistence',
        'user_persistence',
        'magic-link-account',
        'magic-link',
        'access-token-value',
        'refresh-token-value',
        'id-token-value',
        ${deterministicExpiration},
        ${deterministicExpiration},
        'read:email',
        null,
        ${deterministicTimestamp},
        ${deterministicTimestamp}
      )
    `);

    await expect(
      databaseClient.db.execute(sql`
        insert into account (
          id,
          "userId",
          "accountId",
          "providerId",
          "createdAt",
          "updatedAt"
        ) values (
          'account_duplicate_provider_pair',
          'user_persistence',
          'magic-link-account',
          'magic-link',
          ${deterministicTimestamp},
          ${deterministicTimestamp}
        )
      `),
    ).rejects.toThrow();

    await databaseClient.db.execute(sql`
      insert into verification (
        id,
        identifier,
        value,
        "expiresAt",
        "createdAt",
        "updatedAt"
      ) values (
        'verification_persistence',
        'persistence@example.com',
        'verification-token-value',
        ${deterministicExpiration},
        ${deterministicTimestamp},
        ${deterministicTimestamp}
      )
    `);

    await expect(
      databaseClient.db.execute(sql`
        insert into verification (
          id,
          identifier,
          value,
          "expiresAt",
          "createdAt",
          "updatedAt"
        ) values (
          'verification_duplicate_identifier_value',
          'persistence@example.com',
          'verification-token-value',
          ${deterministicExpiration},
          ${deterministicTimestamp},
          ${deterministicTimestamp}
        )
      `),
    ).rejects.toThrow();

    const sessionRows = await databaseClient.db.execute(sql`
      select id
      from session
      where "userId" = 'user_persistence'
    `);
    const accountRows = await databaseClient.db.execute(sql`
      select id
      from account
      where "userId" = 'user_persistence'
    `);
    const verificationRows = await databaseClient.db.execute(sql`
      select id
      from verification
      where identifier = 'persistence@example.com'
    `);

    expect(sessionRows).toHaveLength(1);
    expect(accountRows).toHaveLength(1);
    expect(verificationRows).toHaveLength(1);

    await databaseClient.db.execute(sql`
      delete from "user"
      where id = 'user_persistence'
    `);

    const remainingSessions = await databaseClient.db.execute(sql`
      select id
      from session
      where "userId" = 'user_persistence'
    `);
    const remainingAccounts = await databaseClient.db.execute(sql`
      select id
      from account
      where "userId" = 'user_persistence'
    `);
    const remainingVerifications = await databaseClient.db.execute(sql`
      select id
      from verification
      where identifier = 'persistence@example.com'
    `);

    expect(remainingSessions).toHaveLength(0);
    expect(remainingAccounts).toHaveLength(0);
    expect(remainingVerifications).toHaveLength(1);
  });
});
