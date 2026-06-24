import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';

import { parseServerEnvironment } from '../../server/platform/env';

describe('server environment validation', () => {
  it('accepts postgres connection URLs', () => {
    expect(
      parseServerEnvironment({
        DATABASE_URL: 'postgres://user:password@localhost:5432/app',
      }),
    ).toEqual({
      DATABASE_URL: 'postgres://user:password@localhost:5432/app',
    });

    expect(
      parseServerEnvironment({
        DATABASE_URL: 'postgresql://user:password@localhost:5432/app',
      }),
    ).toEqual({
      DATABASE_URL: 'postgresql://user:password@localhost:5432/app',
    });
  });

  it.each([
    ['missing DATABASE_URL', {}],
    ['empty DATABASE_URL', { DATABASE_URL: '' }],
    ['non-URL DATABASE_URL', { DATABASE_URL: 'localhost:5432/app' }],
    ['non-Postgres DATABASE_URL', { DATABASE_URL: 'https://localhost/app' }],
  ])('rejects %s', (_caseName, source) => {
    expect(() => parseServerEnvironment(source)).toThrow(ZodError);
  });
});
