import { fileURLToPath } from 'node:url';

import { defineConfig, devices } from '@playwright/test';
import type { ConfigOptions } from '@nuxt/test-utils/playwright';

import {
  loadEnvironmentFile,
  requireEnvironmentVariable,
} from './scripts/environment/load-env-file';

const baseURL = 'http://127.0.0.1:3000';
const skipWebServer = process.env.SKIP_PLAYWRIGHT_WEB_SERVER === '1';

loadEnvironmentFile('.env.test');

const testOnlyCapturedMagicLinksSecret = requireEnvironmentVariable(
  'TEST_ONLY_CAPTURE_SECRET',
);

export default defineConfig<ConfigOptions>({
  testDir: './tests/acceptance',
  fullyParallel: false,
  reporter: 'list',
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL,
        extraHTTPHeaders: testOnlyCapturedMagicLinksSecret
          ? {
              'x-test-only-captured-magic-links-secret':
                testOnlyCapturedMagicLinksSecret,
            }
          : undefined,
        trace: 'on-first-retry',
        nuxt: {
          rootDir: fileURLToPath(new URL('.', import.meta.url)),
          host: baseURL,
        },
      },
    },
  ],
  ...(skipWebServer
    ? {}
    : {
        webServer: {
          command: 'pnpm exec nuxt dev --dotenv=.env.test --port=3000 --host',
          env: {
            DATABASE_URL: process.env.DATABASE_URL,
            MIGRATION_DATABASE_URL: process.env.MIGRATION_DATABASE_URL,
            APP_ENV: 'test',
            TEST_ONLY_CAPTURE_SECRET: testOnlyCapturedMagicLinksSecret,
            NUXT_IGNORE_LOCK: '1',
            HOST: '127.0.0.1',
            PORT: '3000',
          },
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
          url: baseURL,
        },
      }),
});
