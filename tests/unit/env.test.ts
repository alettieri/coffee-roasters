import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';

import {
  parseBetterAuthEnvironment,
  parseServerEnvironment,
  resolveBetterAuthRuntimeConfiguration,
  resolveProductionDatabaseConnectionString,
  resolveRuntimeDatabaseConnectionString,
} from '../../server/platform/env';

function databaseUrl(protocol: 'postgres' | 'postgresql' | 'https'): string {
  return `${protocol}://user:password@localhost:5432/app`;
}

describe('server environment validation', () => {
  it('accepts postgres connection URLs', () => {
    const postgresUrl = databaseUrl('postgres');
    const postgresqlUrl = databaseUrl('postgresql');

    expect(
      parseServerEnvironment({
        DATABASE_URL: postgresUrl,
      }),
    ).toEqual({
      DATABASE_URL: postgresUrl,
    });

    expect(
      parseServerEnvironment({
        DATABASE_URL: postgresqlUrl,
      }),
    ).toEqual({
      DATABASE_URL: postgresqlUrl,
    });
  });

  it.each([
    ['missing DATABASE_URL', {}],
    ['empty DATABASE_URL', { DATABASE_URL: '' }],
    ['non-URL DATABASE_URL', { DATABASE_URL: 'localhost:5432/app' }],
    ['non-Postgres DATABASE_URL', { DATABASE_URL: databaseUrl('https') }],
  ])('rejects %s', (_caseName, source) => {
    expect(() => parseServerEnvironment(source)).toThrow(ZodError);
  });
});

describe('better auth environment validation', () => {
  it('accepts the runtime auth url and secret when they are configured', () => {
    expect(
      parseBetterAuthEnvironment({
        BETTER_AUTH_URL: 'http://localhost:3000',
        BETTER_AUTH_SECRET:
          'coffee-roasters-local-test-better-auth-secret-32-plus',
      }),
    ).toEqual({
      BETTER_AUTH_URL: 'http://localhost:3000',
      BETTER_AUTH_SECRET:
        'coffee-roasters-local-test-better-auth-secret-32-plus',
    });
  });

  it.each([
    [
      'missing BETTER_AUTH_URL',
      {
        BETTER_AUTH_SECRET:
          'coffee-roasters-local-test-better-auth-secret-32-plus',
      },
    ],
    [
      'missing BETTER_AUTH_SECRET',
      { BETTER_AUTH_URL: 'http://localhost:3000' },
    ],
    [
      'short BETTER_AUTH_SECRET',
      {
        BETTER_AUTH_URL: 'http://localhost:3000',
        BETTER_AUTH_SECRET: 'short-secret',
      },
    ],
  ])('rejects %s', (_caseName, source) => {
    expect(() => parseBetterAuthEnvironment(source)).toThrow();
  });

  it('resolves the validated Better Auth runtime configuration', () => {
    expect(
      resolveBetterAuthRuntimeConfiguration(undefined, {
        BETTER_AUTH_URL: 'http://localhost:3000',
        BETTER_AUTH_SECRET:
          'coffee-roasters-local-test-better-auth-secret-32-plus',
      }),
    ).toEqual({
      BETTER_AUTH_URL: 'http://localhost:3000',
      BETTER_AUTH_SECRET:
        'coffee-roasters-local-test-better-auth-secret-32-plus',
    });
  });

  it('prefers Cloudflare runtime auth bindings when process.env is missing the Better Auth configuration', () => {
    expect(
      resolveBetterAuthRuntimeConfiguration(
        {
          context: {
            _platform: {
              cloudflare: {
                env: {
                  BETTER_AUTH_URL: 'https://example.com',
                  BETTER_AUTH_SECRET:
                    'cloudflare-runtime-better-auth-secret-32-plus',
                },
              },
            },
          },
        },
        {},
      ),
    ).toEqual({
      BETTER_AUTH_URL: 'https://example.com',
      BETTER_AUTH_SECRET: 'cloudflare-runtime-better-auth-secret-32-plus',
    });
  });

  it('does not fall back to process.env for production Cloudflare runtime auth bindings', () => {
    expect(() =>
      resolveBetterAuthRuntimeConfiguration(
        {
          context: {
            _platform: {
              cloudflare: {
                env: {
                  APP_ENV: 'production',
                },
              },
            },
          },
        },
        {
          BETTER_AUTH_URL: 'http://localhost:3000',
          BETTER_AUTH_SECRET:
            'coffee-roasters-local-test-better-auth-secret-32-plus',
        },
      ),
    ).toThrow(
      'Cloudflare Pages production runtime requires the BETTER_AUTH_URL and BETTER_AUTH_SECRET bindings.',
    );
  });

  it('uses Cloudflare runtime auth bindings ahead of conflicting process.env values', () => {
    expect(
      resolveBetterAuthRuntimeConfiguration(
        {
          context: {
            _platform: {
              cloudflare: {
                env: {
                  APP_ENV: 'production',
                  BETTER_AUTH_URL: 'https://example.com',
                  BETTER_AUTH_SECRET:
                    'cloudflare-runtime-better-auth-secret-32-plus',
                },
              },
            },
          },
        },
        {
          BETTER_AUTH_URL: 'http://localhost:3000',
          BETTER_AUTH_SECRET:
            'coffee-roasters-local-test-better-auth-secret-32-plus',
        },
      ),
    ).toEqual({
      BETTER_AUTH_URL: 'https://example.com',
      BETTER_AUTH_SECRET: 'cloudflare-runtime-better-auth-secret-32-plus',
    });
  });
});

