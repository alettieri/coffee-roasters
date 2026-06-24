import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';

import { parseServerEnvironment } from '../../server/platform/env';

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
