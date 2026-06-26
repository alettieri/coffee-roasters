import { afterEach, describe, expect, it, vi } from 'vitest';

describe('runtime environment validation plugin', () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it('initializes without requiring DATABASE_URL at Nitro startup', async () => {
    const previousDatabaseUrl = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;

    const defineNitroPlugin = vi.fn((initializer: () => void) => initializer);
    vi.stubGlobal('defineNitroPlugin', defineNitroPlugin);

    try {
      const plugin = (await import('../../server/plugins/validate-runtime-env'))
        .default;

      expect(defineNitroPlugin).toHaveBeenCalledOnce();
      expect(() => plugin()).not.toThrow();
    } finally {
      if (previousDatabaseUrl === undefined) {
        delete process.env.DATABASE_URL;
      } else {
        process.env.DATABASE_URL = previousDatabaseUrl;
      }
    }
  });
});