describe('runtime database connection resolution', () => {
  it('uses DATABASE_URL for local and CI resolution', () => {
    const postgresUrl = databaseUrl('postgres');

    expect(
      resolveRuntimeDatabaseConnectionString(undefined, {
        DATABASE_URL: postgresUrl,
      }),
    ).toBe(postgresUrl);
  });

  it('uses the Cloudflare Pages production Hyperdrive binding when present', () => {
    const postgresUrl = databaseUrl('postgresql');

    expect(
      resolveRuntimeDatabaseConnectionString(
        {
          context: {
            _platform: {
              cloudflare: {
                env: {
                  PRODUCTION_HYPERDRIVE: {
                    connectionString: postgresUrl,
                  },
                },
              },
            },
          },
        },
        {},
      ),
    ).toBe(postgresUrl);
  });

  it('rejects malformed production Hyperdrive bindings', () => {
    expect(() =>
      resolveProductionDatabaseConnectionString({
        PRODUCTION_HYPERDRIVE: {
          connectionString: databaseUrl('https'),
        },
      }),
    ).toThrow(ZodError);
  });

  it('reports a clear missing production Hyperdrive binding error for production runtime', () => {
    expect(() =>
      resolveRuntimeDatabaseConnectionString(
        {
          context: {
            _platform: {
              cloudflare: {
                env: {
                  APP_ENV: 'production',
                },
              },
            },
          },
        },
        {},
      ),
    ).toThrow(
      'Cloudflare Pages production runtime requires the PRODUCTION_HYPERDRIVE binding with a connectionString.',
    );
  });

  it('does not fall back to DATABASE_URL when production Cloudflare runtime bindings are missing production Hyperdrive', () => {
    expect(() =>
      resolveRuntimeDatabaseConnectionString(
        {
          context: {
            _platform: {
              cloudflare: {
                env: {
                  APP_ENV: 'production',
                },
              },
            },
          },
        },
        {
          DATABASE_URL: databaseUrl('postgres'),
        },
      ),
    ).toThrow(
      'Cloudflare Pages production runtime requires the PRODUCTION_HYPERDRIVE binding with a connectionString.',
    );
  });

  it('uses DATABASE_URL for non-production Cloudflare local emulation without production Hyperdrive', () => {
    const postgresUrl = databaseUrl('postgres');

    expect(
      resolveRuntimeDatabaseConnectionString(
        {
          context: {
            _platform: {
              cloudflare: {
                env: {
                  APP_ENV: 'local',
                },
              },
            },
          },
        },
        {
          DATABASE_URL: postgresUrl,
        },
      ),
    ).toBe(postgresUrl);
  });
});
